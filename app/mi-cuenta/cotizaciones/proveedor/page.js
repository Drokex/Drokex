"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { useQuoteStream } from "@/app/components/use-quote-stream";
import qfStyles from "@/app/components/quote-form.module.css";
import qdStyles from "../quotes-dashboard.module.css";
import styles from "@/app/mi-cuenta/provider-shell.module.css";

const STATUS_LABEL = { PENDING: "Pendiente", QUOTED: "Respondida", ACCEPTED: "Aceptada", REJECTED: "Rechazada" };
const STATUS_TONE = { PENDING: "tonePending", QUOTED: "toneQuoted", ACCEPTED: "toneAccepted", REJECTED: "toneRejected" };

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
    <form className={qdStyles.qdRespondForm} onSubmit={handleSubmit}>
      <div className={qdStyles.qdRespondRow}>
        <div className={qfStyles.qfField}>
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
        <div className={qfStyles.qfField} style={{ flex: 2 }}>
          <label>Nota para el cliente (opcional)</label>
          <input
            type="text"
            placeholder="Incluye condiciones, tiempo de entrega, etc."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
      <div className={qfStyles.qfFooter}>
        <button type="button" className={qfStyles.qfCancel} onClick={onDone}>Cancelar</button>
        <button type="submit" className={qfStyles.qfSubmit} disabled={saving}>
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
    <main className={styles.providerDashboardPage}>
      <SiteHeader />
      <section className={`shell ${styles.providerCleanShell} ${styles.providerSubpageStack}`}>
        <Link href="/mi-cuenta" className={`${styles.providerTextLink} ${styles.providerSubpageBack}`}>
          Volver al dashboard
        </Link>

        <div className={`${styles.providerSectionHeading} ${styles.providerSectionHeadingStack}`}>
          <div>
            <p className={styles.providerSectionKicker}>Panel proveedor</p>
            <h2>
              Cotizaciones
              {newCount > 0 && (
                <span className={qdStyles.qdNewBadge} onClick={() => setNewCount(0)}>{newCount} nueva{newCount > 1 ? "s" : ""}</span>
              )}
            </h2>
          </div>
          <div className={qdStyles.qdFilters}>
            {["ALL", "PENDING", "QUOTED", "ACCEPTED", "REJECTED"].map((f) => (
              <button
                key={f}
                className={`${qdStyles.qdFilterBtn} ${filter === f ? qdStyles.isActive : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "ALL" ? "Todas" : STATUS_LABEL[f]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className={qdStyles.qdLoading}>Cargando...</p>
        ) : filtered.length === 0 ? (
          <div className={styles.providerEmptyBlock}>
            <strong>No hay cotizaciones {filter !== "ALL" ? STATUS_LABEL[filter].toLowerCase() + "s" : "aún"}.</strong>
          </div>
        ) : (
          <div className={qdStyles.qdList}>
            {filtered.map((q) => (
              <article key={q.id} className={qdStyles.qdCard}>
                <div className={qdStyles.qdCardTop}>
                  <div className={qdStyles.qdProductInfo}>
                    <strong>{q.productName}</strong>
                    <span>
                      {q.clientName}{q.clientCompany ? ` · ${q.clientCompany}` : ""} ·{" "}
                      {q.quantity} uds · {q.destinationCountry}
                    </span>
                  </div>
                  <span className={`${qdStyles.qdStatus} ${qdStyles[STATUS_TONE[q.status]]}`}>{STATUS_LABEL[q.status]}</span>
                </div>

                {q.message && <p className={qdStyles.qdMessage}>"{q.message}"</p>}

                {q.status === "QUOTED" && q.providerPrice && (
                  <p className={qdStyles.qdResponseNote}>
                    Respondiste con <strong>${(q.providerPrice / 100).toFixed(2)} USD</strong>
                    {q.providerNote ? ` — "${q.providerNote}"` : ""}
                  </p>
                )}

                <div className={qdStyles.qdCardFooter}>
                  <small className={qdStyles.qdDate}>
                    {new Date(q.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </small>
                  {q.status === "PENDING" && (
                    <button
                      className={`${qdStyles.qdBtn} ${qdStyles.qdBtnReply}`}
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
