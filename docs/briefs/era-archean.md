# Brief: the Archean world

Life has begun, and all of it is too small to see. The player dives about 3.4 billion years back, to a shallow green
sea beside a bare volcanic island, where microbes build one of the oldest reefs known: low cones and domes of stone.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture and for the close camera, which this world asks for.
- **Result:** `archean.html`, chosen from the timeline in the title menu.

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
   a. Notes in `docs/research/archean/<id>.md` from the sources named in "Build notes": what they print, what you
      measured on which figure, what stays an estimate.
   b. The mesh, with its figures in lengths of the body in a comment.
   c. `node tools/turntable.mjs archean <id> <name>` (look at `node tools/chrome.mjs status` first).
   d. The visual critic on the turntable, with the list of "The look" as its questions.
   e. Correct, twice at most. Then the next kind.
4. **A source that cannot be opened:** say so in the notes and mark the figure as estimate. Never invent a
   measurement, a quotation or a colour.
5. **Budget.** Small edits in place. The engine is the only renderer. Hand-overs of 20 lines or fewer: what is in,
   what Mario should open and look at, what is still not verified, one commit message.

## The place

The Archean lasted from 4031 to 2500 million years ago. The world shows one moment, about 3.4 billion years ago, and
one place: a shallow sea on the flank of a volcanic island in what is now the Pilbara in Western Australia. The rocks
there hold a reef of stromatolites, structures built layer by layer by films of microbes. They are among the oldest
signs of life that most researchers accept.

## What is special about the Archean, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| Life exists, and every living thing is a single cell | the mats; the menu text |
| Microbes build stone: the first reefs | the cones and the domes |
| Life at hot springs, without sunlight | the spring |
| The sea is full of iron and has no oxygen | the green water; the card of the sea |
| The air cannot be breathed, the Sun is fainter | the card of the sky; the light |
| Lava hotter than any today | the komatiite field |
| Land is bare rock | the island |

## Decisions

| Decision | By |
|---|---|
| One real place and time: the stromatolite reef of the Pilbara, about 3.4 billion years ago | Claude |
| Eight exhibits, not ten: nothing here has a body | Claude |
| The water is green, after a study of 2025. It is a hypothesis, and the card says so | Claude |
| The sky is an orange haze. That is a guess, and the card says so | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: a warm, shallow, green sea under an orange sky, with dark rock and pale stone gardens. Strange
and peaceful. Nothing moves except light, water and bubbles.

| | World of today | Archean |
|---|---|---|
| Water | clear blue | green, a little cloudy from fine rust-coloured particles |
| How far one sees | far | about 30 m |
| Surface | visible from below, with waves | close: the water is 2 to 12 m deep. Above it an orange haze, no blue |
| Sunlight | strong, sharp shafts, bright flecks | weaker and greenish-gold. Soft shafts and soft flecks on the ground |
| Drifting particles | a few | fine rust-coloured dust, sinking slowly |
| Ground | rock and sand, strong colours | dark lava, pale carbonate and chert, covered with mats in dull green, purple and ochre |
| Sound | rumble, surface wash, chimes, whale calls | surface wash, soft bubbling at the spring. No calls |

The colour of water and sky is not known. The menu text says so.

## Sea floor

- **The reef flat.** A wide shallow shelf of pale stone, 2 to 6 m deep, where the cones and domes stand in fields.
- **The island.** One side of the world rises to the surface and above it: dark, bare volcanic rock. It is the edge
  of the world on that side.
- **The slope.** Away from the island the floor drops to about 12 m and runs out into the green haze.
- **The spring.** Cracks in the lava at the foot of the island, with white and rust-coloured crusts and a little
  rising gas.
- **The komatiite field.** An old lava flow whose surface shows fans of long needle crystals.
- **Not here:** anything that swims, crawls or grows a leaf.

## The eight exhibits

Sizes in metres, one unit is one metre. Most of this world is small: it asks for the close camera of `scale.md`.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `cones` | cone stromatolites | 0.03 to 0.2 high | sharp little cones side by side, like an egg carton turned over; fine layers where one is broken | none | thousands, in fields on the reef flat |
| `domes` | dome stromatolites | up to 1 across, 0.5 high | low round cushions of layered stone, some joined | none | a few hundred, between the cone fields |
| `mat` | microbial mat | a few millimetres thick, metres wide | a slimy, wrinkled skin over stone and sand, dull green on top, purple where torn | small bubbles sit on it | covers the reef flat |
| `spring` | hot spring | cracks over about 5 m | cracks with white and rust crusts, yellow streaks | warm water shimmers, a few bubbles rise | 1 |
| `komatiite` | komatiite lava | field about 20 m across | dark greenish rock with fans of needle crystals up to 0.5 m long on its surface | none | 1 |
| `island` | the first land | no `size` | dark, cracked volcanic rock rising out of the water, nothing on it | | one side of the world, as a backdrop |
| `sea` | the green sea | no `size` | the water itself | | everywhere, as a backdrop |
| `sky` | the sky | no `size` | orange haze seen through the surface, a small pale Sun | | above, as a backdrop |

