// ============================================================================
// cambrian: the zoo texts
// ============================================================================
// Zoo texts: one entry per kind of exhibit. name, sub and text are shown as they are, facts are [label, value] rows
// (the card has room for three). size is the largest measure of the exhibit in metres, for the size picture of the
// card (docs/briefs/scale.md); the wall has none, so its card shows no picture. The sources of an entry are listed
// above it, checked on 2026-11-15. Do not add or change a fact without a source. The texts and sizes are those of
// docs/briefs/era-cambrian.md.
const ZOO = {
  // Wikipedia, "Anomalocaris": up to 37.8 cm without frontal appendages and tail fan (the older figure of 1 m is
  // unlikely), 13 pairs of trunk flaps, swam by undulating them, first described in 1892 and understood in 1985
  //   https://en.wikipedia.org/wiki/Anomalocaris
  // National Geographic: compound eyes on stalks with 16,000 lenses, circular mouth, hunted soft prey in open water,
  // arms held forward
  //   https://www.nationalgeographic.com/premium/article/was-this-prehistoric-killer-shrimp-as-fierce-as-it-looked
  // Deposits Magazine: arm mistaken for a shrimp, mouth for a jellyfish
  //   https://depositsmag.com/2026/04/15/the-weird-and-wonderful-of-the-cambrian-part-2-anomalocaris-apex-predator-of-the-cambrian-seas/
  anomalocaris: {
    name: 'Anomalocaris', sub: 'Anomalocaris canadensis · early relative of the arthropods', size: 0.38,
    facts: [['Length', 'about 38 cm without arms and tail'], ['Swims with', 'rows of flaps along its sides'], ['Eyes', 'on stalks, with thousands of lenses']],
    text: 'One of the largest animals of its time and one of the first top hunters. It swam by rippling the flaps along its body and grabbed prey with the two spiny arms in front of its round mouth. For almost a century its parts were taken for separate animals: the arm for a shrimp, the mouth for a jellyfish.',
  },
  // Wikipedia, "Opabinia": 4 to 7 cm without the proboscis, the audience laughed, probably searched the sediment
  // with the proboscis. The five eyes and the claw were checked in the article itself on 2026-11-16: "The head bore
  // five stalked eyes", and the proboscis "ended with a claw-like structure" (the article adds that two authors of
  // 2011 see no claws at its end). Also from there, for the shape: 15 segments, each with a pair of flaps pointing
  // down and out, three pairs of tail blades pointing up and out, the proboscis a third as long as the body
  //   https://en.wikipedia.org/wiki/Opabinia
  opabinia: {
    name: 'Opabinia', sub: 'Opabinia regalis · early relative of the arthropods', size: 0.07,
    facts: [['Length', '4 to 7 cm without the trunk'], ['Eyes', 'five'], ['Trunk', 'one, with a claw at the tip']],
    text: 'Five eyes on top of the head and a long, bendable trunk that ends in a claw: when this animal was first presented to scientists, the audience laughed. It probably searched the mud for food with its trunk. Like its larger relative Anomalocaris it had a row of flaps along each side.',
  },
  // University of Cambridge and Sci.News: 10 to 50 mm, reconstructed upside down and back to front, head found in 2015
  // with a pair of simple eyes and a ring of teeth, seven pairs of clawed legs, three pairs of tentacles, pairs of long
  // spines, relative of velvet worms, lived on the sea floor
  //   https://www.cam.ac.uk/research/news/newly-discovered-ring-of-teeth-helps-determine-what-common-ancestor-of-moulting-animals-looked-like
  //   https://www.sci.news/paleontology/science-hallucigenia-cambrian-worm-like-creature-02949.html
  hallucigenia: {
    name: 'Hallucigenia', sub: 'Hallucigenia sparsa · relative of the velvet worms', size: 0.05,
    facts: [['Length', '1 to 5 cm'], ['Back', 'pairs of long spines'], ['Legs', 'seven pairs, each ending in claws']],
    text: 'So strange that it was first put together upside down and back to front: its spines were taken for legs and its legs for tentacles. Only in 2015 did researchers find its real head, with a pair of simple eyes and a ring of teeth around the mouth. It lived on the sea floor.',
  },
  // Wikipedia, "Marrella": 2.4 to 24.5 mm, most common animal of the Burgess Shale, over 25,000 specimens, first
  // fossil Walcott collected there in 1909, "lace crab", neither trilobite nor crustacean, two pairs of long spines on
  // the head shield. Its group is known up to the Devonian
  //   https://en.wikipedia.org/wiki/Marrella
  marrella: {
    name: 'Marrella', sub: 'Marrella splendens · the lace crab', size: 0.025,
    facts: [['Length', 'up to 2.5 cm'], ['Fossils found', 'more than 25,000'], ['Head', 'two pairs of long spines that sweep back']],
    text: 'The most common animal of the Burgess Shale, and the first fossil that Charles Walcott collected there in 1909. He called it the lace crab. It is neither a crab nor a trilobite: it belongs to a branch of the arthropods that died out long ago.',
  },
  // Harvard University, Department of Organismic and Evolutionary Biology, and EurekAlert: more than 22,000 species,
  // fewer than 0.2 % with any trace of legs, antennae and limbs preserved, walked and burrowed, each leg with a gill
  //   https://www.oeb.harvard.edu/news/2025/08/ancient-arthropods-move-unraveling-secret-steps-burgess-shale-trilobites
  //   https://www.eurekalert.org/news-releases/1093536
  // Wikipedia, "Olenoides", read through Wikiwand: up to 9 cm, seven body segments, spines on the tail piece
  //   https://www.wikiwand.com/en/articles/Olenoides
  olenoides: {
    name: 'Trilobite', sub: 'Olenoides serratus · arthropod with a hard shell', size: 0.09,
    facts: [['Length', 'up to 9 cm'], ['Legs', 'jointed, each with a gill'], ['Trilobite species known', 'more than 22,000']],
    text: 'Trilobites left fossils all over the world, because their hard shells are easily preserved. Their soft legs almost never are: fewer than one species in 500 shows any trace of them. This one is an exception. Its fossils keep antennae and legs, so we know that it walked and dug on the sea floor.',
  },
  // Royal Ontario Museum, "A Fish With a Big Bang": the only fish among more than 200 species of the Burgess Shale,
  // about 6 cm
  //   https://www.rom.on.ca/blogs/fish-big-bang
  // ScienceDaily: large eyes, active swimmer, gill arches in pairs
  //   https://www.sciencedaily.com/releases/2014/06/140611131743.htm
  // Phys.org: seven pairs of gill arches, the front pair hinting at jaws
  //   https://phys.org/news/2014-06-oldest-fish-world-million-years.pdf
  // Oceanbites: no fins
  //   https://oceanbites.org/a-jaw-dropping-cambrian-fish/
  // The stiff rod is the notochord of the paper's abstract (Conway Morris and Caron, Nature 2014)
  metaspriggina: {
    name: 'Metaspriggina', sub: 'Metaspriggina walcotti · one of the first fish', size: 0.06,
    facts: [['Length', 'about 6 cm'], ['Eyes', 'two, large'], ['Jaws and fins', 'none yet']],
    text: 'One of the oldest fish known, and a very distant relative of yours. It already had a head with two eyes and a stiff rod along its back, where a backbone would later form. It had no jaws. But the first of its seven pairs of gill bars was thicker than the rest: a first step towards them.',
  },
  // Royal Ontario Museum and Phys.org: oldest swimming jellyfish, about 95 % water, able to catch sizeable prey
  //   https://www.rom.on.ca/news-releases/royal-ontario-museum-researchers-identify-oldest-known-species-swimming-jellyfish
  //   https://phys.org/news/2023-08-oldest-species-jellyfish.html
  // Abstract of Moon, Caron and Moysiuk, Proceedings of the Royal Society B 2023: 182 fossils, bell up to 20 cm high,
  // over 90 short tentacles, width about 40 % of the height
  //   https://novataxa.blogspot.com/2023/08/burgessomedusa.html
  burgessomedusa: {
    name: 'Jellyfish', sub: 'Burgessomedusa phasmiformis · oldest known swimming jellyfish', size: 0.2,
    facts: [['Bell', 'up to 20 cm high'], ['Tentacles', 'more than 90, short'], ['Named', '2023']],
    text: 'A jellyfish is about 95 percent water, so it almost never turns into a fossil. This one did, 182 times. Bell and tentacles show that large jellyfish already swam and caught prey in the Cambrian sea, more than 500 million years ago.',
  },
  // Ehrlich and others, Scientific Reports 2013: chitin 505 million years old, the oldest found
  //   https://www.nature.com/articles/srep03497
  // Rigby, Geological Survey of Greenland: branching, the most common sponge of the Burgess Shale
  //   https://geusjournals.org/index.php/rapggu/article/download/7964/13834/42697
  // Wikipedia, "Vauxia": skeleton of spongin, feeds by filtering
  //   https://en.wikipedia.org/wiki/Vauxia
  // Not verified: its height. The world assumes 8 cm
  vauxia: {
    name: 'Vauxia', sub: 'Vauxia gracilenta · branching sponge', size: 0.08,
    facts: [['Kind', 'sponge, an animal'], ['Skeleton', 'tough, bendable fibres'], ['Food', 'filtered from the water']],
    text: 'Not a plant, although it grows like a little bush: it is a sponge, the most common one in the Burgess Shale. In its fossils researchers found chitin, the material that also stiffens the shells of insects and crabs. At 505 million years it is the oldest chitin found so far.',
  },
  // O'Brien and Caron, PLOS ONE 2012: at least 20 cm, cup on a stalk with a small holdfast, six openings, 1,133
  // specimens, lived in clusters, relatives not known
  //   https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3261148/
  // ScienceDaily: tulip shape, filter feeding
  //   https://sciencedaily.com/releases/2012/01/120118173659.htm
  siphusauctum: {
    name: 'Tulip animal', sub: 'Siphusauctum gregarium · an animal on a stalk', size: 0.2,
    facts: [['Height', 'about 20 cm'], ['Lives', 'in crowds'], ['Relatives', 'unknown']],
    text: 'It looks like a flower but is an animal. The cup on top of the stalk took in water through six openings and filtered food out of it. More than 1,100 fossils were found, many of them side by side: these animals stood in dense fields. Which animals of today are its relatives, nobody knows for sure.',
  },
  // US National Park Service, "Cambrian Period": enormous algal reef with a vertical escarpment several hundred feet
  // high (the card turns that into "roughly 100 m"), bare land, no land plants
  //   https://home.nps.gov/articles/000/cambrian-period.htm
  // UC Museum of Paleontology, "Cambrian: Tectonics and Paleoclimate": no plants, land without vegetation
  //   https://ucmp.berkeley.edu/cambrian/cambtect.html
  // O'Brien and Caron, PLOS ONE 2012 (above): numerous algae at the site of the tulip animal
  // Not verified: which kinds of algae, and their size. The world shows tufts of 1 to 8 cm
  algae: {
    name: 'Algae', sub: 'the only plants of the Cambrian', size: 0.08,
    facts: [['On land', 'nothing grows yet'], ['In the sea', 'algae']],
    text: 'There are no trees and no grass in this world, anywhere. Plants have not yet left the water, and the land is bare rock and mud. In the sea, algae do the work of plants. They even built the giant wall beside this basin: a reef roughly 100 m high.',
  },
  // US National Park Service, "Cambrian Period" (above): the wall and the mudslides
  // Royal Ontario Museum, "A Fish With a Big Bang": more than 200 species, more than 200,000 specimens since 1909
  //   https://www.rom.on.ca/blogs/fish-big-bang
  // Harvard University, Department of Organismic and Evolutionary Biology: burial that cut off the oxygen
  //   https://www.oeb.harvard.edu/news/2025/08/ancient-arthropods-move-unraveling-secret-steps-burgess-shale-trilobites
  // CBC, The Nature of Things: found in 1909 by Charles Walcott, animals trapped by an underwater landslide
  //   https://www.cbc.ca/natureofthings/m_features/meet-the-weird-wacky-and-wonderful-creatures-that-lived-in-cambrian-seas-ov
  wall: {
    name: 'The great wall', sub: 'a reef, and the reason we know these animals',
    facts: [['Fossils collected', 'more than 200,000'], ['Species', 'more than 200'], ['First found', '1909, by Charles Walcott']],
    text: 'From time to time mud slid down this wall and buried everything at its foot within moments. Sealed in, without air, even soft bodies turned into fossils: eyes, guts, legs, jellyfish. That is why we know the animals around you so well, half a billion years later.',
  },
};
