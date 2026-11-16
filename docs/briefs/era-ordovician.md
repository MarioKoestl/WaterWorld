# Brief: the Ordovician world

The sea fills up. The player dives about 450 million years back, to a warm, shallow sea that covers most of North
America. The floor is crowded with shells, sea lilies and stony thickets, and above it hunts the largest animal the
Earth has seen so far: a squid relative in a straight shell almost 6 m long.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture on the cards; this world does not need the close
  camera, but its small exhibits gain from it.
- **Result:** `ordovician.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## The place

The Ordovician lasted from 486.85 to 443.1 million years ago. The world shows one moment late in it, about 450
million years ago, and one place: the shallow tropical sea over what is now Ohio, Kentucky and Indiana, around
Cincinnati. Its lime mud and shell beds are among the richest fossil grounds of this age. Storms stirred the floor
again and again and buried what lived on it.

One exhibit comes from the same sea a little further west and a few million years earlier: the armoured fish
Astraspis, from Colorado. The brief bends the rule of one place here, because the first fish with bone belong to
the story of this era.

## What is special about the Ordovician, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| Life in the sea multiplies: three times as many kinds as in the Cambrian | the crowded floor; the menu text |
| The sea stands higher than ever: most continents are flooded | the wide shallow floor without a shore |
| New builders: moss animals, corals, sea lilies | the thickets, the horn corals, the meadows |
| Giant hunters in straight shells | Endoceras |
| The first sea scorpions | Megalograptus |
| The first fish with armour of bone, still without jaws | Astraspis |
| The land is still almost bare: the first tiny plants reach the shore | the menu text |
| It ends in ice and in the second largest mass extinction | the menu text; the trilobite card |

## Decisions

| Decision | By |
|---|---|
| One real sea and time: the Cincinnati region, about 450 million years ago | Claude |
| Astraspis is added from Colorado | Claude |
| The giant is Endoceras at 5.7 m, the largest estimate that the sources support, not the 9 m of older books | Claude |
| The list of the ten | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: a bright, warm, busy sea floor in clear aquamarine water. After the dusk of the Cambrian and
the stillness before it, this is the first world that feels full.

| | World of today | Ordovician |
|---|---|---|
| Water | clear blue | clear aquamarine, greener towards the distance |
| How far one sees | far | about 60 m |
| Surface | visible from below, with waves | visible, 10 to 25 m above the floor |
| Sunlight | strong, sharp shafts, bright flecks | strong, a little softer. Flecks on the pale floor |
| Drifting particles | a few | a few, and shell grit lifted near the floor |
| Ground | rock and sand, strong colours | pale lime mud and pavements of shells, low ledges of grey limestone, no high rock |
| Sound | rumble, surface wash, chimes, whale calls | surface wash, soft clicks and crackle from the floor. No calls |

## Sea floor

- **The shelf.** A wide, gently rolling floor of pale mud, 10 to 25 m deep, with low limestone ledges a metre or two
  high. No wall, no canyon: the view ends in the haze.
- **Shell pavements.** Wide patches where lamp shells lie edge to edge.
- **Meadows.** Stands of sea lilies on the ledges and rises.
- **Thickets.** Moss animals and horn corals on every hard patch.
- **Storm beds.** A few fresh sheets of broken shells, swept together by the last storm.
- **Not here:** fish in schools, seaweed forests, anything with jaws.

## The ten exhibits

Sizes in metres, one unit is one metre.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `endoceras` | Endoceras, the giant | shell 5.7 long, 0.3 thick at the opening | a long straight cone with faint bands; at the wide end a head with eyes and a ring of arms | glides slowly just above the floor, shell level, head first or backwards; the arms reach down | 2 |
| `orthocones` | small straight-shelled relatives | 0.15 to 0.4 | the same in small, with coloured stripes on the shell | swim in loose groups, in short jerks | 5 groups of about 30 |
| `isotelus` | the trilobite Isotelus | up to 0.4 | a broad smooth oval in three parts, head and tail like shovels, small eyes | walks, ploughs through the mud; some lie half dug in | about 60 |
| `megalograptus` | the sea scorpion Megalograptus | about 1 | a scorpion shape: head shield, two long spiny grasping arms, paddles, a tail ending in pincers | walks on the floor, swims in short bursts | about 6 |
| `crinoid` | sea lilies | 0.3 to 1 high | a stalk of stacked discs, a cup on top with feathery arms | sway; the arms bend into a bowl against the current | thousands, in meadows |
| `horncoral` | horn corals | 0.05 to 0.12 | a curved horn of stone lying on the mud, a ring of tentacles in its opening | the tentacles move | hundreds |
| `bryozoan` | moss animals | twigs 0.05 to 0.15, mounds up to 0.3 | stony twigs, branching, and low domes, covered with pinprick pores | none | thickets on every ledge |
| `brachiopod` | lamp shells | 0.02 to 0.05 | ribbed shells of two unequal halves, a little open | none | tens of thousands, in pavements |
| `graptolite` | graptolites | 0.02 to 0.1 | thin dark blades with a saw edge, hanging in the water | drift | swarms in the open water |
| `astraspis` | the armoured fish Astraspis | about 0.2 | like a large tadpole: head and chest in a shield of small bony plates, a row of gill openings on each side, a scaly tail, no other fins, no jaws | swims with its whole tail, a little clumsily, near the floor | 3 groups of about 15 |

Order of work, easiest first: what stands or lies (`brachiopod`, `bryozoan`, `horncoral`, `crinoid`), then the
swimmers (`graptolite`, `orthocones`, `astraspis`, `endoceras`), then the walkers (`isotelus`, `megalograptus`).

What the engine already offers: scattering in masses and standing kinds that sway, the swarms and walkers of
`cambrian`, a long animal that follows its path with its whole body (the plesiosaur of `today`). Endoceras is a
stiff body with a soft head: a rigid cone on a path, arms that move.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Ordovician. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  endoceras: {
    name: 'Endoceras', sub: 'Endoceras giganteum · giant relative of squid and nautilus', size: 5.7,
    facts: [['Shell', 'up to about 5.7 m long'], ['Longest piece found', '3 m'], ['Hunted', 'probably close to the sea floor']],
    text: 'The largest animal of its time, and perhaps the first giant of all: a relative of the squid in a straight shell longer than a car. The longest piece ever found measures 3 m, and it is only part of a shell. Its owner probably hunted trilobites and other animals of the sea floor.',
  },
  orthocones: {
    name: 'Straight-shelled cephalopods', sub: 'small relatives of the giant', size: 0.4,
    facts: [['Shell', '15 to 40 cm long'], ['Moved by', 'squirting water'], ['Living relative', 'the nautilus']],
    text: 'The shell is a row of chambers filled with gas. They carry the animal like a diving tank, and it lives only in the last and widest one. To move, it squirts water out of a tube. Squid still swim like that. The nautilus is the last animal that still carries such a shell.',
  },
  isotelus: {
    name: 'Trilobite', sub: 'Isotelus · a giant among trilobites', size: 0.4,
    facts: [['Length', 'up to about 40 cm'], ['Largest relative', '72 cm, found in Canada'], ['Shell', 'shed again and again as it grew']],
    text: 'Most trilobites would fit in your hand. This one is as long as your forearm, and a relative from the same time reached 72 cm, the largest trilobite ever found. It ploughed through the mud for food. The ice age at the end of the Ordovician wiped out most of its kind.',
  },
  megalograptus: {
    name: 'Sea scorpion', sub: 'Megalograptus · an early sea scorpion', size: 1,
    facts: [['Length', 'about 1 m'], ['Catches prey with', 'two long spiny arms'], ['Tail', 'ends in pincers']],
    text: 'Sea scorpions are new in this sea. They are not true scorpions, but relatives of them, and of spiders and horseshoe crabs. This one swept the floor with two long, spiny arms, like a rake. In the next era its relatives will become the largest arthropods that ever lived.',
  },
  crinoid: {
    name: 'Sea lilies', sub: 'animals, not flowers', size: 1,
    facts: [['Height', '30 cm to 1 m'], ['Relatives', 'starfish and sea urchins'], ['Food', 'caught from the passing water']],
    text: 'A stalk, a cup and a crown of feathery arms: it looks like a flower and is a relative of the starfish. The arms spread into a bowl against the current and pass food down to the mouth in the middle. Whole meadows of them stood in this sea. A few hundred kinds still live in the oceans today.',
  },
  horncoral: {
    name: 'Horn coral', sub: 'a single polyp in a horn of stone', size: 0.12,
    facts: [['Length', '5 to 12 cm'], ['Lives', 'alone, not in a colony'], ['Its group', 'died out 252 million years ago']],
    text: 'One animal like a small sea anemone sits in the open end of each horn and builds it longer as it grows. The fine lines on the outside are growth lines, something like the rings of a tree. These corals are not the ancestors of the corals of today: their whole group has died out.',
  },
  bryozoan: {
    name: 'Moss animals', sub: 'colonies of thousands', size: 0.15,
    facts: [['Twigs', '5 to 15 cm'], ['Each animal', 'smaller than a millimetre'], ['First appear', 'in the Ordovician']],
    text: 'Every pinprick in these stony twigs is the home of one tiny animal with a crown of tentacles. Thousands of them build a colony together. Moss animals are the one large group of animals that does not go back to the Cambrian: they appear here, in the Ordovician, and are still common.',
  },
  brachiopod: {
    name: 'Lamp shells', sub: 'brachiopods · not clams', size: 0.05,
    facts: [['Width', '2 to 5 cm'], ['Halves of the shell', 'top and bottom, not left and right'], ['Today', 'rare']],
    text: 'They look like clams and are not related to them. A clam has a left and a right shell, a lamp shell an upper and a lower one, and inside it a coiled, feathery arm that filters the water. In this sea they pave the floor. Today clams have taken their place almost everywhere.',
  },
  graptolite: {
    name: 'Graptolites', sub: 'drifting colonies', size: 0.1,
    facts: [['Length', '2 to 10 cm'], ['Each tooth of the saw', 'the home of one tiny animal'], ['Used for', 'telling the age of rocks']],
    text: 'Each blade is a colony: every tooth of the saw is a little cup with one animal in it. They drifted through all the oceans and changed their shapes quickly over time. So a geologist who finds one can tell how old the rock is, almost anywhere in the world.',
  },
  astraspis: {
    name: 'Astraspis', sub: 'Astraspis desiderata · an early fish in armour', size: 0.2,
    facts: [['Length', 'about 20 cm'], ['Armour', 'small plates of bone'], ['Jaws', 'none']],
    text: 'One of the first animals with bone. It carries it on the outside, as a shield of small plates over head and chest. It has no jaws and no fins except its tail, so it could neither bite nor steer well. All the same, this is your side of the family: an early fish.',
  },
};
```

