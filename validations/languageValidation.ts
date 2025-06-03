import { z } from "zod";

// Schéma de validation pour l'ajout/mise à jour d'une langue
export const languageSchema = z.object({
  resumeId: z.string().min(1, "L'ID du CV est requis"),
  id: z.string().optional(), // Optionnel pour la création, requis pour la mise à jour
  name: z.string().min(1, "Le nom de la langue est requis").max(50, "Le nom ne peut pas dépasser 50 caractères"),
  level: z.string().max(50, "Le niveau ne peut pas dépasser 50 caractères").optional().nullable(),
  order: z.number().int().min(0).optional(),
})
