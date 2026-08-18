"use client";

import { useEffect } from "react";
import gsap from "gsap";

// Anima al montar los elementos [data-hero-item] dentro de rootRef (el hero,
// visible desde el primer frame, no espera scroll como ScrollReveal).
export function useHeroEntrance(rootRef) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return;
    const items = root.querySelectorAll("[data-hero-item]");
    if (!items.length) return;

    if (reduceMotion) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0, y: 20, duration: 0.55, ease: "power2.out", stagger: 0.1,
        onComplete: () => gsap.set(items, { clearProps: "transform,opacity" }),
      });
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}
