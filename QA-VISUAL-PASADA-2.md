# QA visual — pasada 2

**Fecha:** 14 de agosto de 2026  
**Alcance solicitado:** escritorio y móvil; rail superior, Onboarding, Feedback/Reviews, clipping, superposición y rutas.  
**Resultado de disponibilidad:** no fue posible ejecutar la validación visual en esta pasada. El servidor local no responde en `localhost:3000` y no hubo una ventana de navegador disponible para inspección. No se iniciaron servicios ni se modificó código para no interferir con el trabajo concurrente.

## Estado de la pasada

| Área | Estado | Observación |
|---|---|---|
| Servidor local | No disponible | No responde en el puerto 3000 al momento de esta pasada. |
| Navegador visual | No disponible | No hay superficie de navegador enlazada para screenshots o interacción. |
| Desktop 1440×1000 | Pendiente | Requiere servidor y viewport real. |
| Móvil 390×844 | Pendiente | Requiere servidor y viewport real. |
| QA estático de layout | Hecho | Se identifican riesgos por CSS/estructura, sin afirmar resultado visual. |

## Riesgos visuales a validar apenas vuelva localhost

### P1 — alto riesgo de corte, solapamiento o jerarquía incorrecta

1. **Pantalla de Ganar mantiene una diagonal de color.**
   - La clase `app-ganar` conserva un gradiente diagonal rosa/acid.
   - Contradice la decisión de eliminar triángulos/contrastes al pie de las pantallas.
   - Verificar que no corte la lectura ni agregue una banda visual al final del teléfono.

2. **Ficha técnica en el flujo público agrega una segunda capa de contenido extensa.**
   - La ficha se renderiza debajo de Acompañante, Onboarding y Builder.
   - En desktop puede producir una composición de dos “productos” simultáneos; en móvil puede quedar lejos del recorrido principal y confundir jerarquía.
   - Validar después de moverla al modo Equipo/Reviews, no como bloque público.

3. **Feedback móvil es una hoja absoluta entre header y bottom navigation.**
   - Usa `inset: 62px 8px 70px` y scroll propio.
   - Validar que no tape la confirmación, que cierre siempre, que el teclado no oculte el botón de enviar y que se vea completa a 390×844.

4. **Selector superior de seis productos.**
   - Validar a 1440 y 390 que los seis nombres no se corten, que el tab activo se distinga con texto además de color y que el scroll horizontal tenga pista visual sin esconder productos.

5. **Onboarding y Builder usan teléfonos con contenido vertical largo.**
   - Validar header fijo, progreso, botones de volver y CTA principal a 390×844; especialmente la guía de MCP por sus bloques de pasos/copy extenso.

### P2 — controles de acabado visual y accesibilidad

- Verificar contraste de tamaños pequeños (6–8 px en monoespaciada) en modo oscuro y claro; varias etiquetas operativas pueden perder legibilidad a zoom normal.
- Verificar foco visible en rail, nav inferior, selector de Feedback, estados Kanban y botones de conexión MCP.
- Verificar que la tarjeta de chat conserve campo y botón visibles con teclado móvil abierto.
- Verificar que el halo verde no invada contenido del teléfono o oculte borde/scrollbar en desktop.
- Verificar que el indicador de estado del feedback no dependa solo de color y que sus textos “local / compartido / no enviado” sean legibles.
- Verificar que todas las pantallas vacías (Home Banking, Tarjetas, Remesas) presenten ilustración y copy centrados sin cortar título, gesto o mensaje de feedback lateral.

## Guion de validación visual cuando el servidor esté disponible

### Escritorio — 1440×1000

- [ ] Inicio: rail superior ocupa el ancho sin bloque “Portfolio YOL1”; no hay banda duplicada de eventos.
- [ ] Inicio: editorial, Feedback y teléfono no se solapan; el gesto decorativo no corta el contenido.
- [ ] Acompañante: Inicio, Finanzas, Cartola, Cobrar/pagar, Ahorrar, Ganar y Mi banco caben sin clipping horizontal.
- [ ] Onboarding: primer CTA abre exploración sin teléfono/email; el flujo de activación queda separado visualmente.
- [ ] Builder: conectores ChatGPT/Claude, copiar URL y prompt se leen sin que el teléfono corte contenido.
- [ ] Reviews: tres secciones diferenciadas (personas, decisiones, IA), sin que el detalle de Postgres compita con el tablero.

### Móvil — 390×844

- [ ] El top rail tiene scroll horizontal controlado y no desplaza el documento de forma inesperada.
- [ ] Header y bottom nav no cubren CTAs ni campos.
- [ ] Feedback abre/cierra y se puede enviar sin que el teclado esconda el botón.
- [ ] Carruseles/listas internas de Inicio, Cartola y Cobrar/pagar no provocan scroll horizontal de página.
- [ ] Onboarding mantiene CTA y back disponibles en cada paso.
- [ ] Vista previa de mensaje tiene salida clara a YOL1 y no parece una app externa real.
- [ ] Modo claro conserva contraste en fondos, bordes, estados seleccionados y texto pequeño.

## Rutas que deben probarse interactivamente

1. Inicio → Ignorar → Deshacer.
2. Inicio → Revisar → Cartola con fila seleccionada → volver a Finanzas.
3. Inicio → Cobrar/pagar → preparar reparto → vista previa de texto → volver.
4. Inicio → chat: sugerencia y campo utilizables desde el primer render en demo.
5. Onboarding → Explorar YOL1 sin OTP → activar función → pre-registro → OTP → retorno al Acompañante.
6. Mi banco → salir/volver desde RUT, serie y biometría; dejar identificada la salida de ayuda pendiente.
7. Builder → ChatGPT/Claude → copiar URL → copiar prompt → volver → Enviar proyecto.
8. Feedback en una pantalla → confirmar destino → `/review` en modo local y compartido.

## Condición para cerrar esta pasada

Repetir este documento con capturas reales de 1440×1000 y 390×844, y marcar cada ítem como **OK**, **ajustar** o **bloqueado**. Mientras localhost siga caído, cualquier afirmación de que no hay clipping o solapamiento sería especulativa.
