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
  // ---- textbook ch.5 additions ----
  { id: 'tcp', term: 'TCP', yomi: 'ティーシーピー', en: 'Transmission Control Protocol', group: 'l4', lesson: 36, related: ['udp', 'ip', 'icmp'] },
  { id: 'connection', term: 'コネクション', en: 'Connection', group: 'l4', lesson: 37, related: ['session', 'handshake', 'segment'] },
  { id: 'handshake', term: '3ウェイハンドシェイク', yomi: 'スリーウェイハンドシェイク', en: 'Three-way handshake', group: 'l4', lesson: 37, related: ['connection', 'ack', 'arp'] },
  { id: 'segment', term: 'セグメント', en: 'Segment', group: 'l4', lesson: 37, related: ['packet', 'framing', 'window'] },
  { id: 'window', term: 'ウィンドウ制御', yomi: 'ウィンドウせいぎょ', en: 'Window control', group: 'l4', lesson: 38, related: ['buffering', 'ack', 'segment'] },
  { id: 'ack', term: 'ACK（確認応答）', yomi: 'アック（かくにんおうとう）', en: 'Acknowledgement', group: 'l4', lesson: 38, related: ['window', 'handshake', 'fcs'] },
  { id: 'port', term: 'ポート番号', yomi: 'ポートばんごう', en: 'Port number', group: 'port', lesson: 39, related: ['wellknown', 'ipaddress', 'mac'] },
  { id: 'wellknown', term: 'ウェルノウンポート', en: 'Well-known port', group: 'port', lesson: 39, related: ['port', 'portfwd', 'privateip'] },
  { id: 'udp', term: 'UDP', yomi: 'ユーディーピー', en: 'User Datagram Protocol', group: 'l4', lesson: 40, related: ['tcp', 'icmp', 'ip'] },
  { id: 'napt', term: 'NAPT', yomi: 'エヌエーピーティー', en: 'Network Address Port Translation', group: 'nat', lesson: 42, related: ['nat', 'portfwd', 'dhcp'] },
  { id: 'portfwd', term: 'ポートフォワーディング', en: 'Port forwarding', group: 'nat', lesson: 42, related: ['napt', 'nat', 'routing'] },
  { id: 'session', term: 'セッション層', yomi: 'セッションそう', en: 'Session layer', group: 'upper', lesson: 43, related: ['presentation', 'application', 'connection'] },
  { id: 'presentation', term: 'プレゼンテーション層', yomi: 'プレゼンテーションそう', en: 'Presentation layer', group: 'upper', lesson: 43, related: ['session', 'application', 'encap'] },
  { id: 'application', term: 'アプリケーション層', yomi: 'アプリケーションそう', en: 'Application layer', group: 'upper', lesson: 43, related: ['presentation', 'session', 'tcpip'] },
  // ---- textbook ch.3-4 additions ----
  { id: 'internetwork', term: 'インターネットワーク', en: 'Internetwork', group: 'l3', lesson: 19, related: ['router', 'lan', 'wan'] },
  { id: 'ipclass', term: 'IPアドレスクラス', yomi: 'アイピーアドレスクラス', en: 'IP address class', group: 'subnet', lesson: 22, related: ['cidr', 'subnetmask', 'prefix'] },
  { id: 'loopback', term: 'ループバックアドレス', en: 'Loopback address', group: 'subnet', lesson: 22, related: ['privateip', 'bcastaddr', 'netaddr'] },
  { id: 'subnetting', term: 'サブネッティング', en: 'Subnetting', group: 'subnet', lesson: 23, related: ['subnetmask', 'cidr', 'prefix'], demo: 'subnet' },
  { id: 'cidr', term: 'CIDR', yomi: 'サイダー', en: 'Classless Inter-Domain Routing', group: 'subnet', lesson: 24, related: ['ipclass', 'prefix', 'subnetting'], demo: 'subnet' },
  { id: 'arptable', term: 'ARPテーブル', yomi: 'アープテーブル', en: 'ARP table', group: 'l3help', lesson: 26, related: ['mactable', 'routingtable', 'arp'], demo: 'arp' },
  { id: 'dns', term: 'DNS', yomi: 'ディーエヌエス', en: 'Domain Name System', group: 'l3help', lesson: 27, related: ['dhcp', 'arp', 'domain'] },
  { id: 'domain', term: 'ドメイン名', yomi: 'ドメインめい', en: 'Domain name', group: 'l3help', lesson: 27, related: ['dns', 'ipaddress', 'mac'] },
  { id: 'hop', term: 'ホップ', en: 'Hop', group: 'routing', lesson: 28, related: ['ttl', 'metric', 'routing'], demo: 'route' },
  { id: 'bcastdomain', term: 'ブロードキャストドメイン', en: 'Broadcast domain', group: 'routing', lesson: 29, related: ['colldomain', 'broadcast', 'router'], demo: 'cast' },
  { id: 'staticrt', term: 'スタティックルーティング', en: 'Static routing', group: 'routing', lesson: 31, related: ['dynamicrt', 'routingtable', 'rtproto'], demo: 'route' },
  { id: 'dynamicrt', term: 'ダイナミックルーティング', en: 'Dynamic routing', group: 'routing', lesson: 31, related: ['staticrt', 'rtproto', 'rip'], demo: 'route' },
  { id: 'rtproto', term: 'ルーティングプロトコル', en: 'Routing protocol', group: 'rtproto', lesson: 32, related: ['routing', 'rip', 'protocol'] },
  { id: 'as', term: 'AS（自律システム）', yomi: 'エーエス（じりつシステム）', en: 'Autonomous System', group: 'rtproto', lesson: 32, related: ['internetwork', 'lan', 'rtproto'] },
  { id: 'metric', term: 'メトリック', en: 'Metric', group: 'rtproto', lesson: 33, related: ['hop', 'ttl', 'rip'] },
  { id: 'rip', term: 'RIP', yomi: 'リップ', en: 'Routing Information Protocol', group: 'rtproto', lesson: 33, related: ['rtproto', 'icmp', 'arp'] },
  { id: 'timeexceeded', term: 'Time Exceeded', yomi: 'タイムエクシーデッド', en: 'Time Exceeded', group: 'icmpg', lesson: 35, related: ['ping', 'ttl', 'icmp'] },
  { id: 'tracert', term: 'tracert', yomi: 'トレースルート', en: 'tracert / traceroute', group: 'icmpg', lesson: 35, related: ['ping', 'timeexceeded', 'arp'] },
  // ---- textbook ch.1-2 additions ----
  { id: 'network', term: 'ネットワーク', en: 'Network', group: 'basics', lesson: 1, related: ['protocol', 'lan', 'packet'] },
  { id: 'bit', term: 'ビット', en: 'Bit', group: 'basics', lesson: 3, related: ['bps', 'packet', 'header'] },
  { id: 'circuitsw', term: '回線交換', yomi: 'かいせんこうかん', en: 'Circuit switching', group: 'basics', lesson: 4, related: ['packetsw', 'packet', 'wan'] },
  { id: 'packetsw', term: 'パケット交換', yomi: 'パケットこうかん', en: 'Packet switching', group: 'basics', lesson: 4, related: ['circuitsw', 'packet', 'routing'] },
  { id: 'multiaccess', term: 'マルチアクセスネットワーク', en: 'Multi-access network', group: 'basics', lesson: 5, related: ['p2p', 'lan', 'broadcast'] },
  { id: 'p2p', term: 'ポイントツーポイント', en: 'Point-to-point', group: 'basics', lesson: 5, related: ['multiaccess', 'wan', 'unicast'] },
  { id: 'lan', term: 'LAN', yomi: 'ラン', en: 'Local Area Network', group: 'basics', lesson: 6, related: ['wan', 'network', 'ethernet'] },
  { id: 'wan', term: 'WAN', yomi: 'ワン', en: 'Wide Area Network', group: 'basics', lesson: 6, related: ['lan', 'dce', 'p2p'] },
  { id: 'osi', term: 'OSI参照モデル', yomi: 'オーエスアイさんしょうモデル', en: 'OSI reference model', group: 'model', lesson: 7, related: ['tcpip', 'protocol', 'encap'] },
  { id: 'encap', term: 'カプセル化', yomi: 'カプセルか', en: 'Encapsulation', group: 'model', lesson: 8, related: ['header', 'framing', 'osi'] },
  { id: 'header', term: 'ヘッダー', en: 'Header', group: 'model', lesson: 8, related: ['encap', 'preamble', 'fcs'] },
  { id: 'tcpip', term: 'TCP/IPモデル', yomi: 'ティーシーピーアイピーモデル', en: 'TCP/IP model', group: 'model', lesson: 10, related: ['osi', 'protocol', 'ip'] },
  { id: 'media', term: '通信媒体', yomi: 'つうしんばいたい', en: 'Transmission media', group: 'l1', lesson: 11, related: ['interface', 'nic', 'noise'] },
  { id: 'colldomain', term: '衝突ドメイン', yomi: 'しょうとつドメイン', en: 'Collision domain', group: 'devices', lesson: 13, related: ['collision', 'hub', 'switch'], demo: 'hubswitch' },
  { id: 'async', term: '非同期通信', yomi: 'ひどうきつうしん', en: 'Asynchronous communication', group: 'l2', lesson: 14, related: ['preamble', 'framing', 'fullduplex'] },
  { id: 'fcs', term: 'FCS', yomi: 'エフシーエス', en: 'Frame Check Sequence', group: 'l2', lesson: 16, related: ['preamble', 'header', 'framing'], demo: 'frame' },
  { id: 'mactable', term: 'MACアドレステーブル', yomi: 'マックアドレステーブル', en: 'MAC address table', group: 'mac', lesson: 17, related: ['macfilter', 'flooding', 'arp'], demo: 'hubswitch' },
  { id: 'buffering', term: 'バッファリング', en: 'Buffering', group: 'duplex', lesson: 18, related: ['fullduplex', 'collision', 'csmacd'] },
  { id: 'halfduplex', term: '半二重', yomi: 'はんにじゅう', en: 'Half duplex', group: 'duplex', lesson: 18, related: ['fullduplex', 'csmacd', 'collision'] },
  { id: 'fullduplex', term: '全二重', yomi: 'ぜんにじゅう', en: 'Full duplex', group: 'duplex', lesson: 18, related: ['halfduplex', 'buffering', 'switch'] },
  // ---- Layer 1 basics ----
  { id: 'interface', term: 'インターフェース', en: 'Interface', group: 'l1', lesson: 5, related: ['nic', 'dce', 'protocol'] },
  { id: 'nic', term: 'NIC', yomi: 'ニック', en: 'Network Interface Card', group: 'l1', lesson: 5, related: ['interface', 'mac', 'dce'] },
  { id: 'dce', term: 'DCE', yomi: 'ディーシーイー', en: 'Data Circuit-terminating Equipment', group: 'l1', lesson: 5, related: ['nic', 'interface', 'repeater'] },
  { id: 'bps', term: 'bps', yomi: 'ビーピーエス', en: 'bits per second', group: 'l1', lesson: 3, related: ['protocol', 'mac', 'ethernet'] },
  // ---- signal problems ----
  { id: 'attenuation', term: '減衰', yomi: 'げんすい', en: 'Attenuation', group: 'signal', lesson: 12, related: ['noise', 'collision', 'repeater'], demo: 'repeater' },
  { id: 'noise', term: 'ノイズ', en: 'Noise', group: 'signal', lesson: 12, related: ['attenuation', 'collision', 'flooding'], demo: 'repeater' },
  { id: 'collision', term: '衝突', yomi: 'しょうとつ', en: 'Collision', group: 'signal', lesson: 12, related: ['noise', 'attenuation', 'csmacd'], demo: 'csmacd' },
  // ---- devices ----
  { id: 'hub', term: 'ハブ', en: 'Hub', group: 'devices', lesson: 13, related: ['switch', 'repeater', 'flooding'], demo: 'hubswitch' },
  { id: 'repeater', term: 'リピーター', en: 'Repeater', group: 'devices', lesson: 12, related: ['hub', 'switch', 'attenuation'], demo: 'repeater' },
  { id: 'switch', term: 'スイッチ', en: 'Switch', group: 'devices', lesson: 17, related: ['hub', 'repeater', 'flooding'], demo: 'hubswitch' },
  { id: 'flooding', term: 'フラッディング', en: 'Flooding', group: 'devices', lesson: 17, related: ['broadcast', 'hub', 'multicast'], demo: 'hubswitch' },
  // ---- Layer 2 basics ----
  { id: 'protocol', term: 'プロトコル', en: 'Protocol', group: 'model', lesson: 9, related: ['ethernet', 'framing', 'csmacd'] },
  { id: 'ethernet', term: 'イーサネット', en: 'Ethernet', group: 'l2', lesson: 16, related: ['protocol', 'framing', 'nic'], demo: 'frame' },
  { id: 'framing', term: 'フレーミング', en: 'Framing', group: 'l2', lesson: 14, related: ['preamble', 'protocol', 'ethernet'], demo: 'frame' },
  { id: 'preamble', term: 'プリアンブル', en: 'Preamble', group: 'l2', lesson: 16, related: ['framing', 'mac', 'protocol'], demo: 'frame' },
  // ---- addressing ----
  { id: 'unicast', term: 'ユニキャスト', en: 'Unicast', group: 'addressing', lesson: 15, related: ['broadcast', 'multicast', 'flooding'], demo: 'cast' },
  { id: 'broadcast', term: 'ブロードキャスト', en: 'Broadcast', group: 'addressing', lesson: 15, related: ['multicast', 'unicast', 'flooding'], demo: 'cast' },
  { id: 'multicast', term: 'マルチキャスト', en: 'Multicast', group: 'addressing', lesson: 15, related: ['broadcast', 'unicast', 'flooding'], demo: 'cast' },
  // ---- MAC address and rules ----
  { id: 'mac', term: 'MACアドレス', yomi: 'マックアドレス', en: 'MAC address', group: 'mac', lesson: 15, related: ['nic', 'macfilter', 'bps'], demo: 'frame' },
  { id: 'csmacd', term: 'CSMA/CD', yomi: 'シーエスエムエー・シーディー', en: 'Carrier Sense Multiple Access / Collision Detection', group: 'mac', lesson: 16, related: ['collision', 'protocol', 'flooding'], demo: 'csmacd' },
  { id: 'macfilter', term: 'MACアドレスフィルタリング', yomi: 'マックアドレスフィルタリング', en: 'MAC address filtering', group: 'mac', lesson: 17, related: ['mac', 'switch', 'csmacd'] },
  // ---- Layer 3: IP basics ----
  { id: 'ip', term: 'IP', yomi: 'アイピー', en: 'Internet Protocol', group: 'l3', lesson: 20, related: ['ethernet', 'icmp', 'arp'] },
  { id: 'packet', term: 'パケット', en: 'Packet', group: 'basics', lesson: 4, related: ['framing', 'ttl', 'ip'], demo: 'route' },
  { id: 'ipaddress', term: 'IPアドレス', yomi: 'アイピーアドレス', en: 'IP address', group: 'l3', lesson: 21, related: ['mac', 'subnetmask', 'gateway'], demo: 'subnet' },
  { id: 'privateip', term: 'プライベートIPアドレス', yomi: 'プライベートアイピーアドレス', en: 'Private IP address', group: 'nat', lesson: 41, related: ['globalip', 'nat', 'ipaddress'] },
  { id: 'globalip', term: 'グローバルIPアドレス', yomi: 'グローバルアイピーアドレス', en: 'Global IP address', group: 'nat', lesson: 41, related: ['privateip', 'nat', 'ipaddress'] },
  // ---- network part and host part ----
  { id: 'netpart', term: 'ネットワーク部', yomi: 'ネットワークぶ', en: 'Network portion', group: 'subnet', lesson: 21, related: ['hostpart', 'netaddr', 'subnetmask'], demo: 'subnet' },
  { id: 'hostpart', term: 'ホスト部', yomi: 'ホストぶ', en: 'Host portion', group: 'subnet', lesson: 21, related: ['netpart', 'bcastaddr', 'subnetmask'], demo: 'subnet' },
  { id: 'subnetmask', term: 'サブネットマスク', en: 'Subnet mask', group: 'subnet', lesson: 23, related: ['prefix', 'netpart', 'gateway'], demo: 'subnet' },
  { id: 'prefix', term: 'プレフィックス長', yomi: 'プレフィックスちょう', en: 'Prefix length (CIDR notation)', group: 'subnet', lesson: 24, related: ['subnetmask', 'netpart', 'hostpart'], demo: 'subnet' },
  { id: 'netaddr', term: 'ネットワークアドレス', en: 'Network address', group: 'subnet', lesson: 22, related: ['bcastaddr', 'gateway', 'netpart'], demo: 'subnet' },
  { id: 'bcastaddr', term: 'ブロードキャストアドレス', en: 'Broadcast address', group: 'subnet', lesson: 22, related: ['netaddr', 'broadcast', 'hostpart'], demo: 'subnet' },
  // ---- routing ----
  { id: 'router', term: 'ルーター', en: 'Router', group: 'routing', lesson: 29, related: ['switch', 'gateway', 'hub'], demo: 'route' },
  { id: 'routing', term: 'ルーティング', en: 'Routing', group: 'routing', lesson: 31, related: ['flooding', 'routingtable', 'arp'], demo: 'route' },
  { id: 'routingtable', term: 'ルーティングテーブル', en: 'Routing table', group: 'routing', lesson: 31, related: ['arp', 'routing', 'subnetmask'], demo: 'route' },
  { id: 'gateway', term: 'デフォルトゲートウェイ', en: 'Default gateway', group: 'routing', lesson: 30, related: ['router', 'netaddr', 'dhcp'], demo: 'route' },
  { id: 'ttl', term: 'TTL', yomi: 'ティーティーエル', en: 'Time To Live', group: 'icmpg', lesson: 34, related: ['packet', 'icmp', 'routing'], demo: 'route' },
  // ---- helpers of IP ----
  { id: 'arp', term: 'ARP', yomi: 'アープ', en: 'Address Resolution Protocol', group: 'l3help', lesson: 26, related: ['dhcp', 'icmp', 'broadcast'], demo: 'arp' },
  { id: 'icmp', term: 'ICMP', yomi: 'アイシーエムピー', en: 'Internet Control Message Protocol', group: 'icmpg', lesson: 34, related: ['ping', 'arp', 'ip'] },
  { id: 'ping', term: 'ping', yomi: 'ピン', en: 'ping', group: 'icmpg', lesson: 35, related: ['icmp', 'arp', 'ttl'] },
  { id: 'dhcp', term: 'DHCP', yomi: 'ディーエイチシーピー', en: 'Dynamic Host Configuration Protocol', group: 'l3help', lesson: 25, related: ['arp', 'nat', 'gateway'] },
  { id: 'nat', term: 'NAT', yomi: 'ナット', en: 'Network Address Translation', group: 'nat', lesson: 41, related: ['dhcp', 'privateip', 'router'] }
];
export const WORD_BY_ID = Object.fromEntries(WORDS.map(w => [w.id, w]));
