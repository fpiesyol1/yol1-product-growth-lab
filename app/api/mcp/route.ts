import { NextResponse } from "next/server";
import type { ProjectDraftInput, SharedProjectDraft } from "../../../lib/project-draft-types";
import {
  countRecentProjectDrafts,
  findProjectDraftBySubmission,
  getProjectDraft,
  isProjectDraftStorageConfigured,
  projectCreatorHash,
  saveProjectDraft,
} from "../../../lib/server/project-draft-store";

export const runtime = "nodejs";

const PROTOCOL_VERSION = "2025-03-26";
const MAX_IDEA_LENGTH = 1_200;
const PROJECT_ID = /^prj_[a-f0-9]{32}$/;
const LAB_VIEW_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yol1-product-growth-lab.vercel.app";
const CONTEXT_VERSION = "yol1-lab-context/0.3";
const SERVER_VERSION = "0.4.0";
const SCHEMA_VERSION = "project-draft/0.2";
const UI_VERSION = "lab-web/0.3";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization, MCP-Protocol-Version, Mcp-Session-Id",
  "MCP-Protocol-Version": PROTOCOL_VERSION,
};

type RpcRequest = { jsonrpc?: unknown; id?: unknown; method?: unknown; params?: unknown };

function response(id: unknown, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id: id ?? null, result }, { headers });
}

function error(id: unknown, code: number, message: string) {
  return NextResponse.json({ jsonrpc: "2.0", id: id ?? null, error: { code, message } }, { status: 400, headers });
}

