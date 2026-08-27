import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("MCP distingue la barra primaria, la ruta secundaria Cartola y el título de Deudas", async () => {
  const [page, route] = await Promise.all([
    source("app/page.tsx"),
    source("app/api/mcp/route.ts"),
  ]);
  const navStart = page.indexOf('<nav className="bottom-nav bottom-nav-five"');
  const navEnd = page.indexOf("</nav>", navStart);
  assert.ok(navStart >= 0 && navEnd > navStart, "debe existir la navegación primaria del Acompañante");
  const primaryLabels = [...page.slice(navStart, navEnd).matchAll(/<NavButton[^>]+label="([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(primaryLabels, ["Inicio", "Finanzas", "Ahorrar", "Deudas", "Mi banco"]);
  assert.match(route, /companion_navigation: \{\s*primary: \["Inicio", "Finanzas", "Ahorrar", "Deudas", "Mi banco"\],\s*secondary: \[\{ label: "Cartola", parent: "Finanzas" \}\],\s*screen_titles: \{ Deudas: "Tu plan de deuda" \},\s*\}/);
  assert.match(page, /finanzas: "Mis finanzas"/);
  assert.match(page, /cartola: "Cartola"/);
  assert.match(page, /deudas: "Tu plan de deuda"/);
  assert.doesNotMatch(route, /companion_navigation: \[[^\]]+\]/);
});
