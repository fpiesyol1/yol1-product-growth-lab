# Brief de ejecución nocturna — YOL1 Product Growth Lab

**Estado:** ejecución local en curso. Sin publicación nueva.
**Prioridad de fuentes:** decisión verbal de Felipe > decisiones aprobadas > material de proyectos/Notion > referencias externas.

## 1. Cambios transversales al Lab

- Quitar el bloque “Portafolio YOL1” y usar el ancho superior para las pestañas de producto.
- Mantener el bloque editorial “Tu plata, más clara”.
- Quitar los botones intermedios entre el editorial y Feedback.
- Dar mayor presencia a Feedback.
- Quitar la banda superior duplicada de eventos.
- Quitar referencias públicas a propuesta técnica interna, analítica, revisión de Felipe, contradicciones o estado del Lab que no correspondan a público.
- Quitar etiquetas repetidas de ejemplos/datos ficticios donde no aporten al flujo.
- Quitar los triángulos decorativos de contraste al pie de las pantallas.

## 2. Acompañante financiero / Análisis financiero

- Mantener orden: resultado del mes → cuentas conectadas → cuatro cifras → últimos movimientos.
- Reducir el espacio de cuentas conectadas y aumentar protagonismo de las cuatro cifras.
- Subir “Últimos movimientos” y habilitar scroll interno para la lista.
- Eliminar bloque final de ejemplo/conexión simulada para ganar realismo y espacio.
- Mantener Mi banco y Ganar como secciones que se desarrollarán después.

## 3. Onboarding y KYC progresivo

- Hacer investigación profunda de onboarding en Revolut, Monzo y referentes actuales.
- Cruzar con material local de Notion/proyectos, KYC progresivo y contexto Chile.
- Diseñar un flujo simple y guiado, con acceso gradual gobernado por una capacidad aprobada. KYC y licencias pueden ser requisitos, pero no desbloquean nada por sí solos: también se necesitan vehículo, contrato, controles y operación aprobados.
- No asumir regulación: marcar como “por validar” lo que no esté respaldado.

## 4. Home Banking

- Investigar Monzo, Nubank y evolución del inicio bancario.
- Evitar una góndola de productos; explorar inicio adaptativo y agéntico.
- Explorar interacción principal distinta a chat convencional: audio, atajos contextuales u otra alternativa.
- Integrar salud financiera como señal útil, no como adorno.

## 5. Tarjetas

- Investigar tendencias de tarjeta digital y comportamiento de compra.
- Tratar Tarjetas como ecosistema transaccional, no solo plástico.
- Explorar acceso rápido y seguro a datos de tarjeta, QR, NFC, beneficios contextuales y relación con gastos/deudas.
- Investigar uso compartido y corporativo con restricciones, sujeto a viabilidad regulatoria chilena y partners.

## 6. Remesas

- Fuera de alcance hasta nueva instrucción de Felipe.
- No investigar, definir, diseñar ni prototipar en este ciclo.

## 7. Construir mi propio producto

- Titular: “En este espacio, el próximo producto lo construyes tú”.
- Invitación explícita a trabajar con ChatGPT o Claude para construir un producto YOL1.
- Mantener gesto visual; quitar “MCP próximamente”.
- Pantalla principal: “Acá irás viendo tus experimentos”.
- Mostrar instrucciones simples para conectar ChatGPT o Claude, con URL visible y botón copiar en el mismo paso.
- Reescribir prompt inicial para que la IA haga preguntas guiadas antes de pedir una idea cerrada.
- Verificar que conversación, experimento y propuesta queden almacenados y entendibles.

## 8. Bandeja de aprendizaje / Reviews

- No usar una clave débil en un entorno publicado. Para desarrollo local puede haber acceso simple; la bandeja compartida debe usar secreto largo o acceso temporal administrado.
- Reordenar en tres secciones:
  1. Feedback de personas: primero; dejar claro producto/pantalla/tipo de feedback y estados Kanban (nuevo, en revisión, guardar para después, resuelto, ignorado).
  2. Conflictos de fuentes: más compacto, ejemplos concretos, botones de decisión se mantienen.
  3. Hallazgos de IA: al final, ordenables por tema y convertibles en material útil.
- Crear vista por tema para convertir feedback en mejora, documentación, guía Markdown o proyecto.

## 9. QA nocturno (después de la definición de producto)

- Revisar caminos principales y alternativos en local.
- Detectar botones muertos, duplicación, pasos ambiguos, problemas responsive y riesgos de confianza/datos/KYC.
- Reportar hallazgos priorizados y aplicar solo correcciones que respeten las decisiones confirmadas; nunca publicar de forma autónoma.
- Documentar oportunidades de mejora y decisiones requeridas.

## 10. Dirección de producto confirmada por Felipe

### Onboarding y KYC progresivo

La persona recibe valor antes de identificarse: puede explorar, conversar con el asistente y entender cómo conectaría banco o cartola. Se solicita teléfono/email con OTP y se completa información solo cuando quiere **preparar una acción material**, por ejemplo transferir o recibir dinero. KYC puede ser un requisito progresivo de una capacidad aprobada, pero nunca la habilita por sí solo: también requiere vehículo, contrato, controles y operación aprobados.

### Acompañante financiero

El hábito nace de dos trabajos unidos: leer/ordenar las finanzas y manejar lo que debe o le deben. Debe evolucionar hacia una alternativa social y cotidiana a Splitwise, donde ordenar, cobrar, pagar, mover dinero con una cuenta secundaria y encontrar oportunidades de “Ganar” se relacionan, sin prometer ejecución real antes de tener partners, permisos y decisiones aprobadas.

### Home Banking

El inicio debe responder “¿cómo me sirven mis finanzas hoy?”, no exhibir un catálogo bancario. La experiencia se adapta al momento del mes, compromisos próximos, patrones y recordatorios útiles: arriendo, servicios, cobros reactivados o deudas pendientes. La contextualización es la propuesta central.

### Tarjetas

La sección se abre en el momento de pagar, buscar datos de tarjeta o revisar un movimiento. Debe ofrecer acceso rápido a datos/QR, último movimiento y señales para revisar, ignorar o actuar. Los beneficios aparecen conectados al contexto de compra para hacer la opción más conveniente, no como catálogo aislado.

### Remesas

Fuera de alcance por ahora. No investigar ni prototipar en el ciclo inmediato salvo que Felipe lo reactive.

### Construir mi propio producto

La persona debe llegar rápido a una primera versión visual basada en el design system, no solo a una conversación. La IA hace preguntas concretas, propone alternativas y pide referencias visuales/bocetos cuando ayudan. La iteración inicial privilegia velocidad y claridad sobre fidelidad perfecta; cada cambio visible fortalece la sensación de avance.

## 11. Síntesis de las tres auditorías

### P0 — ya incorporado o en ejecución local

- **Onboarding:** valor exploratorio antes de teléfono/email y OTP; el pre-registro aparece al intentar activar una capacidad. Falta aún diseñar los estados de error, timeout, revisión y salida a Customer Success para una versión operativa.
- **Reviews:** se separan feedback de personas, decisiones de fuentes y hallazgos IA; los estados editoriales pasan a Nuevo, En revisión, Guardar para después, Resuelto e Ignorado. El destino `mejora / guía Markdown / proyecto` sigue siendo una decisión aparte. La bandeja debe decir siempre si está compartida o solo local.
- **Builder:** el MCP actual entrega contexto y briefs; no sincroniza pantallas ni lee conversaciones. El copy debe prometer guía y envío a revisión, nunca materialización automática.
- **Datos sensibles:** OTP, RUT, serie, biometría, PAN/CVV, credenciales y texto financiero o conversacional crudo no entran a analytics.

### P1 — estándar para las fichas de producto

- Cada pantalla necesita: objetivo, happy path, errores/salidas, datos a guardar y consultar, fuente de verdad, consentimiento, arquitectura candidata, evento con contrato, riesgo y métrica.
- Eventos: `objeto_accion` en pasado, con `event_id`, `event_at`, `anonymous_id` o `user_id` interno, sesión, producto, pantalla, versión, plataforma, origen y consentimiento analítico. Nunca incluir PII ni credenciales en el nombre o propiedades.
- Arquitectura propuesta para validar con ingeniería: React Native/Expo → BFF/API Gateway → servicios por dominio → datos transaccionales, eventos internos y observabilidad AWS. Cognito resuelve acceso/OTP, no deduplicación canónica ni KYC completo.

### P2 — investigación que guía los siguientes diseños

- **Acompañante:** probar primero el loop cartola + cobrar/pagar, no dashboards decorativos.
- **Home Banking:** validar momentos contextuales antes de un chat persistente o catálogo de productos.
- **Tarjetas:** elegir primero una intención dominante (pagar, ver datos, revisar movimiento o beneficio) y no declarar QR/NFC/emisión/listo sin partner, esquema, permiso y validación.
- **Remesas:** fuera de alcance hasta nueva instrucción.

## 12. Verificación nocturna

- El chat de Inicio entra desde el primer render en modo demostración cuando no hay IA configurada; no debe quedar bloqueado esperando una comprobación de servidor.
- La navegación local y las vistas `/`, `/review` y `/review/knowledge` responden por IPv6 en `http://[::1]:3000` cuando el alias `localhost` no resuelve en el entorno.
- Cada pasada nocturna ejecuta el ciclo técnico/PRD, producto/GTM y consistencia definido en `QA-CICLO-TRIPLE.md`; no publica ni activa integraciones.

## 13. Cierre de revisión nocturna — 14 de agosto de 2026, 01:52 CLT

**Alcance ejecutado:** cruce de dirección canónica, brief, PRD de Onboarding/KYC, QA triple, informes QA vigentes e implementación local. Se preservó el trabajo concurrente de Tarjetas y Builder; no hubo commit, push, despliegue, secretos ni integraciones externas.

### Mejoras locales reversibles aplicadas

