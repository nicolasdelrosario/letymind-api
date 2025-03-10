import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const seniorities = sqliteTable("seniorities", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const selectedSenioritiesSchema = createSelectSchema(seniorities).extend({
  description: z.string().nullable(),
});

export const insertSenioritySchema = createInsertSchema(seniorities).extend({
  name: z.string().min(2),
  description: z.string().min(10).max(500).optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchSenioritySchema = insertSenioritySchema.partial();
