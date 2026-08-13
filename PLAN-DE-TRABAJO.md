# YOL1 Product Lab — plan de trabajo

## Objetivo

Construir productos y prototipos de YOL1 de forma rápida, visual y ordenada. Las personas pueden proponer mejoras sin usar GitHub; las versiones oficiales siempre quedan revisadas y respaldadas.

## Cómo funciona el sistema

```text
Ideas y bocetos
      ↓
YOL1 Product Lab local
      ↓
Versión de prueba por link
      ↓
Propuesta y feedback
      ↓
Revisión de Felipe
      ↓
Versión oficial publicada
```

GitHub vive detrás de este proceso. Es el historial y respaldo, no la interfaz de trabajo de los colaboradores.

## Fase 0 — hoy: dejar la base local lista

**Resultado:** una carpeta única con el producto, sus reglas y una primera web navegable.

- Carpeta: `yol1-product-lab`.
- Web local: `prototype.html`.
- Reglas de diseño: `PRODUCT-DESIGN.md`.
- Plan de trabajo: este archivo.
- Datos: siempre sintéticos hasta definir permisos, privacidad e integraciones.

**Regla:** no crear copias de carpetas para cada cambio. Se trabaja siempre sobre esta misma base.

## Fase 1 — primer repositorio privado en GitHub

**Resultado:** GitHub respalda la misma carpeta que tienes en tu computador.

1. En GitHub, crear un repositorio **privado** llamado `yol1-product-lab`.
2. No agregar README, licencia ni archivos iniciales desde GitHub: la carpeta local ya los tendrá.
3. Conectar la carpeta local a ese repositorio.
4. Guardar la primera versión con el mensaje: `Base inicial del Product Lab`.
5. Verificar que en GitHub se vean los mismos archivos que en tu computador.

### Qué significa cada palabra

- **Repositorio:** la carpeta oficial del proyecto y su historial.
- **Commit:** una foto guardada de un avance que aprobaste.
- **Push:** subir esa foto a GitHub.
- **Pull:** traer a tu computador cambios que ya están en GitHub.
- **Branch:** una versión paralela para probar una mejora sin tocar lo oficial.
- **Pull request:** comparación para decidir si una mejora pasa a la versión oficial.

## Fase 2 — ciclo simple de trabajo

**Resultado:** cada sesión termina con una versión clara, visible y recuperable.

1. Definir una pantalla, flujo o hipótesis.
2. Construirla en el laboratorio local.
3. Abrirla y recorrerla juntos.
4. Ajustar hasta que se entienda y tenga una acción principal.
5. Guardar el cambio con una frase clara.
6. Subirlo a GitHub.
7. Documentar la decisión de producto en Notion cuando sea relevante para negocio, riesgo o roadmap.

### Quién hace qué

| Tú | Codex | GitHub |
|---|---|---|
| Define el problema, revisa pantallas y aprueba | Diseña, implementa, prueba, explica y guarda cambios | Mantiene las versiones, comparaciones y respaldo |

## Fase 3 — compartir el laboratorio

**Resultado:** otras personas acceden por un link, no por GitHub.

1. Publicar una versión de prueba en un proveedor de hosting.
2. Compartir un link de prueba protegido a los invitados correctos.
3. Mantener datos ficticios durante esta etapa.
4. Recibir comentarios sobre pantallas y flujos.
5. Convertir los comentarios valiosos en propuestas, no en cambios directos a la versión oficial.

## Fase 4 — YOL1 Review

**Resultado:** Felipe revisa propuestas visuales sin usar código.

La interfaz tendrá un catálogo con:

- Pantalla o flujo afectado.
- Versión oficial y propuesta lado a lado.
- Motivo, hipótesis y comentario.
- Estado: borrador, en prueba, aprobado o descartado.
- Acción: publicar o devolver con comentario.

Al aprobar, la propuesta se integra en GitHub y se publica una nueva versión del Lab.

## Fase 5 — MCP de YOL1

**Resultado:** ChatGPT y Claude pueden usar el conocimiento de YOL1 sin entregar acceso a GitHub a cada persona.

Herramientas iniciales del MCP:

- Consultar principios de marca y UX.
- Buscar pantallas, flujos y decisiones ya aprobadas.
- Crear un borrador de idea o especificación.
- Proponer una mejora y dejarla en revisión.

Regla de seguridad: el MCP parte con lectura y borradores. Solo Felipe o roles autorizados pueden publicar una versión oficial.

## Cuándo usar Notion y cuándo GitHub

| Notion | GitHub |
|---|---|
| Estrategia, PRD, contexto de negocio, acuerdos, proveedores | Web, pantallas, componentes, datos sintéticos, versiones y propuestas |
| “Por qué hacemos esto” | “Qué versión funciona hoy” |

## Primeras tres decisiones que necesitamos tomar

1. Crear el repositorio privado de GitHub.
2. Definir el nombre del primer producto: `YOL1 Product Lab` o `YOL1 Financial Assistant Lab`.
3. Elegir el primer flujo que vamos a dejar sólido: **Mis Finanzas → Cartola → acción**, o **Cobrar → repartir gasto → enviar cobro**.
