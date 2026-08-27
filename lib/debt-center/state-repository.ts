import { randomUUID } from "node:crypto";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { debtCenterStates } from "../../db/debt-center-schema.ts";
import { createDebtCenterSeed } from "./seed.ts";
import { migrateDebtCenterState } from "./recurrence.ts";
import { debtCenterWorkspaceId } from "./session.ts";
import { assertDebtCenterStateWithinLimits, DEBT_CENTER_RETENTION_MS, prepareDebtCenterStateForStorage } from "./limits.ts";
import type { DebtCenterState } from "./types";

export type StoredDebtCenterState = { storageVersion: number; state: DebtCenterState };

export interface DebtCenterStateRepository {
  readonly isolationVersion: 1;
  readonly kind: "memory" | "neon";
  load(workspaceId: string): Promise<StoredDebtCenterState>;
  save(workspaceId: string, state: DebtCenterState, expectedStorageVersion: number): Promise<boolean>;
  reset(workspaceId: string): Promise<StoredDebtCenterState>;
  findWorkspaceByPublicToken(publicToken: string): Promise<string | null>;
}

type MemoryRecord = StoredDebtCenterState & { touchedAt: number };

const MAX_MEMORY_SESSIONS = 200;

function createIsolatedSeed() {
  const state = createDebtCenterSeed();
  state.generationId = randomUUID().replaceAll("-", "");
  for (const debt of state.debts) debt.publicToken = `pay_${randomUUID().replaceAll("-", "")}`;
  return state;
}

export class MemoryDebtCenterRepository implements DebtCenterStateRepository {
  readonly isolationVersion = 1 as const;
  readonly kind = "memory" as const;
  private readonly records = new Map<string, MemoryRecord>();

  private discardExpired() {
    const cutoff = Date.now() - DEBT_CENTER_RETENTION_MS;
    for (const [workspaceId, record] of this.records) {
      if (record.touchedAt < cutoff) this.records.delete(workspaceId);
    }
  }

  private record(workspaceId: string) {
    this.discardExpired();
    let record = this.records.get(workspaceId);
    if (!record) {
      if (this.records.size >= MAX_MEMORY_SESSIONS) {
        const oldest = [...this.records.entries()].sort((left, right) => left[1].touchedAt - right[1].touchedAt)[0]?.[0];
        if (oldest) this.records.delete(oldest);
      }
      record = { storageVersion: 1, state: createIsolatedSeed(), touchedAt: Date.now() };
      this.records.set(workspaceId, record);
    }
    record.touchedAt = Date.now();
    return record;
  }

  async load(workspaceId: string) {
    const record = this.record(workspaceId);
    return { storageVersion: record.storageVersion, state: structuredClone(record.state) };
  }

  async save(workspaceId: string, state: DebtCenterState, expectedStorageVersion: number) {
    this.discardExpired();
    const record = this.records.get(workspaceId);
    if (!record) return false;
    if (expectedStorageVersion !== record.storageVersion) return false;
    if (state.generationId !== record.state.generationId) return false;
    prepareDebtCenterStateForStorage(state);
    assertDebtCenterStateWithinLimits(state);
    record.state = structuredClone(state);
    record.storageVersion += 1;
    record.touchedAt = Date.now();
    return true;
  }

  async reset(workspaceId: string) {
    const record = this.record(workspaceId);
    record.state = createIsolatedSeed();
    record.storageVersion += 1;
    return this.load(workspaceId);
  }

  async findWorkspaceByPublicToken(publicToken: string) {
    this.discardExpired();
    const matches = [...this.records.entries()].filter(([, record]) => record.state.debts.some((debt) => debt.publicToken === publicToken));
    return matches.length === 1 ? matches[0][0] : null;
  }
}

class NeonDebtCenterRepository implements DebtCenterStateRepository {
  readonly isolationVersion = 1 as const;
  readonly kind = "neon" as const;
  private readonly sql;
  private readonly db;
  private ready: Promise<void> | null = null;
  private lastCleanupAt = 0;

  constructor(connectionString: string) {
    this.sql = neon(connectionString);
    this.db = drizzle(this.sql, { schema: { debtCenterStates } });
  }

  private async ensureReady() {
    if (!this.ready) {
      this.ready = (async () => {
        // Schema changes are deployment work, never a side effect of a visit.
        await this.sql.query(`SELECT 1 FROM yol1_debt_center_states LIMIT 0`);
      })();
    }
    return this.ready;
  }

  private async cleanupExpired() {
    const now = Date.now();
    if (now - this.lastCleanupAt < 15 * 60 * 1000) return;
    await this.sql.query(`DELETE FROM yol1_debt_center_states WHERE updated_at < $1`, [new Date(now - DEBT_CENTER_RETENTION_MS)]);
    this.lastCleanupAt = now;
  }

  private generationMatches(generationId: string) {
    return generationId === "legacy"
      ? sql`(${debtCenterStates.payload}->>'generationId' IS NULL OR ${debtCenterStates.payload}->>'generationId' = 'legacy')`
      : sql`${debtCenterStates.payload}->>'generationId' = ${generationId}`;
  }

