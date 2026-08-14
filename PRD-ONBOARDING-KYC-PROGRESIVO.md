# PRD de trabajo — Onboarding y KYC progresivo

**Estado:** candidato de producto y tecnología; alineado a dirección canónica el 14-ago-2026; no es una definición legal ni un compromiso operativo.  
**Prioridad de fuentes:** `DIRECCION-PRODUCTOS-FELIPE.md` → decisión verbal posterior de Felipe → decisión aprobada → material Yol1/Notion → referencias externas.  
**Jurisdicción base:** Chile.  
**Tesis:** entregar una primera utilidad antes de pedir identidad; solicitar cada dato solo frente a una capacidad aprobada que realmente lo necesite.

La ficha pública resume la regla crítica como “KYC nunca habilita una capacidad por sí solo”. La matriz ejecutable de trazabilidad está en `lib/onboarding-canonical-trace.json`.

## Resultado que buscamos

Una persona puede entender qué le aporta YOL1, explorar el Acompañante y conocer el camino de activación sin entregar datos personales. Cuando elige activar una capacidad material, recibe una explicación clara de:

1. qué se le pedirá;
2. para qué sirve;
3. qué desbloquea hoy;
4. qué todavía no se habilita;
5. qué hacer si falla o queda en revisión.

## Estados de relación que no se deben comprimir

| Estado | Qué puede hacer | Qué no se debe prometer |
|---|---|---|
| P0 · visitante/perfil | Explorar, conversar, aprender y guardar contexto sólo en este dispositivo | Cuenta, pre-registro, saldo, transferencia, pago o producto financiero activo |
| Pre-registro | Guardar avance, recuperar sesión y recibir instrucciones | Identidad financiera validada o capacidad material habilitada |
| Identidad/KYC en progreso | Enviar datos requeridos por una capacidad aprobada y ver su estado | Aprobación automática, biometría universal o activación inmediata |
| Capacidad habilitada | Solo la capacidad explícita que partner, contrato, riesgo y Legal autoricen | Otras capacidades por inferencia |
| Revisión/ayuda | Ver motivo normalizado, siguiente paso y ruta Customer Success | Un callejón sin salida o mensajes ambiguos |

`Riesgo/EDD` es una capa transversal y puede aparecer en cualquier estado; no es un premio ni el último nivel comercial.

## MVP de pantallas

| Pantalla | Trabajo de la persona | CTA principal | Datos / fuente | Salidas críticas |
|---|---|---|---|---|
| Bienvenida | Entender que puede explorar sin cuenta | Explorar YOL1 | Ninguno; `anonymous_id` local | Ver qué se desbloquea |
| Explorar antes de activar | Ver qué se puede hacer y guardar localmente sin registro | Ver activaciones | Preferencias locales opcionales | Volver al Acompañante, borrar guardado local |
| Elegir acción material | Elegir un verbo concreto de ejemplo | Conectar datos / Recibir dinero | `capability_requested`, materialidad | Cancelar, seguir explorando |
| Explicar el gate | Entender qué desbloquearía y qué seguiría bloqueado antes de pedir contacto | Crear pre-registro | `capability_key`, availability, versión de política/copy | Elegir otra acción, seguir explorando |
| Elegir contacto | Elegir email o teléfono para OTP | Enviar código | Identidad de acceso, consentimiento de canal | Cambiar método, error de formato |
| Confirmar OTP | Confirmar control de canal | Confirmar | Estado de OTP, nunca el código en analytics | Reenviar, OTP vencido, cambiar contacto, ayuda |
| Pre-registro listo | Saber qué quedó habilitado y qué sigue pendiente para la acción elegida | Ir al Acompañante | Estado de perfil/pre-registro, `capability_key` | Volver, revisar siguiente requisito |
| Handoff Mi banco/KYC | Entender requisitos posibles sin capturar identidad en la demo | Ver estado de revisión | Política y estado normalizado; proveedor por definir | Revisión, timeout, pérdida de dispositivo, Customer Success |

## Capacidad y gate

No se debe codificar “teléfono + OTP = transferir/recibir dinero”. El gate se resuelve contra una matriz de capacidad:

| Campo | Ejemplo |
|---|---|
| `capability_key` | `save_recommendation_local`, `financial_data_connect`, `receive_value`, `transfer_value` |
| `legal_state` | `decidido`, `candidato`, `por_validar`, `fuera_de_alcance` |
| `partner_state` | `no_definido`, `en_validacion`, `habilitado` |
| `identity_level_required` | `visitor`, `pre_registration`, `verified_identity` |
| `consent_required` | lectura, identidad, notificación, contacto |
| `fallback_owner` | Customer Success, operaciones, partner |

La interfaz muestra una capacidad solo si su estado permite presentarla; nunca deriva habilitación solo del nivel de KYC.

