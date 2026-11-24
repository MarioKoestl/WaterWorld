// ============================================================================
// ordovician: Astraspis (the early armoured fish)
// ============================================================================
// Its mesh, its shaders and, for the zoo, where it is at a time. world.js lists it as a kind and gives it its
// instances. The mesh is modelled around the origin, nose at +z, y up: the instance says how large the animal is in
// the world. What it shares with the other animals of this era is in swimmers.js.

// Astraspis desiderata, an early jawless fish in armour of bone. One unit from snout to tail tip.
// Sources: Wikipedia "Astraspis": about 200 mm, 8 gill openings each side, large eyes, oval cross-section.
// Sansom and others 1997 (abstract): dorsal headshield of polygonal tesserae with star-shaped or smooth tubercles;
// ventral shield of more irregular tesserae; tail of large rhomboid scales; tail termination unknown.
// Estimates: every width and cross-section (no source for a cross-section); caudal fin shape; gill and eye sizes;
// all colours.
// aux: 0 on body, -0.5 on gills, -0.7 on iris, -1 on lens
function meshAstraspis() {
  const m = new Mesh();
  rseed(750);
  // body: oval, wider than tall, flatter below [z, half-width, half-height, y-centre]
  const K = [
    [-0.50, 0.003, 0.004, 0],
    [-0.42, 0.012, 0.016, 0],
    [-0.30, 0.030, 0.034, 0],
    [-0.18, 0.050, 0.052, 0.002],
    [-0.05, 0.074, 0.070, 0.005],
    [0.08, 0.090, 0.080, 0.008],
    [0.18, 0.092, 0.076, 0.009],
    [0.28, 0.084, 0.066, 0.008],
    [0.36, 0.066, 0.052, 0.006],
    [0.42, 0.046, 0.036, 0.004],
    [0.48, 0.022, 0.018, 0.002],
    [0.50, 0.004, 0.005, 0],
  ];
  loft(m, K, 4, 16, 0, (a) => {
    const c = cos(a), s = sin(a);
    return [(c < 0 ? -1 : 1) * pow(abs(c), 0.88), s > 0 ? pow(s, 0.82) : -pow(-s, 0.72)];
  });
  // caudal blade: a thin vertical fin at the tail end (shape unknown, kept small)
  slab(m, [0, 0, -0.50], [0, 0, -1], [1, 0, 0], [0, 1, 0], 0.055,
    (s) => 0.010 * (1 - 0.4 * s), (s) => 0.022 * (1 - 0.2 * s), () => 0, 4);
  // eyes: large, at the sides of the head, anterior to the gill openings (Sansom 1997)
  for (const sx of [-1, 1]) {
    ball(m, [sx * 0.052, 0.038, 0.36], [0.014, 0.016, 0.012], -0.7, 10, 6);
    ball(m, [sx * 0.058, 0.044, 0.368], 0.007, -1, 8, 4);
  }
  // gill openings: 8 per side, in a postero-ventrally slanting line behind the orbit (Sansom 1997)
  for (const sx of [-1, 1]) {
    for (let g = 0; g < 8; g++) {
      const gz = 0.14 - g * 0.025, bw = wideAt(K, gz);
      m.tube([
        [sx * (bw + 0.001), -0.012 - 0.004 * g, gz],
        [sx * (bw + 0.007), -0.030 - 0.004 * g, gz - 0.009]
      ], () => 0.003, 4, true, () => -0.5);
    }
  }
  return m;
}

