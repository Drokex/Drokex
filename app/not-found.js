import Link from "next/link";
import Image from "next/image";
import { Compass } from "lucide-react";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";

export const metadata = {
  title: "Página no encontrada — Drokex",
};

export default function NotFound() {
  return (
    <main className="drokex-404">
      <SiteHeader />

      <section className="shell drokex-404-shell">
        <div className="drokex-404-copy">
          <span className="section-tag">
            <Compass size={14} aria-hidden="true" /> Te perdiste en la ruta
          </span>
          <h1>404</h1>
          <h2>Esta página no existe en el mapa.</h2>
          <p>
            El enlace que seguiste puede estar roto, movido o nunca existió. Volvamos a
            terreno conocido.
          </p>
          <div className="drokex-404-actions">
            <Link href="/" className="primary-button">
              Ir al inicio
            </Link>
            <Link href="/productos" className="secondary-button">
              Ver catálogo
            </Link>
          </div>
        </div>

        <div className="drokex-404-visual" aria-hidden="true">
          <Image
            src="/robot-contact.png"
            alt=""
            width={1344}
            height={1771}
            sizes="(max-width: 900px) 60vw, 360px"
            className="drokex-404-robot"
            priority={false}
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
