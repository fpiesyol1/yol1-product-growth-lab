# YOL1 Product Growth Lab

Prototipo exploratorio con datos ficticios para recorrer una experiencia cotidiana de YOL1. **No conecta bancos, no carga cartolas, no mueve dinero, no envía mensajes y no representa capacidades disponibles ni un roadmap comprometido.**

La propuesta que explora esta versión es: **“Con YOL1 entiendes tus finanzas y simplificas tu vida financiera.”** YOL1 detecta señales, explica evidencia y recomienda; la persona decide y confirma.

El selector superior organiza siete espacios: Onboarding, Acompañante financiero, Cuentas Claras, Home Banking, Tarjetas, Remesas y Construir mi propio producto. **Acompañante** interpreta cartolas y explica señales; **Cuentas Claras** es dueño de grupos, gastos, repartos, deudas, cobros y pagos simulados. Son productos complementarios y no duplican acciones.

## Qué incluye

- **Belvo Chile Lab local:** side project interno en `/belvo-lab` que reproduce con fixtures deterministas el contrato candidato de instituciones fiscales y facturas. No autentica, no llama el sandbox, no acepta credenciales y no retorna datos identificables.

- **Inicio:** propuesta de valor ampliada y señales financieras de ejemplo. **Ignorar**, **Revisar** y **Abrir/Dividir en Cuentas Claras** aparecen según el contexto.
- **Mis Finanzas:** resultado mensual, carrusel de cuentas, acceso a cartola general, cuatro métricas accionables y últimos movimientos compactos.
- **Cartola:** cartola General, BCI o MACH; fecha, hora y monto en la fila principal, con banco/código disponibles en el detalle. El Acompañante explica; si corresponde actuar sobre una cuenta compartida, entrega un borrador a Cuentas Claras.
- **Cuentas Claras:** app mobile-only dentro del mismo shell del Lab. Incluye grupos, gastos, reparto igual, por montos, porcentajes o partes, gastos habituales mensuales siempre confirmados por la persona, seguimiento durable de cobros compartidos, saldo por cobrar/pagar, abonos parciales, actividad, link público de pago simulado, MockFloid local y una cartola completamente ficticia que prueba conciliación exacta/ambigua y reversa auditable. No conecta bancos, no custodia ni mueve dinero; ninguna plantilla crea deudas o mensajes automáticamente.

La vista de mensajería replica un borrador reconocible de WhatsApp, pero siempre muestra “no enviado”. Copiar el texto requiere acción explícita y no cambia el ledger. Sólo “Sí, ya lo compartí” guarda una declaración atribuida a la persona; nunca simula entrega, lectura ni movimiento de dinero.
- **Ahorrar:** presenta potencial estimado y tres oportunidades: cargo dudoso, beneficio por tarjeta y cuenta/servicio. Primero muestra una conclusión cotidiana; evidencia, fuente, certeza, rango y disclosure siguen disponibles en “Ver por qué”. Ignorar es siempre visible y reversible durante la sesión.
- **Tu plan de deuda:** thin slice sintético que separa obligaciones institucionales de cuentas entre personas. Compara un pago observado con un informe anterior, lo mantiene como candidato y propone un primer paso reversible; no es score, informe CMF ni recomendación de crédito.
- **Tarjetas:** borrador local de discovery para probar intención, acceso protegido ficticio, último movimiento y beneficio contextual; nunca paga ni expone datos reales.
- **Construir mi propio producto:** guía a la persona para trabajar en su ChatGPT o Claude, copiar un prompt y traer explícitamente un resumen; no lee ni sincroniza conversaciones.
- **Experimentos:** feedback local sobre ideas ya conversadas, sin fechas ni disponibilidad.
- **Feedback del Lab:** recuadro siempre abierto al final del lateral desktop, después de la navegación de módulos, y acceso compacto en móvil. Detecta la pantalla activa y acepta “Me gusta”, “Mejoraría” o “Idea”; usa la bandeja compartida cuando Postgres está activo y fallback local en desarrollo.
- **Bandeja de aprendizaje:** con Postgres conectado, `/review` organiza tres capas: feedback de personas en un Kanban editorial, conflictos de decisión compactos y hallazgos de IA por interpretar. Sin base configurada declara con claridad su fallback local.
- **Conocimiento del Lab:** `/review/knowledge` permite buscar las preguntas aprobadas, abrir sus variantes y marcar localmente una ficha para mejorar. No edita archivos ni reentrena nada.

La app inicia en modo oscuro. El selector del header cambia a modo claro y guarda la elección en el navegador. Si no existe elección, usa la preferencia del sistema.

## Cómo probar

Requiere Node.js 22.13 o superior.

```bash
npm install
npm run dev
```

