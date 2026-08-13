# Feedback intake — arquitectura segura

## Estado de esta versión

El formulario visible es una **demo local**. Asocia automáticamente cada entrada con la pantalla activa, guarda hasta 30 registros en `localStorage` bajo `yol1-lab-feedback-v1` y no transmite información. La interfaz pide no incluir datos financieros ni personales.

`lib/feedback-intake.ts` define el contrato `FeedbackIntakeAdapter`. La implementación actual, `localFeedbackIntake`, puede sustituirse más adelante sin entregar acceso a GitHub al cliente.

## Flujo recomendado para producción

```text
Formulario web
  → POST /api/feedback (server-side)
  → autenticación + validación + rate limit + redacción de PII
  → adapter de intake
      → bandeja interna/storage, o
      → GitHub Issue con labels controlados
  → revisión editorial humana
  → idea aprobada
  → branch + PR creados por automatización server-side separada
```

La recepción y la edición del prototipo son permisos distintos. Recibir feedback nunca debe otorgar permiso para crear ramas, modificar archivos ni aprobar PRs. La promoción a branch/PR ocurre solo después de aprobación editorial registrada.

## Contrato mínimo del endpoint futuro

- Aceptar únicamente `screen`, `kind`, `message`, `topics` y un `idempotencyKey` generado por el servidor.
- Validar pantalla contra los siete módulos existentes y tipo contra `like | improve | idea`.
- Limitar longitudes, tamaño total, frecuencia y origen permitido.
- Exigir sesión autorizada, invitación temporal o mecanismo equivalente; no aceptar escrituras anónimas sin protección.
- Rechazar secretos, datos bancarios, números de cuenta, documentos de identidad y otros datos sensibles detectables.
- Registrar fecha, estado `new`, versión del prototipo y trazabilidad de revisión; no registrar cookies, IP completa ni fingerprint salvo necesidad justificada.
- Responder con un ID de intake, nunca con credenciales, token de GitHub ni detalles internos del repositorio.

## Adapter real opcional en Vercel

Implementar un adapter server-only que cumpla `FeedbackIntakeAdapter` o una variante asíncrona equivalente. Configuración sugerida, siempre como secretos/variables del proyecto Vercel y nunca con valores reales dentro del repo:

```text
YOL1_FEEDBACK_INTAKE_MODE=storage|github
YOL1_FEEDBACK_GITHUB_REPOSITORY=owner/repository
YOL1_FEEDBACK_GITHUB_APP_ID=...
YOL1_FEEDBACK_GITHUB_INSTALLATION_ID=...
YOL1_FEEDBACK_GITHUB_PRIVATE_KEY=...
YOL1_FEEDBACK_ALLOWED_ORIGIN=https://...
```

Preferir una GitHub App con permisos mínimos para Issues sobre un token personal. Si se usa storage, conservar una cola con estados `new → triaged → approved | rejected → promoted`. El proceso de promoción necesita otro permiso y otra acción explícita.

## Estructura de una Issue futura

- Título: `[Feedback][Pantalla][Tipo] resumen corto`.
- Labels controlados: `feedback-intake`, módulo, tipo y estado editorial.
- Cuerpo: comentario, temas clave, versión del prototipo y fecha; sin información financiera personal.
- Sin asignación automática a implementación y sin comandos ejecutables derivados del texto enviado.

## Checklist antes de activar recepción real

1. Definir quién puede enviar feedback y quién puede revisarlo.
2. Elegir storage interno o Issues y configurar secretos server-side.
3. Añadir esquema de validación, autenticación, rate limiting, CSRF/origin e idempotencia.
4. Definir retención, borrado y aviso de privacidad.
5. Probar que el navegador nunca recibe secretos ni permisos de escritura.
6. Probar que una entrada maliciosa no puede crear branches, PRs ni ejecutar instrucciones.
7. Activar monitoreo y procedimiento de rollback antes de habilitar el endpoint.
