// Renders the six viewpoints of an era at 2560x1440 with the scene time frozen, and saves a checksum of every buffer
// the world generator made. Two runs of the same build differ by at most a pixel or two, so compare.mjs shows any
// real change, in the picture or in the world behind it.
//   node tools/poses.mjs [era] [name] [--page <test.html>] [--time <seconds>]
// THIS RENDERS THE 3D SCENE: it needs the graphics card. Look at `node tools/chrome.mjs status` first.
// era: default today. name: the label of this run, default the era. Needs `npm run build:dev` and a running test Chrome.
// --page: a test page that exists already, in place of the one made from the era's dev page (for a saved older state).
// Output: tools/out/poses/<name>-pose1.png ... -pose6.png and <name>-sums.json
import { writeFileSync } from 'node:fs';
import { connect, sleep, outFile } from './cdp.mjs';
import { needCard } from './card.mjs';
import { harness } from './harness.mjs';

const args = process.argv.slice(2), opt = (n) => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
const plain = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] || '').startsWith('--')), era = plain[0] || 'today', name = plain[1] || era, time = +(opt('--time') || 20);
await needCard();
const c = await connect();
await c.desktop();
if (args.includes('--mock')) await c.mock(); // only to try the tool itself: the pictures are empty
await c.open(opt('--page') || harness(era)); await sleep(500);
const t0 = Date.now(); await c.loaded();
console.log('loaded in', ((Date.now() - t0) / 1000).toFixed(1), 's');
writeFileSync(outFile('poses', name + '-sums.json'), JSON.stringify(await c.ev('window.__sums'), null, 1));
// into the scene as with a captured mouse, frame loop stopped, full resolution and full draw distance
await c.w("ui(false); body.className = 'g p'; frame = () => {}; 0");
await sleep(2600); // the menu's blur fades out
await c.w('pix = PIXMAX; det = 1; dynT = -Infinity; resize(); 0');
console.log('canvas', await c.w("W + 'x' + H"));
// the viewpoints are ERA.views (POSES in a page from before the eras)
const n = await c.w("window.__views = typeof ERA === 'undefined' ? POSES : ERA.views; __views.length");
// (the frame loop is stopped, so the zoo is asked after each jump: the hint names what this pose looks at, not what
// the one before it did)
for (let i = 0; i < n; i++) {
  await c.w(`F[TIME] = ${time}; lookAt(...__views[${i}]); render(); if (typeof zoo === 'function') zoo(); Q.onSubmittedWorkDone().then(() => 0)`);
  await c.w('render(); Q.onSubmittedWorkDone().then(() => 0)');
  await sleep(350);
  await c.shot(outFile('poses', `${name}-pose${i + 1}.png`));
  console.log('pose', i + 1);
}
const logs = c.news(); console.log(logs.length ? 'console:\n' + logs.join('\n') : 'console: no messages');
await c.done();
