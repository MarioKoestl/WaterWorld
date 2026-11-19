// ============================================================================
// cambrian: Opabinia
// ============================================================================
// Its mesh, its shaders and, for the zoo, where it is at a time. world.js lists it as a kind and gives it its
// instances. The mesh is modelled around the origin, nose at +z, y up: the instance says how large the animal is in
// the world. aux, the fourth number of a vertex, tells the shaders which part of the animal a vertex belongs to.
// What it shares with the other animals of this era (pieces for the mesh, the light on a skin, giving way to the
// viewer) is in swimmers.js.

// ---------------------------------------------------------------- Opabinia in figures
// Opabinia regalis in the round. Every fossil of it is pressed flat, so what is not an outline is an estimate. The
// outline and the parts are those of the article the card is from (Wikipedia, "Opabinia", read on 2026-11-17, see
// zoo.js), which follows Whittington 1975 for the body and Budd and Daley (Lethaia, 2011) for the flaps:
//   the body  15 segments, about 5 mm wide on an animal of 4 to 7 cm (here 0.1 of its length), ending in a cone;
//   the flaps one pair to a segment, pointing down and out, each lying with its rear edge over the front of the next;
//   the gills rows of blades. Where they sit is disputed: over the bases of the flaps (Whittington 1975), under
//             them (Bergstrom 1986), along the front edge of their upper side (Budd 1996), as a fringe behind them
//             (Zhang and Briggs 2007). Built here is the most recent reading, Budd and Daley 2011: on the upper side
//             of every flap, the first pair too, attached behind its middle and lying back over its rear edge;
//   the legs  disputed too. The triangles along the body of the fossils are pouches of the gut for Whittington and
//             for Zhang and Briggs, short soft cones of legs for Budd 1996. Budd and Daley 2011 keep the legs as a
//             plausible reading, without claws at their tips. Built here: their short soft cones, one pair under
//             each segment, without claws. No card says anything about legs;
//   the tail  three pairs of blades on the cone, pointing up and out, overlapping;
//   the head  five eyes on stalks: two near the front and close to the middle, looking up and forward, two larger
//             ones on longer stalks at the rear and outer edges, looking up and sideways, one between these two,
//             looking up. The mouth under the head, behind the trunk, facing backward;
//   the trunk a third as long as the body, ringed like the hose of a vacuum cleaner, ending in a claw of two halves
//             whose edges carry five spines each, pointing inward and forward.
// Estimates, from no source: how high the body is against its width (0.75, with a flatter belly), how thick a flap
// is (a hundredth of the body's length at its front edge), how far the eyes stand up, that the claw opens up and
// down, the size of the legs, and every colour. Whittington held the body too stiff to swim like a fish: it bends
// only a little here, and swims by the wave of its flaps.
// One unit from the front of the head to the tip of the tail: the trunk is extra.

