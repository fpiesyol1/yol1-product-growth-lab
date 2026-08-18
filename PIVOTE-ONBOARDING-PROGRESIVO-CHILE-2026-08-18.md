# Pivote consciente — Onboarding progresivo Chile

- **Fecha:** 18-ago-2026
- **Estado:** prototipo local para conversación; no es una decisión de producción ni una opinión legal.
- **Input directo de Felipe:** `Ideas Onboarding.pdf` + secuencia verbal del 18-ago-2026.
- **Superficie:** variante `ProgressiveOnboardingFlow`; la versión previa se conserva como rollback.

## 1. Decisión de producto que estamos probando

La entrada deja de ser una pantalla plana con tres botones. Se convierte en tres historias breves con swipe que venden valor antes de pedir datos:

1. **Organiza:** reúne la historia de bancos/cartolas y ordena ingresos, gastos, cobros y deudas.
2. **Entiende:** convierte movimientos en explicaciones, alertas y oportunidades revisables.
3. **Úsala bien:** muestra productos y acciones en contexto, sin afirmar que ya están disponibles.

Después de las historias, la hipótesis de recorrido es:

`valor` → `correo/teléfono` → `OTP` → `nombre + RUT declarados` → `Acompañante financiero` → `verificación completa opcional/contextual`.

Este pivote modifica la secuencia anterior: ya no exige elegir una acción material antes de crear acceso. Para conservar el principio “valor antes de datos”, las historias deben ser útiles, entendibles y recorribles antes del registro.

## 2. Lectura normativa Chile y límites de interpretación

### Circular UAF N°62

- La DDC es identificación y conocimiento del cliente, incluye entender el propósito de la relación y es un proceso continuo.
- Para una relación permanente, el sujeto obligado debe obtener la información definida por la Circular y tomar medidas razonables o adecuadas para verificarla.
- La Circular permite DDC simplificada en productos, servicios, operaciones o canales calificados como bajo riesgo mediante una política documentada.
- Entre las medidas simplificadas está completar datos con fuentes terceras y postergar la verificación de identificación hasta superar un umbral definido.
- Esto **no** significa que escribir nombre y RUT produzca KYC aprobado. En el prototipo, ambos son `declared_profile`, no `verified_identity`.

**Traducción UX:** nombre + RUT pueden preparar una experiencia local y permitir navegación no transaccional. Para abrir u operar una capacidad financiera deben resolverse el producto, el sujeto obligado, la política de riesgo, la información DDC completa, la verificación y los controles aplicables.

