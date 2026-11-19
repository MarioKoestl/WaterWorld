// ============================================================================
// cambrian: what the animals of this era share
// ============================================================================
// The pieces their meshes are made of, the shader code they share (S_SEA: the height of the mud, giving way to the
// viewer, the light on a skin) and what their zoo places share. Each animal has a file of its own: the swimmers in
// swimmers_<name>.js, the walkers in walkers.js. Shapes follow the fossils as far as the sources in zoo.js describe
// them. Colours and movement are free: no fossil shows them.
// Each mesh is modelled around the origin, nose at +z, y up, and is one unit long (the jellyfish: one unit high):
// the instance says how large the animal is in the world. aux, the fourth number of a vertex, tells the shaders which
// part of the animal a vertex belongs to.

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
// how wide such a body is at z (its half width)
const wideAt = (K, z) => { let i = 0; while (i < K.length - 2 && K[i + 1][0] < z) i++; return mix(K[i][1], K[i + 1][1], clamp((z - K[i][0]) / (K[i + 1][0] - K[i][0]), 0, 1)); };
// a ball at c: r is its radius, or its three half axes
function ball(m, c, r, aux, N = 8, R = 5) {
  const [rx, ry, rz] = r.length ? r : [r, r, r], rings = [];
  for (let k = 1; k < R; k++) { const a = k / R * PI, ring = []; for (let s = 0; s < N; s++) { const b = s / N * TAU; ring.push(m.v(c[0] + rx * sin(a) * cos(b), c[1] + ry * cos(a), c[2] + rz * sin(a) * sin(b), aux)); } rings.push(ring); }
  for (let k = 0; k < rings.length - 1; k++) for (let s = 0; s < N; s++) { const s2 = (s + 1) % N; m.quad(rings[k][s], rings[k][s2], rings[k + 1][s2], rings[k + 1][s]); }
  const top = m.v(c[0], c[1] + ry, c[2], aux), bot = m.v(c[0], c[1] - ry, c[2], aux), last = rings[rings.length - 1];
  for (let s = 0; s < N; s++) { const s2 = (s + 1) % N; m.tri(rings[0][s2], rings[0][s], top); m.tri(last[s], last[s2], bot); }
}
// a flat blade from `root` out along d, `len` long. wide(s) is how far it reaches to either side along c at s (0 at
// the root, 1 at the tip), aux(s) what its vertices carry there
function blade(m, root, d, c, len, wide, aux, NS = 4) {
  const rows = [];
  for (let k = 0; k <= NS; k++) {
    const s = k / NS, w = wide(s), row = [];
    for (const e of [-1, 0, 1]) row.push(m.v(root[0] + d[0] * s * len + c[0] * e * w, root[1] + d[1] * s * len + c[1] * e * w, root[2] + d[2] * s * len + c[2] * e * w, aux(s)));
    rows.push(row);
  }
  for (let k = 0; k < NS; k++) for (let e = 0; e < 2; e++) m.quad(rows[k][e], rows[k][e + 1], rows[k + 1][e + 1], rows[k + 1][e]);
}
// a smooth line through the points P (Catmull-Rom), as n + 1 points: for spines and feelers, which would show every
// corner of a line of a few points
const curve = (P, n) => Array.from({ length: n + 1 }, (_, j) => {
  const s = j / n * (P.length - 1), i = min(floor(s), P.length - 2), u = s - i, k = (o) => P[clamp(i + o, 0, P.length - 1)];
  return [0, 1, 2].map((q) => 0.5 * (2 * k(0)[q] + (k(1)[q] - k(-1)[q]) * u + (2 * k(-1)[q] - 5 * k(0)[q] + 4 * k(1)[q] - k(2)[q]) * u * u + (3 * k(0)[q] - k(-1)[q] - 3 * k(1)[q] + k(2)[q]) * u * u * u));
});
// the outline of a lobe: widest near its root, and either round at its tip or blunt
const lobe = (w) => (s) => w * pow(max(1 - pow(s, 2.2), 0), 0.6), paddle = (w) => (s) => w * (1 - 0.6 * s * s * s);
// A surface from rows of points (each a row of vertex numbers, all from the same side to the other): a shield, a
// shell, anything that is not a tube. With the rows from the rear to the front and each from -x to +x its outer side
// is up (flip: for rows from the front to the rear). Such a surface is drawn from both sides, and a fragment shader
// can tell its inside from its outside (front_facing): see the trilobite in walkers.js
function sheet(m, rows, flip) {
  for (let j = 0; j < rows.length - 1; j++) for (let c = 0; c < rows[j].length - 1; c++) { const a = rows[flip ? j + 1 : j], b = rows[flip ? j : j + 1]; m.quad(a[c], b[c], b[c + 1], a[c + 1]); }
}
// A flap, fin or plate with a thickness: like blade(), but with an upper side, an under side and round edges. From
// root out along d, len long; wide(s) is how far it reaches to either side along c at s (0 at the root, 1 at the
// tip), thick(s) how far up and down along u from its middle line, aux(s) what its vertices carry there. Its
// section is a flat oval of six points. No part of an animal is a sheet without a thickness: see the recipe in
// CLAUDE.md
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
// What all of them share comes first, with the first kind in world.js: the height of the mud for those that keep
// close to it (the formula of floor.js, with the tongues written out), and the light on a skin.
// Light here is soft and comes from above: a surface is lit by the sun as far as it reaches down, by the water above
// and around it. Every fragment shader turns the normal to the viewer where it sees the back of a triangle.
// skin() is the plain light, with a pale rim against the dark. A skin with a relief and a sheen (the rule for every
// animal, see the recipe in CLAUDE.md) takes two steps: skinRelief() tilts the normal by a relief that the fragment
// shader works out as a height (furrows, granules, scales: whatever is finer than the mesh), and skinWet() lights it,
// without the pale rim (on a body with many edges that rim is a net of teal lines) and with the soft light of the
// sun that a wet shell shows.
// Every animal gives way to the viewer (dodge), so that none swims through the camera: where its middle c would come
// closer than r, it is moved away, by less the further off it is and by nothing at r. lv = 1: it keeps its height and
// goes sideways (for those that keep to the ground). h: how far the animal reaches up and down from its middle. Each
// gives r as a little more than its own size plus twice the near plane of the camera (g.fwd.w, which shrinks with the
// player: a shrimp may come close). zooDodge below is the same for the zoo: change one, change the other.
// TSC: every distance below that is not the size of an animal was chosen when this world was 20 times larger (TS in
// era.js), and is that much smaller now
const TGS_W = Array.from({ length: TONGUES.length * 2 }, (_, i) => 'vec4f(' + Array.from(FLOOR.prims.subarray(i * 4, i * 4 + 4)).join(', ') + ')').join(', ');
const S_SEA = /*wgsl*/`
const TGS = array<vec4f, ${TONGUES.length * 2}>(${TGS_W});
const TSC = ${TS};
` + groundWgsl(TONGUES.length + 'u', (i) => 'TGS[' + i + ']') + /*wgsl*/`
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
// the normal n of a surface at wp, tilted by a relief on it that is h high there (in metres): from how h changes from
// pixel to pixel. Call it where every pixel runs (not inside an if), and let h fade where the relief gets finer than
// the pixels (fwidth), or it flickers far away
fn skinRelief(n: vec3f, wp: vec3f, h: f32) -> vec3f {
  let px = dpdx(wp); let py = dpdy(wp); let r1 = cross(py, n); let r2 = cross(n, px); let det = dot(px, r1);
  return normalize(abs(det) * n - sign(det) * (dpdx(h) * r1 + dpdy(h) * r2));
}
// the light on a wet skin: n its normal with the relief, ns without it. gl: how strong the small light of the sun on
// the relief is, wet: how strong the soft one on the shape (on the shape, not on every granule: that glitters)
fn skinWet(alb: vec3f, n: vec3f, ns: vec3f, wp: vec3f, gl: f32, wet: f32) -> vec3f {
  let V = normalize(g.cam.xyz - wp); let z = zone(wp); let H = normalize(V + g.sun.xyz);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  return alb * (E * sat(dot(n, g.sun.xyz)) * .65 + amb(wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vol(wp).g, z) * 1.1 + side(wp, n, 1., z) * .8)
    + E * (pow(sat(dot(n, H)), 40.) * gl + pow(sat(dot(ns, H)), 70.) * wet);
}
`;

