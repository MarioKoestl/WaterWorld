// ============================================================================
// ordovician: Endoceras (Endoceras giganteum, the giant straight-shelled cephalopod)
// ============================================================================
// Its mesh, its shaders and, for the zoo, where it is at a time. world.js lists it as a kind and gives it its
// instances. The mesh is modelled around the origin, nose at +z, y up: the instance says how large the animal is in
// the world. What it shares with the other animals of this era is in swimmers.js.

// Endoceras giganteum in the round. One unit from shell tip to arm tips. Sources: Wikipedia "Endoceras" (checked
// 2026-11-16): a 2015 estimate puts the complete shell at about 5.73 m; "Endocerida": possibly the top predator
// of the Ordovician. See docs/research/ordovician/endoceras.md. Soft parts entirely estimated.
// aux: 0 shell tip, proportional through shell to 0.5 at opening, 0.55 inner lip, 0.7 head, 0.9 arms, 0.95 eyes
function meshEndoceras() {
  const m = new Mesh();
  rseed(800);
  // Shell: z=0 (tip) to z=SL (opening). A long straight cone with low annulations (ring bumps).
  // 5.7 m shell, ~0.3 m opening diameter -> radius 0.15 m -> 0.15/5.7 = 0.026 units at opening.
  // Slightly oval (1.06x wider than tall, like the orthocones).
  const SL = 0.72, SM = 18, SN = 160, OR = 0.026;
  const shellRings = [];
  for (let k = 0; k <= SN; k++) {
    const s = k / SN, z = s * SL;
    const rBase = 0.001 + (OR - 0.001) * pow(s, 0.72);
    const ann = 1 + 0.035 * sin(z * 520) * pow(s, 0.5);
    const r = rBase * ann, ring = [];
    for (let j = 0; j < SM; j++) { const a = j / SM * TAU; ring.push(m.v(r * 1.06 * cos(a), r * sin(a), z, s * 0.5)); }
    shellRings.push(ring);
  }
  for (let k = 0; k < SN; k++) for (let j = 0; j < SM; j++) { const j2 = (j + 1) % SM; m.quad(shellRings[k][j], shellRings[k][j2], shellRings[k + 1][j2], shellRings[k + 1][j]); }
  const tipV = m.v(0, 0, 0, 0);
  for (let j = 0; j < SM; j++) m.tri(shellRings[0][(j + 1) % SM], shellRings[0][j], tipV);
  // inner lip at the opening: three inset rings tapering inward
  const innerRings = [];
  for (let k = 0; k < 3; k++) {
    const f = 1 - k * 0.07, z = SL - k * 0.008, r = OR * f, ring = [];
    for (let j = 0; j < SM; j++) { const a = j / SM * TAU; ring.push(m.v(r * 1.04 * cos(a), r * sin(a), z, 0.55)); }
    innerRings.push(ring);
  }
  for (let j = 0; j < SM; j++) { const j2 = (j + 1) % SM; m.quad(shellRings[SN][j2], shellRings[SN][j], innerRings[0][j], innerRings[0][j2]); }
  for (let k = 0; k < 2; k++) for (let j = 0; j < SM; j++) { const j2 = (j + 1) % SM; m.quad(innerRings[k][j2], innerRings[k][j], innerRings[k + 1][j], innerRings[k + 1][j2]); }
  // Head: soft body emerging from the opening, tapering to a blunt snout
  loft(m, [
    [SL - 0.005, OR * 1.04, OR * 0.98, 0],
    [SL + 0.025, OR * 0.90, OR * 0.84, 0],
    [SL + 0.055, OR * 0.65, OR * 0.58, 0],
    [SL + 0.075, OR * 0.40, OR * 0.35, 0],
    [SL + 0.085, OR * 0.22, OR * 0.18, 0],
  ], 2, 14, 0.7);
  // Eyes: proportionally small and dark (L6), set high on each side of the head
  ball(m, [OR * 0.72, 0.003, SL + 0.025], [0.009, 0.007, 0.007], 0.95, 8, 5);
  ball(m, [-OR * 0.72, 0.003, SL + 0.025], [0.009, 0.007, 0.007], 0.95, 8, 5);
  // Arms: 10 thick tentacles from the head, reaching forward and curving down. Some longer than others
  for (let j = 0; j < 10; j++) {
    const a = j / 10 * TAU, dx = cos(a) * OR * 0.28, dy = sin(a) * OR * 0.28;
    const len = 0.075 + rr(-0.012, 0.012);
    const droop = -0.015 - 0.01 * (1 - abs(sin(a)));
    const pts = curve([
      [dx, dy, SL + 0.085],
      [dx * 1.5, dy * 1.3 + droop * 0.4, SL + 0.085 + len * 0.35],
      [dx * 1.3, dy * 1.1 + droop, SL + 0.085 + len * 0.7],
      [dx * 1.0 + rr(-0.002, 0.002), dy * 0.9 + droop * 1.4, SL + 0.085 + len],
    ], 8);
    m.tube(pts, (k) => 0.005 * (1 - 0.55 * k / 8), 6, true, () => 0.9);
  }
  // Funnel (hyponome): under the head, for propulsion
  m.tube([
    [0, -OR * 0.72, SL + 0.01],
    [0, -OR * 1.0, SL + 0.035],
    [0, -OR * 0.88, SL + 0.06],
  ], () => 0.007, 6, true, () => 0.7);
  return m;
}

