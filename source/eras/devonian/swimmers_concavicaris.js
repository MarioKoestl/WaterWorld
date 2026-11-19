// ============================================================================
// devonian: Concavicaris
// ============================================================================
// A small thylacocephalan arthropod, about 6 cm, in swarms of about 300. Its mesh, its shaders and, for the zoo,
// where it is at a time. Food for almost everything in this sea. What it shares with the other animals is in
// swimmers.js.

// Concavicaris woodfordi in the round. One unit from front to rear. Sources: Schram et al. 2003 (thylacocephalan
// morphology); found in Cladoselache gut contents (Carr 2010). A bivalved carapace folded around the body, large
// compound eyes through a rostral notch. Estimates: all widths and cross-sections
// aux: 0 shell, 0.3 ventral valve edges, 0.5 rostral+tail spines, 0.7 appendages, -1 eyes
function meshConcavicaris() {
  const m = new Mesh();
  // shell: laterally compressed, taller than wide, with a dorsal keel and a smooth oval profile
  const K = [
    [-0.50, 0.001, 0.002, 0.01],
    [-0.40, 0.020, 0.040, 0.01],
    [-0.22, 0.038, 0.072, 0.01],
    [-0.02, 0.042, 0.080, 0.01],
    [ 0.18, 0.038, 0.072, 0.01],
    [ 0.34, 0.025, 0.045, 0.01],
    [ 0.44, 0.012, 0.022, 0.01],
    [ 0.50, 0.002, 0.004, 0.01],
  ];
  loft(m, K, 2, 8, 0, (a) => {
    const c = cos(a), s = sin(a);
    return [(c < 0 ? -1 : 1) * pow(abs(c), 0.95), s > 0 ? s + 0.08 * pow(s, 3) : -pow(-s, 0.9)];
  });
  // eyes: large compound eyes at the front through the rostral notch
  for (const sx of [-1, 1]) {
    ball(m, [sx * 0.018, 0.020, 0.42], [0.012, 0.014, 0.011], -1, 8, 4);
  }
  // ventral valve edges: where the two halves of the bivalved carapace meet along the bottom
  for (const sx of [-1, 1]) {
    slab(m, [sx * 0.002, -0.040, 0.0],
      [0, 0, -1], [0, -1, 0], [sx, 0, 0], 0.65,
      (s) => {
        const t = s < 0.5 ? s * 2 : 2 - s * 2;
        return 0.004 * pow(sin(PI * pow(t, 0.6)), 0.7);
      },
      (s) => 0.002 * (1 - 0.3 * s),
      (s) => 0.3, 3);
  }
  // rostral spine: a short point at the front of the shell
  m.tube([[0, 0.010, 0.48], [0, 0.005, 0.52], [0, 0.001, 0.54]],
    (k) => [0.004, 0.002, 0.0003][k], 3, true, () => 0.5);
  // tail spine: a short point at the rear
  m.tube([[0, 0.001, -0.48], [0, 0.003, -0.52], [0, 0.001, -0.55]],
    (k) => [0.003, 0.0015, 0.0003][k], 3, true, () => 0.5);
  // raptorial appendages: three pairs of grasping limbs under the front of the shell
  for (const sx of [-1, 1]) {
    for (let j = 0; j < 3; j++) {
      const zp = 0.24 - j * 0.06;
      const n0 = m.p.length / 3;
      m.tube(
        [[sx * 0.014, -0.065, zp], [sx * 0.018, -0.10, zp + 0.025]],
        (k) => k ? 0.0008 : 0.003, 3, true
      );
      for (let k = n0; k < m.aux.length; k++) m.aux[k] = 0.7;
    }
  }
  return m;
}

