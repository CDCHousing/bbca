import Link from "next/link";
import { ChevronRight, Calendar, MapPin } from "lucide-react";
import PageHero from "@/components/PageHero";
import { prisma } from "@/lib/prisma";
import { isPastEvent } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resource & Knowledge | BBCA",
  description:
    "Upcoming workshops, training sessions, seminars, and business support resources from BBCA.",
};

// Bookings change the page state, so don't serve a stale cached copy for long.
export const revalidate = 60;

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [
      { eventDate: { sort: "desc", nulls: "last" } },
      { order: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <>
      <PageHero title="Resource & Knowledge" />

      <section className="bg-white py-14" style={{ paddingBottom: "80px" }}>
        <div className="max-w-[1160px] mx-auto px-6">
          {resources.length === 0 ? (
            <div className="max-w-3xl mx-auto text-center py-16">
              <p className="text-[17px] leading-relaxed text-[#414C60]">
                We will soon share updates about our upcoming workshops, training
                sessions, internships, and business support facilities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((r) => {
                const isPast = isPastEvent(r.eventDate);

                return (
                  <Link
                    key={r.id}
                    href={`/resources/${r.slug}`}
                    className="group flex flex-col rounded-[14px] border border-[#E3E7ED] overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-transparent"
                  >
                    <div
                      className="w-full bg-[#c4cbd6] shrink-0 bg-cover bg-center"
                      style={{
                        aspectRatio: "16 / 10",
                        backgroundImage: r.coverImageUrl
                          ? `url(${r.coverImageUrl})`
                          : undefined,
                      }}
                    />

                    <div className="flex flex-col flex-1" style={{ padding: "20px 20px 24px" }}>
                      {r.eventDate && (
                        <p className="flex items-center gap-1.5 font-bold uppercase text-[#6E7A8C] mb-[10px] text-[11px] tracking-[0.6px]">
                          <Calendar size={12} strokeWidth={2.5} />
                          {formatDate(r.eventDate)}
                          {isPast && <span className="text-[#D0202F]">· Closed</span>}
                        </p>
                      )}

                      <h2
                        className="font-bold text-[#1B2A52] mb-[10px]"
                        style={{ fontSize: "16.5px", lineHeight: "1.35" }}
                      >
                        {r.title}
                      </h2>

                      {r.excerpt && (
                        <p className="text-[14px] leading-relaxed text-[#414C60] mb-3 line-clamp-3">
                          {r.excerpt}
                        </p>
                      )}

                      {r.location && (
                        <p className="flex items-center gap-1.5 text-[13px] text-[#6E7A8C] mb-3">
                          <MapPin size={13} strokeWidth={2} />
                          {r.location}
                        </p>
                      )}

                      <span
                        className="mt-auto inline-flex items-center gap-1 font-semibold text-[#D0202F]"
                        style={{ fontSize: "13.5px" }}
                      >
                        {r.bookingEnabled && !isPast ? "Book Your Seat" : "Read More"}
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
