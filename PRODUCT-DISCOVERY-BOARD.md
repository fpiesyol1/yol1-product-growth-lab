# YOL1 · Tablero de trabajo por producto

Este tablero ordena el trabajo antes de modificar una pantalla. La app del Lab sigue siendo la superficie común para navegar prototipos y dejar feedback; cada producto tiene su propia conversación de discovery y decisiones.

## Regla de trabajo

1. Felipe deja una observación en la pantalla o en la conversación del producto.
2. Se registra como **hecho observado**, **hipótesis**, **decisión** o **vacío**.
3. Se revisa evidencia, referentes y restricciones de datos, tecnología, KYC y licencias.
4. Se propone un flujo pequeño con criterios de aceptación.
5. Recién entonces se implementa en local, se prueba y se documenta lo que no está verificado.

No se presenta una capacidad financiera, integración, dato o permiso como existente si todavía es una hipótesis o está por validar.

## Productos activos

| Producto | Estado actual | Propósito de la conversación | Próximo entregable |
|---|---|---|---|
| Onboarding y KYC progresivo | Discovery profundo | Valor antes de datos, gates por acción material y recuperación | Catastro de referentes, matriz de capacidades y flujo MVP |
| Acompañante financiero | Iteración de prototipo | Ordenar cartolas, cobrar/pagar y hábitos financieros | Mapa de journeys y priorización de fricciones |
| Home Banking | Investigación | Home contextual y personalizado, no góndola | Tesis, momentos y prototipo de bajo riesgo |
| Tarjetas | Investigación | Pagar, datos, movimientos, alertas y beneficios | Mapa de oportunidades, partners y gates |
| Construir mi propio producto | Iteración de experiencia | Pasar de una idea a propuesta con ayuda de IA | Journey plug-and-play y criterios de salida |
| Remesas | Pausado | No investigar ni prototipar en este ciclo | Sólo reabrir con una decisión explícita |

## Plantilla para un comentario de Felipe

> **Pantalla o momento:**
>
> **Lo que veo / lo que no funciona:**
>
> **Qué debería lograr la persona:**
>
> **Referencia, ejemplo o evidencia:**
>
> **¿Es una decisión o una pregunta abierta?:**

## Definición de listo antes de implementar

- Problema y persona claramente descritos.
- Acción principal y resultado esperado.
- Datos necesarios, origen y qué no se debe guardar.
- Eventos y parámetros no sensibles.
- Gates de KYC, permisos, licencias y partners si aplican.
- Estados vacíos, error, espera, reversión y salida.
- Criterios de QA móvil y escritorio.

## Convención de eventos del Lab

La instrumentación aplica sólo a controles dentro del teléfono de la app simulada.

- Los eventos de producto usan `snake_case` y un nombre explícito cuando ya existe una decisión.
- Todo control nuevo dentro del teléfono recibe, mientras se define su contrato final, `phone_control_interacted` o `phone_field_interacted` con `control_key` seguro.
- Nunca se agrega texto de campos, OTP, RUT, correo, teléfono, biometría, documentos ni respuestas crudas como metadata.
- La ficha técnica interna muestra el evento, metadata base y parámetros seguros de la interacción inspeccionada; no se monta en la experiencia pública.
