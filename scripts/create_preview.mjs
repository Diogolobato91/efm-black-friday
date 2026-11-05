// Package the production build as an offline, reviewable HTML file. No publication.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(process.argv[2] || '/tmp/efm-black-friday-review/preview.html');
let html = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const asset = async (path) => readFile(resolve(root, 'dist', path.replace(/^\//, '')));
const dataURL = async (path, type) => `data:${type};base64,${(await asset(path)).toString('base64')}`;
const images = new Map([
  ['/brand/efm-white.svg', 'image/svg+xml'],
  ['/brand/efm-blue.svg', 'image/svg+xml'],
  ['/images/malta-illustration.svg', 'image/svg+xml'],
  ['/images/vinicius-malta-hero.webp', 'image/webp'],
  ['/images/vinicius-malta-coast.webp', 'image/webp'],
  ['/images/malta-sunset.webp', 'image/webp'],
  ['/images/malta-valletta.webp', 'image/webp'],
  ['/images/malta-cove-aerial.webp', 'image/webp'],
  ['/images/malta-luzzu-boats.webp', 'image/webp'],
  ['/images/malta-blue-lagoon.webp', 'image/webp'],
  ['/images/malta-street.webp', 'image/webp'],
]);
const imageURLs = new Map(
  await Promise.all([...images].map(async ([path, type]) => [path, await dataURL(path, type)])),
);
const jsPath = html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/)?.[1];
const stylesheets = [...html.matchAll(/<link[^>]*href="([^"]+\.css)"[^>]*>/g)];
if (!jsPath || !stylesheets.length) throw new Error('Build assets not found. Run npm run build first.');
let js = (await asset(jsPath)).toString();
for (const stylesheet of stylesheets) {
  let css = (await asset(stylesheet[1])).toString();
  for (const match of [...css.matchAll(/url\(([^)]+\.woff2)\)/g)]) {
    const path = match[1].replace(/^['"]|['"]$/g, '');
    css = css.replace(match[0], `url("${await dataURL(path, 'font/woff2')}")`);
  }
  html = html.replace(stylesheet[0], () => `<style>${css}</style>`);
}
for (const [path, url] of imageURLs) {
  js = js.replaceAll(path, url);
  html = html.replaceAll(path, url);
}
html = html.replace(/<script[^>]*src="[^"]+"[^>]*><\/script>/, () => `<script type="module">${js}</script>`);
const license = await readFile(resolve(root, 'node_modules/@fontsource-variable/montserrat/LICENSE'), 'utf8');
html = html.replace('</head>', () => `<!-- Montserrat font license:\n${license.replaceAll('--', '—')}\n-->\n</head>`);
await mkdir(dirname(output), { recursive: true });
await writeFile(output, html);
console.log(`Offline preview: ${output} (${Buffer.byteLength(html)} bytes)`);
