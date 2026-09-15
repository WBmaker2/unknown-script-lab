/* missions — 미션 3개와 문서 풀. 결정적(난수 없음)이며 재현 가능하다.
   검수 미션: 초기 문서에서 후보 2개가 남고 추가 문서 1장으로 1개가 된다.
   모호함 미션: 가용 문서로 1개까지 좁혀지지 않아 보류가 정당한 답이다. */

import { encodeMeaning, type Lexicon } from './encoder';
import { TRUE_LEXICON as GLYPH_LEXICON } from './glyphs';
import { TRUE_GRAMMAR, VERIFY_MEANINGS, type Meaning } from './grammar';
import {
  CANDIDATE_HYPOTHESES,
  filterHypotheses,
  type EvidenceDocument,
} from './hypothesisValidator';

export interface MissionDocument {
  id: string;
  imageId: string;
  meaningId: string;
  meaning: Meaning;
  tokens: string[];
  evidenceLevel: 1 | 2;
  unlockCost: number;
}

export interface Mission {
  id: string;
  title: string;
  initialDocuments: MissionDocument[];
  optionalDocuments: MissionDocument[];
  holdoutDocuments: MissionDocument[];
  expectedAmbiguities: string[];
}

export const TRUE_LEXICON: Lexicon = GLYPH_LEXICON;

const EXTRA_MEANINGS: readonly Meaning[] = [
  { actor: 'A1', action: 'V1', object: 'O1', count: 1 },
  { actor: 'A2', action: 'V0', object: 'O0', count: 2 },
];

/** 문서 풀 12장 (검증 예문 10 + 전이 변형 2). */
export const DOC_POOL: readonly MissionDocument[] = [...VERIFY_MEANINGS, ...EXTRA_MEANINGS].map(
  (meaning, i) => ({
    id: `D${i}`,
    imageId: `scene-${i}`,
    meaningId: `M-${i}`,
    meaning,
    tokens: encodeMeaning(meaning, TRUE_GRAMMAR, TRUE_LEXICON),
    evidenceLevel: (i % 3 === 2 ? 2 : 1) as 1 | 2,
    unlockCost: i < 5 ? 0 : i < 9 ? 1 : 2,
  }),
);

const toEvidence = (d: MissionDocument): EvidenceDocument => ({
  id: d.id,
  meaning: d.meaning,
  tokens: d.tokens,
});

function hypothesisSurvivors(docs: readonly MissionDocument[]): number {
  return filterHypotheses(docs.map(toEvidence), CANDIDATE_HYPOTHESES).length;
}

/** 초기 문서 부분집합 중 결합 후보가 정확히 2개 남는 첫 조합을 찾는다. */
function findNarrowingInitial(): MissionDocument[] {
  const pool = DOC_POOL;
  for (let size = 2; size <= 5; size++) {
    const combo: number[] = Array.from({ length: size }, (_, k) => k);
    for (;;) {
      const docs = combo.map((k) => pool[k]);
      if (hypothesisSurvivors(docs) === 2) return docs;
      let p = size - 1;
      while (p >= 0 && combo[p] === pool.length - size + p) p -= 1;
      if (p < 0) break;
      combo[p] += 1;
      for (let q = p + 1; q < size; q++) combo[q] = combo[q - 1] + 1;
    }
  }
  throw new Error('2개로 좁혀지는 초기 문서 조합을 찾지 못했습니다.');
}

/** 검수 미션: 초기 2후보 → 추가 1장으로 1후보. */
export function buildNarrowingMission(): Mission {
  const initial = findNarrowingInitial();
  const initialIds = new Set(initial.map((d) => d.id));
  const closer = DOC_POOL.find(
    (d) => !initialIds.has(d.id) && hypothesisSurvivors([...initial, d]) === 1,
  );
  if (!closer) throw new Error('1개로 좁히는 추가 문서를 찾지 못했습니다.');
  const used = new Set([...initialIds, closer.id]);
  const holdout = DOC_POOL.filter((d) => !used.has(d.id)).slice(0, 3);
  return {
    id: 'mission-narrow',
    title: '검수 미션 — 반례 한 장으로 가설 확정하기',
    initialDocuments: initial,
    optionalDocuments: [closer],
    holdoutDocuments: holdout,
    expectedAmbiguities: [],
  };
}

/** 수량·복수 미션: 복수 표지 규칙을 가려낸다. */
export function buildPluralMission(): Mission {
  const pluralDocs = DOC_POOL.filter((d) => d.meaning.count > 1);
  const singleDocs = DOC_POOL.filter((d) => d.meaning.count === 1);
  return {
    id: 'mission-plural',
    title: '수량 미션 — 복수 표지의 위치 찾기',
    initialDocuments: [...singleDocs.slice(0, 2), pluralDocs[0]],
    optionalDocuments: [pluralDocs[1]],
    holdoutDocuments: [pluralDocs[2], singleDocs[2]].filter(Boolean),
    expectedAmbiguities: [],
  };
}

/** 모호함 미션: 어떤 가용 문서를 열어도 1개까지 좁혀지지 않아 보류가 정답이다. */
export function buildAmbiguityMission(): Mission {
  const pool = DOC_POOL;
  for (let a = 0; a < pool.length; a++) {
    for (let b = a + 1; b < pool.length; b++) {
      for (let c = b + 1; c < pool.length; c++) {
        const initial = [pool[a], pool[b], pool[c]];
        if (hypothesisSurvivors(initial) < 3) continue;
        const rest = pool.filter((_, k) => k !== a && k !== b && k !== c);
        const keepers = rest.filter((d) => hypothesisSurvivors([...initial, d]) >= 2);
        if (keepers.length < 2) continue;
        const optional = keepers.slice(0, 2);
        if (hypothesisSurvivors([...initial, ...optional]) < 2) continue;
        const used = new Set([...initial, ...optional].map((d) => d.id));
        const holdout = pool.filter((d) => !used.has(d.id)).slice(0, 1);
        return {
          id: 'mission-ambiguous',
          title: '모호함 미션 — 아직 모른다고 말하기',
          initialDocuments: initial,
          optionalDocuments: optional,
          holdoutDocuments: holdout,
          expectedAmbiguities: [
            '가용 문서로는 남은 후보를 1개까지 가릴 수 없어 복수 후보 유지가 정당한 답',
          ],
        };
      }
    }
  }
  throw new Error('모호함 미션 조합을 찾지 못했습니다.');
}

export function buildMissions(): Mission[] {
  return [buildNarrowingMission(), buildPluralMission(), buildAmbiguityMission()];
}
