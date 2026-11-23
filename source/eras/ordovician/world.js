// ============================================================================
// ordovician: what is drawn, and where it stands (load-time only)
// ============================================================================
// Stage 1: the place and its light, nothing alive. Stones and grit on the floor, the ground map, and drifting
// particles. The kinds are drawn in the order they are declared (see kind() in engine/tools.js)
const stone = (sd, sub, det) => () => meshChunk(sd, sub, det).build();
const STONE = [4, 15, 27].map((sd) => kind({ solid: 1, shadow: 1, cells: 1, far: 70, lodFrom: 25, mesh: stone(sd, 3), lod: stone(sd, 2, 1) }));
const GRIT = kind({ solid: 1, shadow: 1, cells: 1, far: 25, mesh: stone(9, 1) });

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
  // --- ground map (512 x 512 over the world): alpha says how much of the floor is limestone (for look.js)
  for (let j = 0; j < 512; j++) for (let i = 0; i < 512; i++) {
    const x = (i + 0.5) / 512 * 384 - 192, z = (j + 0.5) / 512 * 384 - 192, o = (i + 512 * j) * 4;
    W.gm[o] = 0; W.gm[o + 1] = 0; W.gm[o + 2] = 0;
    W.gm[o + 3] = ledgeAt(x, z) * 255;
  }
  // --- drifting particles: a few, plus shell grit near the floor
  rseed(3);
  W.snow(25000);
  // --- the shelf as a backdrop: named where nothing else is looked at
  for (let z = -100; z <= 100; z += 12) {
    const x = 0, y = floorH(x, z) + 1;
    backdrop('shelf', x - 10, y, z, x + 10, y, z, 15, 6);
  }
}
