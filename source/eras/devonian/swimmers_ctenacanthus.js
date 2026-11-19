// ============================================================================
// devonian: Ctenacanthus
// ============================================================================
// A sturdy shark with two dorsal fins, each with a long ribbed spine in front. About 1.8 m. Its mesh, its shaders
// and, for the zoo, where it is at a time. world.js lists it as a kind and gives it its instances. What it shares
// with the other animals of this era is in swimmers.js.

// Ctenacanthus sp. in the round. One unit from snout to tail. Sources: Maisey 1981, 1982 (ctenacanth spines and
// classification); Williams 1998 (Cleveland Shale chondrichthyan fauna). Estimates: all widths and cross-sections
// (only isolated spines and teeth are commonly preserved). Length about 1.8 m (Maisey 1982 estimated moderate size,
// ~1.8 m from comparative spine-to-body ratios). A stocky build with a broad head, two dorsal fins each preceded by
// a tall ribbed spine.
// aux: 0 body, 0.18 gill slits, 0.22 mouth+nostrils, 0.5 dorsal fins, 0.6 dorsal spines, 0.3 pectoral, 0.4 pelvic+anal, 0.8 caudal, -0.7 iris, -1 lens
function meshCtenacanthus() {
  const m = new Mesh();
  // body: stocky, broader than typical shark, slightly flattened belly
  const K = [
    [-0.50, 0.001, 0.003, 0],
    [-0.42, 0.016, 0.028, 0.002],
    [-0.30, 0.042, 0.065, 0.005],
    [-0.16, 0.058, 0.082, 0.007],
    [-0.02, 0.064, 0.088, 0.008],
    [ 0.10, 0.060, 0.082, 0.007],
    [ 0.20, 0.054, 0.072, 0.006],
    [ 0.30, 0.044, 0.058, 0.004],
    [ 0.36, 0.035, 0.044, 0.003],
    [ 0.42, 0.024, 0.030, 0.001],
    [ 0.50, 0.004, 0.006, 0],
  ];
  loft(m, K, 2, 14, 0, (a) => {
    const c = cos(a), s = sin(a);
    return [(c < 0 ? -1 : 1) * pow(abs(c), 0.85), s > 0 ? pow(s, 0.80) + 0.04 * pow(s, 5) : -pow(-s, 0.70)];
  });
  // eyes: moderate, on the sides of the broad head
  for (const sx of [-1, 1]) {
    ball(m, [sx * 0.038, 0.020, 0.36], [0.009, 0.010, 0.008], -0.7, 8, 4);
    ball(m, [sx * 0.044, 0.024, 0.368], 0.004, -1, 6, 3);
  }
  // 5 gill slits on each side, behind the head
  for (const sx of [-1, 1]) {
    for (let g = 0; g < 5; g++) {
      const gz = 0.24 - g * 0.016;
      slab(m, [sx * 0.070, -0.006, gz],
        [0, 1, 0], [0, 0, 1], [sx, 0, 0], 0.030,
        (s) => 0.005 * sin(PI * s),
        (s) => 0.002,
        (s) => 0.18, 2);
    }
  }
  // mouth slit under the snout
  slab(m, [0, -0.025, 0.42], [0, 0, -1], [1, 0, 0], [0, -1, 0], 0.06,
    (s) => 0.014 * sin(PI * s),
    (s) => 0.002,
    (s) => 0.22, 3);
  // nostrils
  for (const sx of [-1, 1]) {
    ball(m, [sx * 0.015, 0.001, 0.44], [0.005, 0.003, 0.005], 0.22, 4, 2);
  }
  // first dorsal fin: moderate, behind the head
  slab(m, [0, 0.090, 0.05], [0, 0, -1], [0, 1, 0], [1, 0, 0], 0.13,
    (s) => 0.038 * pow(sin(PI * pow(s, 0.5)), 0.8),
    (s) => 0.0025 * (1 - 0.3 * s),
    (s) => 0.5, 4);
  // first dorsal spine: tall, narrow, slightly curved back, in front of the first dorsal fin
  slab(m, [0, 0.090, 0.08], [0, 1, -0.15], [1, 0, 0], [0, 0.15, 1], 0.08,
    (s) => 0.004 * (1 - 0.7 * s),
    (s) => 0.003 * (1 - 0.5 * s),
    (s) => 0.6, 4);
  // second dorsal fin: slightly smaller, further back
  slab(m, [0, 0.078, -0.18], [0, 0, -1], [0, 1, 0], [1, 0, 0], 0.10,
    (s) => 0.030 * pow(sin(PI * pow(s, 0.5)), 0.8),
    (s) => 0.002 * (1 - 0.3 * s),
    (s) => 0.5, 4);
  // second dorsal spine: shorter, in front of the second dorsal fin
  slab(m, [0, 0.078, -0.16], [0, 1, -0.15], [1, 0, 0], [0, 0.15, 1], 0.06,
    (s) => 0.0035 * (1 - 0.7 * s),
    (s) => 0.0025 * (1 - 0.5 * s),
    (s) => 0.6, 4);
  // pectoral fins: paired, broad, behind the head
  for (const sx of [-1, 1]) {
    slab(m, [sx * 0.058, -0.018, 0.12],
      [sx * 0.8, -0.30, -0.40], [0, 0, -1], [0, 1, 0], 0.09,
      (s) => 0.028 * sin(PI * s),
      (s) => 0.003 * (1 - 0.5 * s),
      (s) => sx * 0.3, 4);
  }
  // pelvic fins: paired, small, below the second dorsal
  for (const sx of [-1, 1]) {
    slab(m, [sx * 0.040, -0.060, -0.16],
      [sx * 0.6, -0.30, -0.50], [0, 0, -1], [0, 1, 0], 0.045,
      (s) => 0.014 * sin(PI * s),
      (s) => 0.002 * (1 - 0.5 * s),
      (s) => sx * 0.4, 3);
  }
  // anal fin: small, below and behind the body
  slab(m, [0, -0.072, -0.30], [0, 0, -1], [0, -1, 0], [1, 0, 0], 0.06,
    (s) => 0.020 * sin(PI * s),
    (s) => 0.002 * (1 - 0.4 * s),
    (s) => 0.4, 3);
  // caudal fin: heterocercal (upper lobe larger)
  slab(m, [0, 0.014, -0.48], [0, 0.55, -1], [1, 0, 0], [0, 0.8, 0.5], 0.11,
    (s) => 0.032 * sin(PI * s), (s) => 0.0025 * (1 - 0.4 * s), (s) => 0.8, 3);
  slab(m, [0, -0.014, -0.48], [0, -0.45, -1], [1, 0, 0], [0, -0.8, 0.5], 0.08,
    (s) => 0.024 * sin(PI * s), (s) => 0.002 * (1 - 0.4 * s), (s) => 0.8, 3);
  return m;
}

