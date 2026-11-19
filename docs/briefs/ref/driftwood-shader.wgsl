// ============================================================================
// Reference shaders for the driftwood (brief: docs/briefs/driftwood-build.md)
// ============================================================================
// Not loaded by the build. This is the whole text of S_WOOD for source/eras/devonian/driftwood.js, for the mesh of
// docs/briefs/ref/driftwood-mesh.js. It needs what W_ANIM gives (ss, sat, hs, vn, fbm, zone, fog, fin, caus, amb,
// sunE, vol, shadow1). This text has not been compiled: run node tools/wgsl.mjs devonian first.
// Instance (unchanged): a.xyz = centre of the circle it drifts on (floating) or its place (sunk), a.w = radius of the
// circle (floating) or yaw (sunk). b.x = phase (floating) or tilt (sunk), b.y = drift speed (> 0 floating, 0 sunk),
// b.z = size, b.w = seed. zooDrift repeats the path: it does not change.
// lt carries aux (the shadow of the sun is taken in the fragment shader), and sd carries the seed plus 10 for a sunk
// log. v3 (2026-11-19, driftwood-matte.md): the bark furrows are in the mesh (woodFurrow repeats them), the wood is
// matte, the furrows and cracks lie in shade.

// where each crinoid holds on to the log (x, y, z in metres, read off the mesh) and how long its stem is (w)
fn woodCri(k: i32) -> vec4f {
  var C = array<vec4f, 6>(vec4f(.077, -.236, -3.840, .55), vec4f(.050, -.289, -2.040, .95),
    vec4f(-.056, -.273, -.360, .40), vec4f(0., -.306, .960, 1.10), vec4f(-.081, -.254, 2.520, .70),
    vec4f(-.059, -.221, 4.080, .50));
  return C[clamp(k, 0, 5)];
}
// the middle line and the radius of the trunk at z (as axis() and rad() in the mesh)
fn woodAxis(z: f32) -> vec3f {
  let t = (z + 6.) / 12.;
  return vec3f(sin(t * 5.1 + 1.) * .08 + sin(t * 11.3) * .03, cos(t * 4.7 + .5) * .06,
    .3 * (1. - .35 * t) * (1. + .07 * sin(t * 23.)));
}
// the furrows of the bark, exactly as furrow() in the mesh (a: the angle round the log, 0 to 2 pi). x: 1 in the middle
// of a furrow, 0 on a plate; y, z: which plate (two counts, each 0 to 10, for its colour)
fn woodGroove(u: f32, w: f32) -> f32 { let f = fract(u); return 1. - ss(0., w, min(f, 1. - f)); }
fn woodFurrow(z: f32, a: f32) -> vec3f {
  let t = (z + 6.) / 12.;
  let u0 = 11. * a / 6.2831853 + .25 * sin(t * 17. + a) + .12 * sin(t * 41. + 2. * a);
  let u1 = u0 + 1.2 * z; let u2 = u0 - 1.2 * z;
  let c1 = floor(u1); let c2 = floor(u2);
  let g = max(woodGroove(u1, .30), .75 * woodGroove(u2, .22));
  return vec3f(g, c1 - 11. * floor(c1 / 11.), c2 - 11. * floor(c2 / 11.));
}
fn woodRotX(p: vec3f, a: f32) -> vec3f {
  let c = cos(a); let s = sin(a); return vec3f(p.x, p.y * c - p.z * s, p.z * c + p.y * s);
}
fn woodRotZ(p: vec3f, a: f32) -> vec3f {
  let c = cos(a); let s = sin(a); return vec3f(p.x * c - p.y * s, p.y * c + p.x * s, p.z);
}

