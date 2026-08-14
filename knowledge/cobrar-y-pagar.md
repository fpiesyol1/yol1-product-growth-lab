# Cobrar y pagar

## `collect-receivables-001`

- **Estado:** aprobada para demo.
- **Intención:** quien-me-debe.
- **Pregunta canónica:** ¿Quién me debe plata?
- **Variantes:** ¿Quién me debe? · ¿Cuánto tengo por cobrar? · Muéstrame lo que me deben · ¿Qué cobros tengo pendientes? · ¿Josefa todavía me debe? · ¿María me pagó el almuerzo? · ¿Cuánto me deben entre todos? · ¿Qué personas aparecen por cobrar? · ¿Tengo algo pendiente de Pucón? · ¿Puedo recordarles que paguen?
- **Respuesta esperada — qué veo:** Josefa debe $210.000 por Viaje a Pucón y María $18.000 por Almuerzo viernes; total ficticio $228.000.
- **Qué significa:** Son pendientes de ejemplo; YOL1 no sabe si ya fueron pagados hasta que la persona confirme y revise la cartola ficticia.
- **Qué puede hacer ahora:** Revisar por persona, preparar un recordatorio o marcar el pendiente como resuelto.
- **Evidencia/contexto requerido:** Josefa, María, conceptos, montos y aliases ficticios.
- **Límites:** no afirmar deuda real; no enviar mensajes ni iniciar cobros.
- **Siguiente pregunta útil:** ¿Qué me debe Josefa? / ¿Cómo se vería un recordatorio?
- **Feedback conocido:** ordenar por personas/grupos sin convertir la solicitud en pago real.

## `collect-payables-001`

- **Estado:** aprobada para demo.
- **Intención:** a-quien-debo.
- **Pregunta canónica:** ¿A quién le debo plata?
- **Variantes:** ¿A quién le debo? · ¿Cuánto tengo por pagar? · Muéstrame lo que debo · ¿Qué pagos tengo pendientes? · ¿Le debo algo a Camila? · ¿Cuánto debo del departamento? · ¿Qué persona aparece por pagar? · ¿Tengo deudas pendientes? · ¿Ya le pagué a Camila? · ¿Cómo ordeno lo que tengo que pagar?
- **Respuesta esperada — qué veo:** En el ejemplo le debes $42.000 a Camila por Depto agosto.
- **Qué significa:** Es un pendiente ficticio; no confirma que siga abierto ni que haya que transferir ahora.
- **Qué puede hacer ahora:** Revisarlo, crear un recordatorio personal o marcar el pendiente como resuelto y contrastarlo con la cartola ficticia.
- **Evidencia/contexto requerido:** Camila, $42.000, Depto agosto y alias ficticio.
- **Límites:** no pagar; no iniciar transferencia; no afirmar conciliación.
- **Siguiente pregunta útil:** ¿Por qué le debo a Camila? / ¿Cómo marco el pendiente como resuelto?
- **Feedback conocido:** separar claramente ME DEBEN y LE DEBO.

## `split-liguria-001`

- **Estado:** aprobada para demo.
- **Intención:** repartir-liguria.
- **Pregunta canónica:** ¿Conviene dividir el gasto de Liguria?
- **Variantes:** ¿Qué pasó con Liguria? · ¿La cuenta era compartida? · ¿Puedo dividir los $41.600? · ¿Por qué YOL1 sugiere repartir? · ¿Pagamos entre varios? · ¿Parece de más de una persona? · ¿Cómo reparto la cuenta? · ¿A quién le cobro Liguria? · ¿Debo crear un gasto compartido? · Ignoré Liguria, ¿puedo recuperarlo?
- **Respuesta esperada — qué veo:** La boleta ficticia fue $41.600 y supera el consumo individual habitual del ejemplo.
- **Qué significa:** Solo sugiere que podría haber sido compartida; YOL1 no sabe quién comió ni si corresponde cobrar.
- **Qué puede hacer ahora:** Si la persona lo confirma, elegir participantes y revisar montos antes de guardar.
- **Evidencia/contexto requerido:** Liguria, $41.600, BCI ficticia, certeza baja.
- **Límites:** no inferir participantes; no crear/enviar cobros automáticamente.
- **Siguiente pregunta útil:** ¿Cómo reparto en partes iguales? / ¿Y con montos distintos?
- **Feedback conocido:** el monto es una pista; Ignorar debe permanecer visible.
