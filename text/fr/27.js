/* fr: the text of lesson 27 (js/lessons.js) */
export default {
  "ls.27.lead": "Les adresses IP sont des nombres, difficiles à retenir pour les humains. On utilise donc des noms comme « www.example.com ». [[dns:DNS]] est le système qui relie les noms et les adresses IP.",
  "ls.27.h1": "D'un nom à une adresse IP",
  "ls.27.p1": "Les humains utilisent des [[domain:noms de domaine]], les ordinateurs communiquent avec des adresses IP. Quand on tape un nom de domaine dans le navigateur, l'ordinateur demande d'abord à un serveur DNS : « Quelle est l'adresse IP de ce nom ? ». Trouver l'adresse IP à partir d'un nom s'appelle la résolution de noms.",
  "ls.27.cap1": "L'ordinateur demande un nom, le serveur DNS répond avec l'adresse IP.",
  "ls.27.h2": "Les niveaux d'un nom de domaine",
  "ls.27.p2": "Un nom de domaine est un arbre de niveaux séparés par des points. Plus on va à droite, plus le niveau est haut. Tout en haut se trouve la racine, puis « jp » ou « com », puis « co.jp », puis le nom de l'organisation, etc. Chaque niveau est géré par des serveurs DNS différents.",
  "ls.27.cap2": "www.example.co.jp se suit ainsi : racine → jp → co → example → www.",
  "ls.27.h3": "Le déroulement de la résolution",
  "ls.27.p3": "Si le serveur DNS interrogé ne connaît pas la réponse, il demande dans l'ordre, en commençant par le serveur racine. La racine dit « pour jp, demandez à ce serveur », le serveur de jp indique le serveur suivant, et ainsi de suite jusqu'à la réponse. La réponse est gardée un moment, donc la deuxième fois il répond tout de suite.",
  "ls.27.cap3": "Le serveur DNS interroge dans l'ordre les serveurs de la racine → jp → example.co.jp.",
  "ls.27.pt1": "[[dns:DNS]] relie les [[domain:noms de domaine]] et les adresses IP.",
  "ls.27.pt2": "Un nom de domaine est un arbre de niveaux ; plus à droite, plus haut.",
  "ls.27.pt3": "La réponse se trouve en suivant les niveaux depuis la racine, puis est gardée un moment."
};
