import { describe, expect, it } from 'vitest';
import { CANDIDATE_GRAMMARS } from '../src/engine/grammar';
import { TRUE_LEXICON } from '../src/engine/glyphs';
import {
  CANDIDATE_HYPOTHESES,
  checkLexiconLink,
  distinguishingScore,
  filterGrammars,
  filterHypotheses,
  GRAMMAR_SHORTLIST,
  isHoldJustified,
} from '../src/engine/hypothesisValidator';
import {
  buildAmbiguityMission,
  buildMissions,
  buildNarrowingMission,
  DOC_POOL,
  type MissionDocument,
} from '../src/engine/missions';
import { parseTokens } from '../src/engine/parser';
import { TRUE_GRAMMAR } from '../src/engine/grammar';

const toEvidence = (d: MissionDocument) => ({ id: d.id, meaning: d.meaning, tokens: d.tokens });

describe('M2: 검수 미션 2→1', () => {
  it('초기 문서에서 2후보, 추가 1장으로 1후보가 된다', () => {
    const m = buildNarrowingMission();
    expect(CANDIDATE_HYPOTHESES).toHaveLength(27);
    expect(filterHypotheses(m.initialDocuments.map(toEvidence))).toHaveLength(2);
    expect(
      filterHypotheses([...m.initialDocuments, ...m.optionalDocuments].map(toEvidence)),
    ).toHaveLength(1);
  });

  it('추가 문서는 구분 수로 유용성이 설명된다', () => {
    const doc = DOC_POOL[0];
    const survivors = [GRAMMAR_SHORTLIST[0], GRAMMAR_SHORTLIST[1]];
    const score = distinguishingScore(toEvidence(doc), survivors, TRUE_LEXICON);
    expect(score.eliminated).toBeGreaterThanOrEqual(1);
    expect(score.explanation).toContain('가려냅니다');
  });
});

describe('M2: 모호함은 정당한 답이다', () => {
  it('모호함 미션은 끝까지 2후보 이상이 남아 보류가 정당하다', () => {
    const m = buildAmbiguityMission();
    const all = [...m.initialDocuments, ...m.optionalDocuments].map(toEvidence);
    const survivors = filterHypotheses(all);
    expect(survivors.length).toBeGreaterThanOrEqual(2);
    expect(isHoldJustified(survivors)).toBe(true);
    expect(m.expectedAmbiguities.length).toBeGreaterThanOrEqual(1);
  });

  it('동일 증거를 만드는 두 후보는 한쪽만 정답 처리하지 않는다', () => {
    const base = CANDIDATE_GRAMMARS.filter(
      (g) => g.order === 'AOV' && g.quantPos === 'afterObject',
    );
    expect(base.length).toBeGreaterThanOrEqual(2);
    const singles = DOC_POOL.filter((d) => d.meaning.count === 1).map(toEvidence);
    const survivors = filterGrammars(singles, TRUE_LEXICON, base);
    expect(survivors.length).toBeGreaterThanOrEqual(2);
    expect(isHoldJustified(survivors)).toBe(true);
  });
});

describe('M2: 어휘 가설 검사', () => {
  it('참 대응은 지지되고 거짓 대응은 반박되며 근거 없으면 요청한다', () => {
    const a0docs = DOC_POOL.filter((d) => d.meaning.actor === 'A0').slice(0, 2);
    expect(checkLexiconLink('G0', 'A0', a0docs).verdict).toBe('supported');
    expect(checkLexiconLink('G0', 'A1', a0docs).verdict).toBe('refuted');
    expect(checkLexiconLink('G0', 'A0', []).verdict).toBe('needs-evidence');
  });
});

describe('M2: 미션 3개와 홀드아웃', () => {
  it('미션 3개가 구성되고 홀드아웃이 정답 가설로 해석된다', () => {
    const missions = buildMissions();
    expect(missions).toHaveLength(3);
    for (const m of missions) {
      expect(m.initialDocuments.length).toBeGreaterThanOrEqual(2);
      for (const h of m.holdoutDocuments) {
        const parsed = parseTokens(h.tokens, TRUE_LEXICON, TRUE_GRAMMAR);
        expect(parsed).not.toBeNull();
      }
    }
  });
});
