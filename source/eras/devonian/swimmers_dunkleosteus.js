// ============================================================================
// devonian: Dunkleosteus
// ============================================================================
// The top hunter of its sea, 3.4 m typical, up to 4.1 m. Its mesh, its shaders and, for the zoo, where it is at a
// time. world.js lists it as a kind and gives it its instances. What it shares with the other animals of this era is
// in swimmers.js.

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

// ---------------------------------------------------------------- shaders
const S_DUNKLEOSTEUS = /*wgsl*/`
// ============================================================================
// Reference shaders for Dunkleosteus terrelli, sixth version (brief: docs/briefs/dunkleosteus-bone.md). The light is its own
// (dunkLight), not skinWet: skinWet puts a gloss on the smooth shape, and on bone and skin that reads as plastic
// ============================================================================
// Not loaded by the build. This is the whole text of S_DUNKLEOSTEUS for source/eras/devonian/swimmers_dunkleosteus.js,
// for the mesh of docs/briefs/ref/dunkleosteus-mesh.js (sixth version). patch is a reserved word: never use it as a name.
// It needs what W_ANIM gives every animal (S_B and W_HASH: ss, sat, hs, vn, fbm, wor, zone, fog, fin) and S_SEA
// (dodge, skinRelief, skinWet), which comes with the first kind of the era in world.js.
// The fragment shader was written twice: here, and in numpy for the reference picture. This text has not been
// compiled: run node tools/wgsl.mjs devonian first.
// s is the distance from the snout in body lengths (s = .5 - z of the rest position), y its height.

// Instance: a.xyz = centre of its path, a.w = radius R of its path. b.x = seed, b.y = cruising speed in m/s (the sign
// is the direction), b.z = length in metres (4.1), b.w = seed2. Path and distance along it are repeated in
// zooDunkleosteus: change one, change the other (brief: docs/briefs/devonian-giants-motion.md).

// where it swims: a wide circle with a slower one on top, so the path wanders and the turns differ; it rises and sinks
// a little. Every frequency is a multiple of 0.5, so the path repeats after 4 pi and the angle can be wrapped (a float
// keeps its precision). a: the angle along it, ph: the phase of this animal
fn dunkPath(c: vec3f, R: f32, a: f32, ph: f32) -> vec3f {
  return c + vec3f(R * cos(a) + .1 * R * cos(1.5 * a + ph), 1.5 * sin(2. * a + ph) + .5 * sin(3.5 * a + 2. * ph),
                   R * sin(a) + .1 * R * sin(1.5 * a + 1.7 * ph));
}

// where head and trunk armour meet, at height y: the gill opening (E2024, Fig. 3 and 4: it runs forwards below the cheek)
fn dunkCleft(y: f32) -> f32 { return .192 - .55 * max(0. - .01 - y, 0.); }
// the line of the shut mouth, and behind its corner (s = .09) the line to the hinge of the jaw
fn dunkMouthY(s: f32) -> f32 { return 0. - .010 - .054 * pow(sat(s / .090), 1.2) - .9 * max(s - .090, 0.); }
// back (x) and belly (y) of the body at s, every 0.05 from the snout: read off the mesh
fn dunkTB(s: f32) -> vec2f {
  var T = array<f32, 18>(.016, .057, .079, .092, .105, .128, .140, .146, .143, .138, .128, .114, .100, .088, .076, .064, .063, .069);
  var B = array<f32, 18>(-.029, -.091, -.119, -.143, -.149, -.151, -.153, -.151, -.143, -.127, -.111, -.089, -.062, -.034, -.012, -.002, .001, .008);
  let f = clamp(s * 20., 0., 16.999); let k = i32(f); let u = f - f32(k);
  return vec2f(mix(T[k], T[k + 1], u), mix(B[k], B[k + 1], u));
}
fn dunkSeg(p: vec2f, a: vec2f, b: vec2f) -> f32 { let pa = p - a; let ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
// a line of half width w at distance d. Where a pixel is wider than the line, the line gets wider and fainter instead of flickering
fn dunkLine(d: f32, w: f32, fw: f32) -> f32 { let ww = max(w, 1.2 * fw); let q = d / ww; return exp(0. - q * q) * (w / ww); }
// is a detail of size p still larger than a pixel?
fn dunkNear(p: f32, fw: f32) -> f32 { return 1. - ss(.2 * p, .5 * p, fw); }
// how far a point of the armour is from the nearest edge of a plate. p2: (s, y) on the flank, pt: (s, |x|) on the roof.
// The lines are schematic, after Fig. 3 and 4 of E2024
fn dunkEdge(p2: vec2f, pt: vec2f, gc: f32, rimS: f32, my: f32, roof: f32, vent: f32) -> f32 {
  var dH = dunkSeg(p2, vec2f(.060, .030), vec2f(.124, .035));                // the head: the frame of the cheek plate
  dH = min(dH, dunkSeg(p2, vec2f(.124, .035), vec2f(.176, -.016)));
  dH = min(dH, dunkSeg(p2, vec2f(.176, -.016), vec2f(.166, -.056)));
  dH = min(dH, dunkSeg(p2, vec2f(.060, .030), vec2f(.076, -.046)));
  dH = min(dH, dunkSeg(p2, vec2f(.062, .042), vec2f(.100, .064)));            // behind the eye
  dH = min(dH, dunkSeg(p2, vec2f(.124, .035), vec2f(.150, .075)));
  dH = min(dH, dunkSeg(p2, vec2f(.022, .004), vec2f(.030, .044)));            // in front of the eye
  var dT = dunkSeg(p2, vec2f(.192, .072), vec2f(.300, .072));                 // the trunk
  dT = min(dT, dunkSeg(p2, vec2f(.300, .072), vec2f(.345, .090)));
  dT = min(dT, dunkSeg(p2, vec2f(.305, .050), vec2f(.270, .046)));
  dT = min(dT, dunkSeg(p2, vec2f(.270, .046), vec2f(.240, -.006)));
  dT = min(dT, dunkSeg(p2, vec2f(.240, -.006), vec2f(.234, -.050)));
  dT = min(dT, dunkSeg(p2, vec2f(.270, .046), vec2f(.267, .072)));
  var dR = dunkSeg(pt, vec2f(.020, 0.), vec2f(.190, 0.));                     // the roof
  dR = min(dR, dunkSeg(pt, vec2f(.095, 0.), vec2f(.095, .050)));
  dR = min(dR, dunkSeg(pt, vec2f(.030, .030), vec2f(.095, .050)));
  dR = min(dR, dunkSeg(pt, vec2f(.095, .050), vec2f(.190, .070)));
  dR = min(dR, dunkSeg(pt, vec2f(.195, .060), vec2f(.300, .060)));
  dR = min(dR, dunkSeg(pt, vec2f(.300, .060), vec2f(.390, 0.)));
  let s = p2.x; let y = p2.y; let ax = pt.y;
  let dSide = min(dH + 9. * step(gc, s), dT + 9. * step(s, gc));
  var d = min(dSide + .04 * roof, dR + .04 * (1. - roof));
  d = min(d, min(abs(s - .300), ax + .04 * (1. - vent)) + .04 * (1. - vent));   // the plates of the belly
  d = min(d, min(abs(s - gc), abs(s - rimS) + .04 * vent));                     // the cleft and the rear rim
  return min(d, abs(y - my) + .03 * step(.13, s));                              // the lip
}
// the nearest and the second nearest point of a field of cells, in cell units. F2 - F1 is 0 on the border of two cells:
// cracks that cut a skin into fields of many corners
fn dunkCrackle(p: vec3f) -> vec2f {
  let i = floor(p); let f = fract(p); var d1 = 9.; var d2 = 9.;
  for (var x = -1; x <= 1; x++) { for (var y = -1; y <= 1; y++) { for (var z = -1; z <= 1; z++) {
    let o = vec3f(f32(x), f32(y), f32(z)); let r = o + h33(i + o) - f; let d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
  } } }
  return vec2f(sqrt(d1), sqrt(d2));
}
// The light of the Dunkleosteus. As skinWet of S_SEA, but: the sun comes through the flecks of the surface (caus, as for
// the Kentuckia); the light from around is darkened in cavities (ao); the sheen is on the surface with its relief, broad
// where the surface is rough (shin low) and weak (spec); a wet sheen on the smooth shape only where wet says so (mouth,
// eye, the jaws)
fn dunkLight(alb: vec3f, n: vec3f, ns: vec3f, wp: vec3f, spec: f32, shin: f32, wet: f32, ao: f32) -> vec3f {
  let V = normalize(g.cam.xyz - wp); let z = zone(wp); let L = g.sun.xyz; let H = normalize(V + L);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  let Ec = E * (.45 + .55 * caus(wp, length(g.cam.xyz - wp)));
  let around = amb(wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vol(wp).g, z) * 1.1 + side(wp, n, 1., z) * .8;
  return alb * (Ec * sat(dot(n, L)) * .65 + around * ao)
    + Ec * spec * (shin + 8.) / 40. * pow(sat(dot(n, H)), shin)
    + E * wet * pow(sat(dot(ns, H)), 70.);
}
// a positive angle turns the nose DOWN
fn dunkRotY(p: vec3f, pivot: vec3f, angle: f32) -> vec3f {
  let d = p - pivot; let ca = cos(angle); let sa = sin(angle);
  return pivot + vec3f(d.x, d.y * ca - d.z * sa, d.y * sa + d.z * ca);
}
fn dunkRotN(nn: vec3f, angle: f32) -> vec3f { let ca = cos(angle); let sa = sin(angle); return vec3f(nn.x, nn.y * ca - nn.z * sa, nn.y * sa + nn.z * ca); }

// where in its cycle hunt number k of the animal with seed s begins, as a part of the cycle: 0.05 to 0.55, scattered
// (the golden ratio spreads the places; the sine shakes them). Small numbers only, so it gives the same in f32 as in
// the f64 of zooDunkleosteus
fn dunkHunt(k: f32, s: f32) -> f32 { return .05 + .5 * fract(.618034 * k + .37 * sin(2.3 * k + 9. * s) + 3.1 * s); }
// the distance covered under a speed that rises as a smoothstep from 0 to 1 over x = 0 to 1 (the integral of it)
fn dunkRamp(x: f32) -> f32 { return select(select(x - .5, x * x * x - .5 * x * x * x * x, x < 1.), 0., x <= 0.); }

@vertex fn vsDunkleosteus(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let R = i.a.w; let ph = i.b.w * 17.; let sz = i.b.z;
  let v0 = abs(i.b.y); let L = .9 * R;               // L: metres of path per radian, about
  // ---- how far it has swum. It cruises slowly (b.y, 0.35 to 0.55 m/s); the speed swells and ebbs a little (two
  // waves, 25 and 15 %, its own for each one)
  let f1 = .031 + .02 * fract(s * 7.31); let f2 = .083 + .03 * fract(s * 3.17);
  let q1 = f1 * t + 6.3 * fract(s * 5.13); let q2 = f2 * t + 6.3 * fract(s * 9.71);
  var dist = v0 * (t + .25 / f1 * sin(q1) + .15 / f2 * sin(q2));
  var vr = 1. + .25 * cos(q1) + .15 * cos(q2);       // speed in cruising speeds
  // ---- the hunt. Its time is cut into cycles of 35 to 55 s, one hunt in each, at a place in the cycle that changes
  // from cycle to cycle (dunkHunt): so the hunts come 15 s to more than a minute apart, never on a beat. A hunt: in
  // 1 s it speeds up by vb (2 to 2.6 m/s, so it races at 2.4 to 3.2 m/s), chases for 3 to 5 s with its mouth open,
  // snaps at the end and slows down again in 2.5 s. tau: seconds since this hunt began (below 0: not yet in this
  // cycle). Every hunt adds the same distance, so the distance needs no sum over the hunts before
  let hPer = 35. + 20. * fract(s * 13.7);
  let hc = t / hPer + fract(s * 2.9); let hk = floor(hc);
  let tau = fract(hc) * hPer - hPer * dunkHunt(hk, s);
  let tb = 3. + 2. * fract(s * 5.9); let vb = 2. + .6 * fract(s * 8.3);
  let te = 1. + tb;                                   // the chase ends, the snap
  dist += vb * (hk * (te + .75) + dunkRamp(tau) - 2.5 * dunkRamp((tau - te) / 2.5));
  let vx = vb * (ss(0., 1., tau) - ss(te, te + 2.5, tau));
  vr += vx / v0;
  let chase = ss(0., .8, tau) * (1. - ss(te, te + .4, tau));
  let push = ss(0., .3, tau) * (1. - ss(1., 1.8, tau));      // the tail drives hard as it speeds up
  let glide = ss(te + .2, te + .8, tau) * (1. - ss(te + 3., te + 7., tau));   // little tail while it slows down
  // ---- the mouth. While it chases, the mouth stands open about half way and works a little. At the end the snap:
  // wide open in 0.06 s (Anderson and Westneat 2007: in a fiftieth of a second, which is one frame), open 0.2 s,
  // shut in 0.12 s. Then it swallows: three smaller openings, each less wide. Between the hunts it only breathes: the
  // mouth opens a little every 4.5 to 6 s, more for half a minute after a hunt
  let sT = tau - te + .1;
  let snap = sat(sT / .06) * (1. - sat((sT - .21) / .12));
  let gape = (.42 + .06 * sin(TAU * 1.3 * t + 20. * s)) * ss(.2, 1.2, tau) * (1. - ss(te - .1, te - .04, tau));
  let cq = (tau - te - 1.5) / 1.1;
  let cw = sin(3.14159 * sat(fract(cq) / .55));
  let chew = (.30 - .07 * floor(cq)) * cw * cw * step(0., cq) * step(cq, 2.999);
  let bc = .5 - .5 * cos(TAU * t / (4.5 + 1.5 * fract(s * 4.3)) + 6.3 * fract(s * 8.9));
  let tA = select(tau, fract(hc) * hPer + hPer * (1. - dunkHunt(hk - 1., s)), tau < te);   // since the last snap began
  let aft = 1. - ss(4., 30., tA - te);
  let br = (.05 + .07 * aft) * bc * bc;
  let mo = max(max(snap, gape), max(chew, br));
  // ---- where on its path, and which way it faces. kl: how sharply the path turns, per body length (+ toward S)
  var a = sign(i.b.y) * dist / L + i.b.w * 6.3 + s * 2.1;
  a -= 12.566371 * floor(a / 12.566371);
  let e = .6 / L;
  let P = dunkPath(i.a.xyz, R, a, ph);
  let Pa = dunkPath(i.a.xyz, R, a + e, ph); let Pb = dunkPath(i.a.xyz, R, a - e, ph);
  let dd = .5 * length(Pa - Pb);
  let T = (Pa - Pb) / (2. * dd) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let kl = clamp(dot(Pa + Pb - 2. * P, S) / (dd * dd) * sz, -.6, .6);
  var l = i.p; var n = i.n.xyz;
  let lt = i.n.w;
  let sR = .5 - i.p.z; let cl = dunkCleft(i.p.y);
  let isFin = step(.4, lt);
  let isJaw = sat(step(abs(lt - .25), .04) + step(abs(lt + .40), .04) + step(abs(lt + .70), .04));
  let wJ = (1. - ss(.090, .125, sR)) * ss(.004, .024, cl - sR) * isJaw;
  let wH = (1. - ss(cl - .014, cl + .010, sR)) * (1. - isFin);
  let jawA = (.12 + .68 * mo) * wJ;                 // the jaw drops about its hinge: 7 degrees at rest, 46 wide open
  let headA = (0. - .02 - .28 * mo) * wH;           // the head lifts about the joint of the neck: 1 at rest, 17 wide open
  l = dunkRotY(l, vec3f(0., -.105, .365), jawA);
  l = dunkRotY(l, vec3f(0., .055, .305), headA);
  n = dunkRotN(dunkRotN(n, jawA), headA);
  // ---- the tail beat: one beat per 0.65 body lengths swum, so it beats faster when it swims faster (once in 6 s while
  // it cruises, about once a second in the chase). Wider in the push and in the chase, small while it slows down
  let amp = (.85 + .15 * min(vr, 2.)) * (1. + .6 * push + .3 * chase) * (1. - .7 * glide);
  let bp = TAU * dist / (.65 * sz) + s * 30.;
  // ---- the pectoral fins turn about a hinge at their root (+ up and out, - down along the flank): while it cruises
  // they scull and steer (the fin on the inside of the turn goes down); in the chase they lie down along the flanks,
  // out of the water's way; after the snap they spread out to brake
  let sx = select(-1., 1., i.p.x >= 0.);
  let pw = isFin * (1. - ss(.31, .35, sR)) * ss(.09, .14, abs(i.p.x));
  let up = .10 * (1. - .7 * chase) * sin(.5 * bp + 6.3 * s) * (1. - glide)
    - clamp(1.5 * kl, -.25, .25) * sx * (1. - .6 * chase) - .40 * chase + .30 * glide;
  let fa = sx * up * pw;
  let hg = vec2f(sx * .09, -.14); let dq = l.xy - hg;
  l = vec3f(hg + vec2f(dq.x * cos(fa) - dq.y * sin(fa), dq.x * sin(fa) + dq.y * cos(fa)), l.z);
  n = vec3f(n.x * cos(fa) - n.y * sin(fa), n.x * sin(fa) + n.y * cos(fa), n.z);
  // ---- the body. The stiff front swings a little against the tail (recoil). The wave runs back from the middle, stiff
  // under the armour (E2024), its wavelength about one body length, so the tail lags behind the stalk. In a turn the
  // body lies along the curve of its path, the armoured front less
  let yr = .03 * amp * sin(bp - .9);
  let u = max(0., 0. - l.z);
  let wv = bp + 6. * l.z;
  let Aw = .26 * amp;
  let bw = .3 + .7 * ss(-.05, .25, 0. - l.z);
  let zc = l.z;
  l.x += yr * (zc - .1) + Aw * u * u * sin(wv) + .5 * kl * zc * zc * bw;
  let sl = yr + Aw * (6. * u * u * cos(wv) - 2. * u * sin(wv)) + kl * zc * bw;
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  // ---- it banks into the turn, more when fast
  let rb = 0. - clamp(.6 * kl * min(vr, 1.5), -.2, .2);
  l = vec3f(l.x * cos(rb) - l.y * sin(rb), l.x * sin(rb) + l.y * cos(rb), l.z);
  n = vec3f(n.x * cos(rb) - n.y * sin(rb), n.x * sin(rb) + n.y * cos(rb), n.z);
  let w = dodge(P, sz + 4. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
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

@fragment fn fsDunkleosteus(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let lt = i.lt; let sd = i.sd; let op = i.op;
  let ax = abs(op.x); let y = op.y; let s = .5 - op.z; let p2 = vec2f(s, y);
  let fw = max(fwidth(op.x), max(fwidth(op.y), fwidth(op.z)));        // how much of the body one pixel covers
  // ---- parts by aux
  let hull = step(-.13, lt) * step(lt, .35); let fins = step(.4, lt);
  let mouthP = step(-.47, lt) * step(lt, -.13); let boneP = step(-.85, lt) * step(lt, -.47); let eyeP = step(lt, -.9);
  let tb = dunkTB(s); let top = tb.x; let v = sat((y - tb.y) / (tb.x - tb.y));   // v: 0 at the belly, 1 at the back
  let gc = dunkCleft(y); let my = dunkMouthY(s);
  // ---- where the armour is (rear rim and belly plate after Fig. 3 and 4 of E2024)
  let rimS = max(.218 + .76 * (y + .088), .192);
  let vent = ss(.13, .15, s) * (1. - ss(.44, .47, s)) * (1. - ss(.07, .11, v));
  let jawP = ss(.003, -.003, y - my) * ss(.002, .008, gc - s) * hull;
  let lip = (1. - ss(.003, .009, abs(y - my))) * step(s, .092) * hull;
  let snout = 1. - ss(.002, .006, s);
  let headP = ss(.003, .008, gc - s) * (1. - max(max(lip, snout), jawP)) * hull;
  let trunkP = ss(.003, .008, s - gc) * max(ss(0., .005, rimS - s), vent) * hull;
  let armP = sat(headP + trunkP); let skinP = hull * (1. - armP);
  // ---- plate edges, noise
  let roof = ss(top - .032, top - .012, y);
  let dB = dunkEdge(p2, vec2f(s, ax), gc, rimS, my, roof, vent);
  let big = fbm(op * 7. + sd * 11., 3); let mid = fbm(op * 30. + sd * 3., 3); let hue = fbm(op * 3. + sd * 23. + 5., 2);
  let n4 = dunkNear(.004, fw); let n2 = dunkNear(.002, fw); let n6 = dunkNear(.006, fw);
  var fine = .5; var pits = .5; var ca = vec2f(.5, 1.); var cb = vec2f(.5, 1.);
  if (n6 > .01) { ca = dunkCrackle(op * 70. + sd * 4.); }
  if (n4 > .01) { cb = dunkCrackle(op * 220. + sd * 9.); fine = vn(op * 160. + sd * 7.); }
  if (n2 > .01) { pits = wor(op * 520.); }
  // ---- colours. Bone: grey with ochre and olive in it, never one tone. Skin: nearly black, olive and brown in it.
  // The colour of the living animal is not known: this is a choice
  let BONE = vec3f(.48, .45, .36); let SKIN = vec3f(.040, .040, .034); let BELLY = vec3f(.52, .50, .40);
  let boneC = BONE * mix(vec3f(.92, .97, 1.04), vec3f(1.08, .98, .80), hue);
  let skinC = SKIN * mix(vec3f(.85, 1.05, .95), vec3f(1.15, 1., .85), hue);
  var alb = mix(skinC, boneC, armP) * (.70 + .60 * big) * (.85 + .30 * mid) * (.90 + .20 * fine * n4);
  let blot = ss(.56, .66, fbm(op * 15. + sd * 5., 3));
  alb *= 1. - (.55 * skinP + .25 * armP) * blot;                                  // dark blotches, fainter on the plates
  alb *= 1. - .35 * armP * ss(.55, .72, fbm(op * 6. + sd * 17. + 3., 3));         // stains on old bone
  let vb = .23 + .14 * (fbm(vec3f(s * 7., sd * 3., ax * 3.), 2) - .5);
  let belly = (1. - ss(vb - .035, vb + .035, v)) * ss(.10, .17, s) * hull;       // the belly: a ragged border, not under the head
  alb = mix(alb, BELLY * (.85 + .3 * mid) * (1. - .35 * blot), belly);
  var hgt = .0030 * armP;                                                         // the armour stands proud of the skin
  // ---- the plates: low domes. The joints a narrow groove between two raised lips of bone (the skin pulled over the edges
  // of the plates), not a painted line
  hgt += .0050 * sqrt(sat(dB / .022)) * armP;
  let groove = dunkLine(dB, .0010, fw) * armP; let lipB = dunkLine(dB, .0034, fw) * armP;
  hgt += .0018 * lipB - .0030 * groove;
  alb *= (1. - .55 * groove) * (1. + .25 * (lipB - groove));
  // ---- the skin over everything, as on an elephant or a crocodile: cracks that cut it into fields of many corners, each
  // field a little domed. Large fields (about 5 cm at 3.7 m) and small ones (about 1.7 cm) in them. Deeper here, fainter there
  let bigC = (1. - ss(0., .12, ca.y - ca.x)) * n6;
  let smC = (1. - ss(0., .10, cb.y - cb.x)) * n4;
  let wrk = (bigC * (skinP + .7 * armP) + .4 * smC * hull) * (.45 + 1.1 * mid);
  hgt += 0. - .0011 * wrk + (.0006 * (.45 - ca.x) * n6 + .0005 * (.45 - cb.x) * n4) * hull + .00025 * (.5 - pits) * n2 * armP;
  // ---- cavities: dark in the grooves and the cracks, both the colour and the light from around
  let ao = sat(1. - .60 * groove - .45 * wrk);
  alb *= .55 + .45 * ao;
  // the keel of the plate of the back, the ridge along the edge of the roof, the lateral line (E2024: it ends on the armour)
  let keel = dunkLine(ax, .0030, fw) * trunkP * step(0., y);
  let brow = dunkLine(abs(y - (top - .022)), .0030, fw) * headP * ss(.030, .045, s);
  let lat = dunkLine(abs(y - (top - .062)), .0016, fw) * armP * ss(.05, .07, s);
  hgt += .0020 * (keel + brow) - .0006 * lat;
  // ---- scars: gouges, a dark furrow with a light lip, placed by the seed and not the same on both sides (Scott and others
  // 2012: possible bite marks of another arthrodire on a plate of Dunkleosteus)
  let so = (sd - .5) * .05; let sg = sign(op.x) * .012;
  var dg = 9.;
  for (var k = 0; k < 3; k++) {
    let kf = f32(k);
    dg = min(dg, dunkSeg(p2, vec2f(.222 - so + .008 * kf, .112 - .004 * kf + sg), vec2f(.250 - so + .008 * kf, .088 - .004 * kf + sg)));
    dg = min(dg, dunkSeg(p2, vec2f(.330 + so + .007 * kf, .040 + sg), vec2f(.352 + so + .007 * kf, .010 + sg)));
  }
  let core = dunkLine(dg, .0010, fw); let lipS = sat(dunkLine(dg, .0028, fw) - core); let scar = armP * n4;
  alb *= (1. - .55 * core * scar) * (1. + .35 * lipS * scar); hgt += 0. - .0012 * core * scar + .0004 * lipS * scar;
  // folds where the body bends, folds on the cheek
  let fold = vn(vec3f(s * 95., y * 7., ax * 7.));
  hgt += .0011 * (fold - .5) * ss(.48, .58, s) * skinP * dunkNear(.011, fw);
  let cheekf = dunkLine(dunkSeg(p2, vec2f(.100, -.062), vec2f(.170, -.040)), .0030, fw) + dunkLine(dunkSeg(p2, vec2f(.104, -.074), vec2f(.160, -.066)), .0030, fw);
  hgt -= .0012 * cheekf * hull * step(s, gc);
  // the cleft, the lips, the nostrils, a dark mask round the eye
  let c1 = (s - gc) / .0045;
  alb = mix(alb, vec3f(.010, .009, .008), exp(0. - c1 * c1) * hull);
  alb = mix(alb, SKIN * 1.5, lip);
  let nose = max(step(length(p2 - vec2f(.010, .006)), .0030), step(length(p2 - vec2f(.017, .013)), .0028)) * hull;
  hgt -= .002 * nose; alb *= 1. - .7 * nose;
  let ed0 = length(p2 - vec2f(.042, .024));
  alb *= 1. - .70 * (1. - ss(.012, .036, ed0)) * hull;
  // ---- fins: dark, blotched
  alb = mix(alb, skinC * 1.1 * (.75 + .5 * big) * (1. - .5 * blot) * (.55 + .45 * ao), fins);
  // ---- the plates of the jaws: the same bone as the armour, lighter where they are worn, stained grey brown at the gum,
  // lines of growth along the edge, pits. No white, no enamel: they are bone
  let dl = abs(y - my);
  var pl = mix(BONE * vec3f(.55, .50, .44), BONE * vec3f(1.30, 1.26, 1.18), ss(.002, .020, dl));
  pl *= (1. - .14 * (.5 + .5 * cos(dl * TAU / .0030)) * dunkNear(.003, fw)) * (1. - .30 * ss(.55, .80, vn(vec3f(s * 220., dl * 25., ax * 30.))))
    * (.85 + .3 * mid) * (1. - .25 * ss(.3, .05, pits) * n2);
  alb = mix(alb, pl, boneP);
  // ---- inside the mouth and the throat: flesh at the lips, darker the deeper it goes but never black, soft folds, ridges
  // across the roof, and at the back the four gill arches, red with blood
  let deep = ss(0., .19, s);
  var inner = mix(vec3f(.17, .05, .042), vec3f(.03, .010, .009), pow(deep, .7));
  let ridge = (dunkLine(abs(s - .030), .0030, fw) + dunkLine(abs(s - .046), .0030, fw) + dunkLine(abs(s - .062), .0030, fw)
    + dunkLine(abs(s - .078), .0030, fw)) * step(lt, -.2) * step(-.3, lt);
  var gill = 0.;
  for (var k = 0; k < 4; k++) { gill += dunkLine(abs(s - (.120 + .017 * f32(k))), .0045, fw); }
  inner = mix(inner, vec3f(.36, .06, .05), sat(gill) * ss(.10, .115, s)) * (1. + .5 * ridge);
  let mfold = vn(vec3f(s * 20., y * 140., ax * 140.));
  alb = mix(alb, inner * (.85 + .3 * mid) * (.75 + .5 * mfold), mouthP);
  hgt += (.0015 * ridge + .0012 * (mfold - .5)) * mouthP;
  // ---- eye: black pupil, a narrow dark amber iris, a black rim, and round it the ring of bone, stained dark
  let ev = p2 - vec2f(.042, .024); let ed = length(ev);
  let iris = vec3f(.55, .30, .06) * (.6 + .6 * fract(atan2(ev.y, ev.x) * 2.6 + 3. * ed / .0066)) * (1.2 - .7 * ss(.0046, .0066, ed));
  var eyeC = BONE * .38 * (.8 + .4 * mid);
  eyeC = mix(eyeC, vec3f(.010, .009, .007), step(ed, .0098));
  eyeC = mix(eyeC, iris, step(ed, .0066));
  eyeC = mix(eyeC, vec3f(.003), step(ed, .0046));
  alb = mix(alb, eyeC, eyeP);
  alb *= .92 + .16 * fract(sd * 13.7);
  // ---- dead on the floor (devonian-remains.md): duller and darker, black mud settled on what faces up
  let deadF = step(5., i.sd); let deadUp = ss(.15, .75, normalize(i.n).y);
  alb = mix(alb, mix(alb * .55, vec3f(.030, .028, .024) * (.8 + .4 * vn(i.wp * 6.)), .85 * deadUp), deadF);
  // ---- light. The relief is in body lengths: times the size of the animal
  let n = skinRelief(ns, i.wp, hgt * 4.2);
  let ring = eyeP * step(.0098, ed); let pup = eyeP - ring;
  let rough = (.35 + .9 * mid) * ao;
  let spec = (.22 * armP + .10 * skinP + .10 * fins) * rough + .35 * boneP + .30 * mouthP + .10 * ring;
  let shin = 10. + 12. * armP + 20. * boneP + 30. * mouthP;
  let wet = .25 * boneP + .8 * mouthP + 3. * pup;
  let c = dunkLight(alb, n, ns, i.wp, spec, shin, wet, mix(1., ao, max(hull, fins)));
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;

// ---------------------------------------------------------------- zoo
// Where a Dunkleosteus is: the same path and the same distance along it as vsDunkleosteus (change one, change the
// other). Two parts, 5 m ahead and 5 m behind. Nothing here allocates: it runs in every frame
const dunkFr = (x) => x - floor(x);
// dunkHunt and dunkRamp of the shader
const dunkHunt = (k, s) => 0.05 + 0.5 * dunkFr(0.618034 * k + 0.37 * sin(2.3 * k + 9 * s) + 3.1 * s);
const dunkRamp = (x) => (x <= 0 ? 0 : x < 1 ? x * x * x - 0.5 * x * x * x * x : x - 0.5);
// metres swum along its path by time t: cruising speed v0 with its two slow swells, and the hunts
const dunkZooDist = (s, v0, t) => {
  const f1 = 0.031 + 0.02 * dunkFr(s * 7.31), f2 = 0.083 + 0.03 * dunkFr(s * 3.17);
  const q1 = f1 * t + 6.3 * dunkFr(s * 5.13), q2 = f2 * t + 6.3 * dunkFr(s * 9.71);
  const hPer = 35 + 20 * dunkFr(s * 13.7), hc = t / hPer + dunkFr(s * 2.9), hk = floor(hc);
  const tau = dunkFr(hc) * hPer - hPer * dunkHunt(hk, s);
  const te = 1 + 3 + 2 * dunkFr(s * 5.9), vb = 2 + 0.6 * dunkFr(s * 8.3);
  return v0 * (t + 0.25 / f1 * sin(q1) + 0.15 / f2 * sin(q2))
    + vb * (hk * (te + 0.75) + dunkRamp(tau) - 2.5 * dunkRamp((tau - te) / 2.5));
};
// the point of its path at angle g, written to ZP at k (dunkPath in the shader)
const dunkZooPath = (a, i, g, k) => {
  const R = a[i + 3], ph = a[i + 7] * 17;
  ZP[k] = a[i] + R * cos(g) + 0.1 * R * cos(1.5 * g + ph);
  ZP[k + 1] = a[i + 1] + 1.5 * sin(2 * g + ph) + 0.5 * sin(3.5 * g + 2 * ph);
  ZP[k + 2] = a[i + 2] + R * sin(g) + 0.1 * R * sin(1.5 * g + 1.7 * ph);
};
const zooDunkleosteus = (a, i, part) => {
  const L = 0.9 * a[i + 3], v = a[i + 5];
  const g = (v < 0 ? -1 : 1) * dunkZooDist(a[i + 4], abs(v), F[TIME]) / L + a[i + 7] * 6.3 + a[i + 4] * 2.1;
  dunkZooPath(a, i, g, 0); dunkZooPath(a, i, g + (part * 2 - 1) * 5 / L, 3);
  ZP[3] -= ZP[0]; ZP[4] -= ZP[1]; ZP[5] -= ZP[2]; ZP[7] = 5.0;
};
