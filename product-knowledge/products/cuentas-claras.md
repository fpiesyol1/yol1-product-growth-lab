---
product_id: prod-cuentas-claras
name: Cuentas Claras
product_status: prototipo_exploratorio
knowledge_status: ficha_viva
owner: Felipe
updated_at: 2026-08-27
verified_through: 2026-08-27
source_export_id: null
decision_refs: []
notion_refs: []
supersedes: [cobrar-y-pagar]
---

# Ficha enriquecida — Cuentas Claras

> Fuente de verdad de acuerdos y deudas sociales. Este entregable sólo ejecuta simulaciones locales: no conecta Floid, bancos o WhatsApp y no mueve ni custodia dinero.

## 1. Resumen y estado

- **Promesa:** registrar lo acordado, dividir con precisión y reducir el trabajo social de cobrar, dejando trazabilidad del seguimiento.
- **Usuario primario:** quien adelantó dinero o administra un grupo.
- **Segundo journey crítico:** invitado que recibe un link y completa un abono simulado sin registrarse.
- **Resultado esperado:** grupo, gasto, reparto, deuda y remanente coinciden en todas las pantallas.
- **Estado:** prototipo funcional mobile-only, con datos demo y `MockFloidPaymentProvider` local.
- **No prometer:** transferencia, custodia, conexión bancaria, conciliación real, mensaje enviado, cuenta receptora verificada ni KYC completado.

## 2. Cobertura de frentes

| Frente | Estado | Síntesis | Fuente | Owner | Revisado |
|---|---|---|---|---|---|
| Producto / negocio | decidido | Wedge de acuerdos sociales previo a licencia. Este Lab mide éxito de tarea; creación o cierre simulado no demuestran PMF. | reunión Nico/Felipe + [`README.md`](../../README.md) | Felipe | 2026-08-26 |
| UX / accesibilidad | decidido | iPhone 17 Pro Max lógico 440×956, una tarea principal y controles ≥44 px. | [`app/cuentas-claras/page.tsx`](../../app/cuentas-claras/page.tsx) | Producto/Diseño | 2026-08-26 |
| Reglas de negocio | decidido | Sólo `succeeded` simulado crea settlement; parcial reduce saldo; replay no duplica. | [`lib/debt-center/domain.ts`](../../lib/debt-center/domain.ts) | Ingeniería | 2026-08-26 |
| Tecnología | decidido para Lab | Next.js + repository adapter; memoria o Neon/Postgres/Drizzle; proveedor siempre MockFloid. | [`lib/debt-center/state-repository.ts`](../../lib/debt-center/state-repository.ts) | Ingeniería | 2026-08-26 |
| Privacidad / seguridad | decidido para Lab | Cookie de sesión opaca, ledger aislado, protección same-origin, body ≤16 KiB, DTO público mínimo y límites durables del simulador. No equivale a autenticación productiva. | auditoría QA 2026-08-26 | Seguridad | 2026-08-26 |
| Partners | fuera de runtime | No hay Floid, banco, rail o WhatsApp operativo. Cualquier integración es futura (Prop.). | [`FLOID-CHILE-SANDBOX-LAB.md`](../../FLOID-CHILE-SANDBOX-LAB.md) | Legal/Partnerships | 2026-08-26 |
| QA / resiliencia | decidido | Dominio cubre parcialidad, replay, sobrepago, estados terminales y cero red Floid. | [`tests/debt-center.test.mjs`](../../tests/debt-center.test.mjs) | QA/Ingeniería | 2026-08-26 |

## 3. Alcance y no-alcance

### Incluye

- grupos, participantes, gastos y reparto igual, por monto, porcentaje o partes;
- obligaciones sociales, saldo, actividad y abonos parciales;
- borrador WhatsApp que sólo copia texto/link;
- pagador público sin cuenta YOL1;
- banco, rechazo, cancelación, expiración y comprobante simulados;
- read model agregado de sólo lectura para el Acompañante.
- gastos habituales mensuales asistidos: guardan un snapshot y preparan un borrador que siempre exige confirmación.
- saldo simplificado derivado por grupo, siempre reversible a la vista Por gasto y sin mutaciones.
- anulación creator-first de un gasto sin abonos, cierre de links viejos y copia prellenada con linaje.

### No incluye

- dinero real, custodia, wallet o cuenta grupal;
- Floid real, OAuth, webhook, cartolas, CMF o REDEC;
- envío automático de mensajes;
- edición del ledger desde el Acompañante;
- KYC o registro obligatorio del pagador invitado.

