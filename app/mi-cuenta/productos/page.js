import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import { getCurrentUser } from "@/lib/current-user";

export default async function ProductosPage() {
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
        <Link href="/mi-cuenta" className="provider-text-link provider-subpage-back">
          Volver al dashboard
        </Link>

        <div className="provider-section-heading provider-section-heading-stack">
          <div>
            <p className="provider-section-kicker">Mis productos</p>
            <h2>Gestión de catálogo</h2>
          </div>
        </div>

        <div className="prod-menu-grid">
          <Link href="/mi-cuenta/productos/inventario" className="prod-menu-card">
            <div className="prod-menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6M9 16h4" />
              </svg>
            </div>
            <div>
              <strong>Inventario</strong>
              <p>Ver, editar y eliminar tus productos existentes.</p>
            </div>
          </Link>

          <Link href="/mi-cuenta/productos/crear" className="prod-menu-card prod-menu-card-highlight">
            <div className="prod-menu-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </div>
            <div>
              <strong>Crear producto</strong>
              <p>Añade un nuevo producto con imágenes, precio y detalles.</p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
