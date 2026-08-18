# Home responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajustar la ruta `/` para que el home sea usable y visualmente consistente entre 320px y desktop, sin scroll horizontal.

**Architecture:** Se consolidarán las reglas de layout en los estilos existentes: `app/globals.css` define el contenedor, header y footer compartidos; `app/page.module.css` controla las secciones del home. No se crearán componentes ni dependencias. La prueba de regresión será visual e interactiva con el navegador integrado, porque el proyecto no tiene Playwright instalado como dependencia de desarrollo.

**Tech Stack:** Next.js 16 App Router, React 19, CSS Modules, CSS global, navegador integrado.

## Global Constraints

- No modificar copy, rutas, datos, identidad visual ni lógica de negocio.
- Mantener `lucide-react` para iconos existentes; no incorporar emojis nuevos en UI.
- Conservar navegación por teclado, labels, foco y `prefers-reduced-motion`.
- No introducir dependencias, selectores globales nuevos ni `overflow-x: hidden` como parche de desbordamientos.
- Usar los rangos: desktop `>=1280px`, laptop `1024–1279px`, tablet `768–1023px`, móvil `<=767px`.

---

### Task 1: Base compartida, header y footer

**Files:**
- Modify: `app/globals.css:55-115, 620-700`
- Verify: navegador integrado en `/`.

**Interfaces:**
- Consumes: clases globales `.shell`, `.site-header`, `.header-row`, `.main-nav`, `.header-actions`, `.mobile-menu-trigger`, `.site-footer-grid`.
- Produces: navegación desktop visible desde 1024px y panel móvil visible por debajo de 1024px, con footer de cuatro, dos y una columnas según el rango.

- [ ] **Step 1: Establecer el caso de fallo visual**

En 1280×800 abrir `/` autenticado y comprobar que `.main-nav` es visible; en el estado actual estará oculto porque el breakpoint es `max-width: 1600px`.

- [ ] **Step 2: Registrar el fallo**

Usar una inspección de DOM en navegador que lea `getComputedStyle(document.querySelector('.main-nav')).display`; esperar un valor distinto de `none` y confirmar el fallo actual.

- [ ] **Step 3: Aplicar la regla mínima**

En `app/globals.css`, sustituir el bloque responsive del header por una regla tablet `@media (max-width: 1023px)` que oculte `.main-nav`, muestre `.mobile-menu-trigger` y compacte `.header-row`; conservar a partir de 1024px el grid de tres columnas, reduciendo `gap` solo en laptop si hace falta. Mantener `.shell` en 72px de margen a tablet y 32px en móvil. Alinear footer a 2 columnas en `max-width: 1023px` y 1 columna en `max-width: 767px`.

- [ ] **Step 4: Verificar el comportamiento corregido**

