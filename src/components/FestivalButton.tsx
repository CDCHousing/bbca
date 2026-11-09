"use client";

import Link from "next/link";

/**
 * Navbar "Build Festival" button, styled after the festival logo (BuildFestivalLogo.tsx):
 * a navy-to-blue pill (the logo's roof / lettering colours) dressed with the logo's own
 * artwork — gold stars, magenta/orange splash bursts, teal and coral curly confetti and
 * confetti dots. Shapes are cropped straight from the logo's paths, and they move the
 * way the logo does: stars twinkle, splashes pulse, springs sway, dots float.
 * prefers-reduced-motion shows it still.
 */

const CSS = `
.fb-part { transform-box: fill-box; }
.fb-star   { transform-origin: center; animation: fb-twinkle 2.6s cubic-bezier(0.45,0,0.55,1) infinite alternate; }
.fb-spring { transform-origin: center; animation: fb-sway 3.4s cubic-bezier(0.45,0,0.55,1) infinite alternate; }
.fb-dot    { transform-origin: center; animation: fb-float 2s cubic-bezier(0.45,0,0.55,1) infinite alternate; }
.fb-splash-l { transform-origin: right bottom; animation: fb-burst 2.3s cubic-bezier(0.45,0,0.55,1) infinite alternate; }
.fb-splash-r { transform-origin: left bottom;  animation: fb-burst 2.3s cubic-bezier(0.45,0,0.55,1) infinite alternate; }
.fb-shine  { animation: fb-shine 3.6s ease-in-out infinite; }
@keyframes fb-twinkle { from { transform: rotate(-20deg) scale(0.8); } to { transform: rotate(20deg) scale(1.15); } }
@keyframes fb-sway    { from { transform: rotate(-18deg) translateY(2px); } to { transform: rotate(18deg) translateY(-2px); } }
@keyframes fb-float   { from { transform: translateY(3px) scale(0.6); } to { transform: translateY(-3px) scale(1.2); } }
@keyframes fb-burst   { from { transform: rotate(-6deg) scale(0.8); } to { transform: rotate(6deg) scale(1.12); } }
@keyframes fb-shine   { 0%, 55% { left: -40%; } 85%, 100% { left: 130%; } }
@media (prefers-reduced-motion: reduce) {
  .fb-star, .fb-spring, .fb-dot, .fb-splash-l, .fb-splash-r, .fb-shine { animation: none; }
  .fb-shine { display: none; }
}
`;

// Delays desync identical loops (negative = start mid-swing, so nothing jumps on load).
const d = (ms: number) => ({ animationDelay: `-${ms}ms` });

function StarLeft() {
  return (
    <svg viewBox="127 39 97 79" className="h-[15px] w-auto overflow-visible" aria-hidden>
      <polygon className="fb-part fb-star" style={d(1300)} fill="#ffb32c" points="200.72 98.62 175.04 95.77 158.13 115.33 152.89 90.02 129.07 79.98 151.53 67.18 153.72 41.43 172.83 58.82 198 52.95 187.35 76.5 200.72 98.62" />
    </svg>
  );
}

function StarRight() {
  return (
    <svg viewBox="548 39 76 79" className="h-[15px] w-auto overflow-visible" aria-hidden>
      <polygon className="fb-part fb-star" style={d(2250)} fill="#ffb32c" points="549.88 98.62 575.56 95.77 592.47 115.33 597.71 90.02 621.53 79.98 599.07 67.18 596.89 41.43 577.77 58.82 552.61 52.95 563.25 76.5 549.88 98.62" />
    </svg>
  );
}

