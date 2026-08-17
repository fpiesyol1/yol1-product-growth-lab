# Estándar QA técnico / PRD — YOL1

**Propósito.** Convertir la especificación de producto del Lab en un insumo útil para ingeniería, datos, producto y Legal, sin confundir hipótesis con decisiones. Aplica a las experiencias implementadas y a cualquier propuesta que pase a revisión. En los productos explorables, el Lab muestra una ficha resumida debajo de la composición para conversar sobre la acción inspeccionada; esto no implica publicación operativa, integración activa ni disponibilidad de una capacidad.

**Fuente prioritaria.** Decisión verbal de Felipe → decisiones aprobadas → material de proyecto/Notion → referencias externas. Este documento no reemplaza una definición legal, de seguridad ni de proveedor.

## 1. Diagnóstico del estado actual

### Hecho en el repositorio

- El Lab conserva una fuente de especificación por pantalla con evento, metadatos, arquitectura, datos, KYC, licencias, preguntas y riesgos (`lib/product-portfolio.ts`). La ficha resumida se renderiza a ancho completo sólo para Acompañante, Onboarding y Builder; los productos en investigación o pausa no la muestran.
- La base declarada por el equipo es **React Native + AWS**; Onboarding nombra Cognito, API Gateway, Lambda, DynamoDB y una capa CDP aún por definir.
- El prototipo no instrumenta analytics productivo ni conecta bancos, pagos ni KYC real.
- La especificación interna actual mezcla tres niveles: decisión tomada, candidato técnico y pendiente regulatorio. Hay que separarlos para que un ingeniero no interprete una hipótesis como un requerimiento cerrado.

### Riesgo principal

Los campos actuales son buenos como orientación, pero no bastan aún para construir: faltan contrato de evento, dueño, esquema/versionado, clasificación de datos, contrato API, criterio de aceptación y dependencia explícita por pantalla.

## 2. Regla de certeza para cada ficha

Todo bloque debe tener exactamente una etiqueta visible:

| Etiqueta | Uso | Ejemplo |
|---|---|---|
| **Decidido** | Dirección confirmada por Felipe/equipo | “Valor antes de pedir KYC” |
| **Candidato** | Recomendación implementable, aún revisable | “Cognito User Pool para OTP” |
| **Por validar** | Falta evidencia, partner, seguridad o Legal | “Proveedor biométrico y retención” |
| **Fuera de alcance** | No se construye en este MVP | “Pago iniciado desde YOL1” |

No usar “requerido” para una licencia o KYC hasta que la documentación interna y asesoría especializada lo confirmen.

## 3. Contrato de eventos: estándar único

### Convención

