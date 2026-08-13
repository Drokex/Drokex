// Inyecta una landing nueva en el cache del directorio SIN tocar la BD.
// Llamado inmediatamente después de publicar (flujo optimista) para que
// el directorio la muestre sin esperar el sync con Supabase.
export async function POST(request) {
  try {
    const { slug, store } = await request.json();
    if (!slug || !store) return Response.json({ ok: false });

    const entry = {
      slug,
      landing: {
        store: {
          brand: store.brand || null,
          country: store.countries?.[0] || null,
          countries: Array.isArray(store.countries) ? store.countries : [],
          primaryColor: store.primaryColor || null,
          logo: store.logo || null,
          heroImage: store.heroImage || null,
        },
        products: [],
      },
    };

    const cache = globalThis.__drokexDirCache5;
    if (cache?.proLandings) {
      const idx = cache.proLandings.findIndex(l => l.slug === slug);
      if (idx >= 0) {
        cache.proLandings[idx] = entry;
      } else {
        cache.proLandings.unshift(entry);
      }
      cache.ts = Date.now();
    } else if (cache) {
      cache.ts = 0;
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false });
  }
}
