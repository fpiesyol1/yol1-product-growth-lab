import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { deriveGroupNetting } from "../lib/debt-center/netting.ts";
import { buildDashboard } from "../lib/debt-center/domain.ts";
import { createDebtCenterSeed } from "../lib/debt-center/seed.ts";

function group(participantIds, overrides = {}) {
  return {
    id: "group_netting_test",
    name: "Grupo neteo",
    category: "other",
    currency: "CLP",
    participantIds,
    createdAt: "2026-08-27T00:00:00.000Z",
    ...overrides,
  };
}

function debt(id, debtorParticipantId, creditorParticipantId, outstandingAmount, overrides = {}) {
  return {
    id,
    publicToken: `pay_${id}_opaque`,
    groupId: "group_netting_test",
    expenseId: `expense_${id}`,
    creditorParticipantId,
    debtorParticipantId,
    originalAmount: outstandingAmount,
    status: "open",
    createdAt: "2026-08-27T00:00:00.000Z",
    updatedAt: "2026-08-27T01:00:00.000Z",
    groupName: "Grupo neteo",
    expenseTitle: `Gasto ${id}`,
    creditorName: "SENTINEL_CREDITOR_NAME",
    debtorName: "SENTINEL_DEBTOR_NAME",
    paidAmount: 0,
    outstandingAmount,
    paymentAttempts: [],
    settlements: [],
    collection: { state: "to_share", sharedCount: 0, followUpCount: 0 },
    ...overrides,
  };
}

function transferShape(view) {
  return view.transfers.map(({ fromParticipantId, toParticipantId, amount }) => ({ fromParticipantId, toParticipantId, amount }));
}

test("neteo usa sólo remanentes parciales, compensa deudas recíprocas y no muta el ledger", () => {
  const sourceGroup = group(["person_a", "person_b"]);
  const sourceDebts = [
    debt("debt_a_b", "person_a", "person_b", 4_000, {
      originalAmount: 10_000,
      paidAmount: 6_000,
      status: "partially_paid",
      paymentAttempts: [{ status: "pending" }],
    }),
    debt("debt_b_a", "person_b", "person_a", 1_000),
  ];
  const before = structuredClone({ sourceGroup, sourceDebts });

  const view = deriveGroupNetting(sourceGroup, sourceDebts);

  assert.deepEqual({ sourceGroup, sourceDebts }, before, "simplificar debe ser una lectura pura");
  assert.deepEqual(view.participantBalances, [
    { participantId: "person_a", netAmount: -3_000 },
    { participantId: "person_b", netAmount: 3_000 },
  ]);
  assert.deepEqual(transferShape(view), [
    { fromParticipantId: "person_a", toParticipantId: "person_b", amount: 3_000 },
  ]);
  assert.equal(view.originalOpenDebtCount, 2);
  assert.equal(view.simplifiedTransferCount, 1);
  assert.equal(view.reducedBy, 1);
  assert.equal(view.hasActivePayment, true);
});

test("greedy determinista soporta dos deudores y tres acreedores sin perder conservación", () => {
  const sourceGroup = group(["person_a", "person_b", "person_c", "person_d", "person_e"]);
  const sourceDebts = [
    debt("debt_1", "person_a", "person_b", 500),
    debt("debt_2", "person_a", "person_c", 300),
    debt("debt_3", "person_a", "person_e", 200),
    debt("debt_4", "person_d", "person_b", 100),
    debt("debt_5", "person_d", "person_c", 400),
    debt("debt_6", "person_d", "person_e", 100),
  ];

  const first = deriveGroupNetting(sourceGroup, sourceDebts);
  const replay = deriveGroupNetting(sourceGroup, [...sourceDebts].reverse());

  assert.deepEqual(first.participantBalances, [
    { participantId: "person_a", netAmount: -1_000 },
    { participantId: "person_b", netAmount: 600 },
    { participantId: "person_c", netAmount: 700 },
    { participantId: "person_d", netAmount: -600 },
    { participantId: "person_e", netAmount: 300 },
  ]);
  assert.deepEqual(transferShape(first), [
    { fromParticipantId: "person_a", toParticipantId: "person_c", amount: 700 },
    { fromParticipantId: "person_a", toParticipantId: "person_b", amount: 300 },
    { fromParticipantId: "person_d", toParticipantId: "person_b", amount: 300 },
    { fromParticipantId: "person_d", toParticipantId: "person_e", amount: 300 },
  ]);
  assert.equal(first.originalOpenDebtCount, 6);
  assert.equal(first.simplifiedTransferCount, 4);
  assert.equal(first.reducedBy, 2);
  assert.deepEqual(replay, first, "ordenar el mismo ledger de otra forma no debe cambiar IDs ni instrucciones");
  assert.equal(first.participantBalances.reduce((sum, item) => sum + item.netAmount, 0), 0);
  assert.equal(first.transfers.reduce((sum, item) => sum + item.amount, 0), 1_600);
});

