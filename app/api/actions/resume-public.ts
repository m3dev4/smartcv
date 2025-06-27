'use server';
import prisma from '@/lib/prisma';

/**
 * Récupère un CV par son ID sans vérification d'authentification
 * Utilisé uniquement pour la génération de PDF
 */
export async function getResumeByIdForPdf(id: string) {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id },
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
        hobbies: { orderBy: { order: 'asc' } },
        volunteerings: { orderBy: { order: 'asc' } },
        awards: { orderBy: { order: 'asc' } },
        publications: { orderBy: { order: 'asc' } },
        references: { orderBy: { order: 'asc' } },
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

    console.log('Détails du CV récupéré pour PDF:', resume);

    return {
      success: true,
      resume,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du CV pour PDF:', error);
    return {
      success: false,
      message: 'Une erreur est survenue lors de la récupération du CV',
    };
  }
}
