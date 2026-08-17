# Checkpoint central — Tarjetas, pasada 1

**Fecha:** 2026-08-14  
**Estado propuesto:** integrar como discovery local reversible  
**Autoridad:** `DIRECCION-PRODUCTOS-FELIPE.md`

## Qué integrar

1. Research primario y traducción a hipótesis en `RESEARCH-TARJETAS-YOL1-2026-08-14.md`.
2. Contrato de producto/datos/eventos/gates en `PRD-TARJETAS-YOL1.md`.
3. Recorrido local en `app/cards-discovery.tsx` y estilos scoped en `app/globals.css`.
4. Ficha interna de Tarjetas en `lib/product-portfolio.ts`.
5. Guardrails automatizados en `tests/cards-discovery.test.mjs`.
6. Evidencia de QA en `QA-TARJETAS-PASADA-1.md`.

Tarjetas debe permanecer `explorable: false` y `En investigación`. La integración no autoriza una capacidad transaccional.

## Qué cambió respecto de referencias previas

- La dirección canónica reemplaza una lectura centrada en emisión por un ecosistema de intenciones.
- El pago/QR dejó de ser CTA o promesa y quedó como intención/gate.
- El acceso seguro usa un instrumento inequívocamente ficticio y step-up explicado.
- El último movimiento se volvió una superficie de confianza con estado, fuente, frescura y ayuda.
- El beneficio separa coincidencia, elegibilidad, activación y resultado.
- QR, NFC, wallet, compartida y corporativa quedaron fuera del prototipo con gates técnicos, regulatorios, de partner y UX.

## Decisiones que necesita el checkpoint central

1. ¿Qué intención probar primero: elegir, datos, movimiento/alerta o beneficio?
2. ¿Tarjetas orienta instrumentos externos, representa un instrumento futuro con partner o ambas capas?
3. ¿Dónde vive canónicamente el último movimiento: Tarjetas, Cartola o un dominio común?
4. ¿Qué fuente podría sostener beneficios con elegibilidad, vigencia y conciliación?
5. ¿Qué acción puede resolver YOL1 ante una alerta sin ser emisor/operador?

## Próxima pasada reversible

Prueba moderada con tareas y datos sintéticos. Medir comprensión de estados, primera intención, razón entendida y confusión entre recomendación/estimación y ejecución/resultado. No agregar capacidades antes de superar los gates del PRD.

## Estado de verificación

- Build: PASS.
- Suite: 39/39 PASS.
- Recorrido local: PASS; 0 errores de consola.
- Publicación/conexiones/commit/push: no realizados.
