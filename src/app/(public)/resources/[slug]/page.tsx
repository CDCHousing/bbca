import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, ChevronLeft } from "lucide-react";
import PageHero from "@/components/PageHero";
import SeatBookingForm from "@/components/SeatBookingForm";
import { prisma } from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";
import { isPastEvent } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 60;

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function getResource(slug: string) {
  return prisma.resource.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResource(slug);

  if (!resource || resource.status !== "PUBLISHED") {
    return { title: "Not Found | BBCA" };
  }

  return {
    title: `${resource.title} | BBCA`,
    description: resource.excerpt ?? undefined,
    openGraph: {
      title: resource.title,
      description: resource.excerpt ?? undefined,
      images: resource.coverImageUrl ? [resource.coverImageUrl] : undefined,
      type: "article",
    },
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = await getResource(slug);

  if (!resource || resource.status !== "PUBLISHED") {
    notFound();
  }

  const isPast = isPastEvent(resource.eventDate);
  const bookingOpen = resource.bookingEnabled && !isPast;

  return (
    <>
      <PageHero title={resource.title} />

      <section className="bg-white py-14" style={{ paddingBottom: "80px" }}>
        <div className="max-w-[1160px] mx-auto px-6">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1 text-[#6E7A8C] hover:text-[#1B2A52] mb-8 font-semibold"
            style={{ fontSize: "13.5px" }}
          >
            <ChevronLeft size={15} strokeWidth={2.5} />
            Back to Resource &amp; Knowledge
          </Link>

          <div
            className={
              bookingOpen
                ? "grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start"
                : "max-w-[760px]"
            }
          >
            <article>
              {resource.coverImageUrl && (
                // Blob host is not registered in next.config images, so use a plain img.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resource.coverImageUrl}
                  alt={resource.title}
                  className="w-full rounded-[14px] mb-8 object-cover"
                  style={{ aspectRatio: "16 / 9" }}
                />
              )}

              {(resource.eventDate || resource.location) && (
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-7 pb-6 border-b border-[#E3E7ED]">
                  {resource.eventDate && (
                    <span className="inline-flex items-center gap-2 text-[#414C60] font-semibold text-[14px]">
                      <Calendar size={16} strokeWidth={2} className="text-[#DA9028]" />
                      {formatDate(resource.eventDate)}
                      {isPast && (
                        <span className="text-[#D0202F] font-bold">· Closed</span>
                      )}
                    </span>
                  )}
                  {resource.location && (
                    <span className="inline-flex items-center gap-2 text-[#414C60] font-semibold text-[14px]">
                      <MapPin size={16} strokeWidth={2} className="text-[#DA9028]" />
                      {resource.location}
                    </span>
                  )}
                </div>
              )}

              <div
                className="text-[#414C60] [&_h2]:text-[#1B2A52] [&_h2]:font-bold [&_h2]:text-[24px] [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-[#1B2A52] [&_h3]:font-bold [&_h3]:text-[19px] [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:text-[16px] [&_p]:leading-[1.75] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1.5 [&_li]:text-[16px] [&_li]:leading-[1.7] [&_a]:text-[#D0202F] [&_a]:underline [&_img]:rounded-[12px] [&_img]:my-6 [&_img]:max-w-full [&_img]:h-auto [&_blockquote]:border-l-4 [&_blockquote]:border-[#DA9028] [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:my-5 [&_hr]:my-8 [&_hr]:border-[#E3E7ED] [&_strong]:text-[#1B2A52]"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(resource.body) }}
              />

              {resource.bookingEnabled && isPast && (
                <div
                  className="mt-8 rounded-[12px] border border-[#E3E7ED] bg-[#F5F7FA] text-[#6E7A8C]"
                  style={{ padding: "16px 20px", fontSize: "14px" }}
                >
                  Booking has closed for this event.
                </div>
              )}
            </article>

            {bookingOpen && (
              <aside className="lg:sticky lg:top-28">
                <SeatBookingForm slug={resource.slug} title={resource.title} />
              </aside>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