// ---------------------------------------------------------------- shaders
const S_ASTRASPIS = /*wgsl*/`
// Instance: a.xz = school centre on the floor, a.y = height above the floor, a.w = school orbit radius.
// b.x = individual seed, b.y = speed (rad/s, sign is direction), b.z = size in metres, b.w = school seed.
// The orbit asP is repeated in zooAstraspis below: change one, change the other
fn asP(ta: f32, a: vec4f, ph: f32) -> vec3f {
  let xz = a.xz + a.w * vec2f(cos(ta) * (1. + .15 * sin(2. * ta + ph)), .55 * sin(ta));
  return vec3f(xz.x, ground(xz) + a.y, xz.y);
}
@vertex fn vsAstraspis(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let ph = i.b.w * 17.;
  let R = i.a.w; let e = .3 / max(R, .5);
  // orbit with per-individual scatter that wanders
  let ta = t * i.b.y + i.b.w * 6.3 + ((h.x - .5) * 10. + sin(t * .25 + s * 40.)) / max(R, .5);
  let P = asP(ta, i.a, ph);
  let T = normalize(asP(ta + e, i.a, ph) - asP(ta - e, i.a, ph)) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let off = S * ((h.y - .5) * .5 + .08 * sin(t * .4 + s * 31.)) + Up * ((h.z - .5) * .4 + .06 * cos(t * .35 + s * 23.));
  // swimming: the whole tail waggles side to side, wider towards the tail tip
  var l = i.p; var n = i.n.xyz;
  let u = .5 - l.z; let tail = ss(0., .5, u);
  let A = .015 + .11 * tail * tail; let wv = t * 7. + s * 50. - u * 5.5;
  l.x += A * sin(wv);
  let sl = 5.5 * A * cos(wv);
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  let sz = i.b.z * (.88 + .24 * h.z);
  let w = dodge(P + off, .4 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
@fragment fn fsAstraspis(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let sd = i.sd; let lt = i.lt;
  let x = abs(i.op.x); let y = i.op.y; let z = i.op.z;
  let h1 = hs(sd * 7.); let h2 = hs(sd * 23.);
  // which part
  let body = step(-.25, lt) * step(lt, .15);
  let gill = step(-.6, lt) * step(lt, -.25);
  let iris = step(-.8, lt) * step(lt, -.6);
  let lens = step(lt, -.8);
  let eye = iris + lens; let soft = body + gill;
  // how much of the body is shield vs tail (shield: z > -0.05, about front 60%)
  let shield = ss(-.10, .0, z) * ss(.44, .40, z) * body;
  let tail = ss(.0, -.12, z) * body;
  // two texture layers
  let tg = textureSample(tD, sR, vec2f(x * 60. + z * 35., z * 55. + x * 30.) + y * vec2f(40., 50.) + sd) * .5
    + textureSample(tD, sR, vec2f(x * 85. - z * 40., z * 90. + x * 55.) + y * vec2f(55., 35.) + .37) * .5;
  let fine = ss(.006, .002, fwidth(z) + fwidth(x));
  // plate tessellation on the shield: polygonal tesserae from Voronoi-like noise (Sansom 1997)
  let pn = vn(vec3f(x * 190., y * 190., z * 190.));
  let plate = (.5 + .5 * cos(pn * 22.)) * fine;
  // star-shaped tubercles on the tesserae: a bump per plate centre
  let tuber = exp(0. - 8. * plate * plate) * fine * .6;
  // rhomboid scales on the tail: a diamond pattern
  let sc1 = sin(z * 350. + x * 60.) * sin(x * 250. + z * 100.); let sc2 = sin(z * 400.) * sin(x * 350.);
  let scale = (.5 + .25 * sc1 + .25 * sc2) * fine * tail;
  // combined relief
  let rh = (.003 * plate + .002 * tuber) * shield + .0015 * scale + .002 * (tg.a - .5) * fine * body;
  let n = skinRelief(ns, i.wp, rh);
  // colour: grey-brown armour, like limestone bone
  let dk = mix(vec3f(.28, .25, .20), vec3f(.32, .28, .22), h2);
  let md = mix(vec3f(.42, .38, .30), vec3f(.46, .40, .33), h2);
  var alb = mix(md, dk, ss(-.02, .05, y) * .4) * body;
  // counter-shading: paler belly
  alb = mix(alb, md * 1.15, ss(-.05, -.02, y) * .35 * body);
  // plate grooves on shield: darker in the gaps
  alb *= 1. - .12 * plate * shield;
  // tubercle highlights: faintly paler
  alb += vec3f(.02, .02, .015) * tuber * shield;
  // tail: slightly paler and more uniform, scale grooves darker
  alb = mix(alb, mix(vec3f(.40, .36, .28), vec3f(.45, .40, .33), h2), tail * .3);
  alb *= 1. - .08 * scale;
  alb *= .88 + .24 * tg.g;
  // gills: faintly reddish
  alb = mix(alb, vec3f(.48, .30, .26), gill);
  // eyes: dark iris, darker lens
  alb = mix(alb, vec3f(.05, .045, .04), iris);
  alb = mix(alb, vec3f(.012, .010, .010), lens);
  // per-individual tone
  alb *= .82 + .4 * h1;
  // the light
  var c = skinWet(alb, n, ns, i.wp, .12 * soft + 1.2 * eye, .28 * body + .08 * gill + 1. * iris + 2. * lens);
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;

// ---------------------------------------------------------------- zoo
// A school of Astraspis: the orbit asP of vsAstraspis. Two half-lines from the middle (part 0 and 1).
// Uses zooGround() from swimmers.js to find the floor height
const zooAstraspis = (a, i, part) => {
  const R = a[i + 3], ph = a[i + 7] * 17;
  const ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3;
  const e = 0.3 / max(R, 0.5), tb = ta + (part * 2 - 1) * e * 3;
  const c0 = cos(ta), s0 = sin(ta), c1 = cos(tb), s1 = sin(tb);
  const x0 = a[i] + R * c0 * (1 + 0.15 * sin(2 * ta + ph)), z0 = a[i + 2] + R * 0.55 * s0;
  const x1 = a[i] + R * c1 * (1 + 0.15 * sin(2 * tb + ph)), z1 = a[i + 2] + R * 0.55 * s1;
  ZP[0] = x0; ZP[1] = 0; ZP[2] = z0; zooGround(); ZP[1] += a[i + 1]; const y0 = ZP[1];
  ZP[0] = x1; ZP[1] = 0; ZP[2] = z1; zooGround(); ZP[1] += a[i + 1];
  ZP[3] = x1 - x0; ZP[4] = ZP[1] - y0; ZP[5] = z1 - z0; ZP[7] = 0.5;
  ZP[0] = x0; ZP[1] = y0; ZP[2] = z0;
};
