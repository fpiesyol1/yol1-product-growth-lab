# YOL1 Product Growth Lab — criterio de diseño

## Propósito

Probar la experiencia del asistente financiero cotidiano de YOL1 con datos sintéticos antes de conectar bancos, cartolas reales o pagos.

## Fuente de marca vigente para este laboratorio

La referencia visual es `Brand Yol1.pptx`. Esta implementación usa activos oficiales extraídos del archivo y traduce sus principios a una experiencia B2C móvil. Sigue siendo un prototipo exploratorio: no pretende reemplazar un design system oficial.

- Night / petrol `#112E3C`: contexto, foco y contraste profundo.
- Acid `#80EF0C`: resultado y acción principal, usado con concentración.
- Cream / mist `#FAEDDC`: superficie principal y respiro editorial.
- Aqua: interacción e hipótesis.
- Amarillo: advertencias o decisiones abiertas.
- Coral: riesgo o algo que requiere revisión, nunca fraude afirmado.
- Neón suave `#FF8FB4`: cercanía social, personas, grupos y recordatorios; nunca error, alerta ni dato crítico.
- Violeta suave `#B9A7FF`: curiosidad, feedback y exploración; no indica disponibilidad ni roadmap.
- Söhne cuando esté disponible, con fallback de sistema; mono para montos, fechas y códigos.

## Acentos semánticos por módulo

Cada pantalla usa un solo color emocional dominante. Los demás colores aparecen solo cuando conservan su significado funcional; no se rellenan todas las tarjetas.

- **Inicio — Acid:** descubrimiento, hallazgo y CTA. El rosa aparece únicamente como un gesto secundario pequeño.
- **Mis Finanzas — Aqua/petróleo:** control, calma y trazabilidad. Coral se reserva para una anomalía concreta.
- **Cartola — Navy/aqua:** precisión, selección y confianza. Coral indica alerta; amarillo, decisión pendiente.
- **Ahorrar — Acid:** valor potencial y rango estimado, nunca ahorro garantizado. Amarillo identifica algo por revisar.
- **Cuentas Claras — Acid/aqua:** acuerdos, equilibrio y cierre. Neón suave queda para personas; coral sólo para fallas explícitas.
- **Tu plan de deuda — Aqua/amarillo:** evidencia, calma e información faltante; nunca usa verde como score de salud.
- **Experimentos — Violeta suave:** curiosidad y feedback. No comunica roadmap, fase ni disponibilidad.

Los tokens viven en `app/globals.css`: `--neon-pink`, `--violet-soft` y `--violet-ink`. Texto Night sobre rosa/violeta mantiene contraste; estos acentos no se usan para información financiera crítica.

## Sistema dual oscuro / claro

El Lab inicia oscuro. Si la persona no ha elegido, se respeta `prefers-color-scheme`; una elección manual queda en `localStorage`. Ambos modos comparten roles, no valores literales:

- `--page-bg`: escenario exterior.
- `--app-bg`: fondo base del producto.
- `--surface`, `--surface-raised`, `--surface-soft`: jerarquía de superficies sin llenar cada tarjeta de color.
- `--text`, `--text-strong`, `--muted`: lectura principal, énfasis y apoyo.
- `--line`, `--line-strong`: separación y bordes.
- `--input`: campos conversacionales y de flujo.
- `--selected-bg`: selección aqua con contraste en ambos temas.
- `--shadow`: profundidad contextual.
- `--focus`: foco accesible.
- `--toast` / `--toast-text`: confirmación visible dentro del teléfono, también en móvil.

Los tokens de marca (`--acid`, `--aqua`, `--yellow`, `--coral`, `--neon-pink`, `--violet-soft`) conservan el mismo significado en ambos modos. Dark no es una inversión automática de beige: usa superficies petrol y jerarquía tipográfica; Light usa mist/blanco con cream solo como gesto secundario.

## Dirección de interfaz

- El producto es móvil primero. En escritorio, el teléfono es protagonista dentro de un escenario editorial, no una miniatura decorativa.
- Una idea dominante por pantalla, con acciones primarias evidentes y rutas secundarias de menor intensidad.
- Jerarquía por escala, ritmo, bloques de color y aire; evitar grillas de tarjetas homogéneas y estética de banca fría.
- Gestos gráficos abstractos —halo, subrayado, señal— pueden dar energía, pero nunca sustituyen la marca oficial.
- Los cierres de pantalla se resuelven con aire, jerarquía y el acento propio de cada módulo; no se agregan diagonales ni triángulos decorativos al pie.
- Alto contraste, foco visible, áreas táctiles amplias, lectura sin overflow y movimiento opcional.

## Portfolio y especificación viva

El selector superior se trata como una repisa editorial, no como navegación de una suite disponible. La experiencia usa `Para explorar` para prototipos de aprendizaje y `En investigación` cuando no hay un flujo disponible; ninguno equivale a publicación operativa. Los estados vacíos usan tipografía, halos, cinta, bloques y un sticker animado propio en CSS. Nunca usan logos de terceros ni ilustraciones que sugieran una capacidad real.

Las fichas de producto se muestran debajo de la composición principal, a ancho completo, solo en los productos explorables. Conectan la vista simulada con evento, metadata, arquitectura candidata, fuentes, KYC, licencias, riesgos y preguntas para que diseño e ingeniería puedan conversar sobre lo que se ve. Los productos en investigación o pausa no muestran ficha técnica ni simulan una capacidad disponible. Feedback permanece disponible en todos los espacios para atribuir cada comentario a su producto y pantalla. Los estados de certeza de la especificación son semánticos:

- `No aplica`: aqua/control; la razón explica por qué no corresponde al contexto actual.
- `Por validar`: amarillo/decisión abierta; nunca se presenta como exención ni requisito.
- `Requerido`: coral/riesgo regulatorio únicamente cuando exista fuente aprobada.

