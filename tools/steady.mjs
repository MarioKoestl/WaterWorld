// Does a piece of the frame loop allocate once its code is compiled? The frame loop is stopped, the code is called
// in a tight loop with the camera turning, and the used JavaScript heap is read before and after. Cold code always
// allocates (every float is an object until the compiler has seen enough calls): what counts is the last rows.
//   node tools/steady.mjs [era] [call] [--mock]
// call: the code to measure, default "zoo()". It runs inside the bundle. --mock: with the stand-in for WebGPU, which
// is all this needs: no graphics card. Needs `npm run build:dev` and a running test Chrome.
import { connect, sleep } from './cdp.mjs';
import { harness } from './harness.mjs';

const args = process.argv.slice(2), plain = args.filter((a) => !a.startsWith('--')), era = plain[0] || 'today', call = plain[1] || 'zoo()', mock = args.includes('--mock');
const c = await connect();
await c.desktop(); if (mock) await c.mock();
await c.open(harness(era)); await sleep(500); await c.loaded(); await sleep(500);
// the camera in the culling cell with the most zoo places, turning a little with every call
await c.w(`frame = () => {}; ui(false); F[TIME] = 20;
  window.__spin = (n) => { for (let k = 0; k < n; k++) { F[YAW] += 0.0003; F[TIME] += 0.016; F[FX] = Math.cos(F[PIT]) * Math.sin(F[YAW]); F[FZ] = -Math.cos(F[PIT]) * Math.cos(F[YAW]); ${call}; } return 0; };
  { const Z = Wd.zoo; let best = 0; for (let i = 0; i < CELLS * CELLS; i++) if (Z.start[i + 1] - Z.start[i] > Z.start[best + 1] - Z.start[best]) best = i; const i = Z.start[best]; if (Z.n) lookAt(Z.data[i * ZN] + 1, Z.data[i * ZN + 1] + 1.5, Z.data[i * ZN + 2], Z.data[i * ZN], Z.data[i * ZN + 1], Z.data[i * ZN + 2]); render(); } 0`);
await sleep(300);
const use = async () => (await c.send('Runtime.getHeapUsage')).usedSize;
let last = 0;
for (const [label, n] of [['first 300 calls (cold code)', 300], ['next 3000', 3000], ['next 30000', 30000], ['next 200000 (compiled)', 200000], ['another 200000', 200000]]) {
  const a = await use(), t0 = Date.now();
  await c.ev(`__spin(${n})`);
  const b = await use(); last = (b - a) / n;
  console.log(`${label}: heap ${b >= a ? '+' : ''}${b - a} bytes = ${last.toFixed(2)} per call, ${((Date.now() - t0) / n * 1000).toFixed(1)} µs per call`);
}
console.log(Math.abs(last) < 1 ? `\n${call} does not allocate once it is compiled` : `\n${call} ALLOCATES about ${last.toFixed(0)} bytes per call`);
await c.done();
process.exit(Math.abs(last) < 1 ? 0 : 1);
