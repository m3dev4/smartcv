import { z } from 'zod';

// Schéma de validation pour l'ajout/mise à jour d'un projet
export const projectSchema = z.object({
  resumeId: z.string().min(1, "L'ID du CV est requis"),
  id: z.string().optional(), // Optionnel pour la création, requis pour la mise à jour
  title: z
    .string()
    .min(1, 'Le titre du projet est requis')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  role: z.string().max(100, 'Le rôle ne peut pas dépasser 100 caractères').optional().nullable(),
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
  url: z.string().max(255, "L'URL ne peut pas dépasser 255 caractères").optional().nullable(),
  description: z
    .string()
    .max(5000, 'La description ne peut pas dépasser 5000 caractères')
    .optional()
    .nullable(),
  order: z.number().int().min(0).optional(),
});
