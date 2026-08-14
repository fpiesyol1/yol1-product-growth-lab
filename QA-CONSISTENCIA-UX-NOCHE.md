# QA de consistencia UX y copy — YOL1 Product Growth Lab

**Fecha:** 14 de agosto de 2026  
**Alcance:** auditoría estática de navegación, labels, acciones, estados, responsive y documentos. No modifica código ni datos.  
**Criterio rector:** decisión verbal de Felipe > brief nocturno > documentación previa > implementación actual.

## Resumen ejecutivo

El Lab tiene una base visual y de interacción sólida, pero hoy conviven tres relatos: el prototipo público, el espacio interno de revisión y documentos de una etapa anterior. Antes de sumar productos, conviene separar claramente lo que una persona usa, lo que un colaborador propone y lo que el equipo revisa.

Los riesgos principales no son de estética: son **promesas contradictorias**, **acciones con nombres distintos para el mismo resultado** y una **Bandeja de aprendizaje que aún mezcla estado editorial, feedback humano y respuestas de IA**.

## Hallazgos priorizados

### P0 — resolver antes de abrir Reviews a más personas

| Hallazgo | Evidencia | Riesgo UX | Recomendación |
|---|---|---|---|
| La Bandeja no representa todavía el Kanban pedido. | `app/review/page.tsx` usa `Pendiente / Aprobar / Equivocado / Descartar`; el brief pide `nuevo / en revisión / guardar para después / resuelto / ignorado`. | Felipe no puede priorizar feedback sin forzar una decisión editorial que no corresponde. “Equivocado” sirve para corregir IA, no para clasificar feedback humano. | Separar `Feedback de personas`, `Conflictos de fuentes` y `Hallazgos IA`. Para feedback humano: **Nuevo → En revisión → Guardar para después → Resuelto → Ignorado**. Registrar mejora/guía/proyecto como destino editorial separado y reservar “equivocado” para respuestas de IA. |
| La clave de Reviews no puede ser `1234` como secreto publicado. | `app/review/page.tsx` exige `YOL1_REVIEW_TOKEN`; el brief solicita `1234` temporal. | Si se configura en Vercel, cualquier persona que pruebe `1234` podría leer feedback compartido. | Para pruebas inmediatas: usar `1234` solo en local. Para Vercel: mantener token largo, y si se necesita menos fricción implementar enlace de revisión con expiración o login de administrador. Mostrar claramente si la bandeja está local o compartida. |
| La confirmación de feedback puede prometer “bandeja compartida” sin garantizar que se vea en Reviews. | `FeedbackPanel` guarda siempre local y luego intenta POST; Reviews cambia a modo local si falta storage/review token. | El usuario cree que su feedback llegó al equipo cuando quedó solo en su navegador. | Estado explícito y persistente: **“Enviado al equipo”**, **“Guardado solo en este dispositivo”** o **“No enviado: reintentar”**. Añadir un identificador de envío y una vista de diagnóstico solo para administrador. |
| El MCP se declara de solo lectura, pero la guía sugiere que “la propuesta aparece acá”. | `app/page.tsx`, `ProjectBuilderScreen`, `BuilderGuideScreen`; `app/api/mcp/route.ts` expone contexto/brief, sin almacenar propuesta visual. | Una persona espera que ChatGPT/Claude cree pantallas dentro del teléfono; hoy no existe sincronización. | Cambiar copy a: “Cuando envíes tu propuesta desde este Lab, la verás en revisión”. No prometer que una conversación externa se materializa sola hasta implementar autenticación, persistencia y callback. |

### P1 — siguiente iteración de producto y copy

