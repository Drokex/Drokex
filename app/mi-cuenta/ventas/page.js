import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";
import { getAllOrders } from "@/lib/orders";

export default async function SalesPage() {
  const session = await getCurrentSession();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="commerce-page">
        <section className="shell account-shell">
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
    <main className={isCustomer ? "provider-dashboard-page is-customer" : "provider-dashboard-page"}>
      <SiteHeader />

      <section className="shell provider-clean-shell provider-subpage-stack">
        <Link href="/mi-cuenta?role=proveedor" className="provider-text-link provider-subpage-back">
          Volver al dashboard
        </Link>

        <section className="provider-content-card">
          <div className="provider-section-heading">
            <div>
              <p className="provider-section-kicker">Ventas</p>
              <h2>Pedidos recibidos y flujo comercial</h2>
            </div>
          </div>

          <div className="provider-order-list">
            {salesOrders.map((order) => (
              <article key={order.id} className="provider-order-row">
                <div>
                  <strong>{order.id}</strong>
                  <p>{order.company || order.customerName}</p>
                </div>
                <span className="provider-order-amount">{order.subtotalLabel}</span>
                <span className="provider-badge is-blue">{order.statusLabel}</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
