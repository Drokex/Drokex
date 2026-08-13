import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";
import { getOrdersForUser } from "@/lib/orders";

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
        <section className="shell account-shell">
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
    <main className={isCustomer ? "provider-dashboard-page is-customer" : "provider-dashboard-page"}>
      <SiteHeader />

      <section className="shell provider-clean-shell provider-subpage-stack">
        <Link href={isCustomer ? "/mi-cuenta?role=cliente" : "/mi-cuenta?role=proveedor"} className="provider-text-link provider-subpage-back">
          Volver al dashboard
        </Link>

        <section className="provider-content-card">
          <div className="provider-section-heading">
            <div>
              <p className="provider-section-kicker">Pedidos</p>
              <h2>{isCustomer ? "Estado de solicitudes y pedidos" : "Estado de pedidos recientes"}</h2>
            </div>
          </div>

          <div className="provider-order-list">
            {orders.map((order) => (
              <article key={order.id} className="provider-order-row">
                <div>
                  <strong>{order.id}</strong>
                  <p>{isCustomer ? `${order.totalItems} productos · ${order.carrier || "Sin transportadora"}` : order.customer}</p>
                </div>
                <span className="provider-order-amount">{isCustomer ? order.subtotalLabel : order.amount}</span>
                <span className="provider-badge is-blue">{isCustomer ? order.statusLabel : order.status}</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
