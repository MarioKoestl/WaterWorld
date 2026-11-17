// Acceptance run of one era's page with real key presses, mouse moves and clicks: loading, menu, the keys, the zoo
// hint and card of every exhibit of the era, the card's rules, the dev keys, the console. First a short run of the
// published page (see harness.mjs): it starts at the first test pose, and the keys 1 to 6 of the dev pages do nothing.
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
// the published page: it starts at the first test pose, its menu does not name the keys 1 to 6, and they do nothing
await c.open(harness(era, { published: true })); await sleep(500); await c.loaded(); await sleep(600);
await c.w(readFileSync(path.join(here, 'inpage.js'), 'utf8'));
{
  const v0 = await c.w('ERA.views[0].slice(0, 3)'), keys = await c.ev("document.getElementById('k').textContent");
  ok('published page: the menu does not name the keys 1 to 6', !/Viewpoint|\b6\b/.test(keys), keys.replace(/\s+/g, ' ').trim());
  await c.click(...await c.mid('#d')); await sleep(1500);
  let p = await st(); const at = p.cam;
  ok('published page: it starts at the first test pose', !p.menu && dist(at, v0) < 0.3, dist(at, v0).toFixed(2) + ' m from it');
  for (const k of ['Digit2', 'Digit5', 'Digit6']) { await c.key(k); await sleep(150); }
  await sleep(300); p = await st();
  ok('published page: 1 to 6 do nothing', dist(p.cam, at) < 0.05, 'the camera moved ' + dist(p.cam, at).toFixed(2) + ' m');
}
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
// (the camera as it is before the keys: on the stand-in's made-up sea floor a pose can lie in rock, and the camera is
// pushed out of it behind the menu too)
const before = (await st()).cam;
await c.key('Space'); await c.key('Digit3'); await sleep(200);
let s = await st();
ok('behind the menu Space and 1-6 do nothing', s.menu && s.card === null && dist(s.cam, before) < 0.01);

// into the scene with a real click on the button
await c.click(...await c.mid('#d')); await sleep(1500);
s = await st();
ok('Dive in enters the scene', s.cls.startsWith('g') && !s.menu, 'body class "' + s.cls + '", mouse captured: ' + s.lock);
const locked = s.lock;
await c.w('dynT = -Infinity; 0'); // keep the resolution fixed during the run

