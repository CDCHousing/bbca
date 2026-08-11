import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Association Leadership | BBCA",
  description:
    "Meet the BBCA Leadership and Executive Committee — the dedicated professionals guiding our association.",
};

export default function AssociationLeadershipPage() {
  notFound();
  return (
    <main>
      {/* Hero */}
      <section className="relative -mt-[154px] h-[460px] overflow-hidden bg-[#14203D]">
        <Image
          src="/bbca-crowd.png"
          alt="BBCA members group photo"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[rgba(14,22,42,0.55)]" />
        <div className="absolute inset-0 flex items-center justify-center pt-[154px]">
          <div className="bg-[#D0202F]/70 px-14 py-6 rounded-xl text-center">
            <h1 className="text-[clamp(28px,4vw,48px)] font-extrabold text-white tracking-tight leading-tight">
              Association Leadership
            </h1>
          </div>
        </div>
      </section>

      {/* Coming soon body */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[17px] leading-relaxed text-[#414C60]">
            We will soon announce the BBCA Leadership and Executive Committee,
            introducing the dedicated professionals who will guide our association,
            support our members, and drive future growth.
          </p>
        </div>
      </section>
    </main>
  );
}
