import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import test from "node:test";

import { debtCenterErrorResponse } from "../lib/debt-center/http.ts";
import {
  migrateDebtCenterState,
  nextMonthlyOccurrence,
  parseMonthlyOccurrenceDate,
} from "../lib/debt-center/recurrence.ts";
import { createDebtCenterSeed } from "../lib/debt-center/seed.ts";
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
  createRecurringTemplate,
  createSharedExpense,
  materializeRecurringOccurrence,
  pauseRecurringTemplate,
  skipRecurringOccurrence,
} = await import("../lib/debt-center/service.ts");
const {
  loadDebtCenterStateForSession,
  MemoryDebtCenterRepository,
  mutateDebtCenterState,
} = await import("../lib/debt-center/state-repository.ts");
const { debtCenterWorkspaceId } = await import("../lib/debt-center/session.ts");
const { getLivingSpec, PORTFOLIO_PRODUCTS } = await import("../lib/product-portfolio.ts");

const commands = {
  templateA: `rec_template_cmd_${"a".repeat(32)}`,
  templateB: `rec_template_cmd_${"b".repeat(32)}`,
  materializeA: `rec_occ_cmd_${"c".repeat(32)}`,
  materializeB: `rec_occ_cmd_${"d".repeat(32)}`,
  pause: `rec_pause_cmd_${"e".repeat(32)}`,
  skipA: `rec_skip_cmd_${"f".repeat(32)}`,
  skipB: `rec_skip_cmd_${"1".repeat(32)}`,
};

async function source(relativePath) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

