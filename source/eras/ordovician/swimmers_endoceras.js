// ============================================================================
// ordovician: Endoceras (Endoceras giganteum, the giant straight-shelled cephalopod)
// ============================================================================
// Its mesh, its shaders and, for the zoo, where it is at a time. world.js lists it as a kind and gives it its
// instances. The mesh is modelled around the origin, nose at +z, y up: the instance says how large the animal is in
// the world. What it shares with the other animals of this era is in swimmers.js.
//
// Rebuilt 2026-11-24 after Nautilus (quality-gate.md); reworked the same day after ordovician-life.md stage E:
// ten arms in one ring (mirrored pairs), no hood, a broad blunt head. Body and eyes one continuous skin.
// Shell annulations with spacing proportional to diameter. No flame pattern (no source).
// aux: 0-0.44 shell, 0.45-0.48 rim, 0.49-0.53 interior, 0.54-0.62 body, 0.63-0.68 eye ball,
//      0.69-0.72 eye socket, 0.73-0.75 socket rim and mouth, 0.76-0.94 arm, 0.95-1.0 funnel

function meshEndoceras(lo) {
  const m = new Mesh();
  rseed(800);
  // SM 26 since stage F3 round 1: the opening and lip of a giant seen close must be round
  const SL = 0.72, SM = lo ? 12 : 26, SN = lo ? 40 : 160, OR = 0.026;
  const hn = (x) => { const v = sin(x * 127.1 + 311.7) * 43758.5453; return v - floor(v); };
  const sn = (x) => { const i = floor(x), f = x - i, u = f * f * (3 - 2 * f); return hn(i) * (1 - u) + hn(i + 1) * u; };
  // shell radius with annulations: their spacing grows with the local diameter, their depth differs from ring to
  // ring and fades toward the tip (qa 5a)
  const SR = (t) => { const ph = 800 * pow(max(t, 0.001), 0.28), av = 0.7 + 0.6 * hn(floor(ph / TAU)); return (0.001 + (OR - 0.001) * pow(t, 0.72)) * (1 + 0.030 * sin(ph) * pow(t, 0.5) * av + 0.015 * sn(t * 19) + 0.008 * sn(t * 37)); };
  const SO = (t, a) => (1 + 0.10 * cos(2 * a)) * (1 + 0.05 * sn(a * 1.6 + t * 6.1) + 0.025 * sn(a * 3.8 + t * 9.3));
  const SA = (t) => [sin(t * 2.1) * 0.003 + sin(t * 5.3) * 0.0015, cos(t * 2.7) * 0.002 + cos(t * 4.9) * 0.001];

  // --- shell: ring by ring with annulations
  const shR = [];
  for (let k = 0; k <= SN; k++) {
    const t = k / SN, [dx, dy] = SA(t), r = SR(t), ring = [];
    for (let j = 0; j < SM; j++) { const a = j / SM * TAU; ring.push(m.v(dx + r * SO(t, a) * cos(a), dy + r * sin(a), t * SL, t * 0.44)); }
    shR.push(ring);
  }
  for (let k = 0; k < SN; k++) for (let j = 0; j < SM; j++) { const j2 = (j + 1) % SM; m.quad(shR[k][j], shR[k][j2], shR[k + 1][j2], shR[k + 1][j]); }
  const tip = m.v(0, 0, 0, 0);
  for (let j = 0; j < SM; j++) m.tri(shR[0][(j + 1) % SM], shR[0][j], tip);

  // --- rim: a rounded lip 0.06 D thick, rolled forward and back in, no sheet edge (qa 5a)
  const [ax, ay] = SA(1), DD = 2 * OR;
  const rF = [1.03, 1.06, 1.015, 0.94], rZ = [0, 0.02 * DD, 0.036 * DD, 0.022 * DD], rimR = [];
  for (let k = 0; k < 4; k++) {
    const ring = [];
    for (let j = 0; j < SM; j++) { const a = j / SM * TAU; ring.push(m.v(ax + OR * rF[k] * SO(1, a) * cos(a), ay + OR * rF[k] * sin(a), SL + rZ[k], 0.45 + k * 0.012)); }
    rimR.push(ring);
  }
  for (let j = 0; j < SM; j++) { const j2 = (j + 1) % SM; m.quad(shR[SN][j], shR[SN][j2], rimR[0][j2], rimR[0][j]); }
  for (let k = 0; k < 3; k++) for (let j = 0; j < SM; j++) { const j2 = (j + 1) % SM; m.quad(rimR[k][j], rimR[k][j2], rimR[k + 1][j2], rimR[k + 1][j]); }

  // --- interior: the lip's underside dives back into shadow behind the body, which fills the opening
  const inR = [];
  for (let j = 0; j < SM; j++) { const a = j / SM * TAU; inR.push(m.v(ax + OR * 0.84 * SO(1, a) * cos(a), ay + OR * 0.84 * sin(a), SL - 0.12 * DD, 0.51)); }
  for (let j = 0; j < SM; j++) { const j2 = (j + 1) % SM; m.quad(rimR[3][j2], rimR[3][j], inR[j], inR[j2]); }
  const iCap = m.v(ax, ay, SL - 0.2 * DD, 0.53);
  for (let j = 0; j < SM; j++) m.tri(inR[j], inR[(j + 1) % SM], iCap);

  // --- soft parts: body, eyes, arms and funnel, shared with the orthocones (nautiloidSoft in swimmers.js).
  // Stage E of ordovician-life.md: ten arms of 1 to 1.5 D, 0.16 to 0.18 D thick at the root and 0.04 D at the
  // blunt tip, on a ring of 0.7 D; a broad blunt head, widest almost 1 D, collar 0.75 D; eye 0.15 D, hole 0.04 D
  nautiloidSoft(m, 2 * OR, [ax, ay, SL], 91.7, {
    inner: 0.52, body: [0.55, 0.62], eye: 0.70, ball: 0.65, dent: 0.74, tent: [0.77, 0.94], funnel: 0.97,
  }, 0.10, lo, { hood: 0, arms: 10, armLen: [1, 1.5], armThick: [0.16, 0.18], armTip: 0.04, armSides: 12, ring: 0.7, headW: 0.98, collar: 0.75, eye: 0.15, eyeHole: 0.04 });

  return m;
}

