/* =========================================================
 * words.js — the network terms (skeleton only).
 * The explanations live in i18n/<lang>.js as  w.<id>.desc  and  w.<id>.tip .
 *
 * To add a term:
 *   1. add one line here (id = lowercase English, never change it later)
 *   2. add  w.<id>.desc  and  w.<id>.tip  to i18n/ja.js, easy.js, en.js
 *   3. run  node tools/check.mjs
 *
 * term     the Japanese term students learn
 * yomi     reading in kana (kanji terms and abbreviations only)
 * en       English name
 * group    group id (js/groups.js)
 * lesson   lesson number where the term is taught (js/groups.js LESSONS)
 * related  terms that are easy to confuse (used as wrong choices in the quiz)
 * demo     animation that shows this term (js/demos/)
 * ========================================================= */
export const WORDS = [
  // ---- Layer 1 basics ----
  { id: 'interface', term: 'インターフェース', en: 'Interface', group: 'l1', lesson: 1, related: ['nic', 'dce', 'protocol'] },
  { id: 'nic', term: 'NIC', yomi: 'ニック', en: 'Network Interface Card', group: 'l1', lesson: 1, related: ['interface', 'mac', 'dce'] },
  { id: 'dce', term: 'DCE', yomi: 'ディーシーイー', en: 'Data Circuit-terminating Equipment', group: 'l1', lesson: 1, related: ['nic', 'interface', 'repeater'] },
  { id: 'bps', term: 'bps', yomi: 'ビーピーエス', en: 'bits per second', group: 'l1', lesson: 1, related: ['protocol', 'mac', 'ethernet'] },
  // ---- signal problems ----
  { id: 'attenuation', term: '減衰', yomi: 'げんすい', en: 'Attenuation', group: 'signal', lesson: 1, related: ['noise', 'collision', 'repeater'], demo: 'repeater' },
  { id: 'noise', term: 'ノイズ', en: 'Noise', group: 'signal', lesson: 1, related: ['attenuation', 'collision', 'flooding'], demo: 'repeater' },
  { id: 'collision', term: '衝突', yomi: 'しょうとつ', en: 'Collision', group: 'signal', lesson: 1, related: ['noise', 'attenuation', 'csmacd'], demo: 'csmacd' },
  // ---- devices ----
  { id: 'hub', term: 'ハブ', en: 'Hub', group: 'devices', lesson: 1, related: ['switch', 'repeater', 'flooding'], demo: 'hubswitch' },
  { id: 'repeater', term: 'リピーター', en: 'Repeater', group: 'devices', lesson: 1, related: ['hub', 'switch', 'attenuation'], demo: 'repeater' },
  { id: 'switch', term: 'スイッチ', en: 'Switch', group: 'devices', lesson: 1, related: ['hub', 'repeater', 'flooding'], demo: 'hubswitch' },
  { id: 'flooding', term: 'フラッディング', en: 'Flooding', group: 'devices', lesson: 1, related: ['broadcast', 'hub', 'multicast'], demo: 'hubswitch' },
  // ---- Layer 2 basics ----
  { id: 'protocol', term: 'プロトコル', en: 'Protocol', group: 'l2', lesson: 2, related: ['ethernet', 'framing', 'csmacd'] },
  { id: 'ethernet', term: 'イーサネット', en: 'Ethernet', group: 'l2', lesson: 2, related: ['protocol', 'framing', 'nic'], demo: 'frame' },
  { id: 'framing', term: 'フレーミング', en: 'Framing', group: 'l2', lesson: 2, related: ['preamble', 'protocol', 'ethernet'], demo: 'frame' },
  { id: 'preamble', term: 'プリアンブル', en: 'Preamble', group: 'l2', lesson: 2, related: ['framing', 'mac', 'protocol'], demo: 'frame' },
  // ---- addressing ----
  { id: 'unicast', term: 'ユニキャスト', en: 'Unicast', group: 'addressing', lesson: 2, related: ['broadcast', 'multicast', 'flooding'], demo: 'cast' },
  { id: 'broadcast', term: 'ブロードキャスト', en: 'Broadcast', group: 'addressing', lesson: 2, related: ['multicast', 'unicast', 'flooding'], demo: 'cast' },
  { id: 'multicast', term: 'マルチキャスト', en: 'Multicast', group: 'addressing', lesson: 2, related: ['broadcast', 'unicast', 'flooding'], demo: 'cast' },
  // ---- MAC address and rules ----
  { id: 'mac', term: 'MACアドレス', yomi: 'マックアドレス', en: 'MAC address', group: 'mac', lesson: 2, related: ['nic', 'macfilter', 'bps'], demo: 'frame' },
  { id: 'csmacd', term: 'CSMA/CD', yomi: 'シーエスエムエー・シーディー', en: 'Carrier Sense Multiple Access / Collision Detection', group: 'mac', lesson: 2, related: ['collision', 'protocol', 'flooding'], demo: 'csmacd' },
  { id: 'macfilter', term: 'MACアドレスフィルタリング', yomi: 'マックアドレスフィルタリング', en: 'MAC address filtering', group: 'mac', lesson: 2, related: ['mac', 'switch', 'csmacd'] },
  // ---- Layer 3: IP basics ----
  { id: 'ip', term: 'IP', yomi: 'アイピー', en: 'Internet Protocol', group: 'l3', lesson: 3, related: ['ethernet', 'icmp', 'arp'] },
  { id: 'packet', term: 'パケット', en: 'Packet', group: 'l3', lesson: 3, related: ['framing', 'ttl', 'ip'], demo: 'route' },
  { id: 'ipaddress', term: 'IPアドレス', yomi: 'アイピーアドレス', en: 'IP address', group: 'l3', lesson: 3, related: ['mac', 'subnetmask', 'gateway'], demo: 'subnet' },
  { id: 'privateip', term: 'プライベートIPアドレス', yomi: 'プライベートアイピーアドレス', en: 'Private IP address', group: 'l3', lesson: 3, related: ['globalip', 'nat', 'ipaddress'] },
  { id: 'globalip', term: 'グローバルIPアドレス', yomi: 'グローバルアイピーアドレス', en: 'Global IP address', group: 'l3', lesson: 3, related: ['privateip', 'nat', 'ipaddress'] },
  // ---- network part and host part ----
  { id: 'netpart', term: 'ネットワーク部', yomi: 'ネットワークぶ', en: 'Network portion', group: 'subnet', lesson: 3, related: ['hostpart', 'netaddr', 'subnetmask'], demo: 'subnet' },
  { id: 'hostpart', term: 'ホスト部', yomi: 'ホストぶ', en: 'Host portion', group: 'subnet', lesson: 3, related: ['netpart', 'bcastaddr', 'subnetmask'], demo: 'subnet' },
  { id: 'subnetmask', term: 'サブネットマスク', en: 'Subnet mask', group: 'subnet', lesson: 3, related: ['prefix', 'netpart', 'gateway'], demo: 'subnet' },
  { id: 'prefix', term: 'プレフィックス長', yomi: 'プレフィックスちょう', en: 'Prefix length (CIDR notation)', group: 'subnet', lesson: 3, related: ['subnetmask', 'netpart', 'hostpart'], demo: 'subnet' },
  { id: 'netaddr', term: 'ネットワークアドレス', en: 'Network address', group: 'subnet', lesson: 3, related: ['bcastaddr', 'gateway', 'netpart'], demo: 'subnet' },
  { id: 'bcastaddr', term: 'ブロードキャストアドレス', en: 'Broadcast address', group: 'subnet', lesson: 3, related: ['netaddr', 'broadcast', 'hostpart'], demo: 'subnet' },
  // ---- routing ----
  { id: 'router', term: 'ルーター', en: 'Router', group: 'routing', lesson: 4, related: ['switch', 'gateway', 'hub'], demo: 'route' },
  { id: 'routing', term: 'ルーティング', en: 'Routing', group: 'routing', lesson: 4, related: ['flooding', 'routingtable', 'arp'], demo: 'route' },
  { id: 'routingtable', term: 'ルーティングテーブル', en: 'Routing table', group: 'routing', lesson: 4, related: ['arp', 'routing', 'subnetmask'], demo: 'route' },
  { id: 'gateway', term: 'デフォルトゲートウェイ', en: 'Default gateway', group: 'routing', lesson: 4, related: ['router', 'netaddr', 'dhcp'], demo: 'route' },
  { id: 'ttl', term: 'TTL', yomi: 'ティーティーエル', en: 'Time To Live', group: 'routing', lesson: 4, related: ['packet', 'icmp', 'routing'], demo: 'route' },
  // ---- helpers of IP ----
  { id: 'arp', term: 'ARP', yomi: 'アープ', en: 'Address Resolution Protocol', group: 'l3help', lesson: 4, related: ['dhcp', 'icmp', 'broadcast'], demo: 'arp' },
  { id: 'icmp', term: 'ICMP', yomi: 'アイシーエムピー', en: 'Internet Control Message Protocol', group: 'l3help', lesson: 4, related: ['ping', 'arp', 'ip'] },
  { id: 'ping', term: 'ping', yomi: 'ピン', en: 'ping', group: 'l3help', lesson: 4, related: ['icmp', 'arp', 'ttl'] },
  { id: 'dhcp', term: 'DHCP', yomi: 'ディーエイチシーピー', en: 'Dynamic Host Configuration Protocol', group: 'l3help', lesson: 4, related: ['arp', 'nat', 'gateway'] },
  { id: 'nat', term: 'NAT', yomi: 'ナット', en: 'Network Address Translation', group: 'l3help', lesson: 4, related: ['dhcp', 'privateip', 'router'] }
];
export const WORD_BY_ID = Object.fromEntries(WORDS.map(w => [w.id, w]));
