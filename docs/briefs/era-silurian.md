# Brief: the Silurian world

Reefs, sea scorpions and the first green shore. The player dives about 425 million years back, to a warm lagoon
behind a reef in what is now Estonia. Sea scorpions paddle through milky water, small fish in armour grub in the
mud, and at the edge of the lagoon the first plants with stems stand on bare land.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture and for the close camera, which this world asks for.
- **Result:** `silurian.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## The place

The Silurian lasted from 443.1 to 419.62 million years ago. The world shows one moment late in it, about 425 million
years ago, and one place: a lagoon of the Palaeobaltic Sea in the tropics, on what is now the island of Saaremaa in
Estonia. A belt of reefs lay between the lagoon and the open sea. The lagoon was quiet, shallow and warm. Its lime
mud kept sea scorpions and whole shoals of small fish.

## What is special about the Silurian, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| Life recovers after the great dying at the end of the Ordovician | the full reef; the menu text |
| The first great reefs built by corals and sponges | the reef belt: chain corals, honeycomb corals, stromatoporoids |
| The great age of the sea scorpions | Eurypterus in numbers, the large Erettopterus |
| Fish in armour, most still without jaws | Tremataspis, the shoals of Phlebolepis |
| Jaws appear: the first fish that can bite | the menu text; the card of Tremataspis |
| Plants with stems take the land, and the first animals follow | the shore |

## Decisions

| Decision | By |
|---|---|
| One real place and time: the lagoon and reef of Saaremaa, about 425 million years ago | Claude |
| The shore with its plants is an exhibit, seen from the water | Claude |
| A low, golden sun, so that this lagoon does not look like the midday sea of the Ordovician | Claude |
| The list of the ten | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: late afternoon in a still, milky lagoon. Low golden light, long soft shafts, pale mud. Beyond
the reef the water turns deep blue.

| | World of today | Silurian |
|---|---|---|
| Water | clear blue | in the lagoon milky turquoise, beyond the reef clear and blue |
| How far one sees | far | about 20 m in the lagoon, 50 m outside |
| Surface | visible from below, with waves | very near in the lagoon, which is 1 to 6 m deep. Almost flat |
| Sunlight | strong, sharp shafts, bright flecks | low and golden, from one side. Long slanting shafts, long shadows |
| Drifting particles | a few | fine lime mud in the lagoon, stirred up where something walks |
| Ground | rock and sand, strong colours | white and cream lime mud in the lagoon, the reef in ochre, rust and grey-green |
| Sound | rumble, surface wash, chimes, whale calls | quiet lapping, distant surf on the reef. No calls |

## Sea floor

- **The lagoon.** Half of the world: a flat floor of pale mud, 1 to 6 m deep, with shallow hollows.
- **The reef belt.** A ridge of stone that rises from the lagoon floor to just under the surface, cut by a few
  channels. It is built by the reef exhibits below.
- **The fore reef.** Outside the ridge the floor slopes down to about 25 m, with sea lilies and blocks of reef
  stone, and runs out into blue haze.
- **The shore.** On the far side of the lagoon the floor rises out of the water: low, bare, pale rock and mud
  flats. It is the edge of the world on that side.
- **Not here:** seaweed forests, large fish, anything that looks like a modern reef fish.

## The ten exhibits

Sizes in metres, one unit is one metre. Most animals of the lagoon are small: this world asks for the close camera
of `scale.md`.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `eurypterus` | the sea scorpion Eurypterus | 0.15 to 0.25 | a flat head shield with two eyes, a body of twelve segments that narrows to a tail spike, walking legs, one pair of legs widened into paddles | rows with the paddles, walks on the mud | about 80, in the lagoon |
| `erettopterus` | the large sea scorpion Erettopterus | about 0.9 | larger and slimmer, with two long arms ending in toothed claws, big eyes at the front corners of the head, a tail that ends in a flat two-lobed fin | swims in the open water of the channels | 4 |
| `tremataspis` | the armoured fish Tremataspis | about 0.1, of which the shield 0.035 | a smooth, oval shield of bone over the head, two eyes close together on top, a scaly tail, no jaws, no paired fins | wriggles along the floor, rests on the mud | about 50 |
| `phlebolepis` | the scale fish Phlebolepis | about 0.07 | a small flat-headed fish, covered all over in tiny scales, with a forked tail | swims in dense shoals | 3 shoals of about 200 |
| `halysites` | chain coral | colonies 0.2 to 0.5 | upright tubes joined side by side into walls; from above a net of chains | small polyps | hundreds, on the reef |
| `favosites` | honeycomb coral | 0.1 to 0.5 | domes and lumps whose surface is a honeycomb | small polyps | hundreds, on the reef |
| `stromatoporoid` | stromatoporoids | 0.3 to 2 across | layered domes and thick crusts with a knobbly surface | none | the body of the reef |
| `crinoid` | sea lilies | 0.3 to 0.8 high | a stalk with a crown of feathery arms | sway | meadows on the fore reef |
| `orthocone` | straight-shelled cephalopods | 0.2 to 0.6 | a straight cone with a head and arms at the wide end | swim in the channels and outside | about 20 |
| `shore` | the first green shore | plants a few centimetres high, no `size` | seen through the surface and at the waterline: thin, leafless, forked stems with a small knob at each tip, in low patches on bare ground | sway in the wind | the land side of the lagoon, as a backdrop |

Order of work, easiest first: the reef builders, the sea lilies, the shore, then the swimmers (`phlebolepis`,
`orthocone`, `erettopterus`), then what walks and wriggles (`eurypterus`, `tremataspis`).

What the engine already offers: scattering in masses, swarms, walkers and standing kinds of `cambrian`. New: land
seen from the water. The plane above the world (`above` in the era's `AIR`) shows the sky; the plants stand where
the floor comes out of the water.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Silurian. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  eurypterus: {
    name: 'Sea scorpion', sub: 'Eurypterus tetragonophthalmus · the best known of all', size: 0.25,
    facts: [['Length', '15 to 25 cm'], ['Swims with', 'two legs shaped like paddles'], ['Share of all sea scorpion fossils', 'more than 95 %']],
    text: 'Not a scorpion, but a relative of scorpions, spiders and horseshoe crabs. It walked on the mud and rowed through the water with a pair of legs shaped like paddles. No sea scorpion is known better: more than 95 of every 100 sea scorpion fossils ever found belong to this one genus.',
  },
  erettopterus: {
    name: 'Giant sea scorpion', sub: 'Erettopterus · a hunter with claws', size: 0.9,
    facts: [['Length', 'about 90 cm'], ['Catches prey with', 'two long clawed arms'], ['Largest relatives', 'more than 2 m']],
    text: 'The large hunter of this lagoon. Its relatives are the largest arthropods that ever lived: some of them grew longer than a man. It caught its prey with a pair of long arms that end in toothed claws, and steered with a flat tail. Its large eyes look forward.',
  },
  tremataspis: {
    name: 'Tremataspis', sub: 'Tremataspis · a fish in a shield of bone', size: 0.1,
    facts: [['Length', 'about 10 cm'], ['Head shield', 'about 3.5 cm'], ['Jaws', 'none']],
    text: 'A fish with its head in a box of bone, eyes on top, mouth below, and no jaws: it could only suck up what lay on the mud. Elsewhere in this sea, its cousins are trying something new. In the Silurian the first fish with jaws appear, and with them the first bite.',
  },
  phlebolepis: {
    name: 'Phlebolepis', sub: 'Phlebolepis elegans · a small fish without jaws', size: 0.07,
    facts: [['Length', 'about 7 cm'], ['Skin', 'tiny scales all over'], ['Lives', 'in shoals']],
    text: 'Fish this old are usually found as loose scales. Here a whole shoal was found together. It was caught at low tide in a hollow of this lagoon, where the warm, still water ran out of oxygen. Fine lime mud covered the fish before they fell apart.',
  },
  halysites: {
    name: 'Chain coral', sub: 'Halysites · a tabulate coral', size: 0.5,
    facts: [['Colony', '20 to 50 cm'], ['Seen from above', 'like a chain'], ['Its group', 'died out 252 million years ago']],
    text: 'Each link of the chain is a tube, and in each tube sat one small polyp. Together with honeycomb corals and stromatoporoids they build the first great reefs made by animals. None of the three will see the age of the dinosaurs: their groups die out before it.',
  },
  favosites: {
    name: 'Honeycomb coral', sub: 'Favosites · a tabulate coral', size: 0.5,
    facts: [['Colony', '10 to 50 cm'], ['Each cell', 'a few millimetres wide'], ['Lived', 'for more than 150 million years']],
    text: 'Tubes with six sides, packed without a gap: bees build like this, and so did this coral, long before there were bees. Every cell held one polyp. Small holes in the walls joined each to its neighbours, so the whole colony could share what one of them caught.',
  },
  stromatoporoid: {
    name: 'Stromatoporoids', sub: 'sponges that build stone', size: 2,
    facts: [['Width', '30 cm to 2 m'], ['What they are', 'sponges with a stony skeleton'], ['Role', 'the main builders of this reef']],
    text: 'The knobbly domes that make up most of this reef are sponges. Unlike the soft sponges you know, they laid down a skeleton of stone, layer on layer, as stromatolites did before them. For 100 million years they were the most important reef builders of the seas.',
  },
  crinoid: {
    name: 'Sea lilies', sub: 'animals, not flowers', size: 0.8,
    facts: [['Height', '30 to 80 cm'], ['Relatives', 'starfish and sea urchins'], ['Stalk', 'a stack of small stone discs']],
    text: 'On the seaward side of the reef the current brings food, and the sea lilies stand in it with open arms. When one dies, its stalk falls apart into hundreds of small discs. In many places they piled up into thick beds of rock made of almost nothing else.',
  },
  orthocone: {
    name: 'Straight-shelled cephalopods', sub: 'relatives of squid and nautilus', size: 0.6,
    facts: [['Shell', '20 to 60 cm'], ['Moved by', 'squirting water'], ['Inside the shell', 'chambers of gas']],
    text: 'The giants of the Ordovician are gone, but their smaller relatives still hunt in every sea. The shell is a row of gas chambers that carries the animal. In polished slabs of Silurian limestone, cut for floors and stairs, their shells show as long, pale cones.',
  },
  shore: {
    name: 'The green shore', sub: 'the first plants with stems',
    facts: [['Height', 'a few centimetres'], ['Leaves, roots, flowers', 'none'], ['With them', 'the first animals on land']],
    text: 'Look up through the surface: there is green at the edge of the water. The first plants with stiff stems and with pipes for water inside have come ashore. They are thin forked stalks a few centimetres high, without leaves or roots. Small relatives of millipedes and spiders follow them onto land.',
  },
};
```

