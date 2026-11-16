# Brief: the Triassic world

Reptiles go back to the sea. The player dives about 242 million years back, into a tropical lagoon on the coast of
the Tethys ocean, where Monte San Giorgio stands today, on the border of Switzerland and Italy. Fish-shaped
reptiles 8 m long swim here, small ones in schools, armoured ones on the floor, and one with a neck of 3 m.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture on the cards; this world does not need the close
  camera.
- **Result:** `triassic.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## The place

The Triassic lasted from 251.902 to 201.4 million years ago. The world shows one moment in its middle, about 242
million years ago, and one place: the lagoon whose mud became the rocks of Monte San Giorgio, a World Heritage site
south of Lake Lugano. It was a tropical lagoon, sheltered and partly cut off from the open sea by a reef. Its deep
water was still and had no oxygen, so what sank to the floor was kept whole, down to unborn young inside their
mothers.

The rocks of Monte San Giorgio span a few million years in several fossil beds. The world puts animals from more
than one of those beds into one lagoon. They are all from this place.

## What is special about the Triassic, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| Life starts again after the great dying, with new players | the whole cast: hardly a group here existed in the Permian sea |
| Reptiles return to the sea, in many different builds | ichthyosaurs, nothosaur, pachypleurosaur, placodont, thalattosaur, Tanystropheus |
| Giving birth in the water | Mixosaurus, the fish Saurichthys |
| The strangest neck in the history of reptiles | Tanystropheus |
| Still one continent, Pangaea, and one great ocean | the menu text |
| On land, later in this era: the first dinosaurs and the first mammals | the menu text |

## Decisions

| Decision | By |
|---|---|
| One real place: the lagoon of Monte San Giorgio, about 242 million years ago, with animals from several of its beds | Claude |
| Besanosaurus is the giant, at 8 m, the largest specimen. Most were 4 to 6 m | Claude |
| The list of the ten | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: a bright emerald lagoon between white banks of lime, lively near the surface, with a dark,
motionless deep in its middle that nothing enters.

| | World of today | Triassic |
|---|---|---|
| Water | clear blue | clear emerald green over the banks, dark green and still in the deep middle |
| How far one sees | far | about 45 m above, 15 m in the deep |
| Surface | visible from below, with waves | visible, calm |
| Sunlight | strong, sharp shafts, bright flecks | strong. Bright flecks on the white banks, shafts that stop at the dark water |
| Drifting particles | a few | few above, a slow rain of fine flakes into the deep |
| Ground | rock and sand, strong colours | white and cream lime banks with green algae crusts, black mud in the deep |
| Sound | rumble, surface wash, chimes, whale calls | gentle surface wash, distant surf on the reef, a low still tone over the deep. No calls |

## Sea floor

- **The banks.** Broad platforms of pale lime, 3 to 12 m deep, with ledges and shallow pools, around most of the
  world.
- **The basin.** In the middle the floor drops to about 45 m: smooth black mud, no life on it, a few skeletons
  lying whole.
- **The reef.** On one side, far out, a bright line of breaking water seen through the surface. The open sea lies
  beyond it and is not part of the world.
- **Not here:** kelp, sea lily meadows, anything from the Permian reef.

## The ten exhibits

Sizes in metres, one unit is one metre.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `besanosaurus` | the ichthyosaur Besanosaurus | 8 | a long, slender body, a small head with a very long, thin snout and tiny teeth, four long narrow flippers, a long tail with a low fin, not the half-moon tail of later ichthyosaurs | swims like an eel, with the whole body, on wide paths over the basin | 2 |
| `mixosaurus` | the small ichthyosaur Mixosaurus | about 1 | like a small dolphin with a long snout, large eyes, a back fin and a low tail fin | fast, in schools | 3 schools of about 12 |
| `tanystropheus` | Tanystropheus | up to 6, of which the neck 3 | a lizard body with a neck as long as body and tail together, stiff as a rod, a small head with long front teeth | hangs still in the water or walks the floor of the banks, neck held straight ahead just above the ground | 4 |
| `ceresiosaurus` | the nothosaur Ceresiosaurus | 3 | a long body, a long neck, a small flat head, a long tail; four limbs that have become paddles with long fingers | swims with its front paddles and tail | 5 |
| `neusticosaurus` | the small reptile Neusticosaurus | 0.2 to 0.5 | a slim little lizard shape with a long neck and tail and a small head | swims with a wave of body and tail, in groups; rests on the banks | 5 groups of about 30 |
| `cyamodus` | the placodont Cyamodus | about 1.3 | broad and flat under a shield of bony plates in two parts, much like a turtle; a short, wide head | paddles slowly over the banks, head down | 6 |
| `askeptosaurus` | the thalattosaur Askeptosaurus | about 3 | a long, slim lizard with a pointed snout and a very long tail, flattened from side to side | swims like an eel | 3 |
| `saurichthys` | the fish Saurichthys | up to 1 | built like a pike: long, thin, with a beak full of teeth and its fins set far back | stands still, then shoots forward | about 30 |
| `ammonoid` | ammonoids | shell 0.05 to 0.15 across | coiled, ribbed shells with head and arms in the opening | swim in short jerks, in groups | 4 groups of about 30 |
| `daonella` | the clam Daonella | 0.03 to 0.08 | thin, flat, half-round shells with fine ribs, lying edge to edge | none | pavements on the slope down to the basin |

Order of work, easiest first: the clams, then the schools (`ammonoid`, `saurichthys`, `mixosaurus`,
`neusticosaurus`), then the single swimmers (`askeptosaurus`, `ceresiosaurus`, `cyamodus`, `tanystropheus`), then
`besanosaurus`.

What the engine already offers: a long animal that follows its path with its whole body (the plesiosaur of
`today`) is the model for five of these. Schools and pavements as in `today` and `cambrian`.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Triassic. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  besanosaurus: {
    name: 'Besanosaurus', sub: 'Besanosaurus leptorhynchus · an early giant ichthyosaur', size: 8,
    facts: [['Length', 'up to about 8 m, most 4 to 6 m'], ['Snout', 'very long and thin, with tiny teeth'], ['Found', 'only at Monte San Giorgio']],
    text: 'Ichthyosaurs are reptiles whose ancestors walked on land. Within a few million years in the sea they looked like fish, and some grew huge. This one is the largest animal of the lagoon. With its long, thin snout and tiny teeth it snapped up small, quick prey such as fish and squid relatives.',
  },
  mixosaurus: {
    name: 'Mixosaurus', sub: 'Mixosaurus cornalianus · a small ichthyosaur', size: 1,
    facts: [['Length', 'about 1 m'], ['Breathes', 'air, at the surface'], ['Young', 'born alive, in the water']],
    text: 'A reptile shaped like a small dolphin, long before there were dolphins. It could not go ashore to lay eggs any more. Fossils from this lagoon show how it solved that: mothers with unborn young inside them. Ichthyosaurs gave birth in the water, as whales do today.',
  },
  tanystropheus: {
    name: 'Tanystropheus', sub: 'Tanystropheus · the reptile with the impossible neck', size: 6,
    facts: [['Length', 'up to 6 m'], ['Neck', 'half of that, on only 13 bones'], ['Food', 'fish and squid relatives']],
    text: 'Its neck is as long as its body and tail together, and it has only 13 bones in it, each one stretched like a rod. So the neck was stiff. When its bones were first found, they were taken for the wing bones of a flying reptile. It probably waited for fish and struck sideways with its small, toothed head.',
  },
  ceresiosaurus: {
    name: 'Ceresiosaurus', sub: 'Ceresiosaurus · a nothosaur', size: 3,
    facts: [['Length', 'about 3 m'], ['Limbs', 'paddles with long fingers'], ['Named after', 'Lake Lugano, in Italian Ceresio']],
    text: 'Halfway between a lizard and a sea monster. Its legs are turning into paddles, but it still has fingers and toes, and it could probably haul itself onto a beach, as seals do. From reptiles like this one the plesiosaurs will arise, the long-necked swimmers of the next two eras.',
  },
  neusticosaurus: {
    name: 'Neusticosaurus', sub: 'Neusticosaurus · the most common reptile of the lagoon', size: 0.5,
    facts: [['Length', '20 to 50 cm'], ['Fossils found', 'many hundreds'], ['Swims with', 'its body and tail']],
    text: 'The little reptile that everything larger eats. Hundreds of skeletons have been found at Monte San Giorgio, from newly hatched young to adults, so its whole life is known: how fast it grew, how old it got, how males and females differed. Few extinct animals are known that well.',
  },
  cyamodus: {
    name: 'Cyamodus', sub: 'Cyamodus · a placodont', size: 1.3,
    facts: [['Length', 'about 1.3 m'], ['Shell', 'bony plates, in two parts'], ['Teeth', 'flat, like paving stones']],
    text: 'It looks like a turtle and is not one: armour was invented twice. Its mouth holds a few large, flat teeth, black and round like pebbles. With them it cracked the shells of clams and snails that it found on the lime banks. The whole group dies out at the end of the Triassic.',
  },
  askeptosaurus: {
    name: 'Askeptosaurus', sub: 'Askeptosaurus italicus · a thalattosaur', size: 3,
    facts: [['Length', 'about 3 m'], ['Tail', 'more than half of that'], ['Its group', 'lived only in the Triassic']],
    text: 'One more kind of reptile that tried the sea: long, slim, with a tail like an eel and feet that still had claws. The Triassic is full of such experiments. Most of them last a few million years and disappear, and only a handful of lines make it into the Jurassic.',
  },
  saurichthys: {
    name: 'Saurichthys', sub: 'Saurichthys · a hunter built like a pike', size: 1,
    facts: [['Length', 'up to 1 m'], ['Hunts', 'from ambush, with a sudden dash'], ['Young', 'born alive']],
    text: 'Long body, long beak, fins set far back: the build of a pike or a needlefish, for a sudden dash from standstill. Most fish lay eggs. This one did not. Fossils from the lagoon show females with unborn young inside, some of the oldest proof of live birth in ray-finned fishes.',
  },
  ammonoid: {
    name: 'Ammonoids', sub: 'the survivors of the great dying', size: 0.15,
    facts: [['Shell', '5 to 15 cm across'], ['Came through the great dying', 'only a few kinds'], ['Used here for', 'telling the age of each bed']],
    text: 'Only a few kinds of ammonoids survived the end of the Permian. From them the seas filled again within a few million years, with hundreds of new kinds. They change so fast that geologists use them as a clock: the layers of Monte San Giorgio are dated by their ammonoids.',
  },
  daonella: {
    name: 'Daonella', sub: 'a clam as thin as paper', size: 0.08,
    facts: [['Width', '3 to 8 cm'], ['Shell', 'thin, with fine ribs'], ['Lies', 'on the mud, by the thousand']],
    text: 'These thin shells cover whole layers of the lagoon mud. How they lived is a puzzle, because the deep floor had no oxygen. Perhaps they lived at its upper edge, where a little air was left, or settled the floor in the short times when fresh water reached it.',
  },
};
```

