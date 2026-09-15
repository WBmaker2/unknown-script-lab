import { describe, expect, it } from 'vitest';
import { encodeMeaning } from '../src/engine/encoder';
import {
  CANDIDATE_GRAMMARS,
  TRUE_GRAMMAR,
  VERIFY_MEANINGS,
  type Meaning,
} from '../src/engine/grammar';
import { TRUE_LEXICON } from '../src/engine/glyphs';
import { parseTokens, sameMeaning } from '../src/engine/parser';

describe('M1: parse(encode(meaning)) roundtrip', () => {
  it('모든 검증 예문이 같은 의미로 돌아온다', () => {
    for (const m of VERIFY_MEANINGS) {
      const tokens = encodeMeaning(m, TRUE_GRAMMAR, TRUE_LEXICON);
      const back = parseTokens(tokens, TRUE_LEXICON, TRUE_GRAMMAR);
      expect(back, `roundtrip 실패: ${JSON.stringify(m)}`).not.toBeNull();
      expect(sameMeaning(back as Meaning, m)).toBe(true);
    }
  });

  it('대비 쌍은 정확히 한 기호만 다르다', () => {
    const take = encodeMeaning(
      { actor: 'A0', action: 'V0', object: 'O0', count: 1 },
      TRUE_GRAMMAR,
      TRUE_LEXICON,
    );
    const giveActor = encodeMeaning(
      { actor: 'A1', action: 'V0', object: 'O0', count: 1 },
      TRUE_GRAMMAR,
      TRUE_LEXICON,
    );
    const giveVerb = encodeMeaning(
      { actor: 'A0', action: 'V1', object: 'O0', count: 1 },
      TRUE_GRAMMAR,
      TRUE_LEXICON,
    );
    const diff = (a: string[], b: string[]) => a.filter((t, i) => t !== b[i]).length;
    expect(take.length).toBe(giveActor.length);
    expect(diff(take, giveActor)).toBe(1);
    expect(diff(take, giveVerb)).toBe(1);
  });

  it('복수 표지는 수량 2일 때만 붙는다', () => {
    const single = encodeMeaning(
      { actor: 'A0', action: 'V2', object: 'O0', count: 1 },
      TRUE_GRAMMAR,
      TRUE_LEXICON,
    );
    const plural = encodeMeaning(
      { actor: 'A0', action: 'V2', object: 'O0', count: 2 },
      TRUE_GRAMMAR,
      TRUE_LEXICON,
    );
    const pluralGlyph = Object.entries(TRUE_LEXICON).find(([, v]) => v === 'PL')?.[0] as string;
    expect(single).not.toContain(pluralGlyph);
    expect(plural).toContain(pluralGlyph);
    expect(single.length).toBe(4);
    expect(plural.length).toBe(5);
  });
});

describe('M1: 입력 검증', () => {
  it('범위 밖 수량·NaN을 차단한다', () => {
    const bad = [0, 3, Number.NaN, Number.POSITIVE_INFINITY] as unknown as Array<1 | 2>;
    for (const count of bad) {
      expect(() =>
        encodeMeaning({ actor: 'A0', action: 'V0', object: 'O0', count }, TRUE_GRAMMAR, TRUE_LEXICON),
      ).toThrow();
    }
  });

  it('미등록 기호 대응을 차단한다', () => {
    expect(() =>
      encodeMeaning(
        { actor: 'A0', action: 'V0', object: 'O0', count: 1 },
        TRUE_GRAMMAR,
        { ...TRUE_LEXICON, G0: 'ZZ' },
      ),
    ).toThrow();
  });

  it('파서는 불일치·훼손 토큰에 null을 반환한다', () => {
    const good = encodeMeaning(
      { actor: 'A0', action: 'V0', object: 'O0', count: 1 },
      TRUE_GRAMMAR,
      TRUE_LEXICON,
    );
    expect(parseTokens(['GX'], TRUE_LEXICON, TRUE_GRAMMAR)).toBeNull();
    expect(parseTokens([], TRUE_LEXICON, TRUE_GRAMMAR)).toBeNull();
    expect(parseTokens(good.slice(0, 3), TRUE_LEXICON, TRUE_GRAMMAR)).toBeNull();
    const avo = CANDIDATE_GRAMMARS.find(
      (g) => g.order === 'AVO' && g.quantPos === 'afterObject' && g.pluralPos === 'afterObject',
    );
    expect(avo).toBeDefined();
    expect(parseTokens(good, TRUE_LEXICON, avo as { id: string; order: 'AVO'; quantPos: 'afterObject'; pluralPos: 'afterObject' })).toBeNull();
  });

  it('교육용 후보는 27개이며 전수가 아님을 전제한다', () => {
    expect(CANDIDATE_GRAMMARS).toHaveLength(27);
  });
});
