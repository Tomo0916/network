/* fr: the text of lesson 24 (js/lessons.js) */
export default {
  "ls.24.lead": "Avec les classes, il n'y a que trois tailles de réseau. On a donc adopté une méthode pour choisir librement la longueur de la partie réseau, sans classes : c'est le [[cidr:CIDR]] (adressage sans classe).",
  "ls.24.h1": "Les classes gaspillent des adresses",
  "ls.24.p1": "Une classe C permet 254 appareils, une classe B environ 65 000. Pour un réseau de 500 appareils, la classe C est trop petite, et avec la classe B la plupart des adresses restent inutilisées. Les adresses IPv4 sont limitées : ce gaspillage est devenu un gros problème.",
  "ls.24.cap1": "Utiliser une classe B pour 500 appareils gaspille plus de 65 000 adresses.",
  "ls.24.h2": "Écrire la longueur de préfixe",
  "ls.24.p2": "En CIDR, la longueur de la partie réseau s'écrit après l'adresse avec « / » et un nombre : la [[prefix:longueur de préfixe]]. Par exemple, 192.168.1.0/26 signifie que les 26 premiers bits sont la partie réseau ; le masque est 255.255.255.192. La partie hôte fait 6 bits, donc 62 adresses sont utilisables par les appareils.",
  "ls.24.cap2": "/26 est un masque avec 26 « 1 » à la suite. La partie hôte est formée des 6 bits restants.",
  "ls.24.h3": "Regrouper en une seule écriture",
  "ls.24.p3": "Le CIDR permet aussi d'écrire des réseaux voisins comme un seul. Par exemple, les quatre réseaux 192.168.0.0/24 à 192.168.3.0/24 peuvent s'écrire 192.168.0.0/22. Les routeurs ont moins de routes à retenir, ce qui garde petite la table de routes d'Internet.",
  "ls.24.cap3": "Quatre réseaux /24 qui se suivent sont regroupés en un seul /22.",
  "ls.24.pt1": "Le [[cidr:CIDR]] choisit librement la longueur de la partie réseau, sans classes.",
  "ls.24.pt2": "Une [[prefix:longueur de préfixe]] comme « /26 » donne le nombre de bits de la partie réseau.",
  "ls.24.pt3": "On peut regrouper des réseaux voisins pour réduire le nombre de routes."
};
