/* fr: the text of lesson 14 (js/lessons.js) */
export default {
  "ls.14.lead": "La couche 2 (couche liaison de données) livre correctement les données jusqu'à l'appareil voisin, dans le même réseau. Pour cela, elle découpe le flux de bits en unités appelées trames.",
  "ls.14.h1": "Le rôle de la couche 2",
  "ls.14.p1": "La couche 1 ne fait que transporter des signaux. Elle ne sait ni où commence et finit une donnée, ni à qui elle est destinée. La couche 2 inscrit la destination et la source, marque le début et la fin de chaque morceau, et le livre à l'autre appareil du même réseau. Livrer plus loin, à travers les réseaux, est le travail de la couche 3.",
  "ls.14.cap1": "La couche 2 livre seulement jusqu'à l'appareil voisin dans le même réseau. Passer d'un réseau à l'autre est le travail de la couche 3.",
  "ls.14.h2": "Le tramage",
  "ls.14.p2": "Découper le flux de bits en morceaux qui ont un sens s'appelle le [[framing:tramage]], et chaque morceau est une trame. Une trame comprend un [[header:en-tête]] avec la destination et d'autres informations, les données à transporter, et un en-queue contenant le [[fcs:FCS]] qui sert à détecter les erreurs.",
  "ls.14.cap2": "La forme de base d'une trame : l'en-tête devant, l'en-queue derrière, les données au milieu.",
  "ls.14.cap3": "Un flux de bits sans fin (en haut) est découpé en unités appelées trames (en bas).",
  "ls.14.h3": "Communication asynchrone et synchronisation",
  "ls.14.p3": "L'émetteur et le récepteur ne partagent pas d'horloge. Ethernet envoie donc, avant chaque trame, un signal fixe qui répète « 1010… » : le [[preamble:préambule]]. Le récepteur s'en sert pour se synchroniser, puis commence à lire les données. Une méthode qui se synchronise à chaque fois au lieu de partager une horloge s'appelle la [[async:communication asynchrone]].",
  "ls.14.cap4": "Le « 1010… » du préambule synchronise, puis la lecture des données commence.",
  "ls.14.pt1": "La couche 2 livre les données jusqu'à l'appareil voisin, dans le même réseau.",
  "ls.14.pt2": "Découper le flux de bits, c'est le [[framing:tramage]]. Trame = en-tête + données + en-queue.",
  "ls.14.pt3": "En [[async:communication asynchrone]], le [[preamble:préambule]] synchronise avant la lecture."
};