// the keys
await c.key('Digit2'); await sleep(250); s = await st();
{
  // (where the pose lies in the rock of the stand-in's made-up sea floor, the camera is pushed out of it: then the
  // direction of the view says that it jumped)
  const v = await c.w('ERA.views[1]'), inRock = (await c.w(`__z.rock(${v[0]}, ${v[1]}, ${v[2]})`)) > -0.5;
  const yaw = Math.atan2(v[3] - v[0], -(v[5] - v[2])), dy = Math.abs(((s.yaw - yaw) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
  ok('in the dev page 2 jumps to test pose 2', inRock ? dy < 0.05 : dist(s.cam, views[1]) < 0.3, inRock ? 'the pose lies in the rock of this sea floor; the view turned to it' : dist(s.cam, views[1]).toFixed(2) + ' m from it');
}
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
// The size of the player (scale.md, stage 2): C goes diver, fish, shrimp, diver. A label names the new size and fades
// after two seconds, the browser remembers it, the speed shrinks with it (less than the size), and grown next to rock the camera is never
// left inside it
{
  const sz = async () => JSON.parse(await c.w("JSON.stringify([F[PS], $('u').className, $('u').textContent, localStorage.abyssalSize])"));
  // (shrinking, the player moves towards what it looks at: the rock or the exhibit ahead is then a tenth as far.
  // Here it looks down at the ground, which is surely there)
  await c.key('Digit1'); await sleep(600); await c.w('F[VX] = F[VY] = F[VZ] = 0; F[PIT] = -1.35; zAim = zKind = -1; 0'); await frames(3);
  const ahead0 = await c.w('ahead()'), cam0 = (await st()).cam, look = await c.w('[F[FX], F[FY], F[FZ]]');
  await c.key('KeyC'); await sleep(250); let z = await sz();
  ok('C makes the player a fish, and a label says so', z[0] === 0.1 && z[1] === 'on' && z[2] === 'Fish · 18 cm', z.slice(0, 3).join(' / '));
  // (or it stops short where its way passes closer to the rock than it may come)
  const moved = dot((await st()).cam.map((v, i) => v - cam0[i]), look), short = await c.w('rockAt(F[CX], F[CY], F[CZ]) > -(CR * F[PS] + 0.03)');
  ok('it moves towards what it looks at, so that it is a tenth as far', ahead0 > 0 && (Math.abs(moved - ahead0 * 0.9) < Math.max(0.05, ahead0 * 0.1) || (moved > 0.1 && short)), `${ahead0.toFixed(2)} m ahead before, moved ${moved.toFixed(2)} m towards it${short && Math.abs(moved - ahead0 * 0.9) >= Math.max(0.05, ahead0 * 0.1) ? ', stopped where rock came near its way' : ''}`);
  ok('the size is remembered', z[3] === '1', 'localStorage.abyssalSize: ' + z[3]);
  // (the speed it settles at while W is held: a distance would depend on how even the frames come)
  // (level, towards open water)
  { const o = await c.w('__z.open()'); if (o) await c.w(`F[YAW] = Math.atan2(${o[0]}, ${-o[1]}); F[PIT] = 0; 0`); await frames(3); }
  await c.keyDown('KeyW'); await sleep(1500); const v = await c.w('Math.hypot(F[VX], F[VY], F[VZ])'); await c.keyUp('KeyW');
  // (much faster than a tenth of a diver, which its size would say: the third number of its size in main.js)
  const want = 7 * await c.w('SIZES[1][2]');
  ok('a fish swims much faster than its size says', Math.abs(v - want) < want * 0.05 && v > 2, `${v.toFixed(3)} m/s (wanted ${want.toFixed(2)}; a diver: 7, a tenth of that: 0.7)`);
  await sleep(2200); z = await sz(); ok('the label fades after two seconds', z[1] === '');
  await c.key('KeyC'); await sleep(250); z = await sz();
  ok('C again makes it a shrimp', z[0] === 0.01 && z[2] === 'Shrimp · 1.8 cm' && z[3] === '2', z.join(' / '));
  // as a shrimp, 6 mm above the rock under the first test pose; then grown into a diver
  const near = await c.w(`(() => { const x = F[CX], z = F[CZ]; let y = F[CY]; while (__z.rock(x, y, z) < -0.006 && y > BOTTOM) y -= 0.002; F[CY] = y; F[VX] = F[VY] = F[VZ] = 0; return __z.rock(x, y, z); })()`);
  await frames(3); const y0 = (await st()).cam[1];
  await c.key('KeyC'); await frames(3); z = await sz(); s = await st();
  const after = await c.w('__z.rock(F[CX], F[CY], F[CZ])');
  ok('C again makes it a diver', z[0] === 1 && z[2] === 'Diver · 1.8 m' && z[3] === '0', z.join(' / '));
  ok('a shrimp that grows next to rock is pushed out of it', after < -0.3, `${(-near * 100).toFixed(1)} cm from the rock before, ${(-after * 100).toFixed(0)} cm after, ${(s.cam[1] - y0).toFixed(2)} m higher`);
}
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
// what the card shows of an entry: the fields in the order of cardText() (size is shown as the picture)
const shown = ({ name, sub, facts, text }) => JSON.stringify({ name, sub, facts, text });
// The size picture (docs/briefs/scale.md): a bar for the exhibit and one for the diver, or for the hand when the exhibit
// is shorter than 30 cm, to one scale. The longer fills the width, the shorter is at least 2 px. A size as the card
// writes it: metres with one decimal at most from 1 m on, whole centimetres from 10 cm, centimetres with one decimal
// at most below that, whole millimetres below 1 cm. A unit starts where the next smaller one would round up to it
// (0.996 is 1 m, not 100 cm)
const len = (m) => { const [u, k, d] = m >= 0.995 ? ['m', 10, 10] : m >= 0.0995 ? ['cm', 100, 1] : m >= 0.0095 ? ['cm', 1000, 10] : ['mm', 1000, 1]; return Math.max(Math.round(m * k) / d, 1) + ' ' + u; };
// checks the open card of `id` in the window as it is now: it fits, and its picture is right (or absent)
const picture = async (id, where) => {
  const z = ZOO[id], p = await c.w('__z.cardPic()'), r = await c.rect('#z'), [w, h] = await c.ev('[innerWidth, innerHeight]');
  const fits = r.top >= 0 && r.left >= 0 && r.right <= w && r.bottom <= h, box = `card ${Math.round(r.left)},${Math.round(r.top)} to ${Math.round(r.right)},${Math.round(r.bottom)}`;
  if (!(z.size > 0)) return ok(`${id}: ${where}: the card fits, no size and no size picture`, fits && p === null, box + (p ? ', picture: ' + p.labels.join(' / ') : ''));
  const hand = z.size < 0.3, other = hand ? 0.19 : 1.8, labels = [`${z.name} · ${len(z.size)}`, hand ? 'Your hand · 19 cm' : 'You · 1.8 m'];
  if (!p) return ok(`${id}: ${where}: the card fits and shows the size picture`, false, box + ', no picture');
  const [a, b] = p.bars, long = Math.max(a, b), short = Math.min(a, b), want = Math.max(2, p.width * Math.min(z.size, other) / Math.max(z.size, other));
  return ok(`${id}: ${where}: the card fits and its size picture is ${labels.join(' against ')}, to scale`, fits && JSON.stringify(p.labels) === JSON.stringify(labels) &&
    Math.abs(long - p.width) < 1 && Math.abs(short - want) <= 1.5 && short >= 2 && (a >= b) === (z.size >= other),
    `${box}, ${p.labels.join(' / ')}, bars ${a.toFixed(1)} and ${b.toFixed(1)} px of ${p.width.toFixed(1)}, the shorter should be ${want.toFixed(1)}`);
};
const seen = [];
for (const { id, name } of kinds) {
  let found = await aim(id), again = ''; await frames(4); s = await until(st, (s) => s.hint === name);
  // on a busy machine the first try has failed once without a cause that could be found: one more, and say so
  if (found && s.hint !== name) { again = ' (second try, the first one named ' + s.hint + ')'; found = await aim(id); await frames(4); s = await until(st, (s) => s.hint === name); }
  let v = await until(vis, (v) => v.startsWith('["visible/1'));
  if (!ok(`${id}: close and looking at it, the hint names it`, found && s.hint === name && v.startsWith('["visible/1'), found ? 'hint: ' + s.hint + again : 'no spot found from which it is what the player looks at')) continue;
  seen.push(id);
  await c.key('Space'); await frames(4); v = await until(vis, (v) => v === '["hidden/0","visible/1"]'); s = await st();
  ok(`${id}: Space opens the card, texts as in ZOO`, s.card === id && s.cardShown && shown(await c.w('__z.cardText()')) === shown(ZOO[id]) && v === '["hidden/0","visible/1"]', v);
  // the size picture in the full window, and in a low one, where the card lies flat (a resize lets the page tune its
  // resolution again: it stays fixed)
  await picture(id, 'full window');
  await c.size(900, 460); await frames(2); await picture(id, 'low window 900x460');
  await c.send('Emulation.clearDeviceMetricsOverride'); await frames(4); await c.w('dynT = -Infinity; 0');
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
