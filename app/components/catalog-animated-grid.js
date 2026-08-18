"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CatalogAnimatedGrid({ className, children, gridKey }) {
  const ref = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = ref.current?.querySelectorAll(":scope > article, :scope > div");
    if (!cards?.length) return;

    if (reduceMotion) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.045,
          // .cdkCard tiene su propia transition en transform (hover); sin esto
          // el inline style de GSAP se queda peleando con ella y la card no
          // vuelve del todo a su sitio.
          onComplete: () => gsap.set(cards, { clearProps: "transform,opacity" }),
        }
      );
    }, ref);

    return () => ctx.revert();
    // gridKey cambia con los filtros: re-anima al entrar un set de productos distinto
  }, [gridKey]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
