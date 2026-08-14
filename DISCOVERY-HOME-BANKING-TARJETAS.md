# Discovery de diseño — Home Banking y Tarjetas

**Para:** siguiente iteración visual/PRD de YOL1.  
**Estado:** conceptos de investigación; no son producto disponible ni instrucciones de integración.  
**Decisión verbal que guía:** YOL1 debe ser contextual y agéntico, no una góndola de productos. Tarjetas es un ecosistema de intención de pago, no una foto de plástico.

> **Actualización 14-ago-2026:** para Tarjetas, la dirección vigente y el research específico quedan en `DIRECCION-PRODUCTOS-FELIPE.md`, `RESEARCH-TARJETAS-YOL1-2026-08-14.md` y `PRD-TARJETAS-YOL1.md`. Esos archivos prevalecen sobre este primer borrador cuando exista conflicto. QR/NFC/wallet/compartida/corporativa quedan fuera del prototipo y sólo permanecen como hipótesis con gates.

---

## Home Banking

### Trabajo a resolver

Cuando la persona entra, quiere responder: **“¿Qué me sirve mirar o resolver con mi plata hoy?”**. Antes de tener productos bancarios propios, la home debe entregar contexto sin asumir que puede ejecutar una acción.

### Concepto A — Hoy con tu plata

Una pantalla de tres situaciones priorizadas:

- **Se viene:** arriendo, luz, suscripción o próximo pago.
- **Cambió:** gasto fuera de patrón o una cuenta reactivada.
- **Pendiente:** una deuda, solicitud o movimiento por revisar.

Cada tarjeta explica el motivo, muestra fecha/certeza y ofrece solo `Ver`, `Guardar para después` o `Marcar resuelto`.

**Ventaja:** es comprensible sin enseñar productos.  
**Riesgo:** reglas débiles generan alertas irrelevantes.  
**Experimentar:** prueba de cinco segundos: mostrar home y pedir a la persona que cuente qué debería hacer primero.

### Concepto B — Línea de tiempo hacia el próximo pago

Una franja temporal desde hoy hasta sueldo/fecha elegida: ingresos conocidos, compromisos próximos, gasto disponible estimado y pendientes sociales. La persona puede tocar una fecha y ver evidencia.

**Ventaja:** hace visible el mes y ayuda a anticipar.  
**Riesgo:** requiere datos confiables, período personalizable y explicaciones claras; una cifra errónea daña confianza.  
**Experimentar:** comparar comprensión de “cuánto puedo gastar” con la tarjeta contextual versus línea de tiempo.

### Concepto C — Pídele algo a YOL1

Campo conversacional/voz con atajos: “¿qué vence esta semana?”, “¿qué cambió?”, “¿a quién debo?”. La respuesta trae una tarjeta de evidencia y siguiente paso, no una conversación infinita.

**Ventaja:** hace visible la ambición agéntica.  
**Riesgo:** audio/IA aumentan complejidad, privacidad y expectativas antes de que exista capacidad real.  
**Experimentar:** comenzar con texto y cuatro atajos. Añadir audio solo si el problema no se resuelve con navegación contextual.

### Recomendación

**Partir por A: “Hoy con tu plata”**, con una franja pequeña de B para próximos compromisos. C queda como acceso secundario (“Pregúntale a YOL1”) y no como hero. Así se valida que la contextualización aporta valor antes de montar una experiencia de IA compleja.

### Medición y datos

| Elemento | Propuesta |
|---|---|
| Métrica norte | % que identifica correctamente una situación y toma una acción voluntaria |
| Señales secundarias | detalle abierto, explicación vista, guardar/postergar, retorno semanal |
| Anti-métricas | tarjetas ignoradas repetidamente, quejas por confusión, opt-out de recordatorios |
| Eventos | `banking_home_viewed`, `moment_seen`, `moment_explained`, `moment_action_selected`, `moment_snoozed`, `moment_resolved` |
| Dominio | `financial_moment`: tipo, regla, evidencia, certeza, estado, vigencia |
| Metadata | `event_id`, `event_at`, `anonymous_id` o `user_id`, `session_id`, `product_key`, `screen_key`, `action_key`, `app_version`, `schema_version`, `platform`, `source`, `consent_analytics` y `correlation_id` cuando aplique; regla, certeza y superficie sólo como propiedades específicas minimizadas |

**No incluir en analytics general:** monto/saldo exacto, nombre de comercio completo, identificadores de cuenta, RUT, biometría o credenciales.

### Riesgos y gates

- Sin evidencia, mostrar `por revisar`, no “tienes un problema”.
- No llamar “salud financiera” a un score ni inferir elegibilidad crediticia.
- Recordatorios solamente opt-in, con frecuencia y baja controlables.
- Para datos reales: consentimiento, fuente, fecha de actualización y límite de cada cálculo visibles.

---

## Tarjetas

### Trabajo a resolver

La persona abre Tarjetas cuando va a pagar, busca un dato, ve un movimiento o quiere saber si tiene una mejor alternativa. Debe resolver una intención en segundos sin exponer datos sensibles.

