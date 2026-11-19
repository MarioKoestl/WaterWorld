// ============================================================================
// Reference shaders for Stethacanthus, first version (brief: docs/briefs/stethacanthus-build.md)
// ============================================================================
// Not loaded by the build. This is the whole text of S_STETHACANTHUS for
// source/eras/devonian/swimmers_stethacanthus.js, for the mesh of docs/briefs/ref/stethacanthus-mesh.js. Built on the
// shader of the Cladoselache; its light (stethLight) is that of the Titanichthys, its motion that of
// docs/briefs/devonian-giants-motion.md for a slow swimmer. All functions carry the prefix steth: the shaders of an era
// share one module. It needs what W_ANIM gives every animal and S_SEA (dodge, skinRelief), which comes with the first
// kind of the era. This text has not been compiled: run `node tools/wgsl.mjs devonian` first.
// s is the distance from the snout in body lengths (s = .5 - z of the rest position), y its height.

// Instance: a.xyz = centre of its path, a.w = radius R of its path. b.x = seed, b.y = cruising speed in m/s (the sign
// is the direction), b.z = length in metres, b.w = seed2. Each animal swims alone. Path and distance along it are
// repeated in zooStethacanthus: change one, change the other. The seed decides whether the animal is a mature male
// (with the spine-brush complex, the denticles on the head and the claspers) or not: stethMale().

// where it swims: a circle with a slower one on top, so the path wanders; it rises and sinks a little. Every
// frequency is a multiple of 0.5, so the path repeats after 4 pi and the angle can be wrapped. a: the angle along it
fn stethPath(c: vec3f, R: f32, a: f32, ph: f32) -> vec3f {
  return c + vec3f(R * cos(a) + .1 * R * cos(1.5 * a + ph), 1.0 * sin(2. * a + ph) + .4 * sin(3.5 * a + 2. * ph),
                   R * sin(a) + .1 * R * sin(1.5 * a + 1.7 * ph));
}
// the line of the shut mouth (it reaches back to 0.12), and behind its corner the line to the hinge
fn stethMouthY(s: f32) -> f32 { return 0. - .008 - .030 * pow(sat(s / .12), 1.1) - .9 * max(s - .12, 0.); }
// a mature male? About two animals in five (free). Only those carry the spine-brush complex, the denticles on the head
// and the claspers: "affirmed only in males, and only in those males that have reached sexual maturity" (W)
fn stethMale(sd: f32) -> f32 { return step(.6, fract(sd * 7.7 + .13)); }
// back (x) and belly (y) of the body at s, every 0.05 from the snout: read off the mesh
fn stethTB(s: f32) -> vec2f {
  var T = array<f32, 19>(.008, .024, .036, .046, .054, .056, .057, .057, .057, .056, .052,
    .046, .038, .033, .031, .030, .031, .035, .040);
  var B = array<f32, 19>(-.016, -.033, -.046, -.055, -.063, -.065, -.065, -.062, -.058, -.055, -.051,
    -.041, -.031, -.022, -.012, -.005, -.002, .003, .007);
  let f = clamp(s * 20., 0., 17.999); let k = i32(f); let u = f - f32(k);
  return vec2f(mix(T[k], T[k + 1], u), mix(B[k], B[k + 1], u));
}
// a line of half width w at distance d. Where a pixel is wider than the line, the line gets wider and fainter
fn stethLine(d: f32, w: f32, fw: f32) -> f32 {
  let ww = max(w, 1.2 * fw); let q = d / ww; return exp(0. - q * q) * (w / ww);
}
// is a detail of size p still larger than a pixel?
fn stethNear(p: f32, fw: f32) -> f32 { return 1. - ss(.2 * p, .5 * p, fw); }
// the five gill slits (s of each), and how near a point is to one of them on the flank
fn stethGill(s: f32, y: f32, fw: f32) -> f32 {
  var g = 0.;
  for (var k = 0; k < 5; k++) { g += stethLine(abs(s - (.196 + .007 * f32(k))), .0010, fw); }
  return sat(g) * ss(-.064, -.054, y) * (1. - ss(-.010, .004, y));
}
// The light: that of the Titanichthys (titanLight). The sun through the flecks of the surface; the light from around
// darkened in cavities (ao); the sheen on the surface with its relief; a wet sheen on the smooth shape only where `wet`
// says so
fn stethLight(alb: vec3f, n: vec3f, ns: vec3f, wp: vec3f, spec: f32, shin: f32, wet: f32, ao: f32, sun: f32) -> vec3f {
  let V = normalize(g.cam.xyz - wp); let z = zone(wp); let L = g.sun.xyz; let H = normalize(V + L);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  let Ec = E * sun * (.45 + .55 * caus(wp, length(g.cam.xyz - wp)));
  let around = amb(wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vol(wp).g, z) * 1.1 + side(wp, n, 1., z) * .8;
  return alb * (Ec * sat(dot(n, L)) * .65 + around * ao)
    + Ec * spec * (shin + 8.) / 40. * pow(sat(dot(n, H)), shin)
    + E * wet * pow(sat(dot(ns, H)), 70.);
}
// a positive angle turns the nose DOWN
fn stethRotY(p: vec3f, pivot: vec3f, angle: f32) -> vec3f {
  let d = p - pivot; let ca = cos(angle); let sa = sin(angle);
  return pivot + vec3f(d.x, d.y * ca - d.z * sa, d.y * sa + d.z * ca);
}
fn stethRotN(nn: vec3f, angle: f32) -> vec3f {
  let ca = cos(angle); let sa = sin(angle); return vec3f(nn.x, nn.y * ca - nn.z * sa, nn.y * sa + nn.z * ca);
}

