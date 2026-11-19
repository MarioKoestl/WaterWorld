# Ctenacanthus: the build sheet

Mario, 2026-11-19: build sheets with the motion for all animals still open, one at a time. After Stethacanthus comes
Ctenacanthus, as `devonian-models.md` orders it.

Of the ctenacanths of the Cleveland Shale mostly spines and teeth are known, and one partial body with skin, jaws,
teeth and pectoral fins (KGS). The model in the repo is a stocky shark with two spines; its fins and proportions were
guessed. This brief measures a life restoration of the species of the Cleveland Shale, C. concinnus, drawn after Dean
1909 and Hodnett and others 2021, and checks it against what the sources say. Sources and numbers:
`docs/research/devonian/ctenacanthus.md`.

## What comes with this brief

| File | What it is |
|---|---|
| `docs/research/devonian/ctenacanthus.md` | The sources, word for word where it matters, and what was measured |
| `docs/briefs/ref/ctenacanthus-mesh.js` | `meshCtenacanthus()`, first version |
| `docs/briefs/ref/ctenacanthus-shader.wgsl` | The whole text of `S_CTENACANTHUS`, with the motion |
| `docs/briefs/ref/ctenacanthus-reference.png` | Eight views |

The mesh was run in Node with a copy of `Mesh` and `curve()`: 15,230 vertices, 28,576 triangles, one unit long. Its
outline from the side was laid over the measured restoration (GQ) and agrees within about 0.005 TL. There is no view
from above: all widths are estimates. The picture comes from the small renderer of the Titanichthys (light only roughly
that of the engine, no shadow). **The WGSL has not been compiled.** A script checked brackets and that every name is
declared before it is used. The zoo function was run in Node.

## The animal

| What | How | From |
|---|---|---|
| Length | One unit = 1 TL. `world.js` 1.4 to 1.8 m, card about 1.8 m: unchanged | KGS ("likely less than six feet"), OK (1.6 m) |
| Body | Fusiform, deepest 0.16 from 0.30 to 0.40; the belly nearly straight behind the pelvic fins; tail stalk 0.033 deep | Z1981 ("fusiform"), GQ |
| Head | Short rounded snout, the mouth under it, the corner at 0.12 | GQ (after Hodnett and others 2021) |
| Eyes | About 0.016 across, at 0.063, in a rim of skin | GQ |
| Teeth | Ten in each jaw on each side, cladodont (a tall middle cusp, two pairs of smaller ones), 0.006 high in front | KGS (teeth on the Cleveland body). Count and size: estimate |
| Gill slits | Five, 0.17 to 0.21 at their top, slanting back towards the belly | GQ |
| Dorsal fins | Two, about equal: 0.265 to 0.40 and 0.51 to 0.646, both 0.09 above the back | Z1981, KGS, GQ |
| Fin spines | One before each dorsal fin, lying along its front edge, the tip free above the fin: each about 0.13 long, sub-cylindrical, a little flattened from the sides, pointed. Ribs along them with small knobs | Z1981, OK, KGS, GQ. In OK the front spine is 37 % longer; GQ draws both alike |
| Pectoral fins | Large and broad, base 0.228 to 0.37, the tip at 0.31, back, out and down | GQ (after Dean 1909), KGS |
| Pelvic fins | 0.50 to 0.585, fairly large | GQ |
| Anal fin | One, 0.70 to 0.772 | Z1981 ("One anal fin is present") |
| Tail fin | Upper lobe long and narrow (tip 0.163 above the middle), lower lobe small (tip 0.095 below), notch at 0.846 | GQ |
| Skin | Shagreen: a fine even grain of denticles over the whole body, faint folds, not glossy; a fine lateral line | KGS ("leathery skin (shagreen)"), Z1981 |
| Colour | Not known: one plain tone, no pattern. Dark grey brown along the back, paler flank, pale belly. The spines pale grey brown, a little glossy | Estimate. The blue green of GQ is the artist's and is not taken over |

`aux` is listed at the head of the mesh file. GQ draws a slender fin under the belly between pelvic and anal fin; no
source names it, so it is left out.

## How it moves

The motion of `devonian-giants-motion.md` for an animal that swims alone, with a strike of its own.

| What | How | From |
|---|---|---|
| Path | The wandering circle of the giants (`ctenPath`), wrapped after 4 pi | Free |
| Pace | `b.y` is now the cruising speed in m/s: 0.5 to 0.8, swelling and ebbing by 20 and 12 % | Estimate |
| Strike | Every 60 to 120 s it surges 4 m forward, about 2 m/s faster at its peak, snaps (34 degrees, 0.08 s to open), swallows twice and glides out | Estimate: nothing is known of how it hunted |
| Mouth | Nearly shut while it swims | Estimate |
| Tail beat | One beat per 0.7 lengths swum; wider in the push, small in the glide; recoil of the front | Estimate |
| Turns | Body along the curve of the path, banks into the turn up to 14 degrees | Free |
| Pectoral fins | Scull, steer (inner fin down), spread to brake after a strike | Free |

Checked in Node: the zoo point moves at 0.35 to 3.6 m/s, never backwards.

### `world.js`

```js
    const spd = rr(0.5, 0.8) * (rnd() < 0.5 ? 1 : -1);          // cruising speed in m/s, the sign is the direction
```