### Concepto A — Pagar ahora

Hero con tres acciones de intención: **Ver datos**, **Mostrar QR** y **Agregar a wallet**. Cada acción muestra estado/guardrail: datos protegidos con reautenticación; QR/wallet solo si hay soporte real.

**Ventaja:** corresponde al momento urgente de pago.  
**Riesgo:** puede prometer NFC/QR/provisionamiento antes de issuer, partner y certificaciones.  
**Experimentar:** prototipo de selección de intención; medir qué busca realmente la persona y qué etiqueta entiende.

### Concepto B — Mi tarjeta, al día

Hero de estado: instrumento, último movimiento y una señal destacada. Acciones: `Revisar movimiento`, `Ver datos`, `Dividir compra`. Beneficios aparecen solo si conectan con una compra o categoría reciente.

**Ventaja:** une control, confianza y convivencia con Acompañante.  
**Riesgo:** si no existe instrumento real, se parece a una simulación de banco tradicional.  
**Experimentar:** comparar acceso de pago puro vs. último movimiento para la tarea “vine porque vi un cobro”.

### Concepto C — Compra mejor

Una búsqueda o intención (“voy a comer”, “quiero pagar streaming”) que devuelve beneficios, condiciones y alternativa de pago. El carrusel se activa por intención, no queda visible como publicidad fija.

**Ventaja:** posiciona ahorro/beneficios dentro de Tarjetas.  
**Riesgo:** sin catálogo confiable y disclosure, se vuelve promoción opaca.  
**Experimentar:** mostrar beneficio contextual con/sin condiciones; medir confianza y comprensión de elegibilidad.

### Recomendación

**Partir por B: “Mi tarjeta, al día”**, con un acceso fuerte de A “Pagar ahora” y beneficios de C solo contextuales. La primera versión no emite, no revela credenciales reales, no aprovisiona wallet ni procesa QR/NFC; valida las intenciones y la jerarquía de acciones.

### Medición y datos

| Elemento | Propuesta |
|---|---|
| Métrica norte | % que resuelve su intención sin buscar otra pantalla |
| Señales secundarias | intención seleccionada, movimiento revisado, beneficio con términos vistos, split iniciado |
| Anti-métricas | revelado repetido de datos, beneficio no elegible, sospecha de fraude no resuelta |
| Eventos | `cards_home_viewed`, `payment_intent_selected`, `card_details_reveal_requested`, `transaction_opened`, `benefit_matched`, `benefit_terms_opened`, `split_from_transaction_started` |
| Dominio | referencia de instrumento, referencia de transacción, match de beneficio, borrador de reparto |
| Metadata | `instrument_type`, `auth_level`, `transaction_category`, `benefit_id`, `eligibility_state`, `source_surface` |

**Nunca en analytics o logs cliente:** PAN, CVV, token de pago, OTP, QR completo, biometría o credenciales de wallet.

### Riesgos y gates

- `Ver datos` exige diseñar reautenticación, timeout, mascaramiento y auditoría antes de usar tarjetas reales.
- `Pagar` / QR / NFC requiere issuer/partner, plataforma y regulación validados; hoy debe decir “por validar”, no simular disponibilidad.
- Tarjeta compartida/corporativa requiere reglas de titularidad, límites, roles, trazabilidad y responsabilidad antes de pantalla funcional.
- Beneficio debe traer fuente, vigencia, condiciones, elegibilidad y disclosure de relación comercial.

---

## Arquitectura candidata y aprendizaje transversal

**Interfaz:** React Native.  
**Servicios candidatos:** API autenticada, motor de reglas de momentos/beneficios, almacenamiento de datos de dominio trazable, servicio de consentimientos, catálogo versionado, CRM/engagement con holdouts, observabilidad y soporte. Todo es candidato; no se asume habilitado.

**Separar siempre:**

1. datos de dominio que hacen funcionar el producto;
2. eventos minimizados de producto/analytics;
3. datos sensibles financieros/identidad con políticas específicas;
4. decisión/recomendación y evidencia versionada.

## Fuentes directas

- [Monzo: home unificada por actividad](https://monzo.com/blog/how-we-unified-our-customers-activity-on-the-new-home-screen)
- [Monzo: balance y próximos pagos en Trends](https://monzo.com/blog/balance-in-trends)
- [Monzo: diseño/alertas de Credit Insights](https://monzo.com/blog/how-we-built-a-product-to-demystify-credit-scores)
- [Monzo: medición de CRM con holdouts](https://monzo.com/blog/beyond-the-last-click-how-monzo-measures-crms-true-impact)
- [Nubank: tarjeta virtual](https://international.nubank.com.br/wp-content/uploads/2020/11/2.Data-Nubank-Digitalizacao-Financeira.pdf)
- [Apple: NFC & Secure Element](https://developer.apple.com/support/nfc-se-platform)
- [CMF: implementación SFA / NCG 514](https://www.cmfchile.cl/portal/prensa/625/w4-article-110881.html)
