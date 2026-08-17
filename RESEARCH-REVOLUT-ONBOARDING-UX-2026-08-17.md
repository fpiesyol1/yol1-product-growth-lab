# Research — Revolut onboarding UX: patrones transferibles a YOL1

**Fuente analizada:** `ux-ebook-revolut-oboarding-analysis.pdf` de Craft Innovations, 26 páginas, revisado el 17 de agosto de 2026.  
**Uso correcto:** es una referencia de experiencia y secuencia. No es un requisito legal chileno, una especificación de Revolut, ni evidencia de que un partner o servicio esté disponible para YOL1.

**Decisión YOL1 que prevalece:** el patrón de registro primero no se adopta. Felipe definió valor y exploración antes de identidad; email/teléfono y OTP aparecen sólo después de que la persona elige una ruta concreta y entiende sus requisitos. La referencia se usa para claridad, errores y recuperación, no para cambiar ese orden.

---

## 1. Lectura ejecutiva

La lección útil no es replicar un onboarding bancario largo ni copiar los pasos de Revolut. Es organizar la confianza:

1. La persona entiende **por qué entrar** antes de entregar datos.
2. Cada pantalla resuelve **una sola tarea**.
3. Todo requisito aparece con su **propósito, consecuencia y siguiente paso**.
4. Un error se puede corregir en el mismo momento; nunca obliga a comenzar de cero.
5. La identidad, la intención y las capacidades financieras se tratan como capas distintas.

Para YOL1, eso permite una entrada más clara sin prometer banco, tarjeta, transferencia, crédito, SFA o KYC real antes de que exista una ruta aprobada.

---

## 2. Qué muestra la referencia y cómo se traduce

| Patrón observado | Valor de UX | Traducción YOL1 | Límite / no asumir |
|---|---|---|---|
| Propuesta de valor antes de alta | Reduce el inicio a una razón humana para continuar. | Hero: **“Tu plata, más clara. Entiende qué está pasando hoy.”** | No usar “banco”, “cuenta” o “opera” si no existe la capacidad. |
| Beneficios visuales y concretos | Convierte servicios abstractos en situaciones comprensibles. | Mostrar 4–5 capacidades/situaciones con estado de enrolamiento. | No convertirlas en catálogo de funciones activas. |
| Número/email + confirmación del canal | Evita errores antes del OTP y crea continuidad. | SSO candidato + email o teléfono; confirmación simple del canal antes del challenge. | OTP/SSO controla acceso, no verifica identidad financiera. |
| Contador, reenvío y corrección de OTP | Evita ansiedad y abandona menos gente. | TTL, intentos, reenvío y recuperación visibles como contrato de UX. | La política real la define Seguridad/Cognito; no revelar existencia de cuenta. |
| Permisos explicados antes del sistema operativo | La persona sabe para qué acepta. | Notificaciones y cualquier consentimiento se piden sólo cuando aportan algo concreto. | No pedir permisos por anticipación ni marcar consentimiento como implícito. |
| Campos con ejemplos y validación temprana | Evita corrección tardía. | Microcopy de formato, feedback local y accesibilidad en email/teléfono. | Formato válido no prueba identidad, titularidad ni elegibilidad. |
| Identidad por etapas y con reintento | Hace la verificación tolerante a fallas. | Documento/biometría sólo en la capacidad/política que lo requiera; pre-chequeos y reintento. | No asumir que biometría o cédula son universales ni que YOL1 tiene proveedor activo. |
| Preguntar uso previsto como chips | Convierte un posible requisito de compliance en una selección legible. | “¿Qué quieres resolver?” como intención: ordenar, entender movimientos, recibir/mover dinero, tarjeta, crédito. | La clasificación/compliance final depende de política y partner. |
| Progreso y estados de revisión claros | Reduce la incertidumbre de una espera. | Checklist **“Vamos conociéndonos”** por capacidad y estados: pendiente, en revisión, listo para el siguiente gate. | Nunca mostrar “aprobado” o capacidad habilitada sin decisión del orquestador. |
| Personalización posterior | Humaniza el espacio una vez resuelto lo esencial. | Preferencias, alias o notificaciones sólo después/como opcionales. | No anteponer marketing, ads, upsell o perfil social al valor y la seguridad. |

---

## 3. Propuesta de flujo YOL1 v2

### A. Bienvenida: valor y mapa de posibilidades

**Objetivo:** explicar qué obtiene la persona y qué no representa el Lab.

```text
Tu plata, más clara.
Entiende qué está pasando hoy.

YOL1 te ayuda a ordenar preguntas, pendientes y próximos pasos de tus finanzas.
[ Explorar YOL1 ]
```

Debajo del CTA: una grilla de capacidades, no una segunda ruta de navegación competitiva.

| Situación | Estado honesto | Qué muestra |
|---|---|---|
| Entender mis finanzas | Disponible al entrar | Acompañante y preguntas de ejemplo. |
| Guardar mi avance | Al registrarte | Continuidad y recuperación de acceso. |
| Conectar datos | Requiere ruta y consentimiento | Explicación, no conexión activa. |
| Recibir o mover dinero | Requiere validación adicional | Gate a definir por capability, rail y partner. |
| Tarjeta o crédito | En diseño / por validar | Requisitos por definir; ninguna promesa de aprobación. |

**Aplicación YOL1:** conservar `Explorar YOL1` como CTA principal y hacer que entregue valor sin registro. El acceso se ofrece después de elegir una ruta y entender qué se guardará. La grilla de capacidades funciona como contexto honesto, no como catálogo operativo.

### B. Crear acceso después de elegir una ruta: una elección por vez

