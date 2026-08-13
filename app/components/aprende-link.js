"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AprendeLink() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleOpen(e) {
    e.preventDefault();
    setPassword("");
    setError(false);
    setOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (password === "1234") {
      setOpen(false);
      router.push("/aprende");
    } else {
      setError(true);
    }
  }

  return (
    <>
      <a href="/aprende" onClick={handleOpen} style={{ cursor: "pointer" }}>
        Aprende
      </a>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "2rem 2.2rem",
              width: 320,
              boxShadow: "0 16px 48px rgba(0,0,0,0.22)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔒</div>
            <h3 style={{ margin: "0 0 0.4rem", fontSize: "1.1rem", color: "#111" }}>Área restringida</h3>
            <p style={{ margin: "0 0 1.2rem", fontSize: "0.88rem", color: "#666" }}>
              Ingresa el código de acceso para continuar.
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Código de acceso"
                autoFocus
                style={{
                  width: "100%",
                  padding: "0.7rem 1rem",
                  border: error ? "1.5px solid #e53e3e" : "1.5px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: "1rem",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: "0.3rem",
                  fontFamily: "inherit",
                  letterSpacing: "0.2em",
                }}
              />
              {error && (
                <p style={{ color: "#e53e3e", fontSize: "0.82rem", margin: "0.2rem 0 0.6rem" }}>
                  Código incorrecto. Inténtalo de nuevo.
                </p>
              )}
              <button
                type="submit"
                style={{
                  marginTop: "0.8rem",
                  width: "100%",
                  padding: "0.75rem",
                  background: "#7FE040",
                  color: "#111",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
