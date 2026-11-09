"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Phone, Mail, MapPin, X, ArrowUpRight } from "lucide-react";

type Props = {
  phone: string;
  phoneTel: string;
  email: string;
  venueName: string;
  venueAddress: string;
  mapUrl: string;
};

/**
 * Floating contact bubble, fixed top-right. Closed: a round navy button ringed in the
 * festival logo's colours. Open: springs out into a card with the event contact details.
 * Closes on the X, Escape, or a click outside.
 */
export default function ContactBubble({ phone, phoneTel, email, venueName, venueAddress, mapUrl }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const spring = reduceMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 380, damping: 30 };

  return (
    <div ref={ref} className="fixed right-4 top-4 z-[60] sm:right-6 sm:top-6">
      <motion.div
        layout
        transition={spring}
        style={{ borderRadius: open ? 24 : 999 }}
        className="relative overflow-hidden bg-[#14203D] p-[3px] shadow-[0_12px_36px_rgba(20,32,61,0.35)]"
      >
        {/* Festival-colour ring */}
        <span
          aria-hidden
          className="absolute inset-0 bg-[conic-gradient(from_200deg,#0A7D3E,#DA9028,#D0202F,#0044b2,#0A7D3E)]"
        />

        <motion.div
          layout
          transition={spring}
          style={{ borderRadius: open ? 21 : 999 }}
          className="relative bg-[linear-gradient(140deg,#1B2A52,#14203D)]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {open ? (
              <motion.div
                key="card"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: reduceMotion ? 0 : 0.08 } }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.1 } }}
                className="w-[min(320px,calc(100vw-32px))] p-5 text-white"
                role="dialog"
                aria-label="Event enquiries"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#DA9028]">Event Enquiries</p>
                    <p className="mt-1 text-[17px] font-bold leading-tight">We&apos;re happy to help</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close contact details"
                    className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                  >
                    <X size={16} />
                  </button>
                </div>

                <ul className="space-y-2">
                  {[
                    { href: `tel:${phoneTel}`, icon: Phone, label: "Call", value: phone, color: "#0A7D3E" },
                    { href: `mailto:${email}`, icon: Mail, label: "Email", value: email, color: "#D0202F" },
                    { href: mapUrl, icon: MapPin, label: venueName, value: venueAddress, color: "#DA9028", external: true },
                  ].map(({ href, icon: Icon, label, value, color, external }, i) => (
                    <motion.li
                      key={label}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: reduceMotion ? 0 : 0.12 + i * 0.06 } }}
                    >
                      <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex items-center gap-3 rounded-2xl bg-white/[0.06] px-3 py-2.5 transition-colors hover:bg-white/[0.12]"
                      >
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: color }}
                        >
                          <Icon size={16} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.8px] text-white/55">{label}</span>
                          <span className="block break-words text-[14px] font-semibold leading-snug">{value}</span>
                        </span>
                        <ArrowUpRight size={15} className="shrink-0 text-white/40 transition-colors group-hover:text-[#DA9028]" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.button
                key="bubble"
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Show event contact details"
                aria-expanded={false}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.1 } }}
                whileHover={reduceMotion ? undefined : { rotate: [0, -12, 10, -6, 0], transition: { duration: 0.5 } }}
                className="flex h-14 w-14 items-center justify-center text-white"
              >
                <Phone size={22} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Pulse + twinkling star while closed */}
      {!open && !reduceMotion && (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#DA9028]"
            animate={{ scale: [1, 1.55], opacity: [0.45, 0] }}
            transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity, repeatDelay: 0.8 }}
          />
          <motion.svg
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute -left-1 -top-1 h-4 w-4"
            animate={{ scale: [0.7, 1.15, 0.7], rotate: [-15, 15, -15] }}
            transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
          >
            <path
              fill="#ffb32c"
              d="M12 1.5l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 8.7l7.1-.6z"
            />
          </motion.svg>
        </>
      )}
    </div>
  );
}
