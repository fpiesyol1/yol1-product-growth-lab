# Construir mi propio producto

Estado: borrador operativo.

## Propósito

Permitir que un colaborador convierta una idea en una propuesta revisable sin darle acceso al repositorio privado, sin pedir sus credenciales de IA y sin publicar cambios automáticamente.

## Flujo inicial

1. La persona elige una guía para su propio ChatGPT o Claude, agrega la URL del MCP piloto y habilita el conector en un chat nuevo.
2. Conversa e itera en su propia sesión sobre problema, persona, recorrido, datos, tecnología candidata y riesgos.
3. Cuando la propuesta tiene forma, la IA pregunta si la persona quiere guardarla. Sólo una confirmación explícita permite ejecutar `yol1_save_project_draft`.
4. El MCP guarda la propuesta estructurada y devuelve un enlace opaco para verla dentro de “Construir mi propio producto”; no copia la conversación completa.
5. La propuesta sigue en estado borrador. Publicar, convertirla en pantalla real o llevarla a GitHub exige una decisión posterior y separada.

## Contexto que el paquete debe contener

- Sistema visual: dark-first, roles semánticos de color y accesibilidad.
- Principios de producto: evidencia antes de promesa, siguiente paso reversible y límites visibles.
- Arquitectura candidata: React Native y AWS; no es una decisión irreversible.
- Datos: distinguir guardar, consultar y nunca almacenar.
- Chile: KYC, partners y licencias se marcan `Por validar` hasta tener evidencia aprobada.

## Límites de esta etapa

- YOL1 no entra, lee ni controla la cuenta de ChatGPT o Claude de una persona.
- ChatGPT y Claude tienen menús y confirmaciones distintos; la guía mantiene pasos específicos por cliente y la acción de guardar se declara como escritura.
- No se comparten credenciales, API keys, conversaciones privadas ni repositorios privados.
- Enviar un proyecto no crea una rama, no publica una pantalla y no activa un producto.
- GitHub versiona el código, el contexto público y las decisiones aprobadas; no convierte por sí solo el MCP en una integración utilizable.
- El piloto ya usa un servidor HTTPS y herramientas separadas de lectura/escritura. OAuth, identidad por persona, listado privado y roles quedan para una fase posterior.
- Los enlaces de borrador son opacos, no se listan públicamente y expiran a los 90 días; quien tenga el enlace puede ver la propuesta.

## Salida esperada de la IA colaboradora

1. Problema y persona.
2. Aha moment.
3. Flujo de cinco a siete pantallas y CTAs.
4. Datos a guardar, consultar y no almacenar.
5. Servicios o módulos candidatos.
6. Riesgos, dependencias y preguntas abiertas.
7. Resumen corto listo para enviar a la bandeja.
