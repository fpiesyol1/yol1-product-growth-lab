import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle/debt-center",
  schema: "./db/debt-center-schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/placeholder" },
});
