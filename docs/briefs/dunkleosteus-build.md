# Dunkleosteus: the build sheet

Mario, 2026-11-18, with a picture of the model as it is: "Give an exact instruction of how the fish has to look.
Otherwise we will not get any further here." This file is that instruction. It does not describe the fish in
sentences. It hands over the shape as numbers and as a tested mesh, and a picture of that mesh to compare with.

For the sources and the measurements of the animal see `devonian-models.md`, section "Dunkleosteus terrelli", and
`docs/research/devonian/dunkleosteus.md`. Where this file and those two differ on how to build, this file wins.

## What comes with this brief

| File | What it is |
|---|---|
| `docs/briefs/ref/dunkleosteus-mesh.js` | `meshDunkleosteus()`, complete. Needs only `Mesh` and `curve()` |
| `docs/briefs/ref/dunkleosteus-reference.png` | Eight views of exactly that mesh, with plain colours |

The mesh was run outside the engine in Node with a copy of `Mesh`: 7,457 vertices, 14,286 triangles, no number
that is not finite, one unit long (z from -0.5 to 0.5), x to 0.190 on either side, y from -0.130 to 0.145. A script
checked that the faces of the skin, of the roof and floor of the mouth and of the throat look the right way.
The picture was drawn from that mesh by a small renderer written for this (not the engine, no water, no fog). It
shows the shape and the map of the parts. It is not a painting to copy for colour and light.

**It has not run in the engine.** That is stage 1.

**It is a reconstruction from numbers, not a tracing.** The lengths, the depth, the width, the places of the fins
come from E2024. The outline between those numbers is an estimate, because the figures of the paper could not be
seen when this was written. Stage 2 compares it with the figures.

## What is wrong with the model now

Read off Mario's picture and off `swimmers_dunkleosteus.js` as of 2026-11-18, 16:18. Each line names the cause in
the code, so that the same mistake is not built again.

| What one sees | Why |
|---|---|
| Three pieces with dark rings between them, like a submarine | Head and body are two `loft()` bodies. Each closes with a point, their end rings do not have the same size (0.080 by 0.100 against 0.090 by 0.100) |
| A cone as tail, two paddles on its tip like a propeller | The body runs to a point at z = -0.50. The two lobes are `slab()`s that start at that point and reach 0.24 further. There is no tail stalk, no crescent, and the fish is 1.24 long, not 1 |
| Four sticks out of the front | The bone blades are `slab()`s that point forwards and reach past the snout (to z = 0.55) |
| No face: a box without a mouth | The lower jaw is a flat `slab()` under the head. Nothing in the head is cut, so there is no line of a mouth |
| A small black ball as eye | Two `ball()`s on the surface |
| Fins like small planks or leaves | `slab()` can only make an outline that is the same on both sides of its axis. A fin has a front edge and a rear edge that differ |
| Grain like wood, one colour | Six terms of noise are multiplied onto the colour, some stretched along the body, each with a contrast near 1 (`.40 + 1.2 * tg.g` and the like). Sutures are 0.08 deep, black channels |
| Coarse facets | `loft(m, K, 2, 14)`: two rings per key, fourteen points around. The trilobite has ten thousand triangles |
| Mouth (not checked in a render) | `dunkRotY()` with a positive angle turns the nose down. The head gets `+0.50`, the jaw `-0.60`: as read from the code the head drops and the jaw rises. Check it |

The root of all of it: the helpers at hand (`loft`, `slab`, `ball`) cannot make this animal. A head with a mouth,
a tail stalk and fins need a body in one piece that can be cut, and a helper for wings. The reference mesh brings
both.

## How the fish is put together

Read this with `ref/dunkleosteus-mesh.js` open. s is the distance from the snout in body lengths, z = 0.5 - s.

**1. One skin from the snout to the tail stalk.** Twenty stations, each with the height of the back, of the belly,
the half width, a roundness and the height of the widest place. Between them 121 rings (every 0.004 on the head,
every 0.01 behind it) with 44 points each. Head, trunk and tail are not parts. They are places on one skin.

