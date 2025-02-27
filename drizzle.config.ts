import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  schema: "src/db/schema",
  out: "drizzle/migrations",
  // dbCredentials needs only for connect drizzle studio 🫠
  // dbCredentials: {
  //   accountId: "acc id token",
  //   databaseId: "db id to connect",
  //   token: "your access token from CF",
  // },
});
