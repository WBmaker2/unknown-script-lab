/* P0 글리프 12개 — 앱에서 SVG로 그리는 정확한 기호.
   glyph에는 의미 라벨을 직접 노출하지 않는다 (접근 이름은 순서만). */

export interface GlyphDef {
  id: string;
  svgPath: string;
  accessibleName: string;
}

const P = (d: string, id: string, n: number): GlyphDef => ({
  id,
  svgPath: d,
  accessibleName: `기호 ${n}`,
});

export const GLYPHS: readonly GlyphDef[] = [
  P('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'G0', 1),
  P('M4 4h16v16H4z', 'G1', 2),
  P('M12 4l8 16H4z', 'G2', 3),
  P('M12 3l3 7 7 2-7 2-3 7-3-7-7-2 7-2z', 'G3', 4),
  P('M4 12h16M12 4v16', 'G4', 5),
  P('M5 19h14', 'G5', 6),
  P('M12 5a7 7 0 1 0 .001 0Z M12 9a3 3 0 1 0 .001 0Z', 'G6', 7),
  P('M4 16c4-8 12-8 16 0', 'G7', 8),
  P('M6 6l12 12M18 6L6 18', 'G8', 9),
  P('M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z', 'G9', 10),
  P('M4 8c3-3 13-3 16 0s-13 9-16 6 5-3 8-3 5 0 8 3', 'G10', 11),
  P('M5 6l7 6 7-6M5 18l7-6 7 6', 'G11', 12),
];

export const GLYPH_IDS: readonly string[] = GLYPHS.map((g) => g.id);

/**
 * 정답 어휘 대응 (설계 진실). Glyph에는 의미 라벨을 노출하지 않으며,
 * 이 대응표는 증거 판정·검수용으로만 사용한다.
 * 행위자 3 (G0-2), 대상 3 (G3-5), 동사 3 (G6-8), 수량 2 (G9-10), 복수 표지 1 (G11).
 */
export const TRUE_LEXICON: Readonly<Record<string, string>> = {
  G0: 'A0',
  G1: 'A1',
  G2: 'A2',
  G3: 'O0',
  G4: 'O1',
  G5: 'O2',
  G6: 'V0',
  G7: 'V1',
  G8: 'V2',
  G9: 'C1',
  G10: 'C2',
  G11: 'PL',
};

export function assertGlyphId(id: string): void {
  if (!GLYPH_IDS.includes(id)) throw new Error(`알 수 없는 기호: ${id}`);
}
