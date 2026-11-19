// ============================================================================
// devonian: what surfaces and leaves look like
// ============================================================================
// See today's look.js for what the engine reads from LOOK. Material 0 is the terrain (black mud).
const LOOK = {
  mats: /*wgsl*/`
  let ca = caus(i.wp, dist);
  let hgt = A.h * .5 + B.h * .35 + C.h * .15;
  var sgro = 0.; var bump = .15; var gloss = .4; var alb = vec3f(0.); var emi = vec3f(0.); var vao = 1.; var flu = 0.;
  // black mud: nearly uniform dark, smooth and wet, slight warm tone where the texture has height
  alb = mix(vec3f(.02, .02, .018), vec3f(.04, .038, .03), hgt);
  alb *= .4 + .7 * B.h;
  let rip = 0.;
`,
  pal: /*wgsl*/`
fn pal(h: f32) -> vec3f { return vec3f(.5); }
`,
  types: /*wgsl*/`
    default { col = vec3f(.1); pr = vec4f(0.); spc = vec3f(.5); shp = vec2f(.5); }
`,
};
