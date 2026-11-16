// ============================================================================
// cambrian: the swimmers (meshes, shaders, where they are for the zoo)
// ============================================================================
// Marrella, Metaspriggina, the jellyfish Burgessomedusa, Opabinia and Anomalocaris. For each: its mesh, its shaders
// (S_...) and, for the zoo, where it is at a time (zoo...). world.js lists them as kinds and gives them their
// instances. Shapes follow the fossils as far as the sources in zoo.js describe them. Colours and movement are free:
// no fossil shows them.
// Each mesh is modelled around the origin, nose at +z, y up, and is one unit long (the jellyfish: one unit high):
// the instance says how large the animal is in the world. aux, the fourth number of a vertex, tells the shaders which
// part of the animal a vertex belongs to.

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
// how wide such a body is at z (its half width)
const wideAt = (K, z) => { let i = 0; while (i < K.length - 2 && K[i + 1][0] < z) i++; return mix(K[i][1], K[i + 1][1], clamp((z - K[i][0]) / (K[i + 1][0] - K[i][0]), 0, 1)); };
// a ball at c: r is its radius, or its three half axes
function ball(m, c, r, aux, N = 8, R = 5) {
  const [rx, ry, rz] = r.length ? r : [r, r, r], rings = [];
  for (let k = 1; k < R; k++) { const a = k / R * PI, ring = []; for (let s = 0; s < N; s++) { const b = s / N * TAU; ring.push(m.v(c[0] + rx * sin(a) * cos(b), c[1] + ry * cos(a), c[2] + rz * sin(a) * sin(b), aux)); } rings.push(ring); }
  for (let k = 0; k < rings.length - 1; k++) for (let s = 0; s < N; s++) { const s2 = (s + 1) % N; m.quad(rings[k][s], rings[k][s2], rings[k + 1][s2], rings[k + 1][s]); }
  const top = m.v(c[0], c[1] + ry, c[2], aux), bot = m.v(c[0], c[1] - ry, c[2], aux), last = rings[rings.length - 1];
  for (let s = 0; s < N; s++) { const s2 = (s + 1) % N; m.tri(rings[0][s2], rings[0][s], top); m.tri(last[s], last[s2], bot); }
}
// a flat blade from `root` out along d, `len` long. wide(s) is how far it reaches to either side along c at s (0 at
// the root, 1 at the tip), aux(s) what its vertices carry there
function blade(m, root, d, c, len, wide, aux, NS = 4) {
  const rows = [];
  for (let k = 0; k <= NS; k++) {
    const s = k / NS, w = wide(s), row = [];
    for (const e of [-1, 0, 1]) row.push(m.v(root[0] + d[0] * s * len + c[0] * e * w, root[1] + d[1] * s * len + c[1] * e * w, root[2] + d[2] * s * len + c[2] * e * w, aux(s)));
    rows.push(row);
  }
  for (let k = 0; k < NS; k++) for (let e = 0; e < 2; e++) m.quad(rows[k][e], rows[k][e + 1], rows[k + 1][e + 1], rows[k + 1][e]);
}
// a smooth line through the points P (Catmull-Rom), as n + 1 points: for spines and feelers, which would show every
// corner of a line of a few points
const curve = (P, n) => Array.from({ length: n + 1 }, (_, j) => {
  const s = j / n * (P.length - 1), i = min(floor(s), P.length - 2), u = s - i, k = (o) => P[clamp(i + o, 0, P.length - 1)];
  return [0, 1, 2].map((q) => 0.5 * (2 * k(0)[q] + (k(1)[q] - k(-1)[q]) * u + (2 * k(-1)[q] - 5 * k(0)[q] + 4 * k(1)[q] - k(2)[q]) * u * u + (3 * k(0)[q] - k(-1)[q] - 3 * k(1)[q] + k(2)[q]) * u * u * u));
});
// the outline of a lobe: widest near its root, and either round at its tip or blunt
const lobe = (w) => (s) => w * pow(max(1 - pow(s, 2.2), 0), 0.6), paddle = (w) => (s) => w * (1 - 0.6 * s * s * s);

