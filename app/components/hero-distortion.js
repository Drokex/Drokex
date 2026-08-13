"use client";

import { useEffect, useRef, useState } from "react";

const GIF_ASPECT_RATIO = 16 / 9;
const LENS_SIZE = 520;

function getBackgroundGeometry(rect) {
  const rectRatio = rect.width / rect.height;

  if (rectRatio > GIF_ASPECT_RATIO) {
    const width = rect.width;
    const height = width / GIF_ASPECT_RATIO;

    return {
      width,
      height,
      x: 0,
      y: (rect.height - height) * 0.4,
    };
  }

  const height = rect.height;
  const width = height * GIF_ASPECT_RATIO;

  return {
    width,
    height,
    x: (rect.width - width) * 0.5,
    y: 0,
  };
}

export default function HeroDistortion({ image }) {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const pointerRef = useRef({
    active: false,
    bgHeight: 0,
    bgWidth: 0,
    bgX: 0,
    bgY: 0,
    x: 0,
    y: 0,
  });
  const [pointer, setPointer] = useState(pointerRef.current);

  useEffect(() => {
    function updatePointer(event) {
      const rect = rootRef.current?.getBoundingClientRect();

      if (!rect) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const geometry = getBackgroundGeometry(rect);

      pointerRef.current = {
        active: x >= 0 && x <= rect.width && y >= 0 && y <= rect.height,
        bgHeight: geometry.height,
        bgWidth: geometry.width,
        bgX: geometry.x,
        bgY: geometry.y,
        x,
        y,
      };

      if (frameRef.current) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        setPointer(pointerRef.current);
      });
    }

    function hidePointer() {
      pointerRef.current = { ...pointerRef.current, active: false };
      setPointer(pointerRef.current);
    }

    window.addEventListener("pointermove", updatePointer);
    window.addEventListener("mousemove", updatePointer);
    window.addEventListener("pointerleave", hidePointer);
    window.addEventListener("mouseleave", hidePointer);

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("mousemove", updatePointer);
      window.removeEventListener("pointerleave", hidePointer);
      window.removeEventListener("mouseleave", hidePointer);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={pointer.active ? "hero-distortion is-active" : "hero-distortion"}
      aria-hidden="true"
      style={{
        "--hero-bg-height": `${pointer.bgHeight}px`,
        "--hero-bg-image": `url("${image}")`,
        "--hero-bg-width": `${pointer.bgWidth}px`,
        "--hero-bg-x": `${pointer.bgX}px`,
        "--hero-bg-y": `${pointer.bgY}px`,
        "--hero-lens-offset": `${LENS_SIZE / 2}px`,
        "--hero-x": `${pointer.x}px`,
        "--hero-y": `${pointer.y}px`,
      }}
    >
      <div className="hero-distortion-lens" />
      <div className="hero-distortion-lens hero-distortion-red" />
      <div className="hero-distortion-lens hero-distortion-blue" />
    </div>
  );
}
