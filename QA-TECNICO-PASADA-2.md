# QA técnico — pasada 2: Onboarding/KYC y Ficha de producto

**Fecha:** 2026-08-14  
**Alcance:** auditoría estática de `app/page.tsx`, `lib/product-portfolio.ts`, API de feedback y la especificación actual.  
**No cubre:** prueba de proveedor real, pentest, decisión legal/regulatoria ni integración productiva.  
**Prioridad de verdad:** decisión verbal de Felipe → decisiones aprobadas → PRD/local Notion → referencias externas.

## Resumen ejecutivo

La propuesta de producto está bien alineada con el principio de **valor antes de identidad**. La implementación actual, sin embargo, es una demo de UI en estado de React: avanza pasos, acepta cualquier contacto, usa OTP de ejemplo y conserva RUT/serie solo en memoria. Eso está bien para el Lab, pero no debe pasar a un build funcional sin contratos de capacidad, identidad, consentimiento, error y auditoría.

La ficha técnica ya aporta arquitectura/datos/KYC/licencias/riesgos, pero aún no entrega un PRD implementable: faltan fuentes de verdad explícitas por campo, contratos API, clasificación de sensibilidad, dueño, SLO, versiones de esquema y estados de error por pantalla.

## 1. Hallazgos P0 — bloquear antes de conectar datos o capacidades reales

| ID | Hallazgo concreto | Evidencia actual | Impacto | Acción requerida |
|---|---|---|---|---|
| T-01 | El estado de onboarding vive solo en React. | `onboardingStep`, contacto y OTP están en `app/page.tsx`; no existe API/entidad de pre-registro. | Se pierde avance, no hay recuperación, idempotencia ni auditoría. | Definir `onboarding_case` con estado, actor, timestamps, capability y referencia de sesión; exponer BFF versionado. |
| T-02 | No existe matriz operable de capacidades/gates. | La UI dice “activar una función”, pero no transmite `capability_key`, partner, legal state o nivel de identidad. | Riesgo de pedir OTP/KYC sin beneficio concreto o de habilitar por nivel de KYC en vez de capacidad. | Crear fuente versionada `capability_policy` y endpoint de evaluación; cada gate debe renderizar una decisión explicable. |
| T-03 | El contacto y OTP son simulados sin contrato de error. | Campo acepta cualquier string; botón “Usar código de ejemplo” pone `123456`; no hay rate limit, expiración ni reintento real. | La próxima implementación puede filtrar PII o no cubrir abuso, entrega fallida, recuperación o duplicidad. | Definir comandos `request_otp`, `verify_otp`, códigos de error normalizados, expiración, límites, fallback y observabilidad. |
| T-04 | Mi banco recibe RUT y serie en memoria del cliente. | `MyBank` mantiene `rut`/`serial` en React state. | Aunque es demo, es un patrón riesgoso si se reutiliza; no hay propósito/consentimiento/caso KYC. | Mantenerlo explícitamente demo hasta reemplazarlo por proveedor/adaptador, pantalla de consentimiento y canal seguro. No enviar esos datos a analytics/logs. |
| T-05 | No hay contrato de identidad anónima → pre-registro → identidad canónica. | PRD lo marca abierto; implementación solo cambia de pantalla. | Duplicados de email/teléfono, pérdida de acceso y merge no tienen dueño ni comportamiento. | ADR de identidad con `anonymous_id`, `pre_registration_id`, `user_id`, reglas de enlace/merge, recuperación y soporte. |
| T-06 | Eventos se proponen dinámicamente, no son un tracking plan gobernado. | `proposedEventForElement()` deriva nombres desde texto/aria; `eventMetadata()` usa valores de muestra. | Un cambio de copy puede crear un evento nuevo; no hay fuente, tipo ni validación. | Sustituirlo en producto por catálogo estático/tipado y wrapper `track()`; dejar la inspección dinámica solo como ayuda editorial. |

## 2. Gaps por pantalla de Onboarding