1. Elegir Google, Apple, email o teléfono.
2. Antes de enviar OTP: confirmar el canal enmascarado y explicar “lo usaremos para entrar y recuperar tu espacio”.
3. Resolver challenge: input de código, ayuda de reenvío/expiración, cambio de canal y ruta de recuperación neutral.
4. Éxito: “Tu espacio está guardado”; no decir “tu cuenta bancaria está creada”.

**Contratos de ingeniería:** Cognito/User Pool puede proveer `cognito_sub`; el BFF valida token y crea/recupera `person_id` idempotentemente. `cognito_sub` es credencial; `person_id` es la relación de dominio de YOL1. No exponer ni registrar OTP, email/teléfono crudos, token o PII en analytics.

### C. Primer home: una pregunta, no una góndola

```text
Hola, [nombre si existe]. ¿Qué quieres resolver hoy?
```

Sugerencias iniciales:

- Ordenar lo que debo y me deben.
- Entender gastos o una cartola.
- Ver qué necesitaría para conectar mis datos.
- Prepararme para recibir, pagar o mover dinero.

Cada tarjeta abre una explicación/capability request, nunca un flujo real simulado como si ya existiera.

### D. Menú “Vamos conociéndonos”

Es un checklist contextual por objetivo; no una barra genérica de KYC.

| Objetivo elegido | Próximo requisito posible | Copy de explicación | Resultado real |
|---|---|---|---|
| Retomar mi espacio | Control de canal | “Te permite volver de manera segura.” | acceso/recuperación, no identidad. |
| Entender movimientos reales | Consentimiento específico | “Sólo para la finalidad y proveedor aprobados.” | una solicitud evaluable, no datos conectados. |
| Recibir o mover dinero | Identidad/controles que defina la capability | “Te diremos qué falta antes de pedirlo.” | revisión de requisitos, no dinero habilitado. |
| Tener tarjeta | Producto, emisor, contrato y elegibilidad | “No significa que la tarjeta esté aprobada.” | evaluación de ruta. |
| Pedir crédito | Producto/política y evidencia permitida | “Sirve para evaluar, no garantiza resultado.” | postulación o análisis, si existe el producto. |

---

## 4. Arquitectura que la UI debe hacer entendible

```text
visitante
  └── anonymous_session_id (efímero, no sensible)
        └── Cognito / federación / OTP
              └── token validado en BFF
                    ├── cognito_sub (credencial)
                    ├── person_id (relación estable YOL1)
                    └── preregistration_id (intención recuperable)
                          └── capability_request_id
                                └── requisitos por producto + policy + partner + riesgo
                                      └── habilitación sólo por owner/capability aprobada
```

El deck/ficha de producto de Onboarding debe explicar esta cadena en cuatro perspectivas:

1. **Lo que la persona ve:** pantalla, copy, CTA, estado y salida.
2. **Lo que el producto decide:** intención, gate, requisito y resultado esperado.
3. **Lo que tecnología persiste/lee:** system of record, ID, comando, evento permitido y exclusiones de PII.
4. **Lo que puede fallar:** OTP, contacto existente, verificación, provider desconocido, abandono y ruta humana.

---

## 5. Requisitos UX comprobables para el próximo prototipo

- [ ] Sólo un CTA dominante por pantalla.
- [ ] La persona conoce el propósito del dato/permisos antes de entregarlo.
- [ ] Todo gate muestra “para qué”, “qué podría habilitar” y “qué no garantiza”.
- [ ] OTP tiene expiración, reenvío, cambio de canal y recuperación neutral visibles en demo.
- [ ] Un error de captura puede corregirse sin perder la intención/capacidad elegida.
- [ ] El progreso indica estados reales, no porcentajes decorativos.
- [ ] El menú distingue acceso, información, consentimientos e identidad; no los llama a todos KYC.
- [ ] Capacidad no disponible se muestra como estado, no como botón operativo.
- [ ] Todas las acciones internas del teléfono tienen `event_name`, `screen_key`, `action_key`, IDs pseudónimos, `event_at`, `schema_version`, `consent_analytics` y `correlation_id` en su ficha.
- [ ] Ningún evento/estado lleva email, teléfono, OTP, RUT, serie, documento, biometría, dirección, token ni respuesta cruda de proveedor.

---

## 6. Decisiones abiertas que la referencia no resuelve

1. La primera capacidad material real de YOL1.
2. Vehículo, partner, rail, contrato, controles y owner de cada capability.
3. Política real de Cognito/OTP, recuperación, anti-enumeración, rate limit y linking multi-dispositivo.
4. Si SSO Google/Apple se ofrece desde el día uno y en qué plataformas.
5. Proveedor de KYC, evidencias requeridas, almacenamiento, retención y ruta de Customer Success.
6. Cuándo existe una conexión de datos financieros aprobada en Chile y qué consentimiento/versionado exige.

---

## 7. Fuentes y trazabilidad

- `DISCOVERY-ONBOARDING-CHILE-2026-08-17.md` — síntesis de Notion, Second Brain, referentes y guardrails de YOL1.
- `PRD-ONBOARDING-KYC-PROGRESIVO.md` — contrato local vigente para la demo.
- `DIRECCION-PRODUCTOS-FELIPE.md` — decisiones de producto de mayor prioridad.
- PDF de Craft Innovations: `ux-ebook-revolut-oboarding-analysis.pdf` — patrones UX y análisis de referencia, no regulación.
- AWS Cognito documentation — federación/validación de tokens (fuente técnica candidata).
- CMF Chile — estado del SFA y anexo técnico (fuente regulatoria; validar con Legal/Compliance).
