import type { OpenAPIHono } from "@hono/zod-openapi";

export interface AppBindings {
  DB: D1Database;
}

export type AppOpenApi = OpenAPIHono<{ Bindings: AppBindings }>;
