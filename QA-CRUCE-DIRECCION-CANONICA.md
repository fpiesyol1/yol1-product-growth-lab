# QA — cruce contra Dirección canónica de Felipe

**Fuente prioritaria:** `DIRECCION-PRODUCTOS-FELIPE.md` (14 de agosto de 2026).  
**Alcance:** nomenclatura, copy, navegación y promesas de producto en implementación y documentos. Sin cambios de código.  
**Nota de prueba:** localhost no respondió durante esta pasada; los puntos de recorrido requieren confirmación visual/interactiva posterior.

## Resumen

La dirección canónica ordena bien el portafolio: Acompañante y Onboarding entregan valor progresivo; Home Banking y Tarjetas requieren investigación disciplinada; Remesas queda completamente fuera; Builder guía propuestas sin sincronización mágica; Reviews organiza aprendizaje sin automatizar el core.

La implementación todavía mezcla esa dirección con una etapa anterior del Lab. Las contradicciones relevantes están en cuatro bordes: **Tarjetas ya parece producto aunque el research es requisito**, **Builder parece una integración disponible**, **la ficha PRD es pública**, y **los documentos describen estados/productos/copy previos**.

## P0 — corregir antes de presentar estas rutas como disponibles

### D-01 · Tarjetas se comporta como producto operativo antes del research obligatorio

**Dirección canónica:** Tarjetas requiere research de tendencias, seguridad, partners, regulación Chile y elección de hipótesis antes de diseñarlo como ejecutable.  
**Implementación actual:** el selector dice `NO PUBLICADO`, pero abre un teléfono navegable con cuatro rutas: elegir cómo pagar, ver datos, último movimiento y beneficio. Incluye número de tarjeta, CVV ficticio, “confirmar ejemplo”, movimiento pendiente y beneficio estimado.  
**Inconsistencia UX:** el visitante recibe a la vez “no publicado” y una experiencia extensa que simula instrumento, credenciales y decisión de pago; aunque los guardrails son correctos, el nivel de detalle hace que parezca más que un research draft.  
**Decisión necesaria:**

- mantener Tarjetas solo en research y mover este borrador al modo Equipo, **o**
- autorizar explícitamente un prototipo de hipótesis única, con estado `Disponible para explorar · borrador de investigación` y una intención dominante.

No conviene mantener el estado actual híbrido.

### D-02 · Builder afirma una conexión ChatGPT/Claude que la dirección condiciona a compatibilidad real

**Dirección canónica:** enseñar conexión con un cliente compatible **cuando exista**; no insinuar que ChatGPT/Claude permiten esa instalación si la integración todavía no existe.  
**Implementación actual:** botones “Conectar mi ChatGPT” y “Conectar mi Claude”, instrucciones de menú específicas y URL MCP, aunque la ficha indica MCP remoto/OAuth “etapa posterior, no conectado aún”.  
**Riesgo:** una persona puede concluir que la conexión está soportada y que verá sus pantallas materializarse en el Lab.  
**Resolución:** usar copy condicional: **“Guía para conectar un cliente compatible”** y mostrar ChatGPT/Claude solo si sus rutas fueron verificadas. Si no, conservarlos como referencias visuales claramente etiquetadas `por validar`.

### D-03 · Ficha técnica de PRD sigue expuesta en el flujo público

**Dirección canónica:** la ficha alimenta un PRD, pero no se muestran detalles internos confusos al público.  
**Implementación actual:** bajo Acompañante, Onboarding, Builder y ahora Tarjetas se ve arquitectura, fuentes, datos, KYC, licencias, riesgos y preguntas abiertas.  
**Resolución:** trasladar a `/review` / modo Equipo. La app pública solo necesita evidencia de la situación, límite de la simulación y siguiente paso.

### D-04 · Remesas no debe estar “tomando forma” ni contener hipótesis en este ciclo

**Dirección canónica:** “Pausado. No diseñar, no investigar y no abrir hipótesis”.  
**Implementación/copy actual:** estado editorial “Remesas todavía está tomando forma. Cuando tengamos las piezas claras…” y descripción sobre envíos/tipo de cambio/licencias.  
**Resolución:** usar un único mensaje neutral: **“Remesas no está siendo trabajada en este ciclo.”** Sin research, claims de operación ni preguntas de diseño.

## P1 — coherencia de lenguaje y navegación

### D-05 · Estados de producto contradictorios

| Superficie | Estado actual | Conflicto |
|---|---|---|
| Selector | `PUBLICADO` / `NO PUBLICADO` | “Publicado” suena operacional, no prototipo. |
| Editorial lateral | `FINANZAS QUE AYUDAN A VIVIR` o `ESPACIO NO PUBLICADO` + `en pausa` | Mezcla estado de portfolio con tono editorial. |
| Tarjetas | `NO PUBLICADO` + teléfono/navegación propios | estado y comportamiento discrepan. |
| Documentos | “solo un producto publicado”, “cinco espacios no publicados” | no refleja Onboarding/Builder/Tarjetas actuales. |

**Contrato sugerido:** `Disponible para explorar`, `En investigación`, `En revisión (equipo)`. Reservar `Publicado` para un producto que efectivamente se comunica como disponible más allá del Lab.

### D-06 · La promesa “Tu plata, más clara” se aplica a productos que no son Acompañante

**Dirección canónica:** Acompañante usa “Entiende tus finanzas. Simplifica tu vida.”; Builder usa “En este espacio, el próximo producto lo construyes tú.”  
**Implementación:** el bloque lateral usa “Tu plata, más clara” para cualquier producto marcado como `published`, incluidas Onboarding y Builder.  
**Resolución:** editorial por producto, no por booleano `published`. La promesa financiera queda exclusiva de Acompañante.

