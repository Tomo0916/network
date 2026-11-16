/* fr: the text of lesson 16 (js/lessons.js) */
export default {
  "ls.16.lead": "[[ethernet:Ethernet]] est la norme de couches 1 et 2 la plus utilisée dans les réseaux locaux. Dans cette leçon, vous verrez la forme d'une trame Ethernet, comment on repère les trames abîmées et la règle pour partager un câble.",
  "ls.16.h1": "La trame Ethernet",
  "ls.16.p1": "Une trame Ethernet comprend, de l'avant vers l'arrière : le [[preamble:préambule]] (8 octets), l'adresse MAC de destination (6 octets), l'adresse MAC source (6 octets), le type (2 octets), les données (46 à 1500 octets) et le [[fcs:FCS]] (4 octets). Le type indique ce que contiennent les données, par exemple IP ou ARP.",
  "ls.16.cap1": "La forme d'une trame Ethernet. MAC de destination, MAC source et type forment l'en-tête.",
  "ls.16.h2": "Détecter les erreurs avec le FCS",
  "ls.16.p2": "L'émetteur calcule une valeur à partir du contenu de la trame et l'ajoute à la fin : c'est le [[fcs:FCS]]. Le récepteur fait le même calcul. Si le résultat est égal au FCS, la trame est arrivée intacte. Sinon, il considère qu'elle a été abîmée en route, par exemple par du [[noise:bruit]], et la jette.",
  "ls.16.cap2": "En haut : le résultat est égal au FCS, la trame est gardée. En bas : les données sont abîmées, le résultat diffère, elle est jetée.",
  "ls.16.h3": "CSMA/CD : la règle pour partager un câble",
  "ls.16.p3": "Quand Ethernet partage un câble, par exemple via un concentrateur, il envoie selon la règle [[csmacd:CSMA/CD]]. ① Avant d'envoyer, écouter le câble et vérifier que personne n'émet. ② Tout le monde peut utiliser le même câble. ③ Si l'on détecte une collision pendant l'envoi, arrêter tout de suite, attendre un temps aléatoire, puis renvoyer. Comme chacun attend un temps différent, il est moins probable d'émettre de nouveau en même temps.",
  "ls.16.cap3": "Le déroulement de CSMA/CD : écouter avant d'envoyer ; après une collision, attendre un temps aléatoire et réécouter.",
  "ls.16.pt1": "Une trame Ethernet : préambule, MAC de destination, MAC source, type, données, FCS.",
  "ls.16.pt2": "Le [[fcs:FCS]] permet de repérer et de jeter les trames abîmées.",
  "ls.16.pt3": "[[csmacd:CSMA/CD]] : écouter avant d'envoyer ; après une collision, attendre un temps aléatoire et renvoyer."
};
