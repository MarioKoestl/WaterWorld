# Brief: the Hadean world

The oldest stop of the journey. The player dives about 4.3 billion years back, into the first ocean of a planet that
has only just cooled. Nothing lives here. The exhibits are rock, fire, water and sky.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture on the cards; this world does not need the close camera.
- **Result:** `hadean.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## How to work (version 2 of this brief, 2026-11-23)

Written for Claude Code on Opus 4.6. With `CLAUDE.md` and `era-common.md` this brief is all you need for this era.
Do not read the briefs of the Devonian or of the Dunkleosteus. Since version 1 some facts were checked (see
"Sources"), and "The look" and "Build notes" are new.

1. **Stages** as in `era-common.md`, five of them. Each ends with a hand-over, and then you stop. Never start a stage
   before Mario has accepted the one before.
2. **Start** from a copy of `source/eras/cambrian/` (floor, standing kinds and scattering are there), then take out
   everything Cambrian.
3. **One kind at a time,** in the order given under "The ten exhibits". For each kind:
   a. Notes in `docs/research/hadean/<id>.md` from the sources named in "Build notes": what they print, what you
      measured on which figure, what stays an estimate.
   b. The mesh, with its figures in lengths of the body in a comment.
   c. `node tools/turntable.mjs hadean <id> <name>` (look at `node tools/chrome.mjs status` first).
   d. The visual critic on the turntable, with the list of "The look" as its questions.
   e. Correct, twice at most. Then the next kind.
4. **A source that cannot be opened:** say so in the notes and mark the figure as estimate. Never invent a
   measurement, a quotation or a colour.
5. **Budget.** Small edits in place. The engine is the only renderer. Hand-overs of 20 lines or fewer: what is in,
   what Mario should open and look at, what is still not verified, one commit message.

## The place

The Hadean lasted from 4567 to 4031 million years ago. The world shows a moment about 4.3 billion years ago: the
magma ocean has frozen to a crust, the steam of the first air has rained down, and there is a sea.

Here the rule "one real place" cannot hold. No rock of this age is left anywhere on Earth. All that is left are
grains of zircon in younger rocks of Western Australia, and they tell that there was liquid water. So this world is
built from two things: what the same processes look like on the sea floor of today (lava, vents), and what
researchers conclude about the young Earth. The menu text and the cards say plainly that it is a reconstruction.

## What is special about the Hadean, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| The Earth is new and still hot inside | lava that breaks through the sea floor, pillow lava everywhere |
| There is already an ocean, and we know it from grains of sand | the zircon card |
| Nothing lives, as far as anyone knows | the empty water; the card of the sea |
| Hot springs on the sea floor, a possible cradle of life | the black smokers, the white towers |
| The Earth is hit from space far more often than today | the crater; streaks of light above the surface |
| The Moon is young and close | the Moon, seen through the surface |
| No oxygen, a fainter Sun | the cards of the sea and the Moon, the dim light |

## Decisions

| Decision | By |
|---|---|
| A world of its own for the Hadean, although nothing lives in it | follows from Mario's "all eras since the Earth formed" |
| Eight exhibits, not ten: there is nothing alive to show | Claude |
| A moment after the ocean formed, about 4.3 billion years ago, not the magma ocean before it | Claude |
| Vents are shaped after the vents of today | Claude |
| The colour of water and sky is free: nobody knows it | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: a dark, heavy, empty sea under a low orange sky. Black rock, a red glow where the floor is
open, pale smoke. Lonely, a little threatening, and very still between the rumbles.

| | World of today | Hadean |
|---|---|---|
| Water | clear blue | dark, between bronze and grey-green, clearer than one expects: nothing lives in it |
| How far one sees | far | about 50 m, less near the vents |
| Surface | visible from below, with waves | visible, with a long heavy swell. Above it an orange-brown sky and the pale disc of a large Moon |
| Sunlight | strong, sharp shafts, bright flecks | weak and warm in colour. Faint shafts, no flecks |
| Other light | none | the red glow of lava in cracks, lighting the rock and the water around it |
| Drifting particles | a few | black flakes near the smokers, white ones near the towers, ash sinking slowly everywhere |
| Ground | rock and sand, strong colours | black and dark grey lava, glassy, with rust and sulphur yellow at the vents |
| Sound | rumble, surface wash, chimes, whale calls | deep rumble, hiss and crackle near lava, now and then a distant thud. No calls, no chimes |

How it looked is not known. The menu text says so.

## Sea floor

- **Pillow lava.** Most of the floor: heaps of rounded lobes, about 1 m each, in low ridges and steps.
- **The fissure.** A crack some tens of metres long with glowing lava inside and fresh, still shiny pillows at its
  edges. The water above it shimmers.
- **The smoker field.** On a ridge: a dozen dark chimneys, the tallest 12 m, with black smoke rising from their tops.
- **The white towers.** On a rise away from the fissure: a group of pale spires, the tallest 30 m, with thin clear
  shimmer and no smoke.
- **The crater.** A bowl 40 m across with a raised rim, broken blocks around it and glassy droplets in the sand.
- **A bank of dark sand** between the lava ridges, for the zircon card.
- **Not here:** anything alive, anything grown, any wreck.

## The eight exhibits

Sizes in metres, one unit is one metre.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `pillow` | pillow lava | each lobe about 1 m | rounded, wrinkled lobes with a glassy black skin, cracked like bread crust | none | everywhere |
| `lava` | the eruption | fissure about 60 m long, 2 m wide | a crack with glowing orange in its depth, new lobes at its edges | the glow pulses, lobes swell slowly, the water above shimmers | 1 |
| `smoker` | black smokers | tallest chimney 12 m | rough dark pipes, some branched, with rust and yellow crusts | black smoke rises and bends in the current | 1 field of about 12 |
| `towers` | white towers | tallest 30 m | pale, fluted spires with ledges and small side chimneys | clear warm water shimmers at their tops | 1 group of about 6 |
| `impact` | the crater | 40 m across, rim 3 m high | a round bowl, raised rim, angular blocks thrown out around it | none | 1 |
| `zircon` | zircon sand | grains under half a millimetre | a bank of dark sand that glitters when the light catches it | none | 1 bank |
| `moon` | the Moon | far too large for a bar: no `size` | a pale disc seen through the moving surface, clearly larger than the Moon of today | drifts with the swell | above, as a backdrop |
| `sea` | the first sea | no `size` | the water itself | | everywhere, as a backdrop |

Above the surface, not exhibits: now and then a streak of light crosses the sky, a meteor.

What the engine already offers: rock from the density field, sprites for bubbles (use them for smoke and ash), the
plane above the world (`above` in the era's `AIR`) for sky and Moon. New: light that comes from the ground, the
glow of the lava. If the engine cannot do it, extend it in general terms: an era may name places that give off
light.

## The look: rules from the worlds built so far

This world has no animals. Its exhibits are rock, water, light and films of microbes. What makes such things look
real and not like plastic props:

- **R1. Form at three sizes.** The outline; lumps, ledges, cracks and layers of a few percent of the size in the mesh;
  grain in the shader. A smooth shape with a painted texture looks like a toy.
- **R2. No pattern that repeats,** and no noise that draws closed cells, except where the rock has them: the cracked
  glassy crust of pillow lava. There they are relief, not outlines.
- **R3. No drawn dark line of one width.** A layer is a step, a crack is a groove, shaded by the light.
- **R4. Nothing shines under water.** Rock and mats are matte. The lava glows by itself and lights what is near it;
  that glow is the only bright thing.
- **R5. Colours** as in "Atmosphere", with low saturation. Colour follows relief: hollows darker and dustier, edges
  and tops paler.
- **R6. No two alike.** Every dome, chimney or block differs in size, lean, wear and tone, from its seed.
- **R7. Motion** comes from water, particles, bubbles and light only. Nothing repeats exactly.
- **R8. Broken pieces belong here:** fallen blocks, rubble at the foot of every structure, a broken one that shows its
  inside.

## Build notes

Everything is rock, part of the floor or a standing kind: start from `FLOOR` and `standing.js` of `cambrian`. The
glow of the lava is new: an emissive term in the material, and a warm light on what lies within a few metres.

Nothing in this brief was checked again on 2026-11-23. All shapes follow things that exist today (pillow lava, black
smokers, the towers of the Lost City field): find a photograph with a scale for each before modelling, and name it
in the notes.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Hadean. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  pillow: {
    name: 'Pillow lava', sub: 'what lava does under water', size: 1,
    facts: [['Each pillow', 'about 1 m across'], ['Rock', 'basalt'], ['Still forms', 'on the sea floor today']],
    text: 'When lava flows out under water, its skin freezes at once. The glowing inside breaks through, swells into a new lobe and freezes again. What remains looks like a heap of stone pillows. The floor of this young ocean is made of them, and so is most of the deep sea floor today.',
  },
  lava: {
    name: 'Eruption', sub: 'a crack in the sea floor', size: 60,
    facts: [['Length of the crack', 'about 60 m'], ['Lava', 'more than 1,000 °C'], ['Glows', 'only for moments under water']],
    text: 'The young Earth is hotter inside than it will ever be again, and its crust is thin. Lava breaks through in many places. Under water it glows only for a moment: the sea cools its surface to black glass within seconds, and the water above it shimmers with heat.',
  },
  smoker: {
    name: 'Black smoker', sub: 'a hot spring on the sea floor', size: 12,
    facts: [['Height', '12 m'], ['The smoke', 'tiny grains of metal and sulphur'], ['Modelled on', 'vents of today']],
    text: 'Sea water seeps into the hot crust, heats up, dissolves metals and shoots back out. Where it meets the cold sea, the metals fall out as black grains and build chimneys. Vents like this exist today. Whether they looked the same four billion years ago, nobody has seen: no rock of that age is left.',
  },
  towers: {
    name: 'White towers', sub: 'a cooler, gentler kind of vent', size: 30,
    facts: [['Height', '30 m'], ['Built of', 'pale minerals from warm water'], ['Modelled on', 'the Lost City vents in the Atlantic']],
    text: 'Not every vent is black and scalding. Where sea water reacts with rock from deep below, warm water rises and builds pale towers full of tiny pores. Many researchers think that life could have started in places like this. It is one idea among several, and nobody knows.',
  },
  impact: {
    name: 'Impact crater', sub: 'a hit from space', size: 40,
    facts: [['Width', '40 m'], ['Hits', 'far more often than today'], ['Made by', 'a rock a few metres across']],
    text: 'The solar system is still full of rubble, and the Earth is hit far more often than today. Small bodies leave craters like this one. The largest may have turned the upper layers of the sea into steam. If life began this early, it may have had to begin more than once.',
  },
  zircon: {
    name: 'Zircon', sub: 'the oldest pieces of the Earth', size: 0.0004,
    facts: [['Size', 'less than half a millimetre'], ['Age of the oldest', '4.4 billion years'], ['Found', 'Jack Hills, Western Australia']],
    text: 'No rock is left from this time. What is left are grains of sand: crystals of zircon, so tough that they outlast the rock they grew in. Their chemistry says that they formed where there was liquid water. That is how we know that this ocean was here, 4.4 billion years ago.',
  },
  moon: {
    name: 'The Moon', sub: 'young, and much closer than today',
    facts: [['Formed', 'soon after the Earth'], ['Seen from here', 'much larger than today'], ['Tides', 'much stronger than today']],
    text: 'The pale disc above the waves is the Moon. It formed soon after the Earth, most likely from the wreckage of a collision with a body the size of Mars. At this time it circles much closer than today. Ever since, it has been moving away, and the days on Earth have grown longer.',
  },
  sea: {
    name: 'The first sea', sub: 'an ocean with nothing alive in it',
    facts: [['Living things known', 'none'], ['Oxygen in the air', 'none'], ['Sun', 'about a quarter fainter than today']],
    text: 'You are swimming in an ocean with nothing alive in it, as far as anyone knows: no fish, no plant, no microbe has left a trace from this time. The air above cannot be breathed. Everything that will ever live on Earth begins in water like this, some time in the next few hundred million years.',
  },
};
```

