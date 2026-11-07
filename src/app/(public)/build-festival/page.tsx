import type { Metadata } from "next";
import Link from "next/link";
import { Play, MapPin, Clock, ArrowRight } from "lucide-react";
import AnimatedButton from "@/components/AnimatedButton";
import BuildFestivalLogo from "@/components/BuildFestivalLogo";
import SponsorCarousel from "@/components/SponsorCarousel";

export const metadata: Metadata = {
  title: "Build Festival 2026",
  description:
    "British Bangladeshi Build Festival London 2026 — construction, jobs and a concert, hosted by BBCA.",
};

// Placeholder content — swap for real data once confirmed.
const VENUE = "501 High St N, London E12 6TH";
const VENUE_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE)}`;

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
];

// One carousel per tier. Rows alternate direction: right-to-left, then left-to-right.
const SPONSOR_TIERS = [
  { tier: "Gold Sponsors", short: "Gold Sponsor", count: 4, color: "#DA9028", size: "lg" as const },
  { tier: "Silver Sponsors", short: "Silver Sponsor", count: 6, color: "#6E7A8C", size: "md" as const },
  { tier: "Media Partners", short: "Media Partner", count: 6, color: "#D0202F", size: "md" as const },
  { tier: "In Association With", short: "Partner", count: 6, color: "#0A7D3E", size: "md" as const },
];

const EXHIBITORS = Array.from({ length: 12 }, (_, i) => ({
  name: `Exhibitor ${i + 1}`,
  category: ["Contractor", "Supplier", "Architecture", "Engineering"][i % 4],
  stall: `S${String(i + 1).padStart(2, "0")}`,
}));

const MAP_ZONES = [
  { label: "Main Stage", className: "col-span-2 row-span-2 bg-[#1B2A52] text-white" },
  { label: "Exhibition Hall A", className: "col-span-2 bg-[#E4F0F2] text-[#1B2A52]" },
  { label: "Exhibition Hall B", className: "col-span-2 bg-[#E4F0F2] text-[#1B2A52]" },
  { label: "Jobs Fair", className: "bg-[#0A7D3E] text-white" },
  { label: "Food Court", className: "bg-[#DA9028] text-white" },
  { label: "Registration", className: "bg-[#F5F7FA] text-[#414C60]" },
  { label: "Entrance", className: "bg-[#D0202F] text-white" },
];

const PROGRAMME = [
  { time: "10:00", title: "Doors open & visitor registration" },
  { time: "10:30", title: "Opening ceremony & welcome address" },
  { time: "11:00", title: "Exhibition halls open" },
  { time: "12:00", title: "Industry panel discussion" },
  { time: "13:00", title: "Jobs fair & careers sessions" },
  { time: "15:00", title: "Business showcases & awards" },
  { time: "18:00", title: "Evening concert" },
];

export default function BuildFestivalPage() {
  return (
    <>
      {/* Festival header */}
      <header className="bg-white text-[#1B2A52]">
        {/* Festival colour band, taken from the logo */}
        <div className="h-1.5 bg-[linear-gradient(90deg,#0A7D3E_0%,#0A7D3E_25%,#DA9028_25%,#DA9028_50%,#D0202F_50%,#D0202F_75%,#1B2A52_75%)]" />
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-4 flex flex-col md:flex-row items-center gap-5 md:gap-10">
          <Link href="/build-festival" className="shrink-0">
            <BuildFestivalLogo className="h-40 md:h-48 w-auto" />
          </Link>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-[clamp(24px,3vw,36px)] font-bold uppercase leading-tight tracking-tight">
              Welcome to Build Festival 2026
            </h1>
            <a
              href={VENUE_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-[15px] md:text-[17px] font-semibold text-[#414C60] hover:text-[#D0202F] transition-colors"
            >
              <MapPin size={17} className="text-[#DA9028] shrink-0" />
              {VENUE}
            </a>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Link
              href="/build-festival/visitor-registration"
              className="inline-flex items-center justify-center gap-2 bg-[#D0202F] text-white font-bold text-[13px] uppercase tracking-[0.5px] px-6 py-3 rounded-full border-2 border-[#D0202F] hover:bg-[#1B2A52] hover:border-[#1B2A52] transition-colors"
            >
              Register as Visitor
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
            <Link
              href="/build-festival/stall-booking"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1B2A52] font-bold text-[13px] uppercase tracking-[0.5px] px-6 py-3 rounded-full border-2 border-[#1B2A52] hover:bg-[#1B2A52] hover:text-white transition-colors"
            >
              Book a Stall
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </header>

      {/* Section strip */}
      <nav className="bg-[#1B2A52]">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex items-center gap-6 overflow-x-auto">
          {SECTION_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="py-3.5 text-[14px] font-bold uppercase tracking-[0.3px] text-white hover:text-[#DA9028] whitespace-nowrap transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/"
            className="ml-auto py-3.5 text-[13px] font-semibold uppercase text-white/70 hover:text-[#DA9028] whitespace-nowrap transition-colors"
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
            <Link
              href="/build-festival/visitor-registration"
              className="group inline-flex items-center gap-3 bg-[#D0202F] text-white font-bold text-[15px] md:text-[16px] uppercase tracking-[0.5px] pl-8 pr-3 py-3 rounded-full shadow-[0_10px_28px_rgba(208,32,47,0.35)] hover:bg-[#1B2A52] hover:shadow-[0_10px_28px_rgba(27,42,82,0.35)] transition-colors"
            >
              Register as Visitor
              <span className="inline-flex w-9 h-9 rounded-full bg-white/20 items-center justify-center transition-transform group-hover:translate-x-1">
                <ArrowRight size={18} strokeWidth={2.5} />
              </span>
            </Link>
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
            {SPONSOR_TIERS.map(({ tier, short, count, color, size }, i) => (
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
                  names={Array.from({ length: count }, (_, n) => `${short} ${n + 1}`)}
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
          <h2 className="text-f34 font-bold text-[#1B2A52] tracking-tight text-center mb-10 md:mb-14">
            Exhibitor List
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXHIBITORS.map((ex) => (
              <div
                key={ex.stall}
                className="flex items-center gap-4 bg-[#F5F7FA] border border-[#E3E7ED] rounded-2xl p-4"
              >
                <div className="w-14 h-14 shrink-0 rounded-xl bg-white border border-[#E3E7ED] flex items-center justify-center text-[10px] text-[#6E7A8C]">
                  Logo
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[#1B2A52] truncate">{ex.name}</div>
                  <div className="text-[13px] text-[#6E7A8C]">{ex.category}</div>
                </div>
                <span className="text-[12px] font-bold text-[#0A7D3E] bg-[#0A7D3E]/10 rounded-full px-2.5 py-1">
                  {ex.stall}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <AnimatedButton href="/build-festival/stall-booking">Book Your Stall</AnimatedButton>
          </div>
        </div>
      </section>

      {/* Know more — video placeholder */}
      <section className="bg-[#E4F0F2] py-14 md:py-20">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6">
          <h2 className="text-f34 font-bold text-[#1B2A52] tracking-tight text-center mb-10">
            Know More About Build Festival
          </h2>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#14203D] flex flex-col items-center justify-center text-white">
            <span className="inline-flex w-20 h-20 rounded-full bg-[#D0202F] items-center justify-center mb-4">
              <Play size={32} fill="white" />
            </span>
            <p className="text-sm font-semibold uppercase tracking-[1.5px] text-white/70">Video coming soon</p>
          </div>
        </div>
      </section>

      {/* Map plan — dummy */}
      <section id="map" className="bg-white py-14 md:py-20">
        <div className="max-w-[960px] mx-auto px-5 sm:px-6">
          <h2 className="text-f34 font-bold text-[#1B2A52] tracking-tight text-center mb-3">Map Plan</h2>
          <p className="text-center text-[14.5px] text-[#6E7A8C] mb-10">
            Indicative layout — final venue plan to be confirmed.
          </p>
          <div className="grid grid-cols-4 auto-rows-[90px] sm:auto-rows-[120px] gap-3 p-3 sm:p-4 rounded-2xl border-2 border-dashed border-[#E3E7ED]">
            {MAP_ZONES.map((z) => (
              <div
                key={z.label}
                className={`${z.className} rounded-xl flex items-center justify-center text-center p-2 text-[12px] sm:text-sm font-bold uppercase tracking-wide`}
              >
                {z.label === "Entrance" ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} /> {z.label}
                  </span>
                ) : (
                  z.label
                )}
              </div>
            ))}
          </div>
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
                <div className="bg-white rounded-2xl border border-[#E3E7ED] px-5 py-4 flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 text-[#D0202F] font-bold text-sm shrink-0 w-16">
                    <Clock size={14} /> {p.time}
                  </span>
                  <span className="font-semibold text-[#1B2A52]">{p.title}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
