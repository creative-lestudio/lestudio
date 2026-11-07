# Auditoría técnica — rediseño integral (Fase 1)

Punto de partida: `main` en `ccc5141` (etiqueta `estado-inicial-rediseno`).

## Stack
- HTML estático + JS vanilla (`assets/app.js`), Tailwind compilado desde `tools/`, fuentes autoalojadas.
- Despliegue: Cloudflare Workers Builds desde `main`. La raíz no debe contener `package.json`.
- Inglés generado (`tools/scripts/build-en.mjs`) a partir del diccionario `assets/i18n.js`.

## Formularios e integraciones
- Formspree (`FORM_ENDPOINT`), antispam por campo señuelo, UTM en sessionStorage.
- GA4 sin ID (vacío) y detrás de consentimiento; Meta Pixel vacío.
- No hay CRM ni webhook. `CHAT_API_ENDPOINT` es un marcador sin uso real.

## Hallazgos
- El logo solo existe en PNG blanco recoloreado con máscara CSS (falta SVG vectorial).
- Tipografía actual: Helvetica Light con Inter de reserva; el brief pide Clash Grotesk en titulares.
- Sección de asistente (chat) heredada que se sustituirá por el diagnóstico de 4 preguntas.
- Vista SPA de servicio heredada sin uso real (las páginas estáticas la sustituyen).
- Embebidos de Behance en casos estáticos: error 400 en pruebas automáticas; verificar en navegador real.
- Ancla `#quienes-somos` a renombrar a `#estudio` (actualizar dock y JS).

## Pendiente de aportar por el cliente
Ver `TODO-CONTENIDO.md`. No se inventan dirección, reseñas, premios, precios ni resultados.
