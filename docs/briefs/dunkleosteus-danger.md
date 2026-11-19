# Dunkleosteus: dangerous

Mario, 2026-11-18, with a picture of the model after `dunkleosteus-surface.md` and a stock illustration as the
mood he wants: "Now it has to look much more dangerous, and not like it is now." The model looked like a smooth
black rubber fish: glossy, clean, with a soft pale belly and a pale spot on the cheek.

This brief hands over a third version of the mesh and of the shader, and a picture of both. Same method as the two
before: take over, compile, compare, stop. Where this file and `dunkleosteus-surface.md` differ, this file wins.

The stock picture is a mood, not a source. It shows rows of teeth: Dunkleosteus had none, only the blades of bone
with one fang at the front of each (E2024, Fig. 3). Do not add teeth. Do not copy the picture into the repo.

## What comes with this brief

| File | What it is |
|---|---|
| `docs/briefs/ref/dunkleosteus-mesh.js` | `meshDunkleosteus()`, third version. Replaces the second |
| `docs/briefs/ref/dunkleosteus-shader.wgsl` | The whole text of `S_DUNKLEOSTEUS`, third version |
| `docs/briefs/ref/dunkleosteus-reference.png` | Nine views of both, and a diver of 1.8 m to scale. Replaces the second |

The mesh was run in Node with a copy of `Mesh` and `curve()`: 7,711 vertices, 14,706 triangles. The fragment shader
was written twice, in WGSL and in numpy, and the picture comes from the numpy one. **The WGSL has not been
compiled.** A script checked brackets and that every name is declared before it is used. The renderer of the picture
is not the engine: no shadow, no fog over distance, water light only roughly.

## What makes it look dangerous

| What | How | From |
|---|---|---|
| The mouth is never shut | Open by about 18 degrees at rest, so the four fangs show | E2024, Fig. 4 draws it so |
| It snaps | Every 12 to 25 s: open in 0.06 s, hold 0.25 s, shut in 0.12 s | Anderson and Westneat 2007: it opened its jaws in a fiftieth of a second |
| It threatens the diver | While the viewer is in front of it and closer than 9 m, the mouth stays wide open | Free |
| Longer, sharper fangs | Upper fang 0.040 below the lip, lower 0.035 | Read roughly off Fig. 3C of E2024 (about 0.03 to 0.035) |
| The eye sits deep | A ridge of bone over it, the eye a small dome inside a raised ring of bone, a narrow amber iris | Ring: E2024 (a cup-shaped sclerotic ring that bulges out). Ridge, colour: estimate |
| Armour as old bone | Olive grey, lighter than the skin, each plate a low dome with a dark joint and a worn light edge, short cracks, stains, pores | Plates schematic after Fig. 3 and 4. Weathering: free |
| Scars | Two rakes of gouges, and an arc of five healed punctures on the cheek plate, placed by the seed | Scott and others 2012: possible bite marks of another arthrodire on a suborbital plate of Dunkleosteus |
| Dull, not glossy | Gloss on bone and skin cut to a fifth. Only blades, eye and mouth are wet | |
| Skin | Dark olive brown with large dark blotches, the belly a dirty pale with a ragged border | Free. E2024: colour not known |
| A cheek | Skin between the lips from 0.04 behind the snout to the corner, coloured as the inside of the mouth. Without it one sees through the open mouth | E2024 and EA: soft tissue at the mouth, a loose cheek |

Gone: the toothed border of the belly, the pale spot on the cheek, the pale lower jaw, the pale pelvic and anal fins
(the scheme of Fig. 4), the black rubber.

## Stage A: take over

1. Read `swimmers_dunkleosteus.js` as it is now. Note what was changed in stage A of `dunkleosteus-surface.md`
   (at least `patch` became `ptch`) and keep such fixes in mind for the new text.
2. Replace `meshDunkleosteus()` by `ref/dunkleosteus-mesh.js`, and `S_DUNKLEOSTEUS` by `ref/dunkleosteus-shader.wgsl`.
   Change no number.
3. `node tools/wgsl.mjs devonian`. Fix only what the compiler names, each with the smallest change. List every fix.
4. Turntable three times: at rest, with `mo` set to 1 for a moment (the snap), and once with `--walk` from the diver
   view so the threat shows. Take the forcing out again.
5. Put the views next to `ref/dunkleosteus-reference.png`.
6. `node tools/bench.mjs devonian`. The fragment shader has more noise than before (about seven calls of `fbm`). If the
   frame time of the era rises by more than 0.3 ms, report it before changing anything.
7. **Stop. Show Mario the turntable next to the reference picture.**

After Mario has seen it, the same tuning as stage B of `dunkleosteus-surface.md`: only the colours (`BONE`, `WORN`,
`SKIN`, `BELLY`), the strength of joints, wear and scars, `hgt * 3.7`, and the two rows of gloss. Each with before
and after from the same view.

## Rules that matter here

- The shader is taken over, not written again. No new noise, no `sin()` on the body, no `h31()` as a pattern.
- No teeth that Dunkleosteus did not have.
- The size of the animals stays 3.4 to 4.1 m until Mario decides otherwise (see below).
- `swimmers_dunkleosteus.js` only. Git is Mario's.

## Size

Mario: "Bigger too, next to the diver that is not 3 m, I think." The code says it is: `world.js` gives each animal
3.4 to 4.1 m (`rr(3.4, 4.1)`), the vertex shader multiplies the one unit long mesh by that, a diver is 1.8 m. So
each is about twice as long as the diver and about 1 m deep. That is the size from the sources (E2023: 3.4 m
typical, 4.1 m the largest). Older books said up to 10 m. The reference picture has a diver to scale. **Mario
decides** whether it stays at the sources' size or gets bigger than they say. Change nothing until then.

## Acceptance criteria

Yes or no, each with the view that shows it.

1. The mouth is open at rest and the fangs show from the side and from the front.
2. The snap is fast: open in about 4 frames, shut in about 7.
3. With the diver in front and closer than 9 m, the mouth stays wide open. Behind it or far away it does not.
4. From the side no view through the open mouth: the cheek closes the sides.
5. The eye sits deep under a ridge, inside a ring of bone.
6. The armour reads as plates of old bone: domes, dark joints, light worn edges, cracks, scars. Lighter than the skin.
7. Nothing on the body is glossy except blades, eye and the inside of the mouth.
8. The skin is blotched, the belly pale with a ragged border. No zigzag, no pale spot on the cheek.
9. No flicker from 10 m.
10. The three animals differ in tone and in where their scars are.
11. Frame time as before, or the difference is reported.

## Not checked

- The WGSL text was never compiled.
- The light of the engine. How light the bone and how dark the skin come out there is the tuning after stage A.
- Whether `g.cam` is the viewer in every pass the animal is drawn in. In the shadow pass it may be the sun: then the
  shadow would show the threat at other times than the animal. `dodge()` has the same question.
- The fangs: Fig. 3C was read by eye, about 0.03 to 0.035 body lengths, not measured.
- Scott and others 2012 is a conference abstract and says "possible" bite marks.
- The plates are schematic. Fig. 3 and 4 were not traced line by line, and there is no figure of the roof or the
  belly among the ones read.
- The threat distance (9 m) and angle are free choices.
