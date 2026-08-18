import { prisma } from "@/lib/prisma";

/**
 * News & Events content, managed entirely from /admin/news.
 *
 * Ordering matches the admin list: newest publish date first, `order` as the
 * tie-breaker, and undated drafts-turned-live fall to the bottom.
 */
const NEWS_ORDER = [
  { publishedAt: { sort: "desc", nulls: "last" } as const },
  { order: "asc" as const },
  { createdAt: "desc" as const },
];

export function getPublishedNews(take?: number) {
  return prisma.news.findMany({
    where: { status: "PUBLISHED" },
    orderBy: NEWS_ORDER,
    ...(take ? { take } : {}),
  });
}

export function getNewsBySlug(slug: string) {
  return prisma.news.findUnique({ where: { slug } });
}

/** Other published articles, for the "More from BBCA" block. */
export function getOtherNews(excludeSlug: string, take = 3) {
  return prisma.news.findMany({
    where: { status: "PUBLISHED", slug: { not: excludeSlug } },
    orderBy: NEWS_ORDER,
    take,
  });
}

export function formatNewsDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
