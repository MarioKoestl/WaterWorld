// ============================================================================
// devonian: open water over the Cleveland Shale, about 360 million years ago
// ============================================================================
// ERA is what the engine asks an era for besides its world (see CLAUDE.md, "adding an era").
// One unit is one metre, as in every era. The floor is flat black mud at about 45 m depth, the life is in the upper
// 30 m. Five of the six test poses hang in open water; one is at the floor.

// the six test poses (position, look-at), the fixed poses of every check and the start; keys 1-6 in the dev pages
// only. The engine puts each on the sea floor: the second number is the height above it.
// 1 upper water where the life is, the player starts here. 2 from one side looking across the garden. 3 near the
// surface, looking down into the green murk. 4 mid-depth, the light fading. 5 deep and dark, looking up at the
// light. 6 at the floor beside where sunk logs and dead plates will lie
const POSES = [
  [0, 37, -5, 15, -12, 15],
  [40, 33, 5, -10, -15, -5],
  [10, 42, -20, 5, -20, 0],
  [-25, 22, 10, 10, -18, -5],
  [15, 8, -5, 5, -15, 5],
  [30, 1.5, 25, 20, -44.5, 15],
];
// 60 s camera path (position + look-at, Catmull-Rom): from near the surface, through the life zone, down into the
// dark, along the floor, and back up into the light
const PATH = new Float32Array([
  -20, -4, -20, 0, -10, 0,
  -10, -6, -10, 10, -12, 10,
  0, -8, 0, 15, -14, 15,
  10, -10, 10, 20, -15, 25,
  25, -12, 20, 15, -16, 30,
  30, -15, 10, 20, -20, -5,
  25, -18, -5, 10, -24, -15,
  15, -22, -15, 0, -28, -10,
  5, -28, -10, -5, -34, 0,
  -5, -33, 0, 0, -38, 10,
  0, -37, 10, 10, -42, 15,
  10, -40, 15, 20, -44, 20,
  20, -42, 20, 25, -44.5, 25,
  28, -43, 25, 20, -44.5, 15,
  25, -40, 20, 15, -35, 10,
  15, -35, 10, 5, -28, 0,
  5, -28, 0, -5, -22, -10,
  -5, -22, -10, -10, -16, -15,
  -10, -16, -10, 0, -12, 0,
  0, -12, 0, 10, -10, 10,
  10, -10, 10, 20, -8, 15,
  15, -8, 15, 20, -6, 10,
  18, -6, 8, 10, -8, 0,
  8, -5, -2, 0, -10, -8,
  0, -4, -8, -10, -8, -15,
]);
const ERA = {
  views: POSES, fly: PATH,
  // the sun almost overhead, slightly from the south-east: open water, strong shafts that go straight down
  sun: [0.2, 1.0, 0.3], expo: 0.55, rays: 0.45,
  // how high and how deep the player can swim, and how far from the middle
  top: -1.2, bottom: -47, edge: 150,
  // loading texts
  load: ['Laying down the mud…', 'Letting the oxygen sink…', 'Stirring up the plankton…', 'Letting the light through…', 'Darkening the deep…'],
  // sound: open-water hum, distant surface wash, deep drone, no calls and no bubbles
  sound: { vol: 0.75, rumble: 0.3, wash: 0.15, drone: [55, 82.41, 123.47, 164.81], bubbles: 0, chimes: 0, calls: 0 },
  // per frame: exposure falls with depth (bright near the surface, dark near the floor: the other way round from
  // the Cambrian, where it rises with depth to compensate the dark)
  tick() {
    UB[U_ZONE] = 0;
    let k = (-F[CY] - 1.2) / 44; k = k < 0 ? 0 : k > 1 ? 1 : k;
    UB[U_EXPO] = ERA.expo * (1.0 - 0.4 * k);
  },
};
