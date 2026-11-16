# Brief: the Neogene world

The sea of the giants. The player dives about 9 million years back, into the cold, green, rich water off the coast
of what is now Peru. Whales of many kinds feed here, and two hunters live on them: megalodon, the largest shark
known, and Livyatan, a sperm whale with teeth as long as a forearm. In the shallows a sloth grazes under water.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture on the cards; this world does not need the close
  camera.
- **Result:** `neogene.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## The place

The Neogene lasted from 23.04 to 2.58 million years ago. The world shows one moment in its second half, about 9
million years ago, and one place: the coastal sea whose sediments became the Pisco Formation in the desert of
southern Peru, near Ica. It was a shallow sea close to the shore. Its rocks hold baleen whales, seals, penguins,
crocodiles, sharks, fish and squid, and the skull of Livyatan, which is dated to between 9.9 and 8.9 million years.
Teeth of megalodon are found in the same rocks.

## What is special about the Neogene, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| The world cools; cold, rich water rises along the coasts | the green water full of plankton; the card of the small fish |
| Whales are more varied than ever before or since | the baleen whales |
| The largest hunters the sea has had since the reptiles | megalodon, Livyatan |
| Mammals of every kind try the sea | the seal, the sea sloth |
| Birds that fly under water | the penguins |
| The white shark is on its way | the ancestor of the great white |
| On land: grass, and the first upright apes | the menu text |

## Decisions

| Decision | By |
|---|---|
| One real place and time: the coast of the Pisco Formation, about 9 million years ago | Claude |
| Megalodon at 16 m, the length a study of 2025 gives for the best fossil backbone. The same study allows up to 24 m for the largest | Claude |
| Megalodon is long and slim, as that study concludes, not a giant great white | Claude |
| Livyatan at 15 m, within the 13.5 to 17.5 m of its first description | Claude |
| The list of the ten | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: cold, green, powerful. Strong shafts of light in bottle-green water, dark rock, pale sand, and
very large animals close by. The last stop before today, and the wildest.

| | World of today | Neogene |
|---|---|---|
| Water | clear blue | bottle green, cool, thick with plankton near the surface |
| How far one sees | far | about 30 m |
| Surface | visible from below, with waves | visible, restless, with foam where waves break on rocks |
| Sunlight | strong, sharp shafts, bright flecks | strong, green-gold. Long, sharp shafts, flecks on the sand |
| Drifting particles | a few | many: green and white specks, moving with the swell |
| Ground | rock and sand, strong colours | dark rock with brown seaweed near the shore, grey sand and shell grit further out |
| Sound | rumble, surface wash, chimes, whale calls | surf, deep whale calls, clicks. Louder and livelier than any earlier world |

## Sea floor

- **The rocky shore.** One side of the world: dark rock rising to the surface, with gullies, ledges and brown
  seaweed. Seals and penguins keep here. It is the edge of the world on that side.
- **The bay.** Grey sand 8 to 20 m deep in front of the rocks, with meadows of sea plants where the sloths graze.
- **The open water.** Further out the floor falls to about 45 m. This is where the whales and their hunters swim.
- **A whale fall.** On the deep sand, the skeleton of a baleen whale, with a megalodon tooth beside it.
- **Not here:** coral, mangroves, the ship, the giant whale tail of `today`.

## The ten exhibits

Sizes in metres, one unit is one metre.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `megalodon` | megalodon | 16 | a very large shark with a long, fairly slim body, a blunt snout, a wide mouth with triangular teeth as large as a hand, long breast fins, a half-moon tail | cruises slowly and steadily on the widest path of the world | 1 |
| `livyatan` | the sperm whale Livyatan | 15 | a sperm whale with a shorter, rounder head of about 3 m and big teeth in both jaws, visible when the mouth opens | swims with slow beats of its fluke, comes up to breathe | 1 |
| `whale` | small baleen whales | about 5 | like a small, slim rorqual: a pointed head, baleen in place of teeth, a small back fin | in a loose group near the surface, mouths opening as they feed | 6 |
| `thalassocnus` | the sea sloth Thalassocnus | about 3 | a sloth: long snout, long arms with big claws, shaggy fur, a strong tail | walks along the floor on all fours and holds on with its claws; pulls at the sea plants | 5 |
| `seal` | the seal Acrophoca | about 1.5 | a slim seal with a long neck and a long, pointed head | swims with its hind flippers, twists and turns among the rocks | 8 |
| `gharial` | the sea gharial | about 4 | a crocodile with a very long, thin snout full of needle teeth | lies still near the rocks, swims with its tail | 2 |
| `penguin` | penguins | about 0.8 | much like a Humboldt penguin of today, a little larger | fly under water in fast groups | 4 groups of about 15 |
| `whiteshark` | the ancestor of the great white | about 5 | a great white with a slightly slimmer build | patrols the bay | 2 |
| `fish` | small schooling fish | about 0.15 | silver, like anchovies or sardines | huge, dense schools that shift and flash | 6 schools of about 400 |
| `seaweed` | seaweed and sea plants | 0.5 to 2 | brown fronds on the rocks, green meadows on the sand | sway with the swell | everywhere near the shore |

Order of work, easiest first: rocks, sand and plants, the schools, then `penguin`, `seal`, `gharial`, `whiteshark`,
`whale`, then `thalassocnus` (it walks), then `livyatan` and `megalodon`.

What the engine already offers: the fish school and the kelp of `today`, the walkers of `cambrian` for the sloth,
the plesiosaur's path-following for the whales and sharks. A whale's fluke beats up and down, a shark's tail from
side to side: two different shaders.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Neogene. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  megalodon: {
    name: 'Megalodon', sub: 'Otodus megalodon · the largest shark known', size: 16,
    facts: [['Length', 'about 16 m, the largest perhaps 24 m'], ['Teeth', '16 cm and more'], ['Died out', '3.6 million years ago']],
    text: 'Almost everything known about the largest shark of all time comes from its teeth, which are as large as a hand. Its skeleton was cartilage and is nearly always lost. A study of 2025 worked from a rare fossil backbone and found a long, slim animal: about 16 m for that one, perhaps 24 m for the largest.',
  },
  livyatan: {
    name: 'Livyatan', sub: 'Livyatan melvillei · a sperm whale that hunted whales', size: 15,
    facts: [['Length', '13.5 to 17.5 m'], ['Teeth', 'up to 36 cm long'], ['Named after', 'Herman Melville, author of Moby Dick']],
    text: 'A sperm whale of today eats squid. This one had teeth as long as a forearm in both jaws, the largest biting teeth of any animal known, and it hunted other whales. Its skull, 3 m long, was found in the desert of Peru in 2008. It lived in the same waters as megalodon.',
  },
  whale: {
    name: 'Baleen whale', sub: 'a small whale that strains its food', size: 5,
    facts: [['Length', 'about 5 m'], ['In place of teeth', 'baleen, a curtain of horny plates'], ['Eats', 'the smallest animals in the sea']],
    text: 'The whales of this sea are small beside a blue whale. Most are no longer than a rowing boat, and there are more kinds of them than ever before or since. They gulp water and press it out through the baleen in their mouths. For megalodon and Livyatan they are the main food.',
  },
  thalassocnus: {
    name: 'Sea sloth', sub: 'Thalassocnus · a sloth that learned to dive', size: 3,
    facts: [['Length', 'about 3 m'], ['Food', 'seaweed and sea plants'], ['Relatives', 'the giant ground sloths']],
    text: 'A sloth, under water. Its ancestors lived on a desert coast with little to eat on land, so they waded in to graze. Over four million years the bones of these animals grew denser and heavier from one kind to the next: ballast, so that they could walk on the sea floor.',
  },
  seal: {
    name: 'Seal', sub: 'Acrophoca · a seal with a long neck', size: 1.5,
    facts: [['Length', 'about 1.5 m'], ['Neck and head', 'long and slim'], ['Relatives', 'the seals of the Antarctic']],
    text: 'Seals are bears and dogs gone to sea, in a manner of speaking: their ancestors were land carnivores. This one has a long neck and a long, narrow snout, good for snapping up small fish. For megalodon and Livyatan a seal like this was no more than a snack between whales.',
  },
  gharial: {
    name: 'Sea gharial', sub: 'Piscogavialis · a crocodile of the coast', size: 4,
    facts: [['Length', 'about 4 m'], ['Snout', 'very long and thin'], ['Food', 'fish']],
    text: 'Crocodiles with a snout like a pair of tweezers live in a few rivers of Asia today. This relative lived in the sea, along the coast of South America. The thin snout meets little resistance when it is swept sideways through the water, and its needle teeth hold slippery fish.',
  },
  penguin: {
    name: 'Penguins', sub: 'Spheniscus · relatives of the Humboldt penguin', size: 0.8,
    facts: [['Height', 'about 80 cm'], ['Wings', 'flippers for flying under water'], ['Live here', 'because the water is cold']],
    text: 'Penguins on the coast of Peru, close to the equator: that is possible because the water here is cold. A current from the south runs along this coast and brings fish in great numbers. Penguins still breed on these shores today, and they are close relatives of the ones you see here.',
  },
  whiteshark: {
    name: 'Ancestor of the great white', sub: 'Carcharodon hubbelli · a shark between two kinds', size: 5,
    facts: [['Length', 'about 5 m'], ['Teeth', 'with fine saw edges, just beginning'], ['Found', 'in these rocks, jaws and all']],
    text: 'Megalodon is not the ancestor of the great white shark. This one is: a fossil from these very rocks, kept with its jaws and backbone, stands between an older shark with smooth teeth and the great white with its saw-edged ones. It shared the sea with megalodon and outlived it.',
  },
  fish: {
    name: 'Small fish in schools', sub: 'the reason for everything else', size: 0.15,
    facts: [['Length', 'about 15 cm'], ['Eat', 'plankton'], ['Eaten by', 'almost everyone here']],
    text: 'Wind pushes the surface water away from this coast, and cold water rises from the deep to replace it. It is full of nutrients. Plankton blooms in it, small fish eat the plankton, and everything else eats the fish. The richest fishing grounds of today lie off this same coast.',
  },
  seaweed: {
    name: 'Seaweed', sub: 'the pasture of the sea sloth', size: 2,
    facts: [['Fronds', '50 cm to 2 m'], ['Is it a plant?', 'an alga, without roots'], ['Kelp forests', 'spread in cool seas at this time']],
    text: 'Brown seaweeds need cold, rich water, and the cooling world of the Neogene gives them more and more of it. The giant kelp forests of today, like the one you may have seen at the last stop of this journey, are young: they spread along the cool coasts only in the last few million years.',
  },
};
```

