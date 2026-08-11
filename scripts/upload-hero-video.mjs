// One-off helper: upload the compressed hero background video to Vercel Blob.
// Usage: node scripts/upload-hero-video.mjs <path-to-mp4>
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { put } from "@vercel/blob";

// Load BLOB_READ_WRITE_TOKEN from .env.local (this script runs outside Next.js).
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/upload-hero-video.mjs <path-to-mp4>");
  process.exit(1);
}

const blob = await put(`hero/${basename(file)}`, readFileSync(file), {
  access: "public",
  contentType: "video/mp4",
  addRandomSuffix: false,
  multipart: true,
});

console.log(blob.url);