function designSystemManifest() {
  return {
    version: UI_VERSION,
    assets: {
      icon: `${LAB_VIEW_URL}/yol1-icon.png`,
      wordmark: `${LAB_VIEW_URL}/yol1-wordmark-dark.png`,
    },
    typography: {
      sans: '"Söhne", "Helvetica Neue", Arial, sans-serif',
      mono: '"Söhne Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    },
    colors: {
      brand_night: "#112e3c",
      brand_night_deep: "#071f29",
      brand_cream: "#faeddc",
      brand_mist: "#eef3f1",
      acid: "#80ef0c",
      acid_soft: "#c5f29a",
      aqua: "#71d7c8",
      aqua_deep: "#168f86",
      yellow: "#ffe7a0",
      coral: "#ff6847",
      neon_pink: "#ff8fb4",
      pink_soft: "#ffd5e3",
      violet_soft: "#b9a7ff",
      violet_ink: "#59438e",
    },
    dark_theme: {
      page_bg: "#061b24",
      app_bg: "#0a232d",
      surface: "#102f3a",
      surface_raised: "#173b46",
      surface_soft: "#0d2933",
      text: "#f9eee2",
      muted: "#9bb0b5",
      focus: "#71d7c8",
    },
    phone_shell: {
      width_px: 430,
      min_height_px: 720,
      radius_px: 48,
      header_height_px: 62,
      bottom_navigation_height_px: 66,
    },
    companion_navigation: ["Inicio", "Finanzas", "Cobrar/pagar", "Ahorrar", "Ganar", "Mi banco"],
    component_rules: {
      primary_action: "acid sobre brand_night, borde marcado, sombra corta y alto táctil mínimo de 44px",
      explanatory_action: "aqua sobre brand_night",
      collaborative_input: "violet_soft sólo para feedback, selección o colaboración",
      surface: "azul petróleo con borde cream translúcido; evitar tarjetas gris-neutro genéricas",
      focus: "outline aqua de 3px con separación visible",
    },
  };
}

function assistantExperienceContract() {
  return {
    audience: "non-technical",
    first_turn: "understand_plain_language_and_show_a_first_candidate",
    question_policy: "infer_safe_assumptions; ask at most one question only after showing useful progress",
    visible_answer: ["outcome", "prototype_or_screen_flow", "important_assumptions", "single_next_decision"],
    never_show: ["tool_catalog_diagnostics", "version_checks", "internal_editing_trace", "chain_of_thought", "event_ids_inside_product_ui"],
    never_claim: ["background_work", "automatic_sync", "publication_without_confirmation", "unverified_financial_capability"],
  };
}

function contextText() {
  return `# Contexto de construcción YOL1 · ${CONTEXT_VERSION}\n\n## Experiencia para cualquier persona\n- La persona describe una idea en lenguaje cotidiano. No le hables de MCP, herramientas, catálogos, contratos ni versiones salvo que lo pregunte.\n- Entrega primero una propuesta útil. Si falta información, avanza con un supuesto explícito y formula como máximo una pregunta simple después de mostrar progreso.\n- No muestres trazas de edición como “Now update…”, razonamiento interno ni nombres de eventos dentro del mockup. No digas que seguirás trabajando mientras esperas: no existe trabajo en segundo plano.\n\n## Regla principal\nNo inventes capacidades. Distingue siempre: hecho aprobado, propuesta candidata y pregunta por resolver. Esta conversación genera un borrador; nunca modifica el Lab ni publica producto automáticamente.\n\n## Sistema visual exacto vigente\nNo inventes hex, tipografías, navegación ni estructura. Reutiliza literalmente:\n- Marca: night #112e3c; night-deep #071f29; cream #faeddc; mist #eef3f1.\n- Acentos: acid #80ef0c para acción principal; aqua #71d7c8 para explicación/evidencia; violet-soft #b9a7ff para colaboración/inputs; coral #ff6847 para riesgo; pink #ff8fb4 sólo social.\n- Dark UI: page #061b24; app #0a232d; surface #102f3a; raised #173b46; soft #0d2933; text #f9eee2; muted #9bb0b5.\n- Tipografía: Söhne para lectura y Söhne Mono para metadata, estados y controles.\n- Shell móvil: 430px de ancho, mínimo 720px de alto, radio 48px, header 62px y navegación inferior 66px. Usa los assets ${LAB_VIEW_URL}/yol1-icon.png y ${LAB_VIEW_URL}/yol1-wordmark-dark.png; no escribas “yol1” como reemplazo del logo.\n- Navegación del Acompañante: Inicio, Finanzas, Cobrar/pagar, Ahorrar, Ganar, Mi banco. No inventes otra navegación ni dupliques ítems.\n- Los controles interactivos deben ser button/input reales, no divs decorativos; foco aqua de 3px y área táctil mínima de 44px.\n- El producto aparece primero. Changelog, eventos, arquitectura y decisiones van en una ficha separada, nunca dentro de la pantalla del usuario.\n\n## Producto y honestidad financiera\n- Chile es jurisdicción base. KYC, licencias, partners, pagos, crédito, bancos, QR, NFC, beneficios y recompensas se marcan “Por validar” hasta tener evidencia, owner y capability aprobada.\n- Sin esa evidencia, usa “Simular” o “Demo”: no presentes saldo real, pago confirmado, folio real, procesamiento real ni actualización instantánea como hechos.\n- Todo flujo propone un momento de uso, usuario, problema, aha moment, 5–7 pantallas, estados vacío/carga/error, CTA, evidencia y salida.\n- Para acciones materiales incluye revisión antes de confirmar y estados de resultado incierto, interrupción, duplicado/reintento seguro, ya realizado y recuperación.\n\n## Arquitectura candidata\n- Mobile: React Native con navegación tipada, componentes reutilizables, accesibilidad y estado explícito de carga/error/vacío.\n- Backend: BFF/API versionado por dominio; autorización y validación server-side; el cliente recibe sólo el read model de la vista.\n- AWS: API Gateway → Lambda por dominio candidato; DynamoDB/RDS se decide desde patrones de acceso y auditoría; EventBridge sólo cuando una integración asíncrona esté aprobada.\n- Operación: feature flag por capability, correlation_id, logs estructurados, observabilidad, idempotencia, rollback y consentimiento antes de analytics.\n\n## Contrato de datos y eventos\nPara cada pantalla define fuera del mockup: read model, write model, system of record, frescura, retención, PII prohibida, eventos snake_case, event_at, user_id o anonymous_id, session_id, correlation_id, schema_version y consent_analytics.\nNunca incluyas en analytics o logs generales: OTP, RUT, serie, documentos, biometría, credenciales, PAN/CVV/PIN, QR completo, tokens, contactos crudos ni payloads financieros completos.\n\n## Revisión obligatoria\nAntes de entregar, verifica: fidelidad a tokens y shell, controles realmente interactivos, datos y capacidades no inventadas, dependencias, gates, riesgos de experiencia, Error capa 8, preguntas por validar y fuera de alcance.`;
}

function deliveryContractText() {
  return `# Contrato de entrega YOL1 · ${CONTEXT_VERSION}\n\nTrabaja en este orden, aunque la persona sólo haya escrito una frase:\n1. Muestra una primera propuesta: problema, usuario y momento; lo faltante se marca como supuesto, no como bloqueo.\n2. Presenta el flujo de 5–7 pantallas con contenido, CTA y estados vacío/carga/error. Si produces HTML, debe ser interactivo y usar los tokens, shell, assets y navegación exactos del contexto.\n3. Para una acción material agrega revisión previa y recuperación ante resultado incierto o reintento.\n4. Después del producto, separa la ficha técnica: datos, eventos, arquitectura, dependencias, gates, Error capa 8 y fuera de alcance.\n5. Cierra con una sola decisión sencilla que permita mejorar la siguiente versión.\n\nLa respuesta visible debe hablar de la idea, no del funcionamiento interno del MCP. No muestres trazas de edición, nombres de herramientas, diagnósticos de versión ni eventos dentro de la interfaz. Nunca afirmes que una integración, pago, crédito, KYC, banco, licencia o partner está disponible sin evidencia explícita.`;
}

function projectBrief(idea: string) {
  return `# Construye ahora una primera propuesta YOL1\n\n## Idea expresada por la persona\n${idea}\n\nNo devuelvas una plantilla vacía ni detengas el trabajo para completar un formulario. Convierte la idea en una primera propuesta visible usando supuestos explícitos y pregunta como máximo una decisión simple al final.\n\n${deliveryContractText()}\n\nEste resultado es un borrador de trabajo: no publica una funcionalidad ni representa una capacidad operativa. Continúa desarrollándolo en el chat aunque la acción de guardar no esté visible. En ese caso, entrega el brief completo y el enlace del Lab, sin afirmar que fue guardado.`;
}

function bootstrapMetadata() {
  return {
    bootstrap_status: "ready",
    workflow_mode: "legacy-compatible",
    server_version: SERVER_VERSION,
    context_version: CONTEXT_VERSION,
    schema_version: SCHEMA_VERSION,
    ui_version: UI_VERSION,
    loaded: ["product_context", "delivery_contract", "lab_view"],
    next_action: "continue_product_conversation",
    saving: "optional_and_requires_explicit_confirmation",
    design_system: designSystemManifest(),
    assistant_experience: assistantExperienceContract(),
  };
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanList(value: unknown, maxItems: number, maxLength: number) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => clean(item, maxLength)).filter(Boolean);
}

