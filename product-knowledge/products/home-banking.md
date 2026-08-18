---
product_id: prod-home-banking
name: Home Banking
product_status: investigacion
knowledge_status: semilla
owner: Felipe
updated_at: 2026-08-18
verified_through: null
source_export_id: null
decision_refs: []
notion_refs: []
supersedes: []
---

# Ficha enriquecida — Home Banking

> Línea de investigación sobre momentos financieros útiles. No es una cuenta, banco digital ni servicio conectado disponible.

## Resumen

- **Tesis:** responder “¿cómo me sirven mis finanzas hoy?” según momento, vencimientos, patrones y decisiones pendientes.
- **No prometer:** saldo oficial, movimientos en tiempo real, conexión, transferencia, pago o disponibilidad bancaria.

## Cobertura de frentes

| Frente | Estado | Síntesis vigente | Fuente | Owner | Revisado |
|---|---|---|---|---|---|
| Producto / negocio | candidato | En investigación: debe probar momentos y utilidad antes de definir una góndola bancaria. | [`DIRECCION-PRODUCTOS-FELIPE.md`](../../DIRECCION-PRODUCTOS-FELIPE.md) | Felipe | 2026-08-18 |
| UX / accesibilidad | candidato | Situación contextual → evidencia → recomendación → acción voluntaria. | [`DISCOVERY-HOME-BANKING-TARJETAS.md`](../../DISCOVERY-HOME-BANKING-TARJETAS.md) | Producto/Diseño | 2026-08-18 |
| Reglas de negocio | por_validar | Reglas de momentos, frescura, certeza y elegibilidad aún no tienen fuente productiva. | [`DISCOVERY-HOME-BANKING-TARJETAS.md`](../../DISCOVERY-HOME-BANKING-TARJETAS.md) | Producto/Datos | 2026-08-18 |
| Requisitos funcionales | candidato | Prompts contextuales y destinos informativos; sin ejecución real. | [`DISCOVERY-HOME-BANKING-TARJETAS.md`](../../DISCOVERY-HOME-BANKING-TARJETAS.md) | Producto | 2026-08-18 |
| Tecnología / arquitectura | por_validar | Requiere fuentes, normalizador, reglas versionadas y contratos antes de elegir servicios. | [`ESTANDAR-QA-TECNICO-PRD.md`](../../ESTANDAR-QA-TECNICO-PRD.md) | Ingeniería por definir | 2026-08-18 |
| Datos / analytics | por_validar | No hay fuente real, permiso, frescura ni semántica acordados. | [`DISCOVERY-HOME-BANKING-TARJETAS.md`](../../DISCOVERY-HOME-BANKING-TARJETAS.md) | Datos por definir | 2026-08-18 |
| Privacidad / seguridad | por_validar | Debe minimizar finanzas y separar ledger, reglas, analítica y engagement. | [`ESTANDAR-QA-TECNICO-PRD.md`](../../ESTANDAR-QA-TECNICO-PRD.md) | Seguridad por definir | 2026-08-18 |
| Normativa / licencias | por_validar | Depende de si solo explica datos o conecta, inicia o ejecuta capacidades reguladas. | [`QA-PRODUCTO-GTM-2026-08-14.md`](../../QA-PRODUCTO-GTM-2026-08-14.md) | Legal/Compliance por definir | 2026-08-18 |
| Partners / integraciones | por_validar | No hay partner o fuente bancaria aprobada. | [`MVP-SPEC.md`](../../MVP-SPEC.md) | Partnerships por definir | 2026-08-18 |
| Operación / soporte | por_validar | Faltan manejo de datos viejos, discrepancias, indisponibilidad y reclamos. | [`QA-TECNICO-PASADA-2.md`](../../QA-TECNICO-PASADA-2.md) | Operaciones por definir | 2026-08-18 |
| GTM / engagement | candidato | Validar si un momento contextual genera acción y retorno. | [`DIRECCION-PRODUCTOS-FELIPE.md`](../../DIRECCION-PRODUCTOS-FELIPE.md) | Growth por definir | 2026-08-18 |
| QA / resiliencia | por_validar | Probar fuente, frescura, certeza, discrepancia, fallback y reversión por momento. | [`DISCOVERY-HOME-BANKING-TARJETAS.md`](../../DISCOVERY-HOME-BANKING-TARJETAS.md) | Producto/Ingeniería | 2026-08-18 |

## Gates antes de diseñar como ejecutable

1. Elegir un momento prioritario y una fuente confiable.
2. Definir permiso, frescura, calidad y fallback del dato.
3. Separar lectura, recomendación, intención y ejecución.
4. Resolver vehículo, partner, normativa, operación y soporte de la capability concreta.
