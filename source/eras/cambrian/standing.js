// ============================================================================
// cambrian: what stands still (meshes)
// ============================================================================
// Shapes follow the fossils as far as the sources in zoo.js describe them. Each is modelled around its foot at the
// origin, y up, at 20 times its real size, the size this world was first built at (world.js makes them true size,
// TS): one unit is 5 cm. aux, the fourth number of a vertex, tells the material in look.js what part of the animal
// a place is. lo: the simpler mesh for far away. It has to be the same shape with fewer triangles, or the animal
// would change as the player comes closer. The engine takes the near mesh for every animal of a culling cell (24 m)
// at once, so a whole garden is drawn with it: that is what its triangles are counted against.

// The tulip animal, Siphusauctum gregarium, as a body in the round. Figures from O'Brien and Caron, PLOS ONE 2012
// (https://pmc.ncbi.nlm.nih.gov/articles/PMC3261148/, table 2 and the description):
// - Up to 223 mm long. The cup (calyx) 9 to 76 mm long and 7 to 50 mm wide, on average 1.2 times as long as wide
//   (0.7 to 1.9). The stalk one to three times as long as the cup, 1.4 to 11 mm thick (about a sixth of the cup's
//   width) and as thick all the way. The holdfast a flat disc or a bulb, rarely wider than the stalk.
// - The cup is round in cross-section. Its lower quarter is a stiff cone. It is widest at mid-height and narrows to
//   the top. A thin sheath lies round six comb-like parts that run up the cup side by side. Six small openings
//   pierce the sheath at its base, between the parts. At the top the gut ends in the anus, in the middle; where the
//   cup is spread, the tips of the six parts stand round it like a crown.
// - The stalk has two layers. The outer one ends at the top of the holdfast.
// Estimates, where the pressed fossils say nothing: how deep the grooves between the six parts are, how far the
// tips stand apart, how deep the hollow between them is, and the size of the openings (the paper gives none).
// The animals of one cluster are of similar size, and the sheath could widen and narrow: so there are three of
// them, the largest 20 cm (the size of the card), that differ in height and in how far the cup is spread. Each:
// height, length of the cup, its largest radius, how far it is spread (0 to 1), and the bow of the stalk (how far
// out along x and where along the stalk, how far out along z and in how many half waves). The cups stay narrower
// than the paper's average: the animals stand 4.5 cm apart (world.js), and wider cups would run into each other.
const TULIP_V = [[4, 1.12, 0.3, 0.1, 0.16, 1, 0.07, 2], [3.66, 1.04, 0.325, 0.55, -0.1, 1.5, 0.15, 1], [3.3, 0.97, 0.35, 1, 0.12, 0.7, -0.09, 2]];
// v: which of the three. The stalk leans out and comes back, so that the cup stands over the foot: the material
// finds the six parts of the cup round that axis.
// aux: 0 at the holdfast, up to 0.7 along the stalk, 0.75 to 0.9 up the outside of the cup, and from there on down
// its inside, to 1 at the end of the gut. The lip of an opening has 0.895 (pale, as the rim), its inside more
function meshTulip(v, lo) {
  const m = new Mesh(), [H, L, R, open, bx, bp, bz, bk] = TULIP_V[v], y0 = H - L, yT = H, S = lo ? 2 : 9, pts = [];
  // a ring of n points round the axis, a band of faces from one ring to the next (its outer side: to the right of
  // the way from A to B, seen along the ring), and one from a ring to a ring of half as many points
  const ring = (n, rad, y, aux) => Array.from({ length: n }, (_, j) => { const a = j / n * TAU, r = rad(j); return m.v(cos(a) * r, y(j), sin(a) * r, aux); });
  const band = (A, B, skip) => { for (let j = 0, n = A.length; j < n; j++) if (!skip || !skip(j)) m.quad(A[j], B[j], B[(j + 1) % n], A[(j + 1) % n]); };
  const half = (A, B) => { for (let i = 0, n = B.length; i < n; i++) { const b = A[2 * i + 1], d = B[i], e = B[(i + 1) % n]; m.tri(A[2 * i], d, b); m.tri(b, d, e); m.tri(b, e, A[(2 * i + 2) % A.length]); } };
  // the holdfast: a wider disc sunk into the mud (the ground is at 0.04: world.js sinks the animal that far),
  // 8 sides with an uneven rim for a natural grip on the mud
  if (!lo) { const F = [[-0.12, 0.04, 0], [-0.05, 0.072, 0], [0.03, 0.078, 0.01], [0.08, 0.065, 0.03], [0.115, 0.044, 0.04]].map(([y, r, a]) => ring(8, (j) => r * (1 + 0.12 * sin(j * 2.3 + v)), () => y, a)); for (let k = 0; k < 4; k++) band(F[k], F[k + 1]); }
  // the stalk: its outer layer ends on the holdfast in a small collar, 8 sides for a rounder section. It reaches
  // into the cone of the cup
  for (let k = 0; k <= S; k++) { const t = k / S; pts.push([bx * sin(PI * pow(t, bp)) * (1 - 0.35 * t), 0.08 + (y0 - 0.04) * t, bz * sin(bk * PI * t)]); }
  m.tube(pts, (k) => (k ? 0.048 - 0.004 * k / S : 0.062) * (lo ? 1.1 : 1), lo ? 3 : 8, false, (k) => 0.06 + 0.64 * k / S);
  // The cup. s: how far up it (0 to 1). cs: where its cone ends. rad: how wide it is on the middle line of a part.
  // gro: how deep the grooves between the parts are, as a share of the radius: none on the cone, deeper towards
  // the top where the parts come apart. bulge: how far the middle of each segment stands proud of the base radius,
  // so the cup reads as six lobes from every angle. rt: how wide the crown of tips is, notch: how far down the gaps
  // between the tips reach
  const N = lo ? 6 : 24, cs = 0.22, rt = 0.42 + 0.36 * open, notch = 0.08 + 0.17 * open;
  const rad = (s) => { const u = (s - cs) / (1 - cs); return s <= cs ? mix(0.055, 0.56 * R, s / cs) : R * (u < 0.36 ? mix(0.56, 1, sin(PI / 2 * u / 0.36)) : mix(1, rt, pow((u - 0.36) / 0.64, 1.5 + 0.5 * open))); };
  const gro = (s) => { const u = (s - cs) / (1 - cs); return s <= cs ? 0 : 0.05 + 0.14 * sstep(0, 0.35, u) + (0.18 + 0.14 * open) * u * u; };
  const bulge = (s) => { const u = (s - cs) / (1 - cs); return s <= cs ? 0 : (0.04 + 0.06 * open) * sstep(0.05, 0.4, u); };
  // how far a column of points is from the middle line of its part (0) towards the groove (1). Four columns to a
  // part: middle, flank, groove, flank. The simple mesh has one, and takes a width between the two
  const off = (j) => lo ? 0.4 : pow([0, 0.5, 1, 0.5][j % 4], 1.6);
  const cupRing = (s, k = 1) => ring(N, (j) => { const o = off(j); return rad(s) * k * (1 + bulge(s) * (1 - o) - gro(s) * o); }, (j) => y0 + L * s - notch * off(j) * sstep(0.6, 1, s), 0.75 + 0.15 * s);
  const rings = (lo ? [0, 0.22, 0.5, 0.82] : [0, 0.11, 0.22, 0.27, 0.32, 0.37, 0.44, 0.53, 0.62, 0.71, 0.80, 0.87, 0.93, 0.97]).map((s) => cupRing(s));
  // (the faces round the six openings are left out: rings 3 to 4, the two columns to either side of a groove)
  for (let k = 0; k < rings.length - 1; k++) band(rings[k], rings[k + 1], !lo && (k === 3 || k === 4) ? (j) => j % 4 === 1 || j % 4 === 2 : null);
  // the tips of the parts, rounded over to the inside
  const apex = cupRing(1, 0.84), deep = L * (0.18 + 0.28 * open);
  band(rings[rings.length - 1], apex);
  if (lo) { const c = m.v(0, yT - 0.45 * deep, 0, 0.96); for (let j = 0; j < N; j++) m.tri(apex[j], c, apex[(j + 1) % N]); return m; }
  // The six openings at the base of the sheath, one in each groove just above the cone: real holes with a wider
  // lip and a wall. The eight points round the middle one of a three-by-three patch are drawn together to an oval
  // and lifted a little (the lip); the middle one goes inside and is the dark back of the hole
  for (let j0 = 2; j0 < N; j0 += 4) {
    const c = rings[4][j0], a = j0 / N * TAU, ax = cos(a), az = sin(a), C = [m.p[c * 3], m.p[c * 3 + 1], m.p[c * 3 + 2]];
    const lip = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]].map(([dj, dk]) => rings[4 + dk][j0 + dj]);
    const wall = lip.map((b, i) => {
      // (the points above and below the middle move less: the opening is higher than wide)
      const o = b * 3, sh = i === 3 || i === 7 ? 0.22 : 0.55;
      for (let q = 0; q < 3; q++) m.p[o + q] = mix(m.p[o + q], C[q], sh);
      m.p[o] += ax * 0.015; m.p[o + 2] += az * 0.015; m.aux[b] = 0.895;
      return m.v(mix(m.p[o], C[0], 0.3) - ax * 0.06, mix(m.p[o + 1], C[1], 0.3), mix(m.p[o + 2], C[2], 0.3) - az * 0.06, 0.96);
    });
    m.p[c * 3] -= ax * 0.12; m.p[c * 3 + 2] -= az * 0.12; m.aux[c] = 0.97;
    for (let i = 0; i < 8; i++) { const i2 = (i + 1) % 8; m.quad(lip[i], lip[i2], wall[i2], wall[i]); m.tri(wall[i], wall[i2], c); }
  }
  // The hollow between the tips: one looks into the cup from above. Its wall is the inner side of the six parts
  // (thick on their middle lines, thin in the gaps between two tips), so it has six corners, in the grooves
  const ri = 0.56 * R * rt, rg = 0.84 * R * rt * (1 - gro(1)) - 0.02, rf = min(0.07, ri * 0.6);
  const rim = ring(N, (j) => mix(ri, rg, off(j)), (j) => yT - notch * off(j) - 0.045, 0.915);
  band(apex, rim);
  const f1 = ring(12, (j) => mix(ri, rf, 0.5) * (j % 2 ? 1.12 : 0.88), () => yT - notch - 0.045 - 0.4 * (deep - notch - 0.045), 0.95), f2 = ring(12, () => rf, () => yT - deep, 0.97);
  half(rim, f1); band(f1, f2);
  // In the middle of it the gut comes up and ends in the anus, below the tips: a small cone with a dimple
  const t6 = ring(6, () => 0.028, () => yT - notch - 0.07, 0.99), an = m.v(0, yT - notch - 0.105, 0, 1);
  half(f2, t6);
  for (let j = 0; j < 6; j++) m.tri(t6[j], an, t6[(j + 1) % 6]);
  return m;
}

