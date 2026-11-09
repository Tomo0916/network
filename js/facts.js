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
    SEQ('fx.send', 'fx.detect', 'fx.listen', 'fx.resend', 'fx.wait')] }
];
export const FACT_BY_ID = Object.fromEntries(FACTS.map(f => [f.id, f]));
export const factsOf = wordId => FACTS.filter(f => f.word === wordId);
/** every i18n key a fact choice needs (for tools/check.mjs) */
export const factKeys = () => [...new Set(FACTS.flatMap(f => f.opts.flatMap(o => typeof o === 'string' ? [] : o.k ? [o.k] : o.seq.filter(t => !t.startsWith('w:')))))];