test("un ciclo cerrado queda a mano y la simplificación propone cero transferencias", () => {
  const sourceGroup = group(["person_a", "person_b", "person_c"]);
  const view = deriveGroupNetting(sourceGroup, [
    debt("debt_a_b", "person_a", "person_b", 10_000),
    debt("debt_b_c", "person_b", "person_c", 10_000),
    debt("debt_c_a", "person_c", "person_a", 10_000),
  ]);

  assert.deepEqual(view.participantBalances, [
    { participantId: "person_a", netAmount: 0 },
    { participantId: "person_b", netAmount: 0 },
    { participantId: "person_c", netAmount: 0 },
  ]);
  assert.deepEqual(view.transfers, []);
  assert.equal(view.originalOpenDebtCount, 3);
  assert.equal(view.simplifiedTransferCount, 0);
  assert.equal(view.reducedBy, 3);
});

test("CLP conserva exactamente 33 + 33 + 34 y rechaza fracciones", () => {
  const sourceGroup = group(["person_a", "person_b", "person_c", "person_d"]);
  const sourceDebts = [
    debt("debt_b_a", "person_b", "person_a", 33),
    debt("debt_c_a", "person_c", "person_a", 33),
    debt("debt_d_a", "person_d", "person_a", 34),
  ];
  const view = deriveGroupNetting(sourceGroup, sourceDebts);

  assert.equal(view.transfers.reduce((sum, item) => sum + item.amount, 0), 100);
  assert.ok(view.transfers.every((item) => Number.isSafeInteger(item.amount) && item.amount > 0));
  assert.deepEqual(transferShape(view), [
    { fromParticipantId: "person_d", toParticipantId: "person_a", amount: 34 },
    { fromParticipantId: "person_b", toParticipantId: "person_a", amount: 33 },
    { fromParticipantId: "person_c", toParticipantId: "person_a", amount: 33 },
  ]);
  assert.throws(
    () => deriveGroupNetting(sourceGroup, [debt("debt_fraction", "person_b", "person_a", 33.5)]),
    /INVALID_NETTING_BASIS/,
  );
  assert.throws(
    () => deriveGroupNetting(sourceGroup, [
      debt("debt_safe_1", "person_b", "person_a", Number.MAX_SAFE_INTEGER),
      debt("debt_safe_2", "person_b", "person_a", Number.MAX_SAFE_INTEGER),
    ]),
    /INVALID_NETTING_BASIS/,
    "dos montos individualmente seguros no pueden producir un saldo o transferencia fuera de rango CLP",
  );
});

