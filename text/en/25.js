/* en: the text of lesson 25 (js/lessons.js) */
export default {
  "ls.25.lead": "A device on a network needs settings such as an IP address. Setting each device by hand is hard work, and mistakes happen. [[dhcp:DHCP]] is a protocol that gives out these settings automatically.",
  "ls.25.h1": "What DHCP gives",
  "ls.25.p1": "A DHCP server gives a connecting device a set of settings: an [[ipaddress:IP address]], a [[subnetmask:subnet mask]], a [[gateway:default gateway]], the address of a DNS server and more. At home, the router usually works as the DHCP server.",
  "ls.25.cap1": "A DHCP server gives out the settings needed for communication as one set.",
  "ls.25.h2": "Four messages",
  "ls.25.p2": "Four messages are exchanged before the device gets its settings. ① DISCOVER: the device looks for a server: \"Is there a DHCP server?\" ② OFFER: the server suggests: \"How about this address?\" ③ REQUEST: the device asks: \"I will use it.\" ④ ACK: the server agrees: \"Go ahead.\" The device has no IP address yet, so it sends DISCOVER as a [[broadcast:broadcast]].",
  "ls.25.cap2": "Four exchanges in the order DISCOVER → OFFER → REQUEST → ACK.",
  "ls.25.h3": "Addresses are lent",
  "ls.25.p3": "An address from DHCP is not given away; it is lent for a limited time. This time is called the lease. A device that keeps using the address asks for more time before the lease ends. An address that is no longer used goes back to the server and can be lent to another device.",
  "ls.25.cap3": "Ask for more time at about half of the lease. Give it back when you stop using it.",
  "ls.25.pt1": "[[dhcp:DHCP]] gives out settings such as IP addresses automatically.",
  "ls.25.pt2": "Four messages: DISCOVER → OFFER → REQUEST → ACK.",
  "ls.25.pt3": "Addresses are lent for a limited time (the lease)."
};
