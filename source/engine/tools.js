// ============================================================================
// world tools: what every era builds its world with (load-time only)
// ============================================================================
// An era lists what it draws with kind() and scatters it in its makeWorld(W). W is what makeTools() returns: the
// stores for leaves, specks, bubbles and zoo places, and the questions one can ask the sea floor. After makeWorld the
// engine calls W.finish(), which packs everything for the graphics card.

// KINDS: what an era draws besides the ground, the leaves and the sprites, in drawing order. kind() adds one:
//   mesh     a function that returns the built mesh ({ vb, ib, nv }, see Mesh.build() in math.js)
// A thing that stands (it is drawn by W_SOLID with the era's materials):
//   solid    1
//   cells    1: its instances are sorted by culling cell and drawn up to `far` metres. Without it all are drawn
//   far      how far it is drawn. lodFrom, lod: from that distance on with the simpler mesh that lod() returns
//   shadow   1: it is in the shadow map, 0 or nothing: it casts no shadow
//   makeWorld adds its instances to k.at (a list, or with cells one list per culling cell): twelve floats each,
//   x y z, scale, the four of its turn (a quaternion), material, seed, texture scale (for loose rock, material 1: the
//   distance at which it has shrunk away, 0 for never), bobbing (above 0: up and down by that much, below 0: it sways)
// An animal (it brings its own shaders, see W_ANIM in shaders.js):
//   wgsl     its vertex and fragment shader, vs and fs their names
//   glass    1: it is see-through. It is drawn after everything solid and laid over it, far ones first: for that
//            the first three floats of its instances have to say about where each one is
//   makeWorld sets its instances: k.data, a Float32Array with eight floats each
const KINDS = [];
const kind = (k) => { KINDS.push(k); return k; };
// where in the frame's uniform buffer the era's tick() writes: the share of its second water at the camera, the exposure
const U_ZONE = 51, U_EXPO = 56;

// ---------------------------------------------------------------- terrain mesh from the density grid
function buildTerrain(D) {
  const sn = surfaceNets(D, NX, NY, NZ), nv = sn.nv, gp = sn.pos;
  const smp = sampler3(D, NX, NY, NZ);
  const vb = new ArrayBuffer(nv * 16), vf = new Float32Array(vb), v8 = new Int8Array(vb);
  const wp = new Float32Array(nv * 3), wn = new Float32Array(nv * 3);
  for (let k = 0; k < nv; k++) {
    const x = gp[k * 3], y = gp[k * 3 + 1], z = gp[k * 3 + 2], e = 0.8;
    let nx = smp(x - e, y, z) - smp(x + e, y, z), ny = smp(x, y - e, z) - smp(x, y + e, z), nz = smp(x, y, z - e) - smp(x, y, z + e);
    const l = hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    const X = OX + x * VS, Y = OY + y * VS, Z = OZ + z * VS;
    wp[k * 3] = vf[k * 4] = X; wp[k * 3 + 1] = vf[k * 4 + 1] = Y; wp[k * 3 + 2] = vf[k * 4 + 2] = Z;
    wn[k * 3] = nx; wn[k * 3 + 1] = ny; wn[k * 3 + 2] = nz;
    v8[k * 16 + 12] = round(nx * 127); v8[k * 16 + 13] = round(ny * 127); v8[k * 16 + 14] = round(nz * 127); v8[k * 16 + 15] = 127;
  }
  // bucket quads into the XZ culling grid
  const nq = sn.ni / 6, key = new Uint8Array(nq), cnt = new Uint32Array(CELLS * CELLS + 1);
  const lo = new Float32Array(CELLS * CELLS).fill(1e9), hi = new Float32Array(CELLS * CELLS).fill(-1e9);
  for (let q = 0; q < nq; q++) {
    const a = sn.idx[q * 6] * 3;
    const c = clamp(floor((wp[a] - OX) / CELLW), 0, CELLS - 1) + CELLS * clamp(floor((wp[a + 2] - OZ) / CELLW), 0, CELLS - 1);
    key[q] = c; cnt[c + 1]++;
    for (let j = 0; j < 6; j++) { const y = wp[sn.idx[q * 6 + j] * 3 + 1]; if (y < lo[c]) lo[c] = y; if (y > hi[c]) hi[c] = y; }
  }
  for (let c = 0; c < CELLS * CELLS; c++) cnt[c + 1] += cnt[c];
  const ib = new Uint32Array(sn.ni), fill = cnt.slice();
  for (let q = 0; q < nq; q++) { const o = fill[key[q]]++ * 6; for (let j = 0; j < 6; j++) ib[o + j] = sn.idx[q * 6 + j]; }
  return { vb, ib, nv, wp, wn, smp, start: cnt, lo, hi };
}

