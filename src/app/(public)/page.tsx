import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedButton from "@/components/AnimatedButton";
import HomeAnimations from "@/components/HomeAnimations";
import CarouselSection from "@/components/CarouselSection";

const STATS = [
  { num: "164+", val: 164, suffix: "+", label: "Businesses Connected", color: "#0A7D3E" },
  { num: "250+", val: 250, suffix: "+", label: "Construction Professionals", color: "#0A7D3E" },
  { num: "35+", val: 35, suffix: "+", label: "Industry Partners", color: "#0A7D3E" },
  { num: "20+", val: 20, suffix: "+", label: "Training Workshops", color: "#0A7D3E" },
  { num: "120+", val: 120, suffix: "+", label: "Career Opportunities Created", color: "#0A7D3E" },
];

const RESOURCES = [
  {
    icon: "/icon1.svg",
    text: "Gain practical skills through expert-led construction courses and workshops.",
  },
  {
    icon: "/icon2.svg",
    text: "Connect with employers, apprenticeships, internships, and job opportunities.",
  },
  {
    icon: "/icon3.svg",
    text: "Access professional guidance, industry resources, and networking opportunities.",
  },
];

const NEWS_PREVIEW = [
  { title: "BBCA Meetup — May 2026" },
  { title: "BBCA Business Forum — May 2026" },
  { title: "BBCA Members Networking Evening" },
];


