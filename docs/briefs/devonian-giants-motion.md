# Dunkleosteus and Titanichthys: how they swim, how the mouth moves, how big they are

> Update 2026-11-19: for Dunkleosteus the strike below is replaced by the hunt of `dunkleosteus-hunt.md` (slow
> cruising, a chase with the mouth open now and then). For Titanichthys the steady swimming with the mouth always
> open is replaced by the feeding runs of `titanichthys-feeding.md`.

Mario, 2026-11-19: "the sizes, and the swimming of both fish still looks very stiff. Different speeds and movements
would be cool. And Dunkleosteus opens and shuts its mouth too often, and it does not look natural."

Mario's decisions the same day:

- **Size:** every animal of both kinds 4.1 m, the upper end of the sources (E2023), no spread.
- **Mouth of Dunkleosteus:** the threat goes. Only the snap of a strike, seldom (every 70 to 120 s), then it swallows.
  In between it only breathes.

Fixed the same day (`devonian-motion-fixes.md`): animals with a negative speed swam tail first. The code below and
the reference shaders carry the fix.

This brief replaces the vertex shaders of both kinds, their zoo functions and a few lines of `world.js` and
`zoo.js`. Nothing in the meshes or the fragment shaders changes. Where this file and `dunkleosteus-danger.md`,
`dunkleosteus-armour.md`, `dunkleosteus-jaws.md`, `dunkleosteus-bone.md` or `titanichthys-build.md` differ about
the mouth, the size or the swimming, this file wins.

## Why it looked stiff

| What one sees | Why |
|---|---|
| Always the same | A fixed ellipse at one constant speed: the same turn, the same pace, forever |
| Titanichthys nearly still | 0.11 to 0.32 m/s; at 4 m that is one tail beat every 8 to 25 s |
| A flapping board | The body wave was 1.4 body lengths long: the tail swung with the stalk instead of lagging behind it |
| Head on rails | The front never moved, it did not lean into a turn, the body stayed straight in a curve, the fins were frozen |
| The mouth | A snap every 12 to 25 s into empty water, and the mouth held wide open whenever the diver was in front |

## What comes with this brief

| File | What it is |
|---|---|
| `docs/briefs/ref/dunkleosteus-shader.wgsl` | `S_DUNKLEOSTEUS`: new `dunkPath`, new `vsDunkleosteus`, new instance comment. Rest as the sixth version |
| `docs/briefs/ref/titanichthys-shader.wgsl` | `S_TITANICHTHYS`: new `titanPath`, new `vsTitanichthys`, new instance comment. Rest unchanged |
| `docs/briefs/ref/devonian-giants-motion.png` | Speed, tail beat, mouth and turn radius over 5 minutes, and one strike in detail |

The motion was written twice: in WGSL, and in numpy for the curves of the picture and for a check of the body in
motion (top and side, frame by frame). The zoo functions below were run in Node and give the same positions as the
numpy copy of the shader. **The WGSL has not been compiled.** A script checked brackets and that every name is
declared before it is used.

## How they move

| What | How | From |
|---|---|---|
| Path | A circle of radius R with a slower circle (0.1 R, 1.5 times per turn) on top, so the path wanders and no two turns are alike; it rises and sinks by up to 2 m. Turn radius 12 to 40 m. Every frequency is a multiple of 0.5: the path repeats after 4 pi and the angle is wrapped, so a float does not lose precision after hours | Free |
| Speed | Each animal its own cruising speed. It swells and ebbs on two slow waves of its own (Dunkleosteus 25 and 15 %, Titanichthys 15 and 10 %, periods 50 to 200 s) | Free |
| Cruising speed | Dunkleosteus 0.6 to 1.0 m/s. Titanichthys 0.55 to 0.85 m/s, about the speed at which basking sharks of 4 to 6.5 m filter (0.85 m/s) | Sims 2000 for the basking shark. Dunkleosteus: estimate |
| Tail beat | One beat per 0.65 (Dunkleosteus) or 0.70 (Titanichthys) body lengths swum: the beat follows the speed by itself, 0.2 to 0.4 beats per second cruising, 1.5 in a strike | Estimate, a common stride of fishes |
| Body wave | Wavelength about one body length, so the tail lags behind the stalk. Stiff under the armour as before | E2024 (stiff front). Wavelength: estimate |
| Recoil | The front swings a little against the tail (about 0.01 body lengths at the snout) | Free |
| Turns | The body lies along the curve of its path (the armoured front less); it banks into the turn by up to 11 degrees, more when fast | Free |
| Pectoral fins | Turn about a hinge at their root: a slow scull (4 degrees), steering (the fin on the inside of a turn goes down, up to 14 degrees), and in Dunkleosteus spread down and out to brake while it glides out of a strike | Free |
| Size | Both 4.1 m, `b.z` taken as it is (no random spread in the shader any more) | E2023: about 4.1 m for the largest Dunkleosteus; Titanichthys comparable |

## The mouth of Dunkleosteus

