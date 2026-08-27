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
  cancelExpenseForCorrection,
  confirmCollectionShared,
  createPayin,
  createRecurringTemplate,
  createSharedExpense,
  getPublicDebtByToken,
} = await import("../lib/debt-center/service.ts");
const {
  loadDebtCenterStateForSession,
  MemoryDebtCenterRepository,
  mutateDebtCenterState,
} = await import("../lib/debt-center/state-repository.ts");
const { debtCenterWorkspaceId } = await import("../lib/debt-center/session.ts");
const { loadExpenseDraft, saveExpenseDraft } = await import("../lib/debt-center/draft-storage.ts");
const { createDebtCenterSeed } = await import("../lib/debt-center/seed.ts");

const command = {
  expense: `draft_${"a".repeat(32)}`,
  replacement: `draft_${"f".repeat(32)}`,
  correction: `correction_cmd_${"b".repeat(32)}`,
  correctionOther: `correction_cmd_${"c".repeat(32)}`,
  collection: `collection_share_cmd_${"d".repeat(32)}`,
  recurring: `rec_template_cmd_${"e".repeat(32)}`,
};

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

async function createCleanExpense(sessionId, overrides = {}) {
  return createSharedExpense(sessionId, {
    commandId: command.expense,
    groupId: "group_pucon",
    title: "Cena para corregir",
    totalAmount: 10_000,
    paidByParticipantId: "person_felipe",
    participantIds: ["person_felipe", "person_nico"],
    splitMode: "equal",
    ...overrides,
  });
}

async function cancel(sessionId, expenseId, overrides = {}) {
  return cancelExpenseForCorrection(sessionId, {
    commandId: command.correction,
    expenseId,
    reason: "wrong_amount",
    ...overrides,
  });
}

function installSessionStorage() {
  const values = new Map();
  globalThis.sessionStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
    key: (index) => [...values.keys()][index] ?? null,
    get length() { return values.size; },
  };
}

test("owner anula sin borrar, cierra deudas y links, audita e idempotencia no duplica efectos", async () => {
  await withRepository(async () => {
    const sessionId = "1".repeat(32);
    const created = await createCleanExpense(sessionId);
    const expense = created.result.expense;
    const debt = created.result.debts[0];
    assert.ok(debt);
    await confirmCollectionShared(sessionId, {
      commandId: command.collection,
      debtId: debt.id,
      messageKind: "initial",
    });
    const before = await loadDebtCenterStateForSession(sessionId);
    const originalExpense = structuredClone(before.state.expenses.find((item) => item.id === expense.id));
    const originalToken = debt.publicToken;

    const first = await cancel(sessionId, expense.id);
    const replay = await cancel(sessionId, expense.id);
    const after = await loadDebtCenterStateForSession(sessionId);
    const storedExpense = after.state.expenses.find((item) => item.id === expense.id);
    const storedDebts = after.state.debts.filter((item) => item.expenseId === expense.id);

    assert.equal(replay.result.expense.id, first.result.expense.id);
    assert.equal(after.state.expenses.length, before.state.expenses.length, "la corrección no crea ni borra gastos");
    assert.equal(after.state.debts.length, before.state.debts.length, "la corrección no reemplaza deudas en servidor");
    assert.deepEqual({
      id: storedExpense.id,
      title: storedExpense.title,
      totalAmount: storedExpense.totalAmount,
      paidByParticipantId: storedExpense.paidByParticipantId,
      shares: storedExpense.shares,
      createdAt: storedExpense.createdAt,
    }, {
      id: originalExpense.id,
      title: originalExpense.title,
      totalAmount: originalExpense.totalAmount,
      paidByParticipantId: originalExpense.paidByParticipantId,
      shares: originalExpense.shares,
      createdAt: originalExpense.createdAt,
    }, "el gasto original debe quedar como evidencia inmutable");
    assert.equal(storedExpense.lifecycle, "cancelled_for_correction");
    assert.equal(storedExpense.correction.commandId, command.correction);
    assert.equal(storedExpense.correction.reason, "wrong_amount");
    assert.equal(storedExpense.correction.cancelledByParticipantId, "person_felipe");
    assert.ok(storedExpense.correction.cancelledAt);
    assert.ok(storedDebts.every((item) => item.status === "cancelled"));
    assert.ok(storedDebts.every((item) => item.publicToken === originalToken));
    assert.equal(after.state.collectionConfirmations.filter((item) => item.debtId === debt.id).length, 1, "la declaración previa de compartir no se borra");
    const audit = after.state.activities.filter((item) => item.type === "expense_cancelled_for_correction" && item.expenseId === expense.id);
    assert.equal(audit.length, 1);
    assert.match(audit[0].detail, /Conservamos el gasto original y cerramos sus links demo/);

    await assert.rejects(
      () => cancel(sessionId, expense.id, { commandId: command.correctionOther }),
      /EXPENSE_ALREADY_CANCELLED_FOR_CORRECTION/,
    );
    await assert.rejects(
      () => cancel(sessionId, expense.id, { reason: "wrong_people" }),
      /EXPENSE_ALREADY_CANCELLED_FOR_CORRECTION/,
    );
  });
});

