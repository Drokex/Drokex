"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import ScrollReveal from "@/app/components/scroll-reveal";
import { useHeroEntrance } from "@/app/components/use-hero-entrance";
import Select from "@/app/components/select";
import styles from "./page.module.css";
import spStyles from "@/app/servicios/servicios-proveedor.module.css";

const CATEGORIES = [
  {
    icon: "📦",
    label: "Proveedores",
    topics: [
      {
        label: "Cómo publicar mi catálogo",
        answer: "Entra a tu panel, ve a “Mis productos” y toca “Crear producto”. Sube fotos, precio y descripción — tu catálogo queda visible en el directorio al instante.",
        cta: { label: "Ir a Mis productos", href: "/mi-cuenta/productos" },
      },
      {
        label: "Verificación de empresa",
        answer: "En “Mi cuenta → Empresa” completa tus datos y documentos. El equipo revisa y verifica tu perfil en 24–48 horas hábiles.",
        cta: { label: "Ir a Empresa", href: "/mi-cuenta/empresa" },
      },
      {
        label: "Gestión de mensajes",
        answer: "Los mensajes de compradores llegan como cotizaciones. Entra a “Cotizaciones” en tu panel para responder y dar seguimiento a cada chat.",
        cta: { label: "Ver cotizaciones", href: "/mi-cuenta/cotizaciones/proveedor" },
      },
      {
        label: "Plan Proveedor Pro",
        answer: "Proveedor Pro desbloquea mensajes ilimitados y mayor visibilidad en el directorio.",
        cta: { label: "Ver Proveedor Pro", href: "/proveedor-pro" },
      },
    ],
  },
  {
    icon: "🛒",
    label: "Clientes",
    topics: [
      {
        label: "Cómo buscar proveedores",
        answer: "Usa el Directorio para filtrar proveedores por categoría, país o producto y contactarlos directamente.",
        cta: { label: "Ir al Directorio", href: "/directorio" },
      },
      {
        label: "Enviar un mensaje",
        answer: "Entra al producto que te interesa y toca “Cotizar producto” para abrir un chat directo con el proveedor.",
        cta: { label: "Ver mis chats", href: "/mi-cuenta/cotizaciones" },
      },
      {
        label: "Cliente Pro",
        answer: "Con Cliente Pro envías mensajes sin límite y accedes a funciones avanzadas de contacto y seguimiento.",
        cta: { label: "Ver Cliente Pro", href: "/servicios/cliente" },
      },
      {
        label: "Historial de contactos",
        answer: "Todos tus chats con proveedores quedan guardados en “Mis chats”, dentro de tu panel de cuenta.",
        cta: { label: "Ver mis chats", href: "/mi-cuenta/cotizaciones" },
      },
    ],
  },
  {
    icon: "👤",
    label: "Mi cuenta",
    topics: [
      {
        label: "Crear cuenta",
        answer: "Regístrate gratis eligiendo si eres cliente o proveedor. Toma menos de un minuto.",
        cta: { label: "Crear cuenta", href: "/registro" },
      },
      {
        label: "Cambiar contraseña",
        answer: "En la pantalla de inicio de sesión toca “¿Olvidaste tu contraseña?” e ingresa tu correo para recibir el enlace de restablecimiento.",
        cta: { label: "Recuperar contraseña", href: "/recuperar-password" },
      },
      {
        label: "Actualizar perfil",
        answer: "Desde tu panel en “Mi cuenta” puedes cambiar tu foto y tus datos básicos en cualquier momento.",
        cta: { label: "Ir a Mi cuenta", href: "/mi-cuenta" },
      },
      {
        label: "Eliminar cuenta",
        answer: "Todavía no hay autoeliminado desde el panel. Escríbenos con el formulario de abajo y la eliminamos por ti.",
        cta: { label: "Ir al formulario", href: "#ayuda-pqr" },
      },
    ],
  },
  {
    icon: "💬",
    label: "Chat y mensajes",
    topics: [
      {
        label: "Límites de mensajes",
        answer: "Las cuentas básicas tienen un número limitado de mensajes al mes. Con el plan Pro (Proveedor Pro o Cliente Pro) los mensajes son ilimitados.",
      },
      {
        label: "Mensajes no entregados",
        answer: "Si un mensaje no llega, revisa tu conexión y vuelve a intentarlo. Si el problema sigue, cuéntanos con el formulario de abajo.",
        cta: { label: "Ir al formulario", href: "#ayuda-pqr" },
      },
      {
        label: "Bloquear un usuario",
        answer: "Todavía no hay botón de bloqueo dentro del chat. Si alguien te molesta, repórtalo con el formulario de abajo y lo revisamos.",
        cta: { label: "Ir al formulario", href: "#ayuda-pqr" },
      },
      {
        label: "Reportar contenido",
        answer: "Usa el formulario de abajo para reportar un producto, mensaje o usuario. Nuestro equipo lo revisa en 24–48 horas.",
        cta: { label: "Ir al formulario", href: "#ayuda-pqr" },
      },
    ],
  },
];

