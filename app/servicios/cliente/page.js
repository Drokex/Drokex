"use client";

import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";

export default function ClientePage() {
  return (
    <div className="sp-page">
      <SiteHeader />
      <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 20px" }}>
        <div>
          <p style={{ color: "#7FE040", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Próximamente</p>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, marginBottom: 20 }}>Servicios para Clientes</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 480, margin: "0 auto 32px" }}>
            Estamos preparando esta sección. Mientras tanto puedes explorar nuestro catálogo.
          </p>
          <Link href="/productos" style={{ display: "inline-block", padding: "14px 32px", background: "#7FE040", color: "#000", fontWeight: 700, borderRadius: 8 }}>
            Ver productos
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