// ---------------------------------------------------------------- shaders
const S_ENDOCERAS = /*wgsl*/`
// Instance: a.xz = path centre, a.y = height above the mud (1 to 12 m, stage I1), a.w = path radius.
// b.x = seed, b.y = speed (rad/s, sign is direction),
// b.z = size in metres (1.8 to 5.7), b.w = path seed. The path enP follows the ground: change it, change zooEndoceras
fn enP(ta: f32, a: vec4f, ph: f32) -> vec3f {
  let xz = a.xz + a.w * vec2f(cos(ta), sin(ta));
  // each at its own height over the mud; some rounds are tilted, so the animal climbs and sinks on its way (I1),
  // never below about 1 m over the mud and never near the surface; the lowest ones' arms reach the floor (B2)
  let At = min(min(a.w * .22, max(a.y - 1.2, 0.) * .8), max(13. - a.y, 0.)) * ss(.5, .8, fract(ph * .731));
  return vec3f(xz.x, ground(xz) + a.y + At * sin(ta + ph), xz.y);
}
fn enT(ta: f32, a: vec4f, ph: f32) -> vec3f {
  let e = .002;
  return normalize(enP(ta + e, a, ph) - enP(ta - e, a, ph));
}
@vertex fn vsEndoceras(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let ph = i.b.w * 17.;
  // the jet cycle of its small relatives, heavier and slower (stage D2): 6 to 9 s per cycle for a full-grown
  // one, quicker for the young in step with their pace (I1: a 2 m animal about twice the beat), the speed
  // swinging from about 0.75 to 1.5 of the average, no tilt of the shell and no sinking. Everything from one
  // cycle angle, so nothing can jump (C1). zooEndoceras repeats tj: change one, change the other
  let Pj = (6. + 3. * fract(s * 7.31)) / pow(5.7 / i.b.z, .66);
  let jc = t / Pj + fract(s * 3.7);
  let th = TAU * (jc - .12);
  let tj = Pj * (jc + (.35 * sin(th) + .06 * sin(2. * th)) / TAU);
  let pl = pow(.5 + .5 * cos(th), 3.);
  let ta = tj * i.b.y + i.b.w * 6.3;
  let P = enP(ta, i.a, ph);
  let T = enT(ta, i.a, ph) * sign(i.b.y);
  // shell tip first (stage D1): the body's axis points against the travel
  let Ax = 0. - T;
  let S = normalize(cross(vec3f(0., 1., 0.), Ax)); let Up = cross(Ax, S);
  var l = i.p; var n = i.n.xyz;
  // the size from fract(), not hs(): the zoo line repeats it exactly with Math.fround
  let sz = i.b.z * (.95 + .1 * fract(s * 83.1));
  let aux = i.n.w;
  // with each jet the head pulls about 0.05 D into the shell (D2)
  l.z -= step(.54, aux) * .0026 * pl;
  // at the jet the arms close to about three quarters of their spread and stream out behind the travel (D2)
  let tF = step(.76, aux) * step(aux, .95);
  let tL = sat((aux - .76) / .18);
  let cl = 1. - .25 * tL * pl * tF;
  l = vec3f(l.x * cl, l.y * cl, l.z);
  // each arm its own slow wave from root to tip, its phase from its angle round the axis (B3, C2, C3)
  let ang = atan2(l.y, l.x);
  let wv = t * (.9 + .67 * fract(s * 9.17)) + ang * 2. + s * 40. - tL * 3.;
  let bnd = tF * tL * tL;
  let low = sat(0. - sin(ang));
  // the lower arms reach down and forward toward the floor only while the animal is slow (D3); the upper trail
  let rch = 1. - pl;
  l.y -= bnd * low * (.045 + .030 * sin(wv)) * rch;
  l.z -= bnd * low * (.030 + .036 * sin(wv * .8 + 2.)) * rch;
  l.z += bnd * (1. - low) * .025;
  l += vec3f(cos(ang), sin(ang), 0.) * (.030 * sin(wv) * bnd);
  l += vec3f(0. - sin(ang), cos(ang), 0.) * (.015 * sin(wv * .7 + 1.7) * bnd);
  var w = dodge(P, 1.2 * sz + 2. * g.fwd.w, .3, .5 * sz) + (S * l.x + Up * l.y + Ax * l.z) * sz;
  // a feeling arm never digs into the mud: its tip stays just over the ground it touches
  let wy = max(w.y, ground(w.xz) + .05);
  w.y = mix(w.y, wy, tF * low);
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + Ax * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
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
  // regions
  let shell = step(lt, .45);
  let rim = step(.45, lt) * step(lt, .49);
  let inner = step(.49, lt) * step(lt, .54);
  let body = step(.54, lt) * step(lt, .63);
  let ball = step(.63, lt) * step(lt, .68);
  let eyeS = step(.69, lt) * step(lt, .73);
  let eyeH = step(.73, lt) * step(lt, .76);
  let tent = step(.76, lt) * step(lt, .95);
  let funnel = step(.95, lt);
  let tV = sat((lt - .76) / .18);
  // the animal's own space, in D, and the fine noise of its skin (ordovician-life.md F1)
  let qD = i.op / .052;
  let dvs = y / max(length(vec2f(x, y)), .001);
  let fnz = fbm(qD * 7. + vec3f(sd * 13.), 2);
  // annulation, aligned with the mesh rings: spacing grows with the local diameter, depth differs from ring to
  // ring (per instance) and fades toward the tip
  let annFreq = 877. * pow(max(z, .001), .28);
  let rv = .6 + .8 * hs(floor(annFreq / 6.2832) * 7.7 + sd * 31.);
  let ann = (.5 + .5 * sin(annFreq)) * ss(2., .8, fwidth(annFreq)) * shell * pow(sat(lt * 2.3), .6) * rv;
  // finer growth lines between annulations, irregular
  let glFreq = z * 2600. + 5. * sin(z * 173.);
  let gl = (.5 + .5 * cos(glFreq)) * ss(1.2, .5, fwidth(glFreq)) * shell;
  // fine relief of the skin: strongest on the top of the head, almost none on the arms (F1)
  let rh = (.006 * ann + .002 * gl + .003 * (tg.a - .5) * fine) * shell
    + .0045 * (fnz - .5) * (body * (.35 + .65 * sat(dvs)) + .3 * eyeS) + .0008 * (fnz - .5) * tent;
  let n = skinRelief(ns, i.wp, rh);
  // shell: pale cream/horn, clearly lighter than the animal
  var alb = mix(vec3f(.62, .58, .46), vec3f(.68, .64, .52), .5 + .3 * h2);
  let dors = sat(y / max(abs(x) + abs(y), .001)) * step(0., y);
  // paler ventral
  let vent = sat(0. - y / max(abs(x) + abs(y), .001));
  alb = mix(alb, mix(vec3f(.62, .60, .52), vec3f(.68, .66, .56), h2), shell * vent * .40);
  // annulation shade in furrows
  alb *= .80 + .30 * ann;
  alb *= .94 + .04 * gl;
  alb *= .82 + .4 * h1;
  alb *= .88 + .24 * tg.g;
  // rim: the lip in the shell's own tone, no pale glowing edge (critic, stage F round 1)
  alb = mix(alb, mix(vec3f(.50, .46, .38), vec3f(.56, .52, .44), h2), rim);
  // inner shell: in shadow under the lip, but shade, not a hole (qa 5b)
  alb = mix(alb, mix(vec3f(.26, .21, .15), vec3f(.32, .26, .18), h2) * (1. + .05 * tg.b), inner);
  // head and socket skin: the living tone at three sizes (F1)
  let bton = skinTone(mix(vec3f(.46, .31, .22), vec3f(.40, .28, .20), h2), qD, dvs, tV * tent, sd);
  alb = mix(alb, bton, body + eyeS);
  // arms: the same skin, paler to the tips, each arm a little its own
  let tSd = hs(floor(atan2(y, x) * 6.) + sd * 100.);
  alb = mix(alb, mix(bton, vec3f(.62, .55, .45) * (.9 + .2 * fnz), tV) * (.92 + .16 * tSd), tent);
  // the eye (F2): the ball's iris and pupil from its own normal in the animal's space
  let eo = vec3f(x - .0013 - .0240 * sign(x), y - .0062, z - .7381);
  alb = mix(alb, eyeIris(normalize(eo), vec3f(.944 * sign(x), .308, .119), sd, .44), ball);
  // the shadowed gap round the ball, and the sunk mouth rings
  alb = mix(alb, vec3f(.04, .03, .02), eyeH);
  // darker in every crease (F1): the arm roots, under the lip, the fold round the eye
  alb *= 1. - .32 * tent * (1. - tV) - .12 * body * ss(.575, .553, lt) - .30 * eyeS * ss(.0039, .0026, length(eo));
  // funnel: dark muscular tube
  alb = mix(alb, mix(vec3f(.38, .28, .22), vec3f(.34, .25, .20), h2), funnel);
  // light: the shell keeps its wet sheen, the soft parts get the living light (F1), and the ball alone is glossy
  // with one small sharp highlight (F2)
  let soft = body + eyeS + eyeH + tent + funnel;
  let thin = tent * sat(2. * tV - 1.) * .8 + funnel * .6;
  var c = skinWet(alb, n, ns, i.wp, .06 * shell + .04 * rim + .02 * inner, .04 * shell + .04 * rim);
  c = mix(c, skinLive(alb, n, ns, i.wp, thin, fnz, .7 * ball), sat(soft + ball));
  // the mouth: one plain dark hollow in the middle of the collar, no rings (qa 5b)
  let mouth = sat(1. - tent - funnel) * ss(.760, .769, z) * ss(.0070, .0040, length(vec2f(x, y)));
  c = mix(c, vec3f(.030, .022, .015), mouth);
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;

// ---------------------------------------------------------------- zoo
// Endoceras follows the ground, shell tip first (stage D). Single point (it is big), with a direction line from
// the shell's tip backward along the body. The jet cycle tj repeats vsEndoceras: change one, change the other.
// The per-animal numbers come from fract() of the seed, repeated exactly with Math.fround. zooGround reads the grid
const zooEndoceras = (a, i) => {
  const R = a[i + 3], s = a[i + 4], fw = Math.fround;
  const v4 = fw(s * 7.31), v5 = fw(s * 3.7);
  const Pj = (6 + 3 * (v4 - floor(v4))) / pow(5.7 / a[i + 6], 0.66), jc = F[TIME] / Pj + v5 - floor(v5);
  const th = TAU * (jc - 0.12);
  const tj = Pj * (jc + (0.35 * sin(th) + 0.06 * sin(2 * th)) / TAU);
  const ta = a[i + 5] * tj + a[i + 7] * 6.3;
  const x = a[i] + R * cos(ta), z = a[i + 2] + R * sin(ta);
  // the height from the zoo's ground grid: the shader's own mud formula has no JS twin (floorH only
  // approximates it), so the line is good to a few centimetres here. The tilt of the round repeats enP (I1)
  const ph = fw(a[i + 7] * 17), v6 = fw(ph * 0.731);
  const At = min(min(R * 0.22, max(a[i + 1] - 1.2, 0) * 0.8), max(13 - a[i + 1], 0)) * sstep(0.5, 0.8, v6 - floor(v6));
  ZP[0] = x; ZP[1] = 0; ZP[2] = z;
  zooGround();
  ZP[1] += a[i + 1] + At * sin(ta + ph);
  const v3 = fw(s * 83.1), szM = a[i + 6] * (0.95 + 0.1 * (v3 - floor(v3)));
  const e = 0.01, dir = a[i + 5] < 0 ? -1 : 1;
  const tx = a[i] + R * cos(ta + e), tz = a[i + 2] + R * sin(ta + e);
  const dx = tx - x, dz = tz - z, dl = hypot(dx, dz) || 1;
  // shell tip first (D1): the line runs against the travel, from the tip back over the body, at the drawn size
  ZP[3] = -dx / dl * szM * dir; ZP[4] = 0; ZP[5] = -dz / dl * szM * dir; ZP[7] = szM * 0.05;
};
