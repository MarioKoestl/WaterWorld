# Devonian: driftwood v3, not plastic (2026-11-19)

Mario: the driftwood still looks like plastic. He is right, and the reasons are in the v2 sheet (driftwood-build.md):

- **It shines.** v2 gave the bark a "wet sheen" (a sharp highlight plus a broad one, and a light rim at grazing
  angles). That is how wet wood looks in air. Under water it does not: how much a surface reflects head on depends on
  the difference of the refractive indices on both sides, R0 = ((n1 - n2) / (n1 + n2))^2. Wood in air (1.0 against
  about 1.5) gives 4 %, wood in water (1.33 against about 1.5) about 0.4 %. (My own calculation; the index of wet wood,
  about 1.5, is not verified.) So under water the wood is matte; only the slime of algae and the crinoids shine a
  little.
- **Its outline is a smooth tube.** The furrows of the bark were only painted on (a normal trick), so the edge of the
  log was clean and round. Now they are in the mesh: up to 3.5 cm deep, and the edge of the log is ragged.
- **No shade in the depths.** Nothing was darker deep in a furrow or a crack than on top of a ridge. Now there is
  (occ): the water's light reaches little of it.
- **Too even.** One colour, soft features. Now every bark plate has its own tone, the plates flake in long scales with
  fine cracks, and the bare wood is rough, split and stained.
- **A seam.** v2's lump noise read the angle round the log directly, so the outline jumped where the angle wraps
  (one line along the whole log). It now reads cos and sin of the angle.

The bark of Archaeopteris is not known: the furrow net, the depths, the scales and the colours are estimates. What is
known of the inner bark (Decombeix and Meyer-Berthaud 2013, a 10 cm Callixylon stem from Morocco): its fibres are
arranged in tangential bands. That fits a fibrous, layered bark, but says nothing of its surface.

## The bark now

- 11 deep furrows meander along the log; a second, shallower set crosses them at a slant, so the ridges break into long
  diamond plates, about 0.17 m across and 0.4 m long. Both the mesh (`furrow()`) and the fragment shader
  (`woodFurrow()`) compute the same net from sines only, so they agree exactly.
- About a fifth of the bark has fallen off, in patches the mesh decides (aux 0.12, an edge in between). There the trunk
  is thinner by the bark, 2.2 cm, so the edge of a patch is a real step.
- Around the six crinoid holdfasts the bark is whole (so they sit on it). The lump of the log changed, so their
  pivots changed too: the new `woodCri` table is in the shader.
- The mesh: 64 x 161 points on the trunk instead of 32 x 121. 13,553 vertices, 26,352 triangles (v2: 6,929 and
  13,232). With 40 logs that is about 540,000 vertices.

## What to copy

1. `meshDriftwood()` in `source/eras/devonian/driftwood.js`: replace it with the one in `ref/driftwood-mesh.js`.
2. `S_WOOD` in the same file: replace its whole text with `ref/driftwood-shader.wgsl`. (The vertex shader is the same as
   in v2 except the `woodCri` table; new are `woodGroove` and `woodFurrow`; the fragment shader is new from the bark to
   the light.)
3. Nothing else changes: not world.js, not zooDrift, not the instances.

The engine file was the same as the v2 reference files when this was written (checked: mesh and S_WOOD), so the
whole replacement loses nothing. If either was changed since, merge by hand.

## Acceptance

1. Floating logs: dark furrowed bark in long plates, the edge of the log ragged, grey rough wood where the bark is
   gone, a thin film of algae on top through which the bark shows. No bright highlight anywhere on the wood.
2. Sunk logs: the same bark, grey mud on top and in the furrows.
3. No line along the log where the outline jumps.
4. The crinoid holdfasts sit on the bark (no gap).
5. `node tools/wgsl.mjs devonian` passes; frame time reported before and after (twice the vertices of v2).

## Not checked

Not compiled and not seen in the engine. The picture `ref/driftwood-reference.png` comes from a numpy copy of the
new fragment shader with an approximate water light; the engine's light (sunE, amb, caus) will look different.

Sources: Decombeix, A.-L. and Meyer-Berthaud, B. (2013), "A Callixylon (Archaeopteridales, Progymnospermopsida) trunk
with preserved secondary phloem from the Late Devonian of Morocco", American Journal of Botany 100 (11),
https://doi.org/10.3732/ajb.1300167 (abstract).
