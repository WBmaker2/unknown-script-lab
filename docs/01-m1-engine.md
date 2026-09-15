# M1 — 의미·문법·검증예문

- 결과: `src/engine/grammar.ts` (어휘 12·문법 27후보·검증예문 10), `glyphs.ts` (SVG 12·의미라벨 비노출), `encoder.ts` (순수 인코더+검증), `parser.ts` (재인코딩 일치 판정), `tests/encoder.roundtrip.test.ts` 7개 통과, `tsc --noEmit` 통과.
- 결정: parser를 별도 파일로 분리(모듈 목록의 hypothesisValidator는 M2에서 래핑). 수량·복수 삽입 순서를 결정적으로 고정(수량→복수, afterObject는 O·PL·C 순).
- 검증: parse(encode(m))==m 10예문, 대비쌍 1기호차 2건, 복수표지 유무·길이(4/5), 범위밖·NaN·무한대·미등록 대응 차단, 훼손 토큰 null, 후보 27개 확인.
- 다음: M2 후보판정·미션 구분가능성.
