import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { ARTICLES, getArticle, isSvg } from "@/lib/news";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) return { title: "Not Found | BBCA" };

  return {
    title: `${article.title} | BBCA`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) notFound();

  const isContain = article.imageFit === "contain";

  return (
    <section className="bg-white py-14" style={{ paddingBottom: "80px" }}>
      <div className="max-w-[780px] mx-auto px-6">
        {/* Back link */}
        <Link
          href="/news"
          className="inline-flex items-center gap-1 text-[#6E7A8C] mb-8 transition-colors duration-150 hover:text-[#D0202F]"
          style={{ fontSize: "13.5px" }}
        >
          <ChevronLeft size={15} strokeWidth={2.5} />
          Back to News &amp; Events
        </Link>

        {/* Category */}
        <p
          className="font-bold uppercase text-[#D0202F] mb-[14px]"
          style={{ fontSize: "11.5px", letterSpacing: "0.6px" }}
        >
          {article.category}
        </p>

        <h1
          className="font-bold text-[#1B2A52] mb-[18px]"
          style={{
            fontSize: "36px",
            letterSpacing: "-0.6px",
            lineHeight: "1.15",
          }}
        >
          {article.title}
        </h1>

        {/* Meta */}
        <p className="text-[#6E7A8C] mb-8" style={{ fontSize: "14px" }}>
          By BBCA Editorial
          <span className="mx-2 select-none" aria-hidden="true">
            ·
          </span>
          {article.date}
        </p>

        {/* Hero image */}
        <div
          className={`relative w-full rounded-[14px] overflow-hidden mb-[34px] ${
            isContain ? "bg-[#F5F7FA]" : "bg-[#c4cbd6]"
          }`}
          style={{ aspectRatio: "16 / 9" }}
        >
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            unoptimized={isSvg(article.image)}
            sizes="(max-width: 820px) 100vw, 780px"
            className={isContain ? "object-contain p-8" : "object-cover"}
          />
        </div>

        {/* Article body */}
        <div
          className="flex flex-col text-[#414C60]"
          style={{ fontSize: "16.5px", lineHeight: "1.8", gap: "20px" }}
        >
          {article.body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        {/* Next articles */}
        <div className="mt-14 pt-10 border-t border-[#E3E7ED]">
          <h2
            className="font-bold text-[#1B2A52] mb-5"
            style={{ fontSize: "19px" }}
          >
            More from BBCA
          </h2>
          <div className="flex flex-col gap-4">
            {ARTICLES.filter((other) => other.slug !== article.slug).map(
              (other) => (
                <Link
                  key={other.slug}
                  href={`/news/${other.slug}`}
                  className="group flex items-center gap-4"
                >
                  <div
                    className={`relative w-[92px] shrink-0 rounded-lg overflow-hidden ${
                      other.imageFit === "contain"
                        ? "bg-[#F5F7FA]"
                        : "bg-[#c4cbd6]"
                    }`}
                    style={{ aspectRatio: "16 / 10" }}
                  >
                    <Image
                      src={other.image}
                      alt={other.title}
                      fill
                      unoptimized={isSvg(other.image)}
                      sizes="92px"
                      className={
                        other.imageFit === "contain"
                          ? "object-contain p-2"
                          : "object-cover"
                      }
                    />
                  </div>
                  <span
                    className="font-semibold text-[#1B2A52] group-hover:text-[#D0202F] transition-colors"
                    style={{ fontSize: "15px", lineHeight: "1.4" }}
                  >
                    {other.title}
                  </span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
