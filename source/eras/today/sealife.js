// ============================================================================
// today: mantas, the plesiosaur and the fish
// ============================================================================
// For each animal: its mesh, its shaders (S_...) and, for the zoo, where it is at a time (zoo...). world.js lists
// them as kinds and gives them their instances.

// ---------------------------------------------------------------- meshes
// manta ray: span along x (half span = 1), nose +z; aux = span coordinate for the flap animation
function meshManta() {
  const m = new Mesh(), NU = 72, M = 22, rings = [];
  for (let j = 0; j <= NU; j++) {
    const u = j / NU * 2 - 1, au = abs(u);
    let zl = 0.52 - 0.74 * pow(au, 1.35) + 0.07 * exp(-pow((au - 0.13) / 0.05, 2)) - 0.05 * exp(-pow(au / 0.05, 2)) - 0.08 * pow(au, 5);
    const zt = -0.5 + 0.3 * pow(au, 0.8) + 0.02 - 0.08 * pow(au, 5);
    if (zl < zt + 0.004) zl = zt + 0.004;
    const th = 0.08 * pow(1 - au, 1.15) + 0.004 + 0.12 * exp(-pow(u / 0.2, 2)), ring = [];
    for (let k = 0; k < M; k++) { const a = k / M * TAU; ring.push(m.v(u, th * sin(a) * (0.62 + 0.38 * cos(a)), mix(zt, zl, 0.5 + 0.5 * cos(a)), u)); }
    rings.push(ring);
  }
  for (let j = 0; j < NU; j++) for (let k = 0; k < M; k++) { const k2 = (k + 1) % M; m.quad(rings[j][k], rings[j + 1][k], rings[j + 1][k2], rings[j][k2]); }
  const tail = []; for (let i = 0; i <= 8; i++) tail.push([0, 0, -0.42 - i * 0.19]);
  const n0 = m.p.length / 3;
  m.tube(tail, (k) => 0.016 * (1 - k / 9), 4, true);
  for (let k = n0; k < m.aux.length; k++) m.aux[k] = 0;
  for (const sx of [-1, 1]) { // cephalic fins
    const n1 = m.p.length / 3;
    m.tube([[sx * 0.12, -0.02, 0.48], [sx * 0.135, -0.05, 0.6], [sx * 0.115, -0.09, 0.69], [sx * 0.085, -0.125, 0.74]], (k) => 0.045 * (1 - k / 4.4), 6, true);
    for (let k = n1; k < m.aux.length; k++) m.aux[k] = sx * 0.1;
  }
  return m;
}
// plesiosaur: a small head on a long neck, a barrel of a body, a short tail and four flippers. The snout is at z = 1,
// the tail tip at z = -1, y is up. aux: 0 on the body, 0.1 to 0.5 along a front flipper, 0.55 to 0.95 along a hind
// one, with the side as its sign; vsPlesio flaps the flippers with it
function meshPlesio() {
  const m = new Mesh(), M = 16, NS = 4, rings = [];
  // body sections from the tail tip to the snout: z, half width, half height, height of the centre
  const K = [[-1, 0.003, 0.006, 0.02], [-0.95, 0.008, 0.03, 0.02], [-0.89, 0.014, 0.032, 0.016], [-0.8, 0.036, 0.036, 0.01], [-0.68, 0.078, 0.064, 0.002],
    [-0.55, 0.128, 0.1, -0.005], [-0.4, 0.165, 0.125, -0.01], [-0.25, 0.18, 0.135, -0.012], [-0.1, 0.172, 0.13, -0.01], [0.03, 0.145, 0.112, -0.004],
    [0.13, 0.105, 0.088, 0.004], [0.22, 0.074, 0.068, 0.012], [0.36, 0.055, 0.052, 0.02], [0.52, 0.045, 0.043, 0.026], [0.68, 0.038, 0.037, 0.03],
    [0.8, 0.034, 0.033, 0.032], [0.86, 0.04, 0.034, 0.034], [0.9, 0.044, 0.033, 0.034], [0.94, 0.038, 0.027, 0.031], [0.975, 0.026, 0.018, 0.027],
    [0.995, 0.012, 0.009, 0.025], [1, 0.003, 0.003, 0.025]];
  // smooth curve through four neighbouring sections (Catmull-Rom)
  const cr = (a, b, c, d, u) => 0.5 * (2 * b + (c - a) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (3 * b - a - 3 * c + d) * u * u * u);
  for (let j = 0; j <= (K.length - 1) * NS; j++) {
    const i = min(floor(j / NS), K.length - 2), u = j / NS - i, k = (o) => K[clamp(i + o, 0, K.length - 1)];
    const [z, w, h, yc] = [0, 1, 2, 3].map((q) => cr(k(-1)[q], k(0)[q], k(1)[q], k(2)[q], u)), ring = [];
    // an oval with a flatter belly
    for (let s = 0; s < M; s++) { const a = s / M * TAU, sn = sin(a); ring.push(m.v(max(w, 0.002) * cos(a), yc + max(h, 0.002) * sn * (sn < 0 ? 0.8 : 1), z, 0)); }
    rings.push(ring);
  }
  for (let j = 0; j < rings.length - 1; j++) for (let s = 0; s < M; s++) { const s2 = (s + 1) % M; m.quad(rings[j][s], rings[j][s2], rings[j + 1][s2], rings[j + 1][s]); }
  const e0 = m.v(0, K[0][3], -1.002, 0), e1 = m.v(0, K[K.length - 1][3], 1.002, 0), last = rings[rings.length - 1];
  for (let s = 0; s < M; s++) { const s2 = (s + 1) % M; m.tri(rings[0][s2], rings[0][s], e0); m.tri(last[s], last[s2], e1); }
  // flippers: a flat blade along a line that runs out, back and a little down from its root
  [[0.125, -0.04, 0.04], [0.115, -0.035, -0.5]].forEach((root, f) => {
    const [len, sw] = PLF[f], d = [cos(sw) * cos(PLDROOP), -sin(PLDROOP), -sin(sw) * cos(PLDROOP)];
    // c: across the blade (the z axis made square to d), nr: through the blade
    let c = [-d[0] * d[2], -d[1] * d[2], 1 - d[2] * d[2]]; const cl = hypot(...c); c = c.map((v) => v / cl);
    const nr = [d[1] * c[2] - d[2] * c[1], d[2] * c[0] - d[0] * c[2], d[0] * c[1] - d[1] * c[0]], NF = 12, MF = 10;
    for (const sx of [-1, 1]) {
      const at = (s, pc, pt, q) => m.v(sx * (root[0] + d[0] * s * len + c[0] * pc + nr[0] * pt), root[1] + d[1] * s * len + c[1] * pc + nr[1] * pt, root[2] + d[2] * s * len + c[2] * pc + nr[2] * pt, sx * (0.1 + 0.45 * f + 0.4 * s)), fr = [];
      for (let k = 0; k <= NF; k++) {
        // narrow at the root, widest a third of the way out, then tapering to a point that curves back; thick only at the root
        const s = k / NF, ch = 0.07 * pow(sin(0.4 + (PI - 0.43) * pow(s, 0.7)), 0.8), th = ch * mix(0.42, 0.16, sstep(0, 0.35, s)), bk = -0.1 * s * s * len, ring = [];
        for (let q = 0; q < MF; q++) { const a = q / MF * TAU; ring.push(at(s, ch * cos(a) + bk, th * sin(a) * (0.55 + 0.225 * (1 + cos(a))))); }
        fr.push(ring);
      }
      const tip = at(1.01, -0.1 * len, 0);
      for (let q = 0; q < MF; q++) {
        const q2 = (q + 1) % MF;
        for (let k = 0; k < NF; k++) { if (sx > 0) m.quad(fr[k][q], fr[k][q2], fr[k + 1][q2], fr[k + 1][q]); else m.quad(fr[k][q], fr[k + 1][q], fr[k + 1][q2], fr[k][q2]); }
        if (sx > 0) m.tri(fr[NF][q], fr[NF][q2], tip); else m.tri(fr[NF][q2], fr[NF][q], tip);
      }
    }
  });
  return m;
}
function meshFish() {
  const m = new Mesh();
  const X = [0.5, 0.3, 0.05, -0.22, -0.34], H = [0.01, 0.13, 0.17, 0.09, 0.035], Wd = [0.01, 0.05, 0.065, 0.03, 0.012], rings = [];
  for (let i = 0; i < 5; i++) { const r = []; for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; r.push(m.v(X[i], sin(a) * H[i], cos(a) * Wd[i])); } rings.push(r); }
  for (let i = 0; i < 4; i++) for (let k = 0; k < 6; k++) { const k2 = (k + 1) % 6; m.quad(rings[i][k], rings[i + 1][k], rings[i + 1][k2], rings[i][k2]); }
  const a = m.v(-0.33, 0, 0), b = m.v(-0.56, 0.2, 0), c = m.v(-0.47, 0, 0), d = m.v(-0.56, -0.2, 0);
  m.tri(a, b, c); m.tri(a, c, d);
  return m;
}

