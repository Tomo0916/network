/* en: the text of lesson 22 (js/lessons.js) */
export default {
  "ls.22.lead": "How do we know how much of an IP address is the network part? The first way to decide was \"classes\". Some IP addresses also have special meanings.",
  "ls.22.h1": "IP address classes",
  "ls.22.p1": "With [[ipclass:IP address classes]], the first number decides the length of the network part. In class A the first 8 bits are the network part, in class B the first 16 bits, and in class C the first 24 bits. Class A is for large networks, and class C is for small ones.",
  "ls.22.cap1": "The lengths of the network part and host part in classes A, B and C, and the range of the first number.",
  "ls.22.h2": "Host part all 0s or all 1s",
  "ls.22.p2": "The address whose host part bits are all 0 is the [[netaddr:network address]]; it stands for the network itself. The address with all 1s is the [[bcastaddr:broadcast address]]; it is used to send to everyone in the network. These two cannot be given to devices, so the number you can use is the number of host part patterns minus 2.",
  "ls.22.cap2": "The network 192.168.1.0–255. Devices can use 1–254: 254 addresses.",
  "ls.22.h3": "An address for yourself",
  "ls.22.p3": "Addresses starting with 127 are [[loopback:loopback addresses]]; they mean the device itself. 127.0.0.1 is the most common. Data sent to this address does not go out to the network but comes back to you, so it is handy for testing programs on your own computer.",
  "ls.22.cap3": "Data sent to 127.0.0.1 does not go out; it comes back to the same computer.",
  "ls.22.pt1": "In [[ipclass:classes]] A, B and C the network part is 8, 16 and 24 bits.",
  "ls.22.pt2": "Host part all 0s is the [[netaddr:network address]]; all 1s is the [[bcastaddr:broadcast address]].",
  "ls.22.pt3": "[[loopback:Loopback addresses]] such as 127.0.0.1 mean the device itself."
};