- La ficha/inspector técnico dejó de renderizarse en la experiencia pública. Eventos, arquitectura, fuentes, KYC, licencias, riesgos y preguntas siguen disponibles en código, PRD y documentos internos.
- El selector público reemplaza `PUBLICADO / NO PUBLICADO / EN PAUSA` por `PARA EXPLORAR / EN INVESTIGACIÓN`; Onboarding, Acompañante y Builder usan promesas editoriales propias.
- El chat conserva demo utilizable por defecto incluso cuando el servidor informa que existe IA; elegir IA queda como acción posterior y consentida.
- Inicio, Cartola y Cobrar/Pagar distinguen `Preparar reparto`, `Preparar cobro`, `Preparar pago`, `Marcar revisado` y `Marcar como resuelto`. Disney+ y transferencias propias ya no muestran una tercera acción social sin evidencia.
- La vista previa usa `Texto de ejemplo · no enviado`, sin invitación a pagar por banco ni descargar YOL1; no contiene links navegables ni abre otras apps.
- Mi banco aclara que RUT, serie y biometría dependen de una capacidad, partner y fundamento aprobados; biometría ofrece retorno y deja explícita la futura ruta humana.
- Remesas queda neutral y pausado: no se investiga, diseña ni prototipa durante este ciclo.
- Se retiró el gradiente diagonal residual de Ganar y CSS del inspector/encabezado de portfolio que ya no tenía markup.
- `README.md`, `MVP-SPEC.md` y guardrails se sincronizaron con el lenguaje y fronteras actuales.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; rutas `/`, `/review`, `/review/knowledge`, `/api/chat`, `/api/feedback` y `/api/mcp` generadas.
- Tests: **41/41 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- QA interactivo en `http://[::1]:3000`: chat demo inmediato; Onboarding → Explorar sin OTP; Cobrar/Pagar → vista previa → volver; Reviews con Personas/Decisiones/IA; Conocimiento accesible.
- Responsive: **390×844** y **1440×1000** sin overflow horizontal; Feedback móvil queda entre header y navegación; la ficha interna no aparece en público.
- Lint global: **no cierra** por deuda preexistente fuera de esta corrección (`setState` síncrono en efectos, anchors internos, `@ts-nocheck` y warnings de imágenes/variables). No se amplió el alcance para refactorizarla.

### Preguntas abiertas / decisiones requeridas

1. **Tarjetas:** decidir si el borrador navegable `En investigación · Borrador local` puede seguir accesible desde el selector público o debe pasar a modo Equipo. Hoy los guardrails niegan capacidades reales, pero el recorrido de cuatro vistas puede percibirse como más que research.
2. **Onboarding:** elegir la primera acción material concreta y aprobada que justifica crear pre-registro; `Quiero activar una función` sigue siendo un gate abstracto hasta contar con `capability_key`, partner/legal state y consentimiento.
3. **Excepciones de identidad:** definir dueño, canal y SLA de Customer Success para OTP no recibido/expirado, pérdida de teléfono, KYC en revisión, rechazo o proveedor no disponible.
4. **Reviews:** definir vista Por tema y separar estado `Resuelto` del destino editorial `mejora / guía Markdown / proyecto`.
5. **QA compartido:** repetir el smoke test entre navegadores cuando exista Postgres + token largo; esta pasada verificó el modo local explícito y no configuró secretos.

## 14. Seguimiento de revisión nocturna — 14 de agosto de 2026, 02:41 CLT

**Alcance ejecutado:** revisión incremental de cambios posteriores al cierre 01:52, cruce con PRD de Onboarding/KYC, QA triple e informes QA. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 nuevo. Onboarding conserva valor antes de identidad, explica el gate antes del OTP, no captura RUT/serie/biometría y no infiere capacidades desde KYC.
- El gate abstracto ya fue reemplazado en la demo por dos intenciones trazables: `financial_data_connect` y `receive_value`. Esto resuelve la ambigüedad del recorrido local, pero **no** aprueba ninguna como primera capacidad operativa.
- La matriz, máquina de estados, persistencia mínima, normalización KYC, handoff y ledger local mantienen separados pre-registro, control de canal, identidad, consentimiento y capacidad.
- La documentación de eventos conserva una inconsistencia pendiente: el brief/PRD usa `event_at`, mientras `QA-CICLO-TRIPLE.md` y parte del contrato interno todavía usan `timestamp`.

### Mejoras locales reversibles aplicadas

- Borrar el pre-registro desde `Accesos y permisos` ahora remonta Onboarding y limpia también contacto, OTP, intentos y estados transitorios en memoria; antes eliminaba `localStorage`, pero el contacto podía reaparecer al retomar el flujo en la misma sesión.
- Builder ya no falla silenciosamente cuando el navegador bloquea el portapapeles: URL y prompt muestran una alternativa visible para seleccionar y copiar manualmente.
- Se agregaron guardrails para la reversa completa de Onboarding y los estados de error de copiado.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; rutas `/`, `/review`, `/review/knowledge`, `/api/chat`, `/api/feedback` y `/api/mcp` generadas.
- Tests: **75/75 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- QA interactivo sobre la build actual en puerto temporal `3001`: pre-registro → ledger → borrar → Bienvenida → retomar; contacto vacío confirmado.
- Builder: copiado de prompt confirmado con estado visible.
- Responsive: **390×844** y **1440×1000** sin overflow horizontal; consola: **0 errores**. El servidor temporal se detuvo al terminar.

### Preguntas abiertas / decisiones requeridas, actualizadas

1. **Tarjetas:** decidir si el borrador navegable en investigación sigue accesible desde el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo solo compara gates y no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y separar estado `Resuelto` del destino `mejora / guía Markdown / proyecto`.
5. **Eventos:** resolver `event_at` versus `timestamp` como clave canónica y alinear PRD, QA, catálogo y pruebas.
6. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 15. Revisión nocturna incremental — 14 de agosto de 2026, 03:42 CLT

**Alcance ejecutado:** pasada de producto/PRD, consistencia y flujos sobre el brief, PRD de Onboarding/KYC, QA triple, informes QA vigentes, implementación y guardrails locales. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 nuevo. Onboarding mantiene exploración antes de identidad, explica una intención concreta antes del OTP y no deriva capacidades desde KYC. Tarjetas conserva datos ficticios, acceso deliberado y reversa; ninguna rama afirma emisión, pago o beneficio operativo.
- Se cerró la inconsistencia `event_at` versus `timestamp`: ficha interna, PRD, estándar QA, ciclo triple e informes activos usan ahora el contrato canónico `event_id`, `event_at`, identificador permitido, `session_id`, `product_key`, `screen_key`, `action_key`, versiones, plataforma, origen, consentimiento y correlación cuando aplique.
- Reviews separa el estado humano `Resuelto` del destino editorial. Marcar un feedback como resuelto ya no afirma que fue convertido en mejora, guía o proyecto.

### Mejoras locales reversibles aplicadas

- `eventMetadata` dejó las llaves traducidas/ambiguas y genera metadata canónica estable; `screen_key` se normaliza sin depender del copy visible y `action_key` se deriva del evento, no del botón.
- Se sincronizaron `PRD-ONBOARDING-KYC-PROGRESIVO.md`, `ESTANDAR-QA-TECNICO-PRD.md`, `QA-CICLO-TRIPLE.md` y los checklists/informes de QA que todavía usaban `timestamp`, `occurred_at`, `product_id` o nombres traducidos.
- Reviews reemplazó `Convertido / Convertir` por `Resuelto / Marcar resuelto`; la decisión de destino editorial permanece abierta y no se simuló una orquestación.
- Se actualizaron guardrails para bloquear regresiones de metadata y la mezcla entre estado y destino editorial.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; rutas `/`, `/review`, `/review/knowledge`, `/api/chat`, `/api/feedback` y `/api/mcp` generadas.
- Guardrails focalizados de contratos, Onboarding, Tarjetas y Reviews: **72/72 PASS**.
- Suite completa: **75/75 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- Revisión estática de flujos: sin nuevos botones muertos ni promesas operativas en Onboarding, Mi banco/KYC, Tarjetas, Builder o Reviews. Esta pasada no repitió QA visual de navegador porque no cambió layout ni navegación.

### Preguntas abiertas / decisiones requeridas, actualizadas

1. **Tarjetas:** decidir si el borrador navegable en investigación sigue accesible desde el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

### Registro posterior de revisión — 15 de agosto de 2026, 01:42 CLT

**Alcance ejecutado:** pasada incremental de QA de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación y guardrails. No hubo archivos de producto posteriores al cierre 00:18; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Onboarding conserva valor antes de identidad, acción material y explicación antes del OTP, y separación entre pre-registro, KYC y capacidad. Tarjetas y Home Banking siguen sin flujo público; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- Se detectó un P2 documental acotado: `TABLERO-NOCHE.md`, una fuente activa de coordinación, todavía describía el entregable de Tarjetas como `borrador local no publicado`, aunque la taxonomía vigente y el runtime ya usan `En investigación` y `explorable/research`.
- El texto no se renderizaba en la experiencia pública ni modificaba disponibilidad, journeys o capacidades. Los informes QA históricos y sus referencias de época se conservaron intactos.

### Mejoras locales reversibles aplicadas

- El tablero nocturno describe ahora Tarjetas como `borrador local en investigación`, sin inferir publicación operativa.
- El guardrail documental comprueba esa taxonomía y bloquea el regreso de `borrador local no publicado` en el tablero activo.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El primer intento de build quedó bloqueado por escritura de `.next`; pasó al repetir con permiso de escritura sobre el directorio solicitado. No fue una falla del producto.
- No se repitió QA visual interactivo porque la corrección sólo cambia coordinación documental y un guardrail; no modifica DOM renderizado, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 16. Revisión nocturna incremental — 14 de agosto de 2026, 04:42 CLT

