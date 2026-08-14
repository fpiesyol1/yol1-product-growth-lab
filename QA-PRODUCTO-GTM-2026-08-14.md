# QA de Producto y GTM — hipótesis para la noche

**Rol:** revisión de producto/GTM para complementar la ficha técnica.  
**Jerarquía:** decisiones verbales de Felipe mandan. Esto propone; no autoriza, no cambia regulación ni convierte una capacidad en disponible.  
**Alcance:** Onboarding/KYC, Acompañante financiero, Home Banking, Tarjetas y Construir mi propio producto. **Remesas no se prototipa.**

## 1. Lectura ejecutiva

La oportunidad de YOL1 no es lanzar cinco productos financieros a la vez. Es usar una misma promesa —**entender qué necesita mi plata hoy y decidir qué hacer**— para ganar frecuencia primero con lectura/pendientes y luego desbloquear acciones según confianza, KYC, partner y licencia.

Orden recomendado de aprendizaje:

1. **Acompañante:** cartola + cobrar/pagar; es el loop más frecuente y explicable.
2. **Onboarding progresivo:** pedir datos solo frente a una acción material, no al entrar.
3. **Home Banking contextual:** probar la capa que prioriza momentos, no productos.
4. **Tarjetas:** diseñar el ecosistema de pago cuando exista una razón operativa/partner para hacerlo.
5. **Builder:** convertir ideas externas en propuestas comparables, sin prometer que una IA publique por sí sola.

## 2. Guardrails Chile y confianza

