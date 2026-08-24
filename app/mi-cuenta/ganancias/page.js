import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";
import { getOrdersForProvider, getOrdersForAdmin } from "@/lib/orders";
import styles from "@/app/mi-cuenta/provider-shell.module.css";
import authStyles from "@/app/components/auth-account.module.css";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default async function EarningsPage() {
  const session = await getCurrentSession();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="commerce-page">
        <section className={`shell ${authStyles.accountShell}`}>
          <div className="empty-state">
            <h1>No has iniciado sesión.</h1>
            <p>Entra con tu cuenta para revisar tus ganancias.</p>
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

  const orders = isCustomer ? [] : user.role === "ADMIN" ? await getOrdersForAdmin() : await getOrdersForProvider(user.id);
  const paidOrders = orders.filter((order) => order.paymentStatus === "PAID");
  const totalVendido = paidOrders.reduce((sum, order) => sum + order.providerSubtotal, 0);
  const lastPaidOrder = paidOrders[0];

  const earningsCards = [
    { label: "Total vendido", value: currencyFormatter.format(totalVendido) },
    { label: "Pedidos pagados", value: String(paidOrders.length) },
    {
      label: "Ticket promedio",
      value: paidOrders.length ? currencyFormatter.format(totalVendido / paidOrders.length) : "Sin datos",
    },
    {
      label: "Último pago",
      value: lastPaidOrder
        ? new Date(lastPaidOrder.updatedAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
        : "Sin datos",
    },
  ];

  return (
    <main className={isCustomer ? `${styles.providerDashboardPage} ${styles.isCustomer}` : styles.providerDashboardPage}>
      <SiteHeader />

      <section className={`shell ${styles.providerCleanShell} ${styles.providerSubpageStack}`}>
        <Link href="/mi-cuenta?role=proveedor" className={`${styles.providerTextLink} ${styles.providerSubpageBack}`}>
          Volver al dashboard
        </Link>

        <section className={`${styles.providerContentCard} ${styles.providerContentCardSplit}`}>
          <div className={styles.providerSectionHeading}>
            <div>
              <p className={styles.providerSectionKicker}>Ganancias / comisiones</p>
              <h2>{user.role === "ADMIN" ? "Resumen financiero — todos los proveedores" : "Resumen financiero del proveedor"}</h2>
            </div>
          </div>

          <div className={styles.providerCompanyGrid}>
            {earningsCards.map((item) => (
              <article key={item.label} className={styles.providerInfoBlock}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
