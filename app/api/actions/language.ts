'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/utils/auth';
import { languageSchema } from '@/validations/languageValidation';

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
 * Ajoute une nouvelle langue
 */
export async function addLanguage(formData: FormData) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour ajouter une langue' };
  }

  try {
    // Récupération des données du formulaire
    const data = {
      resumeId: formData.get('resumeId') as string,
      name: formData.get('name') as string,
      level: (formData.get('level') as string) || null,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };

    // Validation des données
    const validatedData = languageSchema.parse(data);

    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Déterminer l'ordre si non spécifié
    if (validatedData.order === undefined) {
      const maxOrderLanguage = await prisma.language.findFirst({
        where: { resumeId: validatedData.resumeId },
        orderBy: { order: 'desc' },
      });
      validatedData.order = maxOrderLanguage ? maxOrderLanguage.order + 1 : 0;
    }

    // Création de la langue
    const language = await prisma.language.create({
      data: {
        name: validatedData.name,
        level: validatedData.level as any,
        order: validatedData.order,
        resume: {
          connect: { id: validatedData.resumeId },
        },
      },
    });

    // Revalidation du cache
    revalidatePath(`/editor/${validatedData.resumeId}`);

    return { success: true, language };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la langue:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Données invalides',
        validationErrors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      };
    }
    return { success: false, error: "Une erreur est survenue lors de l'ajout de la langue" };
  }
}

/**
 * Met à jour une langue existante
 */
export async function updateLanguage(formData: FormData) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour modifier une langue' };
  }

  try {
    // Récupération des données du formulaire
    const data = {
      resumeId: formData.get('resumeId') as string,
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      level: (formData.get('level') as string) || null,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };

    // Validation des données
    const validatedData = languageSchema.parse(data);

    if (!validatedData.id) {
      return { success: false, error: "L'ID de la langue est requis pour la mise à jour" };
    }

    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que la langue existe et appartient au CV
    const existingLanguage = await prisma.language.findFirst({
      where: {
        id: validatedData.id,
        resumeId: validatedData.resumeId,
      },
    });

    if (!existingLanguage) {
      return {
        success: false,
        error: "Langue non trouvée ou vous n'avez pas les droits pour la modifier",
      };
    }

    // Mise à jour de la langue
    const language = await prisma.language.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        level: validatedData.level as any,
        ...(validatedData.order !== undefined && { order: validatedData.order }),
      },
    });

    // Revalidation du cache
    revalidatePath(`/editor/${validatedData.resumeId}`);

    return { success: true, language };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la langue:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Données invalides',
        validationErrors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      };
    }
    return { success: false, error: 'Une erreur est survenue lors de la mise à jour de la langue' };
  }
}

/**
 * Supprime une langue
 */
export async function deleteLanguage(id: string, resumeId: string) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour supprimer une langue' };
  }

  try {
    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que la langue existe et appartient au CV
    const existingLanguage = await prisma.language.findFirst({
      where: {
        id,
        resumeId,
      },
    });

    if (!existingLanguage) {
      return {
        success: false,
        error: "Langue non trouvée ou vous n'avez pas les droits pour la supprimer",
      };
    }

    // Suppression de la langue
    await prisma.language.delete({
      where: { id },
    });

    // Réorganisation des ordres après suppression
    await prisma.language.updateMany({
      where: {
        resumeId,
        order: {
          gt: existingLanguage.order,
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
    console.error('Erreur lors de la suppression de la langue:', error);
    return { success: false, error: 'Une erreur est survenue lors de la suppression de la langue' };
  }
}

/**
 * Réorganise l'ordre des langues
 */
export async function reorderLanguages(resumeId: string, languageIds: string[]) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour réorganiser les langues' };
  }

  try {
    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que toutes les langues appartiennent au CV
    const languages = await prisma.language.findMany({
      where: {
        resumeId,
      },
    });

    const validLanguageIds = languages.map(lang => lang.id);
    const allIdsValid = languageIds.every(id => validLanguageIds.includes(id));

    if (!allIdsValid) {
      return { success: false, error: "Certaines langues n'appartiennent pas à ce CV" };
    }

    // Mise à jour de l'ordre de chaque langue
    const updates = languageIds.map((id, index) =>
      prisma.language.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    // Revalidation du cache
    revalidatePath(`/editor/${resumeId}`);

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la réorganisation des langues:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la réorganisation des langues',
    };
  }
}
