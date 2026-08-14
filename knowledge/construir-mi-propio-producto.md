# Construir mi propio producto

Estado: borrador operativo.

## Propósito

Permitir que un colaborador convierta una idea en una propuesta revisable sin darle acceso al repositorio privado, sin pedir sus credenciales de IA y sin publicar cambios automáticamente.

## Flujo inicial

1. La persona instala o conecta el MCP de YOL1 en su propio ChatGPT o Claude, cuando el servidor remoto esté publicado.
2. Conversa e itera en su propia sesión sobre problema, persona, recorrido, datos, tecnología candidata y riesgos.
3. El MCP materializa solo las pantallas propuestas en el panel de vista previa del Lab.
4. Cuando la propuesta tiene forma, recién abre “Enviar proyecto” y completa: nombre, título, qué busca hacer y por qué calza con YOL1.
5. La propuesta llega a la bandeja editorial. Felipe la aprueba, pide cambios o descarta.

## Contexto que el paquete debe contener

- Sistema visual: dark-first, roles semánticos de color y accesibilidad.
- Principios de producto: evidencia antes de promesa, siguiente paso reversible y límites visibles.
- Arquitectura candidata: React Native y AWS; no es una decisión irreversible.
- Datos: distinguir guardar, consultar y nunca almacenar.
- Chile: KYC, partners y licencias se marcan `Por validar` hasta tener evidencia aprobada.

## Límites de esta etapa

- YOL1 no entra, lee ni controla la cuenta de ChatGPT o Claude de una persona.
- No se comparten credenciales, API keys, conversaciones privadas ni repositorios privados.
- Enviar un proyecto no crea una rama, no publica una pantalla y no activa un producto.
- GitHub versiona el código, el contexto público y las decisiones aprobadas; no convierte por sí solo el MCP en una integración utilizable.
- El MCP remoto requiere una fase posterior con servidor HTTPS desplegado, OAuth, permisos por persona y herramientas separadas de lectura/escritura.

## Salida esperada de la IA colaboradora

1. Problema y persona.
2. Aha moment.
3. Flujo de cinco a siete pantallas y CTAs.
4. Datos a guardar, consultar y no almacenar.
5. Servicios o módulos candidatos.
6. Riesgos, dependencias y preguntas abiertas.
7. Resumen corto listo para enviar a la bandeja.