**Alcance ejecutado:** nueva pasada de producto/PRD, consistencia y flujos sobre los documentos canónicos, informes QA, implementación y guardrails locales. Se revisaron sólo cambios posteriores al cierre 03:42. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 nuevo. Onboarding mantiene valor antes de identidad, gates concretos antes de OTP y separación entre pre-registro, control de canal, KYC y capacidad. Reviews conserva `Resuelto` como estado independiente del destino editorial.
- Se encontró un P1 de confianza en Tarjetas: la vista decía que los datos ficticios se ocultarían al salir, pero la navegación inferior conservaba el estado revelado al volver a Datos.
- El hallazgo no cambia la decisión de producto sobre Tarjetas: el borrador continúa marcado `En investigación · Borrador local`, sin emisión, pago, beneficio operativo ni integración.

### Mejora local reversible aplicada

- La vista protegida de Tarjetas ahora vive en un componente de ciclo corto: al salir de Datos se desmonta su estado sensible de demostración y, al volver, tarjeta y CVV reaparecen enmascarados. El resto de la exploración de Tarjetas conserva su estado.
- Se agregó un guardrail focalizado que exige que Datos use esa vista aislada, evitando que una refactorización vuelva a persistir el estado revelado entre pantallas.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; rutas `/`, `/review`, `/review/knowledge`, `/api/chat`, `/api/feedback` y `/api/mcp` generadas.
- Suite completa: **75/75 PASS**, 0 fallidos.
- ESLint focalizado sobre `app/cards-discovery.tsx`: **PASS**.
- `git diff --check`: **PASS**.
- QA interactivo en `http://[::1]:3002`: Datos → revelar ejemplo → Movimiento → Datos; número ficticio ausente al volver, máscara visible y **0 errores de consola**. El servidor temporal se detuvo al terminar.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si el borrador navegable en investigación sigue accesible desde el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 17. Revisión nocturna incremental — 14 de agosto de 2026, 05:47 CLT

**Alcance ejecutado:** pasada de regresión sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación y guardrails locales. No hubo cambios de entrada posteriores al cierre 04:42. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Onboarding conserva valor antes de identidad, explicación del gate antes de OTP, pre-registro separado de KYC/capacidad y fallback seguro para estados desconocidos.
- Tarjetas vuelve a enmascarar número y CVV ficticios al salir de Datos y regresar; el borrador sigue marcado como investigación y no promete una operación real.
- Reviews mantiene separadas Personas, Decisiones e IA y declara correctamente el modo local. Se encontró un P2 de consistencia: la Bandeja leía el tema compartido del Lab, pero no guardaba el cambio hecho desde su propio botón.

### Mejora local reversible aplicada

- El selector de tema de `/review` ahora persiste la preferencia en la misma clave local que el Lab y `/review/knowledge`; recargar o navegar entre ambas vistas internas conserva el modo elegido.
- Se agregó un guardrail focalizado para exigir que la Bandeja use el handler persistente y no vuelva a un cambio sólo en memoria.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; rutas `/`, `/review`, `/review/knowledge`, `/api/chat`, `/api/feedback` y `/api/mcp` generadas.
- Guardrails focalizados de producto/Reviews: **19/19 PASS**.
- Suite completa: **75/75 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- QA interactivo en `http://[::1]:3003`: Onboarding `receive_value` → gate → OTP demo → E2 → handoff → estado KYC desconocido; Tarjetas Datos → revelar → Movimiento → Datos enmascarados; Reviews en modo local con Personas/Decisiones/IA.
- Responsive: **390×844** y **1440×1000** sin overflow horizontal del documento. Tema de Reviews: oscuro → claro → recarga → Conocimiento conserva claro. Consola: **0 errores y 0 warnings**. El servidor temporal se detuvo al terminar.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si el borrador navegable en investigación sigue accesible desde el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 18. Revisión nocturna incremental — 14 de agosto de 2026, 06:43 CLT

**Alcance ejecutado:** pasada de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación y guardrails locales. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Los journeys implementados mantienen valor antes de identidad, intención material y explicación antes del OTP, pre-registro separado de KYC/capacidad, Tarjetas como investigación y Reviews en tres capas con modo local explícito.
- Se encontraron dos P2 documentales en fuentes activas: `README.md` todavía usaba `Convertido` para el Kanban de Reviews, y `MVP-SPEC.md` decía que Mi banco pedía RUT, serie y biometría al activar una función. Ambas frases contradecían el PRD, la UI y los guardrails vigentes.
- Los informes QA históricos conservan el estado observado en su momento; no se reescribieron hallazgos antiguos para aparentar que siempre estuvieron resueltos.

### Mejoras locales reversibles aplicadas

- El recorrido de QA del README usa ahora los estados reales `Nuevo`, `En revisión`, `Para después`, `Resuelto` e `Ignorado`.
- La especificación MVP declara que Mi banco recibe una intención material concreta después del pre-registro y sólo explica requisitos posibles; la demo no pide RUT, número de serie, biometría ni documentos, y KYC no habilita dinero por inferencia.
- Se agregaron guardrails documentales para bloquear regresiones de ambos contratos.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; rutas `/`, `/review`, `/review/knowledge`, `/api/chat`, `/api/feedback` y `/api/mcp` generadas.
- Suite completa: **75/75 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El build usó el fallback SWC WASM porque el binario nativo presente tiene una firma de Team ID incompatible con el runtime de Codex; el fallback compiló, validó TypeScript y generó todas las rutas correctamente.
- No se repitió QA visual interactivo: no cambió runtime, layout ni navegación; la regresión de flujos quedó cubierta por revisión estática, build y guardrails.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si el borrador navegable en investigación sigue accesible desde el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 19. Revisión nocturna incremental — 14 de agosto de 2026, 07:43 CLT

**Alcance ejecutado:** regresión de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación y guardrails locales. No hubo archivos de entrada posteriores al cierre 06:43. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Los journeys y límites operativos mantienen valor antes de identidad, explicación de intención antes de OTP, KYC separado de capacidad, Tarjetas como investigación y Reviews en modo local explícito.
- Se encontraron dos P2 documentales en fuentes activas: el discovery de Home Banking conservaba `occurred_at` y nombres traducidos para la metadata común, y el research de Tarjetas pedía `NO PUBLICADO` como rótulo de portfolio aunque la taxonomía pública vigente usa `En investigación`.
- Los informes QA históricos se conservaron sin reescritura; sus hallazgos siguen representando el estado observado en cada pasada.

### Mejoras locales reversibles aplicadas

- `DISCOVERY-HOME-BANKING-TARJETAS.md` usa ahora el contrato común canónico con `event_at`, llaves estables y propiedades específicas minimizadas.
- `RESEARCH-TARJETAS-YOL1-2026-08-14.md` separa el estado interno `published: false` del copy público `En investigación · Borrador local`; la decisión de dejar Tarjetas accesible o moverla a Equipo continúa abierta.
- Se ampliaron los guardrails técnicos/documentales para bloquear el regreso de `occurred_at` y `NO PUBLICADO` como copy público.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; rutas `/`, `/review`, `/review/knowledge`, `/api/chat`, `/api/feedback` y `/api/mcp` generadas.
- Suite completa: **75/75 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- No se repitió QA visual interactivo porque no cambió runtime, layout ni navegación.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si el borrador navegable en investigación sigue accesible desde el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 20. Revisión nocturna incremental — 14 de agosto de 2026, 08:48 CLT

**Alcance ejecutado:** pasada de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación y guardrails locales. No hubo archivos de entrada posteriores al cierre real 07:46. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Onboarding conserva valor antes de identidad, intención y explicación antes del OTP, pre-registro separado de KYC/capacidad y fallback seguro; Tarjetas sigue como investigación explícita y Reviews declara el modo local.
- Se encontró un P2 de contrato analítico: el selector emitía `portfolio.<producto>.select`, mezclando `product_key` dentro de un nombre dinámico con puntos aunque el estándar vigente exige un evento estable `snake_case` y metadata separada.
- La biblioteca de estados vacíos todavía conservaba el rótulo legado `NO PUBLICADO`; hoy no era alcanzado por las rutas fijas, pero podía reintroducir una taxonomía pública ya reemplazada en una reutilización futura.

### Mejoras locales reversibles aplicadas

- El selector usa ahora el evento estable `portfolio_product_selected` y entrega el producto por separado en `data-product-key`.
- El estado vacío legado usa `EN INVESTIGACIÓN`, alineado al selector y al research vigente.
- Se ampliaron los guardrails técnicos y de producto para bloquear ambos regresos.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; rutas `/`, `/review`, `/review/knowledge`, `/api/chat`, `/api/feedback` y `/api/mcp` generadas.
- Guardrails focalizados de contratos, producto y Tarjetas: **30/30 PASS**.
- Suite completa: **75/75 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El wrapper inicial de `pnpm` no heredó `node` en su `PATH`; el mismo build se ejecutó con el runtime Node explícito y cerró correctamente. No fue una falla del producto.
- No se repitió QA visual interactivo porque sólo cambiaron atributos de trazabilidad, copy no alcanzado por las rutas actuales y pruebas; no cambió layout ni navegación.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si el borrador navegable en investigación sigue accesible desde el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 21. Revisión nocturna incremental — 14 de agosto de 2026, 09:46 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, cambios locales posteriores al cierre 08:48 y guardrails. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Onboarding mantiene exploración antes de identidad, explicación del gate antes del OTP y separación entre pre-registro, KYC y capacidad; Tarjetas sigue marcada como investigación y las acciones financieras continúan siendo preparación o ejemplo.
- Se encontró un P2 conversacional: la interfaz y el contrato vigente cerraban pendientes con `Marcar como resuelto`, pero dos fichas aprobadas del chat todavía orientaban a botones inexistentes llamados `Ya me pagaron` y `Ya pagué`.
- La corrección no cambia hechos, capacidades ni estados financieros: sólo alinea la siguiente acción sugerida por el conocimiento con el vocabulario confirmado en Inicio, Cartola y Cobrar/Pagar.

### Mejoras locales reversibles aplicadas

