import Link from "next/link";
import { redirect } from "next/navigation";
import ProveedorProPage from "@/app/proveedor-pro/page";
import { requireAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminStoreEditorPage({ params }) {
  const { slug } = await params;

  try {
    await requireAdminUser();
  } catch {
    redirect("/login");
  }

  const landing = await prisma.proveedorProLanding.findUnique({ where: { slug } });

  if (!landing) {
    return (
      <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
        <p>No se encontró la tienda "{slug}".</p>
        <Link href="/admin/tiendas">← Volver a tiendas</Link>
      </div>
    );
  }

  return (
    <ProveedorProPage
      accountMode
      initialIsPro
      initialSlug={landing.slug}
      initialStore={landing.store}
      initialProducts={Array.isArray(landing.products) ? landing.products : null}
      initialPublished={Boolean(landing.published)}
      targetUserId={landing.userId}
    />
  );
}
