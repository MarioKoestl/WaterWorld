// ============================================================================
// ordovician: Astraspis (the early armoured fish)
// ============================================================================
// Its mesh, its shaders and, for the zoo, where it is at a time. world.js lists it as a kind and gives it its
// instances. The mesh is modelled around the origin, nose at +z, y up: the instance says how large the animal is in
// the world. What it shares with the other animals of this era is in swimmers.js.
//
// Rebuilt 2026-11-25 by section A of docs/briefs/qa/ordovician.md and the recipe of quality-gate.md. Living models:
// the armour of a boxfish for the surface, a tadpole for the tail and the way of swimming; the shape comes from the
// fossil. Sources and every figure, with what is an estimate: docs/research/ordovician/astraspis.md.
// aux: 0 body (shield and tail in one skin), -0.4 eye socket wall, -0.6 gill opening inside,
//      -0.8 mouth inside, -1 eye ball

function meshAstraspis(lo) {
  const m = new Mesh();
  rseed(750);
  // the two forms in one skin (A1): stations tail tip to nose [z, half-width, half-height, y of the middle,
  // belly (0 round .. 1 flat below)]. The shield broad, low, blunt and flat below; at z 0.045 its rear edge, a
  // small step down; the tail narrower at once, taller than wide toward its end, running out into a low rounded
  // blade of the same skin
  const K = [
    [-0.500, 0.0025, 0.010, 0.006, 0.3],
    [-0.480, 0.004, 0.024, 0.008, 0.3],
    [-0.440, 0.005, 0.040, 0.008, 0.3],
    [-0.400, 0.007, 0.050, 0.006, 0.3],
    [-0.350, 0.010, 0.036, 0.003, 0.3],
    [-0.300, 0.016, 0.027, 0.001, 0.35],
    [-0.200, 0.028, 0.031, 0.000, 0.4],
    [-0.080, 0.046, 0.038, 0.000, 0.45],
    [0.030, 0.063, 0.047, 0.001, 0.5],
    [0.038, 0.080, 0.052, 0.002, 0.55],
    [0.048, 0.084, 0.056, 0.003, 0.6],
    [0.060, 0.086, 0.060, 0.003, 0.6],
    [0.150, 0.090, 0.066, 0.003, 0.62],
    [0.240, 0.088, 0.064, 0.003, 0.65],
    [0.330, 0.082, 0.057, 0.002, 0.65],
    [0.400, 0.068, 0.047, 0.000, 0.62],
    [0.455, 0.050, 0.034, -0.002, 0.6],
    [0.488, 0.026, 0.018, -0.004, 0.55],
    [0.500, 0.004, 0.004, -0.004, 0.5],
  ];
  // one point of a cross-section: oval, wider than tall, the belly flattened (A1)
  const pt = (W, H, yc, bl, a) => {
    const c = cos(a), s = sin(a);
    const x = W * (c < 0 ? -1 : 1) * pow(abs(c), 0.85);
    const y = s >= 0 ? yc + H * pow(s, 0.9) : yc - H * (1 - 0.45 * bl) * pow(-s, 0.8 - 0.25 * bl);
    return [x, y];
  };
  const cr = (a, b, c, d, u) => 0.5 * (2 * b + (c - a) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (3 * b - a - 3 * c + d) * u * u * u);
  const NS = lo ? 1 : 3, M = lo ? 10 : 20, rings = [];
  for (let j = 0; j <= (K.length - 1) * NS; j++) {
    const i = min(floor(j / NS), K.length - 2), u = j / NS - i, k = (o) => K[clamp(i + o, 0, K.length - 1)];
    const [z, W, H, yc, bl] = [0, 1, 2, 3, 4].map((q) => cr(k(-1)[q], k(0)[q], k(1)[q], k(2)[q], u));
    const ring = [];
    for (let s2 = 0; s2 < M; s2++) { const [x, y] = pt(max(W, 0.002), max(H, 0.002), yc, bl, s2 / M * TAU); ring.push(m.v(x, y, z, 0)); }
    rings.push(ring);
  }
  for (let j = 0; j < rings.length - 1; j++) for (let s2 = 0; s2 < M; s2++) { const s3 = (s2 + 1) % M; m.quad(rings[j][s2], rings[j][s3], rings[j + 1][s3], rings[j + 1][s2]); }
  const e0 = m.v(0, K[0][3], K[0][0] - 0.003, 0), e1 = m.v(0, K[K.length - 1][3], K[K.length - 1][0] + 0.003, 0), last = rings[rings.length - 1];
  for (let s2 = 0; s2 < M; s2++) { const s3 = (s2 + 1) % M; m.tri(rings[0][s3], rings[0][s2], e0); m.tri(last[s2], last[s3], e1); }
  if (lo) return m;
  // the section values at a z, for placing the openings on the skin
  const secAt = (z) => { let i = 0; while (i < K.length - 2 && K[i + 1][0] < z) i++; const u = clamp((z - K[i][0]) / (K[i + 1][0] - K[i][0]), 0, 1); return [1, 2, 3, 4].map((q) => mix(K[i][q], K[i + 1][q], u)); };
  const n3 = (v) => { const l = hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const x3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  // an opening sunk into the skin (recipe 4): a low raised rim, a wall going down, a dark inside with a floor.
  // c its centre on the skin, w outward, e1 its long axis in the skin, rx/ry its half-axes
  const crater = (c, w, e1, e2, rx, ry, rim, dp, auxW, auxIn, N, auxMid = auxW) => {
    const prof = [[1.35, -0.008, auxW], [1.12, rim, auxW], [0.9, rim * 0.5, auxMid], [0.6, -dp * 0.6, auxIn], [0.32, -dp, auxIn]];
    const R = [];
    for (const [f, hh, au] of prof) {
      const ring = [];
      for (let j = 0; j < N; j++) {
        const a2 = j / N * TAU, cc = cos(a2), sc = sin(a2);
        ring.push(m.v(c[0] + (e1[0] * cc * rx + e2[0] * sc * ry) * f + w[0] * hh,
          c[1] + (e1[1] * cc * rx + e2[1] * sc * ry) * f + w[1] * hh,
          c[2] + (e1[2] * cc * rx + e2[2] * sc * ry) * f + w[2] * hh, au));
      }
      R.push(ring);
    }
    for (let k = 0; k < R.length - 1; k++) for (let j = 0; j < N; j++) { const j2 = (j + 1) % N; m.quad(R[k][j], R[k][j2], R[k + 1][j2], R[k + 1][j]); }
    const bot = m.v(c[0] - w[0] * dp, c[1] - w[1] * dp, c[2] - w[2] * dp, auxIn);
    for (let j = 0; j < N; j++) m.tri(R[R.length - 1][j], R[R.length - 1][(j + 1) % N], bot);
  };
  // eyes in sockets (A2): a round opening of 0.035 with a low raised rim, at the side, right in front of the
  // first gill opening; in it a dark ball, sunk so only its cap stands through the opening
  for (const sx of [-1, 1]) {
    const [W, H, yc, bl] = secAt(0.24), a = 0.35;
    const [px, py] = pt(W, H, yc, bl, a);
    const w = n3([sx * cos(a) / W, sin(a) / H, 0.3]);
    const ee1 = n3([-w[2] * sx, 0, w[0] * sx]);
    const ee2 = x3(w, ee1);
    const c = [sx * px, py, 0.24];
    crater(c, w, ee1, ee2, 0.0175, 0.0175, 0.0025, 0.010, 0, -0.4, 18);
    ball(m, [c[0] - w[0] * 0.0055, c[1] - w[1] * 0.0055, c[2] - w[2] * 0.0055], 0.012, -1, 16, 8);
  }
  // eight gill openings (A3): slanting oval holes with a soft rim and a dark inside, in a line that slopes back
  // and down from behind the eye. Holes in the skin, not pegs on it
  for (const sx of [-1, 1]) for (let g = 0; g < 8; g++) {
    const zg = 0.185 - g * 0.025, ag = 0.3 - g * 0.13;
    const [W, H, yc, bl] = secAt(zg);
    const [px, py] = pt(W, H, yc, bl, ag);
    const w = n3([sx * cos(ag) / W, sin(ag) / H, 0]);
    const ld = [0, -0.35, -0.94];
    const dt = ld[0] * w[0] + ld[1] * w[1] + ld[2] * w[2];
    const ee1 = n3([ld[0] - w[0] * dt, ld[1] - w[1] * dt, ld[2] - w[2] * dt]);
    const ee2 = x3(w, ee1);
    crater([sx * px - w[0] * 0.003, py - w[1] * 0.003, zg - w[2] * 0.003], w, ee1, ee2, 0.013, 0.006, 0.0012, 0.008, 0, -0.6, 10, -0.6);
  }
  // the mouth (A4, an estimate): a small cross slit, low at the very front, without jaws, a soft dark inside
  {
    const w = n3([0, -0.45, 0.89]);
    const ee1 = [1, 0, 0], ee2 = x3(w, ee1);
    crater([0, -0.014, 0.49], w, ee1, ee2, 0.02, 0.006, 0.0015, 0.008, 0, -0.8, 12, -0.8);
  }
  return m;
}

// ---------------------------------------------------------------- shaders
const S_ASTRASPIS = /*wgsl*/`
// Instance: a.xz = school centre on the floor, a.y = height above the floor, a.w = school orbit radius.
// b.x = individual seed, b.y = speed (rad/s, sign is direction), b.z = size in metres, b.w = school seed.
// The orbit asP is repeated in zooAstraspis below: change one, change the other
fn asP(ta: f32, a: vec4f, ph: f32) -> vec3f {
  let xz = a.xz + a.w * vec2f(cos(ta) * (1. + .15 * sin(2. * ta + ph)), .55 * sin(ta));
  return vec3f(xz.x, ground(xz) + a.y, xz.y);
}
// the many-sided plates of the shield (A5): distance to the nearest and the second cell centre (the groove lies
// where they are nearly equal), the cell's own number, and the direction to its centre (for the star rays)
fn asCell(p: vec3f) -> vec4f {
  let i = floor(p); let f = fract(p);
  var d1 = 9.; var d2 = 9.; var id = 0.; var dx = 0.; var dy = 0.;
  for (var xx = -1; xx <= 1; xx++) { for (var yy = -1; yy <= 1; yy++) { for (var zz = -1; zz <= 1; zz++) {
    let o = vec3f(f32(xx), f32(yy), f32(zz)); let r = o + h33(i + o) - f; let dd = dot(r, r);
    if (dd < d1) { d2 = d1; d1 = dd; id = h31(i + o); dx = r.x; dy = r.y; }
    else if (dd < d2) { d2 = dd; }
  } } }
  return vec4f(sqrt(d1), sqrt(d2), id, atan2(dy, dx));
}
@vertex fn vsAstraspis(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  // per-animal numbers from fract(), not hs(): the zoo line repeats them exactly in JavaScript (zooAstraspis)
  let h = vec3f(fract(s * 61.7), fract(s * 47.3), fract(s * 83.1));
  let ph = i.b.w * 17.;
  let R = i.a.w; let e = .3 / max(R, .5);
  let ta = t * i.b.y + i.b.w * 6.3 + ((h.x - .5) * 10. + sin(t * .25 + s * 40.)) / max(R, .5);
  let P = asP(ta, i.a, ph);
  let T = normalize(asP(ta + e, i.a, ph) - asP(ta - e, i.a, ph)) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let off = S * ((h.y - .5) * .5 + .08 * sin(t * .4 + s * 31.)) + Up * ((h.z - .5) * .4 + .06 * cos(t * .35 + s * 23.));
  var l = i.p; var n = i.n.xyz;
  // A8: the shield does not bend: it only swings a few degrees against the tail (the recoil of a fish without
  // fins). The beats come in bouts with glides between (the envelope en, from one slow sine per fish), only the
  // tail bends (tb, more toward its tip), and the fish rolls and noses up and down a little: a clumsy swimmer.
  // All of it sines of the time (stage C1: nothing may jump)
  let en = .15 + .85 * ss(.15, .75, .5 + .5 * sin(t * (.55 + .25 * fract(s * 9.17)) + s * 21.));
  let wv = t * (6.5 + 1.5 * fract(s * 5.9)) + s * 50.;
  let rc = 0. - .045 * en * sin(wv);
  let cr_ = cos(rc); let sr_ = sin(rc); let zc = l.z - .15;
  l = vec3f(l.x * cr_ + zc * sr_, l.y, zc * cr_ - l.x * sr_ + .15);
  n = vec3f(n.x * cr_ + n.z * sr_, n.y, n.z * cr_ - n.x * sr_);
  let tb = ss(.03, -.45, l.z);
  let A = en * (.02 + .10 * tb * tb);
  let wp2 = wv - (.5 - l.z) * 4.5;
  l.x += A * sin(wp2);
  let sl = 4.5 * A * cos(wp2);
  n = vec3f(n.x + sl * n.z, n.y, n.z - sl * n.x);
  let rl = .10 * sin(t * .6 + s * 11.) + .05 * sin(t * 1.15 + s * 29.);
  let crl = cos(rl); let srl = sin(rl);
  l = vec3f(l.x * crl - l.y * srl, l.x * srl + l.y * crl, l.z);
  n = vec3f(n.x * crl - n.y * srl, n.x * srl + n.y * crl, n.z);
  let pc_ = .06 * sin(t * .8 + s * 17.);
  let cpc = cos(pc_); let spc = sin(pc_);
  l = vec3f(l.x, l.y * cpc - l.z * spc, l.y * spc + l.z * cpc);
  n = vec3f(n.x, n.y * cpc - n.z * spc, n.y * spc + n.z * cpc);
  let sz = i.b.z * (.88 + .24 * h.z);
  let w = dodge(P + off, .4 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
// The surface (A5 to A7): bone under thin skin after the boxfish, dull, darker above and paler below, darker in
// every groove, each fish its own. The plates and scales are relief, fading before they can flicker
@fragment fn fsAstraspis(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let sd = i.sd; let lt = i.lt;
  let x = i.op.x; let ax = abs(x); let y = i.op.y; let z = i.op.z;
  let h1 = hs(sd * 7.); let h2 = hs(sd * 23.);
  // which part
  let sock = step(-.5, lt) * step(lt, -.3);
  let gill = step(-.7, lt) * step(lt, -.5);
  let mouth = step(-.9, lt) * step(lt, -.7);
  let ball = step(lt, -.9);
  let body = step(-.3, lt);
  let fw2 = fwidth(z) + fwidth(ax);
  let fine = ss(.02, .006, fw2); let fdot = ss(.005, .002, fw2);
  // the shield in front of the step at z = 0.04, the tail behind it
  let shield = ss(.030, .045, z) * body;
  let tail = (1. - ss(.030, .045, z)) * body;
  let dv = clamp(y * 16., -1., 1.);
  // plates (A5): true many-sided cells, a low dome on each, some smooth and some with short star rays, seen
  // only from close; more irregular below (the cells warped and a little smaller there)
  let bel = 1. - ss(-.02, .02, y);
  let wrp = (fbm(i.op * 26. + vec3f(sd * 11.), 2) - .5) * (.2 + .25 * bel);
  let pc = asCell(i.op * (78. + 20. * bel) + vec3f(wrp, wrp * .7, sd * 9.));
  // the seams vary in width and depth from place to place, no ink line (critic round 1)
  let gw = .5 + .5 * vn(i.op * 34. + vec3f(sd * 21.));
  let groove = ss(.055 + .05 * gw, .018, pc.y - pc.x) * (.55 + .65 * gw) * shield;
  let dome = exp(0. - pow(pc.x * 3.2, 2.));
  let star = .5 + .5 * cos(pc.w * (5. + floor(pc.z * 3.)) + pc.z * 37.);
  let tub = dome * mix(1., .78 + .22 * star, step(.55, fract(pc.z * 7.7)) * fdot) * shield;
  // round the eye the plates give way to smooth skin that overlaps the socket, a little darker (critic round 1)
  let em = ss(.035, .022, length(vec3f(ax - .083, y - .027, z - .24)));
  // the pineal spot on the midline between the eyes, a shallow sensory groove on each side (A5)
  let top = ss(.01, .04, y);
  let pd = vec2f(x / .010, (z - .24) / .013);
  let pin = exp(0. - dot(pd, pd)) * top;
  let sgr = exp(0. - pow((ax - .018) / .007, 2.)) * ss(.14, .18, z) * ss(.32, .28, z) * top;
  // scales on the tail (A6): diamonds in slanting rows, each overlapping the next like a tile, the rows a
  // little uneven, smaller toward the end
  let sf = 44. + 46. * ss(-.05, -.48, z);
  var u1 = (z + y * .62) * sf;
  var u2 = (z - y * .62) * sf;
  u2 += .35 * (hs(floor(u1) * 7.7 + sd * 13.) - .5);
  u1 += .22 * (hs(floor(u2) * 5.3 + sd * 29.) - .5);
  let f1 = fract(u1); let f2 = fract(u2);
  let tile = (f1 + f2) * .5;
  let seam = ss(.16, .02, min(f1, f2));
  let fsc = ss(.012, .005, fw2) * tail;
  // relief
  let rh = (.0022 * tub - .0010 * groove + .0025 * pin - .0015 * sgr) * fine * (1. - em)
    + (.0012 * tile - .0007 * seam) * fsc
    + .0004 * (fbm(i.op * 90. + vec3f(sd * 5.), 2) - .5) * fdot * body;
  let n = skinRelief(ns, i.wp, rh);
  // tone (A7): a dull olive-brown bone family, darker above and clearly paler below, the unevenness of
  // skinTone, no pattern
  let hue = fract(sd * 5.3);
  var alb = mix(vec3f(.34, .31, .22), vec3f(.29, .28, .22), hue);
  alb = mix(alb, skinTone(alb, i.op * 5.2, dv, 1. - fdot, sd), .45);
  alb *= 1. - .14 * sat(dv) + .14 * sat(0. - dv);
  alb *= 1. - .10 * (1. - em) * groove - .20 * sgr * fine - .22 * em;
  alb *= .96 + .08 * (pc.z - .5) * shield * fine;
  alb *= 1. + .08 * tub * fine + .10 * pin * fine;
  let sj = .55 + .45 * vn(i.op * 40. + vec3f(sd * 17.));
  alb *= 1. - .08 * seam * sj * fsc + .03 * (tile - .5) * fsc;
  // shade under the shield's step (A1)
  alb *= 1. - .14 * ss(.045, .030, z) * ss(.010, .028, z);
  // the openings: dark insides, their rims in the skin's own tone (A2 to A4)
  alb = mix(alb, vec3f(.11, .085, .065), sock);
  alb = mix(alb, vec3f(.13, .07, .06), gill);
  alb = mix(alb, vec3f(.055, .038, .030), mouth);
  alb = mix(alb, vec3f(.028, .022, .018) * (1. + .2 * h2), ball);
  alb *= .82 + .36 * h1;
  // light: the living light with nothing shining through (bone), the ball the one glossy thing (A2), and the
  // dull broad sheen of a wet shell, no sharp hot spot (as the trilobite)
  let fnz = fbm(i.op * 7. + vec3f(sd * 13.), 2);
  var c = skinLive(alb, n, ns, i.wp, 0., .25 * fnz * body, .35 * ball);
  let Vw = normalize(g.cam.xyz - i.wp); let Hw = normalize(Vw + g.sun.xyz);
  let Ew = sunE(i.wp.y, zone(i.wp)) * shadow4(i.wp + n * .3);
  let shn = body * (1. - .7 * em);
  c += Ew * (pow(sat(dot(n, Hw)), 40.) * .09 * shn + pow(sat(dot(ns, Hw)), 70.) * .14 * shn);
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;

// ---------------------------------------------------------------- zoo
// One Astraspis: the place of vsAstraspis for one individual (orbit over the mud, its own scatter and wander), as
// a line from the tail tip to the nose. The zoo list is the kind's instance list, so the hint, --qa and the
// turntable see single fish (qa 5b). The per-animal numbers come from fract() of the seed, which JavaScript
// repeats exactly with Math.fround: change vsAstraspis, change this. Uses zooGround() from swimmers.js
const zooAstraspis = (a, i) => {
  const s = a[i + 4], R = a[i + 3], fw = Math.fround, t = F[TIME];
  const v1 = fw(s * 61.7), h1 = v1 - floor(v1);
  const v2 = fw(s * 47.3), h2 = v2 - floor(v2);
  const v3 = fw(s * 83.1), h3 = v3 - floor(v3);
  const ph = a[i + 7] * 17, e = 0.3 / max(R, 0.5);
  const ta = t * a[i + 5] + a[i + 7] * 6.3 + ((h1 - 0.5) * 10 + sin(t * 0.25 + s * 40)) / max(R, 0.5);
  const t0 = ta - e, t1 = ta + e;
  const x0 = a[i] + R * cos(t0) * (1 + 0.15 * sin(2 * t0 + ph)), z0 = a[i + 2] + R * 0.55 * sin(t0);
  const x1 = a[i] + R * cos(t1) * (1 + 0.15 * sin(2 * t1 + ph)), z1 = a[i + 2] + R * 0.55 * sin(t1);
  ZP[0] = x0; ZP[1] = 0; ZP[2] = z0; zooGround(); const y0 = ZP[1];
  ZP[0] = x1; ZP[1] = 0; ZP[2] = z1; zooGround(); const y1 = ZP[1];
  const sg = a[i + 5] < 0 ? -1 : 1;
  let tx = (x1 - x0) * sg, ty = (y1 - y0) * sg, tz = (z1 - z0) * sg;
  const tl = hypot(tx, ty, tz) || 1; tx /= tl; ty /= tl; tz /= tl;
  let sx = tz, sz = -tx; const sl = hypot(sx, sz) || 1; sx /= sl; sz /= sl;
  const ux = ty * sz, uy = tz * sx - tx * sz, uz = 0 - ty * sx;
  const oS = (h2 - 0.5) * 0.5 + 0.08 * sin(t * 0.4 + s * 31), oU = (h3 - 0.5) * 0.4 + 0.06 * cos(t * 0.35 + s * 23);
  const szM = a[i + 6] * (0.88 + 0.24 * h3);
  ZP[0] = a[i] + R * cos(ta) * (1 + 0.15 * sin(2 * ta + ph)); ZP[1] = 0; ZP[2] = a[i + 2] + R * 0.55 * sin(ta);
  zooGround(); ZP[1] += a[i + 1];
  ZP[0] += sx * oS + ux * oU - tx * 0.5 * szM;
  ZP[1] += uy * oU - ty * 0.5 * szM;
  ZP[2] += sz * oS + uz * oU - tz * 0.5 * szM;
  ZP[3] = tx * szM; ZP[4] = ty * szM; ZP[5] = tz * szM; ZP[7] = 0.1 * szM;
};