test("link público cancelado conserva contexto mínimo pero nunca acepta otro pago y no usa red", async () => {
  await withRepository(async () => {
    const sessionId = "2".repeat(32);
    const created = await createCleanExpense(sessionId);
    const expense = created.result.expense;
    const debt = created.result.debts[0];
    await cancel(sessionId, expense.id);

    const dto = await getPublicDebtByToken(debt.publicToken);
    assert.ok(dto);
    assert.equal(dto.status, "cancelled");
    assert.equal("correction" in dto, false);
    assert.equal("lifecycle" in dto, false);
    assert.equal("createdByParticipantId" in dto, false);

    const previousFetch = globalThis.fetch;
    let networkCalls = 0;
    globalThis.fetch = async () => {
      networkCalls += 1;
      throw new Error("NETWORK_FORBIDDEN_IN_EXPENSE_CORRECTION");
    };
    try {
      await assert.rejects(
        () => createPayin({ publicToken: debt.publicToken, amount: debt.originalAmount, idempotencyKey: "correction-pay-blocked", origin: "https://lab.yol1.test" }),
        /DEBT_NOT_PAYABLE/,
      );
      assert.equal(networkCalls, 0);
    } finally {
      globalThis.fetch = previousFetch;
    }
    const after = await loadDebtCenterStateForSession(sessionId);
    assert.equal(after.state.paymentAttempts.filter((item) => item.debtId === debt.id).length, 0);
  });
});