- Las fichas `collect-receivables-001` y `collect-payables-001` usan ahora `marcar el pendiente como resuelto` tanto en Markdown como en el catálogo ejecutable.
- La siguiente pregunta de la ficha por pagar quedó alineada al mismo término, sin afirmar pago, conciliación ni movimiento de dinero.
- El catálogo aprobado avanzó a `lab-kb-2026-08-14.1` y el índice declara la misma versión.
- Se agregó un guardrail focalizado que exige la versión vigente y bloquea el regreso de `Ya me pagaron` / `Ya pagué` en la acción sugerida por ambas fichas.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; rutas `/`, `/review`, `/review/knowledge`, `/api/chat`, `/api/feedback` y `/api/mcp` generadas.
- Suite completa: **76/76 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El primer build no pudo escribir `.next/trace-build` por el sandbox del entorno; el mismo comando se repitió con permiso local sobre el directorio solicitado y cerró correctamente. No fue una falla del producto.
- No se repitió QA visual interactivo porque esta pasada sólo corrigió contenido conversacional, versionado y pruebas; no cambió layout ni navegación.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si el borrador navegable en investigación sigue accesible desde el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 22. Revisión nocturna incremental — 14 de agosto de 2026, 10:50 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación consolidada y cambios locales posteriores al cierre 09:46. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 nuevo. Onboarding conserva exploración antes de identidad, intención y explicación antes del OTP, pre-registro separado de KYC/capacidad y fallbacks seguros; Tarjetas permanece en investigación y Builder no afirma sincronización externa.
- Los ajustes locales recientes alinean la escena de escritorio y dejan la ficha completa de feedback disponible también en productos en investigación, sin cambiar su estado ni concederles capacidad operativa.
- Se encontró un P1 de atribución: el estado interno del formulario de feedback sobrevivía al cambio de producto o pantalla. Una opinión empezada en un contexto podía enviarse después con el producto/pantalla nuevos.

### Mejora local reversible aplicada

- Las instancias desktop y mobile de Feedback se reinician ahora al cambiar `productId` o `activeTitle`. El texto, tipo y confirmación no migran silenciosamente entre productos o pantallas.
- Se amplió el guardrail de producto para exigir ambas claves de contexto y conservar el formulario completo de escritorio decidido en los cambios locales de esta pasada.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; rutas `/`, `/review`, `/review/knowledge`, `/api/chat`, `/api/feedback` y `/api/mcp` generadas.
- Guardrails focalizados de producto/feedback: **19/19 PASS**.
- Suite completa: **71/71 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El primer intento usó el wrapper de `pnpm` sin Node en su `PATH`; al ejecutar la misma suite con el runtime local explícito, build y pruebas cerraron correctamente. No fue una falla del producto.
- No se hizo QA visual de navegador: la corrección funcional queda cubierta por el remount explícito, guardrail, build y revisión estática; la validación visual compartida continúa abierta junto con Postgres + token largo.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si el borrador navegable en investigación sigue accesible desde el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 23. Revisión nocturna incremental — 14 de agosto de 2026, 11:50 CLT

**Alcance ejecutado:** pasada incremental sobre el estado consolidado posterior al cierre 10:50, cruzando brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación y guardrails. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- Onboarding mantiene exploración antes de identidad, intención material y explicación antes del OTP, pre-registro separado de KYC/capacidad y fallbacks seguros. Tarjetas continúa como investigación y Builder no afirma sincronización externa.
- Se detectó una regresión P0 de audiencia/confianza: la experiencia pública había vuelto a renderizar la ficha interna con eventos, arquitectura, fuentes, KYC, licencias, riesgos y preguntas, pese a la instrucción confirmada de conservar ese material fuera del recorrido público.
- Los contratos técnicos siguen disponibles en `lib/product-portfolio.ts`, PRD e informes internos; la corrección no cambia capacidades, datos, decisiones de producto ni la taxonomía de estados.

### Mejora local reversible aplicada

- Se retiró `ProductSpecification` del runtime público junto con sus imports y estilos ya inalcanzables. Acompañante, Onboarding y Builder vuelven a mostrar sólo la experiencia, sus límites contextuales y Feedback.
- Los guardrails de producto y Tarjetas ahora exigen que `ProductSpecification`, `living-spec` y los rótulos técnicos no reaparezcan en `app/page.tsx`, mientras mantienen la trazabilidad interna de eventos, fuentes, riesgos, KYC y licencias.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; rutas `/`, `/review`, `/review/knowledge`, `/api/chat`, `/api/feedback` y `/api/mcp` generadas.
- Guardrails focalizados de producto/Tarjetas: **21/21 PASS**.
- Suite completa: **71/71 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El primer intento focalizado no encontró `node` en el `PATH`; build y pruebas se ejecutaron correctamente con el runtime local explícito. No fue una falla del producto.
- No se repitió QA visual de navegador: la corrección elimina una sección completa sin alterar los journeys internos del teléfono; la validación visual compartida sigue abierta junto con Postgres + token largo.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si el borrador navegable en investigación sigue accesible desde el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 24. Revisión nocturna incremental — 14 de agosto de 2026, 12:50 CLT

**Alcance ejecutado:** pasada de regresión de producto/PRD, consistencia y flujos sobre el brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación y guardrails. No hubo archivos de producto posteriores al cierre 11:50; se preservaron la corrección P0 y el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Onboarding mantiene valor antes de identidad, intención y explicación antes del OTP, pre-registro separado de KYC/capacidad y fallbacks seguros. Tarjetas continúa como investigación, Builder no afirma sincronización externa y la ficha técnica permanece fuera del runtime público.
- Se encontraron dos P2 en fuentes activas: la síntesis del brief todavía llamaba `Convertido` al estado humano ya reemplazado por `Resuelto`, y `QA-CICLO-TRIPLE.md` mantenía Remesas “en investigación” pese a la decisión canónica de dejarla fuera de alcance sin investigarla ni prototiparla.
- Los informes QA históricos se conservaron intactos: representan el estado observado en cada pasada y no se reescribieron para aparentar que las contradicciones nunca existieron.

### Mejoras locales reversibles aplicadas

- La síntesis del brief usa `Nuevo`, `En revisión`, `Guardar para después`, `Resuelto` e `Ignorado`, y declara el destino `mejora / guía Markdown / proyecto` como una decisión separada del estado.
- La prioridad vigente del ciclo QA deja Remesas fuera de alcance hasta nueva instrucción de Felipe.
- Se agregó un guardrail documental focalizado para bloquear el regreso de ambas contradicciones.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; rutas `/`, `/review`, `/review/knowledge`, `/api/chat`, `/api/feedback` y `/api/mcp` generadas.
- Guardrails focalizados de producto/Tarjetas: **22/22 PASS**.
- Suite completa: **72/72 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- No se repitió QA visual de navegador porque esta pasada sólo corrigió fuentes documentales y pruebas; no cambió runtime, layout ni navegación.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si el borrador navegable en investigación sigue accesible desde el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 25. Revisión nocturna incremental — 14 de agosto de 2026, 13:56 CLT

**Alcance ejecutado:** pasada de producto/PRD, consistencia y flujos sobre el brief, PRD de Onboarding/KYC, QA triple, informes QA, dirección canónica, implementación y guardrails. No hubo archivos de producto nuevos posteriores al cierre 12:50; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 de runtime. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, pre-registro separado de KYC/capacidad y fallbacks seguros. Tarjetas sigue como investigación, Remesas permanece fuera de alcance, Builder no afirma sincronización externa y la ficha técnica continúa fuera del recorrido público.
- Se encontró un P2 documental en una fuente activa: la sección `Dirección de producto confirmada por Felipe` aún decía que KYC “desbloquea capacidades”, pese a que la regla canónica, el PRD y el runtime exigen además capacidad aprobada, vehículo, contrato, controles y operación.
- Los informes QA históricos se conservaron intactos: documentan el estado de cada pasada y no se reescribieron para ocultar contradicciones anteriores.

### Mejora local reversible aplicada

- La síntesis confirmada de Onboarding ahora dice que el contacto/OTP prepara una acción material y que KYC puede ser un requisito progresivo, pero nunca habilita una capacidad por sí solo.
- El guardrail documental exige esa causalidad y bloquea el regreso de la frase `KYC es una progresión que desbloquea capacidades` en la sección confirmada.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Guardrails focalizados de producto/Tarjetas: **22/22 PASS**.
- Suite completa: **72/72 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El primer lanzamiento del build no encontró `node` en el `PATH` y el siguiente intento quedó limitado por escritura de `.next`; el build pasó con el runtime local explícito y permiso de escritura en el directorio solicitado. No fueron fallas del producto.
- No se repitió QA visual de navegador porque esta pasada sólo cambió documentación y una prueba; no cambió runtime, layout ni navegación.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si el borrador navegable en investigación sigue accesible desde el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 26. Revisión nocturna incremental — 14 de agosto de 2026, 14:57 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, dirección canónica, implementación y guardrails. No hubo archivos de producto posteriores al cierre 13:56; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, pre-registro separado de KYC/capacidad y fallbacks seguros. Tarjetas muestra sólo un estado de investigación sin flujo, Remesas permanece fuera de alcance, Builder no afirma sincronización externa y las fichas técnicas continúan fuera del recorrido público.
- Se encontraron tres P2 en fuentes activas: el alcance inicial de Onboarding aún describía desbloqueo “según KYC, licencias y producto”; el alcance inicial de Remesas todavía permitía investigación y definición; y `PRODUCT-DESIGN.md` conservaba la diagonal decorativa, el “único producto publicado”, la ficha técnica pública y Feedback limitado a productos publicados.
- Los informes QA históricos se conservaron intactos: documentan el estado observado en cada pasada y no se reescribieron para ocultar contradicciones anteriores.

### Mejoras locales reversibles aplicadas

