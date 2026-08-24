# Pomelo MCP × YOL1 — research de fit

**Estado:** primera lectura documental, no decisión de proveedor.
**Fecha de evidencia:** 24 de agosto de 2026.
**Fuente primaria:** [Pomelo MCP Server](https://developers.pomelo.la/mcp).
**Servidor consultado:** `https://api-reference-mcp.pomelo.la/mcp`.

## Conclusión ejecutiva

El MCP de Pomelo encaja bien como **fuente de documentación técnica para discovery**. Permite buscar endpoints, abrir su documentación y generar ejemplos de request sin exigir que la persona conozca la estructura de la API.

No es una conexión operacional con Pomelo: las cinco herramientas publicadas sólo consultan documentación. Encontrar un endpoint demuestra que una capacidad está documentada; no demuestra contrato, acceso, cobertura para YOL1, cumplimiento en Chile, configuración comercial ni readiness de producción.

## Qué quedó conectado al proyecto

La configuración local del proyecto vive en `.codex/config.toml` y registra `pomelo_api_reference` como servidor remoto opcional. No contiene tokens ni secretos y limita el catálogo a estas cinco herramientas:

1. `list_topics`: descubre dominios disponibles.
2. `list_endpoints_by_topic`: muestra endpoints de un dominio.
3. `search_endpoints`: busca por intención concreta.
4. `get_endpoint`: abre el contrato documental completo.
5. `generate_request_example`: genera un ejemplo en curl, Node o Python.

El servidor es opcional (`required = false`): si Pomelo no responde, el Lab puede seguir funcionando. Como Pomelo no publica anotaciones de solo lectura en este catálogo, el proyecto aprueba automáticamente sólo estas cinco herramientas documentales y mantiene una allowlist cerrada; cualquier herramienta futura queda deshabilitada hasta revisión. La configuración se carga en una tarea nueva de Codex después de confiar el proyecto o reiniciar el cliente.

## Primera matriz de fit

| Espacio YOL1 | Evidencia encontrada en Pomelo | Fit candidato | Qué falta validar antes de diseñar como real |
|---|---|---|---|
| Onboarding y KYC | `kyc` (7 endpoints), `users`, `users-v2`, `validations-v2`, webhooks | Alto para un spike documental | Flujo aprobado para Chile, tratamiento de documentos y biometría, consentimiento, proveedor contractual, SLA, errores y revisión manual |
| Tarjetas | `issuing` (15), shipments, sensitive-info, tokenization, push provisioning, 3DS, transaction blocks, chargebacks | Alto por amplitud funcional | BIN/sponsor, affinity groups disponibles, redes, processor setup, límites, costos, certificaciones, operación y soporte |
| Cuenta digital / Mi banco | `digital-accounts` (5), activities, movements, summaries, transactions, settlements | Medio–alto para cuenta ledger | Diferenciar cuenta Pomelo de agregación bancaria; saldos, movimientos, conciliación, system of record, disponibilidad y cobertura contractual CHL |
| Crédito | `credit-product` (13), `credit-lines`, `credit-lines-v2`, account states, installments, imputations, debt | Medio–alto como plataforma candidata | Originación, scoring, underwriting, fondeo, servicing, cobranza, límites regulatorios, pricing aprobado y responsabilidad de cada actor |
| Beneficios / Ganar | `loyalty` (6) y `campaigns` (12) | Medio | Catálogo de comercios, reglas de elegibilidad, funding del beneficio, caducidad, reversas, conciliación y owner comercial |
| Cobrar, pagar y remesas | Hay `on-us`, settlements y movimientos, pero no apareció un dominio inequívoco de transferencias o remesas en esta primera lectura | Por validar | No inferir payment rails ni reactivar Remesas. Buscar journeys y endpoints específicos antes de proponer integración |

### Evidencia representativa

- Crear una sesión KYC: `POST /identity/v2/sessions`; exige bearer token y luego carga documental mediante otro endpoint.
- Crear una cuenta digital: `POST /core/accounts/v1`; exige idempotencia, titular, país y moneda; la documentación enumera `CHL` y `CLP`.
- Crear una tarjeta física o virtual: `POST /cards/v1/`; exige bearer token, `x-idempotency-key`, usuario y affinity group. Parte de la documentación figura con visibilidad `internal`, por lo que disponibilidad comercial o contractual sigue pendiente.
- Loyalty incluye consulta de balance, acreditación/débito y notificaciones pendientes, confirmadas o canceladas. Eso no demuestra que exista un catálogo de beneficios YOL1.

## Escala de evidencia obligatoria

Cada hallazgo de Pomelo debe conservar uno de estos estados:

1. `documentado`: existe en la referencia técnica.
2. `fit_candidato`: podría resolver una capability YOL1.
3. `por_validar_comercial`: falta contrato, acceso, cobertura o pricing.
4. `por_validar_riesgo_legal`: falta decisión de Riesgo, Legal o Compliance.
5. `spike_tecnico`: se probó con credenciales no productivas y criterios definidos.
6. `aprobado`: existe owner y evidencia para usarlo como dependencia real.

Sólo `aprobado` permite que una interfaz YOL1 presente la capacidad como disponible. Los demás estados usan “Demo”, “Simular” o “Por validar”.

## Receta de research para cualquier producto

1. Escribir la capability en lenguaje de producto: qué debe poder hacer la persona y en qué momento.
2. Ejecutar `list_topics` sólo si aún no conocemos el dominio Pomelo.
3. Usar `list_endpoints_by_topic` o `search_endpoints` con una intención acotada.
4. Abrir con `get_endpoint` únicamente los candidatos relevantes.
5. Registrar método, path, autenticación, idempotencia, datos requeridos, estados, errores, visibilidad y fecha de actualización.
6. Comparar contra la ficha YOL1: experiencia, datos, identidad, eventos, gates, operación, normativa y owner.
7. Generar un request de ejemplo sólo cuando el endpoint sobreviva el fit funcional. Nunca agregar tokens al documento ni al repositorio.
8. Cerrar con una decisión: descartar, seguir investigando, hacer spike o elevar a validación comercial/legal.

## Prompts iniciales para nuevas tareas

### Explorar un producto

> Usa YOL1 para construir primero la propuesta de producto. Después consulta Pomelo sólo para las capabilities necesarias. Separa claramente lo documentado, el fit candidato y lo que requiere validación comercial, legal o técnica. No presentes ningún endpoint como capacidad YOL1 aprobada.

### Evaluar una capability

> Investiga si Pomelo podría soportar **[capability]** para **[producto YOL1]**. Busca el tópico y endpoints relevantes, abre sólo los candidatos principales y entrega: encaje, brechas, datos requeridos, autenticación, idempotencia, errores, dependencias, riesgos, preguntas para Pomelo y recomendación de siguiente paso.

### Preparar un spike

> Con la evidencia ya seleccionada, genera un ejemplo de request sin credenciales reales y define criterios de éxito, fixtures, estados alternativos y rollback. No ejecutes la API operacional ni cambies el estado de ningún sistema.

## Límites

- No guardar bearer tokens, API keys, datos personales, documentos KYC ni información financiera en prompts, Git o borradores del Lab.
- No usar el MCP documental como prueba de acceso operacional.
- No ejecutar DELETE, POST, PATCH o PUT contra APIs Pomelo reales desde esta investigación.
- No confundir KYC con autenticación ni KYC aprobado con habilitación de tarjetas, cuentas, pagos o crédito.
- No convertir ejemplos de request en arquitectura aprobada sin revisión de Ingeniería, Seguridad, Datos, Riesgo, Legal/Compliance y Operaciones.
