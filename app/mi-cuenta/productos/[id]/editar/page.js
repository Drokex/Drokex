import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import ProductForm from "@/app/components/product-form";
import { getCurrentUser } from "@/lib/current-user";
import { getAdminProducts } from "@/lib/products";
import { notFound } from "next/navigation";

export default async function EditarProductoPage({ params }) {
  const { id } = await params;
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
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <main className="provider-dashboard-page">
      <SiteHeader />
      <section className="shell provider-clean-shell provider-subpage-stack">
        <Link href="/mi-cuenta/productos/inventario" className="provider-text-link provider-subpage-back">
          Volver al inventario
        </Link>

        <div className="provider-section-heading">
          <div>
            <p className="provider-section-kicker">Editar producto</p>
            <h2>{product.name}</h2>
          </div>
        </div>

        <div className="provider-content-card">
          <ProductForm initial={product} productId={id} />
        </div>
      </section>
    </main>
  );
}
