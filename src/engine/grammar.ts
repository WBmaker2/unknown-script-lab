/* P0 인공 언어 문법 — 렌더러와 분리된 순수 정의.
   P0 어휘 12개: 행위자 3, 대상 3, 동사 3, 수량 2, 복수 표지 1.
   후보 27개(=3순서×3수량위치×3복수위치)는 교육용 사전 정의 집합이며
   가능한 모든 언어의 수가 아니다. */

export type ActorId = 'A0' | 'A1' | 'A2';
export type ObjectId = 'O0' | 'O1' | 'O2';
export type VerbId = 'V0' | 'V1' | 'V2';
export type CountValue = 1 | 2;

export interface Meaning {
  actor: ActorId;
  action: VerbId;
  object: ObjectId;
  count: CountValue;
}

export type SlotOrder = 'AOV' | 'AVO' | 'OAV';
export type AffixPos = 'beforeObject' | 'afterObject' | 'afterVerb';

export interface Grammar {
  id: string;
  order: SlotOrder;
  quantPos: AffixPos;
  pluralPos: AffixPos;
}

export const ACTORS: readonly ActorId[] = ['A0', 'A1', 'A2'];
export const OBJECTS: readonly ObjectId[] = ['O0', 'O1', 'O2'];
export const VERBS: readonly VerbId[] = ['V0', 'V1', 'V2'];

export const TRUE_GRAMMAR: Grammar = {
  id: 'G-TRUE',
  order: 'AOV',
  quantPos: 'afterObject',
  pluralPos: 'afterObject',
};

const ORDERS: readonly SlotOrder[] = ['AOV', 'AVO', 'OAV'];
const POSITIONS: readonly AffixPos[] = ['beforeObject', 'afterObject', 'afterVerb'];

/** 교육용 사전 정의 후보 27개. 전수 탐색이 아님을 UI에서 고지한다. */
export const CANDIDATE_GRAMMARS: readonly Grammar[] = (() => {
  const list: Grammar[] = [];
  let n = 0;
  for (const order of ORDERS)
    for (const quantPos of POSITIONS)
      for (const pluralPos of POSITIONS) {
        n += 1;
        list.push({ id: `G${String(n).padStart(2, '0')}`, order, quantPos, pluralPos });
      }
  return list;
})();

export function isPlural(m: Meaning): boolean {
  return m.count > 1;
}

export function assertMeaning(m: Meaning): void {
  if (!m || typeof m !== 'object') throw new Error('meaning은 객체여야 합니다.');
  if (!ACTORS.includes(m.actor)) throw new Error(`유효하지 않은 행위자: ${String(m.actor)}`);
  if (!VERBS.includes(m.action)) throw new Error(`유효하지 않은 동사: ${String(m.action)}`);
  if (!OBJECTS.includes(m.object)) throw new Error(`유효하지 않은 대상: ${String(m.object)}`);
  if (!Number.isFinite(m.count) || !Number.isInteger(m.count) || (m.count !== 1 && m.count !== 2))
    throw new Error(`수량은 1 또는 2여야 합니다: ${String(m.count)}`);
}

/** 구현 검증용 설계 사례 (허용오차·단위는 엔진에 맞춰 재확인). */
export const VERIFY_MEANINGS: readonly Meaning[] = [
  { actor: 'A0', action: 'V0', object: 'O0', count: 1 }, // 아이 사과 받다
  { actor: 'A1', action: 'V0', object: 'O0', count: 1 }, // 어른 사과 받다 (한 기호만 다름)
  { actor: 'A0', action: 'V1', object: 'O0', count: 1 }, // 아이 사과 주다 (다른 한 기호만 다름)
  { actor: 'A0', action: 'V1', object: 'O1', count: 1 },
  { actor: 'A1', action: 'V1', object: 'O0', count: 1 },
  { actor: 'A2', action: 'V2', object: 'O2', count: 1 },
  { actor: 'A0', action: 'V2', object: 'O0', count: 2 }, // 복수 표지 포함
  { actor: 'A1', action: 'V0', object: 'O1', count: 2 },
  { actor: 'A2', action: 'V1', object: 'O2', count: 2 },
  { actor: 'A0', action: 'V0', object: 'O2', count: 1 },
];

export const MEANING_LABELS: Record<string, string> = {
  A0: '아이',
  A1: '어른',
  A2: '상인',
  O0: '사과',
  O1: '빵',
  O2: '생선',
  V0: '받다',
  V1: '주다',
  V2: '나르다',
};
