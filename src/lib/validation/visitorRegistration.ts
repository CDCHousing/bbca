import { z } from "zod";

export const visitorRegistrationSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number (digits only)"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  profession: z.string().trim().min(2, "Profession is required").max(200),
});

export type VisitorRegistrationValues = z.infer<typeof visitorRegistrationSchema>;