The sentences for the title menu:

> **Hadean · 4567 to 4031 million years ago.** The Earth is new. Its crust has cooled, and the steam of its first air
> has rained down into an ocean. No rock of this time is left, only grains of zircon that tell of water. Nothing
> lives here, as far as anyone knows. You dive about 4.3 billion years back, over a floor of fresh lava. What you see
> is a reconstruction: nobody knows how it looked.

## Sources

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 4567 and 4031.
- `zircon`: Sci.News, "Jack Hills Zircon: Scientists Discover Oldest-Known Fragment of Earth"
  (https://www.sci.news/geology/science-jack-hills-zircon-oldest-known-fragment-earth-01779.html): crystals from the
  Jack Hills of Western Australia crystallized 4.4 billion years ago, which supports a cool early Earth with liquid
  water and oceans. Smithsonian Magazine
  (https://www.smithsonianmag.com/smart-news/little-gem-oldest-piece-earth-weve-ever-found-180949869/): the dated
  crystal is 4.374 billion years old and 0.0157 inches (0.4 mm) long. NASA Earth Observatory, "Ancient Crystals
  Suggest Earlier Ocean" (https://earthobservatory.nasa.gov/features/Zircon): the chemistry of the crystals suggests
  that they formed in the presence of liquid water, likely an ocean; no Hadean rocks exist.

**Checked on 2026-11-23** (quotations are word for word from the page named):

- Nothing new. See "Checked on 2026-11-16" above.

**Not checked yet** (from Claude's knowledge, check before the text ships; what is listed as checked above is no
longer open):

- `pillow`: pillows about 1 m across; most of the deep sea floor of today is pillow basalt.
- `lava`: temperature of basalt lava; that the young Earth was hotter inside and its crust thin.
- `smoker`: how black smokers work; chimney heights of today's vents (the 12 m here is a choice within what exists
  today, the tallest known are several times higher).
- `towers`: the Lost City field, its towers (up to about 60 m), and the idea that life began at such vents.
- `impact`: the rate of impacts; that the largest could boil the upper ocean; the size of the body for a crater of
  40 m.
- `moon`: the giant impact as the origin of the Moon; that it was much closer and the tides stronger; the longer
  days since.
- `sea`: no trace of life from the Hadean; no oxygen; the Sun about a quarter fainter (the usual figure is about
  30 % fainter when the Sun formed).
- The moment "about 4.3 billion years ago" is a choice between the oldest zircon (4.4) and the end of the Hadean.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `pillow` | 6 |
| `lava` | 15 |
| `smoker` | 15 |
| `towers`, `impact` | 25 |
| `zircon` | 4 |
| `moon` | a backdrop, named when the player looks up at it |
| `sea` | a backdrop, named when nothing else is looked at |

## Only in this world

- **No animals, so the stages of `era-common.md` change:** 1 the place and its light, 2 smoke, ash and the glow of
  the lava, 3 sky, Moon and meteors, 4 the cards, 5 sound and menu text.
- **Keep the player out of the fire.** The collision keeps the camera out of the rock; the fissure must not be a
  trap either.
- **Empty is the point.** Do not fill the water with drifting things to make it look alive.

## Later, not in this task

- A large impact that the player can watch from below.
- Tides that move the surface up and down.
- The magma ocean, as a second viewpoint in time.
