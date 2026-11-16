// ============================================================================
// today: the zoo texts
// ============================================================================
// Zoo texts: one entry per kind of exhibit. name, sub and text are shown as they are, facts are [label, value] rows
// (the card has room for three). The sources of an entry are listed above it, checked on 2026-11-15. Do not add or
// change a fact without a source.
const ZOO = {
  // NOAA National Marine Sanctuaries, photo gallery "Giant kelp": growth of 50 to 60 cm a day, gas-filled floats
  //   https://sanctuaries.noaa.gov/pgallery/pgchannel/living/living_9.html
  // Oceana, Marine Life Encyclopedia, "Giant Kelp": not a plant, holdfast, 30 m on average and up to 53 m, animals in
  // and near kelp forests
  //   https://oceana.org/?p=16450
  kelp: {
    name: 'Giant kelp', sub: 'Macrocystis pyrifera · brown alga',
    facts: [['Grows', 'up to 60 cm a day'], ['Length', 'about 30 m, up to 53 m'], ['Holds on with', 'a holdfast, not roots']],
    text: 'Not a plant but a giant brown alga. Gas-filled floats lift its blades towards the light, and in good conditions it grows up to 60 cm in a single day. Sharks, fish, lobsters and squid live in and around kelp forests.',
  },
  // Hawaii Division of Aquatic Resources, "Giant Oceanic Manta Ray", citing NOAA Fisheries: largest ray, wingspan up
  // to 26 feet (7.9 m), spot pattern used to tell animals apart
  //   https://dar.hawaii.gov/?p=8174
  // NOAA Fisheries via Sail-World: filter feeder, biggest brain of any fish. It gives 29 feet for the wingspan, so
  // "about 8 m" is the cautious figure
  //   https://www.sailworldcruising.com/news/248581/New-study-about-where-giant-manta-rays-go-and-why
  // Shark Angels, "The Manta Ray": feeds gliding with its mouth open, belly markings differ from animal to animal
  //   https://sharkangels.org/manta-ray/
  manta: {
    name: 'Giant manta ray', sub: 'Mobula birostris · ray',
    facts: [['Wingspan', 'up to about 8 m'], ['Food', 'plankton, filtered from the water'], ['Brain', 'the largest of any fish']],
    text: 'The largest ray in the world eats some of the smallest food: plankton, which it filters from the water as it glides along with its mouth open. Mantas have the largest brain of any fish. The pattern of spots on the belly is different on every animal, like a fingerprint.',
  },
  // Wikipedia, "Shoaling and schooling": defence through earlier detection of predators and a smaller chance for each
  // fish of being caught, energy saving probable but disputed
  //   https://en.wikipedia.com/wiki/Shoaling
  fish: {
    name: 'School of fish', sub: 'many fish moving as one',
    facts: [['Why', 'safety in numbers']],
    text: 'Hundreds of fish that turn together are hard to attack: a hunter struggles to pick out a single one, and with so many eyes on watch, danger is spotted early. Swimming in formation may also save energy, although researchers still argue about that.',
  },
  // NOAA National Centers for Coastal Ocean Science: redwoods of the reef, up to about 6 feet tall, more than 2,000
  // years old
  //   https://coastalscience.noaa.gov/?p=46711
  // Oceana, "Giant Barrel Sponge": filter feeding, ages are estimates
  //   https://oceana.org/marine-life/giant-barrel-sponge/
  sponge: {
    name: 'Giant barrel sponge', sub: 'Xestospongia muta · sponge, an animal',
    facts: [['Age', 'more than 2,000 years (estimated)'], ['Height', 'up to 1.8 m'], ['Food', 'tiny particles, filtered from the water']],
    text: 'A sponge is an animal, even though it never moves. It draws seawater in through its walls and filters out tiny bits of food. Giant barrel sponges grow slowly and are called the redwoods of the reef: the largest are estimated to be more than 2,000 years old.',
  },
  // NOAA Fisheries, "Corals": animals, polyps, relatives, colonies of hundreds to hundreds of thousands, reefs over
  // thousands of years, under one percent of the ocean floor and about 25 percent of marine creatures
  //   https://fisheries.noaa.gov/corals
  coral: {
    name: 'Coral', sub: 'a colony of tiny animals',
    facts: [['Made of', 'hundreds to hundreds of thousands of polyps'], ['Relatives', 'jellyfish and sea anemones'], ['Reefs', 'under 1 % of the sea floor, home to 25 % of sea life']],
    text: 'What looks like a bush or a fan is a colony of tiny soft animals called polyps, relatives of jellyfish and sea anemones. Hard corals build limestone skeletons that grow into reefs over thousands of years. Reefs cover less than one percent of the ocean floor but support about a quarter of all marine creatures.',
  },
  // Scientific American, "Pregnant Plesiosaur Fossil Suggests the Sea Reptile Cared for Its Young", and NBC News, both
  // on O'Keefe and Chiappe, Science 2011: marine reptile, 78 million years old, live birth, one large young, four
  // wing-shaped flippers, predator while dinosaurs lived on land
  //   https://www.scientificamerican.com/article/pregnant-plesiosaur-fossil/
  //   https://www.nbcnews.com/news/amp/wbna44112861
  // Not verified: "until 66 million years ago" is the usual date for the end of the Cretaceous, from general knowledge
  plesiosaur: {
    name: 'Plesiosaur', sub: 'Plesiosauria · extinct marine reptile',
    facts: [['Lived', 'in the age of dinosaurs, until 66 million years ago'], ['Swam with', 'four flippers'], ['Young', 'born alive, one large baby']],
    text: 'Not a dinosaur but a reptile of the sea, a hunter in the water while dinosaurs ruled the land. It beat its four wing-shaped flippers to fly through the water. A 78-million-year-old fossil of a mother with her unborn young shows that plesiosaurs gave birth to live young instead of laying eggs on land.',
  },
  // NOAA digital library, "Humpback whale flukes": single whales are told apart by the black and white pattern under
  // the flukes
  //   https://noaa.gov/media/78257
  // NOAA Fisheries news release of 2007-05-14: one whale identified over 35 years
  //   https://webarchive.library.unt.edu/eot2008/20080916143814/http://www.fakr.noaa.gov/newsreleases/2007/humpback.htm
  fluke: {
    name: 'The stone whale tail', sub: 'a sculpture of a fluke',
    facts: [['Real name', 'fluke'], ['On a humpback', 'its underside is unique, like a fingerprint']],
    text: 'This one is made of stone, but it shows the tail of a whale, called a fluke. On a humpback whale the black and white pattern on the underside is different on every animal. Researchers photograph flukes to recognise single whales. One humpback was identified again 35 years after it was first photographed.',
  },
  // Avery Paxton (NOAA), "Shipwrecks teem with underwater life, from microbes to sharks": about three million wrecks,
  // microbes first, then sponges and corals, small fish in the cracks, fish within minutes
  //   https://discovermagazine.com/the-sciences/shipwrecks-teem-with-underwater-life-from-microbes-to-sharks
  ship: {
    name: 'Shipwreck', sub: 'a new home for sea life',
    facts: [['Wrecks worldwide', 'about three million (estimated)']],
    text: 'A sunken ship does not stay empty. First a thin layer of microbes coats it, then sponges and corals settle on the hard surfaces. Small fish hide in its cracks while larger hunters patrol around it. Fish sometimes arrive within minutes of a ship going down.',
  },
};
