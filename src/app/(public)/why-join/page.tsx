import PageHero from "@/components/PageHero";
import AnimatedButton from "@/components/AnimatedButton";
import WhyJoinAnimations from "@/components/WhyJoinAnimations";

const BENEFITS = [
  {
    title: "Build Valuable Connections",
    body: "Meet contractors, developers, investors, suppliers, consultants, and decision-makers across the construction industry.",
  },
  {
    title: "Generate New Business Leads",
    body: "Promote your services and connect with potential clients, partners, and subcontractors.",
  },
  {
    title: "Grow Your Professional Network",
    body: "Develop long-term relationships with trusted businesses and industry professionals.",
  },
  {
    title: "Create Partnership Opportunities",
    body: "Find suitable partners for joint ventures, developments, tenders, and construction projects.",
  },
  {
    title: "Showcase Your Business",
    body: "Increase your company's visibility through BBCA events, exhibitions, directories, and promotional opportunities.",
  },
  {
    title: "Access Industry Events",
    body: "Attend networking meetings, business forums, conferences, workshops, and the British Bangladeshi Build Festival.",
  },
  {
    title: "Meet Buyers and Suppliers",
    body: "Connect directly with businesses looking for construction services, materials, products, and specialist expertise.",
  },
  {
    title: "Discover Tender Opportunities",
    body: "Learn about upcoming contracts, procurement opportunities, and potential project collaborations.",
  },
  {
    title: "Strengthen Your Business Reputation",
    body: "Become part of a respected professional association and build trust within the wider construction community.",
  },
  {
    title: "Expand into New Markets",
    body: "Use BBCA connections to reach new customers, sectors, locations, and commercial opportunities.",
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
            <h2 className="text-[30px] font-bold text-[#1B2A52] leading-snug">
              Reasons to join the BBCA
            </h2>
          </div>

          {/* Benefits list */}
          <div className="space-y-6 mb-14">
            {BENEFITS.map(({ title, body }, i) => (
              <div key={title} className="gsap-benefit-item flex gap-5 items-start">
                <div className="shrink-0 w-[48px] h-[48px] rounded-full border-2 border-[#E3E7ED] flex items-center justify-center mt-0.5">
                  <span className="text-[16px] font-bold text-[#6E7A8C]">
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
