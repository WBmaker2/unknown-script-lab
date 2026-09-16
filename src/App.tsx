import { useEffect, useMemo, useState } from 'react';
import { CANDIDATE_HYPOTHESES, filterHypotheses, isHoldJustified } from './engine/hypothesisValidator';
import type { HypothesisStatus } from './engine/hypothesisValidator';
import type { Meaning } from './engine/grammar';
import { buildMissions, type Mission } from './engine/missions';
import { loadRecords, makeRecord, saveRecord } from './engine/store';
import { sameMeaning } from './engine/parser';
import { DocCard } from './views/DocCard';
import { EvidenceBoard } from './views/EvidenceBoard';
import { HypothesisNote, type LinkRecord } from './views/HypothesisNote';
import { InvestigateView } from './views/InvestigateView';
import { PhaseNav, type Phase } from './views/PhaseNav';
import { TrialView, type TrialResult } from './views/TrialView';
import { UpdateHistory, type HistoryEntry } from './views/UpdateHistory';
import { SCENE_IMAGES } from './views/sceneAssets';

const START_BUDGET = 3;
const now = () => new Date().toISOString().slice(0, 10);

function completedPhases(phase: Phase, links: LinkRecord[], opened: string[], results: Record<string, TrialResult>): Phase[] {
  const done: Phase[] = [];
  if (phase !== '보관함') done.push('보관함');
  if (links.length > 0 || phase === '가설' || phase === '추가조사' || phase === '시험') done.push('비교');
  if (links.length >= 1 || phase === '추가조사' || phase === '시험') done.push('가설');
  if (opened.length > 0 || phase === '시험') done.push('추가조사');
  if (Object.keys(results).length > 0) done.push('시험');
  return [...new Set(done)];
}

