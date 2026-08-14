# Dirección canónica de producto — Felipe

_Actualizada: 14 de agosto de 2026. Esta guía prevalece sobre research, referencias o decisiones anteriores cuando exista conflicto._

## Reglas transversales

- Diseñar valor antes de pedir datos, y nunca prometer bancos, pagos, KYC, NFC, QR, WhatsApp, MCP o IA como capacidades reales si siguen simuladas o por validar.
- Cada propuesta debe resolver una situación cotidiana, con lenguaje claro, acciones contextuales y evidencia visible. No convertir la experiencia en una góndola de productos financieros.
- El sistema debe ser consistente: mismo nombre para la misma cosa, acciones breves y eventos canónicos útiles para producto/analytics. En la ficha, el evento es breve; sus parámetros van separados.
- La ficha técnica debe poder alimentar un PRD: arquitectura sugerida React Native + AWS, servicios/candidatos, fuentes de datos, almacenamiento/consulta, eventos, KYC/licencias Chile, riesgos y decisiones por validar. No mostrar detalles internos confusos al público.
- Feedback de personas, decisiones de fuentes e insights de IA son bandejas distintas. Nada cambia el producto automáticamente.
- Remesas: no prototipar ni investigar en este ciclo.

## 1. Onboarding y KYC progresivo

**Tesis.** La persona puede explorar valor sin entregar datos. Sólo se pide registro y verificación cuando quiere activar una acción material.

**Valor antes de datos.** Entrar, conversar con el asistente, entender qué podría hacer YOL1 y ver cómo conectaría un banco/cartola; sin asumir datos reales ni pedir OTP de entrada.

**Progresión.**
1. Bienvenida + propuesta de valor concreta.
2. Explorar el acompañante financiero y productos disponibles.
3. Al intentar activar una acción material (ej. recibir/transferir cuando exista capacidad), explicar qué se desbloquea.
4. Teléfono **o** email + OTP crea pre-registro recuperable.
5. RUT + número de serie y biometría quedan para Mi banco/KYC, sólo con fundamento legal, partner y capacidad aprobados.

**Regla crítica.** OTP confirma un canal; no equivale a KYC ni habilita dinero. El KYC aprobado tampoco habilita por sí solo una capacidad: requiere vehículo, contrato, controles y operación aprobados. Revisión/pérdida de teléfono va a Customer Success por definir.

**Pregunta que debe responder el diseño.** ¿Qué acción concreta hace que completar datos se sienta justo y valioso?

## 2. Acompañante financiero

**Tesis.** Convertirse en hábito al ordenar cartolas y resolver de forma simple “qué debo / qué me deben”. Debe sentirse como el primer paso hacia un reemplazo útil de Splitwise, no como un dashboard genérico.

**Loop MVP.** Leer/ordenar movimientos → detectar algo que requiere atención → ignorar, revisar o dividir/cobrar según contexto → mantener pendientes sociales claros. La comunidad aparece por coordinación de gastos, no como red social artificial.

**Home actual.** Título único: “Entiende tus finanzas. Simplifica tu vida.” El carrusel usa acciones por tipo: costo = Ignorar/Revisar/Dividir si aplica; cobro = Cobrar/Ignorar. No forzar tres botones si no corresponden.

**Finanzas/cartola.** Orden buscado: resultado del mes, cuentas conectadas compactas, cuatro cifras relevantes (entró/salió/por cobrar/por pagar) y últimos movimientos más arriba, densos y con scroll propio. Quitar ornamentos/triángulos y explicaciones redundantes. La cartola permite navegar por cuenta y general; fecha, movimiento, código y monto claros; la asistencia explica pasos, condiciones y fuentes sin ejecutar nada.

**Horizonte, no promesa.** Cuenta secundaria, mover plata y Ganar pueden conectarse después; no se presentan como disponibles sin operación real.

## 3. Home Banking contextual

**Tesis.** No es una góndola de cuentas/productos: responde “¿cómo me sirven mis finanzas hoy?” según momento de mes, vencimientos, patrones y decisiones pendientes.

**Dirección.** Priorizar una situación concreta, línea hacia próximo pago y una forma humana de pedir ayuda. Interacción agéntica no tiene que ser chat genérico: puede combinar audio futuro, accesos rápidos y sugerencias explicables. Salud financiera debe ser señal útil y explicable, no una nota decorativa.

