"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ProductFeaturesBar({ className, innerClassName, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = ref.current?.querySelectorAll(":scope > div");
    if (!items?.length) return;

    if (reduceMotion) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0, y: 20, duration: 0.45, ease: "power2.out", stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top 88%" },
        onComplete: () => gsap.set(items, { clearProps: "transform,opacity" }),
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div className={className}>
      <div ref={ref} className={innerClassName}>
        {children}
      </div>
    </div>
  );
}
