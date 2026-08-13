"use client";

import { useState } from "react";
import ProductChat from "@/app/components/product-chat";
import awStyles from "@/app/components/auth-wall.module.css";
import qfStyles from "@/app/components/quote-form.module.css";

export default function QuoteButton({ productId, productName }) {
  const [state, setState] = useState("idle"); // idle | auth-wall | chat

  async function handleClick() {
    const res = await fetch("/api/account");
    setState(res.ok ? "chat" : "auth-wall");
  }

  function close() { setState("idle"); }

  return (
    <>
      <button className="quote-cta-btn" onClick={handleClick}>
        Cotizar producto
      </button>

      {state === "auth-wall" && (
        <div className={qfStyles.qfOverlay} onClick={(e) => e.target === e.currentTarget && close()}>
          <div className={awStyles.awModal}>
            <button className={qfStyles.qfClose} onClick={close} aria-label="Cerrar">×</button>

            <div className={awStyles.awIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            <h3 className={awStyles.awTitle}>Inicia el chat con el proveedor</h3>
            <p className={awStyles.awSubtitle}>
              Para contactar directamente con el proveedor necesitas una cuenta en Drokex. Es gratis y toma menos de un minuto.
            </p>

            <div className={awStyles.awActions}>
              <a href="/registro" className={awStyles.awBtnPrimary}>Crear cuenta gratis</a>
              <a href="/login" className={awStyles.awBtnSecondary}>Ya tengo cuenta</a>
            </div>

            <p className={awStyles.awFooter}>Proveedores verificados · Negociación segura · LATAM</p>
          </div>
        </div>
      )}

      {state === "chat" && (
        <div className={qfStyles.qfOverlay} onClick={(e) => e.target === e.currentTarget && close()}>
          <div className={qfStyles.qfModal}>
            <button className={qfStyles.qfClose} onClick={close} aria-label="Cerrar">×</button>
            <ProductChat productId={productId} productName={productName} onClose={close} />
          </div>
        </div>
      )}
    </>
  );
}
