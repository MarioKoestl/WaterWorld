// ============================================================================
// cambrian: what is drawn, and where it stands (load-time only)
// ============================================================================
// The kinds of this world in drawing order (see kind() in engine/tools.js). What lies about: stones that broke off
// the wall, in three shapes (with a simpler mesh from 40 m on), and grit. What stands still: the tulip animal and
// three bushes of the sponge Vauxia (meshes in standing.js), each with a simpler mesh further away. What swims:
// Marrella, Metaspriggina, Opabinia, Anomalocaris and the jellyfish (each in its own file, swimmers_<name>.js: the
// first of them brings what all their shaders share, S_SEA of swimmers.js). The jellyfish is see-through and is
// drawn after everything else. What walks, Hallucigenia and the trilobite, is in walkers.js.
// Everything alive is made true size by TS (era.js): the tulip animal is 20 cm high, Vauxia 8 cm. So they are drawn
// to 45 and 35 m, both with the simple mesh from 3 m on, and cast no shadow: the shadow map has about 9 cm a texel
const stone = (sd, sub, det) => () => meshChunk(sd, sub, det).build();
const STONE = [4, 15, 27].map((sd) => kind({ solid: 1, shadow: 1, cells: 1, far: 130, lodFrom: 40, mesh: stone(sd, 3), lod: stone(sd, 2, 1) }));
const GRIT = kind({ solid: 1, shadow: 1, cells: 1, far: 34, mesh: stone(9, 1) });
const TULIP = [0, 1, 2].map((v) => kind({ solid: 1, cells: 1, far: 45, lodFrom: 3, mesh: () => meshTulip(v).build(), lod: () => meshTulip(v, 1).build() }));
const VAUXIA = [1, 2, 3].map((sd) => kind({ solid: 1, cells: 1, far: 35, lodFrom: 3, mesh: () => meshVauxia(sd).build(), lod: () => meshVauxia(sd, 1).build() }));

// sponge thickets that are sure to be there, at the blocks and ledges near the test poses: x, z, radius
const THICKETS = [[46.5, -38, 7], [47, -52, 5], [57.6, 4, 6], [61, -12, 5], [45, -72, 8], [62, 26, 6]];

