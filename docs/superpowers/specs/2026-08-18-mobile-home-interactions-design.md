# Home móvil — navegación y Drokex World

## Objetivo

Simplificar la experiencia móvil del home: navegación mediante una única hamburguesa, CTAs del hero sin elementos flotantes rotos y Drokex World disponible bajo demanda.

## Comportamiento

- En tablet y móvil (`<=1023px`), el header muestra solo logo y botón de menú.
- El panel móvil conserva los enlaces actuales e incorpora al final los CTAs de sesión: iniciar sesión y registrarse. Si hay sesión, conserva las acciones de cuenta y salir.
- En dispositivos táctiles (`<=767px`), los botones principales del hero no abren las tarjetas descriptivas al tocar o recibir foco; mantienen su enlace y jerarquía visual.
- En móvil, Drokex World inicia como una tarjeta compacta con copy y botón “Explorar mercados”. El globo y sus controles se renderizan tras tocar ese botón; la experiencia se puede cerrar y volver a la tarjeta compacta.
- Desktop mantiene el header, hero y Drokex World actuales.

## Límites

- No cambiar contenido comercial, rutas, datos de mercados ni assets.
- Mantener navegación por teclado, foco gestionado y etiquetas accesibles.
- El botón de Drokex World debe ser un control nativo y expresar su estado expandido.

## Verificación

- Probar header y menú en 390px y 768px: no aparecen CTAs fuera del menú y los CTAs internos navegan correctamente.
- Probar hero en 390px: los CTAs no muestran paneles flotantes ni producen overflow.
- Probar Drokex World en 390px: inicia compacto, abre el globo solo al tocar, puede cerrarse y no interfiere con el botón de WhatsApp.
- Ejecutar `npm test`, `npm run build` y la prueba visual en navegador.
