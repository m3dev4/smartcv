import { z } from 'zod';

export const createResumeValidation = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  templateId: z.string().min(1, { message: 'Template is required' }),
  themeId: z.string().optional(),
  fontId: z.string().optional(),
});

//Schéma de validation pour la mise à jour d'un CV
export const updateResumeValidation = z.object({
  id: z.string().min(1, { message: 'Id is required' }),
  title: z.string().min(1, { message: 'Title is required' }),
  templateId: z.string().min(1, { message: 'Template is required' }),
  themeId: z.string().optional(),
  fontId: z.string().optional(),
});
