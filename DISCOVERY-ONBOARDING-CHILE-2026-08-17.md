# Discovery — Onboarding Chile: valor primero, capacidad después

**Estado:** propuesta de investigación para rediseñar el onboarding. No reemplaza una aprobación legal, de riesgo, partner o ingeniería.  
**Ámbito:** Chile primero. Referencias internacionales se usan para aprender secuencia y experiencia; no para inferir requisitos locales.  
**Pregunta que responde:** ¿cómo logramos que una persona entre rápido a YOL1, reciba valor y se enrole sin prometer capacidades financieras que aún dependen de vehículo, partner, contrato, riesgo y operación?

---

## 1. Tesis de producto

> **“Entiende tu plata hoy. Activa más cuando lo necesites.”**

La propuesta no debe ser “completa un KYC”. Debe ser: una persona puede entrar, descubrir cómo YOL1 le ayuda a entender su situación financiera y, cuando quiera una acción material, conocer con anticipación el dato, permiso o validación que esa acción requiere.

La regla de diseño que emerge tanto de la investigación de Felipe como de los referentes es simple:

1. **Valor antes de fricción:** explorar, preguntar y entender posibilidades no requiere cuenta financiera.
2. **Fricción explicada por capacidad:** cada dato pedido responde “para qué”, “qué habilita” y “qué no habilita”.
3. **Acceso no equivale a identidad:** SSO u OTP prueban/controlan el canal de acceso; no validan identidad financiera, no habilitan dinero y no reemplazan una política de KYC.
4. **KYC no equivale a producto:** identidad verificada no habilita por sí sola transferencias, tarjeta, crédito o remesas. Cada capacidad necesita su propio gate operativo.

---

## 2. Qué aprendimos: Notion, Second Brain y referencias externas

| Fuente | Hecho o aprendizaje útil | Cómo se traduce a YOL1 |
|---|---|---|
| Investigación KYC de Felipe en Notion | La fricción debe cobrarse contra permisos: biometría no es un formulario universal, sino una respuesta a riesgo/capacidad. | El checklist no dice “te falta KYC”; dice qué acción necesita qué requisito y qué desbloquea. |
| Modelo de tiers de Felipe | T0 puede servir para explorar; tiers posteriores dependen de salida de dinero, límites, partner y riesgo. | Diseñar una escalera visible, pero no convertirla en promesa de operación real. |
| Tenpo | Su apertura de cuenta concentra verificación de celular/email, datos personales, RUT/serie e identidad antes de operar. | Es el baseline local de cuenta digital completa, no necesariamente el orden óptimo para YOL1. |
| Revolut | Explicita procesos de seguridad/recuperación y puede pedir documentación adicional según producto o situación. | Explicar el motivo de un requisito y ofrecer continuidad/recuperación, no sorpresas al final. |
| Cognito | Puede federar Google, Apple u OIDC y normalizar tokens; el backend debe verificarlos. `sub` identifica al usuario del pool. | Cognito puede resolver credenciales, pero YOL1 necesita su propio `person_id` y una política de enlace/deduplicación. |
| CMF/SFA | La implementación del Sistema de Finanzas Abiertas tiene fases con entrada en vigor diferida a julio de 2027. | “Conectar mi banco” no se presenta como acceso SFA disponible hasta que exista la ruta/partner/consentimiento aprobados. |

### Referentes: qué copiar y qué no

| Referente | Patrón a aprender | No copiar literalmente |
|---|---|---|
| **Revolut** | Seguridad y recuperación como parte visible del journey; requisitos adicionales ligados a contexto/producto. | Su cobertura, regulación y estados no son equivalentes a Chile. |
| **Tenpo** | Explicación paso a paso y alta local con identidad documentada. | Asumir que KYC upfront es la única secuencia permitida o deseable. |
| **MACH** | Promesa de creación rápida y lenguaje directo de cuenta digital. | Inferir requisitos específicos sin mystery shopping/confirmación actual. |
| **Nubank** | Onboarding corto y expectativa explícita de documentos/selfie. | Llevar la secuencia brasileña o sus reglas de CPF a Chile. |
| **Yape** (aprendizaje regional) | Hacer visible que más verificación desbloquea más límite/capacidad. | Reutilizar topes, documentos o reglas peruanas. |

