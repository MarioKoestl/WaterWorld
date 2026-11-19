// ============================================================================
// Reference geometry for Cladoselache, first version (brief: docs/briefs/cladoselache-build.md)
// ============================================================================
// Not loaded by the build. Take meshCladoselache() over into source/eras/devonian/swimmers_cladoselache.js.
// It needs Mesh (engine/math.js) and curve() (devonian/swimmers.js), nothing else. Built on the same frame as
// Titanichthys (one skin, a mouth cut into it, a throat, fins as wings); all numbers are its own.
// The mesh is one unit long, nose at +z, y up. s is the distance from the snout in body lengths: z = 0.5 - s.
//
// Sources (see the brief and docs/research/devonian/cladoselache.md): W (Wikipedia, "Cladoselache"), H1938 (Harris
// 1938, the dorsal spine), SK (the skeletal reconstruction "Cladoselache skeletal.png" on Wikimedia Commons, a
// composite of C. fyleri and C. kepleri, CC BY 4.0: measured from the side and from above, not copied), D1909 (Dean
// 1909, photographs of whole specimens: checked by eye that the pectoral fins sit where SK puts them).
//
// aux (what a vertex is; the shaders read it):
//    0     skin of the body
//    0.25  skin of the lower jaw: drops with the jaw
//    0.5   fins and the keels of the tail stalk
//    0.6   the fin spine (dentine and enamel)
//   -0.25  inside of the mouth and the throat, upper half (moves with the head)
//   -0.40  inside of the mouth and the throat, lower half (moves with the jaw)
//   -0.55  teeth of the upper jaw (move with the head)
//   -0.70  teeth of the lower jaw (move with the jaw)
//   -0.85  the ring of small plates around the eye
//   -1     eyes
function meshCladoselache() {
  const m = new Mesh();
  const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => { const l = hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const pos = (i) => [m.p[i * 3], m.p[i * 3 + 1], m.p[i * 3 + 2]];
  const band = (A, B, flip) => { for (let k = 0; k < A.length - 1; k++) flip ? m.quad(A[k], B[k], B[k + 1], A[k + 1]) : m.quad(A[k], A[k + 1], B[k + 1], B[k]); };

  // ---------------------------------------------------------------- the body: stations from snout to tail stalk
  // [s, back (y of the top), belly (y of the bottom), half width, roundness, height of the widest place]
  // Measured on SK from the side (back and belly) and from above (width). Slim like a mackerel shark (W): deepest 0.15
  // of the length at 0.30 to 0.35, about as wide as deep. The head low, flat and as wide as it is deep, with a short,
  // blunt snout and the mouth at the front (W). The tail stalk tapers to 0.03 deep and, with its keels, 0.09 wide:
  // "from above almost rectangular" (W). Roundness and the place of the widest point: estimates
  const ST = [
    [0.000, 0.008, -0.006, 0.016, 2.2, 0.45],
    [0.010, 0.020, -0.012, 0.034, 2.4, 0.45],
    [0.025, 0.028, -0.024, 0.045, 2.6, 0.45],
    [0.050, 0.036, -0.038, 0.053, 2.6, 0.45],
    [0.080, 0.046, -0.049, 0.057, 2.5, 0.46],
    [0.110, 0.054, -0.056, 0.062, 2.4, 0.47],
    [0.150, 0.063, -0.064, 0.066, 2.3, 0.48],
    [0.200, 0.072, -0.071, 0.070, 2.2, 0.49],
    [0.250, 0.077, -0.074, 0.072, 2.2, 0.50],
    [0.300, 0.078, -0.075, 0.072, 2.2, 0.50],
    [0.350, 0.078, -0.074, 0.071, 2.2, 0.50],
    [0.400, 0.077, -0.071, 0.070, 2.2, 0.50],
    [0.450, 0.074, -0.066, 0.068, 2.2, 0.50],
    [0.500, 0.071, -0.061, 0.064, 2.1, 0.50],
    [0.550, 0.067, -0.055, 0.060, 2.1, 0.50],
    [0.600, 0.061, -0.047, 0.055, 2.1, 0.50],
    [0.650, 0.053, -0.036, 0.050, 2.0, 0.50],
    [0.700, 0.045, -0.023, 0.044, 2.0, 0.50],
    [0.750, 0.037, -0.010, 0.036, 2.0, 0.50],
    [0.800, 0.032, -0.002, 0.028, 2.0, 0.50],
    [0.840, 0.031, 0.000, 0.024, 2.0, 0.50],
    [0.880, 0.033, 0.004, 0.015, 2.0, 0.50],
    [0.910, 0.038, 0.011, 0.006, 2.0, 0.50],
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
  // the mouth: at the front end, not under a snout (W). The jaws are long and reach back behind the eye (SK: the corner
  // at 0.135). The line of the closed mouth, from the side, slopes down towards the corner (SK)
  const S_C = 0.135;
  const mouthY = (s) => -0.004 - 0.034 * pow(clamp(s / S_C, 0, 1), 1.1);
  // five gill slits on each side (W), between 0.155 and 0.215 (SK), each a narrow groove from low on the flank to above
  // its middle (heights: estimate)
  const GS = [0.158, 0.172, 0.186, 0.200, 0.213];
  const gill = (s, y) => GS.reduce((a, g) => a + exp(-pow((s - g) / 0.0022, 2)), 0) * sm(-0.052, -0.040, y) * (1 - sm(0.018, 0.034, y));
  const skin = (s, a) => {
    const [T, B, W, n, q] = at(s), ym = B + (T - B) * q, c = cos(a), sn = sin(a);
    const x = W * (c < 0 ? -1 : 1) * pow(abs(c), 2 / n), y = sn >= 0 ? ym + (T - ym) * pow(sn, 2 / n) : ym - (ym - B) * pow(-sn, 2 / n);
    const k = 1 - 0.07 * gill(s, y) * sm(0.2, 0.6, abs(c));                      // the slits are grooves in the skin
    return [x * k, ym + (y - ym) * (1 - 0.3 * (1 - k)), 0.5 - s];
  };
  const angY = (s, y) => { let lo = -PI / 2, hi = PI / 2; for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; skin(s, mid)[1] < y ? lo = mid : hi = mid; } return (lo + hi) / 2; };
  const flank = (s, y, inset = 0) => { const p = skin(s, angY(s, y)); return [p[0] - inset, p[1], p[2]]; };

  // rings: every 0.004, every 0.002 over the gill slits, every 0.01 behind 0.40
  const MU = 36, ML = 26, MP = 12, RS = [], rings = [];
  for (let s = 0.004; s < 0.1505; s += 0.004) RS.push(+s.toFixed(4));
  for (let s = 0.152; s < 0.2225; s += 0.002) RS.push(+s.toFixed(4));
  for (let s = 0.226; s < 0.4005; s += 0.004) RS.push(+s.toFixed(4));
  for (let s = 0.41; s < 0.9105; s += 0.01) RS.push(+s.toFixed(4));
  const aC = angY(S_C, mouthY(S_C));
  // the lower jaw: as wide as the upper, its front a little behind the snout (SK)
  const jw = (s) => 1 - 0.10 * (1 - sm(0.004, 0.050, s)), jdrop = (s) => -0.003 * (1 - sm(0, 0.025, s));
  for (const s of RS) {
    const split = s < S_C, a0 = split ? angY(s, mouthY(s)) : aC, U = [], L = [], R = { s, split, a0, U, L };
    for (let k = 0; k <= MU; k++) U.push(m.v(...skin(s, a0 + (PI - 2 * a0) * k / MU), 0));
    for (let k = 0; k <= ML; k++) {
      if (!split && (k === 0 || k === ML)) { L.push(k ? U[0] : U[MU]); continue; }
      const q = skin(s, PI - a0 + (PI + 2 * a0) * k / ML);
      L.push(m.v(q[0] * jw(s), q[1] + jdrop(s), q[2], s < 0.160 ? 0.25 : 0));
    }
    if (split) {
      const [xr, ym] = pos(U[0]), xl = pos(L[ML])[0], [T, B] = at(s); R.pal = []; R.flo = [];
      for (let k = 0; k <= MP; k++) { const th = PI * k / MP; R.pal.push(m.v(xr * 0.97 * cos(th), ym + 0.45 * (T - ym) * pow(sin(th), 0.7), 0.5 - s, -0.25)); }
      for (let k = 0; k <= MP; k++) { const th = PI * k / MP; R.flo.push(m.v(-xl * 0.97 * cos(th), ym + jdrop(s) - 0.40 * (ym - B) * pow(sin(th), 0.7), 0.5 - s, -0.40)); }
    }
    rings.push(R);
  }
  // the cheeks: a short strip of skin from 0.105 to the corner of the mouth, coloured as the inside of the mouth
  for (const right of [true, false]) {
    const A = [], B = [];
    for (const R of rings) {
      if (!R.split || R.s < 0.105) continue;
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
    // the throat: from the corner of the mouth back past the gill slits (0.225), with five gill arches under them.
    // "The gill slits were separated by muscular flaps packed with fibrous overlapping gill filaments" (W); the shader
    // draws the filaments
    const C = rings[js];
    const xr = pos(C.pal[0])[0], ymc = pos(C.pal[0])[1], hu = pos(C.pal[MP / 2])[1] - ymc, hl = ymc - pos(C.flo[MP / 2])[1], sC = C.s, N = 22, S1 = 0.225;
    const arch = (s) => 1 - 0.14 * GS.reduce((a, g) => a + exp(-pow((s - g) / 0.0030, 2)), 0);
    const T = [C.pal.concat(C.flo)];
    for (let k = 1; k <= N; k++) {
      const u = k / N, s = sC + (S1 - sC) * u, yc = ymc + 0.012 * u, w = (xr + (0.045 - xr) * pow(u, 0.8)), a = arch(s);
      const up = (hu + (0.030 - hu) * u), lo = (hl + (0.028 - hl) * u) * a, ring = [];
      for (let j = 0; j <= MP; j++) { const th = PI * j / MP; ring.push(m.v(w * a * cos(th), yc + up * pow(sin(th), 0.8), 0.5 - s, -0.25)); }
      for (let j = 0; j <= MP; j++) { const th = PI * j / MP; ring.push(m.v(-w * a * cos(th), yc - lo * pow(sin(th), 0.8), 0.5 - s, -0.40)); }
      T.push(ring);
    }
    const a0 = pos(T[1][MP / 2]), f0 = crs(sub(pos(T[1][MP / 2 + 1]), a0), sub(pos(T[2][MP / 2]), a0)), fl = f0[1] > 0;
    const n2 = 2 * (MP + 1);
    for (let k = 0; k < N; k++) for (let e = 0; e < n2; e++) {
      const e2 = (e + 1) % n2; fl ? m.quad(T[k][e], T[k + 1][e], T[k + 1][e2], T[k][e2]) : m.quad(T[k][e], T[k][e2], T[k + 1][e2], T[k + 1][e]);
    }
    const E = T[N], ce = m.v(0, ymc + 0.012, 0.5 - S1 - 0.004, -0.25);
    for (let e = 0; e < n2; e++) { const e2 = (e + 1) % n2; fl ? m.tri(E[e], ce, E[e2]) : m.tri(E[e], E[e2], ce); }
    const D = rings[js + 1];
    m.tri(C.U[0], C.L[ML], D.U[0]); m.tri(C.L[0], C.U[MU], D.U[MU]);
    const Z = rings[rings.length - 1], [TT, BB] = at(Z.s), pe = m.v(0, (TT + BB) / 2, 0.5 - Z.s - 0.004, 0);
    for (let k = 0; k < MU; k++) m.tri(pe, Z.U[k + 1], Z.U[k]);
    for (let k = 0; k < ML; k++) m.tri(pe, Z.L[k + 1], Z.L[k]);
  }

  // ---------------------------------------------------------------- teeth
  // "Slender and smooth-edged, suitable for grasping" (W), of the cladodont kind that gave the genus its name: a tall
  // middle cusp with smaller cusps beside it. One row in each jaw from the front to 0.125, smaller towards the back.
  // Height of the middle cusp 0.005 in front, about a centimetre in a fish of 1.8 m (estimate). They stand just inside
  // the lips, upper ones pointing down, lower ones up, both leaning a little inward
  const cone = (base, dir, side, r, h, aux) => {
    const t2 = nrm(crs(dir, side)), V = [];
    for (let e = 0; e < 4; e++) { const w = e / 4 * TAU + PI / 4; V.push(m.v(base[0] + (side[0] * cos(w) + t2[0] * sin(w) * 0.6) * r, base[1] + (side[1] * cos(w) + t2[1] * sin(w) * 0.6) * r, base[2] + (side[2] * cos(w) + t2[2] * sin(w) * 0.6) * r, aux)); }
    const tip = m.v(base[0] + dir[0] * h, base[1] + dir[1] * h, base[2] + dir[2] * h, aux), c = [base[0] + dir[0] * h * 0.3, base[1] + dir[1] * h * 0.3, base[2] + dir[2] * h * 0.3];
    for (let e = 0; e < 4; e++) {
      const e2 = (e + 1) % 4, A = pos(V[e]), B = pos(V[e2]), n = crs(sub(B, A), sub(pos(tip), A));
      dot(n, sub(A, c)) > 0 ? m.tri(V[e], V[e2], tip) : m.tri(V[e2], V[e], tip);
    }
  };
  for (const R of rings) {
    if (!R.split || R.s < 0.006 || R.s > 0.126) continue;
    const k = round(R.s / 0.004); if (k % 2) continue;                                    // one tooth every 0.008
    const f = 1 - 0.45 * sm(0.02, 0.125, R.s), h = 0.0052 * f, r = 0.0010 * f;
    for (const [up, idx] of [[true, 0], [true, MP], [false, 0], [false, MP]]) {
      const P = pos(up ? R.pal[idx] : R.flo[idx]), sx = P[0] > 0 ? 1 : -1, inw = -sx * 0.25;
      const base = [P[0] - sx * 0.0032, P[1] + (up ? 0.0006 : -0.0006), P[2]], dir = nrm([inw, up ? -1 : 1, 0]), side = [0, 0, 1];
      const aux = up ? -0.55 : -0.70;
      cone(base, dir, side, r, h, aux);
      for (const o of [-1, 1]) cone([base[0], base[1], base[2] + o * 0.0019 * f], nrm([inw, up ? -1 : 1, o * 0.25]), side, r * 0.7, h * 0.45, aux);
    }
  }

  // ---------------------------------------------------------------- the eyes
  // Large and far forward, each with a ring of more than 20 small plates (W). SK: the ring 0.032 across, centred at
  // 0.070, a little above the line of the mouth. A dome in a ring of 22 small raised plates
  const EYE_S = 0.070, EYE_Y = 0.012, ER = 0.011;
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
      const b = q / 44 * TAU, bump = 0.55 + 0.45 * abs(cos(b * 11)), row = [];
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
  // pectoral fins: "large, long, with a wide base, three-cornered, right behind the gills" (W). SK from above: the base
  // from 0.24 to 0.335 low on the flank, the tip 0.20 from the middle line at 0.305; from the side the tip 0.09 below the
  // middle: out and about 20 degrees down
  {
    const r0 = flank(0.238, -0.044, 0.010), r1 = flank(0.335, -0.050, 0.010);
    const LE = [r0, V(0.248, 0.105, -0.057), V(0.262, 0.150, -0.071), V(0.282, 0.183, -0.082), V(0.303, 0.200, -0.089)];
    const TE = [r1, V(0.342, 0.105, -0.062), V(0.337, 0.148, -0.075), V(0.324, 0.182, -0.085), V(0.306, 0.199, -0.089)];
    const th = (t) => 0.008 * pow(1 - t, 0.8) + 0.0012;
    wing(LE, TE, th, 0.5, 14); wing(mir(LE), mir(TE), th, 0.5, 14);
  }
  // pelvic fins: "small and low, about three times as long as high, far back on the belly" (W). SK: 0.565 to 0.64
  {
    const r0 = flank(0.562, bot(0.562) + 0.010, 0.006), r1 = flank(0.640, bot(0.640) + 0.008, 0.006);
    const LE = [r0, V(0.585, r0[0] + 0.012, bot(0.585) - 0.006), V(0.612, r0[0] + 0.022, bot(0.612) - 0.016), V(0.628, r0[0] + 0.028, bot(0.628) - 0.022)];
    const TE = [r1, V(0.643, r0[0] + 0.012, bot(0.643) - 0.006), V(0.640, r0[0] + 0.022, bot(0.640) - 0.016), V(0.632, r0[0] + 0.028, bot(0.632) - 0.022)];
    const th = (t) => 0.004 * (1 - t) + 0.0010;
    wing(LE, TE, th, 0.5, 10); wing(mir(LE), mir(TE), th, 0.5, 10);
  }
  // first dorsal fin: "clearly the larger" (W), over the pectoral fins. SK: base 0.285 to 0.385, 0.075 high, its
  // apex at 0.355, the rear edge falling steeply to a short free tip
  wing([V(0.284, 0, top(0.284) - 0.010), V(0.298, 0, top(0.298) + 0.018), V(0.318, 0, top(0.318) + 0.044), V(0.338, 0, top(0.338) + 0.062), V(0.352, 0, top(0.352) + 0.072), V(0.357, 0, top(0.357) + 0.074)],
    [V(0.386, 0, top(0.386) - 0.010), V(0.384, 0, top(0.384) + 0.010), V(0.377, 0, top(0.377) + 0.032), V(0.369, 0, top(0.369) + 0.052), V(0.362, 0, top(0.362) + 0.068), V(0.358, 0, top(0.358) + 0.073)],
    (t) => 0.006 * pow(1 - t, 0.6) + 0.0010, 0.5, 14);
  // second dorsal fin: over the pelvic fins (W), small and rounded. SK: 0.578 to 0.66, about 0.02 high
  wing([V(0.578, 0, top(0.578) - 0.006), V(0.592, 0, top(0.592) + 0.010), V(0.610, 0, top(0.610) + 0.018), V(0.628, 0, top(0.628) + 0.020)],
    [V(0.662, 0, top(0.662) - 0.006), V(0.664, 0, top(0.664) + 0.004), V(0.650, 0, top(0.650) + 0.014), V(0.632, 0, top(0.632) + 0.020)],
    (t) => 0.0035 * pow(1 - t, 0.6) + 0.0008, 0.5, 10);
  // tail fin: "a tall crescent on a narrow base" (W), the lobes nearly equal (SK: upper tip at 1.0 and 0.17 above the
  // middle, lower tip at 0.973 and 0.10 below it, the notch at 0.913)
  const thT = (t) => 0.007 * pow(1 - t, 0.6) + 0.0012;
  wing([V(0.836, 0, 0.026), V(0.865, 0, 0.056), V(0.900, 0, 0.098), V(0.950, 0, 0.145), V(0.985, 0, 0.165), V(1.000, 0, 0.170)],
    [V(0.905, 0, 0.012), V(0.925, 0, 0.040), V(0.942, 0, 0.068), V(0.962, 0, 0.100), V(0.985, 0, 0.140), V(0.999, 0, 0.167)], thT, 0.5, 18);
  wing([V(0.832, 0, 0.006), V(0.858, 0, -0.016), V(0.884, 0, -0.044), V(0.915, 0, -0.072), V(0.948, 0, -0.092), V(0.973, 0, -0.103)],
    [V(0.905, 0, 0.016), V(0.918, 0, -0.008), V(0.932, 0, -0.034), V(0.948, 0, -0.058), V(0.963, 0, -0.082), V(0.972, 0, -0.100)], thT, 0.5, 18);
  // the keels of the tail stalk (W: "a keel on each side"). SK from above: 0.78 to 0.89, 0.016 out from the flank
  {
    const yc = (s) => (top(s) + bot(s)) / 2, X = (s) => at(s)[2];
    const ks = [0.775, 0.800, 0.830, 0.860, 0.885], out = [0.000, 0.010, 0.016, 0.012, 0.000];
    const LE = ks.map((s, k) => V(s, X(s) - 0.006, yc(s) + 0.006 - 0.004 * out[k] / 0.016));
    const TE = ks.map((s, k) => V(s, X(s) - 0.006 + out[k] + 0.006, yc(s)));
    const th = (t) => 0.0030;
    const LE2 = ks.map((s) => V(s, X(s) - 0.006, yc(s) - 0.006));
    wing(LE, TE, th, 0.5, 10); wing(mir(LE), mir(TE), th, 0.5, 10);
    wing(LE2, TE, th, 0.5, 10); wing(mir(LE2), mir(TE), th, 0.5, 10);
  }

  // ---------------------------------------------------------------- the fin spine
  // One, in front of the first dorsal fin: "stout and curved back", in a fish of over 2 m about 8 cm high and almost as
  // long, 8 mm thick, "almost perpendicular to the body surface", sitting on the skin with no buried root (H1938). Its
  // front edge just ahead of the front edge of the pectoral fins (H1938); SK: from 0.225 to 0.285, 0.045 high. A blade,
  // flat from the sides, its base long, its tip bent back
  {
    const N = 16, Vr = [], mid = [];
    const P = (t) => { const s = 0.252 + 0.030 * pow(t, 1.6), y = top(0.252 + 0.030 * pow(t, 1.6)) - 0.003 + 0.048 * sin(t * PI / 2); return [s, y]; };
    for (let k = 0; k <= N; k++) {
      const t = k / N, [s, y] = P(t), hl = 0.022 * pow(1 - t, 1.2) + 0.0016, hw = 0.0022 * (1 - 0.6 * t) + 0.0005, ring = [];
      for (let e = 0; e < 10; e++) { const w = e / 10 * TAU; ring.push(m.v(sin(w) * hw, y, 0.5 - s + cos(w) * hl * (cos(w) > 0 ? 0.8 : 1.2), 0.6)); }
      Vr.push(ring); mid.push([0, y, 0.5 - s]);
    }
    const tubeFaces = (VV, md) => {
      const a0 = pos(VV[0][0]), f0 = crs(sub(pos(VV[1][0]), a0), sub(pos(VV[0][1]), a0)), fl = dot(f0, sub(a0, md[0])) < 0;
      for (let k = 0; k < VV.length - 1; k++) for (let e = 0; e < VV[k].length; e++) {
        const e2 = (e + 1) % VV[k].length; fl ? m.quad(VV[k][e], VV[k][e2], VV[k + 1][e2], VV[k + 1][e]) : m.quad(VV[k][e], VV[k + 1][e], VV[k + 1][e2], VV[k][e2]);
      }
      const ring = VV[VV.length - 1].map(pos), c = ring.reduce((a, p) => [a[0] + p[0] / ring.length, a[1] + p[1] / ring.length, a[2] + p[2] / ring.length], [0, 0, 0]);
      const tip = m.v(c[0], c[1] + 0.001, c[2] - 0.001, 0.6), last = VV[VV.length - 1];
      for (let e = 0; e < last.length; e++) { const e2 = (e + 1) % last.length; fl ? m.tri(last[e], last[e2], tip) : m.tri(last[e2], last[e], tip); }
    };
    tubeFaces(Vr, mid);
  }
  return m;
}
