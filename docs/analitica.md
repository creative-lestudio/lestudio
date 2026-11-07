# Analítica

GA4 solo se carga si hay `GA_MEASUREMENT_ID` en `assets/config.js` **y** el visitante acepta las cookies. Hoy está vacío.

## Eventos implementados
`reserve_audit_click`, `whatsapp_click`, `phone_click`, `form_submit`, `generate_lead` (envío correcto de un formulario), `lead_magnet_submit`, `lead_magnet_download`, `diagnostic_start`, `diagnostic_complete`, y clics con `data-cta` (por ejemplo `hero_hablemos`, `hero_proyectos`, `goal_*`).

## Pendientes (requieren datos o cuentas reales)
- Crear la propiedad GA4 y pegar el ID.
- `booking_confirmed`: solo tiene sentido si se integra un calendario de reservas (no existe aún).
- Search Console: verificar el dominio y enviar `sitemap.xml`; revisar consultas con "Valencia" tras unas semanas.
- Medición de LCP/INP/CLS con datos reales (CrUX/PageSpeed) tras publicar.
