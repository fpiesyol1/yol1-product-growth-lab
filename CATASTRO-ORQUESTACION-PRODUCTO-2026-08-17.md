# Catastro de orquestación de producto — YOL1

**Fecha:** 17 de agosto de 2026  
**Propósito:** entender cómo se conectan hoy estrategia, reuniones, Notion, Jira, Product Lab, GitHub, feedback y arquitectura; y dejar una forma única de aprender sin duplicar ni convertir hipótesis en hechos.

> **Regla de prioridad.** Decisión verbal de Felipe → decisión aprobada y registrada → fuente de proyecto vigente → referencia externa. Una exportación histórica, un mockup o una respuesta de IA no reemplazan una decisión.

## Resumen ejecutivo

YOL1 ya tiene material valioso y complementario: un export de Notion con estrategia, roadmap, tareas y protocolos; briefs/contratos por producto; el Product Lab para navegar mockups y conversar sobre la construcción; GitHub para versionar implementación; y una bandeja para feedback e insights. El problema no es falta de información: es que aún no existe un registro canónico que conecte una misma decisión con su evidencia, su especificación, su trabajo de ejecución y su resultado.

La recomendación es no intentar sincronizar todo automáticamente todavía. Primero se necesita un **Registro de Decisiones y Capacidades** pequeño, con enlaces a las fuentes ya existentes. Ese registro se vuelve el puente: recibe acuerdos de reuniones y Notion, enlaza el ticket de Jira cuando exista, alimenta la ficha técnica del Lab y deja explícito qué sigue siendo candidato o por validar.

## 1. Qué existe hoy

| Superficie | Uso real observado | Estado / límite |
|---|---|---|
| **Notion exportado** | Estrategia B2C, roadmap, Kanban, protocolos, research, marca y registros de reuniones. | La última exportación identificada es del **4 de agosto de 2026**. Es evidencia útil, no una conexión en vivo. |
| **Briefs de producto** | Onboarding/KYC, Home Banking, Acompañante y Builder tienen contratos, QA, handoffs y decisiones abiertas en `Documents/Yol1`. | Son fuertes para profundizar un producto, pero no hay índice transversal único. |
| **YOL1 Product Lab** | Mockups navegables, fichas técnicas, feedback, preguntas, gates y riesgos. | Es una superficie de exploración y explicación; no es fuente de verdad para bancos, pagos, KYC ni integraciones. |
| **GitHub** | Código, contratos implementados, pruebas y despliegues. | Indica qué versión técnica existe; no debe ser la cola de decisiones o conversaciones. |
| **Review / Postgres** | Feedback de personas e interacciones de IA cuando `DATABASE_URL` está configurado. | Sin base configurada hay fallback local en el navegador. No sustituye un backlog de producto. |
| **Jira** | No se encontró una exportación, proyecto, ticket ni integración verificable en los materiales revisados. | Debe tratarse como destino de ejecución por conectar, no como una fuente ya integrada. |
| **Referencias externas** | Research de producto, proveedores y estándares técnicos. | Sirven para proponer; nunca cierran una decisión legal, de partner o de arquitectura por sí solas. |

## 2. Hechos, inferencias y vacíos

### Hechos observados

- El protocolo de Notion ya pide: una fuente de verdad por tema, bitácora de cambios y propagación explícita cuando cambia una conclusión.
- El Lab ya distingue productos explorables de productos en investigación, y sus fichas separan decisiones, candidatos, pendientes y riesgos.
- La arquitectura de referencia declara React Native + AWS como candidato; Cognito, CDP/CEP, servicios de dominio y almacenamiento siguen total o parcialmente por validar.
- El feedback público no debe cambiar el producto ni crear ramas automáticamente. La revisión humana es una etapa separada.
- El repositorio contiene contratos y pruebas; por tanto puede expresar qué comportamiento está implementado, pero no por sí solo si ese comportamiento fue aprobado para producción.

### Inferencias operativas

- Notion es hoy el mejor hogar para contexto de negocio, decisiones de reunión y roadmap; GitHub para artefactos técnicos y código; Jira debería ordenar trabajo ejecutable una vez que la unidad de trabajo esté madura.
- La ficha del Lab debería **leer** el registro canónico y sus fuentes, no convertirse en otra versión independiente de la decisión.
- Los servicios y datos necesitan un catálogo explícito para evitar que una pantalla suponga que existe una integración, tabla o permiso que todavía no existe.

### Vacíos que no se deben inventar

- Qué base o proyecto Jira es el oficial, qué tipos de issue se usarán y quién puede mover estados.
- Qué páginas/bases de Notion siguen vivas después de la exportación del 4 de agosto.
- Qué sistema será la fuente de verdad de cada dominio real, qué partner existe y qué datos están autorizados.
- Quién será owner de aprobación por producto, arquitectura, datos, seguridad, Legal y Customer Success.

## 3. Modelo único propuesto

No se crea un sistema nuevo para cada herramienta. Se usa un registro liviano que **enlaza** lo existente.

