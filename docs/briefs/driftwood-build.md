# Driftwood: build sheet (2026-11-19)

> v3 (2026-11-19, later the same day): `driftwood-matte.md`. The mesh and the shader in `ref/` are now v3; the bark
> and the light described below are v2.

Trunks of Archaeopteris, whose wood is called Callixylon, 12 m long and 0.6 m thick: 15 drift near the surface, 25
lie sunk on the floor. Sources and numbers: `docs/research/devonian/driftwood.md`.

| File | What |
|---|---|
| `ref/driftwood-mesh.js` | `meshDriftwood()`, tested: 6,929 vertices, 13,232 triangles (40 logs). Replaces the version of the gap fixes of the same day |
| `ref/driftwood-shader.wgsl` | The whole text of `S_WOOD`: vertex shader with the motion, fragment shader |
| `ref/driftwood-reference.png` | A floating log from the side, the thick end, the break, the bark, a sea lily, a sunk log (container renderer with a shadow map, not the engine) |

## The shape

| Part | How | Source |
|---|---|---|
| Trunk | 12 m, 0.30 m in radius at the thick end and 0.20 at the thin one, gently bent, its section lumpy, not round | Size: the card, inside SD and KGS-C; the rest estimated |
| Ends | Both broken: splinters of different length round the rim, a ragged face, the rotten heart hollowed out; bare wood with growth rings, rays and a dark heart | Estimate |
| Bark | Thick, broken by deep fissures into long plates; in places fallen off, so the grey wood shows with its grain | Estimate (the bark of Archaeopteris was not looked up) |
| Branch stubs | Seven, helically round the trunk, each ending in a broken face of bare wood | Estimate |
| Sea lilies | Six on a floating log, holding on to its underside and hanging down: a holdfast, a stem of round plates 0.4 to 1.1 m long, a cup and ten arms with fine side branches | That they were there and hung down: KGS-L, W, HC, H. Sizes and shape estimated |
| Algae | A slimy film on the upper side of a floating log | KGS-L |
| Sunk logs | The same log; grey mud on its upper side; no sea lilies (the vertex shader folds them away), nothing living | Estimate |
| Colours | Waterlogged wood: dark grey-brown bark, paler grey wood, a nearly black heart; the sea lilies a plain pale grey-buff | Estimate: no colour is known; no pattern |

Not added, because the sources say they were not found on such logs: shellfish, snails, barnacles, crustaceans.

## How it moves

As now: the floating logs drift in slow circles near the surface and roll a little; new is a slow bob of 6 cm. The
sea lilies sway about the place where they hold on, trail a little behind as the log drifts, and open and close their
arms slowly like a fan that sieves the water (estimate). `zooDrift` and `world.js` do not change.

The vertex shader now passes aux in `lt` (the shadow of the sun is taken in the fragment shader with `shadow1`) and a
sunk log as seed + 10 in `sd`.

## What to copy

1. `source/eras/devonian/driftwood.js`: replace `meshDriftwood()` by the one of `ref/driftwood-mesh.js` and the whole
   text of `S_WOOD` by `ref/driftwood-shader.wgsl`. The comment at the top of the file and `zooDrift` stay.
2. `world.js`, `zoo.js`: nothing.

## Acceptance

1. A floating log looks like a real waterlogged trunk: fissured bark in plates, bare wood where it has fallen off,
   splintered ends with growth rings and a rotten heart, broken branch stubs, a film of algae on top.
2. Sea lilies hang under each floating log and sway; their arms open and close slowly.
3. Sunk logs have mud on top and no sea lilies.
4. No gap anywhere between stubs, ends and trunk.
5. `node tools/wgsl.mjs devonian` passes; frame time reported before and after.

## Not checked

The WGSL text was never compiled. The picture comes from the container renderer. The bark, the breaks, the stubs, the
size and shape of the sea lilies and all colours are estimates.
