/* encoder — meaning + grammar + lexicon → glyph token열. 순수 함수.
   입력 검증: 유효 범위·단위 밖, NaN·무한대, 미등록 기호, 중복 대응을 차단한다. */

import { assertGlyphId } from './glyphs';
import { assertMeaning, type Grammar, type Meaning } from './grammar';

export type Lexicon = Readonly<Record<string, string>>;

const VOCABS = ['A0', 'A1', 'A2', 'O0', 'O1', 'O2', 'V0', 'V1', 'V2', 'C1', 'C2', 'PL'] as const;

export function assertLexicon(lexicon: Lexicon): void {
  if (!lexicon || typeof lexicon !== 'object') throw new Error('lexicon은 객체여야 합니다.');
  const values = Object.values(lexicon);
  for (const v of VOCABS) {
    if (!values.includes(v)) throw new Error(`어휘 누락: ${v}`);
  }
  const glyphs = Object.keys(lexicon);
  for (const g of glyphs) assertGlyphId(g);
  if (new Set(glyphs).size !== glyphs.length) throw new Error('기호 중복 등록');
  if (new Set(values).size !== values.length) throw new Error('한 기호가 두 뜻에 대응합니다.');
}

export function assertGrammar(g: Grammar): void {
  if (!g || typeof g !== 'object') throw new Error('grammar는 객체여야 합니다.');
  if (!['AOV', 'AVO', 'OAV'].includes(g.order)) throw new Error(`유효하지 않은 어순: ${g.order}`);
  for (const k of ['quantPos', 'pluralPos'] as const) {
    if (!['beforeObject', 'afterObject', 'afterVerb'].includes(g[k]))
      throw new Error(`유효하지 않은 위치: ${String(g[k])}`);
  }
}

function invertLexicon(lexicon: Lexicon): Map<string, string> {
  const inv = new Map<string, string>();
  for (const [glyph, vocab] of Object.entries(lexicon)) inv.set(vocab, glyph);
  return inv;
}

export function encodeMeaning(meaning: Meaning, grammar: Grammar, lexicon: Lexicon): string[] {
  assertMeaning(meaning);
  assertGrammar(grammar);
  assertLexicon(lexicon);
  const toGlyph = invertLexicon(lexicon);

  const core: string[] =
    grammar.order === 'AOV'
      ? [meaning.actor, meaning.object, meaning.action]
      : grammar.order === 'AVO'
        ? [meaning.actor, meaning.action, meaning.object]
        : [meaning.object, meaning.actor, meaning.action];

  const tokens: string[] = core.map((v) => {
    const g = toGlyph.get(v);
    if (!g) throw new Error(`대응 기호 없음: ${v}`);
    return g;
  });

  const objectGlyph = toGlyph.get(meaning.object) as string;
  const countGlyph = toGlyph.get(meaning.count === 1 ? 'C1' : 'C2') as string;
  const pluralGlyph = toGlyph.get('PL') as string;

  const objectIndex = (): number => {
    const i = tokens.indexOf(objectGlyph);
    if (i < 0) throw new Error('대상 슬롯 소실');
    return i;
  };

  // 수량어 삽입 (결정적 순서: 수량 먼저, 복수 표지 나중)
  if (grammar.quantPos === 'beforeObject') tokens.splice(objectIndex(), 0, countGlyph);
  else if (grammar.quantPos === 'afterObject') tokens.splice(objectIndex() + 1, 0, countGlyph);
  else tokens.push(countGlyph);

  if (meaning.count > 1) {
    if (grammar.pluralPos === 'beforeObject') tokens.splice(objectIndex(), 0, pluralGlyph);
    else if (grammar.pluralPos === 'afterObject') tokens.splice(objectIndex() + 1, 0, pluralGlyph);
    else tokens.push(pluralGlyph);
  }

  return tokens;
}
