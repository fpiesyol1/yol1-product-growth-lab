# YOL1 Product Growth Lab — MVP vigente

**Versión:** 26-ago-2026
**Estado:** prototipo exploratorio con datos sintéticos. No conecta bancos ni proveedores, no mueve dinero y no representa capacidades disponibles o roadmap.

## 1. Sistema de producto

YOL1 prueba un ciclo único con tres responsabilidades complementarias:

1. **Onboarding y KYC progresivo:** entrega valor, crea acceso mínimo para guardar o retomar una tarea y vuelve al punto exacto. OTP confirma un canal; no equivale a identidad, KYC o capability financiera.
2. **Acompañante financiero:** interpreta movimientos, flujo mensual y deuda institucional sintética. Detecta, explica y propone un siguiente paso; no modifica el ledger social.
3. **Cuentas Claras:** es la fuente de verdad de grupos, gastos, repartos, deudas entre personas, intentos y abonos simulados.

Home Banking y Tarjetas permanecen en investigación; Remesas está pausado; Construir mi propio producto es un piloto reversible del Lab.

## 2. Principios

- **Valor antes que datos.** La persona entiende la tarea antes de crear acceso.
- **Evidencia antes que conclusión.** Cada inferencia declara fuente, frescura, certeza y límite.
- **Un dueño por dato y acción.** Acompañante interpreta; Cuentas Claras administra el ledger; Onboarding administra acceso y retorno.
- **Control humano.** Crear, marcar, ignorar y corregir son acciones explícitas y reversibles.
- **Simulación local.** Floid y Belvo son fixtures sin credenciales, OAuth, webhooks o red.
- **Privacidad por defecto.** Nada de OTP, RUT, contacto, token o payload financiero crudo entra a analytics.

## 3. Navegación vigente

El selector superior muestra siete espacios: Onboarding, Acompañante, Cuentas Claras, Home Banking, Tarjetas, Remesas y Construir mi propio producto.

El Acompañante navega por **Inicio, Finanzas, Cartola, Ahorrar, Tu plan de deuda y Mi banco**. No existe una pestaña operativa Cobrar/pagar ni una pestaña Ganar.

Cuentas Claras tiene navegación propia: **Inicio, Grupos y Actividad**. La ruta pública del pagador no muestra el shell ni la navegación interna del Lab.

## 4. Onboarding contextual

### Trabajo

Permitir explorar primero y crear acceso sólo cuando la persona quiere guardar o retomar un trabajo concreto.

### Journey

- Entrada directa: historias de valor → canal → OTP demo → nombre visible → Acompañante.
- Desde Cuentas Claras: explicación contextual → canal → OTP demo → nombre visible → mismo borrador.
- Pagador invitado: nunca pasa por Onboarding.

`OnboardingEntryV1` conserva `entry_context`, `requested_job`, `return_to` y `draft_id` opaco. El borrador vive en sessionStorage y no viaja en la URL.

### Gate

El flujo activo permite nombre visible **sin pedir RUT, número de serie, biometría ni documentos en esta demo**. RUT y KYC sólo pueden aparecer frente a una capability futura aprobada que explique finalidad, dato, consecuencia y alternativa.

## 5. Acompañante financiero

### Inicio

Una bandeja priorizada muestra una situación dominante y siguientes acciones. Las cuentas compartidas aparecen una sola vez como resumen agregado de Cuentas Claras.

### Finanzas y Cartola

Resultado del mes es flujo, no saldo. Movimientos muestran fuente y evidencia. Las acciones dependen de su tipo, no del signo del monto. Una señal social abre un handoff reversible a Cuentas Claras.

### Tu plan de deuda

Thin slice sintético “pagué pero todavía aparece”: cartola demo del 22 de agosto versus informe demo del 19. La coincidencia es `candidate`; no confirma pago, error o mora. La persona puede marcar el primer paso y deshacerlo. No hay score, CMF real, oferta o refinanciamiento.

### Frontera

La deuda institucional y la deuda entre personas son dominios separados. Ningún total los mezcla. El Acompañante puede leer `DebtCenterSummaryV1`, pero nunca crear, cobrar, pagar o cerrar una cuenta social.

## 6. Cuentas Claras

### Journey del administrador

Grupo → participantes → gasto → pagador → reparto igual/exacto → revisión → deuda → borrador WhatsApp. Crear un grupo abre su detalle y agregar gasto conserva el grupo y sus integrantes.

### Journey del pagador

Link → acreedor/concepto/grupo/deudor asociado → pagar todo u otro monto → banco demo → autorización simulada → resultado y remanente. No requiere cuenta YOL1 o KYC.

### Reglas críticas

- gasto y abono son CLP enteros, seguros y positivos;
- pagador pertenece al reparto y las partes suman el total;
- $10.001 / 2 produce $5.001 + $5.000;
- $10.000 → abono simulado $5.000 → saldo $5.000;
- `failed`, `cancelled` y `expired` no cambian el saldo;
- reintento o doble toque no duplica gasto, intento o settlement;
- recargar conserva el monto reservado;
- WhatsApp siempre es borrador no enviado;
- un pagador exitoso cierra su tarea y no entra al dashboard privado.

### Persistencia

Repository adapter con memoria local o Neon/Postgres/Drizzle. Cada visitante usa una sesión demo opaca; un link público resuelve el workspace por token opaco. Esto es aislamiento de demo, no autenticación productiva.

### Proveedor

`getPaymentProvider()` devuelve siempre `MockFloidPaymentProvider`. La simulación no lee credenciales ni hace red; el webhook responde `410`.

## 7. Aprendizaje y métricas

El funnel de aprendizaje conserva cuatro niveles:

- **E1 — Exposición:** la persona ve el problema y la promesa.
- **E2 — Comprensión:** puede explicar qué vio, qué significa y cuál es el límite.
- **E3 — Acción voluntaria:** elige registrar, revisar, abrir un handoff o completar una simulación.
- **E4 — Resultado / retorno:** ambos lados ven el mismo saldo y existe un motivo real para volver.

North Star candidata de Cuentas Claras: grupos con al menos una deuda creada y un cierre confirmado dentro de 30 días.

El Lab **No demuestra demanda, product-market fit, economics ni readiness**. Los modelos Directo y Embebido quedan fuera hasta que exista evidencia de repetición, confianza y operación.

## 8. Gates antes de publicar

- build, TypeScript, lint y suite completa en verde;
- sesión demo aislada y mutaciones same-origin con límites;
- cero credenciales o red en Floid/Belvo;
- happy path, parcial, rechazo, cancelar, recargar, reintentar y volver probados;
- foco, Escape, targets ≥44 px y un scroll a 440×956, 390×844 y 320×568;
- fichas, README, MCP y conocimiento describen la misma frontera;
- revisión visual de Felipe antes de commit, push o deploy.
