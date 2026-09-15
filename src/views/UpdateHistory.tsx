import { useEffect, useRef, useState } from 'react';

export interface HistoryEntry {
  date: string;
  text: string;
}

/** 항상 찾을 수 있는 위치의 작은 업데이트 내역. 실제 변경 때 기록한다. */
export function UpdateHistory({ entries }: { entries: HistoryEntry[] }) {
  const [open, setOpen] = useState(false);
  const openBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (open) closeBtn.current?.focus();
    else openBtn.current?.focus();
  }, [open ]);

  return (
    <>
      <button type="button" ref={openBtn} onClick={() => setOpen(true)}>
        업데이트 내역
      </button>
      {open && (
        <dialog open aria-labelledby="hist-title">
          <h2 id="hist-title">업데이트 내역</h2>
          <ul style={{ paddingLeft: 20 }}>
            {entries.map((e, i) => (
              <li key={i}>
                {e.date} — {e.text}
              </li>
            ))}
          </ul>
          <div className="cta-row">
            <button type="button" ref={closeBtn} onClick={() => setOpen(false)}>
              닫기
            </button>
          </div>
        </dialog>
      )}
    </>
  );
}
