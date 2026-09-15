/* hypothesisValidator — 후보 집합 H 관리와 증거 판정. 순수 함수.
   H는 교육용 사전 정의 27 문법 후보(전수가 아님). 유용성은 구분 수로만
   설명하고 엔트로피 수식을 쓰지 않는다. */

import { CANDIDATE_GRAMMARS, TRUE_GRAMMAR, type Grammar, type Meaning } from './grammar';
import { TRUE_LEXICON } from './glyphs';
import type { Lexicon } from './encoder';
import { parseTokens, sameMeaning } from './parser';

export type HypothesisStatus = '가설' | '확정' | '보류';

export interface EvidenceDocument {
  id: string;
  meaning: Meaning;
  tokens: readonly string[];
}

export interface LexiconHypothesis {
  lexiconMapping: Record<string, string>;
  grammarId: string;
  supportingDocumentIds: string[];
  status: HypothesisStatus;
}

/** 모든 증거 문서와 일치하는 문법 후보만 남긴다. */
export function filterGrammars(
  docs: readonly EvidenceDocument[],
  lexicon: Lexicon,
  candidates: readonly Grammar[] = CANDIDATE_GRAMMARS,
): Grammar[] {
  return candidates.filter((g) =>
    docs.every((d) => {
      const parsed = parseTokens(d.tokens, lexicon, g);
      return parsed !== null && sameMeaning(parsed, d.meaning);
    }),
  );
}

/** 후보 문서가 남은 가설을 몇 개나 걸러내는지(구분 수)로 유용성을 설명한다. */
export function distinguishingScore(
  doc: EvidenceDocument,
  survivors: readonly Grammar[],
  lexicon: Lexicon,
): { eliminated: number; explanation: string } {
  let eliminated = 0;
  for (const g of survivors) {
    const parsed = parseTokens(doc.tokens, lexicon, g);
    if (parsed === null || !sameMeaning(parsed, doc.meaning)) eliminated += 1;
  }
  return {
    eliminated,
    explanation:
      eliminated === 0
        ? '이 문서는 남은 가설을 하나도 가려내지 못합니다.'
        : `이 문서는 남은 가설 ${survivors.length}개 중 ${eliminated}개를 가려냅니다.`,
  };
}

function meaningContains(m: Meaning, vocabGuess: string): boolean {
  const kind = vocabGuess[0];
  if (kind === 'A') return m.actor === vocabGuess;
  if (kind === 'V') return m.action === vocabGuess;
  if (kind === 'O') return m.object === vocabGuess;
  if (kind === 'C') return `C${m.count}` === vocabGuess;
  if (kind === 'P') return m.count > 1;
  return false;
}

/** 부분 어휘 가설(기호→뜻 연결)이 지지 문서들과 일관되는지 검사한다. */
export function checkLexiconLink(
  glyph: string,
  vocabGuess: string,
  supportingDocs: readonly EvidenceDocument[],
): { verdict: 'supported' | 'refuted' | 'needs-evidence'; reason: string } {
  if (supportingDocs.length === 0) {
    return { verdict: 'needs-evidence', reason: '근거 문서를 1개 이상 지정해 주세요.' };
  }
  for (const d of supportingDocs) {
    const containsGlyph = d.tokens.includes(glyph);
    if (containsGlyph !== meaningContains(d.meaning, vocabGuess)) {
      return {
        verdict: 'refuted',
        reason: `문서 ${d.id}와 어긋납니다. 다른 근거를 찾거나 가설을 고쳐 보세요.`,
      };
    }
  }
  return { verdict: 'supported', reason: `근거 ${supportingDocs.length}개와 일치합니다.` };
}

/** 보류·복수 해석이 정당하려면 실제로 2개 이상 후보가 남아 있어야 한다. */
export function isHoldJustified(survivors: readonly unknown[]): boolean {
  return survivors.length > 1;
}

