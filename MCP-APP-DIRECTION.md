# Dirección MCP App YOL1

**Estado:** piloto público reversible; canvas embebido e identidad siguen pendientes.
**Objetivo:** que una persona empiece en ChatGPT, Claude o Codex y sienta que diseña dentro del mismo Product Growth Lab.

## Promesa de experiencia

1. La persona instala una sola conexión YOL1.
2. En un chat nuevo describe una idea en lenguaje cotidiano; no necesita conocer herramientas ni versiones.
3. El primer llamado carga en silencio el contexto y abre un canvas interactivo dentro de la conversación.
4. Chat y canvas trabajan juntos: las preguntas refinan el producto y la vista refleja sólo los cambios que la persona decide incorporar.
5. Guardar crea un borrador revisable. Publicar, editar el core o crear una rama siguen siendo acciones separadas.

Los artefactos generados pertenecen a la cuenta y al chat del colaborador. No se distribuyen dentro del MCP. La conexión distribuye el contexto, el contrato visual y la pauta para que cada persona obtenga una vista equivalente en su propio cliente compatible.

El host decide el tamaño exacto del panel. YOL1 debe diseñar una vista responsive que funcione inline y expandida; no promete forzar literalmente media pantalla.

## Orquestación universal, no prompt personal

La guía vive en las instrucciones del servidor, en la herramienta inicial y en cada contrato de creación. Se aplica a cualquier persona e idea sin depender de un historial individual ni de un mensaje copiado manualmente.

- Antes de construir: orientación simple, ejemplos, entregables, QA y límites; sin ficha técnica como protagonista.
- Después de la primera idea: propuesta visual primero, supuestos visibles y una decisión siguiente.
- Después de la propuesta: ficha progresiva con lo que la persona sabe, datos, condiciones clave, cruce tecnológico, continuidad, eventos, dependencias, gates y riesgos. La IA adapta el lenguaje a cada respuesta, no pregunta el “nivel técnico” ni bloquea por campos desconocidos.
- Después de una confirmación explícita: borrador revisable, nunca publicación o sincronización implícita.

El catálogo de habilidades pertenece al host. El MCP puede pedir que se use una habilidad relevante sólo cuando el cliente la exponga de forma verificable. No puede instalarla, distribuirla, enumerar un catálogo privado ni garantizar que otro colaborador tenga las mismas habilidades.

La instalación también es específica por host. Claude y ChatGPT reciben instrucciones de conexión visuales; Codex usa `Streamable HTTP` y una `url` remota. La guía nunca presenta la URL como `command`, que corresponde a un proceso STDIO local. Para Codex exige `Restart`, comprobación en `/mcp` y una tarea nueva antes de pegar el mensaje activador. También ofrece una reparación copiable para instalaciones antiguas y distingue tres estados que no deben confundirse: endpoint sano, configuración remota correcta y catálogo de herramientas cargado en la tarea actual.

## Una sola fuente visual

La web pública y la MCP App no mantienen diseños paralelos. Comparten:

- tokens de color, tipografía, espacio, bordes, radios y estados;
- componentes del canvas de producto;
- el mismo `ProjectDraftViewModel`;
- copy de estados, límites y confirmaciones;
- fixtures y pruebas visuales.

Los recursos viven en la infraestructura de YOL1. La persona no sube un design system ni instala artefactos en su ChatGPT, Claude o Codex.

## Arquitectura objetivo

```text
YOL1 Product Core
├── contexto y contrato versionados
├── herramientas MCP de lectura/escritura
├── borradores y revisión
└── ProjectDraftViewModel
    ├── Product Lab web
    └── MCP App UI embebida
```

La herramienta inicial declara un recurso `ui://` y devuelve datos estructurados. Un cliente compatible renderiza el HTML en un iframe aislado dentro de la conversación; la UI puede llamar herramientas y devolver decisiones al contexto del modelo.

## Actualización y compatibilidad

- La URL remota permanece estable; la lógica, el contexto y los recursos se actualizan en el servidor YOL1.
- Al reconectar o volver a consultar herramientas, clientes existentes reciben la versión vigente sin reinstalar manualmente.
- No se renombran ni eliminan herramientas usadas por clientes legacy durante la fase piloto.
- Cambios incompatibles se publican como una nueva versión y conservan adaptadores para la versión anterior.
- Cada respuesta declara `server_version`, `context_version`, `ui_version` y `schema_version`.
- La UI usa recursos versionados para evitar mezclar HTML nuevo con datos antiguos.
- Una sesión ya abierta puede conservar el catálogo de herramientas. El flujo legacy debe seguir completo con `yol1_start_builder`, que carga el contexto y el contrato vigentes en su propia respuesta; las herramientas nuevas son mejoras opcionales y nunca un bloqueo.
- `yol1_start_builder` es la entrada canónica y puede recibir la idea y aportes ya conocidos. `yol1_create_project_brief` permanece como alias legacy; no se llaman ambas para la misma idea.
- El contexto se divide en `core`, `product_sheet`, `technology`, `data_analytics` y `continuity`. Sin selector, `get_context` conserva la respuesta completa compatible; el inicio usa sólo la capa necesaria para llegar más rápido a la primera propuesta.
- La persona no revisa versiones ni cuenta herramientas. Si el cliente conserva el catálogo anterior, el asistente continúa en modo texto y sólo omite el guardado compartido que no esté disponible.

## Primer recorrido

El mensaje inicial debe pedir:

1. Una idea escrita con palabras normales; el cliente decide internamente llamar `yol1_start_builder`.
2. Una primera propuesta antes de preguntar, usando supuestos explícitos cuando falte contexto.
3. Como máximo una pregunta sencilla al final de cada iteración.
4. Actualizaciones incrementales del borrador con el UI kit canónico, no interpretaciones libres del estilo.
5. Confirmación explícita antes de guardar, cuando esa acción esté disponible.
6. Entrega del brief en el chat cuando el cliente no exponga guardado, sin detener el trabajo ni afirmar que se guardó.

## Criterios de aceptación

- ChatGPT y Claude abren el mismo canvas YOL1 desde la herramienta inicial cuando soportan MCP Apps.
- La web y la vista embebida pasan una comparación visual con los mismos tokens y componentes.
- Un cliente conectado a la URL anterior conserva las herramientas existentes y obtiene las nuevas al reconectar.
- Una versión desactualizada se detecta y muestra una instrucción de recuperación clara.
- Ningún flujo afirma sincronizar la conversación completa, publicar producto o editar otras pantallas automáticamente.
- Sin soporte de UI, todas las herramientas siguen funcionando en modo texto y devuelven un enlace al Lab.
- Una persona no técnica puede iniciar, iterar y recibir una propuesta sin ver diagnósticos, nombres de herramientas, versiones ni trazas de edición.
- Un prototipo generado usa los tokens, tipografías, assets, shell y navegación exactos; los controles declarados interactivos funcionan realmente.
- Ninguna pantalla presenta saldo, pago, folio, KYC, banco o beneficio como real sin evidencia y capability aprobadas.

## Métricas del piloto

- conexión completada / conexión iniciada;
- primer canvas abierto / chat iniciado;
- tiempo hasta primera propuesta visible;
- iteraciones realizadas dentro del canvas;
- guardados confirmados / propuestas iniciadas;
- errores por versión o caché;
- continuidad visual aprobada en QA ChatGPT, Claude, Codex y web.
