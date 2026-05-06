import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import LogoutButton from "@/app/components/logout-button";
import AvatarUpload from "@/app/components/avatar-upload";
import { getCurrentSession, getCurrentUser } from "@/lib/current-user";
import { getProducts } from "@/lib/products";

const providerQuickActions = [
  { title: "Mi tienda", href: "/mi-cuenta/tienda", icon: "building" },
  { title: "Mis productos", href: "/mi-cuenta/productos", icon: "box" },
  { title: "Cotizaciones", href: "/mi-cuenta/cotizaciones/proveedor", icon: "chart" },
  { title: "Ventas", href: "/mi-cuenta/ventas", icon: "grid" },
  { title: "Envíos / logística", href: "/mi-cuenta/logistica", icon: "truck" },
];

const customerQuickActions = [
  { title: "Mi tienda", href: "/mi-cuenta/tienda", icon: "building" },
  { title: "Explorar productos", href: "/categorias", icon: "box" },
  { title: "Mis cotizaciones", href: "/mi-cuenta/cotizaciones", icon: "chart" },
  { title: "Mis pedidos", href: "/mi-cuenta/pedidos", icon: "grid" },
];

function formatDateLabel(index) {
  const day = 27 - index;
  return `${day} oct`;
}

function DashboardIcon({ name }) {
  if (name === "plus") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-icon">
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  if (name === "building") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-icon">
        <path d="M5 20V6l7-2v16" />
        <path d="M12 8h7v12h-7" />
        <path d="M8 9h1M8 12h1M8 15h1M15 11h1M15 14h1" />
      </svg>
    );
  }

  if (name === "page") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-icon">
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h4" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    );
  }

  if (name === "box") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-icon">
        <path d="M5 7.5 12 4l7 3.5v9L12 20l-7-3.5z" />
        <path d="M5 7.5 12 11l7-3.5" />
        <path d="M12 11v9" />
      </svg>
    );
  }

  if (name === "truck") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-icon">
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h3l3 3v3h-6z" />
        <path d="M7 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM17 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
      </svg>
    );
  }

  if (name === "chart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-icon">
        <path d="M4 19h16" />
        <path d="M7 16V9" />
        <path d="M12 16V5" />
        <path d="M17 16v-7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dashboard-icon">
      <path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z" />
    </svg>
  );
}