| When | What | From |
|---|---|---|
| The strike | Every 70 to 120 s, at a time of its own for each animal, it surges 10 m forward: about 3 m/s faster at its peak 1.2 s in, then it glides out of it over some 5 s. The tail drives wide in the surge and nearly rests in the glide | Timing and speed: estimate |
| The snap | At the peak of the surge (1.3 s in): open in 0.06 s, open 0.2 s, shut in 0.12 s | AW2007: the jaws opened in about a fiftieth of a second |
| Swallowing | Then three smaller openings 1.1 s apart, each less wide (30, 23, 16 % of the snap) | Estimate |
| Breathing | All the rest of the time: the mouth opens a little every 4.5 to 6 s (5 % of the snap), more (12 %) for half a minute after a strike | Estimate. How placoderms breathed is not known |
| No threat | The mouth no longer reacts to the diver | Mario, 2026-11-19: no source |

Titanichthys keeps its mouth as in `titanichthys-build.md`: wide open, closing to about 9 degrees every 18 to 30 s.

## Changes outside the shaders

### `source/eras/devonian/world.js`

`b.y` is now the cruising speed in m/s (the sign is the direction), no longer radians per second. The size is 4.1.

```js
  // --- Dunkleosteus: three armoured giants, each on its own wandering path (devonian-giants-motion.md)
  ...
    const spd = rr(0.6, 1.0) * (rnd() < 0.5 ? 1 : -1);          // cruising speed in m/s, the sign is the direction
    const sd = rnd(), sd2 = rnd();
    dunkleArr.push(cx, cy, cz, R, sd, spd, 4.1, sd2);
    dunkleZoo.push(cx, cy, cz, R, sd, spd, 4.1, sd2);
  ...
  // --- Titanichthys: two filter-feeding giants, each on its own wandering path
  ...
    const spd = rr(0.55, 0.85) * (rnd() < 0.5 ? 1 : -1);        // cruising speed in m/s, the sign is the direction
    const sd = rnd(), sd2 = rnd();
    titanArr.push(cx, cy, cz, R, sd, spd, 4.1, sd2);
    titanZoo.push(cx, cy, cz, R, sd, spd, 4.1, sd2);
```

The old `rr(3.4, 4.1)` and `rr(3.6, 4.0)` called `rnd()`. Without them the second and third animal of each loop
draw other random numbers and get other places. That is accepted.

### `source/eras/devonian/zoo.js`

Titanichthys `size: 4` becomes `size: 4.1`.

### The zoo functions

They replace `zooDunkleosteus` in `swimmers_dunkleosteus.js` and `zooTitanichthys` in `swimmers_titanichthys.js`.
They allocate nothing.

```js
// ---------------------------------------------------------------- zoo
// Where a Dunkleosteus is: the same path and the same distance along it as vsDunkleosteus (change one, change the
// other). Two parts, 5 m ahead and 5 m behind. Nothing here allocates: it runs in every frame
const dunkFr = (x) => x - floor(x);
// metres swum along its path by time t: cruising speed v0 with its two slow swells, and 10 m for every strike
const dunkZooDist = (s, v0, t) => {
  const f1 = 0.031 + 0.02 * dunkFr(s * 7.31), f2 = 0.083 + 0.03 * dunkFr(s * 3.17);
  const q1 = f1 * t + 6.3 * dunkFr(s * 5.13), q2 = f2 * t + 6.3 * dunkFr(s * 9.71);
  const lPer = 70 + 50 * dunkFr(s * 13.7), lc = t / lPer + dunkFr(s * 2.9), tau = dunkFr(lc) * lPer;
  return v0 * (t + 0.25 / f1 * sin(q1) + 0.15 / f2 * sin(q2))
    + (floor(lc) + 1 - (1 + tau / 1.2) * exp(-tau / 1.2)) * 10;
};
// the point of its path at angle g, written to ZP at k (dunkPath in the shader)
const dunkZooPath = (a, i, g, k) => {
  const R = a[i + 3], ph = a[i + 7] * 17;
  ZP[k] = a[i] + R * cos(g) + 0.1 * R * cos(1.5 * g + ph);
  ZP[k + 1] = a[i + 1] + 1.5 * sin(2 * g + ph) + 0.5 * sin(3.5 * g + 2 * ph);
  ZP[k + 2] = a[i + 2] + R * sin(g) + 0.1 * R * sin(1.5 * g + 1.7 * ph);
};
const zooDunkleosteus = (a, i, part) => {
  const L = 0.9 * a[i + 3], v = a[i + 5];
  const g = (v < 0 ? -1 : 1) * dunkZooDist(a[i + 4], abs(v), F[TIME]) / L + a[i + 7] * 6.3 + a[i + 4] * 2.1;
  dunkZooPath(a, i, g, 0); dunkZooPath(a, i, g + (part * 2 - 1) * 5 / L, 3);
  ZP[3] -= ZP[0]; ZP[4] -= ZP[1]; ZP[5] -= ZP[2]; ZP[7] = 5.0;
};
```

