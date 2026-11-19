// ============================================================================
// devonian: Kentuckia
// ============================================================================
// A small ray-finned fish, about 10 cm, in schools of about 150. Its mesh, its shaders and, for the zoo, where it
// is at a time. world.js lists it as a kind and gives it its instances. What it shares with the other animals of
// this era (pieces for the mesh, the light on a skin, giving way to the viewer) is in swimmers.js.

// Kentuckia sp. in the round. One unit from snout to tail. Sources: a palaeoniscoid actinopterygian from the
// Cleveland Shale (found in Cladoselache gut contents, Carr 2010). Length about 10 cm, laterally compressed, shiny
// diamond-shaped ganoid scales, large eyes. Estimates: all widths and cross-sections (no source gives them).
// aux: 0 body, 0.1 mouth, 0.15 operculum, 0.2 lateral line, -0.7 eye iris, -1 eye lens, 0.3 pectoral fins, 0.4 anal fin, 0.5 dorsal fin, 0.8 tail lobes
function meshKentuckia() {
  const m = new Mesh();
  // body: fusiform, laterally compressed (taller than wide), slight dorsal ridge, flatter belly
  const K = [
    [-0.50, 0.001, 0.003, 0],
    [-0.44, 0.010, 0.025, 0],
    [-0.34, 0.025, 0.055, 0.001],
    [-0.20, 0.038, 0.075, 0.003],
    [-0.05, 0.048, 0.090, 0.005],
    [ 0.08, 0.046, 0.085, 0.006],
    [ 0.18, 0.040, 0.072, 0.005],
    [ 0.28, 0.034, 0.058, 0.004],
    [ 0.36, 0.028, 0.044, 0.003],
    [ 0.44, 0.018, 0.028, 0.001],
    [ 0.50, 0.003, 0.006, 0],
  ];
  loft(m, K, 2, 8, 0, (a) => {
    const c = cos(a), s = sin(a);
    return [(c < 0 ? -1 : 1) * pow(abs(c), 0.9), s > 0 ? pow(s, 0.85) + 0.03 * pow(s, 5) : -pow(-s, 0.75)];
  });
  // eyes: large, set on the sides of the head
  for (const sx of [-1, 1]) {
    ball(m, [sx * 0.025, 0.016, 0.38], [0.009, 0.010, 0.008], -0.7, 8, 4);
    ball(m, [sx * 0.030, 0.020, 0.388], 0.004, -1, 6, 3);
  }
  // operculum (gill cover): a bony flap edge on each side behind the eye
  for (const sx of [-1, 1]) {
    slab(m, [sx * 0.040, 0.003, 0.24],
      [0, -1, -0.2], [sx, 0, 0], [0, 0, 1], 0.04,
      (s) => 0.012 * sin(PI * s),
      (s) => 0.002 * (1 - 0.5 * s),
      (s) => 0.15, 3);
  }
  // mouth: a narrow slit under the snout
  slab(m, [0, -0.015, 0.44], [0, 0, -1], [0, -1, 0], [1, 0, 0], 0.06,
    (s) => 0.009 * sin(PI * s),
    (s) => 0.001,
    (s) => 0.1, 2);
  // lateral line: a thin ridge along each flank
  for (const sx of [-1, 1]) {
    m.tube([[sx * 0.038, 0.002, 0.32], [sx * 0.045, 0.0, 0.10], [sx * 0.034, -0.004, -0.20]],
      () => 0.001, 3, false, () => 0.2);
  }
  // dorsal fin: single, in the rear half of the body, extends upward
  slab(m, [0, 0.085, -0.08], [0, 0, -1], [0, 1, 0], [1, 0, 0], 0.18,
    (s) => 0.045 * pow(sin(PI * pow(s, 0.5)), 0.8),
    (s) => 0.0025 * (1 - 0.3 * s),
    (s) => 0.5, 4);
  // pectoral fins: paired, behind the head, extending outward and slightly back and down
  for (const sx of [-1, 1]) {
    slab(m, [sx * 0.044, -0.010, 0.14],
      [sx * 0.8, -0.35, -0.45], [0, 0, -1], [0, 1, 0], 0.055,
      (s) => 0.018 * sin(PI * s),
      (s) => 0.003 * (1 - 0.6 * s),
      (s) => sx * 0.3, 3);
  }
  // anal fin: small, below and behind the body
  slab(m, [0, -0.068, -0.26], [0, 0, -1], [0, -1, 0], [1, 0, 0], 0.07,
    (s) => 0.025 * sin(PI * s),
    (s) => 0.002 * (1 - 0.4 * s),
    (s) => 0.4, 3);
  // caudal fin: forked, upper lobe slightly larger (heterocercal)
  slab(m, [0, 0.012, -0.48], [0, 0.55, -1], [1, 0, 0], [0, 0.8, 0.5], 0.10,
    (s) => 0.030 * sin(PI * s), (s) => 0.002 * (1 - 0.4 * s), (s) => 0.8, 3);
  slab(m, [0, -0.012, -0.48], [0, -0.55, -1], [1, 0, 0], [0, -0.8, 0.5], 0.10,
    (s) => 0.025 * sin(PI * s), (s) => 0.002 * (1 - 0.4 * s), (s) => 0.8, 3);
  return m;
}

