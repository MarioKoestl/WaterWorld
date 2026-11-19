// ============================================================================
// Reference shaders for Concavicaris (brief: docs/briefs/concavicaris-build.md)
// ============================================================================
// Not loaded by the build. This is the whole text of S_CONCAVICARIS for source/eras/devonian/swimmers_concavicaris.js,
// for the mesh of docs/briefs/ref/concavicaris-mesh.js. It needs what the other animals of the era give it (ss, sat,
// hs, vn, zone, fog, fin, caus, amb, side, sunE, vol, dodge, skinRelief), as before. This text has not been compiled:
// run node tools/wgsl.mjs devonian first.
// s is the distance from the front tip of the shell in shell lengths (s = .5 - z of the rest position), y its height.

// Instance (unchanged): a.xyz = centre of the swarm's path, a.w = its radius R. b.x = seed of the animal, b.y = speed
// of the swarm in radians per second (the sign is the direction), b.z = length in metres, b.w = seed of the swarm. The
// path of the swarm is repeated in zooConcavicaris: change one, change the other.

// the back and the lower edge of the shell at s, every 0.05 (as TOP and LOW in the mesh, with the notch of the eye)
fn ccShell(s: f32) -> vec2f {
  var T = array<f32, 21>(.107, .156, .185, .198, .208, .214, .218, .220, .222, .221, .220, .218, .216, .211, .204, .194,
    .181, .165, .146, .123, .097);
  var B = array<f32, 21>(-.090, -.150, -.168, -.178, -.185, -.197, -.208, -.215, -.220, -.223, -.224, -.218, -.208,
    -.198, -.185, -.168, -.150, -.131, -.111, -.088, -.068);
  let f = clamp(s * 20., 0., 19.999); let k = i32(f); let u = f - f32(k);
  let t = mix(T[k], T[k + 1], u); let b = mix(B[k], B[k + 1], u);
  return vec2f(t, t - (t - b) * ss(.015, .105, s));
}
// a line of half width w at distance d. Where a pixel is wider than the line, the line gets wider and fainter
fn ccLine(d: f32, w: f32, fw: f32) -> f32 {
  let ww = max(w, 1.2 * fw); let q = d / ww; return exp(0. - q * q) * (w / ww);
}
// turn p about the line through pivot (y, z) along x: a positive angle swings a point below the pivot backward (to
// -z) and a point in front of it down
fn ccRotX(p: vec3f, pivot: vec2f, a: f32) -> vec3f {
  let d = p.yz - pivot; let c = cos(a); let sn = sin(a);
  return vec3f(p.x, pivot + vec2f(d.x * c - d.y * sn, d.y * c + d.x * sn));
}
fn ccRotXN(n: vec3f, a: f32) -> vec3f {
  let c = cos(a); let sn = sin(a); return vec3f(n.x, n.y * c - n.z * sn, n.z * c + n.y * sn);
}

@vertex fn vsConcavicaris(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w;
  // ---- the swarm's path, as before; each animal at its own place in the swarm
  let ta = t * i.b.y + i.b.w * 6.3 + (h.x - .5) * (10. / R);
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), 1. * sin(2. * ta + ph), R * .6 * sin(ta));
  let T = normalize(vec3f(0. - R * sin(ta), 2. * cos(2. * ta + ph), R * .6 * cos(ta))) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let off = S * ((h.y - .5) * 1. + sin(t * .5 + s * 30.) * .15) + Up * ((h.z - .5) * .8 + cos(t * .4 + s * 20.) * .1);
  var l = i.p; var n = i.n.xyz; let lt = i.n.w;
  let sz = i.b.z * (.90 + .2 * h.z);
  // ---- the paddles: eight pairs beat one after another, the rear one first, so that a wave runs forward along them
  // (estimate: 2 to 3.5 beats a second). Each turns about its root; the power stroke swings it back
  let wb = TAU * (2. + 1.5 * h.x) * t + 20. * s;
  let isP = step(.79, lt);
  let pk = round((lt - .80) / .0236);
  let pa = (.10 + .38 * sin(wb + .8 * pk)) * isP;
  l = ccRotX(l, vec2f(-.110, .5 - (.60 + .048 * pk)), pa);
  n = ccRotXN(n, pa);
  // the whole animal rises and dips a little with the beat, its front pitching up as the paddles push
  let bob = .004 * sin(wb + 2.);
  let pitch = 0. - .025 * sin(wb + 1.) - .05;
  // ---- the arms for catching: they hang folded and sway a little; every 6 to 14 s, in about every second cycle, they
  // shoot forward and up in 0.12 s, as if to grab, and fold back in 0.8 s (estimate)
  let cPer = 6. + 8. * hs(s + .53); let cc = t / cPer + hs(s + .91); let ck = floor(cc); let tau = fract(cc) * cPer;
  let grab = step(.5, hs(ck * 1.37 + s * 7.1)) * ss(0., .12, tau) * (1. - ss(.25, 1.05, tau));
  let isA = step(abs(lt - .6), .02);
  let aa = (.06 * sin(t * 1.3 + 7. * s + 9. * l.x) - 1.0 * grab) * isA;
  l = ccRotX(l, vec2f(-.150, .5 - .175), aa);
  n = ccRotXN(n, aa);
  // the pitch of the whole animal about its middle
  l = ccRotX(l, vec2f(0., 0.), pitch); n = ccRotXN(n, pitch);
  l.y += bob;
  let w = dodge(P + off, .5 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = lt;
  return o;
}

