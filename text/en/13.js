/* en: the text of lesson 13 (js/lessons.js) */
export default {
  "ls.13.lead": "A [[hub:hub]] is a device that gathers many computers in one place and connects them with LAN cables. It works in a very simple way, and that simple way is also its weak point.",
  "ls.13.h1": "How a hub works: out of every port",
  "ls.13.p1": "A hub sends the signal that arrives at one port out of every other port, just as it is. It does not look at who the destination is. Cleaning up the signal and sending it on is the same job a [[repeater:repeater]] does, so you can think of a hub as a repeater with many ports. Because it does not look at addresses, a hub is a Layer 1 device.",
  "ls.13.cap1": "When PC A sends to PC C, the hub sends it to B, C and D. B and D throw it away because it is not for them.",
  "ls.13.h2": "The weak point of a hub: collisions",
  "ls.13.p2": "Devices on a hub are like people sharing one single wire. If two of them send at the same time, the signals hit each other inside the hub and break. This is called a [[collision:collision]]. So a device on a hub cannot send and receive at the same time. This kind of communication is called [[halfduplex:half duplex]].",
  "ls.13.cap2": "If A and C send at the same time, the signals collide. B and D get only a broken signal, and A and C must send again.",
  "ls.13.h3": "Collision domain",
  "ls.13.p3": "The area that a collision affects is called a [[colldomain:collision domain]]. All the devices on one hub form a single collision domain. The more devices there are, the more often collisions happen, and the whole network slows down. A [[switch:switch]] solves this problem (lesson 17).",
  "ls.13.cap3": "With a hub, all four PCs are one collision domain. With a switch, each port is separate, so there are four.",
  "ls.13.h4": "Check it with the animation",
  "ls.13.p4": "Keep \"hub\" selected, choose a sender and a destination, and send. Watch the frame reach PCs that are not the destination, and look at the count of frames delivered for nothing. Then switch to \"switch\" and send the same way to see the difference.",
  "ls.13.pt1": "A hub sends a received signal out of every other port. It does not look at the destination.",
  "ls.13.pt2": "A hub is a Layer 1 device. You can think of it as a [[repeater:repeater]] with many ports.",
  "ls.13.pt3": "All devices on a hub form one [[colldomain:collision domain]]. More devices means more collisions.",
  "ls.13.cap4": "A repeater has two ports. A hub does the same job with many ports."
};
