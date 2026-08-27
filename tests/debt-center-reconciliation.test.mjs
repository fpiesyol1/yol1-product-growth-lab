import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) return nextResolve(`${specifier}.ts`, context);
      throw error;
    }
  },
});

const {
  confirmReconciliationCandidate,
  getDebtDashboard,
  getPublicDebtByToken,
  loadMockStatement,
  rejectReconciliationEntry,
  reopenReconciliationEntry,
  reverseReconciliationDecision,
} = await import("../lib/debt-center/service.ts");
const {
  loadDebtCenterStateForSession,
  MemoryDebtCenterRepository,
  mutateDebtCenterState,
} = await import("../lib/debt-center/state-repository.ts");
const { debtCenterWorkspaceId } = await import("../lib/debt-center/session.ts");
const { assertDebtCenterStateWithinLimits } = await import("../lib/debt-center/limits.ts");
const {
  MAX_MOCK_STATEMENTS,
  MAX_MOCK_STATEMENT_ENTRIES,
  MAX_RECONCILIATION_CANDIDATES,
  MAX_RECONCILIATION_DECISIONS,
  MOCK_STATEMENT_FIXTURE_VERSION,
} = await import("../lib/debt-center/reconciliation.ts");
const { createDebtCenterSeed } = await import("../lib/debt-center/seed.ts");

const commands = {
  loadA: `recon_load_cmd_${"a".repeat(32)}`,
  loadB: `recon_load_cmd_${"b".repeat(32)}`,
  confirmA: `recon_confirm_cmd_${"c".repeat(32)}`,
  confirmB: `recon_confirm_cmd_${"d".repeat(32)}`,
  rejectA: `recon_reject_cmd_${"e".repeat(32)}`,
  rejectB: `recon_reject_cmd_${"f".repeat(32)}`,
  reopen: `recon_reopen_cmd_${"1".repeat(32)}`,
  reverse: `recon_reverse_cmd_${"2".repeat(32)}`,
};