| s | Back (y) | Belly (y) | Half width | Roundness | What is there |
|---|---|---|---|---|---|
| 0.000 | 0.014 | -0.024 | 0.016 | 2.2 | Tip of the snout, blunt |
| 0.012 | 0.054 | -0.046 | 0.052 | 2.4 | |
| 0.025 | 0.074 | -0.062 | 0.070 | 2.5 | |
| 0.050 | 0.090 | -0.080 | 0.084 | 2.8 | Eyes at 0.056 |
| 0.080 | 0.101 | -0.093 | 0.092 | 3.0 | Head is boxier than the trunk |
| 0.110 | 0.109 | -0.104 | 0.097 | 3.0 | Corner of the mouth at 0.106 |
| 0.150 | 0.118 | -0.115 | 0.102 | 2.9 | Pectoral fins begin at 0.131 |
| 0.190 | 0.124 | -0.123 | 0.104 | 2.7 | Head shield ends, the cleft at 0.193 |
| 0.215 | 0.128 | -0.127 | 0.105 | 2.4 | Trunk armour begins, a little larger than the head |
| 0.270 | 0.135 | -0.130 | 0.106 | 2.4 | Deepest: 0.265 deep, 0.212 wide |
| 0.330 | 0.133 | -0.126 | 0.104 | 2.3 | |
| 0.390 | 0.122 | -0.117 | 0.098 | 2.2 | Armour of the back ends at 0.40 |
| 0.450 | 0.108 | -0.104 | 0.090 | 2.1 | Armour of the belly ends, pelvic fins |
| 0.520 | 0.091 | -0.086 | 0.078 | 2.0 | Behind 0.50 the body bends |
| 0.600 | 0.072 | -0.066 | 0.063 | 2.0 | |
| 0.680 | 0.053 | -0.047 | 0.047 | 2.0 | Anal fin |
| 0.750 | 0.038 | -0.032 | 0.034 | 2.0 | Keels begin |
| 0.800 | 0.030 | -0.025 | 0.026 | 2.0 | Tail stalk: 0.055 deep, the thinnest place |
| 0.840 | 0.030 | -0.024 | 0.016 | 2.0 | |
| 0.880 | 0.034 | -0.020 | 0.005 | 2.0 | Ends inside the tail fin |

Roundness 2 is an ellipse, 3 is close to a box with round corners.

**2. The cleft.** Between head shield and trunk armour the skin has one groove. It stands at s = 0.193 from the
back down to y = -0.04 and runs forwards below that (`cleftS(y)`), under the cheek, to 0.12 under the belly. It is
the only break in the outline, and it is the gill opening (E2024: one cleft, no row of slits).

**3. The mouth is cut into the skin.** As far as the corner of the mouth (s = 0.106) every ring is two arcs with
ends of their own: the upper one is the head, the lower one the jaw. Each has an inner side (roof and floor of the
mouth) so that one never looks through the head. Behind the corner the arcs share their ends, so the skin is whole
there. A wall at the back (the throat) and a triangle of skin at each corner stretch when the mouth opens.

**4. The bone blades are wedges along the lips**, with a cutting edge. Each has one cusp near the front: the upper
at s = 0.016, 0.030 high, the lower at s = 0.031, 0.029 high, standing behind and inside the upper one. Behind the
cusp the edge shows 0.002 to 0.006. With the mouth shut one sees the upper cusp and a thin edge. Nothing reaches
past the snout.

**5. The eyes are low domes in the skin**, 0.025 across, at s = 0.056 and y = 0.022. Ring, iris and pupil are
drawn by the shader around that point. The nostrils are two dark dots on each side of the snout, also by the
shader.

**6. Fins are wings.** `wing(LE, TE, th)` takes the front edge and the rear edge as points from root to tip and
puts a section like that of a wing between them: thickest a third behind the front edge, sharp at the rear. Roots
lie inside the body.

| Fin | Where | Size | From |
|---|---|---|---|
| Pectoral, two | Base from s = 0.131 to 0.221, low on the flank, part of it under the head | Tip 0.190 from the middle, at s = 0.258; hangs 30° | Place, base, shape: E2024. The 30°: estimate |
| Pelvic, two | Base from s = 0.452 to 0.500 | 0.05 long | Place: E2024. Size: estimate |
| Dorsal, one | Base from s = 0.40 to 0.51, apex at 0.494 | 0.040 high, leans back | Place and shape: E2024. Height: estimate |
| Anal, one | Base from s = 0.63 to 0.70 | 0.042 high | E2024 draws one, nothing is preserved |
| Keels, two | Tail stalk, s = 0.745 to 0.885 | 0.013 out of the skin | E2024: likely |
| Tail fin | Root at 0.815, fork at 0.892 | Upper lobe to s = 1.000, y = 0.145. Lower to s = 0.935, y = -0.125 | Crescent, at least as tall as the body is deep: E2024. Angles 30° and 45°: after F2017 |

## Which numbers are from a source

