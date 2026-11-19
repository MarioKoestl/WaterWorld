// ============================================================================
// devonian: Concavicaris
// ============================================================================
// A small thylacocephalan arthropod, about 6 cm, in swarms of about 300. Its mesh, its shaders and, for the zoo,
// where it is at a time. Food for almost everything in this sea. What it shares with the other animals is in
// swimmers.js.

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

// ---------------------------------------------------------------- shaders
const S_CONCAVICARIS = /*wgsl*/`
// ============================================================================
// Reference shaders for Concavicaris (brief: docs/briefs/concavicaris-build.md)
// ============================================================================
// Not loaded by the build. This is the whole text of S_CONCAVICARIS for source/eras/devonian/swimmers_concavicaris.js,
// for the mesh of docs/briefs/ref/concavicaris-mesh.js. It needs what the other animals of the era give it (ss, sat,
// hs, vn, zone, fog, fin, caus, amb, side, sunE, vol, dodge, skinRelief), as before. This text has not been compiled:
// run node tools/wgsl.mjs devonian first.
// s is the distance from the front tip of the shell in shell lengths (s = .5 - z of the rest position), y its height.

// Instance (unchanged): a.xyz = centre of the swarm's path, a.w = its radius R. b.x = seed of the animal, b.y = speed
// of the swarm in radians per second (the sign is the direction), b.z = length in metres, b.w = seed of the swarm. The
// path of the swarm is repeated in zooConcavicaris: change one, change the other.

// the back and the lower edge of the shell at s, every 0.05 (as TOP and LOW in the mesh, with the notch of the eye)
fn ccShell(s: f32) -> vec2f {
  var T = array<f32, 21>(.107, .156, .185, .198, .208, .214, .218, .220, .222, .221, .220, .218, .216, .211, .204, .194,
    .181, .165, .146, .123, .097);
  var B = array<f32, 21>(-.090, -.150, -.168, -.178, -.185, -.197, -.208, -.215, -.220, -.223, -.224, -.218, -.208,
    -.198, -.185, -.168, -.150, -.131, -.111, -.088, -.068);
  let f = clamp(s * 20., 0., 19.999); let k = i32(f); let u = f - f32(k);
  let t = mix(T[k], T[k + 1], u); let b = mix(B[k], B[k + 1], u);
  return vec2f(t, t - (t - b) * ss(.015, .105, s));
}
// a line of half width w at distance d. Where a pixel is wider than the line, the line gets wider and fainter
fn ccLine(d: f32, w: f32, fw: f32) -> f32 {
  let ww = max(w, 1.2 * fw); let q = d / ww; return exp(0. - q * q) * (w / ww);
}
// turn p about the line through pivot (y, z) along x: a positive angle swings a point below the pivot backward (to
// -z) and a point in front of it down
fn ccRotX(p: vec3f, pivot: vec2f, a: f32) -> vec3f {
  let d = p.yz - pivot; let c = cos(a); let sn = sin(a);
  return vec3f(p.x, pivot + vec2f(d.x * c - d.y * sn, d.y * c + d.x * sn));
}
fn ccRotXN(n: vec3f, a: f32) -> vec3f {
  let c = cos(a); let sn = sin(a); return vec3f(n.x, n.y * c - n.z * sn, n.z * c + n.y * sn);
}

@vertex fn vsConcavicaris(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w;
  // ---- the swarm's path, as before; each animal at its own place in the swarm
  let ta = t * i.b.y + i.b.w * 6.3 + (h.x - .5) * (10. / R);
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), 1. * sin(2. * ta + ph), R * .6 * sin(ta));
  let T = normalize(vec3f(0. - R * sin(ta), 2. * cos(2. * ta + ph), R * .6 * cos(ta))) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let off = S * ((h.y - .5) * 1. + sin(t * .5 + s * 30.) * .15) + Up * ((h.z - .5) * .8 + cos(t * .4 + s * 20.) * .1);
  var l = i.p; var n = i.n.xyz; let lt = i.n.w;
  let sz = i.b.z * (.90 + .2 * h.z);
  // ---- the paddles: eight pairs beat one after another, the rear one first, so that a wave runs forward along them
  // (estimate: 2 to 3.5 beats a second). Each turns about its root; the power stroke swings it back
  let wb = TAU * (2. + 1.5 * h.x) * t + 20. * s;
  let isP = step(.79, lt);
  let pk = round((lt - .80) / .0236);
  let pa = (.10 + .38 * sin(wb + .8 * pk)) * isP;
  l = ccRotX(l, vec2f(-.110, .5 - (.60 + .048 * pk)), pa);
  n = ccRotXN(n, pa);
  // the whole animal rises and dips a little with the beat, its front pitching up as the paddles push
  let bob = .004 * sin(wb + 2.);
  let pitch = 0. - .025 * sin(wb + 1.) - .05;
  // ---- the arms for catching: they hang folded and sway a little; every 6 to 14 s, in about every second cycle, they
  // shoot forward and up in 0.12 s, as if to grab, and fold back in 0.8 s (estimate)
  let cPer = 6. + 8. * hs(s + .53); let cc = t / cPer + hs(s + .91); let ck = floor(cc); let tau = fract(cc) * cPer;
  let grab = step(.5, hs(ck * 1.37 + s * 7.1)) * ss(0., .12, tau) * (1. - ss(.25, 1.05, tau));
  let isA = step(abs(lt - .6), .02);
  let aa = (.06 * sin(t * 1.3 + 7. * s + 9. * l.x) - 1.0 * grab) * isA;
  l = ccRotX(l, vec2f(-.150, .5 - .175), aa);
  n = ccRotXN(n, aa);
  // the pitch of the whole animal about its middle
  l = ccRotX(l, vec2f(0., 0.), pitch); n = ccRotXN(n, pitch);
  l.y += bob;
  let w = dodge(P + off, .5 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
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

@fragment fn fsConcavicaris(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let ax = abs(i.op.x); let y = i.op.y; let s = .5 - i.op.z; let lt = i.lt;
  let fw = max(fwidth(i.op.x), max(fwidth(i.op.y), fwidth(i.op.z)));
  let near = 1. - ss(.002, .006, fw);                                       // details fade out with distance
  let h1 = hs(i.sd * 7.); let h2 = hs(i.sd * 23.);
  // ---- parts by aux
  let shell = step(abs(lt), .04); let edgeP = step(abs(lt - .10), .03); let body = step(abs(lt - .2), .03);
  let gill = step(abs(lt - .25), .02); let arm = step(abs(lt - .6), .025); let pad = step(.79, lt);
  let eye = step(lt, -.5);
  let joint = sat((.6 - lt) / .016) * arm;
  // the inside of the shell is the side that faces the middle of the animal
  let outside = select(1., 0., dot(ns, vec3f(sign(i.op.x), 0., 0.)) < 0.);
  let sh = ccShell(s); let v = sat((sh.x - y) / max(sh.x - sh.y, .01));   // 0 at the back, 1 at the lower edge
  let dep = sh.x - sh.y;
  // where the body lies under the shell (as in the mesh): the shell is thin, the body shows through as a shade
  let yc = sh.x * .55 + sh.y * .45 - .035;
  let fb = pow(sin(3.14159 * sat((s - .05) / .99)), .3) * (1. - .35 * ss(.6, 1., s));
  let under = (1. - ss(.75, 1.05, abs(y - yc) / max(.12 * fb, .01))) * ss(.06, .14, s);
  var hgt = 0.;
  // ---- the shell. Its surface after JHK2020: smooth, a fine net of many-sided cells (SEM, seen only from close by),
  // small pits scattered over it (Fig. 1a, f), a row of pits along the lower edge (Fig. 1c), the raised rim (the mesh),
  // a groove inside the rim, and a shallow depression from near the rear end up to the middle (Fig. 1b). Besides: the
  // line of the hinge and a gentle unevenness, as of a thin shell of chitin (estimate)
  let cq = vec2f(s, y) / .010; let ci = floor(cq); var d1 = 9.; var d2 = 9.;
  if (near > .01) {
    for (var a = -1; a <= 1; a++) { for (var b = -1; b <= 1; b++) {
      let o2 = vec2f(f32(a), f32(b));
      let r = ci + o2 + vec2f(hs(dot(ci + o2, vec2f(1.7, 9.2))), hs(dot(ci + o2, vec2f(8.3, 2.8)))) - cq;
      let dd = dot(r, r); if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) { d2 = dd; }
    } }
  }
  let net = (1. - ss(0., .08, sqrt(d2) - sqrt(d1))) * near;
  let pc = vec2f(s, y) / .022; let pi = floor(pc);
  let pr = fract(pc) - (.25 + .5 * vec2f(hs(dot(pi, vec2f(3.1, 7.7)) + i.sd), hs(dot(pi, vec2f(5.3, 1.9)) + i.sd)));
  let pit = (1. - ss(.10, .17, length(pr))) * step(.72, hs(dot(pi, vec2f(2.3, 4.1)))) * near;
  let rowp = (1. - ss(.25, .45, length(vec2f(fract(s / .022) - .5, (v - .93) * dep / .010)))) * ss(.18, .25, s) * near;
  let groove = ccLine(abs(v - .90) * dep, .004, fw) * ss(.12, .2, s);
  let dq = vec2f(s - .44, v - .78); let dl = vec2f(.42, -.38);
  let dpr = length(dq - dl * clamp(dot(dq, dl) / dot(dl, dl), 0., 1.) * vec2f(1., 1.));
  let depr = exp(0. - pow(dpr / .05, 2.));
  let hinge = ccLine(ax, .004, fw);
  let uneven = vn(i.op * 14. + i.sd * 5.) - .5;
  hgt += (.0003 * (1. - net) - .0012 * pit - .0010 * rowp - .0020 * groove - .0030 * depr - .0015 * hinge
    + .0015 * uneven) * shell * outside;
  // ---- colours. The colour of the living animal is not known: chitin of one tone, darker where the shell is thicker
  // (along the hinge) and where the body lies under it, lighter and clearer at the thin edges. No pattern
  let CH = vec3f(.56, .43, .27);
  let mot = fbm(i.op * 9. + i.sd * 3., 3);                                   // the shell is not even: faint unevenness
  var alb = CH * (.92 + .16 * h1) * mix(vec3f(1.03, 1., .95), vec3f(.96, 1., 1.03), h2) * (.88 + .24 * mot);
  alb *= (1. - .30 * ss(.25, .02, v) * shell) * (1. + .12 * ss(.6, .95, v) * shell);
  alb *= 1. - .28 * under * shell * outside;
  alb *= 1. - .10 * net * shell - .12 * pit * shell - .12 * rowp * shell - .25 * groove * shell - .12 * depr * shell
    - .25 * hinge * shell;
  alb = mix(alb * .50, alb, outside * shell + (1. - shell));               // the inside of the shell
  alb = mix(alb, CH * 1.25 + vec3f(.04, .03, .02), edgeP);                 // the thin edge
  // ---- the body: soft and pale, ringed behind the middle; the gills: thin leaves with fine folds
  let ring = 1. - ss(.15, .40, abs(fract((s - .50) / .055) - .5)) * ss(.48, .55, s);
  alb = mix(alb, vec3f(.36, .30, .27) * (1. - .25 * (1. - ring)) * (.9 + .2 * mot), body);
  let lam = .5 + .5 * sin(i.op.z * 900. + i.op.y * 300.);
  alb = mix(alb, vec3f(.50, .38, .34) * (.75 + .3 * lam * near), gill);
  hgt += (.0006 * (ring - 1.) * body + .0003 * lam * gill) * near;
  // ---- the arms: pieces of hard chitin, the joints between them soft and darker; the spines pale at their tips
  alb = mix(alb, CH * .85 * (1. - .55 * joint) * (.9 + .2 * mot), arm);
  // ---- the paddles: thin, lighter, their edges a fringe of fine bristles (estimate)
  let pk = round((lt - .80) / .0236);
  let pr0 = vec3f(sign(i.op.x) * .030, -.110, .5 - (.60 + .048 * pk));
  let pd = normalize(vec3f(sign(i.op.x) * .25, -1., -.45));
  let pu = dot(i.op - pr0, pd) / .09; let pw = (i.op.z - pr0.z - pd.z * pu * .09) / .020;
  let fringe = ss(.45, .75, abs(pw)) + ss(.75, .95, pu);
  let bristle = (.5 + .5 * sin(pu * 160. + abs(pw) * 40.)) * fringe * near;
  alb = mix(alb, CH * (.95 + .30 * bristle) * (1. + .2 * fringe), pad);
  // ---- the eyes: a ball of many six-sided lenses (JHK2020), each a tiny dome with its own glint; dark where one looks
  // straight down the lenses (the pseudopupil of compound eyes)
  let ec = vec3f(sign(i.op.x) * .042, -.010, .45);
  let ep = normalize(i.op - ec);
  let euv = vec2f(atan2(ep.y, ep.z), asin(clamp(ep.x * sign(i.op.x), -1., 1.))) * 14.;
  let hx = vec2f(euv.x - .5 * euv.y, euv.y * 1.1547);
  let hf = fract(hx) - .5; let hd = max(abs(hf.x), max(abs(hf.y), abs(hf.x + hf.y)));
  let lens = (1. - 4. * hd * hd) * near;
  hgt += .0010 * lens * eye;
  let V = normalize(g.cam.xyz - i.wp);
  let pp = pow(sat(dot(ns, V)), 6.);
  alb = mix(alb, vec3f(.055, .045, .035) * (1. - .7 * pp) * (.8 + .4 * ss(.3, .5, hd)), eye);
  // ---- dead on the floor (devonian-remains.md): duller and darker, black mud settled on what faces up
  let deadF = step(5., i.sd); let deadUp = ss(.15, .75, normalize(i.n).y);
  alb = mix(alb, mix(alb * .55, vec3f(.030, .028, .024) * (.8 + .4 * vn(i.wp * 6.)), .85 * deadUp), deadF);
  // ---- light: relief in shell lengths times 0.06 m. Chitin shines, wet; the eyes sharply. The shell is thin: light
  // from behind comes through it, less where the body lies under it
  let n = skinRelief(ns, i.wp, hgt * .06);
  let dist = length(i.wp - g.cam.xyz); let ca = caus(i.wp, dist);
  let zn = zone(i.wp); let H = normalize(V + g.sun.xyz);
  let E = sunE(i.wp.y, zn); let vv = vol(i.wp).g;
  let gl = .45 * shell * outside + .45 * edgeP + .30 * body + .40 * arm + .25 * pad + 1.6 * eye;
  let thin = (shell * (1. - .6 * under) + edgeP + pad * .8 + gill * .6 + arm * .5) * (1. - eye);
  // chitin lets some light through and scatters it: the light wraps a little round the shape, warmer and clearer
  // where it is thin; seen at a slant the shell is thicker in the line of sight, so its rim reads darker and warmer
  let nl = dot(n, g.sun.xyz); let nv = sat(dot(n, V));
  let wrap = sat((nl + .35) / 1.35);
  let fres = .04 + .96 * pow(1. - nv, 5.);
  let slant = mix(vec3f(.80, .70, .55), vec3f(1.), ss(.05, .5, nv));
  var c = alb * slant * (E * wrap * .70 * (.3 + ca * .7)
      + amb(i.wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vv, zn) * 1.0 + side(i.wp, n, 1., zn) * .8)
    + alb * vec3f(1.15, .95, .65) * E * sat(0. - nl) * .50 * thin
    + E * (.25 + .75 * ca) * gl * (pow(sat(dot(n, H)), 90.) + .08 * pow(sat(dot(n, H)), 12.)) * (.6 + 2. * fres)
    + amb(i.wp, vec3f(0., 1., 0.), vv, zn) * fres * (.25 + .35 * (shell + eye));
  return fin(fog(c, i.wp, zn));
}
`;

// ---------------------------------------------------------------- zoo
// A swarm of Concavicaris: the path of vsConcavicaris without the offset of the single animal. Two lines, one back
// and one ahead
const zooConcavicaris = (a, i, part) => {
  const R = a[i + 3], ph = a[i + 7] * 17, ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3, tb = ta + (part * 2 - 1) * 3 / R;
  const x = R * cos(ta), y = 1.0 * sin(2 * ta + ph), z = R * 0.6 * sin(ta);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = R * cos(tb) - x; ZP[4] = 1.0 * sin(2 * tb + ph) - y; ZP[5] = R * 0.6 * sin(tb) - z; ZP[7] = 1.0;
};
