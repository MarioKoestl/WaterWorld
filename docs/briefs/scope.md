# Brief: one detail level, a computer only

The checks take Mario too long, and much of the time goes into things nobody uses. From now on the game has one
detail level, the highest, and runs on a computer only. Everything for the other levels and for phones leaves the
checks, and the levels leave the code.

- **Asked for by:** Mario, 2026-11-16.
- **Order:** item 1 of `TODO.md`. Every later item is cheaper after it.
- **Files expected to change:** `source/engine/quality.js`, `source/engine/main.js`, `source/engine/shaders.js`,
  `source/engine/tools.js`, the era files that ask for `LV` (`cambrian/standing.js`, `cambrian/swimmers.js`,
  `cambrian/world.js`, `today/setpieces.js`), `source/template.html`, the tools, `CLAUDE.md`, `README.md`,
  `tools/README.md`.

Read `CLAUDE.md` first. Its facts and working rules apply to every line below.

## What the player gets

1. The game is always built at the level that was called High. The menu has no detail buttons any more.
2. Nothing in the picture changes for someone who played on High.
3. The game is for a computer: Chrome or Edge, keyboard and mouse.

## Decisions

| Decision | By |
|---|---|
| One detail level, the highest of today | Mario |
| No phone and no touch screen, for now | Mario |
| Medium and Low leave the code, not only the menu: every `LV` branch keeps its High side | Claude |
| The touch controls and the phone layout of the menu stay in the code as they are. They are not checked, not extended and not repaired. They may break | Claude |
| The automatic lowering of the resolution when frames are slow stays. It is not a detail level: it keeps a slower graphics card at a steady frame rate | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## What to change

- **`quality.js`.** `LV` is always 0. Its guesses from `pointer:coarse` and `deviceMemory` go, and so does the step
  down after a load that crashed the tab (`abyssalLoad`), because there is no lower level to step down to. The
  constants `THIN`, `SHADOW`, `AA`, `WATER` and `RAYN` keep their High values. Whether `LV` stays as a name that is
  always 0 or goes completely is yours to decide; no branch for Medium or Low may remain.
- **Every `LV` branch** in the engine and in the era files keeps its High side, and the other side goes.
- **The menu.** The row `Detail: Low, Medium, High` goes. The remembered settings in `localStorage.abyssal` lose the
  level; what is left is what the automatic resolution needs.
- **The tools.** `wgsl.mjs` compiles for the one level. `accept.mjs` loses its checks for the levels. `touch.mjs` is no
  longer part of any run: say so in `tools/README.md`, and leave the file where it is. `menu.mjs` takes pictures
  only at window sizes of a computer, a full window and a low one.
- **The documents.** `CLAUDE.md`: the section "Scope" stays, without its last sentence, and `quality.js` in the table
  becomes what it is then. `README.md`: no levels, no phone. `tools/README.md`: as above.

## Rules that matter here

- **Nothing in any world changes at the level High.** The six test poses of `today` and `cambrian`, rendered with
  `poses.mjs`, match the High renders from before (`compare.mjs`). The benchmark is the same.
- **The world is deterministic.** Taking out a branch must not change the number of `rnd()` calls of the High side.
- **No allocation per frame.**

## Acceptance criteria

1. The menu has no detail buttons, and every page builds what High built before.
2. The renders of the six test poses of `today` and `cambrian` match the High renders from before.
3. No code path for Medium or Low is left in `source/`. Check by search for `LV`.
4. `wgsl.mjs`, `nogpu.mjs`, `accept.mjs` and `timeline.mjs` run. `touch.mjs` is in no list of runs.
5. `CLAUDE.md`, `README.md` and `tools/README.md` describe one level and a computer only.
6. No new messages in the browser console. Both builds run. The hand-over names the bundle size of each page.

## Verification

Nothing in the scene changes at High, so the visual gate is the comparison of the six test poses before and after,
per era, plus the menu pictures of `menu.mjs` before and after. The performance gate: the benchmark of `today` and of
`cambrian`, which must not have changed.
