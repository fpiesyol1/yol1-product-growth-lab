# YOL1 MCP · plan de publicación

## Qué hará

Una persona conectará el MCP de YOL1 desde su propio ChatGPT o Claude. Podrá pedir una propuesta y recibir el contexto aprobado del Lab: sistema visual, patrones, principios, límites y especificaciones publicadas.

La conversación vive en su propia cuenta de IA. YOL1 solo recibirá lo que esa persona decida enviar como propuesta.

## Qué verá en el Lab

1. Antes de conversar: una vista vacía que invita a partir con la IA.
2. Durante la conversación: pantallas propuestas, nunca el chat privado.
3. Al final: `Enviar proyecto` con nombre, título, problema y vínculo con YOL1.
4. Después: una propuesta en la bandeja editorial para revisión de Felipe.

## Endpoint de primera prueba

La primera versión ya está definida en `/api/mcp` y, al desplegar esta rama, quedará disponible en:

`https://yol1-product-growth-lab.vercel.app/api/mcp`

Es un MCP remoto **público y de solo lectura**. Expone `yol1_get_context` y `yol1_create_project_brief`; no lee conversaciones, no guarda ideas, no pide API keys ni publica cambios. Se debe probar en una cuenta habilitada para conectores antes de prometer compatibilidad universal.

## Piezas necesarias para la versión colaborativa

- Un paquete MCP versionado dentro de este repositorio.
- Un servidor HTTPS desplegado; GitHub aloja y versiona el código, pero no reemplaza el servidor MCP. La primera prueba usa la ruta `/api/mcp` del Lab desplegado.
- OAuth y permisos por persona.
- Herramientas separadas: leer contexto público, crear borrador propio y enviar propuesta.
- API protegida para recibir propuestas y una URL de preview asociada a cada una.
- Moderación, límite de uso y auditoría sin guardar conversaciones privadas.

## Primer alcance seguro

- Solo lectura de contexto aprobado de YOL1.
- Crear un borrador de pantalla en una sesión propia.
- Enviar una propuesta explícita a la bandeja.
- Sin acceso a GitHub de colaboradores, sin publicación automática, sin pagos ni datos financieros.

## Decisiones que faltan

- Dónde se desplega el servidor MCP y con qué dominio.
- Proveedor de identidad/OAuth.
- Qué contexto será público para colaboradores externos.
- Qué formato representa una pantalla propuesta y cómo se valida antes de mostrarla.
