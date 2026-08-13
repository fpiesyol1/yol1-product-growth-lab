# YOL1 Product Growth Lab — primera propuesta MVP

## 1. Norte del producto

YOL1 se explora como un asistente financiero cotidiano y explicable. Esta versión se rotula siempre como **prototipo exploratorio con datos sintéticos: no conecta bancos, no mueve dinero ni representa capacidades disponibles o roadmap**. La propuesta de valor a probar es: **“Encuentra dónde pierdes plata o desaprovechas beneficios y decide qué hacer”**. Es una preferencia fuerte y reversible de Felipe, no una propuesta validada ni un wedge decidido.

Principios que gobiernan todos los módulos:

- **Valor antes que datos:** cada camino puede recorrerse con una demo; una posible conexión solo se simula y su consentimiento aparece cuando desbloquearía una mejora concreta.
- **Evidencia antes que conclusiones:** cada hallazgo declara qué lo activó, de qué fuente viene y cuánta certeza tiene.
- **Control de la persona:** las acciones son confirmables, corregibles o reversibles; una sugerencia nunca se presenta como hecho consumado.
- **Privacidad por defecto:** el Lab usa datos ficticios y no ejecuta conexiones, cargas, pagos ni envíos reales.
- **Autoridad recommend-only:** YOL1 detecta, explica y recomienda. No disputa cargos, recupera fondos, cambia proveedores ni ejecuta automáticamente; cada acción pide confirmación.
- **Transparencia comercial:** “YOL1 no recibe compensación en esta simulación; cualquier relación comercial futura se declarará en cada recomendación”.

## 2. Arquitectura de información

La navegación principal está organizada por la intención de la persona, no por productos financieros:

1. **Inicio:** escoger entre explorar con ejemplo (cero datos) o probar con información propia (carga/conexión y consentimiento simulados), y luego elegir una tarea.
2. **Mis Finanzas:** entender el mes, las fuentes y los pendientes.
3. **Cartola:** inspeccionar la evidencia y actuar sobre un movimiento.
4. **Cobrar:** registrar, repartir y preparar una solicitud simulada.
5. **Ahorrar:** evaluar oportunidades transparentes y verificables.
6. **Ganar:** placeholder “Próximamente”.
7. **Experimentos por explorar:** vitrina y feedback sin fechas, disponibilidad ni promesas; no construye banca ni remesas.

## 3. MVP por módulo

### Inicio

**Trabajo a resolver:** elegir un camino útil en menos de cinco segundos.

Incluye “Tu plata, bajo control” como paraguas y el hero “Encuentra dónde pierdes plata o desaprovechas beneficios y decide qué hacer”. Ofrece **Explorar con ejemplo** y **Probar con mi información**. El segundo muestra una simulación de consentimiento antes de seguir con datos ficticios. No incluye registro, conexión, carga real ni cuestionario obligatorio.

**Aceptación:** la persona entiende que está en un prototipo, distingue los dos modos de entrada y puede entrar a cualquier módulo; ningún camino usa datos reales ni promete personalización sin una fuente.

### Mis Finanzas

**Trabajo a resolver:** entender de dónde vienen los números y qué merece atención.

Incluye fuentes con estado, ingreso/egreso consolidado, clasificaciones simuladas de transferencias propias, por cobrar/pagar y hallazgos con evidencia y certeza. Todo consolidado muestra fuentes, periodo, última actualización, criterio usado y opción de corregir. “Simular banco” y “Simular cartola” son demostraciones informativas con consentimiento simulado, no integraciones.

**Aceptación:** cada total explica su alcance; cada regla se puede marcar para corregir; cada hallazgo abre una ficha con regla, fuentes y acción; una fuente puede navegar a su cartola.

### Cartola completa

**Trabajo a resolver:** inspeccionar movimientos y convertirlos en acciones concretas.

Incluye filtros por fuente, fecha, hora, código, monto y banco; no usa imágenes de movimientos. Las acciones permitidas son Revisar, Lo reconozco, Dividir y Crear solicitud de cobro.

**Aceptación:** se puede filtrar por fuente, seleccionar un movimiento y confirmar una acción simulada; una transferencia propia aparece como clasificación simulada/revisable, no como verdad.

### Cobrar / Repartir