```js
// ---------------------------------------------------------------- zoo
// Where a Titanichthys is: the same path and the same distance along it as vsTitanichthys (change one, change the
// other). Two parts, 5 m ahead and 5 m behind
const titanFr = (x) => x - floor(x);
// metres swum along its path by time t: cruising speed v0 with its two slow swells
const titanZooDist = (s, v0, t) => {
  const f1 = 0.031 + 0.02 * titanFr(s * 7.31), f2 = 0.083 + 0.03 * titanFr(s * 3.17);
  const q1 = f1 * t + 6.3 * titanFr(s * 5.13), q2 = f2 * t + 6.3 * titanFr(s * 9.71);
  return v0 * (t + 0.15 / f1 * sin(q1) + 0.10 / f2 * sin(q2));
};
// the point of its path at angle g, written to ZP at k (titanPath in the shader)
const titanZooPath = (a, i, g, k) => {
  const R = a[i + 3], ph = a[i + 7] * 17;
  ZP[k] = a[i] + R * cos(g) + 0.1 * R * cos(1.5 * g + ph);
  ZP[k + 1] = a[i + 1] + 1.2 * sin(2 * g + ph) + 0.5 * sin(3.5 * g + 2 * ph);
  ZP[k + 2] = a[i + 2] + R * sin(g) + 0.1 * R * sin(1.5 * g + 1.7 * ph);
};
const zooTitanichthys = (a, i, part) => {
  const L = 0.9 * a[i + 3], v = a[i + 5];
  const g = (v < 0 ? -1 : 1) * titanZooDist(a[i + 4], abs(v), F[TIME]) / L + a[i + 7] * 6.3 + a[i + 4] * 1.9;
  titanZooPath(a, i, g, 0); titanZooPath(a, i, g + (part * 2 - 1) * 5 / L, 3);
  ZP[3] -= ZP[0]; ZP[4] -= ZP[1]; ZP[5] -= ZP[2]; ZP[7] = 5.0;
};
```

## Steps

1. Read this file, both reference shaders and the picture. Re-read every file of the repo right before changing it.
2. In `S_DUNKLEOSTEUS` (`swimmers_dunkleosteus.js`): put `dunkPath` and the new instance comment in, and replace
   `vsDunkleosteus` with the one of the reference. The fragment shader stays as it is in the repo. Replace
   `zooDunkleosteus` with the code above.
3. The same for `S_TITANICHTHYS`, `titanPath`, `vsTitanichthys` and `zooTitanichthys` in `swimmers_titanichthys.js`.
4. `world.js` and `zoo.js` as above.
5. `node tools/wgsl.mjs devonian`. Fix only what the compiler names; report each fix.
6. Look in the page (`--walk` from the diver view) and with the turntable as before. Report the frame time before
   and after.
7. Stop and report to Mario. No further tuning without him.

## Acceptance

1. `node tools/wgsl.mjs devonian` passes.
2. Both kinds are 4.1 m; the zoo card of both shows 4.1 m.
3. No two of the giants swim at the same pace; each changes its pace now and then. Titanichthys swims steadily, its
   tail beats slowly but visibly (about one beat every 3 to 5 s).
4. The tail lags behind the stalk; the front swings a little; in a turn the body is curved and leans inward.
5. The pectoral fins move: slowly all the time, more in turns.
6. Dunkleosteus: mouth nearly shut most of the time, with a small breathing movement. About once every one to two
   minutes per animal a strike: a sudden surge, the snap, a glide, three swallows. Nothing happens when the diver
   swims in front of it.
7. No jitter of body or fins, also after the page has run for half an hour (the angle along the path is wrapped).
8. The name hint still finds both kinds when the diver looks at them (the zoo functions follow the new path).
9. Frame time reported before and after.

## Not checked

- The WGSL text was never compiled.
- Every speed of Dunkleosteus, the strike, its timing, the swallowing and the breathing are estimates. No source
  gives how fast Dunkleosteus or Titanichthys swam.
- Titanichthys is compared with the basking shark (Sims 2000); that it fed as fast is an assumption.
- The motion was checked with flat grey bodies in a fish-fixed view, not in the engine: not in the water, not with
  `dodge()` and not from the diver.
- The hinge of the pectoral fins was set from the meshes by eye; at the root of the fin a few triangles may stretch.
- With 4.1 for every animal, the size of the instances in `world.js` and of the zoo card are the same number; if
  Mario wants a spread again, both have to change.

## Sources

| Short | Source |
|---|---|
| E2023 | Engelman, R. K. 2023. A Devonian fish tale: a new method of body length estimation suggests much smaller sizes for *Dunkleosteus terrelli*. Diversity 15 (3): 318. https://www.mdpi.com/1424-2818/15/3/318 |
| E2024 | Engelman 2024, see `docs/research/devonian/dunkleosteus.md` |
| AW2007 | Anderson, P. S. L., and M. W. Westneat 2007. Feeding mechanics and bite force modelling of the skull of *Dunkleosteus terrelli*. Biology Letters |
| Sims 2000 | Sims, D. W. 2000. Filter-feeding and cruising swimming speeds of basking sharks compared with optimal models: they filter-feed slower than predicted for their size. J. Exp. Mar. Biol. Ecol. https://pubmed.ncbi.nlm.nih.gov/10817828/ (abstract read: filter-feeding mean 0.85 m/s, cruising 1.08 m/s, sharks of 4.0 to 6.5 m) |
