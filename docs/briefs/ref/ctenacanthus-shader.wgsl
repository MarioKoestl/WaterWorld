// ============================================================================
// Reference shaders for Ctenacanthus, first version (brief: docs/briefs/ctenacanthus-build.md)
// ============================================================================
// Not loaded by the build. This is the whole text of S_CTENACANTHUS for
// source/eras/devonian/swimmers_ctenacanthus.js, for the mesh of docs/briefs/ref/ctenacanthus-mesh.js. Built on the
// shader of the Cladoselache; its light (ctenLight) is that of the Titanichthys, its motion that of
// docs/briefs/devonian-giants-motion.md. All functions carry the prefix cten: the shaders of an era share one module.
// It needs what W_ANIM gives every animal and S_SEA (dodge, skinRelief), which comes with the first kind of the era.
// This text has not been compiled: run `node tools/wgsl.mjs devonian` first.
// s is the distance from the snout in body lengths (s = .5 - z of the rest position), y its height.

// Instance: a.xyz = centre of its path, a.w = radius R of its path. b.x = seed, b.y = cruising speed in m/s (the sign
// is the direction), b.z = length in metres, b.w = seed2. Each animal swims alone. Path and distance along it are
// repeated in zooCtenacanthus: change one, change the other.

// where it swims: a circle with a slower one on top, so the path wanders; it rises and sinks a little. Every
// frequency is a multiple of 0.5, so the path repeats after 4 pi and the angle can be wrapped. a: the angle along it
fn ctenPath(c: vec3f, R: f32, a: f32, ph: f32) -> vec3f {
  return c + vec3f(R * cos(a) + .1 * R * cos(1.5 * a + ph), 1.2 * sin(2. * a + ph) + .5 * sin(3.5 * a + 2. * ph),
                   R * sin(a) + .1 * R * sin(1.5 * a + 1.7 * ph));
}
// the line of the shut mouth (it reaches back to 0.12), and behind its corner the line to the hinge
fn ctenMouthY(s: f32) -> f32 { return 0. - .012 - .016 * pow(sat(s / .12), 1.1) - .9 * max(s - .12, 0.); }
// back (x) and belly (y) of the body at s, every 0.05 from the snout: read off the mesh
fn ctenTB(s: f32) -> vec2f {
  var T = array<f32, 19>(.012, .038, .053, .062, .069, .073, .076, .077, .077, .075, .071,
    .065, .055, .045, .038, .030, .027, .040, .050);
  var B = array<f32, 19>(-.020, -.043, -.057, -.065, -.076, -.082, -.085, -.085, -.084, -.078, -.060,
    -.046, -.039, -.036, -.030, -.017, -.004, .010, .016);
  let f = clamp(s * 20., 0., 17.999); let k = i32(f); let u = f - f32(k);
  return vec2f(mix(T[k], T[k + 1], u), mix(B[k], B[k + 1], u));
}
// a line of half width w at distance d. Where a pixel is wider than the line, the line gets wider and fainter
fn ctenLine(d: f32, w: f32, fw: f32) -> f32 {
  let ww = max(w, 1.2 * fw); let q = d / ww; return exp(0. - q * q) * (w / ww);
}
// is a detail of size p still larger than a pixel?
fn ctenNear(p: f32, fw: f32) -> f32 { return 1. - ss(.2 * p, .5 * p, fw); }
// the five gill slits (s of each at its top; they slant back towards the belly), and how near a point is to one
fn ctenGill(s: f32, y: f32, fw: f32) -> f32 {
  var g = 0.;
  let sl = .24 * max(0. - .010 - y, 0.);
  for (var k = 0; k < 5; k++) { g += ctenLine(abs(s - (.170 + .009 * f32(k)) - sl), .0011, fw); }
  return sat(g) * ss(-.070, -.060, y) * (1. - ss(-.012, 0., y));
}
// The light: that of the Titanichthys (titanLight). The sun through the flecks of the surface; the light from around
// darkened in cavities (ao); the sheen on the surface with its relief; a wet sheen on the smooth shape only where `wet`
// says so
fn ctenLight(alb: vec3f, n: vec3f, ns: vec3f, wp: vec3f, spec: f32, shin: f32, wet: f32, ao: f32, sun: f32) -> vec3f {
  let V = normalize(g.cam.xyz - wp); let z = zone(wp); let L = g.sun.xyz; let H = normalize(V + L);
  let E = sunE(wp.y, z) * shadow4(wp + n * .3);
  let Ec = E * sun * (.45 + .55 * caus(wp, length(g.cam.xyz - wp)));
  let around = amb(wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vol(wp).g, z) * 1.1 + side(wp, n, 1., z) * .8;
  return alb * (Ec * sat(dot(n, L)) * .65 + around * ao)
    + Ec * spec * (shin + 8.) / 40. * pow(sat(dot(n, H)), shin)
    + E * wet * pow(sat(dot(ns, H)), 70.);
}
// a positive angle turns the nose DOWN
fn ctenRotY(p: vec3f, pivot: vec3f, angle: f32) -> vec3f {
  let d = p - pivot; let ca = cos(angle); let sa = sin(angle);
  return pivot + vec3f(d.x, d.y * ca - d.z * sa, d.y * sa + d.z * ca);
}
fn ctenRotN(nn: vec3f, angle: f32) -> vec3f {
  let ca = cos(angle); let sa = sin(angle); return vec3f(nn.x, nn.y * ca - nn.z * sa, nn.y * sa + nn.z * ca);
}

