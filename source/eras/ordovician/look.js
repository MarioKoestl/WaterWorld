// ============================================================================
// ordovician: what surfaces and leaves look like
// ============================================================================
// See today's look.js for what the engine reads from LOOK and what a piece can use.
// Materials: 0 terrain and 1 loose stone. The floor is pale lime mud where it is flat, and grey limestone where
// ledges show through. The ground map (gm.a) says how much limestone a place has. Shell debris is scattered on the
// mud as lighter patches. No living material in stage 1.
const LOOK = {
  mats: /*wgsl*/`
  let gm = textureSample(tM, sC, i.wp.xz / 384. + .5);
  let big = textureSample(tD, sR, i.op.xz * .012 + i.op.y * .02).a;
  let big2 = textureSample(tD, sR, i.op.zx * .03 + i.op.y * .04 + .37).a;
  let nz = textureSample(tD, sR, vec2f(i.wp.x * .28 + i.wp.z * .12, i.wp.z * .26 - i.wp.x * .15)).a * .55
         + textureSample(tD, sR, vec2f(i.wp.x * .78 - i.wp.z * .38, i.wp.z * .74 + i.wp.x * .44) + .37).a * .45;
  let ca = caus(i.wp, dist);
  var hgt = A.h * .4 + B.h * .4 + C.h * .2;
  var bump = .6; var gloss = .04; var alb = vec3f(0.); var sgro = 0.; var flu = 0.; var vao = 1.;
  var emi = vec3f(0.); let rip = 0.;
  if (mat <= 1) {
    // how much limestone (from the ground map and from the steepness of the face)
    let steep = 1. - n0.y;
    let rock = ss(.08, .45, gm.a + steep * .5);
    // pale lime mud
    var mud = mix(MUD0, MUD1, sat(big * 1.3 - .15 + (B.c - .5) * .4));
    mud *= .92 + .14 * C.c;
    // grey limestone
    var lm = mix(vec3f(.22, .22, .20), vec3f(.32, .32, .28), sat(A.c * 1.5 - .25));
    let bd = hs(floor(i.op.y * .5 + A.h * .4 + big * 2.5));
    lm *= mix(.78, 1.12, bd);
    // the fine lines between beds, fading with distance
    let st = i.op.y * .5 + A.h * .4 + big * 2.5 + big2 * 1.2;
    let lines = ss(.12, .0, fract(st)) * (1. - abs(n0.y)) * ss(50., 25., dist) * rock;
    alb = mix(mud, lm, rock);
    alb *= 1. - .35 * lines;
    // shell debris: lighter patches on the mud
    let shells = ss(.55, .72, big2 * .6 + C.c * .5) * (1. - rock);
    alb = mix(alb, MUD1 * 1.12, shells * .25);
    // storm beds: a broader, slightly darker patch where the nz noise is high and the floor is flat
    let storm = ss(.62, .78, nz) * ss(.85, .95, n0.y) * (1. - rock) * .2;
    alb = mix(alb, MUD0 * .88, storm);
    alb *= (.5 + .82 * hgt) * mix(1., .7 + .6 * F.h, fk);
    // loose stones are dusty: a little lighter
    alb *= select(1., 1.15, mat == 1);
    bump = mix(.12, .65, rock);
    hgt = mix(.7, hgt, rock);
  }
`,
  pal: /*wgsl*/`
fn pal(h: f32) -> vec3f { return vec3f(.8, .9, .85); }
`,
  types: /*wgsl*/`
    default { col = vec3f(.30, .28, .22); pr = vec4f(0., .8, 0., 0.); shp = vec2f(.3, .06); wav = 0.; fls = .5; }
`,
};