| Hallazgo | Evidencia | Impacto | Recomendación |
|---|---|---|---|
| El portafolio/documentación no coinciden sobre productos publicados. | `lib/product-portfolio.ts` marca Onboarding, Acompañante y Construir como publicados; `README.md` y `MVP-SPEC.md` aún dicen que solo uno o dos están publicados. | Confunde qué puede probar un visitante y qué es una propuesta. | Definir una sola fuente de verdad de portfolio y generar README/MVP desde ella o revisar el documento en cada cambio de estado. |
| El brief pide quitar referencias internas del público, pero siguen visibles. | `app/page.tsx` contiene `YOL1 MCP · PRÓXIMAMENTE`, “GitHub versiona…”, “Felipe resuelve contradicciones…”, “Bandeja del Lab”; `PRODUCT-DESIGN.md` conserva la diagonal y varios labels ya descartados. | Público externo ve operación interna y conceptos que no necesita. | Aplicar el brief: separar copy público, copy de colaboración y copy interno. La ficha técnica debe estar detrás de Reviews o en un modo “equipo”. |
| La misma acción recibe demasiados nombres. | `Ya lo vi`, `Ignorar`, `Deshacer`, `Revisar`, `Cobrar`, `Pagar`, `Simular pago`, `Recordar`, `Ya me pagaron`, `Repartir`, `Distribuir`. | La persona no sabe si está ocultando, resolviendo, pagando o iniciando una acción real. | Adoptar el glosario de este documento. En particular, usar “Ignorar” para ocultar una sugerencia; “Marcar como resuelto” para cerrar un pendiente; “Preparar cobro/pago” para una simulación. |
| Cartola ofrece tres acciones fijas, aun cuando no todas aplican. | `Ledger` siempre muestra `Ya lo vi / Revisar / Dividir|Cobrar`, incluida una transferencia propia. | Da señales falsas: una transferencia propia no se divide ni se cobra. | Acciones contextuales por fila: **Ignorar/Marcar revisado**, **Revisar**, y opcional **Preparar reparto** o **Preparar cobro** solo donde exista evidencia. |
| Acompañante mezcla “ejemplo”, “demo”, “simulación” y “datos ficticios”. | Inicio, Finanzas, Cartola, Cobrar, Ahorrar, Mi banco y mensajes usan variantes distintas. | Baja la comprensión de qué sí ocurre y qué no. | Usar un disclosure corto persistente solo junto a acciones sensibles: “Ejemplo: no se mueve plata”. Evitar repetirlo en cada bloque informativo. |
| Onboarding pide teléfono/email antes de que se vea el valor exploratorio definido. | `OnboardingFlow`: Bienvenida → teléfono/email → OTP → entrar al acompañante. | Contradice la dirección confirmada: explorar/conversar antes de completar datos. | Reordenar: Bienvenida → Explorar acompañante (sin datos) → al intentar activar acción material → teléfono/email + OTP → pre-registro → KYC progresivo según capacidad. |
| Mi banco declara “RUT + serie” y biometría como ruta, pero no ofrece salida de soporte, revisión ni pérdida de acceso. | `MyBank` tiene start/rut/bio/done; el Brief pide ruta de Customer Success pendiente. | Dead end frente a error, timeout o revisión manual. | Incluir en diseño/PRD estados: OTP vencido, revisión pendiente, documento no leído, biometría no completada, cambio/pérdida de teléfono y “necesito ayuda”. Sin afirmar operación real. |
| `Ganar` sigue como placeholder pese a ser un módulo elegido para desarrollar. | `EarnMore` solo vuelve al inicio; README/MVP lo llaman “Próximamente”. | El menú promete una sección navegable y devuelve una pantalla sin siguiente paso. | Definir una hipótesis mínima o marcarlo claramente como espacio de investigación, sin CTA de volver que parezca un flujo terminado. |

### P2 — pulido de experiencia y mantenibilidad

| Hallazgo | Evidencia | Recomendación |
|---|---|---|
| Los documentos contienen decisiones vencidas: “Tu plata, más simple”, diagonal inferior, Experimentos como menú, número de módulos publicados, etc. | `MVP-SPEC.md`, `README.md`, `PRODUCT-DESIGN.md`, `QA-CIERRE.md`. | Crear un registro de decisiones con fecha/estado y retirar o archivar la documentación supersedida. |
| El selector superior se comporta distinto al relato de productos autorizados. | Producto no publicado abre estado editorial; Builder y KYC tienen flujos navegables. | Usar tres estados visibles: **Explorar**, **En investigación**, **No publicado**, y reservar “Publicado” para algo listo para test externo. |
| Feedback compacto de productos no publicados no muestra tipo de feedback. | `compact` elimina Me gusta / Mejoraría / Idea y guarda como `idea`. | Se pierde intención de quien comenta. | Mantener selector de tipo incluso en compacto, o rotularlo explícitamente “Deja una idea”. |
| El diseño desktop depende de un teléfono alto y panel lateral. | `.phone` usa altura `min(900px, calc(100vh - 64px))`; contenido con scroll interno y ficha debajo. | Revisar a 768 px de alto y a zoom 125–200%; verificar foco, teclado y lectura sin scrolls encadenados. |
| Varios botones informativos se registran como eventos potenciales de click. | `proposedEventForElement` convierte todo texto accionable en un nombre. | Datos de analytics futuros ruidosos. | Inventariar solo eventos con intención de producto; excluir navegación puramente visual, hover y controles de presentación. |

