import { NextResponse } from "next/server";

export const runtime = "nodejs";

const PROTOCOL_VERSION = "2025-03-26";
const MAX_IDEA_LENGTH = 1_200;
const LAB_VIEW_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yol1-product-growth-lab.vercel.app";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id",
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
  return `# Contexto aprobado de YOL1\n\n- Diseña dark-first. Acid para acción, aqua para explicación y rosa suave solo para lo social; nunca uses rosa como alerta.\n- La experiencia explica evidencia, límites y siguiente paso. No promete banca, pagos, KYC, beneficios, partners ni licencias que no estén aprobados.\n- Chile es la jurisdicción base. KYC, licencias y partners se marcan “Por validar” hasta tener evidencia.\n- Para cada pantalla: objetivo, contenido, CTA, evento simple, datos a guardar/consultar y todo lo que puede salir mal.\n- Arquitectura candidata: React Native + AWS. No es una decisión cerrada.\n- La propuesta se revisa antes de publicarse. No se crea una rama ni se modifica el producto automáticamente.`;
}

function projectBrief(idea: string) {
  return `# Borrador de propuesta YOL1\n\n## Idea inicial\n${idea}\n\n## Completar antes de enviar\n1. Problema concreto y quién lo vive.\n2. Momento de uso y aha moment.\n3. Flujo de cinco a siete pantallas con CTAs claros.\n4. Datos: guardar, consultar y no almacenar.\n5. Dependencias técnicas candidatas y preguntas abiertas.\n6. Riesgos, límites y qué no debe prometer.\n\nEste resultado es un borrador de trabajo: no publica una funcionalidad ni representa una capacidad operativa.`;
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
    version: "0.1.0",
    transport: "streamable-http",
    access: "local-read-only-demo",
    tools: ["yol1_start_builder", "yol1_get_context", "yol1_create_project_brief", "yol1_get_lab_view"],
    note: "Contrato local de demostración. No implica endpoint público, compatibilidad de cliente ni autorización operativa.",
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
      serverInfo: { name: "yol1-product-growth-lab", version: "0.1.0" },
      instructions: "MCP local de solo lectura para probar contexto YOL1. No asumas compatibilidad externa ni capacidades financieras reales.",
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
        description: "Devuelve los principios de diseño, producto, datos y límites aprobados de YOL1 para crear una propuesta.",
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
    if (params.name === "yol1_get_lab_view") return response(rpc.id, { content: [{ type: "text", text: labViewLink() }] });
    if (params.name === "yol1_create_project_brief") {
      const args = params.arguments && typeof params.arguments === "object" ? params.arguments as { idea?: unknown } : {};
      if (typeof args.idea !== "string" || !args.idea.trim() || args.idea.length > MAX_IDEA_LENGTH) return response(rpc.id, { isError: true, content: [{ type: "text", text: "Incluye una idea de hasta 1200 caracteres." }] });
      return response(rpc.id, { content: [{ type: "text", text: projectBrief(args.idea.trim()) }] });
    }
    return response(rpc.id, { isError: true, content: [{ type: "text", text: "Herramienta no disponible." }] });
  }

  return error(rpc.id, -32601, "Método MCP no encontrado.");
}
