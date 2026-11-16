/* en: the text of lesson 17 (js/lessons.js) */
export default {
  "ls.17.lead": "A [[switch:switch]] looks like a hub, but it reads the destination MAC address of each frame and sends it only to the port that needs it. To do that, it learns by itself which device is on which port.",
  "ls.17.h1": "Learning the MAC address table",
  "ls.17.p1": "Every time a frame arrives, a switch writes its source MAC address and the number of the port it came in on into its [[mactable:MAC address table]]. In this way it learns, while traffic flows, who is on which port.",
  "ls.17.cap1": "When a frame arrives from PC A, the switch writes \"A is on port 1\" in its table.",
  "ls.17.h2": "Filtering and flooding",
  "ls.17.p2": "If the destination MAC address is in the table, the switch sends the frame only to that port. Because it does not send to the other ports, this is called [[macfilter:filtering]]. If the destination is not in the table yet, it has no choice but to send the frame to every port except the one it came from. This is [[flooding:flooding]]. Broadcasts are also sent to every port.",
  "ls.17.cap2": "Left: the switch knows the destination, so it sends only to C's port. Right: it does not know, so it sends to every port.",
  "ls.17.h3": "A collision domain for each port",
  "ls.17.p3": "A switch receives the signal on each port separately, keeps it for a moment and then sends it on. So each port has its own [[colldomain:collision domain]], and collisions do not spread over the whole network as with a hub. A switch is a Layer 2 device that uses MAC addresses.",
  "ls.17.cap3": "With a hub everyone is in one collision domain; with a switch each port is separate.",
  "ls.17.pt1": "A switch learns source MAC addresses and ports in its [[mactable:MAC address table]].",
  "ls.17.pt2": "If it knows the destination, one port ([[macfilter:filtering]]); if not, all ports ([[flooding:flooding]]).",
  "ls.17.pt3": "A switch is a Layer 2 device. Each port is its own collision domain."
};
