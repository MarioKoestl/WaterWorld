# Dunkleosteus: the surface, and the shape once more

Mario, 2026-11-18, with a picture of the model after stage 4 of `dunkleosteus-build.md`: "Now the model at least
looks right. But the whole structure, the colour, the skin are still missing. Much more detailed."

This brief hands over the surface the way the build sheet handed over the shape: as finished text for the shader
and a picture of what it makes. It also brings a second version of the mesh, because the two figures of the paper
are now on the disk (`tools/out/research/dunkleosteus/`) and were measured for this brief. They show more than the
stage 2 table found.

Where this file and `dunkleosteus-build.md` differ, this file wins. The method of the build sheet stays: take over,
compare with the picture, stop.

## What comes with this brief

| File | What it is |
|---|---|
| `docs/briefs/ref/dunkleosteus-mesh.js` | `meshDunkleosteus()`, second version. Replaces the first |
| `docs/briefs/ref/dunkleosteus-shader.wgsl` | The whole text of `S_DUNKLEOSTEUS`: helpers, vertex and fragment shader |
| `docs/briefs/ref/dunkleosteus-reference.png` | Nine views of that mesh with that surface. Replaces the first |

The mesh was run in Node with a copy of `Mesh` and `curve()`: 7,281 vertices, 14,018 triangles, one unit long. The
fragment shader was written twice, in WGSL and in numpy, and the picture comes from the numpy one with the noise
functions of `W_HASH` copied step by step. The renderer for the picture is not the engine: its light is a rough copy
of `skinWet()` with the colours of the Devonian `air.js`, without shadow, fog over distance or shafts.

**The WGSL has not been compiled.** No compiler was at hand. Expect a few mistakes of syntax.

## What the figures show that the first mesh did not have

Measured in pixels off Fig. 4 of E2024 (the life reconstruction, body length 669 px). y is the height above the
middle of the deepest section, in body lengths. The stage 2 table in the research note says "Good" for nearly every
line. These are the lines where it is not.

| What | First mesh | Fig. 4 | Second mesh |
|---|---|---|---|
| Back above the eye, s = 0.05 | 0.090 | 0.049 | 0.052 |
| Back at the neck, s = 0.19 | 0.124 | 0.094 | 0.092 |
| Highest place of the back | 0.135 at s = 0.27 | 0.1435 at s = 0.39 to 0.42 | 0.143 at 0.39 |
| Belly at s = 0.33 | -0.126 | -0.148 | -0.148 |
| Belly at s = 0.68 | -0.047 | -0.019 | -0.019 |
| Middle of the tail stalk | 0.003 | 0.031 | 0.031 |
| Tail stalk, depth | 0.055 | 0.066 at s = 0.75 | 0.066 |
| Dorsal fin: begins, apex above the back | 0.40, 0.040 | 0.425, 0.125 | 0.425, 0.125 |
| Pectoral fin: base, tip below the base | 0.131 to 0.221, 0.06 | 0.165 to 0.285, 0.144 | 0.165 to 0.285, 0.164 |
| Tail fin: tall, lower tip | 0.27, at s = 0.935 | 0.32, at s = 0.886 | 0.32, at 0.886 |
| Eye | s = 0.056, y = 0.022 | s = 0.040, y = 0.024, close under the roof | 0.042, 0.024 |
| Corner of the mouth | s = 0.106 | about 0.09 | 0.090 |
| Rear rim of the armour on the flank | an S, cut in to 0.26 | a straight slant from 0.39 on the back to 0.22 low on the flank | the slant |
| Pelvic and anal fin | dark | pale | pale (aux 0.6) |

In words: the head sits low and is smaller than the trunk. The back rises behind the head to a hump where the
dorsal fin begins. The belly runs level and then rises steeply, so the tail stalk lies above the middle of the body
(E2024 text: the spine lies at 0.66 to 0.75 of the height of the body). The dorsal fin is that of a shark, not a
low triangle. The pectoral fins are large sickles.

Two numbers of E2024 that this settles. "From tip to tip of the pectoral fins about twice the width of the chest":
with the fin of Fig. 4 (0.23 long) that holds if the fins point 45° down and outwards, and so they do now (0.466
against a chest 0.225 wide). "Depth by width 1.21 to 1.29": the mesh has 1.27 at the deepest place.

