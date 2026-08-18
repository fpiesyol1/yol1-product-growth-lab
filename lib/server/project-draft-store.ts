import { createHash, randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import type { ProjectDraftInput, SharedProjectDraft } from "../project-draft-types";

let schemaReady: Promise<void> | null = null;

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  return neon(connectionString);
}

async function ensureSchema() {
  const sql = getSql();
  if (!sql) throw new Error("STORAGE_NOT_CONFIGURED");
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql.query(`
        CREATE TABLE IF NOT EXISTS yol1_project_drafts (
          id text PRIMARY KEY,
          idempotency_hash text NOT NULL UNIQUE,
          creator_hash text NOT NULL,
          title text NOT NULL,
          idea text NOT NULL,
          problem text NOT NULL,
          audience text NOT NULL,
          value_proposition text NOT NULL,
          assumptions jsonb NOT NULL DEFAULT '[]'::jsonb,
          open_questions jsonb NOT NULL DEFAULT '[]'::jsonb,
          reference_links jsonb NOT NULL DEFAULT '[]'::jsonb,
          prototype_url text NOT NULL DEFAULT '',
          product_sheet jsonb NOT NULL DEFAULT '{}'::jsonb,
          status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft')),
          review_status text NOT NULL DEFAULT 'new' CHECK (review_status IN ('new', 'reviewing', 'later', 'resolved', 'learning_ready', 'ignored')),
          review_note text NOT NULL DEFAULT '',
          created_at timestamptz NOT NULL DEFAULT now(),
          expires_at timestamptz NOT NULL DEFAULT (now() + interval '90 days')
        )
      `);
      await sql.query(`ALTER TABLE yol1_project_drafts ADD COLUMN IF NOT EXISTS product_sheet jsonb NOT NULL DEFAULT '{}'::jsonb`);
      await sql.query(`ALTER TABLE yol1_project_drafts ADD COLUMN IF NOT EXISTS prototype_url text NOT NULL DEFAULT ''`);
      await sql.query(`ALTER TABLE yol1_project_drafts ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'new'`);
      await sql.query(`ALTER TABLE yol1_project_drafts ADD COLUMN IF NOT EXISTS review_note text NOT NULL DEFAULT ''`);
      await sql.query(`CREATE INDEX IF NOT EXISTS yol1_project_drafts_creator_idx ON yol1_project_drafts (creator_hash, created_at DESC)`);
    })();
  }
  await schemaReady;
  return sql;
}

type ProjectDraftRow = {
  id: string;
  title: string;
  idea: string;
  problem: string;
  audience: string;
  value_proposition: string;
  assumptions: unknown;
  open_questions: unknown;
  reference_links: unknown;
  prototype_url: string;
  product_sheet: unknown;
  status: "draft";
  review_status: SharedProjectDraft["reviewStatus"];
  review_note: string;
  created_at: string | Date;
  expires_at: string | Date;
};

function stringList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function productSheet(value: unknown): ProjectDraftInput["productSheet"] {
  const sheet = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    knownFacts: stringList(sheet.known_facts),
    userContributions: stringList(sheet.user_contributions),
    dataNeeds: stringList(sheet.data_needs),
    keyConditions: stringList(sheet.key_conditions),
    technologyFit: stringList(sheet.technology_fit),
    continuityLinks: stringList(sheet.continuity_links),
    pendingDecisions: stringList(sheet.pending_decisions),
  };
}

function toDraft(row: ProjectDraftRow): SharedProjectDraft {
  return {
    id: row.id,
    title: row.title,
    idea: row.idea,
    problem: row.problem,
    audience: row.audience,
    valueProposition: row.value_proposition,
    assumptions: stringList(row.assumptions),
    openQuestions: stringList(row.open_questions),
    references: stringList(row.reference_links),
    prototypeUrl: typeof row.prototype_url === "string" ? row.prototype_url : "",
    productSheet: productSheet(row.product_sheet),
    status: row.status,
    reviewStatus: row.review_status ?? "new",
    reviewNote: row.review_note ?? "",
    createdAt: new Date(row.created_at).toISOString(),
    expiresAt: new Date(row.expires_at).toISOString(),
  };
}

export function isProjectDraftStorageConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function projectCreatorHash(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const agent = request.headers.get("user-agent") || "unknown";
  const salt = process.env.YOL1_PROJECT_HASH_SALT || "yol1-project-pilot";
  return createHash("sha256").update(`${salt}:${forwarded}:${agent}`).digest("hex");
}

