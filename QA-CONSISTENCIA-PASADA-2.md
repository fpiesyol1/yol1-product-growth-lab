# QA de consistencia — pasada 2

**Fecha:** 14 de agosto de 2026  
**Alcance:** lectura de la implementación local actual (`/`, `/review` y flujos declarados). Sin cambios de código, datos ni publicación.  
**Criterio rector:** decisiones verbales de Felipe y `BRIEF-NOCHE-EJECUCION.md`.

## Resultado rápido

Hay avances claros: la barra superior ya no muestra el bloque “Portfolio YOL1”, Feedback es más explícito, Onboarding ya permite explorar antes de crear acceso y Reviews ya separa personas, decisiones y hallazgos de IA.

Quedan dos contradicciones directas con decisiones obligatorias: el chat puede quedar bloqueado esperando elegir modo cuando la IA está configurada, y la ficha técnica interna sigue visible desde el recorrido público. También queda un cierre diagonal en **Ganar**, pese a la instrucción de quitar todos los triángulos decorativos.

> Nota de método: esta pasada es estática. El navegador local no estuvo disponible para inspección visual automatizada; los hallazgos visuales se basan en el CSS y deben validarse en 390×844, 768×1024 y 1440×1000 antes de publicar.

## Comprobación de decisiones obligatorias

| Decisión | Estado actual | Veredicto |
|---|---|---|
| Sin triángulos/decoraciones de contraste al pie | `app-ganar` conserva un corte diagonal acid/rosa mediante gradiente. | **No cumple** |
| Feedback claro | Título “Deja tu feedback acá.”, selector Me gusta / Mejoraría / Idea y confirmación de destino local o compartido. | **Cumple con ajuste menor** |
| Ficha técnica no interna hacia público | La ficha incluye arquitectura candidata, fuentes, riesgos y preguntas abiertas debajo de pantallas públicas de Onboarding, Acompañante y Builder. | **No cumple** |
| Chat inmediato en demo | Si existe IA configurada y `aiChoice` está pendiente, se deshabilitan sugerencias, input y envío hasta elegir un modo. | **No cumple** |
| Valor antes de OTP | Onboarding permite “Explorar YOL1” antes de pedir teléfono/email; la creación de acceso queda ligada a activar una función. | **Cumple** |

## Hallazgos priorizados

### P0 — corregir antes de usar el Lab con personas externas

#### P0.1 El chat no entra siempre disponible en demostración

**Dónde:** Inicio → “Pregúntale a YOL1”.  
**Qué ocurre:** al existir configuración de IA, la primera visita queda con `aiChoice = pending`; los botones sugeridos y el campo quedan deshabilitados hasta que la persona elija “Usar IA” o “Seguir en demo”.  
**Por qué importa:** contradice la decisión de que el chat sea inmediato como demo; agrega una decisión de privacidad antes de entregar valor.  
**Criterio de cierre:** abrir Inicio y poder tocar una sugerencia o escribir una pregunta de ejemplo de inmediato. Solo después de querer usar datos personales o IA real, pedir consentimiento y explicar destino de datos.

#### P0.2 La ficha técnica expone operación interna en la experiencia pública

**Dónde:** al pie de Onboarding, Acompañante financiero y Construir mi propio producto.  
**Qué ocurre:** “Ficha de producto” muestra arquitectura, fuentes, KYC, licencias, riesgos, datos y preguntas abiertas en el mismo recorrido que vería una persona probando el producto.  
**Por qué importa:** la ficha es valiosa para ingeniería/PRD, pero no es una pantalla de producto ni una explicación útil para un visitante; mezcla audiencia pública con trabajo interno.  
**Criterio de cierre:** mover la ficha a `/review` o a un modo **Equipo** autenticado. En el producto público, dejar solo la experiencia y disclosures mínimos junto a acciones sensibles.

#### P0.3 El mensaje de “compartir” mantiene una ambigüedad operativa

**Dónde:** Cobrar y pagar → vista previa de mensaje.  
**Qué ocurre:** el botón “Ver cómo se compartiría” no comparte, pero el texto principal contiene una URL y lenguaje de pago.  
**Riesgo:** una persona puede interpretar que ya existe un enlace utilizable o que YOL1 inicia un cobro.  
**Criterio de cierre:** nombrar la acción **“Ver texto de ejemplo”** y mantener, arriba del texto, “No enviado · enlace de ejemplo”. Conservar el aviso de partner/consentimiento solo en detalle, sin convertirlo en una ficha legal larga.

### P1 — resolver en la siguiente iteración de UX/copy

