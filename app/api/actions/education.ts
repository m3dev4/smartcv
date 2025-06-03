'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/utils/auth';
import { educationSchema } from '@/validations/educationValidation';
import { z } from 'zod';

/**
 * Vérifier que l'utilisateur est propriétaire du CV
 */
async function checkResumeOwnership(resumeId: string, userEmail: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return { success: false, error: 'Utilisateur non trouvé' };
  }

  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: user.id,
    },
  });

  if (!resume) {
    return {
      success: false,
      error: "CV non trouvé ou vous n'avez pas les droits pour le modifier",
    };
  }

  return { success: true, userId: user.id };
}

/**
 * Ajoute une nouvelle formation
 */
export async function addEducation(formData: FormData) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour ajouter une formation' };
  }

  try {
    // Récupération des données du formulaire
    const data = {
      resumeId: formData.get('resumeId') as string,
      institution: formData.get('institution') as string,
      degree: formData.get('degree') as string,
      fieldOfStudy: (formData.get('fieldOfStudy') as string) || null,
      location: (formData.get('location') as string) || null,
      startDate: formData.get('startDate') as string,
      endDate: (formData.get('endDate') as string) || null,
      description: (formData.get('description') as string) || null,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };

    // Validation des données
    const validatedData = educationSchema.parse(data);

    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Déterminer l'ordre si non spécifié
    if (validatedData.order === undefined) {
      const maxOrderEducation = await prisma.education.findFirst({
        where: { resumeId: validatedData.resumeId },
        orderBy: { order: 'desc' },
      });
      validatedData.order = maxOrderEducation ? maxOrderEducation.order + 1 : 0;
    }

    // Création de la formation
    const education = await prisma.education.create({
      data: {
        institution: validatedData.institution,
        degree: validatedData.degree,
        fieldOfStudy: validatedData.fieldOfStudy,
        location: validatedData.location,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        description: validatedData.description,
        order: validatedData.order,
        resume: {
          connect: { id: validatedData.resumeId },
        },
      },
    });

    // Revalidation du cache
    revalidatePath(`/editor/${validatedData.resumeId}`);

    return { success: true, education };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la formation:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Données invalides',
        validationErrors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      };
    }
    return { success: false, error: "Une erreur est survenue lors de l'ajout de la formation" };
  }
}

/**
 * Met à jour une formation existante
 */
export async function updateEducation(formData: FormData) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour modifier une formation' };
  }

  try {
    // Récupération des données du formulaire
    const data = {
      resumeId: formData.get('resumeId') as string,
      id: formData.get('id') as string,
      institution: formData.get('institution') as string,
      degree: formData.get('degree') as string,
      fieldOfStudy: (formData.get('fieldOfStudy') as string) || null,
      location: (formData.get('location') as string) || null,
      startDate: formData.get('startDate') as string,
      endDate: (formData.get('endDate') as string) || null,
      description: (formData.get('description') as string) || null,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };

    // Validation des données
    const validatedData = educationSchema.parse(data);

    if (!validatedData.id) {
      return { success: false, error: "L'ID de la formation est requis pour la mise à jour" };
    }

    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que la formation existe et appartient au CV
    const existingEducation = await prisma.education.findFirst({
      where: {
        id: validatedData.id,
        resumeId: validatedData.resumeId,
      },
    });

    if (!existingEducation) {
      return {
        success: false,
        error: "Formation non trouvée ou vous n'avez pas les droits pour la modifier",
      };
    }

    // Mise à jour de la formation
    const education = await prisma.education.update({
      where: { id: validatedData.id },
      data: {
        institution: validatedData.institution,
        degree: validatedData.degree,
        fieldOfStudy: validatedData.fieldOfStudy,
        location: validatedData.location,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        description: validatedData.description,
        ...(validatedData.order !== undefined && { order: validatedData.order }),
      },
    });

    // Revalidation du cache
    revalidatePath(`/editor/${validatedData.resumeId}`);

    return { success: true, education };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la formation:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Données invalides',
        validationErrors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      };
    }
    return {
      success: false,
      error: 'Une erreur est survenue lors de la mise à jour de la formation',
    };
  }
}

/**
 * Supprime une formation
 */
export async function deleteEducation(id: string, resumeId: string) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour supprimer une formation' };
  }

  try {
    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que la formation existe et appartient au CV
    const existingEducation = await prisma.education.findFirst({
      where: {
        id,
        resumeId,
      },
    });

    if (!existingEducation) {
      return {
        success: false,
        error: "Formation non trouvée ou vous n'avez pas les droits pour la supprimer",
      };
    }

    // Suppression de la formation
    await prisma.education.delete({
      where: { id },
    });

    // Réorganisation des ordres après suppression
    await prisma.education.updateMany({
      where: {
        resumeId,
        order: {
          gt: existingEducation.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });

    // Revalidation du cache
    revalidatePath(`/editor/${resumeId}`);

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression de la formation:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la suppression de la formation',
    };
  }
}

/**
 * Réorganise l'ordre des formations
 */
export async function reorderEducations(resumeId: string, educationIds: string[]) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour réorganiser les formations' };
  }

  try {
    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que toutes les formations appartiennent au CV
    const educations = await prisma.education.findMany({
      where: {
        resumeId,
      },
    });

    const validEducationIds = educations.map(edu => edu.id);
    const allIdsValid = educationIds.every(id => validEducationIds.includes(id));

    if (!allIdsValid) {
      return { success: false, error: "Certaines formations n'appartiennent pas à ce CV" };
    }

    // Mise à jour de l'ordre de chaque formation
    const updates = educationIds.map((id, index) =>
      prisma.education.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    // Revalidation du cache
    revalidatePath(`/editor/${resumeId}`);

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la réorganisation des formations:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la réorganisation des formations',
    };
  }
}
