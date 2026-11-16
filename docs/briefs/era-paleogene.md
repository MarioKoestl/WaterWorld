# Brief: the Paleogene world

The first whales. The player dives about 38 million years back, into a warm, shallow bay of the Tethys Sea, where
the Egyptian desert lies today. Small whales give birth here. And a whale 16 m long and as thin as a snake comes to
hunt their young.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture on the cards; this world does not need the close
  camera.
- **Result:** `paleogene.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## The place

The Paleogene lasted from 66.0 to 23.04 million years ago. The world shows one moment in its second half, about 38
million years ago, and one place: the bay whose sands became Wadi Al-Hitan, the Valley of Whales, a World Heritage
site in the Western Desert of Egypt. It was a shallow sea near the coast of the Tethys, the ocean that lay between
Africa and Eurasia. Hundreds of whale skeletons lie in its sandstone, most of two kinds: the giant Basilosaurus and
the small Dorudon, many of them calves.

## What is special about the Paleogene, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| The age of reptiles is over: no mosasaur, no plesiosaur, no ammonite | their absence; the menu text |
| Mammals go to sea: whales that still have hind legs | Basilosaurus, Dorudon |
| A nursery and its hunter | Dorudon calves, Basilosaurus |
| Sea cows, grazing under water | the sea cow in the seagrass |
| Flowering plants reach the sea | seagrass, mangroves |
| A hothouse world that begins to cool | the menu text |
| Giant single cells, in the stone of the pyramids | the nummulites |

## Decisions

| Decision | By |
|---|---|
| One real place and time: the bay of Wadi Al-Hitan, about 38 million years ago | Claude |
| Basilosaurus at 16 m, within the 15 to 18 m of the sources | Claude |
| The list of the ten | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: a tropical bay at noon. Turquoise water, white sand, green meadows of seagrass, the dark roots
of mangroves at the shore. The most familiar world so far, until the shadow of Basilosaurus slides over the sand.

| | World of today | Paleogene |
|---|---|---|
| Water | clear blue | warm turquoise, greenish over the seagrass, a little cloudy near the mangroves |
| How far one sees | far | about 40 m |
| Surface | visible from below, with waves | visible and near: the bay is 4 to 20 m deep. Small waves, strong glitter |
| Sunlight | strong, sharp shafts, bright flecks | very strong, from high above. Bright dancing flecks on the sand |
| Drifting particles | a few | few, more near the shore |
| Ground | rock and sand, strong colours | white and pale gold sand in ripples, seagrass meadows, dark mud between the mangrove roots |
| Sound | rumble, surface wash, chimes, whale calls | surface wash, and for the first time on this journey voices: low calls and clicks of whales |

## Sea floor

- **The bay.** Rippled sand, 4 to 20 m deep, sloping gently away from the shore.
- **Seagrass meadows.** Large green patches on the sand, in the shallower half.
- **The mangrove shore.** One side of the world: arching roots standing in the water, the green canopy seen through
  the surface. It is the edge of the world on that side.
- **A sand bar** and a channel behind it, where the calves keep.
- **The open side.** Away from the shore the water deepens and turns blue. Basilosaurus comes from there.
- **Not here:** kelp, rock walls, coral reef, wrecks.

## The ten exhibits

Sizes in metres, one unit is one metre.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `basilosaurus` | the early whale Basilosaurus | 16 | a whale as thin as an eel: a long head with pointed teeth in front and saw-edged teeth behind, front flippers, a very long body, a small tail fluke, and two tiny hind legs far back | swims with long waves of the whole body, on a wide path from the open side into the bay and out again | 1 |
| `dorudon` | the early whale Dorudon | adults 5, calves about 2.5 | built like a dolphin with a longer snout and a small fluke, with the same tiny hind legs | adults in a loose group, each calf close beside its mother | 6 adults, 4 calves |
| `seacow` | an early sea cow | about 2.5 | a round, heavy body, front flippers, a broad snout turned down, a tail fluke | drifts over the seagrass and grazes, slowly | 4 |
| `sawfish` | sawfish | about 3 | a flat shark-like ray with a long, flat snout edged with teeth | lies on the sand, swims off slowly | 3 |
| `shark` | a large shark | about 5 | a heavy shark with a pointed snout and a half-moon tail | patrols the open side | 2 |
| `pycnodus` | the fish Pycnodus | about 0.6 | a deep, round, flat-sided fish, almost a disc, with a small mouth | in small groups over the seagrass, nibbling | 5 groups of about 10 |
| `turtle` | sea turtles | about 1 | much like a sea turtle of today | row with their front flippers, come up to breathe | 5 |
| `seagrass` | seagrass | blades 0.3 to 0.6 | ribbons of green in dense meadows | sway with the swell | tens of thousands of blades |
| `mangrove` | mangroves | roots 2 to 3 high | arching stilt roots in the water, overgrown with oysters, with trunks and leaves above the surface | leaves move in the wind, seen through the surface | along the shore |
| `nummulite` | nummulites | 0.01 to 0.04 across | flat discs like coins, pale, lying thick in the sand | none | sand patches near the sand bar |

Order of work, easiest first: sand, seagrass, mangroves and nummulites, then `pycnodus`, `turtle`, `sawfish`,
`seacow`, `shark`, then `dorudon`, then `basilosaurus`.

What the engine already offers: the leaves of `today` for seagrass, the fish school, the manta for the turtle and
the sea cow, a long animal that follows its path with its whole body (the plesiosaur) for the two whales. The
whale calls of `today` exist in the soundscape: this is the first era that may use them.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Paleogene. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  basilosaurus: {
    name: 'Basilosaurus', sub: 'Basilosaurus isis · an early whale', size: 16,
    facts: [['Length', '15 to 18 m'], ['Hind legs', 'tiny, of no use for walking'], ['Its name', 'means king lizard, by mistake']],
    text: 'A whale, not a reptile, although the man who named it took its bones for those of a sea serpent. It is as long as a sperm whale and as thin as an eel. One skeleton from this bay still held its last meals: young whales and large fish. It was the top hunter of its sea.',
  },
  dorudon: {
    name: 'Dorudon', sub: 'Dorudon atrox · a small early whale', size: 5,
    facts: [['Length', 'about 5 m'], ['As large as', 'a beluga whale of today'], ['This bay', 'probably its nursery']],
    text: 'The ancestors of whales walked on four legs. This whale lives in the water for good, but it still carries two little hind legs. Many of the skeletons found here are calves, so the mothers probably came to this bay to give birth. Some calves have bite marks on their skulls: Basilosaurus hunted them.',
  },
  seacow: {
    name: 'Sea cow', sub: 'an early relative of manatees and dugongs', size: 2.5,
    facts: [['Length', 'about 2.5 m'], ['Food', 'seagrass'], ['Closest relatives on land', 'elephants']],
    text: 'While whales turn into hunters, another group of mammals goes to sea to graze. Sea cows are the only mammals that live on sea plants alone. Their heavy bones work like a diver\'s lead belt and keep them down on the meadow. Their nearest relatives on land are the elephants.',
  },
  sawfish: {
    name: 'Sawfish', sub: 'a ray with a saw', size: 3,
    facts: [['Length', 'about 3 m'], ['The saw', 'a long snout edged with teeth'], ['Used for', 'finding and striking prey']],
    text: 'A ray, not a shark, with a snout drawn out into a long, flat blade with teeth along both edges. The blade senses the weak electric fields of animals hidden in the sand, and a sideways slash stuns them. Sawfish swim in shallow tropical bays and river mouths to this day.',
  },
  shark: {
    name: 'Great shark', sub: 'an early relative of megalodon', size: 5,
    facts: [['Length', 'about 5 m'], ['Teeth', 'broad triangles with saw edges'], ['Its line leads to', 'megalodon']],
    text: 'Where whales are born, sharks are not far. The teeth of this one were found among the bones of Basilosaurus and its prey. It belongs to the line of the great-toothed sharks, which grows larger from era to era as its prey does. In the next era that line ends with megalodon.',
  },
  pycnodus: {
    name: 'Pycnodus', sub: 'Pycnodus mokattamensis · a fish with teeth like pebbles', size: 0.6,
    facts: [['Length', 'about 60 cm'], ['Teeth', 'round and flat, for crushing'], ['Eaten by', 'Basilosaurus']],
    text: 'A deep, round fish with a mouth full of teeth like small pebbles, made for cracking snails, clams and sea urchins. Its bones were found in the stomach of a Basilosaurus from this bay. Its group goes back to the age of the dinosaurs and dies out during the Paleogene.',
  },
  turtle: {
    name: 'Sea turtle', sub: 'a survivor', size: 1,
    facts: [['Length', 'about 1 m'], ['Breathes', 'air, at the surface'], ['Its kind', 'lived through the asteroid']],
    text: 'The great sea reptiles are gone: mosasaurs, plesiosaurs, all of them died with the dinosaurs. Sea turtles came through. Nobody knows exactly why. Perhaps because they can go for a long time on little food. They swim through this bay as they swam through the chalk sea, and as they still do.',
  },
  seagrass: {
    name: 'Seagrass', sub: 'a flowering plant that went to sea', size: 0.6,
    facts: [['Blades', '30 to 60 cm'], ['Is it seaweed?', 'no: it has roots and flowers'], ['Feeds', 'sea cows and turtles']],
    text: 'This is not seaweed. Seagrass is a flowering plant whose ancestors grew on land, like the ancestors of whales, and it went into the sea not long before them. It has roots and leaves, it flowers under water, and the current carries its pollen. Its meadows are among the richest places in any shallow sea.',
  },
  mangrove: {
    name: 'Mangroves', sub: 'trees that stand in salt water', size: 3,
    facts: [['Roots', '2 to 3 m high'], ['Stand', 'between low and high tide'], ['Shelter', 'young fish']],
    text: 'Trees at the edge of the sea, standing on stilts in salt water that would kill almost any other tree. Their roots break the waves and hold the mud, and between them the young of many fish grow up out of reach of large hunters. Coasts like this one have existed since the age of the dinosaurs.',
  },
  nummulite: {
    name: 'Nummulites', sub: 'single cells the size of coins', size: 0.04,
    facts: [['Width', '1 to 4 cm'], ['Each one', 'a single cell in a shell'], ['Their name', 'means little coins']],
    text: 'Pick one up: a disc of lime like a small coin, with a spiral of chambers inside. All of it was built by one single cell. In the warm seas of this era they lay so thick that they formed whole layers of limestone. The blocks of the pyramids of Giza are cut from such stone.',
  },
};
```

