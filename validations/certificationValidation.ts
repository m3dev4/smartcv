import { z } from 'zod';

// Schéma de validation pour l'ajout/mise à jour d'une certification
export const certificationSchema = z.object({
  resumeId: z.string().min(1, "L'ID du CV est requis"),
  id: z.string().optional(), // Optionnel pour la création, requis pour la mise à jour
  name: z
    .string()
    .min(1, 'Le nom de la certification est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  issuer: z
    .string()
    .min(1, "L'émetteur est requis")
    .max(100, "L'émetteur ne peut pas dépasser 100 caractères"),
  date: z
    .string()
    .refine(date => date === '' || !isNaN(Date.parse(date)), {
      message: 'La date doit être une date valide ou vide',
    })
    .optional()
    .nullable(),
  expiryDate: z
    .string()
    .refine(date => date === '' || !isNaN(Date.parse(date)), {
      message: "La date d'expiration doit être une date valide ou vide",
    })
    .optional()
    .nullable(),
  credentialId: z
    .string()
    .max(100, "L'ID de la certification ne peut pas dépasser 100 caractères")
    .optional()
    .nullable(),
  credentialUrl: z
    .string()
    .max(255, "L'URL ne peut pas dépasser 255 caractères")
    .optional()
    .nullable(),
  description: z
    .string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional()
    .nullable(),
  order: z.number().int().min(0).optional(),
});
