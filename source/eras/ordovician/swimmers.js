// ============================================================================
// ordovician: what the animals of this era share, and graptolite
// ============================================================================
// The pieces their meshes are made of, the shader code they share (S_SEA: giving way to the viewer, the light on a
// skin) and what their zoo places share. The graptolite is here because it is small. Larger swimmers get a file of
// their own (swimmers_<name>.js). Shapes follow the fossils as far as the sources describe them. Colours and movement
// are free: no fossil shows them.
// Each mesh is modelled around the origin, nose at +z, y up, and is one unit long: the instance says how large the
// animal is in the world. aux, the fourth number of a vertex, tells the shaders which part of the animal a vertex
// belongs to.

// ---------------------------------------------------------------- pieces the meshes are made of
// A body from sections [z, half width, half height, height of its middle], rounded off between them and closed with
// a point at both ends. NS rings per section, M points around each, shape(a) the outline of a ring
function loft(m, K, NS, M, aux = 0, shape = (a) => [cos(a), sin(a)]) {
  const cr = (a, b, c, d, u) => 0.5 * (2 * b + (c - a) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (3 * b - a - 3 * c + d) * u * u * u), rings = [];
  for (let j = 0; j <= (K.length - 1) * NS; j++) {
    const i = min(floor(j / NS), K.length - 2), u = j / NS - i, k = (o) => K[clamp(i + o, 0, K.length - 1)];
    const [z, w, h, yc] = [0, 1, 2, 3].map((q) => cr(k(-1)[q], k(0)[q], k(1)[q], k(2)[q], u)), ring = [];
    for (let s = 0; s < M; s++) { const [x, y] = shape(s / M * TAU); ring.push(m.v(max(w, 0.002) * x, yc + max(h, 0.002) * y, z, aux)); }
    rings.push(ring);
  }
  for (let j = 0; j < rings.length - 1; j++) for (let s = 0; s < M; s++) { const s2 = (s + 1) % M; m.quad(rings[j][s], rings[j][s2], rings[j + 1][s2], rings[j + 1][s]); }
  const A = K[0], B = K[K.length - 1], e0 = m.v(0, A[3], A[0] - 0.003, aux), e1 = m.v(0, B[3], B[0] + 0.003, aux), last = rings[rings.length - 1];
  for (let s = 0; s < M; s++) { const s2 = (s + 1) % M; m.tri(rings[0][s2], rings[0][s], e0); m.tri(last[s], last[s2], e1); }
}
const wideAt = (K, z) => { let i = 0; while (i < K.length - 2 && K[i + 1][0] < z) i++; return mix(K[i][1], K[i + 1][1], clamp((z - K[i][0]) / (K[i + 1][0] - K[i][0]), 0, 1)); };
function ball(m, c, r, aux, N = 8, R = 5) {
  const [rx, ry, rz] = r.length ? r : [r, r, r], rings = [];
  for (let k = 1; k < R; k++) { const a = k / R * PI, ring = []; for (let s = 0; s < N; s++) { const b = s / N * TAU; ring.push(m.v(c[0] + rx * sin(a) * cos(b), c[1] + ry * cos(a), c[2] + rz * sin(a) * sin(b), aux)); } rings.push(ring); }
  for (let k = 0; k < rings.length - 1; k++) for (let s = 0; s < N; s++) { const s2 = (s + 1) % N; m.quad(rings[k][s], rings[k][s2], rings[k + 1][s2], rings[k + 1][s]); }
  const top = m.v(c[0], c[1] + ry, c[2], aux), bot = m.v(c[0], c[1] - ry, c[2], aux), last = rings[rings.length - 1];
  for (let s = 0; s < N; s++) { const s2 = (s + 1) % N; m.tri(rings[0][s2], rings[0][s], top); m.tri(last[s], last[s2], bot); }
}
function blade(m, root, d, c, len, wide, aux, NS = 4) {
  const rows = [];
  for (let k = 0; k <= NS; k++) {
    const s = k / NS, w = wide(s), row = [];
    for (const e of [-1, 0, 1]) row.push(m.v(root[0] + d[0] * s * len + c[0] * e * w, root[1] + d[1] * s * len + c[1] * e * w, root[2] + d[2] * s * len + c[2] * e * w, aux(s)));
    rows.push(row);
  }
  for (let k = 0; k < NS; k++) for (let e = 0; e < 2; e++) m.quad(rows[k][e], rows[k][e + 1], rows[k + 1][e + 1], rows[k + 1][e]);
}
const curve = (P, n) => Array.from({ length: n + 1 }, (_, j) => {
  const s = j / n * (P.length - 1), i = min(floor(s), P.length - 2), u = s - i, k = (o) => P[clamp(i + o, 0, P.length - 1)];
  return [0, 1, 2].map((q) => 0.5 * (2 * k(0)[q] + (k(1)[q] - k(-1)[q]) * u + (2 * k(-1)[q] - 5 * k(0)[q] + 4 * k(1)[q] - k(2)[q]) * u * u + (3 * k(0)[q] - k(-1)[q] - 3 * k(1)[q] + k(2)[q]) * u * u * u));
});
const lobe = (w) => (s) => w * pow(max(1 - pow(s, 2.2), 0), 0.6), paddle = (w) => (s) => w * (1 - 0.6 * s * s * s);
function sheet(m, rows, flip) {
  for (let j = 0; j < rows.length - 1; j++) for (let c = 0; c < rows[j].length - 1; c++) { const a = rows[flip ? j + 1 : j], b = rows[flip ? j : j + 1]; m.quad(a[c], b[c], b[c + 1], a[c + 1]); }
}
function slab(m, root, d, c, u, len, wide, thick, aux, NS = 5) {
  const rings = [], O = [[1, 0], [0.55, 1], [-0.55, 1], [-1, 0], [-0.55, -1], [0.55, -1]];
  for (let k = 0; k <= NS; k++) {
    const s = k / NS, w = max(wide(s), 1e-4), t = thick(s), ring = [];
    for (const [e, f] of O) ring.push(m.v(root[0] + d[0] * s * len + c[0] * e * w + u[0] * f * t, root[1] + d[1] * s * len + c[1] * e * w + u[1] * f * t, root[2] + d[2] * s * len + c[2] * e * w + u[2] * f * t, aux(s)));
    rings.push(ring);
  }
  for (let k = 0; k < NS; k++) for (let e = 0; e < 6; e++) m.quad(rings[k][e], rings[k][(e + 1) % 6], rings[k + 1][(e + 1) % 6], rings[k + 1][e]);
  for (const r of [rings[0], rings[NS]]) { m.quad(r[0], r[1], r[2], r[3]); m.quad(r[0], r[3], r[4], r[5]); }
}

