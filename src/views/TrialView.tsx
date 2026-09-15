import { useState } from 'react';
import { MEANING_LABELS, type ActorId, type Meaning, type ObjectId, type VerbId } from '../engine/grammar';
import type { MissionDocument } from '../engine/missions';
import { meaningToScene } from './scene';

export interface TrialResult {
  verdict: 'correct' | 'retry' | 'held';
  message: string;
}

interface Props {
  docs: MissionDocument[];
  results: Record<string, TrialResult>;
  holdAllowed: boolean;
  onSubmit: (docId: string, answer: Meaning | null) => void;
}

const ACTORS: ActorId[] = ['A0', 'A1', 'A2'];
const OBJECTS: ObjectId[] = ['O0', 'O1', 'O2'];
const VERBS: VerbId[] = ['V0', 'V1', 'V2'];

/** 새 문서 시험: 미공개 예문 번역 + 모호함 표시. 문자열 일치가 아닌 의미 구조로 판정한다. */
export function TrialView({ docs, results, holdAllowed, onSubmit }: Props) {
  const [drafts, setDrafts] = useState<Record<string, { m: Meaning; held: boolean }>>({});

  const draftFor = (id: string): { m: Meaning; held: boolean } =>
    drafts[id] ?? { m: { actor: 'A0', action: 'V0', object: 'O0', count: 1 }, held: false };

  const set = (id: string, patch: Partial<Meaning> & { held?: boolean }) => {
    const d = draftFor(id);
    setDrafts((prev) => ({ ...prev, [id]: { m: { ...d.m, ...patch }, held: patch.held ?? d.held } }));
  };

  return (
    <section aria-label="새 문서 시험">
      {docs.length === 0 && <p>미공개 예문이 없습니다.</p>}
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        {docs.map((d) => {
          const draft = draftFor(d.id);
          const result = results[d.id];
          return (
            <article key={d.id} className="well" aria-label={`시험 문서 ${d.id}`}>
              <p style={{ marginTop: 0, fontWeight: 650 }}>장면: {meaningToScene(d.meaning)}</p>
              <p style={{ fontFamily: 'var(--font-data)', fontSize: 14 }}>기호: {d.tokens.join(' ')}</p>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <label>
                  행위자{' '}
                  <select value={draft.m.actor} onChange={(e) => set(d.id, { actor: e.target.value as ActorId })}>
                    {ACTORS.map((a) => (
                      <option key={a} value={a}>{MEANING_LABELS[a]}</option>
                    ))}
                  </select>
                </label>
                <label>
                  대상{' '}
                  <select value={draft.m.object} onChange={(e) => set(d.id, { object: e.target.value as ObjectId })}>
                    {OBJECTS.map((o) => (
                      <option key={o} value={o}>{MEANING_LABELS[o]}</option>
                    ))}
                  </select>
                </label>
                <label>
                  동사{' '}
                  <select value={draft.m.action} onChange={(e) => set(d.id, { action: e.target.value as VerbId })}>
                    {VERBS.map((v) => (
                      <option key={v} value={v}>{MEANING_LABELS[v]}</option>
                    ))}
                  </select>
                </label>
                <label>
                  수량{' '}
                  <select
                    value={draft.m.count}
                    onChange={(e) => set(d.id, { count: Number(e.target.value) as 1 | 2 })}
                  >
                    <option value={1}>1개</option>
                    <option value={2}>2개</option>
                  </select>
                </label>
              </div>
              <div className="cta-row" style={{ alignItems: 'center' }}>
                <label style={{ fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={draft.held}
                    onChange={(e) => set(d.id, { held: e.target.checked })}
                  />{' '}
                  아직 구분 불가 (모름으로 남기기)
                </label>
                <button type="button" onClick={() => onSubmit(d.id, draft.held ? null : draft.m)}>
                  제출
                </button>
              </div>
              {result && (
                <p role="status" style={{ marginBottom: 0 }}>
                  <span
                    className="pinlabel"
                    data-tone={result.verdict === 'correct' || result.verdict === 'held' ? 'pin' : 'amber'}
                  >
                    {result.verdict === 'correct' ? '정답' : result.verdict === 'held' ? '정당한 보류' : '다시 보기'}
                  </span>{' '}
                  {result.message}
                  {!holdAllowed && result.verdict === 'retry' && ' 근거 문서로 돌아가 보세요.'}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