// Its flaps: the length of the longest one (the body is 1 long) and how far the flaps point down from level, in
// radians. The mesh is built from these, and the shader needs them to beat the flaps
const OPF = 0.115, OPD = 0.55;
// OP_Z0, OP_DZ: the first pair of flaps is at this z, each next one this much behind it (a segment is as long).
// OP_SW: how far a flap sweeps back for each unit it reaches out. OP_CY: how much lower its front edge is than its
// rear edge, for each unit between them (so that each lies over the next like a roof tile). OP_FW: half its width.
// OP_TB, OP_TL, OP_TY: where the trunk leaves the head (z), how long it is, how high its middle line lies.
// OP_MY: how high the middle of the mouth lies. vsOpabinia and fsOpabinia have all of them too
const OP_Z0 = 0.33, OP_DZ = 0.05, OP_SW = 0.18, OP_CY = 0.36, OP_FW = 0.043, OP_TB = 0.485, OP_TL = 0.34, OP_TY = -0.012, OP_MY = -0.03;
// how long the flap of the segment k is, and half its width at s (0 at its root, 1 at its tip): repeated in vsOpabinia
const opFlapLen = (k) => OPF * (0.62 + 0.38 * sin(PI * (k + 2) / 18));
const opFlapWide = (s) => OP_FW * (1 - 0.25 * s) * sqrt(max(1 - pow(s, 5), 0));
// which way the upper side of a flap looks (sx: 1 a right one, -1 a left one)
const opFlapUp = (sx) => { const u = [sx * (OP_CY * OP_SW + sin(OPD)), cos(OPD), OP_CY * cos(OPD)], l = hypot(...u); return u.map((v) => v / l); };
// The body: sections [z, half width, half height, height of its middle] from the tip of the tail to the front of the
// head, and the section at any z between them (rounded off, as loft() of swimmers.js does it)
const OP_K = [[-0.5, 0.004, 0.004, 0.006], [-0.46, 0.014, 0.013, 0.004], [-0.395, 0.028, 0.025, 0], [-0.3, 0.038, 0.032, 0], [-0.15, 0.047, 0.039, 0], [0, 0.052, 0.042, 0], [0.15, 0.053, 0.043, 0], [0.3, 0.048, 0.041, 0], [0.355, 0.045, 0.04, 0.001], [0.4, 0.049, 0.045, 0.004], [0.445, 0.047, 0.044, 0.004], [0.48, 0.034, 0.034, 0], [0.5, 0.012, 0.014, -0.006]];
const opSec = (z) => {
  let i = 0; while (i < OP_K.length - 2 && OP_K[i + 1][0] < z) i++;
  const u = clamp((z - OP_K[i][0]) / (OP_K[i + 1][0] - OP_K[i][0]), 0, 1), k = (o) => OP_K[clamp(i + o, 0, OP_K.length - 1)];
  return [1, 2, 3].map((q) => { const a = k(-1)[q], b = k(0)[q], c = k(1)[q], d = k(2)[q]; return 0.5 * (2 * b + (c - a) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (3 * b - a - 3 * c + d) * u * u * u); });
};
// its outline: an arched back, sides that are a little square, a flatter belly
const opShape = (a) => { const c = cos(a), s = sin(a); return [(c < 0 ? -1 : 1) * pow(abs(c), 0.8), s >= 0 ? s : -0.8 * pow(-s, 0.7)]; };
// a number as WGSL takes it as a float
const opNum = (v) => { const s = String(+v.toFixed(6)); return /[.e]/.test(s) ? s : s + '.'; };

