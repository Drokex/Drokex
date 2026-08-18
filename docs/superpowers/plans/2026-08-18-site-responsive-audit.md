# Site Responsive Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir el navbar móvil y ejecutar un programa responsive verificable para todas las rutas de Drokex.

**Architecture:** `app/globals.css` mantiene las reglas compartidas de header, shell y footer. Cada fase cambia únicamente las rutas y CSS de su grupo, con prueba visual en los cuatro rangos. El avance se detiene al final de cada fase para recibir aprobación explícita.

**Tech Stack:** Next.js 16 App Router, React 19, CSS Modules, Tailwind v4 y navegador integrado.

## Global Constraints

- No cambiar copy, datos, rutas, assets ni lógica de negocio.
- Mantener accesibilidad, foco y navegación por teclado.
- Usar desktop `>=1440px`, laptop `1024–1439px`, tablet `768–1023px` y móvil `<=767px`.
- No usar `overflow-x: hidden` para ocultar defectos de layout.
- No avanzar de fase sin aprobación explícita.

---

### Phase 0: Navbar compartido

**Files:**
- Modify: `app/globals.css`
- Verify: `/` en 1440px, 1024px, 768px y 390px.

- [ ] Registrar el fallo: en 390px `.header-row` usa una columna y logo/hamburguesa ocupan filas diferentes.
- [ ] En `max-width:1023px`, definir `grid-template-columns: minmax(0, 1fr) auto` y `grid-template-areas: "brand actions"`; quitar el espacio de fila sobrante.
- [ ] Confirmar header de una sola fila, menú operable, foco atrapado y ausencia de desbordamiento.
- [ ] Ejecutar `npm test`, `npm run build` y crear un commit de la fase.

### Phase 1: Páginas públicas

**Routes:** `/productos`, `/categorias`, `/directorio`, `/servicios/cliente`, `/servicios/proveedor`, `/para-proveedores`, `/sobre-nosotros`, `/ayuda`, `/aprende`, `/home-v1`.

**Files:**
- Audit/modify: `app/productos/page.js`, `app/categorias/page.module.css`, `app/directorio/directorio.module.css`, `app/servicios/servicios-proveedor.module.css`, `app/sobre-nosotros/page.module.css`, `app/ayuda/page.module.css`, `app/home-v1/page.module.css`.

- [ ] Medir en cada ruta el ancho de documento, header/footer, grillas, filtros, CTAs y medios en 1440px, 1024px, 768px y 390px.
- [ ] Ajustar por ruta columnas, paddings, controles y orden de contenido; confirmar touch targets de al menos 44px.
- [ ] Validar en navegador cada ruta y ejecutar build antes de pedir aprobación de Phase 2.

### Phase 2: Comercio

**Routes:** `/producto/[slug]`, `/proveedor-pro`, `/proveedor-pro/tienda/[slug]`, `/proveedor-pro/tienda/[slug]/marca`, `/proveedor-pro/tienda/[slug]/productos`.

**Files:**
- Audit/modify: `app/producto/[slug]/page.module.css`, `app/proveedor-pro/tailwind.css`, clientes de tienda proveedor-pro y componentes de galería/chat/formulario.

- [ ] Validar galería, ficha, chat, cotización, tablas y filtros en los cuatro rangos.
- [ ] Apilar columnas en tablet/móvil, mantener CTAs visibles y eliminar clipping de medios y paneles flotantes.
- [ ] Probar navegación, cotización y chat sin modificar datos reales; ejecutar build antes de pedir aprobación de Phase 3.

### Phase 3: Autenticación

**Routes:** `/login`, `/registro`.

**Files:**
- Audit/modify: `app/login/page.js`, `app/registro/page.module.css`, `app/components/auth-fields.module.css`, `app/components/auth-wall.module.css`.

- [ ] Validar formularios, teclado virtual, mensajes de error y CTAs a 390px y 768px.
- [ ] Ajustar ancho, orden, espaciado y foco sin cambiar validaciones ni credenciales.
- [ ] Ejecutar prueba visual y build antes de pedir aprobación de Phase 4.

### Phase 4: Backoffice

**Routes:** `/mi-cuenta` y sus subrutas, `/admin`.

**Files:**
- Audit/modify: `app/mi-cuenta/provider-shell.module.css`, `app/mi-cuenta/cotizaciones/*.module.css`, `app/mi-cuenta/productos/inventario/inventory.module.css`, `app/admin/page.module.css` y páginas de cuenta relacionadas.

- [ ] Verificar sidebar, tablas, formularios, dashboards, acciones y modales en los cuatro rangos.
- [ ] Usar scroll interno solo en tablas necesarias, con cabeceras/acciones accesibles; no permitir que el documento desborde.
- [ ] Probar solo vistas de lectura y acciones no destructivas; ejecutar build antes de pedir aprobación de Phase 5.

### Phase 5: Experiencias especiales

**Routes:** `/studio`, `/3d`, `/drokex-world`.

**Files:**
- Audit/modify: `app/studio/*.module.css`, `app/3d/page.js`, `app/drokex-world/*`.

- [ ] Validar canvas, 3D, escenas, controles y fallbacks en tablet/móvil.
- [ ] Cargar experiencias pesadas bajo demanda cuando bloqueen el uso móvil y preservar controles de cierre/foco.
- [ ] Ejecutar prueba visual, `npm test`, `npm run build` y revisión final antes de integrar.
