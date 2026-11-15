"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Mail, MapPin, Phone } from "lucide-react";
import {
  VENUE_NAME,
  VENUE,
  VENUE_MAP_URL,
  EVENT_DATE,
  EVENT_TIME,
  EVENT_PHONE,
  EVENT_PHONE_TEL,
  EVENT_EMAIL,
  HIGHLIGHTS,
  SECTION_LINKS,
} from "@/lib/build-festival";

// Footer for /build-festival, built to public/footer.jpeg (1600px-wide design): a London
// skyline standing on a navy block, a hairline, then the BBCA logo and the organiser line.
// public/festival-skyline.svg is one 790×178 tile traced from that design; three tiles sit
// side by side, two filling the design width. Below 850px the tile stops shrinking.
//
// Motion (CSS only): the London Eye turns and Big Ben's hands go round. Both were cut out of
// the traced tile and are redrawn here as <SkylineParts>, laid over each tile in the same
// 790×178 coordinates. On scroll the skyline rises out of the block and the content fades
// up. Fireworks go off in the sky behind the skyline once it has risen: a thin streak climbs,
// pops into a tight star, its rays fly outward leaving a hollow centre, then dim in place.
// prefers-reduced-motion shows everything still and in place, with no fireworks.
const EYE = { cx: 295.5, cy: 118 }; // wheel centre, in tile units
const CLOCK = { cx: 202.35, cy: 82.6 };
const EYE_CUT = 158; // below this line the traced tile still holds the wheel's base and the buildings in front

// Fireworks only run once the skyline block has been revealed (or JS never hid it).
const FW_ON = ':not([data-reveal="pre"]) > .ff-sky';

const FOOTER_CSS = `
.ff-skyline {
  --tile: max(49.375vw, 420px);
  height: calc(var(--tile) * 0.2253);
}
.ff-tile { width: var(--tile); background: url(/festival-skyline.svg) no-repeat 0 0 / 100% 100%; }
.ff-wheel { transform-origin: ${EYE.cx}px ${EYE.cy}px; animation: ff-turn 80s linear infinite; }
.ff-hand-m, .ff-hand-h { transform-origin: ${CLOCK.cx}px ${CLOCK.cy}px; }
.ff-hand-m { animation: ff-turn 60s linear infinite; }
.ff-hand-h { animation: ff-turn 720s linear infinite; animation-delay: -120s; }
@keyframes ff-turn { to { transform: rotate(360deg); } }

/* One loop per firework: 0-14% a thin streak climbs and its tail pulls in, 14-30% the rays
   shoot outward from the centre, 30-58% they drift a little further and dim, then dark.
   --r is how far a ray's inner end travels from the centre, in drawing units. */
@media (max-width: 639px) { .ff-fw { scale: 0.7; } }
.ff-fw-shell, .ff-fw-ray { transform-box: fill-box; opacity: 0; }
.ff-fw-shell { transform-origin: top center; }
.ff-fw-ray { transform-origin: bottom center; }
${FW_ON} .ff-fw-shell { animation: ff-fw-rise var(--p) linear var(--t) infinite; }
${FW_ON} .ff-fw-ray   { animation: ff-fw-ray var(--p) linear var(--t) infinite; }
@keyframes ff-fw-rise {
  0% { transform: translateY(120px) scaleY(1); opacity: 0; animation-timing-function: cubic-bezier(0.25, 0.6, 0.35, 1); }
  2% { opacity: 1; }
  14% { transform: translateY(0) scaleY(0.15); opacity: 1; }
  14.5%, 100% { transform: translateY(0) scaleY(0.15); opacity: 0; }
}
@keyframes ff-fw-ray {
  0%, 14% { transform: translateY(0) scaleY(0.25); opacity: 0; }
  14.5% { transform: translateY(0) scaleY(0.25); opacity: 1; animation-timing-function: cubic-bezier(0.1, 0.75, 0.25, 1); }
  30% { transform: translateY(calc(var(--r) * -1px)) scaleY(1); opacity: 1; animation-timing-function: ease-out; }
  40% { opacity: 0.75; }
  58%, 100% { transform: translateY(calc(var(--r) * -1.2px)) scaleY(0.8); opacity: 0; }
}

.ff-rise { transition: transform 1.3s cubic-bezier(0.22, 1, 0.36, 1); }
.ff-fade { transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1); transition-delay: var(--d, 0s); }
[data-reveal="pre"] .ff-rise { transform: translateY(101%); }
[data-reveal="pre"] .ff-fade { opacity: 0; transform: translateY(18px); }
@media (prefers-reduced-motion: reduce) {
  .ff-wheel, .ff-hand-m, .ff-hand-h { animation: none; }
  .ff-rise, .ff-fade { transition: none; }
  .ff-sky { display: none; }
  [data-reveal="pre"] .ff-rise, [data-reveal="pre"] .ff-fade { opacity: 1; transform: none; }
}
`;

