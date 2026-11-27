// ============================================================================
// ordovician: the walker, the sea scorpion Megalograptus
// ============================================================================
// Megalograptus ohioensis, built in the round, new on 2026-11-26 after the rebuild order of qa/ordovician.md
// section M. The body is three forms in one line: the flat, roughly square head shield with its turned-down front
// edge and six small spikes; the broad low front body of six plates, each lapping over the next with a real edge;
// the narrow tail of telescoping rings, ending in the wide pretelson bulb, the black telson spike and the two
// large rounded cercal blades beside it. Six pairs of limbs, all out from under the head, round the mouth: the
// tiny chelicerae, the spined pedipalps, the massive spined great limbs held half folded as a basket (with the two
// very long thin spines ending in small oval pads that the figure shows), the spiny walking pair IV, the smooth
// longer pair V, and the swimming legs with broad flat pieces and an oval paddle. Every limb is a chain of equal
// hard pieces, each a little flattened and wider at its ends, with a short narrower ring of softer, paler skin at
// every joint. Figures: docs/research/ordovician/megalograptus.md, measured from figure 2 of GeoFacts 34 (checked
// again 2026-11-26). Living models: a horseshoe crab and a scorpion for shell, joints and bearing; the swimming
// leg of a swimming crab for the paddle. Colours from the fossils: dark brown with black scales, limbs darker
// toward their tips, the spike black; the figure draws paddles and cercal blades darker than the body.
// The walk machinery is that of the Cambrian walkers (see walkers_isotelus.js): each walker goes round a small
// polygon of its own in the plane of the drawn ground, measured at load time. It walks on pairs IV and V; the
// great limbs sway and feel ahead, the paddles lie folded back, the tail trails a little raised. Every 20 to 40 s
// it swims a burst (mgB), in a pose of its own: nose up, leaning into its round, the paddles rowing together.
// The mesh is modelled around the middle, nose at +z, y up, standing on the ground at y = 0, one unit long (head
// to telson tip): the instance says how large it is.
// Built in the round, not as a cut-out: section M3 of docs/briefs/qa/ordovician.md (2026-11-27) sets the
// thickness of body, head shield, plates, belly and tail rings, which no source gives.

// ---------------------------------------------------------------- the walker in figures
// l0..l1: 0.50 to 0.78 m (the card: up to 78 cm). Slow and deliberate, 2 to 5 cm/s; the round it walks (1.5 to
// 4 m in radius) comes from the placement (stage I3).
// nl: 2 walking pairs (IV and V). z0, dz, MXF: where their feet stand (pair V is the longer, so it stands wider).
// M4.2: they stand forward and out, beside the head shield, so that no foot comes behind z = 0.31 at any moment
// of a step (the foot slides half a stride, .5 * be * lam = .026, each way) and the paddle limb behind them has
// its own room. v0, v1: the speed. hb: clearance of the shell's edge over the ground. hd: the height of one
// standing still.
const MW = {
  l0: 0.50, l1: 0.78, lp: 0.6, z0: 0.41, dz: 0.05, nl: 2, lam: 0.08, be: 0.65, lf: 0.015,
  wave: 0.5, rp: 0.5, v0: 0.06, v1: 0.025, hc: 0.096, hh: 0.06, rb: 1.5, ra: 3.0, rf: 0.5, kd: 0.65,
  line: 0.5, rad: 0.14, hb: 0.060, hd: 0.068,
};
const MXF = [0.150, 0.190];
const mgNum = (v) => { const s = String(+v.toFixed(6)); return /[.e]/.test(s) ? s : s + '.'; };
const mgH = (n) => { const v = sin(n * 127.1 + 311.7) * 43758.5453; return v - floor(v); };

// ---------------------------------------------------------------- the body in figures (from figure 2)
// Joints of the six mesosoma plates and the six tail rings; half-widths and arch heights at the joints.
// No source gives the thickness: the fossils are pressed flat and figure 2 is a view from above, so the
// thickness is ours, estimated after the living models (horseshoe crab, scorpion) by section M3 of
// qa/ordovician.md. MHB is the clearance of the shell's edge over the mud, MRY the level of that edge, where
// back and belly meet: the back rises MG_TA over it, the belly hangs mgBD under it
const MHB = MW.hb;
const MRY = MHB + 0.009;
const MG_TJ = [0.30, 0.2533, 0.2067, 0.16, 0.1133, 0.0667, 0.02];
const MG_TW = [0.105, 0.109, 0.112, 0.111, 0.100, 0.085, 0.070];
// (M3.1: 0.050 over the edge at the widest plate, and the rear plates stay thick: the body does not flatten
// out before the tail, so the last plate still meets the first tail ring)
const MG_TA = [0.048, 0.050, 0.050, 0.048, 0.046, 0.044, 0.042];
const MG_RJ = [0.02, -0.032, -0.082, -0.128, -0.172, -0.212, -0.25];
const MG_RW = [0.056, 0.048, 0.042, 0.037, 0.0325, 0.029, 0.026];
// M3.1: how deep the belly hangs under the edge, 0.035 at the widest plate
const mgBD = (W) => 0.035 * (0.5 + 0.5 * W / 0.112);
// M3.2: the back at |u| of the half width. A low arch that turns down into a flank wall of MG_FL before the
// edge, so the side view shows a wall and not a line
const MG_FL = 0.015;
const mgArch = (a, A) => { const F = min(MG_FL, A * 0.6); return F * (1 - sstep(0.90, 1, a)) + (A - F) * pow(max(1 - min(a / 0.90, 1) ** 2, 0), 0.6); };
// M3.1/M3.4: the belly at |u| of the half width: a vault MG_BW as wide as the plates, with a flat shelf (the
// doublure) out to the edge
const MG_BW = 0.85;
const mgVault = (a, D) => D * pow(max(1 - min(a / MG_BW, 1) ** 2, 0), 0.45);
// the rows of the closed loop of a plate: the back from edge to edge, the rolled edge, the belly back again
const MG_UX = [-1, -0.97, -0.93, -0.86, -0.74, -0.58, -0.38, -0.14, 0.14, 0.38, 0.58, 0.74, 0.86, 0.93, 0.97, 1];
const MG_BX = [0.95, 0.86, 0.72, 0.56, 0.36, 0.12, -0.12, -0.36, -0.56, -0.72, -0.86, -0.95];
// the head shield's outline: roughly square, rounded front corners, 0.20 long
const MG_HK = [[0.284, 0.1045], [0.30, 0.105], [0.34, 0.107], [0.40, 0.103], [0.44, 0.097], [0.47, 0.085], [0.49, 0.068], [0.503, 0.048]];
const mgLerp = (J, V, z) => { let i = 0; while (i < J.length - 2 && z < J[i + 1]) i++; return mix(V[i], V[i + 1], clamp((J[i] - z) / (J[i] - J[i + 1]), 0, 1)); };
// the upper side of the head shield at x, z: M3.3, 0.060 over its edge in the middle, steeper sides than the
// plates (the same flank wall on a flatter dome), no raised rim, the front margin turned down as before
const MG_HA = 0.060;
const mgHeadY = (x, z) => {
  const W = wideAt(MG_HK, z), fz = max(1 - ((z - 0.372) / 0.150) ** 2, 0);
  return MRY + mgArch(min(abs(x) / W, 1), MG_HA * pow(fz, 0.35)) - 0.044 * pow(sstep(0.452, 0.503, z), 1.6);
};
// how deep the head shield's underside hangs under its edge: as deep as the first plate's belly at the rear,
// shallower forward, thin at the turned-down front margin
const mgHD = (z) => (0.034 - 0.016 * sstep(0.30, 0.42, z)) * (1 - 0.5 * pow(sstep(0.44, 0.505, z), 1.4));

// aux mapping:
//  0:    shell top (head, plates, rings, pretelson)
// -0.1:  the tucked front of a plate and the overhanging lip over it: the shadowed gap of the overlap
// -0.2:  the rolled edge of shell and plates
// -0.4:  the soft underside
// -0.5:  eye band  -0.85: ocelli  -0.6: bristles  -0.7: telson and the six front-edge spikes
//  .012...237: walking pair IV   .262...487: pair V   (the value is the way along the limb: the feet step)
//  .52...58: great limbs and their spines   .62...68: swimming legs and paddles
//  .72...78: pedipalps   .82...88: chelicerae   .92: cercal blades

