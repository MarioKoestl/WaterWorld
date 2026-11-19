// ============================================================================
// Reference geometry for Ctenacanthus, first version (brief: docs/briefs/ctenacanthus-build.md)
// ============================================================================
// Not loaded by the build. Take meshCtenacanthus() over into source/eras/devonian/swimmers_ctenacanthus.js.
// It needs Mesh (engine/math.js) and curve() (devonian/swimmers.js), nothing else. Built on the frame of the
// Cladoselache; all numbers are its own.
// The mesh is one unit long, nose at +z, y up. s is the distance from the snout in body lengths: z = 0.5 - s.
//
// Sources (see the brief and docs/research/devonian/ctenacanthus.md): Z1981 (Zangerl 1981, Handbook of
// Paleoichthyology 3A, as quoted by Oceans of Kansas), OK (Oceans of Kansas, "Ctenacanthus", a whole ctenacanth of
// 1.6 m from the Permian of Texas), KGS (Kentucky Geological Survey, "Fossil of the month: Ctenacanthus": the partial
// body from the Cleveland Shale), GQ (the life restoration "Ctenacanthus concinnus.png" on Wikimedia Commons, CC BY 4.0,
// of the species of the Cleveland Shale, after Dean 1909 and Hodnett and others 2021: measured from the side, not
// copied; its colour is the artist's).
//
// aux (what a vertex is; the shaders read it):
//    0     skin of the body
//    0.25  skin of the lower jaw: drops with the jaw
//    0.5   fins
//    0.6   the two fin spines
//   -0.25  inside of the mouth and the throat, upper half (moves with the head)
//   -0.40  inside of the mouth and the throat, lower half (moves with the jaw)
//   -0.55  teeth of the upper jaw (move with the head)
//   -0.70  teeth of the lower jaw (move with the jaw)
//   -0.85  the rim around the eye
//   -1     eyes
function meshCtenacanthus() {
  const m = new Mesh();
  const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => { const l = hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const pos = (i) => [m.p[i * 3], m.p[i * 3 + 1], m.p[i * 3 + 2]];
  const band = (A, B, flip) => { for (let k = 0; k < A.length - 1; k++) flip ? m.quad(A[k], B[k], B[k + 1], A[k + 1]) : m.quad(A[k], A[k + 1], B[k + 1], B[k]); };

  // ---------------------------------------------------------------- the body: stations from snout to tail stalk
  // [s, back (y of the top), belly (y of the bottom), half width, roundness, height of the widest place]
  // "The shape of the body is fusiform" (Z1981). Back and belly measured on GQ: deepest 0.16 from 0.30 to 0.40, the
  // belly nearly straight behind the pelvic fins, the tail stalk 0.03 deep at 0.79 and turning up into the upper lobe.
  // No view from above: the widths are estimates (a little narrower than deep)
  const ST = [
    [0.000, 0.006, -0.004, 0.014, 2.2, 0.50],
    [0.010, 0.020, -0.006, 0.026, 2.4, 0.48],
    [0.025, 0.027, -0.016, 0.034, 2.4, 0.47],
    [0.050, 0.036, -0.040, 0.040, 2.4, 0.47],
    [0.080, 0.047, -0.050, 0.044, 2.3, 0.47],
    [0.100, 0.052, -0.056, 0.047, 2.3, 0.48],
    [0.150, 0.062, -0.065, 0.054, 2.2, 0.48],
    [0.200, 0.068, -0.075, 0.060, 2.2, 0.48],
    [0.250, 0.073, -0.082, 0.065, 2.2, 0.49],
    [0.300, 0.076, -0.085, 0.068, 2.2, 0.50],
    [0.350, 0.077, -0.085, 0.068, 2.2, 0.50],
    [0.400, 0.077, -0.084, 0.067, 2.2, 0.50],
    [0.450, 0.075, -0.078, 0.064, 2.1, 0.50],
    [0.500, 0.071, -0.060, 0.058, 2.1, 0.50],
    [0.550, 0.065, -0.046, 0.051, 2.1, 0.50],
    [0.600, 0.055, -0.039, 0.044, 2.0, 0.50],
    [0.650, 0.045, -0.036, 0.038, 2.0, 0.50],
    [0.700, 0.038, -0.030, 0.032, 2.0, 0.50],
    [0.750, 0.030, -0.017, 0.024, 2.0, 0.50],
    [0.790, 0.026, -0.006, 0.018, 2.0, 0.50],
    [0.820, 0.030, 0.000, 0.014, 2.0, 0.50],
    [0.850, 0.040, 0.010, 0.010, 2.0, 0.50],
    [0.870, 0.050, 0.022, 0.006, 2.0, 0.50],
  ];
  const at = (s) => {
    let i = 0; while (i < ST.length - 2 && ST[i + 1][0] <= s) i++;
    const a = ST[max(i - 1, 0)], b = ST[i], c = ST[i + 1], d = ST[min(i + 2, ST.length - 1)], h = c[0] - b[0], u = clamp((s - b[0]) / h, 0, 1), o = [];
    for (let q = 1; q < 6; q++) {
      const m1 = (c[q] - a[q]) / (c[0] - a[0]) * h, m2 = (d[q] - b[q]) / (d[0] - b[0]) * h;
      o.push((2 * u * u * u - 3 * u * u + 1) * b[q] + (u * u * u - 2 * u * u + u) * m1 + (3 * u * u - 2 * u * u * u) * c[q] + (u * u * u - u * u) * m2);
    }
    return o;
  };
  // the mouth: under the tip of the short snout (Hodnett and others 2021, after GQ), the corner at 0.12
  const S_C = 0.120;
  const mouthY = (s) => -0.012 - 0.016 * pow(clamp(s / S_C, 0, 1), 1.1);
  // five gill slits on each side (GQ), 0.170 to 0.205 at their top, slanting back towards the belly
  const GS = [0.170, 0.179, 0.188, 0.197, 0.206];
  const gill = (s, y) => GS.reduce((a, g) => a + exp(-pow((s - g - 0.24 * max(-0.010 - y, 0)) / 0.0016, 2)), 0) * sm(-0.070, -0.060, y) * (1 - sm(-0.012, 0.000, y));
  const skin = (s, a) => {
    const [T, B, W, n, q] = at(s), ym = B + (T - B) * q, c = cos(a), sn = sin(a);
    const x = W * (c < 0 ? -1 : 1) * pow(abs(c), 2 / n), y = sn >= 0 ? ym + (T - ym) * pow(sn, 2 / n) : ym - (ym - B) * pow(-sn, 2 / n);
    const k = 1 - 0.07 * gill(s, y) * sm(0.2, 0.6, abs(c));                      // the slits are grooves in the skin
    return [x * k, ym + (y - ym) * (1 - 0.3 * (1 - k)), 0.5 - s];
  };
  const angY = (s, y) => { let lo = -PI / 2, hi = PI / 2; for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; skin(s, mid)[1] < y ? lo = mid : hi = mid; } return (lo + hi) / 2; };
  const flank = (s, y, inset = 0) => { const p = skin(s, angY(s, y)); return [p[0] - inset, p[1], p[2]]; };

  // rings: every 0.004, every 0.0015 over the gill slits, every 0.01 behind 0.40
  const MU = 36, ML = 26, MP = 12, RS = [], rings = [];
  for (let s = 0.004; s < 0.1645; s += 0.004) RS.push(+s.toFixed(4));
  for (let s = 0.166; s < 0.2245; s += 0.0015) RS.push(+s.toFixed(4));
  for (let s = 0.228; s < 0.4005; s += 0.004) RS.push(+s.toFixed(4));
  for (let s = 0.41; s < 0.8705; s += 0.01) RS.push(+s.toFixed(4));
  const aC = angY(S_C, mouthY(S_C));
  // the lower jaw: a little narrower than the upper, its front a little behind the snout (GQ)
  const jw = (s) => 1 - 0.14 * (1 - sm(0.004, 0.050, s)), jdrop = (s) => -0.004 * (1 - sm(0, 0.025, s));
  for (const s of RS) {
    const split = s < S_C, a0 = split ? angY(s, mouthY(s)) : aC, U = [], L = [], R = { s, split, a0, U, L };
    for (let k = 0; k <= MU; k++) U.push(m.v(...skin(s, a0 + (PI - 2 * a0) * k / MU), 0));
    for (let k = 0; k <= ML; k++) {
      if (!split && (k === 0 || k === ML)) { L.push(k ? U[0] : U[MU]); continue; }
      const q = skin(s, PI - a0 + (PI + 2 * a0) * k / ML);
      L.push(m.v(q[0] * jw(s), q[1] + jdrop(s), q[2], s < 0.145 ? 0.25 : 0));
    }
    if (split) {
      const [xr, ym] = pos(U[0]), xl = pos(L[ML])[0], [T, B] = at(s); R.pal = []; R.flo = [];
      for (let k = 0; k <= MP; k++) { const th = PI * k / MP; R.pal.push(m.v(xr * 0.97 * cos(th), ym + 0.45 * (T - ym) * pow(sin(th), 0.7), 0.5 - s, -0.25)); }
      for (let k = 0; k <= MP; k++) { const th = PI * k / MP; R.flo.push(m.v(-xl * 0.97 * cos(th), ym + jdrop(s) - 0.40 * (ym - B) * pow(sin(th), 0.7), 0.5 - s, -0.40)); }
    }
    rings.push(R);
  }
  // the cheeks: a short strip of skin from 0.092 to the corner of the mouth, coloured as the inside of the mouth
  for (const right of [true, false]) {
    const A = [], B = [];
    for (const R of rings) {
      if (!R.split || R.s < 0.092) continue;
      const pu = pos(right ? R.U[0] : R.U[MU]), pl = pos(right ? R.L[ML] : R.L[0]), w = right ? -0.002 : 0.002;
      A.push(m.v(pu[0] + w, pu[1] - 0.0004, pu[2], -0.25)); B.push(m.v(pl[0] + w, pl[1] - 0.0012, pl[2], -0.40));
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
    const A = rings[0], y0 = mouthY(0), pu = m.v(0, y0 + 0.006, 0.5, 0), pl = m.v(0, y0 - 0.004 + jdrop(0), 0.4985, 0.25), pp = m.v(0, y0 + 0.003, 0.499, -0.25), pf = m.v(0, y0 - 0.003 + jdrop(0), 0.4985, -0.40);
    for (let k = 0; k < MU; k++) m.tri(pu, A.U[k], A.U[k + 1]);
    for (let k = 0; k < ML; k++) m.tri(pl, A.L[k], A.L[k + 1]);
    for (let k = 0; k < MP; k++) { m.tri(pp, A.pal[k + 1], A.pal[k]); m.tri(pf, A.flo[k + 1], A.flo[k]); }
    // the throat: from the corner of the mouth back past the gill slits (0.235), with five gill arches under them
    const C = rings[js];
    const xr = pos(C.pal[0])[0], ymc = pos(C.pal[0])[1], hu = pos(C.pal[MP / 2])[1] - ymc, hl = ymc - pos(C.flo[MP / 2])[1], sC = C.s, N = 22, S1 = 0.235;
    const arch = (s) => 1 - 0.14 * GS.reduce((a, g) => a + exp(-pow((s - g) / 0.0030, 2)), 0);
    const T = [C.pal.concat(C.flo)];
    for (let k = 1; k <= N; k++) {
      const u = k / N, s = sC + (S1 - sC) * u, yc = ymc + 0.010 * u, w = (xr + (0.036 - xr) * pow(u, 0.8)), a = arch(s);
      const up = (hu + (0.026 - hu) * u), lo = (hl + (0.024 - hl) * u) * a, ring = [];
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
    const D = rings[js + 1];
    m.tri(C.U[0], C.L[ML], D.U[0]); m.tri(C.L[0], C.U[MU], D.U[MU]);
    const Z = rings[rings.length - 1], [TT, BB] = at(Z.s), pe = m.v(0, (TT + BB) / 2, 0.5 - Z.s - 0.004, 0);
    for (let k = 0; k < MU; k++) m.tri(pe, Z.U[k + 1], Z.U[k]);
    for (let k = 0; k < ML; k++) m.tri(pe, Z.L[k + 1], Z.L[k]);
  }

  // ---------------------------------------------------------------- teeth
  // Ctenacanth teeth are of the cladodont kind: a tall middle cusp and smaller ones beside it (KGS names teeth on the
  // body from the Cleveland Shale; their number and size here are estimates). Ten in each jaw on each side, from the
  // front to 0.11, the middle cusp 0.006 high in front, smaller behind. Just inside the lips, leaning a little inward
  const cone = (base, dir, side, r, h, aux) => {
    const t2 = nrm(crs(dir, side)), V = [];
    for (let e = 0; e < 4; e++) { const w = e / 4 * TAU + PI / 4; V.push(m.v(base[0] + (side[0] * cos(w) + t2[0] * sin(w) * 0.6) * r, base[1] + (side[1] * cos(w) + t2[1] * sin(w) * 0.6) * r, base[2] + (side[2] * cos(w) + t2[2] * sin(w) * 0.6) * r, aux)); }
    const tip = m.v(base[0] + dir[0] * h, base[1] + dir[1] * h, base[2] + dir[2] * h, aux), c = [base[0] + dir[0] * h * 0.3, base[1] + dir[1] * h * 0.3, base[2] + dir[2] * h * 0.3];
    for (let e = 0; e < 4; e++) {
      const e2 = (e + 1) % 4, A = pos(V[e]), B = pos(V[e2]), n = crs(sub(B, A), sub(pos(tip), A));
      dot(n, sub(A, c)) > 0 ? m.tri(V[e], V[e2], tip) : m.tri(V[e2], V[e], tip);
    }
  };
  const ringAt = (s) => rings.reduce((b, R) => (R.split && abs(R.s - s) < abs(b.s - s) ? R : b), rings[0]);
  for (let k = 0; k < 10; k++) {
    const R = ringAt(0.010 + k * 0.011), f = 1 - 0.40 * sm(0.02, 0.11, R.s), h = 0.0060 * f, r = 0.0011 * f;
    for (const [up, idx] of [[true, 0], [true, MP], [false, 0], [false, MP]]) {
      const P = pos(up ? R.pal[idx] : R.flo[idx]), sx = P[0] > 0 ? 1 : -1, inw = -sx * 0.25;
      const base = [P[0] - sx * 0.0030, P[1] + (up ? 0.0006 : -0.0006), P[2]], dir = nrm([inw, up ? -1 : 1, 0]), side = [0, 0, 1];
      const aux = up ? -0.55 : -0.70;
      cone(base, dir, side, r, h, aux);
      for (const o of [-1, 1]) for (const q of [1, 2]) cone([base[0], base[1], base[2] + o * 0.0020 * q * f], nrm([inw, up ? -1 : 1, o * 0.18 * q]), side, r * (0.75 - 0.15 * q), h * (0.55 - 0.15 * q), aux);
    }
  }

  // ---------------------------------------------------------------- the eyes
  // GQ: about 0.016 across, centred at 0.063 at the height of the tip of the snout. A dome in a smooth rim of skin
  const EYE_S = 0.063, EYE_Y = 0.006, ER = 0.0075;
  for (const sx of [1, -1]) {
    const a = angY(EYE_S, EYE_Y), c = skin(EYE_S, a), e = 1e-3;
    const t1 = nrm(sub(skin(EYE_S + e, a), skin(EYE_S - e, a))), n0 = nrm(crs(sub(skin(EYE_S, a + e), skin(EYE_S, a - e)), t1)), n = n0[0] < 0 ? n0.map((v) => -v) : n0, t2 = crs(n, t1), rows = [];
    for (let k = 1; k <= 5; k++) {
      const la = k / 5 * PI / 2, row = [];
      for (let q = 0; q <= 16; q++) { const b = q / 16 * TAU, r = ER * sin(la), h = 0.0026 * cos(la) - 0.0008; row.push(m.v(sx * (c[0] + t1[0] * r * cos(b) + t2[0] * r * sin(b) + n[0] * h), c[1] + t1[1] * r * cos(b) + t2[1] * r * sin(b) + n[1] * h, c[2] + t1[2] * r * cos(b) + t2[2] * r * sin(b) + n[2] * h, -1)); }
      rows.push(row);
    }
    const top = m.v(sx * (c[0] + n[0] * 0.0019), c[1] + n[1] * 0.0019, c[2] + n[2] * 0.0019, -1);
    for (let q = 0; q < 16; q++) sx > 0 ? m.tri(top, rows[0][q + 1], rows[0][q]) : m.tri(top, rows[0][q], rows[0][q + 1]);
    for (let k = 0; k < 4; k++) band(rows[k], rows[k + 1], sx > 0);
    const RG = [];
    for (let q = 0; q <= 44; q++) {
      const b = q / 44 * TAU, bump = 0.7, row = [];
      for (let u = 0; u <= 6; u++) {
        const w = u / 6 * TAU, R0 = ER + 0.0020 + 0.0014 * cos(w), hh = -0.0004 + 0.0011 * bump * sin(w);
        row.push(m.v(sx * (c[0] + (t1[0] * cos(b) + t2[0] * sin(b)) * R0 + n[0] * hh), c[1] + (t1[1] * cos(b) + t2[1] * sin(b)) * R0 + n[1] * hh, c[2] + (t1[2] * cos(b) + t2[2] * sin(b)) * R0 + n[2] * hh, -0.85));
      }
      RG.push(row);
    }
    const a0 = pos(RG[0][0]), f0 = crs(sub(pos(RG[1][0]), a0), sub(pos(RG[0][1]), a0)), ctr = [sx * (c[0] + t1[0] * (ER + 0.0028) - n[0] * 0.0004), c[1] + t1[1] * (ER + 0.0028) - n[1] * 0.0004, c[2] + t1[2] * (ER + 0.0028) - n[2] * 0.0004];
    const fl = dot(f0, sub(a0, ctr)) < 0;
    for (let q = 0; q < 44; q++) band(RG[q], RG[q + 1], fl);
  }

  // ---------------------------------------------------------------- fins
  // A fin is a wing: front edge LE and rear edge TE as points from root to tip, a section like a wing between them.
  // th(t) is half its thickness. The root lies inside the body
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
    const q0 = pos(rs[0][2]), fn = crs(sub(pos(rs[0][3]), q0), sub(pos(rs[1][2]), q0)), n1 = nrm(crs(sub(te[0], le[0]), sub(le[1], le[0]))), flip = dot(fn, n1) < 0;
    for (let k = 0; k < N; k++) for (let e = 0; e < 8; e++) { const e2 = (e + 1) % 8; flip ? m.quad(rs[k][e], rs[k + 1][e], rs[k + 1][e2], rs[k][e2]) : m.quad(rs[k][e], rs[k][e2], rs[k + 1][e2], rs[k + 1][e]); }
  };
  const V = (s, x, y) => [x, y, 0.5 - s], mir = (P) => P.map((p) => [-p[0], p[1], p[2]]);
  const top = (s) => at(s)[0], bot = (s) => at(s)[1];
  // a tube along a line of centres C (points), radius rad(t), flattened from the sides by fx; ends closed
  const tube = (C, rad, aux, sides = 8, fx = 1) => {
    const Vr = [], N = C.length - 1;
    for (let k = 0; k <= N; k++) {
      const a = C[max(k - 1, 0)], b = C[min(k + 1, N)], d = nrm(sub(b, a)), u0 = abs(d[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      const e1 = nrm(crs(d, u0)), e2 = crs(d, e1), r = rad(k / N), ring = [];
      for (let e = 0; e < sides; e++) { const w = e / sides * TAU, c1 = cos(w) * r, c2 = sin(w) * r; ring.push(m.v(C[k][0] + (e1[0] * c1 + e2[0] * c2) * fx, C[k][1] + e1[1] * c1 + e2[1] * c2, C[k][2] + e1[2] * c1 + e2[2] * c2, aux)); }
      Vr.push(ring);
    }
    const a0 = pos(Vr[0][0]), f0 = crs(sub(pos(Vr[1][0]), a0), sub(pos(Vr[0][1]), a0)), fl = dot(f0, sub(a0, C[0])) < 0;
    for (let k = 0; k < N; k++) for (let e = 0; e < sides; e++) {
      const e2 = (e + 1) % sides; fl ? m.quad(Vr[k][e], Vr[k][e2], Vr[k + 1][e2], Vr[k + 1][e]) : m.quad(Vr[k][e], Vr[k + 1][e], Vr[k + 1][e2], Vr[k][e2]);
    }
    for (const [k, out] of [[0, -1], [N, 1]]) {
      const tip = m.v(C[k][0], C[k][1], C[k][2], aux);
      for (let e = 0; e < sides; e++) { const e2 = (e + 1) % sides; (out > 0) !== fl ? m.tri(Vr[k][e], Vr[k][e2], tip) : m.tri(Vr[k][e2], Vr[k][e], tip); }
    }
  };
  // pectoral fins: broad and three-cornered (after Dean 1909, by GQ; the Cleveland Shale body keeps them, KGS). GQ: the
  // base 0.228 to 0.37 low on the flank, the tip at 0.31, 0.14 below the middle line: back, out and down (the spread:
  // estimate)
  {
    const r0 = flank(0.228, -0.050, 0.008), r1 = flank(0.370, -0.058, 0.008);
    const LE = [r0, V(0.250, 0.075, -0.085), V(0.275, 0.100, -0.112), V(0.300, 0.118, -0.132), V(0.310, 0.124, -0.140)];
    const TE = [r1, V(0.362, 0.080, -0.092), V(0.348, 0.102, -0.117), V(0.326, 0.118, -0.135), V(0.311, 0.123, -0.139)];
    const th = (t) => 0.008 * pow(1 - t, 0.8) + 0.0012;
    wing(LE, TE, th, 0.5, 12); wing(mir(LE), mir(TE), th, 0.5, 12);
  }
  // pelvic fins: under the second dorsal fin, large (GQ: 0.50 to 0.585, the tip 0.09 below the middle line)
  {
    const r0 = flank(0.500, bot(0.500) + 0.012, 0.006), r1 = flank(0.565, bot(0.565) + 0.008, 0.006), x0 = r0[0];
    const LE = [r0, V(0.530, x0 + 0.012, -0.075), V(0.565, x0 + 0.022, -0.088), V(0.585, x0 + 0.026, -0.093)];
    const TE = [r1, V(0.575, x0 + 0.012, -0.068), V(0.584, x0 + 0.020, -0.083), V(0.587, x0 + 0.025, -0.092)];
    const th = (t) => 0.005 * (1 - t) + 0.0010;
    wing(LE, TE, th, 0.5, 10); wing(mir(LE), mir(TE), th, 0.5, 10);
  }
  // anal fin: "One anal fin is present" (Z1981). GQ: 0.70 to 0.772, 0.045 deep
  wing([V(0.700, 0, bot(0.700) + 0.008), V(0.720, 0, -0.045), V(0.745, 0, -0.064), V(0.766, 0, -0.075)],
    [V(0.772, 0, bot(0.772) + 0.006), V(0.774, 0, -0.030), V(0.771, 0, -0.055), V(0.767, 0, -0.074)],
    (t) => 0.004 * pow(1 - t, 0.6) + 0.0009, 0.5, 10);
  // the two dorsal fins, "each preceded by a basically neo-selachian finspine whose apical end protrudes beyond the
  // epidermis" (Z1981). GQ: the first from 0.265 to 0.40, its apex 0.09 above the back; the second from 0.51 to 0.646,
  // as tall. The front edge of each fin lies against its spine
  wing([V(0.265, 0, top(0.265) - 0.008), V(0.300, 0, 0.105), V(0.340, 0, 0.135), V(0.370, 0, 0.155), V(0.396, 0, 0.165)],
    [V(0.404, 0, top(0.404) - 0.008), V(0.402, 0, 0.095), V(0.400, 0, 0.130), V(0.398, 0, 0.158), V(0.397, 0, 0.164)],
    (t) => 0.006 * pow(1 - t, 0.6) + 0.0010, 0.5, 14);
  wing([V(0.510, 0, top(0.510) - 0.008), V(0.550, 0, 0.095), V(0.590, 0, 0.125), V(0.620, 0, 0.145), V(0.632, 0, 0.152)],
    [V(0.647, 0, top(0.647) - 0.006), V(0.649, 0, 0.075), V(0.646, 0, 0.110), V(0.639, 0, 0.140), V(0.633, 0, 0.151)],
    (t) => 0.006 * pow(1 - t, 0.6) + 0.0010, 0.5, 14);
  // the fin spines: "sub-cylindrical and pointed" (OK), a little flattened from the sides, leaning back along the front
  // edge of their fin, the tip free. GQ: the first from 0.262 to its tip at 0.360 (0.08 above the back), the second
  // from 0.528 to 0.630. In the whole ctenacanth of OK the front spine is 37 % longer than the rear one; here both
  // about 0.13 long (GQ). The ribs along them are the shader's
  for (const [s0, s1, y1] of [[0.262, 0.360, 0.154], [0.528, 0.630, 0.150]]) {
    const C = curve([V(s0, 0, top(s0) - 0.010), V(s0 + 0.030, 0, top(s0 + 0.030) + 0.020), V(s0 + 0.065, 0, (top(s0 + 0.065) + y1) / 2 + 0.012), V(s1, 0, y1)], 20);
    tube(C, (t) => 0.0062 * pow(1 - t, 0.7) + 0.0006, 0.6, 10, 0.75);
  }
  // tail fin: the upper lobe long and narrow, the lower one small (GQ: upper tip at 0.998 and 0.163 above the middle
  // line, lower tip at 0.898 and 0.095 below it, the notch at 0.846). "the ventral lobe of the caudal fin" is noted by
  // Z1981. Both lobes start inside the tail stalk and meet at the notch on its underside, so no gap opens between
  // the stalk and the lower lobe (fix of 2026-11-19)
  const thT = (t) => 0.006 * pow(1 - t, 0.6) + 0.0010;
  wing([V(0.790, 0, 0.026), V(0.840, 0, 0.068), V(0.900, 0, 0.110), V(0.950, 0, 0.140), V(0.985, 0, 0.158), V(0.998, 0, 0.163)],
    [V(0.846, 0, bot(0.846) + 0.004), V(0.870, 0, 0.022), V(0.900, 0, 0.058), V(0.950, 0, 0.112), V(0.985, 0, 0.150), V(0.996, 0, 0.161)], thT, 0.5, 18);
  wing([V(0.800, 0, bot(0.800) + 0.006), V(0.830, 0, -0.025), V(0.860, 0, -0.055), V(0.880, 0, -0.078), V(0.898, 0, -0.095)],
    [V(0.846, 0, bot(0.846) + 0.004), V(0.858, 0, -0.018), V(0.872, 0, -0.050), V(0.886, 0, -0.078), V(0.897, 0, -0.094)],
    thT, 0.5, 14);
  return m;
}
