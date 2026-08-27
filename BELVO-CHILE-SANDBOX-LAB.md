# Belvo Chile Fixture Lab

Simulador local para explorar cómo podría verse un resumen tributario chileno. La interfaz está disponible en `/belvo-lab` y la fixture en `GET /api/belvo-lab/probe`.

## Invariante de seguridad

Esta versión opera con **cero red hacia Belvo**:

- no pide ni lee Secret ID, Secret Password, usuario tributario u otra llave;
- no consulta variables de entorno;
- no autentica ni crea Links;
- no ejecuta solicitudes a Belvo u otro proveedor;
- no tiene fallback a sandbox o producción;
- `POST /api/belvo-lab/probe` falla cerrado con `405` y no lee el body.

El único `fetch` del flujo ocurre en el navegador contra la ruta relativa y local de YOL1. El servidor responde con una fixture determinista incluida en el repositorio.

## Cómo usarlo

1. Abre `/belvo-lab`.
2. Presiona **Cargar fixture local**.
3. Revisa el contrato sintético: institución ficticia, resumen tributario y facturas ficticias.

No ingreses datos personales ni secretos: el producto no contiene campos para recibirlos.

## Qué demuestra

- Que el Lab puede representar un contrato mínimo sin exponer payloads crudos.
- Que la experiencia diferencia datos ficticios, proveedor desconectado y cobertura pendiente.
- Que el frontend maneja un escenario determinista y no identificable.

## Qué no demuestra

- Que Belvo tenga Fiscal Chile disponible en sandbox o producción.
- Que una cuenta o persona real pueda conectarse.
- Que los campos de la fixture coincidan con una respuesta vigente del proveedor.
- Consentimiento, base legal, seguridad productiva ni autorización regulatoria.

## Evidencia en el repositorio

- `lib/server/belvo-sandbox.ts`: fábrica determinista, sin adaptador ni I/O.
- `app/api/belvo-lab/probe/route.ts`: GET local y POST cerrado.
- `app/belvo-lab/belvo-lab-client.tsx`: no recibe llaves; sólo carga la ruta local.
- `tests/belvo-chile-sandbox-lab.test.mjs`: pruebas hostiles de cero red y no ingestión.

## Integración futura (Prop.)

Validar cobertura real requeriría un experimento separado, autorización explícita, secretos administrados fuera del navegador, revisión de privacidad y un adapter que no sea seleccionable desde este Lab. Nada de eso está implementado aquí.

Referencias de investigación, no llamadas por el prototipo:

- Sandbox: https://developers.belvo.com/developer_resources/resources-sandbox
- Tax Status Chile: https://developers.belvo.com/apis/belvoopenapispec/tax-status-chile
- Invoices Chile: https://developers.belvo.com/apis/belvoopenapispec/invoices-chile