// a limb: P equal pieces along a curve, each a little flattened (kd) and wider at its ends, with a short
// narrower ring at every joint (the softer skin the shaders colour paler). Returns a sampler along the curve
function mgLimb(m, ctrl, P, r0, r1, o) {
  const C = curve(ctrl, 48), al = [0];
  for (let i = 1; i < C.length; i++) al.push(al[i - 1] + hypot(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1], C[i][2] - C[i - 1][2]));
  const Lt = al[al.length - 1];
  const at = (s) => {
    const dd = clamp(s, 0, 1) * Lt; let i = 0;
    while (i < al.length - 2 && al[i + 1] < dd) i++;
    const u = (dd - al[i]) / max(al[i + 1] - al[i], 1e-9);
    return [0, 1, 2].map((q) => C[i][q] * (1 - u) + C[i + 1][q] * u);
  };
  const st = [];
  for (let i = 0; i < P; i++) {
    st.push([i / P, 0.52]);
    for (const q of [0.1, 0.3, 0.55, 0.8, 0.93]) st.push([(i + q) / P, 0.90 + 0.40 * pow(2 * q - 1, 2) * (q > 0.5 ? 1 : 0.7)]);
  }
  st.push([1, 0.45]);
  let ux = 0.31, uy = 0.9, uz = 0.3; const N = o.sides || 7, rings = [];
  for (const [s, rf] of st) {
    const p = at(s), a2 = at(s - 0.01), b2 = at(s + 0.01);
    let tx = b2[0] - a2[0], ty = b2[1] - a2[1], tz = b2[2] - a2[2]; const tl = hypot(tx, ty, tz) || 1; tx /= tl; ty /= tl; tz /= tl;
    let sx = uy * tz - uz * ty, sy = uz * tx - ux * tz, sz = ux * ty - uy * tx; const sl = hypot(sx, sy, sz) || 1; sx /= sl; sy /= sl; sz /= sl;
    ux = ty * sz - tz * sy; uy = tz * sx - tx * sz; uz = tx * sy - ty * sx;
    const r = (r0 + (r1 - r0) * pow(s, 1.15)) * rf, rs = r * (o.kw || 1.05), ru = r * (o.kd || 0.78), ring = [];
    for (let k = 0; k < N; k++) { const an = k / N * TAU, ca = cos(an), sa = sin(an); ring.push(m.v(p[0] + sx * ca * rs + ux * sa * ru, p[1] + sy * ca * rs + uy * sa * ru, p[2] + sz * ca * rs + uz * sa * ru, o.aux(s))); }
    rings.push(ring);
  }
  for (let j = 0; j < rings.length - 1; j++) for (let k = 0; k < N; k++) { const k2 = (k + 1) % N; m.quad(rings[j][k], rings[j][k2], rings[j + 1][k2], rings[j + 1][k]); }
  const e = at(1), tip = m.v(e[0], e[1], e[2], o.aux(1)), lastR = rings[rings.length - 1];
  for (let k = 0; k < N; k++) m.tri(lastR[k], lastR[(k + 1) % N], tip);
  const q0 = at(0), rt = m.v(q0[0], q0[1], q0[2], o.aux(0)), firstR = rings[0];
  for (let k = 0; k < N; k++) m.tri(firstR[(k + 1) % N], firstR[k], rt);
  return at;
}
// a spine: its widened foot starts inside its piece, it tapers and bows a little along its length. Its own
// frame, from whichever axis lies least along it (the shared tube() degenerates for a nearly vertical spine)
function mgSpn(m, p, d, len, r0, aux, bow = 0.05) {
  const dn = hypot(d[0], d[1], d[2]) || 1, dd = [d[0] / dn, d[1] / dn, d[2] / dn];
  const ax = abs(dd[1]) < 0.8 ? [0, 1, 0] : [1, 0, 0];
  let s1 = [dd[1] * ax[2] - dd[2] * ax[1], dd[2] * ax[0] - dd[0] * ax[2], dd[0] * ax[1] - dd[1] * ax[0]];
  const sl = hypot(s1[0], s1[1], s1[2]) || 1; s1 = s1.map((v) => v / sl);
  const s2 = [dd[1] * s1[2] - dd[2] * s1[1], dd[2] * s1[0] - dd[0] * s1[2], dd[0] * s1[1] - dd[1] * s1[0]];
  const R = [r0 * 1.6, r0 * 0.85, r0 * 0.5, r0 * 0.14], rings = [];
  [0, 0.35, 0.7, 1].forEach((s, j) => {
    const c = [p[0] + dd[0] * len * s, p[1] + dd[1] * len * s - bow * len * s * s, p[2] + dd[2] * len * s], ring = [];
    for (let k = 0; k < 4; k++) { const a = k / 4 * TAU, ca = cos(a), sa = sin(a); ring.push(m.v(c[0] + (s1[0] * ca + s2[0] * sa) * R[j], c[1] + (s1[1] * ca + s2[1] * sa) * R[j], c[2] + (s1[2] * ca + s2[2] * sa) * R[j], aux)); }
    rings.push(ring);
  });
  for (let j = 0; j < 3; j++) for (let k = 0; k < 4; k++) { const k2 = (k + 1) % 4; m.quad(rings[j][k], rings[j][k2], rings[j + 1][k2], rings[j + 1][k]); }
  const e = [p[0] + dd[0] * len, p[1] + dd[1] * len - bow * len, p[2] + dd[2] * len], tip = m.v(e[0], e[1], e[2], aux);
  for (let k = 0; k < 4; k++) m.tri(rings[3][k], rings[3][(k + 1) % 4], tip);
}
// a blade: a lens in cross-section, thick along its middle and thin to the edge, tapering along its length
function mgBlade(m, root, d, c, len, wide, thick, auxF, NS = 9, M = 10) {
  const dl = hypot(d[0], d[1], d[2]) || 1, dd = [d[0] / dl, d[1] / dl, d[2] / dl];
  const cl = hypot(c[0], c[1], c[2]) || 1, cc = [c[0] / cl, c[1] / cl, c[2] / cl];
  const u = [dd[1] * cc[2] - dd[2] * cc[1], dd[2] * cc[0] - dd[0] * cc[2], dd[0] * cc[1] - dd[1] * cc[0]];
  const rings = [];
  for (let j = 0; j <= NS; j++) {
    const s = j / NS, w = max(wide(s), 1e-4), t = max(thick(s), 2e-4), ring = [];
    for (let k = 0; k < M; k++) {
      const a = k / M * TAU, ca = cos(a), sa = sin(a);
      ring.push(m.v(root[0] + dd[0] * s * len + cc[0] * ca * w + u[0] * sa * t, root[1] + dd[1] * s * len + cc[1] * ca * w + u[1] * sa * t, root[2] + dd[2] * s * len + cc[2] * ca * w + u[2] * sa * t, auxF(s)));
    }
    rings.push(ring);
  }
  for (let j = 0; j < NS; j++) for (let k = 0; k < M; k++) { const k2 = (k + 1) % M; m.quad(rings[j][k], rings[j][k2], rings[j + 1][k2], rings[j + 1][k]); }
  const e0 = m.v(root[0], root[1], root[2], auxF(0)), e1 = m.v(root[0] + dd[0] * len, root[1] + dd[1] * len, root[2] + dd[2] * len, auxF(1));
  for (let k = 0; k < M; k++) { const k2 = (k + 1) % M; m.tri(rings[0][k2], rings[0][k], e0); m.tri(rings[NS][k], rings[NS][k2], e1); }
}

