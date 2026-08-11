"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    function update(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // On every route change, jump back to the top and recalculate scroll bounds.
  // Without the immediate scroll-to-top, Lenis keeps the previous page's
  // scroll position, so navigating from the bottom of one page lands on the
  // new page showing only the footer.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    lenisRef.current?.resize();
    ScrollTrigger.refresh();
  }, [pathname]);

  return <>{children}</>;
}
