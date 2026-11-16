/* fr: the text of lesson 18 (js/lessons.js) */
export default {
  "ls.18.lead": "Avec un commutateur, les appareils peuvent communiquer en duplex intégral : envoyer et recevoir en même temps. Dans cette leçon, vous verrez la différence entre semi-duplex et duplex intégral, et la mise en mémoire tampon qui rend cela possible.",
  "ls.18.h1": "Semi-duplex et duplex intégral",
  "ls.18.p1": "Une communication qui ne peut pas envoyer et recevoir en même temps, et fait l'un puis l'autre, s'appelle le [[halfduplex:semi-duplex]]. Comme avec un talkie-walkie, celui qui parle et celui qui écoute alternent. Une communication qui peut faire les deux à la fois est le [[fullduplex:duplex intégral]]. Comme au téléphone, on entend l'autre même en parlant.",
  "ls.18.cap1": "À gauche : le semi-duplex utilise une seule voie à tour de rôle. À droite : le duplex intégral a une voie aller et une voie retour, utilisables en même temps.",
  "ls.18.h2": "Pourquoi pas de collision en duplex intégral ?",
  "ls.18.p2": "Dans un câble réseau, il y a des fils séparés pour envoyer et pour recevoir. Quand deux appareils sont reliés un à un, le signal envoyé et le signal reçu passent par des fils différents et ne se heurtent jamais. Quand beaucoup d'appareils partagent les mêmes fils, comme avec un concentrateur, cette séparation est impossible : on est alors en semi-duplex.",
  "ls.18.cap2": "Le fil d'émission (TX) du PC va vers la réception (RX) du commutateur, et le fil d'émission du commutateur vers la réception du PC.",
  "ls.18.h3": "La mise en mémoire tampon",
  "ls.18.p3": "Il arrive que des trames pour la même destination arrivent en même temps sur différents ports d'un commutateur. Il les garde un instant en mémoire, puis les envoie l'une après l'autre. C'est la [[buffering:mise en mémoire tampon]]. Grâce à elle, il n'y a pas de collision dans un commutateur. En duplex intégral, [[csmacd:CSMA/CD]] n'est plus nécessaire non plus.",
  "ls.18.cap3": "Les trames pour C arrivées en même temps de A et B sont gardées en mémoire tampon et envoyées une par une.",
  "ls.18.pt1": "[[halfduplex:Semi-duplex]] : envoyer ou recevoir, l'un après l'autre. [[fullduplex:Duplex intégral]] : les deux à la fois.",
  "ls.18.pt2": "En duplex intégral, les fils d'émission et de réception sont séparés : pas de collision, pas besoin de [[csmacd:CSMA/CD]].",
  "ls.18.pt3": "Le commutateur utilise la [[buffering:mise en mémoire tampon]] pour envoyer l'une après l'autre les trames arrivées ensemble."
};
