# Brief: the animals of the Devonian, rebuilt from sources

The models of the Devonian look bad (Mario, 2026-11-17). The reason is the same as with the first trilobite: they
were built from a few sentences, not from a body. This brief gives every animal of the Devonian its sources: what
they print about its shape, which drawing to measure, and what nobody knows. From that each animal is rebuilt, the
way the trilobite was.

- **Asked for by:** Mario, 2026-11-17. Claude Code had reported that the Cambrian animals have museum sources in
  their comments and the Devonian ones have no such references.
- **Order:** item 11 of `TODO.md`. One animal at a time, Dunkleosteus first.
- **Files expected to change:** `source/eras/devonian/swimmers_*.js`, `driftwood.js`, `zoo.js` where a card is
  wrong, new notes under `docs/research/devonian/`.

Read `CLAUDE.md` first ("Every animal is a body, not a cut-out"), then `era-common.md` and `era-devonian.md`.

## What worked for the trilobite

1. Research notes with the sources read in full, the sentences that matter, and proportions measured on the
   published drawings (`tools/out/research/olenoides.md`).
2. A comment "in the round" next to the mesh: every figure in lengths of the body, with its source, and what is an
   estimate (`source/eras/cambrian/walkers.js`, above `TR_C`).
3. The mesh rebuilt from those figures, then the skin.
4. The turntable before and after, and the visual critic.

The same four steps for every animal here. Step 1 is started below: the sources are found and their printed
numbers are listed. What is left for you in step 1 is what a reader of text cannot do: open the drawings and
photographs that are named and measure them.

**Keep the notes.** `tools/out/` is not in Git. Write the notes of this era to `docs/research/devonian/<id>.md`, in
the form of the Olenoides notes: sources, what each says, "read off the figure" for your own measurements, and a
modeller's summary at the end.

**How far to trust the lists below.** Claude read the sources on 2026-11-17 through a tool that returns the text of
a page, not its pictures. The numbers were taken from that text. Check each against its source when you open it,
and where the source says something else, the source wins. Tell Mario in the hand-over.

## Order of work

1. **Dunkleosteus.** The best sources of all, and the animal everyone looks at. Its turntable, and the animal next
   to a school of small fish, go to Mario before any other animal is touched.
2. **Cladoselache**, then **Titanichthys**.
3. **Stethacanthus**, **Ctenacanthus**.
4. **Kentuckia**, **Concavicaris**, the **ammonoid**.
5. **Driftwood.**

## Dunkleosteus terrelli

**Sources.**

- **E2024:** Engelman 2024, "Reconstructing Dunkleosteus terrelli (Placodermi: Arthrodira): A new look for an iconic
  Devonian predator", Palaeontologia Electronica 27(3):a45. Open access.
  https://palaeo-electronica.org/content/2024/5307-dunkleosteus-reconstruction (tables:
  https://palaeo-electronica.org/content/2024/5313-dunkleosteus-reconstruction-tables). This is the model sheet.
  Figure 4 is the life reconstruction, Figure 3 the armour with its plates, Figure 5 the mounted specimens,
  Figure 13 the cross-section, Figure 14 the height of the spine, Figure 17 the eye rings, Figure 18 the fins.
- **F2017:** Ferrón, Martínez-Pérez and Botella 2017, PeerJ 5:e4081, https://peerj.com/articles/4081. The tail fin,
  Fig. 4A. Its body lengths (up to 8.79 m) are the old ones and are not used.
- **EA:** Engelman and others, The Anatomical Record, https://doi.org/10.1002/ar.70075 (year not checked), reported
  at https://scienceblog.com/the-sea-monster-that-refused-to-fit-the-mold/. The head and the jaws.
- **E2023:** Engelman 2023, Diversity 15(3):318, https://www.mdpi.com/1424-2818/15/3/318. The length.

**What they print** (TL is the total length; all from E2024 unless marked).

