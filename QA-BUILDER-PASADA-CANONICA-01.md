# QA Builder — pasada canónica 01

**Corte:** 2026-08-14 01:48, America/Santiago  
**Autoridad:** `DIRECCION-PRODUCTOS-FELIPE.md`  
**Alcance:** Builder local; sin publicación, servicio nuevo, commit ni push.

## Resultado

Builder queda centrado en el ChatGPT o Claude propio de la persona. El Lab guía,
entrega un prompt y recibe un resumen explícito; no entra al chat, no sincroniza
pantallas y no trata un endpoint local como integración pública disponible.

## Cambios integrados

1. Entrada canónica: “En este espacio, el próximo producto lo construyes tú”.
2. `Conectar mi…` se reemplaza por guías separadas para ChatGPT y Claude.
3. La URL MCP queda vacía por defecto y sólo puede copiarse si está configurada.
4. La guía muestra `Integración MCP por validar` cuando no existe URL.
5. El prompt pregunta una a una por producto, usuario, problema, pantallas, datos,
   riesgos, reversas y fit YOL1; también pide referencias visuales.
6. “Materialización” se redefine como incorporación manual de resumen/pantallas.
7. `Enviar proyecto` guarda únicamente en la bandeja local de esta sesión durante
   esta pasada; no llama el intake compartido.
8. El contrato `/api/mcp` se rotula `local-read-only-demo`.
9. Plan, conocimiento y guardrails se alinean con estos límites.

## QA

- Guardrails focalizados Builder/MCP: **2/2 PASS**.
- Suite completa: **14/19 PASS**; cinco fallas pertenecen a cambios concurrentes
  fuera de Builder (Inicio, Cartola, Cobrar/Pagar, portfolio y ficha viva) y no se
  corrigieron desde este carril para evitar interferencia.
- Build: **PASS**. El primer intento respetó un proceso concurrente; el reintento
  posterior compiló, pasó TypeScript y generó las rutas `/`, `/api/mcp` y `/review`.

## Qué integrar al checkpoint central

- Builder ya no promete endpoint público ni sincronización.
- La salida editorial queda local hasta que exista una decisión de bandeja compartida.
- El prompt v0.2 es el artefacto de coordinación para siguientes pruebas.
- `MCP-BUILDER-PLAN.md` vuelve de “publicación” a “validación”.

## Decisiones por validar

1. Compatibilidad y pasos exactos por ChatGPT/Claude.
2. URL, auth, owner y operación del MCP remoto.
3. Contexto YOL1 que puede exponerse externamente.
4. Herramienta/schema para materializar pantallas; lectura MCP no basta.
5. Bandeja compartida, clasificación de datos y owner editorial.
6. Acción posterior a aprobación de Felipe.

## Riesgos residuales

- Si `NEXT_PUBLIC_MCP_URL` se configura sin un proceso de aprobación, la guía podría
  mostrar una URL técnicamente presente pero no operativamente validada.
- Los paths de instalación siguen variando por plan/workspace; deben documentarse
  sólo después de prueba real.
- El formulario local acepta links o texto libre; antes de hacerlo compartido requiere
  clasificación, límites, moderación y política de retención.
