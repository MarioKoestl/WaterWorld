// ============================================================================
// Reference shaders for Dunkleosteus terrelli, sixth version (brief: docs/briefs/dunkleosteus-bone.md). The light is its own
// (dunkLight), not skinWet: skinWet puts a gloss on the smooth shape, and on bone and skin that reads as plastic
// ============================================================================
// Not loaded by the build. This is the whole text of S_DUNKLEOSTEUS for source/eras/devonian/swimmers_dunkleosteus.js,
// for the mesh of docs/briefs/ref/dunkleosteus-mesh.js (sixth version). `patch` is a reserved word: never use it as a name.
// It needs what W_ANIM gives every animal (S_B and W_HASH: ss, sat, hs, vn, fbm, wor, zone, fog, fin) and S_SEA
// (dodge, skinRelief, skinWet), which comes with the first kind of the era in world.js.
// The fragment shader was written twice: here, and in numpy for the reference picture. This text has not been
// compiled: run `node tools/wgsl.mjs devonian` first.
// s is the distance from the snout in body lengths (s = .5 - z of the rest position), y its height.

// Instance: a.xyz = orbit centre, a.w = orbit radius R. b.x = seed, b.y = speed (rad/s, sign is direction),
// b.z = size in metres (3.4 to 4.1), b.w = seed2. The orbit path is repeated in zooDunkleosteus: change one,
// change the other.

