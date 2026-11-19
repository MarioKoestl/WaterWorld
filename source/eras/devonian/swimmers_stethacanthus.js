// ============================================================================
// devonian: Stethacanthus (the anvil shark)
// ============================================================================
// A small shark, about 1 m, with a flat-topped dorsal structure (the "anvil") covered in denticle teeth on top, and
// a matching rough patch on its head. About 8 individuals, each on its own orbit. Its mesh, its shaders and, for the
// zoo, where it is at a time. What it shares with the other animals is in swimmers.js.

// Stethacanthus in the round, first version (brief: docs/briefs/stethacanthus-build.md). One unit long, nose at +z, y
// up. Sources (see the brief and docs/research/devonian/stethacanthus.md): W (Wikipedia, "Stethacanthus" and
// "Stethacanthidae"), CS2001 (Coates and Sequeira 2001, Akmonistion zangerli, the best known stethacanthid: abstract),
// AP (the orthographic side view "Akmonistion lateral profile.png" on Wikimedia Commons, CC BY 4.0: measured, not
// copied; its pattern of spots is the artist's and is not taken over).
//
// The mesh carries the male: the spine-brush complex, the denticles on the head and the claspers. The vertex shader
// folds them away for the other animals ("affirmed only in males, and only in those males that have reached sexual
// maturity", W).
//
// aux (what a vertex is; the shaders read it):
//    0     skin of the body
//    0.25  skin of the lower jaw: drops with the jaw
//    0.5   fins and the fin whips
//    0.65  claspers (males only)
//    0.7   the spine-brush complex (males only)
//    0.75  the large denticles on the brush and on the head (males only)
//   -0.25  inside of the mouth and the throat, upper half (moves with the head)
//   -0.40  inside of the mouth and the throat, lower half (moves with the jaw)
//   -0.55  teeth of the upper jaw (move with the head)
//   -0.70  teeth of the lower jaw (move with the jaw)
//   -0.85  the rim around the eye
//   -1     eyes
function meshStethacanthus() {
  const m = new Mesh();
  const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => { const l = hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const pos = (i) => [m.p[i * 3], m.p[i * 3 + 1], m.p[i * 3 + 2]];
  const band = (A, B, flip) => { for (let k = 0; k < A.length - 1; k++) flip ? m.quad(A[k], B[k], B[k + 1], A[k + 1]) : m.quad(A[k], A[k + 1], B[k + 1], B[k]); };

  // ---------------------------------------------------------------- the body: stations from snout to tail stalk
  // [s, back (y of the top), belly (y of the bottom), half width, roundness, height of the widest place]
  // Back and belly measured on AP: a stout head with a short snout, deepest 0.12 from 0.25 to 0.40, then a long slim
  // tail stalk (0.03 deep at 0.80). No view from above: the widths are estimates, the head broad (CS2001: "broad
  // supraorbital shelves"), the body a little narrower than deep
  const ST = [
    [0.000, 0.005, -0.002, 0.014, 2.2, 0.50],
    [0.010, 0.011, -0.006, 0.026, 2.4, 0.48],
    [0.025, 0.016, -0.013, 0.034, 2.5, 0.47],
    [0.050, 0.023, -0.031, 0.040, 2.5, 0.48],
    [0.080, 0.030, -0.039, 0.045, 2.4, 0.48],
    [0.100, 0.035, -0.045, 0.048, 2.4, 0.48],
    [0.150, 0.046, -0.055, 0.052, 2.3, 0.49],
    [0.200, 0.054, -0.063, 0.055, 2.2, 0.50],
    [0.250, 0.056, -0.065, 0.056, 2.2, 0.50],
    [0.300, 0.057, -0.065, 0.056, 2.2, 0.50],
    [0.350, 0.057, -0.062, 0.055, 2.2, 0.50],
    [0.400, 0.057, -0.058, 0.053, 2.2, 0.50],
    [0.450, 0.056, -0.055, 0.050, 2.1, 0.50],
    [0.500, 0.052, -0.051, 0.046, 2.1, 0.50],
    [0.550, 0.046, -0.041, 0.040, 2.1, 0.50],
    [0.600, 0.038, -0.031, 0.033, 2.0, 0.50],
    [0.650, 0.033, -0.022, 0.027, 2.0, 0.50],
    [0.700, 0.031, -0.012, 0.022, 2.0, 0.50],
    [0.750, 0.030, -0.005, 0.019, 2.0, 0.50],
    [0.800, 0.031, -0.002, 0.017, 2.0, 0.50],
    [0.840, 0.034, 0.001, 0.013, 2.0, 0.50],
    [0.880, 0.040, 0.009, 0.006, 2.0, 0.50],
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
  // the mouth: just under the tip of the short snout, the corner at 0.12 under the rear of the eye (AP)
  const S_C = 0.120;
  const mouthY = (s) => -0.008 - 0.030 * pow(clamp(s / S_C, 0, 1), 1.1);
  // five gill slits on each side, close together from 0.196 to 0.224 (AP), from low on the flank to about the middle
  const GS = [0.196, 0.203, 0.210, 0.217, 0.224];
  const gill = (s, y) => GS.reduce((a, g) => a + exp(-pow((s - g) / 0.0016, 2)), 0) * sm(-0.064, -0.054, y) * (1 - sm(-0.010, 0.004, y));
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
  for (let s = 0.004; s < 0.1885; s += 0.004) RS.push(+s.toFixed(4));
  for (let s = 0.190; s < 0.2305; s += 0.0015) RS.push(+s.toFixed(4));
  for (let s = 0.234; s < 0.4005; s += 0.004) RS.push(+s.toFixed(4));
  for (let s = 0.41; s < 0.8805; s += 0.01) RS.push(+s.toFixed(4));
  const aC = angY(S_C, mouthY(S_C));
  // the lower jaw: a little narrower than the upper, its front a little behind the snout (AP)
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
  // Few and large: "6-7 tooth files along each ramus" (CS2001), each tooth "a single large cusp and two pairs of smaller
  // accessory cusps for a total of five cusps" (W). Seven in each jaw on each side, from the front to 0.11; the middle
  // cusp 0.008 high in front, smaller behind (estimate). They stand just inside the lips, upper ones pointing down,
  // lower ones up, both leaning a little inward
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
  for (let k = 0; k < 7; k++) {
    const R = ringAt(0.012 + k * 0.016), f = 1 - 0.40 * sm(0.02, 0.11, R.s), h = 0.0080 * f, r = 0.0014 * f;
    for (const [up, idx] of [[true, 0], [true, MP], [false, 0], [false, MP]]) {
      const P = pos(up ? R.pal[idx] : R.flo[idx]), sx = P[0] > 0 ? 1 : -1, inw = -sx * 0.25;
      const base = [P[0] - sx * 0.0030, P[1] + (up ? 0.0006 : -0.0006), P[2]], dir = nrm([inw, up ? -1 : 1, 0]), side = [0, 0, 1];
      const aux = up ? -0.55 : -0.70;
      cone(base, dir, side, r, h, aux);
      for (const o of [-1, 1]) for (const q of [1, 2]) cone([base[0], base[1], base[2] + o * 0.0020 * q * f], nrm([inw, up ? -1 : 1, o * 0.18 * q]), side, r * (0.75 - 0.15 * q), h * (0.55 - 0.15 * q), aux);
    }
  }

  // ---------------------------------------------------------------- the eyes
  // Large: "large orbits" (W), AP: about 0.03 across, centred at 0.064 at the height of the tip of the snout. A dome in a
  // smooth raised rim of skin
  const EYE_S = 0.064, EYE_Y = 0.006, ER = 0.012;
  for (const sx of [1, -1]) {
    const a = angY(EYE_S, EYE_Y), c = skin(EYE_S, a), e = 1e-3;
    const t1 = nrm(sub(skin(EYE_S + e, a), skin(EYE_S - e, a))), n0 = nrm(crs(sub(skin(EYE_S, a + e), skin(EYE_S, a - e)), t1)), n = n0[0] < 0 ? n0.map((v) => -v) : n0, t2 = crs(n, t1), rows = [];
    for (let k = 1; k <= 5; k++) {
      const la = k / 5 * PI / 2, row = [];
      for (let q = 0; q <= 16; q++) { const b = q / 16 * TAU, r = ER * sin(la), h = 0.0040 * cos(la) - 0.0010; row.push(m.v(sx * (c[0] + t1[0] * r * cos(b) + t2[0] * r * sin(b) + n[0] * h), c[1] + t1[1] * r * cos(b) + t2[1] * r * sin(b) + n[1] * h, c[2] + t1[2] * r * cos(b) + t2[2] * r * sin(b) + n[2] * h, -1)); }
      rows.push(row);
    }
    const top = m.v(sx * (c[0] + n[0] * 0.0030), c[1] + n[1] * 0.0030, c[2] + n[2] * 0.0030, -1);
    for (let q = 0; q < 16; q++) sx > 0 ? m.tri(top, rows[0][q + 1], rows[0][q]) : m.tri(top, rows[0][q], rows[0][q + 1]);
    for (let k = 0; k < 4; k++) band(rows[k], rows[k + 1], sx > 0);
    const RG = [];
    for (let q = 0; q <= 44; q++) {
      const b = q / 44 * TAU, bump = 0.8, row = [];
      for (let u = 0; u <= 6; u++) {
        const w = u / 6 * TAU, R0 = ER + 0.0028 + 0.0020 * cos(w), hh = -0.0004 + 0.0016 * bump * sin(w);
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
  // a tube along a line of centres C (points), round with radius rad(t), ends closed. aux as given
  const tube = (C, rad, aux, sides = 8) => {
    const Vr = [], N = C.length - 1;
    for (let k = 0; k <= N; k++) {
      const a = C[max(k - 1, 0)], b = C[min(k + 1, N)], d = nrm(sub(b, a)), u0 = abs(d[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      const e1 = nrm(crs(d, u0)), e2 = crs(d, e1), r = rad(k / N), ring = [];
      for (let e = 0; e < sides; e++) { const w = e / sides * TAU; ring.push(m.v(C[k][0] + (e1[0] * cos(w) + e2[0] * sin(w)) * r, C[k][1] + (e1[1] * cos(w) + e2[1] * sin(w)) * r, C[k][2] + (e1[2] * cos(w) + e2[2] * sin(w)) * r, aux)); }
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
  // pectoral fins: small, three-cornered (W, CS2001: "small size of the paired fins"). AP: base 0.243 to 0.29 low on
  // the flank, the tip 0.10 below the middle line at 0.318: back, out and down (the spread: estimate)
  {
    const r0 = flank(0.243, -0.040, 0.008), r1 = flank(0.292, -0.046, 0.008);
    const LE = [r0, V(0.262, 0.064, -0.062), V(0.290, 0.078, -0.086), V(0.317, 0.088, -0.103)];
    const TE = [r1, V(0.300, 0.062, -0.066), V(0.310, 0.076, -0.088), V(0.319, 0.087, -0.102)];
    const th = (t) => 0.006 * pow(1 - t, 0.8) + 0.0010;
    wing(LE, TE, th, 0.5, 10); wing(mir(LE), mir(TE), th, 0.5, 10);
    // the fin whip: "at least 22 axial cartilages" that "extended past the pelvic fins" (W). It grows out of the rear of
    // the base of each pectoral fin and lies against the lower flank, back to 0.69 (AP), thin and fading to a point.
    // Each point sits on the skin (the lower flank, turning a little towards the belly further back), pushed out by
    // its own radius, so it never stands away from the body. Thickness: estimate (5 mm at the root of a 1 m fish)
    const WR = (u) => 0.0025 * pow(1 - u, 1.3) + 0.0003, WH = [];
    for (let k = 0; k <= 40; k++) {
      const u = k / 40, s = 0.288 + (0.690 - 0.288) * u, [, , , , q0] = at(s), ym = at(s)[1] + (at(s)[0] - at(s)[1]) * q0;
      const p = skin(s, -PI / 2 + 0.80 - 0.30 * u), d = nrm([p[0], p[1] - ym, 0]), r = WR(u) + 0.0004;
      WH.push([p[0] + d[0] * r, p[1] + d[1] * r, p[2]]);
    }
    tube(WH, WR, 0.5, 6); tube(WH.map((p) => [-p[0], p[1], p[2]]), WR, 0.5, 6);
  }
  // pelvic fins: small and low, 0.487 to 0.55 (AP)
  {
    const r0 = flank(0.487, bot(0.487) + 0.010, 0.006), r1 = flank(0.550, bot(0.550) + 0.008, 0.006);
    const LE = [r0, V(0.505, r0[0] + 0.010, bot(0.505) - 0.006), V(0.528, r0[0] + 0.018, bot(0.528) - 0.016), V(0.545, r0[0] + 0.022, bot(0.545) - 0.020)];
    const TE = [r1, V(0.556, r0[0] + 0.010, bot(0.556) - 0.006), V(0.553, r0[0] + 0.018, bot(0.553) - 0.016), V(0.548, r0[0] + 0.022, bot(0.548) - 0.020)];
    const th = (t) => 0.004 * (1 - t) + 0.0010;
    wing(LE, TE, th, 0.5, 10); wing(mir(LE), mir(TE), th, 0.5, 10);
  }
  // claspers of the male: along the inner edge of the pelvic fins and a little past them, "club-shaped at the distal
  // ends" (W). They lie against the belly, the club only a little thicker. Length and thickness: estimate
  {
    const CR = (u) => 0.0026 + 0.0012 * sm(0.70, 0.90, u) * (1 - sm(0.95, 1.0, u)) - 0.0010 * sm(0.95, 1.0, u);
    for (const sx of [1, -1]) {
      const C = [];
      for (let k = 0; k <= 16; k++) { const u = k / 16, s = 0.515 + 0.080 * u; C.push(V(s, sx * 0.011, bot(s) - 0.0004 - CR(u) * (0.3 + 0.7 * u))); }
      tube(C, CR, 0.65, 8);
    }
  }
  // second dorsal fin: without a spine (W, "Stethacanthidae"). AP: 0.481 to 0.552, 0.056 high, the apex at 0.530, a
  // concave rear edge
  wing([V(0.481, 0, top(0.481) - 0.008), V(0.497, 0, top(0.497) + 0.020), V(0.514, 0, top(0.514) + 0.042), V(0.526, 0, top(0.526) + 0.054), V(0.531, 0, top(0.531) + 0.056)],
    [V(0.553, 0, top(0.553) - 0.006), V(0.548, 0, top(0.548) + 0.010), V(0.541, 0, top(0.541) + 0.028), V(0.535, 0, top(0.535) + 0.046), V(0.532, 0, top(0.532) + 0.055)],
    (t) => 0.005 * pow(1 - t, 0.6) + 0.0010, 0.5, 12);
  // tail fin: "a sharply up-turned caudal axis associated with a broad hypochordal lobe" (CS2001): nearly symmetrical.
  // AP: upper tip at 0.996 and 0.177 above the middle line, lower tip at 0.971 and 0.121 below, the notch at 0.918
  const thT = (t) => 0.006 * pow(1 - t, 0.6) + 0.0010;
  wing([V(0.800, 0, 0.026), V(0.850, 0, 0.068), V(0.900, 0, 0.124), V(0.950, 0, 0.161), V(0.985, 0, 0.175), V(0.996, 0, 0.177)],
    [V(0.880, 0, 0.012), V(0.918, 0, 0.022), V(0.945, 0, 0.065), V(0.970, 0, 0.118), V(0.990, 0, 0.165), V(0.996, 0, 0.176)], thT, 0.5, 18);
  wing([V(0.800, 0, 0.004), V(0.850, 0, -0.022), V(0.900, 0, -0.075), V(0.950, 0, -0.104), V(0.965, 0, -0.116), V(0.971, 0, -0.121)],
    [V(0.880, 0, 0.012), V(0.918, 0, 0.016), V(0.935, 0, -0.022), V(0.955, 0, -0.068), V(0.966, 0, -0.102), V(0.970, 0, -0.119)], thT, 0.5, 18);

  // ---------------------------------------------------------------- the spine-brush complex (males)
  // Where other sharks carry the first dorsal fin (W), over the pectoral fins (CS2001: "a pectoral-level ... dorsal spine
  // ... extending onto a brush-complex of up to 160% of neurocranial length"). AP: a stalk leaning back from 0.19 to 0.29
  // on the back, its flat top 0.12 above the back, from 0.213 to 0.368 and overhanging behind like an anvil. The top
  // carries "up to nine rows of large denticles pointing anteriorly" (W). Its width: estimate (thin stalk, top wide
  // enough for nine rows)
  {
    const LEp = [[0.188, -0.010], [0.196, 0.030], [0.203, 0.063], [0.208, 0.093], [0.212, 0.120]];        // s, height above the back
    const TEp = [[0.292, -0.010], [0.305, 0.028], [0.318, 0.058], [0.338, 0.083], [0.368, 0.104]];
    const F = curve(LEp.map(([s, h]) => [0, top(s) + h, 0.5 - s]), 16), B = curve(TEp.map(([s, h]) => [0, top(s) + h, 0.5 - s]), 16);
    const NS = 14, rings2 = [];
    for (let k = 0; k <= 16; k++) {
      const u = k / 16, w = 0.0060 + 0.0110 * pow(u, 3), ring = [];
      for (let e = 0; e < 2 * NS; e++) {
        const th = e / (2 * NS) * TAU, f = 0.5 - 0.5 * cos(th), sg = sin(th) >= 0 ? 1 : -1, xx = w * sg * pow(abs(sin(th)), 0.4);
        ring.push(m.v(xx, F[k][1] + (B[k][1] - F[k][1]) * f, F[k][2] + (B[k][2] - F[k][2]) * f, 0.7));
      }
      rings2.push(ring);
    }
    const cen = (k) => [0, (F[k][1] + B[k][1]) / 2, (F[k][2] + B[k][2]) / 2];
    const a0 = pos(rings2[0][3]), f0 = crs(sub(pos(rings2[1][3]), a0), sub(pos(rings2[0][4]), a0)), fl = dot(f0, sub(a0, cen(0))) < 0;
    for (let k = 0; k < 16; k++) for (let e = 0; e < 2 * NS; e++) {
      const e2 = (e + 1) % (2 * NS); fl ? m.quad(rings2[k][e], rings2[k][e2], rings2[k + 1][e2], rings2[k + 1][e]) : m.quad(rings2[k][e], rings2[k + 1][e], rings2[k + 1][e2], rings2[k][e2]);
    }
    const c16 = cen(16), capTop = m.v(c16[0], c16[1] + 0.001, c16[2], 0.7);
    for (let e = 0; e < 2 * NS; e++) { const e2 = (e + 1) % (2 * NS); fl ? m.tri(rings2[16][e], rings2[16][e2], capTop) : m.tri(rings2[16][e2], rings2[16][e], capTop); }
    // the denticles on its top: nine rows across, pointing forward and a little up
    for (let row = 0; row < 9; row++) for (let q = 0; q < 13; q++) {
      const f = (q + 0.5) / 13, x = (row - 4) / 4 * 0.0130 * (0.6 + 0.4 * f);
      const y = F[16][1] + (B[16][1] - F[16][1]) * f, z = F[16][2] + (B[16][2] - F[16][2]) * f, hh = 0.0090 * (0.7 + 0.3 * sin(PI * f));
      cone([x, y - 0.0005, z], nrm([0, 0.55, 1]), [1, 0, 0], 0.0020, hh, 0.75);
    }
  }
  // the denticles on the head: a patch on top of the head from 0.025 to 0.10, pointing back (W). Size: estimate
  for (let row = 0; row < 5; row++) for (let q = 0; q < 8; q++) {
    const s = 0.030 + q * 0.009, x = (row - 2) / 2 * 0.016 * (0.5 + 0.5 * sm(0.02, 0.06, s)), y = top(s) - 0.001;
    cone([x, y, 0.5 - s], nrm([0, 0.45, -1]), [1, 0, 0], 0.0016, 0.0060, 0.75);
  }
  return m;
}

// ---------------------------------------------------------------- shaders
const S_STETHACANTHUS = /*wgsl*/`
// Instance: a.xyz = centre of its path, a.w = radius R of its path. b.x = seed, b.y = cruising speed in m/s (the sign
// is the direction), b.z = length in metres, b.w = seed2. Each animal swims alone. Path and distance along it are
// repeated in zooStethacanthus: change one, change the other. The seed decides whether the animal is a mature male
// (with the spine-brush complex, the denticles on the head and the claspers) or not: stethMale().

// where it swims: a circle with a slower one on top, so the path wanders; it rises and sinks a little. Every
// frequency is a multiple of 0.5, so the path repeats after 4 pi and the angle can be wrapped. a: the angle along it
fn stethPath(c: vec3f, R: f32, a: f32, ph: f32) -> vec3f {
  return c + vec3f(R * cos(a) + .1 * R * cos(1.5 * a + ph), 1.0 * sin(2. * a + ph) + .4 * sin(3.5 * a + 2. * ph),
                   R * sin(a) + .1 * R * sin(1.5 * a + 1.7 * ph));
}
// the line of the shut mouth (it reaches back to 0.12), and behind its corner the line to the hinge
fn stethMouthY(s: f32) -> f32 { return 0. - .008 - .030 * pow(sat(s / .12), 1.1) - .9 * max(s - .12, 0.); }
// a mature male? About two animals in five (free). Only those carry the spine-brush complex, the denticles on the head
// and the claspers: "affirmed only in males, and only in those males that have reached sexual maturity" (W)
fn stethMale(sd: f32) -> f32 { return step(.6, fract(sd * 7.7 + .13)); }
// back (x) and belly (y) of the body at s, every 0.05 from the snout: read off the mesh
fn stethTB(s: f32) -> vec2f {
  var T = array<f32, 19>(.008, .024, .036, .046, .054, .056, .057, .057, .057, .056, .052,
    .046, .038, .033, .031, .030, .031, .035, .040);
  var B = array<f32, 19>(-.016, -.033, -.046, -.055, -.063, -.065, -.065, -.062, -.058, -.055, -.051,
    -.041, -.031, -.022, -.012, -.005, -.002, .003, .007);
  let f = clamp(s * 20., 0., 17.999); let k = i32(f); let u = f - f32(k);
  return vec2f(mix(T[k], T[k + 1], u), mix(B[k], B[k + 1], u));
}
// a line of half width w at distance d. Where a pixel is wider than the line, the line gets wider and fainter
fn stethLine(d: f32, w: f32, fw: f32) -> f32 {
  let ww = max(w, 1.2 * fw); let q = d / ww; return exp(0. - q * q) * (w / ww);
}
// is a detail of size p still larger than a pixel?
fn stethNear(p: f32, fw: f32) -> f32 { return 1. - ss(.2 * p, .5 * p, fw); }
// the five gill slits (s of each), and how near a point is to one of them on the flank
fn stethGill(s: f32, y: f32, fw: f32) -> f32 {
  var g = 0.;
  for (var k = 0; k < 5; k++) { g += stethLine(abs(s - (.196 + .007 * f32(k))), .0010, fw); }
  return sat(g) * ss(-.064, -.054, y) * (1. - ss(-.010, .004, y));
}
// The light: that of the Titanichthys (titanLight). The sun through the flecks of the surface; the light from around
// darkened in cavities (ao); the sheen on the surface with its relief; a wet sheen on the smooth shape only where wet
// says so
fn stethLight(alb: vec3f, n: vec3f, ns: vec3f, wp: vec3f, spec: f32, shin: f32, wet: f32, ao: f32, sun: f32) -> vec3f {
  let V = normalize(g.cam.xyz - wp); let z = zone(wp); let L = g.sun.xyz; let H = normalize(V + L);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  let Ec = E * sun * (.45 + .55 * caus(wp, length(g.cam.xyz - wp)));
  let around = amb(wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vol(wp).g, z) * 1.1 + side(wp, n, 1., z) * .8;
  return alb * (Ec * sat(dot(n, L)) * .65 + around * ao)
    + Ec * spec * (shin + 8.) / 40. * pow(sat(dot(n, H)), shin)
    + E * wet * pow(sat(dot(ns, H)), 70.);
}
// a positive angle turns the nose DOWN
fn stethRotY(p: vec3f, pivot: vec3f, angle: f32) -> vec3f {
  let d = p - pivot; let ca = cos(angle); let sa = sin(angle);
  return pivot + vec3f(d.x, d.y * ca - d.z * sa, d.y * sa + d.z * ca);
}
fn stethRotN(nn: vec3f, angle: f32) -> vec3f {
  let ca = cos(angle); let sa = sin(angle); return vec3f(nn.x, nn.y * ca - nn.z * sa, nn.y * sa + nn.z * ca);
}

@vertex fn vsStethacanthus(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let R = i.a.w; let ph = i.b.w * 17.; let sz = i.b.z;
  let v0 = abs(i.b.y); let L = .9 * R;               // L: metres of path per radian, about
  // ---- how far it has swum: slowly ("probably a slow-moving shark", W; "unsuited for sudden acceleration and
  // sustained high-speed pursuit", CS2001). It speeds up and slows down on two slow waves (30 and 15 %); it does not
  // strike
  let f1 = .031 + .02 * fract(s * 7.31); let f2 = .083 + .03 * fract(s * 3.17);
  let q1 = f1 * t + 6.3 * fract(s * 5.13); let q2 = f2 * t + 6.3 * fract(s * 9.71);
  let dist = v0 * (t + .30 / f1 * sin(q1) + .15 / f2 * sin(q2));
  let vr = 1. + .30 * cos(q1) + .15 * cos(q2);       // speed in cruising speeds
  // ---- the mouth: it breathes by pumping, a small opening every 2 to 3 s (estimate: a slow shark does not breathe by
  // swimming alone)
  let bc = .5 - .5 * cos(TAU * t / (2. + fract(s * 4.3)) + 6.3 * fract(s * 8.9));
  let mo = .10 * bc * bc;
  // ---- where on its path, and which way it faces. The sign of b.y says which way round it goes
  var a = sign(i.b.y) * dist / L + i.b.w * 6.3 + s * 2.1;
  a -= 12.566371 * floor(a / 12.566371);
  let e = .6 / L;
  let P = stethPath(i.a.xyz, R, a, ph);
  let Pa = stethPath(i.a.xyz, R, a + e, ph); let Pb = stethPath(i.a.xyz, R, a - e, ph);
  let dd = .5 * length(Pa - Pb);
  let T = (Pa - Pb) / (2. * dd) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let kl = clamp(dot(Pa + Pb - 2. * P, S) / (dd * dd) * sz, -.6, .6);
  var l = i.p; var n = i.n.xyz;
  let lt = i.n.w; let sR = .5 - i.p.z;
  // ---- what only a mature male has folds into the body for the others: the brush, its denticles, the claspers
  let maleP = step(.6, lt) * step(lt, .8);
  let fold = maleP * (1. - stethMale(s));
  l = mix(l, vec3f(0., 0., l.z), fold);
  let isFin = step(.4, lt) * step(lt, .55);
  let isJaw = sat(step(abs(lt - .25), .04) + step(abs(lt + .40), .04) + step(abs(lt + .70), .04));
  let wJ = (1. - ss(.12, .16, sR)) * isJaw;
  let wH = (1. - ss(.13, .20, sR)) * (1. - isFin) * (1. - maleP);
  let jawA = (.06 + .50 * mo) * wJ;                 // the jaw drops about its hinge: 3 to 6 degrees as it breathes
  let headA = (0. - .01 - .05 * mo) * wH;
  l = stethRotY(l, vec3f(0., -.038, .380), jawA);
  l = stethRotY(l, vec3f(0., .040, .330), headA);
  n = stethRotN(stethRotN(n, jawA), headA);
  // ---- the tail beat: one beat per 0.7 body lengths swum, so it beats faster when it swims faster
  let amp = .85 + .15 * min(vr, 2.);
  let bp = TAU * dist / (.70 * sz) + s * 30.;
  // ---- the pectoral fins turn about a hinge at their root: they scull a little and steer (the fin on the inside of
  // the turn goes down). The whips start behind the fins and sway with the body
  let sx = select(-1., 1., i.p.x >= 0.);
  let pw = isFin * ss(.236, .244, sR) * (1. - ss(.30, .33, sR)) * ss(.040, .070, abs(i.p.x)) * step(i.p.y, -.02);
  let up = .07 * sin(.5 * bp + 6.3 * s) - clamp(1.5 * kl, -.25, .25) * sx;
  let fa = sx * up * pw;
  let hg = vec2f(sx * .040, -.042); let dq = l.xy - hg;
  l = vec3f(hg + vec2f(dq.x * cos(fa) - dq.y * sin(fa), dq.x * sin(fa) + dq.y * cos(fa)), l.z);
  n = vec3f(n.x * cos(fa) - n.y * sin(fa), n.x * sin(fa) + n.y * cos(fa), n.z);
  // ---- the body. The front swings a little against the tail (recoil). The wave runs back from in front of the
  // middle, its wavelength about one body length; in a turn the body lies along the curve of its path
  let yr = .025 * amp * sin(bp - .9);
  let u = max(0., .10 - l.z);
  let wv = bp + 6. * l.z;
  let Aw = .20 * amp;
  let bw = .3 + .7 * ss(-.05, .25, 0. - l.z);
  let zc = l.z;
  l.x += yr * (zc - .1) + Aw * u * u * sin(wv) + .5 * kl * zc * zc * bw;
  let sl = yr + Aw * (6. * u * u * cos(wv) - 2. * u * sin(wv)) + kl * zc * bw;
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  // ---- it banks into the turn, a little
  let rb = 0. - clamp(.5 * kl * min(vr, 1.5), -.2, .2);
  l = vec3f(l.x * cos(rb) - l.y * sin(rb), l.x * sin(rb) + l.y * cos(rb), l.z);
  n = vec3f(n.x * cos(rb) - n.y * sin(rb), n.x * sin(rb) + n.y * cos(rb), n.z);
  let w = dodge(P, .6 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = lt;
  return o;
}

@fragment fn fsStethacanthus(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let lt = i.lt; let sd = i.sd; let op = i.op;
  let ax = abs(op.x); let y = op.y; let s = .5 - op.z; let p2 = vec2f(s, y);
  let fw = max(fwidth(op.x), max(fwidth(op.y), fwidth(op.z)));        // how much of the body one pixel covers
  // ---- parts by aux
  let hull = step(-.13, lt) * step(lt, .35); let fins = step(.4, lt) * step(lt, .55);
  let clasp = step(.6, lt) * step(lt, .675); let crest = step(.675, lt) * step(lt, .725); let dentP = step(.725, lt);
  let mouthP = step(-.47, lt) * step(lt, -.13); let teethP = step(-.75, lt) * step(lt, -.47);
  let ringP = step(-.92, lt) * step(lt, -.75); let eyeP = step(lt, -.92);
  let tb = stethTB(s); let v = sat((y - tb.y) / (tb.x - tb.y));     // v: 0 at the belly, 1 at the back
  let my = stethMouthY(s); let dl = abs(y - my);
  let big = fbm(op * 6. + sd * 11., 3); let mid = fbm(op * 28. + sd * 3., 3); let hue = fbm(op * 3. + sd * 23. + 5., 2);
  let n4 = stethNear(.004, fw); let n2 = stethNear(.002, fw); let n1 = stethNear(.001, fw);
  // ---- colour. Nothing is known of its colour: one plain tone, no pattern (the spots of AP are the artist's). Dark
  // grey brown along the back, paler on the flank, a pale belly with a soft border (estimate)
  let BACK = vec3f(.120, .118, .112); let FLANK = vec3f(.250, .245, .232); let BELLY = vec3f(.560, .545, .505);
  let tint = mix(vec3f(.94, 1., 1.06), vec3f(1.06, 1., .92), hue);
  var alb = mix(FLANK, BACK, ss(.45, .85, v)) * tint;
  let vb = .36 + .10 * (fbm(vec3f(s * 6., sd * 3., ax * 3.), 2) - .5);
  alb = mix(alb, BELLY * (.92 + .16 * mid), (1. - ss(vb - .07, vb + .07, v)));
  alb *= (.86 + .28 * big) * (.92 + .16 * mid);
  // ---- the skin: "minute, button-shaped, flank scales" (CS2001): a fine even grain over the whole body, faint folds,
  // not glossy. The lateral line a fine groove
  var fine = .5; var grain = .5;
  if (n2 > .01) { fine = fbm(op * vec3f(40., 120., 120.) + sd * 7., 2); }
  if (n1 > .01) { grain = wor(op * 900. + sd * 3.); }
  var hgt = .00025 * (fine - .5) * n2 * hull;
  // the lateral line: from behind the eye to the tail, a third of the way down from the back (estimate), a fine groove
  let latY = tb.x - .33 * (tb.x - tb.y);
  let lat = stethLine(abs(y - latY), .0012, fw) * ss(.09, .12, s) * hull;
  let den = .6 * max(hull, fins) + .4 * lat + crest + ringP;
  hgt += 0. - .0004 * lat + .00025 * (.5 - grain) * n1 * den;
  alb *= (1. - .25 * lat) * (1. + .12 * (.5 - grain) * n1 * den);
  // the gill slits: five narrow dark grooves
  let gl = stethGill(s, y, fw) * hull;
  alb = mix(alb, vec3f(.025, .02, .02), .85 * gl); hgt -= .0012 * gl;
  // the nostrils: just above the tip of the snout (estimate)
  let nose = (1. - ss(.0022, .0032, length(vec2f(s - .010, y - .001)))) * hull * step(.008, ax);
  alb *= 1. - .75 * nose; hgt -= .0015 * nose;
  // the lips: a little paler
  alb = mix(alb, FLANK * 1.25, (1. - ss(.002, .006, dl)) * step(s, .121) * hull);
  // ---- fins: the tone of the body where they sit; the pectoral fins pale below (the side that looks down)
  let finC = mix(FLANK, BACK, ss(-.02, .06, y)) * tint * (.86 + .28 * big) * (.92 + .16 * mid);
  alb = mix(alb, mix(finC, BELLY * .85, ss(-.3, -.8, ns.y) * step(y, -.03)), fins);
  // ---- the spine-brush complex: skin over cartilage, in the tone of the back. Its flat top and the patch on the head
  // carry the large denticles: pale grey, a little glossy (colour: estimate). The claspers in the tone of the belly
  alb = mix(alb, finC * 1.05, crest);
  alb = mix(alb, vec3f(.46, .44, .40) * (.9 + .2 * mid), dentP);
  alb = mix(alb, BELLY * .80 * (.9 + .2 * mid), clasp);
  // ---- teeth: off white, greyer at the base
  alb = mix(alb, mix(vec3f(.45, .43, .38), vec3f(.78, .75, .66), ss(.002, .007, dl)), teethP);
  // ---- inside the mouth: wet flesh. Grey at the lips, then mottled grey pink with fine dark red veins and folds;
  // darker the deeper; at the back five gill arches, deep red with fine filaments, under the slits
  let deep = ss(0., .23, s);
  let mot = fbm(op * 45. + sd * 5., 3);
  var inner = mix(vec3f(.32, .19, .18), vec3f(.20, .08, .075), ss(.35, .70, mot));
  inner = mix(FLANK * 1.3, inner, ss(.002, .010, dl));
  let vein = (1. - ss(0., .03, abs(fbm(op * vec3f(60., 90., 90.) + sd * 3., 2) - .5))) * stethNear(.004, fw);
  inner *= 1. - .40 * vein;
  let rug = 1. - ss(0., .14, abs(vn(vec3f(s * 25., y * 180., ax * 180.)) - .5));
  var arch = 0.;
  for (var k = 0; k < 5; k++) { arch += stethLine(abs(s - (.196 + .007 * f32(k))), .0024, fw); }
  let ang = atan2(y + .02, op.x);
  let fil = .5 + .5 * cos(ang * 160.);
  inner = mix(inner, vec3f(.40, .05, .045) * (.65 + .6 * fil * stethNear(.0015, fw)), sat(arch) * ss(.18, .19, s));
  inner *= (.80 + .35 * rug) * mix(1., .18, pow(deep, .8));
  alb = mix(alb, inner * (.88 + .24 * mid), mouthP);
  hgt += (.0016 * rug + .0010 * sat(arch) * fil - .0005 * vein) * mouthP;
  let mao = mix(.75, .20, deep) * (.65 + .35 * rug);
  // ---- the eye: large ("large orbits", W). Black pupil in a dark iris, a rim of skin around it
  let ev = p2 - vec2f(.064, .006); let ed = length(ev);
  let iris = vec3f(.20, .21, .17) * (.7 + .5 * fract(atan2(ev.y, ev.x) * 2.6));
  var eyeC = mix(iris, vec3f(.012, .012, .014), step(ed, .0080));
  alb = mix(alb, eyeC, eyeP);                                                     // the rim keeps the tone of the skin
  alb *= .92 + .16 * fract(sd * 13.7);
  // ---- light. The relief is in body lengths: times the length of the animal (about 1 m)
  let n = skinRelief(ns, i.wp, hgt * 1.0);
  let pup = eyeP * step(ed, .0080);
  let spec = .16 * hull + .10 * fins + .12 * crest + .35 * dentP + .40 * teethP + .55 * mouthP * mao + .10 * ringP;
  let shin = 14. + 26. * dentP + 30. * teethP + 60. * mouthP;
  let wet = .06 * hull + .30 * teethP + .08 * mouthP + 2.5 * eyeP;
  let c = stethLight(alb, n, ns, i.wp, spec, shin, wet, mix(1., mao, mouthP), mix(1., mao, mouthP));
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;

// ---------------------------------------------------------------- zoo
// A Stethacanthus: the same path and the same distance along it as vsStethacanthus (change one, change the other).
// Two lines from the middle. Nothing here allocates: it runs in every frame
const stethFr = (x) => x - floor(x);
// the point of its path at angle g, written to ZP at k (stethPath in the shader)
const stethZooPath = (a, i, g, k) => {
  const R = a[i + 3], ph = a[i + 7] * 17;
  ZP[k] = a[i] + R * cos(g) + 0.1 * R * cos(1.5 * g + ph);
  ZP[k + 1] = a[i + 1] + 1.0 * sin(2 * g + ph) + 0.4 * sin(3.5 * g + 2 * ph);
  ZP[k + 2] = a[i + 2] + R * sin(g) + 0.1 * R * sin(1.5 * g + 1.7 * ph);
};
const zooStethacanthus = (a, i, part) => {
  const s = a[i + 4], v = a[i + 5], v0 = abs(v), t = F[TIME], L = 0.9 * a[i + 3];
  const f1 = 0.031 + 0.02 * stethFr(s * 7.31), f2 = 0.083 + 0.03 * stethFr(s * 3.17);
  const d = v0 * (t + 0.30 / f1 * sin(f1 * t + 6.3 * stethFr(s * 5.13))
    + 0.15 / f2 * sin(f2 * t + 6.3 * stethFr(s * 9.71)));
  const g = (v < 0 ? -1 : 1) * d / L + a[i + 7] * 6.3 + s * 2.1;
  stethZooPath(a, i, g, 0); stethZooPath(a, i, g + (part * 2 - 1) * 4 / L, 3);
  ZP[3] -= ZP[0]; ZP[4] -= ZP[1]; ZP[5] -= ZP[2]; ZP[7] = 2.0;
};
