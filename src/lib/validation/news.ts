import { z } from "zod";
import { parseYouTubeId } from "@/lib/youtube";

// Optional text fields accept "" from the form and normalise to null so the DB
// never stores empty strings.
const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

export const newsSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(300),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug may only contain lowercase letters, numbers and hyphens"
    )
    .max(300)
    .optional()
    .or(z.literal("")),
  category: optionalText,
  excerpt: optionalText,
  body: z.string().trim().min(1, "Body is required"),
  coverImageUrl: optionalText,
  imageFit: z.enum(["COVER", "CONTAIN"]).default("COVER"),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  publishedAt: optionalText,
  order: z.number().int().default(0),
});

export type NewsValues = z.infer<typeof newsSchema>;

// The admin pastes any YouTube URL form; store the extracted id.
export const homeVideoSchema = z.object({
  videoUrl: z
    .string()
    .trim()
    .min(1, "Video URL is required")
    .refine((v) => parseYouTubeId(v) !== null, "Enter a valid YouTube URL or video id"),
  title: z.string().trim().min(2, "Title is required").max(300),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export type HomeVideoValues = z.infer<typeof homeVideoSchema>;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
