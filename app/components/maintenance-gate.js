"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "drokex-maint-v1";
const PASSWORD = "15472007";

export default function MaintenanceGate({ children }) {
  const [authed, setAuthed] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setAuthed(localStorage.getItem(STORAGE_KEY) === "ok");
  }, []);

  // Loading — avoid flash
  if (authed === null) return null;
  if (authed) return <>{children}</>;

  function tryPassword(e) {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "ok");
      setAuthed(true);
    } else {
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, overflow: "hidden" }}>
      <img
        src="/banner-mantenimiento.png"
        alt="Sitio en mantenimiento"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      {/* Invisible trigger — bottom-right corner */}
      <button
        onClick={() => setShowPrompt(true)}
        aria-label="Acceso"
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 44,
          height: 44,
          background: "transparent",
          border: "none",
          cursor: "default",
          opacity: 0,
        }}
      />

      {showPrompt && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPrompt(false); }}
        >
          <form
            onSubmit={tryPassword}
            style={{
              background: "#0d1117",
              borderRadius: 18,
              padding: "36px 40px",
              display: "flex",
              flexDirection: "column",
              gap: 18,
              border: "1px solid rgba(255,255,255,0.12)",
              minWidth: 300,
              animation: shake ? "shake 0.5s" : "none",
            }}
          >
            <p style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", margin: 0, textAlign: "center", letterSpacing: "0.04em" }}>
              Acceso restringido
            </p>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Contraseña"
              autoFocus
              style={{
                background: "rgba(255,255,255,0.07)",
                border: shake ? "1px solid #ff4444" : "1px solid rgba(255,255,255,0.18)",
                borderRadius: 10,
                padding: "13px 15px",
                color: "#fff",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
            />
            {shake && (
              <p style={{ color: "#ff4444", margin: "-8px 0 0", fontSize: "0.82rem", textAlign: "center" }}>
                Contraseña incorrecta
              </p>
            )}
            <button
              type="submit"
              style={{
                background: "#ff8500",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "13px",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              Entrar
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-10px); }
          40%       { transform: translateX(10px); }
          60%       { transform: translateX(-8px); }
          80%       { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
