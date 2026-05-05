"use client";

import { useState, useEffect, useRef } from "react";

export default function ProductThemeToggle() {
  const [light, setLight] = useState(true);
  const pageRef = useRef(null);

  useEffect(() => {
    const page = document.querySelector(".pd-page");
    pageRef.current = page;
    const shouldUseLight = localStorage.getItem("pd-theme") !== "dark";
    setLight(shouldUseLight);
    page?.classList.toggle("pd-light", shouldUseLight);
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    pageRef.current?.classList.toggle("pd-light", next);
    localStorage.setItem("pd-theme", next ? "light" : "dark");
  }

  return (
    <button
      onClick={toggle}
      title={light ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      style={{
        position: "fixed",
        top: 88,
        right: 20,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 14px",
        borderRadius: 10,
        border: light ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.12)",
        background: light ? "#ffffff" : "#1a1a1a",
        color: light ? "#111" : "#fff",
        fontSize: "0.78rem",
        fontWeight: 800,
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        transition: "all 0.2s",
      }}
    >
      {light ? (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          Modo oscuro
        </>
      ) : (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          Modo claro
        </>
      )}
    </button>
  );
}