async function source(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

async function withRepository(run) {
  const previous = globalThis.__yol1DebtCenterRepository;
  const repository = new MemoryDebtCenterRepository();
  globalThis.__yol1DebtCenterRepository = repository;
  try {
    return await run(repository);
  } finally {
    globalThis.__yol1DebtCenterRepository = previous;
  }
}

async function loadFixture(sessionId, commandId = commands.loadA) {
  return loadMockStatement(sessionId, {
    commandId,
    fixtureVersion: MOCK_STATEMENT_FIXTURE_VERSION,
  });
}

function nicoDebt(dashboard) {
  const debt = dashboard.debts.find((item) => item.id === "debt_nico_10000");
  assert.ok(debt, "el fixture debe conservar la deuda de Nico");
  return debt;
}

function reconciliationEntry(dashboard, entryId) {
  const entry = dashboard.reconciliation.entries.find((item) => item.entryId === entryId);
  assert.ok(entry, `debe existir ${entryId}`);
  return entry;
}

test("fixture local concilia $5.000 exactos, deja $5.000 pendientes y sus replays no duplican efectos ni usan red", async () => {
  await withRepository(async () => {
    const sessionId = "a".repeat(32);
    const originalFetch = globalThis.fetch;
    let fetchCalls = 0;
    globalThis.fetch = async () => {
      fetchCalls += 1;
      throw new Error("NETWORK_FORBIDDEN_IN_RECONCILIATION_TEST");
    };
    try {
      const first = await loadFixture(sessionId);
      const afterFirst = await loadDebtCenterStateForSession(sessionId);
      const counts = {
        statements: afterFirst.state.mockStatements.length,
        entries: afterFirst.state.mockStatementEntries.length,
        candidates: afterFirst.state.reconciliationCandidates.length,
        decisions: afterFirst.state.reconciliationDecisions.length,
        settlements: afterFirst.state.settlements.length,
        activities: afterFirst.state.activities.length,
      };

      const sameCommandReplay = await loadFixture(sessionId);
      const naturalReplay = await loadFixture(sessionId, commands.loadB);
      const afterReplays = await loadDebtCenterStateForSession(sessionId);
      const dashboard = await getDebtDashboard(sessionId);

      assert.equal(first.result.id, "mock_statement_august_v1");
      assert.equal(sameCommandReplay.result.id, first.result.id);
      assert.equal(naturalReplay.result.id, first.result.id);
      assert.equal(fetchCalls, 0, "la cartola demo debe ser un fixture puro, sin red");
      assert.deepEqual({
        statements: afterReplays.state.mockStatements.length,
        entries: afterReplays.state.mockStatementEntries.length,
        candidates: afterReplays.state.reconciliationCandidates.length,
        decisions: afterReplays.state.reconciliationDecisions.length,
        settlements: afterReplays.state.settlements.length,
        activities: afterReplays.state.activities.length,
      }, counts, "ningún replay debe duplicar ledger, evidencia ni actividad");

      const debt = nicoDebt(dashboard);
      assert.equal(debt.originalAmount, 10_000);
      assert.equal(debt.paidAmount, 5_000);
      assert.equal(debt.outstandingAmount, 5_000);
      assert.equal(debt.status, "partially_paid");
      assert.equal(reconciliationEntry(dashboard, "stmt_entry_exact_nico_5000").state, "confirmed");
      assert.equal(reconciliationEntry(dashboard, "stmt_entry_exact_nico_5000").decisionSource, "automatic_rule");
      assert.equal(reconciliationEntry(dashboard, "stmt_entry_ambiguous_5000").state, "needs_review");
      assert.equal(afterReplays.state.reconciliationDecisions.filter((item) => item.action === "rule_auto_applied").length, 1);
      assert.equal(afterReplays.state.settlements.filter((item) => item.source === "mock_statement_reconciliation" && !item.reversedAt).length, 1);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

test("un abono ambiguo no muta el saldo hasta confirmar y la natural key evita duplicados", async () => {
  await withRepository(async () => {
    const sessionId = "b".repeat(32);
    await loadFixture(sessionId);
    const before = await getDebtDashboard(sessionId);
    const ambiguous = reconciliationEntry(before, "stmt_entry_ambiguous_5000");
    const candidate = ambiguous.candidates.find((item) => item.debtId === "debt_nico_10000");
    assert.ok(candidate);
    assert.equal(nicoDebt(before).outstandingAmount, 5_000);

    const rawBefore = await loadDebtCenterStateForSession(sessionId);
    assert.equal(rawBefore.state.settlements.filter((item) => item.source === "mock_statement_reconciliation" && item.statementEntryId === ambiguous.entryId && !item.reversedAt).length, 0);

    const input = { commandId: commands.confirmA, candidateId: candidate.id, expectedOutstandingAmount: 5_000 };
    const confirmed = await confirmReconciliationCandidate(sessionId, input);
    const sameCommandReplay = await confirmReconciliationCandidate(sessionId, input);
    const naturalReplay = await confirmReconciliationCandidate(sessionId, { ...input, commandId: commands.confirmB });
    const after = await getDebtDashboard(sessionId);
    const rawAfter = await loadDebtCenterStateForSession(sessionId);

    assert.equal(confirmed.result.action, "creator_confirmed");
    assert.equal(sameCommandReplay.result.id, confirmed.result.id);
    assert.equal(naturalReplay.result.id, confirmed.result.id);
    assert.equal(nicoDebt(after).outstandingAmount, 0);
    assert.equal(nicoDebt(after).status, "paid");
    assert.equal(reconciliationEntry(after, ambiguous.entryId).state, "confirmed");
    assert.equal(rawAfter.state.reconciliationDecisions.filter((item) => item.action === "creator_confirmed" && item.candidateId === candidate.id).length, 1);
    assert.equal(rawAfter.state.settlements.filter((item) => item.source === "mock_statement_reconciliation" && item.statementEntryId === ambiguous.entryId && !item.reversedAt).length, 1);
  });
});

test("cada conciliación conserva el saldo histórico antes y después aunque la deuda siga cambiando", async () => {
  await withRepository(async () => {
    const sessionId = "e".repeat(32);
    await loadFixture(sessionId);

    const afterAutomatic = await getDebtDashboard(sessionId);
    const exact = reconciliationEntry(afterAutomatic, "stmt_entry_exact_nico_5000");
    const ambiguous = reconciliationEntry(afterAutomatic, "stmt_entry_ambiguous_5000");
    const candidate = ambiguous.candidates.find((item) => item.debtId === "debt_nico_10000");
    assert.ok(candidate);
    assert.deepEqual({
      before: exact.decidedOutstandingBefore,
      after: exact.decidedOutstandingAfter,
    }, { before: 10_000, after: 5_000 });

    await confirmReconciliationCandidate(sessionId, {
      commandId: commands.confirmA,
      candidateId: candidate.id,
      expectedOutstandingAmount: 5_000,
    });
    const completed = await getDebtDashboard(sessionId);
    const historicalExact = reconciliationEntry(completed, exact.entryId);
    const historicalManual = reconciliationEntry(completed, ambiguous.entryId);

    assert.equal(nicoDebt(completed).outstandingAmount, 0);
    assert.deepEqual({
      before: historicalExact.decidedOutstandingBefore,
      after: historicalExact.decidedOutstandingAfter,
    }, { before: 10_000, after: 5_000 }, "el primer corte no debe recalcularse contra el saldo final");
    assert.deepEqual({
      before: historicalManual.decidedOutstandingBefore,
      after: historicalManual.decidedOutstandingAfter,
    }, { before: 5_000, after: 0 });
  });
});

test("rechazar, reabrir, confirmar y revertir conserva auditoría y restaura el saldo", async () => {
  await withRepository(async () => {
    const sessionId = "c".repeat(32);
    await loadFixture(sessionId);
    const loaded = await getDebtDashboard(sessionId);
    const ambiguous = reconciliationEntry(loaded, "stmt_entry_ambiguous_5000");
    const candidate = ambiguous.candidates.find((item) => item.debtId === "debt_nico_10000");
    assert.ok(candidate);

    const rejected = await rejectReconciliationEntry(sessionId, { commandId: commands.rejectA, entryId: ambiguous.entryId });
    const rejectedReplay = await rejectReconciliationEntry(sessionId, { commandId: commands.rejectB, entryId: ambiguous.entryId });
    assert.equal(rejected.result.action, "creator_rejected");
    assert.equal(rejectedReplay.result.id, rejected.result.id);
    assert.equal(nicoDebt(await getDebtDashboard(sessionId)).outstandingAmount, 5_000, "rechazar no toca el ledger");
    assert.equal(reconciliationEntry(await getDebtDashboard(sessionId), ambiguous.entryId).state, "rejected");

    await new Promise((resolve) => setTimeout(resolve, 2));
    const reopened = await reopenReconciliationEntry(sessionId, { commandId: commands.reopen, entryId: ambiguous.entryId });
    const reopenedReplay = await reopenReconciliationEntry(sessionId, { commandId: commands.reopen, entryId: ambiguous.entryId });
    assert.equal(reopened.result.action, "reopened");
    assert.equal(reopenedReplay.result.id, reopened.result.id);
    assert.equal(reconciliationEntry(await getDebtDashboard(sessionId), ambiguous.entryId).state, "needs_review");

    await new Promise((resolve) => setTimeout(resolve, 2));
    const confirmed = await confirmReconciliationCandidate(sessionId, {
      commandId: commands.confirmA,
      candidateId: candidate.id,
      expectedOutstandingAmount: 5_000,
    });
    const afterConfirmation = await getDebtDashboard(sessionId);
    assert.equal(nicoDebt(afterConfirmation).outstandingAmount, 0);
    assert.equal(afterConfirmation.groupNetting.find((item) => item.groupId === "group_pucon")?.participantBalances.find((item) => item.participantId === "person_nico")?.netAmount, 0);

    await new Promise((resolve) => setTimeout(resolve, 2));
    const reversed = await reverseReconciliationDecision(sessionId, { commandId: commands.reverse, decisionId: confirmed.result.id });
    const reversedReplay = await reverseReconciliationDecision(sessionId, { commandId: commands.reverse, decisionId: confirmed.result.id });
    const after = await getDebtDashboard(sessionId);
    const rawAfter = await loadDebtCenterStateForSession(sessionId);

    assert.equal(reversed.result.action, "reversed");
    assert.equal(reversedReplay.result.id, reversed.result.id);
    assert.equal(nicoDebt(after).outstandingAmount, 5_000);
    assert.equal(nicoDebt(after).status, "partially_paid");
    assert.equal(after.groupNetting.find((item) => item.groupId === "group_pucon")?.participantBalances.find((item) => item.participantId === "person_nico")?.netAmount, -5_000, "revertir debe volver a incluir el remanente en el neteo derivado");
    assert.equal(reconciliationEntry(after, ambiguous.entryId).state, "reversed");
    const settlement = rawAfter.state.settlements.find((item) => item.source === "mock_statement_reconciliation" && item.reconciliationDecisionId === confirmed.result.id);
    assert.ok(settlement?.reversedAt);
    assert.equal(settlement.reversedByDecisionId, reversed.result.id);
    assert.deepEqual(rawAfter.state.reconciliationDecisions.map((item) => item.action).filter((action) => ["creator_rejected", "reopened", "creator_confirmed", "reversed"].includes(action)), ["creator_rejected", "reopened", "creator_confirmed", "reversed"]);
  });
});

test("DTO público refleja el abono conciliado sin exponer referencias, cartola ni decisiones internas", async () => {
  await withRepository(async () => {
    const sessionId = "d".repeat(32);
    await loadFixture(sessionId);
    const stored = await loadDebtCenterStateForSession(sessionId);
    const debt = stored.state.debts.find((item) => item.id === "debt_nico_10000");
    assert.ok(debt);

    await mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
      state.debts.find((item) => item.id === debt.id).reconciliationRef = "SENTINEL_RECONCILIATION_REF";
      state.mockStatements[0].accountAlias = "SENTINEL_ACCOUNT_ALIAS";
      state.mockStatementEntries[0].descriptor = "SENTINEL_DESCRIPTOR";
      state.mockStatementEntries[0].reconciliationRef = "SENTINEL_ENTRY_REFERENCE";
      state.reconciliationCandidates[0].ruleVersion = "reconciliation-rule-v1";
      state.reconciliationCandidates[0].createdAt = "2026-08-27T00:00:00.000Z";
      state.reconciliationDecisions[0].commandId = `recon_auto_${"e".repeat(32)}`;
    });

    const dto = await getPublicDebtByToken(debt.publicToken);
    assert.ok(dto);
    assert.deepEqual(Object.keys(dto).sort(), [
      "activeAttempt",
      "creditorName",
      "debtId",
      "debtorName",
      "expenseTitle",
      "groupName",
      "lastCompletedAttempt",
      "originalAmount",
      "outstandingAmount",
      "paidAmount",
      "publicToken",
      "status",
    ]);
    assert.equal(dto.paidAmount, 5_000);
    assert.equal(dto.outstandingAmount, 5_000);
    assert.equal(dto.lastCompletedAttempt, undefined, "una conciliación no debe fingir un intento de pago del pagador");
    const serialized = JSON.stringify(dto);
    assert.doesNotMatch(serialized, /SENTINEL_/);
    assert.doesNotMatch(serialized, /reconciliation|statement|descriptor|accountAlias|candidate|decision|settlement|confirmedBy/i);
  });
});

test("los cuatro agregados de conciliación están acotados y la implementación no llama fetch ni Floid", async () => {
  const limits = [
    ["mockStatements", MAX_MOCK_STATEMENTS],
    ["mockStatementEntries", MAX_MOCK_STATEMENT_ENTRIES],
    ["reconciliationCandidates", MAX_RECONCILIATION_CANDIDATES],
    ["reconciliationDecisions", MAX_RECONCILIATION_DECISIONS],
  ];
  for (const [key, maximum] of limits) {
    const state = createDebtCenterSeed();
    state[key] = Array.from({ length: maximum + 1 }, (_, index) => ({ id: `${key}_${index}` }));
    assert.throws(() => assertDebtCenterStateWithinLimits(state), /RECONCILIATION_LIMIT_REACHED/, key);
  }

  const service = await source("lib/debt-center/service.ts");
  const reconciliationBlock = service.slice(
    service.indexOf("export async function loadMockStatement"),
    service.indexOf("export async function getPublicDebtByToken"),
  );
  assert.doesNotMatch(reconciliationBlock, /\bfetch\s*\(|getPaymentProvider\s*\(|floid/i);
  assert.match(reconciliationBlock, /mockStatementFixture\(loadedAt\)/);
});

test("card, sheet y API hacen explícita la conciliación local y nunca preseleccionan una coincidencia ambigua", async () => {
  const [page, route, css] = await Promise.all([
    source("app/cuentas-claras/page.tsx"),
    source("app/api/debt-center/route.ts"),
    source("app/cuentas-claras/cuentas-claras-overrides.module.css"),
  ]);
  const openBlock = page.slice(page.indexOf("const openReconciliation = async"), page.indexOf("if (loading) return"));
  const sheetBlock = page.slice(page.indexOf("function ReconciliationSheet"), page.indexOf("function DebtRow"));

  assert.match(page, /className=\{overrides\.reconciliationCard\} onClick=\{onReconciliation\}/);
  assert.match(page, /CARTOLA DEMO · SIN BANCO CONECTADO/);
  assert.match(page, /Usaremos movimientos ficticios y reglas locales\. No pediremos claves ni conectaremos un banco\./);
  assert.match(openBlock, /action: "load_mock_statement"/);
  assert.match(openBlock, /fixtureVersion: "mock_statement_v1"/);
  assert.doesNotMatch(openBlock, /useEffect|setTimeout|setInterval|getPaymentProvider|FLOID_API/);

  assert.match(sheetBlock, /CARTOLA DEMO · EVIDENCIA FICTICIA/);
  assert.match(sheetBlock, /No se conectó un banco, no usamos Floid y ningún movimiento acredita una transferencia real\./);
  assert.match(sheetBlock, /CONCILIADO AUTOMÁTICAMENTE · SIMULACIÓN/);
  assert.match(sheetBlock, /La regla local encontró una referencia exacta y única\./);
  assert.match(sheetBlock, /useState<Record<string, string>>\(\{\}\)/, "la selección humana debe comenzar vacía");
  assert.match(sheetBlock, /YOL1 no elegirá por ti\./);
  assert.match(sheetBlock, /checked=\{selectedId === candidate\.id\}/);
  assert.match(sheetBlock, /disabled=\{!selected \|\| Boolean\(busyEntryId\)\}/);
  assert.match(sheetBlock, /Elige una cuenta para continuar/);
  assert.doesNotMatch(sheetBlock, /selectedByEntry[^\n]*entry\.candidates\[0\]/);

  for (const className of ["reconciliationCard", "reconciliationSheet", "reconciliationEntry", "candidateList", "reconciliationActions", "reversalButton"]) {
    assert.match(page, new RegExp(`overrides\\.${className}`), `${className} debe montarse en UI`);
    assert.match(css, new RegExp(`\\.${className}(?:\\s|\\{|>|,)`), `${className} debe tener estilo explícito`);
  }

  assert.match(route, /assertSameOriginMutation\(request\)/);
  for (const action of [
    "load_mock_statement",
    "confirm_reconciliation_candidate",
    "reject_reconciliation_entry",
    "reopen_reconciliation_entry",
    "reverse_reconciliation_decision",
  ]) {
    assert.match(route, new RegExp(`body\\.action === "${action}"`), `${action} debe tener una rama explícita`);
  }
});
