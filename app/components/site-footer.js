import Image from "next/image";
import Link from "next/link";
import AprendeLink from "@/app/components/aprende-link";

const exploreLinks = [
  { label: "Productos", href: "/productos" },
  { label: "Directorio", href: "/productos" },
  { label: "Registrate", href: "/registro" },
];

const companyLinks = [
  { label: "Registrar Empresa", href: "/registro" },
  { label: "Iniciar Sesion", href: "/login" },
  { label: "Publicar Productos", href: "/admin" },
];

const legalLinks = [
  { label: "Terminos", href: "/" },
  { label: "Privacidad", href: "/" },
  { label: "Soporte", href: "/#contacto" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-bar" />

      <div className="shell site-footer-shell">
        <div className="site-footer-grid">
          <div className="site-footer-brand">
            <Link href="/" className="site-footer-logo" aria-label="Drokex">
              <Image
                src="/logo.png"
                alt="Drokex"
                width={203}
                height={102}
                className="site-footer-logo-image"
                style={{ height: "auto" }}
              />
            </Link>
            <p>Conectando empresas de LATAM con compradores internacionales.</p>
            <Link href="/drokex-world" className="site-footer-cta" target="_blank" rel="noopener noreferrer">
              Comenzar
            </Link>
          </div>

          <div className="site-footer-column">
            <h3>Explora</h3>
            <nav aria-label="Explora">
              {exploreLinks.map((item) => (
                <Link key={item.label} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="site-footer-column">
            <h3>Para Empresas</h3>
            <nav aria-label="Para empresas">
              {companyLinks.map((item) => (
                <Link key={item.label} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="site-footer-column">
            <h3>Contacto</h3>
            <div className="site-footer-contact">
              <p>Email: soporte@drokex.com</p>
              <p>Region: 🌎 • Moneda:</p>
              <AprendeLink />
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p>© 2026 Drokex. Todos los derechos reservados.</p>
          <nav aria-label="Legal" className="site-footer-legal">
            {legalLinks.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
