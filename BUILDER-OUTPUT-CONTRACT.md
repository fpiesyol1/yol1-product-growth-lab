# Builder — contrato de salida editorial v0.3

**Estado:** piloto compartido para revisión.
**Autoridad:** `DIRECCION-PRODUCTOS-FELIPE.md`.
**Límite:** habilita un borrador compartido por enlace opaco; no habilita publicación, branch, identidad verificada ni core.

## Propósito

Definir el objeto mínimo que una persona decide llevar desde su ChatGPT o Claude a
la bandeja editorial YOL1, sin copiar la conversación completa ni confundir un
borrador con una decisión de producto.

## Objeto compartido `project_draft/0.2`

| Campo | Tipo | Regla |
|---|---|---|
| `project_id` | ID opaco | Lo crea el servidor con formato `prj_...`; no viene del chat |
| `submission_id` | string | Clave de reintento; se transforma en hash y no vuelve en la respuesta |
| `status` | enum | Sólo `draft` en el piloto |
| `title` | string | Nombre breve del proyecto |
| `idea` | string | Resumen acordado de la idea; no conversación completa |
| `problem` | string | Problema concreto que se busca resolver |
| `audience` | string | Persona o grupo para quien se diseña |
| `value_proposition` | string | Valor candidato que propone entregar YOL1 |
| `assumptions` | string[] | Hasta ocho supuestos explícitos, sin presentarlos como hechos |
| `open_questions` | string[] | Hasta ocho decisiones que necesitan revisión humana |
| `references` | string[] | Hasta cinco referencias elegidas; sin credenciales, tokens ni datos personales |
| `created_at` | ISO-8601 | Hora asignada por el servidor |
| `expires_at` | ISO-8601 | Expiración asignada por el servidor; hoy 90 días |
| `submission_mode` | enum conceptual | `local_only` para el formulario o `shared_draft` para el MCP; no se persiste en el objeto compartido |

## Objeto `screen_draft`

| Campo | Regla |
|---|---|
| `screen_key` | slug estable local, no copy visible |
| `title` | nombre de pantalla |
| `objective` | una frase |
| `content` | bloques principales, no especificación visual exhaustiva |
| `primary_action` | verbo honesto y destino |
| `event_name` | `snake_case`, estado `proposed` |
| `data_store` | datos candidatos a guardar |
| `data_query` | fuentes/datos candidatos a consultar |
| `never_store` | secretos o contenido excluido |
| `empty_error_states` | vacío, carga, error, reversa |
| `certainty` | `Decidido`, `Candidato`, `Por validar` o `Fuera de alcance` |

## Estado editorial

```text
draft (persona edita)
  → new (envío explícito)
  → review | later | resolved | ignored_wrong
```

El MCP sólo crea `draft` después de una confirmación explícita y devuelve un enlace
opaco. `draft → new` y cualquier decisión editorial siguen necesitando identidad,
roles, moderación y un owner definidos.

## Datos que no deben entrar

- conversación completa de ChatGPT o Claude;
- contraseña, API key, token, cookie o URL privada con secreto;
- RUT, OTP, biometría, documento, datos bancarios o de tarjeta;
- cartola cruda o datos personales de terceros;
- prompts internos, chain-of-thought o metadatos que la persona no eligió enviar.

## Confirmación UX

Después de guardar desde el formulario local debe decir:

> “Borrador guardado sólo en este navegador. No se envió a una bandeja compartida.”

No usar “enviado al equipo” hasta que el backend confirme persistencia compartida e
incluya un identificador de recepción.

Mientras el prototipo use almacenamiento local, debe ofrecer una reversa inmediata:
`Borrar este borrador local`. No promete borrado remoto porque no existe envío remoto.

Después de guardar desde el MCP debe devolver `project_id`, estado `draft`, fecha de
expiración y un enlace al Lab. Debe repetir que no publicó ni modificó pantallas.

## Criterios de aceptación

- El formulario pide nombre, título, propósito, fit YOL1 y resumen/referencia.
- El usuario puede completar el flujo sin MCP.
- La UI diferencia prompt copiado de URL MCP copiada.
- La URL pública del MCP se deriva del mismo dominio del Lab o de `NEXT_PUBLIC_MCP_URL`.
- El schema compartido coincide con `project-draft/0.2`; no exige nombre ni identidad verificada.
- Las referencias con credenciales embebidas o parámetros de token/secret se rechazan antes de persistir.
- El teléfono no afirma que recibe cambios del chat externo.
- El estado editorial visible permanece `borrador`; la UI distingue local de compartido.
- Después de guardar, la persona puede borrar ese borrador del navegador.
- Guardar vía MCP genera sólo el registro compartido; ninguna acción crea branch, publicación o cambio de core.

## Decisiones abiertas

1. Longitudes, sanitización y clasificación por campo.
2. Si referencias externas se guardan como URL, archivo o sólo descripción.
3. Schema visual de `screens` y mecanismo explícito de incorporación.
4. Owner, SLA y permisos de la bandeja compartida.
5. Qué transición sigue a `resolved`: PRD, experimento o archivo de conocimiento.
