// ============================================================================
// today: water and light
// ============================================================================
// AIR: the colours of the water and of the light, as constants for every shader of the page. An era has to define all
// of them. This world has two kinds of water: the open sea and the purple grotto. The constants that end in Z are
// those of the grotto, and z in the shaders is the share of grotto water at a place.
const AIR = /*wgsl*/`
// how much light the water scatters (SIG) and swallows (KD) per metre, for red, green and blue
const SIG = vec3f(.058, .0235, .0195);
const KD = vec3f(.056, .0245, .0170);
// the colour of the water itself
const WCOL = vec3f(.16, .58, .90);
const KDZ = vec3f(.034, .023, .018);
const PCOL = vec3f(.58, .66, .98);
// the colour of the sunlight under the surface
const SUNC = vec3f(1.7, 1.6, 1.45);
// swallowing of the light that the haze of the grotto scatters towards the eye
const KDF = vec3f(.043, .045, .042);
const SIGZ = vec3f(.034, .026, .022);
// the light that comes from all around: its colour, and the little that is left of it in the deepest dark (AMB0)
const AMB = vec3f(.22, .60, .80);
const AMBZ = vec3f(.34, .56, .82);
const AMB0 = vec3f(.003, .010, .016);
// what the shafts of light add to the colour of the water
const RAYC = vec3f(.04, .07, .05);
const RAYCZ = vec3f(.28, .16, .12);
// the tint of some of the drifting particles, and where they drift, in metres per second
const SNOWC = vec3f(.7, 1., .9);
const DRIFT = vec3f(.22, .05, .13);
// how far along a view the haze still takes its brightness from the skylight there (further out it is taken at
// this distance): about as far as one sees
const SKYD = 150.;
// 1: what lies further away than that does not shade the haze in front of it at all. 0: it does, as here
const SKYO = 0.;
// the sky seen through the surface from below, and the sun in it (for above() below, the engine does not use them)
const SKY = vec3f(.30, .78, 1.);
const SUNG = vec3f(1., .95, .85);
`;
// LIGHT: the functions of the light, which an era has to define all four of.
// caus, caus2: the flecks of sunlight that the waves throw on everything, from the animated water texture tW (see
//   W_WATER): caus for solid things, caus2 for leaves. An era without flecks returns the even value .33 from both.
// above: what is over the world. The engine draws a plane at the height 0 and asks for its colour where the view meets
//   it (wp), before the haze. Here the water surface seen from below: the sky through the window overhead, around it
//   the reflection of the deep, and waves.
// veil: what lies over the colour c of a thing at wp before the haze. Here nothing.
const LIGHT = /*wgsl*/`
fn caus(p: vec3f, d: f32) -> vec3f {
  let q = cuv(p);
  let o = vec2f(.004, .0025);
  let a = vec3f(textureSample(tW, sR, q / 3.3 + o).r, textureSample(tW, sR, q / 3.3).r, textureSample(tW, sR, q / 3.3 - o).r);
  let b = textureSample(tW, sR, q.yx / 6.9 + .37).r;
  let c = min(pow(a, vec3f(2.3)) * 5. * (.45 + b * 1.3), vec3f(4.));
  return mix(c, vec3f(.33), ss(35., 100., d));
}
fn caus2(p: vec3f, d: f32) -> f32 {
  let q = cuv(p);
  let c = min(pow(textureSample(tW, sR, q / 4.1).r, 1.4) * 2.6 * (.45 + textureSample(tW, sR, q.yx / 6.9 + .37).r * 1.3), 2.6);
  return mix(c, .33, ss(35., 100., d));
}
fn above(wp: vec3f, z: f32) -> vec3f {
  let v = wp - g.cam.xyz; let d = length(v); let V = v / d;
  let fl = ss(260., 60., d);
  let s = (textureSample(tW, sR, wp.xz / 13.).ba + textureSample(tW, sR, wp.zx / 4.7 + .2).ba * .7 + textureSample(tW, sR, wp.xz / 37. + .6).ba * .8) * fl;
  let n = normalize(vec3f(-s.x * .8, -1., -s.y * .8));
  let ci = sat(dot(V, -n));
  let k = 1. - 1.769 * (1. - ci * ci);
  let win = ss(0., .22, k);
  let rr = refract(V, n, 1.33);
  let sd = max(dot(rr, g.sun.xyz), 0.);
  let fr = pow(1. - sqrt(max(k, 0.)), 5.);
  let sky = (SKY * 1.3 * clamp(1. + 3.8 * (s.x * .6 - s.y * .8), .25, 3.) + SUNG * (pow(sd, 60.) * 1.3 + pow(sd, 500.) * 12.)) * (1. - fr);
  let R = reflect(V, n);
  let refl = fogIn(wp, R, 300., z, g.sun.xyz) * 1.15;
  return mix(refl, sky, win);
}
fn veil(c: vec3f, wp: vec3f) -> vec3f { return c; }
`;
