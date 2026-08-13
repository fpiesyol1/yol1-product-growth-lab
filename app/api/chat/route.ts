import { NextResponse } from "next/server";
import { createDemoResponse } from "../../../lib/ai/demo-response";
import { YOL1_KNOWLEDGE_VERSION } from "../../../lib/ai/knowledge";
import { routeKnowledge } from "../../../lib/ai/knowledge-router";
import { buildYol1Instructions } from "../../../lib/ai/yol1-prompt";

type InputMessage = { role: "user" | "assistant"; text: string };

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 700;

function validMessage(value: unknown): value is InputMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return (message.role === "user" || message.role === "assistant")
    && typeof message.text === "string"
    && message.text.trim().length > 0
    && message.text.length <= MAX_MESSAGE_LENGTH;
}

function extractOutputText(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const output = (payload as { output?: unknown }).output;
  if (!Array.isArray(output)) return "";
  return output.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) return [];
    return content.flatMap((part) => {
      if (!part || typeof part !== "object") return [];
      const typed = part as { type?: unknown; text?: unknown };
      return typed.type === "output_text" && typeof typed.text === "string" ? [typed.text] : [];
    });
  }).join("\n").trim();
}

export async function GET() {
  return NextResponse.json({ configured: Boolean(process.env.OPENAI_API_KEY) });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const typedBody = body && typeof body === "object" ? body as { messages?: unknown; aiConsent?: unknown } : {};
  const rawMessages = typedBody.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0 || rawMessages.length > MAX_MESSAGES || !rawMessages.every(validMessage)) {
    return NextResponse.json({ error: "La conversación no tiene un formato válido." }, { status: 400 });
  }

  const messages = rawMessages as InputMessage[];
  const lastQuestion = [...messages].reverse().find((message) => message.role === "user")?.text ?? "";
  const apiKey = process.env.OPENAI_API_KEY;
  const localRoute = routeKnowledge(lastQuestion);

  if (localRoute.kind !== "fallback") {
    return NextResponse.json({
      message: { id: crypto.randomUUID(), role: "assistant", text: localRoute.text, mode: localRoute.kind === "approved" ? "knowledge" : "demo" },
      knowledgeVersion: YOL1_KNOWLEDGE_VERSION,
      matchedKnowledgeId: localRoute.knowledgeId,
      resolvedBy: localRoute.kind,
    });
  }

  if (!apiKey || typedBody.aiConsent !== true) {
    return NextResponse.json({
      message: { id: crypto.randomUUID(), role: "assistant", text: createDemoResponse(lastQuestion), mode: "demo" },
      knowledgeVersion: YOL1_KNOWLEDGE_VERSION,
      resolvedBy: "fallback",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6-terra",
        instructions: buildYol1Instructions(),
        input: messages.map((message) => ({ role: message.role, content: message.text })),
        max_output_tokens: 350,
        store: false,
      }),
      signal: AbortSignal.timeout(20_000),
    });

    const payload: unknown = await response.json();
    const text = extractOutputText(payload);
    if (!response.ok || !text) throw new Error("Model response unavailable");

    return NextResponse.json({
      message: { id: crypto.randomUUID(), role: "assistant", text, mode: "ai" },
      knowledgeVersion: YOL1_KNOWLEDGE_VERSION,
      resolvedBy: "ai",
    });
  } catch {
    return NextResponse.json({
      message: { id: crypto.randomUUID(), role: "assistant", text: createDemoResponse(lastQuestion), mode: "demo" },
      knowledgeVersion: YOL1_KNOWLEDGE_VERSION,
      degraded: true,
      resolvedBy: "fallback",
    });
  }
}
