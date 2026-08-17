# Construir mi propio producto

Estado: borrador operativo.

## Propósito

Permitir que un colaborador convierta una idea en una propuesta revisable sin darle acceso al repositorio privado, sin pedir sus credenciales de IA y sin publicar cambios automáticamente.

## Flujo inicial

1. La persona conecta YOL1 una sola vez en su propio ChatGPT o Claude.
2. Escribe una idea en lenguaje cotidiano. La IA carga el contexto en silencio, muestra una primera propuesta y usa supuestos explícitos antes de pedir información adicional.
   Cuando el cliente soporta Artefactos, Cowork, Canvas o vista previa de código, crea y abre una vista HTML interactiva en ese mismo turno, sin exigir que la persona sepa pedir un mockup.
3. Cuando la propuesta tiene forma, la IA pregunta si la persona quiere guardarla. Sólo una confirmación explícita permite ejecutar `yol1_save_project_draft`.
4. El MCP guarda la propuesta estructurada y devuelve un enlace opaco para verla dentro de “Construir mi propio producto”; no copia la conversación completa.
5. La propuesta sigue en estado borrador. Publicar, convertirla en pantalla real o llevarla a GitHub exige una decisión posterior y separada.

## Contexto que el paquete debe contener

- Sistema visual exacto: tokens, tipografías, assets, shell, navegación, componentes, roles semánticos y accesibilidad; no sólo una descripción del estilo.
- Principios de producto: evidencia antes de promesa, siguiente paso reversible y límites visibles.
- Arquitectura candidata: React Native y AWS; no es una decisión irreversible.
- Datos: distinguir guardar, consultar y nunca almacenar.
- Chile: KYC, partners y licencias se marcan `Por validar` hasta tener evidencia aprobada.

## Límites de esta etapa

- YOL1 no entra, lee ni controla la cuenta de ChatGPT o Claude de una persona.
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