replaces `rr(0.010, 0.016)`. Everything else in that loop stays.

### `zooCtenacanthus`

Replaces the old one in `swimmers_ctenacanthus.js`. The two lines along the path and the radius (4 m, 3.0) are those
of the old function:

```js
// ---------------------------------------------------------------- zoo
// A Ctenacanthus: the same path and the same distance along it as vsCtenacanthus (change one, change the other).
// Two lines from the middle. Nothing here allocates: it runs in every frame
const ctenFr = (x) => x - floor(x);
// metres swum along its path by time t: cruising speed v0 with its two slow swells, and 4 m for every strike
const ctenZooDist = (s, v0, t) => {
  const f1 = 0.031 + 0.02 * ctenFr(s * 7.31), f2 = 0.083 + 0.03 * ctenFr(s * 3.17);
  const q1 = f1 * t + 6.3 * ctenFr(s * 5.13), q2 = f2 * t + 6.3 * ctenFr(s * 9.71);
  const lPer = 60 + 60 * ctenFr(s * 13.7), lc = t / lPer + ctenFr(s * 2.9), tau = ctenFr(lc) * lPer;
  return v0 * (t + 0.20 / f1 * sin(q1) + 0.12 / f2 * sin(q2))
    + (floor(lc) + 1 - (1 + tau / 0.8) * exp(-tau / 0.8)) * 4;
};
// the point of its path at angle g, written to ZP at k (ctenPath in the shader)
const ctenZooPath = (a, i, g, k) => {
  const R = a[i + 3], ph = a[i + 7] * 17;
  ZP[k] = a[i] + R * cos(g) + 0.1 * R * cos(1.5 * g + ph);
  ZP[k + 1] = a[i + 1] + 1.2 * sin(2 * g + ph) + 0.5 * sin(3.5 * g + 2 * ph);
  ZP[k + 2] = a[i + 2] + R * sin(g) + 0.1 * R * sin(1.5 * g + 1.7 * ph);
};
const zooCtenacanthus = (a, i, part) => {
  const s = a[i + 4], v = a[i + 5], L = 0.9 * a[i + 3];
  const g = (v < 0 ? -1 : 1) * ctenZooDist(s, abs(v), F[TIME]) / L + a[i + 7] * 6.3 + s * 3.7;
  ctenZooPath(a, i, g, 0); ctenZooPath(a, i, g + (part * 2 - 1) * 4 / L, 3);
  ZP[3] -= ZP[0]; ZP[4] -= ZP[1]; ZP[5] -= ZP[2]; ZP[7] = 3.0;
};
```

## Stage A: take over

1. Read `swimmers_ctenacanthus.js` and `world.js` as they are now.
2. Replace `meshCtenacanthus()` by `ref/ctenacanthus-mesh.js` and the text of `S_CTENACANTHUS` by
   `ref/ctenacanthus-shader.wgsl`. Change no number. Put the list of `aux` from the head of the mesh file at the head
   of `swimmers_ctenacanthus.js`, and replace its comment "in the round" by the one of the mesh file (the old one names
   sources and a length that were not checked).
3. `zooCtenacanthus` and the one line of `world.js` as above.
4. `node tools/wgsl.mjs devonian`. Fix only what the compiler names, smallest change, list every fix. All functions
   carry the prefix `cten`; if one clashes with a name elsewhere in the module, say which.
5. Turntable: swimming, the snap (`mo` forced to 1 for a moment), one close to the first spine, one from above. Put
   them next to `ref/ctenacanthus-reference.png`.
6. In the page with `--walk`: wait for a strike.
7. `node tools/bench.mjs devonian`, before and after.
8. **Stop. Show Mario.**

## Rules that matter here

- Taken over, not written again: no new noise, no `sin()` patterns on the body, not `skinWet()`.
- No colour pattern: none is known. Not the blue green of GQ.
- `swimmers_ctenacanthus.js` and the one line of `world.js` only. Git is Mario's.

## Acceptance criteria

1. A fusiform shark, deepest in front of the middle, with a short rounded snout and the mouth under it.
2. Two dorsal fins of about the same size, each with a pale ribbed spine along its front edge whose tip stands free.
3. Large broad pectoral fins, fairly large pelvic fins, one anal fin, a tail with a long narrow upper lobe and a small
   lower one.
4. Five gill slits slanting back towards the belly.
5. A fine grain of denticles over the whole skin; one plain tone with a pale belly. No pattern.
6. Now and then it surges forward and snaps; otherwise it cruises with the mouth nearly shut. Never backwards.
7. The name hint still finds them. Frame time reported before and after.

## Not checked

- The WGSL text was never compiled.
- GQ is a life restoration by one person, built from skull, jaws, pectoral fins and spines; the body behind the
  pectoral fins is the artist's. Nothing in the sources contradicts it.
- No view from above: all widths are estimates.
- Dean 1909, Maisey 1984, Hodnett and others 2021 and Ginter 2010 were not read.
- The length: the abstract of 2025 with 4.1 m named in `devonian-models.md` was not found again.
- The colour, the teeth, the speeds and the strike.
- The relief of the skin is scaled for 1.6 m (`hgt * 1.6`).
