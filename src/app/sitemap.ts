import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getPublishedNews } from "@/lib/news";
import { siteUrl } from "@/lib/site";

const STATIC_PATHS = [
  "/",
  "/about",
  "/why-join",
  "/membership",
  "/association-leadership",
  "/news",
  "/resources",
  "/gallery",
  "/contact",
  "/build-festival/stall-booking",
  "/build-festival/visitor-registration",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, resources] = await Promise.all([
    getPublishedNews(),
    prisma.resource.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
    })),
    ...news.map((article) => ({
      url: `${siteUrl}/news/${article.slug}`,
      lastModified: article.updatedAt,
    })),
    ...resources.map((resource) => ({
      url: `${siteUrl}/resources/${resource.slug}`,
      lastModified: resource.updatedAt,
    })),
  ];
}