```text
Reunión / Notion / research / feedback
              ↓  (captura y clasificación)
Registro de evidencia y decisiones
              ↓
Brief + ficha de producto + contrato técnico
              ↓
Jira: trabajo ejecutable y owner
              ↓
GitHub: implementación + pruebas + versión
              ↓
Lab: mockup, feedback, QA y aprendizaje
              ↺  (resultado enlazado a la decisión original)
```

### Los cinco registros mínimos

| Registro | Una fila responde | Campos mínimos | Dónde vivir inicialmente |
|---|---|---|---|
| **Evidencia** | ¿Qué vimos o escuchamos y dónde está? | `source_id`, tipo, fecha, autor, enlace/ruta, resumen, alcance, confianza | Notion o Markdown versionado |
| **Decisión** | ¿Qué se eligió y por qué? | `decision_id`, estado, texto, owner, fecha, evidencia enlazada, impacto, reversibilidad | Notion como índice; espejo legible en Git si afecta código |
| **Capacidad / servicio** | ¿Qué sistema hace qué y bajo qué gate? | `capability_key`, estado, dominio, owner, proveedor, datos lee/escribe, API/eventos, permisos, riesgos | Catálogo técnico versionado |
| **Especificación de pantalla** | ¿Cómo se debe construir y verificar? | producto/pantalla, problema, flujo, lectura/escritura, eventos, estados, QA, decisiones abiertas | PRD + ficha del Lab |
| **Trabajo ejecutable** | ¿Qué se construye ahora y quién lo cierra? | `jira_key`, owner, criterio de aceptación, dependencia, decisión fuente, PR/versión | Jira, cuando esté definido |

### Estados que no deben mezclarse

- **Evidencia:** capturada → revisada → desactualizada.
- **Decisión:** propuesta → aprobada → implementada → medida → reemplazada.
- **Capacidad:** inexistente → candidata → validando → disponible controlada → operativa.
- **Trabajo:** listo para ejecutar → en curso → bloqueado → validación → cerrado.
- **Feedback:** nuevo → revisando → aplicar → guardar para después → resuelto → ignorado.

Un ticket cerrado no significa automáticamente que una decisión esté medida. Una idea aprobada no significa que una capacidad esté disponible.

## 4. Rol de cada lugar

| Lugar | Debe contener | No debe contener / hacer |
|---|---|---|
| **Notion** | Contexto, reuniones, estrategia, roadmap, evidencia, decisiones de negocio y enlaces a entregables. | Copias de código, secretos o contratos técnicos sin dueño/versionado. |
| **Jira** | Trabajo acotado, owner, dependencia, aceptación, vínculo a decisión y PR. | Research crudo, transcripciones largas o decisiones sin evidencia. |
| **Product Lab** | Mockups, explicación de producto, ficha técnica, riesgos, preguntas, feedback y recorridos QA. | Prometer servicios reales, ejecutar dinero, guardar datos sensibles o decidir por sí solo. |
| **GitHub** | Implementación, tests, contratos, ADRs, documentación técnica y releases. | Servir como bandeja de opiniones, actas o decisiones verbales sin registro. |
| **Postgres/Review** | Feedback compartido, respuestas IA y estado editorial cuando esté configurado. | Convertirse en fuente de verdad de producto, CRM o historial completo de reuniones. |
| **Catálogo de servicios** | Qué existe/candidato, su owner, contrato, datos y gates. | Inventar partners o afirmar disponibilidad por un mockup. |

## 5. Cómo entra una reunión al sistema

Al cerrar una reunión o recibir un audio, no se reescribe el producto. Se hace una pasada de 15 minutos:

1. **Capturar:** enlace a Notion, audio o documento y un resumen neutral.
2. **Clasificar cada punto:** hecho observado, hipótesis, decisión, pregunta o tarea.
3. **Anclar:** relacionar el punto con producto, `capability_key`, pantalla y fuente existente.
4. **Propagar:** si cambia una conclusión, listar qué brief, ficha, ticket o copy debe revisarse. No cerrar sin esa lista.
5. **Elegir salida:**
   - decisión aprobada → actualizar registro y generar/actualizar Jira;
   - hipótesis → research o experimento;
   - pregunta técnica → ficha/QA técnico;
   - comentario de UX → feedback del Lab;
   - sin suficiente evidencia → queda “por validar”, no se implementa como hecho.

### Plantilla de captura para reunión

```md
## [REU-YYYY-MM-DD-XX] Título

Fuente: enlace o ruta
Participantes: por completar

| Tipo | Enunciado | Producto/capacidad | Estado | Fuente / impacto |
|---|---|---|---|---|
| Decisión | ... | onboarding / financial_data_connect | propuesta/aprobada | DEC-... / PRD, Jira |
| Pregunta | ... | consent | por validar | abrir investigación |
| Hecho | ... | CDP | revisado | evidencia enlazada |
| Tarea | ... | ... | lista para Jira | criterio de aceptación |
```

## 6. Catálogo de capacidades y servicios

Antes de preguntar “¿qué servicio llamamos?”, la respuesta debe venir de esta ficha, no de memoria:

