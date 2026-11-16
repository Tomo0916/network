/* fr: the text of lesson 19 (js/lessons.js) */
export default {
  "ls.19.lead": "Jusqu'ici, nous avons vu comment les données circulent dans un seul réseau. La couche 3 relie les réseaux entre eux et transporte les données jusqu'à un destinataire lointain.",
  "ls.19.h1": "Relier des réseaux",
  "ls.19.p1": "Un LAN est le réseau d'un bâtiment ou d'une salle. En reliant beaucoup de LAN avec des [[router:routeurs]], on obtient un réseau de réseaux, appelé [[internetwork:interréseau]]. Internet, qui relie des réseaux du monde entier, en est le plus grand exemple.",
  "ls.19.cap1": "Trois LAN reliés par deux routeurs forment un grand interréseau.",
  "ls.19.h2": "Le partage du travail entre couche 2 et couche 3",
  "ls.19.p2": "La couche 2 (Ethernet, etc.) ne livre les données qu'à l'appareil voisin, dans le même réseau. La couche 3 transporte les données de l'expéditeur jusqu'à la destination finale, à travers plusieurs réseaux. La couche 2 transporte tronçon par tronçon ; la couche 3 décide de l'itinéraire complet.",
  "ls.19.cap2": "La couche 2 transporte tronçon par tronçon. La couche 3 s'occupe de tout le trajet.",
  "ls.19.h3": "Une adresse et un itinéraire",
  "ls.19.p3": "Pour livrer loin, il faut deux choses. D'abord une adresse qui distingue chaque destinataire dans le monde : l'[[ipaddress:adresse IP]]. Ensuite, choisir le chemin jusqu'à la destination : c'est le [[routing:routage]], dont s'occupent les routeurs.",
  "ls.19.pt1": "Des réseaux reliés par des [[router:routeurs]] forment un [[internetwork:interréseau]].",
  "ls.19.pt2": "La couche 2 livre au voisin ; la couche 3 livre à la destination finale.",
  "ls.19.pt3": "La couche 3 a besoin d'une adresse ([[ipaddress:adresse IP]]) et d'un itinéraire ([[routing:routage]])."
};
