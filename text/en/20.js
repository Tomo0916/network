/* en: the text of lesson 20 (js/lessons.js) */
export default {
  "ls.20.lead": "[[ip:IP]] (Internet Protocol) is the main protocol of layer 3. Almost every device on the Internet communicates with IP.",
  "ls.20.h1": "IP runs on many kinds of networks",
  "ls.20.p1": "Under IP there are many kinds of layer 2, such as Ethernet and wireless LAN. IP works the same on all of them. IP also only tries its best to deliver; it does not check whether the data arrived. When checking is needed, TCP in the upper layer does it.",
  "ls.20.cap1": "IP works the same way on top of many kinds of layer 2.",
  "ls.20.h2": "The shape of an IP packet",
  "ls.20.p2": "A unit of data sent with IP is called an IP [[packet:packet]]. A [[header:header]] is put in front of the packet. It holds the source IP address, the destination IP address, the [[ttl:TTL]] (how many routers it may still pass) and more. Routers read this header to decide where to send the packet.",
  "ls.20.cap2": "An IP packet is made of an IP header and data.",
  "ls.20.h3": "Packets travel inside frames",
  "ls.20.p3": "An IP packet cannot go on the wire by itself. It is put inside a layer 2 frame ([[encap:encapsulation]]) and carried. Each time it passes a router, the outer frame is made again, but the destination of the IP packet inside stays the same to the end.",
  "ls.20.cap3": "A router opens the frame, takes out the packet, and puts it into a new frame for the next section.",
  "ls.20.pt1": "[[ip:IP]] is the main layer 3 protocol. It does not check whether data arrived.",
  "ls.20.pt2": "The [[header:header]] of an IP [[packet:packet]] holds the source and destination IP addresses and more.",
  "ls.20.pt3": "Frames are made again for each section, but the destination of the IP packet does not change."
};
