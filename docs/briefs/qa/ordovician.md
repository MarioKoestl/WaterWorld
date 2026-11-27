# Second check: the Ordovician (Claude)

**Open now: `megalograptus` (section M, a rebuild), `isotelus` (I) and `astraspis` (A), at the end of this file.** The
two cephalopods passed Mario's look on 2026-11-25 (ten arms, no hood, living skin: `ordovician-life.md`, stages E and
F). Sections 1 to 6 below are their history and are not to be worked off any more.

## 1. Round 0: what the pictures show

The rebuild is in the pictures: a crown of about 35 tentacles, a dark body, a hood, a funnel. The critic failed both
kinds and is right. The hand-over's reason ("the mesh detail does not read at these distances") is not: the picture
`endoceras/diver.png` is taken from 1 m, and it shows that the parts themselves are still basic shapes.

- **Tentacles are wires.** Measured in `orthocones/head.png`, in diameters of the shell's opening (D): about 4 to 5 D
  long, about 0.04 D thick, the crown nearly 5 D across. All bend back in the same arc, like a whisk. Kinks show: too
  few stations along the length.
- **The body is half a ball** as wide as the opening, with a hard edge at the shell. No gap, no rim over it.
- **The hood is a flat slab with corners** lying on that ball. The front of the body is a flat disc with a few
  corners, and the tentacles sprout from its edge.
- **No eye** in any picture.
- **Endoceras is one grey-green** from shell to tentacle tips. Its rings keep one spacing from opening to tip.
- **Orthocones:** bands of one width, and all round the shell as far as one can see. The brief says: upper side only.
- **Two pictures break step 2 of the gate.** `endoceras/head.png` shows the edge of the tentacle crown and no head.
  In `orthocones/head.png` the head is about 7 % of the picture's width.

## 2. Correction 1: these four things, in this order, nothing else

All lengths in D. All numbers are estimates after Nautilus, the living model.

**a. The `head` picture.** The soft parts plus 1 D of shell, centred, filling half the picture's width or more. Fix
`--qa` so that it does this for both kinds. No animal cut by the edge.

**b. Tentacles.**

- Length 1 to 2.5 D, each its own (hash of its number).
- Round, eight sides. 0.08 to 0.10 D thick at the root, 0.02 D at the tip. Twelve stations or more along the length.
- Two rings: about 18 on a circle of 0.8 D, about 17 on one of 0.5 D, the inner ones shorter, angles jittered. At
  the root they nearly touch (18 x 0.09 D is 1.6 D of a circle 2.5 D round), so the crown has mass there.
- At rest they point forward as a loose bundle, 20 to 40 degrees off the axis, tips drooping a little. None bends
  back past its own root. Each has its own bend and its own phase.
- The roots start inside the front of the body, and the surface swells around the bundle. No flat disc.

**c. Body, hood and eye as one skin.**

- One skin from 0.3 D inside the shell to the tentacle roots, ten stations or more, about 1 D long outside.
- (The dark gap asked for here on 2026-11-24 was wrong and is withdrawn: see section 5a.) Outside it swells to
  almost 1 D across and narrows to 0.8 D at the roots. It does not taper to a point, and it has no hard edge.
- The shell ends in a lip 0.04 D thick. The inside of the shell is dark.
- The hood is no part of its own. The upper third of the same cross-sections is raised by 0.10 to 0.15 D and
  widened, so that its edge overhangs the sides a little. It reaches back to the lip and ends rounded over the
  tentacle roots, about 0.8 D long. Wrinkles as low relief.
- The eye is a swelling of 0.2 D on each side, just under the hood's edge, in the same skin, with a real dent of
  0.05 D that is dark inside.
- The funnel is a tapering tube of 0.3 D with an open end, growing out of the underside, pointing forward and a
  little down.
- The soft parts are then 3 to 4 D long in all. For Endoceras (D = 0.3 m) that is about 1 m of 5.7 m.

**d. Tone, bands and rings.**

