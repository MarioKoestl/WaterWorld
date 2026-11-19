# Concavicaris: build sheet (2026-11-19)

A small arthropod in a folded shell, 6 cm, in swarms of 300; food for nearly everything in this sea. Built after
Concavicaris submarinus of Morocco, the one of its kind with a 3D reconstruction from a scan (Jobbins, Haug and Klug
2020, open access). Sources and measurements: `docs/research/devonian/concavicaris.md`.

| File | What |
|---|---|
| `ref/concavicaris-mesh.js` | `meshConcavicaris()`, tested: 2,398 vertices, 3,928 triangles (2,400 animals) |
| `ref/concavicaris-shader.wgsl` | The whole text of `S_CONCAVICARIS`: vertex shader with the motion, fragment shader |
| `ref/concavicaris-reference.png` | From the side, three-quarter front, from in front, from below, from above, the grab, the shell close by (container renderer with a shadow map, not the engine) |

## The shape

| Part | How | Source |
|---|---|---|
| Shell | Two valves joined along the back, open below; in section a pointed arch. From the side highest 0.44 L in the middle, the front tip a point, the lower edge rising steeply under it into the notch of the eye, the rear edge cut off. A quarter as wide as long. The valves have a thickness (a strip along their open edges) and a raised rim along the lower edge | Measured on Fig. 2; the numbers of the text; the rim after the double line of Fig. 1b; the thickness estimated |
| Surface | Smooth with a fine net of many-sided cells (seen only from close by), small pits scattered over it, a row of pits along the lower edge, a groove inside the rim, a shallow depression from near the rear end to the middle, the line of the hinge, a gentle unevenness | The text (cells, groove); Fig. 1a, f (pits), Fig. 1c (the row), Fig. 1b (the depression); the unevenness estimated |
| Material | Chitin, warm brown (estimate, not verified: no colour is known), darker along the hinge, lighter at the thin edges; the shell lets some light through, so the body under it shows as a shade and light from behind glows through the edges; a wet sheen | Estimate |
| Eyes | Two large balls, 0.11 L across, side by side under the front tip, half in the notch; six-sided lenses, each a tiny dome with its own glint, and the dark pseudopupil of compound eyes | The text; Fig. 2; the pseudopupil as in living compound eyes |
| Body | A soft body inside the shell, ringed in segments behind the middle, seen between the valves from below and from in front; a little past the rear edge. Six leaf-shaped gills on each side under it | Fig. 2 and 4 (purple, it fills most of the shell); gills leaf-shaped by the text; segments estimated |
| Arms | Three pairs for catching, folded under the front, the rear pair the longest; five pieces each with darker soft joints; spines in two rows on the last two pieces | Not kept in this species: middle size as in Fig. 5 (estimate) |
| Paddles | Eight pairs of thin blades hanging from the lower rear third, their edges a fringe of fine bristles | Fig. 2, the text; shape and fringe estimated |
| Colour | No pattern: none is known. The inside of the shell and the body darker | |

The old mesh had a spine at each end and growth lines; the sources show neither, so both are gone.

Second version of the same day: the first looked like a smooth plastic model (Mario). Added: the thickness and the
rim of the valves, the pits, the depression, the material with its translucency and sheen, the segments and gills
of the body, the joints and spines of the arms, the fringe of the paddles, the facets with their glints and the
pseudopupil of the eyes.

## How it moves

The path of the swarm is the one of now, so `zooConcavicaris` and `world.js` do not change. New for each animal:

- The paddles beat 2 to 3.5 times a second, one after another from the rear forward (a wave along them); the power
  stroke swings them back. The whole animal rises and dips a little with the beat and holds its front a little up.
- The arms sway; every 6 to 14 s, in about every second cycle, they shoot forward and up in 0.12 s, as if to grab, and
  fold back in 0.8 s.

All timings are estimates (not verified): how thylacocephalans swam is not known; JHK2020 call it not a fast swimmer.

## What to copy

1. `source/eras/devonian/swimmers_concavicaris.js`: replace `meshConcavicaris()` by the one of
   `ref/concavicaris-mesh.js` and the whole text of `S_CONCAVICARIS` by `ref/concavicaris-shader.wgsl`. The comment at
   the top of the file and `zooConcavicaris` stay.
2. `world.js`, `zoo.js`: nothing. The card's 6 cm is inside the range of the specimens (27 to about 100 mm).

## Acceptance

1. Swarms of small animals in a smooth folded shell, higher than wide, with a pointed front tip, two large dark eyes
   under it, folded arms below the front and a row of beating paddles below the rear.
2. From below or in front one sees the body between the two valves.
3. The paddles beat in a wave; now and then an animal shoots its arms forward.
4. `node tools/wgsl.mjs devonian` passes.
5. Frame time reported before and after (2,400 animals, 2,398 vertices each). If it costs too much, say so: the arms
   (about 1,000 vertices) are the place to save, or fewer animals per swarm (Mario decides).

## Not checked

The WGSL text was never compiled. The picture comes from the container renderer. The arms, the shape of the paddles,
the body inside and all timings of the motion are estimates.
