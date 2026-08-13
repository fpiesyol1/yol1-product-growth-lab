# YOL1 Product Growth Lab

Prototipo exploratorio para recorrer y discutir la experiencia cotidiana de YOL1 con datos sintéticos. **No conecta bancos, no mueve dinero y no representa capacidades disponibles ni un roadmap comprometido.**

La propuesta que explora esta versión es: **“Encuentra dónde pierdes plata o desaprovechas beneficios y decide qué hacer”**. YOL1 detecta señales, explica evidencia y recomienda; la persona confirma cada acción.

## Qué incluye esta primera versión

- **Inicio:** “Tu plata, bajo control”, dos formas de entrada —explorar con ejemplo o probar con información propia de forma simulada— y elección de tarea sin datos obligatorios.
- **Mis Finanzas:** fuentes demo con estado, consolidados con criterios visibles, por cobrar/pagar y hallazgos explicables.
- **Cartola:** fuentes navegables, movimientos con fecha, hora, código, monto y banco; acciones Revisar, Lo reconozco, Dividir y Crear solicitud de cobro.
- **Ahorrar:** journey prioritario cargo dudoso → beneficio desaprovechado → cuenta recurrente ineficiente. Cada oportunidad muestra evidencia, certeza, rango estimado, acción reversible y disclosure.
- **Cobrar/Repartir:** utilidad secundaria que prueba gasto, participantes, división igual o distinta, confirmación, link y WhatsApp simulados. No cobra ni inicia pagos.
- **Ganar:** solo “Próximamente”.
- **Experimentos por explorar:** feedback local sobre ideas ya conversadas, sin prometer fechas ni disponibilidad.

El detalle de arquitectura, journeys, criterios de aceptación, límites y gates de aprendizaje está en [`MVP-SPEC.md`](./MVP-SPEC.md). Las reglas visuales del laboratorio están en [`PRODUCT-DESIGN.md`](./PRODUCT-DESIGN.md).

## Cómo probar

Requiere Node.js 22.13 o superior.

```bash
npm install
npm run dev
```

Abre la dirección local que aparece en la terminal. Recorridos recomendados:

1. Inicio → Explorar ejemplo → Disney+ aparece dos veces → Ver movimientos → Revisar o Lo reconozco.
2. Inicio → Encontrar oportunidades → beneficio → evidencia, certeza, rango y acción.
3. Inicio → Ordenar pendientes → Registrar gasto → participantes → división → confirmar → link simulado.
4. Inicio → Simular con mi información → leer consentimiento simulado → continuar con datos ficticios.

Para verificar que la versión compila y conserva los guardrails:

```bash
npm test
```

## Cómo se organiza el Lab

- `app/page.tsx`: prototipo navegable y datos sintéticos.
- `app/globals.css`: estética básica del Lab, responsive y estados interactivos.
- `app/layout.tsx`: metadatos del sitio.
- `public/og.png`: tarjeta social del prototipo.
- `public/yol1-icon.png`, `public/yol1-wordmark-dark.png` y `public/yol1-life.jpg`: activos oficiales tomados del brandbook local para esta demo.
- `MVP-SPEC.md`: arquitectura de información, alcance, journeys y aprendizaje.
- `PRODUCT-DESIGN.md`: criterio visual y de experiencia vigente.
- `tests/`: comprobaciones mínimas de contenido y seguridad de la demo.

La estética toma del brandbook YOL1 el contraste Night/cream, acid concentrado, aqua interactivo y ritmo editorial. El producto es móvil-first; en desktop se presenta dentro de un teléfono protagonista. Esta traducción no reemplaza un design system oficial.

## Publicación

Antes de publicar, Felipe revisa los cambios locales. Este trabajo no hace commit ni push.

Después de aprobar:

1. Ejecutar `npm test`.
2. Revisar el diff y crear un commit descriptivo.
3. Hacer push al repositorio conectado.
4. Vercel generará la publicación según la configuración ya vinculada al repositorio.
5. Recorrer los journeys prioritarios en la URL publicada y verificar que los rótulos de prototipo sigan visibles.

Para que la tarjeta social use la URL pública correcta, configurar `NEXT_PUBLIC_SITE_URL` en Vercel con el dominio final (por ejemplo, `https://tu-dominio.vercel.app`).

No agregar secretos, credenciales, datos personales, proveedores bancarios ni llaves de pago a este repositorio.

## Qué demuestra y qué no

La versión navegable permite probar comprensión y usabilidad inicial. No demuestra demanda, product-market fit, economics, readiness operacional o regulatoria. Los siguientes gates de aprendizaje son E2 comprensión, E3 acción voluntaria y E4 resultado/retorno.
