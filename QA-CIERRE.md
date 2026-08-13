# Cierre verificable — YOL1 Product Growth Lab

Fecha: 12 de agosto de 2026  
Estado: **prototipo exploratorio con datos sintéticos; no canon**

No conecta bancos, no mueve dinero y no representa capacidades disponibles, roadmap, wedge, producto validado ni readiness.

## QA visual responsive

Se recorrieron Inicio, Mis Finanzas, Cartola, Cobrar/Repartir, Ahorrar, Ganar y Experimentos en:

- Desktop: `1440 × 1000`.
- Móvil: `390 × 844`.

La revisión exacta en ambos viewports fue contrastada por Estrategia YOL1 y quedó **apta** después de dos correcciones menores: disclosure persistente “DATOS FICTICIOS” y retiro de una capability interna desde Experimentos. Se hizo además un barrido local adicional de los siete módulos con captura visual y comprobación de overflow.

También se recorrieron los estados interactivos críticos:

- Entrada “Probar con mi información” y consentimiento simulado.
- Cartola con movimiento abierto y acciones Revisar, Lo reconozco, Dividir y Crear solicitud de cobro.
- Cobrar/Repartir completo: gasto → participantes → montos distintos → confirmación → link demo → WhatsApp demo.
- Ahorrar con evidencia, fuente, certeza, estimación, acción reversible y disclosure.

Resultado:

- Sin overflow horizontal en desktop ni móvil.
- En desktop, el producto aparece como teléfono protagonista sobre una composición editorial Night; en móvil ocupa la superficie completa.
- Mis Finanzas y Experimentos usan scroll interno cuando el contenido excede la vista; el resto de las vistas base cabe sin overflow interno en ambos tamaños.
- Navegación inferior permanece visible y los CTAs mantienen contraste y jerarquía.
- Inicio, Finanzas y Ahorrar preservan evidencia, rango, autoridad recommend-only y acción reversible.

## Auditoría de CTAs

Se corrigieron los textos que podían parecer operativos:

- “Recuperar plata” → “Ordenar lo pendiente”.
- “Banco” → “Simular banco”.
- “Cartola” como acción de carga → “Simular cartola”.
- “COBRA” → “REPARTE”.
- “Revisar cobro” → “Revisar solicitud”.

Los estados de salida dicen expresamente “link demo”, “WhatsApp · Demo” y que no se abre, envía, cobra, conecta ni mueve dinero. “Cobrar” se conserva únicamente como nombre del módulo acordado; dentro del flujo se prepara una solicitud simulada y cada avance requiere confirmación.

El header de todos los módulos mantiene el disclosure corto **“DATOS FICTICIOS”**. En Experimentos se retiró “Propuestas sin GitHub” del teléfono por ser una capability interna del Lab; permanece documentada fuera de la experiencia B2C. “Comparar consumo anónimo” pasó a **“Comparar con referencias agregadas”**, condicionado a muestra suficiente y población comparable visible.

## Verificación técnica

Build ejecutado:

```bash
/Users/felipepies/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/next/dist/bin/next build --webpack
```

Resultado: compilación y TypeScript exitosos; `/` y `/_not-found` prerenderizados como contenido estático.

Pruebas ejecutadas:

```bash
/Users/felipepies/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/product-guardrails.test.mjs
```

Resultado: **3 tests, 3 aprobados, 0 fallidos**.

## Inventario exacto del cierre

Modificados:

- `PRODUCT-DESIGN.md`
- `README.md`
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `package-lock.json`
- `package.json`
- `pnpm-lock.yaml`

Agregados:

- `MVP-SPEC.md`
- `QA-CIERRE.md`
- `public/og.png`
- `public/yol1-icon.png`
- `public/yol1-life.jpg`
- `public/yol1-wordmark-dark.png`
- `tests/product-guardrails.test.mjs`

Retirados por pertenecer al starter reemplazado:

- `app/_sites-preview/SkeletonPreview.tsx`
- `app/_sites-preview/preview.css`
- `tests/rendered-html.test.mjs`

No se hizo commit, push ni publicación.

## Decisiones abiertas

1. Validar o descartar el hero actual; sigue siendo una preferencia reversible, no una propuesta validada.
2. Definir protocolo, muestra y umbrales para E2 comprensión, E3 acción voluntaria y E4 resultado/retorno.
3. Elegir qué hipótesis probar primero dentro del orden cargo dudoso → beneficio → recurrencia, sin convertirla todavía en wedge.
4. Definir qué fuente y consentimiento reales serían aceptables solo si una prueba futura justifica salir de la simulación.
5. Evaluar tipografía Söhne web cuando exista una licencia/entrega oficial; hoy se usa fallback sensato.

## Revisión local

Con el servidor de desarrollo activo, abrir `http://localhost:3000`. No se publicó ninguna URL nueva.
