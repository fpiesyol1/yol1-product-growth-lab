# Dirección MCP App YOL1

**Estado:** decisión de producto para diseñar antes de publicar.  
**Objetivo:** que una persona empiece en ChatGPT o Claude y sienta que diseña dentro del mismo Product Growth Lab.

## Promesa de experiencia

1. La persona instala una sola conexión YOL1.
2. En un chat nuevo describe una idea en lenguaje cotidiano; no necesita conocer herramientas ni versiones.
3. El primer llamado carga en silencio el contexto y abre un canvas interactivo dentro de la conversación.
4. Chat y canvas trabajan juntos: las preguntas refinan el producto y la vista refleja sólo los cambios que la persona decide incorporar.
5. Guardar crea un borrador revisable. Publicar, editar el core o crear una rama siguen siendo acciones separadas.

El host decide el tamaño exacto del panel. YOL1 debe diseñar una vista responsive que funcione inline y expandida; no promete forzar literalmente media pantalla.

## Una sola fuente visual

La web pública y la MCP App no mantienen diseños paralelos. Comparten:

- tokens de color, tipografía, espacio, bordes, radios y estados;
- componentes del canvas de producto;
- el mismo `ProjectDraftViewModel`;
- copy de estados, límites y confirmaciones;
- fixtures y pruebas visuales.

Los recursos viven en la infraestructura de YOL1. La persona no sube un design system ni instala artefactos en su ChatGPT o Claude.

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
- continuidad visual aprobada en QA ChatGPT, Claude y web.
