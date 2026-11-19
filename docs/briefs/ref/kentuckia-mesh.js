// ============================================================================
// Reference geometry for Kentuckia (brief: docs/briefs/kentuckia-build.md)
// ============================================================================
// Not loaded by the build. Take meshKentuckia() over into source/eras/devonian/swimmers_kentuckia.js. It needs Mesh
// (engine/math.js) and curve() (devonian/swimmers.js), nothing else.
// The mesh is one unit long, nose at +z, y up. s is the distance from the snout in body lengths: z = 0.5 - s.
//
// "Kentuckia" hlavini of the Cleveland Shale is known from a few specimens, mostly from heads, jaws and scales; no
// outline of its body is published online (Dunkle 1964 not seen). So this is an early ray-finned fish of the Late
// Devonian in general, and every number of the body is a measurement of a relative or an estimate:
//   - the outline (depth 0.22, tail stalk 0.08, the scaled upper lobe ending 0.13 above the middle line) measured on a
//     photograph of Moythomasia nitida (Wikimedia Commons, "Moythomasia nitida Ob Devon Bergisch Gladbach D Ch932.jpg",
//     Oilshale, CC BY-SA 4.0); M. durgaringa of Gogo (Trinajstic and others 2022, Fig. 5b) is deeper, about 0.30;
//   - one dorsal fin far back, the anal fin under and behind it, pelvic fins in the middle of the belly, pectoral fins
//     low behind the gill cover, a heterocercal tail whose upper lobe carries the scaled end of the body: as in these
//     fishes in general (estimate of the places and sizes);
//   - the long lower jaw (Igielman and others 2026: CMNH 9562, 24 mm, about a fifth as deep as long) reaches back below
//     the eye; the large eye far forward.
// The width (half the depth) is an estimate. The mouth is shut and stays shut: at 10 cm it would not show.
//
// aux (what a vertex is; the shader reads it):
//    0     skin of the body and the head in ONE piece: scales, plates of the head, mouth, gill cover are the shader's
//    0.30  pectoral fins        0.35  pelvic fins       0.40  anal fin       0.50  dorsal fin       0.80  tail fin
//   -1     eyes
function meshKentuckia() {
  const m = new Mesh();
  const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => { const l = hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const pos = (i) => [m.p[i * 3], m.p[i * 3 + 1], m.p[i * 3 + 2]];
  const band = (A, B, flip) => { for (let k = 0; k < A.length - 1; k++) flip ? m.quad(A[k], B[k], B[k + 1], A[k + 1]) : m.quad(A[k], A[k + 1], B[k + 1], B[k]); };

  // ---------------------------------------------------------------- the body: stations from snout to the tip of the tail
  // [s, back (y of the top), belly (y of the bottom), half width, roundness]. Measured on M. nitida (see above): deepest
  // 0.22 from 0.25 to 0.35, the tail stalk 0.08 deep at 0.70, then the scaled axis rises into the upper lobe and ends at
  // 1.0, 0.13 above the middle line. Rounded blunt snout above the mouth
  const ST = [
    [0.000, 0.004, -0.012, 0.006, 2.0],
    [0.010, 0.020, -0.024, 0.017, 2.1],
    [0.030, 0.036, -0.040, 0.027, 2.2],
    [0.060, 0.054, -0.058, 0.036, 2.2],
    [0.100, 0.072, -0.076, 0.044, 2.2],
    [0.150, 0.088, -0.092, 0.050, 2.2],
    [0.200, 0.100, -0.104, 0.054, 2.2],
    [0.250, 0.108, -0.111, 0.055, 2.2],
    [0.300, 0.110, -0.112, 0.054, 2.2],
    [0.350, 0.109, -0.110, 0.052, 2.2],
    [0.400, 0.105, -0.104, 0.049, 2.2],
    [0.450, 0.099, -0.094, 0.045, 2.2],
    [0.500, 0.091, -0.082, 0.040, 2.2],
    [0.550, 0.082, -0.068, 0.035, 2.2],
    [0.600, 0.072, -0.054, 0.029, 2.2],
    [0.650, 0.062, -0.040, 0.023, 2.1],
    [0.700, 0.055, -0.027, 0.018, 2.0],
    [0.750, 0.055, -0.013, 0.013, 2.0],
    [0.800, 0.063, 0.006, 0.009, 2.0],
    [0.850, 0.077, 0.032, 0.0065, 2.0],
    [0.900, 0.094, 0.063, 0.0045, 2.0],
    [0.950, 0.111, 0.094, 0.0030, 2.0],
    [0.990, 0.126, 0.118, 0.0015, 2.0],
  ];
  const at = (s) => {
    let i = 0; while (i < ST.length - 2 && ST[i + 1][0] <= s) i++;
    const a = ST[max(i - 1, 0)], b = ST[i], c = ST[i + 1], d = ST[min(i + 2, ST.length - 1)], h = c[0] - b[0], u = clamp((s - b[0]) / h, 0, 1), o = [];
    for (let q = 1; q < 5; q++) {
      const m1 = (c[q] - a[q]) / (c[0] - a[0]) * h, m2 = (d[q] - b[q]) / (d[0] - b[0]) * h;
      o.push((2 * u * u * u - 3 * u * u + 1) * b[q] + (u * u * u - 2 * u * u + u) * m1 + (3 * u * u - 2 * u * u * u) * c[q] + (u * u * u - u * u) * m2);
    }
    return o;
  };
  // a point on the skin: s along the body, a around it (0 the right flank, PI / 2 the back). The widest place halfway up
  const skin = (s, a) => {
    const [T, B, W, n] = at(s), ym = (T + B) / 2, c = cos(a), sn = sin(a);
    const x = W * (c < 0 ? -1 : 1) * pow(abs(c), 2 / n), y = ym + (sn >= 0 ? 1 : -1) * (T - ym) * pow(abs(sn), 2 / n);
    return [x, y, 0.5 - s];
  };
  const angY = (s, y) => { let lo = -PI / 2, hi = PI / 2; for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; skin(s, mid)[1] < y ? lo = mid : hi = mid; } return (lo + hi) / 2; };
  const flank = (s, y, inset = 0) => { const p = skin(s, angY(s, y)); return [p[0] - inset, p[1], p[2]]; };

  // rings of 20 points: every 0.01 over the head, every 0.02 behind it, every 0.025 on the tail
  const NA = 20, RS = [], rings = [];
  for (let s = 0.004; s < 0.2005; s += 0.008) RS.push(+s.toFixed(4));
  for (let s = 0.22; s < 0.7005; s += 0.02) RS.push(+s.toFixed(4));
  for (let s = 0.725; s < 0.9905; s += 0.025) RS.push(+s.toFixed(4));
  if (RS[RS.length - 1] < 0.99) RS.push(0.99);
  for (const s of RS) { const R = []; for (let k = 0; k < NA; k++) R.push(m.v(...skin(s, -PI / 2 + TAU * k / NA), 0)); rings.push(R); }
  // faces between the rings, outwards; both ends closed with a point
  const a0 = pos(rings[0][0]), f0 = crs(sub(pos(rings[1][0]), a0), sub(pos(rings[0][1]), a0)), fl = f0[1] > 0;
  for (let j = 0; j < rings.length - 1; j++) for (let k = 0; k < NA; k++) {
    const k2 = (k + 1) % NA, A = rings[j], B = rings[j + 1];
    fl ? m.quad(A[k], A[k2], B[k2], B[k]) : m.quad(A[k], B[k], B[k2], A[k2]);
  }
  {
    const [T0, B0] = at(0), nose = m.v(0, (T0 + B0) / 2, 0.5, 0), Z = rings[rings.length - 1], [T1, B1] = at(0.999), tip = m.v(0, (T1 + B1) / 2, 0.5 - 0.999, 0);
    for (let k = 0; k < NA; k++) { const k2 = (k + 1) % NA; fl ? m.tri(nose, rings[0][k2], rings[0][k]) : m.tri(nose, rings[0][k], rings[0][k2]); }
    for (let k = 0; k < NA; k++) { const k2 = (k + 1) % NA; fl ? m.tri(tip, Z[k], Z[k2]) : m.tri(tip, Z[k2], Z[k]); }
  }

  // ---------------------------------------------------------------- the eyes
  // Large and far forward, as in these fishes (estimate): 0.045 across, centred at 0.075, 0.020 above the middle line.
  // A low dome; the shader draws the iris and the pupil
  const EYE_S = 0.075, EYE_Y = 0.020, ER = 0.0225;
  for (const sx of [1, -1]) {
    const a = angY(EYE_S, EYE_Y), c = skin(EYE_S, a), e = 1e-3;
    const t1 = nrm(sub(skin(EYE_S + e, a), skin(EYE_S - e, a))), n0 = nrm(crs(sub(skin(EYE_S, a + e), skin(EYE_S, a - e)), t1)), n = n0[0] < 0 ? n0.map((v) => -v) : n0, t2 = crs(n, t1), rows = [];
    for (let k = 1; k <= 4; k++) {
      const la = k / 4 * PI / 2, row = [];
      for (let q = 0; q <= 18; q++) { const b = q / 18 * TAU, r = ER * sin(la), h = 0.0060 * cos(la) - 0.0015; row.push(m.v(sx * (c[0] + t1[0] * r * cos(b) + t2[0] * r * sin(b) + n[0] * h), c[1] + t1[1] * r * cos(b) + t2[1] * r * sin(b) + n[1] * h, c[2] + t1[2] * r * cos(b) + t2[2] * r * sin(b) + n[2] * h, -1)); }
      rows.push(row);
    }
    const top = m.v(sx * (c[0] + n[0] * 0.0045), c[1] + n[1] * 0.0045, c[2] + n[2] * 0.0045, -1);
    for (let q = 0; q < 18; q++) sx > 0 ? m.tri(top, rows[0][q + 1], rows[0][q]) : m.tri(top, rows[0][q], rows[0][q + 1]);
    for (let k = 0; k < 3; k++) band(rows[k], rows[k + 1], sx > 0);
  }

  // ---------------------------------------------------------------- fins
  // A fin is a wing: front edge LE and rear edge TE as points from root to tip, a section like a wing between them.
  // th(t) is half its thickness. The root lies inside the body
  const wing = (LE, TE, th, aux, N = 6) => {
    const le = curve(LE, N), te = curve(TE, N), C = [0, 0.15, 0.5, 1], rs = []; let n = null;
    for (let k = 0; k <= N; k++) {
      const a = le[k], c = sub(te[k], a), sp = sub(le[min(k + 1, N)], le[max(k - 1, 0)]); let nn = nrm(crs(c, sp));
      if (hypot(c[0], c[1], c[2]) < 1e-4 || (n && dot(nn, n) < 0.5)) nn = n; n = nn;
      const h = th(k / N), ring = [], P = (q, sg) => { const f = sg * h * 2.598 * sqrt(C[q]) * (1 - C[q]); return m.v(a[0] + c[0] * C[q] + n[0] * f, a[1] + c[1] * C[q] + n[1] * f, a[2] + c[2] * C[q] + n[2] * f, aux); };
      for (let q = 0; q < 4; q++) ring.push(P(q, 1));
      for (let q = 2; q > 0; q--) ring.push(P(q, -1));
      rs.push(ring);
    }
    const q0 = pos(rs[0][1]), fn = crs(sub(pos(rs[0][2]), q0), sub(pos(rs[1][1]), q0)), n1 = nrm(crs(sub(te[0], le[0]), sub(le[1], le[0]))), flip = dot(fn, n1) < 0;
    for (let k = 0; k < N; k++) for (let e = 0; e < 6; e++) { const e2 = (e + 1) % 6; flip ? m.quad(rs[k][e], rs[k + 1][e], rs[k + 1][e2], rs[k][e2]) : m.quad(rs[k][e], rs[k][e2], rs[k + 1][e2], rs[k + 1][e]); }
  };
  const V = (s, x, y) => [x, y, 0.5 - s], mir = (P) => P.map((p) => [-p[0], p[1], p[2]]);
  const top = (s) => at(s)[0], bot = (s) => at(s)[1];
  const thin = (r) => (t) => r * (1 - 0.8 * t) + 0.0006;
  // pectoral fins: low behind the gill cover, base 0.225 to 0.255, pointing back, out and down; 0.10 long
  {
    const r0 = flank(0.225, -0.070, 0.004), r1 = flank(0.255, -0.080, 0.004), x0 = r0[0];
    const LE = [r0, V(0.250, x0 + 0.018, -0.098), V(0.285, x0 + 0.034, -0.122), V(0.315, x0 + 0.042, -0.136)];
    const TE = [r1, V(0.282, x0 + 0.016, -0.100), V(0.305, x0 + 0.030, -0.120), V(0.318, x0 + 0.041, -0.135)];
    wing(LE, TE, thin(0.004), 0.30); wing(mir(LE), mir(TE), thin(0.004), 0.30);
  }
  // pelvic fins: in the middle of the belly, base 0.44 to 0.49, small
  {
    const r0 = flank(0.440, bot(0.440) + 0.008, 0.003), r1 = flank(0.490, bot(0.490) + 0.006, 0.003), x0 = r0[0];
    const LE = [r0, V(0.470, x0 + 0.008, bot(0.470) - 0.018), V(0.505, x0 + 0.014, bot(0.505) - 0.034)];
    const TE = [r1, V(0.505, x0 + 0.008, bot(0.505) - 0.014), V(0.510, x0 + 0.013, bot(0.510) - 0.032)];
    wing(LE, TE, thin(0.003), 0.35, 4); wing(mir(LE), mir(TE), thin(0.003), 0.35, 4);
  }
  // the dorsal fin: one, far back, base 0.55 to 0.66, 0.09 high, three-cornered with a long front edge
  wing([V(0.545, 0, top(0.545) - 0.006), V(0.575, 0, top(0.575) + 0.035), V(0.605, 0, top(0.605) + 0.065), V(0.625, 0, top(0.625) + 0.085)],
    [V(0.665, 0, top(0.665) - 0.005), V(0.660, 0, top(0.660) + 0.020), V(0.645, 0, top(0.645) + 0.055), V(0.628, 0, top(0.628) + 0.083)],
    thin(0.004), 0.50);
  // the anal fin: under and a little behind the dorsal, base 0.62 to 0.72, 0.07 deep
  wing([V(0.615, 0, bot(0.615) + 0.006), V(0.645, 0, bot(0.645) - 0.028), V(0.675, 0, bot(0.675) - 0.052), V(0.695, 0, bot(0.695) - 0.068)],
    [V(0.725, 0, bot(0.725) + 0.004), V(0.722, 0, bot(0.722) - 0.016), V(0.712, 0, bot(0.712) - 0.042), V(0.698, 0, bot(0.698) - 0.066)],
    thin(0.0035), 0.40);
  // the tail fin: the web under the scaled upper lobe. Its front edge starts under the stalk at 0.74 and runs to the tip
  // of the lower lobe at 0.88, 0.10 below the middle line; its rear edge runs from there up to the tip of the axis, so the
  // tail is forked and the upper lobe the longer one (heterocercal)
  wing([V(0.740, 0, bot(0.740) + 0.005), V(0.790, 0, -0.040), V(0.840, 0, -0.078), V(0.880, 0, -0.100)],
    [V(0.985, 0, bot(0.985) + 0.003), V(0.950, 0, 0.040), V(0.915, 0, -0.035), V(0.884, 0, -0.098)],
    thin(0.0035), 0.80, 8);
  return m;
}
