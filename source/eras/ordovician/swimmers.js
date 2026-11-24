// ============================================================================
// ordovician: what the animals of this era share, and graptolite
// ============================================================================
// The pieces their meshes are made of, the shader code they share (S_SEA: giving way to the viewer, the light on a
// skin) and what their zoo places share. The graptolite is here because it is small. Larger swimmers get a file of
// their own (swimmers_<name>.js). Shapes follow the fossils as far as the sources describe them. Colours and movement
// are free: no fossil shows them.
// Each mesh is modelled around the origin, nose at +z, y up, and is one unit long: the instance says how large the
// animal is in the world. aux, the fourth number of a vertex, tells the shaders which part of the animal a vertex
// belongs to.

// ---------------------------------------------------------------- pieces the meshes are made of
// A body from sections [z, half width, half height, height of its middle], rounded off between them and closed with
// a point at both ends. NS rings per section, M points around each, shape(a) the outline of a ring
function loft(m, K, NS, M, aux = 0, shape = (a) => [cos(a), sin(a)]) {
  const cr = (a, b, c, d, u) => 0.5 * (2 * b + (c - a) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (3 * b - a - 3 * c + d) * u * u * u), rings = [];
  for (let j = 0; j <= (K.length - 1) * NS; j++) {
    const i = min(floor(j / NS), K.length - 2), u = j / NS - i, k = (o) => K[clamp(i + o, 0, K.length - 1)];
    const [z, w, h, yc] = [0, 1, 2, 3].map((q) => cr(k(-1)[q], k(0)[q], k(1)[q], k(2)[q], u)), ring = [];
    for (let s = 0; s < M; s++) { const [x, y] = shape(s / M * TAU); ring.push(m.v(max(w, 0.002) * x, yc + max(h, 0.002) * y, z, aux)); }
    rings.push(ring);
  }
  for (let j = 0; j < rings.length - 1; j++) for (let s = 0; s < M; s++) { const s2 = (s + 1) % M; m.quad(rings[j][s], rings[j][s2], rings[j + 1][s2], rings[j + 1][s]); }
  const A = K[0], B = K[K.length - 1], e0 = m.v(0, A[3], A[0] - 0.003, aux), e1 = m.v(0, B[3], B[0] + 0.003, aux), last = rings[rings.length - 1];
  for (let s = 0; s < M; s++) { const s2 = (s + 1) % M; m.tri(rings[0][s2], rings[0][s], e0); m.tri(last[s], last[s2], e1); }
}
const wideAt = (K, z) => { let i = 0; while (i < K.length - 2 && K[i + 1][0] < z) i++; return mix(K[i][1], K[i + 1][1], clamp((z - K[i][0]) / (K[i + 1][0] - K[i][0]), 0, 1)); };
function ball(m, c, r, aux, N = 8, R = 5) {
  const [rx, ry, rz] = r.length ? r : [r, r, r], rings = [];
  for (let k = 1; k < R; k++) { const a = k / R * PI, ring = []; for (let s = 0; s < N; s++) { const b = s / N * TAU; ring.push(m.v(c[0] + rx * sin(a) * cos(b), c[1] + ry * cos(a), c[2] + rz * sin(a) * sin(b), aux)); } rings.push(ring); }
  for (let k = 0; k < rings.length - 1; k++) for (let s = 0; s < N; s++) { const s2 = (s + 1) % N; m.quad(rings[k][s], rings[k][s2], rings[k + 1][s2], rings[k + 1][s]); }
  const top = m.v(c[0], c[1] + ry, c[2], aux), bot = m.v(c[0], c[1] - ry, c[2], aux), last = rings[rings.length - 1];
  for (let s = 0; s < N; s++) { const s2 = (s + 1) % N; m.tri(rings[0][s2], rings[0][s], top); m.tri(last[s], last[s2], bot); }
}
function blade(m, root, d, c, len, wide, aux, NS = 4) {
  const rows = [];
  for (let k = 0; k <= NS; k++) {
    const s = k / NS, w = wide(s), row = [];
    for (const e of [-1, 0, 1]) row.push(m.v(root[0] + d[0] * s * len + c[0] * e * w, root[1] + d[1] * s * len + c[1] * e * w, root[2] + d[2] * s * len + c[2] * e * w, aux(s)));
    rows.push(row);
  }
  for (let k = 0; k < NS; k++) for (let e = 0; e < 2; e++) m.quad(rows[k][e], rows[k][e + 1], rows[k + 1][e + 1], rows[k + 1][e]);
}
const curve = (P, n) => Array.from({ length: n + 1 }, (_, j) => {
  const s = j / n * (P.length - 1), i = min(floor(s), P.length - 2), u = s - i, k = (o) => P[clamp(i + o, 0, P.length - 1)];
  return [0, 1, 2].map((q) => 0.5 * (2 * k(0)[q] + (k(1)[q] - k(-1)[q]) * u + (2 * k(-1)[q] - 5 * k(0)[q] + 4 * k(1)[q] - k(2)[q]) * u * u + (3 * k(0)[q] - k(-1)[q] - 3 * k(1)[q] + k(2)[q]) * u * u * u));
});
const lobe = (w) => (s) => w * pow(max(1 - pow(s, 2.2), 0), 0.6), paddle = (w) => (s) => w * (1 - 0.6 * s * s * s);
function sheet(m, rows, flip) {
  for (let j = 0; j < rows.length - 1; j++) for (let c = 0; c < rows[j].length - 1; c++) { const a = rows[flip ? j + 1 : j], b = rows[flip ? j : j + 1]; m.quad(a[c], b[c], b[c + 1], a[c + 1]); }
}
function slab(m, root, d, c, u, len, wide, thick, aux, NS = 5) {
  const rings = [], O = [[1, 0], [0.55, 1], [-0.55, 1], [-1, 0], [-0.55, -1], [0.55, -1]];
  for (let k = 0; k <= NS; k++) {
    const s = k / NS, w = max(wide(s), 1e-4), t = thick(s), ring = [];
    for (const [e, f] of O) ring.push(m.v(root[0] + d[0] * s * len + c[0] * e * w + u[0] * f * t, root[1] + d[1] * s * len + c[1] * e * w + u[1] * f * t, root[2] + d[2] * s * len + c[2] * e * w + u[2] * f * t, aux(s)));
    rings.push(ring);
  }
  for (let k = 0; k < NS; k++) for (let e = 0; e < 6; e++) m.quad(rings[k][e], rings[k][(e + 1) % 6], rings[k + 1][(e + 1) % 6], rings[k + 1][e]);
  for (const r of [rings[0], rings[NS]]) { m.quad(r[0], r[1], r[2], r[3]); m.quad(r[0], r[3], r[4], r[5]); }
}