/** 가설 기록 형태 검사 (이력 저장 전 호출). */
export function validateHypothesisRecord(h: LexiconHypothesis): void {
  if (!h || typeof h !== 'object') throw new Error('가설 기록이 비어 있습니다.');
  if (!h.lexiconMapping || typeof h.lexiconMapping !== 'object')
    throw new Error('어휘 대응이 비어 있습니다.');
  const knownVocab = new Set(['A0', 'A1', 'A2', 'O0', 'O1', 'O2', 'V0', 'V1', 'V2', 'C1', 'C2', 'PL']);
  for (const [glyph, vocab] of Object.entries(h.lexiconMapping)) {
    if (typeof glyph !== 'string' || glyph.length === 0) throw new Error('빈 기호 키가 있습니다.');
    if (!knownVocab.has(vocab)) throw new Error(`알 수 없는 어휘: ${vocab}`);
  }
  if (!CANDIDATE_GRAMMARS.some((g) => g.id === h.grammarId) && h.grammarId !== 'G-TRUE') {
    if (!/^GD-[a-z]+$/.test(h.grammarId)) throw new Error(`알 수 없는 문법: ${h.grammarId}`);
  }
  if (!Array.isArray(h.supportingDocumentIds)) throw new Error('근거 문서 목록이 배열이 아닙니다.');
  if (!['가설', '확정', '보류'].includes(h.status)) throw new Error(`알 수 없는 상태: ${h.status}`);
}

/* ---- 결합 가설 집합 H (어휘 대응 × 문법, 교육용 사전 정의 27개) ----
   가능한 모든 언어의 수가 아니다. 어휘가 미지이므로 증거가 쌓이며
   보이지 않는 교환 변형이 하나씩 가려진다. */

function swappedLexicon(glyphA: string, glyphB: string): Lexicon {
  const next: Record<string, string> = { ...TRUE_LEXICON };
  const tmp = next[glyphA];
  next[glyphA] = next[glyphB];
  next[glyphB] = tmp;
  return next;
}

const GLYPH_OF = (vocab: string): string => {
  const g = Object.entries(TRUE_LEXICON).find(([, v]) => v === vocab)?.[0];
  if (!g) throw new Error(`기호 없음: ${vocab}`);
  return g;
};

export interface LexiconVariant {
  id: string;
  lexicon: Lexicon;
  label: string;
}

export const LEX_VARIANTS: readonly LexiconVariant[] = [
  { id: 'L-true', lexicon: TRUE_LEXICON, label: '정답 대응' },
  { id: 'L-swA01', lexicon: swappedLexicon(GLYPH_OF('A0'), GLYPH_OF('A1')), label: '행위자 2개 교환' },
  { id: 'L-swA12', lexicon: swappedLexicon(GLYPH_OF('A1'), GLYPH_OF('A2')), label: '행위자 2개 교환' },
  { id: 'L-swO01', lexicon: swappedLexicon(GLYPH_OF('O0'), GLYPH_OF('O1')), label: '대상 2개 교환' },
  { id: 'L-swO12', lexicon: swappedLexicon(GLYPH_OF('O1'), GLYPH_OF('O2')), label: '대상 2개 교환' },
  { id: 'L-swV01', lexicon: swappedLexicon(GLYPH_OF('V0'), GLYPH_OF('V1')), label: '동사 2개 교환' },
  { id: 'L-swV12', lexicon: swappedLexicon(GLYPH_OF('V1'), GLYPH_OF('V2')), label: '동사 2개 교환' },
  { id: 'L-swC', lexicon: swappedLexicon(GLYPH_OF('C1'), GLYPH_OF('C2')), label: '수량 2개 교환' },
  { id: 'L-swAO', lexicon: swappedLexicon(GLYPH_OF('A0'), GLYPH_OF('O0')), label: '행위자·대상 교환' },
];

export const GRAMMAR_SHORTLIST: readonly Grammar[] = [
  TRUE_GRAMMAR,
  { id: 'GD-quant', order: 'AOV', quantPos: 'afterVerb', pluralPos: 'afterObject' },
  { id: 'GD-order', order: 'AVO', quantPos: 'afterObject', pluralPos: 'afterObject' },
];

export interface CombinedHypothesis {
  id: string;
  lexicon: Lexicon;
  grammar: Grammar;
}

/** 결합 후보 27개(=어휘 9 × 문법 3). */
export const CANDIDATE_HYPOTHESES: readonly CombinedHypothesis[] = LEX_VARIANTS.flatMap((l) =>
  GRAMMAR_SHORTLIST.map((g) => ({ id: `${l.id}+${g.id}`, lexicon: l.lexicon, grammar: g })),
);

/** 모든 증거와 일치하는 결합 후보만 남긴다. */
export function filterHypotheses(
  docs: readonly EvidenceDocument[],
  candidates: readonly CombinedHypothesis[] = CANDIDATE_HYPOTHESES,
): CombinedHypothesis[] {
  return candidates.filter((h) =>
    docs.every((d) => {
      const parsed = parseTokens(d.tokens, h.lexicon, h.grammar);
      return parsed !== null && sameMeaning(parsed, d.meaning);
    }),
  );
}
