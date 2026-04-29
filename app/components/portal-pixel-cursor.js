"use client";

import { useEffect, useRef, useState } from "react";

export default function PortalPixelCursor() {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const [pointer, setPointer] = useState({ x: 0, y: 0, active: false });

  useEffect(() => {
    function handlePointerMove(event) {
      const rect = rootRef.current?.getBoundingClientRect();

      if (!rect) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const active = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

      pointerRef.current = { x, y, active };

      if (frameRef.current) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        setPointer(pointerRef.current);
      });
    }

    function handlePointerLeave() {
      pointerRef.current = { ...pointerRef.current, active: false };
      setPointer(pointerRef.current);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("mouseleave", handlePointerLeave);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={pointer.active ? "portal-distortion is-active" : "portal-distortion"}
      aria-hidden="true"
      style={{
        "--portal-x": `${pointer.x}px`,
        "--portal-y": `${pointer.y}px`,
      }}
    >
      <div className="portal-distortion-lens" />
      <div className="portal-distortion-lens portal-distortion-red" />
      <div className="portal-distortion-lens portal-distortion-blue" />
    </div>
  );
}
