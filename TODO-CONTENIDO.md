# TODO — Contenido y datos que faltan por aportar

Todo lo de esta lista se dejó **preparado pero sin inventar nada**. Marca cada punto cuando lo tengas.

## 1. Imprescindible antes de publicar

- [ ] **Titular de datos del responsable** en `/privacidad/` (razón social o nombre, NIF/CIF, domicilio). Ahora solo figura "LE STUDIO" + email + teléfono. Conviene que lo revise un asesor (RGPD/LSSI).
- [ ] **Crear la cuenta de Google Analytics 4** (analytics.google.com → Crear propiedad → "Web") y pegar el ID `G-XXXXXXXXXX` en `assets/config.js` (`GA_MEASUREMENT_ID`). Mientras esté vacío no se carga nada ni sale el aviso de cookies.
- [ ] **Confirmar el número de WhatsApp** (`584241859724`, Venezuela) y el de llamadas (`+34 662 490 547`) en `assets/config.js`. Si quieres un WhatsApp con número español, cámbialo ahí y se actualiza en todo el sitio.
- [ ] **Confirmar el nicho prioritario.** Se asumió: (1) restaurantes y comercios locales, (2) pymes con WhatsApp saturado → IA. Si es otro, hay que cambiar el hero y las páginas `/hosteleria/` y `/automatizacion-whatsapp/`.

## 2. Lead magnet (checklist de IA)

- [ ] **Subir el PDF** como `assets/descargas/checklist-automatizacion-ia.pdf`. Cuando exista, `/checklist-ia/gracias/` muestra solo el botón de descarga (hoy dice que se enviará por email).
- [ ] **Decidir cómo se envía el PDF por email.** Hoy el formulario te avisa por Formspree (asunto "Descarga de la checklist — …") y tú la mandas. Para automatizarlo hay que conectar Formspree/Make/n8n con un servicio de email.

## 3. Casos de estudio

La plantilla está documentada en `assets/app.js` (bloque `PLANTILLA DE CASO DE ESTUDIO`, antes de `kia-contenido`). Campos: `context`, `challenge`, `solution`, `result`, `metrics` (+ `metricsNote` con fuente y fecha) y `testimonial`.

- [ ] **Kia Centro Marca — Contenido viral** (borrador oculto): faltan contexto, reto, qué hicimos y cita del cliente. Al completarlo, quitar `draft: true`.
- [ ] **Resultados con números** para los casos que solo tienen texto: Decoplant, RDR, Tecnoclean, Urbantex, Synergy, HPS, Winners League, Legacy World (web), MDS (contenido).
- [ ] **Casos de IA y automatización**: no hay ninguno documentado, por eso `/automatizacion-whatsapp/` no muestra casos.
- [ ] **Confirmar las cifras públicas** usadas (todas "a noviembre de 2026"): 36K y 2,3K vistas de los episodios, 2,4M de vistas del clip, 7.127 / 5.053 / 4.827 seguidores, 128,1K y 111,6K de Kia. El texto del resultado del podcast dice ahora **"36.000 vistas orgánicas"**: confirma que sigue siendo orgánico.
- [ ] **Miniaturas de los 3 reels de IA**: están, pero sin título ni cliente ("AI Reel 1/2/3"). Pasa título/cliente y, si quieres, vistas.
- [ ] **Captura de la web de Repite** y de los demás sitios: se refrescan a mano (`assets/web-*.jpg`) cuando cambien los diseños.

## 4. Reseñas

- [ ] **Pedir reseñas al cerrar cada proyecto** con este enlace corto: `https://lestudio-crea.com/resena/`
  Mensaje sugerido para WhatsApp: *"Hola [nombre], gracias por confiar en LE STUDIO. ¿Nos dejas una reseña de 1 minuto? https://lestudio-crea.com/resena/"*
- [ ] **Moderar**: cada reseña llega a tu email (Formspree) marcada como `PENDIENTE DE MODERACIÓN`. Para publicarla, añádela al array `reviews` de `assets/app.js` y ejecuta `npm run build`.
- [ ] Las reseñas actuales (4) se usan también en los datos estructurados de la home (`aggregateRating`). Si añades o quitas reseñas, actualiza ese bloque en `index.html`.

## 5. Textos y supuestos que conviene revisar

- [ ] **Contenido de la auditoría gratuita** (lo que "revisamos" en las páginas de nicho): redactado a partir de la oferta ("auditoría gratuita de sistemas digitales, llamada de 30 min"). Ajusta la lista a lo que de verdad haces.
- [ ] **Titulares alternativos del hero** (el publicado es el A):
  - A (publicado): *Tu negocio, con sistemas digitales que trabajan por ti.*
  - B: *Más pedidos, menos mensajes sin responder.*
  - C: *Haz que tus clientes te encuentren, te elijan y vuelvan.*
- [ ] **Dirección del negocio** en los datos estructurados: solo se publica "Valencia, ES" como localidad.
- [ ] **Logo del cliente "Caracas Mary"** y demás logos en blanco: están en `assets/marquee-*.png`. Si tienes versiones vectoriales (SVG), sustitúyelas para más nitidez.
- [ ] **Enlaces de Behance de Urbantex y Synergy**: no aparecen en tu perfil público; verifica que abren.
- [ ] **Embebidos de Behance** en las páginas estáticas `/proyectos/*-identidad/`: devuelven error 400 en pruebas automáticas; compruébalo en tu navegador.

## 6. Imágenes y contenido por idioma

- [ ] La versión en inglés se genera con el diccionario de `assets/i18n.js`. Si añades texto nuevo en español, añade su traducción ahí (si no, se queda en español en `/en/`). Hay un comprobador rápido en el README.
