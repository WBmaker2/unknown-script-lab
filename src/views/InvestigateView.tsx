import { useState } from 'react';
import type { MissionDocument } from '../engine/missions';
import { DocCard } from './DocCard';

export interface InvestigateOption {
  doc: MissionDocument;
  eliminates: number;
}

interface Props {
  options: InvestigateOption[];
  budget: number;
  openedIds: string[];
  onOpen: (id: string) => void;
}

/** 추가 조사: 자료 비용과 후보의 구분 수를 보고 문서 열기. 취소는 예산·이력을 깨뜨리지 않는다. */
export function InvestigateView({ options, budget, openedIds, onOpen }: Props) {
  const [pending, setPending] = useState<string | null>(null);
  const target = options.find((o) => o.doc.id === pending)?.doc ?? null;

  return (
    <section aria-label="추가 조사">
      <p>
        <span className="pinlabel" data-tone="amber">조사 예산 {budget} 남음</span>
      </p>
      <div className="docgrid">
        {options.map(({ doc, eliminates }) => {
          const opened = openedIds.includes(doc.id);
          return (
            <div key={doc.id}>
              <DocCard doc={doc} revealed={opened} />
              <p style={{ fontSize: 14 }}>
                {eliminates === 0
                  ? '남은 가설을 가려내지 못합니다.'
                  : `남은 가설 중 ${eliminates}개를 가려냅니다.`}{' '}
                비용 {doc.unlockCost}.
              </p>
              {!opened && (
                <button
                  type="button"
                  disabled={budget < doc.unlockCost}
                  onClick={() => setPending(doc.id)}
                >
                  {budget < doc.unlockCost ? '예산 부족' : '열기'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {target && (
        <dialog open aria-labelledby="confirm-title">
          <h2 id="confirm-title">문서 {target.id} 열기</h2>
          <p>
            비용 {target.unlockCost}을 쓰고 기호를 공개합니다. 남은 예산{' '}
            {budget - target.unlockCost}. 취소하면 예산과 가설 이력이 그대로 유지됩니다.
          </p>
          <div className="cta-row">
            <button
              type="button"
              className="gi-pulse"
              onClick={() => {
                onOpen(target.id);
                setPending(null);
              }}
            >
              확인하고 열기
            </button>
            <button type="button" onClick={() => setPending(null)}>
              취소
            </button>
          </div>
        </dialog>
      )}
    </section>
  );
}
