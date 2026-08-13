"use client";

import { useState } from "react";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import styles from "./page.module.css";
import spStyles from "@/app/servicios/servicios-proveedor.module.css";

const CATEGORIES = [
  {
    icon: "📦",
    label: "Proveedores",
    topics: ["Cómo publicar mi catálogo", "Verificación de empresa", "Gestión de mensajes", "Plan Proveedor Pro"],
  },
  {
    icon: "🛒",
    label: "Clientes",
    topics: ["Cómo buscar proveedores", "Enviar un mensaje", "Cliente Pro", "Historial de contactos"],
  },
  {
    icon: "👤",
    label: "Mi cuenta",
    topics: ["Crear cuenta", "Cambiar contraseña", "Actualizar perfil", "Eliminar cuenta"],
  },
  {
    icon: "💬",
    label: "Chat y mensajes",
    topics: ["Límites de mensajes", "Mensajes no entregados", "Bloquear un usuario", "Reportar contenido"],
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

function FaqAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div className={spStyles.spFaqList}>
      {FAQS.map((item, i) => (
        <div
          key={i}
          className={`${spStyles.spFaqItem} ${styles.ayudaFaqItem} ${open === i ? spStyles.isOpen : ""}`}
        >
          <button className={`${spStyles.spFaqQuestion} ${styles.ayudaFaqQuestion}`} onClick={() => setOpen(open === i ? null : i)}>
            {item.q}
          </button>
          <div className={`${spStyles.spFaqAnswer} ${styles.ayudaFaqAnswer}`}>{item.a}</div>
        </div>
      ))}
    </div>
  );
}

function PqrForm() {
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handle(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
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
          <input id="pqr-name" name="name" type="text" placeholder="Tu nombre" required value={form.name} onChange={handle} />
        </div>
        <div className={styles.ayudaFormField}>
          <label htmlFor="pqr-email">Correo electrónico</label>
          <input id="pqr-email" name="email" type="email" placeholder="correo@empresa.com" required value={form.email} onChange={handle} />
        </div>
      </div>
      <div className={styles.ayudaFormField}>
        <label htmlFor="pqr-type">Tipo de solicitud</label>
        <select id="pqr-type" name="type" required value={form.type} onChange={handle}>
          <option value="">Selecciona una opción</option>
          {PQR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className={styles.ayudaFormField}>
        <label htmlFor="pqr-message">Describe tu caso</label>
        <textarea id="pqr-message" name="message" rows={5} placeholder="Cuéntanos con detalle qué necesitas o qué ocurrió..." required value={form.message} onChange={handle} />
      </div>
      <button type="submit" className={styles.ayudaFormSubmit} disabled={loading}>
        {loading ? "Enviando..." : "Enviar solicitud"}
      </button>
    </form>
  );
}

export default function AyudaPage() {
  return (
    <div className={styles.ayudaPage}>
      <SiteHeader />

      {/* HERO */}
      <section className={styles.ayudaHero}>
        <div className="shell">
          <p className={styles.ayudaHeroTag}>Centro de ayuda</p>
          <h1>¿En qué podemos <span>ayudarte?</span></h1>
          <p className={styles.ayudaHeroDesc}>
            Encuentra respuestas rápidas en nuestras preguntas frecuentes o envíanos una solicitud y te respondemos en 24–48 h.
          </p>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className={styles.ayudaCategories}>
        <div className="shell">
          <div className={styles.ayudaCategoriesGrid}>
            {CATEGORIES.map((cat) => (
              <div key={cat.label} className={styles.ayudaCatCard}>
                <span className={styles.ayudaCatIcon}>{cat.icon}</span>
                <h3>{cat.label}</h3>
                <ul>
                  {cat.topics.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.ayudaFaq}>
        <div className="shell">
          <h2>Preguntas <span>frecuentes</span></h2>
          <FaqAccordion />
        </div>
      </section>


      <SiteFooter />
    </div>
  );
}
