# Titanichthys: the build sheet

Mario, 2026-11-19, with a picture of the model as it is: "Let us go on with Titanichthys, because it looks
ridiculous too." The picture shows a box for a head, whiskers, two bow-tie shapes in front of the mouth, a button
eye, a step in the middle of the body and two leaves for a tail. Titanichthys had none of that.

This brief hands over the animal the way the Dunkleosteus got it in the end: a tested mesh, the whole shader as
text, and a picture of both. It is built on the same frame as the sixth Dunkleosteus (one skin, a mouth cut into it,
a throat, fins as wings, skin over bone, its own light), with all numbers of its own. Sources and numbers:
`docs/research/devonian/titanichthys.md`.

## What comes with this brief

| File | What it is |
|---|---|
| `docs/research/devonian/titanichthys.md` | The sources, with the numbers taken from them |
| `docs/briefs/ref/titanichthys-mesh.js` | `meshTitanichthys()`, first version |
| `docs/briefs/ref/titanichthys-shader.wgsl` | The whole text of `S_TITANICHTHYS` |
| `docs/briefs/ref/titanichthys-reference.png` | Seven views, a diver of 1.8 m to scale |

The mesh was run in Node with a copy of `Mesh` and `curve()`: 14,302 vertices, 28,000 triangles, one unit long. The
picture comes from the small renderer that drew the Dunkleosteus (light only roughly that of the engine, no shadow).
**The WGSL has not been compiled.** A script checked brackets and that every name is declared before it is used.

## The animal

| What | How | From |
|---|---|---|
| Length | 4.1 m (one unit = 1 TL) | E2023 |
| Head | 0.15 long, 0.27 wide, low and slightly arched, a blunt wide snout | BR2017 (head shield twice as wide as long, 0.6 m) |
| Eyes | Tiny, on the side under the edge of the roof: a dome in a ring 0.010 across | BR2017 (ring 35 mm, opening 13 mm) |
| Mouth | Very wide, the corner at 0.125. Open 34 degrees while it swims, the head lifted 8 | C2020 (gaping ram feeding). Angles: estimate |
| Swallowing | Every 18 to 30 s it closes to about 9 degrees for 2 s and opens again. It never shuts | Report on C2020: it could not close its mouth completely. Timing: free |
| Jaws | No blades, no teeth. Below a long thin rod of bone along each side of the lower jaw (0.15, about 0.6 m), its tip flatter and bent down and inward. The small plates of the upper jaw are left out: too small to see on a filter feeder | BR2017, C2020 |
| Inside | A wide throat back to the gills at the cleft, five gill arches, a comb of pale rakers in front of each | Estimate after basking sharks. Nothing preserved |
| The look inside | Wet flesh, not plastic: grey skin at the lips, then a mottled grey pink with fine dark red veins, folds along floor and roof, papillae close up, darker the deeper; gill arches deep red with filaments; dark gaps between the rakers. The wet sheen sits on the folds (sharp, small highlights), not on the smooth shape; the light from around and the sun are dimmed inside (`mao`) | Mario, 2026-11-19: the inside looked plastic |
| Armour | Thin plates (0.0025 out of the skin), the median dorsal plate to 0.30, the plates of the belly to 0.36 | BR2017 |
| Body | Deepest 0.25 at 0.29, broad (0.26), tapering to a tail stalk above the middle | Amazichthys (J2022), estimate for the depth |
| Pectoral fins | 0.15 long, rounded, from 0.205, low on the flank, 30 degrees down | J2022, E2024 |
| Dorsal fin | One, long and low (0.21 by 0.075), rising slowly to its highest place near the rear, rounded rear edge, from 0.30 | J2022 (0.21 by 0.10 in Amazichthys; lower here) |
| Anal fin | None | J2022 |
| Pelvic fins | Small, at 0.45 | J2022 (halfway between belly armour and keel) |
| Lateral keels | A thick soft ridge along the middle of each side from 0.54 to 0.80 | J2022 |
| Tail fin | 0.35 tall, upper lobe longer, rounded tips | J2022 |
| Colour | One plain tone over armour and skin, no pattern: slate blue grey, darker along the back, paler below with a soft border | Not known for any placoderm. Mario, 2026-11-19: not the pale armour on a dark body of the Dunkleosteus, and nothing without a source (so no spots) |
| Surface | As the Dunkleosteus: skin cracked into fields over bone, plate joints as grooves between raised lips, cavities dark, a broken sheen, flecks of sunlight | |
| Lips | A smooth strip 0.010 to 0.045 above and below the mouth line in front of the corner, and the soft skin of the head in front of 0.15: no cracks there (`nearLip`). The edge of the head shield runs flat into the lip, no joint groove | Mario, 2026-11-19: a ragged tear above the upper lip |
| Swimming | Stiff under the armour, the rear bends; the beat follows the speed | |

Orbit and instance layout are those of the current `vsTitanichthys`; `zooTitanichthys` does not change.

## Stage A: take over

