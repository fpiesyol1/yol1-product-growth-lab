# Auditoría contra Dirección canónica de Felipe

**Fuente que manda:** [`DIRECCION-PRODUCTOS-FELIPE.md`](DIRECCION-PRODUCTOS-FELIPE.md), 14-08-2026.  
**Alcance auditado:** briefs de producto/GTM, discovery Home Banking/Tarjetas, QA técnico y consistencia.  
**Resultado:** la dirección de los carriles está mayoritariamente alineada. Hay cuatro correcciones de prioridad y documentación para evitar que research o la UI prometan más de lo autorizado.

## P0 — corregir o marcar como supersedido

### A-01 · Remesas debe desaparecer también de research activo

**Contradicción:** material anterior como `BRIEF-NOCHE-EJECUCION.md` aún dice “solo investigación y definición”; la dirección canónica ordena **no diseñar ni investigar** Remesas en este ciclo.  
**Decisión:** detener tareas, fuentes, hipótesis y textos nuevos de Remesas. Mantener únicamente una referencia editorial de “pausado” si el selector la necesita.  
**Riesgo:** consumir tiempo/atención y crear percepción de roadmap.  
**Criterio:** QA no abre hallazgos, research ni recomendaciones de Remesas hasta una instrucción explícita de Felipe.

### A-02 · Builder no puede describir sincronización automática desde ChatGPT/Claude

**Contradicción:** `QA-PRODUCTO-GTM-2026-08-14.md` habla de que una conversación autorizada genera un artefacto versionado. La dirección canónica exige que la persona converse en su IA, copie/prepare el resumen y luego lo envíe al Lab; no existe sincronización automática.  
**Decisión:** usar este modelo de estados: `conversación externa` → `resumen pegado por persona` → `borrador en revisión` → `propuesta editorial`.  
**Riesgo:** una persona entrega credenciales o cree que YOL1 ve su conversación privada.  
**Criterio:** ninguna pantalla/copy dice “aparece automáticamente”, “se sincroniza”, “YOL1 lee tu chat” o “enviar publica”.

### A-03 · OTP y KYC deben quedar anclados a una capability, no a pasos genéricos

**Alineación parcial:** QA técnico ya propone `capability_policy`, pero las fichas/briefs aún describen gates que pueden leerse como secuencia universal.  
**Decisión:** cada gate declara: acción solicitada, beneficio concreto, nivel de identidad requerido, estado de partner/legal, consentimiento y qué **no** habilita. OTP confirma canal; KYC aprobado tampoco habilita dinero por sí solo.  
**Riesgo:** fricción injustificada y expectativa de banca/pagos inexistente.  
**Criterio:** se puede responder “¿por qué me piden esto ahora?” en una frase por pantalla.

### A-04 · Ficha técnica: interna por defecto, no parte de la experiencia pública

**Alineación parcial:** `QA-CONSISTENCIA-PASADA-3.md` detectó correctamente el problema, mientras `PRODUCT-DESIGN.md` aún ubica la ficha debajo del teléfono para productos publicados.  
**Decisión:** modo Equipo o `/review` para arquitectura, riesgos, decisiones y fuentes; público solo ve explicaciones contextuales de producto.  
**Riesgo:** confundir al usuario y exponer debates/metadata interna.  
**Criterio:** visitante público no ve AWS, CDP, preguntas abiertas, conflictos de fuentes ni detalle de QA.

## P1 — ajustar al diseñar la próxima iteración

### A-05 · Home Banking: no convertir “salud financiera” en score

**Alineado:** Discovery recomienda una señal explicable; mantener esta frontera.  
**Aplicación:** mostrar compromisos, cambios y pendientes con evidencia/certeza. Prohibir bandas, puntajes, elegibilidad, diagnósticos o lenguaje de riesgo crediticio.  
**Métrica correcta:** comprensión de la situación + acción voluntaria; no clics ni tiempo de pantalla.

### A-06 · Tarjetas: una intención dominante antes de QR/NFC/wallet

**Alineado:** `DISCOVERY-HOME-BANKING-TARJETAS.md` recomienda “Mi tarjeta, al día”; esta es la opción correcta.  
**Aplicación:** primer prototipo = último movimiento + control/revisión + `Pagar ahora` como intención claramente por validar. Beneficio solo cuando una compra/patrón lo explica.  
**Riesgo:** el concepto A “Pagar ahora” incluye QR/Wallet y puede interpretarse como capacidad. Debe ser una hipótesis visible para test, no CTA operativo.

### A-07 · Acompañante mantiene loop acotado

**Alineado:** cartola → señal → ignorar/revisar/dividir/cobrar → pendiente social.  
**Aplicación:** no sumar aún cuenta secundaria, movimiento de dinero, Ganar, WhatsApp real, contactos automáticos o initiación de pagos. Son horizontes, no MVP.  
**Métrica correcta:** persona entiende el estado y confirma una acción; no monto/cobro/GMV.

### A-08 · Eventos canónicos: catálogo, no copy dinámico

**Alineado con QA técnico y dirección canónica:** usar `snake_case`, breves y de acción.  
**Aplicación:** cada ficha separa `event_name` de metadata. Catálogo inicial: `onboarding_started`, `otp_verified`, `financial_summary_viewed`, `moment_action_selected`, `card_details_requested`, `proposal_submitted`.  
**Riesgo:** derivar nombres desde texto de botón provoca quiebres al cambiar copy y hace imposible gobernar analítica.

## Lectura de valor y GTM

| Producto | Valor que debe defender | Loop permitido para aprender | Anti-loop / no prometer |
|---|---|---|---|
| Onboarding | explorar antes de revelar datos; dar una razón justa para registrar | exploro → guardo/activo intención → OTP → pre-registro recuperable | OTP = KYC o acceso a dinero |
| Acompañante | entender cartola y pendientes sociales | movimiento → atención → decisión → pendiente claro → retorno | red social/WhatsApp/cobro real sin permiso |
| Home Banking | qué me sirve mirar hoy | situación contextual → evidencia → guardar/revisar → retorno útil | catálogo de productos, score, notificaciones masivas |
| Tarjetas | resolver intención de pagar/controlar/revisar | último movimiento o intención → revisión/beneficio con términos → confianza | tarjeta/QR/NFC/wallet operativos sin partner |
| Builder | idea → primera versión editable → propuesta revisable | conversación externa → resumen aportado → experimento → revisión | sincronización de chat, publicación o branch automática |

## Guardrails que deben cruzar los tres QA

1. **Producto/GTM:** ¿resuelve una situación cotidiana antes de ofrecer una feature o pedir datos?
2. **Técnico:** ¿existe fuente de verdad, permiso, error/reversión y separación de PII/finanzas/analytics?
3. **Consistencia:** ¿el mismo concepto usa nombre, CTA y consecuencia idénticos entre pantallas?
4. **Comunicación:** ¿la UI distingue claramente demo, intención, capacidad por validar y resultado real sin llenar la pantalla de disclaimers?

## Fuentes de control

- [Dirección canónica de Felipe](DIRECCION-PRODUCTOS-FELIPE.md)
- [QA técnico — Onboarding/KYC](QA-TECNICO-PASADA-2.md)
- [QA consistencia — pasada 3](QA-CONSISTENCIA-PASADA-3.md)
- [Discovery — Home Banking y Tarjetas](DISCOVERY-HOME-BANKING-TARJETAS.md)
- [QA Producto/GTM — pasada 2](QA-GTM-PASADA-2.md)