The sentences for the title menu:

> **Triassic · 252 to 201 million years ago.** The great dying has emptied the seas, and new animals fill them.
> Reptiles go back into the water and become swimmers of many builds. On land, late in this era, the first dinosaurs
> and the first mammals appear. You dive about 242 million years back, into a tropical lagoon where Monte San
> Giorgio stands today, south of the Alps.

## Sources

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 251.902 and 201.4.
- **Place.** UNESCO, World Heritage nomination of Monte San Giorgio with the evaluation by IUCN
  (https://webarchive.unesco.org/web/20160819121735/http://whc.unesco.org/uploads/nominations/1090bis.pdf): life in
  a tropical lagoon, sheltered and partly separated from the open sea by an offshore reef, with reptiles, fish,
  bivalves, ammonites and echinoderms. Klug and others, Swiss Journal of Palaeontology 2024
  (https://doi.org/10.1186/s13358-024-00308-7): Monte San Giorgio as the type of Triassic black shale fossil beds;
  Tanystropheus, Cyamodus and Mixosaurus cornalianus from there; unborn young inside the mother in Mixosaurus and in
  Saurichthys; the clam Daonella.
- `besanosaurus`: Phys.org (https://phys.org/news/2021-05-slender-snouted-besanosaurus-meter-long-marine-snapper.pdf)
  on Bindellini and others, PeerJ 2021: an 8 m ichthyosaur with an extremely long, thin snout and tiny pointed
  teeth. Deposits Magazine, "Triassic beasts and where to find them"
  (https://depositsmag.com/2019/01/25/triassic-beasts-and-where-to-find-them/): skeletons of 4 to 6 m, found only
  at Monte San Giorgio.
- `ceresiosaurus`, `neusticosaurus`: the same article of Deposits Magazine: Ceresiosaurus is a nothosaur 3 m long;
  Neusticosaurus is the most abundant reptile of its beds; Tanystropheus, Ceresiosaurus and Neusticosaurus occur
  together in the Cassina beds.
- `saurichthys`: Museo cantonale di storia naturale, Ticino, "I fossili"
  (https://m4.ti.ch/fileadmin/DT/temi/mcsn/Monte_San_Giorgio/documentazione/I_Fossili.pdf): a predator up to 1 m
  long with a lightning strike.

**Not checked yet** (from Claude's knowledge, check before the text ships):

- The moment "about 242 million years ago", and the oxygen-free deep water.
- `besanosaurus`: its food; the eel-like way of swimming (a paper of 2024 on its skeleton deals with this: see
  https://doaj.org/article/38193ec2fef14758889d879416a776bb).
- `mixosaurus`: 1 m; the back fin.
- `tanystropheus`: 6 m, 13 neck bones, the stiff neck, the first reading as a flying reptile, how it hunted, and
  whether it lived in the water or at its edge (researchers disagree; the table lets it do both).
- `ceresiosaurus`: the name; that it could go ashore; nothosaurs as relatives of the plesiosaurs' ancestors.
- `neusticosaurus`: sizes (the largest species is larger), number of skeletons, what is known of its life.
- `cyamodus`: 1.3 m, the shell in two parts, the teeth, the end of the placodonts.
- `askeptosaurus`: 3 m, the tail, claws, the life span of its group.
- `saurichthys`: "some of the oldest proof".
- `ammonoid`: the recovery after the Permian; dating of the beds by ammonoids.
- `daonella`: sizes and the puzzle of how it lived.
- Menu text: first dinosaurs and mammals late in the Triassic.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `besanosaurus` | 15 |
| `tanystropheus`, `ceresiosaurus`, `askeptosaurus` | 8 |
| `cyamodus`, `saurichthys` | 5 |
| `mixosaurus`, `neusticosaurus`, `ammonoid` | 6 from the middle of the group |
| `daonella` | 2 |

## Only in this world

- **A stiff neck.** Tanystropheus must not bend its neck like a swan. It turns the whole neck from the shoulders,
  a little.
- **Not yet a fish shape.** The ichthyosaurs of the Triassic have long tails with a low fin. The half-moon tail and
  the round body come in the Jurassic. Keep the two worlds apart.
- **The dark middle.** Exposure and haze change with the depth (`ERA.tick()`). No animal path goes below 25 m.
- **One whole skeleton on the black mud**, a Neusticosaurus or a Mixosaurus, at the one viewpoint in the deep: it
  shows why this place is famous.

## Later, not in this task

- The giants of the late Triassic: ichthyosaurs of 20 m and more.
- The shore, with the land reptiles that fell into the lagoon.
- The first modern corals.
