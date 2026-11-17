// Do the animals of an era keep to open water, and those that live on the ground to the top of it? Every animal that
// the zoo knows (zooMove in the era's makeWorld) is followed along its path for ten minutes of scene time, and its
// place is checked against the rock: the line the zoo has for it, and the points one radius (and a little room) to its
// sides and above it. An animal that keeps to the ground (it is no higher over it than one and a half times that
// radius) may have ground rising beside it as high as itself: for it the points to the sides are those level with its
// top. What stands higher is in its way.
// Two measures of the rock. Away from the ground: the camera's collision field (rock() in inpage.js), which is coarse
// (a grid of 0.75 m, in steps of 8 mm) but knows how far the rock is in every direction. Near the ground (the middle of
// the zoo line less than NEAR over it): the terrain as it is drawn, its triangles, exact to well under a millimetre,
// asked straight up and down: how high a point is over the drawn ground under it, or how deep inside the rock it is.
// The collision field is centimetres off there, too much for an animal that walks on the mud or swims just over it.
//   node tools/ways.mjs [era] [--room 1.25] [--minutes 10]
// THIS NEEDS THE REAL SEA FLOOR, which the graphics card makes: look at `node tools/chrome.mjs status` first.
// era: default today. Needs `npm run build:dev` and a running test Chrome.
// For each kind it prints the nearest it comes to rock (away from the ground), and near the ground how high its line
// keeps over the drawn ground and whether any of its points is under it; how low it gets over the ground (an animal
// that keeps to the ground is meant to be low: that number is for reading, not a pass or fail), and how near it comes
// to the flight path and to the viewpoints, where an animal in front of the lens would spoil the picture.
// The check is as good as the zoo's place for the animal: a swarm is checked as the line through its middle.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { connect, sleep, checker, here } from './cdp.mjs';
import { needCard } from './card.mjs';
import { harness } from './harness.mjs';

