'use server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/utils/auth';
import { calculateResumeProgress } from '@/utils/resumeWithProgress';
import { createResumeValidation, updateResumeValidation } from '@/validations/resumeValidation';
import { clean } from 'better-auth/react';
import { revalidatePath } from 'next/cache';

/**
 * Crée un nouveau Cv pour l'utilisateur connecté
 */

export async function createResume(formData: FormData) {
  const session = await getCurrentUser();

  if (!session) {
    return;
  }
  try {
    const data = {
      title: formData.get('title') as string,
      templateId: formData.get('templateId') as string,
      themeId: formData.get('themeId') as string,
      fontId: formData.get('fontId') as string,
    };
    console.log('Données de création de CV :', data);

    const validatedData = createResumeValidation.parse(data);
    console.log('Données validées :', validatedData);

    // Vérifier l'existence du template
    const template = await prisma.template.findUnique({
      where: { name: validatedData.templateId },
    });
    console.log('Template trouvé :', template);

    if (!template) {
      return {
        success: false,
        message: `Template ${validatedData.templateId} introuvable`,
      };
    }

    // Vérifier ou créer un thème par défaut
    let theme = await prisma.theme.findFirst({
      where: { name: 'default' },
    });

    if (!theme) {
      theme = await prisma.theme.create({
        data: {
          name: 'default',
          description: 'Thème par défaut',
          primary: '#3B82F6', // Bleu par défaut
          secondary: '#10B981', // Vert par défaut
          accent: '#F43F5E', // Rose par défaut
          background: '#FFFFFF', // Blanc par défaut
          text: '#1F2937', // Gris foncé par défaut
          thumbnail: '/themes/default.png', // Chemin d'une miniature par défaut
          isDefault: true,
        },
      });
    }

    // Vérifier ou créer une police par défaut
    let font = await prisma.font.findFirst({
      where: { name: 'default' },
    });

    if (!font) {
      font = await prisma.font.create({
        data: {
          name: 'default',
          category: 'SANS_SERIF', // Catégorie par défaut
          url: 'https://fonts.google.com/specimen/Inter', // URL de la police
          isDefault: true,
        },
      });
    }

    // Recuperation de l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur introuvable',
      };
    }
    const resume = await prisma.resume.create({
      data: {
        title: validatedData.title,
        templateId: template.id, // Utiliser l'ID du template
        themeId: theme.id, // Utiliser l'ID du thème par défaut
        fontId: font.id, // Utiliser l'ID de la police par défaut
        userId: user.id,

        personalInfo: {
          create: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            photoUrl: user.profileImage || '',
          },
        },
      },
      include: {
        personalInfo: true,
      },
    });

    revalidatePath('/resumes');
    return { success: true, resume };
  } catch (error) {
    console.error('Erreur lors de la création du CV :', error);
    return {
      success: false,
      message: 'Une erreur est survenue lors de la création du CV',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Met à jour un CV existant
 */
export async function updateResume(formData: FormData) {
  const session = await getCurrentUser();

  if (!session) {
    return {
      success: false,
      message: 'Utilisateur introuvable',
    };
  }

  try {
    const data = {
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      templateId: formData.get('templateId') as string,
      themeId: formData.get('themeId') as string,
      fontId: formData.get('fontId') as string,
    };
    console.log('Données de mise à jour de CV :', data);

    const validatedData = updateResumeValidation.parse(data);
    console.log('Données validées :', validatedData);

    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur introuvable',
      };
    }

    // Vérifier l'existence du template
    const template = await prisma.template.findUnique({
      where: { name: validatedData.templateId },
    });
    console.log('Template trouvé :', template);

    if (!template) {
      return {
        success: false,
        message: `Template ${validatedData.templateId} introuvable`,
      };
    }

    // Vérifier ou créer un thème par défaut
    let theme;
    if (formData.get('theme')) {
      try {
        const themeData = JSON.parse(formData.get('theme') as string);
        console.log('Données de thème reçues :', themeData);

        theme = await prisma.theme.upsert({
          where: {
            id: themeData.id || 'non-existent-id',
          },
          update: {
            primary: themeData.primary || '#3B82F6',
            secondary: themeData.secondary || '#10B981',
            accent: themeData.accent || '#F43F5E',
            background: themeData.background || '#FFFFFF',
            text: themeData.text || '#1F2937',
            name: themeData.name || `Theme-${Date.now()}`,
          },
          create: {
            primary: themeData.primary || '#3B82F6',
            secondary: themeData.secondary || '#10B981',
            accent: themeData.accent || '#F43F5E',
            background: themeData.background || '#FFFFFF',
            text: themeData.text || '#1F2937',
            name: themeData.name || `Theme-${Date.now()}`,
            isDefault: false,
          },
        });
      } catch (error) {
        console.error('Erreur lors du parsing des données de thème :', error);
        // Fallback au thème par défaut
        theme = await prisma.theme.findFirst({
          where: { name: 'default' },
        });

        if (!theme) {
          theme = await prisma.theme.create({
            data: {
              name: 'default',
              description: 'Thème par défaut',
              primary: '#3B82F6',
              secondary: '#10B981',
              accent: '#F43F5E',
              background: '#FFFFFF',
              text: '#1F2937',
              thumbnail: '/themes/default.png',
              isDefault: true,
            },
          });
        }
      }
    } else {
      // Fallback au thème par défaut si aucune donnée n'est fournie
      theme = await prisma.theme.findFirst({
        where: { name: 'default' },
      });

      if (!theme) {
        theme = await prisma.theme.create({
          data: {
            name: 'default',
            description: 'Thème par défaut',
            primary: '#3B82F6',
            secondary: '#10B981',
            accent: '#F43F5E',
            background: '#FFFFFF',
            text: '#1F2937',
            thumbnail: '/themes/default.png',
            isDefault: true,
          },
        });
      }
    }

    // Vérifier ou créer une police par défaut
    let font = await prisma.font.findFirst({
      where: { name: 'default' },
    });

    if (!font) {
      font = await prisma.font.create({
        data: {
          name: 'default',
          category: 'SANS_SERIF', // Catégorie par défaut
          url: 'https://fonts.google.com/specimen/Inter', // URL de la police
          isDefault: true,
        },
      });
    }

    const existingResume = await prisma.resume.findUnique({
      where: { id: validatedData.id },
      include: {
        personalInfo: true,
        experiences: true,
        educations: true,
        skills: true,
        languages: true,
        certifications: true,
        achievements: true,
        projects: true,
        customSections: true,
      },
    });

    // Vérifier que si le CV existe, il appartient bien à l'utilisateur actuel
    if (existingResume && existingResume.userId !== user.id) {
      return {
        success: false,
        message: 'Accès non autorisé à ce CV.',
      };
    }

    // Extraire les données des sections du formulaire
    const personalInfo = formData.get('personalInfo');
    const experiences = formData.get('experiences');
    const educations = formData.get('educations');
    const skills = formData.get('skills');
    const languages = formData.get('languages');
    const certifications = formData.get('certifications');
    const achievements = formData.get('achievements');
    const projects = formData.get('projects');
    const customSections = formData.get('customSections');

    // Construire l'objet de données commun pour la création et la mise à jour
    const resumeData: any = {
      title: validatedData.title,
      templateId: template.id,
      themeId: theme.id,
      fontId: font.id,
    };

    // Gestion des informations personnelles
    if (personalInfo) {
      const data = JSON.parse(personalInfo as string);
      const { resumeId, ...cleanData } = data;
      resumeData.personalInfo = existingResume ? { update: cleanData } : { create: cleanData };
    }

    // Sections à traiter
    const sections: { [key: string]: FormDataEntryValue | null } = {
      experiences,
      educations,
      skills,
      languages,
      certifications,
      achievements,
      projects,
      customSections,
    };

    // Transformation des dates pour s'assurer du format ISO-8601
    const transformDate = (dateString: string | undefined) => {
      if (!dateString) return undefined;

      // Gérer les formats spécifiques comme "janv. 2022"
      const monthMap: { [key: string]: string } = {
        'janv.': '01',
        'fev.': '02',
        mars: '03',
        'avr.': '04',
        mai: '05',
        juin: '06',
        'juil.': '07',
        août: '08',
        'sept.': '09',
        'oct.': '10',
        'nov.': '11',
        'déc.': '12',
      };

      // Vérifier si c'est un format mois abrégé + année
      const monthYearMatch = dateString.match(/^([a-zA-Z]{3,})\.?\s*(\d{4})$/);
      if (monthYearMatch) {
        const [, month, year] = monthYearMatch;
        const mappedMonth = monthMap[month.toLowerCase()] || '01';
        dateString = `${year}-${mappedMonth}-01`;
      }

      // Essayer de parser la date et la convertir en ISO-8601
      const date = new Date(dateString);

      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        console.warn(`Date invalide : ${dateString}`);
        return undefined;
      }

      return date.toISOString();
    };

    // Fonction pour valider et nettoyer le niveau
    const validateLevel = (level: any): number => {
      if (typeof level === 'string') {
        const numLevel = Number.parseInt(level, 10);
        if (!isNaN(numLevel)) {
          return Math.max(1, Math.min(100, numLevel)); // Limiter entre 1 et 100
        }
      }

      if (typeof level === 'number') {
        return Math.max(1, Math.min(100, level)); // Limiter entre 1 et 100
      }

      return 1;
    };

    // Sections à traiter avec des dates
    const sectionsWithDates = [
      'experiences',
      'educations',
      'certifications',
      'achievements',
      'projects',
    ];

    // Traitement dynamique des sections
    for (const [sectionName, sectionData] of Object.entries(sections)) {
      if (sectionData) {
        try {
          const parsedData = JSON.parse(sectionData as string) as any[];

          console.log(`DEBUG - Traitement de la section ${sectionName}:`, parsedData);

          // Si la section est vide et qu'il existe des données dans le CV existant,
          // ne pas écraser les données existantes
          if (
            parsedData.length === 0 &&
            existingResume &&
            existingResume[sectionName as keyof typeof existingResume]
          ) {
            const existingData = existingResume[sectionName as keyof typeof existingResume];
            if (Array.isArray(existingData) && existingData.length > 0) {
              console.log(`Préservation des données existantes pour la section ${sectionName}`);
              continue;
            }
          }

          // Nettoyage et transformation des données
          const cleanedData = parsedData.map((item, index) => {
            const { resumeId, id, ...cleanItem } = item;

            console.log(
              `DEBUG - Traitement de l'élément ${index + 1} de ${sectionName}:`,
              cleanItem
            );

            // Correction du champ institutions
            if (sectionName === 'educations' && cleanItem.institutions) {
              cleanItem.institution = cleanItem.institution || cleanItem.institutions;
              delete cleanItem.institutions;
            }

            // Validation et conversion des niveaux pour skills et languages
            if (sectionName === 'skills') {
              const cleanedData = parsedData.map((item, index) => {
                const { resumeId, id, ...cleanItem } = item;
            
                // Validation explicite du niveau
                if (cleanItem.hasOwnProperty('level')) {
                  const validatedLevel = validateLevel(cleanItem.level);
                  cleanItem.level = validatedLevel;
                  console.log(
                    `DEBUG - Niveau de compétence validé: ${cleanItem.name} = ${cleanItem.level}`
                  );
                } else {
                  cleanItem.level = 1;
                }
            
                return cleanItem;
              });
            
              // Ajouter les données nettoyées au resumeData
              if (existingResume) {
                resumeData[sectionName] = {
                  deleteMany: { resumeId: existingResume.id },
                  create: cleanedData,
                };
              } else {
                resumeData[sectionName] = {
                  create: cleanedData,
                };
              }
            }

            if (sectionName === 'languages') {
              const cleanedData = parsedData.map(item => {
                const { resumeId, id, ...cleanItem } = item;
            
                // Mapping des niveaux avec une validation plus robuste
                const languageLevelMap: Record<string, string> = {
                  '1': 'BEGINNER',
                  '2': 'INTERMEDIATE',
                  '3': 'ADVANCED',
                  '4': 'FLUENT',
                  '5': 'NATIVE',
                  'BEGINNER': 'BEGINNER',
                  'INTERMEDIATE': 'INTERMEDIATE', 
                  'ADVANCED': 'ADVANCED',
                  'FLUENT': 'FLUENT',
                  'NATIVE': 'NATIVE'
                };
            
                // Conversion et validation du niveau
                if (cleanItem.level !== undefined && cleanItem.level !== null) {
                  // Convertir en chaîne pour la comparaison
                  const levelStr = String(cleanItem.level).toUpperCase();
                  
                  // Utiliser le mapping ou fallback sur BEGINNER
                  cleanItem.level = languageLevelMap[levelStr] || 'BEGINNER';
                } else {
                  cleanItem.level = 'BEGINNER';
                }
            
                // Ajouter des logs de débogage
                console.log(`Langue traitée: ${cleanItem.name}, Niveau: ${cleanItem.level}`);
            
                return cleanItem;
              });
            
              // Modification pour CV existant
              if (existingResume) {
                resumeData[sectionName] = {
                  deleteMany: { resumeId: existingResume.id },
                  create: cleanedData,
                };
              } else {
                resumeData[sectionName] = {
                  create: cleanedData,
                };
              }
            }

            // Transformation des dates pour les sections concernées
            if (sectionsWithDates.includes(sectionName)) {
              if (cleanItem.startDate) {
                cleanItem.startDate = transformDate(cleanItem.startDate);
              }
              if (cleanItem.endDate) {
                cleanItem.endDate = transformDate(cleanItem.endDate);
              }
              if (cleanItem.issueDate) {
                cleanItem.issueDate = transformDate(cleanItem.issueDate);
              }
              if (cleanItem.expiryDate) {
                cleanItem.expiryDate = transformDate(cleanItem.expiryDate);
              }
              if (cleanItem.date) {
                cleanItem.date = transformDate(cleanItem.date);
              }
            }

            return cleanItem;
          });

          // Filtrer les données invalides
          let validData = cleanedData;
          if (sectionName === 'educations') {
            validData = cleanedData.filter(
              item => item.institution && item.institution.trim() !== ''
            );
          } else if (sectionName === 'skills' || sectionName === 'languages') {
            validData = cleanedData.filter(item => {
              const hasName = item.name && item.name.trim() !== '';
              const hasValidLevel =
                item.level && typeof item.level === 'number' && item.level >= 1 && item.level <= 5;

              if (!hasName) {
                console.warn(`${sectionName} sans nom détecté:`, item);
              }
              if (!hasValidLevel) {
                console.warn(`${sectionName} avec niveau invalide détecté:`, item);
              }

              return hasName && hasValidLevel;
            });
          }

          console.log(`DEBUG - Données validées pour ${sectionName}:`, validData);

          // Définir la stratégie de mise à jour pour cette section
          if (existingResume && validData.length > 0) {
            // Pour un CV existant, supprimer les anciennes données et créer les nouvelles
            resumeData[sectionName] = {
              deleteMany: {}, // Supprimer toutes les entrées existantes
              create: validData, // Créer les nouvelles entrées
            };
          } else if (!existingResume && validData.length > 0) {
            // Pour un nouveau CV, simplement créer les données
            resumeData[sectionName] = {
              create: validData,
            };
          }
          // Si validData est vide, ne pas inclure la section dans resumeData
          // pour éviter de supprimer les données existantes
        } catch (error) {
          console.error(`Erreur lors du traitement de la section ${sectionName}:`, error);
        }
      }
    }

    console.log('DEBUG - Données complètes à sauvegarder :', resumeData);

    let savedResume;
    if (existingResume) {
      // Mettre à jour le CV existant
      savedResume = await prisma.resume.update({
        where: { id: validatedData.id },
        data: resumeData,
        include: {
          template: true,
          theme: true,
          font: true,
          personalInfo: true,
          experiences: { orderBy: { order: 'asc' } },
          educations: { orderBy: { order: 'asc' } },
          skills: { orderBy: { order: 'asc' } },
          languages: { orderBy: { order: 'asc' } },
          achievements: { orderBy: { order: 'asc' } },
          projects: { orderBy: { order: 'asc' } },
          certifications: { orderBy: { order: 'asc' } },
          customSections: { orderBy: { order: 'asc' } },
        },
      });
    } else {
      // Créer un nouveau CV
      savedResume = await prisma.resume.create({
        data: {
          ...resumeData,
          id: validatedData.id,
          userId: user.id,
        },
        include: {
          template: true,
          theme: true,
          font: true,
          personalInfo: true,
          experiences: { orderBy: { order: 'asc' } },
          educations: { orderBy: { order: 'asc' } },
          skills: { orderBy: { order: 'asc' } },
          languages: { orderBy: { order: 'asc' } },
          achievements: { orderBy: { order: 'asc' } },
          projects: { orderBy: { order: 'asc' } },
          certifications: { orderBy: { order: 'asc' } },
          customSections: { orderBy: { order: 'asc' } },
        },
      });
    }

    console.log('CV sauvegardé :', savedResume);

    revalidatePath('/dashboard/resumes');
    revalidatePath(`/editor/${validatedData.id}`);
    return {
      success: true,
      resume: savedResume,
    };
  } catch (error: any) {
    console.error('Erreur détaillée dans updateResume:', error);
    return {
      success: false,
      message: 'Une erreur est survenue lors de la mise à jour du CV',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Récupère un CV par son ID
 */
export async function getResumeById(id: string) {
  const session = await getCurrentUser();

  if (!session) {
    return {
      success: false,
      message: 'Utilisateur introuvable',
    };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur introuvable',
      };
    }

    const resume = await prisma.resume.findUnique({
      where: { id, userId: user.id },
      include: {
        personalInfo: true,
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        languages: { orderBy: { order: 'asc' } },
        certifications: { orderBy: { order: 'asc' } },
        achievements: { orderBy: { order: 'asc' } },
        projects: { orderBy: { order: 'asc' } },
        customSections: { orderBy: { order: 'asc' } },
        theme: true,
        font: true,
        template: true,
      },
    });

    if (!resume) {
      return {
        success: false,
        message: 'CV introuvable',
      };
    }

    console.log('Détails du CV récupéré:', resume);

    return {
      success: true,
      resume,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur est survenue lors de la récupération du CV',
    };
  }
}