const NAVY = "#051F44";
const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [+(EYE.cx + r * Math.cos(a)).toFixed(2), +(EYE.cy + r * Math.sin(a)).toFixed(2)];
};
const SPOKES = Array.from({ length: 32 }, (_, i) => i * 11.25); // one capsule each; every other one has a spoke;
// Zigzag bracing between the two rims.
const TRUSS = Array.from({ length: 65 }, (_, i) => polar(i % 2 ? 51 : 45.5, i * 5.625).join(",")).join(" ");

// Fireworks in the sky, styled after a flat line-art fireworks clip: one colour per burst,
// built from straight rays alternating long and short. x/y place the burst centre in the sky
// layer (%), size is its width in px, period and start are seconds. Different periods keep
// them from ever syncing up. `wide` ones only show from md up.
const GOLD = "#DA9028";
const RED = "#D0202F";
const GREEN = "#0A7D3E";
const FIREWORKS = [
  { x: 6, y: 44, size: 78, color: GOLD, period: 4.2, start: 0.3 },
  { x: 15, y: 30, size: 104, color: RED, period: 5.1, start: 1.6 },
  { x: 25, y: 52, size: 66, color: GREEN, period: 3.8, start: 2.7, wide: true },
  { x: 33, y: 34, size: 92, color: GOLD, period: 4.7, start: 0.9 },
  { x: 43, y: 48, size: 72, color: RED, period: 4.0, start: 3.4, wide: true },
  { x: 51, y: 26, size: 112, color: GOLD, period: 5.6, start: 2.1 },
  { x: 60, y: 46, size: 70, color: GREEN, period: 3.9, start: 0.6, wide: true },
  { x: 68, y: 32, size: 96, color: RED, period: 4.9, start: 3.0 },
  { x: 77, y: 50, size: 68, color: GOLD, period: 4.3, start: 1.2, wide: true },
  { x: 85, y: 30, size: 100, color: GREEN, period: 5.3, start: 2.4 },
  { x: 94, y: 46, size: 76, color: RED, period: 4.5, start: 0.1 },
];
// 36 rays round the centre, alternating long and short, with a little jitter so the edge
// isn't ruled. r is where the ray's inner end lands, len its length, w its thickness.
const RAYS = Array.from({ length: 36 }, (_, i) => {
  const long = i % 2 === 0;
  const j = ((i * 37) % 7) - 3;
  return {
    deg: +(i * 10 + (long ? 0 : 2)).toFixed(1),
    r: +((long ? 17 : 21) + j * 0.8).toFixed(1),
    len: +((long ? 25 : 13) + j * 0.9).toFixed(1),
    w: long ? 1.7 : 1.3,
  };
});

function Firework({ x, y, size, color, period, start, wide }: (typeof FIREWORKS)[number]) {
  return (
    <svg
      viewBox="-50 -50 100 100"
      width={size}
      height={size}
      className={`ff-fw absolute overflow-visible -translate-x-1/2 -translate-y-1/2 ${wide ? "hidden md:block" : ""}`}
      style={{ left: `${x}%`, top: `${y}%`, "--p": `${period}s`, "--t": `${start}s` } as React.CSSProperties}
    >
      <rect className="ff-fw-shell" x="-0.7" y="0" width="1.4" height="26" rx="0.7" fill={color} />
      <g fill={color}>
        {RAYS.map(({ deg, r, len, w }) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <rect className="ff-fw-ray" x={-w / 2} y={-len} width={w} height={len} rx={w / 2} style={{ "--r": r } as React.CSSProperties} />
          </g>
        ))}
      </g>
    </svg>
  );
}

