// Do the animals of an era keep to open water? Every animal that the zoo knows (zooMove in the era's makeWorld) is
// followed along its path for ten minutes of scene time, and its place is checked against the rock: the line the zoo
// has for it, and the points one radius (and a little room) to its sides and above it. An animal that keeps to the
// ground (it is no higher over it than one and a half times that radius) may have ground rising beside it as high as
// itself: for it the points to the sides are those level with its top. What stands higher is in its way.
//   node tools/ways.mjs [era] [--room 1.25] [--minutes 10]
// THIS NEEDS THE REAL SEA FLOOR, which the graphics card makes: look at `node tools/chrome.mjs status` first.
// era: default today. Needs `npm run build:dev` and a running test Chrome.
// For each kind it prints the nearest it comes to rock, how low it gets over the ground (an animal that keeps to the
// ground is meant to be low: that number is for reading, not a pass or fail), and how near it comes to the flight
// path and to the viewpoints, where an animal in front of the lens would spoil the picture.
// The check is as good as the zoo's place for the animal: a swarm is checked as the line through its middle.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { connect, sleep, checker, here } from './cdp.mjs';
import { needCard } from './card.mjs';
import { harness } from './harness.mjs';

const args = process.argv.slice(2), opt = (n) => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
const plain = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] || '').startsWith('--')), era = plain[0] || 'today';
const room = +(opt('--room') || 1.25), minutes = +(opt('--minutes') || 10);
await needCard();
const c = await connect(), ok = checker();
await c.desktop();
if (args.includes('--mock')) await c.mock(); // only to try the tool itself: the floor is a made-up one
await c.open(harness(era)); await sleep(500); await c.loaded(); await sleep(400);
await c.w(readFileSync(path.join(here, 'inpage.js'), 'utf8'));
await c.w('frame = () => {}; 0');
const rows = JSON.parse(await c.w(`(() => {
  const R = __z.rock, t0 = F[TIME], out = [], near = (list, x, y, z) => { let m = 1e9; for (const p of list) m = Math.min(m, Math.hypot(x - p[0], y - p[1], z - p[2])); return m; };
  // the flight path as it is flown, and the viewpoints where they stand (flyPts ends with the viewpoints at a made-up height)
  const fly = flyPts.slice(0, flyPts.length - ERA.views.length), views = ERA.views.map((p) => [p[0], p[1], p[2]]);
  for (const o of ZA) {
    const r = { id: ZK[o.k], n: o.list.length / 8 * o.parts, rock: -9, rockAt: '', low: 1e9, lowAt: '', fly: 1e9, view: 1e9, rad: 0 };
    for (let i = 0; i < o.list.length; i += 8) for (let p = 0; p < o.parts; p++) for (let t = 0; t < ${minutes * 60}; t += 0.5) {
      F[TIME] = t; o.at(o.list, i, p);
      const rad = ZP[7] * ${room}; r.rad = ZP[7];
      // sideways: level, across the line (or along x where the line stands upright)
      let sx = -ZP[5], sz = ZP[3]; const sl = Math.hypot(sx, sz); if (sl > 1e-6) { sx /= sl; sz /= sl; } else { sx = 1; sz = 0; }
      for (const s of [0, 0.5, 1]) {
        const x = ZP[0] + ZP[3] * s, y = ZP[1] + ZP[4] * s, z = ZP[2] + ZP[5] * s;
        let h = 0; while (h < 30 && R(x, y - h, z) < 0) h += 0.1;
        const ys = h < rad * 1.5 ? y + rad : y;
        const d = Math.max(R(x, y, z), R(x + sx * rad, ys, z + sz * rad), R(x - sx * rad, ys, z - sz * rad), R(x, y + rad, z), sl > 1e-6 ? -9 : Math.max(R(x, ys, z + rad), R(x, ys, z - rad)));
        const at = ' at ' + [x, y, z].map((v) => v.toFixed(1)).join(', ') + ' after ' + t + ' s (animal ' + i / 8 + ')';
        if (d > r.rock) { r.rock = d; r.rockAt = at; }
        if (h < r.low) { r.low = h; r.lowAt = at; }
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
  // rock() counts in units from the rock, below zero in water, and knows no more than one unit either way
  ok(`${r.id}: ${r.n} paths in open water, with ${room} times its radius of ${r.rad.toFixed(2)} to the sides and above`, r.rock < -0.05, r.rock < -0.05 ? `nearest to rock: ${(-r.rock).toFixed(2)}${r.rock <= -0.99 ? ' or more' : ''}${r.rockAt}` : `IN ROCK or touching it${r.rockAt}`);
  console.log(`      lowest over the ground: ${r.low.toFixed(1)}${r.lowAt}`);
  console.log(`      nearest to the flight path: ${r.fly.toFixed(1)}, to a viewpoint: ${r.view.toFixed(1)}${Math.min(r.fly, r.view) < r.rad + 1.5 ? '   <-- it can come in front of the lens' : ''}`);
}
const logs = c.news(); console.log(logs.length ? 'console:\n' + logs.join('\n') : 'console: no messages');
const fails = ok.done();
await c.done();
process.exit(fails ? 1 : 0);
