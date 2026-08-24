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
        published: landing.published,
        updatedAt: landing.updatedAt,
      },
    });
  }

  const userId = searchParams.get("userId");
  if (userId) {
    const session = await getCurrentSession();
    if (session?.role !== "ADMIN") return Response.json({ error: "No autorizado." }, { status: 401 });

    const landing = await prisma.proveedorProLanding.findUnique({ where: { userId } });
    if (!landing) return Response.json({ landing: null });
    return Response.json({ landing });
  }

  const all = searchParams.get("all") === "1";
  if (all) {
    const session = await getCurrentSession();
    if (session?.role !== "ADMIN") return Response.json({ error: "No autorizado." }, { status: 401 });

    const landings = await prisma.proveedorProLanding.findMany({
      orderBy: { updatedAt: "desc" },
      include: { user: { select: { fullName: true, email: true } } },
    });
    return Response.json({ landings });
  }

  if (!slug) {
    const landings = await prisma.proveedorProLanding.findMany({
      where: { published: true },
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
  if (!landing || !landing.published) return Response.json({ error: "no encontrado" }, { status: 404 });

  return Response.json({ store: landing.store, products: landing.products });
}

export async function POST(request) {
  const session = await getCurrentSession();
  if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { slug, store, products, publish, unpublish, targetUserId } = await request.json();
  if (!slug) return Response.json({ error: "slug requerido" }, { status: 400 });

  if (targetUserId && targetUserId !== session.userId && session.role !== "ADMIN") {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  const ownerId = targetUserId && session.role === "ADMIN" ? targetUserId : session.userId;
  // unpublish solo lo puede forzar un ADMIN moderando una tienda ajena — un autoguardado normal nunca lo pide.
  const forceUnpublish = unpublish && session.role === "ADMIN";

  if (publish) {
    if (!store?.countries?.length) {
      return Response.json({ error: "Selecciona al menos un país antes de publicar." }, { status: 400 });
    }
    if (!Array.isArray(products) || products.length === 0) {
      return Response.json({ error: "Agrega al menos un producto antes de publicar." }, { status: 400 });
    }
    if (!store?.contactLink) {
      return Response.json({ error: "Agrega un contacto antes de publicar." }, { status: 400 });
    }
  }

  const [landingWithSlug, landingForUser] = await Promise.all([
    prisma.proveedorProLanding.findUnique({ where: { slug } }),
    prisma.proveedorProLanding.findUnique({ where: { userId: ownerId } }),
  ]);

  if (landingWithSlug?.userId && landingWithSlug.userId !== ownerId) {
    return Response.json({ error: "Ese nombre de página ya está en uso." }, { status: 409 });
  }

  if (landingWithSlug && landingForUser && landingWithSlug.id !== landingForUser.id) {
    return Response.json({ error: "Ese nombre de página ya está en uso." }, { status: 409 });
  }

  // published nunca se revierte a false por un autoguardado — solo "publish: true" lo activa
  // (o "unpublish: true" desde un ADMIN moderando).
  const publishedPatch = forceUnpublish ? { published: false } : publish ? { published: true } : {};
  const landing = landingForUser
    ? await prisma.proveedorProLanding.update({
        where: { id: landingForUser.id },
        data: { slug, store, products, ...publishedPatch },
      })
    : landingWithSlug
      ? await prisma.proveedorProLanding.update({
          where: { id: landingWithSlug.id },
          data: { userId: ownerId, store, products, ...publishedPatch },
        })
      : await prisma.proveedorProLanding.create({
          data: { slug, userId: ownerId, store, products, published: Boolean(publish) },
        });

  // Invalidar caché del directorio para que aparezca de inmediato
  if (globalThis.__drokexDirCache5) globalThis.__drokexDirCache5.ts = 0;

  if (ownerId === session.userId) {
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
  }

  return Response.json({ ok: true, slug: landing.slug, published: landing.published });
}

export async function DELETE(request) {
  const session = await getCurrentSession();
  if (!session?.userId) return Response.json({ error: "No autorizado." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const targetUserId = searchParams.get("targetUserId");
  if (targetUserId && targetUserId !== session.userId && session.role !== "ADMIN") {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }
  const ownerId = targetUserId && session.role === "ADMIN" ? targetUserId : session.userId;

  const landing = await prisma.proveedorProLanding.findUnique({ where: { userId: ownerId } });
  if (!landing) return Response.json({ error: "No encontrado." }, { status: 404 });

  await prisma.proveedorProLanding.delete({ where: { id: landing.id } });

  if (globalThis.__drokexDirCache5) {
    if (globalThis.__drokexDirCache5.proLandings) {
      globalThis.__drokexDirCache5.proLandings = globalThis.__drokexDirCache5.proLandings.filter(l => l.slug !== landing.slug);
    }
    globalThis.__drokexDirCache5.ts = 0;
  }

  return Response.json({ ok: true, slug: landing.slug });
}
