"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function WhyJoinAnimations() {
  useGSAP(() => {
    gsap.set(".gsap-benefit-item", { opacity: 0, y: 30 });

    ScrollTrigger.batch(".gsap-benefit-item", {
      start: "top 88%",
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.1,
        }),
      once: true,
    });
  });

  return null;
}