**Vacío de evidencia:** Global66, MACH y otros competidores necesitan una pasada de mystery shopping fechada antes de sacar conclusiones de detalle sobre número de pasos, errores y recuperación.

---

## 3. La propuesta de flujo: seis momentos, no un formulario largo

### Momento 0 — Bienvenida y propuesta de valor

**Objetivo:** que la persona sepa por qué entrar antes de compartir datos.

Copy candidato:

> **Tu plata, más clara.**  
> Entiende qué está pasando hoy, ordena tus pendientes y activa más herramientas sólo cuando las necesites.

Acciones:

- `Explorar YOL1` — entra como visitante; no crea una cuenta ni pre-registro.
- `Guardar mi avance` — abre acceso opcional con Google, Apple, email o teléfono.
- `Ver cómo se activan las herramientas` — explica la escalera de permisos.

**Decisión pendiente:** si el alta con SSO/OTP será opcional en esta pantalla o requisito para el primer home. La recomendación de producto es **opcional**: mantiene la promesa de valor antes de fricción y permite medir si el valor convierte.

### Momento 1 — Acceso ligero y creación de relación

**Objetivo:** guardar avance y permitir volver; todavía no crear una “cuenta financiera”.

Métodos candidatos:

- Continuar con Google.
- Continuar con Apple (si se publica en iOS; evaluar requisitos de plataforma).
- Continuar con email.
- Continuar con teléfono.

Para email/teléfono, el OTP confirma control del canal. Para Google/Apple, Cognito recibe una identidad federada y la convierte en tokens del User Pool. En ambos casos el servidor debe verificar los tokens antes de crear o recuperar una relación local.

Resultado claro para la persona:

> **Guardamos tu espacio de YOL1.** Puedes volver a tus ideas y preferencias. Esto no es una cuenta financiera ni activa pagos, transferencias o una tarjeta.

### Momento 2 — Home de exploración (por diseñar)

**Objetivo:** convertir el acceso en una utilidad recurrente antes de pedir datos más delicados.

La primera versión del home no debe ser una góndola de productos. Debe preguntar: **“¿Qué quieres resolver hoy?”** y mostrar situaciones:

- “Ordenar lo que debo y me deben”.
- “Entender mis gastos o una cartola”.
- “Ver qué necesitaría para conectar mis datos”.
- “Prepararme para recibir, pagar o mover dinero” — sólo como explicación/estado si la capacidad aún no está habilitada.

Productos visibles como espacios de exploración: Acompañante financiero, Mi banco, Tarjetas, Ganar y Remesas. Cada uno declara su estado real: `explorable`, `en investigación`, `no disponible` o `por validar`.

### Momento 3 — Elegir una capacidad concreta

**Objetivo:** no pedir “todos los datos”, sino saber qué quiere activar.

Ejemplos de capacidad, no de promesa:

| Intención de la persona | Capacidad candidata | Estado actual del Lab |
|---|---|---|
| “Quiero entender movimientos reales” | `financial_data_connect` | Sólo consentimiento/arquitectura por definir; no conexión SFA activa. |
| “Quiero recibir o mover dinero” | `receive_value` / `transfer_value` | Depende de vehículo, partner, rail, política y controles. |
| “Quiero una tarjeta” | `card_access` | Requiere emisión/issuer, contrato, elegibilidad y controles por definir. |
| “Quiero crédito” | `credit_evaluation` | Requiere producto/partner/política de riesgo y una base válida para evaluar capacidad de pago. |

### Momento 4 — Checklist “Vamos conociéndonos”

