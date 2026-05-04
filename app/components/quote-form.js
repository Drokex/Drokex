"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const COUNTRIES = [
  "Nicaragua", "Honduras", "Guatemala", "El Salvador",
  "República Dominicana", "Colombia", "Perú", "México", "Otro",
];

function CountrySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          border: open ? "1.5px solid #9be02f" : "1.5px solid #e5e7eb",
          borderRadius: 10,
          fontSize: "0.97rem",
          fontFamily: "inherit",
          color: value ? "#1a1a1a" : "#9ca3af",
          background: open ? "#fff" : "#fafafa",
          cursor: "pointer",
          outline: "none",
          transition: "border-color 0.15s",
          textAlign: "left",
        }}
      >
        <span>{value || "Selecciona un país"}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          right: 0,
          zIndex: 50,
          background: "#fff",
          border: "1.5px solid #e5e7eb",
          borderRadius: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          maxHeight: 220,
          overflowY: "auto",
          margin: 0,
          padding: "6px 0",
          listStyle: "none",
        }}>
          {COUNTRIES.map((c) => (
            <li
              key={c}
              onMouseDown={() => { onChange(c); setOpen(false); }}
              style={{
                padding: "10px 16px",
                fontSize: "0.95rem",
                cursor: "pointer",
                color: c === value ? "#5aab00" : "#1a1a1a",
                fontWeight: c === value ? 700 : 400,
                background: c === value ? "#f4ffe8" : "transparent",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => { if (c !== value) e.currentTarget.style.background = "#f9fafb"; }}
              onMouseLeave={e => { if (c !== value) e.currentTarget.style.background = "transparent"; }}
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function QuoteForm({ productId, productName, onClose }) {
  const router = useRouter();
  const [form, setForm] = useState({ quantity: "", destinationCountry: "", message: "" });
  const [status, setStatus] = useState(null);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, ...form }),
    });

    if (res.ok) {
      setStatus("sent");
      setTimeout(() => {
        onClose?.();
        router.push("/mi-cuenta/cotizaciones");
      }, 1800);
    } else {
      const data = await res.json();
      setStatus(data.error || "error");
    }
  }

  if (status === "sent") {
    return (
      <div className="qf-success">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="40" height="40">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12l3 3 5-5" />
        </svg>
        <p>¡Cotización enviada! Recibirás una respuesta pronto.</p>
      </div>
    );
  }

  return (
    <form className="qf-form" onSubmit={handleSubmit}>
      <div className="qf-header">
        <h3>Solicitar cotización</h3>
        <p className="qf-product-name">{productName}</p>
      </div>

      <div className="qf-field">
        <label>Cantidad</label>
        <input
          type="number"
          min="1"
          placeholder="Ej. 500 unidades"
          value={form.quantity}
          onChange={(e) => set("quantity", e.target.value)}
          required
        />
      </div>

      <div className="qf-field">
        <label>País de destino</label>
        <CountrySelect
          value={form.destinationCountry}
          onChange={(v) => set("destinationCountry", v)}
        />
      </div>

      <div className="qf-field">
        <label>Mensaje adicional (opcional)</label>
        <textarea
          rows={3}
          placeholder="Especificaciones, condiciones de pago, plazos de entrega..."
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>

      {typeof status === "string" && status !== "sending" && status !== "sent" && (
        <p className="qf-error">{status}</p>
      )}

      <div className="qf-footer">
        {onClose && (
          <button type="button" className="qf-cancel" onClick={onClose}>Cancelar</button>
        )}
        <button type="submit" className="qf-submit" disabled={status === "sending"}>
          {status === "sending" ? "Enviando..." : "Enviar cotización"}
        </button>
      </div>
    </form>
  );
}