test("la copia local conserva lineage y sólo puede materializar una versión reemplazante", async () => {
  await withRepository(async () => {
    const sessionId = "8".repeat(32);
    const created = await createCleanExpense(sessionId);
    const original = created.result.expense;
    await cancel(sessionId, original.id);

    installSessionStorage();
    const draftId = `draft_${"9".repeat(32)}`;
    saveExpenseDraft(draftId, {
      title: original.title,
      amountText: String(original.totalAmount),
      groupId: original.groupId,
      paidBy: original.paidByParticipantId,
      participantIds: original.shares.map((share) => share.participantId),
      splitMode: original.splitMode,
      splitValues: {},
      receiptName: original.receipt?.name ?? "",
      correctionOfExpenseId: original.id,
    });
    const draft = loadExpenseDraft(draftId);
    assert.ok(draft);
    assert.equal(draft.correctionOfExpenseId, original.id);
    assert.equal(draft.title, original.title);
    assert.equal(draft.amountText, String(original.totalAmount));
    assert.deepEqual(draft.participantIds, original.shares.map((share) => share.participantId));

    const replacementInput = {
      commandId: command.replacement,
      groupId: original.groupId,
      title: "Cena corregida",
      totalAmount: 12_000,
      paidByParticipantId: original.paidByParticipantId,
      participantIds: original.shares.map((share) => share.participantId),
      splitMode: "equal",
      correctionOfExpenseId: original.id,
    };
    const replacement = await createSharedExpense(sessionId, replacementInput);
    const replay = await createSharedExpense(sessionId, replacementInput);
    const after = await loadDebtCenterStateForSession(sessionId);
    const storedOriginal = after.state.expenses.find((item) => item.id === original.id);

    assert.equal(replay.result.expense.id, replacement.result.expense.id);
    assert.notEqual(replacement.result.expense.id, original.id);
    assert.equal(replacement.result.expense.correctionOfExpenseId, original.id);
    assert.equal(storedOriginal.correction.replacementExpenseId, replacement.result.expense.id);
    assert.equal(after.state.expenses.filter((item) => item.correctionOfExpenseId === original.id).length, 1);
    assert.ok(after.state.debts.filter((item) => item.expenseId === original.id).every((item) => item.status === "cancelled"));
    assert.ok(after.state.debts.filter((item) => item.expenseId === replacement.result.expense.id).every((item) => item.status === "open"));
    await assert.rejects(
      () => createSharedExpense(sessionId, { ...replacementInput, commandId: `draft_${"0".repeat(32)}`, title: "Segunda copia" }),
      /EXPENSE_CORRECTION_ALREADY_REPLACED/,
    );
  });
});

test("owner, intento activo, abono activo y recurrencia activa bloquean sin efectos parciales", async () => {
  const cases = [
    {
      name: "owner",
      sessionId: "4".repeat(32),
      expected: /EXPENSE_CORRECTION_NOT_OWNED/,
      prepare(state, expense) {
        state.expenses.find((item) => item.id === expense.id).createdByParticipantId = "person_nico";
      },
    },
    {
      name: "active-payment",
      sessionId: "5".repeat(32),
      expected: /EXPENSE_CORRECTION_PAYMENT_IN_PROGRESS/,
      prepare(state, _expense, debt) {
        state.paymentAttempts.push({
          id: "attempt_correction_pending",
          debtId: debt.id,
          amount: debt.originalAmount,
          provider: "mock_floid",
          providerPaymentToken: "mock_pending",
          paymentUrl: `/pagar/${debt.publicToken}`,
          status: "pending",
          providerStep: "AUTH_METHOD",
          idempotencyKey: "correction-pending-attempt",
          createdAt: "2026-08-27T02:00:00.000Z",
          updatedAt: "2026-08-27T02:00:00.000Z",
        });
      },
    },
    {
      name: "active-settlement",
      sessionId: "6".repeat(32),
      expected: /EXPENSE_CORRECTION_HAS_PAYMENT/,
      prepare(state, _expense, debt) {
        state.settlements.push({
          id: "set_correction_paid",
          debtId: debt.id,
          source: "payment_attempt",
          paymentAttemptId: "attempt_correction_paid",
          amount: debt.originalAmount,
          providerPaymentId: "mock_payment_correction_paid",
          settledAt: "2026-08-27T02:00:00.000Z",
          recordedAt: "2026-08-27T02:00:00.000Z",
        });
      },
    },
  ];

  for (const scenario of cases) {
    await withRepository(async () => {
      const sessionId = scenario.sessionId;
      const created = await createCleanExpense(sessionId);
      const { expense, debts } = created.result;
      await mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => scenario.prepare(state, expense, debts[0]));
      const before = await loadDebtCenterStateForSession(sessionId);
      await assert.rejects(() => cancel(sessionId, expense.id), scenario.expected, scenario.name);
      const after = await loadDebtCenterStateForSession(sessionId);
      assert.deepEqual(after.state, before.state, `${scenario.name} debe fallar sin mutación parcial`);
    });
  }

  await withRepository(async () => {
    const sessionId = "7".repeat(32);
    const created = await createCleanExpense(sessionId);
    const expense = created.result.expense;
    await createRecurringTemplate(sessionId, {
      commandId: command.recurring,
      sourceExpenseId: expense.id,
      nextOccurrenceOn: "2026-09-15",
    });
    const before = await loadDebtCenterStateForSession(sessionId);
    await assert.rejects(() => cancel(sessionId, expense.id), /EXPENSE_CORRECTION_RECURRING_ACTIVE/);
    const after = await loadDebtCenterStateForSession(sessionId);
    assert.deepEqual(after.state, before.state);
  });

  await withRepository(async () => {
    const sessionId = "8".repeat(32);
    const created = await createCleanExpense(sessionId);
    const expense = created.result.expense;
    await mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
      state.expenses.find((item) => item.id === expense.id).recurrence = {
        templateId: "rec_template_materialized",
        occurrenceKey: "2026-09-15",
        scheduledFor: "2026-09-15",
      };
    });
    const before = await loadDebtCenterStateForSession(sessionId);
    await assert.rejects(() => cancel(sessionId, expense.id), /EXPENSE_CORRECTION_RECURRING_ACTIVE/);
    assert.deepEqual((await loadDebtCenterStateForSession(sessionId)).state, before.state);
  });
});

