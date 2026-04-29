import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";

export default async function StorePage() {
  const session = await getCurrentSession();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="commerce-page">
        <section className="shell account-shell">
          <div className="empty-state">
            <h1>No has iniciado sesión.</h1>
            <p>Entra con tu cuenta para configurar tu tienda.</p>
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

  const storeCards = [
    { label: "Negocio", value: user.company || "GlobalProveedor" },
    { label: "Responsable", value: user.fullName },
    { label: "Logo / banner", value: "Activos listos para actualizar" },
    { label: "Países donde vende", value: "Colombia, México, Chile" },
    { label: "Métodos de pago", value: "Transferencia, tarjeta, crédito comercial" },
    { label: "Configuración general", value: "Perfil verificado y activo" },
  ];

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
              <p className="provider-section-kicker">Mi tienda</p>
              <h2>Setup general y branding del proveedor</h2>
            </div>
            <Link href="/admin" className="provider-text-link">
              Ir al catálogo
            </Link>
          </div>

          <div className="provider-company-grid">
            {storeCards.map((item) => (
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
