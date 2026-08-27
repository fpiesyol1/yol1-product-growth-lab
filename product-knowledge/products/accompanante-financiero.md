---
product_id: prod-acompanante
name: Acompañante financiero
product_status: exploracion_activa
knowledge_status: ficha_viva
owner: Felipe
updated_at: 2026-08-26
verified_through: 2026-08-26
source_export_id: null
decision_refs: []
notion_refs: []
supersedes: []
---

# Ficha viva — Acompañante financiero

> Producto principal del Lab. La implementación actual usa datos ficticios y autoridad `recommend-only`; no conecta bancos ni ejecuta acciones financieras.

## Resumen

- **Promesa de exploración:** ayudar a entender finanzas y simplificar decisiones cotidianas con evidencia.
- **Persona y momento:** alguien que necesita entender el mes, revisar movimientos o deuda formal y decidir su siguiente paso. Las cuentas sociales se abren en Cuentas Claras.
- **Resultado esperado:** una conclusión clara, evidencia revisable y una acción voluntaria o reversible.
- **No prometer:** detección infalible, saldo oficial, ahorro garantizado, disputa, pago, cobro o cambio automático.

## Cobertura de frentes

| Frente | Estado | Síntesis vigente | Fuente | Owner | Revisado |
|---|---|---|---|---|---|
| Producto / negocio | decidido | Acompañante interpreta finanzas, cartolas y deuda; no administra cuentas compartidas. Resume Cuentas Claras y hace handoff explícito. | [`README.md`](../../README.md) | Felipe | 2026-08-26 |
| UX / accesibilidad | decidido | Para el prototipo: valor antes que conexión; evidencia antes que conclusión; persona controla la acción. | [`MVP-SPEC.md`](../../MVP-SPEC.md) | Producto/Diseño por definir | 2026-08-18 |
| Reglas de negocio | decidido | Para el prototipo: detecta, explica y recomienda; no ejecuta. Ignorar y acciones materiales deben ser claras y reversibles. | [`MVP-SPEC.md`](../../MVP-SPEC.md) | Producto | 2026-08-18 |
| Requisitos funcionales | candidato | Resumen financiero, cartola, explicación de señales, plan de deuda formal sintético, ahorro y conversación contextual. Cuentas Claras conserva el ledger social. | [`README.md`](../../README.md) | Producto/Ingeniería | 2026-08-26 |
| Tecnología / arquitectura | candidato | React Native + AWS son referencia; servicios y contratos finales no están elegidos. | [`ESTANDAR-QA-TECNICO-PRD.md`](../../ESTANDAR-QA-TECNICO-PRD.md) | Ingeniería por definir | 2026-08-18 |
| Datos / analytics | por_validar | El Lab usa fixtures. Datos reales requieren fuente, frescura, clasificación, consentimiento y trazabilidad. | [`ESTANDAR-QA-TECNICO-PRD.md`](../../ESTANDAR-QA-TECNICO-PRD.md) | Datos por definir | 2026-08-18 |
| Privacidad / seguridad | por_validar | En el Lab se decidió usar sólo datos ficticios; la separación productiva de PII, finanzas y analytics sigue por validar. | [`AI-ARCHITECTURE.md`](../../AI-ARCHITECTURE.md) | Seguridad/Privacidad por definir | 2026-08-18 |
| Normativa / licencias | por_validar | Validar por capacidad: entender o recomendar no autoriza conexiones, iniciación, pagos, crédito ni otras actividades reguladas. | [`ESTANDAR-QA-TECNICO-PRD.md`](../../ESTANDAR-QA-TECNICO-PRD.md) | Legal/Compliance por definir | 2026-08-18 |
| Partners / integraciones | por_validar | No existe partner bancario, de pago o mensajería aprobado en esta ficha. | [`MVP-SPEC.md`](../../MVP-SPEC.md) | Partnerships por definir | 2026-08-18 |
| Operación / soporte | por_validar | Faltan owner, revisión manual, SLA, fraude/error y escalamiento. | [`QA-TECNICO-PASADA-2.md`](../../QA-TECNICO-PASADA-2.md) | Operaciones por definir | 2026-08-18 |
| GTM / engagement | candidato | Se explora utilidad cotidiana y retorno; no hay PMF ni economics demostrados. | [`MVP-SPEC.md`](../../MVP-SPEC.md) | Growth por definir | 2026-08-18 |
| QA / resiliencia | decidido | Para el Lab: ciclo técnico/PRD, producto/GTM y consistencia; build y guardrails locales. | [`QA-CICLO-TRIPLE.md`](../../QA-CICLO-TRIPLE.md) | Producto/Ingeniería | 2026-08-18 |

## Decisiones y reglas vigentes

- La explicación debe separar **qué veo**, **qué significa** y **qué puedes hacer ahora**.
- Toda evidencia declara fuente, certeza y límite; un dato derivado no reemplaza la evidencia.
- La acción material requiere confirmación y nunca se infiere desde un click o una recomendación.
- La ficha interna no se muestra como contenido técnico al visitante público.

## Métricas y aprendizaje

- **Éxito del prototipo:** la persona distingue evidencia, interpretación, límite y siguiente paso; los saldos sociales coinciden con Cuentas Claras.
- **Activación candidata:** una situación prioritaria es comprendida y deriva en una acción voluntaria o handoff contextual completado.
- **Retención candidata:** la persona vuelve por evidencia nueva o un cambio real de estado, no por una notificación genérica.
- **PMF:** requiere retorno sostenido, utilidad cualitativa e impacto verificable. Un click, una recomendación vista o un handoff simulado no lo demuestran.
- Los eventos actuales deben rotularse como implementados/persistidos o candidatos; `data-event-id` por sí solo no es telemetría efectiva.

## Vacíos prioritarios

1. Definir fuentes reales autorizadas y sistema de registro por dominio.
2. Separar capabilities de lectura, recomendación, preparación y ejecución con gates propios.
3. Definir owners de datos, seguridad, Legal/Compliance, operación y soporte.
4. Reconciliar reglas y decisiones con la próxima exportación completa de Notion.

## Propagación pendiente

- Llevar esta ficha al formato completo cuando existan decisiones y owners confirmados.
- Hacer que una futura vista Equipo lea esta fuente en vez de mantener otra copia.
- Enlazar feedback aprobado y preguntas técnicas a IDs `LRN-` y `DEC-`.