@fragment fn fsConcavicaris(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let ax = abs(i.op.x); let y = i.op.y; let s = .5 - i.op.z; let lt = i.lt;
  let fw = max(fwidth(i.op.x), max(fwidth(i.op.y), fwidth(i.op.z)));
  let near = 1. - ss(.002, .006, fw);                                       // details fade out with distance
  let h1 = hs(i.sd * 7.); let h2 = hs(i.sd * 23.);
  // ---- parts by aux
  let shell = step(abs(lt), .04); let edgeP = step(abs(lt - .10), .03); let body = step(abs(lt - .2), .03);
  let gill = step(abs(lt - .25), .02); let arm = step(abs(lt - .6), .025); let pad = step(.79, lt);
  let eye = step(lt, -.5);
  let joint = sat((.6 - lt) / .016) * arm;
  // the inside of the shell is the side that faces the middle of the animal
  let outside = select(1., 0., dot(ns, vec3f(sign(i.op.x), 0., 0.)) < 0.);
  let sh = ccShell(s); let v = sat((sh.x - y) / max(sh.x - sh.y, .01));   // 0 at the back, 1 at the lower edge
  let dep = sh.x - sh.y;
  // where the body lies under the shell (as in the mesh): the shell is thin, the body shows through as a shade
  let yc = sh.x * .55 + sh.y * .45 - .035;
  let fb = pow(sin(3.14159 * sat((s - .05) / .99)), .3) * (1. - .35 * ss(.6, 1., s));
  let under = (1. - ss(.75, 1.05, abs(y - yc) / max(.12 * fb, .01))) * ss(.06, .14, s);
  var hgt = 0.;
  // ---- the shell. Its surface after JHK2020: smooth, a fine net of many-sided cells (SEM, seen only from close by),
  // small pits scattered over it (Fig. 1a, f), a row of pits along the lower edge (Fig. 1c), the raised rim (the mesh),
  // a groove inside the rim, and a shallow depression from near the rear end up to the middle (Fig. 1b). Besides: the
  // line of the hinge and a gentle unevenness, as of a thin shell of chitin (estimate)
  let cq = vec2f(s, y) / .010; let ci = floor(cq); var d1 = 9.; var d2 = 9.;
  if (near > .01) {
    for (var a = -1; a <= 1; a++) { for (var b = -1; b <= 1; b++) {
      let o2 = vec2f(f32(a), f32(b));
      let r = ci + o2 + vec2f(hs(dot(ci + o2, vec2f(1.7, 9.2))), hs(dot(ci + o2, vec2f(8.3, 2.8)))) - cq;
      let dd = dot(r, r); if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) { d2 = dd; }
    } }
  }
  let net = (1. - ss(0., .08, sqrt(d2) - sqrt(d1))) * near;
  let pc = vec2f(s, y) / .022; let pi = floor(pc);
  let pr = fract(pc) - (.25 + .5 * vec2f(hs(dot(pi, vec2f(3.1, 7.7)) + i.sd), hs(dot(pi, vec2f(5.3, 1.9)) + i.sd)));
  let pit = (1. - ss(.10, .17, length(pr))) * step(.72, hs(dot(pi, vec2f(2.3, 4.1)))) * near;
  let rowp = (1. - ss(.25, .45, length(vec2f(fract(s / .022) - .5, (v - .93) * dep / .010)))) * ss(.18, .25, s) * near;
  let groove = ccLine(abs(v - .90) * dep, .004, fw) * ss(.12, .2, s);
  let dq = vec2f(s - .44, v - .78); let dl = vec2f(.42, -.38);
  let dpr = length(dq - dl * clamp(dot(dq, dl) / dot(dl, dl), 0., 1.) * vec2f(1., 1.));
  let depr = exp(0. - pow(dpr / .05, 2.));
  let hinge = ccLine(ax, .004, fw);
  let uneven = vn(i.op * 14. + i.sd * 5.) - .5;
  hgt += (.0003 * (1. - net) - .0012 * pit - .0010 * rowp - .0020 * groove - .0030 * depr - .0015 * hinge
    + .0015 * uneven) * shell * outside;
  // ---- colours. The colour of the living animal is not known: chitin of one tone, darker where the shell is thicker
  // (along the hinge) and where the body lies under it, lighter and clearer at the thin edges. No pattern
  let CH = vec3f(.56, .43, .27);
  let mot = fbm(i.op * 9. + i.sd * 3., 3);                                   // the shell is not even: faint unevenness
  var alb = CH * (.92 + .16 * h1) * mix(vec3f(1.03, 1., .95), vec3f(.96, 1., 1.03), h2) * (.88 + .24 * mot);
  alb *= (1. - .30 * ss(.25, .02, v) * shell) * (1. + .12 * ss(.6, .95, v) * shell);
  alb *= 1. - .28 * under * shell * outside;
  alb *= 1. - .10 * net * shell - .12 * pit * shell - .12 * rowp * shell - .25 * groove * shell - .12 * depr * shell
    - .25 * hinge * shell;
  alb = mix(alb * .50, alb, outside * shell + (1. - shell));               // the inside of the shell
  alb = mix(alb, CH * 1.25 + vec3f(.04, .03, .02), edgeP);                 // the thin edge
  // ---- the body: soft and pale, ringed behind the middle; the gills: thin leaves with fine folds
  let ring = 1. - ss(.15, .40, abs(fract((s - .50) / .055) - .5)) * ss(.48, .55, s);
  alb = mix(alb, vec3f(.36, .30, .27) * (1. - .25 * (1. - ring)) * (.9 + .2 * mot), body);
  let lam = .5 + .5 * sin(i.op.z * 900. + i.op.y * 300.);
  alb = mix(alb, vec3f(.50, .38, .34) * (.75 + .3 * lam * near), gill);
  hgt += (.0006 * (ring - 1.) * body + .0003 * lam * gill) * near;
  // ---- the arms: pieces of hard chitin, the joints between them soft and darker; the spines pale at their tips
  alb = mix(alb, CH * .85 * (1. - .55 * joint) * (.9 + .2 * mot), arm);
  // ---- the paddles: thin, lighter, their edges a fringe of fine bristles (estimate)
  let pk = round((lt - .80) / .0236);
  let pr0 = vec3f(sign(i.op.x) * .030, -.110, .5 - (.60 + .048 * pk));
  let pd = normalize(vec3f(sign(i.op.x) * .25, -1., -.45));
  let pu = dot(i.op - pr0, pd) / .09; let pw = (i.op.z - pr0.z - pd.z * pu * .09) / .020;
  let fringe = ss(.45, .75, abs(pw)) + ss(.75, .95, pu);
  let bristle = (.5 + .5 * sin(pu * 160. + abs(pw) * 40.)) * fringe * near;
  alb = mix(alb, CH * (.95 + .30 * bristle) * (1. + .2 * fringe), pad);
  // ---- the eyes: a ball of many six-sided lenses (JHK2020), each a tiny dome with its own glint; dark where one looks
  // straight down the lenses (the pseudopupil of compound eyes)
  let ec = vec3f(sign(i.op.x) * .042, -.010, .45);
  let ep = normalize(i.op - ec);
  let euv = vec2f(atan2(ep.y, ep.z), asin(clamp(ep.x * sign(i.op.x), -1., 1.))) * 14.;
  let hx = vec2f(euv.x - .5 * euv.y, euv.y * 1.1547);
  let hf = fract(hx) - .5; let hd = max(abs(hf.x), max(abs(hf.y), abs(hf.x + hf.y)));
  let lens = (1. - 4. * hd * hd) * near;
  hgt += .0010 * lens * eye;
  let V = normalize(g.cam.xyz - i.wp);
  let pp = pow(sat(dot(ns, V)), 6.);
  alb = mix(alb, vec3f(.055, .045, .035) * (1. - .7 * pp) * (.8 + .4 * ss(.3, .5, hd)), eye);
  // ---- light: relief in shell lengths times 0.06 m. Chitin shines, wet; the eyes sharply. The shell is thin: light
  // from behind comes through it, less where the body lies under it
  let n = skinRelief(ns, i.wp, hgt * .06);
  let dist = length(i.wp - g.cam.xyz); let ca = caus(i.wp, dist);
  let zn = zone(i.wp); let H = normalize(V + g.sun.xyz);
  let E = sunE(i.wp.y, zn); let vv = vol(i.wp).g;
  let gl = .45 * shell * outside + .45 * edgeP + .30 * body + .40 * arm + .25 * pad + 1.6 * eye;
  let thin = (shell * (1. - .6 * under) + edgeP + pad * .8 + gill * .6 + arm * .5) * (1. - eye);
  // chitin lets some light through and scatters it: the light wraps a little round the shape, warmer and clearer
  // where it is thin; seen at a slant the shell is thicker in the line of sight, so its rim reads darker and warmer
  let nl = dot(n, g.sun.xyz); let nv = sat(dot(n, V));
  let wrap = sat((nl + .35) / 1.35);
  let fres = .04 + .96 * pow(1. - nv, 5.);
  let slant = mix(vec3f(.80, .70, .55), vec3f(1.), ss(.05, .5, nv));
  var c = alb * slant * (E * wrap * .70 * (.3 + ca * .7)
      + amb(i.wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vv, zn) * 1.0 + side(i.wp, n, 1., zn) * .8)
    + alb * vec3f(1.15, .95, .65) * E * sat(0. - nl) * .50 * thin
    + E * (.25 + .75 * ca) * gl * (pow(sat(dot(n, H)), 90.) + .08 * pow(sat(dot(n, H)), 12.)) * (.6 + 2. * fres)
    + amb(i.wp, vec3f(0., 1., 0.), vv, zn) * fres * (.25 + .35 * (shell + eye));
  return fin(fog(c, i.wp, zn));
}
