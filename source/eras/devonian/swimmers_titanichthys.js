// ============================================================================
// devonian: Titanichthys
// ============================================================================
// A giant filter-feeding arthrodire, about 4 m. Its mesh, its shaders and, for the zoo, where it is at a time.
// world.js lists it as a kind and gives it its instances. What it shares with the other animals of this era is in
// swimmers.js.
//
// aux (what a vertex is; the shaders read it):
//    0     skin of the body in ONE piece. Armour or naked skin is decided per pixel from the place on the body
//    0.25  skin of the lower jaw: drops with the jaw
//    0.5   fins and the lateral keels
//   -0.25  inside of the mouth and of the filter basket, upper half (moves with the head)
//   -0.40  inside of the mouth and of the filter basket, lower half (moves with the jaw)
//   -0.70  the rods of the lower jaw, IG (move with the jaw)
//   -1     eyes

// ============================================================================
// Reference geometry for Titanichthys, first version (brief: docs/briefs/titanichthys-build.md)
// ============================================================================
// Not loaded by the build. Take meshTitanichthys() over into source/eras/devonian/swimmers_titanichthys.js.
// It needs Mesh (engine/math.js) and curve() (devonian/swimmers.js), nothing else. Built on the same frame as the
// Dunkleosteus (one skin, a mouth cut into it, a throat, fins as wings); all numbers are its own.
// The mesh is one unit long, nose at +z, y up. s is the distance from the snout in body lengths: z = 0.5 - s.
//
// Sources: BR2017 (Boyle and Ryan 2017, head and trunk armour of Titanichthys), C2020 (Coatham and others 2020, the
// lower jaw and how it fed), J2022 (Jobbins and others 2022, Amazichthys trinajsticae: the nearest arthrodire with a
// whole body outline, used for everything behind the armour), E2023 (length about 4.1 m). See the brief.
//
// aux (what a vertex is; the shaders read it):
//    0     skin of the body in ONE piece. Armour or naked skin is decided per pixel from the place on the body
//    0.25  skin of the lower jaw: drops with the jaw
//    0.5   fins and the lateral keels
//   -0.25  inside of the mouth and of the filter basket, upper half (moves with the head)
//   -0.40  inside of the mouth and of the filter basket, lower half (moves with the jaw)
//   -0.70  the rods of the lower jaw, IG (move with the jaw)
//   -1     eyes
function meshTitanichthys() {
  const m = new Mesh();
  const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const peak = (u) => max(1 - abs(u), 0);
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => { const l = hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const pos = (i) => [m.p[i * 3], m.p[i * 3 + 1], m.p[i * 3 + 2]];
  // a band of faces between two rows of vertices
  const band = (A, B, flip) => { for (let k = 0; k < A.length - 1; k++) flip ? m.quad(A[k], B[k], B[k + 1], A[k + 1]) : m.quad(A[k], A[k + 1], B[k + 1], B[k]); };

  // ---------------------------------------------------------------- the body: stations from snout to tail stalk
  // [s, back (y of the top), belly (y of the bottom), half width, roundness, height of the widest place]
  // Head: BR2017 gives the head shield about twice as wide as long (length / width 0.50 to 0.54; one 1116 mm wide), low and
  // only slightly arched, about 0.6 m long. At a length of about 4.1 m (E2023) that is 0.15 long and 0.27 wide: a broad,
  // flat head with a blunt, wide snout. Behind the armour the body of Amazichthys (J2022): deepest about 0.29 of the length
  // there, 0.25 here (estimate: Titanichthys is broad, not deep), no narrow tail stalk. Widths and the outline between the
  // numbers: estimates. The mouth is drawn shut here; the shaders open it
  const ST = [
    [0.000, 0.000, -0.026, 0.030, 2.4, 0.55],
    [0.010, 0.016, -0.040, 0.075, 2.6, 0.57],
    [0.025, 0.026, -0.052, 0.100, 2.8, 0.58],
    [0.050, 0.038, -0.064, 0.118, 3.0, 0.58],
    [0.080, 0.048, -0.076, 0.128, 3.0, 0.57],
    [0.115, 0.056, -0.090, 0.134, 2.9, 0.56],
    [0.150, 0.062, -0.102, 0.136, 2.8, 0.54],
    [0.175, 0.074, -0.114, 0.136, 2.6, 0.52],
    [0.210, 0.090, -0.124, 0.134, 2.4, 0.50],
    [0.250, 0.104, -0.130, 0.131, 2.3, 0.48],
    [0.290, 0.114, -0.132, 0.127, 2.2, 0.47],
    [0.330, 0.118, -0.128, 0.121, 2.2, 0.47],
    [0.380, 0.114, -0.120, 0.112, 2.1, 0.48],
    [0.440, 0.104, -0.106, 0.100, 2.0, 0.49],
    [0.500, 0.092, -0.090, 0.088, 2.0, 0.50],
    [0.560, 0.080, -0.072, 0.075, 2.0, 0.50],
    [0.620, 0.068, -0.054, 0.062, 2.0, 0.50],
    [0.680, 0.058, -0.038, 0.050, 2.0, 0.50],
    [0.740, 0.050, -0.024, 0.038, 2.0, 0.50],
    [0.790, 0.046, -0.014, 0.028, 2.0, 0.50],
    [0.830, 0.044, 0.002, 0.020, 2.0, 0.50],
    [0.860, 0.041, 0.024, 0.011, 2.0, 0.50],
    [0.875, 0.038, 0.034, 0.004, 2.0, 0.50],
  ];
  // the five numbers of a station at any s, rounded off between the stations
  const at = (s) => {
    let i = 0; while (i < ST.length - 2 && ST[i + 1][0] <= s) i++;
    const a = ST[max(i - 1, 0)], b = ST[i], c = ST[i + 1], d = ST[min(i + 2, ST.length - 1)], h = c[0] - b[0], u = clamp((s - b[0]) / h, 0, 1), o = [];
    for (let q = 1; q < 6; q++) {
      const m1 = (c[q] - a[q]) / (c[0] - a[0]) * h, m2 = (d[q] - b[q]) / (d[0] - b[0]) * h;
      o.push((2 * u * u * u - 3 * u * u + 1) * b[q] + (u * u * u - 2 * u * u + u) * m1 + (3 * u * u - 2 * u * u * u) * c[q] + (u * u * u - u * u) * m2);
    }
    return o;
  };
  // the corner of the mouth: far back, under the rear of the head (C2020: the lower jaw is 0.61 to 0.68 m, more than 1 m
  // in large ones; here 0.15 of the length, about 0.6 m at 4.1 m)
  const S_C = 0.125;
  const mouthY = (s) => -0.012 - 0.040 * pow(clamp(s / S_C, 0, 1), 1.1);    // the line of the closed mouth, from the side
  const cleftS = (y) => 0.152 - 0.45 * max(-0.01 - y, 0);                     // the cleft between head and trunk armour
  // where the plates of the armour are: the same map as `armP` in the shader. Head shield without lip and snout tip;
  // trunk armour to its rear rim (the median dorsal plate ends at 0.30: BR2017, 518 to 544 mm); the plates of the belly
  const armour = (s, y) => {
    const [T, B] = at(s), v = clamp((y - B) / (T - B), 0, 1), g = cleftS(y), my = mouthY(s) - 0.9 * max(s - S_C, 0);
    const rimS = max(0.25 + 0.45 * y, 0.17), vent = sm(0.13, 0.15, s) * (1 - sm(0.34, 0.37, s)) * (1 - sm(0.07, 0.11, v));
    const head = sm(0.003, 0.008, g - s) * sm(0.006, 0.014, y - my) * sm(0.006, 0.014, s);
    const trunk = sm(0.003, 0.008, s - g) * max(sm(0, 0.005, rimS - s), vent);
    return min(head + trunk, 1);
  };
  // a point on the skin: s along the body, a around it (0 the right flank, PI / 2 the back)
  const skin = (s, a) => {
    const [T, B, W, n, q] = at(s), ym = B + (T - B) * q, c = cos(a), sn = sin(a);
    let x = W * (c < 0 ? -1 : 1) * pow(abs(c), 2 / n), y = sn >= 0 ? ym + (T - ym) * pow(sn, 2 / n) : ym - (ym - B) * pow(-sn, 2 / n);
    // the plates stand out of the skin a little: they are thin (BR2017: 1 to 10 mm)
    const th = 0.0025 * armour(s, y), r = hypot(x, y - ym) || 1; x += x / r * th; y += (y - ym) / r * th;
    const k = 1 - 0.040 * exp(-pow((s - cleftS(y)) / 0.007, 2));             // the cleft is a groove in the one skin
    // the lateral keels (J2022): a thickening of the flank from just behind the pelvic fins to the base of the tail fin,
    // 0.24 long and up to 0.054 high in Amazichthys. Part of the one skin, a soft ridge along the middle of each side
    // (until 2026-11-19 a separate plate, which stood off the flank with a gap and shone as a fin)
    x += (x < 0 ? -1 : 1) * 0.012 * sm(0.54, 0.62, s) * (1 - sm(0.82, 0.875, s)) * exp(-pow((y - (T + B) / 2) / 0.013, 2));
    return [x * k, ym + (y - ym) * k, 0.5 - s];
  };
  // the angle at which the right flank is at height y
  const angY = (s, y) => { let lo = -PI / 2, hi = PI / 2; for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; skin(s, mid)[1] < y ? lo = mid : hi = mid; } return (lo + hi) / 2; };
  // the right flank at s and height y, moved in by `inset`
  const flank = (s, y, inset = 0) => { const p = skin(s, angY(s, y)); return [p[0] - inset, p[1], p[2]]; };
  // which way is out, level, at the skin (right flank)
  const outAt = (s, a) => {
    const e = 1e-3, n = crs(sub(skin(s, a + e), skin(s, a - e)), sub(skin(s + e, a), skin(max(s - e, 0), a)));
    const o = nrm([n[0], 0, n[2]]); return o[0] < 0 ? [-o[0], 0, -o[2]] : o;
  };

  // rings: every 0.004 as far as the armour goes (0.40), every 0.01 behind it. Each ring is an upper arc and a lower arc;
  // as far as the mouth goes they have ends of their own, so that the mouth can open
  const MU = 38, ML = 28, MP = 14, RS = [], rings = [];
  for (let k = 1; k <= 100; k++) RS.push(k * 0.004);
  for (let k = 1; k <= 46; k++) RS.push(0.40 + k * 0.01);
  RS.push(0.868);
  const aC = angY(S_C, mouthY(S_C));
  // the lower jaw: narrower in front, its tip bent down (BR2017 and C2020: the tip of the lower jaw turns down and inward)
  const jw = (s) => 1 - 0.22 * (1 - sm(0.004, 0.070, s)), jdrop = (s) => -0.008 * (1 - sm(0, 0.030, s));
  for (const s of RS) {
    const split = s < S_C, a0 = split ? angY(s, mouthY(s)) : aC, U = [], L = [], R = { s, split, a0, U, L };
    for (let k = 0; k <= MU; k++) U.push(m.v(...skin(s, a0 + (PI - 2 * a0) * k / MU), 0));
    for (let k = 0; k <= ML; k++) {
      if (!split && (k === 0 || k === ML)) { L.push(k ? U[0] : U[MU]); continue; }
      const q = skin(s, PI - a0 + (PI + 2 * a0) * k / ML);
      L.push(m.v(q[0] * jw(s), q[1] + jdrop(s), q[2], s < 0.160 ? 0.25 : 0));
    }
    if (split) {                                                             // the roof and the floor of the mouth
      const [xr, ym] = pos(U[0]), xl = pos(L[ML])[0], [T, B] = at(s); R.pal = []; R.flo = [];
      for (let k = 0; k <= MP; k++) { const th = PI * k / MP; R.pal.push(m.v(xr * cos(th), ym + 0.40 * (T - ym) * pow(sin(th), 0.7), 0.5 - s, -0.25)); }
      for (let k = 0; k <= MP; k++) { const th = PI * k / MP; R.flo.push(m.v(-xl * cos(th), ym + jdrop(s) - 0.35 * (ym - B) * pow(sin(th), 0.7), 0.5 - s, -0.40)); }
    }
    rings.push(R);
  }
  // the cheeks: on each side a strip of skin between the lips from 0.07 to the corner, coloured as the inside of the mouth.
  // Open, it stretches. The front of the mouth stays open: a wide scoop
  for (const right of [true, false]) {
    const A = [], B = [];
    for (const R of rings) {
      if (!R.split || R.s < 0.070) continue;
      const pu = pos(right ? R.U[0] : R.U[MU]), pl = pos(right ? R.L[ML] : R.L[0]), w = right ? -0.003 : 0.003;
      A.push(m.v(pu[0] + w, pu[1] - 0.0004, pu[2], -0.25)); B.push(m.v(pl[0] + w, pl[1] - 0.0016, pl[2], -0.40));
    }
    band(A, B, right);
  }
  let js = 0;
  for (let j = 0; j < rings.length - 1; j++) {
    const A = rings[j], B = rings[j + 1];
    band(A.U, B.U, true); band(A.L, B.L, true);
    if (B.split) { band(A.pal, B.pal, false); band(A.flo, B.flo, false); js = j + 1; }
  }
  {
    const A = rings[0], y0 = mouthY(0), pu = m.v(0, y0 + 0.004, 0.5, 0), pl = m.v(0, y0 - 0.004 + jdrop(0), 0.4995, 0.25), pp = m.v(0, y0 + 0.003, 0.499, -0.25), pf = m.v(0, y0 - 0.003 + jdrop(0), 0.499, -0.40);
    for (let k = 0; k < MU; k++) m.tri(pu, A.U[k], A.U[k + 1]);
    for (let k = 0; k < ML; k++) m.tri(pl, A.L[k], A.L[k + 1]);
    for (let k = 0; k < MP; k++) { m.tri(pp, A.pal[k + 1], A.pal[k]); m.tri(pf, A.flo[k + 1], A.flo[k]); }
    // the filter basket: a wide throat from the corner of the mouth back to the gills at the cleft (s = 0.20), with five
    // gill arches. On them the shader draws rakers, a comb that holds back the plankton. Nothing of the gills of
    // Titanichthys is preserved: five arches with rakers, as in a basking shark, are an estimate
    const C = rings[js], D = rings[js + 1];
    {
      const xr = pos(C.pal[0])[0], ymc = pos(C.pal[0])[1], hu = pos(C.pal[MP / 2])[1] - ymc, hl = ymc - pos(C.flo[MP / 2])[1], sC = C.s, N = 20, S1 = 0.200;
      const GA = [0.138, 0.150, 0.162, 0.174, 0.186];
      const arch = (s) => 1 - 0.16 * GA.reduce((a, g) => a + exp(-pow((s - g) / 0.0030, 2)), 0);
      const T = [C.pal.concat(C.flo)];
      for (let k = 1; k <= N; k++) {
        const u = k / N, s = sC + (S1 - sC) * u, yc = ymc + 0.010 * u, w = (xr + (0.060 - xr) * pow(u, 0.8)), a = arch(s);
        const up = (hu + (0.034 - hu) * u), lo = (hl + (0.030 - hl) * u) * a, ring = [];
        for (let j = 0; j <= MP; j++) { const th = PI * j / MP; ring.push(m.v(w * a * cos(th), yc + up * pow(sin(th), 0.8), 0.5 - s, -0.25)); }
        for (let j = 0; j <= MP; j++) { const th = PI * j / MP; ring.push(m.v(-w * a * cos(th), yc - lo * pow(sin(th), 0.8), 0.5 - s, -0.40)); }
        T.push(ring);
      }
      const a0 = pos(T[1][MP / 2]), f0 = crs(sub(pos(T[1][MP / 2 + 1]), a0), sub(pos(T[2][MP / 2]), a0)), fl = f0[1] > 0;
      const n2 = 2 * (MP + 1);
      for (let k = 0; k < N; k++) for (let e = 0; e < n2; e++) {
        const e2 = (e + 1) % n2; fl ? m.quad(T[k][e], T[k + 1][e], T[k + 1][e2], T[k][e2]) : m.quad(T[k][e], T[k][e2], T[k + 1][e2], T[k + 1][e]);
      }
      const E = T[N], ce = m.v(0, ymc + 0.010, 0.5 - S1 - 0.004, -0.25);
      for (let e = 0; e < n2; e++) { const e2 = (e + 1) % n2; fl ? m.tri(E[e], ce, E[e2]) : m.tri(E[e], E[e2], ce); }
    }
    m.tri(C.U[0], C.L[ML], D.U[0]); m.tri(C.L[0], C.U[MU], D.U[MU]);
    const E = rings[rings.length - 1], [T, B] = at(E.s), pe = m.v(0, (T + B) / 2, 0.5 - E.s - 0.004, 0);
    for (let k = 0; k < MU; k++) m.tri(pe, E.U[k + 1], E.U[k]);
    for (let k = 0; k < ML; k++) m.tri(pe, E.L[k + 1], E.L[k]);
  }

  // ---------------------------------------------------------------- the bones of the jaws
  // No blades and no teeth (C2020, BR2017). Below, on each side, the IG: a long slender rod of bone along the rim of the
  // lower jaw, its front end a little wider, like a spatula, bent down and inward. The plates of the upper jaw are left out:
  // they are tiny (16 % of the length of the lower jaw, half a millimetre thick, BR2017) and would not show. Round in
  // section. aux -0.70 moves with the jaw
  const closed = (R) => R.reduce((a, p) => [a[0] + p[0] / R.length, a[1] + p[1] / R.length, a[2] + p[2] / R.length], [0, 0, 0]);
  // faces between rings of the same number of points, the right way round: away from the centre line `mid`; both ends
  // closed with a point
  const tubeFaces = (V, mid) => {
    const a0 = pos(V[0][0]), f0 = crs(sub(pos(V[1][0]), a0), sub(pos(V[0][1]), a0)), fl = dot(f0, sub(a0, mid[0])) < 0;
    for (let k = 0; k < V.length - 1; k++) for (let e = 0; e < V[k].length; e++) {
      const e2 = (e + 1) % V[k].length; fl ? m.quad(V[k][e], V[k][e2], V[k + 1][e2], V[k + 1][e]) : m.quad(V[k][e], V[k + 1][e], V[k + 1][e2], V[k][e2]);
    }
    for (const [k, out] of [[0, -1], [V.length - 1, 1]]) {
      const ring = V[k].map(pos), c = closed(ring), tip = m.v(c[0], c[1], c[2], m.aux[V[k][0]]);
      for (let e = 0; e < ring.length; e++) { const e2 = (e + 1) % ring.length; (out > 0) !== fl ? m.tri(V[k][e], V[k][e2], tip) : m.tri(V[k][e2], V[k][e], tip); }
    }
  };
  const lipAt = (s, up) => {
    const a = angY(s, mouthY(s)), p = skin(s, a);
    return up ? p : [p[0] * jw(s), p[1] + jdrop(s), p[2]];
  };
  const RODS = [
    // up, from, to, radius at s
    [false, 0.016, 0.118, (s) => 0.0034 + 0.0030 * (1 - sm(0.004, 0.030, s))],
  ];
  for (const sx of [1, -1]) for (const [up, s0, s1, rad] of RODS) {
    const V = [], mid = [], aux = up ? -0.55 : -0.70, N = round((s1 - s0) / 0.0015);
    for (let k = 0; k <= N; k++) {
      const s = s0 + (s1 - s0) * k / N, E = lipAt(s, up), o = outAt(s, angY(s, mouthY(s))), f = 0.3 + 0.7 * sm(s0, s0 + 0.004, s) * (1 - sm(s1 - 0.006, s1, s));
      const r = rad(s) * f, flat = up ? 1 : 1 - 0.45 * (1 - sm(0.004, 0.030, s));         // the spatula is flatter
      const c = [E[0] + o[0] * r * 0.4, E[1] + (up ? 1 : -1) * r * 0.2, E[2] + o[2] * r * 0.4], ring = [];
      for (let e = 0; e < 8; e++) {
        const w = e / 8 * TAU, dO = cos(w) * r, dY = sin(w) * r * flat;
        ring.push(m.v(sx * (c[0] + o[0] * dO), c[1] + dY, c[2] + o[2] * dO, aux));
      }
      V.push(ring); mid.push([sx * c[0], c[1], c[2]]);
    }
    tubeFaces(V, mid);
  }

  // ---------------------------------------------------------------- the eyes
  // Small: BR2017 gives a ring of bone about 35 mm across with an opening of 13 mm. At 4.1 m that is 0.0085 and 0.0032.
  // A small dome in a raised ring, on the side of the head under the edge of the roof
  const EYE_S = 0.048, EYE_Y = 0.024;
  for (const sx of [1, -1]) {
    const a = angY(EYE_S, EYE_Y), c = skin(EYE_S, a), e = 1e-3;
    const t1 = nrm(sub(skin(EYE_S + e, a), skin(EYE_S - e, a))), n0 = nrm(crs(sub(skin(EYE_S, a + e), skin(EYE_S, a - e)), t1)), n = n0[0] < 0 ? n0.map((v) => -v) : n0, t2 = crs(n, t1), rows = [];
    for (let k = 1; k <= 4; k++) {
      const la = k / 4 * PI / 2, row = [];
      for (let q = 0; q <= 12; q++) { const b = q / 12 * TAU, r = 0.0032 * sin(la), h = 0.0016 * cos(la) - 0.0004; row.push(m.v(sx * (c[0] + t1[0] * r * cos(b) + t2[0] * r * sin(b) + n[0] * h), c[1] + t1[1] * r * cos(b) + t2[1] * r * sin(b) + n[1] * h, c[2] + t1[2] * r * cos(b) + t2[2] * r * sin(b) + n[2] * h, -1)); }
      rows.push(row);
    }
    const top = m.v(sx * (c[0] + n[0] * 0.0012), c[1] + n[1] * 0.0012, c[2] + n[2] * 0.0012, -1);
    for (let q = 0; q < 12; q++) sx > 0 ? m.tri(top, rows[0][q + 1], rows[0][q]) : m.tri(top, rows[0][q], rows[0][q + 1]);
    for (let k = 0; k < 3; k++) band(rows[k], rows[k + 1], sx > 0);
    const RG = [];
    for (let q = 0; q <= 16; q++) {
      const b = q / 16 * TAU, row = [];
      for (let u = 0; u <= 6; u++) {
        const w = u / 6 * TAU, R0 = 0.0040 + 0.0011 * cos(w), hh = 0.0003 + 0.0011 * sin(w);
        row.push(m.v(sx * (c[0] + (t1[0] * cos(b) + t2[0] * sin(b)) * R0 + n[0] * hh), c[1] + (t1[1] * cos(b) + t2[1] * sin(b)) * R0 + n[1] * hh, c[2] + (t1[2] * cos(b) + t2[2] * sin(b)) * R0 + n[2] * hh, -1));
      }
      RG.push(row);
    }
    const a0 = pos(RG[0][0]), f0 = crs(sub(pos(RG[1][0]), a0), sub(pos(RG[0][1]), a0)), ctr = [sx * (c[0] + t1[0] * 0.0040 + n[0] * 0.0003), c[1] + t1[1] * 0.0040 + n[1] * 0.0003, c[2] + t1[2] * 0.0040 + n[2] * 0.0003];
    const fl = dot(f0, sub(a0, ctr)) < 0;
    for (let q = 0; q < 16; q++) band(RG[q], RG[q + 1], fl);
  }

  // ---------------------------------------------------------------- fins
  // A fin is a wing: its front edge LE and its rear edge TE as points from root to tip, and a section like that of
  // a wing between them (thickest a third behind the front edge, sharp at the rear). th(t) is half its thickness.
  // The root lies inside the body, so that there is no gap
  const wing = (LE, TE, th, aux = 0.5, N = 12) => {
    const le = curve(LE, N), te = curve(TE, N), C = [0, 0.08, 0.3, 0.62, 1], rs = []; let n = null;
    for (let k = 0; k <= N; k++) {
      const a = le[k], c = sub(te[k], a), sp = sub(le[min(k + 1, N)], le[max(k - 1, 0)]); let nn = nrm(crs(c, sp));
      if (hypot(c[0], c[1], c[2]) < 1e-4 || (n && dot(nn, n) < 0.5)) nn = n; n = nn;
      const h = th(k / N), ring = [], P = (q, sg) => { const f = sg * h * 2.598 * sqrt(C[q]) * (1 - C[q]); return m.v(a[0] + c[0] * C[q] + n[0] * f, a[1] + c[1] * C[q] + n[1] * f, a[2] + c[2] * C[q] + n[2] * f, aux); };
      for (let q = 0; q < 5; q++) ring.push(P(q, 1));
      for (let q = 3; q > 0; q--) ring.push(P(q, -1));
      rs.push(ring);
    }
    // which way round: the face next to the upper side must look the way of n
    const q0 = pos(rs[0][2]), fn = crs(sub(pos(rs[0][3]), q0), sub(pos(rs[1][2]), q0)), n1 = nrm(crs(sub(te[0], le[0]), sub(le[1], le[0]))), flip = dot(fn, n1) < 0;
    for (let k = 0; k < N; k++) for (let e = 0; e < 8; e++) { const e2 = (e + 1) % 8; flip ? m.quad(rs[k][e], rs[k + 1][e], rs[k + 1][e2], rs[k][e2]) : m.quad(rs[k][e], rs[k][e2], rs[k + 1][e2], rs[k + 1][e]); }
  };
  const V = (s, x, y) => [x, y, 0.5 - s], mir = (P) => P.map((p) => [-p[0], p[1], p[2]]);
  const top = (s) => at(s)[0], bot = (s) => at(s)[1];
  // pectoral fins, after Amazichthys (J2022): longer than high (0.14 by 0.08 of the length), with a broadly rounded tip.
  // E2024 puts the start of the pectoral fin of Amazichthys at 0.231 of the length. Low on the flank, pointing back,
  // out and 30 degrees down (estimate)
  {
    const X = flank(0.215, -0.080)[0], D = (d) => [X - 0.018 + d * 0.80, -0.080 - d * 0.46];
    const P = (s, d) => { const q = D(d); return V(s, q[0], q[1]); };
    const LE = [P(0.205, 0), P(0.225, 0.040), P(0.255, 0.080), P(0.295, 0.110), P(0.335, 0.124), P(0.360, 0.120)];
    const TE = [P(0.285, 0), P(0.300, 0.030), P(0.320, 0.060), P(0.342, 0.088), P(0.358, 0.108), P(0.362, 0.118)];
    const th = (t) => 0.010 * pow(1 - t, 0.7) + 0.0018;
    wing(LE, TE, th, 0.5, 14); wing(mir(LE), mir(TE), th, 0.5, 14);
  }
  // pelvic fins: small, halfway between the end of the belly armour and the start of the lateral keel (J2022)
  {
    const r0 = flank(0.445, bot(0.445) + 0.020, 0.010), r1 = flank(0.490, bot(0.490) + 0.018, 0.010);
    const LE = [r0, V(0.465, r0[0] + 0.012, bot(0.465) - 0.012), V(0.492, r0[0] + 0.020, bot(0.492) - 0.030)], TE = [r1, V(0.500, r0[0] + 0.014, bot(0.500) - 0.008), V(0.497, r0[0] + 0.020, bot(0.497) - 0.028)];
    const th = (t) => 0.006 * (1 - t) + 0.0012;
    wing(LE, TE, th); wing(mir(LE), mir(TE), th);
  }
  // dorsal fin: one, long and low with a rounded rear edge, beginning near the rear end of the median dorsal plate
  // (J2022: 0.21 long and 0.10 high in Amazichthys). No anal fin (J2022: none apparent)
  // Low: its front edge rises slowly, the highest place near the rear, then the rounded rear edge (0.21 long, 0.075 high)
  wing([V(0.300, 0, top(0.300) - 0.012), V(0.340, 0, top(0.340) + 0.018), V(0.385, 0, top(0.385) + 0.042), V(0.425, 0, top(0.425) + 0.060), V(0.455, 0, top(0.455) + 0.071), V(0.478, 0, top(0.478) + 0.075)],
    [V(0.520, 0, top(0.520) - 0.012), V(0.523, 0, top(0.523) + 0.020), V(0.516, 0, top(0.516) + 0.045), V(0.503, 0, top(0.503) + 0.062), V(0.490, 0, top(0.490) + 0.072), V(0.480, 0, top(0.480) + 0.075)], (t) => 0.010 * pow(1 - t, 0.6) + 0.0015, 0.5, 16);
  // tail fin, after Amazichthys (J2022): heterocercal, unusually high for a placoderm (0.38 of the length in the holotype),
  // the upper lobe longer than the lower one (220 against 160 mm), both with rounded tips. The roots of both lobes run
  // inside the tail stalk, along its back and its belly, and meet at the notch (0.872), where the stalk ends in a point
  // inside the fin: before 2026-11-19 the stalk ended in a cut-off face beside the fin, with a gap above it
  const thT = (t) => 0.011 * pow(1 - t, 0.6) + 0.0018;
  wing([V(0.770, 0, top(0.770) - 0.004), V(0.812, 0, 0.088), V(0.855, 0, 0.122), V(0.900, 0, 0.155), V(0.945, 0, 0.180), V(0.982, 0, 0.196), V(1.000, 0, 0.196)],
    [V(0.872, 0, 0.036), V(0.888, 0, 0.068), V(0.910, 0, 0.102), V(0.934, 0, 0.136), V(0.958, 0, 0.165), V(0.982, 0, 0.186), V(0.999, 0, 0.192)], thT, 0.5, 18);
  wing([V(0.770, 0, bot(0.770) + 0.004), V(0.800, 0, -0.022), V(0.830, 0, -0.058), V(0.860, 0, -0.096), V(0.890, 0, -0.128), V(0.915, 0, -0.150), V(0.932, 0, -0.156)],
    [V(0.872, 0, 0.036), V(0.876, 0, 0.004), V(0.884, 0, -0.036), V(0.896, 0, -0.076), V(0.909, 0, -0.112), V(0.922, 0, -0.142), V(0.933, 0, -0.154)], thT, 0.5, 18);
  return m;
}