// The gardens (scale.md, stage 3). Animals of a few centimetres cannot fill a world of 200 m: the life is gathered in
// gardens a few metres across, with bare mud between them. Each garden, in metres: where its patch of tulip animals
// is, how far it reaches and how many stand in it; its patch of algae; the swarm of Marrella (the middle of its round
// and how wide it is); the shoal of Metaspriggina (x, height over the mud, z of its middle, half its length along z;
// a shoal follows the line of the wall, so only the gardens near the wall have one); the jellyfish (middle, height
// over the mud, how far they spread, how many); the Opabinias (the middle of the round each one makes, how wide it
// is, which way round, where on it the animal starts, a seed); the Anomalocaris (middle of its round, height over
// the mud, half its length, its speed in metres a second, where on its round it is at the start, a seed). The
// Anomalocaris swims round the patch of tulip animals, just above them: seen beside them, at their depth, it reads as
// long as it is (in front of them it looks like a giant). Where a garden lies at a fallen block (BLOCKS in
// floor.js, named by its z), sponges grow on the block's face that looks at the garden: between the angles `side`
// (seen from the middle of the block), searched for from `from` metres out, `sponges` of them. And the walkers
// (walkers.js): hallu and trilo, each x, z, radius, how many.
// The Marrella and the Opabinias keep 3 m from a block: so near it the mud rises against the rock (smax in
// floor.js), and their shaders know only the mud (ground in floor.js)
const GARDENS = [
  // 1, in front of test pose 1, where the player starts: at the foot of the small block out on the plain (z -31)
  {
    tx: 36.9, tz: -32.4, tr: 1.0, tulips: 380,
    ax: 37.4, az: -34.3, ar: 0.45,
    mx: 35.9, mz: -34.0, mr: 0.45,
    fish: [36.6, 0.5, -32.6, 0.8],
    bells: [36.8, 1.25, -32.8, 0.65, 4],
    opab: [[35.6, -32.8, 0.3, 1, 0.4, 0.13], [36.3, -34.9, 0.25, -1, 2, 0.57], [35.4, -31.4, 0.28, -1, 4.1, 0.79]],
    hunter: [36.95, 0.55, -32.3, 0.95, 0.11, 4.6, 0.4571],
    block: -31, side: [1.9, 4.4], from: 3.5, sponges: 60,
    hallu: [38.05, -29.75, 0.45, 30], trilo: [37.3, -30.7, 0.85, 50],
  },
  // 2, at the foot of the large block in front of test pose 2 (z 4), in a hollow of the mud. The flight comes down to
  // it at its start
  {
    tx: 51.3, tz: 3.5, tr: 1.1, tulips: 420,
    ax: 49.0, az: 2.6, ar: 0.5,
    mx: 51.2, mz: 1.2, mr: 0.45,
    fish: [51.0, 0.5, 3.3, 0.8],
    bells: [51.2, 1.3, 3.6, 0.7, 4],
    opab: [[49.7, 4.9, 0.3, -1, 1.0, 0.21], [50.0, 0.6, 0.25, 1, 3.0, 0.66]],
    hunter: [51.3, 0.55, 3.5, 1.0, -0.11, 1.3, 0.2571],
    block: 4, side: [2.0, 4.4], from: 6, sponges: 70,
    hallu: [55.2, 3.6, 0.45, 30],
  },
  // 3, out on the open basin in front of test pose 5, which looks over it to the end of a tongue. No rock near: no
  // sponges, and no shoal (that keeps to the wall)
  {
    tx: -11.2, tz: -94.0, tr: 1.4, tulips: 850,
    ax: -11.6, az: -96.2, ar: 0.55,
    mx: -13.0, mz: -95.2, mr: 0.45,
    bells: [-11.5, 1.3, -94.4, 0.75, 5],
    opab: [[-12.75, -93.8, 0.3, 1, 0.7, 0.34], [-13.0, -96.3, 0.25, -1, 2.4, 0.48], [-12.3, -92.25, 0.28, 1, 4.4, 0.92]],
    hunter: [-11.2, 0.55, -94.0, 1.25, 0.11, 4.6, 0.7143],
    trilo: [-9.7, -92.0, 0.85, 50],
  },
  // 4, on a low, level swell of the plain, where the flight comes down and ends
  {
    tx: 13.0, tz: -22.5, tr: 1.3, tulips: 700,
    ax: 13.1, az: -24.7, ar: 0.5,
    mx: 11.2, mz: -23.0, mr: 0.45,
    bells: [12.8, 1.3, -22.9, 0.7, 4],
    opab: [[11.6, -21.1, 0.28, -1, 1.6, 0.27], [11.8, -25.1, 0.25, 1, 5.0, 0.61]],
    hunter: [13.0, 0.55, -22.5, 1.15, -0.11, 2.0, 0.8571],
    trilo: [14.3, -20.3, 0.85, 50],
  },
];

const MARRELLA = kind({ mesh: () => meshMarrella().build(), wgsl: S_SEA + S_MARRELLA, vs: 'vsMarrella', fs: 'fsMarrella' });
const METASPRIGGINA = kind({ mesh: () => meshMetaspriggina().build(), wgsl: S_METASPRIGGINA, vs: 'vsMetaspriggina', fs: 'fsMetaspriggina' });
const OPABINIA = kind({ mesh: () => meshOpabinia().build(), wgsl: S_OPABINIA, vs: 'vsOpabinia', fs: 'fsOpabinia' });
const ANOMALOCARIS = kind({ mesh: () => meshAnomalocaris().build(), wgsl: S_ANOMALOCARIS, vs: 'vsAnomalocaris', fs: 'fsAnomalocaris' });
const MEDUSA = kind({ glass: 1, mesh: () => meshMedusa().build(), wgsl: S_MEDUSA, vs: 'vsMedusa', fs: 'fsMedusa' });
// The swimmers live in the gardens. Their paths lie in open water: `node tools/ways.mjs cambrian` checks every one of
// them against the rock, so run it after a change here

