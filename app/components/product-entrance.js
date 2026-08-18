"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ProductEntrance({ breadcrumbsClassName, gridClassName, infoPanelClassName, breadcrumbs, gallery, infoPanel }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return;

    const crumbs = root.querySelector(`.${CSS.escape(breadcrumbsClassName)}`);
    const galleryPanel = root.querySelector(`.${CSS.escape(gridClassName)} > :first-child`);
    const infoPanelEl = root.querySelector(`.${CSS.escape(infoPanelClassName)}`);
    const infoChildren = infoPanelEl ? Array.from(infoPanelEl.children) : [];

    if (reduceMotion) {
      gsap.set([crumbs, galleryPanel, ...infoChildren], { opacity: 1, y: 0, x: 0 });
      return;
    }

    const all = [crumbs, galleryPanel, ...infoChildren].filter(Boolean);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        // el CSS de algunos botones (quote-cta-btn) tiene su propia transition
        // en transform: pelea con la de GSAP y deja el elemento a mitad de camino.
        // Al terminar se limpia el inline style para que quede en su posición natural.
        onComplete: () => gsap.set(all, { clearProps: "transform,opacity" }),
      });
      if (crumbs) tl.from(crumbs, { opacity: 0, y: -8, duration: 0.35 });
      if (galleryPanel) tl.from(galleryPanel, { opacity: 0, x: -24, duration: 0.5 }, "-=0.15");
      if (infoChildren.length) tl.from(infoChildren, { opacity: 0, y: 16, duration: 0.4, stagger: 0.06 }, "-=0.35");
    }, root);

    return () => ctx.revert();
  }, [breadcrumbsClassName, gridClassName, infoPanelClassName]);

  return (
    <div ref={rootRef}>
      {breadcrumbs}
      <div className={gridClassName}>
        {gallery}
        {infoPanel}
      </div>
    </div>
  );
}