// ---------------------------------------------------------------- shaders
const S_TITANICHTHYS = /*wgsl*/`
// ============================================================================
// Reference shaders for Titanichthys, first version (brief: docs/briefs/titanichthys-build.md)
// ============================================================================
// Not loaded by the build. This is the whole text of S_TITANICHTHYS for source/eras/devonian/swimmers_titanichthys.js,
// for the mesh of docs/briefs/ref/titanichthys-mesh.js. Built on the shader of the Dunkleosteus (sixth version): the same
// skin over bone, the same light (titanLight). All functions carry the prefix titan: the shaders of an era share one module.
// It needs what W_ANIM gives every animal and S_SEA (dodge, skinRelief), which comes with the first kind of the era.
// This text has not been compiled: run node tools/wgsl.mjs devonian first.
// s is the distance from the snout in body lengths (s = .5 - z of the rest position), y its height.

// Instance: a.xyz = centre of its path, a.w = radius R of its path. b.x = seed, b.y = cruising speed in m/s (the sign
// is the direction), b.z = length in metres (4.1), b.w = seed2. Path and distance along it are repeated in
// zooTitanichthys: change one, change the other (brief: docs/briefs/devonian-giants-motion.md).

// where it swims: a wide circle with a slower one on top, so the path wanders; it rises and sinks a little. Every
// frequency is a multiple of 0.5, so the path repeats after 4 pi and the angle can be wrapped. a: the angle along it
fn titanPath(c: vec3f, R: f32, a: f32, ph: f32) -> vec3f {
  return c + vec3f(R * cos(a) + .1 * R * cos(1.5 * a + ph), 1.2 * sin(2. * a + ph) + .5 * sin(3.5 * a + 2. * ph),
                   R * sin(a) + .1 * R * sin(1.5 * a + 1.7 * ph));
}

// where head and trunk armour meet, at height y: the gill opening, running forwards below the cheek
fn titanCleft(y: f32) -> f32 { return .152 - .45 * max(0. - .01 - y, 0.); }
// the line of the shut mouth, and behind its corner (s = .125) the line to the hinge of the jaw
fn titanMouthY(s: f32) -> f32 { return 0. - .012 - .040 * pow(sat(s / .125), 1.1) - .9 * max(s - .125, 0.); }
// back (x) and belly (y) of the body at s, every 0.05 from the snout: read off the mesh
fn titanTB(s: f32) -> vec2f {
  var T = array<f32, 18>(.014, .043, .056, .060, .090, .107, .117, .117, .112, .102, .092, .082, .072, .063, .055, .049, .045, .042);
  var B = array<f32, 18>(-.044, -.067, -.086, -.105, -.125, -.133, -.134, -.128, -.117, -.103, -.090, -.075, -.060, -.046, -.033, -.022, -.011, .016);
  let f = clamp(s * 20., 0., 16.999); let k = i32(f); let u = f - f32(k);
  return vec2f(mix(T[k], T[k + 1], u), mix(B[k], B[k + 1], u));
}
fn titanSeg(p: vec2f, a: vec2f, b: vec2f) -> f32 { let pa = p - a; let ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
// a line of half width w at distance d. Where a pixel is wider than the line, the line gets wider and fainter instead of flickering
fn titanLine(d: f32, w: f32, fw: f32) -> f32 { let ww = max(w, 1.2 * fw); let q = d / ww; return exp(0. - q * q) * (w / ww); }
// is a detail of size p still larger than a pixel?
fn titanNear(p: f32, fw: f32) -> f32 { return 1. - ss(.2 * p, .5 * p, fw); }
// how far a point of the armour is from the nearest edge of a plate. p2: (s, y) on the flank, pt: (s, |x|) on the roof.
// Schematic: the head shield of BR2017 (Fig. 1 to 3) in a few lines, the median dorsal plate to 0.30
fn titanEdge(p2: vec2f, pt: vec2f, gc: f32, rimS: f32, my: f32, roof: f32, vent: f32) -> f32 {
  var dH = titanSeg(p2, vec2f(.030, .005), vec2f(.100, .010));                // the head: the frame of the cheek plate
  dH = min(dH, titanSeg(p2, vec2f(.100, .010), vec2f(.128, -.030)));
  dH = min(dH, titanSeg(p2, vec2f(.030, .005), vec2f(.040, -.030)));
  dH = min(dH, titanSeg(p2, vec2f(.056, .030), vec2f(.090, .046)));            // behind the eye
  dH = min(dH, titanSeg(p2, vec2f(.100, .010), vec2f(.120, .050)));
  var dT = titanSeg(p2, vec2f(.152, .050), vec2f(.250, .062));                 // the trunk
  dT = min(dT, titanSeg(p2, vec2f(.250, .062), vec2f(.300, .088)));
  dT = min(dT, titanSeg(p2, vec2f(.240, .040), vec2f(.215, -.020)));
  dT = min(dT, titanSeg(p2, vec2f(.215, -.020), vec2f(.210, -.060)));
  var dR = titanSeg(pt, vec2f(.020, 0.), vec2f(.150, 0.));                     // the roof
  dR = min(dR, titanSeg(pt, vec2f(.075, 0.), vec2f(.075, .070)));
  dR = min(dR, titanSeg(pt, vec2f(.020, .050), vec2f(.075, .070)));
  dR = min(dR, titanSeg(pt, vec2f(.075, .070), vec2f(.150, .090)));
  dR = min(dR, titanSeg(pt, vec2f(.155, .075), vec2f(.240, .080)));             // the median dorsal plate
  dR = min(dR, titanSeg(pt, vec2f(.240, .080), vec2f(.300, 0.)));
  let s = p2.x; let y = p2.y; let ax = pt.y;
  let dSide = min(dH + 9. * step(gc, s), dT + 9. * step(s, gc));
  var d = min(dSide + .04 * roof, dR + .04 * (1. - roof));
  d = min(d, min(abs(s - .250), ax + .04 * (1. - vent)) + .04 * (1. - vent));   // the plates of the belly
  d = min(d, min(abs(s - gc), abs(s - rimS) + .04 * vent));                     // the cleft and the rear rim
  return d;                                                                     // (no joint along the lip: the edge of the shield is a clean rim)
}
// the nearest and the second nearest point of a field of cells, in cell units. F2 - F1 is 0 on the border of two cells:
// cracks that cut a skin into fields of many corners
fn titanCrackle(p: vec3f) -> vec2f {
  let i = floor(p); let f = fract(p); var d1 = 9.; var d2 = 9.;
  for (var x = -1; x <= 1; x++) { for (var y = -1; y <= 1; y++) { for (var z = -1; z <= 1; z++) {
    let o = vec3f(f32(x), f32(y), f32(z)); let r = o + h33(i + o) - f; let d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
  } } }
  return vec2f(sqrt(d1), sqrt(d2));
}
// The light of the Titanichthys. As skinWet of S_SEA, but: the sun comes through the flecks of the surface (caus, as for
// the Kentuckia); the light from around is darkened in cavities (ao); the sheen is on the surface with its relief, broad
// where the surface is rough (shin low) and weak (spec); a wet sheen on the smooth shape only where wet says so (mouth,
// eye, the jaws)
fn titanLight(alb: vec3f, n: vec3f, ns: vec3f, wp: vec3f, spec: f32, shin: f32, wet: f32, ao: f32, sun: f32) -> vec3f {
  let V = normalize(g.cam.xyz - wp); let z = zone(wp); let L = g.sun.xyz; let H = normalize(V + L);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  let Ec = E * sun * (.45 + .55 * caus(wp, length(g.cam.xyz - wp)));
  let around = amb(wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vol(wp).g, z) * 1.1 + side(wp, n, 1., z) * .8;
  return alb * (Ec * sat(dot(n, L)) * .65 + around * ao)
    + Ec * spec * (shin + 8.) / 40. * pow(sat(dot(n, H)), shin)
    + E * wet * pow(sat(dot(ns, H)), 70.);
}
// a positive angle turns the nose DOWN
fn titanRotY(p: vec3f, pivot: vec3f, angle: f32) -> vec3f {
  let d = p - pivot; let ca = cos(angle); let sa = sin(angle);
  return pivot + vec3f(d.x, d.y * ca - d.z * sa, d.y * sa + d.z * ca);
}
fn titanRotN(nn: vec3f, angle: f32) -> vec3f { let ca = cos(angle); let sa = sin(angle); return vec3f(nn.x, nn.y * ca - nn.z * sa, nn.y * sa + nn.z * ca); }

// where in its cycle feeding run number k of the animal with seed s begins, as a part of the cycle: 0.05 to 0.35,
// scattered (the golden ratio spreads the places; the sine shakes them). Small numbers only, so it gives the same in
// f32 as in the f64 of zooTitanichthys
fn titanRun(k: f32, s: f32) -> f32 { return .05 + .3 * fract(.618034 * k + .37 * sin(2.3 * k + 9. * s) + 3.1 * s); }
// the distance covered under a speed that rises as a smoothstep from 0 to 1 over x = 0 to 1 (the integral of it)
fn titanRamp(x: f32) -> f32 { return select(select(x - .5, x * x * x - .5 * x * x * x * x, x < 1.), 0., x <= 0.); }

@vertex fn vsTitanichthys(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let R = i.a.w; let ph = i.b.w * 17.; let sz = i.b.z;
  let v0 = abs(i.b.y); let L = .9 * R;               // L: metres of path per radian, about
  // ---- how far it has swum. Between its feeding runs it cruises slowly with the mouth nearly shut (b.y, 0.40 to
  // 0.60 m/s); the speed swells and ebbs a little (two slow waves, 15 and 10 %, its own for each animal)
  let f1 = .031 + .02 * fract(s * 7.31); let f2 = .083 + .03 * fract(s * 3.17);
  let q1 = f1 * t + 6.3 * fract(s * 5.13); let q2 = f2 * t + 6.3 * fract(s * 9.71);
  var dist = v0 * (t + .15 / f1 * sin(q1) + .10 / f2 * sin(q2));
  var vr = 1. + .15 * cos(q1) + .10 * cos(q2);       // speed in cruising speeds
  // ---- the feeding run. Its time is cut into cycles of 50 to 70 s, one run in each, at a place in the cycle that
  // changes from cycle to cycle (titanRun): the runs start 35 s to 90 s apart, never on a beat. A run: over 3 s it
  // speeds up by vb (0.5 to 0.8 m/s, so 0.9 to 1.4 m/s) and opens its mouth wide, sieves for 12 to 25 s, shuts its
  // mouth and slows down again over 3.5 s. Mario wanted it faster while it feeds; a basking shark feeds slower than it
  // cruises (Sims 2000), so this is a choice, not a finding. tau: seconds since this run began (below 0: not yet in
  // this cycle). Every run adds the same distance, so the distance needs no sum over the runs before
  let hPer = 50. + 20. * fract(s * 13.7);
  let hc = t / hPer + fract(s * 2.9); let hk = floor(hc);
  let tau = fract(hc) * hPer - hPer * titanRun(hk, s);
  let tf = 12. + 13. * fract(s * 5.9); let vb = .5 + .3 * fract(s * 8.3);
  let te = 3. + tf;                                   // the run ends: the mouth shuts, it slows down
  dist += vb * (hk * (te + .25) + 3. * titanRamp(tau / 3.) - 3.5 * titanRamp((tau - te) / 3.5));
  vr += vb * (ss(0., 3., tau) - ss(te, te + 3.5, tau)) / v0;
  let feed = ss(.5, 2.5, tau) * (1. - ss(te, te + 1., tau));
  let push = ss(0., 1., tau) * (1. - ss(2.5, 4., tau));      // the tail drives harder as it speeds up
  // ---- where on its path, and which way it faces. kl: how sharply the path turns, per body length (+ toward S)
  var a = sign(i.b.y) * dist / L + i.b.w * 6.3 + s * 1.9;
  a -= 12.566371 * floor(a / 12.566371);
  let e = .6 / L;
  let P = titanPath(i.a.xyz, R, a, ph);
  let Pa = titanPath(i.a.xyz, R, a + e, ph); let Pb = titanPath(i.a.xyz, R, a - e, ph);
  let dd = .5 * length(Pa - Pb);
  let T = (Pa - Pb) / (2. * dd) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let kl = clamp(dot(Pa + Pb - 2. * P, S) / (dd * dd) * sz, -.6, .6);
  var l = i.p; var n = i.n.xyz;
  let lt = i.n.w;
  // the mouth of a filter feeder (C2020: gaping ram feeding, as a basking shark; it could not shut its mouth
  // completely). In a run it stands wide open; every 8 to 12 s it closes most of the way for a moment, as if to
  // swallow, and opens again. After the run it swallows twice. Between the runs it is nearly shut and only breathes:
  // a little wider every 5 to 7 s, more for half a minute after a run
  let swPer = 8. + 4. * hs(s + .13);
  let swT = fract((tau - 2.) / swPer + .5) * swPer;
  let sw = ss(0., .6, swT) * (1. - ss(1.4, 2.6, swT));
  let gape = feed * (1. - .70 * sw) * (.95 + .05 * sin(TAU * .4 * t + 20. * s));
  let cq = (tau - te - 1.2) / 1.5;
  let cw = sin(3.14159 * sat(fract(cq) / .6));
  let gulp = (.25 - .08 * floor(cq)) * cw * cw * step(0., cq) * step(cq, 1.999);
  let bc = .5 - .5 * cos(TAU * t / (5. + 2. * fract(s * 4.3)) + 6.3 * fract(s * 8.9));
  let tA = select(tau, fract(hc) * hPer + hPer * (1. - titanRun(hk - 1., s)), tau < te);   // since the last run began
  let br = (.06 + .06 * (1. - ss(4., 30., tA - te))) * bc * bc;
  let mo = max(gape, max(gulp, br));
  let sR = .5 - i.p.z; let cl = titanCleft(i.p.y);
  let isFin = step(.4, lt);
  let isJaw = sat(step(abs(lt - .25), .04) + step(abs(lt + .40), .04) + step(abs(lt + .70), .04));
  let wJ = (1. - ss(.125, .155, sR)) * ss(.004, .024, cl - sR) * isJaw;
  let wH = (1. - ss(cl - .014, cl + .010, sR)) * (1. - isFin);
  let jawA = (.08 + .52 * mo) * wJ;                 // the jaw drops about its hinge: 34 degrees wide open, 5 shut
  let headA = (0. - .02 - .12 * mo) * wH;           // the head lifts a little about the joint of the neck
  l = titanRotY(l, vec3f(0., -.072, .348), jawA);
  l = titanRotY(l, vec3f(0., .062, .350), headA);
  n = titanRotN(titanRotN(n, jawA), headA);
  // ---- the tail beat: one beat per 0.7 body lengths swum, so it beats faster when it swims faster. Wider as it speeds
  // up and while it pushes its open mouth through the water
  let amp = (.85 + .15 * min(vr, 2.)) * (1. + .4 * push + .25 * feed);
  let bp = TAU * dist / (.70 * sz) + s * 25.;
  // ---- the pectoral fins turn about a hinge at their root (+ up and out): they scull and steer (the fin on the inside
  // of the turn goes down). In a run they stand out further and scull less: they hold the body steady against the
  // pull of the open mouth
  let sx = select(-1., 1., i.p.x >= 0.);
  let pw = isFin * (1. - ss(.38, .42, sR)) * ss(.10, .14, abs(i.p.x));
  let up = .09 * (1. - .5 * feed) * sin(.5 * bp + 6.3 * s) - clamp(1.5 * kl, -.25, .25) * sx + .18 * feed;
  let fa = sx * up * pw;
  let hg = vec2f(sx * .10, -.08); let dq = l.xy - hg;
  l = vec3f(hg + vec2f(dq.x * cos(fa) - dq.y * sin(fa), dq.x * sin(fa) + dq.y * cos(fa)), l.z);
  n = vec3f(n.x * cos(fa) - n.y * sin(fa), n.x * sin(fa) + n.y * cos(fa), n.z);
  // ---- the body. The stiff front swings a little against the tail (recoil). The wave runs back from behind the
  // armour (0.37), its wavelength about one body length, so the tail lags behind the stalk. In a turn the body lies
  // along the curve of its path, the armoured front less
  let yr = .025 * amp * sin(bp - .9);
  let u = max(0., .13 - l.z);
  let wv = bp + 6. * l.z;
  let Aw = .22 * amp;
  let bw = .2 + .8 * ss(-.05, .25, 0. - l.z);
  let zc = l.z;
  l.x += yr * (zc - .1) + Aw * u * u * sin(wv) + .5 * kl * zc * zc * bw;
  let sl = yr + Aw * (6. * u * u * cos(wv) - 2. * u * sin(wv)) + kl * zc * bw;
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  // ---- it banks into the turn, a little
  let rb = 0. - clamp(.6 * kl * min(vr, 1.5), -.2, .2);
  l = vec3f(l.x * cos(rb) - l.y * sin(rb), l.x * sin(rb) + l.y * cos(rb), l.z);
  n = vec3f(n.x * cos(rb) - n.y * sin(rb), n.x * sin(rb) + n.y * cos(rb), n.z);
  let w = dodge(P, sz + 4. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = lt;
  // ---- dead on the floor (devonian-remains.md): b.y = 0.0001 marks an animal that lies still on its left side on the
  // mud, at a.xyz (world.js has raised a.y so that it is sunk in by a fifth of its width), turned by a.w
  if (abs(i.b.y) < .001) {
    let Td = vec3f(sin(i.a.w), 0., cos(i.a.w)); let Sd = vec3f(0., 1., 0.); let Ud = cross(Td, Sd);
    let pd = i.p;
    let wd = i.a.xyz + (Sd * pd.x + Ud * pd.y + Td * pd.z) * i.b.z;
    o.cp = g.vp * vec4f(wd, 1.); o.wp = wd; o.n = Sd * i.n.x + Ud * i.n.y + Td * i.n.z; o.sd = i.b.x + 10.;
  }
  return o;
}

@fragment fn fsTitanichthys(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let lt = i.lt; let sd = i.sd; let op = i.op;
  let ax = abs(op.x); let y = op.y; let s = .5 - op.z; let p2 = vec2f(s, y);
  let fw = max(fwidth(op.x), max(fwidth(op.y), fwidth(op.z)));        // how much of the body one pixel covers
  // ---- parts by aux
  let hull = step(-.13, lt) * step(lt, .35); let fins = step(.4, lt);
  let mouthP = step(-.47, lt) * step(lt, -.13); let boneP = step(-.85, lt) * step(lt, -.47); let eyeP = step(lt, -.9);
  let tb = titanTB(s); let top = tb.x; let v = sat((y - tb.y) / (tb.x - tb.y));   // v: 0 at the belly, 1 at the back
  let gc = titanCleft(y); let my = titanMouthY(s);
  // ---- where the armour is (the same map as armour() in the mesh)
  let rimS = max(.25 + .45 * y, .17);
  let vent = ss(.13, .15, s) * (1. - ss(.34, .37, s)) * (1. - ss(.07, .11, v));
  let jawP = ss(.003, -.003, y - my) * ss(.002, .008, gc - s) * hull;
  let lip = (1. - ss(.003, .009, abs(y - my))) * step(s, .127) * hull;
  let snout = 1. - ss(.002, .006, s);
  let headP = ss(.003, .008, gc - s) * (1. - max(max(lip, snout), jawP)) * hull;
  let trunkP = ss(.003, .008, s - gc) * max(ss(0., .005, rimS - s), vent) * hull;
  let armP = sat(headP + trunkP); let skinP = hull * (1. - armP);
  // ---- plate edges, noise
  let roof = ss(top - .032, top - .012, y);
  let dB = titanEdge(p2, vec2f(s, ax), gc, rimS, my, roof, vent);
  let big = fbm(op * 7. + sd * 11., 3); let mid = fbm(op * 30. + sd * 3., 3); let hue = fbm(op * 3. + sd * 23. + 5., 2);
  let n4 = titanNear(.004, fw); let n2 = titanNear(.002, fw); let n6 = titanNear(.006, fw);
  var fine = .5; var pits = .5; var ca = vec2f(.5, 1.); var cb = vec2f(.5, 1.);
  if (n6 > .01) { ca = titanCrackle(op * 70. + sd * 4.); }
  if (n4 > .01) { cb = titanCrackle(op * 220. + sd * 9.); fine = vn(op * 160. + sd * 7.); }
  if (n2 > .01) { pits = wor(op * 520.); }
  // ---- colours. The colour of the living animal is not known (no colour has been found for any placoderm), so nothing is
  // drawn that would need a source: no pattern at all. One plain tone over armour and skin (the Dunkleosteus has pale
  // armour on a dark body: this one must not), slate blue grey, darker along the back, paler below. The plates show by
  // their relief, not their colour
  let BONE = vec3f(.155, .175, .190); let SKIN = vec3f(.135, .155, .170); let BELLY = vec3f(.52, .52, .48);
  let boneC = BONE * mix(vec3f(.92, .97, 1.04), vec3f(1.08, .98, .80), hue);
  let skinC = SKIN * mix(vec3f(.85, 1.05, .95), vec3f(1.15, 1., .85), hue);
  var alb = mix(skinC, boneC, armP) * (.70 + .60 * big) * (.85 + .30 * mid) * (.90 + .20 * fine * n4);
  let blot = ss(.56, .66, fbm(op * 15. + sd * 5., 3));
  alb *= 1. - .25 * blot * hull;                                                  // faint dark blotches
  alb *= .62 + .50 * ss(.88, .35, v);                                             // darker along the back
  let vb = .30 + .12 * (fbm(vec3f(s * 7., sd * 3., ax * 3.), 2) - .5);
  let belly = (1. - ss(vb - .06, vb + .06, v)) * hull;                            // the belly: pale, a soft border, under the head too
  alb = mix(alb, BELLY * (.85 + .3 * mid) * (1. - .35 * blot), belly);
  var hgt = .0030 * armP;                                                         // the armour stands proud of the skin
  // ---- the plates: low domes. The joints a narrow groove between two raised lips of bone (the skin pulled over the edges
  // of the plates), not a painted line
  hgt += .0050 * sqrt(sat(min(dB, max(abs(y - my) - .006, 0.)) / .022)) * armP;   // the dome runs out softly at the lip
  let groove = titanLine(dB, .0010, fw) * armP; let lipB = titanLine(dB, .0034, fw) * armP;
  hgt += .0018 * lipB - .0030 * groove;
  alb *= (1. - .55 * groove) * (1. + .25 * (lipB - groove));
  // ---- the skin over everything, as on an elephant or a crocodile: cracks that cut it into fields of many corners, each
  // field a little domed. Large fields (about 5 cm at 3.7 m) and small ones (about 1.7 cm) in them. Deeper here, fainter there
  let bigC = (1. - ss(0., .12, ca.y - ca.x)) * n6;
  let smC = (1. - ss(0., .10, cb.y - cb.x)) * n4;
  // no cracks and no fields on the soft skin of the head (lips, snout, cheek), cracks only on its plates. The lower jaw
  // keeps them away from its lip: smooth, it looked like a paddle of plastic (fix of 2026-11-19)
  let nearLip = max((1. - ss(.010, .045, abs(y - my))) * step(s, .135), (1. - armP) * (1. - ss(.15, .17, s)) * (1. - jawP));
  let wrk = (bigC * (skinP + .7 * armP) + .4 * smC * hull) * (.45 + 1.1 * mid) * (1. - nearLip);
  hgt += 0. - .0011 * wrk + (.0006 * (.45 - ca.x) * n6 + .0005 * (.45 - cb.x) * n4) * hull * (1. - nearLip) + .00025 * (.5 - pits) * n2 * armP;
  // ---- cavities: dark in the grooves and the cracks, both the colour and the light from around
  let ao = sat(1. - .60 * groove - .45 * wrk);
  alb *= .55 + .45 * ao;
  // the keel of the plate of the back, the ridge along the edge of the roof, the lateral line (E2024: it ends on the armour)
  let keel = titanLine(ax, .0030, fw) * trunkP * step(0., y);
  let brow = titanLine(abs(y - (top - .022)), .0030, fw) * headP * ss(.030, .045, s);
  let lat = titanLine(abs(y - (top - .062)), .0016, fw) * armP * ss(.05, .07, s);
  hgt += .0020 * (keel + brow) - .0006 * lat;
  // ---- a scar: three gouges, a dark furrow with a light lip, placed by the seed and not the same on both sides (free)
  let so = (sd - .5) * .05; let sg = sign(op.x) * .012;
  var dg = 9.;
  for (var k = 0; k < 3; k++) {
    let kf = f32(k);
    dg = min(dg, titanSeg(p2, vec2f(.200 - so + .008 * kf, .088 - .004 * kf + sg), vec2f(.226 - so + .008 * kf, .066 - .004 * kf + sg)));
  }
  let core = titanLine(dg, .0010, fw); let lipS = sat(titanLine(dg, .0028, fw) - core); let scar = armP * n4;
  alb *= (1. - .55 * core * scar) * (1. + .35 * lipS * scar); hgt += 0. - .0012 * core * scar + .0004 * lipS * scar;
  // folds where the body bends, folds on the cheek
  let fold = vn(vec3f(s * 95., y * 7., ax * 7.));
  hgt += .0011 * (fold - .5) * ss(.48, .58, s) * skinP * titanNear(.011, fw);
  let cheekf = titanLine(titanSeg(p2, vec2f(.100, -.050), vec2f(.145, -.040)), .0030, fw) + titanLine(titanSeg(p2, vec2f(.104, -.060), vec2f(.140, -.056)), .0030, fw);
  hgt -= .0012 * cheekf * hull * step(s, gc);
  // the cleft, the lips, the nostrils, a dark mask round the eye
  let c1 = (s - gc) / .0045;
  alb = mix(alb, vec3f(.010, .009, .008), exp(0. - c1 * c1) * hull);
  alb = mix(alb, SKIN * 1.5, lip);
  let nose = max(step(length(p2 - vec2f(.006, .004)), .0022), step(length(p2 - vec2f(.013, .010)), .0020)) * hull;
  hgt -= .002 * nose; alb *= 1. - .7 * nose;
  let ed0 = length(p2 - vec2f(.048, .024));
  alb *= 1. - .40 * (1. - ss(.005, .014, ed0)) * hull;
  // ---- fins: dark, blotched
  alb = mix(alb, skinC * (.75 + .5 * big) * (.62 + .50 * ss(.88, .35, v)) * (.55 + .45 * ao), fins);
  // ---- the rods of the jaws: the same bone as the armour, lighter where the water wears them, stained at the gum, lines of
  // growth, pits. No teeth, no blades (C2020)
  let dl = abs(y - my);
  var pl = mix(BONE * vec3f(.70, .68, .62), BONE * vec3f(1.40, 1.38, 1.30), ss(.0, .006, dl));
  pl *= (1. - .14 * (.5 + .5 * cos(dl * TAU / .0030)) * titanNear(.003, fw)) * (1. - .30 * ss(.55, .80, vn(vec3f(s * 220., dl * 25., ax * 30.))))
    * (.85 + .3 * mid) * (1. - .25 * ss(.3, .05, pits) * n2);
  alb = mix(alb, pl, boneP);
  // ---- inside the mouth and the filter basket: wet flesh, not plastic. Grey skin at the lips, then a mottled grey pink with
  // fine dark red veins, folds along the floor and the roof, small papillae, ridges across the roof; darker the deeper it
  // goes (lit only from the opening); at the back five gill arches, deep red with fine filaments, each with a comb of pale
  // rakers in front (estimate after basking sharks: nothing of it is preserved)
  let deep = ss(0., .21, s);
  let mot = fbm(op * 45. + sd * 5., 3);
  var inner = mix(vec3f(.30, .17, .16), vec3f(.19, .075, .07), ss(.35, .70, mot));
  inner = mix(skinC * 1.4, inner, ss(.002, .014, dl));                            // the lips are grey skin
  let vein = (1. - ss(0., .03, abs(fbm(op * vec3f(60., 90., 90.) + sd * 3., 2) - .5))) * titanNear(.004, fw);
  inner *= 1. - .40 * vein;
  let rug = 1. - ss(0., .14, abs(vn(vec3f(s * 25., y * 180., ax * 180.)) - .5)); // folds along the mouth
  var pap = 0.;
  if (n2 > .01) { pap = 1. - ss(.15, .35, wor(op * 300. + sd)); }               // papillae, only close up
  let ridge = (titanLine(abs(s - .035), .0030, fw) + titanLine(abs(s - .055), .0030, fw) + titanLine(abs(s - .075), .0030, fw)
    + titanLine(abs(s - .095), .0030, fw)) * step(lt, -.2) * step(-.3, lt);
  var gill = 0.; var rake = 0.;
  for (var k = 0; k < 5; k++) {
    let ga = .138 + .012 * f32(k);
    gill += titanLine(abs(s - ga), .0034, fw);
    rake += ss(ga - .010, ga - .003, s) * (1. - ss(ga - .0015, ga, s));          // the comb in front of each arch
  }
  let ang = atan2(y + .040, op.x);
  let fil = .5 + .5 * cos(ang * 160.);                                            // gill filaments
  let comb = ss(.40, .85, .5 + .5 * cos(ang * 70.)) * sat(rake) * (.6 + .8 * vn(vec3f(ang * 20., s * 200., sd))) * titanNear(.002, fw);
  inner = mix(inner, vec3f(.38, .045, .04) * (.65 + .6 * fil * titanNear(.0015, fw)), sat(gill) * ss(.12, .135, s));
  inner = mix(inner * (1. - .55 * sat(rake) * (1. - comb)), vec3f(.48, .42, .36), .85 * comb);   // dark gaps between the rakers
  inner *= (1. + .45 * ridge) * (.80 + .35 * rug) * (1. + .25 * pap);
  inner *= mix(1., .18, pow(deep, .8));
  alb = mix(alb, inner * (.88 + .24 * mid), mouthP);
  hgt += (.0018 * rug + .0006 * pap + .0015 * ridge + .0014 * comb + .0010 * sat(gill) * fil - .0006 * vein) * mouthP;
  // how much light from around reaches the inside: less the deeper, less in the folds and between the rakers
  let mao = mix(.75, .20, deep) * (.65 + .35 * rug) * (1. - .45 * sat(rake) * (1. - comb));

  // ---- eye: small (BR2017: ring 35 mm, opening 13 mm). Black pupil, a narrow grey gold iris, round it the ring of bone
  let ev = p2 - vec2f(.048, .024); let ed = length(ev);
  let iris = vec3f(.42, .34, .16) * (.7 + .5 * fract(atan2(ev.y, ev.x) * 2.6)) * (1.2 - .6 * ss(.0016, .0024, ed));
  var eyeC = BONE * .6 * (.8 + .4 * mid);
  eyeC = mix(eyeC, vec3f(.010, .009, .007), step(ed, .0032));
  eyeC = mix(eyeC, iris, step(ed, .0024));
  eyeC = mix(eyeC, vec3f(.003), step(ed, .0015));
  alb = mix(alb, eyeC, eyeP);
  alb *= .92 + .16 * fract(sd * 13.7);
  // ---- dead on the floor (devonian-remains.md): duller and darker, black mud settled on what faces up
  let deadF = step(5., i.sd); let deadUp = ss(.15, .75, normalize(i.n).y);
  alb = mix(alb, mix(alb * .55, vec3f(.030, .028, .024) * (.8 + .4 * vn(i.wp * 6.)), .85 * deadUp), deadF);
  // ---- light. The relief is in body lengths: times the size of the animal
  let n = skinRelief(ns, i.wp, hgt * 4.2);
  let ring = eyeP * step(.0032, ed); let pup = eyeP - ring;
  let rough = (.35 + .9 * mid) * ao;
  // the inside of the mouth is wet: its sheen sits on the folds and papillae (small, sharp highlights), not on the smooth shape
  let spec = (.22 * armP + .10 * skinP + .10 * fins) * rough + .35 * boneP + .55 * mouthP * mao + .10 * ring;
  let shin = 10. + 12. * armP + 20. * boneP + 60. * mouthP;
  let wet = .25 * boneP + .08 * mouthP + 3. * pup;
  // inside the mouth the sun is dimmed too: the shadow map of the engine is coarse for a cavity of a metre
  let c = titanLight(alb, n, ns, i.wp, spec, shin, wet, mix(mix(1., ao, max(hull, fins)), mao, mouthP), mix(1., mao, mouthP));
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;

// ---------------------------------------------------------------- zoo
// Where a Titanichthys is: the same path and the same distance along it as vsTitanichthys (change one, change the
// other). Two parts, 5 m ahead and 5 m behind
const titanFr = (x) => x - floor(x);
// titanRun and titanRamp of the shader
const titanRun = (k, s) => 0.05 + 0.3 * titanFr(0.618034 * k + 0.37 * sin(2.3 * k + 9 * s) + 3.1 * s);
const titanRamp = (x) => (x <= 0 ? 0 : x < 1 ? x * x * x - 0.5 * x * x * x * x : x - 0.5);
// metres swum along its path by time t: cruising speed v0 with its two slow swells, and the feeding runs
const titanZooDist = (s, v0, t) => {
  const f1 = 0.031 + 0.02 * titanFr(s * 7.31), f2 = 0.083 + 0.03 * titanFr(s * 3.17);
  const q1 = f1 * t + 6.3 * titanFr(s * 5.13), q2 = f2 * t + 6.3 * titanFr(s * 9.71);
  const hPer = 50 + 20 * titanFr(s * 13.7), hc = t / hPer + titanFr(s * 2.9), hk = floor(hc);
  const tau = titanFr(hc) * hPer - hPer * titanRun(hk, s);
  const te = 3 + 12 + 13 * titanFr(s * 5.9), vb = 0.5 + 0.3 * titanFr(s * 8.3);
  return v0 * (t + 0.15 / f1 * sin(q1) + 0.10 / f2 * sin(q2))
    + vb * (hk * (te + 0.25) + 3 * titanRamp(tau / 3) - 3.5 * titanRamp((tau - te) / 3.5));
};
// the point of its path at angle g, written to ZP at k (titanPath in the shader)
const titanZooPath = (a, i, g, k) => {
  const R = a[i + 3], ph = a[i + 7] * 17;
  ZP[k] = a[i] + R * cos(g) + 0.1 * R * cos(1.5 * g + ph);
  ZP[k + 1] = a[i + 1] + 1.2 * sin(2 * g + ph) + 0.5 * sin(3.5 * g + 2 * ph);
  ZP[k + 2] = a[i + 2] + R * sin(g) + 0.1 * R * sin(1.5 * g + 1.7 * ph);
};
const zooTitanichthys = (a, i, part) => {
  const L = 0.9 * a[i + 3], v = a[i + 5];
  const g = (v < 0 ? -1 : 1) * titanZooDist(a[i + 4], abs(v), F[TIME]) / L + a[i + 7] * 6.3 + a[i + 4] * 1.9;
  titanZooPath(a, i, g, 0); titanZooPath(a, i, g + (part * 2 - 1) * 5 / L, 3);
  ZP[3] -= ZP[0]; ZP[4] -= ZP[1]; ZP[5] -= ZP[2]; ZP[7] = 5.0;
};
