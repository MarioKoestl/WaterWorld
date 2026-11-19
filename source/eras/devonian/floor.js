// ============================================================================
// devonian: the sea floor
// ============================================================================
// FLOOR: flat black mud about 45 m under the surface, with very low swells. No rock, no reef, no life on the floor.
// See today's floor.js for what the engine reads from FLOOR.

const FLOOR = {
  prims: new Float32Array(8), counts: [0, 0, 0, 0],
  wgsl: /*wgsl*/`
fn dens(p: vec3f) -> f32 {
  _ = P[0];
  // gentle swells of the mud plain, about half a metre
  let sw = (fbm(vec3f(p.xz * .012, 3.), 3) - .5) * .9;
  let g0 = -45. + sw;
  // a very faint texture: soft mud, not rock
  let d = g0 - p.y + (.5 - fbm(p * .15, 2)) * .12;
  return min(d, 1. - p.y);
}
`,
};
