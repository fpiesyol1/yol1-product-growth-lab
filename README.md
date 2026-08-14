# YOL1 Product Growth Lab

Prototipo exploratorio con datos ficticios para recorrer una experiencia cotidiana de YOL1. **No conecta bancos, no carga cartolas, no mueve dinero, no envía mensajes y no representa capacidades disponibles ni un roadmap comprometido.**

La propuesta que explora esta versión es: **“Con YOL1 entiendes tus finanzas y simplificas tu vida financiera.”** YOL1 detecta señales, explica evidencia y recomienda; la persona decide y confirma.

El producto principal se llama oficialmente **Acompañante financiero**. El selector superior organiza exactamente seis espacios: Acompañante, Onboarding, Home Banking, Tarjetas, Remesas y Construir mi propio producto. La interfaz usa **Para explorar** para prototipos de aprendizaje y **En investigación** cuando no hay una capacidad disponible. Tarjetas conserva un borrador local de discovery con datos sintéticos; no representa emisión, pago, QR/NFC ni readiness. Remesas está pausado y no se investiga ni prototipa en este ciclo.

## Qué incluye

- **Inicio:** propuesta de valor ampliada, cinco pendientes de ejemplo —cargo dudoso, por cobrar, por pagar, beneficio y gasto posiblemente compartido— en un carrusel con contador/puntos, y una conversación financiera que parte en demo. **Ignorar**, **Revisar** y **Preparar reparto** aparecen según el contexto.
- **Mis Finanzas:** resultado mensual, carrusel de cuentas, acceso a cartola general, cuatro métricas accionables y últimos movimientos compactos.
- **Cartola:** cartola General, BCI o MACH; fecha, hora y monto en la fila principal, con banco/código disponibles en el detalle. **Marcar revisado** y **Revisar** están siempre disponibles; **Preparar reparto/cobro** aparece solo cuando la evidencia lo permite.
- **Cobrar y pagar:** separa por cobrar arriba y por pagar abajo en dos bandejas que dividen el alto 50/50, por persona o grupo. Cada lista tiene scroll interno independiente mientras cabecera, selector y navegación permanecen estables. Distingue **Preparar cobro**, **Preparar pago** y **Marcar como resuelto**. La vista previa usa texto y URL de ejemplo no navegable, y conserva el borrador de sesión al volver.

La vista de mensaje no abre WhatsApp, no copia al portapapeles, no genera links ni inicia pagos. Una implementación productiva requeriría consentimiento explícito antes de compartir, generación server-side del link y un partner de pagos autorizado.
- **Ahorrar:** presenta potencial estimado y cuatro oportunidades: cargo dudoso, beneficio por tarjeta, cuenta/servicio y gasto posiblemente compartido. Primero muestra una conclusión cotidiana; evidencia, fuente, certeza, rango y disclosure siguen disponibles en “Ver por qué”. Ignorar es siempre visible y reversible durante la sesión.
- **Ganar:** espacio en investigación, sin promesa operativa.
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

Para recibir feedback de otros navegadores, conecta Neon Postgres desde Vercel y define `DATABASE_URL` + `YOL1_REVIEW_TOKEN`. La guía completa está en `POSTGRES-GUIDE.md`.

Abre `http://localhost:3000`. Recorridos sugeridos:

1. Inicio → Disney+ → Revisar → asistente contextual → dejar nota.
2. Inicio → Ignorar una tarjeta → confirmar que desaparece, aumenta el contador y se puede deshacer.
3. Inicio → usar la demo inmediata → probar preguntas sobre mes, deudas, beneficios y ahorro → opcionalmente elegir IA con consentimiento → marcar una respuesta Útil/Mejoraría.
4. Finanzas → Te entró/Gastaste → detalle filtrado; Por cobrar/Por pagar → módulo social.
5. Cobrar y pagar → abrir Josefa/Camila → preparar cobro o pago → verificar el guardrail y volver sin enviar; alternar persona/grupo sin mover toda la pantalla.
6. Ahorrar → beneficio BCI, plan móvil o Liguria → revisar evidencia → simular o ignorar.
7. Cambiar entre oscuro y claro en Inicio, Finanzas, Cartola y Cobrar y pagar.
8. Abrir Feedback, cambiar de módulo y comprobar que la pantalla se actualiza. “Mejoraría” e “Idea” requieren comentario; “Me gusta” permite un envío rápido.
9. Abrir `http://localhost:3000/review`, mover un feedback entre Nuevo, En revisión, Para después, Resuelto o Ignorado; luego revisar un conflicto y un hallazgo de IA.
10. Abrir `http://localhost:3000/review/knowledge`, buscar “Disney” o “Camila”, revisar variantes y marcar una ficha para mejorar.

Para verificar build y guardrails:

```bash
npm test
```

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
