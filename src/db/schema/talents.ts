import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/db/schema/users";

export const talents = sqliteTable("talents", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  bio: text("bio"),
  ruc: text("ruc"),
  skills: text("skills"),
  portfolioUrl: text("portfolio_url"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const selectedTalentsSchema = createSelectSchema(talents).extend({
  bio: z.string().nullable(),
  ruc: z.string().nullable(),
  skills: z.string().nullable(),
  portfolioUrl: z.string().nullable(),
});

export const insertTalentSchema = createInsertSchema(talents).extend({
  userId: z.number(),
  bio: z.string().optional(),
  ruc: z.string().optional(),
  skills: z.string().optional(),
  portfolioUrl: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchTalentSchema = insertTalentSchema.partial();
