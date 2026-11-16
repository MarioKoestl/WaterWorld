// Touch run of one era's page on an emulated phone held sideways (844x390, coarse pointer), with real touch events:
// the hint as the button that opens the card, a tap on the card to close it, swimming with one finger.
//   node tools/touch.mjs [era] [--mock]
// Needs `npm run build:dev` and a running test Chrome. --mock: with the stand-in for WebGPU, no graphics card needed.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { connect, sleep, checker, here } from './cdp.mjs';
import { harness } from './harness.mjs';

const args = process.argv.slice(2), era = args.find((a) => !a.startsWith('--')) || 'today', mock = args.includes('--mock');
const c = await connect(), ok = checker();
const frames = async (n = 4, settle = 0) => { const a = await c.ev('window.__n'), t0 = Date.now(); while ((await c.ev('window.__n')) < a + n) { if (Date.now() - t0 > 8000) throw new Error('the page draws no frames'); await sleep(20); } if (settle) await sleep(settle); };
const st = async () => ({ ...JSON.parse(await c.w('JSON.stringify(__z.state())')), hintText: await c.ev("document.getElementById('n').className === 'on' ? document.getElementById('n').innerText : ''"), cardText: await c.ev("document.getElementById('z').className === 'on' ? document.getElementById('z').innerText : ''") });
const aim = (id, pin = false) => c.w(`__z.aim(${JSON.stringify(id)}, ${pin})`);

await c.phone(844, 390);
if (mock) await c.mock();
await c.open(harness(era)); await sleep(500); await c.loaded(); await sleep(600);
await c.w(readFileSync(path.join(here, 'inpage.js'), 'utf8'));
ok('the page takes the device for a touch device', (await c.w('mob')) === true);
await c.tap(...await c.mid('#d')); await sleep(1200);
let s = await st();
ok('a tap on Dive in enters the scene', s.cls === 'g', 'body class "' + s.cls + '"');
await c.w('dynT = -Infinity; window.__T = F[TIME]; 0');
const ZOO = JSON.parse(await c.w('JSON.stringify(ZOO)')), kinds = await c.w('__z.kinds()'), seen = [];
for (const k of kinds) { if (seen.length > 1) break; if (await aim(k.id)) seen.push(k.id); }
// an era with nothing to read about yet has no hint and no card to try
if (Object.keys(ZOO).length < 2) console.log('SKIP  hint and card by touch: this era has fewer than two exhibits');
else if (ok('two exhibits to try it on', seen.length > 1, seen.join(', '))) {
  const [A, B] = seen, up = (id) => ZOO[id].name.toUpperCase();
  await aim(A); await frames(4, 350); s = await st();
  ok('the hint says to tap', s.hintText.toUpperCase().includes(up(A)) && /TAP TO READ/i.test(s.hintText) && !/SPACE/i.test(s.hintText), JSON.stringify(s.hintText));
  const hr = await c.rect('#n');
  ok('the hint is large enough for a finger', hr.height >= 40, Math.round(hr.width) + 'x' + Math.round(hr.height) + ' px');
  await c.tap(...await c.mid('#n')); await frames(4, 350); s = await st();
  ok('a tap on the hint opens the card', s.card === A && /TAP TO CLOSE/i.test(s.cardText) && !/SPACE/i.test(s.cardText), s.cardText.split('\n').pop());
  const zr = await c.rect('#z');
  ok('the card fits the screen', zr.top >= 0 && zr.left >= 0 && zr.right <= 844 && zr.bottom <= 390, `top ${Math.round(zr.top)} bottom ${Math.round(zr.bottom)} left ${Math.round(zr.left)} right ${Math.round(zr.right)}`);
  // the hint for another exhibit beside the open card must not lie on it
  await aim(B, true); await frames(4, 350); s = await st();
  const h2 = await c.rect('#n'), z2 = await c.rect('#z');
  ok('card and the hint for the next exhibit do not overlap', s.card === A && s.hintText.toUpperCase().includes(up(B)) && (h2.top >= z2.bottom || h2.left >= z2.right), `hint top ${Math.round(h2.top)}, card bottom ${Math.round(z2.bottom)}`);
  await c.tap(...await c.mid('#n')); await frames(4, 350); s = await st();
  ok('a tap on that hint swaps the card', s.card === B && s.cardText.toUpperCase().startsWith(up(B)));
  await c.tap(...await c.mid('#z')); await frames(4, 350); s = await st();
  ok('a tap on the card closes it', s.card === null && s.cardText === '');
  // A slow tap: the finger stays down longer than the hint or the card takes to go. What follows the tap must not
  // reach the scene behind, where it would close the card again, open it again or capture the mouse
  const slow = async (sel) => { const p = await c.mid(sel); await c.touchDown([{ x: p[0], y: p[1], id: 1 }]); await sleep(450); await c.touchUp(); await frames(4, 350); };
  await aim(A); await frames(4, 350);
  await slow('#n'); s = await st();
  ok('a slow tap on the hint opens the card, and it stays open', s.card === A && s.cls === 'g', `card ${s.card}, body class "${s.cls}"`);
  await slow('#z'); s = await st();
  ok('a slow tap on the card closes it, and it stays closed', s.card === null && s.cls === 'g', `card ${s.card}, body class "${s.cls}"`);
  // a second finger taps the hint while the first one keeps swimming
  await aim(A); await frames(4, 350);
  const h3 = await c.mid('#n');
  await c.touchDown([{ x: 300, y: 150, id: 1 }]); await sleep(120);
  await c.touchDown([{ x: 300, y: 150, id: 1 }, { x: h3[0], y: h3[1], id: 2 }]); await sleep(60);
  await c.touchMove([{ x: 300, y: 150, id: 1 }]); await frames(3); s = await st();
  await c.touchUp(); await frames(3);
  ok('a second finger can tap the hint while the first one swims', s.card === A);
  await c.tap(...await c.mid('#z')); await frames();
}
// swimming: one finger held on the scene
await c.w('lookAt(...ERA.views[0]); F[VX] = F[VY] = F[VZ] = 0; 0'); await frames();
const a = (await st()).cam, f = await c.w('[F[FX], F[FY], F[FZ]]');
await c.touchDown([{ x: 300, y: 150, id: 1 }]); await sleep(700); await c.touchUp(); await sleep(60);
const b = (await st()).cam, d = (b[0] - a[0]) * f[0] + (b[1] - a[1]) * f[1] + (b[2] - a[2]) * f[2];
ok('holding a finger on the scene swims forward', d > 1, d.toFixed(2) + ' m');
await c.tap(...await c.mid('#o')); await sleep(400);
ok('a tap on the corner button opens the menu', (await st()).cls === 'm');
const logs = c.news();
ok('no console messages', logs.length === 0, logs.join(' | ').slice(0, 400));
const fails = ok.done();
await c.desktop(); await c.done();
process.exit(fails ? 1 : 0);
