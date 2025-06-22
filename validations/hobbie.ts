import { z } from "zod"

export const hobbieSchema = z.object({
  resumeId: z.string().min(1, "L'id du CV est requis"),
  id: z.string().optional(),
  name: z.string().min(1, "Le nom est requis"),
  icon: z.string(),
  order: z.number().int().min(0).optional()
})