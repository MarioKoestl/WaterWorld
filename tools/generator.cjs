// Does a change leave the world of an era as it was? Runs the world generator of two source trees here in Node, on the
// same made-up sea floor (the real one comes from a compute shader), and compares every buffer they produce: terrain,
// leaves, specks, bubbles, particles, zoo places, the instances and the meshes of every kind, the zoo's animals.
// No browser and no graphics card. It proves the same code path, not the same picture: for that see poses.mjs.
//   node --max-old-space-size=8192 tools/generator.cjs <sourceBefore> <sourceAfter> [era] [levels]
// era: default today. levels: detail levels to run, default 0,1,2 (about two minutes each).
// A tree to compare with: a copy of source/ made before the change, or the last commit:
//   mkdir tools/out/head; git archive HEAD source | tar -x -C tools/out/head      (reads Git, changes nothing)
const fs = require('fs'), path = require('path'), vm = require('vm');
const [srcA, srcB, era = 'today', levels = '0,1,2'] = process.argv.slice(2);
if (!srcB) { console.log('usage: node --max-old-space-size=8192 tools/generator.cjs <sourceBefore> <sourceAfter> [era] [levels]'); process.exit(2); }
const hash = (o) => { const b = ArrayBuffer.isView(o) ? new Uint8Array(o.buffer, o.byteOffset, o.byteLength) : o instanceof ArrayBuffer ? new Uint8Array(o) : new Uint8Array(new Float64Array(o).buffer); let x = 2166136261; for (let i = 0; i < b.length; i++) { x ^= b[i]; x = Math.imul(x, 16777619); } return b.length + ':' + (x >>> 0).toString(16); };
const el = () => ({ children: [{}, {}, { children: [] }, {}], firstChild: {}, nextSibling: { setAttribute() {} }, setAttribute() {}, scrollIntoView() {} });
// one tree, loaded the way build.mjs joins a page, up to the zoo (which the generator registers its exhibits with)
const load = (src, lv) => {
  const eraDir = path.join(src, 'eras', era);
  const files = [...['quality.js', 'math.js', 'tools.js'].map((f) => path.join(src, 'engine', f)), ...fs.readdirSync(eraDir).filter((f) => f.endsWith('.js')).sort().map((f) => path.join(eraDir, f)), path.join(src, 'engine', 'zoo.js')];
  const box = { localStorage: { abyssal: String(lv) }, matchMedia: () => ({ matches: false }), navigator: { deviceMemory: 8 }, Math, console, location: { reload() {} }, document: { getElementById: el, querySelector: el, createElement: el, head: { append() {} }, body: {} },
    Float32Array, Float64Array, Uint8Array, Uint32Array, Int32Array, Int8Array, Uint16Array, ArrayBuffer, Set, Map, Array, Object };
  vm.createContext(box);
  vm.runInContext(files.map((f) => fs.readFileSync(f, 'utf8')).join('\n'), box);
  return (code) => vm.runInContext(code, box);
};
// a made-up sea floor with what a generator looks for: rolling ground, towers, a wall round the world, ledges with
// water under them (ceilings and second floors), rough surfaces
const FLOOR = `(() => {
  const D = new Float32Array(NX * NY * NZ), T = [[-35, -32, 9, -8], [-31, -5, 12, -14], [33, -36, 9, -9], [34, -11, 11, -16], [19, -15, 4.4, -6], [0, -106, 8, -2], [-82, -20, 10, -7], [-19, 70, 10, -6], [22, 73, 7, -11], [46, -1, 7, -17], [74, 14, 8, -15]];
  for (let z = 0; z < NZ; z++) for (let x = 0; x < NX; x++) {
    const X = OX + x * VS, Z = OZ + z * VS, g0 = -45.5 + 7 * (fbm(X * 0.011, 3, Z * 0.011, 4) - 0.5) + 1.6 * (fbm(X * 0.07, 9, Z * 0.07, 3) - 0.5);
    let top = hypot(X, Z) > 164 ? 2 : -1e3;
    for (const t of T) { const e = hypot(X - t[0], Z - t[1]) - t[2]; if (e < 0) top = max(top, min(t[3], g0 - e * 2)); }
    const ledge = hypot(X - 20, Z - 40) < 12 || hypot(X + 50, Z + 30) < 9;
    for (let y = 0; y < NY; y++) {
      const Y = OY + y * VS; let d = max(g0 - Y, top - Y);
      if (ledge) d = max(d, 1.6 - abs(Y + 28));
      if (d > -3 && d < 3) d += 1.4 * (vnoise(X * 0.31, Y * 0.31, Z * 0.31) - 0.5);
      d = min(d, 3 - Y);
      if (x === 0 || z === 0 || x === NX - 1 || z === NZ - 1 || y === NY - 1) d = -1;
      D[x + NX * (y + NY * z)] = d;
    }
  }
  return D;
})()`;
// everything the generator made, by name
const RESULT = `(() => {
  const out = {}, put = (name, v) => { out[name] = v; };
  for (const f of ['vb', 'ib', 'wp', 'wn', 'start', 'lo', 'hi']) put('terrain.' + f, __T[f]);
  for (const s of ['big', 'bigF', 'small']) for (const f of ['buf', 'start', 'lo', 'hi']) put(s + '.' + f, __W[s][f]);
  for (const f of ['glints', 'bubbles', 'volD', 'gm', 'snow']) put(f, __W[f]);
  for (const f of ['data', 'start', 'ext']) put('zoo.' + f, __W.zoo[f]);
  put('counts', [__T.nv, __W.big.n, __W.bigF.n, __W.small.n, __W.zoo.n, KINDS.length, ZA.length]);
  KINDS.forEach((k, i) => { const p = 'kind ' + i + (k.solid ? ' (solid)' : ' (animal)');
    for (const f of k.solid && k.cells ? ['data', 'start', 'lo', 'hi'] : ['data']) put(p + '.' + f, k[f] || []);
    put(p + '.settings', [k.solid | 0, k.cells | 0, k.shadow | 0, k.far || 0, k.lodFrom || 0, (k.vs || '').length, (k.fs || '').length, (k.wgsl || '').length]);
    const m = k.mesh(); put(p + '.mesh.vb', m.vb); put(p + '.mesh.ib', m.ib);
    if (k.lod) { const l = k.lod(); put(p + '.lod.vb', l.vb); put(p + '.lod.ib', l.ib); } });
  ZA.forEach((o, i) => { put('zoo animal ' + i + '.list', o.list); put('zoo animal ' + i + '.settings', [o.k, o.reach, o.parts]); });
  return out;
})()`;
const FLY = '(() => { const p = []; for (let i = 0; i < ERA.fly.length; i += 6) p.push([ERA.fly[i], ERA.fly[i + 1], ERA.fly[i + 2]]); for (const q of ERA.views) p.push([q[0], -40, q[2]]); return p; })()';