// The moving parts of one skyline tile.
function SkylineParts() {
  return (
    <svg viewBox="0 0 790 178" preserveAspectRatio="none" className="block w-full h-full" aria-hidden="true">
      {/* Nested viewport clips the wheel at EYE_CUT */}
      <svg width="790" height={EYE_CUT} viewBox={`0 0 790 ${EYE_CUT}`} preserveAspectRatio="none">
        <g className="ff-wheel" fill="none" stroke={NAVY}>
          <circle cx={EYE.cx} cy={EYE.cy} r="51" strokeWidth="1.8" />
          <circle cx={EYE.cx} cy={EYE.cy} r="45.5" strokeWidth="1.3" />
          <polyline points={TRUSS} strokeWidth="0.6" />
          {SPOKES.map((deg, i) => {
            const [x, y] = polar(45.5, deg);
            const [px, py] = polar(54.2, deg);
            return (
              <g key={deg}>
                {i % 2 === 0 && <line x1={EYE.cx} y1={EYE.cy} x2={x} y2={y} strokeWidth="0.75" />}
                <circle cx={px} cy={py} r="2.3" fill={NAVY} stroke="none" />
              </g>
            );
          })}
        </g>
        {/* Still: A-frame legs and hub */}
        <g stroke={NAVY} strokeLinecap="round">
          <line x1={EYE.cx} y1={EYE.cy} x2="283.5" y2="162" strokeWidth="2.4" />
          <line x1={EYE.cx} y1={EYE.cy} x2="310.5" y2="166" strokeWidth="2.4" />
          <line x1={EYE.cx} y1={EYE.cy} x2={EYE.cx} y2="162" strokeWidth="0.7" />
        </g>
        <circle cx={EYE.cx} cy={EYE.cy} r="4.2" fill={NAVY} />
      </svg>
      <g stroke={NAVY} strokeLinecap="round">
        <line className="ff-hand-m" x1={CLOCK.cx} y1={CLOCK.cy} x2={CLOCK.cx} y2={CLOCK.cy - 6.6} strokeWidth="0.9" />
        <line className="ff-hand-h" x1={CLOCK.cx} y1={CLOCK.cy} x2={CLOCK.cx} y2={CLOCK.cy - 4.4} strokeWidth="1.2" />
      </g>
      <circle cx={CLOCK.cx} cy={CLOCK.cy} r="1" fill={NAVY} />
    </svg>
  );
}

const HEADING = "text-[12px] font-semibold uppercase tracking-[1.2px] text-[#DA9028] mb-4";
const ITEM = "flex items-start gap-2.5 text-[14px] leading-snug text-[#C9D4E5]";
const LINK = "hover:text-white transition-colors";

