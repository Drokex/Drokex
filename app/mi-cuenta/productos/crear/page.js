import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import ProductForm from "@/app/components/product-form";
import { getCurrentUser } from "@/lib/current-user";

export default async function CrearProductoPage() {
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

  return (
    <main className="provider-dashboard-page">
      <SiteHeader />
      <section className="shell provider-clean-shell provider-subpage-stack">
        <Link href="/mi-cuenta/productos" className="provider-text-link provider-subpage-back">
          Volver a productos
        </Link>

        <div className="provider-section-heading">
          <div>
            <p className="provider-section-kicker">Nuevo producto</p>
            <h2>Crear producto</h2>
          </div>
        </div>

        <div className="provider-content-card">
          <ProductForm />
        </div>
      </section>
    </main>
  );
}
