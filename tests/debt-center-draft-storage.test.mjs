import test from "node:test";
import assert from "node:assert/strict";

import { createExpenseDraftId, loadExpenseDraft, removeExpenseDraft, saveExpenseDraft } from "../lib/debt-center/draft-storage.ts";

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
  return values;
}

test("un borrador válido conserva el gasto sin incluir semántica en su id", () => {
  installSessionStorage();
  const draftId = createExpenseDraftId();
  assert.match(draftId, /^draft_[a-f0-9]{32}$/);
  saveExpenseDraft(draftId, {
    title: "Cena de prueba",
    amountText: "12000",
    groupId: "group_trip",
    paidBy: "person_felipe",
    participantIds: ["person_felipe", "person_nico"],
    splitMode: "equal",
    amounts: {},
    receiptName: "",
  });
  const result = loadExpenseDraft(draftId);
  assert.equal(result?.title, "Cena de prueba");
  assert.equal(result?.amountText, "12000");
  removeExpenseDraft(draftId);
  assert.equal(loadExpenseDraft(draftId), null);
});

test("un borrador futuro, corrupto o con pagador ajeno se elimina", () => {
  const values = installSessionStorage();
  const draftId = "draft_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const key = `yol1-clear-accounts-draft:${draftId}`;
  values.set(key, JSON.stringify({
    schemaVersion: "expense-draft-1",
    createdAt: new Date(Date.now() + 60_000).toISOString(),
    title: "Cena",
    amountText: "10000",
    groupId: "group_trip",
    paidBy: "person_intruso",
    participantIds: ["person_felipe", "person_nico"],
    splitMode: "equal",
    amounts: {},
    receiptName: "",
  }));
  assert.equal(loadExpenseDraft(draftId), null);
  assert.equal(values.has(key), false);

  values.set(key, "{no-es-json");
  assert.equal(loadExpenseDraft(draftId), null);
  assert.equal(values.has(key), false);
});

test("borrador V2 conserva percentage y shares con ceros individuales", () => {
  const cases = [
    { id: "draft_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", mode: "percentage", values: { person_felipe: 0, person_nico: 10_000 } },
    { id: "draft_cccccccccccccccccccccccccccccccc", mode: "shares", values: { person_felipe: 0, person_nico: 2 } },
  ];

  for (const item of cases) {
    const storage = installSessionStorage();
    saveExpenseDraft(item.id, {
      title: `Gasto ${item.mode}`,
      amountText: "10000",
      groupId: "group_trip",
      paidBy: "person_felipe",
      participantIds: ["person_felipe", "person_nico"],
      splitMode: item.mode,
      splitValues: item.values,
      receiptName: "",
    });
    const raw = JSON.parse(storage.get(`yol1-clear-accounts-draft:${item.id}`));
    assert.equal(raw.schemaVersion, "expense-draft-2");
    assert.deepEqual(raw.splitValues, item.values);
    const restored = loadExpenseDraft(item.id);
    assert.equal(restored?.splitMode, item.mode);
    assert.deepEqual(restored?.amounts, item.values);
  }
});

test("borrador V2 rechaza percentage y shares cuando todos los valores son cero", () => {
  for (const [index, mode] of ["percentage", "shares"].entries()) {
    const storage = installSessionStorage();
    const draftId = `draft_${String(index + 1).repeat(32)}`;
    const key = `yol1-clear-accounts-draft:${draftId}`;
    saveExpenseDraft(draftId, {
      title: "Gasto sin distribución",
      amountText: "10000",
      groupId: "group_trip",
      paidBy: "person_felipe",
      participantIds: ["person_felipe", "person_nico"],
      splitMode: mode,
      splitValues: { person_felipe: 0, person_nico: 0 },
      receiptName: "",
    });
    assert.equal(loadExpenseDraft(draftId), null);
    assert.equal(storage.has(key), false);
  }
});