// ---------------------------------------------------------------- mesh
// aux: 0 on the body and the mouth; on a flap how far out along it a vertex is (.016 to .5, as a share of OPF
// halved), with a minus on every second flap (the shader finds the flap of a vertex by that: they overlap); .55 to
// .95 on the gill blades (how far out the blade sits, again as a share of OPF); -.6 on the trunk, -.65 and -.7 on
// the upper and the lower half of the claw, -.75 on the legs, -.8 on the tail blades, -.85 on the stalks of the
// eyes, -.9 on their balls, -1 on their lenses. (A vertex keeps aux in 127 steps: see Mesh.build)
function meshOpabinia() {
  const m = new Mesh();
  // ---- the body: four rings to a segment, so that each is a low rib that is widest near its rear and steps down
  // to the next one; the cone of the tail behind them, the head in front
  const K = [];
  const ring = (z, f) => { const [w, h, y] = opSec(z); K.push([z, w * f, h * f, y]); };
  for (const z of [-0.5, -0.487, -0.468, -0.445, -0.42, -0.402]) ring(z, 1);
  for (let k = 14; k >= 0; k--) for (const [v, f] of [[0.9, 1.025], [0.62, 1.05], [0.3, 1.03], [0.04, 0.96]]) ring(OP_Z0 + 0.5 * OP_DZ - (k + v) * OP_DZ, f);
  for (const z of [0.365, 0.38, 0.4, 0.42, 0.44, 0.458, 0.473, 0.486, 0.495, 0.5]) ring(z, 1);
  loft(m, K, 1, 16, 0, opShape);
  // the mouth: a low swelling under the head, behind the trunk. Its opening faces backward (fsOpabinia paints it)
  ball(m, [0, OP_MY, 0.41], [0.014, 0.009, 0.013], 0, 8, 4);
  for (const sx of [-1, 1]) {
    const up = opFlapUp(sx);
    for (let k = 0; k < 15; k++) {
      const z = OP_Z0 - k * OP_DZ, len = opFlapLen(k), [bw, bh, by] = opSec(z);
      // ---- a flap: from the lower side of the body down and out, swept back a little. Its section is that of a wing:
      // a thick, round front edge and a thin rear edge. Its root lies inside the body
      const root = [sx * bw * 0.8, by - 0.014, z], d = [sx * cos(OPD), -sin(OPD), -OP_SW], c = [0, -OP_CY, 1], rings = [];
      const at = (s, e, f) => [0, 1, 2].map((q) => root[q] + d[q] * s * len + c[q] * e + up[q] * f);
      const thick = (s) => (0.0075 - 0.0045 * s) * min(1, opFlapWide(s) / 0.015);
      for (const s of [0, 0.25, 0.5, 0.72, 0.9, 1]) {
        const w = max(opFlapWide(s), 1e-4), t = thick(s), a = (k % 2 ? -1 : 1) * max(0.5 * s * len / OPF, 0.016);
        rings.push([[1, 0], [0.7, 1], [0, 0.8], [-0.65, 0.35], [-1, 0], [-0.3, -0.4], [0.7, -0.9]].map(([e, f]) => m.v(...at(s, e * w, f * t), a)));
      }
      // (wound so that the normals look outward on both sides: the vertex shader tells the upper side by them)
      for (let j = 0; j < rings.length - 1; j++) for (let e = 0; e < 7; e++) {
        const a = rings[j][e], b = rings[j][(e + 1) % 7], g = rings[j + 1][(e + 1) % 7], h = rings[j + 1][e];
        if (sx > 0) m.quad(a, h, g, b); else m.quad(a, b, g, h);
      }
      // ---- its gills: six blades in a row on its upper side, each rising out of it behind its middle and lying back
      // over its rear edge, a little way over the flap behind. A blade is a low ridge with a flat under side
      const dl = hypot(...d), cl = hypot(...c);
      for (let j = 0; j < 6; j++) {
        const s = 0.2 + 0.105 * j, w = opFlapWide(s), hA = 0.77 * thick(s) + 0.0012, lb = 1.33 * w, f = sqrt(w / OP_FW), a = 0.55 + 0.4 * min(s * len / OPF, 1);
        const dir = [0, 1, 2].map((q) => -c[q] / cl + 0.15 * d[q] / dl), A = at(s, -0.05 * w, 0), tri = [];
        [[0, 0.0042, 0.0034, -0.5], [0.55, 0.0038, 0.003, 0.72], [1, 0.0012, 0.0012, 0.5]].forEach(([q, b, r, y]) => {
          const p = [0, 1, 2].map((i) => A[i] + dir[i] * q * lb + up[i] * y * hA);
          tri.push([-1, 1, 0].map((e) => m.v(...[0, 1, 2].map((i) => p[i] + d[i] / dl * e * b * f + (e ? 0 : up[i] * r)), a)));
        });
        for (let q = 0; q < 2; q++) for (let e = 0; e < 3; e++) m.quad(tri[q][e], tri[q][(e + 1) % 3], tri[q + 1][(e + 1) % 3], tri[q + 1][e]);
        m.tri(tri[2][0], tri[2][1], tri[2][2]);
      }
      // ---- its leg: a short, soft cone under the body, inside the row of flaps, trailing back a little
      const yb = by - 0.78 * bh, lf = 0.6 + 0.4 * sin(PI * (k + 1.5) / 17), ll = 0.052 * lf, lr = 0.75 + 0.25 * lf;
      m.tube([[sx * 0.42 * bw, yb + 0.012, z], [sx * 0.5 * bw, yb - 0.25 * ll, z - 0.004], [sx * 0.56 * bw, yb - 0.62 * ll, z - 0.012], [sx * 0.6 * bw, yb - ll, z - 0.022]], (j) => [0.0125, 0.0108, 0.0078, 0.004][j] * lr, 5, true, () => -0.75);
    }
    // ---- the tail: three pairs of blades on the cone, up and out, each lying over the next
    for (let k = 0; k < 3; k++) {
      const d = [sx * 0.62, 0.7, -0.36], c = [0, 0.25, 1], u = [d[1] * c[2] - d[2] * c[1], d[2] * c[0] - d[0] * c[2], d[0] * c[1] - d[1] * c[0]], ul = hypot(...u);
      slab(m, [sx * 0.01, 0.006, -0.405 - k * 0.031], d, c, u.map((v) => v / ul), 0.1 + 0.014 * k, (s) => 0.03 * (0.4 + 0.6 * sstep(0, 0.35, s)) * sqrt(max(1 - s * s * s, 0)), (s) => 0.0045 * (1 - 0.6 * s), () => -0.8);
    }
  }
  // ---- the eyes: a stalk that is thick where it grows out of the head, a ball on it, and on the ball the lens: a
  // dark dome that looks the way the eye looks. b: where the stalk leaves the head (inside it), c: the middle of the
  // ball, r: its radius, to: where it looks
  const eye = (b, c, r, to) => {
    const l = hypot(...to), n = to.map((v) => v / l), ax = c.map((v, q) => v - b[q]), al = hypot(...ax);
    m.tube([b, b.map((v, q) => v + ax[q] * 0.5), c.map((v, q) => v - ax[q] / al * r * 0.5)], (j) => [0.9, 0.52, 0.5][j] * r, 6, false, () => -0.85);
    ball(m, c, r, -0.9, 8, 5);
    ball(m, c.map((v, q) => v + n[q] * r * 0.5), r * 0.72, -1, 8, 4);
  };
  eye([0, 0.032, 0.424], [0, 0.083, 0.428], 0.012, [0, 1, 0.25]);
  for (const sx of [-1, 1]) {
    eye([sx * 0.016, 0.028, 0.456], [sx * 0.022, 0.066, 0.478], 0.0115, [sx * 0.25, 0.75, 0.6]);
    eye([sx * 0.03, 0.026, 0.405], [sx * 0.062, 0.078, 0.402], 0.0155, [sx * 0.75, 0.62, 0.1]);
  }
  // ---- the trunk, straight ahead (the shader bends it): a hose with a rib on every second ring, and at its end the
  // claw: two halves that curve towards each other, each with five spines on its inner edge that point inward and
  // forward
  // (its first ring is a thin one inside the head, so that its open end is never seen)
  const NT = 22, tp = [[0, OP_TY + 0.004, OP_TB - 0.03]], tr = [0.011], z0 = OP_TB + OP_TL;
  for (let j = 0; j <= NT; j++) { tp.push([0, OP_TY, OP_TB + OP_TL * j / NT]); tr.push((0.0205 - 0.009 * j / NT) * (j % 2 ? 1.07 : 0.95)); }
  m.tube(tp, (j) => tr[j], 8, false, () => -0.6);
  ball(m, [0, OP_TY, z0], [0.0125, 0.0125, 0.012], -0.6, 8, 4);
  for (const sy of [-1, 1]) {
    const P = curve([[0, sy * 0.003, -0.004], [0, sy * 0.02, 0.018], [0, sy * 0.029, 0.044], [0, sy * 0.022, 0.068], [0, sy * 0.009, 0.084]], 6).map(([x, y, z]) => [x, OP_TY + y, z0 + z]);
    const R = [0.0095, 0.0105, 0.0105, 0.0095, 0.008, 0.006, 0.0035], a = sy > 0 ? -0.65 : -0.7;
    m.tube(P, (j) => R[j], 5, true, () => a);
    for (let k = 0; k < 5; k++) {
      const q = 2.6 + 0.8 * k, i = min(floor(q), 5), u = q - i, p = [0, 1, 2].map((e) => mix(P[i][e], P[i + 1][e], u)), r = mix(R[i], R[i + 1], u);
      const dir = [(k - 2) * 0.18, -sy * 0.75, 0.66], dl = hypot(...dir), len = 0.014 - 0.001 * k;
      m.tube([[p[0] + (k - 2) * 0.0022, p[1] - sy * r * 0.5, p[2]], [p[0] + (k - 2) * 0.0022 + dir[0] / dl * len, p[1] - sy * r * 0.5 + dir[1] / dl * len, p[2] + dir[2] / dl * len]], (j) => [0.0032, 0.0004][j], 4, true, () => a);
    }
  }
  return m;
}

