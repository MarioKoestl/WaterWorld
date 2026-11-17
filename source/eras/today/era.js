// ============================================================================
// today: the sea as it is now (with one guest from the past)
// ============================================================================
// ERA is what the engine asks an era for besides its world (see CLAUDE.md, "adding an era").

// the six test poses (position, look-at), the fixed poses of every check and the start; keys 1-6 in the dev pages
// only. makeWorld dresses the scene around them, and the engine puts each on the sea floor: the second number is the
// height above it
const POSES = [
  [10, 1.3, 7, -9, -31, -10],
  [50, 1.3, 34, 58, -23, 8],
  [-26, 2.2, -100, 0, -9, -108],
  [-55, 1.5, -18, -60, -30, 8],
  [10, 1.2, -62, 6, -22, -90],
  [3, 1.6, 62, 1, -28, 100],
];
// 60 s camera path (position + look-at, Catmull-Rom): makeWorld keeps it clear, dev.js flies along it
const PATH = new Float32Array([
  10, -42.2, 7, -9, -31, -10,
  7.5, -41.8, 5.5, -10, -31, -12,
  9, -40.5, 18, 17, -37, 42,
  22, -39.2, 40, 48, -36, 45,
  38, -39.2, 46, 57, -27, 18,
  50, -40.4, 35, 58, -24, 8,
  55, -39, 20, 60, -18, -10,
  58, -34, -12, 40, -26, -60,
  50, -30, -44, 10, -26, -80,
  30, -30, -70, 4, -28, -90,
  12, -38.5, -62, 6, -27, -90,
  -4, -36.5, -70, 0, -14, -100,
  -16, -37, -84, 0, -22, -108,
  -29, -38, -90, -44, -34, -60,
  -41, -38, -70, -56, -34, -40,
  -53, -38, -50, -60, -34, -20,
  -58, -38, -28, -60, -32, 0,
  -57, -38, -10, -60, -30, 16,
  -60, -38, 10, -50, -36, 40,
  -52, -37, 36, -20, -35, 44,
  -22, -38, 43, 4, -38, 52,
  -6, -39.2, 44.5, 4, -37, 70,
  3, -40.6, 53, 3, -35, 84,
  3, -41.5, 62, 1, -30, 100,
  4, -39, 76, 3, -22, 100,
]);
const ERA = {
  views: POSES, fly: PATH,
  // where the sun stands (a direction, of any length), how bright the picture is, how strong the shafts of light are
  sun: [0.27, 1, -0.24], expo: 0.62, rays: 0.54,
  // how high and how deep the player can swim, and how far from the middle of the world (150 at most: further out
  // the engine keeps no rock to bump into)
  top: -1.2, bottom: -52, edge: 150,
  // what the loading bar says while the rock is made, its mesh, the scattering, the meshes and the first picture
  load: ['Sculpting the seabed…', 'Carving canyons…', 'Growing kelp…', 'Building set pieces…', 'Letting the light in…'],
  // the soundscape (engine/audio.js): master level, rumble, surface wash, the notes of the drone in Hz, and which of
  // the voices are heard: bubbles, chimes, distant calls
  sound: { vol: 0.78, rumble: 0.34, wash: 0.25, drone: [73.42, 110, 164.81, 246.94, 369.99], bubbles: 1, chimes: 1, calls: 1 },
  // Once per frame, before the picture is drawn: the era's own numbers in the uniform buffer UB. Here the share of
  // grotto water at the camera, which fades in over 18 m around the grotto, and the exposure, which rises with the
  // depth. It runs in every frame and must not allocate
  tick() {
    const zx = F[CX] - PURPLE[0], zz = F[CZ] - PURPLE[1]; let zt = (44 - sqrt(zx * zx + zz * zz)) / 18; zt = zt < 0 ? 0 : zt > 1 ? 1 : zt;
    UB[U_ZONE] = zt * zt * (3 - 2 * zt);
    let ek = (-F[CY] - 8) / 26; ek = ek < 0 ? 0 : ek > 1 ? 1 : ek;
    UB[U_EXPO] = ERA.expo * (0.6 + 0.4 * ek);
  },
};
