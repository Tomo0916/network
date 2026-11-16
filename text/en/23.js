/* en: the text of lesson 23 (js/lessons.js) */
export default {
  "ls.23.lead": "With classes alone, one network can become very large. [[subnetting:Subnetting]] divides one network into smaller networks (subnets).",
  "ls.23.h1": "Borrowing bits from the host part",
  "ls.23.p1": "In subnetting, we borrow the first bits of the host part and make the network part longer. For example, if the class B network 172.16.0.0 uses its first three numbers as the network part, it can be divided into many small networks such as 172.16.1.0, 172.16.2.0 and so on. Dividing the network by department makes it easier to manage.",
  "ls.23.cap1": "A large class B network divided into small subnets, one per department.",
  "ls.23.h2": "Subnet mask",
  "ls.23.p2": "The [[subnetmask:subnet mask]] shows where the network part ends. It is a 32-bit number with 1 for the network part bits and 0 for the host part bits, written in decimal like an IP address. With 255.255.255.0, the first 24 bits are the network part.",
  "ls.23.cap2": "Where the mask is 1 is the network part; where it is 0 is the host part.",
  "ls.23.h3": "Calculating the network address",
  "ls.23.p3": "If you calculate the IP address and the subnet mask bit by bit with AND (1 only when both are 1), you get the network address. If your network address and the destination's are the same, the partner is in the same network. If they are different, a router has to carry the data.",
  "ls.23.cap3": "192.168.1.130 AND 255.255.255.192 gives 192.168.1.128.",
  "ls.23.pt1": "[[subnetting:Subnetting]] borrows the host part to divide a network into smaller ones.",
  "ls.23.pt2": "A [[subnetmask:subnet mask]] has 1 for the network part and 0 for the host part.",
  "ls.23.pt3": "IP address AND mask gives the network address."
};
