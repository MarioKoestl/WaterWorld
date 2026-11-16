// Runs a built page with WebGPU hidden from it. Every file of the bundle is then read and run in order up to the
// title screen (the era's files, the shader strings, the zoo, the emblem, the timeline), and the page stops with its
// own "needs WebGPU" message. A quick check after any change that a page still starts, also for the minified pages,
// which no other tool here runs. No graphics card needed.
//   node tools/nogpu.mjs [page.html ...]      default: every page that build.mjs writes for the built eras
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { connect, sleep, checker, ROOT, outFile, fileUrl } from './cdp.mjs';

const eras = readdirSync(path.join(ROOT, 'source', 'eras'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const pages = process.argv.slice(2).length ? process.argv.slice(2) : eras.flatMap((id) => (id === 'today' ? ['index.html', 'dev.html'] : [id + '.html', id + '-dev.html'])).map((f) => path.join(ROOT, f));
const c = await connect(), ok = checker();
await c.desktop();
await c.before("Object.defineProperty(Navigator.prototype, 'gpu', { get: () => undefined });");
for (const page of pages) {
  const name = path.basename(page);
  const from = c.news().length;
  await c.nav(fileUrl(page)); await c.arrived(name); await sleep(1200);
  const r = JSON.parse(await c.ev(`JSON.stringify({ cls: document.body.className, msg: document.getElementById('s').textContent, edge: (document.getElementById('f').getAttribute('d') || '').length,
    icon: !!document.querySelector('link[rel=icon]'), eras: document.querySelectorAll('nav > *').length, lit: document.querySelectorAll('nav b').length, zoo: getComputedStyle(document.getElementById('n')).visibility + getComputedStyle(document.getElementById('z')).visibility })`));
  const logs = c.news().slice(from).filter((l) => !l.includes('needs WebGPU'));
  ok(`${name}: runs up to its title screen`, r.cls === 'l e' && /needs WebGPU/.test(r.msg) && r.edge > 100 && r.icon && r.eras > 0 && r.lit === 1 && r.zoo === 'hiddenhidden' && !logs.length,
    logs.length ? logs.join(' | ').slice(0, 300) : `${r.eras} eras in the timeline, message "${r.msg}"`);
  await c.shot(outFile('nogpu', name.replace('.html', '.png')));
}
const fails = ok.done();
await c.done();
process.exit(fails ? 1 : 0);
