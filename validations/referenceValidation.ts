import { z } from 'zod';

export const referenceValidation = z.object({
  resumeId: z.string().min(1, "L'id du CV est requis"),
  id: z.string().optional(),
  name: z.string().min(1, 'Le nom est requis'),
  company: z.string().min(1, "Le nom d'entreprise est requis"),
  email: z.string().optional(),
  phone: z.string().optional(),
  relation: z.string().optional(),
  order: z.number().int().optional(),
});
