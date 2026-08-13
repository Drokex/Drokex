import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import ProductForm from "@/app/components/product-form";
import { getCurrentUser } from "@/lib/current-user";
import styles from "@/app/mi-cuenta/provider-shell.module.css";
import authStyles from "@/app/components/auth-account.module.css";

export default async function CrearProductoPage() {
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

  return (
    <main className={styles.providerDashboardPage}>
      <SiteHeader />
      <section className={`shell ${styles.providerCleanShell} ${styles.providerSubpageStack}`}>
        <Link href="/mi-cuenta/productos" className={`${styles.providerTextLink} ${styles.providerSubpageBack}`}>
          Volver a productos
        </Link>

        <div className={styles.providerSectionHeading}>
          <div>
            <p className={styles.providerSectionKicker}>Nuevo producto</p>
            <h2>Crear producto</h2>
          </div>
        </div>

        <div className={styles.providerContentCard}>
          <ProductForm />
        </div>
      </section>
    </main>
  );
}