- El alcance inicial de Onboarding usa ahora la misma causalidad que la dirección confirmada: una capacidad aprobada gobierna el acceso y KYC/licencias no habilitan nada por sí solos sin vehículo, contrato, controles y operación aprobados.
- Remesas queda también fuera de investigación, definición, diseño y prototipo en la sección inicial del brief, hasta una nueva instrucción de Felipe.
- El criterio de diseño elimina diagonales/triángulos al pie, usa la taxonomía pública `Para explorar` / `En investigación`, conserva las fichas y trazabilidad como material interno y mantiene Feedback disponible en todos los espacios.
- El guardrail documental cubre estas reglas para bloquear su regresión.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Guardrails focalizados de producto/Tarjetas: **22/22 PASS**.
- Suite completa: **72/72 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- La shell inicial no exponía `node` en `PATH` y el sandbox bloqueó la escritura de `.next`; la misma suite pasó con el runtime local explícito y permiso de escritura sobre el directorio solicitado. No fueron fallas del producto.
- No se repitió QA visual de navegador porque esta pasada sólo corrigió documentación y una prueba; no cambió runtime, layout ni navegación.

### Preguntas abiertas / decisiones requeridas, actualizadas

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo; el prototipo navegable no se renderiza hoy.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 27. Revisión nocturna incremental — 14 de agosto de 2026, 15:58 CLT

**Alcance ejecutado:** revisión incremental de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, dirección canónica, implementación y guardrails. No hubo archivos de producto posteriores al cierre 14:57; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Onboarding conserva valor previo a identidad y separa OTP, pre-registro, KYC y capacidad; Tarjetas sigue como investigación sin flujo público; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews mantiene `Resuelto` separado del destino editorial.
- Se detectó un P2 documental en el registro vivo: la sección 26 había quedado insertada entre las secciones 15 y 16, rompiendo el orden cronológico y dificultando identificar el último cierre.
- Los informes QA históricos se conservaron intactos y las cinco decisiones abiertas siguen sin cambio.

### Mejora local reversible aplicada

- La sección 26 se movió a su posición cronológica después de la 25, sin alterar su contenido.
- Un guardrail comprueba que las secciones numeradas del brief permanezcan ordenadas y sin saltos.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El primer intento de build no encontró `node` en el `PATH`; pasó al repetir con el runtime local explícito. No fue una falla del producto.
- No se repitió QA visual porque no cambió runtime, layout ni navegación.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 28. Revisión nocturna incremental — 14 de agosto de 2026, 16:56 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación y guardrails. No hubo archivos de producto posteriores al cierre 15:58; se preservaron los siete cambios locales existentes. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0, P1 ni P2 nuevo. Onboarding conserva valor previo a identidad y separa acción material, OTP, pre-registro, KYC y capacidad; Tarjetas continúa como investigación sin flujo público; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews mantiene `Resuelto` separado del destino editorial.
- El cruce con los informes QA no mostró una regresión nueva en los recorridos cubiertos por guardrails. Los informes históricos se conservaron intactos y las cinco decisiones abiertas siguen sin cambio.

### Mejora local reversible aplicada

- No se modificó runtime, PRD ni contratos: no había un hallazgo nuevo que justificara cambiar producto. Se agregó únicamente este cierre trazable al brief.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El runtime Node no estaba expuesto en el `PATH`; la validación se ejecutó con el runtime local explícito. Next no pudo cargar SWC nativo por una incompatibilidad de firma del binario y usó correctamente su fallback WASM. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, layout ni navegación.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 29. Revisión nocturna incremental — 14 de agosto de 2026, 17:57 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación y guardrails. No hubo archivos de producto posteriores al cierre 16:56; se preservaron los siete cambios locales existentes. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0, P1 ni P2 nuevo. Onboarding conserva valor previo a identidad y separa acción material, OTP, pre-registro, KYC y capacidad; Tarjetas continúa como investigación sin flujo público; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews mantiene `Resuelto` separado del destino editorial.
- El cruce con los informes QA y los guardrails no mostró una regresión nueva. Los informes históricos se conservaron intactos y las cinco decisiones abiertas siguen sin cambio.

### Mejora local reversible aplicada

- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto. Se agregó únicamente este cierre trazable al brief.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El runtime Node no estaba expuesto en el `PATH`; la validación se ejecutó con el runtime local explícito. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, layout ni navegación.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 30. Revisión nocturna incremental — 14 de agosto de 2026, 18:58 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación y guardrails. No hubo archivos de producto posteriores al cierre 17:57; se preservó el trabajo local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Onboarding conserva valor previo a identidad y separa acción material, OTP, pre-registro, KYC y capacidad; Tarjetas continúa como investigación sin flujo público; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews mantiene `Resuelto` separado del destino editorial.
- Se detectó un P2 documental: el PRD aún llamaba “ficha pública” a una especificación que la dirección vigente mantiene interna, y un comentario CSS conservaba la taxonomía superada “un producto publicado / cinco no publicados”. El runtime ya respetaba la frontera de audiencia; el problema era de consistencia y mantenibilidad.
- Los informes QA históricos se conservaron intactos y las cinco decisiones abiertas siguen sin cambio.

### Mejoras locales reversibles aplicadas

- El PRD ahora atribuye la regla crítica de KYC a la `especificación interna`, coherente con `PRODUCT-DESIGN.md` y con la ausencia del inspector técnico en la experiencia pública.
- El comentario del selector describe una repisa editorial de prototipos `Para explorar` y espacios `En investigación`, sin inferir publicación operativa.
- El guardrail documental comprueba que el PRD no vuelva a presentar esa especificación como una ficha pública; el nombre de la prueba canónica se alineó con la misma frontera.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- La validación usó el runtime local explícito porque `node` no está expuesto en el `PATH`; no fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, layout, copy visible ni navegación.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 31. Revisión nocturna incremental — 14 de agosto de 2026, 20:08 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, estándar técnico, tablero e implementación local. No hubo archivos de producto posteriores al cierre 18:58; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Onboarding conserva valor previo a identidad y separa acción material, OTP, pre-registro, KYC y capacidad; Tarjetas continúa como investigación sin flujo público; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews mantiene `Resuelto` separado del destino editorial.
- Se detectó un P2 documental en fuentes activas de QA: `QA-CICLO-TRIPLE.md` seguía aplicando el control a “pantallas publicadas” y proponía actualizar una “Ficha de producto”, mientras `ESTANDAR-QA-TECNICO-PRD.md` afirmaba que el Lab exponía esa ficha y que el estándar aplicaba a productos publicados. Ese lenguaje contradecía la frontera vigente entre experiencia pública y especificación interna, aunque el runtime ya la respetaba.
- Los informes QA históricos se conservaron intactos y las cinco decisiones abiertas siguen sin cambio.

### Mejoras locales reversibles aplicadas

- El ciclo QA ahora cubre cada pantalla implementada o propuesta en revisión y entrega una actualización de la especificación interna, PRD o pregunta concreta; ya no infiere publicación.
- El estándar técnico declara que la especificación es interna, aplica a experiencias implementadas y no se renderiza en la experiencia pública. El tablero nocturno usa la misma denominación.
- El guardrail documental bloquea el regreso de `pantalla publicada`, `productos publicados` o una ficha supuestamente expuesta en esas fuentes activas.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Guardrails focalizados de producto: **21/21 PASS**.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El primer intento de build quedó bloqueado por escritura de `.next`; pasó al repetir con permiso de escritura sobre el directorio solicitado. No fue una falla del producto.
- No se repitió QA visual interactivo porque esta pasada sólo cambió documentación y una prueba; no cambió runtime, layout, copy visible ni navegación.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 32. Revisión nocturna incremental — 14 de agosto de 2026, 22:36 CLT

**Alcance ejecutado:** pasada incremental de QA de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación y guardrails. No hubo archivos de producto posteriores al cierre 20:08; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Onboarding conserva exploración antes de identidad, intención y explicación antes del OTP, pre-registro separado de KYC/capacidad y fallbacks seguros. Tarjetas continúa sin flujo público; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews mantiene `Resuelto` separado del destino editorial.
- Se confirmó un P2 de consistencia interna: la experiencia ya usaba `Para explorar / En investigación`, pero el modelo `ProductDefinition`, componentes, clases CSS y pruebas todavía usaban `published/unpublished`. El endpoint de feedback también decía validar un “producto publicado” aunque en realidad acepta cualquier producto conocido.
- El hallazgo no cambia disponibilidad, audiencia, journeys ni capacidades; corrige lenguaje técnico que podía reintroducir la antigua equivalencia entre prototipo explorable y publicación operativa.

### Mejoras locales reversibles aplicadas

- `ProductDefinition.published` pasó a `explorable`; los mismos tres prototipos siguen explorables y los mismos tres espacios continúan en investigación.
- `UnpublishedStage`, `UnpublishedProduct` y las clases `unpublished-*` pasaron a `ResearchStage`, `ResearchProduct` y `research-*`; el PRD usa también `app-research` para describir esa frontera de layout.
- El copy interno de Tarjetas ya no habla de “producto publicado”, y el comentario del intake de feedback declara correctamente que valida un producto conocido. Los guardrails bloquean el regreso de la taxonomía booleana en runtime.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Guardrails focalizados de producto, Tarjetas y Onboarding: **26/26 PASS**.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- La shell no exponía `node` en el `PATH` y el sandbox bloqueó inicialmente la escritura de `.next`; la validación pasó con el runtime local explícito y permiso de escritura sobre el directorio solicitado. No fueron fallas del producto.
- No se repitió QA visual interactivo porque el cambio es semántico interno: no modifica DOM renderizado, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 33. Revisión nocturna incremental — 14 de agosto de 2026, 23:05 CLT