Fuente primaria: [Circular UAF N°62](https://www.uaf.cl/media/documentos/Circular_N62.pdf), especialmente sección F.

### Tarjetas de pago con provisión de fondos

El régimen del Banco Central distingue tarjetas innominadas y nominativas, con topes diferentes según la forma de apertura y la acreditación de identidad. Los montos de $100.000 y $500.000 son reglas de ese instrumento específico; no son una autorización general para que cualquier producto YOL1 mueva dinero con OTP o RUT declarado.

**Traducción UX:** no mostraremos saldo, cuenta activa ni recepción de dinero como resultado del perfil básico. Si YOL1 usa este vehículo, su escalera se diseña como capability propia con emisor, contrato, controles y política aprobados.

Fuente primaria: [Capítulo III.J.1.3 del Compendio de Normas Financieras](https://www.bcentral.cl/documents/d/banco-central/capiiij13?download=true).

### Sistema de Finanzas Abiertas

La NCG 514 fue modificada por la NCG 569 y su implementación se postergó hasta julio de 2027. Las historias pueden explicar la futura organización de datos, pero el prototipo no debe afirmar cobertura bancaria, consentimiento SFA operativo ni datos conectados hoy.

Fuente primaria: [NCG 569 — CMF](https://www.cmfchile.cl/portal/normativa/624/w4-article-111273.html).

## 3. Escalera incremental propuesta

| Etapa | Qué entrega la persona | Estado honesto | Qué puede hacer | Qué no puede hacer |
| --- | --- | --- | --- | --- |
| E0 · Valor | Nada | Visitante | Recorrer historias y entender la propuesta | Guardar acceso, conectar datos, mover dinero |
| E1 · Acceso | Correo o teléfono + OTP | Canal confirmado | Recuperar una relación de acceso | Afirmar identidad, KYC o cuenta financiera |
| E2 · Perfil básico | Nombre + RUT declarados | Perfil declarado, no verificado | Entrar al Acompañante y navegar productos demo | Conectar bancos, abrir cuenta, recibir o transferir dinero |
| E3 · Intención material | Capability específica | Requisitos explicados | Entender qué falta y decidir continuar | Asumir que KYC por sí solo habilita la capability |
| E4 · Verificación | Documento, screening y biometría si aplica | Caso en progreso/revisión/verificado | Satisfacer requisitos de identidad del producto | Operar sin vehículo, contrato, controles y disponibilidad aprobados |
| E5 · Capacidad | Contratos/consentimientos propios del producto | Capability aprobada y disponible | Operar sólo dentro de límites y controles | Inferir nuevas capacidades desde el mismo KYC |

## 4. Pantallas del primer pivote

### 01 · Historias de bienvenida

- Una promesa por lámina, con visual dominante, título corto y tres pruebas concretas.
- Navegación por swipe horizontal, con barras de progreso inspiradas en historias; sin pestañas ni botones anterior/siguiente.
- Una única acción visible y constante: `Inicia en YOL1`.
- Flechas izquierda/derecha como alternativa accesible al gesto.
- Copy permanente: todavía no se piden datos ni se activan productos.

Patrón aprendido de Revolut: propuesta de valor antes del formulario, continuidad visual y una decisión principal por pantalla.

### 02 · Crear acceso

- Correo o teléfono como rutas equivalentes.
- Google/Apple visibles como SSO candidato, deshabilitados hasta tener integración aprobada.
- Explicación explícita de que el canal sirve para entrar y recuperar el espacio.

### 03 · OTP

- Seis dígitos, autofill compatible, código de ejemplo, error corregible, expiración, rate limit y recuperación neutral.
- Nunca decir “confirma que eres tú”; decir “confirma que controlas este canal”.

### 04 · Nombre y RUT

- Nombre como preferencia visible de trato.
- RUT validado localmente sólo en formato y dígito verificador.
- Microcopy: dato declarado, no consulta Registro Civil y no significa identidad verificada.
- Nombre/RUT no se guardan en localStorage ni analytics en esta demo.

### 05 · Entrada al producto

- Resultado principal: `Ya puedes navegar`.
- Primer CTA: `Ir al Acompañante financiero`.
- Estado visible: canal confirmado, perfil declarado, verificación completa pendiente.
- Segundo CTA: `Seguir con la verificación completa`.

### 06–08 · Verificación completa demo

- Explicación previa del propósito.
- Captura de documento con feedback de legibilidad y recaptura.
- Prueba de vida con finalidad, responsable, retención y alternativa de ayuda visibles.
- Cierre en `revisión`, nunca en una aprobación inferida ni una capacidad de dinero activa.

Patrones de referentes:

- **Revolut:** feedback inmediato, recaptura y compliance explicado como experiencia.
- **Monzo:** anticipa los pasos y explica por qué necesita documento + video.
- **Wise:** verificación gatillada por contexto, estado pendiente visible y recuperación desde fallas.

## 5. Hipótesis y métricas

| Hipótesis | Señal |
| --- | --- |
| Las historias aumentan comprensión de valor | % que puede explicar al menos una promesa sin mencionar “banco genérico” |
| Pedir contacto después de las historias conserva intención | conversión historias vistas → OTP solicitado |
| Nombre + RUT no se confunden con KYC | % que responde “perfil declarado, no identidad verificada” |
| Entrar primero al asistente acelera activación | % que hace una primera pregunta o explora una recomendación |
| KYC opcional/contextual reduce rechazo | inicio de verificación sólo desde una razón entendida y abandono por paso |

## 6. Decisiones reales para Felipe

1. Confirmar el nombre de la tercera promesa: `Úsala bien` vs. una alternativa más natural.
2. Confirmar si el RUT es obligatorio antes de entrar al asistente o si se puede pedir al primer uso que necesite personalización local.
3. Definir qué productos demo aparecen tras E2 y cuál es el orden de navegación.
4. Definir la primera capability financiera real que justificaría iniciar E4.
5. Confirmar si la verificación completa se ofrece proactivamente o sólo al activar esa capability.

## 7. Guardrails de esta versión

- Sin OTP, SSO, Registro Civil, banco, cámara, proveedor KYC o analytics real.
- Sin almacenar nombre, RUT, contacto, OTP, documento o biometría en el snapshot local.
- Sin afirmar cuenta, saldo, transferencia, tarjeta o datos conectados.
- Sin commit, push ni despliegue hasta revisión visual de Felipe.

## 8. Trazabilidad y QA del ciclo

- Implementación reversible: `app/onboarding-progressive.tsx`, activada por un flag local en `app/page.tsx`; el flujo anterior sigue disponible como rollback.
- Lógica nominal: `lib/onboarding-pivot-state-machine.ts`; el orden de eventos evita que OTP, perfil o biometría adelanten etapas.
- Validación local: `lib/onboarding-validation.ts`; un RUT incorrecto queda asociado a su mensaje accesible y mantiene deshabilitado el CTA.
- Persistencia: el snapshot acepta `selected_capability: none` para registrar sólo avance demo, sin inventar intención material ni guardar PII.
- QA visual/runtime: 320 × 568, 390 × 844 y 1440 × 900; recorrido completo hasta revisión KYC; controles móviles visibles con área táctil mínima de 44 px; consola sin errores ni advertencias.
- Verificación técnica: 84 pruebas aprobadas, TypeScript sin errores y build de producción aprobado.
