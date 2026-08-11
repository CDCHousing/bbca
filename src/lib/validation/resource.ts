import { z } from "zod";

// Public-facing seat booking form.
export const seatBookingSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number (digits only)"),
  organization: z.string().trim().min(2, "Organization is required").max(200),
});

export type SeatBookingValues = z.infer<typeof seatBookingSchema>;

// Admin resource create/update. Optional text fields accept "" from the form
// and are normalised to null so the DB never stores empty strings.
const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

export const resourceSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(300),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug may only contain lowercase letters, numbers and hyphens")
    .max(300)
    .optional()
    .or(z.literal("")),
  excerpt: optionalText,
  body: z.string().trim().min(1, "Body is required"),
  coverImageUrl: optionalText,
  eventDate: optionalText,
  location: optionalText,
  bookingEnabled: z.boolean().default(true),
  emailSubject: optionalText,
  emailBody: optionalText,
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  order: z.number().int().default(0),
});

export type ResourceValues = z.infer<typeof resourceSchema>;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
