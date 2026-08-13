import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("Inicio conserva datos ficticios, bandeja y chat demo", async () => {
  const page = await source("app/page.tsx");
  assert.match(page, /DATOS FICTICIOS/);
  assert.match(page, /Entiende tus finanzas/);
  assert.match(page, /Tienes \{visibleCards\.length/);
  assert.match(page, /Disney\+ aparece dos veces/);
  assert.match(page, /Tu tarjeta tiene restaurantes con descuento/);
  assert.match(page, /Le debes a Camila/);
  assert.match(page, /La cuenta de Liguria parece compartida/);
  assert.match(page, /Pregúntale a YOL1/);
  assert.match(page, /Respuestas simuladas/);
  assert.doesNotMatch(page, /Explorar ejemplo|Simular con mi información/);
});

test("acciones y confirmaciones permanecen simuladas y visibles", async () => {
  const page = await source("app/page.tsx");
  const css = await source("app/globals.css");
  assert.match(page, /phone-toast/);
  assert.match(css, /\.phone-toast/);
  assert.match(page, /No cobra, paga ni contacta a nadie/i);
  assert.match(page, /no se conecta ninguna cuenta/i);
  assert.match(page, /no se carga ningún archivo/i);
  assert.match(page, /no se abrió WhatsApp, no se envió el mensaje y no se movió dinero/i);
  assert.match(page, /no se inició un pago real/i);
  assert.doesNotMatch(page, /pago exitoso|dinero transferido|banco conectado/i);
});

test("Cartola usa navegación general e individual y acciones coherentes", async () => {
  const page = await source("app/page.tsx");
  assert.match(page, /Ver cartola general/);
  assert.match(page, /\["General", "BCI", "MACH"\]/);
  assert.match(page, /"OK" \| "Revisar" \| "Dividir" \| "Cobrar"/);
  assert.match(page, /ASISTENTE DEMO/);
  assert.match(page, /Guardar nota demo/);
});

test("Cobrar y pagar cubre ambos lados y conserva borrador en la app", async () => {
  const page = await source("app/page.tsx");
  assert.match(page, /Cobrar y pagar/);
  assert.match(page, /ME DEBEN/);
  assert.match(page, /LE DEBO/);
  assert.match(page, /Por persona/);
  assert.match(page, /Por grupo \/ gasto/);
  assert.match(page, /collectDraft/);
  assert.match(page, /Crear contacto demo/);
  assert.match(page, /@josefa/);
  assert.match(page, /Ya me pagaron/);
  assert.match(page, /Conciliación de ejemplo/);
  assert.doesNotMatch(page, /Preparar en WhatsApp|yol1\.demo\/cobro/);
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
