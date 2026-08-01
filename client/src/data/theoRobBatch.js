// Lot ponctuel de cotes/paris donnes par le groupe pour Theo et Rob.
// - `match` present -> met a jour le titre (si `title` fourni) et les
//   cotes d'un pari deja existant (trouve par titre exact).
// - `match` absent -> cree un nouveau pari (utile pour les multi-issues
//   qui n'existaient pas encore, ex: "Rob choppe").
// Applique via le bouton "Appliquer le lot Theo & Rob" dans Admin.
export const theoRobBatch = [
  {
    match: 'Théo appelle Malo',
    title: 'Théo appelle Malo 3 fois dans la semaine',
    outcomes: [
      { label: 'Oui', odds: 1.5 },
      { label: 'Non', odds: 3 },
    ],
  },
  {
    match: 'Théo ne peut pas boire parce qu\'il a un Hyrox en 2028',
    title: 'Théo nous sort l\'excuse de l\'Hyrox pour ne pas boire',
    outcomes: [
      { label: 'Oui', odds: 2 },
      { label: 'Non', odds: 6 },
    ],
  },
  {
    match: 'Théo est bourré, il se perd dans Barcelone',
    title: 'Théo bourré se perd dans Barcelone',
    outcomes: [
      { label: 'Oui', odds: 1.7 },
      { label: 'Non', odds: 7 },
    ],
  },
  {
    match: 'Théo se pisse dessus',
    outcomes: [
      { label: 'Oui', odds: 2 },
      { label: 'Non', odds: 1.8 },
    ],
  },
  {
    match: 'Théo et Brik s\'éclipsent de la soirée',
    title: 'Théo et Benbrik s\'éclipsent de la soirée',
    outcomes: [
      { label: 'Oui', odds: 1.3 },
      { label: 'Non', odds: 5 },
    ],
  },
  {
    title: 'Théo a pris moins de 5 caleçons',
    category: 'Théo',
    outcomes: [
      { label: 'Oui', odds: 1.4 },
      { label: 'Non', odds: 3.4 },
    ],
  },
  {
    title: 'Théo se déboîte l\'épaule',
    category: 'Théo',
    outcomes: [
      { label: 'Oui', odds: 1.5 },
      { label: 'Non', odds: 4 },
    ],
  },
  {
    match: 'Théo rate l\'avion',
    title: 'Quelqu\'un rate l\'avion',
    outcomes: [
      { label: 'Oui', odds: 3.5 },
      { label: 'Non', odds: 1.3 },
    ],
  },
  {
    title: 'Théo se craque le coude plus de 10 fois',
    category: 'Théo',
    outcomes: [
      { label: 'Oui', odds: 1.6 },
      { label: 'Non', odds: 3.6 },
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
    match: 'Rob s\'habille en classique au moins une fois',
    title: 'Rob nous sort sa tenue classique full black',
    outcomes: [
      { label: 'Oui', odds: 1.05 },
      { label: 'Non', odds: 3.8 },
    ],
  },
  {
    match: 'Rob fait une crise d\'angoisse avant/pendant l\'avion',
    title: 'Rob fait une crise d\'angoisse dans l\'avion',
    outcomes: [
      { label: 'Oui', odds: 1.7 },
      { label: 'Non', odds: 4 },
    ],
  },
  {
    title: 'Rob choppe',
    category: 'Rob',
    outcomes: [
      { label: '1 meuf', odds: 1.6 },
      { label: 'Entre 2 et 4', odds: 5 },
      { label: 'Plus de 4', odds: 10 },
    ],
  },
  {
    title: 'Rob baise',
    category: 'Rob',
    outcomes: [
      { label: 'Oui', odds: 7 },
      { label: 'Non', odds: 1.8 },
    ],
  },
  {
    title: 'Rob ramène une meuf à l\'appart',
    category: 'Rob',
    outcomes: [
      { label: 'Oui', odds: 4 },
      { label: 'Non', odds: 1.5 },
    ],
  },
  {
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
    title: 'Rob vomit dans la semaine',
    category: 'Rob',
    outcomes: [
      { label: 'Oui', odds: 2.5 },
      { label: 'Non', odds: 2.3 },
    ],
  },
  {
    title: 'Rob vomit - combien de fois ?',
    category: 'Rob',
    outcomes: [
      { label: '1 fois', odds: 2.5 },
      { label: '2-3 fois', odds: 6 },
      { label: 'Plus de 3', odds: 14 },
    ],
  },
  {
    title: 'Rob se gratte la parmesan de pieds',
    category: 'Rob',
    outcomes: [
      { label: 'Oui', odds: 1.3 },
      { label: 'Non', odds: 5.6 },
    ],
  },
];
