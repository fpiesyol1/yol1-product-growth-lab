import { spawnSync } from "node:child_process";

const environment = process.env.VERCEL_ENV?.trim();

if (environment !== "preview") {
  console.log("DEBT_CENTER_PREVIEW_MIGRATION_SKIPPED");
  process.exit(0);
}

function fail(message) {
  console.error(`DEBT_CENTER_PREVIEW_MIGRATION_BLOCKED: ${message}`);
  process.exit(1);
}

if (process.env.ALLOW_PREVIEW_DB_MIGRATIONS !== "true") {
  fail("falta el opt-in exclusivo de Preview");
}

if (process.env.VERCEL_TARGET_ENV !== "preview") {
  fail("el target de Vercel no es Preview");
}

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) fail("DATABASE_URL no está definida");

let parsedDatabaseUrl;
try {
  parsedDatabaseUrl = new URL(databaseUrl);
} catch {
  fail("DATABASE_URL no es una URL válida");
}

if (!/^postgres(ql)?:$/.test(parsedDatabaseUrl.protocol)) {
  fail("la conexión no usa PostgreSQL");
}

const databaseHostname = parsedDatabaseUrl.hostname.toLowerCase();
if (!(databaseHostname === "neon.tech" || databaseHostname.endsWith(".neon.tech"))) {
  fail("la conexión no pertenece a Neon");
}

const gitRef = process.env.VERCEL_GIT_COMMIT_REF?.trim();
if (gitRef === "main" || gitRef === "master") {
  fail("la rama de producción no puede migrar como Preview");
}

const packageManagerExecutable = process.env.npm_execpath;
if (!packageManagerExecutable) fail("no se pudo resolver el ejecutor de pnpm");

const migration = spawnSync(process.execPath, [packageManagerExecutable, "run", "db:migrate"], {
  env: process.env,
  stdio: "inherit",
});

if (migration.error) fail("no se pudo iniciar Drizzle");
if (migration.status !== 0) process.exit(migration.status ?? 1);

console.log("DEBT_CENTER_PREVIEW_MIGRATION_OK");
