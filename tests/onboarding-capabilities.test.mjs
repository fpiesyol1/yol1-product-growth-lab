import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const matrix = async () => JSON.parse(await readFile(new URL("lib/onboarding-capabilities.json", root), "utf8"));
const page = async () => readFile(new URL("app/page.tsx", root), "utf8");

test("la matriz de onboarding conserva los guardrails canónicos", async () => {
  const contract = await matrix();
  const keys = contract.capabilities.map((capability) => capability.capability_key);

  assert.equal(contract.authority_source, "DIRECCION-PRODUCTOS-FELIPE.md");
  assert.equal(contract.demo_only, true);
  assert.equal(contract.external_service_connections, false);
  assert.equal(contract.defaults.unknown_provider_state_fallback, "review");
  assert.equal(contract.defaults.capability_inference_allowed, false);
  assert.equal(contract.defaults.preregistration_trigger, "material_action_selected");
  assert.equal(contract.defaults.recovery_preserves_capability_intent, true);
  assert.equal(contract.defaults.customer_success_owner, "to_validate");
  assert.equal(contract.defaults.otp_confirms, "channel_control_only");
  assert.equal(new Set(keys).size, keys.length, "capability_key debe ser único");
});

test("guardar localmente nunca gatilla pre-registro ni KYC", async () => {
  const contract = await matrix();
  const save = contract.capabilities.find((capability) => capability.capability_key === "save_recommendation_local");

  assert.ok(save);
  assert.equal(save.materiality, "non_material");
  assert.equal(save.preregistration_required, false);
  assert.equal(save.identity_level_required, "none");
  assert.doesNotMatch(save.demo_requirements.join(" "), /otp|kyc|rut|serial|biometr/i);
});

test("cada acción material explica requisitos antes del OTP", async () => {
  const contract = await matrix();
  const material = contract.capabilities.filter((capability) => capability.materiality !== "non_material");

  assert.ok(material.length >= 3);
  for (const capability of material) {
    assert.equal(capability.preregistration_required, true, capability.capability_key);
    assert.ok(capability.demo_requirements.includes("material_action_selected"), capability.capability_key);
    assert.ok(
      capability.demo_requirements.some((requirement) => requirement.includes("explained")),
      `${capability.capability_key} debe explicar requisitos antes de OTP`,
    );
    assert.ok(capability.demo_requirements.includes("channel_otp_simulated"), capability.capability_key);
  }
});

test("KYC no habilita capacidades por inferencia", async () => {
  const contract = await matrix();
  assert.equal(contract.defaults.capability_inference_allowed, false);

  for (const capability of contract.capabilities.filter((item) => item.materiality === "financial_effect")) {
    assert.equal(capability.availability_state, "not_available");
    assert.match(capability.identity_level_required, /policy_if_approved/);
    assert.ok(capability.forbidden_claims.some((claim) => /KYC aprobado/i.test(claim)));
  }
});

test("la UI deja claro que OTP controla acceso antes de elegir una ruta material", async () => {
  const source = await page();
  assert.ok(source.indexOf("¿Cómo quieres entrar?") < source.indexOf("¿Por dónde partimos?"));
  assert.match(source, /data-event-id="material_action_selected" data-capability-key="financial_data_connect"/);
  assert.match(source, /data-event-id="material_action_selected" data-capability-key="receive_value"/);
  assert.doesNotMatch(source, /Quiero activar una función/);
  assert.match(source, /Confirma que controlas este canal/);
  assert.doesNotMatch(source, /Confirma que eres tú/);
});