export default function FestivalFooter() {
  const ref = useRef<HTMLElement>(null);

  // Each [data-reveal] block starts hidden once JS runs, then plays in as it scrolls into view.
  useEffect(() => {
    const blocks = [...ref.current!.querySelectorAll("[data-reveal]")];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          // Also plays every block above it, in case a jump scrolled straight past them.
          blocks.slice(0, blocks.indexOf(e.target) + 1).forEach((b) => {
            b.setAttribute("data-reveal", "in");
            io.unobserve(b);
          });
        }),
      { rootMargin: "0px 0px -60px 0px" },
    );
    blocks.forEach((b) => {
      b.setAttribute("data-reveal", "pre");
      io.observe(b);
    });
    return () => io.disconnect();
  }, []);

  return (
    <footer ref={ref}>
      <style>{FOOTER_CSS}</style>
      {/* -mb-px: no hairline gap between the tile and the block at fractional zoom */}
      <div className="relative -mb-px" data-reveal="">
        {/* Sky layer: reaches 110px above the skyline, into the white gap under the page */}
        <div className="ff-sky absolute inset-x-0 -top-[110px] bottom-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {FIREWORKS.map((f) => (
            <Firework key={f.x} {...f} />
          ))}
        </div>
        <div className="ff-skyline relative overflow-hidden">
          <div className="ff-rise flex h-full">
            {[0, 1, 2].map((i) => (
              <div key={i} className="ff-tile flex-none h-full">
                <SkylineParts />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#051F44] text-white">
        <div className="max-w-[1392px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1.2fr_0.8fr_1fr] gap-x-8 gap-y-10 pt-14 pb-14 md:pt-20 md:pb-20" data-reveal="">
            <div className="ff-fade col-span-2 lg:col-span-1">
              <p className="text-[21px] md:text-[24px] font-bold leading-tight tracking-tight">
                British Bangladeshi
                <br />
                Build Festival London 2026
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-x-2.5 text-[13px] font-medium uppercase tracking-[1px] text-[#C9D4E5]">
                {HIGHLIGHTS.map((h, i) => (
                  <span key={h} className="flex items-center gap-2.5">
                    {i > 0 && <span className="text-[#DA9028]">✦</span>}
                    {h}
                  </span>
                ))}
              </p>
              <Link
                href="/build-festival/visitor-registration"
                className="mt-6 inline-flex items-center gap-3 bg-white text-[#051F44] font-semibold text-[14px] pl-6 pr-1.5 py-1.5 rounded-full hover:bg-[#E4F0F2] transition-colors"
              >
                Register as Visitor
                <span className="grid place-items-center w-9 h-9 rounded-full bg-[#D0202F] text-white">
                  <ArrowRight size={16} strokeWidth={2.5} />
                </span>
              </Link>
            </div>

            <div className="ff-fade col-span-2 sm:col-span-1" style={{ "--d": "0.1s" } as React.CSSProperties}>
              <h2 className={HEADING}>Event</h2>
              <ul className="space-y-3">
                <li className={ITEM}>
                  <CalendarDays size={17} className="text-[#DA9028] shrink-0 mt-px" />
                  {EVENT_DATE}
                </li>
                <li className={ITEM}>
                  <Clock size={17} className="text-[#DA9028] shrink-0 mt-px" />
                  {EVENT_TIME}
                </li>
                <li className={ITEM}>
                  <MapPin size={17} className="text-[#DA9028] shrink-0 mt-px" />
                  <a href={VENUE_MAP_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
                    {VENUE_NAME}
                    <br />
                    {VENUE}
                  </a>
                </li>
              </ul>
            </div>

            <div className="ff-fade" style={{ "--d": "0.2s" } as React.CSSProperties}>
              <h2 className={HEADING}>Explore</h2>
              <ul className="space-y-2.5 text-[14px] text-[#C9D4E5]">
                {SECTION_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className={LINK}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ff-fade" style={{ "--d": "0.3s" } as React.CSSProperties}>
              <h2 className={HEADING}>Contact</h2>
              <ul className="space-y-3">
                <li className={ITEM}>
                  <Phone size={17} className="text-[#DA9028] shrink-0 mt-px" />
                  <a href={`tel:${EVENT_PHONE_TEL}`} className={LINK}>
                    {EVENT_PHONE}
                  </a>
                </li>
                <li className={ITEM}>
                  <Mail size={17} className="text-[#DA9028] shrink-0 mt-px" />
                  <a href={`mailto:${EVENT_EMAIL}`} className={`${LINK} break-all`}>
                    {EVENT_EMAIL}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/60 pt-9 pb-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-6" data-reveal="">
            <Link href="/" className="ff-fade shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/bbca-logo-white.svg" alt="BBCA — British Bangladeshi Construction Association" width={173} height={64} className="h-16 w-auto" />
            </Link>
            <div className="ff-fade text-center md:text-left md:pt-3.5" style={{ "--d": "0.12s" } as React.CSSProperties}>
              <p className="text-[15px] md:text-[17px] text-[#C9D4E5]">
                Organised by British Bangladeshi Construction Association (BBCA)
              </p>
              <p className="mt-2.5 flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-[11.5px] text-[#C9D4E5]">
                <span>© 2026 BBCA. All Rights Reserved.</span>
                <span aria-hidden="true">|</span>
                <span>Privacy Policy</span>
                <span aria-hidden="true">|</span>
                <span>Terms &amp; Conditions</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
