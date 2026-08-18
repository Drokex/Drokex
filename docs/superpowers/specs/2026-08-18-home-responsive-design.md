# Home responsive — diseño

## Objetivo

Hacer que la ruta `/` se adapte sin desbordamiento horizontal y conserve su jerarquía visual en desktop, laptop, tablet y móvil, sin cambiar contenido ni identidad de Drokex.

## Rangos

| Rango | Ancho | Comportamiento |
| --- | --- | --- |
| Desktop | 1280px o más | Navegación completa y layouts multicolumna. |
| Laptop | 1024px a 1279px | Navegación completa compacta; reducción de espacios y columnas cuando sea necesario. |
| Tablet | 768px a 1023px | Navegación mediante menú; hero y secciones en una o dos columnas según el contenido. |
| Móvil | 767px o menos | Una columna, acciones a ancho completo, controles alcanzables y espaciado compacto. |

## Alcance

- Unificar los breakpoints del header, la shell y el home alrededor de los cuatro rangos definidos.
- Mantener el menú desktop hasta laptop; usar el panel móvil solo en tablet y móvil.
- Reorganizar el hero para que los CTAs no dependan de posicionamiento absoluto bajo 1024px y queden apilados en móvil.
- Garantizar que sistema, plataforma, mercados, testimonios y footer se adapten sin cortes ni scroll horizontal.
- Reducir tamaños, paddings y elementos decorativos únicamente cuando no aporten legibilidad en pantallas pequeñas.
- Conservar accesibilidad existente: labels, foco, navegación de teclado y `prefers-reduced-motion`.

## Exclusiones

- No se modifica copy, rutas, datos ni funcionalidad de negocio.
- No se rediseñan assets, paleta, tipografías ni animaciones fuera de los ajustes necesarios para su visualización responsive.

## Verificación

- Prueba visual autenticada del home en 1440×900, 1280×800, 1024×768, 768×1024, 390×844 y 320×568.
- Confirmar ausencia de scroll horizontal, CTAs visibles, header operable, carruseles usables y footer legible.
- Ejecutar la suite existente y un build de producción antes de cerrar.
