# Education Web App Redesign — Plan

- 생성일: 2026-09-16
- 모드: full
- 프로젝트: unknown-script-lab (미지의 문자 해독 연구소)
- 스택: Vite 7 + React 19 + TypeScript + Vitest

## 목표

기존 P0 학습 흐름(보관함 → 비교 → 가설 → 추가 조사 → 시험)을 유지하면서, DESIGN.md의 Specimen Tray 디자인 언어를 실제 UI에 더 일관되게 적용하고, 문서 카드에 맥락 일러스트를 추가해 학습자가 장면을 빠르게 파악하도록 개선한다.

## 참조 문서

| 문서 | 경로 | 상태 |
| --- | --- | --- |
| PRODUCT.md | ./PRODUCT.md | 존재 |
| DESIGN.md | ./DESIGN.md | 존재 (최우선 시각 기준) |
| EDUCATION_DESIGN.md | 없음 | 없음으로 기록 |
| AGENTS.md (프로젝트) | 없음 | 없음으로 기록 |
| design-system MASTER | design-system/unknown-script-lab/MASTER.md | 생성됨, DESIGN.md와 정렬 필요 |

## 변경하지 않을 범위

- engine/ 의 encoder, parser, hypothesisValidator, missions 로직
- 미션 3개 구성과 판정 규칙
- VoiceOver/TTS/음성 기능 (명시적 제외)
- HVC 등록 (이번 요청의 릴리스 범위에서는 제외)

## 핵심 화면·학습자 흐름

1. 시작 화면: 질문 1개 + 시작 버튼 1개 (gi-pulse)
2. 보관함: 초기 문서 카드
3. 비교: 2장 선택 → 같은/다른 기호 → 근거 연결
4. 가설: 연결 이력·보류 상태
5. 추가 조사: 예산·후보 구분력
6. 시험: 미공개 문서 번역·모름 체크

## 파일 후보

- src/App.tsx — 시작 화면, 단계 탭, 레이아웃
- src/app.css — Specimen Tray 토큰·컴포넌트
- src/views/DocCard.tsx — 장면 일러스트·카드 구조
- src/views/EvidenceBoard.tsx — 비교 패널 시각화
- src/views/InvestigateView.tsx — 조사 카드
- src/views/TrialView.tsx — 시험 폼
- src/views/UpdateHistory.tsx — 업데이트 내역
- design-system/unknown-script-lab/MASTER.md — DESIGN.md 정렬
- public/assets/scenes/* — 개념 일러스트 (신규)

## 자산 판정

| 자산 | 판정 | 이유 |
| --- | --- | --- |
| 시작 화면 hero | 생성 후보 | 가상 탐구실 분위기, 사실 주장 없음 |
| 문서 장면 일러스트 3종 | 생성 후보 | actor/action/object/count 변형, 문자·수치 없음 |
| SVG 글리프 | 유지 | 정확한 기호는 앱 SVG로 렌더 (자동 교체 금지) |

## 수용 기준 (P0/P1)

- P0: DESIGN.md 색·타이포·gi-pulse 단일 aura 규칙 유지
- P0: 다음 행동 1개만 gi-pulse
- P0: 업데이트 내역 버튼 유지·갱신
- P1: 문서 카드에 장면 일러스트 + 텍스트 대체 설명 병행
- P1: 단계 진행 표시(현재 단계·제안 단계)
- P1: 320px 가로 넘침 없음 (브라우저 검증)

## 테스트·검증

- npm test
- npm run check
- npm run build
- 브라우저: 320/375/768/1280px, 키보드 Tab, reduced-motion

## 롤백

- git restore로 변경 파일 복구
- public/assets/scenes 원본 없음(신규) → 삭제만으로 롤백
