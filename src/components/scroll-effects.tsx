"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function ScrollEffects() {
  const pathname = usePathname();
  const revealOnCurrentRoute = useRef<() => void>(() => {});

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const heading = document.querySelector<HTMLElement>(
        "[data-hero-heading]",
      );
      if (!heading) return;
      gsap.fromTo(
        heading,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.72, ease: "power3.out" },
      );
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  useEffect(() => {
    revealOnCurrentRoute.current();
  }, [pathname]);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let dispose: (() => void) | undefined;
    let disposed = false;
    let request = 0;

    const setup = () => {
      const currentRequest = ++request;
      dispose?.();
      dispose = undefined;
      revealOnCurrentRoute.current = () => {};
      if (motionPreference.matches) return;

      void Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]).then(([gsapModule, triggerModule, lenisModule]) => {
        const gsap = gsapModule.gsap;
        const ScrollTrigger = triggerModule.ScrollTrigger;
        if (disposed || request !== currentRequest || motionPreference.matches)
          return;
        gsap.registerPlugin(ScrollTrigger);
        const lenis = new lenisModule.default({
          duration: 1.05,
          smoothWheel: true,
          touchMultiplier: 1.1,
        });
        const raf = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        const revealAnimations: gsap.core.Animation[] = [];
        const clearReveals = () => {
          revealAnimations.forEach((animation) => {
            animation.scrollTrigger?.kill();
            animation.kill();
          });
          revealAnimations.length = 0;
          gsap.set("[data-reveal]", { clearProps: "opacity,transform" });
        };
        const reveal = () => {
          clearReveals();
          if (motionPreference.matches) return;
          document
            .querySelectorAll<HTMLElement>("[data-reveal]")
            .forEach((element) => {
              revealAnimations.push(
                gsap.fromTo(
                  element,
                  { opacity: 0, y: 14 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.58,
                    ease: "power2.out",
                    scrollTrigger: {
                      trigger: element,
                      start: "top 90%",
                      once: true,
                    },
                  },
                ),
              );
            });
          ScrollTrigger.refresh();
        };
        revealOnCurrentRoute.current = reveal;
        reveal();
        dispose = () => {
          gsap.ticker.remove(raf);
          lenis.destroy();
          clearReveals();
          revealOnCurrentRoute.current = () => {};
        };
      });
    };

    setup();
    motionPreference.addEventListener("change", setup);
    return () => {
      disposed = true;
      request += 1;
      motionPreference.removeEventListener("change", setup);
      dispose?.();
    };
  }, []);

  return null;
}
