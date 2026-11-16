// ============================================================================
// cambrian: water and light
// ============================================================================
// Green dusk in a deep basin: jade water, a little milky from drifting mud, soft light from far above and no surface
// to see. How it looked is not known from fossils. See today's air.js for what the engine reads from AIR and LIGHT.
// One unit of this world is 5 cm (the player is 20 times smaller than a diver), so "per metre" is per unit here.
const AIR = /*wgsl*/`
// how much light the water scatters (SIG) and swallows (KD) per unit, for red, green and blue
const SIG = vec3f(.044, .028, .033);
const KD = vec3f(.028, .021, .026);
// the colour of the water itself
const WCOL = vec3f(.36, .76, .54);
// the light from above. It is weak beside the light from all around, which makes everything soft and even
const SUNC = vec3f(1., 1.05, .95);
// the light that comes from all around, and the little that is left of it in the deepest dark
const AMB = vec3f(1.3, 1.5, 1.38);
const AMB0 = vec3f(.010, .028, .022);
// what the faint shafts of light add to the colour of the water
const RAYC = vec3f(.05, .08, .05);
// the drifting particles, mud and marine snow: the tint of some of them, and how they sink, in units per second
const SNOWC = vec3f(.85, 1., .8);
const DRIFT = vec3f(.05, -.11, .03);
// how far along a view the haze takes its brightness from the skylight there: about as far as one sees clearly. A
// wall further away than that does not darken the water in front of it at all (SKYO)
const SKYD = 45.;
const SKYO = 1.;
// the pale glow overhead, where the surface would be
const GLOW = vec3f(.62, 1., .78);
// this world has one kind of water: the second one of the engine is the same
const SIGZ = SIG;
const KDZ = KD;
const KDF = KD;
const PCOL = WCOL;
const AMBZ = AMB;
const RAYCZ = RAYC;
`;
// LIGHT: no flecks of sunlight this deep (caus, caus2). Overhead there is no surface, only the glow (above). And
// everything that reaches up fades into that glow, so the wall has no top (veil): the further away, the lower down
// it starts to, in a ragged band and not along a line, and all of it in the last units under the glow
const LIGHT = /*wgsl*/`
fn caus(p: vec3f, d: f32) -> vec3f { return vec3f(.33); }
fn caus2(p: vec3f, d: f32) -> f32 { return .33; }
fn above(wp: vec3f, z: f32) -> vec3f { return GLOW; }
fn veil(c: vec3f, wp: vec3f) -> vec3f {
  let rag = textureSampleLevel(tD, sR, wp.xz * .009 + wp.y * .004, 0.).a + .5 * textureSampleLevel(tD, sR, wp.zx * .031 + wp.y * .011, 0.).a;
  let far = 1. - exp(-distance(wp, g.cam.xyz) * .04);
  return mix(c, GLOW, max(ss(-20., -3., wp.y + (rag - .75) * 9.) * far, ss(-6., -.5, wp.y)));
}
`;
