import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { formatNewsDate, getNewsBySlug, getOtherNews } from "@/lib/news";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article || article.status !== "PUBLISHED") {
    return { title: "Not Found | BBCA" };
  }

  return {
    title: `${article.title} | BBCA`,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.coverImageUrl ? [article.coverImageUrl] : undefined,
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article || article.status !== "PUBLISHED") notFound();

  const isContain = article.imageFit === "CONTAIN";
  const others = await getOtherNews(article.slug);

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

        {article.category && (
          <p
            className="font-bold uppercase text-[#D0202F] mb-[14px]"
            style={{ fontSize: "11.5px", letterSpacing: "0.6px" }}
          >
            {article.category}
          </p>
        )}

        <h1
          className="font-bold text-[#1B2A52] mb-[18px]"
          style={{
            fontSize: "var(--text-f36)",
            letterSpacing: "-0.6px",
            lineHeight: "1.15",
          }}
        >
          {article.title}
        </h1>

        {/* Meta */}
        <p className="text-[#6E7A8C] mb-8" style={{ fontSize: "14px" }}>
          By BBCA Editorial
          {article.publishedAt && (
            <>
              <span className="mx-2 select-none" aria-hidden="true">
                ·
              </span>
              {formatNewsDate(article.publishedAt)}
            </>
          )}
        </p>

        {/* Hero image */}
        {article.coverImageUrl && (
          <div
            className={`relative w-full rounded-[14px] overflow-hidden mb-[34px] ${
              isContain ? "bg-[#F5F7FA]" : "bg-[#c4cbd6]"
            }`}
            style={{ aspectRatio: "16 / 9" }}
          >
            {/* Blob host is not in next.config images, so use a plain img. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className={`absolute inset-0 w-full h-full ${
                isContain ? "object-contain p-8" : "object-cover"
              }`}
            />
          </div>
        )}

        {/* Article body — rich text from the admin editor, sanitised before render. */}
        <div
          className="text-[#414C60] [&_h2]:text-[#1B2A52] [&_h2]:font-bold [&_h2]:text-f24 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-[#1B2A52] [&_h3]:font-bold [&_h3]:text-f19 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:text-f16 [&_p]:leading-[1.8] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1.5 [&_li]:text-f16 [&_li]:leading-[1.7] [&_a]:text-[#D0202F] [&_a]:underline [&_img]:rounded-[12px] [&_img]:my-6 [&_img]:max-w-full [&_img]:h-auto [&_blockquote]:border-l-4 [&_blockquote]:border-[#DA9028] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:my-5 [&_hr]:my-8 [&_hr]:border-[#E3E7ED] [&_strong]:text-[#1B2A52]"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.body) }}
        />

        {/* Next articles */}
        {others.length > 0 && (
          <div className="mt-14 pt-10 border-t border-[#E3E7ED]">
            <h2
              className="font-bold text-[#1B2A52] mb-5"
              style={{ fontSize: "var(--text-f19)" }}
            >
              More from BBCA
            </h2>
            <div className="flex flex-col gap-4">
              {others.map((other) => (
                <Link
                  key={other.id}
                  href={`/news/${other.slug}`}
                  className="group flex items-center gap-4"
                >
                  <div
                    className={`relative w-[92px] shrink-0 rounded-lg overflow-hidden ${
                      other.imageFit === "CONTAIN" ? "bg-[#F5F7FA]" : "bg-[#c4cbd6]"
                    }`}
                    style={{ aspectRatio: "16 / 10" }}
                  >
                    {other.coverImageUrl && (
                      // Blob host is not in next.config images, so use a plain img.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={other.coverImageUrl}
                        alt={other.title}
                        className={`absolute inset-0 w-full h-full ${
                          other.imageFit === "CONTAIN"
                            ? "object-contain p-2"
                            : "object-cover"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className="font-semibold text-[#1B2A52] group-hover:text-[#D0202F] transition-colors"
                    style={{ fontSize: "15px", lineHeight: "1.4" }}
                  >
                    {other.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
