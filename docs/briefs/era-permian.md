# Brief: the Permian world

The last world of the old seas. The player dives about 280 million years back, to a pale reef at the rim of a deep
basin in what is now West Texas. The reef is built by sponges and lamp shells, not by corals. In the dark blue water
in front of it hunts Helicoprion, a fish 7 m long with a spiral saw of teeth in its lower jaw. Almost everything
here will be gone at the end of the era.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture and for the close camera, which this world asks for
  (its reef life is small).
- **Result:** `permian.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## The place

The Permian lasted from 298.9 to 251.902 million years ago. The world shows one moment in its first half, about 280
million years ago, and one place: the edge of a deep basin in an inland sea of Pangaea, where the Glass Mountains of
West Texas stand today. Reefs of sponges, algae and lamp shells grew along the rim. Their limestone holds some of
the best kept shells in the world, and tooth spirals of Helicoprion have been found in rocks of this region.

## What is special about the Permian, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| One continent, Pangaea, with deserts inside | the warm, dusty sky above the surface; the card of the reef |
| Reefs without corals | the sponges, the cone shells, the reef itself |
| The great age of the lamp shells | the spiny lamp shells, the cone shells |
| Giant single cells that build rock | the fusulinids |
| The strangest jaw in the history of fish | Helicoprion |
| The last of the trilobites | the trilobite |
| The end: the worst mass extinction of all | the card of the open sea; almost every other card |

## Decisions

| Decision | By |
|---|---|
| One real place and time: the reef rim of the Glass Mountains, about 280 million years ago | Claude |
| Helicoprion is 7 m long here, within the range a researcher gives for a large one (6 to 7.6 m) | Claude |
| Twelve cards: ten living exhibits, the reef, and the open sea for the story of the great dying | Claude |
| The list | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: hard light and deep colour. A pale reef wall, water that falls away into indigo, a sky the
colour of dust. Beautiful and a little ominous: a rich world just before its end.

| | World of today | Permian |
|---|---|---|
| Water | clear blue | very clear, deep indigo to violet-blue, nearly black in the basin |
| How far one sees | far | about 70 m |
| Surface | visible from below, with waves | visible. Behind it a pale, yellowish-pink sky, hazy with desert dust |
| Sunlight | strong, sharp shafts, bright flecks | very strong and a little warm in colour. Sharp shafts, hard shadows on the reef |
| Drifting particles | a few | very few |
| Ground | rock and sand, strong colours | cream and pale grey reef rock, patches of pale grain sand, dark where the slope falls into the basin |
| Sound | rumble, surface wash, chimes, whale calls | surface wash, a deep, slow drone from the basin. No calls |

## Sea floor

- **The reef flat.** A shelf 3 to 10 m deep on one side of the world, with patches of grain sand between low
  mounds.
- **The reef rim.** The edge of the shelf: massive, knobbly, full of holes and ledges. This is where most exhibits
  live.
- **The slope.** In front of the rim the floor drops steeply, with blocks that have broken off, down to the lower
  limit of the world and out of sight.
- **The basin.** Open water in front of the slope: the hunting ground of Helicoprion.
- **Not here:** corals like those of today, seaweed forests, schools of silver fish.

## The exhibits

Sizes in metres, one unit is one metre. The reef life is small: this world asks for the close camera of `scale.md`.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `helicoprion` | Helicoprion | 7 | a large, shark-like fish with a blunt head. In the middle of its lower jaw stands a spiral of teeth, of which the top third shows as an upright saw. No teeth in the upper jaw | cruises along the slope on wide paths; the jaw closes slowly | 2 |
| `sponge` | reef sponges | 0.1 to 0.5 | stony sponges like strings of beads, cups and fingers, in pale colours, with crusts between them | none | thousands, they are the reef rim |
| `coneshell` | cone-shaped lamp shells | 0.03 to 0.06 | a small stone cone fixed by its tip, with a flat lid, crowded like a honeycomb of cups | lids slightly open | thousands, in clusters on the rim |
| `productid` | spiny lamp shells | 0.03 to 0.08 | a deep bowl-shaped shell with a flatter lid, long thin spines pointing down and outwards | none | hundreds, on mud and sand |
| `fusulinid` | fusulinids | 0.005 to 0.01 | grains like rice or small spindles, forming the sand | none | sand patches on the flat |
| `bryozoan` | lace moss animals | fans 0.05 to 0.15 | upright fans and funnels of fine stony mesh | none | hundreds |
| `crinoid` | sea lilies | 0.3 to 0.8 high | a stalk with a crown of feathery arms | sway | meadows on the upper slope |
| `ammonoid` | ammonoids | shell 0.03 to 0.1 across | a coiled shell with a zigzag line pattern, head and arms in its opening | swim in short jerks | 4 groups of about 30 |
| `cooperoceras` | the spiny nautilus Cooperoceras | shell about 0.12 across | a loosely coiled shell with two rows of long curved spines | swims slowly, alone | about 15 |
| `trilobite` | one of the last trilobites | about 0.03 | a small oval shield in three parts | walks on the reef rock | about 40, hard to find on purpose |
| `reef` | the reef | no `size` | the rim and the slope | | a backdrop |
| `sea` | the open sea | no `size` | the dark water over the basin | | a backdrop, named when the player looks out into the basin |

Order of work, easiest first: the reef builders and what stands (`sponge`, `coneshell`, `productid`, `fusulinid`,
`bryozoan`, `crinoid`), then the swimmers (`ammonoid`, `cooperoceras`, `helicoprion`), then the walker
(`trilobite`).

What the engine already offers: a wall as the edge of the world (the reef wall of `cambrian`), scattering in masses,
swarms, walkers, a large animal on a path (the plesiosaur of `today`).

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Permian. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  helicoprion: {
    name: 'Helicoprion', sub: 'Helicoprion · the buzz-saw fish', size: 7,
    facts: [['Length', 'a large one 6 to 7.6 m'], ['Teeth', 'one spiral in the lower jaw'], ['Relatives today', 'ratfish, not sharks']],
    text: 'A spiral of teeth like the blade of a circular saw. For a hundred years nobody knew where on the animal it belonged: on the snout, the back, the tail? Scans of a fossil with jaw cartilage settled it in 2013. The spiral fills the lower jaw. New teeth grow in at the back, and old ones are never shed.',
  },
  sponge: {
    name: 'Reef sponges', sub: 'the builders of this reef', size: 0.5,
    facts: [['Size', '10 to 50 cm'], ['Skeleton', 'lime, in chambers like beads'], ['Helped by', 'crusts of algae and microbes']],
    text: 'This reef is not built by corals. Its frame is made of sponges with a skeleton of lime, shaped like strings of beads, cups and fingers, and of crusts that glue everything together. Reefs like this ring the inland sea for millions of years. One of them is a mountain range today, the Guadalupe Mountains.',
  },
  coneshell: {
    name: 'Cone shells', sub: 'lamp shells that grow like corals', size: 0.06,
    facts: [['Height', '3 to 6 cm'], ['Lower shell', 'a cone, cemented to the reef'], ['Upper shell', 'a lid']],
    text: 'They look like small corals and are lamp shells. The lower half of the shell has grown into a cone that is fixed to the reef, and the upper half sits on it like a lid. Crowded together they build whole patches of reef. They exist only in the Permian and vanish at its end.',
  },
  productid: {
    name: 'Spiny lamp shells', sub: 'productids · on stilts in the mud', size: 0.08,
    facts: [['Width', '3 to 8 cm'], ['Spines', 'long, thin and hollow'], ['Lamp shells in the Permian', 'richer than ever']],
    text: 'A lamp shell that rests on the soft floor like a bowl. Long, hollow spines keep it from sinking, as snowshoes would. Lamp shells are at their richest in this era, and the rocks of this reef have given up hundreds of kinds. At the end of the Permian almost all of them disappear.',
  },
  fusulinid: {
    name: 'Fusulinids', sub: 'single cells the size of a rice grain', size: 0.01,
    facts: [['Length', '5 to 10 mm'], ['Each one', 'a single cell in a shell'], ['Their shells', 'build whole beds of limestone']],
    text: 'The pale grains on the floor are not sand. Each is the shell of one single cell, coiled like a tiny roll of paper and as large as a grain of rice: a giant among single cells. They lived in such numbers that their shells built thick beds of rock. None survives the end of the Permian.',
  },
  bryozoan: {
    name: 'Lace moss animals', sub: 'colonies like fans of lace', size: 0.15,
    facts: [['Fan', '5 to 15 cm'], ['Each animal', 'smaller than a millimetre'], ['Food', 'sieved from the water']],
    text: 'A fan of stony lace, finer than any net. In each rib lived a row of tiny animals with crowns of tentacles. Together they drew water through the holes of the mesh and sieved their food out of it. Fans like this stand all over the reef, turned across the current.',
  },
  crinoid: {
    name: 'Sea lilies', sub: 'the last great gardens', size: 0.8,
    facts: [['Height', '30 to 80 cm'], ['In the seas for', '200 million years by now'], ['At the end of the Permian', 'nearly all die out']],
    text: 'Sea lilies have filled the seas for 200 million years, and this is one of their last great gardens. At the end of the Permian nearly all of them die out. The sea lilies of every later sea, and the feather stars of today, descend from the few that came through.',
  },
  ammonoid: {
    name: 'Ammonoid', sub: 'a relative of the squid in a coiled shell', size: 0.1,
    facts: [['Shell', '3 to 10 cm across'], ['Pattern', 'where inner walls meet the shell'], ['Used for', 'telling the age of rocks']],
    text: 'The zigzag lines on the shell mark where the walls between its chambers meet the outside. From era to era the pattern grows more folded, and geologists read the age of a rock from it. The great dying at the end of the Permian leaves only a few of their lines alive.',
  },
  cooperoceras: {
    name: 'Spiny nautilus', sub: 'Cooperoceras texanum · a nautilus with horns', size: 0.12,
    facts: [['Shell', 'about 12 cm across'], ['Spines', 'two rows, long and curved'], ['Found', 'in the Glass Mountains of Texas']],
    text: 'A relative of the nautilus whose loosely coiled shell carries two rows of long, curved spines. Nobody knows what they were for. Perhaps they made it hard to swallow. The fossil shells of this reef have turned to quartz, so acid can free them from the limestone with every spine intact.',
  },
  trilobite: {
    name: 'One of the last trilobites', sub: 'the end of a long line', size: 0.03,
    facts: [['Length', 'about 3 cm'], ['Trilobites have lived for', 'almost 270 million years'], ['Kinds left', 'a few']],
    text: 'Look closely: this small animal is one of the last of its kind. Trilobites crawled over the floor of the Cambrian sea and came through four eras and two great extinctions. Only a few kinds are left, and they will not survive the next one. At the end of the Permian the trilobites are gone for good.',
  },
  reef: {
    name: 'The reef', sub: 'the rim of a deep basin',
    facts: [['Sea', 'an inland sea of Pangaea'], ['Land around it', 'desert'], ['Today', 'mountains in West Texas']],
    text: 'The reef stands at the rim of a basin hundreds of metres deep, in an inland sea of the single great continent, Pangaea. The land around it is desert. Later this sea dries up and fills with salt, and the reefs are buried. Today they stand in the Texan desert again, as mountain walls.',
  },
  sea: {
    name: 'The great dying', sub: 'what is coming',
    facts: [['When', '252 million years ago'], ['Kinds of sea animals lost', 'about nine in ten'], ['Cause', 'most likely huge eruptions in Siberia']],
    text: 'Almost everything around you is about to end. At the close of the Permian, huge eruptions in what is now Siberia heat the climate and rob the seas of oxygen. About nine in ten kinds of sea animals die out. It is the worst catastrophe in the history of life, and the world after it belongs to others.',
  },
};
```

