---
product_id: prod-tarjetas
name: Tarjetas
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

# Ficha enriquecida — Tarjetas

> Research y borrador local con datos sintéticos. No demuestra emisión, credenciales, pago, wallet, QR, NFC, beneficios disponibles ni readiness operacional.

## Resumen

- **Líneas de investigación:** tarjeta digital, movimientos, controles, beneficios, tarjeta compartida/corporativa y wallet.
- **No prometer:** instrumento emitido, datos reales, transacción, elegibilidad, soporte de fraude, wallet o beneficio vigente.

## Cobertura de frentes

| Frente | Estado | Síntesis vigente | Fuente | Owner | Revisado |
|---|---|---|---|---|---|
| Producto / negocio | candidato | En investigación: validar problema y prioridad antes de presentar una tarjeta como producto. | [`DIRECCION-PRODUCTOS-FELIPE.md`](../../DIRECCION-PRODUCTOS-FELIPE.md) | Felipe | 2026-08-18 |
| UX / accesibilidad | candidato | Intención, acceso protegido ficticio, movimiento y beneficio contextual en demo. | [`RESEARCH-TARJETAS-YOL1-2026-08-14.md`](../../RESEARCH-TARJETAS-YOL1-2026-08-14.md) | Producto/Diseño | 2026-08-18 |
| Reglas de negocio | por_validar | Separar estimado, activado y confirmado; fuente, vigencia, elegibilidad y fulfillment. | [`RESEARCH-TARJETAS-YOL1-2026-08-14.md`](../../RESEARCH-TARJETAS-YOL1-2026-08-14.md) | Producto/Operaciones | 2026-08-18 |
| Requisitos funcionales | candidato | Ver estado y evidencia puede explorarse; emisión, pago y controles reales quedan fuera. | [`PRD-TARJETAS-YOL1.md`](../../PRD-TARJETAS-YOL1.md) | Producto | 2026-08-18 |
| Tecnología / arquitectura | por_validar | Hacen falta issuer/processor, tokenización, autorización, ledger y soporte definidos. | [`RESEARCH-TARJETAS-YOL1-2026-08-14.md`](../../RESEARCH-TARJETAS-YOL1-2026-08-14.md) | Ingeniería por definir | 2026-08-18 |
| Datos / analytics | por_validar | PAN/CVV/OTP y detalle sensible quedan fuera de analytics; falta modelo productivo. | [`QA-GTM-PASADA-2.md`](../../QA-GTM-PASADA-2.md) | Datos/Seguridad por definir | 2026-08-18 |
| Privacidad / seguridad | por_validar | Requiere threat model, PCI/controles aplicables, autenticación y respuesta a fraude. | [`RESEARCH-TARJETAS-YOL1-2026-08-14.md`](../../RESEARCH-TARJETAS-YOL1-2026-08-14.md) | Seguridad por definir | 2026-08-18 |
| Normativa / licencias | por_validar | Emisión, operación, wallet y pagos dependen de vehículo, partner y marco chileno. | [`RESEARCH-TARJETAS-YOL1-2026-08-14.md`](../../RESEARCH-TARJETAS-YOL1-2026-08-14.md) | Legal/Compliance por definir | 2026-08-18 |
| Partners / integraciones | por_validar | No hay emisor, processor, network, wallet o proveedor de beneficios aprobado. | [`PRD-TARJETAS-YOL1.md`](../../PRD-TARJETAS-YOL1.md) | Partnerships por definir | 2026-08-18 |
| Operación / soporte | por_validar | Falta fraude, chargeback, bloqueo, reemplazo, reclamos y SLA. | [`QA-TARJETAS-PASADA-1.md`](../../QA-TARJETAS-PASADA-1.md) | Operaciones por definir | 2026-08-18 |
| GTM / engagement | candidato | En investigación: beneficios y control podrían crear hábito, pero elegibilidad y economics no están validados. | [`QA-GTM-PASADA-2.md`](../../QA-GTM-PASADA-2.md) | Growth por definir | 2026-08-18 |
| QA / resiliencia | candidato | Probar estados, frescura, acceso, error y copy sin exponer datos ni simular éxito real. | [`QA-BUILDER-PASADA-CANONICA-03.md`](../../QA-BUILDER-PASADA-CANONICA-03.md) | Producto/Ingeniería | 2026-08-18 |

## Gates antes de avanzar

1. Confirmar si Tarjetas sigue visible públicamente o pasa a modo Equipo.
2. Elegir el problema prioritario, no el instrumento completo.
3. Validar vehículo, emisor/partner, seguridad, normativa y operación.
4. Definir ownership común de movimientos para evitar duplicar Cartola y Tarjetas.
