/* en: the text of lesson 24 (js/lessons.js) */
export default {
  "ls.24.lead": "With classes, there are only three sizes of network. So a way to choose the length of the network part freely, without classes, came into use. This is [[cidr:CIDR]] (classless addressing).",
  "ls.24.h1": "Classes waste addresses",
  "ls.24.p1": "Class C allows 254 devices, and class B about 65,000. If you want a network for 500 devices, class C is too small, and with class B most addresses stay unused. IPv4 addresses are limited, so this waste became a big problem.",
  "ls.24.cap1": "Using class B for 500 devices wastes more than 65,000 addresses.",
  "ls.24.h2": "Writing the prefix length",
  "ls.24.p2": "In CIDR, the length of the network part is written after the address with \"/\" and a number. This number is the [[prefix:prefix length]]. For example, 192.168.1.0/26 means the first 26 bits are the network part, and the mask is 255.255.255.192. The host part is 6 bits, so devices can use 62 addresses.",
  "ls.24.cap2": "/26 is a mask with 26 ones in a row. The host part is the other 6 bits.",
  "ls.24.h3": "Putting networks together",
  "ls.24.p3": "CIDR can also write neighbouring networks together as one. For example, the four networks 192.168.0.0/24 to 192.168.3.0/24 can be shown as one: 192.168.0.0/22. Routers have fewer routes to remember, which keeps the routes of the whole Internet small.",
  "ls.24.cap3": "Four /24 networks in a row are put together as one /22.",
  "ls.24.pt1": "[[cidr:CIDR]] chooses the length of the network part freely, without classes.",
  "ls.24.pt2": "A [[prefix:prefix length]] such as \"/26\" gives the number of network part bits.",
  "ls.24.pt3": "Neighbouring networks can be put together to reduce the number of routes."
};