/**
 * Supprimer un CV
 */

export async function deleteResume(id: string) {
  const session = await getCurrentUser();

  if (!session) {
    return {
      success: false,
      message: 'Utilisateur introuvable',
    };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur introuvable',
      };
    }

    const existingResume = await prisma.resume.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!existingResume) {
      return {
        success: false,
        message: 'CV introuvable',
      };
    }
    await prisma.resume.delete({
      where: { id },
    });
    revalidatePath('/resumes');
    return {
      success: true,
      message: 'CV supprimé avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur est survenue lors de la suppression du CV',
    };
  }
}

/**
 * Recupere la liste des CV de l'utilisateur
 */
export async function listResume(options?: { includePartial?: boolean }) {
  const session = await getCurrentUser();

  if (!session) {
    return {
      success: false,
      message: 'Utilisateur introuvable',
    };
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.email,
      },
    });
    if (!user) {
      return {
        success: false,
        error: 'Utilisateur introuvable',
      };
    }

    const whereCondition: any = {
      userId: user.id,
    };

    if (options?.includePartial) {
      whereCondition.OR = [
        { personalInfo: { none: {} } },
        {
          AND: [
            { experiences: { none: {} } },
            { educations: { none: {} } },
            { skills: { none: {} } },
          ],
        },
      ];
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        personalInfo: true,
        theme: true,
        font: true,
        experiences: { take: 1 },
        educations: { take: 1 },
        skills: { take: 1 },
        languages: { take: 1 },
        certifications: { take: 1 },
        achievements: { take: 1 },
      },
    });

    const resumesWithProgress = resumes.map(resume => ({
      ...resume,
      progress: calculateResumeProgress(resume),
    }));

    return {
      success: true,
      resumes: resumesWithProgress,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur est survenue lors de la récupération des CV',
    };
  }
}