export function App() {
  const missions = useMemo<Mission[]>(() => buildMissions(), []);
  const [missionId, setMissionId] = useState(missions[0].id);
  const mission = missions.find((m) => m.id === missionId) ?? missions[0];

  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<Phase>('보관함');
  const [opened, setOpened] = useState<string[]>([]);
  const [budget, setBudget] = useState(START_BUDGET);
  const [links, setLinks] = useState<LinkRecord[]>([]);
  const [results, setResults] = useState<Record<string, TrialResult>>({});
  const [history, setHistory] = useState<HistoryEntry[]>([
    { date: '2026-09-15', text: '최초 개발 시작 — M1 엔진, M2 후보판정 구현' },
    { date: '2026-09-16', text: '교육용 리디자인 — Specimen Tray UI 정렬, 단계 진행 표시, 장면 일러스트 추가' },
  ]);

  const openedDocs = useMemo(
    () => [...mission.initialDocuments, ...mission.optionalDocuments.filter((d) => opened.includes(d.id))],
    [mission, opened],
  );
  const evidence = useMemo(
    () => openedDocs.map((d) => ({ id: d.id, meaning: d.meaning, tokens: d.tokens })),
    [openedDocs],
  );
  const survivors = useMemo(() => filterHypotheses(evidence), [evidence]);
  const hold = isHoldJustified(survivors);

  const usefulness = useMemo(() => {
    const base = survivors.length;
    const map: Record<string, number> = {};
    for (const d of mission.optionalDocuments) {
      if (opened.includes(d.id)) continue;
      const after = filterHypotheses([...evidence, { id: d.id, meaning: d.meaning, tokens: d.tokens }]);
      map[d.id] = base - after.length;
    }
    return map;
  }, [mission, opened, evidence, survivors.length]);

  const suggested: Phase = !started
    ? '보관함'
    : links.length === 0
      ? '비교'
      : survivors.length > 1 && mission.optionalDocuments.some((d) => !opened.includes(d.id))
        ? '추가조사'
        : links.length < 3
          ? '가설'
          : '시험';

  const completed = completedPhases(phase, links, opened, results);

  const switchMission = (id: string) => {
    setMissionId(id);
    setStarted(false);
    setPhase('보관함');
    setOpened([]);
    setBudget(START_BUDGET);
    setLinks([]);
    setResults({});
  };

  const addLink = (glyph: string, vocab: string, docIds: string[]) => {
    setLinks((prev) => {
      const found = prev.find((l) => l.glyph === glyph);
      const entry = `${now()} 연결 ${glyph}→${vocab} (근거 ${docIds.join(',')})`;
      if (found) {
        return prev.map((l) =>
          l.glyph === glyph ? { ...l, vocab, docIds, log: [...l.log, entry] } : l,
        );
      }
      return [...prev, { glyph, vocab, docIds, status: '가설' as HypothesisStatus, log: [entry] }];
    });
    setHistory((h) => [...h, { date: now(), text: `가설 연결 ${glyph}→${vocab}` }]);
  };

  const changeStatus = (glyph: string, status: HypothesisStatus) => {
    setLinks((prev) =>
      prev.map((l) =>
        l.glyph === glyph ? { ...l, status, log: [...l.log, `${now()} 상태→${status}`] } : l,
      ),
    );
  };

  const openDoc = (id: string) => {
    const doc = mission.optionalDocuments.find((d) => d.id === id);
    if (!doc || opened.includes(id) || budget < doc.unlockCost) return;
    setOpened((o) => [...o, id]);
    setBudget((b) => b - doc.unlockCost);
    setHistory((h) => [...h, { date: now(), text: `추가 조사 ${id} 열람 (비용 ${doc.unlockCost})` }]);
  };

  const grade = (docId: string, answer: Meaning | null) => {
    const doc = mission.holdoutDocuments.find((d) => d.id === docId);
    if (!doc) return;
    if (answer === null) {
      setResults((r) => ({
        ...r,
        [docId]: hold
          ? { verdict: 'held', message: `남은 후보 ${survivors.length}개와 일치하는 정당한 보류입니다.` }
          : { verdict: 'retry', message: '후보는 1개로 좁혀졌습니다. 번역을 시도해 보세요.' },
      }));
    } else {
      setResults((r) => ({
        ...r,
        [docId]: sameMeaning(answer, doc.meaning)
          ? { verdict: 'correct', message: '의미 구조가 일치합니다.' }
          : { verdict: 'retry', message: '의미 구조가 어긋납니다.' },
      }));
    }
  };

  useEffect(() => {
    if (!started || links.length === 0) return;
    saveRecord(
      makeRecord(
        mission.id,
        { opened, budget },
        {
          observations: links.map((l) => `${l.glyph}→${l.vocab}[${l.status}]`),
          prediction: `남은 후보 ${survivors.length}개`,
          explanation: '가설 노트 변경 시 자동 기록',
        },
      ),
    );
  }, [started, links, mission.id, opened, budget, survivors.length]);

  const storedCount = loadRecords().length;
  const hero = SCENE_IMAGES['scene-hero'];

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          미지의 문자 해독 연구소
          <small>사전 없이 기호와 장면만으로 언어 규칙 찾기</small>
        </div>
        <div className="mission-switch" role="group" aria-label="미션 선택">
          {missions.map((m, i) => (
            <button
              key={m.id}
              type="button"
              className={mission.id === m.id ? 'mission-switch__btn mission-switch__btn--active' : 'mission-switch__btn'}
              onClick={() => switchMission(m.id)}
              aria-pressed={mission.id === m.id}
            >
              미션 {i + 1}
            </button>
          ))}
        </div>
      </header>

      {!started ? (
        <main className="layout layout--intro">
          <section className="well welcome-well" aria-labelledby="q-title">
            <div className="welcome-grid">
              <div className="welcome-copy">
                <p className="welcome-kicker">25분 탐구 · 가상 언어 증거 추론</p>
                <h2 id="q-title">사전 없이 반복되는 기호와 장면만으로 언어 규칙을 찾을 수 있을까?</h2>
                <p>
                  {mission.title}. 사람·물건·수량이 그려진 문서 {mission.initialDocuments.length}장에서
                  공통 기호를 찾고, 가설 3개를 연결한 뒤 새 문서에서 검사합니다.
                </p>
                <ul className="welcome-steps" aria-label="탐구 순서">
                  <li>문서 보관함에서 장면 비교</li>
                  <li>단서 비교로 기호-뜻 가설 연결</li>
                  <li>추가 조사 또는 새 문서 시험</li>
                </ul>
                <div className="cta-row">
                  <button type="button" className="gi-pulse" onClick={() => setStarted(true)}>
                    시작하기
                  </button>
                  <UpdateHistory entries={history} />
                </div>
              </div>
              <figure className="welcome-figure">
                <img className="scene-thumb scene-thumb--hero" src={hero.src} alt={hero.alt} width={480} height={270} />
                <figcaption>가상 탐구실 — 생성 일러스트는 학습 분위기만 보조합니다.</figcaption>
              </figure>
            </div>
          </section>
        </main>
      ) : (
        <main className="layout">
          <div className="main-flow">
            <PhaseNav current={phase} suggested={suggested} completed={completed} onSelect={setPhase} />

            {phase === '보관함' && (
              <section aria-label="문서 보관함">
                <p className="flow-lead">초기 문서 {mission.initialDocuments.length}장을 읽고 공통 기호를 찾아 보세요.</p>
                <div className="docgrid">
                  {mission.initialDocuments.map((d) => (
                    <DocCard key={d.id} doc={d} />
                  ))}
                </div>
              </section>
            )}
            {phase === '비교' && <EvidenceBoard docs={openedDocs} onLink={addLink} />}
            {phase === '가설' && (
              <HypothesisNote
                links={links}
                survivorCount={survivors.length}
                totalCandidates={CANDIDATE_HYPOTHESES.length}
                holdJustified={hold}
                expectedAmbiguities={mission.expectedAmbiguities}
                onStatus={changeStatus}
              />
            )}
            {phase === '추가조사' && (
              <InvestigateView
                options={mission.optionalDocuments
                  .filter((d) => !opened.includes(d.id))
                  .map((d) => ({ doc: d, eliminates: usefulness[d.id] ?? 0 }))}
                budget={budget}
                openedIds={opened}
                onOpen={openDoc}
              />
            )}
            {phase === '시험' && (
              <TrialView docs={mission.holdoutDocuments} results={results} holdAllowed={hold} onSubmit={grade} />
            )}
          </div>

          <aside className="well research-note" aria-label="연구 노트 요약">
            <h2>{mission.title}</h2>
            <p>
              <span className="pinlabel" data-tone={survivors.length === 1 ? 'pin' : 'amber'}>
                남은 후보 {survivors.length} / {CANDIDATE_HYPOTHESES.length}
              </span>
            </p>
            <p className="note-copy">
              후보 수는 교육용 사전 정의 집합이며 가능한 모든 언어의 수가 아닙니다.
            </p>
            <dl className="note-stats">
              <div><dt>연결</dt><dd>{links.length}개</dd></div>
              <div><dt>추가 문서</dt><dd>{opened.length}개</dd></div>
              <div><dt>예산</dt><dd>{budget}</dd></div>
            </dl>
            <div className="cta-row">
              <UpdateHistory entries={history} />
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(loadRecords(), null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'unknown-script-lab-records.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                기록보내기{storedCount > 0 ? ` (${storedCount})` : ''}
              </button>
            </div>
          </aside>
        </main>
      )}

      <footer className="footer">
        <span>P0 · 언어 1개 · 기호 12개 · 미션 3개</span>
        <span>밝은 한국어 UI · 320–1280px 검증</span>
      </footer>
    </div>
  );
}
