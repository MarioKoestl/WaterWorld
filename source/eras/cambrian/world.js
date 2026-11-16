// ============================================================================
// cambrian: what is drawn, and where it stands (load-time only)
// ============================================================================
// The kinds of this world in drawing order (see kind() in engine/tools.js). What lies about: stones that broke off
// the wall, in three shapes (with a simpler mesh from 40 units on), and grit. What stands still: the tulip animal
// and three bushes of the sponge Vauxia (meshes in standing.js), each with a simpler mesh further away. What swims:
// Marrella, Metaspriggina, Opabinia, Anomalocaris and the jellyfish (meshes and shaders in swimmers.js: the first of
// them brings what their shaders share). The jellyfish is see-through and is drawn after everything else
const stone = (sd, sub, det) => () => meshChunk(sd, sub, det).build();
const STONE = [4, 15, 27].map((sd) => kind({ solid: 1, shadow: 2, cells: 1, far: 130, lodFrom: 40, mesh: stone(sd, 3), lod: stone(sd, 2, 1) }));
const GRIT = kind({ solid: 1, shadow: 2, cells: 1, far: 34, mesh: stone(9, 1) });
const TULIP = kind({ solid: 1, shadow: 2, cells: 1, far: 120, lodFrom: 26, mesh: () => meshTulip().build(), lod: () => meshTulip(1).build() });
const VAUXIA = [1, 2, 3].map((sd) => kind({ solid: 1, shadow: 2, cells: 1, far: 100, lodFrom: 16, mesh: () => meshVauxia(sd).build(), lod: () => meshVauxia(sd, 1).build() }));

// tulip fields on the plain: x, z, radius
const FIELDS = [[-8, -86, 12], [-6, 12, 22], [22, -22, 12], [-46, -36, 18], [-70, 4, 20], [-90, -14, 15], [-40, -84, 14], [-40, 28, 14]];
// sponge thickets that are sure to be there, at the blocks and ledges near the viewpoints: x, z, radius
const THICKETS = [[46.5, -38, 7], [47, -52, 5], [57.6, 4, 6], [61, -12, 5], [45, -72, 8], [62, 26, 6]];

const MARRELLA = kind({ mesh: () => meshMarrella().build(), wgsl: S_SEA + S_MARRELLA, vs: 'vsMarrella', fs: 'fsMarrella' });
const METASPRIGGINA = kind({ mesh: () => meshMetaspriggina().build(), wgsl: S_METASPRIGGINA, vs: 'vsMetaspriggina', fs: 'fsMetaspriggina' });
const OPABINIA = kind({ mesh: () => meshOpabinia().build(), wgsl: S_OPABINIA, vs: 'vsOpabinia', fs: 'fsOpabinia' });
const ANOMALOCARIS = kind({ mesh: () => meshAnomalocaris().build(), wgsl: S_ANOMALOCARIS, vs: 'vsAnomalocaris', fs: 'fsAnomalocaris' });
const MEDUSA = kind({ glass: 1, mesh: () => meshMedusa().build(), wgsl: S_MEDUSA, vs: 'vsMedusa', fs: 'fsMedusa' });
// Where the swimmers are. Their paths lie in open water: `node tools/ways.mjs cambrian` checks every one of them
// against the rock, so run it after a change here.
// Swarms of Marrella, just over the mud of the plain, between the tulip fields (among the stalks they would swim
// through them): the middle of the round a swarm makes (x, z), how wide that round is, which way round it goes
// (1 or -1), a seed
const SWARMS = [[14, -66, 8, 1, 0.13], [22, 4, 7, -1, 0.41], [6, -44, 10, 1, 0.67], [-30, -8, 10, -1, 0.29], [-12, 48, 10, 1, 0.83], [26, 26, 8, -1, 0.55]];
// Shoals of Metaspriggina, in the water beside the wall: how far the middle of their round keeps from the line of
// the wall's foot, its height, the z of its middle, half its length along the wall, which way round, a seed
const SHOALS = [[19, -35.5, 2, 18, 1, 0.2], [20, -26, -44, 16, -1, 0.5], [16, -30, 58, 18, 1, 0.8], [20, -27, -92, 14, -1, 0.35]];
// Groups of jellyfish in open water: the middle of the group (x, y, z), how far it reaches each way (x, y, z), how
// many there are
const BLOOMS = [[47, -26.5, -4, 4, 1.5, 9, 9], [6, -33, -74, 8, 2, 8, 8], [-20, -32.5, 28, 7, 2, 9, 8]];
// Opabinias, low over the mud by the algae mats and the tulip fields: the middle of the round each one makes (x, z),
// how wide it is, which way round, where on it the animal starts, a seed
const OPABINIAS = [[-4, -90, 5.5, 1, 0.5, 0.11], [2, 14, 7, -1, 2.1, 0.37], [24, -20, 5, 1, 4, 0.52], [33, 24, 5, -1, 1.2, 0.71], [-50, -30, 7, 1, 3.3, 0.23], [-66, -2, 6, -1, 5.2, 0.86], [-36, 24, 6, 1, 0.9, 0.64], [22, -56, 5, -1, 2.7, 0.45]];
// The three Anomalocaris, on wide rounds through the open water: the middle of the round (x, y, z), half its length
// (it lies along z), where on it the animal starts, its speed in units a second (the sign is the direction), the
// length of its body, a seed (which also says how wide the round is, from 0.7 of its length to all of it: anK in
// swimmers.js. A round has to be wide: its tightest turn has the radius width squared over length, and a body 7.6
// units long cannot follow a turn much tighter than 12)
const HUNTERS = [[18, -28.5, -6, 18, 0.6, 2.6, 7.6, 0.1286], [-34, -30, -34, 38, 5, -2.4, 7.3, 0.3095], [-6, -30, 74, 24, 4.4, 2.2, 7, 0.6286]];

