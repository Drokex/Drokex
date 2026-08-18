# Navbar móvil y auditoría responsive del sitio

## Objetivo

Corregir el header móvil para que logo y hamburguesa compartan una única fila, y preparar un plan verificable para adaptar el resto de rutas de Drokex a tablet y móvil.

## Navbar móvil

- En `<=1023px`, `.header-row` usa dos columnas: marca flexible y acciones de ancho automático.
- Logo y hamburguesa permanecen alineados verticalmente en una altura compacta; no se apilan.
- El panel móvil conserva todos los enlaces y los CTAs de sesión dentro del propio panel.
- Desktop y laptop conservan sus reglas actuales.

## Auditoría responsive

El plan se organiza por grupos para ejecutar en fases separadas:

1. Páginas públicas: productos, categorías, directorio, servicios, proveedores, sobre nosotros, ayuda, aprende y home-v1.
2. Comercio: producto y proveedor-pro.
3. Autenticación: login y registro.
4. Backoffice: mi cuenta, productos, inventario, pedidos, ventas, cotizaciones, empresa y admin.
5. Experiencias especiales: studio, 3D y Drokex World.

Cada fase incluirá rutas, archivos, problemas a comprobar, breakpoints, prueba visual y criterio de cierre. No se implementará ninguna fase posterior sin aprobación explícita.

## Límites

- No cambiar copy, datos, rutas, assets ni lógica de negocio.
- Mantener accesibilidad, foco y navegación por teclado.
- Usar los rangos actuales: desktop `>=1440px`, laptop `1024–1439px`, tablet `768–1023px`, móvil `<=767px`.

## Verificación

- Navbar: 390px, 768px, 1024px y 1440px; logo/hamburguesa alineados y menú navegable.
- Auditoría: cada ruta se verificará en 1440px, 1024px, 768px y 390px antes de cerrar su fase.