@vertex fn vsStethacanthus(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let R = i.a.w; let ph = i.b.w * 17.; let sz = i.b.z;
  let v0 = abs(i.b.y); let L = .9 * R;               // L: metres of path per radian, about
  // ---- how far it has swum: slowly ("probably a slow-moving shark", W; "unsuited for sudden acceleration and
  // sustained high-speed pursuit", CS2001). It speeds up and slows down on two slow waves (30 and 15 %); it does not
  // strike
  let f1 = .031 + .02 * fract(s * 7.31); let f2 = .083 + .03 * fract(s * 3.17);
  let q1 = f1 * t + 6.3 * fract(s * 5.13); let q2 = f2 * t + 6.3 * fract(s * 9.71);
  let dist = v0 * (t + .30 / f1 * sin(q1) + .15 / f2 * sin(q2));
  let vr = 1. + .30 * cos(q1) + .15 * cos(q2);       // speed in cruising speeds
  // ---- the mouth: it breathes by pumping, a small opening every 2 to 3 s (estimate: a slow shark does not breathe by
  // swimming alone)
  let bc = .5 - .5 * cos(TAU * t / (2. + fract(s * 4.3)) + 6.3 * fract(s * 8.9));
  let mo = .10 * bc * bc;
  // ---- where on its path, and which way it faces. The sign of b.y says which way round it goes
  var a = sign(i.b.y) * dist / L + i.b.w * 6.3 + s * 2.1;
  a -= 12.566371 * floor(a / 12.566371);
  let e = .6 / L;
  let P = stethPath(i.a.xyz, R, a, ph);
  let Pa = stethPath(i.a.xyz, R, a + e, ph); let Pb = stethPath(i.a.xyz, R, a - e, ph);
  let dd = .5 * length(Pa - Pb);
  let T = (Pa - Pb) / (2. * dd) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let kl = clamp(dot(Pa + Pb - 2. * P, S) / (dd * dd) * sz, -.6, .6);
  var l = i.p; var n = i.n.xyz;
  let lt = i.n.w; let sR = .5 - i.p.z;
  // ---- what only a mature male has folds into the body for the others: the brush, its denticles, the claspers
  let maleP = step(.6, lt) * step(lt, .8);
  let fold = maleP * (1. - stethMale(s));
  l = mix(l, vec3f(0., 0., l.z), fold);
  let isFin = step(.4, lt) * step(lt, .55);
  let isJaw = sat(step(abs(lt - .25), .04) + step(abs(lt + .40), .04) + step(abs(lt + .70), .04));
  let wJ = (1. - ss(.12, .16, sR)) * isJaw;
  let wH = (1. - ss(.13, .20, sR)) * (1. - isFin) * (1. - maleP);
  let jawA = (.06 + .50 * mo) * wJ;                 // the jaw drops about its hinge: 3 to 6 degrees as it breathes
  let headA = (0. - .01 - .05 * mo) * wH;
  l = stethRotY(l, vec3f(0., -.038, .380), jawA);
  l = stethRotY(l, vec3f(0., .040, .330), headA);
  n = stethRotN(stethRotN(n, jawA), headA);
  // ---- the tail beat: one beat per 0.7 body lengths swum, so it beats faster when it swims faster
  let amp = .85 + .15 * min(vr, 2.);
  let bp = TAU * dist / (.70 * sz) + s * 30.;
  // ---- the pectoral fins turn about a hinge at their root: they scull a little and steer (the fin on the inside of
  // the turn goes down). The whips start behind the fins and sway with the body
  let sx = select(-1., 1., i.p.x >= 0.);
  let pw = isFin * ss(.236, .244, sR) * (1. - ss(.30, .33, sR)) * ss(.040, .070, abs(i.p.x)) * step(i.p.y, -.02);
  let up = .07 * sin(.5 * bp + 6.3 * s) - clamp(1.5 * kl, -.25, .25) * sx;
  let fa = sx * up * pw;
  let hg = vec2f(sx * .040, -.042); let dq = l.xy - hg;
  l = vec3f(hg + vec2f(dq.x * cos(fa) - dq.y * sin(fa), dq.x * sin(fa) + dq.y * cos(fa)), l.z);
  n = vec3f(n.x * cos(fa) - n.y * sin(fa), n.x * sin(fa) + n.y * cos(fa), n.z);
  // ---- the body. The front swings a little against the tail (recoil). The wave runs back from in front of the
  // middle, its wavelength about one body length; in a turn the body lies along the curve of its path
  let yr = .025 * amp * sin(bp - .9);
  let u = max(0., .10 - l.z);
  let wv = bp + 6. * l.z;
  let Aw = .20 * amp;
  let bw = .3 + .7 * ss(-.05, .25, 0. - l.z);
  let zc = l.z;
  l.x += yr * (zc - .1) + Aw * u * u * sin(wv) + .5 * kl * zc * zc * bw;
  let sl = yr + Aw * (6. * u * u * cos(wv) - 2. * u * sin(wv)) + kl * zc * bw;
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  // ---- it banks into the turn, a little
  let rb = 0. - clamp(.5 * kl * min(vr, 1.5), -.2, .2);
  l = vec3f(l.x * cos(rb) - l.y * sin(rb), l.x * sin(rb) + l.y * cos(rb), l.z);
  n = vec3f(n.x * cos(rb) - n.y * sin(rb), n.x * sin(rb) + n.y * cos(rb), n.z);
  let w = dodge(P, .6 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = lt;
  return o;
}

@fragment fn fsStethacanthus(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let lt = i.lt; let sd = i.sd; let op = i.op;
  let ax = abs(op.x); let y = op.y; let s = .5 - op.z; let p2 = vec2f(s, y);
  let fw = max(fwidth(op.x), max(fwidth(op.y), fwidth(op.z)));        // how much of the body one pixel covers
  // ---- parts by aux
  let hull = step(-.13, lt) * step(lt, .35); let fins = step(.4, lt) * step(lt, .55);
  let clasp = step(.6, lt) * step(lt, .675); let crest = step(.675, lt) * step(lt, .725); let dentP = step(.725, lt);
  let mouthP = step(-.47, lt) * step(lt, -.13); let teethP = step(-.75, lt) * step(lt, -.47);
  let ringP = step(-.92, lt) * step(lt, -.75); let eyeP = step(lt, -.92);
  let tb = stethTB(s); let v = sat((y - tb.y) / (tb.x - tb.y));     // v: 0 at the belly, 1 at the back
  let my = stethMouthY(s); let dl = abs(y - my);
  let big = fbm(op * 6. + sd * 11., 3); let mid = fbm(op * 28. + sd * 3., 3); let hue = fbm(op * 3. + sd * 23. + 5., 2);
  let n4 = stethNear(.004, fw); let n2 = stethNear(.002, fw); let n1 = stethNear(.001, fw);
  // ---- colour. Nothing is known of its colour: one plain tone, no pattern (the spots of AP are the artist's). Dark
  // grey brown along the back, paler on the flank, a pale belly with a soft border (estimate)
  let BACK = vec3f(.120, .118, .112); let FLANK = vec3f(.250, .245, .232); let BELLY = vec3f(.560, .545, .505);
  let tint = mix(vec3f(.94, 1., 1.06), vec3f(1.06, 1., .92), hue);
  var alb = mix(FLANK, BACK, ss(.45, .85, v)) * tint;
  let vb = .36 + .10 * (fbm(vec3f(s * 6., sd * 3., ax * 3.), 2) - .5);
  alb = mix(alb, BELLY * (.92 + .16 * mid), (1. - ss(vb - .07, vb + .07, v)));
  alb *= (.86 + .28 * big) * (.92 + .16 * mid);
  // ---- the skin: "minute, button-shaped, flank scales" (CS2001): a fine even grain over the whole body, faint folds,
  // not glossy. The lateral line a fine groove
  var fine = .5; var grain = .5;
  if (n2 > .01) { fine = fbm(op * vec3f(40., 120., 120.) + sd * 7., 2); }
  if (n1 > .01) { grain = wor(op * 900. + sd * 3.); }
  var hgt = .00025 * (fine - .5) * n2 * hull;
  // the lateral line: from behind the eye to the tail, a third of the way down from the back (estimate), a fine groove
  let latY = tb.x - .33 * (tb.x - tb.y);
  let lat = stethLine(abs(y - latY), .0012, fw) * ss(.09, .12, s) * hull;
  let den = .6 * max(hull, fins) + .4 * lat + crest + ringP;
  hgt += 0. - .0004 * lat + .00025 * (.5 - grain) * n1 * den;
  alb *= (1. - .25 * lat) * (1. + .12 * (.5 - grain) * n1 * den);
  // the gill slits: five narrow dark grooves
  let gl = stethGill(s, y, fw) * hull;
  alb = mix(alb, vec3f(.025, .02, .02), .85 * gl); hgt -= .0012 * gl;
  // the nostrils: just above the tip of the snout (estimate)
  let nose = (1. - ss(.0022, .0032, length(vec2f(s - .010, y - .001)))) * hull * step(.008, ax);
  alb *= 1. - .75 * nose; hgt -= .0015 * nose;
  // the lips: a little paler
  alb = mix(alb, FLANK * 1.25, (1. - ss(.002, .006, dl)) * step(s, .121) * hull);
  // ---- fins: the tone of the body where they sit; the pectoral fins pale below (the side that looks down)
  let finC = mix(FLANK, BACK, ss(-.02, .06, y)) * tint * (.86 + .28 * big) * (.92 + .16 * mid);
  alb = mix(alb, mix(finC, BELLY * .85, ss(-.3, -.8, ns.y) * step(y, -.03)), fins);
  // ---- the spine-brush complex: skin over cartilage, in the tone of the back. Its flat top and the patch on the head
  // carry the large denticles: pale grey, a little glossy (colour: estimate). The claspers in the tone of the belly
  alb = mix(alb, finC * 1.05, crest);
  alb = mix(alb, vec3f(.46, .44, .40) * (.9 + .2 * mid), dentP);
  alb = mix(alb, BELLY * .80 * (.9 + .2 * mid), clasp);
  // ---- teeth: off white, greyer at the base
  alb = mix(alb, mix(vec3f(.45, .43, .38), vec3f(.78, .75, .66), ss(.002, .007, dl)), teethP);
  // ---- inside the mouth: wet flesh. Grey at the lips, then mottled grey pink with fine dark red veins and folds;
  // darker the deeper; at the back five gill arches, deep red with fine filaments, under the slits
  let deep = ss(0., .23, s);
  let mot = fbm(op * 45. + sd * 5., 3);
  var inner = mix(vec3f(.32, .19, .18), vec3f(.20, .08, .075), ss(.35, .70, mot));
  inner = mix(FLANK * 1.3, inner, ss(.002, .010, dl));
  let vein = (1. - ss(0., .03, abs(fbm(op * vec3f(60., 90., 90.) + sd * 3., 2) - .5))) * stethNear(.004, fw);
  inner *= 1. - .40 * vein;
  let rug = 1. - ss(0., .14, abs(vn(vec3f(s * 25., y * 180., ax * 180.)) - .5));
  var arch = 0.;
  for (var k = 0; k < 5; k++) { arch += stethLine(abs(s - (.196 + .007 * f32(k))), .0024, fw); }
  let ang = atan2(y + .02, op.x);
  let fil = .5 + .5 * cos(ang * 160.);
  inner = mix(inner, vec3f(.40, .05, .045) * (.65 + .6 * fil * stethNear(.0015, fw)), sat(arch) * ss(.18, .19, s));
  inner *= (.80 + .35 * rug) * mix(1., .18, pow(deep, .8));
  alb = mix(alb, inner * (.88 + .24 * mid), mouthP);
  hgt += (.0016 * rug + .0010 * sat(arch) * fil - .0005 * vein) * mouthP;
  let mao = mix(.75, .20, deep) * (.65 + .35 * rug);
  // ---- the eye: large ("large orbits", W). Black pupil in a dark iris, a rim of skin around it
  let ev = p2 - vec2f(.064, .006); let ed = length(ev);
  let iris = vec3f(.20, .21, .17) * (.7 + .5 * fract(atan2(ev.y, ev.x) * 2.6));
  var eyeC = mix(iris, vec3f(.012, .012, .014), step(ed, .0080));
  alb = mix(alb, eyeC, eyeP);                                                     // the rim keeps the tone of the skin
  alb *= .92 + .16 * fract(sd * 13.7);
  // ---- light. The relief is in body lengths: times the length of the animal (about 1 m)
  let n = skinRelief(ns, i.wp, hgt * 1.0);
  let pup = eyeP * step(ed, .0080);
  let spec = .16 * hull + .10 * fins + .12 * crest + .35 * dentP + .40 * teethP + .55 * mouthP * mao + .10 * ringP;
  let shin = 14. + 26. * dentP + 30. * teethP + 60. * mouthP;
  let wet = .06 * hull + .30 * teethP + .08 * mouthP + 2.5 * eyeP;
  let c = stethLight(alb, n, ns, i.wp, spec, shin, wet, mix(1., mao, mouthP), mix(1., mao, mouthP));
  return fin(fog(c, i.wp, zone(i.wp)));
}
