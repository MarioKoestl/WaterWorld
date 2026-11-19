# Devonian gap fixes (2026-11-19)

Mario saw four places in the Devonian world where the geometry is open or looks wrong. All four are fixed in the
reference code in `ref/`. This brief says what was wrong, what changed and what to copy into the engine. The
picture `ref/devonian-gap-fixes.png` shows each place before (left) and after (right), drawn by the container
renderers from the reference geometry, not by the engine.

| Animal | What Mario saw | Cause | Fix | Reference |
|---|---|---|---|---|
| Ctenacanthus | A slit between the tail stalk and the lower tail lobe | The root of the lower lobe ran up to 0.017 below the belly line of the stalk, and the upper lobe did not cover the space | Both lobes start inside the stalk and meet at the notch on its underside | `ref/ctenacanthus-mesh.js`, the block "tail fin" |
| Driftwood | Branch stumps floating beside the trunk, an open end | The stumps started on a circle round the z axis, but the middle line of the trunk is bent by up to 0.11 m, so three of seven started outside the bark. `Mesh.tube()` closes only its last ring, so the thick end of the trunk and the foot of each stump were open | Each stump starts inside the trunk, half its radius out from the bent middle line. The thick end gets a low dome | `ref/driftwood-mesh.js` (new) |
| Dunkleosteus | A slot in the front of the jaw | The jaw plates of both sides started 0.003 (upper) and 0.006 (lower) behind the snout, about 2.5 cm out from the middle line on a blunt snout, so the front 20 cm of the mouth had no plate | The edge of each plate now goes on round the front of the snout to the middle; the plates of both sides overlap there by 0.002 at full thickness | `ref/dunkleosteus-mesh.js`, the plates of the jaws |
| Titanichthys | Lower jaw looks odd: a thin hook at the back, a plain paddle | The jaw rod ran on to s = 0.150, behind the corner of the mouth (0.125), where the shader turns the jaw less and less, so its end bent into a wire. Its front end at 0.005 stood out in front of the chin as a stub. The jaw skin was kept free of the skin cracks, so it looked like smooth plastic | The rod runs from 0.016 to 0.118. The lower jaw gets the same skin cracks as the body, away from the lip | `ref/titanichthys-mesh.js` (RODS), `ref/titanichthys-shader.wgsl` (`nearLip`) |

Nothing else changed: no other part of the meshes, no motion, no colours.

## What to copy

1. `source/eras/devonian/swimmers_ctenacanthus.js`, in `meshCtenacanthus()`: replace the block from the comment
   "tail fin: the upper lobe long and narrow" to the end of the second `wing(...)` call after it by the same block
   of `ref/ctenacanthus-mesh.js`.
2. `source/eras/devonian/driftwood.js`: replace `meshDriftwood()` by the function in `ref/driftwood-mesh.js`. The
   shader and the zoo function stay as they are. The calls to `rr()` come in the same order as before, so every
   stump keeps its place round the trunk, its thickness and its length.
3. `source/eras/devonian/swimmers_dunkleosteus.js`, in `meshDunkleosteus()`: replace the block from the comment
   "how far a plate stands out of the lip" up to the comment line "the eyes" by the same block of
   `ref/dunkleosteus-mesh.js`. It adds the helper `edge()` and changes the first and third row of `PLATES` and
   the first line in the loop.
4. `source/eras/devonian/swimmers_titanichthys.js`: in `meshTitanichthys()` take over the `RODS` row and the comment
   above it from `ref/titanichthys-mesh.js`. In the fragment shader replace the comment and the line `let nearLip`
   by those of `ref/titanichthys-shader.wgsl` (the line gets `* (1. - jawP)` at the end).

## Numbers

| Mesh | Vertices before | Vertices after | Triangles before | Triangles after |
|---|---|---|---|---|
| Ctenacanthus | 15,230 | 15,230 | 28,576 | 28,576 |
| Driftwood | 426 | 427 | 784 | 794 |
| Dunkleosteus | 15,484 | 15,932 | 30,376 | 31,272 |
| Titanichthys | 14,302 | 13,838 | 28,000 | 27,072 |

## Acceptance

1. Ctenacanthus from below the side: the lower tail lobe grows out of the stalk, no light shows between them.
2. Driftwood, floating and sunk: every stump sits in the bark; the thick end of each log is closed, nothing can be
   seen into from any side.
3. Dunkleosteus from in front with the mouth open: one band of bone across the front of the upper jaw and one across
   the lower jaw, no slot between the two sides. A faint line in the middle can remain where the relief of the bone
   is mirrored; it reads as the joint between the two plates.
4. Titanichthys with the mouth open, from the side and a little below: no thin hook behind the lower jaw, no stub in
   front of its tip, the jaw skin with fields like the rest of the body.
5. `node tools/wgsl.mjs devonian` passes.

## Not checked

The fixes were looked at only in the container renderers (numpy, mirroring the shaders), not in the engine. The
WGSL change has passed the static checker in the container, not a compile in Chrome. The two reference pictures
`ref/ctenacanthus-reference.png` and `ref/dunkleosteus-reference.png` are not drawn again: in their views the
changes are too small to see; `ref/devonian-gap-fixes.png` shows them.
