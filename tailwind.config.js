// Misma configuración que el CDN que había antes (sin tema propio): solo escanea el contenido del sitio.
module.exports = {
  content: ['./*.html', './*/index.html', './assets/app.js', './assets/intro.js'],
  theme: { extend: {} },
  plugins: []
};
