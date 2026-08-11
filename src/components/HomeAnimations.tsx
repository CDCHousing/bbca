"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HomeAnimations() {
  useGSAP((_, contextSafe) => {
    const cleanups: (() => void)[] = [];

    // Hero bg — Ken Burns (slow zoom-in)
    gsap.fromTo(".gsap-hero-bg",
      { scale: 1.12 },
      { scale: 1.0, duration: 8, ease: "power1.out" }
    );

    // Hero bg — parallax on scroll
    ScrollTrigger.create({
      trigger: ".gsap-hero-section",
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        gsap.set(".gsap-hero-bg", { y: self.progress * 80 });
      },
    });

    // Hero — animate on load
    gsap.from(".gsap-hero-badge", { opacity: 0, y: 20, duration: 0.7, ease: "power3.out", delay: 0.2 });
    gsap.from(".gsap-hero-title", { opacity: 0, y: 50, duration: 1, ease: "power3.out", delay: 0.4 });
    gsap.from(".gsap-hero-cta", { opacity: 0, y: 20, duration: 0.7, ease: "power3.out", delay: 0.75 });

    // Hero button hover
    const btn = document.querySelector<HTMLElement>(".gsap-hero-btn");
    const arrow = document.querySelector<HTMLElement>(".gsap-hero-btn-arrow");

    if (btn && arrow && contextSafe) {
      const onEnter = contextSafe(() => {
        gsap.to(btn, { scale: 1.06, duration: 0.3, ease: "power2.out" });
        gsap.to(arrow, { x: 5, duration: 0.3, ease: "power2.out" });
      });
      const onLeave = contextSafe(() => {
        gsap.to(btn, { scale: 1, duration: 0.25, ease: "power2.out" });
        gsap.to(arrow, { x: 0, duration: 0.25, ease: "power2.out" });
      });
      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        btn.removeEventListener("mouseenter", onEnter);
        btn.removeEventListener("mouseleave", onLeave);
      });
    }

    // Hero text 3D tilt
    const hero = document.querySelector<HTMLElement>(".gsap-hero-section");
    const text = document.querySelector<HTMLElement>(".gsap-hero-text");

    if (hero && text && contextSafe) {
      gsap.set(text, { transformPerspective: 1000, transformOrigin: "center center" });

      const onMove = contextSafe((e: Event) => {
        const me = e as MouseEvent;
        const rect = hero.getBoundingClientRect();
        const normX = (me.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const normY = (me.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        gsap.to(text, { rotateY: normX * 10, rotateX: -normY * 6, duration: 0.6, ease: "power2.out" });
      });

      const onLeave = contextSafe(() => {
        gsap.to(text, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "power3.out" });
      });

      hero.addEventListener("mousemove", onMove);
      hero.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        hero.removeEventListener("mousemove", onMove);
        hero.removeEventListener("mouseleave", onLeave);
      });
    }

    // Scroll fade-up
    gsap.utils.toArray<HTMLElement>(".gsap-fade-up").forEach((el) => {
      gsap.from(el, {
        opacity: 0, y: 48, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    // Scroll stagger
    gsap.utils.toArray<HTMLElement>(".gsap-stagger").forEach((container) => {
      gsap.from(Array.from(container.children), {
        opacity: 0, y: 40, duration: 0.7, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: container, start: "top 88%" },
      });
    });

    // Stats — stagger fade-in + counters fire together on one trigger
    const statsContainer = document.querySelector<HTMLElement>(".gsap-stats-section");
    if (statsContainer) {
      ScrollTrigger.create({
        trigger: statsContainer,
        start: "top 88%",
        once: true,
        onEnter() {
          gsap.from(Array.from(statsContainer.children), {
            opacity: 0, y: 40, duration: 0.7, ease: "power3.out", stagger: 0.12,
          });
          statsContainer.querySelectorAll<HTMLElement>(".gsap-stat-num").forEach((el) => {
            const target = parseInt(el.dataset.val ?? "0", 10);
            const suffix = el.dataset.suffix ?? "";
            const obj = { n: 0 };
            gsap.to(obj, {
              n: target, duration: 2, ease: "power2.out",
              onUpdate() { el.textContent = Math.round(obj.n) + suffix; },
            });
          });
        },
      });
    }

    return () => cleanups.forEach((fn) => fn());
  });

  return null;
}
