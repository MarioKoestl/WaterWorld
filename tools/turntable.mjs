// A turntable of one exhibit of an era: one individual from nine sides, close enough to judge its shape. Eight views
// from where it spans a third of the picture's height, turned with the animal (front, rear, side, top, from below,
// and three from an angle), and one as a diver sees it from 2 m. They are the pictures for the visual critic's
// question: is this a solid animal or a flat cut-out, and from which views? kinds.mjs takes its picture from where the
// hint appears, which is too far for small kinds. The scene time is frozen, so the pictures can be repeated.
// The side and the angles show the side the sun shines on. A level view in which the ground hides the animal is
// taken from a little higher, and the tool says so. A stone or a plant in front of it the tool does not notice:
// look at the page, and take another individual (--pick) where one is in the way.
//   node tools/turntable.mjs <era> <zoo id> [name] [--page <test.html>] [--time <seconds>] [--pick <n>] [--at <x,z>] [--fill <share>] [--walk] [--list]
// THIS RENDERS THE 3D SCENE: it needs the graphics card. Look at `node tools/chrome.mjs status` first.
// zoo id: the id of an entry in the era's ZOO. name: the label of this run, default the era. Needs `npm run build:dev`
// and a running test Chrome.
// --page: a test page that exists already, in place of the one made from the era's dev page (for a saved older state).
// --time: the scene time, default 20.
// --pick: the individual with this number in the list the tool prints. Without it: of an animal the largest one, of
//         those that move and stand free (no other animal between it and the cameras) if there are such; of something
//         that stands the place nearest to the first test pose.
// --at:   the individual nearest to this point instead.
// --fill: the share of the picture's height it spans, default a third (0.5: half as far away).
// --walk: in addition eight consecutive pictures, 0.2 s of scene time apart, of angle-level and of diver.
// --list: only the list of all individuals (it loads the world, so it needs the card too), no pictures.
// Output: tools/out/turntable/<name>/<id>-front.png ... -diver.png, <id>-angle-level-walk1.jpg ... and <id>.html, a
// page that shows them all
import { writeFileSync, rmSync } from 'node:fs';
import { connect, sleep, outFile } from './cdp.mjs';
import { needCard } from './card.mjs';
import { harness } from './harness.mjs';
import { readPng } from './png.mjs';

const args = process.argv.slice(2), opt = (n) => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
// (--walk, --list and --mock take no value: what follows them is a name)
const plain = args.filter((a, i) => !a.startsWith('--') && !/^--(?!walk$|list$|mock$)/.test(args[i - 1] || ''));
const [era, id, name = era] = plain, time = +(opt('--time') || 20), fill = +(opt('--fill') || 1 / 3), walk = args.includes('--walk');
const pick = opt('--pick') === null ? null : +opt('--pick'), near = opt('--at') ? opt('--at').split(',').map(Number) : null;
if (!id) { console.log('usage: node tools/turntable.mjs <era> <zoo id> [name] [--page <test.html>] [--time <seconds>] [--pick <n>] [--at <x,z>] [--fill <share>] [--walk]'); process.exit(1); }