test("el seed atribuye cada gasto a su creador y ownership legado falla cerrado", async () => {
  const seed = createDebtCenterSeed();
  assert.equal(seed.expenses.find((item) => item.id === "expense_cabana")?.createdByParticipantId, "person_felipe");
  assert.equal(seed.expenses.find((item) => item.id === "expense_depto")?.createdByParticipantId, "person_camila");

  await withRepository(async () => {
    const sessionId = "a".repeat(32);
    const created = await createCleanExpense(sessionId);
    const expense = created.result.expense;
    await mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
      delete state.expenses.find((item) => item.id === expense.id).createdByParticipantId;
    });
    const before = await loadDebtCenterStateForSession(sessionId);
    await assert.rejects(() => cancel(sessionId, expense.id), /EXPENSE_CORRECTION_NOT_OWNED/);
    const after = await loadDebtCenterStateForSession(sessionId);
    assert.deepEqual(after.state, before.state);
  });
});

test("el reemplazo revalida al actor que anuló y conserva lineage único", async () => {
  await withRepository(async () => {
    const sessionId = "b".repeat(32);
    const created = await createCleanExpense(sessionId);
    const original = created.result.expense;
    await cancel(sessionId, original.id);
    await mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
      state.expenses.find((item) => item.id === original.id).correction.cancelledByParticipantId = "person_nico";
    });
    const before = await loadDebtCenterStateForSession(sessionId);
    await assert.rejects(() => createSharedExpense(sessionId, {
      commandId: command.replacement,
      groupId: original.groupId,
      title: "Cena corregida por otro actor",
      totalAmount: 12_000,
      paidByParticipantId: original.paidByParticipantId,
      participantIds: original.shares.map((share) => share.participantId),
      splitMode: "equal",
      correctionOfExpenseId: original.id,
    }), /EXPENSE_CORRECTION_NOT_OWNED/);
    const after = await loadDebtCenterStateForSession(sessionId);
    assert.deepEqual(after.state, before.state);
    assert.equal(after.state.expenses.filter((item) => item.correctionOfExpenseId === original.id).length, 0);
  });
});