Acceso desde el menú de perfil/ajustes. No es un porcentaje genérico de KYC: es una lista de **requisitos por objetivo**.

| Paso | Para qué se solicita | Puede desbloquear | Nunca debe prometer |
|---|---|---|---|
| Canal de acceso (Google/Apple/email/teléfono + control) | Recuperar avance y proteger la cuenta | Continuidad y notificaciones consentidas | Identidad financiera o dinero. |
| Datos de identidad requeridos por una capacidad aprobada | Cumplir la verificación que aplique al producto/partner | Evaluar el siguiente gate | Aprobación automática. |
| Documento y validación de identidad | Cumplir controles de una ruta que los requiera | Posible acceso a un instrumento aprobado | Tarjeta, transferencia o crédito sin condiciones adicionales. |
| Consentimiento de datos financieros | Permitir la lectura específica y revocable que un proveedor aprobado permita | Evaluar información financiera en la finalidad consentida | SFA o conexión bancaria disponible hoy. |
| Información para evaluación de crédito | Analizar un producto de crédito que exista y esté autorizado | Postulación/evaluación, no resultado | Crédito aprobado o un monto. |

**Principio UX:** cada fila muestra “qué te falta”, “por qué” y “qué podría habilitar”; el CTA sólo aparece cuando existe ruta real o demo marcada explícitamente como tal.

### Momento 5 — Revisión, recuperación y ayuda

Toda ruta necesita salida segura:

- Código vencido / demasiados intentos → cambio de canal o reintento con respuesta neutral.
- Contacto existente → recuperación, sin confirmar públicamente que existe una cuenta.
- Proveedor/partner devuelve estado desconocido → `review`; no habilitar capacidad.
- Caso humano → explicar que se inicia una **ruta de ayuda**, no afirmar que se abrió un ticket si no hay integración.

---

## 4. Arquitectura de identidad y datos: separar lo que hoy está mezclado

### Modelo conceptual

| Identificador / objeto | Nace cuándo | Qué representa | Fuente de verdad | No debe contener |
|---|---|---|---|---|
| `anonymous_session_id` | Al explorar | Sesión de visitante y preferencias locales | Cliente/sesión efímera | Identidad, OTP, RUT, documentos. |
| `cognito_sub` | Cuando Cognito autentica/federa | Identidad de credencial en el User Pool | Cognito | Estado KYC, saldo, permisos financieros. |
| `person_id` | BFF valida token e idempotentemente crea/recupera perfil | Identificador estable de YOL1 para persona/perfil | Profile service / DB operacional | Ser el ID de proveedor o el email/teléfono como llave. |
| `access_identity_id` | Vinculación de método de acceso | Relación person ↔ método de acceso | Identity/profile boundary | Atributos financieros. |
| `preregistration_id` | Se acepta guardar el avance para una intención | Estado de relación recuperable, no cuenta financiera | Onboarding service | OTP, documento, biometría o PII cruda en eventos. |
| `kyc_case_ref` | Sólo al abrir una verificación aprobada | Referencia opaca a un caso/proveedor | KYC adapter + proveedor | Evidencia/biometría/documentos replicados sin necesidad. |
| `capability_request_id` | Al solicitar una capacidad | Intención, requisitos y estado de la solicitud | Capability/orchestration service | Autorización efectiva sin decisiones de partner/risgo. |

### Secuencia propuesta de persistencia

1. **Visitante:** sólo sesión local/efímera y preferencias no sensibles.
2. **Inicio de autenticación:** Cognito maneja challenge o federación. No se crea un perfil de negocio desde el navegador.
3. **Token válido:** el BFF verifica firma, `iss`, `aud`, vencimiento y nonce cuando aplique. Luego resuelve o crea `person_id` con una operación idempotente.
4. **Relación guardada:** se crea `access_identity_id` y, si la persona eligió guardar un objetivo, un `preregistration_id` con `capability_key`.
5. **Capacidad solicitada:** se crea `capability_request_id`; el orquestador calcula requisitos por política, producto, partner y riesgo.
6. **KYC/consentimiento:** se abre sólo cuando el request lo requiere. El proveedor entrega estados normalizados, nunca una autorización directa a la UI.
7. **Habilitación:** el owner de la capacidad confirma que legal, partner, contrato, riesgo, operaciones y rail permiten la acción; recién entonces se habilita.

