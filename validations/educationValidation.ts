import { z } from 'zod';

// Schéma de validation pour l'ajout/mise à jour d'une formation
export const educationSchema = z.object({
  resumeId: z.string().min(1, "L'ID du CV est requis"),
  id: z.string().optional(), // Optionnel pour la création, requis pour la mise à jour
  institution: z
    .string()
    .min(1, "L'établissement est requis")
    .max(100, "L'établissement ne peut pas dépasser 100 caractères"),
  degree: z
    .string()
    .min(1, 'Le diplôme est requis')
    .max(100, 'Le diplôme ne peut pas dépasser 100 caractères'),
  fieldOfStudy: z
    .string()
    .max(100, "Le domaine d'étude ne peut pas dépasser 100 caractères")
    .optional()
    .nullable(),
  location: z
    .string()
    .max(100, "L'emplacement ne peut pas dépasser 100 caractères")
    .optional()
    .nullable(),
  startDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'La date de début doit être une date valide',
  }),
  endDate: z
    .string()
    .refine(date => date === '' || !isNaN(Date.parse(date)), {
      message: 'La date de fin doit être une date valide ou vide',
    })
    .optional()
    .nullable(),
  description: z
    .string()
    .max(5000, 'La description ne peut pas dépasser 5000 caractères')
    .optional()
    .nullable(),
  order: z.number().int().min(0).optional(),
});
