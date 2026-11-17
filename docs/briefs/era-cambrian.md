# Brief: the Cambrian world

The first new era of Historic Ocean. The player dives about 508 million years back, to the sea floor at the foot of a
giant reef wall, among the animals of the Burgess Shale. It is a world of its own: other ground, other light, ten
kinds of living things that exist nowhere else in the game, and a zoo card for each.

- **Asked for by:** Mario, 2026-11-15.
- **Needs:** `eras.md`, finished. This brief only adds the folder of the era `cambrian`.
- **Language of the texts:** English.
- **Result:** `cambrian.html`, chosen from the timeline in the title menu.
- **What comes after:** if Mario likes how this world looks, the next eras follow the same pattern.
- **Changed on 2026-11-16:** this world goes to true scale, one unit for one metre (Mario). Sizes, reach and menu
  text below are the new ones. What is built so far was built with a player 20 times smaller: `scale.md`, stage 3,
  says how to change it.
- **Look, 2026-11-16:** beside `today` this world looks empty and flat (Mario). `cambrian-look.md` says what to do
  about it. Where it disagrees with the atmosphere targets below (even light, no flecks, faint shafts, quiet
  colours), `cambrian-look.md` wins.

Read `CLAUDE.md` and `eras.md` first.

## The place

The Cambrian lasted from 538.8 to 486.85 million years ago. The world shows one moment of it, about 508 million years
ago, and one place: a deep basin beside a reef wall on the edge of the continent Laurentia, close to the equator.
Mud slid down that wall again and again and buried the animals at its foot so fast that even soft bodies became
fossils. They were found in 1909 in the Canadian Rocky Mountains and are known as the Burgess Shale. All ten
exhibits are known from those rocks, so the world shows animals that lived together, not a mix from all over
the Cambrian.

## What is special about the Cambrian, and where the world shows it

| Special feature | Where the player meets it |
|---|---|
| The Cambrian explosion: most of the main groups of animals alive today first appear | the sentences in the menu, and the sheer variety of shapes |
| The first big hunters and the first good eyes | Anomalocaris, the jellyfish |
| Shells, spines and armour as an answer to them | the trilobite, Hallucigenia, Marrella |
| Body plans that look like experiments | Opabinia, Hallucigenia |
| Our own beginnings | Metaspriggina, one of the first fish |
| No plants. The gardens are animals, and the land above is bare | the tulip animal, Vauxia, the algae card |
| Why we know all this: the mudslides at the wall | the card of the wall |
| Everything is small | the scale, see below |

## Decisions

| Decision | By |
|---|---|
| The Cambrian is the first new world, with ten kinds of living things to start with | Mario |
| It differs from the other eras in its atmosphere | Mario |
| One real place and time, the Burgess Shale, not a mix of the whole Cambrian | Claude |
| True scale: one unit is one metre and the player is as large as a diver, as in every era (`scale.md`). Before 2026-11-16 the player was 20 times smaller here | Mario |
| The water surface cannot be seen: this is a deep basin, the light comes from far above | Claude |
| The list of the ten | Claude |

The decisions marked Claude are defaults. Mario can change them; ask before building something else.

## Scale

The animals of the Burgess Shale are small: most are between 1 and 10 cm long, the largest about 40 cm. The world
shows them at that size. **One unit is one metre**, as in every era, and the player is as large as a diver
(Mario, 2026-11-16). The largest hunter of this sea is as long as a forearm. That is the point: it is what the
Cambrian was like.

So that the player sees them all the same:

- the world asks for the close camera of `scale.md`, stage 2;
- the life is gathered in gardens a few metres across, one in front of each viewpoint that looks at the basin,
  with bare mud between them;
- every card gives the size and shows it next to the diver's hand (`scale.md`, stage 1).

The first version of this brief made the player 20 times smaller instead (one unit for 5 cm), and the world was
built that way up to the swimmers. `scale.md`, stage 3, describes the change.

## Atmosphere

The mood to aim for: green dusk at the foot of a wall that disappears upwards. Calm, wide, a little eerie. Clearly a
different world from the bright blue of today at first glance.

