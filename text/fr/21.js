/* fr: the text of lesson 21 (js/lessons.js) */
export default {
  "ls.21.lead": "Une [[ipaddress:adresse IP]] est un numéro qui distingue les appareils dans un interréseau. Voyons comment s'écrit une adresse IPv4 et ce qu'elle contient.",
  "ls.21.h1": "32 bits en quatre parties",
  "ls.21.p1": "Une adresse IPv4 fait 32 bits. Trente-deux 0 et 1 sont difficiles à lire ; on les coupe donc en quatre groupes de 8 bits, on écrit chaque groupe en décimal et on les relie par des points. Avec 8 bits on peut écrire de 0 à 255 ; chaque nombre est donc entre 0 et 255.",
  "ls.21.cap1": "En binaire, 192.168.1.10 donne quatre groupes de 8 bits.",
  "ls.21.h2": "Partie réseau et partie hôte",
  "ls.21.p2": "Une adresse IP a deux parties. La partie avant est la [[netpart:partie réseau]] : elle indique quel réseau. La partie arrière est la [[hostpart:partie hôte]] : elle indique quel appareil dans ce réseau. Les appareils d'un même réseau ont la même partie réseau.",
  "ls.21.cap2": "Tous les appareils du LAN de gauche ont la partie réseau 192.168.1. La partie hôte les distingue un par un.",
  "ls.21.h3": "Comme une adresse postale",
  "ls.21.p3": "La partie réseau ressemble au nom de la ville, la partie hôte au numéro de la maison. Le courrier est d'abord transporté jusqu'à la ville, puis on trouve la maison grâce au numéro. Un [[router:routeur]] regarde aussi d'abord la partie réseau et transporte le paquet jusqu'au réseau de destination.",
  "ls.21.pt1": "Une [[ipaddress:adresse IP]] IPv4 fait 32 bits, écrits en quatre nombres décimaux de 8 bits.",
  "ls.21.pt2": "Devant : la [[netpart:partie réseau]] (quel réseau). Derrière : la [[hostpart:partie hôte]] (quel appareil).",
  "ls.21.pt3": "Le routeur regarde d'abord la partie réseau."
};
