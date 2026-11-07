# LE STUDIO — web (lestudio-crea.com)

Sitio estático (HTML + CSS + JS). No hay servidor ni framework: lo único que se "compila" es el CSS de Tailwind y las copias en inglés. Las herramientas de compilación viven en `tools/` (fuera de la raíz del sitio, para que el despliegue automático no intente instalarlas ni ejecutarlas).

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` y `*/index.html` | Páginas en español (home, 6 servicios, nichos, lead magnet, privacidad, proyectos) |
| `en/…` | Versión en inglés **generada** (no editar a mano) |
| `assets/config.js` | **Un solo sitio** para WhatsApp, teléfono, email, oferta, endpoint de formularios y IDs de analítica |
| `assets/app.js` | Lógica, datos de servicios, proyectos, clientes y reseñas |
| `assets/i18n.js` | Diccionario ES → EN |
| `assets/styles.css` | Estilos (tema claro/oscuro con variables `--ink` y `--paper`) |
| `assets/tailwind.css` | CSS de Tailwind **compilado** (no editar) |
| `tools/` | Herramientas de compilación (Tailwind, prerender, inglés). No forman parte del sitio |
| `assets/diagnostico.js` | Diagnóstico de 4 preguntas de la home y parallax del hero |
| `docs/` | Auditoría, leads/CRM/n8n y analítica |
| `TODO-CONTENIDO.md` | Lo que falta por aportar |

## Preparar el entorno (una vez)

```bash
cd tools
npm install
npx playwright install chromium
```

## Después de cambiar contenido

```bash
cd tools
npm run build
```

Hace tres cosas, en orden:

1. `build:css` — compila Tailwind y lo adapta al tema claro/oscuro.
2. `prerender` — pinta en el HTML los clientes, el portafolio, los testimonios y los trabajos de cada servicio (para buscadores y lectores de IA).
3. `build:en` — regenera `/en/`, los `hreflang` y el `sitemap.xml`.

Luego haz commit de todo lo que cambie y súbelo. Si solo editas CSS/JS y no textos, basta con `npm run build:css`.

## Publicar

Se publica solo al hacer merge a `main`. No hace falta ningún paso extra, siempre que hayas ejecutado `npm run build` (dentro de `tools/`) y subido los archivos generados. Importante: **no pongas `package.json` ni `package-lock.json` en la raíz** del repositorio; si el despliegue automático los ve, intentará instalarlos y puede fallar.

## Datos que se cambian en un solo sitio

- WhatsApp, teléfono, email, oferta, Formspree y Google Analytics: `assets/config.js`.
- Cada enlace de WhatsApp del HTML ya lleva su URL `wa.me` real; si cambias el número, ejecuta un buscar-y-reemplazar del número antiguo (el JavaScript también lo corrige en el navegador).

## Añadir cosas

- **Cliente nuevo en el carrusel:** `assets/app.js` → `clients` y `marqueeLogos` + logo blanco en `assets/marquee-*.png`.
- **Caso de estudio:** `assets/app.js` → `projects` (hay una plantilla comentada; `draft: true` lo oculta).
- **Reseña publicada:** `assets/app.js` → `reviews`.
- **Texto nuevo:** añade su traducción en `assets/i18n.js` (`Object.assign(EN, {...})`).

## Comprobar traducciones pendientes

Tras `npm run build` (en `tools/`), busca texto en español dentro de `en/` (por ejemplo con `grep -rE "¿|á|é|í|ó|ú" en/ --include=index.html` y filtrando nombres propios).

## Formularios

Envían a Formspree (`FORM_ENDPOINT` en `assets/config.js`) con antispam (campo señuelo), validación en línea y los datos de origen (UTM, referrer, página). Las reseñas llegan marcadas como pendientes de moderación.

## Analítica

Solo se carga Google Analytics si hay ID en `assets/config.js` **y** el visitante acepta el aviso de cookies. Ver `docs/analitica.md`. Eventos: `generate_lead`, `diagnostic_start`, `diagnostic_complete`, `reserve_audit_click`, `whatsapp_click`, `phone_click`, `form_submit`, `lead_magnet_submit`, `lead_magnet_download`.