### D-07 · Acciones de Acompañante todavía conservan nombres antiguos

**Dirección canónica:** costo = `Ignorar / Revisar / Dividir si aplica`; cobro = `Cobrar / Ignorar`.  
**Implementación/documentos:** Cartola y README siguen con `Ya lo vi`, `Dividir/Cobrar`; Cobrar/Pagar usa `Enviar cobro`, `Simular pago`, `Ya me pagaron` y `Ya pagué`.  
**Resolución:** mantener acciones por contexto y adoptar un contrato único:

- `Ignorar` para ocultar sugerencia;
- `Revisar` para abrir evidencia;
- `Preparar reparto` o `Dividir` solo para gasto compartido;
- `Preparar cobro` / `Preparar pago` antes de cualquier salida externa;
- `Marcar como resuelto` solo tras confirmación explícita.

No usar “Ya lo vi” como equivalente a ignorar o resolver.

### D-08 · Copy de mensaje de cobro continúa pareciendo oferta operativa

La vista previa usa “Sigue este link si quieres pagar con tu banco o descarga YOL1.” aunque etiqueta el mensaje como demo. La dirección prohíbe prometer pagos/bancos/WhatsApp como capacidad real.  
**Resolución:** `Texto de ejemplo · no enviado` y copy hipotético: “Aquí aparecería una forma de resolver este pendiente cuando la capacidad esté aprobada.”

### D-09 · Estados de Reviews no usan exactamente el vocabulario canónico

**Dirección canónica:** `nuevo`, `revisar`, `para después`, `resuelto`, `ignorado/equivocado`; vista por tema y conversión a guía/MD.  
**Implementación:** `Nuevo`, `En revisión`, `Para después`, `Convertido`, `Ignorado`, y `Corregir` para IA.  
**Resolución:** elegir el contrato de la dirección: usar **Resuelto** como estado y “convertir en mejora/guía/proyecto” como destino, no como estado. Agregar la vista **Por tema** antes de prometer orquestación editorial.

### D-10 · Eventos y metadata no respetan el contrato canónico

**Dirección canónica:** eventos cortos snake_case, metadata `event_at`, `product_key`, `screen_key`, `action_key`, plataforma, versión, origen, consentimiento y correlación.  
**Implementación:** la ficha usa `timestamp`, `producto`, `pantalla`, `acción`, `versión`; además deriva eventos desde texto/aria y usa `data-event` con puntos.  
**Resolución:** tracking plan tipado. La ficha debe mostrar un evento corto oficial y metadata separada con llaves canónicas; no inferir evento desde copy o hover.

### D-11 · Onboarding respeta el principio, pero el gate material todavía es abstracto

“Quiero activar una función” no responde qué acción concreta vuelve justo el registro. La dirección exige que el diseño responda ese punto.  
**Resolución:** llevar al gate una intención específica (`recibir dinero`, `transferir`, etc.) solo cuando esté autorizada; si no existe aún, mantener exploración y explicar el próximo paso sin fingir una activación.

## P2 — documentación y mantenimiento

### D-12 · README, MVP-SPEC y PRODUCT-DESIGN conservan decisiones reemplazadas

| Documento | Ejemplos de conflicto |
|---|---|
| `README.md` | un solo producto publicado; Inicio invita a elegir IA/demo; Experimentos aún listado; inspector de eventos; ficha visible al público. |
| `MVP-SPEC.md` | Onboarding lineal teléfono/email → OTP → exploración; Builder como futuro/no intake; espacios no publicados sin journeys; Ganar “Próximamente”. |
| `PRODUCT-DESIGN.md` | diagonal decorativa en cada pantalla; Ganar como placeholder; nomenclatura `Cobrar/Repartir`. |

**Acción:** archivar esas decisiones o sincronizar el documento desde la dirección canónica; no usarlos como fuente de trabajo mientras contradigan a Felipe.

### D-13 · “Datos ficticios / demo / simulación” sigue demasiado disperso

La dirección pide no prometer capacidades; no exige repetir disclaimer en cada bloque. Consolidar en una fórmula contextual cerca de acciones sensibles: **“Ejemplo: no se mueve plata.”** Evitar “demo local”, “ficticio”, “simulado” y “prototipo” como rótulos alternativos para el mismo límite.

## Navegación a validar cuando localhost vuelva

1. Onboarding → explorar Acompañante sin OTP → intentar una acción material concreta → gate claro.
2. Acompañante Inicio → costo/cobro → CTA contextual → Cartola o Cobrar y pagar sin ambigüedad semántica.
3. Tarjetas: confirmar si debe ser research de equipo o un prototipo exploratorio autorizado; evitar que `NO PUBLICADO` abra una experiencia que parece producto real.
4. Builder: comprobar que copiar URL/prompt no promete sincronización ni acceso a chat privado.
5. Feedback → Reviews: verificar tres bandejas, estado `Resuelto`, vista por tema y destino editorial.
6. Remesas: confirmar que queda inerte, sin intención de diseño ni research.

## Orden recomendado

1. Resolver D-01 a D-04: frontera de Tarjetas/Builder/ficha pública/Remesas.
2. Unificar D-05 a D-10: estados, promesas por producto, CTAs y tracking plan.
3. Sincronizar documentos con la dirección canónica y retirar reglas de UI obsoletas.
4. Validar recorridos reales en móvil/escritorio antes de publicar cambios.
