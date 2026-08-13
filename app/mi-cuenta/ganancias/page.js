import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";

const earningsCards = [
  { label: "Total vendido", value: "US$ 14.820" },
  { label: "Comisión Drokex", value: "US$ 1.334" },
  { label: "Ganancia neta", value: "US$ 13.486" },
  { label: "Historial de pagos", value: "4 pagos liquidados este mes" },
];

export default async function EarningsPage() {
  const session = await getCurrentSession();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="commerce-page">
        <section className="shell account-shell">
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

  return (
    <main className={isCustomer ? "provider-dashboard-page is-customer" : "provider-dashboard-page"}>
      <SiteHeader />

      <section className="shell provider-clean-shell provider-subpage-stack">
        <Link href="/mi-cuenta?role=proveedor" className="provider-text-link provider-subpage-back">
          Volver al dashboard
        </Link>

        <section className="provider-content-card provider-content-card-split">
          <div className="provider-section-heading">
            <div>
              <p className="provider-section-kicker">Ganancias / comisiones</p>
              <h2>Resumen financiero del proveedor</h2>
            </div>
          </div>

          <div className="provider-company-grid">
            {earningsCards.map((item) => (
              <article key={item.label} className="provider-info-block">
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