#### P1.1 Quitar el último cierre diagonal de Ganar

**Dónde:** `app-ganar`.  
**Observación:** es el único cierre de pantalla que todavía usa un gradiente diagonal rosa/acid.  
**Recomendación:** reemplazarlo por una superficie plana semántica o por una textura/gesto no geométrico que no compita con contenido ni simule estado.

#### P1.2 Acompañante mezcla “ejemplo”, “demo” y “datos ficticios” en zonas que ya no requieren el aviso

**Dónde:** Resultado del mes, fuentes de Finanzas, Mi banco, asistente de Cartola, mensaje y flujo de reparto.  
**Problema:** los avisos son necesarios cerca de identidad, enlaces, pagos, banco o acciones materiales; repetidos dentro de contenido de lectura reducen realismo y jerarquía.  
**Recomendación:** usar una sola fórmula: **“Ejemplo: no se mueve plata.”** cerca de acción sensible. Eliminar “demo local”, “datos ficticios” y “simulación” cuando solo describen datos de una pantalla.

#### P1.3 La promesa editorial y la navegación compiten en el lateral

**Dónde:** Acompañante financiero, escritorio.  
**Qué ocurre:** “Tu plata, más clara”, descripción extensa y Feedback compiten por ser el primer punto de lectura; además la navegación principal vive dentro del teléfono.  
**Recomendación:** conservar el titular editorial, pero reducir la descripción a una sola línea y dejar que Feedback sea la única pieza funcional lateral. La navegación de producto ya está correctamente arriba.

#### P1.4 Acciones de movimientos no usan el vocabulario canónico

**Dónde:** Cartola y tarjetas del Inicio.  
**Qué ocurre:** coexisten “Ya lo vi”, “Ignorar”, “Revisar”, “Dividir”, “Cobrar”, “Pagar” y “Preparar reparto”.  
**Recomendación:**

| Intención | Etiqueta canónica |
|---|---|
| Ocultar una sugerencia | **Ignorar** |
| Abrir evidencia/notas | **Revisar** |
| Preparar una división | **Preparar reparto** |
| Preparar una solicitud | **Preparar cobro** |
| Preparar respuesta a solicitud | **Preparar pago** |
| Cerrar un pendiente confirmado | **Marcar como resuelto** |

No mostrar las tres acciones por defecto: cada fila debe exponer solo las que correspondan a su evidencia.

#### P1.5 “En pausa”, “No publicado” y “Publicado” requieren una semántica estable

**Dónde:** selector superior y estados vacíos.  
**Qué ocurre:** Onboarding y Builder se marcan PUBLICADO pero todavía exponen pasos de investigación, guías y preguntas abiertas; otros espacios hablan de “en pausa” o “no publicado”.  
**Recomendación:** para la audiencia externa usar solo:

- **Disponible para explorar**: se puede probar como prototipo.
- **En investigación**: no hay flujo para probar.
- **En revisión**: hay un borrador restringido al equipo.

Reservar “publicado” para algo oficialmente accesible; no usar “en pausa” como estado de producto público.

#### P1.6 Reviews: el Kanban está visible, pero no está estructurado como tablero

**Dónde:** `/review`, feedback de personas.  
**Qué ocurre:** los cinco estados aparecen como leyenda y las tarjetas son una sola lista; no se ve a qué columna pertenece cada ítem ni hay una vista por tema/destino en esta pantalla.  
**Recomendación:** filtros y agrupación reales por estado, más una pestaña **Por tema**. Al convertir, solicitar destino: **mejora**, **guía Markdown** o **proyecto**. Mantener IA separada y al final.

#### P1.7 Onboarding aún necesita salidas de excepción visibles

**Dónde:** crear pre-registro → OTP → Mi banco.  
**Qué ocurre:** el happy path está más alineado, pero OTP solo permite avanzar con seis dígitos o usar un código de ejemplo; Mi banco no ofrece estados de timeout, rechazo, revisión humana, pérdida de teléfono o documento no legible.  
**Recomendación:** diseñar estados, no solo mensajes: **código vencido**, **reenviar**, **cambiar canal**, **revisión pendiente**, **necesito ayuda**. El paso RUT/serie/biometría debe declarar qué desbloquea antes de pedirlo.

#### P1.8 El Builder sigue mostrando una demostración que parece sincronización automática

