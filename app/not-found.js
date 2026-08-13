import Link from "next/link";
import Image from "next/image";
import { Compass } from "lucide-react";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import styles from "./not-found.module.css";

export const metadata = {
  title: "Página no encontrada — Drokex",
};

export default function NotFound() {
  return (
    <main className={styles.drokex404}>
      <SiteHeader />

      <section className={`shell ${styles.drokex404Shell}`}>
        <div className={styles.drokex404Copy}>
          <span className="section-tag">
            <Compass size={14} aria-hidden="true" /> Te perdiste en la ruta
          </span>
          <h1>404</h1>
          <h2>Esta página no existe en el mapa.</h2>
          <p>
            El enlace que seguiste puede estar roto, movido o nunca existió. Volvamos a
            terreno conocido.
          </p>
          <div className={styles.drokex404Actions}>
            <Link href="/" className="primary-button">
              Ir al inicio
            </Link>
            <Link href="/productos" className="secondary-button">
              Ver catálogo
            </Link>
          </div>
        </div>

        <div className={styles.drokex404Visual} aria-hidden="true">
          <Image
            src="/robot-contact.png"
            alt=""
            width={1344}
            height={1771}
            sizes="(max-width: 900px) 60vw, 360px"
            className={styles.drokex404Robot}
            priority={false}
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
