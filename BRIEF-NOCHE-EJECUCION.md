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
- Diseñar flujo simple, guiado, con acceso gradual y desbloqueo incremental según KYC, licencias y producto.
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

- Solo investigación y definición por ahora.
- No crear prototipo ni pantallas en este ciclo.

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

La persona recibe valor antes de identificarse: puede explorar, conversar con el asistente y entender cómo conectaría banco o cartola. Se solicita teléfono/email con OTP y se completa información solo cuando quiere **activar una acción material**, por ejemplo transferir o recibir dinero. KYC es una progresión que desbloquea capacidades; no una barrera de entrada.

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
- **Reviews:** se separan feedback de personas, decisiones de fuentes y hallazgos IA; los estados editoriales pasan a Nuevo, En revisión, Guardar para después, Convertido e Ignorado. La bandeja debe decir siempre si está compartida o solo local.
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
