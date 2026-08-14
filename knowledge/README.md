# Base de conocimiento conversacional de YOL1

Esta carpeta es la fuente editorial legible del Product Growth Lab. Contiene únicamente ejemplos ficticios y reglas aprobables; no entrena un modelo, no consulta bancos y no guarda datos financieros personales.

## Estructura

- `INDEX.md`: catálogo breve, estado y archivo fuente de cada pregunta madre.
- `finanzas.md`, `cartola.md`, `cobrar-y-pagar.md`, `ahorrar.md`: fichas por dominio.
- `WORKFLOW-POR-VOZ.md`: guía para convertir un dictado de Felipe en conocimiento revisable.
- `construir-mi-propio-producto.md`: marco de ideación colaborativa, contexto exportable y límites del futuro MCP.
- `lib/ai/knowledge-catalog.ts`: representación TypeScript manual que usa el Lab en runtime. Cada entrada enlaza su Markdown mediante `source`.
- `lib/ai/knowledge-router.ts`: resuelve reglas, preguntas aprobadas y fallback.

## Formato de ficha

Cada ficha debe incluir:

1. **ID** estable y único.
2. **Estado:** `borrador` o `aprobada`.
3. **Intención** que intenta resolver.
4. **Pregunta canónica** o pregunta madre.
5. **Variantes:** hasta diez paráfrasis, seguimientos o ambigüedades trazables.
6. **Respuesta esperada:** qué veo, qué significa y qué puede hacer ahora.
7. **Evidencia/contexto requerido.**
8. **Límites / qué no afirmar.**
9. **Siguiente pregunta útil.**
10. **Feedback conocido** y origen de la decisión.

Una variante nunca introduce un hecho nuevo. Si el dictado contiene un dato no verificado, queda como borrador y no entra al router.

## Flujo de publicación

Markdown aprobado → actualización manual de `knowledge-catalog.ts` → evaluaciones → build → revisión. No existe edición desde el navegador ni sincronización automática. El visor `/review/knowledge` permite leer, buscar y marcar localmente una ficha para mejorar.