- El Sistema de Finanzas Abiertas de Chile contempla intercambio de información e iniciación de pagos, pero su implementación es gradual; la CMF informó en 2026 que la entrada en vigor del anexo técnico se pospuso hasta julio de 2027. Por tanto, en el Lab todo banco, pago, QR/NFC o cobro es **simulación** hasta contar con vehículo, partner, consentimiento y validación legal. [CMF: NCG 514 / SFA](https://www.cmfchile.cl/portal/prensa/625/w4-article-110881.html)
- La Ley Fintec y su SFA distinguen proveedores de información e iniciación de pagos; no basta una buena interfaz para operar esos servicios. [CMF: alcance y etapas SFA](https://www.cmfchile.cl/portal/principal/613/w3-article-82752.html)
- Para medios de pago/tarjetas, separar siempre: **ver datos**, **registrar una intención**, **iniciar un pago** y **confirmar un resultado**. Cada uno tiene riesgos y requisitos distintos. [Ley 21.521 / Ley Chile](https://www.leychile.cl/leychile/Navegar?idNorma=1187323&idParte=10393566)
- Biométrica, RUT, número de serie, OTP y documentos deben ser categorías de datos sensibles/alto riesgo: no van a analytics, logs de cliente ni herramientas de feedback. El diseño debe declarar propósito, estado, proveedor y salida humana antes de pedirlos.

## 3. Hipótesis MVP por producto

### 3.1 Onboarding y KYC progresivo

**Hipótesis:** una persona acepta OTP y luego KYC cuando entiende exactamente qué acción concreta activa; antes de ello debe poder explorar la propuesta, conversar y ver una demostración.

**MVP de pantallas**

1. Bienvenida: valor inmediato y tres cosas que puede explorar sin cuenta.
2. Elegir teléfono o email → OTP → crear **pre-registro**; no pedir RUT todavía.
3. Home exploratorio: Acompañante y explicación de “qué se desbloquea después”.
4. Gate de acción: al intentar transferir/recibir/activar Mi banco, explicar beneficio y pedir RUT + serie **solo si la decisión legal/operativa lo avala**.
5. Identidad en revisión: progreso, qué falta, tiempo esperado por validar y ruta Customer Success.

**Patrón a copiar, no el flujo:** Revolut gatilla verificaciones desde una necesidad concreta y contempla documentos, selfie/otros métodos y recuperación; esto demuestra que verificación debe tener contexto y manejo explícito de fallas. [Revolut: verificar identidad](https://help.revolut.com/en-DE/help/profile-and-plan/profile-plan/verifying-identity/how-do-i-verify-my-identity/)  
**Base técnica candidata:** Cognito admite OTP por email/SMS y marca el atributo como verificado tras completar el código; evaluar costos SMS, entregabilidad y la incompatibilidad de OTP como primer factor con ciertos esquemas MFA. [AWS Cognito: passwordless OTP](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow-methods.html)

**Loop de crecimiento:** exploración útil → guardo una acción → la acción pide pre-registro → la capacidad desbloqueada aumenta recurrencia. No usar referidos hasta que la acción entregada sea real y explicable.

**Qué medir:** `onboarding_started`, `access_method_selected`, `otp_requested`, `otp_verified`, `activation_gate_seen`, `activation_gate_accepted`, `kyc_started`, `kyc_status_changed`, `support_route_started`. Guardar `anonymous_id`, `user_id` cuando exista, `event_at`, canal, versión, motivo del gate y resultado; jamás el código OTP o biometría.

**Riesgos a validar:** beneficio poco claro antes de KYC, OTP no recibido, duplicidad email/teléfono, pérdida de dispositivo, revisión manual sin dueño/SLAs.

### 3.2 Acompañante financiero

**Hipótesis:** el hábito nace al unir “entiendo mi cartola” con “sé qué me deben/debo y qué hacer”, no al mostrar dashboards.

**MVP de pantallas**

1. Inicio contextual: 1–3 cosas a revisar, con evidencia mínima y acción coherente (ignorar, revisar, cobrar/pagar o dividir).
2. Finanzas: resultado del período → cuentas conectadas → cuatro cifras → últimos movimientos con scroll propio.
3. Cartola: trazabilidad por movimiento, nota y clasificación revisable.
4. Cobrar/Pagar: bandejas separadas, registro de gasto, reparto y solicitud solo simulada.
5. Ahorrar: evidencia antes de beneficio; sin promesas garantizadas ni partners ficticios.

**Referente útil:** Monzo conecta gastos programados, “Pots” y una vista de lo pendiente; la lección es hacer visible el dinero reservado y los compromisos próximos, no copiar su estructura. [Monzo: pagos desde Pots / Left to Pay](https://monzo.com/help/budgeting-overdrafts-savings/web-bill-pots)

**Growth loop:** gasto compartido → reparto claro → invitación o link de cobro (cuando sea legal/operativo) → nueva persona entiende su pendiente → vuelve a ordenar su propia plata. En el prototipo actual, medir comprensión, no atribuir crecimiento real.

**Engagement:** recordatorios solo opt-in, resumen semanal explicable, “qué cambió desde la última vez” y recuperación de pendientes. Evitar notificaciones de culpa o insistencia a deudores.

**Tracking plan mínimo:** `financial_home_viewed`, `insight_seen`, `insight_reviewed`, `insight_ignored`, `ledger_item_opened`, `split_started`, `split_confirmed`, `request_draft_created`, `request_previewed`, `benefit_explained`. Propiedades: `insight_type`, `evidence_count`, `certainty`, `source_kind`, `action_context`, `amount_bucket`; monto exacto solo en data financiera autorizada, no en analytics por defecto.

**Riesgos:** doble conteo entre cuentas propias, confundir deuda con pago, sugerir fraude sin evidencia, usar contactos sin consentimiento, lenguaje que parezca una orden financiera.

### 3.3 Home Banking contextual

**Hipótesis:** antes de tener un portafolio bancario, una “home” que prioriza compromisos y próximos momentos puede ser más útil que un catálogo de productos.

**Propuesta de interacción:** una superficie “**Hoy te conviene mirar esto**”, con máximo tres tarjetas de contexto: pagar algo próximo, detectar variación, revisar un cobro o reservar dinero. Una acción de voz puede ser un acelerador posterior; primero validar si las sugerencias y atajos se entienden sin chat abierto permanente.

**MVP de pantallas**

1. “Tu semana con la plata”: próximos compromisos, cambio relevante, pendiente social.
2. Detalle de una situación: evidencia → opciones → consecuencia; nunca autoejecutar.
3. Salud financiera: una señal compuesta y explicable (por ejemplo, colchón de próximos pagos / variación de gastos / pendientes), no un score ni diagnóstico.
4. Ruta “cuéntame qué necesitas”: audio/texto **solo cuando haya capacidad real de captura, transcripción, consentimiento y respuesta**.

**Aprendizaje de Monzo:** los productos de organización financiera funcionan cuando enlazan fondos reservados y pagos futuros, haciendo que lo por pagar sea visible en un período. [Monzo: pagos programados](https://monzo.com/help/budgeting-overdrafts-savings/web-bill-pots)

**GTM:** entrar por una situación universal (“se viene el arriendo”, “este gasto cambió”, “alguien te cobró”), no por el claim de “banco inteligente”. Activación = una persona reconoce una situación y decide guardar/revisar/posponer.

**Eventos:** `banking_home_viewed`, `moment_card_seen`, `moment_detail_opened`, `moment_action_selected`, `financial_health_explained`, `reminder_opt_in_changed`, `assistant_input_started`. Metadatos: periodo, tipo de momento, regla/evidencia, certeza, producto desbloqueado, canal de entrada, estado de permiso.

**Riesgos:** notificar demasiado, hacer inferencias difíciles de explicar, confundir recordatorio con obligación, presentar salud financiera como evaluación crediticia.

### 3.4 Tarjetas como ecosistema transaccional

**Hipótesis:** la sección gana apertura si resuelve en segundos una intención de pago: ver datos mínimos, pagar/mostrar QR cuando exista soporte, revisar último movimiento o encontrar un beneficio pertinente.

**MVP de investigación/diseño (no emisión):**

1. Acceso protegido a datos de tarjeta: solo alias, estado, últimos cuatro dígitos y revelado temporal con reautenticación; no almacenar ni registrar PAN/CVV en analytics.
2. Último movimiento y alertas revisables: reconocer, revisar, dividir o buscar soporte; sin declarar fraude.
3. Beneficio contextual: “vas a pagar X / has gastado en Y; revisa condiciones”, siempre con vigencia, elegibilidad y disclosure.
4. Espacio de pagos: QR/NFC/wallet como **candidatos** sujetos a issuer, esquema, SO, certificaciones y partner.

**Referentes/tendencias técnicas:** Nubank explicó el patrón de tarjeta virtual como credenciales para compra online separadas del plástico; sirve de inspiración para acceso digital primero. [Nubank: tarjeta virtual](https://international.nubank.com.br/wp-content/uploads/2020/11/2.Data-Nubank-Digitalizacao-Financeira.pdf) Apple exige entitlement, estándares de seguridad, acuerdos/licencia y certificaciones para capacidades NFC/SE; esto confirma que una pantalla de “tap to pay” no puede ser una promesa de MVP sin acuerdos. [Apple: NFC & Secure Element](https://developer.apple.com/support/nfc-se-platform)

**GTM y loops:**

- Momento de checkout → acceso seguro/beneficio relevante → ahorro o control percibido → regreso a Tarjetas.
- Alerta de movimiento → revisión rápida → confianza → preferencia por tener tarjeta/método centralizado.
- Beneficio útil después de una categoría repetida → opt-in a preferencias → mejor relevancia. Nunca usar ubicación o historial para campaña sin consentimiento claro.

**Eventos:** `cards_home_viewed`, `card_details_reveal_requested`, `card_details_revealed`, `transaction_opened`, `transaction_acknowledged`, `benefit_matched`, `benefit_terms_opened`, `wallet_provisioning_intent`, `qr_intent_started`. Incluir `card_reference_id` tokenizado, `auth_level`, `benefit_id`, `merchant_category`, `eligibility_state`, `surface`; excluir PAN, CVV, token de pago y biometría.

**Riesgos/validaciones:** PCI y esquema de tarjetas, revelación tras teléfono desbloqueado, compartir una tarjeta vs. tener instrumentos separados, tarjeta corporativa con reglas, QR fraudulento, NFC no habilitado, condiciones de beneficios obsoletas.

### 3.5 Construir mi propio producto

**Hipótesis:** la gente sentirá avance si una conversación produce en pocos minutos una primera pantalla/recomendación editable, con decisiones y límites explícitos; no si solo recibe un prompt.

**MVP de pantallas**

1. Conecta mi ChatGPT / Claude: explicar que se conecta un cliente autorizado; URL MCP visible, botón copiar y permisos mínimos.
2. Prompt de inicio: la IA pregunta problema, usuario, momento, resultado, referencia visual, riesgos y qué no se debe hacer.
3. Panel de experimentos: cada conversación autorizada genera un artefacto versionado: resumen, pantallas, eventos, datos, riesgos y preguntas abiertas.
4. Enviar proyecto: nombre, qué resuelve, para quién, por qué calza con YOL1, evidencia/referencia y estado de revisión.

**Privacidad:** un MCP remoto es un tercero para el cliente; no declarar que YOL1 puede leer conversaciones privadas. Debe ser explícito qué se envía, qué se guarda y por cuánto tiempo. [OpenAI: controles de datos y MCP remoto](https://platform.openai.com/docs/models/default-usage-policies-by-endpoint)

**GTM:** primer éxito = “vi una primera versión que puedo editar”. La invitación debe incluir ejemplo, botón para adjuntar boceto/link y una pregunta a la vez. Los cambios rápidos deben quedar visibles como versiones, no solo como texto en el chat.

**Eventos:** `builder_connection_guide_opened`, `mcp_url_copied`, `starter_prompt_copied`, `proposal_brief_started`, `reference_attached`, `experiment_created`, `experiment_version_viewed`, `proposal_submitted`. Guardar origen, versión del contexto, producto relacionado, estado; nunca contenido completo de conversaciones por defecto.

**Riesgos:** confusión entre instalar MCP y entregar credenciales, enviar secretos, borrar versiones, creer que una propuesta se publica sola, crear artefactos sin propietario/revisión.

## 4. Capas B2C que toda ficha debería declarar

Para que la ficha sea útil a ingeniería/PRD, cada pantalla debería completar estas capas, con estado **propuesto / por validar / aprobado**:

| Capa | Pregunta que responde | Ejemplo de output |
|---|---|---|
| Evento | ¿Qué hizo la persona? | `split_confirmed` |
| Contrato de evento | ¿Qué propiedades mínimas viajan? | identificador permitido, `event_at`, `product_key`, `screen_key`, `action_key`, versión, origen, consentimiento y correlación |
| Datos de dominio | ¿Qué se guarda para que el producto funcione? | gasto, participante, estado de cobro |
| Fuente/consulta | ¿Qué sistema origina o se consulta? | cartola normalizada, catálogo de beneficios |
| Consentimiento | ¿Qué permiso sustenta el uso? | lectura, contacto, notificación, identidad |
| Arquitectura candidata | ¿Qué módulo podría asumirlo? | RN UI → API Gateway → Lambda → DynamoDB |
| Operación | ¿Quién responde si falla? | Customer Success, revisión de KYC, soporte partner |
| Riesgo/guardrail | ¿Qué no puede ocurrir? | no confundir recomendación con pago |
| Métrica | ¿Cómo se sabrá si funcionó? | comprensión, acción voluntaria, retorno |

### Nomenclatura de eventos

Usar `objeto_verbo` en pasado para eventos confirmados (`otp_verified`, `split_confirmed`) y `objeto_intent_started` para intenciones. Evitar nombres de botones (`button_click`) porque pierden significado al cambiar UI. A cada evento, agregar siempre: `anonymous_id` o `user_id`, `event_id`, `event_at`, `session_id`, `product_key`, `screen_key`, `action_key`, `app_version`, `schema_version`, `platform`, `source`, `consent_analytics` y `correlation_id` cuando aplique. 

No se debe definir analítica como “registrar todo”: el contrato debe separar:

- **analytics product:** comportamiento agregado/minimizado;
- **datos de dominio:** necesarios para operar la función;
- **datos sensibles:** identidad, biometría, credenciales o financieros, con acceso/retención/auditoría específicos.

## 5. Prioridades de validación para QA Producto/GTM

### P0 — antes de desarrollar/integrar

- ¿Cada pantalla explica qué puede hacer hoy y qué es solo demo/propuesta sin saturar el copy?
- ¿Toda acción material tiene valor, consentimiento, reversibilidad y salida de error humana?
- ¿Los eventos responden a una decisión de producto y tienen metadata suficiente?
- ¿Se distinguen claramente pagos, solicitudes, recomendaciones y resultados?
- ¿Los nombres y términos son consistentes: “Cobrar y pagar”, “Ahorrar”, “Mi banco”, “Acompañante financiero”?

### P1 — antes de prueba externa

- Pruebas de comprensión: explicar por qué apareció una recomendación, qué evidencia usa y qué no hará YOL1.
- Pruebas de recorrido: OTP fallido/reenvío, KYC pendiente, gasto duplicado falso positivo, solicitud que no se envía, beneficio vencido.
- Pruebas de engagement: ¿las personas vuelven por un momento real o solo navegan por curiosidad?
- Pruebas de accesibilidad y lenguaje: sin ansiedad, deuda/privacidad/seguridad entendibles.

### P2 — cuando haya partner/operación

- Validación legal por acción y país, modelo de responsabilidad, soporte, fraude, conciliación y observabilidad.
- Threat modeling: secretos, PII, biometría, tarjetas, links de cobro, QR y consentimiento revocable.
- Economics: costo de OTP, KYC, conexión, almacenamiento, soporte, notificaciones y adquisición versus activación/retención.

## 6. Referencias para el equipo

- [CMF — Sistema de Finanzas Abiertas / modificación NCG 514 (2026)](https://www.cmfchile.cl/portal/prensa/625/w4-article-110881.html)
- [CMF — regulación y alcance del SFA](https://www.cmfchile.cl/portal/principal/613/w3-article-82752.html)
- [AWS Cognito — OTP passwordless](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow-methods.html)
- [AWS Cognito — verificación de email/teléfono](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-email-phone-verification.html)
- [Revolut — flujo de verificación de identidad](https://help.revolut.com/en-DE/help/profile-and-plan/profile-plan/verifying-identity/how-do-i-verify-my-identity/)
- [Monzo — pagos programados, Pots y Left to Pay](https://monzo.com/help/budgeting-overdrafts-savings/web-bill-pots)
- [Nubank — tarjeta virtual](https://international.nubank.com.br/wp-content/uploads/2020/11/2.Data-Nubank-Digitalizacao-Financeira.pdf)
- [Apple — NFC & Secure Element](https://developer.apple.com/support/nfc-se-platform)
- [OpenAI — data controls y MCP remoto](https://platform.openai.com/docs/models/default-usage-policies-by-endpoint)

## 7. Decisiones que Felipe debe tomar más adelante

1. Cuál es la primera **acción material** que gatilla activación/KYC y bajo qué partner/vehículo.
2. Qué fuente de verdad crea la identidad canónica y cómo se resuelven duplicados entre Cognito/CDP/dominio.
3. Cuál es el primer loop que se medirá: cobrar/pagar, cartola, recordatorio contextual o beneficio.
4. Qué modelo de tarjeta se está explorando realmente: control de instrumentos existentes, issuer/virtual, corporativa/compartida o wallet.
5. Qué datos, versiones y artefactos de Builder pueden quedar disponibles para colaboradores externos.
