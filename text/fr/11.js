/* fr: the text of lesson 11 (js/lessons.js) */
export default {
  "ls.11.lead": "La couche 1 (couche physique) transforme les données faites de 0 et de 1 en signaux qui peuvent voyager dans un câble ou dans l'air, et les porte jusqu'à l'appareil voisin. Tout en bas du réseau, elle soutient toutes les communications.",
  "ls.11.h1": "Le rôle de la couche 1",
  "ls.11.p1": "Dans un ordinateur, les données sont une suite de 0 et de 1 (des [[bit:bits]]). Mais ce ne sont pas des chiffres qui circulent dans un câble. La couche 1 transforme les bits en signaux : courant fort ou faible, éclairs de lumière, variations d'ondes radio, puis les envoie. Le côté qui reçoit retransforme les signaux en bits.",
  "ls.11.cap1": "La couche 1 est en bas du modèle OSI. Elle transforme en signaux les bits venus des couches supérieures et les envoie.",
  "ls.11.cap2": "Exemple de bits en signal électrique : 1 = tension haute, 0 = tension basse (les vraies méthodes sont plus élaborées).",
  "ls.11.h2": "Les supports de transmission",
  "ls.11.p2": "Ce qui transporte le signal s'appelle le [[media:support de transmission]]. Il y en a trois principaux : le câble réseau en cuivre (signal électrique), la fibre optique en verre très fin (signal lumineux) et les ondes radio qui traversent l'air (Wi-Fi). La fibre envoie vite et loin. La radio n'a pas besoin de câble, mais les murs et les autres ondes la gênent plus facilement.",
  "ls.11.cap3": "Supports courants. De gauche à droite : câble réseau (électricité), fibre optique (lumière), sans-fil (ondes radio).",
  "ls.11.h3": "Interface et carte réseau",
  "ls.11.p3": "La prise où un appareil branche un câble s'appelle une [[interface:interface]]. Dans un ordinateur, c'est la [[nic:carte réseau (NIC)]] qui joue ce rôle et qui convertit entre bits et signaux. La vitesse s'exprime en [[bps:bps]], le nombre de bits envoyés par seconde.",
  "ls.11.cap4": "La carte réseau qui envoie transforme les bits en signal ; celle qui reçoit retransforme le signal en bits.",
  "ls.11.pt1": "La couche 1 transforme les bits en signaux et les porte jusqu'à l'appareil voisin.",
  "ls.11.pt2": "Ce qui porte le signal est le [[media:support de transmission]] : câble réseau, fibre optique, ondes radio…",
  "ls.11.pt3": "La [[nic:carte réseau]] convertit entre bits et signaux. La vitesse s'exprime en [[bps:bps]]."
};