- **Nombre canónico:** `objeto_accion` en `snake_case`, breve, en pasado desde la perspectiva de la persona. Ej.: `onboarding_started`, `otp_verified`, `statement_opened`, `debt_request_created`.
- **No incluir** producto, pantalla, monto, persona, banco, ID ni estado en el nombre. Esos datos van como propiedades.
- **Un evento = una acción o resultado observable.** Evitar nombres de UI como `button_click` sin objeto/resultado.
- **Fuente:** siempre declarar si lo emite `mobile`, `backend`, `partner_callback` o `support`.
- **Gobernanza:** todo evento nuevo entra como `proposed`; solo pasa a `official` tras revisión de Producto + Datos + Ingeniería. Amplitude recomienda definir el plan antes de instrumentar y usar nombres y propiedades consistentes. [Plan de taxonomía](https://www.amplitude.com/docs/data/data-planning-playbook) · [Tracking plan](https://amplitude.com/docs/data/create-tracking-plan)

### Propiedades comunes obligatorias

| Propiedad | Tipo | Regla |
|---|---|---|
| `event_id` | UUID | Idempotencia; generado al emitir |
| `event_at` | ISO-8601 UTC | Hora del hecho, no de la ingesta |
| `anonymous_id` | string | Antes de login; rotación definida |
| `user_id` | string/null | ID interno pseudónimo; nunca RUT/email |
| `session_id` | string | Sesión de app |
| `product_key` | enum | `onboarding`, `companion`, `banking`, etc. |
| `screen_key` | enum | Identificador estable, no copy visible |
| `action_key` | enum | Acción estable separada del copy y del control de UI |
| `app_version` / `schema_version` | string | Compatibilidad y evolución |
| `platform` | enum | `ios`, `android`, `web` |
| `source` | enum | `mobile`, `backend`, `partner_callback`, `support` |
| `experiment_key` / `variant` | string/null | Solo si existe experimento aprobado |
| `consent_analytics` | boolean | Separado del consentimiento de producto |
| `correlation_id` | string/null | Correlación entre eventos del mismo comando o journey, sin PII |

**Prohibido en analytics:** OTP, PIN, RUT, número de serie, biometría, documento, PAN/CVV, credenciales bancarias, texto íntegro de cartolas o conversaciones. Para flujos sensibles, enviar estados/códigos normalizados, no contenido crudo.

### Catálogo inicial de eventos de alto valor

No instrumentar todo al comienzo. La recomendación de Amplitude es iniciar con pocas acciones que respondan preguntas de negocio concretas y ampliar luego. [Guía de implementación](https://amplitude.com/docs/get-started/plan-your-implementation)

| Producto | Evento | Cuándo se emite | Propiedades específicas |
|---|---|---|---|
| Onboarding | `onboarding_started` | Se inicia el flujo | `entry_point`, `access_method` |
| Onboarding | `otp_requested` | Se solicita OTP | `channel`, `purpose` |
| Onboarding | `otp_verified` | OTP válido | `channel`, `attempt_count` |
| Onboarding | `activation_gate_seen` | Se explica por qué se pide más dato | `capability_requested`, `kyc_level_required` |
| Acompañante | `financial_summary_viewed` | Se abre resumen | `period_key`, `source_count` |
| Acompañante | `statement_item_reviewed` | Se revisa un movimiento | `movement_type`, `review_reason`, `source_type` |
| Cobrar/pagar | `debt_request_created` | Se confirma un cobro borrador | `participant_count`, `amount_bucket`, `split_type` |
| Cobrar/pagar | `debt_request_status_changed` | Cambia estado | `from_status`, `to_status`, `actor_type` |
| Ahorrar | `opportunity_viewed` | Se muestra explicación | `opportunity_type`, `evidence_level`, `commercial_disclosure` |
| Home Banking | `contextual_prompt_opened` | Persona abre una situación sugerida | `context_type`, `due_window` |
| Tarjetas | `card_details_revealed` | Persona pide datos sensibles en UI | `card_type`, `auth_step` |
| Builder | `proposal_draft_created` | Nace borrador | `idea_category`, `context_version` |
| Builder | `proposal_submitted` | Se manda a revisión | `proposal_version`, `completeness_score` |

### Eventos de backend y partner

Separar evento de intención de la persona y resultado de sistema. Ejemplo: `otp_requested` (mobile) no equivale a `otp_delivery_failed` (backend/proveedor). No usar un click como evidencia de una transferencia o KYC completado.

## 4. Modelo de datos y distribución

### Bounded contexts candidatos

| Dominio | Sistema fuente de verdad candidato | Datos que guarda | Consumidores |
|---|---|---|---|
| Identidad y acceso | Cognito + servicio de perfil | `user_id`, factores/estado, vínculos externos | API, app, soporte |
| Perfil y consentimiento | Servicio Profile/Consent | versiones, propósito, timestamps, estados | producto, Legal, soporte |
| Onboarding/KYC | Servicio de orquestación | estado, referencias de proveedor, motivos normalizados | app, operaciones, soporte |
| Finanzas personales | Ledger/Financial-data service | cuentas, movimientos normalizados, trazabilidad, clasificaciones | Acompañante, reglas, soporte |
| Deudas sociales | Debt service | grupo, participantes, montos, estados, auditoría | Cobrar/pagar, notificaciones |
| Oportunidades | Rules/Benefits service | regla, evidencia, vigencia, disclosure | Ahorrar, Home Banking |
| Engagement | CEP/CDP por definir | audiencias y consentimientos de contacto, no datos financieros crudos | notificaciones, campañas |
| Analítica | Warehouse + herramienta de analytics | eventos minimizados y gobernados | Producto, Growth, Data |

### Principios de almacenamiento

1. **No mezclar PII, datos financieros y analytics.** Usar identificadores internos y tokenización/alias entre dominios.
2. **Trazabilidad financiera:** cada movimiento normalizado debe tener `source_system`, `source_record_ref`, `observed_at`, `effective_at`, `normalization_version` y estado de calidad.
3. **Datos derivados no reemplazan evidencia:** resumen, categoría, duplicado u oportunidad deben guardar regla/versión/evidencia que los produjo.
4. **Estados como máquinas de estado:** `draft → pending → verified/rejected → archived`, con actor y timestamp; no usar solo booleanos.
5. **Outbox/event log:** cambios importantes publican un evento interno idempotente; analítica, CDP y notificaciones consumen una copia, no la tabla transaccional directamente.
6. **Retención y borrado:** por definir con Legal/Privacidad antes de datos reales. Diseñar desde ya `data_classification`, `retention_policy_ref`, `deletion_requested_at`.

### Fuentes vs. destinos

- **Fuente de verdad:** servicio que decide el estado actual (ej. Debt service para una deuda).
- **Read model:** proyección para pantalla rápida (ej. resumen del mes); puede regenerarse.
- **Analítica:** copia minimizada y pseudonimizada; nunca autoridad para mostrar saldo, KYC o cobro.
- **CDP/CEP:** activación de comunicaciones consentidas; nunca autoridad para identidad/KYC ni repositorio de documentos.

## 5. Arquitectura candidata React Native + AWS

### Candidato para revisión de ingeniería

```text
React Native + Expo
  ├─ Design system / feature modules / API client
  ├─ Secure device storage only for tokens no sensibles
  └─ Observabilidad y wrapper de eventos

Amazon Cognito (identidad, OTP, tokens)
  → API Gateway / BFF
    → servicios Lambda o contenedores por dominio
      → DynamoDB (estados y agregados de alta escala)
      → Aurora PostgreSQL (relaciones/auditoría si el dominio lo exige)
      → S3 + KMS (artefactos/documentos, solo si se aprueba)
      → EventBridge/SQS (eventos internos y trabajos asincrónicos)
      → CloudWatch/X-Ray (logs, métricas y trazas)
```

### Por qué es candidato, no decisión cerrada

- Cognito ofrece directorio de usuarios, OIDC y OTP por email/SMS, además de triggers Lambda; sirve como base para pre-registro, pero no resuelve deduplicación canónica, KYC ni soporte por sí solo. [Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html)
- Expo/React Native permite iterar la capa JS, estilos e imágenes mediante actualizaciones OTA cuando la app ya incluye el runtime; permisos, dependencias nativas o cambios nativos requieren una nueva build. [EAS Update](https://docs.expo.dev/eas-update/introduction/)
- DynamoDB y Aurora son alternativas con trade-offs. Decidir por patrón de acceso, consistencia, relaciones, auditoría, costo y operación, no por pantalla.

### Recomendaciones concretas para PRD/ingeniería

| Área | Recomendación candidata | Pregunta de decisión |
|---|---|---|
| App | Monorepo con `apps/mobile`, `packages/design-system`, `packages/contracts`, `packages/analytics` | ¿Web y app compartirán dominio/código o solo tokens? |
| Networking | BFF versionado (`/v1`) y contratos tipados; no conectar la app a cada proveedor | ¿Qué respuestas necesitan caché/offline? |
| Seguridad | Tokens en almacenamiento seguro de dispositivo; secretos solo server-side; logs sin PII sensible | ¿Qué threat model y controles exige seguridad? |
| KYC | Adaptador de proveedor con estados normalizados; no acoplar UI a SDK/estado del proveedor | ¿Quién asume resolución manual y SLA? |
| Datos financieros | Conector/ingesta aislada + normalizador + evidencia inmutable | ¿Qué partner y permiso habilitan cada fuente? |
| Engagement | Orquestador de campañas separado de reglas financieras; envío solo con consentimiento | ¿Qué CEP/CDP y qué datos mínimos recibe? |
| Analytics | Wrapper tipado + tracking plan versionado + validación en CI | ¿Quién es dueño de aprobar/deprecar eventos? |

## 6. KYC, licencias y datos sensibles — por validar

### Hecho / decidido

- Jurisdicción base: Chile.
- La experiencia debe entregar valor antes de pedir identidad adicional.
- Teléfono o email + OTP crean pre-registro; una acción material es el posible gatillo de información adicional.
- RUT/número de serie/biometría aparecen como hipótesis de activación de Mi banco, no como integración real.

### Por validar antes de construir capacidades reales

1. Vehículo legal, partner, registro/autorización y alcance de cada actividad: datos financieros, pagos, iniciación, emisión, remesas, beneficios y crédito.
2. Cuándo es obligatorio identificar/verificar, qué nivel corresponde a cada capability y qué proveedor procesa documentos/biometría.
3. Consentimiento, finalidad, retención, acceso, auditoría, revocación y atención humana.
4. Qué datos puede recibir el CDP/CEP y cuáles quedan estrictamente fuera.

La CMF y el marco aplicable deben revisarse con fuentes primarias y asesoría competente antes de tratar una capacidad como disponible. Este estándar no entrega asesoría legal ni concluye licencias.

## 7. Estructura mínima de PRD por épica/pantalla

1. **Decisión y estado:** Decidido/Candidato/Por validar/Fuera de alcance; dueño y fecha.
2. **Problema, persona, momento:** job-to-be-done, dolor, señal de activación y no-objetivos.
3. **Flujo:** happy path, alternativos, error, abandono, recuperación y salida humana.
4. **Pantallas:** objetivo, contenido, CTA, estados vacíos/carga/error, accesibilidad y copy aprobado.
5. **Reglas de negocio:** entradas, decisión, evidencia, certeza, reversibilidad y excepciones.
6. **Datos:** fuente de verdad, entidades, campos mínimos, clasificación, retención, permiso y proyección de lectura.
7. **APIs/contratos:** comandos, consultas, respuestas, idempotencia, errores y versionado.
8. **Eventos:** objetivo métrico, nombre, fuente, propiedad, tipo, obligatoriedad, ejemplo y dueño.
9. **Arquitectura:** componentes candidatos, dependencias, escalabilidad, observabilidad, seguridad y decisiones abiertas.
10. **KYC/Licencias/Privacidad:** estado y evidencia requerida; nunca inferencias legales.
11. **GTM y engagement:** audiencia, loop, incentivo, superficie de descubrimiento, frecuencia y consentimiento.
12. **QA:** qué puede salir mal, casos de prueba, métricas de aceptación, riesgos y plan de rollback.

## 8. Prioridades de QA técnico para esta noche

### P0 — antes de pantalla funcional con datos reales

- Definir `analytics/track-plan.md` con 5–10 eventos de valor, propiedades comunes, dueño y versionado.
- Separar en la especificación interna actual: **Decidido**, **Candidato**, **Por validar** y **Fuera de alcance**.
- Agregar por pantalla: fuente de verdad, dato derivado, clasificación de sensibilidad y contrato de error.
- Bloquear cualquier analytics de RUT, OTP, biometría, datos de tarjeta, cartola cruda o chat sin revisión explícita.

### P1 — antes de Onboarding/Mi banco real

- Definir ID anónimo → pre-registro → identidad canónica, merge/deduplicación y recuperación de cuenta.
- Seleccionar o especificar el adapter KYC, sus estados y la ruta manual de Customer Success.
- Diseñar consentimientos versionados y evidencia de aceptación/revocación.
- Acordar BFF, autorización por scopes y auditoría de acciones materiales.

### P2 — antes de escalar growth/engagement

- Definir CEP/CDP, política de activación y exclusiones de datos financieros.
- Definir catálogo de beneficios con vigencia, fuente, disclosure y fallback.
- Publicar contrato de eventos como tipos compartidos y validarlo en CI.

## 9. Entregables recomendados

- `docs/prd/<epica>.md`: PRD humano bajo el formato del punto 7.
- `docs/analytics/tracking-plan.md`: catálogo oficial de eventos y propiedades.
- `docs/data/domain-map.md`: entidades, fuentes de verdad, clasificación y flujos de datos.
- `docs/architecture/adr/`: decisiones técnicas pequeñas y versionadas.
- `docs/compliance/open-questions.md`: preguntas a Legal/Compliance/partners, sin resolverlas por intuición.
- `contracts/`: esquemas API/eventos tipados cuando ingeniería apruebe la base.

## 10. Referencias externas

- [AWS Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html) — registro, OTP, OIDC, MFA y triggers; no es KYC completo.
- [Expo EAS Update](https://docs.expo.dev/eas-update/introduction/) — alcance y límite de actualizaciones OTA en React Native/Expo.
- [Amplitude: planificar taxonomía](https://www.amplitude.com/docs/data/data-planning-playbook) — nombres, eventos, propiedades y gobernanza.
- [Amplitude: crear tracking plan](https://amplitude.com/docs/data/create-tracking-plan) — fuente, evento, propiedades, tipos y ownership.
- [Amplitude: implementación inicial](https://amplitude.com/docs/get-started/plan-your-implementation) — priorizar pocos eventos de alto valor antes de escalar.
