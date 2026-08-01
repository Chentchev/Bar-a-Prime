// Lot ponctuel de cotes/paris donnes par le groupe pour Theve et Rob.
// - `match` : titre(s) possibles du pari s'il existe deja (string ou
//   tableau de strings - utile ici car le pari a pu etre cree avec un
//   mauvais nom "Theo" avant d'etre corrige en "Theve"). Si trouve, met a
//   jour le titre (`title`) et les cotes.
// - Si aucun `match` ne correspond, cree un nouveau pari avec `title`
//   (utile pour les multi-issues qui n'existaient pas encore, ex: "Rob
//   choppe").
// Applique via le bouton "Appliquer le lot Theve & Rob" dans Admin.
export const theoRobBatch = [
  {
    match: ['Théo appelle Malo', 'Theve appelle Malo', 'Théo appelle Malo 3 fois dans la semaine'],
    title: 'Theve appelle Malo 3 fois dans la semaine',
    category: 'Theve',
    outcomes: [
      { label: 'Oui', odds: 1.5 },
      { label: 'Non', odds: 3 },
    ],
  },
  {
    match: [
      'Théo ne peut pas boire parce qu\'il a un Hyrox en 2028',
      'Theve ne peut pas boire parce qu\'il a un Hyrox en 2028',
      'Théo nous sort l\'excuse de l\'Hyrox pour ne pas boire',
    ],
    title: 'Theve nous sort l\'excuse de l\'Hyrox pour ne pas boire',
    category: 'Theve',
    outcomes: [
      { label: 'Oui', odds: 2 },
      { label: 'Non', odds: 6 },
    ],
  },
  {
    match: [
      'Théo est bourré, il se perd dans Barcelone',
      'Theve est bourré, il se perd dans Barcelone',
      'Théo bourré se perd dans Barcelone',
    ],
    title: 'Theve bourré se perd dans Barcelone',
    category: 'Theve',
    outcomes: [
      { label: 'Oui', odds: 1.7 },
      { label: 'Non', odds: 7 },
    ],
  },
  {
    match: ['Théo se pisse dessus', 'Theve se pisse dessus'],
    title: 'Theve se pisse dessus',
    category: 'Theve',
    outcomes: [
      { label: 'Oui', odds: 2 },
      { label: 'Non', odds: 1.8 },
    ],
  },
  {
    match: [
      'Théo et Brik s\'éclipsent de la soirée',
      'Theve et Brik s\'éclipsent de la soirée',
      'Théo et Benbrik s\'éclipsent de la soirée',
    ],
    title: 'Theve et Benbrik s\'éclipsent de la soirée',
    category: 'Theve',
    outcomes: [
      { label: 'Oui', odds: 1.3 },
      { label: 'Non', odds: 5 },
    ],
  },
  {
    match: ['Théo a pris moins de 5 caleçons'],
    title: 'Theve a pris moins de 5 caleçons',
    category: 'Theve',
    outcomes: [
      { label: 'Oui', odds: 1.4 },
      { label: 'Non', odds: 3.4 },
    ],
  },
  {
    match: ['Théo se déboîte l\'épaule'],
    title: 'Theve se déboîte l\'épaule',
    category: 'Theve',
    outcomes: [
      { label: 'Oui', odds: 1.5 },
      { label: 'Non', odds: 4 },
    ],
  },
  {
    match: ['Théo rate l\'avion', 'Theve rate l\'avion', 'Quelqu\'un rate l\'avion'],
    title: 'Quelqu\'un rate l\'avion',
    outcomes: [
      { label: 'Oui', odds: 3.5 },
      { label: 'Non', odds: 1.3 },
    ],
  },
  {
    match: ['Théo se craque le coude plus de 10 fois'],
    title: 'Theve se craque le coude plus de 10 fois',
    category: 'Theve',
    outcomes: [
      { label: 'Oui', odds: 1.6 },
      { label: 'Non', odds: 3.6 },
    ],
  },
  // Ces deux-la n'ont pas encore de vraies cotes (pas donnees par le
  // groupe) : juste un renommage Theo -> Theve, cotes 2/2 inchangees.
  {
    match: ['Théo boit un maté'],
    title: 'Theve boit un maté',
    category: 'Theve',
    outcomes: [
      { label: 'Oui', odds: 2 },
      { label: 'Non', odds: 2 },
    ],
  },
  {
    match: ['Théo casse un objet'],
    title: 'Theve casse un objet',
    category: 'Theve',
    outcomes: [
      { label: 'Oui', odds: 2 },
      { label: 'Non', odds: 2 },
    ],
  },

  {
    match: 'Rob se lève en dernier chaque jour',
    outcomes: [
      { label: 'Oui', odds: 1.3 },
      { label: 'Non', odds: 4 },
    ],
  },
  {
    match: 'Rob nous sort un caleçon troué',
    outcomes: [
      { label: 'Oui', odds: 1.5 },
      { label: 'Non', odds: 4 },
    ],
  },
  {
    match: 'Rob passe plus de 30 min sous la douche',
    outcomes: [
      { label: 'Oui', odds: 1.1 },
      { label: 'Non', odds: 9 },
    ],
  },
  {
    match: ['Rob arrive pas à rentrer dans l\'eau car trop froide'],
    title: 'Rob arrive pas à rentrer dans l\'eau car trop froide',
    category: 'Rob',
    outcomes: [
      { label: 'Oui', odds: 1.2 },
      { label: 'Non', odds: 8 },
    ],
  },
  {
    match: 'Rob nous sort son pollen de slip',
    outcomes: [
      { label: 'Oui', odds: 1.5 },
      { label: 'Non', odds: 3.5 },
    ],
  },
  {
    match: ['Rob s\'habille en classique au moins une fois', 'Rob nous sort sa tenue classique full black'],
    title: 'Rob nous sort sa tenue classique full black',
    outcomes: [
      { label: 'Oui', odds: 1.05 },
      { label: 'Non', odds: 3.8 },
    ],
  },
  {
    match: ['Rob fait une crise d\'angoisse avant/pendant l\'avion', 'Rob fait une crise d\'angoisse dans l\'avion'],
    title: 'Rob fait une crise d\'angoisse dans l\'avion',
    outcomes: [
      { label: 'Oui', odds: 1.7 },
      { label: 'Non', odds: 4 },
    ],
  },
  {
    match: ['Rob choppe'],
    title: 'Rob choppe',
    category: 'Rob',
    outcomes: [
      { label: '1 meuf', odds: 1.6 },
      { label: 'Entre 2 et 4', odds: 5 },
      { label: 'Plus de 4', odds: 10 },
    ],
  },
  {
    match: ['Rob baise'],
    title: 'Rob baise',
    category: 'Rob',
    outcomes: [
      { label: 'Oui', odds: 7 },
      { label: 'Non', odds: 1.8 },
    ],
  },
  {
    match: ['Rob ramène une meuf à l\'appart'],
    title: 'Rob ramène une meuf à l\'appart',
    category: 'Rob',
    outcomes: [
      { label: 'Oui', odds: 4 },
      { label: 'Non', odds: 1.5 },
    ],
  },
  {
    match: ['On attend Rob qui se prépare'],
    title: 'On attend Rob qui se prépare',
    category: 'Rob',
    outcomes: [
      { label: 'Entre 1 et 5 min', odds: 12 },
      { label: 'Entre 6 et 10 min', odds: 10 },
      { label: 'Entre 11 et 15 min', odds: 8 },
      { label: 'Plus de 15 min', odds: 1.9 },
    ],
  },
  {
    match: 'Rob nous casse les couilles avec sa barbe',
    outcomes: [
      { label: 'Oui', odds: 1.2 },
      { label: 'Non', odds: 12 },
    ],
  },
  {
    match: ['Rob vomit dans la semaine'],
    title: 'Rob vomit dans la semaine',
    category: 'Rob',
    outcomes: [
      { label: 'Oui', odds: 2.5 },
      { label: 'Non', odds: 2.3 },
    ],
  },
  {
    match: ['Rob vomit - combien de fois ?'],
    title: 'Rob vomit - combien de fois ?',
    category: 'Rob',
    outcomes: [
      { label: '1 fois', odds: 2.5 },
      { label: '2-3 fois', odds: 6 },
      { label: 'Plus de 3', odds: 14 },
    ],
  },
  {
    match: ['Rob se gratte la parmesan de pieds'],
    title: 'Rob se gratte la parmesan de pieds',
    category: 'Rob',
    outcomes: [
      { label: 'Oui', odds: 1.3 },
      { label: 'Non', odds: 5.6 },
    ],
  },
];