// ---------------------------------------------------------------- the tools for makeWorld
function makeTools(D, T, flyPts, views) {
  const gi = (x, y, z) => x + NX * (y + NY * z);
  const smp = T.smp;
  const Dw = (x, y, z) => smp((x - OX) / VS, (y - OY) / VS, (z - OZ) / VS);
  const nCells = CELLS * CELLS;
  const cellOf = (x, z) => clamp(floor((x - OX) / CELLW), 0, CELLS - 1) + CELLS * clamp(floor((z - OZ) / CELLW), 0, CELLS - 1);
  const big = Array.from({ length: nCells }, () => []), small = Array.from({ length: nCells }, () => []);
  const leaf = (L, x, y, z, len, yaw, tilt, wid, hA, type, s1, s2, bend) => { L[cellOf(x, z)].push(x, y, z, len, yaw, tilt, wid, hA, type, s1, s2, bend); };
  const glint = (...a) => { glints.push(...a); };
  // every solid kind of the era gets its store: one list, or one list per culling cell
  for (const k of KINDS) if (k.solid) k.at = k.cells ? Array.from({ length: nCells }, () => []) : [];
  // Zoo places (zoo.js): where the exhibits are that stay where they are. place() takes the id of the ZOO entry, the
  // two ends of a line, the reach around it and the radius of the thing itself. It calls no rnd(). A long line is cut
  // into pieces short enough for each to be found from the culling cell of its middle and that cell's eight neighbours
  const places = Array.from({ length: nCells }, () => []);
  const place = (id, ax, ay, az, bx, by, bz, reach, rad) => {
    const n = max(1, Math.ceil(hypot(bx - ax, bz - az) / 2 / (CELLW - reach))), dx = (bx - ax) / n, dy = (by - ay) / n, dz = (bz - az) / n;
    for (let i = 0; i < n; i++) places[cellOf(ax + dx * (i + 0.5), az + dz * (i + 0.5))].push(ax + dx * i, ay + dy * i, az + dz * i, dx, dy, dz, reach, rad, zooKind(id));
  };
  // a backdrop: a place for something as large as a wall. It counts only while the player looks at nothing else
  // (zoo.js knows it by its radius, which is stored below zero)
  const backdrop = (id, ax, ay, az, bx, by, bz, reach, rad) => place(id, ax, ay, az, bx, by, bz, reach, -rad);
  // the same for a line from a to b in the model space of a mesh that stands at p, turned by q
  const piece = (id, p, q, a, b, reach, rad) => {
    const at = (v) => { const [x, y, z, w] = q, tx = 2 * (y * v[2] - z * v[1]), ty = 2 * (z * v[0] - x * v[2]), tz = 2 * (x * v[1] - y * v[0]); return [p[0] + v[0] + w * tx + y * tz - z * ty, p[1] + v[1] + w * ty + z * tx - x * tz, p[2] + v[2] + w * tz + x * ty - y * tx]; };
    place(id, ...at(a), ...at(b), reach, rad);
  };
  const glints = [];
  // a spot f metres in front of viewpoint i and r metres to its right
  const rel = (i, f, r) => { const p = views[i]; let fx = p[3] - p[0], fz = p[5] - p[2]; const l = hypot(fx, fz); fx /= l; fz /= l; return [p[0] + fx * f - fz * r, p[2] + fz * f + fx * r]; };
  // bubbles: eight floats each (see vsBub). shade: how much of the light from above each cell of the half-size grid
  // swallows, for the skylight bake in finish(). An era adds to it where something tall and dense stands
  const bubbles = [], shade = new Float32Array((NX / 2) * (NY / 2) * (NZ / 2));

  // --- surface queries
  const fl = [];
  const floorsAt = (x, z) => {
    const ix = clamp(round((x - OX) / VS), 1, NX - 2), iz = clamp(round((z - OZ) / VS), 1, NZ - 2);
    fl.length = 0; let ceil = 3;
    for (let gy = NY - 2; gy >= 0; gy--) {
      const d = D[gi(ix, gy, iz)], da = D[gi(ix, gy + 1, iz)];
      if (da <= 0 && d > 0) { const y = OY + (gy + d / (d - da)) * VS; fl.push(y, min(ceil, 0) - y); } else if (da > 0 && d <= 0) ceil = OY + (gy + 0.5) * VS;
    }
    return fl;
  };
  const grad = (x, y, z) => {
    const e = 0.6; let nx = Dw(x - e, y, z) - Dw(x + e, y, z), ny = Dw(x, y - e, z) - Dw(x, y + e, z), nz = Dw(x, y, z - e) - Dw(x, y, z + e);
    const l = hypot(nx, ny, nz) || 1; return [nx / l, ny / l, nz / l];
  };
  // march from outside along -n to the surface
  const snap = (x, y, z, n) => {
    let px = x + n[0] * 2.5, py = y + n[1] * 2.5, pz = z + n[2] * 2.5, prev = Dw(px, py, pz);
    if (prev > 0) return null;
    for (let i = 0; i < 24; i++) {
      const qx = px - n[0] * 0.25, qy = py - n[1] * 0.25, qz = pz - n[2] * 0.25, d = Dw(qx, qy, qz);
      if (d > 0) { const t = prev / (prev - d); const p = [mix(px, qx, t), mix(py, qy, t), mix(pz, qz, t)]; return p.concat(grad(p[0], p[1], p[2])); }
      px = qx; py = qy; pz = qz; prev = d;
    }
    return null;
  };
  const pickV = () => ((rnd() * T.nv) | 0) * 3;
  const tangent = (n) => { let t = abs(n[1]) < 0.9 ? [n[2], 0, -n[0]] : [1, 0, 0]; const l = hypot(...t); t = t.map((v) => v / l); return [t, [n[1] * t[2] - n[2] * t[1], n[2] * t[0] - n[0] * t[2], n[0] * t[1] - n[1] * t[0]]]; };
  const nearFly = (x, y, z, r) => { for (const p of flyPts) if (hypot(x - p[0], z - p[2]) < r && y < p[1] + 3 && y > p[1] - 13) return true; return false; };
  const nearPose = (x, z, r = 3) => { for (const p of views) if (hypot(x - p[0], z - p[2]) < r) return true; return false; };
  const gy = (x, z) => { const f = floorsAt(x, z); return f.length ? f[f.length - 2] : -45; };
  // the same, exact: gy gives the top floor of the grid column nearest to x, z (on a slope a few centimetres off, in
  // steps), this one finds the surface at x, z itself, in the density field. For small things that must stand on the
  // ground or keep just above it. Where there is no surface within a metre of gy's, it gives gy's
  const gyExact = (x, z) => {
    const y0 = gy(x, z); let lo = y0 - 1, hi = y0 + 1;
    if (!(Dw(x, lo, z) > 0 && Dw(x, hi, z) <= 0)) return y0;
    for (let i = 0; i < 16; i++) { const m = (lo + hi) / 2; if (Dw(x, m, z) > 0) lo = m; else hi = m; }
    return (lo + hi) / 2;
  };
  // How far a ray from x, y, z along the unit vector d goes before it meets the terrain as it is drawn (its
  // triangles), up to len; -1 if it meets none. On rough rock the drawn surface and the one in the density field (Dw,
  // snap, gyExact) can be centimetres apart: for something small that has to sit on the rock the player sees
  const hitDrawn = (x, y, z, dx, dy, dz, len) => {
    // (a triangle is kept in the culling cell of its quad's first corner: the cells a metre round the ray as well)
    const { wp, ib, start } = T, ex = x + dx * len, ez = z + dz * len;
    const cx0 = clamp(floor((min(x, ex) - 1 - OX) / CELLW), 0, CELLS - 1), cx1 = clamp(floor((max(x, ex) + 1 - OX) / CELLW), 0, CELLS - 1);
    const cz0 = clamp(floor((min(z, ez) - 1 - OZ) / CELLW), 0, CELLS - 1), cz1 = clamp(floor((max(z, ez) + 1 - OZ) / CELLW), 0, CELLS - 1);
    let best = len + 1;
    for (let cz = cz0; cz <= cz1; cz++) for (let cx = cx0; cx <= cx1; cx++) {
      const c = cx + CELLS * cz;
      for (let q = start[c] * 6; q < start[c + 1] * 6; q += 3) {
        // (Moeller-Trumbore)
        const a = ib[q] * 3, b = ib[q + 1] * 3, e = ib[q + 2] * 3;
        const e1x = wp[b] - wp[a], e1y = wp[b + 1] - wp[a + 1], e1z = wp[b + 2] - wp[a + 2], e2x = wp[e] - wp[a], e2y = wp[e + 1] - wp[a + 1], e2z = wp[e + 2] - wp[a + 2];
        const px = dy * e2z - dz * e2y, py = dz * e2x - dx * e2z, pz = dx * e2y - dy * e2x, det = e1x * px + e1y * py + e1z * pz;
        if (det > -1e-12 && det < 1e-12) continue;
        const inv = 1 / det, tx = x - wp[a], ty = y - wp[a + 1], tz = z - wp[a + 2], u = (tx * px + ty * py + tz * pz) * inv;
        if (u < 0 || u > 1) continue;
        const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x, v = (dx * qx + dy * qy + dz * qz) * inv;
        if (v < 0 || u + v > 1) continue;
        const t = (e2x * qx + e2y * qy + e2z * qz) * inv;
        if (t >= 0 && t < best) best = t;
      }
    }
    return best <= len ? best : -1;
  };
  // drifting particles: four random numbers each, drawn around the camera wherever it is
  let snowData = new Float32Array(0);
  const snow = (n) => { snowData = new Float32Array(n * 4); for (let i = 0; i < snowData.length; i++) snowData[i] = rnd(); };
  // gm, the ground map: 512 x 512 times four bytes over the 384 m of the world. Its third byte is the share of the
  // era's second water (see zone() in shaders.js), the other three are for the era's materials. Empty unless the era
  // fills one and puts it here
  const W = { D, T, flyPts, views, Dw, cellOf, big, small, leaf, glint, place, backdrop, piece, rel, bubbles, shade, floorsAt, grad, snap, pickV, tangent, nearFly, nearPose, gy, gyExact, hitDrawn, snow, gm: new Uint8Array(512 * 512 * 4) };
  // after makeWorld: everything packed the way the graphics card gets it
  W.finish = () => {
    // --- pack leaves (36 bytes: 8 floats + 4 unorm8), sorted by culling cell
    const pack = (L, step = 1, wm = 1) => {
      let n = 0; const start = new Uint32Array(nCells + 1);
      for (let c = 0; c < nCells; c++) { start[c] = n; n += Math.ceil(L[c].length / 12 / step); }
      start[nCells] = n;
      const buf = new ArrayBuffer(n * 36), f = new Float32Array(buf), u8 = new Uint8Array(buf), lo = new Float32Array(nCells).fill(1e9), hi = new Float32Array(nCells).fill(-1e9);
      let k = 0;
      for (let c = 0; c < nCells; c++) { const a = L[c]; for (let i = 0; i < a.length; i += 12 * step, k++) {
        for (let j = 0; j < 8; j++) f[k * 9 + j] = a[i + j];
        f[k * 9 + 6] *= wm;
        u8[k * 36 + 32] = a[i + 8]; u8[k * 36 + 33] = a[i + 9] * 255; u8[k * 36 + 34] = a[i + 10] * 255; u8[k * 36 + 35] = a[i + 11] * 255;
        const y = a[i + 1], l = a[i + 3]; if (y - l < lo[c]) lo[c] = y - l; if (y + l > hi[c]) hi[c] = y + l;
      } }
      return { buf, n, start, lo, hi };
    };

    // --- half-res volume: r = openness, g = skylight
    const hx = NX / 2, hy = NY / 2, hz = NZ / 2, volD = new Uint8Array(hx * hy * hz * 2);
    let Lp = new Float32Array(hx * hz).fill(1), Ln = new Float32Array(hx * hz), tmp = new Float32Array(hx * hz);
    for (let y = hy - 1; y >= 0; y--) {
      for (let z = 0; z < hz; z++) for (let x = 0; x < hx; x++) { const i = x + hx * z; tmp[i] = (Lp[x > 0 ? i - 1 : i] + 2 * Lp[i] + Lp[x < hx - 1 ? i + 1 : i]) * 0.25; }
      for (let z = 0; z < hz; z++) for (let x = 0; x < hx; x++) {
        const i = x + hx * z, b = (tmp[z > 0 ? i - hx : i] + 2 * tmp[i] + tmp[z < hz - 1 ? i + hx : i]) * 0.25;
        const g0 = gi(x * 2, y * 2, z * 2);
        const d = (D[g0] + D[g0 + 1] + D[g0 + NX] + D[g0 + NX + 1] + D[g0 + NX * NY] + D[g0 + NX * NY + 1] + D[g0 + NX * NY + NX] + D[g0 + NX * NY + NX + 1]) * 0.125;
        const o = x + hx * (y + hy * z);
        const l = b * clamp(0.5 - d / 1.5, 0, 1) * (1 - min(shade[o], 0.5));
        Ln[i] = l;
        volD[o * 2] = clamp(0.5 - d / 12, 0, 1) * 255; volD[o * 2 + 1] = min(1, b) * 255;
      }
      const t = Lp; Lp = Ln; Ln = t;
    }

    const packC = (L) => {
      let n = 0; const start = new Uint32Array(nCells + 1);
      for (let c = 0; c < nCells; c++) { start[c] = n; n += L[c].length / 12; }
      start[nCells] = n;
      const data = new Float32Array(n * 12), lo = new Float32Array(nCells).fill(1e9), hi = new Float32Array(nCells).fill(-1e9);
      let k = 0;
      for (let c = 0; c < nCells; c++) { const a = L[c]; for (let i = 0; i < a.length; i += 12) { for (let j = 0; j < 12; j++) data[k++] = a[i + j]; lo[c] = min(lo[c], a[i + 1] - 3); hi[c] = max(hi[c], a[i + 1] + 3); } }
      return { data, n, start, lo, hi };
    };
    for (const k of KINDS) if (k.solid) { if (k.cells) Object.assign(k, packC(k.at)); else { k.data = new Float32Array(k.at); k.n = k.at.length / 12; } k.at = 0; }
    // zoo places sorted by culling cell, ZN floats each (zoo.js). ext: how far outside its cell a place of that cell
    // can still be within reach, so a search can leave out the cells that are too far away
    const packZ = (L) => {
      let n = 0; const start = new Uint32Array(nCells + 1), ext = new Float32Array(nCells);
      for (let c = 0; c < nCells; c++) { start[c] = n; n += L[c].length / ZN; }
      start[nCells] = n;
      const data = new Float32Array(n * ZN);
      for (let c = 0; c < nCells; c++) { const a = L[c]; data.set(a, start[c] * ZN); for (let i = 0; i < a.length; i += ZN) ext[c] = max(ext[c], a[i + 6] + hypot(a[i + 3], a[i + 5]) / 2); }
      return { data, n, start, ext };
    };
    return { gy, glints: new Float32Array(glints), big: pack(big), bigF: pack(big, 2, 1.5), small: pack(small), bubbles: new Float32Array(bubbles), volD, gm: W.gm, snow: snowData, zoo: packZ(places) };
  };
  return W;
}
const fract = (x) => x - floor(x);

