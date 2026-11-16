/* en: the text of lesson 12 (js/lessons.js) */
export default {
  "ls.12.lead": "A signal moving through a cable does not always arrive clean. In this lesson you learn three troubles, signals that get weak, get disturbed or crash into each other, and what to do about them.",
  "ls.12.h1": "Attenuation: weaker the further it goes",
  "ls.12.p1": "A signal gets a little weaker as it moves through a cable. This is called [[attenuation:attenuation]]. If it gets too weak, the receiver can no longer tell 0 from 1. That is why LAN cables have a maximum length (100 m for the common kind).",
  "ls.12.cap1": "A signal that is big just after sending gets smaller the further it goes, and finally cannot be read.",
  "ls.12.h2": "Noise: disturbance from outside",
  "ls.12.p2": "Extra electricity that gets in from things around the cable, such as motors or power cables, is called [[noise:noise]]. When noise is added to a signal, its shape breaks and mistakes happen, such as a 0 looking like a 1. The wires inside a LAN cable are twisted in pairs to make noise weaker.",
  "ls.12.cap2": "When noise is added to a clean signal (top), its shape breaks and it is read wrongly (bottom).",
  "ls.12.h3": "Collision: signals crash into each other",
  "ls.12.p3": "When several devices share one wire and two of them send at the same time, the signals overlap and break. This is a [[collision:collision]]. Nobody can read a collided signal correctly.",
  "ls.12.cap3": "When signals from the left and right overlap, the result is neither signal and cannot be read.",
  "ls.12.h4": "The fix: a repeater",
  "ls.12.p4": "The answer to attenuation is a [[repeater:repeater]]. A repeater takes a weak signal, brings it back to its original strength and clean shape, and sends it on. This lets the signal reach further. But a repeater only cleans up and resends the signal, so it cannot prevent collisions.",
  "ls.12.cap4": "A repeater brings a weak signal back to full strength and sends it on.",
  "ls.12.pt1": "[[attenuation:Attenuation]]: a signal gets weaker the further it goes, so cables have a maximum length.",
  "ls.12.pt2": "[[noise:Noise]]: extra electricity from outside breaks the shape of a signal.",
  "ls.12.pt3": "[[collision:Collision]]: signals sent at the same time overlap and break. The fix for attenuation is a [[repeater:repeater]]."
};
