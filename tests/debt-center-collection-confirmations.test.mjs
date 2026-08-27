import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import test from "node:test";

import { buildDashboard } from "../lib/debt-center/domain.ts";
import {
  assertDebtCenterStateWithinLimits,
  DEBT_CENTER_PAYMENT_TRANSITION_RESERVE_BYTES,
  DEBT_CENTER_RETENTION_MS,
  MAX_COLLECTION_CONFIRMATIONS,
  MAX_DEBT_CENTER_ACTIVE_PAYMENT_BYTES,
  MAX_DEBT_CENTER_ACTIVITIES,
  MAX_DEBT_CENTER_STATE_BYTES,
} from "../lib/debt-center/limits.ts";
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

const { confirmCollectionShared } = await import("../lib/debt-center/service.ts");
const {
  getDebtCenterRepository,
  loadDebtCenterStateForSession,
  MemoryDebtCenterRepository,
  mutateDebtCenterState,
} = await import("../lib/debt-center/state-repository.ts");
const { debtCenterWorkspaceId } = await import("../lib/debt-center/session.ts");

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

const initialCommand = `collection_share_cmd_${"a".repeat(32)}`;
const followUpCommand = `collection_share_cmd_${"b".repeat(32)}`;
const closedFollowUpCommand = `collection_share_cmd_${"c".repeat(32)}`;

