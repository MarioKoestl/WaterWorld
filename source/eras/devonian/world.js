// ============================================================================
// devonian: what is drawn, and where it stands (load-time only)
// ============================================================================
// Kinds in drawing order. The driftwood, then the swimmers (schools, swarms, sharks, giants).
const WOOD = kind({ mesh: () => meshDriftwood().build(), wgsl: S_WOOD, vs: 'vsDrift', fs: 'fsDrift' });
const KENTUCKIA = kind({ mesh: () => meshKentuckia().build(), wgsl: S_SEA + S_KENTUCKIA, vs: 'vsKentuckia', fs: 'fsKentuckia' });
const CONCAVICARIS = kind({ mesh: () => meshConcavicaris().build(), wgsl: S_CONCAVICARIS, vs: 'vsConcavicaris', fs: 'fsConcavicaris' });
const GONIATITE = kind({ mesh: () => meshGoniatite().build(), wgsl: S_GONIATITE, vs: 'vsGoniatite', fs: 'fsGoniatite' });
const CLADOSELACHE = kind({ mesh: () => meshCladoselache().build(), wgsl: S_CLADOSELACHE, vs: 'vsCladoselache', fs: 'fsCladoselache' });
const STETHACANTHUS = kind({ mesh: () => meshStethacanthus().build(), wgsl: S_STETHACANTHUS, vs: 'vsStethacanthus', fs: 'fsStethacanthus' });
const CTENACANTHUS = kind({ mesh: () => meshCtenacanthus().build(), wgsl: S_CTENACANTHUS, vs: 'vsCtenacanthus', fs: 'fsCtenacanthus' });
const DUNKLEOSTEUS = kind({ mesh: () => meshDunkleosteus().build(), wgsl: S_DUNKLEOSTEUS, vs: 'vsDunkleosteus', fs: 'fsDunkleosteus' });
const TITANICHTHYS = kind({ mesh: () => meshTitanichthys().build(), wgsl: S_TITANICHTHYS, vs: 'vsTitanichthys', fs: 'fsTitanichthys' });

