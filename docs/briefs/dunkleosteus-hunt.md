# Dunkleosteus: slow cruising and the hunt (2026-11-19)

Mario: Dunkleosteus should swim slowly, and now and then, at random, fast, with the fins working and the mouth open
as if it were chasing something. This replaces the strike of `devonian-giants-motion.md` (every 70 to 120 s a surge of
10 m and a snap) for Dunkleosteus. Titanichthys does not change.

| What | Before | Now |
|---|---|---|
| Cruising speed (b.y) | 0.6 to 1.0 m/s | 0.35 to 0.55 m/s, with the same two slow swells (25 and 15 %), so 0.2 to 0.8 m/s |
| When it hunts | Every 70 to 120 s, always at the same beat | One hunt in each cycle of 35 to 55 s, at a place in the cycle that changes from cycle to cycle: 12 s to 75 s apart |
| The hunt | A surge of 10 m, peak 1.2 s in, then a glide | In 1 s up by 2.0 to 2.6 m/s (so 2.4 to 3.2 m/s), a chase of 3 to 5 s, the snap, 2.5 s to slow down |
| Tail | Wide in the surge | Wide as it speeds up and through the chase; the beat follows the speed (once in 6 s cruising, about once a second in the chase) |
| Mouth | Shut until the snap | Half open (24 degrees) through the chase, working a little; the snap at its end; three swallows; breathing in between |
| Pectoral fins | Scull 4 degrees, steer, spread to brake | Scull 6 degrees while it cruises; laid down along the flanks in the chase; spread out to brake after the snap |

All numbers are estimates: nothing is known of how fast Dunkleosteus cruised or sprinted (not verified). The
snap timing stays as before (Anderson and Westneat 2007, see `devonian-giants-motion.md`).

`ref/dunkleosteus-hunt-timeline.png` shows speed, mouth and fins of two animals over 3 minutes;
`ref/dunkleosteus-hunt-poses.png` shows cruising, the chase, the snap and the braking, drawn by the container
renderer from the reference mesh (not the engine).

## How it works

Time is cut into cycles of `hPer` = 35 to 55 s per animal. In cycle `hk` the hunt starts at `hPer * dunkHunt(hk, s)`,
0.05 to 0.55 of the cycle; `dunkHunt` scatters these places with the golden ratio and a sine, with small numbers only,
so the shader (f32) and the zoo (f64) agree. The longest hunt with its slowing down takes 8.5 s and always ends inside
its cycle.

The extra speed is `vb * (smoothstep(0, 1, tau) - smoothstep(te, te + 2.5, tau))`, tau the seconds since the hunt
began, `te` = 1 s + the chase. Its integral is closed (`dunkRamp`: x^3 - x^4 / 2 below 1, x - 0.5 above), and every
hunt adds the same `vb * (te + 0.75)` metres, so the distance needs no sum over the hunts before. Checked in Node over
an hour for four animals: the speed from the distance (numerical) and the formula agree to 2.4e-6 m/s.

## What to copy

1. `source/eras/devonian/swimmers_dunkleosteus.js`, `S_DUNKLEOSTEUS`, from `ref/dunkleosteus-shader.wgsl`:
   - the two new functions `dunkHunt` and `dunkRamp` with their comments, just before `vsDunkleosteus`;
   - in `vsDunkleosteus` the block from the comment "how far it has swum" to the line `let mo = ...`;
   - the comment and the line `let amp = ...` of the tail beat;
   - the comment and the line `let up = ...` (now two lines) of the pectoral fins.
   Nothing else in the shader changes.
2. In the same file, the zoo part: replace `dunkZooDist` and put `dunkHunt` and `dunkRamp` before it, as in
   `ref/dunkleosteus-zoo.js`. `dunkZooPath` and `zooDunkleosteus` stay.
3. `source/eras/devonian/world.js`, the Dunkleosteus loop: `rr(0.6, 1.0)` becomes `rr(0.35, 0.55)`. The number of
   random calls stays the same, so the animals keep their places.

## Acceptance

1. A Dunkleosteus mostly glides along slowly, the tail beating about once in 6 s, the fins sculling.
2. Every 15 s to a minute or so (not on a beat) one speeds up hard: the tail beats faster and wider, the pectoral fins
   go down along the flanks, the mouth opens half way and stays open while it races for 3 to 5 s.
3. At the end the snap (wide open, shut at once), then it spreads its fins and slows down, swallowing three times.
4. It never swims backwards and never jumps; the zoo label stays on the animal through a hunt.
5. `node tools/wgsl.mjs devonian` passes.

## Not checked

The shader has passed only a bracket and length check in the container, not a compile. The poses were drawn with the
container renderer; the engine has not been seen.