// ---------------------------------------------------------------- meshes
// Marrella splendens: a wedge of a head shield with two pairs of long spines that sweep back over a body with many
// fine legs and feathery gills, and a pair of long feelers in front. One unit from the front of the shield to the
// tips of the spines.
// aux: 0 on shield, body and spines, up to 1 towards the tips of the legs and the feelers and up to 0.5 out along
// the gills, all of which the shader moves
function meshMarrella() {
  const m = new Mesh(), NC = LV > 1 ? 4 : 7;
  loft(m, [[0.2, 0.05, 0.03, 0.004], [0.26, 0.12, 0.05, 0.012], [0.36, 0.095, 0.05, 0.012], [0.45, 0.05, 0.03, 0.006], [0.5, 0.008, 0.008, 0]], 2, 8);
  loft(m, [[-0.38, 0.005, 0.005, 0], [-0.22, 0.022, 0.018, 0], [0, 0.04, 0.03, 0], [0.22, 0.05, 0.036, 0]], 1, 6);
  for (const sx of [-1, 1]) {
    // the side spines: out of the corners of the shield in a wide curve and back along the body
    m.tube(curve([[sx * 0.09, 0.005, 0.27], [sx * 0.24, 0.02, 0.2], [sx * 0.33, 0.035, 0.02], [sx * 0.33, 0.05, -0.2], [sx * 0.27, 0.06, -0.38], [sx * 0.19, 0.065, -0.5]], NC), (k) => 0.026 * (1 - k / (NC + 0.6)), 4, true, () => 0);
    // the back spines: from the rear rim of the shield up and back over the body
    m.tube(curve([[sx * 0.05, 0.04, 0.24], [sx * 0.08, 0.14, 0.12], [sx * 0.11, 0.19, -0.08], [sx * 0.13, 0.18, -0.28], [sx * 0.12, 0.13, -0.46]], NC), (k) => 0.022 * (1 - k / (NC + 0.6)), 4, true, () => 0);
    // the feelers, sweeping forward and out, and behind them a short stout paddle
    m.tube(curve([[sx * 0.03, 0, 0.46], [sx * 0.09, 0.015, 0.6], [sx * 0.17, 0.02, 0.72], [sx * 0.27, 0.01, 0.8]], 5), (k) => 0.006 * (1 - k / 5.6), 3, true, (k) => k / 5);
    blade(m, [sx * 0.05, -0.02, 0.36], [sx * 0.75, -0.45, 0.3], [0, 0, 1], 0.12, lobe(0.022), (s) => 0.6 * s, 2);
    // the gills: a row of fine feathers that trail out and back from the body, and under them the legs
    for (let k = 0; k < 11; k++) blade(m, [sx * (0.032 - 0.002 * k), -0.004, 0.17 - k * 0.042], [sx * 0.62, -0.2, -0.76], [sx * 0.77, 0, 0.63], 0.14 - 0.006 * k, (s) => 0.009 * (1 - 0.6 * s), (s) => 0.5 * s, 1);
    for (let k = 0; k < 12; k++) {
      const z = 0.2 - k * 0.044, r = 0.03 - 0.0018 * k, a = m.v(sx * r, -0.01, z + 0.009, 0), b = m.v(sx * r, -0.01, z - 0.009, 0);
      m.tri(a, b, m.v(sx * (0.13 - 0.007 * k), -0.085 + 0.003 * k, z - 0.025, 1));
    }
  }
  return m;
}
// Metaspriggina walcotti: slim, narrow from side to side, tapering to the head and to the tail, no fins. A small head
// with two large eyes set high. One unit from snout to tail. aux: -1 on the eyes, 0 elsewhere
function meshMetaspriggina() {
  const m = new Mesh();
  loft(m, [[-0.5, 0.002, 0.005, 0], [-0.42, 0.008, 0.03, 0], [-0.25, 0.02, 0.06, 0], [0, 0.034, 0.088, 0], [0.2, 0.036, 0.08, 0], [0.36, 0.034, 0.06, 0.004], [0.44, 0.03, 0.045, 0.006], [0.485, 0.02, 0.028, 0.006], [0.5, 0.006, 0.008, 0.005]], 2, 8);
  for (const sx of [-1, 1]) ball(m, [sx * 0.021, 0.03, 0.447], 0.012, -1, 10, 6);
  return m;
}
// The jellyfish Burgessomedusa phasmiformis: a bell much higher than wide (its width is 40 % of its height), with four
// sides and round corners, and more than 90 short tentacles like fingers around its rim (15 % of its height long).
// Inside, as the fossils show them: the stomach under the top, the mouth tube hanging from it, four long gonads at
// the corners. One unit from the rim (y = 0) to the top (y = 1), the tentacles hang below.
// aux: 0 on the bell, -1 on what is inside it, above 0 down a tentacle (1 at its tip).
// What is inside comes first, the bell last: it is see-through and is laid over them in this order
function meshMedusa() {
  const m = new Mesh(), N = LV > 1 ? 24 : 56, R = LV > 1 ? 10 : 18, TQ = LV > 1 ? [0, 0.4, 0.75, 1] : [0, 0.18, 0.36, 0.54, 0.72, 0.88, 1];
  // the outline of the bell from above, and how wide the bell is at a height
  const sq = (a) => { const c = cos(a), s = sin(a), k = pow(pow(abs(c), 4.2) + pow(abs(s), 4.2), -1 / 4.2); return [c * k, s * k]; };
  const wide = (y) => 0.2 * pow(max(1 - pow(y, 3.4), 0), 0.5);
  ball(m, [0, 0.87, 0], [0.085, 0.05, 0.085], -1, 12, 7);
  m.tube([[0, 0.84, 0], [0, 0.7, 0], [0, 0.55, 0], [0, 0.42, 0], [0, 0.34, 0]], (k) => [0.034, 0.028, 0.024, 0.024, 0.032][k], 8, false, () => -1);
  ball(m, [0, 0.335, 0], [0.037, 0.018, 0.037], -1, 8, 4);
  for (const [sx, sz] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) ball(m, [sx * 0.1, 0.56, sz * 0.1], [0.026, 0.225, 0.026], -1, 8, 8);
  for (let j = 0; j < 96; j++) {
    // (each as long as it likes, up to 15 % of the bell's height and a little over, and curving out from the rim)
    const [x, z] = sq((j + 0.5) / 96 * TAU), h = 0.09 + 0.09 * ihash(j, 3, 7), o = 0.05 + 0.25 * ihash(j, 5, 1);
    m.tube(TQ.map((q, k) => { const r = 0.194 * (1 + o * q * q); return [x * r, k ? -h * q : 0.01, z * r]; }), (k) => 0.0075 - 0.004 * TQ[k], LV > 1 ? 3 : 5, true, (k) => max(TQ[k], 0.03));
  }
  const rings = [[]];
  // the rim is turned in a little; above it the rings stand closer together towards the top, where the bell rounds off
  for (let s = 0; s < N; s++) { const [x, z] = sq(s / N * TAU); rings[0].push(m.v(x * 0.165, 0.012, z * 0.165, 0)); }
  for (let k = 0; k < R; k++) { const y = 1 - pow(1 - k / R, 2.2), w = wide(y), ring = []; for (let s = 0; s < N; s++) { const [x, z] = sq(s / N * TAU); ring.push(m.v(x * w, y, z * w, 0)); } rings.push(ring); }
  for (let k = 0; k < rings.length - 1; k++) for (let s = 0; s < N; s++) { const s2 = (s + 1) % N; m.quad(rings[k][s], rings[k][s2], rings[k + 1][s2], rings[k + 1][s]); }
  const top = m.v(0, 1, 0, 0), last = rings[rings.length - 1];
  for (let s = 0; s < N; s++) m.tri(last[s], last[(s + 1) % N], top);
  return m;
}
// The flaps of Opabinia and of Anomalocaris: the length of the longest one (the body is 1 long) and how far the flaps
// point down from level, in radians. The meshes are built from these, and the shaders need them to beat the flaps.
// ANY, ANZ: where the arms of Anomalocaris come out from under the front of its head (how far under the middle of
// the body, how far ahead of it). From there on the shader curls them. ANL: how long they are
const OPF = 0.115, OPD = 0.55, ANF = 0.17, AND = 0.15, ANY = 0.022, ANZ = 0.47, ANL = 0.32;
// Opabinia regalis: a body of 15 segments, each with a pair of flaps that point down and out and lie over one another
// like roof tiles; a tail of three pairs of blades that point up and out; five eyes on stalks on the head (two in
// front, two larger ones on longer stalks further back and out, one between them); a trunk a third as long as the
// body with a claw at its tip. One unit from the front of the head to the tip of the tail: the trunk is extra.
// aux: 0 on the body, up to 0.5 out along a flap (how far out, as a share of OPF), 0.6 to 1 along the trunk and the
// claw, -0.3 on the tail blades, -1 on the eyes
function meshOpabinia() {
  const m = new Mesh();
  const K = [[-0.5, 0.004, 0.004, 0.012], [-0.44, 0.016, 0.014, 0.006], [-0.38, 0.03, 0.025, 0], [-0.2, 0.046, 0.037, 0], [0, 0.052, 0.042, 0], [0.2, 0.052, 0.042, 0], [0.34, 0.046, 0.04, 0], [0.42, 0.05, 0.045, 0.004], [0.47, 0.042, 0.038, 0.004], [0.5, 0.014, 0.014, 0]];
  loft(m, K, 3, 10);
  for (const sx of [-1, 1]) {
    for (let k = 0; k < 15; k++) {
      const z = 0.33 - k * 0.05, len = OPF * (0.62 + 0.38 * sin(PI * (k + 2) / 18));
      blade(m, [sx * wideAt(K, z) * 0.8, -0.012, z], [sx * cos(OPD), -sin(OPD), -0.18], [0, -0.22, 1], len, paddle(0.044), (s) => 0.5 * s * len / OPF, 5);
    }
    for (let k = 0; k < 3; k++) blade(m, [sx * 0.012, 0.01, -0.405 - k * 0.032], [sx * 0.62, 0.7, -0.36], [0, 0.25, 1], 0.1 + 0.015 * k, paddle(0.03), () => -0.3, 5);
  }
  const eye = (a, b, r) => { m.tube([a, b], () => 0.006, 5, false, () => 0); ball(m, b, r, -1, 10, 6); };
  eye([0, 0.04, 0.435], [0, 0.074, 0.44], 0.012);
  for (const sx of [-1, 1]) { eye([sx * 0.018, 0.036, 0.462], [sx * 0.024, 0.064, 0.482], 0.011); eye([sx * 0.034, 0.034, 0.405], [sx * 0.064, 0.08, 0.405], 0.015); }
  // the trunk, straight ahead (the shader bends it), and the two halves of its claw with their spines
  const TL = 0.34, tp = []; for (let k = 0; k <= 12; k++) tp.push([0, -0.01, 0.495 + TL * k / 12]);
  m.tube(tp, (k) => 0.017 - 0.006 * k / 12, 6, true, (k) => 0.6 + 0.4 * k / 12);
  for (const sy of [-1, 1]) {
    const z0 = 0.495 + TL;
    m.tube([[0, -0.01 + sy * 0.006, z0], [0, -0.01 + sy * 0.03, z0 + 0.022], [0, -0.01 + sy * 0.03, z0 + 0.05], [0, -0.01 + sy * 0.012, z0 + 0.07]], (k) => [0.011, 0.01, 0.008, 0.003][k], 4, true, () => 1);
    for (let k = 0; k < 4; k++) { const z = z0 + 0.02 + k * 0.013, y = -0.01 + sy * (0.026 - 0.004 * k); m.tri(m.v(0.004, y, z, 1), m.v(-0.004, y, z, 1), m.v(0, y - sy * 0.014, z + 0.008, 1)); }
  }
  return m;
}
// Anomalocaris canadensis: a long flat body, widest between the third and the fifth of its 13 pairs of flaps, which
// lie over one another; three pairs of small flaps on the neck; a tail fan of three pairs of blades and a tail piece;
// an oval shield on the head, two eyes on stalks at its sides, a round mouth under the head, and in front of it two
// arms of 14 joints with spines underneath, side by side. One unit from the front of the head to the end of the body:
// the arms and the tail fan are extra.
// aux: 0 on the body, up to 0.5 out along a flap (how far out, as a share of ANF), 1 on the arms (straight ahead: the
// shader curls them), -0.5 on the head shield, -0.3 on the tail fan, -1 on the eyes
function meshAnomalocaris() {
  const m = new Mesh();
  const K = [[-0.5, 0.012, 0.01, 0.004], [-0.44, 0.026, 0.02, 0.002], [-0.3, 0.05, 0.04, 0], [-0.1, 0.075, 0.058, 0], [0.1, 0.092, 0.066, 0], [0.22, 0.092, 0.066, 0.002], [0.3, 0.08, 0.06, 0.006], [0.38, 0.078, 0.058, 0.01], [0.45, 0.066, 0.05, 0.01], [0.49, 0.04, 0.032, 0.008], [0.5, 0.012, 0.01, 0.006]];
  loft(m, K, 3, 14, 0, (a) => [cos(a), sin(a) * (sin(a) < 0 ? 0.75 : 1)]);
  ball(m, [0, 0.052, 0.385], [0.052, 0.022, 0.085], -0.5, 20, 7);
  for (const sx of [-1, 1]) {
    m.tube([[sx * 0.06, 0.03, 0.4], [sx * 0.095, 0.048, 0.404], [sx * 0.118, 0.058, 0.406]], (k) => 0.011 - 0.001 * k, 6, false, () => 0);
    ball(m, [sx * 0.13, 0.062, 0.407], [0.026, 0.023, 0.026], -1, 20, 10);
    for (let k = 0; k < 16; k++) {
      const neck = k < 3, z = neck ? 0.335 - k * 0.032 : 0.225 - (k - 3) * 0.052;
      const len = neck ? 0.05 + 0.008 * k : ANF * [0.72, 0.9, 1, 1, 0.96, 0.89, 0.81, 0.72, 0.62, 0.52, 0.43, 0.34, 0.26][k - 3];
      blade(m, [sx * wideAt(K, z) * 0.85, -0.008, z], [sx * cos(AND) * 0.9, -sin(AND), -0.42], [0, -0.2, 1], len, paddle(neck ? 0.024 : 0.034 + 0.012 * len / ANF), (s) => 0.5 * s * len / ANF, 5);
    }
    for (let k = 0; k < 3; k++) blade(m, [sx * 0.012, 0.012, -0.43 - k * 0.028], [sx * 0.5, 0.62, -0.6], [0, 0.2, 1], 0.085 + 0.02 * k, lobe(0.03), () => -0.3, 5);
    // an arm: its 14 joints, and under each of them a pair of spines, long and short in turn. It begins inside the
    // head, so that it comes out of it and does not hang under it
    // (the spines point down and a little towards the other arm: a basket between the two)
    const AX = 0.03, rad = (k) => 0.023 - 0.016 * pow(k / 14, 0.8), ap = [[sx * AX, -ANY, ANZ - 0.08]];
    for (let k = 0; k <= 14; k++) ap.push([sx * AX, -ANY, ANZ + ANL * k / 14]);
    m.tube(ap, (k) => rad(max(k - 1, 0)), 8, true, () => 1);
    for (let k = 1; k < 14; k++) {
      const z = ANZ + ANL * k / 14, r = rad(k), len = (k % 2 ? 0.07 : 0.04) * (1 - 0.5 * k / 14);
      for (const e of [-1, 1]) m.tri(m.v(sx * AX + e * 0.004, -ANY - r * 0.8, z - 0.006, 1), m.v(sx * AX + e * 0.004, -ANY - r * 0.8, z + 0.006, 1), m.v(sx * (AX - 0.3 * len) + e * 0.01, -ANY - r - len, z + len * 0.35, 1));
    }
  }
  // the mouth: a round disc under the head, behind the arms
  ball(m, [0, -0.034, 0.385], [0.032, 0.012, 0.032], -0.5, 12, 5);
  blade(m, [0, 0.008, -0.49], [0, 0.12, -1], [1, 0, 0], 0.07, (s) => 0.014 * (1 - 0.6 * s), () => -0.3, 2);
  return m;
}

