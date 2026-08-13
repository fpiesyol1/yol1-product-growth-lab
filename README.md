# YOL1 Product Growth Lab

Prototipo exploratorio con datos ficticios para recorrer una experiencia cotidiana de YOL1. **No conecta bancos, no carga cartolas, no mueve dinero, no envía mensajes y no representa capacidades disponibles ni un roadmap comprometido.**

La propuesta que explora esta versión es: **“Con YOL1 entiendes tus finanzas y simplificas tu vida financiera.”** YOL1 detecta señales, explica evidencia y recomienda; la persona decide y confirma.

## Qué incluye

- **Inicio:** propuesta de valor ampliada, cinco pendientes de ejemplo —cargo dudoso, por cobrar, por pagar, beneficio y gasto posiblemente compartido— y una conversación financiera simulada con respuestas contextuales.
- **Mis Finanzas:** resultado mensual, carrusel de cuentas, acceso a cartola general, cuatro métricas accionables y últimos movimientos compactos.
- **Cartola:** cartola General, BCI o MACH; fecha, hora, código y monto; acciones consistentes OK, Revisar y Dividir/Cobrar. Revisar abre un asistente contextual y permite guardar una nota solo durante la sesión.
- **Cobrar y pagar:** separa por cobrar y por pagar en carriles independientes, por persona o grupo. Incluye aliases, recordatorios, estados “ya pagado” y vistas simuladas de mensaje/inicio de pago; el reparto conserva su borrador durante la sesión.
- **Ahorrar:** presenta potencial estimado y cuatro oportunidades: cargo dudoso, beneficio por tarjeta, cuenta/servicio y gasto posiblemente compartido. Se pueden abrir, ignorar o descartar con gesto lateral.
- **Ganar:** solo “Próximamente”.
- **Experimentos:** feedback local sobre ideas ya conversadas, sin fechas ni disponibilidad.

La app inicia en modo oscuro. El selector del header cambia a modo claro y guarda la elección en el navegador. Si no existe elección, usa la preferencia del sistema.

## Cómo probar

Requiere Node.js 22.13 o superior.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Recorridos sugeridos:

1. Inicio → Disney+ → Revisar → asistente contextual → dejar nota.
2. Inicio → OK en una tarjeta → confirmar que desaparece y aparece feedback visible.
3. Inicio → conversación demo → probar preguntas sobre mes, deudas, beneficios y ahorro.
4. Finanzas → Ingresos/Egresos → detalle filtrado; Por cobrar/Por pagar → módulo social.
5. Cobrar y pagar → abrir Josefa/Camila → simular cobro o pago → verificar el guardrail; alternar persona/grupo sin mover toda la pantalla.
6. Ahorrar → beneficio BCI, plan móvil o Liguria → revisar evidencia → simular o ignorar.
7. Cambiar entre oscuro y claro en Inicio, Finanzas, Cartola y Cobrar y pagar.

Para verificar build y guardrails:

```bash
npm test
```

## Organización

- `app/page.tsx`: navegación, estado de sesión, temas, datos ficticios e interacciones.
- `app/globals.css`: tokens semánticos, modos oscuro/claro, responsive y estados.
- `app/layout.tsx`: metadatos.
- `MVP-SPEC.md`: alcance, journeys, aceptación y límites.
- `PRODUCT-DESIGN.md`: sistema visual, tokens y roles de acento.
- `QA-CIERRE.md`: verificación manual y técnica.
- `tests/product-guardrails.test.mjs`: checks livianos de seguridad y contrato UI.

## Publicación

Felipe revisa antes de publicar. Este trabajo no hace commit, push ni despliegue. No agregar secretos, datos personales, proveedores, autenticación ni llaves de pago.

## Qué demuestra y qué no

La navegación permite probar comprensión y usabilidad. No demuestra demanda, product-market fit, economics ni readiness operacional o regulatoria. Los gates declarados son E2 comprensión, E3 acción voluntaria y E4 resultado/retorno.