```md
# CAP-<dominio>-<acción>

Estado: inexistente | candidata | validando | disponible controlada | operativa
Owner: por definir
Problema y capability: qué habilita, para quién y en qué momento
Decisión fuente: DEC-... / enlace

Entrada: datos mínimos, clasificación y consentimiento
Lecturas: system of record + read model
Escrituras: entidad, comando, idempotencia y auditoría
Eventos: catálogo aprobado, fuente y propiedades permitidas
Integraciones: API/BFF/proveedor/cola, todas con estado candidato o aprobado
Gates: seguridad, KYC, partner, licencia, operación y soporte
Errores y reversión: estados, ruta humana y observabilidad
Salida: métrica de aprendizaje y criterio para ampliar/revertir
```

### Reglas de datos

- El sistema de registro determina el estado; el warehouse y analytics no autorizan producto.
- CDP/CEP recibe activación consentida y minimizada; no debe ser repositorio de KYC, documentos ni datos financieros crudos.
- Cada dato en una ficha dice: fuente, clasificación, frescura, lectura/escritura, retención y consumer.
- Todo cambio material genera trazabilidad: actor/servicio, `event_id`, `event_at`, correlación, versión e idempotencia.

## 7. Qué debe mejorar el Lab

El Lab ya tiene la base para ser la superficie común. Para hacerlo consistente con el sistema propuesto, cada ficha debería mostrar enlaces de referencia, no duplicar contenido:

1. **Decisión fuente:** ID + estado + enlace a su página Notion/registro.
2. **Capacidad y sistemas:** tabla de `system of record`, read model, evento interno, CDP/warehouse y owner; todos con certeza visible.
3. **Contrato de pantalla:** datos mostrados, datos generados, endpoints/commands candidatos, eventos y propiedades permitidas.
4. **Gates:** KYC, consentimiento, partner, licencia, riesgo y operación separados; “por validar” por defecto.
5. **Experiencia y Error capa 8:** fricción de persona, condición técnica y recorrido QA no confundidos entre sí.
6. **Input útil:** cada comentario debe indicar pantalla/punto/tipo y acabar en la bandeja editorial; luego puede enlazarse a una decisión o Jira, nunca actualizar directamente la ficha.

## 8. Ritmo operativo recomendado

| Momento | Qué se revisa | Salida concreta |
|---|---|---|
| Después de reunión | Captura, clasificación y contradicciones | registro REU + decisiones/tareas candidatas |
| Diario corto | Feedback, preguntas técnicas y bloqueos | bandeja priorizada; no más de 3 decisiones a resolver |
| Antes de diseñar | Brief, capacidad, datos, gates y referencias | definición de listo para propuesta visual |
| Antes de construir | ficha/PRD, aceptación, contrato de datos y evento | ticket Jira listo + owner + dependencias |
| Antes de publicar | QA visual, técnico, seguridad y copy | checklist de release + rollback |
| Semanal | decisiones cambiadas y propagación | changelog + actualización de fuentes impactadas |
| Mensual/export | nueva exportación de Notion y estado de servicios | inventario de frescura y diferencias pendientes |

## 9. Ruta de implementación sin integrar sistemas prematuramente

### Lote 1 — ordenar, sin credenciales

- Crear índice de decisiones, evidencia, capacidades y productos con los IDs de esta propuesta.
- Registrar la versión/frescura de cada export de Notion.
- Agregar campos de referencia a las fichas del Lab y a los tickets manuales.
- Migrar las preguntas repetidas de feedback a “pregunta técnica”, “decisión” o “comentario UX”.

### Lote 2 — vínculo con ejecución

- Confirmar proyecto Jira, tipos de issue, estados y owners.
- Hacer que cada ticket tenga una decisión/brief fuente y un criterio de aceptación enlazable.
- Crear el catálogo técnico de capacidades, empezando por Onboarding/KYC y Acompañante.

### Lote 3 — conectores con aprobación explícita

- Ingesta **de solo lectura** de Notion y Jira, con marca de fuente y fecha de actualización.
- Comparador que detecte cambios y proponga propagación; nunca sobrescribe decisiones o PRDs en automático.
- Acceso por roles, auditoría y políticas de retención antes de cargar datos reales o transcripciones.

## 10. Primeros entregables recomendados al volver

1. Elegir qué página/base de Notion será el índice maestro de decisiones.
2. Identificar el proyecto Jira oficial y los estados que usarán producto e ingeniería.
3. Crear los primeros tres registros de capacidad: `financial_data_connect`, `debt_request` y `proposal_draft`.
4. Llevar una reunión real por el formato REU y revisar si genera un Jira/brief/ficha coherente.
5. Definir quién aprueba decisiones de producto, datos, arquitectura, seguridad/legal y operaciones.

## Conclusión

La integración correcta no es una gran sincronización; es una cadena de trazabilidad. Una reunión deja evidencia. La evidencia sustenta una decisión. La decisión define una capacidad y una pantalla. La capacidad se convierte en un ticket verificable. GitHub prueba una versión. El Lab la hace entendible, recoge aprendizaje y devuelve ese aprendizaje a una nueva decisión. Así cada herramienta aporta algo distinto y ninguna intenta reemplazar a las demás.
