// Creates (or resets the password of) an admin user in any environment.
//
// The /api/admin/seed route refuses to run in production, so this is the only
// way to bootstrap a login on a deployed database.
//
// Usage:
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' node scripts/create-admin.mjs
//
// Targets whatever DATABASE_URL is set; falls back to .env.local so a bare run
// hits the local database. To target production, set DATABASE_URL inline.
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

// This script runs outside Next.js, so nothing has loaded .env.local for us.
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  // No .env.local — fine, the caller is expected to pass DATABASE_URL.
}

const databaseUrl = process.env.DATABASE_URL;
const email = process.env.ADMIN_EMAIL ?? process.argv[2];
const password = process.env.ADMIN_PASSWORD ?? process.argv[3];

if (!databaseUrl) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}
if (!email || !password) {
  console.error(
    "Usage: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' node scripts/create-admin.mjs"
  );
  process.exit(1);
}
if (password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}

const sql = neon(databaseUrl);
const passwordHash = await bcrypt.hash(password, 10);

const [row] = await sql`
  INSERT INTO "AdminUser" ("id", "email", "passwordHash")
  VALUES (${randomUUID()}, ${email}, ${passwordHash})
  ON CONFLICT ("email") DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash"
  RETURNING "email", "createdAt"
`;

console.log(`Admin ready: ${row.email}`);
