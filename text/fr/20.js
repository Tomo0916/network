/* fr: the text of lesson 20 (js/lessons.js) */
export default {
  "ls.20.lead": "[[ip:IP]] (Internet Protocol) est le principal protocole de la couche 3. Presque tous les appareils connectés à Internet communiquent avec IP.",
  "ls.20.h1": "IP fonctionne sur toutes sortes de réseaux",
  "ls.20.p1": "Sous IP, il existe plusieurs couches 2, comme Ethernet ou le Wi-Fi. IP fonctionne de la même façon sur toutes. De plus, IP fait « de son mieux » pour livrer, mais ne vérifie pas l'arrivée. Quand une vérification est nécessaire, c'est TCP, dans la couche supérieure, qui s'en charge.",
  "ls.20.cap1": "IP fonctionne de la même façon au-dessus de plusieurs couches 2.",
  "ls.20.h2": "La forme d'un paquet IP",
  "ls.20.p2": "Un bloc de données envoyé avec IP s'appelle un [[packet:paquet]] IP. Un [[header:en-tête]] est placé devant. Il contient l'adresse IP source, l'adresse IP de destination, le [[ttl:TTL]] (combien de routeurs il peut encore traverser), etc. Les routeurs lisent cet en-tête pour choisir où l'envoyer.",
  "ls.20.cap2": "Un paquet IP se compose d'un en-tête IP et de données.",
  "ls.20.h3": "Les paquets voyagent dans des trames",
  "ls.20.p3": "Un paquet IP ne peut pas circuler seul sur le câble. Il est placé dans une trame de couche 2 ([[encap:encapsulation]]). À chaque routeur, la trame extérieure est refaite, mais la destination du paquet IP à l'intérieur reste la même jusqu'au bout.",
  "ls.20.cap3": "Le routeur ouvre la trame, sort le paquet et le met dans une nouvelle trame pour le tronçon suivant.",
  "ls.20.pt1": "[[ip:IP]] est le principal protocole de couche 3. Il ne vérifie pas l'arrivée.",
  "ls.20.pt2": "L'[[header:en-tête]] d'un [[packet:paquet]] IP contient les adresses IP source et destination, etc.",
  "ls.20.pt3": "La trame est refaite à chaque tronçon, mais la destination du paquet IP ne change pas."
};
