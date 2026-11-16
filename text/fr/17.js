/* fr: the text of lesson 17 (js/lessons.js) */
export default {
  "ls.17.lead": "Un [[switch:commutateur (switch)]] ressemble à un concentrateur, mais il lit l'adresse MAC de destination de chaque trame et ne l'envoie qu'au port qui en a besoin. Pour cela, il apprend tout seul quel appareil se trouve sur quel port.",
  "ls.17.h1": "Apprendre la table d'adresses MAC",
  "ls.17.p1": "À chaque trame reçue, le commutateur inscrit l'adresse MAC source et le numéro du port d'arrivée dans sa [[mactable:table d'adresses MAC]]. Il apprend ainsi, au fil des échanges, qui se trouve sur quel port.",
  "ls.17.cap1": "Quand une trame arrive du PC A, le commutateur écrit « A est sur le port 1 » dans sa table.",
  "ls.17.h2": "Filtrage et inondation",
  "ls.17.p2": "Si l'adresse MAC de destination est dans la table, le commutateur envoie la trame uniquement sur ce port. Comme il n'envoie pas sur les autres ports, on parle de [[macfilter:filtrage]]. Si la destination n'est pas encore dans la table, il est obligé d'envoyer la trame sur tous les ports sauf celui d'arrivée : c'est l'[[flooding:inondation (flooding)]]. Les diffusions sont aussi envoyées sur tous les ports.",
  "ls.17.cap2": "À gauche : la destination est connue, envoi seulement vers le port de C. À droite : inconnue, envoi vers tous les ports.",
  "ls.17.h3": "Un domaine de collision par port",
  "ls.17.p3": "Le commutateur reçoit le signal de chaque port séparément, le garde un instant, puis le renvoie. Chaque port forme donc son propre [[colldomain:domaine de collision]], et les collisions ne s'étendent pas à tout le réseau comme avec un concentrateur. Le commutateur est un appareil de couche 2 qui utilise les adresses MAC.",
  "ls.17.cap3": "Avec un concentrateur, tous sont dans un seul domaine de collision ; avec un commutateur, chaque port est séparé.",
  "ls.17.pt1": "Le commutateur retient les adresses MAC source et les ports dans sa [[mactable:table d'adresses MAC]].",
  "ls.17.pt2": "Destination connue : un port ([[macfilter:filtrage]]) ; inconnue : tous les ports ([[flooding:inondation]]).",
  "ls.17.pt3": "Le commutateur est un appareil de couche 2. Chaque port a son propre domaine de collision."
};
