# Brief: the Devonian world

The age of fishes. The player dives about 360 million years back, into the open water of a sea over what is now
Ohio. Fish in armour hunt here, among them Dunkleosteus with jaws like shears, and beside them the first sharks.
Far below lies a black floor without air, where nothing lives.

- **Asked for by:** Mario, 2026-11-16.
- **Needs:** `eras.md` (done). `scale.md` for the size picture on the cards; this world does not need the close
  camera.
- **Result:** `devonian.html`, chosen from the timeline in the title menu.

Read `CLAUDE.md`, then `era-common.md`: stages, rules, acceptance criteria, verification and how to treat facts are
there. This brief says what this world is.

## The place

The Devonian lasted from 419.62 to 358.86 million years ago. The world shows one moment at its very end, about 360
million years ago, and one place: the sea whose mud became the Cleveland Shale of Ohio. Its upper water was full of
life. Its deep water had no oxygen, so nothing lived on the floor and nothing disturbed what sank into the black
mud. That is why this shale keeps the best fossils of Dunkleosteus and some of the best of early sharks.

## What is special about the Devonian, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| The age of fishes: fish of every size and build | all the swimmers |
| Jaws and armour: the first large hunters with a backbone | Dunkleosteus |
| The first giant that only strains the water | Titanichthys |
| The first sharks | Cladoselache, the anvil shark, the spine shark |
| The fish of the future is small | the ray-finned fish |
| Coiled shells: the first ammonoids | the ammonoid |
| The first forests grow on land | the driftwood |
| Fish with four legs leave the water | the menu text |
| Seas without air, and a great dying at the end | the black floor |

## Decisions

| Decision | By |
|---|---|
| One real place and time: the sea of the Cleveland Shale, about 360 million years ago | Claude |
| Dunkleosteus at 3.4 to 4.1 m, after the study of 2023, not at the 6 to 10 m of older books | Claude |
| A world of open water. The floor is far below, black and empty | Claude |
| The list of the ten | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Atmosphere

The mood to aim for: open, green, murky water with nothing to hold on to. Bright above, darkening below to a black
plain. Large shapes come out of the haze.

| | World of today | Devonian |
|---|---|---|
| Water | clear blue | olive green, thick with plankton near the surface, brownish and dim below 30 m |
| How far one sees | far | about 30 m near the surface, 15 m near the floor |
| Surface | visible from below, with waves | visible, bright, with a green shimmer |
| Sunlight | strong, sharp shafts, bright flecks | strong at the top, with clear shafts that fade quickly downwards. No flecks: the floor is dark |
| Drifting particles | a few | many: green-brown flakes sinking slowly, thicker towards the floor |
| Ground | rock and sand, strong colours | flat black mud, soft, without a track or a hole. A faint milky layer lies just above it |
| Sound | rumble, surface wash, chimes, whale calls | open-water hum, surface wash from far above, deep and dull near the floor. No calls |

## Sea floor

- **The plain.** A flat floor of black mud about 45 m under the surface, with very low swells. No rock, no reef.
- **What has sunk.** Here and there a log of driftwood half sunk into the mud, and the pale bone plates of a dead
  armoured fish. Nothing has touched them.
- **The life is above.** Everything alive keeps to the upper 30 m. The player can dive to the floor, and the water
  gets darker and emptier on the way down.
- **Not here:** reefs, plants on the floor, anything that crawls.

## The ten exhibits

Sizes in metres, one unit is one metre.

| Id | What | Size | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `dunkleosteus` | Dunkleosteus | 3.4, one of 4.1 | a deep, stout body like a tuna; head and chest in heavy plates of bone with a joint behind the head; no teeth but two pairs of bone blades; a ring of bone in each eye; smooth skin behind the armour, a strong tail | cruises on wide paths; the head lifts when the mouth opens | 3 |
| `titanichthys` | Titanichthys | about 4 | built like Dunkleosteus but flatter and wider in the head, with long thin jaws and a very wide mouth | swims slowly with its mouth open | 2 |
| `cladoselache` | the early shark Cladoselache | up to 1.8 | slim, shaped like a torpedo, a short blunt snout, large eyes, two back fins, wide breast fins, a forked tail with keels | fast, in loose groups | 3 groups of about 6 |
| `stethacanthus` | the anvil shark | about 1 | a small shark with a flat-topped fin like an anvil on its back, rough with small teeth on top, and a rough patch on its head | swims alone, slowly | about 8 |
| `ctenacanthus` | the spine shark | about 1.5 | a sturdy shark with two back fins, each with a long ribbed spine in front | swims alone | about 6 |
| `kentuckia` | small ray-finned fish | about 0.12 | a slim, large-eyed fish with shiny diamond-shaped scales and one back fin | schools | 6 schools of about 150 |
| `concavicaris` | Concavicaris | about 0.06 | a small arthropod in a shell folded around it, with a notch in front and large eyes | swarms | 8 swarms of about 300 |
| `goniatite` | early ammonoids | shell 0.03 to 0.08 across | a coiled, smooth shell with a zigzag line pattern, a head with arms in its opening | bob and swim in short jerks | 4 groups of about 40 |
| `driftwood` | a trunk of the first tree | 12 long, 0.6 thick | a bare log with stumps of branches, floating just under the surface | drifts and turns slowly | 2 floating, 3 sunk |
| `floor` | the black floor | no `size` | the plain itself | | a backdrop, named close to the floor |

