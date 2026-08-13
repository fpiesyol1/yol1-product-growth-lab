import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("Inicio conserva datos ficticios, bandeja y elección IA/demo", async () => {
  const page = await source("app/page.tsx");
  assert.match(page, /DATOS FICTICIOS/);
  assert.match(page, /Entiende tus finanzas/);
  assert.match(page, /Tienes \{visibleCards\.length/);
  assert.match(page, /Disney\+ aparece dos veces/);
  assert.match(page, /Tu tarjeta tiene restaurantes con descuento/);
  assert.match(page, /Le debes a Camila/);
  assert.match(page, /La cuenta de Liguria parece compartida/);
  assert.match(page, /Pregúntale a YOL1/);
  assert.match(page, /Usar IA/);
  assert.match(page, /Seguir en demo/);
  assert.match(page, /Ya lo vi/);
  assert.match(page, /carousel-dots/);
  assert.match(page, /Deshacer última/);
  assert.match(page, /no compartas datos personales o financieros reales/i);
  assert.doesNotMatch(page, /Explorar ejemplo|Simular con mi información/);
  assert.doesNotMatch(page, /Micrófono de demo/);
});

test("la IA opera server-side con consentimiento, límites y fallback", async () => {
  const page = await source("app/page.tsx");
  const route = await source("app/api/chat/route.ts");
  const prompt = await source("lib/ai/yol1-prompt.ts");
  const knowledge = await source("lib/ai/knowledge.ts");
  const envExample = await source(".env.example");
  const evals = JSON.parse(await source("evals/yol1-cases.json"));
  assert.match(route, /process\.env\.OPENAI_API_KEY/);
  assert.match(route, /typedBody\.aiConsent !== true/);
  assert.match(route, /MAX_MESSAGES = 12/);
  assert.match(route, /MAX_MESSAGE_LENGTH = 700/);
  assert.match(route, /store: false/);
  assert.match(route, /api\.openai\.com\/v1\/responses/);
  assert.match(route, /createDemoResponse/);
  assert.doesNotMatch(page, /OPENAI_API_KEY|api\.openai\.com|Authorization:|Bearer /);
  assert.match(prompt, /No solicites claves/);
  assert.match(prompt, /Una coincidencia no es una conclusión/);
  assert.match(knowledge, /YOL1_KNOWLEDGE_VERSION/);
  assert.match(envExample, /OPENAI_API_KEY=\s*$/m);
  assert.doesNotMatch(envExample, /sk-[A-Za-z0-9]/);
  assert.ok(evals.length >= 4);
});

test("el conocimiento aprobado se resuelve antes de pedir IA", async () => {
  const route = await source("app/api/chat/route.ts");
  const catalog = await source("lib/ai/knowledge-catalog.ts");
  const router = await source("lib/ai/knowledge-router.ts");
  const viewer = await source("app/review/knowledge/page.tsx");
  const css = await source("app/globals.css");
  const index = await source("knowledge/INDEX.md");
  const workflow = await source("knowledge/WORKFLOW-POR-VOZ.md");
  assert.match(route, /routeKnowledge\(lastQuestion\)/);
  assert.ok(route.indexOf("localRoute.kind") < route.indexOf('fetch("https://api.openai.com/v1/responses"'), "el router local debe ejecutarse antes de la API");
  assert.match(router, /Qué veo:/);
  assert.match(router, /Qué significa:/);
  assert.match(router, /Qué puedes hacer ahora:/);
  assert.match(router, /No voy a inventar una respuesta/);
  assert.match(router, /calculateLabMonthResult/);
  assert.match(catalog, /lab-kb-2026-08-13\.1/);
  assert.match(index, /collect-receivables-001/);
  assert.match(workflow, /Felipe dicta/);
  assert.match(viewer, /Conocimiento del Lab/);
  assert.match(viewer, /Marcar para mejorar/);
  assert.match(viewer, /localStorage/);
  assert.doesNotMatch(viewer, /fetch\(|github|OPENAI_API_KEY/i);
  assert.match(css, /@media \(max-width:800px\)[\s\S]*\.knowledge-overview/);
  assert.match(css, /\.knowledge-answer,\.knowledge-columns \{ grid-template-columns:1fr/);
});

test("feedback y respuestas llegan a una bandeja editorial con fallback local", async () => {
  const page = await source("app/page.tsx");
  const review = await source("app/review/page.tsx");
  const adapter = await source("lib/learning-review.ts");
  const sharedClient = await source("lib/shared-feedback-client.ts");
  const architecture = await source("AI-ARCHITECTURE.md");
  assert.match(page, /Útil/);
  assert.match(page, /Mejoraría/);
  assert.match(page, /localChatFeedbackIntake\.submit/);
  assert.match(page, /submitChatResponse/);
  assert.match(review, /Bandeja de aprendizaje/);
  assert.match(review, /Aprobar/);
  assert.match(review, /Equivocado/);
  assert.match(review, /Descartar/);
  assert.match(review, /¿Qué está mal\?/);
  assert.match(review, /Feedback/);
  assert.match(review, /Respuestas IA/);
  assert.match(adapter, /localStorage/);
  assert.doesNotMatch(adapter, /fetch\(|github\.com|api\.github/i);
  assert.match(sharedClient, /fetch\("\/api\/feedback"/);
  assert.doesNotMatch(sharedClient, /DATABASE_URL|YOL1_REVIEW_TOKEN/);
  assert.match(architecture, /nunca reescribe automáticamente/i);
});

test("intake compartido protege Postgres y la revisión privada", async () => {
  const route = await source("app/api/feedback/route.ts");
  const store = await source("lib/server/feedback-store.ts");
  const page = await source("app/page.tsx");
  const envExample = await source(".env.example");
  assert.match(route, /YOL1_REVIEW_TOKEN/);
  assert.match(route, /timingSafeEqual/);
  assert.match(route, /sameOrigin/);
  assert.match(route, /containsSensitiveData/);
  assert.match(route, /countRecentFeedback\(sessionHash\) >= 20/);
  assert.match(route, /status === "wrong" && !reviewNote/);
  assert.match(store, /process\.env\.DATABASE_URL/);
  assert.match(store, /CREATE TABLE IF NOT EXISTS yol1_feedback_items/);
  assert.match(store, /ON CONFLICT \(id\) DO UPDATE/);
  assert.match(store, /session_hash/);
  assert.doesNotMatch(page, /DATABASE_URL|YOL1_REVIEW_TOKEN|@neondatabase/);
  assert.match(envExample, /DATABASE_URL=\s*$/m);
  assert.match(envExample, /YOL1_REVIEW_TOKEN=\s*$/m);
  assert.doesNotMatch(envExample, /postgres(?:ql)?:\/\/[^\s]+:[^\s]+@/i);
});

test("acciones y confirmaciones permanecen simuladas y visibles", async () => {
  const page = await source("app/page.tsx");
  const css = await source("app/globals.css");
  assert.match(page, /phone-toast/);
  assert.match(css, /\.phone-toast/);
  assert.match(page, /No cobra, paga ni contacta a nadie/i);
  assert.match(page, /no se conecta ninguna cuenta/i);
  assert.match(page, /no se carga ningún archivo/i);
  assert.match(page, /no conecta bancos y no envía nada por WhatsApp/i);
  assert.match(page, /no se inició un pago real/i);
  assert.doesNotMatch(page, /pago exitoso|dinero transferido|banco conectado/i);
});

test("Cartola usa navegación general e individual y acciones coherentes", async () => {
  const page = await source("app/page.tsx");
  assert.match(page, /Ver cartola general/);
  assert.match(page, /\["General", "BCI", "MACH"\]/);
  assert.match(page, /"Ya lo vi" \| "Revisar" \| "Dividir" \| "Cobrar"/);
  assert.match(page, /ASISTENTE DEMO/);
  assert.match(page, /Guardar nota del ejemplo/);
  assert.match(page, /Nota guardada/);
  assert.match(page, /Revisado/);
  assert.match(page, /movement-detail-meta/);
  assert.doesNotMatch(page, /\{movement\.bank\} · \{movement\.code\}/);
});

test("Cobrar y pagar cubre ambos lados y conserva borrador en la app", async () => {
  const page = await source("app/page.tsx");
  const css = await source("app/globals.css");
  assert.match(page, /Cobrar y pagar/);
  assert.match(page, /ME DEBEN/);
  assert.match(page, /LE DEBO/);
  assert.match(page, /Por persona/);
  assert.match(page, /Por grupo \/ gasto/);
  assert.match(page, /collectDraft/);
  assert.match(page, /Crear contacto demo/);
  assert.match(page, /@josefa/);
  assert.match(page, /Ya me pagaron/);
  assert.match(page, /Revisar si este pago ya quedó resuelto/);
  assert.match(page, /Nuevo gasto compartido/);
  assert.match(page, /Agregar deuda pendiente/);
  assert.match(page, /Repartir lo que falta/);
  assert.match(page, /collect-home-mode/);
  assert.match(css, /\.pending-board[^}]*grid-template-rows:minmax\(0,1fr\) minmax\(0,1fr\)/i);
  assert.match(css, /\.pending-lane-track[^}]*overflow-y:auto/i);
  assert.match(css, /\.pending-lane-track[^}]*overflow-x:hidden/i);
  assert.match(css, /\.app-content\.collect-home-mode[^}]*overflow:hidden/i);
  assert.match(css, /overscroll-behavior:contain/i);
  assert.match(page, /VISTA PREVIA DE MENSAJE/);
  assert.match(page, /Sigues dentro de YOL1/);
  assert.match(page, /Volver a YOL1/);
  assert.match(page, /Ver cómo se compartiría/);
  assert.match(page, /https:\/\/paga\.yol1\.example\/s\/demo-2841/);
  assert.match(page, /consentimiento explícito, un link generado en servidor y un partner de pagos autorizado/i);
  assert.match(page, /setMessagePreview\(null\)/);
  assert.doesNotMatch(page, /href=.*paga\.yol1\.example|window\.open|wa\.me|api\.whatsapp/i);
  assert.doesNotMatch(page, /Simular copia/);
});

test("lenguaje cotidiano, navegación literal y estados de confianza quedan visibles", async () => {
  const page = await source("app/page.tsx");
  const css = await source("app/globals.css");
  assert.match(page, /Te entró/);
  assert.match(page, /Gastaste/);
  assert.match(page, /💵/);
  assert.match(page, /👥/);
  assert.match(page, /🪙/);
  assert.match(page, /🧪/);
  assert.match(page, /Feedback/);
  assert.match(page, /Claro/);
  assert.match(page, /Oscuro/);
  assert.match(css, /\.bottom-nav button>small[^}]*font-size:9px/i);
});