The sentences for the title menu:

> **Ordovician · 487 to 443 million years ago.** The sea rises higher than ever before and covers most of the
> continents. Life in it multiplies: sea lilies, corals, moss animals, and hunters in shells as long as a car.
> The land is still almost bare. You dive about 450 million years back, to the sea over North America. This world
> ends in an ice age that wipes out most kinds of animals.

## Sources

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 486.85 and 443.1.
- `endoceras`: Wikipedia, "Endoceras" (https://en.wikipedia.org/wiki/Endoceras): a specimen of Endoceras giganteum
  in the Museum of Comparative Zoology measures 3 m as preserved, a 2015 estimate puts the complete shell at about
  5.73 m, which would make it the longest cephalopod in the fossil record; a report of a 9.1 m shell was never
  confirmed and is doubted. Wikipedia, "Endocerida" (https://en.wikipedia.org/wiki/Endocerida): endocerids may have
  been the top hunters of the Ordovician, probably living close to the sea floor and eating trilobites, molluscs
  and lamp shells; their way of life is debated. Endoceras is known from North America and Europe.

**Not checked yet** (from Claude's knowledge, check before the text ships):

- **Place.** The Cincinnati region as a shallow tropical sea about 450 million years ago, and which of the ten are
  known from its rocks. Check Endoceras there in particular: it is known from North America, but Claude has not
  seen it listed for this region.
- Three times as many kinds as in the Cambrian; the highest sea level; the ice age and the second largest mass
  extinction at the end; the first land plants.
- `orthocones`: sizes, gas chambers, the nautilus as the last with such a shell.
- `isotelus`: 40 cm for the species of this region; the 72 cm of Isotelus rex from Manitoba, Canada.
- `megalograptus`: 1 m, the arms, the tail, that it is from Ohio.
- `crinoid`: heights, relatives, the number of living kinds.
- `horncoral`: sizes, growth lines, extinction 252 million years ago.
- `bryozoan`: first appearance in the Ordovician.
- `brachiopod`, `graptolite`: all facts.
- `astraspis`: 20 cm, the armour, from Colorado, its age.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `endoceras` | 15 |
| `megalograptus`, `crinoid` | 5 |
| `orthocones`, `astraspis`, `graptolite` | 6 from the middle of the group |
| `isotelus` | 3 |
| `horncoral`, `bryozoan`, `brachiopod` | 2 |

## Only in this world

- **The giant needs a stage.** One viewpoint looks along the floor so that an Endoceras passes through the picture
  from side to side, with sea lilies in front of it for scale.
- **Crowded, not cluttered.** The floor is full, but the kinds keep to their patches: pavements, meadows, thickets.
  Leave bare mud between them.
- **A stiff shell.** Endoceras and its small relatives do not bend. Turn them slowly, on wide curves.

## Later, not in this task

- The ice age at the end: the same floor, fallen dry or dark and cold.
- More of this sea: starfish, sea snails, the trilobite Flexicalymene rolled into a ball.
