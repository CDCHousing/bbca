/**
 * Seeds the three launch News & Events articles and the launch home-page video.
 *
 * These used to be hardcoded in src/lib/news.ts. Everything is now DB-driven and
 * editable at /admin/news, so this script exists only to move the original
 * content into the database once. It is idempotent — existing slugs are skipped.
 *
 * Usage:
 *   DATABASE_URL="postgres://..." node scripts/seed-news.mjs
 */
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

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

const p = (...paragraphs) => paragraphs.map((t) => `<p>${t}</p>`).join("");

const ARTICLES = [
  {
    slug: "bbca-gathering-construction-professionals",
    category: "NEWS, EVENTS",
    title:
      "BBCA Gathering Brings Together Construction Professionals and Community Leaders",
    publishedAt: "2026-05-01",
    order: 0,
    coverImageUrl: "/pic.png",
    imageFit: "COVER",
    excerpt:
      "BBCA hosted a successful gathering, bringing together construction professionals, entrepreneurs, business leaders and members of the wider community.",
    body: p(
      "May 2026 — The British Bangladeshi Construction Association (BBCA) hosted a successful gathering, bringing together construction professionals, entrepreneurs, business leaders and members of the wider community.",
      "The event provided an important platform for attendees to connect, exchange ideas and explore opportunities for greater collaboration within the construction sector. Discussions focused on strengthening professional relationships, developing new partnerships and supporting the future growth of the industry.",
      "The gathering also highlighted the growing contribution of British Bangladeshi professionals and businesses to the UK construction sector, while encouraging greater cooperation and knowledge-sharing across the community.",
      "BBCA thanked everyone who attended and contributed to making the event a memorable and successful occasion."
    ),
  },
  {
    slug: "build-festival-london-2026",
    category: "NEWS, PRESS RELEASE",
    title:
      "BBCA Announces British Bangladeshi Build Festival in London This November",
    publishedAt: "2026-08-01",
    order: 0,
    coverImageUrl: "/build-festival-logo.svg",
    imageFit: "CONTAIN",
    excerpt:
      "The British Bangladeshi Build Festival London 2026 will bring the construction sector together this November for a celebration of industry, innovation and opportunity.",
    body: p(
      "London, August 2026 — The British Bangladeshi Construction Association (BBCA) has announced that it will host the British Bangladeshi Build Festival London 2026 this November.",
      "The festival is set to bring together construction professionals, business owners, developers, contractors, architects, engineers, suppliers, investors and community leaders for a major celebration of industry, innovation and opportunity.",
      "Organised by BBCA, the event will provide a platform for professionals and businesses across the UK construction sector to connect, exchange ideas and explore new opportunities for collaboration and growth.",
      "The festival will feature networking opportunities, exhibitions, expert discussions, business showcases and career opportunities, while also recognising the achievements and contributions of British Bangladeshi professionals and businesses within the UK construction industry.",
      "BBCA said the festival aims to strengthen industry connections, promote innovation and create greater opportunities for the next generation of professionals and entrepreneurs.",
      "Further details about the programme, speakers, exhibitors and venue are expected to be announced ahead of the event."
    ),
  },
  {
    slug: "membership-open-construction-sector",
    category: "NEWS, MEMBERSHIP",
    title:
      "BBCA Opens Membership to Professionals Across the Construction Sector",
    publishedAt: "2026-08-01",
    order: 1,
    coverImageUrl: "/membership-open.jpg",
    imageFit: "COVER",
    excerpt:
      "Architects, plumbers, builders, electricians, engineers, contractors, developers and suppliers are invited to join BBCA's growing professional network.",
    body: p(
      "London, August 2026 — The British Bangladeshi Construction Association (BBCA) is inviting professionals from across the construction industry to become members of the organisation.",
      "Architects, plumbers, builders, electricians, engineers, contractors, developers, suppliers and others working within the construction sector are encouraged to join BBCA and become part of its growing professional network.",
      "BBCA membership is designed to bring together people from different areas of the industry, creating opportunities for networking, collaboration, business development, professional support and greater engagement within the wider construction community.",
      "Anyone working in the construction sector who is interested in becoming a BBCA member can apply by completing and submitting the membership form available on the BBCA website.",
      "The association continues to expand its network with the aim of connecting professionals, supporting businesses and strengthening the voice of the British Bangladeshi community within the UK construction industry."
    ),
  },
];

const VIDEOS = [
  {
    videoId: "AXMkjkDWADg",
    title:
      "A memorable gathering of the British Bangladeshi Construction Association (BBCA)",
    order: 0,
  },
];

const sql = neon(databaseUrl);

for (const a of ARTICLES) {
  const rows = await sql`
    INSERT INTO "News" ("id", "title", "slug", "category", "excerpt", "body",
                        "coverImageUrl", "imageFit", "status", "publishedAt",
                        "order", "updatedAt")
    VALUES (${randomUUID()}, ${a.title}, ${a.slug}, ${a.category}, ${a.excerpt},
            ${a.body}, ${a.coverImageUrl}, ${a.imageFit}::"ImageFit", 'PUBLISHED',
            ${a.publishedAt}::timestamp, ${a.order}, NOW())
    ON CONFLICT ("slug") DO NOTHING
    RETURNING "slug"
  `;
  console.log(rows.length ? `Created: ${a.slug}` : `Exists, skipped: ${a.slug}`);
}

for (const v of VIDEOS) {
  const existing = await sql`SELECT "id" FROM "HomeVideo" WHERE "videoId" = ${v.videoId}`;
  if (existing.length) {
    console.log(`Exists, skipped video: ${v.videoId}`);
    continue;
  }
  await sql`
    INSERT INTO "HomeVideo" ("id", "videoId", "title", "order", "published", "updatedAt")
    VALUES (${randomUUID()}, ${v.videoId}, ${v.title}, ${v.order}, true, NOW())
  `;
  console.log(`Created video: ${v.videoId}`);
}

console.log("Done.");
