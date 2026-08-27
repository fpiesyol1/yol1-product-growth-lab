import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("reload con ?attempt recupera únicamente el último resultado terminal asociado", async () => {
  const [payer, domain, types] = await Promise.all([
    source("app/pagar/[token]/page.tsx"),
    source("lib/debt-center/domain.ts"),
    source("lib/debt-center/types.ts"),
  ]);

  assert.match(payer, /new URLSearchParams\(window\.location\.search\)\.get\("attempt"\)/);
  assert.match(payer, /attemptFromUrl && payload\.debt\.lastCompletedAttempt\?\.id === attemptFromUrl/);
  assert.match(payer, /setResultAmount\(payload\.debt\.lastCompletedAttempt\.amount\)/);
  assert.match(payer, /setHistoricalPaid\(false\);\s*setScreen\("result"\)/);
  assert.match(payer, /replaceState\(\{\}, "", `\/pagar\/\$\{encodeURIComponent\(publicToken\)\}\?attempt=\$\{encodeURIComponent\(payload\.attempt\.id\)\}`\)/);
  assert.match(domain, /item\.debtId === debt\.id && item\.source === "payment_attempt"/);
  assert.match(domain, /lastCompletedAttempt: lastCompleted && lastCompleted\.source === "payment_attempt"\s*\? \{ id: lastCompleted\.paymentAttemptId, amount: lastCompleted\.amount, completedAt: lastCompleted\.settledAt \}\s*: undefined/);
  assert.match(types, /lastCompletedAttempt\?: \{ id: string; amount: number; completedAt: string \}/);
});

test("follow-up del gasto enlaza sólo sus cobros, copia el link correcto y confirma por separado", async () => {
  const [page, css] = await Promise.all([
    source("app/cuentas-claras/page.tsx"),
    source("app/cuentas-claras/cuentas-claras.module.css"),
  ]);

  assert.match(page, /function ExpenseCreatedFollowup/);
  assert.match(page, /dashboard\?\.debts\.filter\(\(debt\) => debt\.expenseId === createdExpenseId\)/);
  assert.match(page, /debt\.creditorParticipantId === currentParticipantId && debt\.outstandingAmount > 0/);
  assert.match(page, /payload\.result\?\.expense\?\.id/);
  assert.match(page, /onSaved\(payload\.dashboard, payload\.result\.expense\.id\)/);
  assert.match(page, /function collectionMessageBody\(debt: DebtSummary, messageKind: CollectionMessageKind\)/);
  assert.match(page, /messageKind === "follow_up"[\s\S]*te vuelvo a compartir la cuenta[\s\S]*te comparto el cobro demo/);
  assert.match(page, /await navigator\.clipboard\.writeText\(`\$\{collectionMessageBody\(debt, messageKind\)\} \$\{url\}`\)/);
  assert.match(page, /setPreparedDebtIds\(\(current\) => current\.includes\(debt\.id\) \? current : \[\.\.\.current, debt\.id\]\)/);
  assert.match(page, /setShareConfirmation\(\{ debtId: debt\.id, messageKind, commandId: `collection_share_cmd_\$\{crypto\.randomUUID\(\)\.replaceAll\("-", ""\)\}` \}\)/);
  assert.match(page, /action: "confirm_collection_shared"/);
  assert.match(page, /Esto no confirma entrega ni lectura\./);

  const requiredClasses = ["createdFollowup", "createdSummary", "createdLead", "createdDebtList", "createdProgress", "createdEmpty"];
  for (const className of requiredClasses) {
    assert.match(page, new RegExp(`styles\\.${className}`), `${className} debe usarse en el follow-up`);
    assert.match(css, new RegExp(`\\.${className}(?:\\{|[ >.:])`), `${className} debe tener CSS explícito`);
  }
});

test("CTA payer_success abre un gasto limpio sin propagar token, deuda, intento ni monto", async () => {
  const [payer, clearAccounts] = await Promise.all([
    source("app/pagar/[token]/page.tsx"),
    source("app/cuentas-claras/page.tsx"),
  ]);
  const match = payer.match(/data-event-id="payer_creator_intent_selected" href="([^"]+)"/);
  assert.ok(match, "debe existir el CTA de creador después del resultado");
  const target = new URL(match[1], "https://lab.yol1.test");

  assert.equal(target.pathname, "/");
  assert.deepEqual([...target.searchParams.keys()].sort(), ["new", "product", "source"]);
  assert.equal(target.searchParams.get("product"), "clear_accounts");
  assert.equal(target.searchParams.get("source"), "payer_success");
  assert.equal(target.searchParams.get("new"), "expense");
  assert.doesNotMatch(target.search, /token|debt|attempt|amount|payment|public/i);
  assert.match(clearAccounts, /params\.get\("source"\) !== "companion"/);
  assert.match(clearAccounts, /params\.get\("new"\) === "expense" \? "expense" as Composer : null/);
});
