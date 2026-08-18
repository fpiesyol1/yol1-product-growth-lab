# Capa de enriquecimiento de producto — YOL1

Esta carpeta conecta el contexto vivo de YOL1 con las fichas, decisiones, requisitos y aprendizajes que usa el Product Lab. Su objetivo es que cada producto mantenga todos sus frentes coordinados sin convertir una exportación histórica, un comentario o una respuesta de IA en una decisión.

## Contrato de fuentes

| Superficie | Rol |
|---|---|
| **Notion** | Centro humano principal: notas, reuniones, estrategia, reglas de negocio, repositorios y decisiones aprobadas. |
| **`product-knowledge/`** | Espejo Markdown trazable para lectura, comparación, PRDs, agentes y futuras vistas internas del Lab. |
| **Código, contratos y tests** | Evidencia de lo que una versión implementa; no reemplazan la decisión de negocio. |
| **Fuentes primarias externas** | Evidencia regulatoria, técnica o de proveedor. No equivalen a aprobación de Legal, Seguridad o Ingeniería. |
| **S3 futuro** | Archivo durable de exportaciones y artefactos importantes, con versión e integridad. No será el lugar donde se decide. |

La prioridad vigente sigue siendo: decisión verbal posterior de Felipe → decisión aprobada y registrada → fuente de proyecto vigente → referencia externa. Notion es el mejor centralizador, pero una página antigua no prevalece solo por vivir allí.

## Unidad principal: ficha enriquecida

Cada producto tiene una ficha en [`products/`](products/README.md). Todas usan el contrato de [`templates/PRODUCT-SHEET.md`](templates/PRODUCT-SHEET.md) y deben declarar:

1. propósito, persona, problema y estado del producto;
2. alcance y no-alcance;
3. reglas de negocio y excepciones;
4. requisitos funcionales, técnicos y no funcionales;
5. datos, privacidad, seguridad y retención;
6. normativa, KYC, licencias, partners y aprobación requerida;
7. capacidades, integraciones y sistemas fuente de verdad;
8. eventos, métricas, GTM, operación y soporte;
9. riesgos, errores, reversión, QA y criterios de salida;
10. decisiones, comentarios, aprendizajes, contradicciones y fuentes.

Cada afirmación material lleva cuatro datos: **estado**, **fuente**, **owner** y **fecha de revisión**. Los estados permitidos son `decidido`, `candidato`, `por_validar` y `fuera_de_alcance`; cualquier matiz como “para el Lab”, “para el prototipo” o “si se reactiva” pertenece a la síntesis, no al campo Estado.

`source_export_id` identifica la última exportación de Notion efectivamente aplicada y `verified_through` su fecha de corte. Ambos permanecen `null` mientras no exista una exportación completa inventariada, comparada y revisada; la fecha de creación de una ficha semilla no equivale a verificación de Notion.

## Cómo entra el conocimiento

```text
Nota, reunión, comentario, research o export de Notion
                         ↓
                captura con fuente y fecha
                         ↓
         clasificación: evidencia / decisión /
          regla / requisito / feedback / pregunta
                         ↓
              revisión humana de conflictos
                         ↓
      ficha enriquecida + PRD + contrato + QA
                         ↓
           implementación y aprendizaje medido
                         ↺
```

Reglas operativas:

- importar nunca sobrescribe automáticamente una ficha;
- un comentario se conserva como comentario hasta que alguien lo promueve;
- una decisión reemplazada no se borra: se enlaza con `supersedes`;
- una regla sin fuente o sin fecha queda `por_validar`;
- cambios regulatorios o técnicos sensibles requieren fuente primaria y aprobación competente;
- cada actualización lista los artefactos que debe propagar: ficha, PRD, copy, contrato, evento, QA o ticket;
- la IA puede extraer, comparar y proponer; no aprueba ni publica decisiones.

## Exportaciones de Notion

Cuando Felipe entregue una exportación completa, se conserva sin editar bajo `imports/notion/<fecha>-<id>/` y se procesa con el protocolo de [`imports/notion/README.md`](imports/notion/README.md). El índice registra qué exportación se leyó y hasta qué fecha está verificado cada producto.

La salida útil de cada importación no es una copia total de Notion. Es un diff revisable con:

- contenido nuevo o cambiado;
- contradicciones con decisiones vigentes;
- reglas o requisitos potencialmente vencidos;
- fichas y documentos impactados;
- propuestas de actualización pendientes de aprobación.

El camino de vuelta usa [`outbox/notion/`](outbox/notion/README.md): genera paquetes Markdown de productos, decisiones y aprendizajes ya revisados para incorporarlos manualmente a Notion. El paquete solo se considera reconciliado cuando una exportación posterior confirma que quedó registrado allí.

## Comentarios y aprendizajes

Los comentarios de equipo, personas usuarias o IA usan [`templates/LEARNING.md`](templates/LEARNING.md). La captura conserva origen y contexto; la promoción posterior decide si termina como:

- evidencia;
- regla de negocio;
- decisión;
- requisito;
- cambio de diseño;
- caso de QA;
- tarea de ejecución;
- aprendizaje descartado, con motivo.

## Diferencia con `knowledge/`

`knowledge/` sigue siendo la base conversacional aprobada y sintética que puede usar el Acompañante. `product-knowledge/` contiene conocimiento interno de producto y puede incluir riesgos, normativa, arquitectura y decisiones. Nada pasa de esta carpeta a una respuesta pública sin revisión editorial explícita.

## Definición de ficha al día

Una ficha está `al_dia` solo si:

- no tiene una decisión reemplazada presentada como vigente;
- cada frente crítico tiene estado y fuente;
- `verified_through` corresponde a la última exportación revisada y permanece `null` si todavía no existe;
- sus contradicciones tienen owner o siguiente acción;
- los requisitos sensibles no se presentan como aprobados sin evidencia;
- los cambios aprobados fueron propagados o aparecen en una lista explícita de pendientes.