// ---------------------------------------------------------------- shaders
// What all of them share comes first, with the first kind in world.js: the height of the mud for those that keep
// close to it (the formula of floor.js, with the tongues written out), and the light on a skin.
// Light here is soft and comes from above: a surface is lit by the sun as far as it reaches down, by the water above
// and around it, and it gets a pale rim against the dark. Every fragment shader turns the normal to the viewer where
// it sees the back of a triangle: flaps and blades are a single sheet.
// Every animal gives way to the viewer (dodge), so that none swims through the camera: where its middle c would come
// closer than r, it is moved away, by less the further off it is and by nothing at r. lv = 1: it keeps its height and
// goes sideways (for those that keep to the ground). h: how far the animal reaches up and down from its middle.
// zooDodge below is the same for the zoo: change one, change the other
const TGS_W = Array.from({ length: TONGUES.length * 2 }, (_, i) => 'vec4f(' + Array.from(FLOOR.prims.subarray(i * 4, i * 4 + 4)).join(', ') + ')').join(', ');
const S_SEA = /*wgsl*/`
const TGS = array<vec4f, ${TONGUES.length * 2}>(${TGS_W});
` + groundWgsl(TONGUES.length + 'u', (i) => 'TGS[' + i + ']') + /*wgsl*/`
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
`;
const S_MARRELLA = /*wgsl*/`
// Instance: a = the middle of the round its swarm makes (x, z) and how wide that round is (w), b = its own seed, the
// speed of the swarm (rad/s, the sign is the direction), its length, the seed of the swarm.
// The round of a swarm (mrP) is repeated in zooMarrella below, which has to know where a swarm is: change one,
// change the other
fn mrP(ta: f32, a: vec4f, ph: f32) -> vec2f { return a.xz + a.w * vec2f(cos(ta) * (1. + .22 * sin(2. * ta + ph)), .7 * sin(ta) * (1. + .22 * cos(3. * ta + ph))); }
@vertex fn vsMarrella(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x; let h = vec3f(hs(s), hs(s + .37), hs(s + .71)); let R = i.a.w; let ph = i.b.w * 17.; let au = i.n.w;
  // each animal has its place in the swarm (so far along the round, so far to the side, so high over the mud) and
  // wanders about that place
  let ta = t * i.b.y + i.b.w * 6.3 + ((h.x - .5) * 14. + 1.5 * sin(t * .23 + s * 40.)) / R;
  let p0 = mrP(ta, i.a, ph); let T2 = normalize(mrP(ta + .4 / R, i.a, ph) - p0) * sign(i.b.y); let S2 = vec2f(T2.y, -T2.x);
  let q = p0 + S2 * ((h.y - .5) * 8. + sin(t * .31 + s * 31.));
  let bob = t * .5 + s * 50.;
  let y = ground(q) + .4 + 2.2 * h.z * sqrt(h.z) + .3 * sin(bob);
  // it heads along the round, turning a little this way and that, nose up while it rises and down while it sinks
  let yaw = .5 * sin(t * .7 + s * 23.);
  var T = vec3f(T2.x, 0., T2.y) * cos(yaw) + vec3f(S2.x, 0., S2.y) * sin(yaw); let S = vec3f(T.z, 0., -T.x);
  T = normalize(T + vec3f(0., .3 * cos(bob), 0.)); let Up = cross(T, S);
  // legs, gills and feelers beat (aux: how far out along one a vertex is)
  var l = i.p; let bt = t * 11. + l.z * 16. + s * 60.;
  l.y += au * .05 * sin(bt); l.z += au * .03 * cos(bt);
  let w = dodge(vec3f(q.x, y, q.y), 2.2, 1., 0.) + (S * l.x + Up * l.y + T * l.z) * i.b.z;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * i.n.x + Up * i.n.y + T * i.n.z; o.op = i.p; o.sd = s; o.lt = au;
  return o;
}
@fragment fn fsMarrella(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let n = normalize(i.n) * select(-1., 1., ff);
  // a dark brown shield with a paler ridge, the spines darker still towards their tips; legs, gills and feelers pale
  var alb = mix(vec3f(.30, .15, .06), vec3f(.12, .06, .035), ss(.15, -.45, i.op.z) * step(.06, abs(i.op.x)));
  alb = mix(alb, vec3f(.46, .27, .12), ss(.035, .0, abs(i.op.x)) * ss(.2, .3, i.op.z));
  alb = mix(alb, vec3f(.52, .44, .30), ss(.0, .25, i.lt)) * (.8 + .4 * hs(i.sd * 9.));
  return fin(fog(skin(alb, n, i.wp, .35), i.wp, zone(i.wp)));
}
`;
const S_METASPRIGGINA = /*wgsl*/`
// Instance: a = how far the round of its shoal keeps from the line of the wall's foot (x), the height (y) and the z
// of its middle, half its length along the wall (w), b = its own seed, the speed of the shoal (rad/s, the sign is the
// direction), its length, the seed of the shoal.
// A shoal swims a long round beside the wall, following its line. msP is repeated in zooMetaspriggina below: change
// one, change the other
fn msP(ta: f32, a: vec4f, ph: f32) -> vec3f {
  let z = a.z + a.w * sin(ta);
  return vec3f(wallx(z) - a.x + 4. * cos(ta), a.y + 2.2 * sin(2. * ta + ph), z);
}
@vertex fn vsMetaspriggina(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x; let h = vec3f(hs(s), hs(s + .37), hs(s + .71)); let ph = i.b.w * 17.; let e = .5 / i.a.w;
  let ta = t * i.b.y + i.b.w * 6.3 + ((h.x - .5) * 11. + sin(t * .27 + s * 40.)) / i.a.w;
  let T = normalize(msP(ta + e, i.a, ph) - msP(ta - e, i.a, ph)) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let off = S * ((h.y - .5) * 3.4 + .5 * sin(t * .6 + s * 31.)) + Up * ((h.z - .5) * 2.6 + .4 * cos(t * .5 + s * 23.));
  // a wave runs down the whole body, wider towards the tail: it swims like an eel
  var l = i.p; var n = i.n.xyz;
  let u = .5 - l.z; let A = .012 + .085 * u * u; let wv = t * 8. + s * 50. - u * 5.5;
  l.x += A * sin(wv);
  let sl = 5.5 * A * cos(wv) - .17 * u * sin(wv);
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  let w = dodge(msP(ta, i.a, ph) + off, 2., 0., 0.) + (S * l.x + Up * l.y + T * l.z) * i.b.z;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
@fragment fn fsMetaspriggina(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let n = normalize(i.n) * select(-1., 1., ff);
  // a dusky back and pale flanks. The blocks of muscle show as fine chevrons that point forward (they fade where they
  // would be finer than the pixels)
  let a = (i.op.z + abs(i.op.y) * 1.3) * 270.;
  let ch = (.5 + .5 * sin(a)) * ss(1.6, .5, fwidth(a)) * ss(.42, .3, i.op.z);
  var alb = mix(vec3f(.36, .37, .31), vec3f(.10, .11, .08), ss(-.025, .06, i.op.y));
  // a pale line where the stiff rod of its back runs, and behind the head the seven gill bars, faintly red
  alb = mix(alb, vec3f(.44, .42, .36), ss(.012, .0, abs(i.op.y - .014)) * ss(.45, .35, i.op.z) * .5);
  let gb = (i.op.z - .27 + i.op.y * .5) / .017;
  let bars = ss(.3, .5, abs(fract(gb) - .5)) * step(0., gb) * step(gb, 7.) * ss(.6, .2, fwidth(gb)) * ss(.035, .005, abs(i.op.y + .008));
  alb = mix(alb, vec3f(.50, .28, .24), bars * .6) * (1. - .2 * ch) * (.85 + .3 * hs(i.sd * 7.));
  let eye = step(i.lt, -.5);
  alb = mix(alb, vec3f(.014, .012, .012), eye);
  return fin(fog(skin(alb, n, i.wp, .45 + 1.2 * eye), i.wp, zone(i.wp)));
}
`;
const S_MEDUSA = /*wgsl*/`
// Instance: a = where it floats (the middle of its bell) and how far it drifts around that place (w), b = where in
// its pulse it is, how fast it pulses (rad/s), the height of its bell, a seed.
// It drifts about its place, slowly rising and sinking, and every pulse lifts it a little. mdP is repeated in
// zooMedusa below: change one, change the other
fn mdP(t: f32, a: vec4f, b: vec4f) -> vec3f {
  let d = t * .033 + b.w * 40.;
  return a.xyz + vec3f(a.w * cos(d), 1.6 * sin(t * .045 + b.w * 17.) + .03 * b.z * sin(t * b.y + b.x - 1.6), a.w * sin(d * 1.3 + 1.));
}
@vertex fn vsMedusa(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let sd = i.b.w; let au = i.n.w; let fp = t * i.b.y + i.b.x;
  // each stands turned its own way
  let c0 = cos(sd * 40.); let s0 = sin(sd * 40.);
  var l = vec3f(i.p.x * c0 - i.p.z * s0, i.p.y, i.p.x * s0 + i.p.z * c0);
  let n = vec3f(i.n.x * c0 - i.n.z * s0, i.n.y, i.n.x * s0 + i.n.z * c0);
  // the pulse: the bell draws in, most at its rim, which follows the middle a little later, and gets a little longer
  let rim = 1. - sat(l.y);
  let k = pow(.5 + .5 * sin(fp - 1.3 * rim), 2.);
  let sq = 1. - .2 * k * pow(rim, 1.4);
  l = vec3f(l.x * sq, l.y * (1. + .05 * k * step(0., l.y)), l.z * sq);
  // the tentacles trail behind the rim, swinging out and in, and each one a little by itself (aux above 0: how far
  // down a tentacle a vertex is)
  let tn = max(au, 0.); let rd = normalize(l.xz + vec2f(1e-5, 0.));
  let sw = tn * (.05 * sin(fp - 2.7) + .02 * sin(t * 1.9 + i.p.x * 140. + i.p.z * 90.));
  l = vec3f(l.x + rd.x * sw, l.y + tn * .02 * cos(fp - 2.7), l.z + rd.y * sw);
  // each leans its own way, and a little this way and that
  let tl = .16 * vec2f(sin(sd * 71.), cos(sd * 53.)) + .18 * vec2f(sin(t * .21 + sd * 9.), cos(t * .17 + sd * 5.));
  l = vec3f(l.x + (l.y - .5) * tl.x, l.y, l.z + (l.y - .5) * tl.y);
  let w = dodge(mdP(t, i.a, i.b), 2.4, 1., .55 * i.b.z) + (l - vec3f(0., .5, 0.)) * i.b.z;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = n; o.op = i.p; o.sd = sd; o.lt = au;
  return o;
}
// It is see-through (glass in its kind): this returns its colour times its alpha, and the alpha
@fragment fn fsMedusa(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let V = normalize(g.cam.xyz - i.wp); let organ = step(i.lt, -.5); let tent = ss(.0, .05, i.lt);
  // (a tentacle is too thin for its three sides to show: its light is that of a round, soft thing)
  let n = normalize(mix(normalize(i.n) * select(-1., 1., ff), V, .7 * tent));
  let z = zone(i.wp); let vv = vol(i.wp); let dist = distance(g.cam.xyz, i.wp);
  let ndv = sat(dot(n, V)); let edge = pow(1. - ndv, 2.);
  // light from above and from the water all round, as through milk glass
  let E = sunE(i.wp.y, z); let am = amb(i.wp, vec3f(n.x, abs(n.y) * .5 + .45, n.z), vv.g, z);
  // the bell: clear, with a milky skin that is thicker towards the top and along its four corners, and fine canals
  // running down it. Stomach and mouth tube are pale, the gonads and the tentacles a pale rose, all of them soft
  let an = atan2(i.op.z, i.op.x + 1e-5);
  let cn = pow(abs(sin(2. * an)), 6.) * ss(1., .6, i.op.y);
  // (what is inside is round: darker where it turns away)
  var alb = mix(vec3f(.70, .86, .80), mix(vec3f(.88, .84, .74), vec3f(.92, .60, .48), ss(.04, .09, length(i.op.xz))) * (.6 + .4 * ndv), organ);
  alb = mix(alb, vec3f(.80, .70, .60), tent);
  // From afar it is a soft pale shape and not a drawn outline: the skin counts for more there and its edge for less.
  // And it goes with the haze: beyond what the water lets one see, nothing of it is left
  let far = ss(6., 26., dist);
  var al = .06 + .13 * far + (.5 - .24 * far) * edge + .14 * cn + .12 * ss(.7, 1., i.op.y) + .035 * (.5 + .5 * cos(an * 16.)) * ss(.95, .6, i.op.y);
  al = mix(mix(al, .16 + .34 * ndv, organ), .42, tent) * ss(95., 45., dist);
  let c = alb * (E * (.35 + .4 * sat(dot(n, g.sun.xyz))) + am * 1.2) + (E + am) * edge * .3 * (1. - organ);
  return vec4f(min(max(fog(c, i.wp, z), vec3f(0.)), vec3f(40.)) * al, al);
}
`;
const S_OPABINIA = /*wgsl*/`
// Instance: a = the middle of the round it makes (x, z), how high over the mud it swims (y) and how wide the round
// is (w), b = where on the round it starts, its speed (rad/s, the sign is the direction), its length, a seed.
// It follows the mud up and down its swells. opP is repeated in opAt and zooOpabinia below: change one, change
// the others
fn opP(ta: f32, a: vec4f, ph: f32) -> vec2f { return a.xz + a.w * vec2f(cos(ta), .8 * sin(ta)) * (1. + .18 * sin(3. * ta + ph)); }
@vertex fn vsOpabinia(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let sz = i.b.z; let sd = i.b.w; let ph = sd * 6.3; let au = i.n.w;
  var l = i.p; var n = i.n.xyz; let sgn = select(-1., 1., l.x > 0.);
  // the flaps beat up and down about their roots, each a little later than the one before it: a wave that runs back
  // along the body, the tips trailing (aux up to .5: how far out along a flap a vertex is)
  let fl = step(.004, au) * step(au, .51); let D = 2. * au * ${OPF} * fl;
  let th = .38 * sin(t * 3. + l.z * 10. + sd * 20. - au * 2.4) * fl;
  l.x += sgn * D * (cos(${OPD} - th) - cos(${OPD})); l.y += D * (sin(${OPD}) - sin(${OPD} - th));
  let ct = cos(th); let st = sin(th); let nx = sgn * n.x; n = vec3f(sgn * (nx * ct - n.y * st), nx * st + n.y * ct, n.z);
  // the trunk bends down to the mud and lifts again, and sways from side to side (aux above .55; in the mesh it
  // points straight ahead from z = .495)
  let tr = step(.55, au); let d = max(l.z - .495, 0.);
  let ka = 3.4 + 2.2 * sin(t * .6 + sd * 7.) + .5 * sin(t * 1.7 + sd * 3.); let an = ka * d; let oy = l.y + .01;
  let bent = vec3f(l.x + d * d * 1.3 * sin(t * .37 + sd * 3.), -.01 - (1. - cos(an)) / ka + oy * cos(an), .495 + sin(an) / ka + oy * sin(an));
  l = mix(l, bent, tr);
  n = mix(n, vec3f(n.x, n.y * cos(an) - n.z * sin(an), n.y * sin(an) + n.z * cos(an)), tr);
  // onto its round, level with the mud under it
  let ta = t * i.b.y + i.b.x;
  let p0 = opP(ta, i.a, ph); let p1 = opP(ta + sign(i.b.y) * .3 / i.a.w, i.a, ph); let g0 = ground(p0);
  let T = normalize(vec3f(p1.x - p0.x, ground(p1) - g0, p1.y - p0.y));
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let w = dodge(vec3f(p0.x, g0 + i.a.y + .1 * sin(t * .43 + sd * 11.), p0.y), 2., 1., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = sd; o.lt = au;
  return o;
}
@fragment fn fsOpabinia(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let tx = textureSample(tD, sR, i.op.zx * vec2f(6., 9.) + i.op.y * 3. + i.sd);
  let n = normalize(normalize(i.n) * select(-1., 1., ff) + (vec3f(tx.r, 0., tx.g) - vec3f(.5, 0., .5)) * .25);
  let flap = max(ss(.01, .1, i.lt) * step(i.lt, .52), step(i.lt, -.15) * step(-.4, i.lt)); let trunk = step(.55, i.lt); let eye = step(i.lt, -.75);
  // the colour of sand with a little rose, darker along the back. The 15 segments show as fine lines; the flaps and
  // the tail blades are a little paler, more so towards their rims, with fine rays; the trunk is ringed (lines, rays
  // and rings fade where they would be finer than the pixels)
  var alb = mix(vec3f(.47, .35, .25), vec3f(.33, .20, .14), ss(.0, .035, i.op.y + (tx.a - .5) * .02));
  let sg = (i.op.z + .395) / .05;
  alb *= 1. - .3 * ss(.4, .5, abs(fract(sg) - .5)) * ss(.6, .2, fwidth(sg)) * (1. - trunk) * (1. - flap) * step(i.op.z, .37);
  let ry = (i.op.z + .21 * abs(i.op.x)) * 600.;
  alb = mix(alb, mix(vec3f(.42, .30, .22), vec3f(.53, .42, .32), ss(.1, .45, abs(i.lt))) * (.9 + .1 * sin(ry) * ss(1.5, .5, fwidth(ry))), flap);
  let rg = (i.op.z - .495) * 190.;
  alb = mix(alb, vec3f(.42, .29, .20) * (.85 + .15 * sin(rg) * ss(1.5, .5, fwidth(rg))), trunk);
  alb = mix(alb * (.8 + .4 * tx.b), vec3f(.035, .014, .012), eye);
  // (a flap is thin: light comes through it, so it is lit as much from its other side)
  let c = skin(alb, n, i.wp, .15 + 1.5 * eye);
  return fin(fog(mix(c, .5 * (c + skin(alb, -n, i.wp, 0.)), flap), i.wp, zone(i.wp)));
}
`;
const S_ANOMALOCARIS = /*wgsl*/`
// Instance: a = the middle of its path and half the length of that path (w), b = where on it the animal starts, its
// speed (rad/s, the sign is the direction), the length of its body, a seed.
// The path is an oval lying along z, as wide as the seed says (anK): at least 0.7 times as wide as long, or its
// turns would be tighter than the animal can bend. Every vertex of the trunk sits its own z further along the path,
// so the body follows it like a train on rails and bends through the turns. Head and arms do not: they are stiff
// and point where the neck points, and so does the tail fan behind the last segment. anK, anP and anT are repeated
// in zooAnomalocaris below: change one, change the other
fn anK(sd: f32) -> f32 { return .7 + .3 * fract(sd * 7.); }
fn anP(ta: f32, a: vec4f, sd: f32) -> vec3f { return a.xyz + vec3f(a.w * anK(sd) * sin(ta), 1.6 * sin(2. * ta + sd * 6.3), a.w * cos(ta)); }
fn anT(ta: f32, a: vec4f, sd: f32) -> vec3f { return vec3f(a.w * anK(sd) * cos(ta), 3.2 * cos(2. * ta + sd * 6.3), -a.w * sin(ta)); }
@vertex fn vsAnomalocaris(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let sz = i.b.z; let sd = i.b.w; let dir = sign(i.b.y); let au = i.n.w;
  var l = i.p; var n = i.n.xyz; let sgn = select(-1., 1., l.x > 0.);
  // the flaps beat up and down about their roots, each a little later than the one before it: a wave that runs back
  // along the body, the tips trailing (aux up to .5: how far out along a flap a vertex is)
  let fl = step(.004, au) * step(au, .51); let D = 2. * au * ${ANF} * fl;
  let th = .36 * sin(t * 2.4 + l.z * 8. + sd * 20. - au * 2.2) * fl;
  l.x += sgn * D * (cos(${AND} - th) - cos(${AND})); l.y += D * (sin(${AND}) - sin(${AND} - th));
  let ct = cos(th); let st = sin(th); let nx = sgn * n.x; n = vec3f(sgn * (nx * ct - n.y * st), nx * st + n.y * ct, n.z);
  // the arms curl down and stretch again, slowly and nearly together (aux above .55; in the mesh they point
  // straight ahead, and bend from where they leave the head)
  let ar = step(.55, au); let d = max(l.z - ${ANZ}, 0.);
  let ka = 2.6 + 1.6 * sin(t * .6 + sd * 9. + sgn * .15); let an = ka * d; let oy = l.y + ${ANY};
  let bent = vec3f(l.x + sgn * d * .1, oy * cos(an) - ${ANY} - (1. - cos(an)) / ka, ${ANZ} + sin(an) / ka + oy * sin(an));
  l = mix(l, bent, ar);
  n = mix(n, vec3f(n.x, n.y * cos(an) - n.z * sin(an), n.y * sin(an) + n.z * cos(an)), ar);
  // It gives way to the viewer: where its middle line would pass the camera closer than 3.4 units, all of it moves
  // aside, or down if the camera is right in its way, and it begins to 5 units before it is there. (zooAnomalocaris
  // has the same)
  let ta0 = t * i.b.y + i.b.x; let zr = clamp(l.z, -.45, .3);
  let cv = g.cam.xyz - anP(ta0, i.a, sd); let T0 = normalize(anT(ta0, i.a, sd)); let al = dot(cv, T0); let lat = cv - T0 * al;
  let give = normalize(lat + vec3f(0., .4, 0.)) * (-2.4 * (1. - ss(0., 3.4, length(lat))) * (1. - ss(.7 * sz, .7 * sz + 5., abs(al))));
  // onto the path, banked into the turn
  let ta = ta0 + dir * zr * sz / length(anT(ta0, i.a, sd));
  let T = normalize(anT(ta, i.a, sd)) * dir;
  var S = normalize(cross(vec3f(0., 1., 0.), T)); var Up = cross(T, S);
  let bank = .12 * dir;
  let S2 = S * cos(bank) - Up * sin(bank); Up = Up * cos(bank) + S * sin(bank); S = S2;
  let w = anP(ta, i.a, sd) + give + (S * l.x + Up * l.y + T * (l.z - zr)) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = sd; o.lt = au;
  return o;
}
@fragment fn fsAnomalocaris(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let fine = textureSample(tD, sR, i.op.zx * vec2f(5., 7.) + i.op.y * 3. + i.sd);
  let blot = textureSample(tD, sR, i.op.zx * vec2f(1.1, 1.7) + i.op.y * .9 + i.sd * 3.);
  let n = normalize(normalize(i.n) * select(-1., 1., ff) + (vec3f(fine.r, 0., fine.g) - vec3f(.5, 0., .5)) * .3);
  let flap = max(ss(.01, .08, i.lt) * step(i.lt, .52), step(i.lt, -.15) * step(-.4, i.lt)); let arm = step(.55, i.lt); let eye = step(i.lt, -.75); let plate = step(i.lt, -.4) * (1. - eye);
  // a rust-brown back with darker blotches, a pale belly, a ragged line between the two
  let top = ss(-.035, .02, i.op.y + (blot.a - .5) * .04);
  var back = mix(vec3f(.25, .105, .07), vec3f(.42, .20, .11), ss(.4, .7, blot.a));
  back = mix(back, vec3f(.11, .05, .04), ss(.5, .72, blot.b) * .5);
  var alb = mix(vec3f(.50, .42, .34), back, top);
  // a dark line between each two segments, and across the back the fine blades of the gills (both fade where they
  // would be finer than the pixels)
  let sg = (i.op.z + .451) / .052; let gb = i.op.x * 520.;
  alb *= 1. - .35 * ss(.4, .5, abs(fract(sg) - .5)) * ss(.6, .2, fwidth(sg)) * step(i.op.z, .27) * (1. - flap);
  alb *= 1. - .25 * (.5 + .5 * sin(gb)) * ss(1.5, .5, fwidth(gb)) * top * ss(.02, .05, abs(i.op.x)) * step(i.op.z, .27) * (1. - flap);
  // the flaps and the tail fan: paler towards their rims, with fine rays
  let ry = (i.op.z + .47 * abs(i.op.x)) * 420.;
  alb = mix(alb, mix(back, vec3f(.60, .43, .30), ss(.1, .5, abs(i.lt))) * (.9 + .1 * sin(ry) * ss(1.5, .5, fwidth(ry))), flap);
  // the arms: darker, ringed at every joint. The head shield: dark and smooth
  let jt = (i.op.z - ${ANZ}) / ${ANL / 14};
  alb = mix(alb, vec3f(.34, .15, .09) * (1. - .3 * ss(.4, .5, abs(fract(jt) - .5)) * ss(.6, .2, fwidth(jt))), arm);
  alb = mix(alb, vec3f(.20, .09, .06), plate);
  // the eyes: dark, with the fine grain of their many lenses
  let ln = i.op * 900.; let lf = sin(ln.x) * sin(ln.y) * sin(ln.z) * ss(1.5, .5, max(fwidth(ln.x), max(fwidth(ln.y), fwidth(ln.z))));
  alb = mix(alb * (.78 + .44 * fine.b), vec3f(.05, .022, .016) * (1. + .6 * lf), eye);
  // (a flap is thin: light comes through it, so it is lit as much from its other side)
  let c = skin(alb, n, i.wp, .2 + .25 * plate + .6 * eye);
  return fin(fog(mix(c, .5 * (c + skin(alb, -n, i.wp, 0.)), flap), i.wp, zone(i.wp)));
}
`;