// What runs inside the test page, in the scope of its bundle (it goes there as text). It knows no era: where the
// exhibit is it reads from the zoo (ZK, the places in Wd.zoo, the animals in ZA)
const inpage = (id) => {
  const k = ZK.indexOf(id), Z = Wd.zoo, own = [];
  const mid = (l) => [l[0] + l[3] / 2, l[1] + l[4] / 2, l[2] + l[5] / 2], far = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  // the distance to the rock at a point (< 0 in water), as the camera's collision field has it (coarse: centimetres)
  const rock = (p) => { const s = [F[CX], F[CY], F[CZ]]; [F[CX], F[CY], F[CZ]] = p; sd(0); [F[CX], F[CY], F[CZ]] = s; return CS[0]; };
  // The line along the animal at i in the list of the mover o, at the scene time F[TIME] and for the camera where it
  // is: its start, the vector to its end, its radius. Of an animal with several lines (a shoal) the two ends that are
  // furthest apart, in the direction of its last line
  const line = (o, i) => {
    const e = []; let r = 0, v, a, b, d = -1;
    for (let p = 0; p < o.parts; p++) { o.at(o.list, i * 8, p); v = [ZP[3], ZP[4], ZP[5]]; e.push([ZP[0], ZP[1], ZP[2]], [ZP[0] + v[0], ZP[1] + v[1], ZP[2] + v[2]]); r = Math.max(r, ZP[7]); }
    for (const p of e) for (const q of e) if (far(p, q) > d) { d = far(p, q); a = p; b = q; }
    if ((b[0] - a[0]) * v[0] + (b[1] - a[1]) * v[1] + (b[2] - a[2]) * v[2] < 0) [a, b] = [b, a];
    return [...a, b[0] - a[0], b[1] - a[1], b[2] - a[2], r];
  };
  const at = (o, i, t) => { F[TIME] = t; return line(o, i); };
  // Every individual of the exhibit at the scene time T: its number n, its line l, whether it moves, and how far it
  // goes in a tenth of a second (way). The animals (m: which mover, i: which of its list). Where there is none,
  // what stands: the twelve places nearest to ref (x, z), or to the first test pose, or the one place `one`. The
  // camera is far away meanwhile: an animal gives way to a viewer that is close
  const all = (T, ref, one) => {
    const out = [], v = ERA.views[0];
    F[CX] = F[CZ] = 0; F[CY] = 1e4;
    for (let m = 0, n = 0; m < ZA.length; m++) if (ZA[m].k === k) for (let i = 0; i < ZA[m].list.length / 8; i++, n++) {
      const o = ZA[m], l = at(o, i, T), c = mid(l), a = mid(at(o, i, T - 0.05)), b = mid(at(o, i, T + 0.05));
      out.push({ n, m, i, l, way: [b[0] - a[0], b[1] - a[1], b[2] - a[2]], moves: [3.7, 11.3, 23.9].some((d) => far(mid(at(o, i, T + d)), c) > 1e-6) });
    }
    F[TIME] = T;
    // (gap: how far from its middle the nearest other animal of the zoo is, whatever its kind)
    const others = [];
    for (const o of ZA) for (let i = 0; i < o.list.length / 8; i++) for (let p = 0; p < o.parts; p++) { o.at(o.list, i * 8, p); others.push([o, i, ZP[0], ZP[1], ZP[2], ZP[3], ZP[4], ZP[5], ZP[7]]); }
    for (const e of out) {
      const c = mid(e.l); e.gap = 1e9;
      for (const [o, i, ax, ay, az, vx, vy, vz, r] of others) if (o !== ZA[e.m] || i !== e.i) {
        const vv = vx * vx + vy * vy + vz * vz, s = vv > 0 ? Math.min(1, Math.max(0, ((c[0] - ax) * vx + (c[1] - ay) * vy + (c[2] - az) * vz) / vv)) : 0;
        e.gap = Math.min(e.gap, far(c, [ax + vx * s, ay + vy * s, az + vz * s]) - r);
      }
    }
    if (out.length) return { count: out.length, list: out };
    for (let i = 0; i < Z.n; i++) if (Z.data[i * ZN + 8] === k) {
      const l = [...Z.data.subarray(i * ZN, i * ZN + 6), Math.abs(Z.data[i * ZN + 7])], c = mid(l);
      out.push({ n: i, m: -1, i, l, way: [0, 0, 0], moves: false, d: ref ? Math.hypot(c[0] - ref[0], c[2] - ref[1]) : far(c, v) });
    }
    return { count: out.length, list: one === null ? out.sort((a, b) => a.d - b.d).slice(0, 12) : out.filter((e) => e.n === one) };
  };
  // The kinds that are drawn with the instances of the mover m, each with its count. A see-through one among them,
  // while one that is not see-through has these instances too, is a patch: the dark patch on the mud under a walker.
  // The camera of a view from below is under the ground, which is drawn with its back faces culled: it looks up
  // through it, but that patch would lie over the animal. So cam() leaves a patch out for those views (its count
  // k.n is 0 then) and gives it its count back for the others
  const chosen = (m) => { own.length = 0; if (m >= 0) for (const q of KINDS) if (q.data === ZA[m].list) own.push([q, q.n]); return own.length; };
  const patch = (q) => !!q.glass && own.some(([o]) => !o.glass);
  // The camera at p, looking at t, the player ps times a diver (its near plane with it). Straight up or down the
  // yaw is open: there yaw and pit say how it looks. hide: 1 a view from below, without the patch; 2 without the
  // animal itself (what would the picture be without it?); 0 all of it
  const cam = (ps, p, t, yaw, pit, hide) => {
    F[PS] = ps; lookAt(...p, ...t); if (yaw !== null) { F[YAW] = yaw; F[PIT] = pit; }
    F[VX] = F[VY] = F[VZ] = 0;
    for (const [q, n] of own) q.n = hide && patch(q) === (hide === 1) ? 0 : n;
    return 0;
  };
  // is the spot p in open water, 0.6 m from the rock, with a clear line to t?
  const free = (p, t) => { let ok = rock(p) < -0.6; for (let s = 0.2; ok && s < 0.9; s += 0.2) ok = rock(p.map((v, j) => v + (t[j] - v) * s)) < -0.1; return ok; };
  // one frame at the scene time T, without hint and card (the frame loop is stopped: nothing else draws)
  const draw = async (T) => { F[TIME] = T; zooOff(); render(); render(); await Q.onSubmittedWorkDone(); return 0; };
  return { k, ids: ZK, name: k < 0 ? '' : ZOO[id].name, tanh: TANH, near: NEAR, sun: ERA.sun, all, chosen, at: (m, i, T) => at(ZA[m], i, T), cam, rock, free, draw };
};