- Both kinds: shell pale; body clearly darker and warmer; hood darkest; tentacles paler toward the tips.
- Endoceras: no pattern on the shell (no source). The spacing of the rings grows with the local diameter, and their
  depth fades toward the tip (estimate: a shell grows in proportion).
- Orthocones: bands on the upper side only, as the brief says. Widths differ by up to 30 % (hash), edges soft.

Then: build, render, look at `head.png` yourself, critic (round 1), whole answer into `verdicts.md`.

## 3. Fixes of the critic that are NOT to be followed

The critic sees pictures and knows no sources. Where its fix contradicts the brief, the brief wins.

- "About 90 tentacles": the brief says 30 to 40.
- "Suckers": Nautilus has none (known anatomy, not looked up today).
- "Beak", "parrot-beak mouth": it lies hidden inside the crown. Do not model it.
- "Large, prominent eyes": 0.2 D, as above.
- A colour pattern for the shell of Endoceras ("tan/brown", "stripes", "mottling"): no source, so no pattern.
- "Longitudinal waviness", "taper not linear", "longitudinal ribs", "encrustation", "webbing": no. The shell of an
  orthocone is a straight cone with a round cross-section. Fine growth lines as low relief: yes.

## 4. Given form (new, see step 3 of `quality-gate.md`)

Pass this sentence to the critic for both kinds: "Given form: in the real animal the shell is a straight cone with
a round cross-section." Without it, question 1 can never be answered with no.

## 5. Round 1 (afternoon): better, still NOT DONE, and why

The animal now reads as a cephalopod: the tentacles point forward, the body has a tone of its own, the given form
worked (the critic no longer blames the cone). What still fails, with the cause in `swimmers_orthocones.js`
(`endoceras` was not read, its pictures show the same):

- **Wires.** The radius function of the tentacle falls from the root to `tipR * 1.5` (0.015 D) within the first 8 %
  of the length, and the root is 0.04 D, not 0.08 to 0.10 D. So 92 % of every tentacle is a thread.
- **No eye.** The body has 14 vertices round (`SM = 14`), one every 0.45 rad. The eye is a bump 0.12 rad wide. It
  falls between the vertices. In Endoceras it lands on a few and gives a flat patch with corners.
- **Dome with a seam.** The body's first ring is welded to the inner ring of the rim, so there is no gap. The hood is
  a lift of 0.10 D that fades to nothing at its sides: no edge, no overhang, so the whole reads as half a ball.
- Endoceras only: one grey-green still, and a bright streak along the top of the shell (question 6).

Stopped here as agreed. Correction 2 is not spent. Mario decides how to go on.

## 5a. Rounds 2 and 3 (shared `nautiloidSoft()`, built on Fable): a large step, still NOT DONE

Looked at: the pictures of round 3 and both verdicts. For the first time it reads as a nautiloid: an eye one can
see, a darker hood, tentacles with thickness, each with its own bend. What still fails falls into three groups.

