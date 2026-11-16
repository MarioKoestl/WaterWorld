// A stand-in for WebGPU, injected into a page before its own script runs. Every call does nothing, so no graphics card
// is used and nothing is drawn. The one thing with content is the sea floor: where the page reads back the density
// field that its compute shader would have made, it gets a made-up one (rolling ground, a few rock towers, a ledge).
// With it the whole JavaScript of the page runs for real: loading, world generator, frame loop, zoo, keys.
(() => {
  const NX = 512, NY = 80, NZ = 512, VS = 0.75, OX = -192, OY = -56, OZ = -192;
  const P = () => new Proxy(function () {}, { get: (t, k) => (k === 'then' ? undefined : k === Symbol.toPrimitive ? () => 0 : P()), apply: () => P(), construct: () => P() });
  const hs = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 269.5 + z * 311.7) * 43758.5453; return s - Math.floor(s); };
  const noise = (x, y, z) => {
    const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z); let fx = x - ix, fy = y - iy, fz = z - iz;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
    const m = (a, b, t) => a + (b - a) * t, c = (dx, dy, dz) => hs(ix + dx, iy + dy, iz + dz);
    return m(m(m(c(0, 0, 0), c(1, 0, 0), fx), m(c(0, 1, 0), c(1, 1, 0), fx), fy), m(m(c(0, 0, 1), c(1, 0, 1), fx), m(c(0, 1, 1), c(1, 1, 1), fx), fy), fz);
  };
  const TOWERS = [[-35, -32, 9, -8], [-31, -5, 12, -14], [33, -36, 9, -9], [34, -11, 11, -16], [19, -15, 4.4, -6], [0, -106, 8, -2], [-82, -20, 10, -7], [-19, 70, 10, -6], [22, 73, 7, -11], [46, -1, 7, -17]];
  let cache = null;
  const field = () => {
    if (cache) return cache;
    const D = cache = new Float32Array(NX * NY * NZ);
    for (let z = 0; z < NZ; z++) for (let x = 0; x < NX; x++) {
      const X = OX + x * VS, Z = OZ + z * VS;
      const g0 = -45.5 + 7 * (noise(X * 0.02, 3, Z * 0.02) - 0.5) + 1.6 * (noise(X * 0.11, 9, Z * 0.11) - 0.5);
      let top = Math.hypot(X, Z) > 164 ? 2 : -1e3;
      for (const t of TOWERS) { const e = Math.hypot(X - t[0], Z - t[1]) - t[2]; if (e < 0) top = Math.max(top, Math.min(t[3], g0 - e * 2)); }
      const ledge = Math.hypot(X - 20, Z - 40) < 12 || Math.hypot(X + 50, Z + 30) < 9;
      for (let y = 0; y < NY; y++) {
        const Y = OY + y * VS; let d = Math.max(g0 - Y, top - Y);
        if (ledge) d = Math.max(d, 1.6 - Math.abs(Y + 28));
        if (d > -3 && d < 3) d += 1.4 * (noise(X * 0.31, Y * 0.31, Z * 0.31) - 0.5);
        d = Math.min(d, 3 - Y);
        if (x === 0 || z === 0 || x === NX - 1 || z === NZ - 1 || y === NY - 1) d = -1;
        D[x + NX * (y + NY * z)] = d;
      }
    }
    return D;
  };
  const queue = { writeBuffer() {}, writeTexture() {}, submit() {}, onSubmittedWorkDone: async () => {} };
  const device = new Proxy({
    queue, lost: new Promise(() => {}), addEventListener() {},
    createBuffer: (d) => ({ getMappedRange: () => (d.size === NX * NY * NZ * 4 ? field().buffer : new ArrayBuffer(d.size)), mapAsync: async () => {}, unmap() {}, destroy() {} }),
  }, { get: (t, k) => (k in t ? t[k] : k === 'then' ? undefined : P()) });
  const adapter = { features: { has: () => false }, info: {}, requestDevice: async () => device };
  Object.defineProperty(Navigator.prototype, 'gpu', { get: () => ({ requestAdapter: async () => adapter, getPreferredCanvasFormat: () => 'bgra8unorm' }) });
  const real = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (kind, ...a) { return kind === 'webgpu' ? P() : real.call(this, kind, ...a); };
  window.__mock = true;
})();
