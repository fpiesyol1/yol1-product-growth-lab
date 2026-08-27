# Postgres para la bandeja YOL1 — guía práctica

## La idea en simple

Postgres es una base de datos relacional. Para este Lab puedes imaginarla como una planilla compartida que vive en internet:

- cada envío es una **fila**;
- `source`, `screen`, `question`, `answer` y `status` son **columnas**;
- todas las personas que reciben el link escriben en la misma tabla;
- solo el servidor conoce la dirección y credenciales de la base.

La tabla se llama `yol1_feedback_items`. El navegador nunca se conecta directamente a Postgres: habla con `/api/feedback`, esa ruta valida el contenido y luego escribe la fila.

## Cómo conectarlo desde Vercel

1. Entra a Vercel y abre el proyecto `yol1-product-growth-lab`.
2. Abre **Storage** y elige **Create Database**.
3. Selecciona **Neon Postgres** desde Marketplace.
4. Elige un plan y una región cercana a las Functions del proyecto. Revisa precio y límites antes de confirmar.
5. Conecta el recurso a Production y Preview. Vercel agregará `DATABASE_URL` automáticamente.
6. Antes del deploy, ejecuta `pnpm run db:migrate` contra esa misma `DATABASE_URL`. Cuentas Claras falla cerrado si falta la tabla `yol1_debt_center_states`; una visita nunca crea ni modifica el esquema.
7. En **Settings → Environment Variables**, crea `YOL1_REVIEW_TOKEN` como secreto. Usa una clave larga generada por un gestor de contraseñas; no reutilices una contraseña personal.
8. Define `DEBT_CENTER_SIMULATOR_ENABLED=true` y `NEXT_PUBLIC_SITE_URL` con el dominio HTTPS exacto del preview.
9. Opcional: agrega `YOL1_FEEDBACK_ALLOWED_ORIGIN` con el dominio público si el formulario vive en otro origen.
10. Mantén el primer preview bajo **Vercel Deployment Protection**. No lo abras a tráfico anónimo hasta contar con límites durables para creación de sesiones y búsquedas fallidas de links.
11. Haz redeploy. La bandeja de feedback conserva su inicialización actual; el estado de Cuentas Claras depende exclusivamente de las migraciones Drizzle versionadas en `drizzle/debt-center`.

No copies `DATABASE_URL` ni `YOL1_REVIEW_TOKEN` al código, GitHub, un chat o una captura.

Antes de publicar, ejecuta también:

```bash
pnpm run release:check
pnpm run release:check:env
```

El primer comando prueba contratos locales. El segundo exige que `DATABASE_URL`, `DEBT_CENTER_SIMULATOR_ENABLED=true` y una `NEXT_PUBLIC_SITE_URL` HTTPS estén presentes; no imprime sus valores.

## Cómo comprobar que funciona

1. Abre el link público en una ventana distinta y deja un feedback.
2. Conversa con YOL1; cada pregunta + respuesta se guarda como `Respuesta de IA`.
3. Abre `/review`, ingresa `YOL1_REVIEW_TOKEN` y filtra entre Feedback y Respuestas IA.
4. Usa:
   - **Aprobar:** la señal es correcta o útil para considerar.
   - **Equivocado:** abre un comentario obligatorio para explicar el error.
   - **Descartar:** no aporta al aprendizaje.

Estas decisiones no entrenan automáticamente el modelo. Son una cola editorial para cambiar conocimiento, instrucciones o evaluaciones mediante un PR revisado.

## Cómo mirar la tabla en Neon

En el dashboard de Neon abre **Tables** o **SQL Editor**. Una consulta de lectura útil es:

```sql
SELECT source, status, screen, question, created_at
FROM yol1_feedback_items
ORDER BY created_at DESC
LIMIT 50;
```

Para entender la distribución:

```sql
SELECT source, status, count(*)
FROM yol1_feedback_items
GROUP BY source, status
ORDER BY source, status;
```

Evita editar o borrar filas directamente mientras estás aprendiendo. Usa `/review` para mantener trazabilidad.

## Qué protege esta versión

- Rechaza orígenes no permitidos y campos inválidos.
- Limita largos y cantidad de envíos por sesión/hora.
- Rechaza patrones evidentes de tarjetas, RUT, teléfono, email y credenciales.
- Guarda un hash de la sesión, no el identificador original ni la IP.
- Exige una clave server-side para listar o clasificar.
- Usa idempotencia para que una misma respuesta de IA no cree duplicados al calificarla.

Antes de escalar a usuarios reales, agrega autenticación individual, rate limiting administrado, política de retención/borrado y monitoreo.