### Regla de deduplicación a decidir

No usar email ni teléfono como clave canónica. Se necesita una política explícita para enlazar `cognito_sub`, métodos federados y una futura identidad validada a `person_id`, incluyendo conflicto, recuperación entre dispositivos y revisión humana. Esta es una decisión de arquitectura y privacidad, no un detalle de UI.

---

## 5. Cognito: decisión técnica candidata

**Candidato:** Cognito User Pool como capa de autenticación y federación, no como perfil de producto completo.

| Decisión | Propuesta | Por qué |
|---|---|---|
| Acceso social | Google y Apple a través de managed login / OAuth, si se aprueba cada proveedor | Cognito puede federar IdPs y normalizar tokens. |
| OTP | Email o teléfono passwordless, con TTL, límite de intentos, single use y rate limit server-side | OTP verifica canal, no identidad. |
| ID de login | Guardar `cognito_sub` como identificador de credencial, nunca como única entidad de negocio | AWS lo define como identificador estable de usuario de pool; YOL1 necesita su propia capa de perfil. |
| Perfil | Crear/recuperar `person_id` tras validar el token en BFF | Permite cambiar o enlazar métodos de acceso sin reescribir el dominio. |
| Eventos | Emitir sólo IDs pseudónimos, estados y versiones de política | Evita PII, OTP y documentos en analytics/warehouse. |
| Cuenta/linking | Flujo explícito de enlace/revisión entre métodos | Evita duplicación silenciosa y account-takeover por matching simplista. |

**No se decide aún:** configuración exacta de User Pool, dominio, proveedores OAuth, política de linking, retención, base operacional, CDP o proveedor KYC. Son decisiones de implementación que requieren Security, Legal, Data y el owner del producto.

---

## 6. Contrato de datos y eventos para el PRD

### Datos que la ficha debe explicitar por pantalla

| Capa | Pregunta que todo equipo debe poder responder |
|---|---|
| Lectura | ¿Qué objeto ve la pantalla y cuál es su system of record? |
| Escritura | ¿Qué comando crea/cambia estado y quién lo autoriza? |
| Identidad | ¿Usa `anonymous_session_id`, `person_id` o `cognito_sub`? ¿Por qué? |
| Consentimiento | ¿Qué finalidad, versión, revocación y auditoría requiere? |
| Evento | ¿Cuál es el nombre canónico, payload permitido, correlación y dueño? |
| Seguridad | ¿Qué PII queda excluida de cliente, logs, analytics y warehouse? |
| Fallo | ¿Qué hace la UI si vence OTP, se duplica el contacto o el proveedor no reconoce estado? |

### Eventos mínimos del onboarding

| Evento | Se dispara al | Propiedades permitidas específicas |
|---|---|---|
| `onboarding_value_viewed` | Mostrar bienvenida | `entry_point`, `copy_version` |
| `access_method_selected` | Elegir Google/Apple/email/teléfono | `method`, `entry_point` |
| `otp_requested` | Backend inicia challenge | `channel_type`, `purpose`, `attempt_bucket` |
| `otp_verified` | Backend confirma challenge | `channel_type`, `attempt_count_bucket` |
| `preregistration_created` | Se persiste una relación/intención | `capability_key`, `identity_state` |
| `capability_requested` | Persona pide una acción material | `capability_key`, `requirements_version`, `availability_state` |
| `requirements_explained` | Ve el gate antes de entregar datos | `capability_key`, `policy_version` |
| `kyc_status_changed` | Adaptador normaliza cambio | `from_status`, `to_status`, `reason_code` |
| `support_route_started` | Abre ayuda | `reason_code`, `surface` |

