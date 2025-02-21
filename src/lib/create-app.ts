import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";

import { notFound } from "@/middleware/not-found";
import { onError } from "@/middleware/on-error";
import { serveEmojiFavicon } from "@/middleware/serve-emoji-favicon";

import type { AppBindings } from "./types";

export function createRouter() {
  return new OpenAPIHono<{ Bindings: AppBindings }>({
    strict: false,
  });
}

export function createApp() {
  const app = createRouter();

  app.use(serveEmojiFavicon("🙂‍↔️"));
  app.use(logger());

  app.notFound(notFound);
  app.onError(onError);

  return app;
}
