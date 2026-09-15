/* scene — 구조화된 장면 설명 (이미지 대체 텍스트).
   자산 누락 시 이 설명과 정확한 기호 문자열을 보여준다. */

import { MEANING_LABELS, type Meaning } from '../engine/grammar';

const hasJongseong = (s: string): boolean => {
  const c = s.charCodeAt(s.length - 1);
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
};

const iga = (s: string): string => `${s}${hasJongseong(s) ? '이' : '가'}`;
const eulReul = (s: string): string => `${s}${hasJongseong(s) ? '을' : '를'}`;

export function meaningToScene(m: Meaning): string {
  const actor = MEANING_LABELS[m.actor];
  const object = MEANING_LABELS[m.object];
  const countWord = m.count === 1 ? '한 개' : '두 개';
  if (m.action === 'V1') return `${iga(actor)} ${eulReul(`${object} ${countWord}`)} 건네준다`;
  if (m.action === 'V0') return `${iga(actor)} ${eulReul(`${object} ${countWord}`)} 받는다`;
  return `${iga(actor)} ${eulReul(`${object} ${countWord}`)} 나른다`;
}

export function meaningToShort(m: Meaning): string {
  return `${MEANING_LABELS[m.actor]} ${MEANING_LABELS[m.object]} ${MEANING_LABELS[m.action]} ${m.count}개`;
}
