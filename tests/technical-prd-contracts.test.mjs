import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

const snakeCase = /^[a-z][a-z0-9_]*$/;
const piiInName = /(?:rut|serial|biometr|document|pan|cvv|password|credential|email|phone|telefono|account_number)/i;

function onboardingEvents(markdown) {
  const section = markdown.split("## Eventos propuestos")[1]?.split("## Arquitectura")[0] ?? "";
  return [...section.matchAll(/^\| `([^`]+)` \|/gm)].map((match) => match[1]);
}

test("los eventos de ficha y onboarding usan snake_case y no exponen identificadores sensibles", async () => {
  const page = await source("app/page.tsx");
  const portfolio = await source("lib/product-portfolio.ts");
  const onboardingPrd = await source("PRD-ONBOARDING-KYC-PROGRESIVO.md");
  const specEvents = [...portfolio.matchAll(/event:\s*"([^"]+)"/g)].map((match) => match[1]);
  const proposedEvents = onboardingEvents(onboardingPrd);

  assert.ok(specEvents.length >= 8, "debe haber eventos para las especificaciones internas");
  assert.ok(proposedEvents.length >= 6, "Onboarding debe declarar su catálogo mínimo");
  for (const event of [...specEvents, ...proposedEvents]) {
    assert.match(event, snakeCase, `${event} debe usar snake_case`);
    assert.doesNotMatch(event, piiInName, `${event} no debe contener un identificador sensible`);
  }

  assert.match(portfolio, /explicit\.replaceAll\("\.", "_"\)/);
  assert.match(page, /data-event="portfolio_product_selected" data-product-key=\{product\.id\}/);
  assert.doesNotMatch(page, /data-event=\{`portfolio\.\$\{product\.id\}\.select`\}/);
  assert.match(onboardingPrd, /No guardar en analytics:\*\* OTP, RUT, número de serie, biometría, documentos/i);
});

test("la metadata base está declarada junto a cada evento", async () => {
  const portfolio = await source("lib/product-portfolio.ts");
  const onboardingPrd = await source("PRD-ONBOARDING-KYC-PROGRESIVO.md");
  const discovery = await source("DISCOVERY-HOME-BANKING-TARJETAS.md");
  const metadataBlock = portfolio.split("export function eventMetadata")[1]?.split("export function proposedEventForElement")[0] ?? "";

  for (const field of ["event_name", "event_id", "event_at", "anonymous_id", "user_id", "session_id", "product_key", "screen_key", "action_key", "platform", "app_version", "schema_version", "source", "consent_analytics", "correlation_id"]) {
    assert.match(metadataBlock, new RegExp(`\\["${field}"`), `falta ${field} en la ficha`);
  }
  for (const field of ["event_id", "event_at", "anonymous_id", "session_id", "product_key", "screen_key", "action_key", "app_version", "schema_version", "platform", "source", "consent_analytics", "correlation_id"]) {
    assert.match(onboardingPrd, new RegExp(`\\\`${field}\\\``), `falta ${field} en el contrato de Onboarding`);
    assert.match(discovery, new RegExp(`\\\`${field}\\\``), `falta ${field} en el discovery de Home Banking`);
  }
  assert.doesNotMatch(discovery, /`occurred_at`/, "el discovery debe usar event_at como clave canónica");
});

test("cada LivingSpec declara fuentes de datos", async () => {
  const portfolio = await source("lib/product-portfolio.ts");
  const dataBlocks = portfolio.match(/data:\s*\{[\s\S]*?\},\s*kyc:/g) ?? [];

  assert.match(portfolio, /sources:\s*string\[\]/, "LivingSpec debe tipar fuentes");
  assert.ok(dataBlocks.length >= 8, "deben existir bloques de datos para las fichas");
  for (const block of dataBlocks) assert.match(block, /sources:\s*\[/, "cada ficha debe declarar sus fuentes");
});

test("Onboarding declara valor antes de pedir OTP", async () => {
  const page = await source("app/page.tsx");
  const onboardingPrd = await source("PRD-ONBOARDING-KYC-PROGRESIVO.md");

  assert.match(onboardingPrd, /entregar una primera utilidad antes de pedir identidad/i);
  assert.ok(onboardingPrd.indexOf("| Bienvenida") < onboardingPrd.indexOf("| Confirmar OTP"), "Bienvenida debe ocurrir antes de OTP");
  assert.match(page, /Entiende tu plata\.\s*<br \/><span>Antes de pedirte datos\./);
  assert.ok(page.indexOf("Explorar YOL1") < page.indexOf("Enviar código"), "la exploración debe existir antes de pedir OTP");
});