// ---------------------------------------------------------------- shaders
// Instance: a.xyz = school centre, a.w = orbit radius R. b.x = individual seed, b.y = school speed (rad/s, sign is
// direction), b.z = size in metres, b.w = school seed. The path P (ta without the per-fish offset) is repeated in
// zooKentuckia below: change one, change the other
const S_KENTUCKIA = /*wgsl*/`
@vertex fn vsKentuckia(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w;
  // school orbit: each fish at its own phase along the orbit
  let ta = t * i.b.y + i.b.w * 6.3 + (h.x - .5) * (8. / R);
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), 1.5 * sin(2. * ta + ph), R * .7 * sin(ta));
  let T = normalize(vec3f(0. - R * sin(ta), 3. * cos(2. * ta + ph), R * .7 * cos(ta))) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  // individual offset within the school: about 1.8 m spread sideways, 1.2 m vertical
  let off = S * ((h.y - .5) * 1.8 + sin(t * .7 + s * 40.) * .3) + Up * ((h.z - .5) * 1.2 + cos(t * .5 + s * 31.) * .2);
  // body wave: tail wagging, wider towards the tail
  var l = i.p; var n = i.n.xyz;
  let sz = i.b.z * (.90 + .2 * h.z);
  let u = .5 - l.z;
  let A = .012 + .07 * u * u;
  let wv = t * 10. + s * 50. - u * 5.5;
  l.x += A * sin(wv);
  let sl = 5.5 * A * cos(wv);
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  let w = dodge(P + off, .6 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
@fragment fn fsKentuckia(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let x = abs(i.op.x); let y = i.op.y; let z = i.op.z; let lt = i.lt;
  let h1 = hs(i.sd * 7.); let h2 = hs(i.sd * 23.);
  // which part: body (0), mouth (0.1), operculum (0.15), lateral line (0.2), eye iris (-0.7), eye lens (-1), fins (>0.25)
  let body = step(-.25, lt) * step(lt, .07);
  let mth = step(.07, lt) * step(lt, .13);
  let operc = step(.13, lt) * step(lt, .17);
  let lline = step(.17, lt) * step(lt, .23);
  let iris = step(-.8, lt) * step(lt, -.6);
  let lens = step(lt, -.8);
  let fp = step(.25, lt);
  let eye = iris + lens;
  // diamond scale relief: staggered rows of small rhombic ganoid scales
  let tg = textureSample(tD, sR, vec2f(z * 20. + x * 12., y * 18.) + i.sd) * .5
    + textureSample(tD, sR, vec2f(z * 47. - x * 29., y * 41. + x * 19.) + i.sd + .37) * .5;
  let su = z * 55. + x * 25.;
  let sv = z * 25. - x * 55.;
  let dh = ss(.42, .30, max(abs(fract(su) - .5), abs(fract(sv) - .5)));
  let fine = ss(.006, .0015, fwidth(z) + fwidth(x) + fwidth(y));
  let rh = (.005 * dh + .002 * (tg.a - .5)) * fine * body + (-.003 * fine) * (mth + lline);
  let n = skinRelief(ns, i.wp, rh);
  // colour: olive-silver, counter-shaded (dark back, pale belly), each fish a little different
  let dk = mix(vec3f(.12, .14, .08), vec3f(.10, .13, .07), h2);
  let md = mix(vec3f(.42, .48, .32), vec3f(.38, .44, .28), h2);
  var alb = mix(md, dk, ss(-.015, .05, y));
  alb = mix(alb, vec3f(.55, .58, .48), ss(-.06, -.02, y) * .5);
  alb *= .84 + .32 * dh * fine;
  alb *= .82 + .4 * h1;
  alb *= .88 + .24 * tg.g;
  // operculum: bony highlight, slightly shinier
  alb = mix(alb, alb * 1.15 + vec3f(.03, .03, .02), operc);
  // mouth: dark opening
  alb = mix(alb, vec3f(.04, .03, .02), mth);
  // lateral line: subtle darkening
  alb = mix(alb, alb * .7, lline);
  // fins: slightly translucent, darker
  alb = mix(alb, alb * .55 + vec3f(.03, .04, .02), fp);
  // eyes
  alb = mix(alb, vec3f(.04, .035, .03), iris);
  alb = mix(alb, vec3f(.010, .008, .008), lens);
  // light: caustics for the dappled sunlight, no shadow map (900 fish, the shadow is negligible at this size)
  let dist = length(i.wp - g.cam.xyz);
  let ca = caus(i.wp, dist);
  let zn = zone(i.wp); let V = normalize(g.cam.xyz - i.wp); let H = normalize(V + g.sun.xyz);
  let E = sunE(i.wp.y, zn);
  let vv = vol(i.wp).g;
  var c = alb * (E * sat(dot(n, g.sun.xyz)) * .65 * (.3 + ca.g * .7) + amb(i.wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vv, zn) * 1.1 + side(i.wp, n, 1., zn) * .8)
    + E * (pow(sat(dot(n, H)), 40.) * (.20 * body + .30 * operc + .12 * fp + 1.0 * eye) + pow(sat(dot(ns, H)), 70.) * (.40 * body + .50 * operc + .20 * fp + .6 * iris + 1.5 * lens));
  c += amb(i.wp, vec3f(0., 1., 0.), vv, zn) * pow(1. - sat(dot(n, V)), 3.) * .2;
  return fin(fog(c, i.wp, zn));
}
`;

// ---------------------------------------------------------------- zoo
// A school of Kentuckia: the path of vsKentuckia without the offset of the single fish, which spreads the school
// about 1.8 m to either side of its middle. Two lines from the middle, each 4 / R along the orbit: one back, one
// ahead. Runs every frame, allocates nothing
const zooKentuckia = (a, i, part) => {
  const R = a[i + 3], ph = a[i + 7] * 17, ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3, tb = ta + (part * 2 - 1) * 4 / R;
  const x = R * cos(ta), y = 1.5 * sin(2 * ta + ph), z = R * 0.7 * sin(ta);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = R * cos(tb) - x; ZP[4] = 1.5 * sin(2 * tb + ph) - y; ZP[5] = R * 0.7 * sin(tb) - z; ZP[7] = 1.5;
};
