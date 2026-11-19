# Devonian: two motion bugs (giants tail first, goniatites jumping)

Mario, 2026-11-19, after item 11h: "some fish now swim backwards, that must not be. And the ammonites spin right
round and jump from one place to another."

Two separate bugs. Only vertex shaders and zoo functions change.

## 1. Dunkleosteus and Titanichthys swim tail first

**Cause.** An error in `devonian-giants-motion.md`. The distance along the path always grows, so the angle along the
path always grew too, whatever the sign of `b.y`. `T` was still multiplied by `sign(i.b.y)`. Every animal with a
negative speed (half of them, at random) therefore faced against its own motion.

**Fix.** The sign of `b.y` goes onto the angle: for a negative speed the angle runs backwards, `T` turns with it, and
the animal swims head first. Checked in the numpy copy of the shader for both signs and both kinds over 300 s: the
facing and the direction of motion agree everywhere (cosine 1.0).

In `vsDunkleosteus` (the same in `vsTitanichthys`, there with `s * 1.9`):

```wgsl
  var a = sign(i.b.y) * dist / L + i.b.w * 6.3 + s * 2.1;
```

In `zooDunkleosteus` (the same in `zooTitanichthys` with `titanZooDist` and `1.9`). `sign` is not one of the globals
of `engine/math.js`, hence the comparison:

```js
  const L = 0.9 * a[i + 3], v = a[i + 5];
  const g = (v < 0 ? -1 : 1) * dunkZooDist(a[i + 4], abs(v), F[TIME]) / L + a[i + 7] * 6.3 + a[i + 4] * 2.1;
```

`docs/briefs/ref/dunkleosteus-shader.wgsl`, `docs/briefs/ref/titanichthys-shader.wgsl` and
`devonian-giants-motion.md` carry the fix.

## 2. Goniatites jump back and forth

**Cause.** In `vsGoniatite` the jet was added to the angle along the path as a pulse,
`pow(max(sin(t * 2.5 + s * 20.), 0.), 4.) * .3`, which rises and falls again. Every 2.5 s each animal moved 0.3 rad
(about 2.4 m on a path of 8 m radius) forward and the same distance back, each at its own moment. In numbers (numpy,
40 animals, 20 s): peaks of 8 m/s for a shell of 5 cm, on average 1.9 m/s of back and forth for a group that moves
0.16 m/s. In a group with a negative speed the jet pushed the animals backwards. The heading swung with the angle by
up to 17 degrees each time, and the shell tilted on a sine that had nothing to do with the jet.

**Fix.** The jet becomes a step in a time that only grows: every 2 to 3 s (a beat of its own for each animal) a jet,
then it coasts and slows down. The mean speed of the group stays as it was, the peak just after a jet is about 2.7
times the mean (0.3 to 0.4 m/s). The shell rocks with each jet and is level again before the next one. Checked in
numpy and, for the zoo function, in Node: the angle never runs against the direction of the group.

The new `vsGoniatite`, replacing the old one in `swimmers_goniatite.js`. Everything after the line `let ph` is as
before except the rocking (`bob`):

