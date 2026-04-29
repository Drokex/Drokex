"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { useQuoteStream } from "@/app/components/use-quote-stream";

const STATUS_LABEL = {
  PENDING: "Esperando respuesta",
  QUOTED: "Cotización recibida",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
};

const STATUS_TONE = {
  PENDING: "tone-pending",
  QUOTED: "tone-quoted",
  ACCEPTED: "tone-accepted",
  REJECTED: "tone-rejected",
};

export default function ClientQuotesDashboard() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);

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
      return [data, ...prev];
    });
  }, []);

  useQuoteStream(handleStream);

  async function handleAction(id, status) {
    setResponding(id);
    await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "status", status }),
    });
    await load();
    setResponding(null);
  }

  return (
    <main className="provider-dashboard-page">
      <SiteHeader />
      <section className="shell provider-clean-shell provider-subpage-stack">
        <Link href="/mi-cuenta" className="provider-text-link provider-subpage-back">
          Volver al dashboard
        </Link>

        <div className="provider-section-heading provider-section-heading-stack">
          <div>
            <p className="provider-section-kicker">Mis cotizaciones</p>
            <h2>Estado de mis solicitudes</h2>
          </div>
          <Link href="/categorias" className="inv-create-btn">Explorar productos</Link>
        </div>

        {loading ? (
          <p className="qd-loading">Cargando cotizaciones...</p>
        ) : quotes.length === 0 ? (
          <div className="provider-empty-block">
            <strong>Aún no has solicitado cotizaciones.</strong>
            <p>Busca un producto y haz clic en "Cotizar producto" para empezar.</p>
            <Link href="/categorias" className="provider-text-link">Ver catálogo</Link>
          </div>
        ) : (
          <div className="qd-list">
            {quotes.map((q) => (
              <article key={q.id} className="qd-card">
                <div className="qd-card-top">
                  <div className="qd-product-info">
                    <strong>{q.productName}</strong>
                    <span>{q.quantity} unidades · {q.destinationCountry}</span>
                  </div>
                  <span className={`qd-status ${STATUS_TONE[q.status]}`}>
                    {STATUS_LABEL[q.status]}
                  </span>
                </div>

                {q.message && <p className="qd-message">"{q.message}"</p>}

                {q.status === "QUOTED" && (
                  <div className="qd-response">
                    <div className="qd-response-price">
                      <span>Precio cotizado</span>
                      <strong>${(q.providerPrice / 100).toFixed(2)} USD</strong>
                    </div>
                    {q.providerNote && <p className="qd-response-note">{q.providerNote}</p>}
                    <div className="qd-response-actions">
                      <button
                        className="qd-btn qd-btn-accept"
                        disabled={responding === q.id}
                        onClick={() => handleAction(q.id, "ACCEPTED")}
                      >
                        Aceptar cotización
                      </button>
                      <button
                        className="qd-btn qd-btn-reject"
                        disabled={responding === q.id}
                        onClick={() => handleAction(q.id, "REJECTED")}
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                )}

                <small className="qd-date">
                  {new Date(q.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                </small>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
