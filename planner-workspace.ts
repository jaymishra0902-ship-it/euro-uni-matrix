import { jsonb, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const plannerWorkspaceTable = pgTable("planner_workspace", {
  userId: text("user_id").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type PlannerWorkspace = typeof plannerWorkspaceTable.$inferSelect;