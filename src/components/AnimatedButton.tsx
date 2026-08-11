"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(useGSAP);

interface AnimatedButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedButton({ href, children, className = "" }: AnimatedButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    const arrow = arrowRef.current;
    if (!el || !arrow) return;

    // Paused tweens — play forward on enter, reverse on leave (easeReverse pattern)
    const lift = gsap.to(el, {
      y: -3,
      scale: 1.03,
      boxShadow: "0 8px 24px rgba(20,32,61,0.22)",
      duration: 0.35,
      ease: "power2.out",
      paused: true,
    });

    const arrowSlide = gsap.to(arrow, {
      x: 4,
      duration: 0.3,
      ease: "power2.out",
      paused: true,
    });

    const onEnter = () => { lift.play(); arrowSlide.play(); };
    const onLeave = () => { lift.reverse(); arrowSlide.reverse(); };
    const onDown  = () => gsap.to(el, { scale: 0.97, duration: 0.1, ease: "power2.in" });
    const onUp    = () => gsap.to(el, { scale: 1.03, duration: 0.15, ease: "power2.out" });

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseup", onUp);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseup", onUp);
    };
  }, { scope: ref });

  return (
    <Link
      ref={ref}
      href={href}
      className={`inline-flex items-center gap-0 bg-[#1B2A52] text-white font-semibold text-[13.5px] pl-5 pr-2 py-2.5 rounded-full will-change-transform ${className}`}
      style={{ display: "inline-flex" }}
    >
      <span>{children}</span>
      <span ref={arrowRef} className="ml-3 inline-flex items-center shrink-0">
        <ArrowRight size={13} strokeWidth={2.5} />
      </span>
    </Link>
  );
}
