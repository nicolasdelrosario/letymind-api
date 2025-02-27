import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const workspaces = sqliteTable("workspaces", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const selectedWorkspacesSchema = createSelectSchema(workspaces).extend({
  description: z.string().nullable(),
});

export const insertWorkspaceSchema = createInsertSchema(workspaces).extend({
  slug: z.string().min(2),
  name: z.string().min(2),
  description: z.string().min(10).max(500).optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
});

export const patchWorkspaceSchema = insertWorkspaceSchema.partial();
