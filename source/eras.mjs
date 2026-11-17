// The eras of Historic Ocean, oldest first: id, name, from and to in million years ago.
//
// This is the one list of eras. build.mjs puts it into every page as the timeline of the title menu, and marks an era
// as built when a folder eras/<id> exists. The first three are eons, the rest are periods: the periods before the
// Cambrian would make the list twice as long and say little to a visitor. One of them has an entry of its own, the
// Ediacaran, the last period before the Cambrian (Mario, 2026-11-15): the entry Proterozoic stands for the time before
// it. `today` stands for the Quaternary.
//
// Names and dates: International Commission on Stratigraphy, International Chronostratigraphic Chart v2024/12
// (https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf), the boundaries from the Cambrian to the Cretaceous
// also as a list from the University of Maryland (https://geol.umd.edu/~tholtz/G102/geocolumn2025.pdf). Checked on
// 2026-11-15; the Ediacaran (the chart gives its base as ~635) and the Cambrian (538.8 ± 0.6) again on 2026-11-16.
// Check the chart again before changing a number.
export default [
  ['hadean', 'Hadean', 4567, 4031],
  ['archean', 'Archean', 4031, 2500],
  ['proterozoic', 'Proterozoic', 2500, 635],
  ['ediacaran', 'Ediacaran', 635, 538.8],
  ['cambrian', 'Cambrian', 538.8, 486.85],
  ['ordovician', 'Ordovician', 486.85, 443.1],
  ['silurian', 'Silurian', 443.1, 419.62],
  ['devonian', 'Devonian', 419.62, 358.86],
  ['carboniferous', 'Carboniferous', 358.86, 298.9],
  ['permian', 'Permian', 298.9, 251.902],
  ['triassic', 'Triassic', 251.902, 201.4],
  ['jurassic', 'Jurassic', 201.4, 143.1],
  ['cretaceous', 'Cretaceous', 143.1, 66.0],
  ['paleogene', 'Paleogene', 66.0, 23.04],
  ['neogene', 'Neogene', 23.04, 2.58],
  ['today', 'Today', 2.58, 0],
];