**Alcance ejecutado:** revisión incremental de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación y guardrails. Se revisaron como trabajo local existente los cambios posteriores al cierre 20:08 y el cierre concurrente 22:36; no hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0, P1 ni P2 nuevo. Onboarding conserva valor antes de identidad, intención y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Tarjetas y Home Banking siguen sin flujo público; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- Se confirmó que la migración interna `published/unpublished` → `explorable/research`, documentada en la sección 32, quedó completa en modelo, UI, CSS, endpoint de feedback y guardrails. Los rastros restantes viven sólo en un informe histórico de Tarjetas y su prueba documental; no gobiernan el runtime.
- No se agregó otra corrección de producto: el cambio existente es reversible, mantiene los mismos journeys y respeta la frontera entre prototipo explorable y disponibilidad operativa.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`. Next usó su fallback WASM por la firma del binario SWC nativo; no fue una falla del producto.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- No se repitió QA visual interactivo porque la migración no modifica DOM renderizado, copy visible, layout, navegación ni estado; los guardrails cubren selector, superficies de investigación y ausencia de ficha técnica pública.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 34. Revisión nocturna incremental — 15 de agosto de 2026, 00:18 CLT

**Alcance ejecutado:** pasada incremental de QA de producto/PRD, consistencia y flujos sobre brief, PRD de Onboarding/KYC, QA triple, informes QA, implementación y guardrails. No hubo archivos de producto posteriores al cierre 23:07; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Onboarding conserva valor antes de identidad, acción material y explicación antes del OTP, y separación entre pre-registro, KYC y capacidad. Tarjetas y Home Banking siguen sin flujo público; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- Se detectó un P2 de consistencia interna posterior a la migración `published/unpublished` → `explorable/research`: dos comentarios CSS todavía comparaban estados de investigación con productos o experiencias “publicadas”; tres textos del contrato `LivingSpec` usaban `flujo publicado` o `especificaciones publicadas`; y un mensaje de prueba hablaba de fichas publicadas.
- Los términos no se renderizan en la experiencia pública y no cambiaban journeys ni capacidades, pero podían reintroducir la equivalencia incorrecta entre prototipo explorable, especificación aprobada y publicación operativa. Los informes QA históricos se conservaron intactos.

### Mejoras locales reversibles aplicadas

- Los comentarios CSS ahora comparan estados de investigación con `prototipos explorables`.
- Los contratos internos usan `flujo disponible` y `especificaciones de producto aprobadas`; el mensaje técnico usa `especificaciones internas`.
- Los guardrails bloquean el regreso de `flujo publicado`, `especificaciones de producto publicadas`, `productos publicados` o `experiencias publicadas` en las fuentes activas afectadas.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El primer intento de build quedó bloqueado por escritura de `.next`; pasó al repetir con permiso de escritura sobre el directorio solicitado. No fue una falla del producto.
- No se repitió QA visual interactivo porque la corrección sólo cambia terminología interna, comentarios y guardrails; no modifica DOM renderizado, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 35. Revisión nocturna incremental — 15 de agosto de 2026, 01:42 CLT

**Cierre consolidado:** no hubo archivos de producto posteriores al cierre 00:18 ni apareció un P0/P1 nuevo. Se corrigió únicamente el P2 documental del tablero activo: Tarjetas pasó de `borrador local no publicado` a `borrador local en investigación`, con guardrail contra la regresión. El registro detallado de alcance, validación y preguntas abiertas quedó preservado más arriba en este brief.

- Build Next.js 16.2.6 + TypeScript: **PASS**.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- Preguntas abiertas: Tarjetas en selector público o modo Equipo; primera capacidad operativa; owner/canal/SLA de Customer Success; Reviews Por tema y destino editorial; QA compartido con Postgres + token largo.

## 36. Revisión nocturna incremental — 15 de agosto de 2026, 03:22 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, informes QA, implementación y guardrails. No hubo archivos de producto posteriores al cierre 02:18 ni apareció un P0 o P1 nuevo. Se preservó el worktree local existente; no hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- Onboarding mantiene valor antes de identidad, acción material y explicación antes del OTP, y separa pre-registro, KYC y capacidad. Tarjetas y Home Banking siguen sin flujo público; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- Se detectó un P2 documental acotado posterior a la migración `published/unpublished` → `explorable/research`: el research activo de Tarjetas todavía exigía `published: false`, su PRD se declaraba `no publicado` y la prueba de trazabilidad fijaba la taxonomía anterior.
- No cambió el runtime, la UI, las capacidades, los datos ni las decisiones de producto. El hallazgo podía reintroducir la equivalencia incorrecta entre estado de investigación y publicación operativa.

### Mejoras locales reversibles aplicadas

- `RESEARCH-TARJETAS-YOL1-2026-08-14.md` exige ahora `explorable: false` en la especificación interna y conserva el rótulo visible `En investigación · Borrador local`.
- `PRD-TARJETAS-YOL1.md` declara su estado como `discovery/prototipo interno, en investigación`.
- `tests/cards-discovery.test.mjs` cubre la taxonomía vigente y bloquea el regreso de `published: false`, `ficha interna` y `no publicado` en esas fuentes activas.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- No se repitió QA visual interactivo porque la corrección sólo modifica documentación y guardrails; no cambia DOM, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 37. Revisión nocturna incremental — 15 de agosto de 2026, 04:38 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la implementación y los guardrails. No hubo archivos de producto posteriores al cierre 03:23; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Onboarding conserva exploración antes de identidad, acción material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- Se detectó un P2 documental acotado: `CHECKPOINT-TARJETAS-PASADA-1.md` todavía exigía `published: false`, aunque el modelo, el research, el PRD y la UI ya usan `explorable: false` y `En investigación`. El rastro podía reintroducir la equivalencia incorrecta entre estado de investigación y publicación operativa.
- Las cinco decisiones abiertas se mantienen sin cambio.

### Mejoras locales reversibles aplicadas

- El checkpoint de Tarjetas ahora exige `explorable: false` y `En investigación`, sin cambiar capacidad, audiencia ni runtime.
- El guardrail de Tarjetas incorpora el checkpoint y bloquea el regreso de `published: false` o `no publicado` en esa fuente activa.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Guardrails focalizados de producto y Tarjetas: **23/23 PASS**.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El primer intento de build quedó bloqueado por escritura de `.next`; pasó al repetir con permiso de escritura sobre el directorio solicitado. No fue una falla del producto.
- No se repitió QA visual interactivo porque la corrección sólo modifica documentación y guardrails; no cambia DOM, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 38. Revisión nocturna incremental — 15 de agosto de 2026, 05:24 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. No hubo archivos de producto posteriores al cierre 04:41 antes de iniciar esta revisión; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0 ni un P1 nuevo. Onboarding conserva exploración antes de identidad, acción material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- Se detectó un P2 documental en una fuente activa: `PLAN-NOCHE-YOL1.md` todavía abría cuatro preguntas de investigación para Remesas, aunque `DIRECCION-PRODUCTOS-FELIPE.md`, este brief y `QA-CICLO-TRIPLE.md` ordenan no investigar, definir, diseñar ni prototipar ese producto hasta nueva instrucción.
- El mismo plan llamaba `versión publicada` al entorno compartido del Lab. El texto podía reintroducir la equivalencia incorrecta entre un link de prueba y una publicación operativa.
- Las cinco decisiones abiertas se mantienen sin cambio.

### Mejoras locales reversibles aplicadas

- El plan nocturno reemplaza las preguntas de Remesas por una única frontera explícita: no abrir preguntas, research, diseño ni prototipos hasta una nueva instrucción de Felipe.
- La recepción de feedback distingue ahora pantallas locales de una `versión de prueba por link` aprobada por Felipe; no asume publicación operativa.
- El guardrail de producto incorpora el plan activo y bloquea el regreso de las cuatro preguntas de Remesas y del rótulo ambiguo anterior.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Guardrails focalizados de producto y Tarjetas: **23/23 PASS**.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El primer intento de build no encontró `node` en el `PATH`; pasó al repetir con el runtime local explícito. No fue una falla del producto.
- No se repitió QA visual interactivo porque la corrección sólo modifica coordinación documental y guardrails; no cambia DOM, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 39. Revisión nocturna incremental — 15 de agosto de 2026, 06:25 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. No hubo archivos de producto posteriores al cierre 05:25; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0, P1 ni P2 nuevo. Onboarding conserva exploración antes de identidad, acción material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas y los guardrails no mostró regresiones nuevas. Los informes históricos se conservaron intactos y las cinco decisiones abiertas siguen sin cambio.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El primer intento de build quedó bloqueado por escritura de `.next`; pasó al repetir con permiso sobre el directorio solicitado. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 40. Revisión nocturna incremental — 15 de agosto de 2026, 07:24 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. No hubo archivos de producto posteriores al cierre 06:27; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0, P1 ni P2 nuevo. Onboarding conserva exploración antes de identidad, acción material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas y los guardrails no mostró regresiones nuevas. Los informes históricos se conservaron intactos y las cinco decisiones abiertas siguen sin cambio.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- La carga automática del runtime local no respondió; se usó el runtime ya cacheado. El primer intento de build no encontró `node` en `PATH` y el segundo quedó bloqueado por escritura de `.next`; pasó con el runtime explícito y permiso sobre el directorio solicitado. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 41. Revisión nocturna incremental — 15 de agosto de 2026, 08:42 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. No hubo archivos de producto posteriores al cierre 07:26; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0, P1 ni P2 nuevo. Onboarding conserva exploración antes de identidad, acción material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas y los guardrails no mostró regresiones nuevas. Los informes históricos se conservaron intactos y las cinco decisiones abiertas siguen sin cambio.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- La carga automática del runtime local no respondió; se usó el runtime cacheado. El primer intento de build quedó bloqueado por escritura de `.next`; pasó al repetir con permiso sobre el directorio solicitado. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 42. Revisión nocturna incremental — 15 de agosto de 2026, 10:20 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. No hubo archivos de producto posteriores al cierre 08:59; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0, P1 ni P2 nuevo. Onboarding conserva exploración antes de identidad, acción material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas y los guardrails no mostró regresiones nuevas. Las menciones históricas de la taxonomía `published/unpublished` permanecen sólo en informes que registran el estado de sus pasadas; no se reescribieron para conservar trazabilidad.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- La carga automática del runtime local no respondió; se usó el runtime cacheado. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 43. Revisión nocturna incremental — 15 de agosto de 2026, 10:30 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. No hubo archivos de producto posteriores al cierre 10:22; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0, P1 ni P2 nuevo. Onboarding conserva exploración antes de identidad, acción material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas y los guardrails no mostró regresiones nuevas. Los hallazgos históricos resueltos o supersedidos se conservaron intactos y las cinco decisiones abiertas siguen sin cambio.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- La carga automática del runtime local no respondió; se usó el runtime cacheado. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 44. Revisión nocturna incremental — 15 de agosto de 2026, 11:33 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. No hubo archivos de producto posteriores al cierre 10:34; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0, P1 ni P2 nuevo. Onboarding conserva exploración antes de identidad, acción material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas y los guardrails no mostró regresiones nuevas. Los hallazgos históricos resueltos o supersedidos se conservaron intactos y las cinco decisiones abiertas siguen sin cambio.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- La carga automática del runtime local no respondió; se usó el runtime cacheado. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 45. Revisión nocturna incremental — 15 de agosto de 2026, 12:43 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. No hubo archivos de producto posteriores al cierre 11:34; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0, P1 ni P2 nuevo. Onboarding conserva exploración antes de identidad, acción material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas y los guardrails no mostró regresiones nuevas. Los hallazgos históricos resueltos o supersedidos se conservaron intactos y las cinco decisiones abiertas siguen sin cambio.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El primer intento de build no encontró `node` en el `PATH`; pasó al repetir con el runtime local explícito. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 46. Revisión nocturna incremental — 15 de agosto de 2026, 14:30 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. No hubo archivos de producto posteriores al cierre 12:45; sólo cambió este brief como parte del cierre anterior y se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció un P0, P1 ni P2 nuevo. Onboarding conserva exploración antes de identidad, acción material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas y los guardrails no mostró regresiones nuevas. Los hallazgos históricos resueltos o supersedidos se conservaron intactos y las cinco decisiones abiertas siguen sin cambio.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- La carga automática del runtime local no respondió; se usó el runtime cacheado. El primer build fue bloqueado por escritura de `.next`; pasó al repetir con permiso sobre el directorio solicitado. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 47. Revisión nocturna incremental — 15 de agosto de 2026, 14:38 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. El único cambio posterior al disparo anterior estaba en este brief; se preservó el resto del worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva de producto ni un P0/P1 de runtime. Onboarding conserva exploración antes de identidad, acción material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- Se detectó un P2 documental en este registro: la sección 46 había quedado insertada entre las secciones 15 y 16, rompiendo el orden consecutivo que protege el guardrail del brief.
- Las cinco decisiones abiertas siguen sin cambio; no se modificó runtime, PRD ni contratos.

### Mejora local reversible aplicada

- La sección 46 se movió completa al final del registro, después de la sección 45 y sin alterar su contenido. Este cierre queda como sección 47.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- La primera ejecución de la suite identificó el orden incorrecto: **72/73 PASS**. Después de mover la sección 46, la suite completa cerró en **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El primer build fue bloqueado por escritura de `.next`; pasó al repetir con permiso sobre el directorio solicitado. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 48. Revisión nocturna incremental — 15 de agosto de 2026, 15:42 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. Desde el cierre 14:42 no hubo cambios de producto, PRD o runtime; sólo estaba modificado este brief por el registro anterior. Se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, acción material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas y los guardrails no mostró regresiones nuevas. Los hallazgos históricos resueltos o supersedidos se conservaron intactos.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El build se ejecutó con el runtime local explícito porque `node` no está expuesto en el `PATH` de la shell. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 49. Revisión nocturna incremental — 15 de agosto de 2026, 17:42 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. No hubo cambios de producto, PRD o runtime posteriores al cierre documentado de las 15:45; sólo este brief conservaba la actualización del registro anterior a las 15:48. Se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva intención material, explicación del gate y elección de canal antes del OTP demo; pre-registro, KYC y capacidad siguen separados. Home Banking y Tarjetas permanecen sin flujo explorable; Remesas sigue fuera de alcance; Builder no afirma sincronización externa; Reviews mantiene `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Las menciones de `compartido` revisadas corresponden a gastos/datos o a la infraestructura de feedback, no a una promesa de disponibilidad del Review.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- Los primeros intentos de build no encontraron `node` en el `PATH` y no pudieron escribir `.next`; el build pasó con el runtime local explícito y permiso limitado al directorio solicitado. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 50. Revisión nocturna incremental — 15 de agosto de 2026, 17:43 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. No hubo cambios de producto, PRD o runtime; durante el cierre apareció concurrentemente la sección 49 dentro del registro histórico. Se preservó íntegro el worktree local y ese bloque concurrente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva de producto ni un P0/P1 de runtime. Onboarding conserva exploración antes de identidad, acción material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce de los informes QA históricos con las fuentes activas, la implementación y los 73 guardrails no mostró una regresión nueva. Los hallazgos resueltos o supersedidos se conservaron intactos y las cinco decisiones abiertas siguen sin cambio.
- El guardrail final detectó un P2 documental: la sección 49 concurrente había quedado entre las secciones 15 y 16 y duplicaba la numeración de este cierre.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Mejora local reversible aplicada

