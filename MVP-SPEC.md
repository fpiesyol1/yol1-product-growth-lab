# YOL1 Product Growth Lab — primera propuesta MVP

## 1. Norte del producto

YOL1 se explora como un asistente financiero cotidiano y explicable. Esta versión se rotula siempre como **prototipo exploratorio con datos sintéticos: no conecta bancos, no mueve dinero ni representa capacidades disponibles o roadmap**. La propuesta de valor a probar es: **“Encuentra dónde pierdes plata o desaprovechas beneficios y decide qué hacer”**. Es una preferencia fuerte y reversible de Felipe, no una propuesta validada ni un wedge decidido.

Principios que gobiernan todos los módulos:

- **Valor antes que datos:** la experiencia entra directo a un ejemplo; una posible conexión solo se simula y su consentimiento aparece cuando desbloquearía una mejora concreta.
- **Evidencia antes que conclusiones:** cada hallazgo declara qué lo activó, de qué fuente viene y cuánta certeza tiene.
- **Control de la persona:** las acciones son confirmables, corregibles o reversibles; una sugerencia nunca se presenta como hecho consumado.
- **Privacidad por defecto:** el Lab usa datos ficticios y no ejecuta conexiones, cargas, pagos ni envíos reales.
- **Autoridad recommend-only:** YOL1 detecta, explica y recomienda. No disputa cargos, recupera fondos, cambia proveedores ni ejecuta automáticamente; cada acción pide confirmación.
- **Transparencia comercial:** “YOL1 no recibe compensación en esta simulación; cualquier relación comercial futura se declarará en cada recomendación”.

## 2. Arquitectura de información

La navegación principal está organizada por la intención de la persona, no por productos financieros:

1. **Inicio:** comprender qué hace YOL1, resolver señales de una bandeja y conversar con un chat financiero de demo.
2. **Mis Finanzas:** entender el mes, las fuentes y los pendientes.
3. **Cartola:** inspeccionar la evidencia y actuar sobre un movimiento.
4. **Cobrar y pagar:** ordenar lo que te deben y lo que debes, y registrar/repartir un gasto ficticio.
5. **Ahorrar:** evaluar oportunidades transparentes y verificables.
6. **Ganar:** placeholder “Próximamente”.
7. **Experimentos por explorar:** vitrina y feedback sin fechas, disponibilidad ni promesas; no construye banca ni remesas.

El **intake de feedback** es una utilidad transversal del Lab, no un octavo módulo de producto. Identifica automáticamente uno de los siete módulos activos y guarda comentarios locales para probar la experiencia de contribución.

## 3. MVP por módulo

### Inicio

**Trabajo a resolver:** entender qué hace YOL1 y resolver una señal cotidiana sin buscarla en varios módulos.

Abre con la propuesta **“Tu plata, más simple. Entiende tus finanzas. Simplifica tu vida.”**. La bandeja horizontal cuenta los pendientes visibles e incluye cinco situaciones sintéticas: posible duplicado Disney+, una cuenta por cobrar, una cuenta por pagar, un beneficio de tarjeta y un gasto posiblemente compartido. Un contador y puntos hacen descubrible el carrusel sin reinstalar instrucciones redundantes. **Ya lo vi** archiva durante la sesión; **Revisar** abre evidencia o detalle; la tercera acción lleva al destino pertinente. Los elementos archivados dejan una señal persistente y recuperable. La conversación acepta texto o seis sugerencias y usa IA server-side únicamente después de elección explícita; sin clave o consentimiento responde desde reglas de demo. No se muestra micrófono porque no existe captura de audio.

**Aceptación:** una acción responde con confirmación visible en móvil y desktop; Ya lo vi retira una tarjeta, incrementa el contador persistente y permite deshacer durante la sesión; Revisar y la tercera acción tienen destino útil. Si el fallback no reconoce una pregunta, ofrece preguntas concretas que sí puede responder. La IA no recibe texto antes de consentimiento, la clave vive solo en servidor, el request usa `store: false` y ningún camino usa audio real.

### Bandeja de aprendizaje interna