function normalizeProjectDraft(value: unknown): ProjectDraftInput | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const project = {
    submissionId: clean(input.submission_id, 80),
    title: clean(input.title, 120),
    idea: clean(input.idea, MAX_IDEA_LENGTH),
    problem: clean(input.problem, 700),
    audience: clean(input.audience, 400),
    valueProposition: clean(input.value_proposition, 700),
    assumptions: cleanList(input.assumptions, 8, 240),
    openQuestions: cleanList(input.open_questions, 8, 240),
    references: cleanList(input.references, 5, 300),
  };
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(project.submissionId) || !project.title || !project.idea || !project.problem || !project.audience || !project.valueProposition) return null;
  return project;
}

function containsSensitiveData(project: ProjectDraftInput) {
  const text = [project.title, project.idea, project.problem, project.audience, project.valueProposition, ...project.assumptions, ...project.openQuestions, ...project.references].join(" ");
  return /(?:^|\D)(?:\d[ -]?){13,19}(?:\D|$)/.test(text)
    || /\b\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]\b/.test(text)
    || /\b(?:clave|contraseña|password|cvv|cvc|pin)\s*[:=]/i.test(text)
    || /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)
    || /(?:\+?56\s?)?(?:9\s?)?\d{4}[\s-]?\d{4}/.test(text);
}