En 1280×800 confirmar nav desktop visible y hamburguesa oculta; en 1023×768 confirmar lo contrario; en 390×844 verificar que el logo, sesión y hamburguesa caben sin desbordamiento.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "fix: align responsive header and footer breakpoints"
```

### Task 2: Hero y bloques de conversión

**Files:**
- Modify: `app/page.module.css:1651-1955, 2232-2292`
- Verify: navegador integrado en `/`.

**Interfaces:**
- Consumes: `.heroSection`, `.heroShell`, `.heroCopy`, `.heroActionsSplit`, `.heroOptionButton`, `.heroBtnFeaturesCard`.
- Produces: CTAs visibles sin solapamiento y a una columna en móvil.

- [ ] **Step 1: Establecer el caso de fallo visual**

En 1024×768 y 390×844 inspeccionar los rectángulos de `.heroCopy`, `.heroActionsSplit` y cada `.heroOptionButton`; el fallo es cualquier intersección entre CTA/copy, ancho mayor al viewport o CTA parcial fuera de pantalla.

- [ ] **Step 2: Registrar el fallo**

Guardar los valores de `getBoundingClientRect()` antes del ajuste e identificar el breakpoint que mantiene el posicionamiento absoluto demasiado tiempo.

- [ ] **Step 3: Aplicar la regla mínima**

Reemplazar `max-width: 960px` por tablet `max-width: 1023px`: hero con copy y acciones en flujo, acciones flexibles y con ancho limitado. En `max-width: 767px`, mantener una sola columna, CTA `width: 100%`, eliminar mínimos de ancho y reducir tipografía/padding sin cambiar texto. Asegurar que las tarjetas flotantes se alineen al botón y no amplíen el documento.

- [ ] **Step 4: Verificar el comportamiento corregido**

En 1280×800 revisar composición desktop; en 1024×768 y 768×1024 revisar que el hero no quede vacío ni superpuesto; en 390×844 y 320×568 comprobar CTAs completos, legibles y sin scroll horizontal.

- [ ] **Step 5: Commit**

```bash
git add app/page.module.css
git commit -m "fix: stabilize home hero across breakpoints"
```

### Task 3: Secciones, carruseles y controles móviles

**Files:**
- Modify: `app/page.module.css:457-481, 527-536, 1297-1578, 2213-2230`
- Verify: navegador integrado en `/`.

**Interfaces:**
- Consumes: `.systemSteps`, `.systemHighlights`, `.marketsStage`, `.marketsInteractive`, `.marketsCards`, `.pfGrid`, `.pfCarouselSlide`, `.pfFlowBar`, `.featureVideoCarousel`, `.tcStage`.
- Produces: grids adaptados por rango, controles visibles y carruseles sin clipping accidental.

- [ ] **Step 1: Establecer los casos de fallo visual**

En 768×1024 y 390×844 recorrer sistema, plataforma, mercados y testimonios. Fallos: contenido cortado, controles fuera de pantalla, texto ilegible, scroll horizontal de documento o carrusel imposible de usar.

- [ ] **Step 2: Registrar los fallos**

Con inspección DOM, verificar para cada sección que `document.documentElement.scrollWidth === window.innerWidth` y que los botones de navegación tienen un rectángulo dentro del viewport.

- [ ] **Step 3: Aplicar la regla mínima**

Mantener tres pasos de sistema entre 1024px y 1279px, pasar los grids a una columna bajo 1024px y compactar padding/medios solo bajo 768px. Alinear plataforma, mercados y carruseles con los mismos cortes; dejar su overflow interno intencional, pero eliminar cualquier ancho mínimo que desborde el documento.

- [ ] **Step 4: Verificar el comportamiento corregido**

Probar 1440×900, 1280×800, 1024×768, 768×1024, 390×844 y 320×568. En cada viewport confirmar sin overflow horizontal; interactuar con menú móvil y con un control de carrusel por sección que lo tenga.

- [ ] **Step 5: Commit**

```bash
git add app/page.module.css
git commit -m "fix: adapt home sections for tablet and mobile"
```

### Task 4: Verificación final

**Files:**
- Verify: `app/globals.css`, `app/page.module.css`, ruta `/`.

**Interfaces:**
- Consumes: cambios de Tasks 1-3.
- Produces: evidencia de que la ruta cumple el diseño responsive aprobado.

- [ ] **Step 1: Ejecutar la suite existente**

```bash
node --test lib/**/*.test.js
```

- [ ] **Step 2: Generar el build de producción**

```bash
npx next build
```

- [ ] **Step 3: Hacer la prueba visual final**

Con el navegador integrado autenticado, validar los seis viewports de la especificación. Confirmar header correcto en 1280px y 1024px, CTAs del hero visibles, ausencia de scroll horizontal, controles operables y footer legible.

- [ ] **Step 4: Revisar el diff**

```bash
git diff --check
git status --short
```

- [ ] **Step 5: Confirmar árbol limpio para los archivos del alcance**

```bash
git status --short app/globals.css app/page.module.css
```
