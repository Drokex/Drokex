"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Anima cualquier elemento marcado con data-reveal al entrar en el viewport.
// Un solo ScrollTrigger.batch para toda la página en vez de un trigger por sección.
export default function ScrollReveal() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = gsap.utils.toArray("[data-reveal]");
    if (!targets.length || reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.set(targets, { opacity: 0, y: 24 });

    const triggers = ScrollTrigger.batch(targets, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.08,
          // algunas cards tienen su propia transition de hover en transform;
          // sin limpiar el inline style de GSAP se quedan a mitad de camino.
          onComplete: () => gsap.set(batch, { clearProps: "transform,opacity" }),
        }),
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return null;
}
