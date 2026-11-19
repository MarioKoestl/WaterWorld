// ============================================================================
// Reference shaders for Cladoselache, first version (brief: docs/briefs/cladoselache-build.md)
// ============================================================================
// Not loaded by the build. This is the whole text of S_CLADOSELACHE for source/eras/devonian/swimmers_cladoselache.js,
// for the mesh of docs/briefs/ref/cladoselache-mesh.js. Its light (cladoLight) is that of the Titanichthys; its motion
// follows docs/briefs/devonian-giants-motion.md, for a group. All functions carry the prefix clado: the shaders of an
// era share one module. It needs what W_ANIM gives every animal and S_SEA (dodge, skinRelief), which comes with the
// first kind of the era. This text has not been compiled: run `node tools/wgsl.mjs devonian` first.
// s is the distance from the snout in body lengths (s = .5 - z of the rest position), y its height.

// Instance: a.xyz = centre of the path of its group, a.w = radius R of that path. b.x = seed of the animal, b.y =
// cruising speed of the group in m/s (the sign is the direction), b.z = length in metres, b.w = seed of the group.
// The group swims its path together; each animal keeps its place in the group but strikes on its own. Path and
// distance of the group are repeated in zooCladoselache: change one, change the other.

// where the group swims: a circle with a slower one on top, so the path wanders; it rises and sinks a little. Every
// frequency is a multiple of 0.5, so the path repeats after 4 pi and the angle can be wrapped. a: the angle along it
fn cladoPath(c: vec3f, R: f32, a: f32, ph: f32) -> vec3f {
  return c + vec3f(R * cos(a) + .1 * R * cos(1.5 * a + ph), 1.5 * sin(2. * a + ph) + .6 * sin(3.5 * a + 2. * ph),
                   R * sin(a) + .1 * R * sin(1.5 * a + 1.7 * ph));
}
// the line of the shut mouth (it reaches back to 0.135), and behind its corner the line to the hinge
fn cladoMouthY(s: f32) -> f32 { return 0. - .004 - .034 * pow(sat(s / .135), 1.1) - .9 * max(s - .135, 0.); }
// back (x) and belly (y) of the body at s, every 0.05 from the snout: read off the mesh
fn cladoTB(s: f32) -> vec2f {
  var T = array<f32, 19>(.013, .038, .053, .064, .073, .077, .078, .078, .077, .074, .071,
    .067, .061, .053, .045, .037, .032, .031, .036);
  var B = array<f32, 19>(-.011, -.041, -.055, -.065, -.071, -.074, -.075, -.074, -.071, -.066, -.061,
    -.055, -.047, -.036, -.023, -.010, -.002, .001, .008);
  let f = clamp(s * 20., 0., 17.999); let k = i32(f); let u = f - f32(k);
  return vec2f(mix(T[k], T[k + 1], u), mix(B[k], B[k + 1], u));
}
// a line of half width w at distance d. Where a pixel is wider than the line, the line gets wider and fainter
fn cladoLine(d: f32, w: f32, fw: f32) -> f32 {
  let ww = max(w, 1.2 * fw); let q = d / ww; return exp(0. - q * q) * (w / ww);
}
// is a detail of size p still larger than a pixel?
fn cladoNear(p: f32, fw: f32) -> f32 { return 1. - ss(.2 * p, .5 * p, fw); }
// the five gill slits (s of each), and how near a point is to one of them on the flank
fn cladoGill(s: f32, y: f32, fw: f32) -> f32 {
  var g = 0.;
  for (var k = 0; k < 5; k++) { g += cladoLine(abs(s - (.158 + .01375 * f32(k))), .0013, fw); }
  return sat(g) * ss(-.052, -.040, y) * (1. - ss(.018, .034, y));
}
// The light: that of the Titanichthys (titanLight). The sun through the flecks of the surface; the light from around
// darkened in cavities (ao); the sheen on the surface with its relief; a wet sheen on the smooth shape only where `wet`
// says so
fn cladoLight(alb: vec3f, n: vec3f, ns: vec3f, wp: vec3f, spec: f32, shin: f32, wet: f32, ao: f32, sun: f32) -> vec3f {
  let V = normalize(g.cam.xyz - wp); let z = zone(wp); let L = g.sun.xyz; let H = normalize(V + L);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  let Ec = E * sun * (.45 + .55 * caus(wp, length(g.cam.xyz - wp)));
  let around = amb(wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vol(wp).g, z) * 1.1 + side(wp, n, 1., z) * .8;
  return alb * (Ec * sat(dot(n, L)) * .65 + around * ao)
    + Ec * spec * (shin + 8.) / 40. * pow(sat(dot(n, H)), shin)
    + E * wet * pow(sat(dot(ns, H)), 70.);
}
// a positive angle turns the nose DOWN
fn cladoRotY(p: vec3f, pivot: vec3f, angle: f32) -> vec3f {
  let d = p - pivot; let ca = cos(angle); let sa = sin(angle);
  return pivot + vec3f(d.x, d.y * ca - d.z * sa, d.y * sa + d.z * ca);
}
fn cladoRotN(nn: vec3f, angle: f32) -> vec3f {
  let ca = cos(angle); let sa = sin(angle); return vec3f(nn.x, nn.y * ca - nn.z * sa, nn.y * sa + nn.z * ca);
}

