# Brief: the Ordovician comes alive (numbers and motion), 2026-11-24

Mario, after the cephalopods passed his look: the animations do not fit, and there are far too few animals. Nothing
is crowded. Both faults come from the brief, not from the builder: its numbers were small, and it said almost
nothing about motion. This file replaces the numbers of `era-ordovician.md` (its table is updated) and adds the
motion of the two cephalopods. Two stages, one session each, a stop after each. Any model.

## What is there now (read from `world.js` and the shaders, 2026-11-24)

- 150 orthocones in 5 groups, 45 Astraspis in 3 groups, 2 Endoceras, about 200 graptolites, in a world of 200 m by
  200 m with some 40 m of view. A diver sees less than one group on average.
- A group of orthocones is 30 animals on one ring: about 6 m along it, 0.5 m wide, 0.3 m high. Beads on a string.
- Both cephalopods travel with the arms in front. All arms of an animal shift together, as one block.
- The trilobite and the sea scorpion are not built yet (stage 4 of `era-ordovician.md`).

## Stage A: numbers

| Kind | Now | New |
|---|---|---|
| `orthocones` | 5 groups of 30 | 14 groups of 20 to 60, and about 60 alone or in pairs: about 600 |
| `endoceras` | 2 | 4, far apart |
| `astraspis` | 3 groups of 15 | 10 groups of 15 to 40: about 250 |
| `graptolite` | 6 swarms of 25 to 40 | 30 swarms of 60 to 150: about 3,000 |
| `isotelus` (when built) | about 60 | about 250 |
| `megalograptus` (when built) | about 6 | about 12 |

