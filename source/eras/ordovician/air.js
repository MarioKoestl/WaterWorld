// ============================================================================
// ordovician: water and light
// ============================================================================
// A bright, warm, shallow sea in clear aquamarine water. After the dusk of the Cambrian, this is the first world
// that feels full. The surface is visible at 10 to 25 m, the flecks of sunlight land on pale mud. How it looked is
// not known from rock. See today's air.js for what the engine reads from AIR and LIGHT.
const AIR = /*wgsl*/`
// scatter (SIG) and absorption (KD) per metre: red swallowed fast, green and blue last, so that the water reads
// aquamarine at distance, greener the further one looks. Visibility about 60 m
const SIG = vec3f(.028, .017, .020);
const KD = vec3f(.028, .012, .017);
// the colour of the water itself: clear aquamarine
const WCOL = vec3f(.12, .44, .48);
// the sunlight under the surface: strong, a little warm
const SUNC = vec3f(2.4, 2.2, 1.6);
// the light from all around: aquamarine, and the little left in the dark
const AMB = vec3f(.18, .50, .54);
const AMB0 = vec3f(.004, .012, .014);
// what the shafts of light add to the colour of the water
const RAYC = vec3f(.06, .05, .01);
// drifting particles: a few, and shell grit near the floor
const SNOWC = vec3f(.8, .9, .8);
const DRIFT = vec3f(.10, -.05, .08);
const SNOWZ = vec2f(.005, .022);
// how far the haze takes its brightness from the skylight
const SKYD = 60.;
const SKYO = .8;
// the overhead surface glow
const GLOW = vec3f(.52, .70, .60);
// the pale lime mud of the sea floor
const MUD0 = vec3f(.32, .31, .27);
const MUD1 = vec3f(.44, .42, .36);
// translucency of thin living things (stage 1 has none, the constant stays for the shader)
const TRANS = 1.;
// one kind of water: the second one is the same
const SIGZ = SIG;
const KDZ = KD;
const KDF = KD;
const PCOL = WCOL;
const AMBZ = AMB;
const RAYCZ = RAYC;
`;
// LIGHT: the flecks of sunlight are clearer and tighter than in the deep Cambrian: the surface is 10 to 25 m above
// the floor. Overhead a bright wavy surface with the sun in it. Near the surface things fade into it (veil). The
// drifting particles light up in the shafts (snowLit)
const LIGHT = /*wgsl*/`
fn fleck(p: vec3f) -> f32 {
  let q = cuv(p);
  return ss(.28, .68, textureSampleLevel(tW, sR, q / 20., 2.).r)
       * ss(.20, .58, textureSampleLevel(tW, sR, q.yx / 9. + .3, 2.).r);
}
fn fleck2(p: vec3f) -> f32 {
  let q = cuv(p); let t = g.cam.w;
  let a = textureSampleLevel(tD, sR, q / 28. + vec2f(t * .003, t * .0018), 0.).a;
  let b = textureSampleLevel(tD, sR, q.yx / 12. + vec2f(.37 - t * .004, t * .003), 0.).a;
  return ss(.38, .68, a) * ss(.30, .64, b);
}
fn caus(p: vec3f, d: f32) -> vec3f { return vec3f(mix(.58 + .92 * fleck2(p), .68, ss(50., 120., d))); }
fn caus2(p: vec3f, d: f32) -> f32 { return mix(.58 + .92 * fleck2(p), .68, ss(50., 120., d)); }
fn snowLit(p: vec3f) -> f32 { return (.08 + 4. * fleck(p)) * ss(18., 5., distance(p, g.cam.xyz)); }
fn above(wp: vec3f, z: f32) -> vec3f {
  let V = normalize(wp - g.cam.xyz); let sd = max(dot(V, g.sun.xyz), 0.);
  let q = wp.xz;
  let s = textureSampleLevel(tW, sR, q / 35., 2.).r * .6
        + textureSampleLevel(tW, sR, q.yx / 14. + .4, 2.).r * .4;
  return GLOW * (.8 + .8 * s) * (.3 + .8 * sd * sd)
       + vec3f(1., .95, .8) * (pow(sd, 8.) * 2. + pow(sd, 60.) * 5.);
}
fn veil(c: vec3f, wp: vec3f) -> vec3f { return mix(c, GLOW * .45, ss(-4., -.5, wp.y)); }
`;