**Caused by this file (Claude's fault), now changed:**

- **The dark gap is withdrawn.** A living Nautilus fills the opening of its shell; the mantle lies against the
  inside of the lip (known anatomy, not looked up today). The gap of section 2c made the "plug in a pipe". New: the
  body meets the inside of the lip all round, and the lip laps over the tissue by about 0.05 D. The only shadow there
  is the one the lip's thickness throws.
- **The eye may be a broader mound,** up to 0.25 D across, low, with a fold of skin over it under the hood's edge.
  The hole stays 0.05 D. The pale ring round the hole goes: it is what makes the eye a button.

**Caused by the prompt ("leave the shells"), now lifted. The shells may be changed:**

- The lip: 0.06 D thick, rounded, no bright edge line. At present it is a thin sheet.
- Orthocones: section 2d was never done. Bands of differing width, soft edges without the jagged noise line.
- Endoceras: the spacing of the rings grows with the local diameter, their depth differs from ring to ring and
  fades toward the tip, the lengthwise sheen band goes.
- No colour pattern for Endoceras and no waviness of the cone: section 3 stays.

**Not blocked by any rule, simply not there yet:**

- **The head is still a ball.** In side view give it an outline of its own: the top (the hood) long and nearly
  straight, sloping down toward the front; the underside shorter and flatter; the front not a cap but a collar of
  about 0.7 D out of which the arms leave, with the mouth area inside it sunk and dark.
- **The hood is a patch of colour.** Make its edge a step in the form: 0.04 to 0.06 D proud of the body all along,
  with the shadow under it. The change of tone sits on that step. No border line.
- **The arms sprout from the ball.** The first 0.3 D of every arm sits in a sheath about 1.3 times as thick as the
  arm; neighbouring sheaths are fused into one fleshy collar; the hollows between them are dark. No arm passes
  through another at the root.
- **Kinks.** At 1 m the arms of Endoceras show straight pieces. More stations, or a smooth curve through them.
- **No shade in the creases.** Arm roots, under the hood's edge, round the eye and at the lip: darker.
- **The school is copies.** Pitch of the bands, tone and pose of the arms from the seed of the instance.

All numbers are estimates after Nautilus. One build and one round of the critic for this; a second only if the
first shows clear gain.

**Open for Mario:** question 12 compares with a photograph. It may stay a yes even when 1, 2 and 4 turn to no. Then
Mario's own look at the pictures decides, not the critic.

## 5b. Rounds 4 and 5: Claude's look says good enough to go on, Mario decides

The critic failed both again. Claude's own look at the pictures of round 5: the head has an outline with a hood
fold and a brow, the arms are smooth and sit in sheaths, the funnel is an open tube, the lip has a thickness. Six
rounds have failed, among them this one, which is far from the cones of the morning. The gate as it stands may never
pass a kind; Mario decides whether its rule changes (see the chat of 2026-11-24).

What is left is small and is work on shader and tool, for any model:

- **Mouth in front view (Endoceras `diver.png`):** dark rings one inside the other, like a target or a third eye.
  Make it one plain dark hollow, mostly hidden by the arm roots.
- **Edge of the hood's tone:** still a jagged line from a noise threshold. Soften it and keep it on the step.
- **Bands of the orthocones:** the same jagged edges, and still too even from tip to opening (section 2d).
- **Under the lip of Endoceras** the shadow is as dark as a hole. Lighten it until it reads as shade.
- **Tool:** `--qa` frames the group line for group kinds. It needs one individual (a per-individual zoo line, or the
  orbit of the kind in the tool), so that `head` shows one head.
- Benchmark: the arms have 20 stations now (about 40 % more triangles in the tentacles). Run `bench.mjs` once.

## 6. Still open, apart from these two animals: the haze

Claude Code measured fog `exp(-SIG*d)` with SIG = (.028, .017, .020) per metre: a dark animal has lost half its
contrast at about 25 m (red), 41 m (green), 35 m (blue). The brief asks for about 60 m of view. Mario decides. Do
not change the world for the gate.

## History

- Morning: the first pictures showed a school and a speck. Since then the gate asks for one animal, close.
- Noon: six rounds had judged yesterday's model, because the dev page was never rebuilt. Since then the gate builds
  first and the tools refuse a stale page.

## I. `isotelus`: Mario's look, 2026-11-25

Mario: the design is rather cool. Two faults, both in `meshIsotelus` (`walkers_isotelus.js`); lengths in body
lengths, as the mesh has them.

**I1. Legs stick out behind the tail.** The last of the 15 pairs stands at z = -0.468, and the tail ends at -0.5.
There the shield is 0.14 wide to each side and the rim 2 % of the length away, so every step carries the feet out
from under it.

- Seen from above, no part of a leg may ever leave the outline of the shield: keep a margin of 0.03 through the
  whole step, for walking animals and for those lying dug in.
- The last pair no farther back than z = -0.40. Under the tail the legs get shorter and stand closer to the
  middle, pair by pair.
- Check it in numbers: for every leg, at 20 moments of its step, the distance of the foot and of the knee from the
  outline. Print the smallest. It must not be under 0.03.

**I2. The thing at the side that looks like a feeler** is the genal spine. It is right that the animal has one at
each back corner of the head (`docs/research/ordovician/isotelus.md`). As built it is a round wire of 0.008 that
starts inside the head, runs 0.02 to 0.03 outside the edge of the body, and ends beside the tail at z = -0.185.

- Make it a flat blade that is the head's own rim drawn out backward: shared vertices with the rim, the outer
  edge of the head running on into the outer edge of the spine without a step.
- About 0.03 wide at its root, as thick as the rim, tapering evenly to a point.
- It lies against the edge of the thorax, never more than 0.005 away from it, and ends at the fourth segment
  (z about 0, an estimate inside the printed range; it never reaches the tail).
- It moves with the head and does not sway.

**I3. One thing to look at, not reported by Mario:** the fine pale and dark dots on the shield are about one pixel
wide in his picture. Move the camera slowly past one animal. If they flicker, fade them out with distance.

Then: build, `--qa`, look at the pictures yourself. No critic for this correction. Mario looks.

**I4. The eyes (Mario, 2026-11-25, after I1 to I3 passed his look): "they look odd".** As built, each eye is a flat
dark bead with a thin dark tube bowed over it, standing clear of the head. From above that reads as two hooks or
horns. And the parts are the wrong way round: the tube, called the lid, bows outward, where the seeing surface
belongs.

What the sources say: eyes of this kind (holochroal) are "small contiguous lenses set on a curving visual surface"
(a review of work on trilobites, its title and author not verified, https://core.ac.uk/download/429714842.pdf). In
the relative Asaphus that surface is a piece of an almost perfect spheroid (E. N. K. Clarkson, "The eyes of
Asaphus raniceps Dalman (Trilobita)", abstract,
https://dn790000.ca.archive.org/0/items/biostor-165102/biostor-165102.pdf). For Isotelus the repo's note has
"large short eyes". The rest below is our reconstruction; no source for Isotelus gives these measures.

- **One low tower out of the cheek,** in one skin with the head, no part standing free. Its footprint is a bean:
  about 0.06 long, 0.03 wide, the round side outward. Height 0.02 to 0.025 ("short").
- **The outer wall is the eye:** a smooth, bulging band about 0.015 high that runs round the outer side from the
  front over the side to the back, about half a circle (estimate). It leans outward a little, so it also looks up.
- **The top is the lid:** a nearly flat cap in the colour of the shell. On the inner side it rises out of the
  cheek as a gentle ramp. On the outer side it ends in a small rim that stands a little over the eye band.
- **The look of the band:** very dark, smooth, and the one glossy thing on the animal: one soft, long highlight.
  From close up a very fine even grain of lenses, just visible. (Even is right here: it is what the fossil has.)
- No hook, no tube, no ball.

Then: build, `--qa`, and one more picture with one eye a quarter of the picture wide. No critic. Mario looks.

**I5. Something sticks out at the back (Mario, 2026-11-25, after I4).** In his picture a rounded, glossy, bluish
lump sits on the tail, at the rear end of the middle ridge. Find what it is before changing anything. First
suspect: the soft body under the shield (the `loft` with aux -0.4 in `meshIsotelus`). Its rear end lies at
z = -0.44 with its top at about 0.089, and the shield there is about 0.075 to 0.08 high (Claude's arithmetic from
the code, not run). If so: end the body at z = -0.36, let it taper, and keep its top 0.008 or more under the
shield everywhere. Print the smallest gap between the body's top and the shield over the whole length.

**I6. Seen from the side** (`body.png`, and at the right in Mario's picture): the sides of the thorax hang under
the line of the rim as a row of square flaps, like a comb, and the genal blade stands in front of them as a
straight round rod along the whole thorax.

- The edge of the thorax lies level with the rims of head and tail. The end of each segment is rounded and points
  a little backward. No square teeth.
- The blade as I2 says: flat, lying on the edge, ending at the fourth segment. At present it reaches the tail.

Then: build, `--qa`, look at `body.png` and at one picture from behind and above. No critic. Mario looks.

## A. `astraspis`: to be rebuilt (Mario, 2026-11-25: "it has to become more beautiful too")

It was built on 2026-11-23, before the gate, and never went through it. Claude has read `swimmers_astraspis.js`
and seen no picture of it. What the code says:

- The body is one spindle of twelve rings, the same kind of shape from snout to tail. No shield, no head.
- The eyes are two balls stuck on, one inside the other. The gills are eight little pegs. There is no mouth.
- The plates are contour lines of a noise (`cos(pn * 22.)`), the scales a product of sines: no plate, no scale.
- The light is the old `skinWet`. The whole fish bends when it swims, the bony shield with it.

**What the sources say** (checked 2026-11-25):

- Sansom, Smith, Smith and Turner 1997, "Astraspis: the anatomy and histology of an Ordovician fish",
  Palaeontology 40, abstract (https://palass.org/publications/palaeontology-journal/archive/40/3/article_pp625-643):
  a dorsal head shield of many-sided plates, the ones below more irregular; on them bumps that are star-shaped or
  smooth, round or oval; well-developed eye sockets right in front of the gill openings; eight uncovered gill
  openings in a line that slopes back and down; grooves of the senses on each side of a pineal spot on top; the
  tail covered by large diamond-shaped scales; the end of the tail unknown.
- Wikipedia, "Astraspis" (https://en.wikipedia.org/wiki/Astraspis), body text: about 20 cm; oval in
  cross-section; plates of the forebody over 2 mm; "relatively large" eyes at the sides. It gives the tail scales
  as under 1 mm, against Sansom's "large": Sansom is the first-hand source and wins.
- Not in any source read: the width, the outline, the mouth, how tall the tail was, every colour, how it swam.

**The living models** (for the critic and for the builder): the armour of a boxfish (many-sided bony plates under
thin skin) for the surface; a tadpole for the tail and the way of swimming. The shape comes from the fossil.

**Build it new, by the recipe of `quality-gate.md`.** Lengths in body lengths. Marked (e) is an estimate.

1. **Two forms in one skin.** In front the shield: broad, low, blunt-snouted, flat below, about 45 % of the
   length, ending in a rear edge one can see, a small step down to the tail (e). Behind it the tail: narrower at
   once, growing taller than wide toward its end (e), running out into a low rounded blade of the same skin. No
   slab stuck on.
2. **Eyes in sockets.** A round opening in the shield with a low raised rim, about 0.035 across (e), at the side,
   right in front of the first gill opening. In it a dark ball, the one glossy thing (the eye of stage F,
   plainer: no iris lines).
3. **Eight gill openings:** small slanting oval holes with a dark inside and a soft rim, in a line that slopes
   back and down from behind the eye. Holes in the skin, not pegs on it.
4. **A mouth** (e): a small cross slit, low at the very front, without jaws, with a soft dark inside.
5. **Plates on the shield:** true many-sided cells (`wor`), about 0.012 across, shallow grooves between them as
   relief, on each one low bump: some smooth, some with short rays like a star, seen only from close. More
   irregular below. On top a small pineal spot on the middle line between the eyes with a shallow groove on each
   side.
6. **Scales on the tail:** diamonds in slanting rows, about 0.02 long, each overlapping the next like a tile, the
   rows a little uneven. They get smaller toward the end.
7. **Tone and light:** `skinTone` and `skinLive` as for the trilobite: bone under thin skin, dull. Darker above,
   paler below, uneven at three sizes, darker in every groove. No pattern. Each fish its own.
8. **Motion.** The shield does not bend: it only swings a few degrees to each side against the tail (the recoil of
   a fish without fins). Only the tail bends, more toward its end. The fish rolls and noses up and down a little:
   it is a clumsy swimmer. Tail beats come in bouts with short glides between. All of it from sines of the time
   (stage C1 of `ordovician-life.md`: nothing may jump).
9. The far mesh follows. The numbers of stage G stay.

**The gate:** `--qa` with `body`, `head`, `diver`, `skin` and `eye`; the critic with the living models above, two
rounds at most; verdicts word for word; then stop. Mario's look decides. Update
`docs/research/ordovician/astraspis.md` with the figures used.

## M. `megalograptus`: build it again from nothing (Mario, 2026-11-25)

The first build failed the critic twice and Mario's look at once ("I have not seen anything this ugly for a long
time"). The gate did its work. What his picture from above shows:

- The body is one flat smooth lump from head to tail: no head, no plates lapping over each other, no rings.
- A flat mustard patch lies on its back, painted on.
- Every limb is a bent wire with no joint, leaving from the edge of the body. The spines are needles on a wire.
- A paddle is a wire with a small pad at its end.
- The eyes are two pale dots. No scale, no relief, one tone.

So nothing of points 1 to 7 of the build section ("The last animal" in `ordovician-life.md`) is there. Do not
mend this mesh and its shader: write them new, point by point, after that section. Keep what is sound: the
measures in `docs/research/ordovician/megalograptus.md` (check them against figure 2 of GeoFacts 34 once more),
the walker code if the steps do not slide, and about 20 animals, far apart.

Before the critic, answer for yourself from `body.png` and the picture from above: can one count the six broad
plates? Does every limb show its joints? Do the limbs come out from under the head? If one answer is no, the
picture does not go to the critic yet.

**M2. The rebuild (2026-11-26): Claude's look.** The critic failed it twice; the form is there all the same. In
`diver.png` it is a sea scorpion at first sight: head shield, six plates one can count, ringed tail, bulb, black
dagger, blades, paddles, jointed spiny arms, the eye as a kidney mound with its dark band. Not following the critic
on the raised rim and the keels was right. Left to correct, all small:

1. **The scales look like drops of water** (`head.png`, `skin.png`): round beads, each with a bright ring. Make
   them flat, low, uneven tiles lying on the shell, darker than the shell, with no highlight of their own: about a
   third of the present height, no gloss from the relief.
2. **The colour is olive green.** The source has M. ohioensis mostly dark brown with black scales, the limbs
   darker to their tips, the spike black. Only the spike is right. Check the tone in a picture taken from 1 m, so
   that the water's colour does not decide it.
3. **A limb lies on top of the head shield** (`head.png`, lower left, at the eye), and on the right one piece of a
   limb shows a pale flat end with corners. Every limb stays under the edge of the shield where it leaves the body,
   and every piece is closed and shaded like the rest.
4. **Stray thorns** stand on the upper side of the head shield and the plates (one in the middle of the shield in
   `head.png`). Bristles only along the edges of limbs and plates, as the build section says.
5. **Seen from the side** (`body.png`) the tail is a straight pipe lying on the mud, its joints one even black
   ring after the other. Let it rise a little toward the spike and sag between, and make the joints differ a
   little in width and depth. The head end is cut off in that picture: frame the whole animal.
6. **Two dark smudges on the mud** beside the animal in `diver.png`, not under it. Say what they are. If they are
   its shadow, the shadow belongs under the body.

No critic for this. Build, `--qa`, look yourself, then Mario looks.

**Open beside this animal:** `ways.mjs` fails for Endoceras: one round dips 55 cm into the rock at about (-30, 47).
Move or shrink that round until `ways.mjs` passes.

**M3. It is a paper cut-out (Mario, 2026-11-27).** "Not bad, but it looks like a 2D paper cut-out, the 3D model is
missing; one sees it extremely when the scorpion swims."

He is right, and the figures in `walkers_megalograptus.js` say why (lengths in body lengths):

- The broad front body is 0.22 wide, and its back rises 0.029 over its edge. The soft underside is a narrow roll
  of 0.017 half-height that does not reach the edges. From the side that is a sheet with a thin sausage under it:
  about a fifth as high as wide in the middle, and a mere edge at the sides.
- The head shield rises 0.036 over its edge at 0.21 width.
- When it swims the body keeps the pose of the walker: level and stiff.

No source gives the thickness: the fossils are pressed flat, and figure 2 of GeoFacts 34 is a view from above. So
the thickness is ours to set, after the living models (horseshoe crab, scorpion). Estimates:

1. **Front body:** the back rises 0.05 over the edge, the belly hangs 0.035 under it and is 0.85 as wide as the
   plates. Thickness in the middle about 0.085: well over a third of the width.
2. **Every plate ends in a flank:** at its side it turns down into a low wall of about 0.015 before the edge, so
   that the side view shows a wall and not a line.
3. **Head shield:** 0.06 over its edge in the middle, with steeper sides and the downturned front as it is. Under
   it a real underside: the roots of the limbs round the mouth, and behind them a broadly triangular plate (the
   metastoma; Wikipedia, "Megalograptus", read through a summary).
4. **Belly:** lapping plates like the back, paler, in shade. Closed everywhere: no place where one looks into the
   animal from below or behind.
5. **Tail rings:** as tall as they are wide.
6. **It stands higher:** the edge 0.06 over the mud (now 0.028), so that the belly clears it. The walking legs
   grow with it.
7. **Swimming is a pose of its own:** nose up by 8 to 15 degrees, a small roll and a small rise with every
   stroke of the paddles, the tail bending in its joints (up at the stroke, trailing between), a lean into the
   turn. All from sines of the burst's own time (stage C1).
8. **The far mesh** keeps these cross-sections. If 358 vertices cannot, take 700.

**Check:** print the height and the width of the front body from the mesh (target: height 0.35 of the width or
more). `--qa`, and two pictures of one that swims: from the side (`swim-side.png`) and from below and behind
(`swim-below.png`). No critic. Mario looks.

**M4. The motion (Mario, 2026-11-27, after M3: "looks better").** Three things: the animations are still to be
made; he misses the feelers in front, they should move; and the feet collide with the two things it swims with.

A sea scorpion has no antennae. What feels ahead are the two great spiny limbs: some of their spines end in
bulbs that may have been organs of sense, and the limbs may have served for feeling as well as for seizing
(Wikipedia, "Megalograptus", read through a summary). So "the feelers" are these limbs, and they hardly move:

- In `vsMega` the great limbs sway by 0.03 of the body's length at the tip, once in 14 s (`t * .45`). Nobody sees
  that. Tail and blades move by about one degree.
- The feet of the walking legs stand at z = 0.28 and 0.21, 0.13 and 0.16 out: where the paddle limb lies folded
  back, and in the path of its stroke (0.09 fore and aft). While it swims the legs trail back into that path.

1. **The great limbs feel,** each by itself, never in step:
   - a slow sweep from side to side, 0.12 at the tip, and up and down, 0.06, once in 3 to 6 s;
   - the limb bends in its joints, more toward the tip, so it curls and stretches; it is no stiff rod turning at
     the root;
   - now and then the tips tap the mud ahead while it walks;
   - every 15 to 30 s both close quickly in front of the mouth and open again slowly, like a basket.
2. **Legs and paddles each get their own room.** The walking legs stand forward and out, beside the head shield:
   no foot behind z = 0.31 at any moment of a step. The paddle limb leaves behind them and lies back along the
   plates, a little off the body and clear of the mud. While it swims the legs fold forward under the head, not
   back. Check in numbers: the smallest distance between any walking leg and the paddle limb of its side, over a
   whole step and over a whole stroke. It must not fall under 0.01.
3. **The paddle works like an oar:** flat side against the water on the stroke back, edge first on the way
   forward. Between bursts it lies folded and now and then makes one slow fanning stroke.
4. **The tail lives:** it lifts by 6 to 12 degrees and sinks again, once in 6 to 10 s; the blades beside the
   spike open and close by about 0.03 on their own slow time.
5. **Walking shows in the body:** a small sway to the side with every step, the head nodding a little.
6. The small limbs at the mouth: twice their present movement.

Everything from sines of the time or of the animal's own clocks, nothing may jump (stage C1 of
`ordovician-life.md`). The zoo line follows what it has to. Lengths in body lengths.

**Check:** the number of point 2; eight pictures of one that walks, 0.5 s apart, from the front and above
(`feel-0..7.png`), and eight of one that swims, from the side. `ways.mjs`. No critic. Mario looks.

**M5. The swimming (Mario, 2026-11-27, after M4: "the animations are good now, but the swimming is nothing").**
Two faults: at the start it paddles wildly, which looks bad; and while it swims it zigzags, which does not look
dynamic. What he wants: a start with one real stroke of the tail for momentum, then roughly straight on, rowing
with the paddles all the way, and changing depth in one wave.

Why, read in `walkers_megalograptus.js` and `walkers_isotelus.js` (not run):

- **The zigzag:** the burst only adds way along the walking round (`s = wkS(...) + B.x`). That round is a polygon
  of 2 to 6 corners, a few metres across, and `wkPose` turns the animal on the spot by 60 to 180 degrees at every
  corner. A burst of 4 to 8 m crosses one to three corners, so the swimmer turns sharply in mid-water.
- **The frantic start:** the paddles row at a fixed 7.5 rad/s (`rwa = t * 7.5`, about 1.2 strokes a second) and
  reach full stroke within half a second, while the way along the round is a smoothstep that hardly moves at
  first. Full rowing with no speed reads as panic.

What the sources say: the sixth limbs are the swimming paddles, and the blades beside the spike probably served as
a rudder (Wikipedia, "Megalograptus", read through a summary). A tail stroke to start is in no source read; it is
Mario's choice for this world, and the parts it needs (a jointed tail, a spike, blades) are all there.

**Build the swim as a flight of its own, no longer a way along the walking round.** All phases come from one
time of the burst and its smooth functions (stage C1: nothing jumps). Estimates throughout.

1. **Crouch, 0.3 s:** the body sinks a little toward the mud, the tail curls up at its joints, the spike rises,
   the blades close. The paddles stay folded.
2. **The kick, 0.25 s:** the tail strikes down and back in one stroke from its root to the spike, the blades
   open wide. The body leaves the mud, forward and up at 20 to 30 degrees, at its top speed: about 1 m/s (twice
   its cruising speed). The tail then trails.
3. **Glide out, about 0.6 s:** no strokes; the speed falls toward cruising, the nose comes down toward level.
4. **Cruise, 6 to 12 s:**
   - Both paddles row together, slowly and strongly: one stroke in 0.9 to 1.3 s, each animal its own.
   - The first two strokes grow to full size, the last two die away; the rate never jumps.
   - Every stroke gives a small surge of speed and a small rise; the body pitches a little with it.
   - Cruising speed about 0.5 m/s. The tail is held straight as a rudder and bends a little into a turn.
5. **Glide down and land, about 1.5 s:** the paddles fold, the legs reach down, the body levels and touches the
   mud, then walks on.

**The path, seen from above:** straight from where it lifts off, in the heading it had. In the whole cruise the
heading changes by 30 degrees at most, in one smooth arc, never in steps. If it has to come back to its walking
round, the way back is one wide turn of 4 m radius or more, then straight again, and it lands on its round.
The walk takes up from where it landed, without a turn on the spot (or lands where the round's next straight
begins, facing along it).

**The depth:** one long wave over the cruise: up by 1 to 2 m and down again, each animal its own height and
length, never closer than 0.3 m to the mud (the shader reads `ground()`, the zoo line `zooGround`). The body
pitches with the slope of the wave: nose up while it climbs, down while it sinks, plus the small pitch of each
stroke. It banks into a turn.

**The zoo line** (`mgAt`) follows the flight. Bursts every 20 to 40 s as now.

**Check, in numbers:** over a whole burst at 60 Hz, the largest change per frame of the body's axis (target: 4
degrees during the kick, 1.5 elsewhere) and of its place as a multiple of the average step (target 2.5); the
largest change of heading in the cruise (target 30 degrees); the smallest height over the mud. `ways.mjs`. Then
eight pictures of one burst from the side, 0.4 s apart from the crouch on (`swim-0..7.png`), and eight from above
over the whole flight (`swim-top-0..7.png`). No critic. Mario looks.