// ---------------------------------------------------------------- shaders
// What all animated animals share: the height of the mud (the formula of floor.js, for Astraspis and Endoceras),
// giving way to the viewer, and the light on a skin. See cambrian/swimmers.js
const S_SEA = /*wgsl*/`
fn ground(x: vec2f) -> f32 {
  var h = -16. + 3. * (fbm(vec3f(x * .014, 3.), 3) - .5)
         + .8 * (fbm(vec3f(x * .048, 7.), 2) - .5);
  h += 1.6 * ss(.52, .66, fbm(vec3f(x * .028, 11.), 3));
  h -= 10. * ss(110., 160., length(x));
  return h;
}
fn dodge(c: vec3f, r: f32, lv: f32, h: f32) -> vec3f {
  let v = c - g.cam.xyz; let d = length(vec3f(v.x, max(abs(v.y) - h, 0.), v.z));
  return c + normalize(vec3f(v.x + 1e-4, v.y * (1. - lv), v.z)) * (.6 * r * (1. - ss(0., r, d)));
}
fn skin(alb: vec3f, n: vec3f, wp: vec3f, gl: f32) -> vec3f {
  let L = g.sun.xyz; let V = normalize(g.cam.xyz - wp); let z = zone(wp); let vv = vol(wp);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  let fillN = vec3f(n.x, abs(n.y) * .55 + .25, n.z);
  var c = alb * (E * sat(dot(n, L)) * .65 + amb(wp, fillN, vv.g, z) * 1.1 + side(wp, n, 1., z) * .8);
  c += E * pow(sat(dot(n, normalize(V + L))), 40.) * gl;
  c += amb(wp, vec3f(0., 1., 0.), vv.g, z) * pow(1. - sat(dot(n, V)), 3.) * .25;
  return c;
}
fn skinRelief(n: vec3f, wp: vec3f, h: f32) -> vec3f {
  let px = dpdx(wp); let py = dpdy(wp); let r1 = cross(py, n); let r2 = cross(n, px); let det = dot(px, r1);
  return normalize(abs(det) * n - sign(det) * (dpdx(h) * r1 + dpdy(h) * r2));
}
fn skinWet(alb: vec3f, n: vec3f, ns: vec3f, wp: vec3f, gl: f32, wet: f32) -> vec3f {
  let V = normalize(g.cam.xyz - wp); let z = zone(wp); let H = normalize(V + g.sun.xyz);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  return alb * (E * sat(dot(n, g.sun.xyz)) * .65 + amb(wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vol(wp).g, z) * 1.1 + side(wp, n, 1., z) * .8)
    + E * (pow(sat(dot(n, H)), 40.) * gl + pow(sat(dot(ns, H)), 70.) * wet);
}
`;

