@AGENTS.md

# Drokex

E-commerce/marketplace de cables y componentes eléctricos — catálogo, cotizaciones, proveedores.
Arquetipo **A (app comercial)** del `~/.claude/BLUEPRINT.md`, pero en **JavaScript, no TypeScript**
(gotcha: no asumas tipos, no sugieras `.ts`/`.tsx` porque "es lo normal" en mis otros proyectos).

## Stack

- Next.js 16.2 (App Router) · React 19.2 · Tailwind v4
- Prisma 7 + `@prisma/adapter-pg` (pool `pg`) — **no** Supabase directo aquí
- Auth: `jose` JWT en cookie httpOnly `drokex_session`, ver `lib/auth.js`
- 3D/visual: `three`, `@splinetool/react-spline`, `react-globe.gl` (mapa Américas), `framer-motion`
- IA: `openai` directo (no AI SDK) — chat de producto, generación de imágenes, cotizaciones por stream
- Iconos: `lucide-react`
- Email: `nodemailer`

## Comandos

```bash
npm run dev          # next dev — mata el proceso viejo del 3000 antes (pkill -f "next dev")
npm run build
npm run db:push       # prisma db push — NUNCA migrate dev
npm run db:generate    # tras cada db push
npm run db:seed
```

## Estructura

```
app/
├── (público)          productos/ producto/ categorias/ directorio/ aprende/ servicios/
├── admin/              panel superadmin
├── proveedor-pro/       portal proveedores + api/proveedor-pro/{dir-hint,thumbnail}
├── mi-cuenta/  login/  registro/
├── drokex-world/ 3d/ studio/   experiencias 3D (Spline, three, personaje-360)
├── api/
│   ├── auth/{login,logout,register}/
│   ├── products/  orders/  quotes/  quotes/stream/   (SSE)
│   ├── conversations/[id]/messages/    chat de producto
│   ├── generate-image/                 IA
│   ├── game-scores/                    minijuego
│   └── proveedor-pro/  directorio/  contact/  account/  upgrade/
└── components/          todo en JS, sin carpeta ui/ separada — plano
lib/
├── prisma.js  auth.js  current-user.js
├── products.js  orders.js  quotes.js  users.js  admin.js
├── market-pricing.js    precio en vivo (ver market-price.js component)
├── emails.js  demo-users.js  sample-products.js
prisma/schema.prisma
scripts/
```

**Regla de `lib/`:** un archivo por dominio, igual que en kliniu/l-origine. `current-user.js`
separado de `auth.js` — auth firma/valida el JWT, current-user resuelve el usuario desde la sesión.

## Schema (Prisma)

Modelos: `Product`, `User`, `Order`, `OrderItem`, `Quote`, `Conversation`, `ChatMessage`,
`InventoryMovement`, `GameScore`, `ProveedorProLanding`.

`UserRole`: `CUSTOMER` · `PROVIDER` · `ADMIN` (tres roles, no jerarquía de staff como kliniu —
no asumas `isStaff`/`isSuperAdmin`, aquí no existen esos predicados).

Otros enums: `PlanType`, `OrderStatus`, `PaymentStatus`, `InventoryMovementType`, `QuoteStatus`.

## Diseño

Tema oscuro por defecto (`color-scheme: dark` en `:root`). Paleta reducida y explícita en
`app/globals.css`:

- `--bg #050505` / `--bg-soft #f4f4f2` (claro)
- `--ink #ffffff` / `--ink-dark #111111`
- `--lime` / `--green` = `#7FE040` (mismo verde, dos nombres — es el acento de marca)
- `--orange #f07a1e`

**Nota:** el proyecto usa variables CSS planas (`--bg`, `--ink`...) además de un bloque `@theme`
de Tailwind v4 con overrides de `lime`/`green`. No es el sistema `@color-accent` semántico del
BLUEPRINT — respeta el patrón existente del repo, no lo migres sin que lo pida.

`country-entry-gate.js` y `maintenance-gate.js` son gates a nivel de página — la home puede
mostrar "Página en Mantenimiento" en vez del contenido real; si algo "no carga", revisa esos
componentes antes de asumir bug.

## Gotchas propios

- JS puro (`.js`, no `.jsx`/`.tsx`) en todo `app/` y `lib/` — jsconfig.json, no tsconfig.
- `AGENTS.md` lo regenera `next dev` solo (bloque `nextjs-agent-rules`) — no lo edites a mano,
  commitéalo tal cual si aparece en el diff.
- Pool `pg` explícito en `lib/prisma.js` (`max: 5`, timeouts) en vez de dejarlo a default del
  adapter — tocarlo con cuidado si hay problemas de conexiones agotadas.
- `db:seed` corre `node prisma/seed.js` (no tsx pese a tener `tsx` en devDependencies).

## Reglas duras (heredadas de `~/.claude/CLAUDE.md`)

- Español, directo. Nunca digas "funciona" sin probarlo en navegador real (Playwright/Chrome).
- Datos reales o vacío explícito — nunca inventados. Sin staging: nunca sobrescribas password
  de cuenta real.
- Sin emoji literal en UI — `lucide-react`. Sin `alert()` nativo. `<select>` nativo → componente
  propio. Dropdowns/modales portalizados.
- Mata el `next dev` viejo del 3000 antes de levantar uno nuevo.
- `prisma db push` + `generate` a mano, nunca `migrate dev`.
