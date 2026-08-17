# Encargo para Claude Design · YOL1 Product Growth Lab

## Uso

Pega el bloque de la sección **Prompt listo para enviar** en un proyecto o chat de Claude con acceso al repositorio. Si Claude no puede leer GitHub, adjunta este archivo y los documentos indicados en “Fuentes de verdad”.

Repositorio: `https://github.com/fpiesyol1/yol1-product-growth-lab`

Versión publicada esperada: `https://yol1-product-growth-lab.vercel.app/`

La revisión es para un espacio interno/exploratorio. No debe convertir prototipos, pagos, KYC, bancos ni integraciones en promesas operativas.

---

## Prompt listo para enviar

Actúa como **Claude Design**, líder senior de diseño de producto, UX/UI systems, product strategy y diseño de sistemas tecnológicos para YOL1. Vas a revisar el repositorio y el prototipo navegable de **YOL1 Product Growth Lab**.

Tu misión no es solo criticar estética: debes ayudar a transformar este Lab en una interfaz interna extraordinaria para que equipos de Producto, Growth, Diseño, Tecnología y Operaciones puedan traer una idea, convertirla en una hipótesis clara y aterrizarla en una experiencia, flujo, datos, eventos, dependencias, riesgos y próximos pasos de construcción.

## Enlaces de trabajo

- Repositorio: `https://github.com/fpiesyol1/yol1-product-growth-lab`
- Lab navegable: `https://yol1-product-growth-lab.vercel.app/`
- Bandeja de aprendizaje: `https://yol1-product-growth-lab.vercel.app/review`

Si algún enlace o sección no está disponible, no inventes su contenido: revisa el repositorio y declara el vacío.

## Qué es YOL1 y qué se busca construir

YOL1 es una exploración de productos financieros y de crecimiento B2C. El Lab no es todavía una aplicación bancaria ni un roadmap comprometido. Es una superficie para:

1. Probar y discutir conceptos de producto con datos simulados.
2. Diseñar journeys antes de construir capacidades reales.
3. Conectar cada experiencia con requisitos técnicos, datos, medición, operación, riesgos, KYC/regulación y decisiones pendientes.
4. Recibir feedback de personas y convertirlo en oportunidades, hipótesis y decisiones.
5. Hacer que un equipo de ingeniería pueda entender qué construir, para quién, por qué, con qué guardrails y cómo medirlo.

La ambición es que el Lab sea, a la vez, un espacio de exploración visual potente y una puerta de entrada práctica al PRD vivo de cada producto.

## Productos y estado esperado

No asumas que todos están publicados o definidos al mismo nivel.

| Producto | Intención actual | Estado |
|---|---|---|
| Acompañante financiero | Entender finanzas, ordenar cartola, manejar lo que debo/me deben, construir hábito y comunidad; puede aspirar a reemplazar parcialmente casos tipo Splitwise sin prometer pagos reales. | Explorable con datos simulados. |
| Onboarding y KYC progresivo | Entregar valor antes de pedir datos; pedir contacto/OTP solo frente a una acción material concreta; no inferir que KYC por sí solo habilita capacidades. | Explorable como prototipo y contrato de seguridad. |
| Home Banking | Investigar una experiencia contextual y agéntica, no una góndola de productos. Debe pensar en momentos, patrones, recordatorios y salud financiera explicable. | En investigación, sin flujo publicado. |
| Tarjetas | Investigar tarjeta como ecosistema de intención: pagar, QR/NFC, datos rápidos, movimientos, alertas, beneficios y posibles límites compartidos/empresa, sin afirmar viabilidad regulatoria. | En investigación, sin flujo publicado. |
| Remesas | No prototipar todavía. | En investigación. |
| Construir mi propio producto | Ayudar a personas a convertir una idea en un prototipo y propuesta de revisión, conectando conversaciones externas de IA con contexto/documentación de YOL1 sin prometer sincronización automática que no existe. | Explorable, con límites explícitos. |

## Direcciones de diseño que debes respetar

- Dark-first, con modo claro como alternativa consistente.
- El sistema debe sentirse YOL1: editorial, juvenil, preciso, humano, enérgico; no una fintech genérica ni dashboard corporativo.
- Mantener la composición de escritorio estable: navegación superior, relato/feedback a la izquierda y teléfono/círculo en una ubicación consistente. Al cambiar de producto debe cambiar el contenido, no deformarse la escena.
- No usar color para alarmar si no existe una alerta real. Los acentos tienen roles semánticos.
- Las pantallas en investigación deben ser honestas y atractivas; no simular apps funcionales ni exponer fichas técnicas públicas.
- Las acciones deben tener copy contextual y no redundante. Nunca forzar tres botones si solo dos decisiones tienen sentido.
- El feedback debe ser simple y estar claramente separado de decisiones de IA y de fuentes técnicas.

## Fuentes de verdad dentro del repositorio

Lee primero estas piezas antes de evaluar:

1. `README.md`
2. `MVP-SPEC.md`
3. `PRODUCT-DESIGN.md`
4. `BRIEF-NOCHE-EJECUCION.md`
5. `PRD-ONBOARDING-KYC-PROGRESIVO.md`
6. `PRD-TARJETAS-YOL1.md`
7. `RESEARCH-TARJETAS-YOL1-2026-08-14.md`
8. `ESTANDAR-QA-TECNICO-PRD.md`
9. `QA-CICLO-TRIPLE.md`
10. `lib/product-portfolio.ts`, `app/page.tsx`, `app/globals.css` y tests relevantes.

