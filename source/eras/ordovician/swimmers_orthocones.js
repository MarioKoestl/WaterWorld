// ============================================================================
// ordovician: Orthocones (Treptoceras, small straight-shelled cephalopods)
// ============================================================================
// Its mesh, its shaders and, for the zoo, where it is at a time. world.js lists it as a kind and gives it its
// instances. The mesh is modelled around the origin, nose at +z, y up: the instance says how large the animal is in
// the world. What it shares with the other animals of this era is in swimmers.js.

// A generic small orthocone in the round. One unit from shell tip to tentacle tips.
// Sources: Digital Atlas of Ordovician Life (not verified); see docs/research/ordovician/orthocones.md.
// Soft parts entirely estimated (no soft tissue known for any of these animals).
// aux: 0 shell tip, 0.5 shell opening, 0.55 inner lip, 0.7 head, 0.9 arms, 0.95 eyes
function meshOrthocone() {
  const m = new Mesh();
  rseed(700);
  const SL = 0.55, SM = 10, SN = 24, OR = 0.075;
  // Shell: a straight cone, slightly wider than tall, tapering from opening to tip
  const shellRings = [];
  for (let k = 0; k <= SN; k++) {
    const s = k / SN, z = s * SL, r = 0.004 + (OR - 0.004) * pow(s, 0.75), ring = [];
    for (let j = 0; j < SM; j++) { const a = j / SM * TAU; ring.push(m.v(r * 1.08 * cos(a), r * sin(a), z, s * 0.5)); }
    shellRings.push(ring);
  }
  for (let k = 0; k < SN; k++) for (let j = 0; j < SM; j++) { const j2 = (j + 1) % SM; m.quad(shellRings[k][j], shellRings[k][j2], shellRings[k + 1][j2], shellRings[k + 1][j]); }
  const tipV = m.v(0, 0, 0, 0);
  for (let j = 0; j < SM; j++) m.tri(shellRings[0][(j + 1) % SM], shellRings[0][j], tipV);
  // inner lip at the opening: three inset rings
  const innerRings = [];
  for (let k = 0; k < 3; k++) {
    const f = 1 - k * 0.06, z = SL - k * 0.015, r = OR * f, ring = [];
    for (let j = 0; j < SM; j++) { const a = j / SM * TAU; ring.push(m.v(r * 1.06 * cos(a), r * sin(a), z, 0.55)); }
    innerRings.push(ring);
  }
  for (let j = 0; j < SM; j++) { const j2 = (j + 1) % SM; m.quad(shellRings[SN][j2], shellRings[SN][j], innerRings[0][j], innerRings[0][j2]); }
  for (let k = 0; k < 2; k++) for (let j = 0; j < SM; j++) { const j2 = (j + 1) % SM; m.quad(innerRings[k][j2], innerRings[k][j], innerRings[k + 1][j], innerRings[k + 1][j2]); }
  // Head: soft body emerging from the opening
  loft(m, [[SL - 0.01, OR * 1.06, OR * 0.98, 0], [SL + 0.06, OR * 0.92, OR * 0.86, 0], [SL + 0.14, OR * 0.65, OR * 0.6, 0], [SL + 0.21, OR * 0.35, OR * 0.3, 0]], 2, 10, 0.7);
  // Eyes: small dark spots on each side
  ball(m, [OR * 0.78, 0, SL + 0.07], [0.012, 0.009, 0.009], 0.95, 6, 4);
  ball(m, [-OR * 0.78, 0, SL + 0.07], [0.012, 0.009, 0.009], 0.95, 6, 4);
  // Arms: eight short tentacles from the front of the head
  for (let j = 0; j < 8; j++) {
    const a = j / 8 * TAU, dx = cos(a) * OR * 0.3, dy = sin(a) * OR * 0.3;
    const len = 0.06 + rr(-0.008, 0.008);
    m.tube([[dx, dy, SL + 0.21], [dx * 1.4, dy * 1.4, SL + 0.21 + len * 0.5], [dx * 1.1 + rr(-0.003, 0.003), dy * 1.1, SL + 0.21 + len]],
      (k) => 0.006 * (1 - 0.5 * k / 2), 5, true, () => 0.9);
  }
  // Funnel (hyponome): under the head, for jet propulsion
  m.tube([[0, -OR * 0.7, SL + 0.03], [0, -OR * 1.0, SL + 0.07], [0, -OR * 0.9, SL + 0.11]], () => 0.012, 5, true, () => 0.7);
  return m;
}

