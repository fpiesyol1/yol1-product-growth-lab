import { NextResponse } from "next/server";
import type { ProjectDraftInput, SharedProjectDraft } from "../../../lib/project-draft-types";
import {
  countRecentProjectDrafts,
  findProjectDraftBySubmission,
  getProjectDraft,
  isProjectDraftStorageConfigured,
  projectCreatorHash,
  saveProjectDraft,
} from "../../../lib/server/project-draft-store";

export const runtime = "nodejs";

const PROTOCOL_VERSION = "2025-03-26";
const MAX_IDEA_LENGTH = 1_200;
const PROJECT_ID = /^prj_[a-f0-9]{32}$/;
const LAB_VIEW_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yol1-product-growth-lab.vercel.app";
const CONTEXT_VERSION = "yol1-lab-context/0.6";
const SERVER_VERSION = "0.7.0";
const SCHEMA_VERSION = "project-draft/0.4";
const UI_VERSION = "lab-web/0.6";
const CONTEXT_MODULES = ["core", "product_sheet", "technology", "data_analytics", "continuity"] as const;
type ContextModule = typeof CONTEXT_MODULES[number];

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization, MCP-Protocol-Version, Mcp-Session-Id",
  "MCP-Protocol-Version": PROTOCOL_VERSION,
};

type RpcRequest = { jsonrpc?: unknown; id?: unknown; method?: unknown; params?: unknown };

function response(id: unknown, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id: id ?? null, result }, { headers });
}

function error(id: unknown, code: number, message: string) {
  return NextResponse.json({ jsonrpc: "2.0", id: id ?? null, error: { code, message } }, { status: 400, headers });
}

