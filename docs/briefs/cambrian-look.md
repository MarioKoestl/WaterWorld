# Brief: the look of the Cambrian

The Cambrian works, but beside `today` it does not look good. This brief says what the pictures show, why, and what
could be done about it, as a numbered list of proposals. The first step is one picture in three moods, from which
Mario picks.

- **Asked for by:** Mario, 2026-11-16: next to `today` the Cambrian looks empty, everything is sand, there are no
  shafts of light, a lot is missing.
- **Accepted:** Mario accepted every proposal on 2026-11-16, also W3, B6, P2 and C2. On the same day he asked for
  better animals: the trilobites look flat, like 2D. The section "The animals" (K1 to K9) is new since then.
- **State:** stage 1 is made (`tools/out/moods/final/index.html`). The mood is Mario's pick.
- **Order:** item 9 of `TODO.md`, after the Cambrian is at true scale and its walkers are in.
- **Files expected to change:** `source/eras/cambrian/` (all of it), perhaps the engine in general terms, `CLAUDE.md`
  if the engine learns something new.
- **Replaces:** the atmosphere targets of `era-cambrian.md` where the two disagree. Sizes, exhibits and card texts
  of that brief stay.

Read `CLAUDE.md` first, then `era-cambrian.md` and `scale.md`.

## What the pictures show

Looked at on 2026-11-16: the six poses of the Cambrian (`tools/out/poses/g2-pose1.png` to `g2-pose6.png`), the close
render `tools/out/critic-26/cambrian-fish-tulip.png`, and next to them `tools/out/critic-26/today-pose1.png` and
`today-pose2.png`.

| | `today` | Cambrian now |
|---|---|---|
| Colour | teal water with pink, purple and gold against it | one green: water, mud, rock and haze in the same hue |
| Light | a bright side and a dark side on everything, shafts, moving flecks | even from all sides: no lit side, no shadow, no shaft, no fleck |
| Depth | clear near, layers of silhouettes behind each other | a pale veil over everything from a few metres on; the wall is a grey shape in fog |
| Ground | rock, corals, plants: hardly a bare patch | smooth mud over most of every picture |
| Life | everywhere, at every height | one small bed of tulip animals per picture, a few jellyfish, otherwise nothing |
| Framing | kelp and rock close to the camera, a large thing in the middle | nothing between the camera and the horizon |
| Sparkle | glints, bubbles, drifting specks | none that can be seen |
| Places | the whale fluke, the ship, the grotto | none: the wall, the one landmark, is hidden in haze |

One picture is good: `cambrian-fish-tulip.png`. Seen from 18 cm the tulip animals stand like trees, with a shoal
passing overhead. It shows what this world can be.

The animals themselves, looked at on the same day in `tools/out/walkers/shots/final-fish-olenoides-*.jpg`,
`final-diver-olenoides-side.jpg`, `tools/out/kinds/c11-*-hint.png` and `tools/out/moods/final/C-fish.png`:

- **The trilobite is a plate with a dome.** From the front it looks like a hat lying on the mud: cheeks and side
  lobes are one thin, level sheet with a knife edge. The eyes are dark ovals on that sheet, the spines flat
  triangles, the surface one smooth pale colour like plastic. Its legs hardly show. From a diver's height it is a
  pale coin on the floor.
- **Marrella** lies in `C-fish.png` as black feather shapes on the mud.
- **Hallucigenia** is round, but one colour and smooth.
- **Of the small swimmers no picture shows the animal.** In `c11-opabinia-hint.png` and `c11-marrella-hint.png` it
  is a speck. Nobody could judge them from these, the visual critic included.

## Why it is so

Most of it was asked for. `era-cambrian.md` set "soft and even light", "no flecks on the ground", "faint broad shafts
at most", a surface that cannot be seen, and colours "kept quiet". Those were defaults by Claude, and they made a flat
picture. They are withdrawn (see Decisions). The rest came with the true scale: animals of a few centimetres in a
world 200 m across.

| What | Now | For comparison, `today` |
|---|---|---|
| Strength of the shafts (`ERA.rays`) | 0.07 | 0.54 |
| Flecks of sunlight (`caus`, `caus2` in `air.js`) | the constant .33: none | animated from the water texture |
| Sun against the light from all around (`SUNC`, `AMB`) | sun 1.0, all around 1.3 to 1.5: the sun loses | sun 1.45 to 1.7, all around 0.2 to 0.8 |
| What is overhead (`above`) | one flat colour, and `veil` fades everything high into it | the surface from below with waves and the sun |
| Water (`SIG`, `KD`) | scatters red and blue almost as much as green and swallows little: pale and milky | swallows red: deep colour, clear near |
| Shadows of small things | none: the shadow map has about 9 cm a texel | plants and set pieces are large enough |
| Gardens (`GARDENS` in `world.js`) | 4, each with a bed 2 to 3 m across and 380 to 850 tulip animals | the whole world is overgrown |
| Glints, bubbles | 0 | both |
| Drifting flakes (`SNOWZ`) | 1.2 to 5.7 mm: invisible to a diver | 12 to 57 mm |
| GPU time of the flight, average | 6.2 ms | 13.0 ms |

