import { configureOpenApi } from "@/lib/configure-open-api";
import { createApp } from "@/lib/create-app";
import { router as index } from "@/routes/index.route";
import { router as profiles } from "@/routes/profiles/profiles.index";

const app = createApp();

const routes = [
  index,
  profiles,
];

configureOpenApi(app);

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
