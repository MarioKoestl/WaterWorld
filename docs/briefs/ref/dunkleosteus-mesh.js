// ============================================================================
// Reference geometry for Dunkleosteus terrelli, sixth version (briefs: dunkleosteus-build.md for how it is put
// together; dunkleosteus-surface.md, -danger.md, -armour.md, -jaws.md and -bone.md for what changed and why)
// ============================================================================
// Not loaded by the build. Take meshDunkleosteus() over into source/eras/devonian/swimmers_dunkleosteus.js.
// It needs Mesh (engine/math.js) and curve() (devonian/swimmers.js), nothing else.
// The mesh is one unit long, nose at +z, y up. s is the distance from the snout in body lengths: z = 0.5 - s.
//
// aux (what a vertex is; the shaders read it):
//    0     skin of the body: head, trunk and tail in ONE piece. Armour or naked skin is decided per pixel from the
//          place on the body (see the brief), not here
//    0.25  skin of the lower jaw and of the cheek below the mouth: drops with the jaw
//    0.5   fins and the keels of the tail stalk
//    0.6   pelvic and anal fins (pale in the life reconstruction of E2024)
//   -0.25  inside of the mouth, upper half (moves with the head)
//   -0.40  inside of the mouth, lower half (moves with the jaw)
//   -0.55  plates of the upper jaw, ASG and PSG (move with the head)
//   -0.70  plates of the lower jaw, IG (move with the jaw)
//   -1     eyes
function meshDunkleosteus() {
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
  // roundness 2 is an ellipse, more is boxier. The widest place: 0 at the belly, 1 at the back.
  // Back and belly are measured off the life reconstruction of E2024 (Fig. 4, in pixels, body length 669 px): the head
  // sits low, the back rises to a hump at 0.39 where the dorsal fin begins, the belly is nearly level as far as 0.36
  // and then rises steeply, so that the tail stalk lies above the middle of the body. Deepest 0.285 (E2024 text: 0.25
  // to 0.28, the large specimen 0.28 to 0.30). Widths: from depth / width 1.25 (E2024: 1.21 to 1.29) at the deepest
  // place, estimated elsewhere. The lower jaw is drawn shut here (Fig. 4 shows it open by about 20 degrees), with a chin
  // that falls back under the snout (estimate).
  const ST = [
    [0.000, 0.006, -0.018, 0.018, 2.2, 0.50],
    [0.012, 0.021, -0.050, 0.046, 2.5, 0.50],
    [0.025, 0.033, -0.071, 0.062, 2.8, 0.50],
    [0.050, 0.049, -0.087, 0.078, 3.1, 0.48],
    [0.080, 0.064, -0.104, 0.088, 3.2, 0.46],
    [0.110, 0.076, -0.122, 0.094, 3.2, 0.45],
    [0.150, 0.087, -0.137, 0.100, 3.1, 0.44],
    [0.190, 0.094, -0.143, 0.104, 3.0, 0.43],
    [0.215, 0.106, -0.145, 0.107, 2.6, 0.42],
    [0.240, 0.118, -0.146, 0.109, 2.5, 0.42],
    [0.270, 0.129, -0.147, 0.111, 2.5, 0.42],
    [0.330, 0.138, -0.148, 0.113, 2.4, 0.42],
    [0.390, 0.1435, -0.139, 0.111, 2.3, 0.43],
    [0.450, 0.138, -0.122, 0.103, 2.2, 0.45],
    [0.520, 0.122, -0.103, 0.089, 2.1, 0.48],
    [0.600, 0.100, -0.062, 0.070, 2.0, 0.50],
    [0.680, 0.081, -0.019, 0.050, 2.0, 0.50],
    [0.750, 0.064, -0.002, 0.032, 2.0, 0.50],
    [0.790, 0.062, 0.000, 0.022, 2.0, 0.50],
    [0.830, 0.066, 0.004, 0.010, 2.0, 0.50],
    [0.860, 0.070, 0.010, 0.004, 2.0, 0.50],
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
  const S_C = 0.090;                                                         // the corner of the mouth
  const mouthY = (s) => -0.010 - 0.054 * pow(clamp(s / S_C, 0, 1), 1.2);    // the line of the closed mouth, from the side
  const cleftS = (y) => 0.192 - 0.55 * max(-0.01 - y, 0);                     // the cleft between head and trunk armour
  // where the plates of the armour are, at s and height y: the same map as `armP` in the shader (head shield without lip
  // and tip of the snout, trunk armour to its rear rim, the plate of the belly)
  const armour = (s, y) => {
    const [T, B] = at(s), v = clamp((y - B) / (T - B), 0, 1), g = cleftS(y), my = mouthY(s) - 0.9 * max(s - S_C, 0);
    const rimS = max(0.218 + 0.76 * (y + 0.088), 0.192), vent = sm(0.13, 0.15, s) * (1 - sm(0.44, 0.47, s)) * (1 - sm(0.07, 0.11, v));
    const head = sm(0.003, 0.008, g - s) * sm(0.006, 0.014, y - my) * sm(0.008, 0.018, s);
    const trunk = sm(0.003, 0.008, s - g) * max(sm(0, 0.005, rimS - s), vent);
    return min(head + trunk, 1);
  };
  // a point on the skin: s along the body, a around it (0 the right flank, PI / 2 the back)
  const skin = (s, a) => {
    const [T, B, W, n, q] = at(s), ym = B + (T - B) * q, c = cos(a), sn = sin(a);
    let x = W * (c < 0 ? -1 : 1) * pow(abs(c), 2 / n), y = sn >= 0 ? ym + (T - ym) * pow(sn, 2 / n) : ym - (ym - B) * pow(-sn, 2 / n);
    // the plates stand out of the skin by their thickness (estimate; the bone is 1 to 2.5 cm thick, the nuchal plate more)
    const th = 0.005 * armour(s, y), r = hypot(x, y - ym) || 1; x += x / r * th; y += (y - ym) / r * th;
    const k = 1 - 0.045 * exp(-pow((s - cleftS(y)) / 0.007, 2));             // the cleft is a groove in the one skin
    // a heavy ridge of bone over the eye, standing out sideways under the edge of the roof (estimate: the eye sits deep)
    x += (x < 0 ? -1 : 1) * 0.011 * exp(-pow((s - 0.050) / 0.028, 2)) * exp(-pow((y - 0.041) / 0.0075, 2)) * sm(0.004, 0.014, s);
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

  // rings: every 0.004 as far as the armour goes (0.50), every 0.01 behind it. Each ring is an upper arc (MU steps, from the right corner
  // of the mouth over the back to the left) and a lower arc (ML steps, back under the belly). As far as the mouth
  // goes, the two arcs have ends of their own, so that the mouth can open; behind it they share them.
  const MU = 36, ML = 26, MP = 12, RS = [], rings = [];
  for (let k = 1; k <= 55; k++) RS.push(k * 0.004);
  for (let k = 1; k <= 70; k++) RS.push(0.22 + k * 0.004);
  for (let k = 1; k <= 36; k++) RS.push(0.50 + k * 0.01);
  const aC = angY(S_C, mouthY(S_C));
  for (const s of RS) {
    const split = s < S_C, a0 = split ? angY(s, mouthY(s)) : aC, U = [], L = [], R = { s, split, a0, U, L };
    for (let k = 0; k <= MU; k++) U.push(m.v(...skin(s, a0 + (PI - 2 * a0) * k / MU), 0));
    for (let k = 0; k <= ML; k++) {
      if (!split && (k === 0 || k === ML)) { L.push(k ? U[0] : U[MU]); continue; }
      const q = skin(s, PI - a0 + (PI + 2 * a0) * k / ML), jw = 1 - 0.20 * (1 - sm(0.004, 0.055, s));   // the jaw is narrower in front
      L.push(m.v(q[0] * jw, q[1], q[2] - 0.006 * (1 - sm(0, 0.035, s)), s < 0.127 ? 0.25 : 0));   // and shorter: the snout overhangs
    }
    if (split) {                                                             // the roof and the floor of the mouth
      const [xr, ym] = pos(U[0]), xl = pos(L[ML])[0], [T, B] = at(s); R.pal = []; R.flo = [];
      for (let k = 0; k <= MP; k++) { const th = PI * k / MP; R.pal.push(m.v(xr * cos(th), ym + 0.42 * (T - ym) * pow(sin(th), 0.8), 0.5 - s, -0.25)); }
      for (let k = 0; k <= MP; k++) { const th = PI * k / MP; R.flo.push(m.v(-xl * cos(th), ym - 0.38 * (ym - B) * pow(sin(th), 0.8), 0.5 - s - 0.006 * (1 - sm(0, 0.035, s)), -0.40)); }
    }
    rings.push(R);
  }
  // the cheek: on each side a strip of skin between the lips, from 0.04 behind the snout to the corner of the mouth. Shut,
  // it lies 0.003 inside the lips; open, it stretches (E2024 and EA: soft tissue at the mouth, a loose cheek). The front of
  // the mouth stays open, so the fangs show
  for (const right of [true, false]) {
    const A = [], B = [];
    for (const R of rings) {
      if (!R.split || R.s < 0.040) continue;
      const pu = pos(right ? R.U[0] : R.U[MU]), pl = pos(right ? R.L[ML] : R.L[0]), w = right ? -0.003 : 0.003;
      A.push(m.v(pu[0] + w, pu[1] - 0.0004, pu[2], -0.25)); B.push(m.v(pl[0] + w, pl[1] - 0.0016, pl[2], -0.40));   // coloured as the inside of the mouth
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
    // the snout: both halves of the mouth close to a point of their own
    const A = rings[0], y0 = mouthY(0), pu = m.v(0, y0 + 0.004, 0.5, 0), pl = m.v(0, y0 - 0.004, 0.494, 0.25), pp = m.v(0, y0 + 0.003, 0.499, -0.25), pf = m.v(0, y0 - 0.003, 0.493, -0.40);
    for (let k = 0; k < MU; k++) m.tri(pu, A.U[k], A.U[k + 1]);
    for (let k = 0; k < ML; k++) m.tri(pl, A.L[k], A.L[k + 1]);
    for (let k = 0; k < MP; k++) { m.tri(pp, A.pal[k + 1], A.pal[k]); m.tri(pf, A.flo[k + 1], A.flo[k]); }
    // the throat: a tunnel from the corner of the mouth back to the gills at the cleft (s = 0.185), narrowing. Four gill
    // arches stand into it from the sides and the floor (water goes in at the mouth and out at the cleft; four arches as in
    // most fishes, not counted for Dunkleosteus). Its roof moves with the head, its floor with the jaw
    const C = rings[js], D = rings[js + 1];
    {
      const xr = pos(C.pal[0])[0], ymc = pos(C.pal[0])[1], hu = pos(C.pal[MP / 2])[1] - ymc, hl = ymc - pos(C.flo[MP / 2])[1], sC = C.s, N = 18, S1 = 0.185;
      const arch = (s) => 1 - 0.20 * [0.120, 0.137, 0.154, 0.171].reduce((a, g) => a + exp(-pow((s - g) / 0.0035, 2)), 0);
      const T = [C.pal.concat(C.flo)];
      for (let k = 1; k <= N; k++) {
        const u = k / N, s = sC + (S1 - sC) * u, yc = ymc + 0.012 * u, w = (xr + (0.036 - xr) * pow(u, 0.8)), a = arch(s);
        const up = (hu + (0.028 - hu) * u), lo = (hl + (0.026 - hl) * u) * a, ring = [];
        for (let j = 0; j <= MP; j++) { const th = PI * j / MP; ring.push(m.v(w * a * cos(th), yc + up * pow(sin(th), 0.8), 0.5 - s, -0.25)); }
        for (let j = 0; j <= MP; j++) { const th = PI * j / MP; ring.push(m.v(-w * a * cos(th), yc - lo * pow(sin(th), 0.8), 0.5 - s, -0.40)); }
        T.push(ring);
      }
      // the faces look in, to the middle of the tunnel
      const a0 = pos(T[1][MP / 2]), f0 = crs(sub(pos(T[1][MP / 2 + 1]), a0), sub(pos(T[2][MP / 2]), a0)), fl = f0[1] > 0;
      const n2 = 2 * (MP + 1);
      for (let k = 0; k < N; k++) for (let e = 0; e < n2; e++) {
        const e2 = (e + 1) % n2; fl ? m.quad(T[k][e], T[k + 1][e], T[k + 1][e2], T[k][e2]) : m.quad(T[k][e], T[k][e2], T[k + 1][e2], T[k + 1][e]);
      }
      const E = T[N], ce = m.v(0, ymc + 0.012, 0.5 - S1 - 0.004, -0.25);
      for (let e = 0; e < n2; e++) { const e2 = (e + 1) % n2; fl ? m.tri(E[e], ce, E[e2]) : m.tri(E[e], E[e2], ce); }
    }
    // the corners of the mouth: skin between the two lips and the first whole ring
    m.tri(C.U[0], C.L[ML], D.U[0]); m.tri(C.L[0], C.U[MU], D.U[MU]);
    // the end of the tail stalk (inside the tail fin)
    const E = rings[rings.length - 1], [T, B] = at(E.s), pe = m.v(0, (T + B) / 2, 0.5 - E.s - 0.004, 0);
    for (let k = 0; k < MU; k++) m.tri(pe, E.U[k + 1], E.U[k]);
    for (let k = 0; k < ML; k++) m.tri(pe, E.L[k + 1], E.L[k]);
  }

  // ---------------------------------------------------------------- the bones of the jaws
  // Dunkleosteus had no teeth. Its jaws are plates of bone (E2024, Fig. 3), drawn here after that figure:
  //   above, on each side, the ASG at the tip of the snout: a broad flat plate that ends in a hook, bent down and back;
  //   behind it the PSG, a blade with a straight cutting edge;
  //   below, on each side, the IG: a long bar whose front end bends up into a hook, with a notch behind the hook and a
  //   cutting edge behind the notch. The two hooks of the IG close behind those of the ASG: a beak.
  // Each plate is solid: in section a wedge, 0.006 to 0.009 thick at the gum, sharp at the edge. Its upper part is in
  // the gum (E2024 and EA: partly covered by soft tissue). Sizes read off Fig. 3 (50 cm scale bar, a fish of about
  // 4 m): the hook of the ASG about 0.028 of the length below the lip, the hook of the IG about 0.022 above it, the
  // blades 0.010 to 0.016. Read by eye, not measured. aux -0.55 moves with the head, -0.70 with the jaw
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
  // the edge of the lip at s: above on the head, below on the jaw (narrower and a little shorter, as the rings make it)
  const lipAt = (s, up) => {
    const a = angY(s, mouthY(s)), p = skin(s, a);
    if (up) return p;
    const jw = 1 - 0.20 * (1 - sm(0.004, 0.055, s));
    return [p[0] * jw, p[1], p[2] - 0.006 * (1 - sm(0, 0.035, s))];
  };
  // how far a plate stands out of the lip at s (its depth below the upper lip, or its height above the lower one)
  const hook = (s, s0, apex, s1, h, base) => s < s0 || s > s1 ? 0 : s < apex ? base + (h - base) * pow((s - s0) / (apex - s0), 1.6) : h * pow(1 - (s - apex) / (s1 - apex), 0.75);
  // the lip and the way out of it at s. For s < 0 the edge goes on round the blunt front of the snout to the middle, so
  // that the plates of both sides meet there and the front of the jaw is closed (fix of 2026-11-19). Each one reaches
  // 0.002 past the middle and keeps its full thickness to its end, so the two overlap and no seam shows
  const SF = 0.008, edge = (s, up) => {
    if (s >= 0) return [lipAt(s, up), outAt(s, angY(s, mouthY(s)))];
    const E0 = lipAt(0, up), o0 = outAt(0, angY(0, mouthY(0))), u = -s / SF, w = 1 - u;
    return [[-0.002 + (E0[0] + 0.002) * w, E0[1], E0[2]], nrm([o0[0] * w, 0, o0[2] * w + u])];
  };
  const PLATES = [
    // up, from, to, depth of the edge at s, thickness at the gum
    [true, -SF, 0.024, (s) => s < 0.003 ? 0.010 : hook(s, 0.003, 0.010, 0.024, 0.030, 0.010), 0.009],             // ASG
    [true, 0.025, 0.070, (s) => 0.004 + 0.012 * sm(0.025, 0.032, s) * (1 - sm(0.040, 0.066, s)) + 0.004 * (1 - sm(0.058, 0.070, s)), 0.007],   // PSG
    [false, -SF, 0.088, (s) => (s < 0.006 ? 0.008 : hook(s, 0.006, 0.012, 0.026, 0.024, 0.008)) + 0.004 + 0.009 * sm(0.030, 0.036, s) * (1 - sm(0.070, 0.086, s)), 0.009],   // IG
  ];
  for (const sx of [1, -1]) for (const [up, s0, s1, depth, th] of PLATES) {
    const V = [], mid = [], aux = up ? -0.55 : -0.70, dn = up ? -1 : 1, N = round((s1 - s0) / 0.0008);
    for (let k = 0; k <= N; k++) {
      const s = s0 + (s1 - s0) * k / N, [E, o] = edge(s, up);
      const f = 0.25 + 0.75 * (s0 < 0 ? 1 : sm(s0, s0 + 0.004, s)) * (1 - sm(s1 - 0.004, s1, s)), e = max(depth(s), 0.002), t = th * f;
      // the section, from the gum on the outside, down to the edge, up the inside: (out, along dn)
      const S = up ? [[0.0030 * f, -0.010], [0.0042 * f, 0.25 * e], [0.0020 * f, 0.75 * e], [0.0004, e], [0.0030 * f - t * 0.55, 0.70 * e], [0.0030 * f - t, 0.15 * e], [0.0030 * f - t, -0.010]]
                   : [[-0.0010 * f, -0.010], [0.0012 * f, 0.25 * e], [-0.0004 * f, 0.75 * e], [-0.0022, e], [-0.0010 * f - t * 0.55, 0.70 * e], [-0.0010 * f - t, 0.15 * e], [-0.0010 * f - t, -0.010]];
      const ring = S.map(([d, h]) => { const yy = E[1] + dn * h; return m.v(sx * (E[0] + o[0] * d), yy, E[2] + o[2] * d, aux); });
      V.push(ring); mid.push(closed(ring.map(pos)));
    }
    tubeFaces(V, mid);
  }

  // ---------------------------------------------------------------- the eyes
  // A low dome sunk in the skin, 0.020 across, in a raised ring of bone 0.030 across (E2024: socket 8.1 cm in a skull of a
  // 3.4 m fish, a cup-shaped sclerotic ring that bulges out). Iris and pupil are drawn by the shader
  const EYE_S = 0.042, EYE_Y = 0.024;
  for (const sx of [1, -1]) {
    const a = angY(EYE_S, EYE_Y), c = skin(EYE_S, a), e = 1e-3;
    const t1 = nrm(sub(skin(EYE_S + e, a), skin(EYE_S - e, a))), n0 = nrm(crs(sub(skin(EYE_S, a + e), skin(EYE_S, a - e)), t1)), n = n0[0] < 0 ? n0.map((v) => -v) : n0, t2 = crs(n, t1), rows = [];
    for (let k = 1; k <= 5; k++) {
      const la = k / 5 * PI / 2, row = [];
      for (let q = 0; q <= 14; q++) { const b = q / 14 * TAU, r = 0.0100 * sin(la), h = 0.0034 * cos(la) - 0.0012; row.push(m.v(sx * (c[0] + t1[0] * r * cos(b) + t2[0] * r * sin(b) + n[0] * h), c[1] + t1[1] * r * cos(b) + t2[1] * r * sin(b) + n[1] * h, c[2] + t1[2] * r * cos(b) + t2[2] * r * sin(b) + n[2] * h, -1)); }
      rows.push(row);
    }
    const top = m.v(sx * (c[0] + n[0] * 0.0022), c[1] + n[1] * 0.0022, c[2] + n[2] * 0.0022, -1);
    for (let q = 0; q < 14; q++) sx > 0 ? m.tri(top, rows[0][q + 1], rows[0][q]) : m.tri(top, rows[0][q], rows[0][q + 1]);
    for (let k = 0; k < 4; k++) band(rows[k], rows[k + 1], sx > 0);
    // the ring: a tube around the eye, 0.0122 from its middle, 0.0028 thick
    const RG = [];
    for (let q = 0; q <= 20; q++) {
      const b = q / 20 * TAU, row = [];
      for (let u = 0; u <= 8; u++) {
        const w = u / 8 * TAU, R0 = 0.0122 + 0.0028 * cos(w), hh = 0.0006 + 0.0028 * sin(w);
        row.push(m.v(sx * (c[0] + (t1[0] * cos(b) + t2[0] * sin(b)) * R0 + n[0] * hh), c[1] + (t1[1] * cos(b) + t2[1] * sin(b)) * R0 + n[1] * hh, c[2] + (t1[2] * cos(b) + t2[2] * sin(b)) * R0 + n[2] * hh, -1));
      }
      RG.push(row);
    }
    // which way round: the first face must look away from the middle of the tube
    const a0 = pos(RG[0][0]), f0 = crs(sub(pos(RG[1][0]), a0), sub(pos(RG[0][1]), a0)), ctr = [sx * (c[0] + t1[0] * 0.0122 + n[0] * 0.0006), c[1] + t1[1] * 0.0122 + n[1] * 0.0006, c[2] + t1[2] * 0.0122 + n[2] * 0.0006];
    const fl = dot(f0, sub(a0, ctr)) < 0;
    for (let q = 0; q < 20; q++) band(RG[q], RG[q + 1], fl);
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
  // pectoral fins. Outline measured off Fig. 4 of E2024: base from 0.165 to 0.285, low on the body in the gap of the
  // armour, a broad sickle with a round front edge and a nearly straight rear edge, 0.21 long. E2024 text: from tip to
  // tip about twice the width of the chest. That fits if they point 45 degrees down and outwards, as here (estimate)
  {
    const X = flank(0.225, -0.112)[0], D = (d) => [X - 0.02 + d * 0.707, -0.105 - d * 0.707];       // d along the fin
    const P = (s, d) => { const q = D(d); return V(s, q[0], q[1]); };
    const LE = [P(0.160, 0), P(0.176, 0.054), P(0.198, 0.108), P(0.232, 0.162), P(0.268, 0.205), P(0.300, 0.231)];
    const TE = [P(0.290, 0), P(0.287, 0.054), P(0.289, 0.108), P(0.295, 0.162), P(0.302, 0.205), P(0.304, 0.229)];
    const th = (t) => 0.012 * pow(1 - t, 0.8) + 0.0015;
    wing(LE, TE, th, 0.5, 14); wing(mir(LE), mir(TE), th, 0.5, 14);
  }
  // pelvic fins: small, at the rear end of the belly armour (E2024), outline after Fig. 4. aux 0.6: pale in Fig. 4
  {
    const r0 = flank(0.440, bot(0.440) + 0.022, 0.012), r1 = flank(0.500, bot(0.500) + 0.020, 0.012);
    const LE = [r0, V(0.462, r0[0] + 0.012, bot(0.462) - 0.012), V(0.488, r0[0] + 0.020, bot(0.488) - 0.036)], TE = [r1, V(0.502, r0[0] + 0.014, bot(0.502) - 0.010), V(0.494, r0[0] + 0.020, bot(0.494) - 0.034)];
    const th = (t) => 0.006 * (1 - t) + 0.0012;
    wing(LE, TE, th, 0.6); wing(mir(LE), mir(TE), th, 0.6);
  }
  // dorsal fin: one, tall and swept back like that of a shark, with a free tip at the rear. Outline measured off Fig. 4
  // of E2024: begins at 0.425 right behind the armour of the back, apex 0.125 above the back at 0.545. E2024 text: its
  // height is not known, so this is the author's drawing, not a fossil
  wing([V(0.415, 0, top(0.415) - 0.014), V(0.453, 0, 0.161), V(0.475, 0, 0.185), V(0.498, 0, 0.211), V(0.522, 0, 0.231), V(0.546, 0, 0.245)],
    [V(0.640, 0, top(0.640) - 0.012), V(0.668, 0, 0.097), V(0.622, 0, 0.113), V(0.590, 0, 0.133), V(0.566, 0, 0.170), V(0.550, 0, 0.243)], (t) => 0.010 * pow(1 - t, 0.8) + 0.0012, 0.5, 16);
  // anal fin: small. E2024 draws one, nothing of it is preserved. aux 0.6: pale in Fig. 4
  wing([V(0.585, 0, bot(0.585) + 0.012), V(0.612, 0, bot(0.612) - 0.014), V(0.640, 0, bot(0.640) - 0.034)],
    [V(0.655, 0, bot(0.655) + 0.012), V(0.652, 0, bot(0.652) - 0.012), V(0.644, 0, bot(0.644) - 0.032)], (t) => 0.005 * (1 - t) + 0.0012, 0.6);
  // tail fin, outline measured off Fig. 4 of E2024: 0.32 tall (E2024 text: at least as tall as the body is deep). The
  // upper lobe long and swept back, the lower one short and steep. No fossil of it exists
  const thT = (t) => 0.010 * pow(1 - t, 0.7) + 0.0015;
  wing([V(0.755, 0, 0.058), V(0.797, 0, 0.081), V(0.839, 0, 0.112), V(0.880, 0, 0.139), V(0.922, 0, 0.158), V(0.964, 0, 0.172), V(1.000, 0, 0.177)],
    [V(0.862, 0, 0.028), V(0.880, 0, 0.058), V(0.901, 0, 0.088), V(0.922, 0, 0.115), V(0.943, 0, 0.136), V(0.964, 0, 0.152), V(0.998, 0, 0.175)], thT, 0.5, 18);
  wing([V(0.750, 0, 0.006), V(0.779, 0, -0.019), V(0.803, 0, -0.049), V(0.827, 0, -0.082), V(0.851, 0, -0.111), V(0.874, 0, -0.139), V(0.886, 0, -0.147)],
    [V(0.862, 0, 0.036), V(0.860, 0, 0.000), V(0.866, 0, -0.036), V(0.873, 0, -0.066), V(0.879, 0, -0.096), V(0.884, 0, -0.126), V(0.887, 0, -0.146)], thT, 0.5, 18);
  // keels on the sides of the tail stalk (E2024: likely, not preserved)
  {
    const LE = [V(0.690, 0.040, 0.046), V(0.725, 0.044, 0.038), V(0.755, 0.042, 0.033), V(0.790, 0.030, 0.033), V(0.830, 0.006, 0.036)];
    const TE = [V(0.690, 0.034, 0.046), V(0.725, 0.022, 0.038), V(0.755, 0.016, 0.033), V(0.790, 0.010, 0.033), V(0.830, 0.003, 0.036)];
    const th = (t) => 0.005 * pow(sin(PI * clamp(t, 0.02, 0.98)), 0.6);
    wing(LE, TE, th, 0.5, 12); wing(mir(LE), mir(TE), th, 0.5, 12);
  }
  return m;
}
