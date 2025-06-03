'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/utils/auth';
import { certificationSchema } from '@/validations/certificationValidation';

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
 * Ajoute une nouvelle certification
 */
export async function addCertification(formData: FormData) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour ajouter une certification' };
  }

  try {
    // Récupération des données du formulaire
    const data = {
      resumeId: formData.get('resumeId') as string,
      name: formData.get('name') as string,
      issuer: formData.get('issuer') as string,
      date: (formData.get('date') as string) || null,
      expiryDate: (formData.get('expiryDate') as string) || null,
      credentialId: (formData.get('credentialId') as string) || null,
      credentialUrl: (formData.get('credentialUrl') as string) || null,
      description: (formData.get('description') as string) || null,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };

    // Validation des données
    const validatedData = certificationSchema.parse(data);

    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Déterminer l'ordre si non spécifié
    if (validatedData.order === undefined) {
      const maxOrderCertification = await prisma.certification.findFirst({
        where: { resumeId: validatedData.resumeId },
        orderBy: { order: 'desc' },
      });
      validatedData.order = maxOrderCertification ? maxOrderCertification.order + 1 : 0;
    }

    // Création de la certification
    const certification = await prisma.certification.create({
      data: {
        name: validatedData.name,
        issuer: validatedData.issuer,
        issueDate: validatedData.date ? new Date(validatedData.date) : null,
        expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate) : null,
        credentialId: validatedData.credentialId,
        credentialUrl: validatedData.credentialUrl,
        order: validatedData.order,
        resume: {
          connect: { id: validatedData.resumeId },
        },
      },
    });

    // Revalidation du cache
    revalidatePath(`/editor/${validatedData.resumeId}`);

    return { success: true, certification };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la certification:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Données invalides',
        validationErrors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      };
    }
    return { success: false, error: "Une erreur est survenue lors de l'ajout de la certification" };
  }
}

/**
 * Met à jour une certification existante
 */
export async function updateCertification(formData: FormData) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour modifier une certification' };
  }

  try {
    // Récupération des données du formulaire
    const data = {
      resumeId: formData.get('resumeId') as string,
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      issuer: formData.get('issuer') as string,
      date: (formData.get('date') as string) || null,
      expiryDate: (formData.get('expiryDate') as string) || null,
      credentialId: (formData.get('credentialId') as string) || null,
      credentialUrl: (formData.get('credentialUrl') as string) || null,
      description: (formData.get('description') as string) || null,
      order: formData.has('order') ? parseInt(formData.get('order') as string) : undefined,
    };

    // Validation des données
    const validatedData = certificationSchema.parse(data);

    if (!validatedData.id) {
      return { success: false, error: "L'ID de la certification est requis pour la mise à jour" };
    }

    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(validatedData.resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que la certification existe et appartient au CV
    const existingCertification = await prisma.certification.findFirst({
      where: {
        id: validatedData.id,
        resumeId: validatedData.resumeId,
      },
    });

    if (!existingCertification) {
      return {
        success: false,
        error: "Certification non trouvée ou vous n'avez pas les droits pour la modifier",
      };
    }

    // Mise à jour de la certification
    const certification = await prisma.certification.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        issuer: validatedData.issuer,
        issueDate: validatedData.date ? new Date(validatedData.date) : null,
        expiryDate: validatedData.expiryDate ? new Date(validatedData.expiryDate) : null,
        credentialId: validatedData.credentialId,
        credentialUrl: validatedData.credentialUrl,
        ...(validatedData.order !== undefined && { order: validatedData.order }),
      },
    });

    // Revalidation du cache
    revalidatePath(`/editor/${validatedData.resumeId}`);

    return { success: true, certification };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la certification:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Données invalides',
        validationErrors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      };
    }
    return {
      success: false,
      error: 'Une erreur est survenue lors de la mise à jour de la certification',
    };
  }
}

/**
 * Supprime une certification
 */
export async function deleteCertification(id: string, resumeId: string) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return { success: false, error: 'Vous devez être connecté pour supprimer une certification' };
  }

  try {
    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que la certification existe et appartient au CV
    const existingCertification = await prisma.certification.findFirst({
      where: {
        id,
        resumeId,
      },
    });

    if (!existingCertification) {
      return {
        success: false,
        error: "Certification non trouvée ou vous n'avez pas les droits pour la supprimer",
      };
    }

    // Suppression de la certification
    await prisma.certification.delete({
      where: { id },
    });

    // Réorganisation des ordres après suppression
    await prisma.certification.updateMany({
      where: {
        resumeId,
        order: {
          gt: existingCertification.order,
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
    console.error('Erreur lors de la suppression de la certification:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la suppression de la certification',
    };
  }
}

/**
 * Réorganise l'ordre des certifications
 */
export async function reorderCertifications(resumeId: string, certificationIds: string[]) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return {
      success: false,
      error: 'Vous devez être connecté pour réorganiser les certifications',
    };
  }

  try {
    // Vérification des droits sur le CV
    const ownershipCheck = await checkResumeOwnership(resumeId, session.email);
    if (!ownershipCheck.success) {
      return ownershipCheck;
    }

    // Vérification que toutes les certifications appartiennent au CV
    const certifications = await prisma.certification.findMany({
      where: {
        resumeId,
      },
    });

    const validCertificationIds = certifications.map(cert => cert.id);
    const allIdsValid = certificationIds.every(id => validCertificationIds.includes(id));

    if (!allIdsValid) {
      return { success: false, error: "Certaines certifications n'appartiennent pas à ce CV" };
    }

    // Mise à jour de l'ordre de chaque certification
    const updates = certificationIds.map((id, index) =>
      prisma.certification.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);

    // Revalidation du cache
    revalidatePath(`/editor/${resumeId}`);

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la réorganisation des certifications:', error);
    return {
      success: false,
      error: 'Une erreur est survenue lors de la réorganisation des certifications',
    };
  }
}