// ---------------------------------------------------------------- where they are, for the zoo
// The zoo functions of the animals repeat the paths of their vertex shaders: change one, change the other. Each writes the place of the
// animal at i in its list into ZP (see zooMove in engine/zoo.js), for the scene time F[TIME]. They run in every frame
// and allocate nothing: no float is handed to a function. Where an animal gives way to the viewer by more than its
// place is wide, its place does the same (the swarm and the shoal are wide enough without).
// The height of the mud, for the animals that keep close to it: on a grid of 0.5 m over the middle of the world,
// which makeWorld fills (finer would cost load time; between its points it is a centimetre or so off, and these
// animals swim 2 to 6 cm over the mud). zooGround adds the height at ZP[0], ZP[2] to ZP[1]
const GRN = 577, GRH = 144, GRD = new Float32Array(GRN * GRN);
const zooGround = () => {
  let x = (ZP[0] + GRH) * 2, z = (ZP[2] + GRH) * 2; x = x < 0 ? 0 : x > GRN - 1.01 ? GRN - 1.01 : x; z = z < 0 ? 0 : z > GRN - 1.01 ? GRN - 1.01 : z;
  const i = x | 0, j = z | 0, u = x - i, v = z - j, o = i + GRN * j;
  ZP[1] += (GRD[o] * (1 - u) + GRD[o + 1] * u) * (1 - v) + (GRD[o + GRN] * (1 - u) + GRD[o + GRN + 1] * u) * v;
};
// dodge of the shaders, for the place in ZP[0], ZP[1], ZP[2]: an animal gives way to the viewer. How far the animal
// reaches up and down from its middle is in ZH[0], its own part of r in ZH[1] (not arguments: a float worked out by
// the caller and handed over can cost an allocation); r adds twice the near plane, as in the shaders
const ZH = new Float64Array(2);
const zooDodge = (lv) => {
  const r = ZH[1] + 2 * NEAR * F[PS];
  const vx = ZP[0] - F[CX], vy = ZP[1] - F[CY], vz = ZP[2] - F[CZ], ay = (vy < 0 ? -vy : vy) - ZH[0], by = ay > 0 ? ay : 0, d = sqrt(vx * vx + by * by + vz * vz);
  if (d >= r) return;
  const wy = vy * (1 - lv), q = d / r, k = 0.6 * r * (1 - q * q * (3 - 2 * q)) / (sqrt(vx * vx + wy * wy + vz * vz) + 1e-4);
  ZP[0] += vx * k; ZP[1] += wy * k; ZP[2] += vz * k;
};
