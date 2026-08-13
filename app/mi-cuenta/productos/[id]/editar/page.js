import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import ProductForm from "@/app/components/product-form";
import { getCurrentUser } from "@/lib/current-user";
import { getAdminProducts } from "@/lib/products";
import { notFound } from "next/navigation";
import styles from "@/app/mi-cuenta/provider-shell.module.css";
import authStyles from "@/app/components/auth-account.module.css";

export default async function EditarProductoPage({ params }) {
  const { id } = await params;
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

  const products = await getAdminProducts();
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <main className={styles.providerDashboardPage}>
      <SiteHeader />
      <section className={`shell ${styles.providerCleanShell} ${styles.providerSubpageStack}`}>
        <Link href="/mi-cuenta/productos/inventario" className={`${styles.providerTextLink} ${styles.providerSubpageBack}`}>
          Volver al inventario
        </Link>

        <div className={styles.providerSectionHeading}>
          <div>
            <p className={styles.providerSectionKicker}>Editar producto</p>
            <h2>{product.name}</h2>
          </div>
        </div>

        <div className={styles.providerContentCard}>
          <ProductForm initial={product} productId={id} />
        </div>
      </section>
    </main>
  );
}
