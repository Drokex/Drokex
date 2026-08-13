"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { useQuoteStream } from "@/app/components/use-quote-stream";

const STATUS_LABEL = { PENDING: "Pendiente", QUOTED: "Respondida", ACCEPTED: "Aceptada", REJECTED: "Rechazada" };
const STATUS_TONE = { PENDING: "tone-pending", QUOTED: "tone-quoted", ACCEPTED: "tone-accepted", REJECTED: "tone-rejected" };

function RespondForm({ quote, onDone }) {
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/quotes/${quote.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "respond", providerPrice: Math.round(Number(price) * 100), providerNote: note }),
    });
    setSaving(false);
    onDone();
  }

  return (
    <form className="qd-respond-form" onSubmit={handleSubmit}>
      <div className="qd-respond-row">
        <div className="qf-field">
          <label>Precio en USD</label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Ej. 150.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="qf-field" style={{ flex: 2 }}>
          <label>Nota para el cliente (opcional)</label>
          <input
            type="text"
            placeholder="Incluye condiciones, tiempo de entrega, etc."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
      <div className="qf-footer">
        <button type="button" className="qf-cancel" onClick={onDone}>Cancelar</button>
        <button type="submit" className="qf-submit" disabled={saving}>
          {saving ? "Enviando..." : "Enviar cotización"}
        </button>
      </div>
    </form>
  );
}

export default function ProviderQuotesDashboard() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReply, setActiveReply] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [newCount, setNewCount] = useState(0);

  async function load() {
    const res = await fetch("/api/quotes");
    if (res.ok) {
      const data = await res.json();
      setQuotes(data.quotes);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const handleStream = useCallback((data) => {
    setQuotes((prev) => {
      const idx = prev.findIndex((q) => q.id === data.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = data;
        return next;
      }
      setNewCount((n) => n + 1);
      return [data, ...prev];
    });
  }, []);

  useQuoteStream(handleStream);

  const filtered = filter === "ALL" ? quotes : quotes.filter((q) => q.status === filter);

  return (
    <main className="provider-dashboard-page">
      <SiteHeader />
      <section className="shell provider-clean-shell provider-subpage-stack">
        <Link href="/mi-cuenta" className="provider-text-link provider-subpage-back">
          Volver al dashboard
        </Link>

        <div className="provider-section-heading provider-section-heading-stack">
          <div>
            <p className="provider-section-kicker">Panel proveedor</p>
            <h2>
              Cotizaciones
              {newCount > 0 && (
                <span className="qd-new-badge" onClick={() => setNewCount(0)}>{newCount} nueva{newCount > 1 ? "s" : ""}</span>
              )}
            </h2>
          </div>
          <div className="qd-filters">
            {["ALL", "PENDING", "QUOTED", "ACCEPTED", "REJECTED"].map((f) => (
              <button
                key={f}
                className={`qd-filter-btn ${filter === f ? "is-active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "ALL" ? "Todas" : STATUS_LABEL[f]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="qd-loading">Cargando...</p>
        ) : filtered.length === 0 ? (
          <div className="provider-empty-block">
            <strong>No hay cotizaciones {filter !== "ALL" ? STATUS_LABEL[filter].toLowerCase() + "s" : "aún"}.</strong>
          </div>
        ) : (
          <div className="qd-list">
            {filtered.map((q) => (
              <article key={q.id} className="qd-card">
                <div className="qd-card-top">
                  <div className="qd-product-info">
                    <strong>{q.productName}</strong>
                    <span>
                      {q.clientName}{q.clientCompany ? ` · ${q.clientCompany}` : ""} ·{" "}
                      {q.quantity} uds · {q.destinationCountry}
                    </span>
                  </div>
                  <span className={`qd-status ${STATUS_TONE[q.status]}`}>{STATUS_LABEL[q.status]}</span>
                </div>

                {q.message && <p className="qd-message">"{q.message}"</p>}

                {q.status === "QUOTED" && q.providerPrice && (
                  <p className="qd-response-note">
                    Respondiste con <strong>${(q.providerPrice / 100).toFixed(2)} USD</strong>
                    {q.providerNote ? ` — "${q.providerNote}"` : ""}
                  </p>
                )}

                <div className="qd-card-footer">
                  <small className="qd-date">
                    {new Date(q.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </small>
                  {q.status === "PENDING" && (
                    <button
                      className="qd-btn qd-btn-reply"
                      onClick={() => setActiveReply(activeReply === q.id ? null : q.id)}
                    >
                      {activeReply === q.id ? "Cancelar" : "Responder"}
                    </button>
                  )}
                </div>

                {activeReply === q.id && (
                  <RespondForm
                    quote={q}
                    onDone={() => { setActiveReply(null); load(); }}
                  />
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