What the engine already offers: things that stand in masses (the way sponges and corals are scattered today), the
standing kinds of `cambrian` for cones and domes, sprites for bubbles, the plane above the world for the sky.

## The look: rules from the worlds built so far

This world has no animals. Its exhibits are rock, water, light and films of microbes. What makes such things look
real and not like plastic props:

- **R1. Form at three sizes.** The outline; lumps, ledges, cracks and layers of a few percent of the size in the mesh;
  grain in the shader. A smooth shape with a painted texture looks like a toy.
- **R2. No pattern that repeats,** and no noise that draws closed cells, except where the rock has them: the egg-
  carton field of small cones, the needle fans of the komatiite. There they are relief, not outlines.
- **R3. No drawn dark line of one width.** A layer is a step, a crack is a groove, shaded by the light.
- **R4. Nothing shines under water.** Rock and mats are matte. No glow anywhere.
- **R5. Colours** as in "Atmosphere", with low saturation. Colour follows relief: hollows darker and dustier, edges
  and tops paler.
- **R6. No two alike.** Every dome, chimney or block differs in size, lean, wear and tone, from its seed.
- **R7. Motion** comes from water, particles, bubbles and light only. Nothing repeats exactly.
- **R8. Broken pieces belong here:** fallen blocks, rubble at the foot of every structure, a broken one that shows its
  inside.

## Build notes

Everything is a standing kind or part of the floor: start from `standing.js` and `FLOOR` of `cambrian`.

- **`cones`, `domes`.** The source describes more than seven kinds of structure along 10 km of outcrop, among them a
  surface like an egg carton and large cones. Sizes in the table are estimates: measure on the photographs of
  Allwood and others 2006 (a copy is on the site of the University of New South Wales) before modelling.
