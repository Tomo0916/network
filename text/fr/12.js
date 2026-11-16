/* fr: the text of lesson 12 (js/lessons.js) */
export default {
  "ls.12.lead": "Un signal qui avance dans un câble n'arrive pas toujours propre. Dans cette leçon, vous verrez trois problèmes : le signal s'affaiblit, se perturbe ou entre en collision, et comment y remédier.",
  "ls.12.h1": "Atténuation : plus c'est loin, plus c'est faible",
  "ls.12.p1": "Un signal s'affaiblit peu à peu en avançant dans un câble. C'est l'[[attenuation:atténuation]]. S'il devient trop faible, le récepteur ne distingue plus 0 de 1. C'est pourquoi les câbles réseau ont une longueur maximale (100 m pour le modèle courant).",
  "ls.12.cap1": "Un signal fort au départ devient de plus en plus petit, jusqu'à devenir illisible.",
  "ls.12.h2": "Bruit : perturbation venue de l'extérieur",
  "ls.12.p2": "L'électricité parasite qui entre depuis l'environnement, moteurs ou câbles d'alimentation, s'appelle le [[noise:bruit]]. Quand du bruit s'ajoute au signal, sa forme se déforme et des erreurs apparaissent, par exemple un 0 qui ressemble à un 1. Les fils d'un câble réseau sont torsadés par paires pour réduire le bruit.",
  "ls.12.cap2": "Quand du bruit s'ajoute à un signal propre (en haut), sa forme se déforme et il est mal lu (en bas).",
  "ls.12.h3": "Collision : les signaux se heurtent",
  "ls.12.p3": "Quand plusieurs appareils partagent un fil et que deux envoient en même temps, les signaux se superposent et sont détruits. C'est une [[collision:collision]]. Personne ne peut lire correctement un signal entré en collision.",
  "ls.12.cap3": "Quand les signaux venus de gauche et de droite se superposent, on obtient une forme qui n'est ni l'un ni l'autre.",
  "ls.12.h4": "La solution : le répéteur",
  "ls.12.p4": "La réponse à l'atténuation est le [[repeater:répéteur]]. Il reçoit un signal affaibli, lui rend sa force et sa forme d'origine, puis le renvoie. Le signal peut ainsi aller plus loin. Mais comme il ne fait que remettre en forme et renvoyer, il n'empêche pas les collisions.",
  "ls.12.cap4": "Le répéteur rend sa force d'origine à un signal affaibli et le renvoie.",
  "ls.12.pt1": "[[attenuation:Atténuation]] : le signal s'affaiblit avec la distance ; les câbles ont donc une longueur maximale.",
  "ls.12.pt2": "[[noise:Bruit]] : de l'électricité parasite déforme le signal.",
  "ls.12.pt3": "[[collision:Collision]] : des signaux envoyés en même temps se superposent et sont détruits. Contre l'atténuation : le [[repeater:répéteur]]."
};