let bad = 0;
for (const lv of levels.split(',').map(Number)) {
  const t0 = Date.now(), A = load(srcA, lv), B = load(srcB, lv), D = A(FLOOR), res = [];
  for (const run of [A, B]) {
    run('globalThis.__take = (d) => { globalThis.__D = d; }'); run('__take')(D);
    run(`const __T = buildTerrain(__D), __tools = makeTools(__D, __T, ${FLY}, ERA.views); makeWorld(__tools); const __W = __tools.finish();`);
    const r = run(RESULT); res.push(Object.fromEntries(Object.entries(r).map(([k, v]) => [k, hash(v)])));
  }
  const [ra, rb] = res, names = [...new Set([...Object.keys(ra), ...Object.keys(rb)])], diff = names.filter((n) => ra[n] !== rb[n]);
  const n = A('[__T.nv, __W.big.n, __W.small.n, __W.zoo.n, KINDS.length]');
  console.log(`detail level ${lv}: ${names.length - diff.length} of ${names.length} buffers identical (${((Date.now() - t0) / 1000).toFixed(0)} s; made-up world: ${n[0]} terrain vertices, ${n[1]} large and ${n[2]} small leaves, ${n[3]} zoo places, ${n[4]} kinds)`);
  if (diff.length) { bad++; console.log('  DIFFERENT:\n  ' + diff.slice(0, 30).map((d) => `${d}: ${ra[d] || 'missing'} -> ${rb[d] || 'missing'}`).join('\n  ')); }
}
console.log(bad ? '\nTHE TWO TREES BUILD DIFFERENT WORLDS' : '\nboth trees build the same world');
process.exit(bad ? 1 : 0);
