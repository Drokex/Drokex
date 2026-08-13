import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/app/components/site-header";
import ProveedorProPage from "@/app/proveedor-pro/page";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export default async function StorePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="commerce-page">
        <SiteHeader />
        <section className="shell account-shell">
          <div className="empty-state">
            <h1>No has iniciado sesión.</h1>
            <p>Entra con tu cuenta para activar o editar tu tienda Proveedor Pro.</p>
            <Link href="/login?role=proveedor&next=/mi-cuenta/tienda" className="green-link">
              Ir a iniciar sesión
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const landing = await prisma.proveedorProLanding.findUnique({
    where: { userId: user.id },
  });

  const hasProveedorPro = Boolean(landing);

  if (!hasProveedorPro) {
    redirect("/mi-cuenta?upgrade=proveedor-pro");
  }

  const initialStore = landing?.store || {
    brand: user.company || user.fullName,
    country: "Colombia",
    logo: user.logoUrl || "",
    finalTitle: `Descubre la colección de ${user.company || user.fullName}`,
  };

  return (
    <ProveedorProPage
      accountMode
      initialIsPro
      initialSlug={landing?.slug || ""}
      initialStore={initialStore}
      initialProducts={Array.isArray(landing?.products) ? landing.products : null}
    />
  );
}
