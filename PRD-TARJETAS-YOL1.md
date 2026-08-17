# PRD exploratorio — Tarjetas YOL1

**Versión:** 0.2 · pasada local 1  
**Estado:** discovery/prototipo interno, en investigación
**Fuente canónica:** `DIRECCION-PRODUCTOS-FELIPE.md`  
**Research:** `RESEARCH-TARJETAS-YOL1-2026-08-14.md`

## Producto en una frase

Tarjetas es el lugar al que una persona entra para resolver una intención alrededor de una compra o instrumento: elegir cómo pagar, acceder a un dato protegido, entender un movimiento/alerta o evaluar un beneficio.

## Problema

Instrumentos, movimientos y condiciones están dispersos. Antes de comprar, la persona puede no recordar qué medio conviene; después, un estado ambiguo o beneficio no verificado deteriora confianza. La intensidad y frecuencia de este problema en Chile están por validar.

## First value candidato

En menos de una tarea, la persona entiende una opción y su porqué, o interpreta correctamente el último movimiento sin confundir recomendación/handoff con pago.

## Journey de la pasada 1

1. Selecciona intención.
2. Entrega contexto mínimo o abre una superficie directa.
3. Ve evidencia, fuente, frescura y límites.
4. Decide revelar/continuar/ignorar.
5. Recibe confirmación visible de qué ocurrió **y qué no ocurrió**.

## Pantallas locales

| Pantalla | Trabajo | Happy path | Salida/errores |
|---|---|---|---|
| Elegir | Preparar una decisión | monto/categoría/preferencia → recomendación explicada | sin datos, editar contexto, alternativa no elegible |
| Datos | Acceder deliberadamente | enmascarado → explicación → step-up simulado → dato ficticio | cancelar, ocultar, expirar/salir |
| Movimiento | Entender qué ocurrió | estado/fuente/frescura → explicación/ayuda | desconocido, desactualizado, pendiente, reversado |
| Beneficio | Evaluar valor real | match → elegibilidad/activación/resultado → interés | vencido, no elegible, sin confirmación |

## Alertas

Primera alerta: último movimiento pendiente/no reconocido. Debe contener evidencia y dos acciones simuladas: `Entender el estado` y `No lo reconozco`. No bloquea tarjeta ni crea disputa.

## Datos

### Guardar en una versión real — por validar

- Intención y preferencia explícita.
- Alias/referencia opaca del instrumento.
- Estado de movimiento y referencia a fuente.
- Regla/versión que explica recomendación o alerta.
- Estado de beneficio: estimado, requiere activación, confirmado/reversado.

### Consultar — por validar

- Instrumentos autorizados y estado.
- Movimientos normalizados, fuente y frescura.
- Catálogo versionado, condiciones, elegibilidad y financiador.
- Consentimientos y alcance vigente.

### Nunca en analytics/logs generales

PAN, CVV, PIN, OTP, tokens, biometría, credenciales wallet, QR completo, monto/comercio exactos cuando no sean indispensables.

## Eventos candidatos

`cards_home_viewed`, `payment_intent_selected`, `card_details_requested`, `card_details_revealed`, `card_movement_viewed`, `card_alert_action_selected`, `card_benefit_reviewed`, `card_benefit_interest_saved`.

Metadata separada: `event_id`, identificador permitido, `event_at`, `product_key`, `screen_key`, `action_key`, plataforma, versión, origen, estado de consentimiento y correlación. Categoría/monto deben minimizarse o agruparse; nunca secretos.

## Arquitectura sugerida — no decidida

- React Native para experiencia móvil.
- BFF/API Gateway y servicios de instrumentos, movimientos, recomendaciones/beneficios, alertas y consentimiento.
- AWS con almacenes separados por dominio, auditoría y observabilidad.
- Proveedor/emisor/processor/rail sólo después de capability matrix y contrato.

## KYC, licencias y seguridad Chile

- El prototipo no identifica ni procesa datos reales.
- Ver credenciales reales, ejecutar controles o pagar requiere definir rol de YOL1, emisor/partner, autenticación, PCI scope, fraude, soporte y normativa aplicable.
- KYC no habilita por sí solo tarjeta, QR, NFC, wallet o pagos.
- QR/NFC/wallet/compartida/corporativa se mantienen fuera de la pasada 1.

## Métrica de aprendizaje

Porcentaje de participantes que resuelve su intención e identifica correctamente qué ejecutó YOL1 y qué quedó sólo recomendado/simulado.

Anti-métricas: confusión `recomendación = pago`, `pendiente = confirmado`, `estimado = ganado`; exposición de secretos; beneficio no elegible; alerta sin salida clara.

## Gates

1. **Comprensión:** sin confusión operacional crítica.
2. **Utilidad:** la recomendación/estado cambia o confirma una decisión con razón entendida.
3. **Confianza:** acceso protegido se siente proporcional y controlable.
4. **Datos:** fuente, consentimiento, frescura y revocación demostrables.
5. **Operación:** partner/roles, fraude, soporte, reversas y conciliación definidos.
6. **Economics:** evento atribuible y waterfall neto plausible.

Cada gate habilita sólo el siguiente aprendizaje; no aprueba producto ni roadmap.

## Trazabilidad de la iteración 0.2

- Se reemplazó cualquier lectura de instrumento YOL1 por `INSTRUMENTO DE PRUEBA · FICTICIO`.
- Los eventos visibles del componente se normalizaron a `snake_case` y se añadió un test que impide secretos en sus nombres.
- Se verificó el flujo completo en navegador local y se agregó foco visible.
- Se documentó la duplicidad atajos/navegación como variable de aprendizaje, no patrón decidido.
- QA y handoff: `QA-TARJETAS-PASADA-1.md` y `CHECKPOINT-TARJETAS-PASADA-1.md`.
