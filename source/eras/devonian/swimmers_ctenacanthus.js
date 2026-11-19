// ============================================================================
// devonian: Ctenacanthus
// ============================================================================
// A sturdy shark with two dorsal fins, each with a long ribbed spine in front. About 1.8 m. Its mesh, its shaders
// and, for the zoo, where it is at a time. world.js lists it as a kind and gives it its instances. What it shares
// with the other animals of this era is in swimmers.js.

// Ctenacanthus in the round, first version (brief: docs/briefs/ctenacanthus-build.md). One unit long, nose at +z, y
// up. Sources (see the brief and docs/research/devonian/ctenacanthus.md): Z1981 (Zangerl 1981, Handbook of
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

// ---------------------------------------------------------------- shaders
const S_CTENACANTHUS = /*wgsl*/`
// Instance: a.xyz = centre of its path, a.w = radius R of its path. b.x = seed, b.y = cruising speed in m/s (the sign
// is the direction), b.z = length in metres, b.w = seed2. Each animal swims alone. Path and distance along it are
// repeated in zooCtenacanthus: change one, change the other.

// where it swims: a circle with a slower one on top, so the path wanders; it rises and sinks a little. Every
// frequency is a multiple of 0.5, so the path repeats after 4 pi and the angle can be wrapped. a: the angle along it
fn ctenPath(c: vec3f, R: f32, a: f32, ph: f32) -> vec3f {
  return c + vec3f(R * cos(a) + .1 * R * cos(1.5 * a + ph), 1.2 * sin(2. * a + ph) + .5 * sin(3.5 * a + 2. * ph),
                   R * sin(a) + .1 * R * sin(1.5 * a + 1.7 * ph));
}
// the line of the shut mouth (it reaches back to 0.12), and behind its corner the line to the hinge
fn ctenMouthY(s: f32) -> f32 { return 0. - .012 - .016 * pow(sat(s / .12), 1.1) - .9 * max(s - .12, 0.); }
// back (x) and belly (y) of the body at s, every 0.05 from the snout: read off the mesh
fn ctenTB(s: f32) -> vec2f {
  var T = array<f32, 19>(.012, .038, .053, .062, .069, .073, .076, .077, .077, .075, .071,
    .065, .055, .045, .038, .030, .027, .040, .050);
  var B = array<f32, 19>(-.020, -.043, -.057, -.065, -.076, -.082, -.085, -.085, -.084, -.078, -.060,
    -.046, -.039, -.036, -.030, -.017, -.004, .010, .016);
  let f = clamp(s * 20., 0., 17.999); let k = i32(f); let u = f - f32(k);
  return vec2f(mix(T[k], T[k + 1], u), mix(B[k], B[k + 1], u));
}
// a line of half width w at distance d. Where a pixel is wider than the line, the line gets wider and fainter
fn ctenLine(d: f32, w: f32, fw: f32) -> f32 {
  let ww = max(w, 1.2 * fw); let q = d / ww; return exp(0. - q * q) * (w / ww);
}
// is a detail of size p still larger than a pixel?
fn ctenNear(p: f32, fw: f32) -> f32 { return 1. - ss(.2 * p, .5 * p, fw); }
// the five gill slits (s of each at its top; they slant back towards the belly), and how near a point is to one
fn ctenGill(s: f32, y: f32, fw: f32) -> f32 {
  var g = 0.;
  let sl = .24 * max(0. - .010 - y, 0.);
  for (var k = 0; k < 5; k++) { g += ctenLine(abs(s - (.170 + .009 * f32(k)) - sl), .0011, fw); }
  return sat(g) * ss(-.070, -.060, y) * (1. - ss(-.012, 0., y));
}
// The light: that of the Titanichthys (titanLight). The sun through the flecks of the surface; the light from around
// darkened in cavities (ao); the sheen on the surface with its relief; a wet sheen on the smooth shape only where wet
// says so
fn ctenLight(alb: vec3f, n: vec3f, ns: vec3f, wp: vec3f, spec: f32, shin: f32, wet: f32, ao: f32, sun: f32) -> vec3f {
  let V = normalize(g.cam.xyz - wp); let z = zone(wp); let L = g.sun.xyz; let H = normalize(V + L);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  let Ec = E * sun * (.45 + .55 * caus(wp, length(g.cam.xyz - wp)));
  let around = amb(wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vol(wp).g, z) * 1.1 + side(wp, n, 1., z) * .8;
  return alb * (Ec * sat(dot(n, L)) * .65 + around * ao)
    + Ec * spec * (shin + 8.) / 40. * pow(sat(dot(n, H)), shin)
    + E * wet * pow(sat(dot(ns, H)), 70.);
}
// a positive angle turns the nose DOWN
fn ctenRotY(p: vec3f, pivot: vec3f, angle: f32) -> vec3f {
  let d = p - pivot; let ca = cos(angle); let sa = sin(angle);
  return pivot + vec3f(d.x, d.y * ca - d.z * sa, d.y * sa + d.z * ca);
}
fn ctenRotN(nn: vec3f, angle: f32) -> vec3f {
  let ca = cos(angle); let sa = sin(angle); return vec3f(nn.x, nn.y * ca - nn.z * sa, nn.y * sa + nn.z * ca);
}

@vertex fn vsCtenacanthus(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let R = i.a.w; let ph = i.b.w * 17.; let sz = i.b.z;
  let v0 = abs(i.b.y); let L = .9 * R;               // L: metres of path per radian, about
  // ---- how far it has swum. Its cruising speed swells and ebbs slowly (two waves, 20 and 12 %, its own for each one)
  let f1 = .031 + .02 * fract(s * 7.31); let f2 = .083 + .03 * fract(s * 3.17);
  let q1 = f1 * t + 6.3 * fract(s * 5.13); let q2 = f2 * t + 6.3 * fract(s * 9.71);
  var dist = v0 * (t + .20 / f1 * sin(q1) + .12 / f2 * sin(q2));
  var vr = 1. + .20 * cos(q1) + .12 * cos(q2);       // speed in cruising speeds
  // ---- a strike: every 60 to 120 s it surges 4 m forward, about 2 m/s faster at its peak 0.8 s in, then glides out of
  // it. tau: seconds since the strike began. The surge is t/T0 e^(-t/T0), its distance the integral of that. A shark
  // with teeth for seizing prey (estimate: nothing is known of how it hunted)
  let lPer = 60. + 60. * fract(s * 13.7);
  let lc = t / lPer + fract(s * 2.9);
  let tau = fract(lc) * lPer;
  let ex = exp(0. - tau / .8);
  dist += (floor(lc) + 1. - (1. + tau / .8) * ex) * 4.;
  vr += 4. * tau / .64 * ex / v0;
  let push = ss(0., .3, tau) * (1. - ss(.7, 1.0, tau));
  let glide = ss(.9, 1.4, tau) * (1. - ss(3., 7., tau));
  // ---- the mouth: nearly shut while it swims (estimate). At the peak of the strike the snap (open in 0.08 s, 0.15 s
  // open, shut in 0.10 s), then two swallows
  let sT = tau - .85;
  let snap = sat(sT / .08) * (1. - sat((sT - .23) / .10));
  let cq = (tau - 1.6) / 1.0;
  let cw = sin(3.14159 * sat(fract(cq) / .55));
  let chew = (.30 - .10 * floor(cq)) * cw * cw * step(0., cq) * step(cq, 1.999);
  let mo = max(snap, chew);
  // ---- where on its path, and which way it faces. The sign of b.y says which way round it goes
  var a = sign(i.b.y) * dist / L + i.b.w * 6.3 + s * 3.7;
  a -= 12.566371 * floor(a / 12.566371);
  let e = .6 / L;
  let P = ctenPath(i.a.xyz, R, a, ph);
  let Pa = ctenPath(i.a.xyz, R, a + e, ph); let Pb = ctenPath(i.a.xyz, R, a - e, ph);
  let dd = .5 * length(Pa - Pb);
  let T = (Pa - Pb) / (2. * dd) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let kl = clamp(dot(Pa + Pb - 2. * P, S) / (dd * dd) * sz, -.6, .6);
  var l = i.p; var n = i.n.xyz;
  let lt = i.n.w; let sR = .5 - i.p.z;
  let isFin = step(.4, lt);
  let isJaw = sat(step(abs(lt - .25), .04) + step(abs(lt + .40), .04) + step(abs(lt + .70), .04));
  let wJ = (1. - ss(.12, .16, sR)) * isJaw;
  let wH = (1. - ss(.13, .20, sR)) * (1. - isFin);
  let jawA = (.04 + .55 * mo) * wJ;                 // the jaw drops about its hinge: 2 degrees swimming, 34 in the snap
  let headA = (0. - .01 - .06 * mo) * wH;
  l = ctenRotY(l, vec3f(0., -.030, .380), jawA);
  l = ctenRotY(l, vec3f(0., .045, .330), headA);
  n = ctenRotN(ctenRotN(n, jawA), headA);
  // ---- the tail beat: one beat per 0.7 body lengths swum, wider in the push of a strike, small while it glides
  let amp = (.85 + .15 * min(vr, 2.)) * (1. + .5 * push) * (1. - .6 * glide);
  let bp = TAU * dist / (.70 * sz) + s * 30.;
  // ---- the pectoral fins turn about a hinge at their root: they scull a little, steer (the fin on the inside of the
  // turn goes down) and spread down to brake while it glides after a strike
  let sx = select(-1., 1., i.p.x >= 0.);
  let pw = isFin * step(lt, .55) * ss(.222, .232, sR) * (1. - ss(.37, .39, sR)) * ss(.050, .080, abs(i.p.x))
    * step(i.p.y, -.02);
  let up = .06 * sin(.5 * bp + 6.3 * s) * (1. - glide) - clamp(1.5 * kl, -.25, .25) * sx - .25 * glide;
  let fa = sx * up * pw;
  let hg = vec2f(sx * .050, -.055); let dq = l.xy - hg;
  l = vec3f(hg + vec2f(dq.x * cos(fa) - dq.y * sin(fa), dq.x * sin(fa) + dq.y * cos(fa)), l.z);
  n = vec3f(n.x * cos(fa) - n.y * sin(fa), n.x * sin(fa) + n.y * cos(fa), n.z);
  // ---- the body. The front swings a little against the tail (recoil). The wave runs back from the middle, its
  // wavelength about one body length; in a turn the body lies along the curve of its path
  let yr = .025 * amp * sin(bp - .9);
  let u = max(0., .05 - l.z);
  let wv = bp + 6. * l.z;
  let Aw = .22 * amp;
  let bw = .3 + .7 * ss(-.05, .25, 0. - l.z);
  let zc = l.z;
  l.x += yr * (zc - .1) + Aw * u * u * sin(wv) + .5 * kl * zc * zc * bw;
  let sl = yr + Aw * (6. * u * u * cos(wv) - 2. * u * sin(wv)) + kl * zc * bw;
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  // ---- it banks into the turn, more when fast
  let rb = 0. - clamp(.6 * kl * min(vr, 1.5), -.25, .25);
  l = vec3f(l.x * cos(rb) - l.y * sin(rb), l.x * sin(rb) + l.y * cos(rb), l.z);
  n = vec3f(n.x * cos(rb) - n.y * sin(rb), n.x * sin(rb) + n.y * cos(rb), n.z);
  let w = dodge(P, .6 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
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

@fragment fn fsCtenacanthus(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let lt = i.lt; let sd = i.sd; let op = i.op;
  let ax = abs(op.x); let y = op.y; let s = .5 - op.z; let p2 = vec2f(s, y);
  let fw = max(fwidth(op.x), max(fwidth(op.y), fwidth(op.z)));        // how much of the body one pixel covers
  // ---- parts by aux
  let hull = step(-.13, lt) * step(lt, .35); let fins = step(.4, lt) * step(lt, .55); let spineP = step(.55, lt);
  let mouthP = step(-.47, lt) * step(lt, -.13); let teethP = step(-.75, lt) * step(lt, -.47);
  let ringP = step(-.92, lt) * step(lt, -.75); let eyeP = step(lt, -.92);
  let tb = ctenTB(s); let v = sat((y - tb.y) / (tb.x - tb.y));     // v: 0 at the belly, 1 at the back
  let my = ctenMouthY(s); let dl = abs(y - my);
  let big = fbm(op * 6. + sd * 11., 3); let mid = fbm(op * 28. + sd * 3., 3); let hue = fbm(op * 3. + sd * 23. + 5., 2);
  let n4 = ctenNear(.004, fw); let n2 = ctenNear(.002, fw); let n1 = ctenNear(.001, fw);
  // ---- colour. Nothing is known of its colour: one plain tone, no pattern (the blue green of GQ is the artist's).
  // Dark grey brown along the back, paler on the flank, a pale belly with a soft border (estimate)
  let BACK = vec3f(.115, .115, .110); let FLANK = vec3f(.245, .240, .228); let BELLY = vec3f(.560, .550, .510);
  let tint = mix(vec3f(.94, 1., 1.06), vec3f(1.06, 1., .92), hue);
  var alb = mix(FLANK, BACK, ss(.45, .85, v)) * tint;
  let vb = .36 + .10 * (fbm(vec3f(s * 6., sd * 3., ax * 3.), 2) - .5);
  alb = mix(alb, BELLY * (.92 + .16 * mid), (1. - ss(vb - .07, vb + .07, v)));
  alb *= (.86 + .28 * big) * (.92 + .16 * mid);
  // ---- the skin: "leathery skin (shagreen)" on the body from the Cleveland Shale (KGS), "armoured with placoid
  // denticles" (Z1981, as summarised by OK): a fine even grain over the whole body, faint folds, not glossy. The
  // lateral line a fine groove
  var fine = .5; var grain = .5;
  if (n2 > .01) { fine = fbm(op * vec3f(40., 120., 120.) + sd * 7., 2); }
  if (n1 > .01) { grain = wor(op * 900. + sd * 3.); }
  var hgt = .00025 * (fine - .5) * n2 * hull;
  // the lateral line: from behind the eye to the tail, a third of the way down from the back (estimate), a fine groove
  let latY = tb.x - .33 * (tb.x - tb.y);
  let lat = ctenLine(abs(y - latY), .0012, fw) * ss(.09, .12, s) * hull;
  let den = .8 * max(hull, fins) + .4 * lat + ringP;
  hgt += 0. - .0004 * lat + .00025 * (.5 - grain) * n1 * den;
  alb *= (1. - .25 * lat) * (1. + .12 * (.5 - grain) * n1 * den);
  // the gill slits: five narrow dark grooves
  let gl = ctenGill(s, y, fw) * hull;
  alb = mix(alb, vec3f(.025, .02, .02), .85 * gl); hgt -= .0012 * gl;
  // the nostrils: just above the tip of the snout (estimate)
  let nose = (1. - ss(.0022, .0032, length(vec2f(s - .012, y - .002)))) * hull * step(.008, ax);
  alb *= 1. - .75 * nose; hgt -= .0015 * nose;
  // the lips: a little paler
  alb = mix(alb, FLANK * 1.25, (1. - ss(.002, .006, dl)) * step(s, .121) * hull);
  // ---- fins: the tone of the body where they sit; the pectoral fins pale below (the side that looks down)
  let finC = mix(FLANK, BACK, ss(-.02, .06, y)) * tint * (.86 + .28 * big) * (.92 + .16 * mid);
  alb = mix(alb, mix(finC, BELLY * .85, ss(-.3, -.8, ns.y) * step(y, -.03)), fins);
  // ---- the fin spines: "ornamented with narrow, closely spaced, longitudinal ... ridges or ribs" and many with "tiny
  // bumps" (KGS), the tip "finished by an outer coat of orthodentine" (Z1981). Pale grey brown, ribs along the spine,
  // small knobs on the ribs, a little glossy (colour: estimate)
  let rib = .5 + .5 * cos(op.x * TAU / .0012);
  var knob = .5;
  if (n1 > .01) { knob = wor(op * vec3f(300., 900., 900.) + sd); }
  let spC = vec3f(.40, .37, .32) * (.82 + .18 * rib * n1) * (.9 + .2 * mid) * (1. - .25 * ss(.3, .05, knob) * n1);
  alb = mix(alb, spC, spineP);
  hgt += (.00012 * rib + .00015 * ss(.3, .05, knob)) * n1 * spineP;
  // ---- teeth: off white, greyer at the base
  alb = mix(alb, mix(vec3f(.45, .43, .38), vec3f(.78, .75, .66), ss(.002, .007, dl)), teethP);
  // ---- inside the mouth: wet flesh. Grey at the lips, then mottled grey pink with fine dark red veins and folds;
  // darker the deeper; at the back five gill arches, deep red with fine filaments, under the slits
  let deep = ss(0., .22, s);
  let mot = fbm(op * 45. + sd * 5., 3);
  var inner = mix(vec3f(.32, .19, .18), vec3f(.20, .08, .075), ss(.35, .70, mot));
  inner = mix(FLANK * 1.3, inner, ss(.002, .010, dl));
  let vein = (1. - ss(0., .03, abs(fbm(op * vec3f(60., 90., 90.) + sd * 3., 2) - .5))) * ctenNear(.004, fw);
  inner *= 1. - .40 * vein;
  let rug = 1. - ss(0., .14, abs(vn(vec3f(s * 25., y * 180., ax * 180.)) - .5));
  var arch = 0.;
  for (var k = 0; k < 5; k++) { arch += ctenLine(abs(s - (.172 + .009 * f32(k))), .0028, fw); }
  let ang = atan2(y + .02, op.x);
  let fil = .5 + .5 * cos(ang * 160.);
  inner = mix(inner, vec3f(.40, .05, .045) * (.65 + .6 * fil * ctenNear(.0015, fw)), sat(arch) * ss(.155, .165, s));
  inner *= (.80 + .35 * rug) * mix(1., .18, pow(deep, .8));
  alb = mix(alb, inner * (.88 + .24 * mid), mouthP);
  hgt += (.0016 * rug + .0010 * sat(arch) * fil - .0005 * vein) * mouthP;
  let mao = mix(.75, .20, deep) * (.65 + .35 * rug);
  // ---- the eye: GQ about 0.016 across. Black pupil in a dark iris, a rim of skin around it
  let ev = p2 - vec2f(.063, .006); let ed = length(ev);
  let iris = vec3f(.20, .21, .17) * (.7 + .5 * fract(atan2(ev.y, ev.x) * 2.6));
  var eyeC = mix(iris, vec3f(.012, .012, .014), step(ed, .0050));
  alb = mix(alb, eyeC, eyeP);                                                     // the rim keeps the tone of the skin
  alb *= .92 + .16 * fract(sd * 13.7);
  // ---- dead on the floor (devonian-remains.md): duller and darker, black mud settled on what faces up
  let deadF = step(5., i.sd); let deadUp = ss(.15, .75, normalize(i.n).y);
  alb = mix(alb, mix(alb * .55, vec3f(.030, .028, .024) * (.8 + .4 * vn(i.wp * 6.)), .85 * deadUp), deadF);
  // ---- light. The relief is in body lengths: times the length of the animal (about 1.6 m)
  let n = skinRelief(ns, i.wp, hgt * 1.6);
  let pup = eyeP * step(ed, .0050);
  let spec = .14 * hull + .10 * fins + .35 * spineP + .40 * teethP + .55 * mouthP * mao + .10 * ringP;
  let shin = 12. + 26. * spineP + 30. * teethP + 60. * mouthP;
  let wet = .06 * hull + .30 * teethP + .08 * mouthP + 2.5 * eyeP;
  let c = ctenLight(alb, n, ns, i.wp, spec, shin, wet, mix(1., mao, mouthP), mix(1., mao, mouthP));
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;

// ---------------------------------------------------------------- zoo
// A Ctenacanthus: the same path and the same distance along it as vsCtenacanthus (change one, change the other).
// Two lines from the middle. Nothing here allocates: it runs in every frame
const ctenFr = (x) => x - floor(x);
// metres swum along its path by time t: cruising speed v0 with its two slow swells, and 4 m for every strike
const ctenZooDist = (s, v0, t) => {
  const f1 = 0.031 + 0.02 * ctenFr(s * 7.31), f2 = 0.083 + 0.03 * ctenFr(s * 3.17);
  const q1 = f1 * t + 6.3 * ctenFr(s * 5.13), q2 = f2 * t + 6.3 * ctenFr(s * 9.71);
  const lPer = 60 + 60 * ctenFr(s * 13.7), lc = t / lPer + ctenFr(s * 2.9), tau = ctenFr(lc) * lPer;
  return v0 * (t + 0.20 / f1 * sin(q1) + 0.12 / f2 * sin(q2))
    + (floor(lc) + 1 - (1 + tau / 0.8) * exp(-tau / 0.8)) * 4;
};
// the point of its path at angle g, written to ZP at k (ctenPath in the shader)
const ctenZooPath = (a, i, g, k) => {
  const R = a[i + 3], ph = a[i + 7] * 17;
  ZP[k] = a[i] + R * cos(g) + 0.1 * R * cos(1.5 * g + ph);
  ZP[k + 1] = a[i + 1] + 1.2 * sin(2 * g + ph) + 0.5 * sin(3.5 * g + 2 * ph);
  ZP[k + 2] = a[i + 2] + R * sin(g) + 0.1 * R * sin(1.5 * g + 1.7 * ph);
};
const zooCtenacanthus = (a, i, part) => {
  const s = a[i + 4], v = a[i + 5], L = 0.9 * a[i + 3];
  const g = (v < 0 ? -1 : 1) * ctenZooDist(s, abs(v), F[TIME]) / L + a[i + 7] * 6.3 + s * 3.7;
  ctenZooPath(a, i, g, 0); ctenZooPath(a, i, g + (part * 2 - 1) * 4 / L, 3);
  ZP[3] -= ZP[0]; ZP[4] -= ZP[1]; ZP[5] -= ZP[2]; ZP[7] = 3.0;
};