await needCard();
const c = await connect();
await c.desktop();
if (args.includes('--mock')) await c.mock(); // only to try the tool itself: the pictures are empty
await c.open(opt('--page') || harness(era)); await sleep(500); await c.loaded();
const js = JSON.stringify, tt = (call) => c.w('__tt.' + call);
const end = async (code, say) => { if (say) console.log(say); const logs = c.news(); console.log(logs.length ? 'console:\n' + logs.join('\n') : 'console: no messages'); await c.done(); process.exit(code); };
// into the scene as with a captured mouse, frame loop stopped, full resolution and full draw distance
await c.w(`ui(false); body.className = 'g p'; frame = () => {}; F[TIME] = ${time}; pix = PIXMAX; det = 1; dynT = -Infinity; resize(); zooOff(); window.__tt = (${inpage})(${js(id)}); 0`);
const I = await c.ev('({ k: __tt.k, ids: __tt.ids, name: __tt.name, tanh: __tt.tanh, near: __tt.near, sun: __tt.sun })');
if (I.k < 0) await end(1, `${id}: no entry of ZOO has this id. There are: ${I.ids.join(', ')}`);
await sleep(2600); // the menu's blur fades out
console.log('canvas', await c.w("W + 'x' + H"));

// ---------------------------------------------------------------- which one
const add = (a, b, s = 1) => a.map((v, i) => v + b[i] * s), len = (a) => Math.hypot(...a), unit = (a) => a.map((v) => v / len(a)), cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const mid = (l) => add(l, l.slice(3, 6), 0.5).slice(0, 3);
// How large an exhibit is for the picture: the length of its line and its radius, of a point twice its radius. (The
// line of a walker ends short of head and tail, and its radius is half its width: with this its body spans the share
// --fill of the picture's height, lengthwise in the side view.)
const size = (l) => l[6] + Math.max(len(l.slice(3, 6)), l[6]);
// how far the cameras of the eight views are from it, and whether it stands free: no other animal is nearer to its
// middle than they are, so none stands in front of it in a picture
const away = (l) => size(l) / (2 * I.tanh * fill), alone = (q) => q.gap > away(q.l);
const A = await tt(`all(${time}, ${js(near)}, ${js(pick)})`), L = A.list, animal = L.length > 0 && L[0].m >= 0;
if (animal) L.sort((a, b) => b.moves - a.moves || alone(b) - alone(a) || size(b.l) - size(a.l));
const flat = (e) => Math.hypot(mid(e.l)[0] - near[0], mid(e.l)[2] - near[1]);
const e = pick !== null ? L.find((q) => q.n === pick) : near && animal ? L.reduce((a, b) => (flat(b) < flat(a) ? b : a), L[0]) : L[0];
if (!e) await end(1, pick !== null ? `${id}: ${A.count} of it in this world, none has the number ${pick}` : `${id}: none of it in this world`);
const m3 = (v) => v.map((x) => x.toFixed(3)).join(' '), cm = (m) => (m >= 0.995 ? m.toFixed(2) + ' m' : (m * 100).toFixed(1) + ' cm');
console.log(`${id} (${I.name}): ${A.count} ${animal ? 'animals. Those that move first, of them those that stand free, the largest first' : 'places. The nearest first'} (--pick <number> takes another, --at <x,z> the nearest to a point):`);
// (how fast it is at this scene time: a walker stands at the corners of its round)
const list = args.includes('--list');
for (const q of [...L.slice(0, list ? L.length : 10), ...(L.indexOf(e) > 9 && !list ? [e] : [])]) console.log(`  ${String(q.n).padStart(5)}  at ${m3(mid(q.l))}  ${cm(size(q.l)).padStart(8)}${!animal ? '' : (q.moves ? `  moves, now ${cm(len(q.way) * 10)}/s` : '  still') + (alone(q) ? ', stands free' : `, another animal ${cm(Math.max(q.gap, 0))} from it`)}${q === e ? '  <- this one' : ''}`);
if (list) await end(0);
if (animal && !alone(e)) console.log(`NOTE: another animal is ${cm(Math.max(e.gap, 0))} from it, nearer than the cameras: it may stand in front of it in a picture`);

