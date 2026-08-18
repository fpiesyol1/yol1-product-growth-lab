# Bandeja de salida hacia Notion

Esta carpeta prepara proyectos, comentarios, aprendizajes y decisiones para que Felipe o un owner los incorpore manualmente a Notion mientras no exista conexión directa.

## Qué se publica

Solo contenido revisado que tenga:

- ID estable (`PROD-`, `DEC-` o `LRN-`);
- resumen legible y sin secretos ni datos sensibles;
- producto, owner, estado y fecha;
- fuentes y enlaces a artefactos de detalle;
- destino propuesto dentro de Notion;
- modo `crear`, `actualizar` o `reemplazar`, sin ambigüedad;
- lista de pendientes y decisiones que todavía no están aprobadas.

Los comentarios crudos no se publican como reglas. Primero se clasifican con [`../../templates/LEARNING.md`](../../templates/LEARNING.md) y mantienen su estado editorial.

## Estructura de un paquete

```text
outbox/notion/YYYY-MM-DD-bundle-NN/
├── MANIFEST.md
├── products/
├── decisions/
└── learnings/
```

Plantilla de `MANIFEST.md`:

```md
# NOTION-OUT-YYYY-MM-DD-NN

- Preparado el:
- Preparado por:
- Revisor:
- Destino Notion propuesto:
- Registros incluidos:
- Registros excluidos y motivo:
- Contiene información sensible: no
- Estado: preparado / revisado / incorporado / rechazado
- Incorporado el:
- URL o ID de destino confirmado:
- Exportación de Notion mínima que ya contiene el cambio:
```

## Confirmación de incorporación

Después de cargar el paquete a Notion:

1. registrar URL o ID de la página/base de destino;
2. marcar qué registros se incorporaron y cuáles se corrigieron o rechazaron;
3. no borrar el Markdown: sirve como evidencia del contenido enviado;
4. en la siguiente exportación completa, comprobar que el cambio volvió desde Notion;
5. recién entonces marcar el circuito como reconciliado.

Esto evita dos versiones silenciosas: una salida está **preparada**, **incorporada** o **reconciliada**; nunca “sincronizada” por suposición.
