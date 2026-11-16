/* fr: the text of lesson 25 (js/lessons.js) */
export default {
  "ls.25.lead": "Un appareil sur un réseau a besoin de réglages comme une adresse IP. Tout régler à la main, appareil par appareil, est long et source d'erreurs. [[dhcp:DHCP]] est un protocole qui distribue ces réglages automatiquement.",
  "ls.25.h1": "Ce que donne DHCP",
  "ls.25.p1": "Un serveur DHCP donne à l'appareil qui se connecte un ensemble de réglages : [[ipaddress:adresse IP]], [[subnetmask:masque de sous-réseau]], [[gateway:passerelle par défaut]], adresse du serveur DNS, etc. À la maison, c'est généralement le routeur qui joue le rôle de serveur DHCP.",
  "ls.25.cap1": "Le serveur DHCP distribue en un lot les réglages nécessaires à la communication.",
  "ls.25.h2": "Quatre messages",
  "ls.25.p2": "Quatre messages sont échangés avant d'obtenir les réglages. ① DISCOVER : l'appareil cherche « Y a-t-il un serveur DHCP ? ». ② OFFER : le serveur propose « Que pensez-vous de cette adresse ? ». ③ REQUEST : l'appareil demande « Je la prends ». ④ ACK : le serveur accepte « Allez-y ». L'appareil n'a pas encore d'adresse IP, donc DISCOVER est envoyé en [[broadcast:diffusion]].",
  "ls.25.cap2": "Quatre échanges dans l'ordre DISCOVER → OFFER → REQUEST → ACK.",
  "ls.25.h3": "Les adresses sont prêtées",
  "ls.25.p3": "Une adresse DHCP n'est pas donnée : elle est prêtée pour une durée limitée, appelée bail. Un appareil qui continue de l'utiliser demande une prolongation avant la fin du bail. Une adresse qui n'est plus utilisée retourne au serveur et peut être prêtée à un autre appareil.",
  "ls.25.cap3": "On demande une prolongation vers la moitié du bail. On rend l'adresse quand on ne l'utilise plus.",
  "ls.25.pt1": "[[dhcp:DHCP]] distribue automatiquement des réglages comme l'adresse IP.",
  "ls.25.pt2": "Quatre messages : DISCOVER → OFFER → REQUEST → ACK.",
  "ls.25.pt3": "Les adresses sont prêtées pour une durée limitée (le bail)."
};