// ---------------------------------------------------------------- its frame and the nine cameras
// Its middle t is the middle of its line, its heading h the direction of that line (of a point: the way it goes, or
// +z), as it is: on a slope the views tilt with the animal. Up u is the world's up made perpendicular to h, r its
// right side. Something that stands upright (a line steeper than 60 degrees) is seen level, from +z as its front.
const t = mid(e.l), v = e.l.slice(3, 6), S = size(e.l), d = away(e.l), D = Math.PI / 180;
let h = len(v) > 1e-6 ? unit(v) : len(e.way) > 1e-6 ? unit(e.way) : [0, 0, 1];
if (Math.hypot(h[0], h[2]) < 0.5) h = [0, 0, 1];
const s = Math.asin(h[1]), hl = unit([h[0], 0, h[2]]), u = [-Math.sin(s) * hl[0], Math.cos(s), -Math.sin(s) * hl[2]], r = cross(h, u), yaw = Math.atan2(h[0], -h[2]);
// the side that is seen from the side and from an angle: the one the sun of the era shines on (1 its right, -1 its left)
const lit = Array.isArray(I.sun) && r[0] * I.sun[0] + r[1] * I.sun[1] + r[2] * I.sun[2] < 0 ? -1 : 1;
// the direction az round from the first of three axes towards the second and el up towards the third
const turn = ([f, r, u], az, el) => f.map((_, i) => (f[i] * Math.cos(az * D) + r[i] * Math.sin(az * D)) * Math.cos(el * D) + u[i] * Math.sin(el * D));
// The eight views: how far round from the front, and how far up. The camera is d from t and looks at t. From the top
// and from below the head points to the top of the picture: the camera has no roll, so its yaw and its pitch are set
// (the pitch goes past straight down where the animal heads downhill). In the side view of its right side the head
// points to the right. The camera may be in the rock or under the ground: nothing collides, the frame loop is stopped
const spot = (az, el) => add(t, turn([h, r, u], az * lit, el), d);
const views = [['front', 0, 0], ['rear', 180, 0], ['side', 90, 0], ['top', 0, 90], ['below', 0, -90], ['angle-above', 40, 35], ['angle-level', 40, 4], ['angle-below', 140, -30]]
  .map(([name, az, el]) => ({ name, az, el, p: spot(az, el), yaw: el === 90 ? yaw : el === -90 ? yaw + Math.PI : null, pit: el === 90 ? s - Math.PI / 2 : el === -90 ? Math.PI / 2 - s : 0, under: el < 0 }));
