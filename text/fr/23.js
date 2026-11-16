/* fr: the text of lesson 23 (js/lessons.js) */
export default {
  "ls.23.lead": "Avec les classes seules, un réseau peut devenir très grand. Le [[subnetting:découpage en sous-réseaux]] divise un réseau en réseaux plus petits (sous-réseaux).",
  "ls.23.h1": "Emprunter des bits à la partie hôte",
  "ls.23.p1": "On emprunte les premiers bits de la partie hôte pour allonger la partie réseau. Par exemple, si le réseau de classe B 172.16.0.0 prend ses trois premiers nombres comme partie réseau, on peut le diviser en beaucoup de petits réseaux : 172.16.1.0, 172.16.2.0, etc. Un réseau par service est plus facile à gérer.",
  "ls.23.cap1": "Un grand réseau de classe B divisé en petits sous-réseaux, un par service.",
  "ls.23.h2": "Le masque de sous-réseau",
  "ls.23.p2": "Le [[subnetmask:masque de sous-réseau]] indique où s'arrête la partie réseau. C'est un nombre de 32 bits avec des 1 pour la partie réseau et des 0 pour la partie hôte, écrit en décimal comme une adresse IP. Avec 255.255.255.0, les 24 premiers bits sont la partie réseau.",
  "ls.23.cap2": "Là où le masque vaut 1 : partie réseau ; là où il vaut 0 : partie hôte.",
  "ls.23.h3": "Calculer l'adresse réseau",
  "ls.23.p3": "En calculant bit par bit l'adresse IP ET le masque (AND : 1 seulement si les deux valent 1), on obtient l'adresse réseau. Si notre adresse réseau et celle de la destination sont les mêmes, le destinataire est dans le même réseau. Sinon, il faut passer par un routeur.",
  "ls.23.cap3": "192.168.1.130 AND 255.255.255.192 donne 192.168.1.128.",
  "ls.23.pt1": "Le [[subnetting:découpage en sous-réseaux]] emprunte la partie hôte pour diviser un réseau.",
  "ls.23.pt2": "Un [[subnetmask:masque de sous-réseau]] vaut 1 pour la partie réseau et 0 pour la partie hôte.",
  "ls.23.pt3": "Adresse IP AND masque donne l'adresse réseau."
};