Propiedades comunes: `event_id`, `event_at`, `anonymous_id` **o** `person_id` pseudónimo, `session_id`, `product_key`, `screen_key`, `action_key`, `schema_version`, `platform`, `app_version`, `correlation_id` y `consent_analytics`.

**Excluir siempre:** email/teléfono crudo, OTP, RUT, número de serie, imagen/documento, biometría, dirección, respuestas crudas de proveedor, token y credenciales.

---

## 7. Chile: implicancias de regulación y partners

Esta sección no es opinión legal. Resume cómo la investigación de Notion debe condicionar el diseño hasta que Legal/Compliance y el partner cierren cada capacidad.

1. La investigación interna identifica que Chile permite un enfoque diferenciado de debida diligencia basado en riesgo; **no debe traducirse automáticamente** como “onboarding sin identidad para una capacidad financiera”.
2. La biometría no debe aparecer como requisito universal de la primera pantalla. Puede ser requerida por partner, producto, instrumento o política de control; esa razón debe mostrarse cuando exista.
3. Las escalas de prepago/límites citadas en la investigación requieren confirmar vehículo, emisor y oferta comercial antes de publicarlas en UI o convertirlas en una promesa.
4. Conectar datos bancarios requiere consentimiento específico, una política de datos y una ruta aprobada. La norma del SFA está en implementación gradual y su entrada en vigor se pospuso a julio de 2027; no basta un botón “conectar banco”.
5. Tarjeta, crédito, transferencia y remesas son capacidades distintas. No se agrupan bajo “KYC listo”. Cada una necesita su matriz de policy/partner/rail/riesgo/operación.

---

## 8. Lo que el rediseño debería mostrar en pantalla

### Ajuste de dirección posterior a la primera versión visual

**Decisión verbal de Felipe (pendiente de incorporar a la próxima versión del prototipo):** la entrada no debe invitar a “Explorar YOL1” ni presentar “explorar sin cuenta” como la acción dominante. La pantalla tiene que llevar con claridad a **registrarse/enrolarse**, pero sin esconder lo que la persona podrá hacer después.

| Primera versión | Dirección nueva |
|---|---|
| CTA: “Explorar YOL1” | CTA: **“Comenzar mi registro”** o **“Registrarme”**. |
| Bifurcación visible: explorar / guardar avance | El registro pasa a ser el camino principal; la exploración queda como contexto/productos visibles, no como CTA competidor. |
| Logo/ilustración protagonista | Sacar la ilustración que no aporta al entendimiento; usar jerarquía, productos y estados de enrolamiento. |
| “Activa más cuando lo necesites” | Eliminar. Mantener sólo: **“Tu plata, más clara. Entiende qué está pasando hoy.”** |
| Checklist genérico de gates | Menú de 4–5 cosas que la persona puede hacer, con estado: disponible al entrar / requiere enrolamiento / por validar. |

**Tratamiento propuesto del home inicial:** incluso antes de completar todos los requisitos, la persona ve los productos/situaciones que está construyendo YOL1. Cada tarjeta distingue de manera muy concreta:

- **Disponible al entrar:** conocer el Acompañante, revisar ideas y entender el producto.
- **Enrólate para desbloquear:** guardar contexto, personalizar, retomar el proceso o abrir la siguiente etapa aprobada.
- **Requiere validación adicional:** conectar datos, operar dinero, tarjeta o crédito; no se muestra como función lista.
- **En investigación / pausado:** productos que aún no tienen flujo público.

Esto mantiene la tesis de transparencia (nunca fingir una capacidad) pero acepta la preferencia de producto: el onboarding empieza por **registro claro**, no por un “modo visitante” protagonizado.

### Qué incorpora el análisis Craft Innovations

El artículo aporta patrones UX, no requisitos aplicables a Chile. Lo que sí debemos tomar:

