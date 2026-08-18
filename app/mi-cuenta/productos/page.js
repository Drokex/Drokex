import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentUser } from "@/lib/current-user";
import { getProductsByProvider } from "@/lib/products";
import styles from "@/app/mi-cuenta/provider-shell.module.css";
import authStyles from "@/app/components/auth-account.module.css";

export default async function ProductosPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="commerce-page">
        <section className={`shell ${authStyles.accountShell}`}>
          <div className="empty-state">
            <h1>No has iniciado sesión.</h1>
            <a href="/login" className="green-link">Ir a iniciar sesión</a>
          </div>
        </section>
      </main>
    );
  }

  const products = await getProductsByProvider(user.id);

  return (
    <main className={styles.providerDashboardPage}>
      <SiteHeader />
      <section className={`shell ${styles.providerCleanShell} ${styles.providerSubpageStack}`}>
        <Link href="/mi-cuenta" className={`${styles.providerTextLink} ${styles.providerSubpageBack}`}>
          Volver al dashboard
        </Link>

        <div className={`${styles.providerSectionHeading} ${styles.providerSectionHeadingStack}`}>
          <div>
            <p className={styles.providerSectionKicker}>Mis productos</p>
            <h2>Gestión de catálogo</h2>
          </div>
        </div>

        <div className="prod-menu-list">
          <Link href="/mi-cuenta/productos/inventario" className="prod-menu-row">
            <div className="prod-menu-row-inner">
              <div className="prod-menu-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                  <path d="M9 12h6M9 16h4" />
                </svg>
              </div>
              <div className="prod-menu-row-body">
                <strong>Inventario</strong>
                <p>Ver, editar y eliminar tus productos existentes.</p>
              </div>
              <span className="prod-menu-count">
                {products.length} producto{products.length === 1 ? "" : "s"}
              </span>
              <svg className="prod-menu-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>

          <div className="prod-menu-divider" />

          <Link href="/mi-cuenta/productos/crear" className="prod-menu-row prod-menu-row-highlight">
            <div className="prod-menu-row-inner">
              <div className="prod-menu-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <div className="prod-menu-row-body">
                <strong>Crear producto</strong>
                <p>Añade un nuevo producto con imágenes, precio y detalles.</p>
              </div>
              <svg className="prod-menu-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
