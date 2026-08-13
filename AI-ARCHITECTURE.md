# Arquitectura de IA — primera capa

## Qué funciona ahora

`Pregúntale a YOL1` tiene dos modos por sesión:

- **IA:** disponible cuando el servidor tiene `OPENAI_API_KEY`. Antes de enviar texto, la persona debe elegir este modo y ve que su mensaje será procesado por OpenAI y que la pregunta/respuesta puede guardarse para revisión del Lab. La clave nunca llega al navegador.
- **Demo local:** respuestas determinísticas sobre el mismo ejemplo. Es el fallback automático cuando no existe clave o el modelo no responde.

La ruta `POST /api/chat` valida cantidad, roles y largo de los mensajes; agrega instrucciones y conocimiento versionado; usa Responses API con `store: false`; no habilita herramientas, web, pagos, bancos ni acciones. El modelo predeterminado se configura con `OPENAI_MODEL`.

## Conocimiento y comportamiento

- `lib/ai/knowledge.ts`: hechos sintéticos aprobados y versión activa.
- `lib/ai/yol1-prompt.ts`: voz, autoridad recommend-only y guardrails.
- `lib/ai/demo-response.ts`: fallback que mantiene el Lab usable sin proveedor.
- `evals/yol1-cases.json`: primeros casos de comprensión y seguridad.

Esta etapa no usa fine-tuning, embeddings, vector database ni MCP. La base es pequeña a propósito: resulta fácil ver qué sabe YOL1, editarlo y probarlo.

## Aprendizaje incremental

Cada pregunta y respuesta se registra como una entrada pendiente cuando Postgres está conectado. La persona puede además marcarla **Útil** o **Mejoraría**, actualizando la misma entrada. El feedback general se guarda como un tipo separado. En `/review`, Felipe filtra **Feedback** o **Respuestas IA** y decide **Aprobar**, **Equivocado** o **Descartar**. Equivocado requiere explicar el error.

El ciclo seguro es:

1. observar feedback repetido;
2. seleccionar un caso en la bandeja;
3. proponer un cambio en conocimiento o instrucciones;
4. agregar o actualizar una evaluación;
5. revisar resultados y promover el cambio mediante branch/PR aprobado.

El feedback nunca reescribe automáticamente el prompt. Aprobar o marcar Equivocado son decisiones editoriales, no entrenamiento ni publicación.

## Bandeja compartida y fallback

Con `DATABASE_URL` y `YOL1_REVIEW_TOKEN`, `/api/feedback` guarda filas en Neon Postgres y `/review` exige la clave privada para listarlas o clasificarlas. Sin esos secretos, el Lab conserva el adapter local como fallback y muestra claramente `MODO LOCAL`.

La recepción anónima aplica origen permitido, idempotencia, validación, filtro básico de datos sensibles y un límite por sesión. No almacena IP ni conversación completa: guarda la pregunta y respuesta individual que necesita revisión. La clave de lectura vive en `sessionStorage` únicamente durante la sesión de Felipe; una versión posterior debe usar autenticación individual.

## Configuración local

1. Copiar `.env.example` como `.env.local`.
2. Agregar `OPENAI_API_KEY` solo en `.env.local` o como secreto del hosting.
3. Para bandeja compartida, agregar `DATABASE_URL` y `YOL1_REVIEW_TOKEN`.
4. Opcionalmente cambiar `OPENAI_MODEL`.
5. Reiniciar `npm run dev`.

No subir `.env.local`, claves ni conversaciones reales a GitHub.
