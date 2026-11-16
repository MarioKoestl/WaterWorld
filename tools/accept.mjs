// Acceptance run of one era's page with real key presses, mouse moves and clicks: loading, menu, the keys, the zoo
// hint and card of every exhibit of the era, the card's rules, the dev keys, the console.
//   node tools/accept.mjs [era] [--mock]
// era: the id of the era, default today. Needs `npm run build:dev` and a running test Chrome (chrome.mjs start).
// --mock: with the stand-in for WebGPU. Then no graphics card is needed and nothing is drawn, but all of the page's
// JavaScript runs, on a made-up sea floor. Without it the page runs for real: check `chrome.mjs status` first.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { connect, sleep, checker, here } from './cdp.mjs';
import { harness } from './harness.mjs';

const args = process.argv.slice(2), era = args.find((a) => !a.startsWith('--')) || 'today', mock = args.includes('--mock');
const c = await connect(), ok = checker();
const vis = () => c.ev("JSON.stringify(['n', 'z'].map((i) => { const s = getComputedStyle(document.getElementById(i)); return s.visibility + '/' + s.opacity; }))");
const st = async () => JSON.parse(await c.w('JSON.stringify(__z.state())'));
const frames = async (n = 4, settle = 0) => { const a = await c.ev('window.__n'), t0 = Date.now(); while ((await c.ev('window.__n')) < a + n) { if (Date.now() - t0 > 8000) throw new Error('the page draws no frames'); await sleep(20); } if (settle) await sleep(settle); };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
// Reads something from the page again and again until it is what is asked for, two seconds at most, and returns the
// last thing read. Hint and card fade in and out in a quarter of a second, and a late frame delays that: a look after
// a fixed time sees them half way now and then. What never comes still fails
const until = async (read, want, ms = 2000) => { const t0 = Date.now(); for (;;) { const v = await read(); if (want(v) || Date.now() - t0 > ms) return v; await sleep(50); } };
const aim = (id, pin = false) => c.w(`__z.aim(${JSON.stringify(id)}, ${pin})`);

await c.desktop();
if (mock) await c.mock();
await c.open(harness(era));
// nothing of the zoo is visible while loading and behind the menu
await sleep(1500);
ok('loading: hint and card hidden', (await c.ev('document.body.className')) === 'l' && (await vis()) === '["hidden/0","hidden/0"]', await vis());
await c.loaded(); await sleep(600);
ok('menu: hint and card hidden', (await vis()) === '["hidden/0","hidden/0"]');
ok('the menu lists the key of the zoo', await c.ev("document.getElementById('k').textContent.includes('Space')"));
await c.w(readFileSync(path.join(here, 'inpage.js'), 'utf8'));
const views = await c.w('ERA.views.map((v) => v.slice(0, 3))');
// behind the menu the keys do nothing (Space on the focused Dive button would press it: take the focus away)
await c.ev('document.activeElement.blur()');
await c.key('Space'); await c.key('Digit3'); await sleep(200);
let s = await st();
ok('behind the menu Space and 1-6 do nothing', s.menu && s.card === null && dist(s.cam, views[0]) < 0.01);

// into the scene with a real click on the button
await c.click(...await c.mid('#d')); await sleep(1500);
s = await st();
ok('Dive in enters the scene', s.cls.startsWith('g') && !s.menu, 'body class "' + s.cls + '", mouse captured: ' + s.lock);
const locked = s.lock;
await c.w('dynT = -Infinity; 0'); // keep the resolution fixed during the run