// ---------------------------------------------------------------- shaders
const S_ENDOCERAS = /*wgsl*/`
// Instance: a.xyz = path centre (xz), a.w = path radius. b.x = seed, b.y = speed (rad/s, sign is direction),
// b.z = size in metres (5.7), b.w = path seed. The path enP follows the ground: change it, change zooEndoceras
fn enP(ta: f32, a: vec4f, ph: f32) -> vec3f {
  let xz = a.xz + a.w * vec2f(cos(ta), sin(ta));
  return vec3f(xz.x, ground(xz) + 1.5, xz.y);
}
fn enT(ta: f32, a: vec4f, ph: f32) -> vec3f {
  let e = .002;
  return normalize(enP(ta + e, a, ph) - enP(ta - e, a, ph));
}
@vertex fn vsEndoceras(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let ph = i.b.w * 17.;
  // slow, steady glide: no jet propulsion, no bobbing. The shell is stiff
  let ta = t * i.b.y + i.b.w * 6.3;
  let P = enP(ta, i.a, ph);
  let T = enT(ta, i.a, ph) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  var l = i.p; var n = i.n.xyz;
  let sz = i.b.z * (.95 + .1 * h.z);
  // arms wave gently, reaching down
  let armF = step(.85, i.n.w);
  l.x += armF * .008 * sin(t * 1.2 + s * 20. + l.z * 12.);
  l.y += armF * .006 * sin(t * 0.9 + s * 15. + l.z * 10.) - armF * .012 * sat(l.z - .8);
  let w = dodge(P, 1.2 * sz + 2. * g.fwd.w, .3, .5 * sz) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
@fragment fn fsEndoceras(i: VO, @builtin(front_facing) ff: bool) -> @location(0) vec4f {
  let ns = normalize(i.n) * select(-1., 1., ff);
  let sd = i.sd; let lt = i.lt;
  let z = i.op.z; let x = i.op.x; let y = i.op.y;
  let h1 = hs(sd * 7.); let h2 = hs(sd * 23.);
  let tg = textureSample(tD, sR, vec2f(z * 18. + x * 12., y * 18.) + sd) * .5
    + textureSample(tD, sR, vec2f(z * 38. - x * 24., y * 35.) + sd + .37) * .5;
  let fine = ss(.005, .002, fwidth(z) + fwidth(x) + fwidth(y));
  let shell = step(lt, .52); let inner = step(.52, lt) * step(lt, .58);
  let head = step(.6, lt) * step(lt, .88); let arm = step(.88, lt) * step(lt, .93);
  let eye = step(.93, lt);
  // annulation relief: low broad rings along the shell, shaded by light not drawn as lines (L3)
  let annFreq = z * 520.;
  let ann = (.5 + .5 * sin(annFreq)) * ss(2., .8, fwidth(annFreq)) * shell * pow(sat(lt * 2.), .5);
  // finer growth lines between the annulations
  let glFreq = lt * 200.;
  let gl = (.5 + .5 * cos(glFreq)) * ss(2., .6, fwidth(glFreq)) * shell;
  // fine surface grain between rings
  let grain = vn(vec3f(x * 350., y * 350., z * 150.)) * fine;
  // arm ridges: longitudinal grooves along each tentacle
  let armRidge = (.5 + .5 * sin(atan2(y, x) * 16.)) * fine * arm;
  let rh = (.003 * ann + .001 * gl + .0008 * grain + .001 * (tg.a - .5) * fine) * shell + .001 * armRidge;
  let n = skinRelief(ns, i.wp, rh);
  // shell: pale limestone/horn, warm tones (L5, L7)
  var alb = mix(vec3f(.52, .48, .38), vec3f(.58, .54, .42), .5 + .3 * h2);
  // counter-shaded: darker dorsal (L7)
  let dors = sat(y / max(abs(x) + abs(y), .001)) * step(0., y);
  alb = mix(alb, mix(vec3f(.30, .26, .18), vec3f(.36, .32, .22), h2), shell * dors * .70);
  // paler ventral
  let vent = sat(0. - y / max(abs(x) + abs(y), .001));
  alb = mix(alb, mix(vec3f(.62, .60, .52), vec3f(.68, .66, .56), h2), shell * vent * .40);
  // annulation shade: colour follows relief (L7)
  alb *= .92 + .12 * ann;
  alb *= .90 + .2 * gl * .3;
  alb *= .82 + .4 * h1;
  alb *= .88 + .24 * tg.g;
  // inner shell: nacreous sheen with a visible rim
  alb = mix(alb, mix(vec3f(.56, .52, .44), vec3f(.62, .58, .50), h2) * (1. + .08 * tg.b), inner);
  // head: soft pinkish-grey tissue, counter-shaded
  alb = mix(alb, mix(vec3f(.40, .32, .26), vec3f(.36, .28, .22), h2) * (.85 + .3 * tg.g), head);
  alb *= 1. - .15 * dors * head;
  // arms: pinkish-brown, darker to tips, counter-shaded, with ridge shading
  let armV = sat((lt - .88) / .05);
  alb = mix(alb, mix(vec3f(.42, .32, .24), vec3f(.30, .22, .16), armV) * (.85 + .3 * tg.g), arm);
  alb *= 1. - .25 * dors * arm;
  alb *= 1. - .14 * armRidge;
  // eyes: small and dark (L6)
  alb = mix(alb, vec3f(.04, .03, .02), eye);
  // light: shell has wet sheen (L4), eyes catch the light
  var c = skinWet(alb, n, ns, i.wp, .10 * shell + .04 * inner + .03 * (head + arm), .50 * shell + .08 * (head + arm) + 2.5 * eye);
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;

// ---------------------------------------------------------------- zoo
// Endoceras follows the ground. Single point (it is big), with a direction line. zooGround reads the grid.
const zooEndoceras = (a, i) => {
  const R = a[i + 3], ph = a[i + 7] * 17;
  const ta = F[TIME] * a[i + 5] + a[i + 7] * 6.3;
  const x = a[i] + R * cos(ta), z = a[i + 2] + R * sin(ta);
  ZP[0] = x; ZP[1] = 0; ZP[2] = z;
  zooGround();
  ZP[1] += 1.5;
  const e = 0.01, sz = a[i + 6];
  const tx = a[i] + R * cos(ta + e), tz = a[i + 2] + R * sin(ta + e);
  const dx = tx - x, dz = tz - z, dl = hypot(dx, dz) || 1;
  ZP[3] = dx / dl * sz; ZP[4] = 0; ZP[5] = dz / dl * sz; ZP[7] = sz * 0.05;
};
