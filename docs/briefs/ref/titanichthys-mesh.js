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
//    0.5   fins
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
  // section. aux -0.70 moves with the jaw. The rod ends 0.007 in front of the corner of the mouth: behind it the shader
  // turns the jaw less and less, and a rod that ran on to 0.150 bent there into a thin hook. Its front end starts at
  // 0.016, in the skin of the chin: from 0.005 it stood out in front of the jaw as a loose stub (fix of 2026-11-19)
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
