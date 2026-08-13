import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("rotula el prototipo y aterriza la propuesta a explorar", async () => {
  const page = await source("app/page.tsx");
  assert.match(page, /prototipo exploratorio con datos sintéticos/i);
  assert.match(page, /no conecta bancos, no mueve dinero/i);
  assert.match(page, /Encuentra dónde pierdes plata o desaprovechas beneficios/i);
  assert.match(page, /Explorar ejemplo/);
  assert.match(page, /Simular con mi información/);
  assert.match(page, /DATOS FICTICIOS/);
  assert.doesNotMatch(page, /Propuestas sin GitHub/);
  assert.match(page, /Comparar con referencias agregadas/);
  assert.match(page, /muestra suficiente y población comparable visible/);
});

test("mantiene la autoridad recommend-only y los cobros simulados", async () => {
  const page = await source("app/page.tsx");
  assert.match(page, /Lo reconozco/);
  assert.match(page, /Crear solicitud de cobro/);
  assert.match(page, /Simular banco/);
  assert.match(page, /Simular cartola/);
  assert.match(page, /Ordena lo pendiente|Ordenar pendientes/);
  assert.match(page, /No cobra, inicia ni recibe pagos reales/i);
  assert.match(page, /no disputa ni recupera fondos/i);
  assert.match(page, /no cambia proveedores/i);
  assert.doesNotMatch(page, /pago exitoso|dinero transferido|banco conectado/i);
});

test("documenta límites y gates de aprendizaje", async () => {
  const spec = await source("MVP-SPEC.md");
  assert.match(spec, /E2 — Comprensión/);
  assert.match(spec, /E3 — Acción voluntaria/);
  assert.match(spec, /E4 — Resultado \/ retorno/);
  assert.match(spec, /No demuestra demanda, product-market fit, economics ni readiness/i);
  assert.match(spec, /Directo y Embebido quedan fuera/i);
});
