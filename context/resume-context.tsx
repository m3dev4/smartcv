'use client';

import type { LinkedInApiResponse, ResumeTemplateProps } from '@/types/resumeTypes';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { mockResume } from '@/constants';
import { ResumeTemplateType } from '@/enums/resumeEnum';
import { updateResume as updateResumeApi } from '@/app/api/actions/resume';
import { createResumeFromLinkedIn } from '@/app/api/actions';
import { getDefaultThemeForTemplate } from '@/utils/template-themes';

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
  createFromLinkedIn: (
    username: string
  ) => Promise<{ success: boolean; message: string; resume?: any }>;
  isCreatingFromLinkedIn: boolean;
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
  const [isCreatingFromLinkedIn, setIsCreatingFromLinkedIn] = useState(false);

  const convertPrismaToResumeTemplate = (prismaResume: any): ResumeTemplateProps['resume'] => {
    const templateName = prismaResume.template?.name || prismaResume.templateId || 'modern';
    const templateId = convertTemplateNameToType(templateName);

    // Obtenir le thème par défaut pour ce template
    const defaultTheme = getDefaultThemeForTemplate(templateName);

    return {
      ...prismaResume,
      templateId,

      // Conversion des informations personnelles
      personalInfo: prismaResume.personalInfo
        ? {
            firstName: prismaResume.personalInfo.firstName,
            lastName: prismaResume.personalInfo.lastName,
            title: prismaResume.personalInfo.title,
            email: prismaResume.personalInfo.email,
            phone: prismaResume.personalInfo.phone,
            website: prismaResume.personalInfo.website,
            location: prismaResume.personalInfo.location,
            description: prismaResume.personalInfo.description,
            photoUrl: prismaResume.personalInfo.photoUrl,
          }
        : undefined,

      // Conversion des expériences
      experiences:
        prismaResume.experiences?.map((exp: any, index: number) => ({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate,
          current: exp.current,
          description: exp.description,
          location: exp.location,
          order: exp.order || index,
        })) || [],

      // Conversion des éducations
      educations:
        prismaResume.educations?.map((edu: any, index: number) => ({
          id: edu.id,
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          startDate: edu.startDate,
          endDate: edu.endDate,
          description: edu.description,
          location: edu.location,
          order: edu.order || index,
        })) || [],

      // Conversion des compétences
      skills:
        prismaResume.skills?.map((skill: any, index: number) => ({
          id: skill.id,
          name: skill.name,
          level: skill.level,
          category: skill.category,
          order: skill.order || index,
        })) || [],

      // Conversion des langues
      languages:
        prismaResume.languages?.map((lang: any, index: number) => ({
          id: lang.id,
          name: lang.name,
          level: lang.level,
          order: lang.order || index,
        })) || [],

      // Conversion des certifications
      certifications:
        prismaResume.certifications?.map((cert: any, index: number) => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          issueDate: cert.issueDate,
          expiryDate: cert.expiryDate,
          credentialId: cert.credentialId,
          credentialUrl: cert.credentialUrl,
          order: cert.order || index,
        })) || [],

      // Conversion des projets
      projects:
        prismaResume.projects?.map((project: any, index: number) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          url: project.url,
          startDate: project.startDate,
          endDate: project.endDate,
          order: project.order || index,
        })) || [],

      // Conversion des réalisations
      achievements:
        prismaResume.achievements?.map((achievement: any, index: number) => ({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          date: achievement.date,
          order: achievement.order || index,
        })) || [],

      // Conversion des loisirs/hobbies
      hobbies:
        prismaResume.hobbies?.map((hobby: any, index: number) => ({
          id: hobby.id,
          name: hobby.name,
          icon: hobby.icon,
          order: hobby.order || index,
        })) || [],

      // Conversion des références
      references:
        prismaResume.references?.map((ref: any, index: number) => ({
          id: ref.id,
          name: ref.name,
          company: ref.company,
          email: ref.email,
          phone: ref.phone,
          relation: ref.relation,
          order: ref.order || index,
        })) || [],

      // Conversion des publications
      publications:
        prismaResume.publications?.map((pub: any, index: number) => ({
          id: pub.id,
          title: pub.title,
          publisher: pub.publisher,
          url: pub.url,
          date: pub.date,
          description: pub.description,
          order: pub.order || index,
        })) || [],

      // Conversion des expériences de bénévolat
      volunteerings:
        prismaResume.volunteerings?.map((vol: any, index: number) => ({
          id: vol.id,
          organization: vol.organization,
          role: vol.role,
          startDate: vol.startDate,
          endDate: vol.endDate,
          description: vol.description,
          order: vol.order || index,
        })) || [],

      // Conversion des prix/récompenses
      awards:
        prismaResume.awards?.map((award: any, index: number) => ({
          id: award.id,
          title: award.title,
          issuer: award.issuer,
          date: award.date,
          description: award.description,
          order: award.order || index,
        })) || [],

      // Conversion des sections personnalisées
      customSections:
        prismaResume.customSections?.map((section: any, index: number) => ({
          id: section.id,
          title: section.title,
          content: section.content,
          order: section.order || index,
        })) || [],

      // Conversion du thème - utiliser le thème de la DB ou le thème par défaut du template
      theme: prismaResume.theme
        ? {
            id: prismaResume.theme.id,
            name: prismaResume.theme.name,
            primary: prismaResume.theme.primary,
            secondary: prismaResume.theme.secondary,
            accent: prismaResume.theme.accent,
            background: prismaResume.theme.background,
            text: prismaResume.theme.text,
          }
        : {
            id: 'default',
            name: defaultTheme.name,
            primary: defaultTheme.primary,
            secondary: defaultTheme.secondary,
            accent: defaultTheme.accent,
            background: defaultTheme.background,
            text: defaultTheme.text,
          },

      // Conversion du template
      template: prismaResume.template
        ? {
            id: prismaResume.template.id,
            name: prismaResume.template.name,
          }
        : undefined,

      // Conversion de la police
      font: prismaResume.font
        ? {
            id: prismaResume.font.id,
            name: prismaResume.font.name,
            category: prismaResume.font.category,
            url: prismaResume.font.url,
          }
        : undefined,
    };
  };

  const createFromLinkedIn = async (username: string) => {
    setIsCreatingFromLinkedIn(true);

    try {
      console.log('🔄 Début de la création du CV depuis LinkedIn pour:', username);

      // Appeler le server action
      const result = await createResumeFromLinkedIn(username);

      if (result.success && result.resume) {
        console.log('✅ CV créé avec succès depuis LinkedIn!', result.resume);

        // Convertir les données Prisma en format ResumeTemplateProps
        const convertedResume = convertPrismaToResumeTemplate(result.resume);

        // Mettre à jour le state
        setResume(convertedResume);
        setOriginalResume(convertedResume);
        setHistory([convertedResume]);
        setCurrentIndex(0);
        setLastSaved(new Date());

        return {
          success: true,
          resume: convertedResume,
          message: result.message,
        };
      } else {
        console.error('❌ Erreur lors de la création du CV:', result.message);
        return {
          success: false,
          message: result.message || 'Erreur lors de la création du CV depuis LinkedIn',
        };
      }
    } catch (error: any) {
      console.error('❌ Erreur inattendue lors de la création du CV:', error);
      return {
        success: false,
        message: error.message || 'Une erreur inattendue est survenue',
      };
    } finally {
      setIsCreatingFromLinkedIn(false);
    }
  };

  const saveResume = async () => {
    // Vérifications préalables plus robustes
    if (!resume) {
      console.error('DEBUG - Aucune donnée de CV à sauvegarder');
      throw new Error('Aucune donnée de CV à sauvegarder');
    }

    if (!resumeId) {
      console.error('DEBUG - ID du CV manquant - impossible de sauvegarder');
      throw new Error('ID du CV manquant');
    }

    setIsSaving(true);

    try {
      // Préparer les données pour l'API
      const formData = new FormData();
      formData.append('id', resumeId);
      formData.append('title', resume.title || '');
      // Utiliser le champ templateId défini dans le contexte (ex: "modern", "classic", etc.)
      formData.append('templateId', (resume as any).templateId || '');
      formData.append('themeId', resume.theme?.id || '');
      // Déterminer identifiant ou nom de police à envoyer
      const fontIdentifier = (resume.font?.id && resume.font.id.startsWith('cm'))
        ? resume.font.id
        : (resume.font?.name || '');
      formData.append('fontId', fontIdentifier);

      // Ajouter les sections
      if (resume.personalInfo) {
        formData.append('personalInfo', JSON.stringify(resume.personalInfo));
      }

      if (resume.experiences && resume.experiences.length > 0) {
        formData.append('experiences', JSON.stringify(resume.experiences));
      }

      if (resume.educations && resume.educations.length > 0) {
        formData.append('educations', JSON.stringify(resume.educations));
      }

      if (resume.skills && resume.skills.length > 0) {
        formData.append('skills', JSON.stringify(resume.skills));
      }

      if (resume.languages && resume.languages.length > 0) {
        formData.append('languages', JSON.stringify(resume.languages));
      }

      if (resume.certifications && resume.certifications.length > 0) {
        formData.append('certifications', JSON.stringify(resume.certifications));
      }

      if (resume.achievements && resume.achievements.length > 0) {
        formData.append('achievements', JSON.stringify(resume.achievements));
      }

      if (resume.projects && resume.projects.length > 0) {
        formData.append('projects', JSON.stringify(resume.projects));
      }

      if (resume.hobbies && resume.hobbies.length > 0) {
        formData.append('hobbies', JSON.stringify(resume.hobbies));
      }

      if (resume.references && resume.references.length > 0) {
        formData.append('references', JSON.stringify(resume.references));
      }

      if (resume.publications && resume.publications.length > 0) {
        formData.append('publications', JSON.stringify(resume.publications));
      }

      if (resume.volunteerings && resume.volunteerings.length > 0) {
        formData.append('volunteerings', JSON.stringify(resume.volunteerings));
      }

      if (resume.awards && resume.awards.length > 0) {
        formData.append('awards', JSON.stringify(resume.awards));
      }

      if (resume.customSections && resume.customSections.length > 0) {
        formData.append('customSections', JSON.stringify(resume.customSections));
      }

      if (resume.theme) {
        formData.append('theme', JSON.stringify(resume.theme));
      }

      // Le fontId a déjà été ajouté plus haut (ligne ~368). Éviter les doublons.

      const result = await updateResumeApi(formData);

      if (result.success) {
        setLastSaved(new Date());
        console.log('✅ CV sauvegardé avec succès');
      } else {
        throw new Error(result.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Suite du fichier avec les autres fonctions existantes...
  // (updateResume, undo, redo, zoomIn, zoomOut, etc.)

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
        return ResumeTemplateType.MODERN;
      case 'clean':
        return ResumeTemplateType.CLEAN;
      case 'multicolumn':
        return ResumeTemplateType.MULTICOLUMN;
      case 'minimalist':
        return ResumeTemplateType.MINIMALIST;
      case 'contemporain':
        return ResumeTemplateType.CONTEMPORAIN;
      case 'compact':
        return ResumeTemplateType.COMPACT;
      case 'mint':
        return ResumeTemplateType.MINT;
      case 'timeline':
        return ResumeTemplateType.TIMELINE;
      case 'stylish':
        return ResumeTemplateType.STYLISH;
      case 'elegant':
        return ResumeTemplateType.ELEGANT;
      case 'executive':
        return ResumeTemplateType.EXECUTIVE;
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
            'hobbies',
            'volunteerings',
            'publications',
            'references',
            'awards',
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
            hobbies: [],
            volunteerings: [],
            references: [],
            awards: [],
            publications: []
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
          hobbies: [],
          references: [],
          publications: [],
          volunteerings: [],
          awards: []
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
      if (!prev) return null;

      // Si le template change ET que ce n'est pas une modification manuelle du thème,
      // mettre à jour le thème correspondant
      let newUpdates = { ...updates };
      if (updates.templateId && !updates.theme) {
        const templateTheme = getDefaultThemeForTemplate(updates.templateId);
        newUpdates = {
          ...newUpdates,
          theme: {
            ...prev.theme,
            ...templateTheme,
            id: prev.theme?.id || 'default',
          },
        };
      }

      const newResume = { ...prev, ...newUpdates };
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
        createFromLinkedIn,
        isCreatingFromLinkedIn,
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