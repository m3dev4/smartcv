'use server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/utils/auth';
import { skillSchema } from '@/validations/skillValidation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

/**
 * Verifier que l'utilisateur est proprietaire du CV
 */
async function checkResumeOwnership(resumeId: string, userEmail: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  if (!user) {
    return { success: false, error: 'Utilisateur non trouvé' };
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
      error: "CV non trouvé ou vous n'avez pas les droits pour le modifier",
    };
  }
  return { success: true, userId: user.id };
}

/**
 * Ajouter une competence au CV
 */
export async function addSkill(formData: FormData) {
  const session = await getCurrentUser();
  if (!session) {
    return { success: false, error: 'Vous devez être connecté pour ajouter une compétence' };
  }
  try {
    const data = {
      resumeId: formData.get('resumeId') as string,
      name: formData.get('name') as string,
      level: formData.get('level') as string,
      category: formData.get('category') as string,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };
    const validatedData = skillSchema.parse(data);

    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    //Déterminer l'order si non spécifié
    if (validatedData.order === undefined) {
      const maxOrderSkill = await prisma.skill.findFirst({
        where: {
          resumeId: validatedData.resumeId,
          ...(validatedData.category && { category: validatedData.category }),
        },
        orderBy: { order: 'desc' },
      });
      validatedData.order = maxOrderSkill ? maxOrderSkill.order + 1 : 0;
    }

    const skill = await prisma.skill.create({
      data: {
        name: validatedData.name,
        level: validatedData.level as any,
        category: validatedData.category,
        order: validatedData.order,
        resume: {
          connect: { id: validatedData.resumeId },
        },
      },
    });

    revalidatePath(`/editor/${validatedData.resumeId}`);
    return { success: true, skill };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la compétence:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Données invalides',
        validationErrors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      };
    }
    return { success: false, error: "Une erreur est survenue lors de l'ajout de la compétence" };
  }
}

/**
 * Mettre à jour une competence existante
 */

export async function updateSkill(formData: FormData) {
  const session = await getCurrentUser();

  if (!session) {
    return { success: false, error: 'Vous devez être connecté pour mettre à jour une compétence' };
  }

  try {
    const data = {
      resumeId: formData.get('resumeId') as string,
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      level: formData.get('level') as string,
      category: formData.get('category') as string,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };
    const validatedData = skillSchema.parse(data);

    if (validatedData.id) {
      return { success: false, error: "L'ID de la compétence est requis pour la mise à jour" };
    }

    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    const existingSkill = await prisma.skill.findUnique({
      where: {
        id: validatedData.id,
        resumeId: validatedData.resumeId,
      },
    });

    if (!existingSkill) {
      return { success: false, error: "La compétence n'a pas été trouvée" };
    }

    const skill = await prisma.skill.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        level: validatedData.level as any,
        category: validatedData.category,
        ...(validatedData.order !== undefined && { order: validatedData.order }),
      },
    });
    revalidatePath(`/editor/${validatedData.resumeId}`);
    return { success: true, skill };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la compétence:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Données invalides',
        validationErrors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      };
    }
    return {
      success: false,
      error: 'Une erreur est survenue lors de la mise à jour de la compétence',
    };
  }
}

/**
 * Supprimer une competence
 */

export async function deleteSkill(id: string, resumeId: string) {
  const session = await getCurrentUser();

  if (!session) {
    return { success: false, error: 'Vous devez être connecté pour supprimer une compétence' };
  }

  try {
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }
    const existingSkill = await prisma.skill.findUnique({
      where: {
        id,
        resumeId,
      },
    });
    if (!existingSkill) {
      return { success: false, error: "La compétence n'a pas été trouvée" };
    }
    await prisma.skill.delete({
      where: { id },
    });

    //Reorganiser les ordres des compétences
    await prisma.skill.updateMany({
      where: { resumeId, category: existingSkill.category, order: { gt: existingSkill.order } },
      data: {
        order: {
          decrement: 1,
        },
      },
    });
    revalidatePath(`/editor/${resumeId}`);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression de la compétence:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la suppression de la compétence',
    };
  }
}

/**
 * Reorganiser l'order des competences
 */

export async function reorderSkills(resumeId: string, skillId: string[], category?: string) {
  const session = await getCurrentUser();

  if (!session) {
    return { success: false, error: 'Vous devez être connecté pour réorganiser les compétences' };
  }
  try {
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }
    const skills = await prisma.skill.findMany({
      where: {
        resumeId,
        ...(category && { category }),
      },
    });

    const validSkillIds = skills.map(skill => skill.id);
    const allIdsValid = skillId.every(id => validSkillIds.includes(id));

    if (!allIdsValid) {
      return { success: false, error: "Certaines compétences n'appartiennent pas à ce CV" };
    }

    const updates = skillId.map((id, index) =>
      prisma.skill.update({
        where: { id },
        data: { order: index },
      })
    );

    revalidatePath(`/editor/${resumeId}`);
    return { success: true, updates };
  } catch (error) {
    console.error('Erreur lors de la suppression de la compétence:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la suppression de la compétence',
    };
  }
}
