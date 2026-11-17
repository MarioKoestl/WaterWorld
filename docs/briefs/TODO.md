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

- [ ] **8. The rest of the Cambrian.** `era-cambrian.md`, the stages that are not done yet. The walkers are in
  (2026-11-16). Mario: the trilobites look flat. They are rebuilt in item 9, stage 3, and this item is done with it.
- [ ] **9. The look of the Cambrian.** `cambrian-look.md`. Beside `today` it looks empty and flat (Mario, 2026-11-16):
  light, water, ground and far more life. Stage 1 is one picture in three moods, from which Mario picks.
  In progress: stage 1 is made (`tools/out/moods/final/index.html`). Mario's pick: mood B, golden green
  (2026-11-16). He accepted every proposal of the brief, also W3, B6, P2 and C2, and asked for better animals: the
  trilobites look flat. The brief has a new section for that, "The animals" (K1 to K9). Stage 2 (light and water in
  mood B) is made (2026-11-17, `tools/out/look2/index.html`), and Mario is fine with it (2026-11-17). Stage 3, the
  animals: the trilobite is rebuilt in the round (what is known of its shape: `tools/out/research/olenoides.md`) and
  waits for Mario's look (`tools/out/look3/index.html`: its turntable before and after, and the animal in a garden
  as a fish and as a diver). No other kind is reworked before he has seen it. Then the other kinds, each with its
  turntable first (K8), and at the end of the stage the six poses and the flight for the visual critic.
- [ ] **10. The other eras.** `era-common.md` and `era-<id>.md`. The Cambrian comes first and is the era on which
  everything above is built and tried. Only when Mario has accepted it come the next ones, in order of time: the
  Ordovician (`era-ordovician.md`) first. The Hadean, the Archean and the Proterozoic are skipped (Mario,
  2026-11-16). Only one instance renders at a time: the graphics card is shared (`node tools/chrome.mjs status`).
  The plesiosaur leaves `today` with the Jurassic (`era-jurassic.md`).
