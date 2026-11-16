# Brief: no viewpoints in the game

Mario does not need the viewpoints in the game. The keys `1` to `6` leave the published pages. The six poses
themselves stay: they are the fixed poses of every check, the player starts at the first one, and the world is laid
out around them.

- **Asked for by:** Mario, 2026-11-16.
- **Order:** item 3 of `TODO.md`.
- **Files expected to change:** `source/template.html`, `source/engine/main.js`, perhaps `source/engine/dev.js`,
  the tools that press `1` to `6` or read the poses (`accept.mjs`, `poses.mjs`, `kinds.mjs`, `ways.mjs`, `inpage.js`,
  `generator.cjs`: check each), `CLAUDE.md`, `README.md`, `tools/README.md`.

Read `CLAUDE.md` first. Its facts and working rules apply to every line below.

## What the player gets

1. In `index.html` and in every `<id>.html` the keys `1` to `6` do nothing.
2. The list of controls in the title menu no longer names them.
3. The game starts where it starts now, at the first pose.
4. Nothing else changes: world, light, zoo, sound.

## What stays, and why

The six poses of an era (`ERA.views`) stay in the era's folder, unchanged, for three reasons:

- **Checking.** The visual critic of `CLAUDE.md` gets six fixed camera poses per era, and the renders from before
  and after a change are compared at these poses. That is how anyone sees whether a world has changed. Without them
  there is no visual gate.
- **The start.** `main.js` puts the player at the first pose (`lookAt(...VIEWS[0])`).
- **The world.** `makeTools` keeps the flight path and the poses clear of rock and plants, and `today` places
  things relative to them (barrel sponges in front of pose 4). Taking them out would change the world.

In the dev pages (`dev.html`, `<id>-dev.html`) the keys `1` to `6` stay: Mario and the tools use them to look at a
pose by eye.

## Decisions

| Decision | By |
|---|---|
| No viewpoints in the game | Mario |
| The six poses stay as data: for the checks, as the start, and because the world is laid out around them | Claude |
| The keys `1` to `6` stay in the dev pages | Claude |
| The field keeps its name `views`, so that no era folder, brief or tool has to change for a name | Claude |
| In docs and comments they are called test poses. Where a brief says viewpoint, it means a test pose | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## What to change

- **The page.** The handler for `Digit1` to `Digit6` in `main.js` goes to the dev pages only. How is yours to
  design: the dev pages already add `dev.js`. The engine still reads `ERA.views` for the start and for `makeTools`.
- **The menu.** The line for `1` to `6` (Viewpoints) in the list of controls goes. Check that the list still looks balanced
  (`tools/menu.mjs`).
- **The tools.** Every tool that pressed `1` to `6` in a published page now does it in the dev page, or sets the pose
  some other way. `accept.mjs` checks the new behaviour: `1` to `6` do nothing in the published page and jump in
  the dev page. The renders of `poses.mjs` must stay the same pictures as before.
- **The documents.** Rewrite in `CLAUDE.md` everything that says viewpoint: the keys under "Build and run", the
  table of `today`'s files, `views` in "Recipe: adding an era", the recipe's points 3 and 4, the line on `ways.mjs`
  and the bullet "Poses" under Verification. Say there that the six poses are test poses, that they are the fixed
  poses of the visual critic, that the player starts at the first one, that only the dev pages reach them with keys,
  and that "viewpoint" in a brief means a test pose. The same in `README.md` (the table of controls) and in
  `tools/README.md`.

## Rules that matter here

- **Nothing in any world changes.** The six poses of `today` and `cambrian`, rendered with `poses.mjs`, match the
  renders from before (`compare.mjs`). The benchmark is the same.
- **The engine names no era.** Nothing here is about one era.
- **No allocation per frame.**

## Acceptance criteria

1. In `index.html` and `cambrian.html` the keys `1` to `6` do nothing, and the menu does not name them.
2. In `dev.html` and `cambrian-dev.html` the keys `1` to `6` jump to the six poses as before.
3. Both games start at the first pose, as before.
4. The renders of `poses.mjs` for `today` and `cambrian` match those from before.
5. `nogpu.mjs`, `accept.mjs` and `timeline.mjs` run and check the new behaviour.
6. `CLAUDE.md`, `README.md` and `tools/README.md` describe the new state, and `CLAUDE.md` says what viewpoint means in
   a brief.
7. No new messages in the browser console. Both builds run.

## Verification

Nothing in the scene changes, so the visual gate is the comparison of the six poses before and after, per era. The
menu changes: give the critic the menu pictures of `menu.mjs` before and after.
The performance gate: the benchmark of `today`, which must not have changed.
