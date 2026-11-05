// Pinta en el HTML estático las secciones que app.js genera con JavaScript (clientes, portafolio,
// testimonios y "trabajo real" de cada servicio), para que buscadores y lectores de IA vean el contenido.
// Uso:  npm run prerender   (requiere Playwright: npm i -D playwright && npx playwright install chromium)
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = new URL('../..', import.meta.url).pathname;
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp' };

const server = createServer((req, res) => {
  let p = join(root, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.statusCode = 404; return res.end(); }
  res.setHeader('content-type', types[extname(p)] || 'application/octet-stream');
  res.end(readFileSync(p));
}).listen(0);
const port = server.address().port;

const jobs = [
  { page: 'index.html', ids: ['cl-1a', 'cl-1b', 'cl-2a', 'cl-2b', 'portfolio-home-grid', 'testimonials-static-grid'] },
  ...['social-media', 'content-production', 'brand-design', 'web-development', 'growth-marketing', 'ai-automation', 'hosteleria']
    .map((s) => ({ page: `${s}/index.html`, ids: ['service-work'] })),
];

const browser = await chromium.launch();
for (const { page: file, ids } of jobs) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(() => { try { sessionStorage.setItem('intro_seen', '1'); } catch (e) {} });
  await page.goto(`http://localhost:${port}/${file.replace('index.html', '')}`);
  await page.waitForFunction(() => window.__appReady === true);
  await page.waitForTimeout(400);
  let html = readFileSync(join(root, file), 'utf8');
  for (const id of ids) {
    const inner = await page.evaluate((i) => {
      const el = document.getElementById(i);
      if (!el) return null;
      const c = el.cloneNode(true);
      c.querySelectorAll('.rv').forEach((n) => n.classList.remove('in'));
      return c.innerHTML.replace(/<!--prerender:(start|end)-->/g, '');
    }, id);
    if (inner === null) continue;
    const re = new RegExp(`(<[^>]*id="${id}"[^>]*>)<!--prerender:start-->[\\s\\S]*?<!--prerender:end-->`);
    if (!re.test(html)) { console.warn(`sin marcador: ${file} #${id}`); continue; }
    html = html.replace(re, (_, open) => `${open}<!--prerender:start-->${inner}<!--prerender:end-->`);
  }
  writeFileSync(join(root, file), html);
  console.log('prerender', file);
  await page.close();
}
await browser.close();
server.close();
