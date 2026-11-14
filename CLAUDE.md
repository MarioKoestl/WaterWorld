# WaterWorld

A procedural underwater world for the browser, drawn with WebGPU. No engine, no asset files: terrain, plants,
animals, textures and sound are all computed by code. Started as a copy of
[Noniv/abyssal-garden](https://github.com/Noniv/abyssal-garden) (MIT). Owner: Mario.

Read this file completely before changing anything.

## Where things are

| File | What's inside |
|---|---|
| `source/src/quality.js` | Detail level (Low, Medium, High), chosen before anything is built |
| `source/src/math.js` | Random numbers, noise, surface nets, the `Mesh` builder |
| `source/src/shaders.js` | All WGSL shaders, as template strings |
| `source/src/world.js` | World layout, scattering, instance lists, procedural meshes |
| `source/src/main.js` | WebGPU setup, loading stages, the frame (`render()`), controls, collision |
| `source/src/audio.js` | Synthesized soundscape |
| `source/src/dev.js` | Fly-through and benchmark, only in `dev.html` |
| `source/template.html` | The page around the scene |
| `source/build.mjs` | Bundles everything into `index.html` |

## Build and run

Run from `source/` in PowerShell. Node.js 18 or newer.

```powershell
npm install               # once
npm run build:readable    # unminified index.html, use this while developing
npm run build             # minified index.html, for publishing
npm run build:dev         # dev.html with F (fly-through) and B (benchmark)
```

Then open `index.html` (repository root) in Chrome or Edge. Keys: `1` to `6` jump to the viewpoints, `H` shows
frame and GPU times, `Esc` opens the menu.

## Facts that save time

- **One scope.** `build.mjs` concatenates the files in `FILES` order into a single async function. There are no
  modules and no imports. Every top-level name is shared, so check for collisions before adding one, and define
  things before the file that uses them at load time.
- **WGSL is minified by a regex** (in `build.mjs`), not by a parser. Inside `/*wgsl*/` strings: `//` always starts a
  comment up to the end of the line, and spaces around operators are removed. Never write `a - -b` or `a + +b`
  (they turn into `--` and `++`). Always test the minified build too.
- **Mesh ids are positions** in the `meshes` array in `main.js`, and many places use the numbers. Append new meshes
  at the end.
- **The world is deterministic.** Each generator system starts with `rseed(n)`. An extra `rnd()` call inside a
  system changes everything after it in that system. Give a new system its own `rseed`.
- **No allocation per frame.** `frame()` and `render()` reuse preallocated arrays. Keep it that way.
- **Animation has no state.** Animals, plants and bubbles are placed by their vertex shader from the scene time
  (`g.cam.w`). JavaScript only writes the time into the uniform buffer.
- **Rock is a density field** (`dens` in `shaders.js`), evaluated once by a compute shader. Animals do not collide
  with it, so a path has to be placed where there is water.
- Source files use CRLF line endings. Keep them.

## Recipe: adding an animal

The plesiosaur is the worked example. Search for `lesio` to see all four parts.

1. **Mesh**: a function in `world.js` (`meshPlesio`) built with the `Mesh` class. Model it around the origin, nose
   at +z, y up. The `aux` value per vertex (fourth normal component, -1 to 1) is free for the shader, here it marks
   the flippers.
2. **Instances**: a list in `makeWorld` in `world.js` (`plesios`), eight floats each, returned at the end.
3. **Shaders**: a vertex and a fragment entry point in `W_ANIM` in `shaders.js` (`vsPlesio`, `fsPlesio`). The
   vertex shader computes the path position from the time and moves the body parts.
4. **Wiring** in `main.js`: one pipeline (`pPlesio`), the mesh appended to `meshes`, one instance buffer and count
   (`ibPlesio`, `nPlesio`), one draw call after the mantas in `render()`.

To add another plesiosaur, add one more array to the `plesios` list. Nothing else changes.

## Verification

A change to what is drawn or to how fast it is drawn is finished only when both gates pass.

- **Visual critic:** a separate subagent that sees ONLY your renders, never your code or reasoning. Give it 6 fixed
  camera poses, rendered at 2560×1440 in GPU-accelerated Chrome, plus a short recording of the fly-through to catch
  shimmer, aliasing, popping and banding. It returns prioritized, concrete defects. Iterate until it reports nothing
  above "minor".
- **Performance:** GPU timestamp queries plus a frame-time log from the scripted fly-through. Report average, 99th
  percentile and max.

**Done when:** both verification gates pass. Deliver `index.html`, the bundle size, the perf report and the critic's
final review.

What the repository already has for this:

- **Poses.** The 6 poses are `POSES` in `main.js`, the keys `1` to `6` in the page.
- **Fly-through.** The 60 s path is `FLY` in `main.js`. `npm run build:dev` writes `dev.html`: `F` flies the path,
  `B` flies it as a benchmark and then shows average, 99th percentile and max for the frame time and the GPU time.
  If it shows `timestamp-query unavailable`, say so in the report. Do not put other numbers in its place.
- **Resolution.** The benchmark runs at whatever resolution the page is using and names it in its first line. For
  2560×1440 the window has to be that size and `localStorage.abyssal` has to be cleared first, because the page
  remembers a lower resolution from earlier visits.
- **Limits.** The limits for the performance gate are under TARGET in `prompt.txt`: GPU time at most 11 ms on
  average and no frame above 16.7 ms. They are stated for the hardware listed there. If this machine is a different
  one, report the numbers and ask Mario which limits apply.
- **Bundle size.** `npm run build` prints it.
- **Real graphics card only.** Software WebGPU (SwiftShader) is no substitute: one frame of the full scene takes
  minutes there, and a headless Chrome without a graphics card cannot present to the canvas at all.
- **New things.** If the 6 poses and the fly-through do not show what you changed, give the critic extra renders
  that do, and say in the review which ones they are.
- **Recording.** If a video is not practical, a run of consecutive frames saved as images does the same job.
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
