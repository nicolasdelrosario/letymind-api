import { createRouter } from "@/lib/create-app";

import * as handlers from "./seniorities.handlers";
import * as routes from "./seniorities.routes";

export const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.create, handlers.create)
  .openapi(routes.patch, handlers.patch)
  .openapi(routes.remove, handlers.remove);
