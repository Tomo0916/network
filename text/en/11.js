/* en: the text of lesson 11 (js/lessons.js) */
export default {
  "ls.11.lead": "Layer 1 (the physical layer) turns data made of 0s and 1s into signals that can travel through cables or the air, and carries them to the next device. It sits at the very bottom of the network and supports all communication.",
  "ls.11.h1": "The job of Layer 1",
  "ls.11.p1": "Inside a computer, data is a row of 0s and 1s ([[bit:bits]]). But the numbers 0 and 1 do not flow through a cable. Layer 1 turns bits into signals, such as strong and weak electricity, flashes of light or changes in radio waves, and sends them out. The receiving side turns the signals back into bits.",
  "ls.11.cap1": "Layer 1 is the bottom of the OSI model. It turns the bits from the layers above into signals and sends them.",
  "ls.11.cap2": "An example of bits as an electrical signal: 1 is high voltage and 0 is low voltage (real methods are more clever).",
  "ls.11.h2": "Transmission media",
  "ls.11.p2": "The thing that carries a signal is called the [[media:transmission medium]]. There are three main kinds: LAN cable made of copper (electric signals), optical fiber made of thin glass (light signals), and radio waves that travel through the air (wireless LAN). Optical fiber sends fast over long distances. Radio needs no cable, but walls and other radio waves affect it more easily.",
  "ls.11.cap3": "Typical transmission media. From the left: LAN cable (electric), optical fiber (light), wireless (radio).",
  "ls.11.h3": "Interfaces and the NIC",
  "ls.11.p3": "The socket where a device connects a cable is called an [[interface:interface]]. In a computer, the [[nic:NIC]] does this job and converts between bits and signals. Speed is shown in [[bps:bps]], the number of bits sent per second.",
  "ls.11.cap4": "The sending NIC turns bits into a signal; the receiving NIC turns the signal back into bits.",
  "ls.11.pt1": "Layer 1 turns bits into signals and carries them to the next device.",
  "ls.11.pt2": "What carries a signal is the [[media:transmission medium]]: LAN cable, optical fiber, radio waves and so on.",
  "ls.11.pt3": "The [[nic:NIC]] converts between bits and signals. Speed is shown in [[bps:bps]]."
};