// ---------------------------------------------------------------- shaders
// plesiosaur flippers (front pair, hind pair): length (the body is 2 long) and sweep back in radians, and how far all
// four droop. meshPlesio in world.js builds them from this; vsPlesio needs their sideways reach to flap them
const PLF = [[0.43, 0.52], [0.4, 0.7]], PLDROOP = 0.21;
const plReach = (k) => (PLF[k][0] * cos(PLF[k][1]) * cos(PLDROOP)).toFixed(4);
const S_FISH = /*wgsl*/`
// The path P of a school (ta without the last term, which is the offset of the single fish) is repeated in zooFish
// below, which has to know where a school is: change one, change the other
@vertex fn vsFish(i: VI) -> VO {
  var o: VO;
  let s = i.b.x; let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w; let t = g.cam.w;
  let ta = t * i.b.y + i.b.w * 6.3 + (h.x - .5) * (26. / R);
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), 2.2 * sin(3. * ta + ph), R * .6 * sin(ta));
  let T = normalize(vec3f(-R * sin(ta), 6.6 * cos(3. * ta + ph), R * .6 * cos(ta))) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let off = S * ((h.y - .5) * 5. + sin(t * .6 + s * 40.) * .5) + Up * ((h.z - .5) * 3.2 + cos(t * .5 + s * 31.) * .4);
  var l = i.p * i.b.z * (.75 + .5 * h.z);
  l.z += sin(t * 9. + s * 50. + l.x * 5.) * .22 * (.25 * i.b.z - l.x);
  let w = P + off + T * l.x + Up * l.y + S * l.z;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = T * i.n.x + Up * i.n.y + S * i.n.z; o.op = i.p; o.sd = s;
  o.lt = shadow1(w);
  return o;
}
@fragment fn fsFish(i: VO) -> @location(0) vec4f {
  let n = normalize(i.n); let L = g.sun.xyz; let V = normalize(g.cam.xyz - i.wp);
  let z = zone(i.wp); let vv = vol(i.wp);
  var alb = mix(vec3f(.50, .68, .80), vec3f(.10, .22, .40), ss(-.05, .2, i.op.y));
  alb = mix(alb, vec3f(.95, .8, .3), step(.86, fract(i.sd * 7.7)) * .6);
  let E = sunE(i.wp.y, z) * i.lt;
  var c = alb * (E * (.25 + .75 * sat(dot(n, L))) + amb(i.wp, n, vv.g, z) * 1.3);
  c += E * pow(sat(dot(n, normalize(V + L))), 24.) * 1.6 + vec3f(.3, .6, .7) * pow(1. - sat(dot(n, V)), 3.) * .25 * vv.g;
  return fin(fog(c, i.wp, z));
}
`;
const S_MANTA = /*wgsl*/`
// The path P is repeated in zooManta below: change one, change the other
@vertex fn vsManta(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let R = i.a.w; let sz = i.b.z;
  let ta = t * i.b.y + i.b.x;
  let P = i.a.xyz + vec3f(R * cos(ta), 2.5 * sin(2. * ta + i.b.w), R * .75 * sin(ta));
  let T = normalize(vec3f(-R * sin(ta), 5. * cos(2. * ta + i.b.w) * 1., R * .75 * cos(ta))) * sign(i.b.y);
  var S = normalize(cross(vec3f(0., 1., 0.), T)); var Up = cross(T, S);
  let bank = -.28 * sign(i.b.y);
  let S2 = S * cos(bank) + Up * sin(bank); Up = Up * cos(bank) - S * sin(bank); S = S2;
  let u = i.n.w; let au = abs(u);
  let fp = t * 1.25 + i.b.w * 5. - au * 1.2;
  let amp = .36 * pow(au, 1.6);
  var l = i.p;
  l.y += amp * sin(fp) - .1 * sin(t * 1.25 + i.b.w * 5.);
  let tail = ss(-.5, -1.9, l.z) * step(au, .001);
  l.x += tail * sin(t * .8 + l.z * 2.) * .12;
  let sl = (.576 * pow(au, .6) * sin(fp) - .43 * pow(au, 1.6) * cos(fp)) * sign(u);
  let ln = normalize(vec3f(i.n.x - sl * i.n.y, i.n.y + sl * i.n.x, i.n.z));
  let w = P + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * ln.x + Up * ln.y + T * ln.z; o.op = i.p; o.sd = i.b.w;
  o.lt = 1.;
  return o;
}
@fragment fn fsManta(i: VO) -> @location(0) vec4f {
  let dist = length(i.wp - g.cam.xyz);
  let ca = caus(i.wp, dist);
  let tx = textureSample(tD, sR, i.op.xz * .9 + i.sd);
  let n = normalize(i.n + (vec3f(tx.r, 0., tx.g) - vec3f(.5, 0., .5)) * .5); let L = g.sun.xyz; let V = normalize(g.cam.xyz - i.wp);
  let z = zone(i.wp); let vv = vol(i.wp);
  let top = ss(-.2, .25, normalize(i.n).y);
  let au = abs(i.op.x);
  let gill = ss(.25, .0, abs(au - .13) * 8.) * ss(.04, .12, i.op.z) * ss(.34, .26, i.op.z) * ss(.2, .8, sin(i.op.z * 110.));
  var belly = vec3f(.13, .17, .21) * (.6 + .6 * tx.b) * (1. - .7 * gill);
  belly = mix(belly, vec3f(.05, .08, .11), sat(ss(.45, .9, au + tx.a * .35) + ss(-.1, -.4, i.op.z + tx.b * .2) * .7));
  var back = vec3f(.04, .065, .10) + vec3f(.10, .16, .2) * ss(.5, .75, tx.a);
  back = mix(back, vec3f(.36, .46, .52), ss(.25, .0, abs(au - .26) * 3.5 + abs(i.op.z - .12) * 5.) * .8);
  var alb = mix(belly, back, top);
  let E = sunE(i.wp.y, z) * shadow4(i.wp + n * .3);
  let ndv = sat(dot(n, V));
  let ir = .5 + .5 * cos(TAU * (vec3f(0., .33, .67) + ndv * 1.1 + tx.a * 1.5 + .55));
  let fillN = vec3f(n.x, abs(n.y) * .55 + .25, n.z);
  var c = alb * (E * sat(dot(n, L)) * (.3 + ca) + amb(i.wp, fillN, vv.g, z) * 1.1 + side(i.wp, n, 1., z) * .8);
  c += ir * vec3f(.35, .16, .6) * (.07 + .22 * tx.b) * (.4 + E.g * .2 * ca.g) * (1. - top * .3);
  c += E * pow(sat(dot(n, normalize(V + L))), 30.) * .5 * (.3 + ca);
  let sky = amb(i.wp, vec3f(0., 1., 0.), vv.g, z);
  c += alb * sky * ca * .45 * (1. - top) + sky * pow(1. - ndv, 3.) * .35;
  return fin(fog(c, i.wp, z));
}
`;
const S_PLESIO = /*wgsl*/`
// Instance: a = centre of its path + radius, b = phase, speed (rad/s, sign = direction), size, seed.
// The path is an oval lying along z. Every vertex sits its own z further along that path, so the body follows it like
// a train on rails and bends through the turns. plP and plT are repeated in zooPlesio below: change one, change
// the other
fn plP(ta: f32, a: vec4f, ph: f32) -> vec3f { return a.xyz + vec3f(a.w * .72 * sin(ta), 2. * sin(2. * ta + ph), a.w * cos(ta)); }
fn plT(ta: f32, a: vec4f, ph: f32) -> vec3f { return vec3f(a.w * .72 * cos(ta), 4. * cos(2. * ta + ph), -a.w * sin(ta)); }
@vertex fn vsPlesio(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let sz = i.b.z; let sd = i.b.w; let dir = sign(i.b.y); let ph = sd * 6.3;
  // aux (n.w): 0 on the body, .1 to .5 along a front flipper, .55 to .95 along a hind one, its sign is the side
  let au = abs(i.n.w); let fl = step(.05, au); let hind = step(.525, au);
  let sgn = select(1., sign(i.n.w), au > .05);
  let s = sat((au - mix(.1, .55, hind)) * 2.5) * fl;
  var l = i.p; var n = i.n.xyz;
  // the flippers beat up and down about their roots: the hind pair follows the front pair, the tips trail behind
  let fp = t * 1.9 + sd * 20. - hind * 1.9;
  let th = (.5 * sin(fp - s * 1.1) - .05) * fl;
  let D = mix(${plReach(0)}, ${plReach(1)}, hind) * s; let dy = -.26 * D;
  let ct = cos(th); let st = sin(th);
  l.x += sgn * (D * ct - dy * st - D); l.y += D * st + dy * ct - dy;
  let nx = sgn * n.x; n = vec3f(sgn * (nx * ct - n.y * st), nx * st + n.y * ct, n.z);
  // the neck and the tail sway, the body rises and sinks with the strokes
  let nk = sat((l.z - .15) / .85); let tl = sat((-.5 - l.z) * 2.);
  let s1 = sin(t * .5 + sd * 9.); let s2 = sin(t * 1.1 + sd * 5.); let s3 = sin(t * .37 + sd * 13.);
  l.x += .09 * nk * nk * s1 + .05 * tl * tl * s2;
  l.y += (.03 + .035 * s3) * nk * nk + .012 * sin(fp + 1.3);
  n.z -= (.212 * nk * s1 - .2 * tl * s2) * n.x + (.0706 + .0824 * s3) * nk * n.y;
  // onto the path, banked into the turn
  let ta0 = t * i.b.y + i.b.x;
  let ta = ta0 + dir * l.z * sz / length(plT(ta0, i.a, ph));
  let T = normalize(plT(ta, i.a, ph)) * dir;
  var S = normalize(cross(vec3f(0., 1., 0.), T)); var Up = cross(T, S);
  let bank = .2 * dir;
  let S2 = S * cos(bank) - Up * sin(bank); Up = Up * cos(bank) + S * sin(bank); S = S2;
  let w = plP(ta, i.a, ph) + (S * l.x + Up * l.y) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = sd;
  o.lt = i.n.y;
  return o;
}
@fragment fn fsPlesio(i: VO) -> @location(0) vec4f {
  let dist = length(i.wp - g.cam.xyz);
  let ca = caus(i.wp, dist);
  let fine = textureSample(tD, sR, i.op.zy * vec2f(7., 11.) + i.op.x * 4. + i.sd);
  let blot = textureSample(tD, sR, i.op.zx * vec2f(1.3, 2.) + i.op.y * .9 + i.sd * 3.);
  let n = normalize(i.n + (vec3f(fine.r, 0., fine.g) - vec3f(.5, 0., .5)) * .4); let L = g.sun.xyz; let V = normalize(g.cam.xyz - i.wp);
  let z = zone(i.wp); let vv = vol(i.wp);
  // dark mottled back, pale belly, a ragged line between the two (lt: which way the skin faced before any animation)
  let top = ss(-.45, .25, i.lt + (blot.a - .5) * .9);
  var back = mix(vec3f(.030, .055, .065), vec3f(.11, .16, .14), ss(.42, .68, blot.a));
  back = mix(back, vec3f(.015, .025, .03), ss(.5, .72, blot.b) * .45);
  var alb = mix(vec3f(.27, .29, .25), back, top) * (.75 + .5 * fine.b);
  let eye = ss(.013, .008, length(vec3f(abs(i.op.x), i.op.y, i.op.z) - vec3f(.036, .05, .915)));
  alb = mix(alb, vec3f(.003), eye);
  let E = sunE(i.wp.y, z) * shadow4(i.wp + n * .3);
  let ndv = sat(dot(n, V));
  let fillN = vec3f(n.x, abs(n.y) * .55 + .25, n.z);
  var c = alb * (E * sat(dot(n, L)) * (.3 + ca) + amb(i.wp, fillN, vv.g, z) * 1.1 + side(i.wp, n, 1., z) * .8);
  c += E * pow(sat(dot(n, normalize(V + L))), mix(40., 90., eye)) * (.12 + 2. * eye) * (.3 + ca);
  let sky = amb(i.wp, vec3f(0., 1., 0.), vv.g, z);
  c += alb * sky * ca * .4 * (1. - top) + sky * pow(1. - ndv, 3.) * .3;
  return fin(fog(c, i.wp, z));
}
`;

