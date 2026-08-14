# QA Tarjetas — pasada local 1

**Corte:** 2026-08-14 01:42, America/Santiago  
**Estado:** lista para checkpoint; no publicada  
**Dirección:** `DIRECCION-PRODUCTOS-FELIPE.md`  
**Evidencia:** `RESEARCH-TARJETAS-YOL1-2026-08-14.md` + `PRD-TARJETAS-YOL1.md`

## Resultado

La pasada cumple el alcance exploratorio: intención de compra, acceso protegido, último movimiento/alerta y beneficio contextual. La interfaz se mantiene como borrador local con datos sintéticos y no contiene pago, QR, NFC, wallet, tarjeta compartida o corporativa.

## QA estratégico

| Criterio | Resultado | Evidencia |
|---|---|---|
| Valor antes de datos | PASS | La entrada pregunta qué se quiere resolver; no pide identidad ni conexión |
| Intención, no plástico | PASS | Elegir, Datos, Movimiento y Beneficio organizan el recorrido |
| Recomendación ≠ ejecución | PASS | `Preparar mi elección`; copy explícito `no inicia ni confirma pagos` |
| Incertidumbre visible | PASS | Opción, movimiento y beneficio declaran fuente ficticia, frescura y estado |
| Capabilities no prometidas | PASS | Tarjetas sigue `published: false`; emisor/processor/rail y funciones avanzadas quedan en gates |

## QA técnico

- Build de producción Next.js 16.2.6: **PASS**.
- TypeScript y prerender de las rutas: **PASS**.
- Suite local: **39/39 PASS**.
- Tests específicos de Tarjetas: **7/7 PASS**.
- Eventos de Tarjetas: `snake_case`, breves y sin PAN/CVV/PIN/OTP/monto en el nombre.
- Consola del navegador durante el recorrido: **0 errores**.
- No hay `fetch`, persistencia local, clipboard, navegación externa ni conexión a un servicio desde el componente.

## QA UX navegada

Recorrido comprobado en la build local:

1. Selección de Tarjetas conserva la etiqueta `EN INVESTIGACIÓN` y el marco `BORRADOR LOCAL · DATOS SINTÉTICOS · NO PAGA`.
2. `Preparar mi elección` revela una recomendación explicada, no una confirmación de pago.
3. Datos permanece enmascarado, explica el step-up simulado, permite revelar el ejemplo y volver a ocultarlo.
4. Movimiento muestra `PENDIENTE`, explica que no equivale a pagado y `No lo reconozco` no crea reclamo.
5. Beneficio separa elegibilidad, activación y resultado; las condiciones declaran que no existe partner real.

Correcciones de esta revisión:

- `YOL1 · CONCEPTO` cambió a `INSTRUMENTO DE PRUEBA · FICTICIO` para no sugerir emisión.
- Los atributos de evento con puntos cambiaron a `snake_case` canónico.
- Se agregó foco visible a formularios y acciones del carril.

Observación de aprendizaje: los cuatro atajos de la home y la navegación inferior duplican destinos. Se conserva en esta pasada para comparar descubrimiento por intención versus navegación persistente; no debe asumirse como patrón final.

## Factibilidad y gates

| Capacidad | Estado actual | Gate mínimo antes de diseñar ejecución |
|---|---|---|
| Orientar una elección | Prototipo sintético | fuente autorizada, regla versionada, comprensión y atribución |
| Ver datos protegidos | Step-up simulado | rol de YOL1, emisor/partner, autenticación, PCI/threat model, soporte |
| Último movimiento/alerta | Feed ficticio | fuente, semántica de estados, frescura, consentimiento, disputa/soporte |
| Beneficio contextual | Catálogo ficticio | proveedor, elegibilidad, vigencia, activación, conciliación y economics |
| QR/NFC/wallet | Sólo hipótesis | rail/entitlement/tokenización, partner habilitado, regulación, fraude y fallback |
| Compartida/corporativa | Sólo hipótesis | titularidad, roles, límites, responsabilidad, emisor, conciliación y soporte |

## Riesgos abiertos

1. La intensidad/frecuencia del problema en Chile aún no está demostrada.
2. El último movimiento puede pertenecer a Cartola, Tarjetas o ambas con una fuente común.
3. Un catálogo de beneficios sin SLA y conciliación degrada confianza.
4. El step-up correcto no puede decidirse desde la demo.
5. La primera intención dominante requiere prueba con usuarios; no se elige por preferencia interna.

## Restricciones respetadas

No se publicó, no se conectaron datos ni servicios reales, no se crearon partners, no se hizo commit ni push.
