// ============================================================================
// ordovician: a wide shallow shelf, about 450 million years ago
// ============================================================================
// ERA is what the engine asks an era for besides its world (see CLAUDE.md, "adding an era").
// One unit is one metre, as in every era. The sea is 10 to 25 m deep, the surface visible from everywhere, and the
// floor is pale lime mud with low ledges of grey limestone. No wall, no canyon.

// the six test poses (position, look-at), the fixed poses of every check and the start; keys 1-6 in the dev pages
// only. The engine puts each on the sea floor: the second number is the height above it.
// 1 the start, on the mud near centre looking across the shelf toward a rise
// 2 along the floor: the stage for Endoceras (the giant passes through this view in a later stage)
// 3 looking upward from a deeper area: the surface is bright overhead
// 4 near a rise with ledges to one side
// 5 open floor of pale mud, the shelf stretching to the haze
// 6 from a higher area, wide view across the shelf
const POSES = [
  [5, 1.5, 5, 25, -15, -10],
  [40, 1.5, -20, 65, -15, -18],
  [-20, 2.0, -50, -10, -8, -48],
  [-35, 1.5, 30, -50, -16, 20],
  [10, 1.3, 60, 0, -15, 72],
  [55, 2.5, -40, 25, -14, -18],
];
// 60 s camera path (position + look-at, Catmull-Rom): a wide sweep across the shelf, over rises and mud flats,
// through the aquamarine haze. The floor is roughly at -16 m; the camera stays about 1 to 3 m above it
const PATH = new Float32Array([
  5, -14, 5, 20, -16, -5,
  12, -14, -2, 28, -16, -10,
  22, -14, -10, 38, -15, -18,
  34, -13.5, -18, 50, -15, -18,
  46, -13, -16, 58, -14, -6,
  54, -12.5, -4, 54, -13, 12,
  48, -13, 16, 36, -14, 30,
  34, -13.5, 32, 16, -15, 40,
  14, -14, 42, -2, -15, 44,
  -6, -14.5, 44, -22, -16, 38,
  -24, -15, 34, -38, -16, 20,
  -40, -15.5, 12, -42, -17, -6,
  -40, -15.5, -14, -32, -16, -32,
  -26, -15, -38, -10, -16, -50,
  -6, -14.5, -50, 10, -15, -44,
  12, -14, -38, 18, -15, -26,
  18, -14, -18, 14, -15, -10,
  12, -14, -6, 8, -15, 2,
  8, -14, 4, 4, -15, 10,
  4, -14.5, 10, -2, -15, 15,
]);
const ERA = {
  views: POSES, fly: PATH,
  // the sun: high, from the east and a little south, so that ledges cast shadows across the pale mud
  sun: [0.3, 1.0, -0.2], expo: 0.62, rays: 0.40,
  // the shelf is 10 to 25 m deep: the surface is close, and the player can swim nearly to it. The sea is small
  // (stage G1 of ordovician-life.md): life is dense to 85 m and thins to 105 m, and the player stays inside it
  top: -1.5, bottom: -30, edge: 75,
  // what the loading bar says
  load: ['Laying down lime mud…', 'Raising the ledges…', 'Scattering shells…', 'Stirring the water…', 'Letting the sunlight in…'],
  // sound: surface wash, soft clicks and crackle from the floor, no calls (there are no whales yet)
  sound: { vol: 0.75, rumble: 0.2, wash: 0.3, drone: [65.41, 98, 146.83, 220], bubbles: 0.5, chimes: 0.5, calls: 0 },
  // Once per frame: one kind of water, exposure rises with depth (the shallow parts are very bright)
  tick() {
    UB[U_ZONE] = 0;
    let k = (-F[CY] - 8) / 16; k = k < 0 ? 0 : k > 1 ? 1 : k;
    UB[U_EXPO] = ERA.expo * (0.6 + 0.4 * k);
  },
};