| In the mesh | Source says | Status |
|---|---|---|
| Deepest 0.265 at s = 0.27 | 0.25 to 0.28 (E2024) | Source |
| Depth by width 1.25 | 1.21 to 1.29 in adults (E2024) | Source |
| Head shield to 0.19 | Head about 0.18 (E2024) | Source |
| Belly curved | Curved, not flat (E2024) | Source |
| Pectoral fin begins at 0.131, base 0.09 | 0.131 (0.112 to 0.146), 0.085 to 0.10 (E2024) | Source |
| From tip to tip of the pectoral fins 0.38 | About twice the width of the chest: 0.42 (E2024) | Near the source |
| Eye 0.025 across | Socket 8.1 cm, that is 0.024 at 3.4 m (E2024) | Source |
| One cleft as gill opening | E2024 | Source |
| Tail fin 0.27 tall | At least the depth of the trunk (E2024) | Source |
| Tail stalk 0.055 deep | 0.02 to 0.09, given with a warning (E2024) | Inside a wide range |
| Stiff as far as s = 0.50 | Swims with the part behind the pelvic fins (E2024) | Source |
| Belly armour from 0.14 to 0.45 | 0.30 to 0.32 long (E2024). Where it begins: not given | Length source, place estimate |
| Outline of head and back between the numbers | | Estimate |
| Rear rim of the armour on the flank | | Estimate |
| Line of the mouth, corner at 0.106, hinge at 0.135 | | Estimate |
| Height of the cusps, place of the eye | | Estimate |
| Height of dorsal, pelvic, anal fin | Not known (E2024) | Estimate |
| Colour | No source | Free |

## Stage 1: the shape, and nothing else

1. Put `meshDunkleosteus()` from `ref/dunkleosteus-mesh.js` into `swimmers_dunkleosteus.js` in place of the old
   one. Change no number. Keep the comment on aux at its head, and add the sources as the old comment had them.
2. Give it a plain shader for this stage: no texture, no noise. The parts by aux (see the list at the head of the
   mesh file), the skin in two flat tones (back and belly), armour a little lighter, the cleft dark. The formulas
   for the parts are below under "Surface". This shader is thrown away later, so keep it short.
3. Leave the orbit of the old vertex shader as it is. Take the old mouth movement out for now (the parts have new
   aux values): the mouth stays shut in this stage.
4. `node tools/turntable.mjs devonian dunkleosteus stage1`. Put the nine views next to
   `ref/dunkleosteus-reference.png`.
5. They must match view for view: outline from the side, from above, from the front, the places of the fins, the
   tail. If a view does not match, the port is wrong (winding, a helper with the same name, aux). Fix the port, not
   the numbers.
6. **Stop. Show Mario the turntable.** No surface, no movement before he has seen the shape.

`curve()` is in `devonian/swimmers.js`. The mesh function keeps its helpers inside itself, because all files share
one scope and their names are short (`sm`, `at`, `skin`, `band`, `wing`). Keep them local.

## Stage 2: against the figures

The research note says the figures of E2024 were not measured. The paper is under CC BY 4.0, and its figures are on
Wikimedia Commons, which answers to tools where the page of the journal did not. Search Commons for:

- "Dunkleosteus terrelli 2024 reconstruction" (the life reconstruction, Fig. 4)
- "Dunkleosteus terrelli skull and thoracic armour reconstructions" (the armour, Fig. 3)
- "Arthrodire ventral shields" (the belly armour)

Save them to `tools/out/research/dunkleosteus/` (not in Git), read them, and lay the side view of stage 1 next to
the life reconstruction at the same length. Then write a table into the research note: place (s), what the mesh
has, what the figure has. Cover at least: the outline of the back and of the belly at ten places, the place and
size of the eye, the line and the corner of the mouth, the rear rim of the armour on the flank, where the belly
armour begins, the outline and height of the dorsal fin, the outline of the tail fin, the depth of the tail stalk.

**Give Mario that table before changing a station.** He decides which differences are taken over. If Commons
cannot be reached, say so and ask Mario to save Fig. 3, 4, 13 and 18 into that folder.

## Stage 3: movement

All of it in the vertex shader, from the rest position `i.p` and aux. `sR` is s of the rest position.

