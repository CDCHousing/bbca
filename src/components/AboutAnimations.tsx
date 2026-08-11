"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AboutAnimations() {
  useGSAP(() => {
    // Scroll fade-up — kicker, heading, copy, image
    gsap.utils.toArray<HTMLElement>(".gsap-fade-up").forEach((el) => {
      gsap.from(el, {
        opacity: 0, y: 48, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    // Scroll stagger — aim cards
    gsap.utils.toArray<HTMLElement>(".gsap-stagger").forEach((container) => {
      gsap.from(Array.from(container.children), {
        opacity: 0, y: 40, duration: 0.7, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: container, start: "top 88%" },
      });
    });
  });

  return null;
}
