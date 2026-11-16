/* en: the text of lesson 19 (js/lessons.js) */
export default {
  "ls.19.lead": "So far we have seen how data travels inside one network. Layer 3 is the layer that connects networks to each other and carries data to a partner far away.",
  "ls.19.h1": "Connecting networks",
  "ls.19.p1": "A LAN is the network inside one building or room. When many LANs are connected with [[router:routers]], we get a network of networks. This is called an [[internetwork:internetwork]]. The Internet, which connects networks all over the world, is the biggest example.",
  "ls.19.cap1": "Three LANs joined by two routers become one large internetwork.",
  "ls.19.h2": "Layer 2 and layer 3 share the work",
  "ls.19.p2": "Layer 2 (Ethernet and so on) can only deliver data to the next device inside the same network. Layer 3 carries data from the sender to the final destination, across many networks. Layer 2 carries it one section at a time, and layer 3 decides where the whole trip goes.",
  "ls.19.cap2": "Layer 2 carries data section by section. Layer 3 takes care of the whole way from sender to destination.",
  "ls.19.h3": "An address and directions",
  "ls.19.p3": "To deliver data far away, two things are needed. One is an address that tells partners apart all over the world: the [[ipaddress:IP address]]. The other is choosing the way to the destination. This is called [[routing:routing]], and routers do it.",
  "ls.19.pt1": "Networks connected with [[router:routers]] form an [[internetwork:internetwork]].",
  "ls.19.pt2": "Layer 2 delivers to the next device; layer 3 delivers to the final destination.",
  "ls.19.pt3": "Layer 3 needs an address ([[ipaddress:IP address]]) and directions ([[routing:routing]])."
};
