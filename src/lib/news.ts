/**
 * Hardcoded News & Events content.
 *
 * The `News` table and `/admin/news` CRUD already exist, but the launch content
 * is authored here so the site can go live before the admin panel is populated.
 * Swap these reads for `prisma.news.findMany()` once real articles are entered.
 */
export interface Article {
  slug: string;
  category: string;
  title: string;
  /** Display string only — these are month-level dates, not full timestamps. */
  date: string;
  image: string;
  /** The Build Festival asset is a portrait logo, so it must letterbox, not crop. */
  imageFit: "cover" | "contain";
  excerpt: string;
  body: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: "bbca-gathering-construction-professionals",
    category: "NEWS, EVENTS",
    title:
      "BBCA Gathering Brings Together Construction Professionals and Community Leaders",
    date: "May 2026",
    image: "/pic.png",
    imageFit: "cover",
    excerpt:
      "BBCA hosted a successful gathering, bringing together construction professionals, entrepreneurs, business leaders and members of the wider community.",
    body: [
      "May 2026 — The British Bangladeshi Construction Association (BBCA) hosted a successful gathering, bringing together construction professionals, entrepreneurs, business leaders and members of the wider community.",
      "The event provided an important platform for attendees to connect, exchange ideas and explore opportunities for greater collaboration within the construction sector. Discussions focused on strengthening professional relationships, developing new partnerships and supporting the future growth of the industry.",
      "The gathering also highlighted the growing contribution of British Bangladeshi professionals and businesses to the UK construction sector, while encouraging greater cooperation and knowledge-sharing across the community.",
      "BBCA thanked everyone who attended and contributed to making the event a memorable and successful occasion.",
    ],
  },
  {
    slug: "build-festival-london-2026",
    category: "NEWS, PRESS RELEASE",
    title:
      "BBCA Announces British Bangladeshi Build Festival in London This November",
    date: "August 2026",
    image: "/build-festival-logo.svg",
    imageFit: "contain",
    excerpt:
      "The British Bangladeshi Build Festival London 2026 will bring the construction sector together this November for a celebration of industry, innovation and opportunity.",
    body: [
      "London, August 2026 — The British Bangladeshi Construction Association (BBCA) has announced that it will host the British Bangladeshi Build Festival London 2026 this November.",
      "The festival is set to bring together construction professionals, business owners, developers, contractors, architects, engineers, suppliers, investors and community leaders for a major celebration of industry, innovation and opportunity.",
      "Organised by BBCA, the event will provide a platform for professionals and businesses across the UK construction sector to connect, exchange ideas and explore new opportunities for collaboration and growth.",
      "The festival will feature networking opportunities, exhibitions, expert discussions, business showcases and career opportunities, while also recognising the achievements and contributions of British Bangladeshi professionals and businesses within the UK construction industry.",
      "BBCA said the festival aims to strengthen industry connections, promote innovation and create greater opportunities for the next generation of professionals and entrepreneurs.",
      "Further details about the programme, speakers, exhibitors and venue are expected to be announced ahead of the event.",
    ],
  },
  {
    slug: "membership-open-construction-sector",
    category: "NEWS, MEMBERSHIP",
    title:
      "BBCA Opens Membership to Professionals Across the Construction Sector",
    date: "August 2026",
    image: "/membership-open.jpg",
    imageFit: "cover",
    excerpt:
      "Architects, plumbers, builders, electricians, engineers, contractors, developers and suppliers are invited to join BBCA's growing professional network.",
    body: [
      "London, August 2026 — The British Bangladeshi Construction Association (BBCA) is inviting professionals from across the construction industry to become members of the organisation.",
      "Architects, plumbers, builders, electricians, engineers, contractors, developers, suppliers and others working within the construction sector are encouraged to join BBCA and become part of its growing professional network.",
      "BBCA membership is designed to bring together people from different areas of the industry, creating opportunities for networking, collaboration, business development, professional support and greater engagement within the wider construction community.",
      "Anyone working in the construction sector who is interested in becoming a BBCA member can apply by completing and submitting the membership form available on the BBCA website.",
      "The association continues to expand its network with the aim of connecting professionals, supporting businesses and strengthening the voice of the British Bangladeshi community within the UK construction industry.",
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

/**
 * next/image returns 400 for SVG sources unless `dangerouslyAllowSVG` is on,
 * which we deliberately leave off because the admin panel accepts uploads.
 * SVG articles must pass `unoptimized` instead.
 */
export function isSvg(src: string): boolean {
  return src.toLowerCase().endsWith(".svg");
}
