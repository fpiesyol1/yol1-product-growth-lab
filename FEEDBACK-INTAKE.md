# Feedback intake — arquitectura segura

## Estado de esta versión

El formulario asocia cada entrada con la pantalla activa y llama `POST /api/feedback`. Cuando `DATABASE_URL` está conectado, el servidor valida y guarda en Neon Postgres; si no está disponible, el navegador conserva un fallback local bajo `yol1-lab-feedback-v1` y lo declara en la confirmación. La interfaz pide no incluir datos financieros ni personales.

Cada pregunta/respuesta de IA también genera una entrada `chat`; una calificación posterior usa el mismo ID y actualiza la fila en vez de duplicarla. `/review` exige `YOL1_REVIEW_TOKEN` para listar o cambiar estados. No entrega acceso a GitHub al cliente.

## Flujo recomendado para producción

```text
Formulario web
  → POST /api/feedback (server-side)
  → validación + origen + límite de sesión + filtro básico de PII
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

## Adapter real en Vercel

La implementación usa Neon Postgres vía adapter server-only. Configuración requerida como secretos/variables del proyecto Vercel y nunca con valores reales dentro del repo:

```text
DATABASE_URL=postgresql://...
YOL1_REVIEW_TOKEN=...
YOL1_FEEDBACK_ALLOWED_ORIGIN=https://...
```

La bandeja separa el feedback de personas de los hallazgos de IA. Para feedback usa un Kanban editorial: `new → reviewing | later | resolved | ignored`; los hallazgos de IA añaden `wrong` cuando la respuesta requiere corrección. Una promoción posterior a branch/PR necesita otro permiso y otra acción explícita.

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
