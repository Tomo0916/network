/* en: the text of lesson 16 (js/lessons.js) */
export default {
  "ls.16.lead": "[[ethernet:Ethernet]] is the most widely used Layer 1 and Layer 2 standard for LANs. In this lesson you learn the shape of an Ethernet frame, how broken frames are found, and the rule for sharing a cable.",
  "ls.16.h1": "The Ethernet frame",
  "ls.16.p1": "An Ethernet frame is made of, from the front, the [[preamble:preamble]] (8 bytes), the destination MAC address (6 bytes), the source MAC address (6 bytes), the type (2 bytes), the data (46–1500 bytes) and the [[fcs:FCS]] (4 bytes). The type shows what is inside the data, for example IP or ARP.",
  "ls.16.cap1": "The shape of an Ethernet frame. The destination MAC, source MAC and type make up the header.",
  "ls.16.h2": "Finding mistakes with the FCS",
  "ls.16.p2": "The sender calculates a value from the contents of the frame and adds it at the end as the [[fcs:FCS]]. The receiver does the same calculation. If the result equals the FCS, the frame arrived correctly. If not, the receiver decides it was broken on the way, for example by [[noise:noise]], and drops the frame.",
  "ls.16.cap2": "Top: the result equals the FCS, so the frame is taken. Bottom: the data was broken, the result differs, so it is dropped.",
  "ls.16.h3": "CSMA/CD: the rule for sharing a cable",
  "ls.16.p3": "Ethernet that shares one cable, for example through a hub, sends with a rule called [[csmacd:CSMA/CD]]. (1) Before sending, listen to the cable and check that nobody is sending. (2) Anyone may use the same cable. (3) If you notice a collision while sending, stop at once, wait a random amount of time, and send again. Because everyone waits a different time, sending at the same moment again becomes less likely.",
  "ls.16.cap3": "The flow of CSMA/CD: listen before sending, and after a collision wait a random time and listen again.",
  "ls.16.pt1": "An Ethernet frame: preamble, destination MAC, source MAC, type, data, FCS.",
  "ls.16.pt2": "The [[fcs:FCS]] finds broken frames so they can be dropped.",
  "ls.16.pt3": "[[csmacd:CSMA/CD]]: listen before sending; after a collision, wait a random time and send again."
};
