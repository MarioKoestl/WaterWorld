// ============================================================================
// Reference geometry for the driftwood (brief: docs/briefs/driftwood-build.md)
// ============================================================================
// Not loaded by the build. Replaces meshDriftwood() in source/eras/devonian/driftwood.js. It needs Mesh
// (engine/math.js), nothing else. Units are metres: a log 12 m long (z from -6, the thick end, to +6), about 0.6 m
// thick; the instance scales it by b.z.
//
// A trunk of Archaeopteris; its wood is called Callixylon. Sources (see docs/research/devonian/driftwood.md): logs of
// Callixylon lie in the black shales of Ohio, Kentucky and Indiana, one in Kentucky more than 4 m long and 0.5 m thick
// (KGS); trunks grew to more than 1.5 m across (Wikipedia, after Meyer-Berthaud and Decombeix 2007). Logs have been
// found with crinoids attached, on their underside and seldom on their sides, "probably as they floated" (Hoskins and
// Cross); a long crinoid stem lay lengthwise along one log (Wells, after Wickwire); attached to a floating log, adult
// crinoids "would have hung down beneath the log" (Hess, Treatise). No bivalves, snails, barnacles or crustaceans
// have been found on such logs (KGS). The bark, the branch stubs and the broken ends are estimates.
//
// aux (what a vertex is; the shaders read it):
//    0     bark of the trunk, furrowed
//    0.12  bark fallen off (the grey wood shows); between 0 and 0.12 the edge of such a patch
//    0.3   bare wood: the broken ends and the ends of the branch stubs
//    0.60 + 0.024 k   crinoid k (k = 0 to 5) hanging under the log: its stem, the cup and the arms (the vertex shader
//                     sways each about the place where it holds on; on sunk logs they are gone)
function meshDriftwood() {
  const m = new Mesh();
  const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = (a) => { const l = hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const pos = (i) => [m.p[i * 3], m.p[i * 3 + 1], m.p[i * 3 + 2]];
  const band = (A, B, flip) => { for (let k = 0; k < A.length - 1; k++) flip ? m.quad(A[k], B[k], B[k + 1], A[k + 1]) : m.quad(A[k], A[k + 1], B[k + 1], B[k]); };
  // a smooth noise of its own (no random numbers: the mesh is the same in every run)
  const h1 = (x) => { const s = sin(x * 127.1 + 311.7) * 43758.5453; return s - floor(s); };
  const n1 = (x) => { const i = floor(x), f = x - i, u = f * f * (3 - 2 * f); return h1(i) * (1 - u) + h1(i + 1) * u; };
  const n2 = (x, y) => n1(x + 57.3 * floor(y)) * (1 - sm(0, 1, y - floor(y))) + n1(x + 57.3 * (floor(y) + 1)) * sm(0, 1, y - floor(y));

  // ---------------------------------------------------------------- the trunk
  // t from 0 (the thick end, z = -6) to 1 (z = +6). The middle line bends gently; the radius tapers from 0.30 to 0.20
  // with bulges; the section is not round: a lumpy outline that changes along the log
  const axis = (t) => [sin(t * 5.1 + 1) * 0.08 + sin(t * 11.3) * 0.03, cos(t * 4.7 + 0.5) * 0.06, -6 + t * 12];
  const rad = (t) => 0.3 * (1 - 0.35 * t) * (1 + 0.07 * sin(t * 23));
  // (the noise reads cos and sin of the angle, so the outline closes round the log without a step)
  const lump = (t, a) => 1 + 0.07 * (n2(cos(a) * 1.1 + 3, t * 9) - 0.5) + 0.07 * (n2(sin(a) * 1.1 + 5, t * 9 + 4) - 0.5)
    + 0.04 * (n2(cos(a) * 2.6 + sin(a) * 1.3 + 9, t * 23 + 7) - 0.5);
  // the bark (estimate: the surface of Archaeopteris bark is not known; the fibres of its inner bark lie in bands,
  // Decombeix and Meyer-Berthaud 2013). Thick and furrowed in a net: 11 deep furrows meander along the log, a second,
  // shallower set crosses them at a slant, so the ridges break into long diamond plates, about 0.17 m across and 0.4 m
  // long. furrow() is 1 in the middle of a furrow and 0 on a plate; the fragment shader repeats it exactly
  // (woodFurrow), so keep the two the same. Depth up to 3.5 cm, the bark 2.2 cm thick (both scale with the radius).
  // Where the bark has fallen off (bare, 0 to 1) the trunk is thinner by the bark and smooth: aux carries 0.12 x bare
  const groove = (u, w) => { const f = u - floor(u); return 1 - sm(0, w, min(f, 1 - f)); };
  const furrow = (t, a) => {
    const z = -6 + 12 * t, u0 = 11 * a / TAU + 0.25 * sin(t * 17 + a) + 0.12 * sin(t * 41 + 2 * a);
    return max(groove(u0 + 1.2 * z, 0.30), 0.75 * groove(u0 - 1.2 * z, 0.22));
  };
  const fdepth = (t, a) => 0.028 * (1 + 0.25 * sin(t * 29 + 3 * a)) * (rad(t) / 0.3);
  const bareA = (t, a) => sm(0.60, 0.66, 0.5 * n2(cos(a) * 1.7 + 11, t * 7) + 0.5 * n2(sin(a) * 1.7 + 13, t * 7 + 2));
  // near the six places where a crinoid holds on, the bark is whole and not furrowed (so the holdfast sits on it)
  const CRI = [[0.18, -0.10, 0.55], [0.33, 0.12, 0.95], [0.47, -0.05, 0.40], [0.58, 0.20, 1.10], [0.71, -0.15, 0.70],
    [0.84, 0.05, 0.50]];
  const holdAt = CRI.map(([t, da]) => {
    const C = axis(t), a = -PI / 2 + da, r = rad(t) * lump(t, a) - 0.01;
    return [C[0] + cos(a) * r, C[1] + sin(a) * r, C[2]];
  });
  const calm = (x, y, z) => {
    let d = 9;
    for (const h of holdAt) d = min(d, hypot(x - h[0], y - h[1], z - h[2]));
    return sm(0.06, 0.12, d);
  };
  // the radius of the bark surface at (t, a), and how bare it is there
  const surf = (t, a) => {
    const C = axis(t), r0 = rad(t) * lump(t, a);
    const cm = calm(C[0] + cos(a) * r0, C[1] + sin(a) * r0, C[2]), b = bareA(t, a) * cm;
    return [r0 - 0.022 * (rad(t) / 0.3) * b - fdepth(t, a) * furrow(t, a) * (1 - b) * cm, b];
  };
  // the broken ends: the trunk ends in splinters, longer on one side (estimate)
  const brk0 = (a) => 0.06 + 0.30 * pow(n1(a * 3.1 + 2), 3) + 0.14 * pow(h1(floor(a * 5.1)), 4);   // how far the thick end reaches
  const brk1 = (a) => 0.05 + 0.40 * pow(n1(a * 2.3 + 9), 3) + 0.14 * pow(h1(floor(a * 5.1) + 7), 4);  // and the thin end
  const NA = 64, NZ = 160, rings = [];
  for (let i = 0; i <= NZ; i++) {
    const t = i / NZ, ring = [];
    for (let k = 0; k < NA; k++) {
      const a = TAU * k / NA, C = axis(t), [r, b] = surf(t, a);
      ring.push(m.v(C[0] + cos(a) * r, C[1] + sin(a) * r, C[2], 0.12 * b));
    }
    rings.push(ring);
  }
  const a0 = pos(rings[1][0]), f0 = crs(sub(pos(rings[2][0]), a0), sub(pos(rings[1][1]), a0)), fl = dot(f0, sub(a0, axis(1 / NZ))) < 0;
  for (let i = 0; i < NZ; i++) for (let k = 0; k < NA; k++) {
    const k2 = (k + 1) % NA, A = rings[i], B = rings[i + 1];
    fl ? m.quad(A[k], A[k2], B[k2], B[k]) : m.quad(A[k], B[k], B[k2], A[k2]);
  }
  // each broken end: from the bark ring, the wood runs on in splinters of different lengths, then a ragged face across.
  // The face is a fan of points, each pushed in or out along the log a little (the break is not flat)
  for (const [end, dir, brk] of [[0, -1, brk0], [NZ, 1, brk1]]) {
    const t = end / NZ, C = axis(t), R0 = rings[end], S1 = [], S2 = [];
    for (let k = 0; k < NA; k++) {
      const a = TAU * k / NA, r = rad(t) * lump(t, a), L = brk(a);
      S1.push(m.v(C[0] + cos(a) * r * 0.97, C[1] + sin(a) * r * 0.97, C[2] + dir * L, 0.3));
      S2.push(m.v(C[0] + cos(a) * r * (0.45 + 0.2 * n1(a * 4.3)), C[1] + sin(a) * r * (0.45 + 0.2 * n1(a * 4.3)), C[2] + dir * L * (0.25 + 0.7 * pow(n1(a * 7.7), 2)), 0.3));
    }
    const W = R0.map((q) => { const p = pos(q); return m.v(p[0], p[1], p[2], 0.3); });     // the same ring, as wood
    const cen = m.v(C[0], C[1], C[2] - dir * 0.06, 0.3);                       // the rotten heart, hollowed out
    const flipE = (dir > 0) !== fl;
    for (let k = 0; k < NA; k++) {
      const k2 = (k + 1) % NA;
      flipE ? m.quad(W[k], W[k2], S1[k2], S1[k]) : m.quad(W[k], S1[k], S1[k2], W[k2]);
      flipE ? m.quad(S1[k], S1[k2], S2[k2], S2[k]) : m.quad(S1[k], S2[k], S2[k2], S1[k2]);
      flipE ? m.tri(S2[k], S2[k2], cen) : m.tri(S2[k], cen, S2[k2]);
    }
  }

  // ---------------------------------------------------------------- branch stubs
  // Seven stubs where branches broke off, helically round the trunk (estimate). Each grows out of the bark from inside
  // the trunk, tapers, and ends in a broken face of bare wood
  const stub = (t, ang, br, bl) => {
    const C = axis(t), r0 = rad(t), d = [cos(ang), sin(ang), 0.18], K = 8, R = [];
    const D = [0.5 * r0, 1.0 * r0, r0 + 0.35 * bl, r0 + 0.7 * bl, r0 + bl];
    for (let j = 0; j < D.length; j++) {
      const c = [C[0] + d[0] * D[j], C[1] + d[1] * D[j], C[2] + d[2] * D[j]], ax = nrm(d), u0 = abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      const e1 = nrm(crs(ax, u0)), e2 = crs(ax, e1), rr0 = br * [1.15, 1.05, 0.85, 0.7, 0.6][j], ring = [];
      for (let k = 0; k < K; k++) { const w = TAU * k / K; ring.push(m.v(c[0] + (e1[0] * cos(w) + e2[0] * sin(w)) * rr0, c[1] + (e1[1] * cos(w) + e2[1] * sin(w)) * rr0, c[2] + (e1[2] * cos(w) + e2[2] * sin(w)) * rr0, 0)); }
      R.push(ring);
    }
    const b0 = pos(R[1][0]), g0 = crs(sub(pos(R[2][0]), b0), sub(pos(R[1][1]), b0)), f1 = dot(g0, sub(b0, [C[0] + d[0] * r0, C[1] + d[1] * r0, C[2] + d[2] * r0])) < 0;
    for (let j = 0; j < D.length - 1; j++) for (let k = 0; k < K; k++) { const k2 = (k + 1) % K; f1 ? m.quad(R[j][k], R[j][k2], R[j + 1][k2], R[j + 1][k]) : m.quad(R[j][k], R[j + 1][k], R[j + 1][k2], R[j][k2]); }
    const E = R[D.length - 1], tip = [C[0] + d[0] * (r0 + bl + 0.02), C[1] + d[1] * (r0 + bl + 0.02), C[2] + d[2] * (r0 + bl + 0.02)];
    const Ew = E.map((q) => { const p = pos(q); return m.v(p[0], p[1], p[2], 0.3); }), c = m.v(tip[0], tip[1], tip[2], 0.3);
    for (let k = 0; k < K; k++) { const k2 = (k + 1) % K; f1 ? m.tri(Ew[k], Ew[k2], c) : m.tri(Ew[k2], Ew[k], c); }
  };
  for (let i = 0; i < 7; i++) stub(0.08 + i * 0.13, i * 2.39 + 0.3 * (n1(i * 3.3) - 0.5), 0.05 + 0.05 * n1(i * 1.7), 0.25 + 0.35 * n1(i * 4.1));

  // ---------------------------------------------------------------- crinoids
  // Six sea lilies hold on to the underside of the log and hang down (Hoskins and Cross; Hess). Each: a holdfast on the
  // bark, a stem of round plates (0.4 to 1.1 m, 0.016 thick), a cup and ten arms that fan out downward. Sizes are
  // estimates. The stems hang straight down at rest; the vertex shader sways them
  const tube = (C, radf, aux, sides) => {
    const Vr = [], N = C.length - 1;
    for (let k = 0; k <= N; k++) {
      const a = C[max(k - 1, 0)], b = C[min(k + 1, N)], d = nrm(sub(b, a)), u0 = abs(d[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
      const e1 = nrm(crs(d, u0)), e2 = crs(d, e1), r = radf(k / N), ring = [];
      for (let e = 0; e < sides; e++) { const w = e / sides * TAU; ring.push(m.v(C[k][0] + (e1[0] * cos(w) + e2[0] * sin(w)) * r, C[k][1] + (e1[1] * cos(w) + e2[1] * sin(w)) * r, C[k][2] + (e1[2] * cos(w) + e2[2] * sin(w)) * r, aux)); }
      Vr.push(ring);
    }
    const q0 = pos(Vr[0][0]), g0 = crs(sub(pos(Vr[1][0]), q0), sub(pos(Vr[0][1]), q0)), f2 = dot(g0, sub(q0, C[0])) < 0;
    for (let k = 0; k < N; k++) for (let e = 0; e < sides; e++) { const e2 = (e + 1) % sides; f2 ? m.quad(Vr[k][e], Vr[k][e2], Vr[k + 1][e2], Vr[k + 1][e]) : m.quad(Vr[k][e], Vr[k + 1][e], Vr[k + 1][e2], Vr[k][e2]); }
    for (const [k, out] of [[0, -1], [N, 1]]) { const tp = m.v(C[k][0], C[k][1], C[k][2], aux); for (let e = 0; e < sides; e++) { const e2 = (e + 1) % sides; (out > 0) !== f2 ? m.tri(Vr[k][e], Vr[k][e2], tp) : m.tri(Vr[k][e2], Vr[k][e], tp); } }
  };
  for (let k = 0; k < 6; k++) {
    const [t, da, L] = CRI[k], aux = 0.60 + 0.024 * k, C = axis(t), a = -PI / 2 + da, r = rad(t) * lump(t, a) - 0.01;
    const top = [C[0] + cos(a) * r, C[1] + sin(a) * r, C[2]];
    // the holdfast: a low flat cone on the bark
    tube([[top[0], top[1] + 0.012, top[2]], [top[0], top[1] - 0.010, top[2]], [top[0], top[1] - 0.022, top[2]]], (u) => 0.035 * (1 - u) + 0.010, aux, 8);
    // the stem, hanging down, a little bent
    const S = [];
    for (let j = 0; j <= 10; j++) { const u = j / 10; S.push([top[0] + 0.03 * sin(u * 2.1 + k), top[1] - 0.02 - L * u, top[2] + 0.04 * sin(u * 1.7 + 2 * k)]); }
    tube(S, () => 0.008, aux, 6);
    // the cup at the lower end and ten arms fanning out downward and outward, curling in at their tips
    const B = S[10], cup = [B[0], B[1] - 0.025, B[2]];
    tube([B, [B[0], B[1] - 0.012, B[2]], cup], (u) => 0.012 + 0.016 * sin(PI * 0.5 * (u + 0.2)), aux, 8);
    for (let q = 0; q < 10; q++) {
      const w = TAU * q / 10 + k, ex = cos(w), ez = sin(w), A = [];
      for (let j = 0; j <= 6; j++) { const u = j / 6, rr0 = 0.014 + 0.15 * sin(u * 1.4), dy = -0.03 - 0.17 * u + 0.07 * u * u * u; A.push([cup[0] + ex * rr0, cup[1] + dy, cup[2] + ez * rr0]); }
      tube(A, (u) => 0.0055 * (1 - 0.7 * u) + 0.0010, aux, 4);
    }
  }
  return m;
}
