# Cladoselache: the build sheet

Mario, 2026-11-19: build sheets with the motion for all animals still open, one at a time. Cladoselache first, as
`devonian-models.md` orders it.

The model in the repo was built from a few sentences: the mouth under a snout, one dorsal fin, an anal fin, a forked
tail of two plates, no fin spine, no keels. Cladoselache had the mouth at the front, two dorsal fins with a spine in
front of the first, no anal fin, keels on the tail stalk and a tall crescent tail. This brief hands it over the way
the Titanichthys got it: a tested mesh, the whole shader as text with the motion, a picture of both. Sources and
numbers: `docs/research/devonian/cladoselache.md`.

## What comes with this brief

| File | What it is |
|---|---|
| `docs/research/devonian/cladoselache.md` | The sources, word for word where it matters, and what was measured |
| `docs/briefs/ref/cladoselache-mesh.js` | `meshCladoselache()`, first version |
| `docs/briefs/ref/cladoselache-shader.wgsl` | The whole text of `S_CLADOSELACHE`, with the motion |
| `docs/briefs/ref/cladoselache-reference.png` | Eight views |

The mesh was run in Node with a copy of `Mesh` and `curve()`: 15,099 vertices, 28,350 triangles, one unit long. Its
outline from the side and from above was laid over the measured drawing (SK) and agrees within about 0.005 TL. The
picture comes from the small renderer of the Titanichthys (light only roughly that of the engine, no shadow).
**The WGSL has not been compiled.** A script checked brackets and that every name is declared before it is used. The
zoo function was run in Node.

## The animal

| What | How | From |
|---|---|---|
| Length | One unit = 1 TL. `world.js` 1.4 to 1.8 m, card 1.8 m: unchanged (see the end) | W: largest certain skeleton about 2.0 m |
| Body | Slim, deepest 0.15 at 0.30 to 0.35, about as wide as deep; tail stalk 0.03 deep | W ("similar in body shape to modern lamnid sharks"); SK |
| Head | Short, blunt and rounded, low and broad; no snout over the mouth | W, ER, SK |
| Mouth | At the front, the corner at 0.135 behind the eye. Slightly open while it swims (4 degrees) | W, ER, SK. The gape at rest: estimate |
| Teeth | One row in each jaw, cladodont: a tall middle cusp with a small one on each side; 0.005 high in front, smaller behind, set just inside the lips | W ("slender and smooth-edged ... for grasping"). Size and count: estimate |
| Eyes | Large: a dome 0.022 across in a ring of 22 small raised plates 0.032 across, at 0.07 | W (more than 20 plates), SK |
| Nostrils | Large, far forward, at 0.016 | W |
| Gill slits | Five narrow grooves on each side, 0.158 to 0.213 | W, SK |
| Inside | Mouth and throat to 0.225, five red gill arches with filaments under the slits | W ("muscular flaps packed with fibrous overlapping gill filaments") |
| Fin spine | A flat blade on the back, base 0.23 to 0.28, 0.045 high, bent back at the tip, pale grey, glossy | H1938, SK. Colour: estimate |
| First dorsal fin | Base 0.285 to 0.385, 0.075 high, apex at 0.355, steep rear edge | W, SK |
| Second dorsal fin | 0.578 to 0.66, about 0.02 high, rounded | W, SK |
| Pectoral fins | Broad three-cornered wings, base 0.24 to 0.335 low on the flank, tip 0.20 out at 0.305, about 20 degrees down | W, SK |
| Pelvic fins | Small and low, 0.565 to 0.64 | W, SK |
| Anal fin | None | W |
| Keels | A thin keel on each side of the tail stalk, 0.78 to 0.89 | W, SK |
| Tail fin | A tall crescent, the lobes nearly equal: upper tip 0.17 above the middle, lower 0.10 below | W, ER, SK |
| Skin | Mostly naked: smooth, faint folds, not glossy. A fine grain of denticles only round the eye and mouth, on the fins and along the lateral line, a fine groove a third of the way down the flank | W |
| Colour | Not known: one plain tone, no pattern. Dark grey along the back, paler flank, pale belly with a soft border; fins in the tone of the body, the pectoral fins pale below | Estimate (as in nearly every shark of the open water) |

`aux` is listed at the head of the mesh file. The shader finds the pectoral fins by place (`pw`), not by `aux`.

## How it moves

The motion of `devonian-giants-motion.md`, for a group. Each group has a path and a pace; each animal keeps its place
in the group (as before: up to 3 m across, its own lead along the path) and strikes on its own.

| What | How | From |
|---|---|---|
| Path | The wandering circle of the giants (`cladoPath`), wrapped after 4 pi | Free |
| Pace | `b.y` is now the cruising speed of the group in m/s: 0.7 to 1.1, swelling and ebbing by 20 and 12 % | Estimate (0.4 to 0.6 lengths per second) |
| Strike | Every 40 to 90 s each animal shoots about 2 m ahead of its group within a second (up to about 5 m/s), then falls back over 10 to 20 s. It never swims backwards | W ("fast-moving and fairly agile"). Numbers: estimate |
| Snap | In the strike: open 36 degrees in 0.08 s, 0.15 s open, shut in 0.10 s, then two swallows | W: prey swallowed whole, tail first. Timing: estimate |
| Tail beat | One beat per 0.75 lengths swum; the wave in the rear half, wavelength about one length, recoil of the front | Estimate, as for a mackerel shark |
| Turns | Body along the curve of the path, banks into the turn up to 14 degrees | Free |
| Pectoral fins | Scull, steer (inner fin down), spread to brake after a strike | Free |

