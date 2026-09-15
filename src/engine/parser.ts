/* parser — tokens + 가설(lexicon·grammar) → Meaning | null.
   판정 방식: 토큰에서 핵심 어휘·수량·복수 유무를 읽어 후보 의미를 만든 뒤
   같은 가설로 재인코딩해 토큰과 완전히 일치할 때만 인정한다.
   불일치·부족·과잉은 모두 null (문자열 비교 채점 금지, 구조 판정). */

import { encodeMeaning, type Lexicon } from './encoder';
import type { ActorId, Grammar, Meaning, ObjectId, VerbId } from './grammar';

function vocabOf(glyph: string, lexicon: Lexicon): string | null {
  return lexicon[glyph] ?? null;
}

export function parseTokens(
  tokens: readonly string[],
  lexicon: Lexicon,
  grammar: Grammar,
): Meaning | null {
  try {
    if (!Array.isArray(tokens) || tokens.length === 0) return null;
    if (tokens.length > 6) return null;

    const vocabs: string[] = [];
    for (const t of tokens) {
      const v = vocabOf(t, lexicon);
      if (!v) return null;
      vocabs.push(v);
    }

    const actors = vocabs.filter((v) => v.startsWith('A'));
    const objects = vocabs.filter((v) => v.startsWith('O'));
    const verbs = vocabs.filter((v) => v.startsWith('V'));
    const counts = vocabs.filter((v) => v.startsWith('C'));
    const plurals = vocabs.filter((v) => v === 'PL');
    if (actors.length !== 1 || objects.length !== 1 || verbs.length !== 1) return null;
    if (counts.length !== 1 || plurals.length > 1) return null;

    const count = counts[0] === 'C1' ? 1 : counts[0] === 'C2' ? 2 : null;
    if (count === null) return null;
    if ((plurals.length === 1) !== (count > 1)) return null;

    const candidate: Meaning = {
      actor: actors[0] as ActorId,
      action: verbs[0] as VerbId,
      object: objects[0] as ObjectId,
      count: count as 1 | 2,
    };

    const reencoded = encodeMeaning(candidate, grammar, lexicon);
    if (reencoded.length !== tokens.length) return null;
    for (let i = 0; i < reencoded.length; i++) {
      if (reencoded[i] !== tokens[i]) return null;
    }
    return candidate;
  } catch {
    return null;
  }
}

export function sameMeaning(a: Meaning, b: Meaning): boolean {
  return a.actor === b.actor && a.action === b.action && a.object === b.object && a.count === b.count;
}
