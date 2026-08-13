"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import ProductChat from "@/app/components/product-chat";

export default function MisChats() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConv, setActiveConv] = useState(null);

  async function load() {
    const res = await fetch("/api/conversations");
    if (res.ok) {
      const data = await res.json();
      setConversations(data.conversations);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function lastMessage(conv) {
    return conv.messages?.[0];
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "Ahora";
    if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
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
            <p className="provider-section-kicker">Mensajes</p>
            <h2>Mis chats con proveedores</h2>
          </div>
          <Link href="/categorias" className="inv-create-btn">Explorar productos</Link>
        </div>

        {loading ? (
          <p className="qd-loading">Cargando chats...</p>
        ) : conversations.length === 0 ? (
          <div className="provider-empty-block">
            <strong>Aún no tienes chats.</strong>
            <p>Entra a un producto y haz clic en "Cotizar producto" para chatear con el proveedor.</p>
            <Link href="/categorias" className="provider-text-link">Ver catálogo</Link>
          </div>
        ) : (
          <div className="mch-list">
            {conversations.map((conv) => {
              const last = lastMessage(conv);
              return (
                <button
                  key={conv.id}
                  className="mch-card"
                  onClick={() => setActiveConv(conv)}
                >
                  <div className="mch-avatar">
                    {conv.product.supplier?.[0]?.toUpperCase() ?? "P"}
                  </div>
                  <div className="mch-info">
                    <div className="mch-top">
                      <strong className="mch-supplier">{conv.product.supplier}</strong>
                      {last && <span className="mch-time">{formatDate(last.createdAt)}</span>}
                    </div>
                    <p className="mch-product">{conv.product.name}</p>
                    {last && <p className="mch-preview">{last.content}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {activeConv && (
        <div className="qf-overlay" onClick={(e) => e.target === e.currentTarget && setActiveConv(null)}>
          <div className="qf-modal qf-modal-chat">
            <button className="qf-close" onClick={() => setActiveConv(null)} aria-label="Cerrar">×</button>
            <ProductChat
              productId={activeConv.productId}
              productName={activeConv.product.name}
              onClose={() => { setActiveConv(null); load(); }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