## 4. Reglas de negocio

| ID | Regla | Estado | Excepción / reversión |
|---|---|---|---|
| `CC-BR-001` | Todo gasto CLP es entero seguro, mayor que cero y ≤ $100.000.000. | decidido | Error inline; no reinterpreta `-100` o `1e9`. |
| `CC-BR-002` | El pagador pertenece a los participantes y el reparto suma exactamente el total. | decidido | No permite avanzar hasta corregir. |
| `CC-BR-002A` | Porcentajes viajan como puntos base enteros que suman 10.000; partes como pesos enteros cuya suma es mayor que cero. | decidido | Sin floats ni reinterpretación silenciosa. |
| `CC-BR-002B` | Porcentaje o partes pueden ser cero para una persona seleccionada; el resultado CLP se calcula con mayor resto y desempate por orden estable. | decidido | La suma siempre coincide con el total, incluso con residuos de $1. |
| `CC-BR-003` | Un abono es positivo y no supera el saldo pendiente. | decidido | Rechazo sin cambiar el ledger. |
| `CC-BR-004` | `failed`, `cancelled` y `expired` no crean settlement. | decidido | Nuevo intento usa nueva clave. |
| `CC-BR-005` | Un resultado terminal no retrocede y un replay devuelve el mismo resultado. | decidido | Conflicto explícito si cambia el payload. |
| `CC-BR-006` | WhatsApp siempre abre un borrador; copiar no equivale a enviar. | decidido | Confirmación visible “no se envió nada”. |
| `CC-BR-007` | Una plantilla mensual nunca crea por sí sola gasto, deuda, mensaje o pago. | decidido | Sólo `materialize_recurring_occurrence` explícito crea una ocurrencia; omitir y pausar no crean obligaciones. |
| `CC-BR-008` | Copiar un mensaje nunca equivale a compartirlo. Sólo la declaración explícita “Sí, ya lo compartí” queda persistida. | decidido | La UI atribuye el estado a la persona y nunca afirma entrega, lectura o confirmación de WhatsApp. |
| `CC-BR-009` | El saldo simplificado es sólo una sugerencia matemática derivada. | decidido | No crea deudas, pagos, links ni settlements; Por gasto conserva el ledger original. |
| `CC-BR-010` | Corregir nunca modifica un gasto financiero en sitio. | decidido | Sólo el creador puede anular sin abonos ni pagos activos; el original queda auditable y el reemplazo nace con IDs nuevos. |

## 5. Requisitos

### Funcionales

- `CC-FR-001`: crear grupo y abrirlo inmediatamente.
- `CC-FR-002`: agregar gasto desde un grupo conservando grupo, participantes y pagador válidos.
- `CC-FR-003`: mostrar en revisión quién pagó y cada parte antes de crear.
- `CC-FR-004`: $10.000 → pago simulado $5.000 → pendiente $5.000.
- `CC-FR-005`: recargar durante un intento parcial conserva el monto reservado.
- `CC-FR-006`: reabrir una deuda pagada muestra historia, no un nuevo abono.
- `CC-FR-007`: éxito del invitado no abre el tablero privado del cobrador.
- `CC-FR-008`: crear un gasto abre inmediatamente una cola con sólo sus obligaciones nuevas y vuelve a ella después de copiar cada borrador.
- `CC-FR-009`: recargar un comprobante terminal conserva el monto de ese intento; no prepara un segundo pago.
- `CC-FR-010`: el pagador puede abrir un gasto propio vacío; la URL no transporta token, deuda, persona ni monto anteriores.
- `CC-FR-011`: después de terminar o postergar la cola de cobros, un gasto puede guardarse como patrón mensual sin interrumpir el loop principal.
- `CC-FR-012`: un borrador mensual permite crear, omitir o pausar; doble tap/retry nunca duplica la ocurrencia.
- `CC-FR-013`: confirmar un cobro compartido persiste al recargar y un replay no duplica la declaración.
- `CC-FR-014`: un cobro ya compartido permite preparar un seguimiento por el saldo vigente usando el mismo link.
- `CC-FR-015`: pago iniciado, abono parcial y cierre se derivan del ledger y tienen precedencia sobre la declaración manual.
- `CC-FR-016`: A→B $10.000 y B→C $10.000 puede mostrarse como A→C $10.000 sin cambiar ninguna obligación original.
- `CC-FR-017`: anular un gasto elegible cierra sus links demo, conserva historia y prepara una única copia; un gasto con abono queda bloqueado.

