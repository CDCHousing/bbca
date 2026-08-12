"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Phone, Mail, MapPin, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLES = `
@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.12); opacity: 0.9; }
}
@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); }
  15%, 45% { transform: scale(1.25); }
  30% { transform: scale(1); }
}
.animate-footer-breathe { animation: footer-breathe 8s ease-in-out infinite alternate; }
.animate-footer-scroll-marquee { animation: footer-scroll-marquee 38s linear infinite; }
.animate-footer-heartbeat { animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite; }

.footer-bg-grid {
  background-size: 56px 56px;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
}
.footer-aurora {
  background: radial-gradient(circle at 50% 50%, rgba(218,144,40,0.20) 0%, rgba(208,32,47,0.14) 45%, transparent 72%);
}
/* The curtain-reveal needs a viewport-tall footer. Below md the content is
   taller than a phone viewport, so the footer falls back to normal flow at
   auto height and the clip-path/fixed positioning only kick in at md+. */
@media (min-width: 768px) {
  .footer-curtain { clip-path: polygon(0% 0, 100% 0%, 100% 100%, 0 100%); }
}
.footer-giant-bg-text {
  font-size: 22vw;
  line-height: 0.75;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.06);
  background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 65%);
  -webkit-background-clip: text;
  background-clip: text;
}
.footer-glass-pill {
  background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.12);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: background 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1);
}
.footer-glass-pill:hover {
  background: linear-gradient(145deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 100%);
  border-color: rgba(255,255,255,0.28);
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.2);
}
.footer-cta-pill {
  background: linear-gradient(145deg, #DA9028 0%, #c47f1f 100%);
  box-shadow: 0 10px 30px -8px rgba(218,144,40,0.5);
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1);
}
.footer-cta-pill:hover {
  box-shadow: 0 16px 40px -8px rgba(218,144,40,0.65);
}
`;

const FOOTER_H = "h-auto md:h-screen";

type MagneticProps = {
  as?: "a" | "button";
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  strength?: number;
};

function Magnetic({ as = "a", href, external, onClick, className, children, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, {
          x: x * strength,
          y: y * strength,
          duration: 0.4,
          ease: "power2.out",
        });
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.3)" });
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: ref }
  );

  const Comp = as === "button" ? "button" : Link;
  const extraProps =
    as === "button"
      ? { onClick }
      : {
          href: href ?? "#",
          ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
        };

  return (
    // @ts-expect-error -- polymorphic anchor/button ref
    <Comp ref={ref} className={cn("inline-flex cursor-pointer", className)} {...extraProps}>
      {children}
    </Comp>
  );
}

const FOOTER_COLS = [
  {
    head: "Explore BBCA",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Membership", href: "/membership" },
      { label: "Why Join BBCA", href: "/why-join" },
    ],
  },
  {
    head: "Contact Us",
    links: [
      { label: "020 8004 3327", href: "/contact", icon: Phone },
      { label: "contact@bbcauk.org", href: "/contact", icon: Mail },
      { label: "Cranbrook Road, London, IG2 6JZ", href: "/contact", icon: MapPin },
    ],
  },
  {
    head: "Policy",
    links: [
      { label: "Key Policies", href: "/about" },
      { label: "Aim & Objectives", href: "/about" },
      { label: "About Us", href: "/about" },
    ],
  },
];

const MarqueeItem = () => (
  <div className="flex items-center gap-12 px-6">
    <span>British Bangladeshi Construction Association</span>
    <span className="text-[#DA9028]/70">✦</span>
    <span>Building Bridges</span>
    <span className="text-[#D0202F]/70">✦</span>
    <span>Trade &amp; Industry</span>
    <span className="text-[#DA9028]/70">✦</span>
    <span>Community &amp; Growth</span>
    <span className="text-[#D0202F]/70">✦</span>
    <span>Membership Open</span>
    <span className="text-[#DA9028]/70">✦</span>
  </div>
);

export default function Footer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        giantTextRef.current,
        { y: "8vh", opacity: 0 },
        {
          y: "0vh",
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 60%",
            end: "top 10%",
            scrub: 1,
          },
        }
      );
    },
    { scope: wrapperRef }
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/*
        Curtain-reveal: this wrapper sits in normal flow and its clip-path
        makes it the containing block for the fixed footer inside, so the
        footer stays pinned to the viewport bottom and appears to rise up
        from underneath the page as you scroll past it.
      */}
      <div
        ref={wrapperRef}
        className={cn("footer-curtain relative w-full", FOOTER_H)}
      >
        <footer
          className={cn(
            "static md:fixed md:bottom-0 md:left-0 flex w-full flex-col justify-between overflow-hidden bg-[#14203D] text-white pt-14 md:pt-[92px]",
            FOOTER_H
          )}
        >
          {/* Photo backdrop */}
          <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            <Image src="/footer-bg.webp" alt="" fill sizes="100vw" className="object-cover object-center" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, #14203D 0%, rgba(20,32,61,0.92) 20%, rgba(20,32,61,0.82) 42%, rgba(20,32,61,0.8) 68%, rgba(20,32,61,0.88) 100%)",
              }}
            />
          </div>

          {/* Ambient glow + grid */}
          <div
            className="footer-aurora absolute left-1/2 top-1/2 h-[55vh] w-[75vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-full blur-[90px] pointer-events-none z-[1]"
            aria-hidden="true"
          />
          <div className="footer-bg-grid absolute inset-0 z-[1] pointer-events-none" aria-hidden="true" />

          {/* Giant background wordmark */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[3vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-[1] pointer-events-none select-none"
            aria-hidden="true"
          >
            BBCA
          </div>

          {/* Marquee strip */}
          <div className="relative z-10 w-full overflow-hidden border-y border-white/10 bg-black/20 backdrop-blur-sm py-3">
            <div className="flex w-max animate-footer-scroll-marquee text-[11px] md:text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* Main content */}
          <div
            ref={contentRef}
            className="relative z-10 flex flex-1 flex-col items-center justify-center gap-10 md:gap-12 px-5 sm:px-6 py-10 w-full max-w-[1160px] mx-auto"
          >
            <div className="flex flex-col items-center text-center gap-6">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                Ready to join <span className="text-[#DA9028]">BBCA</span>?
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Magnetic
                  href="/membership"
                  className="footer-cta-pill px-8 py-4 rounded-full text-[#14203D] font-bold text-sm md:text-base"
                >
                  Become a Member
                </Magnetic>
                <Magnetic
                  href="/contact"
                  className="footer-glass-pill px-8 py-4 rounded-full text-white font-bold text-sm md:text-base"
                >
                  Contact Us
                </Magnetic>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 w-full items-start">
              {FOOTER_COLS.map((col) => (
                <div key={col.head} className="col-span-1">
                  <h4 className="text-sm font-extrabold text-white tracking-wide mb-4">{col.head}</h4>
                  <div className="flex flex-col gap-3">
                    {col.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-[13.5px] text-white/85 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="col-span-2 md:col-span-1 flex md:justify-end">
                <Image
                  src="/bbca-logo.svg"
                  alt="BBCA"
                  width={200}
                  height={62}
                  className="h-20 w-auto object-contain brightness-0 invert"
                />
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative z-10 w-full pb-6 px-5 sm:px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-5 md:gap-4 max-w-[1160px] mx-auto">
            <div className="text-white/70 text-[11px] md:text-xs font-medium tracking-wide text-center md:text-left">
              © 2026 British Bangladeshi Construction Association — All rights reserved
            </div>

            <div className="flex items-center gap-3">
              <Magnetic
                href="https://www.facebook.com/profile.php?id=61591693263416"
                external
                className="footer-glass-pill w-11 h-11 rounded-full items-center justify-center text-white/70 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-footer-heartbeat">
                  <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
                </svg>
              </Magnetic>

              <Magnetic
                href="https://www.youtube.com/@bbca.association"
                external
                className="footer-glass-pill w-11 h-11 rounded-full items-center justify-center text-white/70 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.391.524A2.994 2.994 0 0 0 .502 6.186 31.26 31.26 0 0 0 0 12a31.26 31.26 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.107 2.117c1.886.524 9.391.524 9.391.524s7.505 0 9.391-.524a2.994 2.994 0 0 0 2.107-2.117A31.26 31.26 0 0 0 24 12a31.26 31.26 0 0 0-.502-5.814zM9.75 15.568V8.432L15.818 12z" />
                </svg>
              </Magnetic>

              <Magnetic
                href="https://www.instagram.com/bbca.association?igsh=YWwzN2VwYzByMmpj"
                external
                className="footer-glass-pill w-11 h-11 rounded-full items-center justify-center text-white/70 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Magnetic>

              <Magnetic
                as="button"
                onClick={scrollToTop}
                className="footer-glass-pill w-11 h-11 rounded-full items-center justify-center text-white/70 hover:text-white group"
              >
                <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </Magnetic>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
