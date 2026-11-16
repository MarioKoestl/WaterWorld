// The benchmark of an era: the 60 s fly-through of its dev page (key B) at full resolution, with the report the page
// shows at the end: average, 99th percentile and maximum of the frame time and of the GPU time.
//   node tools/bench.mjs [era] [--card] [--page <test.html>]
// THIS RENDERS THE 3D SCENE FOR A MINUTE: it needs the graphics card to itself. Look at `node tools/chrome.mjs status`
// first: numbers taken while something else uses the card are worthless.
// era: default today. Needs `npm run build:dev` and a running test Chrome.
// --card: with the zoo card of the first exhibit open during the whole flight.
// --page: a test page that exists already (a saved older state), in place of the one made from the era's dev page.
// The page of the test Chrome is 2560x1440. The resolution and the draw distance are set to full before the flight,
// because the page would have lowered them on a card that cannot hold 60 frames per second there. The limits of the
// performance gate are in prompt.txt, for the hardware named there.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { connect, sleep, here } from './cdp.mjs';
import { needCard } from './card.mjs';
import { harness } from './harness.mjs';

const args = process.argv.slice(2), opt = (n) => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
const era = args.find((a, i) => !a.startsWith('--') && !(args[i - 1] || '').startsWith('--')) || 'today';
await needCard();
const c = await connect();
await c.desktop();
if (args.includes('--mock')) await c.mock(); // only to try the tool itself: the times mean nothing
await c.open(opt('--page') || harness(era)); await sleep(500); await c.loaded(); await sleep(600);
await c.click(...await c.mid('#d')); await sleep(3000);
// dynT keeps the page from lowering the resolution again in the moment before the flight starts (set after resize(),
// which starts the page's own measuring anew)
await c.w('pix = PIXMAX; det = 1; resize(); dynT = -Infinity; 0'); await sleep(1500);
if (args.includes('--card')) {
  await c.w(readFileSync(path.join(here, 'inpage.js'), 'utf8'));
  const id = (await c.w('__z.kinds()'))[0].id;
  if (!(await c.w(`__z.aim(${JSON.stringify(id)})`))) throw new Error('no exhibit to open a card for');
  await sleep(300); await c.key('Space'); await sleep(500);
  console.log('card open: ' + await c.w("zCard < 0 ? 'none' : ZOO[ZK[zCard]].name"));
}
await c.key('KeyB');
let text = '';
for (const t0 = Date.now(); Date.now() - t0 < 80e3 && !text.startsWith('Fly-through');) { await sleep(1000); text = await c.ev("document.getElementById('i').textContent"); }
console.log(text.startsWith('Fly-through') ? text : 'the benchmark did not finish within 80 s');
if (args.includes('--card')) console.log('card still open at the end: ' + await c.w("zCard < 0 ? 'no' : 'yes'"));
const logs = c.news(); if (logs.length) console.log('console:\n' + logs.join('\n'));
await c.done();