The sentences for the title menu:

> **Silurian · 443 to 420 million years ago.** After an ice age and a great dying, the seas fill again. Corals and
> sponges build the first great reefs. Sea scorpions hunt in the lagoons, some of them longer than a man. Fish get
> jaws. And at the edge of the water the first plants with stems turn the shore green. You dive about 425 million
> years back, to a lagoon in what is now Estonia.

## Sources

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 443.1 and 419.62.
- **Place** and `phlebolepis`: Märss, Perens and Klaos, Proceedings of the Estonian Academy of Sciences, Geology
  2003 (https://kirj.ee/wp-content/plugins/kirj/pub/geol-3-2003-239-265_20211023231351.pdf): the fish bed of
  Himmiste on Saaremaa formed in a lagoon of the Palaeobaltic Sea in the tropics, in the late Silurian (Ludlow),
  behind the reef belt towards the land; a shoal of the thelodont Phlebolepis elegans died in a shallow hollow at
  low tide, probably from lack of oxygen in warm shallow water, and was covered quickly by mud.
- `eurypterus`: Wikipedia, "Eurypterus" (https://en.Wikipedia.com/wiki/Eurypterus): lived in the Silurian from
  about 432 to 418 million years ago, the best studied sea scorpion, probably more than 95 % of all known sea
  scorpion specimens; the species from Saaremaa is E. tetragonophthalmus. University of Tartu collections
  (https://geoloogia.info/en/collection/10125): Eurypterus from Saaremaa.
- `tremataspis`: Luha, "Uusi ostrakoderme Saaremaa Eurypterus-lademest", University of Tartu
  (https://dspace.ut.ee/bitstreams/abfe06c8-45fb-4370-b014-6054c8780aa5/download): Tremataspis from the Eurypterus
  beds of Saaremaa, shield of Tr. schmidti 30 to 35 mm long.

**Not checked yet** (from Claude's knowledge, check before the text ships):

- The moment "about 425 million years ago". The sea scorpion beds and the fish bed of Saaremaa are not exactly the
  same age; the world puts them into one lagoon.
- Whether chain corals, honeycomb corals, stromatoporoids, sea lilies and straight-shelled cephalopods are known
  from the Silurian reefs of Saaremaa and neighbouring Gotland. They are typical of Silurian reefs in general.
- `eurypterus`: 15 to 25 cm; paddles; relatives.
- `erettopterus`: that a species of it (E. osiliensis) is known from Saaremaa, its length, the shape of its tail,
  and the size of its largest relatives (more than 2 m).
- `tremataspis`: whole length about 10 cm; first jawed fish in the Silurian.
- `phlebolepis`: 7 cm, scales, forked tail.
- `halysites`, `favosites`, `stromatoporoid`, `crinoid`, `orthocone`: all sizes and facts, the extinction dates,
  "100 million years", the limestone slabs.
- `shore`: Cooksonia as the plant meant here, its height, the first land animals.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `erettopterus` | 6 |
| `stromatoporoid`, `crinoid`, `orthocone` | 4 |
| `eurypterus`, `halysites`, `favosites` | 3 |
| `phlebolepis` | 4 from the middle of the shoal |
| `tremataspis` | 2 |
| `shore` | a backdrop, 15 from the waterline |

## Only in this world

- **Two waters.** Milky in the lagoon, clear outside. The engine of `today` already blends two kinds of water (the
  grotto): use that for the change across the reef.
- **Very shallow.** In 1 to 6 m of water the surface fills half the picture. Its look from below matters more here
  than anywhere else.
- **A low sun.** Check the shadows on the reef and that the shafts of light do not flicker when the camera turns.
- **The shore is the discovery.** One viewpoint lies in a metre of water and looks at the land.

## Later, not in this task

- The first fish with jaws as exhibits of their own.
- A sea scorpion that walks out of the water.
- The open sea beyond the reef, with graptolites.
