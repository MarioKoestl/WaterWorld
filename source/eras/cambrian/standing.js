// ============================================================================
// cambrian: what stands still (meshes)
// ============================================================================
// Shapes follow the fossils as far as the sources in zoo.js describe them. Each is modelled around its foot at the
// origin, y up, at its real size (one unit is 5 cm). aux, the fourth number of a vertex, tells the material in look.js
// what part of the animal a place is. lo: the simpler mesh for far away. It has to be the same shape with fewer
// triangles, or the animal would change as the player comes closer.

// The tulip animal, Siphusauctum gregarium: a thin stalk on a small flat foot, with an egg-shaped cup on top. 4 units
// high, the cup a quarter of that. The stalk leans out and comes back, so that the cup stands over the foot (the
// material finds the six parts of the cup around that axis).
// aux: 0 at the foot, up to 0.7 along the stalk, 0.75 to 1 up the cup
function meshTulip(lo) {
  const m = new Mesh(), S = lo ? 2 : LV > 1 ? 6 : 10, pts = [];
  for (let k = 0; k <= S; k++) { const t = k / S; pts.push([0.16 * sin(t * PI) * (1 - 0.35 * t), 3 * t, 0.07 * sin(t * TAU)]); }
  if (!lo) m.tube([[0, -0.06, 0], [0, 0.01, 0], [0, 0.05, 0], [0, 0.1, 0]], (k) => [0.17, 0.15, 0.09, 0.05][k], 10, false, () => 0);
  m.tube(pts, (k) => 0.052 - 0.014 * k / S, lo ? 3 : 5, false, (k) => 0.7 * k / S);
  // the cup, an egg with its blunt end down: how far up it (0 to 1), and how wide it is there
  const cup = [], R = lo ? 4 : LV > 1 ? 6 : 13;
  for (let k = 0; k <= R; k++) { const s = k / R; cup.push([s, 0.04 + 0.25 * pow(sin(PI * pow(s, 0.72)), 0.8)]); }
  // six parts side by side, like the segments of an orange (too fine to see from far away)
  const N = lo ? 6 : LV > 1 ? 12 : 24, rings = cup.map(([s, r]) => { const ring = []; for (let j = 0; j < N; j++) { const a = j / N * TAU, rl = r * (lo ? 1 : 1 + 0.09 * cos(6 * a) * sin(PI * s)); ring.push(m.v(cos(a) * rl, 3 + s, sin(a) * rl, 0.75 + 0.25 * s)); } return ring; });
  for (let k = 0; k < rings.length - 1; k++) for (let j = 0; j < N; j++) { const j2 = (j + 1) % N; m.quad(rings[k][j], rings[k][j2], rings[k + 1][j2], rings[k + 1][j]); }
  const tip = m.v(0, 4.02, 0, 1), last = rings[rings.length - 1];
  for (let j = 0; j < N; j++) m.tri(last[j], last[(j + 1) % N], tip);
  return m;
}

// The sponge Vauxia gracilenta: a little bush of branching tubes, 1.6 units high (its height is not known from a
// source: see zoo.js). Each tube is open at its tip. The bush is laid out first, branch by branch, and then given
// its skin, so that the simpler mesh is the same bush.
// aux: how light a place is, from the dark foot up to the rims, and near 0 down the throats
function meshVauxia(sd, lo) {
  rseed(300 + sd);
  const nrm = (v) => { const l = hypot(...v) || 1; return v.map((c) => c / l); }, twigs = [];
  // one twig: three steps of a slightly crooked line, then it forks or ends
  const grow = (p, d, r, len, depth) => {
    const pts = [p]; let q = p;
    for (let i = 0; i < 3; i++) { d = nrm([d[0] + rr(-0.32, 0.32), d[1] + rr(0, 0.3), d[2] + rr(-0.32, 0.32)]); q = [q[0] + d[0] * len / 3, q[1] + d[1] * len / 3, q[2] + d[2] * len / 3]; pts.push(q); }
    twigs.push({ pts, d, r, depth });
    if (depth) for (let i = 2 + (rnd() < 0.3); i > 0; i--) grow(q, nrm([d[0] + rr(-0.75, 0.75), d[1] + rr(0.1, 0.5), d[2] + rr(-0.75, 0.75)]), r * 0.86, len * rr(0.75, 0.95), depth - 1);
  };
  for (let i = 2 + (rnd() < 0.6); i > 0; i--) grow([rr(-0.07, 0.07), -0.04, rr(-0.07, 0.07)], nrm([rr(-0.55, 0.55), 1, rr(-0.55, 0.55)]), 0.085, 0.62, 2);
  // as high as the animal is
  let top = 0; for (const t of twigs) for (const p of t.pts) top = max(top, p[1]);
  const m = new Mesh(), sides = lo ? 4 : LV > 1 ? 5 : 7, k = 1.6 / top;
  for (const t of twigs) {
    const pts = (lo ? [t.pts[0], t.pts[3]] : t.pts).map((p) => [p[0] * k, p[1] * k, p[2] * k]), n = pts.length - 1, tip = !t.depth;
    m.tube(pts, (j) => t.r * (1 - 0.26 * j / n) * (tip && j === n ? 1.25 : 1) * (lo ? 1.15 : 1), sides, false, (j) => clamp(0.3 + 0.7 * (pts[j][1] / 1.6), 0, 1));
    // an open tip: inside the rim it is dark at once, and darker down the throat
    if (tip) {
      const e = pts[n], v = m.p.length / 3 - sides, in_ = [];
      for (let s = 0; s < sides; s++) in_.push(m.v(mix(e[0], m.p[(v + s) * 3], 0.82), mix(e[1], m.p[(v + s) * 3 + 1], 0.82), mix(e[2], m.p[(v + s) * 3 + 2], 0.82), 0.1));
      const c = m.v(e[0] - t.d[0] * t.r * 1.8, e[1] - t.d[1] * t.r * 1.8, e[2] - t.d[2] * t.r * 1.8, 0.02);
      for (let s = 0; s < sides; s++) { const s2 = (s + 1) % sides; m.quad(v + s, v + s2, in_[s2], in_[s]); m.tri(in_[s], in_[s2], c); }
    }
  }
  return m;
}
