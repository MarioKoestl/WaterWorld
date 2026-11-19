// ============================================================================
// devonian: driftwood — trunks of the first trees, floating and sunk
// ============================================================================
// Two floating logs drift slowly near the surface. Three sunk logs lie half-buried on the floor at -45 m.
// All five are one kind with the same mesh; the vertex shader checks i.b.y to decide floating (>0) vs sunk (0).
// Instance: a.xyz = centre of orbit (floating) or position (sunk), a.w = orbit radius (floating) or yaw (sunk).
// b.x = initial phase (floating) or tilt (sunk), b.y = drift speed (>0 floating, 0 sunk), b.z = size, b.w = seed.
// See CLAUDE.md, "adding an animal" — these are not animals, but the same five parts apply.
// 1 mesh (meshDriftwood), 2 shaders (S_WOOD), 3 kind (WOOD in world.js), 4 instances (makeWorld), 5 zoo (zooDrift)

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

// ---------------------------------------------------------------- shaders
const S_WOOD = /*wgsl*/`
// ============================================================================
// Reference shaders for the driftwood (brief: docs/briefs/driftwood-build.md)
// ============================================================================
// Not loaded by the build. This is the whole text of S_WOOD for source/eras/devonian/driftwood.js, for the mesh of
// docs/briefs/ref/driftwood-mesh.js. It needs what W_ANIM gives (ss, sat, hs, vn, fbm, zone, fog, fin, caus, amb,
// sunE, vol, shadow1). This text has not been compiled: run node tools/wgsl.mjs devonian first.
// Instance (unchanged): a.xyz = centre of the circle it drifts on (floating) or its place (sunk), a.w = radius of the
// circle (floating) or yaw (sunk). b.x = phase (floating) or tilt (sunk), b.y = drift speed (> 0 floating, 0 sunk),
// b.z = size, b.w = seed. zooDrift repeats the path: it does not change.
// lt carries aux (the shadow of the sun is taken in the fragment shader), and sd carries the seed plus 10 for a sunk
// log. v3 (2026-11-19, driftwood-matte.md): the bark furrows are in the mesh (woodFurrow repeats them), the wood is
// matte, the furrows and cracks lie in shade.

// where each crinoid holds on to the log (x, y, z in metres, read off the mesh) and how long its stem is (w)
fn woodCri(k: i32) -> vec4f {
  var C = array<vec4f, 6>(vec4f(.077, -.236, -3.840, .55), vec4f(.050, -.289, -2.040, .95),
    vec4f(-.056, -.273, -.360, .40), vec4f(0., -.306, .960, 1.10), vec4f(-.081, -.254, 2.520, .70),
    vec4f(-.059, -.221, 4.080, .50));
  return C[clamp(k, 0, 5)];
}
// the middle line and the radius of the trunk at z (as axis() and rad() in the mesh)
fn woodAxis(z: f32) -> vec3f {
  let t = (z + 6.) / 12.;
  return vec3f(sin(t * 5.1 + 1.) * .08 + sin(t * 11.3) * .03, cos(t * 4.7 + .5) * .06,
    .3 * (1. - .35 * t) * (1. + .07 * sin(t * 23.)));
}
// the furrows of the bark, exactly as furrow() in the mesh (a: the angle round the log, 0 to 2 pi). x: 1 in the middle
// of a furrow, 0 on a plate; y, z: which plate (two counts, each 0 to 10, for its colour)
fn woodGroove(u: f32, w: f32) -> f32 { let f = fract(u); return 1. - ss(0., w, min(f, 1. - f)); }
fn woodFurrow(z: f32, a: f32) -> vec3f {
  let t = (z + 6.) / 12.;
  let u0 = 11. * a / 6.2831853 + .25 * sin(t * 17. + a) + .12 * sin(t * 41. + 2. * a);
  let u1 = u0 + 1.2 * z; let u2 = u0 - 1.2 * z;
  let c1 = floor(u1); let c2 = floor(u2);
  let g = max(woodGroove(u1, .30), .75 * woodGroove(u2, .22));
  return vec3f(g, c1 - 11. * floor(c1 / 11.), c2 - 11. * floor(c2 / 11.));
}
fn woodRotX(p: vec3f, a: f32) -> vec3f {
  let c = cos(a); let s = sin(a); return vec3f(p.x, p.y * c - p.z * s, p.z * c + p.y * s);
}
fn woodRotZ(p: vec3f, a: f32) -> vec3f {
  let c = cos(a); let s = sin(a); return vec3f(p.x * c - p.y * s, p.y * c + p.x * s, p.z);
}

@vertex fn vsDrift(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let sz = i.b.z; let sd = i.b.w; let lt = i.n.w;
  let floating = step(.000001, i.b.y);
  var l = i.p; var nm = i.n.xyz;
  // ---- the crinoids: each sways about the place where it holds on, trails a little behind as the log drifts, and its
  // arms open and close slowly like a fan that sieves the water. On a sunk log they are gone (folded into one point)
  if (lt > .58) {
    let k = i32(round((lt - .60) / .024)); let C = woodCri(k); let kf = f32(k);
    var d = l - C.xyz;
    let cupY = 0. - .02 - C.w - .025;
    let arm = ss(cupY + .005, cupY - .03, d.y);
    let open = 1. + .22 * sin(t * .45 + kf * 1.7 + sd * 9.) * arm;
    d = vec3f(d.x * open, d.y, d.z * open);
    let ax = .16 * sin(t * .50 + kf * 1.3 + sd * 7.) + .12;      // + 0.12: it trails behind the drift
    let az = .12 * sin(t * .37 + kf * 2.1 + sd * 3.);
    d = woodRotZ(woodRotX(d, ax), az);
    nm = woodRotZ(woodRotX(nm, ax), az);
    l = mix(C.xyz, C.xyz + d, floating);
  }
  l = l * sz;
  var T = vec3f(0., 0., 1.); var S = vec3f(1., 0., 0.); var Up = vec3f(0., 1., 0.);
  var base = vec3f(0.);
  if (i.b.y > 0.) {
    // floating: drift in a slow circle near the surface, rolling and bobbing a little
    let R = i.a.w; let ta = t * i.b.y + i.b.x;
    base = i.a.xyz + vec3f(R * cos(ta), .06 * sin(t * .4 + sd * 20.), R * sin(ta));
    T = normalize(vec3f(0. - sin(ta), 0., cos(ta)));
    S = vec3f(T.z, 0., 0. - T.x);
    let roll = sin(t * .3 + sd * 10.) * .08;
    let S2 = S * cos(roll) + Up * sin(roll);
    Up = Up * cos(roll) - S * sin(roll);
    S = S2;
  } else {
    // sunk: still on the floor, turned and tilted
    base = i.a.xyz;
    let yaw = i.a.w; let tilt = i.b.x;
    let cy = cos(yaw); let sy = sin(yaw);
    let ct = cos(tilt); let st = sin(tilt);
    T = vec3f(sy * ct, st, cy * ct);
    S = vec3f(cy, 0., 0. - sy);
    Up = cross(T, S);
  }
  let w = base + T * l.z + Up * l.y + S * l.x;
  nm = T * nm.z + Up * nm.y + S * nm.x;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = nm; o.op = i.p; o.sd = fract(sd) + 10. * (1. - floating); o.lt = lt;
  return o;
}

@fragment fn fsDrift(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let p = i.op; let lt = i.lt; let sd = fract(i.sd); let sunk = step(5., i.sd);
  let fw = max(fwidth(p.x), max(fwidth(p.y), fwidth(p.z)));
  let near = 1. - ss(.004, .015, fw);
  let bark0 = step(lt, .15); let woodP = step(abs(lt - .3), .1); let cri = step(.58, lt);
  let A = woodAxis(p.z); let q = p.xy - A.xy; let rr = length(q); let th = atan2(q.y, q.x);
  let wUp = normalize(i.n).y;                                              // which way the surface faces in the world
  var hgt = 0.;
  // ---- the bark (estimate: the surface of Archaeopteris bark is not known). The furrows are in the mesh; woodFurrow
  // repeats them here for the shade deep in them and for their colour. The plates between them are rough: they flake
  // in long scales about 3.5 cm across and 14 cm long, with fine broken cracks between, the fibres along the log.
  // Where the bark has fallen off (aux 0.12, from the mesh) the grey wood shows, rough, its grain along the log, split
  // and stained in streaks
  let aa = th + select(0., 6.2831853, th < 0.);
  let FU = woodFurrow(p.z, aa); let plate = FU.y * 7.31 + FU.z * 3.17;
  let bare = ss(.02, .11, lt) * bark0;
  let bark = bark0 * (1. - bare);
  let fur = FU.x * bark;
  let fq = vec2f(aa * rr / .035, p.z / .14); let fi = floor(fq);
  var e1 = 9.; var e2 = 9.; var fc = vec2f(0.);
  for (var a = -1; a <= 1; a++) { for (var b = -1; b <= 1; b++) {
    let c = fi + vec2f(f32(a), f32(b));
    let r = c + vec2f(hs(dot(c, vec2f(1.7, 9.2)) + sd), hs(dot(c, vec2f(8.3, 2.8)) + sd)) - fq;
    let dd = dot(r, r); if (dd < e1) { e2 = e1; e1 = dd; fc = c; } else if (dd < e2) { e2 = dd; }
  } }
  let crack = (1. - ss(.02, .08, sqrt(e2) - sqrt(e1))) * ss(.35, .65, vn(p * 18. + sd * 3.)) * near;
  let flake = hs(dot(fc, vec2f(3.1, 1.7)) + sd * 5.);
  let near2 = 1. - ss(.002, .006, fw);
  let fib = vn(vec3f(aa * rr * 90., p.z * 2.5, sd * 3.)); let fib2 = vn(vec3f(aa * rr * 260., p.z * 6., sd * 5.));
  let bump = fbm(vec3f(aa * rr * 25., p.z * 4., sd * 7.), 3);
  let gr = vn(vec3f(aa * rr * 140., p.z * 1.2, sd * 9.));
  let split = ss(.72, .82, vn(vec3f(aa * rr * 60., p.z * .4, sd + 3.)));
  let rough = fbm(vec3f(aa * rr * 30., p.z * 4., sd * 11.), 3); let pit = vn(p * 90. + sd * 13.);
  hgt += (-.014 * FU.x + .008 * bump + (.002 * flake - .002 * crack + .0015 * fib + .0008 * fib2 * near2) * near) * bark
    + (.008 * rough + (.003 * gr + .0015 * fib + .0015 * pit - .004 * split) * near) * bare;
  // shade deep in the furrows and cracks (the light of the water around reaches little of it)
  let occ = 1. - .80 * fur - .20 * crack * bark - .50 * split * bare;
  // ---- bare wood at the breaks: growth rings round the middle line, rays out from it, the heart rotten and dark; the
  // splinters show the grain along the log (estimate)
  let ring = (.5 + .5 * sin(rr / .022 * 6.2832 + 3. * vn(vec3f(th * 2., p.z, sd)))) * near + .5 * (1. - near);
  let ray = ss(.75, .95, vn(vec3f(th * 60., rr * 4., sd)));
  let side = 1. - abs(normalize(i.n).z);                                     // a face along the log, not across it
  let rot = 1. - ss(.04, .10, rr);
  hgt += (.002 * ring * (1. - side) + .002 * gr * side) * woodP * near;
  // ---- colours. Waterlogged wood: dark grey-brown bark, every plate of a ridge a little different, darker and redder
  // deep in the furrows, the worn tops of the plates paler; the wood under it greyer and paler, the rotten heart nearly
  // black (no colour of Callixylon in life is known; these are the colours of wet wood)
  let BARK = vec3f(.075, .060, .042); let WOOD = vec3f(.20, .17, .13);
  let tone = (.70 + .55 * hs(plate + sd)) * (.85 + .30 * flake) * (.75 + .5 * bump);
  var alb = BARK * tone * (.80 + .40 * fib) * (.90 + .20 * fib2 * near2) * (1. - .25 * crack);
  alb = mix(alb, vec3f(.11, .10, .085) * tone, .40 * (1. - FU.x) * ss(.5, .8, bump) * ss(.4, .8, fib));
  alb = mix(alb, vec3f(.035, .022, .014), FU.x * .9);
  let stain = .50 + .50 * vn(vec3f(aa * rr * 8., p.z * .3, sd));
  alb = mix(alb, WOOD * (.70 + .40 * gr) * (.85 + .3 * fib) * (.6 + .8 * rough) * stain * (1. - .7 * split), bare);
  alb = mix(alb, mix(WOOD * (.70 + .35 * ring) * (1. - .30 * ray), vec3f(.03, .025, .02), rot), woodP);
  // ---- what lives on it. A floating log: a slimy film of algae on its upper side, where the light falls, thicker and
  // darker in the furrows (KGS: algae would have grown on any log that was long at sea). A sunk log: grey mud on its
  // upper side and in its furrows, nothing living
  let film = sat(ss(.15, .70, wUp) * (.55 + .45 * fbm(p * 3.1 + sd * 4., 3)) + .4 * fur * ss(-.2, .4, wUp))
    * (1. - cri);
  let tex = mix(bump, rough, bare);
  alb = mix(alb, vec3f(.11, .12, .06) * (.8 + .4 * vn(p * 18.)) * (.6 + .8 * tex) * (1. - .4 * fur),
    film * .55 * (1. - sunk));
  let mud = sat(ss(.10, .60, wUp) * .85 + .7 * fur * ss(-.3, .3, wUp)) * sunk * (1. - cri);
  alb = mix(alb, vec3f(.16, .15, .12) * (.85 + .3 * vn(p * 9.)) * (.8 + .4 * tex), mud);
  // ---- the crinoids: a stem of round plates stacked like coins, the cup of plates, arms set with fine side branches
  // (pinnules). Their colour in life is not known: a plain pale grey-buff
  let k = i32(round((lt - .60) / .024)); let Cr = woodCri(k); let dy = p.y - Cr.y;
  let col = .5 + .5 * cos(dy / .007 * 6.2832);
  let pin = .5 + .5 * sin(atan2(p.z - Cr.z, p.x - Cr.x) * 70. + dy * 300.);
  let crown = ss(0. - .02 - Cr.w, 0. - .05 - Cr.w, dy);
  hgt += (.0012 * col * (1. - crown) + .0008 * pin * crown) * cri * near;
  alb = mix(alb, vec3f(.38, .35, .29) * (.80 + .25 * col * (1. - crown) + .2 * pin * crown), cri);
  // ---- light. The relief is in metres of the model (times the size, about 1). The sun through the surface with its
  // flecks (caus) and the shadow map. Under water wood hardly shines: between water (1.33) and wet wood (about 1.5) a
  // surface sends back about 0.4 % of the light that falls on it head on, against 4 % in air (Fresnel). So only a dull,
  // broad sheen, a little more on the slime of the algae and on the crinoids. The shade in the furrows (occ) dims the
  // light of the water around fully and the sun partly
  let px = dpdx(i.wp); let py = dpdy(i.wp); let r1 = cross(py, ns); let r2 = cross(ns, px); let det = dot(px, r1);
  let n = normalize(abs(det) * ns - sign(det) * (dpdx(hgt) * r1 + dpdy(hgt) * r2));
  let dist = length(i.wp - g.cam.xyz); let V = normalize(g.cam.xyz - i.wp); let L = g.sun.xyz; let H = normalize(V + L);
  let z = zone(i.wp); let vv = vol(i.wp); let ca = caus(i.wp, dist);
  let E = sunE(i.wp.y, z) * shadow1(i.wp + n * .05);
  let gl = .015 * bark + .02 * bare + .02 * woodP + .10 * film * (1. - sunk) + .12 * cri;
  var c = alb * (E * (.15 + .85 * sat(dot(n, L))) * (.3 + ca * .7) * (.35 + .65 * occ)
    + amb(i.wp, n, vv.g, z) * 1.1 * occ)
    + E * (.3 + .7 * ca) * gl * occ * pow(sat(dot(n, H)), 16.);
  c += vec3f(.2, .4, .3) * pow(1. - sat(dot(n, V)), 3.) * .03 * vv.g * occ;
  return fin(fog(c, i.wp, z));
}
`;

// ---------------------------------------------------------------- zoo
// where a driftwood instance is at the current time (see zooMove in engine/zoo.js): a line from one end of the log
// to the other, with the trunk radius around it. Runs every frame, allocates nothing
const zooDrift = (a, i) => {
  const sz = a[i + 6], half = sz * 6;
  let tx, tz;
  if (a[i + 5] > 0) {
    const R = a[i + 3], ta = F[TIME] * a[i + 5] + a[i + 4];
    const cx = a[i] + R * cos(ta), cz = a[i + 2] + R * sin(ta);
    tx = -sin(ta); tz = cos(ta);
    ZP[0] = cx - tx * half; ZP[1] = a[i + 1]; ZP[2] = cz - tz * half;
  } else {
    const yaw = a[i + 3];
    tx = sin(yaw); tz = cos(yaw);
    ZP[0] = a[i] - tx * half; ZP[1] = a[i + 1]; ZP[2] = a[i + 2] - tz * half;
  }
  ZP[3] = tx * half * 2; ZP[4] = 0; ZP[5] = tz * half * 2;
  ZP[7] = sz * 0.3;
};