test("copiar prepara una confirmación local pero no persiste el cobro como compartido", async () => {
  const page = await source("app/cuentas-claras/page.tsx");
  const copyBlock = page.slice(page.indexOf("const copyDebtLink"), page.indexOf("const confirmShared"));
  const confirmBlock = page.slice(page.indexOf("const confirmShared"), page.indexOf("const resetDemo"));
  const dismissBlock = page.slice(page.indexOf("const dismissShareConfirmation"), page.indexOf("const resetDemo"));
  const focusHook = page.slice(page.indexOf("function useDialogFocus"), page.indexOf("function statusLabel"));
  const confirmationSheet = page.slice(page.indexOf("function CollectionShareConfirmation"), page.indexOf("function ExpenseComposer"));

  assert.match(copyBlock, /navigator\.clipboard\.writeText\(`\$\{collectionMessageBody\(debt, messageKind\)\} \$\{url\}`\)/);
  assert.match(copyBlock, /setShareConfirmation\(/);
  assert.doesNotMatch(copyBlock, /fetch\(|confirm_collection_shared/);
  assert.match(confirmBlock, /fetch\("\/api\/debt-center"/);
  assert.match(confirmBlock, /action: "confirm_collection_shared"/);
  assert.match(page, /MENSAJE COPIADO · NO ENVIADO/);
  assert.match(focusHook, /event\.key === "Escape"[\s\S]*closeRef\.current\(\)/);
  assert.match(focusHook, /window\.matchMedia\("\(max-width: 720px\)"\)\.matches/);
  assert.match(focusHook, /anchorDialogToViewport && previousScrollY !== 0[\s\S]*window\.scrollTo\(\{ top: 0, behavior: "auto" \}\)/);
  assert.match(focusHook, /document\.body\.style\.top = anchorDialogToViewport \? "0px" : `-\$\{previousScrollY\}px`/);
  assert.match(focusHook, /window\.scrollTo\(\{ top: previousScrollY, behavior: "auto" \}\)/);
  assert.match(confirmationSheet, /const dialogRef = useDialogFocus\(onClose(?:, true, false)?\)/);
  assert.match(confirmationSheet, /onClick=\{onClose\}>Ahora no<\/button>/);
  assert.doesNotMatch(confirmationSheet, />Todavía no<\/button>/);
  assert.match(page, /Sí, ya lo compartí/);
  assert.match(page, /onClose=\{dismissShareConfirmation\}/);
  assert.match(dismissBlock, /setShareConfirmation\(null\)/);
  assert.match(dismissBlock, /focusCollectionNoticeRef\.current = true/);
  assert.match(dismissBlock, /setNotice\("Mensaje copiado\. YOL1 no sabe si lo compartiste; no registramos un envío\."\)/);
  assert.match(dismissBlock, /window\.requestAnimationFrame\(\(\) => \{[\s\S]*noticeRef\.current\?\.focus\(\{ preventScroll: true \}\)[\s\S]*window\.scrollTo\(\{ top: collectionFlowScrollYRef\.current, behavior: "auto" \}\)/);
});

test("confirmar el cobro inicial es durable, idempotente y sólo lo puede hacer el acreedor", async () => {
  await withRepository(async () => {
    const sessionId = "9".repeat(32);
    const before = await loadDebtCenterStateForSession(sessionId);
    const receivable = before.state.debts.find((debt) => debt.creditorParticipantId === before.state.currentParticipantId && debt.status === "open");
    const payable = before.state.debts.find((debt) => debt.creditorParticipantId !== before.state.currentParticipantId);
    assert.ok(receivable);
    assert.ok(payable);

    const first = await confirmCollectionShared(sessionId, { commandId: initialCommand, debtId: receivable.id, messageKind: "initial" });
    const replay = await confirmCollectionShared(sessionId, { commandId: initialCommand, debtId: receivable.id, messageKind: "initial" });
    const stored = await loadDebtCenterStateForSession(sessionId);
    const debt = buildDashboard(stored.state, "memory", "mock_floid").debts.find((item) => item.id === receivable.id);

    assert.equal(replay.result.id, first.result.id);
    assert.equal(stored.state.collectionConfirmations.length, 1);
    assert.equal(stored.state.activities.filter((activity) => activity.type === "collection_shared").length, 1);
    assert.deepEqual(debt?.collection, {
      state: "shared_by_creator",
      lastSharedAt: first.result.occurredAt,
      sharedCount: 1,
      followUpCount: 0,
    });
    await assert.rejects(
      () => confirmCollectionShared(sessionId, { commandId: followUpCommand, debtId: payable.id, messageKind: "initial" }),
      /COLLECTION_NOT_OWNED/,
    );
    assert.equal((await loadDebtCenterStateForSession(sessionId)).state.collectionConfirmations.length, 1);
  });
});

test("seguimiento requiere un cobro inicial y una cuenta cobrable", async () => {
  await withRepository(async () => {
    const sessionId = "8".repeat(32);
    const before = await loadDebtCenterStateForSession(sessionId);
    const receivable = before.state.debts.find((debt) => debt.creditorParticipantId === before.state.currentParticipantId && debt.status === "open");
    assert.ok(receivable);

    await assert.rejects(
      () => confirmCollectionShared(sessionId, { commandId: followUpCommand, debtId: receivable.id, messageKind: "follow_up" }),
      /COLLECTION_FOLLOW_UP_REQUIRES_INITIAL/,
    );
    await assert.rejects(
      () => confirmCollectionShared(sessionId, { commandId: followUpCommand, debtId: "debt_missing", messageKind: "follow_up" }),
      /DEBT_NOT_FOUND/,
    );
    await confirmCollectionShared(sessionId, { commandId: initialCommand, debtId: receivable.id, messageKind: "initial" });
    const followUp = await confirmCollectionShared(sessionId, { commandId: followUpCommand, debtId: receivable.id, messageKind: "follow_up" });
    const stored = await loadDebtCenterStateForSession(sessionId);
    const debt = buildDashboard(stored.state, "memory", "mock_floid").debts.find((item) => item.id === receivable.id);
    assert.equal(followUp.result.messageKind, "follow_up");
    assert.equal(debt?.collection.sharedCount, 2);
    assert.equal(debt?.collection.followUpCount, 1);

    await mutateDebtCenterState(debtCenterWorkspaceId(sessionId), (state) => {
      state.settlements.push({
        id: "settlement_collection_closed",
        debtId: receivable.id,
        source: "payment_attempt",
        paymentAttemptId: "attempt_collection_closed",
        amount: receivable.originalAmount,
        providerPaymentId: "mock_payment_collection_closed",
        settledAt: "2026-08-27T02:00:00.000Z",
        recordedAt: "2026-08-27T02:00:00.000Z",
      });
    });
    await assert.rejects(
      () => confirmCollectionShared(sessionId, { commandId: closedFollowUpCommand, debtId: receivable.id, messageKind: "follow_up" }),
      /DEBT_NOT_COLLECTABLE/,
    );
  });
});

test("pago iniciado, abono parcial y cierre prevalecen sobre el seguimiento", () => {
  const state = createDebtCenterSeed();
  const debt = state.debts.find((item) => item.id === "debt_nico_10000");
  assert.ok(debt);
  state.collectionConfirmations.push({
    id: "collection_share_seed",
    commandId: initialCommand,
    debtId: debt.id,
    messageKind: "initial",
    confirmedByParticipantId: state.currentParticipantId,
    occurredAt: "2026-08-27T01:00:00.000Z",
  });

  const shared = buildDashboard(state, "memory", "mock_floid").debts.find((item) => item.id === debt.id);
  assert.equal(shared?.collection.state, "shared_by_creator");

  state.paymentAttempts.push({
    id: "attempt_collection_precedence",
    debtId: debt.id,
    amount: 5_000,
    provider: "mock_floid",
    providerPaymentToken: "mock_collection_precedence",
    paymentUrl: `/pagar/${debt.publicToken}`,
    status: "pending",
    providerStep: "WAITING",
    idempotencyKey: "collection-precedence-1",
    createdAt: "2026-08-27T01:05:00.000Z",
    updatedAt: "2026-08-27T01:05:00.000Z",
  });
  assert.equal(buildDashboard(state, "memory", "mock_floid").debts.find((item) => item.id === debt.id)?.collection.state, "payment_started");

  state.settlements.push({
    id: "settlement_collection_precedence_1",
    debtId: debt.id,
    paymentAttemptId: "attempt_collection_precedence",
    amount: 5_000,
    providerPaymentId: "mock_payment_collection_precedence_1",
    settledAt: "2026-08-27T01:10:00.000Z",
  });
  assert.equal(buildDashboard(state, "memory", "mock_floid").debts.find((item) => item.id === debt.id)?.collection.state, "partially_paid");

  state.settlements.push({
    id: "settlement_collection_precedence_2",
    debtId: debt.id,
    paymentAttemptId: "attempt_collection_precedence_2",
    amount: 5_000,
    providerPaymentId: "mock_payment_collection_precedence_2",
    settledAt: "2026-08-27T01:20:00.000Z",
  });
  assert.equal(buildDashboard(state, "memory", "mock_floid").debts.find((item) => item.id === debt.id)?.collection.state, "closed");
});

test("intentos failed, cancelled o expired no dejan el cobro en payment_started", () => {
  for (const terminalStatus of ["failed", "cancelled", "expired"]) {
    const state = createDebtCenterSeed();
    const debt = state.debts.find((item) => item.id === "debt_nico_10000");
    assert.ok(debt);
    state.collectionConfirmations.push({
      id: `collection_share_${terminalStatus}`,
      commandId: initialCommand,
      debtId: debt.id,
      messageKind: "initial",
      confirmedByParticipantId: state.currentParticipantId,
      occurredAt: "2026-08-27T01:00:00.000Z",
    });
    state.paymentAttempts.push({
      id: `attempt_collection_${terminalStatus}`,
      debtId: debt.id,
      amount: 5_000,
      provider: "mock_floid",
      providerPaymentToken: `mock_collection_${terminalStatus}`,
      paymentUrl: `/pagar/${debt.publicToken}`,
      status: terminalStatus,
      providerStep: terminalStatus.toUpperCase(),
      idempotencyKey: `collection-${terminalStatus}`,
      createdAt: "2026-08-27T01:05:00.000Z",
      updatedAt: "2026-08-27T01:06:00.000Z",
    });

    const withPriorShare = buildDashboard(state, "memory", "mock_floid").debts.find((item) => item.id === debt.id);
    assert.equal(withPriorShare?.collection.state, "shared_by_creator", terminalStatus);

    state.collectionConfirmations = [];
    const withoutPriorShare = buildDashboard(state, "memory", "mock_floid").debts.find((item) => item.id === debt.id);
    assert.equal(withoutPriorShare?.collection.state, "to_share", terminalStatus);
  }
});

test("un estado cargado antes del TTL no puede sobrescribir una nueva generación ABA", async () => {
  const repository = new MemoryDebtCenterRepository();
  const originalNow = Date.now;
  let now = Date.parse("2026-08-27T00:00:00.000Z");
  Date.now = () => now;
  try {
    const stale = await repository.load("aba_workspace");
    stale.state.groups[0].name = "Escritura obsoleta";
    const staleGeneration = stale.state.generationId;

    now += DEBT_CENTER_RETENTION_MS + 1;
    const recreated = await repository.load("aba_workspace");
    assert.equal(recreated.storageVersion, stale.storageVersion, "el ABA debe probar versiones iguales");
    assert.notEqual(recreated.state.generationId, staleGeneration, "la recreación debe rotar generationId");

    assert.equal(await repository.save("aba_workspace", stale.state, stale.storageVersion), false);
    const after = await repository.load("aba_workspace");
    assert.equal(after.state.generationId, recreated.state.generationId);
    assert.notEqual(after.state.groups[0].name, "Escritura obsoleta");
  } finally {
    Date.now = originalNow;
  }
});

test("el esquema usa migraciones Drizzle versionadas y ninguna visita ejecuta DDL", async () => {
  const [initialMigration, indexMigration, journalText, schema, repository, packageText] = await Promise.all([
    source("drizzle/debt-center/0000_yielding_sway.sql"),
    source("drizzle/debt-center/0001_light_multiple_man.sql"),
    source("drizzle/debt-center/meta/_journal.json"),
    source("db/debt-center-schema.ts"),
    source("lib/debt-center/state-repository.ts"),
    source("package.json"),
  ]);
  const journal = JSON.parse(journalText);
  const packageJson = JSON.parse(packageText);

  assert.match(initialMigration, /CREATE TABLE "yol1_debt_center_states"/);
  assert.match(indexMigration, /CREATE INDEX "yol1_debt_center_states_updated_at_idx"[\s\S]*"updated_at"/);
  assert.deepEqual(journal.entries.map((entry) => entry.tag), ["0000_yielding_sway", "0001_light_multiple_man"]);
  assert.match(schema, /index\("yol1_debt_center_states_updated_at_idx"\)\.on\(table\.updatedAt\)/);
  assert.equal(packageJson.scripts["db:migrate"], "drizzle-kit migrate --config=drizzle.debt-center.config.ts");
  assert.doesNotMatch(repository, /CREATE\s+(?:TABLE|INDEX)/i);
  assert.match(repository, /SELECT 1 FROM yol1_debt_center_states LIMIT 0/);
});

test("un pago activo reserva espacio operacional y al terminalizar recupera el techo total", async () => {
  const targetBytes = 810 * 1024;
  const encoder = new TextEncoder();
  const resizeStateTo = (candidate, bytes) => {
    const currentName = candidate.groups[0].name;
    const currentBytes = encoder.encode(JSON.stringify(candidate)).byteLength;
    const nextNameBytes = bytes - currentBytes + encoder.encode(currentName).byteLength;
    assert.ok(nextNameBytes >= 0, "el fixture debe poder alcanzar el tamaño objetivo");
    candidate.groups[0].name = "x".repeat(nextNameBytes);
    assert.equal(encoder.encode(JSON.stringify(candidate)).byteLength, bytes);
  };
  const state = createDebtCenterSeed();
  resizeStateTo(state, targetBytes);
  assert.ok(targetBytes > MAX_DEBT_CENTER_ACTIVE_PAYMENT_BYTES);
  assert.ok(targetBytes < MAX_DEBT_CENTER_STATE_BYTES);
  assert.doesNotThrow(() => assertDebtCenterStateWithinLimits(state));

  const repository = new MemoryDebtCenterRepository();
  const stored = await repository.load("payment_headroom_workspace");
  state.generationId = stored.state.generationId;
  assert.equal(await repository.save("payment_headroom_workspace", state, stored.storageVersion), true, "el agregado sin pago activo debe persistir bajo 900 KB");

  const persisted = await repository.load("payment_headroom_workspace");
  const activeAttempt = {
    id: "attempt_operational_reserve",
    debtId: state.debts[0].id,
    amount: 1_000,
    provider: "mock_floid",
    providerPaymentToken: "mock_operational_reserve",
    paymentUrl: `/pagar/${state.debts[0].publicToken}`,
    status: "pending",
    providerStep: "WAITING",
    idempotencyKey: "operational-reserve",
    createdAt: "2026-08-27T02:00:00.000Z",
    updatedAt: "2026-08-27T02:00:00.000Z",
  };
  persisted.state.paymentAttempts.push(activeAttempt);
  assert.ok(encoder.encode(JSON.stringify(persisted.state)).byteLength < MAX_DEBT_CENTER_STATE_BYTES, "el payload sigue bajo el techo total");
  for (const activeStatus of ["creating", "not_started", "pending"]) {
    activeAttempt.status = activeStatus;
    assert.throws(() => assertDebtCenterStateWithinLimits(persisted.state), /DEBT_CENTER_STATE_LIMIT_REACHED/, activeStatus);
  }
  await assert.rejects(
    () => repository.save("payment_headroom_workspace", persisted.state, persisted.storageVersion),
    /DEBT_CENTER_STATE_LIMIT_REACHED/,
  );

  activeAttempt.status = "failed";
  activeAttempt.providerStep = "FAILED";
  activeAttempt.updatedAt = "2026-08-27T02:01:00.000Z";
  assert.doesNotThrow(() => assertDebtCenterStateWithinLimits(persisted.state));
  assert.equal(await repository.save("payment_headroom_workspace", persisted.state, persisted.storageVersion), true, "terminalizar debe liberar la reserva y volver al techo de 900 KB");

  const twoActive = createDebtCenterSeed();
  const firstActive = { ...activeAttempt, id: "attempt_reserve_first", debtId: twoActive.debts[0].id, idempotencyKey: "reserve-first", status: "pending" };
  const secondActive = { ...activeAttempt, id: "attempt_reserve_second", debtId: twoActive.debts[1].id, idempotencyKey: "reserve-second", status: "not_started" };
  twoActive.paymentAttempts.push(firstActive, secondActive);
  const twoActiveLimit = MAX_DEBT_CENTER_STATE_BYTES - 2 * DEBT_CENTER_PAYMENT_TRANSITION_RESERVE_BYTES;
  assert.equal(twoActiveLimit, 700 * 1024);
  resizeStateTo(twoActive, twoActiveLimit);
  assert.doesNotThrow(() => assertDebtCenterStateWithinLimits(twoActive), "dos intentos deben admitir exactamente 700 KiB");
  resizeStateTo(twoActive, twoActiveLimit + 1);
  assert.throws(() => assertDebtCenterStateWithinLimits(twoActive), /DEBT_CENTER_STATE_LIMIT_REACHED/, "dos intentos deben reservar 200 KiB");

  firstActive.status = "failed";
  firstActive.providerStep = "FAILED";
  resizeStateTo(twoActive, MAX_DEBT_CENTER_ACTIVE_PAYMENT_BYTES);
  assert.doesNotThrow(() => assertDebtCenterStateWithinLimits(twoActive), "terminalizar uno debe liberar 100 KiB y admitir 800 KiB");
  resizeStateTo(twoActive, MAX_DEBT_CENTER_ACTIVE_PAYMENT_BYTES + 1);
  assert.throws(() => assertDebtCenterStateWithinLimits(twoActive), /DEBT_CENTER_STATE_LIMIT_REACHED/, "el segundo intento aún debe reservar 100 KiB");

  secondActive.status = "expired";
  secondActive.providerStep = "EXPIRED";
  resizeStateTo(twoActive, MAX_DEBT_CENTER_STATE_BYTES);
  assert.doesNotThrow(() => assertDebtCenterStateWithinLimits(twoActive), "terminalizar ambos debe recuperar los 900 KiB");
});

test("límites de estado, TTL y persistencia obligatoria fallan cerrado", async () => {
  const state = createDebtCenterSeed();
  state.collectionConfirmations = Array.from({ length: MAX_COLLECTION_CONFIRMATIONS + 1 }, (_, index) => ({
    id: `collection_limit_${index}`,
    commandId: `collection_share_cmd_${index.toString(16).padStart(32, "0")}`,
    debtId: state.debts[0].id,
    messageKind: "initial",
    confirmedByParticipantId: state.currentParticipantId,
    occurredAt: "2026-08-27T00:00:00.000Z",
  }));
  assert.throws(() => assertDebtCenterStateWithinLimits(state), /COLLECTION_CONFIRMATION_LIMIT_REACHED/);

  const repository = new MemoryDebtCenterRepository();
  const originalNow = Date.now;
  let now = Date.parse("2026-08-27T00:00:00.000Z");
  Date.now = () => now;
  try {
    const first = await repository.load("ttl_workspace");
    const token = first.state.debts[0].publicToken;
    assert.equal(await repository.findWorkspaceByPublicToken(token), "ttl_workspace");
    now += DEBT_CENTER_RETENTION_MS + 1;
    assert.equal(await repository.findWorkspaceByPublicToken(token), null);
    assert.notEqual((await repository.load("ttl_workspace")).state.debts[0].publicToken, token);
  } finally {
    Date.now = originalNow;
  }

  const previousRepository = globalThis.__yol1DebtCenterRepository;
  const previousNodeEnv = process.env.NODE_ENV;
  const previousDatabaseUrl = process.env.DATABASE_URL;
  try {
    globalThis.__yol1DebtCenterRepository = undefined;
    process.env.NODE_ENV = "production";
    delete process.env.DATABASE_URL;
    assert.throws(() => getDebtCenterRepository(), /DEBT_CENTER_DATABASE_REQUIRED/);
  } finally {
    globalThis.__yol1DebtCenterRepository = previousRepository;
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousNodeEnv;
    if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = previousDatabaseUrl;
  }

  const [repositorySource, limitsSource] = await Promise.all([
    source("lib/debt-center/state-repository.ts"),
    source("lib/debt-center/limits.ts"),
  ]);
  assert.match(repositorySource, /new Date\(now - DEBT_CENTER_RETENTION_MS\)/);
  assert.match(repositorySource, /DELETE FROM yol1_debt_center_states WHERE updated_at < \$1/);
  assert.match(repositorySource, /const cutoff = new Date\(Date\.now\(\) - DEBT_CENTER_RETENTION_MS\)/);
  assert.match(repositorySource, /AND updated_at >= \$2/);
  assert.match(limitsSource, new RegExp(`MAX_DEBT_CENTER_ACTIVITIES = ${MAX_DEBT_CENTER_ACTIVITIES}`));
  assert.match(limitsSource, /state\.activities = state\.activities\.slice\(0, MAX_DEBT_CENTER_ACTIVITIES\)/);
});
