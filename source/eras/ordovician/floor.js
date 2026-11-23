// ============================================================================
// ordovician: the sea floor
// ============================================================================
// A wide, gently rolling shelf of pale lime mud, 10 to 25 m deep, with low ledges of grey limestone a metre or two
// high. No wall, no canyon: the view ends in the haze in every direction. The ledges are where a broad noise
// exceeds a threshold: the harder limestone beds show through the mud there. See today's floor.js for what the
// engine reads from FLOOR.

// the height of the floor at a place, for the ground map and for scattering (approximation: the density function
// below adds roughness on the limestone that this does not)
const floorH = (x, z) => {
  let h = -16 + 3 * (fbm(x * 0.014, z * 0.014, 3, 3) - 0.5) + 0.8 * (fbm(x * 0.048, z * 0.048, 7, 2) - 0.5);
  const lf = fbm(x * 0.028, z * 0.028, 11, 3);
  h += 1.6 * sstep(0.52, 0.66, lf);
  h -= 10 * sstep(110, 160, hypot(x, z));
  return h;
};
// how much of a place is limestone (0 to 1), for the ground map
const ledgeAt = (x, z) => sstep(0.52, 0.66, fbm(x * 0.028, z * 0.028, 11, 3));

const FLOOR = {
  prims: new Float32Array(8),
  counts: [0, 0, 0, 0],
  wgsl: /*wgsl*/`
fn dens(p: vec3f) -> f32 {
  let w = vec3f(fbm(p * .06 + 11., 3), fbm(p * .06 + 47., 3), fbm(p * .06 + 83., 3)) - .5;
  // wide, gently rolling shelf
  var h = -16. + 3. * (fbm(vec3f(p.xz * .014, 3.), 3) - .5)
         + .8 * (fbm(vec3f(p.xz * .048, 7.), 2) - .5);
  // limestone ledges: where a broad noise exceeds a threshold the harder beds show through the mud
  let lf = fbm(vec3f(p.xz * .028, 11.), 3);
  h += 1.6 * ss(.52, .66, lf);
  // the floor sinks at the edges of the world
  h -= 10. * ss(110., 160., length(p.xz));
  var d = h - p.y;
  // rock primitives (counts are zero in stage 1, but P must be referenced so the binding stays in the auto layout)
  var k = 0u;
  for (var i = 0u; i < u.c.x; i++) { let a = P[k]; let b = P[k + 1u]; k += 2u; d = smax(d, b.w - seg3(p, a.xyz, b.xyz), a.w); }
  // roughness: on the limestone a little rough and bedded, the mud smooth
  let rk = ss(.0, .8, 1.6 * ss(.52, .66, lf));
  d += rk * (.3 * (.5 - wor(p * .24 + w * 2.)) + .15 * (fbm(p * .32, 2) - .5));
  d += rk * .15 * (abs(fract(p.y * .5 + w.y * 2.) - .5) - .25);
  return min(d, 2. - p.y);
}
`,
};