Fig. 4 shows the mouth open by about 20°. The mesh has the jaw shut, turned up about its hinge.

## Why the last surface looked like nothing

| What one sees | Why |
|---|---|
| One olive colour | The limits of the first brief were too timid (armour lighter by 15%, noise 6%). The water turns every colour olive: only light against dark survives, and there was none inside the body |
| Belly hardly paler than the back | The light comes from above. A pale belly in shade and a dark back in light meet in the middle: that is what countershading is for. The border has to be a sharp line with a shape |
| Glitter all over | `h31(i.op * 120.)` is a hash, not a noise: every pixel gets its own value, and the relief turns it into sparks |
| Fine rings like contour lines | `sin(i.op.z * 600. + ...)` in the relief: moiré |
| Sutures as broad smudges | Gaussians 0.02 wide. A suture is a line |

## The look

Colour is not known for any placoderm. The scheme is that of the author of the paper (Fig. 4), taken over: it is
the one source there is, and it reads in green water because it is light against dark.

| Thing | How | From |
|---|---|---|
| Body | Charcoal, never flat: two soft mottlings, the flank a little lighter towards the belly | Fig. 4. Mottling: estimate |
| Belly | Cream, the lowest sixth of the body, from the throat to the tail stalk. The border is a row of teeth pointing up, 34 to the body length | Fig. 4 |
| Lower jaw | Cream, with a toothed border against the black lip | Fig. 4 |
| Cheek | A pale soft oval, 0.034 by 0.030, at s = 0.097 | Fig. 4 |
| Eye | Pale yellow, round black pupil, dark rim, 0.024 across | Fig. 4. Size: E2024 text |
| Fins | Black. Pelvic and anal fin cream | Fig. 4 |
| Armour | Stands 0.003 proud of the skin, a little cooler and glossier. Its rear rim is a slant across the flank, the belly plate reaches back to 0.45 | Fig. 3 and 4 |
| Sutures | Fine lighter lines in a groove: under the plate of the back, between the plates of the flank, across the belly plate | Fig. 4, schematic |
| Cheek plate | A dark groove frames it: along its upper edge, down its rear edge to the cleft, down its front edge | Fig. 3 and 4, schematic |
| Ridges | One along the edge of the roof of the head, one keel along the plate of the back | Fig. 4 (head). Keel: Fig. 3 names a carinal process, its showing outside is an estimate |
| Lateral line | A row of pores along the flank of the armour | E2024: it ends on the armour. Its path: estimate |
| The cleft | Black, runs forwards below the cheek to the hinge of the jaw | Fig. 3 and 4 |
| Bone blades | Grey white, stained at the lip, fine lines of growth. The upper cusp hangs over the narrower lower jaw | Fig. 3 and 4. Lines: estimate |
| Inside of the mouth | Flesh at the lips, dark in the throat | Estimate |
| Naked skin, close up | A net of fine cells (1.5 cm), pores, folds where the body bends, two folds on the cheek | Estimate. E2024: no scales |
| Scratches | Two rakes of three short pale lines on the armour, placed by the seed | Free |
| Mouth at rest | Open by 6°, so that the blades show | Estimate |

Every detail fades by the size of a pixel on the body (`fw`, `dunkNear()`, `dunkLine()`), not by distance. A line
thinner than a pixel gets wider and fainter instead of flickering.

## Stage A: take over

1. Read `swimmers_dunkleosteus.js` and `world.js` as they are now.
2. Replace `meshDunkleosteus()` by the one in `ref/dunkleosteus-mesh.js`. Change no number.
3. Replace the text of `S_DUNKLEOSTEUS` by `ref/dunkleosteus-shader.wgsl`. `zooDunkleosteus` stays.
4. `node tools/wgsl.mjs devonian`. Fix what the compiler names, each with the smallest change, and keep a list:
   line, message, what you changed. Do not rewrite a passage because it would not compile.
