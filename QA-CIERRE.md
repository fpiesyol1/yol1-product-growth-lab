# Cierre verificable — YOL1 Product Growth Lab

Fecha: 12 de agosto de 2026  
Estado: **prototipo exploratorio con datos sintéticos; no canon**

No conecta bancos, no mueve dinero y no representa capacidades disponibles, roadmap, wedge, producto validado ni readiness.

## Intake de feedback local — 13 de agosto de 2026

- Se eliminó la fotografía lateral y se sustituyó por una tarjeta permanente de Feedback integrada al escenario editorial.
- El contexto usa automáticamente el módulo activo entre los siete existentes.
- “Me gusta” acepta comentario opcional; “Mejoraría” e “Idea” requieren texto. “Temas clave” es opcional.
- La demo guarda hasta 30 entradas en `localStorage`, muestra confirmación dentro del panel y no transmite datos.
- En móvil existe un acceso compacto en el encabezado y una hoja cerrable por encima del contenido, sin ocultar permanentemente la navegación.
- `lib/feedback-intake.ts` separa contrato y adapter local; `FEEDBACK-INTAKE.md` define la futura ruta server-side protegida y la revisión editorial previa a cualquier branch/PR.
- Revisión responsive de código: desktop conserva el panel dentro de la columna editorial; en `max-width:720px` desaparece el lateral y la hoja usa `inset: 62px 8px 70px`, dejando libres header y navegación inferior. Se verificó ausencia de la foto y de overflow horizontal estructural mediante guardrail.
- La compilación y los tests responsive/guardrail pasan. La política del navegador integrado impidió capturar visualmente `localhost` en esta sesión; no se atribuye una inspección visual nueva de 390×844 o 1440×1000 hasta que Felipe recargue la pestaña local.

### Ajuste de disposición desktop

- Feedback queda siempre abierto, compacto y en flujo normal al final del lateral izquierdo.
- Se eliminó su posicionamiento absoluto y la capacidad de expandirse hacia arriba; por contrato estructural aparece después de `module-map` y no puede cubrir los botones de navegación.
- Móvil conserva el acceso del encabezado y la hoja con margen inferior de 70 px sobre la navegación.

## Cobrar y pagar — doble bandeja vertical

- Se retiró el carrusel horizontal de pendientes.
- Por cobrar queda arriba y Por pagar abajo; ambas ocupan mitades iguales del alto mediante `grid-template-rows: minmax(0, 1fr) minmax(0, 1fr)`.
- Cada `.pending-lane-track` usa `overflow-y: auto`, `overflow-x: hidden`, `overscroll-behavior: contain` y su propio scrollbar; el contenedor base usa `overflow: hidden` para mantener resumen, selector y navegación estables.
- En anchos de 340 px o menos se compactan botones y acciones, conservando orden arriba/abajo y scroll independiente.

### Salida de solicitud

- Confirmar desde el reparto o “Enviar cobro” abre una vista previa separada, sin marco, header, navegación ni marca visual de YOL1/WhatsApp.
- El mensaje es ajustable e incluye monto, gasto, invitación y una URL `.example` renderizada como texto, no como enlace.
- La pantalla declara `DEMO · NO ENVIADO`; no abre WhatsApp, no usa el portapapeles, no conecta bancos ni inicia pagos.
- “Volver a YOL1” cierra solo la vista externa: el estado de `collectDraft`, incluyendo `step: 5`, sigue en el componente raíz y se conserva durante la sesión.
- Producción queda condicionada a consentimiento explícito, link generado server-side y partner de pagos autorizado; no se agregó integración.
- QA real `390×844`: el tablero mide 350×382 px y se divide en dos bandejas de 350×187 px, arriba/abajo, sin overflow horizontal. Al expandir Josefa y desplazar Por cobrar, su `scrollTop` cambió `0 → 16`, Por pagar quedó en `0`, el documento permaneció en `scrollY: 0` y la navegación en `y: 780`.
- QA real de vista externa `390×844` y `1440×1000`: no existen `.phone`, `.bottom-nav`, región `YOL1 — …` ni anchors; la URL ficticia no es navegable. “Volver a YOL1” devolvió a Cobrar y pagar con la misma selección de Josefa abierta. El flujo completo también conserva `collectDraft.step = 5` porque el preview vive en el componente raíz y no reinicializa el borrador.

## Iteración de feedback directo — 13 de agosto de 2026

- Inicio agranda “Tu plata, más simple” y muestra cinco pendientes sintéticos: cargo dudoso, por cobrar, por pagar, beneficio y gasto para dividir. Se retiró “Desliza para ver más”.
- “Pregúntale a YOL1” crece como interfaz y responde desde reglas de demo a seis tipos de pregunta; sigue sin IA ni audio reales.
- Finanzas recupera cartola general bajo las cuentas, métricas accionables y últimos movimientos densos; “Agregar banco/cartola” declara que no conecta ni carga nada.
- Cobrar y pagar separa bandejas verticales por cobrar/pagar, agrega aliases, recordatorios, conciliación ficticia y previews que niegan explícitamente envío, WhatsApp y pago reales.
- Ahorrar abre con `$0–$28.000` potenciales, agrega beneficio BCI ficticio, cuenta/servicio, Liguria para dividir, descarte lateral y compra simulada con confirmación.
- El gesto diagonal mantiene geometría común y cambia solo su acento semántico por módulo.

