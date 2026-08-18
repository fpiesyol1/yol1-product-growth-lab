---
product_id: prod-builder
name: Construir mi propio producto
product_status: exploracion_piloto_reversible
knowledge_status: semilla
owner: Felipe
updated_at: 2026-08-18
verified_through: null
source_export_id: null
decision_refs: []
notion_refs: []
supersedes: []
---

# Ficha enriquecida — Construir mi propio producto

> Espacio para transformar una idea en una propuesta visual y un brief revisable. No sincroniza conversaciones completas, publica, crea ramas ni modifica el producto oficial sin una acción separada y autorizada.

## Resumen

- **Promesa de exploración:** una persona describe una idea, ve una primera propuesta rápido, itera y entrega un borrador a revisión.
- **Resultado esperado:** propuesta con contexto, pantallas, decisiones, riesgos y siguiente pregunta.
- **No prometer:** conexión universal, canvas compatible en todo cliente, guardado compartido, publicación o edición automática.

## Cobertura de frentes

| Frente | Estado | Síntesis vigente | Fuente | Owner | Revisado |
|---|---|---|---|---|---|
| Producto / negocio | candidato | En exploración: propuesta visual primero; una decisión simple por iteración; revisión humana antes de publicar. | [`MCP-APP-DIRECTION.md`](../../MCP-APP-DIRECTION.md) | Felipe | 2026-08-18 |
| UX / accesibilidad | candidato | Chat y canvas comparten modelo visual; debe funcionar también en modo texto. | [`MCP-APP-DIRECTION.md`](../../MCP-APP-DIRECTION.md) | Producto/Diseño | 2026-08-18 |
| Reglas de negocio | decidido | Para el Lab: guardar crea borrador; enviar va a revisión; publicar/cambiar core son permisos separados. | [`BUILDER-OUTPUT-CONTRACT.md`](../../BUILDER-OUTPUT-CONTRACT.md) | Producto | 2026-08-18 |
| Requisitos funcionales | candidato | Inicio, contexto, propuesta incremental, guardado cuando exista y entrega textual de fallback. | [`MCP-BUILDER-PLAN.md`](../../MCP-BUILDER-PLAN.md) | Producto/Ingeniería | 2026-08-18 |
| Tecnología / arquitectura | candidato | Core versionado, herramientas MCP, `ProjectDraftViewModel` y UI compartida; compatibilidad depende del host. | [`MCP-APP-DIRECTION.md`](../../MCP-APP-DIRECTION.md) | Ingeniería por definir | 2026-08-18 |
| Datos / analytics | por_validar | Guardar solo aportes explícitos y versiones necesarias; no capturar el chat completo por defecto. | [`MCP-APP-DIRECTION.md`](../../MCP-APP-DIRECTION.md) | Datos/Producto | 2026-08-18 |
| Privacidad / seguridad | por_validar | Falta política de identidad, acceso, retención, adjuntos y datos sensibles en propuestas. | [`MCP-BUILDER-PLAN.md`](../../MCP-BUILDER-PLAN.md) | Seguridad/Privacidad por definir | 2026-08-18 |
| Normativa / licencias | por_validar | Validar por propuesta: el Builder no convierte ideas financieras en capacidades autorizadas. Cada producto propuesto mantiene sus gates. | [`DIRECCION-PRODUCTOS-FELIPE.md`](../../DIRECCION-PRODUCTOS-FELIPE.md) | Legal/Compliance por definir | 2026-08-18 |
| Partners / integraciones | por_validar | Soporte de MCP Apps, identidad y persistencia varía por host; no afirmar paridad. | [`MCP-APP-DIRECTION.md`](../../MCP-APP-DIRECTION.md) | Partnerships/Ingeniería | 2026-08-18 |
| Operación / soporte | por_validar | Faltan owner editorial, moderación, recuperación, versionado y SLA de revisión. | [`CATASTRO-ORQUESTACION-PRODUCTO-2026-08-17.md`](../../CATASTRO-ORQUESTACION-PRODUCTO-2026-08-17.md) | Operaciones por definir | 2026-08-18 |
| GTM / engagement | candidato | Medir tiempo a primera propuesta, iteraciones, guardados y percepción de control. | [`QA-GTM-PASADA-2.md`](../../QA-GTM-PASADA-2.md) | Growth por definir | 2026-08-18 |
| QA / resiliencia | candidato | Paridad visual, compatibilidad legacy, fallback texto, confirmación y no-sincronización. | [`MCP-APP-DIRECTION.md`](../../MCP-APP-DIRECTION.md) | Producto/Ingeniería | 2026-08-18 |

## Decisiones y reglas vigentes

- La experiencia comienza con una propuesta, no con un formulario técnico largo.
- La persona decide qué contexto incorporar; no se lee ni se sincroniza el historial completo.
- La compatibilidad se declara por cliente y versión; si no hay UI o guardado, el trabajo continúa en texto.
- Feedback, borrador, publicación e implementación son estados y permisos distintos.

## Vacíos prioritarios

1. Confirmar qué clientes y capacidades están realmente disponibles hoy.
2. Definir identidad, ownership, retención y acceso de borradores.
3. Diseñar la promoción editorial desde propuesta a decisión/tarea sin auto-publicación.
4. Enlazar cada proyecto generado con su propia ficha enriquecida y fuentes.