| Pantalla del PRD | Qué existe hoy | Gap técnico/PRD | Estado de error mínimo que debe existir | Datos/fuente candidata |
|---|---|---|---|---|
| Bienvenida | Explorar y ver qué se desbloquea. | Falta identificar `entry_point`, versión de contenido y regla de retorno. | Contenido no disponible; fallback a exploración. | `anonymous_id` local; content/config service como candidato. |
| Explorar antes de activar | Lista estática de capacidades. | Falta que cada capacidad se resuelva contra una policy real y estado de partner/legal. | Capacidad retirada/no disponible; seguir explorando. | `capability_policy` como fuente; read model para app. |
| Gate de activación | Copy genérico de pre-registro. | Falta mostrar qué capacidad pidió la persona, por qué pide contacto, consentimiento requerido y qué no desbloquea. | Política no disponible; CTA deshabilitado con salida clara. | `activation_intent`, `capability_key`, `consent_purpose`. |
| Elegir contacto | Toggle teléfono/email + campo libre. | Falta normalización/validación, protección de abuso, consentimiento de canal y deduplicación. | Formato inválido, canal bloqueado, contacto existente, límite alcanzado. | Cognito/servicio de acceso; Profile & Consent como candidatos. |
| Confirmar OTP | Input de seis dígitos y código de demo. | Falta case ID, expiración, reintentos, reenviar, cambiar canal, soporte y estados de entrega. | OTP expirado, incorrecto, demasiados intentos, no entregado, cambio de dispositivo. | `otp_challenge_ref`, nunca código; Cognito u otro proveedor. |
| Pre-registro listo | Mensaje de éxito local. | Falta persistencia, lista real de capabilities permitidas, recuperación y siguiente acción. | Estado inconsistente; pre-registro no encontrado; sesión expirada. | `pre_registration_id`, `identity_state`, `enabled_capabilities`. |
| KYC requerido / Mi banco | RUT+serie y biometría simulados. | Falta gate previo, consentimiento, proveedor adaptado, estados normalizados, enlace a CS y regla de datos. | Revisión manual, documento ilegible, biometría no disponible, timeout, partner no disponible, pérdida de teléfono. | `kyc_case_ref`, `kyc_status`, `reason_code`; proveedor KYC mediante adaptador. |

## 3. Contratos candidatos para ingeniería

### 3.1 Comandos y consultas

Estos son **candidatos**, no APIs aprobadas:

| Tipo | Contrato | Entrada mínima | Salida mínima | Regla |
|---|---|---|---|---|
| Query | `GET /v1/capabilities/{capability_key}` | sesión/anónimo, locale | `legal_state`, `partner_state`, `identity_level_required`, `benefit_copy_version` | Cacheable; nunca decidir solo desde cliente. |
| Command | `POST /v1/onboarding/intents` | `capability_key`, `anonymous_id`, `idempotency_key` | `activation_intent_id`, gate/copy | No crea identidad sin necesidad. |
| Command | `POST /v1/access/otp-requests` | `activation_intent_id`, `channel`, contacto normalizado, `idempotency_key` | `otp_challenge_ref`, `expires_at`, `retry_after` | Log seguro; no retornar código. |
| Command | `POST /v1/access/otp-verifications` | `otp_challenge_ref`, código, `idempotency_key` | `pre_registration_id`, `identity_state` | Rate limit y motivo normalizado. |
| Query | `GET /v1/onboarding/cases/{id}` | sesión autorizada | estado, next step, capabilities, help route | Recuperable tras cerrar la app. |
| Command | `POST /v1/kyc/cases` | `activation_intent_id`, consent version | `kyc_case_ref`, `next_step` | No acoplar a proveedor. |
| Webhook | `POST /v1/integrations/kyc/events` | evento firmado del proveedor | aceptación idempotente | Normalizar estado y preservar evidencia mínima. |

### 3.2 Máquina de estados candidata

```text
visitor
  → activation_intent_created
  → otp_pending
  → preregistered
  → capability_pending | kyc_pending
  → capability_enabled | kyc_review | kyc_rejected
  → support_required
```

Cada transición debe guardar: `previous_state`, `new_state`, `actor_type`, `reason_code`, `occurred_at`, `correlation_id`, `policy_version` y `idempotency_key` cuando aplique.

## 4. Eventos y telemetría: gaps contra el estándar

### Gap de implementación

- La Ficha muestra `user_id`, `timestamp`, plataforma y versión como texto de ejemplo, pero la app no emite ni valida un evento real.
- El generador de inspección usa segmentos con punto y `.click`, que no cumplen la convención canónica `objeto_accion` del estándar.
- No hay declaración de objetivo métrico, owner, fuente, tipo, esquema, ni regla de deprecación por evento.
- La ruta de feedback tiene `sessionId` local y hash server-side, que es una buena base de minimización, pero no equivale a identidad de producto ni a tracking plan.

### Catálogo mínimo para fase de onboarding

