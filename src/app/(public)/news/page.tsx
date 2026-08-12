import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { ARTICLES, isSvg, type Article } from "@/lib/news";

export const metadata = {
  title: "News & Insights | BBCA",
  description:
    "News, events and press releases from the British Bangladeshi Construction Association.",
};

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
  const isContain = article.imageFit === "contain";

  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex flex-col rounded-[14px] border border-[#E3E7ED] overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-transparent"
    >
      <div
        className={`relative w-full shrink-0 overflow-hidden ${
          isContain ? "bg-[#F5F7FA]" : "bg-[#c4cbd6]"
        }`}
        style={{ aspectRatio: "16 / 10" }}
      >
        <Image
          src={article.image}
          alt={article.title}
          fill
          unoptimized={isSvg(article.image)}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
          className={
            isContain
              ? "object-contain p-5"
              : "object-cover transition-transform duration-500 group-hover:scale-105"
          }
        />
      </div>

      {/* Body */}
      <div style={{ padding: "20px 20px 24px" }}>
        <p
          className="font-bold uppercase text-[#6E7A8C] mb-[10px]"
          style={{ fontSize: "11px", letterSpacing: "0.6px" }}
        >
          {article.category}
        </p>

        <h2
          className="font-bold text-[#1B2A52] mb-[10px]"
          style={{ fontSize: "var(--text-f16-5)", lineHeight: "1.35" }}
        >
          {article.title}
        </h2>

        <p
          className="text-[#6E7A8C] mb-[14px]"
          style={{ fontSize: "13.5px", lineHeight: "1.6" }}
        >
          {article.excerpt}
        </p>

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
