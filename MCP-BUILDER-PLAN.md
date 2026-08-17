# YOL1 MCP · plan de validación

## Qué hace

Una persona puede conectar el piloto MCP de YOL1 desde su propio ChatGPT o Claude cuando el cliente admita conectores MCP remotos. La URL HTTPS estable vive en el mismo dominio del Lab; el cliente debe mostrar la confirmación de cualquier herramienta de escritura. Si el cliente no expone el conector o conserva un catálogo anterior, la persona puede seguir trabajando con el prompt y referencias pegadas manualmente.

La conversación vive en su propia cuenta de IA. YOL1 sólo recibe el resumen estructurado que esa persona decide guardar explícitamente.

## Qué ve en el Lab

1. Antes de conversar: una vista vacía que invita a partir con la IA.
2. Durante la conversación: el Lab no recibe cambios; la persona decide qué resumen estructurado guardar.
3. Al guardar desde MCP: se crea un borrador compartido con ID opaco y enlace de revisión. El formulario `Enviar proyecto` continúa siendo local al navegador.
4. Después: la propuesta permanece en borrador. Publicar, cambiar el core o convertirla en trabajo editorial exige una decisión posterior.

## Endpoint del piloto

La versión vigente está definida en `/api/mcp` como piloto público con herramientas de lectura y una escritura explícita. Expone contexto, contrato de entrega, creación de brief, guardado y recuperación de borradores. No lee conversaciones completas, no pide API keys, no publica cambios y no modifica otras pantallas.

La URL se deriva del dominio público del Lab o de `NEXT_PUBLIC_MCP_URL`. ChatGPT y Claude conservan instrucciones específicas porque sus menús y confirmaciones pueden diferir; la compatibilidad se verifica por cliente y no se infiere por compartir protocolo.

## Piezas pendientes para la versión colaborativa completa

- OAuth, identidad y permisos por persona para listar, editar o borrar borradores propios.
- Recurso `ui://` y canvas embebido compartido con la web.
- Transición editorial protegida desde `draft` a `new`.
- Moderación, borrado autenticado y auditoría sin guardar conversaciones privadas.

## Primer alcance seguro

- Leer contexto aprobado de YOL1 y crear un brief sin persistencia.
- Guardar sólo un resumen estructurado después de confirmación explícita.
- Recuperar el borrador mediante un enlace opaco con expiración, sin listado público.
- Sin acceso a GitHub de colaboradores, sin publicación automática, sin pagos ni datos financieros.

## Decisiones que faltan

- Proveedor de identidad/OAuth.
- Owner, SLA y permisos de la bandeja compartida.
- Qué formato representa las pantallas propuestas y cómo se incorporan explícitamente.
- Cómo editar o borrar un borrador compartido sin convertir el enlace opaco en identidad.
