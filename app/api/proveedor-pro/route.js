import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/current-user";
import { setSessionCookie } from "@/lib/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const mine = searchParams.get("mine") === "1";

  if (mine) {
    const session = await getCurrentSession();
    if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

    const landing = await prisma.proveedorProLanding.findUnique({
      where: { userId: session.userId },
    });

    if (!landing) return Response.json({ landing: null });
    return Response.json({
      landing: {
        slug: landing.slug,
        store: landing.store,
        products: landing.products,
        updatedAt: landing.updatedAt,
      },
    });
  }

  if (!slug) {
    const landings = await prisma.proveedorProLanding.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        slug: true,
        store: true,
        products: true,
        updatedAt: true,
      },
    });

    return Response.json({ landings });
  }

  const landing = await prisma.proveedorProLanding.findUnique({ where: { slug } });
  if (!landing) return Response.json({ error: "no encontrado" }, { status: 404 });

  return Response.json({ store: landing.store, products: landing.products });
}

export async function POST(request) {
  const session = await getCurrentSession();
  if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { slug, store, products } = await request.json();
  if (!slug) return Response.json({ error: "slug requerido" }, { status: 400 });

  const [landingWithSlug, landingForUser] = await Promise.all([
    prisma.proveedorProLanding.findUnique({ where: { slug } }),
    prisma.proveedorProLanding.findUnique({ where: { userId: session.userId } }),
  ]);

  if (landingWithSlug?.userId && landingWithSlug.userId !== session.userId) {
    return Response.json({ error: "Ese nombre de página ya está en uso." }, { status: 409 });
  }

  if (landingWithSlug && landingForUser && landingWithSlug.id !== landingForUser.id) {
    return Response.json({ error: "Ese nombre de página ya está en uso." }, { status: 409 });
  }

  const landing = landingForUser
    ? await prisma.proveedorProLanding.update({
        where: { id: landingForUser.id },
        data: { slug, store, products },
      })
    : landingWithSlug
      ? await prisma.proveedorProLanding.update({
          where: { id: landingWithSlug.id },
          data: { userId: session.userId, store, products },
        })
      : await prisma.proveedorProLanding.create({
          data: { slug, userId: session.userId, store, products },
        });

  const updatedUser = await prisma.user.update({
    where: { id: session.userId },
    data: { role: session.role === "ADMIN" ? "ADMIN" : "PROVIDER" },
  });

  await setSessionCookie({
    userId: updatedUser.id,
    email: updatedUser.email,
    role: updatedUser.role,
    audience: "proveedor",
  });

  return Response.json({ ok: true, slug: landing.slug });
}