test("el reemplazo falla cerrado sin actor de anulación y no puede cambiar de grupo", async () => {
  await withRepository(async () => {
    const missingActorSession = "c".repeat(32);
    const missingActorCreated = await createCleanExpense(missingActorSession);
    const missingActorOriginal = missingActorCreated.result.expense;
    await cancel(missingActorSession, missingActorOriginal.id);
    await mutateDebtCenterState(debtCenterWorkspaceId(missingActorSession), (state) => {
      delete state.expenses.find((item) => item.id === missingActorOriginal.id).correction.cancelledByParticipantId;
    });
    const missingActorBefore = await loadDebtCenterStateForSession(missingActorSession);
    await assert.rejects(() => createSharedExpense(missingActorSession, {
      commandId: command.replacement,
      groupId: missingActorOriginal.groupId,
      title: "Cena sin actor verificable",
      totalAmount: 12_000,
      paidByParticipantId: missingActorOriginal.paidByParticipantId,
      participantIds: missingActorOriginal.shares.map((share) => share.participantId),
      splitMode: "equal",
      correctionOfExpenseId: missingActorOriginal.id,
    }), /EXPENSE_CORRECTION_NOT_OWNED/);
    assert.deepEqual((await loadDebtCenterStateForSession(missingActorSession)).state, missingActorBefore.state);

    const movedSession = "d".repeat(32);
    const movedCreated = await createCleanExpense(movedSession);
    const movedOriginal = movedCreated.result.expense;
    await cancel(movedSession, movedOriginal.id);
    const movedBefore = await loadDebtCenterStateForSession(movedSession);
    await assert.rejects(() => createSharedExpense(movedSession, {
      commandId: command.replacement,
      groupId: "group_depto",
      title: "Cena movida de grupo",
      totalAmount: 12_000,
      paidByParticipantId: "person_felipe",
      participantIds: ["person_felipe", "person_camila"],
      splitMode: "equal",
      correctionOfExpenseId: movedOriginal.id,
    }), /EXPENSE_CORRECTION_GROUP_CHANGED/);
    assert.deepEqual((await loadDebtCenterStateForSession(movedSession)).state, movedBefore.state);
  });
});

test("una conciliación ya revertida no bloquea la corrección ni vuelve a contar como pago", async () => {
  await withRepository(async () => {
    const sessionId = "3".repeat(32);
    const created = await createCleanExpense(sessionId);
    const { expense, debts } = created.result;
    await mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
      state.settlements.push({
        id: "set_correction_reversed",
        debtId: debts[0].id,
        source: "mock_statement_reconciliation",
        reconciliationDecisionId: "recon_decision_original",
        statementEntryId: "statement_entry_original",
        confirmedByParticipantId: "person_felipe",
        amount: debts[0].originalAmount,
        settledAt: "2026-08-27T02:00:00.000Z",
        recordedAt: "2026-08-27T02:00:00.000Z",
        reversedAt: "2026-08-27T02:05:00.000Z",
        reversedByDecisionId: "recon_decision_reversed",
      });
    });

    const result = await cancel(sessionId, expense.id);
    assert.equal(result.result.expense.lifecycle, "cancelled_for_correction");
    assert.ok(result.result.debts.every((item) => item.status === "cancelled"));
  });
});

