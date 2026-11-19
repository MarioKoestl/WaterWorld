// Tuning render: three views of one animal for parameter comparison. Same camera as turntable.mjs
// but only angle-level, diver, and a 2m side close-up. No needCard (Mario: "just use my card").
//   node tools/tune-render.mjs <era> <zoo id> <label> [--time <seconds>]
import { writeFileSync, mkdirSync } from 'node:fs';
import { connect, sleep, outFile } from './cdp.mjs';
import { harness } from './harness.mjs';

const args = process.argv.slice(2), opt = (n) => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
const plain = args.filter((a, i) => !a.startsWith('--') && !/^--/.test(args[i - 1] || ''));
const [era, id, label = 'tune'] = plain, time = +(opt('--time') || 20), fill = 1 / 3;
if (!id) { console.log('usage: node tools/tune-render.mjs <era> <zoo id> <label>'); process.exit(1); }
const js = JSON.stringify;

const inpage = (id) => {
  const k = ZK.indexOf(id), Z = Wd.zoo, own = [];
  const mid = (l) => [l[0] + l[3] / 2, l[1] + l[4] / 2, l[2] + l[5] / 2], far = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const rock = (p) => { const s = [F[CX], F[CY], F[CZ]]; [F[CX], F[CY], F[CZ]] = p; sd(0); [F[CX], F[CY], F[CZ]] = s; return CS[0]; };
  const line = (o, i) => {
    const e = []; let r = 0, v, a, b, d = -1;
    for (let p = 0; p < o.parts; p++) { o.at(o.list, i * 8, p); v = [ZP[3], ZP[4], ZP[5]]; e.push([ZP[0], ZP[1], ZP[2]], [ZP[0] + v[0], ZP[1] + v[1], ZP[2] + v[2]]); r = Math.max(r, ZP[7]); }
    for (const p of e) for (const q of e) if (far(p, q) > d) { d = far(p, q); a = p; b = q; }
    if ((b[0] - a[0]) * v[0] + (b[1] - a[1]) * v[1] + (b[2] - a[2]) * v[2] < 0) [a, b] = [b, a];
    return [...a, b[0] - a[0], b[1] - a[1], b[2] - a[2], r];
  };
  const at = (o, i, t) => { F[TIME] = t; return line(o, i); };
  const all = (T) => {
    const out = [];
    F[CX] = F[CZ] = 0; F[CY] = 1e4;
    for (let m = 0, n = 0; m < ZA.length; m++) if (ZA[m].k === k) for (let i = 0; i < ZA[m].list.length / 8; i++, n++) {
      const o = ZA[m], l = at(o, i, T), c = mid(l);
      out.push({ n, m, i, l, moves: [3.7, 11.3, 23.9].some((d) => far(mid(at(o, i, T + d)), c) > 1e-6) });
    }
    F[TIME] = T; return out;
  };
  const chosen = (m) => { own.length = 0; if (m >= 0) for (const q of KINDS) if (q.data === ZA[m].list) own.push([q, q.n]); return own.length; };
  const patch = (q) => !!q.glass && own.some(([o]) => !o.glass);
  const cam = (ps, p, t, yaw, pit, hide) => {
    F[PS] = ps; lookAt(...p, ...t); if (yaw !== null) { F[YAW] = yaw; F[PIT] = pit; }
    F[VX] = F[VY] = F[VZ] = 0;
    for (const [q, n] of own) q.n = hide && patch(q) === (hide === 1) ? 0 : n;
    return 0;
  };
  const free = (p, t) => { let ok = rock(p) < -0.6; for (let s = 0.2; ok && s < 0.9; s += 0.2) ok = rock(p.map((v, j) => v + (t[j] - v) * s)) < -0.1; return ok; };
  const draw = async (T) => { F[TIME] = T; zooOff(); render(); render(); await Q.onSubmittedWorkDone(); return 0; };
  return { k, ids: ZK, name: ZOO[id].name, tanh: TANH, near: NEAR, sun: ERA.sun, all, chosen, at: (m, i, T) => at(ZA[m], i, T), cam, rock, free, draw };
};

