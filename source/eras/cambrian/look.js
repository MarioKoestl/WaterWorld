// ============================================================================
// cambrian: what surfaces and leaves look like
// ============================================================================
// See today's look.js for what the engine reads from LOOK and what a piece can use.
// Materials: 0 terrain and 1 loose rock. Both are the dark, bedded rock of the reef with pale crusts and, where the
// light reaches, dark crusts of algae. On everything flat enough lies mud: pale grey-green, smooth, paler where a
// tongue of it has slid down not long ago (the red channel of the ground map gm) and darker in the hollows of the
// plain (its alpha channel says where the ground is the mud of the basin, its green channel where a fallen block
// lies). 2 the tulip animal: a pale stalk and a dusky rose cup in six parts (i.ao, the aux of its mesh, says how far
// up the animal a place is). 3 the sponge: ochre tubes with dark throats (i.ao is how light a place is).
// Colours are free: no fossil shows them. They are kept quiet.
// Leaves: the threads of the algae, a dull olive-brown, a few of them red-brown, hair-fine and as wide at the tip as
// at the root. Type 0: the short threads that lie on a mat. Type 1: the long limp threads of the tufts (the engine's
// type for what casts no shadow and is not thinned out by the engine: a thread is far too fine for the shadow a
// leaf would cast).
const LOOK = {
  mats: /*wgsl*/`
  let big = textureSample(tD, sR, i.op.xz * .013 + i.op.y * .021).a;
  let big2 = textureSample(tD, sR, i.op.zx * .031 + i.op.y * .043 + .37).a;
  let gm = textureSample(tM, sC, i.wp.xz / 384. + .5);
  // its alpha: 0 off the basin, from one half up the mud of the basin, and above that how much of an algae mat lies there
  let basinA = ss(.2, .45, gm.a); let matA = sat((gm.a - .5) * 2.);
  // two more looks at the mottling, each turned and scaled its own way: mixed, they do not repeat in a grid as one
  // sample of a tiling texture does (for the rims of mud and mats, which would show that grid as rows of dots)
  let nz = textureSample(tD, sR, vec2f(i.wp.x * .31 + i.wp.z * .13, i.wp.z * .29 - i.wp.x * .17)).a * .55 + textureSample(tD, sR, vec2f(i.wp.x * .83 - i.wp.z * .41, i.wp.z * .79 + i.wp.x * .47) + .37).a * .45;
  let ca = caus(i.wp, dist);
  var hgt = A.h * .4 + B.h * .4 + C.h * .2;
  var bump = .85; var gloss = .08; var alb = vec3f(0.); var sgro = 0.; var flu = 0.; var vao = 1.;
  let emi = vec3f(0.); let rip = 0.;
  if (mat <= 1) {
    // the beds of the rock lie nearly level: little of the flowing pattern of the textures in them
    let st = i.op.y * .5 + A.h * .4 + big * 2.5 + big2 * 1.2;
    let bd = hs(floor(st)); let sf = fract(st);
    alb = mix(vec3f(.060, .075, .068), vec3f(.19, .20, .165), sat(A.c * 1.5 - .25));
    alb = mix(alb, mix(vec3f(.12, .115, .085), vec3f(.085, .12, .10), bd), ss(.42, .66, big) * .7);
    // (the fine lines between the beds fade with the distance: they would flicker far away)
    let lines = ss(.12, .0, sf) * (1. - abs(on.y)) * ss(70., 30., dist);
    alb *= mix(.72, 1.15, bd) * (1. - .45 * lines);
    alb = mix(alb, vec3f(.34, .36, .29) * (.5 + .7 * C.h), ss(.60, .70, B.c * .6 + C.c * .5) * .45);
    // crusts of algae, green and here and there dark red, not on the undersides
    let cr = ss(.50, .66, big2 * .55 + B.c * .5) * ss(-.35, .4, n0.y);
    alb = mix(alb, mix(vec3f(.028, .085, .045), vec3f(.085, .032, .036), ss(.52, .64, A.c)) * (.6 + .8 * B.h), cr * .6);
    alb *= (.42 + .95 * hgt) * mix(1., .62 + .76 * F.h, fk);
    sgro = -lines * 1.2;
    // loose stones are dusty: lighter than the wall they broke off
    alb *= select(1., 1.3, mat == 1);
    // the mud thins out to a ragged dusting where the rock gets steep (not on level ground: there is only mud there)
    // Only on what is nearly level, thinning out to a ragged dusting where the rock gets steep (not on level ground:
    // there is only mud there). Thin on the fallen blocks (the green channel of gm), and up on the ledges of the wall
    // an older, darker layer than down on the plain. Mud has no crevices: its height for the lighting is even
    // The ground of the basin (the alpha channel of gm, below the lowest ledges) is mud however steep it lies.
    // (the edge of the mud is ragged down to the finest grain: without that it would run in straight lines from
    // corner to corner of the mesh)
    let rag = ((big2 - .5) * .5 + (nz - .5) * .7 + (F.c - .5) * .25 * fk) * (1. - ss(.9, .99, n0.y));
    let basin = basinA * (1. - gm.g) * ss(-36., -39., i.wp.y) * ss(.2, .5, n0.y + rag * .6) * f32(mat == 0);
    let flt = max(ss(.82, .98, n0.y + rag) * select(.6, 1., mat == 0) * (1. - .6 * gm.g), basin);
    var mud = mix(vec3f(.28, .31, .245), vec3f(.405, .43, .34), sat(big * 1.3 - .15 + (B.c - .5) * .5));
    mud = mix(mud, vec3f(.46, .48, .39), gm.r * .7) * (.93 + .12 * C.c) * mix(1., .88 + .24 * F.c, fk);
    mud *= mix(.8, 1.08, ss(-49., -42., i.wp.y)) * mix(1., .7, ss(-40., -32., i.wp.y)) * (1. - .3 * gm.g);
    // where an algae mat lies the mud is stained dark, a slimy olive-brown, with pale mud showing through at its
    // ragged rim and in small holes: the threads grow out of that
    let slime = ss(.2, .55, matA + (nz - .5) * .7) * ss(.36, .46, nz + matA * .12) * basin;
    mud = mix(mud, vec3f(.070, .072, .045) * (.75 + .5 * B.c) * mix(1., .85 + .3 * F.c, fk), slime * .92);
    alb = mix(alb, mud, flt);
    hgt = mix(hgt, .7, flt); bump = mix(bump, .12, flt); gloss = mix(mix(gloss, .03, flt), .22, slime); sgro *= 1. - flt;
  } else if (mat == 2) {
    // where on the animal: its own space, without the offset that the seed gives the textures
    let lp = i.op - sd * 37.;
    let cup = ss(.72, .78, i.ao);
    let part = .5 + .5 * cos(6. * atan2(lp.z, lp.x));
    let rose = mix(vec3f(.60, .30, .30), vec3f(.68, .45, .36), fract(sd * 7.3)) * (.62 + .38 * part) * mix(1., .5, ss(.965, 1., i.ao));
    alb = mix(vec3f(.36, .36, .28), rose * mix(.72, 1., ss(.76, .86, i.ao)), cup) * (.88 + .18 * B.c);
    hgt = .7; bump = mix(.3, .12, cup); gloss = .1 + .25 * cup; flu = .45 * cup;
  } else {
    alb = mix(vec3f(.46, .33, .13), vec3f(.50, .25, .12), fract(sd * 5.7)) * (.88 + .16 * B.c) * (.9 + .14 * C.h) * (.12 + .88 * i.ao);
    hgt = .7; vao = .4 + .6 * i.ao; bump = .7; gloss = .12; flu = .3;
  }
`,
  // nothing sparkles here
  pal: /*wgsl*/`
fn pal(h: f32) -> vec3f { return vec3f(.6, 1., .8); }
`,
  types: /*wgsl*/`
    case 1 { col = mix(mix(vec3f(.12, .125, .07), vec3f(.155, .15, .075), s1), vec3f(.19, .11, .07), step(.72, s2)); pr = vec4f(0., .9, 0., 0.); shp = vec2f(.3, .06); wav = 0.; fls = .5; }
    default { col = mix(mix(vec3f(.11, .112, .062), vec3f(.145, .14, .07), s1), vec3f(.18, .10, .065), step(.9, s2)); pr = vec4f(0., .8, 0., 0.); shp = vec2f(.3, .06); wav = 0.; fls = .5; }
`,
};
