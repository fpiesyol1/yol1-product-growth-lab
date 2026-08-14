import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("Tarjetas conserva estado en investigación y no muestra un flujo no publicado", async () => {
  const page = await source("app/page.tsx");
  const portfolio = await source("lib/product-portfolio.ts");
  assert.match(portfolio, /id: "cards"[\s\S]*published: false/);
  assert.doesNotMatch(page, /productId === "cards" && <CardsDiscovery/);
  assert.match(page, /<UnpublishedStage product=\{activeProduct\}/);
  assert.match(page, /activeProduct\.published && <ProductSpecification/);
});

test("ficha y trazabilidad mantienen QR NFC wallet y partners como gates", async () => {
  const portfolio = await source("lib/product-portfolio.ts");
  const direction = await source("DIRECCION-PRODUCTOS-FELIPE.md");
  const research = await source("RESEARCH-TARJETAS-YOL1-2026-08-14.md");
  const prd = await source("PRD-TARJETAS-YOL1.md");
  assert.match(portfolio, /cards_home_viewed/);
  assert.match(portfolio, /Nunca PAN, CVV, PIN, OTP/);
  assert.match(portfolio, /Emisor\/processor\/rail · sin selección ni conexión/);
  assert.match(direction, /Tarjetas como ecosistema de intención/);
  assert.match(research, /Hipótesis expresamente fuera del prototipo/);
  assert.match(research, /QR para pagar/);
  assert.match(research, /NFC propio/);
  assert.match(research, /Tarjeta compartida/);
  assert.match(research, /Tarjeta corporativa/);
  assert.match(research, /`published: false`/);
  assert.match(research, /En investigación · Borrador local/);
  assert.doesNotMatch(research, /\*\*NO PUBLICADO\*\*/);
  assert.match(prd, /QR\/NFC\/wallet\/compartida\/corporativa se mantienen fuera/);
});
