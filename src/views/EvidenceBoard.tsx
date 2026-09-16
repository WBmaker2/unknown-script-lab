import { useMemo, useState } from 'react';
import { MEANING_LABELS } from '../engine/grammar';
import { checkLexiconLink } from '../engine/hypothesisValidator';
import type { MissionDocument } from '../engine/missions';
import { DocCard } from './DocCard';

interface Props {
  docs: MissionDocument[];
  onLink: (glyph: string, vocab: string, docIds: string[]) => void;
}
const VOCAB_OPTIONS = [
  ...(['A0', 'A1', 'A2'] as const).map((v) => ({ value: v, label: `${MEANING_LABELS[v]} (행위자)` })),
  ...(['O0', 'O1', 'O2'] as const).map((v) => ({ value: v, label: `${MEANING_LABELS[v]} (대상)` })),
  ...(['V0', 'V1', 'V2'] as const).map((v) => ({ value: v, label: `${MEANING_LABELS[v]} (동사)` })),
  { value: 'C1', label: '하나 (수량)' },
  { value: 'C2', label: '둘 (수량)' },
  { value: 'PL', label: '복수 표지' },
];

/** 단서 비교: 같은 기호·다른 기호 표시 + 기호-뜻 연결(선택 후 뜻 버튼 방식). */
export function EvidenceBoard({ docs, onLink }: Props) {
  const [pair, setPair] = useState<string[]>([]);
  const [glyph, setGlyph] = useState('');
  const [vocab, setVocab] = useState('A0');
  const [notice, setNotice] = useState('');

  const chosen = useMemo(() => docs.filter((d) => pair.includes(d.id)), [docs, pair]);
  const comparison = useMemo(() => {
    if (chosen.length !== 2) return null;
    const [a, b] = chosen;
    const setA = new Set(a.tokens);
    const setB = new Set(b.tokens);
    return {
      same: [...setA].filter((t) => setB.has(t)),
      onlyA: a.tokens.filter((t) => !setB.has(t)),
      onlyB: b.tokens.filter((t) => !setA.has(t)),
    };
  }, [chosen]);

  const toggle = (id: string) =>
    setPair((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id].slice(-2)));

  const submit = () => {
    if (!glyph) {
      setNotice('기호를 먼저 고르세요.');
      return;
    }
    const supporting = docs.filter((d) => pair.includes(d.id));
    const verdict = checkLexiconLink(
      glyph,
      vocab,
      supporting.map((d) => ({ id: d.id, meaning: d.meaning, tokens: d.tokens })),
    );
    if (verdict.verdict === 'needs-evidence') {
      setNotice('근거 문서 2장을 먼저 담아 주세요.');
      return;
    }
    if (verdict.verdict === 'refuted') {
      setNotice(verdict.reason);
      return;
    }
    onLink(glyph, vocab, pair);
    setNotice(`연결 기록: ${glyph} → ${vocab}. ${verdict.reason}`);
  };

  return (
    <section aria-label="단서 비교">
      <p className="flow-lead">비교에 담을 문서 2장을 고른 뒤, 같은 기호와 다른 기호를 확인하고 근거를 연결하세요.</p>
      <div className="docgrid">
        {docs.map((d) => (
          <DocCard key={d.id} doc={d} selected={pair.includes(d.id)} onToggle={toggle} />
        ))}
      </div>

      {comparison && (
        <div className="well comparison-panel">
          <h3 style={{ margin: '0 0 var(--space-2)' }}>같은 기호와 다른 기호</h3>
          <div className="comparison-grid" role="group" aria-label="기호 비교 결과">
            <div className="comparison-chip">
              <span className="pinlabel" data-tone="pin">같은 기호</span>
              <strong>{comparison.same.join(' · ') || '없음'}</strong>
            </div>
            <div className="comparison-chip">
              <span className="pinlabel" data-tone="amber">{chosen[0].id}에만</span>
              <strong>{comparison.onlyA.join(' · ') || '없음'}</strong>
            </div>
            <div className="comparison-chip">
              <span className="pinlabel" data-tone="amber">{chosen[1].id}에만</span>
              <strong>{comparison.onlyB.join(' · ') || '없음'}</strong>
            </div>
          </div>
          <div className="comparison-form">
            <label>
              기호
              <input
                value={glyph}
                onChange={(e) => setGlyph(e.target.value.trim().toUpperCase())}
                placeholder="예: G3"
                aria-describedby="glyph-hint"
              />
            </label>
            <span id="glyph-hint" className="field-hint">문서에 나온 기호 ID를 입력하세요.</span>
            <label>
              뜻
              <select value={vocab} onChange={(e) => setVocab(e.target.value)}>
                {VOCAB_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={submit}>
              근거 연결
            </button>
          </div>
          {notice && (
            <p role="status" className="status-line">
              {notice}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