The sentences for the title menu:

> **Permian · 299 to 252 million years ago.** All the continents have joined into one, Pangaea, with deserts at its
> heart. Reefs of sponges ring its inland seas, and a fish with a saw for a jaw hunts before them. You dive
> about 280 million years back, to a reef in what is now Texas. It ends with the worst catastrophe in the
> history of life: about nine in ten kinds of sea animals die out.

## Sources

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 298.9 and 251.902.
- `helicoprion`: National Geographic, "Buzzsaw Jaw Helicoprion Was a Freaky Ratfish"
  (https://www.nationalgeographic.com/science/phenomena/2013/02/26/buzzsaw-jaw-helicoprion-was-a-freaky-ratfish/):
  the tooth spiral fills the lower jaw, there are no upper teeth to speak of, a relative of ratfish, and the
  researcher Leif Tapanila estimates a large one at 20 to 25 feet (6 to 7.6 m). Scientific American
  (https://www.scientificamerican.com/blog/running-ponies/prehistoric-ghost-shark-helicoprions-spiral-toothed-jaw-explained/):
  a century of guesses about the place of the spiral, settled by CT scans; a cartilaginous fish 270 million years
  old. The abstract of Tapanila and others, Biology Letters 2013, quoted at
  https://www.coralmagazine.com/?p=2685: teeth are added continuously and kept. A Wikipedia text on Helicoprion
  (https://cavac.at/cavacopedia/Helicoprion): a tooth spiral from the Skinner Ranch Formation, Lower Permian,
  Dugout Mountain, Brewster County, Texas; the spiral was for grasping and slicing soft prey.
  **Sources disagree on the length:** the Australian Museum (https://australian.museum/learn/animals/fishes/helicoprion)
  gives 10.5 to 20.3 m. The brief follows the researcher who studied the jaws.

**Not checked yet** (from Claude's knowledge, check before the text ships):

- **Place.** The Glass Mountains as the reef rim of a deep basin, the moment "about 280 million years ago" (the age
  of the Skinner Ranch Formation), and which of the exhibits are known from these rocks.
- `sponge`: the chambered sponges and crusts as reef builders; the Guadalupe Mountains as a Permian reef (it is
  younger than this moment, about 265 million years).
- `coneshell` (richthofenids), `productid`: shapes, sizes, the spines as snowshoes, "hundreds of kinds" from these
  rocks.
- `fusulinid`: single cells, sizes, rock-building, extinction at the end of the Permian.
- `bryozoan`, `crinoid`, `ammonoid`: all facts.
- `cooperoceras`: the species, its size and spines, the Glass Mountains, the fossils turned to quartz and freed
  with acid.
- `trilobite`: almost 270 million years (about 521 to 252 million years ago), which kinds lived here.
- `reef`: depth of the basin, the desert, the salt, the mountains of today.
- `sea`: the great dying, 252 million years ago, about nine in ten kinds of sea animals, the Siberian eruptions.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `helicoprion` | 15 |
| `crinoid` | 4 |
| `ammonoid` | 5 from the middle of the group |
| `sponge`, `cooperoceras` | 3 |
| `coneshell`, `productid`, `bryozoan`, `fusulinid` | 2 |
| `trilobite` | 1.5 |
| `reef` | a backdrop, named when nothing else is looked at |
| `sea` | a backdrop, named when the player looks out over the basin |

## Only in this world

- **The saw has to be seen.** The spiral is the whole point of Helicoprion. Let one path pass a viewpoint side on,
  close enough to see the teeth, and let the jaw be a little open.
- **Two scales in one picture.** A 7 m fish in front of a reef whose inhabitants are a few centimetres long. The
  best viewpoint shows both: reef life in front, the hunter passing behind.
- **A warm sky over blue water.** The plane above the world (`above` in the era's `AIR`) carries the dusty colour.
  Under water the light stays white to warm, not orange.
- **The trilobites are few.** Finding one is a small reward. One viewpoint has one in view, the hint names it.

## Later, not in this task

- The same reef 15 million years later at its largest, the Capitan reef.
- The great dying itself: the same place, empty.