  async load(workspaceId: string) {
    await this.ensureReady();
    await this.cleanupExpired();
    const now = new Date();
    const cutoff = new Date(now.getTime() - DEBT_CENTER_RETENTION_MS);
    let rows = await this.db.select().from(debtCenterStates).where(and(eq(debtCenterStates.workspaceId, workspaceId), gte(debtCenterStates.updatedAt, cutoff))).limit(1);
    if (!rows[0]) {
      await this.db.delete(debtCenterStates).where(and(eq(debtCenterStates.workspaceId, workspaceId), lt(debtCenterStates.updatedAt, cutoff)));
      await this.db.insert(debtCenterStates).values({ workspaceId, version: 1, payload: createIsolatedSeed() }).onConflictDoNothing();
      rows = await this.db.select().from(debtCenterStates).where(eq(debtCenterStates.workspaceId, workspaceId)).limit(1);
    }
    const row = rows[0];
    if (!row) throw new Error("DEBT_CENTER_STATE_NOT_FOUND");
    await this.db.update(debtCenterStates).set({ updatedAt: now }).where(and(eq(debtCenterStates.workspaceId, workspaceId), eq(debtCenterStates.version, row.version)));
    return { storageVersion: row.version, state: structuredClone(row.payload) };
  }

  async save(workspaceId: string, state: DebtCenterState, expectedStorageVersion: number) {
    await this.ensureReady();
    prepareDebtCenterStateForStorage(state);
    assertDebtCenterStateWithinLimits(state);
    const rows = await this.db.update(debtCenterStates)
      .set({ payload: state, version: expectedStorageVersion + 1, updatedAt: new Date() })
      .where(and(
        eq(debtCenterStates.workspaceId, workspaceId),
        eq(debtCenterStates.version, expectedStorageVersion),
        gte(debtCenterStates.updatedAt, new Date(Date.now() - DEBT_CENTER_RETENTION_MS)),
        this.generationMatches(state.generationId),
      ))
      .returning({ version: debtCenterStates.version });
    return rows.length === 1;
  }

  async reset(workspaceId: string) {
    await this.ensureReady();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const current = await this.load(workspaceId);
      const currentState = migrateDebtCenterState(current.state);
      const nextState = createIsolatedSeed();
      prepareDebtCenterStateForStorage(nextState);
      assertDebtCenterStateWithinLimits(nextState);
      const rows = await this.db.update(debtCenterStates)
        .set({ payload: nextState, version: current.storageVersion + 1, updatedAt: new Date() })
        .where(and(
          eq(debtCenterStates.workspaceId, workspaceId),
          eq(debtCenterStates.version, current.storageVersion),
          gte(debtCenterStates.updatedAt, new Date(Date.now() - DEBT_CENTER_RETENTION_MS)),
          this.generationMatches(currentState.generationId),
        ))
        .returning({ version: debtCenterStates.version });
      if (rows.length === 1) return this.load(workspaceId);
    }
    throw new Error("CONCURRENT_STATE_UPDATE");
  }

  async findWorkspaceByPublicToken(publicToken: string) {
    await this.ensureReady();
    await this.cleanupExpired();
    const cutoff = new Date(Date.now() - DEBT_CENTER_RETENTION_MS);
    const rows = await this.sql.query(
      `SELECT workspace_id FROM yol1_debt_center_states
       WHERE EXISTS (
         SELECT 1 FROM jsonb_array_elements(payload->'debts') AS debt
         WHERE debt->>'publicToken' = $1
       )
       AND updated_at >= $2
       LIMIT 2`,
      [publicToken, cutoff],
    ) as Array<{ workspace_id: string }>;
    return rows.length === 1 ? rows[0].workspace_id : null;
  }
}

declare global {
  var __yol1DebtCenterRepository: DebtCenterStateRepository | undefined;
}

export function getDebtCenterRepository() {
  if (!globalThis.__yol1DebtCenterRepository || globalThis.__yol1DebtCenterRepository.isolationVersion !== 1) {
    const connectionString = process.env.DATABASE_URL?.trim();
    if (!connectionString && process.env.NODE_ENV === "production") throw new Error("DEBT_CENTER_DATABASE_REQUIRED");
    globalThis.__yol1DebtCenterRepository = connectionString
      ? new NeonDebtCenterRepository(connectionString)
      : new MemoryDebtCenterRepository();
  }
  return globalThis.__yol1DebtCenterRepository;
}

export async function mutateDebtCenterState<T>(workspaceId: string, mutation: (state: DebtCenterState) => Promise<T> | T) {
  const repository = getDebtCenterRepository();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const stored = await repository.load(workspaceId);
    const draft = migrateDebtCenterState(stored.state);
    const result = await mutation(draft);
    if (await repository.save(workspaceId, draft, stored.storageVersion)) return { result, state: draft, storage: repository.kind };
  }
  throw new Error("CONCURRENT_STATE_UPDATE");
}

export async function mutateDebtCenterStateByPublicToken<T>(publicToken: string, mutation: (state: DebtCenterState) => Promise<T> | T) {
  if (!/^pay_[a-zA-Z0-9_]{8,96}$/.test(publicToken)) throw new Error("DEBT_NOT_FOUND");
  const repository = getDebtCenterRepository();
  const workspaceId = await repository.findWorkspaceByPublicToken(publicToken);
  if (!workspaceId) throw new Error("DEBT_NOT_FOUND");
  return mutateDebtCenterState(workspaceId, mutation);
}

export async function loadDebtCenterStateForSession(sessionId: string) {
  const stored = await getDebtCenterRepository().load(debtCenterWorkspaceId(sessionId));
  return { ...stored, state: migrateDebtCenterState(stored.state) };
}

export async function loadDebtCenterStateByPublicToken(publicToken: string) {
  if (!/^pay_[a-zA-Z0-9_]{8,96}$/.test(publicToken)) return null;
  const repository = getDebtCenterRepository();
  const workspaceId = await repository.findWorkspaceByPublicToken(publicToken);
  if (!workspaceId) return null;
  const stored = await repository.load(workspaceId);
  return { ...stored, state: migrateDebtCenterState(stored.state) };
}

export async function resetDebtCenterStateForSession(sessionId: string) {
  return getDebtCenterRepository().reset(debtCenterWorkspaceId(sessionId));
}
