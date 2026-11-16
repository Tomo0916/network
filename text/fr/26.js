/* fr: the text of lesson 26 (js/lessons.js) */
export default {
  "ls.26.lead": "Même en connaissant l'adresse IP, il faut l'adresse MAC du destinataire pour envoyer une trame sur Ethernet. [[arp:ARP]] est un protocole qui trouve l'adresse MAC à partir de l'adresse IP.",
  "ls.26.h1": "L'adresse IP ne suffit pas",
  "ls.26.p1": "Quand un ordinateur envoie un paquet IP, celui-ci est transporté dans une trame Ethernet. La destination de la trame doit être une [[mac:adresse MAC]]. Mais l'ordinateur ne connaît que l'adresse IP du destinataire. Il doit donc trouver l'adresse MAC à partir de l'adresse IP.",
  "ls.26.cap1": "L'adresse IP de destination est connue, mais pas l'adresse MAC à écrire dans la trame.",
  "ls.26.h2": "Le fonctionnement d'ARP",
  "ls.26.p2": "ARP envoie d'abord à tout le monde, en [[broadcast:diffusion]], une requête ARP : « Qui a 192.168.1.20 ? Donnez-moi votre adresse MAC. » Seul l'appareil qui a cette adresse IP renvoie une réponse ARP avec son adresse MAC, en [[unicast:monodiffusion]]. Les autres jettent la requête.",
  "ls.26.cap2": "La requête va à tous (diffusion) ; la réponse vient seulement du bon appareil (monodiffusion).",
  "ls.26.h3": "La table ARP",
  "ls.26.p3": "Le résultat est gardé un moment dans la [[arptable:table ARP]]. La fois suivante, il suffit de regarder la table, sans renvoyer ARP à chaque fois. Mais les appareils peuvent changer, donc les entrées sont effacées après un certain temps. Si la destination est dans un autre réseau, on cherche l'adresse MAC de la passerelle par défaut, et non celle du destinataire.",
  "ls.26.cap3": "La table ARP contient des paires adresse IP / adresse MAC.",
  "ls.26.pt1": "[[arp:ARP]] trouve l'adresse MAC à partir de l'adresse IP.",
  "ls.26.pt2": "La requête est une diffusion, la réponse une monodiffusion.",
  "ls.26.pt3": "Les résultats sont gardés un moment dans la [[arptable:table ARP]]."
};