| What | Figure |
|---|---|
| Length | typical adult 3.0 to 3.4 m, the largest about 4.1 m |
| Head, from the eye to the gill cover | about 0.18 TL |
| Ventral shield of the armour | 0.30 to 0.32 TL |
| Where the armour ends | the pelvic fins sit at the rear end of the ventral shield, the vent at about 0.5 TL: armour over nearly the front half |
| Greatest depth, at the trunk armour | 0.25 to 0.28 TL, in the largest mount 0.28 to 0.30 |
| Depth against width | 1.21 to 1.29 in adults: an oval that is deeper than wide. Young ones are nearly round |
| Belly | curved, not flat. The flat belly of old drawings is called a mistake |
| Length without tail against depth | 2.66 to 3.18 |
| Height of the spine in the body | at 0.66 to 0.75 of the body's height: high |
| Pectoral fin, where | its base begins 0.131 TL behind the snout (0.112 to 0.146): about half of it lies under the head, below the gill chamber |
| Pectoral fin, base | 0.085 to 0.10 TL long |
| Pectoral fin, shape | pointed, like that of a mackerel shark, broad at the base, front edge straight, aspect ratio about 1.3, standing out at nearly 90 degrees from the body; span given as about twice the width of the chest (check Fig. 18 for what is meant) |
| Pelvic fins | at the rear end of the ventral shield, small: the girdle 0.042 to 0.060 TL high |
| Dorsal fin | one. It begins right behind the keel of the median dorsal plate, as far forward as the armour allows, behind the centre of mass. Triangular, small, lower than a shark's. Its height is not known |
| Anal fin | drawn, but with nothing of it preserved: very uncertain |
| Tail stalk | thicker than a tuna's, thinner than in other armoured fish; 0.02 to 0.09 TL deep, given with a warning. Side keels likely, not known |
| Tail fin | a crescent, close to symmetrical, with a large lower lobe; its span at least the depth of the trunk. No fossil of it exists: "the most speculative aspect" of the reconstruction |
| Tail fin, angles (F2017) | heterocercal angle 22 to 30 degrees, hypocercal angle 44 to 47 degrees, as the paper defines them |
| Snout | rounded and blunt, no pointed nose. Two pairs of nostrils at the snout |
| Mouth | more soft tissue around it than usually drawn: the bone blades show only in part. The cheek is loose and flexible (EA) |
| Eye | the socket 8.1 cm wide in an animal of about 3.4 m. A ring of bone fills it, shaped like a cup that bulges outward. Whether the ring showed in life is not known |
| Gills | one large cleft between the head shield and the trunk armour, covered from the side by a plate. No row of gill slits |
| Skin | no scales. The armour smooth, without ornament. The lateral line ends on the armour |
| Body as a whole | like a tuna or a mackerel shark, but with a blunt head, a larger front, fins further forward and below. The front half is stiff: it swims with the part behind the pelvic fins only |

**How to build it: `dunkleosteus-build.md`** (2026-11-18). The numbers of this section alone did not lead to a fish.
The build sheet hands over the shape as a tested mesh (`ref/dunkleosteus-mesh.js`) with a picture of it, and the
stages in which to work. Where the two files differ on how to build, the build sheet wins.

**What the model has now, and is wrong by these sources.** Five gill slits on each flank behind the armour. A
trunk about 0.18 wide and 0.30 deep by its keys, a ratio near 1.7 (check what the loft makes of them).

**Measure** in E2024 Fig. 4 and Fig. 3: the outline of the head and of the armour from the side and from above, the
height of the dorsal fin, the size of the pelvic and anal fins, the outline of the tail. In Fig. 13 the
cross-section.

**Not known:** the colour (the authors of F2017 drew it dark above and pale below), the tail fin, the height of the
dorsal fin, whether there was an anal fin.

## Titanichthys

**How to build it: `titanichthys-build.md`** (2026-11-19), with a tested mesh and shader in `ref/` and the sources in
`docs/research/devonian/titanichthys.md`. The relative used for the body is Amazichthys trinajsticae (J2022).

**Sources.**

- **BR2017:** Boyle and Ryan 2017, "New information on Titanichthys (Placodermi, Arthrodira) from the Cleveland
  Shale (Upper Devonian) of Ohio, USA", Journal of Paleontology 91(2).
  https://www.cambridge.org/core/product/F9C6D35916E95652B86894AAF33D8DDF. Figure 1 is the head shield from above
  (four species), Figure 2 the head and trunk armour from the side, Figure 3 the head shield.
