/* en: the text of lesson 21 (js/lessons.js) */
export default {
  "ls.21.lead": "An [[ipaddress:IP address]] is a number that tells devices apart in an internetwork. Here we look at how IPv4 addresses are written and what is inside them.",
  "ls.21.h1": "32 bits in four parts",
  "ls.21.p1": "An IPv4 address is 32 bits. Thirty-two 0s and 1s are hard for people to read, so we split them into four groups of 8 bits, write each group as a decimal number, and join them with dots. 8 bits can show the numbers 0 to 255, so each of the four numbers is between 0 and 255.",
  "ls.21.cap1": "Written in binary, 192.168.1.10 becomes four groups of 8 bits.",
  "ls.21.h2": "Network part and host part",
  "ls.21.p2": "An IP address has two parts, a front part and a back part. The front part is the [[netpart:network part]]; it shows which network. The back part is the [[hostpart:host part]]; it shows which device in that network. Devices in the same network have the same network part.",
  "ls.21.cap2": "Every device in the left LAN has the network part 192.168.1. The host part tells them apart one by one.",
  "ls.21.h3": "Like a postal address",
  "ls.21.p3": "The network part is like the name of a town, and the host part is like the house number. Mail is first carried to the town, and then the house is found by its number. A [[router:router]] also looks at the network part first and carries the packet to the destination network.",
  "ls.21.pt1": "An IPv4 [[ipaddress:IP address]] is 32 bits, written as four decimal numbers of 8 bits each.",
  "ls.21.pt2": "The front is the [[netpart:network part]] (which network); the back is the [[hostpart:host part]] (which device).",
  "ls.21.pt3": "A router looks at the network part first."
};