@vertex fn vsCladoselache(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x; let gs = i.b.w;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w; let ph = gs * 17.; let sz = i.b.z;
  let v0 = abs(i.b.y); let L = .9 * R;               // L: metres of path per radian, about
  // ---- how far the group has swum. Its cruising speed swells and ebbs slowly (two waves, 20 and 12 %, its own for
  // each group)
  let f1 = .031 + .02 * fract(gs * 7.31); let f2 = .083 + .03 * fract(gs * 3.17);
  let q1 = f1 * t + 6.3 * fract(gs * 5.13); let q2 = f2 * t + 6.3 * fract(gs * 9.71);
  let gdist = v0 * (t + .20 / f1 * sin(q1) + .12 / f2 * sin(q2));
  var vr = 1. + .20 * cos(q1) + .12 * cos(q2);       // speed in cruising speeds
  // ---- the strike of one animal: every 40 to 90 s (its own time) it shoots ahead of its group, about 2 m in a second
  // (up to about 5 m/s), and falls back over the next 10 to 20 s. tau: seconds since the strike began. Its lead is
  // 2.5 (1 - e^(-tau/0.6)) e^(-tau/8) metres, so it never swims backwards (it falls back at 0.3 m/s at most; the
  // group swims at 0.5 m/s at least). At the end of a period the lead jumps by about 2 cm
  let lPer = 40. + 50. * fract(s * 13.7);
  let tau = fract(t / lPer + fract(s * 2.9)) * lPer;
  let e1 = exp(0. - tau / .6); let e2 = exp(0. - tau / 8.);
  let lead = 2.5 * (1. - e1) * e2;
  vr += 2.5 * (e1 / .6 * e2 - (1. - e1) * e2 / 8.) / v0;
  let push = ss(0., .15, tau) * (1. - ss(.5, .9, tau));     // the tail drives hard into the strike
  let glide = ss(.8, 1.2, tau) * (1. - ss(2.5, 6., tau));   // and nearly rests while it glides after it
  // ---- the mouth. Slightly open while it swims (a shark that breathes by swimming, as the mackerel sharks: estimate).
  // In the strike: open in 0.08 s, open 0.15 s, shut in 0.10 s; then two swallows. Its prey was swallowed whole, tail
  // first (W)
  let sT = tau - .35;
  let snap = sat(sT / .08) * (1. - sat((sT - .23) / .10));
  let cq = (tau - 1.2) / 1.0;
  let cw = sin(3.14159 * sat(fract(cq) / .55));
  let chew = (.30 - .10 * floor(cq)) * cw * cw * step(0., cq) * step(cq, 1.999);
  let mo = max(snap, chew);
  // ---- where on the path of its group, and which way it faces. kl: how sharply the path turns, per body length
  // (+ toward S). The animal keeps its own place in the group: its lead along the path, its offset across
  var a = sign(i.b.y) * (gdist + lead) / L + gs * 6.3 + (h.x - .5) * (6. / R);
  a -= 12.566371 * floor(a / 12.566371);
  let e = .6 / L;
  let P = cladoPath(i.a.xyz, R, a, ph);
  let Pa = cladoPath(i.a.xyz, R, a + e, ph); let Pb = cladoPath(i.a.xyz, R, a - e, ph);
  let dd = .5 * length(Pa - Pb);
  let T = (Pa - Pb) / (2. * dd) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let kl = clamp(dot(Pa + Pb - 2. * P, S) / (dd * dd) * sz, -.6, .6);
  let off = S * ((h.y - .5) * 3. + sin(t * .11 + s * 20.) * .5) + Up * ((h.z - .5) * 1.5 + cos(t * .09 + s * 15.) * .3);
  var l = i.p; var n = i.n.xyz;
  let lt = i.n.w; let sR = .5 - i.p.z;
  let isFin = step(.4, lt);
  let isJaw = sat(step(abs(lt - .25), .04) + step(abs(lt + .40), .04) + step(abs(lt + .70), .04));
  let wJ = (1. - ss(.13, .17, sR)) * isJaw;
  let wH = (1. - ss(.14, .22, sR)) * (1. - isFin);
  let jawA = (.07 + .55 * mo) * wJ;                 // the jaw drops about its hinge: 4 degrees swimming, 36 in the snap
  let headA = (0. - .01 - .07 * mo) * wH;           // the head lifts a little
  l = cladoRotY(l, vec3f(0., -.040, .365), jawA);
  l = cladoRotY(l, vec3f(0., .050, .320), headA);
  n = cladoRotN(cladoRotN(n, jawA), headA);
  // ---- the tail beat: one beat per 0.75 body lengths swum, so it beats faster when it swims faster
  let amp = (.85 + .15 * min(vr, 2.)) * (1. + .6 * push) * (1. - .7 * glide);
  let bp = TAU * (gdist + lead) / (.75 * sz) + s * 30.;
  // ---- the pectoral fins turn about a hinge at their root: they scull a little, steer (the fin on the inside of the
  // turn goes down) and spread down to brake while it glides after a strike
  let sx = select(-1., 1., i.p.x >= 0.);
  let pw = isFin * ss(.225, .235, sR) * (1. - ss(.35, .37, sR)) * ss(.075, .11, abs(i.p.x));
  let up = .06 * sin(.5 * bp + 6.3 * s) * (1. - glide) - clamp(1.5 * kl, -.25, .25) * sx - .25 * glide;
  let fa = sx * up * pw;
  let hg = vec2f(sx * .075, -.050); let dq = l.xy - hg;
  l = vec3f(hg + vec2f(dq.x * cos(fa) - dq.y * sin(fa), dq.x * sin(fa) + dq.y * cos(fa)), l.z);
  n = vec3f(n.x * cos(fa) - n.y * sin(fa), n.x * sin(fa) + n.y * cos(fa), n.z);
  // ---- the body. The front swings a little against the tail (recoil). The wave runs back from the middle, its
  // wavelength about one body length, so the tail lags behind the stalk; most of the bending in the rear, as in the
  // mackerel sharks it is compared with (W). In a turn the body lies along the curve of its path
  let yr = .025 * amp * sin(bp - .9);
  let u = max(0., .05 - l.z);
  let wv = bp + 6. * l.z;
  let Aw = .20 * amp;
  let bw = .3 + .7 * ss(-.05, .25, 0. - l.z);
  let zc = l.z;
  l.x += yr * (zc - .1) + Aw * u * u * sin(wv) + .5 * kl * zc * zc * bw;
  let sl = yr + Aw * (6. * u * u * cos(wv) - 2. * u * sin(wv)) + kl * zc * bw;
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  // ---- it banks into the turn, more when fast
  let rb = 0. - clamp(.6 * kl * min(vr, 1.5), -.25, .25);
  l = vec3f(l.x * cos(rb) - l.y * sin(rb), l.x * sin(rb) + l.y * cos(rb), l.z);
  n = vec3f(n.x * cos(rb) - n.y * sin(rb), n.x * sin(rb) + n.y * cos(rb), n.z);
  let w = dodge(P + off, .5 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = lt;
  return o;
}

@fragment fn fsCladoselache(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let lt = i.lt; let sd = i.sd; let op = i.op;
  let ax = abs(op.x); let y = op.y; let s = .5 - op.z; let p2 = vec2f(s, y);
  let fw = max(fwidth(op.x), max(fwidth(op.y), fwidth(op.z)));        // how much of the body one pixel covers
  // ---- parts by aux
  let hull = step(-.13, lt) * step(lt, .35); let fins = step(.4, lt) * step(lt, .55); let spineP = step(.55, lt);
  let mouthP = step(-.47, lt) * step(lt, -.13); let teethP = step(-.75, lt) * step(lt, -.47);
  let ringP = step(-.92, lt) * step(lt, -.75); let eyeP = step(lt, -.92);
  let tb = cladoTB(s); let v = sat((y - tb.y) / (tb.x - tb.y));     // v: 0 at the belly, 1 at the back
  let my = cladoMouthY(s); let dl = abs(y - my);
  let big = fbm(op * 6. + sd * 11., 3); let mid = fbm(op * 28. + sd * 3., 3); let hue = fbm(op * 3. + sd * 23. + 5., 2);
  let n4 = cladoNear(.004, fw); let n2 = cladoNear(.002, fw); let n1 = cladoNear(.001, fw);
  // ---- colour. Nothing is known of its colour: one plain tone, no pattern. Dark grey along the back, paler on the
  // flank, a pale belly with a soft border, as in nearly every shark of the open water today (estimate)
  let BACK = vec3f(.110, .120, .130); let FLANK = vec3f(.240, .250, .250); let BELLY = vec3f(.580, .570, .530);
  let tint = mix(vec3f(.94, 1., 1.06), vec3f(1.06, 1., .92), hue);
  var alb = mix(FLANK, BACK, ss(.45, .85, v)) * tint;
  let vb = .36 + .10 * (fbm(vec3f(s * 6., sd * 3., ax * 3.), 2) - .5);
  alb = mix(alb, BELLY * (.92 + .16 * mid), (1. - ss(vb - .07, vb + .07, v)));
  alb *= (.86 + .28 * big) * (.92 + .16 * mid);
  // ---- the skin: "mostly naked" (W): smooth, with faint folds over the muscle and fine pores, not glossy. Tiny blunt
  // denticles only "on the edges of the fins, around mouth and eyes and along the lateral line" (W): there a fine grain
  var fine = .5; var grain = .5;
  if (n2 > .01) { fine = fbm(op * vec3f(40., 120., 120.) + sd * 7., 2); }
  if (n1 > .01) { grain = wor(op * 900. + sd * 3.); }
  var hgt = .00025 * (fine - .5) * n2 * hull;
  // the lateral line: from behind the eye to the tail, a third of the way down from the back (estimate), a fine groove
  // with a row of denticles
  let latY = tb.x - .33 * (tb.x - tb.y);
  let lat = cladoLine(abs(y - latY), .0012, fw) * ss(.09, .12, s) * hull;
  let ed0 = length(p2 - vec2f(.070, .012));
  let den = max(max(lat, (1. - ss(.016, .024, ed0)) * hull),
    max((1. - ss(.004, .012, dl)) * step(s, .14) * hull, fins * .6)) + ringP;
  hgt += 0. - .0004 * lat + .00025 * (.5 - grain) * n1 * den;
  alb *= (1. - .25 * lat) * (1. + .12 * (.5 - grain) * n1 * den);
  // the gill slits: five narrow dark grooves
  let gl = cladoGill(s, y, fw) * hull;
  alb = mix(alb, vec3f(.025, .02, .02), .85 * gl); hgt -= .0012 * gl;
  // the nostrils: large, far forward (W)
  let nose = (1. - ss(.0030, .0042, length(vec2f(s - .016, y - .012)))) * hull * step(.010, ax);
  alb *= 1. - .75 * nose; hgt -= .0015 * nose;
  // the lips: a little paler
  alb = mix(alb, FLANK * 1.25, (1. - ss(.002, .006, dl)) * step(s, .136) * hull);
  // ---- fins: the tone of the body where they sit; the pectoral fins pale below (the side that looks down)
  let finC = mix(FLANK, BACK, ss(-.02, .06, y)) * tint * (.86 + .28 * big) * (.92 + .16 * mid);
  alb = mix(alb, mix(finC, BELLY * .85, ss(-.3, -.8, ns.y) * step(y, -.03)), fins);
  // ---- the fin spine: dentine and enamel (a summary on the Fossil Wiki; not checked against a paper), colour:
  // estimate. Pale grey, lines of growth along it, glossy
  let growth = .5 + .5 * cos((y - tb.x) * TAU / .003);
  alb = mix(alb, vec3f(.50, .48, .43) * (.94 + .06 * growth * n2) * (.9 + .2 * mid), spineP);
  hgt += .00008 * growth * n2 * spineP;
  // ---- teeth: off white, greyer at the base
  alb = mix(alb, mix(vec3f(.45, .43, .38), vec3f(.78, .75, .66), ss(.002, .007, dl)), teethP);
  // ---- inside the mouth: wet flesh. Grey at the lips, then mottled grey pink with fine dark red veins and folds;
  // darker the deeper; at the back five gill arches, deep red with fine filaments, under the slits
  let deep = ss(0., .22, s);
  let mot = fbm(op * 45. + sd * 5., 3);
  var inner = mix(vec3f(.32, .19, .18), vec3f(.20, .08, .075), ss(.35, .70, mot));
  inner = mix(FLANK * 1.3, inner, ss(.002, .010, dl));
  let vein = (1. - ss(0., .03, abs(fbm(op * vec3f(60., 90., 90.) + sd * 3., 2) - .5))) * cladoNear(.004, fw);
  inner *= 1. - .40 * vein;
  let rug = 1. - ss(0., .14, abs(vn(vec3f(s * 25., y * 180., ax * 180.)) - .5));
  var arch = 0.;
  for (var k = 0; k < 5; k++) { arch += cladoLine(abs(s - (.158 + .01375 * f32(k))), .0030, fw); }
  let ang = atan2(y + .02, op.x);
  let fil = .5 + .5 * cos(ang * 160.);
  inner = mix(inner, vec3f(.40, .05, .045) * (.65 + .6 * fil * cladoNear(.0015, fw)), sat(arch) * ss(.14, .15, s));
  inner *= (.80 + .35 * rug) * mix(1., .18, pow(deep, .8));
  alb = mix(alb, inner * (.88 + .24 * mid), mouthP);
  hgt += (.0016 * rug + .0010 * sat(arch) * fil - .0005 * vein) * mouthP;
  let mao = mix(.75, .20, deep) * (.65 + .35 * rug);
  // ---- the eye: large. Black pupil in a dark iris; around it the ring of small plates under the skin (W), in the tone
  // of the skin with its grain
  let ev = p2 - vec2f(.070, .012); let ed = length(ev);
  let iris = vec3f(.20, .21, .17) * (.7 + .5 * fract(atan2(ev.y, ev.x) * 2.6));
  var eyeC = mix(iris, vec3f(.012, .012, .014), step(ed, .0075));
  alb = mix(alb, eyeC, eyeP);
  alb = mix(alb, finC * 1.15, ringP);
  alb *= .92 + .16 * fract(sd * 13.7);
  // ---- light. The relief is in body lengths: times the length of the animal (about 1.8 m)
  let n = skinRelief(ns, i.wp, hgt * 1.8);
  let pup = eyeP * step(ed, .0075);
  let spec = .16 * hull + .10 * fins + .45 * spineP + .40 * teethP + .55 * mouthP * mao + .10 * ringP;
  let shin = 14. + 26. * spineP + 30. * teethP + 60. * mouthP;
  let wet = .06 * hull + .30 * teethP + .08 * mouthP + 2.5 * eyeP;
  let c = cladoLight(alb, n, ns, i.wp, spec, shin, wet, mix(1., mao, mouthP), mix(1., mao, mouthP));
  return fin(fog(c, i.wp, zone(i.wp)));
}