/**
 * Dupliquer un CV
 */

export async function duplicateResume(id: string) {
  const session = await getCurrentUser();

  if (!session) {
    return {
      success: false,
      message: 'Utilisateur introuvable',
    };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur introuvable',
      };
    }
    const existingResume = await prisma.resume.findUnique({
      where: { id, userId: user.id },
      include: {
        personalInfo: true,
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        languages: { orderBy: { order: 'asc' } },
        certifications: { orderBy: { order: 'asc' } },
        achievements: { orderBy: { order: 'asc' } },
      },
    });
    if (!existingResume) {
      return {
        success: false,
        message: 'CV introuvable',
      };
    }

    const newResume = await prisma.resume.create({
      data: {
        title: `${existingResume.title} (copie)`,
        templateId: existingResume.templateId,
        themeId: existingResume.themeId,
        fontId: existingResume.fontId,
        userId: user.id,
        personalInfo: {
          create: {
            firstName: existingResume.personalInfo?.firstName || '',
            lastName: existingResume.personalInfo?.lastName || '',
            email: existingResume.personalInfo?.email || '',
            phone: existingResume.personalInfo?.phone || '',
            website: existingResume.personalInfo?.website || '',
            location: existingResume.personalInfo?.location || '',
            photoUrl: existingResume.personalInfo?.photoUrl || '',
          },
        },

        experiences: {
          create: existingResume.experiences.map(experience => ({
            position: experience.position,
            company: experience.company,
            location: experience.location,
            startDate: experience.startDate,
            endDate: experience.endDate,
            description: experience.description,
            order: experience.order,
            current: experience.current,
          })),
        },
        educations: {
          create: existingResume.educations.map(education => ({
            institution: education.institution,
            degree: education.degree,
            startDate: education.startDate,
            endDate: education.endDate,
            description: education.description,
            order: education.order,
            fieldOfStudy: education.fieldOfStudy,
            location: education.location,
          })),
        },
        skills: {
          create: existingResume.skills.map(skill => ({
            name: skill.name,
            order: skill.order,
            level: skill.level,
            category: skill.category,
          })),
        },
        languages: {
          create: existingResume.languages.map(language => ({
            name: language.name,
            level: language.level,
            order: language.order,
          })),
        },
        certifications: {
          create: existingResume.certifications.map(certification => ({
            name: certification.name,
            issueDate: certification.issueDate,
            expiryDate: certification.expiryDate,
            issuer: certification.issuer,
            order: certification.order,
            credentialId: certification.credentialId,
            credentialUrl: certification.credentialUrl,
          })),
        },
        achievements: {
          create: existingResume.achievements.map(achievement => ({
            title: achievement.title,
            description: achievement.description,
            date: achievement.date,
            order: achievement.order,
          })),
        },
      },
    });
    revalidatePath('/resumes');
    return {
      success: true,
      message: 'CV dupliqué avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur est survenue lors de la duplication du CV',
    };
  }
}