| Evento | Fuente | Objetivo | Obligatorio | Propiedades específicas |
|---|---|---|---|---|
| `onboarding_started` | mobile | entrada a exploración | sí | `entry_point`, `content_version` |
| `activation_gate_viewed` | mobile | entender fricción del gate | sí | `capability_key`, `identity_level_required`, `policy_version` |
| `access_method_selected` | mobile | comparar canal | sí | `channel` |
| `otp_requested` | backend | medir entrega, no intención | sí | `channel`, `purpose`, `attempt_number`, `provider_key` |
| `otp_verified` | backend | conversión a pre-registro | sí | `channel`, `attempt_count` |
| `otp_verification_failed` | backend | salud del flujo | sí | `reason_code`, `attempt_count` |
| `preregistration_created` | backend | activación de acceso | sí | `capability_key`, `identity_state` |
| `kyc_status_changed` | backend/partner | medir tiempos/errores | solo al existir KYC | `from_status`, `to_status`, `reason_code`, `provider_key` |
| `support_route_started` | mobile/support | detectar callejones sin salida | sí | `reason_code`, `surface` |

Propiedades comunes y lista prohibida: usar [ESTANDAR-QA-TECNICO-PRD.md](ESTANDAR-QA-TECNICO-PRD.md#3-contrato-de-eventos-estándar-único) como contrato base. Antes de instrumentar, publicar el catálogo en un tracking plan con fuente, tipo y reglas; Amplitude recomienda planificar esos elementos antes de escribir instrumentación. [Referencia oficial](https://amplitude.com/docs/data/create-tracking-plan)

## 5. Datos, fuentes y clasificación

| Dato/entidad | Fuente de verdad candidata | Clasificación | No debe ir a | Nota de diseño |
|---|---|---|---|---|
| `anonymous_id` | Cliente + identity service | Interno | CRM/analytics como PII | Debe poder enlazarse sin exponer identidad. |
| `activation_intent` | Onboarding orchestration | Interno | CDP sin propósito | Expira si se abandona; versionar policy. |
| Email/teléfono normalizado | Access/Profile service | PII | analytics, logs, feedback | Token/alias hacia otros dominios. |
| OTP | Proveedor/Cognito | Secreto efímero | todo fuera de proveedor | Nunca almacenar como dominio/analytics. |
| Consentimiento | Profile & Consent | Regulatorio/sensible | analytics sin minimización | Guardar propósito, versión, fecha, canal y revocación. |
| Caso/estado KYC | KYC orchestration | Altamente sensible | CDP, analytics crudo | Guardar referencia, estado y motivo; evidencia por política aprobada. |
| RUT, serie, biometría, documento | Proveedor/adaptador, si se aprueba | Altamente sensible | cliente persistente, logs, analytics | La app solo muestra paso/estado; no es fuente de verdad. |
| Feedback del Lab | Neon/Postgres actual cuando está configurado | Bajo/medio, texto libre | sistemas de identidad/KYC | El filtro actual es básico; requiere política antes de texto libre real. |

## 6. AWS / React Native: decisiones candidatas y diferencias importantes

| Capa | Candidato | Qué sí resuelve | Qué no resuelve |
|---|---|---|---|
| App | React Native + Expo | UI, navegación, design system, wrapper de red/eventos | KYC, autorización de negocio, secreto/partner. |
| Identidad | Amazon Cognito User Pools | Directorio, OIDC, email/SMS OTP, tokens y triggers | Identidad canónica de negocio, merge, KYC o soporte. [Docs](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html) |
| BFF | API Gateway + Lambda/servicio | Contratos versionados, autorización, composición de dominio | Modelo de dominio por sí solo. |
| Orquestación | Lambda/Step Functions + EventBridge/SQS | reintentos, resultados asíncronos, callbacks de partner | Fuente de verdad si no se define almacenamiento/estados. |
| Estados de onboarding | DynamoDB o Aurora PostgreSQL | Dynamo: accesos por caso/estado; Aurora: relaciones/auditoría compleja | Elección automática; ingeniería debe decidir por acceso/consistencia. |
| Evidencia/documentos | S3 + KMS, solo si se aprueba | artefactos cifrados y controlados | validación de identidad; requiere política/retención. |
| Observabilidad | CloudWatch, X-Ray, alarmas | trazas, latencia, errores, auditoría técnica | puede filtrar PII si logs no están gobernados. |

Para Expo, actualizaciones OTA aplican a componentes JS/estilos/recursos compatibles; permisos y cambios nativos requieren nueva build. [Expo EAS Update](https://docs.expo.dev/eas-update/introduction/)

## 7. Feedback/Review: gaps relevantes para PRD

| Hallazgo | Impacto | Prioridad |
|---|---|---|
| `YOL1_REVIEW_TOKEN` protege la revisión, pero no hay identidad individual, roles ni rotación/auditoría. | No es suficiente para operación con múltiples revisores. | P1 |
| El detector de PII es regex básico. | Puede dejar pasar texto sensible o bloquear falsos positivos. | P1 |
| Tabla de feedback no guarda taxonomía de tema normalizada ni relación a requisito/PRD/decisión. | Difícil convertir feedback en trabajo o conocimiento recuperable. | P1 |
| Local y compartido pueden divergir; la UI guarda local antes de intentar compartir. | Riesgo de creer que llegó al tablero cuando no llegó. | P1 |
| No hay export/versionado de resolución hacia Markdown/PRD. | La bandeja no alimenta todavía una fuente documental aprobada. | P2 |

## 8. Priorización de implementación

### P0 — antes de datos reales, OTP real o KYC

1. ADR de identidad: anónimo → pre-registro → identidad canónica + duplicidad/recuperación.
2. Matriz `capability_policy` y gate que explique capacidad/beneficio/consentimiento/estado de partner.
3. Contratos de OTP, errores, límite, expiración, reintento y soporte.
4. Tracking plan tipado con eventos de alto valor y lista de datos prohibidos.
5. Separación explícita de fuente de verdad, read model y analytics por pantalla.

### P1 — antes de Mi banco o revisión colaborativa

1. KYC adapter, normalización de estados, callbacks firmados e idempotencia.
2. Perfil/consentimiento versionado, revocación y auditoría.
3. Ruta Customer Success y SLA para revisión, error y pérdida de acceso.
4. Revisión autenticada por persona/rol; mejorar moderación y estado de entrega de feedback.
5. Contratos API versionados y estrategia de secretos/logging/redacción.

### P2 — antes de escalar growth/engagement

1. Boundary CDP/CEP, audiencias permitidas, consentimientos y exclusiones.
2. Outbox/event log y pipeline hacia analytics/warehouse con validación de esquema.
3. Métricas/SLO: tasa entrega OTP, verificación, abandono, tiempos de KYC, fallas por partner, recuperación por soporte.
4. Estrategia de rollouts, feature flags y observabilidad móvil.

## 9. Lista de aceptación para ingeniería

- [ ] Ningún CTA de activación llega a una pantalla sin `capability_key` y salida segura.
- [ ] Cada comando sensible es idempotente y cada estado tiene motivo/actor/timestamp.
- [ ] El cliente nunca persiste ni envía a analytics OTP, RUT, serie, biometría, documento, PAN o CVV.
- [ ] Existe flujo explícito para OTP expirado/no entregado, duplicado, KYC en revisión, provider error y pérdida de dispositivo.
- [ ] El resultado de partner solo cambia capability a través de una política/versionada, no por copy/UI.
- [ ] Eventos oficiales se validan contra tracking plan y eventos inesperados fallan en entorno controlado.
- [ ] Soporte puede rastrear un caso por `correlation_id` sin recibir secretos ni datos más amplios de lo necesario.
- [ ] El PRD de cada pantalla nombra dueño, fuente de verdad, API, eventos, permisos, pruebas y no-objetivos.

## 10. Separación de certeza

### Hecho

- El Lab simula exploración, pre-registro y biometría; no conecta servicios financieros ni verifica identidad.
- Hay una API de feedback que puede usar Neon/Postgres cuando existe `DATABASE_URL`; sin eso responde que la bandeja compartida no está configurada.
- La UI ya advierte que RUT/serie/biometría no se validan ni almacenan en la demo.

### Inferencia/recomendación

- Usar un BFF con orquestación separada, policy de capabilities, adaptador KYC y eventos tipados reduce el acoplamiento de UI/proveedor.
- Modelar onboarding como máquina de estados y no pasos de UI cubre recuperación, partner callbacks y auditoría.

### Por validar

- Partner KYC, niveles por capacidad, reglas de deduplicación, vehículo legal, retención, CEP/CDP, elección DynamoDB/Aurora y SLA de Customer Success.
- Requisitos regulatorios o licencias en Chile. Este informe no formula asesoría legal.

