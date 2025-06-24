'use server';

import { PrismaClient } from '@/lib/generated/prisma';
import { LinkedInApiResponse } from '@/types/resumeTypes';
import { getCurrentUser } from '@/utils/auth';
import { linkedInDateToDate, linkedInDateToDateWithFallback } from '@/utils/iso-date-utils';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

/**
 * Appel à l'API LinkedIn via RapidApi
 * Declaration du fonction fetchLinkedInProfile qui serve à récupérer les informations d'un utilisateur LinkedIn
 */
async function fetchLinkedInProfile(username: string): Promise<LinkedInApiResponse> {
  const rapidApiKey = process.env.NEXT_PUBLIC_RAPID_API_LINKEDIN_KEY;
  const rapidApiHost = process.env.NEXT_PUBLIC_RAPID_API_LINKEDIN_HOST;

  if (!rapidApiKey || !rapidApiHost) {
    throw new Error('Erreur lors de la récupération des clés API');
  }
  const url = `https://linkedin-data-api.p.rapidapi.com/?username=${username}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': rapidApiHost,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Réponse d'erreur:", errorText);
    throw new Error(`Erreur API LinkedIn ${response.status} ${response.statusText}: ${errorText}`);
  }

  const data = await response.json();
  console.log('Données reçues:', JSON.stringify(data, null, 2));

  // Vérifier et formater les données selon l'interface LinkedInApiResponse
  return {
    success: true,
    data: {
      urn: data.urn || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      headline: data.headline || '',
      summury: data.summary || '',
      username: username,
      profilePicture: data.profilePicture || '',
      country: data.country || '',
      city: data.city || '',
      experiences:
        data.experiences?.map((exp: any) => ({
          companyId: exp.companyId,
          companyName: exp.companyName || '',
          title: exp.title || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          description: exp.description || '',
          location: exp.location || '',
        })) || [],
      educations:
        data.educations?.map((edu: any) => ({
          schoolName: edu.schoolName || '',
          degree: edu.degree || '',
          fieldOfStudy: edu.fieldOfStudy || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
        })) || [],
      skills:
        data.skills?.map((skill: any) => ({
          name: skill.name || '',
          endorsementsCount: skill.endorsementsCount || '',
          passedAssement: skill.passedAssement || '',
        })) || [],
      certfications:
        data.certifications?.map((cert: any) => ({
          name: cert.name || '',
          isssuing_organization: cert.issuingOrganization || '',
        })) || [],
    },
  };
}

/**
 * Crée un CV à partir des données LinkedIn
 */
export async function createResumeFromLinkedIn(username: string) {
  const session = await getCurrentUser();

  if (!session?.email) {
    throw new Error('Vous devez vous conncter pour creer un CV');
  }

  try {
    console.log("🔄 Début de l'extraction LinkedIn pour: ", username);

    // 1_ Récupérer l'utilisateur actuel
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur introuvable',
      };
    }

    // 2_ Appeler l'API LinkedIN
    console.log("📡 Appel de l'api linkedin...");
    const linkedInData = await fetchLinkedInProfile(username);

    if (!linkedInData.success || !linkedInData.data) {
      return {
        success: false,
        message: 'Impossible de récupérer les données LinkedIn.😮',
      };
    }

    const profileData = linkedInData.data;
    console.log('✅ Données LinkedIn récupérées avec success!', {
      name: `${profileData.firstName} ${profileData.lastName}`,
      title: profileData.headline,
      educations: profileData.educations?.length || 0,
      experiences: profileData.experiences?.length || 0,
      skills: profileData.skills?.length || 0,
      certifications: profileData.certfications?.length || 0,
    });

    // 3_ Récuperer ou créér les entités (thémes, font, template)
    let theme = await prisma.theme.findUnique({
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
          background: '#FFFFF',
          text: '#1F2937',
          isDefault: true,
        },
      });
    }

    let font = await prisma.font.findUnique({
      where: { name: 'default' },
    });

    if (!font) {
      font = await prisma.font.create({
        data: {
          name: 'default',
          category: 'SANS_SERIF',
          url: 'https://fonts.google.com/specimen/Inter',
          isDefault: true,
        },
      });
    }

    // Rechercher d'abord un template par défaut, puis chercher 'clean' si le défaut n'existe pas
    let template = await prisma.template.findUnique({
      where: { name: 'clean' },
    });

    // Si le template par défaut n'existe pas, chercher le template 'clean'
    if (!template) {
      template = await prisma.template.findUnique({
        where: { name: 'clean' },
      });

      // Si aucun des deux n'existe, créer le template 'clean'
      if (!template) {
        template = await prisma.template.create({
          data: {
            name: 'clean',
            description: 'Template Clean',
          },
        });
      }
    }

    // 4_ Créer le CV
    console.log('💾 création du CV...');

    const resume = await prisma.resume.create({
      data: {
        title: `CV de ${profileData.firstName} ${profileData.lastName}`,
        userId: user.id,
        templateId: template.id,
        themeId: theme.id,
        fontId: font.id,

        // Information personnelles
        personalInfo: {
          create: {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            title: profileData.headline,
            email: user.email, // On utilise l'email de l'utilisateur connecté
            photoUrl: profileData.profilePicture,
            location:
              profileData.city && profileData.country
                ? `${profileData.city}, ${profileData.country}`
                : profileData.city || profileData.country || '',
            description: profileData.summury,
          },
        },
        experiences: profileData.experiences?.length
          ? {
              create: profileData.experiences.map((exp, index) => {
                return {
                  company: exp.companyName,
                  position: exp.title,
                  startDate: linkedInDateToDateWithFallback(exp.startDate),
                  endDate: linkedInDateToDate(exp.endDate),
                  description: exp.description,
                  location: exp.location,
                  order: index,
                };
              }),
            }
          : undefined,

        educations: profileData.educations?.length
          ? {
              create: profileData.educations.map((edu, index) => {
                return {
                  institution: edu.schoolName,
                  degree: edu.degree,
                  fieldOfStudy: edu.fieldOfStudy || null,
                  startDate: linkedInDateToDateWithFallback(edu.startDate),
                  endDate: linkedInDateToDate(edu.endDate),
                  order: index,
                };
              }),
            }
          : undefined,

        skills: profileData.skills?.length
          ? {
              create: profileData.skills.map((skill, index) => ({
                name: skill.name,
              })),
            }
          : undefined,

        certifications: profileData.certfications?.length
          ? {
              create: profileData.certfications.map((cert, index) => ({
                name: cert.name,
                issuer: cert.isssuing_organization,
              })),
            }
          : undefined,

        //Profil LinkdIn lié
        LinkedInProfile: {
          create: {
            username: username,
            urn: profileData.urn,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            headline: profileData.headline,
            summury: profileData.summury,
            profilePicture: profileData.profilePicture,
            country: profileData.country,
            city: profileData.city,

            // Relations avec données LinkedIn
            experiences: profileData.experiences?.length
              ? {
                  create: profileData.experiences.map(exp => {
                    return {
                      companyName: exp.companyName,
                      title: exp.title,
                      startDate: linkedInDateToDateWithFallback(exp.startDate),
                      endDate: linkedInDateToDate(exp.endDate),
                      description: exp.description,
                      location: exp.location,
                      current: !exp.endDate,
                    };
                  }),
                }
              : undefined,

            educations: profileData.educations?.length
              ? {
                  create: profileData.educations.map(edu => {
                    return {
                      schoolName: edu.schoolName,
                      degree: edu.degree,
                      fieldOfStudy: edu.fieldOfStudy,
                      startDate: linkedInDateToDateWithFallback(edu.startDate),
                      endDate: linkedInDateToDate(edu.endDate),
                      current: !edu.endDate,
                    };
                  }),
                }
              : undefined,

            skills: profileData.skills?.length
              ? {
                  create: profileData.skills.map(skill => ({
                    name: skill.name,
                  })),
                }
              : undefined,

            certifications: profileData.certfications?.length
              ? {
                  create: profileData.certfications.map(cert => ({
                    name: cert.name,
                    issuing_organization: cert.isssuing_organization,
                  })),
                }
              : undefined,


          },
        },
      },
      include: {
        template: true,
        theme: true,
        font: true,
        personalInfo: true,
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        certifications: { orderBy: { order: 'asc' } },
        LinkedInProfile: {
          include: {
            experiences: true,
            educations: true,
            skills: true,
            certifications: true,
          },
        },
      },
    });

    console.log('CV créé avec succès !', resume.id);

    // 5_ Revalider les chemins
    revalidatePath('/dashboard/resumes');
    revalidatePath('/resumes');
    return {
      success: true,
      resume,
      message: 'CV créé avec succès !',
    };
  } catch (error: any) {
    console.error('Erreur lors de la craètion du CV', error);
    return {
      success: false,
      message: error.message,
      error:
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de la création du CV',
    };
  }
}