Order of work, easiest first: the floor and the driftwood, the schools and swarms, then the sharks, then the two
giants.

What the engine already offers: the fish school and the swarms, and animals on wide paths (manta and plesiosaur of
`today`). There is no rock to collide with except the floor: paths are free, but keep the giants in the upper water.

## Texts

For the zoo file of this era. Put the source links next to each entry as comments once the facts are checked (see
`era-common.md`, "Facts and sources").

```js
// Zoo texts of the Devonian. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  dunkleosteus: {
    name: 'Dunkleosteus', sub: 'Dunkleosteus terrelli · a hunter in armour', size: 4.1,
    facts: [['Length', 'about 3.4 m, the largest about 4.1 m'], ['Armour', 'bone plates on head and chest'], ['Teeth', 'none: blades of bone']],
    text: 'The top hunter of its sea. It has no teeth: its jaw bones are blades. Only the armour of head and chest becomes a fossil, so its length was long a guess, and books said up to 10 m. A study of 2023 compared a thousand kinds of fish and found about 4 m, stout as a tuna.',
  },
  titanichthys: {
    name: 'Titanichthys', sub: 'Titanichthys · a giant without a bite', size: 4,
    facts: [['Length', 'about 4 m, not certain'], ['Jaws', 'long and thin, without blades'], ['Food', 'probably plankton']],
    text: 'As large as Dunkleosteus, and harmless. Its long, thin jaws have no cutting edge. It probably swam with its mouth wide open and strained small animals out of the water, as basking sharks do today. It may be the earliest giant with a backbone that lived this way.',
  },
  cladoselache: {
    name: 'Cladoselache', sub: 'Cladoselache · an early shark', size: 1.8,
    facts: [['Length', 'up to about 1.8 m'], ['Build', 'slim, with a forked tail'], ['Skeleton', 'cartilage, as in all sharks']],
    text: 'Sharks are older than the dinosaurs by more than 100 million years, and this is one of the first that is known well. The black mud of this sea kept not only its teeth, but the outline of its body, traces of its muscles and even its last meals: mostly small fish.',
  },
  stethacanthus: {
    name: 'Anvil shark', sub: 'Stethacanthus · a shark with a brush on its back', size: 1,
    facts: [['Length', 'about 1 m'], ['On its back', 'a flat-topped fin covered in small teeth'], ['What for', 'unknown']],
    text: 'Where other sharks carry a fin, this one has something like an anvil, with a patch of small teeth on top and another on its head. Nobody knows what it was for. Because not every animal had one, most researchers think it served to impress a rival or to win a mate.',
  },
  ctenacanthus: {
    name: 'Spine shark', sub: 'Ctenacanthus · a shark with fin spines', size: 1.5,
    facts: [['Length', 'about 1.5 m'], ['Back fins', 'two, each with a ribbed spine'], ['What is usually found', 'teeth and spines only']],
    text: 'A shark has no bones. Its skeleton is cartilage, which rots away. What remains are teeth, scales and spines: this shark carried a long, ribbed spine in front of each back fin. For most early sharks such hard parts are all that is known. In this black mud whole bodies were kept.',
  },
  kentuckia: {
    name: 'Ray-finned fish', sub: 'Kentuckia · small, and the future', size: 0.12,
    facts: [['Length', 'about 12 cm'], ['Fins', 'skin stretched over fine rays of bone'], ['Its group today', 'about half of all species with a backbone']],
    text: 'Small, plain and easy to overlook between the giants in armour. But the armoured fish will be gone at the end of this era, every one of them, and fish like this will inherit the water. Their group, the ray-finned fishes, makes up about half of all species with a backbone today.',
  },
  concavicaris: {
    name: 'Concavicaris', sub: 'a small arthropod in a folded shell', size: 0.06,
    facts: [['Length', 'about 6 cm'], ['Shell', 'folded around the body'], ['Role here', 'food for almost everyone']],
    text: 'Swarms of these small arthropods feed this sea. Each sits in a shell that is folded around its body, with large eyes at the front. Fossil sharks from this mud have been found with them in their stomachs. Their group lived for more than 300 million years and then died out.',
  },
  goniatite: {
    name: 'Ammonoid', sub: 'an early relative of the ammonites', size: 0.08,
    facts: [['Shell', '3 to 8 cm across'], ['First appear', 'in the Devonian'], ['Die out', 'together with the dinosaurs']],
    text: 'A relative of the squid in a coiled shell. The straight shells of earlier seas have rolled up, which makes a compact body that turns easily. These are the first of their line. Their descendants, the ammonites, will fill the seas for 300 million years and vanish together with the dinosaurs.',
  },
  driftwood: {
    name: 'Driftwood', sub: 'a trunk of Archaeopteris, the first tree', size: 12,
    facts: [['This log', '12 m long'], ['The living tree', 'up to about 30 m tall'], ['Leaves', 'like fern fronds']],
    text: 'A tree trunk far out at sea: a river has washed it here. Until this era the land had no forests. Archaeopteris is among the first trees with real wood and deep roots, and it now spreads over the continents. Roots break rock into soil, and rivers carry it into the sea, where it feeds the algae.',
  },
  floor: {
    name: 'The black floor', sub: 'a sea floor without air',
    facts: [['Oxygen down here', 'none'], ['Lives here', 'nothing'], ['Becomes', 'black shale']],
    text: 'Nothing crawls on this mud and nothing digs in it. Algae bloom in the light above, die, sink and rot, and the rotting uses up the oxygen of the deep water. Whatever dies sinks into the black ooze untouched. Seas like this spread at the end of the Devonian, and most kinds of sea animals die out.',
  },
};
```