function projectViewUrl(id: string) {
  return `${LAB_VIEW_URL}/?product=builder&draft=${encodeURIComponent(id)}`;
}

function projectDraftResult(project: SharedProjectDraft, created = false) {
  const viewUrl = projectViewUrl(project.id);
  return {
    content: [{
      type: "text",
      text: `# ${project.title}\n\n${created ? "Borrador guardado" : "Borrador encontrado"} para revisión.\n\n[Abrir esta propuesta en el Lab](${viewUrl})\n\nEstado: borrador · No está publicado · No modificó ninguna pantalla automáticamente.`,
    }],
    structuredContent: {
      project_id: project.id,
      status: project.status,
      view_url: viewUrl,
      title: project.title,
      created_at: project.createdAt,
      expires_at: project.expiresAt,
      published: false,
    },
  };
}

function labViewLink() {
  return `Cuando quieras revisar el Lab, abre: [Abrir vista del Lab](${LAB_VIEW_URL}/?product=builder). Esta vista es un prototipo; no publica ni sincroniza cambios automáticamente.`;
}

function startBuilderText() {
  return `# YOL1 está listo\n\n[Abre la vista del Lab cuando quieras](${LAB_VIEW_URL}/?product=builder)\n\nCuéntame qué quieres crear o mejorar con tus propias palabras. No necesitas preparar un brief ni conocer herramientas: te mostraré una primera propuesta y te haré preguntas simples sólo cuando ayuden a decidir.\n\n## Instrucciones vigentes para el asistente\n- Ejecuta este recorrido en silencio: no expliques herramientas, versiones, catálogos ni contratos a la persona.\n- Continúa aunque el cliente sólo muestre las herramientas originales de YOL1. No pidas reconectar, renombrar el conector ni hacer un diagnóstico técnico.\n- Si la persona ya entregó una idea, muestra una primera propuesta antes de preguntar. Infiere lo seguro como supuesto y formula como máximo una pregunta al final.\n- No muestres trazas como “Now update…”, razonamiento interno, pasos de edición ni promesas de trabajo en segundo plano.\n- Si guardar está disponible, úsalo sólo después de confirmación explícita. Si no está disponible, entrega el brief en el chat sin afirmar que fue guardado.\n- Nunca prometas publicación, sincronización automática ni capacidades financieras sin evidencia.\n\n${contextText()}\n\n${deliveryContractText()}`;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers });
}

export async function GET() {
  return NextResponse.json({
    name: "YOL1 Product Growth Lab MCP",
    version: SERVER_VERSION,
    transport: "streamable-http",
    access: "public-pilot-explicit-write",
    setup: "plug-and-play",
    legacy_compatible: true,
    start_tool: "yol1_start_builder",
    context_version: CONTEXT_VERSION,
    schema_version: SCHEMA_VERSION,
    ui_version: UI_VERSION,
    tools: ["yol1_start_builder", "yol1_get_context", "yol1_get_delivery_contract", "yol1_create_project_brief", "yol1_save_project_draft", "yol1_get_project_draft", "yol1_get_lab_view"],
    note: "Piloto público: sólo guarda borradores cuando la persona lo pide explícitamente. No publica, sincroniza conversaciones ni modifica productos automáticamente.",
  }, { headers });
}