Checked in numpy: over 600 s, three speeds, 75 animals, the slowest an animal moves is 0.28 m/s, the fastest 5.6 m/s.
At the end of a strike period its lead jumps by about 2 cm.

### `world.js`

```js
    const spd = rr(0.7, 1.1) * (rnd() < 0.5 ? 1 : -1);          // cruising speed of the group in m/s
```

replaces `rr(0.012, 0.018)`. Everything else in that loop stays.

### `zooCladoselache`

Replaces the old one in `swimmers_cladoselache.js`:

```js
// ---------------------------------------------------------------- zoo
// A group of Cladoselache: the path of its group and the distance along it as in vsCladoselache, without the place
// of each animal in the group and without its strikes (change one, change the other). Two lines from the middle.
// Nothing here allocates: it runs in every frame
const cladoFr = (x) => x - floor(x);
// the point of the path at angle g, written to ZP at k (cladoPath in the shader)
const cladoZooPath = (a, i, g, k) => {
  const R = a[i + 3], ph = a[i + 7] * 17;
  ZP[k] = a[i] + R * cos(g) + 0.1 * R * cos(1.5 * g + ph);
  ZP[k + 1] = a[i + 1] + 1.5 * sin(2 * g + ph) + 0.6 * sin(3.5 * g + 2 * ph);
  ZP[k + 2] = a[i + 2] + R * sin(g) + 0.1 * R * sin(1.5 * g + 1.7 * ph);
};
const zooCladoselache = (a, i, part) => {
  const gs = a[i + 7], v = a[i + 5], v0 = abs(v), t = F[TIME], L = 0.9 * a[i + 3];
  const f1 = 0.031 + 0.02 * cladoFr(gs * 7.31), f2 = 0.083 + 0.03 * cladoFr(gs * 3.17);
  const d = v0 * (t + 0.20 / f1 * sin(f1 * t + 6.3 * cladoFr(gs * 5.13))
    + 0.12 / f2 * sin(f2 * t + 6.3 * cladoFr(gs * 9.71)));
  const g = (v < 0 ? -1 : 1) * d / L + gs * 6.3;
  cladoZooPath(a, i, g, 0); cladoZooPath(a, i, g + (part * 2 - 1) * 4 / L, 3);
  ZP[3] -= ZP[0]; ZP[4] -= ZP[1]; ZP[5] -= ZP[2]; ZP[7] = 3.0;
};
```

## Stage A: take over

1. Read `swimmers_cladoselache.js` and `world.js` as they are now.
2. Replace `meshCladoselache()` by `ref/cladoselache-mesh.js` and the text of `S_CLADOSELACHE` by
   `ref/cladoselache-shader.wgsl`. Change no number. Put the list of `aux` from the head of the mesh file at the head
   of `swimmers_cladoselache.js`, and replace its comment "in the round" by the one of the mesh file.
3. `zooCladoselache` and the one line of `world.js` as above.
4. `node tools/wgsl.mjs devonian`. Fix only what the compiler names, smallest change, list every fix. All functions
   carry the prefix `clado`; if one clashes with a name elsewhere in the module, say which.
5. Turntable: swimming, the snap (`mo` forced to 1 for a moment), one from in front at 2 m at the height of the mouth,
   and one from above. Put them next to `ref/cladoselache-reference.png`.
6. In the page with `--walk`: a group from about 5 m; wait for a strike.
7. `node tools/bench.mjs devonian`, before and after.
8. **Stop. Show Mario.**

## Rules that matter here

- Taken over, not written again: no new noise, no `sin()` patterns on the body, not `skinWet()`.
- No colour pattern: none is known. No anal fin. The mouth at the front, not under a snout.
- `swimmers_cladoselache.js` and the one line of `world.js` only. Git is Mario's.

## Acceptance criteria

1. From the side: a slim shark with a blunt rounded head and the mouth at the front, a large eye, five gill slits,
   a spine and then a tall first dorsal fin over the pectoral fins, a small rounded second dorsal fin, a tall crescent
   tail with nearly equal lobes. No anal fin.
2. From above: broad pectoral wings, a tail stalk with keels that looks almost rectangular.
3. The teeth: small, three-pointed, mostly hidden while it swims; visible in the snap.
4. The skin is smooth and not glossy; a fine grain only round eye and mouth, on the fins and the lateral line.
5. One plain tone with a pale belly. No spots, no stripes.
6. The groups swim together; now and then one animal shoots ahead, snaps, glides and falls back into the group.
   Nothing ever swims backwards.
7. The name hint still finds the groups.
8. Frame time reported before and after.

## Not checked

- The WGSL text was never compiled.
- SK is one person's drawing, not a published figure. W agrees with it in every point W names.
- Of W only the text of the page was read, through a tool; two sentences (the plates round the eye, the terminal mouth)
  are the tool's paraphrase.
- H1938: two passages from a search result; the figure of the spine was not seen.
- The colour, the teeth (count, size), the gape at rest, the speeds and the strike.
- The relief of the skin is scaled for 1.8 m (`hgt * 1.8`): the fragment shader does not know the size of the animal.
- The open question of the length: W gives about 2.0 m for the largest certain skeleton; card and `world.js` stay at
  1.8 m until Mario decides.