// where head and trunk armour meet, at height y: the gill opening (E2024, Fig. 3 and 4: it runs forwards below the cheek)
fn dunkCleft(y: f32) -> f32 { return .192 - .55 * max(0. - .01 - y, 0.); }
// the line of the shut mouth, and behind its corner (s = .09) the line to the hinge of the jaw
fn dunkMouthY(s: f32) -> f32 { return 0. - .010 - .054 * pow(sat(s / .090), 1.2) - .9 * max(s - .090, 0.); }
// back (x) and belly (y) of the body at s, every 0.05 from the snout: read off the mesh
fn dunkTB(s: f32) -> vec2f {
  var T = array<f32, 18>(.016, .057, .079, .092, .105, .128, .140, .146, .143, .138, .128, .114, .100, .088, .076, .064, .063, .069);
  var B = array<f32, 18>(-.029, -.091, -.119, -.143, -.149, -.151, -.153, -.151, -.143, -.127, -.111, -.089, -.062, -.034, -.012, -.002, .001, .008);
  let f = clamp(s * 20., 0., 16.999); let k = i32(f); let u = f - f32(k);
  return vec2f(mix(T[k], T[k + 1], u), mix(B[k], B[k + 1], u));
}
fn dunkSeg(p: vec2f, a: vec2f, b: vec2f) -> f32 { let pa = p - a; let ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
// a line of half width w at distance d. Where a pixel is wider than the line, the line gets wider and fainter instead of flickering
fn dunkLine(d: f32, w: f32, fw: f32) -> f32 { let ww = max(w, 1.2 * fw); let q = d / ww; return exp(0. - q * q) * (w / ww); }
// is a detail of size p still larger than a pixel?
fn dunkNear(p: f32, fw: f32) -> f32 { return 1. - ss(.2 * p, .5 * p, fw); }
// how far a point of the armour is from the nearest edge of a plate. p2: (s, y) on the flank, pt: (s, |x|) on the roof.
// The lines are schematic, after Fig. 3 and 4 of E2024
fn dunkEdge(p2: vec2f, pt: vec2f, gc: f32, rimS: f32, my: f32, roof: f32, vent: f32) -> f32 {
  var dH = dunkSeg(p2, vec2f(.060, .030), vec2f(.124, .035));                // the head: the frame of the cheek plate
  dH = min(dH, dunkSeg(p2, vec2f(.124, .035), vec2f(.176, -.016)));
  dH = min(dH, dunkSeg(p2, vec2f(.176, -.016), vec2f(.166, -.056)));
  dH = min(dH, dunkSeg(p2, vec2f(.060, .030), vec2f(.076, -.046)));
  dH = min(dH, dunkSeg(p2, vec2f(.062, .042), vec2f(.100, .064)));            // behind the eye
  dH = min(dH, dunkSeg(p2, vec2f(.124, .035), vec2f(.150, .075)));
  dH = min(dH, dunkSeg(p2, vec2f(.022, .004), vec2f(.030, .044)));            // in front of the eye
  var dT = dunkSeg(p2, vec2f(.192, .072), vec2f(.300, .072));                 // the trunk
  dT = min(dT, dunkSeg(p2, vec2f(.300, .072), vec2f(.345, .090)));
  dT = min(dT, dunkSeg(p2, vec2f(.305, .050), vec2f(.270, .046)));
  dT = min(dT, dunkSeg(p2, vec2f(.270, .046), vec2f(.240, -.006)));
  dT = min(dT, dunkSeg(p2, vec2f(.240, -.006), vec2f(.234, -.050)));
  dT = min(dT, dunkSeg(p2, vec2f(.270, .046), vec2f(.267, .072)));
  var dR = dunkSeg(pt, vec2f(.020, 0.), vec2f(.190, 0.));                     // the roof
  dR = min(dR, dunkSeg(pt, vec2f(.095, 0.), vec2f(.095, .050)));
  dR = min(dR, dunkSeg(pt, vec2f(.030, .030), vec2f(.095, .050)));
  dR = min(dR, dunkSeg(pt, vec2f(.095, .050), vec2f(.190, .070)));
  dR = min(dR, dunkSeg(pt, vec2f(.195, .060), vec2f(.300, .060)));
  dR = min(dR, dunkSeg(pt, vec2f(.300, .060), vec2f(.390, 0.)));
  let s = p2.x; let y = p2.y; let ax = pt.y;
  let dSide = min(dH + 9. * step(gc, s), dT + 9. * step(s, gc));
  var d = min(dSide + .04 * roof, dR + .04 * (1. - roof));
  d = min(d, min(abs(s - .300), ax + .04 * (1. - vent)) + .04 * (1. - vent));   // the plates of the belly
  d = min(d, min(abs(s - gc), abs(s - rimS) + .04 * vent));                     // the cleft and the rear rim
  return min(d, abs(y - my) + .03 * step(.13, s));                              // the lip
}
// the nearest and the second nearest point of a field of cells, in cell units. F2 - F1 is 0 on the border of two cells:
// cracks that cut a skin into fields of many corners
fn dunkCrackle(p: vec3f) -> vec2f {
  let i = floor(p); let f = fract(p); var d1 = 9.; var d2 = 9.;
  for (var x = -1; x <= 1; x++) { for (var y = -1; y <= 1; y++) { for (var z = -1; z <= 1; z++) {
    let o = vec3f(f32(x), f32(y), f32(z)); let r = o + h33(i + o) - f; let d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
  } } }
  return vec2f(sqrt(d1), sqrt(d2));
}
// The light of the Dunkleosteus. As skinWet of S_SEA, but: the sun comes through the flecks of the surface (caus, as for
// the Kentuckia); the light from around is darkened in cavities (ao); the sheen is on the surface with its relief, broad
// where the surface is rough (shin low) and weak (spec); a wet sheen on the smooth shape only where `wet` says so (mouth,
// eye, the jaws)
fn dunkLight(alb: vec3f, n: vec3f, ns: vec3f, wp: vec3f, spec: f32, shin: f32, wet: f32, ao: f32) -> vec3f {
  let V = normalize(g.cam.xyz - wp); let z = zone(wp); let L = g.sun.xyz; let H = normalize(V + L);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  let Ec = E * (.45 + .55 * caus(wp, length(g.cam.xyz - wp)));
  let around = amb(wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vol(wp).g, z) * 1.1 + side(wp, n, 1., z) * .8;
  return alb * (Ec * sat(dot(n, L)) * .65 + around * ao)
    + Ec * spec * (shin + 8.) / 40. * pow(sat(dot(n, H)), shin)
    + E * wet * pow(sat(dot(ns, H)), 70.);
}
// a positive angle turns the nose DOWN
fn dunkRotY(p: vec3f, pivot: vec3f, angle: f32) -> vec3f {
  let d = p - pivot; let ca = cos(angle); let sa = sin(angle);
  return pivot + vec3f(d.x, d.y * ca - d.z * sa, d.y * sa + d.z * ca);
}
fn dunkRotN(nn: vec3f, angle: f32) -> vec3f { let ca = cos(angle); let sa = sin(angle); return vec3f(nn.x, nn.y * ca - nn.z * sa, nn.y * sa + nn.z * ca); }

@vertex fn vsDunkleosteus(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w;
  let ta = t * i.b.y + i.b.w * 6.3 + s * 2.1;
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), 1.5 * sin(2. * ta + ph), R * .5 * sin(ta));
  let T = normalize(vec3f(0. - R * sin(ta), 3. * cos(2. * ta + ph), R * .5 * cos(ta))) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  var l = i.p; var n = i.n.xyz;
  let sz = i.b.z * (.95 + .1 * h.z);
  let lt = i.n.w;
  // the mouth. At rest nearly shut (8 degrees), so the fangs cross over the lips.
  // The snap: every 12 to 25 s, at a time of its own for each animal. It opens in 0.06 s (Anderson and Westneat 2007: in a
  // fiftieth of a second, which is one frame), stays open 0.25 s and shuts in 0.12 s
  let snPer = 12. + 13. * hs(s + .13);
  let snT = fract(t / snPer + hs(s + .27)) * snPer;
  let snap = sat(snT / .06) * (1. - sat((snT - .31) / .12));
  // the threat: while the viewer is in front of it and closer than 9 m, it holds the mouth wide open
  let toC = g.cam.xyz - P; let dC = max(length(toC), .001);
  let threat = ss(9., 4., dC) * ss(.2, .6, dot(toC / dC, T));
  let mo = max(snap, .95 * threat);
  let sR = .5 - i.p.z; let cl = dunkCleft(i.p.y);
  let isFin = step(.4, lt);
  let isJaw = sat(step(abs(lt - .25), .04) + step(abs(lt + .40), .04) + step(abs(lt + .70), .04));
  let wJ = (1. - ss(.090, .125, sR)) * ss(.004, .024, cl - sR) * isJaw;
  let wH = (1. - ss(cl - .014, cl + .010, sR)) * (1. - isFin);
  let jawA = (.12 + .68 * mo) * wJ;                 // the jaw drops about its hinge: 7 degrees at rest, 46 wide open
  let headA = (0. - .02 - .28 * mo) * wH;           // the head lifts about the joint of the neck: 1 at rest, 17 wide open
  l = dunkRotY(l, vec3f(0., -.105, .365), jawA);
  l = dunkRotY(l, vec3f(0., .055, .305), headA);
  n = dunkRotN(dunkRotN(n, jawA), headA);
  // the body wave: stiff under the armour (E2024), the rear bends. The beat follows the speed
  let u = max(0., 0. - l.z);
  let A = .26 * u * u;
  let beat = R * abs(i.b.y) / (.65 * sz);
  let wv = t * beat * TAU + s * 30. + l.z * 4.5;
  l.x += A * sin(wv);
  let sl = 4.5 * A * cos(wv);
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  let w = dodge(P, sz + 4. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = lt;
  return o;
}