```wgsl
fn dunkCleft(y: f32) -> f32 { return .193 - .9 * max(0. - .04 - y, 0.); }
// in vsDunkleosteus, before the body wave. dunkRotY with a positive angle turns the nose DOWN
let sR = .5 - i.p.z; let lt = i.n.w;
let isFin = step(.4, lt);
let isJaw = sat(step(abs(lt - .25), .04) + step(abs(lt + .40), .04) + step(abs(lt + .70), .04));
let wJ = (1. - ss(.106, .135, sR)) * ss(.004, .024, dunkCleft(i.p.y) - sR) * isJaw;
let wH = (1. - ss(dunkCleft(i.p.y) - .014, dunkCleft(i.p.y) + .010, sR)) * (1. - isFin);
let jawA = (.03 + .77 * mo) * wJ;            // the jaw drops about its hinge, first
let headA = 0. - .30 * mo * wH;              // then the head lifts about the joint of the neck
l = dunkRotY(l, vec3f(0., -.072, .365), jawA);
l = dunkRotY(l, vec3f(0., .085, .305), headA);
```

Turn the normals by the same two angles. `mo` is 0 with the mouth shut and 1 wide open: jaw 46° down, head 17° up,
63° between them (EA gives at least 65° to 70° for the gape; how it splits between jaw and head is an estimate).
The weights make the skin stretch at the cheek and at the cleft instead of tearing. The pectoral fins do not lift
with the head: they sit on the trunk armour. The reference picture shows this pose in its last view.

- **Mouth.** Shut most of the time (0.03). It opens fast and shuts slower, for about two seconds, every 25 to
  40 seconds, at a time of its own for each animal. Not a third of the time as now.
- **Swimming.** Stiff as far as s = 0.50 (E2024). Behind it the wave that is there now, with `u = max(0, -l.z)`,
  but with an amplitude that one sees: `A = .26 * u * u`, 0.065 body lengths at the tip of the tail (estimate).
- **Beat and speed belong together.** Now the animals move at 0.12 to 0.36 m/s and beat the tail 0.8 times a
  second: the tail works and the fish hardly moves. As a rule of thumb a fish moves 0.6 to 0.7 of its length per
  beat (not checked against a source). Proposal: 0.5 to 0.8 m/s on the orbit and a beat of speed / (0.65 × length),
  about 0.3 a second. The zoo function reads the same speed, so the place of the card follows.

## Stage 4: surface

Colour is not known for any placoderm. Mario's line for the era stands: plausible, calm, readable. Take the map of
the parts from here. It was used for the reference picture.

```wgsl
// in fsDunkleosteus. Parts by aux
let hullP = step(-.13, lt) * step(lt, .35); let finP = step(.4, lt);
let mouthP = step(-.47, lt) * step(lt, -.13); let boneP = step(-.85, lt) * step(lt, -.47); let eyeP = step(lt, -.9);
// the place on the body, from the rest position
let s = .5 - i.op.z; let y = i.op.y;
let v = sat((y + .128) / .261);                                  // 0 at the belly, 1 at the back
let g = dunkCleft(y);
let my = 0. - .010 - .044 * pow(sat(s / .106), 1.3);             // the line of the mouth
let q = (v - .27) / .10;
let rear = .33 + .07 * ss(.6, 1., v) - .07 * exp(0. - q * q) + .12 * (1. - ss(.02, .16, v));   // rear rim of the armour
let lip = (1. - ss(.004, .010, abs(y - my))) * step(s, .112);
let soft = max(max(lip, 1. - ss(.006, .016, s)), ss(.004, -.004, y - my) * step(s, .137));     // lips, snout tip, jaw
let headP = ss(.004, .009, g - s) * (1. - soft);
let trunkP = ss(.004, .009, s - g) * ss(0., .006, rear - s);
let armP = sat(headP + trunkP) * hullP;
let c1 = (s - g) / .0042; let cleftP = exp(0. - c1 * c1) * hullP;
let ed = length(vec2f(s - .056, y - .022));                      // eye: pupil below .0042, iris below .0085, ring outside
let nose = max(step(length(vec2f(s - .007, y - .022)), .0032), step(length(vec2f(s - .015, y - .031)), .0032)) * hullP;
```

The rear rim of the armour is a curve, not a ring: it reaches back to 0.40 on the back and to 0.45 on the belly,
and it is cut in to 0.26 low on the flank, behind the pectoral fin.

What the surface has, and how much of it:

