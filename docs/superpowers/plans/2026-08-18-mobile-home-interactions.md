# Mobile Home Interactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplificar el home móvil con navegación por hamburguesa, CTAs estables y Drokex World bajo demanda.

**Architecture:** `SiteHeader` centraliza las acciones de sesión en el panel móvil y oculta las acciones externas por CSS. `page.js` limita los detalles hover del hero a puntero fino. `DrokexWorldSection` guarda un estado de expansión y evita montar el globo 3D hasta que la persona lo solicite en móvil.

**Tech Stack:** Next.js 16, React 19, CSS Modules, Tailwind v4, lucide-react y navegador integrado.

## Global Constraints

- No cambiar contenido comercial, rutas, datos de mercados ni assets.
- Mantener navegación por teclado, foco gestionado y etiquetas accesibles.
- No incorporar emojis ni dependencias nuevas.
- En tablet y móvil (`<=1023px`) el header muestra solo logo y hamburguesa.
- En móvil (`<=767px`) Drokex World se carga mediante el botón “Explorar mercados”.

---

### Task 1: Acciones de sesión dentro del menú móvil

**Files:**
- Modify: `app/components/site-header.js`
- Modify: `app/globals.css`
- Verify: navegador integrado en 390px y 768px.

- [ ] Escribir una comprobación visual fallida: en 390px, login y registro son visibles fuera de la hamburguesa.
- [ ] Añadir al panel móvil los enlaces de sesión o las acciones de cuenta según el estado de sesión.
- [ ] Ocultar `.header-actions` de sesión y país bajo 1024px, conservando el trigger del menú.
- [ ] Verificar que login y registro están dentro del panel y que el foco sigue atrapado.

### Task 2: CTAs táctiles y Drokex World bajo demanda

**Files:**
- Modify: `app/page.js`
- Modify: `app/components/drokex-world-experience.js`
- Modify: `app/page.module.css`
- Verify: navegador integrado en 390px.

- [ ] Escribir una comprobación visual fallida: el hero puede renderizar sus paneles hover en táctil y el globo está montado inicialmente.
- [ ] Condicionar los paneles hover del hero a un puntero fino para que no se rendericen en móvil/táctil.
- [ ] Añadir a `DrokexWorldSection` la tarjeta compacta y el estado de expansión móvil, con botón accesible para abrir/cerrar el globo.
- [ ] Estilizar la tarjeta compacta y la experiencia expandida para que los controles no colisionen con WhatsApp.
- [ ] Verificar apertura, cierre, ausencia de overflow y que el globo solo aparece después del toque.

### Task 3: Verificación

**Files:**
- Verify: `app/components/site-header.js`, `app/page.js`, `app/components/drokex-world-experience.js`, `app/globals.css`, `app/page.module.css`.

- [ ] Ejecutar `npm test` y `npm run build`.
- [ ] Probar 1440px, 768px y 390px en navegador; comprobar que desktop conserva el comportamiento actual y móvil cumple los nuevos estados.
- [ ] Ejecutar `git diff --check` y crear el commit con los archivos del alcance.
