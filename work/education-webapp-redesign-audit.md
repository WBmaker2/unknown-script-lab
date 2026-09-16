# Education Web App Redesign — Initial Audit

- 생성일: 2026-09-16
- 검수 Skill: impeccable (runtime-loaded, degraded: single-context — spawn_agent unavailable)
- 대상: src/App.tsx 및 전체 학습자 흐름

## Method

⚠️ DEGRADED: single-context (spawn_agent unavailable in this session)

코드·PRODUCT.md·DESIGN.md·기존 테스트를 기반으로 Operate 모드 교육 앱 감사.

## Design Specificity Verdict

**양호 — 제품 특화됨.** Specimen Tray(흰 웰·핀라벨·단일 aura) 메타포가 DESIGN.md와 app.css에 이미 반영되어 있고, 가상 언어 해독이라는 학습 목표가 UI 문구·흐름에 일관된다. 다만 시각 자산이 전무하여 문서 카드가 텍스트만으로 장면을 전달하고, 시작 화면이 기능적으로는 맞지만 탐구실 분위기가 약함.

## Heuristic Scores (요약)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | 단계 탭 있음, 진행률/체크리스트 부재 |
| 2 | Match System / Real World | 4 | 한국어 교실 맥락·탐구 용어 적절 |
| 3 | User Control and Freedom | 3 | 조사 취소·가설 이력 유지 양호 |
| 4 | Consistency and Standards | 3 | 웰·핀라벨 일관, 카드 밀도 편차 |
| 5 | Error Prevention | 3 | 근거 없으면 연결 거부 |
| 6 | Recognition Rather Than Recall | 2 | 장면이 텍스트만, 시각 기억 보조 약함 |
| 7 | Flexibility and Efficiency | n/a | 교육 Operate — 단일 경로 의도 |
| 8 | Aesthetic and Minimalist Design | 3 | 절제됨, 다만 장식·깊이 부족 |
| 9 | Error Recovery | 3 | 상태 메시지·재시도 경로 있음 |
| 10 | Help and Documentation | n/a | 업데이트 내역만, 별도 도움말 없음 |

**Total: 24/32 (Good)**

## Cognitive Load

- 실패 2건: (1) 단계 탭 5개 동시 노출 (2) 비교 화면에서 기호 입력+뜻 선택이 한 패널에 밀집
- 개선: 단계 진행 표시, 비교 결과 시각 구분 강화

## P0/P1 Issues

### P0
- 없음 (핵심 학습 흐름·판정·gi-pulse 단일 규칙 동작)

### P1
1. **문서 카드 시각 부재** — DocCard가 텍스트 장면 설명만 표시. 학습자가 장면 관계를 빠르게 파악하기 어려움. → 개념 일러스트 추가(텍스트 대체 유지).
2. **단계 진행 피드백 약함** — 현재 단계는 탭 색으로만 구분. → 진행 스트립(완료/현재/제안) 추가.
3. **시작 화면 몰입도** — 질문+버튼은 맞지만 탐구실 정체성 약함. → hero 일러스트·미션 요약 칩.
4. **MASTER.md 불일치** — UI UX Pro Max가 생성한 파란/오렌지 팔레트가 DESIGN.md와 충돌. → DESIGN.md 우선 정렬.

### P2
- EvidenceBoard 기호 입력을 글리프 버튼 선택으로 보강
- 카드 hover/focus 미세 피드백

## Strengths

- 엔진·UI 분리, 가설 이력, 모호함 보류 정당화가 잘 구현됨
- gi-pulse 단일 aura, reduced-motion 대체, pinlabel 3톤+텍스트
- 업데이트 내역·기록보내기 존재

## 수용 기준으로 이관

- P1 #1–#4을 구현 단계 수용 기준으로 사용



---

# Final Audit (post-implementation)

- 생성일: 2026-09-16
- 검수: impeccable (degraded single-context)

## P0/P1 Resolution

| Issue | Status | Evidence |
| --- | --- | --- |
| P1 문서 카드 시각 부재 | resolved | DocCard + scene SVG |
| P1 단계 진행 피드백 | resolved | PhaseNav 완료/현재/제안 |
| P1 시작 화면 몰입도 | resolved | welcome-grid + hero |
| P1 MASTER.md 불일치 | resolved | DESIGN.md 정렬 MASTER |

## Pending

- P2: EvidenceBoard 글리프 버튼 선택 (입력 방식 유지, 힌트 추가됨)
- Browser: 320/375/768/1280px 수동 확인 권장

## gi-pulse

- 시작하기: gi-pulse (미시작)
- PhaseNav 제안 단계: gi-pulse 1개만
- InvestigateView 확인: 기존 gi-pulse 유지 (다른 화면에서는 PhaseNav만)