- **C2020:** Coatham, Vinther, Rayfield and Klug 2020, Royal Society Open Science 7:200272,
  https://doi.org/10.1098/rsos.200272, reported at
  https://www.sci.news/paleontology/titanichthys-suspension-feeder-08447.html. The lower jaw, and how it fed.

**What they print.**

| What | Figure |
|---|---|
| Head shield (CMNH 50319, not full grown) | greatest width given as 1116 mm (check it against the scale of Fig. 3). Length against width 0.50 to 0.54: about 0.6 m long. Twice as wide as long |
| Head shield, form | slightly arched, flat from above to below, of thin plates (1 to 10 mm). Its rear edge is hollowed out: a wide gap at the neck |
| Eyes | small. A ring of bone about 35 mm across with an opening of 13 mm (CMNH 5068) |
| Lower jaw | 610 to 683 mm long in these specimens, more than 1 m in large ones (C2020). Long, slender, without blades or teeth; the tip bends down by 39 degrees and inward by 28 |
| Upper jaw plates | tiny: 16 % of the lower jaw's length, half a millimetre thick |
| Median dorsal plate | 518 to 544 mm long and about as wide, deeply notched in front, with a keel of 152 mm beneath |
| How it fed | swimming with the mouth wide open, like a basking shark (C2020) |
| Length | "large (>5 m, adult size)" in BR2017, written before E2023. E2023 found the large armoured fish much shorter than thought and gives no figure here. The card says about 4 m, not certain: leave it |

**Not known:** everything behind the armour, the belly armour, the gape, the size of the mouth.

**So:** the head and the armour from BR2017 Fig. 1 and 2. This is a broad, flat head with a huge mouth, not a
Dunkleosteus with thin jaws. For the body behind it take the nearest relative with a whole body outline, the
Moroccan Amazichthys, which E2024 uses in the same way (a crescent tail with a large lower lobe; its pectoral fin
begins 0.231 TL behind the snout). Its paper is not read yet: see "Not checked yet".

## Cladoselache

**How to build it: `cladoselache-build.md`** (2026-11-19), with a tested mesh and shader in `ref/` and the
sources in `docs/research/devonian/cladoselache.md`.

**Sources.**

- **W:** Wikipedia, "Cladoselache", https://en.wikipedia.org/wiki/Cladoselache, section "Description". It carries
  photographs of whole skeletons (C. fyleri in New York and in Cincinnati) to measure the proportions on.
- **H1938:** Harris 1938, "The dorsal spine of Cladoselache", Scientific Publications of the Cleveland Museum of
  Natural History 8(1). https://www.archive.org/download/scientificpublic81clev/scientificpublic81clev.pdf. Plate I
  and figures 1 to 3 show the spine.
- **K2023:** Klug and others 2023, Swiss Journal of Palaeontology 142(1), https://doi.org/10.1186/s13358-023-00266-6.
  Open access. Maghriboselache, the one close relative, kept partly in the round, with a skeletal reconstruction
  from above and from the side. Use it for the shape of the head. Not read yet for this brief.
- Tomita 2015, Journal of Vertebrate Paleontology 35(5), the pectoral fin. Not read.

**What they print.**

| What | Figure |
|---|---|
| Length | the largest certain skeleton about 2.0 m (W). One specimen 145 cm to the base of the tail (H1938) |
| Body | slim and streamlined, like a mackerel shark (W) |
| Head | low, flat and box-like, like a frilled shark's. No long nose over the mouth: the mouth is at the front end (W) |
| Eyes | large, far forward, each with a ring of more than 20 small plates. Large nose capsules, also far forward (W) |
| Gill slits | five on each side (W) |
| Pectoral fins | large, long, with a wide base, three-cornered, right behind the gills (W) |
| Pelvic fins | small and low, about three times as long as high, far back on the belly (W) |
| Dorsal fins | two. The first over the pectoral fins, clearly the larger. The second over the pelvic fins (W) |
| Fin spine | one, in front of the first dorsal fin: stout and curved back. In an animal of over 2 m about 8 cm high, almost as long, 8 mm thick, standing "almost perpendicular to the body surface", sitting on the skin with no buried root, its front edge just ahead of the front edge of the pectoral fins (H1938) |
| Second spine | none found (H1938); still open (W) |
| Anal fin | none. Under the tail stalk six pairs of small rods swept forward, the first pair the largest (W) |
| Tail stalk | tapering, with a keel on each side: from above it looks almost rectangular (W) |
| Tail fin | a tall crescent on a narrow base. The backbone turns up almost 90 degrees into the upper lobe (W) |
| Claspers | never found (W) |
| Skin | mostly naked. Small blunt denticles only on the edges of the fins, around mouth and eyes and along the lateral line (W) |

