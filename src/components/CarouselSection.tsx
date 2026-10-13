"use client";
import { useState, useEffect, useCallback } from "react";

// Shown until at least one gallery image is ticked "Show in home carousel" in /admin/gallery.
const fallbackImages = [
  { src: "/pic.png", alt: "BBCA group photo" },
  { src: "/cover.png", alt: "BBCA members at an association event" },
  { src: "/bbca-meeting-2026.jpeg", alt: "BBCA members meeting" },
  { src: "/carousel-3.jpeg", alt: "BBCA event photo 3" },
  { src: "/carousel-4.jpeg", alt: "BBCA event photo 4" },
  { src: "/carousel-5.jpeg", alt: "BBCA event photo 5" },
];

export default function CarouselSection({
  images: selected,
}: {
  images: { src: string; alt: string }[];
}) {
  const images = selected.length > 0 ? selected : fallbackImages;
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive((p) => (p + 1) % images.length), [images.length]);
  const prev = useCallback(() => setActive((p) => (p - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="bg-white pb-4">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="relative rounded-xl overflow-hidden aspect-video bg-[#c4cbd6]">
          {images.map((img, i) => (
            <div
              key={img.src}
              className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}

          {/* Prev / Next buttons */}
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === active ? "bg-[#1B2A52]" : "bg-[#E3E7ED]"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