1. **Promesa antes del formulario:** Revolut y Nubank abren con una razón para entrar, no con campos. En YOL1: “Tu plata, más clara. Entiende qué está pasando hoy.”
2. **Una tarea por pantalla:** verificación, identidad, preferencias y declaración no se mezclan en un formulario largo.
3. **Confirmación y recuperación explícitas:** confirmar canal antes de enviar OTP, mostrar reenvío/contador/autofill si existe y tratar el error como parte normal del flujo.
4. **Roadmap antes de la fricción:** Monzo muestra qué se pedirá, qué ya se completó y qué viene después. YOL1 debe mostrar un checklist por producto/capacidad, no una barra de “KYC”.
5. **Compliance en lenguaje humano:** antes de documento, cámara, consentimiento o datos financieros explicar para qué se piden, qué se hace con ellos y cuál es el siguiente resultado.
6. **Opciones y salidas simétricas:** “Ahora no”, editar, reintentar o pedir ayuda son tan visibles como la acción principal cuando la elección es opcional.
7. **Estados de procesamiento honestos:** si un partner revisa algo, mostrar qué está pasando y plazo sólo si existe un SLA real; si no, “en revisión” + ruta de ayuda.

No debemos copiar de Revolut/Nubank/Monzo sus campos, sus consentimientos ni su secuencia legal: responden a países, licencias y productos distintos. Su aporte a YOL1 es la forma de **anticipar, explicar y recuperar** cada fricción.

### Copy de bienvenida: tres direcciones a testear

1. **Tu plata, más clara.** Entiende qué está pasando hoy.
2. **Tus finanzas, sin empezar por un formulario.** Explora, pregunta y decide qué quieres activar.
3. **YOL1 te ayuda a ordenar el ahora.** Cuando quieras hacer más, te explicamos el siguiente paso.

### Home posterior al acceso — wireframe verbal

```text
Hola, [nombre opcional]. ¿Qué quieres resolver hoy?

[ Ordenar lo que debo y me deben ]
[ Entender mis gastos ]
[ Ver qué necesito para conectar mis datos ]

Ahora en YOL1
  Acompañante financiero · explorable
  Mi banco · por validar
  Tarjetas · en investigación
  Ganar · por diseñar
  Remesas · pausado

☰ Ajustes
  Vamos conociéndonos
  [✓] Guardaste tu acceso
  [ ] Conectar datos — cuando esta ruta esté disponible
  [ ] Validar identidad — sólo si una acción lo requiere
  [ ] Evaluar una tarjeta o crédito — por definir producto/partner
```

La UI no debe solicitar declaración de renta, biometría ni documento por adelantado. Para crédito, el copy debe decir “ver requisitos de evaluación” hasta que producto, base legal, proveedor y política estén definidos.

---

## 9. Preguntas que el PRD/Reviews deben mantener vivas

Cada una debe tener estado clickeable en la ficha: `propuesta`, `por validar`, `respondida`, `bloqueada` o `fuera de alcance`.

### Identidad y persistencia

- ¿Cuál es el momento mínimo aceptable para crear `person_id` y qué consentimiento/copy lo acompaña?
- ¿Cómo se enlaza un Google/Apple login con email/teléfono sin permitir account takeover?
- ¿Qué conserva el visitante tras abandonar y cuánto tiempo?
- ¿Quién decide un contacto duplicado, una recuperación entre dispositivos o una colisión de identidad?

### Capacidad y cumplimiento

- ¿Cuál será la **primera** capacidad material real de YOL1 Chile?
- ¿Qué vehículo, partner y rail la soportarán?
- ¿Qué controles pide cada partner por encima de la regulación base?
- ¿Qué evidencia legal permite solicitar datos o consentimiento para cada producto?

### Experiencia y medición

