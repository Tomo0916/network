/* fr: the text of lesson 13 (js/lessons.js) */
export default {
  "ls.13.lead": "Un [[hub:concentrateur (hub)]] est un appareil qui rassemble plusieurs ordinateurs en un point et les relie par des câbles réseau. Son fonctionnement est très simple, et cette simplicité est aussi son point faible.",
  "ls.13.h1": "Fonctionnement : vers tous les ports",
  "ls.13.p1": "Le concentrateur renvoie tel quel le signal reçu sur un port vers tous les autres ports. Il ne regarde pas qui est le destinataire. Remettre le signal en forme et le renvoyer, c'est le travail d'un [[repeater:répéteur]] : on peut donc voir le concentrateur comme un répéteur à plusieurs ports. Comme il ne lit pas les adresses, c'est un appareil de couche 1.",
  "ls.13.cap1": "Quand le PC A envoie au PC C, le concentrateur envoie à B, C et D. B et D jettent le signal, qui ne leur est pas destiné.",
  "ls.13.h2": "Le point faible : les collisions",
  "ls.13.p2": "Les appareils reliés à un concentrateur partagent en fait un seul fil. Si deux d'entre eux envoient en même temps, les signaux se heurtent dans le concentrateur et sont détruits. C'est une [[collision:collision]]. Un appareil relié à un concentrateur ne peut donc pas envoyer et recevoir en même temps : c'est le [[halfduplex:semi-duplex]].",
  "ls.13.cap2": "Si A et C envoient en même temps, les signaux entrent en collision. B et D ne reçoivent qu'un signal abîmé, et A et C doivent renvoyer.",
  "ls.13.h3": "Domaine de collision",
  "ls.13.p3": "La zone touchée par une collision s'appelle un [[colldomain:domaine de collision]]. Tous les appareils d'un concentrateur forment un seul domaine de collision. Plus il y a d'appareils, plus les collisions sont fréquentes et plus le réseau ralentit. C'est le [[switch:commutateur]] qui résout ce problème (leçon 17).",
  "ls.13.cap3": "Avec un concentrateur, les quatre PC forment un seul domaine. Avec un commutateur, chaque port est séparé, soit quatre domaines.",
  "ls.13.h4": "Vérifiez avec l'animation",
  "ls.13.p4": "Laissez « hub » sélectionné, choisissez un expéditeur et un destinataire, puis envoyez. Observez la trame arriver aussi aux PC qui ne sont pas destinataires, et le nombre de trames livrées pour rien. Passez ensuite à « switch » et envoyez de la même façon pour voir la différence.",
  "ls.13.pt1": "Le concentrateur envoie le signal reçu vers tous les autres ports, sans regarder le destinataire.",
  "ls.13.pt2": "C'est un appareil de couche 1, comparable à un [[repeater:répéteur]] à plusieurs ports.",
  "ls.13.pt3": "Tous les appareils d'un concentrateur forment un seul [[colldomain:domaine de collision]] : plus d'appareils, plus de collisions.",
  "ls.13.cap4": "Un répéteur a deux ports. Un concentrateur fait le même travail avec beaucoup de ports."
};