The sentences for the title menu:

> **Paleogene · 66 to 23 million years ago.** A rock from space has ended the age of the great reptiles. Mammals
> take the land, and some of them go back to the sea: within ten million years, animals on four legs become whales.
> You dive about 38 million years back, into a warm bay where the Egyptian desert lies today. It is a nursery of
> whales, and a hunting ground.

## Sources

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 66.0 and 23.04.
- `basilosaurus`, `dorudon`, `pycnodus`, `shark`: Voss and others, PLOS ONE 2019, reported by ScienceDaily
  (https://www.sciencedaily.com/releases/2019/01/190109142626.htm), Sci.News
  (https://www.sci.news/paleontology/basilosaurus-isis-apex-predator-eocene-oceans-06802.html) and Phys.org
  (https://phys.org/news/2019-01-meter-long-ancient-whale-basilosaurus-isis.pdf): a Basilosaurus isis 15 m long from
  Wadi Al-Hitan with stomach contents of young Dorudon atrox and the large fish Pycnodus mokattamensis; bite marks
  on the skulls of the prey; the site was a shallow sea in the late Eocene and probably a calving ground of Dorudon;
  remains of sharks with the skeleton. Live Science (https://www.livescience.com/64455-ancient-whale-ate-other-whales.html):
  Basilosaurus isis lived 34 to 38 million years ago and grew to 15 to 18 m. New York Institute of Technology
  (https://www.nyit.edu/?p=4476): Dorudon atrox about 5 m long, like a beluga, known from Wadi Al-Hitan in the
  ancient Tethys Sea. A report on the same study (https://www.seattlestar.net/2019/01/ancient-killer-whale-snacked-on-fish-sharks-andother-whales/):
  the shark is named Carcharocles sokolowi there.

**Not checked yet** (from Claude's knowledge, check before the text ships):

- **Place.** That sea cows, sawfish, sea turtles, seagrass, mangroves and nummulites are known from Wadi Al-Hitan.
  All are reported from there as Claude remembers it, but no source was read for this brief. Take the genus names
  from the source you find and put them into the `sub` lines (for the sea cow probably Eotheroides or Eosiren).
- `basilosaurus`: the hind legs; the story of its name; the comparison with a sperm whale.
- `dorudon`: the hind legs; the four-legged ancestors of whales; the size of the calves (2.5 m is an estimate).
- `seacow`: 2.5 m, heavy bones, relatives.
- `sawfish`: 3 m and how the saw is used (known from living sawfish).
- `shark`: its size, the shape of its teeth, its place in the line that leads to megalodon.
- `pycnodus`: 60 cm (the study calls it a large fish), the end of its group.
- `turtle`, `seagrass`, `mangrove`: all facts.
- `nummulite`: sizes, the name, the limestone of the pyramids.
- Menu text: "within ten million years" for the change from land animal to whale.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `basilosaurus` | 25 |
| `dorudon`, `shark` | 10 |
| `seacow`, `sawfish`, `mangrove` | 6 |
| `turtle`, `pycnodus` | 5 |
| `seagrass` | 3 |
| `nummulite` | 2 |

## Only in this world

- **16 m in 20 m of water.** Basilosaurus is almost as long as the bay is deep. Its path comes in from the open
  side through the channel and never into water shallower than 8 m. Check it against the floor along its whole
  length.
- **Mother and calf.** A calf keeps its place beside its mother. Give both the same path with a fixed offset.
- **Familiar on purpose.** This world looks like a holiday picture. What is strange are the animals. Do not make
  the water exotic.
- **Voices.** The soundscape may use calls. Keep them low and few: nobody knows what these whales sounded like.

## Later, not in this task

- The hunt: Basilosaurus taking a calf.
- The sea snake of this bay, several metres long.
- The whales with legs that came before these, at a river mouth.
- Giant penguins of the southern seas.
