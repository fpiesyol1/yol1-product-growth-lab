# QA triple — ciclo de revisión del Product Growth Lab

Este ciclo evita revisar solo si “se ve bien”. Cada iteración se evalúa desde tres sombreros y deja un cambio, una duda o un riesgo explícito. La decisión verbal de Felipe prevalece sobre cualquier referencia externa.

## 1. Ingeniería / PRD

Por cada pantalla publicada, verificar:

- Evento corto y estable (`objeto_accion`), con metadata separada: `event_id`, `event_at`, `anonymous_id` o `user_id` interno, `session_id`, `product_key`, `screen_key`, `action_key`, `platform`, `app_version`, `schema_version`, `source`, `consent_analytics` y `correlation_id` cuando aplique.
- Qué se guarda, qué se consulta y de qué fuente proviene cada dato.
- Arquitectura candidata React Native + AWS marcada como hipótesis; ningún proveedor, banco, pago, NFC o KYC se presenta como listo sin integración aprobada.
- Estados de error, reintento, consentimiento, privacidad y ruta humana cuando corresponda.
- KYC y licencias como `No aplica`, `Por validar` o `Requerido`; nunca como conclusión legal automática.

Salida: actualización de Ficha de producto, PRD o una pregunta abierta concreta para Ingeniería/Legal.

## 2. Producto / GTM

Por cada producto, verificar:

- Problema cotidiano, primer momento de valor y acción que demuestra comprensión.
- Evidencia, confianza y límite antes de cualquier recomendación.
- Hipótesis de activación, retorno, aprendizaje y loop de crecimiento sin prometer una capacidad que aún no existe.
- Dependencias de distribución: analytics, engagement, soporte, consentimiento, medición y operación.
- Relación con otros productos: qué habilita, qué no habilita y qué no debe duplicar.

Salida: hipótesis priorizada, métrica de aprendizaje y riesgo de go-to-market.

## 3. Consistencia / experiencia

Por cada recorrido móvil y escritorio, verificar:

- Mismo nombre para el mismo concepto: `Acompañante financiero`, `Cobrar y pagar`, `Ahorrar`, `Mi banco` y estados de acción coherentes.
- Cada botón responde, vuelve o explica el límite; no hay salidas muertas.
- Jerarquía legible, contraste suficiente, sin sobreposición, cortes ni scroll inesperado.
- El feedback identifica de forma clara producto, pantalla y tipo de comentario.
- La bandeja separa feedback de personas, conflictos de decisión y hallazgos de IA.

Salida: hallazgo P0/P1/P2 con pantalla, recorrido y corrección propuesta.

## Orden de ejecución por iteración

1. Recorrer un journey completo como persona nueva.
2. Registrar el hallazgo en la Bandeja de aprendizaje o en el documento del producto.
3. Revisar primero seguridad, significado y capacidad real; luego copy y estética.
4. Aplicar una corrección pequeña y reversible.
5. Ejecutar build, pruebas de guardrail y chequeo de diff.
6. Volver a recorrer el journey afectado en móvil y escritorio antes de publicarlo.

## Prioridades actuales

- **P0:** Onboarding entrega exploración antes de pedir identidad; Review nunca dice “compartido” si la base no está conectada; Builder no promete sincronizar chats externos ni crear pantallas automáticamente.
- **P1:** profundizar Home Banking y Tarjetas con investigación y propuesta antes de prototipar; completar contratos de datos y errores por pantalla.
- **P2:** Remesas queda en investigación; ampliar conocimiento conversacional solo con preguntas y respuestas aprobadas.
