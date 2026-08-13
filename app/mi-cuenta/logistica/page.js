import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";
import styles from "@/app/mi-cuenta/provider-shell.module.css";
import authStyles from "@/app/components/auth-account.module.css";

const logisticsRows = [
  {
    title: "Guías activas",
    detail: "4 despachos con guía lista para impresión y seguimiento.",
  },
  {
    title: "Transportadoras",
    detail: "DHL, Coordinadora y FedEx activas para tu operación.",
  },
  {
    title: "Tracking",
    detail: "3 envíos en movimiento y 1 con entrega hoy.",
  },
  {
    title: "Costos de envío",
    detail: "Promedio actual de despacho: US$ 28 por orden.",
  },
];

export default async function LogisticsPage() {
  const session = await getCurrentSession();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="commerce-page">
        <section className={`shell ${authStyles.accountShell}`}>
          <div className="empty-state">
            <h1>No has iniciado sesión.</h1>
            <p>Entra con tu cuenta para revisar tu logística.</p>
            <a href="/login" className="green-link">
              Ir a iniciar sesión
            </a>
          </div>
        </section>
      </main>
    );
  }

  const isCustomer =
    user.role === "CUSTOMER" ||
    session?.role === "CUSTOMER" ||
    session?.audience === "cliente";

  return (
    <main className={isCustomer ? `${styles.providerDashboardPage} ${styles.isCustomer}` : styles.providerDashboardPage}>
      <SiteHeader />

      <section className={`shell ${styles.providerCleanShell} ${styles.providerSubpageStack}`}>
        <Link href="/mi-cuenta?role=proveedor" className={`${styles.providerTextLink} ${styles.providerSubpageBack}`}>
          Volver al dashboard
        </Link>

        <section className={styles.providerContentCard}>
          <div className={styles.providerSectionHeading}>
            <div>
              <p className={styles.providerSectionKicker}>Envíos / logística</p>
              <h2>Operación logística del proveedor</h2>
            </div>
          </div>

          <div className={styles.providerOrderList}>
            {logisticsRows.map((item) => (
              <article key={item.title} className={styles.providerOrderRow}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
                <span className={styles.providerOrderAmount}>Activo</span>
                <span className={styles.providerBadge}>OK</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