export async function POST(request: Request) {
  let rpc: RpcRequest;
  try {
    rpc = await request.json() as RpcRequest;
  } catch {
    return error(null, -32700, "JSON inválido.");
  }
  if (rpc.jsonrpc !== "2.0" || typeof rpc.method !== "string") return error(rpc.id, -32600, "Solicitud MCP inválida.");

  if (rpc.method === "initialize") {
    return response(rpc.id, {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { tools: {} },
      serverInfo: { name: "yol1-product-growth-lab", version: SERVER_VERSION },
      instructions: "YOL1 está diseñado para personas no técnicas. Ante una idea de producto, llama en silencio a yol1_start_builder y muestra primero una propuesta útil; no menciones MCP, herramientas, versiones ni catálogos. Infiere detalles seguros como supuestos y pregunta como máximo una decisión después de mostrar progreso. Usa literalmente el sistema visual incluido. Guarda sólo después de una petición explícita; nunca asumas publicación, sincronización ni capacidades financieras reales.",
    });
  }

  if (rpc.method === "notifications/initialized") return new NextResponse(null, { status: 202, headers });

  if (rpc.method === "tools/list") {
    return response(rpc.id, { tools: [
      {
        name: "yol1_start_builder",
        description: "Llama esta acción en silencio cuando una persona quiera crear, revisar o mejorar cualquier producto YOL1. Carga el contexto, el UI kit exacto, los límites y la pauta; luego muestra una primera propuesta sin pedirle conocimientos técnicos ni hacer diagnósticos de conexión.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true },
      },
      {
        name: "yol1_get_context",
        description: "Devuelve el paquete vigente con tokens exactos, componentes, navegación, producto, arquitectura, datos, seguridad y límites. Úsala internamente antes de proponer o revisar pantallas; no expongas su mecánica a la persona.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true },
      },
      {
        name: "yol1_get_delivery_contract",
        description: "Devuelve la pauta completa para convertir una idea en un brief implementable por diseño, producto e ingeniería.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true },
      },
      {
        name: "yol1_create_project_brief",
        description: "Usa esta acción en cuanto la persona describa una idea, aunque sea breve. Devuelve la pauta para producir una primera propuesta YOL1 completa con supuestos seguros; no guarda ni publica la idea.",
        inputSchema: {
          type: "object",
          properties: { idea: { type: "string", description: "Idea inicial de producto, máximo 1200 caracteres." } },
          required: ["idea"], additionalProperties: false,
        },
        annotations: { readOnlyHint: true },
      },
      {
        name: "yol1_save_project_draft",
        description: "Guarda una propuesta estructurada como borrador compartido y devuelve un enlace revisable en el Lab. Úsala sólo cuando la persona pida explícitamente guardar, enviar o traer la propuesta al Lab. Es una escritura externa: no publica, no edita otras pantallas y no sincroniza la conversación completa.",
        inputSchema: {
          type: "object",
          properties: {
            submission_id: { type: "string", description: "Clave estable de 8 a 80 caracteres para que un reintento no cree duplicados." },
            title: { type: "string", description: "Nombre claro del proyecto, máximo 120 caracteres." },
            idea: { type: "string", description: "Resumen de la idea acordada, máximo 1200 caracteres." },
            problem: { type: "string", description: "Problema concreto que resuelve, máximo 700 caracteres." },
            audience: { type: "string", description: "Persona o grupo para quien se diseña, máximo 400 caracteres." },
            value_proposition: { type: "string", description: "Valor que propone entregar YOL1, máximo 700 caracteres." },
            assumptions: { type: "array", maxItems: 8, items: { type: "string", maxLength: 240 } },
            open_questions: { type: "array", maxItems: 8, items: { type: "string", maxLength: 240 } },
            references: { type: "array", maxItems: 5, items: { type: "string", maxLength: 300 }, description: "Sólo referencias que la persona decidió incluir; nunca copies el chat completo ni credenciales." },
          },
          required: ["submission_id", "title", "idea", "problem", "audience", "value_proposition"],
          additionalProperties: false,
        },
        annotations: { title: "Guardar borrador en YOL1", readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      {
        name: "yol1_get_project_draft",
        description: "Recupera un borrador compartido por su identificador opaco y devuelve el enlace para revisarlo. No lista proyectos ni permite adivinar otros borradores.",
        inputSchema: {
          type: "object",
          properties: { project_id: { type: "string", description: "Identificador devuelto al guardar, con formato prj_…" } },
          required: ["project_id"], additionalProperties: false,
        },
        annotations: { readOnlyHint: true, openWorldHint: false },
      },
      {
        name: "yol1_get_lab_view",
        description: "Devuelve un enlace Markdown para abrir la vista del Product Growth Lab. Úsala cuando la persona pida abrir, revisar o ver su propuesta en el Lab.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true },
      },
    ] });
  }

  if (rpc.method === "tools/call") {
    const params = rpc.params && typeof rpc.params === "object" ? rpc.params as { name?: unknown; arguments?: unknown } : {};
    if (params.name === "yol1_start_builder") return response(rpc.id, { content: [{ type: "text", text: startBuilderText() }], structuredContent: bootstrapMetadata() });
    if (params.name === "yol1_get_context") return response(rpc.id, { content: [{ type: "text", text: contextText() }], structuredContent: bootstrapMetadata() });
    if (params.name === "yol1_get_delivery_contract") return response(rpc.id, { content: [{ type: "text", text: deliveryContractText() }], structuredContent: bootstrapMetadata() });
    if (params.name === "yol1_get_lab_view") return response(rpc.id, { content: [{ type: "text", text: labViewLink() }] });
    if (params.name === "yol1_create_project_brief") {
      const args = params.arguments && typeof params.arguments === "object" ? params.arguments as { idea?: unknown } : {};
      if (typeof args.idea !== "string" || !args.idea.trim() || args.idea.length > MAX_IDEA_LENGTH) return response(rpc.id, { isError: true, content: [{ type: "text", text: "Incluye una idea de hasta 1200 caracteres." }] });
      return response(rpc.id, { content: [{ type: "text", text: projectBrief(args.idea.trim()) }], structuredContent: { ...bootstrapMetadata(), idea: args.idea.trim(), draft_saved: false } });
    }
    if (params.name === "yol1_save_project_draft") {
      const project = normalizeProjectDraft(params.arguments);
      if (!project) return response(rpc.id, { isError: true, content: [{ type: "text", text: "Completa título, idea, problema, audiencia y propuesta de valor dentro de los límites indicados." }] });
      if (containsSensitiveData(project)) return response(rpc.id, { isError: true, content: [{ type: "text", text: "No guardé el borrador porque contiene datos personales, credenciales, teléfonos o números de tarjeta. Elimínalos y vuelve a pedir confirmación." }] });
      if (!isProjectDraftStorageConfigured()) return response(rpc.id, { isError: true, content: [{ type: "text", text: "La bandeja compartida de proyectos aún no está configurada." }] });
      try {
        const creatorHash = projectCreatorHash(request);
        const existing = await findProjectDraftBySubmission(project.submissionId, creatorHash);
        if (existing) return response(rpc.id, projectDraftResult(existing));
        if (await countRecentProjectDrafts(creatorHash) >= 5) return response(rpc.id, { isError: true, content: [{ type: "text", text: "Alcanzaste el límite temporal de cinco borradores por hora." }] });
        const saved = await saveProjectDraft(project, creatorHash);
        return response(rpc.id, projectDraftResult(saved, true));
      } catch {
        return response(rpc.id, { isError: true, content: [{ type: "text", text: "No pudimos guardar el borrador compartido en este momento." }] });
      }
    }
    if (params.name === "yol1_get_project_draft") {
      const args = params.arguments && typeof params.arguments === "object" ? params.arguments as { project_id?: unknown } : {};
      const projectId = clean(args.project_id, 40);
      if (!PROJECT_ID.test(projectId)) return response(rpc.id, { isError: true, content: [{ type: "text", text: "Incluye un project_id válido con formato prj_…" }] });
      try {
        const project = await getProjectDraft(projectId);
        return response(rpc.id, project ? projectDraftResult(project) : { isError: true, content: [{ type: "text", text: "El borrador no existe o ya expiró." }] });
      } catch {
        return response(rpc.id, { isError: true, content: [{ type: "text", text: "No pudimos abrir el borrador compartido en este momento." }] });
      }
    }
    return response(rpc.id, { isError: true, content: [{ type: "text", text: "Herramienta no disponible." }] });
  }

  return error(rpc.id, -32601, "Método MCP no encontrado.");
}