const FAQS = [
  {
    q: "¿Cómo publico mi catálogo en Drokex?",
    a: "Regístrate como proveedor, verifica tu empresa y desde tu panel selecciona 'Subir catálogo'. Puedes agregar fotos, descripciones y organizar tus productos por categoría.",
  },
  {
    q: "¿Es gratis usar Drokex?",
    a: "Sí, tanto el registro de proveedor como el de cliente son gratuitos. Existen planes Pro (Proveedor Pro y Cliente Pro) que desbloquean funciones avanzadas como mensajes ilimitados y mayor visibilidad.",
  },
  {
    q: "¿Cuánto tarda en verificarse mi empresa?",
    a: "El proceso de verificación toma entre 24 y 48 horas hábiles. Nuestro equipo revisa la documentación enviada y te notifica por correo cuando tu perfil esté verificado.",
  },
  {
    q: "¿Drokex gestiona pagos o logística?",
    a: "No. Drokex es el puente de conexión entre compradores y proveedores. Los pagos, la logística y las condiciones de entrega se acuerdan directamente entre las partes.",
  },
  {
    q: "¿En qué países está disponible Drokex?",
    a: "Actualmente tenemos presencia en Nicaragua, Honduras, Guatemala, El Salvador, República Dominicana, Colombia, Perú y México.",
  },
  {
    q: "¿Cómo recupero acceso a mi cuenta?",
    a: "En la pantalla de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?' e ingresa tu correo electrónico. Recibirás un enlace para restablecerla.",
  },
];

const PQR_TYPES = ["Petición", "Queja", "Reclamo", "Sugerencia", "Otro"];