const args = process.argv.slice(2), opt = (n) => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
const plain = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] || '').startsWith('--')), era = plain[0] || 'today';
const room = +(opt('--room') || 1.25), minutes = +(opt('--minutes') || 10), NEAR = 0.1;
await needCard();
const c = await connect(), ok = checker();
await c.desktop();
if (args.includes('--mock')) await c.mock(); // only to try the tool itself: the floor is a made-up one
await c.open(harness(era, { ground: true })); await sleep(500); await c.loaded(); await sleep(400);
await c.w(readFileSync(path.join(here, 'inpage.js'), 'utf8'));
await c.w('frame = () => {}; 0');
const rows = JSON.parse(await c.w(`(() => {
  const R = __z.rock, t0 = F[TIME], out = [], near = (list, x, y, z) => { let m = 1e9; for (const p of list) m = Math.min(m, Math.hypot(x - p[0], y - p[1], z - p[2])); return m; };
  // The drawn terrain (harness.mjs keeps it): its triangles sorted into bins of 25 cm, a culling cell at a time as the
  // checks come near it. drawn(x, y, z): how high the point is over the drawn surface under it, or below zero how deep
  // inside the rock it is (it is inside where a line straight up from it passes through the surface an odd number of
  // times); NaN where there is no surface under it
  const { wp, ib, start } = window.__ground, BIN = 0.25, bins = new Map(), done = new Set(), key = (i, j) => i * 100000 + j;
  const fill = (c) => {
    if (done.has(c)) return; done.add(c);
    for (let q = start[c] * 6; q < start[c + 1] * 6; q += 3) {
      const a = ib[q] * 3, b = ib[q + 1] * 3, d = ib[q + 2] * 3;
      const i0 = Math.floor((Math.min(wp[a], wp[b], wp[d]) - OX) / BIN), i1 = Math.floor((Math.max(wp[a], wp[b], wp[d]) - OX) / BIN);
      const j0 = Math.floor((Math.min(wp[a + 2], wp[b + 2], wp[d + 2]) - OZ) / BIN), j1 = Math.floor((Math.max(wp[a + 2], wp[b + 2], wp[d + 2]) - OZ) / BIN);
      for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) { const k = key(i, j); let L = bins.get(k); if (!L) bins.set(k, L = []); L.push(a, b, d); }
    }
  };
  const drawn = (x, y, z) => {
    // (a hair off, so that the line up never runs exactly along an edge of two triangles)
    x += 1.37e-7; z += 2.71e-7;
    const cx = Math.floor((x - OX) / CELLW), cz = Math.floor((z - OZ) / CELLW);
    for (let a = cz - 1; a <= cz + 1; a++) for (let b = cx - 1; b <= cx + 1; b++) if (a >= 0 && b >= 0 && a < CELLS && b < CELLS) fill(b + CELLS * a);
    const L = bins.get(key(Math.floor((x - OX) / BIN), Math.floor((z - OZ) / BIN))); if (!L) return NaN;
    let below = -Infinity, above = Infinity, n = 0;
    for (let e = 0; e < L.length; e += 3) {
      const a = L[e], b = L[e + 1], d = L[e + 2], ax = wp[a], az = wp[a + 2], bx = wp[b], bz = wp[b + 2], dx = wp[d], dz = wp[d + 2];
      const det = (bz - dz) * (ax - dx) + (dx - bx) * (az - dz); if (det === 0) continue;
      const u = ((bz - dz) * (x - dx) + (dx - bx) * (z - dz)) / det, v = ((dz - az) * (x - dx) + (ax - dx) * (z - dz)) / det;
      if (u < 0 || v < 0 || u + v > 1) continue;
      const h = u * wp[a + 1] + v * wp[b + 1] + (1 - u - v) * wp[d + 1];
      if (h > y) { n++; if (h < above) above = h; } else if (h > below) below = h;
    }
    return n % 2 ? y - above : below > -Infinity ? y - below : NaN;
  };
  // the flight path as it is flown, and the viewpoints where they stand (flyPts ends with the viewpoints at a made-up height)
  const fly = flyPts.slice(0, flyPts.length - ERA.views.length), views = ERA.views.map((p) => [p[0], p[1], p[2]]);
  for (const o of ZA) {
    // rock, rockAt: away from the ground, the nearest to rock; gn, n: how many of the checks were near the ground, of
    // all; gLine: the lowest a point of the line is over the drawn ground; gUnder, gDeep: how many points were under
    // it, and the deepest
    const r = { id: ZK[o.k], n: o.list.length / 8 * o.parts, rock: -9, rockAt: '', low: 1e9, lowAt: '', lowDrawn: false, fly: 1e9, view: 1e9, rad: 0,
      checks: 0, gn: 0, gLine: 1e9, gLineAt: '', gUnder: 0, gDeep: 0, gDeepAt: '' };
    for (let i = 0; i < o.list.length; i += 8) for (let p = 0; p < o.parts; p++) for (let t = 0; t < ${minutes * 60}; t += 0.5) {
      F[TIME] = t; o.at(o.list, i, p);
      const rad = ZP[7] * ${room}; r.rad = ZP[7];
      // sideways: level, across the line (or along x where the line stands upright)
      let sx = -ZP[5], sz = ZP[3]; const sl = Math.hypot(sx, sz); if (sl > 1e-6) { sx /= sl; sz /= sl; } else { sx = 1; sz = 0; }
      // near the ground: the middle of the line less than ${NEAR} m over the drawn ground (or in it)
      const cm = drawn(ZP[0] + ZP[3] / 2, ZP[1] + ZP[4] / 2, ZP[2] + ZP[5] / 2), low = cm < ${NEAR};
      r.checks++; if (low) r.gn++;
      for (const s of [0, 0.5, 1]) {
        const x = ZP[0] + ZP[3] * s, y = ZP[1] + ZP[4] * s, z = ZP[2] + ZP[5] * s;
        const at = ' at ' + [x, y, z].map((v) => v.toFixed(low ? 3 : 1)).join(', ') + ' after ' + t + ' s (animal ' + i / 8 + ')';
        let h = 0;
        if (low) h = drawn(x, y, z); else while (h < 30 && R(x, y - h, z) < 0) h += 0.1;
        const ys = h < rad * 1.5 ? y + rad : y;
        const pts = [[x, y, z], [x + sx * rad, ys, z + sz * rad], [x - sx * rad, ys, z - sz * rad], [x, y + rad, z]];
        if (!(sl > 1e-6)) pts.push([x, ys, z + rad], [x, ys, z - rad]);
        if (low) {
          // against the drawn ground: no point under it (where there is no drawn ground under a point, the field)
          if (h < r.gLine) { r.gLine = h; r.gLineAt = at; }
          for (const q of pts) {
            const g = drawn(q[0], q[1], q[2]);
            if (g === g) { if (g < 0) { r.gUnder++; if (g < r.gDeep) { r.gDeep = g; r.gDeepAt = at; } } }
            else { const d = R(q[0], q[1], q[2]); if (d > r.rock) { r.rock = d; r.rockAt = at; } }
          }
        } else {
          const d = Math.max(...pts.map((q) => R(q[0], q[1], q[2])));
          if (d > r.rock) { r.rock = d; r.rockAt = at; }
        }
        if (h < r.low) { r.low = h; r.lowAt = at; r.lowDrawn = low; }
        r.fly = Math.min(r.fly, near(fly, x, y, z)); r.view = Math.min(r.view, near(views, x, y, z));
      }
    }
    out.push(r);
  }
  F[TIME] = t0;
  return JSON.stringify(out);
})()`));
if (!rows.length) console.log('This era has no animals that move.');
for (const r of rows) {
  // rock() counts in metres from the rock, below zero in water, and knows no more than one metre either way. The room
  // asked for away from the ground: 5 cm, or a quarter of the radius for an animal so small that it is meant to swim
  // just over the mud. Near the ground no point may be under the drawn ground
  const need = Math.min(0.05, 0.25 * r.rad), field = r.rock > -9, fine = (!field || r.rock < -need) && r.gUnder === 0;
  const share = r.gn / r.checks, parts = [];
  if (field) parts.push((r.rock < -need ? 'nearest to rock: ' : `IN ROCK or nearer than ${(need * 100).toFixed(1)} cm: `) + `${(-r.rock * 100).toFixed(1)} cm${r.rock <= -0.99 ? ' or more' : ''}${r.rockAt}`);
  if (r.gn) parts.push(`near the ground in ${(share * 100).toFixed(0)} % of the checks: ` + (r.gUnder ? `${r.gUnder} points UNDER the drawn ground, the deepest ${(-r.gDeep * 1000).toFixed(1)} mm${r.gDeepAt}` : `no point under the drawn ground, its line at least ${(r.gLine * 1000).toFixed(1)} mm over it${r.gLineAt}`));
  ok(`${r.id}: ${r.n} paths in open water${r.gn ? ' and on top of the ground' : ''}, with ${room} times its radius of ${r.rad.toFixed(3)} to the sides and above`, fine, parts.join('; '));
  console.log(`      lowest over the ground: ${r.lowDrawn ? (r.low * 1000).toFixed(1) + ' mm (drawn ground)' : (r.low * 100).toFixed(0) + ' cm'}${r.lowAt}`);
  console.log(`      nearest to the flight path: ${r.fly.toFixed(1)}, to a viewpoint: ${r.view.toFixed(1)}${Math.min(r.fly, r.view) < r.rad + 1.5 ? '   <-- it can come in front of the lens' : ''}`);
}
const logs = c.news(); console.log(logs.length ? 'console:\n' + logs.join('\n') : 'console: no messages');
const fails = ok.done();
await c.done();
process.exit(fails ? 1 : 0);
