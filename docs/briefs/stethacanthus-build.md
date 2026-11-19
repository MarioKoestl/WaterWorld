# Stethacanthus: the build sheet

Mario, 2026-11-19: build sheets with the motion for all animals still open, one at a time. After Cladoselache comes
Stethacanthus, as `devonian-models.md` orders it.

The model in the repo was built from a few sentences: an anvil on every animal, no pectoral whips, an anal fin, a forked
tail of two plates. In Stethacanthus only mature males carry the spine-brush complex; the pectoral fins are small and
each carries a long whip; the tail is nearly symmetrical. This brief hands it over the way Cladoselache got it: a
tested mesh, the whole shader as text with the motion, a picture of both. Sources and numbers:
`docs/research/devonian/stethacanthus.md`.

## Fix of 2026-11-19: whips and claspers

Mario, with a picture from the engine: under the fins hangs something that looks like a leftover. It was the fin whips:
straight rods that hung below the belly. They are documented, so they stay, but now they are built on the skin:

- **Fin whips:** each grows out of the rear of the base of its pectoral fin and lies against the lower flank back to
  0.69, every point of it on the skin and pushed out by its own radius. 5 mm thick at the root of a 1 m fish, fading
  to a point (estimate).
- **Claspers:** along the inner edge of the pelvic fins and a little past them (0.515 to 0.595), against the belly,
  the club only a little thicker.

In `meshStethacanthus()` only the two blocks that start with the comments "the fin whip" and "claspers of the male"
change; take them from `ref/stethacanthus-mesh.js`. The mesh now has 15,882 vertices and 29,292 triangles. The shader
does not change.

## What comes with this brief

| File | What it is |
|---|---|
| `docs/research/devonian/stethacanthus.md` | The sources, word for word where it matters, and what was measured |
| `docs/briefs/ref/stethacanthus-mesh.js` | `meshStethacanthus()`, first version |
| `docs/briefs/ref/stethacanthus-shader.wgsl` | The whole text of `S_STETHACANTHUS`, with the motion |
| `docs/briefs/ref/stethacanthus-reference.png` | Eight views, a male and a female |

The mesh was run in Node with a copy of `Mesh` and `curve()`: 15,882 vertices, 29,292 triangles (after the fix), one
unit long. Its
outline from the side was laid over the measured drawing (AP) and agrees within about 0.005 TL. There is no view from
above: all widths are estimates. The picture comes from the small renderer of the Titanichthys (light only roughly that
of the engine, no shadow). **The WGSL has not been compiled.** A script checked brackets and that every name is declared
before it is used. The zoo function was run in Node.

## The animal

| What | How | From |
|---|---|---|
| Length | One unit = 1 TL. `world.js` 0.8 to 1.1 m, card about 1 m: unchanged (see the end) | W: S. altonensis about 1.5 m |
| Body | Stout in front, deepest 0.12 from 0.25 to 0.40, a long slim tail stalk (0.033 deep at 0.80) | AP |
| Head | Short blunt snout, broad on top | AP, CS2001 ("broad supraorbital shelves") |
| Eyes | Large: a dome 0.024 across in a rim of skin, at 0.064 | W ("large orbits"), AP |
| Mouth | Just under the tip of the snout, the corner at 0.12 | AP |
| Teeth | Seven in each jaw on each side, each with five cusps (a large middle one, two pairs of smaller ones), 0.008 high in front | CS2001 ("6-7 tooth files"), W (five cusps). Size: estimate |
| Gill slits | Five, close together, 0.196 to 0.224 | AP |
| Spine-brush complex | Males only: a stalk leaning back from 0.19 to 0.29, a flat top 0.12 above the back from 0.213 to 0.368 that overhangs behind. On its top nine rows of large denticles pointing forward | W, CS2001, AP. Width: estimate |
| Head denticles | Males only: a patch on top of the head, 0.03 to 0.10, pointing back | W. Size: estimate |
| Claspers | Males only: along the inner edge of the pelvic fins and a little past them, against the belly, ending in small clubs | W. Size: estimate |
| Females and young | None of the three. What they had in place of the brush is not known: nothing is drawn there | W ("affirmed only in males, and only in those males that have reached sexual maturity") |
| Second dorsal fin | 0.481 to 0.552, 0.056 high, no spine | W ("Stethacanthidae"), AP |
| Pectoral fins | Small, 0.243 to 0.29, low; tip back, out and down | CS2001 ("small size of the paired fins"), AP |
| Fin whips | A thin rod from the rear of the base of each pectoral fin, lying against the lower flank to 0.69, past the pelvic fins | W, AP. Thickness: estimate |
| Pelvic fins | Small and low, 0.487 to 0.55 | AP |
| Anal fin | None | AP |
| Tail fin | Nearly symmetrical: upper tip 0.177 above the middle, lower 0.121 below, a broad lower lobe | CS2001, AP |
| Skin | An even fine grain over the whole body ("minute, button-shaped, flank scales"), faint folds, not glossy | CS2001 |
| Colour | Not known: one plain tone, no pattern. Dark grey brown along the back, paler flank, pale belly; the brush in the tone of the back, its denticles pale grey | Estimate. The spots of AP are the artist's and are not taken over |

`aux` is listed at the head of the mesh file. Which animals are mature males decides `stethMale(seed)` in the shader
(about two in five, free); for the others the vertex shader folds the brush, the head denticles and the claspers into
the body.

## How it moves

The motion of `devonian-giants-motion.md`, for a slow animal that swims alone.

