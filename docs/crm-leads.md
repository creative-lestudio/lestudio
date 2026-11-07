# Leads, CRM y n8n

## Situación actual
No hay CRM ni n8n. Los leads llegan por **email vía Formspree** y `LEAD_WEBHOOK_URL` está vacío (desactivado). No hace falta tocar nada para que el sitio funcione.
Cuando quieras ordenar los leads sin montar infraestructura, lo más simple es la integración de Formspree con Google Sheets (desde su panel); no requiere cambios de código.

## Cómo funciona hoy
1. Cada formulario (contacto, auditoría, presupuesto, checklist) envía a **Formspree** (`FORM_ENDPOINT` en `assets/config.js`). Llega a tu email.
2. Si defines `LEAD_WEBHOOK_URL` en `assets/config.js`, **además** se envía el mismo lead (JSON) a esa URL. Vacío = desactivado.
3. El diagnóstico de 4 preguntas no envía nada solo: al final abre el formulario con las respuestas escritas.

## Estructura del lead (JSON enviado al webhook)
`lead_id`, `fecha` (ISO), `estado` (`nuevo`), `tipo`, `nombre`, `email`, `telefono`, `empresa`, `servicio`, `mensaje`, `cuando`, `consentimiento`, `pagina`, `idioma`, `atribucion` (UTM, referrer).
Las reseñas no se envían al webhook (van solo a Formspree, pendientes de moderación).

## Conectar n8n (cuando tengas la instancia)
1. En n8n crea un flujo con un nodo **Webhook** (POST) y copia su URL de producción.
2. Pégala en `LEAD_WEBHOOK_URL`. No pongas claves ni tokens en el frontend.
3. Pasos típicos del flujo: guardar en Google Sheets / CRM, avisar por email o WhatsApp, responder al lead.
4. Si el navegador bloquea la petición por CORS, activa CORS en el nodo Webhook para `https://lestudio-crea.com`.
No hay URL de n8n real en este repositorio: no se ha inventado ninguna.

## Estados sugeridos en el CRM
nuevo → contactado → auditoría agendada → propuesta → ganado / perdido.