// ---------------------------------------------------------------- scattering
// W: the tools of the engine (makeTools in engine/tools.js). Each system below starts its own random stream with
// rseed(n): an extra rnd() inside one changes everything after it in that system, and nothing in the others.
// An instance of a solid kind is x y z, size, its turn, material, seed, texture scale, and how it moves (see tools.js)
function makeWorld(W) {
  const { T, Dw, cellOf, pickV, nearFly, nearPose, gy, gyExact, hitDrawn, grad, snap, tangent, leaf, big, small, place, backdrop, piece } = W;
  // --- stones at the foot of the wall and on the tongues of mud: the closer to the wall, the more and the larger.
  // Only where the ground is nearly level and carries the whole stone, and sunk into the mud a little
  rseed(1);
  for (let i = 0; i < 90000; i++) {
    const k = pickV(), x = T.wp[k], y = T.wp[k + 1], z = T.wp[k + 2], out = wallX(z) - x;
    if (out > 60 || y > -26 || T.wn[k + 1] < 0.9 || hypot(x, z) > 160) continue;
    const near = sstep(26, 3, out);
    if (rnd() > 0.02 + 0.5 * near + 0.1 * tongueAt(x, z) || nearFly(x, y, z, 2.5)) continue;
    const sc = 0.22 + (0.5 + 1.3 * near) * pow(rnd(), 3), q = qRand(), e = sc * 0.7;
    if (Dw(x + e, y - sc * 0.45, z) <= 0 || Dw(x - e, y - sc * 0.45, z) <= 0 || Dw(x, y - sc * 0.45, z + e) <= 0 || Dw(x, y - sc * 0.45, z - e) <= 0) continue;
    STONE[rnd() * 3 | 0].at[cellOf(x, z)].push(x, y - sc * 0.1, z, sc, q[0], q[1], q[2], q[3], 1, rnd(), 0, 0);
  }
  rseed(2);
  for (let i = 0; i < 260000; i++) {
    const k = pickV(), x = T.wp[k] + rr(-0.4, 0.4), z = T.wp[k + 2] + rr(-0.4, 0.4), y = T.wp[k + 1], out = wallX(z) - x;
    if (out > 40 || y > -26 || T.wn[k + 1] < 0.9 || hypot(x, z) > 160 || rnd() > 0.05 + 0.95 * sstep(30, 2, out)) continue;
    const sc = 0.04 + 0.22 * pow(rnd(), 2), q = qRand();
    if (Dw(x, y - 0.3, z) <= 0) continue;
    GRIT.at[cellOf(x, z)].push(x, y - sc * 0.3, z, sc, q[0], q[1], q[2], q[3], 1, rnd(), 34, 0);
  }
  // The plain lies in swells. Mats of algae cover the higher ones, in ragged patches: how much of a place they take,
  // from the height of its ground. Not on the fresh mud of the tongues, not close to the wall and not in the gardens,
  // which have their own patch of algae
  const high = (y) => sstep(-45, -43.4, y);
  const gardenAt = (x, z) => { let m = 0; for (const G of GARDENS) m = max(m, sstep(G.tr + 2, G.tr + 0.5, hypot(x - G.tx, z - G.tz))); return m; };
  const mat = (x, z, y) => high(y) * sstep(0.46, 0.6, fbm(x * 0.06, 3, z * 0.06, 3)) * (1 - tongueAt(x, z)) * (1 - 0.9 * gardenAt(x, z)) * sstep(14, 30, wallX(z) - x + 16 * (fbm(x * 0.05, 8, z * 0.05, 2) - 0.5));
  // --- ground map (512 x 512 over the world): red is the mud of the tongues, green what lies under a fallen block.
  // Alpha is 0 off the basin, at least one half where the ground is the mud of the basin (plain, apron and tongues:
  // the lowest floor there lies deep), which is mud however steep it is, and above one half the algae mat there.
  // Blue is how dense a garden stands: the mud is dark under it (look.js. For the engine blue is the share of an
  // era's second water: this world has only one, and its AIR makes both the same)
  const dense = (x, z) => { let m = 0; for (const G of GARDENS) m = max(m, sstep(G.tr * 1.6, G.tr * 0.5, hypot(x - G.tx, z - G.tz))); return m; };
  for (let j = 0; j < 512; j++) for (let i = 0; i < 512; i++) {
    const x = (i + 0.5) / 512 * 384 - 192, z = (j + 0.5) / 512 * 384 - 192, o = (i + 512 * j) * 4, f = W.floorsAt(x, z), y = f.length ? f[f.length - 2] : 0;
    W.gm[o] = tongueAt(x, z) * 255; W.gm[o + 1] = blockAt(x, z) * 255; W.gm[o + 2] = dense(x, z) * 255; W.gm[o + 3] = y < -37.5 ? 128 + 127 * mat(x, z, y) : 0;
  }
  // --- drifting particles: mud and marine snow, many of them, so that a shaft of light is full of them
  rseed(3);
  W.snow(70000);

  // --- sponges: thickets on the rock of the wall and of the fallen blocks, where it is not level (mud lies on what
  // is level). A thicket is a few bushes within a quarter of a metre. A bush grows out of the rock and leans
  // upwards, about halfway (here and in the gardens): so its foot sits on the rock nearly all round, and on a steep
  // face it does not stick out sideways. Each bush is an exhibit: a line from its foot up its own axis
  rseed(5);
  for (let i = 0, made = 0; i < 300000 && made < 560; i++) {
    const k = pickV(), x = T.wp[k], y = T.wp[k + 1], z = T.wp[k + 2], ny = T.wn[k + 1];
    if (wallX(z) - x > 27 || y > -24 || hypot(x, z) > 150 || ny < -0.15 || ny > 0.78 || nearFly(x, y, z, 2)) continue;
    if (fbm(x * 0.08, y * 0.08, z * 0.08, 2) < 0.56 && !THICKETS.some((t) => hypot(x - t[0], z - t[1]) < t[2])) continue;
    const n0 = [T.wn[k], ny, T.wn[k + 2]], [t1, t2] = tangent(n0), cnt = 3 + rnd() * 7 | 0, sd = rnd();
    for (let j = 0; j < cnt; j++) {
      const a = rr(-1, 1) * (0.06 + cnt * 0.02), b = rr(-1, 1) * (0.06 + cnt * 0.02);
      const s = snap(x + t1[0] * a + t2[0] * b, y + t1[1] * a + t2[1] * b, z + t1[2] * a + t2[2] * b, n0);
      if (!s) continue;
      // onto the rock as it is drawn: on rough rock the surface that snap finds in the density field can be centimetres
      // off it, and a bush of 8 cm would stand half inside it (here and in the gardens)
      const hd = hitDrawn(s[0] + s[3] * 0.4, s[1] + s[4] * 0.4, s[2] + s[5] * 0.4, -s[3], -s[4], -s[5], 0.9); if (hd < 0) continue;
      s[0] += s[3] * (0.4 - hd); s[1] += s[4] * (0.4 - hd); s[2] += s[5] * (0.4 - hd);
      let ux = s[3], uy = s[4] + 0.7, uz = s[5]; const l = hypot(ux, uy, uz); ux /= l; uy /= l; uz /= l;
      const q = qMul(qFromY(ux, uy, uz), qAxis(0, 1, 0, rnd() * TAU)), sc = rr(0.92, 1.08) * TS, p = [s[0] - ux * 0.06 * TS, s[1] - uy * 0.06 * TS, s[2] - uz * 0.06 * TS];
      VAUXIA[rnd() * 3 | 0].at[cellOf(p[0], p[2])].push(p[0], p[1], p[2], sc, q[0], q[1], q[2], q[3], 3, fract(sd + rr(-0.04, 0.04)), 2 / TS, 0);
      piece('vauxia', p, q, [0, 0, 0], [0, 1.6 * sc, 0], 1.5, 0.55 * sc);
      made++;
    }
  }
  // --- algae: mats on the higher swells. A mat is a dark stain in the mud (the ground map above) with threads on
  // it: short and hair-fine, close together, lying on the mud and all trailing the way the current goes, their tips
  // a little lifted. Here and there a tuft of long limp ones that trail the same way. The second seed of a long
  // thread says whether it is red-brown (look.js). An exhibit every 2.5 m, where a mat is dense. The threads are true
  // length; their width is three times true, or they would be finer than a pixel
  rseed(6);
  const seen = new Set(), flow = (x, z) => 0.7 + 0.5 * sin(x * 0.021 + z * 0.013);
  for (let i = 0; i < 1300000; i++) {
    const k = pickV(); if (T.wn[k + 1] < 0.86) continue;
    const x = T.wp[k] + rr(-0.5, 0.5), z = T.wp[k + 2] + rr(-0.5, 0.5), y = T.wp[k + 1], m = mat(x, z, y);
    if (hypot(x, z) > 158 || rnd() > sstep(0.3, 0.75, m) || nearPose(x, z, 1.5)) continue;
    const cur = flow(x, z);
    for (let j = 0; j < 16; j++) leaf(small, x + rr(-0.4, 0.4), y - 0.01 * TS, z + rr(-0.4, 0.4), rr(0.15, 0.5) * TS, cur + rr(-0.45, 0.45), rr(1.2, 1.5), rr(0.008, 0.012) * TS * 3, 0, 0, rnd(), rnd(), rr(0.12, 0.26));
    if (rnd() < 0.012) for (let j = 0, red = rnd() < 0.2; j < 10; j++) leaf(big, x + rr(-0.15, 0.15), y - 0.02 * TS, z + rr(-0.15, 0.15), rr(0.7, 1.6) * TS, cur + rr(-0.3, 0.3), rr(0.9, 1.35), rr(0.008, 0.014) * TS * 3, 0, 1, rnd(), red ? rr(0.75, 1) : rr(0, 0.7), rr(0.1, 0.25));
    const c = floor(x / 2.5) * 4096 + floor(z / 2.5);
    if (m > 0.6 && !seen.has(c)) { seen.add(c); place('algae', x, y + 0.02, z, x, y + 0.02, z, 1, 1.2); }
  }
  // --- algae on the rock: short limp threads that hang down the wall and the blocks, where the rock is neither level
  // nor an underside
  rseed(7);
  for (let i = 0; i < 60000; i++) {
    const k = pickV(), x = T.wp[k], y = T.wp[k + 1], z = T.wp[k + 2], ny = T.wn[k + 1];
    if (wallX(z) - x > 26 || y > -16 || hypot(x, z) > 150 || ny < 0.1 || ny > 0.8 || fbm(x * 0.11 + 5, y * 0.11, z * 0.11, 2) < 0.58 || nearFly(x, y, z, 1.5) || nearPose(x, z, 3.5)) continue;
    const yaw = atan2(T.wn[k + 2], T.wn[k]), red = rnd() < 0.4;
    for (let j = 8 + rnd() * 6 | 0; j > 0; j--) leaf(big, x + rr(-0.2, 0.2) * TS, y + rr(-0.2, 0.2) * TS, z + rr(-0.2, 0.2) * TS, rr(0.25, 0.7) * TS, yaw + rr(-0.9, 0.9), PI - rr(0.3, 1), rr(0.008, 0.014) * TS * 3, 0.3, 1, rnd(), red ? rr(0.75, 1) : rr(0, 0.7), rr(0.3, 0.42));
    if (rnd() < 0.35) place('algae', x, y, z, x, y - 0.4 * TS, z, 1, 0.3);
  }
  // --- the wall itself is an exhibit: four lines along it, from above its foot to near the top of the swimming space,
  // each one metre inside the rock (the lower two behind whatever stands out furthest at their height, not behind
  // the hollow under a ledge). A backdrop: it is named only where nothing else is looked at
  const face = (y, z) => { let x = wallX(z) - 24; while (x < wallX(z) + 6 && Dw(x, y, z) <= 0) x += 0.5; return x; };
  for (const hs of [[-37, -34, -31], [-30, -27], [-22], [-15]]) for (let z = -132, px, pz; z <= 132; z += 8) {
    const x = min(...hs.map((h) => face(h, z))) + 1, y = hs[0] + 1;
    if (z > -132) backdrop('wall', px, y, pz, x, y, z, 15, 5.5);
    px = x; pz = z;
  }

  // --- the gardens (GARDENS at the top), each with its own random stream. Nothing that swims is scattered over the
  // ground: the vertex shaders move the animals from the scene time (swimmers_<name>.js). An instance is eight
  // floats, which mean what the shader of its kind says. For the zoo a swarm and a shoal have one row each, in the
  // layout of their animals
  // (the height of the mud on a grid, for the zoo places of those that keep close to it: zooGround in swimmers.js)
  for (let j = 0; j < GRN; j++) for (let i = 0; i < GRN; i++) GRD[i + GRN * j] = gyExact(i * 0.5 - GRH, j * 0.5 - GRH);
  const marrellas = [], swarms = [], fishes = [], shoals = [], medusas = [], opabinias = [], hunters = [];
  GARDENS.forEach((G, gi) => {
    rseed(11 + gi);
    // tulip animals: a dense patch, thinner towards its ragged rim, none closer than 4.5 cm to another, none on the
    // rounds of the garden's Opabinias and none under the camera of a test pose
    const near = [], glanes = G.opab.flatMap(([x, z, R, , , sd]) => Array.from({ length: 120 }, (_, k) => opAt(x, z, R, sd, k / 120 * TAU)));
    for (let i = 0, n = 0; i < 20 * G.tulips && n < G.tulips; i++) {
      const a = rnd() * TAU, r = sqrt(rnd()) * G.tr, x = G.tx + cos(a) * r, z = G.tz + sin(a) * r, keepIt = rnd() < sstep(1.08, 0.6, r / G.tr + 0.5 * (fbm(x * 2.5, 4, z * 2.5, 2) - 0.5));
      const sc = rr(0.92, 1.06) * TS, q = qMul(qAxis(rr(-1, 1), 0, rr(-1, 1), rr(0, 0.1)), qAxis(0, 1, 0, rnd() * TAU)), sd = rnd(), sw = -rr(0.1, 0.2) / TS;
      if (!keepIt || near.some((p) => hypot(x - p[0], z - p[1]) < 0.045) || glanes.some((p) => hypot(x - p[0], z - p[1]) < 0.04) || nearPose(x, z, 0.6)) continue;
      const y = gyExact(x, z); if (grad(x, y, z)[1] < 0.9) continue;
      near.push([x, z]); n++;
      TULIP[sd * 3 | 0].at[cellOf(x, z)].push(x, y - 0.04 * TS, z, sc, q[0], q[1], q[2], q[3], 2, sd, 2 / TS, sw);
      piece('siphusauctum', [x, y, z], q, [0, 0, 0], [0, 4 * sc, 0], 2, 0.4 * TS);
    }
    // sponges: clumps on the block, on the side that faces the garden, from its foot up to a metre, where the rock is
    // neither level nor an underside
    if (G.block !== undefined) {
      const b = BLOCKS.find((k) => k[0] === G.block), bx = wallX(b[0]) - b[1], bz = b[0], R0 = G.from;
      for (let i = 0, made = 0; i < 400 && made < G.sponges; i++) {
        const a = rr(G.side[0], G.side[1]), h = rr(0.05, 1.0);
        let x = bx + cos(a) * R0, z = bz + sin(a) * R0; const y = gyExact(x, z) + h, dx = (bx - x) / R0, dz = (bz - z) / R0;
        let k = 0; while (k < 200 && Dw(x, y, z) <= 0) { x += dx * 0.02; z += dz * 0.02; k++; }
        if (k >= 200) continue;
        const n0 = grad(x, y, z); if (n0[1] < -0.1 || n0[1] > 0.8) continue;
        const [t1, t2] = tangent(n0), cnt = 2 + rnd() * 4 | 0, sd = rnd();
        for (let j = 0; j < cnt; j++) {
          const s = snap(x + (t1[0] * rr(-1, 1) + t2[0] * rr(-1, 1)) * 0.06, y + (t1[1] * rr(-1, 1) + t2[1] * rr(-1, 1)) * 0.06, z + (t1[2] * rr(-1, 1) + t2[2] * rr(-1, 1)) * 0.06, n0);
          if (!s) continue;
          const hd = hitDrawn(s[0] + s[3] * 0.4, s[1] + s[4] * 0.4, s[2] + s[5] * 0.4, -s[3], -s[4], -s[5], 0.9); if (hd < 0) continue;
          s[0] += s[3] * (0.4 - hd); s[1] += s[4] * (0.4 - hd); s[2] += s[5] * (0.4 - hd);
          let ux = s[3], uy = s[4] + 0.7, uz = s[5]; const l = hypot(ux, uy, uz); ux /= l; uy /= l; uz /= l;
          const q = qMul(qFromY(ux, uy, uz), qAxis(0, 1, 0, rnd() * TAU)), sc = rr(0.92, 1.08) * TS, p = [s[0] - ux * 0.06 * TS, s[1] - uy * 0.06 * TS, s[2] - uz * 0.06 * TS];
          VAUXIA[rnd() * 3 | 0].at[cellOf(p[0], p[2])].push(p[0], p[1], p[2], sc, q[0], q[1], q[2], q[3], 3, fract(sd + rr(-0.04, 0.04)), 2 / TS, 0);
          piece('vauxia', p, q, [0, 0, 0], [0, 1.6 * sc, 0], 1.5, 0.55 * sc);
          made++;
        }
      }
    }
    // algae: a mat of short threads lying the way the current goes, and many tufts of longer ones that stand up from
    // it, trailing the same way, so that the patch reads as algae from a diver's distance (true length; their width,
    // as on the plain, three times true). It has no dark stain in the mud as the mats of the plain have: the ground
    // map has 0.75 m to a texel, and a patch this small would be a blur
    const ay = gyExact(G.ax, G.az), cur = 0.7 + 0.5 * sin(G.ax * 0.021 + G.az * 0.013);
    for (let i = 0; i < 1400 * (G.ar / 0.45) * (G.ar / 0.45); i++) {
      const a = rnd() * TAU, r = sqrt(rnd()) * G.ar, x = G.ax + cos(a) * r, z = G.az + sin(a) * r * 0.8, y = gyExact(x, z);
      if (rnd() > sstep(1.05, 0.5, r / G.ar)) continue;
      leaf(small, x, y - 0.0005, z, rr(0.008, 0.025), cur + rr(-0.45, 0.45), rr(1.2, 1.5), rr(0.0008, 0.0012), 0, 0, rnd(), rnd(), rr(0.12, 0.26));
      if (rnd() < 0.05) for (let j = 0, red = rnd() < 0.3; j < 12; j++) leaf(big, x + rr(-0.01, 0.01), y - 0.001, z + rr(-0.01, 0.01), rr(0.035, 0.08), cur + rr(-0.3, 0.3), rr(0.35, 0.95), rr(0.0012, 0.0021), 0, 1, rnd(), red ? rr(0.75, 1) : rr(0, 0.7), rr(0.1, 0.25));
    }
    place('algae', G.ax, ay + 0.01, G.az, G.ax, ay + 0.01, G.az, 1, G.ar);
    // the swimmers of the garden
    const gy0 = gyExact(G.tx, G.tz);
    swarms.push(G.mx, 0, G.mz, G.mr, 0, 0.04 / G.mr, 0.025, 0.91);
    for (let i = 160; i > 0; i--) marrellas.push(G.mx, 0, G.mz, G.mr, rnd(), 0.04 / G.mr, rr(0.017, 0.025), 0.91);
    if (G.fish) {
      const [fx, fh, fz, fl] = G.fish, fD = wallX(fz) - fx;
      shoals.push(fD, gyExact(fx, fz) + fh, fz, fl, 0, -0.09 / fl, 0.06, 0.62);
      for (let i = 0; i < 30; i++) fishes.push(fD, gyExact(fx, fz) + fh, fz, fl, rnd(), -0.09 / fl, rr(0.055, 0.0625), 0.62);
    }
    const [jx, jh, jz, jr, jn] = G.bells, first = medusas.length;
    for (let i = 0, tries = 0; i < jn && tries < 400; tries++) {
      const px = jx + rr(-jr, jr), py = gy0 + jh + rr(-0.2, 0.2), pz = jz + rr(-jr, jr);
      let free = true; for (let k = first; k < medusas.length; k += 8) if (hypot(px - medusas[k], pz - medusas[k + 2]) < 0.3) free = false;
      if (free) { medusas.push(px, py, pz, rr(0.015, 0.035), rnd() * TAU, rr(1.9, 2.5), rr(0.18, 0.2), rnd()); i++; }
    }
    for (const [x, z, R, dir, at, sd] of G.opab) opabinias.push(x, 0.025 + 0.008 * sd, z, R, at, dir * 0.0225 / R, 0.064 + 0.006 * fract(sd * 5), sd);
    const [hx, hh, hz, hR, hv, hat, hsd] = G.hunter;
    hunters.push(hx, gyExact(hx, hz) + hh, hz, hR, hat, hv / hR, 0.38, hsd);
  });
  MARRELLA.data = new Float32Array(marrellas); METASPRIGGINA.data = new Float32Array(fishes); MEDUSA.data = new Float32Array(medusas);
  OPABINIA.data = new Float32Array(opabinias); ANOMALOCARIS.data = new Float32Array(hunters);
  // zoo: where each of them is (engine/zoo.js): id of the ZOO entry, the instances, where one of them is, reach
  zooMove('marrella', new Float32Array(swarms), zooMarrella, 2); zooMove('metaspriggina', new Float32Array(shoals), zooMetaspriggina, 1.5, 2);
  zooMove('burgessomedusa', MEDUSA.data, zooMedusa, 2); zooMove('opabinia', OPABINIA.data, zooOpabinia, 1.5); zooMove('anomalocaris', ANOMALOCARIS.data, zooAnomalocaris, 3);
  // --- the walkers of the gardens (walkers.js)
  makeWalkers(W, GARDENS);
}