Verificación técnica: build Next.js/TypeScript exitoso; **6 tests, 6 aprobados, 0 fallidos**; `git diff --check` sin errores. La política del navegador integrado bloqueó la inspección automatizada de `localhost`, por lo que esta iteración no agrega una afirmación nueva de QA visual automatizada; la vista continúa disponible en `http://localhost:3000` para revisión directa de Felipe.

## Batch producto + tema dual — agosto 2026

Resultado funcional:

- Modo oscuro inicial y modo claro manual; ambos usan tokens de fondo, superficie, texto, borde, foco, selección, sombra y confirmación. La elección se guarda localmente y, sin elección previa, se respeta la preferencia del sistema.
- Inicio incluye propuesta de valor, carrusel “Tienes cosas por revisar”, acciones OK/Revisar/Dividir-Cobrar y chat financiero contextual de demo. El micrófono no graba.
- Mis Finanzas usa resultado mensual compacto, carrusel de fuentes, acceso a Cartola BCI/MACH y Cartola general; se retiraron hallazgos duplicados y el bloque “Cómo calculamos”.
- Cartola ofrece General/BCI/MACH, tabla densa, OK/Revisar/Dividir-Cobrar y asistente contextual con nota local.
- Cobrar y pagar muestra “me deben”/“le debo”, vistas por persona y grupo, un CTA Nuevo gasto y creación de contactos ficticios. El borrador se conserva al navegar durante la sesión.
- Las confirmaciones viven dentro del teléfono y son visibles en móvil.

QA interactiva:

- `390 × 844`, oscuro: Inicio, bandeja y chat sin overflow.
- `390 × 844`, claro: OK retira la tarjeta Disney y muestra confirmación visible sobre la navegación inferior.
- Chat: pregunta “¿A quién le debo?” devuelve respuesta contextual dentro de la app.
- Finanzas claro: dos fuentes en carrusel, cartola general disponible, sin “Cosas para revisar” ni “Cómo calculamos”.
- Cartola claro: General/BCI/MACH; Disney seleccionado muestra OK/Revisar/Dividir, evidencia y campo de nota.
- Cobrar y pagar claro: totales en ambos sentidos y selector por persona/grupo.
- Persistencia de sesión: se escribió “Cumple Josefa”, avanzó al paso 2, se navegó a Finanzas y al volver el paso 2 y el texto seguían disponibles.
- `1440 × 1000`, claro: siete módulos recorridos sin overflow horizontal de documento ni app.
- `1440 × 1000`, oscuro: Inicio completo inspeccionado; jerarquía, carrusel, chat y selector de tema visibles.

Verificación técnica del batch: build Next.js y TypeScript exitosos; **6 tests, 6 aprobados, 0 fallidos**.

## Iteración de acentos semánticos

Se aplicó la matriz aprobada sin cambiar journeys ni features:

- Inicio: Acid dominante; rosa limitado a un punto y una franja suave secundaria.
- Mis Finanzas: resultado, halo y ritmo gráfico en aqua/petróleo; coral solo en anomalía.
- Cartola: selección en aqua/navy; alertas permanecen coral.
- Cobrar/Repartir: neón suave `#FF8FB4` en personas y contexto social; CTAs en Acid.
- Ahorrar: Acid para valor/acción y amarillo para “cargo dudoso” por revisar.
- Ganar: rosa dominante y Acid editorial, sin agregar flujo.
- Experimentos: violeta suave en números, gesto y feedback seleccionado; el texto sigue negando roadmap.

QA exacta:

- `390 × 844`: Inicio, Finanzas, Cartola seleccionada, Cobrar, Ahorrar y Experimentos inspeccionados visualmente; sin overflow horizontal.
- `1440 × 1000`: los siete módulos recorridos; todos sin overflow horizontal interno ni de documento.
- Se corrigieron tintas transparentes que inicialmente se mezclaban con el chasis Night; los fondos finales usan tintas opacas suaves para conservar contraste.
- Contraste comprobado visualmente con texto Night sobre `#FF8FB4` y violeta; rosa no aparece en clases de alerta ni datos críticos.

## Iteración de Inicio — foco editorial

Inicio entra directo al ejemplo **“Dos cargos. Un minuto.”**. Se retiraron por completo “Explorar ejemplo”, “Simular con mi información”, el consentimiento introductorio y el banner largo. La pantalla conserva una única señal persistente, **“DATOS FICTICIOS”**, una acción protagonista —“Ver qué pasó”— y tres rutas secundarias.

La simplificación transversal retiró ayuda redundante de Inicio, Cartola y Ahorrar. Los guardrails permanecen junto a las decisiones materiales: “Simular banco/cartola”, regla de consolidación revisable, confirmación del link ficticio, WhatsApp demo, evidencia, certeza, acción reversible y disclosure comercial dentro de cada oportunidad.

