/* en: the text of lesson 15 (js/lessons.js) */
export default {
  "ls.15.lead": "When many devices share one network, each frame needs an address that shows who it is for. The Layer 2 address is the [[mac:MAC address]]. In this lesson you learn how a MAC address is built and the three kinds of destination.",
  "ls.15.h1": "How a MAC address is built",
  "ls.15.p1": "A [[mac:MAC address]] is a 48-bit number written into each NIC at the factory. It is usually written in six groups of two hexadecimal digits, such as 00:1A:2B:3C:4D:5E. The first 24 bits are the maker's number (OUI), and the last 24 bits are a serial number given by the maker.",
  "ls.15.cap1": "A MAC address is 48 bits. The first 3 bytes are the maker number, the last 3 bytes the serial number.",
  "ls.15.h2": "Three kinds of destination",
  "ls.15.p2": "Sending to one device is [[unicast:unicast]], sending to everyone in the same network is [[broadcast:broadcast]], and sending only to a set group is [[multicast:multicast]]. The destination MAC address for broadcast is FF:FF:FF:FF:FF:FF, where all 48 bits are 1.",
  "ls.15.cap2": "From the left: unicast (one device), broadcast (everyone), multicast (a group). Green devices receive.",
  "ls.15.h3": "The NIC decides whether to take a frame",
  "ls.15.p3": "The header of an [[ethernet:Ethernet]] frame holds the destination MAC address and the source MAC address. A NIC looks at the destination of each arriving frame. If it is its own MAC address, a broadcast, or a multicast group it has joined, it takes the frame. Otherwise it drops it.",
  "ls.15.cap3": "A NIC looks only at the destination MAC address to decide whether to take or drop a frame.",
  "ls.15.pt1": "A [[mac:MAC address]] is 48 bits: 24 bits of maker number and 24 bits of serial number.",
  "ls.15.pt2": "To one = [[unicast:unicast]], to everyone = [[broadcast:broadcast]], to a group = [[multicast:multicast]].",
  "ls.15.pt3": "A NIC looks at the destination MAC address and drops the frame if it is not for it."
};
