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
const CONTEXT_VERSION = "yol1-lab-context/0.2";

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

function contextText() {
  return `# Contexto de construcción YOL1 · ${CONTEXT_VERSION}\n\n## Regla principal\nNo inventes capacidades. Distingue siempre: hecho aprobado, propuesta candidata y pregunta por resolver. Esta conversación genera un borrador; nunca modifica el Lab ni publica producto automáticamente.\n\n## Sistema visual vigente (provisional)\n- Dark-first. Fondo profundo; cream para lectura; acid = acción principal; aqua = explicación/evidencia; violeta = colaboración/inputs; rosa suave sólo para lo social, nunca alerta.\n- Componentes: jerarquía editorial fuerte, superficies con borde fino, CTAs claros, estados vacíos honestos, foco visible y controles de al menos 44px cuando son táctiles.\n- Cada pantalla debe explicar: qué ocurre, por qué, qué dato usa y cuál es el siguiente paso.\n- Este paquete es versionado. Cuando exista el design system oficial, reemplaza esta sección y conserva las reglas de producto, datos y seguridad.\n\n## Producto\n- Chile es jurisdicción base. KYC, licencias, partners, pagos, bancos, QR, NFC y beneficios se marcan “Por validar” hasta tener evidencia, owner y capability aprobada.\n- La experiencia financiera primero ordena, explica y permite decidir; no debe aparentar ejecución real si no existe.\n- Todo flujo propone un momento de uso, usuario, problema, aha moment, 5–7 pantallas, estados vacío/carga/error, CTA, evidencia y salida.\n\n## Arquitectura candidata\n- Mobile: React Native con navegación tipada, componentes reutilizables, accesibilidad y estado explícito de carga/error/vacío.\n- Backend: BFF/API versionado por dominio; autorización y validación server-side; el cliente recibe sólo el read model de la vista.\n- AWS: API Gateway → Lambda por dominio candidato; DynamoDB/RDS se decide desde patrones de acceso y auditoría; EventBridge sólo cuando una integración asíncrona esté aprobada.\n- Operación: feature flag por capability, correlation_id, logs estructurados, observabilidad, rollback y consentimiento antes de analytics.\n\n## Contrato de datos y eventos\nPara cada pantalla define: read model, write model, system of record, frescura del dato, retención, PII prohibida, eventos snake_case, event_at, user_id o anonymous_id, session_id, correlation_id, schema_version y consent_analytics.\nNunca incluyas en analytics o logs generales: OTP, RUT, serie, documentos, biometría, credenciales, PAN/CVV/PIN, QR completo, tokens, contactos crudos ni payloads financieros completos.\n\n## Revisión obligatoria\nAntes de entregar una propuesta, incluye: datos consultados/generados, dependencias, gates, riesgos de experiencia, Error capa 8, preguntas por validar y qué queda explícitamente fuera de alcance.`;
}

function deliveryContractText() {
  return `# Contrato de entrega YOL1 · ${CONTEXT_VERSION}\n\nDevuelve una propuesta con estas secciones, en este orden:\n1. Problema, usuario y momento de uso.\n2. Hipótesis de valor y aha moment.\n3. Flujo de 5–7 pantallas: contenido, CTA, evento y estados vacío/carga/error.\n4. Design system: jerarquía, componentes, tokens y accesibilidad.\n5. Datos: read model, write model, system of record, frescura, retención y PII prohibida.\n6. Arquitectura candidata: React Native, BFF/API, AWS, dependencias y observabilidad.\n7. Instrumentación: eventos snake_case y propiedades mínimas.\n8. Gates: capacidad, consentimiento, KYC/licencias/partner si aplica.\n9. Error capa 8: confusiones, drop-offs y recuperación.\n10. Fuera de alcance, preguntas y la próxima evidencia que falta.\n\nNunca afirme que una integración, pago, KYC, banco, licencia o partner está disponible sin evidencia explícita.`;
}

function projectBrief(idea: string) {
  return `# Borrador de propuesta YOL1\n\n## Idea inicial\n${idea}\n\n${deliveryContractText()}\n\nEste resultado es un borrador de trabajo: no publica una funcionalidad ni representa una capacidad operativa.`;
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
  return `¡Bienvenido a YOL1! En este espacio iremos creando prototipos de productos YOL1. Conversaremos por aquí y, cuando una idea tome forma, podrás verla en el Lab.\n\n[Aprieta acá para abrir la vista del Lab](${LAB_VIEW_URL}/?product=builder)\n\nPara partir, cuéntame con tus palabras qué te gustaría crear. Te haré una pregunta a la vez y te ayudaré a convertirlo en una primera propuesta.`;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers });
}

export async function GET() {
  return NextResponse.json({
    name: "YOL1 Product Growth Lab MCP",
    version: "0.2.0",
    transport: "streamable-http",
    access: "public-pilot-explicit-write",
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
      serverInfo: { name: "yol1-product-growth-lab", version: "0.2.0" },
      instructions: "MCP piloto de YOL1. Lee contexto y prepara propuestas. Guarda un borrador sólo después de una petición explícita de la persona; nunca asumas publicación, sincronización del chat ni capacidades financieras reales.",
    });
  }

  if (rpc.method === "notifications/initialized") return new NextResponse(null, { status: 202, headers });

  if (rpc.method === "tools/list") {
    return response(rpc.id, { tools: [
      {
        name: "yol1_start_builder",
        description: "Llama esta herramienta al inicio de toda conversación de creación de producto con YOL1. Da la bienvenida, explica el flujo en pocas líneas y devuelve el enlace Markdown ‘Aprieta acá para abrir la vista del Lab’.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true },
      },
      {
        name: "yol1_get_context",
        description: "Devuelve el paquete vigente de diseño, producto, arquitectura, datos, eventos, seguridad y límites. Úsala antes de proponer pantallas.",
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
        description: "Convierte una idea breve en una pauta de propuesta YOL1. No guarda ni publica la idea.",
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
    if (params.name === "yol1_start_builder") return response(rpc.id, { content: [{ type: "text", text: startBuilderText() }] });
    if (params.name === "yol1_get_context") return response(rpc.id, { content: [{ type: "text", text: contextText() }] });
    if (params.name === "yol1_get_delivery_contract") return response(rpc.id, { content: [{ type: "text", text: deliveryContractText() }] });
    if (params.name === "yol1_get_lab_view") return response(rpc.id, { content: [{ type: "text", text: labViewLink() }] });
    if (params.name === "yol1_create_project_brief") {
      const args = params.arguments && typeof params.arguments === "object" ? params.arguments as { idea?: unknown } : {};
      if (typeof args.idea !== "string" || !args.idea.trim() || args.idea.length > MAX_IDEA_LENGTH) return response(rpc.id, { isError: true, content: [{ type: "text", text: "Incluye una idea de hasta 1200 caracteres." }] });
      return response(rpc.id, { content: [{ type: "text", text: projectBrief(args.idea.trim()) }] });
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
