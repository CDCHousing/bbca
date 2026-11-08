"use client";

import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

type Props = {
  sponsors: { name: string; logo: string }[];
  color: string;
  /** true = slides travel left to right */
  reverse?: boolean;
  /** "lg" for the headline tier */
  size?: "lg" | "md";
};

// One moving row of sponsor logos per tier (shadcn carousel from @reui/c-carousel-3).
// Own timer rather than embla-carousel-autoplay, which can only run forwards.
// Pauses on hover; stays still for prefers-reduced-motion.
export default function SponsorCarousel({ sponsors, color, reverse = false, size = "md" }: Props) {
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
          {sponsors.map(({ name, logo }) => (
            <CarouselItem
              key={name}
              className={lg ? "basis-[80%] sm:basis-1/2 lg:basis-1/3" : "basis-1/2 sm:basis-1/3 lg:basis-1/4"}
            >
              <div
                className={`bg-white rounded-2xl flex items-center justify-center transition-shadow ${
                  lg
                    ? "h-44 md:h-48 p-6 border-2 shadow-[0_10px_28px_rgba(218,144,40,0.16)]"
                    : "h-32 md:h-36 p-5 border border-[#E3E7ED] shadow-[0_4px_18px_rgba(20,32,61,0.06)] hover:shadow-[0_10px_28px_rgba(20,32,61,0.14)]"
                }`}
                style={lg ? { borderColor: color } : undefined}
                title={name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt={name} loading="lazy" className="max-h-full max-w-full object-contain" />
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
