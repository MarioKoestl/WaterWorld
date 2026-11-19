# Kentuckia: build sheet (2026-11-19)

A small ray-finned fish of the Cleveland Shale, 10 cm, in schools of 150. The fish named "Kentuckia" hlavini is known
from a few specimens, mostly heads, jaws and scales, and its description (Dunkle 1964) is not online. So the model is
an early ray-finned fish of the Late Devonian in general, with the outline measured on a relative. Sources and
measurements: `docs/research/devonian/kentuckia.md`.

| File | What |
|---|---|
| `ref/kentuckia-mesh.js` | `meshKentuckia()`, tested: 1,678 vertices, 3,212 triangles (900 fish) |
| `ref/kentuckia-shader.wgsl` | The whole text of `S_KENTUCKIA`: vertex shader with the motion, fragment shader |
| `ref/kentuckia-reference.png` | The mesh and the colours from the side, the head, the scales, from the front, from above, the dart, the braking, the tail (container renderer, not the engine) |

## The shape

| Part | How | Source |
|---|---|---|
| Body | A slim spindle, deepest 0.22 TL at 0.3 to 0.4, the tail stalk 0.08 deep at 0.7; half as wide as deep | Measured on Moythomasia nitida (MN); width estimated |
| Tail | Heterocercal: the scaled body runs on into the upper lobe and ends 0.13 above the middle line; the fin web below it ends in a lower lobe at 0.88, 0.10 below | MN for the axis, the lower lobe estimated |
| Head | One piece with the body. The shader draws the rear edge of the gill cover, the edge of the cheek, the long upper jaw, the roof; the mouth a long dark line from under the snout to below the eye (corner at 0.15) | Long low lower jaw: I2026 by `devonian-models.md`; the rest estimate |
| Eye | Large and far forward: 0.045 across at 0.075 | Estimate |
| Fins | One dorsal 0.55 to 0.66, the anal fin 0.62 to 0.72, pelvic fins 0.44 to 0.49, pectoral fins low behind the gill cover | Estimate, as these fishes in general |
| Scales | Thick shiny rhombs (ganoid scales) in rows along the body and oblique rows across it, smaller toward the tail; a row of pores along the flank | Estimate of the size; the kind of scale as `devonian-models.md` |
| Colour | One tone, dark above, silvery on the flank, pale below; the scales and the bones of the head shine | No pattern: none is known |

The mouth stays shut: at 10 cm an opening would not show.

## How it moves

The path of the school is the one of now, so `zooKentuckia` and `world.js` do not change. New for each fish:

- The tail beats once per 0.7 body lengths swum, from the mean speed of the school along its ellipse (0.854 R m per
  radian): about 5 to 9 beats a second.
- The dart: every 7 to 15 s (its own period for each fish) it may shoot ahead, in about every second cycle: 0.25 to
  0.6 m forward and up to a third of that to the side within half a second, then it falls back to its place over some
  5 s. It starts with a C-start, the whole body bent for 0.4 s to the side it bolts to, as small fish do. It turns
  toward where the dart carries it, and its tail beats faster and wider while it races.
- The pectoral fins scull a little, lie back against the body in the dart and spread out to brake after it.

## What to copy

1. `source/eras/devonian/swimmers_kentuckia.js`: replace `meshKentuckia()` by the one of `ref/kentuckia-mesh.js` and the
   whole text of `S_KENTUCKIA` by `ref/kentuckia-shader.wgsl`. The comment at the top of the file and `zooKentuckia`
   stay.
2. `world.js`, `zoo.js`: nothing.

## Acceptance

1. A school of slim silvery fish, each with a large eye, a long mouth line, the edge of the gill cover, shiny rhombic
   scales in oblique rows, one dorsal fin far back and a forked tail with a longer upper lobe.
2. Their tails beat fast and evenly; now and then single fish bolt ahead with a quick bend and slip back into the
   school.
3. From 2 m no flicker of the scales.
4. `node tools/wgsl.mjs devonian` passes.
5. Frame time reported before and after (900 fish, 1,678 vertices each).

## Not checked

The WGSL text was never compiled. The picture comes from the container renderer. The fin places and sizes, the width,
the eye and the dart are estimates. Whether "Kentuckia" hlavini looked like this is not known.
