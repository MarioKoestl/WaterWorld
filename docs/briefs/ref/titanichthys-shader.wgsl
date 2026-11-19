// ============================================================================
// Reference shaders for Titanichthys, first version (brief: docs/briefs/titanichthys-build.md)
// ============================================================================
// Not loaded by the build. This is the whole text of S_TITANICHTHYS for source/eras/devonian/swimmers_titanichthys.js,
// for the mesh of docs/briefs/ref/titanichthys-mesh.js. Built on the shader of the Dunkleosteus (sixth version): the same
// skin over bone, the same light (titanLight). All functions carry the prefix titan: the shaders of an era share one module.
// It needs what W_ANIM gives every animal and S_SEA (dodge, skinRelief), which comes with the first kind of the era.
// This text has not been compiled: run `node tools/wgsl.mjs devonian` first.
// s is the distance from the snout in body lengths (s = .5 - z of the rest position), y its height.

// Instance: a.xyz = orbit centre, a.w = orbit radius R. b.x = seed, b.y = speed (rad/s, sign is direction),
// b.z = size in metres, b.w = seed2. The orbit path is repeated in zooTitanichthys: change one, change the other.

// where head and trunk armour meet, at height y: the gill opening, running forwards below the cheek
fn titanCleft(y: f32) -> f32 { return .152 - .45 * max(0. - .01 - y, 0.); }
// the line of the shut mouth, and behind its corner (s = .125) the line to the hinge of the jaw
fn titanMouthY(s: f32) -> f32 { return 0. - .012 - .040 * pow(sat(s / .125), 1.1) - .9 * max(s - .125, 0.); }
// back (x) and belly (y) of the body at s, every 0.05 from the snout: read off the mesh
fn titanTB(s: f32) -> vec2f {
  var T = array<f32, 18>(.014, .043, .056, .060, .090, .107, .117, .117, .112, .102, .092, .082, .072, .063, .055, .049, .046, .047);
  var B = array<f32, 18>(-.044, -.067, -.086, -.105, -.125, -.133, -.134, -.128, -.117, -.103, -.090, -.075, -.060, -.046, -.033, -.022, -.012, -.004);
  let f = clamp(s * 20., 0., 16.999); let k = i32(f); let u = f - f32(k);
  return vec2f(mix(T[k], T[k + 1], u), mix(B[k], B[k + 1], u));
}
fn titanSeg(p: vec2f, a: vec2f, b: vec2f) -> f32 { let pa = p - a; let ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
// a line of half width w at distance d. Where a pixel is wider than the line, the line gets wider and fainter instead of flickering
fn titanLine(d: f32, w: f32, fw: f32) -> f32 { let ww = max(w, 1.2 * fw); let q = d / ww; return exp(0. - q * q) * (w / ww); }
// is a detail of size p still larger than a pixel?
fn titanNear(p: f32, fw: f32) -> f32 { return 1. - ss(.2 * p, .5 * p, fw); }
// how far a point of the armour is from the nearest edge of a plate. p2: (s, y) on the flank, pt: (s, |x|) on the roof.
// Schematic: the head shield of BR2017 (Fig. 1 to 3) in a few lines, the median dorsal plate to 0.30
fn titanEdge(p2: vec2f, pt: vec2f, gc: f32, rimS: f32, my: f32, roof: f32, vent: f32) -> f32 {
  var dH = titanSeg(p2, vec2f(.030, .005), vec2f(.100, .010));                // the head: the frame of the cheek plate
  dH = min(dH, titanSeg(p2, vec2f(.100, .010), vec2f(.128, -.030)));
  dH = min(dH, titanSeg(p2, vec2f(.030, .005), vec2f(.040, -.030)));
  dH = min(dH, titanSeg(p2, vec2f(.056, .030), vec2f(.090, .046)));            // behind the eye
  dH = min(dH, titanSeg(p2, vec2f(.100, .010), vec2f(.120, .050)));
  var dT = titanSeg(p2, vec2f(.152, .050), vec2f(.250, .062));                 // the trunk
  dT = min(dT, titanSeg(p2, vec2f(.250, .062), vec2f(.300, .088)));
  dT = min(dT, titanSeg(p2, vec2f(.240, .040), vec2f(.215, -.020)));
  dT = min(dT, titanSeg(p2, vec2f(.215, -.020), vec2f(.210, -.060)));
  var dR = titanSeg(pt, vec2f(.020, 0.), vec2f(.150, 0.));                     // the roof
  dR = min(dR, titanSeg(pt, vec2f(.075, 0.), vec2f(.075, .070)));
  dR = min(dR, titanSeg(pt, vec2f(.020, .050), vec2f(.075, .070)));
  dR = min(dR, titanSeg(pt, vec2f(.075, .070), vec2f(.150, .090)));
  dR = min(dR, titanSeg(pt, vec2f(.155, .075), vec2f(.240, .080)));             // the median dorsal plate
  dR = min(dR, titanSeg(pt, vec2f(.240, .080), vec2f(.300, 0.)));
  let s = p2.x; let y = p2.y; let ax = pt.y;
  let dSide = min(dH + 9. * step(gc, s), dT + 9. * step(s, gc));
  var d = min(dSide + .04 * roof, dR + .04 * (1. - roof));
  d = min(d, min(abs(s - .250), ax + .04 * (1. - vent)) + .04 * (1. - vent));   // the plates of the belly
  d = min(d, min(abs(s - gc), abs(s - rimS) + .04 * vent));                     // the cleft and the rear rim
  return min(d, abs(y - my) + .03 * step(.16, s));                              // the lip
}
// the nearest and the second nearest point of a field of cells, in cell units. F2 - F1 is 0 on the border of two cells:
// cracks that cut a skin into fields of many corners
fn titanCrackle(p: vec3f) -> vec2f {
  let i = floor(p); let f = fract(p); var d1 = 9.; var d2 = 9.;
  for (var x = -1; x <= 1; x++) { for (var y = -1; y <= 1; y++) { for (var z = -1; z <= 1; z++) {
    let o = vec3f(f32(x), f32(y), f32(z)); let r = o + h33(i + o) - f; let d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
  } } }
  return vec2f(sqrt(d1), sqrt(d2));
}
// The light of the Titanichthys. As skinWet of S_SEA, but: the sun comes through the flecks of the surface (caus, as for
// the Kentuckia); the light from around is darkened in cavities (ao); the sheen is on the surface with its relief, broad
// where the surface is rough (shin low) and weak (spec); a wet sheen on the smooth shape only where `wet` says so (mouth,
// eye, the jaws)
fn titanLight(alb: vec3f, n: vec3f, ns: vec3f, wp: vec3f, spec: f32, shin: f32, wet: f32, ao: f32, sun: f32) -> vec3f {
  let V = normalize(g.cam.xyz - wp); let z = zone(wp); let L = g.sun.xyz; let H = normalize(V + L);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  let Ec = E * sun * (.45 + .55 * caus(wp, length(g.cam.xyz - wp)));
  let around = amb(wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vol(wp).g, z) * 1.1 + side(wp, n, 1., z) * .8;
  return alb * (Ec * sat(dot(n, L)) * .65 + around * ao)
    + Ec * spec * (shin + 8.) / 40. * pow(sat(dot(n, H)), shin)
    + E * wet * pow(sat(dot(ns, H)), 70.);
}
// a positive angle turns the nose DOWN
fn titanRotY(p: vec3f, pivot: vec3f, angle: f32) -> vec3f {
  let d = p - pivot; let ca = cos(angle); let sa = sin(angle);
  return pivot + vec3f(d.x, d.y * ca - d.z * sa, d.y * sa + d.z * ca);
}
fn titanRotN(nn: vec3f, angle: f32) -> vec3f { let ca = cos(angle); let sa = sin(angle); return vec3f(nn.x, nn.y * ca - nn.z * sa, nn.y * sa + nn.z * ca); }

@vertex fn vsTitanichthys(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w;
  // wide, very slow orbit (as before)
  let ta = t * i.b.y + i.b.w * 6.3 + s * 1.9;
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), 1.2 * sin(2. * ta + ph), R * .5 * sin(ta));
  let T = normalize(vec3f(0. - R * sin(ta), 2.4 * cos(2. * ta + ph), R * .5 * cos(ta))) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  var l = i.p; var n = i.n.xyz;
  let sz = i.b.z * (.95 + .1 * h.z);
  let lt = i.n.w;
  // the mouth of a filter feeder: wide open while it swims (C2020: gaping ram feeding, as a basking shark; it could not
  // shut its mouth completely). Every 18 to 30 s it closes most of the way for a moment, as if to swallow, and opens again
  let swPer = 18. + 12. * hs(s + .13);
  let swT = fract(t / swPer + hs(s + .27)) * swPer;
  let sw = ss(0., .6, swT) * (1. - ss(1.4, 2.6, swT));
  let mo = 1. - .80 * sw;
  let sR = .5 - i.p.z; let cl = titanCleft(i.p.y);
  let isFin = step(.4, lt);
  let isJaw = sat(step(abs(lt - .25), .04) + step(abs(lt + .40), .04) + step(abs(lt + .70), .04));
  let wJ = (1. - ss(.125, .155, sR)) * ss(.004, .024, cl - sR) * isJaw;
  let wH = (1. - ss(cl - .014, cl + .010, sR)) * (1. - isFin);
  let jawA = (.08 + .52 * mo) * wJ;                 // the jaw drops about its hinge: 34 degrees open, 9 nearly shut
  let headA = (0. - .02 - .12 * mo) * wH;           // the head lifts a little about the joint of the neck
  l = titanRotY(l, vec3f(0., -.072, .348), jawA);
  l = titanRotY(l, vec3f(0., .062, .350), headA);
  n = titanRotN(titanRotN(n, jawA), headA);
  // the body wave: stiff under the armour (to 0.37), the rear bends. The beat follows the speed
  let u = max(0., .13 - l.z);
  let A = .22 * u * u;
  let beat = R * abs(i.b.y) / (.65 * sz);
  let wv = t * beat * TAU + s * 25. + l.z * 4.;
  l.x += A * sin(wv);
  let sl = 4. * A * cos(wv);
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  let w = dodge(P, sz + 4. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = lt;
  return o;
}

