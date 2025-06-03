'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/utils/auth';
import { updatePersonalInfoSchema } from '@/validations/personalValidation';
import { z } from 'zod';

/**
 * Met à jour les informations personnelles d'un CV
 */
export async function updatePersonalInfo(formData: FormData) {
  // Vérification de l'authentification
  const session = await getCurrentUser();
  if (!session?.email) {
    return {
      success: false,
      error: 'Vous devez être connecté pour modifier les informations personnelles',
    };
  }

  try {
    // Récupération des données du formulaire
    const data = {
      resumeId: formData.get('resumeId') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || null,
      website: (formData.get('website') as string) || null,
      location: (formData.get('location') as string) || null,
      photoUrl: (formData.get('photoUrl') as string) || null,
      title: (formData.get('title') as string) || null,
      description: (formData.get('description') as string) || null,
    };

    // Validation des données
    const validatedData = updatePersonalInfoSchema.parse(data);

    // Récupération de l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }

    // Vérification que le CV appartient à l'utilisateur
    const existingResume = await prisma.resume.findFirst({
      where: {
        id: validatedData.resumeId,
        userId: user.id,
      },
      include: {
        personalInfo: true,
      },
    });

    if (!existingResume) {
      return {
        success: false,
        error: "CV non trouvé ou vous n'avez pas les droits pour le modifier",
      };
    }

    let personalInfo;

    if (existingResume.personalInfo) {
      // Mise à jour des informations personnelles existantes
      personalInfo = await prisma.personalInfo.update({
        where: {
          id: existingResume.personalInfo.id,
        },
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone,
          website: validatedData.website,
          location: validatedData.location,
          photoUrl: validatedData.photoUrl,
          title: validatedData.title,
          description: validatedData.description,
        },
      });
    } else {
      // Création de nouvelles informations personnelles
      personalInfo = await prisma.personalInfo.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone,
          website: validatedData.website,
          location: validatedData.location,
          photoUrl: validatedData.photoUrl,
          title: validatedData.title,
          description: validatedData.description,
          resume: {
            connect: {
              id: validatedData.resumeId,
            },
          },
        },
      });
    }

    // Revalidation du cache
    revalidatePath(`/editor/${validatedData.resumeId}`);

    return { success: true, personalInfo };
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations personnelles:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Données invalides',
        validationErrors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      };
    }
    return {
      success: false,
      error: 'Une erreur est survenue lors de la mise à jour des informations personnelles',
    };
  }
}