const c = await connect();
await c.desktop();
await c.open(harness(era)); await sleep(500); await c.loaded();
const tt = (call) => c.w('__tt.' + call);
await c.w(`ui(false); body.className = 'g p'; frame = () => {}; F[TIME] = ${time}; pix = PIXMAX; det = 1; dynT = -Infinity; resize(); zooOff(); window.__tt = (${inpage})(${js(id)}); 0`);
const I = await c.ev('({ k: __tt.k, ids: __tt.ids, name: __tt.name, tanh: __tt.tanh, near: __tt.near, sun: __tt.sun })');
if (I.k < 0) { console.log(`${id}: not found. ids: ${I.ids.join(', ')}`); await c.done(); process.exit(1); }
await sleep(2600);
console.log('canvas', await c.w("W + 'x' + H"));

const add = (a, b, s = 1) => a.map((v, i) => v + b[i] * s), len = (a) => Math.hypot(...a), unit = (a) => a.map((v) => v / len(a)), cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const mid = (l) => add(l, l.slice(3, 6), 0.5).slice(0, 3);
const size = (l) => l[6] + Math.max(len(l.slice(3, 6)), l[6]);

const L = await tt(`all(${time})`);
L.sort((a, b) => b.moves - a.moves || size(b.l) - size(a.l));
const e = L[0], t0 = mid(e.l), v = e.l.slice(3, 6), S = size(e.l), d = S / (2 * I.tanh * fill);
let h = len(v) > 1e-6 ? unit(v) : [0, 0, 1];
if (Math.hypot(h[0], h[2]) < 0.5) h = [0, 0, 1];
const s = Math.asin(h[1]), hl = unit([h[0], 0, h[2]]), u = [-Math.sin(s) * hl[0], Math.cos(s), -Math.sin(s) * hl[2]], r = cross(h, u);
const lit = Array.isArray(I.sun) && r[0] * I.sun[0] + r[1] * I.sun[1] + r[2] * I.sun[2] < 0 ? -1 : 1;
const D = Math.PI / 180;
const turn = ([f, r, u], az, el) => f.map((_, i) => (f[i] * Math.cos(az * D) + r[i] * Math.sin(az * D)) * Math.cos(el * D) + u[i] * Math.sin(el * D));
const spot = (az, el) => add(t0, turn([h, r, u], az * lit, el), d);

const low = (await tt(`rock(${js(spot(0, -90))})`)) > -0.05;
const sizes = low ? [0.01] : [1, 0.1, 0.01].filter((q) => I.near * q <= d / 5);
const ps = sizes.length ? sizes[0] : 0.01;
await tt(`chosen(${e.m})`);
console.log(`${I.name}: number ${e.n}, size ${S.toFixed(3)}, d ${d.toFixed(2)} m, ps ${ps}`);

const outDir = outFile('turntable', label, '');
mkdirSync(outDir, { recursive: true });

const shot = async (name, p, target, usePs, yawV, pitV) => {
  const f = outFile('turntable', label, `${id}-${name}.png`);
  await tt(`cam(${usePs}, ${js(p)}, ${js(target)}, ${js(yawV)}, ${pitV}, 0)`);
  await tt(`draw(${time})`);
  await sleep(350);
  await c.shot(f);
  console.log(name);
};

// View 1: angle-level (40 degrees round, 4 degrees up — same as turntable)
await shot('angle-level', spot(40, 4), t0, ps, null, 0);

// View 2: diver at 2 m
const level = [hl, cross(hl, [0, 1, 0]), [0, 1, 0]];
const el = (await tt(`rock(${js(t0)})`)) > -0.5 ? 50 : 20;
let diverP = add(t0, turn(level, 40 * lit, el), 2);
await shot('diver', diverP, t0, 1, null, 0);

// View 3: side close-up at 2m from the head, with mo forced to show jaws (force mo via scene time)
const halfLen = len(v) / 2;
const nose = add(mid(e.l), h, halfLen);
const mouth = add(nose, h, -0.12);
const side2 = add(mouth, r.map(x => x * lit), 2.0);
side2[1] = mouth[1];
await shot('side-2m', side2, mouth, 0.01, null, 0);

console.log('done:', label);
const logs = c.news();
if (logs.length) console.log('console:\n' + logs.join('\n'));
await c.done();
process.exit(0);
