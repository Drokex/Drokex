"use client";

import { useEffect, useRef, useState } from "react";
import { useHeroEntrance } from "@/app/components/use-hero-entrance";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import ProductChat from "@/app/components/product-chat";
import styles from "./page.module.css";
import qfStyles from "@/app/components/quote-form.module.css";
import qdStyles from "./quotes-dashboard.module.css";
import providerStyles from "@/app/mi-cuenta/provider-shell.module.css";
import invStyles from "@/app/mi-cuenta/productos/inventario/inventory.module.css";

export default function MisChats() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConv, setActiveConv] = useState(null);
  const heroRef = useRef(null);
  useHeroEntrance(heroRef);

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
    <main className={providerStyles.providerDashboardPage}>
      <SiteHeader />
      <section className={`shell ${providerStyles.providerCleanShell} ${providerStyles.providerSubpageStack}`} ref={heroRef} data-hero-item>
        <Link href="/mi-cuenta" className={`${providerStyles.providerTextLink} ${providerStyles.providerSubpageBack}`}>
          Volver al dashboard
        </Link>

        <div className={`${providerStyles.providerSectionHeading} ${providerStyles.providerSectionHeadingStack}`}>
          <div>
            <p className={providerStyles.providerSectionKicker}>Mensajes</p>
            <h2>Mis chats con proveedores</h2>
          </div>
          <Link href="/categorias" className={invStyles.invCreateBtn}>Explorar productos</Link>
        </div>

        {loading ? (
          <p className={qdStyles.qdLoading}>Cargando chats...</p>
        ) : conversations.length === 0 ? (
          <div className={providerStyles.providerEmptyBlock}>
            <strong>Aún no tienes chats.</strong>
            <p>Entra a un producto y haz clic en "Cotizar producto" para chatear con el proveedor.</p>
            <Link href="/categorias" className={providerStyles.providerTextLink}>Ver catálogo</Link>
          </div>
        ) : (
          <div className={styles.mchList}>
            {conversations.map((conv) => {
              const last = lastMessage(conv);
              return (
                <button
                  key={conv.id}
                  className={styles.mchCard}
                  onClick={() => setActiveConv(conv)}
                >
                  <div className={styles.mchAvatar}>
                    {conv.product.supplier?.[0]?.toUpperCase() ?? "P"}
                  </div>
                  <div className={styles.mchInfo}>
                    <div className={styles.mchTop}>
                      <strong className={styles.mchSupplier}>{conv.product.supplier}</strong>
                      {last && <span className={styles.mchTime}>{formatDate(last.createdAt)}</span>}
                    </div>
                    <p className={styles.mchProduct}>{conv.product.name}</p>
                    {last && <p className={styles.mchPreview}>{last.content}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {activeConv && (
        <div className={qfStyles.qfOverlay} onClick={(e) => e.target === e.currentTarget && setActiveConv(null)}>
          <div className={qfStyles.qfModal}>
            <button className={qfStyles.qfClose} onClick={() => setActiveConv(null)} aria-label="Cerrar">×</button>
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
