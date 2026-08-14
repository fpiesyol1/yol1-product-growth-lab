# Builder — contrato de salida editorial v0.1

**Estado:** candidato local para revisión.  
**Autoridad:** `DIRECCION-PRODUCTOS-FELIPE.md`.  
**Límite:** no habilita MCP remoto, persistencia compartida, publicación, branch ni core.

## Propósito

Definir el objeto mínimo que una persona decide llevar desde su ChatGPT o Claude a
la bandeja editorial YOL1, sin copiar la conversación completa ni confundir un
borrador con una decisión de producto.

## Objeto `proposal_draft`

| Campo | Tipo | Regla |
|---|---|---|
| `proposal_id` | UUID local | Lo crea el Lab al guardar; no viene del chat |
| `proposal_version` | string | Comienza en `0.1`; cambia sólo al editar el borrador |
| `status` | enum | `draft` o `new`; otros estados son editoriales |
| `proposer_name` | string | Nombre visible; no se usa como identidad verificada |
| `title` | string | Nombre breve del proyecto |
| `purpose` | string | Problema, usuario y resultado buscado |
| `yol1_fit` | string | Por qué calza con dirección/principios YOL1 |
| `editorial_summary` | string | Texto que la persona decidió copiar; no chat completo |
| `screens` | array | Sólo pantallas explícitamente incorporadas |
| `risks` | array | Riesgos/fallas/reversas del resumen |
| `open_decisions` | array | Preguntas que necesitan decisión humana |
| `source_kind` | enum | `manual_summary`, `manual_reference`, `lab_created` |
| `submission_mode` | enum | En esta pasada: `local_only` |
| `created_at` | ISO-8601 | Hora local normalizada por el Lab |

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

En esta pasada sólo existen `draft → new` dentro del navegador. La transición a una
bandeja compartida necesita API, autorización, moderación, retención y owner editorial.

## Datos que no deben entrar

- conversación completa de ChatGPT o Claude;
- contraseña, API key, token, cookie o URL privada con secreto;
- RUT, OTP, biometría, documento, datos bancarios o de tarjeta;
- cartola cruda o datos personales de terceros;
- prompts internos, chain-of-thought o metadatos que la persona no eligió enviar.

## Confirmación UX

Después de guardar localmente debe decir:

> “Borrador guardado sólo en este navegador. No se envió a una bandeja compartida.”

No usar “enviado al equipo” hasta que el backend confirme persistencia compartida e
incluya un identificador de recepción.

Mientras el prototipo use almacenamiento local, debe ofrecer una reversa inmediata:
`Borrar este borrador local`. No promete borrado remoto porque no existe envío remoto.

## Criterios de aceptación

- El formulario pide nombre, título, propósito, fit YOL1 y resumen/referencia.
- El usuario puede completar el flujo sin MCP.
- La UI diferencia prompt copiado de URL MCP copiada.
- Sin URL validada, el control MCP está deshabilitado y legible.
- El teléfono no afirma que recibe cambios del chat externo.
- El estado editorial visible permanece `borrador`/`local`.
- Después de guardar, la persona puede borrar ese borrador del navegador.
- Ninguna acción genera fetch, branch, publicación o cambio de core desde Builder.

## Decisiones abiertas

1. Longitudes, sanitización y clasificación por campo.
2. Si referencias externas se guardan como URL, archivo o sólo descripción.
3. Schema visual de `screens` y mecanismo explícito de incorporación.
4. Owner, SLA y permisos de la bandeja compartida.
5. Qué transición sigue a `resolved`: PRD, experimento o archivo de conocimiento.
