// The timeline of the title menu, on the page of every era that is built: all eras in order with their dates, the
// era of the page lit, the built ones as links, the others dimmed and not to be chosen, and every link followed there
// and back. WebGPU is hidden from the pages, so they stop at their title screen: no graphics card needed.
//   node tools/timeline.mjs        Needs `npm run build` and a running test Chrome
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { connect, sleep, checker, ROOT } from './cdp.mjs';
import ERAS from '../source/eras.mjs';

const built = readdirSync(path.join(ROOT, 'source', 'eras'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const page = (id) => (id === 'today' ? 'index' : id) + '.html', r = Math.round;
const when = (from, to) => (to ? `${r(from)} to ${r(to)} million years ago` : `the last ${r(from)} million years`);
const c = await connect(), ok = checker();
await c.desktop();
await c.before("Object.defineProperty(Navigator.prototype, 'gpu', { get: () => undefined });");
const menu = () => c.ev(`JSON.stringify((() => { const n = [...document.querySelector('nav').children], t = (e) => e.querySelector('i').firstChild.textContent; return {
  file: location.pathname.split('/').pop(), title: document.title, names: n.map(t), dates: n.map((e) => e.querySelector('small').textContent), lit: n.filter((e) => e.tagName === 'B').map(t),
  links: [...document.querySelectorAll('nav a')].map((a) => t(a) + '>' + a.getAttribute('href')), dimmed: n.filter((e) => e.tagName === 'SPAN').length, canFocus: n.filter((e) => e.tabIndex >= 0).map((e) => e.tagName).join(''),
  h2: document.querySelector('section h2').textContent, when: document.querySelector('section p').textContent, words: document.querySelector('section p + p').textContent.trim().split(/\\s+/).length,
  inView: (() => { const b = document.querySelector('nav b').getBoundingClientRect(), v = document.querySelector('nav').getBoundingClientRect(); return b.left >= v.left - 1 && b.right <= v.right + 1; })() }; })())`).then(JSON.parse);
const into = async (sel) => JSON.parse(await c.ev(`JSON.stringify((() => { const e = document.querySelector(${JSON.stringify(sel)}); e.scrollIntoView({ inline: 'center', block: 'nearest' }); const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; })())`));

for (const [id, name, from, to] of ERAS.filter((e) => built.includes(e[0]))) {
  console.log(`--- ${page(id)}`);
  await c.nav('file:///' + path.join(ROOT, page(id)).replace(/\\/g, '/')); await c.arrived(page(id)); await sleep(500);
  const m = await menu(), others = ERAS.filter((e) => built.includes(e[0]) && e[0] !== id);
  ok('all eras in order', JSON.stringify(m.names) === JSON.stringify(ERAS.map((e) => e[1])), m.names.length + ' entries');
  ok('each with its dates in whole millions, the open one in full', ERAS.every((e, i) => m.dates[i] === (e[0] === id ? when(e[2], e[3]) : `${r(e[2])} to ${e[3] ? r(e[3]) : 'now'}`)), m.dates[ERAS.findIndex((e) => e[0] === id)]);
  ok(`${name} is lit and in view`, m.lit.length === 1 && m.lit[0] === name && m.inView);
  ok('the other built eras are links to their pages', JSON.stringify(m.links) === JSON.stringify(others.map((e) => e[1] + '>' + page(e[0]))), m.links.join(', ') || 'none built');
  ok('the rest is dimmed, and only links take the keyboard focus', m.dimmed === ERAS.length - 1 - others.length && m.canFocus === 'A'.repeat(others.length), m.dimmed + ' dimmed');
  ok('under it the name, the dates and at most 70 words about the era', m.h2 === name && m.when === when(from, to) && m.words <= 70 && m.words > 10, `${m.h2} · ${m.when} · ${m.words} words`);
  ok('the title of the tab', m.title === 'Historic Ocean' + (id === 'today' ? '' : ' · ' + name), m.title);
  if (m.dimmed) {
    const here = await c.ev('location.href');
    await c.click(...await into('nav span')); await sleep(400);
    ok('a click on a dimmed era does nothing', (await c.ev('location.href')) === here);
  }
  for (let i = 0; i < others.length; i++) {
    const [oid, oname] = others[i];
    await c.click(...await into(`nav a[href="${page(oid)}"]`));
    if (!ok(`a click on ${oname} opens ${page(oid)}`, await c.arrived(page(oid)))) continue;
    await sleep(400);
    ok(`there ${oname} is lit`, (await menu()).lit[0] === oname);
    // back by keyboard: the link of this era, Enter
    await c.ev(`document.querySelector('nav a[href="${page(id)}"]').focus()`);
    await c.send('Input.dispatchKeyEvent', { type: 'keyDown', code: 'Enter', key: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13, text: '\r' });
    await c.send('Input.dispatchKeyEvent', { type: 'keyUp', code: 'Enter', key: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 });
    ok(`Enter on its link to ${name} leads back`, await c.arrived(page(id))); await sleep(300);
  }
}
const logs = c.news().filter((l) => !l.includes('needs WebGPU'));
ok('no console messages besides the expected "needs WebGPU"', logs.length === 0, logs.join(' | ').slice(0, 300));
const fails = ok.done();
await c.done();
process.exit(fails ? 1 : 0);
