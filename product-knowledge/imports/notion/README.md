# Protocolo de exportaciones de Notion

Este directorio recibe copias completas que Felipe entregue manualmente mientras no exista conexión directa. Cada paquete es evidencia con fecha; no se edita ni se trata como sincronización en vivo.

## Cómo entregar una exportación

Guardar el `.zip` original o la carpeta exportada bajo:

```text
imports/notion/YYYY-MM-DD-export-NN/
```

Junto al contenido se crea un `MANIFEST.md` con:

```md
# SRC-NOTION-YYYY-MM-DD-NN

- Exportado el:
- Entregado por:
- Espacio / alcance:
- Formato:
- Hash del paquete original:
- Exportación anterior comparable:
- Exclusiones conocidas:
- Contiene información sensible: sí / no / por revisar
- Estado de procesamiento: recibido / inventariado / comparado / revisado / aplicado
```

No incluir secretos, credenciales, datos bancarios personales ni documentos de identidad. Si el paquete contiene datos sensibles, se detiene la incorporación hasta acordar almacenamiento, acceso y retención.

## Pasada de incorporación

1. **Inventariar:** páginas, bases, adjuntos, fecha y ruta original.
2. **Normalizar:** resolver nombres y enlaces sin modificar el paquete fuente.
3. **Comparar:** identificar altas, cambios, movimientos y eliminaciones frente a la exportación anterior.
4. **Clasificar:** evidencia, decisión, regla de negocio, requisito, comentario, riesgo, pregunta o tarea.
5. **Resolver conflictos:** aplicar jerarquía de fuentes; nunca elegir silenciosamente.
6. **Proponer propagación:** fichas, PRDs, contratos, eventos, copy, QA y tickets impactados.
7. **Revisar:** Felipe o el owner correspondiente aprueba, corrige o descarta.
8. **Aplicar:** actualizar Markdown y registrar la decisión fuente y el historial.
9. **Cerrar:** actualizar `verified_through` y el índice; conservar pendientes explícitos.

## Salidas de cada pasada

Cada exportación procesada debe producir:

- `INVENTORY.md`: qué contenía y qué quedó fuera;
- `DIFF.md`: qué cambió respecto de la versión anterior;
- `CONFLICTS.md`: contradicciones que necesitan decisión;
- `PROPAGATION.md`: artefactos que se deben actualizar;
- `MANIFEST.md`: estado final, aprobadores y fecha.

Una eliminación en Notion no borra automáticamente un registro Markdown. Se marca como posible baja y se revisan referencias, reemplazos y obligación de conservar historial.

## Futuro S3

Si se incorpora S3, guardar como mínimo el paquete original, manifiesto, hash, inventario y diff aprobado. Usar versionado, cifrado, retención y acceso por rol. Los Markdown vigentes seguirán siendo la vista legible; S3 será archivo y evidencia, no motor de decisión.