The sentences for the title menu:

> **Neogene · 23 to 2.6 million years ago.** The world cools. Ice grows at the poles, and where cold water rises
> along the coasts, the sea is full of food. Whales are more varied than ever, and so are their hunters: the largest
> shark of all time and a sperm whale with teeth as long as a forearm. You dive about 9 million years back, to the
> coast of Peru. On land, the first apes walk upright.

## Sources

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 23.04 and 2.58.
- `megalodon`: DePaul University, "Megalodon's body size and form uncover why certain aquatic vertebrates can
  achieve gigantism" (https://www.depaul.edu/news/megalodon-study-2025): study led by Kenshu Shimada with 28 other
  experts in Palaeontologia Electronica; megalodon lived nearly worldwide 15 to 3.6 million years ago. Sci.News
  (https://www.sci.news/paleontology/megalodon-biology-13737.html): a slender body, possibly up to about 24.3 m;
  the fossil backbone from Belgium measures 11.1 m, which gives 16.4 m for that animal; teeth at least 16 cm high.
  National Geographic (https://www.nationalgeographic.com/science/article/megalodon-shark-bigger-size-slim-fossil):
  slimmer than a great white; not all researchers agree.
- `livyatan`: Lambert and others, Nature 2010 (copy at https://app.ingemmet.gob.pe/biblioteca/pdf/Paleo-76.pdf):
  skull with teeth from Cerro Colorado, 35 km south-southwest of Ica, Pisco Formation; body length estimated at
  13.5 to 17.5 m. Wikipedia text on Livyatan (https://kiwix.lema.org/wikipedia_en_all_mini_2024-02/A/Livyatan):
  teeth of 36.2 cm, the largest biting teeth of any known animal apart from tusks; it may have competed with
  megalodon. Lambert, Bianucci and de Muizon, 2016 (https://arpi.unipi.it/bitstream/11568/814760/12/Postprint_Macroraptorial%20sperm%20whales.pdf):
  the skull is now dated to 9.9 to 8.9 million years. Darwin's Door (https://www.darwinsdoor.co.uk/?p=1355): a
  near-shore, shallow sea; found in 2008; skull 3 m.
- **Place** and `whale`, `seal`, `penguin`, `gharial`: Earth Archives, "Macropredatory sperm whales"
  (https://eartharchives.org/articles/macropredatory-sperm-whales): the Pisco Formation, near the Pacific coast
  south of Lima, holds baleen whales, seals, penguins, crocodiles and sharks as well as fish and squid: the prey
  available to the hunting sperm whales.

**Not checked yet** (from Claude's knowledge, check before the text ships):

- The moment "about 9 million years ago" follows the date of Livyatan. Check for each of the others whether it is
  known from Pisco rocks of about that age. The Pisco Formation spans several million years.
- `megalodon`: that its teeth occur in the same beds as Livyatan (the first description says so as Claude
  remembers it).
- `livyatan`: that it hunted baleen whales (it is the usual reading, not a find).
- `whale`: 5 m, the small whales of the Pisco Formation (cetotheres), "more kinds than ever".
- `thalassocnus`: 3 m, how it fed and moved, the denser bones over about four million years, the desert coast.
- `seal`: Acrophoca, 1.5 m, the long neck, its relatives; the sentence on the ancestors of seals.
- `gharial`: Piscogavialis, its size, the snout.
- `penguin`: Spheniscus in these rocks, its size; the cold current as the reason.
- `whiteshark`: Carcharodon hubbelli from the Pisco Formation as a link between an older shark and the great
  white; its size.
- `fish`: how the rising water works; today's fishing grounds.
- `seaweed`: the young age of kelp forests. Also check what Thalassocnus grazed: seaweed, seagrass or both.
- Menu text: ice at the poles; the first upright apes in the late Neogene.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `megalodon`, `livyatan` | 25 |
| `whale`, `whiteshark` | 10 |
| `thalassocnus`, `gharial` | 6 |
| `seal` | 5 |
| `penguin`, `fish` | 6 from the middle of the group |
| `seaweed` | 3 |

## Only in this world

- **Two giants, one sea.** Megalodon and Livyatan each have their own wide path. Let the paths come near each
  other once, in view of a viewpoint, with the small whales between them.
- **The whale has to breathe.** Livyatan and the baleen whales come to the surface. A whale that never does looks
  like a fish.
- **Megalodon is not a big great white.** Longer and slimmer in the body, as the study of 2025 concludes. The
  smaller shark of the bay keeps the classic shape, so the difference shows.
- **Nobody attacks the player.** The hunters pass. They do not turn towards the camera.
- **A bridge to the last stop.** The kelp and the whale calls of `today` belong here too. Use them sparingly, so
  that `today` still feels like arriving.

## Later, not in this task

- A hunt: Livyatan or megalodon taking a whale.
- The walrus-faced whale Odobenocetops, a little later in the same rocks.
- The giant seabird Pelagornis above the surface.