And the animals: the fossils of the Burgess Shale are pressed flat in the rock. A body modelled on the outline of
such a fossil is that outline. The trilobite's shield rises 0.025 to 0.055 of its length over its rim (`trH` in
`walkers.js`): 2 to 5 mm on an animal of 9 cm. Under it lies a flat belly.

The last row of the table is from `tools/out/bench-items2to6.log` (2560×1440, RTX 2060). The Cambrian uses half of
what `today` uses on the same machine. There is room to spend.

## Decisions

| Decision | By |
|---|---|
| The Cambrian has to look as good as `today`. Now it looks empty and flat | Mario |
| Every proposal of this brief is accepted, also W3, B6, P2 and C2 | Mario, 2026-11-16 |
| The animals have to be better: the trilobites look flat, like 2D | Mario, 2026-11-16 |
| The trilobite is rebuilt first and shown to Mario before the other kinds are reworked | Claude |
| The targets "soft and even light", "no flecks", "faint shafts at most" and "colours quiet" of `era-cambrian.md` are withdrawn | Claude: they were Claude's defaults |
| Sizes stay true. Nothing is made larger to fill the picture | Mario (`scale.md`) |
| It stays another world than `today` at first glance: green, not blue; no kelp; no waves close overhead | Claude |
| Strong light on this sea floor is a liberty, and the menu text says so (see below) | Claude |
| The Cambrian may cost as much GPU time as `today` on the same machine, not more | Claude |
| Mario picks the mood from pictures before the world is rebuilt (stage 1) | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## What is known about the light

