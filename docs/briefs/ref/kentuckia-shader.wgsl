// ============================================================================
// Reference shaders for Kentuckia (brief: docs/briefs/kentuckia-build.md)
// ============================================================================
// Not loaded by the build. This is the whole text of S_KENTUCKIA for source/eras/devonian/swimmers_kentuckia.js, for
// the mesh of docs/briefs/ref/kentuckia-mesh.js. It needs what W_ANIM gives every animal (S_B and W_HASH: ss, sat,
// hs, vn, fbm, zone, fog, fin) and S_SEA (dodge, skinRelief), which comes with it in world.js. This text has not been
// compiled: run node tools/wgsl.mjs devonian first.
// s is the distance from the snout in body lengths (s = .5 - z of the rest position), y its height.

// Instance (unchanged): a.xyz = centre of the school's path, a.w = its radius R. b.x = seed of the fish, b.y = speed of
// the school in radians per second (the sign is the direction), b.z = length in metres, b.w = seed of the school. The
// path of the school is repeated in zooKentuckia: change one, change the other.

// back (x) and belly (y) of the body at s, every 0.05 from the snout: read off the mesh
fn kentTB(s: f32) -> vec2f {
  var T = array<f32, 21>(.004, .049, .072, .088, .100, .108, .110, .109, .105, .099, .091, .082, .072, .062, .055, .055,
    .063, .077, .094, .111, .126);
  var B = array<f32, 21>(-.012, -.053, -.076, -.092, -.104, -.111, -.112, -.110, -.104, -.094, -.082, -.068, -.054,
    -.040, -.027, -.013, .006, .032, .063, .094, .118);
  let f = clamp(s * 20., 0., 19.999); let k = i32(f); let u = f - f32(k);
  return vec2f(mix(T[k], T[k + 1], u), mix(B[k], B[k + 1], u));
}
// a line of half width w at distance d. Where a pixel is wider than the line, the line gets wider and fainter
fn kentLine(d: f32, w: f32, fw: f32) -> f32 {
  let ww = max(w, 1.2 * fw); let q = d / ww; return exp(0. - q * q) * (w / ww);
}
// the line of the shut mouth: long, from under the snout back below the eye to the corner at s = .15
fn kentMouthY(s: f32) -> f32 { return 0. - .018 - .022 * pow(sat(s / .15), 1.1); }
// the rear edge of the gill cover at height y (as a place along the body): it bulges back at mid height
fn kentOperc(v: f32) -> f32 { let q = (v - .45) / .5; return .200 + .032 * sat(1. - q * q); }
// smoothstep and its slope over a to b, at x
fn kentSS(a: f32, b: f32, x: f32) -> vec2f {
  let u = sat((x - a) / (b - a)); return vec2f(u * u * (3. - 2. * u), 6. * u * (1. - u) / (b - a));
}

