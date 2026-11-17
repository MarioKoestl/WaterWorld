// ============================================================================
// cambrian: a deep basin at the foot of a reef wall, about 508 million years ago
// ============================================================================
// ERA is what the engine asks an era for besides its world (see CLAUDE.md, "adding an era").
// One unit is one metre, as in every era, and everything alive has its real size (docs/briefs/scale.md, stage 3).
// What lives here was first built for a player 20 times smaller, at one unit for 5 cm. The rock keeps its shape and
// is read in metres now; the meshes of what is alive keep their old units and are made a twentieth by TS, and so are
// some distances in their shaders (TSC in swimmers.js). The life is gathered in gardens (GARDENS in world.js): one
// in front of test pose 1, where the player starts, one in front of test pose 5, and two the flight comes down to
const TS = 0.05;

// the six test poses (position, look-at), the fixed poses of every check and the start; keys 1-6 in the dev pages
// only. The engine puts each on the sea floor: the second number is the height above it. 1 the first garden, at the
// foot of a small block out on the plain (the player starts there), 2 the wall from the basin, 3 from a ledge of the
// wall north along its foot, 4 from a tongue of mud up the wall, 5 over a garden out on the open basin towards the
// end of a tongue, 6 along the great ledge of the wall from above it
const POSES = [
  [35.6, 0.6, -34.5, 36.9, -47.3, -32.7],
  [42, 2.5, 8, 70, -27, -2],
  [63, 15.6, 9, 52, -43, 50],
  [44, 2, 40, 70, -20, 26],
  [-13.6, 0.7, -95.6, 10, -47, -80],
  [42, 23.1, -64, 56, -36, -22],
];
// 60 s camera path (position + look-at, Catmull-Rom): from test pose 2 down to the garden at the large block, south
// along the foot of the wall and over the fallen blocks, up past the great ledge, back north high on the wall, down
// over a tongue of mud, out into the basin and round, and down to the garden on a low swell of the plain, where it ends
const PATH = new Float32Array([
  42, -43.7, 8, 51.3, -47.7, 3.5,
  49, -46.7, 5, 55.5, -47.9, 2,
  51, -43, -5, 62, -37, -30,
  50, -41.5, -20, 56, -38, -44,
  49, -37, -36, 52, -36, -60,
  46, -36, -50, 46, -30, -74,
  40, -32, -62, 44, -24, -80,
  35, -25, -72, 46, -22, -84,
  36, -18, -80, 50, -20, -70,
  40, -15.5, -72, 52, -30, -44,
  43, -15, -56, 56, -34, -26,
  47, -15.5, -38, 60, -36, -10,
  52, -17, -20, 62, -36, 6,
  56, -20, -4, 62, -36, 22,
  59, -24, 10, 52, -42, 34,
  56, -30, 24, 36, -45, 44,
  46, -36.5, 36, 20, -45, 50,
  34, -38.5, 43, 6, -45, 52,
  22, -39.5, 48, -10, -45, 48,
  8, -40.5, 48, -20, -45, 30,
  -4, -39.5, 38, -10, -44, 6,
  -8, -37, 22, 16, -43, -10,
  -4, -37, 6, 40, -40, -16,
  5, -40, -12, 13, -45, -22.5,
  10.6, -44, -19.8, 13.5, -45.1, -23.5,
]);
const ERA = {
  views: POSES, fly: PATH,
  // where the sun stands (a direction, of any length), how bright the picture is, how strong the shafts of light are.
  // A low sun, 30 degrees up, that comes along the line of the wall from the north and a little from the basin's
  // side: it lights the face of the wall, the wall's buttresses and the blocks cut it into shafts, and they run
  // down the basin beside the wall
  sun: [-0.1, 0.58, 1.0], expo: 0.57, rays: 0.36,
  // how high and how deep the player can swim, and how far from the middle of the world. The top is 12 m under
  // where the surface would be, and the edge leaves more of the plain beyond it than the water lets one see
  top: -12, bottom: -52, edge: 105,
  // what the loading bar says while the rock is made, its mesh, the scattering, the meshes and the first picture
  load: ['Raising the reef wall…', 'Letting the mud slide…', 'Breaking off blocks…', 'Stirring up the mud…', 'Letting a little light down…'],
  // the soundscape (engine/audio.js): deeper and quieter than today's. No surface wash and no calls: the surface is
  // far away and there are no whales yet
  sound: { vol: 0.7, rumble: 0.4, wash: 0, drone: [55, 82.41, 123.47, 185], bubbles: 0, chimes: 1, calls: 0 },
  // Once per frame, before the picture is drawn: the era's own numbers in the uniform buffer UB. One kind of water,
  // and an exposure that falls towards the top, where there is more light. It runs in every frame and must not allocate
  tick() {
    UB[U_ZONE] = 0;
    let k = (-F[CY] - 12) / 34; k = k < 0 ? 0 : k > 1 ? 1 : k;
    UB[U_EXPO] = ERA.expo * (0.6 + 0.4 * k);
  },
};