### Técnicos y no funcionales

- pantalla 440×956, regresión 390×844 y 320×568;
- objetivos táctiles ≥44×44, foco visible y un solo scroll interno;
- idempotencia server-side para gasto e intento;
- fuente única para dashboard, chat y resumen del Acompañante;
- cero llamadas de red a Floid bajo cualquier entorno.

## 6. Datos, privacidad y seguridad

| Entidad | Fuente de verdad | Sensibilidad | Regla actual |
|---|---|---|---|
| `DebtGroup`, `DebtExpense`, `DebtShare` | ledger Cuentas Claras | social | demo; no analytics crudo |
| `Debt`, `Settlement` | ledger Cuentas Claras | financiero social | unión por fuente; comandos idempotentes y reversa auditable |
| `MockStatement`, `ReconciliationCandidate`, `ReconciliationDecision` | fixture local + ledger | evidencia ficticia | referencia exacta única puede autoaplicar; ambigüedad exige decisión humana |
| `PaymentAttempt` | simulador | operacional | DTO público mínimo |
| `SharedExpense.correction` | ledger Cuentas Claras | auditoría social | motivo cerrado, actor, fecha y reemplazo; nunca guarda tokens ni borra el original |
| `ExpenseDraftV1` | sessionStorage | temporal | ID opaco, TTL 24 h, fail-closed |
| `RecurringExpenseTemplate`, `RecurringOccurrence` | ledger Cuentas Claras | social / operacional | snapshot versionado, natural key por mes y creación explícita |
| `CollectionShareConfirmation` | ledger Cuentas Claras | operacional | declaración idempotente del acreedor; no es evidencia de envío o lectura |
| `DebtCenterSummaryV1` | proyección del ledger | agregado | Acompañante sólo lee |

El Lab aísla el workspace por cookie opaca, protege mutaciones por origen, limita el body a 16 KiB, restringe a 8 intentos por deuda en 15 minutos y a 50 intentos totales, y reinicia sólo la sesión actual. Además limita grupos, personas, gastos y deudas. El agregado tiene un techo total de 900 KiB y reserva 100 KiB por cada intento activo; así cada resultado terminal y su evidencia mínima pueden guardarse incluso si otra deuda mantiene un pago en curso. Poda actividad y elimina workspaces tras siete días sin actividad. En producción `DATABASE_URL` es obligatorio y el repositorio falla cerrado si falta. Autenticación y operación multi-tenant formales siguen fuera del prototipo **(Prop.)**.

## 7. Normativa, KYC, licencias y partners

- El prototipo no ejecuta una actividad financiera real.
- El pagador invitado no pasa por Onboarding.
- El OTP del Lab es ficticio: sólo recorre el flujo. En un producto futuro, un OTP real podría demostrar control del canal, nunca identidad ni autorización para recibir dinero.
- Cuenta receptora, iniciación real y lectura bancaria quedan fuera del entregable **(Prop.)**.

## 8. Arquitectura e integraciones

| Capacidad | Estado | Sistema / contrato | Idempotencia y recuperación |
|---|---|---|---|
| dashboard | actual | `getDebtDashboard` + repository adapter | lectura versionada |
| crear grupo | actual | `POST /api/debt-center · create_group` | `commandId` opaco y replay sin duplicar participantes |
| crear gasto | actual | `createSharedExpense(commandId)` | `commandId` opaco |
| corregir gasto | actual | `cancelExpenseForCorrection(commandId)` + nueva llamada a `createSharedExpense` | anulación creator-first, mismo grupo, actor verificable y un solo reemplazo |
| gasto habitual | actual | `createRecurringTemplate` + `materialize/skip/pause` | `commandId` opaco + natural key `templateId/occurrenceKey` |
| preparar abono | actual | `createPayin` + MockFloid | key por deuda+monto |
| resultado | actual | endpoint `simulate` | transición terminal monotónica |
| WhatsApp | actual | portapapeles local + `confirm_collection_shared` | copiar no escribe; confirmación manual idempotente; no envío ni callback |
| cartola y conciliación demo | actual | fixture `mock_statement_v1` + regla local | load, confirm, reject, reopen y reverse idempotentes; cero red |
| Floid real | fuera de runtime | investigación futura (Prop.) | no seleccionable |

## 9. Experiencia, estados y accesibilidad

Flujo cobrador: Inicio → grupo → gasto → participantes/pagador → reparto → revisión → cola de cobros nuevos → detalle por persona → borrador WhatsApp → copiar → declarar si lo compartió → volver a la cola. Si queda saldo, puede preparar un seguimiento usando el mismo link.