QA de esta iteración:

- `1440 × 1000`: Inicio completo, sin overflow horizontal ni scroll interno; teléfono protagonista y jerarquía editorial legible.
- `390 × 844`: Inicio completo sin scroll ni overflow; CTA principal y navegación inferior visibles.
- Journey principal validado: Inicio → Ver qué pasó → Cartola con Disney+ seleccionado y acciones Revisar, Lo reconozco, Dividir y Crear solicitud de cobro.
- Mis Finanzas, Cobrar y Ahorrar revisados en móvil sin overflow; las acciones materiales mantienen el contexto de simulación.
- No se integró rosado ni se agregaron funcionalidades.

## QA visual responsive

Se recorrieron Inicio, Mis Finanzas, Cartola, Cobrar/Repartir, Ahorrar, Ganar y Experimentos en:

- Desktop: `1440 × 1000`.
- Móvil: `390 × 844`.

La revisión exacta en ambos viewports fue contrastada por Estrategia YOL1 y quedó **apta** después de dos correcciones menores: disclosure persistente “DATOS FICTICIOS” y retiro de una capability interna desde Experimentos. Se hizo además un barrido local adicional de los siete módulos con captura visual y comprobación de overflow.

También se recorrieron los estados interactivos críticos:

- Entrada directa al hallazgo ficticio desde Inicio.
- Cartola con movimiento abierto y acciones Revisar, Lo reconozco, Dividir y Crear solicitud de cobro.
- Cobrar/Repartir completo: gasto → participantes → montos distintos → confirmación → link demo → WhatsApp demo.
- Ahorrar con evidencia, fuente, certeza, estimación, acción reversible y disclosure.

Resultado:

- Sin overflow horizontal en desktop ni móvil.
- En desktop, el producto aparece como teléfono protagonista sobre una composición editorial Night; en móvil ocupa la superficie completa.
- Mis Finanzas y Experimentos usan scroll interno cuando el contenido excede la vista; el resto de las vistas base cabe sin overflow interno en ambos tamaños.
- Navegación inferior permanece visible y los CTAs mantienen contraste y jerarquía.
- Inicio, Finanzas y Ahorrar preservan evidencia, rango, autoridad recommend-only y acción reversible.

## Auditoría de CTAs

Se corrigieron los textos que podían parecer operativos:

- “Recuperar plata” → “Ordenar lo pendiente”.
- “Banco” → “Simular banco”.
- “Cartola” como acción de carga → “Simular cartola”.
- “COBRA” → “REPARTE”.
- “Revisar cobro” → “Revisar solicitud”.

Los estados de salida dicen expresamente “link demo”, “WhatsApp · Demo” y que no se abre, envía, cobra, conecta ni mueve dinero. “Cobrar” se conserva únicamente como nombre del módulo acordado; dentro del flujo se prepara una solicitud simulada y cada avance requiere confirmación.

El header de todos los módulos mantiene el disclosure corto **“DATOS FICTICIOS”**. En Experimentos se retiró “Propuestas sin GitHub” del teléfono por ser una capability interna del Lab; permanece documentada fuera de la experiencia B2C. “Comparar consumo anónimo” pasó a **“Comparar con referencias agregadas”**, condicionado a muestra suficiente y población comparable visible.

## Verificación técnica

Build ejecutado:

```bash
/Users/felipepies/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/next/dist/bin/next build --webpack
```

Resultado: compilación y TypeScript exitosos; `/` y `/_not-found` prerenderizados como contenido estático.

Pruebas ejecutadas:

```bash
/Users/felipepies/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/product-guardrails.test.mjs
```

Resultado: **4 tests, 4 aprobados, 0 fallidos**.

## Inventario exacto del cierre

Modificados:

- `PRODUCT-DESIGN.md`
- `README.md`
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `package-lock.json`
- `package.json`
- `pnpm-lock.yaml`

Agregados:

- `MVP-SPEC.md`
- `QA-CIERRE.md`
- `public/og.png`
- `public/yol1-icon.png`
- `public/yol1-life.jpg`
- `public/yol1-wordmark-dark.png`
- `tests/product-guardrails.test.mjs`

Retirados por pertenecer al starter reemplazado:

- `app/_sites-preview/SkeletonPreview.tsx`
- `app/_sites-preview/preview.css`
- `tests/rendered-html.test.mjs`

No se hizo commit, push ni publicación.

## Decisiones abiertas

1. Validar o descartar el hero actual; sigue siendo una preferencia reversible, no una propuesta validada.
2. Definir protocolo, muestra y umbrales para E2 comprensión, E3 acción voluntaria y E4 resultado/retorno.
3. Elegir qué hipótesis probar primero dentro del orden cargo dudoso → beneficio → recurrencia, sin convertirla todavía en wedge.
4. Definir qué fuente y consentimiento reales serían aceptables solo si una prueba futura justifica salir de la simulación.
5. Evaluar tipografía Söhne web cuando exista una licencia/entrega oficial; hoy se usa fallback sensato.

## Revisión local

Con el servidor de desarrollo activo, abrir `http://localhost:3000`. No se publicó ninguna URL nueva.
