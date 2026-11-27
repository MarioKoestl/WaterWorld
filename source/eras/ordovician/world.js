// ============================================================================
// ordovician: what is drawn, and where it stands (load-time only)
// ============================================================================
// The kinds are drawn in the order they are declared (see kind() in engine/tools.js)
const stone = (sd, sub, det) => () => meshChunk(sd, sub, det).build();
const STONE = [4, 15, 27].map((sd) => kind({ solid: 1, shadow: 1, cells: 1, far: 70, lodFrom: 25, mesh: stone(sd, 3), lod: stone(sd, 2, 1) }));
const GRIT = kind({ solid: 1, shadow: 1, cells: 1, far: 25, mesh: stone(9, 1) });

// --- standing kinds (stage 2)
const BRACH = [0, 1].map((t) => kind({ solid: 1, cells: 1, far: 20, lodFrom: 3, mesh: () => meshBrachiopod(t, 0).build(), lod: () => meshBrachiopod(t, 0, 1).build() }));
const BRACH_DEAD = kind({ solid: 1, cells: 1, far: 15, mesh: () => meshBrachiopod(0, 1).build() });
const BRYOZOAN = [0, 1, 2].map((s) => kind({ solid: 1, cells: 1, far: 35, lodFrom: 5, mesh: () => meshBryozoan(s).build(), lod: () => meshBryozoan(s, 1).build() }));
const HORNCORAL = [0, 1, 2].map((s) => kind({ solid: 1, cells: 1, far: 35, lodFrom: 5, mesh: () => meshHornCoral(s).build(), lod: () => meshHornCoral(s, 1).build() }));
const CRINOID = [0, 1, 2].map((s) => kind({ solid: 1, shadow: 1, cells: 1, far: 60, lodFrom: 10, mesh: () => meshCrinoid(s).build(), lod: () => meshCrinoid(s, 1).build() }));

// --- swimmer kinds (stage 3). Every swimmer has a simpler far mesh and is not drawn beyond 70 m (stage
// G3: the haze ends the view at about 40 m)
const GRAPTOLITE = kind({ mesh: () => meshGraptolite(0).build(), lod: () => meshGraptolite(0, 1).build(), lodFrom: 18, far: 70, wgsl: S_SEA + S_GRAPTOLITE, vs: 'vsGraptolite', fs: 'fsGraptolite' });
const ORTHOCONES = kind({ mesh: () => meshOrthocone().build(), lod: () => meshOrthocone(1).build(), lodFrom: 25, far: 70, wgsl: S_ORTHOCONES, vs: 'vsOrthocone', fs: 'fsOrthocone' });
const ASTRASPIS = kind({ mesh: () => meshAstraspis().build(), lod: () => meshAstraspis(1).build(), lodFrom: 20, far: 70, wgsl: S_ASTRASPIS, vs: 'vsAstraspis', fs: 'fsAstraspis' });
const ENDOCERAS = kind({ mesh: () => meshEndoceras().build(), lod: () => meshEndoceras(1).build(), lodFrom: 25, far: 70, wgsl: S_ENDOCERAS, vs: 'vsEndoceras', fs: 'fsEndoceras' });

// --- walker kinds (stage 4, walkers_isotelus.js): the trilobite, its soft shadow patch (see-through, so it is
// drawn after everything solid) and the mud heaped round the ones that lie dug in (a piece of the ground)
const ISOTELUS = kind({ mesh: () => meshIso().build(), lod: () => meshIso(1).build(), lodFrom: 18, far: 70, wgsl: S_WALK + S_ISO, vs: 'vsIso', fs: 'fsIso' });
const ISO_SHADOW = kind({ glass: 1, mesh: () => meshIsoShadow().build(), wgsl: S_ISO_SHADOW, vs: 'vsIsoShadow', fs: 'fsIsoShadow' });
const ISO_HEAP = kind({ solid: 1, mesh: meshIsoHeap });

// --- sea scorpion (stage 4, walkers_megalograptus.js): the walker and its soft shadow
const MEGALOGRAPTUS = kind({ mesh: () => meshMega().build(), lod: () => meshMega(1).build(), lodFrom: 18, far: 70, wgsl: S_MEGA, vs: 'vsMega', fs: 'fsMega' });
const MEGA_SHADOW = kind({ glass: 1, mesh: () => meshMegaShadow().build(), wgsl: S_MEGA_SHADOW, vs: 'vsMegaShadow', fs: 'fsMegaShadow' });

