import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";
import { getOrdersForUser } from "@/lib/orders";
import styles from "@/app/mi-cuenta/provider-shell.module.css";
import authStyles from "@/app/components/auth-account.module.css";

const providerOrders = [
  {
    id: "DX-2401",
    customer: "European Traders",
    status: "Pendiente",
    amount: "US$ 1.240",
  },
  {
    id: "DX-2402",
    customer: "BioNordic Foods",
    status: "En preparación",
    amount: "US$ 860",
  },
  {
    id: "DX-2403",
    customer: "Atlas Components",
    status: "Despachado",
    amount: "US$ 2.110",
  },
];

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
    : providerOrders;

  return (
    <main className={isCustomer ? `${styles.providerDashboardPage} ${styles.isCustomer}` : styles.providerDashboardPage}>
      <SiteHeader />

      <section className={`shell ${styles.providerCleanShell} ${styles.providerSubpageStack}`}>
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

          <div className={styles.providerOrderList}>
            {orders.map((order) => (
              <article key={order.id} className={styles.providerOrderRow}>
                <div>
                  <strong>{order.id}</strong>
                  <p>{isCustomer ? `${order.totalItems} productos · ${order.carrier || "Sin transportadora"}` : order.customer}</p>
                </div>
                <span className={styles.providerOrderAmount}>{isCustomer ? order.subtotalLabel : order.amount}</span>
                <span className={`${styles.providerBadge} ${styles.isBlue}`}>{isCustomer ? order.statusLabel : order.status}</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
