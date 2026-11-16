/* =========================================================
 * facts.js — number and order questions ("How many bits is a MAC address?").
 * The question text lives in i18n/<lang>.js as  f.<id> .
 *
 * id     lowercase letters + digits, never change it later
 * word   the term this question belongs to (for ranges and review)
 * opts   four choices, THE FIRST ONE IS CORRECT (they are shuffled on screen).
 *        A choice is one of:
 *          '48'                       text shown as it is in every language
 *          { k: 'dm.bytes', v: {n: 8} } a text from i18n (with values)
 *          { seq: ['w:preamble', 'dm.fDst', …] }  a sequence joined with →
 *                                     ('w:<id>' = the Japanese term of a word)
 * ========================================================= */
const B = n => ({ k: 'dm.bytes', v: { n } });
const SEQ = (...a) => ({ seq: a });
export const FACTS = [
  { id: 'macbits', word: 'mac', opts: ['48', '32', '64', '128'] },
  { id: 'machex', word: 'mac', opts: ['12', '8', '16', '32'] },
  { id: 'bcastmac', word: 'broadcast', opts: ['FF:FF:FF:FF:FF:FF', '00:00:00:00:00:00', '01:00:5E:00:00:01', '00:1A:2B:3C:4D:5E'] },
  { id: 'mcastmac', word: 'multicast', opts: ['01:00:5E:00:00:01', 'FF:FF:FF:FF:FF:FF', '00:00:00:00:00:00', '00:1A:2B:3C:4D:5E'] },
  { id: 'cablemax', word: 'attenuation', opts: ['100 m', '10 m', '500 m', '1 km'] },
  { id: 'gbps', word: 'bps', opts: ['1,000,000,000', '1,000,000', '1,000', '1,000,000,000,000'] },
  { id: 'gbpsmbps', word: 'bps', opts: ['1000', '100', '10', '10000'] },
  { id: 'hublayer', word: 'hub', opts: ['1', '2', '3', '4'] },
  { id: 'repeaterlayer', word: 'repeater', opts: ['1', '2', '3', '4'] },
  { id: 'switchlayer', word: 'switch', opts: ['2', '1', '3', '4'] },
  { id: 'nicmaclayer', word: 'mac', opts: ['2', '1', '3', '4'] },
  { id: 'preamblelen', word: 'preamble', opts: [B(8), B(6), B(4), B(2)] },
  { id: 'fcslen', word: 'framing', opts: [B(4), B(2), B(6), B(8)] },
  { id: 'datalen', word: 'ethernet', opts: [B('46–1500'), B('64–1518'), B('8–64'), B('1–100')] },
  { id: 'frameorder', word: 'framing', opts: [
    SEQ('w:preamble', 'dm.fDst', 'dm.fSrc', 'dm.fType', 'dm.fData', 'dm.fFcs'),
    SEQ('dm.fDst', 'dm.fSrc', 'w:preamble', 'dm.fType', 'dm.fData', 'dm.fFcs'),
    SEQ('w:preamble', 'dm.fSrc', 'dm.fDst', 'dm.fType', 'dm.fData', 'dm.fFcs'),
    SEQ('w:preamble', 'dm.fDst', 'dm.fSrc', 'dm.fData', 'dm.fType', 'dm.fFcs')] },
  { id: 'csmaorder', word: 'csmacd', opts: [
    SEQ('fx.listen', 'fx.send', 'fx.detect', 'fx.wait', 'fx.resend'),
    SEQ('fx.send', 'fx.listen', 'fx.detect', 'fx.wait', 'fx.resend'),
    SEQ('fx.listen', 'fx.send', 'fx.wait', 'fx.detect', 'fx.resend'),
    SEQ('fx.send', 'fx.detect', 'fx.listen', 'fx.resend', 'fx.wait')] },
  // ---- Layer 3 ----
  { id: 'ipv4bits', word: 'ipaddress', opts: ['32', '48', '64', '128'] },
  { id: 'octetbits', word: 'ipaddress', opts: ['8', '4', '16', '32'] },
  { id: 'octetmax', word: 'ipaddress', opts: ['255', '256', '99', '1024'] },
  { id: 'mask24', word: 'subnetmask', opts: ['255.255.255.0', '255.255.0.0', '255.255.255.255', '255.0.0.0'] },
  { id: 'mask16', word: 'prefix', opts: ['/16', '/8', '/24', '/32'] },
  { id: 'hosts24', word: 'hostpart', opts: ['254', '256', '255', '24'] },
  { id: 'netaddr24', word: 'netaddr', opts: ['192.168.1.0', '192.168.1.255', '192.168.1.1', '192.168.0.0'] },
  { id: 'bcast24', word: 'bcastaddr', opts: ['192.168.1.255', '192.168.1.0', '192.168.1.254', '255.255.0.0'] },
  { id: 'privateone', word: 'privateip', opts: ['192.168.10.5', '8.8.8.8', '133.10.1.1', '210.152.1.1'] },
  { id: 'iplayer', word: 'ip', opts: ['3', '2', '4', '1'] },
  { id: 'routerlayer', word: 'router', opts: ['3', '2', '1', '4'] },
  { id: 'ttlrouter', word: 'ttl', opts: [{ k: 'fx.ttlDown' }, { k: 'fx.ttlUp' }, { k: 'fx.ttlZero' }, { k: 'fx.ttlSame' }] },
  { id: 'arporder', word: 'arp', opts: [
    SEQ('fx.arpAsk', 'fx.arpReply', 'fx.arpSave', 'fx.arpSend'),
    SEQ('fx.arpSend', 'fx.arpAsk', 'fx.arpReply', 'fx.arpSave'),
    SEQ('fx.arpReply', 'fx.arpAsk', 'fx.arpSave', 'fx.arpSend'),
    SEQ('fx.arpAsk', 'fx.arpSave', 'fx.arpReply', 'fx.arpSend')] },
  { id: 'dhcporder', word: 'dhcp', opts: [
    SEQ('fx.dDiscover', 'fx.dOffer', 'fx.dRequest', 'fx.dAck'),
    SEQ('fx.dRequest', 'fx.dOffer', 'fx.dDiscover', 'fx.dAck'),
    SEQ('fx.dDiscover', 'fx.dRequest', 'fx.dOffer', 'fx.dAck'),
    SEQ('fx.dOffer', 'fx.dDiscover', 'fx.dAck', 'fx.dRequest')] },
  { id: 'pingproto', word: 'ping', opts: [SEQ('w:icmp'), SEQ('w:arp'), SEQ('w:dhcp'), SEQ('w:nat')] },
  { id: 'gwsame', word: 'gateway', opts: ['192.168.1.1', '192.168.2.1', '10.0.0.1', '192.168.1.255'] },
  { id: 'osilayers', word: 'osi', opts: ['7', '4', '5', '8'] },
  { id: 'tcpiplayers', word: 'tcpip', opts: ['4', '7', '3', '5'] },
  { id: 'osiorder', word: 'osi', opts: [SEQ('fx.osi1', 'fx.osi2', 'fx.osi3', 'fx.osi4'), SEQ('fx.osi2', 'fx.osi1', 'fx.osi3', 'fx.osi4'),
    SEQ('fx.osi1', 'fx.osi3', 'fx.osi2', 'fx.osi4'), SEQ('fx.osi4', 'fx.osi3', 'fx.osi2', 'fx.osi1')] },
  { id: 'byte', word: 'bit', opts: ['8', '4', '16', '1024'] },
  { id: 'dupcoll', word: 'fullduplex', opts: [{ k: 'fx.collNone' }, { k: 'fx.collMore' }, { k: 'fx.collSame' }, { k: 'fx.collAlways' }] },
  { id: 'classarange', word: 'ipclass', opts: ['1–126', '128–191', '192–223', '224–239'] },
  { id: 'classcmask', word: 'ipclass', opts: ['255.255.255.0', '255.255.0.0', '255.0.0.0', '255.255.255.255'] },
  { id: 'loopbackaddr', word: 'loopback', opts: ['127.0.0.1', '192.168.0.1', '0.0.0.0', '255.255.255.255'] },
  { id: 'ripmax', word: 'rip', opts: ['15', '16', '255', '30'] },
  { id: 'tracertproto', word: 'tracert', opts: [SEQ('w:icmp'), SEQ('w:arp'), SEQ('w:dhcp'), SEQ('w:dns')] },
  { id: 'cidr26', word: 'cidr', opts: ['255.255.255.192', '255.255.255.128', '255.255.255.224', '255.255.255.0'] },
  { id: 'handshakeorder', word: 'handshake', opts: ['SYN → SYN+ACK → ACK', 'SYN → ACK → SYN+ACK', 'ACK → SYN → SYN+ACK', 'SYN+ACK → SYN → ACK'] },
  { id: 'httpport', word: 'wellknown', opts: ['80', '443', '53', '25'] },
  { id: 'httpsport', word: 'wellknown', opts: ['443', '80', '22', '21'] },
  { id: 'dnsport', word: 'wellknown', opts: ['53', '80', '443', '67'] },
  { id: 'wellknownrange', word: 'wellknown', opts: ['0–1023', '1024–49151', '49152–65535', '0–255'] },
  { id: 'portbits', word: 'port', opts: ['16', '8', '32', '48'] }
];
export const FACT_BY_ID = Object.fromEntries(FACTS.map(f => [f.id, f]));
export const factsOf = wordId => FACTS.filter(f => f.word === wordId);
/** every i18n key a fact choice needs (for tools/check.mjs) */
export const factKeys = () => [...new Set(FACTS.flatMap(f => f.opts.flatMap(o => typeof o === 'string' ? [] : o.k ? [o.k] : o.seq.filter(t => !t.startsWith('w:')))))];
