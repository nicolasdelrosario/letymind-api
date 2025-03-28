import { createRoute } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/constants/http-status-codes";
import { jsonContent } from "@/helpers/json-content";
import { createRouter } from "@/lib/create-app";
import { createMessageObjectSchema } from "@/schemas/create-message-object";

export const tags = ["Index"];

export const router = createRouter()
  .openapi(
    createRoute({
      method: "get",
      path: "/",
      tags,
      responses: {
        [HttpStatusCodes.OK]: jsonContent(
          createMessageObjectSchema("Tasks API"),
          "Letymind API Index",
        ),
      },
    }),
    (c) => {
      return c.json({
        message: "Letymind API",
      }, HttpStatusCodes.OK);
    },
  );
