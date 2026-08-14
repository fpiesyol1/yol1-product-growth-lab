# Plan nocturno — YOL1 Product Growth Lab

**Ventana:** hoy, 00:00–07:30 aprox.  
**Modo:** iteración local. Nada se publica ni se integra sin aprobación de Felipe.

## Orden de trabajo

### 1. Cerrar feedback de lo que ya existe

- Recibir y ordenar los comentarios de las pantallas actuales, tanto local como la versión publicada.
- Separar cada comentario en: cambio visual, UX/flujo, copy, dato/arquitectura, o decisión abierta.
- Aplicar solamente los cambios que Felipe autorice con “corre”.
- Validar recorridos relevantes en escritorio y móvil antes de pasar al siguiente bloque.

### 2. Definir cada producto antes de diseñarlo

Felipe responde las cuatro preguntas de la sección siguiente por voz. Codex las baja a una hipótesis de MVP: pantalla(s), flujo, datos, riesgos, KYC/licencias y decisión pendiente.

### 3. QA independiente por producto

Cuando cada producto tenga un primer flujo local, el QA revisa:

- caminos felices y alternativos;
- botones sin salida, duplicados o contradictorios;
- claridad de lo que ocurre después de una acción;
- consistencia visual y responsive;
- riesgos de confianza, datos, KYC y licencias que necesiten validación.

El QA reporta hallazgos priorizados. No cambia código ni publica por su cuenta.

### 4. Cierre de cada ciclo

- Hallazgos, decisiones y preguntas quedan documentados.
- Felipe revisa localmente.
- Solo lo aprobado pasa a commit/push/publicación.

## Preguntas para responder por voz

> No necesitas responderlas todas de una. Basta con hablar libremente por producto; Codex las ordena aquí.

### Onboarding y KYC progresivo

1. ¿Qué puede ver y hacer una persona antes de registrarse?
2. ¿Qué momento justifica pedir teléfono o email con OTP?
3. ¿Qué desbloquean el preregistro, RUT/número de serie y biometría respectivamente?
4. ¿Cuál debe ser la experiencia si el KYC falla, queda pendiente o se pierde el acceso?

### Acompañante financiero

1. ¿Cuál es el primer momento de valor que debe recibir una persona?
2. ¿Con qué datos parte: nada, cartola, banco conectado o gasto manual?
3. ¿Qué puede hacer desde el primer día y qué solo puede entender/revisar?
4. ¿Qué recomendación no debe aparecer sin evidencia suficiente?

### Home Banking

1. ¿Qué problema resuelve Home Banking que no resuelve el Acompañante?
2. ¿Cuál es la primera función que justifica RUT, número de serie y biometría?
3. ¿Qué información o producto debe aparecer primero después de activar acceso?
4. ¿Qué queda explícitamente fuera de su primera versión?

### Tarjetas

1. ¿La primera versión trata de tarjeta propia, tarjetas existentes, beneficios o comparación?
2. ¿Qué tipo de persona priorizamos primero y qué problema tiene hoy?
3. ¿Qué valor entregamos antes de pedir datos sensibles o una solicitud?
4. ¿Qué depende de partner, licencia o decisión regulatoria antes de avanzar?

### Remesas

1. ¿Quién envía, a qué destinos y en qué situación partimos?
2. ¿Qué dolor atacamos primero: costo, rapidez, claridad o confianza?
3. ¿Qué debe poder entender la persona antes de cotizar o enviar?
4. ¿Qué partner, licencia o validación es imprescindible antes de construir un flujo real?

### Construir mi propio producto

1. ¿Qué información mínima tiene que entregar alguien a su IA antes de crear una propuesta?
2. ¿Qué contexto aprobado de YOL1 puede leer automáticamente y qué nunca debe ver?
3. ¿Qué debe incluir una propuesta para entrar a la bandeja de revisión?
4. ¿Qué puede editar la persona antes de enviarla: copy, flujo, pantallas, datos, riesgos o todo lo anterior?

## Reglas de esta noche

- La decisión verbal de Felipe manda sobre documentos o feedback externo si chocan.
- QA detecta y propone; no decide producto ni ejecuta cambios.
- Los datos reales, pagos, KYC y licencias se describen como hipótesis o “por validar” hasta tener evidencia aprobada.
- La versión local es el espacio para iterar; GitHub/Vercel solo se actualizan tras una revisión explícita.
