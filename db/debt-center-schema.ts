import { index, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { DebtCenterState } from "../lib/debt-center/types";

export const debtCenterStates = pgTable(
  "yol1_debt_center_states",
  {
    workspaceId: text("workspace_id").primaryKey(),
    version: integer("version").notNull().default(1),
    payload: jsonb("payload").$type<DebtCenterState>().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("yol1_debt_center_states_updated_at_idx").on(table.updatedAt)],
);
