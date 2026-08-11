import { z } from "zod";

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

export const membershipFormSchema = z.object({
  businessName: z.string().trim().min(2, "Business name is required").max(200),
  contactName: z.string().trim().min(2, "Contact name is required").max(200),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number (digits only)"),
  businessType: z.string().trim().min(2, "Business type / industry is required").max(200),
  address: z.string().trim().min(2, "Address is required").max(500),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type MembershipFormValues = z.infer<typeof membershipFormSchema>;