// ---------------------------------------------------------------- where they are, for the zoo
// The zoo functions repeat the paths of the vertex shaders: change one, change the other. Each writes the place into
// ZP (see zooMove in engine/zoo.js) for the scene time F[TIME]. They run in every frame and allocate nothing.
// The height of the mud on a grid: for the animals that keep close to the floor. makeWorld fills it
const GRN = 577, GRH = 144, GRD = new Float32Array(GRN * GRN);
const zooGround = () => {
  let x = (ZP[0] + GRH) * 2, z = (ZP[2] + GRH) * 2;
  x = x < 0 ? 0 : x > GRN - 1.01 ? GRN - 1.01 : x;
  z = z < 0 ? 0 : z > GRN - 1.01 ? GRN - 1.01 : z;
  const i = x | 0, j = z | 0, u = x - i, v = z - j, o = i + GRN * j;
  ZP[1] += (GRD[o] * (1 - u) + GRD[o + 1] * u) * (1 - v) + (GRD[o + GRN] * (1 - u) + GRD[o + GRN + 1] * u) * v;
};
const ZH = new Float64Array(2);
const zooDodge = (lv) => {
  const r = ZH[1] + 2 * NEAR * F[PS];
  const vx = ZP[0] - F[CX], vy = ZP[1] - F[CY], vz = ZP[2] - F[CZ], ay = (vy < 0 ? -vy : vy) - ZH[0], by = ay > 0 ? ay : 0, d = sqrt(vx * vx + by * by + vz * vz);
  if (d >= r) return;
  const wy = vy * (1 - lv), q = d / r, k = 0.6 * r * (1 - q * q * (3 - 2 * q)) / (sqrt(vx * vx + wy * wy + vz * vz) + 1e-4);
  ZP[0] += vx * k; ZP[1] += wy * k; ZP[2] += vz * k;
};

