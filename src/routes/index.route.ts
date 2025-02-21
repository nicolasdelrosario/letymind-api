import { createRoute, z } from "@hono/zod-openapi";

import { createRouter } from "@/lib/create-app";

export const index = createRouter()
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      description: "Letymind API Index",
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: z.object({
                message: z.string(),
              }),
            },
          },
        },
      },
    }),
    (c) => {
      return c.json({
        message: "Letymind API",
      });
    },
  );
