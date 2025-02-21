import type { AppOpenApi } from "./types";

import packageJSON from "../../package.json";

export function configureOpenApi(app: AppOpenApi) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: packageJSON.name,
    },
  });
}
