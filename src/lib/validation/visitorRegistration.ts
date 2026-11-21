import { z } from "zod";

export const visitorRegistrationSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200),
  // Phone, email and profession are optional; blank/missing values are stored as "".
  phone: z
    .string()
    .trim()
    .regex(/^(\+?[0-9]{7,15})?$/, "Enter a valid phone number (digits only)")
    .optional()
    .default(""),
  email: z
    .string()
    .trim()
    .max(320)
    .refine((v) => v === "" || z.string().email().safeParse(v).success, "Enter a valid email address")
    .optional()
    .default(""),
  profession: z.string().trim().max(200).optional().default(""),
});

export type VisitorRegistrationValues = z.infer<typeof visitorRegistrationSchema>;
