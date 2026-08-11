import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PageHero from "@/components/PageHero";

interface Article {
  slug: string;
  category: string;
  title: string;
}

const ARTICLES: Article[] = [
  {
    slug: "bbca-launch",
    category: "NEWS, BBCA",
    title: "Building What's Next: A BBCA Launch Celebration in London",
  },
  {
    slug: "presidents-update",
    category: "NEWS, INTERVIEW",
    title: "President's update: We're building momentum across the sector",
  },
  {
    slug: "skills-training-partnership",
    category: "NEWS, PRESS RELEASE",
    title: "Skills & training partnership announced for 2026 cohort",
  },
  {
    slug: "business-forum-spring",
    category: "NEWS, EVENTS",
    title: "BBCA Business Forum brings members together this spring",
  },
  {
    slug: "celebrating-achievement",
    category: "NEWS, COMMUNITY",
    title: "Celebrating British Bangladeshi achievement in construction",
  },
  {
    slug: "build-festival-2026",
    category: "NEWS, PRESS RELEASE",
    title: "British Bangladeshi Build Festival London 2026 confirmed",
  },
];

export default function NewsPage() {
  return (
    <>
      <PageHero title="News & Insights" />

      <section className="bg-white py-14" style={{ paddingBottom: "80px" }}>
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex flex-col rounded-[14px] border border-[#E3E7ED] overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-transparent"
    >
      {/* Image placeholder — 16:10 aspect */}
      <div
        className="w-full bg-[#c4cbd6] shrink-0"
        style={{ aspectRatio: "16 / 10" }}
      />

      {/* Body */}
      <div style={{ padding: "20px 20px 24px" }}>
        <p
          className="font-bold uppercase text-[#6E7A8C] mb-[10px]"
          style={{ fontSize: "11px", letterSpacing: "0.6px" }}
        >
          {article.category}
        </p>

        <h2
          className="font-bold text-[#1B2A52] mb-[14px]"
          style={{ fontSize: "16.5px", lineHeight: "1.35" }}
        >
          {article.title}
        </h2>

        <span
          className="inline-flex items-center gap-1 font-semibold text-[#D0202F] transition-gap duration-150"
          style={{ fontSize: "13.5px" }}
        >
          Read More
          <ChevronRight size={15} strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}