test("Ahorrar ordena la conclusión antes de la evidencia sin ocultar transparencia", async () => {
  const page = await source("app/page.tsx");
  assert.match(page, /Ver por qué/);
  assert.match(page, /Ignorar/);
  assert.match(page, /Recuperar última/);
  assert.match(page, /Puede convenirte/);
  assert.match(page, /Evidencia/);
  assert.match(page, /Certeza/);
  assert.match(page, /Disclosure/);
});

test("tema dual y acentos semánticos están tokenizados", async () => {
  const css = await source("app/globals.css");
  const design = await source("PRODUCT-DESIGN.md");
  assert.match(css, /\.lab-shell\[data-theme="dark"\]/);
  assert.match(css, /\.lab-shell\[data-theme="light"\]/);
  assert.match(css, /--neon-pink:#ff8fb4/i);
  assert.match(css, /--violet-soft:/i);
  assert.match(css, /\.collect-hero[^}]*box-shadow:[^}]*var\(--neon-pink\)/i);
  assert.match(css, /\.pending-actions button:nth-child\(2\)[^}]*background:var\(--neon-pink\)/i);
  assert.match(css, /\.movement\.selected[^}]*var\(--aqua\)/i);
  assert.match(design, /nunca error, alerta ni dato crítico/i);
});

