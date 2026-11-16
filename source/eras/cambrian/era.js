// ============================================================================
// cambrian: a deep basin at the foot of a reef wall, about 508 million years ago
// ============================================================================
// ERA is what the engine asks an era for besides its world (see CLAUDE.md, "adding an era").
// One unit of this world is 5 cm: the player is 20 times smaller than a diver.

// the six viewpoints (position, look-at), keys 1-6. The engine puts each on the sea floor: the second number is the
// height above it. 1 the wall from the basin, 2 along the foot of the wall among fallen blocks, 3 from a ledge of the
// wall north along its foot, 4 from a tongue of mud up the wall, 5 the open basin and the end of a tongue, 6 along the
// great ledge of the wall from above it
const POSES = [
  [42, 2.5, 8, 70, -27, -2],
  [40, 1.6, -52, 54, -39, -14],
  [63, 15.6, 9, 52, -43, 50],
  [44, 2, 40, 70, -20, 26],
  [-14, 3.2, -96, 10, -43.5, -80],
  [42, 23.1, -64, 56, -36, -22],
];
// 60 s camera path (position + look-at, Catmull-Rom): from the basin to the wall, south along its foot and over the
// fallen blocks, up past the great ledge, back north high on the wall, down over a tongue of mud, out into the basin,
// over a field of tulip animals and round to the wall again
const PATH = new Float32Array([
  42, -43.7, 8, 70, -27, -2,
  46, -43, 4, 70, -30, -10,
  50, -42, -6, 62, -36, -30,
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
  4, -37, -8, 60, -35, -20,
  14, -37, -14, 70, -30, -20,
]);
const ERA = {
  views: POSES, fly: PATH,
  // where the sun stands (a direction, of any length), how bright the picture is, how strong the shafts of light are
  sun: [-0.2, 1, 0.08], expo: 0.56, rays: 0.07,
  // how high and how deep the player can swim, and how far from the middle of the world. The top is 12 units under
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