// ---------------------------------------------------------------- shaders
const S_CONCAVICARIS = /*wgsl*/`
// Instance: a.xyz = swarm centre, a.w = orbit radius R. b.x = individual seed, b.y = swarm speed (rad/s, sign is
// direction), b.z = size in metres, b.w = swarm seed. The path P is repeated in zooConcavicaris: change one,
// change the other
@vertex fn vsConcavicaris(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w;
  let ta = t * i.b.y + i.b.w * 6.3 + (h.x - .5) * (10. / R);
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), 1. * sin(2. * ta + ph), R * .6 * sin(ta));
  let T = normalize(vec3f(0. - R * sin(ta), 2. * cos(2. * ta + ph), R * .6 * cos(ta))) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let off = S * ((h.y - .5) * 1. + sin(t * .5 + s * 30.) * .15) + Up * ((h.z - .5) * .8 + cos(t * .4 + s * 20.) * .1);
  let l = i.p; let n = i.n.xyz;
  let sz = i.b.z * (.90 + .2 * h.z);
  let w = dodge(P + off, .5 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
@fragment fn fsConcavicaris(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let x = abs(i.op.x); let y = i.op.y; let z = i.op.z; let lt = i.lt;
  let h1 = hs(i.sd * 7.); let h2 = hs(i.sd * 23.);
  let shell = step(-.15, lt) * step(lt, .15);
  let valve = step(.25, lt) * step(lt, .35);
  let spine = step(.45, lt) * step(lt, .55);
  let app = step(.65, lt) * step(lt, .75);
  let eye = step(lt, -.5);
  let body = shell + valve + spine + app;
  // shell surface: dual texture, growth lines
  let tg = textureSample(tD, sR, vec2f(z * 25. + x * 15., y * 25.) + i.sd) * .5
    + textureSample(tD, sR, vec2f(z * 53. - x * 33., y * 47. + x * 21.) + i.sd + .37) * .5;
  let fine = ss(.006, .0015, fwidth(z) + fwidth(x) + fwidth(y));
  // growth lines: concentric arcs on the shell, radiating from the dorsal hinge
  let gr = length(vec2f(z * 1.2, (y - .04) * 2.5)) * 80.;
  let gl = (.5 + .5 * cos(gr)) * ss(1.5, .5, fwidth(gr)) * shell;
  // ventral seam: where the two valves meet
  let seam = ss(.006, .002, x) * ss(-.01, -.04, y) * shell;
  let rh = (.003 * (tg.a - .5) + .0015 * gl + .002 * seam) * fine * shell + (-.003 * fine) * valve;
  let n = skinRelief(ns, i.wp, rh);
  // colour: warm amber-brown shell with growth line banding
  var alb = mix(vec3f(.30, .22, .12), vec3f(.48, .36, .20), tg.g * .6 + h2 * .4);
  // growth line color banding
  alb *= 1. - .15 * gl * fine;
  // darker at the dorsal hinge
  alb *= 1. - .3 * ss(.01, .04, y) * shell;
  // ventral seam: slightly paler
  alb = mix(alb, alb * 1.2 + vec3f(.03, .02, .01), seam * .4);
  alb *= .82 + .4 * h1;
  alb *= .88 + .24 * tg.g;
  // valve edges: slightly lighter, chitinous
  alb = mix(alb, alb * 1.1 + vec3f(.04, .03, .02), valve);
  // spines: pale, bony
  alb = mix(alb, mix(vec3f(.50, .40, .28), vec3f(.42, .34, .24), h2), spine);
  // appendages: paler, pinkish-grey
  alb = mix(alb, mix(vec3f(.44, .35, .30), vec3f(.52, .42, .36), h2), app);
  // eyes: dark compound eyes
  alb = mix(alb, vec3f(.02, .015, .01), eye);
  // light: caustics, no shadow map
  let dist = length(i.wp - g.cam.xyz);
  let ca = caus(i.wp, dist);
  let zn = zone(i.wp); let V = normalize(g.cam.xyz - i.wp); let H = normalize(V + g.sun.xyz);
  let E = sunE(i.wp.y, zn);
  let vv = vol(i.wp).g;
  var c = alb * (E * sat(dot(n, g.sun.xyz)) * .65 * (.3 + ca.g * .7) + amb(i.wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vv, zn) * 1.1 + side(i.wp, n, 1., zn) * .8)
    + E * (pow(sat(dot(n, H)), 45.) * (.18 * shell + .25 * valve + .15 * spine + .8 * eye) + pow(sat(dot(ns, H)), 70.) * (.35 * shell + .45 * valve + .30 * spine + 1.2 * eye));
  c += amb(i.wp, vec3f(0., 1., 0.), vv, zn) * pow(1. - sat(dot(n, V)), 3.) * .2;
  return fin(fog(c, i.wp, zn));
}
`;

// ---------------------------------------------------------------- zoo
// A swarm of Concavicaris: the path of vsConcavicaris without the offset of the single animal. Two lines, one back
// and one ahead
const zooConcavicaris = (a, i, part) => {
  const R = a[i + 3], ph = a[i + 7] * 17, ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3, tb = ta + (part * 2 - 1) * 3 / R;
  const x = R * cos(ta), y = 1.0 * sin(2 * ta + ph), z = R * 0.6 * sin(ta);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = R * cos(tb) - x; ZP[4] = 1.0 * sin(2 * tb + ph) - y; ZP[5] = R * 0.6 * sin(tb) - z; ZP[7] = 1.0;
};