function designSystemManifest() {
  return {
    version: UI_VERSION,
    assets: {
      icon: `${LAB_VIEW_URL}/yol1-icon.png`,
      wordmark: `${LAB_VIEW_URL}/yol1-wordmark-dark.png`,
    },
    typography: {
      sans: '"Söhne", "Helvetica Neue", Arial, sans-serif',
      mono: '"Söhne Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    },
    colors: {
      brand_night: "#112e3c",
      brand_night_deep: "#071f29",
      brand_cream: "#faeddc",
      brand_mist: "#eef3f1",
      acid: "#80ef0c",
      acid_soft: "#c5f29a",
      aqua: "#71d7c8",
      aqua_deep: "#168f86",
      yellow: "#ffe7a0",
      coral: "#ff6847",
      neon_pink: "#ff8fb4",
      pink_soft: "#ffd5e3",
      violet_soft: "#b9a7ff",
      violet_ink: "#59438e",
    },
    dark_theme: {
      page_bg: "#061b24",
      app_bg: "#0a232d",
      surface: "#102f3a",
      surface_raised: "#173b46",
      surface_soft: "#0d2933",
      text: "#f9eee2",
      muted: "#9bb0b5",
      focus: "#71d7c8",
    },
    phone_shell: {
      width_px: 430,
      min_height_px: 720,
      radius_px: 48,
      header_height_px: 62,
      bottom_navigation_height_px: 66,
    },
    companion_navigation: ["Inicio", "Finanzas", "Cobrar/pagar", "Ahorrar", "Ganar", "Mi banco"],
    component_rules: {
      primary_action: "acid sobre brand_night, borde marcado, sombra corta y alto táctil mínimo de 44px",
      explanatory_action: "aqua sobre brand_night",
      collaborative_input: "violet_soft sólo para feedback, selección o colaboración",
      surface: "azul petróleo con borde cream translúcido; evitar tarjetas gris-neutro genéricas",
      focus: "outline aqua de 3px con separación visible",
    },
  };
}

function assistantExperienceContract() {
  return {
    audience: "adaptive_from_plain_language_to_specialist",
    first_turn: "understand_plain_language_and_show_a_first_candidate",
    question_policy: "infer_safe_assumptions; ask at most one question only after showing useful progress",
    visible_answer: ["outcome", "prototype_or_screen_flow", "important_assumptions", "single_next_decision"],
    default_deliverable: "create_and_open_one_interactive_product_artifact_when_the_host_supports_it",
    artifact_fallback: "deliver_the_same_proposal_in_chat_and_offer_one_self_contained_html_file",
    never_show: ["tool_catalog_diagnostics", "version_checks", "internal_editing_trace", "chain_of_thought", "event_ids_inside_product_ui"],
    never_claim: ["background_work", "automatic_sync", "publication_without_confirmation", "unverified_financial_capability"],
  };
}

function builderGuidanceManifest() {
  return {
    scope: "universal_for_every_collaborator_and_product_idea",
    before_idea: {
      primary_content: ["plain_language_orientation", "clickable_examples", "what_the_person_will_receive", "qa_criteria", "honest_limits"],
      hide_until_proposal_exists: ["technical_sheet", "event_catalog", "architecture_details", "internal_tooling"],
    },
    after_idea: {
      primary_content: ["first_visual_candidate", "interactive_flow", "important_assumptions", "silent_qa", "single_next_decision"],
      secondary_content: ["progressive_product_sheet", "data", "events", "technology_fit", "dependencies", "gates", "risks"],
    },
    after_explicit_save: {
      primary_content: ["draft_summary", "review_link", "draft_status"],
      never_implies: ["published", "automatically_synced", "production_ready"],
    },
    host_skills_policy: {
      source: "host_client_only",
      use: "only_skills_explicitly_exposed_and_relevant_to_the_current_task",
      reporting: "when_asked_report_only_verified_available_and_actually_used_skills",
      never: ["invent_a_skill", "claim_the_mcp_can_install_client_skills", "claim_the_mcp_can_enumerate_a_private_skill_catalog"],
    },
  };
}

function productSheetManifest() {
  return {
    timing: "start_after_the_first_useful_product_candidate_not_before_it",
    behavior: "living_and_progressive_not_a_blocking_questionnaire",
    sections: ["known_facts", "user_contributions", "assumptions", "data_needs", "key_conditions", "technology_fit", "continuity_links", "pending_decisions"],
    elicitation: {
      cadence: "ask_at_most_one_high_value_question_per_iteration",
      adaptation: "infer_depth_from_the_persons_words_and_answer_at_the_same_altitude",
      plain_language: "ask_what_must_happen_or_what_information_is_needed_before_using_technical_terms",
      specialist_language: "when_the_person_names_systems_data_or_constraints_capture_them_verbatim_then_structure_them",
      unknown_is_valid: true,
      never: ["ask_the_person_to_rate_their_technical_level", "force_every_field", "discard_partial_knowledge", "present_an_inference_as_a_decision"],
    },
    data_need_fields: ["name", "purpose", "source", "system_of_record", "freshness", "sensitivity", "retention", "consent", "status", "owner"],
  };
}

function technologyBaselineManifest() {
  return {
    authority: "candidate_baseline_not_an_approved_architecture",
    client: ["React Native", "Expo", "typed_navigation", "shared_design_system", "accessible_loading_empty_error_states"],
    edge_and_bff: ["versioned_BFF", "API_Gateway_candidate", "server_side_authorization", "domain_read_models"],
    identity: ["Amazon_Cognito_User_Pools_candidate", "YOL1_person_id_separate_from_login_identity", "KYC_is_not_authentication"],
    services: ["Lambda_or_containers_by_domain", "Step_Functions_only_for_approved_orchestration", "EventBridge_or_SQS_only_for_approved_async_work"],
    data: ["DynamoDB_for_access_patterns_and_state_candidate", "Aurora_PostgreSQL_for_relational_or_audit_needs_candidate", "Neon_Postgres_only_for_the_current_Lab_review_surface"],
    operations: ["feature_flag_per_capability", "idempotency", "correlation_id", "structured_logs", "observability", "rollback", "consent_before_analytics"],
    unresolved: ["CDP_CEP", "financial_data_provider", "KYC_partner", "payment_rails", "benefit_catalog_owner", "DynamoDB_vs_Aurora_by_access_pattern"],
    crosswalk_fields: ["required_capability", "existing_candidate", "fit", "gap", "evidence_state", "decision", "owner"],
  };
}

function continuityManifest() {
  return {
    compare_against: ["YOL1_companion_navigation", "existing_product_specs", "shared_components", "shared_read_models", "events", "capability_gates", "copy_and_evidence_states"],
    current_product_spaces: ["Onboarding_and_KYC", "Financial_companion", "Home_Banking", "Cards", "Remittances_paused", "Product_builder"],
    required_output: ["reuse", "extension", "new_gap", "conflict", "decision_owner"],
    rules: ["reuse_before_creating_a_parallel_pattern", "never_reactivate_a_paused_product_implicitly", "do_not_duplicate_navigation_or_identity_or_consent_models", "label_candidate_and_unknown_states_locally"],
  };
}

function builderGuidanceText() {
  return `## Guía universal de principio a fin
- Esta pauta aplica a cualquier colaborador y cualquier idea; no depende del historial, conocimientos o prompts privados de una persona.
- Antes de que exista una idea o propuesta, orienta con lenguaje simple, ejemplos, qué recibirá la persona, cómo se revisará y cuáles son los límites. No abras con una ficha técnica, eventos, arquitectura ni diagnóstico del conector.
- Cuando aparezca una idea, conviértela de inmediato en una primera propuesta visual e interactiva. Haz supuestos seguros, revisa silenciosamente la calidad y termina con una sola decisión sencilla.
- Después de mostrar el producto, abre una ficha progresiva y ofrece la base técnica como segunda capa: rescata lo que la persona ya sabe, y estructura datos, eventos, encaje tecnológico, continuidad, dependencias, gates y riesgos. No dejes que esa información desplace al prototipo.
- Sólo después de una petición explícita de guardar, resume exactamente qué se conservará y confirma que sigue siendo un borrador no publicado. Si ya existe un mockup navegable en una URL pública, inclúyela como prototype_url; si el mockup está sólo dentro del chat o en un archivo local, dilo con claridad y no inventes ni copies una ruta local.

## Habilidades del cliente
- Las habilidades pertenecen al ChatGPT, Claude u otro cliente de cada persona; no se instalan ni se distribuyen dentro del MCP.
- Usa únicamente habilidades que el cliente haya expuesto de forma verificable y que sean relevantes para la tarea. El MCP no puede inspeccionar por sí solo un catálogo privado de habilidades.
- No inventes nombres ni disponibilidad. Si la persona pregunta qué habilidades se usaron, separa: disponibles verificadas, usadas realmente y no verificables desde el MCP.`;
}

function artifactExperienceManifest() {
  return {
    owner: "the_artifact_belongs_to_the_users_chatgpt_claude_or_codex_session_not_to_the_mcp",
    availability: "host_capability_dependent",
    default_when_supported: "create_and_open_in_the_same_turn",
    ask_before_creating: false,
    one_artifact_per_iteration: true,
    preferred_format: "self_contained_interactive_html",
    responsive_modes: ["inline_half_panel", "expanded_panel", "downloaded_browser_view"],
    fallback: "complete_screen_flow_in_chat_plus_self_contained_html_when_file_creation_is_available",
    required_sections: ["product_view", "five_to_seven_states", "assumptions", "single_next_decision"],
    quality_gate: [
      "exact_yol1_tokens_assets_shell_and_navigation",
      "real_interactive_controls",
      "no_third_party_brand_inside_yol1_ui_without_user_reference",
      "no_unverified_financial_outcome_or_benefit_presented_as_real",
      "uncertainty_visible_at_the_claim_or_action_not_only_in_a_footer",
    ],
  };
}

function artifactContractText() {
  return `## Entrega visual por defecto
- Si el cliente ofrece Artefactos, Cowork, Canvas o vista previa de código, crea y abre en este mismo turno un único artefacto HTML interactivo. No esperes a que la persona diga “haz un mockup” y no preguntes si quiere verlo antes de mostrar una primera versión.
- El artefacto vive en la cuenta y el chat de esa persona. El MCP no instala ni comparte automáticamente artefactos anteriores. Cada colaborador genera su propia vista con el mismo contexto YOL1; sólo un guardado explícito crea un borrador compartido en el Lab.
- Si el cliente no permite artefactos, entrega el mismo flujo completo en el chat y, cuando pueda crear archivos, ofrece un HTML autocontenido descargable. No presentes la falta de canvas como un error ni pidas configuración técnica.
- Diseña para panel lateral de media pantalla y para vista expandida: tablero responsive, lectura clara y mockups móviles de 430px que puedan desplazarse sin cortarse.
- Usa el wordmark e ícono YOL1 alojados por el Lab. No reemplaces el logo por texto y no introduzcas marcas de terceros dentro de la interfaz YOL1 salvo que la persona las haya entregado como referencia explícita.
- Antes de mostrar el artefacto haz una revisión silenciosa. Debe fallar y corregirse si cambia la navegación canónica, usa colores aproximados, incluye controles decorativos, o presenta como real un pago, saldo, ahorro, descuento, comercio, mapa, automatización o beneficio no confirmado.
- Un disclaimer general al pie no corrige una afirmación engañosa dentro de una pantalla. La etiqueta “Ejemplo” o “Por validar” debe aparecer junto al dato, beneficio o acción correspondiente; usa “Simular” en lugar de “Pagar”, “Activar” o “Confirmar” cuando la capability no esté aprobada.
- La respuesta visible resume el valor y deja una sola decisión. No narres la construcción del HTML, no muestres trazas y no pidas al usuario que descargue recursos de diseño.`;
}

function contextCoreText() {
  return `# Contexto esencial de construcción YOL1 · ${CONTEXT_VERSION}\n\n## Experiencia para cualquier persona\n- La persona describe una idea en lenguaje cotidiano. No le hables de MCP, herramientas, catálogos, contratos ni versiones salvo que lo pregunte.\n- Entrega primero una propuesta útil. Si falta información, avanza con un supuesto explícito y formula como máximo una pregunta simple después de mostrar progreso.\n- No muestres trazas de edición como “Now update…”, razonamiento interno ni nombres de eventos dentro del mockup. No digas que seguirás trabajando mientras esperas: no existe trabajo en segundo plano.\n\n## Regla principal\nNo inventes capacidades. Distingue siempre: hecho aprobado, propuesta candidata y pregunta por resolver. Esta conversación genera un borrador; nunca modifica el Lab ni publica producto automáticamente.\n\n## Sistema visual exacto vigente\nNo inventes hex, tipografías, navegación ni estructura. Reutiliza literalmente:\n- Marca: night #112e3c; night-deep #071f29; cream #faeddc; mist #eef3f1.\n- Acentos: acid #80ef0c para acción principal; aqua #71d7c8 para explicación/evidencia; violet-soft #b9a7ff para colaboración/inputs; coral #ff6847 para riesgo; pink #ff8fb4 sólo social.\n- Dark UI: page #061b24; app #0a232d; surface #102f3a; raised #173b46; soft #0d2933; text #f9eee2; muted #9bb0b5.\n- Tipografía: Söhne para lectura y Söhne Mono para metadata, estados y controles.\n- Shell móvil: 430px de ancho, mínimo 720px de alto, radio 48px, header 62px y navegación inferior 66px. Usa los assets ${LAB_VIEW_URL}/yol1-icon.png y ${LAB_VIEW_URL}/yol1-wordmark-dark.png; no escribas “yol1” como reemplazo del logo.\n- Navegación del Acompañante: Inicio, Finanzas, Cobrar/pagar, Ahorrar, Ganar, Mi banco. No inventes otra navegación ni dupliques ítems.\n- Los controles interactivos deben ser button/input reales, no divs decorativos; foco aqua de 3px y área táctil mínima de 44px.\n- El producto aparece primero. Changelog, eventos, arquitectura y decisiones van en una ficha separada, nunca dentro de la pantalla del usuario.\n\n## Producto y honestidad financiera\n- Chile es jurisdicción base. KYC, licencias, partners, pagos, crédito, bancos, QR, NFC, beneficios y recompensas se marcan “Por validar” hasta tener evidencia, owner y capability aprobada.\n- Sin esa evidencia, usa “Simular” o “Demo”: no presentes saldo real, pago confirmado, folio real, procesamiento real ni actualización instantánea como hechos.\n- Todo flujo propone un momento de uso, usuario, problema, aha moment, 5–7 pantallas, estados vacío/carga/error, CTA, evidencia y salida.\n- Para acciones materiales incluye revisión antes de confirmar y estados de resultado incierto, interrupción, duplicado/reintento seguro, ya realizado y recuperación.\n\n## Revisión obligatoria\nAntes de entregar, verifica: fidelidad a tokens y shell, controles realmente interactivos, datos y capacidades no inventadas, dependencias, gates, riesgos de experiencia, Error capa 8, preguntas por validar y fuera de alcance.`;
}

function productSheetText() {
  return `# Ficha de producto progresiva\n- Empieza la ficha sólo después de mostrar una primera propuesta útil. No la conviertas en un formulario previo ni le pidas a la persona completar campos que no conoce.\n- Mantén ocho bloques vivos: hechos conocidos, aportes textuales de la persona, supuestos, datos necesarios, condiciones clave, encaje tecnológico, vínculos con productos YOL1 y decisiones pendientes.\n- Rescata conocimiento parcial. Si alguien dice “esto debería salir de la cartola”, conserva esa frase, tradúcela a una necesidad de dato y pregunta después —sólo si aporta valor— por fuente, frescura, consentimiento o responsable.\n- Adapta el lenguaje a la respuesta, no a un perfil declarado. No preguntes “¿qué nivel técnico tienes?”. A una persona no técnica pregúntale qué información necesita la pantalla o qué debe pasar para que funcione; a una especialista puedes preguntarle por system of record, contrato, estado, idempotencia o SLO.\n- Formula como máximo una pregunta de alto valor por iteración, permite “no sé” y completa el resto como supuesto o pendiente. Después de cada respuesta muestra qué aprendiste y qué cambió en la ficha.\n- Para cada dato candidato registra: nombre, propósito, fuente, system of record, frescura, sensibilidad, retención, consentimiento, estado de evidencia y owner. No inventes los campos desconocidos.`;
}

function technologyContextText() {
  return `# Tecnología YOL1 · base candidata\n- Cliente: React Native + Expo, navegación tipada, design system compartido, accesibilidad y estados carga/vacío/error explícitos.\n- Acceso: Amazon Cognito User Pools es candidato para login, OTP y federación. El identificador de acceso no reemplaza el person_id de YOL1 y autenticación no equivale a KYC.\n- Backend: BFF/API versionado por dominio; API Gateway como candidato; autorización, validación e idempotencia viven en servidor; la app recibe read models de pantalla.\n- Servicios: Lambda o contenedores por dominio. Step Functions, EventBridge y SQS se proponen sólo cuando exista una integración asíncrona aprobada que lo justifique.\n- Datos: DynamoDB y Aurora PostgreSQL son alternativas candidatas según patrón de acceso, consistencia, relaciones, auditoría y operación. Neon/Postgres pertenece hoy sólo a feedback y revisión del Lab; no es por defecto el core financiero.\n- Operación: feature flag por capability, correlation_id, logs estructurados, observabilidad, rollback y consentimiento antes de analytics.\n- Siguen abiertos: CDP/CEP, proveedor de datos financieros, partner KYC, rails/pagos, owner del catálogo de beneficios y elección de almacén por dominio.\n\nPara cada capacidad del producto entrega un cruce corto con: capacidad requerida, candidato YOL1 existente, encaje, brecha, evidencia (hecho/candidato/por validar), decisión pendiente y owner. Reutiliza antes de proponer un stack paralelo y nunca presentes esta base como arquitectura aprobada.`;
}

function dataAnalyticsContextText() {
  return `# Datos y eventos\nPara cada pantalla define fuera del mockup: read model, write model, system of record, fuente, frescura, sensibilidad, retención, consentimiento, owner y estado de evidencia. Define eventos snake_case con event_at, user_id o anonymous_id, session_id, correlation_id, schema_version y consent_analytics.\nNunca incluyas en analytics o logs generales: OTP, RUT, serie, documentos, biometría, credenciales, PAN/CVV/PIN, QR completo, tokens, contactos crudos ni payloads financieros completos.\nLas cifras y capacidades de terceros deben declarar localmente evidence_state (estimated, eligible o confirmed), source, freshness_at, owner y capability_approved.`;
}

function continuityContextText() {
  return `# Continuidad con el resto de YOL1\n- Cruza la propuesta con Onboarding/KYC, Acompañante financiero, Home Banking, Tarjetas, Remesas pausado y Construir mi propio producto.\n- Revisa navegación, componentes, read models, eventos, identidad, consentimiento, gates y lenguaje de evidencia existentes antes de crear un patrón nuevo.\n- Declara cada hallazgo como reutilización, extensión, brecha nueva, conflicto o decisión con owner. No reactives Remesas ni una capability pausada de manera implícita.\n- La interfaz de producto sigue siendo simple. Este cruce aparece en la ficha progresiva, no dentro de las pantallas de la persona.`;
}

function contextText() {
  return [contextCoreText(), productSheetText(), technologyContextText(), dataAnalyticsContextText(), continuityContextText()].join("\n\n");
}

function contextWithGuidanceText() {
  return `${contextText()}\n\n${builderGuidanceText()}`;
}

function contextForModules(modules: ContextModule[]) {
  const texts: Record<ContextModule, string> = { core: contextCoreText(), product_sheet: productSheetText(), technology: technologyContextText(), data_analytics: dataAnalyticsContextText(), continuity: continuityContextText() };
  return modules.map((module) => texts[module]).join("\n\n");
}

function deliveryCoreText() {
  return `# Contrato de entrega YOL1 · ${CONTEXT_VERSION}\n\nTrabaja en este orden, aunque la persona sólo haya escrito una frase:\n1. Muestra una primera propuesta: problema, usuario y momento; lo faltante se marca como supuesto, no como bloqueo.\n2. Presenta el flujo de 5–7 pantallas con contenido, CTA y estados vacío/carga/error. Si produces HTML, debe ser interactivo y usar los tokens, shell, assets y navegación exactos del contexto.\n3. Para una acción material agrega revisión previa y recuperación ante resultado incierto o reintento.\n4. Después del producto, abre una ficha progresiva. Rescata lo que la persona ya sabe —aunque sea parcial o esté dicho sin vocabulario técnico— y separa hechos, aportes, supuestos, datos necesarios, condiciones clave y decisiones pendientes.\n5. Haz el cruce tecnológico YOL1 por capacidad: candidato existente, encaje, brecha, evidencia, decisión y owner. Revisa también continuidad con navegación, componentes, datos, identidad, eventos y gates de otros productos.\n6. En cada iteración haz como máximo una pregunta de alto valor, adaptada al lenguaje demostrado por la persona. “No sé” es una respuesta válida; nunca pidas completar toda la ficha para seguir.\n7. Si el host soporta artefactos, crea y abre una vista HTML interactiva en este mismo turno; si no, entrega el flujo completo y un HTML autocontenido cuando sea posible.\n8. Cierra mostrando qué aprendiste, qué cambió en la ficha y una sola decisión sencilla para la siguiente versión.\n\nLa respuesta visible debe hablar de la idea, no del funcionamiento interno del MCP. No muestres trazas de edición, nombres de herramientas, diagnósticos de versión ni eventos dentro de la interfaz. Nunca afirmes que una integración, pago, crédito, KYC, banco, licencia o partner está disponible sin evidencia explícita.\n\n${artifactContractText()}\n\n${productSheetText()}`;
}

function deliveryContractText() {
  return `${deliveryCoreText()}\n\n${builderGuidanceText()}`;
}

function projectBrief(idea: string, knownContext: string[] = []) {
  const known = knownContext.length ? `\n\n## Lo que la persona ya aportó\n${knownContext.map((item) => `- ${item}`).join("\n")}\nConserva estos aportes en la ficha y no vuelvas a pedirlos.` : "";
  return `# Construye ahora una primera propuesta YOL1\n\n## Idea expresada por la persona\n${idea}${known}\n\nNo devuelvas una plantilla vacía ni detengas el trabajo para completar un formulario. Convierte la idea en una primera propuesta visible usando supuestos explícitos. Después abre la ficha progresiva, rescata el conocimiento de la persona y pregunta como máximo una decisión simple al final.\n\n${contextCoreText()}\n\n${deliveryContractText()}\n\nEste resultado es un borrador de trabajo: no publica una funcionalidad ni representa una capacidad operativa. Continúa desarrollándolo en el chat aunque la acción de guardar no esté visible. En ese caso, entrega el brief completo y el enlace del Lab, sin afirmar que fue guardado.`;
}

function bootstrapMetadata() {
  return {
    bootstrap_status: "ready",
    workflow_mode: "legacy-compatible",
    server_version: SERVER_VERSION,
    context_version: CONTEXT_VERSION,
    schema_version: SCHEMA_VERSION,
    ui_version: UI_VERSION,
    loaded: ["product_context", "delivery_contract", "lab_view"],
    next_action: "continue_product_conversation",
    saving: "optional_and_requires_explicit_confirmation",
    design_system: designSystemManifest(),
    assistant_experience: assistantExperienceContract(),
    builder_guidance: builderGuidanceManifest(),
    artifact_experience: artifactExperienceManifest(),
    product_sheet: productSheetManifest(),
    technology_baseline: technologyBaselineManifest(),
    continuity: continuityManifest(),
    context_modules: CONTEXT_MODULES,
  };
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanList(value: unknown, maxItems: number, maxLength: number) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => clean(item, maxLength)).filter(Boolean);
}

