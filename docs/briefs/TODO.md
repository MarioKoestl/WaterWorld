# What comes next

The order of work in WaterWorld. One item at a time, from the top, each with its own brief. Read `CLAUDE.md`, then
this list, then the brief of the item.

- An item is done when Mario has accepted its hand-over. Only then tick it (`[x]`) and add the date.
- While an item is being worked on, its line says "in progress".
- If an item shows that something else has to come first, add it to this list in the right place and say so in the
  hand-over.

## Before the eras

These change the engine. One Claude Code instance at a time, in this order.

- [x] **1. One detail level, a computer only.** `scope.md`. Only the highest level stays, no phone, no touch screen.
  Every later item has less to build and less to check after it. Done 2026-11-16.
- [x] **2. The Ediacaran in the list of eras.** In `source/eras.mjs` the Proterozoic ends at 635, and a new row
  `['ediacaran', 'Ediacaran', 635, 538.8]` follows it (`eras.md`, Mario's decision of 2026-11-15). Run
  `timeline.mjs` and `menu.mjs`: sixteen names have to fit. Small: it may go into the same hand-over as item 1.
  Done 2026-11-16.
- [x] **3. No viewpoints in the game.** `viewpoints.md`. The keys `1` to `6` leave the game, the six poses stay as
  test poses for the checks and as the start. Done 2026-11-16.
- [x] **4. Size on the zoo card.** `scale.md`, stage 1. Every card shows its exhibit next to a diver or a hand.
  Done 2026-11-16. Mario: the zoo reach of the small exhibits stays as it is.
- [x] **5. Three player sizes.** `scale.md`, stage 2. Diver, fish and shrimp, switched with `C` during play.
  Shrinking moves the player towards what it looks at. Done 2026-11-16. Mario: the collision stays as it is, no
  finer one for the shrimp.
- [x] **6. The Cambrian at true scale.** `scale.md`, stage 3. Mario decides after the first garden whether the rest
  follows: he has, it does (2026-11-16). Done 2026-11-16: the life stands in four gardens, and the scale suits Mario.


## Then

- [x] **8. The rest of the Cambrian.** `era-cambrian.md`, the stages that are not done yet. The walkers are in
  (2026-11-16). Mario: the trilobites look flat. They are rebuilt in item 9, stage 3, and this item is done with it.
  Done 2026-11-17: Mario accepted the rebuilt trilobite.
- [x] **9. The look of the Cambrian.** `cambrian-look.md`. Beside `today` it looks empty and flat (Mario, 2026-11-16):
  light, water, ground and far more life. Stage 1 is one picture in three moods, from which Mario picks.
  Mario's pick: mood B, golden green (2026-11-16). Stage 2 (light and water) done (2026-11-17). Stage 3: all animals
  rebuilt as solid 3D bodies after the trilobite pattern. Visual critic: 0 defects above minor. GPU avg 6.67 ms
  (RTX 2060, 2560×1440). Done 2026-11-17.
- [ ] **10. The other eras.** `era-common.md` and `era-<id>.md`. The Cambrian comes first and is the era on which
  everything above is built and tried. Only when Mario has accepted it come the next ones. The Hadean, the Archean
  and the Proterozoic are skipped (Mario, 2026-11-16). Only one instance renders at a time: the graphics card is
  shared (`node tools/chrome.mjs status`). The plesiosaur leaves `today` with the Jurassic (`era-jurassic.md`).
  Mario's order: the Devonian first (2026-11-17), not streng nach Zeit.
- [ ] **11. The animals of the Devonian from sources.** `devonian-models.md`. The models look bad (Mario, 2026-11-17):
  they were built from a few sentences. Every animal gets its sources, its figures in lengths of the body and a
  rebuild, as the trilobite did. Dunkleosteus first, and it goes to Mario before the others.
  - [ ] **11a. Dunkleosteus by the build sheet.** `dunkleosteus-build.md`, with a tested mesh and a picture of it in
    `ref/`. The model built from the list of numbers alone did not work (Mario, 2026-11-18). Four stages, the shape
    first and alone, and it goes to Mario after each.
  - [ ] **11b. Dunkleosteus surface.** `dunkleosteus-surface.md`: second mesh measured off Fig. 4 of E2024, the
    whole shader as text, a picture of both. Mario, 2026-11-18: the shape is right, colour, skin and plates missing.
  - [ ] **11c. Dunkleosteus dangerous.** `dunkleosteus-danger.md`: third mesh and shader. Mouth open at rest, the
    snap, the threat, a deep eye in a ring of bone, armour as old scarred bone. Size: Mario decides (sources: 3.4 to 4.1 m).
  - [ ] **11d. Dunkleosteus armour.** `dunkleosteus-armour.md`: fourth mesh and shader. Solid fangs and jaws of bone,
    plates with a thickness, pale bone against a dark body, mouth nearly shut at rest. Mario, 2026-11-18: paper teeth, dorky.
  - [ ] **11e. Dunkleosteus jaws.** `dunkleosteus-jaws.md`: fifth mesh and shader. Fangs at the front as a beak, higher
    blades, a throat with red gill arches to look into. After this Mario is content for now (2026-11-18).
  - [ ] **11f. Dunkleosteus bone.** `dunkleosteus-bone.md`: sixth mesh and shader. Jaws as plates of bone after Fig. 3
    (ASG, PSG, IG), no teeth; skin cracked into fields over bone; its own light instead of skinWet. Mario, 2026-11-19.
  - [ ] **11g. Titanichthys by the build sheet.** `titanichthys-build.md`: tested mesh, shader and picture in `ref/`,
    sources in `docs/research/devonian/titanichthys.md`. Wide flat head, mouth open to filter, body after Amazichthys.
  - [ ] **11h. How the giants swim.** `devonian-giants-motion.md`: new vertex shaders and zoo functions for
    Dunkleosteus and Titanichthys. Wandering paths, a pace of their own, tail beat from the speed, body curved in turns,
    moving fins; Dunkleosteus strikes every 70 to 120 s, no threat any more. Both 4.1 m. Mario, 2026-11-19: stiff.
  - [ ] **11i. Two motion bugs.** `devonian-motion-fixes.md`: the giants with a negative speed swam tail first (an
    error in 11h); the goniatites jumped back and forth with each jet. Mario, 2026-11-19.
  - [ ] **11j. Cladoselache by the build sheet.** `cladoselache-build.md`: tested mesh, shader with the motion and
    picture in `ref/`, sources in `docs/research/devonian/cladoselache.md`. Mouth at the front, two dorsal fins with a
    spine, no anal fin, keels, crescent tail; groups whose animals strike on their own. Mario, 2026-11-19.
  - [ ] **11k. Stethacanthus by the build sheet.** `stethacanthus-build.md`: tested mesh, shader with the motion and
    picture in `ref/`, sources in `docs/research/devonian/stethacanthus.md`. The brush, the head denticles and the
    claspers on mature males only; small pectoral fins with whips; a slow swimmer. Mario, 2026-11-19.
  - [ ] **11l. Ctenacanthus by the build sheet.** `ctenacanthus-build.md`: tested mesh, shader with the motion and
    picture in `ref/`, sources in `docs/research/devonian/ctenacanthus.md`. C. concinnus of the Cleveland Shale: two
    dorsal fins with ribbed spines, broad pectoral fins, one anal fin, a long upper tail lobe. Mario, 2026-11-19.
  - [ ] **11m. Four gaps.** `devonian-gap-fixes.md`: the slit under the Ctenacanthus tail, the floating stumps and the
    open end of the driftwood, the slot in the front of the Dunkleosteus jaw, the hook and the plain skin of the
    Titanichthys lower jaw. Mario, 2026-11-19.
  - [ ] **11n. Dunkleosteus hunts.** `dunkleosteus-hunt.md`: it cruises slowly and now and then, at no fixed beat,
    chases with the mouth half open and the fins laid back, snaps, brakes. Mario, 2026-11-19.
  - [ ] **11o. Titanichthys feeds in runs.** `titanichthys-feeding.md`: it cruises slowly with the mouth nearly shut
    and now and then, at no fixed beat, makes a faster run with the mouth wide open, then swallows. Mario, 2026-11-19.
  - [ ] **11p. Titanichthys tail.** `titanichthys-build.md`, section "Fix of 2026-11-19: tail stalk and lateral
    keels": the stalk ends in a point inside the tail fin, the keels are part of the skin. Mario, 2026-11-19.
  - [ ] **11q. Kentuckia by the build sheet.** `kentuckia-build.md`: tested mesh, shader with the motion and picture in
    `ref/`, sources in `docs/research/devonian/kentuckia.md`. An early ray-finned fish in general: rhombic shiny
    scales, a heterocercal tail, single fish darting out of the school. Mario, 2026-11-19.
  - [ ] **11r. Concavicaris by the build sheet.** `concavicaris-build.md`: tested mesh, shader with the motion and
    picture in `ref/`, sources in `docs/research/devonian/concavicaris.md`. The folded shell measured on the 3D
    reconstruction of C. submarinus, eyes, arms, paddles beating in a wave. Mario, 2026-11-19.
  - [ ] **11s. Driftwood by the build sheet.** `driftwood-build.md`: tested mesh and shader in `ref/`, sources in
    `docs/research/devonian/driftwood.md`. Fissured bark, splintered ends, sea lilies hanging under the floating logs,
    algae on top, mud on the sunk ones. Mario, 2026-11-19.
  - [ ] **11t. What has sunk.** `devonian-remains.md`: dead animals and empty shells on the floor, as extra instances
    of the kinds that exist, still, on their sides, half in the mud. Nothing living on the floor. Mario, 2026-11-19.
  - [ ] **11u. Driftwood v3, not plastic.** `driftwood-matte.md`: furrows in the mesh, matte under water, shade in
    the furrows, flaking plates, rough bare wood. Replaces meshDriftwood and S_WOOD whole. Mario, 2026-11-19.
  - [ ] **11v. Dunkleosteus 2.0.** `dunkleosteus-v2.md`: light from above, no shine, colour follows relief, form in
    the mesh, soft motion. Three sessions: A+B (done), B2 (cells, ink lines, colour, eye, blades), then C+D.
    Checked in the engine with turntable. Mario, 2026-11-23.
- [ ] **12. The Ordovician.** `era-ordovician.md`, version 2 (2026-11-23): facts checked, "How to work", "The look"
  and "Build notes" added. Five stages, a stop after each. Mario left the Devonian as it is. Mario, 2026-11-23.