// ---------------------------------------------------------------- where they are, for the zoo
// These repeat the paths of the vertex shaders above: change one, change the other. Each writes the place of the
// animal at i in its list into ZP (see zooMove in engine/zoo.js), for the scene time F[TIME].
// Manta: the path of vsManta. A point, as thick as half the animal's span
const zooManta = (a, i) => {
  const R = a[i + 3], ta = F[TIME] * a[i + 5] + a[i + 4];
  ZP[0] = a[i] + R * cos(ta); ZP[1] = a[i + 1] + 2.5 * sin(2 * ta + a[i + 7]); ZP[2] = a[i + 2] + R * 0.75 * sin(ta);
  ZP[3] = ZP[4] = ZP[5] = 0; ZP[7] = a[i + 6] * 0.5;
};
// Plesiosaur: plP and plT of vsPlesio. A line from the tip of the tail to the snout, which are `size` along the path
// to either side of the animal's middle
const zooPlesio = (a, i) => {
  const R = a[i + 3], sz = a[i + 6], ph = a[i + 7] * 6.3, ta = F[TIME] * a[i + 5] + a[i + 4];
  const tx = R * 0.72 * cos(ta), ty = 4 * cos(2 * ta + ph), tz = R * sin(ta), d = sz / sqrt(tx * tx + ty * ty + tz * tz), t0 = ta - d, t1 = ta + d;
  const x = R * 0.72 * sin(t0), y = 2 * sin(2 * t0 + ph), z = R * cos(t0);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = R * 0.72 * sin(t1) - x; ZP[4] = 2 * sin(2 * t1 + ph) - y; ZP[5] = R * cos(t1) - z; ZP[7] = sz * 0.3;
};
// School of fish: the path of vsFish without the offset of the single fish, which spreads the school 13 m along the
// path to both sides of its middle. Two lines from the middle, each 10 m along the path: one back, one ahead
const zooFish = (a, i, part) => {
  const R = a[i + 3], ph = a[i + 7] * 17, ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3, tb = ta + (part * 2 - 1) * 10 / R;
  const x = R * cos(ta), y = 2.2 * sin(3 * ta + ph), z = R * 0.6 * sin(ta);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = R * cos(tb) - x; ZP[4] = 2.2 * sin(3 * tb + ph) - y; ZP[5] = R * 0.6 * sin(tb) - z; ZP[7] = 2.5;
};
