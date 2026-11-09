import type { Metadata } from "next";
import Link from "next/link";
import { Play, MapPin, Clock, CalendarDays, ArrowRight, ArrowUpRight } from "lucide-react";
import BuildFestivalLogo from "@/components/BuildFestivalLogo";
import SponsorCarousel from "@/components/SponsorCarousel";
import FacebookEmbed from "@/components/FacebookEmbed";
import ContactBubble from "@/components/ContactBubble";
import VenueMap from "@/components/VenueMap";

export const metadata: Metadata = {
  title: "Build Festival 2026",
  description:
    "British Bangladeshi Build Festival London 2026 — construction, jobs and a concert, hosted by BBCA.",
};

// Placeholder content — swap for real data once confirmed.
const VENUE_NAME = "The Royal Regency";
const VENUE = "501 High St N, London E12 6TH";
const VENUE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${VENUE_NAME}, ${VENUE}`)}`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${VENUE_NAME}, ${VENUE}`)}`;
const EVENT_DATE = "29 November 2026";
const EVENT_TIME = "1:00 PM – 9:00 PM";
const EVENT_PHONE = "07913 185391";
const EVENT_PHONE_TEL = "+447913185391";
const EVENT_EMAIL = "contact@bbcauk.org";

// Moving bar under the hero video, styled after the footer marquee.
const HIGHLIGHTS = ["Construction", "Jobs", "Concert"];
const STAR_COLORS = ["#DA9028", "#D0202F", "#0A7D3E"];
const MARQUEE_CSS = `
@keyframes bf-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.bf-marquee { animation: bf-marquee 30s linear infinite; }
@media (prefers-reduced-motion: reduce) { .bf-marquee { animation: none; } }
`;

// One half of the loop. Repeated so each half is wider than the screen.
function MarqueeHalf() {
  return (
    <div className="flex items-center gap-10 md:gap-14 px-5 md:px-7">
      {Array.from({ length: 4 }).flatMap((_, r) =>
        HIGHLIGHTS.map((label, i) => (
          <span key={`${r}-${label}`} className="flex items-center gap-10 md:gap-14">
            <span>{label}</span>
            <span style={{ color: STAR_COLORS[i] }}>✦</span>
          </span>
        )),
      )}
    </div>
  );
}

