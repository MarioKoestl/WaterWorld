// Makes a test page from a built dev page: the same page plus
//   window.__w(code)   runs code inside the bundle's own scope, so a test can read and set anything
//   window.__sums      a checksum of every buffer the world generator made (stores, kinds, zoo movers)
//   window.__ground    with { ground: true } only: the terrain as it is drawn (its vertices wp, its triangles ib, sorted
//                      by culling cell from start), which the page frees after loading
// The sources stay untouched, and the test page is written to tools/out, which Git ignores.
//   node tools/harness.mjs [era]        era: the id of the era, default today. Needs `npm run build:dev` first
// As a module: harness(era) returns the path of the test page.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, outFile, PORT } from './cdp.mjs';

const SUM = `const __sum = (o, p = '', out = {}) => {
  if (!o || typeof o !== 'object') return out;
  if (Array.isArray(o) && typeof o[0] === 'number') o = new Float64Array(o);
  if (ArrayBuffer.isView(o) || o instanceof ArrayBuffer) { const b = o instanceof ArrayBuffer ? new Uint8Array(o) : new Uint8Array(o.buffer, o.byteOffset, o.byteLength); let x = 2166136261; for (let i = 0; i < b.length; i++) { x ^= b[i]; x = Math.imul(x, 16777619); } out[p] = b.length + ':' + (x >>> 0).toString(16); return out; }
  for (const k of Object.keys(o)) __sum(o[k], p + '/' + k, out);
  return out;
};
const __world = (Wd) => ({ big: Wd.big, bigF: Wd.bigF, small: Wd.small, glints: Wd.glints, bubbles: Wd.bubbles, volD: Wd.volD, gm: Wd.gm, snow: Wd.snow, zoo: Wd.zoo,
  kinds: KINDS.map((k) => (k.solid ? { data: k.data, start: k.start, lo: k.lo, hi: k.hi } : { data: k.data })), movers: ZA.map((o) => o.list) });
`;

// published: the code of the published page instead (index.html, <id>.html): the dev page without what engine/dev.js
// adds at its end, which is what build.mjs writes for a published page, only not minified. For checks of what only
// the dev pages have (the keys F, B and 1 to 6). ground: keep the drawn terrain (window.__ground), for checks against
// the ground as it is drawn (ways.mjs)
export function harness(era = 'today', { published = false, ground = false } = {}) {
  // (a run on a second test Chrome, see chrome.mjs, gets a test page of its own)
  const src = path.join(ROOT, era === 'today' ? 'dev.html' : era + '-dev.html'), out = outFile(era + (PORT === 9334 ? '' : '-' + PORT) + (published ? '-published' : '') + (ground ? '-ground' : '') + '-test.html');
  let h = readFileSync(src, 'utf8');
  const open = '(async()=>{', mark = 'const Wd = tools.finish();', close = '\n})().catch(e=>{';
  if (!h.includes(open) || h.split(mark).length !== 2 || h.lastIndexOf(close) < 0) throw new Error(src + ' is not a dev page of this layout: run `npm run build:dev` in source/');
  h = h.replace(open, () => open + SUM).replace(mark, () => mark + ' window.__sums = __sum(__world(Wd));' + (ground ? ' window.__ground = { wp: T.wp, ib: T.ib, start: T.start };' : ''));
  let i = h.lastIndexOf(close);
  if (published) {
    const d = h.lastIndexOf('// development tools: only in dev.html'), a = h.lastIndexOf('// ====', d);
    if (d < 0 || a < 0 || d - a > 100) throw new Error('the part of engine/dev.js was not found in ' + src);
    h = h.slice(0, a) + h.slice(i); i = a;
  }
  writeFileSync(out, h.slice(0, i) + '\nwindow.__w = (s) => eval(s);' + h.slice(i));
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(harness(process.argv[2]));