- **The others.** As in the table: not verified beyond version 1.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Archean. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  cones: {
    name: 'Cone stromatolites', sub: 'stone built by microbes', size: 0.2,
    facts: [['Height', 'a few centimetres to about 20 cm'], ['Built by', 'films of microbes'], ['Age of this reef', 'about 3.4 billion years']],
    text: 'These little cones are neither animals nor plants. Films of microbes grow on the sea floor, catch grains and minerals, and grow up through them again, layer after layer. What remains is stone with fine bands. A reef of such cones in Western Australia is among the oldest signs of life on Earth.',
  },
  domes: {
    name: 'Dome stromatolites', sub: 'alive only on the skin', size: 1,
    facts: [['Width', 'up to about 1 m'], ['Grows', 'a fraction of a millimetre a year'], ['Still alive today', 'Shark Bay, Western Australia']],
    text: 'Only the top layer of a dome is alive: a mat of microbes. Everything below is what earlier layers left behind. For three billion years, most of the history of life, structures like these were the largest things that living beings built. A few still grow today in Shark Bay, Western Australia.',
  },
  mat: {
    name: 'Microbial mat', sub: 'a living skin on the sea floor', size: 0.005,
    facts: [['Thickness', 'a few millimetres'], ['Made of', 'single cells, in layers'], ['Grazed by', 'nothing yet']],
    text: 'Slime, and the most important thing in this world. Every living being of the Archean is a single cell, too small to see. But they live together in mats, in layers where one kind feeds on what another leaves. Nothing eats them: the first grazing animals are almost three billion years away.',
  },
  spring: {
    name: 'Hot spring', sub: 'warm water from below', size: 5,
    facts: [['Width here', 'about 5 m'], ['Brings up', 'minerals and gases'], ['Feeds', 'microbes that need no sunlight']],
    text: 'Warm water rises through cracks in the lava and leaves white and rust-coloured crusts. Some microbes do not need the Sun: they live from the chemical energy that such springs bring up. In rocks of this age in Western Australia, traces of life are found right beside old springs.',
  },
  komatiite: {
    name: 'Komatiite', sub: 'lava hotter than any today', size: 0.5,
    facts: [['Crystals', 'needles up to half a metre long'], ['Temperature when it flowed', 'about 1,600 °C'], ['Erupts today', 'nowhere']],
    text: 'A lava that the Earth can hardly make any more. The young planet is hotter inside, and its lava comes up hotter and thinner than any of today. It runs almost like water and cools into fans of long needle crystals. Geologists call the pattern spinifex, after a spiky Australian grass.',
  },
  island: {
    name: 'The first land', sub: 'bare rock, nothing green',
    facts: [['Plants on land', 'none for almost 3 billion years'], ['Ozone layer', 'none'], ['Soil', 'none']],
    text: 'The slope beside you runs up to an island of dark volcanic rock. Nothing grows on it. Without oxygen there is no ozone layer, and the sunlight that reaches the ground is harsh. Life keeps to the water. Whether the Earth already had large continents at this time is still argued about.',
  },
  sea: {
    name: 'The green sea', sub: 'water full of iron',
    facts: [['Dissolved in it', 'iron'], ['Oxygen', 'none'], ['Colour', 'green, says a study of 2025']],
    text: 'The sea of the Archean carries iron, which the sea of today cannot: oxygen would turn it to rust at once. Where rust does form, its fine particles swallow blue and red light and let green pass. Researchers in Japan concluded in 2025 that these seas looked green. It is a calculation, not a photograph.',
  },
  sky: {
    name: 'The sky', sub: 'air that nobody could breathe',
    facts: [['Oxygen', 'almost none'], ['Sun', 'about a fifth fainter than today'], ['Colour', 'unknown, orange is a guess']],
    text: 'Above the surface is air without oxygen: mostly nitrogen and carbon dioxide, with some methane. The young Sun shines about a fifth weaker than today. The sea is not frozen all the same, because those gases hold the warmth. The colour of this sky is a guess: some researchers picture an orange haze.',
  },
};
```

The sentences for the title menu:

> **Archean · 4031 to 2500 million years ago.** Life exists, and all of it is too small to see. For one and a half
> billion years the sea belongs to microbes. They live in mats and build reefs of stone, layer by layer. The air has
> no oxygen and the water is full of iron. You dive about 3.4 billion years back, to one of the oldest reefs known.
> The green water and the orange sky are guesses.

## Sources

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 4031 and 2500.
- `sea`: Nagoya University, press release "Were our blue oceans once green?", on EurekAlert
  (https://www.eurekalert.org/news-releases/1078185), and Astrobiology.com
  (https://astrobiology.com/2025/03/30/were-earths-blue-oceans-once-green/): study by Taro Matsuo and others in
  Nature Ecology & Evolution, 2025. The Archean ocean held much dissolved iron from hydrothermal vents; oxidized
  iron forms rust-like particles that absorb blue and red light, so mainly green light passes; cyanobacteria with
  pigments for green light did well in it. The same pages date the Great Oxidation Event to about 2.4 billion years
  ago.

**Checked on 2026-11-23** (quotations are word for word from the page named):

- **Place**, `cones`: Allwood and others 2006, Nature, abstract: "The 3,430-million-year-old Strelley Pool Chert",
  with layered structures of probable biological origin. Scientific American, "Findings Strengthen Case for Signs of
  Early Life in Australian Rocks" (https://www.scientificamerican.com/article/findings-strengthen-case): a stretch
  of 10 km; more than seven kinds of structure; "a surface resembling egg-carton ripples", others large cones.

**Not checked yet** (from Claude's knowledge, check before the text ships; what is listed as checked above is no
longer open):

- **Place.** The stromatolite reef in the Strelley Pool rocks of the Pilbara, about 3.43 billion years old, described
  by Allwood and others in Nature in 2006: cone shapes like an egg carton, domes and other forms along about 10 km.
  Check age, shapes and sizes there. Sizes in the table are estimates.
- `domes`: growth rate; living stromatolites in Shark Bay.
- `mat`: thickness and layering of microbial mats.
- `spring`: traces of life beside old hot springs in the Pilbara (Dresser Formation, about 3.48 billion years).
- `komatiite`: eruption temperature, spinifex texture, crystal length, that none erupts today, and whether
  komatiite is found in the Pilbara rocks of this age.
- `island`: no ozone layer without oxygen; the debate about early continents.
- `sky`: composition of the air; the Sun about a fifth fainter at this time; the orange haze.
- The green water is a result of 2025 for the Archean as a whole. Whether it holds for 3.4 billion years ago, before
  oxygen-making microbes are certain, is open. The card calls it a calculation.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `cones`, `mat` | 2 |
| `domes` | 3 |
| `spring` | 6 |
| `komatiite` | 8 |
| `island` | a backdrop, 20 from its foot |
| `sea` | a backdrop, named when nothing else is looked at |
| `sky` | a backdrop, named when the player looks up through the surface |

## Only in this world

- **No animals, so the stages of `era-common.md` change:** 1 the place and its light, 2 cones, domes and mats,
  3 spring, komatiite, bubbles and dust, 4 the cards and the sky, 5 sound and menu text.
- **Shallow water.** The surface is always near. Check that its picture from below holds up at 2 m.
- **Small things in masses.** The cones are the picture of this world: thousands of them. Keep them cheap to draw,
  so that they stand in fields, not as single cones.

## Later, not in this task

- The end of the Archean: banded iron settling out of the water as oxygen appears.
- A much closer Moon and strong tides that fall dry part of the reef.