// The sponge Vauxia gracilenta: a little bush of branching tubes, 1.6 units high (Royal Ontario Museum, Burgess
// Shale fossil gallery, https://burgess-shale.rom.on.ca/fossils/vauxia-gracilenta/: up to 8 cm, from single tubes
// to branching forms, each branch "deeply conical and almost cylindrical" round a simple hollow that ends in an
// opening at its tip; a skeleton of fibres in two layers, the inner one a net with meshes of four to six sides,
// the outer one thin, with small pores). How thick the branches are is an estimate: the page gives no figure.
// The bush is laid out first, branch by branch, and then given its skin, so that the simpler mesh is the same
// bush. The layout draws the same random numbers as it always did: the three bushes keep their growth.
// aux: how light a place is, from the dark foot (0.3) up to the rims (1), and below 0.3 down the throats
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
  // (the stems rise from one foot, close together, so that the bush reads as one animal and not as loose tubes)
  for (let i = 2 + (rnd() < 0.6); i > 0; i--) grow([rr(-0.025, 0.025), -0.04, rr(-0.025, 0.025)], nrm([rr(-0.4, 0.4), 1, rr(-0.4, 0.4)]), 0.085, 0.62, 2);
  // as high as the animal is
  let top = 0; for (const t of twigs) for (const p of t.pts) top = max(top, p[1]);
  const m = new Mesh(), k = 1.6 / top;
  // The foot: a wider lumpy crust that the stems rise from, 8 sides with more wobble. world.js sets the bush into
  // the rock a little and leans it upwards, so on a steep face the rock cuts through the crust at a slant: wide
  // and deep enough, it sits on the rock all round. (What differs from here on comes from a hash, not from the
  // random stream of the layout)
  {
    const n = lo ? 4 : 8, F = [[-0.16, 0.13, 0.3], [-0.06, 0.22, 0.3], [0.02, 0.19, 0.33], [0.08, 0.1, 0.36]].map(([y, r, a], q) => { const ring = []; for (let s = 0; s < n; s++) { const an = s / n * TAU, rl = r * (0.78 + 0.48 * ihash(s, q, 31 + sd)); ring.push(m.v(cos(an) * rl, y, sin(an) * rl, a)); } return ring; });
    for (let q = 0; q < 3; q++) for (let s = 0; s < n; s++) { const s2 = (s + 1) % n; m.quad(F[q][s], F[q + 1][s], F[q + 1][s2], F[q][s2]); }
    const c = m.v(0, 0.11, 0, 0.36); for (let s = 0; s < n; s++) m.tri(F[3][s], c, F[3][(s + 1) % n]);
  }
  twigs.forEach((t, ti) => {
    const tip = !t.depth, P = (lo ? [t.pts[0], t.pts[3]] : t.pts).map((p) => [p[0] * k, p[1] * k, p[2] * k]), n = P.length - 1, sides = lo ? 4 : tip ? 8 : 7;
    // A tube that ends in an opening is narrow where it buds off and widens to its mouth, each a little differently.
    // One that forks keeps its width, and is closed where its branches leave it. The tips widen more for a natural
    // conical shape (Rigby: "deeply conical and almost cylindrical")
    const cone = [0.62, 0.84 + 0.16 * ihash(ti, sd, 3), 0.94 + 0.16 * ihash(ti, sd, 4), 1.16];
    const rad = (j) => t.r * (lo ? 1.12 : 1) * (tip ? cone[lo ? j * 3 : j] : 1 - 0.14 * j / n);
    m.tube(P, rad, sides, !tip, (j) => clamp(0.3 + 0.7 * (P[j][1] / 1.6), 0.3, 1));
    if (!tip) { const c = m.p.length - 3; for (let q = 0; q < 3; q++) m.p[c + q] += t.d[q] * rad(n) * 0.5; return; }
    // The opening at its tip: a lip that is no clean circle (more wobble now), the top of the wall inside it (the
    // wall has a visible thickness) and the throat, which narrows gradually and goes dark
    const e = P[n], v = m.p.length / 3 - sides, r = rad(n), I = [], D = [];
    for (let s = 0; s < sides; s++) {
      const o = (v + s) * 3, w = lo ? 1 : 1 + 0.25 * (ihash(s, ti, 50 + sd) - 0.5), h = lo ? 0 : 0.4 * r * (ihash(s, ti, 60 + sd) - 0.5);
      for (let q = 0; q < 3; q++) m.p[o + q] = e[q] + (m.p[o + q] - e[q]) * w + t.d[q] * h;
      m.aux[v + s] = 1;
      const at = (f, down, aux) => m.v(mix(e[0], m.p[o], f) - t.d[0] * r * down, mix(e[1], m.p[o + 1], f) - t.d[1] * r * down, mix(e[2], m.p[o + 2], f) - t.d[2] * r * down, aux);
      I.push(at(0.75, lo ? 0 : 0.15, lo ? 0.2 : 0.5)); if (!lo) D.push(at(0.42, 2.6, 0.07));
    }
    const c = m.v(e[0] - t.d[0] * r * (lo ? 1.8 : 3.5), e[1] - t.d[1] * r * (lo ? 1.8 : 3.5), e[2] - t.d[2] * r * (lo ? 1.8 : 3.5), 0.02), B = lo ? I : D;
    for (let s = 0; s < sides; s++) { const s2 = (s + 1) % sides; m.quad(v + s, v + s2, I[s2], I[s]); if (!lo) m.quad(I[s], I[s2], D[s2], D[s]); m.tri(B[s], B[s2], c); }
  });
  return m;
}