El catálogo base conserva evento estable y metadata separada para producto, pantalla, acción y origen. La ficha resume esa trazabilidad para la acción inspeccionada; verla no implica que el evento se emita ni que exista analytics productivo.

Los nuevos tokens `--decision-bg` y `--decision-text` conservan contraste del estado amarillo en dark y light. Violeta sigue reservado para exploración/feedback y el perro animado respeta `prefers-reduced-motion`.

## Reglas de experiencia

1. Una pantalla debe tener una tarea principal y una acción clara.
2. Cada alerta debe mostrar qué la activó, de dónde vienen los datos y qué puede hacer la persona.
3. Las transferencias entre cuentas propias no inflan ingresos ni egresos.
4. El Acompañante muestra sólo un resumen social; personas, grupos, cobros y abonos viven en Cuentas Claras.
5. La cartola conserva evidencia: fecha, hora, código, fuente, monto y una acción contextual. La fila principal prioriza fecha, movimiento y monto; banco, código y hora viven en el detalle.
6. Los datos del laboratorio son ficticios. No se integra ninguna cuenta ni pago desde este repositorio.
7. Una acción no termina en un toast: revisar, guardar nota, ignorar o votar deja una señal visible durante la sesión y, cuando es sencillo, una vía para deshacer.
8. La navegación usa íconos literales acompañados de labels legibles. Tema y Feedback nunca dependen solo de un símbolo.
9. La vista principal prefiere lenguaje cotidiano —“Te entró”, “Gastaste”, “Revisar si este pago ya quedó resuelto”— y reserva términos técnicos para el detalle.

## Pantallas actuales

- Inicio: propuesta de valor ampliada, cinco pendientes accionables en carrusel con contador/puntos y conversación financiera con selector IA/demo. Consentimiento y privacidad se concentran dentro del chat, sin crear un banner global. “Ya lo vi” archiva con estado recuperable; no se muestra micrófono sin una función real.
- Mis Finanzas: resultado compacto, carrusel de cuentas, métricas con destino, cartola general y últimos movimientos densos.
- Cartola: tabla densa General/BCI/MACH, tres acciones por fila y asistente contextual de demo. Código/hora aparecen en el panel de detalle; revisado y nota guardada quedan señalizados de forma persistente.
- Cuentas Claras: app complementaria con Inicio, Grupos y Actividad. El ledger social es su fuente de verdad; nuevo grupo/gasto, reparto, deuda, abono parcial y comprobante son una sola continuidad.
- La vista previa de mensaje replica el lenguaje visual de WhatsApp únicamente para que se entienda el destino. Siempre dice `BORRADOR · NO ENVIADO`; copiar no equivale a abrir WhatsApp ni entregar el mensaje.
- Ahorrar: rango potencial protagonista, conclusión simple primero y transparencia completa en “Ver por qué”. Ignorar es una acción visible y recuperable; el swipe nunca es la única vía.
- Tu plan de deuda: recorrido sintético que compara evidencia con fechas distintas, conserva el resultado como candidato y propone un paso reversible sin score ni oferta.
- Experimentos por explorar: feedback sin fechas, disponibilidad ni promesas de roadmap.
- Feedback del Lab: tarjeta editorial de baja intensidad en el lateral desktop; en móvil se presenta como hoja sobre el teléfono. Usa violeta como señal de exploración, conserva superficies Night/Mist y no compite con Acid, aqua o rosa de los módulos.
- Bandeja `/review`: superficie editorial interna, sin marco de teléfono y sin competir con la experiencia B2C. Violeta identifica origen/aprendizaje, amarillo indica pendiente o Equivocado, Acid confirma Aprobar y Descartar usa tinta neutra; coral queda reservado para errores operativos. El editor de Equivocado aparece solo cuando se necesita explicar la corrección.
- Visor `/review/knowledge`: comparte el lenguaje editorial interno de la bandeja. Violeta identifica contenido aprobado y amarillo una ficha marcada para mejorar; búsqueda, dominio y acordeones priorizan lectura. No imita un editor ni sugiere que la marca local cambió el conocimiento.

## Patrón de feedback transversal

- La tarjeta permanece siempre abierta en desktop, dentro del flujo normal y después de los botones de módulo. No se expande hacia arriba, no flota y no puede cubrir la navegación lateral.
- El módulo activo aparece como chip automático; la persona no debe volver a seleccionar el contexto.
- La elección de tipo precede al texto para reducir carga: “Me gusta” puede ser rápida; “Mejoraría” e “Idea” requieren explicación.
- La confirmación ocurre dentro del mismo panel. No se usan modales del sistema ni redirecciones.
- En móvil el acceso es compacto, la hoja respeta la navegación inferior y el contenido puede desplazarse sin producir overflow horizontal.
- El copy de privacidad está junto al envío: demo local, sin datos financieros/personales y sin transmisión real.

## Cómo mejorar una pantalla

Anotar el caso de uso, qué debería entender la persona en menos de cinco segundos, qué acción debe poder tomar y qué información sobra. Esa nota se transforma en una decisión versionada en este archivo o en una página de Notion cuando se conecte el repositorio oficial.

## Patrón de respuesta conversacional

- **Qué veo:** solo evidencia disponible en la ficha o dato sintético.
- **Qué significa:** interpretación con certeza y límites explícitos.
- **Qué puedes hacer ahora:** siguiente acción reversible y bajo control de la persona.
- Si no existe una ficha suficientemente clara, YOL1 no improvisa: reconoce el límite y muestra preguntas que sí puede responder.
- Las variantes ayudan a reconocer lenguaje cotidiano, pero nunca agregan hechos distintos a la pregunta madre.