function meshMega(lo) {
  const m = new Mesh();
  if (lo) {
    // M3.8: the far mesh keeps the cross-sections of the near one, so the body is as deep from 18 m as it is
    // from 1 m. One loft from the spike to the front margin (its half-heights are half the real height, its
    // last number the height of the middle over the mud), the great limbs and paddles as coarse pieces
    const sh = (a) => { const c = cos(a), s = sin(a); return [c, s > 0 ? pow(s, 0.72) * 0.96 : 0 - pow(0 - s, 0.85)]; };
    loft(m, [[-0.50, 0.004, 0.004, 0.1000], [-0.40, 0.017, 0.013, 0.0955], [-0.300, 0.046, 0.034, 0.0900],
      [-0.252, 0.028, 0.027, 0.0890], [-0.12, 0.037, 0.032, 0.0845], [0.02, 0.058, 0.036, 0.0760],
      [0.21, 0.112, 0.0425, 0.0765], [0.34, 0.107, 0.0395, 0.0885], [0.44, 0.097, 0.0375, 0.0865],
      [0.502, 0.048, 0.010, 0.0580]], 2, 12, 0, sh);
    for (const sx of [-1, 1]) {
      m.tube(curve([[sx * 0.03, 0.072, 0.42], [sx * 0.15, 0.104, 0.52], [sx * 0.15, 0.106, 0.585], [sx * 0.08, 0.094, 0.655], [sx * 0.03, 0.074, 0.70]], 8), (j) => 0.013 - 0.0011 * j, 5, true, () => 0.55);
      // (the paddle keeps the arm's aux: from 18 m it sweeps with the limb, the blade is not turned on its own)
      slab(m, [sx * 0.105, 0.058, 0.274], [sx * 0.35, 0, -0.94], [0.94, 0, sx * 0.35], [0, 1, 0], 0.2,
        (s) => 0.012 + 0.022 * pow(max(1 - pow((s - 0.6) / 0.55, 2), 0), 0.7), () => 0.004, () => 0.640, 4);
      // the walking legs as two straight pieces each: the animal stands MHB over the mud and must not float
      m.tube([[sx * 0.030, 0.050, 0.398], [sx * 0.100, 0.066, 0.412], [sx * 0.150, 0.002, 0.420]], (j) => [0.011, 0.008, 0.003][j], 4, true, () => 0.12);
      m.tube([[sx * 0.028, 0.048, 0.366], [sx * 0.115, 0.064, 0.370], [sx * 0.190, 0.002, 0.360]], (j) => [0.009, 0.007, 0.003][j], 4, true, () => 0.37);
    }
    return m;
  }
  // ---- the head shield: closed rows (arched back with its flank wall, rolled edge, vaulted underside), the
  // rear rows the lip over plate one. M3.3: a real underside, not a flat lid
  const headLoop = (z, dy, auxT) => {
    const W = wideAt(MG_HK, z), D = mgHD(z), row = [];
    for (const u of MG_UX) row.push(m.v(u * W, mgHeadY(u * W, z) + dy * sstep(1, 0.80, abs(u)), z, auxT));
    row.push(m.v(W + 0.0055, MRY - 0.0035, z, -0.2));
    for (const u of MG_BX) row.push(m.v(u * W, MRY - mgVault(abs(u), D), z, -0.4));
    row.push(m.v(0 - W - 0.0055, MRY - 0.0035, z, -0.2));
    return row;
  };
  {
    const rows = [headLoop(0.287, -0.0040, -0.1), headLoop(0.294, -0.0018, -0.1), headLoop(0.301, 0, 0)];
    for (const z of [0.312, 0.328, 0.348, 0.37, 0.392, 0.414, 0.434, 0.452, 0.466, 0.478, 0.488, 0.496, 0.502]) rows.push(headLoop(z, 0, 0));
    const NL = rows[0].length;
    // (the loop runs clockwise seen from the front, so the stitch is the flipped one: normals point out)
    for (let j = 0; j < rows.length - 1; j++) for (let s = 0; s < NL; s++) { const s2 = (s + 1) % NL; m.quad(rows[j + 1][s], rows[j + 1][s2], rows[j][s2], rows[j][s]); }
    const fc = m.v(0, MRY - 0.006, 0.506, 0), bc = m.v(0, MRY + 0.014, 0.283, -0.1);
    const fr = rows[rows.length - 1], br = rows[0];
    for (let s = 0; s < NL; s++) { const s2 = (s + 1) % NL; m.tri(fr[s2], fr[s], fc); m.tri(br[s], br[s2], bc); }
  }
  // ---- six small spikes under the turned-down front edge, each well inside the margin (M2.4: none of them
  // may stand on the shield's upper side), pointing down, out and a little forward
  for (const [ax, az] of [[0.012, 0.497], [0.030, 0.491], [0.047, 0.483]]) for (const sx of [-1, 1]) {
    const x = sx * ax;
    mgSpn(m, [x, mgHeadY(x, az) + 0.001, az], [sx * 0.22, -0.90, 0.34], 0.016, 0.0022, -0.7, 0.03);
  }
  // ---- the six plates of the mesosoma: each tucked under the one in front, its rear edge lapping over the next
  for (let k = 0; k < 6; k++) {
    const zf = MG_TJ[k], zr = MG_TJ[k + 1], rows = [];
    // one cross-section: v how far along the plate (it swells a little in the middle), dy how far the back is
    // let down (faded out at the edge, so back and belly never cross), bs and ws how much of the belly's depth
    // and of the width this row has: a tucked row shrinks in both and hides inside its neighbour
    const top = (z, v, dy, auxT, backSweep, bs, ws) => {
      const zc2 = clamp(z, MG_TJ[6], MG_TJ[0]), Wb = mgLerp(MG_TJ, MG_TW, zc2), W = Wb * ws, row = [];
      const A = mgLerp(MG_TJ, MG_TA, zc2) + 0.0035 * sin(PI * clamp(v, 0, 1)), D = mgBD(Wb) * bs;
      for (const u of MG_UX) {
        const a = abs(u), zb = z - backSweep * pow(a, 4);
        row.push(m.v(u * W, MRY + mgArch(a, A) + dy * sstep(1, 0.80, a), zb, auxT));
      }
      row.push(m.v(W + 0.0055 * ws, MRY - 0.0035, z - backSweep, -0.2));
      for (const u of MG_BX) row.push(m.v(u * W, MRY - mgVault(abs(u), D), z, -0.4));
      row.push(m.v(0 - W - 0.0055 * ws, MRY - 0.0035, z - backSweep, -0.2));
      return row;
    };
    rows.push(top(zf + 0.009, 0, -0.018, -0.1, 0, 0.62, 0.90));
    rows.push(top(zf - 0.003, 0.08, -0.004, 0, 0, 0.94, 0.985));
    rows.push(top(zf + (zr - zf) * 0.4, 0.4, 0, 0, 0.002, 1, 1));
    rows.push(top(zf + (zr - zf) * 0.75, 0.75, 0, 0, 0.005, 1, 1));
    rows.push(top(zr + 0.010, 0.95, 0.0010, 0, 0.008, 1.02, 1));
    rows.push(top(zr + 0.003, 1, -0.0012, 0, 0.009, 1.0, 0.995));
    rows.push(top(zr - 0.006, 1, -0.020, -0.1, 0.009, 0.58, 0.88));
    const NL = rows[0].length;
    for (let j = 0; j < rows.length - 1; j++) for (let s = 0; s < NL; s++) { const s2 = (s + 1) % NL; m.quad(rows[j][s], rows[j][s2], rows[j + 1][s2], rows[j + 1][s]); }
    // M3.4: closed at both ends. Both caps are hidden inside the neighbouring plate, so nothing can be seen
    // into the animal from below or behind
    const cf = m.v(0, MRY + 0.004, zf + 0.011, -0.1), cr = m.v(0, MRY + 0.004, zr - 0.008, -0.1);
    for (let s = 0; s < NL; s++) { const s2 = (s + 1) % NL; m.tri(rows[0][s2], rows[0][s], cf); m.tri(rows[6][s], rows[6][s2], cr); }
    // a few short dark bristles out of the rear edge (the scales' bristles, where they show against the light)
    for (let b = 0; b < 6; b++) {
      const u = (mgH(k * 17 + b * 3) * 2 - 1) * 0.85, W = mgLerp(MG_TJ, MG_TW, zr), x = u * W;
      const y = MRY + mgArch(abs(u), mgLerp(MG_TJ, MG_TA, zr));
      m.tube([[x, y + 0.0005, zr + 0.002], [x, y - 0.002, zr - 0.009 - 0.004 * mgH(b * 7 + k)]], (j) => [0.0008, 0.0002][j], 3, true, () => -0.6);
    }
  }
  // ---- the tail: six telescoping rings, each clearly narrower and a little rounder than the one before, the
  // first grown out of the sixth plate, each rear rim flared over the tucked front of the next
  // M3.5: a ring is as tall as it is wide. The first blends out of the sixth plate's cross-section, so the
  // tail grows out of the body instead of being stuck on, and nothing steps at the joint
  const mgRY = (z) => { const u = clamp((0.02 - z) / 0.27, 0, 1); return MHB + 0.016 + 0.013 * u * u - 0.005 * sin(PI * u); };
  for (let k = 0; k < 6; k++) {
    const zf = MG_RJ[k], zr = MG_RJ[k + 1], e = 0.72 + 0.058 * k;
    const ring = (z, sc, dy, auxT) => {
      const Wb = mgLerp(MG_RJ, MG_RW, clamp(z, MG_RJ[6], MG_RJ[0])), W = Wb * sc, hH = W * e, row = [];
      // the tail rises a little toward the spike and sags between (M2.5)
      const cy = mgRY(z) + dy;
      for (let s = 0; s < 14; s++) { const a = s / 14 * TAU; row.push(m.v(cos(a) * W, cy + sin(a) * hH, z, auxT)); }
      return row;
    };
    const rows = [ring(zf + 0.012, k ? 0.78 : 0.94, -0.004, -0.1), ring(zf - 0.001, 0.96, 0, 0), ring(zf + (zr - zf) * 0.55, 1.0, 0, 0), ring(zr + 0.006, 1.02 + 0.035 * mgH(k * 7 + 3), 0, 0), ring(zr + 0.001 - 0.0015 * mgH(k * 3 + 1), 1.03 + 0.03 * mgH(k * 7 + 3), -0.0005, -0.1), ring(zr - 0.005 - 0.003 * mgH(k * 5 + 2), 0.62 + 0.05 * mgH(k * 11 + 5), -0.001 - 0.002 * mgH(k * 5 + 1), -0.1)];
    // (the rows run rearward, against the rings' turn, so the stitch is the flipped one: normals point out)
    for (let j = 0; j < rows.length - 1; j++) for (let s = 0; s < 14; s++) { const s2 = (s + 1) % 14; m.quad(rows[j + 1][s], rows[j + 1][s2], rows[j][s2], rows[j][s]); }
    // closed at both ends (M3.4), both caps inside the neighbouring piece
    const cf = m.v(0, mgRY(zf + 0.013), zf + 0.013, -0.1), cr = m.v(0, mgRY(zr - 0.007), zr - 0.007, -0.1);
    for (let s = 0; s < 14; s++) { const s2 = (s + 1) % 14; m.tri(rows[0][s], rows[0][s2], cf); m.tri(rows[5][s2], rows[5][s], cr); }
    for (let b = 0; b < 4; b++) {
      const a = (0.2 + 0.6 * mgH(k * 29 + b * 5)) * PI, W = mgLerp(MG_RJ, MG_RW, zr);
      const x = cos(a) * W, y = mgRY(zr) + sin(a) * W * e;
      m.tube([[x, y, zr + 0.002], [x * 1.05, y + 0.001, zr - 0.008]], (j) => [0.0007, 0.0002][j], 3, true, () => -0.6);
    }
  }
  // ---- the pretelson: the wide bulb the blades and the spike grow from, raised with the tail's end and as
  // deep as the rings before it (M3.5)
  loft(m, [[-0.312, 0.022, 0.018, 0.0885], [-0.295, 0.042, 0.030, 0.0890], [-0.272, 0.052, 0.038, 0.0895], [-0.252, 0.040, 0.032, 0.0890], [-0.240, 0.026, 0.023, 0.0885]], 2, 14, 0);
  // ---- the telson: a stout dagger whose broad base flares inside the bulb, tapering to a needle point,
  // carried a little upward. Black
  loft(m, [[-0.50, 0.0022, 0.0022, 0.1000], [-0.445, 0.009, 0.0055, 0.0970], [-0.385, 0.019, 0.009, 0.0945], [-0.335, 0.031, 0.014, 0.0925], [-0.295, 0.040, 0.018, 0.0910], [-0.270, 0.028, 0.015, 0.0900]], 2, 12, -0.7);
  // ---- the two cercal blades: large rounded blades out of the bulb's sides, they could close round the spike.
  // A lens in cross-section too: thick at the midrib, thin to the rounded edge
  for (const sx of [-1, 1]) {
    const dl = hypot(0.30, 0.02, 0.95), d = [sx * 0.30 / dl, -0.02 / dl, -0.95 / dl], c = [0.95 / dl, 0, sx * 0.30 / dl];
    mgBlade(m, [sx * 0.028, 0.0895, -0.262], d, c, 0.13,
      (s) => 0.010 + 0.026 * pow(max(1 - ((s - 0.55) / 0.6) ** 2, 0), 0.6),
      (s) => 0.0020 + 0.0075 * pow(max(1 - ((s - 0.3) / 0.75) ** 2, 0), 0.8), () => 0.92, 9, 10);
  }
  // ---- the compound eyes: kidney-shaped low mounds on top of the head near its front, the outer wall the dark
  // seeing band. The accepted tower of the trilobite (qa I4), scaled: a bean of 0.033 by 0.018, round side
  // outward, the lid a nearly flat cap rising out of the shield as a gentle ramp on the inner side
  for (const sx of [-1, 1]) {
    const xc = 0.060, zc = 0.440, EN = 22, HT = 0.012;
    const prof = [[0.0112, 0.72, 0], [0.0099, 0.93, 0], [0.0086, 1.045, 0], [0.0076, 1.02, 1], [0.0047, 1.05, 1], [0.0016, 1.0, 1], [-0.002, 1.07, 0]];
    const rings = prof.map(([h, rf, band]) => Array.from({ length: EN }, (_, j) => {
      const a = j / EN * TAU, co = cos(a), si = sin(a), u = sstep(0.02, 0.3, co);
      const ramp = 1.05 - (h + 0.002) / (HT + 0.002) * 0.6;
      const f = mix(ramp, rf + 0.05 * max(co, 0) * band, u);
      const rx = 0.009 * (1 + 0.15 * co) * f, rz = 0.0165 * f;
      const px = xc + rx * co, pz = zc + rz * si;
      return m.v(sx * px, mgHeadY(px, pz) + h, pz, band && u > 0.5 ? -0.5 : 0);
    }));
    for (let k = 0; k < rings.length - 1; k++) for (let j = 0; j < EN; j++) {
      const j2 = (j + 1) % EN;
      if (sx > 0) m.quad(rings[k][j], rings[k][j2], rings[k + 1][j2], rings[k + 1][j]);
      else m.quad(rings[k][j2], rings[k][j], rings[k + 1][j], rings[k + 1][j2]);
    }
    const top = m.v(sx * xc, mgHeadY(xc, zc) + HT + 0.0005, zc, 0);
    for (let j = 0; j < EN; j++) { const j2 = (j + 1) % EN; if (sx > 0) m.tri(rings[0][j2], rings[0][j], top); else m.tri(rings[0][j], rings[0][j2], top); }
  }
  // ---- the two ocelli between the eyes: small dark dots, nearly flush with the shield
  for (const sx of [-1, 1]) ball(m, [sx * 0.0055, mgHeadY(0.0055, 0.452) - 0.0008, 0.452], 0.0026, -0.85, 8, 5);
  // ---- under the head (M3.3): the swelling mass of the sternites and the roots of the limbs round the mouth,
  // inside the shield's edges. Behind the mesosoma it is gone: there the plates carry their own belly (M3.4)
  loft(m, [[0.272, 0.052, 0.013, 0.0500], [0.320, 0.070, 0.0145, 0.0495], [0.375, 0.079, 0.015, 0.0505], [0.425, 0.068, 0.0135, 0.0525], [0.462, 0.034, 0.009, 0.0560]], 2, 12, -0.4);
  // ---- the metastoma: the broadly triangular plate behind the mouth, between the roots of the hind limbs,
  // standing a little proud of the underside (Wikipedia, "Megalograptus", read through a summary)
  loft(m, [[0.286, 0.006, 0.0035, 0.0425], [0.303, 0.019, 0.0065, 0.0400], [0.330, 0.030, 0.0085, 0.0390], [0.360, 0.036, 0.0092, 0.0388], [0.386, 0.032, 0.0085, 0.0400], [0.400, 0.017, 0.005, 0.0425]], 2, 10, -0.4);
  // ---- the walking legs: pair IV short with whorls of spines at its joints, pair V longer, smooth, with small
  // claws. Both root under the head and come out from under its edge; the feet stand at MXF, MW.z0. M3.6: they
  // grew with the animal, which now stands MHB over the mud. M4.2: they carry it forward and out, beside the
  // head shield, with the knee above the shell's edge and clear of it, so that the paddle limb behind them has
  // the whole flank to itself
  for (const sx of [-1, 1]) {
    const q4 = 0.94 + 0.12 * mgH(sx + 3);
    const at4 = mgLimb(m, [[sx * 0.024, 0.050, 0.400], [sx * 0.075, 0.062, 0.410], [sx * 0.120, 0.080, 0.418], [sx * 0.145, 0.050, 0.421], [sx * 0.152, 0.014, 0.420], [sx * 0.150, 0.001, 0.420]], 5,
      0.0115 * q4, 0.0036 * q4, { sides: 9, kw: 1.05, kd: 0.80, aux: (s) => 0.012 + 0.225 * s });
    for (const sj of [0.2, 0.4, 0.6]) for (let q = 0; q < 4; q++) {
      const hq = mgH(sj * 40 + q * 7 + sx);
      if (hq < 0.14) continue;
      const p = at4(sj + 0.015 + 0.03 * mgH(q * 13 + sj * 9)), ln = 0.013 + 0.024 * hq;
      // no whorl spine points up: under the shield's edge they would stand through it and out of its top
      const dirs = [[sx * (0.6 + 0.3 * hq), 0.1, 0.35 - 0.4 * hq], [sx * 0.9, -0.1 - 0.3 * hq, 0.3], [sx * 0.55, -0.5, 0.45 - 0.5 * hq], [sx * (0.5 + 0.25 * hq), -0.2, -0.75]];
      mgSpn(m, p, dirs[q], ln, 0.0017, 0.012 + 0.225 * sj, 0.02 + 0.09 * mgH(q * 31 + sx));
    }
    mgSpn(m, at4(0.99), [sx * 0.3, -0.6, -0.3], 0.016, 0.0018, 0.237);
    const q5 = 0.94 + 0.12 * mgH(sx + 9);
    const at5 = mgLimb(m, [[sx * 0.022, 0.048, 0.368], [sx * 0.080, 0.060, 0.372], [sx * 0.140, 0.078, 0.372], [sx * 0.178, 0.046, 0.366], [sx * 0.192, 0.012, 0.361], [sx * 0.190, 0.001, 0.360]], 5,
      0.0095 * q5, 0.0028 * q5, { sides: 9, kw: 1.05, kd: 0.82, aux: (s) => 0.262 + 0.225 * s });
    mgSpn(m, at5(0.985), [sx * 0.4, -0.5, -0.25], 0.015, 0.0016, 0.487);
    mgSpn(m, at5(0.985), [sx * 0.15, -0.55, -0.5], 0.013, 0.0014, 0.487);
  }
  // ---- the great limbs: massive, half folded forward, a basket in front of the mouth. Combs of long curved
  // spines in two rows, uneven, each with a widened foot; two very long thin end spines with small oval pads
  for (const sx of [-1, 1]) {
    const atG = mgLimb(m, [[sx * 0.020, 0.054, 0.412], [sx * 0.090, 0.062, 0.468], [sx * 0.150, 0.090, 0.520], [sx * 0.150, 0.100, 0.585], [sx * 0.105, 0.094, 0.640], [sx * 0.058, 0.082, 0.675], [sx * 0.028, 0.072, 0.700]], 6,
      0.0155, 0.0050, { sides: 10, kw: 1.14, kd: 0.72, aux: (s) => 0.52 + 0.06 * s });
    // from the second piece on: the first lies under the head shield, its spines would stand through it
    for (let pc = 2; pc < 6; pc++) for (let sp = 0; sp < 3; sp++) {
      const hq = mgH(pc * 13 + sp * 5 + sx * 3);
      if (hq < 0.12) continue;
      const s = (pc + 0.14 + 0.28 * sp + 0.14 * mgH(pc * 7 + sp * 17 + sx)) / 6, p = atG(s);
      const ln = (0.026 + 0.082 * hq) * (1 - 0.22 * pc / 6);
      mgSpn(m, p, [0 - sx * (0.55 + 0.35 * hq), 0.1 - 0.35 * hq, 0.62], ln, 0.0030, 0.52 + 0.06 * s, 0.02 + 0.11 * mgH(pc * 3 + sp));
      const h2 = mgH(pc * 31 + sp * 11 + sx * 7), l2 = (0.022 + 0.068 * h2) * (1 - 0.22 * pc / 6);
      if (h2 > 0.18) mgSpn(m, atG(s + 0.04 + 0.03 * h2), [0 - sx * (0.22 + 0.3 * h2), 0.18, 0.90], l2, 0.0028, 0.52 + 0.06 * s, 0.015 + 0.1 * h2);
    }
    // the two long thin terminal spines, each ending in a small flattened oval pad (figure 2)
    for (const [so, ln, dx] of [[0.835, 0.175, 0.10], [0.90, 0.125, 0.22]]) {
      const p = atG(so), dn = hypot(dx, 0.12, 1), d = [0 - sx * dx / dn, 0.12 / dn, 1 / dn];
      m.tube([0, 0.3, 0.6, 0.85, 1].map((s) => [p[0] + d[0] * ln * s, p[1] + d[1] * ln * s - 0.02 * ln * s * s, p[2] + d[2] * ln * s]),
        (j) => [0.0030, 0.0020, 0.0016, 0.0013, 0.0011][j], 4, true, () => 0.578);
      ball(m, [p[0] + d[0] * ln, p[1] + d[1] * ln - 0.02 * ln, p[2] + d[2] * ln + 0.004], [0.0032, 0.0014, 0.0052], 0.578, 7, 4);
    }
    mgSpn(m, atG(0.995), [0 - sx * 0.5, -0.1, 0.85], 0.024, 0.0022, 0.578);
  }
  // ---- the pedipalps: forward between the great limbs, their distal pieces with combs of spines
  for (const sx of [-1, 1]) {
    const atP = mgLimb(m, [[sx * 0.016, 0.052, 0.438], [sx * 0.042, 0.056, 0.492], [sx * 0.066, 0.064, 0.540], [sx * 0.075, 0.066, 0.585], [sx * 0.064, 0.061, 0.618]], 4,
      0.0078, 0.0030, { sides: 8, kw: 1.06, kd: 0.80, aux: (s) => 0.72 + 0.06 * s });
    for (let sp = 0; sp < 4; sp++) {
      const hq = mgH(sp * 19 + sx * 5);
      const s = 0.52 + 0.13 * sp + 0.05 * mgH(sp * 7 + sx), p = atP(s);
      mgSpn(m, p, [0 - sx * (0.3 + 0.3 * hq), 0.15 + 0.3 * hq, 0.88], 0.014 + 0.026 * hq, 0.0018, 0.72 + 0.06 * s, 0.02 + 0.08 * hq);
    }
  }
  // ---- the chelicerae: tiny pincers at the front middle
  for (const sx of [-1, 1]) {
    const atC = mgLimb(m, [[sx * 0.011, 0.053, 0.488], [sx * 0.016, 0.052, 0.520], [sx * 0.014, 0.050, 0.545]], 2,
      0.0042, 0.0022, { sides: 6, kw: 1.0, kd: 0.85, aux: () => 0.85 });
    const p = atC(1);
    mgSpn(m, p, [sx * 0.25, -0.1, 0.95], 0.013, 0.0013, 0.87);
    mgSpn(m, p, [0 - sx * 0.2, -0.15, 0.95], 0.011, 0.0012, 0.87);
  }
  // ---- the swimming legs: broad, strongly flattened pieces out of the head's rear, folded back along the body,
  // then the oval paddle blade with a small claw at its tip (the swimming crab's leg, the living model).
  // M4.2: the limb leaves behind the walking legs (MG_PR) and lies back along the plates, a little off their
  // edge and well over the mud. Its aux keeps arm (.620 to .648) and blade (.652 to .682) apart, because the
  // shader turns the blade alone on its own long axis (M4.3)
  for (const sx of [-1, 1]) {
    mgLimb(m, [[sx * 0.042, 0.054, 0.300], [sx * 0.100, 0.058, 0.272], [sx * 0.145, 0.060, 0.240], [sx * 0.178, 0.058, 0.205]], 3,
      0.0160, 0.0120, { sides: 9, kw: 1.30, kd: 0.42, aux: (s) => 0.620 + 0.028 * s });
    // the blade: a lens in cross-section, thick along the middle, thin to the edge, hinged on the last piece;
    // its root starts inside the piece, so arm and blade share no open seam
    const dl = hypot(0.22, 0.04, 0.97), d = [sx * 0.22 / dl, -0.04 / dl, -0.97 / dl], c = [0.97 / dl, 0, sx * 0.22 / dl];
    const root = [sx * 0.178 - d[0] * 0.012, 0.058 - d[1] * 0.012, 0.205 - d[2] * 0.012];
    mgBlade(m, root, d, c, 0.135,
      (s) => 0.012 + 0.024 * pow(max(1 - ((s - 0.5) / 0.58) ** 2, 0), 0.6) * (1 - 0.25 * pow(s, 3)),
      (s) => 0.0012 + 0.0042 * pow(max(1 - ((s - 0.35) / 0.65) ** 2, 0), 0.8), (s) => 0.652 + 0.030 * s, 9, 10);
    // a fringe of short bristles along the blade's trailing edge (the swimming crab, the living model)
    for (let b = 0; b < 7; b++) {
      const s = 0.25 + 0.1 * b, w = 0.012 + 0.024 * pow(max(1 - ((s - 0.5) / 0.58) ** 2, 0), 0.6) * (1 - 0.25 * pow(s, 3));
      const p = [root[0] + d[0] * s * 0.135 + c[0] * w * 0.95, root[1] + d[1] * s * 0.135, root[2] + d[2] * s * 0.135 + c[2] * w * 0.95];
      m.tube([p, [p[0] + c[0] * 0.008, p[1] - 0.001, p[2] + c[2] * 0.008 - 0.004]], (j) => [0.0005, 0.00015][j], 3, true, () => 0.675);
    }
    mgSpn(m, [root[0] + d[0] * 0.130, root[1] + d[1] * 0.130, root[2] + d[2] * 0.130], [sx * 0.3, -0.2, -0.93], 0.018, 0.0020, 0.682);
  }
  return m;
}

