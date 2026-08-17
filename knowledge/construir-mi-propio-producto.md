# Construir mi propio producto

Estado: borrador operativo.

## Propósito

Permitir que un colaborador convierta una idea en una propuesta revisable sin darle acceso al repositorio privado, sin pedir sus credenciales de IA y sin publicar cambios automáticamente.

## Flujo inicial

1. La persona conecta YOL1 una sola vez en su propio ChatGPT, Claude o Codex.
2. Escribe una idea en lenguaje cotidiano. La IA carga el contexto en silencio, muestra una primera propuesta y usa supuestos explícitos antes de pedir información adicional.
   Cuando el cliente soporta Artefactos, Cowork, Canvas o vista previa de código, crea y abre una vista HTML interactiva en ese mismo turno, sin exigir que la persona sepa pedir un mockup.
3. Cuando la propuesta tiene forma, la IA pregunta si la persona quiere guardarla. Sólo una confirmación explícita permite ejecutar `yol1_save_project_draft`.
4. El MCP guarda la propuesta estructurada y devuelve un enlace opaco para verla dentro de “Construir mi propio producto”; no copia la conversación completa.
5. La propuesta sigue en estado borrador. Publicar, convertirla en pantalla real o llevarla a GitHub exige una decisión posterior y separada.

## Guía implícita para todas las personas

La persona no debería copiar un prompt largo para obtener una buena experiencia. El MCP incluye una pauta universal, independiente de la cuenta, el historial o el nivel técnico:

1. Antes de que exista una propuesta, muestra orientación, ejemplos, qué se recibirá, criterios de QA y límites. La ficha técnica permanece oculta.
2. En cuanto aparece una idea, entrega primero una propuesta visual e interactiva y usa supuestos explícitos para no bloquear el avance.
3. Revisa silenciosamente fidelidad YOL1, honestidad, estados alternativos y claridad de la siguiente decisión.
4. Datos, eventos, arquitectura y gates aparecen después como una segunda capa para quien quiera profundizar.
5. Esa segunda capa es una ficha viva: rescata hechos y aportes parciales, pregunta de a una decisión, acepta “no sé” y adapta el lenguaje al conocimiento demostrado por la persona.
6. Guardar exige confirmación y conserva sólo un resumen estructurado en estado borrador.

Las habilidades son una capacidad del cliente donde corre el chat, no del MCP. YOL1 usa sólo habilidades que ChatGPT, Claude u otro host exponga de forma verificable; no inventa habilidades, no las instala y no afirma que puede revisar un catálogo privado.

## Instalación por cliente

- **ChatGPT:** agregar YOL1 como conexión remota y abrir un chat nuevo.
- **Claude:** agregar el custom connector, abrir un chat nuevo en Cowork y habilitar YOL1.
- **Codex:** en `Settings → MCP servers → Add server`, elegir `Streamable HTTP`, ingresar la URL remota, guardar y pulsar `Restart`. La verificación se hace en una tarea nueva con `/mcp`: YOL1 debe figurar conectado y con transporte `streamable_http`.

En Codex, la alternativa manual usa `[mcp_servers.yol1]` con `url = "…/api/mcp"`. `command` corresponde a servidores STDIO locales y nunca debe contener la URL de YOL1. La guía muestra un bloque copiable para evitar que una persona tenga que inferir esta diferencia técnica. Si una instalación anterior dejó la URL en `command`, ofrece una reparación acotada: `codex mcp remove yol1` y luego `codex mcp add yol1 --url <endpoint>`. La experiencia separa explícitamente tres verificaciones: endpoint disponible, servidor configurado como remoto y herramientas cargadas en una tarea nueva.

Una instalación sólo se declara lista después de comprobar el transporte esperado, descubrir las siete herramientas y ejecutar de forma segura `yol1_start_builder`. La pantalla pública no puede inspeccionar el Codex local de la persona; por eso muestra el resultado esperado y nunca finge una validación automática.

## Contexto que el paquete debe contener

- Sistema visual exacto: tokens, tipografías, assets, shell, navegación, componentes, roles semánticos y accesibilidad; no sólo una descripción del estilo.
- Principios de producto: evidencia antes de promesa, siguiente paso reversible y límites visibles.
- Arquitectura candidata: React Native + Expo, BFF versionado y AWS; Cognito, API Gateway, Lambda/contenedores y DynamoDB/Aurora se cruzan por capacidad y siguen como candidatos hasta decisión de ingeniería.
- Continuidad: cada propuesta debe declarar qué reutiliza, extiende, contradice o deja nuevo respecto de navegación, componentes, datos, identidad, eventos y gates de los demás productos YOL1.
- Datos: distinguir guardar, consultar y nunca almacenar.
- Chile: KYC, partners y licencias se marcan `Por validar` hasta tener evidencia aprobada.

## Límites de esta etapa

- YOL1 no entra, lee ni controla la cuenta de ChatGPT, Claude o Codex de una persona.
- ChatGPT y Claude tienen menús y confirmaciones distintos; la guía mantiene pasos específicos por cliente y la acción de guardar se declara como escritura.
- Los artefactos pertenecen a la cuenta y al chat donde se generan. No viajan dentro del MCP ni aparecen automáticamente en la cuenta de otro colaborador; el contexto compartido permite regenerarlos con el mismo estándar.
- No se comparten credenciales, API keys, conversaciones privadas ni repositorios privados.
- Enviar un proyecto no crea una rama, no publica una pantalla y no activa un producto.
- GitHub versiona el código, el contexto público y las decisiones aprobadas; no convierte por sí solo el MCP en una integración utilizable.
- El piloto ya usa un servidor HTTPS y herramientas separadas de lectura/escritura. OAuth, identidad por persona, listado privado y roles quedan para una fase posterior.
- Los enlaces de borrador son opacos, no se listan públicamente y expiran a los 90 días; quien tenga el enlace puede ver la propuesta.

## Salida esperada de la IA colaboradora

1. Una primera propuesta visible antes de formular preguntas.
2. Problema, persona y aha moment; lo desconocido queda como supuesto.
3. Flujo interactivo de cinco a siete pantallas con look & feel canónico.
4. Ficha separada con datos, eventos, servicios, riesgos y dependencias.
5. Una sola decisión sencilla para la siguiente iteración.
6. Resumen corto listo para enviar a la bandeja.

La respuesta no expone nombres de herramientas, versiones, trazas de edición ni trabajo interno. Tampoco presenta una capacidad financiera como real sin evidencia aprobada.
