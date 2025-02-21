import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

export interface AppBindings {
  DB: D1Database;
}

export interface Env {
  Bindings: AppBindings;
}

export type AppOpenApi = OpenAPIHono<{ Bindings: AppBindings }>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, Env>;