**Measure** on the photographs of the whole skeletons: where each fin begins and ends along the body, the height of
both dorsal fins, the span of the tail, the depth of the body.

## Stethacanthus

**How to build it: `stethacanthus-build.md`** (2026-11-19), with a tested mesh and shader in `ref/` and the
sources in `docs/research/devonian/stethacanthus.md`.

**Sources.**

- **W:** Wikipedia, "Stethacanthus", https://en.wikipedia.org/wiki/Stethacanthus, and "Stethacanthidae".
- **CS2001:** Coates and Sequeira 2001, "A new stethacanthid chondrichthyan from the Lower Carboniferous of
  Bearsden, Scotland", Journal of Vertebrate Paleontology 21(3): 438-459. The most complete relative, Akmonistion,
  with a skeletal reconstruction. Only its abstract is read.
- Lund 1985, American Museum Novitates 2828 (free at the museum's digital library), and Zangerl 1984, Journal of
  Vertebrate Paleontology 4(3). Not read.

**What they print.**

| What | Figure |
|---|---|
| Length | S. altonensis about 1.5 m (W). **The card says about 1 m: tell Mario** |
| The crest | where the first dorsal fin would be, at the level of the pectoral fins: a spine that points backward, and on it a block shaped like an anvil or an ironing board. In Akmonistion "a brush-complex of up to 160% of neurocranial length" (CS2001) |
| Its top | flat, with up to nine rows of large denticles that point forward (W) |
| Top of the head | a patch of large denticles that point backward, facing those of the crest (W) |
| Who has it | grown males only. Not in young males; in females not known (W) |
| Pectoral fins | small, three-cornered, each with a long whip that trails back past the pelvic fins (W) |
| Second dorsal fin | present, without a spine (W, "Stethacanthidae") |
| Pelvic fins | males with claspers that end in clubs (W) |
| Tail | the backbone turns up sharply, the lower lobe is broad: close to symmetrical (CS2001) |
| Head | large eye sockets, small teeth (W) |
| Habit | paired fins small for its size, a slow swimmer (W, CS2001) |

**So:** build the male with the crest, and a second form without it for the rest, by the seed. **Measure** the
skeletal reconstruction of CS2001: the crest against the head and the body, where the fins sit, the tail.

## Ctenacanthus

**How to build it: `ctenacanthus-build.md`** (2026-11-19), with a tested mesh and shader in `ref/` and the
sources in `docs/research/devonian/ctenacanthus.md`.

The hardest one: of the sharks of this name from the Cleveland Shale mostly spines and teeth are published.

**Sources.**

- **OK:** Oceans of Kansas, "Ctenacanthus", https://oceansofkansas.com/ctenacanth.html, quoting Zangerl 1981.
- **DB:** "Ctenacanthus", https://dinosaursandbarbarians.com/2026/10/27/ctenacanthus/. A summary with page
  references to the older papers.
- **D:** Wikipedia, "Dracopristis", https://en.wikipedia.org/wiki/Dracopristis, after Hodnett and others 2021, New
  Mexico Museum of Natural History and Science Bulletin 84: 391-424. The most complete shark of this group, 87 to
  90 % of the skeleton with the outline of the body. It is more than 50 million years younger, and its flat body is
  read as that of a bottom dweller.

**What they print.**

| What | Figure |
|---|---|
| Body | fusiform (Zangerl 1981, in OK) |
| Fins | two dorsal fins, each with a spine in front of it; one anal fin (OK) |
| Spines | long, pointed, a little curved back, somewhat flattened from the sides; the tip stands out of the skin. Ribs run along the sides, set with small knobs like strings of beads; small hooks along the rear edge. The fin's front edge sits in a groove at the back of the spine (OK, DB) |
| Front spine against rear spine | 26 and 19 cm in one animal of about 1.6 m (OK); 57 and about 40 cm in Dracopristis of 2.06 m, the front one 0.27 TL (D) |
| Dracopristis as a guide | large dorsal fins, broad three-cornered pectoral fins, pelvic fins nearly as large, a small anal fin, a forked tail that looks small for the body; broad skull, eyes far forward, short snout; body long and flattened from above (D, DB) |
| Size | **sources disagree.** For C. concinnus of the Cleveland Shale an abstract of 2025 gives 4.1 m on average; DB works out about 1.9 m. The card says 1.8 m: leave it, and tell Mario |

**So:** a sturdy fusiform shark with the fins and the two large spines of the table. Take the proportions of the
fins from the skeleton figure of Hodnett and others 2021 (p. 409), but not its flat body: this one lives in open
water. Say in the comment that the body is an estimate.

## Kentuckia

**How to build it: `kentuckia-build.md`** (2026-11-19), with a tested mesh and shader in `ref/` and the sources in
`docs/research/devonian/kentuckia.md`. The card's 10 cm is now backed by KGS ("4 inches or less").

**Sources.**

- Dunkle 1964, "Preliminary description of a paleoniscoid fish from the Upper Devonian of Ohio", Scientific
  Publications of the Cleveland Museum of Natural History, new series 3(1), 16 pages, 3 plates. The description,
  with the fins and scales. Not found online.
- Giles and Friedman 2014, Journal of Paleontology 88(4): 636-651. Says that the fish probably does not belong to
  the genus Kentuckia.
- Igielman and others 2026, The Anatomical Record, https://anatomypubs.onlinelibrary.wiley.com/doi/10.1002/ar.70005
  (also https://pmc.ncbi.nlm.nih.gov/articles/PMC12882060/), section 3.4.8 and Figure 14: the lower jaw.

**What they print.** A lower jaw (CMNH 9562) 24 mm long, long and low, about a fifth as deep as long, with teeth
that get smaller towards the front. The fish is known from a few specimens, and parts of it were found inside
Cladoselache. Its length is in none of the sources read: the card's 10 cm is not verified.

**So:** find Dunkle 1964 (a library scan, or ask Mario). Until then build it as an early ray-finned fish in
general and say so in the comment. From Claude's knowledge, not checked: a slim spindle; a large eye far forward; a
long mouth that reaches back behind the eye; shiny diamond-shaped scales in slanting rows; one dorsal fin, set far
back; a forked tail whose upper lobe carries the scaled end of the body. Fish of this kind kept in the round are
Mimipiscis and Moythomasia from Gogo in Australia: look for a reconstruction of one of them.

## Concavicaris

**Source.** Jobbins, Haug and Klug 2020, "First African thylacocephalans from the Famennian of Morocco and their
role in Late Devonian food webs", Scientific Reports 10:5129. Open access.
https://epub.ub.uni-muenchen.de/90280/1/s41598-020-61770-0.pdf. Figure 2 is a 3D reconstruction from a scan, from
the front, from behind, from above and from the side. Figure 5 is a life reconstruction. A species from Morocco of
the same age, not the one from Ohio.

**What it prints.**

| What | Figure |
|---|---|
| Shell | 56 mm long, 26 mm high, 15 mm wide (the best specimen); from 27 mm to about 100 mm long. Highest in front of the middle |
| Outline | the back a broad arch; a pointed tip in front; under it a notch for the eye; the rear end cut off and gently rounded, no spine; a groove along the lower edge |
| Surface | smooth but for a fine net of many-sided cells |
| Eyes | large, about a seventh of the length of the body, with six-sided lenses, under the tip in the notch |
| Arms for catching | three pairs in animals of this group. Not kept in this species: in Fig. 5 drawn of middle size |
| Swimming legs | eight pairs of small paddles at the lower rear end |
| Gills | leaf-shaped, inside |
| How it lived | in the open water over a floor without oxygen. Not a fast swimmer |

**So:** the shell is narrow: its width is about a quarter of its length. Build it from Fig. 2 as two arched halves
with an edge, the eyes as faceted balls in the notch, the paddles moving.

## The ammonoid

Ammonoids are named among the invertebrates of the Cleveland Shale (Hannibal and others 2005,
https://gsa.confex.com/gsa/2005SE/webprogram/Paper83484.html), without a genus. So this is an ammonoid of its time
in general, and its card says no more than that.

**Sources for the animal.**

- Klug and Korn 2004, "The origin of ammonoid locomotion", Acta Palaeontologica Polonica 49(2): 235-242. Open
  access. https://www.app.pan.pl/archive/published/app49/app49-235.pdf. How the shell hung in the water and where
  its opening pointed.
- A life reconstruction of the Late Devonian Prolobites, Swiss Journal of Geosciences,
  https://sjg.springeropen.com/articles/10.1007/s00015-010-0036-y/figures/12. Its caption says that such
  reconstructions are largely guesswork, shows ten arms, and puts the opening at 40 to 50 degrees.

**So:** a coiled shell with the opening turned obliquely upward, ten short arms, a funnel below them. The soft
body is a guess, and the comment says so. Which shells of this age to copy is open: see "Not checked yet".

## Driftwood

The wood of Archaeopteris is called Callixylon, and Callixylon is recorded from the Cleveland Shale
(https://www.mindat.org/paleo_strat.php?id=12446). Trunks reached more than 1.5 m across (Wikipedia, "Callixylon",
https://www.wikipedia.org/wiki/Callixylon; the same figure in Meyer-Berthaud and Decombeix 2007,
https://arxiv.org/pdf/0704.2554, which gives a suspected height of 40 m). The trunk was wood like that of a
modern tree and bore side branches. The log of the card, 12 m long and 0.6 m thick, is well inside that.

**So:** a log with bark, the stumps and scars of branches, a broken end with wood grain, and growth on it: the
abstract of Hannibal and others names sea lilies and disc-shaped lamp shells that lived attached to floating
things.

## What to tell Mario

Found while reading, and his to decide:

- **Stethacanthus:** the card says about 1 m, Wikipedia gives about 1.5 m for S. altonensis.
- **Ctenacanthus:** the sizes in the sources run from 1.9 to 4.1 m.
- **Titanichthys:** no source read gives a length after 2023.
- **Kentuckia:** its length is not verified, and the genus name is doubted.
- **Dunkleosteus:** it has no row of gill slits, and the card may say more about its build now (as stout as a
  tuna, armour over nearly half the body).

## Rules that matter here

- **Sources first.** No animal is modelled before its notes are in `docs/research/devonian/` and its figures are
  in the comment at its mesh.
- **Sizes and card texts stay,** or change after a source that the hand-over names.
- **Every animal is a body:** all of that section of `CLAUDE.md`.
- **Nothing else changes:** `today` and the Cambrian render as before.
- **Pictures of others stay theirs.** Measure the published drawings; do not copy them into the repository.

## Acceptance criteria

1. Every animal has its notes under `docs/research/devonian/`, with the sources it read and what it measured.
2. Every mesh has a comment "in the round" with its figures in lengths of the body, each with its source or the
   word estimate.
3. Dunkleosteus matches the table above within a tenth, where the table gives a figure.
4. Every animal has a turntable before and after, and in none of its views does the visual critic call it flat,
   a cut-out, or a toy.
5. Shown side by side with the drawing it was measured on, each animal is recognised as the same animal.
6. The hand-over lists what is still an estimate and what was found to differ from the cards.
7. The benchmark of the Devonian is within the limits. `today` and the Cambrian are unchanged.

## Verification

Both gates of `CLAUDE.md`. For the visual critic: the turntable of each animal, and for each a second question next
to the one about flatness: here is the published reconstruction, is this the same animal, and where does it
differ?

## Not checked yet

- All numbers above: taken from the text of the sources by a tool, not from the pages as printed.
- Amazichthys (the body for Titanichthys): as Claude remembers it, Jobbins and others 2022, Frontiers in Ecology
  and Evolution, with the whole outline of the body. Find it and read it.
- Maghriboselache (K2023), Tomita 2015, Lund 1985, Zangerl 1984, Hodnett and others 2021: named, not read.
- Dunkle 1964: not found online.
- Whether S. altonensis itself is the species of the Cleveland Shale.
- Which ammonoids are known from the Cleveland Shale or from rocks of its age nearby.
- Kentuckia as described in its section: from Claude's knowledge.