const SECTION_LINKS = [
  { label: "Join Us", href: "#join" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Exhibitors", href: "#exhibitors" },
  { label: "Map Plan", href: "#map" },
  { label: "Programme", href: "#programme" },
  { label: "Fire Safety", href: "#fire-safety" },
  { label: "Venue", href: "#venue" },
];
// Festival-logo colours cycled across the section strip's underlines and dots.
const STRIP_COLORS = ["#0A7D3E", "#DA9028", "#D0202F", "#0044b2"];

// Logos are the upscaled public/Asset N.svg exports. Their numbers don't follow the sponsor
// sheet order, so each logo is mapped by hand. Four companies came through blank in the
// upscaled export (MB(S) Builders, Beneco, Bangladesh Caterers, 2A News); those use the
// previous export, kept in public/sponsor-logos-original/. BBCCI and The Royal Regency are
// cropped in every Illustrator export, so they are the full images pulled straight out of
// design-reference/SPONSORS  logo Fixed (mostly).ai (colour-matched to the export), in
// public/sponsor-logos-ai/.
const logo = (n: number) => encodeURI(`/Asset ${n}.svg`);
const originalLogo = (n: number) => encodeURI(`/sponsor-logos-original/Asset ${n}.svg`);

const TITLE_SPONSOR = { name: "Work Permit Cloud", logo: logo(1) };

// One carousel per tier. Rows alternate direction: right-to-left, then left-to-right.
const SPONSOR_TIERS = [
  {
    tier: "Gold Sponsors",
    color: "#DA9028",
    size: "lg" as const,
    sponsors: [
      { name: "Everard Construction Management", logo: logo(2) },
      { name: "Creative Design & Construction Limited", logo: logo(3) },
      { name: "Landview", logo: logo(4) },
      { name: "Saleh Builders", logo: logo(5) },
      { name: "East London Metal Engineering", logo: logo(6) },
      { name: "MB (S) Builders", logo: originalLogo(9) },
    ],
  },
  {
    tier: "Silver Sponsors",
    color: "#6E7A8C",
    size: "md" as const,
    sponsors: [
      { name: "Lomash Wood", logo: logo(8) },
      { name: "Manor Glazing", logo: logo(9) },
      { name: "Interior Studio", logo: logo(10) },
      { name: "Cosmic Facility Services", logo: logo(11) },
      { name: "CDC Housing", logo: logo(12) },
      { name: "Pedley Electric", logo: logo(13) },
      { name: "Sterlix IT", logo: logo(14) },
      { name: "OpenDoor Mortgages", logo: logo(15) },
      { name: "Morgan Knights Real Estate", logo: logo(18) },
      { name: "Acumen Accountants & Tax Advisers", logo: logo(17) },
      { name: "Beneco Financial Services", logo: originalLogo(20) },
    ],
  },
  {
    tier: "In Association With",
    color: "#0A7D3E",
    size: "md" as const,
    sponsors: [
      { name: "British Bangladeshi Chamber of Commerce & Industry", logo: "/sponsor-logos-ai/bbcci.png" },
      { name: "Bangladesh High Commission London", logo: logo(21) },
      { name: "The Royal Regency London", logo: "/sponsor-logos-ai/royal-regency.png" },
      { name: "Bangladesh Caterers Association", logo: originalLogo(24) },
    ],
  },
  {
    tier: "Media Partners",
    color: "#D0202F",
    size: "md" as const,
    sponsors: [
      { name: "iON TV", logo: logo(28) },
      { name: "ATN Bangla", logo: logo(27) },
      { name: "Channel S", logo: logo(26) },
      { name: "2A News", logo: originalLogo(28) },
      { name: "Top News", logo: logo(23) },
      { name: "Q News", logo: logo(34) },
      { name: "Channel TS", logo: logo(33) },
      { name: "Hawa TV", logo: logo(31) },
      { name: "Iqra Bangla", logo: logo(30) },
      { name: "TV3 Bangla", logo: logo(29) },
    ],
  },
];

// Video posts in the Build Festival Facebook event. The facebook.com/share/p/... links
// redirect here; Facebook's embed plugin only accepts these canonical permalinks.
const FESTIVAL_EVENT_URL = "https://www.facebook.com/events/1538306701317288/";
const FESTIVAL_VIDEOS = [
  "1557710066043618",
  "1563221965492428",
  "1569504128197545",
  "1592042619277029",
  "1589827229498568",
  "1570466948101263",
].map((id) => `${FESTIVAL_EVENT_URL}permalink/${id}/`);

// From the fascia name plaque sheet (J46307), 22 stalls. Index + 1 = stall number.
// Stall 20 is London Training Centre (per the sheet's stall notes, not the duplicate JA Builders row).
// Logos reuse the sponsor assets; exhibitors without one get a monogram.
const EXHIBITORS: { name: string; logo?: string }[] = [
  { name: "Ultimate Accounting & Tax Solutions" },
  { name: "Sterlix IT", logo: logo(14) },
  { name: "MB(S) Builders Ltd", logo: originalLogo(9) },
  { name: "Beneco Financial Services", logo: originalLogo(20) },
  { name: "Creative Design & Construction Limited", logo: logo(3) },
  { name: "Lomash Wood", logo: logo(8) },
  { name: "River Finance" },
  { name: "Morgan Knights", logo: logo(18) },
  { name: "Pedley Electric", logo: logo(13) },
  { name: "Cosmic Facility Services", logo: logo(11) },
  { name: "JA Builders Limited" },
  { name: "Acumen Accountants & Tax Advisers", logo: logo(17) },
  { name: "Open Door Mortgages", logo: logo(15) },
  { name: "Interior Studio Ltd", logo: logo(10) },
  { name: "Manor Glazing", logo: logo(9) },
  { name: "CDC Housing", logo: logo(12) },
  { name: "New City Solicitors" },
  { name: "East London Metal", logo: logo(6) },
  { name: "Landview Construction", logo: logo(4) },
  { name: "London Training Centre" },
  { name: "Simply Flooring and Furniture" },
  { name: "Elite Press" },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w) && !["and", "of"].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

// Session titles only, from the final itinerary in "Event Itinerary.docx" (the timeline at the
// end of the document, which supersedes the draft at the top).
const PROGRAMME = [
  { time: "1:00 – 1:30 PM", title: "Guest Arrival & Registration" },
  { time: "1:30 – 1:45 PM", title: "Zohur Prayer Break" },
  { time: "1:45 – 2:30 PM", title: "Official Opening" },
  { time: "2:30 – 3:00 PM", title: "Food & Refreshment Break" },
  { time: "3:00 – 3:35 PM", title: "Panel Discussion & Student Job Session (CV Drop)" },
  { time: "3:40 – 4:20 PM", title: "How to Buy a Property in the UK: First-Time Buyers" },
  { time: "4:30 – 5:00 PM", title: "Building the Future: Construction Management, Building Safety & Sustainability" },
  { time: "5:00 – 6:15 PM", title: "Exhibition & Networking" },
  { time: "6:15 – 7:45 PM", title: "Concert" },
  { time: "7:45 – 8:15 PM", title: "Dinner & Networking" },
  { time: "8:15 – 8:40 PM", title: "Special Guest Address & Closing Session" },
  { time: "8:40 – 9:00 PM", title: "Vote of Thanks" },
];

export default function BuildFestivalPage() {
  return (
    <>
      {/* Festival header */}
      {/* Event contact details live in a floating bubble, top-right */}
      <ContactBubble
        phone={EVENT_PHONE}
        phoneTel={EVENT_PHONE_TEL}
        email={EVENT_EMAIL}
        venueName={VENUE_NAME}
        venueAddress={VENUE}
        mapUrl={VENUE_MAP_URL}
      />
      <header className="bg-white text-[#1B2A52]">
        {/* Festival colour band, taken from the logo */}
        <div className="h-1.5 bg-[linear-gradient(90deg,#0A7D3E_0%,#0A7D3E_25%,#DA9028_25%,#DA9028_50%,#D0202F_50%,#D0202F_75%,#1B2A52_75%)]" />
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-4 flex flex-col md:flex-row items-center gap-5 md:gap-10">
          <Link href="/build-festival" className="shrink-0">
            <BuildFestivalLogo className="h-40 md:h-48 w-auto" />
          </Link>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-[clamp(24px,3vw,36px)] font-bold uppercase leading-tight tracking-tight">
              Build Festival 2026
            </h1>
            <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-1.5 text-[15px] md:text-[17px] font-semibold text-[#414C60]">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={17} className="text-[#DA9028] shrink-0" />
                {EVENT_DATE}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={17} className="text-[#DA9028] shrink-0" />
                {EVENT_TIME}
              </span>
            </div>
            <a
              href={VENUE_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-start gap-1.5 text-[15px] md:text-[17px] font-semibold text-[#414C60] hover:text-[#D0202F] transition-colors"
            >
              <MapPin size={17} className="text-[#DA9028] shrink-0 mt-[3px] md:mt-[4px]" />
              <span>
                <span className="text-[#1B2A52]">{VENUE_NAME}</span>, {VENUE}
              </span>
            </a>
          </div>
          {/* QR (with caption centred under it) beside the button; stacks on mobile */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-4 sm:gap-5 shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              <div className="rounded-lg border border-[#E3E7ED] bg-white p-1 shadow-[0_4px_14px_rgba(20,32,61,0.08)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/visitor-registration-qr.svg"
                  alt="QR code linking to Build Festival visitor registration"
                  width={80}
                  height={80}
                  className="block h-20 w-20"
                />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-[#6E7A8C]">Scan to register</span>
            </div>
            <Link
              href="/build-festival/visitor-registration"
              className="inline-flex items-center justify-center gap-2 bg-[#D0202F] text-white font-bold text-[13px] uppercase tracking-[0.5px] px-6 py-3 rounded-full border-2 border-[#D0202F] hover:bg-[#1B2A52] hover:border-[#1B2A52] transition-colors"
            >
              Register as Visitor
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </header>

      {/* Section strip — transparent; each link carries a festival-colour underline that grows on hover */}
      <nav className="border-y border-[#E3E7ED]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex items-center gap-4 sm:gap-5 overflow-x-auto">
          {SECTION_LINKS.map((l, i) => (
            <span key={l.href} className="flex items-center gap-4 sm:gap-5 shrink-0">
              {i > 0 && (
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: STRIP_COLORS[(i - 1) % STRIP_COLORS.length] }}
                />
              )}
              <a
                href={l.href}
                className="group relative py-4 text-[14px] font-bold uppercase tracking-[0.4px] text-[#1B2A52] whitespace-nowrap transition-colors hover:text-[#0044b2]"
              >
                {l.label}
                <span
                  aria-hidden
                  className="absolute left-0 bottom-2.5 h-[3px] w-4 rounded-full transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: STRIP_COLORS[i % STRIP_COLORS.length] }}
                />
              </a>
            </span>
          ))}
          <Link
            href="/"
            className="ml-auto shrink-0 my-2 px-4 py-1.5 rounded-full border border-[#1B2A52]/25 text-[12.5px] font-semibold uppercase tracking-[0.3px] text-[#1B2A52] whitespace-nowrap transition-colors hover:border-[#1B2A52] hover:bg-[#1B2A52] hover:text-white"
          >
            ← BBCA Home
          </Link>
        </div>
      </nav>

      {/* Hero video */}
      <section className="relative h-[60vh] md:h-[calc(100vh-200px)] min-h-[380px] bg-[#14203D] overflow-hidden">
        <video
          src="https://1huk1mplety5hddi.public.blob.vercel-storage.com/hero/BBCA-hero.mp4"
          poster="/bbca-crowd.png"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </section>

      {/* Moving bar: Construction / Jobs / Concert */}
      <div className="w-full overflow-hidden bg-[#14203D] border-y border-white/10 py-3.5 md:py-4">
        <style>{MARQUEE_CSS}</style>
        <p className="sr-only">{HIGHLIGHTS.join(", ")}</p>
        <div
          aria-hidden="true"
          className="bf-marquee flex w-max text-[15px] md:text-[18px] font-bold tracking-[0.25em] text-white uppercase"
        >
          <MarqueeHalf />
          <MarqueeHalf />
        </div>
      </div>

      {/* Join us — visitor registration */}
      <section id="join" className="bg-white py-14 md:py-20">
        <div className="max-w-[1120px] mx-auto px-5 sm:px-6 grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 md:gap-14 items-center">
          <div className="flex justify-center">
            <BuildFestivalLogo className="w-full max-w-[260px] h-auto" />
          </div>
          <div>
            <h2 className="text-f30 font-bold text-[#0A7D3E] tracking-tight mb-5">Join Us</h2>
            <p className="text-[15.5px] leading-relaxed text-[#414C60] mb-4">
              The British Bangladeshi Build Festival London 2026 brings together construction professionals,
              business owners, developers, contractors, architects, engineers, suppliers, investors and community
              leaders for a celebration of industry, innovation and opportunity.
            </p>
            <p className="text-[15.5px] leading-relaxed text-[#414C60] mb-8">
              Entry is by registration. Register as a visitor to receive your visitor card.
            </p>
            <div className="flex flex-wrap items-center gap-5 sm:gap-6">
              <Link
                href="/build-festival/visitor-registration"
                className="group inline-flex items-center gap-3 bg-[#D0202F] text-white font-bold text-[15px] md:text-[16px] uppercase tracking-[0.5px] pl-8 pr-3 py-3 rounded-full shadow-[0_10px_28px_rgba(208,32,47,0.35)] hover:bg-[#1B2A52] hover:shadow-[0_10px_28px_rgba(27,42,82,0.35)] transition-colors"
              >
                Register as Visitor
                <span className="inline-flex w-9 h-9 rounded-full bg-white/20 items-center justify-center transition-transform group-hover:translate-x-1">
                  <ArrowRight size={18} strokeWidth={2.5} />
                </span>
              </Link>
              {/* Same link as a QR code, for scanning from a screen or print */}
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-semibold text-[#6E7A8C]">or scan</span>
                <div className="rounded-xl border border-[#E3E7ED] bg-white p-1.5 shadow-[0_6px_18px_rgba(20,32,61,0.08)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/visitor-registration-qr.svg"
                    alt="QR code linking to Build Festival visitor registration"
                    width={96}
                    height={96}
                    className="block h-24 w-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="bg-[#E4F0F2] py-14 md:py-20 overflow-hidden">
        <div className="max-w-[1120px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-[12px] font-bold uppercase tracking-[2.5px] text-[#D0202F]">Partners</span>
            <h2 className="text-f34 font-bold text-[#1B2A52] tracking-tight mt-2 mb-3">Our Sponsors</h2>
            <p className="text-[15px] text-[#414C60] max-w-[560px] mx-auto">
              The organisations making Build Festival 2026 possible.
            </p>
          </div>

          <div className="space-y-12 md:space-y-14">
            {/* Title sponsor — one fixed tile */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px flex-1 bg-[#1B2A52]/15" />
                <h3 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[2px] text-[#1B2A52]">
                  <span className="w-2 h-2 rounded-full bg-[#1B2A52]" />
                  Title Sponsor
                </h3>
                <span className="h-px flex-1 bg-[#1B2A52]/15" />
              </div>
              <div className="mx-auto max-w-[420px] h-52 md:h-56 bg-white rounded-2xl border-2 border-[#1B2A52] shadow-[0_12px_32px_rgba(27,42,82,0.18)] flex items-center justify-center p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={TITLE_SPONSOR.logo} alt={TITLE_SPONSOR.name} className="max-h-full max-w-full object-contain" />
              </div>
            </div>

            {SPONSOR_TIERS.map(({ tier, sponsors, color, size }, i) => (
              <div key={tier}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="h-px flex-1 bg-[#1B2A52]/15" />
                  <h3 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[2px]" style={{ color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    {tier}
                  </h3>
                  <span className="h-px flex-1 bg-[#1B2A52]/15" />
                </div>
                <SponsorCarousel
                  sponsors={sponsors}
                  color={color}
                  size={size}
                  reverse={i % 2 === 1}
                />
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-[14px] text-[#414C60]">
            Interested in sponsoring?{" "}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 font-semibold text-[#1B2A52] underline underline-offset-4 decoration-[#DA9028] hover:text-[#D0202F] transition-colors"
            >
              Become a Sponsor
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </p>
        </div>
      </section>

      {/* Exhibitors */}
      <section id="exhibitors" className="bg-white py-14 md:py-20">
        <div className="max-w-[1120px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-[12px] font-bold uppercase tracking-[2.5px] text-[#D0202F]">On the show floor</span>
            <h2 className="text-f34 font-bold text-[#1B2A52] tracking-tight mt-2 mb-3">Exhibitor List</h2>
            <p className="text-[15px] text-[#414C60] max-w-[560px] mx-auto">
              {EXHIBITORS.length} exhibitors across the hall. Find them by stall number on the{" "}
              <a href="#map" className="font-semibold text-[#1B2A52] underline underline-offset-4 decoration-[#DA9028] hover:text-[#D0202F] transition-colors">
                map plan
              </a>
              .
            </p>
          </div>

          {/* Each card reads like a stall fascia: number band on top, logo, then the name */}
          <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {EXHIBITORS.map((ex, i) => (
              <li
                key={ex.name}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E3E7ED] shadow-[0_4px_18px_rgba(20,32,61,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(20,32,61,0.14)] hover:border-[#DA9028]/60"
              >
                <div className="flex items-center justify-between bg-[#1B2A52] px-3 sm:px-4 py-2 text-white">
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-[1.5px] text-white/60">Stall</span>
                    <span className="text-[18px] font-extrabold leading-none text-[#DA9028]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                </div>
                <div className="h-24 sm:h-28 flex items-center justify-center p-4 border-b border-[#E3E7ED]">
                  {ex.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ex.logo}
                      alt=""
                      loading="lazy"
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E4F0F2] text-[#1B2A52] flex items-center justify-center text-[18px] sm:text-[20px] font-extrabold tracking-wide ring-2 ring-[#DA9028]/40"
                    >
                      {initials(ex.name)}
                    </span>
                  )}
                </div>
                <div className="flex-1 flex items-center justify-center px-3 py-3 bg-[#F5F7FA] text-center">
                  <span className="text-[13px] sm:text-[14px] font-bold text-[#1B2A52] leading-snug">{ex.name}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Know more — videos from the Facebook event */}
      <section className="bg-[#E4F0F2] py-14 md:py-20">
        <div className="max-w-[1120px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-[12px] font-bold uppercase tracking-[2.5px] text-[#D0202F]">Watch</span>
            <h2 className="text-f34 font-bold text-[#1B2A52] tracking-tight mt-2 mb-3">
              Know More About Build Festival
            </h2>
            <p className="text-[15px] text-[#414C60] max-w-[560px] mx-auto">
              Hear from our sponsors, partners and the team behind Build Festival 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
            {FESTIVAL_VIDEOS.map((href, i) => (
              <div
                key={href}
                className="bg-white rounded-2xl overflow-hidden border border-[#E3E7ED] shadow-[0_4px_18px_rgba(20,32,61,0.06)] transition-shadow duration-300 hover:shadow-[0_14px_32px_rgba(20,32,61,0.14)]"
              >
                <FacebookEmbed href={href} title={`Build Festival video ${i + 1}`} />
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="flex items-center gap-2 text-[13px] font-bold text-[#1B2A52]">
                    <span className="w-6 h-6 rounded-full bg-[#D0202F] text-white flex items-center justify-center">
                      <Play size={11} fill="white" />
                    </span>
                    Video {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#6E7A8C] hover:text-[#D0202F] transition-colors"
                  >
                    Watch on Facebook
                    <ArrowUpRight size={14} strokeWidth={2.25} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-[14px] text-[#414C60]">
            More updates on the{" "}
            <a
              href={FESTIVAL_EVENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#1B2A52] underline underline-offset-4 decoration-[#DA9028] hover:text-[#D0202F] transition-colors"
            >
              Build Festival Facebook event
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </a>
          </p>
        </div>
      </section>

      {/* Map plan */}
      <section id="map" className="bg-white py-14 md:py-20">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <h2 className="text-f34 font-bold text-[#1B2A52] tracking-tight text-center mb-3">Map Plan</h2>
          <p className="text-center text-[14.5px] text-[#6E7A8C] mb-10">
            Indicative layout — final venue plan to be confirmed.
          </p>
          <a
            href="/British_Bangladeshi_Build_Festival_Floorplan.png"
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-2xl shadow-[0_16px_48px_rgba(20,32,61,0.13)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/British_Bangladeshi_Build_Festival_Floorplan.png"
              alt="BBCA Build Festival event floor plan: registration, waiting lounge, 22 exhibitor stalls, general seating, VIP and members tables, food stalls, bar and stage"
              width={1672}
              height={941}
              loading="lazy"
              className="w-full h-auto"
            />
          </a>
          <p className="text-center text-[13px] text-[#6E7A8C] mt-3">Tap the plan to open it full size.</p>
        </div>
      </section>

      {/* Event programme */}
      <section id="programme" className="bg-[#E4F0F2] py-14 md:py-20">
        <div className="max-w-[760px] mx-auto px-5 sm:px-6">
          <h2 className="text-f34 font-bold text-[#1B2A52] tracking-tight text-center mb-3">Event Programme</h2>
          <p className="text-center text-[14.5px] text-[#6E7A8C] mb-10">Times are provisional and subject to change.</p>
          <ol className="relative border-l-2 border-[#DA9028]/40 ml-3 space-y-5">
            {PROGRAMME.map((p) => (
              <li key={p.time} className="relative pl-8">
                <span className="absolute -left-[9px] top-5 w-4 h-4 rounded-full bg-[#DA9028] ring-4 ring-[#E4F0F2]" />
                <div className="bg-white rounded-2xl border border-[#E3E7ED] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                  <span className="inline-flex items-center gap-1.5 text-[#D0202F] font-bold text-sm shrink-0 whitespace-nowrap sm:w-[136px]">
                    <Clock size={14} /> {p.time}
                  </span>
                  <span className="font-semibold text-[#1B2A52]">{p.title}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Fire safety & emergency notice */}
      <section id="fire-safety" className="bg-white py-14 md:py-20">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <h2 className="text-f34 font-bold text-[#1B2A52] tracking-tight text-center mb-3">Fire Safety Plan</h2>
          <p className="text-center text-[14.5px] text-[#6E7A8C] mb-10">
            Please read before the event. In an emergency, follow event staff and call 999.
          </p>
          <a
            href="/British_Bangladeshi_Festival_Safety_Guide.png"
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-2xl shadow-[0_16px_48px_rgba(20,32,61,0.13)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/British_Bangladeshi_Festival_Safety_Guide.png"
              alt="Fire safety and emergency notice: stay calm and follow event staff instructions; exit safely using the nearest emergency exit; do not use lifts, always use the stairs; keep exits clear and do not run or push; gather at the designated assembly point; do not re-enter until official clearance; smoking, vaping and e-cigarettes are strictly prohibited inside the venue; in an emergency call 999."
              width={1672}
              height={941}
              loading="lazy"
              className="w-full h-auto"
            />
          </a>
          <p className="text-center text-[13px] text-[#6E7A8C] mt-3">Tap the notice to open it full size.</p>
        </div>
      </section>

      {/* Venue — address + embedded map */}
      <section id="venue" className="bg-[#E4F0F2] py-14 md:py-20">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6">
          <h2 className="text-f34 font-bold text-[#1B2A52] tracking-tight text-center mb-3">Venue</h2>
          <p className="text-center text-[14.5px] text-[#6E7A8C] mb-10">How to find Build Festival 2026.</p>
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.6fr] gap-6 lg:gap-8 items-center">
            <div className="bg-white rounded-2xl border border-[#E3E7ED] p-6 sm:p-7 shadow-[0_4px_18px_rgba(20,32,61,0.06)]">
              <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#DA9028]">Venue</p>
              <h3 className="mt-1.5 text-[22px] font-bold text-[#1B2A52] leading-tight">{VENUE_NAME}</h3>
              <ul className="mt-5 space-y-3 text-[15px] text-[#414C60]">
                <li className="flex items-start gap-2.5">
                  <MapPin size={18} className="text-[#DA9028] shrink-0 mt-0.5" />
                  {VENUE}
                </li>
                <li className="flex items-start gap-2.5">
                  <CalendarDays size={18} className="text-[#DA9028] shrink-0 mt-0.5" />
                  {EVENT_DATE}
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock size={18} className="text-[#DA9028] shrink-0 mt-0.5" />
                  {EVENT_TIME}
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#D0202F] text-white font-bold text-[13px] uppercase tracking-[0.5px] px-5 py-2.5 rounded-full hover:bg-[#1B2A52] transition-colors"
                >
                  Get Directions
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </a>
                <a
                  href={VENUE_MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-[#1B2A52] text-[#1B2A52] font-bold text-[13px] uppercase tracking-[0.5px] px-5 py-2 rounded-full hover:bg-[#1B2A52] hover:text-white transition-colors"
                >
                  Google Maps
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </a>
              </div>
            </div>
            <VenueMap query={`${VENUE_NAME}, ${VENUE}`} title={`Map of ${VENUE_NAME}, ${VENUE}`} />
          </div>
        </div>
      </section>
    </>
  );
}