## Recorrido por producto

### Acompañante financiero

**Recorrido principal esperado:** Inicio → pendiente contextual → evidencia/Cartola o Cobrar y pagar → volver al resumen o dejar nota → conversación para entender el siguiente paso.

- Inicio está alineado con “entender y ordenar”, pero el carrusel no explica si la tarjeta es una alerta, una deuda o un beneficio hasta que se lee el tag.
- Finanzas y Cartola compiten por “control del mes”. La regla: Finanzas debe responder **cómo voy**; Cartola debe responder **qué pasó**.
- Cobrar y pagar debe usar pares semánticos estables: **Me deben / Le debo**, **Preparar cobro / Preparar pago**, **Marcar como resuelto**. “Simular pago” no es equivalente a “Pagar”.
- Ahorrar debe terminar cada oportunidad con una conclusión y evidencia, nunca con una sugerencia que parezca una oferta garantizada.
- Ganar necesita una hipótesis de valor o quedar expresamente en investigación.
- Mi banco pertenece a activación progresiva; no debe parecer que conectar banco es requisito para usar el Acompañante.

### Onboarding y KYC progresivo

**Recorrido esperado:** valor de exploración → acción material elegida → contacto/OTP → pre-registro → capacidad habilitada o KYC incremental → estado claro / ayuda.

- Hoy el flujo es lineal antes de mostrar el Acompañante; invertir este orden es la principal corrección.
- Cada escalón debe decir: **qué se pide**, **para qué**, **qué desbloquea**, **qué no se hace aún** y **qué hacer si falla**.
- “Activar Mi banco” debe ser una capacidad futura concreta, no un sinónimo ambiguo de validar identidad.

### Home Banking

No prototipado. El estado vacío es coherente, pero antes de diseñar requiere una hipótesis única: “YOL1 te muestra lo que importa hoy según tu momento y compromisos”, no una góndola de productos.

### Tarjetas

No prototipado. El primer caso de uso debe ser uno: **pagar ahora**, **ver datos**, **revisar movimiento** o **encontrar beneficio**. Intentar resolver QR/NFC, tarjetas compartidas, empresa y beneficios en la primera pantalla diluye la propuesta.

### Remesas

Correctamente fuera de alcance. No agregar pantalla ni interacción hasta que se reactive formalmente.

### Construir mi propio producto

El flujo debe dejar claro qué pertenece a la IA personal, qué controla YOL1 y qué persiste en YOL1. Actualmente guía bien el pegado del MCP, pero debe ajustar el resultado prometido: un MCP de solo lectura no puede poblar la vista de experimentos sin una integración posterior.

### Bandeja de aprendizaje

Propuesta de orden:

1. **Feedback de personas**: tarjetas con producto, pantalla, tipo, contenido, fecha y origen. Acciones Kanban.
2. **Decisiones pendientes**: conflictos concretos, comparables y compactos. Acciones A / B / falta contexto.
3. **Hallazgos IA**: pregunta, respuesta, calificación, patrón detectado, tema y destino sugerido: conocimiento, mejora, experimento o descartar.
4. **Vista por temas**: agrupa y permite crear una ficha Markdown de salida, sin editar el producto automáticamente.

## Glosario canónico propuesto

