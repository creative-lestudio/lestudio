// Genera la versión en inglés (/en/...) a partir de las páginas en español, con el mismo traductor
// (assets/i18n.js) que usa el navegador, y añade los enlaces hreflang ES/EN y el sitemap.
//
// Uso:  npm run build:en
// Orden recomendado tras editar contenido:  npm run build:css && npm run prerender && npm run build:en
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync, readdirSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = new URL('../..', import.meta.url).pathname;
const SITE = 'https://lestudio-crea.com';
const TODAY = new Date().toISOString().slice(0, 10);

// ---------- páginas que tienen versión en inglés ----------
const EXCLUDE = new Set(['resena', 'en', 'node_modules', 'tools', 'assets', 'docs']);
const pages = ['']; // '' = home
for (const d of readdirSync(root)) {
  if (EXCLUDE.has(d) || !statSync(join(root, d)).isDirectory()) continue;
  if (existsSync(join(root, d, 'index.html'))) pages.push(d + '/');
  for (const sd of readdirSync(join(root, d))) {
    const rel = `${d}/${sd}`;
    if (EXCLUDE.has(rel)) continue;
    if (statSync(join(root, d, sd)).isDirectory() && existsSync(join(root, d, sd, 'index.html'))) pages.push(rel + '/');
  }
}
const esUrl = (p) => `${SITE}/${p}`;
const enUrl = (p) => `${SITE}/en/${p}`;
const enPathSet = new Set(pages.map((p) => `/${p}`));

// ---------- 1) hreflang en las páginas en español ----------
function setAlternates(html, p, { selfLang }) {
  html = html.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?/g, '');
  const tags = `<link rel="alternate" hreflang="es" href="${esUrl(p)}">\n<link rel="alternate" hreflang="en" href="${enUrl(p)}">\n<link rel="alternate" hreflang="x-default" href="${esUrl(p)}">\n`;
  return html.replace(/(<link rel="canonical"[^>]*>\n?)/, `$1${tags}`);
}
for (const p of pages) {
  const f = join(root, p, 'index.html');
  writeFileSync(f, setAlternates(readFileSync(f, 'utf8'), p, { selfLang: 'es' }));
}
console.log('hreflang añadido a', pages.length, 'páginas en español');

// ---------- 2) servidor local ----------
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.json': 'application/json', '.txt': 'text/plain' };
const server = createServer((req, res) => {
  let p = join(root, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.statusCode = 404; return res.end(); }
  res.setHeader('content-type', types[extname(p)] || 'application/octet-stream');
  res.end(readFileSync(p));
}).listen(0);
const port = server.address().port;

