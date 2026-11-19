// ============================================================================
// devonian: the zoo texts
// ============================================================================
// Zoo texts: one entry per kind of exhibit. Sources next to each entry as comments once the facts are checked.
// See era-common.md, "Facts and sources". All facts below are from the brief and not yet checked against sources.
const ZOO = {
  kentuckia: {
    name: 'Ray-finned fish', sub: 'Kentuckia \xb7 small, and the future', size: 0.10,
    facts: [['Length', 'about 10 cm'], ['Fins', 'skin stretched over fine rays of bone'], ['Its group today', 'about half of all species with a backbone']],
    text: 'Small, plain and easy to overlook between the giants in armour. But the armoured fish will be gone at the end of this era, every one of them, and fish like this will inherit the water. Their group, the ray-finned fishes, makes up about half of all species with a backbone today.',
  },
  // Sources: Carr 2010 (Cleveland Shale ray-finned fish); Friedman 2015 ("approximately half of all living
  // vertebrate species"). Size corrected from brief's 12 cm to 10 cm (complete specimens are <=10 cm)
  concavicaris: {
    name: 'Concavicaris', sub: 'a small arthropod in a folded shell', size: 0.06,
    facts: [['Length', 'about 6 cm'], ['Shell', 'folded around the body'], ['Role here', 'food for almost everyone']],
    text: 'Swarms of these small arthropods feed this sea. Each sits in a shell that is folded around its body, with large eyes at the front. Fossil sharks from this mud have been found with them in their stomachs. Their group lived for more than 300 million years and then died out.',
  },
  // Not checked yet: Concavicaris 6 cm; found in shark stomachs; how long its group lived
  goniatite: {
    name: 'Ammonoid', sub: 'an early relative of the ammonites', size: 0.08,
    facts: [['Shell', '3 to 8 cm across'], ['First appear', 'in the Devonian'], ['Die out', 'together with the dinosaurs']],
    text: 'A relative of the squid in a coiled shell. The straight shells of earlier seas have rolled up, which makes a compact body that turns easily. These are the first of their line. Their descendants, the ammonites, will fill the seas for 300 million years and vanish together with the dinosaurs.',
  },
  // Not checked yet: first ammonoids in the Devonian; 300 million years
  cladoselache: {
    name: 'Cladoselache', sub: 'Cladoselache \xb7 an early shark', size: 1.8,
    facts: [['Length', 'up to about 1.8 m'], ['Build', 'slim, with a forked tail'], ['Skeleton', 'cartilage, as in all sharks']],
    text: 'Sharks are older than the dinosaurs by more than 100 million years, and this is one of the first that is known well. The black mud of this sea kept not only its teeth, but the outline of its body, traces of its muscles and even its last meals: mostly small fish.',
  },
  // Not checked yet: Cladoselache body preserved in the Cleveland Shale
  stethacanthus: {
    name: 'Anvil shark', sub: 'Stethacanthus \xb7 a shark with a brush on its back', size: 1,
    facts: [['Length', 'about 1 m'], ['On its back', 'a flat-topped fin covered in small teeth'], ['What for', 'unknown']],
    text: 'Where other sharks carry a fin, this one has something like an anvil, with a patch of small teeth on top and another on its head. Nobody knows what it was for. Because not every animal had one, most researchers think it served to impress a rival or to win a mate.',
  },
  // Not checked yet: Stethacanthus 1 m, the structure, that not every animal had it
  ctenacanthus: {
    name: 'Spine shark', sub: 'Ctenacanthus \xb7 a shark with fin spines', size: 1.8,
    facts: [['Length', 'about 1.8 m'], ['Back fins', 'two, each with a ribbed spine'], ['What is usually found', 'teeth and spines only']],
    text: 'A shark has no bones. Its skeleton is cartilage, which rots away. What remains are teeth, scales and spines: this shark carried a long, ribbed spine in front of each back fin. For most early sharks such hard parts are all that is known. In this black mud whole bodies were kept.',
  },
  // Not checked yet: Ctenacanthus 1.8 m (corrected from 1.5 m), the spines
  dunkleosteus: {
    name: 'Dunkleosteus', sub: 'Dunkleosteus terrelli \xb7 a hunter in armour', size: 4.1,
    facts: [['Length', 'about 3.4 m, the largest about 4.1 m'], ['Armour', 'bone plates on head and chest'], ['Teeth', 'none: blades of bone']],
    text: 'The top hunter of its sea. It has no teeth: its jaw bones are blades. Only the armour of head and chest becomes a fossil, so its length was long a guess, and books said up to 10 m. A study of 2023 compared a thousand kinds of fish and found about 4 m, stout as a tuna.',
  },
  // Not checked yet: Dunkleosteus 3.4-4.1 m (Engelman 2023), blades not teeth, stout body
  titanichthys: {
    name: 'Titanichthys', sub: 'Titanichthys \xb7 a giant without a bite', size: 4,
    facts: [['Length', 'about 4 m, not certain'], ['Jaws', 'long and thin, without blades'], ['Food', 'probably plankton']],
    text: 'As large as Dunkleosteus, and harmless. Its long, thin jaws have no cutting edge. It probably swam with its mouth wide open and strained small animals out of the water, as basking sharks do today. It may be the earliest giant with a backbone that lived this way.',
  },
  // Not checked yet: Titanichthys ~4 m, filter feeding (Boyle & Ryan 2017), earliest filter-feeding vertebrate giant
  driftwood: {
    name: 'Driftwood', sub: 'a trunk of Archaeopteris, the first tree', size: 12,
    facts: [['This log', '12 m long'], ['The living tree', 'up to about 30 m tall'], ['Leaves', 'like fern fronds']],
    text: 'A tree trunk far out at sea: a river has washed it here. Until this era the land had no forests. Archaeopteris is among the first trees with real wood and deep roots, and it now spreads over the continents. Roots break rock into soil, and rivers carry it into the sea, where it feeds the algae.',
  },
  // Not checked yet: Archaeopteris as one of the first trees, its height, logs in this shale
  floor: {
    name: 'The black floor', sub: 'a sea floor without air',
    facts: [['Oxygen down here', 'none'], ['Lives here', 'nothing'], ['Becomes', 'black shale']],
    text: 'Nothing crawls on this mud and nothing digs in it. Algae bloom in the light above, die, sink and rot, and the rotting uses up the oxygen of the deep water. Whatever dies sinks into the black ooze untouched. Seas like this spread at the end of the Devonian, and most kinds of sea animals die out.',
  },
};
