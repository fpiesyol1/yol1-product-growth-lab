# QA Builder — pasada canónica 03

**Corte:** 2026-08-14, America/Santiago  
**Autoridad:** `DIRECCION-PRODUCTOS-FELIPE.md`  
**Alcance:** recorrido visual, estados de confianza y reversa local; sin publicación,
servicio nuevo, conexión real, commit ni push.

## Resultado

El recorrido completo queda trazado en `BUILDER-FLOW-MAP.md`: guía por cliente,
MCP condicional, conversación externa, selección manual, borrador local y revisión
humana. La UI ya no contiene una atribución residual de materialización al MCP y el
último borrador guardado puede borrarse del navegador inmediatamente.

## Cambios integrados

1. Mapa visual con el camino manual, el gate MCP y el gate editorial.
2. Matriz de vacío/error/reversa para compatibilidad, URL, portapapeles, campos y revisión.
3. Copy de guardado: `sólo en este navegador`, no `enviado` ni `sesión` ambigua.
4. Reversa visible `Borrar este borrador local` y operación local por identificador.
5. CTA final `Guardar borrador local` con evento candidato `proposal_draft_saved`.
6. Límites de longitud en todos los campos antes de una futura sanitización server-side.
7. Controles de formulario críticos ajustados a un mínimo táctil de 44 px.
8. Comentario de implementación corregido: el teléfono muestra artefactos incorporados
   explícitamente por la persona, no materializados por el MCP.

## QA

- Guardrails focalizados Builder/MCP: **2/2 PASS**.
- Suite completa: **19/19 PASS**.
- `git diff --check` de archivos Builder: **PASS**.
- Build Next.js + TypeScript + páginas/rutas: **PASS**.
- No se realizó despliegue, publicación, conexión de servicio, commit ni push.

## Qué integrar al checkpoint central

- Usar `BUILDER-FLOW-MAP.md` como recorrido canónico para Producto, Diseño e Ingeniería.
- Reservar `proposal_submitted` para una futura recepción compartida confirmada; en el
  prototipo local usar `proposal_draft_saved`.
- Mantener la reversa local visible mientras exista persistencia en el navegador.
- Tratar errores de portapapeles y referencias privadas como escenarios de prueba.

## Decisiones por validar

1. Si el borrador local debe sobrevivir sesiones o expirar automáticamente.
2. Cómo mostrar/listar todos los borradores locales y borrarlos individualmente.
3. Sanitización, clasificación y retención antes de cualquier backend compartido.
4. Formato de preview visual que se incorpora manualmente al teléfono.
5. Compatibilidad, URL, auth y scopes MCP por cliente.
6. Qué artefacto nace después de una aprobación editorial humana.

## Riesgos residuales

- `localStorage` permanece en el navegador hasta que se borra; esta pasada sólo agrega
  reversa inmediata para el último borrador.
- El botón de copiado conserva una falla silenciosa; falta un estado visible con
  alternativa de selección manual.
- El mapa visual define el flujo, pero todavía requiere prueba observada con personas.
