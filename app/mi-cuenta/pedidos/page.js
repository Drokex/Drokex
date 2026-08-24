import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import DashboardEntrance from "@/app/components/dashboard-entrance";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";
import { getOrdersForProvider, getOrdersForUser } from "@/lib/orders";
import styles from "@/app/mi-cuenta/provider-shell.module.css";
import authStyles from "@/app/components/auth-account.module.css";

export default async function ProviderOrdersPage() {
  const session = await getCurrentSession();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="commerce-page">
        <section className={`shell ${authStyles.accountShell}`}>
          <div className="empty-state">
            <h1>No has iniciado sesión.</h1>
            <p>Entra con tu cuenta para revisar tus pedidos.</p>
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
    session?.audience === "cliente" ||
    user.email?.toLowerCase() === "cliente@drokex.com" ||
    user.company?.toLowerCase().includes("cliente");

  const orders = isCustomer
    ? await getOrdersForUser(user)
    : await getOrdersForProvider(user.id);

  return (
    <main className={isCustomer ? `${styles.providerDashboardPage} ${styles.isCustomer}` : styles.providerDashboardPage}>
      <SiteHeader />

      <DashboardEntrance as="section" className={`shell ${styles.providerCleanShell} ${styles.providerSubpageStack}`} data-hero-item>
        <Link href={isCustomer ? "/mi-cuenta?role=cliente" : "/mi-cuenta?role=proveedor"} className={`${styles.providerTextLink} ${styles.providerSubpageBack}`}>
          Volver al dashboard
        </Link>

        <section className={styles.providerContentCard}>
          <div className={styles.providerSectionHeading}>
            <div>
              <p className={styles.providerSectionKicker}>Pedidos</p>
              <h2>{isCustomer ? "Estado de solicitudes y pedidos" : "Estado de pedidos recientes"}</h2>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className={styles.providerEmptyBlock}>
              <strong>{isCustomer ? "No tienes pedidos aún." : "No tienes pedidos aún."}</strong>
              <p>{isCustomer ? "Cuando hagas una compra, aparecerá aquí." : "Cuando recibas un pedido de tus productos, aparecerá aquí."}</p>
            </div>
          ) : (
            <div className={styles.providerOrderList}>
              {orders.map((order) => (
                <article key={order.id} className={styles.providerOrderRow}>
                  <div>
                    <strong>{order.id}</strong>
                    <p>{isCustomer ? `${order.totalItems} productos · ${order.carrier || "Sin transportadora"}` : (order.company || order.customerName)}</p>
                  </div>
                  <span className={styles.providerOrderAmount}>{isCustomer ? order.subtotalLabel : order.providerSubtotalLabel}</span>
                  <span className={`${styles.providerBadge} ${styles.isBlue}`}>{order.statusLabel}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </DashboardEntrance>
    </main>
  );
}
