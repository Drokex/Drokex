import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";

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
        <section className="shell account-shell">
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
    <main className={isCustomer ? "provider-dashboard-page is-customer" : "provider-dashboard-page"}>
      <SiteHeader />

      <section className="shell provider-clean-shell provider-subpage-stack">
        <Link href="/mi-cuenta?role=proveedor" className="provider-text-link provider-subpage-back">
          Volver al dashboard
        </Link>

        <section className="provider-content-card">
          <div className="provider-section-heading">
            <div>
              <p className="provider-section-kicker">Envíos / logística</p>
              <h2>Operación logística del proveedor</h2>
            </div>
          </div>

          <div className="provider-order-list">
            {logisticsRows.map((item) => (
              <article key={item.title} className="provider-order-row">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
                <span className="provider-order-amount">Activo</span>
                <span className="provider-badge">OK</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