@vertex fn vsDrift(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let sz = i.b.z; let sd = i.b.w; let lt = i.n.w;
  let floating = step(.000001, i.b.y);
  var l = i.p; var nm = i.n.xyz;
  // ---- the crinoids: each sways about the place where it holds on, trails a little behind as the log drifts, and its
  // arms open and close slowly like a fan that sieves the water. On a sunk log they are gone (folded into one point)
  if (lt > .58) {
    let k = i32(round((lt - .60) / .024)); let C = woodCri(k); let kf = f32(k);
    var d = l - C.xyz;
    let cupY = 0. - .02 - C.w - .025;
    let arm = ss(cupY + .005, cupY - .03, d.y);
    let open = 1. + .22 * sin(t * .45 + kf * 1.7 + sd * 9.) * arm;
    d = vec3f(d.x * open, d.y, d.z * open);
    let ax = .16 * sin(t * .50 + kf * 1.3 + sd * 7.) + .12;      // + 0.12: it trails behind the drift
    let az = .12 * sin(t * .37 + kf * 2.1 + sd * 3.);
    d = woodRotZ(woodRotX(d, ax), az);
    nm = woodRotZ(woodRotX(nm, ax), az);
    l = mix(C.xyz, C.xyz + d, floating);
  }
  l = l * sz;
  var T = vec3f(0., 0., 1.); var S = vec3f(1., 0., 0.); var Up = vec3f(0., 1., 0.);
  var base = vec3f(0.);
  if (i.b.y > 0.) {
    // floating: drift in a slow circle near the surface, rolling and bobbing a little
    let R = i.a.w; let ta = t * i.b.y + i.b.x;
    base = i.a.xyz + vec3f(R * cos(ta), .06 * sin(t * .4 + sd * 20.), R * sin(ta));
    T = normalize(vec3f(0. - sin(ta), 0., cos(ta)));
    S = vec3f(T.z, 0., 0. - T.x);
    let roll = sin(t * .3 + sd * 10.) * .08;
    let S2 = S * cos(roll) + Up * sin(roll);
    Up = Up * cos(roll) - S * sin(roll);
    S = S2;
  } else {
    // sunk: still on the floor, turned and tilted
    base = i.a.xyz;
    let yaw = i.a.w; let tilt = i.b.x;
    let cy = cos(yaw); let sy = sin(yaw);
    let ct = cos(tilt); let st = sin(tilt);
    T = vec3f(sy * ct, st, cy * ct);
    S = vec3f(cy, 0., 0. - sy);
    Up = cross(T, S);
  }
  let w = base + T * l.z + Up * l.y + S * l.x;
  nm = T * nm.z + Up * nm.y + S * nm.x;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = nm; o.op = i.p; o.sd = fract(sd) + 10. * (1. - floating); o.lt = lt;
  return o;
}

