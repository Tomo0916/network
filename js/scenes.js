/* =========================================================
 * scenes.js — situation questions ("in this situation, which term?").
 * The question text lives in i18n/<lang>.js as  s.<id> .
 *
 * id      lowercase letters + digits, never change it later
 * word    the right answer (a word id from js/words.js)
 * wrong   three wrong choices, chosen by hand so that none of them is also right
 *
 * To add one: add a line here, add  s.<id>  to i18n/ja.js, easy.js, en.js
 * (and the other languages), then run  node tools/check.mjs
 * ========================================================= */
export const SCENES = [
  { id: 'interface1', word: 'interface', wrong: ['nic', 'dce', 'protocol'] },
  { id: 'interface2', word: 'interface', wrong: ['mac', 'nic', 'repeater'] },
  { id: 'nic1', word: 'nic', wrong: ['interface', 'dce', 'repeater'] },
  { id: 'nic2', word: 'nic', wrong: ['dce', 'switch', 'protocol'] },
  { id: 'dce1', word: 'dce', wrong: ['nic', 'repeater', 'hub'] },
  { id: 'dce2', word: 'dce', wrong: ['nic', 'interface', 'switch'] },
  { id: 'bps1', word: 'bps', wrong: ['mac', 'protocol', 'ethernet'] },
  { id: 'bps2', word: 'bps', wrong: ['mac', 'framing', 'preamble'] },
  { id: 'attenuation1', word: 'attenuation', wrong: ['noise', 'collision', 'flooding'] },
  { id: 'attenuation2', word: 'attenuation', wrong: ['noise', 'collision', 'broadcast'] },
  { id: 'noise1', word: 'noise', wrong: ['attenuation', 'collision', 'flooding'] },
  { id: 'noise2', word: 'noise', wrong: ['attenuation', 'collision', 'broadcast'] },
  { id: 'collision1', word: 'collision', wrong: ['noise', 'attenuation', 'flooding'] },
  { id: 'collision2', word: 'collision', wrong: ['noise', 'attenuation', 'broadcast'] },
  { id: 'hub1', word: 'hub', wrong: ['switch', 'repeater', 'nic'] },
  { id: 'hub2', word: 'hub', wrong: ['switch', 'dce', 'nic'] },
  { id: 'repeater1', word: 'repeater', wrong: ['switch', 'dce', 'nic'] },
  { id: 'repeater2', word: 'repeater', wrong: ['switch', 'nic', 'macfilter'] },
  { id: 'switch1', word: 'switch', wrong: ['hub', 'repeater', 'dce'] },
  { id: 'switch2', word: 'switch', wrong: ['hub', 'repeater', 'nic'] },
  { id: 'switch3', word: 'switch', wrong: ['repeater', 'dce', 'nic'] },
  { id: 'flooding1', word: 'flooding', wrong: ['collision', 'unicast', 'multicast'] },
  { id: 'flooding2', word: 'flooding', wrong: ['collision', 'noise', 'unicast'] },
  { id: 'protocol1', word: 'protocol', wrong: ['interface', 'bps', 'mac'] },
  { id: 'protocol2', word: 'protocol', wrong: ['framing', 'preamble', 'mac'] },
  { id: 'ethernet1', word: 'ethernet', wrong: ['csmacd', 'macfilter', 'dce'] },
  { id: 'ethernet2', word: 'ethernet', wrong: ['csmacd', 'bps', 'macfilter'] },
  { id: 'framing1', word: 'framing', wrong: ['preamble', 'flooding', 'broadcast'] },
  { id: 'framing2', word: 'framing', wrong: ['preamble', 'protocol', 'flooding'] },
  { id: 'preamble1', word: 'preamble', wrong: ['mac', 'framing', 'bps'] },
  { id: 'preamble2', word: 'preamble', wrong: ['mac', 'framing', 'protocol'] },
  { id: 'unicast1', word: 'unicast', wrong: ['broadcast', 'multicast', 'flooding'] },
  { id: 'unicast2', word: 'unicast', wrong: ['broadcast', 'multicast', 'flooding'] },
  { id: 'broadcast1', word: 'broadcast', wrong: ['unicast', 'multicast', 'collision'] },
  { id: 'broadcast2', word: 'broadcast', wrong: ['unicast', 'multicast', 'macfilter'] },
  { id: 'multicast1', word: 'multicast', wrong: ['unicast', 'broadcast', 'flooding'] },
  { id: 'multicast2', word: 'multicast', wrong: ['unicast', 'broadcast', 'flooding'] },
  { id: 'mac1', word: 'mac', wrong: ['bps', 'preamble', 'protocol'] },
  { id: 'mac2', word: 'mac', wrong: ['bps', 'preamble', 'interface'] },
  { id: 'csmacd1', word: 'csmacd', wrong: ['flooding', 'macfilter', 'framing'] },
  { id: 'csmacd2', word: 'csmacd', wrong: ['flooding', 'macfilter', 'protocol'] },
  { id: 'macfilter1', word: 'macfilter', wrong: ['csmacd', 'flooding', 'multicast'] },
  { id: 'macfilter2', word: 'macfilter', wrong: ['csmacd', 'flooding', 'switch'] }
];
export const SCENE_BY_ID = Object.fromEntries(SCENES.map(s => [s.id, s]));
export const scenesOf = wordId => SCENES.filter(s => s.word === wordId);
