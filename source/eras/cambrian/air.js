// ============================================================================
// cambrian: water and light
// ============================================================================
// Golden green (docs/briefs/cambrian-look.md, mood B, Mario's pick): warm green water, clear near and deep far, a low
// golden sun that comes along the wall, long shafts down the basin beside it, soft flecks where they land, and the
// drifting snow glowing in them. The real basin was probably dim: this light is a liberty, and the menu text says so.
// How it looked is not known from fossils. See today's air.js for what the engine reads from AIR and LIGHT.
const AIR = /*wgsl*/`
// how much light the water scatters (SIG) and swallows (KD) per metre, for red, green and blue. Little scatter: near
// things keep their colour (the milky veil is gone), yet enough for the shafts to stand in the water. Red is
// swallowed most, then blue: the light that is left deep down and far off is green, darker and cooler than the gold
// of the sun near the light
const SIG = vec3f(.027, .019, .022);
const KD = vec3f(.023, .017, .024);
// the colour of the water itself: a deep green with some blue in it. It is dark, so that what is far off sinks into
// a deep green and not into a pale veil, and cool, so that the gold of the sun has something to stand against
const WCOL = vec3f(.11, .31, .25);
// the light from above: gold (red is swallowed on its long way down, so it starts out strong), and it wins against
// the light from all around
const SUNC = vec3f(6.4, 3.2, 1.2);
// the light that comes from all around: a cool green, and weak, so that shadows are deep but not blind; and the
// little that is left of it in the deepest dark
const AMB = vec3f(.15, .40, .40);
const AMB0 = vec3f(.006, .014, .012);
// what the shafts of light add to the colour of the water: gold
const RAYC = vec3f(.16, .10, -.04);
// the drifting particles, mud and marine snow: the tint of some of them, how they sink, in metres per second, and
// how large they are: no flake larger than the smallest animal (1.5 to 5 mm; the smallest Hallucigenia is 12 mm).
// They light up where a shaft is (snowLit below)
const SNOWC = vec3f(1.5, 1.3, .8);
const DRIFT = vec3f(.05, -.08, .03);
const SNOWZ = vec2f(.0015, .0035);
// how far along a view the haze takes its brightness from the skylight there: about as far as one sees clearly. A
// wall further away than that does not darken the water in front of it at all (SKYO)
const SKYD = 45.;
const SKYO = 1.;
// the far window of light overhead, where the surface would be
const GLOW = vec3f(.62, .72, .38);
// the mud of the basin, from its dark to its pale: nearly grey, so that it takes the colour of the light that falls
// on it (gold in the sun, green in the shade) and has none of its own (look.js)
const MUD0 = vec3f(.30, .29, .26);
const MUD1 = vec3f(.44, .43, .39);
// how much of the sun comes through what is thin and alive: the cups of the tulip animals, sponges, jellyfish
const TRANS = 1.8;
// the cups of the tulip animals, from one to another: rose, so that they stand out from the green light
const CUP0 = vec3f(.66, .25, .34);
const CUP1 = vec3f(.74, .38, .44);
// this world has one kind of water: the second one of the engine is the same. (So the channel of the ground map that
// says where the second water is is free here: it holds how dense a garden stands, see look.js)
const SIGZ = SIG;
const KDZ = KD;
const KDF = KD;
const PCOL = WCOL;
const AMBZ = AMB;
const RAYCZ = RAYC;
`;
// LIGHT: the flecks of sunlight are soft, broad and slow (caus, caus2): this surface is far away. The drifting snow
// lights up inside a shaft (snowLit, with fleck: the pattern of the engine's shafts, W_RAYS in shaders.js: change
// one, change the other). Overhead a far window of light,
// brightest where the sun stands (above). Only the last metres under it fade into it (veil): the top of the wall
// stands dark against the light
const LIGHT = /*wgsl*/`
fn fleck(p: vec3f) -> f32 {
  let q = cuv(p);
  return ss(.3, .7, textureSampleLevel(tW, sR, q / 27., 2.5).r) * ss(.15, .6, textureSampleLevel(tW, sR, q.yx / 11. + .3, 2.).r);
}
// On the ground: pools of light with wide, soft rims that wander slowly, on mud that is evenly lit between them.
// The pools are the smaller part of the ground. (The pattern of the shafts will not do here: it is bright nearly
// everywhere with dark veins, and dark veins on bright mud read as the shadows of something that floats over it.)
// Two looks at the mottling of the detail texture, drifting against each other
fn fleck2(p: vec3f) -> f32 {
  let q = cuv(p); let t = g.cam.w;
  let a = textureSampleLevel(tD, sR, q / 46. + vec2f(t * .0021, t * .0012), 0.).a;
  let b = textureSampleLevel(tD, sR, q.yx / 19. + vec2f(.37 - t * .0034, t * .0026), 0.).a;
  return ss(.44, .74, a) * ss(.36, .7, b);
}
fn caus(p: vec3f, d: f32) -> vec3f { return vec3f(mix(.62 + .8 * fleck2(p), .7, ss(60., 140., d))); }
fn caus2(p: vec3f, d: f32) -> f32 { return mix(.62 + .8 * fleck2(p), .7, ss(60., 140., d)); }
// (far away a flake is a point of one pixel, and many lit points on a dark wall read as a sky of stars: the flakes
// light up within some metres of the eye, where they have a size)
fn snowLit(p: vec3f) -> f32 { return (.06 + 5. * fleck(p)) * ss(16., 5., distance(p, g.cam.xyz)); }
// (the window is bright towards the sun and dim away from it. Lit evenly all round, it lays a pale, blank veil over
// every view that looks up into open water with the sun behind the viewer)
fn above(wp: vec3f, z: f32) -> vec3f {
  let V = normalize(wp - g.cam.xyz); let sd = max(dot(V, g.sun.xyz), 0.);
  let q = wp.xz;
  let s = textureSampleLevel(tW, sR, q / 60., 2.).r * .6 + textureSampleLevel(tW, sR, q.yx / 23. + .4, 2.5).r * .4;
  return GLOW * (.7 + .9 * s) * (.2 + .9 * sd * sd) + vec3f(1., .85, .5) * (pow(sd, 6.) * 2.5 + pow(sd, 60.) * 6.);
}
fn veil(c: vec3f, wp: vec3f) -> vec3f { return mix(c, GLOW * .4, ss(-5., -.5, wp.y)); }
`;
