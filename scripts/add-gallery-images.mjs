/**
 * Uploads local images to Vercel Blob and adds them to the photo archive.
 *
 * Usage:
 *   node scripts/add-gallery-images.mjs <path-to-image> [...more]
 */
import { readFileSync } from "node:fs";
import { basename, extname } from "node:path";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";

try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  // No .env.local — rely on the inline environment.
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node scripts/add-gallery-images.mjs <path-to-image> [...more]");
  process.exit(1);
}

const sql = neon(databaseUrl);

const [maxRow] = await sql`SELECT COALESCE(MAX("order"), 0) AS max FROM "GalleryImage"`;
let order = Number(maxRow.max) + 1;

for (const file of files) {
  const contentType = CONTENT_TYPES[extname(file).toLowerCase()];
  if (!contentType) {
    console.error(`Skipping ${file} — unsupported image type`);
    continue;
  }

  const blob = await put(`gallery/${Date.now()}-${basename(file)}`, readFileSync(file), {
    access: "public",
    contentType,
  });

  await sql`
    INSERT INTO "GalleryImage" (id, "imageUrl", caption, "order", "createdAt")
    VALUES (${randomUUID()}, ${blob.url}, NULL, ${order}, NOW())
  `;

  console.log(`${basename(file)} -> ${blob.url}`);
  order += 1;
}