@vertex fn vsCtenacanthus(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let R = i.a.w; let ph = i.b.w * 17.; let sz = i.b.z;
  let v0 = abs(i.b.y); let L = .9 * R;               // L: metres of path per radian, about
  // ---- how far it has swum. Its cruising speed swells and ebbs slowly (two waves, 20 and 12 %, its own for each one)
  let f1 = .031 + .02 * fract(s * 7.31); let f2 = .083 + .03 * fract(s * 3.17);
  let q1 = f1 * t + 6.3 * fract(s * 5.13); let q2 = f2 * t + 6.3 * fract(s * 9.71);
  var dist = v0 * (t + .20 / f1 * sin(q1) + .12 / f2 * sin(q2));
  var vr = 1. + .20 * cos(q1) + .12 * cos(q2);       // speed in cruising speeds
  // ---- a strike: every 60 to 120 s it surges 4 m forward, about 2 m/s faster at its peak 0.8 s in, then glides out of
  // it. tau: seconds since the strike began. The surge is t/T0 e^(-t/T0), its distance the integral of that. A shark
  // with teeth for seizing prey (estimate: nothing is known of how it hunted)
  let lPer = 60. + 60. * fract(s * 13.7);
  let lc = t / lPer + fract(s * 2.9);
  let tau = fract(lc) * lPer;
  let ex = exp(0. - tau / .8);
  dist += (floor(lc) + 1. - (1. + tau / .8) * ex) * 4.;
  vr += 4. * tau / .64 * ex / v0;
  let push = ss(0., .3, tau) * (1. - ss(.7, 1.0, tau));
  let glide = ss(.9, 1.4, tau) * (1. - ss(3., 7., tau));
  // ---- the mouth: nearly shut while it swims (estimate). At the peak of the strike the snap (open in 0.08 s, 0.15 s
  // open, shut in 0.10 s), then two swallows
  let sT = tau - .85;
  let snap = sat(sT / .08) * (1. - sat((sT - .23) / .10));
  let cq = (tau - 1.6) / 1.0;
  let cw = sin(3.14159 * sat(fract(cq) / .55));
  let chew = (.30 - .10 * floor(cq)) * cw * cw * step(0., cq) * step(cq, 1.999);
  let mo = max(snap, chew);
  // ---- where on its path, and which way it faces. The sign of b.y says which way round it goes
  var a = sign(i.b.y) * dist / L + i.b.w * 6.3 + s * 3.7;
  a -= 12.566371 * floor(a / 12.566371);
  let e = .6 / L;
  let P = ctenPath(i.a.xyz, R, a, ph);
  let Pa = ctenPath(i.a.xyz, R, a + e, ph); let Pb = ctenPath(i.a.xyz, R, a - e, ph);
  let dd = .5 * length(Pa - Pb);
  let T = (Pa - Pb) / (2. * dd) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let kl = clamp(dot(Pa + Pb - 2. * P, S) / (dd * dd) * sz, -.6, .6);
  var l = i.p; var n = i.n.xyz;
  let lt = i.n.w; let sR = .5 - i.p.z;
  let isFin = step(.4, lt);
  let isJaw = sat(step(abs(lt - .25), .04) + step(abs(lt + .40), .04) + step(abs(lt + .70), .04));
  let wJ = (1. - ss(.12, .16, sR)) * isJaw;
  let wH = (1. - ss(.13, .20, sR)) * (1. - isFin);
  let jawA = (.04 + .55 * mo) * wJ;                 // the jaw drops about its hinge: 2 degrees swimming, 34 in the snap
  let headA = (0. - .01 - .06 * mo) * wH;
  l = ctenRotY(l, vec3f(0., -.030, .380), jawA);
  l = ctenRotY(l, vec3f(0., .045, .330), headA);
  n = ctenRotN(ctenRotN(n, jawA), headA);
  // ---- the tail beat: one beat per 0.7 body lengths swum, wider in the push of a strike, small while it glides
  let amp = (.85 + .15 * min(vr, 2.)) * (1. + .5 * push) * (1. - .6 * glide);
  let bp = TAU * dist / (.70 * sz) + s * 30.;
  // ---- the pectoral fins turn about a hinge at their root: they scull a little, steer (the fin on the inside of the
  // turn goes down) and spread down to brake while it glides after a strike
  let sx = select(-1., 1., i.p.x >= 0.);
  let pw = isFin * step(lt, .55) * ss(.222, .232, sR) * (1. - ss(.37, .39, sR)) * ss(.050, .080, abs(i.p.x))
    * step(i.p.y, -.02);
  let up = .06 * sin(.5 * bp + 6.3 * s) * (1. - glide) - clamp(1.5 * kl, -.25, .25) * sx - .25 * glide;
  let fa = sx * up * pw;
  let hg = vec2f(sx * .050, -.055); let dq = l.xy - hg;
  l = vec3f(hg + vec2f(dq.x * cos(fa) - dq.y * sin(fa), dq.x * sin(fa) + dq.y * cos(fa)), l.z);
  n = vec3f(n.x * cos(fa) - n.y * sin(fa), n.x * sin(fa) + n.y * cos(fa), n.z);
  // ---- the body. The front swings a little against the tail (recoil). The wave runs back from the middle, its
  // wavelength about one body length; in a turn the body lies along the curve of its path
  let yr = .025 * amp * sin(bp - .9);
  let u = max(0., .05 - l.z);
  let wv = bp + 6. * l.z;
  let Aw = .22 * amp;
  let bw = .3 + .7 * ss(-.05, .25, 0. - l.z);
  let zc = l.z;
  l.x += yr * (zc - .1) + Aw * u * u * sin(wv) + .5 * kl * zc * zc * bw;
  let sl = yr + Aw * (6. * u * u * cos(wv) - 2. * u * sin(wv)) + kl * zc * bw;
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  // ---- it banks into the turn, more when fast
  let rb = 0. - clamp(.6 * kl * min(vr, 1.5), -.25, .25);
  l = vec3f(l.x * cos(rb) - l.y * sin(rb), l.x * sin(rb) + l.y * cos(rb), l.z);
  n = vec3f(n.x * cos(rb) - n.y * sin(rb), n.x * sin(rb) + n.y * cos(rb), n.z);
  let w = dodge(P, .6 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = lt;
  return o;
}

@fragment fn fsCtenacanthus(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let lt = i.lt; let sd = i.sd; let op = i.op;
  let ax = abs(op.x); let y = op.y; let s = .5 - op.z; let p2 = vec2f(s, y);
  let fw = max(fwidth(op.x), max(fwidth(op.y), fwidth(op.z)));        // how much of the body one pixel covers
  // ---- parts by aux
  let hull = step(-.13, lt) * step(lt, .35); let fins = step(.4, lt) * step(lt, .55); let spineP = step(.55, lt);
  let mouthP = step(-.47, lt) * step(lt, -.13); let teethP = step(-.75, lt) * step(lt, -.47);
  let ringP = step(-.92, lt) * step(lt, -.75); let eyeP = step(lt, -.92);
  let tb = ctenTB(s); let v = sat((y - tb.y) / (tb.x - tb.y));     // v: 0 at the belly, 1 at the back
  let my = ctenMouthY(s); let dl = abs(y - my);
  let big = fbm(op * 6. + sd * 11., 3); let mid = fbm(op * 28. + sd * 3., 3); let hue = fbm(op * 3. + sd * 23. + 5., 2);
  let n4 = ctenNear(.004, fw); let n2 = ctenNear(.002, fw); let n1 = ctenNear(.001, fw);
  // ---- colour. Nothing is known of its colour: one plain tone, no pattern (the blue green of GQ is the artist's).
  // Dark grey brown along the back, paler on the flank, a pale belly with a soft border (estimate)
  let BACK = vec3f(.115, .115, .110); let FLANK = vec3f(.245, .240, .228); let BELLY = vec3f(.560, .550, .510);
  let tint = mix(vec3f(.94, 1., 1.06), vec3f(1.06, 1., .92), hue);
  var alb = mix(FLANK, BACK, ss(.45, .85, v)) * tint;
  let vb = .36 + .10 * (fbm(vec3f(s * 6., sd * 3., ax * 3.), 2) - .5);
  alb = mix(alb, BELLY * (.92 + .16 * mid), (1. - ss(vb - .07, vb + .07, v)));
  alb *= (.86 + .28 * big) * (.92 + .16 * mid);
  // ---- the skin: "leathery skin (shagreen)" on the body from the Cleveland Shale (KGS), "armoured with placoid
  // denticles" (Z1981, as summarised by OK): a fine even grain over the whole body, faint folds, not glossy. The
  // lateral line a fine groove
  var fine = .5; var grain = .5;
  if (n2 > .01) { fine = fbm(op * vec3f(40., 120., 120.) + sd * 7., 2); }
  if (n1 > .01) { grain = wor(op * 900. + sd * 3.); }
  var hgt = .00025 * (fine - .5) * n2 * hull;
  // the lateral line: from behind the eye to the tail, a third of the way down from the back (estimate), a fine groove
  let latY = tb.x - .33 * (tb.x - tb.y);
  let lat = ctenLine(abs(y - latY), .0012, fw) * ss(.09, .12, s) * hull;
  let den = .8 * max(hull, fins) + .4 * lat + ringP;
  hgt += 0. - .0004 * lat + .00025 * (.5 - grain) * n1 * den;
  alb *= (1. - .25 * lat) * (1. + .12 * (.5 - grain) * n1 * den);
  // the gill slits: five narrow dark grooves
  let gl = ctenGill(s, y, fw) * hull;
  alb = mix(alb, vec3f(.025, .02, .02), .85 * gl); hgt -= .0012 * gl;
  // the nostrils: just above the tip of the snout (estimate)
  let nose = (1. - ss(.0022, .0032, length(vec2f(s - .012, y - .002)))) * hull * step(.008, ax);
  alb *= 1. - .75 * nose; hgt -= .0015 * nose;
  // the lips: a little paler
  alb = mix(alb, FLANK * 1.25, (1. - ss(.002, .006, dl)) * step(s, .121) * hull);
  // ---- fins: the tone of the body where they sit; the pectoral fins pale below (the side that looks down)
  let finC = mix(FLANK, BACK, ss(-.02, .06, y)) * tint * (.86 + .28 * big) * (.92 + .16 * mid);
  alb = mix(alb, mix(finC, BELLY * .85, ss(-.3, -.8, ns.y) * step(y, -.03)), fins);
  // ---- the fin spines: "ornamented with narrow, closely spaced, longitudinal ... ridges or ribs" and many with "tiny
  // bumps" (KGS), the tip "finished by an outer coat of orthodentine" (Z1981). Pale grey brown, ribs along the spine,
  // small knobs on the ribs, a little glossy (colour: estimate)
  let rib = .5 + .5 * cos(op.x * TAU / .0012);
  var knob = .5;
  if (n1 > .01) { knob = wor(op * vec3f(300., 900., 900.) + sd); }
  let spC = vec3f(.40, .37, .32) * (.82 + .18 * rib * n1) * (.9 + .2 * mid) * (1. - .25 * ss(.3, .05, knob) * n1);
  alb = mix(alb, spC, spineP);
  hgt += (.00012 * rib + .00015 * ss(.3, .05, knob)) * n1 * spineP;
  // ---- teeth: off white, greyer at the base
  alb = mix(alb, mix(vec3f(.45, .43, .38), vec3f(.78, .75, .66), ss(.002, .007, dl)), teethP);
  // ---- inside the mouth: wet flesh. Grey at the lips, then mottled grey pink with fine dark red veins and folds;
  // darker the deeper; at the back five gill arches, deep red with fine filaments, under the slits
  let deep = ss(0., .22, s);
  let mot = fbm(op * 45. + sd * 5., 3);
  var inner = mix(vec3f(.32, .19, .18), vec3f(.20, .08, .075), ss(.35, .70, mot));
  inner = mix(FLANK * 1.3, inner, ss(.002, .010, dl));
  let vein = (1. - ss(0., .03, abs(fbm(op * vec3f(60., 90., 90.) + sd * 3., 2) - .5))) * ctenNear(.004, fw);
  inner *= 1. - .40 * vein;
  let rug = 1. - ss(0., .14, abs(vn(vec3f(s * 25., y * 180., ax * 180.)) - .5));
  var arch = 0.;
  for (var k = 0; k < 5; k++) { arch += ctenLine(abs(s - (.172 + .009 * f32(k))), .0028, fw); }
  let ang = atan2(y + .02, op.x);
  let fil = .5 + .5 * cos(ang * 160.);
  inner = mix(inner, vec3f(.40, .05, .045) * (.65 + .6 * fil * ctenNear(.0015, fw)), sat(arch) * ss(.155, .165, s));
  inner *= (.80 + .35 * rug) * mix(1., .18, pow(deep, .8));
  alb = mix(alb, inner * (.88 + .24 * mid), mouthP);
  hgt += (.0016 * rug + .0010 * sat(arch) * fil - .0005 * vein) * mouthP;
  let mao = mix(.75, .20, deep) * (.65 + .35 * rug);
  // ---- the eye: GQ about 0.016 across. Black pupil in a dark iris, a rim of skin around it
  let ev = p2 - vec2f(.063, .006); let ed = length(ev);
  let iris = vec3f(.20, .21, .17) * (.7 + .5 * fract(atan2(ev.y, ev.x) * 2.6));
  var eyeC = mix(iris, vec3f(.012, .012, .014), step(ed, .0050));
  alb = mix(alb, eyeC, eyeP);                                                     // the rim keeps the tone of the skin
  alb *= .92 + .16 * fract(sd * 13.7);
  // ---- light. The relief is in body lengths: times the length of the animal (about 1.6 m)
  let n = skinRelief(ns, i.wp, hgt * 1.6);
  let pup = eyeP * step(ed, .0050);
  let spec = .14 * hull + .10 * fins + .35 * spineP + .40 * teethP + .55 * mouthP * mao + .10 * ringP;
  let shin = 12. + 26. * spineP + 30. * teethP + 60. * mouthP;
  let wet = .06 * hull + .30 * teethP + .08 * mouthP + 2.5 * eyeP;
  let c = ctenLight(alb, n, ns, i.wp, spec, shin, wet, mix(1., mao, mouthP), mix(1., mao, mouthP));
  return fin(fog(c, i.wp, zone(i.wp)));
}
