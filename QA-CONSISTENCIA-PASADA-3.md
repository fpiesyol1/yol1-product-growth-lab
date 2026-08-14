# QA de consistencia UX/copy — pasada 3

**Fecha:** 14 de agosto de 2026  
**Cruce usado:** implementación local, `BRIEF-NOCHE-EJECUCION.md`, `QA-TECNICO-PASADA-2.md` y `QA-GTM-PASADA-2.md`.  
**Límite:** no se modificó código. El servidor local no respondió en `localhost:3000` ni `[::1]:3000`; los recorridos interactivos quedan pendientes de revalidación cuando esté activo.

## Conclusión

La dirección ya es coherente: valor antes de identidad, Acompañante como hábito de orden + pendientes sociales, y productos futuros tratados como investigación. Lo que falta consolidar es la frontera entre **prototipo público**, **herramienta de colaboración** y **documentación de equipo**. Esa frontera determina tanto el copy como los datos, permisos y expectativas de cada CTA.

## P0 — bloquear antes de compartir más ampliamente

### C-01 · Chat de Inicio debe ser utilizable antes de elegir IA

**Consistencia afectada:** la promesa de Onboarding dice “explorar y hacer preguntas sin registrarte”; el chat puede quedar deshabilitado cuando hay IA configurada hasta elegir un modo.  
**Cruce técnico:** el QA técnico exige consentimiento explícito antes de enviar texto a una IA real; eso no exige bloquear el modo demo.  
**Resolución:** modo **demo** activo por defecto. El switch a IA real debe ser una elección posterior, con propósito y aviso de datos.  
**Criterio de prueba:** sugerencias y campo responden desde primer render con y sin configuración de IA.

### C-02 · La ficha de producto no debe acompañar al visitante público

**Consistencia afectada:** “Ficha de producto”, arquitectura, fuentes, riesgos y preguntas abiertas aparecen debajo de experiencias de Onboarding, Acompañante y Builder.  
**Cruce técnico/GTM:** ambos QA necesitan esa ficha para PRD; GTM pide que la pantalla resuelva un momento, no que exhiba su arquitectura.  
**Resolución:** mostrarla solo en `/review` o en un modo **Equipo**. En la app pública, conservar únicamente explicaciones puntuales: por qué aparece algo, qué se pedirá y qué se desbloquea.  
**Criterio de prueba:** una visita pública no ve AWS, Cognito, CDP, fuentes internas, riesgos o preguntas de ingeniería.

### C-03 · “Crear propuesta” no puede prometer sincronización desde chat externo

**Consistencia afectada:** Builder enseña una demo de conversación que produce una vista previa, mientras el MCP descrito es de solo lectura.  
**Cruce técnico:** no existe todavía identidad, almacenamiento/callback de propuesta ni autorización de escritura.  
**Resolución:** copy de tres pasos: **conversa en tu IA → copia el resumen → envíalo al Lab**. La vista previa debe llamarse “ejemplo de propuesta”, no resultado sincronizado.  
**Criterio de prueba:** no hay texto que sugiera que YOL1 lee chats privados o que una pantalla aparece automáticamente en el Lab.

## P1 — corrección de coherencia antes de ampliar productos

### C-04 · Estados de portafolio: “Publicado” no equivale a listo

Onboarding y Builder figuran “PUBLICADO”, pero su contenido incluye investigación, decisiones abiertas y guías. Home Banking/Tarjetas/Remesas usan “NO PUBLICADO”, “en pausa” y estados editoriales variados.

**Contrato recomendado:**

| Estado | Uso público | Uso interno |
|---|---|---|
| **Disponible para explorar** | prototipo utilizable con límites claros | puede recoger feedback |
| **En investigación** | sin flujo funcional | hipótesis, research y PRD |
| **En revisión** | no visible a visitantes | borrador limitado al equipo |

Evitar “Publicado” mientras se trate de un prototipo de aprendizaje.

### C-05 · Vocabulario de acción todavía no es único

El QA técnico pide que los eventos no se deriven del copy; el QA GTM pide que cada CTA describa una consecuencia real. En la UI aún aparecen variantes como “Ya lo vi”, “Ignorar”, “Dividir”, “Cobrar”, “Pagar”, “Preparar reparto” y “Guardar”.

**Glosario operativo:**

| Objetivo | CTA visible | Evento candidato |
|---|---|---|
| Quitar sugerencia | Ignorar | `moment_ignored` |
| Abrir evidencia | Revisar | `moment_review_opened` |
| Preparar división | Preparar reparto | `split_draft_started` |
| Preparar solicitud | Preparar cobro | `collection_draft_started` |
| Preparar respuesta | Preparar pago | `payment_draft_started` |
| Cerrar algo confirmado | Marcar como resuelto | `pending_resolved` |

