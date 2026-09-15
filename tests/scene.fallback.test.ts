import { describe, expect, it } from 'vitest';
import { MEANING_LABELS } from '../src/engine/grammar';
import { GLYPHS } from '../src/engine/glyphs';
import { DOC_POOL } from '../src/engine/missions';
import { meaningToScene } from '../src/views/scene';

describe('M4: 이미지 대체 검수', () => {
  it('모든 문서의 장면 설명에 행위자·대상·수량 단서가 들어있다', () => {
    for (const d of DOC_POOL) {
      const scene = meaningToScene(d.meaning);
      expect(scene).toContain(MEANING_LABELS[d.meaning.actor]);
      expect(scene).toContain(MEANING_LABELS[d.meaning.object]);
      expect(scene).toContain(d.meaning.count === 1 ? '한 개' : '두 개');
      expect(scene).not.toContain('(가)');
    }
  });

  it('글리프 접근 이름에 의미 라벨이 노출되지 않는다', () => {
    const labels = Object.values(MEANING_LABELS);
    for (const g of GLYPHS) {
      expect(g.accessibleName).toMatch(/^기호 \d+$/);
      for (const label of labels) {
        expect(g.accessibleName).not.toContain(label);
      }
    }
  });

  it('글리프 12개 경로가 서로 다르다 (고의 난이도 유사 없음)', () => {
    const paths = GLYPHS.map((g) => g.svgPath);
    expect(new Set(paths).size).toBe(12);
  });
});