function legacySettlements(settlements) {
  return settlements.map((settlement) => {
    const legacy = { ...settlement };
    delete legacy.source;
    delete legacy.recordedAt;
    return legacy;
  });
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

async function createTemplate(sessionId, overrides = {}) {
  return createRecurringTemplate(sessionId, {
    commandId: commands.templateA,
    sourceExpenseId: "expense_cabana",
    nextOccurrenceOn: "2026-09-15",
    ...overrides,
  });
}

test("state v1, v2 y v3 migran una vez a v4 sin mutar ni perder el ledger", () => {
  const current = createDebtCenterSeed();
  const legacy = structuredClone(current);
  legacy.version = 1;
  delete legacy.generationId;
  delete legacy.recurringTemplates;
  delete legacy.recurringOccurrences;
  delete legacy.collectionConfirmations;
  delete legacy.mockStatements;
  delete legacy.mockStatementEntries;
  delete legacy.reconciliationCandidates;
  delete legacy.reconciliationDecisions;
  legacy.settlements = legacySettlements(legacy.settlements);
  const before = structuredClone(legacy);

  const migrated = migrateDebtCenterState(legacy);

  assert.deepEqual(legacy, before, "la migración no debe mutar el payload persistido");
  assert.equal(migrated.version, 4);
  assert.equal(migrated.generationId, "legacy");
  assert.deepEqual(migrated.recurringTemplates, []);
  assert.deepEqual(migrated.recurringOccurrences, []);
  assert.deepEqual(migrated.collectionConfirmations, []);
  assert.deepEqual(migrated.mockStatements, []);
  assert.deepEqual(migrated.mockStatementEntries, []);
  assert.deepEqual(migrated.reconciliationCandidates, []);
  assert.deepEqual(migrated.reconciliationDecisions, []);
  for (const key of ["participants", "groups", "expenses", "debts", "paymentAttempts", "activities"]) {
    assert.deepEqual(migrated[key], legacy[key], `la migración debe conservar ${key}`);
  }
  for (const settlement of migrated.settlements) {
    assert.equal(settlement.source, "payment_attempt");
    assert.equal(settlement.recordedAt, settlement.settledAt);
  }
  assert.notEqual(migrated.expenses, legacy.expenses, "el resultado debe ser un clon aislado");
  assert.deepEqual(migrateDebtCenterState(migrated), migrated, "migrar v4 debe ser idempotente");

  const versionTwo = structuredClone(current);
  versionTwo.version = 2;
  delete versionTwo.generationId;
  delete versionTwo.collectionConfirmations;
  delete versionTwo.mockStatements;
  delete versionTwo.mockStatementEntries;
  delete versionTwo.reconciliationCandidates;
  delete versionTwo.reconciliationDecisions;
  versionTwo.settlements = legacySettlements(versionTwo.settlements);
  const versionTwoBefore = structuredClone(versionTwo);
  const migratedFromV2 = migrateDebtCenterState(versionTwo);
  assert.deepEqual(versionTwo, versionTwoBefore, "migrar v2 tampoco debe mutar el payload persistido");
  assert.equal(migratedFromV2.version, 4);
  assert.equal(migratedFromV2.generationId, "legacy");
  assert.deepEqual(migratedFromV2.recurringTemplates, current.recurringTemplates);
  assert.deepEqual(migratedFromV2.recurringOccurrences, current.recurringOccurrences);
  assert.deepEqual(migratedFromV2.collectionConfirmations, []);

  const versionThree = structuredClone(current);
  versionThree.version = 3;
  delete versionThree.generationId;
  delete versionThree.mockStatements;
  delete versionThree.mockStatementEntries;
  delete versionThree.reconciliationCandidates;
  delete versionThree.reconciliationDecisions;
  versionThree.settlements = legacySettlements(versionThree.settlements);
  const versionThreeBefore = structuredClone(versionThree);
  const migratedFromV3 = migrateDebtCenterState(versionThree);
  assert.deepEqual(versionThree, versionThreeBefore, "migrar v3 tampoco debe mutar el payload persistido");
  assert.equal(migratedFromV3.version, 4);
  assert.equal(migratedFromV3.generationId, "legacy");
  assert.deepEqual(migratedFromV3.mockStatements, []);
  assert.deepEqual(migratedFromV3.mockStatementEntries, []);
  assert.deepEqual(migratedFromV3.reconciliationCandidates, []);
  assert.deepEqual(migratedFromV3.reconciliationDecisions, []);

  assert.throws(() => migrateDebtCenterState({ ...legacy, version: 5 }), /UNSUPPORTED_DEBT_CENTER_STATE_VERSION/);
  assert.throws(() => migrateDebtCenterState({ ...legacy, version: 4 }), /INVALID_DEBT_CENTER_STATE/);
});

test("fecha mensual es estricta, determinista y cruza diciembre", () => {
  assert.deepEqual(parseMonthlyOccurrenceDate("2026-09-08"), { year: 2026, month: 9, day: 8, value: "2026-09-08" });
  assert.equal(nextMonthlyOccurrence("2026-09-08"), "2026-10-08");
  assert.equal(nextMonthlyOccurrence("2026-12-28"), "2027-01-28");
  for (const invalid of ["2026-9-08", "2026-02-00", "2026-02-29", "2019-01-01", "2101-01-01", "texto"]) {
    assert.throws(() => parseMonthlyOccurrenceDate(invalid), /INVALID_RECURRENCE_DATE/, invalid);
  }
});

test("plantilla toma un snapshot auditable sin boleta y no crea gasto ni deuda", async () => {
  await withRepository(async () => {
    const sessionId = "1".repeat(32);
    const before = await loadDebtCenterStateForSession(sessionId);
    const sourceExpense = before.state.expenses.find((expense) => expense.id === "expense_cabana");
    assert.ok(sourceExpense?.receipt, "el fixture debe probar que una boleta fuente no se propaga");

    const created = await createTemplate(sessionId);
    const template = created.result;
    const after = await loadDebtCenterStateForSession(sessionId);

    assert.deepEqual({
      sourceExpenseId: template.sourceExpenseId,
      groupId: template.groupId,
      title: template.title,
      totalAmount: template.totalAmount,
      paidByParticipantId: template.paidByParticipantId,
      splitSpec: template.splitSpec,
      shares: template.shares,
    }, {
      sourceExpenseId: sourceExpense.id,
      groupId: sourceExpense.groupId,
      title: sourceExpense.title,
      totalAmount: sourceExpense.totalAmount,
      paidByParticipantId: sourceExpense.paidByParticipantId,
      splitSpec: sourceExpense.splitSpec ?? {
        version: "split-v2",
        mode: "amount",
        participantOrder: sourceExpense.shares.map((share) => share.participantId),
        values: sourceExpense.shares.map((share) => ({ participantId: share.participantId, value: share.amount })),
      },
      shares: sourceExpense.shares,
    });
    assert.equal("receipt" in template, false);
    assert.doesNotMatch(JSON.stringify(template), /boleta|receipt|confidence|extraction/i);
    assert.equal(after.state.expenses.length, before.state.expenses.length);
    assert.equal(after.state.debts.length, before.state.debts.length);
    assert.equal(after.state.recurringTemplates.length, 1);
    assert.equal(template.status, "active");
    assert.deepEqual(template.cadence, { frequency: "monthly", dayOfMonth: 15 });
  });
});

test("crear plantilla es idempotente y reutilizar el comando con otro snapshot falla", async () => {
  await withRepository(async () => {
    const sessionId = "2".repeat(32);
    const first = await createTemplate(sessionId);
    const replay = await createTemplate(sessionId);
    assert.equal(replay.result.id, first.result.id);
    assert.equal((await loadDebtCenterStateForSession(sessionId)).state.recurringTemplates.length, 1);

    await assert.rejects(
      () => createTemplate(sessionId, { nextOccurrenceOn: "2026-09-16" }),
      /IDEMPOTENCY_CONFLICT/,
    );
    const after = await loadDebtCenterStateForSession(sessionId);
    assert.equal(after.state.recurringTemplates.length, 1);
    assert.equal(after.state.recurringTemplates[0].nextOccurrenceOn, "2026-09-15");
  });
});

test("natural key materializa una sola vez aunque cambie el commandId", async () => {
  await withRepository(async () => {
    const sessionId = "3".repeat(32);
    const before = await loadDebtCenterStateForSession(sessionId);
    const template = (await createTemplate(sessionId)).result;
    const input = { commandId: commands.materializeA, templateId: template.id, expectedOccurrenceKey: "2026-09-15" };

    const first = await materializeRecurringOccurrence(sessionId, input);
    const sameCommandReplay = await materializeRecurringOccurrence(sessionId, input);
    const otherCommandReplay = await materializeRecurringOccurrence(sessionId, { ...input, commandId: commands.materializeB });
    const after = await loadDebtCenterStateForSession(sessionId);

    assert.equal(sameCommandReplay.result.occurrence.id, first.result.occurrence.id);
    assert.equal(otherCommandReplay.result.occurrence.id, first.result.occurrence.id);
    assert.equal(otherCommandReplay.result.expense.id, first.result.expense.id);
    assert.equal(after.state.recurringOccurrences.length, 1);
    assert.equal(after.state.expenses.length, before.state.expenses.length + 1);
    assert.equal(after.state.debts.length, before.state.debts.length + first.result.debts.length);
    assert.equal(first.result.debts.length, 2);
    assert.deepEqual(first.result.expense.recurrence, {
      templateId: template.id,
      occurrenceKey: "2026-09-15",
      scheduledFor: "2026-09-15",
    });
    assert.equal(first.result.expense.receipt, undefined);
    assert.equal(first.result.template.nextOccurrenceOn, "2026-10-15");
  });
});

test("guardar la recurrencia crea cero obligaciones hasta la confirmación explícita", async () => {
  await withRepository(async () => {
    const sessionId = "4".repeat(32);
    const ownExpense = await createSharedExpense(sessionId, {
      commandId: `draft_${"2".repeat(32)}`,
      groupId: "group_pucon",
      title: "Gasto cubierto por mí",
      totalAmount: 12_000,
      paidByParticipantId: "person_felipe",
      participantIds: ["person_felipe", "person_nico"],
      splitMode: "amount",
      splitValues: { person_felipe: 12_000, person_nico: 0 },
    });
    assert.deepEqual(ownExpense.result.debts, []);
    const beforeTemplate = await loadDebtCenterStateForSession(sessionId);
    const template = (await createTemplate(sessionId, {
      commandId: commands.templateB,
      sourceExpenseId: ownExpense.result.expense.id,
      nextOccurrenceOn: "2026-09-10",
    })).result;
    const waitingForConfirmation = await loadDebtCenterStateForSession(sessionId);

    assert.equal(waitingForConfirmation.state.expenses.length, beforeTemplate.state.expenses.length);
    assert.equal(waitingForConfirmation.state.debts.length, beforeTemplate.state.debts.length);
    assert.equal(waitingForConfirmation.state.recurringOccurrences.length, 0);

    const confirmed = await materializeRecurringOccurrence(sessionId, {
      commandId: commands.materializeA,
      templateId: template.id,
      expectedOccurrenceKey: "2026-09-10",
    });
    assert.deepEqual(confirmed.result.debts, []);
    assert.equal(confirmed.result.occurrence.status, "materialized");
    assert.equal((await loadDebtCenterStateForSession(sessionId)).state.expenses.length, beforeTemplate.state.expenses.length + 1);
  });
});

test("omitir avanza el mes sin gasto ni deuda y bloquea materialización posterior", async () => {
  await withRepository(async () => {
    const sessionId = "5".repeat(32);
    const before = await loadDebtCenterStateForSession(sessionId);
    const template = (await createTemplate(sessionId)).result;
    const input = { commandId: commands.skipA, templateId: template.id, expectedOccurrenceKey: "2026-09-15" };
    const skipped = await skipRecurringOccurrence(sessionId, input);
    const replay = await skipRecurringOccurrence(sessionId, { ...input, commandId: commands.skipB });
    const after = await loadDebtCenterStateForSession(sessionId);

    assert.equal(replay.result.occurrence.id, skipped.result.occurrence.id);
    assert.equal(skipped.result.occurrence.status, "skipped");
    assert.equal(skipped.result.occurrence.expenseId, undefined);
    assert.equal(skipped.result.template.nextOccurrenceOn, "2026-10-15");
    assert.equal(after.state.expenses.length, before.state.expenses.length);
    assert.equal(after.state.debts.length, before.state.debts.length);
    assert.equal(after.state.recurringOccurrences.length, 1);
    await assert.rejects(
      () => materializeRecurringOccurrence(sessionId, {
        commandId: commands.materializeA,
        templateId: template.id,
        expectedOccurrenceKey: "2026-09-15",
      }),
      /RECURRENCE_OCCURRENCE_SKIPPED/,
    );
  });
});

test("pausar es idempotente y evita omitir o materializar nuevos meses", async () => {
  await withRepository(async () => {
    const sessionId = "6".repeat(32);
    const before = await loadDebtCenterStateForSession(sessionId);
    const template = (await createTemplate(sessionId)).result;
    const paused = await pauseRecurringTemplate(sessionId, { commandId: commands.pause, templateId: template.id });
    const replay = await pauseRecurringTemplate(sessionId, { commandId: commands.pause, templateId: template.id });
    const after = await loadDebtCenterStateForSession(sessionId);

    assert.equal(paused.result.id, replay.result.id);
    assert.equal(replay.result.status, "paused");
    assert.equal(after.state.expenses.length, before.state.expenses.length);
    assert.equal(after.state.debts.length, before.state.debts.length);
    assert.equal(after.state.recurringOccurrences.length, 0);
    await assert.rejects(
      () => materializeRecurringOccurrence(sessionId, {
        commandId: commands.materializeA,
        templateId: template.id,
        expectedOccurrenceKey: "2026-09-15",
      }),
      /RECURRING_TEMPLATE_NOT_ACTIVE/,
    );
    await assert.rejects(
      () => skipRecurringOccurrence(sessionId, {
        commandId: commands.skipA,
        templateId: template.id,
        expectedOccurrenceKey: "2026-09-15",
      }),
      /RECURRING_TEMPLATE_NOT_ACTIVE/,
    );
  });
});

test("errores de fecha, identidad, stale state y conflicto fallan sin efectos parciales", async () => {
  await withRepository(async () => {
    const sessionId = "7".repeat(32);
    await assert.rejects(
      () => createTemplate(sessionId, { commandId: "rec_template_cmd_invalido" }),
      /INVALID_RECURRENCE_COMMAND_ID/,
    );
    await assert.rejects(
      () => createTemplate(sessionId, { nextOccurrenceOn: "2026-09-29" }),
      /INVALID_RECURRENCE_DATE/,
    );
    await assert.rejects(
      () => createTemplate(sessionId, { sourceExpenseId: "expense_missing" }),
      /EXPENSE_NOT_FOUND/,
    );

    const template = (await createTemplate(sessionId)).result;
    await assert.rejects(
      () => materializeRecurringOccurrence(sessionId, {
        commandId: commands.materializeA,
        templateId: template.id,
        expectedOccurrenceKey: "2026-10-15",
      }),
      /RECURRENCE_OCCURRENCE_STALE/,
    );
    await mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
      const group = state.groups.find((item) => item.id === template.groupId);
      assert.ok(group);
      group.participantIds = group.participantIds.filter((id) => id !== "person_nico");
    });
    await assert.rejects(
      () => materializeRecurringOccurrence(sessionId, {
        commandId: commands.materializeA,
        templateId: template.id,
        expectedOccurrenceKey: "2026-09-15",
      }),
      /RECURRENCE_TEMPLATE_STALE/,
    );
    const after = await loadDebtCenterStateForSession(sessionId);
    assert.equal(after.state.recurringOccurrences.length, 0);
    assert.equal(after.state.expenses.filter((expense) => expense.recurrence).length, 0);
  });
});

