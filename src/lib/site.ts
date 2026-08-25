/**
 * Canonical origin for absolute URLs (metadataBase, sitemap, robots, OG tags).
 *
 * Set NEXT_PUBLIC_SITE_URL in Vercel to the live custom domain. Falls back to
 * the Vercel-assigned production URL, then localhost for `next dev`.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
