# M2 — 후보판정·미션 구분가능성

- 결과: `hypothesisValidator.ts`에 결합 가설 집합 H(어휘 9 × 문법 3 = 27, 전수 아님) 추가. `filterHypotheses` (증거 일치 후보만 유지), `distinguishingScore` (구분 수+한줄 설명, 엔트로피 없음), `checkLexiconLink` (지지/반박/근거요청), `isHoldJustified` (2개 이상 잔류 시 보류 정당), `validateHypothesisRecord` (이력 형태 검사).
- 설계 수정: 초안의 문법전용 H(어휘 기지)로는 2후보 경유가 도달 불가임을 테스트로 확인 → spec §5 원문대로 어휘×문법 결합 H로 변경. 문법전용 `filterGrammars`·27문법 목록은 분석용으로 유지.
- 미션: `missions.ts` 문서풀 12장 + 결정적 탐색으로 3종 구성. 검수(초기 2→추가 1장으로 1), 수량(복수 표지), 모호함(끝까지 2+ 잔류, 보류가 정답). `tests/missions.test.ts` 6개 + M1 7개 = 13 통과, `tsc` 통과.
- 다음: M3 텍스트 학습흐름 UI.
