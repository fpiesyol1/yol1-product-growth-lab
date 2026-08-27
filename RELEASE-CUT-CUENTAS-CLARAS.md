# Corte selectivo — Cuentas Claras y continuidad YOL1

Estado: corte local validado y comprometido en `codex/cuentas-claras-lab-2026-08-27` (`aa983bd`); push y Preview protegidos pendientes. Fecha de corte: 2026-08-27.

## Qué entra en el corte

1. **Producto Cuentas Claras:** `app/cuentas-claras`, `app/pagar`, `app/api/debt-center`, `lib/debt-center`, `db/debt-center-schema.ts`, `drizzle.debt-center.config.ts` y `drizzle/debt-center`.
2. **Continuidad entre productos:** cambios necesarios en `app/page.tsx`, Onboarding contextual, Acompañante, chat/read model, portfolio, MCP y conocimiento para que no exista una segunda experiencia de cobrar/pagar.
3. **Experiencia YOL1 común:** shell de iPhone 17 Pro Max, responsive, foco/scroll de diálogos, estados oscuros y preview de WhatsApp explícitamente no enviado.
4. **Simulación local:** Floid y Belvo quedan como fixtures fail-closed, sin credenciales, OAuth, sandbox ni red externa.
5. **Conciliación local:** `mock_statement_v1` usa movimientos ficticios; una referencia exacta puede autoaplicar un settlement reversible y una ambigüedad nunca cambia saldo sin decisión humana.
6. **Neteo explicable:** cada grupo puede alternar entre saldos originales y una sugerencia matemática derivada; no modifica acuerdos, cobros ni pagos.
7. **Evidencia:** tests de deuda, sesiones, handoffs, navegación, conocimiento y guardrails; fichas de producto y documentos de alcance actualizados.

## Qué no se debe agregar por accidente

- `knowledge-bluebook/` completo: 26 MB de presentaciones, imágenes y artefactos generados de una iniciativa distinta. Requiere un commit y revisión propios.
- `.DS_Store`, `.next`, `dist`, `node_modules` y demás archivos ignorados.
- Secrets, `.env.local`, credenciales bancarias o llaves de Vercel/Neon.
- Cualquier adapter Floid/Belvo real o configuración que habilite red externa.

## Gates antes de publicar

- [ ] Felipe revisa el módulo en `http://localhost:3017/?product=clear_accounts`.
- [x] Confirmar la integración Neon existente y la disponibilidad de `DATABASE_URL` para Preview.
- [ ] Ejecutar `pnpm run db:migrate:preview` durante el build protegido; sólo funciona con `VERCEL_ENV=preview`, opt-in explícito y un endpoint Neon.
- [ ] Definir `NEXT_PUBLIC_SITE_URL` con el dominio exacto del preview cuando exista la URL.
- [x] Definir `DEBT_CENTER_SIMULATOR_ENABLED=true` exclusivamente para Preview.
- [x] Confirmar Vercel Standard Deployment Protection con login obligatorio para Preview. No abrirlo públicamente hasta contar con un límite durable de creación de sesiones y de búsquedas fallidas de tokens públicos.
- [ ] Verificar que ningún visitante anónimo pueda crear filas ilimitadas y que un token inexistente tenga protección de abuso antes de autorizar tráfico público.
- [ ] Repetir smoke en preview: grupo → gasto → cobro → copia → confirmación manual → abono parcial → reload → saldo restante.
- [ ] Repetir smoke de corrección: gasto sin abonos → anular → link anterior cerrado → borrador prellenado → único reemplazo en el mismo grupo.
- [ ] Confirmar que webhook Floid responde cerrado y que no existe ninguna llamada externa.
- [x] Crear la rama `codex/cuentas-claras-lab-2026-08-27` y stagear sólo los paths aprobados; nunca usar `git add .`.
- [x] Revisar el diff staged y crear el commit selectivo `aa983bd`.
- [ ] Publicar la rama remota y crear el Preview protegido; producción permanece sin cambios.

## Evidencia del corte local

- Build de producción: aprobado, 17 páginas.
- Suite: 193/193 pruebas aprobadas.
- Lint: 0 errores.
- `git diff --check`: aprobado.
- QA navegador: 440×956, 390×844 y breakpoint compacto verificados; foco seguro en la confirmación, modales anclados al viewport, posición restaurada y demo devuelta al caso inicial.
- DTO navegador: comandos, fingerprints, referencias de conciliación y metadata interna quedan fuera de dashboard y respuestas de mutación.
- Runtime financiero: `MockFloidPaymentProvider` fijo, cero dinero real y cero red Floid/Belvo.

## Comandos reproducibles de publicación

Antes de usar credenciales o tocar un deployment:

```bash
pnpm run release:check
pnpm run lint
pnpm run build
node --test tests/*.test.mjs
```

Dentro de un entorno de deployment que ya recibió sus variables, pero sin abrir conexiones:

```bash
pnpm run release:check:env
```

Después de provisionar Neon, aplicar las migraciones explícitamente:

```bash
pnpm run db:migrate
```

Finalmente, contra la URL exacta del preview protegido:

```bash
pnpm run release:smoke -- --base-url https://preview-ejemplo.vercel.app
```

Si Vercel Deployment Protection está habilitado, el smoke lee opcionalmente `VERCEL_AUTOMATION_BYPASS_SECRET` y lo envía sólo en el header recomendado por Vercel. No lo imprime ni lo guarda. Por seguridad, sólo lo enviará a un hostname `*.vercel.app`; para un dominio Vercel propio se debe declarar además `YOL1_SMOKE_BYPASS_HOST` con el hostname exacto. El smoke crea una sesión aislada, simula un abono de $5.000 sobre $10.000, comprueba reload/Neon, valida cross-origin, token inexistente y webhook Floid cerrado, y restaura su caso demo al terminar.

Estos comandos no pueden probar desde el repositorio que Deployment Protection esté realmente encendido, que las migraciones hayan sido aplicadas en la base indicada ni que exista protección durable contra creación masiva de sesiones y búsquedas fallidas. Esos tres puntos requieren verificación en Vercel/Neon antes de autorizar tráfico público.
