# Brief: what every era world has in common

Every era of Historic Ocean has a brief of its own, `era-<id>.md`. It says what is special about that world: the
place, the light, the exhibits, the texts. This brief says what is the same for all of them, so that it is written
down once. If the two disagree, the brief of the era wins.

- **Asked for by:** Mario, 2026-11-16. He runs several Claude instances, one per era.
- **Applies to:** every era brief from the Hadean to the Neogene. `era-cambrian.md` was written before this one and
  carries its own stages and rules.
- **Language of the texts:** English.

Read `CLAUDE.md` first, then this brief, then the brief of your era.

## Before the first of these worlds is started

Everything under "Before the eras" in `TODO.md` comes first: one detail level and no phone, the Ediacaran in the list
of eras, no viewpoints in the game, the size on the card, the three player sizes, the Cambrian at true scale. Do not
start an era before Mario has ticked off that part of the list.

## Test poses

Every era has six fixed test poses (`ERA.views`). They are not part of the game: the player starts at the first, and
only the dev page jumps to them with the keys `1` to `6`. They are the poses of the visual critic and of the
before-and-after renders. Where an era brief says viewpoint, it means a test pose.

## Scale and size

- **One unit is one metre**, in every era. The player is a diver about 1.8 m tall and can shrink to a fish of 18 cm
  or a shrimp of 1.8 cm during play (Mario's decisions, `scale.md`).
- The tables of the era briefs give every size in metres, as the real size. Build it at exactly that size.
- Every `ZOO` entry carries `size`, the largest measure in metres, and names the size in its first fact row. The
  engine draws the comparison with the diver from it (`scale.md`, stage 1). Until that is built the number is
  simply carried along.
- A world whose exhibits are mostly shorter than 30 cm is meant to be looked at as a fish or a shrimp. It gathers
  its life in gardens near the test poses, and its exhibits have to hold up when seen from a few centimetres. Where
  an era brief says that it "asks for the close camera", it means this; the era asks the engine for nothing.
- Giants need room. Check that the largest animal of your world can turn on its path with open water around it, and
  that the haze lets the player see it whole from at least one test pose. An animal of 15 m that is only ever a
  shadow has no size.

## One place, one time

Every world shows one real place at one moment, named in its brief, and only what lived there together. The other
great stories of the era are told in the sentences of the menu and in the cards, not by mixing animals that never
met. Where a brief bends that rule, it says so.

## Exhibits and texts

- An exhibit is one entry in the era's `ZOO` and one registration in `makeWorld` (see `CLAUDE.md`, "adding an
  animal"). Something as large as a wall, the water or the sky is a `backdrop(...)`.
- `name`, `sub`, `size`, up to three `facts` as `[label, value]`, one `text` of 40 to 60 words.
- The sentences for the menu go into `about.txt`, 70 words at most.
- Shapes follow the fossils as far as the sources describe them. Colours are free: keep them natural, and give
  every kind a colour family of its own that stands out from the water. Movement that the fossils do not show (how
  fast, whether in groups) is free as well, and the cards do not claim it.
- Several eras have something above the water: a pterosaur, a bird, the Moon. The player stays under water. What is
  above is seen through the surface (the function `above` of the era's `AIR`) or as an animal that dips in.

## Facts and sources

Mario's rule: a fact names its source with a link, and what is not checked is marked as not checked.

Every era brief ends with two lists:

- **Checked** names the facts that were checked against a source on the date given, with the link.
- **Not checked yet** names the facts that come from Claude's knowledge and were not checked against a source when
  the brief was written. They are probably right, but they are not verified.

What you do with them:

1. Before a text goes into the page, check every fact in it that is listed as not checked. Search the web, prefer
   the original paper, a museum, a university or a geological survey over a collection of facts.
2. Put the link next to the entry as a comment, as `source/eras/cambrian/zoo.js` does, and move the fact to the
   checked list of the brief.
3. If a source says something else than the brief: the source wins. Change text and size, and say so in the
   hand-over.
4. If you find no source: take the fact out of the text, or leave it and tell Mario in the hand-over that it is not
   verified. Do not put a number in its place that you cannot show.
5. Add no fact without a source.

Sizes matter most. A wrong size is a wrong animal in the world.

## Atmosphere

Every era differs from every other in its light (Mario). The brief gives a table "world of today against this
world". They are targets for the eye, not numbers: find the numbers in the browser. At first glance, from each of
the six test poses, the picture has to be another world than `today` and than the eras next to it in time, as far
as they are built. How it really looked is rarely known from rock. Where the brief says "not known", the menu text
says so too.

## A world must not look empty

The first version of the Cambrian had even light, quiet colours and four small gardens in a world of 200 m. Beside
`today` it looked empty and flat (Mario, 2026-11-16; `cambrian-look.md` has the diagnosis and the cures). Every
world is held to this list, and stage 1 of every world is judged by it:

- **Light with a direction.** Everything has a lit side and a shadow side, and there are shafts or flecks of light,
  unless the brief of the era says why this world has none. Where a brief asks for soft or dim light, that is a
  mood, not leave for a flat picture.
- **Depth.** Clear near the camera, then layers behind each other. No veil over everything.
- **No bare picture.** In no test pose is more than half of the picture bare, even ground.
- **Something everywhere.** Dense places, and a thin cover between them: something alive within 10 m of every place
  the player can reach. In a world without life: something to look at.
- **Colour.** Every kind its own colour family, set against the colour of the water.
- **The water is not empty.** Something drifts or swims at every height.
- **Bodies, not cut-outs.** Fossils are often pressed flat, and a body modelled on such a fossil comes out as a
  sheet (Mario on the first trilobites, 2026-11-16: flat, like 2D). Every animal gets its thickness back: a
  cross-section, an underside, edges with a thickness, a skin with relief, pattern and sheen, and animals that are
  not all the same. `cambrian-look.md`, K1 to K9, has the list.
- **Places.** Two or three places worth swimming to, each a picture.
- **Spend the budget.** A world may cost as much GPU time as `today` on the same machine. One that costs half is
  probably too empty.

## Stages

Each stage ends with a hand-over, both builds running, and Mario looking at it.

1. **The place and its light.** Sea floor and atmosphere with nothing alive in it. Six test poses and a flight path.
   Mario decides here whether the look is right. Do not go on before he has.
2. **What stands still.**
3. **The swimmers,** the largest last: by then you know the place.
4. **What walks, crawls, floats at the surface or flies above it.**
5. **Sound, menu text, last corrections.**

The brief of the era names the order inside the stages where it matters.

## Rules

- **Nothing of another era in this world.** Start from a copy of an era that is built, then take out everything
  that is not yours. Check by search in the built page.
- **No change to a world that exists.** Its six test poses must still match the renders from before.
- **Several instances work at the same time.** Stay in your own folder `source/eras/<id>/`. If the engine lacks
  something, extend it in general terms (it names no era), keep the change small, and list every engine file you
  touched at the top of your hand-over, because another instance may have touched the same file. Do not rename or
  move anything in the engine.
- **One detail level, computer only** (Mario). There are no levels Medium and Low any more, and no phone or touch
  screen to support. Do not build or check anything for them.
- **Paths in open water.** Check every path against the rock, with room for the widest part of the animal.
- **Fossils first.** Where the table of a brief and a source disagree, the source wins.
- **The graphics card.** `node tools/chrome.mjs status` before anything that renders. If it is busy, with a game
  or with another instance, do what needs no card and name the gates that are still open.
- **Git is Mario's.** No commit, branch, checkout, merge, stash or reset.
- **Ask when unclear.** One precise question to Mario beats a wrong assumption.

## Acceptance criteria

1. `<id>.html` is built, can be chosen from the timeline of `index.html`, and leads back the same way.
2. The worlds that existed before have not changed: their six test poses still match.
3. From each of the six test poses the picture is, at first glance, another world than `today` and than the built
   eras next to it.
4. Every kind of the table is in the world, in the numbers of the table or close to them, and each can be found
   within a minute from at least one test pose.
5. Sizes in the world match the table within a tenth.
6. Every exhibit shows its hint and its card, with the texts of the brief or with texts corrected after a source.
7. Every fact on a card has a source next to it in the zoo file. The hand-over lists what is still not verified.
8. The menu shows the sentences of the brief for this era.
9. Nothing of another era is in the page, to see or to hear.
10. No new messages in the browser console. Both builds run. The hand-over names the bundle size of the page.

## Verification

Both gates of `CLAUDE.md`, for this era's own six poses and flight path.

- **Visual critic.** After stage 1 and again at the end. Give it one render of `today` next to each pose and ask:
  do the two look like different worlds? At the end add the turntable of each kind (`cambrian-look.md`, K9: one
  animal from eight sides, with the question whether it is a solid body or a flat cut-out) and one render of an
  open card. For the largest and the smallest kind add a render with something of known size in the picture, and
  ask whether the size can be read from it. For a world of small things add renders as a fish and as a shrimp.
- **Performance.** The benchmark of this era's flight, and once more the one of `today`, which must not have
  changed.

## Hand-over

At the end of every stage, in this order: the engine files you touched (or "none"), what changed and why, the list
of changed files, what Mario should open, press and see, the facts that are still not verified, open questions, one
proposed commit message.