La app funciona sin clave en modo demo. Para habilitar IA, copia `.env.example` como `.env.local`, agrega `OPENAI_API_KEY` y reinicia el servidor. Cada visitante debe elegir explícitamente IA antes de que su texto sea procesado por OpenAI; la petición usa `store: false` y la clave permanece en el servidor.

Para recibir feedback de otros navegadores y conservar links de Cuentas Claras entre instancias, conecta Neon Postgres desde Vercel y define `DATABASE_URL` + `YOL1_REVIEW_TOKEN`. En producción Cuentas Claras falla cerrado si Neon falta; memoria se usa únicamente en desarrollo local. Cada workspace demo expira tras siete días sin actividad y tiene límites de tamaño y volumen. La guía completa está en `POSTGRES-GUIDE.md`.

El primer preview debe permanecer protegido por acceso de Vercel. Todavía no es un demo público abierto: antes de quitar esa protección hay que limitar de forma durable la creación de sesiones anónimas y las búsquedas fallidas de links de pago, para evitar crecimiento no controlado de Neon y consultas costosas por bots.

Las migraciones versionadas de Cuentas Claras viven en `drizzle/debt-center`. `pnpm run db:generate` actualiza el SQL desde el esquema Drizzle y `pnpm run db:migrate` lo aplica a la base indicada por `DATABASE_URL`. La migración debe ejecutarse explícitamente antes de publicar; el Lab no depende de crear tablas durante una visita.

Abre `http://localhost:3017`. Recorridos sugeridos:

1. Inicio → Disney+ → Revisar → asistente contextual → dejar nota.
2. Inicio → Ignorar una tarjeta → confirmar que desaparece, aumenta el contador y se puede deshacer.
3. Inicio → usar la demo inmediata → probar preguntas sobre mes, deudas, beneficios y ahorro → opcionalmente elegir IA con consentimiento → marcar una respuesta Útil/Mejoraría.
4. Finanzas → Te entró/Gastaste → detalle filtrado; Te deben personas/Debes a personas → handoff explícito a Cuentas Claras.
5. Cuentas Claras → crear un gasto → revisar la cola de obligaciones nuevas → preparar un borrador individual de WhatsApp → copiar sin registrar envío → confirmar manualmente “Sí, ya lo compartí” → recargar y comprobar que el estado persiste → preparar seguimiento por el remanente → al cerrar, decidir desde Inicio si el gasto se repetirá → comprobar que guardar la plantilla no crea deudas → simular un abono parcial → recargar el comprobante y verificar que conserva abono y remanente → abrir un gasto propio vacío desde el resultado.
6. Cuentas Claras → crear un gasto sin abonos → “Hay un error en este gasto” → anular y preparar corrección → comprobar que el original queda en el historial, que el link anterior dice **Cobro anulado** y que sólo puede crearse una copia corregida en el mismo grupo.
7. Tu plan de deuda → revisar el desfase ficticio entre cartola e informe → marcar el primer paso → deshacerlo y confirmar que nunca se presenta como pago aplicado.
8. Ahorrar → beneficio BCI o plan móvil → revisar evidencia → simular o ignorar.
9. Cambiar entre oscuro y claro en Inicio, Finanzas y Cartola; verificar Cuentas Claras en el shell mobile-only.
10. Abrir Feedback, cambiar de módulo y comprobar que la pantalla se actualiza. “Mejoraría” e “Idea” requieren comentario; “Me gusta” permite un envío rápido.
11. Abrir `http://localhost:3017/review`, mover un feedback entre Nuevo, En revisión, Para después, Resuelto o Ignorado; luego revisar un conflicto y un hallazgo de IA.
12. Abrir `http://localhost:3017/review/knowledge`, buscar “Disney” o “Camila”, revisar variantes y marcar una ficha para mejorar.

Para verificar build y guardrails:

```bash
npm test
```

## Research documental con Pomelo

Este proyecto incluye una conexión opcional y sin credenciales al MCP público de referencia de Pomelo en `.codex/config.toml`. Al abrir una tarea nueva de Codex dentro de este repositorio, `pomelo_api_reference` permite buscar y leer documentación de endpoints; no ejecuta APIs financieras ni demuestra acceso comercial.

El método, la matriz inicial de encaje y los estados de evidencia están documentados en [`POMELO-MCP-FIT-RESEARCH.md`](POMELO-MCP-FIT-RESEARCH.md). Todo hallazgo parte como `documentado` o `fit_candidato`; sólo una validación separada de Ingeniería, Seguridad, Datos, Riesgo, Legal/Compliance, Operaciones y negocio puede promoverlo a capacidad aprobada.

## Organización