Contrato ejecutable local: `lib/onboarding-capabilities.json`. Guardar localmente no requiere pre-registro; toda acción material se elige y explica antes del OTP. Mi banco/KYC no captura RUT, número de serie ni biometría en esta demo.

Después del pre-registro, el Lab resuelve el handoff desde `capability_key`: `financial_data_connect` abre una vista previa de consentimiento específico, mientras `receive_value` entrega a Mi banco/KYC sólo la intención y estados demo. La entrada directa a Mi banco no asume una capacidad. Ninguna rama transmite contacto, OTP o PII.

La navegación usa estados nominales definidos en `lib/onboarding-state-machine.ts`. Las transiciones inválidas conservan el estado actual: OTP no puede verificarse antes de explicar requisitos y elegir canal, y el consentimiento no puede abrirse antes del pre-registro.

Los límites técnicos viven en `lib/onboarding-safety.ts`: cualquier estado KYC no canónico normaliza a `review`, y sólo eventos/property keys incluidos en allowlist producen un payload local. PII, OTP, evidencia y respuestas crudas se descartan. El módulo no transmite datos.

La continuidad de la demo usa `lib/onboarding-demo-storage.ts`: guarda en este navegador sólo capacidad, tipo de canal y estado seguro bajo un schema versionado. Nunca persiste contacto u OTP, no representa account recovery real y ofrece borrado explícito desde el flujo.

La captura local usa `lib/onboarding-validation.ts`. Email y teléfono deben pasar formato mínimo antes de OTP; el error queda asociado al input y se anuncia. Los controles del módulo tienen target táctil mínimo de 44 px, foco visible y reduced motion global. Ninguna validación consulta si el contacto existe.

La superficie KYC usa `app-onboarding`, no el contenedor `app-unpublished`: mantiene scroll vertical y no reserva una navegación inferior inexistente. Los estados largos se alinean arriba y existen breakpoints de ancho/altura; el QA visual runtime continúa siendo un gate separado.

La recuperación no confirma si un contacto existe: presenta una respuesta neutral y ofrece continuar. Los `data-event` del módulo usan la misma allowlist del builder seguro; recuperación OTP, account recovery, soporte y borrado son eventos distintos y nunca incluyen contacto u OTP.

## Datos y seguridad

**Datos de dominio:** `anonymous_id`, `user_id` interno, estado de pre-registro, estado de consentimiento, `capability_requested`, referencia de caso KYC, razón normalizada y timestamps.  
**Fuentes candidatas:** Cognito para sesión/OTP; Profile & Consent para perfil y permisos; servicio de onboarding/KYC para estados; CDP/CEP por definir para deduplicación y comunicaciones consentidas.  
**No guardar en analytics:** OTP, RUT, número de serie, biometría, documentos, dirección, email/teléfono crudo, credenciales o respuestas crudas de proveedor.  
**Principio:** separar acceso, identidad, consentimiento, KYC, datos financieros y analytics en dominios/almacenamientos distintos; analytics nunca es fuente de verdad.

## Eventos propuestos

| Evento | Origen | Propiedades específicas |
|---|---|---|
| `onboarding_started` | mobile | `entry_point`, `anonymous_id` |
| `exploration_opened` | mobile | `surface`, `content_version` |
| `material_action_selected` | mobile | `capability_key`, `availability_state` |
| `requirements_explained` | mobile | `capability_key`, `requirements_version` |
| `access_method_selected` | mobile | `channel` |
| `otp_requested` | backend | `channel`, `purpose`, `attempt_number` |
| `otp_verified` | backend | `channel`, `attempt_count` |
| `otp_recovery_started` | mobile/backend | `reason_code`, `channel`, `attempt_bucket` |
| `preregistration_created` | backend | `capability_key`, `identity_state` |
| `kyc_status_changed` | backend/partner | `from_status`, `to_status`, `reason_code` |
| `support_route_started` | mobile/support | `reason_code`, `surface` |
| `onboarding_e2_answered` | mobile | `answer_key`, `result`, `misconception_key` |

Propiedades comunes: `event_id`, `event_at`, `anonymous_id` o `user_id` pseudónimo, `session_id`, `product_key`, `screen_key`, `action_key`, `app_version`, `schema_version`, `platform`, `source`, `consent_analytics` y `correlation_id` cuando aplique.

## Recuperación del pre-registro

La recuperación conserva `capability_key` y el último estado seguro. Código incorrecto, vencimiento, límite de intentos y contacto existente son estados distintos; ninguno reinicia silenciosamente el journey ni crea un segundo usuario.

- `otp_invalid`: permite corregir hasta el límite local de la demo.
- `otp_expired`: permite generar otro código de ejemplo o cambiar de canal.
- `rate_limited`: bloquea el bypass y ofrece cambio de canal o ayuda.
- `contact_exists`: deriva a recuperación, no a un pre-registro duplicado.
- `support_required`: muestra qué contexto se conservaría y declara owner, canal y SLA `por validar`; no crea un caso real.