export async function countRecentProjectDrafts(creatorHash: string) {
  const sql = await ensureSchema();
  const rows = await sql`
    SELECT count(*)::int AS count
    FROM yol1_project_drafts
    WHERE creator_hash = ${creatorHash}
      AND created_at > now() - interval '1 hour'
  ` as Array<{ count: number }>;
  return rows[0]?.count ?? 0;
}

function idempotencyHash(submissionId: string, creatorHash: string) {
  return createHash("sha256").update(`${creatorHash}:${submissionId}`).digest("hex");
}

export async function findProjectDraftBySubmission(submissionId: string, creatorHash: string) {
  const sql = await ensureSchema();
  const hash = idempotencyHash(submissionId, creatorHash);
  const rows = await sql`
    SELECT id, title, idea, problem, audience, value_proposition,
      assumptions, open_questions, reference_links, prototype_url, product_sheet, status, review_status, review_note, created_at, expires_at
    FROM yol1_project_drafts
    WHERE idempotency_hash = ${hash} AND expires_at > now()
    LIMIT 1
  ` as ProjectDraftRow[];
  return rows[0] ? toDraft(rows[0]) : null;
}

export async function saveProjectDraft(input: ProjectDraftInput, creatorHash: string) {
  const sql = await ensureSchema();
  const submissionHash = idempotencyHash(input.submissionId, creatorHash);
  const id = `prj_${randomBytes(16).toString("hex")}`;
  const rows = await sql`
    INSERT INTO yol1_project_drafts (
      id, idempotency_hash, creator_hash, title, idea, problem, audience,
      value_proposition, assumptions, open_questions, reference_links, prototype_url, product_sheet
    ) VALUES (
      ${id}, ${submissionHash}, ${creatorHash}, ${input.title}, ${input.idea},
      ${input.problem}, ${input.audience}, ${input.valueProposition},
      ${JSON.stringify(input.assumptions)}::jsonb, ${JSON.stringify(input.openQuestions)}::jsonb,
      ${JSON.stringify(input.references)}::jsonb, ${input.prototypeUrl}, ${JSON.stringify({
        known_facts: input.productSheet.knownFacts,
        user_contributions: input.productSheet.userContributions,
        data_needs: input.productSheet.dataNeeds,
        key_conditions: input.productSheet.keyConditions,
        technology_fit: input.productSheet.technologyFit,
        continuity_links: input.productSheet.continuityLinks,
        pending_decisions: input.productSheet.pendingDecisions,
      })}::jsonb
    )
    ON CONFLICT (idempotency_hash) DO UPDATE
      SET idempotency_hash = EXCLUDED.idempotency_hash
    RETURNING id, title, idea, problem, audience, value_proposition,
      assumptions, open_questions, reference_links, prototype_url, product_sheet, status, review_status, review_note, created_at, expires_at
  ` as ProjectDraftRow[];
  return toDraft(rows[0]);
}

export async function getProjectDraft(id: string) {
  const sql = await ensureSchema();
  const rows = await sql`
    SELECT id, title, idea, problem, audience, value_proposition,
      assumptions, open_questions, reference_links, prototype_url, product_sheet, status, review_status, review_note, created_at, expires_at
    FROM yol1_project_drafts
    WHERE id = ${id} AND expires_at > now()
    LIMIT 1
  ` as ProjectDraftRow[];
  return rows[0] ? toDraft(rows[0]) : null;
}

export async function listProjectDrafts() {
  const sql = await ensureSchema();
  const rows = await sql`
    SELECT id, title, idea, problem, audience, value_proposition,
      assumptions, open_questions, reference_links, prototype_url, product_sheet, status, review_status, review_note, created_at, expires_at
    FROM yol1_project_drafts
    WHERE expires_at > now()
    ORDER BY created_at DESC
    LIMIT 100
  ` as ProjectDraftRow[];
  return rows.map(toDraft);
}

export async function updateProjectDraftReview(id: string, reviewStatus: SharedProjectDraft["reviewStatus"], reviewNote: string) {
  const sql = await ensureSchema();
  const rows = await sql`
    UPDATE yol1_project_drafts
    SET review_status = ${reviewStatus}, review_note = ${reviewNote}
    WHERE id = ${id} AND expires_at > now()
    RETURNING id, title, idea, problem, audience, value_proposition,
      assumptions, open_questions, reference_links, product_sheet, status, review_status, review_note, created_at, expires_at
  ` as ProjectDraftRow[];
  return rows[0] ? toDraft(rows[0]) : null;
}
