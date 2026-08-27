import assert from "node:assert/strict";
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

const { buildDashboard } = await import("../lib/debt-center/domain.ts");
const { createDebtCenterSeed } = await import("../lib/debt-center/seed.ts");
const { MemoryDebtCenterRepository } = await import("../lib/debt-center/state-repository.ts");
const { POST } = await import("../app/api/debt-center/route.ts");

test("dashboard privado conserva datos de UI y omite comandos, fingerprints y referencias internas", () => {
  const state = createDebtCenterSeed();
  state.groups[0].commandId = "SENTINEL_GROUP_COMMAND";
  state.expenses[0].commandId = "SENTINEL_EXPENSE_COMMAND";
  state.expenses[0].commandFingerprint = "SENTINEL_EXPENSE_FINGERPRINT";
  state.expenses[0].correctionOfExpenseId = "SENTINEL_CORRECTION_SOURCE";
  state.expenses[0].correction = {
    commandId: "SENTINEL_CORRECTION_COMMAND",
    reason: "wrong_amount",
    cancelledAt: "2026-08-27T00:00:00.000Z",
    cancelledByParticipantId: state.currentParticipantId,
    replacementExpenseId: "expense_replacement_safe",
  };
  state.debts[0].reconciliationRef = "SENTINEL_RECONCILIATION_REFERENCE";
  state.recurringTemplates.push({
    id: "rec_template_private_dto",
    commandId: "SENTINEL_TEMPLATE_COMMAND",
    commandFingerprint: "SENTINEL_TEMPLATE_FINGERPRINT",
    sourceExpenseId: state.expenses[0].id,
    groupId: state.expenses[0].groupId,
    title: state.expenses[0].title,
    totalAmount: state.expenses[0].totalAmount,
    paidByParticipantId: state.expenses[0].paidByParticipantId,
    splitSpec: { version: "split-v2", mode: "amount", participantOrder: state.expenses[0].shares.map((share) => share.participantId), values: state.expenses[0].shares.map((share) => ({ participantId: share.participantId, value: share.amount })) },
    shares: structuredClone(state.expenses[0].shares),
    cadence: { frequency: "monthly", dayOfMonth: 15 },
    nextOccurrenceOn: "2026-09-15",
    status: "active",
    createdAt: "2026-08-27T00:00:00.000Z",
    updatedAt: "2026-08-27T00:00:00.000Z",
    lastStatusCommand: { commandId: "SENTINEL_STATUS_COMMAND", commandFingerprint: "SENTINEL_STATUS_FINGERPRINT" },
  });
  state.recurringOccurrences.push({
    id: "rec_occ_private_dto",
    templateId: "rec_template_private_dto",
    occurrenceKey: "2026-09-15",
    scheduledFor: "2026-09-15",
    expenseId: state.expenses[0].id,
    commandId: "SENTINEL_OCCURRENCE_COMMAND",
    commandFingerprint: "SENTINEL_OCCURRENCE_FINGERPRINT",
    status: "materialized",
    createdAt: "2026-08-27T00:00:00.000Z",
  });

  const dashboard = buildDashboard(state, "memory", "mock_floid");
  assert.equal(dashboard.groups[0].name, state.groups[0].name);
  assert.equal(dashboard.expenses[0].title, state.expenses[0].title);
  assert.deepEqual(dashboard.expenses[0].correction, {
    cancelledByParticipantId: state.currentParticipantId,
    replacementExpenseId: "expense_replacement_safe",
  });
  assert.equal(dashboard.recurringTemplates[0].nextOccurrenceOn, "2026-09-15");
  assert.equal(dashboard.recurringOccurrences[0].expenseId, state.expenses[0].id);

  const serialized = JSON.stringify(dashboard);
  assert.doesNotMatch(serialized, /SENTINEL_/);
  assert.doesNotMatch(serialized, /commandFingerprint|commandId|lastStatusCommand|correctionOfExpenseId|reconciliationRef/);
});

test("create_expense responde sólo con el id necesario y un dashboard proyectado", async () => {
  const previousRepository = globalThis.__yol1DebtCenterRepository;
  const previousEnabled = process.env.DEBT_CENTER_SIMULATOR_ENABLED;
  globalThis.__yol1DebtCenterRepository = new MemoryDebtCenterRepository();
  process.env.DEBT_CENTER_SIMULATOR_ENABLED = "true";
  try {
    const request = new Request("https://lab.yol1.test/api/debt-center", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: `yol1_cc_demo_session=${"d".repeat(32)}`,
        origin: "https://lab.yol1.test",
        "sec-fetch-site": "same-origin",
      },
      body: JSON.stringify({
        action: "create_expense",
        commandId: `draft_${"a".repeat(32)}`,
        groupId: "group_pucon",
        title: "Gasto DTO seguro",
        totalAmount: 10_000,
        paidByParticipantId: "person_felipe",
        participantIds: ["person_felipe", "person_nico"],
        splitMode: "equal",
      }),
    });
    const response = await POST(request);
    const payload = await response.json();
    assert.equal(response.status, 201);
    assert.deepEqual(Object.keys(payload.result), ["expense"]);
    assert.deepEqual(Object.keys(payload.result.expense), ["id"]);
    assert.match(payload.result.expense.id, /^expense_/);
    const serialized = JSON.stringify(payload);
    assert.doesNotMatch(serialized, /commandFingerprint|commandId|lastStatusCommand|correctionOfExpenseId|reconciliationRef/);
  } finally {
    globalThis.__yol1DebtCenterRepository = previousRepository;
    if (previousEnabled === undefined) delete process.env.DEBT_CENTER_SIMULATOR_ENABLED;
    else process.env.DEBT_CENTER_SIMULATOR_ENABLED = previousEnabled;
  }
});