// ---------------------------------------------------------------- shaders
const S_MEGA = /*wgsl*/`
const MG_Z0 = ${mgNum(MW.z0)}; const MG_DZ = ${mgNum(MW.dz)};
const MG_XF = array<f32, 2>(${MXF.map(mgNum).join(', ')});
const MG_LAM = ${mgNum(MW.lam)}; const MG_BE = ${mgNum(MW.be)}; const MG_LF = ${mgNum(MW.lf)}; const MG_WAVE = ${mgNum(MW.wave)};
const MG_RP = ${mgNum(MW.rp)}; const MG_V0 = ${mgNum(MW.v0)}; const MG_V1 = ${mgNum(MW.v1)};
const MG_HC = ${mgNum(MW.hc)}; const MG_HH = ${mgNum(MW.hh)}; const MG_KD = ${mgNum(MW.kd)};
const MG_BEND = .15; const MG_PIV = ${mgNum(MW.hb + 0.025)};
// The swimming burst (stage I3): every 20 to 40 s, each at its own time, the animal lifts 0.5 to 1.5 m off the
// mud, rows with both paddles together, travels 4 to 8 m along its round with the arms folded and the blades
// spread, glides down and walks on. Everything from one cycle, so nothing can jump (C1). Returns the extra way
// along the round (in body lengths), the lift over the plane (m) and how deep in the burst it is (0 walks,
// 1 swims). mgAt repeats this: change one, change the other
fn mgB(t: f32, sd: f32, L: f32) -> vec3f {
  let T = 20. + 20. * fract(sd * 11.3);
  let D = 6.5 + 2. * fract(sd * 5.9);
  let A = 4. + 4. * fract(sd * 3.3);
  let H = .5 + 1. * fract(sd * 7.7);
  let u = t / T + fract(sd * 13.1);
  let N = floor(u);
  let q = sat((u - N) * T / D);
  let e = q * q * (3. - 2. * q);
  let b = 16. * q * q * (1. - q) * (1. - q);
  let fw = ss(.04, .14, q) * ss(.97, .86, q);
  return vec3f((A / L) * (N + e), H * b, fw);
}
@vertex fn vsMega(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let L = i.b.z; let sd = fract(i.b.w); let au = i.n.w; let mv = abs(sign(i.a.w));
  let B = mgB(t, sd, L) * mv;
  let rwa = t * 7.5 + sd * 31.; // the stroke of the paddles: the swimming pose hangs on the same phase (M3.7)
  let w = wkOf(i.a, i.b, MG_RP); let s = wkS(t, w, sd, MG_V0 + MG_V1 * fract(sd * 7.3)) + B.x; let P = wkPose(s, w);
  var l = i.p; let sg = select(-1., 1., l.x > 0.);
  // every turn a limb makes below turns its normal with it, or the surface keeps the light of the pose it was
  // modelled in: a paddle blade swung broadside on would still be lit as if it lay flat, and read as a pale plate
  var nl = i.n.xyz;
  // the walking legs step: the value of au is the way along the limb, the foot at its end. While it swims
  // (B.z) the feet let go of the ground and the legs ride with the body, tucked a little
  let leg = step(.004, au) * step(au, .50);
  let tf = sat((au - .012 - .25 * step(.25, au)) / .225);
  let wl = leg * tf * (1. - B.z);
  var d = vec3f(0.);
  if (leg > 0. && mv > 0. && distance(g.cam.xyz, i.a.xyz) < 12. + abs(i.a.w)) {
    let k = step(.25, au); let f = vec2f(sg * MG_XF[u32(k)], MG_Z0 - k * MG_DZ);
    d = wkFoot(s, P, f, k * MG_WAVE, w, MG_LAM, MG_BE, MG_LF) - vec3f(f.x, 0., f.y);
  }
  // The great limbs are what feels ahead (M4.1: a sea scorpion has no antennae; some spines of these limbs end
  // in bulbs that may have been organs of sense). Each limb has its own clock, so the two are never in step: a
  // sweep from side to side and up and down once in 3 to 6 s, the angle growing with the square of the way
  // along the limb, so it bends in its joints and curls instead of turning as a stiff rod. Now and then the tip
  // taps the mud ahead, and every 15 to 30 s both close in front of the mouth and open again slowly
  let gl = step(.51, au) * step(au, .59); let tg3 = sat((au - .52) / .06);
  let gsd = fract(sd * 19.1 + .31 * sg + .5);
  let ga = t * 6.2831853 / (3. + 3. * gsd) + gsd * 37.;
  let gw = tg3 * tg3 * gl * mv * (1. - B.z);
  let tap = ss(.96, 1., sin(t * .33 + gsd * 23.));
  let bT = 15. + 15. * fract(sd * 7.1);
  let bu = fract(t / bT + fract(sd * 3.9));
  let bas = ss(0., .04, bu) * ss(.30, .08, bu) * mv * (1. - B.z);
  // (.42 moves the tip .12 to the side and .21 moves it .06 up and down, the figures of M4.1: the tip is .29
  // from the root. The basket closes by bringing the tips together and a little down, not by folding the limbs
  // under the head: they already meet in front of the mouth, and a turn at the root alone would carry them past
  // each other. The tap is a pose the limb goes to, not an angle added on, so a sweep that is already low
  // cannot drive the tip through the mud)
  let gyw = (sg * .42 * sin(ga) - sg * .16 * bas) * gw;
  let gpt = mix(.21 * sin(ga * .78 + gsd * 13.) - .12 * bas, -.26, tap) * gw;
  let cgy = cos(gyw); let sgy = sin(gyw); let cgp = cos(gpt); let sgp = sin(gpt);
  var gv = l - vec3f(sg * .020, .054, .412);
  gv = vec3f(gv.x, gv.y * cgp + gv.z * sgp, gv.z * cgp - gv.y * sgp);
  gv = vec3f(gv.x * cgy + gv.z * sgy, gv.y, gv.z * cgy - gv.x * sgy);
  l = vec3f(sg * .020, .054, .412) + gv;
  nl = vec3f(nl.x, nl.y * cgp + nl.z * sgp, nl.z * cgp - nl.y * sgp);
  nl = vec3f(nl.x * cgy + nl.z * sgy, nl.y, nl.z * cgy - nl.x * sgy);
  l = mix(l, vec3f(l.x * .4, l.y - .01, l.z * .6 + .07), B.z * gl * tg3);
  // the small limbs at the mouth: twice the searching movement they had (M4.6)
  let pd = step(.71, au) * step(au, .89); let tp = sat((au - .72) / .06) + sat((au - .82) / .06);
  l += vec3f(sg * .016 * sin(t * .6 + sd * 31. + sg), .010 * sin(t * .8 + sd * 19.), .008 * sin(t * .5 + sd * 7.)) * (pd * tp * mv);
  // The paddle limb rows like an oar (M4.3). It sweeps about its root: back along the plates at one end of the
  // stroke, out and a little forward at the other, and the blade turns on its own long axis, broad side against
  // the water on the way back and edge first on the way forward. During a burst both row fast together; between
  // bursts the limb lies folded and now and then makes one slow fanning stroke of its own
  let sp2 = step(.61, au) * step(au, .69); let tpd = sat((au - .62) / .06);
  let fnT = 11. + 8. * fract(sd * 23.7);
  let fnu = fract(t / fnT + fract(sd * 17.3) + .07 * sg);
  let fan = ss(0., .08, fnu) * ss(.56, .48, fnu) * (1. - B.z) * mv;
  let stp = mix(fnu / .56 * 6.2831853, rwa, B.z);
  let amp = max(B.z, fan);
  let bld = step(.650, au) * sp2;
  // the blade feathers first, on the axis it has while the limb lies back
  let fph = 1.5708 * ss(-.2, .5, sin(stp)) * amp * bld;
  let cfe = cos(fph); let sfe = sin(fph);
  let BA = vec3f(sg * .2210, -.0402, -.9745); let BR = vec3f(sg * .1753, .0585, .2167);
  var bv = l - BR;
  bv = bv * cfe + cross(BA, bv) * sfe + BA * dot(BA, bv) * (1. - cfe);
  l = BR + bv;
  nl = nl * cfe + cross(BA, nl) * sfe + BA * dot(BA, nl) * (1. - cfe);
  // then the whole limb sweeps, the socket at its root staying where it is
  let pro = sat((au - .6205) / .0045) * sp2;
  let ro = .52 * (.5 + .5 * cos(stp)) * amp * pro;
  let cro = cos(ro); let sro = sin(ro) * sg;
  var pv = l - vec3f(sg * .042, .054, .300);
  pv = vec3f(pv.x * cro - pv.z * sro, pv.y, pv.z * cro + pv.x * sro);
  l = vec3f(sg * .042, .054, .300) + pv;
  nl = vec3f(nl.x * cro - nl.z * sro, nl.y, nl.z * cro + nl.x * sro);
  l += vec3f(sg * .007 * sin(t * .4 + sd * 29.), .005 * sin(t * .55 + sd * 13.), .003 * sin(t * .5 + sd * 37.)) * (sp2 * tpd * mv);
  // the cercal blades open and close by .03 on their own slow time; while it swims they spread as a rudder (I3)
  let cb = step(.90, au) * step(au, .96);
  l.x += sg * (.015 + .015 * sin(t * .29 + sd * 41.) + .045 * B.z) * cb * mv;
  // the body bends about its own middle: sideways into a turn, the tail trailing a little raised, and while it
  // swims the tail bends at its joints too, up at the stroke and trailing between (M3.7)
  var zc = clamp(l.z, -.5, .5); let ze = l.z - zc;
  let da = (wkHead(s + MG_BEND * zc, w) - P.z) * mv;
  // M4.5: walking shows in the body. The head nods with every step (the step is s / MG_LAM), and the whole
  // animal rolls a little to the side with it: the roll is taken out of a leg that holds the ground (wl), so no
  // foot slides. M4.4: the tail lifts by 6 to 12 degrees, each animal its own, once in 6 to 10 s, and sinks
  // again (a positive tt lets it hang, so the lift is taken off)
  let stw = 6.2831853 * s / MG_LAM;
  let th = mv * (.015 * sin(t * .4 + sd * 20.) - .012 * ss(.5, 1., sin(t * .17 + sd * 47.)) + .022 * sin(stw + 1.1) * (1. - B.z));
  let tlf = (.105 + .105 * fract(sd * 29.3)) * (.5 - .5 * cos(t * 6.2831853 / (6. + 4. * fract(sd * 11.7)) + sd * 19.));
  let tt = mv * (.012 - tlf) + B.z * .085 * sin(rwa - .7);
  let u1 = sat((zc - .02) / .28); let u2 = sat((0. - zc - .02) / .3);
  let pa = th * u1 * u1 * (3. - 2. * u1) + tt * u2 * u2 * (3. - 2. * u2);
  let yc = th * (.28 * (u1 * u1 * u1 - .5 * u1 * u1 * u1 * u1) + max(zc - .3, 0.)) - tt * (.3 * (u2 * u2 * u2 - .5 * u2 * u2 * u2 * u2) + max(0. - zc - .32, 0.));
  let cp = cos(pa); let spa = sin(pa); let cy = cos(da); let sy = sin(da);
  let yr = l.y - MG_PIV; let z1 = ze * cp - yr * spa;
  var bd = vec3f(l.x * cy - z1 * sy - .5 * da * zc, MG_PIV + yc + yr * cp + ze * spa, zc + l.x * sy + z1 * cy);
  l = mix(bd, l, wl) + vec3f(d.x * wl, d.y * pow(wl, 2.5), d.z * wl);
  // while it swims the legs fold forward and in, under the head shield, out of the paddles' room (M4.2)
  l += vec3f(0. - sg * .105 * tf, .030 * tf, .055 * tf) * (B.z * leg);
  let n1 = vec3f(nl.x, nl.y * cp + nl.z * spa, nl.z * cp - nl.y * spa); var n = vec3f(n1.x * cy - n1.z * sy, n1.y, n1.x * sy + n1.z * cy);
  // Swimming is a pose of its own (M3.7): the whole animal noses up by 8 to 15 degrees, each its own, with a
  // little more at every stroke, and leans into the turn of its round with a small roll of the stroke. Both
  // turns are about the pivot in the middle of the body, and both come out of the burst's one phase: at the
  // ends of the burst B.z is 0 and the walker's level pose is back, so nothing jumps
  let nz = (.145 + .115 * fract(sd * 3.7) + .030 * sin(rwa * .5)) * B.z;
  let rl = (.055 * sin(rwa * .5 + 1.2) - .13 * sign(i.a.w)) * B.z + .030 * sin(stw) * mv * (1. - B.z) * (1. - wl);
  let cnz = cos(nz); let snz = sin(nz); let crl = cos(rl); let srl = sin(rl);
  let yq = l.y - MG_PIV;
  l = vec3f(l.x, MG_PIV + yq * cnz + l.z * snz, l.z * cnz - yq * snz);
  n = vec3f(n.x, n.y * cnz + n.z * snz, n.z * cnz - n.y * snz);
  let yv = l.y - MG_PIV;
  l = vec3f(l.x * crl - yv * srl, MG_PIV + yv * crl + l.x * srl, l.z);
  n = vec3f(n.x * crl - n.y * srl, n.y * crl + n.x * srl, n.z);
  let fr = wkFrame(i.b); let c = wkWorld(i.a, L, fr, P, vec3f(0., MG_HC, 0.));
  // the small rise at every stroke of the paddles rides on the burst's lift
  let wp = wkWorld(i.a, L, fr, P, l) + fr.N * (B.y + .014 * sin(rwa) * B.z) + wkGive(c, MG_KD * L, MG_HH * L, i.b) * mv;
  o.cp = g.vp * vec4f(wp, 1.); o.wp = wp; o.n = wkDir(fr, P, n); o.op = i.p; o.sd = floor(L * 4000.) + sd; o.lt = au;
  return o;
}
// The shell: dark brown with black scales (the sourced colour), the scales small bumps of uneven size, denser to
// the rear of each plate; the lapping edges shadowed; the limbs darker toward their tips with a paler, softer
// ring at every joint; paddles, cercal blades and the spike darker to black; the eye band the one glossy thing
@fragment fn fsMega(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let L = floor(i.sd) / 4000.; let sd = fract(i.sd); let lt = i.lt;
  let x = abs(i.op.x); let z = i.op.z;
  let leg = step(.004, lt) * step(lt, .50);
  let great = step(.51, lt) * step(lt, .59);
  let pad = step(.61, lt) * step(lt, .69);
  let ped = step(.71, lt) * step(lt, .79);
  let chel = step(.81, lt) * step(lt, .89);
  let cerc = step(.90, lt) * step(lt, .96);
  let telson = step(lt, -.65) * step(-.75, lt);
  let ocel = step(lt, -.80);
  let eyeB = step(-.55, lt) * step(lt, -.45);
  let brist = step(-.62, lt) * step(lt, -.58);
  let lip = step(-.15, lt) * step(lt, -.05);
  let edge2 = step(-.25, lt) * step(lt, -.15);
  let und = step(-.45, lt) * step(lt, -.35);
  let shell = step(-.04, lt) * step(lt, .003);
  let limb = leg + great + pad + ped + chel;
  let outer = shell * select(0., 1., ff); let inner = shell - outer;
  let tg = textureSample(tD, sR, vec2f(i.op.x * 37. + i.op.z * 21., i.op.z * 33. - i.op.x * 17.) + i.op.y * vec2f(27., 41.) + sd) * .5
    + textureSample(tD, sR, vec2f(i.op.x * 61. - i.op.z * 29., i.op.z * 67. + i.op.x * 41.) + i.op.y * vec2f(49., 29.) + .37) * .5;
  let fw = fwidth(z) + fwidth(x);
  let fine = ss(.02, .005, fw); let fdot = ss(.0045, .0018, fw); let ftg = ss(.01, .004, fw);
  let ns = normalize(i.n) * select(-1., 1., ff); let ny = ns.y;
  // the scales: small bumps of uneven size at two sizes; many of them black, denser rearward on every plate
  let w1 = wor(i.op * 210. + sd * 17.); let w2 = wor(i.op * 115. + sd * 29.); let w3 = wor(i.op * 340. + sd * 41.);
  let bump = ss(.30, .13, w1) * .5 + ss(.26, .10, w2) * .4 + ss(.26, .12, w3) * .25;
  let vseg = fract((.30 - z) / .0467) * step(z, .30) * step(.02, z);
  let hd2 = step(.30, z);
  let dens = .5 + .6 * vseg * vseg + .25 * ss(.4, .9, x / .11) + hd2 * (.3 + .35 * ss(.4, .95, x / .105) + .35 * ss(.44, .49, z));
  let dark = (.3 + .7 * ss(.45, .72, vn(i.op * 57. + sd * 7.))) * (ss(.22, .10, w1) + ss(.19, .08, w2) + .5 * ss(.20, .09, w3)) * dens;
  // the fringe of short dark marks along each tail ring's rear edge (figure 2)
  let ur = fract((.02 - z) / .045) * step(z, .02) * step(-.25, z);
  let fri = ss(.78, .93, ur) * ss(.45, .28, abs(fract(x * 80. + sd * 5.) - .5)) * step(0., ny);
  // M3.4: the belly is lapping plates like the back. The same segment phase as the back, so a plate's belly
  // ends where its back ends; the groove of the overlap as relief and as a shade
  let bseam = ss(.80, .97, vseg) * und;
  let n = skinRelief(ns, i.wp, ((.0004 * (tg.a - .5) * ftg + .0006 * bump * fdot) * (outer + .35 * und + .3 * limb) - .0012 * fri * fine * outer - .0011 * bseam * fine) * L * 1.6);
  // dark brown, each animal its own; the large a little darker
  let tone = fract(sd * 13.7); let hue = fract(sd * 5.3);
  var alb = mix(vec3f(.155, .085, .040), vec3f(.19, .115, .055), hue);
  alb = mix(alb, skinTone(alb, i.op * 5., ny, 1. - fdot, sd), .22);
  alb *= (.88 + .24 * mix(.5, tg.g, ftg)) * mix(.86, 1.14, tone) * mix(1.05, .88, ss(.55, .72, L));
  alb = mix(alb, vec3f(.05, .035, .02), sat(dark) * .65 * mix(.3, 1., fdot) * sat(outer + .5 * limb));
  alb = mix(alb, vec3f(.05, .04, .03), fri * .7 * outer);
  // a shade round the base of each eye, so the kidney reads from above too
  alb *= 1. - .3 * exp(0. - (pow((x - .060) / .024, 2.) + pow((z - .440) / .032, 2.))) * outer;
  // the shadowed gap under every lapping plate, and the rolled edge worn a little paler
  alb = mix(alb, vec3f(.055, .04, .024) * (.8 + .5 * tg.g), lip);
  alb = mix(alb, alb * 1.12 + vec3f(.012, .009, .005), edge2);
  // the underside: paler and warmer, in shade, darkest where it faces straight down and in the groove of
  // every lapping belly plate (M3.4)
  alb = mix(alb, mix(vec3f(.21, .15, .09), vec3f(.24, .175, .105), hue) * (.40 + .28 * tg.g + .24 * ss(.25, .85, 1. + ny)) * (1. - .34 * bseam), und);
  // the limbs: darker toward the tips, and at every joint the short narrower ring of softer, paler skin
  let tfL = sat((lt - .012 - .25 * step(.25, lt)) / .225);
  let tfG = sat((lt - .52) / .06); let tfPd = sat((lt - .62) / .06); let tfPp = sat((lt - .72) / .06); let tfCh = sat((lt - .82) / .06);
  let tfA = tfL * leg + tfG * great + tfPd * pad + tfPp * ped + tfCh * chel;
  let jv = tfL * 5. * leg + tfG * 6. * great + tfPd * 3. * pad + tfPp * 4. * ped + tfCh * 2. * chel;
  let fj = fract(jv); let dj = min(fj, 1. - fj);
  let jr = ss(.06, .02, dj) * ss(1.5, .5, fwidth(jv)) * limb * step(.02, tfA) * step(tfA, .98);
  alb = mix(alb, vec3f(.21, .13, .065), limb * .55);
  alb *= mix(1., mix(1., .52, pow(tfA, 1.4)), limb);
  alb = mix(alb, vec3f(.34, .26, .165), jr * .75);
  // the paddles and the cercal blades darker (the figure draws them so), the spike and the front spikes black
  alb = mix(alb, vec3f(.105, .085, .058) * (.8 + .4 * tg.g), pad * .75);
  alb = mix(alb, vec3f(.10, .08, .055) * (.8 + .4 * tg.g), cerc * .85);
  alb = mix(alb, vec3f(.038, .033, .028), telson);
  alb = mix(alb, vec3f(.05, .04, .032), brist);
  // the eye band: very dark, matte, with a fine even grain of facets from close up
  let gr = sin(i.op.z * 2600. + i.op.y * 800.) * sin(i.op.y * 2400. + i.op.z * 900. + i.op.x * 600.);
  alb = mix(alb, vec3f(.042, .037, .03) * (1. + .25 * gr * fdot), eyeB);
  alb = mix(alb, vec3f(.03, .027, .022), ocel);
  // the light of a dull shell: matte between the tubercles, no hot spot anywhere
  var c = skinLive(alb, n, ns, i.wp, 0., (.55 * tg.a + .75 * bump) * outer + .4 * limb, 0.);
  let Vw = normalize(g.cam.xyz - i.wp); let Hw = normalize(Vw + g.sun.xyz);
  let Ew = sunE(i.wp.y, zone(i.wp)) * shadow4(i.wp + n * .3);
  c += Ew * (pow(sat(dot(n, Hw)), 40.) * (.05 * outer + .15 * eyeB + .22 * telson) + pow(sat(dot(ns, Hw)), 70.) * (.12 * outer + .1 * limb + .15 * (pad + cerc)));
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;
const S_MEGA_SHADOW = /*wgsl*/`
@vertex fn vsMegaShadow(i: VI) -> VO {
  var o: VO;
  let L = i.b.z; let sd = fract(i.b.w); let mv = abs(sign(i.a.w));
  let B = mgB(g.cam.w, sd, L) * mv;
  let w = wkOf(i.a, i.b, MG_RP); let P = wkPose(wkS(g.cam.w, w, sd, MG_V0 + MG_V1 * fract(sd * 7.3)) + B.x, w);
  let fr = wkFrame(i.b); let c = wkWorld(i.a, L, fr, P, vec3f(0., MG_HC, 0.));
  let w0 = wkWorld(i.a, L, fr, P, vec3f(i.p.x * .55, 0., i.p.z * .72 - .02)); let sh = normalize(vec2f(g.sun.x, g.sun.z) + 1e-5);
  let so = sh * (((MG_HC * L + B.y) * .9 / max(g.sun.y, .25) + .7 * max(0. - dot((w0 - wkWorld(i.a, L, fr, P, vec3f(0., 0., -.02))).xz, sh), 0.)) * mv);
  let wp = w0 - vec3f(so.x, i.b.x * so.x + i.b.y * so.y, so.y) + fr.N * (min(.002, .05 * L) + .0003) + wkGive(c, MG_KD * L, MG_HH * L, i.b) * mv;
  o.cp = g.vp * vec4f(wp, 1.); o.wp = wp; o.n = fr.N; o.op = i.p; o.sd = sd; o.lt = 1. - .6 * sat(B.y);
  return o;
}
@fragment fn fsMegaShadow(i: VO) -> @location(0) vec4f {
  let a = .55 * i.lt * (1. - ss(.3, 1., length(i.op.xz)));
  return vec4f(fog(vec3f(0.), i.wp, zone(i.wp)) * a, a);
}
`;
function meshMegaShadow() {
  const m = new Mesh(), N = 20, c = m.v(0, 0, 0, 0), ring = [];
  for (let k = 0; k < N; k++) ring.push(m.v(cos(k / N * TAU), 0, sin(k / N * TAU), 0));
  for (let k = 0; k < N; k++) m.tri(c, ring[(k + 1) % N], ring[k]);
  return m;
}

// ---------------------------------------------------------------- where they are, for the zoo
// wkAt of the trilobite with the swimming burst of mgB on top (stage I3): the same numbers, so the line follows
// the animal through lift-off, row and glide. Change mgB, change this. Runs in every frame and allocates nothing
const mgAt = (a, i) => {
  const L = a[i + 6], f = a[i + 7], nn = floor(f), sd = f - nn, w = a[i + 3], dir = w > 0 ? 1 : w < 0 ? -1 : 0, rc = (w < 0 ? -w : w) / L;
  const A = TAU / nn, Lp = MW.rp * A, Ls = Lp + 2 * rc * sin(0.5 * A), q7 = sd * 7.3, v = MW.v0 + MW.v1 * (q7 - floor(q7));
  const u = F[TIME] * v * TAU / Ls + sd * 53.1;
  let s = (dir === 0 ? 0 : Ls) * (u - 4 / 3 * sin(u) + sin(2 * u) / 6) / TAU, lift = 0, bz = 0;
  if (dir !== 0) {
    const h1 = sd * 11.3, h2 = sd * 5.9, h3 = sd * 3.3, h4 = sd * 7.7, h5 = sd * 13.1;
    const T = 20 + 20 * (h1 - floor(h1)), D = 6.5 + 2 * (h2 - floor(h2)), Am = 4 + 4 * (h3 - floor(h3)), H = 0.5 + (h4 - floor(h4));
    const ub = F[TIME] / T + (h5 - floor(h5)), N = floor(ub), qb = min(max((ub - N) * T / D, 0), 1);
    s += (Am / L) * (N + qb * qb * (3 - 2 * qb));
    lift = H * 16 * qb * qb * (1 - qb) * (1 - qb);
    // how deep in the burst it is, the fw of mgB (the two smoothsteps written out: no call with a float here)
    const b1 = min(max((qb - 0.04) / 0.1, 0), 1), b2 = min(max((qb - 0.97) / -0.11, 0), 1);
    bz = b1 * b1 * (3 - 2 * b1) * b2 * b2 * (3 - 2 * b2);
  }
  const k = floor(s / Ls), r = s - k * Ls, ak = sd * 37.7 + k * A * dir, h = ak + dir * (PI / 2 + 0.5 * A), q = r < Lp ? r / Lp : 1;
  const ps = h - dir * A * (1 - q * q * (3 - 2 * q)), go = r > Lp ? r - Lp : 0, px = rc * cos(ak) + cos(h) * go, pz = rc * sin(ak) + sin(h) * go;
  const gx = a[i + 4], gz = a[i + 5], l1 = sqrt(1 + gx * gx), e1x = 1 / l1, e1y = gx / l1, l2 = sqrt(1 + gx * gx + gz * gz), nx = -gx / l2, ny = 1 / l2, nz = -gz / l2;
  const e2x = e1y * nz, e2y = -e1x * nz, e2z = e1x * ny - e1y * nx, cs = cos(ps), sn = sin(ps), hc = (dir === 0 ? MW.hd : MW.hc) * L + lift;
  // the swimming pose noses up (M3.7): while the burst runs, the line tilts with the body
  const h37 = sd * 3.7, pit = (0.145 + 0.115 * (h37 - floor(h37)) + 0.030 * sin((F[TIME] * 7.5 + sd * 31) * 0.5)) * bz;
  const cq = cos(pit), sq = sin(pit);
  WKP[3] = (e1x * cs + e2x * sn) * cq + nx * sq; WKP[4] = (e1y * cs + e2y * sn) * cq + ny * sq; WKP[5] = e2z * sn * cq + nz * sq;
  const mx = a[i] + L * (e1x * px + e2x * pz) + nx * hc, my = a[i + 1] + L * (e1y * px + e2y * pz) + ny * hc, mz = a[i + 2] + L * e2z * pz + nz * hc;
  ZP[0] = mx; ZP[1] = my; ZP[2] = mz;
  if (dir !== 0) { ZH[0] = MW.hh * L; ZH[1] = MW.kd * L; zooDodge(1); ZP[1] = my + gx * (ZP[0] - mx) + gz * (ZP[2] - mz); }
  WKP[0] = ZP[0]; WKP[1] = ZP[1]; WKP[2] = ZP[2];
};
const zooMega = (a, i) => {
  mgAt(a, i);
  const e = MW.line * a[i + 6];
  ZP[0] = WKP[0] - WKP[3] * e; ZP[1] = WKP[1] - WKP[4] * e; ZP[2] = WKP[2] - WKP[5] * e;
  ZP[3] = WKP[3] * 2 * e; ZP[4] = WKP[4] * 2 * e; ZP[5] = WKP[5] * 2 * e; ZP[7] = MW.rad * a[i + 6];
};

// ---------------------------------------------------------------- giving them their places (load-time only)
// About 45, each alone, 6 m or more apart (stage I3): two within 6 to 12 m of every test pose and four near the
// start, the rest beside the crowds of trilobites; a few stand still beside a ledge. Each walker has its own
// round of 3 to 8 m across (never smaller than itself) on flat drawn ground, found as for the trilobites.
function makeMegalograptus(W) {
  rseed(150);
  const placed = [], megas = [], meshes = new Map();
  const skip = new Set([GRIT, BRACH[0], BRACH[1], BRACH_DEAD]);
  let still = 0;
  const tryPlace = (sx, sz, stand, rcW, tol) => {
    const L = mix(MW.l0, MW.l1, pow(rnd(), MW.lp));
    const n = 2 + floor(rnd() * 5), dir = rnd() < 0.5 ? -1 : 1, sd = rr(0.001, 0.999);
    const rc = stand ? 0 : max(rcW, 0.6 * L);
    const pR = stand ? L : rc + MW.rf * L + 0.6 * (MW.kd * L + 0.02);
    if (W.nearPose(sx, sz, 1.5) || W.nearFly(sx, W.gy(sx, sz), sz, 1.0)) return false;
    if (placed.some((p) => hypot(sx - p[0], sz - p[1]) < 6)) return false;
    const net = isoNet(W, sx, sz, pR + 1);
    const obs = isoStanding(W, net, sx, sz, pR + 0.6, meshes, skip);
    if (obs.some((o) => hypot(sx - o[0], sz - o[1]) < pR + o[2] + 0.05)) return false;
    const pl = isoPlane(W, net, sx, sz, pR, min(tol, (tol / 0.022) * 0.04 * L), (MW.hc + MW.hh) * L);
    if (!pl) return false;
    // a loose fit (rough ground) rides a little higher, so no point of the animal goes under a bulge of it
    megas.push(sx, pl[0] + max(0, tol - 0.026), sz, rc * dir, pl[1], pl[2], L, n + sd);
    placed.push([sx, sz]);
    if (stand) still++;
    return true;
  };
  // two at every test pose, four at the first: 6 to 12 m out (to 15 at the start), with a small round, so the
  // animal keeps its distance from the pose
  for (let p = 0; p < ERA.views.length; p++) {
    const want = p === 0 ? 4 : 2, px = ERA.views[p][0], pz = ERA.views[p][2];
    const tries = p === 0 ? 900 : 450;
    for (let t = 0, got = 0; t < tries && got < want; t++) {
      const an = rnd() * TAU, d = rr(6, p === 0 ? 15 : 12);
      const x = px + cos(an) * d, z = pz + sin(an) * d;
      if (sstep(0.47, 0.52, fbm(x * 0.021, z * 0.021, 61, 3)) > 0.5) continue;
      if (tryPlace(x, z, false, rr(1.5, 2.2) * (1 - 0.25 * t / tries), min(0.036, 0.022 + 0.00009 * t))) got++;
    }
  }
  // the rest beside the crowds of trilobites, up to two at each: the round shrinks and the tolerance widens a
  // little with the tries (a smaller round needs less flat ground)
  for (const [cx, cz, cr] of ISO_SITES) {
    if (megas.length >= 41 * 8) break;
    for (let a = 0, got = 0; a < 30 && got < 2; a++) {
      const an = rnd() * TAU, dd = cr + rr(2, 8), x = cx + cos(an) * dd, z = cz + sin(an) * dd;
      if (sstep(0.47, 0.52, fbm(x * 0.021, z * 0.021, 61, 3)) > 0.5) continue;
      if (tryPlace(x, z, false, rr(1.5, 4) * (1 - 0.022 * a), min(0.034, 0.02 + 0.0005 * a))) got++;
    }
  }
  // if the crowds gave too few, the rest anywhere on the open mud
  for (let tries = 0; tries < 1500 && megas.length < 41 * 8; tries++) {
    const an = rnd() * TAU, rad = 6 + 72 * sqrt(rnd()), x = cos(an) * rad, z = sin(an) * rad;
    if (sstep(0.47, 0.52, fbm(x * 0.021, z * 0.021, 61, 3)) > 0.5) continue;
    tryPlace(x, z, false, rr(1.5, 4) * (1 - 0.0004 * tries), min(0.034, 0.02 + 0.00001 * tries));
  }
  // a few stand still beside a ledge
  for (let tries = 0; tries < 800 && still < 4 && megas.length < 45 * 8; tries++) {
    const an = rnd() * TAU, rad = 6 + 70 * sqrt(rnd()), x = cos(an) * rad, z = sin(an) * rad;
    if (ledgeAt(x, z) < 0.3) continue;
    tryPlace(x, z, true, 0, 0.03);
  }
  MEGALOGRAPTUS.data = MEGA_SHADOW.data = new Float32Array(megas);
  zooMove('megalograptus', MEGALOGRAPTUS.data, zooMega, 5);
}
