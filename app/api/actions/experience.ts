'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/utils/auth';
import { experienceSchema } from '@/validations/experienceValidation';

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
 * Ajoute une nouvelle expérience professionnelle
 */
export async function addExperience(formData: FormData) {
  // Vérification de l'authentification
  const user = await getCurrentUser();
  if (!user?.email) {
    return { success: false, error: 'Vous devez être connecté pour ajouter une expérience' };
  }

  try {
    // Récupération des données du formulaire
    const data = {
      resumeId: formData.get('resumeId') as string,
      position: formData.get('position') as string,
      company: formData.get('company') as string,
      location: (formData.get('location') as string) || null,
      startDate: formData.get('startDate') as string,
      endDate: (formData.get('endDate') as string) || null,
      current: formData.get('current') === 'true',
      description: (formData.get('description') as string) || null,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };

    // Validation des données
    const validatedData = experienceSchema.parse(data);

    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, user.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Déterminer l'ordre si non spécifié
    if (validatedData.order === undefined) {
      const maxOrderExperience = await prisma.experience.findFirst({
        where: { resumeId: validatedData.resumeId },
        orderBy: { order: 'desc' },
      });
      validatedData.order = maxOrderExperience ? maxOrderExperience.order + 1 : 0;
    }

    // Création de l'expérience
    const experience = await prisma.experience.create({
      data: {
        position: validatedData.position,
        company: validatedData.company,
        location: validatedData.location,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        current: validatedData.current || false,
        description: validatedData.description,
        order: validatedData.order,
        resume: {
          connect: { id: validatedData.resumeId },
        },
      },
    });

    // Revalidation du cache
    revalidatePath(`/editor/${validatedData.resumeId}`);

    return { success: true, experience };
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'expérience:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Données invalides',
        validationErrors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      };
    }
    return { success: false, error: "Une erreur est survenue lors de l'ajout de l'expérience" };
  }
}

/**
 * Met à jour une expérience existante
 */
export async function updateExperience(formData: FormData) {
  // Vérification de l'authentification
  const user = await getCurrentUser();
  if (!user?.email) {
    return { success: false, error: 'Vous devez être connecté pour modifier une expérience' };
  }

  try {
    // Récupération des données du formulaire
    const data = {
      resumeId: formData.get('resumeId') as string,
      id: formData.get('id') as string,
      position: formData.get('position') as string,
      company: formData.get('company') as string,
      location: (formData.get('location') as string) || null,
      startDate: formData.get('startDate') as string,
      endDate: (formData.get('endDate') as string) || null,
      current: formData.get('current') === 'true',
      description: (formData.get('description') as string) || null,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };

    // Validation des données
    const validatedData = experienceSchema.parse(data);

    if (!validatedData.id) {
      return { success: false, error: "L'ID de l'expérience est requis pour la mise à jour" };
    }

    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, user.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que l'expérience existe et appartient au CV
    const existingExperience = await prisma.experience.findFirst({
      where: {
        id: validatedData.id,
        resumeId: validatedData.resumeId,
      },
    });

    if (!existingExperience) {
      return {
        success: false,
        error: "Expérience non trouvée ou vous n'avez pas les droits pour la modifier",
      };
    }

    // Mise à jour de l'expérience
    const experience = await prisma.experience.update({
      where: { id: validatedData.id },
      data: {
        position: validatedData.position,
        company: validatedData.company,
        location: validatedData.location,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        current: validatedData.current || false,
        description: validatedData.description,
        ...(validatedData.order !== undefined && { order: validatedData.order }),
      },
    });

    // Revalidation du cache
    revalidatePath(`/editor/${validatedData.resumeId}`);

    return { success: true, experience };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'expérience:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Données invalides',
        validationErrors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      };
    }
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour de l'expérience",
    };
  }
}

/**
 * Supprime une expérience
 */
export async function deleteExperience(id: string, resumeId: string) {
  // Vérification de l'authentification
  const user = await getCurrentUser();
  if (!user?.email) {
    return { success: false, error: 'Vous devez être connecté pour supprimer une expérience' };
  }

  try {
    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(resumeId, user.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que l'expérience existe et appartient au CV
    const existingExperience = await prisma.experience.findFirst({
      where: {
        id,
        resumeId,
      },
    });

    if (!existingExperience) {
      return {
        success: false,
        error: "Expérience non trouvée ou vous n'avez pas les droits pour la supprimer",
      };
    }

    // Suppression de l'expérience
    await prisma.experience.delete({
      where: { id },
    });

    // Réorganisation des ordres après suppression
    await prisma.experience.updateMany({
      where: {
        resumeId,
        order: {
          gt: existingExperience.order,
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
    console.error("Erreur lors de la suppression de l'expérience:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression de l'expérience",
    };
  }
}

/**
 * Réorganise l'ordre des expériences
 */
export async function reorderExperiences(resumeId: string, experienceIds: string[]) {
  // Vérification de l'authentification
  const user = await getCurrentUser();
  if (!user?.email) {
    return { success: false, error: 'Vous devez être connecté pour réorganiser les expériences' };
  }

  try {
    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(resumeId, user.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que toutes les expériences appartiennent au CV
    const experiences = await prisma.experience.findMany({
      where: {
        resumeId,
      },
    });

    const validExperienceIds = experiences.map(exp => exp.id);
    const allIdsValid = experienceIds.every(id => validExperienceIds.includes(id));

    if (!allIdsValid) {
      return { success: false, error: "Certaines expériences n'appartiennent pas à ce CV" };
    }

    // Mise à jour de l'ordre de chaque expérience
    const updates = experienceIds.map((id, index) =>
      prisma.experience.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    // Revalidation du cache
    revalidatePath(`/editor/${resumeId}`);

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la réorganisation des expériences:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la réorganisation des expériences',
    };
  }
}
