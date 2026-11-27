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
// --flip: its front is the other end of its line (for an exhibit whose line the zoo gives from head to tail).
// --swim: with --qa, two more pictures of an animal that leaves the ground now and then (a swimming burst), at
//         the top of the next burst of the chosen individual: swim-side.png from the side and swim-below.png
//         from below and behind, and eight swim-0..7.png from the side over --span seconds round that top, to
//         judge what the limbs do. For an animal that stays on the ground it says so and takes none.
// --feel: with --qa, eight pictures feel-0..7.png of the same individual while it walks (the moment it is
//         lowest), --every seconds apart, from the front and above, for the motion of the limbs in front.
// --every, --span: seconds between the eight --feel pictures (default 0.5) and over all eight of --swim
//         (default 0.9, about one stroke).
// Output: tools/out/turntable/<name>/<id>-front.png ... -diver.png, <id>-angle-level-walk1.jpg ... and <id>.html, a
// page that shows them all
import { writeFileSync, rmSync } from 'node:fs';
import { connect, sleep, outFile } from './cdp.mjs';
import { needCard } from './card.mjs';
import { harness, guardBuild } from './harness.mjs';
import { readPng } from './png.mjs';

const args = process.argv.slice(2), opt = (n) => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
// (--walk, --list, --flip, --mock, --qa, --swim and --feel take no value: what follows them is a name)
const plain = args.filter((a, i) => !a.startsWith('--') && !/^--(?!walk$|list$|flip$|mock$|qa$|swim$|feel$)/.test(args[i - 1] || ''));
const [era, id, name = era] = plain, time = +(opt('--time') || 20), fill = +(opt('--fill') || 1 / 3), walk = args.includes('--walk');
const pick = opt('--pick') === null ? null : +opt('--pick'), near = opt('--at') ? opt('--at').split(',').map(Number) : null, qa = args.includes('--qa');
const swim = args.includes('--swim'), feel = args.includes('--feel');
const every = +(opt('--every') || 0.5), span = +(opt('--span') || 0.9);
if (!id) { console.log('usage: node tools/turntable.mjs <era> <zoo id> [name] [--page <test.html>] [--time <seconds>] [--pick <n>] [--at <x,z>] [--fill <share>] [--walk]'); process.exit(1); }
if (!opt('--page')) guardBuild(era);

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
  // is the spot p in open water, m from the rock (0.6 unless the caller asks for less), with a clear line to t?
  const free = (p, t, m = 0.6) => { let ok = rock(p) < 0 - m; for (let s = 0.2; ok && s < 0.9; s += 0.2) ok = rock(p.map((v, j) => v + (t[j] - v) * s)) < -0.1; return ok; };
  // one frame at the scene time T, without hint and card (the frame loop is stopped: nothing else draws)
  const draw = async (T) => { F[TIME] = T; zooOff(); render(); render(); await Q.onSubmittedWorkDone(); return 0; };
  // draw with dodge suppressed: the view matrix uses the real camera (from cam()), but g.cam.xyz in the uniform
  // buffer is overridden to fc so the dodge shader thinks the viewer is far away
  const _fc = new Float32Array(4);
  const drawNoDodge = async (T, fx, fy, fz) => {
    F[TIME] = T; zooOff();
    const os = Q.submit.bind(Q);
    let hits = 0;
    Q.submit = function(c) { hits++; _fc[0] = fx; _fc[1] = fy; _fc[2] = fz; _fc[3] = UB[35]; Q.writeBuffer(ubo, 128, _fc); return os(c); };
    render(); render();
    Q.submit = os;
    await Q.onSubmittedWorkDone();
    return 0;
  };
  const headLen = (m, i) => {
    if (m < 0) return [0, 0];
    const o = ZA[m], sz = o.list[i * 8 + 6];
    let kk = KINDS.find(q => q.data === o.list);
    if (!kk) kk = KINDS.find(q => q.data && q.data.length === o.list.length && q.data[0] === o.list[0] && q.data[1] === o.list[1]);
    // without a marked soft head (aux .875 to 1 in front of the body), a walker's head is the front third:
    // a little larger and further forward, so limbs round the head stay in the frame
    if (!kk || !kk.m || !kk.m.vb) return [sz * 0.3, 0.37 * sz];
    const f = new Float32Array(kk.m.vb), s = new Int8Array(kk.m.vb), nv = kk.m.nv;
    let mZ = -1e9, sZ = -1e9, mR = 0;
    for (let v = 0; v < nv; v++) { const z = f[v * 4 + 2], a = s[v * 16 + 15]; if (z > mZ) mZ = z; if (a >= 0 && a <= 56 && z > sZ) sZ = z; }
    if (sZ < 0 || sZ > mZ * 0.95 || mZ < 1e-6) return [sz * 0.3, 0.37 * sz];
    for (let v = 0; v < nv; v++) { const z = f[v * 4 + 2], a = s[v * 16 + 15]; if (a > 56 && a < 64 && abs(z - sZ) < mZ * 0.03) { const r = hypot(f[v * 4], f[v * 4 + 1]); if (r > mR) mR = r; } }
    if (mR < 1e-6) return [sz * 0.3, 0.37 * sz];
    return [(mZ - sZ + 2 * mR) / mZ * sz, ((sZ + mZ) / 2 - 0.5) * sz];
  };
  // The scene time in [T0, T0 + W] at which this individual's middle is highest, how far that is over its lowest
  // in the same window, the time at which it is lowest, and its line at the highest: for an animal that leaves
  // the ground now and then (a swimming burst) those are the top of one burst and a moment of plain walking.
  // Stepped by st seconds, the camera far away meanwhile (it would give way to a near one, and then the line
  // would not be where the animal is)
  const peak = (m, i, T0, W, st) => {
    if (m < 0) return [T0, 0, T0];
    const o = ZA[m], cx = F[CX], cy = F[CY], cz = F[CZ];
    F[CX] = F[CZ] = 0; F[CY] = 1e4;
    let bt = T0, lt = T0, hi = -1e9, lo = 1e9;
    for (let T = T0; T <= T0 + W; T += st) { const y = mid(at(o, i, T))[1]; if (y > hi) { hi = y; bt = T; } if (y < lo) { lo = y; lt = T; } }
    const l = at(o, i, bt);
    F[CX] = cx; F[CY] = cy; F[CZ] = cz;
    at(o, i, T0);
    return [bt, hi - lo, lt, ...l];
  };
  return { k, ids: ZK, name: k < 0 ? '' : ZOO[id].name, qaEye: k < 0 ? null : ZOO[id].qaEye || null, tanh: TANH, near: NEAR, sun: ERA.sun, all, chosen, at: (m, i, T) => at(ZA[m], i, T), cam, rock, free, draw, drawNoDodge, bz: (m, i) => m >= 0 ? ZA[m].list[i * 8 + 6] : 0, headLen, peak };
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
const I = await c.ev('({ k: __tt.k, ids: __tt.ids, name: __tt.name, qaEye: __tt.qaEye, tanh: __tt.tanh, near: __tt.near, sun: __tt.sun })');
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
if (args.includes('--flip')) h = h.map((q) => -q);
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
if (qa) {
  const bz = animal ? await tt(`bz(${e.m}, ${e.i})`) : S;
  if (bz <= 0) await end(1, 'QA: cannot read body size for a static exhibit; use the turntable instead');
  const qaF = (f) => outFile('qa', era, `${id}/${f}`);
  const qw = Math.min(pw, 1600), qh = Math.round(qw * ph / pw);
  const qClip = { x: (pw - qw) >> 1, y: (ph - qh) >> 1, width: qw, height: qh };
  const qps = (dist) => [1, 0.1, 0.01].find((q) => I.near * q <= dist / 5) || 0.01;
  const qShot = async (f, qp, p, target) => {
    await tt(`cam(${qp}, ${js(p)}, ${js(target)}, null, 0, 0)`);
    await tt(`draw(${time})`); await sleep(350); await c.shot(qaF(f), qClip);
  };
  console.log(`QA: ${id}, body ${cm(bz)}`);
  // a third further out than the body alone needs: limbs reach past the body, and no animal may be cut by the edge
  const dB = bz * ph / (pw * I.tanh) * 1.3;
  await qShot('body.png', qps(dB), add(t, r, dB * lit), t);
  console.log(`body from ${cm(dB)}`);
  const hArr = animal ? await tt(`headLen(${e.m}, ${e.i})`) : [bz * 0.2, bz * 0.4];
  const hSz = hArr[0], ht = add(t, h, hArr[1]);
  const dH = hSz * ph / (pw * I.tanh);
  // from the side a little above and ahead, so limbs round the head (a basket, a crown) do not fill the lens
  const hdir = unit([0, 1, 2].map((j) => r[j] * 0.78 * lit + u[j] * 0.5 + h[j] * 0.25));
  if (animal && dH < bz) {
    const fCam = add(ht, r, bz * lit);
    await tt(`cam(${qps(dH)}, ${js(add(ht, hdir, dH))}, ${js(ht)}, null, 0, 0)`);
    await tt(`drawNoDodge(${time}, ${fCam[0]}, ${fCam[1]}, ${fCam[2]})`);
    await sleep(350); await c.shot(qaF('head.png'), qClip);
  } else {
    await qShot('head.png', qps(dH), add(ht, hdir, dH), ht);
  }
  console.log(`head from ${cm(dH)} (head region ${cm(hSz)})${animal && dH < bz ? ', dodge suppressed' : ''}`);
  const qLevel = [hl, cross(hl, [0, 1, 0]), [0, 1, 0]];
  const qEl = (await tt(`rock(${js(t)})`)) > -0.5 ? 50 : 20;
  let dp = null;
  for (const az of [40, -40, 90, -90, 0, 180]) { const p = add(t, turn(qLevel, az * lit, qEl), 1); if (await tt(`free(${js(p)}, ${js(t)})`)) { dp = p; break; } }
  if (!dp) dp = add(t, turn(qLevel, 40 * lit, qEl), 1);
  await qShot('diver.png', 1, dp, t);
  console.log('diver from 1 m');
  // stage F of ordovician-life.md: the skin (the head from half the head distance, about 2 D for a cephalopod)
  // and the eye (a quarter of the picture wide), both with the dodge suppressed
  const mdir = (A, B, C, fa, fb, fc) => unit([0, 1, 2].map((j) => A[j] * fa + B[j] * fb + C[j] * fc));
  const fFar = add(ht, r, bz * lit);
  const noDodge = async (f, qp, p, target) => {
    await tt(`cam(${qp}, ${js(p)}, ${js(target)}, null, 0, 0)`);
    await tt(`drawNoDodge(${time}, ${fFar[0]}, ${fFar[1]}, ${fFar[2]})`);
    await sleep(350); await c.shot(qaF(f), qClip);
  };
  // the eye's and the skin's places come from the era: ZOO[id].qaEye = [along the line, to the side, up,
  // across], as fractions of the line's length. Without it, skin aims at the head's middle and there is no eye
  const sc = len(v) || bz, st = e.l.slice(0, 3);
  const qE = I.qaEye && animal ? I.qaEye : null;
  const skd = dH * 0.5;
  // the skin picture looks down on the top of the head, where the relief is strongest
  const tSk = qE ? [0, 1, 2].map((j) => st[j] + h[j] * qE[0] * sc + u[j] * qE[2] * sc * 2.5) : ht;
  await noDodge('skin.png', qps(skd), add(tSk, mdir(r, u, h, lit * .6, .65, .3), skd), tSk);
  console.log(`skin from ${cm(skd)} at ${m3(tSk)}`);
  if (qE) {
    const [eA, eS, eU, eX] = qE;
    const ep = [0, 1, 2].map((j) => st[j] + h[j] * eA * sc + r[j] * lit * eS * sc + u[j] * eU * sc);
    const dE = 2 * eX * sc * ph / (pw * I.tanh);
    await noDodge('eye.png', qps(dE), add(ep, mdir(r, u, h, lit * .94, .31, .15), dE), ep);
    console.log(`eye from ${cm(dE)} (eye ${cm(eX * sc)}) at ${m3(ep)}, line start ${m3(st)}`);
  } else console.log('eye.png skipped: no qaEye on the ZOO entry');
  // --swim: two more pictures of an animal that leaves the ground now and then (a swimming burst), at the top
  // of the next burst of this individual: from the side and from below and behind, so the pose can be judged
  // the frame of an individual at the scene time T: its middle, and heading, right and up as they are then
  const frameAt = async (T) => {
    const l = await tt(`at(${e.m}, ${e.i}, ${T})`), c = mid(l), v = l.slice(3, 6);
    const hh = len(v) > 1e-6 ? unit(v) : h, hz = unit([hh[0], 0, hh[2]]), aa = Math.asin(hh[1]);
    const uu = [-Math.sin(aa) * hz[0], Math.cos(aa), -Math.sin(aa) * hz[2]];
    return { c, l, fr: [hh, cross(hh, uu), uu] };
  };
  // a run of eight pictures <stem>-0..7.png: the camera keeps az round from its front and el up, as far as d,
  // and follows the animal, so only what it does with itself shows. fwd moves what it looks at that far ahead
  // of the middle of the line, for a view in which the limbs in front have to fit
  const run8 = async (stem, T0, step, az, el, d, qp, fwd = 0) => {
    for (let k = 0; k < 8; k++) {
      const T = T0 + k * step, f = await frameAt(T), aim = add(f.c, f.fr[0], fwd);
      await tt(`cam(${qp}, ${js(add(aim, turn(f.fr, az * lit, el), d))}, ${js(aim)}, null, 0, 0)`);
      await tt(`draw(${T})`); await sleep(320); await c.shot(qaF(`${stem}-${k}.png`), qClip);
    }
  };
  let gotSwim = false, gotFeel = false;
  if ((swim || feel) && animal) {
    const pk = await tt(`peak(${e.m}, ${e.i}, ${time}, 120, .5)`), sT = pk[0], rise = pk[1], wT = pk[2];
    // --feel: while it walks, from the front and above, so the limbs in front are what one sees
    if (feel) {
      // (the limbs in front reach past the line, so the camera looks a fifth of the body ahead of its middle
      // and stands far enough out that all of them fit)
      const f0 = await frameAt(wT), dF = size(f0.l) * ph / (pw * I.tanh) * 1.75, fw = bz * 0.2;
      await run8('feel', wT, every, 0, 42, dF, qps(dF), fw);
      gotFeel = true;
      console.log(`feel: 8 pictures ${every} s apart from scene time ${wT.toFixed(1)} s (it walks there), from the front, 42 degrees up, ${cm(dF)} away, looking ${cm(fw)} ahead of the middle`);
    }
    if (!swim) { /* nothing more */ }
    else if (rise < bz * 0.5) console.log(`swim: it never gets more than ${cm(rise)} off its path in 120 s of scene time: no swim pictures`);
    else {
      const sl = pk.slice(3), sm = mid(sl), sv = sl.slice(3, 6);
      const sh2 = len(sv) > 1e-6 ? unit(sv) : h, shl = unit([sh2[0], 0, sh2[2]]), sa = Math.asin(sh2[1]);
      const su = [-Math.sin(sa) * shl[0], Math.cos(sa), -Math.sin(sa) * shl[2]], sFr = [sh2, cross(sh2, su), su];
      const dS = size(sl) * ph / (pw * I.tanh) * 1.3, qp = qps(dS);
      // the first of these angles with open water to it: a view from under the animal would otherwise end up
      // in the mud, which would hide it
      // (the view from under a swimming animal passes near the mud: there 25 cm of water is enough, where the
      // other cameras of the tool want 60)
      const spotFor = async (list, m) => {
        for (const [az, el] of list) { const p = add(sm, turn(sFr, az * lit, el), dS); if (await tt(`free(${js(p)}, ${js(sm)}, ${m})`)) return [p, az, el]; }
        const [az, el] = list[list.length - 1];
        return [add(sm, turn(sFr, az * lit, el), dS), az, el];
      };
      const sShot = async (f, p) => {
        await tt(`cam(${qp}, ${js(p)}, ${js(sm)}, null, 0, 0)`);
        await tt(`draw(${sT})`); await sleep(350); await c.shot(qaF(f), qClip);
      };
      const [sp, saz, sel] = await spotFor([[90, 0], [-90, 0], [90, 12], [-90, 12]], 0.6);
      await sShot('swim-side.png', sp);
      const [bp, baz, bel] = await spotFor([[180, -55], [155, -50], [180, -42], [155, -36], [180, -28], [180, -16]], 0.25);
      await sShot('swim-below.png', bp);
      // eight from the side over --span seconds round the top of the burst, to judge what the limbs do
      await run8('swim', sT - span / 2, span / 7, 90, 0, dS, qp);
      console.log(`swim: 8 more from the side, ${(span / 7).toFixed(3)} s apart over ${span} s round the top`);
      gotSwim = true;
      console.log(`swim: at ${m3(sm)} at scene time ${sT.toFixed(1)} s, ${cm(rise)} over its lowest, both from ${cm(dS)}, the player ${qp} of a diver`);
      console.log(`swim-side ${saz} degrees round from its front, ${sel} up; swim-below ${baz} degrees round, ${bel} up`);
    }
  }
  const fig = (f, label) => `<figure><a href="${f}"><img src="${f}" alt="${label}"></a><figcaption>${label}</figcaption></figure>`;
  const row8 = (stem, label) => `<h3>${label}</h3><div>` + Array.from({ length: 8 }, (_, k) => fig(`${stem}-${k}.png`, `${k}`)).join('') + '</div>';
  writeFileSync(qaF('qa.html'), `<!doctype html><meta charset="utf-8"><title>QA: ${id}</title>\n<style>body{margin:0;padding:14px;background:#0b1013;color:#c8d3d8;font:14px/1.4 system-ui,sans-serif}h2,h3{margin:14px 0 8px}div{display:flex;gap:10px;flex-wrap:wrap}img{max-width:520px}</style>\n<h2>${I.name} (${id}), body ${cm(bz)}</h2>\n<div>${fig('body.png', 'body')}${fig('head.png', 'head')}${fig('diver.png', 'diver')}${fig('skin.png', 'skin')}${I.qaEye && animal ? fig('eye.png', 'eye') : ''}${gotSwim ? fig('swim-side.png', 'swimming, from the side') + fig('swim-below.png', 'swimming, from below and behind') : ''}</div>\n${gotFeel ? row8('feel', `walking, from the front and above, ${every} s apart`) : ''}\n${gotSwim ? row8('swim', `swimming, from the side, over ${span} s`) : ''}`);
  console.log('page', qaF('qa.html'));
  await end(0);
}
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
