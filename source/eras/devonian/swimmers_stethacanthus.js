// ============================================================================
// devonian: Stethacanthus (the anvil shark)
// ============================================================================
// A small shark, about 1 m, with a flat-topped dorsal structure (the "anvil") covered in denticle teeth on top, and
// a matching rough patch on its head. About 8 individuals, each on its own orbit. Its mesh, its shaders and, for the
// zoo, where it is at a time. What it shares with the other animals is in swimmers.js.

// Stethacanthus altonensis in the round. One unit from snout to tail. Sources: Lund 1985 (Stethacanthus morphology,
// the anvil-shaped first dorsal fin); Coates & Sequeira 2001 (anvil structure with denticles on top). About 1 m,
// only some individuals have the anvil (thought to be male display). Estimates: all widths and cross-sections
// aux: 0 body, 0.18 gill slits, 0.22 mouth+nostrils, 0.7 anvil, 0.75 head brush, 0.5 dorsal 2, 0.3 pectoral, 0.4 pelvic+anal, 0.8 caudal, -0.7 iris, -1 lens
function meshStethacanthus() {
  const m = new Mesh();
  // body: compact shark, slightly stockier than Cladoselache
  const K = [
    [-0.50, 0.001, 0.003, 0],
    [-0.44, 0.012, 0.022, 0.001],
    [-0.34, 0.030, 0.052, 0.004],
    [-0.22, 0.044, 0.072, 0.006],
    [-0.08, 0.052, 0.082, 0.008],
    [ 0.05, 0.050, 0.078, 0.008],
    [ 0.16, 0.044, 0.068, 0.006],
    [ 0.26, 0.036, 0.055, 0.004],
    [ 0.34, 0.026, 0.040, 0.002],
    [ 0.42, 0.016, 0.024, 0.001],
    [ 0.50, 0.003, 0.005, 0],
  ];
  loft(m, K, 2, 14, 0, (a) => {
    const c = cos(a), s = sin(a);
    return [(c < 0 ? -1 : 1) * pow(abs(c), 0.85), s > 0 ? pow(s, 0.80) + 0.04 * pow(s, 5) : -pow(-s, 0.70)];
  });
  // eyes: moderate, on the sides of the head
  for (const sx of [-1, 1]) {
    ball(m, [sx * 0.028, 0.015, 0.36], [0.008, 0.009, 0.007], -0.7, 8, 4);
    ball(m, [sx * 0.033, 0.019, 0.368], 0.0035, -1, 6, 3);
  }
  // 5 gill slits on each side, behind the head
  for (const sx of [-1, 1]) {
    for (let g = 0; g < 5; g++) {
      const gz = 0.24 - g * 0.016;
      slab(m, [sx * 0.060, -0.006, gz],
        [0, 1, 0], [0, 0, 1], [sx, 0, 0], 0.028,
        (s) => 0.005 * sin(PI * s),
        (s) => 0.002,
        (s) => 0.18, 2);
    }
  }
  // mouth slit under the snout
  slab(m, [0, -0.020, 0.42], [0, 0, -1], [1, 0, 0], [0, -1, 0], 0.05,
    (s) => 0.012 * sin(PI * s),
    (s) => 0.002,
    (s) => 0.22, 3);
  // nostrils
  for (const sx of [-1, 1]) {
    ball(m, [sx * 0.012, 0.001, 0.44], [0.004, 0.003, 0.004], 0.22, 4, 2);
  }
  // THE ANVIL: flat-topped dorsal structure, the defining feature. A blocky shape, not a pointed fin.
  // Built from two slabs: a stalk rising from the back, and a flat cap on top
  // Stalk: rises from the back, taller and broader
  slab(m, [0, 0.082, -0.04], [0, 0, -1], [0, 1, 0], [1, 0, 0], 0.14,
    (s) => 0.016 + 0.058 * sin(PI * s),
    (s) => 0.008 * (1 - 0.15 * s),
    (s) => 0.7, 5);
  // Cap: flat, wide top of the anvil — the defining silhouette
  slab(m, [0, 0.170, -0.06], [0, 0, -1], [0, 0.08, 0], [1, 0, 0], 0.12,
    (s) => 0.012 + 0.004 * sin(PI * s),
    (s) => 0.030 + 0.015 * sin(PI * s),
    (s) => 0.7, 4);
  // second dorsal fin: small, behind the anvil
  slab(m, [0, 0.065, -0.24], [0, 0, -1], [0, 1, 0], [1, 0, 0], 0.08,
    (s) => 0.018 * pow(sin(PI * pow(s, 0.5)), 0.8),
    (s) => 0.002 * (1 - 0.3 * s),
    (s) => 0.5, 3);
  // pectoral fins: paired, broad, typical shark pectorals
  for (const sx of [-1, 1]) {
    slab(m, [sx * 0.048, -0.015, 0.08],
      [sx * 0.8, -0.35, -0.5], [0, 0, -1], [0, 1, 0], 0.08,
      (s) => 0.025 * sin(PI * s),
      (s) => 0.003 * (1 - 0.5 * s),
      (s) => sx * 0.3, 4);
  }
  // pelvic fins: paired, smaller, further back
  for (const sx of [-1, 1]) {
    slab(m, [sx * 0.038, -0.028, -0.16],
      [sx * 0.6, -0.3, -0.5], [0, 0, -1], [0, 1, 0], 0.045,
      (s) => 0.014 * sin(PI * s),
      (s) => 0.002 * (1 - 0.4 * s),
      (s) => sx * 0.4, 3);
  }
  // anal fin: small, below and behind the body
  slab(m, [0, -0.058, -0.28], [0, 0, -1], [0, -1, 0], [1, 0, 0], 0.06,
    (s) => 0.018 * sin(PI * s),
    (s) => 0.002 * (1 - 0.4 * s),
    (s) => 0.4, 3);
  // caudal fin: heterocercal, upper lobe distinctly larger
  slab(m, [0, 0.015, -0.48], [0, 0.6, -1], [1, 0, 0], [0, 0.8, 0.5], 0.11,
    (s) => 0.028 * sin(PI * s), (s) => 0.002 * (1 - 0.4 * s), (s) => 0.8, 3);
  slab(m, [0, -0.010, -0.48], [0, -0.4, -1], [1, 0, 0], [0, -0.8, 0.5], 0.07,
    (s) => 0.020 * sin(PI * s), (s) => 0.002 * (1 - 0.4 * s), (s) => 0.8, 3);
  return m;
}

