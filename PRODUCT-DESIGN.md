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
- **Cobrar/Repartir — Neón suave:** cercanía, personas y recordatorios. Acid queda para avanzar o confirmar un resultado positivo.
- **Ganar — Neón suave:** gesto editorial de placeholder, con acid concentrado; no sugiere una capacidad construida.
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
- Una diagonal baja y consistente cierra cada pantalla con su acento emocional: Acid en Inicio/Ahorrar, aqua en Finanzas/Cartola, rosa en Cobrar y pagar, rosa+acid editorial en Ganar y violeta tenue en Experimentos.
- Alto contraste, foco visible, áreas táctiles amplias, lectura sin overflow y movimiento opcional.

## Reglas de experiencia

1. Una pantalla debe tener una tarea principal y una acción clara.
2. Cada alerta debe mostrar qué la activó, de dónde vienen los datos y qué puede hacer la persona.
3. Las transferencias entre cuentas propias no inflan ingresos ni egresos.
4. "Por cobrar" y "por pagar" son compromisos visibles; una persona puede confirmar, rechazar o corregir un cobro.
5. La cartola conserva evidencia: fecha, hora, código, fuente, monto y una acción contextual.
6. Los datos del laboratorio son ficticios. No se integra ninguna cuenta ni pago desde este repositorio.

## Pantallas actuales

- Inicio: propuesta de valor ampliada, cinco pendientes accionables y conversación financiera con selector IA/demo. Consentimiento y privacidad se concentran dentro del chat, sin crear un banner global.
- Mis Finanzas: resultado compacto, carrusel de cuentas, métricas con destino, cartola general y últimos movimientos densos.
- Cartola: tabla densa General/BCI/MACH, tres acciones por fila y asistente contextual de demo.
- Cobrar y pagar: bandejas apiladas 50/50 — por cobrar arriba y por pagar abajo — con scroll interno independiente, persona/grupo, aliases y reparto persistente durante sesión. El contenedor principal no desplaza cabecera, selector ni navegación. En móvil pequeño se reduce la densidad de encabezados sin convertir las bandejas en carrusel o columnas laterales.
- La vista previa de mensaje es deliberadamente una superficie externa al teléfono YOL1: fondo, estructura y controles propios, sin logo oficial de WhatsApp. Conserva el rosa como gesto humano, el amarillo como disclosure y el acid solo para volver a YOL1. La URL ficticia se presenta como texto no navegable.
- Ahorrar: rango potencial protagonista, tarjetas espaciadas y descartables con evidencia, certeza y acción reversible.
- Ganar: tratamiento editorial “Próximamente”, sin flujo.
- Experimentos por explorar: feedback sin fechas, disponibilidad ni promesas de roadmap.
- Feedback del Lab: tarjeta editorial de baja intensidad en el lateral desktop; en móvil se presenta como hoja sobre el teléfono. Usa violeta como señal de exploración, conserva superficies Night/Mist y no compite con Acid, aqua o rosa de los módulos.
- Bandeja `/review`: superficie editorial interna, sin marco de teléfono y sin competir con la experiencia B2C. Violeta identifica origen/aprendizaje, amarillo indica pendiente o Equivocado, Acid confirma Aprobar y Descartar usa tinta neutra; coral queda reservado para errores operativos. El editor de Equivocado aparece solo cuando se necesita explicar la corrección.

## Patrón de feedback transversal

- La tarjeta permanece siempre abierta en desktop, dentro del flujo normal y después de los botones de módulo. No se expande hacia arriba, no flota y no puede cubrir la navegación lateral.
- El módulo activo aparece como chip automático; la persona no debe volver a seleccionar el contexto.
- La elección de tipo precede al texto para reducir carga: “Me gusta” puede ser rápida; “Mejoraría” e “Idea” requieren explicación.
- La confirmación ocurre dentro del mismo panel. No se usan modales del sistema ni redirecciones.
- En móvil el acceso es compacto, la hoja respeta la navegación inferior y el contenido puede desplazarse sin producir overflow horizontal.
- El copy de privacidad está junto al envío: demo local, sin datos financieros/personales y sin transmisión real.

## Cómo mejorar una pantalla

Anotar el caso de uso, qué debería entender la persona en menos de cinco segundos, qué acción debe poder tomar y qué información sobra. Esa nota se transforma en una decisión versionada en este archivo o en una página de Notion cuando se conecte el repositorio oficial.
