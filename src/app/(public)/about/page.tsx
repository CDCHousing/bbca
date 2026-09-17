import PageHero from "@/components/PageHero";
import AboutAnimations from "@/components/AboutAnimations";
import Image from "next/image";
import { Handshake, Megaphone, TrendingUp } from "lucide-react";

const AIMS = [
  {
    icon: Handshake,
    title: "Connect",
    body: "Bring British Bangladeshi construction businesses together in one network.",
  },
  {
    icon: Megaphone,
    title: "Represent",
    body: "Champion members' interests and celebrate their achievements.",
  },
  {
    icon: TrendingUp,
    title: "Grow",
    body: "Support skills, training and sustainable growth across the community.",
  },
];


export default function AboutPage() {
  return (
    <>
      <PageHero title="About Us" />
      <AboutAnimations />

      {/* Section 1 — Who We Are */}
      <section className="bg-white py-[70px]">
        <div className="max-w-[1080px] mx-auto px-6">

          {/* Kicker */}
          <p
            className="gsap-fade-up text-[#D0202F] font-bold uppercase tracking-[2px] mb-4 text-center"
            style={{ fontSize: "12.5px" }}
          >
            Who We Are
          </p>

          {/* H2 */}
          <h2 className="gsap-fade-up text-f32 font-bold text-[#1B2A52] leading-snug mb-8 max-w-[680px] mx-auto text-center">
            A united voice for British Bangladeshi construction.
          </h2>

          {/* Body text */}
          <div className="gsap-fade-up max-w-[820px] space-y-5 mb-12">
            <p className="text-[15.5px] leading-relaxed text-[#414C60]">
              The British Bangladeshi Construction Association (a charity based organization)
              brings together contractors, developers, engineers, architects, consultants,
              tradespeople and those beginning their careers to share technical knowledge,
              mentor new entrants and strengthen safe practice on site.
            </p>
            <p className="text-[15.5px] leading-relaxed text-[#414C60]">
              Through structured training, continuing professional development, apprenticeship
              pathways and guidance on the competence requirements now embedded in the regulatory
              framework, including safety-critical training delivered in Bengali alongside English,
              we help practitioners build durable careers and help the industry meet the standards
              expected of it.
            </p>
            <p className="text-[15.5px] leading-relaxed text-[#414C60]">
              BBCA works to raise competence, safety and technical standards across the UK
              construction industry, and to widen the talent pipeline into an industry facing
              a sustained skills shortage.
            </p>
          </div>

          {/* People-formed BBCA wordmark */}
          <div
            className="gsap-fade-up relative w-full rounded-[14px] overflow-hidden bg-white mb-[52px]"
            style={{ aspectRatio: "16 / 8" }}
          >
            <Image
              src="/about-bbca-people.webp"
              alt="Crowd of people forming the letters BBCA"
              fill
              sizes="(min-width: 1080px) 1080px, 100vw"
              className="object-contain"
            />
          </div>

          {/* Aim cards */}
          <div className="gsap-stagger grid grid-cols-1 md:grid-cols-3 gap-6">
            {AIMS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-[14px] border border-[#E3E7ED] bg-[#F5F7FA]"
                style={{ padding: "28px 24px" }}
              >
                <div className="w-11 h-11 rounded-full bg-[#E4F0F2] flex items-center justify-center mb-5">
                  <Icon size={20} className="text-[#1B2A52]" strokeWidth={1.8} />
                </div>
                <h3 className="text-f17 font-bold text-[#1B2A52] mb-2">{title}</h3>
                <p className="text-[14px] leading-relaxed text-[#414C60]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