// ---------------------------------------------------------------- shaders
const S_OPABINIA = /*wgsl*/`
const OP_Z0 = ${opNum(OP_Z0)}; const OP_DZ = ${opNum(OP_DZ)}; const OP_SW = ${opNum(OP_SW)}; const OP_FW = ${opNum(OP_FW)};
const OP_TB = ${opNum(OP_TB)}; const OP_TL = ${opNum(OP_TL)}; const OP_TY = ${opNum(OP_TY)}; const OP_MY = ${opNum(OP_MY)};
const OP_UP = vec3f(${opFlapUp(1).map(opNum).join(', ')});
// Instance: a = the middle of the round it makes (x, z), how high over the mud it swims (y) and how wide the round
// is (w), b = where on the round it starts, its speed (rad/s, the sign is the direction), its length, a seed.
// It follows the mud up and down its swells. opP is repeated in opAt and zooOpabinia below: change one, change
// the others
fn opP(ta: f32, a: vec4f, ph: f32) -> vec2f { return a.xz + a.w * vec2f(cos(ta), .8 * sin(ta)) * (1. + .18 * sin(3. * ta + ph)); }
// The trunk. Which way it points at u (0 where it leaves the head, 1 at the claw): x how far down from straight
// ahead, y how far to the side, in radians. m: 0 while it feels over the mud (down in a bow, its end forward again,
// swaying and waving), 1 when it has curled back under the head and holds the claw to the mouth
fn opTrA(u: f32, m: f32, t: f32, sd: f32) -> vec2f {
  let f = .45 + .95 * sin(3.1415927 * pow(u, .75)) - .35 * u * u + .22 * u * sin(t * 1.9 + sd * 17. - 4. * u);
  let c = .7 + 3. * u + 1.25 * u * u * u * u;
  return vec2f(mix(f, c, m), u * (.5 * sin(t * .7 + sd * 5.) + .18 * sin(t * 1.9 + sd * 23.)) * (1. - m));
}
fn opTrD(a: vec2f) -> vec3f { return vec3f(sin(a.y) * cos(a.x), -sin(a.x), cos(a.y) * cos(a.x)); }
// a place of the trunk kept over the mud, which lies at the height fy + be * z here: the trunk comes down on it softly
// and lies along it
fn opFloor(p: vec3f, fy: f32, be: f32) -> vec3f { let y = fy + be * p.z; return vec3f(p.x, .5 * (p.y + y + sqrt((p.y - y) * (p.y - y) + .0009)), p.z); }
@vertex fn vsOpabinia(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let sz = i.b.z; let sd = i.b.w; let ph = sd * 6.3; let au = i.n.w; let id = -au;
  var l = i.p; var n = i.n.xyz; let sgn = select(-1., 1., l.x > 0.);
  // ---- which flap a vertex of a flap belongs to (k), and where on it the vertex is: s from its root to its tip, en
  // from its rear edge (-1) to its front edge (1), up whether on its upper side (1) or its under side (-1). The
  // fragment shader paints the flap by these
  let fa = abs(au); let isF = step(.008, fa) * step(fa, .52); let isG = step(.53, au);
  let D = 2. * fa * ${OPF} * isF + (au - .55) * 2.5 * ${OPF} * isG;
  let par = step(au, 0.); let zq = l.z + OP_SW * D;
  let k = clamp(par + 2. * round(((OP_Z0 - zq) / OP_DZ - par) * .5), 0., 14.);
  let fs = D / (${OPF} * (.62 + .38 * sin(3.1415927 * (k + 2.) / 18.)));
  let fw = OP_FW * (1. - .25 * fs) * sqrt(max(1. - pow(min(fs, 1.), 5.), 0.));
  let en = clamp((zq - OP_Z0 + k * OP_DZ) / max(fw, .004), -1.2, 1.2);
  let up = dot(n, vec3f(sgn * OP_UP.x, OP_UP.y, OP_UP.z));
  // ---- the flaps beat up and down about their roots, each a little later than the one before it: a wave that runs
  // back along the body, the tips trailing. Every place of the row moves by where it is (z, and D: how far out), not
  // by its flap: so the flaps keep lying on each other, and the gill blades stay on their flaps
  let wv = t * 4. + sd * 20.; let fl = isF + isG;
  let th = .34 * sin(wv + l.z * 9. - D * 9.) * fl;
  l.x += sgn * D * (cos(${OPD} - th) - cos(${OPD})); l.y += D * (sin(${OPD}) - sin(${OPD} - th));
  let ct = cos(th); let st = sin(th); let nx = sgn * n.x; n = vec3f(sgn * (nx * ct - n.y * st), nx * st + n.y * ct, n.z);
  // the legs trail, and swing a little with that wave; the blades of the tail spread and close
  let dl = max(-.03 - l.y, 0.) * step(.725, id) * step(id, .775);
  l.z += dl * (.3 * sin(wv + l.z * 9. - 1.3) - .2);
  let isT = step(.775, id) * step(id, .825); let ta2 = -sgn * (.06 + .1 * sin(t * .9 + sd * 12.)) * isT;
  let c2 = cos(ta2); let s2 = sin(ta2); let q2 = l.xy - vec2f(0., .006) * isT;
  l = vec3f(q2.x * c2 - q2.y * s2, q2.x * s2 + q2.y * c2 + .006 * isT, l.z); n = vec3f(n.x * c2 - n.y * s2, n.x * s2 + n.y * c2, n.z);
  // ---- onto its round, level with the mud under it. (The round is worked out about its own middle: the small
  // differences that give the heading and the bend would be lost in the large numbers of the world)
  let ta = t * i.b.y + i.b.x; let az = vec4f(0., 0., 0., i.a.w); let dt = sign(i.b.y) * .3 * TSC / i.a.w;
  let r0 = opP(ta, az, ph); let r1 = opP(ta + dt, az, ph); let rm = opP(ta - dt, az, ph);
  let p0 = i.a.xz + r0; let g0 = ground(p0);
  let T = normalize(vec3f(r1.x - r0.x, ground(i.a.xz + r1) - g0, r1.y - r0.y));
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  // how high its middle is over the mud, in lengths of the body, and how much its round bends there (to its right)
  let hs = i.a.y + .1 * TSC * sin(t * .43 + sd * 11.); let hu = hs / sz;
  let kap = clamp(.6 * dot(r1 + rm - 2. * r0, S.xz) / dot(r1 - r0, r1 - r0) * sz, -.35, .35);
  // ---- the trunk (in the mesh it points straight ahead from OP_TB). Most of the time it feels over the mud; now
  // and then it curls back and brings the claw to the mouth (m). be: the head is held a little down while it feels
  let cyc = fract(t / (11. + 6. * fract(sd * 7.7)) + sd * 3.3); let m = ss(.7, .8, cyc) * (1. - ss(.9, .99, cyc));
  let be = (.07 + .05 * sin(t * .31 + sd * 8.)) * (1. - m);
  let isR = step(.575, id) * step(id, .725);
  if (isR > .5) {
    let dq = l.z - OP_TB; let dc = clamp(dq, 0., OP_TL); let ez = dq - dc; let oy = l.y - OP_TY;
    // the two halves of the claw open and close about its root: wide while it feels, shut at the mouth
    let og = select(-1., 1., id < .675) * step(.625, id) * mix(.12 + .2 * sin(t * 2.3 + sd * 9.), -.1 + .08 * sin(t * 6.), m);
    let co = cos(og); let so = sin(og);
    let o2 = vec2f(oy * co + ez * so, ez * co - oy * so); let n2 = vec2f(n.y * co + n.z * so, n.z * co - n.y * so);
    // its middle line up to this vertex, in eight steps, and a little further on, for the way it points here
    var c = vec3f(0., OP_TY, OP_TB); let h = dc / 8.;
    for (var j = 0; j < 8; j++) { c += opTrD(opTrA((f32(j) + .5) * h / OP_TL, m, t, sd)) * h; }
    let a = opTrA(dc / OP_TL, m, t, sd); let fy = .05 - hu;
    let ca = opFloor(c, fy, be); let cb = opFloor(c + opTrD(a) * .012, fy, be);
    let Tt = normalize(cb - ca); let Nt = normalize(cross(Tt, vec3f(cos(a.y), 0., -sin(a.y)))); let Xt = cross(Nt, Tt);
    l = ca + Xt * l.x + Nt * o2.x + Tt * o2.y;
    n = Xt * n.x + Nt * n2.x + Tt * n2.y;
  }
  // ---- the body bends, each place along it (zc; the trunk goes with the head) about its own middle: sideways into
  // the turn of its round, the head a little after the trunk as that sways, and up and down a little with the wave
  // of the flaps
  let zc = mix(clamp(l.z, -.5, .5), .5, isR); let ze = l.z - zc; let zh = max(zc - .15, 0.);
  let hd = .22 * sin(t * .7 + sd * 5.) * (1. - m);
  let ya = kap * zc + 2. * hd * zh; let pa = .063 * cos(wv + zc * 9. - .9) - be;
  let cy = cos(ya); let sy = sin(ya); let cp = cos(pa); let sp = sin(pa);
  let Rb = vec3f(cy, 0., -sy); let Ub = vec3f(-sy * sp, cp, -cy * sp); let Tb = vec3f(sy * cp, sp, cy * cp);
  let q = vec3f(.5 * kap * zc * zc + hd * zh * zh, .007 * sin(wv + zc * 9. - .9) - be * zc, zc) + Rb * l.x + Ub * l.y + Tb * ze;
  n = Rb * n.x + Ub * n.y + Tb * n.z;
  let w = dodge(vec3f(p0.x, g0 + hs, p0.y), .9 * sz + 2. * g.fwd.w, 1., 0.) + (S * q.x + Up * q.y + T * q.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z;
  // (the fragment shader gets the place on the flap in the place of the place in the mesh, and the number of the
  // flap with the seed: twice the number, so the seed is what comes after the point)
  o.op = mix(i.p, vec3f(en, fs, up), isF); o.sd = sd + 2. * k * isF; o.lt = au;
  return o;
}
// The skin. Colours are free: no fossil shows them. Moss green with yellow: a dark green back with a yellow rim at
// the rear of each segment and yellow spots, a pale belly; the flaps green with two yellow bands, a dark, firm front
// edge and pale rims at the tip and along the thin rear edge, their under sides pale; the gill blades golden; the
// trunk pale and ringed, its claw rose; the eyes yellow balls with a black lens. Each animal in its own tone. The
// relief: the furrows between the segments and fine wrinkles on them, grains, the rays of the flaps, the rings of the
// trunk. It is dark in its furrows, where a flap lies under the one ahead and under the body, and it shines like
// something wet
@fragment fn fsOpabinia(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let lt = i.lt; let id = -lt; let sd = fract(i.sd); let kq = floor(i.sd * .5);
  let flap = step(.008, abs(lt)) * step(abs(lt), .52); let gill = step(.53, lt); let body = step(abs(lt), .008);
  let trunk = step(.575, id) * step(id, .625); let claw = step(.625, id) * step(id, .725); let leg = step(.725, id) * step(id, .775);
  let tail = step(.775, id) * step(id, .825); let stalk = step(.825, id) * step(id, .875); let ball = step(.875, id) * step(id, .95); let lens = step(.95, id);
  // a place for the mottling: in the mesh, or on the flap
  let q = mix(i.op, vec3f(i.op.x * .045, kq * .07, i.op.y * .11), flap);
  let tx = textureSample(tD, sR, q.zx * vec2f(6., 8.) + q.y * vec2f(5., 7.) + sd * 3.);
  // (two looks at the mottling, each turned its own way: one alone shows the grid of the texture)
  let tg = textureSample(tD, sR, vec2f(q.x * 41. + q.z * 23., q.z * 37. - q.x * 19.) + q.y * vec2f(29., 43.) + sd) * .5
    + textureSample(tD, sR, vec2f(q.x * 67. - q.z * 31., q.z * 71. + q.x * 43.) + q.y * vec2f(53., 31.) + .37) * .5;
  // (the relief fades where it would be finer than the pixels: how much of the body's length a pixel spans)
  let fine = ss(.02, .005, length(fwidth(i.wp)) / .067);
  let x = abs(i.op.x); let y = i.op.y; let z = i.op.z;
  let tone = fract(sd * 13.7); let hue = fract(sd * 5.3);
  let dk = mix(vec3f(.045, .1, .03), vec3f(.075, .105, .02), hue);
  let md = mix(vec3f(.17, .3, .06), vec3f(.26, .31, .05), hue);
  let ye = vec3f(.62, .58, .1); let pl = vec3f(.8, .8, .42); let bl = vec3f(.66, .68, .44);
  // ---- the body: where in its segment a place is (v, 0 at its front), the furrow between two segments, the back
  let onS = step(-.395, z) * step(z, .355); let v = fract((OP_Z0 + .5 * OP_DZ - z) / OP_DZ);
  let fur = onS * max(ss(.16, .03, v), ss(.9, .98, v));
  let bk = ss(-.004, .028, y + (tx.a - .5) * .016);
  var alb = mix(md, dk, bk);
  alb = mix(alb, ye, onS * ss(.6, .86, v) * ss(.98, .9, v) * .55 * ss(-.03, 0., y));
  alb = mix(alb, ye, ss(.62, .8, tg.b) * bk * .35);
  alb = mix(alb, bl, ss(-.012, -.03, y));
  alb = mix(alb, ye, ss(-.4, -.47, z) * .6) * (1. - .5 * fur);
  // the mouth: a pale lip round a dark opening that faces backward and down
  let mo = (i.op - vec3f(0., OP_MY, .41)) / vec3f(.014, .009, .013); let mn = ss(1.5, 1.1, length(mo));
  let md2 = dot(normalize(mo + vec3f(0., 0., 1e-4)), vec3f(0., -.55, -.83));
  alb = mix(alb, vec3f(.62, .47, .36), mn * ss(.3, .55, md2)); alb = mix(alb, vec3f(.05, .02, .02), mn * ss(.62, .8, md2));
  // ---- a flap: en from its rear edge to its front edge, s from root to tip, top: its upper side
  let en = i.op.x; let top = ss(-.25, .35, i.op.z); let s = i.op.y + .03 * en + (tx.a - .5) * .04;
  let band = ss(.27, .33, s) * ss(.5, .44, s) + ss(.62, .68, s) * ss(.84, .78, s);
  var fc = mix(md * 1.15, ye, band * .85);
  fc = mix(fc, pl, max(ss(.86, .97, s), ss(-.7, -.95, en)) * .8);
  fc = mix(fc, dk * 1.3, ss(.72, .95, en) * .7);
  fc = mix(mix(bl, ye, .25 + .2 * band) * .85, fc, top);
  // (in shade where the flap ahead lies over it, and at its root under the body)
  fc *= (1. - .45 * ss(.15, .75, en) * top * step(.5, kq)) * mix(.7, 1., ss(0., .2, i.op.y));
  alb = mix(alb, fc, flap);
  alb = mix(alb, vec3f(.74, .6, .15) * (.7 + .6 * tx.g), gill);
  // ---- the tail blades: banded like the flaps, from the body out
  let ts = length(vec2f(x, y - .006)) / .11;
  alb = mix(alb, mix(mix(md, ye, ss(.3, .4, ts) * ss(.62, .52, ts) * .85), pl, ss(.78, .95, ts) * .8), tail);
  // ---- the trunk: paler towards the claw, dark between its ribs; the claw rose
  let d = (z - OP_TB) / OP_TL; let rib = .5 - .5 * cos(3.1415927 * d * 22.);
  alb = mix(alb, mix(vec3f(.4, .48, .19), vec3f(.68, .66, .36), sat(d)) * mix(.6, 1., rib), trunk);
  alb = mix(alb, mix(vec3f(.6, .2, .25), vec3f(.88, .44, .45), tx.g), claw);
  // the legs: pale, in shade where they leave the body
  alb = mix(alb, mix(bl, vec3f(.5, .56, .28), .35) * mix(.55, 1., ss(-.03, -.06, y)), leg);
  // the eyes: stalks of the colour of the back, paler upwards; a yellow ball; a black lens
  alb = mix(alb, mix(dk * 1.5, md, ss(.035, .07, y)), stalk);
  alb = mix(alb * mix(.8, 1.25, tone) * (.8 + .4 * tx.g), vec3f(.62, .62, .14) * (.85 + .3 * tx.g), ball);
  alb = mix(alb, vec3f(.012, .02, .015), lens);
  // ---- the relief, as a height (in lengths of the body)
  let hB = (.003 * (tg.a - .5) * (1. - fur) - .0035 * fur + .001 * sin(z * 880.) * onS * bk) * body;
  let hF = (.0016 * sin(en * 19.) * ss(.95, .6, abs(en)) + .0012 * (tg.a - .5)) * flap * top;
  let hT = (.002 * cos(TAU * d * 22.) + .001 * (tg.a - .5)) * trunk + .002 * cos(y * 800.) * leg;
  let ns = normalize(i.n) * select(-1., 1., ff);
  let n = skinRelief(ns, i.wp, (hB + hF + hT + .0015 * (tg.a - .5) * (tail + claw + stalk + gill)) * fine * .067);
  // its light: that of a wet skin (skinWet of S_SEA), strongest on the back and on the lenses of the eyes
  let gl = .22 * (body + flap + tail + trunk + stalk) + .12 * (leg + gill) + .35 * claw + .5 * ball + 1.8 * lens;
  let wt = .55 * body * bk + .45 * flap * top + .4 * (tail + trunk + claw + stalk) + .15 * (leg + gill) + .8 * ball + 3. * lens;
  var c = skinWet(alb, n, ns, i.wp, gl, wt);
  // (flaps, gills and tail blades are thin: a little of the sun comes through them from behind)
  let zn = zone(i.wp);
  c += alb * sunE(i.wp.y, zn) * shadow4(i.wp) * sat(dot(-ns, g.sun.xyz)) * (.3 * (flap + tail) + .4 * gill);
  return fin(fog(c, i.wp, zn));
}
`;
// Opabinia: opP of vsOpabinia. A point, as thick as the animal is wide with its flaps
const zooOpabinia = (a, i) => {
  const ta = F[TIME] * a[i + 5] + a[i + 4], k = a[i + 3] * (1 + 0.18 * sin(3 * ta + a[i + 7] * 6.3));
  ZP[0] = a[i] + k * cos(ta); ZP[1] = a[i + 1]; ZP[2] = a[i + 2] + 0.8 * k * sin(ta); zooGround(); ZH[0] = 0; ZH[1] = 0.9 * a[i + 6]; zooDodge(1);
  ZP[3] = ZP[4] = ZP[5] = 0; ZP[7] = a[i + 6] * 0.4;
};
// the same round at load time (see makeWorld, which keeps it clear): where on it an animal is at the angle ta
const opAt = (x, z, R, sd, ta) => { const k = R * (1 + 0.18 * sin(3 * ta + sd * 6.3)); return [x + k * cos(ta), z + 0.8 * k * sin(ta)]; };
