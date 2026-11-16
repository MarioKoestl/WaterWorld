# What comes next

The order of work in WaterWorld. One item at a time, from the top, each with its own brief. Read `CLAUDE.md`, then
this list, then the brief of the item.

- An item is done when Mario has accepted its hand-over. Only then tick it (`[x]`) and add the date.
- While an item is being worked on, its line says "in progress".
- If an item shows that something else has to come first, add it to this list in the right place and say so in the
  hand-over.

## Before the eras

These change the engine. One Claude Code instance at a time, in this order.

- [ ] **1. One detail level, a computer only.** `scope.md`. Only the highest level stays, no phone, no touch screen.
  Every later item has less to build and less to check after it.
- [ ] **2. The Ediacaran in the list of eras.** In `source/eras.mjs` the Proterozoic ends at 635, and a new row
  `['ediacaran', 'Ediacaran', 635, 538.8]` follows it (`eras.md`, Mario's decision of 2026-11-15). Run
  `timeline.mjs` and `menu.mjs`: sixteen names have to fit. Small: it may go into the same hand-over as item 1.
- [ ] **3. No viewpoints in the game.** `viewpoints.md`. The keys `1` to `6` leave the game, the six poses stay as
  test poses for the checks and as the start.
- [ ] **4. Size on the zoo card.** `scale.md`, stage 1. Every card shows its exhibit next to a diver or a hand.
- [ ] **5. Three player sizes.** `scale.md`, stage 2. Diver, fish and shrimp, switched with `C` during play.
- [ ] **6. The Cambrian at true scale.** `scale.md`, stage 3. Mario decides after the first garden whether the rest
  follows.
- [ ] **7. Is the world of today at true scale?** `scale.md`, stage 4. A table for Mario. `today` changes only with
  his answer.

## Then

- [ ] **8. The rest of the Cambrian.** `era-cambrian.md`, the stages that are not done yet.
- [ ] **9. The other eras.** `era-common.md` and `era-<id>.md`, one instance per era, several at the same time. Mario
  picks which. Only one instance renders at a time: the graphics card is shared (`node tools/chrome.mjs status`).
  The plesiosaur leaves `today` with the Jurassic (`era-jurassic.md`).