| | World of today | Cambrian |
|---|---|---|
| Water | clear blue | jade green, slightly milky from drifting mud |
| How far one sees | far | clear for about 40 m, shapes only at 100 m |
| Surface | visible from below, with waves | not visible. Looking up shows a soft pale glow |
| How high the player can swim | to just under the surface | to about 12 m under where the surface would be |
| Sunlight | strong, with sharp shafts and bright moving flecks on the ground | soft and even, from above. Faint broad shafts near the top of the wall at most, no flecks on the ground |
| Drifting particles | a few | many: mud and marine snow, slowly sinking |
| Ground | rock and sand, strong colours | pale grey-green mud in soft swells, darker rock at the wall |
| Sound | rumble, surface wash, chimes, whale calls | deeper and quieter. No surface wash and no whale calls: there are no whales yet |

These are targets for the eye, not numbers. Find the numbers in the browser, and let the visual critic and then Mario
judge. How it looked is not known from fossils: say so in the menu text.

## Sea floor

- **The wall.** One side of the world is a reef wall that rises out of sight. It is the edge of the world on that
  side. At its foot: ledges, a few overhangs, fallen blocks.
- **The basin.** Away from the wall a wide plain of mud with low swells and a few tongues of mud that have slid down
  from the wall. It runs out into the haze. The other edges of the world stay hidden in it.
- **Not here:** kelp, floating boulders, arches, the purple grotto, the ship, the whale tail.
- Everything the player can reach has to be free of traps: the collision works as today.

## The ten exhibits

Sizes are in metres: the real size, which is the size in the world. Shapes follow the fossils as far as the sources
below describe them. Colours are free, keep them natural and quiet. Movement that the fossils do not show (how fast,
whether in groups) is free as well, and the cards do not claim it.

| Id | What | Size in metres | Shape | Movement | Where and how many |
|---|---|---|---|---|---|
| `anomalocaris` | Anomalocaris, the big hunter | body 0.38 | long flat body, a row of overlapping flaps down each side, a tail fan, two eyes on stalks, two spiny arms in front, held forward | swims by a wave that runs along the flaps; arms flex slowly | 3, on wide paths through the open water |
| `opabinia` | Opabinia | 0.07 | like a small Anomalocaris, but with five eyes on the head and one long trunk with a claw at its tip | swims low over the ground with the same wave of the flaps; the trunk sways and probes | about 8, near the algae and the tulip fields |
| `hallucigenia` | Hallucigenia | 0.01 to 0.05 | a thin worm on seven pairs of legs with claws, seven pairs of long spines on its back, three pairs of thin tentacles at the neck, a long head | walks slowly | about 60, on the ground at the sponges |
| `marrella` | Marrella | up to 0.025 | a small head shield with two pairs of long spines that sweep back over a body with many fine legs | swims in loose swarms just above the ground | 6 swarms of about 300 |
| `olenoides` | the trilobite Olenoides | up to 0.09 | a broad oval shield in three parts: head, seven body segments, a tail piece with spines along its rim; two long antennae, many legs under the shield | walks on the mud; a few lie half dug in | about 150 on three open patches |
| `metaspriggina` | Metaspriggina, one of the first fish | 0.06 | slim, tapering, no fins, a small head with two eyes on top | swims with a wave through the whole body, like an eel | 4 groups of about 40, in the water near the wall |
| `burgessomedusa` | the jellyfish | bell 0.2 high | a bell much higher than wide (its width is about 40 % of its height), with more than 90 short tentacles around the rim (about 15 % of the height long) | pulses and drifts, slowly rising and sinking | about 25, in three loose groups in open water |
| `vauxia` | the sponge Vauxia | not verified, assume 0.08 | a little bush of branching tubes | stands still | several hundred, in thickets on rock and blocks at the wall |
| `siphusauctum` | the tulip animal | 0.2 | a thin stalk on a small foot, with an egg-shaped cup on top | sways a little in the current | thousands, in dense fields on the low swells |
| `algae` | algae | tufts of 0.01 to 0.08, not verified | tufts and carpets of fine threads | sway a little | carpets on the higher swells, crusts on the wall |

The numbers in the last column were chosen for the old scale. At true scale the life is gathered in gardens
(`scale.md`, stage 3): keep the kinds and their proportions to each other, and set the numbers so that every
garden looks alive.