test("documenta límites y gates de aprendizaje", async () => {
  const spec = await source("MVP-SPEC.md");
  assert.match(spec, /E2 — Comprensión/);
  assert.match(spec, /E3 — Acción voluntaria/);
  assert.match(spec, /E4 — Resultado \/ retorno/);
  assert.match(spec, /No demuestra demanda, product-market fit, economics ni readiness/i);
  assert.match(spec, /Directo y Embebido quedan fuera/i);
});

test("feedback conserva fallback local y permanece desacoplado de GitHub", async () => {
  const page = await source("app/page.tsx");
  const css = await source("app/globals.css");
  const adapter = await source("lib/feedback-intake.ts");
  const architecture = await source("FEEDBACK-INTAKE.md");
  assert.match(page, /FeedbackPanel screen=\{activeTitle\} open=\{true\}/);
  assert.match(page, /Me gusta/);
  assert.match(page, /Mejoraría/);
  assert.match(page, /Idea/);
  assert.match(page, /No incluyas datos financieros ni personales/);
  assert.doesNotMatch(page, /life-shot|yol1-life\.jpg/);
  assert.match(css, /\.feedback-desktop[^}]*position:static/i);
  assert.doesNotMatch(css, /\.feedback-desktop[^}]*position:absolute/i);
  assert.ok(page.indexOf('<div className="module-map"') < page.indexOf('<FeedbackPanel screen={activeTitle} open={true}'), "feedback desktop debe estar después de la navegación de módulos");
  assert.match(css, /@media \(max-width:720px\)[\s\S]*\.feedback-mobile\.feedback-open/i);
  assert.match(css, /inset:62px 8px 70px/i);
  assert.match(adapter, /localStorage/);
  assert.match(adapter, /FeedbackIntakeAdapter/);
  assert.doesNotMatch(adapter, /github\.com|api\.github|Authorization|Bearer/i);
  assert.match(architecture, /ruta server-side protegida|POST \/api\/feedback/i);
  assert.match(architecture, /branch \+ PR.*aprobación|branch\/PR.*aprobación/i);
});
