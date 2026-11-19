# Dunkleosteus: armour, and fangs that are not paper

Mario, 2026-11-18, with a picture of the third version in the engine, mouth open: "The teeth still look like
paper, and the whole thing looks dorky rather than frightening. That these should be bone plates, an armour, does
not come across either."

The third version went into the engine unchanged and compiled without a fix. So the faults are in the design, not
in the port. This brief hands over a fourth version of mesh and shader, and a picture. Same method: take over,
compile, compare, stop. Where this file and `dunkleosteus-danger.md` differ, this file wins.

## What was wrong, read off Mario's picture

| What one sees | Why |
|---|---|
| Teeth like paper | The blades were wedges of three rows of points, the fangs the high points of those wedges: a flat sheet with no volume, one colour, lit like a card |
| Dorky | The mouth hung half open at rest like a box with straight edges. The eye had a pale ring: a cartoon eye. The lateral line was a row of dots and read as stitching, so the armour looked like a leather ball |
| No armour | Plates (albedo 0.165) and skin (0.058) were both dark, and the plates had no thickness: nothing said "hard shell" |

## What comes with this brief

| File | What it is |
|---|---|
| `docs/briefs/ref/dunkleosteus-mesh.js` | `meshDunkleosteus()`, fourth version. Replaces the third |
| `docs/briefs/ref/dunkleosteus-shader.wgsl` | The whole text of `S_DUNKLEOSTEUS`, fourth version |
| `docs/briefs/ref/dunkleosteus-reference.png` | Ten views, among them the threat from the angle of Mario's picture. Replaces the third |

The mesh was run in Node with the `Mesh` and `curve()` of the repo: 13,213 vertices, 25,826 triangles (the third had
14,706). Three animals: about 78,000. The fragment shader was written twice, in WGSL and in numpy; the picture comes
from the numpy one. **The WGSL has not been compiled.** A script checked brackets and that every name is declared
before it is used. The picture is not the engine: no shadow, water light only roughly.

## What changed

| What | How | From |
|---|---|---|
| The fangs | Solid hooked cones, oval in section, 3 cm thick at the base at 3.7 m. Upper one at s = 0.014, 0.047 long, hooked down and back. Lower one at s = 0.030, 0.041 long, hooked up and back | Fig. 3C of E2024, read roughly. Thickness: estimate |
| The jaws | Solid bars of bone along both lips, six points in section, with a second cusp behind each fang (s = 0.046 above, 0.052 below). They stand out of the lip by 0.004 to 0.006 | The plates PSG, ASG and IG, Fig. 3 of E2024. Sizes: estimate |
| The mouth at rest | Nearly shut (jaw 7°, head 1°): the fangs cross over the lips. Wide open only in the snap and the threat, as before | Free. Fig. 4 shows it open: Mario's picture shows that open at rest reads as slack |
| Armour with a thickness | Where the shader draws plates, the skin of the mesh stands out by 0.005 (1.8 cm). The rim of the trunk armour and the edge of the head shield over the lip are real steps | Bone 1 to 2.5 cm thick (research note). The map: the same as `armP` in the shader |
| More rings | Every 0.004 as far as 0.50 (was 0.01 behind the head), 62 points round (was 44): the steps need them | |
| A heavier ridge over the eye | 0.011 out, from s = 0.02 to 0.08 | Estimate |
| The snout overhangs | The lower jaw is 0.006 shorter at the front, the chin falls back under the snout | Estimate |
| Bone against skin | Plates pale grey bone (0.34), skin nearly black (0.045). The belly pale only behind the head | Free. E2024: colour not known |
| Plates as plates | Each a dome 0.0055 high, joints 0.0032 deep and dark, edges worn light, gouges, few short cracks. A little sheen on the bone, the skin dull | Plates schematic after Fig. 3 and 4 |
| The eye | Ring of bone stained dark, a narrow dark amber iris, black pupil, a dark mask round it | Ring: E2024. Colour: free |
| Removed | The row of dots along the lateral line (now a shallow groove), the arc of punctures on the cheek (also read as dots), the pale ring round the eye | |

## Stage A: take over

1. Read `swimmers_dunkleosteus.js` as it is now.
2. Replace `meshDunkleosteus()` by `ref/dunkleosteus-mesh.js`, and `S_DUNKLEOSTEUS` by `ref/dunkleosteus-shader.wgsl`.
   Change no number.
3. `node tools/wgsl.mjs devonian`. Fix only what the compiler names, each with the smallest change. List every fix.
4. Turntable: at rest, the snap (`mo` forced to 1), and the threat with `--walk` from the diver view. Take the
   forcing out again. In addition one picture from where Mario took his: in front of the head, a little to the side,
   about 2 m away, mouth in the threat.
5. Put the views next to `ref/dunkleosteus-reference.png`.
6. `node tools/bench.mjs devonian`. The mesh has 75% more triangles than before. Report the frame time before and
   after.
7. **Stop. Show Mario the turntable next to the reference picture.**

After Mario has seen it: tuning as before, only the colours (`BONE`, `WORN`, `SKIN`, `BELLY`), the strength of joints,
wear and gouges, `hgt * 3.7`, and the two rows of gloss. Each with before and after from the same view.

## Rules that matter here

- Taken over, not written again. No new noise, no `sin()` on the body, no `h31()` as a pattern.
- No teeth that Dunkleosteus did not have. Two fangs and two smaller cusps on each side, nothing more.
- The size of the animals stays 3.4 to 4.1 m until Mario decides otherwise.
- `swimmers_dunkleosteus.js` only. Git is Mario's.

## Acceptance criteria

Yes or no, each with the view that shows it.

1. The fangs are solid from every side: round, with light and shade, no edge on that shows them as a sheet.
2. The jaws are rims of bone with a cusp behind each fang, not a strip of paper.
3. At rest the mouth is nearly shut and the upper fangs hang over the lower jaw. In snap and threat it opens wide.
4. The armour reads as a shell: pale plates against a dark body, a step at the rim, dark joints, worn edges.
5. No dots that read as stitching anywhere.
6. The eye is dark, sunk under a ridge, in a dark mask. No pale ring.
7. From the side no view through the open mouth.
8. No flicker from 10 m.
9. The three animals differ in tone and in where their gouges are.
10. Frame time reported before and after.

## Not checked

- The WGSL text was never compiled.
- The light of the engine: how pale the bone comes out in the green water. That is the tuning.
- The steps of the armour in the mesh follow the map of the shader, but were computed separately: where they disagree
  by a few millimetres, the colour edge and the step will not lie exactly on each other.
- Fangs and bars against Fig. 3: read by eye, not measured.
- Whether the fangs cut through the lips or through each other in the snap at other angles than the ones drawn.
- The cost of 25,826 triangles per animal in the shadow pass.
