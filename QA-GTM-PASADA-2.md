# QA Producto/GTM — pasada 2

**Fecha:** 14 de agosto de 2026  
**Uso:** insumo para la ficha de producto, PRD y decisiones de MVP.  
**Prioridad:** decisión verbal de Felipe > este documento.  
**Límite:** no autoriza integración, emisión de tarjetas, pagos, conexión bancaria, KYC real ni campañas. Remesas queda fuera.

## Conclusión de esta pasada

YOL1 debe evitar dos trampas: una home que se siente como catálogo bancario y una tarjeta que se siente como una foto de plástico. La oportunidad compartida es una capa de **situaciones**: “qué cambió”, “qué viene”, “qué falta” y “qué puedes resolver ahora”, explicada con evidencia y acciones limitadas por permisos reales.

El orden de desarrollo recomendado no cambia: Acompañante valida frecuencia; Onboarding valida confianza y activación progresiva; Home Banking valida contextualización; Tarjetas valida intención de pago/control antes de cualquier emisión o wallet.

---

## 1. Home Banking contextual y agéntico

### Propuesta de producto

La home no muestra productos; abre con **“Hoy con tu plata”** y decide, con reglas visibles, cuál de estas situaciones merece atención:

1. **Se viene:** arriendo, servicio, suscripción o gasto recurrente próximo.
2. **Cambió:** un gasto subió, una cuenta se reactivó o un saldo previsto se estrechó.
3. **Está pendiente:** alguien te debe, tú debes, o falta revisar una transacción.

Cada situación debe traer: evidencia, fecha/monto si está disponible, nivel de certeza, una acción que no ejecuta por sí misma y un enlace “por qué veo esto”. La conversación/audio puede ser una ruta secundaria de *explicar o buscar*, no el motor principal de navegación inicial.

### Referentes y aprendizajes

