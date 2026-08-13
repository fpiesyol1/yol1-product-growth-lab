# Conocimiento de YOL1

La primera base de conocimiento vive en `lib/ai/knowledge.ts`: es pequeña, versionada y contiene únicamente hechos sintéticos aprobados para este Lab. El prompt del servidor agrega esos hechos a cada conversación; no hay vector database, MCP ni fuentes externas.

## Cómo mejorarla

1. Revisar feedback asociado a respuestas y detectar un patrón repetido.
2. Proponer un cambio concreto en conocimiento, instrucciones o ejemplo.
3. Agregar un caso representativo en `evals/yol1-cases.json`.
4. Ejecutar build y guardrails; revisar manualmente respuestas y seguridad.
5. Aprobar el cambio mediante branch/PR. Solo entonces se actualiza la versión.

El feedback nunca modifica por sí solo el prompt o el conocimiento. No guardar conversaciones con datos personales o financieros reales.