`/review` queda fuera de los siete módulos consumer. Con Postgres conectado reúne feedback de producto y preguntas/respuestas de IA de todos los visitantes, separados por tipo. Permite Aprobar, marcar Equivocado con explicación obligatoria o Descartar. Ningún estado modifica por sí solo el prompt o el conocimiento. Sin secretos configurados funciona en modo local explícito.

### Conocimiento conversacional interno

`knowledge/` organiza preguntas madre por dominio con estado, intención, variantes, respuesta esperada, evidencia, límites, siguientes preguntas y feedback conocido. El catálogo runtime conserva un vínculo a la ficha fuente. El router prioriza una regla de seguridad o una respuesta aprobada, después datos/operaciones deterministas y solo al final una eventual IA con consentimiento.

`/review/knowledge` es una vista editorial interna, no un octavo módulo consumer. Permite buscar fichas, revisar sus diez variantes y marcar localmente “para mejorar”; no edita Markdown, no cambia el router y no promueve contenido automáticamente.

**Aceptación:** una pregunta aprobada responde con “Qué veo / Qué significa / Qué puedes hacer ahora”; una consulta fuera de alcance reconoce el límite y ofrece 2–3 preguntas útiles; los dictados de Felipe nacen como borrador y las variantes se agregan después de su aprobación.

### Mis Finanzas

**Trabajo a resolver:** entender de dónde vienen los números y qué merece atención.

Incluye resultado mensual compacto, carrusel horizontal de cuentas, **Te entró/Gastaste** consolidado, por cobrar/pagar y últimos movimientos en filas densas. Cada métrica abre su detalle; por cobrar/pagar lleva al módulo correspondiente. **Ver cartola general** queda debajo de las cuentas. **Agregar banco** y **Agregar cartola** solo confirman que no existe integración ni carga.

**Aceptación:** resultado no se confunde con saldo; fuentes se recorren horizontalmente; cada fuente y la cartola general tienen destino; Finanzas no duplica la bandeja de Inicio.

### Cartola completa

**Trabajo a resolver:** inspeccionar movimientos y convertirlos en acciones concretas.

Incluye navegación General/BCI/MACH, fecha, hora, monto y fuente. El código técnico se conserva en el detalle, no en la fila principal. Cada fila ofrece **Ya lo vi, Revisar y Dividir/Cobrar**. Ya lo vi deja la fila atenuada con check y permite deshacer; Revisar abre un asistente contextual de demo que explica evidencia y permite guardar o editar una nota con estado persistente durante la sesión; no entrega resultados garantizados ni enlaces externos.

**Aceptación:** se puede cambiar de cartola, confirmar cualquier acción y ver feedback; Disney abre evidencia contextual; una transferencia propia permanece como clasificación revisable.

### Cobrar y pagar

**Trabajo a resolver:** entender lo pendiente en ambos sentidos y transformar un gasto en montos claros por persona.

La vista inicial alterna **Por persona** y **Por grupo/gasto**, pero mantiene dos bandejas verticales 50/50 del alto: **Por cobrar arriba** y **Por pagar abajo**. Cada lista se desplaza de manera independiente; la otra bandeja, cabecera, selector y navegación inferior permanecen estables. En móvil pequeño se comprimen encabezados y acciones sin cambiar el orden ni convertirlo en carrusel. Personas con YOL1 pueden mostrar un alias ficticio `@nombre`. Cada pendiente se abre dentro de su bandeja y permite simular recordatorio o marcar “ya me pagaron/ya pagué”; luego se invita a **revisar si este pago ya quedó resuelto** contra cartolas ficticias. **Nuevo gasto compartido** abre el flujo gasto → contacto → división → confirmación; **Agregar deuda pendiente** crea un borrador visible y reversible. En montos distintos, **Repartir lo que falta** distribuye la diferencia positiva en partes iguales y confirma el resultado sin ejecutar un pago.

Después de confirmar una solicitud, el prototipo muestra una superficie separada del marco YOL1: una **vista previa de mensaje** con texto ajustable, datos ficticios y URL `.example` sin vínculo. “Volver a YOL1” restaura la solicitud y el borrador de sesión. No se abre WhatsApp ni se copia, envía o cobra nada. Producción exigiría consentimiento explícito antes de compartir, generación server-side de un link de pago y un partner autorizado; ninguno se integra en este Lab.

