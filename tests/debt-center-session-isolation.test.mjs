import test from "node:test";
import assert from "node:assert/strict";

import {
  assertSameOriginMutation,
  debtCenterSessionHeaders,
  getDebtCenterSession,
  readBoundedJson,
} from "../lib/debt-center/session.ts";
import { MemoryDebtCenterRepository, mutateDebtCenterStateByPublicToken } from "../lib/debt-center/state-repository.ts";
import { buildDashboard } from "../lib/debt-center/domain.ts";

test("la cookie demo es opaca, HttpOnly y se reutiliza sólo si cumple el contrato", () => {
  const created = getDebtCenterSession(new Request("https://lab.yol1.test/api/debt-center"));
  assert.match(created.id, /^[a-f0-9]{32}$/);
  assert.equal(created.isNew, true);
  const cookie = debtCenterSessionHeaders(created).get("set-cookie");
  assert.match(cookie ?? "", /HttpOnly/);
  assert.match(cookie ?? "", /SameSite=Lax/);

  const reused = getDebtCenterSession(new Request("https://lab.yol1.test/api/debt-center", {
    headers: { cookie: `yol1_cc_demo_session=${created.id}` },
  }));
  assert.deepEqual(reused, { id: created.id, isNew: false });

  const replaced = getDebtCenterSession(new Request("https://lab.yol1.test/api/debt-center", {
    headers: { cookie: "yol1_cc_demo_session=attacker-selected-workspace" },
  }));
  assert.notEqual(replaced.id, "attacker-selected-workspace");
  assert.equal(replaced.isNew, true);
});

test("las escrituras bloquean navegadores cross-origin y payloads mayores a 16 KiB", async () => {
  const crossOrigin = new Request("https://lab.yol1.test/api/debt-center", {
    method: "POST",
    headers: { origin: "https://evil.test", "sec-fetch-site": "cross-site" },
  });
  assert.throws(() => assertSameOriginMutation(crossOrigin), (error) => error?.code === "CROSS_ORIGIN_REQUEST" && error?.status === 403);

  const sameOrigin = new Request("https://lab.yol1.test/api/debt-center", {
    method: "POST",
    headers: { origin: "https://lab.yol1.test", "sec-fetch-site": "same-origin" },
  });
  assert.doesNotThrow(() => assertSameOriginMutation(sameOrigin));

  const oversized = new Request("https://lab.yol1.test/api/debt-center", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ value: "x".repeat(16_384) }),
  });
  await assert.rejects(() => readBoundedJson(oversized), (error) => error?.code === "REQUEST_TOO_LARGE" && error?.status === 413);
});

test("cada sesión conserva un ledger independiente y sus tokens públicos son únicos", async () => {
  const repository = new MemoryDebtCenterRepository();
  const first = await repository.load("session_a");
  const second = await repository.load("session_b");
  assert.notEqual(first.state.debts[0].publicToken, second.state.debts[0].publicToken);
  const dashboard = buildDashboard(first.state, "memory", "mock_floid");
  assert.equal(dashboard.debts[0].publicToken, first.state.debts[0].publicToken);
  assert.equal(await repository.findWorkspaceByPublicToken(dashboard.debts[0].publicToken), "session_a");

  first.state.groups[0].name = "Sólo sesión A";
  assert.equal(await repository.save("session_a", first.state, first.storageVersion), true);
  assert.notEqual((await repository.load("session_b")).state.groups[0].name, "Sólo sesión A");
  assert.equal(await repository.findWorkspaceByPublicToken(first.state.debts[0].publicToken), "session_a");
});

test("un token público resuelve y actualiza sólo el ledger dueño", async () => {
  const previous = globalThis.__yol1DebtCenterRepository;
  const repository = new MemoryDebtCenterRepository();
  globalThis.__yol1DebtCenterRepository = repository;
  try {
    const ownerBefore = await repository.load("session_owner");
    const otherBefore = await repository.load("session_payer");
    const debt = ownerBefore.state.debts.find((item) => item.originalAmount === 10_000);
    assert.ok(debt);
    await mutateDebtCenterStateByPublicToken(debt.publicToken, (state) => {
      const resolved = state.debts.find((item) => item.id === debt.id);
      assert.ok(resolved);
      resolved.status = "cancelled";
    });
    assert.equal((await repository.load("session_owner")).state.debts.find((item) => item.id === debt.id)?.status, "cancelled");
    assert.deepEqual((await repository.load("session_payer")).state, otherBefore.state);
  } finally {
    globalThis.__yol1DebtCenterRepository = previous;
  }
});
