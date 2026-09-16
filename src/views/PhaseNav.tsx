

export type Phase = '보관함' | '비교' | '가설' | '추가조사' | '시험';

export const PHASES: Phase[] = ['보관함', '비교', '가설', '추가조사', '시험'];

const LABELS: Record<Phase, string> = {
  보관함: '문서 보관함',
  비교: '단서 비교',
  가설: '가설 노트',
  추가조사: '추가 조사',
  시험: '새 문서 시험',
};

interface Props {
  current: Phase;
  suggested: Phase;
  completed: Phase[];
  onSelect: (p: Phase) => void;
}

/** 5단계 탐구 진행: 완료·현재·제안 단계를 텍스트+색으로 구분. */
export function PhaseNav({ current, suggested, completed, onSelect }: Props) {
  const idx = PHASES.indexOf(current);
  return (
    <nav aria-label="탐구 단계" className="phase-nav">
      <ol className="phase-track" aria-label="진행 단계">
        {PHASES.map((p, i) => {
          const done = completed.includes(p) || i < idx;
          const isCurrent = p === current;
          const isSuggested = !isCurrent && p === suggested;
          return (
            <li
              key={p}
              className={[
                'phase-step',
                done ? 'phase-step--done' : '',
                isCurrent ? 'phase-step--current' : '',
                isSuggested ? 'phase-step--suggested' : '',
              ].filter(Boolean).join(' ')}
            >
              <button
                type="button"
                onClick={() => onSelect(p)}
                aria-current={isCurrent ? 'step' : undefined}
                className={isSuggested ? 'gi-pulse' : undefined}
              >
                <span className="phase-step__num" aria-hidden="true">{i + 1}</span>
                <span className="phase-step__label">{LABELS[p]}</span>
                {done && !isCurrent && <span className="phase-step__state">완료</span>}
                {isSuggested && <span className="phase-step__state">다음 제안</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function phaseLabel(p: Phase): string {
  return LABELS[p];
}
