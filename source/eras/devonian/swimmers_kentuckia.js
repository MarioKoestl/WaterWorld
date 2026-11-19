// ============================================================================
// devonian: Kentuckia
// ============================================================================
// A small ray-finned fish, about 10 cm, in schools of about 150. Its mesh, its shaders and, for the zoo, where it
// is at a time. world.js lists it as a kind and gives it its instances. What it shares with the other animals of
// this era (pieces for the mesh, the light on a skin, giving way to the viewer) is in swimmers.js.

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

// ---------------------------------------------------------------- shaders
const S_KENTUCKIA = /*wgsl*/`
// ============================================================================
// Reference shaders for Kentuckia (brief: docs/briefs/kentuckia-build.md)
// ============================================================================
// Not loaded by the build. This is the whole text of S_KENTUCKIA for source/eras/devonian/swimmers_kentuckia.js, for
// the mesh of docs/briefs/ref/kentuckia-mesh.js. It needs what W_ANIM gives every animal (S_B and W_HASH: ss, sat,
// hs, vn, fbm, zone, fog, fin) and S_SEA (dodge, skinRelief), which comes with it in world.js. This text has not been
// compiled: run node tools/wgsl.mjs devonian first.
// s is the distance from the snout in body lengths (s = .5 - z of the rest position), y its height.

// Instance (unchanged): a.xyz = centre of the school's path, a.w = its radius R. b.x = seed of the fish, b.y = speed of
// the school in radians per second (the sign is the direction), b.z = length in metres, b.w = seed of the school. The
// path of the school is repeated in zooKentuckia: change one, change the other.

// back (x) and belly (y) of the body at s, every 0.05 from the snout: read off the mesh
fn kentTB(s: f32) -> vec2f {
  var T = array<f32, 21>(.004, .049, .072, .088, .100, .108, .110, .109, .105, .099, .091, .082, .072, .062, .055, .055,
    .063, .077, .094, .111, .126);
  var B = array<f32, 21>(-.012, -.053, -.076, -.092, -.104, -.111, -.112, -.110, -.104, -.094, -.082, -.068, -.054,
    -.040, -.027, -.013, .006, .032, .063, .094, .118);
  let f = clamp(s * 20., 0., 19.999); let k = i32(f); let u = f - f32(k);
  return vec2f(mix(T[k], T[k + 1], u), mix(B[k], B[k + 1], u));
}
// a line of half width w at distance d. Where a pixel is wider than the line, the line gets wider and fainter
fn kentLine(d: f32, w: f32, fw: f32) -> f32 {
  let ww = max(w, 1.2 * fw); let q = d / ww; return exp(0. - q * q) * (w / ww);
}
// the line of the shut mouth: long, from under the snout back below the eye to the corner at s = .15
fn kentMouthY(s: f32) -> f32 { return 0. - .018 - .022 * pow(sat(s / .15), 1.1); }
// the rear edge of the gill cover at height y (as a place along the body): it bulges back at mid height
fn kentOperc(v: f32) -> f32 { let q = (v - .45) / .5; return .200 + .032 * sat(1. - q * q); }
// smoothstep and its slope over a to b, at x
fn kentSS(a: f32, b: f32, x: f32) -> vec2f {
  let u = sat((x - a) / (b - a)); return vec2f(u * u * (3. - 2. * u), 6. * u * (1. - u) / (b - a));
}

@vertex fn vsKentuckia(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w; let sz = i.b.z * (.90 + .2 * h.z);
  // ---- the school's path, as before: each fish at its own place along it
  let ta = t * i.b.y + i.b.w * 6.3 + (h.x - .5) * (8. / R);
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), 1.5 * sin(2. * ta + ph), R * .7 * sin(ta));
  let T0 = normalize(vec3f(0. - R * sin(ta), 3. * cos(2. * ta + ph), R * .7 * cos(ta))) * sign(i.b.y);
  let S0 = normalize(cross(vec3f(0., 1., 0.), T0)); let Up0 = cross(T0, S0);
  let v = abs(i.b.y) * .854 * R;                      // speed of the school in m/s (the mean along the ellipse)
  // ---- its place in the school: about 1.8 m spread sideways and 1.2 m up and down, drifting slowly
  var off = S0 * ((h.y - .5) * 1.8 + sin(t * .7 + s * 40.) * .3)
    + Up0 * ((h.z - .5) * 1.2 + cos(t * .5 + s * 31.) * .2);
  // ---- the dart: every 7 to 15 s a fish may shoot ahead (in about every second cycle), out to one side, then fall
  // back to its place in the school over some 5 s. It starts with a quick bend of the body (a C-start, as small fish
  // do when they bolt). tau: seconds since this cycle's dart began
  let dPer = 7. + 8. * hs(s + .53);
  let dc = t / dPer + hs(s + .91); let dk = floor(dc);
  let tau = fract(dc) * dPer;
  let dOn = step(.5, hs(dk * 1.37 + s * 7.1));
  let dd = (.25 + .35 * hs(dk * .73 + s * 3.3)) * dOn;   // how far ahead, m
  let dj = (hs(dk * 2.11 + s * 5.7) - .5) * .8 * dd;     // how far out to the side, m
  let ga = kentSS(0., .5, tau); let gb = kentSS(1.5, 6.5, tau);
  let xo = ga.x * (1. - gb.x); let xv = ga.y * (1. - gb.x) - ga.x * gb.y;   // the dart and its rate
  off += T0 * dd * xo + S0 * dj * xo;
  let sprint = dOn * ss(0., .12, tau) * (1. - ss(.45, .9, tau));
  // which way it faces: along the school, turned toward where the dart carries it
  let T = normalize(T0 * v + (T0 * dd + S0 * dj) * xv);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  // ---- the body. The tail beats once per 0.7 body lengths swum, so faster in the dart; wider in the dart. The
  // C-start: for 0.4 s the whole body bends to the side it bolts to
  var l = i.p; var n = i.n.xyz; let lt = i.n.w;
  let bp = TAU * (v * t + dd * xo) / (.7 * sz) + s * 50.;
  let u = .5 - l.z;
  let A = (.010 + .07 * u * u) * (1. + 1.2 * sprint);
  let wv = bp - u * 5.5;
  let cb = sign(dj) * .35 * dOn * ss(0., .08, tau) * (1. - ss(.15, .40, tau));
  l.x += A * sin(wv) + cb * (l.z * l.z - .08);
  let sl = 5.5 * A * cos(wv) + 2. * cb * l.z;
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  // ---- the pectoral fins turn about their root (+ out and up): a little sculling; laid back against the body in the
  // dart; spread out to brake as it slows
  let sx = select(-1., 1., i.p.x >= 0.);
  let pw = step(abs(lt - .30), .02) * ss(.046, .060, abs(i.p.x));
  let brake = dOn * ss(.5, .8, tau) * (1. - ss(1.4, 2.4, tau));
  let fa = sx * (.12 * sin(.5 * bp + 3. * s) * (1. - sprint) - .45 * sprint + .45 * brake) * pw;
  let hg = vec2f(sx * .045, -.072); let dq = l.xy - hg;
  l = vec3f(hg + vec2f(dq.x * cos(fa) - dq.y * sin(fa), dq.x * sin(fa) + dq.y * cos(fa)), l.z);
  n = vec3f(n.x * cos(fa) - n.y * sin(fa), n.x * sin(fa) + n.y * cos(fa), n.z);
  let w = dodge(P + off, .6 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
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

@fragment fn fsKentuckia(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let ax = abs(i.op.x); let y = i.op.y; let s = .5 - i.op.z; let lt = i.lt;
  let fw = max(fwidth(i.op.x), max(fwidth(i.op.y), fwidth(i.op.z)));     // how much of the body one pixel covers
  let near = 1. - ss(.0012, .004, fw);                                     // scales and lines fade out with distance
  let h1 = hs(i.sd * 7.); let h2 = hs(i.sd * 23.);
  // ---- parts by aux
  let hull = step(-.5, lt) * step(lt, .1); let fins = step(.25, lt); let eye = step(lt, -.5);
  let tb = kentTB(s); let ym = (tb.x + tb.y) * .5; let dep = max(tb.x - tb.y, .004);
  let v = sat((y - tb.y) / dep);                                           // 0 at the belly, 1 at the back
  let op = kentOperc(v); let head = (1. - ss(op - .002, op + .002, s)) * hull;
  let body = hull * (1. - head);
  // ---- the scales: thick shiny rhombs (ganoid scales) in rows along the body and oblique rows across it, smaller
  // toward the tail. Each one a little domed, a fine groove between them
  let wS = .018 * (1. - .45 * ss(.5, .95, s));
  let q = v * 13.; let gq = s / wS - .55 * q;
  let fq = fract(q); let fg = fract(gq);
  let e = min(min(fq, 1. - fq) * dep / 13., min(fg, 1. - fg) * wS * .8);
  let groove = kentLine(e, .0005, fw) * body * near;
  var hgt = (.0012 * sqrt(sat(e / .003)) - .0010 * groove) * body * near;
  // the lateral line: a row of pores along the middle of the flank, rising into the tail
  let llv = .56 + .12 * ss(.6, .9, s);
  let ll = kentLine(abs(v - llv) * dep, .0008, fw) * step(.3, fract(gq)) * body * ss(.22, .26, s);
  hgt -= .0006 * ll;
  // ---- the head: smooth bone with fine wavy ridges of the same enamel, and the lines between its plates: the rear
  // edge of the gill cover, the edge of the cheek in front of it, the upper edge of the long upper jaw, the edge of
  // the roof
  let ridge = sin((s * 1.1 + y * .6) * 900. + 4. * vn(i.op * 80. + i.sd)) * head * near;
  hgt += .00010 * ridge;
  let my = kentMouthY(s);
  var dP = abs(s - op);
  dP = min(dP, abs(s - (.165 + .015 * v)) + .03 * step(v, .2) + .03 * step(.75, v));          // the cheek
  dP = min(dP, abs(y - (my + .008 + .018 * s / .15)) + .03 * step(.15, s) + .03 * step(s, .03)); // the upper jaw
  dP = min(dP, abs(y - (tb.x - .028)) + .03 * step(.2, s) + .03 * step(s, .04));                // the roof
  let plate = kentLine(dP, .0010, fw) * head;
  hgt -= .0012 * plate;
  // the mouth: a dark line with a lip of bone above and below; the nostrils
  let mouth = kentLine(abs(y - my), .0022, fw) * step(s, .15) * hull;
  hgt -= .0025 * mouth;
  let nose = (1. - ss(.0025, .0035, length(vec2f(s - .022, y - .024)))) * hull;
  // ---- the light from the scales: one tone over the whole fish, darker above, paler below (no pattern has a source)
  let BACK = vec3f(.16, .18, .15); let SIDE = vec3f(.46, .48, .44); let BELLY = vec3f(.66, .66, .60);
  var alb = mix(mix(BELLY, SIDE, ss(.10, .40, v)), BACK, ss(.50, .85, v));
  alb *= (.90 + .20 * h1) * mix(vec3f(1.03, 1., .95), vec3f(.95, 1., 1.04), h2);
  alb *= 1. - .28 * groove - .35 * plate - .70 * mouth - .80 * nose - .30 * ll;
  // ---- fins: thin, darker, with their rays (a dark line every 0.006 across the fin)
  let rc = s * .75 + abs(y - ym) * .65 + ax * .65;
  let ray = (1. - ss(.05, .25, abs(fract(rc / .006) - .5))) * fins * near;
  alb = mix(alb, BACK * 1.3 * (1. - .20 * ray), fins);
  hgt += .0003 * ray;
  // ---- the eye: a dark iris, a black pupil
  let ed = length(vec2f(s - .075, y - .020));
  alb = mix(alb, mix(vec3f(.006, .006, .006), vec3f(.10, .085, .05), ss(.0085, .0105, ed)), eye);
  // ---- dead on the floor (devonian-remains.md): duller and darker, black mud settled on what faces up
  let deadF = step(5., i.sd); let deadUp = ss(.15, .75, normalize(i.n).y);
  alb = mix(alb, mix(alb * .55, vec3f(.030, .028, .024) * (.8 + .4 * vn(i.wp * 6.)), .85 * deadUp), deadF);
  // ---- light. The relief is in body lengths: times 0.1 m, the length of the fish. Ganoine is an enamel: the scales
  // and the bones of the head shine, sharply; the fins less. The flecks of the sun on it (caus); no shadow map
  // (900 fish)
  let n = skinRelief(ns, i.wp, hgt * .1);
  let dist = length(i.wp - g.cam.xyz); let ca = caus(i.wp, dist);
  let zn = zone(i.wp); let V = normalize(g.cam.xyz - i.wp); let H = normalize(V + g.sun.xyz);
  let E = sunE(i.wp.y, zn); let vv = vol(i.wp).g;
  let gl = (.30 * body + .25 * head) * (1. - .6 * groove) + .15 * fins + 1.2 * eye;
  var c = alb * (E * sat(dot(n, g.sun.xyz)) * .65 * (.3 + ca * .7)
      + amb(i.wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vv, zn) * 1.1 + side(i.wp, n, 1., zn) * .8)
    + E * (.25 + .75 * ca) * gl * pow(sat(dot(n, H)), 120.)
    + amb(i.wp, vec3f(0., 1., 0.), vv, zn) * pow(1. - sat(dot(n, V)), 3.) * (.20 + .25 * body);
  return fin(fog(c, i.wp, zn));
}
`;

// ---------------------------------------------------------------- zoo
// A school of Kentuckia: the path of vsKentuckia without the offset of the single fish, which spreads the school
// about 1.8 m to either side of its middle. Two lines from the middle, each 4 / R along the orbit: one back, one
// ahead. Runs every frame, allocates nothing
const zooKentuckia = (a, i, part) => {
  const R = a[i + 3], ph = a[i + 7] * 17, ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3, tb = ta + (part * 2 - 1) * 4 / R;
  const x = R * cos(ta), y = 1.5 * sin(2 * ta + ph), z = R * 0.7 * sin(ta);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = R * cos(tb) - x; ZP[4] = 1.5 * sin(2 * tb + ph) - y; ZP[5] = R * 0.7 * sin(tb) - z; ZP[7] = 1.5;
};