function publicPrototypeUrl(value: unknown) {
  const candidate = clean(value, 500);
  if (!candidate) return "";
  try {
    const url = new URL(candidate);
    const sensitiveKey = /^(?:access_?token|api_?key|auth|authorization|code|credential|jwt|password|secret|signature|token)$/i;
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    if (url.username || url.password || [...url.searchParams.keys()].some((key) => sensitiveKey.test(key))) return "";
    return url.toString();
  } catch {
    return "";
  }
}

function normalizeProjectDraft(value: unknown): ProjectDraftInput | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const sheet = input.product_sheet && typeof input.product_sheet === "object" ? input.product_sheet as Record<string, unknown> : {};
  const project = {
    submissionId: clean(input.submission_id, 80),
    title: clean(input.title, 120),
    idea: clean(input.idea, MAX_IDEA_LENGTH),
    problem: clean(input.problem, 700),
    audience: clean(input.audience, 400),
    valueProposition: clean(input.value_proposition, 700),
    assumptions: cleanList(input.assumptions, 8, 240),
    openQuestions: cleanList(input.open_questions, 8, 240),
    references: cleanList(input.references, 5, 300),
    prototypeUrl: publicPrototypeUrl(input.prototype_url),
    productSheet: {
      knownFacts: cleanList(sheet.known_facts, 10, 300),
      userContributions: cleanList(sheet.user_contributions, 10, 300),
      dataNeeds: cleanList(sheet.data_needs, 12, 360),
      keyConditions: cleanList(sheet.key_conditions, 10, 300),
      technologyFit: cleanList(sheet.technology_fit, 10, 360),
      continuityLinks: cleanList(sheet.continuity_links, 10, 300),
      pendingDecisions: cleanList(sheet.pending_decisions, 10, 300),
    },
  };
  if (!/^[a-zA-Z0-9-]{8,80}$/.test(project.submissionId) || !project.title || !project.idea || !project.problem || !project.audience || !project.valueProposition) return null;
  return project;
}