// ---------------------------------------------------------------- shaders
const S_CTENACANTHUS = /*wgsl*/`
// Instance: a.xyz = orbit centre, a.w = orbit radius R. b.x = seed, b.y = speed (rad/s, sign is direction),
// b.z = size in metres (~1.8), b.w = seed2. The orbit path is repeated in zooCtenacanthus: change one, change
// the other
@vertex fn vsCtenacanthus(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w;
  let ta = t * i.b.y + i.b.w * 6.3 + s * 3.7;
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
@fragment fn fsCtenacanthus(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let x = abs(i.op.x); let y = i.op.y; let z = i.op.z; let lt = i.lt;
  let h1 = hs(i.sd * 7.); let h2 = hs(i.sd * 23.);
  // parts
  let body = step(-.25, lt) * step(lt, .16);
  let gill = step(.16, lt) * step(lt, .20);
  let mth = step(.20, lt) * step(lt, .24);
  let dfin = step(.45, lt) * step(lt, .55);
  let spine = step(.55, lt) * step(lt, .65);
  let pec = step(.25, lt) * step(lt, .35);
  let pva = step(.35, lt) * step(lt, .45);
  let tail = step(.75, lt);
  let iris = step(-.8, lt) * step(lt, -.6);
  let lens = step(lt, -.8);
  let fp = max(dfin, max(pec, max(pva, tail)));
  let eye = iris + lens;
  // denticle skin: fine bumpy texture across the body, two lookups to break the grid
  let tg = textureSample(tD, sR, vec2f(z * 40. + x * 20., y * 40. + x * 10.) + i.sd) * .5
    + textureSample(tD, sR, vec2f(z * 71. - x * 43., y * 61. + x * 27.) + i.sd + .37) * .5;
  let fine = ss(.006, .0015, fwidth(z) + fwidth(x) + fwidth(y));
  let dh = tg.a * fine * body;
  // spine ribbing: horizontal ridges along the spine height
  let spZ = abs(i.op.z);
  let rib = abs(sin(y * 180.)) * ss(.02, .008, fwidth(y)) * spine;
  let rh = .004 * (dh - .5) * body + .003 * rib + (-.004) * gill + (-.002) * mth;
  let n = skinRelief(ns, i.wp, rh);
  // colour: warm grey-brown, different family from the blue-grey Cladoselache
  let dk = mix(vec3f(.18, .15, .10), vec3f(.16, .13, .09), h2);
  let md = mix(vec3f(.42, .36, .28), vec3f(.38, .33, .25), h2);
  var alb = mix(md, dk, ss(-.01, .05, y));
  // pale belly
  alb = mix(alb, vec3f(.55, .50, .42), ss(-.06, -.02, y) * .5);
  alb *= .82 + .4 * h1;
  alb *= .88 + .24 * tg.g;
  // gill slits: dark openings
  alb = mix(alb, vec3f(.05, .05, .04), gill);
  // mouth and nostrils: dark
  alb = mix(alb, vec3f(.04, .03, .03), mth);
  // spines: darker, brownish
  alb = mix(alb, mix(vec3f(.22, .18, .12), vec3f(.18, .14, .10), h2) * (1. - .3 * rib), spine);
  // fins: slightly translucent
  alb = mix(alb, alb * .6 + vec3f(.03, .02, .01), fp * (1. - spine));
  // eyes
  alb = mix(alb, vec3f(.04, .035, .03), iris);
  alb = mix(alb, vec3f(.010, .008, .008), lens);
  let zn = zone(i.wp);
  var c = skinWet(alb, n, ns, i.wp,
    .18 * body + .10 * fp + .15 * gill + .10 * mth + .25 * spine + 1.0 * eye,
    .40 * body + .20 * fp + .30 * gill + .20 * mth + .55 * spine + .6 * iris + 1.5 * lens);
  return fin(fog(c, i.wp, zn));
}
`;

// ---------------------------------------------------------------- zoo
// A single Ctenacanthus on its orbit. Two lines from the middle
const zooCtenacanthus = (a, i, part) => {
  const R = a[i + 3], ph = a[i + 7] * 17, ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3 + a[i + 4] * 3.7;
  const tb = ta + (part * 2 - 1) * 4 / R;
  const x = R * cos(ta), y = 1.2 * sin(2 * ta + ph), z = R * 0.6 * sin(ta);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = R * cos(tb) - x; ZP[4] = 1.2 * sin(2 * tb + ph) - y; ZP[5] = R * 0.6 * sin(tb) - z; ZP[7] = 3.0;
};