function QuickAnswerPopup({ topic, onClose }) {
  if (!topic) return null;
  return (
    <div className={styles.qaOverlay} onClick={onClose}>
      <div className={styles.qaCard} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.qaClose} onClick={onClose} aria-label="Cerrar">
          <X size={18} />
        </button>
        <h3>{topic.label}</h3>
        <p>{topic.answer}</p>
        {topic.cta && (
          <a
            href={topic.cta.href}
            className={styles.qaCta}
            onClick={(e) => {
              onClose();
              if (topic.cta.href.startsWith("#")) {
                e.preventDefault();
                const id = topic.cta.href.slice(1);
                requestAnimationFrame(() => {
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                });
              }
            }}
          >
            {topic.cta.label} →
          </a>
        )}
      </div>
    </div>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div className={spStyles.spFaqList}>
      {FAQS.map((item, i) => (
        <div
          key={i}
          data-reveal
          className={`${spStyles.spFaqItem} ${styles.ayudaFaqItem} ${open === i ? `${spStyles.isOpen} ${styles.isOpen}` : ""}`}
        >
          <button
            className={`${spStyles.spFaqQuestion} ${styles.ayudaFaqQuestion}`}
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            aria-controls={`ayuda-faq-${i}`}
          >
            {item.q}
          </button>
          {/* sin `hidden`: display:none corta la transición de apertura.
              El span interno es necesario para animar la altura real con
              grid-template-rows 0fr→1fr (sin max-height mágico). */}
          <div id={`ayuda-faq-${i}`} className={`${spStyles.spFaqAnswer} ${styles.ayudaFaqAnswer}`}>
            <span>{item.a}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PqrForm() {
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.type) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos a soporte@drokex.com.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className={styles.ayudaFormSuccess}>
        <span className={styles.ayudaFormSuccessIcon}>✓</span>
        <h3>Recibimos tu mensaje</h3>
        <p>Te responderemos en un plazo de 24 a 48 horas hábiles al correo <strong>{form.email}</strong>.</p>
      </div>
    );
  }

  return (
    <form className={styles.ayudaForm} onSubmit={submit}>
      <div className={styles.ayudaFormRow}>
        <div className={styles.ayudaFormField}>
          <label htmlFor="pqr-name">Nombre completo</label>
          <input id="pqr-name" name="name" type="text" autoComplete="name" placeholder="Tu nombre" required value={form.name} onChange={handle} />
        </div>
        <div className={styles.ayudaFormField}>
          <label htmlFor="pqr-email">Correo electrónico</label>
          <input id="pqr-email" name="email" type="email" autoComplete="email" placeholder="correo@empresa.com" required value={form.email} onChange={handle} />
        </div>
      </div>
      <div className={styles.ayudaFormField}>
        <label htmlFor="pqr-type">Tipo de solicitud</label>
        <Select
          variant="dark"
          value={form.type}
          onChange={(v) => setForm((f) => ({ ...f, type: v }))}
          options={PQR_TYPES}
          placeholder="Selecciona una opción"
        />
      </div>
      <div className={styles.ayudaFormField}>
        <label htmlFor="pqr-message">Describe tu caso</label>
        <textarea id="pqr-message" name="message" rows={5} placeholder="Cuéntanos con detalle qué necesitas o qué ocurrió..." required value={form.message} onChange={handle} />
      </div>
      {error && <p className={styles.ayudaFormError}>{error}</p>}
      <button type="submit" className={styles.ayudaFormSubmit} disabled={loading}>
        {loading ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  );
}

export default function AyudaPage() {
  const [activeTopic, setActiveTopic] = useState(null);
  const heroRef = useRef(null);
  useHeroEntrance(heroRef);

  return (
    <div className={styles.ayudaPage}>
      <SiteHeader />
      <ScrollReveal />

      {/* HERO */}
      <section className={styles.ayudaHero}>
        <div className="shell" ref={heroRef}>
          <p className={styles.ayudaHeroTag} data-hero-item>Centro de ayuda</p>
          <h1 data-hero-item>¿En qué podemos <span>ayudarte?</span></h1>
          <p className={styles.ayudaHeroDesc} data-hero-item>
            Encuentra respuestas rápidas en nuestras preguntas frecuentes o envíanos una solicitud y te respondemos en 24–48 h.
          </p>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className={styles.ayudaCategories}>
        <div className="shell">
          <div className={styles.ayudaCategoriesGrid}>
            {CATEGORIES.map((cat) => (
              <div key={cat.label} className={styles.ayudaCatCard} data-reveal>
                <span className={styles.ayudaCatIcon}>{cat.icon}</span>
                <h3>{cat.label}</h3>
                <ul>
                  {cat.topics.map((t) => (
                    <li key={t.label}>
                      <button type="button" onClick={() => setActiveTopic(t)}>{t.label}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.ayudaFaq}>
        <div className="shell">
          <h2 data-reveal>Preguntas <span>frecuentes</span></h2>
          <FaqAccordion />
        </div>
      </section>

      <section id="ayuda-pqr" className={styles.ayudaPqr}>
        <div className={`shell ${styles.ayudaPqrGrid}`}>
          <div className={styles.ayudaPqrInfo} data-reveal>
            <p className={styles.ayudaPqrTag}>PQR</p>
            <h2>¿Necesitas ayuda con un caso específico?</h2>
            <p>Cuéntanos qué ocurrió y nuestro equipo te responderá por correo.</p>
          </div>
          <div data-reveal>
            <PqrForm />
          </div>
        </div>
      </section>

      <QuickAnswerPopup topic={activeTopic} onClose={() => setActiveTopic(null)} />

      <SiteFooter />
    </div>
  );
}