function containsSensitiveData(project: ProjectDraftInput) {
  const text = [project.title, project.idea, project.problem, project.audience, project.valueProposition, project.prototypeUrl, ...project.assumptions, ...project.openQuestions, ...project.references, ...Object.values(project.productSheet).flat()].join(" ");
  return /(?:^|\D)(?:\d[ -]?){13,19}(?:\D|$)/.test(text)
    || /\b\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]\b/.test(text)
    || /\b(?:clave|contraseña|password|cvv|cvc|pin)\s*[:=]/i.test(text)
    || /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)
    || /(?:\+?56\s?)?(?:9\s?)?\d{4}[\s-]?\d{4}/.test(text)
    || project.references.some((reference) => {
      try {
        const url = new URL(reference);
        const sensitiveKeys = /^(?:access_?token|api_?key|auth|authorization|code|credential|jwt|password|secret|signature|token)$/i;
        return Boolean(url.username || url.password || [...url.searchParams.keys()].some((key) => sensitiveKeys.test(key)));
      } catch {
        return false;
      }
    });
}

function projectViewUrl(id: string) {
  return `${LAB_VIEW_URL}/?product=builder&draft=${encodeURIComponent(id)}`;
}

function projectReviewUrl(id: string) {
  return `${LAB_VIEW_URL}/review?tab=prototypes&project=${encodeURIComponent(id)}`;
}

