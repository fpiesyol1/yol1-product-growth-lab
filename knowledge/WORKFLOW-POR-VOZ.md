# Cómo alimentar YOL1 por voz

## El ciclo corto

1. **Felipe dicta** una pregunta realista, su respuesta ideal, el tono, qué sería una mala respuesta y cualquier criterio importante.
2. **Codex estructura** el dictado como ficha Markdown en estado `borrador`. Separa hechos, interpretación, siguiente acción y límites.
3. **Felipe revisa y aprueba** la pregunta madre. Mientras no apruebe, no entra al router.
4. **Codex propone variantes** solo después de aprobar la pregunta madre: paráfrasis, seguimientos y ambigüedades, sin crear hechos nuevos.
5. **Se sincroniza el catálogo TypeScript**, se agregan evaluaciones y se ejecutan pruebas.
6. **El visor interno** permite buscar la ficha y marcarla para mejorar; esa marca no modifica archivos automáticamente.

## Dictado recomendado

> Pregunta que imagino: …  
> Respuesta ideal: …  
> Quiero que suene: …  
> Nunca debería decir: …  
> Para responder necesita saber: …  
> Si falta información debería preguntar: …

No hace falta respetar el formato al hablar: Codex puede ordenar un relato libre y devolver una ficha aprobable.

## Orden de respuesta

1. Buscar una regla de seguridad o ficha aprobada.
2. Usar datos sintéticos o una operación determinista cuando corresponda.
3. Si no alcanza, reconocer el límite y ofrecer preguntas concretas.
4. A futuro, solo después de eso, recuperar contexto aprobado y llamar a una IA de bajo costo. La IA no reemplaza el catálogo ni convierte feedback en verdad.

## Qué no guardar

- Claves, tokens, RUT, números de tarjeta o credenciales.
- Saldos, cartolas, deudas o identidades reales de personas.
- Afirmaciones no verificadas como si fueran hechos.
- Promesas de ahorro, devolución, fraude o ejecución financiera.
- Conversaciones completas cuando basta una pregunta madre anonimizada.

## Qué queda para una etapa posterior

Un sincronizador podría validar Markdown y generar `knowledge-catalog.ts`, además de recuperar solo las fichas relevantes antes de una llamada de IA. Requiere revisión editorial, control de versiones, evaluación de costo/calidad y política de retención; no está construido en este batch.
