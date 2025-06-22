'use server';

import { PrismaClient } from '@/lib/generated/prisma';
import { getCurrentUser } from '@/utils/auth';
import { hobbieSchema } from '@/validations/hobbie';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

/*
 * Verifier que l'utilisateur est propriétaire du CV
 * */
async function checkResumeOwnership(resumeId: string, userEmail: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  if (!user) {
    return {
      success: false,
      error: 'Utilisateur non trouvé',
    };
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
      error: "CV non trouvé ou vous n'avez pas le droit pour le modifier",
    };
  }

  return { success: true, userId: user.id };
}
/*
 * Ajoute une nouvelle hobbie
 * */
export async function addHobbie(formData: FormData) {
  const session = await getCurrentUser();

  if (!session?.email) {
    return {
      success: false,
      error: 'Vous devez vous connectez pour ajouter un hobbi',
    };
  }

  try {
    //Récupératon des données du formulaire
    const data = {
      resumeId: formData.get('resumeId') as string,
      name: formData.get('name') as string,
      icon: formData.get('icon') as string,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };

    //Validations des données
    const validatedData = hobbieSchema.parse(data);

    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, session.email);

    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    if (validatedData.order === undefined) {
      const maxOderHobbie = await prisma.hobby.findFirst({
        where: { resumeId: validatedData.resumeId },
        orderBy: { order: 'desc' },
      });
      validatedData.order = maxOderHobbie ? 1 + maxOderHobbie.order : 0;
    }

    // creation de l'hobbi
    const hobby = await prisma.hobby.create({
      data: {
        name: validatedData.name,
        icon: validatedData.icon,
        order: validatedData.order,
        resume: {
          connect: { id: validatedData.resumeId },
        },
      },
    });
    revalidatePath(`/editor/${validatedData.resumeId}`);
    return {
      success: true,
      hobby,
    };
  } catch (error: any) {
    console.error("Erreur lors de l'ajout de l'hobby ");
  }
}

/**
 * Mise a jour l'hobby
 */
export async function updateHobbie(formData: FormData) {
  const session = await getCurrentUser();

  if (!session?.email) {
    return {
      success: false,
      error: 'Vous devez vous connecter',
    };
  }

  try {
    const data = {
      resumeId: formData.get('resumeId') as string,
      name: formData.get('name') as string,
      icon: formData.get('icon') as string,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };
    const validateData = hobbieSchema.parse(data);

    if (!validateData) {
      return {
        success: false,
        error: "L'id de l'hobbi est requis pour la mise à jour",
      };
    }

    const ownershipCheck = await checkResumeOwnership(validateData.resumeId, session.email);

    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    const existingHobby = await prisma.hobby.findFirst({
      where: {
        id: validateData.id,
        resumeId: validateData.resumeId,
      },
    });

    if (!existingHobby) {
      return {
        success: false,
        error: "Hobby non trouvé ou vous n'avez pas les droits pour faire cette action",
      };
    }
    const hobby = await prisma.hobby.update({
      where: { id: validateData.id },
      data: {
        name: validateData.name,
        icon: validateData.icon,
        ...(validateData.order !== undefined && { order: validateData.order }),
      },
    });
    return {
      success: true,
      hobby,
    };
  } catch (error: any) {
    console.error("Erreur lors de la mise a jour d'hobby", error);
  }
}

/**
 * Delete hobby
 */
export async function deleteHobbie(id: string, resumeId: string) {
  const session = await getCurrentUser();

  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour supprimer une certification' };
  }
  try {
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    const existingHobby = await prisma.hobby.findFirst({
      where: {
        id,
        resumeId,
      },
    });
    if (!existingHobby) {
      return {
        success: false,
        eror: "L'hobby non trouvé ou vous ne dspose pas de droit pour cette action",
      };
    }

    await prisma.hobby.delete({
      where: { id },
    });

    await prisma.hobby.updateMany({
      where: {
        resumeId,
        order: {
          gt: existingHobby.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });

    revalidatePath(`/editor/${resumeId}`);

    return { success: true };
  } catch (error: any) {
    console.error('Erreur lors de la suppression');
  }
}

export async function reorderHooby(resumeId: string, hobbyIds: string[]) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return {
      success: false,
      error: 'Vous devez être connecté pour réorganiser les hobbies',
    };
  }

  try {
    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que toutes les refence appartiennent au CV
    const hobby = await prisma.hobby.findMany({
      where: {
        resumeId,
      },
    });

    const validHobbyIds = hobby.map(hob => hob.id);
    const allIdsValid = hobbyIds.every(id => validHobbyIds.includes(id));

    if (!allIdsValid) {
      return { success: false, error: "Certaines reference n'appartiennent pas à ce CV" };
    }

    // Mise à jour de l'ordre de chaque reference
    const updates = hobbyIds.map((id, index) =>
      prisma.hobby.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    // Revalidation du cache
    revalidatePath(`/editor/${resumeId}`);

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la réorganisation des hobbies:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la réorganisation des hobbies',
    };
  }
}
