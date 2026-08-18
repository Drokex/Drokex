import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentUser } from "@/lib/current-user";
import { getProductsByProvider } from "@/lib/products";
import InventoryActions from "@/app/components/inventory-actions";
import styles from "@/app/mi-cuenta/provider-shell.module.css";
import authStyles from "@/app/components/auth-account.module.css";
import invStyles from "./inventory.module.css";

export default async function InventarioPage() {
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
        <Link href="/mi-cuenta/productos" className={`${styles.providerTextLink} ${styles.providerSubpageBack}`}>
          Volver a productos
        </Link>

        <div className={`${styles.providerSectionHeading} ${styles.providerSectionHeadingStack}`}>
          <div>
            <p className={styles.providerSectionKicker}>Inventario</p>
            <h2>Todos los productos</h2>
          </div>
          {products.length > 0 && (
            <Link href="/mi-cuenta/productos/crear" className={invStyles.invCreateBtn}>
              + Nuevo producto
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          <div className={invStyles.invEmpty}>
            <div className={invStyles.invEmptyIcon}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" />
              </svg>
            </div>
            <strong>No tienes productos aún</strong>
            <p>Crea tu primer producto para que aparezca en tu inventario y en el catálogo público.</p>
            <Link href="/mi-cuenta/productos/crear" className={invStyles.invEmptyBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Crear producto
            </Link>
          </div>
        ) : (
          <div className={invStyles.invTableWrap}>
            <table className={invStyles.invTable}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className={invStyles.invProductName}>
                        {product.image && (
                          <img src={product.image} alt="" className={invStyles.invProductThumb} />
                        )}
                        <div>
                          <strong>{product.name}</strong>
                          <small>{product.sku || "—"}</small>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      <span className={`${invStyles.invStockBadge} ${invStyles["invStock" + product.inventoryState.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("")]}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>{product.price}</td>
                    <td>
                      <span className={product.active ? styles.providerBadge : `${styles.providerBadge} ${styles.isBlue}`}>
                        {product.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <InventoryActions productId={product.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
