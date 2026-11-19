// ============================================================================
// Reference geometry for Concavicaris (brief: docs/briefs/concavicaris-build.md)
// ============================================================================
// Not loaded by the build. Take meshConcavicaris() over into source/eras/devonian/swimmers_concavicaris.js. It needs
// Mesh (engine/math.js) and curve() (devonian/swimmers.js), nothing else.
// The mesh is one unit long (the shell), front at +z, y up. s is the distance from the front tip of the shell in shell
// lengths: z = 0.5 - s.
//
// Source: JHK2020, Jobbins, Haug and Klug 2020, "First African thylacocephalans from the Famennian of Morocco and their
// role in Late Devonian food webs", Scientific Reports 10:5129 (open access; its figures on Wikimedia Commons, CC BY
// 4.0). Concavicaris submarinus, of the same age as the Cleveland Shale, not the species from Ohio.
//   - the outline from the side measured on Fig. 2d, the 3D reconstruction of the holotype from a scan: highest 0.44 of
//     the length in the middle (the text: 56 mm long, 26 mm high), the front tip a point, the rear end cut off and
//     rounded; the width from Fig. 2: about a quarter of the length (text: 15 mm);
//   - two valves folded over the body, joined along the back, open below; the eyes large, under the front tip, in the
//     notch of the shell; eight pairs of small paddles at the lower rear end (Fig. 2, the text);
//   - three pairs of arms for catching: not kept in this species; drawn of middle size in Fig. 5. Here the same.
// The body inside the shell, the arms and the paddles: shape estimated after Fig. 2 and Fig. 5.
//
// aux (what a vertex is; the shader reads it):
//    0     the shell (both valves; the shader tells outside from inside)
//    0.10  the thin edge of the shell, where outside and inside meet
//    0.2   the body inside the shell        0.25  the gills under it
//    0.6 - 0.016 j   the arms for catching, j = 1 at a joint between two of their pieces, 0 between the joints
//    0.80 + 0.0236 k   the paddle k of each side, k = 0 (front) to 7 (rear): the vertex shader beats each one in turn
//   -1     eyes
function meshConcavicaris() {
  const m = new Mesh();
  const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => { const l = hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const pos = (i) => [m.p[i * 3], m.p[i * 3 + 1], m.p[i * 3 + 2]];
  const lerpT = (T, s) => { const f = clamp(s * 20, 0, 19.999), k = floor(f), u = f - k; return T[k] + (T[k + 1] - T[k]) * u; };

  // ---------------------------------------------------------------- the shell
  // Every 0.05 from the front tip, measured on Fig. 2d: the back (the hinge) and the lower edge of the valves, above
  // and below the middle line. Under the front tip the lower edge rises steeply: the notch in which the eye sits
  const TOP = [0.107, 0.156, 0.185, 0.198, 0.208, 0.214, 0.218, 0.220, 0.222, 0.221, 0.220, 0.218, 0.216, 0.211, 0.204, 0.194,
    0.181, 0.165, 0.146, 0.123, 0.097];
  const LOW = [-0.090, -0.150, -0.168, -0.178, -0.185, -0.197, -0.208, -0.215, -0.220, -0.223, -0.224, -0.218, -0.208, -0.198,
    -0.185, -0.168, -0.150, -0.131, -0.111, -0.088, -0.068];
  // half the width, from Fig. 2: widest 0.125 at a third, narrower at both ends; 0 at the front tip
  const WID = (s) => (0.060 + 0.065 * sm(0.0, 0.25, s) - 0.060 * sm(0.45, 1.0, s)) * pow(sm(0.0, 0.06, s), 0.5);
  const top = (s) => lerpT(TOP, s), edge = (s) => { const b = lerpT(LOW, s); return top(s) - (top(s) - b) * sm(0.015, 0.105, s); };
  // a point of the right valve: s along it, t from the back (0) to its lower edge (1). In section a pointed arch: the
  // valve rises steeply from the hinge, bulges out and turns in a little toward its edge
  const valve = (s, t) => {
    const T = top(s), B = edge(s), W = WID(s);
    const x = W * (t < 0.6 ? pow(sin(PI / 2 * t / 0.6), 0.7) : 1 - 0.22 * pow((t - 0.6) / 0.4, 2));
    return [x, T - (T - B) * t, 0.5 - s];
  };
  // Each valve has a thickness (0.006 L, an estimate) and a raised rim along its lower edge (JHK2020, Fig. 1b: the
  // ventral curve drawn as a double line). One surface, seen from outside and inside (the shader darkens the inside);
  // along its open edges a strip turned in by the thickness, so the edge shows as solid. The rows crowd toward the
  // lower edge, where the rim and the groove are
  const NS = 26, NT = 10, TH = 0.006;
  const tj = (j) => 1 - pow(1 - j / NT, 1.5);
  const out2 = (s, t) => {                                   // the outside, with the rim, and its normal in the section
    const p = valve(s, t), q = valve(s, min(t + 0.01, 1)), r = valve(s, max(t - 0.01, 0));
    let nx = -(q[1] - r[1]), ny = q[0] - r[0]; const l = hypot(nx, ny) || 1; nx /= l; ny /= l;
    if (nx < 0) { nx = -nx; ny = -ny; }
    const rim = 0.004 * exp(-pow((t - 0.965) / 0.025, 2)) * sm(0.06, 0.16, s);
    return [p[0] + nx * rim, p[1] + ny * rim, p[2], nx, ny];
  };
  for (const sx of [1, -1]) {
    const O = [], I = [];
    for (let i = 0; i <= NS; i++) {
      const s = pow(i / NS, 1.25), ro = [], ri = [], th = TH * sm(0.0, 0.04, s);
      for (let j = 0; j <= NT; j++) {
        const [x, y, z, nx, ny] = out2(s, tj(j));
        ro.push(m.v(sx * x, y, z, 0)); ri.push([sx * max(x - nx * th, 0), y - ny * th, z]);
      }
      O.push(ro); I.push(ri);
    }
    for (let i = 0; i < NS; i++) band(O[i], O[i + 1], sx > 0);
    // the edge: along the lower edge (j = NT), the rear edge (i = NS) and the front edge (i = 0)
    const E1 = [], E2 = [];
    for (let i = 0; i <= NS; i++) { E1.push(pos(O[i][NT])); E2.push(I[i][NT]); }
    const rimStrip = (A, B, flip) => {
      const a = A.map((p) => m.v(p[0], p[1], p[2], 0.10)), b = B.map((p) => m.v(p[0], p[1], p[2], 0.10));
      band(a, b, flip);
    };
    rimStrip(E1, E2, sx < 0);
    rimStrip(O[NS].map(pos), I[NS], sx > 0);
    rimStrip(O[0].map(pos), I[0], sx < 0);
  }
  function band(A, B, flip) { for (let k = 0; k < A.length - 1; k++) flip ? m.quad(A[k], B[k], B[k + 1], A[k + 1]) : m.quad(A[k], A[k + 1], B[k + 1], B[k]); }

  // ---------------------------------------------------------------- the body inside
  // A soft body under the hinge, from behind the eyes to a little past the rear edge of the shell (Fig. 2 and Fig. 4,
  // purple: it fills most of the shell), lower than the shell; ringed in segments behind the middle (estimate). Under
  // it on each side six leaf-shaped gills (JHK2020: gills leaf-shaped, inside)
  {
    const N = 18, K = 10, R = [];
    for (let i = 0; i <= N; i++) {
      const s = 0.07 + 0.95 * i / N, seg = 1 - 0.06 * pow(abs(sin(PI * (s - 0.50) / 0.055)), 8) * sm(0.48, 0.55, s);
      const f = pow(sin(PI * clamp((s - 0.05) / 0.99, 0, 1)), 0.5) * (1 - 0.35 * sm(0.6, 1.0, s)) * seg;
      const yc = (top(min(s, 1)) * 0.55 + edge(min(s, 1)) * 0.45) - 0.035;
      const ry = 0.12 * pow(f, 0.6) + 0.004, rx = 0.062 * pow(f, 0.6) + 0.003, ring = [];
      for (let k = 0; k < K; k++) { const a = TAU * k / K; ring.push(m.v(rx * cos(a), yc + ry * sin(a), 0.5 - s, 0.2)); }
      R.push(ring);
    }
    const a0 = pos(R[1][0]), f0 = crs(sub(pos(R[2][0]), a0), sub(pos(R[1][1]), a0)), fl = f0[0] < 0;
    for (let i = 0; i < N; i++) for (let k = 0; k < K; k++) { const k2 = (k + 1) % K; fl ? m.quad(R[i][k], R[i][k2], R[i + 1][k2], R[i + 1][k]) : m.quad(R[i][k], R[i + 1][k], R[i + 1][k2], R[i][k2]); }
    for (const [i, d] of [[0, 0.01], [N, -0.01]]) {                          // both ends closed with a low dome
      const c = R[i].map(pos).reduce((a, p) => [a[0] + p[0] / K, a[1] + p[1] / K, a[2] + p[2] / K], [0, 0, 0]), q = m.v(c[0], c[1], c[2] + d, 0.2);
      for (let k = 0; k < K; k++) { const k2 = (k + 1) % K; (fl === (i === 0)) ? m.tri(R[i][k2], R[i][k], q) : m.tri(R[i][k], R[i][k2], q); }
    }
    for (const sx of [1, -1]) for (let g = 0; g < 6; g++) {
      const s0 = 0.30 + 0.045 * g, yc = (top(s0) * 0.55 + edge(s0) * 0.45) - 0.035 - 0.08, L = 0.07, W = 0.022, P = [];
      for (let u = 0; u <= 3; u++) {
        const c = [sx * (0.035 + 0.012 * u), yc - 0.012 * u, 0.5 - s0 - 0.010 * u], hw = W * sin(PI * (0.15 + 0.7 * u / 3));
        P.push([m.v(c[0], c[1], c[2] + hw, 0.25), m.v(c[0], c[1], c[2] - hw, 0.25)]);
      }
      for (let u = 0; u < 3; u++) sx > 0 ? m.quad(P[u][0], P[u + 1][0], P[u + 1][1], P[u][1]) : m.quad(P[u][0], P[u][1], P[u + 1][1], P[u + 1][0]);
    }
  }

  // ---------------------------------------------------------------- the eyes
  // Large: about a seventh of the length of the body (JHK2020); here 0.11 across, under the front tip, half in the
  // notch
  const ER = 0.055, EC = [0.042, 0.050, -0.010];
  for (const sx of [1, -1]) {
    const c = [sx * EC[0], EC[2], 0.5 - EC[1]], rows = [];
    for (let k = 1; k < 8; k++) {
      const la = PI * k / 8, row = [];
      for (let q = 0; q <= 14; q++) { const b = TAU * q / 14; row.push(m.v(c[0] + ER * sin(la) * cos(b) * 0.85, c[1] + ER * sin(la) * sin(b), c[2] + ER * cos(la), -1)); }
      rows.push(row);
    }
    const nP = m.v(c[0], c[1], c[2] + ER, -1), sP = m.v(c[0], c[1], c[2] - ER, -1);
    for (let q = 0; q < 14; q++) { m.tri(nP, rows[0][q], rows[0][q + 1]); m.tri(sP, rows[6][q + 1], rows[6][q]); }
    for (let k = 0; k < 6; k++) band(rows[k], rows[k + 1], true);
  }

  // ---------------------------------------------------------------- arms and paddles
  // a tube along a line of centres C, radius rad(t), ends closed
  const tube = (C, rad, aux, sides = 5) => {
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
  // the arms for catching: three pairs under the front of the body, behind the eyes, folded: down and forward, then the
  // last pieces bent back up toward the mouth (after Fig. 5). The rear pair the longest. Five pieces each, narrower at
  // the joints; spines in two rows on the inner edge of the last two pieces (after Fig. 5; estimate)
  for (const sx of [1, -1]) for (let j = 0; j < 3; j++) {
    const s0 = 0.13 + 0.045 * j, y0 = edge(s0) + 0.03, L = 0.19 + 0.04 * j, x0 = sx * (0.030 + 0.006 * j);
    const C = [[x0, y0, 0.5 - s0], [x0 + sx * 0.010, y0 - 0.40 * L, 0.5 - s0 + 0.10 * L], [x0 + sx * 0.014, y0 - 0.70 * L, 0.5 - s0 + 0.32 * L],
      [x0 + sx * 0.010, y0 - 0.55 * L, 0.5 - s0 + 0.62 * L], [x0 + sx * 0.006, y0 - 0.30 * L, 0.5 - s0 + 0.75 * L]];
    const NA = 18, CC = curve(C, NA), JT = [0.22, 0.42, 0.60, 0.78];
    const jn = (t) => JT.reduce((a, q) => max(a, exp(-pow((t - q) / 0.025, 2))), 0);
    const Vr = [];
    for (let k = 0; k <= NA; k++) {
      const t = k / NA, a = CC[max(k - 1, 0)], b = CC[min(k + 1, NA)], d = nrm(sub(b, a)), u0 = abs(d[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      const e1 = nrm(crs(d, u0)), e2 = crs(d, e1), r = (0.011 - 0.006 * t) * (1 - 0.30 * jn(t)) * (1 + 0.12 * sin(PI * ((t * 5) % 1))), ring = [];
      for (let e = 0; e < 6; e++) { const w = e / 6 * TAU; ring.push(m.v(CC[k][0] + (e1[0] * cos(w) + e2[0] * sin(w)) * r, CC[k][1] + (e1[1] * cos(w) + e2[1] * sin(w)) * r, CC[k][2] + (e1[2] * cos(w) + e2[2] * sin(w)) * r, 0.6 - 0.016 * jn(t))); }
      Vr.push(ring);
    }
    const a0 = pos(Vr[0][0]), f0 = crs(sub(pos(Vr[1][0]), a0), sub(pos(Vr[0][1]), a0)), fl = dot(f0, sub(a0, CC[0])) < 0;
    for (let k = 0; k < NA; k++) for (let e = 0; e < 6; e++) { const e2 = (e + 1) % 6; fl ? m.quad(Vr[k][e], Vr[k][e2], Vr[k + 1][e2], Vr[k + 1][e]) : m.quad(Vr[k][e], Vr[k + 1][e], Vr[k + 1][e2], Vr[k][e2]); }
    const tip = m.v(CC[NA][0], CC[NA][1], CC[NA][2], 0.6);
    for (let e = 0; e < 6; e++) { const e2 = (e + 1) % 6; fl ? m.tri(Vr[NA][e], Vr[NA][e2], tip) : m.tri(Vr[NA][e2], Vr[NA][e], tip); }
    for (let q = 0; q < 6; q++) {
      const t = 0.64 + 0.055 * q, k = round(t * NA), P = CC[k], up = q % 2 ? 1 : 0.7;
      tube([P, [P[0] + sx * 0.003 * (q % 2 ? 1 : -1), P[1] + 0.020 * up, P[2] - 0.006]], (u) => 0.0030 * (1 - u) + 0.0003, 0.6, 3);
    }
  }
  // the paddles: eight pairs along the lower rear end of the body (Fig. 2), each a thin blade 0.09 long, hanging down
  // and back, its edges a fringe of bristles (drawn by the shader; estimate). aux tells the vertex shader which one it
  // is, so that they beat one after another
  for (const sx of [1, -1]) for (let k = 0; k < 8; k++) {
    const s0 = 0.60 + 0.048 * k, yr = (top(s0) * 0.55 + edge(s0) * 0.45) - 0.02 - 0.12, aux = 0.80 + 0.0236 * k, L = 0.095 - 0.004 * k;
    const r = [sx * 0.030, yr, 0.5 - s0], d = nrm([sx * 0.25, -1, -0.45]), w = 0.020, V = [];
    for (let i = 0; i <= 3; i++) {
      const u = i / 3, c = [r[0] + d[0] * L * u, r[1] + d[1] * L * u, r[2] + d[2] * L * u], hw = w * (0.6 + 0.8 * sin(PI * (0.25 + 0.6 * u)));
      V.push([m.v(c[0], c[1], c[2] + hw, aux), m.v(c[0], c[1], c[2] - hw, aux)]);
    }
    for (let i = 0; i < 3; i++) sx > 0 ? m.quad(V[i][0], V[i + 1][0], V[i + 1][1], V[i][1]) : m.quad(V[i][0], V[i][1], V[i + 1][1], V[i + 1][0]);
  }
  return m;
}
