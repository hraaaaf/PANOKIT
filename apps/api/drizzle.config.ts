import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/j04.schema.ts",
  out: "./db/drizzle-generated",
  strict: true,
  verbose: false,
});