// ---------------------------------------------------------------- where they are, for the zoo
// These repeat the paths of the vertex shaders above: change one, change the other. Each writes the place of the
// animal at i in its list into ZP (see zooMove in engine/zoo.js), for the scene time F[TIME]. They run in every frame
// and allocate nothing: no float is handed to a function. Where an animal gives way to the viewer by more than its
// place is wide, its place does the same (the swarm and the shoal are wide enough without).
// The height of the mud, for the animals that keep close to it: on a grid of 3 units over the middle of the world,
// which makeWorld fills. zooGround adds the height at ZP[0], ZP[2] to ZP[1]
const GRN = 97, GRH = 144, GRD = new Float32Array(GRN * GRN);
const zooGround = () => {
  let x = (ZP[0] + GRH) / 3, z = (ZP[2] + GRH) / 3; x = x < 0 ? 0 : x > GRN - 1.01 ? GRN - 1.01 : x; z = z < 0 ? 0 : z > GRN - 1.01 ? GRN - 1.01 : z;
  const i = x | 0, j = z | 0, u = x - i, v = z - j, o = i + GRN * j;
  ZP[1] += (GRD[o] * (1 - u) + GRD[o + 1] * u) * (1 - v) + (GRD[o + GRN] * (1 - u) + GRD[o + GRN + 1] * u) * v;
};
// dodge of the shaders, for the place in ZP[0], ZP[1], ZP[2]: an animal gives way to the viewer. (How far the
// animal reaches up and down from its middle is in ZH[0] and not an argument: a float worked out by the caller and
// handed over can cost an allocation)
const ZH = new Float64Array(1);
const zooDodge = (r, lv) => {
  const vx = ZP[0] - F[CX], vy = ZP[1] - F[CY], vz = ZP[2] - F[CZ], ay = (vy < 0 ? -vy : vy) - ZH[0], by = ay > 0 ? ay : 0, d = sqrt(vx * vx + by * by + vz * vz);
  if (d >= r) return;
  const wy = vy * (1 - lv), q = d / r, k = 0.6 * r * (1 - q * q * (3 - 2 * q)) / (sqrt(vx * vx + wy * wy + vz * vz) + 1e-4);
  ZP[0] += vx * k; ZP[1] += wy * k; ZP[2] += vz * k;
};
// A swarm of Marrella: mrP of vsMarrella. The swarm spreads 8 units along its round to both sides of its middle: a
// line through the middle, 4.5 units each way, each end 1.2 units over the mud that is under it
const zooMarrella = (a, i) => {
  const R = a[i + 3], ph = a[i + 7] * 17, ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3, t0 = ta - 4.5 / R, t1 = ta + 4.5 / R;
  const x = a[i] + R * cos(t0) * (1 + 0.22 * sin(2 * t0 + ph)), z = a[i + 2] + R * 0.7 * sin(t0) * (1 + 0.22 * cos(3 * t0 + ph));
  const x1 = a[i] + R * cos(t1) * (1 + 0.22 * sin(2 * t1 + ph)), z1 = a[i + 2] + R * 0.7 * sin(t1) * (1 + 0.22 * cos(3 * t1 + ph));
  ZP[0] = x1; ZP[1] = 1.2; ZP[2] = z1; zooGround(); const y1 = ZP[1];
  ZP[0] = x; ZP[1] = 1.2; ZP[2] = z; zooGround();
  ZP[3] = x1 - x; ZP[4] = y1 - ZP[1]; ZP[5] = z1 - z; ZP[7] = 2.5;
};
// A shoal of Metaspriggina: msP of vsMetaspriggina (with the line of the wall's foot, wallX of floor.js, written out).
// The shoal spreads 6 units along its round to both sides of its middle: two lines from the middle, each 4.5 units
// along the round, one back and one ahead
const zooMetaspriggina = (a, i, part) => {
  const L = a[i + 3], ph = a[i + 7] * 17, ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3, tb = ta + (part * 2 - 1) * 4.5 / L;
  const z0 = a[i + 2] + L * sin(ta), z1 = a[i + 2] + L * sin(tb);
  const x0 = 60 + 10 * sin(z0 * 0.019 + 0.6) + 4.5 * sin(z0 * 0.051 + 2.1) - a[i] + 4 * cos(ta), y0 = a[i + 1] + 2.2 * sin(2 * ta + ph);
  ZP[0] = x0; ZP[1] = y0; ZP[2] = z0;
  ZP[3] = 60 + 10 * sin(z1 * 0.019 + 0.6) + 4.5 * sin(z1 * 0.051 + 2.1) - a[i] + 4 * cos(tb) - x0; ZP[4] = a[i + 1] + 2.2 * sin(2 * tb + ph) - y0; ZP[5] = z1 - z0; ZP[7] = 1.6;
};
// A jellyfish: mdP of vsMedusa. A line up its bell, from near the rim to near the top
const zooMedusa = (a, i) => {
  const t = F[TIME], sz = a[i + 6], sd = a[i + 7], d = t * 0.033 + sd * 40;
  ZP[0] = a[i] + a[i + 3] * cos(d); ZP[1] = a[i + 1] + 1.6 * sin(t * 0.045 + sd * 17) + 0.03 * sz * sin(t * a[i + 5] + a[i + 4] - 1.6) - sz * 0.4; ZP[2] = a[i + 2] + a[i + 3] * sin(d * 1.3 + 1);
  ZP[1] += sz * 0.4; ZH[0] = 0.55 * sz; zooDodge(2.4, 1); ZP[1] -= sz * 0.4;
  ZP[3] = 0; ZP[4] = sz * 0.8; ZP[5] = 0; ZP[7] = sz * 0.22;
};
// Opabinia: opP of vsOpabinia. A point, as thick as the animal is wide with its flaps
const zooOpabinia = (a, i) => {
  const ta = F[TIME] * a[i + 5] + a[i + 4], k = a[i + 3] * (1 + 0.18 * sin(3 * ta + a[i + 7] * 6.3));
  ZP[0] = a[i] + k * cos(ta); ZP[1] = a[i + 1]; ZP[2] = a[i + 2] + 0.8 * k * sin(ta); zooGround(); ZH[0] = 0; zooDodge(2, 1);
  ZP[3] = ZP[4] = ZP[5] = 0; ZP[7] = a[i + 6] * 0.4;
};
// the same round at load time (see makeWorld, which keeps it clear): where on it an animal is at the angle ta
const opAt = (x, z, R, sd, ta) => { const k = R * (1 + 0.18 * sin(3 * ta + sd * 6.3)); return [x + k * cos(ta), z + 0.8 * k * sin(ta)]; };
// Anomalocaris: anK, anP and anT of vsAnomalocaris. A line from the end of the body to the front of the head, which
// are half its length along the path to either side of its middle. It gives way to the viewer as its shader does
const zooAnomalocaris = (a, i) => {
  const R = a[i + 3], sz = a[i + 6], f = a[i + 7] * 7, k = R * (0.7 + 0.3 * (f - floor(f))), ph = a[i + 7] * 6.3, ta = F[TIME] * a[i + 5] + a[i + 4];
  const tx = k * cos(ta), ty = 3.2 * cos(2 * ta + ph), tz = R * sin(ta), d = sz * 0.5 / sqrt(tx * tx + ty * ty + tz * tz), t0 = ta - d, t1 = ta + d;
  const x = k * sin(t0), y = 1.6 * sin(2 * t0 + ph), z = R * cos(t0);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = k * sin(t1) - x; ZP[4] = 1.6 * sin(2 * t1 + ph) - y; ZP[5] = R * cos(t1) - z; ZP[7] = sz * 0.17;
  const tl = 1 / sqrt(tx * tx + ty * ty + tz * tz), cx = F[CX] - a[i] - k * sin(ta), cy = F[CY] - a[i + 1] - 1.6 * sin(2 * ta + ph), cz = F[CZ] - a[i + 2] - R * cos(ta);
  const al = (cx * tx + cy * ty - cz * tz) * tl, ux = cx - tx * tl * al, uy = cy - ty * tl * al, uz = cz + tz * tl * al, ld = sqrt(ux * ux + uy * uy + uz * uz), aa = al < 0 ? -al : al;
  if (ld < 3.4 && aa < 0.7 * sz + 5) {
    const q = ld / 3.4, e0 = (aa - 0.7 * sz) / 5, e = e0 < 0 ? 0 : e0, m = -2.4 * (1 - q * q * (3 - 2 * q)) * (1 - e * e * (3 - 2 * e)) / sqrt(ux * ux + (uy + 0.4) * (uy + 0.4) + uz * uz);
    ZP[0] += ux * m; ZP[1] += (uy + 0.4) * m; ZP[2] += uz * m;
  }
};
