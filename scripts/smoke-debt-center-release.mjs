import { randomUUID } from "node:crypto";
import process from "node:process";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

if (process.argv.includes("--help")) {
  console.log("Uso: pnpm run release:smoke -- --base-url https://preview.example.com [--allow-memory]");
  console.log("Opcional: VERCEL_AUTOMATION_BYPASS_SECRET se envía sólo como header y nunca se imprime.");
  process.exit(0);
}

const rawBaseUrl = argument("--base-url") ?? process.env.YOL1_SMOKE_BASE_URL;
if (!rawBaseUrl) {
  console.error("SMOKE_FAILED: define --base-url o YOL1_SMOKE_BASE_URL.");
  process.exit(1);
}

let baseUrl;
try {
  baseUrl = new URL(rawBaseUrl);
} catch {
  console.error("SMOKE_FAILED: base URL inválida.");
  process.exit(1);
}
if (!/^https:$/.test(baseUrl.protocol) && !(["localhost", "127.0.0.1"].includes(baseUrl.hostname) && baseUrl.protocol === "http:")) {
  console.error("SMOKE_FAILED: usa HTTPS o localhost HTTP.");
  process.exit(1);
}
baseUrl.pathname = "/";
baseUrl.search = "";
baseUrl.hash = "";

const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
const explicitlyAllowedBypassHost = process.env.YOL1_SMOKE_BYPASS_HOST?.trim();
if (bypassSecret && !baseUrl.hostname.endsWith(".vercel.app") && explicitlyAllowedBypassHost !== baseUrl.hostname) {
  console.error("SMOKE_FAILED: no se enviará el bypass a un host no autorizado. Define YOL1_SMOKE_BYPASS_HOST con el hostname exacto si es un dominio Vercel propio.");
  process.exit(1);
}
let sessionCookie = "";

async function request(path, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  if (bypassSecret) headers.set("x-vercel-protection-bypass", bypassSecret);
  if (sessionCookie) headers.set("cookie", sessionCookie);
  if (init.method && init.method !== "GET") {
    if (!headers.has("origin")) headers.set("origin", baseUrl.origin);
    if (!headers.has("sec-fetch-site")) headers.set("sec-fetch-site", "same-origin");
  }
  const response = await fetch(new URL(path, baseUrl), { ...init, headers, redirect: "manual" });
  if (!sessionCookie) {
    const cookie = response.headers.get("set-cookie")?.match(/yol1_cc_demo_session=[a-f0-9]{32}/)?.[0];
    if (cookie) sessionCookie = cookie;
  }
  return response;
}

async function json(response, expectedStatus, label) {
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`${label}: respuesta no JSON (${response.status}).`);
  }
  if (response.status !== expectedStatus) throw new Error(`${label}: HTTP ${response.status}, código ${payload?.error ?? "sin código"}.`);
  return payload;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  const initialResponse = await request("/api/debt-center");
  const initial = await json(initialResponse, 200, "dashboard inicial");
  assert(sessionCookie, "dashboard inicial: no se recibió cookie demo.");
  assert(initial.dashboard?.mode === "simulator", "dashboard inicial: mode no es simulator.");
  assert(initial.dashboard?.provider === "mock_floid", "dashboard inicial: provider no es mock_floid.");
  if (!process.argv.includes("--allow-memory")) assert(initial.dashboard?.storage === "neon", "dashboard inicial: producción no está usando Neon.");
  const debt = initial.dashboard?.debts?.find((item) => item.originalAmount === 10_000 && item.outstandingAmount === 10_000 && item.status === "open");
  assert(debt?.publicToken, "dashboard inicial: no está el caso demo de $10.000.");
  console.log("✓ dashboard aislado y MockFloid");

  const idempotencyKey = `release-smoke-${randomUUID()}`;
  const createResponse = await request(`/api/debt-center/public/${encodeURIComponent(debt.publicToken)}`, {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": idempotencyKey },
    body: JSON.stringify({ amount: 5_000 }),
  });
  const created = await json(createResponse, 201, "crear abono parcial");
  assert(created.attempt?.id && created.attempt?.status === "not_started", "crear abono parcial: intento inesperado.");

  const simulateResponse = await request(`/api/debt-center/attempts/${encodeURIComponent(created.attempt.id)}/simulate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ publicToken: debt.publicToken, status: "succeeded" }),
  });
  const simulated = await json(simulateResponse, 200, "confirmar abono parcial");
  assert(simulated.publicDebt?.paidAmount === 5_000 && simulated.publicDebt?.outstandingAmount === 5_000, "confirmar abono parcial: el saldo no quedó 5.000/5.000.");
  console.log("✓ abono parcial conserva saldo restante");

  const reload = await json(await request("/api/debt-center"), 200, "reload durable");
  const reloadedDebt = reload.dashboard?.debts?.find((item) => item.id === debt.id);
  assert(reloadedDebt?.paidAmount === 5_000 && reloadedDebt?.outstandingAmount === 5_000, "reload durable: Neon no conservó el saldo.");
  console.log("✓ reload conserva el ledger");

  const missingToken = `pay_${"f".repeat(32)}`;
  const missingResponse = await request(`/api/debt-center/public/${missingToken}`);
  await json(missingResponse, 404, "token inexistente");
  assert(/no-store/.test(missingResponse.headers.get("cache-control") ?? ""), "token inexistente: falta no-store.");

  const crossOriginResponse = await request("/api/debt-center", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://cross-origin.invalid", "sec-fetch-site": "cross-site" },
    body: JSON.stringify({ action: "reset_demo" }),
  });
  await json(crossOriginResponse, 403, "bloqueo cross-origin");

  const webhookResponse = await request("/api/debt-center/webhooks/floid", { method: "POST" });
  const webhook = await json(webhookResponse, 410, "webhook Floid cerrado");
  assert(webhook.error === "FLOID_NETWORK_DISABLED", "webhook Floid cerrado: código inesperado.");
  console.log("✓ rutas públicas fallan de forma segura");

  await json(await request("/api/debt-center", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "reset_demo" }),
  }), 200, "limpieza del caso smoke");
  console.log("RELEASE_SMOKE_OK");
} catch (error) {
  console.error(`SMOKE_FAILED: ${error instanceof Error ? error.message : "error desconocido"}`);
  process.exitCode = 1;
}
