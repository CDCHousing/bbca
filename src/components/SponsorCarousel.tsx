"use client";

import { useEffect, useRef, useState } from "react";
import { Building2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

type Props = {
  names: string[];
  color: string;
  /** true = slides travel left to right */
  reverse?: boolean;
  /** "lg" for the headline tier */
  size?: "lg" | "md";
};

// One moving row of sponsor logos per tier (shadcn carousel from @reui/c-carousel-3).
// Own timer rather than embla-carousel-autoplay, which can only run forwards.
// Pauses on hover; stays still for prefers-reduced-motion.
export default function SponsorCarousel({ names, color, reverse = false, size = "md" }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const hovered = useRef(false);

  useEffect(() => {
    if (!api || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (hovered.current) return;
      if (reverse) api.scrollPrev();
      else api.scrollNext();
    }, 2400);
    return () => window.clearInterval(id);
  }, [api, reverse]);

  const lg = size === "lg";

  return (
    <div
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
    >
      <Carousel opts={{ align: "start", loop: true }} setApi={setApi} className="w-full">
        <CarouselContent>
          {names.map((name) => (
            <CarouselItem
              key={name}
              className={lg ? "basis-[80%] sm:basis-1/2 lg:basis-1/3" : "basis-1/2 sm:basis-1/3 lg:basis-1/4"}
            >
              <div
                className={`bg-white rounded-2xl flex flex-col items-center justify-center gap-2 px-3 text-center transition-shadow ${
                  lg
                    ? "h-44 md:h-48 border-2 shadow-[0_10px_28px_rgba(218,144,40,0.16)]"
                    : "h-32 md:h-36 border border-[#E3E7ED] shadow-[0_4px_18px_rgba(20,32,61,0.06)] hover:shadow-[0_10px_28px_rgba(20,32,61,0.14)]"
                }`}
                style={lg ? { borderColor: color } : undefined}
              >
                <Building2 size={lg ? 36 : 28} strokeWidth={1.6} style={{ color }} />
                <span className={`${lg ? "text-[16px]" : "text-[14px]"} font-semibold text-[#1B2A52] leading-tight`}>
                  {name}
                </span>
                <span className="text-[11px] font-medium text-[#6E7A8C]">Logo placeholder</span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:inline-flex size-10 -left-14 border-[#1B2A52]/20 text-[#1B2A52] hover:bg-[#1B2A52] hover:text-white" />
        <CarouselNext className="hidden md:inline-flex size-10 -right-14 border-[#1B2A52]/20 text-[#1B2A52] hover:bg-[#1B2A52] hover:text-white" />
      </Carousel>
    </div>
  );
}