Cuando haya contradicción: no la resuelvas en silencio. Muestra las fuentes en conflicto, explica la implicancia y propone una forma reversible de avanzar.

## Revisión que necesito

### 1. Diagnóstico de producto y narrativa

Evalúa si una persona entiende:

- Qué es el Lab y qué no es.
- Qué producto está mirando y cuál es su estado.
- Qué debe hacer en cada pantalla.
- Qué experiencias están listas para probar y cuáles son solo investigación.
- Cómo una idea o feedback podría transformarse en una decisión concreta.

Detecta cualquier promesa excesiva, flujo muerto, contradicción de estado o caso donde el texto técnico invada una experiencia pública.

### 2. UX/UI y sistema visual

Evalúa jerarquía, legibilidad, consistencia móvil/escritorio, densidad, composición, navegación, estados vacíos, feedback, tono, accesibilidad y uso de color.

Propón mejoras con precisión: qué moverías, qué sacarías, qué agrandarías, qué simplificarías y qué conservarías. Incluye una propuesta de layout o wireframe textual cuando ayude a explicar la recomendación.

### 3. El Lab como interfaz para diseñar producto y tecnología

Evalúa si la ficha de producto puede cumplir su objetivo como puente hacia ingeniería. Debe orientar, sin inventar certezas, sobre:

- Problema, usuario, momento y propuesta de valor.
- Flujo y estados de la experiencia.
- Eventos y propiedades de analítica con nombres breves, semánticos y consistentes.
- Metadatos mínimos: `event_at`, `user_id` pseudónimo cuando corresponda, `product_key`, `screen_key`, `action_key`, versión, origen y correlación; nunca PII o respuestas crudas.
- Datos que se muestran, se almacenan, se consultan y sus fuentes candidatas.
- Servicios, módulos y dependencias sugeridos, usando React Native y AWS como marco futuro, pero marcando claramente lo que es sugerencia, gate o decisión pendiente.
- KYC, licencias, seguridad, operación, Customer Success y riesgos, tratados como requisitos por capability concreta, no como claims legales.
- Métricas de aprendizaje, growth loops, canales, engagement y condiciones de escala.

Para cada recomendación, explicita si es **P0**, **P1** o **P2** y qué evidencia o decisión faltaría para implementarla.

### 4. Evaluación por producto

Entrega para cada producto:

- Tesis de valor / usuario / momento.
- Aha moment o aprendizaje central.
- Primera versión realmente mínima.
- Experimento de bajo riesgo más útil.
- Riesgo de UX, negocio, datos y operación.
- Qué debe quedar en documentación/PRD antes de código.
- Cómo conecta con el resto del ecosistema YOL1.

Remesas debe quedarse en investigación: puedes definir preguntas de discovery, pero no diseñar un flujo final.

### 5. Referentes y research

Usa referentes solo cuando tengan una lección concreta transferible. Para Home Banking investiga, si aporta, Monzo, Revolut, Nubank y Starling. Para Tarjetas, revisa billeteras, emisores, QR/NFC y experiencias de beneficio, priorizando fuentes oficiales/primarias y regulaciones chilenas solo para marcar gates “por validar”.

No copies interfaces ni des recomendaciones vagas como “hacerlo más moderno”. Conecta cada referencia con una hipótesis específica de YOL1.

## Restricciones críticas

- No conectes bancos, pagos, WhatsApp, KYC, NFC, QR real, Mixpanel, Notion, GitHub ni servicios externos.
- No publiques, no hagas commits, no cambies credenciales y no sobrescribas decisiones existentes.
- No presentes datos simulados, demo, investigación o capacidades futuras como producto disponible.
- No recolectes ni recomiendes enviar PII, OTP, documentos, RUT, biometría, claves o respuestas de proveedores a analítica.
- No cambies decisiones de producto por intuición visual. Si sugieres un cambio de alcance, déjalo como decisión pendiente.

## Forma de entrega

Devuélveme una revisión en este orden:

1. **Resumen ejecutivo**: 5–8 hallazgos y la oportunidad de diseño más importante.
2. **Lo que funciona y debe protegerse.**
3. **Problemas P0/P1/P2**, con evidencia concreta (pantalla, flujo, copy o archivo).
4. **Propuesta de evolución del Lab**: arquitectura de información, navegação, layout y comportamiento.
5. **Propuesta de PRD vivo por producto**: campos, plantillas y reglas de completitud.
6. **Mapa de datos/eventos/dependencias**: qué está listo, qué es sugerido y qué está por validar.
7. **Plan de 3 iteraciones**: primera para claridad y consistencia, segunda para productos explorables, tercera para calidad técnica y aprendizaje.
8. **Preguntas de alto impacto para Felipe**: máximo 10; no preguntes detalles que puedas descubrir en el repositorio.

Cada recomendación debe tener: problema, impacto, propuesta, trade-off, prioridad y criterio de aceptación. Da una opinión clara: no te limites a resumir archivos.

No edites código todavía. Primero entrega el diagnóstico y el plan de cambios para que podamos elegir qué implementar.

---

## Información de corte

Este encargo corresponde al commit `564613b` (`Consolidate onboarding and product lab updates`). Si GitHub muestra otra versión, declara esa diferencia antes de evaluar.