function makeWorld(W) {
  const { backdrop, gyExact } = W;
  // dead animals on the floor (devonian-remains.md): pushed after the living ones and never into the zoo lists. Each
  // call has its own random numbers, so nothing else in the world moves. lift: half the body width (in body lengths)
  // times 0.6, so that the body is sunk into the mud by a fifth of its width
  const deadOnFloor = (arr, n, s0, s1, lift, seed, sd = -1) => {
    rseed(seed);
    for (let k = 0; k < n; k++) {
      const a = rr(0, TAU), r0 = rr(5, 65), x = cos(a) * r0, z = sin(a) * r0, size = rr(s0, s1);
      arr.push(x, gyExact(x, z) + lift * size, z, rr(0, TAU), sd < 0 ? rnd() : sd, 0.0001, size, rnd());
    }
  };
  // --- driftwood: 15 floating near the surface, 25 sunk on the floor
  // instance: a.xyz centre/position, a.w radius/yaw, b.x phase/tilt, b.y speed (0=sunk), b.z size, b.w seed
  rseed(310);
  const wood = [];
  // floating logs: drift in slow circles in the upper water
  for (let i = 0; i < 15; i++) {
    const a = rr(0, TAU), r0 = rr(10, 60);
    const cx = cos(a) * r0, cz = sin(a) * r0;
    const cy = rr(-3, -8);
    const R = rr(12, 28), ph = rnd() * TAU;
    const spd = rr(0.008, 0.020) * (rnd() < 0.5 ? 1 : -1);
    const sz = rr(0.65, 1.15);
    wood.push(cx, cy, cz, R, ph, spd, sz, rnd());
  }
  // sunk logs: half-buried in the mud, scattered across the floor
  for (let i = 0; i < 25; i++) {
    const a = rr(0, TAU), r0 = rr(5, 70);
    const x = cos(a) * r0, z = sin(a) * r0;
    const yaw = rnd() * TAU, tilt = rr(-0.06, 0.06);
    const sz = rr(0.6, 1.15);
    wood.push(x, gyExact(x, z), z, yaw, tilt, 0, sz, rnd());
  }
  WOOD.data = new Float32Array(wood);

  // --- Kentuckia: six schools of small ray-finned fish in the upper water
  rseed(320);
  const kentuckias = [], kentuckiaZoo = [];
  const kSchools = [
    [8, -8, 8, 14], [-8, -10, -3, 16], [22, -6, 12, 12],
    [-3, -13, 18, 15], [15, -7, -12, 13], [32, -11, 2, 14],
  ];
  for (const [cx, cy, cz, R] of kSchools) {
    const spd = rr(0.03, 0.045) * (rnd() < 0.5 ? 1 : -1);
    const sd = rnd();
    kentuckiaZoo.push(cx, cy, cz, R, 0, spd, 0.10, sd);
    for (let j = 0; j < 150; j++) kentuckias.push(cx, cy, cz, R, rnd(), spd, rr(0.08, 0.12), sd);
  }
  deadOnFloor(kentuckias, 30, 0.08, 0.12, 0.033, 521);
  KENTUCKIA.data = new Float32Array(kentuckias);

  // --- Concavicaris: eight swarms of small arthropods throughout the water
  rseed(330);
  const concavicaris = [], concavicarisZoo = [];
  const cSwarms = [
    [5, -7, 5, 10], [-5, -9, -5, 12], [18, -5, 8, 9],
    [-10, -12, 15, 11], [12, -8, -8, 10], [28, -10, 5, 13],
    [-2, -6, 22, 10], [20, -11, -5, 11],
  ];
  for (const [cx, cy, cz, R] of cSwarms) {
    const spd = rr(0.04, 0.06) * (rnd() < 0.5 ? 1 : -1);
    const sd = rnd();
    concavicarisZoo.push(cx, cy, cz, R, 0, spd, 0.06, sd);
    for (let j = 0; j < 300; j++) concavicaris.push(cx, cy, cz, R, rnd(), spd, rr(0.04, 0.07), sd);
  }
  deadOnFloor(concavicaris, 40, 0.04, 0.07, 0.075, 522);
  CONCAVICARIS.data = new Float32Array(concavicaris);

  // --- Goniatite: four groups of early ammonoids in the upper water
  rseed(340);
  const goniatites = [], goniatiteZoo = [];
  const gGroups = [
    [6, -6, 10, 8], [-6, -8, -2, 9], [16, -5, 5, 7], [-4, -10, 16, 8],
  ];
  for (const [cx, cy, cz, R] of gGroups) {
    const spd = rr(0.015, 0.025) * (rnd() < 0.5 ? 1 : -1);
    const sd = rnd();
    goniatiteZoo.push(cx, cy, cz, R, 0, spd, rr(0.04, 0.08), sd);
    for (let j = 0; j < 40; j++) goniatites.push(cx, cy, cz, R, rnd(), spd, rr(0.03, 0.08), sd);
  }
  deadOnFloor(goniatites, 25, 0.03, 0.08, 0.046, 523);
  GONIATITE.data = new Float32Array(goniatites);

  // --- Cladoselache: three groups of about 6 early sharks in the mid-water
  rseed(351);
  const cladoselaches = [], cladoselacheZoo = [];
  const clGroups = [
    [10, -10, 6, 20], [-12, -12, -6, 22], [24, -8, 10, 18],
  ];
  for (const [cx, cy, cz, R] of clGroups) {
    const spd = rr(0.7, 1.1) * (rnd() < 0.5 ? 1 : -1);          // cruising speed of the group in m/s
    const sd = rnd();
    cladoselacheZoo.push(cx, cy, cz, R, 0, spd, 1.8, sd);
    for (let j = 0; j < 6; j++) cladoselaches.push(cx, cy, cz, R, rnd(), spd, rr(1.4, 1.8), sd);
  }
  deadOnFloor(cladoselaches, 2, 1.4, 1.8, 0.042, 524);
  CLADOSELACHE.data = new Float32Array(cladoselaches);

  // --- Stethacanthus: eight anvil sharks, each on its own path
  rseed(360);
  const stethacanthusArr = [], stethacanthusZoo = [];
  for (let i = 0; i < 8; i++) {
    const a = rr(0, TAU), r0 = rr(8, 35);
    const cx = cos(a) * r0, cz = sin(a) * r0;
    const cy = rr(-10, -16), R = rr(12, 20);
    const spd = rr(0.25, 0.45) * (rnd() < 0.5 ? 1 : -1);        // cruising speed in m/s, the sign is the direction
    const sd = rnd();
    stethacanthusArr.push(cx, cy, cz, R, sd, spd, rr(0.8, 1.1), sd);
    stethacanthusZoo.push(cx, cy, cz, R, sd, spd, 1.0, sd);
  }
  deadOnFloor(stethacanthusArr, 1, 0.8, 1.1, 0.042, 525, 0.074);
  STETHACANTHUS.data = new Float32Array(stethacanthusArr);

  // --- Ctenacanthus: six spine sharks, each on its own path
  rseed(370);
  const ctenacanthusArr = [], ctenacanthusZoo = [];
  for (let i = 0; i < 6; i++) {
    const a = rr(0, TAU), r0 = rr(8, 35);
    const cx = cos(a) * r0, cz = sin(a) * r0;
    const cy = rr(-8, -14), R = rr(15, 22);
    const spd = rr(0.5, 0.8) * (rnd() < 0.5 ? 1 : -1);          // cruising speed in m/s, the sign is the direction
    const sd = rnd();
    ctenacanthusArr.push(cx, cy, cz, R, sd, spd, rr(1.4, 1.8), sd);
    ctenacanthusZoo.push(cx, cy, cz, R, sd, spd, 1.8, sd);
  }
  deadOnFloor(ctenacanthusArr, 1, 1.4, 1.8, 0.041, 526);
  CTENACANTHUS.data = new Float32Array(ctenacanthusArr);

  // --- Dunkleosteus: three armoured giants, each on its own wandering path (devonian-giants-motion.md)
  rseed(380);
  const dunkleArr = [], dunkleZoo = [];
  for (let i = 0; i < 3; i++) {
    const a = rr(0, TAU), r0 = rr(12, 40);
    const cx = cos(a) * r0, cz = sin(a) * r0;
    const cy = rr(-8, -16), R = rr(20, 30);
    const spd = rr(0.35, 0.55) * (rnd() < 0.5 ? 1 : -1);         // cruising speed in m/s, the sign is the direction
    const sd = rnd(), sd2 = rnd();
    dunkleArr.push(cx, cy, cz, R, sd, spd, 4.1, sd2);
    dunkleZoo.push(cx, cy, cz, R, sd, spd, 4.1, sd2);
  }
  deadOnFloor(dunkleArr, 1, 4.1, 4.1, 0.070, 527);
  DUNKLEOSTEUS.data = new Float32Array(dunkleArr);

  // --- Titanichthys: two filter-feeding giants, each on its own wandering path
  rseed(390);
  const titanArr = [], titanZoo = [];
  for (let i = 0; i < 2; i++) {
    const a = rr(0, TAU), r0 = rr(15, 45);
    const cx = cos(a) * r0, cz = sin(a) * r0;
    const cy = rr(-6, -14), R = rr(22, 32);
    const spd = rr(0.40, 0.60) * (rnd() < 0.5 ? 1 : -1);        // cruising speed in m/s, the sign is the direction
    const sd = rnd(), sd2 = rnd();
    titanArr.push(cx, cy, cz, R, sd, spd, 4.1, sd2);
    titanZoo.push(cx, cy, cz, R, sd, spd, 4.1, sd2);
  }
  deadOnFloor(titanArr, 1, 4.1, 4.1, 0.085, 528);
  TITANICHTHYS.data = new Float32Array(titanArr);

  // --- drifting particles: many, the water is thick with dead plankton
  W.snow(14000);

  // --- zoo: the driftwood, the fish and the floor
  zooMove('driftwood', WOOD.data, zooDrift, 8);
  zooMove('kentuckia', new Float32Array(kentuckiaZoo), zooKentuckia, 6, 2);
  zooMove('concavicaris', new Float32Array(concavicarisZoo), zooConcavicaris, 6, 2);
  zooMove('goniatite', new Float32Array(goniatiteZoo), zooGoniatite, 6, 2);
  zooMove('cladoselache', new Float32Array(cladoselacheZoo), zooCladoselache, 8, 2);
  zooMove('stethacanthus', new Float32Array(stethacanthusZoo), zooStethacanthus, 6, 2);
  zooMove('ctenacanthus', new Float32Array(ctenacanthusZoo), zooCtenacanthus, 8, 2);
  zooMove('dunkleosteus', new Float32Array(dunkleZoo), zooDunkleosteus, 12, 2);
  zooMove('titanichthys', new Float32Array(titanZoo), zooTitanichthys, 12, 2);
  backdrop('floor', -60, -45, -60, 60, -45, 60, 8, 80);
}
