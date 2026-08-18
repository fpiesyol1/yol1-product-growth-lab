# Yol1 Design System — cruce inicial

> Estado: propuesta de trabajo, no sistema oficial aprobado.  
> Fecha: 2026-08-18.

## Conclusión

El design system final no debería ser una restauración del producto antiguo ni una formalización literal del prototipo actual. La mejor base es una combinación deliberada:

- **Identidad y principios:** tomar lo que ya construimos en Yol1 Product Lab.
- **Lógica de producto:** recuperar del legado sus flujos, estados y formas de agrupar información.
- **Sistema de componentes:** reconstruirlo como una capa reutilizable; el código heredado está incompleto y no debe copiarse tal cual.
- **Gobernanza:** distinguir siempre entre vigente, candidato, legado y descartado.

## Jerarquía de fuentes

Cuando dos fuentes entren en conflicto, usar este orden:

1. Decisiones que Felipe apruebe explícitamente.
2. Identidad y principios vigentes de Yol1 Product Lab.
3. Material oficial futuro de marca o producto.
4. Patrones funcionales útiles del producto legado.
5. Recursos genéricos o de terceros, sólo como inspiración y nunca como identidad.

## Qué conservar, adaptar y dejar atrás

| Área | Recomendación | Motivo |
|---|---|---|
| Paleta actual | Conservar | Tiene roles claros y una identidad propia reconocible. |
| Logo y símbolo actuales | Conservar como fuente de trabajo | Son más consistentes con la paleta y el lenguaje actual. El logo turquesa antiguo queda como referencia histórica. |
| Claro y oscuro | Conservar ambos | Ya están pensados por función y no como una simple inversión de colores. |
| Arquitectura temática del legado | Adaptar | `background`, `card`, `text`, `border` y estados son una buena lógica, pero requieren roles más precisos. |
| Formularios controlados | Recuperar el patrón | Foco, error, deshabilitado y contraseña visible son conductas útiles. Hay que rehacer accesibilidad y estilos. |
| Tarjetas de cuenta y operación | Recuperar la estructura | Separan nombre, monto, moneda, comisión, tipo de cuenta y acciones de copiar con claridad. |
| Selectores, pasos y bottom sheets | Recuperar el comportamiento | Son patrones transferibles a onboarding, pagos, KYC y configuración. |
| Estados de carga, vacío, error y éxito | Conservar y ampliar | El sistema final debe cubrir el flujo completo, no sólo la pantalla ideal. |
| Glassmorphism | Usar sólo como acento | Aplicado a todo reduce legibilidad y vuelve genérico el producto; puede servir en una tarjeta protagonista. |
| Ilustraciones genéricas del legado | Descartar | No construyen la identidad Yol1 y algunas ya estaban marcadas para reemplazo. |
| Supuestos de producto del legado | No importar sin revisión | KYC obligatorio temprano, cuentas multi-país, monedas y operaciones reales no coinciden necesariamente con el alcance actual. |
| Código heredado | No copiar directamente | La entrega no contiene la base completa de UI y tiene dependencias, imports y recursos ausentes. |

## Núcleo de color propuesto

### Colores de identidad

- **Night / petróleo:** contexto, navegación, profundidad y contraste.
- **Cream / Mist:** superficies claras, lectura y tono editorial.
- **Acid:** resultado, progreso y acción principal Yol1.

### Colores funcionales

- **Aqua:** interacción, selección e hipótesis de producto.
- **Yellow:** atención y decisión abierta.
- **Coral:** riesgo, error o revisión necesaria.

### Colores contextuales

- **Pink:** dimensión humana, social o relacional; no usar como error.
- **Violet:** aprendizaje, experimentos y feedback; no usar como señal de disponibilidad.

Regla propuesta: una pantalla o módulo puede tener **un acento emocional dominante**. Los estados funcionales conservan su color semántico aunque el módulo use otro acento.

## Arquitectura propuesta

### 1. Principios

- Simple con sustancia: menos elementos, pero con información real.
- Una idea dominante por pantalla.
- El flujo completo importa más que una pantalla aislada.
- La interfaz nunca promete una función, dato o seguridad que aún no existe.
- Profundidad progresiva: lo esencial primero; el detalle aparece cuando se necesita.

### 2. Fundamentos

- Paleta por roles, con modo claro y oscuro.
- Tipografía y una escala corta de tamaños.
- Espaciado, radios, bordes, sombras y movimiento.
- Iconografía, logo, fotografía e ilustración.
- Reglas de contraste, foco, lectura y reducción de movimiento.

### 3. Elementos básicos

- Texto, botón, enlace, icono, input, selector, chip, badge, divisor, avatar y superficie.

### 4. Componentes

- Tarjetas, filas de movimiento, resumen de saldo, entrada de monto, selector de cuenta o moneda, stepper, navegación, modal, bottom sheet, toast y tabla/lista de datos.

### 5. Patrones

- Carga, vacío, error, bloqueo, éxito y confirmación.
- Permisos, consentimiento, advertencias y acciones reversibles.
- Filtros, búsqueda, selección, copia de datos y revelación progresiva.

### 6. Flujos

- Onboarding y KYC progresivo.
- Inicio, cuentas, movimientos y detalle.
- Cobrar, pagar, transferir, depositar y retirar.
- Experimentos, feedback y revisión.

### 7. Gobierno

Cada recurso tendrá dos etiquetas independientes:

- **Madurez:** vigente, candidato, legado o descartado.
- **Disponibilidad:** diseñado, prototipado, implementado o medido.

## Riesgos detectados en la base actual

- La identidad y los principios están bien definidos, pero viven dentro de archivos demasiado grandes.
- Existen muchos valores visuales literales y demasiados tamaños de texto; falta una escala controlada.
- Varias piezas parecen componentes visuales, pero aún no forman una biblioteca reutilizable.
- El legado documenta una base de UI más completa de la que realmente llegó en los archivos compartidos.
- Sin estados de madurez, un recurso antiguo puede confundirse con una decisión vigente.

## Primera decisión pendiente

Definir la personalidad base del producto:

- **Recomendación:** oscuro petróleo como expresión principal, con experiencia clara completa; Acid como sello Yol1, Aqua para interacción y Pink/Violet sólo por contexto.
- Confirmar si el vidrio/transparencia queda reservado a una tarjeta protagonista o se elimina del sistema base.

Después de esta decisión se puede cerrar tipografía, radios, superficies y la primera familia de componentes.