// (the last number: what the page leaves out, see cam() there. From below the patch under a walker, else nothing)
const cam = (w, ps, hide = w.under ? 1 : 0) => tt(`cam(${ps}, ${js(w.p)}, ${js(t)}, ${js(w.yaw)}, ${w.pit}, ${hide})`);
// how far the middle of the animal is from t at the scene time T, with the camera of the view w
const gone = async (w, ps, T = time) => { if (!animal) return 0; await cam(w, ps); return len(add(mid(await tt(`at(${e.m}, ${e.i}, ${T})`)), t, -1)); };
const kinds = await tt(`chosen(${e.m})`);
// The player's size for them: the largest of the three for which the near plane is no more than a fifth of the way
// to the animal (it must not cut it), and to which the animal does not give way (it does to a viewer that comes
// about as near as its own length and twice the near plane). But the smallest, where one of the cameras is within
// 5 cm of the ground (as the collision field has it): that is lower than a fish can get, and its near plane would
// cut the ground in front of the camera, a band along the bottom of the picture
const low = (await Promise.all(views.map((w) => tt(`rock(${js(w.p)})`)))).some((q) => Math.abs(q) < 0.05);
const sizes = low ? [0.01] : [1, 0.1, 0.01].filter((q) => I.near * q <= d / 5); if (!sizes.length) sizes.push(0.01);
let ps = sizes[0], off = 0;
for (const q of sizes) { ps = q; off = 0; for (const w of views) off = Math.max(off, await gone(w, q)); if (off < 1e-6) break; }
if (off >= 1e-6) console.log(`NOTE: it gives way to the camera by up to ${cm(off)}: the views are not all of the animal where it would be. A smaller --fill keeps the camera further away`);
// The diver: 2 m from it, 40 degrees to the side of its front, 50 degrees above the horizon where it is within half a
// metre of the ground and 20 degrees otherwise. Where rock is in the way there, from another side
const el = (await tt(`rock(${js(t)})`)) > -0.5 ? 50 : 20, level = [hl, cross(hl, [0, 1, 0]), [0, 1, 0]];
let diver = null;
for (const az of [40, -40, 90, -90, 140, -140, 0, 180]) { const p = add(t, turn(level, az * lit, el), 2); if (await tt(`free(${js(p)}, ${js(t)})`)) { diver = { name: 'diver', p, az }; break; } }
if (!diver) { diver = { name: 'diver', p: add(t, turn(level, 40 * lit, el), 2), az: 40 }; console.log('NOTE: no side of it has 2 m of open water for the diver: that view may be from inside the rock'); }
Object.assign(diver, { yaw: null, pit: 0, under: false });
if (await gone(diver, 1) >= 1e-6) console.log('NOTE: it gives way to the diver at 2 m');
console.log(`this one: number ${e.n} at ${m3(t)}, ${cm(S)} for the picture (line ${cm(len(v))}, radius ${cm(e.l[6])}), heading ${m3(h)}${animal ? e.moves ? ', it moves' : ', it stays where it is' : ''}`);
console.log(`views 1 to 8 from ${cm(d)}, the side and the angles of its ${lit > 0 ? 'right' : 'left'} side, the player ${ps} of a diver (near plane ${cm(I.near * ps)}); the diver from 2 m, ${el} degrees up, ${diver.az} degrees round from its front`);