@fragment fn fsDrift(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let p = i.op; let lt = i.lt; let sd = fract(i.sd); let sunk = step(5., i.sd);
  let fw = max(fwidth(p.x), max(fwidth(p.y), fwidth(p.z)));
  let near = 1. - ss(.004, .015, fw);
  let bark0 = step(lt, .15); let woodP = step(abs(lt - .3), .1); let cri = step(.58, lt);
  let A = woodAxis(p.z); let q = p.xy - A.xy; let rr = length(q); let th = atan2(q.y, q.x);
  let wUp = normalize(i.n).y;                                              // which way the surface faces in the world
  var hgt = 0.;
  // ---- the bark (estimate: the surface of Archaeopteris bark is not known). The furrows are in the mesh; woodFurrow
  // repeats them here for the shade deep in them and for their colour. The plates between them are rough: they flake
  // in long scales about 3.5 cm across and 14 cm long, with fine broken cracks between, the fibres along the log.
  // Where the bark has fallen off (aux 0.12, from the mesh) the grey wood shows, rough, its grain along the log, split
  // and stained in streaks
  let aa = th + select(0., 6.2831853, th < 0.);
  let FU = woodFurrow(p.z, aa); let plate = FU.y * 7.31 + FU.z * 3.17;
  let bare = ss(.02, .11, lt) * bark0;
  let bark = bark0 * (1. - bare);
  let fur = FU.x * bark;
  let fq = vec2f(aa * rr / .035, p.z / .14); let fi = floor(fq);
  var e1 = 9.; var e2 = 9.; var fc = vec2f(0.);
  for (var a = -1; a <= 1; a++) { for (var b = -1; b <= 1; b++) {
    let c = fi + vec2f(f32(a), f32(b));
    let r = c + vec2f(hs(dot(c, vec2f(1.7, 9.2)) + sd), hs(dot(c, vec2f(8.3, 2.8)) + sd)) - fq;
    let dd = dot(r, r); if (dd < e1) { e2 = e1; e1 = dd; fc = c; } else if (dd < e2) { e2 = dd; }
  } }
  let crack = (1. - ss(.02, .08, sqrt(e2) - sqrt(e1))) * ss(.35, .65, vn(p * 18. + sd * 3.)) * near;
  let flake = hs(dot(fc, vec2f(3.1, 1.7)) + sd * 5.);
  let near2 = 1. - ss(.002, .006, fw);
  let fib = vn(vec3f(aa * rr * 90., p.z * 2.5, sd * 3.)); let fib2 = vn(vec3f(aa * rr * 260., p.z * 6., sd * 5.));
  let bump = fbm(vec3f(aa * rr * 25., p.z * 4., sd * 7.), 3);
  let gr = vn(vec3f(aa * rr * 140., p.z * 1.2, sd * 9.));
  let split = ss(.72, .82, vn(vec3f(aa * rr * 60., p.z * .4, sd + 3.)));
  let rough = fbm(vec3f(aa * rr * 30., p.z * 4., sd * 11.), 3); let pit = vn(p * 90. + sd * 13.);
  hgt += (-.014 * FU.x + .008 * bump + (.002 * flake - .002 * crack + .0015 * fib + .0008 * fib2 * near2) * near) * bark
    + (.008 * rough + (.003 * gr + .0015 * fib + .0015 * pit - .004 * split) * near) * bare;
  // shade deep in the furrows and cracks (the light of the water around reaches little of it)
  let occ = 1. - .80 * fur - .20 * crack * bark - .50 * split * bare;
  // ---- bare wood at the breaks: growth rings round the middle line, rays out from it, the heart rotten and dark; the
  // splinters show the grain along the log (estimate)
  let ring = (.5 + .5 * sin(rr / .022 * 6.2832 + 3. * vn(vec3f(th * 2., p.z, sd)))) * near + .5 * (1. - near);
  let ray = ss(.75, .95, vn(vec3f(th * 60., rr * 4., sd)));
  let side = 1. - abs(normalize(i.n).z);                                     // a face along the log, not across it
  let rot = 1. - ss(.04, .10, rr);
  hgt += (.002 * ring * (1. - side) + .002 * gr * side) * woodP * near;
  // ---- colours. Waterlogged wood: dark grey-brown bark, every plate of a ridge a little different, darker and redder
  // deep in the furrows, the worn tops of the plates paler; the wood under it greyer and paler, the rotten heart nearly
  // black (no colour of Callixylon in life is known; these are the colours of wet wood)
  let BARK = vec3f(.075, .060, .042); let WOOD = vec3f(.20, .17, .13);
  let tone = (.70 + .55 * hs(plate + sd)) * (.85 + .30 * flake) * (.75 + .5 * bump);
  var alb = BARK * tone * (.80 + .40 * fib) * (.90 + .20 * fib2 * near2) * (1. - .25 * crack);
  alb = mix(alb, vec3f(.11, .10, .085) * tone, .40 * (1. - FU.x) * ss(.5, .8, bump) * ss(.4, .8, fib));
  alb = mix(alb, vec3f(.035, .022, .014), FU.x * .9);
  let stain = .50 + .50 * vn(vec3f(aa * rr * 8., p.z * .3, sd));
  alb = mix(alb, WOOD * (.70 + .40 * gr) * (.85 + .3 * fib) * (.6 + .8 * rough) * stain * (1. - .7 * split), bare);
  alb = mix(alb, mix(WOOD * (.70 + .35 * ring) * (1. - .30 * ray), vec3f(.03, .025, .02), rot), woodP);
  // ---- what lives on it. A floating log: a slimy film of algae on its upper side, where the light falls, thicker and
  // darker in the furrows (KGS: algae would have grown on any log that was long at sea). A sunk log: grey mud on its
  // upper side and in its furrows, nothing living
  let film = sat(ss(.15, .70, wUp) * (.55 + .45 * fbm(p * 3.1 + sd * 4., 3)) + .4 * fur * ss(-.2, .4, wUp))
    * (1. - cri);
  let tex = mix(bump, rough, bare);
  alb = mix(alb, vec3f(.11, .12, .06) * (.8 + .4 * vn(p * 18.)) * (.6 + .8 * tex) * (1. - .4 * fur),
    film * .55 * (1. - sunk));
  let mud = sat(ss(.10, .60, wUp) * .85 + .7 * fur * ss(-.3, .3, wUp)) * sunk * (1. - cri);
  alb = mix(alb, vec3f(.16, .15, .12) * (.85 + .3 * vn(p * 9.)) * (.8 + .4 * tex), mud);
  // ---- the crinoids: a stem of round plates stacked like coins, the cup of plates, arms set with fine side branches
  // (pinnules). Their colour in life is not known: a plain pale grey-buff
  let k = i32(round((lt - .60) / .024)); let Cr = woodCri(k); let dy = p.y - Cr.y;
  let col = .5 + .5 * cos(dy / .007 * 6.2832);
  let pin = .5 + .5 * sin(atan2(p.z - Cr.z, p.x - Cr.x) * 70. + dy * 300.);
  let crown = ss(0. - .02 - Cr.w, 0. - .05 - Cr.w, dy);
  hgt += (.0012 * col * (1. - crown) + .0008 * pin * crown) * cri * near;
  alb = mix(alb, vec3f(.38, .35, .29) * (.80 + .25 * col * (1. - crown) + .2 * pin * crown), cri);
  // ---- light. The relief is in metres of the model (times the size, about 1). The sun through the surface with its
  // flecks (caus) and the shadow map. Under water wood hardly shines: between water (1.33) and wet wood (about 1.5) a
  // surface sends back about 0.4 % of the light that falls on it head on, against 4 % in air (Fresnel). So only a dull,
  // broad sheen, a little more on the slime of the algae and on the crinoids. The shade in the furrows (occ) dims the
  // light of the water around fully and the sun partly
  let px = dpdx(i.wp); let py = dpdy(i.wp); let r1 = cross(py, ns); let r2 = cross(ns, px); let det = dot(px, r1);
  let n = normalize(abs(det) * ns - sign(det) * (dpdx(hgt) * r1 + dpdy(hgt) * r2));
  let dist = length(i.wp - g.cam.xyz); let V = normalize(g.cam.xyz - i.wp); let L = g.sun.xyz; let H = normalize(V + L);
  let z = zone(i.wp); let vv = vol(i.wp); let ca = caus(i.wp, dist);
  let E = sunE(i.wp.y, z) * shadow1(i.wp + n * .05);
  let gl = .015 * bark + .02 * bare + .02 * woodP + .10 * film * (1. - sunk) + .12 * cri;
  var c = alb * (E * (.15 + .85 * sat(dot(n, L))) * (.3 + ca * .7) * (.35 + .65 * occ)
    + amb(i.wp, n, vv.g, z) * 1.1 * occ)
    + E * (.3 + .7 * ca) * gl * occ * pow(sat(dot(n, H)), 16.);
  c += vec3f(.2, .4, .3) * pow(1. - sat(dot(n, V)), 3.) * .03 * vv.g * occ;
  return fin(fog(c, i.wp, z));
}
