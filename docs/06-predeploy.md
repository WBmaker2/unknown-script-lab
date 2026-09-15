# 배포 직전 점검 (pre-deploy)

- 일시: 2026-09-15. 상태: 16테스트·tsc·vite build 전부 통과, dist 산출.
- 빌드: `npm run build` → dist/(index.html 0.56KB, CSS 4.6KB, JS 248KB/gzip 79KB). `base: './'` 상대경로 — 하위 경로(HVC 포함) 배포 대응.
- 배포 전 사용자가 할 일: 정적 호스팅에 dist 업로드 → 공개 URL에서 자산 경로·5화면·저장/내보내기 직접 확인 → 보고서에 클릭 링크 기재(HVC 등록·갤러리 동기화는 별도 범위).
- 잔여(배포 승인 후 확인): 실기기 입력 지연 측정(목표 100ms, 측정 아님), 대상 기기 초기표시·메모리 기록, 생성 장면 이미지(MVP 이후 별도), 교과 오개념 검토(테스트 통과≠수업 효과).
- 산출물: PRODUCT.md, DESIGN.md + .impeccable/design.json, surface brief(index), docs/00~06, tests 16, dist(배포물, 커밋 대상 아님).
- 리뷰 verdict: ship(배포 직전). 근거 — 방향계약 6블록 이행(단일aura·핀라벨·직교연결·모호함 보존), craft-floor 금지 0위반(detect 0건), 완성기준 04§9 충족(2→1 검수미션·보류정당·이력보존·예산/취소 무손실·parse(encode)==m 전수·키보드/320px/reduced-motion/대체설명 검증). 단, ‘이미지 24장 전수대조’는 P0 해당없음(생성 이미지 미출하, 출하 시 M4 절차로 수행).