// ---------------------------------------------------------------- the pictures
const out = (f) => outFile('turntable', name, `${id}-${f}`);
const shot = async (w, f, T, clip, hide) => { await cam(w, w === diver ? 1 : ps, hide); await tt(`draw(${T})`); await sleep(350); await c.shot(out(f), clip); };
// Is the animal in the picture? A view from the level of an animal on the ground looks along the ground, and a swell
// of a centimetre between hides it. How much of it is seen: the share of the pixels in the middle of the picture (a
// square a little larger than the animal) that change when it is not drawn. Where that is next to nothing, the camera
// goes up in steps of 5 degrees until it is seen, and on while much more of it comes out. (Only for an animal with
// kinds of its own, which the page can leave out. A stone in front of it, or a plant, is not noticed.)
const [pw, ph] = await c.ev('[innerWidth, innerHeight]'), box = Math.min(ph, Math.round(1.2 * fill * ph)), clip = { x: (pw - box) >> 1, y: (ph - box) >> 1, width: box, height: box }, FEW = 0.005;
const seen = async (w) => {
  const px = []; for (const hide of [0, 2]) { await shot(w, 'part.png', time, clip, hide); px.push(readPng(out('part.png'))); }
  const [a, b] = px; let n = 0;
  for (let i = 0; i < a.w * a.h; i++) if (Math.abs(a.px[i * a.ch] - b.px[i * b.ch]) + Math.abs(a.px[i * a.ch + 1] - b.px[i * b.ch + 1]) + Math.abs(a.px[i * a.ch + 2] - b.px[i * b.ch + 2]) > 24) n++;
  return n / (a.w * a.h);
};
if (kinds && !args.includes('--mock')) {
  for (const w of views) if (w.el >= 0 && w.el < 30) {
    let now = await seen(w);
    if (now < FEW) for (let k = 1; k <= 6; k++) { const p = spot(w.az, w.el + 5 * k), q = await seen({ ...w, p }); if (now >= FEW && q < 1.5 * now) break; w.p = p; now = q; w.up = 5 * k; }
    if (w.up) w.note = now < FEW ? 'the ground hides it' : `${w.up} degrees higher: the ground hid it`;
    if (now < FEW) console.log(`NOTE: ${w.name}: the animal is not seen, also from ${w.up} degrees higher. Take another one (--pick)`);
  }
  rmSync(out('part.png'), { force: true });
}
const label = (w) => w.name + (w.note ? ` (${w.note})` : '');
for (const w of [...views, diver]) { await shot(w, w.name + '.png', time); console.log(label(w)); }
const walks = walk ? [views[6], diver] : [];
for (const w of walks) { for (let j = 0; j < 8; j++) await shot(w, `${w.name}-walk${j + 1}.jpg`, time + 0.2 * j); console.log(w.name, 'walking: its middle goes', cm(await gone(w, w === diver ? 1 : ps, time + 1.4)), 'from the first picture to the last'); }
// the page: the nine pictures in a grid of three by three, under them the walking ones, changing at their pace
const fig = (f, label, more = '') => `<figure><a href="${id}-${f}"><img src="${id}-${f}" alt="${label}"${more}></a><figcaption>${label}</figcaption></figure>`;
writeFileSync(outFile('turntable', name, id + '.html'), `<!doctype html><meta charset="utf-8"><title>${id}, ${name}</title>
<style>body { margin: 0; padding: 14px; background: #0b1013; color: #c8d3d8; font: 14px/1.4 system-ui, sans-serif; } h1 { margin: 0; font-size: 17px; } p { margin: 2px 0 12px; color: #84939b; }
div { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; } figure { margin: 0; } img { display: block; width: 100%; } figcaption { padding-top: 3px; }</style>
<h1>${I.name} (${id}), ${name}</h1>
<p>Number ${e.n} at ${m3(t)}, ${cm(S)}, scene time ${time} s. Eight views from ${cm(d)}, the player ${ps} of a diver, and one as a diver from 2 m. A click opens a picture in full size.</p>
<div>${[...views, diver].map((w) => fig(w.name + '.png', label(w))).join('')}</div>
${walks.length ? `<h1>How it moves</h1>\n<p>Eight pictures, 0.2 s of scene time apart, shown at that pace.</p>\n<div>${walks.map((w) => fig(w.name + '-walk1.jpg', label(w), ` data-walk="${id}-${w.name}-walk"`)).join('')}</div>
<script>let n = 0; setInterval(() => { n = n % 8 + 1; for (const i of document.querySelectorAll('[data-walk]')) i.src = i.dataset.walk + n + '.jpg'; }, 200);</script>\n` : ''}`);
console.log('page', outFile('turntable', name, id + '.html'));
await end(0);