function SplashLeft() {
  return (
    <svg viewBox="134 208 92 76" className="h-[22px] w-auto overflow-visible" aria-hidden>
      <path className="fb-part fb-splash-l" style={d(1100)} fill="#ff7e0a" d="M207.34,281.38s-1.94-35.18-34-48.25c-32.06-13.07-46.99,18.5-26.68,24.65,20.31,6.15,39.98-9.04,60.68,23.59Z" />
      <path className="fb-part fb-splash-l" style={d(1850)} fill="#ce0092" d="M181.04,280.85s-10.91-13.21-33.82-8.92c-22.91,4.29-8.81,24.99,4.28,17.37,13.08-7.62,19.7-10.3,29.54-8.45Z" />
      <path className="fb-part fb-splash-l" style={d(2500)} fill="#ce0092" d="M216.35,266.24s12.39-18.42,5.4-47.04c-7-28.62-32.02-21.07-30.92-4.33,1.11,16.74,26.32,21.33,25.52,51.37Z" />
    </svg>
  );
}

function SplashRight() {
  return (
    <svg viewBox="522 228 88 80" className="h-[22px] w-auto overflow-visible" aria-hidden>
      <path className="fb-part fb-splash-r" style={d(1500)} fill="#ff7e0a" d="M532.68,305.88s1.87-33.96,32.83-46.58c30.96-12.62,45.37,17.87,25.76,23.8-19.61,5.94-38.61-8.72-58.59,22.78Z" />
      <path className="fb-part fb-splash-r" style={d(2100)} fill="#ce0092" d="M556.48,302.27s10.53-12.76,32.65-8.61c22.12,4.14,8.5,24.13-4.13,16.77-12.63-7.36-19.02-9.95-28.52-8.15Z" />
      <path className="fb-part fb-splash-r" style={d(2550)} fill="#ce0092" d="M529.06,286.4s-11.97-17.78-5.21-45.42c6.76-27.64,30.92-20.35,29.85-4.18-1.07,16.16-25.41,20.59-24.64,49.6Z" />
    </svg>
  );
}

function SpringTeal() {
  return (
    <svg viewBox="0 606 60 44" className="h-[13px] w-auto overflow-visible" aria-hidden>
      <g className="fb-part fb-spring" style={d(1700)}>
        <path fill="#1b9692" d="M51.08,614.3s11.27-13.3,23.28-4.6c-1.64,3.14-3.11,6.39-3.11,6.39,0,0-7.83-7.94-18.46,1.01-1.61-1.37-1.71-2.8-1.71-2.8Z" />
        <path fill="#1b9692" d="M27.09,629.61l-6.33-3.44s3.89-4.96,8.87-8.8c2.16,1.74,4.14,3.57,5.51,5.69-2.41,1.6-5.08,3.73-8.05,6.55Z" />
        <path fill="#25b3b4" d="M45.59,635.62c-6.54-6.46.2-15.2,1.19-16.4-2.83-.41-6.67.55-11.64,3.85-1.37-2.13-3.35-3.95-5.51-5.69,2.11-1.63,4.41-3.05,6.7-3.81,1.32-.44,15.44-5,21.04,4.17,8.41,13.76-5.34,24.25-11.78,17.89ZM50.08,620.57s.05.06.07.1c-5.21,7.88-1.63,15.93,2,10.3,1.72-2.67,1.25-7.87-2.07-10.4Z" />
        <path fill="#25b3b4" d="M10.6,620.15c-7.7,2.55-10.6,7.42-10.6,7.42l2.08,9.03s8.17-9.05,15.48-10.74c7.31-1.69,13,6.43,8.86,11.7-2.23,2.84-6.19-4.23,2.66-9.26-1.25-2.05-7.91-2.63-7.91-2.63,0,0-8.35,9.6-1.31,16.55,6.44,6.36,20.19-4.12,11.78-17.89-5.6-9.17-19.73-4.61-21.04-4.17Z" />
      </g>
    </svg>
  );
}

