import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";

export default async function CompanyPage() {
  const session = await getCurrentSession();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="commerce-page">
        <section className="shell account-shell">
          <div className="empty-state">
            <h1>No has iniciado sesión.</h1>
            <p>Entra con tu cuenta para ver la información de tu empresa.</p>
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

  const companyCards = [
    { label: isCustomer ? "Empresa" : "Empresa", value: user.company || (isCustomer ? "Cliente Global" : "GlobalProveedor") },
    { label: isCustomer ? "Contacto principal" : "Responsable", value: user.fullName },
    { label: "Correo", value: user.email },
    { label: "Teléfono", value: user.phone || "Pendiente por completar" },
    {
      label: "Perfil",
      value: user.role === "ADMIN" ? "Administrador" : isCustomer ? "Cliente activo" : "Proveedor activo",
    },
    { label: "Estado", value: isCustomer ? "Cuenta comercial activa" : "Perfil verificado" },
  ];

  return (
    <main className={isCustomer ? "provider-dashboard-page is-customer" : "provider-dashboard-page"}>
      <SiteHeader />

      <section className="shell provider-clean-shell provider-subpage-stack">
        <Link href={isCustomer ? "/mi-cuenta?role=cliente" : "/mi-cuenta?role=proveedor"} className="provider-text-link provider-subpage-back">
          Volver al dashboard
        </Link>

        <section className="provider-content-card provider-content-card-split">
          <div className="provider-section-heading">
            <div>
              <p className="provider-section-kicker">{isCustomer ? "Mi cuenta" : "Mi empresa"}</p>
              <h2>{isCustomer ? "Información general del cliente" : "Información general del proveedor"}</h2>
            </div>
            <Link href={isCustomer ? "/categorias" : "/admin"} className="provider-text-link">
              {isCustomer ? "Ir al catálogo" : "Ir al catálogo"}
            </Link>
          </div>

          <div className="provider-company-grid">
            {companyCards.map((item) => (
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
