import { spawnSync } from "node:child_process";

const environment = process.env.VERCEL_ENV?.trim();

if (environment !== "preview" && environment !== "production") {
  console.log("DEBT_CENTER_DEPLOYMENT_MIGRATION_SKIPPED");
  process.exit(0);
}

function fail(message) {
  console.error(`DEBT_CENTER_DEPLOYMENT_MIGRATION_BLOCKED: ${message}`);
  process.exit(1);
}

const targetEnvironment = process.env.VERCEL_TARGET_ENV?.trim();
const gitRef = process.env.VERCEL_GIT_COMMIT_REF?.trim();

if (environment === "preview") {
  if (process.env.ALLOW_PREVIEW_DB_MIGRATIONS !== "true") {
    fail("falta el opt-in exclusivo de Preview");
  }
  if (targetEnvironment !== "preview") fail("el target de Vercel no es Preview");
  if (gitRef === "main" || gitRef === "master") fail("main no puede migrar como Preview");
}

if (environment === "production") {
  if (process.env.ALLOW_PRODUCTION_DB_MIGRATIONS !== "true") {
    fail("falta el opt-in exclusivo de Producción");
  }
  if (targetEnvironment !== "production") fail("el target de Vercel no es Producción");
  if (gitRef !== "main" && gitRef !== "master") fail("sólo main puede ejecutar la migración de Producción");
  if (process.env.PRODUCTION_DB_MIGRATION_PLAN !== "debt-center-0000-0001") {
    fail("el plan aditivo de Producción no fue confirmado");
  }
}

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) fail("DATABASE_URL no está definida");

let parsedDatabaseUrl;
try {
  parsedDatabaseUrl = new URL(databaseUrl);
} catch {
  fail("DATABASE_URL no es una URL válida");
}

if (!/^postgres(ql)?:$/.test(parsedDatabaseUrl.protocol)) fail("la conexión no usa PostgreSQL");

const databaseHostname = parsedDatabaseUrl.hostname.toLowerCase();
if (!(databaseHostname === "neon.tech" || databaseHostname.endsWith(".neon.tech"))) {
  fail("la conexión no pertenece a Neon");
}

const packageManagerExecutable = process.env.npm_execpath;
if (!packageManagerExecutable) fail("no se pudo resolver el ejecutor de pnpm");

const migration = spawnSync(process.execPath, [packageManagerExecutable, "run", "db:migrate"], {
  env: process.env,
  stdio: "inherit",
});

if (migration.error) fail("no se pudo iniciar Drizzle");
if (migration.status !== 0) process.exit(migration.status ?? 1);

console.log(`DEBT_CENTER_${environment.toUpperCase()}_MIGRATION_OK`);