// ---------------------------------------------------------------- the soft parts of a shelled cephalopod
// Body, eyes, arms and a funnel as ONE skin out of the shell's opening. What no fossil shows is a parameter (P),
// with the Nautilus of quality-gate.md as the default, so a later era can still ask for one; the kinds of this era
// ask for their own reconstruction (ordovician-life.md, stage E: ten arms, no hood). All measures in D, the
// diameter of the shell's opening. The shell stays the kind's own. o = [x, y, z]: the centre of the opening at the
// lip. sd: this kind's seed. A: the aux values the kind's shaders read:
// { inner, body: [lo, hi], eye, ball, dent, tent: [lo, hi], funnel, and hood: [lo, hi] only if P.hood is on }.
// The skin runs from 0.3 D inside the shell (radius 0.85 of the shell's inner 0.46 D: a dark gap all round) to the
// arm roots: it meets the lip at 0.88 D, swells to P.headW and narrows to P.collar, where the roots are fused into
// one fleshy collar round the sunk, dark mouth. Each eye is a smooth ball of P.eye sunk in a socket with a fold of
// skin round it, a low brow over it and a swelling behind it (its iris and pupil are the kind's fragment shader,
// eyeIris); with P.hood the raised, overhanging hood of Nautilus and its pinhole eye stay instead. The arms are
// round smooth tapering tubes, no sheaths, no suckers, each with its own direction, bend and droop, pointing
// forward 20 to 40 degrees off the axis. The funnel is an open tapering tube on the underside, between the lowest
// pair of arms, pointing forward and a little down.
function nautiloidSoft(m, D, o, sd, A, ov = 0, lo = 0, P = {}) {
  // lo: the simpler build for a far mesh (stage C5): fewer stations and sides in the arms and the body, no eyes.
  // P, all measures in D: hood 1 or 0; arms (an even count stands in mirrored pairs, the left the mirror of the
  // right in place, length and thickness, the pose each side's own; an odd count stands free round the ring);
  // armLen [min, max]; armThick [at the root: min, max]; armTip (thickness at the tip); ring (the circle of the
  // roots, across); headW (the head at its widest); collar (the fleshy collar of the roots, across); eye (the
  // mound, across); eyeHole (the dark hole in it)
  const Q = { hood: 1, arms: 35, armLen: [1, 2.5], armThick: [0.08, 0.10], armTip: 0.02, ring: 0.7, headW: 1.0, collar: 0.68, eye: 0.25, eyeHole: 0.06, ...P };
  const hn = (x) => { const v = sin(x * 127.1 + 311.7 + sd) * 43758.5453; return v - floor(v); };
  const sn = (x) => { const i = floor(x), f = x - i, u = f * f * (3 - 2 * f); return hn(i) * (1 - u) + hn(i + 1) * u; };
  const [ox, oy, zo] = o;
  const BN = lo ? 10 : 22, BM = lo ? 16 : 64, tLip = 0.3 / 1.3;
  const wMax = Q.headW / 2, wEnd = Q.collar / 2, sm = (v) => v * v * (3 - 2 * v);
  // the body meets the inside of the lip all round (qa 5a): no gap, only the shadow the lip's thickness throws.
  // Out of the shell it swells to its widest at two fifths of the head and narrows to the collar
  const bodyR = (t) => {
    if (t <= tLip) return D * (0.44 - 0.02 * pow(1 - t / tLip, 2));
    const u = (t - tLip) / (1 - tLip), uM = 0.42;
    return D * (u < uM ? mix(0.44, wMax, sm(u / uM)) : mix(wMax, wEnd, sm((u - uM) / (1 - uM))));
  };
  // the hood's length profile: rising gently from the lip, long, sloping down toward the front, rounded at the end
  const hoodP = (v) => v <= 0 || v >= 1 ? 0 : pow(clamp(v / 0.35, 0, 1), 1.4) * (1 - 0.35 * v) * pow(clamp((1 - v) / 0.15, 0, 1), 0.6);
  // --- the skin: BN stations from 0.3 D inside the shell to the arm roots
  const rings = [];
  for (let k = 0; k <= BN; k++) {
    const t = k / BN, z = zo + (-0.3 + 1.3 * t) * D, out = max(0, (t - tLip) / (1 - tLip));
    const v = (z - zo) / (0.8 * D), hp = Q.hood ? hoodP(v) : 0;
    const ez = exp(-pow((z - zo - 0.35 * D) / (0.14 * D), 2));
    const ring = [];
    for (let j = 0; j < BM; j++) {
      const a = j / BM * TAU, ca = cos(a), sa = sin(a);
      // the underside shorter and flatter than the top: the head gets an outline of its own. Not an egg (stage
      // F3): a groove on the underside where the funnel lies, and a narrowing just before the collar
      let r = bodyR(t) * (1 + 0.018 * sn(a * 2.3 + t * 4.1)) * (1 - 0.09 * max(0, -sa)) * (1 + ov * cos(2 * a) * max(0, 1 - out * 3));
      const fg = exp(-pow((z - zo - 0.55 * D) / (0.22 * D), 2));
      r -= D * 0.045 * pow(max(-sa, 0), 8) * fg * out;
      r *= 1 - 0.05 * exp(-pow((out - 0.86) / 0.12, 2));
      // the mantle's edge: a soft fold where the body leaves the lip (critic, stage F round 1)
      r += D * 0.02 * exp(-pow((out - 0.08) / 0.05, 2));
      // the hood (only if asked for): a step of 0.04 to 0.06 D proud of the body, lumpy on top, shadowed under it
      const q = clamp((sa - 0.36) / 0.26, 0, 1), hm = q * q * (3 - 2 * q);
      const lump = 1 + 0.14 * sn(a * 5.7 + z / D * 7.9) + 0.07 * sn(a * 11.3 + z / D * 15.1);
      const stp = D * 0.05 * hm * hp;
      const dy = D * (0.09 + 0.03 * sn(z / D * 5.1 + 2.7)) * hm * hp * lump;
      // the skin swells where the eye grows out of it, a low brow lies over each eye (without a hood), and a
      // broader swelling sits behind each eye (stage F3)
      const bz2 = exp(-pow((z - zo - 0.52 * D) / (0.16 * D), 2));
      let sw = 0, br = 0, bw = 0;
      for (const sx of [-1, 1]) {
        sw = max(sw, pow(max(ca * 0.95 * sx + sa * 0.31, 0), 18));
        br = max(br, pow(max(ca * 0.80 * sx + sa * 0.60, 0), 22));
        bw = max(bw, pow(max(ca * 0.93 * sx + sa * 0.28, 0), 9));
      }
      r += D * (0.04 * sw * (1 - hm) * (0.5 + 2 * Q.eye) + (Q.hood ? 0 : 0.11 * Q.eye) * br) * ez + D * 0.10 * Q.eye * bw * bz2;
      let aux = A.body[0] + out * (A.body[1] - A.body[0]);
      // the hood's change of tone sits on the step in the form, no border line
      if (hm > 0.02 && hp > 0.1) aux = mix(aux, A.hood[0] + out * (A.hood[1] - A.hood[0]), hm);
      ring.push(m.v(ox + (r + stp) * ca, oy + (r + stp) * sa + dy, z, aux));
    }
    rings.push(ring);
  }
  for (let k = 0; k < BN; k++) for (let j = 0; j < BM; j++) { const j2 = (j + 1) % BM; m.quad(rings[k][j], rings[k][j2], rings[k + 1][j2], rings[k + 1][j]); }
  const back = m.v(ox, oy, zo - 0.31 * D, A.inner);
  for (let j = 0; j < BM; j++) m.tri(rings[0][(j + 1) % BM], rings[0][j], back);
  // --- the arms' places first, the collar needs them (stage F3)
  const cr = D * Q.ring / 2, AD = [];
  if (Q.arms % 2) for (let j = 0; j < Q.arms; j++) {
    AD.push([j / Q.arms * TAU + (hn(j * 7.13 + 0.5) - 0.5) * 0.1, mix(Q.armLen[0], Q.armLen[1], hn(j * 11.3 + 3.7)), mix(Q.armThick[0], Q.armThick[1], hn(j * 5.17 + 2.3)), j]);
  } else for (let pr = 0; pr < Q.arms / 2; pr++) {
    // mirrored pairs (stage E): place, length and thickness shared, the angles a little uneven, the pose each
    // side's own. The jitter stays small so neighbouring roots never pass through each other
    const aR = PI / 2 - (pr + 0.5) * TAU / Q.arms + (hn(pr * 7.13 + 0.5) - 0.5) * 0.1;
    const ln = mix(Q.armLen[0], Q.armLen[1], hn(pr * 11.3 + 3.7)), tk = mix(Q.armThick[0], Q.armThick[1], hn(pr * 5.17 + 2.3));
    AD.push([aR, ln, tk, pr * 2], [PI - aR, ln, tk, pr * 2 + 1]);
  }
  // --- the front: the fleshy collar the arms grow out of. It swells round each root and dips into a hollow
  // between neighbours (stage F3: fused, no seam), and the mouth area inside it is sunk and dark
  const zR = zo + D, dR = [rings[BN]];
  const rootBulge = (a2) => { let b = 0; for (const q2 of AD) b = max(b, pow(max(cos(a2 - q2[0]), 0), 26)); return 0.26 * b - 0.07; };
  for (const [f, dz, au, fl] of [[0.85, 0.055, A.body[1], 1], [0.675, 0.075, A.body[1], 0.6], [0.45, 0.045, A.body[1], 0.2], [0.175, -0.015, A.dent, 0]]) {
    const ring = [];
    for (let j = 0; j < BM; j++) {
      const a = j / BM * TAU, rb = 1 + fl * rootBulge(a);
      ring.push(m.v(ox + wEnd * D * f * rb * (1 + 0.06 * sn(a * 4.3 + f * 17)) * cos(a), oy + wEnd * D * f * rb * (1 + 0.05 * sn(a * 3.4 + f * 11)) * sin(a), zR + D * (dz + 0.015 * sn(a * 2.7 + f * 23)), au));
    }
    dR.push(ring);
  }
  for (let k = 0; k < 4; k++) for (let j = 0; j < BM; j++) { const j2 = (j + 1) % BM; m.quad(dR[k][j], dR[k][j2], dR[k + 1][j2], dR[k + 1][j]); }
  const nose = m.v(ox, oy, zR - D * 0.05, A.dent);
  for (let j = 0; j < BM; j++) m.tri(dR[4][j], dR[4][(j + 1) % BM], nose);
  // --- the eyes (stage F2): a smooth ball sunk in a socket with a fold of skin round it, one on each side, a
  // little different. With P.hood (the Nautilus) the old pinhole stays: a mound with a dark dent
  if (!lo) for (const sx of [-1, 1]) {
    const nx = 0.95 * sx, ny = 0.31, nz = 0.10 + 0.04 * hn(sx * 3 + 11);
    const nl = hypot(nx, ny, nz), wx = nx / nl, wy = ny / nl, wz = nz / nl;
    const el = hypot(wx, wy), e1x = wy / el, e1y = -wx / el;
    const e2x = -wz * e1y, e2y = wz * e1x, e2z = wx * e1y - wy * e1x;
    const rS = bodyR(0.5) + 0.02 * D, zE = zo + 0.35 * D;
    const cx = ox + wx * rS, cy = oy + wy * rS;
    const mnd = Q.eye / 0.25, hol = Q.eyeHole / 0.06, rE = Q.eye / 2, ES = 28;
    const prof = Q.hood
      ? [[0.125 * mnd, 0.004 * mnd, A.eye], [0.108 * mnd, 0.026 * mnd, A.eye], [0.062 * mnd, 0.046 * mnd, A.eye], [0.030 * hol, 0.040 * mnd, A.dent], [0.012 * hol, 0.002 * mnd, A.dent]]
      : [[rE * 1.30, 0.004 * mnd, A.eye], [rE * 1.12, 0.024 * mnd, A.eye], [rE * 0.95, 0.034 * mnd, A.eye], [rE * 0.78, 0.034 * mnd, A.eye], [rE * 0.60, 0.016 * mnd, A.eye], [rE * 0.50, -0.004 * mnd, A.dent]];
    const eR = [];
    for (let k = 0; k < prof.length; k++) {
      const [rho, hh, au] = prof[k], ring = [];
      for (let j = 0; j < ES; j++) {
        const a = j / ES * TAU, c1 = cos(a) * (1 + 0.015 * sn(a * 1.7 + sx * 5 + k)), s1 = sin(a);
        ring.push(m.v(cx + (e1x * c1 + e2x * s1) * rho * D + wx * hh * D, cy + (e1y * c1 + e2y * s1) * rho * D + wy * hh * D, zE + e2z * s1 * rho * D + wz * hh * D, au));
      }
      eR.push(ring);
    }
    for (let k = 0; k < eR.length - 1; k++) for (let j = 0; j < ES; j++) { const j2 = (j + 1) % ES; m.quad(eR[k][j], eR[k][j2], eR[k + 1][j2], eR[k + 1][j]); }
    if (Q.hood) {
      const pit = m.v(cx + wx * 0.002 * D, cy + wy * 0.002 * D, zE + wz * 0.002 * D, A.dent);
      for (let j = 0; j < ES; j++) m.tri(eR[prof.length - 1][j], eR[prof.length - 1][(j + 1) % ES], pit);
    } else {
      // the ball: smooth, 18 sides, sunk so that only its cap stands through the socket's opening. The kind's
      // fragment shader paints iris and pupil on it from its centre (eyeIris): keep centre and radius in step
      const rB = rE * 0.62 * D, sk = 0.35 * rB;
      ball(m, [cx - wx * sk, cy - wy * sk, zE - wz * sk], rB, A.ball, 24, 11);
    }
  }
  // --- the arms: Q.arms round one ring of Q.ring across (placed above), round and smooth, each root flaring
  // into the swelling of the collar it grows out of (stage F3). armSides: a giant seen close asks for more
  const TN = lo ? 7 : 20, TS = lo ? 4 : Q.armSides || 8;
  for (const [ang, ln, tk, j] of AD) {
    const h2 = hn(j * 11.3 + 53.7), h3 = hn(j * 3.71 + 57.1), h4 = hn(j * 5.17 + 52.3), h5 = hn(j * 13.7 + 59.1);
    const bx = ox + cos(ang) * cr, by = oy + sin(ang) * cr;
    // radial at the root, swinging into its own direction along the length: none crosses another at the root
    const dir = (w) => { const an = ang + (h5 - 0.5) * 0.8 * w; return [cos(an), sin(an)]; };
    const [c0, s0] = dir(0), [c1, s1] = dir(0.3), [c2, s2] = dir(0.6), [c3, s3] = dir(0.85), [c4, s4] = dir(1);
    const len = D * ln;
    const fwdA = 0.30 + 0.45 * h2;
    const fr = len * sin(fwdA), fz = len * cos(fwdA);
    const bd = (h3 - 0.5) * D * 0.55, drp = -D * (0.03 + 0.12 * h4);
    const cl = (h5 - 0.5) * D * 0.10;
    const rz = zR - 0.06 * D;
    const pts = curve([
      [bx, by, rz],
      [bx + c0 * fr * 0.15, by + s0 * fr * 0.15 + drp * 0.02, rz + fz * 0.12],
      [bx + c1 * fr * 0.42 + bd * 0.18 + cl, by + s1 * fr * 0.40 + drp * 0.10, rz + fz * 0.34],
      [bx + c2 * fr * 0.70 + bd * 0.45, by + s2 * fr * 0.64 + drp * 0.30 - cl * 0.6, rz + fz * 0.58],
      [bx + c3 * fr * 0.90 + bd * 0.75 - cl, by + s3 * fr * 0.82 + drp * 0.60, rz + fz * 0.82],
      [bx + c4 * fr + bd, by + s4 * fr * 0.88 + drp, rz + fz],
    ], TN);
    m.tube(pts, (k) => mix(D * tk / 2, D * Q.armTip / 2, pow(k / TN, 0.85)) * (1 + 0.32 * pow(max(0, 1 - (k / TN) * len / (0.32 * D)), 2)), TS, true, (k) => A.tent[0] + k / TN * (A.tent[1] - A.tent[0]));
  }
  // --- the funnel: a muscular open tube out of the underside between the lowest pair of arms, pointing forward
  // and a little down, the opening rolled. A darker liner inside it, so the opening is a hole with a wall, not a
  // cut sheet (critic, stage F round 1)
  const FP = [
    [ox, oy - 0.26 * D, zo + 0.45 * D],
    [ox, oy - 0.42 * D, zo + 0.60 * D],
    [ox, oy - 0.50 * D, zo + 0.72 * D],
    [ox, oy - 0.52 * D, zo + 0.82 * D],
  ];
  m.tube(FP, (k) => D * [0.105, 0.085, 0.062, 0.072][k], TS, false, () => A.funnel);
  m.tube(FP, (k) => D * [0.105, 0.085, 0.062, 0.072][k] * 0.72, TS, false, () => A.dent);
}