@fragment fn fsDunkleosteus(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let lt = i.lt; let sd = i.sd; let op = i.op;
  let ax = abs(op.x); let y = op.y; let s = .5 - op.z; let p2 = vec2f(s, y);
  let fw = max(fwidth(op.x), max(fwidth(op.y), fwidth(op.z)));        // how much of the body one pixel covers
  // ---- parts by aux
  let hull = step(-.13, lt) * step(lt, .35); let fins = step(.4, lt);
  let mouthP = step(-.47, lt) * step(lt, -.13); let boneP = step(-.85, lt) * step(lt, -.47); let eyeP = step(lt, -.9);
  let tb = dunkTB(s); let top = tb.x; let v = sat((y - tb.y) / (tb.x - tb.y));   // v: 0 at the belly, 1 at the back
  let gc = dunkCleft(y); let my = dunkMouthY(s);
  // ---- where the armour is (rear rim and belly plate after Fig. 3 and 4 of E2024)
  let rimS = max(.218 + .76 * (y + .088), .192);
  let vent = ss(.13, .15, s) * (1. - ss(.44, .47, s)) * (1. - ss(.07, .11, v));
  let jawP = ss(.003, -.003, y - my) * ss(.002, .008, gc - s) * hull;
  let lip = (1. - ss(.003, .009, abs(y - my))) * step(s, .092) * hull;
  let snout = 1. - ss(.002, .006, s);
  let headP = ss(.003, .008, gc - s) * (1. - max(max(lip, snout), jawP)) * hull;
  let trunkP = ss(.003, .008, s - gc) * max(ss(0., .005, rimS - s), vent) * hull;
  let armP = sat(headP + trunkP); let skinP = hull * (1. - armP);
  // ---- plate edges, noise
  let roof = ss(top - .032, top - .012, y);
  let dB = dunkEdge(p2, vec2f(s, ax), gc, rimS, my, roof, vent);
  let big = fbm(op * 7. + sd * 11., 3); let mid = fbm(op * 30. + sd * 3., 3); let hue = fbm(op * 3. + sd * 23. + 5., 2);
  let n4 = dunkNear(.004, fw); let n2 = dunkNear(.002, fw); let n6 = dunkNear(.006, fw);
  var fine = .5; var pits = .5; var ca = vec2f(.5, 1.); var cb = vec2f(.5, 1.);
  if (n6 > .01) { ca = dunkCrackle(op * 70. + sd * 4.); }
  if (n4 > .01) { cb = dunkCrackle(op * 220. + sd * 9.); fine = vn(op * 160. + sd * 7.); }
  if (n2 > .01) { pits = wor(op * 520.); }
  // ---- colours. Bone: grey with ochre and olive in it, never one tone. Skin: nearly black, olive and brown in it.
  // The colour of the living animal is not known: this is a choice
  let BONE = vec3f(.48, .45, .36); let SKIN = vec3f(.040, .040, .034); let BELLY = vec3f(.52, .50, .40);
  let boneC = BONE * mix(vec3f(.92, .97, 1.04), vec3f(1.08, .98, .80), hue);
  let skinC = SKIN * mix(vec3f(.85, 1.05, .95), vec3f(1.15, 1., .85), hue);
  var alb = mix(skinC, boneC, armP) * (.70 + .60 * big) * (.85 + .30 * mid) * (.90 + .20 * fine * n4);
  let blot = ss(.56, .66, fbm(op * 15. + sd * 5., 3));
  alb *= 1. - (.55 * skinP + .25 * armP) * blot;                                  // dark blotches, fainter on the plates
  alb *= 1. - .35 * armP * ss(.55, .72, fbm(op * 6. + sd * 17. + 3., 3));         // stains on old bone
  let vb = .23 + .14 * (fbm(vec3f(s * 7., sd * 3., ax * 3.), 2) - .5);
  let belly = (1. - ss(vb - .035, vb + .035, v)) * ss(.10, .17, s) * hull;       // the belly: a ragged border, not under the head
  alb = mix(alb, BELLY * (.85 + .3 * mid) * (1. - .35 * blot), belly);
  var hgt = .0030 * armP;                                                         // the armour stands proud of the skin
  // ---- the plates: low domes. The joints a narrow groove between two raised lips of bone (the skin pulled over the edges
  // of the plates), not a painted line
  hgt += .0050 * sqrt(sat(dB / .022)) * armP;
  let groove = dunkLine(dB, .0010, fw) * armP; let lipB = dunkLine(dB, .0034, fw) * armP;
  hgt += .0018 * lipB - .0030 * groove;
  alb *= (1. - .55 * groove) * (1. + .25 * (lipB - groove));
  // ---- the skin over everything, as on an elephant or a crocodile: cracks that cut it into fields of many corners, each
  // field a little domed. Large fields (about 5 cm at 3.7 m) and small ones (about 1.7 cm) in them. Deeper here, fainter there
  let bigC = (1. - ss(0., .12, ca.y - ca.x)) * n6;
  let smC = (1. - ss(0., .10, cb.y - cb.x)) * n4;
  let wrk = (bigC * (skinP + .7 * armP) + .4 * smC * hull) * (.45 + 1.1 * mid);
  hgt += 0. - .0011 * wrk + (.0006 * (.45 - ca.x) * n6 + .0005 * (.45 - cb.x) * n4) * hull + .00025 * (.5 - pits) * n2 * armP;
  // ---- cavities: dark in the grooves and the cracks, both the colour and the light from around
  let ao = sat(1. - .60 * groove - .45 * wrk);
  alb *= .55 + .45 * ao;
  // the keel of the plate of the back, the ridge along the edge of the roof, the lateral line (E2024: it ends on the armour)
  let keel = dunkLine(ax, .0030, fw) * trunkP * step(0., y);
  let brow = dunkLine(abs(y - (top - .022)), .0030, fw) * headP * ss(.030, .045, s);
  let lat = dunkLine(abs(y - (top - .062)), .0016, fw) * armP * ss(.05, .07, s);
  hgt += .0020 * (keel + brow) - .0006 * lat;
  // ---- scars: gouges, a dark furrow with a light lip, placed by the seed and not the same on both sides (Scott and others
  // 2012: possible bite marks of another arthrodire on a plate of Dunkleosteus)
  let so = (sd - .5) * .05; let sg = sign(op.x) * .012;
  var dg = 9.;
  for (var k = 0; k < 3; k++) {
    let kf = f32(k);
    dg = min(dg, dunkSeg(p2, vec2f(.222 - so + .008 * kf, .112 - .004 * kf + sg), vec2f(.250 - so + .008 * kf, .088 - .004 * kf + sg)));
    dg = min(dg, dunkSeg(p2, vec2f(.330 + so + .007 * kf, .040 + sg), vec2f(.352 + so + .007 * kf, .010 + sg)));
  }
  let core = dunkLine(dg, .0010, fw); let lipS = sat(dunkLine(dg, .0028, fw) - core); let scar = armP * n4;
  alb *= (1. - .55 * core * scar) * (1. + .35 * lipS * scar); hgt += 0. - .0012 * core * scar + .0004 * lipS * scar;
  // folds where the body bends, folds on the cheek
  let fold = vn(vec3f(s * 95., y * 7., ax * 7.));
  hgt += .0011 * (fold - .5) * ss(.48, .58, s) * skinP * dunkNear(.011, fw);
  let cheekf = dunkLine(dunkSeg(p2, vec2f(.100, -.062), vec2f(.170, -.040)), .0030, fw) + dunkLine(dunkSeg(p2, vec2f(.104, -.074), vec2f(.160, -.066)), .0030, fw);
  hgt -= .0012 * cheekf * hull * step(s, gc);
  // the cleft, the lips, the nostrils, a dark mask round the eye
  let c1 = (s - gc) / .0045;
  alb = mix(alb, vec3f(.010, .009, .008), exp(0. - c1 * c1) * hull);
  alb = mix(alb, SKIN * 1.5, lip);
  let nose = max(step(length(p2 - vec2f(.010, .006)), .0030), step(length(p2 - vec2f(.017, .013)), .0028)) * hull;
  hgt -= .002 * nose; alb *= 1. - .7 * nose;
  let ed0 = length(p2 - vec2f(.042, .024));
  alb *= 1. - .70 * (1. - ss(.012, .036, ed0)) * hull;
  // ---- fins: dark, blotched
  alb = mix(alb, skinC * 1.1 * (.75 + .5 * big) * (1. - .5 * blot) * (.55 + .45 * ao), fins);
  // ---- the plates of the jaws: the same bone as the armour, lighter where they are worn, stained grey brown at the gum,
  // lines of growth along the edge, pits. No white, no enamel: they are bone
  let dl = abs(y - my);
  var pl = mix(BONE * vec3f(.55, .50, .44), BONE * vec3f(1.30, 1.26, 1.18), ss(.002, .020, dl));
  pl *= (1. - .14 * (.5 + .5 * cos(dl * TAU / .0030)) * dunkNear(.003, fw)) * (1. - .30 * ss(.55, .80, vn(vec3f(s * 220., dl * 25., ax * 30.))))
    * (.85 + .3 * mid) * (1. - .25 * ss(.3, .05, pits) * n2);
  alb = mix(alb, pl, boneP);
  // ---- inside the mouth and the throat: flesh at the lips, darker the deeper it goes but never black, soft folds, ridges
  // across the roof, and at the back the four gill arches, red with blood
  let deep = ss(0., .19, s);
  var inner = mix(vec3f(.17, .05, .042), vec3f(.03, .010, .009), pow(deep, .7));
  let ridge = (dunkLine(abs(s - .030), .0030, fw) + dunkLine(abs(s - .046), .0030, fw) + dunkLine(abs(s - .062), .0030, fw)
    + dunkLine(abs(s - .078), .0030, fw)) * step(lt, -.2) * step(-.3, lt);
  var gill = 0.;
  for (var k = 0; k < 4; k++) { gill += dunkLine(abs(s - (.120 + .017 * f32(k))), .0045, fw); }
  inner = mix(inner, vec3f(.36, .06, .05), sat(gill) * ss(.10, .115, s)) * (1. + .5 * ridge);
  let mfold = vn(vec3f(s * 20., y * 140., ax * 140.));
  alb = mix(alb, inner * (.85 + .3 * mid) * (.75 + .5 * mfold), mouthP);
  hgt += (.0015 * ridge + .0012 * (mfold - .5)) * mouthP;
  // ---- eye: black pupil, a narrow dark amber iris, a black rim, and round it the ring of bone, stained dark
  let ev = p2 - vec2f(.042, .024); let ed = length(ev);
  let iris = vec3f(.55, .30, .06) * (.6 + .6 * fract(atan2(ev.y, ev.x) * 2.6 + 3. * ed / .0066)) * (1.2 - .7 * ss(.0046, .0066, ed));
  var eyeC = BONE * .38 * (.8 + .4 * mid);
  eyeC = mix(eyeC, vec3f(.010, .009, .007), step(ed, .0098));
  eyeC = mix(eyeC, iris, step(ed, .0066));
  eyeC = mix(eyeC, vec3f(.003), step(ed, .0046));
  alb = mix(alb, eyeC, eyeP);
  alb *= .92 + .16 * fract(sd * 13.7);
  // ---- light. The relief is in body lengths: times the size of the animal
  let n = skinRelief(ns, i.wp, hgt * 4.2);
  let ring = eyeP * step(.0098, ed); let pup = eyeP - ring;
  let rough = (.35 + .9 * mid) * ao;
  let spec = (.22 * armP + .10 * skinP + .10 * fins) * rough + .35 * boneP + .30 * mouthP + .10 * ring;
  let shin = 10. + 12. * armP + 20. * boneP + 30. * mouthP;
  let wet = .25 * boneP + .8 * mouthP + 3. * pup;
  let c = dunkLight(alb, n, ns, i.wp, spec, shin, wet, mix(1., ao, max(hull, fins)));
  return fin(fog(c, i.wp, zone(i.wp)));
}