@vertex fn vsKentuckia(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w; let sz = i.b.z * (.90 + .2 * h.z);
  // ---- the school's path, as before: each fish at its own place along it
  let ta = t * i.b.y + i.b.w * 6.3 + (h.x - .5) * (8. / R);
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), 1.5 * sin(2. * ta + ph), R * .7 * sin(ta));
  let T0 = normalize(vec3f(0. - R * sin(ta), 3. * cos(2. * ta + ph), R * .7 * cos(ta))) * sign(i.b.y);
  let S0 = normalize(cross(vec3f(0., 1., 0.), T0)); let Up0 = cross(T0, S0);
  let v = abs(i.b.y) * .854 * R;                      // speed of the school in m/s (the mean along the ellipse)
  // ---- its place in the school: about 1.8 m spread sideways and 1.2 m up and down, drifting slowly
  var off = S0 * ((h.y - .5) * 1.8 + sin(t * .7 + s * 40.) * .3)
    + Up0 * ((h.z - .5) * 1.2 + cos(t * .5 + s * 31.) * .2);
  // ---- the dart: every 7 to 15 s a fish may shoot ahead (in about every second cycle), out to one side, then fall
  // back to its place in the school over some 5 s. It starts with a quick bend of the body (a C-start, as small fish
  // do when they bolt). tau: seconds since this cycle's dart began
  let dPer = 7. + 8. * hs(s + .53);
  let dc = t / dPer + hs(s + .91); let dk = floor(dc);
  let tau = fract(dc) * dPer;
  let dOn = step(.5, hs(dk * 1.37 + s * 7.1));
  let dd = (.25 + .35 * hs(dk * .73 + s * 3.3)) * dOn;   // how far ahead, m
  let dj = (hs(dk * 2.11 + s * 5.7) - .5) * .8 * dd;     // how far out to the side, m
  let ga = kentSS(0., .5, tau); let gb = kentSS(1.5, 6.5, tau);
  let xo = ga.x * (1. - gb.x); let xv = ga.y * (1. - gb.x) - ga.x * gb.y;   // the dart and its rate
  off += T0 * dd * xo + S0 * dj * xo;
  let sprint = dOn * ss(0., .12, tau) * (1. - ss(.45, .9, tau));
  // which way it faces: along the school, turned toward where the dart carries it
  let T = normalize(T0 * v + (T0 * dd + S0 * dj) * xv);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  // ---- the body. The tail beats once per 0.7 body lengths swum, so faster in the dart; wider in the dart. The
  // C-start: for 0.4 s the whole body bends to the side it bolts to
  var l = i.p; var n = i.n.xyz; let lt = i.n.w;
  let bp = TAU * (v * t + dd * xo) / (.7 * sz) + s * 50.;
  let u = .5 - l.z;
  let A = (.010 + .07 * u * u) * (1. + 1.2 * sprint);
  let wv = bp - u * 5.5;
  let cb = sign(dj) * .35 * dOn * ss(0., .08, tau) * (1. - ss(.15, .40, tau));
  l.x += A * sin(wv) + cb * (l.z * l.z - .08);
  let sl = 5.5 * A * cos(wv) + 2. * cb * l.z;
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  // ---- the pectoral fins turn about their root (+ out and up): a little sculling; laid back against the body in the
  // dart; spread out to brake as it slows
  let sx = select(-1., 1., i.p.x >= 0.);
  let pw = step(abs(lt - .30), .02) * ss(.046, .060, abs(i.p.x));
  let brake = dOn * ss(.5, .8, tau) * (1. - ss(1.4, 2.4, tau));
  let fa = sx * (.12 * sin(.5 * bp + 3. * s) * (1. - sprint) - .45 * sprint + .45 * brake) * pw;
  let hg = vec2f(sx * .045, -.072); let dq = l.xy - hg;
  l = vec3f(hg + vec2f(dq.x * cos(fa) - dq.y * sin(fa), dq.x * sin(fa) + dq.y * cos(fa)), l.z);
  n = vec3f(n.x * cos(fa) - n.y * sin(fa), n.x * sin(fa) + n.y * cos(fa), n.z);
  let w = dodge(P + off, .6 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = lt;
  return o;
}