| Thing | How | Limit |
|---|---|---|
| Back dark, belly pale | `ss(.30, .60, v)` between two colours | One soft border, no pattern |
| Armour | Lighter by 15%, a little cooler, more gloss than the skin. Smooth (E2024: no ornament) | No pits, no rings of growth |
| Armour stands proud | Relief +0.002 where `armP`, so the rim casts a small edge | |
| Sutures | Two on the trunk (v = 0.80 and v = 0.20). On the head only after stage 2 | Darker by 15% at most, relief 0.0015 at most |
| The cleft | Dark, `cleftP`. The groove is already in the mesh | |
| Naked skin | Matt. Fine folds across the body behind s = 0.5, by relief only | Relief 0.001 at most |
| Noise | One fine noise, the same in all directions, shown only near (`fine`) | Colour by 6% at most, relief 0.0008 at most |
| Lips | Darker by 20% | |
| Fins | Darker than the back, a little light through the thin rear edge | No rays in this pass |
| Bone blades | Pale bone, darker at the lip | No stripes |
| Inside of the mouth | Dark red brown, unlit apart from the fill light | |
| Eye | Ring pale, iris dark amber, pupil black, a glint | |
| Each animal | Tone by its seed, 10% at most. Scars later | |

Forbidden in this shader: `sin()` stripes on the body, a noise sampled with different scales along and across the
body, more than two terms of noise multiplied onto the colour, any multiplier that can fall below 0.6, black
channels. Those made the wood.

## Rules that matter here

- Do the stages in order and stop where it says so. Shape first, alone.
- Change a number of the mesh only with a source or after Mario said so, and say which. An outline that "looks
  better" is not a reason.
- Do not go back to `loft()`, `slab()` and `ball()` for this animal.
- Judge by the list below, yes or no, not by words like "much better".
- `swimmers_dunkleosteus.js` only, plus a line in `world.js` if the speed changes. The other animals come later, with
  the same two helpers (the body with a cut mouth, the wing) where they fit.
- Git is Mario's.

## Acceptance criteria

Each is a yes or a no on the turntable.

1. From the side the outline runs from the snout to the tail in one line. The only break is the cleft at 0.19.
2. The mesh is one unit long with the tail fin: print the least and the greatest z.
3. From the front the body is deeper than wide, about 1.25 to 1, with a round belly.
4. The tail stalk is the thinnest place. The tail fin is a crescent of two lobes, the upper one longer, taller
   than the body is deep.
5. The mouth is a line that ends in a corner below and behind the eye. Shut: two upper cusps show. Open: four
   cusps, a dark red inside, no hole through the head, no torn skin.
6. No part of a blade reaches past the snout.
7. The eye is a disc with ring, iris and pupil, set in the skin.
8. The pectoral fins are pointed, with a broad base that begins under the rear of the head. Seen from the front
   they have the section of a wing, not of a plank.
9. One small dorsal fin right behind the armour of the back, two pelvic fins, a small anal fin, a keel on each
   side of the tail stalk.
10. Back dark, belly pale, armour as smooth lighter plates with a curved rear rim. No grain, no stripes.
11. From below the body is closed and pale.
12. Every view matches `ref/dunkleosteus-reference.png` in outline, or the difference is in the table of stage 2
    and Mario agreed to it.
13. The tail beats in step with the speed. The front half does not bend.
14. Frame times as before the change (three animals of 14,286 triangles).

## Verification

```
node tools/turntable.mjs devonian dunkleosteus <name>     (at rest, and once with mo = 1)
node tools/poses.mjs devonian
node tools/bench.mjs devonian
node tools/wgsl.mjs
node tools/nogpu.mjs
```

The critic gets the turntable, `ref/dunkleosteus-reference.png` and the fourteen questions, and answers each with
yes or no and the view that shows it.

## Hand-over

After stage 1: the turntable, the least and greatest z, the count of triangles, what had to change in the port.
After stage 2: the table. After stages 3 and 4: the turntable at rest and open, a short film or three frames of the
swimming, the frame times, and what is still an estimate. Each time the changed files and a commit message.

## Not checked

- The reference mesh in the engine: winding against the light, `aux` after rounding to 8 bits (0.25, -0.40, -0.55,
  -0.70 leave room of 0.04 on either side), the shadow.
- The outline against the figures of E2024 (stage 2). The head may be too round and too deep, the rear rim of the
  armour is drawn from the description of the plates only.
- The numbers of E2024 were taken from the text of the page by a tool, not compared with the printed paper.
- Whether the three files named for Commons are complete and are the figures 3 and 4.
- The rule of 0.6 to 0.7 body lengths per beat.
- The sign of the old mouth movement was read from the code, not seen in a render.
- With the `Mesh` and `curve()` of the repo the mesh builds (7,457 vertices, 14,286 triangles). Six vertices get a
  normal of length 0, most likely at the tips of fins. If a tip shows a black dot, that is why.
