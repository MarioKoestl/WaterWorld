# Brief: the Proterozoic world

The longest stretch of the journey: almost two billion years in one stop. The player dives 1.56 billion years back,
to a calm, clear sea with great reefs of stone built by microbes, and to the first living things that are as long as
a forearm.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done), with the Proterozoic ending at 635 (see `era-common.md`, "Before the first of these
  worlds is started"). `scale.md` for the size picture and for the close camera, which this world asks for.
- **Result:** `proterozoic.html`, chosen from the timeline in the title menu.

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
   a. Notes in `docs/research/proterozoic/<id>.md` from the sources named in "Build notes": what they print, what you
      measured on which figure, what stays an estimate.
   b. The mesh, with its figures in lengths of the body in a comment.
   c. `node tools/turntable.mjs proterozoic <id> <name>` (look at `node tools/chrome.mjs status` first).
   d. The visual critic on the turntable, with the list of "The look" as its questions.
   e. Correct, twice at most. Then the next kind.
4. **A source that cannot be opened:** say so in the notes and mark the figure as estimate. Never invent a
   measurement, a quotation or a colour.
5. **Budget.** Small edits in place. The engine is the only renderer. Hand-overs of 20 lines or fewer: what is in,
   what Mario should open and look at, what is still not verified, one commit message.

## The place

In the timeline of the game the Proterozoic lasts from 2500 to 635 million years ago. The world shows one moment,
1.56 billion years ago, and one place: a shallow sea over what is now North China. In mudstone from that sea
researchers found flat, blade-shaped fossils up to 30 cm long, the oldest living things of that size known so far.
Around them the world shows what filled the seas of the whole Proterozoic: stromatolites, larger and more varied
than ever before or after.

## What is special about the Proterozoic, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| Oxygen: microbes fill the air with it and rust the iron out of the sea | the bubbles on the mats; the oxygen card; water that is no longer green |
| The great age of the stromatolites | the columns, the domes, the reef |
| Cells with a nucleus, and the first bodies of many cells | the fronds, Grypania |
| A billion years in which little seems to happen | the card of the sea; the stillness |
| At the end, the Earth freezes over | the menu text; the card of the sea |

## Decisions

| Decision | By |
|---|---|
| One real place and time for the fronds: North China, 1.56 billion years ago | Claude |
| Eight exhibits, not ten: almost nothing here has a body | Claude |
| The stromatolite reef around the fronds stands for the whole Proterozoic. Its shapes and sizes are not taken from this one place | Claude |
| The water is clear and blue-green: oxygen has cleared the iron out of the upper sea | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: a bright, clear, silent sea. Sunlight on pale stone columns as far as one can see. A garden
that nobody tends and nobody eats.

| | World of today | Proterozoic |
|---|---|---|
| Water | clear blue | very clear, blue-green, turning dark and bluish-grey towards the deep |
| How far one sees | far | farther than in any other world: about 80 m |
| Surface | visible from below, with waves | visible, calm, with small ripples |
| Sunlight | strong, sharp shafts, bright flecks | strong. Long clear shafts, bright flecks on the pale stone |
| Drifting particles | a few | almost none. Strings of small silver bubbles rise from the mats |
| Ground | rock and sand, strong colours | pale grey and cream stone, dark green and black mats, grey mud in the deeper part |
| Sound | rumble, surface wash, chimes, whale calls | very quiet. Soft surface wash, the tick of bubbles. No calls |

## Sea floor

- **The reef.** A wide platform 3 to 10 m deep, crowded with columns and domes, with channels of pale sand between
  them where the player can swim.
- **The edge.** The platform ends in a step. Beyond it the floor drops away into darker water.
- **The mud flat.** At the foot of the step, 15 to 20 m deep: smooth grey mud. Here the fronds stand, and the coils
  of Grypania lie on the mud.
- **Not here:** anything that swims or crawls. No shells, no tracks, no burrows.

## The eight exhibits

Sizes in metres, one unit is one metre. The fronds and Grypania are small: this world asks for the close camera of
`scale.md`.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `fronds` | the first large living things | up to 0.3 long, 0.08 wide | flat dark blades: long and narrow, tongue-shaped or wedge-shaped, held to the mud at one end | sway a little | about 400, in loose stands on the mud flat |
| `grypania` | Grypania | ribbon under 2 mm wide, coil about 0.02 across | a thin dark ribbon rolled into a flat spiral | none | about 200, lying on the mud |
| `columns` | column stromatolites | up to 2 high, 0.3 to 0.6 thick | upright stone pillars, some branching like candlesticks, with fine layers where broken | none | thousands, on the reef |
| `domes` | giant domes | up to 5 across, 2 high | broad layered mounds, the largest things life has built so far | none | about 40, on the reef |
| `mat` | microbial mats | a few millimetres thick | dark green and black skins on the tops of columns and domes | bubbles form and let go | on all stone that gets light |
| `oxygen` | oxygen | bubbles of a few millimetres | strings of silver bubbles rising from the mats | rise | everywhere above the mats |
| `reef` | the reef | no `size` | the whole platform of columns and domes | | a backdrop |
| `sea` | the quiet sea | no `size` | the water itself | | a backdrop |

What the engine already offers: standing kinds in masses, the leaves of `today` for blades that sway, sprites for
bubbles.

## The look: rules from the worlds built so far

This world has no animals. Its exhibits are rock, water, light and films of microbes. What makes such things look
real and not like plastic props:

- **R1. Form at three sizes.** The outline; lumps, ledges, cracks and layers of a few percent of the size in the mesh;
  grain in the shader. A smooth shape with a painted texture looks like a toy.
- **R2. No pattern that repeats,** and no noise that draws closed cells, except where the rock has them: the fine
  layers of a broken column, the wrinkles of a mat. There they are relief, not outlines.
- **R3. No drawn dark line of one width.** A layer is a step, a crack is a groove, shaded by the light.
- **R4. Nothing shines under water.** Rock and mats are matte. The bubbles are the only bright thing.
- **R5. Colours** as in "Atmosphere", with low saturation. Colour follows relief: hollows darker and dustier, edges
  and tops paler.
- **R6. No two alike.** Every dome, chimney or block differs in size, lean, wear and tone, from its seed.
- **R7. Motion** comes from water, particles, bubbles and light only. Nothing repeats exactly.
- **R8. Broken pieces belong here:** fallen blocks, rubble at the foot of every structure, a broken one that shows its
  inside.

## Build notes

Everything is a standing kind or part of the floor: start from `standing.js` and `FLOOR` of `cambrian`.

- **`fronds`.** Four shapes in the source: oblong, tongue-shaped (the largest, up to 28.6 cm), wedge-shaped (up to
  18 cm, widening to a ribbon up to 4.2 cm wide) and linear. Up to 30 cm long and nearly 8 cm wide in all. They are
  known as flat dark films in the rock: thickness and colour in life are not known. Thin, dark, limp blades that
  move with the water, estimate.
- **`columns`, `domes`, `mat`, `oxygen`, `grypania`.** As in the table: not verified beyond version 1.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Proterozoic. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  fronds: {
    name: 'The first large life', sub: 'fossils from North China, 1.56 billion years old', size: 0.3,
    facts: [['Length', 'up to 30 cm'], ['Width', 'up to 8 cm'], ['Its cells', 'about a hundredth of a millimetre each']],
    text: 'For two billion years nothing alive was larger than a speck. These blades are the oldest known exception: as long as a forearm and built of countless cells packed side by side. They probably lived from sunlight, as seaweed does. Which group of living things they belong to, nobody can say.',
  },
  grypania: {
    name: 'Grypania', sub: 'a coiled ribbon', size: 0.02,
    facts: [['Ribbon', 'less than 2 mm wide'], ['Length', 'a few centimetres, rolled up'], ['What it is', 'probably an alga']],
    text: 'A thin dark ribbon, rolled up like a watch spring and lying on the mud. It is one of the oldest fossils that can be seen without a microscope. Many researchers take it for an early alga, whose cells have a nucleus like yours. Others think it is a colony of bacteria.',
  },
  columns: {
    name: 'Column stromatolites', sub: 'pillars built by microbes', size: 2,
    facts: [['Height', 'up to about 2 m'], ['Built by', 'mats of microbes, layer on layer'], ['Their great age', 'the Proterozoic']],
    text: 'Stromatolites are far older than this sea, but only now do they reach their greatest variety: cones, pillars, branching candlesticks, hundreds of forms. Each is built by a thin living mat on its top. They can grow undisturbed, because there is still no animal that could graze them.',
  },
  domes: {
    name: 'Giant domes', sub: 'the largest things that life has built so far', size: 5,
    facts: [['Width', 'up to about 5 m'], ['Alive', 'only the top few millimetres'], ['Age of one dome', 'thousands of years']],
    text: 'A mound of stone as wide as a room, raised by living beings that cannot be seen. Every thin band inside is an old surface, where a mat of microbes once lay in the light. When animals appear, more than a billion years from now, they will eat the mats, and structures like this will become rare.',
  },
  mat: {
    name: 'Microbial mat', sub: 'the builders of the reef', size: 0.005,
    facts: [['Thickness', 'a few millimetres'], ['Top layer', 'cyanobacteria, which live from sunlight'], ['Makes', 'oxygen']],
    text: 'The dark skin on every stone is the living part of the reef. Its top layer is made of cyanobacteria. They do what every plant will do later: with the energy of sunlight they build sugar from water and carbon dioxide, and they give off oxygen.',
  },
  oxygen: {
    name: 'Oxygen', sub: 'the gas that changed the world', size: 0.003,
    facts: [['Made by', 'cyanobacteria'], ['In the air since', 'about 2.4 billion years ago'], ['In the air now', 'far less than today']],
    text: 'The silver bubbles are oxygen, the waste of the microbes below. First it rusted the iron out of the sea: the rust sank and became the iron ore that is mined today. Then it began to fill the air. For most living things of that time it was poison. Without it there would be no animals.',
  },
  reef: {
    name: 'The reef', sub: 'a garden that nobody eats',
    facts: [['Built by', 'microbes only'], ['Animals', 'none yet'], ['Seaweed and corals', 'none yet']],
    text: 'Reefs like this one line the shallow seas of the Proterozoic, some for hundreds of kilometres. They are built without a single animal: no coral, no sponge, no shell. Nothing swims between the columns, nothing crawls, nothing leaves a track. It is the quietest reef you will ever see.',
  },
  sea: {
    name: 'The quiet sea', sub: 'a billion years in which little seems to change',
    facts: [['Upper water', 'clear, with a little oxygen'], ['Deep water', 'no oxygen'], ['At the end of this era', 'the whole Earth freezes over']],
    text: 'Geologists call the middle of the Proterozoic the boring billion: a thousand million years with a steady climate and slow change. In that calm, cells with a nucleus appear, and the first bodies of many cells. It ends in the cold. More than once, ice covers the Earth almost from pole to pole.',
  },
};
```

The sentences for the title menu:

> **Proterozoic · 2500 to 635 million years ago.** The longest stretch of the journey: almost two billion years.
> Microbes fill the air with oxygen and rust the iron out of the sea. Cells get a nucleus, then learn to live
> together in one body. You dive 1.56 billion years back, to reefs built by microbes and to the first living things
> as long as your forearm. At the end of this time the whole Earth freezes over.

## Sources

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 2500 and 635.
- `fronds`: Zhu and others, "Decimetre-scale multicellular eukaryotes from the 1.56-billion-year-old Gaoyuzhuang
  Formation in North China", Nature Communications 2016 (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4873660/;
  abstract at https://ui.adsabs.harvard.edu/abs/2016NatCo...711500Z): fossils 1,560 million years old from the
  Yanshan area, linear to lance-shaped, up to 30 cm long and nearly 8 cm wide, living on the sea floor, with
  closely packed cells of about 10 micrometres, probably photosynthetic, their place among the eukaryotes unknown.
  Nanjing Institute of Geology and Palaeontology
  (https://english.nigpas.cas.cn/ns/palaeonews/no3/201608/t20160810_166355.html): 167 measurable fossils, four
  regular shapes (linear, wedge-shaped, oblong, tongue-shaped).
- `grypania`: the same institute (https://english.nigpas.cas.cn/rh/rp/201605/t20160518_163205.html): a coiled,
  ribbon-like fossil less than two millimetres wide and a few centimetres long.
- `oxygen`: the date of about 2.4 billion years for the Great Oxidation Event, from the sources of
  `era-archean.md`.

**Checked on 2026-11-23** (quotations are word for word from the page named):

- `fronds`: Zhu and others 2016, Nature Communications 7, 11500 (https://doi.org/10.1038/ncomms11500), figure 3:
  "linear to lanceolate shapes up to 30 cm long and nearly 8 cm wide"; 1,560 million years old, Gaoyuzhuang
  Formation, North China; the shapes and sizes given in "Build notes".

**Not checked yet** (from Claude's knowledge, check before the text ships; what is listed as checked above is no
longer open):

- Whether stromatolites and Grypania occur in the same rocks as the fronds. Grypania is known from several places
  and ages; the world puts it next to the fronds as a fossil of the same era, not of the same bed.
- `grypania`: the two readings, alga or colony of bacteria.
- `columns`, `domes`, `reef`: sizes (2 m, 5 m, reefs of hundreds of kilometres), the number of forms, the peak of
  stromatolites in the Proterozoic and their decline when grazing animals appear, the age of a dome.
- `mat`: cyanobacteria as the top layer; photosynthesis as described.
- `oxygen`: that the bubbles on mats are oxygen; iron ore (banded iron formations) from rusted sea iron; oxygen as a
  poison for much of early life; oxygen far below today's level.
- `sea`: the term "boring billion"; first cells with a nucleus and first many-celled bodies in that time; the
  Snowball Earth glaciations near the end (about 720 to 635 million years ago); oxygen only in the upper water.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `fronds`, `grypania` | 2 |
| `columns`, `mat`, `oxygen` | 3 |
| `domes` | 8 |
| `reef` | a backdrop, named from the channels when nothing else is looked at |
| `sea` | a backdrop, named over the mud flat and beyond the edge |

## Only in this world

- **No animals, so the stages of `era-common.md` change:** 1 the place and its light, 2 columns, domes and mats,
  3 fronds, Grypania and bubbles, 4 the cards, 5 sound and menu text.
- **Clear water shows everything.** With 80 m of view the simpler far meshes will be seen.
  Plan the reef so that the columns thin out towards the edge of the view.
- **Two stops in one.** The reef is the first picture, the mud flat with the fronds the discovery. One viewpoint has
  to stand right in front of a stand of fronds.

## Later, not in this task

- Snowball Earth as a world of its own: a sea under ice.
- The banded iron settling out of a green sea, at the start of the Proterozoic.
