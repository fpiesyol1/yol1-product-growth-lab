import { neon } from "@neondatabase/serverless";
import type { ChatReviewRating, SharedFeedbackInput, SharedFeedbackItem, SharedFeedbackStatus } from "../feedback-types";

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
        CREATE TABLE IF NOT EXISTS yol1_feedback_items (
          id text PRIMARY KEY,
          session_hash text NOT NULL,
          source text NOT NULL CHECK (source IN ('feedback', 'chat')),
          screen text,
          kind text,
          message text,
          topics text,
          question text,
          answer text,
          rating text,
          knowledge_version text,
          prototype_version text NOT NULL DEFAULT 'lab-2026-08-13',
          status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'approve', 'wrong', 'discard')),
          review_note text NOT NULL DEFAULT '',
          created_at timestamptz NOT NULL DEFAULT now(),
          reviewed_at timestamptz
        )
      `);
      await sql.query(`CREATE INDEX IF NOT EXISTS yol1_feedback_created_at_idx ON yol1_feedback_items (created_at DESC)`);
      await sql.query(`CREATE INDEX IF NOT EXISTS yol1_feedback_session_idx ON yol1_feedback_items (session_hash, created_at DESC)`);
    })();
  }
  await schemaReady;
  return sql;
}

type FeedbackRow = {
  id: string;
  source: "feedback" | "chat";
  screen: string | null;
  kind: "like" | "improve" | "idea" | null;
  message: string | null;
  topics: string | null;
  question: string | null;
  answer: string | null;
  rating: ChatReviewRating | null;
  knowledge_version: string | null;
  status: SharedFeedbackStatus;
  review_note: string;
  created_at: string | Date;
  reviewed_at: string | Date | null;
};

function toItem(row: FeedbackRow): SharedFeedbackItem {
  if (row.source === "chat") {
    return {
      id: row.id,
      source: "chat",
      label: row.rating === "useful" ? "Marcada útil" : row.rating === "improve" ? "Marcada para mejorar" : "Respuesta de IA",
      context: `IA · ${row.knowledge_version || "sin versión"}`,
      title: row.question || "Pregunta sin texto",
      body: row.answer || "Respuesta sin texto",
      status: row.status,
      reviewNote: row.review_note,
      createdAt: new Date(row.created_at).toISOString(),
      reviewedAt: row.reviewed_at ? new Date(row.reviewed_at).toISOString() : null,
    };
  }
  return {
    id: row.id,
    source: "feedback",
    label: row.kind === "like" ? "Me gusta" : row.kind === "improve" ? "Mejoraría" : "Idea",
    context: row.screen || "Pantalla no indicada",
    title: row.message || "Feedback rápido sin comentario",
    body: row.topics ? `Temas: ${row.topics}` : "Sin temas adicionales.",
    status: row.status,
    reviewNote: row.review_note,
    createdAt: new Date(row.created_at).toISOString(),
    reviewedAt: row.reviewed_at ? new Date(row.reviewed_at).toISOString() : null,
  };
}

export function isFeedbackStorageConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export async function countRecentFeedback(sessionHash: string) {
  const sql = await ensureSchema();
  const rows = await sql`
    SELECT count(*)::int AS count
    FROM yol1_feedback_items
    WHERE session_hash = ${sessionHash}
      AND created_at > now() - interval '1 hour'
  ` as Array<{ count: number }>;
  return rows[0]?.count ?? 0;
}

export async function saveFeedback(input: SharedFeedbackInput, sessionHash: string) {
  const sql = await ensureSchema();
  const rows = await sql`
    INSERT INTO yol1_feedback_items (
      id, session_hash, source, screen, kind, message, topics,
      question, answer, rating, knowledge_version
    ) VALUES (
      ${input.idempotencyKey}, ${sessionHash}, ${input.source},
      ${input.screen || null}, ${input.kind || null}, ${input.message || null},
      ${input.topics || null}, ${input.question || null}, ${input.answer || null},
      ${input.rating || null}, ${input.knowledgeVersion || null}
    )
    ON CONFLICT (id) DO UPDATE SET
      rating = COALESCE(EXCLUDED.rating, yol1_feedback_items.rating),
      question = COALESCE(EXCLUDED.question, yol1_feedback_items.question),
      answer = COALESCE(EXCLUDED.answer, yol1_feedback_items.answer),
      knowledge_version = COALESCE(EXCLUDED.knowledge_version, yol1_feedback_items.knowledge_version)
    RETURNING id
  ` as Array<{ id: string }>;
  return rows[0]?.id || input.idempotencyKey;
}

export async function listFeedback() {
  const sql = await ensureSchema();
  const rows = await sql`
    SELECT id, source, screen, kind, message, topics, question, answer,
      rating, knowledge_version, status, review_note, created_at, reviewed_at
    FROM yol1_feedback_items
    ORDER BY created_at DESC
    LIMIT 200
  ` as FeedbackRow[];
  return rows.map(toItem);
}

export async function updateFeedback(id: string, status: SharedFeedbackStatus, reviewNote: string) {
  const sql = await ensureSchema();
  const rows = await sql`
    UPDATE yol1_feedback_items
    SET status = ${status}, review_note = ${reviewNote}, reviewed_at = now()
    WHERE id = ${id}
    RETURNING id
  ` as Array<{ id: string }>;
  return Boolean(rows[0]);
}
