# Índice de conocimiento de producto

**Versión del índice:** `product-kb-2026-08-18.1`
**Última exportación de Notion identificada:** 4 de agosto de 2026
**Última exportación procesada en esta carpeta:** ninguna; se espera el próximo paquete de Felipe.

## Productos

| ID | Producto | Estado de producto | Estado de ficha | Verificado hasta | Ficha |
|---|---|---|---|---|---|
| `prod-acompanante` | Acompañante financiero | exploración activa | semilla | pendiente | [`accompanante-financiero.md`](products/accompanante-financiero.md) |
| `prod-onboarding` | Onboarding | prototipo exploratorio | semilla | pendiente | [`onboarding.md`](products/onboarding.md) |
| `prod-home-banking` | Home Banking | investigación | semilla | pendiente | [`home-banking.md`](products/home-banking.md) |
| `prod-tarjetas` | Tarjetas | investigación | semilla | pendiente | [`tarjetas.md`](products/tarjetas.md) |
| `prod-remesas` | Remesas | pausado | semilla | pendiente | [`remesas.md`](products/remesas.md) |
| `prod-builder` | Construir mi propio producto | exploración/piloto reversible | semilla | pendiente | [`construir-mi-propio-producto.md`](products/construir-mi-propio-producto.md) |

`semilla` significa que la ficha reúne el marco y las fuentes locales actuales, pero todavía debe reconciliarse contra una nueva exportación completa de Notion y owners funcionales.

## Registros

| Prefijo | Registro | Plantilla |
|---|---|---|
| `DEC-` | Decisión o reemplazo de decisión | [`DECISION.md`](templates/DECISION.md) |
| `LRN-` | Comentario, feedback o aprendizaje | [`LEARNING.md`](templates/LEARNING.md) |
| `SRC-` | Fuente o exportación | protocolo de [`imports/notion/`](imports/notion/README.md) |
| `PROD-` | Ficha enriquecida de producto | [`PRODUCT-SHEET.md`](templates/PRODUCT-SHEET.md) |

Los paquetes revisados que deben volver a Notion se preparan en [`outbox/notion/`](outbox/notion/README.md) y conservan estado `preparado`, `incorporado` o `reconciliado`.

## Pendientes de gobierno

- Definir la base o página maestra de Notion que indexará decisiones.
- Definir owners de Producto, Ingeniería, Datos, Seguridad, Legal/Compliance y Operaciones.
- Recibir y registrar una exportación completa posterior al 4 de agosto de 2026.
- Elegir si el futuro archivo S3 guardará el paquete original, el manifiesto y el diff aprobado.
- Conectar las fichas al Lab solo después de estabilizar el esquema; la vista debe leerlas, no duplicarlas.
