import { PrismaClient } from '@/lib/generated/prisma';
import { getCurrentUser } from '@/utils/auth';
import { referenceValidation } from '@/validations/referenceValidation';
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

/**
 * Add ref
 */

export async function addReference(formData: FormData) {
  const session = await getCurrentUser();

  if (!session?.email) {
    return {
      success: false,
      error: 'Vous devez vous connectez pour ajouter un reference',
    };
  }

  try {
    const data = {
      resumeId: formData.get('resumeId') as string,
      name: formData.get('name') as string,
      company: formData.get('company') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      relation: formData.get('relation') as string,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };
    const validatedData = referenceValidation.parse(data);

    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, session.email);

    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    if (validatedData.order === undefined) {
      const maxOrderReference = await prisma.reference.findFirst({
        where: { resumeId: validatedData.resumeId },
        orderBy: { order: 'desc' },
      });
      validatedData.order = maxOrderReference ? maxOrderReference.order + 1 : 0;
    }

    const reference = await prisma.reference.create({
      data: {
        name: validatedData.name,
        company: validatedData.company,
        email: validatedData.email,
        phone: validatedData.phone,
        relation: validatedData.relation,
        order: validatedData.order,
        resume: {
          connect: { id: validatedData.resumeId },
        },
      },
    });
  } catch (error) {
    console.error('Erreur lors de la creation du reference');
  }
}

/**
 * Update ref
 */

export async function updateReference(formData: FormData) {
  const session = await getCurrentUser();

  if (!session?.email) {
    return {
      success: false,
      error: 'Vous devez vous connectez pour ajouter un reference',
    };
  }
  try {
    const data = {
      resumeId: formData.get('resumeId') as string,
      name: formData.get('name') as string,
      company: formData.get('company') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      relation: formData.get('relation') as string,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };
    const validateData = referenceValidation.parse(data);

    if (!validateData) {
      return {
        success: false,
        error: "L'id du reference est requis pour la mise à jour",
      };
    }

    const ownershipCheck = await checkResumeOwnership(validateData.resumeId, session.email);

    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    const existingReference = await prisma.reference.findFirst({
      where: {
        id: validateData.id,
        resumeId: validateData.resumeId,
      },
    });

    if (!existingReference) {
      return {
        success: false,
        error: "Reference non trouvé ou vous n'avez pas les droits pour faire cette action",
      };
    }
    const reference = await prisma.reference.update({
      where: { id: validateData.id },
      data: {
        name: validateData.name,
        company: validateData.company,
        phone: validateData.phone,
        email: validateData.email,
        relation: validateData.relation,
        ...(validateData.order !== undefined && { order: validateData.order }),
      },
    });
    return {
      success: true,
      reference,
    };
  } catch (error: any) {
    console.error('Erreur lors de la mise a jour du reference', error);
  }
}

export async function deleteReference(id: string, resumeId: string) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour supprimer une reference' };
  }

  try {
    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que la reference existe et appartient au CV
    const existingReference = await prisma.reference.findFirst({
      where: {
        id,
        resumeId,
      },
    });

    if (!existingReference) {
      return {
        success: false,
        error: "Reference non trouvée ou vous n'avez pas les droits pour la supprimer",
      };
    }

    // Suppression de la reference
    await prisma.reference.delete({
      where: { id },
    });

    // Réorganisation des ordres après suppression
    await prisma.reference.updateMany({
      where: {
        resumeId,
        order: {
          gt: existingReference.order,
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
    console.error('Erreur lors de la suppression de la reference:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la suppression de la reference',
    };
  }
}

export async function reorderReference(resumeId: string, referenceIds: string[]) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return {
      success: false,
      error: 'Vous devez être connecté pour réorganiser les references',
    };
  }

  try {
    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que toutes les refence appartiennent au CV
    const reference = await prisma.reference.findMany({
      where: {
        resumeId,
      },
    });

    const validReferenceIds = reference.map(ref => ref.id);
    const allIdsValid = referenceIds.every(id => validReferenceIds.includes(id));

    if (!allIdsValid) {
      return { success: false, error: "Certaines reference n'appartiennent pas à ce CV" };
    }

    // Mise à jour de l'ordre de chaque reference
    const updates = referenceIds.map((id, index) =>
      prisma.reference.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    // Revalidation du cache
    revalidatePath(`/editor/${resumeId}`);

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la réorganisation des references:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la réorganisation des references',
    };
  }
}