// ---------- 3) captura en inglés ----------
const browser = await chromium.launch();
for (const p of pages) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(() => { try { sessionStorage.setItem('intro_seen', '1'); sessionStorage.setItem('lang', 'en'); localStorage.removeItem('theme'); } catch (e) {} window.__BUILD_EN__ = true; });
  await page.goto(`http://localhost:${port}/${p}`);
  await page.waitForFunction(() => window.__appReady === true && window.I18N && window.I18N.lang === 'en');
  await page.waitForTimeout(500);

  const html = await page.evaluate(({ p, SITE, enPaths }) => {
    const tr = (s) => (window.I18N ? window.I18N.tr(s) : s);
    const enPage = `${SITE}/en/${p}`, esPage = `${SITE}/${p}`;
    const d = document;

    // limpiar el estado que el JavaScript añade al cargar
    ['#cookie-banner', '#cookie-prefs'].forEach((s) => d.querySelectorAll(s).forEach((n) => n.remove()));
    ['js', 'scrolled', 'nav-hide', 'intro-on'].forEach((c) => d.documentElement.classList.remove(c));
    if (!d.documentElement.className) d.documentElement.removeAttribute('class');
    d.querySelectorAll('.marquee-track').forEach((n) => n.removeAttribute('style'));
    d.querySelectorAll('.rv.in').forEach((n) => n.classList.remove('in'));
    d.documentElement.setAttribute('lang', 'en');
    d.documentElement.setAttribute('data-theme', 'dark');

    // metadatos
    d.title = tr(d.title);
    const setMeta = (sel, attr, fn) => d.querySelectorAll(sel).forEach((m) => m.setAttribute(attr, fn(m.getAttribute(attr))));
    setMeta('meta[name="description"]', 'content', tr);
    setMeta('meta[property="og:title"], meta[name="twitter:title"]', 'content', tr);
    setMeta('meta[property="og:description"], meta[name="twitter:description"]', 'content', tr);
    setMeta('meta[property="og:url"]', 'content', () => enPage);
    setMeta('meta[property="og:locale"]', 'content', () => 'en_US');
    d.querySelectorAll('link[rel="canonical"]').forEach((l) => l.setAttribute('href', enPage));

    // JSON-LD: traducir cadenas conocidas y apuntar a la versión en inglés
    d.querySelectorAll('script[type="application/ld+json"]').forEach((sc) => {
      try {
        const walk = (v) => {
          if (typeof v === 'string') {
            if (v === esPage) return enPage;
            return tr(v);
          }
          if (Array.isArray(v)) return v.map(walk);
          if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v)) o[k] = (k === 'item' && v[k] === esPage) ? enPage : walk(v[k]); return o; }
          return v;
        };
        sc.textContent = JSON.stringify(walk(JSON.parse(sc.textContent)));
      } catch (e) {}
    });

    // enlaces: todo en absoluto; las páginas del sitio apuntan a su versión en inglés
    const fix = (el, attr) => {
      const raw = el.getAttribute(attr);
      if (!raw || raw.startsWith('#') || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(raw)) return;
      const u = new URL(raw, location.href);
      if (u.origin !== location.origin) return;
      let path = u.pathname;
      const isPage = !/\.[a-z0-9]+$/i.test(path) && path.startsWith('/') && enPaths.includes(path.endsWith('/') ? path : path + '/') ;
      const isHomeFile = /^\/index\.html$/.test(path);
      if (isHomeFile) path = '/';
      if ((isPage || isHomeFile) && el.tagName === 'A') path = '/en' + (path === '/' ? '/' : path);
      el.setAttribute(attr, path + u.search + u.hash);
    };
    d.querySelectorAll('a[href], link[href], script[src], img[src], source[src]').forEach((el) => {
      if (el.matches('link[rel="alternate"], link[rel="canonical"]')) return;
      fix(el, el.hasAttribute('href') ? 'href' : 'src');
    });

    // hreflang (la versión en español es la de origen)
    d.querySelectorAll('link[rel="alternate"][hreflang]').forEach((l) => l.remove());
    const can = d.querySelector('link[rel="canonical"]');
    [['es', esPage], ['en', enPage], ['x-default', esPage]].reverse().forEach(([l, h]) => {
      const n = d.createElement('link'); n.rel = 'alternate'; n.hreflang = l; n.href = h;
      can.insertAdjacentElement('afterend', n);
    });
    return '<!DOCTYPE html>\n' + d.documentElement.outerHTML + '\n';
  }, { p, SITE, enPaths: [...enPathSet] });

  const out = join(root, 'en', p, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log('en/' + p);
  await page.close();
}
await browser.close();
server.close();

// ---------- 4) sitemap con alternativas de idioma ----------
const prio = (p) => (p === '' ? '1.0' : /^proyectos\/.+/.test(p) ? '0.6' : p === 'privacidad/' ? '0.3' : p === 'checklist-ia/' ? '0.7' : p === 'proyectos/' ? '0.8' : '0.9');
const freq = (p) => (p === '' ? 'weekly' : p === 'privacidad/' ? 'yearly' : 'monthly');
const alt = (p) => `    <xhtml:link rel="alternate" hreflang="es" href="${esUrl(p)}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${enUrl(p)}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${esUrl(p)}"/>\n`;
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
for (const p of pages.filter((x) => x !== 'checklist-ia/gracias/')) for (const u of [esUrl(p), enUrl(p)]) {
  xml += `  <url>\n    <loc>${u}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${freq(p)}</changefreq>\n    <priority>${prio(p)}</priority>\n${alt(p)}  </url>\n`;
}
xml += '</urlset>\n';
writeFileSync(join(root, 'sitemap.xml'), xml);
console.log('sitemap actualizado');