function projectDraftResult(project: SharedProjectDraft, created = false) {
  const viewUrl = projectViewUrl(project.id);
  const reviewUrl = projectReviewUrl(project.id);
  return {
    content: [{
      type: "text",
      text: `# ${project.title}\n\n${created ? "Borrador guardado" : "Borrador encontrado"} para revisión.\n\n[Abrir esta propuesta en el Lab](${viewUrl})\n[Verla en Reviews](${reviewUrl})\n\nEstado: borrador · No está publicado · No modificó ninguna pantalla automáticamente.`,
    }],
    structuredContent: {
      project_id: project.id,
      status: project.status,
      view_url: viewUrl,
      review_url: reviewUrl,
      title: project.title,
      product_sheet: project.productSheet,
      created_at: project.createdAt,
      expires_at: project.expiresAt,
      published: false,
    },
  };
}

function labViewLink() {
  return `Cuando quieras revisar el Lab, abre: [Abrir vista del Lab](${LAB_VIEW_URL}/?product=builder). Esta vista es un prototipo; no publica ni sincroniza cambios automáticamente.`;
}

function startBuilderText(idea = "", knownContext: string[] = []) {
  if (idea) return projectBrief(idea, knownContext);
  return `# YOL1 está listo\n\n[Abre la vista del Lab cuando quieras](${LAB_VIEW_URL}/?product=builder)\n\nCuéntame qué quieres crear o mejorar con tus propias palabras. No necesitas preparar un brief ni conocer herramientas: te mostraré una primera propuesta y después rescataré, de a poco, lo que tú sepas del producto, sus datos o condiciones.\n\n## Instrucciones vigentes para el asistente\n- Ejecuta este recorrido en silencio: no expliques herramientas, versiones, catálogos ni contratos a la persona.\n- Esta es la entrada canónica. Si ya recibiste la idea aquí, no llames además a create_project_brief: produciría una vuelta redundante.\n- Continúa aunque el cliente sólo muestre las herramientas originales de YOL1. No pidas reconectar, renombrar el conector ni hacer un diagnóstico técnico.\n- Si la persona ya entregó una idea, muestra una primera propuesta antes de preguntar. Después crea una ficha progresiva, rescata aportes parciales y formula como máximo una pregunta al final.\n- No preguntes el nivel técnico. Adapta el lenguaje a lo que la persona demuestre y acepta “no sé” sin frenar el avance.\n- Si el cliente soporta Artefactos, Cowork, Canvas o vista previa de código, crea y abre el prototipo interactivo en el mismo turno. No obligues a la persona a pedir HTML, mockup o artefacto.\n- No muestres trazas como “Now update…”, razonamiento interno, pasos de edición ni promesas de trabajo en segundo plano.\n- Pide los módulos technology, data_analytics o continuity sólo cuando la propuesta ya exista o la persona aporte información relacionada.\n- Si guardar está disponible, úsalo sólo después de confirmación explícita. Si no está disponible, entrega el brief en el chat sin afirmar que fue guardado.\n- Nunca prometas publicación, sincronización automática ni capacidades financieras sin evidencia.\n\n${contextCoreText()}\n\n${productSheetText()}\n\n${deliveryCoreText()}`;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers });
}

