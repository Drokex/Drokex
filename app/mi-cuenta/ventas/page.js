import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";
import { getAllOrders } from "@/lib/orders";
import styles from "@/app/mi-cuenta/provider-shell.module.css";
import authStyles from "@/app/components/auth-account.module.css";

export default async function SalesPage() {
  const session = await getCurrentSession();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="commerce-page">
        <section className={`shell ${authStyles.accountShell}`}>
          <div className="empty-state">
            <h1>No has iniciado sesión.</h1>
            <p>Entra con tu cuenta para revisar tus ventas.</p>
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
  const salesOrders = await getAllOrders();

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
              <p className={styles.providerSectionKicker}>Ventas</p>
              <h2>Pedidos recibidos y flujo comercial</h2>
            </div>
          </div>

          <div className={styles.providerOrderList}>
            {salesOrders.map((order) => (
              <article key={order.id} className={styles.providerOrderRow}>
                <div>
                  <strong>{order.id}</strong>
                  <p>{order.company || order.customerName}</p>
                </div>
                <span className={styles.providerOrderAmount}>{order.subtotalLabel}</span>
                <span className={`${styles.providerBadge} ${styles.isBlue}`}>{order.statusLabel}</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