The real basin was probably dim. Wikipedia, "Paleobiota of the Burgess Shale"
(https://www.wikipedia.org/wiki/Paleobiota_of_the_Burgess_Shale, read on 2026-11-16), puts it under 100 to 300 m of
water, in dimly lit water. A popular account pictures curtains of sunlight in the shallow sea on top of the same
wall (Palaeontology Online, article by T. W. Hearing, 2017,
https://www.palaeontologyonline.com/articles/2017/patterns-palaeontology-cambrian-environments/).

So shafts of light at the foot of the wall are a liberty, taken for the picture. The world is honest about it: the
last sentence of `about.txt` becomes "Light, colours and behaviour are guesses." No card claims anything about the
light.

## Proposals

Mario has accepted all of them (2026-11-16). The letters and numbers are their names. Effort: small (numbers or a
few lines in the era), medium (new code in the era), large (new meshes, or the engine has to learn something).

### Light

- **L1. A sun that wins.** Raise `SUNC` and lower `AMB` until rock and animals have a bright side, a dark side and a
  cast shadow. This alone gives everything a shape. Small.
- **L2. Shafts of light.** Raise `ERA.rays` until the shafts are clearly seen. They are cut by everything that casts
  a shadow: the wall, its buttresses, the blocks. Turn the sun (`ERA.sun`) so that it stands lower and comes over
  the wall or along it. Then the wall throws a long shadow into the basin, and the light falls through its gaps in
  separate beams. Small.
- **L3. Flecks on the ground.** `caus` and `caus2` return a constant. Give the ledges and the tops of the swells soft,
  broad, slow patches of light that fade with the depth. Not the sharp net of `today`: this surface is far away.
  Small to medium.
- **L4. Something to see overhead.** `above` is one flat colour. Make it a far, bright, slowly moving window of light,
  brightest where the sun stands, so that the shafts have a source. Take back `veil` until the top of the wall
  stands dark against that light with a lit rim. Medium.
- **L5. Black and white.** The picture has neither. Darken what the light does not reach (under overhangs, between
  blocks, the far side of a swell) and let the middle of a shaft burn a little. Check the exposure by depth in
  `ERA.tick()`. Small.
- **L6. Light through bodies.** Tulip cups, sponges, algae and jellyfish light up when they are seen against the sun:
  one term in their materials. A garden with the sun behind it then glows. Small per material.
- **L7. A foot for small things.** The shadow map is too coarse for anything in a garden, so the tulip animals seem to
  float. Darken the mud under dense life (in the ground map) and the foot of each stalk. Small.

### Water

- **W1. Clear near, deep far.** Less scatter (`SIG`), more swallowing of red (`KD`). The milky veil goes, near things
  get their full colour, and the distance turns a deep blue-green. Aim: sharp to 25 m, the wall a dark shape at
  60 m. Small.
- **W2. Two colours of water.** Paler, warmer jade towards the light. Darker and bluer towards the deep and into the
  distance. Small to medium.
- **W3. Mist over the mud.** A thin layer of drifting mud in the hollows of the plain, a metre or two high, with
  clear water above. Swells and blocks then stand out of it like hills out of morning fog. The engine's haze does
  not know height yet: a general extension. Medium to large. Show Mario the plan for the engine before building.
- **W4. Marine snow that is seen.** The flakes have their true size and are invisible to a diver. Let them light up
  inside the shafts, many of them close to the camera. Snow drifting through a beam costs little and fills the
  water. Small.

### Ground

- **G1. Mud with a surface.** Ripples on the swells, flow lines and lobes on the tongues, cracks at their edges, small
  pits and mounds. As relief in the material; with the slanting sun of L2 it shows. Small to medium.
- **G2. A floor in more than one colour.** Mats in dark olive, rust and wine red, pale fresh mud on the tongues, dark
  hollows. The ground map already knows where the mats are (`matA` in `look.js`): make them count. Small.
- **G3. Litter.** Grit and pebbles in drifts, broken shells, the shed shells of trilobites, the twin tracks of what
  walks here, the openings of burrows. Scattered in masses. Medium. Check before building: shed shells and tracks
  as fossils of this place.
- **G4. Rock out on the plain.** Fields of fallen blocks at the foot of the wall, slabs that lean on each other with
  gaps to swim through, low outcrops that break the swells. No view should be mud only. This changes the rock: run
  `ways.mjs` and check the poses. Medium.
- **G5. A wall worth looking at.** Deep recesses, overhangs, ledges with mud and gardens on them, crusts in dark
  green, wine red and bone white, sponges and algae hanging on it. Now it is bare. Medium.

### Life

- **B1. More gardens, larger, and not as beds.** Now there are 4, each 2 to 3 m across, in a world of 200 m. Aim for
  12 to 20, between 3 and 10 m across. No round bed with evenly spaced animals: lobes, gaps, outliers, clumps in
  the lee of blocks, dense in the middle and thinning out. Tulip animals of different heights, leaning with the
  current. Medium.
- **B2. A thin cover everywhere.** Algae tufts, single sponges and small groups of tulip animals at low density over
  the whole plain and on every ledge, denser towards the gardens and the wall. Masses of instances are cheap. Aim:
  something alive within 10 m of every place the player can reach. Small to medium.
- **B3. Fill the water.** Jellyfish by the hundred, at every height between the floor and 15 m above it, in loose
  drifts that cross the shafts. Swarms of Marrella and shoals of Metaspriggina as moving clouds between the gardens,
  not only inside them. Now and then an Anomalocaris as a silhouette far off. Medium.
- **B4. Colour.** Every kind gets a colour family of its own that stands out from the green. For example: tulip cups
  from pale rose to deep magenta with lighter rims, sponges ochre to orange, algae bright green and wine red,
  jellyfish with a milky blue rim, trilobites dark with pale edges, Anomalocaris with banded flaps. Colours are
  free: no fossil shows them. Small.
- **B5. Shimmer.** Marrella may have shimmered in rainbow colours: as Claude remembers it, a study found fine gratings
  on its fossil spines (not checked). If a source holds, let the swarms flash as they turn. Small, after the check.
- **B6. New kinds.** Comb jellies with shimmering rows of combs, the spiny bag Chancelloria, the frond Thaumaptilon,
  the disc Eldonia, Wiwaxia with shining spines, more kinds of sponges. Each needs a source, and a text if it gets
  a card. Large. All that are named here, each as soon as its source holds.

### The animals

Mario, 2026-11-16: the trilobites look flat, like 2D. The animals have to be better. The rock took their thickness
(see "Why it is so"), and every kind has to get it back.

- **K1. No sheets.** Every shield, flap, fin and plate has an upper side, an under side and an edge with a thickness
  that can be seen. Every body has a cross-section: round, oval or arched, never a line. Look at each kind from the
  front and from behind. If it closes to a line there, it is a sheet.
- **K2. The trilobite, rebuilt.**
  - **An arched shield.** The head shield vaulted, its cheeks falling in a curve to the rim. The side lobes of the
    body level beside the axis and then bent down towards their tips. The tail piece domed. Take the height from a
    reconstruction in the round, not from a pressed fossil (see "Not checked yet").
  - **A rim.** Rolled under, with a thickness, not a knife edge.
  - **Segments.** Each of the seven a rib of its own with a furrow along it, lying over the next like a roof tile.
    The spines at the rim round and pointed like thorns, not flat triangles.
  - **Eyes.** Raised crescents that stand up from the cheeks.
  - **An underside.** Not a flat lid. Jointed legs that are seen from the front and from the side, each with its
    feathery gill above it. The body stands on them: where it walks there is a gap between rim and mud.
  - **Bending.** The joints between the segments let the body follow the ground, the head lift and the tail piece
    dip. A walker that is stiff as a board looks like a board.
- **K3. A skin.** Relief (granules, growth lines, furrows), a pattern (bands, spots, a darker back, paler rims and
  spines) and the sheen of a wet shell. No animal in one flat colour. Goes with B4.
- **K4. Shade on the body.** Darker in furrows, at joints, under the rim and between the legs, so that the shape
  reads in soft light too.
- **K5. Not all the same.** Tone, pattern and size differ from one animal to the next (from the seed of its
  instance): a few larger and darker, a few paler.
- **K6. A place on the ground.** A shadow under every walker (they have one: check that it shows in the new light),
  feet that touch, a little mud heaped around one that lies dug in.
- **K7. Seen from two metres.** For a diver a trilobite is a few pixels. With a back darker than the mud, its
  shadow and its walking it has to read as an animal from there, not as a pale disc.
- **K8. All the other kinds.** The same test and the same cures. Known so far: Marrella as black feather shapes on
  the mud, Hallucigenia in one smooth colour, the small swimmers never seen close. For each kind: its turntable
  first (K9), then a list of what is flat, then the cure. Starting points: Anomalocaris with flaps that have a
  thickness, eyes as balls on stalks and arms whose spines stand out; the jellyfish with something inside its
  bell; the tulip animal with the six parts of its cup and its openings.
- **K9. A turntable for every kind.** Eight renders of one animal that fills a third of the picture: front, rear,
  side, top, from below, and three from an angle (from above, level, from below). One more from a diver's height
  at 2 m. The tool for it belongs in `tools/`; `kinds.mjs` takes its picture from where the hint appears, which is
  too far for small kinds. The visual critic gets the turntable with one question: is this a solid animal or a
  flat cut-out, and from which views?

Triangles are not the limit: the Cambrian uses half the GPU time of `today`. An animal that is looked at from 5 cm
may have a few thousand triangles, with a simpler mesh from a distance, which the engine already knows (`lod`).

### Places

- **P1. Three places worth swimming to.** `today` has the fluke, the ship and the grotto. Here: (a) the great
  overhang at the foot of the wall, a shadowed hall with one opening through which a shaft falls on a garden;
  (b) the block field, fallen blocks as large as houses with lanes between them and sponges on their shaded
  faces; (c) the fresh slide, a tongue of pale mud that has just come down, with half-buried tulip animals at its
  end and mud still hanging in the water. Each is a place to go to and a picture. Medium to large.
- **P2. A brine pool.** A lake under the sea at the foot of the wall, with a shimmering surface of its own.
  Researchers describe such pools for a younger site nearby with the same kind of wall
  (https://gsa.confex.com/gsa/2005AM/webprogram/Paper97746.html). For the Burgess Shale itself it is a hypothesis
  that not everyone shares. Check the state of the debate first and tell Mario what you find. If it is built, its
  card says that it is a hypothesis.

### Composition and the player

- **C1. Poses as pictures.** Each with something close, something in the middle and something far. Poses 1 and 5 now
  look down on a bed from above. Lower, along the garden, towards the wall and the light.
- **C2. Start as a fish.** At 18 cm a garden is a forest. An era could name the size the player starts with (a
  general entry in `ERA`, the diver if it is missing). The size a player picks in an era is remembered for that era;
  on the first visit the size of the era counts.
- **C3. The flight.** Through the three places and through at least one shaft.

### Movement and sound

- **M1. One current.** Tulip animals, algae, sponges and jellyfish lean and sway in the same slow rhythm, and gusts
  run across a garden like wind across a field of grain.
- **M2. Mud that moves.** A small puff where a walker steps, a trickle down a tongue now and then, a faint plume
  along the foot of the wall.
- **M3. Sound.** Soft clicks and crackle close to a garden, a low moving tone along the wall. No card claims any
  of it.

## Stages

Each stage ends with a hand-over, both builds running and Mario looking at it.

1. **One picture, three moods.** Only what test pose 1 sees: light, water, the ground there and one garden made
   larger. Three versions, each rendered as a diver and as a fish, with `today-pose1.png` beside them:
   - **A, cathedral light:** clear jade water, strong shafts over the wall, soft flecks, deep teal shadows.
   - **B, golden green:** warmer, the sun lower, long shafts along the wall, snow glowing in them.
   - **C, dusk with glowing life:** darker and bluer, light only in a few shafts, and the animals shine against the
     dark where the light passes through them.

   Mario picks one or mixes. Nothing is rolled out before he has.
2. **Light and water** for the whole world: L1 to L7, W1, W2, W4.
3. **The animals:** K1 to K9. The trilobite first: its turntable, and the animal in a garden as a fish and as a
   diver, go to Mario before any other kind is reworked.
4. **Ground and rock:** G1 to G5.
5. **Life:** B1 to B4, and B5 if its source holds.
6. **Places, poses, flight, movement, sound:** P1, C1 to C3, M1 to M3.
7. **What needs more:** W3 (the plan for the engine first), B6 (each kind after its source), P2 (after the check).

Stage 1 is made: `tools/out/moods/final/index.html`.

## Rules that matter here

- **Sizes stay.** Every kind keeps the size of `era-cambrian.md`. Fuller means more of them, not larger ones.
- **Texts stay.** Light and colour are free, facts are not. A new fact on a card needs a source
  (`era-common.md`, "Facts and sources").
- **Still another world than `today`.** No kelp, no blue, no net of sharp flecks, no fish of `today`.
- **The engine names no era.** If it has to learn something (W3, C2), it learns it in general terms.
- **Nothing changes in `today`.** Its six test poses match the renders from before, its benchmark is the same.
- **The world is deterministic, and nothing allocates per frame.**
- **Paths in open water.** After every change to the rock: `node tools/ways.mjs cambrian`.

## Acceptance criteria

1. Mario has picked the mood from the pictures of stage 1, and the world is built in it.
2. In each of the six test poses everything has a lit side and a shadow side, and at least four of them show a shaft
   or flecks of light.
3. In no test pose is more than half of the picture bare, even mud.
4. Something alive lies within 10 m of every place on the plain that the player can reach. Check it with a script
   over a grid, not by eye.
5. Every kind has a colour family of its own: one render with all kinds next to each other shows it.
6. Next to the pose of `today` with the same number, the visual critic calls the Cambrian neither the emptier nor
   the flatter picture in more than one of the six pairs.
7. At first glance it is still another world than `today`.
8. Sizes and card texts are unchanged, or changed after a source that the hand-over names.
9. The flight of the Cambrian costs no more GPU time than the flight of `today` on the same machine. The hand-over
   names both.
10. `today` is unchanged. Both builds run, `ways.mjs` is clean, no new messages in the browser console.
11. Every kind has its turntable (K9), and in none of its views does the visual critic call the animal flat or a
    cut-out.
12. The trilobite, seen from the front at the height of its eyes, shows an arched shield, a rim with a thickness,
    raised eyes, legs under the body and a gap between rim and mud where it walks.
13. From a diver's height at 2 m a trilobite reads as an animal: its back is set off from the mud, it has a shadow,
    and its walking is seen.

## Verification

Both gates of `CLAUDE.md`.

- **Visual critic.** Stage 1: the three moods next to `today-pose1.png`, with one question: which would you want to
  swim into, and what do the others lack? From stage 2 on: each Cambrian pose next to the pose of `today` with the
  same number, with the questions "which of the two is emptier?", "which has the flatter light?", "what does the
  weaker one lack?". In addition the poses as a fish. For the animals: the turntable of each kind (K9), before
  and after.
- **Performance.** The benchmark of the Cambrian and of `today`, both in the hand-over.

## Not checked yet

From Claude's knowledge, to be checked before anything of it reaches a card or is built as a fact:

- B5: gratings on the spines of Marrella, and what they say about its colour.
- B6: that comb jellies, Chancelloria, Thaumaptilon, Eldonia and Wiwaxia are known from the Burgess Shale, and
  their sizes.
- G3: shed trilobite shells, tracks and burrows in these rocks.
- P2: the state of the debate on brine pools at the Burgess Shale.
- K2: how high the shield of Olenoides arches against its width, the shape of its eyes, and whether it carried a
  pair of feelers at the rear as well. Look for a museum reconstruction or a fossil kept in the round. Also that
  the fossils of the Burgess Shale are pressed flat: widely described, not looked up for this brief.

## Later, not in this task

- A mudslide that the player can watch.
- Day and night.
- The same checklist for every other era: `era-common.md` carries a short form of it.
