# Titanichthys: slow cruising and feeding runs (2026-11-19)

Mario: Titanichthys gets a sequence like the hunt of Dunkleosteus (`dunkleosteus-hunt.md`), but as a filter feeder:
no chase, no snap. It cruises slowly with its mouth nearly shut; now and then, at random, it makes a feeding run:
faster, the mouth wide open, the fins held out; then it shuts its mouth and swallows. This replaces the steady
swimming with the mouth always open of `devonian-giants-motion.md` for Titanichthys.

| What | Before | Now |
|---|---|---|
| Cruising speed (b.y) | 0.55 to 0.85 m/s, mouth always open | 0.40 to 0.60 m/s with the two slow swells (15 and 10 %), mouth nearly shut (5 degrees) |
| When it feeds | Always | One run in each cycle of 50 to 70 s, at a place in the cycle that changes from cycle to cycle: 35 s to 90 s from one start to the next |
| The run | | Over 3 s up by 0.5 to 0.8 m/s (so 0.9 to 1.4 m/s) with the mouth opening wide (34 degrees); 12 to 25 s of sieving; the mouth shuts and it slows down over 3.5 s |
| Swallowing | Every 18 to 30 s | In a run every 8 to 12 s the mouth closes most of the way for a moment; after the run two gulps |
| Breathing | | Between the runs: a little wider every 5 to 7 s, more for half a minute after a run |
| Tail | | Wider as it speeds up and through the run; the beat follows the speed |
| Pectoral fins | Scull 4 degrees, steer | Scull 5 degrees and steer while cruising; in a run held 10 degrees further out and sculling less, to keep the body steady |

The speed in the run is Mario's choice. A basking shark, the nearest living filter feeder of this kind, does the
opposite: Sims (2000) measured a mean filter-feeding speed of 0.85 m/s against 1.08 m/s when it cruised with the
mouth shut, about 24 % slower (https://pubmed.ncbi.nlm.nih.gov/10817828/, abstract). Everything else here is an
estimate (not verified).

`ref/titanichthys-feeding-timeline.png` shows speed, mouth and fins of two animals over 4 minutes;
`ref/titanichthys-feeding-poses.png` shows cruising, the run from the side and from in front, and a swallow in the run,
drawn by the container renderer from the reference mesh (not the engine).

## How it works

As the hunt of Dunkleosteus: cycles of `hPer` = 50 to 70 s, in cycle `hk` the run starts at `hPer * titanRun(hk, s)`
(0.05 to 0.35 of the cycle). The extra speed is `vb * (smoothstep(0, 3, tau) - smoothstep(te, te + 3.5, tau))`, `te`
= 3 s + the time of sieving. Its integral is `3 * titanRamp(tau / 3) - 3.5 * titanRamp((tau - te) / 3.5)`, and every
run adds `vb * (te + 0.25)` metres. The longest run with its two gulps ends at 0.87 of its cycle. Checked in Node
over an hour for seven animals: the speed from the distance (numerical) and the formula agree to 1e-7 m/s; the
speed stays between 0.38 and 1.39 m/s.

## What to copy

1. `source/eras/devonian/swimmers_titanichthys.js`, `S_TITANICHTHYS`, from `ref/titanichthys-shader.wgsl`:
   - the two new functions `titanRun` and `titanRamp` with their comments, just before `vsTitanichthys`;
   - in `vsTitanichthys` the block from the comment "how far it has swum" to the line `let push = ...`;
   - the block of the mouth from its comment to the line `let mo = ...`, and the comment of `let jawA`;
   - the comment and the line `let amp = ...` of the tail beat;
   - the comment and the line `let up = ...` of the pectoral fins.
   Nothing else in the shader changes. `dist` and `vr` become `var`.
2. In the same file, the zoo part: replace `titanZooDist` and put `titanRun` and `titanRamp` before it, as in
   `ref/titanichthys-zoo.js`. `titanZooPath` and `zooTitanichthys` stay.
3. `source/eras/devonian/world.js`, the Titanichthys loop: `rr(0.55, 0.85)` becomes `rr(0.40, 0.60)`. The number of
   random calls stays the same, so the animals keep their places.

## Acceptance

1. A Titanichthys mostly swims along slowly with its mouth nearly shut, breathing a little.
2. About once a minute (35 s to 90 s, not on a beat) it speeds up over a few seconds, the mouth opens wide, the
   pectoral fins stand further out, the tail beats wider; while it sieves the mouth closes for a moment now and then.
3. After 12 to 25 s it shuts its mouth, swallows twice and slows down again.
4. It never swims backwards and never jumps; the zoo label stays on the animal.
5. `node tools/wgsl.mjs devonian` passes.

## Not checked

The shader has passed only a bracket and length check in the container, not a compile. The poses were drawn with the
container renderer; the engine has not been seen.
