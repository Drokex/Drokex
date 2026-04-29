"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const COUNTRIES = [
  "Colombia", "México", "Guatemala", "Honduras", "El Salvador",
  "Costa Rica", "Panamá", "Ecuador", "Perú", "Chile", "Argentina",
  "Brasil", "Venezuela", "Cuba", "República Dominicana", "Otro",
];

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
        <select
          value={form.destinationCountry}
          onChange={(e) => set("destinationCountry", e.target.value)}
          required
        >
          <option value="" disabled>Selecciona un país</option>
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
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