test("DTO de neteo es mínimo, no filtra secretos y su cálculo no usa Floid ni red", async () => {
  const sourceGroup = group(["person_a", "person_b"]);
  const sourceDebts = [debt("debt_secret", "person_a", "person_b", 500, {
    publicToken: "SENTINEL_PUBLIC_TOKEN",
    creditorName: "SENTINEL_CREDITOR",
    debtorName: "SENTINEL_DEBTOR",
    paymentAttempts: [{ status: "failed", providerPaymentToken: "SENTINEL_PROVIDER_TOKEN" }],
  })];
  const previousFetch = globalThis.fetch;
  let networkCalls = 0;
  globalThis.fetch = async () => {
    networkCalls += 1;
    throw new Error("NETWORK_FORBIDDEN_IN_NETTING");
  };
  try {
    const view = deriveGroupNetting(sourceGroup, sourceDebts);
    assert.equal(networkCalls, 0);
    assert.deepEqual(Object.keys(view).sort(), [
      "balanceFingerprint",
      "basisDebtIds",
      "calculatedAt",
      "currency",
      "groupId",
      "hasActivePayment",
      "originalOpenDebtCount",
      "participantBalances",
      "reducedBy",
      "schemaVersion",
      "simplifiedTransferCount",
      "source",
      "strategy",
      "transfers",
    ]);
    assert.deepEqual(Object.keys(view.transfers[0]).sort(), ["amount", "fromParticipantId", "id", "toParticipantId"]);
    assert.doesNotMatch(JSON.stringify(view), /SENTINEL_|publicToken|provider|contact|reconciliation|descriptor/i);
  } finally {
    globalThis.fetch = previousFetch;
  }

  const implementation = await readFile(new URL("../lib/debt-center/netting.ts", import.meta.url), "utf8");
  assert.doesNotMatch(implementation, /fetch\s*\(|getPaymentProvider|Floid|process\.env/i);
  assert.match(implementation, /source: "derived_from_debt_ledger"/);
});

test("una base inválida oculta sólo la sugerencia y conserva el ledger Por gasto", () => {
  const state = createDebtCenterSeed();
  const targetGroup = state.groups.find((item) => state.debts.some((debtItem) => debtItem.groupId === item.id));
  assert.ok(targetGroup);
  targetGroup.participantIds = [state.currentParticipantId];
  const dashboard = buildDashboard(state, "memory", "mock_floid");
  assert.ok(dashboard.debts.some((item) => item.groupId === targetGroup.id));
  assert.equal(dashboard.groupNetting.some((item) => item.groupId === targetGroup.id), false);
});

test("UI ofrece Simplificado y Por gasto sin convertir la sugerencia en pago o mutación", async () => {
  const [page, css, route] = await Promise.all([
    readFile(new URL("../app/cuentas-claras/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/cuentas-claras/cuentas-claras-overrides.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/api/debt-center/route.ts", import.meta.url), "utf8"),
  ]);
  const groupsView = page.slice(page.indexOf("function GroupsView"), page.indexOf("function ActivityView"));
  const simplifiedView = groupsView.slice(groupsView.indexOf('balanceMode === "simplified" && netting'), groupsView.indexOf("</section>", groupsView.indexOf('balanceMode === "simplified" && netting')));

  assert.match(groupsView, /useState<"simplified" \| "gross">\("simplified"\)/);
  assert.match(groupsView, />Simplificado<\/button>/);
  assert.match(groupsView, />Por gasto<\/button>/);
  assert.match(groupsView, /dashboard\.groupNetting\.find/);
  assert.match(simplifiedView, /Sugerencia matemática · no es un cobro/);
  assert.match(simplifiedView, /Los gastos originales siguen disponibles en “Por gasto”\./);
  assert.match(simplifiedView, /No cambia ningún acuerdo\./);
  assert.match(simplifiedView, /no registra pagos, no cancela cobros y no mueve dinero/);
  assert.match(groupsView, /fromParticipantId === dashboard\.currentParticipant\.id/);
  assert.match(groupsView, /toParticipantId === dashboard\.currentParticipant\.id/);
  assert.match(groupsView, /transferLabel\(transfer\.fromParticipantId, transfer\.toParticipantId\)/);
  assert.match(groupsView, /Tú le pagas a/);
  assert.match(groupsView, /te paga/);
  assert.match(groupsView, /le paga a/);
  assert.doesNotMatch(groupsView, /participantName\(transfer\.fromParticipantId\)\} paga a \$\{participantName\(transfer\.toParticipantId\)\}/);
  assert.doesNotMatch(simplifiedView, /fetch\s*\(|\/pagar\/|onCopy|create_payin|confirm_|settlement/i);
  assert.doesNotMatch(route, /net(?:ting)?_payment|pay_simplified|settle_net/i);
  for (const className of ["nettingToggle", "nettingView", "nettingTransfers", "nettingDetails", "nettingGuardrail"]) {
    assert.match(page, new RegExp(`overrides\\.${className}`));
    assert.match(css, new RegExp(`\\.${className}(?:\\s|\\{|>|,)`));
  }
});
