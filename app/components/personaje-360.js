"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const FRAMES = Array.from({ length: 8 }, (_, i) => `/personaje/vista-${i + 1}.png`);
const TOTAL = FRAMES.length;

export default function Personaje360({
  size = 400,
  autoRotate = true,
  autoSpeed = 80,
  dragSensitivity = 18,
  followCursor = false,
}) {
  // Posición flotante: ej. 2.7 = entre frame 2 y frame 3
  const currentPos = useRef(0);
  const targetPos  = useRef(0);
  const rafRef     = useRef(null);
  const [displayPos, setDisplayPos] = useState(0);

  const [dragging, setDragging] = useState(false);
  const dragStartX   = useRef(0);
  const dragStartPos = useRef(0);
  const autoRef      = useRef(null);

  // RAF: interpola suavemente currentPos → targetPos
  useEffect(() => {
    function tick() {
      let diff = targetPos.current - currentPos.current;
      // wrap-around más corto
      if (diff > TOTAL / 2)  diff -= TOTAL;
      if (diff < -TOTAL / 2) diff += TOTAL;

      if (Math.abs(diff) > 0.005) {
        currentPos.current += diff * 0.14;
        currentPos.current = ((currentPos.current % TOTAL) + TOTAL) % TOTAL;
        setDisplayPos(currentPos.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Auto-rotate
  const startAuto = useCallback(() => {
    if (!autoRotate || followCursor) return;
    autoRef.current = setInterval(() => {
      targetPos.current = (targetPos.current + 1) % TOTAL;
    }, autoSpeed);
  }, [autoRotate, autoSpeed, followCursor]);

  const stopAuto = useCallback(() => clearInterval(autoRef.current), []);

  useEffect(() => { startAuto(); return stopAuto; }, [startAuto, stopAuto]);

  // Seguir cursor
  useEffect(() => {
    if (!followCursor) return;
    function onMouseMove(e) {
      const ratio = e.clientX / window.innerWidth;
      targetPos.current = ratio * (TOTAL - 1);
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [followCursor]);

  // Drag
  function getClientX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }

  function onDragStart(e) {
    if (followCursor) return;
    stopAuto();
    setDragging(true);
    dragStartX.current   = getClientX(e);
    dragStartPos.current = targetPos.current;
  }
  function onDragMove(e) {
    if (!dragging || followCursor) return;
    const delta = (getClientX(e) - dragStartX.current) / dragSensitivity;
    targetPos.current = ((dragStartPos.current - delta) % TOTAL + TOTAL) % TOTAL;
  }
  function onDragEnd() {
    if (followCursor) return;
    setDragging(false);
    startAuto();
  }

  // Cross-fade entre dos frames adyacentes
  const frameA  = Math.floor(displayPos) % TOTAL;
  const frameB  = Math.ceil(displayPos)  % TOTAL;
  const blendB  = displayPos % 1;
  const opacities = FRAMES.map((_, i) => {
    if (frameA === frameB) return i === frameA ? 1 : 0;
    if (i === frameA) return 1 - blendB;
    if (i === frameB) return blendB;
    return 0;
  });

  return (
    <div
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={onDragStart}
      onTouchMove={onDragMove}
      onTouchEnd={onDragEnd}
      style={{
        width: size, height: size, position: "relative",
        cursor: followCursor ? "none" : dragging ? "grabbing" : "grab",
        userSelect: "none", WebkitUserSelect: "none",
      }}
    >
      {/* Sombra base */}
      <div style={{
        position: "absolute", bottom: "4%", left: "50%",
        transform: "translateX(-50%)", width: "45%", height: "3%",
        background: "radial-gradient(ellipse, rgba(127,224,64,0.35) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(8px)", pointerEvents: "none",
      }} />

      {/* Frames con cross-fade continuo */}
      {FRAMES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`vista ${i + 1}`}
          draggable={false}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "contain",
            opacity: opacities[i],
            pointerEvents: "none",
            filter: "drop-shadow(0 0 18px rgba(127,224,64,0.45))",
          }}
        />
      ))}
    </div>
  );
}