Flujo invitado: link → contexto → todo/parcial → banco demo → autorización simulada → resultado/remanente → cerrar o abrir un gasto propio limpio.

Flujo habitual: gasto creado → terminar/postergar cola de cobros → guardar patrón mensual → borrador visible → revisión explícita → crear una sola ocurrencia o bien omitir/pausar. No existe cron, scheduler, push, mensaje ni cobro automático.

Flujo de conciliación: tocar “Simular cartola nueva” → cargar cuatro movimientos ficticios → aplicar sólo una referencia exacta y única → mostrar $5.000 abonados y $5.000 pendientes → dejar un segundo movimiento ambiguo sin efecto → confirmar, descartar o revisar después. Una reversa compensa el registro y conserva la evidencia; nunca revierte una transferencia.

Estados: carga, vacío, error, borrador recuperado, intento, cancelado, rechazado, expirado, parcial, pagado e histórico. Los diálogos mueven/trapan foco, cierran con Escape y devuelven foco al disparador.

## 10. Eventos, métricas y aprendizaje

Los nombres `group_created`, `expense_created`, `collection_queue_viewed`, `collection_debt_selected`, `collection_draft_copied`, `collection_shared_confirmed_by_creator`, `collection_followup_draft_copied`, `collection_followup_shared_confirmed`, `payment_link_opened`, `payment_attempt_started`, `payer_result_viewed`, `payment_attempt_cancelled`, `payer_creator_intent_selected`, `recurring_prompt_viewed`, `recurring_rule_created`, `recurring_due_viewed`, `recurring_expense_created`, `recurring_occurrence_skipped`, `recurring_rule_paused`, `handoff_started` y `handoff_completed` son **eventos candidatos**. En este corte varios existen sólo como atributos o estados locales; no se debe inferir telemetría persistida sin verificar su implementación.

También son candidatos `mock_statement_loaded`, `reconciliation_auto_applied`, `reconciliation_reviewed`, `reconciliation_confirmed_by_creator`, `reconciliation_rejected`, `reconciliation_reopened`, `reconciliation_reversed`, `group_netting_viewed`, `group_netting_gross_viewed`, `expense_correction_started`, `expense_cancelled_for_correction` y `expense_replacement_created`. Miden comprensión y corrección de tareas demo; la tasa de auto-match está determinada por el fixture y el uso del neteo o una corrección no prueba PMF.

- **Éxito del prototipo:** la misma deuda conserva grupo, reparto, abono y remanente coherentes; el invitado termina la simulación sin registro.
- **Activación candidata futura:** deuda válida creada y link abierto por una persona distinta. `first_valid_debt_created` por sí solo no alcanza.
- **Valor candidato futuro:** cierre respaldado por evidencia real, sin seguimiento manual del acreedor.
- **Retención candidata:** el mismo grupo crea un nuevo gasto en un ciclo posterior.
- **Retención del patrón mensual:** porcentaje de reglas creadas desde un gasto fuente que materializan su primera repetición dentro de ±7 días de la fecha mensual prevista; es proxy de hábito, no prueba de PMF.
- **Finalización autodeclarada del cobro (candidata):** `collection_task_self_reported_completion_rate = deudas iniciales únicas con collection_shared_confirmed_by_creator / deudas iniciales únicas con collection_draft_copied`, dentro de la misma sesión o 24 horas. Mide sólo que la persona declaró terminar la tarea; no prueba envío, entrega, lectura, activación, valor, retención ni PMF. Todavía no es medible de punta a punta porque los eventos no están instrumentados completamente.
- **Evidencia de PMF:** retención por cohortes, repetición orgánica, adopción sostenida del loop y evidencia cualitativa de dolor resuelto. OTP, registro, atributos visuales y settlements simulados no cuentan.
- **Guardrails:** duplicados, sobrepago, abandono e interpretación como pago real.

Propiedades analíticas permitidas **(Prop.)**: IDs opacos, `entry_source`, `result_state`, bucket de cantidad de deudas, `simulator=true` y versión de esquema. Nunca nombres, contactos, montos, banco elegido, token público ni texto del mensaje.

## 11. Operación, soporte y GTM

Entrada primaria por la persona que adelantó dinero; secundaria por link. No hay soporte de dinero real. Reset, fallas y resultados se declaran demo. Owner operativo y moderación de una demo pública siguen pendientes.

## 12. Riesgos y QA