// ---------------------------------------------------------------- shaders
// What all animated animals share: the height of the mud (the formula of floor.js, for Astraspis and Endoceras),
// giving way to the viewer, and the light on a skin. See cambrian/swimmers.js
const S_SEA = /*wgsl*/`
fn ground(x: vec2f) -> f32 {
  var h = -16. + 3. * (fbm(vec3f(x * .014, 3.), 3) - .5)
         + .8 * (fbm(vec3f(x * .048, 7.), 2) - .5);
  h += 1.6 * ss(.52, .66, fbm(vec3f(x * .028, 11.), 3));
  h -= 10. * ss(110., 160., length(x));
  return h;
}
fn dodge(c: vec3f, r: f32, lv: f32, h: f32) -> vec3f {
  let v = c - g.cam.xyz; let d = length(vec3f(v.x, max(abs(v.y) - h, 0.), v.z));
  return c + normalize(vec3f(v.x + 1e-4, v.y * (1. - lv), v.z)) * (.6 * r * (1. - ss(0., r, d)));
}
fn skin(alb: vec3f, n: vec3f, wp: vec3f, gl: f32) -> vec3f {
  let L = g.sun.xyz; let V = normalize(g.cam.xyz - wp); let z = zone(wp); let vv = vol(wp);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  let fillN = vec3f(n.x, abs(n.y) * .55 + .25, n.z);
  var c = alb * (E * sat(dot(n, L)) * .65 + amb(wp, fillN, vv.g, z) * 1.1 + side(wp, n, 1., z) * .8);
  c += E * pow(sat(dot(n, normalize(V + L))), 40.) * gl;
  c += amb(wp, vec3f(0., 1., 0.), vv.g, z) * pow(1. - sat(dot(n, V)), 3.) * .25;
  return c;
}
fn skinRelief(n: vec3f, wp: vec3f, h: f32) -> vec3f {
  let px = dpdx(wp); let py = dpdy(wp); let r1 = cross(py, n); let r2 = cross(n, px); let det = dot(px, r1);
  return normalize(abs(det) * n - sign(det) * (dpdx(h) * r1 + dpdy(h) * r2));
}
fn skinWet(alb: vec3f, n: vec3f, ns: vec3f, wp: vec3f, gl: f32, wet: f32) -> vec3f {
  let V = normalize(g.cam.xyz - wp); let z = zone(wp); let H = normalize(V + g.sun.xyz);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  return alb * (E * sat(dot(n, g.sun.xyz)) * .65 + amb(wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vol(wp).g, z) * 1.1 + side(wp, n, 1., z) * .8)
    + E * (pow(sat(dot(n, H)), 40.) * gl + pow(sat(dot(ns, H)), 70.) * wet);
}
// The tone of a living skin at three sizes (ordovician-life.md F1), for every soft animal: large (darker above,
// paler below, a soft change), middle (uneven blotches, lighter and darker, a little warmer and cooler) and fine
// (a dust of small dark dots, denser in the dark blotches). Plain browns and greys only: this is the unevenness
// every skin has, not a pattern (L5). q: the point in the animal's own space, in D or body lengths, so nothing
// repeats and nothing lines up. dv: 1 on the upper side, -1 below. tip: 1 where the dust thins out (arm tips).
// sd: the animal's seed, so no two are the same
fn skinTone(alb: vec3f, q: vec3f, dv: f32, tip: f32, sd: f32) -> vec3f {
  var c = alb * (1. - .20 * sat(dv) + .14 * sat(0. - dv));
  let b = fbm(q * 1.9 + vec3f(sd * 23.1), 3) - .5;
  c *= (1. + .45 * b) * vec3f(1. + .12 * b, 1., 1. - .14 * b);
  let dt = ss(.26, .10, wor(q * 14. + vec3f(sd * 31.))) * sat(.55 - 1.4 * b) * (1. - tip);
  c *= 1. - .35 * dt;
  return c;
}
// The light of a living skin (F1): diffuse that wraps round the form a little, the moving light patches of the
// floor on what faces up, light through the thin parts (thin: arms' outer half, the funnel) when they stand
// against the sun, a faint rim in the water's colour, and a broad weak highlight broken by the fine noise fnz.
// gls: a small sharp gloss on the smooth normal, for the eye's ball alone
fn skinLive(alb: vec3f, n: vec3f, ns: vec3f, wp: vec3f, thin: f32, fnz: f32, gls: f32) -> vec3f {
  let L = g.sun.xyz; let V = normalize(g.cam.xyz - wp); let z = zone(wp); let vv = vol(wp);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  let Ec = E * (.55 + .45 * caus(wp, length(g.cam.xyz - wp)).x * sat(n.y * .7 + .3));
  let wr = sat((dot(n, L) + .4) / 1.4);
  let fillN = vec3f(n.x, abs(n.y) * .55 + .25, n.z);
  var c = alb * (Ec * wr * wr * .62 + amb(wp, fillN, vv.g, z) * 1.05 + side(wp, n, 1., z) * .75);
  c += Ec * vec3f(.9, .62, .38) * thin * sat(0. - dot(n, L)) * (.35 + .65 * sat(0. - dot(V, L))) * .8;
  c += amb(wp, vec3f(0., 1., 0.), vv.g, z) * pow(1. - sat(dot(ns, V)), 3.5) * .3;
  let H = normalize(V + L);
  c += Ec * (pow(sat(dot(n, H)), 12.) * (.05 + .10 * fnz) + pow(sat(dot(ns, H)), 160.) * gls);
  return c;
}
// The iris and pupil of a soft cephalopod's eye (F2), painted on the smooth ball from its own normal ns (in the
// animal's space: normalize(op - centre)). ax: the ball's outward axis. pr: the pupil's angular radius in radians.
// A round black pupil, an iris in uneven brown and dull gold with fine lines running outward, darker at its rim
fn eyeIris(ns: vec3f, ax: vec3f, sd: f32, pr: f32) -> vec3f {
  let ca = sat(dot(ns, ax));
  let rr = acos(ca);
  let e1 = normalize(cross(ax, vec3f(0., 0., 1.)));
  let e2 = cross(ax, e1);
  let az = atan2(dot(ns, e2), dot(ns, e1));
  let wob = fbm(vec3f(cos(az) * 2.1, sin(az) * 2.1, sd * 7.), 2);
  let ln = .5 + .5 * sin(az * 44. + wob * 9.);
  var c = mix(vec3f(.21, .13, .07), vec3f(.46, .35, .15), fbm(vec3f(cos(az) * 3.1 + sd * 11., sin(az) * 3.1, rr * 9.), 3));
  c *= .70 + .45 * ln * ss(pr * .8, pr * 1.5, rr);
  c *= 1. - .55 * ss(pr * 2.0, pr * 3.0, rr);
  c = mix(c, vec3f(.012, .010, .008), ss(pr * 1.12, pr * .88, rr));
  return c;
}
`;