// ---------------------------------------------------------------- scattering
// W: the tools of the engine (makeTools in engine/tools.js). Each system below starts its own random stream with
// rseed(n): an extra rnd() inside one changes everything after it in that system, and nothing in the others.
// An instance of a solid kind is x y z, size, its turn, material, seed, texture scale, and how it moves (see tools.js)
function makeWorld(W) {
  const { T, Dw, cellOf, pickV, nearFly, nearPose, gy, grad, snap, tangent, leaf, big, small, place, backdrop, piece } = W;
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
    W.keep() && GRIT.at[cellOf(x, z)].push(x, y - sc * 0.3, z, sc, q[0], q[1], q[2], q[3], 1, rnd(), 34, 0);
  }
  // The plain lies in swells. Tulip animals stand on the low ones, mats of algae cover the higher ones: how much of
  // each a place takes, from the height of its ground. The mats lie in ragged patches, not on the fresh mud of the
  // tongues, not close to the wall and hardly in the tulip fields
  const low = (y) => sstep(-47.6, -46.3, y) * (1 - sstep(-44.4, -43.7, y)), high = (y) => sstep(-45, -43.4, y);
  const fieldAt = (x, z) => { let m = 0; for (const f of FIELDS) m = max(m, sstep(f[2] * 1.05, f[2] * 0.7, hypot(x - f[0], z - f[1]))); return m; };
  const mat = (x, z, y) => high(y) * sstep(0.46, 0.6, fbm(x * 0.06, 3, z * 0.06, 3)) * (1 - tongueAt(x, z)) * (1 - 0.9 * fieldAt(x, z)) * sstep(14, 30, wallX(z) - x + 16 * (fbm(x * 0.05, 8, z * 0.05, 2) - 0.5));
  // --- ground map (512 x 512 over the world): red is the mud of the tongues, green what lies under a fallen block.
  // Alpha is 0 off the basin, at least one half where the ground is the mud of the basin (plain, apron and tongues:
  // the lowest floor there lies deep), which is mud however steep it is, and above one half the algae mat there
  for (let j = 0; j < 512; j++) for (let i = 0; i < 512; i++) {
    const x = (i + 0.5) / 512 * 384 - 192, z = (j + 0.5) / 512 * 384 - 192, o = (i + 512 * j) * 4, f = W.floorsAt(x, z), y = f.length ? f[f.length - 2] : 0;
    W.gm[o] = tongueAt(x, z) * 255; W.gm[o + 1] = blockAt(x, z) * 255; W.gm[o + 3] = y < -37.5 ? 128 + 127 * mat(x, z, y) : 0;
  }
  // --- drifting particles: mud and marine snow, many of them
  rseed(3);
  W.snow(26000);

  // --- tulip animals: dense fields, thinner and ragged towards their rims, and a few small groups between them.
  // Each is an exhibit: a line from its foot to its top. It stands on level mud, away from the wall, and sways
  // not where the flight passes at their height: it may pass over them
  const inWay = (x, y, z) => W.flyPts.some((p) => hypot(x - p[0], z - p[2]) < 2.6 && p[1] < y + 4.6);
  // and none closer than 0.8 units to another, so that no two cups push into each other
  const taken = new Map(), spotOf = (x, z) => floor(x / 0.85) * 8192 + floor(z / 0.85);
  const crowded = (x, z) => { for (let a = -1; a < 2; a++) for (let b = -1; b < 2; b++) { const p = taken.get(spotOf(x + a * 0.85, z + b * 0.85)); if (p && hypot(x - p[0], z - p[1]) < 0.8) return true; } return false; };
  // and none on the rounds of the Opabinias, which swim low over the mud (OPABINIAS, opAt in swimmers.js)
  const lanes = OPABINIAS.flatMap(([x, z, R, , , sd]) => Array.from({ length: 200 }, (_, k) => opAt(x, z, R, sd, k / 200 * TAU)));
  const lane = (x, z) => lanes.some((p) => hypot(x - p[0], z - p[1]) < 0.65);
  const tulip = (x, z) => {
    if (hypot(x, z) > 150 || nearPose(x, z, 5) || crowded(x, z)) return;
    // towards the wall they thin out along a ragged line
    if (rnd() > sstep(13, 24, wallX(z) - x + 6 * (fbm(x * 0.09, 6, z * 0.09, 2) - 0.5))) return;
    const y = gy(x, z);
    if (rnd() > 0.3 + 0.7 * low(y) || inWay(x, y, z) || grad(x, y, z)[1] < 0.9 || !W.keep()) return;
    const sc = rr(0.92, 1.06), q = qMul(qAxis(rr(-1, 1), 0, rr(-1, 1), rr(0, 0.1)), qAxis(0, 1, 0, rnd() * TAU)), sd = rnd(), sw = -rr(0.1, 0.2);
    taken.set(spotOf(x, z), [x, z]);
    // (one on such a round is left out only here: its spot stays taken and its random numbers are drawn, so that
    // every other tulip animal stands where it would stand without the rounds)
    if (lane(x, z)) return;
    TULIP.at[cellOf(x, z)].push(x, y - 0.04, z, sc, q[0], q[1], q[2], q[3], 2, sd, 2, sw);
    piece('siphusauctum', [x, y, z], q, [0, 0, 0], [0, 4 * sc, 0], 6, 0.4);
  };
  rseed(4);
  for (const f of FIELDS) for (let i = f[2] * f[2] * PI * 1.25; i > 0; i--) {
    const a = rnd() * TAU, r = sqrt(rnd()) * f[2], x = f[0] + cos(a) * r, z = f[1] + sin(a) * r;
    if (rnd() < sstep(1.05, 0.5, r / f[2] + 0.6 * (fbm(x * 0.13, 4, z * 0.13, 2) - 0.5))) tulip(x, z);
  }
  for (let i = 0; i < 260; i++) {
    const a = rnd() * TAU, r = sqrt(rnd()) * 140, x = cos(a) * r, z = sin(a) * r;
    for (let j = 2 + rnd() * 7 | 0; j > 0; j--) tulip(x + rr(-2.2, 2.2), z + rr(-2.2, 2.2));
  }
  // --- sponges: thickets on the rock of the wall and of the fallen blocks, where it is not level (mud lies on what
  // is level). Each is an exhibit: a line from its foot up its own axis
  rseed(5);
  for (let i = 0, made = 0; i < 300000 && made < 560; i++) {
    const k = pickV(), x = T.wp[k], y = T.wp[k + 1], z = T.wp[k + 2], ny = T.wn[k + 1];
    if (wallX(z) - x > 27 || y > -24 || hypot(x, z) > 150 || ny < -0.15 || ny > 0.78 || nearFly(x, y, z, 2)) continue;
    if (fbm(x * 0.08, y * 0.08, z * 0.08, 2) < 0.56 && !THICKETS.some((t) => hypot(x - t[0], z - t[1]) < t[2])) continue;
    const n0 = [T.wn[k], ny, T.wn[k + 2]], [t1, t2] = tangent(n0), cnt = 3 + rnd() * 7 | 0, sd = rnd();
    for (let j = 0; j < cnt; j++) {
      const a = rr(-1, 1) * (0.4 + cnt * 0.12), b = rr(-1, 1) * (0.4 + cnt * 0.12);
      const s = snap(x + t1[0] * a + t2[0] * b, y + t1[1] * a + t2[1] * b, z + t1[2] * a + t2[2] * b, n0);
      if (!s) continue;
      let ux = s[3], uy = s[4] + 1.2, uz = s[5]; const l = hypot(ux, uy, uz); ux /= l; uy /= l; uz /= l;
      const q = qMul(qFromY(ux, uy, uz), qAxis(0, 1, 0, rnd() * TAU)), sc = rr(0.92, 1.08), p = [s[0] - ux * 0.06, s[1] - uy * 0.06, s[2] - uz * 0.06];
      VAUXIA[rnd() * 3 | 0].at[cellOf(p[0], p[2])].push(p[0], p[1], p[2], sc, q[0], q[1], q[2], q[3], 3, fract(sd + rr(-0.04, 0.04)), 2, 0);
      piece('vauxia', p, q, [0, 0, 0], [0, 1.6 * sc, 0], 4, 0.55 * sc);
      made++;
    }
  }
  // --- algae: mats on the higher swells. A mat is a dark stain in the mud (the ground map above) with threads on
  // it: short and hair-fine, close together, lying on the mud and all trailing the way the current goes, their tips
  // a little lifted. Here and there a tuft of long limp ones that trail the same way. The second seed of a long
  // thread says whether it is red-brown (look.js). An exhibit every 2.5 units, where a mat is dense
  rseed(6);
  const seen = new Set(), flow = (x, z) => 0.7 + 0.5 * sin(x * 0.021 + z * 0.013);
  for (let i = 0; i < 1300000; i++) {
    const k = pickV(); if (T.wn[k + 1] < 0.86) continue;
    const x = T.wp[k] + rr(-0.5, 0.5), z = T.wp[k + 2] + rr(-0.5, 0.5), y = T.wp[k + 1], m = mat(x, z, y);
    if (hypot(x, z) > 158 || rnd() > sstep(0.3, 0.75, m) || nearPose(x, z, 1.5)) continue;
    const cur = flow(x, z);
    for (let j = 0; j < 16; j++) leaf(small, x + rr(-0.4, 0.4), y - 0.01, z + rr(-0.4, 0.4), rr(0.15, 0.5), cur + rr(-0.45, 0.45), rr(1.2, 1.5), rr(0.008, 0.012), 0, 0, rnd(), rnd(), rr(0.12, 0.26));
    if (rnd() < 0.012) for (let j = 0, red = rnd() < 0.2; j < 10; j++) leaf(big, x + rr(-0.15, 0.15), y - 0.02, z + rr(-0.15, 0.15), rr(0.7, 1.6), cur + rr(-0.3, 0.3), rr(0.9, 1.35), rr(0.008, 0.014), 0, 1, rnd(), red ? rr(0.75, 1) : rr(0, 0.7), rr(0.1, 0.25));
    const c = floor(x / 2.5) * 4096 + floor(z / 2.5);
    if (m > 0.6 && !seen.has(c)) { seen.add(c); place('algae', x, y + 0.1, z, x, y + 0.1, z, 3, 1.5); }
  }
  // --- algae on the rock: short limp threads that hang down the wall and the blocks, where the rock is neither level
  // nor an underside
  rseed(7);
  for (let i = 0; i < 60000; i++) {
    const k = pickV(), x = T.wp[k], y = T.wp[k + 1], z = T.wp[k + 2], ny = T.wn[k + 1];
    if (wallX(z) - x > 26 || y > -16 || hypot(x, z) > 150 || ny < 0.1 || ny > 0.8 || fbm(x * 0.11 + 5, y * 0.11, z * 0.11, 2) < 0.58 || nearFly(x, y, z, 1.5) || nearPose(x, z, 3.5)) continue;
    const yaw = atan2(T.wn[k + 2], T.wn[k]), red = rnd() < 0.4;
    for (let j = 8 + rnd() * 6 | 0; j > 0; j--) leaf(big, x + rr(-0.2, 0.2), y + rr(-0.2, 0.2), z + rr(-0.2, 0.2), rr(0.25, 0.7), yaw + rr(-0.9, 0.9), PI - rr(0.3, 1), rr(0.008, 0.014), 0.3, 1, rnd(), red ? rr(0.75, 1) : rr(0, 0.7), rr(0.3, 0.42));
    if (rnd() < 0.35) place('algae', x, y, z, x, y - 0.4, z, 3, 0.8);
  }
  // --- the wall itself is an exhibit: four lines along it, from above its foot to near the top of the swimming space,
  // each one unit inside the rock (the lower two behind whatever stands out furthest at their height, not behind
  // the hollow under a ledge). A backdrop: it is named only where nothing else is looked at
  const face = (y, z) => { let x = wallX(z) - 24; while (x < wallX(z) + 6 && Dw(x, y, z) <= 0) x += 0.5; return x; };
  for (const hs of [[-37, -34, -31], [-30, -27], [-22], [-15]]) for (let z = -132, px, pz; z <= 132; z += 8) {
    const x = min(...hs.map((h) => face(h, z))) + 1, y = hs[0] + 1;
    if (z > -132) backdrop('wall', px, y, pz, x, y, z, 15, 5.5);
    px = x; pz = z;
  }

  // --- the swimmers. Nothing of them is scattered over the ground: the lists at the top say where each group is, and
  // the vertex shaders move the animals from the scene time (swimmers.js). An instance is eight floats, which mean
  // what the shader of its kind says. For the zoo a swarm and a shoal have one row each, in the layout of their
  // animals. Low detail thins out the swarms, the only ones that come in masses
  // (the height of the mud on a grid, for the zoo places of those that keep close to it: zooGround in swimmers.js)
  for (let j = 0; j < GRN; j++) for (let i = 0; i < GRN; i++) GRD[i + GRN * j] = gy(i * 3 - GRH, j * 3 - GRH);
  rseed(8);
  const marrellas = [], swarms = [];
  for (const [x, z, R, dir, sd] of SWARMS) {
    swarms.push(x, 0, z, R, 0, dir * 0.8 / R, 0.5, sd);
    for (let i = [300, 200, 120][LV]; i > 0; i--) marrellas.push(x, 0, z, R, rnd(), dir * 0.8 / R, rr(0.34, 0.5), sd);
  }
  rseed(9);
  const fishes = [], shoals = [];
  for (const [D, y, z, L, dir, sd] of SHOALS) {
    shoals.push(D, y, z, L, 0, dir * 1.8 / L, 1.2, sd);
    for (let i = 0; i < 40; i++) fishes.push(D, y, z, L, rnd(), dir * 1.8 / L, rr(1.1, 1.25), sd);
  }
  // jellyfish: each has its place in its group, none closer than 3 units to another (seen from above), so that no two
  // bells meet. x y z, how far it drifts around that place, where in its pulse it starts, how fast it pulses, the
  // height of its bell, a seed
  rseed(10);
  const medusas = [];
  for (const [x, y, z, rx, ry, rz, n] of BLOOMS) for (let i = 0, tries = 0, first = medusas.length; i < n && tries < 600; tries++) {
    const px = x + rr(-rx, rx), py = y + rr(-ry, ry), pz = z + rr(-rz, rz);
    let free = true; for (let k = first; k < medusas.length; k += 8) if (hypot(px - medusas[k], pz - medusas[k + 2]) < 3) free = false;
    if (free) { medusas.push(px, py, pz, rr(0.3, 0.7), rnd() * TAU, rr(1.9, 2.5), rr(3.6, 4.4), rnd()); i++; }
  }
  // an Opabinia swims half a unit over the mud, an Anomalocaris high over it
  const opabinias = OPABINIAS.flatMap(([x, z, R, dir, at, sd]) => [x, 0.5 + 0.15 * sd, z, R, at, dir * 0.45 / R, 1.28 + 0.12 * fract(sd * 5), sd]);
  const hunters = HUNTERS.flatMap(([x, y, z, R, at, v, len, sd]) => [x, y, z, R, at, v / R, len, sd]);
  MARRELLA.data = new Float32Array(marrellas); METASPRIGGINA.data = new Float32Array(fishes); MEDUSA.data = new Float32Array(medusas);
  OPABINIA.data = new Float32Array(opabinias); ANOMALOCARIS.data = new Float32Array(hunters);
  // zoo: where each of them is (engine/zoo.js): id of the ZOO entry, the instances, where one of them is, reach
  zooMove('marrella', new Float32Array(swarms), zooMarrella, 6); zooMove('metaspriggina', new Float32Array(shoals), zooMetaspriggina, 4, 2);
  zooMove('burgessomedusa', MEDUSA.data, zooMedusa, 6); zooMove('opabinia', OPABINIA.data, zooOpabinia, 4); zooMove('anomalocaris', ANOMALOCARIS.data, zooAnomalocaris, 12);
}