test("Mi banco KYC explica requisitos sin capturar PII", async () => {
  const source = await page();
  const portfolio = await readFile(new URL("lib/product-portfolio.ts", root), "utf8");
  const mvp = await readFile(new URL("MVP-SPEC.md", root), "utf8");
  const section = source.split("function MyBank")[1]?.split("function ProfileMenu")[0] ?? "";
  assert.match(section, /POR VALIDAR/);
  assert.match(section, /no corresponde pedir más datos/i);
  assert.doesNotMatch(section, /setRut|setSerial|placeholder="12\.345|Continuar a biometría/);
  assert.match(source, /Accesos y permisos/);
  assert.doesNotMatch(source, /Completa tu información/);
  assert.match(portfolio, /event: "onboarding_started"/);
  assert.match(portfolio, /event: "kyc_requirements_viewed"/);
  assert.doesNotMatch(portfolio, /app móvil \(decisión de equipo\)/);
  assert.doesNotMatch(portfolio, /La pantalla solicita RUT \+ número de serie/);
  assert.match(mvp, /sin pedir RUT, número de serie, biometría ni documentos en esta demo/);
  assert.doesNotMatch(mvp, /activar una función personal, pide RUT \+ número de serie/);
});

test("la recuperación OTP conserva intención y no conecta servicios", async () => {
  const source = await page();
  const section = source.split("function OnboardingFlow")[1]?.split("function MyBank")[0] ?? "";

  assert.match(section, /data-state="otp_expired"/);
  assert.match(section, /data-state="rate_limited"/);
  assert.match(section, /data-state="contact_exists"/);
  assert.match(section, /data-state="support_required"/);
  assert.match(section, /La intención seleccionada no se pierde/);
  assert.match(section, /Customer Success · demo/);
  assert.doesNotMatch(section, /fetch\(|axios|XMLHttpRequest|sendBeacon/);
});

test("E2 distingue pre-registro de identidad y capacidades de dinero", async () => {
  const source = await page();
  const section = source.split("function OnboardingFlow")[1]?.split("function MyBank")[0] ?? "";

  assert.match(section, /¿Qué habilitó este paso\?/);
  assert.match(section, /Un pre-registro recuperable; no una cuenta/);
  assert.match(section, /Mi identidad quedó verificada/);
  assert.match(section, /Ya puedo recibir dinero/);
  assert.match(section, /el OTP no verificó tu identidad/);
  assert.match(section, /ninguna capacidad de dinero quedó habilitada/);
  assert.match(section, /onboarding_e2_answered/);
});

test("el handoff posterior al pre-registro respeta la capacidad elegida", async () => {
  const source = await page();
  const onboarding = source.split("function OnboardingFlow")[1]?.split("function MyBank")[0] ?? "";
  const bank = source.split("function MyBank")[1]?.split("function ProfileMenu")[0] ?? "";

  assert.match(onboarding, /consent_preview_opened/);
  assert.match(onboarding, /kyc_handoff_opened/);
  assert.match(onboarding, /YOL1 no pediría claves bancarias/);
  assert.match(onboarding, /No conectamos un banco/);
  assert.match(bank, /Tu intención llegó/);
  assert.match(bank, /No tus datos de identidad/);
  assert.match(bank, /Capability: recibir dinero/);
  assert.match(bank, /disponibilidad: no disponible/);
  assert.doesNotMatch(bank, /input|setRut|setSerial|biometric/i);
});

test("la UI usa estados nominales y no un contador numérico de onboarding", async () => {
  const source = await page();
  const section = source.split("function OnboardingFlow")[1]?.split("function MyBank")[0] ?? "";

  assert.match(source, /useState<OnboardingStage>\("welcome"\)/);
  assert.match(section, /transitionOnboarding\(stage, event\)/);
  assert.match(section, /stage === "requirements_explained"/);
  assert.match(section, /stage === "preregistered_demo"/);
  assert.doesNotMatch(section, /step:\s*number|step === \d|setStep\(\d/);
});

test("el pre-registro demo se puede restaurar y borrar sin persistir contacto u OTP", async () => {
  const source = await page();
  const section = source.split("function OnboardingFlow")[1]?.split("function MyBank")[0] ?? "";

  assert.match(section, /parseOnboardingDemoSnapshot/);
  assert.match(section, /buildOnboardingDemoSnapshot/);
  assert.match(section, /Borrar pre-registro de esta demo/);
  assert.match(section, /Guardamos sólo capacidad, canal y estado demo; no el contacto ni el OTP/);
  assert.match(section, /localStorage\.removeItem\(ONBOARDING_DEMO_STORAGE_KEY\)/);
  assert.doesNotMatch(section, /JSON\.stringify\((contact|otp)\)/);
});

test("campos de contacto y OTP exponen validación accesible", async () => {
  const source = await page();
  const css = await readFile(new URL("app/globals.css", root), "utf8");
  const section = source.split("function OnboardingFlow")[1]?.split("function MyBank")[0] ?? "";

  assert.match(section, /validateAccessContact\(method, contact\)/);
  assert.match(section, /htmlFor="onboarding-contact"/);
  assert.match(section, /aria-invalid=\{contactTouched && !contactValidation\.valid\}/);
  assert.match(section, /id="onboarding-contact-error"/);
  assert.match(section, /htmlFor="onboarding-otp"/);
  assert.match(section, /id="onboarding-otp-error"/);
  assert.match(section, /autoComplete="one-time-code"/);
  assert.match(css, /\.onboarding-demo-actions button \{ min-height:44px/);
  assert.match(css, /\.e2-options button \{ min-height:44px/);
  assert.match(css, /\.onboarding-flow button:focus-visible/);
});

test("Onboarding usa un contenedor scrolleable propio sin fila de navegación vacía", async () => {
  const source = await page();
  const css = await readFile(new URL("app/globals.css", root), "utf8");

  assert.match(source, /productId === "kyc" \? "onboarding"/);
  assert.match(source, /`phone phone-\$\{productId\}`/);
  assert.match(source, /data-stage=\{stage\}/);
  assert.match(css, /\.phone\.phone-kyc \{ grid-template-rows:62px minmax\(0,1fr\)/);
  assert.match(css, /\.app-content\.app-onboarding \{[^}]*overflow-y:auto/);
  assert.match(css, /\.app-content\.app-onboarding \{[^}]*padding:0/);
  assert.match(css, /@media \(max-width:390px\)[^{]*\{[\s\S]*?\.app-onboarding \.onboarding-flow \{ padding:24px 16px 36px/);
  assert.match(css, /@media \(max-height:700px\)[^{]*\{[\s\S]*?justify-content:flex-start/);
  assert.match(source, /ref=\{appContentRef\}/);
  assert.match(source, /appContentRef\.current\.scrollTop = 0/);
  assert.match(source, /\[bankCapability, onboardingStage, productId, resetAppContentScroll, tab\]/);
  assert.match(source, /\[onResetScroll, view\]/);
});

test("recuperación usa copy neutral que no enumera cuentas", async () => {
  const source = await page();
  const section = source.split("function OnboardingFlow")[1]?.split("function MyBank")[0] ?? "";

  assert.match(section, /Por seguridad, esta demo no confirma si el canal ya tiene un acceso/);
  assert.match(section, /Continuar recuperación \(demo\)/);
  assert.doesNotMatch(section, /Este canal ya tiene un acceso|Contacto ya registrado|Simular contacto ya registrado/);
});

test("Mi banco normaliza fixtures sin aprobar ni exponer estado crudo", async () => {
  const source = await page();
  const section = source.split("function MyBank")[1]?.split("function ProfileMenu")[0] ?? "";

  assert.match(section, /normalizeKycState\(rawState\)/);
  assert.match(section, /showFixture\("requirements_pending"\)/);
  assert.match(section, /showFixture\("failed_recoverable"\)/);
  assert.match(section, /showFixture\("partner_new_state"\)/);
  assert.match(section, /Lo tratamos como revisión, nunca como verificación o capacidad habilitada/);
  assert.match(section, /el valor crudo no se expone/);
  assert.match(section, /Pedir ayuda \(demo\)/);
  assert.doesNotMatch(section, /kyc_state.*approved|capability.*enabled|KYC aprobado/i);
  assert.doesNotMatch(section, /<input|<textarea/);
});