function SpringCoral() {
  return (
    <svg viewBox="636 683 50 62" className="h-[14px] w-auto overflow-visible" aria-hidden>
      <g className="fb-part fb-spring" style={d(2900)}>
        <path fill="#b53c51" d="M658.04,723.75s11.21,7.93,5.21,17.95c-2.58-1.07-5.23-2-5.23-2,0,0,5.69-6.69-2.06-14.41.96-1.36,2.08-1.54,2.08-1.54Z" />
        <path fill="#b53c51" d="M644.38,705.99l2.26-5.2s4.16,2.71,7.51,6.35c-1.22,1.81-2.51,3.49-4.09,4.71-1.42-1.78-3.28-3.73-5.69-5.86Z" />
        <path fill="#e24f61" d="M655.78,728.93c6.81-5.03,2.26-15.79,1.83-16.79-.75-1.74-2.03-3.45-3.45-4.99-1.22,1.81-2.51,3.49-4.09,4.71,2.93,3.68,3.94,6.62,3.82,8.87-1.01-.69-8.33-5.38-12.95.2-4.55,5.49,4.62,15.55,14.84,8.01ZM645.04,725.74c-4.67-2.45,1.4-5.81,7.94-2.27.03-.02.04-.04.07-.06-1.75,2.78-5.8,3.5-8.01,2.34Z" />
        <path fill="#e24f61" d="M650.66,692.4c-2.53-5.86-6.55-7.8-6.55-7.8l-6.94,2.25s7.66,5.79,9.49,11.41c1.82,5.62-4.15,10.64-8.57,7.75-2.38-1.55,2.9-5.15,7.45,1.45,1.52-1.12,1.52-6.38,1.52-6.38,0,0-8.1-5.89-13.07.11-4.55,5.49,4.62,15.55,14.84,8.01,6.81-5.03,2.26-15.79,1.83-16.79Z" />
      </g>
    </svg>
  );
}

// Confetti dots in the logo's colours: [left/right offset class, top, size, colour, delay].
const DOTS: [string, string, number, string, number][] = [
  ["left-[18%]", "-9px", 5, "#f4ba2b", 300],
  ["left-[42%]", "-7px", 4, "#25b3b4", 1200],
  ["left-[66%]", "-9px", 4, "#e24f61", 700],
  ["left-[34%]", "calc(100% + 4px)", 4, "#557bc6", 1500],
  ["left-[56%]", "calc(100% + 5px)", 5, "#f4ba2b", 500],
];

/** fullWidth: stretch to the container (mobile menu); side margin keeps the splashes on-screen. */
export default function FestivalButton({
  fullWidth = false,
  onClick,
}: {
  fullWidth?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className={`group relative flex ${fullWidth ? "mx-[26px]" : ""}`}>
      <style>{CSS}</style>

      {/* Logo artwork around the pill */}
      <span className="pointer-events-none absolute -left-[13px] -top-[11px] flex"><StarLeft /></span>
      <span className="pointer-events-none absolute -right-[13px] -top-[11px] flex"><StarRight /></span>
      <span className="pointer-events-none absolute -left-[24px] top-1/2 flex -translate-y-1/2"><SplashLeft /></span>
      <span className="pointer-events-none absolute -right-[24px] top-1/2 flex -translate-y-1/2"><SplashRight /></span>
      <span className="pointer-events-none absolute -bottom-[10px] left-[10px] flex"><SpringTeal /></span>
      <span className="pointer-events-none absolute -bottom-[11px] right-[12px] flex"><SpringCoral /></span>
      {DOTS.map(([pos, top, size, color, delay], i) => (
        <span
          key={i}
          aria-hidden
          className={`fb-dot pointer-events-none absolute rounded-full ${pos}`}
          style={{ top, width: size, height: size, backgroundColor: color, ...d(delay) }}
        />
      ))}

      <Link
        href="/build-festival"
        onClick={onClick}
        className={`relative flex ${fullWidth ? "w-full justify-center" : ""} items-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(120deg,#0044b2,#001f80_70%)] px-6 py-3 shadow-[0_6px_18px_rgba(0,31,128,0.3)] transition-transform duration-200 group-hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4ba2b] focus-visible:ring-offset-2`}
      >
        <span
          aria-hidden
          className="fb-shine pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)]"
        />
        <span className="relative whitespace-nowrap text-[14px] font-extrabold uppercase leading-none tracking-[0.6px] text-white">
          Build <span className="text-[#ffcf68]">Festival</span>
        </span>
      </Link>
    </div>
  );
}
