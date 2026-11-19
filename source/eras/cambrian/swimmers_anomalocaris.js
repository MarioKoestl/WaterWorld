// ============================================================================
// cambrian: Anomalocaris
// ============================================================================
// Its mesh, its shaders and, for the zoo, where it is at a time. world.js lists it as a kind and gives it its
// instances. The mesh is modelled around the origin, nose at +z, y up: the instance says how large the animal is in
// the world. aux, the fourth number of a vertex, tells the shaders which part of the animal a vertex belongs to.
// What it shares with the other animals of this era (pieces for the mesh, the light on a skin, giving way to the
// viewer) is in swimmers.js.

// ---------------------------------------------------------------- the animal in figures
// Anomalocaris canadensis in the round, in lengths of its body (one unit from the front of the head to the end of the
// body: the arms and the tail fan are extra). Its fossils are pressed flat. What it is made of follows Daley and
// Edgecombe (Journal of Paleontology 88, 2014), as their abstract and Wikipedia's articles "Anomalocaris" and
// "Radiodonta" report it (read on 2026-11-17):
//   the trunk   13 segments, widest between the third and the fifth pair of flaps, narrowing to the tail
//   the flaps   13 pairs, the front edge of each lying over the rear edge of the one in front of it (Whittington and
//               Briggs 1985), so that a row works as one fin (Usami 2006); stiffened by fine rays; three pairs of
//               small ones on the narrow neck
//   the gills   a band of long, thin blades across the back of every segment on either side, with a divide down the
//               middle of the back
//   the tail    a fan of three pairs of blades and one blade in the middle
//   the head    a small oval shield on top, wider than long, with a rim; an ovoid plate low on either side; the eyes
//               on stalks behind the shield, between it and the side plates
//   the mouth   a round cone of plates under the head, behind the arms: three large plates, three or four of middle
//               size between each two of them, and small ones; wrinkled, with knobs near the small opening (Daley and
//               Bergstrom 2012)
//   the arms    14 joints, higher than wide, half as long as the body; under each joint a pair of spines, each with
//               smaller spines on its front and its rear
//   the eyes    2 to 3 cm across, with 16,000 lenses and more (Paterson and others 2011)
// Estimates, where no source gives a figure: every height (the body here is 0.19 wide and 0.12 high: no source gives
// its section, restorations draw it wider than high); how far the shield, the plates and the mouth stand out; that the
// rays lie in the front part of a flap and run out along it; that long and short spines take turns along an arm and
// that it ends in three small ones; which of the plates of the mouth points forward; that the front blades of the
// fan are the longest. The lenses are drawn about 50 across an eye, not 140: as fine as they were they would not be
// seen at all.
// ANF, AND: the length of the longest flap and how far the flaps point down from level, in radians. ANY, ANZ: where
// the arms come out from under the front of the head (how far under the middle of the body, how far ahead of it): from
// there on the shader curls them. ANL: how long they are
const ANF = 0.17, AND = 0.15, ANY = 0.022, ANZ = 0.47, ANL = 0.32;
// AN_Z0, AN_DZ: where the first pair of flaps of the trunk is, and how far it is from one pair to the next (the length
// of a segment). AN_HY: how high on the flank the flaps grow; AN_HK: how far out, as a share of the body's half width
// (the line they beat about: the shader finds it with anWd). AN_SW, AN_PT: how far they are swept back, and how much
// higher their front edge lies than their rear edge. AN_AX: how far each arm is from the middle; AN_AC: how much
// shorter the joints get along an arm (anJoint). AN_EYE, AN_ER: the middle of the right eye and its radius; AN_EA: the
// way its stalk points. AN_MZ, AN_MR: the mouth; AN_SH: the shield on the head (z of its middle, half its width, half
// its length)
const AN_Z0 = 0.225, AN_DZ = 0.052, AN_HY = -0.012, AN_HK = 0.97, AN_SW = 0.47, AN_PT = 0.3, AN_AX = 0.025, AN_AC = 0.35;
const AN_EYE = [0.128, 0.064, 0.356], AN_ER = 0.027, AN_EA = [0.86, 0.5, 0.1], AN_MZ = 0.385, AN_MR = 0.036, AN_SH = [0.425, 0.052, 0.036];
// Half the width of the body at z: the trunk, the narrow neck, the head with its round front. anHb, anHv: how far the
// back rises over the widest line of the body there, and how far the belly hangs under it. anWd in the shaders is anW
// behind the head: change one, change the other
const anW = (z) => (z < 0.1 ? 0.094 * pow(max(1 - pow((0.1 - z) / 0.62, 1.7), 0), 0.8) : 0.094 * (1 - 0.17 * sstep(0.2, 0.31, z)) + 0.006 * sstep(0.31, 0.39, z)) * sqrt(max(1 - pow(max(z - 0.39, 0) / 0.11, 2.4), 0));
const anHb = (z) => 0.068 * pow(anW(z) / 0.094, 0.85), anHv = (z) => 0.05 * pow(anW(z) / 0.094, 0.85);
// The outline of the body at z, at the angle a round it (0 at the right flank, a quarter turn at the top), k times as
// large: a broad arch over a flatter belly. anTop, anBot: how high its back and its belly are at x
const anSec = (z, a, k = 1) => { const c = cos(a), s = sin(a); return [k * anW(z) * (c < 0 ? -1 : 1) * pow(abs(c), 0.8), k * (s > 0 ? anHb(z) * pow(s, 0.9) : -anHv(z) * pow(-s, 0.75))]; };
const anTop = (x, z) => anHb(z) * pow(max(1 - pow(abs(x) / anW(z), 2.5), 0), 0.45), anBot = (x, z) => -anHv(z) * pow(max(1 - pow(abs(x) / anW(z), 2.5), 0), 0.375);
// how long the flap is that grows at z: the three of the neck short, then quickly longer to the third of the trunk,
// and from the fifth on shorter and shorter (anLn in the shaders: change one, change the other)
const anLen = (z) => ANF * (z > 0.25 ? 0.36 - (z - 0.271) : z > 0.121 ? 1 - 0.28 * pow((z - 0.121) / 0.104, 1.5) : min(1, 1 - 1.65 * (0.045 - z)));
// where along an arm its joint q lies (0 at its root, 1 at its tip): the joints get shorter towards the tip
const anJoint = (q) => q * (1 + AN_AC) - AN_AC * q * q;
// Rings of points (each a closed row of vertex numbers, all the same way round) joined into a skin, and a ring closed
// with a point. As loft() in swimmers.js does it: the outer side is where the rings run anticlockwise, seen from
// where they lead to (flip, rev: the other way round)
const anSkin = (m, R, flip) => { for (let j = 0; j < R.length - 1; j++) for (let s = 0, M = R[j].length; s < M; s++) { const s2 = (s + 1) % M; if (flip) m.quad(R[j][s], R[j + 1][s], R[j + 1][s2], R[j][s2]); else m.quad(R[j][s], R[j][s2], R[j + 1][s2], R[j + 1][s]); } };
const anCap = (m, ring, p, aux, rev) => { const c = m.v(p[0], p[1], p[2], aux); for (let s = 0, M = ring.length; s < M; s++) { const s2 = (s + 1) % M; if (rev) m.tri(ring[s2], ring[s], c); else m.tri(ring[s], ring[s2], c); } };
// a number, and three of them, as WGSL takes them
const anNum = (v) => { const s = String(+v.toFixed(6)); return /[.e]/.test(s) ? s : s + '.'; }, anVec = (v) => 'vec3f(' + v.map(anNum).join(', ') + ')';