| Riesgo | Prevención | Prueba | Estado |
|---|---|---|---|
| doble abono | idempotencia + terminal monotónico | replay no crea settlement | cubierto |
| parcial cambia al recargar | monto congelado en intento | reload conserva $5.000 | cubierto |
| link reenviado | identidad asociada visible | explica dónde se acredita | cubierto UX |
| visitantes comparten estado | sesión/tenant opaco | dos sesiones aisladas | cubierto para Lab |
| simulación parece real | copy + Mock-only | cero red, resultado simulado | cubierto |
| prompt habitual compite con cobranza | aparece como tarjeta posterior, nunca como modal encadenado | cerrar/terminar no abre otro diálogo | cubierto UX |
| plantilla futura parece vencida | sólo las fechas alcanzadas son accionables | fecha futura no aparece como borrador listo | cubierto UX |
| reparto anterior se aplica sin revisión | pagador y cada parte visibles antes de confirmar | snapshot completo en pantalla | cubierto UX |
| omisión accidental | confirmación explícita con mes y efecto | primer toque no muta | cubierto UX |
| copia interpretada como envío | confirmación separada atribuida a la persona | copiar solo no cambia el ledger | cubierto por contrato |
| estado perdido al recargar | `CollectionShareConfirmation` durable | reload conserva “Compartido por ti” | cubierto por contrato |
| cartola demo parece conexión real | copy local + fixture inmutable | UI dice sin banco/Floid/red | cubierto por contrato |
| misma entrada cierra dos cuentas | natural key por `statementEntryId` | segundo candidato falla sin efectos | cubierto por tests |
| auto-match incorrecto | sólo referencia exacta, única y reversible | monto/nombre/fecha aislados exigen revisión | cubierto por contrato |
| neteo altera acuerdos originales | proyección derivada y sólo lectura | no crea deuda, settlement, link ni CTA de pago | cubierto por contrato |
| transferencia sugerida sin gasto directo confunde | explicación visible + modo Por gasto | A→B y B→C explica por qué sugiere A→C | cubierto UX |
| pérdida de links en serverless | Neon obligatorio en producción | sin `DATABASE_URL` falla cerrado | cubierto por contrato |

## 13. Decisiones, contradicciones y preguntas

- Decidido: Floid sólo simulado.
- Decidido: Acompañante y Cuentas Claras son complementarios, no dos ledgers.
- Decidido: conciliación de cartola es completamente sintética; referencia exacta única puede autoaplicar y toda ambigüedad exige confirmación.
- Decidido: el neteo simplificado es una proyección privada, determinista y sólo lectura; nunca reemplaza gastos, links o pagos.
- Decidido: la corrección financiera creator-first anula el original sin borrarlo y prepara una sola copia; abonos y pagos activos bloquean.
- Pendiente: objeción multi-actor y resolución visible para participante y creador.
- Pendiente (Prop.): verificación de receptor si existiera dinero real.

## 14. Feedback y aprendizajes

- La fricción principal es social: pedir y cerrar, no transferir.
- El invitado necesita entender en menos de cinco segundos y sin instalar.
- “Pago confirmado” se diferencia de “acuerdo registrado”.
- WhatsApp funciona mejor como preview fiel que como CTA abstracto.

## 15. Propagación

Esta ficha es autoridad para README, MCP, conocimiento y LivingSpec. `cobrar-y-pagar` sólo puede redirigir aquí; no debe recuperar acciones en el Acompañante.

## 16. Fuentes y frescura

- reunión Nico/Felipe, conversación de producto y steers de Felipe;
- código y tests locales verificados el 27-08-2026;
- benchmarks oficiales investigados: Splitwise, Spliit, tricount, Wise Bill Split y Monzo/Revolut;
- documentación Floid sólo como investigación futura, no evidencia ejecutable.

## 17. Historial

| Fecha | Cambio | Autor / aprobador |
|---|---|---|
| 2026-08-26 | Ficha viva inicial y contrato MockFloid-only | equipo YOL1 / aprobación pendiente Felipe |
| 2026-08-27 | Split V2 y gasto habitual asistido mensual con confirmación explícita | equipo YOL1 / aprobación pendiente Felipe |
| 2026-08-27 | Seguimiento durable del cobro, límites/TTL del workspace y Neon fail-closed | equipo YOL1 / aprobación pendiente Felipe |
| 2026-08-27 | Cartola local y conciliación explicable: exacta automática, ambigua humana y reversa auditable | equipo YOL1 / aprobación pendiente Felipe |