5. Turntable at rest and with the mouth open (for that picture set `mo` to 1 for a moment, and take it out again).
6. Put the views next to `ref/dunkleosteus-reference.png`. Shape, the border of the belly, the patch, the eye, the
   plates and the fins must match view for view. The light will differ: the engine has shadow and fog.
7. `node tools/bench.mjs devonian`. The fragment shader costs more than before (two cell noises near, six value
   noises always). If the frame time of the Devonian rises by more than 0.3 ms, say so before changing anything.
8. **Stop. Show Mario the turntable next to the reference picture.**

## Stage B: tune in the light of the engine, and only this

After Mario has seen stage A. These numbers may change, nothing else:

| Number | Now | Why it may have to change |
|---|---|---|
| `DARK` | (.050, .051, .056) | Under the strong sun of the era the back may come out grey, in shade pitch black |
| `PALE` | (.66, .63, .45) | May burn out on the lit flank |
| The factors of `sut`, `rim`, `brow`, `pores`, `scr` on `alb` | 1.1, 1.2, .9, .9, 1.3 | Lines too loud or lost |
| `hgt * 3.7` | 3.7 | The relief as a whole |
| The two rows of gloss in `skinWet()` | see file | Highlights too hard on the armour |

Say for each which value it had, which it has, and show before and after from the same view.

## Rules that matter here

- The shader is taken over, not written again. No new noise, no `sin()` on the body, no `h31()` as a pattern.
- A line or patch that looks wrong in the engine but is the same in the reference picture is a question for Mario,
  not a reason to redesign it.
- If a part of the mesh shows a fault in the engine (a gap, a wrong side, a black dot), say where and show it.
- The other animals of the era are not part of this. Their turn comes with what was learned here.
- `swimmers_dunkleosteus.js` only. Git is Mario's.

## Acceptance criteria

Yes or no, each with the view that shows it.

1. Side: the back rises behind the head to a hump at the dorsal fin, the belly is level and then rises, the tail
   stalk lies above the middle.
2. The dorsal fin is tall and swept back with a free tip. The pectoral fins are large sickles pointing down and out.
3. Above charcoal, below cream, and the border between them is a row of teeth one can count from 10 m.
4. The cheek has a pale oval. The lower jaw is pale.
5. The armour reads as plates: a rim across the flank, sutures, a framed cheek plate, the cleft.
6. From 2 m the skin has a fine grain and the armour pores and scratches. From 10 m none of that flickers.
7. No glitter, no rings, no wood.
8. The eye is pale yellow with a black pupil and has a glint.
9. Mouth at rest: the upper cusps show. Mouth open: four cusps, flesh inside, no hole, no torn skin.
10. From below: cream, with the black fins and the outline of the belly plate.
11. The three animals differ a little in tone and in where their scratches are.
12. Frame time of the era as before, or the difference is reported.

## Verification

```
node tools/wgsl.mjs devonian
node tools/turntable.mjs devonian dunkleosteus <name>      (at rest, and once with the mouth open)
node tools/turntable.mjs devonian dunkleosteus <name> --walk
node tools/poses.mjs devonian
node tools/bench.mjs devonian
node tools/nogpu.mjs
```

The critic gets the turntable, `ref/dunkleosteus-reference.png` and the twelve questions.

## Hand-over

The list of what the compiler wanted changed. The turntable at rest and open next to the reference picture. The
frame times before and after. What differs from the reference and why. The changed files and a commit message.

## Not checked

- The WGSL text was never compiled. Checked by script only: brackets, names declared before use.
- The picture's light is not the engine's. How dark the charcoal and how bright the cream come out there is open:
  that is stage B.
- Whether indexing the two tables in `dunkTB()` is accepted as written (two `var` arrays in the function).
- The cost of the fragment shader on the RTX 2060.
- The plates are schematic. Fig. 3 shows the bones from the side, Fig. 4 their lines on the living animal. Neither
  was traced line by line, and the top and the underside are not in any figure that was read.
- The numbers off Fig. 4 are good to about 2 px, that is 0.003 body lengths. The figure is a drawing by the author,
  not a fossil: E2024 itself says the tail fin is the most uncertain part and the height of the dorsal fin is
  not known.
- Widths. No figure from above or from the front was read.
- The mouth with the jaw shut: Fig. 4 shows it open.