// ---------------------------------------------------------------- shaders
const S_STETHACANTHUS = /*wgsl*/`
// Instance: a.xyz = orbit centre, a.w = orbit radius R. b.x = seed, b.y = speed (rad/s, sign is direction),
// b.z = size in metres, b.w = seed2. The path P is repeated in zooStethacanthus: change one, change the other
@vertex fn vsStethacanthus(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w;
  // solo orbit: slow, wandering path
  let ta = t * i.b.y + i.b.w * 6.3;
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), 1.2 * sin(2. * ta + ph), R * .6 * sin(ta));
  let T = normalize(vec3f(0. - R * sin(ta), 2.4 * cos(2. * ta + ph), R * .6 * cos(ta))) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  // body wave: moderate tail wagging
  var l = i.p; var n = i.n.xyz;
  let sz = i.b.z * (.92 + .16 * h.z);
  let u = .5 - l.z;
  let A = .008 + .05 * u * u;
  let wv = t * 7. + s * 40. - u * 5.;
  l.x += A * sin(wv);
  let sl = 5. * A * cos(wv);
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  let w = dodge(P, .6 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
@fragment fn fsStethacanthus(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let x = abs(i.op.x); let y = i.op.y; let z = i.op.z; let lt = i.lt;
  let h1 = hs(i.sd * 7.); let h2 = hs(i.sd * 23.);
  // parts
  let body = step(-.25, lt) * step(lt, .16);
  let gill = step(.16, lt) * step(lt, .20);
  let mth = step(.20, lt) * step(lt, .24);
  let anvil = step(.65, lt) * step(lt, .75);
  let brush = step(.73, lt) * step(lt, .78);
  let fp = step(.25, lt) * step(lt, .65);
  let tail = step(.78, lt);
  let iris = step(-.8, lt) * step(lt, -.6);
  let lens = step(lt, -.8);
  let eye = iris + lens;
  let fns = fp + tail;
  // shark skin: fine denticle texture
  let tg = textureSample(tD, sR, vec2f(z * 40. + x * 20., y * 40.) + i.sd) * .5
    + textureSample(tD, sR, vec2f(z * 67. - x * 41., y * 59. + x * 23.) + i.sd + .37) * .5;
  let fine = ss(.006, .0015, fwidth(z) + fwidth(x) + fwidth(y));
  // body: subtle denticle bumps. Anvil and brush: rougher, coarser texture
  let bodyRh = .003 * (tg.a - .5) * fine * body;
  let anvilRh = .0025 * abs(sin(z * 60.) * sin(x * 50.)) * fine * (anvil + brush);
  let rh = bodyRh + anvilRh + (-.004) * gill + (-.002) * mth;
  let n = skinRelief(ns, i.wp, rh);
  // colour: dark grey-olive on top, lighter belly (counter-shading)
  let dk = mix(vec3f(.14, .15, .11), vec3f(.12, .13, .10), h2);
  let md = mix(vec3f(.38, .40, .32), vec3f(.35, .37, .30), h2);
  var alb = mix(md, dk, ss(-.02, .05, y));
  alb = mix(alb, vec3f(.50, .50, .44), ss(-.06, -.02, y) * .45);
  alb *= .84 + .36 * h1;
  alb *= .88 + .24 * tg.g;
  // gill slits: dark openings
  alb = mix(alb, vec3f(.05, .05, .04), gill);
  // mouth and nostrils: dark
  alb = mix(alb, vec3f(.04, .03, .03), mth);
  // anvil top and head brush: slightly paler, rough look
  alb = mix(alb, alb * 1.15 + vec3f(.04, .03, .02), anvil + brush);
  // fins: darker, slightly translucent
  alb = mix(alb, alb * .6 + vec3f(.02, .03, .02), fns);
  // eyes
  alb = mix(alb, vec3f(.03, .03, .02), iris);
  alb = mix(alb, vec3f(.008, .006, .006), lens);
  // light: shadow map wet sheen
  let zn = zone(i.wp);
  var c = skinWet(alb, n, ns, i.wp,
    .18 * body + .10 * fns + .15 * gill + .10 * mth + .22 * anvil + .15 * brush + 1.0 * eye,
    .40 * body + .20 * fns + .30 * gill + .20 * mth + .50 * anvil + .35 * brush + .6 * iris + 1.5 * lens);
  return fin(fog(c, i.wp, zn));
}
`;

// ---------------------------------------------------------------- zoo
// Stethacanthus on its solo orbit: the path of vsStethacanthus. Two parts spread along the orbit
const zooStethacanthus = (a, i, part) => {
  const R = a[i + 3], ph = a[i + 7] * 17, ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3, tb = ta + (part * 2 - 1) * 4 / R;
  const x = R * cos(ta), y = 1.2 * sin(2 * ta + ph), z = R * 0.6 * sin(ta);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = R * cos(tb) - x; ZP[4] = 1.2 * sin(2 * tb + ph) - y; ZP[5] = R * 0.6 * sin(tb) - z; ZP[7] = 2.0;
};
