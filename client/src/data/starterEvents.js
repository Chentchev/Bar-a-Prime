// Paris de depart nettoyes a partir de la liste brute du groupe. Cotes
// laissees a 2/2 par defaut (placeholder neutre) : a ajuster a la main
// dans l'app une fois importes, cf AdminPage > "Import de depart".
const OUI_NON = [
  { label: 'Oui', odds: 2 },
  { label: 'Non', odds: 2 },
];

function bet(title, category) {
  return { title, category, outcomes: OUI_NON };
}

export const starterEvents = [
  // Theo
  bet('Théo se blesse au coude ou à l\'épaule', 'Théo'),
  bet('Théo appelle Malo', 'Théo'),
  bet('Théo ne peut pas boire parce qu\'il a un Hyrox en 2028', 'Théo'),
  bet('Théo boit un maté', 'Théo'),
  bet('Théo est bourré, il se perd dans Barcelone', 'Théo'),
  bet('Théo casse un objet', 'Théo'),
  bet('Théo se pisse dessus', 'Théo'),
  bet('Théo regarde les calories derrière l\'étiquette', 'Théo'),
  bet('Théo et Brik s\'éclipsent de la soirée', 'Théo'),
  bet('Théo rate l\'avion', 'Théo'),

  // Rob
  bet('Rob nous casse les couilles avec sa barbe', 'Rob'),
  bet('Rob se lève en dernier chaque jour', 'Rob'),
  bet('Rob nous sort un caleçon troué', 'Rob'),
  bet('Rob passe plus de 30 min sous la douche', 'Rob'),
  bet('Rob va nous dire que l\'eau était pas fraîche', 'Rob'),
  bet('Rob se mord les lèvres', 'Rob'),
  bet('Rob prend un coup de soleil', 'Rob'),
  bet('Rob nous sort son pollen de slip', 'Rob'),
  bet('Rob se gratte les pieds', 'Rob'),
  bet('Rob s\'habille en classique au moins une fois', 'Rob'),
  bet('Rob fait une crise d\'angoisse avant/pendant l\'avion', 'Rob'),
  bet('Rob, Théo et Benbrik arrivent à 18h le premier jour', 'Rob'),

  // Alex
  bet('Alex perd son téléphone', 'Alex'),
  bet('Alex se rase/cisaille le crâne', 'Alex'),
  bet('La veine d\'Alex ressort au moins une fois dans la semaine', 'Alex'),
  bet('Alex demande encore où sont les assiettes après la moitié de la semaine', 'Alex'),
  bet('Alex ne finit pas son assiette', 'Alex'),

  // Antoine
  bet('Antoine fume 10 clopes dans la même soirée', 'Antoine'),
  bet('Antoine marche sans sa botte', 'Antoine'),
  bet('Antoine va en soirée avec Romane', 'Antoine'),
  bet('Antoine prête sa botte à quelqu\'un', 'Antoine'),
  bet('Antoine gère le carré VIP', 'Antoine'),
  bet('Antoine chope l\'accès VIP', 'Antoine'),

  // Jules
  bet('Jules drague une fille avec ses mains', 'Jules'),

  // Benbrik / Brik
  bet('Benbrik loupe encore la machine à poings', 'Benbrik'),
  bet('Benbrik bande en soirée', 'Benbrik'),
  bet('Benbrik demande un habit à Antoine', 'Benbrik'),
  bet('Benbrik se fait contrôler à la frontière', 'Benbrik'),
  bet('La Guardia Civil met la pression à Brik', 'Benbrik'),
  bet('Benbrik prend un coup de soleil sur le crâne', 'Benbrik'),
  bet('Brik refuse un plan à 3', 'Benbrik'),
  bet('Benbrik se fait draguer par des daronnes', 'Benbrik'),
  bet('Benbrik nous rappelle son budget de voyage', 'Benbrik'),
  bet('Brik râle pour payer les soirées', 'Benbrik'),
  bet('Brik se fait piquer par une méduse', 'Benbrik'),
  bet('Benbrik dit "c\'est la pire semaine de ma vie"', 'Benbrik'),
  bet('Benbrik casse son téléphone', 'Benbrik'),

  // Groupe / appart
  bet('On casse quelque chose dans l\'appart', 'Groupe'),
  bet('Les filles dorment à l\'appart', 'Groupe'),
  bet('Les voisins viennent toquer', 'Groupe'),
  bet('Le before se transforme en strip-tease', 'Groupe'),
  bet('Personne ne va à l\'hôpital de la semaine', 'Groupe'),
  bet('Un groupe de filles reste avec nous toute la semaine', 'Groupe'),
  bet('Quelqu\'un se fait refuser à l\'entrée d\'une boîte', 'Groupe'),
  bet('Quelqu\'un fait un coma éthylique', 'Groupe'),
  bet('Quelqu\'un vomit dans l\'avion', 'Groupe'),

  // Voyage
  bet('Notre valise ne passe pas à l\'aéroport', 'Voyage'),
  bet('Veltchev perd sa sacoche', 'Voyage'),
  bet('Veltchev arrose un flic', 'Voyage'),
  bet('Embrouille avec un Espagnol à propos de la Coupe du Monde', 'Voyage'),

  // Sante
  bet('Quelqu\'un saigne du nez à cause des poppers', 'Santé'),
];