| Concepto | Usar | Evitar |
|---|---|---|
| Producto principal | **Acompañante financiero** | Asesor financiero, Análisis financiero, Acompañante a secas en títulos |
| Promesa editorial | **Tu plata, más clara** | Tu plata, más simple |
| Resumen mensual | **Resultado del mes** | Saldo activo, saldo disponible |
| Ingresos / egresos | **Te entró / Gastaste** | Ingresos / Egresos en copy de usuario |
| Deudas a favor | **Me deben / Por cobrar** | Cuentas por cobrar, recuperable |
| Deudas propias | **Le debo / Por pagar** | Deudas por pagar, pagar pendiente |
| Ocultar una sugerencia | **Ignorar** | Ya lo vi, descartar, archivar |
| Cerrar una deuda | **Marcar como resuelto** | Ya me pagaron, ya pagué, conciliar (como CTA general) |
| Entender una señal | **Revisar** | Ver qué pasó, investigar |
| Preparar reparto | **Preparar reparto** | Dividir, distribuir, repartir gasto (usar “reparto” para el objeto y “preparar” para la acción) |
| Preparar solicitud | **Preparar cobro** / **Preparar pago** | Cobrar, pagar, enviar cobro, simular pago |
| Datos de prueba | **Ejemplo** | Demo local, datos ficticios, simulación, prototipo (usar el detalle legal/técnico solo cerca de una acción sensible) |
| IA del producto | **YOL1** | YOL One, asistente demo, IA del Lab |
| Producto de banco | **Mi banco** | Home Banking dentro de la app; reservar Home Banking para el producto futuro |
| Espacio de IA colaborativa | **Construir mi propio producto** | Builder, MCP próximamente |
| Estado no disponible | **En investigación** | Próximamente, en pausa, no publicado, placeholder (elegir uno solo para UX pública) |

## Checklist QA repetible

### Antes de implementar

- [ ] La pantalla tiene una hipótesis y un trabajo del usuario claro.
- [ ] La pantalla usa conceptos del glosario, no sinónimos improvisados.
- [ ] Se declara qué es exploración, qué guarda datos y qué activa una capacidad.
- [ ] Evento propuesto tiene verbo y objeto simple; metadata estándar: `event_id`, `event_at`, identificador permitido, `session_id`, `product_key`, `screen_key`, `action_key`, `platform`, `app_version`, `schema_version`, `source`, consentimiento y correlación cuando aplique.
- [ ] Ficha indica datos a guardar, a consultar, fuente de verdad, retención, permisos y riesgo.

### Recorrido funcional

- [ ] Cada CTA lleva a un destino, estado o confirmación visible.
- [ ] Cada estado tiene salida: atrás, cancelar, deshacer o ayuda.
- [ ] Un cambio de estado no se presenta como pago, cobro, transferencia, conexión o KYC real si no lo es.
- [ ] Los flujos de identidad contemplan error, timeout, revisión manual y pérdida de acceso.
- [ ] Feedback confirma inequívocamente si quedó local, compartido o falló.

### Consistencia y visual

- [ ] La navegación superior, inferior y los títulos nombran el mismo producto/módulo.
- [ ] Los CTAs usan las acciones canónicas del glosario.
- [ ] Color no es la única señal de estado o riesgo.
- [ ] Funciona a 320, 390, 768 y 1440 px de ancho; a 768 px de alto; con zoom 200% y teclado.
- [ ] No hay overflow horizontal ni dos scrolls competiendo sin propósito.

### Preparación PRD

- [ ] Arquitectura separa: cliente React Native, APIs/servicios AWS, integraciones, observabilidad y datos.
- [ ] Datos separan PII, datos financieros, consentimiento, eventos analíticos y datos editoriales.
- [ ] KYC/licencias se rotulan “No aplica”, “Por validar” o “Requerido” con la razón y fuente.
- [ ] Hay riesgos, supuestos, dependencias de partner y decisiones pendientes explícitas.

## Próximo pase recomendado

1. Aplicar primero las instrucciones globales del `BRIEF-NOCHE-EJECUCION.md`.
2. Rediseñar Reviews en sus tres bandejas antes de agregar nuevos agentes o automatizaciones.
3. Corregir el orden de onboarding hacia exploración antes de identidad.
4. Ejecutar QA visual e interactivo de los recorridos Acompañante, Onboarding, Builder y Reviews.
5. Solo después, iniciar investigación/propuesta de Home Banking y Tarjetas; Remesas permanece fuera de alcance.
