import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import PortalPixelCursor from "@/app/components/portal-pixel-cursor";

const signalItems = [
  "Latam trade gateway",
  "Marketplace intelligence",
  "Supplier network online",
];

export default function PortalPage() {
  return (
    <main className="portal-page">
      <SiteHeader />

      <section className="portal-stage" aria-label="Portal Drokex">
        <img
          src="/portal-gateway.gif"
          alt="Portal futurista Drokex con robot y energía verde"
          className="portal-gif"
        />
        <div className="portal-vignette" />
        <div className="portal-scanlines" />
        <div className="portal-grid" />
        <PortalPixelCursor />

        <div className="portal-shell">
          <div className="portal-kicker">
            <span />
            Portal Drokex
          </div>

          <div className="portal-copy">
            <p className="portal-status">Gateway activo / 24.04.2026</p>
            <h1>
              Cruza al comercio <span>sin fronteras.</span>
            </h1>
            <p>
              Un acceso visual para conectar proveedores, compradores y rutas comerciales en una
              sola experiencia.
            </p>
          </div>

          <div className="portal-actions" aria-label="Acciones del portal">
            <Link href="/registro" className="portal-action portal-action-primary">
              Entrar como proveedor
            </Link>
            <Link href="/productos" className="portal-action">
              Explorar productos
            </Link>
          </div>
        </div>

        <aside className="portal-hud portal-hud-left" aria-label="Señales del sistema">
          {signalItems.map((item, index) => (
            <div key={item} className="portal-signal">
              <span>0{index + 1}</span>
              {item}
            </div>
          ))}
        </aside>

        <aside className="portal-hud portal-hud-right" aria-label="Estado operativo">
          <div>
            <span>Origen</span>
            <strong>Colombia</strong>
          </div>
          <div>
            <span>Destino</span>
            <strong>Centroamérica</strong>
          </div>
          <div>
            <span>Estado</span>
            <strong>Sincronizado</strong>
          </div>
        </aside>

        <div className="portal-bottom-bar">
          <span>DROKEX NETWORK</span>
          <span>SUPPLIERS 1.000+</span>
          <span>COUNTRIES 24+</span>
          <span>TRACE MODE LIVE</span>
        </div>
      </section>
    </main>
  );
}
