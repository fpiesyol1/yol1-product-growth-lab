import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workspace = new URL("..", import.meta.url).pathname;
const script = new URL("../scripts/check-debt-center-release.mjs", import.meta.url).pathname;
const smokeScript = new URL("../scripts/smoke-debt-center-release.mjs", import.meta.url).pathname;
const previewMigrationScript = new URL("../scripts/migrate-debt-center-preview.mjs", import.meta.url).pathname;

function run(args = [], env = process.env) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: workspace,
    encoding: "utf8",
    env,
  });
}

test("release:check valida contratos locales sin conectarse a Neon ni Vercel", async () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /LOCAL_RELEASE_GATES_OK/);
  assert.match(result.stdout, /EXTERNAL_GATES_PENDING/);
  assert.match(result.stdout, /Deployment Protection/);
  assert.match(result.stdout, /db:migrate/);

  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(packageJson.scripts["release:check"], "node scripts/check-debt-center-release.mjs");
  assert.equal(packageJson.scripts["release:check:env"], "node scripts/check-debt-center-release.mjs --deployment-env");
  assert.equal(packageJson.scripts["release:smoke"], "node scripts/smoke-debt-center-release.mjs");
  assert.equal(packageJson.scripts["db:migrate:preview"], "node scripts/migrate-debt-center-preview.mjs");
});

test("migración de Preview omite producción y falla cerrada antes de abrir Neon", () => {
  const production = spawnSync(process.execPath, [previewMigrationScript], {
    cwd: workspace,
    encoding: "utf8",
    env: { ...process.env, VERCEL_ENV: "production" },
  });
  assert.equal(production.status, 0, production.stderr);
  assert.match(production.stdout, /PREVIEW_MIGRATION_SKIPPED/);

  const missingOptIn = spawnSync(process.execPath, [previewMigrationScript], {
    cwd: workspace,
    encoding: "utf8",
    env: { ...process.env, VERCEL_ENV: "preview", DATABASE_URL: "postgresql://user:secret@example.neon.tech/db" },
  });
  assert.equal(missingOptIn.status, 1);
  assert.match(missingOptIn.stderr, /PREVIEW_MIGRATION_BLOCKED/);
  assert.doesNotMatch(missingOptIn.stdout + missingOptIn.stderr, /secret/);

  const wrongProvider = spawnSync(process.execPath, [previewMigrationScript], {
    cwd: workspace,
    encoding: "utf8",
    env: {
      ...process.env,
      VERCEL_ENV: "preview",
      VERCEL_TARGET_ENV: "preview",
      ALLOW_PREVIEW_DB_MIGRATIONS: "true",
      DATABASE_URL: "postgresql://user:sentinel@database.invalid/db",
    },
  });
  assert.equal(wrongProvider.status, 1);
  assert.match(wrongProvider.stderr, /no pertenece a Neon/);
  assert.doesNotMatch(wrongProvider.stdout + wrongProvider.stderr, /sentinel/);
});

test("smoke documenta el bypass protegido sin imprimir ni persistir el secreto", () => {
  const result = spawnSync(process.execPath, [smokeScript, "--help"], {
    cwd: workspace,
    encoding: "utf8",
    env: { ...process.env, VERCEL_AUTOMATION_BYPASS_SECRET: "SENTINEL_BYPASS_SECRET" },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /VERCEL_AUTOMATION_BYPASS_SECRET/);
  assert.doesNotMatch(result.stdout + result.stderr, /SENTINEL_BYPASS_SECRET/);

  const source = readFile(new URL("../scripts/smoke-debt-center-release.mjs", import.meta.url), "utf8");
  return source.then((value) => {
    assert.match(value, /x-vercel-protection-bypass/);
    assert.match(value, /provider === "mock_floid"/);
    assert.match(value, /storage === "neon"/);
    assert.match(value, /outstandingAmount === 5_000/);
    assert.match(value, /FLOID_NETWORK_DISABLED/);
  });
});

test("smoke nunca envía el bypass a un hostname no autorizado", () => {
  const result = spawnSync(process.execPath, [smokeScript, "--base-url", "https://not-vercel.invalid"], {
    cwd: workspace,
    encoding: "utf8",
    env: { ...process.env, VERCEL_AUTOMATION_BYPASS_SECRET: "SENTINEL_BYPASS_SECRET" },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /host no autorizado/);
  assert.doesNotMatch(result.stdout + result.stderr, /SENTINEL_BYPASS_SECRET/);
});

test("gate de deployment falla cerrado sin nombres de entorno obligatorios", () => {
  const env = { ...process.env };
  delete env.DATABASE_URL;
  delete env.NEXT_PUBLIC_SITE_URL;
  delete env.DEBT_CENTER_SIMULATOR_ENABLED;
  const result = run(["--deployment-env"], env);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /RELEASE_GATES_FAILED/);
  assert.match(result.stderr, /DATABASE_URL/);
  assert.match(result.stderr, /NEXT_PUBLIC_SITE_URL/);
  assert.match(result.stderr, /DEBT_CENTER_SIMULATOR_ENABLED/);
});

test("gate de entorno sólo comprueba presencia y forma, nunca abre una conexión", () => {
  const result = run(["--deployment-env"], {
    ...process.env,
    DATABASE_URL: "postgresql://release-check.invalid/yol1",
    NEXT_PUBLIC_SITE_URL: "https://preview.yol1.example",
    DEBT_CENTER_SIMULATOR_ENABLED: "true",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /LOCAL_RELEASE_GATES_OK/);
  assert.doesNotMatch(result.stdout + result.stderr, /postgresql:\/\//);
});