```wgsl
@vertex fn vsGoniatite(i: VI) -> VO {
  var o: VO;
  let t = g.cam.w; let s = i.b.x;
  let h = vec3f(hs(s), hs(s + .37), hs(s + .71));
  let R = i.a.w;
  // jet propulsion: every 2 to 3 s (a beat of its own for each animal) it jets, then coasts and slows down. tj is
  // the time it has swum at the speed of its group: it only ever grows, fast just after a jet, slowly before the
  // next one, so the animal never slides back. Peak speed about 2.7 times the mean
  let Pj = 2. + fract(s * 7.31);
  let jc = t / Pj + fract(s * 3.7);
  let jx = fract(jc);
  let tj = Pj * (floor(jc) + (1. - exp(0. - 2.5 * jx)) / .917915);
  let ta = tj * i.b.y + i.b.w * 6.3 + (h.x - .5) * (6. / R);
  let ph = i.b.w * 17.;
  let P = i.a.xyz + vec3f(R * cos(ta), .8 * sin(2. * ta + ph), R * .5 * sin(ta));
  let T = normalize(vec3f(0. - R * sin(ta), 1.6 * cos(2. * ta + ph), R * .5 * cos(ta))) * sign(i.b.y);
  let S = normalize(cross(vec3f(0., 1., 0.), T)); let Up = cross(T, S);
  let off = S * ((h.y - .5) * .6 + sin(t * .3 + s * 30.) * .1) + Up * ((h.z - .5) * .4 + cos(t * .3 + s * 20.) * .08);
  var l = i.p; var n = i.n.xyz;
  let sz = i.b.z * (.85 + .3 * h.z);
  // the shell rocks with each jet: it tips as the jet pushes and settles while it coasts (0 at the jet and before it)
  let bob = .12 * sin(TAU * jx) * exp(0. - 2. * jx);
  let cb = cos(bob); let sb = sin(bob);
  l = vec3f(l.x, l.y * cb - l.z * sb, l.y * sb + l.z * cb);
  n = vec3f(n.x, n.y * cb - n.z * sb, n.y * sb + n.z * cb);
  let w = dodge(P + off, .5 * sz + 2. * g.fwd.w, 0., 0.) + (S * l.x + Up * l.y + T * l.z) * sz;
  o.cp = g.vp * vec4f(w, 1.); o.wp = w; o.n = S * n.x + Up * n.y + T * n.z; o.op = i.p; o.sd = s; o.lt = i.n.w;
  return o;
}
```

The new `zooGoniatite`:

```js
// ---------------------------------------------------------------- zoo
// A group of goniatites: the path of vsGoniatite without the per-individual offset, with the same jets (the group
// has seed 0 here). Two lines from the middle
const zooGoniatite = (a, i, part) => {
  const s = a[i + 4], Pj = 2 + (s * 7.31 - floor(s * 7.31)), jc = F[TIME] / Pj + (s * 3.7 - floor(s * 3.7));
  const tj = Pj * (floor(jc) + (1 - exp(-2.5 * (jc - floor(jc)))) / 0.917915);
  const R = a[i + 3], ph = a[i + 7] * 17, ta = tj * a[i + 5] + a[i + 7] * 6.3, tb = ta + (part * 2 - 1) * 2 / R;
  const x = R * cos(ta), y = 0.8 * sin(2 * ta + ph), z = R * 0.5 * sin(ta);
  ZP[0] = a[i] + x; ZP[1] = a[i + 1] + y; ZP[2] = a[i + 2] + z;
  ZP[3] = R * cos(tb) - x; ZP[4] = 0.8 * sin(2 * tb + ph) - y; ZP[5] = R * 0.5 * sin(tb) - z; ZP[7] = 0.6;
};
```

The comment above `S_GONIATITE` in the file stays; the instance layout does not change.

## Steps

1. Read this file. Re-read every file of the repo right before changing it.
2. The two lines of part 1 in `swimmers_dunkleosteus.js` and `swimmers_titanichthys.js` (shader and zoo).
3. `vsGoniatite` and `zooGoniatite` in `swimmers_goniatite.js`.
4. `node tools/wgsl.mjs devonian`.
5. Look in the page with `--walk`: at least one Dunkleosteus or Titanichthys of each direction, and a group of
   goniatites from about 2 m. Report the frame time before and after.
6. Stop and report to Mario.

## Acceptance

1. Every Dunkleosteus and every Titanichthys swims head first, whichever way round it goes.
2. No goniatite ever moves backwards. Each moves in small jets, one every 2 to 3 s, not all at once; between jets it
   coasts and slows down. No jumps.
3. The shell rocks a little with each jet and is otherwise steady.
4. The name hint still finds the goniatite groups and the giants.
5. `node tools/wgsl.mjs devonian` passes; frame time reported.

## Not checked

- Not compiled; brackets checked by a script, the logic in numpy and Node.
- Whether the jumping explains all of what Mario saw as "spinning right round". If a shell still turns over after
  this fix, the next suspects are the facing along the path (`T`, pitch up to about 25 degrees on the small paths)
  and `dodge()` near the diver.
- The jet beat (2 to 3 s), the coasting and the rocking are free choices. How goniatites swam is not known; living
  *Nautilus* swims by jets, but its numbers were not taken over.
