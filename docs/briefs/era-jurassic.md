# Brief: the Jurassic world

The sea of the great reptiles. The player dives about 165 million years back, into a warm, green sea that covers
what is now England. Long-necked plesiosaurs, a hunter with a head of 1.5 m and fish-shaped reptiles with huge eyes
swim here, and among them the largest bony fish that ever lived, 16 m long and harmless.

- **Asked for by:** Mario, 2026-11-16. He decided on 2026-11-15 that the plesiosaur of `today` moves to a world of
  its own time. This is that world.
- **Needs:** `eras.md` (done). `scale.md` for the size picture on the cards; this world does not need the close
  camera.
- **Result:** `jurassic.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## The place

The Jurassic lasted from 201.4 to 143.1 million years ago. The world shows one moment in its middle, about 165
million years ago, and one place: the shallow sea whose mud became the Oxford Clay of eastern England, around
Peterborough. Europe was a group of islands in a warm sea then. For more than a century the clay was dug for
bricks, and the workers collected the bones that came out of it: whole skeletons of marine reptiles, and the pieces
of one giant fish.

## What is special about the Jurassic, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| The seas belong to reptiles | plesiosaurs, the pliosaur, the ichthyosaur, the sea crocodile |
| Two ways to be a plesiosaur: long neck and small head, or short neck and huge head | Muraenosaurus and Cryptoclidus against Liopleurodon |
| Ichthyosaurs in their final, fish-like shape | Ophthalmosaurus |
| A giant that eats plankton: the sea is richer in small life than ever before | Leedsichthys |
| Ammonites and belemnites in masses | the two cards |
| Pangaea breaks up, and shallow seas flood the continents | the menu text |
| On land the giant dinosaurs, in the air the first birds | the menu text |

## Decisions

| Decision | By |
|---|---|
| The plesiosaur of `today` moves here | Mario |
| One real place and time: the sea of the Oxford Clay, about 165 million years ago | Claude |
| The plesiosaur becomes Muraenosaurus, a long-necked plesiosaur of this sea, at about 6 m. In `today` it is 8.6 m | Claude |
| Liopleurodon at 6 m with one of 8 m, after a study of 2026, not at the 25 m of a well-known television film | Claude |
| The list of the ten | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: a warm, sunlit sea, jade green and full of life, over a soft dark floor. Large animals pass in
the middle distance all the time. The friendliest of the great-reptile worlds.

| | World of today | Jurassic |
|---|---|---|
| Water | clear blue | jade green, bright, a little cloudy with plankton |
| How far one sees | far | about 40 m |
| Surface | visible from below, with waves | visible, lively, with sun glitter |
| Sunlight | strong, sharp shafts, bright flecks | strong and slightly green. Clear shafts, soft flecks on the floor |
| Drifting particles | a few | many small ones, pale green, drifting more than sinking |
| Ground | rock and sand, strong colours | soft grey-olive clay with beds of shells, a few low banks of shelly limestone, sunk logs |
| Sound | rumble, surface wash, chimes, whale calls | surface wash, a warm low hum. No whale calls: nothing here sings |

## Sea floor

- **The clay floor.** Gently rolling mud 30 to 45 m under the surface, soft, with the shells of ammonites and
  oysters lying on it.
- **Shell banks.** A few low rises of hard, shelly ground where oysters grow in beds.
- **Driftwood.** Logs from the islands, floating at the surface and sunk on the floor.
- **No wall.** The world runs out into green haze on all sides. The animals need the room.
- **Not here:** kelp, coral reef, wreck, whale tail.

## The ten exhibits

Sizes in metres, one unit is one metre.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `leedsichthys` | the giant fish Leedsichthys | one of 16, one of 9 | a huge fish with a broad head, a very wide mouth, long narrow breast fins and a tall, forked tail almost 3 m high | swims slowly and steadily with its mouth open, on the widest paths of the world | 2 |
| `liopleurodon` | the pliosaur Liopleurodon | 6, one of 8 | a massive body with four large flippers, a short neck, and a head a quarter as long as the whole animal, with long jaws and big teeth | flies through the water with its four flippers, in slow, strong beats | 3 |
| `muraenosaurus` | the long-necked plesiosaur Muraenosaurus | about 6 | the plesiosaur that exists in `today`: barrel body, four flippers, a neck about as long as the body, a small head, a short tail | as in `today` | 3 |
| `cryptoclidus` | the plesiosaur Cryptoclidus | about 4 | like the one above but smaller and stockier, the neck shorter, the head broader, with many thin teeth like a comb | flies with four flippers, in a group | 5 |
| `ophthalmosaurus` | the ichthyosaur Ophthalmosaurus | about 5 | shaped like a tuna or a dolphin: round body, long thin snout, a back fin, a half-moon tail; eyes as large as dinner plates | fast, with beats of the tail, in a small group | 6 |
| `crocodile` | the sea crocodile | about 3 | a slim crocodile without armour, with flippers for legs, a long narrow snout and a tail that ends in a fin | swims with its tail, like a fish | 5 |
| `hybodus` | the shark Hybodus | about 2 | a sturdy shark with two back fins, each with a spine in front, and small horns above the eyes of the males | cruises near the floor | 6 |
| `ammonite` | ammonites | shell 0.05 to 0.15 across | coiled shells with strong ribs and rows of small knobs, head and arms in the opening | swim in short jerks, in groups | 8 groups of about 40 |
| `belemnite` | belemnites | 0.3 to 0.5 | like small squid, with ten arms, large eyes and two fins at the pointed rear end | swim in dense schools, darting | 6 schools of about 200 |
| `gryphaea` | oyster beds | shells 0.05 to 0.1 | thick, curled oyster shells lying in beds, each with a small flat lid | none | on the shell banks |

Order of work, easiest first: oysters and driftwood, the schools (`belemnite`, `ammonite`), then
`muraenosaurus`, which exists, and from it `cryptoclidus` and `liopleurodon`, then `ophthalmosaurus`, `crocodile`,
`hybodus`, and `leedsichthys` last.

What the engine already offers: the plesiosaur of `today` with mesh, shaders, path and zoo entry
(`source/eras/today/sealife.js`, search for `lesio`). Copy it into this era as the start for three exhibits. The
fish school of `today` for the belemnites. The manta of `today` for wide, slow paths.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Jurassic. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  leedsichthys: {
    name: 'Leedsichthys', sub: 'Leedsichthys problematicus · the largest bony fish known', size: 16,
    facts: [['Length', 'up to about 16.5 m'], ['Food', 'plankton, strained from the water'], ['Age of the largest', 'about 38 years']],
    text: 'The largest bony fish that ever lived, and it ate the smallest food in the sea. It swam with its mouth open and strained plankton out of the water, as whale sharks do today. Its skeleton was partly cartilage and fell apart after death, so no whole one exists. Its length was worked out from pieces.',
  },
  liopleurodon: {
    name: 'Liopleurodon', sub: 'Liopleurodon ferox · the top hunter of this sea', size: 8,
    facts: [['Length', 'most 5 to 6 m, the largest about 8 m'], ['Head', 'a quarter of its length'], ['Named after', 'one tooth, found in France']],
    text: 'A plesiosaur with a short neck and a head as long as a tall man. A television film once showed it at 25 m, as long as a blue whale. In 2026 researchers measured every known specimen again: most were 5 to 6 m long, the largest just over 8 m. It still had no enemy in this sea.',
  },
  muraenosaurus: {
    name: 'Muraenosaurus', sub: 'Muraenosaurus leedsii · a long-necked plesiosaur', size: 6,
    facts: [['Length', 'about 6 m'], ['Swims with', 'four flippers'], ['Breathes', 'air, at the surface']],
    text: 'Plesiosaurs are not dinosaurs. They are sea reptiles that rowed through the water with four flippers, something like an underwater flight. With its small head on a long neck this one could reach into a school of fish before its heavy body had come close enough to scare it.',
  },
  cryptoclidus: {
    name: 'Cryptoclidus', sub: 'Cryptoclidus eurymerus · a plesiosaur with a comb of teeth', size: 4,
    facts: [['Length', 'about 4 m'], ['Teeth', 'about 100, long and thin'], ['Young', 'probably born alive, in the water']],
    text: 'Its mouth holds about a hundred thin, pointed teeth that fit between each other when it closes: a trap for small, soft prey such as little fish and squid relatives. It is one of the best known of all plesiosaurs. Whole skeletons came out of the clay pits near Peterborough.',
  },
  ophthalmosaurus: {
    name: 'Ophthalmosaurus', sub: 'Ophthalmosaurus icenicus · the eye lizard', size: 5,
    facts: [['Length', 'about 5 m'], ['Eye', 'more than 20 cm across'], ['Young', 'born alive, tail first']],
    text: 'A reptile in the shape of a tuna, with some of the largest eyes any animal with a backbone has had: wider than a dinner plate. With such eyes it could hunt squid relatives in deep, dark water or at night. A ring of bone inside each eye kept it in shape under pressure.',
  },
  crocodile: {
    name: 'Sea crocodile', sub: 'a relative of the crocodiles, built like a fish', size: 3,
    facts: [['Length', 'about 3 m'], ['Legs', 'flippers'], ['Tail', 'ends in a fin']],
    text: 'A relative of the crocodiles that went all the way: no armour, flippers for legs, a fin on its tail and smooth skin. It could hardly move on land any more. Animals like this lived in the open sea for tens of millions of years. Its fossils were long known under the name Metriorhynchus.',
  },
  hybodus: {
    name: 'Hybodus', sub: 'Hybodus · a shark of the reptile seas', size: 2,
    facts: [['Length', 'about 2 m'], ['Teeth', 'pointed in front, flat behind'], ['Back fins', 'each with a spine']],
    text: 'While reptiles rule this sea, the sharks keep to the second row. This one has two kinds of teeth: sharp ones in front to grab slippery prey, flat ones behind to crush shells. Sharks of this group lived for more than 200 million years and died out near the end of the age of dinosaurs.',
  },
  ammonite: {
    name: 'Ammonites', sub: 'Kosmoceras · relatives of the squid in a coiled shell', size: 0.15,
    facts: [['Shell', '5 to 15 cm across'], ['Inside', 'chambers of gas, like a diving tank'], ['Die out', 'together with the dinosaurs']],
    text: 'The most common fossils of this sea. The animal lives in the last and widest chamber of its shell, and the gas in the others carries it. Ammonites change their ribs and knobs so quickly through time that geologists divide the whole Jurassic into slices named after them.',
  },
  belemnite: {
    name: 'Belemnites', sub: 'squid relatives with a bullet inside', size: 0.5,
    facts: [['Length', '30 to 50 cm'], ['Arms', 'ten, with small hooks'], ['Their fossils', 'called thunderbolts']],
    text: 'They look like squid, but they carry a pointed rod of stone in their rear end. That rod is what remains of them. The clay workers of Peterborough called them thunderbolts, because people once believed they fell from the sky in storms. Schools of them fed nearly every hunter in this sea.',
  },
  gryphaea: {
    name: 'Oysters', sub: 'Gryphaea · the devil\'s toenail', size: 0.1,
    facts: [['Shell', '5 to 10 cm'], ['Shape', 'thick and curled, with a flat lid'], ['Folk name', 'devil\'s toenail']],
    text: 'A thick, curled oyster that lay on the soft mud like a little boat, heavy enough not to be rolled over. Farmers who ploughed them up later called them devil\'s toenails. Oysters, clams and snails now take the places on the sea floor that the lamp shells held before the great dying.',
  },
};
```