@fragment fn fsTitanichthys(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let lt = i.lt; let sd = i.sd; let op = i.op;
  let ax = abs(op.x); let y = op.y; let s = .5 - op.z; let p2 = vec2f(s, y);
  let fw = max(fwidth(op.x), max(fwidth(op.y), fwidth(op.z)));        // how much of the body one pixel covers
  // ---- parts by aux
  let hull = step(-.13, lt) * step(lt, .35); let fins = step(.4, lt);
  let mouthP = step(-.47, lt) * step(lt, -.13); let boneP = step(-.85, lt) * step(lt, -.47); let eyeP = step(lt, -.9);
  let tb = titanTB(s); let top = tb.x; let v = sat((y - tb.y) / (tb.x - tb.y));   // v: 0 at the belly, 1 at the back
  let gc = titanCleft(y); let my = titanMouthY(s);
  // ---- where the armour is (the same map as armour() in the mesh)
  let rimS = max(.25 + .45 * y, .17);
  let vent = ss(.13, .15, s) * (1. - ss(.34, .37, s)) * (1. - ss(.07, .11, v));
  let jawP = ss(.003, -.003, y - my) * ss(.002, .008, gc - s) * hull;
  let lip = (1. - ss(.003, .009, abs(y - my))) * step(s, .127) * hull;
  let snout = 1. - ss(.002, .006, s);
  let headP = ss(.003, .008, gc - s) * (1. - max(max(lip, snout), jawP)) * hull;
  let trunkP = ss(.003, .008, s - gc) * max(ss(0., .005, rimS - s), vent) * hull;
  let armP = sat(headP + trunkP); let skinP = hull * (1. - armP);
  // ---- plate edges, noise
  let roof = ss(top - .032, top - .012, y);
  let dB = titanEdge(p2, vec2f(s, ax), gc, rimS, my, roof, vent);
  let big = fbm(op * 7. + sd * 11., 3); let mid = fbm(op * 30. + sd * 3., 3); let hue = fbm(op * 3. + sd * 23. + 5., 2);
  let n4 = titanNear(.004, fw); let n2 = titanNear(.002, fw); let n6 = titanNear(.006, fw);
  var fine = .5; var pits = .5; var ca = vec2f(.5, 1.); var cb = vec2f(.5, 1.);
  if (n6 > .01) { ca = titanCrackle(op * 70. + sd * 4.); }
  if (n4 > .01) { cb = titanCrackle(op * 220. + sd * 9.); fine = vn(op * 160. + sd * 7.); }
  if (n2 > .01) { pits = wor(op * 520.); }
  // ---- colours. The colour of the living animal is not known (no colour has been found for any placoderm), so nothing is
  // drawn that would need a source: no pattern at all. One plain tone over armour and skin (the Dunkleosteus has pale
  // armour on a dark body: this one must not), slate blue grey, darker along the back, paler below. The plates show by
  // their relief, not their colour
  let BONE = vec3f(.155, .175, .190); let SKIN = vec3f(.135, .155, .170); let BELLY = vec3f(.52, .52, .48);
  let boneC = BONE * mix(vec3f(.92, .97, 1.04), vec3f(1.08, .98, .80), hue);
  let skinC = SKIN * mix(vec3f(.85, 1.05, .95), vec3f(1.15, 1., .85), hue);
  var alb = mix(skinC, boneC, armP) * (.70 + .60 * big) * (.85 + .30 * mid) * (.90 + .20 * fine * n4);
  let blot = ss(.56, .66, fbm(op * 15. + sd * 5., 3));
  alb *= 1. - .25 * blot * hull;                                                  // faint dark blotches
  alb *= .62 + .50 * ss(.88, .35, v);                                             // darker along the back
  let vb = .30 + .12 * (fbm(vec3f(s * 7., sd * 3., ax * 3.), 2) - .5);
  let belly = (1. - ss(vb - .06, vb + .06, v)) * hull;                            // the belly: pale, a soft border, under the head too
  alb = mix(alb, BELLY * (.85 + .3 * mid) * (1. - .35 * blot), belly);
  var hgt = .0030 * armP;                                                         // the armour stands proud of the skin
  // ---- the plates: low domes. The joints a narrow groove between two raised lips of bone (the skin pulled over the edges
  // of the plates), not a painted line
  hgt += .0050 * sqrt(sat(dB / .022)) * armP;
  let groove = titanLine(dB, .0010, fw) * armP; let lipB = titanLine(dB, .0034, fw) * armP;
  hgt += .0018 * lipB - .0030 * groove;
  alb *= (1. - .55 * groove) * (1. + .25 * (lipB - groove));
  // ---- the skin over everything, as on an elephant or a crocodile: cracks that cut it into fields of many corners, each
  // field a little domed. Large fields (about 5 cm at 3.7 m) and small ones (about 1.7 cm) in them. Deeper here, fainter there
  let bigC = (1. - ss(0., .12, ca.y - ca.x)) * n6;
  let smC = (1. - ss(0., .10, cb.y - cb.x)) * n4;
  let wrk = (bigC * (skinP + .7 * armP) + .4 * smC * hull) * (.45 + 1.1 * mid) * (1. - .7 * lip);
  hgt += 0. - .0011 * wrk + (.0006 * (.45 - ca.x) * n6 + .0005 * (.45 - cb.x) * n4) * hull + .00025 * (.5 - pits) * n2 * armP;
  // ---- cavities: dark in the grooves and the cracks, both the colour and the light from around
  let ao = sat(1. - .60 * groove - .45 * wrk);
  alb *= .55 + .45 * ao;
  // the keel of the plate of the back, the ridge along the edge of the roof, the lateral line (E2024: it ends on the armour)
  let keel = titanLine(ax, .0030, fw) * trunkP * step(0., y);
  let brow = titanLine(abs(y - (top - .022)), .0030, fw) * headP * ss(.030, .045, s);
  let lat = titanLine(abs(y - (top - .062)), .0016, fw) * armP * ss(.05, .07, s);
  hgt += .0020 * (keel + brow) - .0006 * lat;
  // ---- a scar: three gouges, a dark furrow with a light lip, placed by the seed and not the same on both sides (free)
  let so = (sd - .5) * .05; let sg = sign(op.x) * .012;
  var dg = 9.;
  for (var k = 0; k < 3; k++) {
    let kf = f32(k);
    dg = min(dg, titanSeg(p2, vec2f(.200 - so + .008 * kf, .088 - .004 * kf + sg), vec2f(.226 - so + .008 * kf, .066 - .004 * kf + sg)));
  }
  let core = titanLine(dg, .0010, fw); let lipS = sat(titanLine(dg, .0028, fw) - core); let scar = armP * n4;
  alb *= (1. - .55 * core * scar) * (1. + .35 * lipS * scar); hgt += 0. - .0012 * core * scar + .0004 * lipS * scar;
  // folds where the body bends, folds on the cheek
  let fold = vn(vec3f(s * 95., y * 7., ax * 7.));
  hgt += .0011 * (fold - .5) * ss(.48, .58, s) * skinP * titanNear(.011, fw);
  let cheekf = titanLine(titanSeg(p2, vec2f(.100, -.050), vec2f(.145, -.040)), .0030, fw) + titanLine(titanSeg(p2, vec2f(.104, -.060), vec2f(.140, -.056)), .0030, fw);
  hgt -= .0012 * cheekf * hull * step(s, gc);
  // the cleft, the lips, the nostrils, a dark mask round the eye
  let c1 = (s - gc) / .0045;
  alb = mix(alb, vec3f(.010, .009, .008), exp(0. - c1 * c1) * hull);
  alb = mix(alb, SKIN * 1.5, lip);
  let nose = max(step(length(p2 - vec2f(.006, .004)), .0022), step(length(p2 - vec2f(.013, .010)), .0020)) * hull;
  hgt -= .002 * nose; alb *= 1. - .7 * nose;
  let ed0 = length(p2 - vec2f(.048, .024));
  alb *= 1. - .40 * (1. - ss(.005, .014, ed0)) * hull;
  // ---- fins: dark, blotched
  alb = mix(alb, skinC * (.75 + .5 * big) * (.62 + .50 * ss(.88, .35, v)) * (.55 + .45 * ao), fins);
  // ---- the rods of the jaws: the same bone as the armour, lighter where the water wears them, stained at the gum, lines of
  // growth, pits. No teeth, no blades (C2020)
  let dl = abs(y - my);
  var pl = mix(BONE * vec3f(.70, .68, .62), BONE * vec3f(1.40, 1.38, 1.30), ss(.0, .006, dl));
  pl *= (1. - .14 * (.5 + .5 * cos(dl * TAU / .0030)) * titanNear(.003, fw)) * (1. - .30 * ss(.55, .80, vn(vec3f(s * 220., dl * 25., ax * 30.))))
    * (.85 + .3 * mid) * (1. - .25 * ss(.3, .05, pits) * n2);
  alb = mix(alb, pl, boneP);
  // ---- inside the mouth and the filter basket: wet flesh, not plastic. Grey skin at the lips, then a mottled grey pink with
  // fine dark red veins, folds along the floor and the roof, small papillae, ridges across the roof; darker the deeper it
  // goes (lit only from the opening); at the back five gill arches, deep red with fine filaments, each with a comb of pale
  // rakers in front (estimate after basking sharks: nothing of it is preserved)
  let deep = ss(0., .21, s);
  let mot = fbm(op * 45. + sd * 5., 3);
  var inner = mix(vec3f(.30, .17, .16), vec3f(.19, .075, .07), ss(.35, .70, mot));
  inner = mix(skinC * 1.4, inner, ss(.002, .014, dl));                            // the lips are grey skin
  let vein = (1. - ss(0., .03, abs(fbm(op * vec3f(60., 90., 90.) + sd * 3., 2) - .5))) * titanNear(.004, fw);
  inner *= 1. - .40 * vein;
  let rug = 1. - ss(0., .14, abs(vn(vec3f(s * 25., y * 180., ax * 180.)) - .5)); // folds along the mouth
  var pap = 0.;
  if (n2 > .01) { pap = 1. - ss(.15, .35, wor(op * 300. + sd)); }               // papillae, only close up
  let ridge = (titanLine(abs(s - .035), .0030, fw) + titanLine(abs(s - .055), .0030, fw) + titanLine(abs(s - .075), .0030, fw)
    + titanLine(abs(s - .095), .0030, fw)) * step(lt, -.2) * step(-.3, lt);
  var gill = 0.; var rake = 0.;
  for (var k = 0; k < 5; k++) {
    let ga = .138 + .012 * f32(k);
    gill += titanLine(abs(s - ga), .0034, fw);
    rake += ss(ga - .010, ga - .003, s) * (1. - ss(ga - .0015, ga, s));          // the comb in front of each arch
  }
  let ang = atan2(y + .040, op.x);
  let fil = .5 + .5 * cos(ang * 160.);                                            // gill filaments
  let comb = ss(.40, .85, .5 + .5 * cos(ang * 70.)) * sat(rake) * (.6 + .8 * vn(vec3f(ang * 20., s * 200., sd))) * titanNear(.002, fw);
  inner = mix(inner, vec3f(.38, .045, .04) * (.65 + .6 * fil * titanNear(.0015, fw)), sat(gill) * ss(.12, .135, s));
  inner = mix(inner * (1. - .55 * sat(rake) * (1. - comb)), vec3f(.48, .42, .36), .85 * comb);   // dark gaps between the rakers
  inner *= (1. + .45 * ridge) * (.80 + .35 * rug) * (1. + .25 * pap);
  inner *= mix(1., .18, pow(deep, .8));
  alb = mix(alb, inner * (.88 + .24 * mid), mouthP);
  hgt += (.0018 * rug + .0006 * pap + .0015 * ridge + .0014 * comb + .0010 * sat(gill) * fil - .0006 * vein) * mouthP;
  // how much light from around reaches the inside: less the deeper, less in the folds and between the rakers
  let mao = mix(.75, .20, deep) * (.65 + .35 * rug) * (1. - .45 * sat(rake) * (1. - comb));

  // ---- eye: small (BR2017: ring 35 mm, opening 13 mm). Black pupil, a narrow grey gold iris, round it the ring of bone
  let ev = p2 - vec2f(.048, .024); let ed = length(ev);
  let iris = vec3f(.42, .34, .16) * (.7 + .5 * fract(atan2(ev.y, ev.x) * 2.6)) * (1.2 - .6 * ss(.0016, .0024, ed));
  var eyeC = BONE * .6 * (.8 + .4 * mid);
  eyeC = mix(eyeC, vec3f(.010, .009, .007), step(ed, .0032));
  eyeC = mix(eyeC, iris, step(ed, .0024));
  eyeC = mix(eyeC, vec3f(.003), step(ed, .0015));
  alb = mix(alb, eyeC, eyeP);
  alb *= .92 + .16 * fract(sd * 13.7);
  // ---- light. The relief is in body lengths: times the size of the animal
  let n = skinRelief(ns, i.wp, hgt * 4.2);
  let ring = eyeP * step(.0032, ed); let pup = eyeP - ring;
  let rough = (.35 + .9 * mid) * ao;
  // the inside of the mouth is wet: its sheen sits on the folds and papillae (small, sharp highlights), not on the smooth shape
  let spec = (.22 * armP + .10 * skinP + .10 * fins) * rough + .35 * boneP + .55 * mouthP * mao + .10 * ring;
  let shin = 10. + 12. * armP + 20. * boneP + 60. * mouthP;
  let wet = .25 * boneP + .08 * mouthP + 3. * pup;
  // inside the mouth the sun is dimmed too: the shadow map of the engine is coarse for a cavity of a metre
  let c = titanLight(alb, n, ns, i.wp, spec, shin, wet, mix(mix(1., ao, max(hull, fins)), mao, mouthP), mix(1., mao, mouthP));
  return fin(fog(c, i.wp, zone(i.wp)));
}
