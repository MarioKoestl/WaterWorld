// Pictures of the title menu of one era's page in the windows of a computer, without its 3D scene: the page as build.mjs wrote
// it (timeline, era text), but in place of the bundle only the few lines of main.js that touch the menu (emblem, tab
// icon, scrolling the timeline). No graphics card needed. It also says for each size whether everything fits.
//   node tools/menu.mjs [era] [--still <png>] [--sizes 2560,low]
// era: default today. Needs `npm run build:dev` and a running test Chrome. Pictures go to tools/out/menu/.
// --still: a render to stand in for the live scene behind the menu (the page's own CSS blurs it). Without it the
// background is the page's plain gradient.
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { connect, sleep, ROOT, outFile, fileUrl } from './cdp.mjs';

const args = process.argv.slice(2), opt = (n) => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
const era = args.find((a, i) => !a.startsWith('--') && !(args[i - 1] || '').startsWith('--')) || 'today', still = opt('--still'), only = opt('--sizes');
const html = readFileSync(path.join(ROOT, era === 'today' ? 'dev.html' : era + '-dev.html'), 'utf8'), main = readFileSync(path.join(ROOT, 'source', 'engine', 'main.js'), 'utf8');
const a = main.indexOf('// The ammonite on the title screen'), tail = "scrollIntoView({ inline: 'center', block: 'nearest' });", b = main.indexOf(tail, a);
if (a < 0 || b < 0) throw new Error('the menu code of engine/main.js was not found: has it been moved?');
if (still) copyFileSync(still, outFile('menu', 'still.png'));
const js = `
const $ = (id) => document.getElementById(id), { sin, cos, PI, pow } = Math, TAU = PI * 2;
const state = new URLSearchParams(location.search).get('s') || 'm';
document.body.className = state;
${main.slice(a, b)}${tail}
${still ? "const im = new Image(); im.onload = () => { const c = $('c'); c.width = im.width; c.height = im.height; c.getContext('2d').drawImage(im, 0, 0); document.title += ' ready'; }; im.src = 'still.png';" : "document.title += ' ready';"}
if (state === 'l') { $('b').style.transform = 'scaleX(.62)'; $('s').textContent = 'Building the world…'; } else $('d').focus();
`;
const file = outFile('menu', era + '.html');
writeFileSync(file, html.slice(0, html.indexOf('<script>') + 8) + js + html.slice(html.lastIndexOf('</script>')));

const c = await connect();
let bad = 0;
const shot = async (label, w, h, state) => {
  await c.desktop(); await c.size(w, h);
  await c.nav(fileUrl(file) + '?s=' + state);
  for (let i = 0; i < 100 && !(await c.ev('document.title')).endsWith('ready'); i++) await sleep(50);
  await sleep(state === 'l' ? 500 : 900);
  await c.shot(outFile('menu', `${era}-${label}.png`));
  const r = JSON.parse(await c.ev(`JSON.stringify((() => {
    const q = (s) => document.querySelector(s).getBoundingClientRect(), h = q('header'), y = q('#y'), n = document.querySelector('nav'), s = q('section'), a = q('#a'), g = q(document.body.className === 'l' ? '#l' : '#g'), b = q('nav b'), v = n.getBoundingClientRect();
    return { top: Math.round(Math.min(h.top, y.top)), bottom: Math.round(Math.max(g.bottom, s.bottom)), win: innerHeight, winW: innerWidth, navW: n.scrollWidth, navShown: n.clientWidth, lit: b.left >= v.left - 1 && b.right <= v.right + 1, left: Math.round(Math.min(s.left, a.left, h.left)), right: Math.round(Math.max(s.right, a.right, h.right)), stacked: s.bottom <= a.top + 2 };
  })())`));
  const fits = r.top >= 0 && r.bottom <= r.win && r.left >= 0 && r.right <= r.winW;
  if (!fits || !r.lit) bad++;
  console.log(`${label}: content ${r.top}..${r.bottom} of ${r.win} px high, ${r.left}..${r.right} of ${r.winW} px wide${fits ? '' : '  <-- DOES NOT FIT'}; timeline ${r.navW} px${r.navW > r.navShown ? ' (scrolls in ' + r.navShown + ')' : ''}, open era ${r.lit ? 'in view' : 'NOT IN VIEW'}${r.stacked ? ', era text above the buttons' : ''}`);
};
// label, width, height, state (m menu, l loading). The game is for a computer (docs/briefs/scope.md): a full window,
// with the menu and while loading, and a low one
const SIZES = [['2560', 2560, 1440, 'm'], ['loading', 2560, 1440, 'l'], ['low', 900, 460, 'm']];
for (const s of SIZES) if (!only || only.split(',').includes(s[0])) await shot(...s);
const logs = c.news(); if (logs.length) { console.log('console: ' + logs.join(' | ')); bad++; }
console.log(bad ? `\n${bad} PROBLEMS` : '\neverything fits');
await c.desktop(); await c.done();
process.exit(bad ? 1 : 0);
