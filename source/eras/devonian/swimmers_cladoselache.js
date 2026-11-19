// ============================================================================
// devonian: Cladoselache
// ============================================================================
// An early shark, up to 1.8 m, in small groups of about 6. Its mesh, its shaders and, for the zoo, where it is at a
// time. world.js lists it as a kind and gives it its instances. What it shares with the other animals of this era
// (pieces for the mesh, the light on a skin, giving way to the viewer) is in swimmers.js.

// Cladoselache fillmori in the round. One unit from snout to tail. Sources: Bendix-Almgreen 1975, Maisey 2007
// (Cleveland Shale Cladoselache specimens with muscle traces and gut contents, Carr 2010). Up to 1.8 m, slim
// torpedo body, broad triangular pectoral fins (wider-based than modern sharks), deeply forked nearly symmetrical
// caudal fin, large eyes, smooth skin without denticle scales. Estimates: all widths and cross-sections
// aux: 0 body, 0.18 gill slits, 0.22 mouth+nostrils, -0.7 iris, -1 lens, 0.3 pectoral, 0.4 pelvic+anal, 0.5 dorsal, 0.8 caudal
function meshCladoselache() {
  const m = new Mesh();
  // body: slim torpedo, laterally compressed, slight dorsal keel, flattened snout
  const K = [
    [-0.50, 0.001, 0.003, 0],
    [-0.44, 0.012, 0.030, 0],
    [-0.34, 0.032, 0.062, 0.001],
    [-0.20, 0.048, 0.088, 0.004],
    [-0.06, 0.056, 0.098, 0.006],
    [ 0.06, 0.054, 0.095, 0.007],
    [ 0.16, 0.048, 0.085, 0.006],
    [ 0.26, 0.040, 0.068, 0.004],
    [ 0.34, 0.032, 0.050, 0.002],
    [ 0.42, 0.020, 0.032, 0],
    [ 0.50, 0.004, 0.008, 0],
  ];
  loft(m, K, 2, 14, 0, (a) => {
    const c = cos(a), s = sin(a);
    return [(c < 0 ? -1 : 1) * pow(abs(c), 0.88), s > 0 ? pow(s, 0.80) + 0.04 * pow(s, 5) : -pow(-s, 0.78)];
  });
  // eyes: large, set on the sides of the head
  for (const sx of [-1, 1]) {
    ball(m, [sx * 0.030, 0.020, 0.36], [0.011, 0.013, 0.010], -0.7, 8, 4);
    ball(m, [sx * 0.036, 0.024, 0.370], 0.005, -1, 6, 3);
  }
  // 5 gill slits on each side, behind the head
  for (const sx of [-1, 1]) {
    for (let g = 0; g < 5; g++) {
      const gz = 0.24 - g * 0.016;
      slab(m, [sx * 0.076, -0.006, gz],
        [0, 1, 0], [0, 0, 1], [sx, 0, 0], 0.030,
        (s) => 0.005 * sin(PI * s),
        (s) => 0.002,
        (s) => 0.18, 2);
    }
  }
  // mouth slit under the snout
  slab(m, [0, -0.024, 0.42], [0, 0, -1], [1, 0, 0], [0, -1, 0], 0.06,
    (s) => 0.014 * sin(PI * s),
    (s) => 0.002,
    (s) => 0.22, 3);
  // nostrils: small pits above the mouth
  for (const sx of [-1, 1]) {
    ball(m, [sx * 0.014, 0.001, 0.44], [0.005, 0.003, 0.005], 0.22, 4, 2);
  }
  // dorsal fin: single, moderate, in the rear third
  slab(m, [0, 0.095, -0.10], [0, 0, -1], [0, 1, 0], [1, 0, 0], 0.16,
    (s) => 0.040 * pow(sin(PI * pow(s, 0.5)), 0.8),
    (s) => 0.003 * (1 - 0.3 * s),
    (s) => 0.5, 4);
  // pectoral fins: broad triangular (wider base than modern sharks), extending outward and slightly back
  for (const sx of [-1, 1]) {
    slab(m, [sx * 0.052, -0.015, 0.10],
      [sx * 0.75, -0.30, -0.50], [0, 0, -1], [0, 1, 0], 0.10,
      (s) => 0.035 * pow(sin(PI * pow(s, 0.45)), 0.9),
      (s) => 0.004 * (1 - 0.5 * s),
      (s) => sx * 0.3, 4);
  }
  // pelvic fins: small, below and behind
  for (const sx of [-1, 1]) {
    slab(m, [sx * 0.038, -0.055, -0.16],
      [sx * 0.6, -0.35, -0.5], [0, 0, -1], [0, 1, 0], 0.045,
      (s) => 0.012 * sin(PI * s),
      (s) => 0.002 * (1 - 0.5 * s),
      (s) => sx * 0.4, 3);
  }
  // anal fin: small, below
  slab(m, [0, -0.065, -0.28], [0, 0, -1], [0, -1, 0], [1, 0, 0], 0.06,
    (s) => 0.018 * sin(PI * s),
    (s) => 0.002 * (1 - 0.4 * s),
    (s) => 0.4, 3);
  // caudal fin: deeply forked, two nearly equal lobes (nearly homocercal)
  slab(m, [0, 0.015, -0.48], [0, 0.55, -1], [1, 0, 0], [0, 0.8, 0.5], 0.12,
    (s) => 0.035 * sin(PI * s), (s) => 0.0025 * (1 - 0.4 * s), (s) => 0.8, 3);
  slab(m, [0, -0.015, -0.48], [0, -0.55, -1], [1, 0, 0], [0, -0.8, 0.5], 0.12,
    (s) => 0.034 * sin(PI * s), (s) => 0.0025 * (1 - 0.4 * s), (s) => 0.8, 3);
  return m;
}

