import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { formatNewsDate, getPublishedNews } from "@/lib/news";

export const metadata = {
  title: "News & Insights | BBCA",
  description:
    "News, events and press releases from the British Bangladeshi Construction Association.",
};

// Admin edits should appear without a redeploy.
export const revalidate = 60;

export default async function NewsPage() {
  const articles = await getPublishedNews();

  return (
    <>
      <PageHero title="News & Insights" />

      <section className="bg-white py-14" style={{ paddingBottom: "80px" }}>
        <div className="max-w-[1160px] mx-auto px-6">
          {articles.length === 0 ? (
            <div className="max-w-3xl mx-auto text-center py-16">
              <p className="text-f17 leading-relaxed text-[#414C60]">
                We will share news, events and press releases here soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => {
                const isContain = article.imageFit === "CONTAIN";

                return (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group flex flex-col rounded-[14px] border border-[#E3E7ED] overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-transparent"
                  >
                    <div
                      className={`relative w-full shrink-0 overflow-hidden ${
                        isContain ? "bg-[#F5F7FA]" : "bg-[#c4cbd6]"
                      }`}
                      style={{ aspectRatio: "16 / 10" }}
                    >
                      {article.coverImageUrl && (
                        // Blob host is not in next.config images, so use a plain img.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={article.coverImageUrl}
                          alt={article.title}
                          className={`absolute inset-0 w-full h-full ${
                            isContain
                              ? "object-contain p-5"
                              : "object-cover transition-transform duration-500 group-hover:scale-105"
                          }`}
                        />
                      )}
                    </div>

                    <div style={{ padding: "20px 20px 24px" }}>
                      {(article.category || article.publishedAt) && (
                        <p
                          className="font-bold uppercase text-[#6E7A8C] mb-[10px]"
                          style={{ fontSize: "11px", letterSpacing: "0.6px" }}
                        >
                          {article.category ?? formatNewsDate(article.publishedAt)}
                        </p>
                      )}

                      <h2
                        className="font-bold text-[#1B2A52] mb-[10px]"
                        style={{ fontSize: "var(--text-f16-5)", lineHeight: "1.35" }}
                      >
                        {article.title}
                      </h2>

                      {article.excerpt && (
                        <p
                          className="text-[#6E7A8C] mb-[14px]"
                          style={{ fontSize: "13.5px", lineHeight: "1.6" }}
                        >
                          {article.excerpt}
                        </p>
                      )}

                      <span
                        className="inline-flex items-center gap-1 font-semibold text-[#D0202F]"
                        style={{ fontSize: "13.5px" }}
                      >
                        Read More
                        <ChevronRight size={15} strokeWidth={2.5} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