**Aceptación:** se alternan las dos vistas; se puede completar y corregir el reparto; navegar a otro módulo y volver conserva el paso y datos durante la sesión; nunca se ofrece ejecución real.

### Ahorrar

**Trabajo a resolver:** encontrar oportunidades cotidianas sin promesas opacas.

Abre con un rango grande de potencial estimado, no garantizado. Prioriza cargo dudoso → beneficio desaprovechado por tarjeta → cuenta o servicio posiblemente ineficiente → gasto posiblemente compartido. Cada tarjeta presenta primero una conclusión simple y conserva evidencia, fuente, certeza, estimación, acción reversible y disclosure bajo **Ver por qué**. Ignorar permanece como botón visible y deja un contador recuperable; el gesto lateral es solo un atajo secundario. Plan y división abren simulaciones explícitas, nunca una compra o cobro real.

**Aceptación:** ninguna tarjeta afirma ahorro garantizado ni fraude; la persona puede abrir la explicación y decidir qué hacer.

### Ganar

Solo muestra “Próximamente”. No contiene flujo, promesa ni mecanismo de referidos.

### Experimentos por explorar

Vitrina de ideas ya conversadas y feedback simulado, sin fechas, fases, disponibilidad ni promesa de roadmap. Una posible etapa posterior del Lab permitiría que otras personas propongan mejoras sin GitHub mediante fichas comparables y revisión de Felipe. No se implementa esa capa, banca ni remesas en este MVP.

### Feedback transversal del Lab

**Trabajo a resolver:** capturar qué gustó, qué se mejoraría y qué idea o tema clave debería considerarse, manteniendo el contexto de la pantalla evaluada.

En desktop reemplaza la fotografía editorial por un recuadro compacto siempre abierto al final del lateral, después de los botones de módulo y sin superposición; en móvil se abre desde un control compacto del encabezado. “Me gusta” permite comentario opcional; “Mejoraría” e “Idea” lo requieren. Cada entrada incluye módulo, tipo, comentario, temas clave, fecha y estado `new`, y se conserva únicamente en `localStorage` durante esta demo.

**Aceptación:** el contexto cambia al navegar; el formulario puede abrirse/cerrarse; una entrada válida genera confirmación visible; no transmite datos, no solicita identidad ni finanzas personales y no concede acceso al repositorio. La arquitectura futura queda en `FEEDBACK-INTAKE.md`.

## 4. Journeys prioritarios

### Journey A — cargo dudoso

Inicio → tarjeta Disney+ → Revisar → Cartola general con Disney+ → asistente contextual → guardar nota o marcar Ya lo vi.

### Journey B — beneficio desaprovechado

Inicio → Ahorrar → beneficio → evidencia, condiciones, certeza y rango de ahorro → acción informativa y reversible.

### Journey C — recurrencia ineficiente

Inicio → Ahorrar → plan móvil posiblemente ineficiente → revisar comparación demo, fuente, certeza y rango → comparar sin cambiar proveedor.

### Journey secundario — repartir y solicitar

Inicio o Cartola → Cobrar y pagar → Nuevo gasto → seleccionar/crear contacto ficticio → dividir → confirmar → guardar reparto de sesión. Cada transición permanece reversible y no cobra, paga ni envía mensajes.

## 5. Datos y límites de la demo

- Todas las personas, bancos, códigos, montos, estados y links son ficticios.
- No existen proveedores, MCP, cuentas bancarias, cargas de archivos, pagos ni mensajes conectados.
- Las comparaciones de consumo, si se incorporan después, usarán solo datos agregados/anónimos y explicarán la población comparada.
- No se construye score crediticio. Cualquier evaluación futura debe mostrar evidencia, regla y nivel de certeza.
- Open finance, subadquirencia, iniciación de pagos, MCP e infraestructura compartida no se presentan como construidos ni propios; son, a lo sumo, candidatos por evaluar.
- Directo y Embebido quedan fuera de la selección de producto: son motions comparables y este Lab no declara un ganador.
- El modo oscuro es inicial; el modo claro se puede elegir. La preferencia vive solo en `localStorage`, no requiere cuenta ni autenticación.

