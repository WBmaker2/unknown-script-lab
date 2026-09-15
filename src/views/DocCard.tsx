import { GLYPHS } from '../engine/glyphs';
import type { MissionDocument } from '../engine/missions';
import { meaningToScene } from './scene';
import { Glyph } from './Glyph';

interface Props {
  doc: MissionDocument;
  selected?: boolean;
  onToggle?: (id: string) => void;
  revealed?: boolean;
}

const glyphById = new Map(GLYPHS.map((g) => [g.id, g]));

/** 문서 웰: 구조화된 장면 설명 + 정확한 기호 문자열 + 핀 라벨. */
export function DocCard({ doc, selected, onToggle, revealed = true }: Props) {
  return (
    <article
      className="well"
      style={{ padding: 'var(--space-4)', ...(selected ? { borderColor: 'var(--accent)' } : {}) }}
      aria-label={`문서 ${doc.id}`}
    >
      <p style={{ margin: '0 0 var(--space-2)', fontWeight: 650 }}>{meaningToScene(doc.meaning)}</p>
      {revealed ? (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }} aria-label={`기호열 ${doc.tokens.join(' ')}`}>
          {doc.tokens.map((t, i) => {
            const g = glyphById.get(t);
            return g ? <Glyph key={`${t}-${i}`} glyph={g} label={`${g.accessibleName} (문서 ${doc.id})`} /> : null;
          })}
        </div>
      ) : (
        <p style={{ margin: '0 0 var(--space-2)' }}>비용을 쓰고 열면 기호가 공개됩니다.</p>
      )}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
        <span className="pinlabel" data-tone="pin">증거 Lv.{doc.evidenceLevel}</span>
        <span className="pinlabel" data-tone={doc.unlockCost === 0 ? 'pin' : 'amber'}>
          비용 {doc.unlockCost}
        </span>
        <span className="pinlabel">{doc.id}</span>
      </div>
      {onToggle && (
        <div className="cta-row">
          <button type="button" onClick={() => onToggle(doc.id)} aria-pressed={selected}>
            {selected ? '선택 해제' : '비교에 담기'}
          </button>
        </div>
      )}
    </article>
  );
}
