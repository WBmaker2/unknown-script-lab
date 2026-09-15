import type { HypothesisStatus } from '../engine/hypothesisValidator';

export interface LinkRecord {
  glyph: string;
  vocab: string;
  docIds: string[];
  status: HypothesisStatus;
  log: string[];
}

interface Props {
  links: LinkRecord[];
  survivorCount: number;
  totalCandidates: number;
  holdJustified: boolean;
  expectedAmbiguities: string[];
  onStatus: (glyph: string, status: HypothesisStatus) => void;
}

/** 가설 노트: 기호 뜻·어순 확신 상태, 수정은 이력으로 남고 삭제는 없다. */
export function HypothesisNote({
  links,
  survivorCount,
  totalCandidates,
  holdJustified,
  expectedAmbiguities,
  onStatus,
}: Props) {
  return (
    <section aria-label="가설 노트">
      <p>
        <span className="pinlabel" data-tone={survivorCount === 1 ? 'pin' : 'amber'}>
          남은 후보 {survivorCount} / {totalCandidates}
        </span>{' '}
        {holdJustified ? (
          <span className="pinlabel" data-tone="amber">보류 가능 — 복수 후보가 실제로 남음</span>
        ) : (
          <span className="pinlabel" data-tone="pin">후보 1개로 좁혀짐</span>
        )}
      </p>
      {expectedAmbiguities.length > 0 && (
        <p style={{ fontSize: 14 }}>의도된 모호함: {expectedAmbiguities.join(' / ')}</p>
      )}
      {links.length === 0 && <p>아직 연결된 가설이 없습니다. 단서 비교에서 기호-뜻을 연결하세요.</p>}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-3)' }}>
        {links.map((l) => (
          <li key={l.glyph} className="well" style={{ padding: 'var(--space-4)' }}>
            <p style={{ margin: '0 0 var(--space-2)', fontWeight: 700 }}>
              <span>
                {l.glyph} → {l.vocab}
              </span>{' '}
              <span className="pinlabel">{l.status}</span>
            </p>
            <p style={{ margin: '0 0 var(--space-2)', fontSize: 14 }}>근거: {l.docIds.join(', ')}</p>
            <label style={{ fontSize: 14 }}>
              상태 바꾸기 (이력에 남음){' '}
              <select
                value={l.status}
                onChange={(e) => onStatus(l.glyph, e.target.value as HypothesisStatus)}
              >
                <option value="가설">가설</option>
                <option value="확정">확정</option>
                <option value="보류">보류</option>
              </select>
            </label>
            <ol style={{ fontSize: 13.5, color: 'var(--ink-soft)', margin: 'var(--space-2) 0 0', paddingLeft: 20 }}>
              {l.log.map((entry, i) => (
                <li key={i}>{entry}</li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </section>
  );
}
