---
product_id: prod-onboarding
name: Onboarding
product_status: prototipo_exploratorio
knowledge_status: semilla
owner: Felipe
updated_at: 2026-08-18
verified_through: null
source_export_id: null
decision_refs: []
notion_refs: []
supersedes: []
---

# Ficha enriquecida — Onboarding

> Explora activación progresiva en Chile. OTP confirma un canal; no equivale a identidad verificada, KYC ni habilitación financiera.

## Resumen

- **Promesa de exploración:** entregar valor antes de pedir más datos y explicar qué requisito desbloquearía una intención concreta.
- **Resultado esperado:** pre-registro comprensible y siguiente gate explícito, sin pedir identidad sensible en la demo.
- **No prometer:** apertura de cuenta, aprobación, conexión bancaria, KYC completado ni capacidad monetaria.

## Cobertura de frentes

| Frente | Estado | Síntesis vigente | Fuente | Owner | Revisado |
|---|---|---|---|---|---|
| Producto / negocio | decidido | Para el prototipo: explorar primero; pedir canal y OTP después de elegir una ruta concreta. | [`PIVOTE-ONBOARDING-PROGRESIVO-CHILE-2026-08-18.md`](../../PIVOTE-ONBOARDING-PROGRESIVO-CHILE-2026-08-18.md) | Felipe | 2026-08-18 |
| UX / accesibilidad | decidido | Para el prototipo: una decisión principal por pantalla; propósito, consecuencia y siguiente paso visibles. | [`PRD-ONBOARDING-KYC-PROGRESIVO.md`](../../PRD-ONBOARDING-KYC-PROGRESIVO.md) | Producto/Diseño | 2026-08-18 |
| Reglas de negocio | candidato | Gate por `capability_key`; OTP, consentimiento, identidad y KYC son estados distintos. | [`PRD-ONBOARDING-KYC-PROGRESIVO.md`](../../PRD-ONBOARDING-KYC-PROGRESIVO.md) | Producto/Ingeniería | 2026-08-18 |
| Requisitos funcionales | decidido | Definido para la demo: Bienvenida, exploración, gate, canal, OTP, pre-registro y handoff a Mi banco. | [`MVP-SPEC.md`](../../MVP-SPEC.md) | Producto | 2026-08-18 |
| Tecnología / arquitectura | candidato | Cognito y orquestación AWS son referencias, no selección cerrada. | [`ESTANDAR-QA-TECNICO-PRD.md`](../../ESTANDAR-QA-TECNICO-PRD.md) | Ingeniería por definir | 2026-08-18 |
| Datos / analytics | por_validar | Identidad, consentimiento, KYC y analytics deben permanecer separados y versionados. | [`PRD-ONBOARDING-KYC-PROGRESIVO.md`](../../PRD-ONBOARDING-KYC-PROGRESIVO.md) | Datos por definir | 2026-08-18 |
| Privacidad / seguridad | por_validar | Faltan threat model, scopes, deduplicación, recuperación y política de retención. | [`QA-TECNICO-PASADA-2.md`](../../QA-TECNICO-PASADA-2.md) | Seguridad por definir | 2026-08-18 |
| Normativa / KYC / licencias | por_validar | Marco chileno exige evaluación por capability, vehículo, partner y controles. | [`PIVOTE-ONBOARDING-PROGRESIVO-CHILE-2026-08-18.md`](../../PIVOTE-ONBOARDING-PROGRESIVO-CHILE-2026-08-18.md) | Legal/Compliance por definir | 2026-08-18 |
| Partners / integraciones | por_validar | Proveedor OTP/KYC, revisión manual y sistema de identidad final no definidos. | [`PRD-ONBOARDING-KYC-PROGRESIVO.md`](../../PRD-ONBOARDING-KYC-PROGRESIVO.md) | Ingeniería/Partnerships | 2026-08-18 |
| Operación / soporte | por_validar | Falta ownership de revisión, timeout, rechazo, recuperación y pérdida de dispositivo. | [`PRD-ONBOARDING-KYC-PROGRESIVO.md`](../../PRD-ONBOARDING-KYC-PROGRESIVO.md) | Operaciones por definir | 2026-08-18 |
| GTM / engagement | candidato | Medir comprensión, inicio, gate visto y continuidad; no usar presión para capturar identidad. | [`QA-PRODUCTO-GTM-2026-08-14.md`](../../QA-PRODUCTO-GTM-2026-08-14.md) | Growth por definir | 2026-08-18 |
| QA / resiliencia | decidido | Definido para el prototipo: máquina de estados y transiciones inválidas; probar abandono, error y scroll/handoff. | [`PRD-ONBOARDING-KYC-PROGRESIVO.md`](../../PRD-ONBOARDING-KYC-PROGRESIVO.md) | Producto/Ingeniería | 2026-08-18 |

## Decisiones y reglas vigentes

- Valor y exploración preceden a la captura de identidad.
- Los requisitos se piden por capacidad concreta, no por una escalera universal de KYC.
- El resultado de un proveedor se normaliza; la UI no depende de sus estados crudos.
- Analytics no es fuente de verdad para identidad, consentimiento o habilitación.

## Vacíos prioritarios

1. Confirmar vehículo, partner, política y matriz de capabilities.
2. Definir identidad canónica, merge, recuperación y consentimiento versionado.
3. Asignar ruta humana, owner y SLA de revisión.
4. Reconciliar normativa y reglas con la próxima exportación de Notion.