- La sección 49 concurrente se movió completa después de la sección 48, sin alterar su contenido. Este cierre se renumeró como sección 50.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- El guardrail focalizado detectó primero el orden concurrente (**20/21 PASS**) y pasó después de consolidarlo (**21/21 PASS**).
- `git diff --check`: **PASS**.
- La carga automática del runtime quedó esperando y se detuvo; build y tests pasaron con el runtime local explícito. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 51. Revisión nocturna incremental — 15 de agosto de 2026, 18:40 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. No hubo archivos de producto posteriores al cierre 17:46; se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos históricos resueltos o supersedidos se conservaron intactos.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El build se ejecutó con el runtime local explícito porque `node` no está expuesto en el `PATH` de la shell. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 52. Revisión nocturna incremental — 15 de agosto de 2026, 19:42 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. Desde el cierre 18:41 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos históricos resueltos o supersedidos se conservaron intactos.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- El build se ejecutó con el runtime local explícito porque `node` no está expuesto en el `PATH` de la shell. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 53. Revisión nocturna incremental — 15 de agosto de 2026, 20:46 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. Desde el cierre 19:48 no hubo cambios de producto, PRD o runtime; sólo cambió metadata de Git y se preservó el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos históricos resueltos o supersedidos se conservaron intactos.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- Los primeros intentos de build no encontraron `node` en el `PATH` y no pudieron escribir `.next`; el build pasó con el runtime local explícito y permiso limitado al directorio solicitado. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 54. Revisión nocturna incremental — 15 de agosto de 2026, 21:45 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. Desde el cierre 20:49 no hubo cambios de producto, PRD o runtime; sólo cambió `.git/FETCH_HEAD`. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. La mención `Versión oficial publicada` de `PLAN-DE-TRABAJO.md` describe el estado final del proceso de aprobación y no el estado de explorabilidad de un producto, por lo que no contradice la taxonomía activa.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS**.
- La carga automática del runtime no respondió y se detuvo. El primer build no encontró `node` en el `PATH`; pasó al repetir con el runtime local explícito. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 55. Revisión nocturna incremental — 15 de agosto de 2026, 22:43 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, la implementación y los guardrails. Desde el cierre 21:49 no hubo cambios de producto, PRD o runtime; se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Las menciones residuales de `published` están limitadas a informes QA históricos y se conservaron para no reescribir la evidencia de pasadas anteriores.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática del runtime no respondió y se detuvo. El primer build no encontró `node` en el `PATH`; pasó al repetir con el runtime local explícito. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 56. Revisión nocturna incremental — 15 de agosto de 2026, 23:44 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 22:47 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos históricos resueltos o supersedidos se conservaron intactos.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- El primer intento de build no encontró `node` en el `PATH` y el siguiente no pudo escribir `.next`; el build pasó con el runtime local explícito y permiso limitado al directorio solicitado. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 57. Revisión nocturna incremental — 16 de agosto de 2026, 00:46 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 23:46 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos históricos resueltos o supersedidos se conservaron intactos.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.
- El primer append de esta sección coincidió con un bloque histórico repetido y quedó temporalmente junto a la sección 15; el guardrail lo detectó y el bloque se movió íntegro al final. El estado final conserva secciones 1–57 consecutivas.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa final: **73/73 PASS**, 0 fallidos.
- El guardrail focalizado detectó primero el orden temporal (**20/21 PASS**) y pasó después de consolidarlo (**21/21 PASS**).
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- El build y los tests usaron el runtime local explícito porque `node` no está expuesto en el `PATH` de la shell. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 58. Revisión nocturna incremental — 16 de agosto de 2026, 01:47 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 00:47 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Las coincidencias focalizadas de `compartido` corresponden a gastos/datos o a la infraestructura de feedback; las menciones de sincronización activas son negaciones o procesos internos y no prometen una integración externa.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- El guardrail focalizado detectó primero el orden temporal (**20/21 PASS**) y pasó después de consolidarlo (**21/21 PASS**).
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- El primer intento de build no encontró `node` en el `PATH`; pasó al repetir con el runtime local explícito. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 59. Revisión nocturna incremental — 16 de agosto de 2026, 02:48 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 01:49 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Las coincidencias residuales de `published/unpublished` están limitadas a informes históricos o aserciones negativas; las menciones de sincronización activas son negaciones o procesos internos y no prometen una integración externa.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática del runtime no respondió y se detuvo; se usó el Node local de la app. Next.js descartó el binding SWC nativo por una firma incompatible y completó correctamente con WASM. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 60. Revisión nocturna incremental — 16 de agosto de 2026, 03:49 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 02:49 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Las coincidencias residuales de `published/unpublished` están limitadas a informes históricos o aserciones negativas; las menciones de `compartido` corresponden a gastos/datos o a la infraestructura de feedback, y las de sincronización activas son negaciones o procesos internos.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática del runtime no respondió y se detuvo; el primer intento de build tampoco encontró `node` en el `PATH`. El build pasó al repetir con el Node local explícito. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 61. Revisión nocturna incremental — 16 de agosto de 2026, 04:49 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 03:51 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Las coincidencias residuales de `published/unpublished` están limitadas a informes históricos o aserciones negativas; las menciones de `compartido` corresponden a gastos/datos o a la infraestructura de feedback, y las de sincronización activas son negaciones o procesos internos.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- El guardrail focalizado detectó primero que el bloque 61 había quedado junto a una lista histórica repetida; pasó después de moverlo íntegro al final.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- El build usó el Node local explícito porque `node` no está expuesto en el `PATH`. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 62. Revisión nocturna incremental — 16 de agosto de 2026, 05:50 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 04:51 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Las coincidencias residuales de `published/unpublished` están limitadas a informes históricos o aserciones negativas; las menciones de `compartido` corresponden a gastos/datos o a la infraestructura de feedback, y las de sincronización activas son negaciones o procesos internos.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- El guardrail focalizado detectó primero que el bloque 62 había quedado junto a una sección histórica repetida; pasó después de moverlo íntegro al final.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- El build usó el Node local explícito porque `node` no está expuesto en el `PATH`. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 63. Revisión nocturna incremental — 16 de agosto de 2026, 06:51 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 05:53 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Las coincidencias residuales de `published/unpublished` están limitadas a informes históricos o aserciones negativas; las menciones de `compartido` corresponden a gastos/datos o a la infraestructura de feedback, y las de sincronización activas son negaciones o procesos internos.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- El guardrail focalizado detectó primero que el bloque 63 había quedado junto a una sección histórica repetida; pasó después de moverlo íntegro al final.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- El build usó el Node local explícito porque `node` no está expuesto en el `PATH`. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 64. Revisión nocturna incremental — 16 de agosto de 2026, 07:53 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 06:54 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática de dependencias no respondió y se detuvo; build y tests pasaron con el Node local explícito. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 65. Revisión nocturna incremental — 16 de agosto de 2026, 08:52 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 07:54 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática de dependencias no respondió y se detuvo. El primer build no pudo escribir `.next`; pasó con el Node local explícito y permiso limitado al directorio solicitado. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 66. Revisión nocturna incremental — 16 de agosto de 2026, 09:52 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 08:55 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- El build usó el Node local explícito porque `node` no está expuesto en el `PATH`. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 67. Revisión nocturna incremental — 16 de agosto de 2026, 10:54 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 09:54 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática del runtime no respondió y se detuvo; el build usó el Node local explícito. Next descartó el binding SWC nativo por una firma incompatible y completó correctamente con WASM. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 68. Revisión nocturna incremental — 16 de agosto de 2026, 11:55 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 10:55 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática del runtime no respondió y se detuvo; build y tests pasaron con el Node local explícito. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 69. Revisión nocturna incremental — 16 de agosto de 2026, 12:55 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 11:55 no hubo cambios de producto, PRD o runtime; sólo este brief conservaba el registro anterior. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- El primer intento de build no encontró `node` en el `PATH`; build y tests pasaron con el binario Node local explícito. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 70. Revisión nocturna incremental — 16 de agosto de 2026, 13:54 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 12:56 no hubo cambios de producto, PRD o runtime; sólo hubo actividad de metadatos Git. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática del runtime no respondió y se detuvo; build y tests pasaron con el Node local explícito. Next descartó el binding SWC nativo por una firma incompatible y completó correctamente con WASM. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 71. Revisión nocturna incremental — 16 de agosto de 2026, 14:57 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 13:56 no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática del runtime no respondió y se detuvo; build y tests pasaron con el Node local explícito. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 72. Revisión nocturna incremental — 16 de agosto de 2026, 15:57 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 15:00 no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- Build y tests usaron el Node local explícito porque `node` no está expuesto en el `PATH`. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 73. Revisión nocturna incremental — 16 de agosto de 2026, 17:00 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 16:01 no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática del runtime no respondió y se detuvo; build y tests pasaron con el Node local explícito. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 74. Revisión nocturna incremental — 16 de agosto de 2026, 17:58 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 17:04 no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- Build y tests usaron el Node local explícito porque `node` no está expuesto en el `PATH`. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 75. Revisión nocturna incremental — 16 de agosto de 2026, 19:00 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 18:00 no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- El primer intento de build no encontró `node` en el `PATH`; el build pasó con el binario Node local añadido explícitamente. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 76. Revisión nocturna incremental — 16 de agosto de 2026, 20:01 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 19:08 no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática del runtime no respondió y se detuvo. El primer build fue bloqueado por escritura de `.next`; pasó con el Node local explícito y permiso limitado al directorio solicitado. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 77. Revisión nocturna incremental — 16 de agosto de 2026, 21:04 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 20:05 no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- Build y tests usaron el Node local explícito porque `node` no está expuesto en el `PATH`. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 78. Revisión nocturna incremental — 16 de agosto de 2026, 22:05 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 21:05 no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- El primer intento de build no encontró `node` en el `PATH`; el build pasó al invocar directamente el runtime Node local. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 79. Revisión nocturna incremental — 16 de agosto de 2026, 23:08 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 22:07 no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática del runtime no respondió y se detuvo. El primer intento de build no encontró `node` en el `PATH`; el segundo fue bloqueado por escritura de `.next`. El build pasó con el Node local explícito y permiso limitado al directorio solicitado. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 80. Revisión nocturna incremental — 17 de agosto de 2026, 00:08 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 23:08 no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- Build y tests usaron el Node local explícito porque `node` no está expuesto en el `PATH`. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 81. Revisión nocturna incremental — 17 de agosto de 2026, 01:09 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 00:08 no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- Build y tests usaron el Node local explícito porque `node` no está expuesto en el `PATH`. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 82. Revisión nocturna incremental — 17 de agosto de 2026, 02:09 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 01:11 no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- Build y tests usaron el Node local explícito porque `node` no está expuesto en el `PATH`. El primer intento quedó bloqueado por escritura de `.next`; la repetición con permiso limitado al directorio solicitado pasó. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 83. Revisión nocturna incremental — 17 de agosto de 2026, 03:10 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre 02:12 no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática del runtime no respondió y se detuvo; build y tests usaron el Node local explícito. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 84. Revisión nocturna incremental — 17 de agosto de 2026, 04:13 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre efectivo 03:13:33 CLT no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- El primer intento no encontró `node` al ejecutar Next; la repetición con el runtime Node local explícito pasó. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 85. Revisión nocturna incremental — 17 de agosto de 2026, 05:27 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre efectivo 04:13:55 CLT no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- Build y tests usaron el runtime Node local explícito porque `node` no está expuesto en el `PATH`. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 86. Revisión nocturna incremental — 17 de agosto de 2026, 06:21 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre efectivo 05:29:03 CLT no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática del runtime no respondió y se detuvo; build y tests usaron el runtime Node local explícito. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 87. Revisión nocturna incremental — 17 de agosto de 2026, 07:20 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre efectivo 06:23:00 CLT no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- La carga automática del runtime no respondió y se detuvo. El primer build fue bloqueado por escritura de `.next`; pasó con el Node local explícito y permiso limitado al directorio solicitado. Next descartó el binding SWC nativo por firma incompatible y completó correctamente con WASM. No fueron fallas del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 88. Revisión nocturna incremental — 17 de agosto de 2026, 08:24 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Desde el cierre efectivo 07:23:29 CLT no hubo cambios de producto, PRD o runtime. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- Build y tests usaron el runtime Node local explícito porque `node` no está expuesto en `PATH`. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.