// ---------------------------------------------------------------- shaders
const S_CLADOSELACHE = /*wgsl*/`
// Instance: a.xyz = group centre, a.w = orbit radius R. b.x = individual seed, b.y = group speed (rad/s, sign is
// direction), b.z = size in metres, b.w = group seed. The path P is repeated in zooCladoselache: change one, change
// the other
@vertex fn vsCladoselache(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w;
  // group orbit: slower and larger than the fish schools
  let ta = t * i.b.y + i.b.w * 6.3 + (h.x - .5) * (5. / R);
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), 2. * sin(2. * ta + ph), R * .6 * sin(ta));
  let T = normalize(vec3f(0. - R * sin(ta), 4. * cos(2. * ta + ph), R * .6 * cos(ta))) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  // individual offset within the group: sharks spread about 3 m sideways
  let off = S * ((h.y - .5) * 3. + sin(t * .3 + s * 20.) * .4) + Up * ((h.z - .5) * 1.5 + cos(t * .2 + s * 15.) * .3);
  // body wave: tail wagging, wider towards the tail
  var l = i.p; var n = i.n.xyz;
  let sz = i.b.z * (.90 + .2 * h.z);
  let u = .5 - l.z;
  let A = .008 + .05 * u * u;
  let wv = t * 7. + s * 40. - u * 5.;
  l.x += A * sin(wv);
  let sl = 5. * A * cos(wv);
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  let w = dodge(P + off, .5 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
@fragment fn fsCladoselache(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let x = abs(i.op.x); let y = i.op.y; let z = i.op.z; let lt = i.lt;
  let h1 = hs(i.sd * 7.); let h2 = hs(i.sd * 23.);
  // which part
  let body = step(-.25, lt) * step(lt, .16);
  let gill = step(.16, lt) * step(lt, .20);
  let mth = step(.20, lt) * step(lt, .24);
  let iris = step(-.8, lt) * step(lt, -.6);
  let lens = step(lt, -.8);
  let fp = step(.25, lt);
  let eye = iris + lens;
  // smooth skin: Cladoselache lacked denticle scales. Fine noise texture only
  let tg = textureSample(tD, sR, vec2f(z * 20. + x * 12., y * 18.) + i.sd) * .5
    + textureSample(tD, sR, vec2f(z * 47. - x * 31., y * 43. + x * 17.) + i.sd + .37) * .5;
  let fine = ss(.006, .0015, fwidth(z) + fwidth(x) + fwidth(y));
  let rh = .003 * (tg.a - .5) * fine * body + .001 * (tg.g - .5) * fine * fp
    + (-.004) * gill + (-.002) * mth;
  let n = skinRelief(ns, i.wp, rh);
  // colour: dark grey-blue back, paler belly (classic shark counter-shading)
  let dk = mix(vec3f(.14, .15, .18), vec3f(.12, .13, .16), h2);
  let md = mix(vec3f(.38, .40, .42), vec3f(.34, .36, .38), h2);
  var alb = mix(md, dk, ss(-.02, .05, y));
  // pale belly
  alb = mix(alb, vec3f(.52, .54, .50), ss(-.07, -.03, y) * .5);
  alb *= .82 + .4 * h1;
  alb *= .88 + .24 * tg.g;
  // gill slits: dark openings
  alb = mix(alb, vec3f(.05, .05, .04), gill);
  // mouth and nostrils: dark
  alb = mix(alb, vec3f(.04, .03, .03), mth);
  // fins: slightly darker, translucent feel
  alb = mix(alb, alb * .6 + vec3f(.04, .04, .05), fp);
  // eyes
  alb = mix(alb, vec3f(.03, .03, .03), iris);
  alb = mix(alb, vec3f(.008, .008, .010), lens);
  // light: shadow map wet sheen
  let zn = zone(i.wp);
  var c = skinWet(alb, n, ns, i.wp,
    .18 * body + .10 * fp + .15 * gill + .10 * mth + 1.0 * eye,
    .40 * body + .20 * fp + .30 * gill + .20 * mth + .6 * iris + 1.5 * lens);
  return fin(fog(c, i.wp, zn));
}
`;

// ---------------------------------------------------------------- zoo
// A group of Cladoselache: the path of vsCladoselache without the per-individual offset. Two lines from the middle
const zooCladoselache = (a, i, part) => {
  const R = a[i + 3], ph = a[i + 7] * 17, ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3, tb = ta + (part * 2 - 1) * 4 / R;
  const x = R * cos(ta), y = 2.0 * sin(2 * ta + ph), z = R * 0.6 * sin(ta);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = R * cos(tb) - x; ZP[4] = 2.0 * sin(2 * tb + ph) - y; ZP[5] = R * 0.6 * sin(tb) - z; ZP[7] = 3.0;
};