- ¿En qué pantalla cae hoy la gente y qué explicación reduce ese abandono?
- ¿Qué porcentaje entiende que OTP no es identidad validada?
- ¿Qué requisito sorprende más y se puede anticipar antes del CTA?
- ¿Qué queda accesible al volver tras un fallo, y qué se borra?

### Operación

- ¿Qué estados del proveedor se normalizan a `review`?
- ¿Cuál es la ruta de Customer Success, owner, canal y SLA?
- ¿Cómo se hacen reintentos, idempotencia, auditoría y borrado?
- ¿Qué equipo es dueño de cada evento, contrato y change log?

---

## 10. Decisiones que necesitamos antes de una UI definitiva

| Prioridad | Decisión | Dueño sugerido | Bloquea |
|---|---|---|---|
| P0 | Primera capacidad material real (conectar datos, recibir, otra) | Producto + Negocio | El gate de activación y la secuencia final. |
| P0 | Vehículo/partner/rail de esa capacidad | Negocio + Legal + Operaciones | Todo copy que sugiera disponibilidad. |
| P0 | Política de `person_id`, linking y deduplicación | Arquitectura + Seguridad + Privacidad | SSO/OTP y recuperación reales. |
| P1 | Proveedores de acceso: Google, Apple, email, teléfono | Producto + Ingeniería | Experiencia de entrada y configuración Cognito. |
| P1 | Política OTP / antiabuso / recuperación | Seguridad + Ingeniería + CS | Journey de errores y soporte. |
| P1 | Matriz de requisitos por capability | Producto + Legal + Riesgo | Checklist “Vamos conociéndonos”. |
| P2 | Métricas baseline por paso | Analytics + Producto | Iteración de drop-off y valor. |

---

## 11. Próximo lote recomendado

1. Validar esta tesis con Producto, Legal/Riesgo y Arquitectura, sin mostrar aún límites o instrumentos como disponibles.
2. Elegir la primera capacidad material y completar su capability card: objetivo, partner, requisito, fallback, estado, evento y owner.
3. Hacer mystery shopping fechado de MACH, Tenpo y Global66, documentando: pantalla, dato pedido, error, recuperación y mensaje de valor.
4. Diseñar prototipo del **home de exploración** y del checklist de permisos, separado de la pantalla de KYC actual.
5. Recién después, modificar el flujo interactivo del Lab y agregar tests de estados, eventos y expectativas de copy.

---

## Fuentes y trazabilidad

### Investigación interna

- Notion: `KYC y onboarding progresivo — Análisis por país` (export 4-ago-2026).
- Notion: `Data cruda — KYC (norma por país, benchmarks y pendientes)`.
- Notion: `Modelo de Tiers — Yol1 Personas`.
- Second Brain: `10 PROJECTS/Yol1/KNOWLEDGE/ONBOARDING_CHILE_REVIEW.md` y decisiones asociadas.
- Lab: `PRD-ONBOARDING-KYC-PROGRESIVO.md` y `DIRECCION-PRODUCTOS-FELIPE.md`.

### Fuentes oficiales/primarias de contraste

- AWS: [federación de User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-identity-federation.html) y [claims de ID token](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-id-token.html).
- CMF: [modificación al SFA y calendario de implementación](https://www.cmfchile.cl/portal/prensa/625/w4-article-110881.html).
- Tenpo: [paso a paso vigente para abrir una cuenta](https://www.tenpo.cl/como-abrir-tu-cuenta).
- Revolut: [verificación de identidad](https://help.revolut.com/en-DE/help/profile-and-plan/profile-plan/verifying-identity/how-do-i-verify-my-identity/) y [datos personales solicitados](https://help.revolut.com/help/profile-and-plan/security-and-personal-data/personal-data-queries/what-personal-data-do-i-need-to-submit-to-use-revolut/).

**Lectura correcta de las fuentes:** las referencias externas enseñan patrones o capacidades de sus productos. La aplicabilidad a YOL1 Chile requiere validación vigente con Legal/Compliance, partner y operación antes de ser una afirmación de producto.