**Trabajo a resolver:** transformar un gasto en montos claros por persona y preparar el cobro.

Es una utilidad secundaria y experimento de frecuencia, no el corazón de la tesis. Flujo: gasto → participantes → división igual o distinta → resumen por cobrar → link simulado → WhatsApp simulado. El link solo prepara una solicitud; no cobra. No hay pago, iniciación real ni envío externo.

**Aceptación:** se puede completar el flujo con datos ficticios, alternar división igual/personalizada, volver atrás y llegar a una vista de enlace de pago claramente marcado como demo.

### Ahorrar

**Trabajo a resolver:** encontrar oportunidades cotidianas sin promesas opacas.

Prioriza, en este orden: cargo dudoso → beneficio desaprovechado → cuenta recurrente ineficiente. Cada tarjeta explica evidencia, fuente, certeza, ahorro estimado/rango, acción reversible y disclosure. Esta demo usa la declaración de transparencia comercial definida arriba.

**Aceptación:** ninguna tarjeta afirma ahorro garantizado ni fraude; la persona puede abrir la explicación y decidir qué hacer.

### Ganar

Solo muestra “Próximamente”. No contiene flujo, promesa ni mecanismo de referidos.

### Experimentos por explorar

Vitrina de ideas ya conversadas y feedback simulado, sin fechas, fases, disponibilidad ni promesa de roadmap. Una posible etapa posterior del Lab permitiría que otras personas propongan mejoras sin GitHub mediante fichas comparables y revisión de Felipe. No se implementa esa capa, banca ni remesas en este MVP.

## 4. Journeys prioritarios

### Journey A — cargo dudoso

Inicio → Explorar con ejemplo → hallazgo “Disney+ aparece dos veces” → explicación de evidencia y certeza → Cartola filtrada → Revisar o Lo reconozco.

### Journey B — beneficio desaprovechado

Inicio → Ahorrar → beneficio → evidencia, condiciones, certeza y rango de ahorro → acción informativa y reversible.

### Journey C — recurrencia ineficiente

Inicio → Ahorrar → plan móvil posiblemente ineficiente → revisar comparación demo, fuente, certeza y rango → comparar sin cambiar proveedor.

### Journey secundario — repartir y solicitar

Inicio o Cartola → Cobrar/Repartir → definir gasto y participantes → elegir división → confirmar montos → preparar link simulado → preparar mensaje de WhatsApp. Cada transición permanece reversible y no ejecuta un cobro.

## 5. Datos y límites de la demo

- Todas las personas, bancos, códigos, montos, estados y links son ficticios.
- No existen proveedores, MCP, cuentas bancarias, cargas de archivos, pagos ni mensajes conectados.
- Las comparaciones de consumo, si se incorporan después, usarán solo datos agregados/anónimos y explicarán la población comparada.
- No se construye score crediticio. Cualquier evaluación futura debe mostrar evidencia, regla y nivel de certeza.
- Open finance, subadquirencia, iniciación de pagos, MCP e infraestructura compartida no se presentan como construidos ni propios; son, a lo sumo, candidatos por evaluar.
- Directo y Embebido quedan fuera de la selección de producto: son motions comparables y este Lab no declara un ganador.

## 6. Siguiente etapa del Lab

Posible experimento posterior: una experiencia de propuestas sin GitHub donde una persona elige pantalla, describe problema e hipótesis, adjunta contexto y envía una propuesta a revisión. Felipe compara versión oficial y propuesta, comenta y decide aprobar o descartar. GitHub sigue siendo el respaldo, no la interfaz de colaboración. No es una capacidad disponible ni un compromiso de roadmap.

## 7. Gates de aprendizaje

- **E2 — Comprensión:** la persona explica con sus palabras qué detectó YOL1, qué evidencia usó, cuánta certeza tiene y qué no hará automáticamente.
- **E3 — Acción voluntaria:** la persona decide avanzar, corregir o descartar una recomendación después de revisar evidencia y consecuencias.
- **E4 — Resultado / retorno:** en pruebas posteriores se observa si la acción produjo un resultado verificable y si la persona vuelve por otra situación cotidiana.

La navegabilidad de este dummy solo aporta evidencia de usabilidad y comprensión inicial. No demuestra demanda, product-market fit, economics ni readiness operacional o regulatoria.