- Monzo describe una home unificada como feed temporal de actividad entre cuentas: disminuye búsqueda entre apps, pero requiere una capa de eventos confiable. La lección para YOL1 es **unificar momentos**, no replicar una lista de transacciones. [Monzo: unified home feed](https://monzo.com/blog/how-we-unified-our-customers-activity-on-the-new-home-screen)
- En Trends, Monzo muestra saldo proyectado después de próximos pagos para ayudar a gastar de aquí al siguiente pago. La versión YOL1 debe explicitar período y regla; el propio ecosistema Monzo muestra que fechas/períodos ambiguos destruyen confianza. [Monzo: balance en Trends](https://monzo.com/blog/balance-in-trends)
- Monzo reporta que una alerta contextual aumentó engagement en su producto de credit insights, pero declara que evitó alertas que no aportaban valor. La lección es medir utilidad incremental y usar opt-in, no maximizar clics. [Monzo: iteración de Credit Insights](https://monzo.com/blog/how-we-built-a-product-to-demystify-credit-scores)
- El uso de holdouts para medir CRM es una referencia útil: no atribuir una acción a una notificación solo porque ocurrió después. [Monzo: medición de CRM](https://monzo.com/blog/beyond-the-last-click-how-monzo-measures-crms-true-impact)

### MVP de bajo riesgo

- Partir con datos sintéticos: tres situaciones, fechas visibles, explicación breve y acciones `ver detalle`, `guardar para después`, `marcar resuelto`.
- “Salud financiera” no es score: es una lectura de **preparación para compromisos** con tres componentes visibles: próximos pagos, variación versus período anterior y pendientes sociales. Si falta dato, mostrar “aún no alcanza la información”.
- Audio: en prototipo, botón de intención y ejemplos de comandos; no capturar audio hasta tener consentimiento, transcripción, retención, fallback y soporte definidos.

### Experimentos y métricas

| Hipótesis | Experimento | Señal primaria | Guardrail |
|---|---|---|---|
| La home contextual se entiende mejor que un catálogo | comparar tarea “qué tengo que mirar hoy” con ambas variantes | comprensión correcta / tiempo a respuesta | no medir solo clics |
| Tres situaciones bastan | 1 vs 3 vs 5 tarjetas | decisión voluntaria por tarjeta y abandono | no esconder deuda/material sensible |
| La explicación sostiene confianza | tarjeta con/sin “por qué veo esto” | proporción que puede explicar la regla | no mostrar inferencias como hechos |
| Los nudges ayudan si son oportunos | inbox opt-in, con holdout | retorno útil y acción completa | frecuencia máxima, baja inmediata |

### Contrato de datos sugerido

**Dominio:** `financial_moment` con `moment_id`, `type`, `rule_version`, `period_start/end`, `evidence_refs`, `certainty`, `status`, `created_at`, `expires_at`.  
**Analítica:** `moment_seen`, `moment_explained`, `moment_action_selected`, `moment_snoozed`, `moment_resolved`.  
**Metadata mínima:** `anonymous_id|user_id`, `event_id`, `event_at`, `session_id`, `product_key`, `screen_key`, `action_key`, `app_version`, `schema_version`, `platform`, `source`, `consent_analytics`, `correlation_id`, `rule_version`, `moment_type`, `certainty`.  
**No incluir:** saldo/monto exacto, identificadores de cuenta, descripción íntegra de transacción o datos de identidad en analytics de producto por defecto.

### Riesgos específicos

- Proyectar saldo sin explicar período, ingresos esperados y gastos excluidos.
- Alertar una situación incorrecta sin un botón de corrección simple.
- Confundir “salud” con calificación crediticia o consejo financiero personalizado.
- Convertir el audio en puerta obligatoria o capturar información sensible sin retención definida.

---

## 2. Tarjetas como ecosistema de intención de pago

### Propuesta de producto

La primera pantalla de Tarjetas debe resolver una de cuatro intenciones, con un cambio de contexto inmediato:

1. **Voy a pagar:** acceso protegido a credenciales permitidas, QR o wallet *solo si existe soporte real*.
2. **Quiero revisar:** último movimiento, estado de tarjeta, bloqueo/reportar/revisar según capacidad operativa.
3. **¿Me conviene pagar así?:** beneficio contextual con condiciones, elegibilidad, fecha y disclosure.
4. **Quiero ordenar una compra:** dividir/gasto compartido sin que ello implique pago ni emisión.

No se debe usar un carrusel de beneficios como home principal. El beneficio aparece después de una intención o patrón explícito; de otro modo parece publicidad o recomendación opaca.

### Referentes y viabilidad

- Nubank documenta una tarjeta virtual como datos distintos para compras online y no como plástico digitalizado. El patrón aplicable: digital-first, datos con propósito y separación de instrumento físico/virtual. [Nubank: tarjeta virtual](https://international.nubank.com.br/wp-content/uploads/2020/11/2.Data-Nubank-Digitalizacao-Financeira.pdf)
- Apple exige entitlement, acuerdos/licencia aplicable, certificaciones y estándares de seguridad para capacidades NFC/Secure Element. La UI QR/NFC se puede explorar, pero **no se debe prometer provisionamiento o tap-to-pay** antes de issuer/partner y aprobación. [Apple: NFC & Secure Element](https://developer.apple.com/support/nfc-se-platform)
- La Ley Fintec/SFA contempla una implementación regulada y gradual para datos e iniciación de pagos; el modelo YOL1 debe separar control de información, intención de pago y ejecución mediante partner. [CMF: Sistema de Finanzas Abiertas](https://www.cmfchile.cl/portal/prensa/625/w4-article-110881.html)

### MVP de bajo riesgo

- Simular una tarjeta con alias, estado, últimos cuatro dígitos y último movimiento; el botón “ver datos” explica reautenticación necesaria en producción.
- Usar beneficio como tarjeta de evidencia: comercio/categoría, condición, vigencia, fuente, elegibilidad estimada y `ver términos`. Sin precio recomendado ni redirección comercial mientras no haya acuerdo real.
- Probar “dividir esta compra” desde un movimiento: copia el contexto hacia Cobrar/Pagar, pero solicita confirmación antes de crear una deuda.
- Diseñar un carril “Pagar” solo como selector de intención QR / Wallet / Datos; cada una debe mostrar estado `por validar` si no hay capacidad.

### Loops y GTM

1. **Pago → control:** reviso un movimiento → marco correcto/reviso → sube confianza en el historial centralizado.
2. **Patrón → beneficio:** veo beneficio por categoría → reviso términos → guardo o descarto → preferencia explícita mejora relevancia futura.
3. **Compra → social:** divido un gasto → cobra/paga aparece en Acompañante → vuelve a Tarjetas para revisar evidencia.

No usar sharing, referidos ni descuentos de terceros como motor principal hasta que se tenga proveedor, atribución y disclosure comercial.

### Eventos y datos

**Eventos:** `cards_home_viewed`, `payment_intent_selected`, `card_details_reveal_requested`, `transaction_opened`, `transaction_status_marked`, `benefit_matched`, `benefit_terms_opened`, `split_from_transaction_started`.  
**Dominio candidato:** `payment_instrument_reference`, `transaction_reference`, `benefit_catalog_entry`, `benefit_match`, `purchase_split_draft`.  
**Nunca:** PAN, CVV, token de pago, OTP, biometría, QR completo o credenciales de wallet en analytics/log de cliente.  
**Propiedades útiles:** `instrument_type`, `auth_level`, `transaction_category`, `benefit_id`, `eligibility_state`, `source_surface`, `action_outcome`.

### Riesgos específicos

- Data de tarjeta “a mano” que acaba filtrándose a logs, capturas, sesiones o analytics.
- Duplicar una compra real al convertirla en gasto compartido.
- Beneficio vencido/no elegible que parezca oferta garantizada.
- Una tarjeta compartida/corporativa sin definición de titularidad, límites, auditoría, responsabilidad y partner.
- QR malicioso, NFC no disponible por dispositivo y error de autenticación sin recuperación.

---

## 3. Revisión contra dirección verbal: Acompañante, Onboarding y Builder

### Acompañante financiero

**Se mantiene:** primer hábito = cartola explicable + lo que debo/me deben.  
**Ajuste recomendado:** no pretender reemplazar Splitwise completo en MVP. Validar primero que una persona entiende y acepta un reparto/pendiente antes de sumar contactos, pago, cuenta secundaria o ganar dinero.

**Experimento:** escenario de gasto realista → crear reparto → confirmar montos → revisar cómo resolvería una persona la deuda; medir tasa de corrección de montos y comprensión de estado (`borrador`, `solicitud`, `pagado`).

**Métrica norte inicial:** `acciones que la persona entiende y confirma / personas que llegan a la evidencia`, no GMV ni cobros enviados.

**Riesgo a vigilar:** comunidad no significa permiso para contactar; descubrir contactos, solicitar cobro y ejecutar pago son tres gates distintos.

### Onboarding y KYC progresivo

**Se mantiene:** valor antes de identidad; OTP establece canal, no KYC completo; KYC aparece frente a acción material.  
**Ajuste recomendado:** definir una sola frase por gate: “Completa esto para hacer X”. No mezclar conectar banco, transferir, recibir dinero y abrir cuenta en un mismo checklist porque cambian permisos, regulación y confianza.

**Experimento:** pedir OTP en dos momentos: al guardar una acción versus al activar una acción; comparar conversión, comprensión y abandono. Probar error/reenvío/pérdida de acceso desde el inicio. AWS Cognito permite passwordless OTP de email/SMS, pero hay que diseñar límites de entrega, costo SMS y recuperación. [AWS Cognito: OTP](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow-methods.html)

**Métrica norte inicial:** porcentaje de personas que explica correctamente qué se desbloquea con cada paso, antes de medir completitud KYC.

### Construir mi propio producto

**Se mantiene:** el primer éxito es una versión visible y editable, no un texto de IA.  
**Ajuste recomendado:** convertir cada conversación autorizada en un **artefacto de propuesta** con propietario, versión, resumen, pantallas, decisiones, riesgos y pregunta siguiente. La IA propone; la persona aprueba qué se envía.

**Experimento:** tres entradas: solo texto, texto + referencia, boceto/foto; medir tiempo hasta primera pantalla útil, número de iteraciones y percepción de control. El prompt debe pedir una sola decisión por turno.

**Riesgo:** un MCP remoto implica una transferencia a un servicio tercero desde el cliente. Explicar datos/permisos antes de conectar y no asumir que YOL1 puede leer chats privados. [OpenAI: controles de datos para MCP remoto](https://platform.openai.com/docs/models/default-usage-policies-by-endpoint)

---

## 4. Recomendaciones para la ficha técnica/PRD

Para cada pantalla, el QA técnico debe obligar a completar una tarjeta con:

1. **Outcome:** qué cambia para la persona, en una frase.
2. **Trigger:** qué evento de dominio hace aparecer la pantalla/momento.
3. **Event taxonomy:** nombre semántico en pasado; propiedades mínimas y exclusiones explícitas.
4. **Datos de dominio:** qué guardar, fuente de verdad, retención/owner, PII y permisos.
5. **Servicios candidatos:** UI React Native, API/función, orquestador, persistencia, observabilidad, CRM/engagement. Todo marcado como `candidato` hasta decisión de ingeniería.
6. **Operación:** fallas esperables, soporte/Customer Success, reintentos, conciliación y auditoría.
7. **GTM:** segmento, momento de llegada, propuesta, loop, métrica y anti-métrica.
8. **Copy contract:** término canónico, sinónimos prohibidos y texto de confianza requerido.

### Nomenclatura mínima

- Eventos de vista: `financial_home_viewed`.
- Eventos de decisión: `moment_action_selected`.
- Eventos de éxito: `otp_verified`, `split_confirmed`.
- Eventos de error: `otp_delivery_failed`, `kyc_review_required`.
- Eventos de consentimiento: `notification_consent_updated`.

Cada evento incluye `event_id`, `event_at`, `anonymous_id|user_id`, `session_id`, `product_key`, `screen_key`, `action_key`, `app_version`, `schema_version`, `platform`, `source`, `consent_analytics` y `correlation_id` cuando aplique. Mantener las propiedades de dinero e identidad fuera de analítica general salvo evaluación de privacidad/retención específica.

---

## 5. QA cruzado para la noche

### Producto/GTM pregunta

- ¿La primera pantalla resuelve un momento o promociona una capacidad?
- ¿La persona puede contar por qué ve una sugerencia y qué pasa si la ignora?
- ¿El loop entrega valor antes de pedir contacto, identidad o invitación?
- ¿La medición probaría utilidad incremental, no solo exposición?

### Técnico pregunta

- ¿El estado de dominio es distinto del evento analytics?
- ¿Hay fuente de verdad, idempotencia, auditoría, estados de error y reversión?
- ¿Existe separación de PII/finanzas/biometría de analítica y logs?
- ¿El partner/licencia es una dependencia declarada, no una suposición de UI?

### Consistencia pregunta

- ¿Dice siempre “Acompañante financiero”, “Cobrar y pagar”, “Ahorrar”, “Mi banco” y “Ganar”?
- ¿Cada CTA describe la acción real: `Revisar`, `Ignorar`, `Dividir`, `Guardar`? 
- ¿Una misma acción cambia de nombre o consecuencia entre Inicio, Cartola y Tarjetas?
- ¿El disclaimer necesario aparece junto a la acción, sin llenar de labels toda la app?

## 6. Pendientes de decisión

1. Definir qué acción exacta gatilla el primer KYC real y su partner/vehículo.
2. Elegir una primera fuente confiable de momentos financieros antes de prometer “Home Banking”.
3. Declarar el primer modelo de Tarjetas: control, instrumento virtual, corporativa/compartida o wallet; no mezclar cuatro en un MVP.
4. Resolver dueño de datos canónicos, Customer Success y política de CRM/consentimiento.
