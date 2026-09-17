import PageHero from "@/components/PageHero";
import AboutAnimations from "@/components/AboutAnimations";
import WhyJoinAnimations from "@/components/WhyJoinAnimations";
import Image from "next/image";

export const metadata = {
  title: "Key Objectives and Activities",
  description:
    "How BBCA convenes the industry, delivers training, guides competence and widens access to UK construction.",
};

const OBJECTIVES = [
  {
    title: "Convening the Industry",
    body: "BBCA brings together contractors, developers, engineers, architects, consultants, tradespeople and those beginning their careers to share technical knowledge, mentor new entrants and strengthen safe practice on site. Putting experienced practitioners in the same room as those entering the trades is how knowledge moves through an industry, and BBCA's forums, working groups and technical sessions are built to make that exchange deliberate rather than incidental.",
  },
  {
    title: "Training and Continuing Professional Development",
    body: "BBCA delivers structured training across health and safety, building regulations, retrofit and sustainable practice, and modern methods of construction. Programmes run at every level, from those entering the trades to experienced practitioners maintaining competence, and are developed with accredited training providers and further education colleges.",
  },
  {
    title: "Competence and Regulatory Guidance",
    body: "The Building Safety Act has raised the competence bar across every construction discipline. BBCA produces practical guidance on duty-holder obligations, gateway requirements, qualification routes and professional registration, translating a complex regulatory framework into terms practitioners can act on.",
  },
  {
    title: "Mentoring and Apprenticeship Pathways",
    body: "BBCA operates a structured mentoring programme pairing experienced practitioners with those earlier in their careers, and works with schools, colleges and training providers to build apprenticeship routes into the industry. Site visits, careers sessions and work experience placements give young people direct exposure to the trades.",
  },
  {
    title: "Occupational Health and Safety",
    body: "Construction carries some of the poorest occupational health outcomes of any UK sector. BBCA delivers education and awareness programmes on site safety, dust and noise exposure, musculoskeletal risk and mental health, with safety-critical material delivered in Bengali alongside English to address a recognised gap in site communication.",
  },
  {
    title: "Widening Access to the Industry",
    body: "BBCA runs programmes that open routes into construction for women, young people and those from backgrounds the sector has historically under-recruited from. This includes outreach through schools and colleges, targeted training, and support for practitioners whose progression has been limited by barriers unrelated to their capability.",
  },
  {
    title: "Advancing Standards and Public Understanding",
    body: "BBCA contributes practitioner evidence to consultations on construction competence, site safety and skills policy, and publishes research and guidance for the benefit of the industry and the public. This work is undertaken solely to further BBCA's charitable purposes, and never to advance the commercial interests of any individual, firm or group.",
  },
];

export default function ObjectivesPage() {
  return (
    <>
      <PageHero title="Key Objectives and Activities" />
      <AboutAnimations />
      <WhyJoinAnimations />

      <section className="bg-white py-[64px]">
        <div className="max-w-[820px] mx-auto px-6">

          {/* Section intro */}
          <div className="gsap-fade-up text-center mb-12">
            <p
              className="text-[#D0202F] font-bold uppercase tracking-[2px] mb-3"
              style={{ fontSize: "12.5px" }}
            >
              What We Do
            </p>
            <h2 className="text-f30 font-bold text-[#1B2A52] leading-snug">
              Key Objectives and Activities
            </h2>
          </div>

          {/* Members photo */}
          <div
            className="gsap-fade-up relative w-full rounded-[14px] overflow-hidden mb-14"
            style={{ aspectRatio: "16 / 9" }}
          >
            <Image
              src="/cover.png"
              alt="BBCA members gathered at an association event"
              fill
              sizes="(min-width: 820px) 820px, 100vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Objectives list */}
          <div className="space-y-6">
            {OBJECTIVES.map(({ title, body }, i) => (
              <div key={title} className="gsap-benefit-item flex gap-5 items-start">
                <div className="shrink-0 w-[48px] h-[48px] rounded-full border-2 border-[#E3E7ED] flex items-center justify-center mt-0.5">
                  <span className="text-f16 font-bold text-[#6E7A8C]">
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </span>
                </div>
                <div>
                  <span className="text-[15.5px] font-bold text-[#1B2A52]">{title}</span>
                  <p className="text-[14.5px] leading-relaxed text-[#414C60] mt-1">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