// ---------------------------------------------------------------- mesh
// aux: 0 on the body; .02 to .49 across a flap, from its thin rear edge to its firm front edge; .62 to .9 down a spine
// of an arm, 1 on the arm itself; -.06 to -.14 across a band of gills, from its front to the tips of its blades; -.22
// to -.38 across a blade of the tail fan; -.5 on the shield and the side plates of the head; -.62 on the mouth; -.8 on
// the stalks of the eyes; -1 on the eyes
function meshAnomalocaris() {
  const m = new Mesh(), nrm = (v) => { const l = hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  // ---- the body, ring after ring from the tail to the front of the head. Every segment of the trunk swells between
  // two furrows
  const M = 18, ring = (z, k) => Array.from({ length: M }, (_, s) => { const [x, y] = anSec(z, s / M * TAU, k); return m.v(x, y, z, 0); });
  const zs = [[-0.4985, 1], [-0.492, 1], [-0.48, 1], [-0.464, 1], [-0.446, 1]];
  for (let k = 12; k >= 0; k--) { const zr = AN_Z0 - (k + 0.5) * AN_DZ; zs.push([zr, 0.955], [zr + 0.3 * AN_DZ, 1.03], [zr + 0.7 * AN_DZ, 1.03]); }
  zs.push([AN_Z0 + 0.5 * AN_DZ, 0.955]);
  for (const z of [0.266, 0.283, 0.3, 0.316, 0.332, 0.35, 0.368, 0.386, 0.404, 0.422, 0.44, 0.456, 0.47, 0.481, 0.489, 0.495, 0.4985]) zs.push([z, 1]);
  const body = zs.map(([z, k]) => ring(z, k));
  anSkin(m, body); anCap(m, body[0], [0, 0, -0.5], 0, true); anCap(m, body[body.length - 1], [0, 0, 0.5], 0);
  // ---- the gills: on every segment of the trunk a band on either side, from the flank up to the divide along the
  // middle of the back. Its front edge lies on the body, its rear edge stands off it and reaches over the band behind
  const GE = [0.4, 0.85, 1, 1, 1, 0.85, 0.45];
  for (let k = 0; k < 13; k++) for (const sx of [-1, 1]) {
    const zf = AN_Z0 - (k - 0.5) * AN_DZ - 0.003, zr = zf - 1.2 * AN_DZ, rings = [];
    for (let j = 0; j < 7; j++) {
      const a = (13 + 66 * j / 6) * PI / 180;
      // (a point of it: r over the body at z, straight out from its surface)
      const at = (z, r, aux) => { const [x, y] = anSec(z, a), nx = cos(a) * anHb(z), ny = sin(a) * anW(z), nl = hypot(nx, ny); return m.v(sx * (x + nx / nl * r), y + ny / nl * r, z, aux); };
      rings.push([at(zf, 0.0005, -0.06), at((zf + zr) / 2, 0.0052 * GE[j], -0.1), at(zr, 0.0085 * GE[j], -0.14), at(zr + 0.007, 0.0035 * GE[j], -0.14)]);
    }
    anSkin(m, rings, sx < 0);
    if (sx > 0) { m.quad(rings[0][3], rings[0][2], rings[0][1], rings[0][0]); m.quad(...rings[6]); } else { m.quad(...rings[0]); m.quad(rings[6][3], rings[6][2], rings[6][1], rings[6][0]); }
  }
  // ---- flaps and blades. One of them: from root out along d, len long, at s (0 to 1 along it) hc(s) wide to either
  // side along c and t thick. Its section (SEC, or sec): how far along c, how far up along u. The front edge (at 1
  // along c) is thick and round, the rear edge thin; it is arched a little from edge to edge, and droops towards
  // its tip. S: the places along it where it has a ring of points. auxOf: what a point of the section carries
  const SEC = [[1, 0], [0.78, 0.95], [0.15, 0.7], [-1, 0.12], [-1, -0.12], [0.15, -0.55], [0.78, -0.85]];
  const flap = (root, d0, c0, len, hc0, t0, S, auxOf, up, sec = SEC) => {
    const d = nrm(d0), c = nrm(c0), u = nrm(cross(c, d)).map((v) => v * up), rings = [];
    const pt = (s, e, q, aux) => m.v(root[0] + d[0] * len * s + c[0] * e + u[0] * q, root[1] + d[1] * len * s + c[1] * e + u[1] * q, root[2] + d[2] * len * s + c[2] * e + u[2] * q, aux);
    for (const s of S) {
      const w = hc0 * (1 - 0.7 * s * s) * sqrt(max(1 - pow(s, 6), 0)), t = t0 * (1 - 0.6 * s);
      rings.push(sec.map(([e, f]) => pt(s, e * w, f * t + 0.12 * w * (1 - e * e) - 0.05 * len * s * s, auxOf(e))));
    }
    anSkin(m, rings, up > 0);
    const last = rings[rings.length - 1], tip = pt(1, 0, -0.05 * len, auxOf(0));
    for (let s = 0; s < last.length; s++) { const s2 = (s + 1) % last.length; if (up > 0) m.tri(last[s2], last[s], tip); else m.tri(last[s], last[s2], tip); }
  };
  const FS = [0, 0.15, 0.32, 0.5, 0.68, 0.84, 0.95], NS = [0, 0.3, 0.6, 0.86], TS2 = [0, 0.18, 0.4, 0.62, 0.82, 0.95];
  for (const sx of [-1, 1]) {
    // three pairs on the neck, 13 on the trunk. They begin inside the body, so that they grow out of its flank
    for (let k = 0; k < 16; k++) {
      const neck = k < 3, z = neck ? 0.335 - k * 0.032 : AN_Z0 - (k - 3) * AN_DZ, len = anLen(z);
      flap([sx * 0.8 * anW(z), AN_HY, z], [sx * cos(AND), -sin(AND), -AN_SW], [0, AN_PT, 1], len, neck ? 0.027 : 0.03 + 0.016 * len / ANF, neck ? 0.005 : 0.0075, neck ? NS : FS, (e) => 0.255 + 0.235 * e, sx);
    }
    // the tail fan: three pairs of blades that point up, out and back, out of the upper sides of the tail
    for (let k = 0; k < 3; k++) flap([sx * 0.01, 0.008, -0.437 - k * 0.024], [sx * 0.55, 0.62, -0.56], [0, 0.25, 1], 0.115 - 0.015 * k, 0.03, 0.0055, TS2, (e) => -0.3 + 0.08 * e, sx);
  }
  // (and its blade in the middle, level, with two thin edges)
  flap([0, 0.004, -0.488], [0, 0.12, -1], [1, 0, 0], 0.08, 0.017, 0.004, [0, 0.25, 0.5, 0.75, 0.93], (e) => -0.3 + 0.08 * (1 - 2 * abs(e)), 1, [[1, 0], [0.5, 0.8], [-0.5, 0.8], [-1, 0], [-0.5, -0.8], [0.5, -0.8]]);
  // ---- the head. Its shield: a low dome on top, with a furrow inside its rim, and the rim rolled under
  {
    const [cz, sa, sb] = AN_SH, rings = [];
    for (const [rho, lift] of [[0.28, 0.0112], [0.56, 0.0102], [0.8, 0.0078], [0.91, 0.0058], [0.99, 0.0078], [1.06, 0.004], [1.03, -0.0005], [0.92, -0.004]]) rings.push(Array.from({ length: 24 }, (_, k) => { const a = k / 24 * TAU, x = sa * rho * sin(a), z = cz + sb * rho * cos(a); return m.v(x, anTop(x, z) + lift, z, -0.5); }));
    anSkin(m, rings, true); anCap(m, rings[0], [0, anTop(0, cz) + 0.0116, cz], -0.5);
  }
  for (const sx of [-1, 1]) {
    // the ovoid plate low on its side, half sunk into the flank
    const [px, py] = anSec(0.4, -22 * PI / 180);
    ball(m, [sx * (px - 0.003), py, 0.4], [0.011, 0.021, 0.034], -0.5, 10, 5);
    // an eye: the stalk grows out of the head behind the shield, thick at its foot, and widens into a cup that
    // holds the ball
    const SR = [0.019, 0.0145, 0.0118, 0.0106, 0.0108, 0.0125, 0.0155, 0.0185];
    m.tube(curve([[0.05, 0.022, 0.35], [0.078, 0.04, 0.35], [0.098, 0.052, 0.352], [0.11, 0.058, 0.354]].map(([x, y, z]) => [sx * x, y, z]), 7), (k) => SR[k], 8, false, () => -0.8);
    ball(m, [sx * AN_EYE[0], AN_EYE[1], AN_EYE[2]], AN_ER, -1, 20, 12);
  }
  // ---- the mouth: a low cone under the head. Round it one large plate, then three of middle size with a small one
  // after each, three times. Every plate is a ridge that runs in to the opening, the large ones furthest, with a
  // groove between each two; in the middle the opening, a pit
  {
    const B = [0, 30, 50, 60, 80, 90, 110, 120], KIND = [0, 1, 2, 1, 2, 1, 2], rings = [[], [], [], [], [], []];
    for (let k = 0; k < 72; k++) {
      const q = (k * 5 + 15) % 120, a = k * 5 * PI / 180, edge = B.includes(q), kd = KIND[B.findIndex((b, j) => q >= b && q < B[j + 1])], big = kd === 0 ? 1 : 0;
      const P = [[1.1, -0.003], [1, edge ? 0.0015 : 0.004], [0.76, edge ? 0.006 : 0.0105 + 0.002 * big], [edge ? 0.62 : [0.32, 0.45, 0.58][kd], edge ? 0.0065 : 0.012 + 0.003 * big], [edge ? 0.3 : 0.24, 0.003], [0.13, -0.007]];
      P.forEach(([rho, drop], j) => { const x = AN_MR * rho * sin(a), z = AN_MZ + AN_MR * rho * cos(a); rings[j].push(m.v(x, anBot(x, z) - drop, z, -0.62)); });
    }
    anSkin(m, rings, true); anCap(m, rings[5], [0, anBot(0, AN_MZ) + 0.013, AN_MZ], -0.62, true);
  }
  // ---- the arms, side by side, straight ahead (the shader curls them). Each begins inside the head, so that it
  // comes out from under it. 14 joints, each a little swollen, higher than wide
  const ah = (q) => 0.0245 - 0.0165 * pow(clamp(q, 0, 1), 0.85);
  for (const sx of [-1, 1]) {
    const cx = sx * AN_AX, rings = [], ar = (z, h) => Array.from({ length: 10 }, (_, s) => m.v(cx + 0.64 * h * cos(s / 10 * TAU), -ANY + h * sin(s / 10 * TAU), z, 1));
    rings.push(ar(ANZ - 0.085, 0.9 * ah(0)), ar(ANZ - 0.04, ah(0)));
    for (let j = 0; j < 14; j++) for (const [t, k] of [[0, 0.84], [0.22, 1], [0.78, 1.03]]) rings.push(ar(ANZ + ANL * anJoint((j + t) / 14), k * ah((j + t) / 14)));
    rings.push(ar(ANZ + ANL * anJoint(0.985), 0.7 * ah(1)));
    anSkin(m, rings); anCap(m, rings[rings.length - 1], [cx, -ANY, ANZ + ANL], 1);
    // under each joint but the first a pair of spines, long and short in turn, that point down, a little forward and
    // apart. They begin inside the arm. On the front and the rear of a long one a smaller spine, on a short one only
    // in front
    for (let j = 1; j < 14; j++) {
      const q = (j + 0.7) / 14, z = ANZ + ANL * anJoint(q), h = ah(q), long = j % 2 === 1, L = (long ? 1.9 : 1) * h, r0 = (long ? 0.21 : 0.17) * h;
      for (const e of [-1, 1]) {
        const dv = nrm([e * 0.24, -0.94, 0.22]), at = (s, fw) => [cx + e * 0.3 * h + dv[0] * L * s, -ANY - 0.5 * h + dv[1] * L * s, z + dv[2] * L * s + fw * L];
        const pts = long ? [at(0, 0), at(0.36, 0), at(0.7, 0.03), at(1, 0.1)] : [at(0, 0), at(0.5, 0), at(1, 0.06)], RK = long ? [1, 0.78, 0.48, 0.05] : [1, 0.6, 0.05];
        m.tube(pts, (k) => r0 * RK[k], long ? 5 : 4, true, (k) => 0.62 + 0.28 * k / (pts.length - 1));
        for (const [s, fz] of long ? [[0.4, 1], [0.58, -1]] : [[0.45, 1]]) { const p = at(s, 0); m.tube([p, [p[0] + dv[0] * 0.1 * L, p[1] - 0.24 * L, p[2] + fz * 0.27 * L]], (k) => k ? 0.0003 : 0.5 * r0, 3, true, (k) => 0.7 + 0.2 * k); }
      }
    }
    // and three small ones at its tip
    for (const [dy, dz, len] of [[0.25, 1, 0.03], [-0.35, 0.95, 0.034], [-0.9, 0.5, 0.026]]) { const b = [cx, -ANY + 0.3 * dy * ah(1), ANZ + ANL - 0.008], dv = nrm([0, dy, dz]); m.tube([b, [b[0] + dv[0] * len * 0.5, b[1] + dv[1] * len * 0.5, b[2] + dv[2] * len * 0.5], [b[0] + dv[0] * len, b[1] + dv[1] * len - 0.004, b[2] + dv[2] * len]], (k) => [0.0042, 0.003, 0.0003][k], 4, true, (k) => 0.66 + 0.12 * k); }
  }
  return m;
}

// ---------------------------------------------------------------- shaders
const S_ANOMALOCARIS = /*wgsl*/`
const AN_Z0 = ${anNum(AN_Z0)}; const AN_DZ = ${anNum(AN_DZ)}; const AN_HY = ${anNum(AN_HY)}; const AN_HK = ${anNum(AN_HK)};
const AN_AC = ${anNum(AN_AC)}; const AN_ZA = ${anNum(ANZ)}; const AN_YA = ${anNum(ANY)}; const AN_LA = ${anNum(ANL)}; const AN_LF = ${anNum(ANF)};
const AN_EC = ${anVec(AN_EYE)}; const AN_ER = ${anNum(AN_ER)}; const AN_MZ = ${anNum(AN_MZ)}; const AN_MR = ${anNum(AN_MR)};
const AN_SZ = ${anNum(AN_SH[0])}; const AN_SA = ${anNum(AN_SH[1])}; const AN_SB = ${anNum(AN_SH[2])};
// the way the stalk of the right eye points, and two directions across it
const AN_EA = ${anVec(((v) => { const l = hypot(...v); return v.map((c) => c / l); })(AN_EA))};
const AN_E1 = ${anVec(((v) => { const l = hypot(v[1], v[0]); return [v[1] / l, -v[0] / l, 0]; })(AN_EA))};
const AN_E2 = ${anVec(((v) => { const l = hypot(...v), a = v.map((c) => c / l), k = hypot(a[1], a[0]), e = [a[1] / k, -a[0] / k, 0]; return [a[1] * e[2] - a[2] * e[1], a[2] * e[0] - a[0] * e[2], a[0] * e[1] - a[1] * e[0]]; })(AN_EA))};
fn anG(v: f32) -> f32 { return exp(-v * v); }
// half the width of the body at z, behind the head, and how long the flap is that grows at z (anW and anLen of the
// mesh: change one, change the other)
fn anWd(z: f32) -> f32 {
  return select(.094 * (1. - .17 * ss(.2, .31, z)) + .006 * ss(.31, .39, z), .094 * pow(max(1. - pow(max(.1 - z, 0.) / .62, 1.7), 0.), .8), z < .1);
}
fn anLn(z: f32) -> f32 {
  return AN_LF * select(select(min(1., 1. - 1.65 * (.045 - z)), 1. - .28 * pow(max(z - .121, 0.) / .104, 1.5), z > .121), .36 - (z - .271), z > .25);
}
// from the middle of the six-sided cell that p lies in to p (cells one wide)
fn anHex(p: vec2f) -> vec2f {
  let r = vec2f(1., 1.7320508); let h = r * .5;
  let a = p - r * floor(p / r) - h; let b = p - h - r * floor((p - h) / r) - h;
  return select(b, a, dot(a, a) < dot(b, b));
}
// Instance: a = the middle of its path and half the length of that path (w), b = where on it the animal starts, its
// speed (rad/s, the sign is the direction), the length of its body, a seed.
// The path is an oval lying along z, as wide as the seed says (anK): at least 0.7 times as wide as long, or its
// turns would be tighter than the animal can bend. Every vertex of the trunk sits its own z further along the path,
// so the body follows it like a train on rails and bends through the turns. Head and arms do not: they are stiff
// and point where the neck points, and so does the tail fan behind the last segment. anK, anP and anT are repeated
// in zooAnomalocaris below: change one, change the other
fn anK(sd: f32) -> f32 { return .7 + .3 * fract(sd * 7.); }
fn anP(ta: f32, a: vec4f, sd: f32) -> vec3f { return a.xyz + vec3f(a.w * anK(sd) * sin(ta), 1.6 * TSC * sin(2. * ta + sd * 6.3), a.w * cos(ta)); }
fn anT(ta: f32, a: vec4f, sd: f32) -> vec3f { return vec3f(a.w * anK(sd) * cos(ta), 3.2 * TSC * cos(2. * ta + sd * 6.3), -a.w * sin(ta)); }
@vertex fn vsAnomalocaris(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let sz = i.b.z; let sd = i.b.w; let dir = sign(i.b.y); let au = i.n.w;
  var l = i.p; var n = i.n.xyz; let sgn = select(-1., 1., l.x > 0.);
  // The flaps beat up and down about the line along the flank that they grow from (aux .012 to .52). How far a
  // place is in its beat depends only on where it is, not on which flap it belongs to: a wave that runs back along
  // the body, the tips trailing, and where two flaps lie over one another they move as one. So a row of them works
  // as one fin
  let fl = step(.012, au) * step(au, .52); let hx = AN_HK * anWd(l.z); let hv = vec2f(abs(l.x) - hx, l.y - AN_HY);
  let th = .34 * sin(t * 2.4 + l.z * 8. + sd * 20. - length(hv) * 6.5) * ss(0., .025, hv.x) * fl;
  var ct = cos(th); var st = sin(th); var nx = sgn * n.x;
  l = vec3f(sgn * (hx + hv.x * ct - hv.y * st), AN_HY + hv.x * st + hv.y * ct, l.z);
  n = vec3f(sgn * (nx * ct - n.y * st), nx * st + n.y * ct, n.z);
  // the blades of the tail fan open and close a little with that wave (aux -.42 to -.19), the one in the middle not
  let tf = step(-.42, au) * step(au, -.19);
  let fa = (.1 * sin(t * 2.4 + l.z * 8. + sd * 20.) + .06 * sin(t * .7 + sd * 5.)) * ss(.004, .04, abs(l.x)) * tf;
  ct = cos(fa); st = sin(fa); nx = sgn * n.x; let fv = vec2f(abs(l.x), l.y - .008);
  l = vec3f(sgn * (fv.x * ct - fv.y * st), .008 + fv.x * st + fv.y * ct, l.z);
  n = vec3f(sgn * (nx * ct - n.y * st), nx * st + n.y * ct, n.z);
  // the eyes look about: each stalk turns a little forward and back about its foot (aux below -.7)
  let ea = .14 * sin(t * .45 + sd * 13. + sgn * 1.3) * step(au, -.7);
  ct = cos(ea); st = sin(ea); nx = sgn * n.x; let ev = vec2f(abs(l.x) - .055, l.z - .352);
  l = vec3f(sgn * (.055 + ev.x * ct - ev.y * st), l.y, .352 + ev.x * st + ev.y * ct);
  n = vec3f(sgn * (nx * ct - n.z * st), n.y, nx * st + n.z * ct);
  // The arms curl down and under and stretch again, slowly and nearly together, and open and close sideways (aux
  // above .55; in the mesh they point straight ahead, and bend from where they leave the head). They curl more
  // tightly towards their tips: the bend at d along an arm is k0 + 2 k1 d, and its middle line is summed up in steps
  let ar = step(.55, au); let d = max(l.z - AN_ZA, 0.) * ar;
  let cu = .5 + .5 * sin(t * .6 + sd * 9. + sgn * .3); let k0 = mix(.8, 2.8, cu); let k1 = mix(2., 12., cu);
  var cl = vec2f(0.); let ds = d / 8.;
  for (var q = 0; q < 8; q++) { let dm = (f32(q) + .5) * ds; let ph = k0 * dm + k1 * dm * dm; cl += vec2f(-sin(ph), cos(ph)) * ds; }
  let an = k0 * d + k1 * d * d; let oy = l.y + AN_YA;
  let bent = vec3f(l.x + sgn * d * (.05 + .05 * sin(t * .37 + sd * 5.)), cl.x + oy * cos(an) - AN_YA, AN_ZA + min(l.z - AN_ZA, 0.) + cl.y + oy * sin(an));
  l = mix(l, bent, ar);
  n = mix(n, vec3f(n.x, n.y * cos(an) - n.z * sin(an), n.y * sin(an) + n.z * cos(an)), ar);
  // It gives way to the viewer: where its middle line would pass the camera closer than gr (a little more than half
  // its length, and twice the near plane), all of it moves aside, or down if the camera is right in its way, and it
  // begins to before it is there. (zooAnomalocaris has the same)
  let ta0 = t * i.b.y + i.b.x; let zr = clamp(l.z, -.45, .3); let gr = .45 * sz + 2. * g.fwd.w;
  let cv = g.cam.xyz - anP(ta0, i.a, sd); let T0 = normalize(anT(ta0, i.a, sd)); let al = dot(cv, T0); let lat = cv - T0 * al;
  let give = normalize(lat + vec3f(0., .12 * gr, 0.)) * (-.7 * gr * (1. - ss(0., gr, length(lat))) * (1. - ss(.7 * sz, 1.4 * sz + 2. * gr, abs(al))));
  // onto the path, banked into the turn
  let ta = ta0 + dir * zr * sz / length(anT(ta0, i.a, sd));
  let T = normalize(anT(ta, i.a, sd)) * dir;
  var S = normalize(cross(vec3f(0., 1., 0.), T)); var Up = cross(T, S);
  let bank = .12 * dir;
  let S2 = S * cos(bank) - Up * sin(bank); Up = Up * cos(bank) + S * sin(bank); S = S2;
  let w = anP(ta, i.a, sd) + give + (S * l.x + Up * l.y + T * (l.z - zr)) * sz;
  // (the fragment shader needs the length too: it travels with the seed, as whole millimetres)
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = floor(sz * 1000.) + fract(sd); o.lt = au;
  return o;
}
// The skin. Colours are free: no fossil shows them. Brick red to orange, so that it is the one warm, strong colour
// in the green water: a dark red-brown back, a darker band across the rear of every segment, brick-red flanks, a
// cream belly; the gills dark red with paler tips; the flaps orange, brick red along their firm front edge, pale
// towards their thin rear edge and their tips, where the light comes through them; the arms brick red over cream,
// with pale joints and dark spines; the eyes dark and glossy. Each animal has its own tone and its own blotches.
// The relief: the furrows between the segments, the blades of the gills, the rays of the flaps, the plates of the
// mouth with their wrinkles and knobs, the joints of the arms, the lenses of the eyes, and fine grain everywhere
@fragment fn fsAnomalocaris(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let L = floor(i.sd) / 1000.; let sd = fract(i.sd); let lt = i.lt;
  let x = abs(i.op.x); let y = i.op.y; let z = i.op.z;
  let flap = step(.012, lt) * step(lt, .52); let fan = step(-.42, lt) * step(lt, -.19); let gill = step(-.17, lt) * step(lt, -.03);
  let plate = step(-.56, lt) * step(lt, -.44); let mouth = step(-.7, lt) * step(lt, -.56); let stalk = step(-.9, lt) * step(lt, -.7); let eye = step(lt, -.9);
  let arm = step(.95, lt); let spine = step(.55, lt) * (1. - arm); let body = 1. - min(flap + fan + gill + plate + mouth + stalk + eye + arm + spine, 1.);
  // which way the side that is seen faces in the animal's own space, where it does not move (flat, from one triangle
  // to the next: good enough to tell an upper side from an under side)
  let cr = cross(dpdx(i.op), dpdy(i.op)); let no = -cr / max(length(cr), 1e-20);
  let tx = textureSample(tD, sR, i.op.zx * vec2f(5., 7.) + i.op.y * vec2f(4., 6.) + sd * 3.);
  // (two looks at the mottling, each turned its own way: one alone shows the grid of the texture)
  let tg = textureSample(tD, sR, vec2f(i.op.x * 53. + i.op.z * 29., i.op.z * 47. - i.op.x * 23.) + i.op.y * vec2f(37., 51.) + sd) * .5
    + textureSample(tD, sR, vec2f(i.op.x * 83. - i.op.z * 37., i.op.z * 89. + i.op.x * 53.) + i.op.y * vec2f(61., 41.) + .37) * .5;
  let ns = normalize(i.n) * select(-1., 1., ff); let V = normalize(g.cam.xyz - i.wp);
  // (the relief fades where it would be finer than the pixels)
  let fine = ss(.006, .0015, fwidth(z) + fwidth(x) + fwidth(y));
  // how high on the body a place is: 1 on the middle of the back, 0 at its widest, -1 on the middle of the belly
  let wz = max(anWd(min(z, .36)), .004); let hb = .068 * pow(wz / .094, .85); let yn = select(y / (.05 * pow(wz / .094, .85)), y / hb, y > 0.);
  let tone = fract(sd * 13.7); let hue = fract(sd * 5.3); let wob = (tx.a - .5) * .5;
  let dk = mix(vec3f(.15, .032, .02), vec3f(.17, .055, .02), hue);
  let brick = mix(vec3f(.58, .12, .05), vec3f(.62, .20, .05), hue);
  let orange = mix(vec3f(.92, .34, .07), vec3f(.96, .45, .09), hue);
  let cream = vec3f(.86, .62, .40);
  // ---- the body: where in its segment a place is (sv, 0 at its front), and the furrow between two segments
  let trunk = ss(.262, .25, z) * ss(-.435, -.42, z);
  let sv = fract((AN_Z0 + .5 * AN_DZ - z) / AN_DZ); let fS = anG(min(sv, 1. - sv) / .07) * trunk;
  var alb = mix(cream, mix(orange, brick, ss(-.5, .1, yn + wob)), ss(-.95, -.45, yn + wob * .6));
  alb = mix(alb, dk, ss(.15, .7, yn + wob) * .85);
  alb *= 1. - .4 * ss(.5, .9, sv) * trunk * ss(-.5, .1, yn);
  alb = mix(alb, dk, ss(.6, .78, tx.b) * .45 * ss(-.6, 0., yn));
  // (its belly has fine lines across it; the flank is in shade under the flaps)
  let bl = z * 700.; let bw = (.5 + .5 * cos(bl)) * ss(-.45, -.8, yn) * ss(1.4, .5, fwidth(bl));
  alb *= (1. - .55 * fS * mix(.5, 1., fine)) * (1. - .12 * bw) * mix(1., .72, ss(-.05, -.45, yn) * ss(.55, .9, x / wz) * trunk);
  var h = (-.0035 * fS + .0009 * (tg.a - .5) * (1. - fS) - .0005 * bw) * body;
  // ---- the gills: blade beside blade across the band (gv: 0 at its front, 1 at the tips of the blades), dark
  // between them and under the band in front, the tips pale
  let gv = sat((-.06 - lt) / .08); let ga = atan2(y / hb, x / wz) * 150.; let gf = ss(1.6, .5, fwidth(ga)); let gb = .5 + .5 * cos(ga);
  var gc = mix(vec3f(.26, .05, .035), mix(brick, orange, .35), mix(.5, gb, gf)) * mix(.5, 1.1, ss(0., .5, gv));
  gc = mix(gc, vec3f(.95, .55, .25), ss(.75, 1., gv) * .35);
  alb = mix(alb, gc, gill); h += .0012 * gb * gf * gill;
  // ---- flaps and tail fan: uu from the rear edge (-1) to the front edge (1), sq from the root to the tip. Rays in
  // the front part, which run out along the flap; a darker band across it; pale where it is thin
  let Dx = max(x - AN_HK * wz, 0.); let fu = (lt - .255) / .235;
  let uu = select(fu, (lt + .3) / .08, fan > .5);
  let sq = select(sat((Dx + .015) / (.895 * max(anLn(z + .475 * Dx - fu * .03), .01))), sat(length(vec2f(x - .01, y - .008)) / .085), fan > .5);
  let fr = uu * 8.5; let ray = (.5 + .5 * cos(TAU * fr)) * ss(0., .25, uu) * ss(1.2, .4, fwidth(fr));
  let thin = max(ss(.25, -1., uu), ss(.55, 1., sq));
  var fc = mix(orange, brick, ss(.1, 1., uu) * .75);
  fc = mix(fc, brick * .8, ss(.3, 0., sq) * .6);
  fc *= 1. - .28 * ss(.38, .5, sq + wob * .1) * ss(.72, .6, sq + wob * .1);
  fc = mix(fc, vec3f(1., .62, .22), thin * .7) * (1. - .22 * ray);
  // (its under side is paler)
  fc = mix(fc * vec3f(1.05, 1., .9), fc, ss(-.3, .3, no.y));
  alb = mix(alb, fc, flap + fan); h += (.0011 * cos(TAU * fr) * ss(0., .25, uu) * ss(1.2, .4, fwidth(fr)) + .0005 * (tg.a - .5)) * (flap + fan);
  // ---- the shield and the side plates of the head: dark and smooth, the shield with a furrow inside its rim
  let pr = length(vec2f(i.op.x / AN_SA, (z - AN_SZ) / AN_SB)); let pf = anG((pr - .92) / .05);
  alb = mix(alb, mix(dk * 1.25, brick * .75, ss(.35, .7, tx.a)) * (1. - .35 * pf), plate); h += (.0008 * (tg.a - .5) - .0012 * pf) * plate;
  // ---- the mouth: mr from the middle of the opening (0) to the rim of the cone (1), mt round it, in degrees within
  // one third. The plates as in the mesh, a groove between each two (md: how far the nearest is); wrinkles across
  // them; knobs near the opening, which is dark
  let mp = vec2f(i.op.x, z - AN_MZ) / AN_MR; let mr = length(mp); let mt = fract(atan2(mp.x, mp.y) / TAU * 3. + .125) * 120.;
  let md = min(min(min(mt, abs(mt - 30.)), min(abs(mt - 50.), abs(mt - 60.))), min(min(abs(mt - 80.), abs(mt - 90.)), min(abs(mt - 110.), 120. - mt)));
  let mg = ss(3., .6, md) * ss(.25, .4, mr) * ss(1.08, .98, mr);
  let ml = mr * 150.; let mw = (.5 + .5 * cos(ml)) * ss(.3, .5, mr) * ss(1.05, .9, mr) * ss(1.5, .5, fwidth(ml));
  let mb = ss(.55, .8, tg.b) * ss(.65, .35, mr) * ss(.2, .3, mr);
  var mc = mix(vec3f(.80, .56, .40), vec3f(.5, .22, .14), mg) * (1. - .2 * mw);
  mc = mix(mix(mc, vec3f(.95, .8, .6), mb * .5), vec3f(.10, .015, .012), ss(.3, .17, mr));
  alb = mix(alb, mc, mouth); h += (-.0025 * mg - .0006 * mw + .001 * mb) * mouth;
  // ---- the stalks of the eyes
  alb = mix(alb, mix(brick, orange, ss(.07, .11, x)), stalk); h += .0005 * (tg.a - .5) * stalk;
  // ---- the arms: aq along one (0 to 1), jf within a joint, ay from its under side (-1) to its top (1). Brick red
  // over cream, darker towards the far end of every joint, the skin between two joints pale and sunk in
  let gz = (z - AN_ZA) / AN_LA; let aq = (1. + AN_AC - sqrt(max((1. + AN_AC) * (1. + AN_AC) - 4. * AN_AC * gz, 0.))) / (2. * AN_AC);
  let jf = fract(aq * 14.); let jn = ss(.13, .03, min(jf, 1. - jf)) * step(0., gz);
  let ay = (y + AN_YA) / (.0245 - .0165 * pow(sat(aq), .85));
  var ac = mix(mix(cream, orange, ss(-.9, -.2, ay)), brick, ss(-.1, .7, ay + wob * .4)) * (1. - .3 * ss(.55, .95, jf)) * mix(.75, 1., ss(-1., -.5, ay));
  ac = mix(ac, vec3f(.93, .72, .5), jn * .85);
  alb = mix(alb, ac, arm); h += (-.002 * jn + .0006 * (tg.a - .5)) * arm;
  // its spines: pale where they grow out of the arm, dark to their points
  alb = mix(alb, mix(vec3f(.55, .3, .16), vec3f(.045, .018, .012), ss(.05, .75, sat((lt - .62) / .28))), spine);
  // (mottled, and each animal in its own tone)
  alb *= (.82 + .36 * tx.g) * mix(.82, 1.2, tone);
  // ---- the eyes: lens beside lens, six-sided, larger where the eye looks out and finer towards the stalk (the ball
  // is laid out flat from the point where the stalk holds it). Dark, and darkest where the eye looks at the viewer,
  // as the eye of an insect is
  let ec = (vec3f(x, y, z) - AN_EC) / AN_ER; let ep = vec2f(dot(ec, AN_E1), dot(ec, AN_E2)) / (1.03 + dot(ec, AN_EA)) * 26.;
  let eh = anHex(ep); let ef = 1. - 3. * dot(eh, eh); let efd = ss(1.1, .35, fwidth(ep.x) + fwidth(ep.y));
  alb = mix(alb, mix(vec3f(.012, .006, .006), vec3f(.085, .03, .018), ss(0., .7, ef) * efd + .4 * (1. - efd)) * (1. - .75 * pow(sat(dot(ns, V)), 5.)), eye);
  h += .00022 * ef * efd * eye;
  // its light: that of a wet skin (skinWet of S_SEA), strongest on the shield, the spines and the eyes
  let n = skinRelief(ns, i.wp, h * fine * L);
  var c = skinWet(alb, n, ns, i.wp, .22 * (body + gill + flap + fan + stalk) + .3 * (plate + arm) + .5 * spine + .15 * mouth + .6 * eye,
    .45 * (body + stalk) + .25 * (gill + flap + fan) + .9 * plate + .6 * arm + .8 * spine + .3 * mouth + 3.5 * eye);
  // A flap is thin, most of all at its rear edge and its tip: the sun comes through it towards the eye (as through
  // the cups of the tulip animals, TRANS in air.js), and it is lit from its other side as well
  let zn = zone(i.wp); let thn = (flap + fan) * mix(.35, 1., thin);
  c += alb * vec3f(1.15, .8, .5) * sunE(i.wp.y, zn) * shadow4(i.wp + g.sun.xyz * .05) * (.3 * sat(-dot(ns, g.sun.xyz)) + 1.1 * pow(sat(-dot(V, g.sun.xyz)), 3.)) * TRANS * .6 * thn;
  c = mix(c, .5 * (c + skinWet(alb, -n, -ns, i.wp, 0., 0.)), thn * .7);
  return fin(fog(c, i.wp, zn));
}
`;
// Anomalocaris: anK, anP and anT of vsAnomalocaris. A line from the end of the body to the front of the head, which
// are half its length along the path to either side of its middle. It gives way to the viewer as its shader does
const zooAnomalocaris = (a, i) => {
  const R = a[i + 3], sz = a[i + 6], f = a[i + 7] * 7, k = R * (0.7 + 0.3 * (f - floor(f))), ph = a[i + 7] * 6.3, ta = F[TIME] * a[i + 5] + a[i + 4];
  const tx = k * cos(ta), ty = 3.2 * TS * cos(2 * ta + ph), tz = R * sin(ta), d = sz * 0.5 / sqrt(tx * tx + ty * ty + tz * tz), t0 = ta - d, t1 = ta + d;
  const x = k * sin(t0), y = 1.6 * TS * sin(2 * t0 + ph), z = R * cos(t0);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = k * sin(t1) - x; ZP[4] = 1.6 * TS * sin(2 * t1 + ph) - y; ZP[5] = R * cos(t1) - z; ZP[7] = sz * 0.17;
  const tl = 1 / sqrt(tx * tx + ty * ty + tz * tz), cx = F[CX] - a[i] - k * sin(ta), cy = F[CY] - a[i + 1] - 1.6 * TS * sin(2 * ta + ph), cz = F[CZ] - a[i + 2] - R * cos(ta);
  const al = (cx * tx + cy * ty - cz * tz) * tl, ux = cx - tx * tl * al, uy = cy - ty * tl * al, uz = cz + tz * tl * al, ld = sqrt(ux * ux + uy * uy + uz * uz), aa = al < 0 ? -al : al;
  const gr = 0.45 * sz + 2 * NEAR * F[PS], b = 0.12 * gr;
  if (ld < gr && aa < 1.4 * sz + 2 * gr) {
    const q = ld / gr, e0 = (aa - 0.7 * sz) / (0.7 * sz + 2 * gr), e = e0 < 0 ? 0 : e0, m = -0.7 * gr * (1 - q * q * (3 - 2 * q)) * (1 - e * e * (3 - 2 * e)) / sqrt(ux * ux + (uy + b) * (uy + b) + uz * uz);
    ZP[0] += ux * m; ZP[1] += (uy + b) * m; ZP[2] += uz * m;
  }
};
