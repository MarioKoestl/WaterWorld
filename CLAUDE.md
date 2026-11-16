# WaterWorld

Historic Ocean: a procedural underwater world for the browser, drawn with WebGPU, as a journey through the eras of
the Earth. No game engine, no asset files: terrain, plants, animals, textures and sound are all computed by code.
Started as a copy of [Noniv/abyssal-garden](https://github.com/Noniv/abyssal-garden) (MIT). Owner: Mario.

Read this file completely before changing anything.

## Scope

Decided by Mario on 2026-11-16, so that work is not spent on what nobody uses:

- **A computer only.** Chrome or Edge, keyboard and mouse. No phone, no touch screen.
- **One detail level**, the one that was called High. There is no Medium and no Low.

Build and check nothing for phones, touch or lower detail levels, also where an older brief asks for it. Until item
1 of `docs/briefs/TODO.md` is done the code still has them: leave them alone until then.

## Where things are

The game is one page per era. A page is the shared engine plus the folder of one era.

| File | What's inside |
|---|---|
| `source/eras.mjs` | The eras: id, name, dates. The only list of them, read by the build |
| `source/build.mjs` | Writes one page for every folder under `source/eras/`, with the timeline of the title menu |
| `source/template.html` | The page around the scene: title menu, zoo hint and card |
| `source/engine/quality.js` | Detail level (Low, Medium, High), chosen before anything is built |
| `source/engine/math.js` | Random numbers, noise, surface nets, the `Mesh` builder |
| `source/engine/tools.js` | `kind()`, the tools an era scatters its world with, packing for the graphics card, rock meshes |
| `source/engine/shaders.js` | The engine's part of all WGSL shaders, with the era's pieces spliced in |
| `source/engine/zoo.js` | Zoo: finding what the player looks at, the hint and the card |
| `source/engine/main.js` | WebGPU setup, loading stages, the frame (`render()`), controls, collision |
| `source/engine/audio.js` | Synthesized soundscape, in the mood the era asks for |
| `source/engine/dev.js` | Fly-through and benchmark, only in the dev pages |
| `source/eras/<id>/` | One era: everything that makes its world. See "Recipe: adding an era" |
| `tools/` | Checks for the pages: acceptance run, touch run, timeline, menu pictures, renders, benchmark. See `tools/README.md` |
| `docs/briefs/` | Task briefs: one feature each, with decisions, acceptance criteria and how to verify. `TODO.md` there is the order of work: read it before you start a task |

Two eras have a folder: `today`, and `cambrian`, which is being built in stages (`docs/briefs/era-cambrian.md`):
so far its place, its light, what stands still in it and what swims (the walkers are still to come). The files of
`today`, in `source/eras/today/`:

| File | What's inside |
|---|---|
| `about.txt` | The sentences about the era in the title menu (70 words at most) |
| `era.js` | `ERA`: viewpoints, camera path, sun, exposure, swim limits, loading texts, sound, `tick()` |
| `air.js` | `AIR`, `LIGHT`: colours of water and light, the flecks of sunlight, what is above the world (WGSL) |
| `floor.js` | `FLOOR`: the rock masses and the density function of the sea floor |
| `look.js` | `LOOK`: what solid things and leaves look like (WGSL) |
| `sealife.js` | Mantas, plesiosaur, fish: meshes, shaders, where they are for the zoo |
| `setpieces.js` | Meshes of corals, the whale fluke and the ship |
| `world.js` | The kinds (what is drawn) and `makeWorld` (where it stands) |
| `zoo.js` | `ZOO`: the zoo texts with their sources |

## Build and run

Run from `source/` in PowerShell. Node.js 18 or newer.

```powershell
npm install               # once
npm run build:readable    # unminified pages, use this while developing
npm run build             # minified pages, for publishing
npm run build:dev         # dev pages with F (fly-through) and B (benchmark)
```

Each command writes one page per era into the repository root: `index.html` for `today` and `<id>.html` for every
other era, as dev pages `dev.html` and `<id>-dev.html`. Then open `index.html` in Chrome or Edge. Keys: `1` to `6`
jump to the viewpoints, `H` shows frame and GPU times, `Esc` opens the menu, where the timeline leads to the other
eras.

## Facts that save time

- **The engine names no species, no place, no colour of water and no viewpoint.** All of that is the era's. If an
  era needs something the engine cannot do, extend the engine in general terms. Check by search: nothing from an
  era's folder (`manta`, `kelp`, `POSES`, ...) appears under `source/engine/`.
- **One scope.** `build.mjs` joins the files of a page into a single async function, in this order: the engine's
  library (`quality.js`, `math.js`, `tools.js`), then every `.js` file of the era's folder in the order of their
  names, then the rest of the engine (`shaders.js`, `zoo.js`, `main.js`, `audio.js`, `dev.js`). There are no modules
  and no imports. Every top-level name is shared: an era's names must not collide with the engine's (two eras are
  never on the same page, so they may use the same names). What a file uses at its top level has to be defined in a
  file before it. Inside functions everything can be used.
- **WGSL is minified by a regex** (in `build.mjs`), not by a parser. Inside `/*wgsl*/` strings: `//` always starts a
  comment up to the end of the line, and spaces around operators are removed. Never write `a - -b` or `a + +b`
  (they turn into `--` and `++`). Every `/*wgsl*/` string is minified on its own, so a piece that an era hands to
  the engine has to begin and end at a whole statement. Always test the minified build too.
- **What an era draws is its list of kinds** (`kind()` in `tools.js`), drawn in the order they are declared. The
  engine builds the meshes, buffers and pipelines from that list and walks it in `render()`. Nothing is drawn by name.
- **The world is deterministic.** Each generator system starts with `rseed(n)`. An extra `rnd()` call inside a
  system changes everything after it in that system. Give a new system its own `rseed`.
- **No allocation per frame.** `frame()`, `render()`, `zoo()` and the era's `ERA.tick()` reuse preallocated arrays.
  Keep it that way. Do not hand a float to a function there: that can allocate.
- **Animation has no state.** Animals, plants and bubbles are placed by their vertex shader from the scene time
  (`g.cam.w`). JavaScript only writes the time into the uniform buffer.
- **Rock is a density field** (the era's `FLOOR.wgsl`), evaluated once by a compute shader. Animals do not collide
  with it, so a path has to be placed where there is water.
- Source files use CRLF line endings. Keep them.

## Recipe: adding an era

1. **Folder.** `source/eras/<id>/`, with an id from `source/eras.mjs`. The build finds it, writes `<id>.html` and
   turns the era's stop in the timeline of every page into a link. The quickest start is a copy of `today`.
2. **What the folder has to define.** File names are free, the names in the code are not:

   | Name | What |
   |---|---|
   | `about.txt` | The sentences for the title menu, 70 words at most |
   | `ERA` | `views` (six viewpoints: position and look-at, the height counted from the sea floor), `fly` (the 60 s camera path), `sun`, `expo`, `rays`, `top`, `bottom` and `edge` (how high, how deep and how far from the middle the player swims), `load` (five loading texts), `sound` (the mood), `tick()` (its numbers in the uniform buffer, every frame) |
   | `AIR`, `LIGHT` | WGSL: the constants for the colours of water and light, the drift of the particles (`DRIFT`) and how far the haze looks ahead for its skylight (`SKYD`, `SKYO`), and four functions: the flecks of sunlight (`caus`, `caus2`), what the plane over the world shows (`above`), what lies over things before the haze (`veil`) |
   | `FLOOR` | `prims` and `counts` (the rock masses), `wgsl` (the density function `dens`) |
   | `LOOK` | WGSL: `mats` (materials of solid things), `pal` and `types` (leaves) |
   | kinds | One `kind({...})` for everything that is drawn besides ground, leaves and sprites |
   | `makeWorld(W)` | Scatters the world with the engine's tools `W`, gives the animals their instances, registers the zoo places |
   | `ZOO` | The zoo texts, with their sources as comments |

   The comments at the top of the files in `source/eras/today/` and in `source/engine/tools.js` say what each part
   has to contain.
3. **Its own verification.** Every era has its own six viewpoints and its own flight path, and both gates under
   Verification run per era.
4. **Nothing of another era in it**, and no change to the world of an era that exists: its six viewpoints must
   still match the renders from before.

## Recipe: adding an animal

The plesiosaur of `today` is the worked example. Search for `lesio` in `source/eras/today/` to see all five parts.

1. **Mesh**: a function in the era's folder (`meshPlesio` in `sealife.js`) built with the `Mesh` class. Model it
   around the origin, nose at +z, y up. The `aux` value per vertex (fourth normal component, -1 to 1) is free for the
   shader, here it marks the flippers.
2. **Shaders**: a `/*wgsl*/` string with a vertex and a fragment entry point (`S_PLESIO` with `vsPlesio` and
   `fsPlesio`). The vertex shader computes the path position from the time and moves the body parts.
3. **Kind**: one line in the era's `world.js` (`PLESIO = kind({ mesh, wgsl, vs, fs })`). The order of the kinds is
   the drawing order.
4. **Instances**: a list in `makeWorld` (`plesios`), eight floats each, handed to the kind at the end
   (`PLESIO.data`).
5. **Zoo** (only if the player should be able to read about it): one entry in the era's `ZOO`, a function that
   repeats the path of the vertex shader in JavaScript (`zooPlesio`), and one `zooMove(...)` call at the end of
   `makeWorld`. Something that does not move needs only the `ZOO` entry and a `place(...)` call in `makeWorld`.
   Something as large as a wall is a `backdrop(...)`: it is named only where nothing else is looked at.

Something that stands and only sways (the tulip animal of `cambrian`) needs no shaders of its own: it is a solid
kind with a material in the era's `LOOK.mats`, and a last instance number below zero makes it sway.

To add another plesiosaur, add one more array to the `plesios` list. Nothing else changes.

What else an animal can be (`source/eras/cambrian/swimmers.js` has an example of each):

- **See-through** (the jellyfish): `glass: 1` in its kind. It is drawn after everything solid and laid over it, far
  ones first. For that the first three floats of its instances have to say about where each one is, and its fragment
  shader returns its colour times its alpha, and the alpha.
- **Close to the ground** (Opabinia, the swarms of Marrella): the shader of an animal cannot ask the sea floor, so
  the era gives it its own formula for the height of the ground (`groundWgsl` in the Cambrian's `floor.js`, which the
  density function uses too). The engine's noise functions are there for that in every animal shader. For the zoo,
  `makeWorld` keeps the heights it needs (`zooGround`).
- **Shared code.** The shaders of all animals of an era are one module. What several of them share goes with the
  first kind (`S_SEA`).

**Paths lie in open water.** Animals do not collide with anything. After a change to a path run
`node tools/ways.mjs <era>`: it follows every animal the zoo knows for ten minutes and checks its place against the
rock, the flight path and the viewpoints.

## Verification

A change to what is drawn or to how fast it is drawn is finished only when both gates pass.

- **Visual critic:** a separate subagent that sees ONLY your renders, never your code or reasoning. Give it 6 fixed
  camera poses, rendered at 2560×1440 in GPU-accelerated Chrome, plus a short recording of the fly-through to catch
  shimmer, aliasing, popping and banding. It returns prioritized, concrete defects. Iterate until it reports nothing
  above "minor".
- **Performance:** GPU timestamp queries plus a frame-time log from the scripted fly-through. Report average, 99th
  percentile and max.

**Done when:** both verification gates pass. Deliver the page of the era, the bundle size, the perf report and the
critic's final review.

What the repository already has for this:

- **Tools.** `tools/README.md` lists the checks in `tools/` and when to run which. Most of them need no graphics
  card (they run the page with a stand-in for WebGPU): run those after every change. `poses.mjs`, `kinds.mjs`,
  `flight.mjs` and `bench.mjs` render the scene and make the renders and the numbers for the two gates. `ways.mjs`
  needs the card too, for the real sea floor.
- **Is the card free?** `node tools/chrome.mjs status` shows how busy the graphics card is. If something else is
  using it (Mario playing a game), run nothing that renders the scene: it disturbs him and the timings are
  worthless. Do what needs no card, say which gates are still open, and run them when the card is free. The tools
  that render refuse to start on a busy card, and `status` ends with exit code 3 then.
- **Shader pieces of an era.** The stand-in for WebGPU does not compile shaders. `node tools/wgsl.mjs <era>` does,
  without drawing anything: run it after every change to a `/*wgsl*/` string.
- **Poses.** The 6 poses of an era are `ERA.views` in its folder, the keys `1` to `6` in its page. They are the
  fixed poses of the visual critic and the reference renders that show whether a world has changed. They stay when
  they leave the game (`docs/briefs/viewpoints.md`): from then on only the dev pages have the keys `1` to `6`.
  Where a brief says viewpoint or test pose, it means one of these six.
- **Fly-through.** The 60 s path is `ERA.fly`. `npm run build:dev` writes the dev pages (`dev.html` for `today`,
  `<id>-dev.html` for the others): `F` flies the path, `B` flies it as a benchmark and then shows average, 99th
  percentile and max for the frame time and the GPU time. If it shows `timestamp-query unavailable`, say so in the
  report. Do not put other numbers in its place.
- **Resolution.** The benchmark runs at whatever resolution the page is using and names it in its first line. For
  2560×1440 the window has to be that size and `localStorage.abyssal` has to be cleared first, because the page
  remembers a lower resolution from earlier visits.
- **Limits.** The limits for the performance gate are under TARGET in `prompt.txt`: GPU time at most 11 ms on
  average and no frame above 16.7 ms. They are stated for the hardware listed there. If this machine is a different
  one, report the numbers and ask Mario which limits apply.
- **Bundle size.** `npm run build` prints it, per page.
- **Real graphics card only.** Software WebGPU (SwiftShader) is no substitute: one frame of the full scene takes
  minutes there, and a headless Chrome without a graphics card cannot present to the canvas at all.
- **New things.** If the 6 poses and the fly-through do not show what you changed, give the critic extra renders
  that do, and say in the review which ones they are.
- **Recording.** If a video is not practical, a run of consecutive frames saved as images does the same job:
  `flight.mjs` makes them.
- Keep renders, recordings and logs out of Git.

## Working rules

- **Read before you edit.** Open the current version of a file right before changing it. Mario edits between
  sessions.
- **Git is Mario's.** No commit, push, branch, checkout, merge, stash or reset. Read-only Git (`status`, `diff`,
  `log`) is fine. End a task with the list of changed files and one proposed commit message.
- **Ask when unclear.** One precise question beats a wrong assumption.
- **Verify before you hand over.** Run both builds and the two gates under Verification. Then tell Mario exactly
  what to open, which key to press and what he should see. WebGPU validation errors appear in the browser console
  as `GPU: ...`.
