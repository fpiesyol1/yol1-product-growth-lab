# Simulador local de Floid · YOL1 Lab

## Estado de este entregable

El Lab **no está conectado a Floid**. Tampoco solicita credenciales, crea sesiones OAuth, llama endpoints externos, recibe webhooks ni mueve dinero.

La única implementación ejecutable es `MockFloidPaymentProvider`: un fixture determinista y local que reproduce estados útiles para diseñar y probar Cuentas Claras.

## Cómo explorar la simulación

1. Abrir `/floid-lab` para revisar la evidencia bancaria ficticia.
2. Abrir Cuentas Claras y preparar un cobro demo.
3. Entrar al link público como pagador.
4. Elegir un banco ficticio y simular éxito, rechazo, cancelación o expiración.
5. Comprobar que sólo un éxito simulado cambia el saldo y que un abono parcial conserva el remanente.

No se debe pegar ningún `client_id`, `client_secret`, clave bancaria, ClaveÚnica, RUT ni dato personal.

## Qué permite validar

- El contrato de iniciación de pago sin custodia.
- Los estados `not_started`, `pending`, `succeeded`, `failed`, `cancelled` y `expired`.
- El flujo $10.000 → abono simulado $5.000 → saldo $5.000.
- Reintentos idempotentes sin duplicar un abono.
- Mensajes humanos para cancelación, rechazo y resultado incierto.
- La actualización del mismo ledger que consume el Acompañante financiero.

## Qué no demuestra

- Disponibilidad comercial de Floid para YOL1.
- Cobertura bancaria, tiempos, precios o SLA.
- Validación de cuentas receptoras dinámicas.
- Movimiento, custodia o conciliación de dinero real.
- Acceso a cartolas, informe CMF, REDEC o deuda formal.
- Cumplimiento legal, seguridad u operación de una integración productiva.

## Invariantes técnicas

- `getPaymentProvider()` siempre devuelve `MockFloidPaymentProvider`.
- El simulador no lee variables `FLOID_*`.
- El código ejecutable del módulo no hace `fetch` a Floid.
- La ruta de webhook responde `410` y no procesa eventos.
- Los comprobantes y estados materiales se rotulan como simulación.
- Cualquier adaptador real permanece fuera del runtime y se considera trabajo futuro **(Prop.)**.

## Investigación futura, no ejecutada en este Lab (Prop.)

La documentación pública de Floid describe APIs de productos, transacciones, iniciación de pagos y estructuras relacionadas con deuda. Antes de diseñar una integración real habría que confirmar con Floid, Legal, Seguridad y Operaciones:

- tenant, producto y cobertura contractual exacta;
- uso de Widget alojado para que YOL1 no capture credenciales;
- destinatarios dinámicos y verificación de titularidad de la cuenta receptora;
- idempotencia, firma o protección de webhooks, consulta autoritativa y cancelación;
- sandbox contractual, fixtures, límites, errores, precios y SLA;
- rol legal y canal de acceso para CMF/REDEC;
- consentimiento, retención, eliminación y tratamiento de PII.

Estas preguntas sirven para investigación futura. No habilitan llamadas externas ni cambian el alcance de simulación local de esta versión.

## Referencias de investigación

- https://readme.floid.io/docs/guia-para-integracion-de-pagos-cuenta-a-cuenta-con-floid
- https://readme.floid.io/docs/sandbox
- https://readme.floid.io/docs/floid_oauth_20
- https://readme.floid.io/reference/santander-personas-products
- https://readme.floid.io/reference/santander-personas-transactions
- https://readme.floid.io/docs/estructura-de-datos

Las referencias anteriores describen capacidades del proveedor; **no son evidencia de una integración activa en YOL1**.