// ---------------------------------------------------------------- where they are, for the zoo
// The zoo functions repeat the paths of the vertex shaders: change one, change the other. Each writes the place into
// ZP (see zooMove in engine/zoo.js) for the scene time F[TIME]. They run in every frame and allocate nothing.
// The height of the mud on a grid: for the animals that keep close to the floor. makeWorld fills it
const GRN = 577, GRH = 144, GRD = new Float32Array(GRN * GRN);
const zooGround = () => {
  let x = (ZP[0] + GRH) * 2, z = (ZP[2] + GRH) * 2;
  x = x < 0 ? 0 : x > GRN - 1.01 ? GRN - 1.01 : x;
  z = z < 0 ? 0 : z > GRN - 1.01 ? GRN - 1.01 : z;
  const i = x | 0, j = z | 0, u = x - i, v = z - j, o = i + GRN * j;
  ZP[1] += (GRD[o] * (1 - u) + GRD[o + 1] * u) * (1 - v) + (GRD[o + GRN] * (1 - u) + GRD[o + GRN + 1] * u) * v;
};
const ZH = new Float64Array(2);
const zooDodge = (lv) => {
  const r = ZH[1] + 2 * NEAR * F[PS];
  const vx = ZP[0] - F[CX], vy = ZP[1] - F[CY], vz = ZP[2] - F[CZ], ay = (vy < 0 ? -vy : vy) - ZH[0], by = ay > 0 ? ay : 0, d = sqrt(vx * vx + by * by + vz * vz);
  if (d >= r) return;
  const wy = vy * (1 - lv), q = d / r, k = 0.6 * r * (1 - q * q * (3 - 2 * q)) / (sqrt(vx * vx + wy * wy + vz * vz) + 1e-4);
  ZP[0] += vx * k; ZP[1] += wy * k; ZP[2] += vz * k;
};