- `app/page.tsx`: navegación, estado de sesión, temas, datos de demostración e interacciones.
- `app/globals.css`: tokens semánticos, modos oscuro/claro, responsive y estados.
- `app/layout.tsx`: metadatos.
- `MVP-SPEC.md`: alcance, journeys, aceptación y límites.
- `PRODUCT-DESIGN.md`: sistema visual, tokens y roles de acento.
- `QA-CIERRE.md`: verificación manual y técnica.
- `QA-CICLO-TRIPLE.md`: ciclo repetible de QA técnico/PRD, producto/GTM y consistencia/experiencia.
- `PRD-ONBOARDING-KYC-PROGRESIVO.md`: flujo de exploración, preregistro y activación progresiva para Ingeniería, Producto y Legal.
- `tests/product-guardrails.test.mjs`: checks livianos de seguridad y contrato UI.
- `lib/feedback-intake.ts`: contrato y adapter local del intake.
- `lib/ai/`: conocimiento, instrucciones y fallback de conversación.
- `knowledge/`: fichas Markdown por dominio, índice y guía de dictado por voz.
- `product-knowledge/`: fichas enriquecidas por producto, decisiones, comentarios y protocolo de exportaciones de Notion. Es conocimiento interno; no alimenta respuestas públicas sin revisión.
- `lib/ai/knowledge-catalog.ts`: representación runtime vinculada a cada ficha Markdown.
- `lib/ai/knowledge-router.ts`: reglas y matching local antes de cualquier llamada de IA.
- `app/api/chat/route.ts`: proxy server-side hacia Responses API con validación, consentimiento y `store: false`.
- `app/review/`: bandeja privada compartida con fallback local, fuera de los módulos consumer.
- `AI-ARCHITECTURE.md`: configuración, privacidad y ciclo incremental revisado.
- `POSTGRES-GUIDE.md`: explicación práctica, conexión desde Vercel y consultas de lectura.
- `evals/yol1-cases.json`: casos iniciales de comportamiento y seguridad.
- `evals/knowledge-router-cases.json`: consultas que verifican variantes, reglas y fallback.
- `FEEDBACK-INTAKE.md`: arquitectura recomendada para recepción server-side, Kanban editorial y eventual promoción a PR.

## Publicación

Felipe revisa antes de publicar. Los secretos se configuran únicamente en Vercel; nunca se agregan al repositorio. No integrar bancos, pagos ni mensajería reales.

La recepción compartida se activa únicamente cuando Vercel tiene `DATABASE_URL` y `YOL1_REVIEW_TOKEN`. Ningún secreto ni permiso de GitHub llega al navegador. La IA puede habilitarse con una clave server-side, pero el uso público requiere además límites de consumo, presupuesto y política de retención.

## Cómo alimentar el chat por voz

Felipe puede dictar libremente: pregunta imaginada, respuesta ideal, tono, qué no debería decir y qué falta preguntar. Codex lo convierte primero en una ficha Markdown `borrador`; Felipe aprueba la pregunta madre; recién después se agregan variantes, catálogo y evaluaciones. La guía completa está en `knowledge/WORKFLOW-POR-VOZ.md`.

El orden de resolución es: regla de seguridad → ficha aprobada/dato sintético → fallback con preguntas concretas → IA server-side solo si sigue haciendo falta y existe consentimiento. El feedback nunca actualiza automáticamente la base.

## Qué demuestra y qué no

La navegación permite probar comprensión y usabilidad. No demuestra demanda, product-market fit, economics ni readiness operacional o regulatoria. Los gates declarados son E2 comprensión, E3 acción voluntaria y E4 resultado/retorno.

## Portfolio, especificación interna y decisiones

- El selector distingue prototipos **Para explorar** de espacios **En investigación**. Esos estados no equivalen a disponibilidad operacional.
- La especificación técnica permanece en `lib/product-portfolio.ts`, PRD y documentos QA; no se renderiza en la experiencia pública.
- Los eventos propuestos, arquitectura, fuentes, KYC, licencias, riesgos y preguntas abiertas son material de equipo. No se envían a analytics ni constituyen una decisión legal o técnica.
- `/review#decisions` contiene conflictos de ejemplo, no sensibles. La resolución se guarda en `localStorage` y no modifica archivos ni GitHub.
- Jerarquía aplicada cuando las fuentes chocan: decisión verbal de Felipe → decisión aprobada → reunión reciente → Notion/Second Brain → Jira → estrategia/contexto.
- Notion es el centro humano para contexto, notas y reglas vivas. Hasta contar con una conexión directa, sus exportaciones se incorporan como fuentes fechadas mediante `product-knowledge/imports/notion/`; primero se comparan y revisan, luego se actualizan las fichas Markdown.
- Cada producto tiene una ficha enriquecida en `product-knowledge/products/` que coordina negocio, UX, reglas, requisitos, tecnología, datos, privacidad, normativa, partners, operación, GTM, QA y aprendizaje. Los vacíos permanecen visibles como `por_validar`.
