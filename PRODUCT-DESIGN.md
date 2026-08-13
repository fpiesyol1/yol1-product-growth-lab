# YOL1 Product Growth Lab — criterio de diseño

## Propósito

Probar la experiencia del asistente financiero cotidiano de YOL1 con datos sintéticos antes de conectar bancos, cartolas reales o pagos.

## Fuente de marca vigente para este laboratorio

La referencia visual es `Brand Yol1.pptx`. Esta implementación usa activos oficiales extraídos del archivo y traduce sus principios a una experiencia B2C móvil. Sigue siendo un prototipo exploratorio: no pretende reemplazar un design system oficial.

- Night / petrol `#112E3C`: contexto, foco y contraste profundo.
- Acid `#80EF0C`: resultado y acción principal, usado con concentración.
- Cream / mist `#FAEDDC`: superficie principal y respiro editorial.
- Aqua: interacción e hipótesis.
- Amarillo: advertencias o decisiones abiertas.
- Coral: riesgo o algo que requiere revisión, nunca fraude afirmado.
- Söhne cuando esté disponible, con fallback de sistema; mono para montos, fechas y códigos.

## Dirección de interfaz

- El producto es móvil primero. En escritorio, el teléfono es protagonista dentro de un escenario editorial, no una miniatura decorativa.
- Una idea dominante por pantalla, con acciones primarias evidentes y rutas secundarias de menor intensidad.
- Jerarquía por escala, ritmo, bloques de color y aire; evitar grillas de tarjetas homogéneas y estética de banca fría.
- Gestos gráficos abstractos —halo, subrayado, señal— pueden dar energía, pero nunca sustituyen la marca oficial.
- Alto contraste, foco visible, áreas táctiles amplias, lectura sin overflow y movimiento opcional.

## Reglas de experiencia

1. Una pantalla debe tener una tarea principal y una acción clara.
2. Cada alerta debe mostrar qué la activó, de dónde vienen los datos y qué puede hacer la persona.
3. Las transferencias entre cuentas propias no inflan ingresos ni egresos.
4. "Por cobrar" y "por pagar" son compromisos visibles; una persona puede confirmar, rechazar o corregir un cobro.
5. La cartola conserva evidencia: fecha, hora, código, fuente, monto y una acción contextual.
6. Los datos del laboratorio son ficticios. No se integra ninguna cuenta ni pago desde este repositorio.

## Pantallas actuales

- Inicio: bienvenida viva con “Explorar ejemplo” y “Simular con mi información”.
- Mis Finanzas: resultado del período, fuentes, reglas revisables y hallazgos explicables.
- Cartola: movimientos y acciones de revisar, reconocer, dividir o crear una solicitud simulada.
- Cobrar/Repartir: utilidad social secundaria y explícitamente simulada.
- Ahorrar: oportunidad protagonista con evidencia, certeza, rango y acción reversible.
- Ganar: tratamiento editorial “Próximamente”, sin flujo.
- Experimentos por explorar: feedback sin fechas, disponibilidad ni promesas de roadmap.

## Cómo mejorar una pantalla

Anotar el caso de uso, qué debería entender la persona en menos de cinco segundos, qué acción debe poder tomar y qué información sobra. Esa nota se transforma en una decisión versionada en este archivo o en una página de Notion cuando se conecte el repositorio oficial.