// ---------------------------------------------------------------- Graptolite
// A biserial graptolite colony: a thin dark blade with saw-tooth edges (thecae) hanging from a thread (nema),
// drifting in swarms in the open water. 2 to 10 cm. Sources: Digital Atlas of Ordovician Life (not verified);
// see docs/research/ordovician/graptolite.md. All colours and proportions are estimates.
// aux: 0 at bottom of stipe, 1 at nema tip
// lo: the far mesh (stage G3): the blade as a short slab without the teeth and the nema, for animals beyond a
// few metres, where a 5 cm blade is a streak of a pixel or two
function meshGraptolite(sd, lo) {
  const m = new Mesh(), NT = 8 + (sd % 3), BL = 0.82;
  slab(m, [0, 0, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], BL,
    (s) => {
      if (s > 0.97) return 0.001;
      const bw = 0.015 * (1 - 0.3 * s);
      if (lo) return bw * 1.25;
      const f = s * NT - floor(s * NT);
      const tw = f < 0.3 ? pow(f / 0.3, 0.7) : pow(max(1 - (f - 0.3) / 0.7, 0), 0.5);
      return bw * (1 + 0.5 * tw);
    },
    (s) => 0.004 * (1 - 0.3 * s),
    (s) => s,
    lo ? 4 : NT * 3
  );
  if (!lo) m.tube([[0, 0, BL], [0, 0.002, 0.91], [0, 0, 1]], () => 0.001, 3, true, () => 1);
  return m;
}
const S_GRAPTOLITE = /*wgsl*/`
// Instance: a.xyz = swarm centre, a.w = orbit radius. b.x = individual seed, b.y = swarm speed (rad/s, sign is
// direction), b.z = size (blade length in metres), b.w = swarm seed. The orbit grP is repeated in zooGraptolite:
// change one, change the other
fn grP(ta: f32, a: vec4f, ph: f32) -> vec3f { return a.xyz + a.w * vec3f(cos(ta) * (1. + .15 * sin(2. * ta + ph)), .2 * sin(3. * ta + ph), sin(ta) * (1. + .15 * cos(2. * ta + ph))); }
@vertex fn vsGraptolite(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w; let ph = i.b.w * 17.;
  // slow orbit around the swarm centre
  let ta = t * i.b.y + i.b.w * 6.3 + (h.x - .5) * 6. / R;
  var p = grP(ta, i.a, ph);
  // individual wander
  p += vec3f(sin(t * .15 + s * 30.) * .4, sin(t * .12 + s * 23.) * .25, cos(t * .18 + s * 17.) * .4);
  // the blade hangs roughly vertical, swaying gently
  let sw = t * .3 + s * 40.;
  let Up = normalize(vec3f(.12 * sin(sw), 1., .12 * cos(sw * .8)));
  let fa = s * 17. + t * .08;
  let Side = normalize(cross(Up, vec3f(cos(fa), 0., sin(fa))));
  let Face = cross(Side, Up);
  var l = i.p; let sz = i.b.z * (.8 + .4 * h.z);
  // sway along the blade
  l.x += .015 * sin(t * 1.5 + s * 25. + l.z * 10.) * l.z;
  let w = dodge(p, .15 * sz + 2. * g.fwd.w, 0., sz * .4) + (Side * l.x + Face * l.y + Up * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = Side * i.n.x + Face * i.n.y + Up * i.n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
@fragment fn fsGraptolite(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff); let sd = i.sd; let z = i.op.z; let x = abs(i.op.x);
  let h1 = hs(sd * 7.); let h2 = hs(sd * 23.);
  let fine = ss(.003, .001, fwidth(z));
  // relief: faint growth lines along the blade
  let gl = sin(z * 180. + sd * 50.) * fine;
  let n = skinRelief(ns, i.wp, .0006 * gl);
  // dark organic periderm: brown to black
  var alb = mix(mix(vec3f(.10, .08, .05), vec3f(.16, .12, .08), h1), mix(vec3f(.06, .06, .05), vec3f(.12, .10, .07), h1), .5 + .3 * h2);
  // paler at the edges (the teeth) and darker in the middle
  alb *= .88 + .18 * ss(.008, .02, x);
  // the nema is thinner and paler
  alb += vec3f(.02, .02, .01) * ss(.82, .92, z);
  // per-individual tone variation
  alb *= .8 + .4 * h1;
  var c = skinWet(alb, n, ns, i.wp, .04, .10);
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;
// A swarm of graptolites: grP of vsGraptolite. Two ends of the spread, each half a metre from the middle
const zooGraptolite = (a, i) => {
  const R = a[i + 3], ph = a[i + 7] * 17;
  const ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3;
  const t0 = ta - 3 / R, t1 = ta + 3 / R;
  const c0x = a[i] + R * cos(t0) * (1 + 0.15 * sin(2 * t0 + ph));
  const c0y = a[i + 1] + R * 0.2 * sin(3 * t0 + ph);
  const c0z = a[i + 2] + R * sin(t0) * (1 + 0.15 * cos(2 * t0 + ph));
  const c1x = a[i] + R * cos(t1) * (1 + 0.15 * sin(2 * t1 + ph));
  const c1y = a[i + 1] + R * 0.2 * sin(3 * t1 + ph);
  const c1z = a[i + 2] + R * sin(t1) * (1 + 0.15 * cos(2 * t1 + ph));
  ZP[0] = c0x; ZP[1] = c0y; ZP[2] = c0z;
  ZP[3] = c1x - c0x; ZP[4] = c1y - c0y; ZP[5] = c1z - c0z; ZP[7] = 2;
};
