# Research de producto — Tarjetas YOL1

**Corte:** 14 de agosto de 2026  
**Autoridad:** `DIRECCION-PRODUCTOS-FELIPE.md`  
**Estado:** evidencia para hipótesis; no aprueba emisión, pagos, QR, NFC, wallet, partners ni beneficios.  
**Alcance:** intención de compra, acceso seguro, último movimiento, alertas y beneficios. Compartida/corporativa queda en research, no prototipo.

## 1. Respuesta ejecutiva

La evidencia revisada respalda diseñar Tarjetas como una secuencia de trabajos, no como una representación de plástico:

`quiero comprar → elijo criterio → reviso opción/condiciones → accedo sólo al dato necesario → observo el evento → resuelvo alerta → verifico beneficio`

La primera pasada local debe explorar cuatro superficies: elegir cómo pagar, revelar datos ficticios con un step-up explicado, entender un movimiento todavía no final y revisar elegibilidad/condiciones de un beneficio. La acción transaccional queda reemplazada por `Preparar mi elección`, `Ver por qué`, `Entender el estado` o `Me interesa`.

## 2. Patrones observados y lectura YOL1

| Patrón | Evidencia primaria | Qué adaptar al Lab | Qué no inferir |
|---|---|---|---|
| Acceso bajo demanda a credenciales | Monzo permite ver CVC y número desde la app después de confirmar identidad con PIN o biometría configurada. [Fuente oficial](https://monzo.com/blog/2022/05/04/view-cvc-in-app) | Datos enmascarados por defecto; explicar el step-up antes de revelar; ocultar al salir | Método de autenticación, timeout, PCI scope o capability YOL1 |
| Seguridad como loop visible | Monzo combina notificaciones inmediatas, tarjetas virtuales, 3DS y congelar tarjeta. [Fuente oficial](https://monzo.com/learn/money-safety/how-monzo-helps-you-shop-safely) | La alerta debe mostrar evento, evidencia y siguiente paso; el usuario mantiene control | Que YOL1 puede congelar, autorizar o emitir una tarjeta |
| Resolver un movimiento desde su detalle | Ante un pago no reconocido, Monzo propone congelar, revisar comercio/ubicación/fecha y luego reportar. [Fuente oficial](https://monzo.com/help/payments-troubleshooting/unrecognised-payment-web) | `Último movimiento` debe responder estado, fuente, frescura y ayuda contextual | Ruta de fraude o soporte disponible en YOL1 |
| Intención y reglas reducen carga mental | Curve Smart Rules enruta por categoría o monto y conserva una tarjeta default; su propuesta incluye corrección posterior. [Fuente oficial](https://www.curve.com/smart-rules/) | Primero preguntar criterio de la persona; luego sugerir y explicar alternativas | Automatización, re-enrutamiento post compra o agregación de tarjetas factible en Chile |
| Beneficio = elegibilidad + enrolamiento + transacción + fulfillment | Amex Offers exige elegibilidad, inscripción previa en una tarjeta específica, compra que cumpla términos y acreditación posterior, potencialmente reversible. [Fuente oficial](https://www.americanexpress.com/en-us/benefits/offers/partner-terms/) | Separar `estimado`, `activado` y `confirmado`; mostrar fuente, tope, vigencia, canal y financiador | Cobertura, disponibilidad, actualización o acuerdo para YOL1 |
| Wallet/NFC no es una simple pantalla | Apple exige entitlement, acuerdo, requisitos de seguridad/certificación y licencia o acuerdo con entidad habilitada; Chile es territorio elegible bajo condiciones. [Fuente oficial](https://developer.apple.com/support/nfc-se-platform) | Mantener NFC/wallet fuera del prototipo; registrar gates de entitlement, partner, certificación y UX | Que elegibilidad territorial equivale a acceso o readiness |
| Autenticación y trazabilidad tienen obligaciones aplicables | La CMF fijó estándares mínimos de seguridad, registro y autenticación para emisores y prestadores fiscalizados, con ARC obligatoria en casos definidos. [Fuente oficial](https://www.cmfchile.cl/portal/prensa/625/w4-article-95680.html) | Diseñar clasificación de dato/acción y threat model antes de escoger step-up | Que una demo determine el mecanismo legalmente correcto |
| Emisión/operación son roles regulados del sistema | El BCCh enumera normas específicas para emisores y operadores de tarjetas dentro de los sistemas de bajo valor. [Fuente oficial](https://www.bcentral.cl/areas/sistemas-de-pagos) | Capability matrix debe separar YOL1, emisor, operador, red, comercio y soporte | Que tener UX, KYC o partner prospectivo habilite pagos |

## 3. Tendencias de comportamiento convertidas en hipótesis

### H1 — La entrada dominante no es “mi tarjeta”, sino “qué necesito ahora”

- **Señal:** productos innovadores organizan acciones alrededor de compra, seguridad, regla, alerta o beneficio.
- **Prueba YOL1:** cuatro atajos de intención y tarea libre; observar qué atajo elige la persona sin instrucción.
- **Métrica:** intención resuelta sin buscar otra superficie.
- **Kill/pivot:** las personas sólo buscan una cartola o una credencial y el selector agrega fricción.

### H2 — Explicar el step-up agrega control sólo si el dato vale la fricción

- **Señal:** revelar credenciales en apps bancarias ocurre bajo confirmación de identidad.
- **Prueba YOL1:** comparar `Ver datos ficticios` directo versus explicación breve previa.
- **Métrica:** comprensión de por qué se verifica + abandono.
- **Kill/pivot:** el usuario interpreta step-up como habilitación de pago o no necesita el dato.

### H3 — El último movimiento es una superficie de confianza, no una fila de cartola

- **Señal:** los flujos de fraude comienzan por revisar detalle y distinguir situaciones antes de reportar.
- **Prueba YOL1:** pedir interpretar `pendiente`, fuente, actualización y acción apropiada.
- **Métrica:** estado interpretado correctamente y siguiente paso correcto.
- **Kill/pivot:** no se puede obtener semántica/frescura suficiente de la fuente futura.

### H4 — Una alerta útil conecta evidencia con una acción reversible

- **Señal:** alertas inmediatas y controles funcionan como loop; una notificación aislada no resuelve el problema.
- **Prueba YOL1:** alerta de movimiento pendiente/no reconocido con `Entender` y `No lo reconozco`, ambos simulados.
- **Métrica:** comprensión, falso positivo percibido y acción elegida.
- **Kill/pivot:** la alerta aumenta ansiedad o sugiere una capability inexistente.

### H5 — El beneficio contextual necesita contrato de estados

- **Señal:** programas reales separan elegibilidad, enrolamiento, compra calificante y acreditación/reversa.
- **Prueba YOL1:** mostrar beneficio con tres estados: estimado, requiere activación, confirmado.
- **Métrica:** la persona puede explicar qué falta antes de afirmar “gané”.
- **Kill/pivot:** fuente/condiciones no pueden mantenerse actualizadas o el beneficio no cambia conducta.

## 4. Mapa de intención para el primer prototipo

| Intención | Primer valor | CTA permitido | Evento candidato | No incluye |
|---|---|---|---|---|
| Elegir cómo pagar | Opción + criterio + alternativas | `Preparar mi elección` | `payment_intent_selected` | Iniciar pago |
| Ver datos | Dato ficticio bajo step-up explicado | `Ver datos ficticios` | `card_details_requested` | PAN/CVV real, wallet |
| Revisar movimiento | Estado, fuente, frescura y ayuda | `Entender el estado` | `card_movement_viewed` | Cartola oficial, disputa real |
| Resolver alerta | Evidencia + acción reversible | `No lo reconozco` | `card_alert_action_selected` | Bloqueo/reclamo real |
| Ver beneficio | Elegibilidad, condiciones y estimación | `Ver condiciones` | `card_benefit_reviewed` | Activación o descuento real |

## 5. Hipótesis expresamente fuera del prototipo

| Hipótesis | Gate técnico | Gate legal/partner | Gate UX | Estado |
|---|---|---|---|---|
| QR para pagar | esquema, generación/lectura, antifraude, reconciliación | rail, emisor/operador, aceptación | distinguir intención de ejecución | Por validar |
| NFC propio | entitlement, Secure Element, certificación, dispositivos | entidad habilitada/acuerdo y perímetro Chile | presentment, autenticación y fallbacks | Por validar |
| Agregar a wallet | provisioning, tokenización y lifecycle | emisor/red/OS/partner | disponibilidad y recuperación | Por validar |
| Tarjeta compartida | roles, límites, trazabilidad | titularidad, responsabilidad, emisor | privacidad y aprobación | Por validar |
| Tarjeta corporativa | políticas, expense controls, conciliación | empresa, emisor, fiscalidad y contrato | admin/usuario/soporte | Por validar |
| Re-enrutar compra posterior | ledger, reversa, settlement | modelo contractual y permisos | expectativa y explicabilidad | Por validar |

## 6. Implicaciones de diseño para la pasada 1

1. Mantener `Tarjetas` con `explorable: false` en la especificación interna y, mientras siga accesible en el selector, rotularla **En investigación · Borrador local**; no usar `NO PUBLICADO` como copy público.
2. Rotular la pantalla `BORRADOR LOCAL · DATOS SINTÉTICOS · NO PAGA`.
3. Usar un instrumento ficticio sin logos de red, banco real o partner.
4. No mostrar QR, NFC, wallet ni CTA `Pagar`.
5. Mostrar movimiento `PENDIENTE` para comprobar comprensión de estados no finales.
6. Beneficio: declarar catálogo ficticio, elegibilidad/activación pendientes y resultado estimado.
7. Evento breve en la ficha; metadata separada y sin PAN/CVV/OTP/monto exacto/comercio completo.

## 7. Decisiones por validar

1. ¿Qué intención domina la home: pagar, datos, movimiento, alerta o beneficio?
2. ¿Tarjetas orienta instrumentos externos, representa un instrumento futuro YOL1/partner o ambos por capas?
3. ¿El último movimiento pertenece a Tarjetas, Cartola o aparece en ambos con una fuente común?
4. ¿Quién proveería el primer catálogo de beneficios y con qué SLA/atribución?
5. ¿Qué acciones de alerta puede ofrecer YOL1 sin ser emisor/operador?
