import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import DashboardEntrance from "@/app/components/dashboard-entrance";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";
import { getOrdersForProvider, getAllOrders } from "@/lib/orders";
import styles from "@/app/mi-cuenta/provider-shell.module.css";
import authStyles from "@/app/components/auth-account.module.css";

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

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

  const orders = isCustomer ? [] : user.role === "ADMIN" ? await getAllOrders() : await getOrdersForProvider(user.id);
  const activeGuides = orders.filter((order) => order.trackingNumber && order.status !== "DELIVERED" && order.status !== "CANCELLED");
  const carriers = Array.from(new Set(orders.map((order) => order.carrier).filter(Boolean)));
  const inTransit = orders.filter((order) => order.status === "SHIPPED");
  const today = new Date();
  const deliveredToday = orders.filter((order) => order.status === "DELIVERED" && isSameDay(new Date(order.updatedAt), today));
  const delivered = orders.filter((order) => order.status === "DELIVERED");

  const logisticsRows = [
    {
      title: "Guías activas",
      detail: activeGuides.length
        ? `${activeGuides.length} despacho${activeGuides.length === 1 ? "" : "s"} con guía lista para seguimiento.`
        : "No tienes despachos con guía activa.",
      status: activeGuides.length ? "Activo" : "Sin datos",
    },
    {
      title: "Transportadoras",
      detail: carriers.length ? `${carriers.join(", ")} usadas en tu operación.` : "Aún no has despachado con ninguna transportadora.",
      status: carriers.length ? "Activo" : "Sin datos",
    },
    {
      title: "Tracking",
      detail: inTransit.length || deliveredToday.length
        ? `${inTransit.length} envío${inTransit.length === 1 ? "" : "s"} en movimiento y ${deliveredToday.length} con entrega hoy.`
        : "No hay envíos en movimiento.",
      status: inTransit.length || deliveredToday.length ? "Activo" : "Sin datos",
    },
    {
      title: "Entregas completadas",
      detail: delivered.length ? `${delivered.length} pedido${delivered.length === 1 ? "" : "s"} entregado${delivered.length === 1 ? "" : "s"} en total.` : "Aún no tienes entregas completadas.",
      status: delivered.length ? "Activo" : "Sin datos",
    },
  ];

  return (
    <main className={isCustomer ? `${styles.providerDashboardPage} ${styles.isCustomer}` : styles.providerDashboardPage}>
      <SiteHeader />

      <DashboardEntrance as="section" className={`shell ${styles.providerCleanShell} ${styles.providerSubpageStack}`} data-hero-item>
        <Link
          href={user.role === "ADMIN" ? "/admin" : "/mi-cuenta?role=proveedor"}
          className={`${styles.providerTextLink} ${styles.providerSubpageBack}`}
        >
          Volver al dashboard
        </Link>

        <section className={styles.providerContentCard}>
          <div className={styles.providerSectionHeading}>
            <div>
              <p className={styles.providerSectionKicker}>Envíos / logística</p>
              <h2>{user.role === "ADMIN" ? "Operación logística — todos los proveedores" : "Operación logística del proveedor"}</h2>
            </div>
          </div>

          <div className={styles.providerOrderList}>
            {logisticsRows.map((item) => (
              <article key={item.title} className={styles.providerOrderRow}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
                <span className={styles.providerOrderAmount}>{item.status}</span>
                <span className={item.status === "Activo" ? styles.providerBadge : `${styles.providerBadge} ${styles.isMuted}`}>
                  {item.status === "Activo" ? "OK" : "—"}
                </span>
              </article>
            ))}
          </div>
        </section>
      </DashboardEntrance>
    </main>
  );
}