The sentences for the title menu:

> **Jurassic · 201 to 143 million years ago.** The great continent breaks apart, and warm, shallow seas spread over
> its edges. Reptiles rule them: plesiosaurs, ichthyosaurs, sea crocodiles. On land the largest dinosaurs walk, and
> the first birds fly. You dive about 165 million years back, into the sea over what is now England, beside the
> largest bony fish that ever lived.

## Sources

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 201.4 and 143.1.
- `leedsichthys`: University of Glasgow, "Prehistoric giant fish could grow more than 16 metres long"
  (https://www.gla.ac.uk/news/archiveofnews/2013/august/headline_286495_en.html): a huge bony, plankton-eating fish
  of the Middle Jurassic, about 165 million years ago; 8 to 9 m after 20 years, 16.5 m after 38 years; a new
  specimen from Peterborough. University of Bristol (https://bristol.ac.uk/news/2013/9614.html): skeletons preserve
  poorly, often only as fragments; the existence of such large plankton feeders points to a major change in the
  plankton of the Jurassic seas. Liston, L'Écho des Falaises 2008 (https://eprints.gla.ac.uk/58380/1/58380.pdf): a
  tail 2.74 m high.
- `liopleurodon`: University of Portsmouth, "Jurassic sea monster was smaller than once thought, but no less
  formidable"
  (https://www.port.ac.uk/news-events-and-blogs/news/jurassic-sea-monster-was-smaller-than-once-thought-but-no-less-formidable)
  and the abstract of Bartlett, Martill and Smith, Journal of Vertebrate Paleontology 2026
  (https://researchportal.port.ac.uk/en/publications/re-evaluating-body-size-in-the-middle-jurassic-pliosaur-iliopleur/):
  37 specimens give 2.46 to 8.09 m; lengths of 5.7 to 25 m had been reported before; the skull is about a quarter of
  the body length; top hunter of the Oxford Clay; first described from a single tooth found near Boulogne.
  Sci.News (https://www.sci.news/paleontology/liopleurodon-ferox-14939.html): the more complete skeletons cluster
  around 4.8 to 6 m.
- **Place** and `belemnite`: the same page of the University of Portsmouth: the brick industry around Peterborough
  exposed the Jurassic clay, and workers were paid to remove fossils, from belemnites, called thunderbolts, to
  bones. Plesiosaur Directory (https://plesiosauria.com/age/middle-jurassic/): Muraenosaurus and Kosmoceras zones in
  the Oxford Clay.

**Not checked yet** (from Claude's knowledge, check before the text ships):

- `leedsichthys`: the shape of the living animal (only pieces are known), the cartilage in its skeleton.
- `liopleurodon`: the television film (a BBC series of 1999 as Claude remembers it); "head as long as a tall man"
  follows from a quarter of 8 m.
- `muraenosaurus`: its length (5 to 8 m in the literature as Claude remembers it), the proportions of the neck.
  The model in `today` was built as a plesiosaur in general, not after this genus: compare it with a skeleton
  drawing and correct the proportions.
- `cryptoclidus`: 4 m, the number of teeth, live birth in plesiosaurs.
- `ophthalmosaurus`: 5 m, the size of the eye, the ring of bone, birth tail first, that it is from this clay.
- `crocodile`: the build; the present name of the Oxford Clay species (Thalattosuchus superciliosus as Claude
  remembers it, long called Metriorhynchus).
- `hybodus`: 2 m, the teeth, the horns of the males, how long its group lived, that it is from this clay.
- `ammonite`, `gryphaea`: sizes and facts; Gryphaea in this clay.
- `belemnite`: sizes, ten arms with hooks, the fins.
- The moment "about 165 million years ago" and Europe as a group of islands.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `leedsichthys` | 25 |
| `liopleurodon`, `muraenosaurus`, `ophthalmosaurus` | 12 |
| `cryptoclidus`, `crocodile`, `hybodus` | 8 |
| `ammonite`, `belemnite` | 6 from the middle of the group |
| `gryphaea` | 2 |

## Only in this world

- **Room for 16 m.** Leedsichthys needs a path with a radius of 40 m or more and open water around it. One
  viewpoint has to show the whole animal from the side, with a school of belemnites or a Cryptoclidus near it for
  scale.
- **The plesiosaur moves.** When Mario has accepted this world, take the plesiosaur out of `today`: its kind, its
  instances, its shaders, its zoo entry and its text. This is the one allowed change to `today`. Viewpoint 1 of
  `today` showed it, so that viewpoint gets a new reference render. Ask Mario before doing it, and do it as a step
  of its own.
- **Four flippers, two rhythms.** Plesiosaurs beat the front and the hind pair out of step. The shader of `today`
  does that already. Keep it for all three.
- **A tail that beats sideways.** Ichthyosaur, sea crocodile and sharks swing the tail from side to side, not up
  and down as whales do.

## Later, not in this task

- A coral reef and lagoon of the late Jurassic, as at Solnhofen.
- Floating logs overgrown with giant sea lilies, as at Holzmaden.
- Liopleurodon hunting.
