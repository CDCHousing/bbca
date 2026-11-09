"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Maximize2, X } from "lucide-react";

/**
 * Embedded Google Map (keyless embed URL) with an Expand button that opens the same map
 * in a fullscreen overlay. The overlay closes on the X, Escape, or a backdrop click, and
 * locks page scroll while open.
 */
export default function VenueMap({ query, title }: { query: string; title: string }) {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  return (
    <>
      <div className="relative h-[320px] sm:h-[400px] overflow-hidden rounded-2xl border border-[#E3E7ED] bg-[#EDF5F6] shadow-[0_16px_48px_rgba(20,32,61,0.13)]">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
        />
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-[12.5px] font-bold uppercase tracking-[0.4px] text-[#1B2A52] shadow-[0_6px_18px_rgba(20,32,61,0.2)] transition-colors hover:bg-[#1B2A52] hover:text-white"
        >
          <Maximize2 size={14} strokeWidth={2.5} />
          Expand
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#14203D]/70 p-3 sm:p-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={() => setExpanded(false)}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <motion.div
              className="relative h-full w-full max-w-[1400px] overflow-hidden rounded-2xl bg-white shadow-2xl"
              initial={reduceMotion ? false : { scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={reduceMotion ? undefined : { scale: 0.96, y: 8 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={src}
                title={`${title} (expanded)`}
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
              />
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Close map"
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1B2A52] shadow-[0_6px_18px_rgba(20,32,61,0.25)] transition-colors hover:bg-[#1B2A52] hover:text-white"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
