# Devonian: what has sunk to the floor (2026-11-19)

Mario: the floor looks very empty. It is meant to: the Cleveland Shale was laid down under deep water without oxygen,
and Barron and Ettensohn (1981) found in these black shales "abundant evidence of life from upper parts of the water
column" but "a lack of evidence of benthic life". Mario chose to add what sinks down from above, and nothing living.
`era-devonian.md` already names it: "the pale bone plates of a dead armoured fish. Nothing has touched them."

So: dead animals lie on the black mud, still and untouched, as the animals of this sea that died and sank, plus empty
shells of the goniatites and of Concavicaris. They are extra instances of the kinds that already exist, so they look
exactly like the living ones, only still, duller and darker, with black mud settled on what faces up.

| Kind | Dead on the floor | Size | Lift (half body width x 0.6) |
|---|---|---|---|
| Dunkleosteus | 1 | 4.1 m | 0.070 |
| Titanichthys | 1 | 4.1 m | 0.085 |
| Cladoselache | 2 | 1.4 to 1.8 m | 0.042 |
| Stethacanthus | 1 (a male) | 0.8 to 1.1 m | 0.042 |
| Ctenacanthus | 1 | 1.4 to 1.8 m | 0.041 |
| Kentuckia | 30 | 8 to 12 cm | 0.033 |
| Concavicaris | 40 | 4 to 7 cm | 0.075 |
| Goniatite (empty shells, the arms gone) | 25 | 3 to 8 cm | 0.046 |

Each lies on its left side, turned at random, sunk into the mud by about a fifth of its width, anywhere from 5 to 65 m
from the middle of the world. They are not added to the zoo lists: the zoo names the living. The numbers of dead are
a choice (estimate), not a finding.

## How it works

An instance with b.y = 0.0001 is dead (no living one is that slow: the slowest, the goniatites, swim at 0.015).
For it a.xyz is its place on the floor (a.y already raised by the lift times its size), a.w the way it is turned;
b.x, b.z and b.w are as for the living. The vertex shader keeps all its work and at the end, for a dead one only,
puts the rest shape (no motion) on its side at that place; it hands the fragment shader its seed plus 10. The
fragment shader darkens a dead one and lays black mud on what faces up.

## What to copy

### 1. Every vertex shader: vsCladoselache, vsStethacanthus, vsCtenacanthus, vsDunkleosteus, vsTitanichthys,
vsKentuckia, vsConcavicaris, vsGoniatite

Right before its last line `return o;` insert:

```wgsl
  // ---- dead on the floor (devonian-remains.md): b.y = 0.0001 marks an animal that lies still on its left side on the
  // mud, at a.xyz (world.js has raised a.y so that it is sunk in by a fifth of its width), turned by a.w
  if (abs(i.b.y) < .001) {
    let Td = vec3f(sin(i.a.w), 0., cos(i.a.w)); let Sd = vec3f(0., 1., 0.); let Ud = cross(Td, Sd);
    let pd = DEAD_P;
    let wd = i.a.xyz + (Sd * pd.x + Ud * pd.y + Td * pd.z) * i.b.z;
    o.cp = g.vp * vec4f(wd, 1.); o.wp = wd; o.n = Sd * i.n.x + Ud * i.n.y + Td * i.n.z; o.sd = i.b.x + 10.;
  }
```

`DEAD_P` is `i.p` in every shader but two:

- vsGoniatite: `select(i.p, vec3f(0., 0., .44), i.n.w > .8)`: the arms (aux 0.9) are gone, only the shell is left.
- vsStethacanthus: `i.p`, but its dead one must be a male, because its brush and claspers are folded away only in the
  motion code: world.js gives it the seed 0.074 (`stethMale(0.074)` is 1).

### 2. Every fragment shader: the same eight

Right before its line `let n = skinRelief(...)` insert:

```wgsl
  // ---- dead on the floor (devonian-remains.md): duller and darker, black mud settled on what faces up
  let deadF = step(5., i.sd); let deadUp = ss(.15, .75, normalize(i.n).y);
  alb = mix(alb, mix(alb * .55, vec3f(.030, .028, .024) * (.8 + .4 * vn(i.wp * 6.)), .85 * deadUp), deadF);
```

(`alb` is the albedo there in all eight; `vn` comes with W_ANIM.)

### 3. world.js

At the top of `makeWorld`, right after `const { backdrop, gyExact } = W;`, add the helper:

```js
  // dead animals on the floor (devonian-remains.md): pushed after the living ones and never into the zoo lists. Each
  // call has its own random numbers, so nothing else in the world moves. lift: half the body width (in body lengths)
  // times 0.6, so that the body is sunk into the mud by a fifth of its width
  const deadOnFloor = (arr, n, s0, s1, lift, seed, sd = -1) => {
    rseed(seed);
    for (let k = 0; k < n; k++) {
      const a = rr(0, TAU), r0 = rr(5, 65), x = cos(a) * r0, z = sin(a) * r0, size = rr(s0, s1);
      arr.push(x, gyExact(x, z) + lift * size, z, rr(0, TAU), sd < 0 ? rnd() : sd, 0.0001, size, rnd());
    }
  };
```

and right before each line that hands an array to its kind:

| Before | Insert |
|---|---|
| `KENTUCKIA.data = ...` | `deadOnFloor(kentuckias, 30, 0.08, 0.12, 0.033, 521);` |
| `CONCAVICARIS.data = ...` | `deadOnFloor(concavicaris, 40, 0.04, 0.07, 0.075, 522);` |
| `GONIATITE.data = ...` | `deadOnFloor(goniatites, 25, 0.03, 0.08, 0.046, 523);` |
| `CLADOSELACHE.data = ...` | `deadOnFloor(cladoselaches, 2, 1.4, 1.8, 0.042, 524);` |
| `STETHACANTHUS.data = ...` | `deadOnFloor(stethacanthusArr, 1, 0.8, 1.1, 0.042, 525, 0.074);` |
| `CTENACANTHUS.data = ...` | `deadOnFloor(ctenacanthusArr, 1, 1.4, 1.8, 0.041, 526);` |
| `DUNKLEOSTEUS.data = ...` | `deadOnFloor(dunkleArr, 1, 4.1, 4.1, 0.070, 527);` |
| `TITANICHTHYS.data = ...` | `deadOnFloor(titanArr, 1, 4.1, 4.1, 0.085, 528);` |

Use the names of the arrays as they are in world.js. Nothing else changes: not the zoo lists, not the cards.
Every kind's block starts with its own `rseed`, so the living stay where they are. Only what comes after the last
call (`W.snow`, if it draws random numbers) lands elsewhere; that does not matter.

## Acceptance

1. Diving to the floor one finds, here and there, a dead Dunkleosteus, a dead Titanichthys, dead sharks, small dead
   fish, empty Concavicaris shells and goniatite shells lying still on their sides, half in the black mud, darker than
   the living, their upper sides dusted black.
2. None of them moves; the zoo does not name them.
3. The living animals are where they were before (no random number of theirs has changed).
4. `node tools/wgsl.mjs devonian` passes; frame time reported before and after.

## Not checked

Nothing of this was rendered or compiled here: the snippets are short and the same in all eight shaders, but whether
each name exists in each (`alb`, `i.b.x`) was checked only by reading the engine files. The number of dead, their
places and the mud are estimates.

Sources: Barron and Ettensohn 1981, "Paleoecology of the Devonian-Mississippian black-shale sequence in eastern
Kentucky", https://doi.org/10.2172/6459347 (abstract); `era-devonian.md`, "Sea floor".