// the keys
await c.key('Digit2'); await sleep(250); s = await st();
ok('2 jumps to viewpoint 2', dist(s.cam, views[1]) < 0.3);
await c.key('Digit1'); await sleep(250);
const fwd = await c.w('[F[FX], F[FY], F[FZ]]'), right = await c.w('[F[RX], 0, F[RZ]]');
const move = async (code, shift = false) => {
  await c.key('Digit1'); await sleep(900); const a = (await st()).cam;
  if (shift) await c.keyDown('ShiftLeft');
  await c.keyDown(code); await sleep(500); await c.keyUp(code);
  if (shift) await c.keyUp('ShiftLeft');
  await sleep(60); const b = (await st()).cam; return [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
};
let d = await move('KeyW'); const dW = dot(d, fwd); ok('W swims forward', dW > 0.5, dW.toFixed(2) + ' m');
d = await move('KeyS'); ok('S swims back', dot(d, fwd) < -0.5, dot(d, fwd).toFixed(2) + ' m');
d = await move('KeyD'); ok('D swims right', dot(d, right) > 0.5, dot(d, right).toFixed(2) + ' m');
d = await move('KeyA'); ok('A swims left', dot(d, right) < -0.5, dot(d, right).toFixed(2) + ' m');
d = await move('KeyE'); ok('E swims up', d[1] > 0.5, d[1].toFixed(2) + ' m');
d = await move('KeyQ'); ok('Q swims down or is stopped by the floor', d[1] < 0.01, d[1].toFixed(2) + ' m');
d = await move('KeyW', true); ok('Shift is faster', dot(d, fwd) > dW * 1.8, dot(d, fwd).toFixed(2) + ' m against ' + dW.toFixed(2) + ' m');
await c.key('KeyH'); await sleep(900); s = await st(); ok('H shows the stats', s.hud && /fps/.test(s.info), s.info.slice(0, 40));
await c.key('KeyH'); await sleep(200); s = await st(); ok('H hides them again', !s.hud && s.info === '');
await c.key('KeyM'); await sleep(100); s = await st(); ok('M mutes', s.muted === true);
await c.key('KeyM'); await sleep(100); s = await st(); ok('M unmutes', s.muted === false);
// mouse look (where this Chrome does not capture the mouse, the capture is stood in for)
if (!locked) await c.ev("Object.defineProperty(document, 'pointerLockElement', { get: () => document.getElementById('c'), configurable: true }); 0");
await c.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 600, y: 500 }); await sleep(600);
await c.key('Digit1'); await sleep(300);
// the same place once more: the move below then counts from here, whatever became of the first event on a busy machine
await c.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 600, y: 500 }); await sleep(400);
const y0 = (await st()).yaw;
await c.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 760, y: 500 }); await sleep(600);
s = await st(); ok('the mouse turns the view', s.yaw - y0 > 0.2, (s.yaw - y0).toFixed(3) + ' rad');

