/* en: the text of lesson 27 (js/lessons.js) */
export default {
  "ls.27.lead": "IP addresses are numbers, so they are hard for people to remember. So we use names like \"www.example.com\". [[dns:DNS]] is the system that connects names and IP addresses.",
  "ls.27.h1": "From a name to an IP address",
  "ls.27.p1": "People use [[domain:domain names]], and computers communicate with IP addresses. When you type a domain name into a browser, the computer first asks a DNS server: \"What is the IP address of this name?\" Finding the IP address from a name is called name resolution.",
  "ls.27.cap1": "The computer asks about a name, and the DNS server answers with the IP address.",
  "ls.27.h2": "The levels of a domain name",
  "ls.27.p2": "A domain name is a tree of levels separated by dots. The further right, the higher the level. At the top is the root; under it come \"jp\" and \"com\", then \"co.jp\", then the name of the organisation, and so on. Different DNS servers share the work of managing each level.",
  "ls.27.cap2": "www.example.co.jp is followed as root → jp → co → example → www.",
  "ls.27.h3": "How name resolution works",
  "ls.27.p3": "If the DNS server that the computer asks does not know the answer, it asks in order, starting from the root server. The root says \"for jp, ask this server\", the jp server names the next server, and so on, until the answer is reached. The answer is kept for a while, so the second time it can answer at once.",
  "ls.27.cap3": "The DNS server asks the servers for root → jp → example.co.jp in order.",
  "ls.27.pt1": "[[dns:DNS]] connects [[domain:domain names]] and IP addresses.",
  "ls.27.pt2": "A domain name is a tree of levels; the further right, the higher the level.",
  "ls.27.pt3": "The answer is found by following the levels from the root, and kept for a while."
};