Order of work, easiest first: what stands still (`siphusauctum`, `vauxia`, `algae`), then the swimmers (`marrella`,
`metaspriggina`, `burgessomedusa`, `opabinia`, `anomalocaris`), then the walkers (`hallucigenia`, `olenoides`).

What the engine already offers for this:

- Things that stand in masses: the way kelp, sponges and corals are scattered and drawn today.
- Swarms: the fish school.
- A long animal that follows its path with its whole body: the plesiosaur.
- A wave that runs along flaps: the wing of the manta.
- New: animals that walk on the ground. `makeWorld` knows the height of the ground (`gy`) while it places things.
  Keep the walkers on flat ground, and keep the rule that animation has no state.

## One more exhibit: the wall

The wall gets a card of its own, id `wall`, registered with `place()` along its foot. It tells why these animals are
known at all.

## Texts

For the zoo file of this era. Keep the source links as comments next to each entry. Do not add or change facts
without a source.

```js
// Zoo texts of the Cambrian. name, sub and text are shown as they are, facts are [label, value] rows.
const ZOO = {
  anomalocaris: {
    name: 'Anomalocaris', sub: 'Anomalocaris canadensis · early relative of the arthropods',
    facts: [['Length', 'about 38 cm without arms and tail'], ['Swims with', 'rows of flaps along its sides'], ['Eyes', 'on stalks, with thousands of lenses']],
    text: 'One of the largest animals of its time and one of the first top hunters. It swam by rippling the flaps along its body and grabbed prey with the two spiny arms in front of its round mouth. For almost a century its parts were taken for separate animals: the arm for a shrimp, the mouth for a jellyfish.',
  },
  opabinia: {
    name: 'Opabinia', sub: 'Opabinia regalis · early relative of the arthropods',
    facts: [['Length', '4 to 7 cm without the trunk'], ['Eyes', 'five'], ['Trunk', 'one, with a claw at the tip']],
    text: 'Five eyes on top of the head and a long, bendable trunk that ends in a claw: when this animal was first presented to scientists, the audience laughed. It probably searched the mud for food with its trunk. Like its larger relative Anomalocaris it had a row of flaps along each side.',
  },
  hallucigenia: {
    name: 'Hallucigenia', sub: 'Hallucigenia sparsa · relative of the velvet worms',
    facts: [['Length', '1 to 5 cm'], ['Back', 'pairs of long spines'], ['Legs', 'seven pairs, each ending in claws']],
    text: 'So strange that it was first put together upside down and back to front: its spines were taken for legs and its legs for tentacles. Only in 2015 did researchers find its real head, with a pair of simple eyes and a ring of teeth around the mouth. It lived on the sea floor.',
  },
  marrella: {
    name: 'Marrella', sub: 'Marrella splendens · the lace crab',
    facts: [['Length', 'up to 2.5 cm'], ['Fossils found', 'more than 25,000'], ['Head', 'two pairs of long spines that sweep back']],
    text: 'The most common animal of the Burgess Shale, and the first fossil that Charles Walcott collected there in 1909. He called it the lace crab. It is neither a crab nor a trilobite: it belongs to a branch of the arthropods that died out long ago.',
  },
  olenoides: {
    name: 'Trilobite', sub: 'Olenoides serratus · arthropod with a hard shell',
    facts: [['Length', 'up to 9 cm'], ['Legs', 'jointed, each with a gill'], ['Trilobite species known', 'more than 22,000']],
    text: 'Trilobites left fossils all over the world, because their hard shells are easily preserved. Their soft legs almost never are: fewer than one species in 500 shows any trace of them. This one is an exception. Its fossils keep antennae and legs, so we know that it walked and dug on the sea floor.',
  },
  metaspriggina: {
    name: 'Metaspriggina', sub: 'Metaspriggina walcotti · one of the first fish',
    facts: [['Length', 'about 6 cm'], ['Eyes', 'two, large'], ['Jaws and fins', 'none yet']],
    text: 'One of the oldest fish known, and a very distant relative of yours. It already had a head with two eyes and a stiff rod along its back, where a backbone would later form. It had no jaws. But the first of its seven pairs of gill bars was thicker than the rest: a first step towards them.',
  },
  burgessomedusa: {
    name: 'Jellyfish', sub: 'Burgessomedusa phasmiformis · oldest known swimming jellyfish',
    facts: [['Bell', 'up to 20 cm high'], ['Tentacles', 'more than 90, short'], ['Named', '2023']],
    text: 'A jellyfish is about 95 percent water, so it almost never turns into a fossil. This one did, 182 times. Bell and tentacles show that large jellyfish already swam and caught prey in the Cambrian sea, more than 500 million years ago.',
  },
  vauxia: {
    name: 'Vauxia', sub: 'Vauxia gracilenta · branching sponge',
    facts: [['Kind', 'sponge, an animal'], ['Skeleton', 'tough, bendable fibres'], ['Food', 'filtered from the water']],
    text: 'Not a plant, although it grows like a little bush: it is a sponge, the most common one in the Burgess Shale. In its fossils researchers found chitin, the material that also stiffens the shells of insects and crabs. At 505 million years it is the oldest chitin found so far.',
  },
  siphusauctum: {
    name: 'Tulip animal', sub: 'Siphusauctum gregarium · an animal on a stalk',
    facts: [['Height', 'about 20 cm'], ['Lives', 'in crowds'], ['Relatives', 'unknown']],
    text: 'It looks like a flower but is an animal. The cup on top of the stalk took in water through six openings and filtered food out of it. More than 1,100 fossils were found, many of them side by side: these animals stood in dense fields. Which animals of today are its relatives, nobody knows for sure.',
  },
  algae: {
    name: 'Algae', sub: 'the only plants of the Cambrian',
    facts: [['On land', 'nothing grows yet'], ['In the sea', 'algae']],
    text: 'There are no trees and no grass in this world, anywhere. Plants have not yet left the water, and the land is bare rock and mud. In the sea, algae do the work of plants. They even built the giant wall beside this basin: a reef roughly 100 m high.',
  },
  wall: {
    name: 'The great wall', sub: 'a reef, and the reason we know these animals',
    facts: [['Fossils collected', 'more than 200,000'], ['Species', 'more than 200'], ['First found', '1909, by Charles Walcott']],
    text: 'From time to time mud slid down this wall and buried everything at its foot within moments. Sealed in, without air, even soft bodies turned into fossils: eyes, guts, legs, jellyfish. That is why we know the animals around you so well, half a billion years later.',
  },
};
```