## 89. Revisión nocturna incremental — 17 de agosto de 2026, 09:26 CLT

**Alcance ejecutado:** pasada incremental de producto/PRD, consistencia y flujos sobre este brief, el PRD de Onboarding/KYC, el ciclo QA triple, los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails. Se usó como corte efectivo el cierre 08:26:56 CLT, posterior al metadato de `Last run`; no hubo archivos de producto, PRD o runtime posteriores a ese corte. Se preservó íntegro el worktree local existente. No hubo commit, push, despliegue, cambios de secretos ni conexiones externas.

### Resultado de producto / PRD / consistencia

- No apareció una contradicción nueva ni un P0, P1 o P2 nuevo. Onboarding conserva exploración antes de identidad, intención material y explicación antes del OTP, y mantiene separados pre-registro, KYC y capacidad. Home Banking y Tarjetas siguen sin flujo explorable; Remesas permanece fuera de alcance; Builder no afirma sincronización externa; Reviews conserva `Resuelto` separado del destino editorial.
- El cruce con los informes QA, la dirección canónica, las fuentes activas, la implementación y los guardrails no mostró regresiones nuevas. Los hallazgos antiguos permanecen resueltos o supersedidos por las fuentes activas; las coincidencias residuales de `published/unpublished`, `compartido` y sincronización corresponden a trazabilidad histórica, gastos/datos, infraestructura de feedback o negaciones explícitas.
- No se modificó runtime, PRD ni contratos porque no había un hallazgo nuevo que justificara cambiar producto.

### Validación ejecutada

- Build Next.js 16.2.6 + TypeScript: **PASS**; siete rutas generadas, incluida `/_not-found`.
- Suite completa: **73/73 PASS**, 0 fallidos.
- `git diff --check`: **PASS** antes de este registro; se repite después del cierre.
- Build y tests usaron el runtime Node local explícito porque `node` no está expuesto en `PATH`. No fue una falla del producto.
- No se repitió QA visual interactivo porque no cambió runtime, copy visible, layout, navegación ni estado.

### Preguntas abiertas / decisiones requeridas, sin cambio

1. **Tarjetas:** decidir si la entrada de investigación sin flujo sigue visible en el selector público o pasa a modo Equipo.
2. **Onboarding:** elegir si `financial_data_connect`, `receive_value` u otra capacidad será la primera activación real aprobada; la demo no concede disponibilidad.
3. **Excepciones de identidad:** definir owner, canal y SLA de Customer Success para OTP, pérdida de acceso, KYC en revisión/rechazo y proveedor no disponible.
4. **Reviews:** definir vista Por tema y el destino editorial explícito `mejora / guía Markdown / proyecto`; `Resuelto` queda sólo como estado.
5. **QA compartido:** repetir entre navegadores cuando exista Postgres + token largo; no se configuraron secretos en esta pasada.
