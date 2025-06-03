import { z } from "zod"; // Schéma de validation pour l'ajout/mise à jour d'une compétence
export const skillSchema = z.object({
  resumeId: z.string().min(1, "L'ID du CV est requis"),
  id: z.string().optional(), // Optionnel pour la création, requis pour la mise à jour
  name: z.string().min(1, "Le nom de la compétence est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  level: z.number().int().min(0).max(5).optional().nullable(),
  category: z.string().max(50, "La catégorie ne peut pas dépasser 50 caractères").optional().nullable(),
  order: z.number().int().min(0).optional(),
})