`Ya lo vi` no comunica si se oculta, se confirma o solo se reconoce. Reservar “Guardar” para un borrador/documento, no para pagos, cobros ni decisiones.

### C-06 · Onboarding progresivo necesita una intención material concreta

El recorrido ya permite explorar antes de OTP, lo que cumple la dirección. Pero “Quiero activar una función” sigue siendo demasiado genérico: recibir dinero, transferir, conectar banco y abrir una cuenta implican diferentes capacidades, partners y niveles de identidad.

**Cruce técnico:** usar `capability_key` y política versionada; no pedir OTP/KYC por un paso de UI.  
**Copy recomendado:** “Completa esto para **[acción concreta]**. Te pedimos **[dato]** para **[propósito]**. Esto desbloquea **[capacidad]**.”

### C-07 · Feedback ya declara destino, pero Reviews debe cerrar el ciclo editorial

Feedback identifica tipo y confirma local/compartido. Reviews separa Personas, Decisiones e IA, un avance correcto. Sin embargo, los estados se ven como botones sobre una lista y no como Kanban operativo; tampoco se ve una ruta explícita de “Convertido” hacia mejora, guía Markdown o proyecto.

**Resolución:** mantener la separación actual y agregar vista **Por tema** + destino obligatorio al convertir: **mejora**, **guía**, **proyecto**. No mezclar “Corregir IA” con la taxonomía de feedback humano.

### C-08 · Ganar, Mi banco y Tarjetas requieren niveles de expectativa distintos

- **Ganar:** está en navegación pero su contenido es placeholder; debe decir “En investigación” o tener una hipótesis mínima, no parecer una sección funcional vacía.
- **Mi banco:** forma parte de activación progresiva; no debe sugerir que conectar banco es requisito para obtener valor del Acompañante.
- **Tarjetas:** el primer MVP debe elegir una intención dominante (pagar, ver datos, revisar movimiento o beneficio), no anunciar QR/NFC, tarjeta compartida y beneficios como una sola capacidad.

### C-09 · Limpiar residuos de copy y CSS de etapas previas

Persisten reglas CSS para `.portfolio-heading` y `.event-inspector`, aunque el markup principal ya no los usa. Permanece además una diagonal en Ganar, contraria al brief.  
**Resolución:** retiro técnico en una iteración de mantenimiento; no reintroducir la inspección de eventos en la UI pública.

## P2 — validación visual, accesibilidad y navegación

### P2.1 Mobile y escritorio

Cuando vuelva el servidor, comprobar 390×844, 768×1024 y 1440×1000 para:

- rail de seis productos sin clipping ni tabs inaccesibles;
- Feedback móvil sin tapar CTA, navegación inferior o teclado;
- Cartola y Cobrar/pagar con scroll interno aislado;
- Onboarding/Builder con botón de volver siempre visible;
- foco de teclado visible y orden lógico;
- contraste del texto mono pequeño en modo claro y oscuro.

### P2.2 Señales de certeza

Una misma fórmula debe aparecer donde importa:

- **Ejemplo: no se mueve plata** junto a una acción financiera simulada.
- **Por validar** cuando dependa de partner, licencia, KYC o evidencia insuficiente.
- **No enviado** en vista previa de mensaje.

No repetir los tres avisos dentro del contenido de lectura general.

### P2.3 Jerarquía de la home contextual futura

El marco de GTM propone “Se viene / Cambió / Está pendiente”. Para mantener consistencia con el Acompañante, esos rótulos deben ser tipos de **momento financiero**, no nombres nuevos de producto ni otra navegación paralela.

## Recorridos a probar cuando el entorno esté disponible

1. Inicio → pregunta demo inmediata → respuesta → feedback de respuesta.
2. Inicio → revisar movimiento → Cartola → nota → volver a Finanzas.
3. Inicio → preparar cobro/pago → vista previa de texto → volver sin enviar.
4. Onboarding → explorar sin OTP → elegir una capacidad concreta → contacto/OTP → salida de error/reenvío/ayuda.
5. Mi banco → explicar gate → volver sin ingresar identidad; luego estados de revisión/error.
6. Builder → copiar URL → copiar prompt → volver → enviar propuesta → confirmar local/compartido.
7. Feedback → Review compartido: tipo, producto, pantalla, fecha, estado y destino editorial visibles.
8. Cambio de tema y zoom/teclado: acciones y estados no dependen únicamente del color.

## Orden de cierre sugerido

1. Resolver C-01 a C-03: demo inmediata, frontera público/equipo, Builder honesto.
2. Consolidar estados de productos y glosario de CTAs/eventos.
3. Dar a Onboarding un `capability_key` visible en copy y diseñar excepciones.
4. Convertir Reviews en tablero por estado/tema/destino.
5. Hacer QA visual interactivo completo cuando localhost esté operativo.
