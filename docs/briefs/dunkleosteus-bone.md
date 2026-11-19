# Dunkleosteus: plates of bone, not teeth; bone, not plastic

Mario, 2026-11-19, with a picture of the fifth version and a life reconstruction as the look he wants: "Now I need
a better set of jaws. It looks like teeth now, but it had only plates of bone instead of teeth. That does not come
across. And the structure of the fish is still not bony enough, it still looks cheap, like plastic, not real."

This brief hands over a sixth version of mesh and shader, and a picture. Same method: take over, compile, compare,
stop. Where this file and `dunkleosteus-jaws.md` differ, this file wins.

## Why it looked like teeth and like plastic

| What one sees | Why |
|---|---|
| Teeth | The fangs were separate cones stuck on bars: the shape of a tooth. Dunkleosteus had none: its jaws are plates of bone (E2024, Fig. 3) |
| Ivory | The fangs were white with a dark root: the colour of enamel |
| Plastic | `skinWet()` adds a sheen on the smooth shape (`ns`, exponent 70) on top of the one on the relief. The tuning of 2026-11-18 raised it on the armour to 0.50. A broad, clean highlight over the whole shape is what plastic looks like. The small renderer of the reference pictures never had that term, so its pictures looked better than the engine |
| Smooth | Below the plates nothing at the size of centimetres: domes and lines, but no skin |

## What comes with this brief

| File | What it is |
|---|---|
| `docs/briefs/ref/dunkleosteus-mesh.js` | `meshDunkleosteus()`, sixth version |
| `docs/briefs/ref/dunkleosteus-shader.wgsl` | `S_DUNKLEOSTEUS`, sixth version, with its own light (`dunkLight`) |
| `docs/briefs/ref/dunkleosteus-reference.png` | Eight views: the jaws open in plain light, the skin from 1 m |

The mesh was run with the `Mesh` and `curve()` of the repo: 15,484 vertices, 30,376 triangles. The shader is the
text of the repo (the fifth version, as it was on 2026-11-19 07:06) with the changes below. **Not compiled.** A script
checked brackets and declarations. The picture comes from the small renderer, which now computes the light the same
way as `dunkLight`; its flecks of sunlight are a stand-in for `caus()`.

## The jaws

Read off Fig. 3 of E2024 (50 cm scale bar, a fish of about 4 m), by eye, not measured:

| Plate | Where | Shape | Size in body lengths |
|---|---|---|---|
| ASG, above, one on each side | At the tip of the snout, s = 0.003 to 0.024 | A broad flat plate that ends in a hook, bent down and back | Hook 0.030 below the lip at s = 0.010 |
| PSG, above, one on each side | Behind it, s = 0.025 to 0.070 | A blade with a straight cutting edge | 0.016 below the lip at the front, less behind |
| IG, below, one on each side | The rim of the lower jaw, s = 0.006 to 0.088 | A long bar, its front bent up into a hook, a notch behind the hook, then a cutting edge | Hook 0.024 above the lip at s = 0.012, blade 0.013 |

Each plate is solid: in section a wedge, 0.007 to 0.009 thick at the gum (2.6 to 3.3 cm at 3.7 m), sharp at the edge.
Its upper part is in the gum. The cones and the bars of the fifth version are gone.

Colour: the same bone as the armour, lighter where worn, grey brown at the gum, fine lines of growth along the edge,
pits. No white.

## The surface

| What | How |
|---|---|
| Skin over everything | Cracks that cut it into fields of many corners, each field a little domed, as on an elephant or a crocodile. Large fields of about 5 cm, small ones of about 1.7 cm in them (`dunkCrackle`, two scales). Deeper in some places, fainter in others. On the plates weaker than on the skin |
| Plate joints | A narrow groove between two raised lips of bone, not a dark painted line |
| Cavities | Grooves and cracks darken the colour and the light from around (`ao`) |
| Colour | Bone grey with ochre and olive in it; skin nearly black with olive and brown in it; three scales of mottling |
| Sheen | On the surface with its relief only, broad and weak, broken by noise and by the cavities. Wet only in the mouth, on the eye, a little on the jaws |
| Sunlight | The flecks of the surface (`caus()`, as for the Kentuckia) on the sun's part |
| Inside the mouth | Darker red, soft folds along it |
| Removed | `skinWet()` for this animal, the worn light bands along the plate edges, the short cracks of the bone, the fine net of cells |

Tuned values of 2026-11-18 that are kept: `BONE`, `SKIN`, `BELLY`, relief `* 4.2`. Values that changed on purpose:
domes 0.0070 to 0.0050 (the skin now carries detail of its own), joints as described.

## Stage A: take over

1. Read `swimmers_dunkleosteus.js` as it is now. If its shader differs from the fifth reference, list what differs
   before going on.
2. Replace `meshDunkleosteus()` and `S_DUNKLEOSTEUS` by the two reference files. Change no number. Update the list of
   `aux` at the head of the file: -0.55 and -0.70 are now the plates of the jaws.
3. `node tools/wgsl.mjs devonian`. Fix only what the compiler names, smallest change, list every fix. Likely places:
   `dunkCrackle` (the loops, `h33`), `dunkLight` (whether `caus`, `shadow4`, `side` are known in this module).
4. Turntable at rest, the snap, the threat with `--walk`, Mario's two views (from the side and from in front, 2 m,
   in the threat), and one from 1 m at the side of the head.
5. Put them next to `ref/dunkleosteus-reference.png`.
6. `node tools/bench.mjs devonian`, before and after. The fragment shader now has two cell noises of 27 points each
   near the camera. If the frame time rises by more than 0.5 ms, report it before changing anything.
7. **Stop. Show Mario.**

## Tuning, after Mario has seen it

Only these: the strength of the cracks (`.0011`, `.4`), the sheen (`.22`, `.10`, shin `10.` and `12.`), the share of the
flecks of sunlight (`.45 + .55 *`), `BONE`, `SKIN`. Each with before and after from the same view.

## Rules that matter here

- Taken over, not written again. No teeth: the plates of the jaws are bone, the same as the armour.
- Do not go back to `skinWet()` for this animal.
- The size stays 3.4 to 4.1 m until Mario decides.
- `swimmers_dunkleosteus.js` only. Git is Mario's.

## Acceptance criteria

1. The jaws read as plates of bone with hooks, a beak: no cone, no white, nothing that reads as a tooth.
2. From in front: above the two ASG with their hooks near the middle, below the two IG with theirs.
3. From 1 m: the skin is cut into fields by cracks, the plates have raised edges with a groove between.
4. From 10 m: no flicker, the body is not one smooth colour.
5. No broad clean highlight over the shape anywhere: the sheen is broken.
6. Flecks of sunlight move over the back.
7. The mouth: darker, folds, red gill arches, no hole.
8. Frame time reported before and after.

## Not checked

- The WGSL text was never compiled.
- `caus()` in this module: it is in the `LIGHT` of the Devonian and the Kentuckia uses it, so it should be known.
- How the light of the engine renders the new sheen and the flecks: the small renderer only imitates it.
- The plates of the jaws against Fig. 3: by eye, not measured. Whether they cut through each other in the snap at
  other angles than the ones drawn.
- The red cheek walls in the open mouth are still flat. They are a strip of skin between the lips (fourth version).
- The cost of 30,376 triangles per animal and of the cell noises.
