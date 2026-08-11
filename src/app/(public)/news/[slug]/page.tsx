import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function generateStaticParams() {
  return [{ slug: "bbca-launch" }];
}

export default function ArticlePage() {
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
          NEWS, BBCA
        </p>

        {/* H1 */}
        <h1
          className="font-bold text-[#1B2A52] mb-[18px]"
          style={{
            fontSize: "36px",
            letterSpacing: "-0.6px",
            lineHeight: "1.15",
          }}
        >
          Building What&#39;s Next: A BBCA Launch Celebration
        </h1>

        {/* Meta */}
        <p
          className="text-[#6E7A8C] mb-8"
          style={{ fontSize: "14px" }}
        >
          By BBCA Editorial
          <span className="mx-2 select-none" aria-hidden="true">·</span>
          12 May 2026
        </p>

        {/* Hero image placeholder */}
        <div
          className="w-full rounded-[14px] bg-[#c4cbd6] mb-[34px]"
          style={{ aspectRatio: "16 / 9" }}
        />

        {/* Article body */}
        <div
          className="flex flex-col text-[#414C60]"
          style={{ fontSize: "16.5px", lineHeight: "1.8", gap: "20px" }}
        >
          <p>
            The British Bangladeshi Construction Association marked a major milestone this month,
            bringing together members, partners and community leaders to celebrate a new chapter
            for the organisation.
          </p>

          <p>
            Attendees heard from industry figures on the opportunities ahead for British Bangladeshi
            enterprise across the UK construction sector — from major infrastructure projects to
            skills, training and the next generation of professionals entering the trade.
          </p>

          <h3
            className="font-bold text-[#1B2A52] mt-2"
            style={{ fontSize: "21px" }}
          >
            A growing network
          </h3>

          <p>
            With over 164 businesses now connected through the association, the evening underscored
            the value of a united voice and a shared commitment to collaboration, knowledge sharing
            and sustainable growth.
          </p>

          <p>
            The BBCA will continue to host networking meetings, business forums, conferences and
            workshops throughout the year, culminating in the British Bangladeshi Build Festival
            London 2026.
          </p>
        </div>
      </div>
    </section>
  );
}
