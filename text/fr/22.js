/* fr: the text of lesson 22 (js/lessons.js) */
export default {
  "ls.22.lead": "Comment savoir où s'arrête la partie réseau d'une adresse IP ? La première méthode a été les « classes ». Certaines adresses IP ont aussi un sens spécial.",
  "ls.22.h1": "Les classes d'adresses IP",
  "ls.22.p1": "Avec les [[ipclass:classes d'adresses IP]], le premier nombre fixe la longueur de la partie réseau. En classe A, ce sont les 8 premiers bits ; en classe B, les 16 premiers ; en classe C, les 24 premiers. La classe A sert aux grands réseaux, la classe C aux petits.",
  "ls.22.cap1": "Longueur des parties réseau et hôte dans les classes A, B et C, et plage du premier nombre.",
  "ls.22.h2": "Partie hôte tout à 0 ou tout à 1",
  "ls.22.p2": "L'adresse dont les bits de la partie hôte sont tous à 0 est l'[[netaddr:adresse réseau]] : elle désigne le réseau lui-même. Celle dont tous les bits sont à 1 est l'[[bcastaddr:adresse de diffusion]] : elle sert à envoyer à tout le réseau. Ces deux adresses ne peuvent pas être données aux appareils ; on peut donc en utiliser le nombre de combinaisons de la partie hôte moins 2.",
  "ls.22.cap2": "Le réseau 192.168.1.0–255. Les appareils peuvent utiliser 1–254, soit 254 adresses.",
  "ls.22.h3": "Une adresse pour soi-même",
  "ls.22.p3": "Les adresses qui commencent par 127 sont des [[loopback:adresses de bouclage]] : elles désignent l'appareil lui-même. La plus utilisée est 127.0.0.1. Les données envoyées à cette adresse ne sortent pas sur le réseau et reviennent à l'appareil ; c'est pratique pour tester des programmes sur son ordinateur.",
  "ls.22.cap3": "Les données envoyées à 127.0.0.1 ne sortent pas ; elles reviennent au même ordinateur.",
  "ls.22.pt1": "En [[ipclass:classes]] A, B et C, la partie réseau fait 8, 16 et 24 bits.",
  "ls.22.pt2": "Partie hôte à 0 : [[netaddr:adresse réseau]] ; à 1 : [[bcastaddr:adresse de diffusion]].",
  "ls.22.pt3": "Les [[loopback:adresses de bouclage]] comme 127.0.0.1 désignent l'appareil lui-même."
};
