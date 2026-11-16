/* en: the text of lesson 26 (js/lessons.js) */
export default {
  "ls.26.lead": "Even if you know the IP address, you need the partner's MAC address to send a frame on Ethernet. [[arp:ARP]] is a protocol that finds a MAC address from an IP address.",
  "ls.26.h1": "An IP address is not enough",
  "ls.26.p1": "When a computer sends an IP packet, the packet is carried inside an Ethernet frame. The destination of the frame must be a [[mac:MAC address]]. But the computer only knows the partner's IP address. So it has to find the MAC address from the IP address.",
  "ls.26.cap1": "The destination IP address is known, but the destination MAC address for the frame is not.",
  "ls.26.h2": "How ARP works",
  "ls.26.p2": "First, ARP sends an ARP request to everyone as a [[broadcast:broadcast]]: \"Whoever has 192.168.1.20, tell me your MAC address.\" Only the device with that IP address sends back an ARP reply with its MAC address, as a [[unicast:unicast]]. The other devices throw the request away.",
  "ls.26.cap2": "The request goes to everyone (broadcast); the reply comes only from the owner (unicast).",
  "ls.26.h3": "The ARP table",
  "ls.26.p3": "The result is kept in the [[arptable:ARP table]] for a while. Next time the computer only has to look at the table, so it does not have to send ARP every time. But devices can change, so entries are deleted after some time. When the destination is in another network, the computer looks for the MAC address of the default gateway, not of the partner.",
  "ls.26.cap3": "The ARP table holds pairs of an IP address and a MAC address.",
  "ls.26.pt1": "[[arp:ARP]] finds a MAC address from an IP address.",
  "ls.26.pt2": "The request is a broadcast; the reply is a unicast.",
  "ls.26.pt3": "Results are kept in the [[arptable:ARP table]] for a while."
};