- **Groups are clouds, not rings.** Spread the orthocones of a group over its whole space: 2 to 5 m to the side and
  1 to 2 m up and down, each animal with its own place, its own speed (up to 20 % off the group's) and its own
  rhythm. Groups differ in size, height above the floor (1 to 8 m) and the width of their round.
- **Every height has something** (`era-common.md`): graptolites high and in the middle, orthocones in the middle
  and low, Astraspis and Endoceras at the floor.
- **Cost.** The budget is the GPU time of `today` (`era-common.md`, "Spend the budget"). An orthocone has many
  triangles in its arms now. If the benchmark goes over the budget, give the far ones a simpler mesh (fewer
  stations and sides in the arms) before cutting numbers. Report `bench.mjs` before and after.
- **Check:** three wide pictures from a diver's height at three places (`tools/out/qa/ordovician/crowd-1..3.png`).
  In each, count the swimmers one can see and say the number in the hand-over. If `accept.mjs` checks the old
  numbers, change what it expects.

## Stage B: motion of the cephalopods

What the sources say, and what is our own conclusion:

- NOAA Ocean Service, "What is a nautilus?" (https://oceanservice.noaa.gov/facts/nautilus.html): the animal pulls
  its body into the chamber, "creating jet propulsion to thrust itself backwards and to make turns".
- Neil and Askew 2018, Royal Society Open Science, abstract (https://pmc.ncbi.nlm.nih.gov/articles/PMC5830708/):
  "Animals swam with either an anterior-first or posterior-first orientation."
- Peterman and Ritterbush 2021, "Vertical escape tactics and movement potential of orthoconic cephalopods", PeerJ
  (https://peerj.com/articles/11797), abstract, read in the review copy at
  https://par.nsf.gov/servlets/purl/10290095: straight shells without counterweights hang upright;
  "orthocones sacrifice horizontal mobility and maneuverability".
- Peterman (first author) 2026, "Exploring the influence of cameral deposits on the stability, orientation, and
  maneuverability of orthocone cephalopods", Cambridge University Press, abstract
  (https://www.cambridge.org/core/product/4763770DD12D2D1493FBBAF279A0B84E/core-reader): deposits in the chambers
  are read as counterweights, "allowing these cephalopods to assume postures other than a default, downward-facing
  orientation".
- Our conclusion (not in any source): the small orthocones travel shell tip first in jerks and hang a little head
  down between them; Endoceras, a hunter at the floor, glides level and head first, slowly. That the shell of
  Endoceras held deposits heavy enough to keep it level, and whether Treptoceras had any, was not checked.

**Orthocones**

1. **Shell tip first.** The body's axis points against the direction of travel. Change the zoo line with it.
2. **One jet, one cycle** (the cycle of 2.5 to 3.5 s that is there). In the first quarter: the head pulls about
   0.08 D into the shell, the arms close to a bundle a little over half as wide and stream straight out behind the
   travel, the funnel tightens. In the rest: the head comes out again, the arms open slowly to their rest spread,
   the animal slows and sinks a little.
3. **Every arm moves by itself.** No shift of the whole crown. Bend each arm in its own plane (toward and away from
   the axis) and a little sideways, with a phase that depends on its angle round the axis, so that neighbours
   differ. The wave runs from root to tip; the root stays still, the tip moves most. Slow: 3 to 6 s per wave.
4. **Posture.** Between jets the shell tip stands 10 to 25 degrees above level, each animal its own angle; during a
   jet the animal levels out. (An estimate, see above.)
5. **Not all at once.** The jets of a group are not in step, and a tenth of the animals pause for some seconds.

**Endoceras**

1. Head first, level, slow, as now. The speed swells and fades by about 20 % every 6 to 8 s, and with each swell
   the head pulls about 0.05 D in and comes out again.
2. The arms of the lower half reach down and forward to the floor and feel along it, each by itself; the upper
   ones trail. Point 3 of the orthocones holds here too, slower.
3. It turns in wide bends only. A shell of 5.7 m never swings round.

**Check for both:** eight pictures of ONE animal from the side, 0.4 s apart, through one cycle
(`tools/out/qa/ordovician/<id>/motion-0..7.png`), and a line in the hand-over on what changes from picture to
picture. Claude in the chat looks at them. No critic: it judges form, not motion.

## Stage C: corrections after Mario's look at stages A and B (2026-11-24, evening)

Mario: direction and so on are right. But the motion stutters, "like a PowerPoint"; Endoceras does not move at all;
and there is something odd on the head. Causes, read in `swimmers_orthocones.js` and `swimmers_endoceras.js`:

**C1. The stutter: values that jump when the jet cycle starts again.** In `vsOrthocone`, where `jx = fract(jc)`:

- the posture `pt` is 10 to 25 degrees at `jx` = 1 and 0 at `jx` = 0: the whole animal snaps level in one frame;
- the sinking `snk` jumps back from 0.076 to 0 in the same frame;
- the speed of travel jumps from 8 % to full in one frame (`tj` with `exp`).

The rule from now on: **no pose, angle or place may depend on `fract`, `floor` or `step` of the time.** Build all of
it from sines and cosines of one cycle angle, so that nothing can jump:

```
let th = TAU * (jc - .12);                                        // jc = t / Pj + fract(s * 3.7), no fract of it
let tj = Pj * (jc + (.8 * sin(th) + .125 * sin(2. * th)) / TAU);  // speed swings smoothly from 0.43 to 2.05
let pl = pow(.5 + .5 * cos(th), 3.);                              // 1 at the jet, 0 between: head in, arms closed
let pt = (.17 + .26 * h.y) * (1. - pow(.5 + .5 * cos(th), 2.));   // level at the jet, tip up between
let snk = .04 * (.5 - .5 * cos(th));                              // sinks between, rises with the jet
```

The zoo line in JavaScript repeats `tj`: change it with it. These five lines were not compiled or run by Claude.

**C2. The arms tear on one side.** The wave uses `ang * 2.3` with `ang = atan2(l.y, l.x)`. Where `atan2` wraps from
pi to minus pi the phase jumps by a third of a wave, in the middle of an arm. Use a whole number (`ang * 2.` or
`ang * 3.`), in both files.

**C3. Endoceras does not move.** It does, at 0.10 to 0.20 m/s: a shell of 5.7 m needs half a minute for its own
length. Its arms sway by a few centimetres every 8 to 12 s. New (estimates, no source):

- travel at 0.4 to 0.6 m/s (`b.y` of about 0.018 to 0.028 at radii of 20 to 25 m);
- the arm wave three times as wide and with a period of 4 to 7 s;
- the reach of the lower arms toward the floor stays.

**C4. The odd thing on the head** is the "hood wrinkles": `sin(x * 250. + z * 120.)` (Endoceras: `350`, `180`),
which draws even dark bars along the hood from close up. Remove it in both files. If the hood needs a surface, use
the texture `tg` as low, irregular relief, weak enough that no line can be followed. The same for the "tentacle
ridges" `sin(atan2(y, x) * 16.)`: they are bars round the body's axis, not round an arm. Remove them.

**C5. Is it also the frame rate?** 600 orthocones are drawn with the full mesh at every distance (the kind has no
simpler mesh for far ones). Run `bench.mjs`. If a frame takes longer than at the start of the day (GPU 5.9 ms on
average at 2560 x 1440), give the far ones a simpler mesh as stage A says, and report both numbers.

**Check, in numbers, not pictures:** with the zoo line of one orthocone and one Endoceras, step the scene time at
60 Hz through 30 s and print the largest change per frame of (a) the direction of the body's axis, in degrees, and
(b) the place, as a multiple of the average step. Target: (a) under 1.5 degrees, (b) under 2.5. If the zoo line
does not carry the posture, repeat it in the tool for this check.

## Stage D: Endoceras moves like its small relatives (2026-11-24, late)

Mario after stage C: the motion of the orthocones is very good. Endoceras is not, and it travels the wrong way.
Head first was this brief's choice (stage B) and is withdrawn.

1. **Shell tip first,** as in `vsOrthocone`: the body's axis points against the travel. Change the zoo line too.
2. **The same jet cycle, heavier.** Take the five lines of C1 with a period of 6 to 9 s instead of 2.5 to 3.5 s, and
   weaker: speed from about 0.75 to 1.5 of the average (`.35` and `.06` in place of `.8` and `.125`), head pull
   0.05 D, arms closing to about three quarters of their spread, no tilt of the shell (`pt` = 0) and no sinking.
3. **The arms** keep their own waves (C2, C3). The lower ones reach toward the floor only while the animal is slow
   (multiply the reach by `1. - pl`); at the jet all stream out behind the travel.
4. Average speed stays 0.4 to 0.6 m/s.

Check: the numbers of stage C again for Endoceras (largest change per frame of axis and place).

## Stage E: new heads, ten arms and no hood (Mario, 2026-11-24, late)

Mario: both have odd skulls, what is that on top, and are the two the same model in two sizes? Yes: the hood and the
35 tentacles are Nautilus, copied onto both by this project's own notes. Nothing of it is fossil.

What the source says: a reconstruction of early shelled cephalopods calls its own soft bodies "largely speculative",
gives ten arms because the early squids have ten and the embryo of Nautilus starts with ten arm buds, and names the
hood and the Nautilus eye as speculation (caption of figure 1, https://pmc.ncbi.nlm.nih.gov/articles/PMC3112087/figure/F1,
DOI 10.1186/1471-2148-11-115; the article's title could not be fetched). Our conclusion: ten arms are better
founded than 35, for both animals, and the hood goes. Everything below is our reconstruction, in D (diameter of the
shell's opening). No arms of either animal are known to us.

**For both, in `nautiloidSoft()`:** make these things parameters, so that a later era can still ask for a Nautilus.

- **No hood.** The top of the head is the same smooth skin as its sides, in the same tone. A low brow over each eye
  stays. Take the hood's lines out of both shaders (tone, relief, the lifting in the vertex shader).
- **Ten arms in one ring,** five on each side, the left the mirror of the right in place and length (the pose may
  differ). Angles a little uneven. The roots are fused into one fleshy collar round the mouth; no sheaths.
  Round, smooth, no suckers, no hooks. The funnel sits below, between the lowest pair.
- **One plain tone** for head and arms, a little darker on the upper side (estimate), arms paler to the tips.
- The far mesh (`lo`) follows.

| | `orthocones` | `endoceras` |
|---|---|---|
| Arms: length | 2 to 3 D, the pairs differ | 1 to 1.5 D |
| Arms: thickness at root, at tip | 0.12 to 0.14 D, 0.02 D | 0.16 to 0.18 D, 0.04 D, blunt |
| Ring of the roots | 0.6 D across | 0.7 D across |
| Head | slender: widest 0.95 D, collar 0.6 D | broad and blunt: widest almost 1 D, collar 0.75 D |
| Eye: mound, hole | 0.28 D, 0.07 D | 0.15 D, 0.04 D |

**Motion:** unchanged (stages C and D). Check that closing to a bundle and the reach to the floor still look right
with ten thick arms: the arms must not pass through each other at the roots.

**Check:** build, `--qa` for both kinds, look at the pictures yourself. No critic: it would measure a ten-armed
animal against Nautilus. Claude in the chat and Mario look. Run `bench.mjs`: ten arms in place of 35 should cost
less; report the number.

## Stage F: a living skin and a real eye (Mario, 2026-11-24, night)

Mario after stage E: the eyes do not look real, and everything else looks extremely like plastic, not real at all.
Claude's look at `head.png` and `diver.png` of both kinds agrees. And Endoceras still swims head first: **stage D
was never run** (`vsEndoceras` still holds the code of stage B). Run stage D first.

Why it is plastic (pictures, and `skinWet` in `swimmers.js`):

- **One flat tone** over head and arms, with nothing in it at any size. This brief asked for exactly that ("one
  plain tone"), and before it the notes took out every surface detail. That was wrong.
- **The light is paint-shop light:** plain diffuse, ambient, and a round highlight on top of the head. No light
  through thin parts, no darker creases, none of the moving light patches that lie on the floor next to it.
- **The eye is a grommet:** a ring and a dot on a mound with eight flat sides.
- **The form is an egg with pegs:** the arms pass into the head with a hard seam (the fused collar of stage E is
  not there), and the lip of the shell and the eye mound show their flat faces.

**F1. One shared function for living skin** (in `swimmers.js`; later eras will use it for every soft animal):

- **Tone at three sizes,** from noise in the animal's own space (`fbm`, `wor`, `vn` of the engine), so nothing
  repeats and nothing lines up: (1) large: darker on the upper side, paler below, a soft change; (2) middle: uneven
  blotches, 10 to 20 % lighter and darker, a little warmer and cooler; (3) fine: a dust of small dark dots, denser
  in the dark blotches, thinning out toward the arm tips. Every animal its own from its seed.
- **This narrows rule L5.** L5 forbids a pattern that claims something (stripes, bands, spots) without a source. It
  does not forbid the unevenness every living skin has. Soft parts keep to plain browns and greys.
- **Light:** diffuse that wraps round the form a little; light coming through the thin parts (the outer half of
  the arms, the funnel) when they are lit from behind, pale and warm; a faint rim in the water's colour; the
  moving light patches of the floor (`caus`, `cuv`) on what faces up; darker in every crease (arm roots, under the
  lip, round the eye). The highlight becomes broad, weak and broken by the fine noise: no round hot spot.
- **Fine relief:** the normal tilted by the fine noise, strongest on the top of the head, almost none on the arms.

**F2. The eye** (our reconstruction; with ten arms the model is the eye of a living squid, not the pinhole of
Nautilus): a smooth ball of 16 sides or more, sunk into a socket with a fold of skin round it. A round black
pupil, an iris in uneven brown and dull gold with fine lines running outward, darker at its rim. The ball alone is
glossy: one small sharp highlight, nothing else on the animal has one. Sizes as in the table of stage E.

**F3. Form:** the arm roots truly fused into the collar (one skin, shared rings, no seam, a hollow between
neighbours); a head that is not an egg: flatter below with a groove for the funnel, a swelling behind each eye, a
narrowing before the collar; smooth normals on the lip and the eye mound.

**The check:** two new pictures per kind with `--qa`: `skin.png` (the head from 2 D away) and `eye.png` (the eye a
quarter of the picture wide). Then the critic once per kind with: living model "a living squid or cuttlefish, seen
close", the given-form sentence, and these two pictures plus `head.png`. Two rounds at most. Verdicts word for word
into `verdicts.md`. Claude in the chat and Mario look after that; Mario's look decides.

**What this can reach:** an animal that passes for alive from a diver's distance. Not the look of a film model:
that needs sculpted models with painted textures, which this engine and this way of working do not have.

## Stage G: teeming with life, in a smaller sea (Mario, 2026-11-25)

Mario: the models are fine now. But the Ordovician was to be sprawling with life, and there is still far too
little in it, and the map is too large for it. Much more of what exists, then on to the next animal.

Where it stands (`world.js`, `era.js`, read 2026-11-25): about 600 orthocones, 250 Astraspis, 3,000 graptolites and
4 Endoceras over a disc of 95 m radius, and a player who can swim 110 m out (`edge`). Small animals of 15 to 40 cm
spread that thin are specks. And in the pictures the floor is bare mud with a stalk here and there.

**G1. A smaller sea.** `edge` from 110 to 75 (the six poses and the flight lie within 70 m and stay). All centres
of groups within 80 m of the middle. Standing life dense to 85 m and thinning out to 105 m, so that the view
outward from the edge is not empty.

**G2. Numbers** (the table of `era-ordovician.md` is updated):

| Kind | Now | New |
|---|---|---|
| `orthocones` | about 600 | about 2,500: 45 groups of 20 to 80, and 150 alone or in pairs |
| `graptolite` | about 3,000 | about 12,000: 80 swarms of 80 to 220 |
| `astraspis` | about 250 | about 900: 30 schools of 15 to 45 |
| `endoceras` | 4 | 6, at heights of 1 to 3 m; their rounds may cross |
| `crinoid` | sparse | meadows of 3 to 6 per square metre on about a quarter of the floor |
| `bryozoan` | on ledges | every ledge covered edge to edge, four times as many |
| `horncoral` | hundreds | about 3,000, in loose fields |
| `brachiopod` | pavements | as now, and more wherever the mud between the meadows is bare |
| `isotelus`, `megalograptus` (when built) | 250, 12 | 600, 20 |

**G3. Cost.** The budget stays the GPU time of `today` (`era-common.md`). Save in this order: a simpler far mesh
for every swimmer that has none (Astraspis, graptolites); no swimmer drawn beyond 70 m from the camera, if that
is cheap to do (the haze ends the view at about 40 m); and only then fewer graptolites. Ask before a change of the
engine that is more than small.

**Check:** print how many of each kind there are, before and after. For each of the six poses print the number of
swimmers within 20 m (target: 120 or more) and make one picture (`crowd-1..6.png`). `bench.mjs` before and after.
In no picture a stretch of bare mud wider than about 3 m in the foreground, except where a pose is meant to show
open mud (pose 5: there the swimmers carry the picture).

## The next animal after stage G: `isotelus`

As stage 4 of `era-ordovician.md` says (its build notes hold), with what this file has taught:

- Tone at three sizes and the light of `skinTone` and `skinLive` (stage F), adapted to a hard shell: no light
  through it, the dots and blotches quieter, a dull broad sheen at most.
- The living model for surface and motion is the horseshoe crab (a smooth domed shield, ploughing through mud).
  The shape comes from the fossil, not from the crab.
- 600 of them, many half dug in, in loose crowds on the mud between the meadows.
- The gate with `--qa`; the critic two rounds at most; then stop. Mario's look decides.

## Stage H: a floor that looks like a sea floor (Mario, 2026-11-25)

Mario: the sand should look more real and more natural. (It is lime mud in the brief; the wish is the same.)

Why it looks unreal (`look.js`, material 0, and every picture of this era):

- **It is blown out.** Sunlit mud is almost white in the pictures, so no form can show in it.
- **It is smooth on purpose:** `bump = .12` and `hgt = .7` on mud. What is left is a faint veined tone, and that
  reads as polished marble.
- **Nothing the size of a hand:** no ripple, no pit, no mound, no grain.
- **Things stand on it as on a table:** nothing sinks in, nothing has drifted against anything.

What to build. The measures are estimates; that this floor had ripples was not checked in a source.

- **H1. Not white.** Sunlit mud lies between 60 and 80 % of white. Reach it through the mud's own colour and
  shading. Ask before changing `expo` or the sun: Mario has accepted the water.
- **H2. Relief at three sizes,** in the shading (the mesh is too coarse for it):
  - hand-sized: ripple marks in patches where the floor is level, on about a third of the mud. Use `rip` (as
    `today/look.js` does), but never one straight cosine: crests that wind, fork and end, 6 to 14 cm apart, their
    direction turning slowly from place to place. Fade them out with distance before they shimmer.
  - finger-sized: marks of burrowers on the smooth mud between: pits with a low rim, alone and in clusters, a few
    to the square metre, and short crooked furrows.
  - grain: pale specks of broken shell and darker grains, more of them in the troughs, seen only within about 3 m.
- **H3. Tone follows relief** (L7): troughs and pits darker and greyer, crests paler; patches of shell hash paler
  and coarser; and large slow patches where the mud is a little darker or lighter.
- **H4. Things sit in it.** Round the foot of every stone, sea lily, horn coral and thicket: a soft darker ring
  and the mud drawn up a little. Four times the grit, gathered in the troughs and against the stones.
- **H5. What stays:** the moving light patches, pale lime mud and grey limestone as the brief has them, the
  ledges.

**Check:** the six pose pictures, one picture from 0.5 m above the mud looking along it (`floor-close.png`), and a
number from `png.mjs`: the share of floor pixels brighter than 235 of 255 in each pose picture (target: under 2 %).
The look of the place is Mario's to decide (`era-common.md`, stage 1). No critic.

Later, not now: trails behind walking trilobites and the pits where they rested. That needs a source first.

## The last animal: `megalograptus`, the sea scorpion (2026-11-25)

Stage 4 of `era-ordovician.md`, its second walker. Sources checked again on 2026-11-25.

**What the sources say**

- Ohio Geological Survey, GeoFacts 34, "Megalograptus ohioensis: Ohio's Giant Sea Scorpion" (M. E. Peter, 2021,
  https://dam.assets.ohio.gov/image/upload/ohiodnr.gov/documents/geology/GF34_Peter_2021.pdf), first paragraph:
  up to 75 cm, "among the largest marine predators living 445 million years ago". Its figure 2 is the
  reconstruction of the whole animal with every part named.
- Wikipedia, "Megalograptus" (https://en.wikipedia.org/wiki/Megalograptus). Read through a summary, so nothing
  here is its wording:
  - M. ohioensis 49 to 78 cm.
  - Head shield roughly square, flat, without a raised rim; its front edge turned down, with six small spikes
    pointing down.
  - Compound eyes kidney-shaped, of middle size, near the edge; two small simple eyes in the middle.
  - Six pairs of limbs. The third pair is the great one: massive, heavily spined, bendable, about 3.5 times as
    long as the head shield. The fourth pair short and spiny, the fifth without spines, the sixth the swimming
    paddles.
  - Behind the head six broad segments, widest at the third; then the body narrows.
  - At the end a stout sharp spike with rounded blades beside it that could close as a grasping organ; when it
    swam they probably served as a rudder.
  - Small scales of uneven size all over; many have a hole in the middle that probably held a bristle.
  - Colour of M. ohioensis, worked out from the fossils: mostly dark brown with black scales, the limbs darker
    toward their tips, the spike black.
  - Near the shore, among trilobites, lamp shells and moss animals. Probably ate soft prey such as trilobites
    that had just shed their shell.
- Not in what was read: the measures of the parts, the second pair of limbs, how it walked and swam. How many
  blades stand beside the spike: the era brief has one on each side (after GeoFacts 34, figure 2); check there.

**Before modelling:** open figure 2 of GeoFacts 34, measure the parts in lengths of the body, and write them into
`docs/research/ordovician/megalograptus.md`. Measure only; no picture goes into the repo. Where the figure and
the estimates below differ, the figure wins.

**Estimates to start from** (body length 1, spike included): head shield 0.17 long and 0.19 wide; the six broad
segments 0.30 long, 0.24 at the widest; the narrow part 0.33 long, from 0.10 down to 0.06 wide, round; the spike
0.20. The great limbs 0.6 long. Animals from 0.5 to 0.78 m.

**The living models** (for the critic and the builder): a horseshoe crab and a scorpion for shell, joints and
bearing; the swimming leg of a swimming crab for the paddle. The shape comes from the fossil.

**How to build it** (the recipe of `quality-gate.md`, and what this file has taught):

1. **The body is three forms in one line:** the flat square head, the broad low front body of six overlapping
   plates, the narrow tail of rings ending in the spike. Each plate laps over the next with a real edge.
2. **Limbs come out from under the head,** from round the mouth, not out of its sides. From above one sees them
   appear under the edge of the shield.
3. **A limb is a chain of hard pieces with joints,** not a bent tube: every piece a little flattened and curved,
   wider at its ends; between two pieces a short narrower ring of softer, paler skin. Six to eight pieces.
4. **The great limbs** carry long spines in two rows, pointing forward and inward, of uneven length, each growing
   out of its piece with a widened foot (shared vertices, not stuck on). At rest they are held forward, half
   folded, a basket in front of the mouth.
5. **The paddles:** the last pieces flattened to an oval blade, the limb bent forward at its third piece.
6. **Eyes** as for the trilobite (section I4 of `qa/ordovician.md`): a kidney-shaped low mound near the edge, its
   outer wall the dark seeing band. Two small dark dots in the middle of the head.
7. **Surface:** `skinTone` and `skinLive` for a hard shell, dull. The sourced colour: dark brown, black scales,
   limbs darker to the tips, spike black. Scales as small low bumps of uneven size, denser on the back; a short
   dark bristle on some, as geometry only along the edges of limbs and plates where it shows against the light.
8. **Motion** (our reconstruction; nothing may jump, stage C1):
   - Walking: slowly, on the fourth and fifth pairs, the body low, steps tied to the way walked as for the
     trilobite. The great limbs sway and feel ahead. The paddles lie folded back. The tail trails, a little raised.
   - Swimming in short bursts: it lifts off, the paddles row together five to eight strokes, the limbs fold
     against the body, the blades beside the spike spread as a rudder, then it glides down and lands. Most of the
     time it walks or stands.
9. **Number and place:** about 20, each alone, far apart, each with its own round of 10 to 20 m, near the crowds
   of trilobites. A few stand still beside a ledge.
10. A far mesh. The budget of `era-ordovician.md` (12,000 vertices) holds for the near one.

**The gate:** `--qa` with `body`, `head`, `diver`, `skin`, `eye` and one picture from above; the critic with the
living models, two rounds at most, verdicts word for word; then stop. Mario's look decides.

## Stage I: giants of every size at every height, and scorpions one can find (Mario, 2026-11-27)

Mario: too many big squids, all starting at the same height; make it more diverse. And he cannot see the
scorpions.

What `world.js` and `walkers_megalograptus.js` hold (read 2026-11-27):

- **200 Endoceras,** every one 5.7 m long, every one 1 to 3.3 m over the mud. Stage G asked for 6.
- **17 sea scorpions** in a sea of 80 m radius, each walking a round smaller than itself, none swimming (the
  bursts of the build section were not built). Dark, low and slow: nobody finds them. Claude had cut their number
  from about 90 to about 20; that was too hard a cut.

**I1. Endoceras: 100, all different.** (Mario, the same day: not fewer, it should look full. 100 it is.)

- Sizes (`b.z`): about 12 of 4.8 to 5.7 m, 35 of 3 to 4.5 m, 53 of 1.8 to 3 m (younger animals; an estimate).
- Heights over the mud: anywhere from 1 to 12 m, the largest mostly in the lower half. No two within 12 m of each
  other in the same 2 m of height.
- The smaller, the quicker: jet period and speed go with the size (a 2 m animal about twice the pace of a 5.7 m
  one). Rounds from 10 to 30 m, some of them tilted, so an animal also climbs and sinks on its way. The check
  against ledges takes half the animal's own length, not 2.8 m.
- If the benchmark goes over the budget: a nearer `lodFrom` and a simpler far mesh first, the number last.

**I2. Orthocones:** groups at every height from 1.5 to 12 m over the mud (now 2 to 8), the loners too.

**I3. Sea scorpions: about 45, and they swim.**

- About 45 (the table of `era-ordovician.md` is updated). Still each alone, 6 m or more apart. Two within 6 to
  12 m of each of the six poses, four near the start, the rest by the crowds of trilobites.
- A walking round of 3 to 8 m across, not smaller than the animal.
- **Build the swimming burst** of the build section (point 8): every 20 to 40 s, each animal at its own time, it
  lifts 0.5 to 1.5 m off the mud, rows with both paddles together, travels 4 to 8 m with arms folded and the blades
  spread, glides down and walks on. Nothing may jump (stage C1). The zoo line follows it.

**Check, in numbers:** how many of each kind before and after. For each of the six poses: the sea scorpions within
15 m (target 2 or more) and the Endoceras within 30 m with their sizes and heights (target: their heights spread
over 6 m or more, their sizes over 2.5 m or more). `ways.mjs` and `bench.mjs` (it stood at GPU 9.2 ms on average
with the 200 giants).

## Not in this task

The motion of Astraspis and the graptolites was not looked at. Mario says if it does not fit either.
