import { existsSync, readFileSync, readdirSync } from "node:fs";
import process from "node:process";
import { resolve } from "node:path";

const root = process.cwd();
const failures = [];
const checks = [];

function read(relativePath) {
  const absolutePath = resolve(root, relativePath);
  if (!existsSync(absolutePath)) {
    failures.push(`Falta ${relativePath}.`);
    return "";
  }
  return readFileSync(absolutePath, "utf8");
}

function check(label, condition, failure) {
  if (condition) checks.push(label);
  else failures.push(failure);
}

function requiredDeploymentEnvironment() {
  const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  check("DATABASE_URL presente", databaseUrl.length > 0, "DATABASE_URL no está definido para este deployment.");
  check("simulador habilitado explícitamente", process.env.DEBT_CENTER_SIMULATOR_ENABLED === "true", "DEBT_CENTER_SIMULATOR_ENABLED debe ser exactamente true.");
  let validSiteUrl = false;
  try {
    const parsed = new URL(siteUrl);
    validSiteUrl = parsed.protocol === "https:" && !["localhost", "127.0.0.1"].includes(parsed.hostname);
  } catch {
    validSiteUrl = false;
  }
  check("NEXT_PUBLIC_SITE_URL es HTTPS público", validSiteUrl, "NEXT_PUBLIC_SITE_URL debe ser una URL HTTPS exacta y no local.");
}

const packageJsonSource = read("package.json");
const packageJson = packageJsonSource ? JSON.parse(packageJsonSource) : { scripts: {}, engines: {} };
check("Node mínimo declarado", /^>=22\.13\.0$/.test(packageJson.engines?.node ?? ""), "package.json debe mantener Node >=22.13.0.");
check("migración explícita declarada", packageJson.scripts?.["db:migrate"] === "drizzle-kit migrate --config=drizzle.debt-center.config.ts", "El script db:migrate debe usar drizzle.debt-center.config.ts.");

const migrationDirectory = resolve(root, "drizzle/debt-center");
const migrationFiles = existsSync(migrationDirectory)
  ? readdirSync(migrationDirectory).filter((file) => /^\d{4}_.+\.sql$/.test(file)).sort()
  : [];
const journalSource = read("drizzle/debt-center/meta/_journal.json");
const journal = journalSource ? JSON.parse(journalSource) : { entries: [] };
const journalEntries = journal.entries ?? [];
const journalFiles = journalEntries.map((entry) => `${entry.tag}.sql`);
const journalOrderIsValid = journalEntries.every((entry, index) => entry.idx === index && entry.tag.startsWith(`${String(index).padStart(4, "0")}_`));
check("migraciones y journal alineados", migrationFiles.length > 0 && journalOrderIsValid && JSON.stringify(migrationFiles) === JSON.stringify(journalFiles), "Las migraciones SQL de Cuentas Claras no coinciden con su journal Drizzle.");

const schema = read("db/debt-center-schema.ts");
check("esquema durable versionado", schema.includes('"yol1_debt_center_states"') && schema.includes('index("yol1_debt_center_states_updated_at_idx")'), "El esquema durable o su índice TTL no están declarados.");

const repository = read("lib/debt-center/state-repository.ts");
check("producción falla cerrada sin Neon", repository.includes('if (!connectionString && process.env.NODE_ENV === "production") throw new Error("DEBT_CENTER_DATABASE_REQUIRED")'), "El repositorio debe fallar cerrado en producción sin DATABASE_URL.");
check("visitas no ejecutan DDL", !/CREATE\s+TABLE|ALTER\s+TABLE/i.test(repository), "El repositorio no puede crear o alterar tablas durante una visita.");

const providerFactory = read("lib/debt-center/floid-provider.ts");
const providerImplementation = read("lib/debt-center/mock-floid-provider.ts");
const debtCenterRuntime = existsSync(resolve(root, "lib/debt-center"))
  ? readdirSync(resolve(root, "lib/debt-center"), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
      .map((entry) => read(`lib/debt-center/${entry.name}`))
      .join("\n")
  : "";
check("Floid fijo en mock", providerFactory.includes("return new MockFloidPaymentProvider()") && !/process\.env|fetch\s*\(/.test(providerFactory + providerImplementation), "El factory Floid debe permanecer fijo al mock y sin red/configuración dinámica.");
check("dominio financiero sin red", !/\bfetch\s*\(/.test(debtCenterRuntime), "lib/debt-center no puede hacer llamadas fetch.");

const mainRoute = read("app/api/debt-center/route.ts");
const publicRoute = read("app/api/debt-center/public/[token]/route.ts");
const simulateRoute = read("app/api/debt-center/attempts/[attemptId]/simulate/route.ts");
const webhookRoute = read("app/api/debt-center/webhooks/floid/route.ts");
check("mutaciones same-origin y acotadas", mainRoute.includes("assertSameOriginMutation(request)") && mainRoute.includes("readBoundedJson(request)") && publicRoute.includes("assertSameOriginMutation(request)") && publicRoute.includes("readBoundedJson(request)") && simulateRoute.includes("assertSameOriginMutation(request)") && simulateRoute.includes("readBoundedJson(request)"), "Todas las mutaciones deben validar origen y body acotado.");
check("webhook real cerrado", webhookRoute.includes('error: "FLOID_NETWORK_DISABLED"') && webhookRoute.includes("status: 410"), "El webhook Floid debe responder 410/FLOID_NETWORK_DISABLED.");
check("rutas financieras no cacheables", [mainRoute, publicRoute, simulateRoute, webhookRoute].every((source) => source.includes("noStoreHeaders")), "Las rutas financieras deben usar noStoreHeaders.");

const envExample = read(".env.example");
check("contrato de entorno documentado", ["DATABASE_URL=", "NEXT_PUBLIC_SITE_URL=", "DEBT_CENTER_SIMULATOR_ENABLED=false"].every((entry) => envExample.includes(entry)), ".env.example debe documentar Neon, el origen exacto y el opt-in del simulador.");

if (process.argv.includes("--deployment-env")) requiredDeploymentEnvironment();

if (failures.length > 0) {
  console.error("RELEASE_GATES_FAILED");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`LOCAL_RELEASE_GATES_OK (${checks.length})`);
  console.log("EXTERNAL_GATES_PENDING");
  console.log("- Confirmar Vercel Deployment Protection en el dashboard.");
  console.log("- Confirmar Neon provisionado y ejecutar pnpm run db:migrate contra ese entorno.");
  console.log("- Confirmar protección de abuso antes de abrir rutas públicas.");
  console.log("- Ejecutar el smoke HTTP y funcional contra el deployment real.");
}