The `size` of each entry, for the size picture of `scale.md`: `anomalocaris` 0.38, `opabinia` 0.07,
`hallucigenia` 0.05, `marrella` 0.025, `olenoides` 0.09, `metaspriggina` 0.06, `burgessomedusa` 0.2, `vauxia` 0.08,
`siphusauctum` 0.2, `algae` 0.08. The wall has none.

The sentences for the title menu:

> **Cambrian · 539 to 487 million years ago.** Most of the main groups of animals alive today first appear in rocks
> of this age: an explosion of new bodies, with eyes, legs, shells and spines. All of it happens in the sea. The
> land is bare. You dive 508 million years back, to the foot of a reef wall. Nothing alive here is longer than your
> arm. Shapes follow the fossils. Light, colours and behaviour are guesses.

Sources, checked on 2026-11-15:

- **Dates.** International Chronostratigraphic Chart v2024/12
  (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf): 538.8 and 486.85. The age of the Burgess Shale
  is given as 505 million years by the Royal Ontario Museum and as 508 by others; the texts say 508 for the dive and
  505 only where the source of that fact does.
- **Place.** US National Park Service, "Cambrian Period" (https://home.nps.gov/articles/000/cambrian-period.htm):
  deep basin next to an enormous algal reef with a vertical escarpment several hundred feet high, bare land,
  mudslides, no land plants, Laurentia. The card turns "several hundred feet" into "roughly 100 m". UC Museum of
  Paleontology, "Cambrian: Tectonics and Paleoclimate" (https://ucmp.berkeley.edu/cambrian/cambtect.html): Laurentia
  straddled the equator, no plants, land without vegetation. CBC, The Nature of Things
  (https://www.cbc.ca/natureofthings/m_features/meet-the-weird-wacky-and-wonderful-creatures-that-lived-in-cambrian-seas-ov):
  found in 1909 by Charles Walcott, animals trapped by an underwater landslide, arms race of hunters and hunted.
  Shape of Life (https://shapeoflife.org/evolution/animals): fossils of most existing phyla first appear in the
  Cambrian.
- `anomalocaris`: Wikipedia, "Anomalocaris" (https://en.wikipedia.org/wiki/Anomalocaris): up to 37.8 cm without
  frontal appendages and tail fan, the older figure of 1 m is unlikely, 13 pairs of trunk flaps, swam by undulating
  them, first described in 1892 and understood in 1985. National Geographic
  (https://www.nationalgeographic.com/premium/article/was-this-prehistoric-killer-shrimp-as-fierce-as-it-looked):
  compound eyes on stalks with 16,000 lenses, circular mouth, hunted soft prey in open water, arms held forward.
  Deposits Magazine
  (https://depositsmag.com/2026/04/15/the-weird-and-wonderful-of-the-cambrian-part-2-anomalocaris-apex-predator-of-the-cambrian-seas/):
  arm mistaken for a shrimp, mouth for a jellyfish.
- `opabinia`: Wikipedia, "Opabinia" (https://en.wikipedia.org/wiki/Opabinia): 4 to 7 cm without the proboscis, the
  audience laughed, probably searched the sediment with the proboscis. The five eyes and the claw are in the same
  article; the search result showed them only through a second site, so check them there before shipping.
- `hallucigenia`: University of Cambridge
  (https://www.cam.ac.uk/research/news/newly-discovered-ring-of-teeth-helps-determine-what-common-ancestor-of-moulting-animals-looked-like)
  and Sci.News (https://www.sci.news/paleontology/science-hallucigenia-cambrian-worm-like-creature-02949.html): 10
  to 50 mm, reconstructed upside down and back to front, head found in 2015 with a pair of simple eyes and a ring of
  teeth, seven pairs of clawed legs, three pairs of tentacles, pairs of long spines, relative of velvet worms, lived
  on the sea floor.
- `marrella`: Wikipedia, "Marrella" (https://en.wikipedia.org/wiki/Marrella): 2.4 to 24.5 mm, most common animal of
  the Burgess Shale, over 25,000 specimens, first fossil Walcott collected there in 1909, "lace crab", neither
  trilobite nor crustacean, two pairs of long spines on the head shield. Its group is known up to the Devonian.
- `olenoides`: Harvard University, Department of Organismic and Evolutionary Biology
  (https://www.oeb.harvard.edu/news/2025/08/ancient-arthropods-move-unraveling-secret-steps-burgess-shale-trilobites)
  and EurekAlert (https://www.eurekalert.org/news-releases/1093536): more than 22,000 species, fewer than 0.2 %
  with any trace of legs, antennae and limbs preserved, walked and burrowed, each leg with a gill. Wikipedia,
  "Olenoides", read through Wikiwand (https://www.wikiwand.com/en/articles/Olenoides): up to 9 cm, seven body segments, spines on the tail
  piece.
- `metaspriggina`: Royal Ontario Museum, "A Fish With a Big Bang" (https://www.rom.on.ca/blogs/fish-big-bang): the
  only fish among more than 200 species of the Burgess Shale, about 6 cm, more than 200,000 specimens collected
  since 1909. ScienceDaily (https://www.sciencedaily.com/releases/2014/06/140611131743.htm): large eyes, active
  swimmer, gill arches in pairs. Phys.org (https://phys.org/news/2014-06-oldest-fish-world-million-years.pdf): seven
  pairs of gill arches, the front pair hinting at jaws. Oceanbites
  (https://oceanbites.org/a-jaw-dropping-cambrian-fish/): no fins. The stiff rod is the notochord of the paper's
  abstract (Conway Morris and Caron, Nature 2014).
- `burgessomedusa`: Royal Ontario Museum
  (https://www.rom.on.ca/news-releases/royal-ontario-museum-researchers-identify-oldest-known-species-swimming-jellyfish)
  and Phys.org (https://phys.org/news/2023-08-oldest-species-jellyfish.html): oldest swimming jellyfish, about 95 %
  water, able to catch sizeable prey. Abstract of Moon, Caron and Moysiuk, Proceedings of the Royal Society B 2023
  (https://novataxa.blogspot.com/2023/08/burgessomedusa.html): 182 fossils, bell up to 20 cm high, over 90 short
  tentacles, width about 40 % of the height.
- `vauxia`: Ehrlich and others, Scientific Reports 2013 (https://www.nature.com/articles/srep03497): chitin 505
  million years old, the oldest found. Rigby, Geological Survey of Greenland
  (https://geusjournals.org/index.php/rapggu/article/download/7964/13834/42697): branching, the most common sponge
  of the Burgess Shale. Wikipedia, "Vauxia" (https://en.wikipedia.org/wiki/Vauxia): skeleton of spongin, feeds by
  filtering. **Not verified:** its height.
- `siphusauctum`: O'Brien and Caron, PLOS ONE 2012 (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3261148/): at
  least 20 cm, cup on a stalk with a small holdfast, six openings, 1,133 specimens, lived in clusters, relatives not
  known. ScienceDaily (https://sciencedaily.com/releases/2012/01/120118173659.htm): tulip shape, filter feeding.
- `algae`: the National Park Service and UC Museum of Paleontology pages above. The same paper on the tulip animal
  mentions numerous algae at that site. **Not verified:** which kinds of algae, and their size.
- `wall`: the National Park Service page above for the wall and the mudslides, the Royal Ontario Museum page above
  for 200 species and 200,000 specimens since 1909, the Harvard page above for burial that cut off the oxygen.

## Zoo reach to start with

| Id | Reach in metres |
|---|---|
| `anomalocaris` | 3 |
| `burgessomedusa`, `siphusauctum` | 2 |
| `opabinia`, `olenoides`, `metaspriggina`, `vauxia` | 1.5 |
| `marrella` | 2 from the middle of the swarm |
| `hallucigenia`, `algae` | 1 |
| `wall` | 15 from its foot |

## Stages

Each stage ends with a hand-over, both builds running and Mario looking at it.

1. **The place and its light.** Sea floor, wall and atmosphere, with nothing alive in it. Six viewpoints and a flight
   path. Mario decides here whether the look is right. Do not go on before he has.
2. **What stands still.** Tulip fields, sponge thickets, algae, the card of the wall.
3. **The swimmers.**
4. **The walkers.**
5. **Sound, menu text, last corrections.**

## Rules that matter here

- **Nothing of today in this world.** No kelp, fish, mantas, whale calls. Check by search in the built page.
- **Fossils first.** Where the table and a source disagree, the source wins; say so in the hand-over.
- **No claims without a source.** Cards say only what the sources above say. What is free is free only in the
  picture.
- **One detail level, a computer only** (Mario, 2026-11-16). Nothing is built or checked for phones, touch screens
  or lower detail levels.
- **Paths in open water.** Check every path against the rock, with room for the widest part of the animal.

## Acceptance criteria

1. `cambrian.html` is built, can be chosen from the timeline of `index.html`, and leads back the same way.
2. The world of today has not changed: its six viewpoints still match.
3. From each of the six viewpoints of the Cambrian the picture is, at first glance, another world than today: other
   colour of the water, no surface, the wall or the basin in view.
4. All ten kinds are in the world, in the numbers of the table or close to them, and each can be found within a
   minute from at least one viewpoint.
5. Every kind and the wall show their hint and their card, with the texts above.
6. The menu shows the sentences above for this era.
7. Sizes in the world match the table within a tenth.
8. No whale calls and no surface wash can be heard.
9. No new messages in the browser console. Both builds run. The hand-over names the bundle size of the page.

## Verification

Both gates of `CLAUDE.md`, for this era's own six poses and flight path.

- **Visual critic.** After stage 1 and again at the end. Give it one render of the world of today next to each
  Cambrian pose and ask one more question: do the two look like different worlds? In addition one close render of
  each of the ten kinds and of an open card.
- **Performance.** The benchmark of the Cambrian flight, and once more the one of today, which must not have changed.

## Later, not in this task

- More Cambrian life: Wiwaxia, Pikaia, Ottoia, Sidneyia, Aysheaia, Eldonia, comb jellies.
- Hunting: Anomalocaris chasing, trilobites rolling up or digging in.
- A mudslide that the player can watch.
- The next era.
