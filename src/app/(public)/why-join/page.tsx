import PageHero from "@/components/PageHero";
import AnimatedButton from "@/components/AnimatedButton";
import WhyJoinAnimations from "@/components/WhyJoinAnimations";

const BENEFITS = [
  {
    title: "Professional Standing",
    body: "Membership of a registered charity advancing skills, safety and competence in British construction. Free to join, open to all.",
  },
  {
    title: "Continuing Professional Development",
    body: "Structured training across health and safety, building regulations, Part L compliance, retrofit standards and modern methods of construction.",
  },
  {
    title: "Industry Access and Progression",
    body: "Support work removing barriers to entry and advancement for women, young people and those from underrepresented backgrounds across UK construction.",
  },
  {
    title: "Knowledge Exchange and Technical Forums",
    body: "Working groups on sustainability, retrofit, safety and skills. Contribute practitioner experience to guidance the wider industry can use.",
  },
  {
    title: "Technical Briefings and Regulatory Updates",
    body: "Building Safety Act duties, the Building Safety Regulator regime, gateway requirements and competence frameworks, translated into practical guidance for working professionals.",
  },
  {
    title: "Structured Mentoring",
    body: "A formal programme pairing experienced practitioners with those earlier in their careers. Participate as mentor or mentee.",
  },
  {
    title: "Occupational Health and Safety Programme",
    body: "Site safety, dust and noise exposure, musculoskeletal risk and mental health in construction, the issues that account for the sector's poorest outcomes.",
  },
  {
    title: "Apprenticeship and Early Careers Pathway",
    body: "Work with schools, colleges and training providers to bring qualified entrants into the trades. Host site visits, deliver careers sessions, take on apprentices.",
  },
  {
    title: "Competence and Qualification Guidance",
    body: "Navigate CSCS, NVQ routes, professional body registration and the competence requirements now embedded in the regulatory framework.",
  },
  {
    title: "Multilingual Training Delivery",
    body: "Safety-critical training and materials delivered in Bengali alongside English, addressing a well-documented gap in site safety communication.",
  },
];

export default function WhyJoinPage() {
  return (
    <>
      <PageHero title="Why Join BBCA" />

      <WhyJoinAnimations />
      <section className="bg-white py-[64px]">
        <div className="max-w-[820px] mx-auto px-6">

          {/* Section intro */}
          <div className="text-center mb-12">
            <p
              className="text-[#D0202F] font-bold uppercase tracking-[2px] mb-3"
              style={{ fontSize: "12.5px" }}
            >
              Membership Benefits
            </p>
            <h2 className="text-f30 font-bold text-[#1B2A52] leading-snug">
              Reasons to join the BBCA
            </h2>
          </div>

          {/* Benefits list */}
          <div className="space-y-6 mb-14">
            {BENEFITS.map(({ title, body }, i) => (
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

          {/* Divider */}
          <div className="flex justify-center mb-10">
            <span className="w-[60px] h-[3px] rounded-full bg-[#DA9028]" />
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <AnimatedButton href="/membership">Become a Member</AnimatedButton>
          </div>
        </div>
      </section>
    </>
  );
}
