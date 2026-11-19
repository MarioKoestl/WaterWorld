# Dunkleosteus: jaws, and a mouth to look into

Mario, 2026-11-18, with a picture of the fourth version from in front, mouth open: "Make me jaws that really look
dangerous, and that one can look into, and I am content for now." In the picture the inside of the mouth is a black
box, the four fangs stand at the corners like those of a vampire, and a thin bright line runs across the floor.

This is the last step for the Dunkleosteus for now. Same method: take over, compile, compare, stop. Where this file
and `dunkleosteus-armour.md` differ, this file wins.

## What comes with this brief

| File | What it is |
|---|---|
| `docs/briefs/ref/dunkleosteus-mesh.js` | `meshDunkleosteus()`, fifth version |
| `docs/briefs/ref/dunkleosteus-shader.wgsl` | `S_DUNKLEOSTEUS`, fifth version, built on the text in the repo after the tuning of 2026-11-18 |
| `docs/briefs/ref/dunkleosteus-reference.png` | Eight views, two of them into the open mouth |

The mesh was run with the `Mesh` and `curve()` of the repo: 13,894 vertices, 27,188 triangles. The shader is the
text from `swimmers_dunkleosteus.js` as it was at 21:48, with the changes below; the tuned values (BONE .48, domes
.0070, joints .88 and .0040, relief 4.2, gloss .40 and .50) are kept. **Not compiled.** A script checked brackets
and declarations. The picture comes from the small renderer, not the engine.

## What changed

| What | How | From |
|---|---|---|
| The fangs | At the front, near the middle: the upper pair at the tip of the snout (s = 0.011), the lower pair just behind and inside them (s = 0.020). Larger: 0.054 and 0.048 long, 0.011 and 0.010 thick at the base | E2024, Fig. 3: the fang of the ASG sits at the tip of the snout, the hooked tips of the two IG at the front of the lower jaw. Sizes: estimate |
| The blades | Higher (0.0055 above the lip), a cusp of 0.015 above at s = 0.046, 0.017 below at s = 0.054 with a notch in front of it. The lower bar runs round the front of the jaw | Fig. 3 (PSG, IG), read by eye |
| A throat | A tunnel from the corner of the mouth back to the cleft (s = 0.185), narrowing, its roof with the head, its floor with the jaw. It replaces the flat wall | Estimate |
| Gill arches | Four ridges across the throat at s = 0.120, 0.137, 0.154, 0.171, red with blood | Four as in most fishes; not counted for Dunkleosteus |
| The roof | Four ridges across the roof of the mouth | Estimate |
| Colour inside | Flesh at the lips, darker the deeper it goes, never black. Wet | |
| The threat | The mouth opens to 0.95 instead of 0.85 | |
| The tip of the snout | Counts as armour from s = 0.006 (was 0.016): the rough dark patch over the lip is gone | |
| More points | MP = 12 (was 8) across roof and floor: the throat is round, not a hose | |

## Stage A: take over

1. Read `swimmers_dunkleosteus.js` as it is now. If it changed after 21:48, compare its shader with the reference
   and tell Mario what differs before going on.
2. Replace `meshDunkleosteus()` and `S_DUNKLEOSTEUS` by the two reference files. Change no number.
3. `node tools/wgsl.mjs devonian`. Fix only what the compiler names, smallest change, list every fix.
4. Turntable at rest, the snap, the threat with `--walk`, and Mario's view: in front of the head at the height of the
   mouth, about 2 m away, a little to the side, in the threat.
5. Look for the thin bright line across the floor of the mouth in Mario's picture. Say whether it is still there, and
   if it is, where it comes from (a gap between two parts of the mesh, or a highlight). Do not fix it without saying
   which.
6. `node tools/bench.mjs devonian`, before and after.
7. **Stop. Show Mario.**

## Rules that matter here

- Taken over, not written again. No teeth beyond two fangs and two cusps on each side.
- The size stays 3.4 to 4.1 m until Mario decides.
- `swimmers_dunkleosteus.js` only. Git is Mario's.

## Acceptance criteria

1. From in front the four fangs stand near the middle, upper ones in front, lower ones behind and inside them.
2. One can look into the mouth: a throat narrowing to the back, ridges on the roof, red gill arches, no black box.
3. From the side the blades show a cusp each, the upper fang hangs at the tip of the snout.
4. No hole from the mouth to the outside of the head, at rest, in the snap and in the threat.
5. Everything the tuning of 2026-11-18 set looks as it did.
6. Frame time reported before and after.

## Not checked

- The WGSL text was never compiled.
- The sides of the throat: where roof and floor meet behind the corner of the mouth, the two move differently. In
  the snap a slit may open there. It would show the inside of the cheek, which is dark, but check it.
- Whether the throat comes through the skin of the head anywhere when the jaw drops (it was checked at rest only).
- The bright line in Mario's picture: not found in the small renderer.
- Positions and sizes of fangs and blades: read by eye off Fig. 3, not measured.
