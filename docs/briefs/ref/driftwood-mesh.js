// ============================================================================
// Reference geometry for the driftwood: the fix of 2026-11-19 (brief: docs/briefs/devonian-gap-fixes.md)
// ============================================================================
// Not loaded by the build. Replaces meshDriftwood() in source/eras/devonian/driftwood.js; the shader and zooDrift stay.
// It needs Mesh, rseed and rr (engine/math.js). The calls to rr() come in the same order as before, so every stump
// keeps its place, its thickness and its length.

// ---------------------------------------------------------------- mesh
// a bare log 12 m along z (-6 to +6), about 0.3 m radius, with broken branch stumps. Modelled around the origin, z forward
function meshDriftwood() {
  rseed(300);
  const m = new Mesh(), N = 24, pts = [];
  // the middle line of the trunk at t (0 at the thick end, 1 at the thin one) and its radius there
  const axis = (t) => [sin(t * 5.1 + 1) * 0.08 + sin(t * 11.3) * 0.03, cos(t * 4.7 + 0.5) * 0.06, -6 + t * 12];
  const rad = (t) => 0.3 * (1 - 0.35 * t) * (1 + 0.07 * sin(t * 23));
  for (let i = 0; i <= N; i++) pts.push(axis(i / N));
  m.tube(pts, (k) => rad(k / N), 10, true, (k) => k / N);
  // tube() closes only the last ring: close the thick end too, with a low dome (its first ring is vertices 0 to 9)
  const c0 = m.v(pts[0][0], pts[0][1], pts[0][2] - 0.06, 0);
  for (let s = 0; s < 10; s++) m.tri((s + 1) % 10, s, c0);
  for (let i = 0; i < 7; i++) {
    const t = 0.08 + i * 0.13, angle = i * 2.39 + rr(-0.3, 0.3);
    const C = axis(t), r0 = rad(t);
    const bx = cos(angle), by = sin(angle), br = rr(0.05, 0.1), bl = rr(0.3, 0.6);
    // the stump starts inside the trunk, half its radius out from the middle line, so that it always grows out of the
    // bark (it used to start on a circle round z, off the bent middle line, and could float beside the trunk)
    const D = [0.5 * r0, 1.1 * r0, r0 + 0.5 * bl, r0 + bl];
    const stump = D.map((d, j) => [C[0] + bx * d, C[1] + by * d, C[2] + j / 3 * 0.1]);
    const n0 = m.p.length / 3;
    m.tube(stump, (k) => br * [1, 0.95, 0.7, 0.35][k], 6, true);
    for (let k = n0; k < m.aux.length; k++) m.aux[k] = t;
  }
  return m;
}
