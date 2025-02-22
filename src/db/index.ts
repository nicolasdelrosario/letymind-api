import type { DrizzleD1Database } from "drizzle-orm/d1";

import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export type Database = DrizzleD1Database<typeof schema>;
export type Tables = typeof schema;

// Initialize database with D1 instance
export function createDB(d1: D1Database): Database {
  return drizzle(d1, { schema });
}

// Export all schemas
export { schema };