**Ejemplos de valor.** Arriendo, luz, agua, cobro reactivado, deuda pendiente o patrón de gasto. Nunca disparar acciones; mostrar contexto, evidencia, certeza y siguiente paso.

**Research obligatorio antes de prototipo.** Monzo, Nubank y referentes actuales; validar qué vale la pena adaptar y qué no aplica a Chile/YOL1.

## 4. Tarjetas como ecosistema de intención

**Tesis.** Tarjetas no es el plástico: es el lugar al que se abre para pagar, buscar datos, revisar el último movimiento, resolver una alerta o encontrar una forma más conveniente de comprar.

**MVP a explorar.** Acceso seguro a datos de tarjeta, pagar/QR como intención (no capacidad comprometida), último movimiento, alertas contextuales y beneficios relevantes al momento de compra. Las sugerencias pueden conectar hábitos, comercios frecuentes, deudas y descuentos, con evidencia y sin claims engañosos.

**Líneas de investigación.** Tarjeta digital, QR, NFC/wallet, controles/restricciones, tarjeta compartida o corporativa y beneficios. Validar normativa chilena, emisor/partner, consentimiento y seguridad antes de diseñar como ejecutable.

**Research obligatorio.** Tendencias de comportamiento de compra y compañías innovadoras; convertirlo en hipótesis, métricas, riesgos y gates, no en promesas.

## 5. Remesas

Pausado. No diseñar, no investigar y no abrir hipótesis en este ciclo.

## 6. Construir mi propio producto

**Tesis.** Una persona trabaja con su propio ChatGPT o Claude para transformar una idea en una primera versión visual YOL1, iterarla con preguntas útiles y enviarla a revisión. Debe sentir avance real rápido, no sólo conversación.

**Entrada clara.** “En este espacio, el próximo producto lo construyes tú.” Invitación: trabajar junto a ChatGPT o Claude para construir un producto YOL1.

**Guía de conexión.** Instrucciones visuales y muy explícitas para conectar un cliente compatible al MCP cuando exista: nombre YOL1, URL copiable en el mismo paso, autorización visible, y prompt inicial copiable. No insinuar que la conversación externa se sincroniza sola, ni que ChatGPT/Claude permiten la misma instalación si todavía no existe esa integración.

**Prompt inicial.** Debe decirle a la IA que haga preguntas una a una para definir producto, usuario, problema, pantallas, datos, riesgos y propuesta. Debe invitar a traer foto/link de referencias, y luego mostrar ejemplos de mejoras de layout, botones, tono e interacción.

**Salida.** El teléfono muestra sólo los experimentos/pantallas que se van materializando. “Enviar proyecto” pide nombre, título, qué busca hacer y por qué calza con YOL1. Enviar lo deja en bandeja editorial; no publica, crea branch ni cambia el core automáticamente.

## 7. Bandeja de aprendizaje y especificación

**Feedback humano primero.** Mostrar producto/pantalla/tipo de feedback de forma legible, con estados tipo Kanban: nuevo, revisar, para después, resuelto, ignorado/equivocado. Tener vista por tema para convertir aprendizaje aprobado en guía o archivo MD.

**Decisiones/conflictos después.** Compactos, concretos: qué cambió, opción A, opción B y el porqué; Felipe decide. No exponer debates internos, prompts o metadatos innecesarios al público.

**Insights de IA al final.** Separados, ordenables por tema y con evidencia/límites. Son propuestas para organizar, no fuente de verdad ni automatización.

**Eventos y datos.** Eventos cortos, en `snake_case`, orientados a acción (ej. `onboarding_started`, `financial_summary_viewed`, `card_details_requested`). Metadata separada: `event_id`, `user_id`/identificador permitido, `event_at`, `product_key`, `screen_key`, `action_key`, plataforma, versión, origen, estado de consentimiento y correlación. Registrar sólo lo necesario; definir retención, acceso, borrado, idempotencia y fuentes de consulta.

## Cadencia de trabajo

Por cada producto activo: research/brief → hipótesis y journey → propuesta visual local → QA técnico + producto/GTM + consistencia → integración al Lab con cambios reversibles → nueva pasada. Siempre registrar contradicciones y decisiones por validar; la decisión verbal de Felipe manda.
