# QA Builder — pasada canónica 02

**Corte:** 2026-08-14, America/Santiago  
**Autoridad:** `DIRECCION-PRODUCTOS-FELIPE.md`  
**Alcance:** salida editorial, privacidad y UX del Builder local; sin publicación,
servicio nuevo, conexión real, commit ni push.

## Resultado

El handoff desde ChatGPT o Claude queda expresado como una decisión manual de la
persona: copia un resumen o referencia seleccionada, revisa un borrador local y luego
elige si lo deja en la bandeja de esta sesión. No se captura la conversación completa,
no hay sincronización y una URL MCP no validada permanece deshabilitada.

## Cambios integrados

1. Contrato candidato `proposal_draft` + `screen_draft` en
   `BUILDER-OUTPUT-CONTRACT.md`.
2. `submission_mode: local_only` y transición `draft → new` limitada al navegador.
3. Exclusión explícita de chats completos, secretos, PII y datos financieros sensibles.
4. Campo opcional reescrito como resumen/referencia elegida, con aviso de privacidad.
5. Evento corto `builder_guide_viewed` con `client` como metadata separada.
6. Controles de guía, prompt y URL MCP con altura táctil mínima de 44 px.
7. Estado deshabilitado visible cuando no existe URL MCP validada.

## QA

- Guardrails focalizados Builder/MCP: **2/2 PASS**.
- `git diff --check` sobre archivos de esta pasada: **PASS**.
- Build Next.js: **PASS**; compilación, TypeScript, páginas y rutas completadas.
- No se realizó despliegue, publicación, conexión de servicio, commit ni push.

## Qué integrar al checkpoint central

- Usar el contrato v0.1 como objeto de revisión entre Producto, Diseño, Datos e
  Ingeniería; todavía no es una API aprobada.
- Conservar `local_only` hasta definir backend, owner, permisos, moderación y retención.
- Mantener el prompt utilizable sin MCP y la URL oculta/deshabilitada sin validación.
- Probar el handoff manual con personas sin almacenar texto libre en analytics.

## Decisiones por validar

1. Longitud, obligatoriedad, sanitización y clasificación de cada campo.
2. Si una referencia puede ser URL/archivo o sólo una descripción elegida.
3. Schema visual definitivo y mecanismo para incorporar pantallas explícitamente.
4. Owner, SLA, permisos y retención de una futura bandeja compartida.
5. Compatibilidad, URL, auth y scopes MCP por cliente.
6. Transición humana posterior a `resolved`.

## Riesgos residuales

- Configurar `NEXT_PUBLIC_MCP_URL` sólo prueba presencia técnica; no acredita seguridad,
  compatibilidad ni operación.
- El texto libre sigue necesitando límites y sanitización antes de persistencia remota.
- Una referencia externa puede contener información privada aunque la persona la elija;
  el diseño futuro necesita advertencia, preview y remoción antes de enviar.
