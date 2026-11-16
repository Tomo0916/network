/* fr: the text of lesson 15 (js/lessons.js) */
export default {
  "ls.15.lead": "Quand plusieurs appareils partagent un réseau, chaque trame a besoin d'une adresse qui indique son destinataire. L'adresse de la couche 2 est l'[[mac:adresse MAC]]. Dans cette leçon, vous verrez comment elle est construite et les trois types de destination.",
  "ls.15.h1": "La structure d'une adresse MAC",
  "ls.15.p1": "L'[[mac:adresse MAC]] est un numéro de 48 bits inscrit en usine dans chaque carte réseau. On l'écrit en général en six groupes de deux chiffres hexadécimaux, par exemple 00:1A:2B:3C:4D:5E. Les 24 premiers bits sont le numéro du fabricant (OUI), les 24 derniers un numéro de série donné par le fabricant.",
  "ls.15.cap1": "Une adresse MAC fait 48 bits : 3 octets pour le fabricant, 3 octets pour le numéro de série.",
  "ls.15.h2": "Trois types de destination",
  "ls.15.p2": "Envoyer à un seul appareil, c'est l'[[unicast:unicast]] ; à tout le réseau, la [[broadcast:diffusion (broadcast)]] ; à un groupe défini seulement, le [[multicast:multicast]]. L'adresse MAC de destination d'une diffusion est FF:FF:FF:FF:FF:FF : les 48 bits valent 1.",
  "ls.15.cap2": "De gauche à droite : unicast (un appareil), diffusion (tous), multicast (un groupe). En vert : les appareils qui reçoivent.",
  "ls.15.h3": "La carte réseau décide de garder ou non",
  "ls.15.p3": "L'en-tête d'une trame [[ethernet:Ethernet]] contient l'adresse MAC de destination et l'adresse MAC source. La carte réseau lit la destination de chaque trame reçue. S'il s'agit de sa propre adresse, d'une diffusion ou d'un groupe multicast auquel elle appartient, elle garde la trame. Sinon, elle la jette.",
  "ls.15.cap3": "La carte réseau ne regarde que l'adresse MAC de destination pour garder ou jeter une trame.",
  "ls.15.pt1": "Une [[mac:adresse MAC]] fait 48 bits : 24 bits pour le fabricant, 24 bits de numéro de série.",
  "ls.15.pt2": "Vers un seul = [[unicast:unicast]], vers tous = [[broadcast:diffusion]], vers un groupe = [[multicast:multicast]].",
  "ls.15.pt3": "La carte réseau lit la MAC de destination et jette la trame si elle ne lui est pas destinée."
};