export default function HomePage() {
  return (
    <>
      <HomeAnimations />

      {/* Hero */}
      <section className="gsap-hero-section relative -mt-[154px] h-[90vh] min-h-[640px] bg-[#233] overflow-hidden">
        <div className="gsap-hero-bg absolute inset-0 overflow-hidden pointer-events-none">
          <video
            src="https://faawc7l5kxsbkrxm.public.blob.vercel-storage.com/hero/BBCA-hero.mp4"
            poster="/bbca-crowd.png"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
            controls={false}
            className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,23,42,0.86)] via-[rgba(15,23,42,0.62)] to-[rgba(15,23,42,0.32)]" />
        <div className="absolute inset-0 flex items-center pt-[154px]">
          <div className="max-w-[1560px] w-full mx-auto px-16 pt-15">
            <div className="gsap-hero-text max-w-[960px]">
              <h1 className="gsap-hero-title text-[clamp(42px,6vw,84px)] leading-[1.02] font-semibold text-white uppercase tracking-[-1.5px] mb-10 text-shadow-lg">
                British Bangladeshi Construction Association
              </h1>
              <Link
                href="/membership"
                className="gsap-hero-cta gsap-hero-btn inline-flex items-center gap-3.5 bg-[#DA9028] text-white font-bold text-sm uppercase tracking-[1px] pl-7 pr-3.5 py-3.5 rounded-full active:scale-95"
              >
                <span>Become a Member</span>
                <span className="gsap-hero-btn-arrow inline-flex w-[26px] h-[26px] rounded-full bg-white/22 items-center justify-center">
                  <ArrowRight size={15} strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12">
        <div className="gsap-stats-section max-w-[1100px] mx-auto px-6 grid grid-cols-5 gap-5">
          {STATS.map((s) => (
            <div key={s.num} className="text-center">
              <div
                className="gsap-stat-num text-[38px] font-semibold tracking-tight leading-none"
                style={{ color: s.color }}
                data-val={s.val}
                data-suffix={s.suffix}
              >
                {s.num}
              </div>
              <div className="text-[13.5px] font-semibold text-[#414C60] mt-2 leading-tight">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CarouselSection />

      {/* Intro */}
      <section className="bg-white pt-8 pb-14">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <h2 className="gsap-fade-up text-[30px] font-bold tracking-tight text-[#1B2A52] uppercase mb-5 leading-snug">
            British Bangladeshi Construction Association
          </h2>
          <p className="gsap-fade-up text-[16.5px] leading-relaxed text-[#414C60] max-w-[760px] mx-auto mb-8">
            The British Bangladeshi Construction Association is a professional network dedicated to supporting, connecting, and promoting British Bangladeshi individuals and businesses within the UK construction industry. The association brings together contractors, developers, engineers, architects, consultants, tradespeople, suppliers, and aspiring professionals to encourage collaboration, knowledge sharing and sustainable growth.
          </p>
          <div className="gsap-fade-up flex gap-3.5 justify-center flex-wrap">
            <AnimatedButton href="/about">Learn More about BBCA</AnimatedButton>
            <AnimatedButton href="/membership">Become a Member</AnimatedButton>
            <AnimatedButton href="/why-join">Why Join</AnimatedButton>
          </div>
        </div>
      </section>

      {/* Festival banner */}
      <section className="bg-[#E4F0F2]">
        <div className="max-w-[1120px] mx-auto px-6 py-16 grid grid-cols-[0.85fr_1.15fr] gap-14 items-center">
          <div className="gsap-fade-up flex justify-center">
            <Image
              src="/build-festival-logo.svg"
              alt="BBCA Build Festival"
              width={290}
              height={290}
              className="w-full max-w-[290px] h-auto"
            />
          </div>
          <div>
            <h2 className="gsap-fade-up text-[30px] font-bold text-[#0A7D3E] tracking-tight mb-5">
              British Bangladeshi Build Festival
            </h2>
            <p className="gsap-fade-up text-[15.5px] leading-relaxed text-[#414C60] mb-4">
              The British Bangladeshi Construction Association (BBCA) is proud to announce that it will host the British Bangladeshi Build Festival London 2026.
            </p>
            <p className="gsap-fade-up text-[15.5px] leading-relaxed text-[#414C60] mb-4">
              The festival will bring together construction professionals, business owners, developers, contractors, architects, engineers, suppliers, investors, and community leaders for a major celebration of industry, innovation, and opportunity.
            </p>
            <p className="gsap-fade-up text-[15.5px] leading-relaxed text-[#414C60] mb-8">
              The event will feature networking, exhibitions, expert discussions, business showcases, career opportunities, and recognition of British Bangladeshi achievements within the UK construction sector.
            </p>
            <div className="gsap-fade-up flex gap-3.5 flex-wrap">
              <AnimatedButton href="/build-festival/stall-booking">Book Your Stall</AnimatedButton>
              <AnimatedButton href="/build-festival/visitor-registration">Visitor Registration</AnimatedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Resource, Knowledge & Career */}
      <section className="bg-white py-20">
        <div className="max-w-[1080px] mx-auto px-6">
          <h2 className="gsap-fade-up text-[34px] font-bold text-[#1B2A52] tracking-tight text-center mb-13">
            Resource, Knowledge &amp; Career
          </h2>
          <div className="gsap-stagger grid grid-cols-3 gap-9">
            {RESOURCES.map((r, i) => (
              <div key={i} className="text-center px-3">
                <div className="w-[78px] h-[78px] mx-auto mb-5 flex items-center justify-center">
                  <Image src={r.icon} alt="" width={72} height={72} className="object-contain" />
                </div>
                <p className="text-[14.5px] leading-relaxed text-[#414C60] max-w-[230px] mx-auto">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
          <div className="gsap-fade-up text-center mt-12">
            <AnimatedButton href="/resources">Learn More</AnimatedButton>
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="bg-[#EDF5F6] py-18">
        <div className="max-w-[1140px] mx-auto px-6">
          <h2 className="gsap-fade-up text-[30px] font-bold text-[#1B2A52] tracking-tight text-center mb-11">
            News &amp; Events
          </h2>
          <div className="gsap-stagger grid grid-cols-3 gap-6 mb-5">
            {NEWS_PREVIEW.map((n) => (
              <Link key={n.title} href="/news" className="block group">
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#c4cbd6] mb-3.5" />
                <div className="text-[15px] font-semibold text-[#1B2A52] group-hover:text-[#D0202F] transition-colors">
                  {n.title}
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center my-5">
            <span className="w-[70px] h-[3px] bg-[#D0202F] rounded-full" />
          </div>
          {/* Video placeholders */}
          <div className="gsap-stagger grid grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="relative aspect-video rounded-xl overflow-hidden bg-[#1a1a1a] flex items-center justify-center"
              >
                <div className="w-[54px] h-[38px] rounded-lg bg-[rgba(220,32,47,0.92)] flex items-center justify-center text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