export async function GET() {
  return NextResponse.json({
    name: "YOL1 Product Growth Lab MCP",
    version: SERVER_VERSION,
    transport: "streamable-http",
    access: "public-pilot-explicit-write",
    setup: "plug-and-play",
    legacy_compatible: true,
    start_tool: "yol1_start_builder",
    context_version: CONTEXT_VERSION,
    schema_version: SCHEMA_VERSION,
    ui_version: UI_VERSION,
    tools: ["yol1_start_builder", "yol1_get_context", "yol1_get_delivery_contract", "yol1_create_project_brief", "yol1_save_project_draft", "yol1_get_project_draft", "yol1_get_lab_view"],
    note: "Piloto público: sólo guarda borradores cuando la persona lo pide explícitamente. No publica, sincroniza conversaciones ni modifica productos automáticamente.",
  }, { headers });
}

export async function POST(request: Request) {
  let rpc: RpcRequest;
  try {
    rpc = await request.json() as RpcRequest;
  } catch {
    return error(null, -32700, "JSON inválido.");
  }
  if (rpc.jsonrpc !== "2.0" || typeof rpc.method !== "string") return error(rpc.id, -32600, "Solicitud MCP inválida.");

  if (rpc.method === "initialize") {
    return response(rpc.id, {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { tools: {} },
      serverInfo: { name: "yol1-product-growth-lab", version: SERVER_VERSION },
      instructions: "YOL1 guía universalmente a personas con distintos niveles técnicos. Ante una idea, llama en silencio a yol1_start_builder pasando la idea y cualquier contexto ya aportado; esa es la entrada canónica y no necesita una segunda llamada a create_project_brief. Muestra primero una propuesta útil. Después crea una ficha progresiva, rescata lo que la persona sabe sin pedirle declarar su nivel, hace como máximo una pregunta de alto valor por iteración y acepta 'no sé'. Cuando corresponda, cruza capacidades con la base candidata React Native/Expo, BFF versionado y AWS, separando encaje, brechas y decisiones; verifica continuidad con productos, componentes, datos, identidad, eventos y gates YOL1 existentes. Cuando el host soporte Artefactos, Cowork, Canvas o vista previa de código, crea y abre en el mismo turno un prototipo HTML interactivo. No menciones MCP, herramientas, versiones ni catálogos. Usa literalmente el sistema visual incluido. Guarda sólo después de una petición explícita; nunca asumas publicación, sincronización ni capacidades financieras reales.",
    });
  }

  if (rpc.method === "notifications/initialized") return new NextResponse(null, { status: 202, headers });

  if (rpc.method === "tools/list") {
    return response(rpc.id, { tools: [
      {
        name: "yol1_start_builder",
        description: "Entrada canónica para crear, revisar o mejorar cualquier producto YOL1. Pasa la idea y todo contexto que la persona ya haya aportado. Devuelve el recorrido compacto: propuesta primero, ficha progresiva después, una pregunta adaptativa por iteración y cruce con tecnología/continuidad YOL1. No llames además a create_project_brief para la misma idea.",
        inputSchema: {
          type: "object",
          properties: {
            idea: { type: "string", description: "Idea ya expresada por la persona, máximo 1200 caracteres. Omítela sólo si todavía no existe una idea." },
            known_context: { type: "array", maxItems: 10, items: { type: "string", maxLength: 300 }, description: "Aportes que la persona ya dio —técnicos o no— para no volver a preguntarlos." },
            host_capabilities: {
              type: "object",
              description: "Sólo capacidades del cliente verificadas en la sesión; omite lo desconocido.",
              properties: { artifact_html: { type: "boolean" }, local_files: { type: "boolean" }, preview: { type: "boolean" }, save_draft: { type: "boolean" }, publish: { type: "boolean" } },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true },
      },
      {
        name: "yol1_get_context",
        description: "Devuelve módulos del contexto vigente. Usa core para diseñar; pide product_sheet, technology, data_analytics o continuity sólo cuando esa capa sea necesaria. Sin modules conserva la respuesta completa para clientes legacy.",
        inputSchema: { type: "object", properties: { modules: { type: "array", uniqueItems: true, items: { type: "string", enum: CONTEXT_MODULES }, description: "Módulos requeridos; omitir mantiene compatibilidad y devuelve todos." } }, additionalProperties: false },
        annotations: { readOnlyHint: true },
      },
      {
        name: "yol1_get_delivery_contract",
        description: "Devuelve la pauta completa para convertir una idea en un brief implementable por diseño, producto e ingeniería.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true },
      },
      {
        name: "yol1_create_project_brief",
        description: "Alias compatible para clientes antiguos. Produce el mismo brief que yol1_start_builder cuando recibe una idea; no la llames además de start_builder para la misma propuesta. No guarda ni publica.",
        inputSchema: {
          type: "object",
          properties: { idea: { type: "string", description: "Idea inicial de producto, máximo 1200 caracteres." }, known_context: { type: "array", maxItems: 10, items: { type: "string", maxLength: 300 }, description: "Aportes ya entregados por la persona." } },
          required: ["idea"], additionalProperties: false,
        },
        annotations: { readOnlyHint: true },
      },
      {
        name: "yol1_save_project_draft",
        description: "Guarda una propuesta estructurada como borrador compartido y devuelve enlaces para abrirla en el Lab y revisarla en Reviews. Úsala sólo cuando la persona pida explícitamente guardar, enviar o traer la propuesta al Lab. Es una escritura externa: no publica, no edita otras pantallas y no sincroniza la conversación completa.",
        inputSchema: {
          type: "object",
          properties: {
            submission_id: { type: "string", description: "Clave estable de 8 a 80 caracteres para que un reintento no cree duplicados." },
            title: { type: "string", description: "Nombre claro del proyecto, máximo 120 caracteres." },
            idea: { type: "string", description: "Resumen de la idea acordada, máximo 1200 caracteres." },
            problem: { type: "string", description: "Problema concreto que resuelve, máximo 700 caracteres." },
            audience: { type: "string", description: "Persona o grupo para quien se diseña, máximo 400 caracteres." },
            value_proposition: { type: "string", description: "Valor que propone entregar YOL1, máximo 700 caracteres." },
            assumptions: { type: "array", maxItems: 8, items: { type: "string", maxLength: 240 } },
            open_questions: { type: "array", maxItems: 8, items: { type: "string", maxLength: 240 } },
            references: { type: "array", maxItems: 5, items: { type: "string", maxLength: 300 }, description: "Sólo referencias que la persona decidió incluir; nunca copies el chat completo ni credenciales." },
            prototype_url: { type: "string", maxLength: 500, description: "URL pública http(s) del mockup ya creado. Omítela si sólo existe como archivo local o dentro de un chat: nunca inventes una URL ni envíes rutas C:\\ o file://." },
            product_sheet: {
              type: "object",
              description: "Ficha progresiva construida después de la propuesta. Guarda sólo conocimiento que la persona confirmó o decidió incluir; lo desconocido puede quedar vacío.",
              properties: {
                known_facts: { type: "array", maxItems: 10, items: { type: "string", maxLength: 300 } },
                user_contributions: { type: "array", maxItems: 10, items: { type: "string", maxLength: 300 } },
                data_needs: { type: "array", maxItems: 12, items: { type: "string", maxLength: 360 } },
                key_conditions: { type: "array", maxItems: 10, items: { type: "string", maxLength: 300 } },
                technology_fit: { type: "array", maxItems: 10, items: { type: "string", maxLength: 360 } },
                continuity_links: { type: "array", maxItems: 10, items: { type: "string", maxLength: 300 } },
                pending_decisions: { type: "array", maxItems: 10, items: { type: "string", maxLength: 300 } },
              },
              additionalProperties: false,
            },
          },
          required: ["submission_id", "title", "idea", "problem", "audience", "value_proposition"],
          additionalProperties: false,
        },
        annotations: { title: "Guardar borrador en YOL1", readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      },
      {
        name: "yol1_get_project_draft",
        description: "Recupera un borrador compartido por su identificador opaco y devuelve el enlace para revisarlo. No lista proyectos ni permite adivinar otros borradores.",
        inputSchema: {
          type: "object",
          properties: { project_id: { type: "string", description: "Identificador devuelto al guardar, con formato prj_…" } },
          required: ["project_id"], additionalProperties: false,
        },
        annotations: { readOnlyHint: true, openWorldHint: false },
      },
      {
        name: "yol1_get_lab_view",
        description: "Devuelve un enlace Markdown para abrir la vista del Product Growth Lab. Úsala cuando la persona pida abrir, revisar o ver su propuesta en el Lab.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true },
      },
    ] });
  }

  if (rpc.method === "tools/call") {
    const params = rpc.params && typeof rpc.params === "object" ? rpc.params as { name?: unknown; arguments?: unknown } : {};
    if (params.name === "yol1_start_builder") {
      const args = params.arguments && typeof params.arguments === "object" ? params.arguments as Record<string, unknown> : {};
      if (args.idea !== undefined && (typeof args.idea !== "string" || !args.idea.trim() || args.idea.length > MAX_IDEA_LENGTH)) return response(rpc.id, { isError: true, content: [{ type: "text", text: "Incluye una idea de hasta 1200 caracteres o deja idea fuera si todavía no existe." }] });
      const idea = clean(args.idea, MAX_IDEA_LENGTH);
      const knownContext = cleanList(args.known_context, 10, 300);
      const rawCapabilities = args.host_capabilities && typeof args.host_capabilities === "object" ? args.host_capabilities as Record<string, unknown> : {};
      const hostCapabilities = Object.fromEntries(["artifact_html", "local_files", "preview", "save_draft", "publish"].flatMap((key) => typeof rawCapabilities[key] === "boolean" ? [[key, rawCapabilities[key]]] : []));
      return response(rpc.id, { content: [{ type: "text", text: startBuilderText(idea, knownContext) }], structuredContent: { ...bootstrapMetadata(), idea: idea || null, known_context: knownContext, host_capabilities: hostCapabilities, context_modules_loaded: ["core", "product_sheet"], delivery_guidance_loaded: true, draft_saved: false } });
    }
    if (params.name === "yol1_get_context") {
      const args = params.arguments && typeof params.arguments === "object" ? params.arguments as { modules?: unknown } : {};
      const requested = Array.isArray(args.modules) ? args.modules.filter((item): item is ContextModule => typeof item === "string" && CONTEXT_MODULES.includes(item as ContextModule)) : [];
      const selected = requested.length ? [...new Set(requested)] : [...CONTEXT_MODULES];
      const text = requested.length ? `${contextForModules(selected)}\n\n${builderGuidanceText()}` : contextWithGuidanceText();
      return response(rpc.id, { content: [{ type: "text", text }], structuredContent: { ...bootstrapMetadata(), context_modules_loaded: selected } });
    }
    if (params.name === "yol1_get_delivery_contract") return response(rpc.id, { content: [{ type: "text", text: deliveryContractText() }], structuredContent: bootstrapMetadata() });
    if (params.name === "yol1_get_lab_view") return response(rpc.id, { content: [{ type: "text", text: labViewLink() }] });
    if (params.name === "yol1_create_project_brief") {
      const args = params.arguments && typeof params.arguments === "object" ? params.arguments as { idea?: unknown; known_context?: unknown } : {};
      if (typeof args.idea !== "string" || !args.idea.trim() || args.idea.length > MAX_IDEA_LENGTH) return response(rpc.id, { isError: true, content: [{ type: "text", text: "Incluye una idea de hasta 1200 caracteres." }] });
      const knownContext = cleanList(args.known_context, 10, 300);
      return response(rpc.id, { content: [{ type: "text", text: projectBrief(args.idea.trim(), knownContext) }], structuredContent: { ...bootstrapMetadata(), idea: args.idea.trim(), known_context: knownContext, alias_of: "yol1_start_builder", draft_saved: false } });
    }
    if (params.name === "yol1_save_project_draft") {
      const project = normalizeProjectDraft(params.arguments);
      if (!project) return response(rpc.id, { isError: true, content: [{ type: "text", text: "Completa título, idea, problema, audiencia y propuesta de valor dentro de los límites indicados." }] });
      if (containsSensitiveData(project)) return response(rpc.id, { isError: true, content: [{ type: "text", text: "No guardé el borrador porque contiene datos personales, credenciales, teléfonos o números de tarjeta. Elimínalos y vuelve a pedir confirmación." }] });
      if (!isProjectDraftStorageConfigured()) return response(rpc.id, { isError: true, content: [{ type: "text", text: "La bandeja compartida de proyectos aún no está configurada." }] });
      try {
        const creatorHash = projectCreatorHash(request);
        const existing = await findProjectDraftBySubmission(project.submissionId, creatorHash);
        if (existing) return response(rpc.id, projectDraftResult(existing));
        if (await countRecentProjectDrafts(creatorHash) >= 5) return response(rpc.id, { isError: true, content: [{ type: "text", text: "Alcanzaste el límite temporal de cinco borradores por hora." }] });
        const saved = await saveProjectDraft(project, creatorHash);
        return response(rpc.id, projectDraftResult(saved, true));
      } catch {
        return response(rpc.id, { isError: true, content: [{ type: "text", text: "No pudimos guardar el borrador compartido en este momento." }] });
      }
    }
    if (params.name === "yol1_get_project_draft") {
      const args = params.arguments && typeof params.arguments === "object" ? params.arguments as { project_id?: unknown } : {};
      const projectId = clean(args.project_id, 40);
      if (!PROJECT_ID.test(projectId)) return response(rpc.id, { isError: true, content: [{ type: "text", text: "Incluye un project_id válido con formato prj_…" }] });
      try {
        const project = await getProjectDraft(projectId);
        return response(rpc.id, project ? projectDraftResult(project) : { isError: true, content: [{ type: "text", text: "El borrador no existe o ya expiró." }] });
      } catch {
        return response(rpc.id, { isError: true, content: [{ type: "text", text: "No pudimos abrir el borrador compartido en este momento." }] });
      }
    }
    return response(rpc.id, { isError: true, content: [{ type: "text", text: "Herramienta no disponible." }] });
  }

  return error(rpc.id, -32601, "Método MCP no encontrado.");
}