1. Read `swimmers_titanichthys.js` and `world.js` as they are now.
2. Replace `meshTitanichthys()` by `ref/titanichthys-mesh.js` and the text of `S_TITANICHTHYS` by
   `ref/titanichthys-shader.wgsl`. Change no number. Put the list of `aux` from the head of the mesh file at the head
   of `swimmers_titanichthys.js`.
3. `node tools/wgsl.mjs devonian`. Fix only what the compiler names, smallest change, list every fix. All functions
   carry the prefix `titan`; if one clashes with a name elsewhere in the module, say which.
4. Turntable: feeding (as it swims), swallowing (`mo` forced to 0.2 for a moment), one from in front at 3 m at the
   height of the mouth, and one from above.
5. Put them next to `ref/titanichthys-reference.png`.
6. `node tools/bench.mjs devonian`, before and after.
7. **Stop. Show Mario.**

## Rules that matter here

- The colour of armour and skin stays one tone: do not tune `BONE` lighter than `SKIN` by more than the reference does.
- Taken over, not written again. The method is the one that worked for the Dunkleosteus: no new noise, no `sin()`
  patterns on the body, not `skinWet()`.
- No teeth, no whiskers, no blades: Titanichthys had none. No colour pattern: none is known.
- Size: `world.js` gives 3.6 to 4.0 m, the card 4 m. E2023 says about 4.1 m. Change it only if Mario says so.
- `swimmers_titanichthys.js` only. Git is Mario's.

## Acceptance criteria

1. From above the head is about twice as wide as long, low, with a blunt wide snout.
2. While it swims the mouth is wide open and one looks into a throat with gill arches and combs of rakers.
3. No teeth, no blades, no whiskers: thin rods of bone along the lower jaw.
4. The eyes are small.
5. One long low dorsal fin from the end of the armour, no anal fin, a keel on each side of the tail stalk, a high
   tail with a longer upper lobe.
6. Armour and body have the same tone: no pale front half and dark rear half. The plates show by their joints and
   relief only. No pattern: no spots, no stripes.
7. Every 18 to 30 s it swallows: the mouth closes most of the way and opens again.
8. Inside the mouth no broad clean highlight and no flat colour: folds, veins and small wet highlights, darker deeper in.
9. No flicker from 10 m, no broad clean highlight.
10. Frame time reported before and after.

## Not checked

- The WGSL text was never compiled.
- The body behind the armour is that of a relative (Amazichthys, 0.9 m long), scaled to 4.1 m.
- The numbers of J2022 were taken from page text by a tool; text and table disagree on the height of the holotype
  and on the tail fin.
- BR2017 was not read again for this; its numbers come from `devonian-models.md`.
- How wide the mouth opened, the gills, the colour.
- Inside the mouth the sun is dimmed by `mao` in the shader, on top of the shadow map of the engine. If the inside
  comes out too dark in the engine, the fifth argument of `titanLight` (`mix(1., mao, mouthP)`) is the place to tune.
- The small renderer has no shadow map; it dims the sun inside the mouth the same way.
- The ragged tear above the upper lip in the first picture came mostly from the small renderer: it switched the relief
  off where the surface is seen at a slant. That is fixed there. Whether the engine showed the same tear is not known.

## Fix of 2026-11-19: tail stalk and lateral keels

Mario saw a gap at the top of the tail fin and something of the body standing out over the skin near the tail.

| What | Was | Now |
|---|---|---|
| End of the tail stalk | It ended at 0.86 in a cut-off face, 0.05 deep, beside the root of the tail fin; above it a small gap at the notch between the lobes | The stalk tapers from 0.79 to a point at 0.872 (stations 0.830, 0.860 and the new 0.875; a last ring at 0.868). The roots of both lobes run inside it, along its back and its belly, and meet at the notch (0.872, 0.036) |
| Lateral keels | Two separate plates (aux 0.5) beside the flank, up to 0.012 outside the body with a gap, shaded as fins, ending at 0.80 | Part of the one skin: `skin()` thickens the flank by up to 0.012 along the middle of each side, from 0.54 to the tail fin, fading out between 0.82 and 0.875. Same shading and cracks as the body |
| `titanTB` in the shader | 0.80 and 0.85 of the old stalk | `T` and `B` at 0.80 and 0.85 read off the new mesh (.045 / -.011 and .042 / .016) |

The mesh has 13,696 vertices and 26,820 triangles (before: 13,838 and 27,072). `ref/titanichthys-tail-fix.png`
shows the tail before and after from the side and from above (container renderer, not the engine).

What to copy: in `meshTitanichthys()` of `source/eras/devonian/swimmers_titanichthys.js` the stations 0.830 to 0.875,
the keel line in `skin()` (with its comment), the line `RS.push(0.868)`, the two tail fin `wing()` calls with their
comment, and delete the block of the lateral keels before `return m`; all from `ref/titanichthys-mesh.js`. In the
shader the two arrays of `titanTB`. Nothing else.
