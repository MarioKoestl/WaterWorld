// Bundles the engine and one era into one self-contained page, once for every folder under eras/:
// ../index.html for the era `today`, ../<id>.html for every other era.
//   npm run build            minified
//   npm run build:readable   unminified, for debugging
//   npm run build:dev        ../dev.html and ../<id>-dev.html: unminified, plus the development tools in engine/dev.js
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';
import ERAS from './eras.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
// A page is one scope, read in this order: the engine's library, then every .js file of the era's folder in the order
// of their names, then the part of the engine that runs. So an era can use the library at once, and the engine finds
// what the era has defined. Concatenation order matters
const LIB = ['quality.js', 'math.js', 'tools.js'], RUN = ['shaders.js', 'zoo.js', 'main.js', 'audio.js'];
const dev = process.argv.includes('--dev'), readable = dev || process.argv.includes('--readable');
if (dev) RUN.push('dev.js');

const shell = readFileSync(path.join(here, 'template.html'), 'utf8');
// everything runs inside one async function; startup errors are shown on screen
const wrap = (body) => `(async()=>{${body}\n})().catch(e=>{console.error(e);document.body.className='l e';document.getElementById('s').textContent=(e.cause?'':'Failed to start: ')+e.message});`;
// shrink the WGSL inside /*wgsl*/ template literals
const minWgsl = (s) => s.replace(/\/\/[^\n]*/g, '').replace(/\s+/g, ' ').replace(/ ?([{}()\[\];,:=+\-*\/<>&|!%@]) ?/g, '$1').trim();

// an era is built when its folder exists
const built = readdirSync(path.join(here, 'eras'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
for (const id of built) if (!ERAS.some((e) => e[0] === id)) throw new Error(`eras/${id}: no era with this id in eras.mjs`);
// the page of an era: index.html is the world of today, links between pages are relative so they work from a folder on disk
const page = (id) => (id === 'today' ? (dev ? 'dev' : 'index') : id + (dev ? '-dev' : '')) + '.html';
// The title menu of a page. Dates are shown rounded to whole millions of years
const r = Math.round, esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const when = (from, to) => (to ? `${r(from)} to ${r(to)} million years ago` : `the last ${r(from)} million years`);
// The timeline: the page's own era lit (b), the built ones as links (a), the others dimmed (span). The lit one says
// its dates in full, so the unit of the numbers is always in view. Beside the line: the nearest built era before and
// after this one, as links for where the line scrolls and they may be out of view (the page shows them only there)
const timeline = (cur) => {
  const at = ERAS.findIndex((e) => e[0] === cur), isBuilt = (e) => built.includes(e[0]);
  const prev = ERAS.slice(0, at).reverse().find(isBuilt), next = ERAS.slice(at + 1).find(isBuilt);
  return (prev ? `<a href=${page(prev[0])}>‹ ${prev[1]}</a>` : '') + '<nav>' + stops(cur) + '</nav>' + (next ? `<a href=${page(next[0])}>${next[1]} ›</a>` : '');
};
const stops = (cur) => ERAS.map(([id, name, from, to]) => {
  const stop = `<i>${name}<small>${id === cur ? when(from, to) : `${r(from)} to ${to ? r(to) : 'now'}`}</small></i>`;
  return id === cur ? `<b>${stop}</b>` : built.includes(id) ? `<a href=${page(id)}>${stop}</a>` : `<span>${stop}</span>`;
}).join('');
// where am I: the name of the era, when it was, and the sentences of its about.txt (70 words at most)
const about = (cur) => {
  const [, name, from, to] = ERAS.find((e) => e[0] === cur), text = readFileSync(path.join(here, 'eras', cur, 'about.txt'), 'utf8').trim().replace(/\s+/g, ' ');
  if (text.split(' ').length > 70) throw new Error(`eras/${cur}/about.txt: ${text.split(' ').length} words, 70 at most`);
  return `<h2>${name}</h2><p>${when(from, to)}</p><p>${esc(text)}</p>`;
};

for (const [id] of ERAS.filter((e) => built.includes(e[0]))) {
  const dir = path.join(here, 'eras', id), era = readdirSync(dir).filter((f) => f.endsWith('.js')).sort();
  const files = [...LIB.map((f) => path.join(here, 'engine', f)), ...era.map((f) => path.join(dir, f)), ...RUN.map((f) => path.join(here, 'engine', f))];
  let js = files.map((f) => readFileSync(f, 'utf8')).join('\n');
  // the page around the scene, with the menu of this era
  const tpl = shell.replace('<!--ERAS-->', () => timeline(id)).replace('<!--ERA-->', () => about(id)).replace('<title>Historic Ocean</title>', () => `<title>Historic Ocean${id === 'today' ? '' : ' · ' + ERAS.find((e) => e[0] === id)[1]}</title>`);
  let html;
  if (readable) {
    html = tpl.replace('/*SCRIPT*/', () => wrap(js));
  } else {
    // shrink the WGSL, then minify the JS and the page's CSS
    js = js.replace(/\/\*wgsl\*\/`([^`]*)`/g, (_, w) => '`' + minWgsl(w) + '`');
    const code = transformSync(wrap(js), { minify: true, target: 'es2022', legalComments: 'none' }).code.trim();
    const css = (_, s) => '<style>' + transformSync(s, { loader: 'css', minify: true }).code.trim();
    html = tpl.replace(/<style>([^]*?)(?=<\/style>)/, css).replace(/>\s+</g, '><').replace('/*SCRIPT*/', () => code).replace(/<script>\s+/, '<script>').replace(/\s+<\/script>/, '</script>');
  }
  const out = page(id);
  writeFileSync(path.join(here, '..', out), html);
  const gz = gzipSync(Buffer.from(html), { level: 9 }).length;
  console.log(`${out}: ${(html.length / 1024).toFixed(1)} kB${readable ? ' (readable)' : ''}, ${(gz / 1024).toFixed(1)} kB gzipped`);
}
