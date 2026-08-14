# YOL1 MCP · plan de validación

## Qué hará

Una persona podrá conectar el MCP de YOL1 desde su propio ChatGPT o Claude sólo cuando el cliente sea compatible, exista una URL validada y la autorización sea visible. Mientras tanto puede trabajar con el prompt y referencias pegadas manualmente.

La conversación vive en su propia cuenta de IA. YOL1 solo recibirá lo que esa persona decida enviar como propuesta.

## Qué verá en el Lab

1. Antes de conversar: una vista vacía que invita a partir con la IA.
2. Durante la conversación: el Lab no recibe cambios; la persona incorpora explícitamente pantallas o un resumen.
3. Al final: `Enviar proyecto` con nombre, título, problema y vínculo con YOL1.
4. Después: una propuesta en la bandeja editorial para revisión de Felipe.

## Endpoint de primera prueba local

La primera versión está definida en `/api/mcp` como contrato **local y de solo lectura**. Expone `yol1_get_context` y `yol1_create_project_brief`; no lee conversaciones, no guarda ideas, no pide API keys ni publica cambios.

No hay una URL pública aprobada por defecto. Antes de mostrar una URL se debe validar dominio, operación, autorización y compatibilidad por cliente. ChatGPT y Claude no se tratan como instalaciones equivalentes por inferencia.

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