// ---------------------------------------------------------------- Graptolite
// A biserial graptolite colony: a thin dark blade with saw-tooth edges (thecae) hanging from a thread (nema),
// drifting in swarms in the open water. 2 to 10 cm. Sources: Digital Atlas of Ordovician Life (not verified);
// see docs/research/ordovician/graptolite.md. All colours and proportions are estimates.
// aux: 0 at bottom of stipe, 1 at nema tip
function meshGraptolite(sd) {
  const m = new Mesh(), NT = 8 + (sd % 3), BL = 0.82;
  slab(m, [0, 0, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], BL,
    (s) => {
      if (s > 0.97) return 0.001;
      const bw = 0.015 * (1 - 0.3 * s);
      const f = s * NT - floor(s * NT);
      const tw = f < 0.3 ? pow(f / 0.3, 0.7) : pow(max(1 - (f - 0.3) / 0.7, 0), 0.5);
      return bw * (1 + 0.5 * tw);
    },
    (s) => 0.004 * (1 - 0.3 * s),
    (s) => s,
    NT * 3
  );
  m.tube([[0, 0, BL], [0, 0.002, 0.91], [0, 0, 1]], () => 0.001, 3, true, () => 1);
  return m;
}
const S_GRAPTOLITE = /*wgsl*/`
// Instance: a.xyz = swarm centre, a.w = orbit radius. b.x = individual seed, b.y = swarm speed (rad/s, sign is
// direction), b.z = size (blade length in metres), b.w = swarm seed. The orbit grP is repeated in zooGraptolite:
// change one, change the other
fn grP(ta: f32, a: vec4f, ph: f32) -> vec3f { return a.xyz + a.w * vec3f(cos(ta) * (1. + .15 * sin(2. * ta + ph)), .2 * sin(3. * ta + ph), sin(ta) * (1. + .15 * cos(2. * ta + ph))); }
@vertex fn vsGraptolite(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w; let ph = i.b.w * 17.;
  // slow orbit around the swarm centre
  let ta = t * i.b.y + i.b.w * 6.3 + (h.x - .5) * 6. / R;
  var p = grP(ta, i.a, ph);
  // individual wander
  p += vec3f(sin(t * .15 + s * 30.) * .4, sin(t * .12 + s * 23.) * .25, cos(t * .18 + s * 17.) * .4);
  // the blade hangs roughly vertical, swaying gently
  let sw = t * .3 + s * 40.;
  let Up = normalize(vec3f(.12 * sin(sw), 1., .12 * cos(sw * .8)));
  let fa = s * 17. + t * .08;
  let Side = normalize(cross(Up, vec3f(cos(fa), 0., sin(fa))));
  let Face = cross(Side, Up);
  var l = i.p; let sz = i.b.z * (.8 + .4 * h.z);
  // sway along the blade
  l.x += .015 * sin(t * 1.5 + s * 25. + l.z * 10.) * l.z;
  let w = dodge(p, .15 * sz + 2. * g.fwd.w, 0., sz * .4) + (Side * l.x + Face * l.y + Up * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = Side * i.n.x + Face * i.n.y + Up * i.n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
@fragment fn fsGraptolite(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff); let sd = i.sd; let z = i.op.z; let x = abs(i.op.x);
  let h1 = hs(sd * 7.); let h2 = hs(sd * 23.);
  let fine = ss(.003, .001, fwidth(z));
  // relief: faint growth lines along the blade
  let gl = sin(z * 180. + sd * 50.) * fine;
  let n = skinRelief(ns, i.wp, .0006 * gl);
  // dark organic periderm: brown to black
  var alb = mix(mix(vec3f(.10, .08, .05), vec3f(.16, .12, .08), h1), mix(vec3f(.06, .06, .05), vec3f(.12, .10, .07), h1), .5 + .3 * h2);
  // paler at the edges (the teeth) and darker in the middle
  alb *= .88 + .18 * ss(.008, .02, x);
  // the nema is thinner and paler
  alb += vec3f(.02, .02, .01) * ss(.82, .92, z);
  // per-individual tone variation
  alb *= .8 + .4 * h1;
  var c = skinWet(alb, n, ns, i.wp, .04, .10);
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;
// A swarm of graptolites: grP of vsGraptolite. Two ends of the spread, each half a metre from the middle
const zooGraptolite = (a, i) => {
  const R = a[i + 3], ph = a[i + 7] * 17;
  const ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3;
  const t0 = ta - 3 / R, t1 = ta + 3 / R;
  const c0x = a[i] + R * cos(t0) * (1 + 0.15 * sin(2 * t0 + ph));
  const c0y = a[i + 1] + R * 0.2 * sin(3 * t0 + ph);
  const c0z = a[i + 2] + R * sin(t0) * (1 + 0.15 * cos(2 * t0 + ph));
  const c1x = a[i] + R * cos(t1) * (1 + 0.15 * sin(2 * t1 + ph));
  const c1y = a[i + 1] + R * 0.2 * sin(3 * t1 + ph);
  const c1z = a[i + 2] + R * sin(t1) * (1 + 0.15 * cos(2 * t1 + ph));
  ZP[0] = c0x; ZP[1] = c0y; ZP[2] = c0z;
  ZP[3] = c1x - c0x; ZP[4] = c1y - c0y; ZP[5] = c1z - c0z; ZP[7] = 2;
};
