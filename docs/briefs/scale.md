# Brief: true scale, and showing how large things are

Mario wants to see how large the animals were. Three things make that possible. Every world is built at one scale,
with the player as large as a person. Every zoo card shows the size of its exhibit next to the diver. And the player
can shrink, to look at the small ones.

- **Asked for by:** Mario, 2026-11-16.
- **Order:** items 4 to 7 of `TODO.md`, after the viewpoints have left the game. All of it comes before the other
  eras are built, and the Cambrian is changed before its walkers are built.
- **Files expected to change:** `source/engine/zoo.js`, `source/engine/main.js`, `source/template.html`,
  `tools/accept.mjs`, the folder `source/eras/cambrian/`, `CLAUDE.md`.

Read `CLAUDE.md` first. Its facts and working rules apply to every line below.

## What the player gets

1. **One scale.** In every era one unit of the world is one metre. Everything alive is as large as its fossils say,
   or, in the world of today, as large as the living animal.
2. **The player is a diver.** The camera is the eye of a person about 1.8 m tall. No body is drawn.
3. **Size on the card.** The first fact row of every card is the size. Under the rows the card shows it as a
   picture: a bar for the exhibit and a bar for the diver, to the same scale.
4. **Three sizes.** During play the player switches between diver, fish and shrimp, to look at small things up
   close.

## Decisions

| Decision | By |
|---|---|
| The sizes of the animals are correct, and the player can see how large they are | Mario |
| The player has the size of a person | Mario |
| So: one unit is one metre in every era, also where the animals are small | follows from the two above |
| The Cambrian is changed to this scale. Until now its player was 20 times smaller | follows from the two above |
| The card shows the size as two bars, exhibit and diver | Claude |
| Anything shorter than 30 cm is compared with the diver's hand (19 cm), not with the diver | Claude |
| The player still has no visible body | Claude |
| The player switches between three sizes during play, not in the menu. Growing next to rock may make the view jump | Mario |
| The three sizes are diver (1.8 m), fish (18 cm) and shrimp (1.8 cm), on the key `C` | Claude |
| The card always compares with the diver or the hand, whatever size the player has: a person is the yardstick everyone knows | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Stage 1: size on the card

**Data.** A `ZOO` entry gets one more field, `size`: the largest measure of the exhibit as it stands in the world,
in metres. It is the same number as in the first fact row, which says in words what is measured (length, height,
wingspan).

```js
dunkleosteus: {
  name: 'Dunkleosteus', sub: 'Dunkleosteus terrelli · armoured fish', size: 4.1,
  facts: [['Length', 'about 3.4 m, the largest about 4.1 m'], ...],
  text: '...',
},
```

**Picture.** Two bars, one above the other, each with a short label:

- the exhibit: its name and its size, written from the number (`4.1 m`, `38 cm`, `3 cm`: metres with one decimal at
  most from 1 m on, whole centimetres below)
- the diver: `You · 1.8 m`

The longer of the two fills the width, the other is drawn in proportion, at least 2 px long so that it never
disappears. If `size` is below 0.3, the second bar is `Your hand · 19 cm` in place of the diver. An entry without
`size` (a wall, the water) shows no picture.

**Where.** The card is the element `#z` in `source/template.html`, filled in `source/engine/zoo.js` where the fact
rows are filled. Keep the card's fixed elements: nothing is created while the game runs. The picture has to fit the
flat layout of the card for low windows too.

**Checks.** `tools/accept.mjs` checks the rules of the card for every exhibit. Add the picture to those rules: it is
there when `size` is, the bars have the right proportion, the right partner (diver or hand) is shown.

## Stage 2: three player sizes

The player is a camera without a body. Its size is three numbers in `source/engine/main.js`:

| What | Now | In the code |
|---|---|---|
| How far the camera keeps from rock | 0.5 m | `CR` |
| What is nearer than this is cut off | 0.1 m | `NEAR` |
| Swimming speed | 7 m a second, 26 with Shift | `sp` in `frame()` |