// ---------------------------------------------------------------- meshes any era can use: a rock, a turned shape
function meshChunk(sd, sub = 2, det = sub > 2) {
  rseed(100 + sd);
  const pl = []; for (let i = 0; i < 4; i++) { const q = qRand(); pl.push([q[0], q[1], q[2], rr(0.8, 0.98)]); const l = hypot(q[0], q[1], q[2]) || 1; pl[i][0] /= l; pl[i][1] /= l; pl[i][2] /= l; }
  return icosphere(sub, (x, y, z) => {
    let r = 1 + (fbm(x * 1.6 + sd, y * 1.6, z * 1.6, 2) - 0.5) * 0.9 + (det ? (fbm(x * 4 + sd, y * 4, z * 4, 2) - 0.5) * 0.25 : 0);
    let px = x * r, py = y * r * 0.8, pz = z * r;
    for (const p of pl) { const d = px * p[0] + py * p[1] + pz * p[2] - p[3]; if (d > 0) { px -= p[0] * d; py -= p[1] * d; pz -= p[2] * d; } }
    return [px, py, pz];
  });
}
function meshLathe(prof, seg, lump, ribs = 0) {
  const m = new Mesh(), rings = [];
  for (const [r, h, ao] of prof) { const ring = []; for (let s = 0; s < seg; s++) { const a = s / seg * TAU, rl = r * (1 + lump * (fbm(cos(a) * 1.5 + h * 2, h * 3, sin(a) * 1.5, 2) - 0.5) + 0.07 * cos(ribs * a + h * 1.5)); ring.push(m.v(cos(a) * rl, h, sin(a) * rl, ao)); } rings.push(ring); }
  for (let k = 0; k < rings.length - 1; k++) for (let s = 0; s < seg; s++) { const s2 = (s + 1) % seg; m.quad(rings[k][s], rings[k + 1][s], rings[k + 1][s2], rings[k][s2]); }
  return m;
}
