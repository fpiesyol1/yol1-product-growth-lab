import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("Pomelo queda conectado como referencia documental opcional y acotada", async () => {
  const config = await source(".codex/config.toml");
  assert.match(config, /\[mcp_servers\.pomelo_api_reference\]/);
  assert.match(config, /url = "https:\/\/api-reference-mcp\.pomelo\.la\/mcp"/);
  assert.match(config, /required = false/);
  assert.match(config, /default_tools_approval_mode = "approve"/);
  assert.match(config, /search_endpoints/);
  assert.match(config, /get_endpoint/);
  assert.match(config, /generate_request_example/);
  assert.match(config, /list_endpoints_by_topic/);
  assert.match(config, /list_topics/);
  assert.doesNotMatch(config, /command\s*=|bearer|token|secret|api_key/i);
});

test("el research separa documentación, fit candidato y aprobación real", async () => {
  const research = await source("POMELO-MCP-FIT-RESEARCH.md");
  assert.match(research, /fuente de documentación técnica para discovery/i);
  assert.match(research, /No es una conexión operacional con Pomelo/i);
  assert.match(research, /documentado/);
  assert.match(research, /fit_candidato/);
  assert.match(research, /por_validar_comercial/);
  assert.match(research, /por_validar_riesgo_legal/);
  assert.match(research, /Sólo `aprobado` permite/i);
  assert.match(research, /No ejecutar DELETE, POST, PATCH o PUT contra APIs Pomelo reales/i);
});

test("Construir mi propio producto ofrece un inicio directo y deja QA como ayuda progresiva", async () => {
  const page = await source("app/page.tsx");
  const css = await source("app/globals.css");
  assert.match(page, /Elige dónde trabajas/);
  assert.match(page, /01 · ELIGE TU IA/);
  assert.match(page, /02 · CUENTA UNA IDEA/);
  assert.match(page, /Copiar y empezar/);
  assert.match(page, /Abre la guía exacta para tu herramienta/);
  assert.match(page, /YOL1 revisa esto contigo antes de mostrarte una versión/);
  assert.match(page, /Qué no hace esta conexión/);
  assert.match(page, /scrollIntoView\(\{ behavior: "smooth", block: "start" \}\)/);
  assert.match(css, /\.builder-quickstart/);
  assert.match(css, /\.builder-client-actions button \{ min-height:56px/);
  assert.match(css, /\.builder-compact-help/);
});
