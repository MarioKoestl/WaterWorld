// ============================================================================
// ordovician: the zoo texts
// ============================================================================
// Zoo texts: one entry per kind of exhibit. name, sub and text are shown as they are, facts are [label, value] rows.
// size is the largest measure in metres, for the size picture of the card. Sources for each entry are listed above
// it once the facts are checked; see docs/briefs/era-ordovician.md for which are checked and which are not yet.
// The texts are those of the brief. The exhibits are not yet in the world: stage 1 is the place and its light.
const ZOO = {
  // Wikipedia, "Endoceras" (https://en.wikipedia.org/wiki/Endoceras): a specimen of E. giganteum measures 3 m as
  // preserved, 2015 estimate puts the complete shell at about 5.73 m; 9.1 m never confirmed. Wikipedia,
  // "Endocerida" (https://en.wikipedia.org/wiki/Endocerida): possibly top hunters, close to the sea floor
  endoceras: {
    name: 'Endoceras', sub: 'Endoceras giganteum · giant relative of squid and nautilus', size: 5.7,
    facts: [['Shell', 'up to about 5.7 m long'], ['Longest piece found', '3 m'], ['Hunted', 'probably close to the sea floor']],
    text: 'The largest animal of its time, and perhaps the first giant of all: a relative of the squid in a straight shell longer than a car. The longest piece ever found measures 3 m, and it is only part of a shell. Its owner probably hunted trilobites and other animals of the sea floor.',
  },
  orthocones: {
    name: 'Straight-shelled cephalopods', sub: 'small relatives of the giant', size: 0.4,
    facts: [['Shell', '15 to 40 cm long'], ['Moved by', 'squirting water'], ['Living relative', 'the nautilus']],
    text: 'The shell is a row of chambers filled with gas. They carry the animal like a diving tank, and it lives only in the last and widest one. To move, it squirts water out of a tube. Squid still swim like that. The nautilus is the last animal that still carries such a shell.',
  },
  isotelus: {
    name: 'Trilobite', sub: 'Isotelus · a giant among trilobites', size: 0.4,
    facts: [['Length', 'up to about 40 cm'], ['Largest relative', 'over 70 cm, found in Canada'], ['Shell', 'shed again and again as it grew']],
    text: 'Most trilobites would fit in your hand. This one is as long as your forearm, and a relative from the same time reached more than 70 cm, the largest complete trilobite ever found. It ploughed through the mud for food. The ice age at the end of the Ordovician wiped out most of its kind.',
  },
  // Wikipedia, "Megalograptus" (https://en.wikipedia.org/wiki/Megalograptus): 49 to 78 cm. Brown and black, this
  // species darkest. Blades under the tail spike that could grasp. Ohio Geological Survey, GeoFacts 34 (Peter 2021,
  // https://dam.assets.ohio.gov/image/upload/ohiodnr.gov/documents/geology/GF34_Peter_2021.pdf): labelled drawing;
  // coprolite with remains of Isotelus
  megalograptus: {
    name: 'Sea scorpion', sub: 'Megalograptus · an early sea scorpion', size: 0.78,
    facts: [['Length', 'up to 78 cm'], ['Colour', 'brown and black, read from the fossils'], ['Tail', 'a spike between two grasping blades']],
    text: 'Sea scorpions are new in this sea. They are not true scorpions, but relatives of them, and of spiders and horseshoe crabs. This one swept the floor with two long, spiny arms, like a rake. Droppings found with it hold pieces of trilobites, and of its own kind. Later relatives will become the largest arthropods that ever lived.',
  },
  crinoid: {
    name: 'Sea lilies', sub: 'animals, not flowers', size: 1,
    facts: [['Height', '30 cm to 1 m'], ['Relatives', 'starfish and sea urchins'], ['Food', 'caught from the passing water']],
    text: 'A stalk, a cup and a crown of feathery arms: it looks like a flower and is a relative of the starfish. The arms spread into a bowl against the current and pass food down to the mouth in the middle. Whole meadows of them stood in this sea. A few hundred kinds still live in the oceans today.',
  },
  // Digital Atlas of Ordovician Life, "Grewingkia canadensis"
  // (https://www.ordovicianatlas.org/atlas/cnidaria/anthozoa/rugosa/streptelasmatidae/grewingkia/grewingkia-canadensis/):
  // "reaching lengths in excess of 13cm", straight or slightly curved, strongly ringed, 100+ walls
  horncoral: {
    name: 'Horn coral', sub: 'a single polyp in a horn of stone', size: 0.13,
    facts: [['Length', 'up to 13 cm'], ['Lives', 'alone, not in a colony'], ['Its group', 'died out 252 million years ago']],
    text: 'One animal like a small sea anemone sits in the open end of each horn and builds it longer as it grows. The fine lines on the outside are growth lines, something like the rings of a tree. These corals are not the ancestors of the corals of today: their whole group has died out.',
  },
  bryozoan: {
    name: 'Moss animals', sub: 'colonies of thousands', size: 0.15,
    facts: [['Twigs', '5 to 15 cm'], ['Each animal', 'smaller than a millimetre'], ['First appear', 'in the Ordovician']],
    text: 'Every pinprick in these stony twigs is the home of one tiny animal with a crown of tentacles. Thousands of them build a colony together. Moss animals are the one large group of animals that does not go back to the Cambrian: they appear here, in the Ordovician, and are still common.',
  },
  brachiopod: {
    name: 'Lamp shells', sub: 'brachiopods · not clams', size: 0.05,
    facts: [['Width', '2 to 5 cm'], ['Halves of the shell', 'top and bottom, not left and right'], ['Today', 'rare']],
    text: 'They look like clams and are not related to them. A clam has a left and a right shell, a lamp shell an upper and a lower one, and inside it a coiled, feathery arm that filters the water. In this sea they pave the floor. Today clams have taken their place almost everywhere.',
  },
  graptolite: {
    name: 'Graptolites', sub: 'drifting colonies', size: 0.1,
    facts: [['Length', '2 to 10 cm'], ['Each tooth of the saw', 'the home of one tiny animal'], ['Used for', 'telling the age of rocks']],
    text: 'Each blade is a colony: every tooth of the saw is a little cup with one animal in it. They drifted through all the oceans and changed their shapes quickly over time. So a geologist who finds one can tell how old the rock is, almost anywhere in the world.',
  },
  // Wikipedia, "Astraspis" (https://en.wikipedia.org/wiki/Astraspis): 8 gill openings each side, about 200 mm,
  // large eyes, oval cross-section. Sansom and others 1997 (https://palass.org/publications/palaeontology-journal/archive/40/3/article_pp625-643):
  // dorsal headshield of polygonal tesserae with star-shaped or smooth bumps; Harding Sandstone, Colorado
  astraspis: {
    name: 'Astraspis', sub: 'Astraspis desiderata · an early fish in armour', size: 0.2,
    facts: [['Length', 'about 20 cm'], ['Armour', 'small plates of bone'], ['Jaws', 'none']],
    text: 'One of the first animals with bone. It carries it on the outside, as a shield of small plates over head and chest. It has no jaws and no fins except its tail, so it could neither bite nor steer well. All the same, this is your side of the family: an early fish.',
  },
  // The shelf is a backdrop: named where nothing else is looked at
  shelf: {
    name: 'The shelf', sub: 'a warm shallow sea over North America',
    facts: [['Depth', '10 to 25 m'], ['Floor', 'pale lime mud and grey limestone'], ['Age', 'about 450 million years']],
    text: 'A wide, warm sea covers most of this continent. The floor is lime mud laid down over millions of years, with harder beds of limestone showing through where the mud is thin. Storms stir the floor again and again and sweep the shells together.',
  },
};