La pregunta E2 “¿Qué habilitó este paso?” valida que la persona comprenda el resultado. Sólo pasa “Un pre-registro recuperable; no una cuenta”. Las respuestas “identidad verificada” o “ya puedo recibir dinero” se registran como falsas comprensiones en memoria/local durante la demo.

## Arquitectura candidata para revisión de ingeniería

```text
React Native / Expo
  → BFF versionado (API Gateway)
    → Onboarding orchestration service
      → Cognito (OTP y sesión)
      → Profile & Consent service
      → KYC adapter (proveedor por definir)
      → Identity-resolution/CDP boundary (por definir)
      → EventBridge/SQS para resultados asíncronos
      → Customer Success ticket adapter (por definir)
```

No acoplar la UI al SDK de un proveedor de KYC. El adaptador debe normalizar estados, reintentos y evidencias; logs y observabilidad deben excluir PII sensible.

## Integración local de estados KYC — pasada 14

Mi banco consume el normalizador compartido y demuestra tres respuestas sin red: `requirements_pending`, `failed_recoverable` y un fixture desconocido que degrada a `review`. La vista muestra significado, siguiente paso y límite; nunca el valor crudo del partner.

Ninguno de estos estados habilita una capacidad ni afirma identidad verificada. La ruta de soporte es sólo una simulación, usa un evento allowlisted y no crea ticket. El contrato editorial correspondiente vive en `KYC-STATE-COPY-MATRIX.md` dentro de Yol1.

## Ledger local de accesos y permisos — pasada 15

Perfil deriva sus filas de `OnboardingDemoSnapshot | null`; ya no muestra un pre-registro o canal verificado fijo. Sin snapshot comunica vacío. Una preparación de datos distingue vista de consentimiento de permiso activo. Una intención de recibir dinero conserva el contexto, pero mantiene KYC y capacidad sin habilitar.

El borrado desde Perfil elimina sólo la clave local versionada, reinicia Onboarding y limpia el contexto de Mi banco. No se renderizan contacto, OTP o identidad. La navegación desde el ledger fija explícitamente Onboarding o Acompañante/Mi banco para evitar handoffs sin destino.

## QA runtime y cierre consolidado

El flujo fue recorrido en navegador a 320×568, 390×844 y 1440×900, en temas oscuro y claro. Se verificaron scroll interno, CTAs de 44 px, error email con ARIA/alert, consentimiento, E2, handoff KYC y ausencia de errores de consola.

Se corrigió un P0: al abrir Mi banco desde el final de un Onboarding scrolleado, el contenedor conservaba la posición anterior y ocultaba el contexto. Producto/tab/estado/vista KYC ahora reinician el scroll al inicio. El handoff consolidado y las únicas decisiones para Felipe viven en Yol1: `HANDOFF-CONSOLIDADO-ONBOARDING-KYC-2026-08-14.md`.

## QA: todo lo que puede salir mal

- OTP no llega, expira o se intenta demasiadas veces.
- Teléfono/email ya existe y se necesita una ruta de recuperación, no un mensaje genérico.
- La persona abandona luego de entender el gate; al volver, debe saber qué se conserva.
- Una capacidad queda `por_validar` o se retira: no debe quedar CTA sin destino.
- KYC queda en revisión, falla lectura de documento, biometría no está disponible o se cambia el teléfono.
- Un partner devuelve un estado nuevo/no reconocido.
- Un evento analítico intenta incluir PII o material sensible.
- La persona confunde una simulación con una cuenta, pago o transferencia habilitada.
- Una acción no material gatilla OTP o un pre-registro por error.
- La UI pide contacto antes de que exista una acción material concreta y explicada.
- Un estado KYC verificado habilita dinero sin comprobar vehículo, contrato, rail, controles y operación.

## Dependencias abiertas

1. Vehículo legal y partner real para cualquier instrumento o rail financiero.
2. Definición del ID Yol1 canónico, deduplicación y recuperación de acceso.
3. Matriz de KYC/consentimiento por capacidad y política de retención.
4. Dueño, SLA y canal de Customer Success/operaciones.
5. Contratos de datos, threat model y aprobación de Legal/Compliance.

## Fuentes de trabajo

- `DIRECCION-PRODUCTOS-FELIPE.md` (autoridad canónica; prevalece ante contradicciones).
- `lib/onboarding-capabilities.json` y `tests/onboarding-capabilities.test.mjs` (contrato y guardrails locales).
- `Yol1 Personas - Onboarding progresivo Chile v0.md` (material local; marco de decisión, no opinión legal).
- `NGT-20260805-003 - Funnel KYC y permisos.md` (material local; contrato de lectura).
- [AWS Cognito — métodos de autenticación](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow-methods.html)
- [Revolut — verificación de identidad](https://help.revolut.com/en-DE/help/profile-and-plan/profile-plan/verifying-identity/how-do-i-verify-my-identity/)
