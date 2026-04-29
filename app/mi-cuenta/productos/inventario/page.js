import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentUser } from "@/lib/current-user";
import { getAdminProducts } from "@/lib/products";
import InventoryActions from "@/app/components/inventory-actions";

export default async function InventarioPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="commerce-page">
        <section className="shell account-shell">
          <div className="empty-state">
            <h1>No has iniciado sesión.</h1>
            <a href="/login" className="green-link">Ir a iniciar sesión</a>
          </div>
        </section>
      </main>
    );
  }

  const products = await getAdminProducts();

  return (
    <main className="provider-dashboard-page">
      <SiteHeader />
      <section className="shell provider-clean-shell provider-subpage-stack">
        <Link href="/mi-cuenta/productos" className="provider-text-link provider-subpage-back">
          Volver a productos
        </Link>

        <div className="provider-section-heading provider-section-heading-stack">
          <div>
            <p className="provider-section-kicker">Inventario</p>
            <h2>Todos los productos</h2>
          </div>
          <Link href="/mi-cuenta/productos/crear" className="inv-create-btn">
            + Nuevo producto
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="provider-empty-block">
            <strong>No tienes productos aún.</strong>
            <p>Crea tu primer producto para que aparezca aquí.</p>
            <Link href="/mi-cuenta/productos/crear" className="provider-text-link">Crear producto</Link>
          </div>
        ) : (
          <div className="inv-table-wrap">
            <table className="inv-table">
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
                      <div className="inv-product-name">
                        {product.image && (
                          <img src={product.image} alt="" className="inv-product-thumb" />
                        )}
                        <div>
                          <strong>{product.name}</strong>
                          <small>{product.sku || "—"}</small>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      <span className={`inv-stock-badge inv-stock-${product.inventoryState}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>{product.price}</td>
                    <td>
                      <span className={product.active ? "provider-badge" : "provider-badge is-blue"}>
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
