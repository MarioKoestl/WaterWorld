// ============================================================================
// ordovician: Orthocones (Treptoceras, small straight-shelled cephalopods)
// ============================================================================
// Its mesh, its shaders and, for the zoo, where it is at a time. world.js lists it as a kind and gives it its
// instances. The mesh is modelled around the origin, nose at +z, y up: the instance says how large the animal is in
// the world. What it shares with the other animals of this era is in swimmers.js.
//
// Rebuilt 2026-11-24 after Nautilus (quality-gate.md); reworked the same day after ordovician-life.md stage E:
// ten arms in one ring (mirrored pairs), no hood, a slender head. Body and eyes one continuous skin. Shell unchanged.
// aux: 0-0.44 shell, 0.45-0.48 rim, 0.49-0.53 interior, 0.54-0.62 body, 0.63-0.68 eye ball,
//      0.69-0.72 eye socket, 0.73-0.75 socket rim and mouth, 0.76-0.94 arm, 0.95-1.0 funnel

function meshOrthocone(lo) {
  // lo: the simpler mesh for far ones (stage C5), about a fifth of the triangles
  const m = new Mesh();
  rseed(700);
  // SM 22 since stage F3 round 1: a rounder lip and body silhouette close up
  const SL = 0.55, SM = lo ? 10 : 22, SN = lo ? 12 : 30, OR = 0.075;
  const hn = (x) => { const v = sin(x * 127.1 + 311.7) * 43758.5453; return v - floor(v); };
  const sn = (x) => { const i = floor(x), f = x - i, u = f * f * (3 - 2 * f); return hn(i) * (1 - u) + hn(i + 1) * u; };
  // shell cross-section: wider than tall, visible irregularity and growth waviness
  const SR = (t) => (0.003 + (OR - 0.003) * pow(t, 0.73)) * (1 + 0.025 * sin(t * 72) + 0.015 * sn(t * 19) + 0.008 * sn(t * 43));
  const SO = (t, a) => (1 + 0.12 * cos(2 * a)) * (1 + 0.06 * sn(a * 1.8 + t * 7.3) + 0.03 * sn(a * 4.2 + t * 11));
  const SA = (t) => [sin(t * 2.9) * 0.006 + sin(t * 7.1) * 0.003, cos(t * 3.3) * 0.005 + cos(t * 5.7) * 0.003];

  // --- shell: ring by ring, each with its own radius and slight noise
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

  // --- soft parts: body, eyes, arms and funnel, shared with Endoceras (nautiloidSoft in swimmers.js).
  // Stage E of ordovician-life.md: ten arms of 2 to 3 D (the pairs differ), 0.12 to 0.14 D thick at the root and
  // 0.02 D at the tip, on a ring of 0.6 D; a slender head, widest 0.95 D, collar 0.6 D; eye 0.28 D, hole 0.07 D
  nautiloidSoft(m, 2 * OR, [ax, ay, SL], 17.3, {
    inner: 0.52, body: [0.55, 0.62], eye: 0.70, ball: 0.65, dent: 0.74, tent: [0.77, 0.94], funnel: 0.97,
  }, 0.12, lo, { hood: 0, arms: 10, armLen: [2, 3], armThick: [0.12, 0.14], armTip: 0.02, ring: 0.6, headW: 0.95, collar: 0.6, eye: 0.28, eyeHole: 0.07 });

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
  // per-animal numbers from fract(), not hs(): the zoo line below repeats them exactly in JavaScript
  let h = vec3f(fract(s * 61.7), fract(s * 47.3), fract(s * 83.1));
  let R = i.a.w;
  // the jet cycle of 2.5 to 3.5 s; a tenth of the animals hang for some seconds between jets (ordovician-life.md B5)
  let Pj = 2.5 + fract(s * 7.31) + 6. * step(fract(s * 5.3), .1);
  let jc = t / Pj + fract(s * 3.7);
  // no pose, angle or place from fract, floor or step of the time (stage C1): all of it from one cycle angle,
  // so that nothing can jump when the cycle starts again
  let th = TAU * (jc - .12);
  let tj = Pj * (jc + (.8 * sin(th) + .125 * sin(2. * th)) / TAU);
  let ta = tj * i.b.y + i.b.w * 6.3 + (h.x - .5) * (6. / R);
  let ph = i.b.w * 17.;
  let P = orP(ta, i.a, ph);
  let T = orT(ta, i.a, ph) * sign(i.b.y);
  // shell tip first: the body's axis points against the travel (ordovician-life.md B1)
  let Ax = 0. - T;
  let S = normalize(cross(vec3f(0., 1., 0.), Ax)); let Up = cross(Ax, S);
  let off = S * ((h.y - .5) * .5 + sin(t * .3 + s * 30.) * .08) + Up * ((h.z - .5) * .3 + cos(t * .3 + s * 20.) * .06);
  var l = i.p; var n = i.n.xyz;
  let sz = i.b.z * (.85 + .3 * h.z);
  let aux = i.n.w;
  // one jet, one cycle (B2): in the first quarter the head pulls about 0.08 D into the shell, the arms close to a
  // bundle a little over half as wide and stream out behind the travel, the funnel tightens; over the rest the
  // head comes out and the arms open slowly to their rest spread
  let pl = pow(.5 + .5 * cos(th), 3.);
  l.z -= step(.54, aux) * .012 * pl;
  let tF = step(.76, aux) * step(aux, .95);
  let tL = sat((aux - .76) / .18);
  let cl = 1. - .45 * tL * pl * tF;
  l = vec3f(l.x * cl, l.y * cl, l.z);
  // every arm by itself (B3): a slow wave from root to tip in the arm's own plane, toward and away from the axis,
  // with its phase from the arm's angle round the axis, and a little sideways. The root stays still
  let ang = atan2(l.y, l.x);
  let wv = t * (1.1 + .5 * fract(s * 9.17)) + ang * 2. + s * 40. - tL * 4.;
  let bnd = tF * tL * tL * (1. - .7 * pl);
  l += vec3f(cos(ang), sin(ang), 0.) * (.030 * sin(wv) * bnd);
  l += vec3f(0. - sin(ang), cos(ang), 0.) * (.012 * sin(wv * .7 + 1.7) * bnd);
  // funnel tightens with the jet
  l.y -= step(.95, aux) * .006 * pl;
  // posture (B4): between jets the shell tip stands 10 to 25 degrees above level, each animal its own angle;
  // during a jet the animal levels out. It sinks a little as it slows
  let pt = (.17 + .26 * h.y) * (1. - pow(.5 + .5 * cos(th), 2.));
  let cb = cos(pt); let sb = sin(pt);
  let zc = l.z - .30;
  l = vec3f(l.x, l.y * cb - zc * sb, l.y * sb + zc * cb + .30);
  n = vec3f(n.x, n.y * cb - n.z * sb, n.y * sb + n.z * cb);
  let snk = .04 * (.5 - .5 * cos(th));
  let w = dodge(P + off, .4 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * (l.y - snk) + Ax * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + Ax * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
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
  let qD = i.op / .15;
  let dvs = y / max(length(vec2f(x, y)), .001);
  let fnz = fbm(qD * 7. + vec3f(sd * 13.), 2);
  // growth lines along the shell (relief, not painted)
  let gf = z * 200.;
  let gb = (.5 + .5 * cos(gf)) * ss(1.8, .6, fwidth(gf)) * shell;
  // fine relief of the skin: strongest on the top of the head, almost none on the arms (F1)
  let rh = (.010 * gb + .003 * (tg.a - .5) * fine) * shell
    + .0010 * (fnz - .5) * (body * (.35 + .65 * sat(dvs)) + .3 * eyeS) + .0002 * (fnz - .5) * tent;
  let n = skinRelief(ns, i.wp, rh);
  // shell: pale cream/horn, clearly lighter than the animal
  var alb = mix(vec3f(.62, .58, .46), vec3f(.68, .64, .52), .5 + .3 * h2);
  let dors = sat(y / max(abs(x) + abs(y), .001)) * step(0., y);
  // dorsal bands: upper side only. Their spacing grows with the local diameter (the phase follows the growth of
  // the shell), each band has its own width (hash of its number, up to 30%), and the edges are soft (qa 5b, 2d)
  let bph = (59. + 19. * h1) * pow(max(z, .001), .72) + 4. * sin(z * 9.1 + sd * 20.);
  let bw = .38 + .26 * hs(floor(bph * .159155 + .25) * 5.7 + sd * 13.);
  let bndV = ss(bw - .30, bw + .30, .5 + .5 * sin(bph)) * ss(1.2, .4, fwidth(bph));
  alb = mix(alb, mix(vec3f(.26, .22, .16), vec3f(.32, .28, .20), h2), shell * dors * bndV * .60);
  // paler underside
  alb = mix(alb, mix(vec3f(.58, .54, .44), vec3f(.64, .60, .50), h2), shell * sat(0. - y / max(abs(x) + abs(y), .001)) * .25);
  alb *= .82 + .30 * gb;
  alb *= .82 + .4 * h1;
  alb *= .88 + .24 * tg.g;
  // rim: the lip in the shell's own tone, no pale glowing edge (critic, stage F round 1)
  alb = mix(alb, mix(vec3f(.50, .46, .38), vec3f(.56, .52, .44), h2), rim);
  // inner shell: dark, slightly nacreous
  alb = mix(alb, mix(vec3f(.12, .10, .08), vec3f(.18, .15, .10), h2) * (1. + .05 * tg.b), inner);
  // head and socket skin: the living tone at three sizes (F1)
  let bton = skinTone(mix(vec3f(.42, .30, .24), vec3f(.38, .28, .22), h2), qD, dvs, tV * tent, sd);
  alb = mix(alb, bton, body + eyeS);
  // arms: the same skin, paler to the tips, each arm a little its own
  let tSd = hs(floor(atan2(y, x) * 6.) + sd * 100.);
  alb = mix(alb, mix(bton, vec3f(.56, .50, .42) * (.9 + .2 * fnz), tV) * (.92 + .16 * tSd), tent);
  // the eye (F2): the ball's iris and pupil from its own normal in the animal's space
  let eo = vec3f(x - .0036 - .0654 * sign(x), y - .0189, z - .6020);
  alb = mix(alb, eyeIris(normalize(eo), vec3f(.944 * sign(x), .308, .119), sd, .42), ball);
  // the shadowed gap round the ball, and the sunk mouth rings
  alb = mix(alb, vec3f(.04, .03, .02), eyeH);
  // darker in every crease (F1): the arm roots, under the lip, the fold round the eye
  alb *= 1. - .32 * tent * (1. - tV) - .30 * body * ss(.575, .553, lt) - .30 * eyeS * ss(.021, .014, length(eo));
  // funnel: dark muscular tube
  alb = mix(alb, mix(vec3f(.38, .28, .22), vec3f(.34, .25, .20), h2), funnel);
  // light: the shell keeps its wet sheen, the soft parts get the living light (F1), and the ball alone is glossy
  // with one small sharp highlight (F2)
  let soft = body + eyeS + eyeH + tent + funnel;
  let thin = tent * sat(2. * tV - 1.) * .8 + funnel * .6;
  var c = skinWet(alb, n, ns, i.wp, .15 * shell + .05 * rim + .02 * inner, .40 * shell + .05 * rim);
  c = mix(c, skinLive(alb, n, ns, i.wp, thin, fnz, .7 * ball), sat(soft + ball));
  // the mouth: one plain dark hollow in the middle of the collar, no rings (qa 5b)
  let mouth = sat(1. - tent - funnel) * ss(.682, .692, z) * ss(.016, .009, length(vec2f(x, y)));
  c = mix(c, vec3f(.030, .022, .015), mouth);
  return fin(fog(c, i.wp, zone(i.wp)));
}
`;

// ---------------------------------------------------------------- zoo
// One orthocone: the place of vsOrthocone for one individual (orbit, jets, its own angle and offsets), as a line
// from the tip of the shell to the head. The zoo list is the kind's instance list, so the hint and the turntable
// see single animals. The per-animal numbers come from fract() of the seed, which JavaScript repeats exactly with
// Math.fround: change vsOrthocone, change this
const zooOrthocone = (a, i) => {
  const s = a[i + 4], R = a[i + 3], fw = Math.fround;
  const v1 = fw(s * 61.7), h1 = v1 - floor(v1);
  const v2 = fw(s * 47.3), h2 = v2 - floor(v2);
  const v3 = fw(s * 83.1), h3 = v3 - floor(v3);
  const v4 = fw(s * 7.31), v5 = fw(s * 3.7), v6 = fw(s * 5.3);
  const Pj = 2.5 + v4 - floor(v4) + (v6 - floor(v6) <= 0.1 ? 6 : 0), jc = F[TIME] / Pj + v5 - floor(v5);
  const th = TAU * (jc - 0.12);
  const tj = Pj * (jc + (0.8 * sin(th) + 0.125 * sin(2 * th)) / TAU);
  const ph = a[i + 7] * 17, ta = tj * a[i + 5] + a[i + 7] * 6.3 + (h1 - 0.5) * (6 / R);
  const px = a[i] + R * cos(ta), py = a[i + 1] + 0.6 * sin(2 * ta + ph), pz = a[i + 2] + R * 0.5 * sin(ta);
  const sg = a[i + 5] < 0 ? -1 : 1;
  let tx = -R * sin(ta) * sg, ty = 1.2 * cos(2 * ta + ph) * sg, tz = R * 0.5 * cos(ta) * sg;
  const tl = hypot(tx, ty, tz) || 1; tx /= tl; ty /= tl; tz /= tl;
  let sx = tz, sz = -tx; const sl = hypot(sx, sz) || 1; sx /= sl; sz /= sl;
  const ux = ty * sz, uy = tz * sx - tx * sz, uz = -ty * sx;
  sx = -sx; sz = -sz; // the shader's S comes from the axis -T (B1): the old S flipped. Up stays the same
  const t = F[TIME], oS = (h2 - 0.5) * 0.5 + sin(t * 0.3 + s * 30) * 0.08, oU = (h3 - 0.5) * 0.3 + cos(t * 0.3 + s * 20) * 0.06;
  const szM = a[i + 6] * (0.85 + 0.3 * h3);
  // the line carries the posture and the sinking of vsOrthocone (B4, C1), rotated about the pivot z = 0.30 of the
  // mesh: the eye picture of --qa aims along it (stage F), and the hint and ways gain with it
  const pt = (0.17 + 0.26 * h2) * (1 - pow(0.5 + 0.5 * cos(th), 2)), cb = cos(pt), sb = sin(pt);
  const snk = 0.04 * (0.5 - 0.5 * cos(th));
  const Axx = -tx, Axy = -ty, Axz = -tz;
  // shell tip first (B1): the body lies against the travel, so the line from tip to head runs backwards
  ZP[0] = px + sx * oS + ux * oU + (ux * (0.3 * sb - snk) + Axx * 0.3 * (1 - cb)) * szM;
  ZP[1] = py + uy * oU + (uy * (0.3 * sb - snk) + Axy * 0.3 * (1 - cb)) * szM;
  ZP[2] = pz + sz * oS + uz * oU + (uz * (0.3 * sb - snk) + Axz * 0.3 * (1 - cb)) * szM;
  ZP[3] = (Axx * cb - ux * sb) * szM; ZP[4] = (Axy * cb - uy * sb) * szM; ZP[5] = (Axz * cb - uz * sb) * szM; ZP[7] = 0.09 * szM;
};
