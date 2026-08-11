import Image from "next/image";

interface PageHeroProps {
  title: string;
}

export default function PageHero({ title }: PageHeroProps) {
  return (
    <section className="relative -mt-[154px] h-[420px] overflow-hidden bg-[#14203D]">
      <Image
        src="/bbca-crowd.png"
        alt=""
        fill
        className="object-cover"
        priority
      />
      {/* Dark navy overlay */}
      <div className="absolute inset-0 bg-[rgba(14,22,42,0.72)]" />
      {/* Title box — offset down past the header */}
      <div className="absolute inset-0 flex items-center justify-center pt-[154px]">
        <div className="bg-white/12 backdrop-blur-sm border border-white/20 px-14 py-7 rounded-2xl text-center">
          <h1 className="text-[clamp(28px,4vw,42px)] font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