@fragment fn fsKentuckia(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let ax = abs(i.op.x); let y = i.op.y; let s = .5 - i.op.z; let lt = i.lt;
  let fw = max(fwidth(i.op.x), max(fwidth(i.op.y), fwidth(i.op.z)));     // how much of the body one pixel covers
  let near = 1. - ss(.0012, .004, fw);                                     // scales and lines fade out with distance
  let h1 = hs(i.sd * 7.); let h2 = hs(i.sd * 23.);
  // ---- parts by aux
  let hull = step(-.5, lt) * step(lt, .1); let fins = step(.25, lt); let eye = step(lt, -.5);
  let tb = kentTB(s); let ym = (tb.x + tb.y) * .5; let dep = max(tb.x - tb.y, .004);
  let v = sat((y - tb.y) / dep);                                           // 0 at the belly, 1 at the back
  let op = kentOperc(v); let head = (1. - ss(op - .002, op + .002, s)) * hull;
  let body = hull * (1. - head);
  // ---- the scales: thick shiny rhombs (ganoid scales) in rows along the body and oblique rows across it, smaller
  // toward the tail. Each one a little domed, a fine groove between them
  let wS = .018 * (1. - .45 * ss(.5, .95, s));
  let q = v * 13.; let gq = s / wS - .55 * q;
  let fq = fract(q); let fg = fract(gq);
  let e = min(min(fq, 1. - fq) * dep / 13., min(fg, 1. - fg) * wS * .8);
  let groove = kentLine(e, .0005, fw) * body * near;
  var hgt = (.0012 * sqrt(sat(e / .003)) - .0010 * groove) * body * near;
  // the lateral line: a row of pores along the middle of the flank, rising into the tail
  let llv = .56 + .12 * ss(.6, .9, s);
  let ll = kentLine(abs(v - llv) * dep, .0008, fw) * step(.3, fract(gq)) * body * ss(.22, .26, s);
  hgt -= .0006 * ll;
  // ---- the head: smooth bone with fine wavy ridges of the same enamel, and the lines between its plates: the rear
  // edge of the gill cover, the edge of the cheek in front of it, the upper edge of the long upper jaw, the edge of
  // the roof
  let ridge = sin((s * 1.1 + y * .6) * 900. + 4. * vn(i.op * 80. + i.sd)) * head * near;
  hgt += .00010 * ridge;
  let my = kentMouthY(s);
  var dP = abs(s - op);
  dP = min(dP, abs(s - (.165 + .015 * v)) + .03 * step(v, .2) + .03 * step(.75, v));          // the cheek
  dP = min(dP, abs(y - (my + .008 + .018 * s / .15)) + .03 * step(.15, s) + .03 * step(s, .03)); // the upper jaw
  dP = min(dP, abs(y - (tb.x - .028)) + .03 * step(.2, s) + .03 * step(s, .04));                // the roof
  let plate = kentLine(dP, .0010, fw) * head;
  hgt -= .0012 * plate;
  // the mouth: a dark line with a lip of bone above and below; the nostrils
  let mouth = kentLine(abs(y - my), .0022, fw) * step(s, .15) * hull;
  hgt -= .0025 * mouth;
  let nose = (1. - ss(.0025, .0035, length(vec2f(s - .022, y - .024)))) * hull;
  // ---- the light from the scales: one tone over the whole fish, darker above, paler below (no pattern has a source)
  let BACK = vec3f(.16, .18, .15); let SIDE = vec3f(.46, .48, .44); let BELLY = vec3f(.66, .66, .60);
  var alb = mix(mix(BELLY, SIDE, ss(.10, .40, v)), BACK, ss(.50, .85, v));
  alb *= (.90 + .20 * h1) * mix(vec3f(1.03, 1., .95), vec3f(.95, 1., 1.04), h2);
  alb *= 1. - .28 * groove - .35 * plate - .70 * mouth - .80 * nose - .30 * ll;
  // ---- fins: thin, darker, with their rays (a dark line every 0.006 across the fin)
  let rc = s * .75 + abs(y - ym) * .65 + ax * .65;
  let ray = (1. - ss(.05, .25, abs(fract(rc / .006) - .5))) * fins * near;
  alb = mix(alb, BACK * 1.3 * (1. - .20 * ray), fins);
  hgt += .0003 * ray;
  // ---- the eye: a dark iris, a black pupil
  let ed = length(vec2f(s - .075, y - .020));
  alb = mix(alb, mix(vec3f(.006, .006, .006), vec3f(.10, .085, .05), ss(.0085, .0105, ed)), eye);
  // ---- light. The relief is in body lengths: times 0.1 m, the length of the fish. Ganoine is an enamel: the scales
  // and the bones of the head shine, sharply; the fins less. The flecks of the sun on it (caus); no shadow map
  // (900 fish)
  let n = skinRelief(ns, i.wp, hgt * .1);
  let dist = length(i.wp - g.cam.xyz); let ca = caus(i.wp, dist);
  let zn = zone(i.wp); let V = normalize(g.cam.xyz - i.wp); let H = normalize(V + g.sun.xyz);
  let E = sunE(i.wp.y, zn); let vv = vol(i.wp).g;
  let gl = (.30 * body + .25 * head) * (1. - .6 * groove) + .15 * fins + 1.2 * eye;
  var c = alb * (E * sat(dot(n, g.sun.xyz)) * .65 * (.3 + ca * .7)
      + amb(i.wp, vec3f(n.x, abs(n.y) * .55 + .25, n.z), vv, zn) * 1.1 + side(i.wp, n, 1., zn) * .8)
    + E * (.25 + .75 * ca) * gl * pow(sat(dot(n, H)), 120.)
    + amb(i.wp, vec3f(0., 1., 0.), vv, zn) * pow(1. - sat(dot(n, V)), 3.) * (.20 + .25 * body);
  return fin(fog(c, i.wp, zn));
}
