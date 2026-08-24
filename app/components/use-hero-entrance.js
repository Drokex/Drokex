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
    const descendants = root.querySelectorAll("[data-hero-item]");
    const items = root.hasAttribute("data-hero-item") ? [root, ...descendants] : descendants;
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

    return () => {
      // Si el cleanup corta la animación a medias (doble-invocación de
      // efectos en desarrollo, o desmontaje real) los items quedaban
      // atascados con opacity intermedia — forzar el estado final visible.
      ctx.revert();
      gsap.set(items, { clearProps: "transform,opacity" });
    };
  }, [rootRef]);
}