// ---------------------------------------------------------------- shaders
const S_ORTHOCONES = /*wgsl*/`
// Instance: a.xyz = group centre, a.w = orbit radius R. b.x = individual seed, b.y = group speed (rad/s, sign is
// direction), b.z = size in metres, b.w = group seed. The orbit orP is repeated in zooOrthocone: change one, change
// the other
fn orP(ta: f32, a: vec4f, ph: f32) -> vec3f { return a.xyz + vec3f(a.w * cos(ta), .6 * sin(2. * ta + ph), a.w * .5 * sin(ta)); }
fn orT(ta: f32, a: vec4f, ph: f32) -> vec3f { return normalize(vec3f(0. - a.w * sin(ta), 1.2 * cos(2. * ta + ph), a.w * .5 * cos(ta))); }
@vertex fn vsOrthocone(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w;
  // jet propulsion: every 2.5 to 3.5 s it jets, then coasts and slows down
  let Pj = 2.5 + fract(s * 7.31);
  let jc = t / Pj + fract(s * 3.7);
  let jx = fract(jc);
  let tj = Pj * (floor(jc) + (1. - exp(0. - 2.5 * jx)) / .917915);
  let ta = tj * i.b.y + i.b.w * 6.3 + (h.x - .5) * (6. / R);
  let ph = i.b.w * 17.;
  let P = orP(ta, i.a, ph);
  let T = orT(ta, i.a, ph) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let off = S * ((h.y - .5) * .5 + sin(t * .3 + s * 30.) * .08) + Up * ((h.z - .5) * .3 + cos(t * .3 + s * 20.) * .06);
  var l = i.p; var n = i.n.xyz;
  let sz = i.b.z * (.85 + .3 * h.z);
  // the shell rocks with each jet
  let bob = .10 * sin(TAU * jx) * exp(0. - 2. * jx);
  let cb = cos(bob); let sb = sin(bob);
  l = vec3f(l.x, l.y * cb - l.z * sb, l.y * sb + l.z * cb);
  n = vec3f(n.x, n.y * cb - n.z * sb, n.y * sb + n.z * cb);
  // tentacles trail and sway
  let armF = step(.85, i.n.w);
  l.x += armF * .03 * sin(t * 2. + s * 30. + l.z * 8.);
  l.y += armF * .02 * sin(t * 1.5 + s * 20. + l.z * 10.);
  let w = dodge(P + off, .4 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
@fragment fn fsOrthocone(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let sd = i.sd; let lt = i.lt;
  let z = i.op.z; let x = i.op.x; let y = i.op.y;
  let h1 = hs(sd * 7.); let h2 = hs(sd * 23.);
  let tg = textureSample(tD, sR, vec2f(z * 25. + x * 15., y * 25.) + sd) * .5
    + textureSample(tD, sR, vec2f(z * 51. - x * 31., y * 47.) + sd + .37) * .5;
  let fine = ss(.006, .002, fwidth(z) + fwidth(x) + fwidth(y));
  let shell = step(lt, .52); let inner = step(.52, lt) * step(lt, .58);
  let head = step(.6, lt) * step(lt, .88); let arm = step(.88, lt) * step(lt, .93);
  let eye = step(.93, lt);
  // growth bands along the shell
  let gb = (.5 + .5 * cos(lt * 100.)) * ss(1.8, .6, fwidth(lt * 100.)) * shell;
  let rh = (.002 * gb + .001 * (tg.a - .5) * fine) * shell;
  let n = skinRelief(ns, i.wp, rh);
  // shell colour: pale, warm, with subtle variation
  var alb = mix(vec3f(.50, .45, .34), vec3f(.60, .54, .40), .5 + .3 * h2);
  // darker bands on the UPPER SIDE ONLY (y > 0 in mesh space): sinusoidal along z
  let bnd = shell * sat(y / max(abs(x) + abs(y), .001)) * step(0., y);
  let bndV = (.5 + .5 * sin(z * 55. + h1 * 10.)) * fine;
  alb = mix(alb, mix(vec3f(.28, .24, .18), vec3f(.35, .30, .22), h2), bnd * bndV * .55);
  // underside: plain and pale
  alb = mix(alb, mix(vec3f(.56, .52, .42), vec3f(.62, .58, .46), h2), shell * sat(0. - y / max(abs(x) + abs(y), .001)) * .2);
  alb *= .92 + .16 * gb;
  alb *= .82 + .4 * h1;
  alb *= .88 + .24 * tg.g;
  // inner shell: slightly nacreous
  alb = mix(alb, mix(vec3f(.48, .46, .38), vec3f(.55, .52, .44), h2) * (1. + .06 * tg.b), inner);
  // head: soft pinkish tissue
  alb = mix(alb, mix(vec3f(.46, .36, .30), vec3f(.42, .34, .28), h2) * (.85 + .3 * tg.g), head);
  // arms: pinkish-brown, darker to tips
  let armV = sat((lt - .88) / .05);
  alb = mix(alb, mix(vec3f(.48, .36, .28), vec3f(.34, .24, .18), armV) * (.85 + .3 * tg.g), arm);
  // eyes: small and dark (L6)
  alb = mix(alb, vec3f(.04, .03, .02), eye);
  // light
  var c = skinWet(alb, n, ns, i.wp, .15 * shell + .05 * inner + .04 * (head + arm), .40 * shell + .08 * (head + arm));
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;

// ---------------------------------------------------------------- zoo
// A group of orthocones: the orbit orP of vsOrthocone without per-individual offset, with the jets. Two half-lines
// from the middle (part 0 and 1). The zoo seed is 0
const zooOrthocone = (a, i, part) => {
  const s = a[i + 4], Pj = 2.5 + (s * 7.31 - floor(s * 7.31)), jc = F[TIME] / Pj + (s * 3.7 - floor(s * 3.7));
  const tj = Pj * (floor(jc) + (1 - exp(-2.5 * (jc - floor(jc)))) / 0.917915);
  const R = a[i + 3], ph = a[i + 7] * 17, ta = tj * a[i + 5] + a[i + 7] * 6.3, tb = ta + (part * 2 - 1) * 2 / R;
  const x = R * cos(ta), y = 0.6 * sin(2 * ta + ph), z = R * 0.5 * sin(ta);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = R * cos(tb) - x; ZP[4] = 0.6 * sin(2 * tb + ph) - y; ZP[5] = R * 0.5 * sin(tb) - z; ZP[7] = 0.5;
};
