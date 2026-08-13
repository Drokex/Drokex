import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";
import styles from "@/app/mi-cuenta/provider-shell.module.css";
import authStyles from "@/app/components/auth-account.module.css";

export default async function CompanyPage() {
  const session = await getCurrentSession();
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="commerce-page">
        <section className={`shell ${authStyles.accountShell}`}>
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
    <main className={isCustomer ? `${styles.providerDashboardPage} ${styles.isCustomer}` : styles.providerDashboardPage}>
      <SiteHeader />

      <section className={`shell ${styles.providerCleanShell} ${styles.providerSubpageStack}`}>
        <Link href={isCustomer ? "/mi-cuenta?role=cliente" : "/mi-cuenta?role=proveedor"} className={`${styles.providerTextLink} ${styles.providerSubpageBack}`}>
          Volver al dashboard
        </Link>

        <section className={`${styles.providerContentCard} ${styles.providerContentCardSplit}`}>
          <div className={styles.providerSectionHeading}>
            <div>
              <p className={styles.providerSectionKicker}>{isCustomer ? "Mi cuenta" : "Mi empresa"}</p>
              <h2>{isCustomer ? "Información general del cliente" : "Información general del proveedor"}</h2>
            </div>
            <Link href={isCustomer ? "/categorias" : "/admin"} className={styles.providerTextLink}>
              {isCustomer ? "Ir al catálogo" : "Ir al catálogo"}
            </Link>
          </div>

          <div className={styles.providerCompanyGrid}>
            {companyCards.map((item) => (
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
