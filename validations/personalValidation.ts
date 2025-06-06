import { z } from "zod";

// Schéma de validation pour la mise à jour des informations personnelles
export const updatePersonalInfoSchema = z.object({
  resumeId: z.string().min(1, "L'ID du CV est requis"),
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .max(100, 'Le prénom ne peut pas dépasser 100 caractères'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  email: z
    .string()
    .email("L'email doit être valide")
    .max(100, "L'email ne peut pas dépasser 100 caractères"),
  phone: z
    .string()
    .max(20, 'Le téléphone ne peut pas dépasser 20 caractères')
    .optional()
    .nullable(),
  website: z
    .string()
    .url('Le site web doit être une URL valide')
    .max(200, 'Le site web ne peut pas dépasser 200 caractères')
    .optional()
    .nullable(),
  location: z
    .string()
    .max(100, "L'emplacement ne peut pas dépasser 100 caractères")
    .optional()
    .nullable(),
  photoUrl: z
    .string()
    .max(500, "L'URL de l'image de profil ne peut pas dépasser 500 caractères")
    .optional()
    .nullable(),
  title: z.string().max(100, 'Le titre ne peut pas dépasser 100 caractères').optional().nullable(),
  description: z
    .string()
    .max(5000, 'La description ne peut pas dépasser 5000 caractères')
    .optional()
    .nullable(),
});