// the zoo: every exhibit of this era
const ZOO = JSON.parse(await c.w('JSON.stringify(ZOO)')), kinds = await c.w('__z.kinds()');
ok('every entry of ZOO is somewhere in the world', kinds.length === Object.keys(ZOO).length, kinds.length + ' of ' + Object.keys(ZOO).length + (kinds.length < Object.keys(ZOO).length ? ', missing: ' + Object.keys(ZOO).filter((i) => !kinds.some((k) => k.id === i)).join(' ') : ''));
await c.w('window.__T = F[TIME]; 0'); // the animals hold still while each exhibit is tried
const seen = [];
for (const { id, name } of kinds) {
  let found = await aim(id), again = ''; await frames(4); s = await until(st, (s) => s.hint === name);
  // on a busy machine the first try has failed once without a cause that could be found: one more, and say so
  if (found && s.hint !== name) { again = ' (second try, the first one named ' + s.hint + ')'; found = await aim(id); await frames(4); s = await until(st, (s) => s.hint === name); }
  let v = await until(vis, (v) => v.startsWith('["visible/1'));
  if (!ok(`${id}: close and looking at it, the hint names it`, found && s.hint === name && v.startsWith('["visible/1'), found ? 'hint: ' + s.hint + again : 'no spot found from which it is what the player looks at')) continue;
  seen.push(id);
  await c.key('Space'); await frames(4); v = await until(vis, (v) => v === '["hidden/0","visible/1"]'); s = await st();
  ok(`${id}: Space opens the card, texts as in ZOO`, s.card === id && s.cardShown && JSON.stringify(await c.w('__z.cardText()')) === JSON.stringify(ZOO[id]) && v === '["hidden/0","visible/1"]', v);
  await c.key('Space'); await frames(4); v = await until(vis, (v) => v === '["visible/1","hidden/0"]'); s = await st();
  ok(`${id}: Space closes it`, s.card === null && !s.cardShown && v === '["visible/1","hidden/0"]', v);
  const turned = await c.w(`__z.away(${JSON.stringify(id)})`); await frames(); s = await st();
  const gone = await c.w(`__z.leave(${JSON.stringify(id)})`); await frames();
  ok(`${id}: the hint goes when looking away and when far away`, turned && s.kind !== id && gone && (await st()).kind !== id);
}
if (seen.length) {
  // a left click does what Space does
  await aim(seen[0]); await frames(4, 300);
  await c.click(1280, 720); await frames(4, 300); s = await st(); ok('a left click opens the card', s.card === seen[0] && s.cardShown);
  await c.click(1280, 720); await frames(4, 300); s = await st(); ok('a left click closes it', s.card === null && !s.cardShown);
}
if (seen.length > 1) {
  // another card takes the place of the open one: never two
  await aim(seen[0]); await frames(); await c.key('Space'); await frames();
  await aim(seen[1], true); await frames(); s = await st();
  ok('with a card open the hint names the next exhibit', s.card === seen[0] && s.hint === ZOO[seen[1]].name, `card ${s.card}, hint ${s.hint}`);
  await c.key('Space'); await frames(); s = await st();
  ok('Space swaps the card', s.card === seen[1] && (await c.w('__z.cardText()')).name === ZOO[seen[1]].name && (await c.ev("document.querySelectorAll('#z').length")) === 1);
  // it closes 15 m from where it was opened
  const dir = await c.w('__z.open()');
  if (ok('open water to test the 15 m rule in', !!dir)) {
    const o0 = (await st()).cam;
    await c.w(`F[CX] += 14.5 * ${dir[0]}; F[CZ] += 14.5 * ${dir[1]}; F[VX] = F[VY] = F[VZ] = 0; 0`); await frames(); s = await st(); const near = s.card, dn = dist(s.cam, o0);
    await c.w(`F[CX] += ${dir[0]}; F[CZ] += ${dir[1]}; 0`); await frames(); s = await st();
    ok('the card stays within 15 m and closes beyond', near === seen[1] && s.card === null && !s.cardShown, `${dn.toFixed(1)} m: ${near}, ${dist(s.cam, o0).toFixed(1)} m: ${s.card}`);
  }
}
const mover = kinds.find((k) => k.moves && seen.includes(k.id));
if (mover) {
  // the card of an animal stays open while the animal swims on
  await aim(mover.id); await frames(); await c.key('Space'); await frames(); const opened = (await st()).card;
  await c.w('window.__T += 25; 0'); await frames(6); s = await st();
  ok('the card of an animal stays open when it has swum on', opened === mover.id && s.card === mover.id && s.cardShown, 'now looking at: ' + s.kind);
}
// the menu closes the card, and nothing shows behind it
if (seen.length) { await aim(seen[0]); await frames(); if ((await st()).card === null) { await c.key('Space'); await frames(); } }
await c.key('Escape'); await frames(4, 100); s = await st();
ok('Esc opens the menu and closes the card', s.cls === 'm' && s.card === null && !s.cardShown && s.hint === null && (await vis()) === '["hidden/0","hidden/0"]', await vis());
await c.w('ui(false); 0'); await frames();
if (seen.length) { await aim(seen[0]); await frames(); s = await st(); ok('back in the scene the hint returns', s.hint === ZOO[seen[0]].name); }
await c.w('window.__T = undefined; 0');

// the dev keys
await c.key('KeyF'); await sleep(700); let f1 = +(await c.w('F[FLT]'));
ok('F starts the fly-through', f1 > 0.3, 'flight time ' + f1.toFixed(2) + ' s');
await c.key('KeyF'); await sleep(300); f1 = +(await c.w('F[FLT]')); await sleep(300);
ok('F stops it', +(await c.w('F[FLT]')) === f1);
await c.key('KeyB'); await sleep(700);
ok('B starts the benchmark', +(await c.w('F[FLT]')) > 0.3 && (await c.w('dynT === -Infinity')) === true);
await c.key('KeyB'); await sleep(200);

const logs = c.news();
ok('no console messages', logs.length === 0, logs.join(' | ').slice(0, 400));
console.log('longest gap between two frames during the run: ' + (await c.ev('window.__gap')).toFixed(0) + ' ms');
const fails = ok.done();
await c.done();
process.exit(fails ? 1 : 0);
