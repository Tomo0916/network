/* en: the text of lesson 14 (js/lessons.js) */
export default {
  "ls.14.lead": "Layer 2 (the data link layer) delivers data correctly to the next device inside the same network. To do that, it divides the stream of bits into units called frames.",
  "ls.14.h1": "The job of Layer 2",
  "ls.14.p1": "Layer 1 only carries signals. It does not know where one piece of data starts and ends, or who it is for. Layer 2 writes the destination and the source on the data, marks where each piece starts and ends, and delivers it to the other device in the same network. Delivering across networks to far places is the job of Layer 3.",
  "ls.14.cap1": "Layer 2 delivers only to the next device inside the same network. Delivery across networks is the job of Layer 3.",
  "ls.14.h2": "Framing",
  "ls.14.p2": "Dividing the stream of bits into meaningful pieces is called [[framing:framing]], and each piece is called a frame. A frame is made of a [[header:header]] with the destination and other information, the data to carry, and a trailer with the [[fcs:FCS]] used to find mistakes.",
  "ls.14.cap2": "The basic shape of a frame: a header in front and a trailer behind, with the data in between.",
  "ls.14.cap3": "A never-ending stream of bits (top) is divided into units called frames (bottom).",
  "ls.14.h3": "Asynchronous communication and timing",
  "ls.14.p3": "The sender and the receiver do not share a clock. So Ethernet sends a fixed signal that repeats \"1010…\", the [[preamble:preamble]], before each frame. The receiver uses it to match the timing and then starts reading the data. A method like this, which matches the timing each time instead of sharing a clock, is called [[async:asynchronous communication]].",
  "ls.14.cap4": "The \"1010…\" of the preamble matches the timing, then reading the data begins.",
  "ls.14.pt1": "Layer 2 delivers data to the next device inside the same network.",
  "ls.14.pt2": "Dividing the stream of bits is [[framing:framing]]. Frame = header + data + trailer.",
  "ls.14.pt3": "In [[async:asynchronous communication]], the [[preamble:preamble]] matches the timing before reading."
};
