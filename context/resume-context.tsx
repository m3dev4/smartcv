'use client';

import type { ResumeTemplateProps } from '@/types/resumeTypes';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { mockResume } from '@/constants';
import { ResumeTemplateType } from '@/enums/resumeEnum';
import { updateResume as updateResumeApi } from '@/app/api/actions/resume';

// Définir la fonction getResumeById localement si elle n'est pas exportée correctement
async function getResumeById(id: string) {
  try {
    const response = await fetch(`/api/resumes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération du CV:', error);
    return {
      success: false,
      message: 'Une erreur est survenue lors de la récupération du CV',
    };
  }
}

interface ResumeContextType {
  resume: ResumeTemplateProps['resume'] | null;
  updateResume: (updates: Partial<ResumeTemplateProps['resume']>) => void;
  isLoading: boolean | null;
  templateType: string | null;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  isPreviewMode: boolean;
  togglePreviewMode: () => void;
  saveResume: () => Promise<void>;
  isSaving: boolean;
  lastSaved: Date | null;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

interface ResumeProviderProps {
  children: React.ReactNode;
  resumeId?: string;
  templateType?: string;
}

export function ResumeProvider({ children, resumeId, templateType }: ResumeProviderProps) {
  const [resume, setResume] = useState<ResumeTemplateProps['resume'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<Array<ResumeTemplateProps['resume'] | null>>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [originalResume, setOriginalResume] = useState<ResumeTemplateProps['resume'] | null>(null);

  const saveResume = async () => {
    // Vérifications préalables plus robustes
    if (!resume) {
      console.error('DEBUG - Aucune donnée de CV à sauvegarder');
      throw new Error('Aucune donnée de CV à sauvegarder');
    }

    if (!resumeId) {
      console.error('DEBUG - ID du CV manquant - impossible de sauvegarder');
      throw new Error('ID du CV manquant - impossible de sauvegarder');
    }

    // Vérifier que le CV a un ID (pour les CV existants)
    if (!resume.id && !resumeId) {
      console.error('DEBUG - CV non identifié - veuillez rafraîchir la page');
      throw new Error('CV non identifié - veuillez rafraîchir la page');
    }

    try {
      setIsSaving(true);

      // Utiliser l'ID du CV s'il existe, sinon utiliser resumeId
      const cvId = resume.id || resumeId;

      // Créer un FormData pour l'API
      const formData = new FormData();
      formData.append('id', cvId);
      formData.append('title', resume.title || 'Mon CV');
      formData.append('templateId', resume.templateId || 'modern');
      formData.append('themeId', resume.theme?.id || '');
      formData.append('fontId', resume.font?.id || '');

      // Log détaillé de toutes les données avant envoi
      console.log('DEBUG - Données complètes du CV avant envoi :', {
        id: cvId,
        title: resume.title,
        templateId: resume.templateId,
        themeId: resume.theme?.id,
        fontId: resume.font?.id,
        personalInfo: resume.personalInfo,
        experiences: resume.experiences,
        educations: resume.educations,
        skills: resume.skills,
        languages: resume.languages,
        certifications: resume.certifications,
        achievements: resume.achievements,
        projects: resume.projects,
        customSections: resume.customSections,
      });

      // Ajouter les données personnelles et autres sections si nécessaire
      if (resume.personalInfo) {
        console.log('DEBUG - Sauvegarde des informations personnelles:', resume.personalInfo);
        formData.append('personalInfo', JSON.stringify(resume.personalInfo));
      }

      // Sections à sauvegarder
      const sections = [
        'experiences',
        'educations',
        'skills',
        'languages',
        'certifications',
        'achievements',
        'projects',
        'customSections',
      ];

      // Préserver les sections existantes de l'original si elles ne sont pas modifiées
      sections.forEach(section => {
        const sectionKey = section as keyof typeof resume;
        const currentData = resume[sectionKey];

        // Si la section actuelle est vide mais existait dans l'original, utiliser les données originales
        const dataToSave =
          Array.isArray(currentData) &&
          currentData.length === 0 &&
          originalResume &&
          Array.isArray(originalResume[sectionKey]) &&
          (originalResume[sectionKey] as any[]).length > 0
            ? originalResume[sectionKey]
            : currentData;

        if (dataToSave && Array.isArray(dataToSave) && dataToSave.length > 0) {
          console.log(`DEBUG - Sauvegarde de la section ${section}:`, dataToSave);

          // Traitement spécial pour les éducations
          if (section === 'educations') {
            const cleanedEducations = dataToSave.map((edu: any) => {
              // Supprimer le champ 'institutions' s'il existe et utiliser 'institution'
              const { institutions, ...cleanEdu } = edu;
              return {
                ...cleanEdu,
                institution: cleanEdu.institution || institutions || '',
              };
            });

            // Ne garder que les éducations valides
            const validEducations = cleanedEducations.filter(
              (edu: any) => edu.institution && edu.institution.trim() !== ''
            );

            formData.append(section, JSON.stringify(validEducations));
          } else {
            formData.append(section, JSON.stringify(dataToSave));
          }
        } else if (originalResume && originalResume[sectionKey]) {
          // Si la section est vide mais existait dans l'original, envoyer une section vide
          // pour éviter que le backend ne supprime la section
          formData.append(section, JSON.stringify([]));
        }
      });

      // Appeler l'API pour mettre à jour le CV
      const result = await updateResumeApi(formData);

      if (result.success) {
        console.log('DEBUG - CV mis à jour avec succès !', result);
        setLastSaved(new Date());

        // Mettre à jour l'original avec les nouvelles données
        if (result.resume) {
          // Utiliser une conversion de type pour résoudre le problème de typage
          setOriginalResume(prevResume => result.resume as unknown as typeof prevResume);
        }

        return result;
      } else {
        console.error('DEBUG - Erreur lors de la mise à jour du CV:', result.message);
        throw new Error(result.message || 'Erreur inconnue lors de la sauvegarde');
      }
    } catch (error) {
      console.error('DEBUG - Erreur détaillée lors de la sauvegarde:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const zoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 10);
    }
  };

  const zoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 10);
    }
  };

  const togglePreviewMode = () => {
    console.log('Toggle Preview Mode appelé, valeur actuelle:', isPreviewMode);
    setIsPreviewMode(prev => !prev);
  };

  // Convertir le nom du template en enum
  const convertTemplateNameToType = (templateName?: string | null): ResumeTemplateType => {
    if (!templateName) {
      console.warn('Aucun nom de template fourni, utilisation du template moderne par défaut');
      return ResumeTemplateType.MODERN;
    }

    const normalizedName = templateName.toLowerCase();
    switch (normalizedName) {
      case 'classic':
        return ResumeTemplateType.CLASSIC;
      case 'performance':
        return ResumeTemplateType.PERFORMANCE;
      case 'modern':
      default:
        return ResumeTemplateType.MODERN;
    }
  };

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) {
        console.log("Pas d'ID de CV fourni, utilisation des données par défaut");
        const defaultResume: ResumeTemplateProps['resume'] = {
          ...mockResume,
          templateId: (templateType as ResumeTemplateType) || ResumeTemplateType.MODERN,
          educations: mockResume.educations.map(edu => ({
            ...edu,
            institution: edu.institutions || edu.institutions,
          })),
        };
        setResume(defaultResume);
        setOriginalResume(defaultResume);
        setHistory([defaultResume]);
        setCurrentIndex(0);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Chargement du CV avec l'ID:", resumeId);

        // Utiliser la fonction getResumeById pour récupérer le CV
        const result = await getResumeById(resumeId);

        if (result.success && result.resume) {
          const fetchedResume: ResumeTemplateProps['resume'] = {
            ...result.resume,
            // Convertir les données Prisma en format compatible avec ResumeTemplateProps
            templateId: convertTemplateNameToType(
              result.resume.template?.name || result.resume.templateId
            ),
            theme: result.resume.theme
              ? {
                  id: result.resume.theme.id,
                  name: result.resume.theme.name,
                  primary: result.resume.theme.primary,
                  secondary: result.resume.theme.secondary,
                  accent: result.resume.theme.accent,
                  background: result.resume.theme.background,
                  text: result.resume.theme.text,
                }
              : undefined,
            font: result.resume.font
              ? {
                  id: result.resume.font.id,
                  name: result.resume.font.name,
                  category: result.resume.font.category,
                  url: result.resume.font.url,
                }
              : undefined,
          };

          console.log('CV chargé :', fetchedResume);

          // S'assurer que toutes les sections existent, même vides
          const ensuredSections = [
            'experiences',
            'educations',
            'skills',
            'languages',
            'certifications',
            'achievements',
            'projects',
            'customSections',
          ];

          ensuredSections.forEach(section => {
            const sectionKey = section as keyof typeof fetchedResume;
            if (!fetchedResume[sectionKey]) {
              (fetchedResume[sectionKey] as any) = [];
            }
          });

          setResume(fetchedResume);
          setOriginalResume(fetchedResume); // Stocker l'original pour référence
          setHistory([fetchedResume]);
          setCurrentIndex(0);
        } else {
          console.error('Erreur lors du chargement du CV:', result.message);
          // Utiliser les données par défaut en cas d'erreur
          const defaultResume: ResumeTemplateProps['resume'] = {
            ...mockResume,
            templateId: (templateType as ResumeTemplateType) || ResumeTemplateType.MODERN,
            id: resumeId,
            personalInfo: mockResume.personalInfo,
            experiences: [],
            educations: [],
            skills: [],
            languages: [],
            certifications: [],
            achievements: [],
            projects: [],
            customSections: [],
          };
          setResume(defaultResume);
          setOriginalResume(defaultResume);
          setHistory([defaultResume]);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du CV:', error);
        // Utiliser les données par défaut en cas d'erreur
        const defaultResume: ResumeTemplateProps['resume'] = {
          ...mockResume,
          templateId: (templateType as ResumeTemplateType) || ResumeTemplateType.MODERN,
          id: resumeId,
          personalInfo: mockResume.personalInfo,
          experiences: [],
          educations: [],
          skills: [],
          languages: [],
          certifications: [],
          achievements: [],
          projects: [],
          customSections: [],
        };
        setResume(defaultResume);
        setOriginalResume(defaultResume);
        setHistory([defaultResume]);
        setCurrentIndex(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [resumeId, templateType]);

  const updateResume = (updates: Partial<ResumeTemplateProps['resume']>) => {
    setResume(prev => {
      const newResume = prev ? { ...prev, ...updates } : null;

      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(newResume);
      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
      return newResume;
    });
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setResume(history[currentIndex - 1]);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setResume(history[currentIndex + 1]);
    }
  };

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return (
    <ResumeContext.Provider
      value={{
        resume,
        updateResume,
        isLoading,
        templateType: templateType ?? null,
        canRedo,
        canUndo,
        undo,
        redo,
        zoomIn,
        zoomOut,
        zoomLevel,
        isPreviewMode,
        togglePreviewMode,
        saveResume: async () => {
          try {
            await saveResume();
          } catch (error) {
            console.error('Erreur lors de la sauvegarde du CV', error);
          }
        },
        isSaving,
        lastSaved,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}
