// 2e lot ponctuel de cotes/paris. Meme logique que theoRobBatch.js :
// `match` (string ou tableau) cherche un pari existant par titre, sinon
// cree un nouveau. Si un pari trouve a une structure d'issues differente
// (ex: passe de Oui/Non a plusieurs paliers), l'appli le supprime et le
// recree automatiquement (cf AdminPage > TheoRobBatch, logique partagee).
export const batch2 = [
  {
    match: ['Theve boit un maté'],
    outcomes: [
      { label: 'Oui', odds: 2 },
      { label: 'Non', odds: 1.6 },
    ],
  },
  {
    match: ['Theve casse un objet', 'Theve casse un truc dans l\'Airbnb'],
    title: 'Theve casse un truc dans l\'Airbnb',
    category: 'Theve',
    outcomes: [
      { label: 'Oui', odds: 1.7 },
      { label: 'Non', odds: 3.2 },
    ],
  },
  {
    title: 'Rob dit que les meufs sont dégueulasses',
    category: 'Rob',
    outcomes: [
      { label: 'Oui', odds: 1.3 },
      { label: 'Non', odds: 8 },
    ],
  },
  {
    title: 'Benbrik se cisaille le crâne',
    category: 'Benbrik',
    outcomes: [
      { label: '1 fois', odds: 2.5 },
      { label: '2-3 fois', odds: 2 },
      { label: 'Plus de 3', odds: 1.7 },
    ],
  },
  {
    match: ["La veine d'Alex ressort au moins une fois dans la semaine", "La veine d'Alex ressort dans la semaine"],
    title: "La veine d'Alex ressort dans la semaine",
    category: 'Alex',
    outcomes: [
      { label: '1 fois', odds: 2.6 },
      { label: '2-3 fois', odds: 1.9 },
      { label: 'Plus de 3', odds: 1.3 },
    ],
  },
  {
    title: 'Benbrik demande où sont les assiettes après la moitié des vacances',
    category: 'Benbrik',
    outcomes: [
      { label: 'Oui', odds: 1.6 },
      { label: 'Non', odds: 2.5 },
    ],
  },
  {
    match: ['Antoine fume 10 clopes dans la même soirée'],
    title: 'Antoine fume 1 paquet en 1 soir',
    category: 'Antoine',
    outcomes: [
      { label: 'Oui', odds: 1.2 },
      { label: 'Non', odds: 2.5 },
    ],
  },
  {
    match: ['Antoine chope l\'accès VIP'],
    title: 'Antoine chope un accès VIP',
    category: 'Antoine',
    outcomes: [
      { label: 'Oui', odds: 1.8 },
      { label: 'Non', odds: 3.1 },
    ],
  },
  {
    match: ['Antoine marche sans sa botte'],
    title: 'Antoine marche sans sa botte en soirée',
    category: 'Antoine',
    outcomes: [
      { label: 'Oui', odds: 1.9 },
      { label: 'Non', odds: 2.7 },
    ],
  },
  {
    match: ['Antoine va en soirée avec Romane'],
    title: 'Antoine va rejoindre Romane en soirée',
    category: 'Antoine',
    outcomes: [
      { label: 'Oui', odds: 1.05 },
      { label: 'Non', odds: 7 },
    ],
  },
  {
    match: ['Benbrik loupe encore la machine à poings'],
    title: 'Benbrik tape à côté et fait moins de 100 à la machine à poings',
    category: 'Benbrik',
    outcomes: [
      { label: 'Oui', odds: 1.4 },
      { label: 'Non', odds: 4 },
    ],
  },
];