export default async function AccountPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const session = await getCurrentSession();
  const user = await getCurrentUser();
  const products = await getProducts();

  if (!user) {
    return (
      <main className="commerce-page">
        <section className="shell account-shell">
          <div className="empty-state">
            <h1>No has iniciado sesión.</h1>
            <p>Entra con tu cuenta para ver tu panel y seguir con la experiencia de Drokex.</p>
            <a href="/login" className="green-link">
              Ir a iniciar sesión
            </a>
          </div>
        </section>
      </main>
    );
  }

  const initials = user.fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  const requestedRole = resolvedSearchParams?.role;
  const showProveedorProUpgrade = resolvedSearchParams?.upgrade === "proveedor-pro";
  const isProviderAccount = user.role === "PROVIDER" || user.role === "ADMIN";
  const customerSignals = [
    !isProviderAccount && user.role === "CUSTOMER",
    !isProviderAccount && session?.role === "CUSTOMER",
    !isProviderAccount && session?.audience === "cliente",
    !isProviderAccount && requestedRole === "cliente",
    !isProviderAccount && user.email?.toLowerCase() === "cliente@drokex.com",
    !isProviderAccount && user.company?.toLowerCase().includes("cliente"),
  ];
  const isCustomer = customerSignals.some(Boolean);

  const featuredProducts = products.slice(0, 3);
  const recentActivity = isCustomer
    ? [
        {
          type: "Pedido reciente",
          detail: "Tu último pedido sigue en proceso y ya tiene actualización de estado.",
          date: formatDateLabel(0),
          badge: "En proceso",
          avatar: "P",
          badgeTone: "green",
        },
        {
          type: "Estado de envío",
          detail: "Un envío activo ya se encuentra en tránsito con tracking disponible.",
          date: formatDateLabel(1),
          badge: "Tracking",
          avatar: "E",
          badgeTone: "green",
        },
        {
          type: "Recomendación",
          detail: `${featuredProducts[0]?.name || "Un producto destacado"} coincide con tus intereses recientes.`,
          date: formatDateLabel(2),
          badge: "Top",
          avatar: "R",
          badgeTone: "green",
        },
        {
          type: "Oferta destacada",
          detail: `${featuredProducts[1]?.name || "Una oferta activa"} tiene condiciones especiales por tiempo limitado.`,
          date: formatDateLabel(3),
          badge: "Oferta",
          avatar: "O",
          badgeTone: "blue",
        },
        {
          type: "Favorito guardado",
          detail: `${featuredProducts[2]?.name || "Un proveedor recomendado"} quedó listo para volver más tarde.`,
          date: formatDateLabel(4),
          badge: "Guardado",
          avatar: "S",
          badgeTone: "blue",
        },
      ]
    : [
        {
          type: "Nuevo lead interesado",
          detail: "European Traders está interesado en Café Arábica Premium",
          date: formatDateLabel(0),
          badge: "New",
          avatar: "L",
          badgeTone: "green",
        },
        {
          type: "Nuevo lead interesado",
          detail: "BioNordic Foods solicitó una reunión comercial",
          date: formatDateLabel(1),
          badge: "New",
          avatar: "L",
          badgeTone: "green",
        },
        {
          type: "Nuevo lead interesado",
          detail: "Atlas Components pidió ficha técnica ampliada",
          date: formatDateLabel(2),
          badge: "New",
          avatar: "L",
          badgeTone: "green",
        },
        {
          type: "Producto más visto",
          detail: `${featuredProducts[0]?.name || "Tu producto principal"} recibió nuevas visitas hoy`,
          date: formatDateLabel(3),
          badge: "Completed",
          avatar: "P",
          badgeTone: "blue",
        },
        {
          type: "Producto más visto",
          detail: `${featuredProducts[1]?.name || "Tu catálogo"} generó interés desde nuevos mercados`,
          date: formatDateLabel(4),
          badge: "Completed",
          avatar: "P",
          badgeTone: "blue",
        },
      ];

  return (
    <main className={isCustomer ? "provider-dashboard-page is-customer" : "provider-dashboard-page"}>
      <SiteHeader />

      <section className="shell provider-clean-shell">
        <div className="provider-clean-hero">
          <AvatarUpload initials={initials} logoUrl={user.logoUrl} />

          <div className="provider-clean-copy">
            <p className="provider-kicker">
              {isCustomer ? "Dashboard del Cliente" : "Dashboard del Proveedor"}
            </p>
            <h1>{user.company || user.fullName}</h1>
            <p>
              {isCustomer
                ? "Bienvenido a tu panel de control. Aquí puedes explorar productos, revisar actividad y gestionar tu experiencia comercial."
                : "Bienvenido a tu panel de control. Aquí puedes gestionar tus productos y revisar el rendimiento de tu empresa."}
            </p>
            <div className="provider-inline-meta">
              <span>{user.fullName}</span>
              <span>
                {user.role === "ADMIN"
                  ? "Acceso administrador"
                  : isCustomer
                    ? "Cliente activo"
                    : "Proveedor activo"}
              </span>
            </div>
          </div>

          <div className="provider-clean-tools">
            <div className="provider-clean-pill" aria-hidden="true" />
            <LogoutButton />
          </div>
        </div>

        <nav
          className="provider-clean-menu"
          aria-label={isCustomer ? "Accesos del cliente" : "Accesos del proveedor"}
        >
          {(isCustomer ? customerQuickActions : providerQuickActions).map((action) => (
            <Link
              key={`${isCustomer ? "customer" : "provider"}-${action.title}`}
              href={action.href}
              className="provider-clean-menu-item"
            >
              <span className="provider-clean-menu-icon">
                <DashboardIcon name={action.icon} />
              </span>
              <span>{action.title}</span>
            </Link>
          ))}
        </nav>

        <section className="provider-activity-card provider-activity-card-clean">
          <div className="provider-section-heading provider-section-heading-stack">
            <div>
              <p className="provider-section-kicker">Seguimiento</p>
              <h2>Actividad Reciente</h2>
            </div>
            <Link href={isCustomer ? "/categorias" : "/admin"} className="provider-text-link">
              {isCustomer ? "Ver catálogo" : "Ver panel completo"}
            </Link>
          </div>

          <div className="provider-activity-list">
            {recentActivity.map((item, index) => (
              <article key={`${item.type}-${index}`} className="provider-activity-item">
                <div className={`provider-activity-avatar ${item.badgeTone === "blue" ? "is-lime" : ""}`}>
                  {item.avatar}
                </div>
                <div className="provider-activity-copy">
                  <strong>{item.type}</strong>
                  <p>{item.detail}</p>
                  <small>{item.date}</small>
                </div>
                <span className={item.badgeTone === "blue" ? "provider-badge is-blue" : "provider-badge"}>
                  {item.badge}
                </span>
              </article>
            ))}
          </div>
        </section>
      </section>

      {showProveedorProUpgrade ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="proveedor-pro-upgrade-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120,
            display: "grid",
            placeItems: "center",
            padding: 20,
            background: "rgba(5,5,5,0.28)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            style={{
              width: "min(440px, 100%)",
              overflow: "hidden",
              border: "1px solid rgba(17,17,17,0.12)",
              borderRadius: 22,
              background: "#fff",
              color: "#111",
              boxShadow: "0 28px 90px rgba(0,0,0,0.34)",
            }}
          >
            <div
              style={{
                minHeight: 150,
                backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.64)), url('/hero-banner-dark.gif')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 15, padding: "24px 26px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <span
                  style={{
                    border: "1px solid rgba(46,166,0,0.25)",
                    borderRadius: 8,
                    background: "rgba(46,166,0,0.08)",
                    color: "#2ea600",
                    fontSize: "0.68rem",
                    fontWeight: 900,
                    letterSpacing: "0.14em",
                    padding: "6px 10px",
                    textTransform: "uppercase",
                  }}
                >
                  Mi tienda
                </span>
                <Link href={isCustomer ? "/mi-cuenta?role=cliente" : "/mi-cuenta?role=proveedor"} style={{ color: "#777", fontSize: "1.25rem", fontWeight: 900, lineHeight: 1 }}>
                  ×
                </Link>
              </div>

              <div>
                <h2
                  id="proveedor-pro-upgrade-title"
                  style={{
                    margin: 0,
                    color: "#111",
                    fontSize: "2.15rem",
                    fontWeight: 950,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  Pásate a <span style={{ color: "#22a600" }}>Proveedor Pro</span>
                </h2>
                <p style={{ margin: "12px 0 0", color: "#555", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Tu cuenta todavía no tiene una tienda Pro activa. Activa el plan para crear tu
                  landing, subir banners, cambiar imágenes y publicar tus productos.
                </p>
              </div>

              <div
                style={{
                  border: "1px solid rgba(46,166,0,0.22)",
                  borderRadius: 18,
                  background: "rgba(46,166,0,0.06)",
                  padding: 17,
                }}
              >
                <p style={{ margin: 0, color: "#777", fontSize: "0.8rem" }}>Plan demo</p>
                <strong style={{ display: "block", marginTop: 5, color: "#21a600", fontSize: "1.95rem", fontWeight: 950, lineHeight: 1 }}>
                  $99.000 COP
                </strong>
                <p style={{ margin: "8px 0 0", color: "#777", fontSize: "0.8rem" }}>
                  Crea y edita tu tienda premium dentro de Drokex.
                </p>
              </div>

              <Link
                href="/proveedor-pro"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 15,
                  background: "#22b400",
                  boxShadow: "0 14px 30px rgba(34,180,0,0.26)",
                  color: "#fff",
                  fontWeight: 950,
                  padding: "14px 20px",
                  textDecoration: "none",
                }}
              >
                Suscribirse a Proveedor Pro
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