A size multiplies all three by one factor:

| Size | Height | Factor | In the Cambrian, Anomalocaris is |
|---|---|---|---|
| Diver | 1.8 m | 1 | as long as your forearm |
| Fish | 18 cm | 1/10 | twice as long as you |
| Shrimp | 1.8 cm | 1/100 | twenty times as long as you |

Nothing else scales. Haze, light and colour stay as they are: water is not clearer for a small swimmer. The world,
the animals, the swim limits and the zoo reach stay in metres. From the same spot the picture is the same at every
size. What changes is how close the player can come and how fast it moves.

**Switching.** During play, never only in the menu (Mario):

- the key `C` goes diver, fish, shrimp, diver;
- for about two seconds a label names the new size (`Fish · 18 cm`), then fades;
- the list of controls in the menu names the key;
- the size is remembered between visits;
- growing next to rock: the collision pushes the camera out. A jump is fine (Mario). The camera must never end up
  inside the rock.

**What to watch.**

- **The near plane.** The depth buffer is `depth32float` with the comparison `greater`, so a near plane of 1 mm
  should not flicker. Check it as a shrimp, close to rock and close to an animal.
- **The collision.** It reads a distance field on a grid of about 0.75 m, stored in steps of 1/127 m. As a shrimp the
  camera may stop visibly before the rock or sink into it. Measure the gap at three places per era and report it. If
  it is larger than 1 cm, propose a fix to Mario before building one.
- **Steps.** `collide()` moves in steps shorter than `CR`. With the speed scaled by the same factor the number of
  steps per frame stays the same. Keep it that way.
- **Drifting particles.** A flake that passes right in front of a shrimp fills the screen. Fade particles that come
  nearer than a few player sizes, if they are not faded already.
- **Up close the world is coarse.** The sea floor has facets of about 0.75 m, and textures, leaves and set pieces were
  made for a diver's view. This stage does not change that. It only shows it: render each built era as a fish and as
  a shrimp, once 10 cm over the ground and once 5 cm in front of a small exhibit, and list for Mario where it looks
  coarse. He decides per era what gets finer.

**The engine names no era.** Every era has all three sizes. When an era brief says that its world "asks for the
close camera of `scale.md`, stage 2", that means: its exhibits are small and are meant to be looked at as a fish or
a shrimp. The era asks the engine for nothing.

## Stage 3: the Cambrian at true scale

**What is there.** `source/eras/cambrian/` is built at one unit for 5 cm: sea floor, light, what stands still and
the swimmers. The comments in `era.js`, `air.js` and `standing.js` say so, and so does `about.txt`.

**What changes.** The rock stays as it is and its units are read as metres from now on. The wall is then some tens
of metres high, which is nearer to the real one than before (its card says roughly 100 m). Everything alive
shrinks to its real size, a twentieth of what it is now:

| Id | Now, in units | True scale, in metres |
|---|---|---|
| `anomalocaris` | 7.6 | 0.38 |
| `opabinia` | 1.4 | 0.07 |
| `hallucigenia` | 0.2 to 1 | 0.01 to 0.05 |
| `marrella` | 0.5 | 0.025 |
| `olenoides` | 1.8 | 0.09 |
| `metaspriggina` | 1.2 | 0.06 |
| `burgessomedusa` | 4 | 0.2 |
| `vauxia` | 1.6 | 0.08 (height not verified) |
| `siphusauctum` | 4 | 0.2 |
| `algae` | 0.2 to 1.6 | 0.01 to 0.08 (not verified) |

What follows from that:

- **This is a world of small things now.** Its largest hunter is as long as a forearm. That is what the Cambrian
  was like, and the brief names it as a special feature ("Everything is small"). As a shrimp the player gets the old
  feeling back, in a world that has the right sizes. The world needs stage 2.
