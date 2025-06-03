'use server';

import { ResumeTemplateType } from '@/enums/resumeEnum';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/utils/auth';
import { createResumeValidation, updateResumeValidation } from '@/validations/resumeValidation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

/**
 * Crée un nouveau Cv pour l'utilisateur connecté
 */

export async function createResume(formData: FormData) {
  const session = await getCurrentUser();

  if (!session) {
    return;
  }
  try {
    const data = {
      title: formData.get('title') as string,
      templateId: formData.get('templateId') as string,
      themeId: formData.get('themeId') as string,
      fontId: formData.get('fontId') as string,
    };
    const validatedData = createResumeValidation.parse(data);

    // Recuperation de l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur introuvable',
      };
    }
    const resume = await prisma.resume.create({
      data: {
        title: validatedData.title,
        templateId: validatedData.templateId,
        themeId: validatedData.themeId || 'default-theme',
        fontId: validatedData.fontId || null,
        userId: user.id,

        personalInfo: {
          create: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            photoUrl: user.profileImage || '',
          },
        },
      },
      include: {
        personalInfo: true,
      },
    });

    revalidatePath('/resumes');
    return { success: true, resume };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur est survenue lors de la création du CV',
    };
  }
}

/**
 * Met à jour un CV existant
 */
export async function updateResume(formData: FormData) {
  const session = await getCurrentUser();

  if (!session) {
    return {
      success: false,
      message: 'Utilisateur introuvable',
    };
  }
  try {
    const data = {
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      templateId: formData.get('templateId') as string,
      themeId: formData.get('themeId') as string,
      fontId: formData.get('fontId') as string,
    };
    const validatedData = updateResumeValidation.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur introuvable',
      };
    }

    const existingResume = await prisma.resume.findUnique({
      where: { id: validatedData.id, userId: user.id },
    });

    if (!existingResume) {
      return {
        success: false,
        message: 'CV introuvable',
      };
    }

    const resume = await prisma.resume.update({
      where: { id: validatedData.id },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.templateId && { templateId: validatedData.templateId }),
        ...(validatedData.themeId && { themeId: validatedData.themeId }),
        ...(validatedData.fontId && { fontId: validatedData.fontId }),
      },
      include: {
        personalInfo: true,
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        languages: { orderBy: { order: 'asc' } },
        certifications: { orderBy: { order: 'asc' } },
        achievements: { orderBy: { order: 'asc' } },
      },
    });
    revalidatePath('/dashboard/resumes');
    revalidatePath(`/editor/${validatedData.id}`);
    return {
      success: true,
      resume,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur est survenue lors de la mise à jour du CV',
    };
  }
}

/**
 * Supprimer un CV
 */

export async function deleteResume(id: string) {
  const session = await getCurrentUser();

  if (!session) {
    return {
      success: false,
      message: 'Utilisateur introuvable',
    };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur introuvable',
      };
    }

    const existingResume = await prisma.resume.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!existingResume) {
      return {
        success: false,
        message: 'CV introuvable',
      };
    }
    await prisma.resume.delete({
      where: { id },
    });
    revalidatePath('/resumes');
    return {
      success: true,
      message: 'CV supprimé avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur est survenue lors de la suppression du CV',
    };
  }
}

/**
 * Recupere la liste des CV de l'utilisateur
 */
export async function listResume() {
  const session = await getCurrentUser();

  if (!session) {
    return {
      success: false,
      message: 'Utilisateur introuvable',
    };
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.email,
      },
    });
    if (!user) {
      return {
        success: false,
        error: 'Utilisateur introuvable',
      };
    }
    const resumes = await prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        personalInfo: true,
        theme: true,
        font: true,
        experiences: true,
        educations: true,
        skills: true,
        languages: true,
        certifications: true,
        achievements: true,
      },
    });
    return {
      success: true,
      resumes,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur est survenue lors de la récupération des CV',
    };
  }
}

/**
 * Dupliquer un CV
 */

export async function duplicateResume(id: string) {
  const session = await getCurrentUser();

  if (!session) {
    return {
      success: false,
      message: 'Utilisateur introuvable',
    };
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return {
        success: false,
        message: 'Utilisateur introuvable',
      };
    }
    const existingResume = await prisma.resume.findUnique({
      where: { id, userId: user.id },
      include: {
        personalInfo: true,
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        languages: { orderBy: { order: 'asc' } },
        certifications: { orderBy: { order: 'asc' } },
        achievements: { orderBy: { order: 'asc' } },
      },
    });
    if (!existingResume) {
      return {
        success: false,
        message: 'CV introuvable',
      };
    }

    const newResume = await prisma.resume.create({
      data: {
        title: `${existingResume.title} (copie)`,
        templateId: existingResume.templateId,
        themeId: existingResume.themeId,
        fontId: existingResume.fontId,
        userId: user.id,
        personalInfo: {
          create: {
            firstName: existingResume.personalInfo?.firstName || '',
            lastName: existingResume.personalInfo?.lastName || '',
            email: existingResume.personalInfo?.email || '',
            phone: existingResume.personalInfo?.phone || '',
            website: existingResume.personalInfo?.website || '',
            location: existingResume.personalInfo?.location || '',
            photoUrl: existingResume.personalInfo?.photoUrl || '',
          },
        },

        experiences: {
          create: existingResume.experiences.map(experience => ({
            position: experience.position,
            company: experience.company,
            location: experience.location,
            startDate: experience.startDate,
            endDate: experience.endDate,
            description: experience.description,
            order: experience.order,
            current: experience.current,
          })),
        },
        educations: {
          create: existingResume.educations.map(education => ({
            institution: education.institution,
            degree: education.degree,
            startDate: education.startDate,
            endDate: education.endDate,
            description: education.description,
            order: education.order,
            fieldOfStudy: education.fieldOfStudy,
            location: education.location,
          })),
        },
        skills: {
          create: existingResume.skills.map(skill => ({
            name: skill.name,
            order: skill.order,
            level: skill.level,
            category: skill.category,
          })),
        },
        languages: {
          create: existingResume.languages.map(language => ({
            name: language.name,
            level: language.level,
            order: language.order,
          })),
        },
        certifications: {
          create: existingResume.certifications.map(certification => ({
            name: certification.name,
            issueDate: certification.issueDate,
            expiryDate: certification.expiryDate,
            issuer: certification.issuer,
            order: certification.order,
            credentialId: certification.credentialId,
            credentialUrl: certification.credentialUrl,
          })),
        },
        achievements: {
          create: existingResume.achievements.map(achievement => ({
            title: achievement.title,
            description: achievement.description,
            date: achievement.date,
            order: achievement.order,
          })),
        },
      },
    });
    revalidatePath('/resumes');
    return {
      success: true,
      message: 'CV dupliqué avec succès',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Une erreur est survenue lors de la duplication du CV',
    };
  }
}
