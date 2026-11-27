// A close render of every exhibit of an era, with its hint, and of its open card: the pictures for the visual critic
// when an era gets new animals, plants or set pieces. The scene time is frozen, so the pictures can be repeated.
//   node tools/kinds.mjs [era] [name] [--time <seconds>]
// THIS RENDERS THE 3D SCENE: it needs the graphics card. Look at `node tools/chrome.mjs status` first.
// era: default today. name: the label of this run, default the era. Needs `npm run build:dev` and a running test Chrome.
// Output: tools/out/kinds/<name>-<id>-hint.png and <name>-<id>-card.png
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { connect, sleep, outFile, here } from './cdp.mjs';
import { needCard } from './card.mjs';
import { harness, guardBuild } from './harness.mjs';

const args = process.argv.slice(2), opt = (n) => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
const plain = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] || '').startsWith('--')), era = plain[0] || 'today', name = plain[1] || era, time = +(opt('--time') || 20);
guardBuild(era);
await needCard();
const c = await connect();
await c.desktop();
if (args.includes('--mock')) await c.mock(); // only to try the tool itself: the pictures are empty
await c.open(harness(era)); await sleep(500); await c.loaded();
await c.w(readFileSync(path.join(here, 'inpage.js'), 'utf8'));
// into the scene as with a captured mouse, frame loop stopped, full resolution and full draw distance
await c.w(`ui(false); body.className = 'g p'; frame = () => {}; window.__T = ${time}; pix = PIXMAX; det = 1; dynT = -Infinity; resize(); 0`);
await sleep(2600);
console.log('canvas', await c.w("W + 'x' + H"));
const still = () => c.w('(async () => { render(); zoo(); zoo(); render(); await Q.onSubmittedWorkDone(); return 0; })()');
let missing = 0;
for (const { id, name: title } of await c.w('__z.kinds()')) {
  await c.w('zooOff(); 0');
  if (!(await c.w(`__z.aim(${JSON.stringify(id)})`))) { console.log(`${id}: no spot found from which it is what the player looks at`); missing++; continue; }
  await still(); await sleep(450);
  await c.shot(outFile('kinds', `${name}-${id}-hint.png`));
  await c.w('zooKey(); 0'); await still(); await sleep(450);
  await c.shot(outFile('kinds', `${name}-${id}-card.png`));
  console.log(`${id}: ${title}`);
}
const logs = c.news(); console.log(logs.length ? 'console:\n' + logs.join('\n') : 'console: no messages');
await c.done();
process.exit(missing ? 1 : 0);