- **Where the life is.** Animals that small cannot fill a world of 200 m. Gather them: dense gardens of tulip
  animals, sponges and algae a few metres across, with the swarms and the walkers in and around them, and bare mud
  between the gardens. Put a garden in front of each test pose that looks at the basin, close enough that life is
  seen at once. Every kind still has to be found within a minute from at least one test pose.
- **Paths, swarms, distances between animals:** all a twentieth, then tuned by eye.
- **Test poses and flight path:** the poses that look at the wall can stay. The ones that show life move close to
  it, and the flight path comes down to a garden at least twice.
- **Zoo reach:** see `era-cambrian.md`, which already has the new numbers.
- **Water and light stay:** haze, colours and exposure are per metre and were tuned on this rock. Check the
  drifting particles: a flake of marine snow must not be larger than an animal.
- **Texts:** `about.txt` loses "and you are 20 times smaller than a diver". The new sentence is in
  `era-cambrian.md`. The comments that say "5 cm" change with the code.

**Order.** Stage 2 first. Then one garden at one test pose with all the kinds that are built so far, at true scale.
Show it to Mario. He decides there whether the Cambrian stays like this. Do not convert the rest before he has.

## Stage 4: is the world of today at true scale?

It was built in metres, but nobody has checked every exhibit. Measure each exhibit of `today` in the world and put
it next to its card and next to the real size: kelp, the three sponges, the corals, manta, fish, plesiosaur, whale
fluke, ship. Report the table to Mario. Change nothing in `today` without his answer, because every change there
changes its six test poses. (The whale fluke looks far larger than a real one: its zoo lines reach 16 m above its
foot. That may be meant as a set piece. Ask.)

Then give every exhibit of `today` its `size`.

## What the era worlds hand over

Every era brief written from 2026-11-16 on gives sizes in metres and a `size` for every `ZOO` entry. An era that is
built before stage 1 is finished simply carries the numbers; the picture appears when the engine can draw it.

## Rules that matter here

- **Nothing changes in the world of today** in stages 1 to 3. Compare its six test poses before and after.
- **No allocation per frame.** Opening a card is not part of the frame, but `zoo()` is.
- **The engine names no era.** The three sizes are the same in every era.
- **Sizes come from the briefs.** If a size in a brief looks wrong, say so. Do not correct it silently.

## Acceptance criteria

1. Every card whose entry has a `size` shows the two bars with the right proportion, on a full window and on a low
   window. Entries without `size` show none.
2. An exhibit shorter than 30 cm is compared with the hand, every other one with the diver.
3. `C` switches between the three sizes during play, a label names the new size, and the size is remembered. As a
   shrimp the player can stop 5 cm in front of an animal of 3 cm and nothing is cut off. Growing next to rock never
   leaves the camera inside it.
4. `today` is unchanged: six test poses, benchmark.
5. In the Cambrian every living thing has the size of the table above, within a tenth.
6. Every Cambrian kind that is built is found within a minute from at least one test pose.
7. The page of the Cambrian no longer says that the player is smaller than a diver.
8. `CLAUDE.md` says that one unit is one metre in every era, and how the three sizes work.
9. The hand-over contains the table of stage 4 and the list of coarse places of stage 2.
10. No new messages in the browser console. Both builds run.

## Verification

Both gates of `CLAUDE.md`.

- **Visual critic.** The open card of one large, one middle and one small exhibit, in a full and in a low window. The
  renders as a fish and as a shrimp of stage 2. For the Cambrian: its six poses, and one close render of each kind
  with the open card next to it. One more question
  for the critic: can it tell from the picture alone how large the animal is?
- **Performance.** The benchmark of `today` (unchanged) and of the Cambrian. More and smaller animals must not cost
  more than the limits allow.

## Later, not in this task

- A magnifier (a key that narrows the view), if small animals are still hard to see.
- A finer sea floor and finer textures near the camera, per era, where Mario asks for it.
- A silhouette of the animal in place of the bar.
- A diver's body, or a hand, in the picture of the world.