test("UI copia el snapshot sólo después de anular y la API mantiene el comando same-origin", async () => {
  const [page, route, css, service, payer] = await Promise.all([
    readFile(new URL("../app/cuentas-claras/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/debt-center/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/cuentas-claras/cuentas-claras-overrides.module.css", import.meta.url), "utf8"),
    readFile(new URL("../lib/debt-center/service.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/pagar/[token]/page.tsx", import.meta.url), "utf8"),
  ]);
  const callback = page.slice(page.indexOf("onCancelled={(nextDashboard) =>"), page.indexOf("/>}", page.indexOf("onCancelled={(nextDashboard) =>")));
  const draftRecovery = page.slice(page.indexOf("const prepareCorrectionDraft"), page.indexOf("const copyDebtLink"));
  const sheet = page.slice(page.indexOf("function ExpenseCorrectionSheet"), page.indexOf("function WhatsAppPreview"));
  const composer = page.slice(page.indexOf("function ExpenseComposer"), page.indexOf("function GroupComposer"));
  const serviceBlock = service.slice(service.indexOf("export async function cancelExpenseForCorrection"), service.indexOf("function assertRecurringTemplateFresh"));

  assert.match(page, /Hay un error en este gasto/);
  assert.match(sheet, /CORRECCIÓN AUDITABLE/);
  assert.match(sheet, /Anular no borra el gasto ni los mensajes que ya compartiste\. Los links anteriores dejarán de aceptar pagos demo\./);
  assert.match(sheet, /La copia seguirá siendo un borrador/);
  assert.match(sheet, /Nada nuevo se guardará hasta que revises y confirmes todos los datos/);
  assert.match(sheet, /useState\(\(\) => `correction_cmd_\$\{crypto\.randomUUID\(\)\.replaceAll\("-", ""\)\}`\)/);
  assert.match(sheet, /action: "cancel_expense_for_correction", commandId, expenseId: expense\.id, reason/);
  for (const blocker of ["paidAmount > 0", "hasActivePayment", "recurringActive"]) assert.match(sheet, new RegExp(blocker));

  assert.match(callback, /prepareCorrectionDraft\(correctionExpense\)/);
  assert.match(draftRecovery, /createExpenseDraftId\(\)/);
  assert.match(draftRecovery, /saveExpenseDraft\(draftId, \{ title: expense\.title, amountText: String\(expense\.totalAmount\), groupId: expense\.groupId, paidBy: expense\.paidByParticipantId, participantIds: expense\.shares\.map/);
  assert.match(draftRecovery, /correctionOfExpenseId: expense\.id/);
  assert.match(draftRecovery, /setComposer\("expense"\)/);
  assert.ok(draftRecovery.indexOf("saveExpenseDraft") < draftRecovery.indexOf('setComposer("expense")'));
  assert.match(page, /Retomar corrección/);
  assert.match(page, /!expense\.correction\?\.replacementExpenseId/);
  assert.match(page, /disabled=\{Boolean\(initialDraft\?\.correctionOfExpenseId\)\}/);
  assert.match(page, /La copia queda en el grupo original para conservar la historia/);
  assert.match(composer, /initialDraft\?\.correctionOfExpenseId/);
  assert.match(composer, /COPIA PARA CORREGIR/);
  assert.match(composer, /Preparamos una copia del gasto anulado\./);
  assert.match(composer, /Todavía no existe una versión nueva\. Revisa monto, personas, pagador y reparto antes de crearla\./);
  assert.match(composer, /initialDraft\?\.correctionOfExpenseId \?[\s\S]*: initialDraft \?[\s\S]*Borrador recuperado\./);

  assert.match(route, /assertSameOriginMutation\(request\)/);
  assert.match(route, /body\.action === "cancel_expense_for_correction"/);
  assert.match(route, /cancelExpenseForCorrection\(session\.id/);
  assert.match(route, /correctionOfExpenseId: typeof body\.correctionOfExpenseId === "string" \? body\.correctionOfExpenseId : undefined/);
  assert.doesNotMatch(serviceBlock, /fetch\s*\(|getPaymentProvider|Floid|process\.env/i);
  for (const className of ["correctionLink", "resumeCorrectionButton", "correctionSheet", "correctionSummary", "correctionLead", "correctionReasons"]) {
    assert.match(page, new RegExp(`overrides\\.${className}`));
    assert.match(css, new RegExp(`\\.${className}(?:\\s|\\{|>|,)`));
  }

  assert.match(payer, /type Screen = [^\n]*\| "cancelled" \| "error"/);
  assert.match(payer, /payload\.debt\.status === "cancelled"\) \{ setScreen\("cancelled"\); \}/);
  const cancelledStart = payer.indexOf('{screen === "cancelled"');
  const cancelledEnd = payer.indexOf('{screen === "error"', cancelledStart);
  assert.ok(cancelledStart >= 0 && cancelledEnd > cancelledStart);
  const cancelledBlock = payer.slice(cancelledStart, cancelledEnd);
  assert.match(cancelledBlock, /COBRO ANULADO/);
  assert.match(cancelledBlock, /Este link ya no acepta pagos demo/);
  assert.match(cancelledBlock, /No se cobró nada/);
  assert.match(cancelledBlock, /pídele el link nuevo/);
  assert.doesNotMatch(cancelledBlock, /createAttempt|Continuar con pago simulado|Aprobar pago simulado|Intentar nuevamente/);
});