test("acciones recurrentes son locales, same-origin y nunca invocan red ni Floid", async () => {
  const [serviceSource, routeSource] = await Promise.all([
    source("lib/debt-center/service.ts"),
    source("app/api/debt-center/route.ts"),
  ]);
  const recurrenceBlock = serviceSource.slice(
    serviceSource.indexOf("function assertRecurringTemplateFresh"),
    serviceSource.indexOf("export type CreatePayinInput"),
  );
  assert.doesNotMatch(recurrenceBlock, /getPaymentProvider|createPayin|provider\.|fetch\(|Floid/i);
  assert.match(routeSource, /assertSameOriginMutation\(request\)/);
  for (const action of ["create_recurring_template", "materialize_recurring_occurrence", "pause_recurring_template", "skip_recurring_occurrence"]) {
    assert.match(routeSource, new RegExp(`body\\.action === "${action}"`), `${action} debe tener ruta explícita`);
  }

  await withRepository(async () => {
    const previousFetch = globalThis.fetch;
    let networkCalls = 0;
    globalThis.fetch = async () => {
      networkCalls += 1;
      throw new Error("NETWORK_FORBIDDEN_IN_RECURRENCE");
    };
    try {
      const sessionId = "8".repeat(32);
      const template = (await createTemplate(sessionId)).result;
      await materializeRecurringOccurrence(sessionId, {
        commandId: commands.materializeA,
        templateId: template.id,
        expectedOccurrenceKey: "2026-09-15",
      });
      assert.equal(networkCalls, 0);
    } finally {
      globalThis.fetch = previousFetch;
    }
  });
});

test("errores recurrentes tienen respuesta pública segura y no cacheable", async () => {
  const expected = new Map([
    ["INVALID_RECURRENCE_COMMAND_ID", 400],
    ["INVALID_RECURRENCE_DATE", 422],
    ["RECURRING_TEMPLATE_NOT_FOUND", 404],
    ["RECURRING_TEMPLATE_NOT_ACTIVE", 409],
    ["RECURRENCE_OCCURRENCE_STALE", 409],
    ["RECURRENCE_OCCURRENCE_SKIPPED", 409],
    ["RECURRENCE_TEMPLATE_STALE", 409],
  ]);
  for (const [code, status] of expected) {
    const response = debtCenterErrorResponse(new Error(code));
    const payload = await response.json();
    assert.equal(response.status, status, code);
    assert.equal(payload.error, code, code);
    assert.equal(typeof payload.message, "string");
    assert.ok(payload.message.length > 0);
    assert.match(response.headers.get("cache-control") ?? "", /no-store/);
    assert.doesNotMatch(JSON.stringify(payload), /commandFingerprint|commandId|receipt|provider|token/i);
  }
});

test("LivingSpec de Cuentas Claras declara exactamente 15 pantallas completas y ordenadas", () => {
  const product = PORTFOLIO_PRODUCTS.find((candidate) => candidate.id === "clear_accounts");
  assert.ok(product);
  const flow = getLivingSpec(product, "home").technicalFlow;
  assert.ok(flow);
  assert.equal(flow.length, 15);
  assert.equal(new Set(flow.map((screen) => screen.screen)).size, 15);
  flow.forEach((screen, index) => {
    assert.match(screen.screen, new RegExp(`^${String(index + 1).padStart(2, "0")} · `));
    for (const field of ["ui", "next", "command", "failure", "acceptance"]) {
      assert.ok(screen[field].trim().length > 0, `${screen.screen} debe declarar ${field}`);
    }
    for (const field of ["services", "reads", "writes", "records", "events"]) {
      assert.ok(Array.isArray(screen[field]) && screen[field].length > 0, `${screen.screen} debe declarar ${field}`);
    }
  });
  assert.match(flow[8].acceptance, /cero gastos, obligaciones, mensajes y pagos/i);
  assert.match(flow[9].next, /Confirmar y crear el mismo gasto \| Omitir con confirmación \| Dejar de preparar con confirmación/);
  assert.match(flow[9].records.join(" "), /sólo tras confirmar/i);
  assert.match(flow[10].screen, /^11 · Cartola demo$/);
  assert.match(flow[10].services.join(" "), /load_mock_statement[\s\S]*reconciliation-rule-v1/i);
  assert.match(flow[10].acceptance, /\$5\.000[\s\S]*\$5\.000 pendientes[\s\S]*cero banco, Floid o red/i);
  assert.match(flow[11].screen, /^12 · Revisión de coincidencia$/);
  assert.match(flow[11].ui, /decisión humana sin preselección/i);
  assert.match(flow[11].next, /Registrar \| Descartar \| Reabrir \| Deshacer registro/);
  assert.match(flow[11].acceptance, /ambigua cambia cero pesos hasta confirmar[\s\S]*replay produce un solo abono/i);
  assert.match(flow[12].screen, /^13 · Fuente compartida$/);
  assert.deepEqual(flow[12].writes, ["Ninguna"]);
  assert.match(flow[12].services.join(" "), /GET \/api\/debt-center\/summary/);
  assert.match(flow[12].acceptance, /mismo remanente[\s\S]*descriptor y referencia nunca viajan en la URL/i);
  assert.match(flow[13].screen, /^14 · Saldo simplificado$/);
  assert.deepEqual(flow[13].writes, ["Ninguna"]);
  assert.match(flow[13].command, /Sólo lectura; no existe comando de pago neteado/i);
  assert.match(flow[13].records.join(" "), /derivado; no se persiste/i);
  assert.match(flow[13].acceptance, /A→B \$10\.000 y B→C \$10\.000 sugiere A→C \$10\.000[\s\S]*ninguna deuda, link, settlement o contraparte original cambia/i);
  assert.match(flow[14].screen, /^15 · Corregir un gasto$/);
  assert.match(flow[14].services.join(" "), /POST cancel_expense_for_correction[\s\S]*sessionStorage draft adapter/i);
  assert.match(flow[14].command, /CancelExpenseForCorrection[\s\S]*idempotente/i);
  assert.match(flow[14].writes.join(" "), /cancelled_for_correction[\s\S]*deudas cancelled[\s\S]*borrador local opaco/i);
  assert.match(flow[14].records.join(" "), /original y linaje de reemplazo; nunca tokens/i);
  assert.match(flow[14].failure, /Abono, pago activo, plantilla activa, actor ajeno o replay conflictivo → cero cambios/i);
  assert.match(flow[14].acceptance, /original nunca se borra[\s\S]*link viejo no paga[\s\S]*una sola copia[\s\S]*nuevos IDs y cero settlements heredados/i);
});

test("UI y ficha mantienen la recurrencia como borrador hasta un toque explícito", async () => {
  const [page, overrides, productSheet, mcp] = await Promise.all([
    source("app/cuentas-claras/page.tsx"),
    source("app/cuentas-claras/cuentas-claras-overrides.module.css"),
    source("product-knowledge/products/cuentas-claras.md"),
    source("app/api/mcp/route.ts"),
  ]);
  const setupBlock = page.slice(page.indexOf("function RecurringSetup"), page.indexOf("function RecurringDueSheet"));
  const dueBlock = page.slice(page.indexOf("function RecurringDueSheet"), page.indexOf("function DebtSheet"));

  assert.doesNotMatch(setupBlock, /useEffect|setTimeout|setInterval/);
  assert.match(setupBlock, /const save = async \(\) =>/);
  assert.match(setupBlock, /action: "create_recurring_template"/);
  assert.match(setupBlock, /onClick=\{\(\) => void save\(\)\}/);
  assert.match(setupBlock, /Nada se creará ni cobrará automáticamente/);
  assert.match(setupBlock, /Cada mes tendrás que revisar y confirmar antes de crear nuevas cuentas/);
  assert.doesNotMatch(setupBlock, /materialize_recurring_occurrence/);

  assert.doesNotMatch(dueBlock, /useEffect|setTimeout|setInterval/);
  assert.match(dueBlock, /const mutate = async \(action:/);
  assert.match(dueBlock, /onClick=\{\(\) => void mutate\("materialize_recurring_occurrence"\)\}/);
  assert.match(dueBlock, /Todavía es un borrador/);
  assert.match(dueBlock, /No existe una deuda nueva, un mensaje ni un pago hasta que confirmes/);
  assert.match(dueBlock, /Confirmar y crear este mismo gasto/);
  assert.match(dueBlock, /Omitir este mes/);
  assert.match(dueBlock, /Dejar de preparar/);

  for (const className of ["recurringCard", "recurringSetup", "recurringLead", "recurringSummary", "recurringActions", "recurringSecondaryActions"]) {
    assert.match(page, new RegExp(`overrides\\.${className}`), `${className} debe usarse en UI`);
    assert.match(overrides, new RegExp(`\\.${className}(?:\\s|\\{|>)`), `${className} debe tener estilo explícito`);
  }
  assert.match(productSheet, /CC-BR-007[\s\S]*nunca crea por sí sola gasto, deuda, mensaje o pago/i);
  assert.match(productSheet, /siempre exige confirmación/i);
  assert.match(productSheet, /No existe cron, scheduler, push, mensaje ni cobro automático/i);
  assert.match(mcp, /Cuentas Claras usa siempre MockFloid local: no acepta credenciales, no llama servicios externos y no puede mover dinero/);
});
