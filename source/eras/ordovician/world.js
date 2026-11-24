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

// --- swimmer kinds (stage 3)
const GRAPTOLITE = kind({ mesh: () => meshGraptolite(0).build(), wgsl: S_SEA + S_GRAPTOLITE, vs: 'vsGraptolite', fs: 'fsGraptolite' });
const ORTHOCONES = kind({ mesh: () => meshOrthocone().build(), wgsl: S_ORTHOCONES, vs: 'vsOrthocone', fs: 'fsOrthocone' });
const ASTRASPIS = kind({ mesh: () => meshAstraspis().build(), wgsl: S_ASTRASPIS, vs: 'vsAstraspis', fs: 'fsAstraspis' });
const ENDOCERAS = kind({ mesh: () => meshEndoceras().build(), wgsl: S_ENDOCERAS, vs: 'vsEndoceras', fs: 'fsEndoceras' });

// ---------------------------------------------------------------- scattering
function makeWorld(W) {
  const { T, Dw, cellOf, pickV, nearFly, nearPose, gy, gyExact, place, backdrop } = W;
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
  }
  // --- grit: fine shell debris and small stones, everywhere on the mud
  rseed(2);
  for (let i = 0; i < 120000; i++) {
    const k = pickV(), x = T.wp[k] + rr(-0.3, 0.3), z = T.wp[k + 2] + rr(-0.3, 0.3), y = T.wp[k + 1];
    if (T.wn[k + 1] < 0.85 || hypot(x, z) > 130 || rnd() > 0.08) continue;
    const sc = 0.015 + 0.07 * pow(rnd(), 2), q = qRand();
    if (Dw(x, y - 0.2, z) <= 0) continue;
    GRIT.at[cellOf(x, z)].push(x, y - sc * 0.3, z, sc, q[0], q[1], q[2], q[3], 1, rnd(), 25, 0);
  }
  // --- brachiopod pavements: on flat mud, edge to edge in patches; dead halves scattered everywhere on the mud
  rseed(10);
  for (let i = 0; i < 600000; i++) {
    const k = pickV(), x = T.wp[k], y = T.wp[k + 1], z = T.wp[k + 2];
    if (T.wn[k + 1] < 0.88 || hypot(x, z) > 120) continue;
    const led = ledgeAt(x, z);
    if (led > 0.4) continue;
    const pav = fbm(x * 0.04, z * 0.04, 51, 2);
    const dead = rnd() < 0.2;
    if (rnd() > (dead ? 0.05 : 0.16 * sstep(0.3, 0.55, pav) * (1 - led * 2))) continue;
    if (nearPose(x, z, 0.8) || nearFly(x, y, z, 1.5)) continue;
    const type = rnd() > 0.5 ? 1 : 0, sc = rr(0.8, 1.3);
    const q = dead ? qRand() : qAxis(0, 1, 0, rnd() * TAU);
    (dead ? BRACH_DEAD : BRACH[type]).at[cellOf(x, z)].push(x, y - 0.002, z, sc, q[0], q[1], q[2], q[3], 2, rnd(), 200, 0);
  }
  place('brachiopod', 3, gy(3, 3), 3, 8, gy(8, 8), 8, 2, 0.3);
  place('brachiopod', 8, gy(8, 58), 58, 14, gy(14, 62), 62, 2, 0.3);
  // --- bryozoan thickets: on every limestone ledge, dense
  rseed(20);
  for (let i = 0; i < 250000; i++) {
    const k = pickV(), x = T.wp[k], y = T.wp[k + 1], z = T.wp[k + 2];
    if (T.wn[k + 1] < 0.86 || hypot(x, z) > 120) continue;
    const led = ledgeAt(x, z);
    if (led < 0.25 || rnd() > 0.09 * led) continue;
    if (nearPose(x, z, 0.6) || nearFly(x, y, z, 1.2)) continue;
    const sc = rr(0.8, 1.3), q = qAxis(0, 1, 0, rnd() * TAU);
    BRYOZOAN[rnd() * 3 | 0].at[cellOf(x, z)].push(x, y, z, sc, q[0], q[1], q[2], q[3], 3, rnd(), 80, 0);
  }
  place('bryozoan', -18, gy(-18, -48), -48, -15, gy(-15, -52), -52, 2, 0.3);
  // --- horn corals: on mixed ground near ledge edges, lying on the mud
  rseed(30);
  for (let i = 0; i < 80000; i++) {
    const k = pickV(), x = T.wp[k], y = T.wp[k + 1], z = T.wp[k + 2];
    if (T.wn[k + 1] < 0.9 || hypot(x, z) > 120) continue;
    const led = ledgeAt(x, z);
    if (led > 0.5 || led < 0.05 || rnd() > 0.008) continue;
    if (nearPose(x, z, 0.5) || nearFly(x, y, z, 1)) continue;
    const sc = rr(0.85, 1.15), q = qAxis(0, 1, 0, rnd() * TAU);
    HORNCORAL[rnd() * 3 | 0].at[cellOf(x, z)].push(x, y, z, sc, q[0], q[1], q[2], q[3], 4, rnd(), 60, 0);
  }
  place('horncoral', 38, gy(38, -18), -18, 42, gy(42, -22), -22, 2, 0.3);
  // --- crinoid meadows: on higher ground and ledge edges
  rseed(40);
  for (let i = 0; i < 300000; i++) {
    const k = pickV(), x = T.wp[k], y = T.wp[k + 1], z = T.wp[k + 2];
    if (T.wn[k + 1] < 0.9 || hypot(x, z) > 120) continue;
    const led = ledgeAt(x, z);
    const meadow = sstep(-16, -14, floorH(x, z)) * 0.5 + sstep(0.15, 0.45, led) * 0.5;
    if (rnd() > 0.012 * meadow) continue;
    if (nearPose(x, z, 0.6) || nearFly(x, y, z, 1.5)) continue;
    const sc = rr(0.85, 1.15), q = qAxis(0, 1, 0, rnd() * TAU);
    CRINOID[rnd() * 3 | 0].at[cellOf(x, z)].push(x, y, z, sc, q[0], q[1], q[2], q[3], 5, rnd(), 15, -0.6);
  }
  place('crinoid', -33, gy(-33, 28), 28, -37, gy(-37, 32), 32, 5, 0.5);
  // --- ground map (512 x 512 over the world): alpha says how much of the floor is limestone (for look.js)
  for (let j = 0; j < 512; j++) for (let i = 0; i < 512; i++) {
    const x = (i + 0.5) / 512 * 384 - 192, z = (j + 0.5) / 512 * 384 - 192, o = (i + 512 * j) * 4;
    W.gm[o] = 0; W.gm[o + 1] = 0; W.gm[o + 2] = 0;
    W.gm[o + 3] = ledgeAt(x, z) * 255;
  }
  // --- drifting particles: a few, plus shell grit near the floor
  rseed(3);
  W.snow(25000);
  // --- graptolite swarms: in the open water above the floor, drifting in loose groups
  rseed(100);
  const graptolites = [], graptoliteZoo = [];
  const grSwarms = [
    [15, -8, 20, 4], [-25, -10, -40, 5], [40, -6, 10, 3.5],
    [-10, -12, 50, 4.5], [50, -7, -30, 3], [-40, -9, -10, 5],
  ];
  for (const [sx, sy, sz, sR] of grSwarms) {
    const spd = rr(0.08, 0.15) * (rnd() > 0.5 ? 1 : -1);
    const sSeed = rnd();
    graptoliteZoo.push(sx, sy, sz, sR, 0, spd, 0.06, sSeed);
    const n = 25 + (rnd() * 15 | 0);
    for (let j = 0; j < n; j++) graptolites.push(sx, sy, sz, sR, rnd(), spd, rr(0.02, 0.1), sSeed);
  }
  GRAPTOLITE.data = new Float32Array(graptolites);
  // --- orthocone groups: small straight-shelled cephalopods in the mid-water, in short jerks
  rseed(110);
  const orthocones = [], orthoconeZoo = [];
  const orGroups = [
    [20, -10, -15, 6], [-15, -9, 30, 7], [45, -8, 15, 5],
    [-30, -11, -35, 6], [5, -7, -55, 5],
  ];
  for (const [cx, cy, cz, R] of orGroups) {
    const spd = rr(0.015, 0.025) * (rnd() < 0.5 ? 1 : -1);
    const sd = rnd();
    orthoconeZoo.push(cx, cy, cz, R, 0, spd, rr(0.2, 0.4), sd);
    for (let j = 0; j < 30; j++) orthocones.push(cx, cy, cz, R, rnd(), spd, rr(0.15, 0.4), sd);
  }
  ORTHOCONES.data = new Float32Array(orthocones);
  // --- Astraspis schools: near the floor, in open areas of the shelf
  rseed(120);
  const astraspis = [], astraspisZoo = [];
  const asGroups = [
    [12, 0.15, -20, 5], [-28, 0.18, 18, 6], [38, 0.12, 42, 4],
  ];
  for (const [cx, cy, cz, R] of asGroups) {
    const spd = rr(0.03, 0.06) * (rnd() < 0.5 ? 1 : -1);
    const sd = rnd();
    astraspisZoo.push(cx, cy, cz, R, 0, spd, 0.2, sd);
    for (let j = 0; j < 15; j++) astraspis.push(cx, cy, cz, R, rnd(), spd, rr(0.16, 0.22), sd);
  }
  ASTRASPIS.data = new Float32Array(astraspis);
  // --- Endoceras: two giant cephalopods gliding slowly near the floor on wide orbits
  rseed(130);
  const endoceras = [];
  const endoList = [
    [52, 0, -18, 25, rr(0, TAU), rr(0.005, 0.008) * (rnd() < 0.5 ? 1 : -1), 5.7, rnd()],
    [-25, 0, 15, 22, rr(0, TAU), rr(0.005, 0.008) * (rnd() < 0.5 ? 1 : -1), 5.7, rnd()],
  ];
  for (const e of endoList) endoceras.push(...e);
  ENDOCERAS.data = new Float32Array(endoceras);
  // --- ground grid for the zoo of floor-following animals (Astraspis, Endoceras).
  // gy is fast (nearest column of the density grid, 0.75 m); gyExact is too slow for 333 k calls
  for (let j = 0; j < GRN; j++) for (let i = 0; i < GRN; i++) {
    const x = i * 0.5 - GRH, z = j * 0.5 - GRH;
    GRD[i + GRN * j] = gy(x, z);
  }
  // --- zoo: swimmers
  zooMove('graptolite', new Float32Array(graptoliteZoo), zooGraptolite, 5);
  zooMove('orthocones', new Float32Array(orthoconeZoo), zooOrthocone, 5, 2);
  zooMove('astraspis', new Float32Array(astraspisZoo), zooAstraspis, 6, 2);
  zooMove('endoceras', new Float32Array(endoceras), zooEndoceras, 15);
  // --- the shelf as a backdrop: named where nothing else is looked at
  for (let z = -100; z <= 100; z += 12) {
    const x = 0, y = floorH(x, z) + 1;
    backdrop('shelf', x - 10, y, z, x + 10, y, z, 15, 6);
  }
}