## 6. Siguiente etapa del Lab

Posible experimento posterior: una experiencia de propuestas sin GitHub donde una persona elige pantalla, describe problema e hipótesis, adjunta contexto y envía una propuesta a revisión. Felipe compara versión oficial y propuesta, comenta y decide aprobar o descartar. GitHub sigue siendo el respaldo, no la interfaz de colaboración. No es una capacidad disponible ni un compromiso de roadmap.

## 7. Gates de aprendizaje

- **E2 — Comprensión:** la persona explica con sus palabras qué detectó YOL1, qué evidencia usó, cuánta certeza tiene y qué no hará automáticamente.
- **E3 — Acción voluntaria:** la persona decide avanzar, corregir o descartar una recomendación después de revisar evidencia y consecuencias.
- **E4 — Resultado / retorno:** en pruebas posteriores se observa si la acción produjo un resultado verificable y si la persona vuelve por otra situación cotidiana.

La navegabilidad de este dummy solo aporta evidencia de usabilidad y comprensión inicial. No demuestra demanda, product-market fit, economics ni readiness operacional o regulatoria.

## 8. Onboarding y activación progresiva

**Onboarding y KYC progresivo** pasa a ser el segundo producto publicado del Lab. El recorrido de demo es: bienvenida → teléfono o email → OTP → pre-registro → acceso de exploración al Acompañante financiero. T0 permite conocer la app sin datos financieros propios ni activaciones.

`Mi banco` vive dentro del Acompañante: cuando la persona decide activar una función personal, pide RUT + número de serie y luego muestra biometría **simulada**. No valida identidad, no abre cuenta, no conecta banca y no decide KYC real. Cognito, API Gateway/Lambda, DynamoDB y CDP son referencias del discovery; proveedor KYC, ID definitivo y soporte/revisión manual siguen por definir.

El menú de perfil se abre desde el logo superior izquierdo y muestra un checklist de información: lo completo, lo pendiente y qué capacidad desbloquearía cada paso.

## 9. Arquitectura de portfolio aprobada

El producto publicado del Lab se llama **Acompañante financiero** y contiene Mis finanzas, Cobrar y pagar, Ahorrar, Gana más lucas y Mi banco. El selector de portfolio contiene exactamente seis productos: Acompañante financiero, Onboarding y KYC progresivo, Home Banking, Tarjetas, Remesas y Construir mi propio producto. Borradores o propuestas no entran a este selector hasta que Felipe los autorice.

Los cinco espacios no publicados muestran únicamente estados vacíos. No contienen journeys, formularios operacionales, integraciones ni claims. “Construir mi propio producto” puede explicar que a futuro ordenará propuestas revisables, pero no implementa intake, MCP, automatización de ramas ni publicación.

## 10. Ficha de producto y eventos propuestos

La ficha contextual es una superficie editorial interna del Lab. Sus semillas son propuestas no definitivas:

- evento humano de entrada o acción, visible en hover/focus y en modo touch; sus parámetros quedan como metadata separada;
- arquitectura candidata con React Native y AWS como base a validar; datos separados entre qué guardar, qué consultar y cómo tratarlos;
- KYC y licencias en Chile con estado `No aplica`, `Por validar` o `Requerido` y razón;
- preguntas abiertas, feedback relacionado y bloque de QA interno “todo lo que puede salir mal”.

Los eventos viven como atributos o mapeo local y no se envían a analytics. Un click conserva su comportamiento real de demo. La ficha no reemplaza documentación técnica, legal ni regulatoria.

## 11. Contradicciones y jerarquía de fuentes

La bandeja interna usa esta prioridad: **decisión verbal de Felipe > decisión aprobada > reunión reciente > Notion/Second Brain > Jira > estrategia/contexto**. Los conflictos semilla son ejemplos no sensibles y se marcan como demo/por validar. Felipe puede elegir A, B o pedir más contexto con comentario; la resolución vive en el navegador, actualiza la ficha local y no edita archivos.
