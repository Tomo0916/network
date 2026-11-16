/* en: the text of lesson 18 (js/lessons.js) */
export default {
  "ls.18.lead": "With a switch, devices can use full duplex: sending and receiving at the same time. In this lesson you learn the difference between half duplex and full duplex, and the buffering that makes it work.",
  "ls.18.h1": "Half duplex and full duplex",
  "ls.18.p1": "Communication that cannot send and receive at the same time, and does one at a time, is called [[halfduplex:half duplex]]. Like a walkie-talkie, the speaker and the listener take turns. Communication that can do both at once is [[fullduplex:full duplex]]. Like a telephone, you can hear the other person even while you talk.",
  "ls.18.cap1": "Left: half duplex takes turns on one road. Right: full duplex has separate roads out and back, so both can be used at once.",
  "ls.18.h2": "Why full duplex has no collisions",
  "ls.18.p2": "Inside a LAN cable there are separate wires for sending and for receiving. When two devices are connected one to one, the sending signal and the receiving signal travel on different wires, so they never crash. When many devices share the same wires, as with a hub, they cannot be divided like this, so it becomes half duplex.",
  "ls.18.cap2": "The PC's sending wire (TX) connects to the switch's receiving side (RX), and the switch's sending wire to the PC's receiving side.",
  "ls.18.h3": "Buffering",
  "ls.18.p3": "Sometimes frames for the same destination arrive at a switch from different ports at the same time. The switch keeps the frames in memory for a moment and sends them out in turn. This is called [[buffering:buffering]]. Thanks to buffering, there are no collisions in a switch. With full duplex, [[csmacd:CSMA/CD]] is not needed either.",
  "ls.18.cap3": "Frames for C that arrive from A and B at the same time are kept in the buffer and sent one at a time.",
  "ls.18.pt1": "[[halfduplex:Half duplex]]: send or receive, one at a time. [[fullduplex:Full duplex]]: both at once.",
  "ls.18.pt2": "In full duplex the sending and receiving wires are separate, so there are no collisions and no need for [[csmacd:CSMA/CD]].",
  "ls.18.pt3": "A switch uses [[buffering:buffering]] to send frames that arrive together one after another."
};