| What | How | From |
|---|---|---|
| Path | The wandering circle of the giants (`stethPath`), wrapped after 4 pi | Free |
| Pace | `b.y` is now the cruising speed in m/s: 0.25 to 0.45, swelling and ebbing by 30 and 15 %. No strike | W ("probably a slow-moving shark"), CS2001 ("unsuited for sudden acceleration"). Numbers: estimate |
| Breathing | The mouth opens a little every 2 to 3 s | Estimate |
| Tail beat | One beat per 0.7 lengths swum; wavelength about one length; recoil of the front | Estimate |
| Turns | Body along the curve of the path, banks a little (up to 11 degrees) | Free |
| Pectoral fins | Scull and steer (inner fin down). The whips sway with the body | Free |

Checked in Node: the zoo point moves at 0.20 to 0.64 m/s, never backwards.

### `world.js`

```js
    const spd = rr(0.25, 0.45) * (rnd() < 0.5 ? 1 : -1);        // cruising speed in m/s, the sign is the direction
```

replaces `rr(0.008, 0.014)`. Everything else in that loop stays.

### `zooStethacanthus`

Replaces the old one in `swimmers_stethacanthus.js`:

```js
// ---------------------------------------------------------------- zoo
// A Stethacanthus: the same path and the same distance along it as vsStethacanthus (change one, change the other).
// Two lines from the middle. Nothing here allocates: it runs in every frame
const stethFr = (x) => x - floor(x);
// the point of its path at angle g, written to ZP at k (stethPath in the shader)
const stethZooPath = (a, i, g, k) => {
  const R = a[i + 3], ph = a[i + 7] * 17;
  ZP[k] = a[i] + R * cos(g) + 0.1 * R * cos(1.5 * g + ph);
  ZP[k + 1] = a[i + 1] + 1.0 * sin(2 * g + ph) + 0.4 * sin(3.5 * g + 2 * ph);
  ZP[k + 2] = a[i + 2] + R * sin(g) + 0.1 * R * sin(1.5 * g + 1.7 * ph);
};
const zooStethacanthus = (a, i, part) => {
  const s = a[i + 4], v = a[i + 5], v0 = abs(v), t = F[TIME], L = 0.9 * a[i + 3];
  const f1 = 0.031 + 0.02 * stethFr(s * 7.31), f2 = 0.083 + 0.03 * stethFr(s * 3.17);
  const d = v0 * (t + 0.30 / f1 * sin(f1 * t + 6.3 * stethFr(s * 5.13))
    + 0.15 / f2 * sin(f2 * t + 6.3 * stethFr(s * 9.71)));
  const g = (v < 0 ? -1 : 1) * d / L + a[i + 7] * 6.3 + s * 2.1;
  stethZooPath(a, i, g, 0); stethZooPath(a, i, g + (part * 2 - 1) * 4 / L, 3);
  ZP[3] -= ZP[0]; ZP[4] -= ZP[1]; ZP[5] -= ZP[2]; ZP[7] = 2.0;
};
```

The two lines along the path and the radius (4 m, 2.0) are those of the old function, so the name hint behaves as
before.

## Stage A: take over

1. Read `swimmers_stethacanthus.js` and `world.js` as they are now.
2. Replace `meshStethacanthus()` by `ref/stethacanthus-mesh.js` and the text of `S_STETHACANTHUS` by
   `ref/stethacanthus-shader.wgsl`. Change no number. Put the list of `aux` from the head of the mesh file at the head
   of `swimmers_stethacanthus.js`, and replace its comment "in the round" by the one of the mesh file.
3. `zooStethacanthus` and the one line of `world.js` as above.
4. `node tools/wgsl.mjs devonian`. Fix only what the compiler names, smallest change, list every fix. All functions
   carry the prefix `steth`; if one clashes with a name elsewhere in the module, say which.
5. Turntable: a male, a female (by seed), the mouth forced open for a moment, one from above. Put them next to
   `ref/stethacanthus-reference.png`.
6. In the page with `--walk`: find a male and a female.
7. `node tools/bench.mjs devonian`, before and after.
8. **Stop. Show Mario.**

## Rules that matter here

- Taken over, not written again: no new noise, no `sin()` patterns on the body, not `skinWet()`.
- No colour pattern: none is known. No spots, even though AP has them. No anal fin.
- Only mature males carry the brush, the head denticles and the claspers.
- `swimmers_stethacanthus.js` and the one line of `world.js` only. Git is Mario's.

## Acceptance criteria

1. Males: a tall brush leaning back from the shoulders, its flat top overhanging behind and set with nine rows of pale
   denticles pointing forward; a patch of denticles on the head; claspers behind the pelvic fins.
2. Females and young: none of these; the back smooth up to the small second dorsal fin.
3. Small pectoral fins, each with a thin whip that lies against the flank past the pelvic fins. Nothing hangs below the
   belly.
4. A large eye; seven large five-pointed teeth in each jaw on each side, visible when the mouth opens.
5. A nearly symmetrical tail. No anal fin.
6. One plain tone with a pale belly, a fine even grain. No spots.
7. It swims slowly, alone; its pace changes now and then; the mouth opens a little every few seconds.
8. The name hint still finds them. Frame time reported before and after.

## Not checked

- The WGSL text was never compiled.
- AP is a life restoration of Akmonistion (Carboniferous, Scotland) by one person, not a published figure, and not of
  Stethacanthus itself. CS2001 was read only as its abstract.
- No view from above: widths of body and brush are estimates.
- What females and young had in place of the brush.
- Whether Stethacanthus lived in the Cleveland Shale (W names stethacanthids from the Devonian of Ohio).
- The colour, the sizes of teeth, denticles and claspers, the speeds and the breathing.
- The relief of the skin is scaled for 1 m (`hgt * 1.0`).
- Length: W gives about 1.5 m for S. altonensis; card and `world.js` stay at about 1 m until Mario decides.
