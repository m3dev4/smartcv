'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/utils/auth';
import { projectSchema } from '@/validations/projectValidation';

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
 * Ajoute un nouveau projet
 */
export async function addProject(formData: FormData) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour ajouter un projet' };
  }

  try {
    // Récupération des données du formulaire
    const data = {
      resumeId: formData.get('resumeId') as string,
      title: formData.get('title') as string,
      role: (formData.get('role') as string) || null,
      startDate: formData.get('startDate') as string,
      endDate: (formData.get('endDate') as string) || null,
      url: (formData.get('url') as string) || null,
      description: (formData.get('description') as string) || null,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };

    // Validation des données
    const validatedData = projectSchema.parse(data);

    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Déterminer l'ordre si non spécifié
    if (validatedData.order === undefined) {
      const maxOrderProject = await prisma.project.findFirst({
        where: { resumeId: validatedData.resumeId },
        orderBy: { order: 'desc' },
      });
      validatedData.order = maxOrderProject ? maxOrderProject.order + 1 : 0;
    }

    // Création du projet
    const project = await prisma.project.create({
      data: {
        title: validatedData.title,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        url: validatedData.url,
        description: validatedData.description,
        order: validatedData.order,
        resume: {
          connect: { id: validatedData.resumeId },
        },
      },
    });

    // Revalidation du cache
    revalidatePath(`/editor/${validatedData.resumeId}`);

    return { success: true, project };
  } catch (error) {
    console.error("Erreur lors de l'ajout du projet:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Données invalides',
        validationErrors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      };
    }
    return { success: false, error: "Une erreur est survenue lors de l'ajout du projet" };
  }
}

/**
 * Met à jour un projet existant
 */
export async function updateProject(formData: FormData) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour modifier un projet' };
  }

  try {
    // Récupération des données du formulaire
    const data = {
      resumeId: formData.get('resumeId') as string,
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      startDate: formData.get('startDate') as string,
      endDate: (formData.get('endDate') as string) || null,
      url: (formData.get('url') as string) || null,
      description: (formData.get('description') as string) || null,
      technologies: (formData.get('technologies') as string) || null,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };

    // Validation des données
    const validatedData = projectSchema.parse(data);

    if (!validatedData.id) {
      return { success: false, error: "L'ID du projet est requis pour la mise à jour" };
    }

    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que le projet existe et appartient au CV
    const existingProject = await prisma.project.findFirst({
      where: {
        id: validatedData.id,
        resumeId: validatedData.resumeId,
      },
    });

    if (!existingProject) {
      return {
        success: false,
        error: "Projet non trouvé ou vous n'avez pas les droits pour le modifier",
      };
    }

    // Mise à jour du projet
    const project = await prisma.project.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData.title,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        url: validatedData.url,
        description: validatedData.description,
        ...(validatedData.order !== undefined && { order: validatedData.order }),
      },
    });

    // Revalidation du cache
    revalidatePath(`/editor/${validatedData.resumeId}`);

    return { success: true, project };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Données invalides',
        validationErrors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      };
    }
    return { success: false, error: 'Une erreur est survenue lors de la mise à jour du projet' };
  }
}

/**
 * Supprime un projet
 */
export async function deleteProject(id: string, resumeId: string) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour supprimer un projet' };
  }

  try {
    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que le projet existe et appartient au CV
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        resumeId,
      },
    });

    if (!existingProject) {
      return {
        success: false,
        error: "Projet non trouvé ou vous n'avez pas les droits pour le supprimer",
      };
    }

    // Suppression du projet
    await prisma.project.delete({
      where: { id },
    });

    // Réorganisation des ordres après suppression
    await prisma.project.updateMany({
      where: {
        resumeId,
        order: {
          gt: existingProject.order,
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
    console.error('Erreur lors de la suppression du projet:', error);
    return { success: false, error: 'Une erreur est survenue lors de la suppression du projet' };
  }
}

/**
 * Réorganise l'ordre des projets
 */
export async function reorderProjects(resumeId: string, projectIds: string[]) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour réorganiser les projets' };
  }

  try {
    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que tous les projets appartiennent au CV
    const projects = await prisma.project.findMany({
      where: {
        resumeId,
      },
    });

    const validProjectIds = projects.map(proj => proj.id);
    const allIdsValid = projectIds.every(id => validProjectIds.includes(id));

    if (!allIdsValid) {
      return { success: false, error: "Certains projets n'appartiennent pas à ce CV" };
    }

    // Mise à jour de l'ordre de chaque projet
    const updates = projectIds.map((id, index) =>
      prisma.project.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    // Revalidation du cache
    revalidatePath(`/editor/${resumeId}`);

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la réorganisation des projets:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la réorganisation des projets',
    };
  }
}