**Dónde:** Construir mi propio producto → “Cómo ocupar”.  
**Qué ocurre:** animación “Contexto YOL1 leído” + “Vista previa” muestra un resultado dentro del Lab, mientras la instalación declara endpoint de solo lectura y no hay callback de propuestas.  
**Recomendación:** rotular la animación **“Así podría verse una propuesta”** y separar en tres pasos explícitos: conversar fuera de YOL1 → copiar resumen → enviar propuesta al Lab. No mostrar una pantalla “creada” como resultado real hasta tener almacenamiento y retorno autenticado.

### P2 — accesibilidad, mantenibilidad y próximos controles

#### P2.1 Estados no deben depender solo de color

La aplicación usa color para alerta, selección, disponibilidad y tipos de feedback. Ya hay labels en varios casos; comprobar que cada estado conserve texto o icono con nombre accesible en desktop, móvil y modo claro.

#### P2.2 Evitar scrolls encadenados sin un propósito claro

Hay scroll de aplicación, listas internas (Cartola/Cobrar) y, en móvil, hoja de Feedback. Validar con touch y teclado que cada panel tome el gesto solo cuando tiene contenido sobrante y que se pueda volver a la navegación inferior sin quedar atrapado.

#### P2.3 El copy de estados vacíos necesita una política de tono

Los estados editoriales son entretenidos, pero algunos hablan de Felipe y otros de “no promesa”, “no capacidad” o “producto no listo”. Para que la broma no opaque la información, usar la secuencia: **qué falta** → **una línea juguetona** → **qué puede hacer la persona ahora** (volver arriba o dejar una idea), sin claims de producto.

#### P2.4 El inspector de eventos dejó CSS residual

El DOM actual ya no muestra el inspector superior, pero `app/globals.css` conserva reglas para `.portfolio-heading` y `.event-inspector`. No altera el flujo, pero es deuda de mantenimiento y puede reintroducir componentes descartados por error.

## Recorridos mínimos que no deben quedar muertos

| Recorrido | Resultado visible esperado |
|---|---|
| Inicio → sugerencia → Ignorar | Tarjeta desaparece; aparece confirmación y opción Deshacer. |
| Inicio → sugerencia → Revisar | Llega a Cartola con movimiento seleccionado y evidencia legible. |
| Inicio → cobrar/pagar | Llega a persona/grupo correcto y deja claro que preparar no es cobrar ni pagar. |
| Inicio → Preguntar | Demo responde sin configurar IA; luego se puede optar por IA con consentimiento. |
| Onboarding → Explorar YOL1 | Llega al Acompañante sin teléfono, email u OTP. |
| Onboarding → Activar función → OTP | Explica propósito y desbloqueo; ofrece volver/cambiar canal/ayuda ante fallo. |
| Mi banco → identidad | Antes de RUT/serie/biometría explica capacidad, datos requeridos y alternativa si no se puede completar. |
| Builder → instalar → prompt | Copia URL y prompt por separado; no promete que el chat externo se leerá ni se sincronizará solo. |
| Builder → Enviar proyecto | Confirma si quedó compartido, local o falló; no crea branch ni publica automáticamente. |
| Feedback → Review | En modo compartido aparece con producto, pantalla, tipo, fecha y estado; en modo local lo declara inequívocamente. |

## Checklist de próxima pasada

- [ ] Abrir en 390×844, 768×1024 y 1440×1000; revisar sin overflow horizontal.
- [ ] Probar teclado: foco visible, orden lógico, Escape/cierre de menú y hoja de feedback.
- [ ] Cambiar claro/oscuro y verificar contraste de texto pequeño, bordes y acciones deshabilitadas.
- [ ] Probar el chat sin IA configurada y con IA configurada: debe entregar demo inmediata en ambos casos.
- [ ] Recorrer Onboarding sin identidad hasta explorar; luego forzar error/timeout de OTP y ruta de ayuda.
- [ ] Revisar que ninguna acción se presente como pago, cobro, transferencia, conexión bancaria o KYC real.
- [ ] Enviar feedback desde otro navegador y confirmar si Review lo muestra como compartido o declara que quedó local.
- [ ] Confirmar que la ficha PRD se ve solo con acceso de equipo y no en el flujo público.
- [ ] Verificar que Remesas permanece sin prototipo y que Home Banking/Tarjetas no prometen capacidades no autorizadas.

## Orden recomendado

1. Corregir P0.1 y P0.2: demo inmediata y separación público/equipo.
2. Eliminar la diagonal de Ganar y aplicar el glosario de acciones.
3. Convertir Reviews en tablero real por estado/tema, sin mezclar IA.
4. Diseñar estados de excepción de Onboarding/Mi banco.
5. Hacer QA visual e interactivo completo antes de un nuevo push.
