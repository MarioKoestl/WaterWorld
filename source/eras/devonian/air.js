// ============================================================================
// devonian: water and light
// ============================================================================
// Olive-green open water over the Cleveland Shale, about 360 Ma. Thick with plankton near the surface, brownish and
// dim below 30 m, nearly black at the floor. Visibility about 30 m near the surface, 15 m near the floor.
// See today's air.js for what the engine reads from AIR and LIGHT.
const AIR = /*wgsl*/`
// how much light the water scatters (SIG) and swallows (KD) per metre: olive-green water, murkier than today's.
// Green scatters and absorbs least, so green light travels furthest: the far distance is green
const SIG = vec3f(.048, .030, .042);
const KD = vec3f(.052, .020, .038);
// the colour of the water itself: olive green
const WCOL = vec3f(.10, .28, .15);
// the colour of the sunlight under the surface: golden warm, strong
const SUNC = vec3f(2.8, 2.2, 1.0);
// the light that comes from all around: a cool olive green, and the deep dark near the floor
const AMB = vec3f(.10, .28, .18);
const AMB0 = vec3f(.002, .006, .004);
// what the shafts of light add to the colour of the water: golden green
const RAYC = vec3f(.08, .06, .01);
// drifting particles (marine snow, dead plankton): green-brown tint, sinking slowly, larger than the Cambrian's
const SNOWC = vec3f(.8, .7, .3);
const DRIFT = vec3f(.03, -.10, .02);
const SNOWZ = vec2f(.005, .015);
// how far the haze takes its brightness from the skylight: about 30 m (how far one sees near the surface)
const SKYD = 30.;
const SKYO = .5;
// the sky seen through the surface from below, and the sun in it
const SKY = vec3f(.22, .50, .28);
const SUNG = vec3f(.90, .80, .50);
// one kind of water: the second zone is the same
const SIGZ = SIG;
const KDZ = KD;
const KDF = KD;
const PCOL = WCOL;
const AMBZ = AMB;
const RAYCZ = RAYC;
`;
// LIGHT: strong flecks near the surface that fade quickly with depth (gone by 25 m). Particles glow in the shafts
// only in the upper water. The surface is a bright green window. A faint milky layer lies just above the floor
const LIGHT = /*wgsl*/`
fn caus(p: vec3f, d: f32) -> vec3f {
  let q = cuv(p);
  let o = vec2f(.003, .002);
  let a = vec3f(textureSample(tW, sR, q / 4.2 + o).r, textureSample(tW, sR, q / 4.2).r, textureSample(tW, sR, q / 4.2 - o).r);
  let b = textureSample(tW, sR, q.yx / 8.5 + .3).r;
  let c = min(pow(a, vec3f(2.2)) * 4.5 * (.45 + b * 1.1), vec3f(3.5));
  return mix(c, vec3f(.33), ss(8., 25., d));
}
fn caus2(p: vec3f, d: f32) -> f32 {
  let q = cuv(p);
  let c = min(pow(textureSample(tW, sR, q / 5.3).r, 1.5) * 2.4, 2.5);
  return mix(c, .33, ss(8., 25., d));
}
fn snowLit(p: vec3f) -> f32 {
  let q = cuv(p);
  let f = ss(.3, .7, textureSampleLevel(tW, sR, q / 22., 2.5).r) * ss(.2, .6, textureSampleLevel(tW, sR, q.yx / 10. + .3, 2.).r);
  return (.08 + 4.5 * f) * ss(14., 4., distance(p, g.cam.xyz)) * ss(-28., -4., p.y);
}
fn above(wp: vec3f, z: f32) -> vec3f {
  let v = wp - g.cam.xyz; let d = length(v); let V = v / d;
  let fl = ss(200., 50., d);
  let s = (textureSample(tW, sR, wp.xz / 14.).ba + textureSample(tW, sR, wp.zx / 5.5 + .2).ba * .7 + textureSample(tW, sR, wp.xz / 38. + .5).ba * .6) * fl;
  let n = normalize(vec3f(-s.x * .7, -1., -s.y * .7));
  let ci = sat(dot(V, -n));
  let k = 1. - 1.769 * (1. - ci * ci);
  let win = ss(0., .2, k);
  let rr = refract(V, n, 1.33);
  let sd = max(dot(rr, g.sun.xyz), 0.);
  let fr = pow(1. - sqrt(max(k, 0.)), 5.);
  let sky = (SKY * 1.3 * clamp(1. + 3.2 * (s.x * .6 - s.y * .8), .3, 2.5) + SUNG * (pow(sd, 50.) * 1.5 + pow(sd, 400.) * 10.)) * (1. - fr);
  let R = reflect(V, n);
  let refl = fogIn(wp, R, 250., z, g.sun.xyz) * 1.1;
  return mix(refl, sky, win);
}
fn veil(c: vec3f, wp: vec3f) -> vec3f {
  let f = ss(-40., -44., wp.y);
  return mix(c, c * vec3f(.8, .85, .75) + vec3f(.008, .010, .006), f * .35);
}
`;