The sentences for the title menu:

> **Devonian · 420 to 359 million years ago.** The age of fishes. Fish now have jaws. Some wear armour of bone and
> grow as long as a car, and the first sharks swim beside them. On land the first forests grow, and near the end the
> first animals with four legs leave the water. You dive about 360 million years back, into the open sea over what is
> now Ohio. The floor below has no air.

## Sources

**Checked on 2026-11-16:**

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 419.62 and 358.86.
- `dunkleosteus`: Engelman, "A Devonian Fish Tale", Diversity 2023 (https://www.mdpi.com/1424-2818/15/3/318; the
  abstract as record at https://agris.fao.org/search/en/records/675aad610ce2cede71ccd76d): only head and chest
  armour are regularly preserved; lengths of 5 to 10 m were commonly cited without a statistical basis; a new
  method based on 3,169 observations of 972 species gives 3.4 m for typical adults and about 4.1 m for the largest
  known; arthrodires have a short, deep body; large arthrodires such as Dunkleosteus and Titanichthys were much
  smaller than thought. Sci.News (https://www.sci.news/paleontology/dunkleosteus-terrelli-11735.html): best known
  from the latest Devonian Cleveland Shale of Ohio; shorter and stouter than thought. The card says "a thousand
  kinds of fish" for the 972 species.

**Not checked yet** (from Claude's knowledge, check before the text ships):

- **Place.** The Cleveland Shale as the mud of a sea with oxygen-free deep water, about 360 million years old, and
  which of the ten are known from it. Check `kentuckia`, `concavicaris`, `goniatite` and `ctenacanthus` in
  particular.
- `dunkleosteus`: the bone blades, the ring of bone in the eye, the joint behind the head. The estimate of 2023 has
  been questioned by other researchers; look for newer work.
- `titanichthys`: its length (older books give more, the study above says they are too high), the jaws, the idea
  that it strained plankton (a study of 2020 as Claude remembers it).
- `cladoselache`: 1.8 m, what is preserved, its meals.
- `stethacanthus`: 1 m, the structure, that not every animal had it.
- `ctenacanthus`: 1.5 m, the spines.
- `kentuckia`: 12 cm; the share of ray-finned fishes today.
- `concavicaris`: 6 cm; found in shark stomachs; how long its group lived.
- `goniatite`: first ammonoids in the Devonian; 300 million years.
- `driftwood`: Archaeopteris as one of the first trees, its height, logs in this shale.
- `floor`: how the deep water lost its oxygen; the great dying at the end of the Devonian.
- Menu text: the first four-legged animals near the end of the Devonian; the first forests.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `dunkleosteus`, `titanichthys` | 12 |
| `cladoselache`, `ctenacanthus`, `driftwood` | 8 |
| `stethacanthus` | 6 |
| `kentuckia`, `concavicaris`, `goniatite` | 6 from the middle of the group |
| `floor` | a backdrop, named within 8 of the floor when nothing else is looked at |

## Only in this world

- **No ground to stand the viewpoints on.** The engine puts each viewpoint on the sea floor and counts its height
  from there. Here five of the six hang in open water, 20 to 40 m above the floor. One is at the floor, beside a
  sunk log and the plates of a dead Dunkleosteus.
- **Size without a yardstick.** In open water nothing shows how large an animal is. Let the schools of small fish
  pass close to the giants, and let the giants pass the driftwood.
- **Darker towards the floor.** Exposure and haze change with the depth (`ERA.tick()`), as in `cambrian`, only the
  other way round.
- **The mouth of Dunkleosteus.** It opens by lifting the head and dropping the jaw at once. If it opens at all, it
  has to open like that.

## Later, not in this task

- A reef of the middle Devonian, the largest reefs the Earth has had.
- The river mouth where fish grow legs: Tiktaalik.
- Dunkleosteus hunting.