// ---------------------------------------------------------------- scattering
function makeWorld(W) {
  const { T, Dw, cellOf, pickV, nearFly, nearPose, gy, gyExact, place, backdrop } = W;
  // the smaller sea (stage G1): standing life is dense to 85 m and thins out to 105 m, so the view outward from
  // the edge (75 m) is not empty; beyond that the floor sinks away
  const thin = (x, z) => 1 - sstep(85, 105, hypot(x, z));
  // the crinoid meadows (stage G2): patches from one broad noise, about a quarter of the floor
  const meadowAt = (x, z) => sstep(0.47, 0.52, fbm(x * 0.021, z * 0.021, 61, 3));
  // the foot field (stage H4): a soft splat under every stone and everything that stands, summed here and
  // written to the ground map's red byte below; look.js darkens the mud there and tilts the light as if the
  // mud were drawn up against the foot
  const FOOT = new Float32Array(512 * 512);
  const foot = (x, z, r, amt) => {
    const u = (x / 384 + 0.5) * 512 - 0.5, v = (z / 384 + 0.5) * 512 - 0.5, R = (r + 0.8) / 0.75;
    const i0 = max(0, floor(u - R) + 1), i1 = min(511, floor(u + R)), j0 = max(0, floor(v - R) + 1), j1 = min(511, floor(v + R));
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const d = hypot(i - u, j - v) / R;
      if (d < 1) FOOT[i + 512 * j] += amt * (1 - d) * (1 - d);
    }
  };
  const footAt = (x, z) => FOOT[((x / 384 + 0.5) * 512 | 0) + 512 * ((z / 384 + 0.5) * 512 | 0)];
  // --- stones: eroded limestone, more where the floor is steeper (near ledges). Only on nearly level ground so the
  // whole stone sits on the mud, sunk in a little
  rseed(1);
  for (let i = 0; i < 50000; i++) {
    const k = pickV(), x = T.wp[k], y = T.wp[k + 1], z = T.wp[k + 2];
    if (T.wn[k + 1] < 0.85 || hypot(x, z) > 130) continue;
    const steep = 1 - T.wn[k + 1];
    if (rnd() > 0.03 + 0.25 * steep || nearFly(x, y, z, 2.5) || nearPose(x, z, 1.5)) continue;
    const sc = 0.08 + 0.5 * pow(rnd(), 3), q = qRand(), e = sc * 0.6;
    if (Dw(x + e, y - sc * 0.3, z) <= 0 || Dw(x - e, y - sc * 0.3, z) <= 0) continue;
    STONE[rnd() * 3 | 0].at[cellOf(x, z)].push(x, y - sc * 0.08, z, sc, q[0], q[1], q[2], q[3], 1, rnd(), 0, 0);
    foot(x, z, sc, 0.55);
  }
  // --- grit: fine shell debris and small stones, strewn everywhere on the mud (stage G: the floor of this sea
  // is a plain of shell hash, so no stretch of mud in reach of the eye is empty). Four times as much since
  // stage H4, gathered in the troughs of the floor and against the stones (the foot field holds only stones here)
  rseed(2);
  const trough = (x, z) => sstep(0.6, 0.35, fbm(x * 0.048, z * 0.048, 7, 2));
  for (let i = 0; i < 1200000; i++) {
    const k = pickV(), x = T.wp[k] + rr(-0.3, 0.3), z = T.wp[k + 2] + rr(-0.3, 0.3), y = T.wp[k + 1];
    if (T.wn[k + 1] < 0.85 || hypot(x, z) > 130) continue;
    if (rnd() > 0.25 * (0.45 + 1.1 * trough(x, z) + 1.4 * min(footAt(x, z), 1))) continue;
    const sc = 0.015 + 0.07 * pow(rnd(), 2), q = qRand();
    if (Dw(x, y - 0.2, z) <= 0) continue;
    GRIT.at[cellOf(x, z)].push(x, y - sc * 0.3, z, sc, q[0], q[1], q[2], q[3], 1, rnd(), 25, 0);
  }
  // --- brachiopod pavements on flat mud, edge to edge in patches, and a loose carpet of single shells and dead
  // halves over all the mud besides (stage G2: more wherever the mud is bare), so no stretch of mud in reach of
  // the eye is empty
  rseed(10);
  for (let i = 0; i < 1300000; i++) {
    const k = pickV(), x = T.wp[k], y = T.wp[k + 1], z = T.wp[k + 2];
    if (T.wn[k + 1] < 0.88 || hypot(x, z) > 105) continue;
    const led = ledgeAt(x, z);
    if (led > 0.4) continue;
    const pav = sstep(0.3, 0.55, fbm(x * 0.04, z * 0.04, 51, 2));
    const dead = rnd() < 0.2;
    if (rnd() > (dead ? 0.2 : 0.16 * pav * (1 - led * 2) + 0.12 * (1 - pav)) * thin(x, z)) continue;
    if (nearPose(x, z, 0.8) || nearFly(x, y, z, 1.5)) continue;
    const type = rnd() > 0.5 ? 1 : 0, sc = rr(0.8, 1.3);
    const q = dead ? qRand() : qAxis(0, 1, 0, rnd() * TAU);
    (dead ? BRACH_DEAD : BRACH[type]).at[cellOf(x, z)].push(x, y - 0.002, z, sc, q[0], q[1], q[2], q[3], 2, rnd(), 200, 0);
  }
  place('brachiopod', 3, gy(3, 3), 3, 8, gy(8, 8), 8, 2, 0.3);
  place('brachiopod', 8, gy(8, 58), 58, 14, gy(14, 62), 62, 2, 0.3);
  // --- bryozoan thickets: every limestone ledge covered edge to edge, four times as many (stage G2)
  rseed(20);
  for (let i = 0; i < 600000; i++) {
    const k = pickV(), x = T.wp[k], y = T.wp[k + 1], z = T.wp[k + 2];
    if (T.wn[k + 1] < 0.86 || hypot(x, z) > 105) continue;
    const led = ledgeAt(x, z);
    if (led < 0.25 || rnd() > 0.45 * led * thin(x, z)) continue;
    if (nearPose(x, z, 0.6) || nearFly(x, y, z, 1.2)) continue;
    const sc = rr(0.8, 1.3), q = qAxis(0, 1, 0, rnd() * TAU);
    BRYOZOAN[rnd() * 3 | 0].at[cellOf(x, z)].push(x, y, z, sc, q[0], q[1], q[2], q[3], 3, rnd(), 80, 0);
    foot(x, z, 0.45 * sc, 0.4);
  }
  place('bryozoan', -18, gy(-18, -48), -48, -15, gy(-15, -52), -52, 2, 0.3);
  // --- horn corals: about 3,000, in loose fields on the mud, thickest toward the ledge edges (stage G2)
  rseed(30);
  for (let i = 0; i < 300000; i++) {
    const k = pickV(), x = T.wp[k], y = T.wp[k + 1], z = T.wp[k + 2];
    if (T.wn[k + 1] < 0.9 || hypot(x, z) > 105) continue;
    const led = ledgeAt(x, z);
    if (led > 0.5) continue;
    const fld = sstep(0.5, 0.6, fbm(x * 0.05, z * 0.05, 57, 2));
    if (rnd() > (0.11 + 0.22 * fld) * (0.5 + led) * thin(x, z)) continue;
    if (nearPose(x, z, 0.5) || nearFly(x, y, z, 1)) continue;
    const sc = rr(0.85, 1.15), q = qAxis(0, 1, 0, rnd() * TAU);
    HORNCORAL[rnd() * 3 | 0].at[cellOf(x, z)].push(x, y, z, sc, q[0], q[1], q[2], q[3], 4, rnd(), 60, 0);
    foot(x, z, 0.3 * sc, 0.35);
  }
  place('horncoral', 38, gy(38, -18), -18, 42, gy(42, -22), -22, 2, 0.3);
  // --- crinoid meadows: 3 to 6 a square metre on about a quarter of the floor (stage G2). More picks land on a
  // meadow vertex than there are vertices in it: the jitter spreads them over the mud between the grid columns
  // (sunk 2 cm, and only on nearly level ground, so no holdfast hangs in the water)
  rseed(40);
  for (let i = 0; i < 3000000; i++) {
    const k = pickV(), x0 = T.wp[k], y = T.wp[k + 1], z0 = T.wp[k + 2];
    if (T.wn[k + 1] < 0.92 || hypot(x0, z0) > 105 || rnd() > 0.38) continue;
    if (ledgeAt(x0, z0) > 0.6) continue;
    if (rnd() > meadowAt(x0, z0) * thin(x0, z0)) continue;
    const x = x0 + rr(-0.28, 0.28), z = z0 + rr(-0.28, 0.28);
    if (nearPose(x, z, 0.6) || nearFly(x, y, z, 1.5)) continue;
    const sc = rr(0.85, 1.15), q = qAxis(0, 1, 0, rnd() * TAU);
    CRINOID[rnd() * 3 | 0].at[cellOf(x, z)].push(x, y - 0.02, z, sc, q[0], q[1], q[2], q[3], 5, rnd(), 15, -0.6);
    foot(x, z, 0.3, 0.3);
  }
  place('crinoid', 2, gy(2, 11), 11, 6, gy(6, 14), 14, 5, 0.5);
  // --- ground map (512 x 512 over the world): alpha says how much of the floor is limestone, red how firmly
  // something stands on this patch of mud (the foot field, stage H4), both for look.js
  for (let j = 0; j < 512; j++) for (let i = 0; i < 512; i++) {
    const x = (i + 0.5) / 512 * 384 - 192, z = (j + 0.5) / 512 * 384 - 192, o = (i + 512 * j) * 4;
    W.gm[o] = min(255, FOOT[i + 512 * j] * 255); W.gm[o + 1] = 0; W.gm[o + 2] = 0;
    W.gm[o + 3] = ledgeAt(x, z) * 255;
  }
  // --- drifting particles: a few, plus shell grit near the floor
  rseed(3);
  W.snow(25000);
  // --- graptolite swarms: high and in the middle of the water, loose clouds drifting round their centres.
  // 80 swarms of 80 to 220, centres within 80 m (ordovician-life.md, stage G2). Each animal has its own ring
  // (a.w), its own height and its own pace, so a swarm is a cloud, not a ring
  rseed(100);
  const graptolites = [], graptoliteZoo = [];
  for (let i = 0; i < 80; i++) {
    const an = rnd() * TAU, rad = 4 + 74 * sqrt(rnd());
    const sx = cos(an) * rad, sz = sin(an) * rad;
    const sy = max(-4.5 - rr(0, 7.5), floorH(sx, sz) + 3.5);
    const sR = rr(2.5, 5);
    const spd = rr(0.08, 0.15) * (rnd() > 0.5 ? 1 : -1);
    const sSeed = rnd();
    graptoliteZoo.push(sx, sy, sz, sR, 0, spd, 0.06, sSeed);
    const n = 80 + (rnd() * 141 | 0);
    for (let j = 0; j < n; j++) graptolites.push(sx, sy + rr(-1, 1), sz, sR * rr(0.6, 1.4), rnd(), spd * rr(0.85, 1.15), rr(0.02, 0.1), sSeed);
  }
  // and two swarms over the start (test pose 1), so the first view is already teeming (the stage G check asks
  // for 120 swimmers within 20 m of every pose; the random centres above cannot promise that at the middle)
  for (const [sx, sz] of [[2, 6], [12, -2]]) {
    const sy = max(-4.5 - rr(0, 7.5), floorH(sx, sz) + 3.5);
    const sR = rr(2.5, 5);
    const spd = rr(0.08, 0.15) * (rnd() > 0.5 ? 1 : -1);
    const sSeed = rnd();
    graptoliteZoo.push(sx, sy, sz, sR, 0, spd, 0.06, sSeed);
    const n = 80 + (rnd() * 141 | 0);
    for (let j = 0; j < n; j++) graptolites.push(sx, sy + rr(-1, 1), sz, sR * rr(0.6, 1.4), rnd(), spd * rr(0.85, 1.15), rr(0.02, 0.1), sSeed);
  }
  GRAPTOLITE.data = new Float32Array(graptolites);
  // --- orthocone groups: small straight-shelled cephalopods in the middle and lower water, in short jerks.
  // 45 groups of 20 to 80 plus about 150 alone or in pairs, centres within 80 m (ordovician-life.md, stage G2).
  // A group is a cloud over its whole space: 2 to 5 m to the side (its own ring radius per animal), 1 to 2 m up
  // and down (its own height), its own pace up to 20 % off the group's; the jet rhythm is the animal's own already
  // (vsOrthocone, from its seed). Groups differ in size, in the width of their round and in height over the floor
  rseed(110);
  const orthocones = [];
  const orOne = (cx, cy, cz, R, sd, spd, side, th) => {
    orthocones.push(cx, cy + rr(-th / 2, th / 2), cz, R + rr(-side / 2, side / 2), rnd(), spd * rr(0.8, 1.2), rr(0.15, 0.4), sd);
  };
  // the highest floor under the whole band a group swims over: each animal's own ring is up to s metres inside
  // or outside R (the side spread and its wander), so the band is sampled at five radii and 24 angles, or a
  // ledge between the sampled points leaves an animal under the drawn ground (ways.mjs found exactly that)
  const orFloor = (cx, cz, R, s) => {
    let fh = floorH(cx, cz);
    for (let q = -2; q <= 2; q++) {
      const r = max(R + q * s / 2, 0.4);
      // the rings are ellipses, half as deep as wide (orP in swimmers_orthocones.js)
      for (let k = 0; k < 24; k++) fh = max(fh, floorH(cx + cos(k / 24 * TAU) * r, cz + sin(k / 24 * TAU) * r * 0.5));
    }
    // the drawn limestone is rough beyond the formula (floor.js): a margin over the highest sampled point
    return fh + 0.4;
  };
  for (let i = 0; i < 45; i++) {
    const an = rnd() * TAU, rad = 6 + 72 * sqrt(rnd());
    const cx = cos(an) * rad, cz = sin(an) * rad;
    const R = rr(3.5, 8), side = rr(2, 5), th = rr(1, 2);
    // groups at every height from 1.5 to 12 m over the mud (stage I2); th/2 and the 0.6 m bob of orP, so the
    // lowest animal keeps it
    const cy = orFloor(cx, cz, R, 2.9) + th / 2 + 0.6 + rr(1.1, 11.4);
    const spd = rr(0.015, 0.025) * (rnd() < 0.5 ? 1 : -1);
    const sd = rnd();
    const n = 20 + (rnd() * 61 | 0);
    for (let j = 0; j < n; j++) orOne(cx, cy, cz, R, sd, spd, side, th);
  }
  for (let i = 0; i < 100; i++) {
    const an = rnd() * TAU, rad = 4 + 76 * sqrt(rnd());
    const cx = cos(an) * rad, cz = sin(an) * rad;
    const R = rr(1.5, 4);
    const cy = orFloor(cx, cz, R, 1.1) + 0.4 + 0.6 + rr(1.1, 11.4);
    const spd = rr(0.015, 0.025) * (rnd() < 0.5 ? 1 : -1);
    const sd = rnd(), n = rnd() < 0.5 ? 1 : 2;
    for (let j = 0; j < n; j++) orOne(cx, cy, cz, R, sd, spd, 1.2, 0.8);
  }
  // and two groups round the start, as with the graptolite swarms above
  for (const [cx, cz] of [[14, 8], [-4, 2]]) {
    const R = rr(3.5, 6), side = rr(2, 5), th = rr(1, 2);
    const cy = orFloor(cx, cz, R, 2.9) + th / 2 + 0.6 + rr(1.1, 7.4);
    const spd = rr(0.015, 0.025) * (rnd() < 0.5 ? 1 : -1);
    const sd = rnd();
    const n = 40 + (rnd() * 41 | 0);
    for (let j = 0; j < n; j++) orOne(cx, cy, cz, R, sd, spd, side, th);
  }
  ORTHOCONES.data = new Float32Array(orthocones);
  // --- Astraspis schools: just over the floor, in open areas of the shelf.
  // 90 schools of 15 to 45, centres within 80 m (ordovician-life.md, stage G2), each a cloud over the mud like
  // the orthocone groups
  rseed(120);
  const astraspis = [];
  for (let i = 0; i < 90; i++) {
    const an = rnd() * TAU, rad = 6 + 72 * sqrt(rnd());
    const cx = cos(an) * rad, cz = sin(an) * rad;
    const R = rr(3.5, 7), side = rr(2, 4);
    const hgt = rr(0.35, 0.7);
    const spd = rr(0.03, 0.06) * (rnd() < 0.5 ? 1 : -1);
    const sd = rnd();
    const n = 15 + (rnd() * 31 | 0);
    for (let j = 0; j < n; j++) astraspis.push(cx, hgt + rr(0, 1), cz, R + rr(-side / 2, side / 2), rnd(), spd * rr(0.8, 1.2), rr(0.16, 0.22), sd);
  }
  // and three schools round the start, so the first view teems with them
  for (const [cx, cz] of [[9, 12], [3, 4], [16, 0]]) {
    const R = rr(4, 6), side = rr(2, 4), hgt = rr(0.35, 0.7);
    const spd = rr(0.03, 0.06) * (rnd() < 0.5 ? 1 : -1), sd = rnd();
    const n = 25 + (rnd() * 21 | 0);
    for (let j = 0; j < n; j++) astraspis.push(cx, hgt + rr(0, 1), cz, R + rr(-side / 2, side / 2), rnd(), spd * rr(0.8, 1.2), rr(0.16, 0.22), sd);
  }
  ASTRASPIS.data = new Float32Array(astraspis);
  // --- Endoceras: giants of every size at every height (stage I1). 100, each alone on its own round: about 12
  // of 4.8 to 5.7 m, 35 of 3 to 4.5 m and 53 younger ones of 1.8 to 3 m, anywhere from 1 to 12 m over the mud,
  // the largest mostly in the lower half; no two within 12 m of each other in the same 2 m of height. The
  // smaller, the quicker. Some rounds are tilted, so an animal also climbs and sinks on its way (the tilt is the
  // shader's, from the seed: swimmers_endoceras.js).
  rseed(130);
  const endoceras = [];
  // the shader follows the mud formula at the animal's anchor, but the shell reaches past it: where a round
  // crosses a limestone ledge, the shell's end pokes into the step (ways.mjs, a dip of over half a metre). So
  // the round keeps its whole sweep (half the animal to each side) off any place where the drawn ground stands
  // more than 0.3 m over the formula, or the animal swims high enough to clear the step
  const clearRound = (cx, cz, R, mL) => {
    for (let s = 0; s < 80; s++) {
      const a = s / 80 * TAU, ca = cos(a), sa = sin(a);
      for (const dr of [0 - mL, 0, mL]) {
        const x = cx + ca * (R + dr), z = cz + sa * (R + dr);
        if (gy(x, z) - floorH(x, z) > 0.3) return false;
      }
    }
    return true;
  };
  const eSizes = [];
  for (let i = 0; i < 12; i++) eSizes.push(rr(4.8, 5.7));
  for (let i = 0; i < 35; i++) eSizes.push(rr(3, 4.5));
  for (let i = 0; i < 53; i++) eSizes.push(rr(1.8, 3));
  for (let i = eSizes.length - 1; i > 0; i--) { const j = floor(rnd() * (i + 1)), q = eSizes[i]; eSizes[i] = eSizes[j]; eSizes[j] = q; }
  const placedE = [];
  for (const eL of eSizes) {
    let cx = 0, cz = 0, R = 15, hy = 3, ok = false;
    for (let t = 0; t < 40 && !ok; t++) {
      const an = rnd() * TAU, rad = 4 + 76 * sqrt(rnd());
      cx = cos(an) * rad; cz = sin(an) * rad; R = rr(10, 30);
      hy = 1 + 11 * pow(rnd(), mix(0.9, 1.9, sstep(1.8, 5.7, eL)));
      ok = clearRound(cx, cz, R, eL * 0.5) && !placedE.some((p) => hypot(cx - p[0], cz - p[1]) < 12 && abs(hy - p[2]) < 2);
    }
    for (let t = 0; t < 8 && !ok; t++) { R *= 0.82; ok = R > 6 && clearRound(cx, cz, R, eL * 0.5); }
    if (!ok) hy = max(hy, 3.2);
    placedE.push([cx, cz, hy]);
    // the pace follows the size: a 2 m animal about twice the pace of a 5.7 m one (the jet rhythm follows in
    // the shader from the same rule)
    const v = rr(0.25, 0.4) * pow(5.7 / eL, 0.66);
    endoceras.push(cx, hy, cz, R, rnd(), (v / R) * (rnd() < 0.5 ? 1 : -1), eL, rnd());
  }
  // near every test pose the heights must spread over 6 m and the sizes over 2.5 m (the check of stage I).
  // Where chance gave less: raise the highest animal there (raising is always safe over a ledge), or trade the
  // sizes of two animals, with the pace traded along and the round checked for the larger reach
  for (const pv of ERA.views) {
    const ids = [];
    for (let j = 0; j < endoceras.length; j += 8) if (hypot(endoceras[j] - pv[0], endoceras[j + 2] - pv[2]) <= 30) ids.push(j);
    if (ids.length < 2) continue;
    let lo = ids[0], hi = ids[0], sLo = ids[0], sHi = ids[0];
    for (const j of ids) {
      if (endoceras[j + 1] < endoceras[lo + 1]) lo = j;
      if (endoceras[j + 1] > endoceras[hi + 1]) hi = j;
      if (endoceras[j + 6] < endoceras[sLo + 6]) sLo = j;
      if (endoceras[j + 6] > endoceras[sHi + 6]) sHi = j;
    }
    if (endoceras[hi + 1] - endoceras[lo + 1] < 6.5) {
      const want = min(12, endoceras[lo + 1] + 6.8);
      for (const cand of [want, want - 0.7, min(12, want + 0.7), want - 1.4]) {
        let free = true;
        for (let j = 0; j < endoceras.length; j += 8) if (j !== hi && hypot(endoceras[j] - endoceras[hi], endoceras[j + 2] - endoceras[hi + 2]) < 12 && abs(cand - endoceras[j + 1]) < 2) { free = false; break; }
        if (free || cand === want - 1.4) { endoceras[hi + 1] = max(endoceras[hi + 1], cand); break; }
      }
    }
    if (endoceras[sHi + 6] - endoceras[sLo + 6] < 2.6) {
      // a small donor into the circle is always safe; a large one only where the circle's round has the reach
      const swap = (ja, jb) => {
        const L1 = endoceras[ja + 6], v1 = abs(endoceras[ja + 5]) * endoceras[ja + 3], v2 = abs(endoceras[jb + 5]) * endoceras[jb + 3];
        endoceras[ja + 6] = endoceras[jb + 6]; endoceras[jb + 6] = L1;
        endoceras[ja + 5] = (v2 / endoceras[ja + 3]) * (endoceras[ja + 5] < 0 ? -1 : 1);
        endoceras[jb + 5] = (v1 / endoceras[jb + 3]) * (endoceras[jb + 5] < 0 ? -1 : 1);
      };
      let done = false;
      for (const j2 of ids) {
        if (done) break;
        for (let j = 0; j < endoceras.length && !done; j += 8) {
          if (ids.includes(j) || endoceras[j + 6] < endoceras[sLo + 6] + 2.7) continue;
          if (!clearRound(endoceras[j2], endoceras[j2 + 2], endoceras[j2 + 3], endoceras[j + 6] * 0.5)) continue;
          swap(j2, j); done = true;
        }
      }
    }
  }
  ENDOCERAS.data = new Float32Array(endoceras);
  // --- ground grid for the zoo of floor-following animals (Astraspis, Endoceras).
  // gy is fast (nearest column of the density grid, 0.75 m); gyExact is too slow for 333 k calls
  for (let j = 0; j < GRN; j++) for (let i = 0; i < GRN; i++) {
    const x = i * 0.5 - GRH, z = j * 0.5 - GRH;
    GRD[i + GRN * j] = gy(x, z);
  }
  // --- the trilobites: about 600 in loose crowds on the mud between the meadows, many half dug in
  // (walkers_isotelus.js; it measures the drawn ground, so it runs after everything that stands is placed)
  makeIsotelus(W);
  // --- the sea scorpions: about 20 alone, far apart, near the trilobite crowds
  makeMegalograptus(W);
  // --- zoo: swimmers
  zooMove('graptolite', new Float32Array(graptoliteZoo), zooGraptolite, 5);
  zooMove('orthocones', ORTHOCONES.data, zooOrthocone, 5); // per individual: the list is the kind's own (qa 5b)
  zooMove('astraspis', ASTRASPIS.data, zooAstraspis, 5); // per individual: the list is the kind's own (qa 5b)
  zooMove('endoceras', ENDOCERAS.data, zooEndoceras, 15);
  // --- the shelf as a backdrop: named where nothing else is looked at
  for (let z = -100; z <= 100; z += 12) {
    const x = 0, y = floorH(x, z) + 1;
    backdrop('shelf', x - 10, y, z, x + 10, y, z, 15, 6);
  }
}
