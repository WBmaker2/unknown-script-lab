# 구현 계획 (배포 직전까지)

- 상태: 설계 완료(PRODUCT.md, brief `index`), 코드 신규. P0만, P1 제외.
- 스택: Vite + React + TS, hand CSS (Tailwind/shadcn 제외). 이유: P0 범위·100ms 입력 반응·파일 500줄 제한·서브경로 정적 배포에 최소 의존이 유리. ui-styling 토큰·반응형·접근성 원칙은 CSS 변수로 계승.
- 구조: `src/engine/` (grammar, glyphs, encoder, parser, hypothesisValidator, missions, store), `src/views/` (Glyph + 5화면), `tests/`, `docs/` (단계 로그).
- 마일스톤: M1 의미·문법·검증예문 → M2 후보판정 → M3 텍스트 학습흐름 → M4 이미지대체 검수·삽입 → M5 모호함·a11y·반응형·성능 → 배포점검(빌드·하위경로·DESIGN.md·finish review).
- 원칙: 엔진 순수함수(DOM 의존 금지), 500줄/파일, localStorage 비식별+JSON 내보내기, 색외단서, 단일 gi-pulse, reduced-motion 정적 대체.
