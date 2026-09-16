# Education Web App Redesign — Assets

- 생성일: 2026-09-16
- Asset Designer: built-in image_gen (imagegen skill, CLI fallback 미사용)

| 원본 | 새 파일 | 화면·역할 | 판정 | 이유 | alt | 상태 |
| --- | --- | --- | --- | --- | --- | --- |
| public/assets/scenes/hero-lab-v3.png | public/assets/scenes/hero-lab-v4.png | 시작 화면 hero | 생성 후보 | 탐구실 분위기 보조, 16:9 PNG 배치 | 밝은 교실 탐구대 위 빈 색 카드와 돋보기가 놓인 가상 장면 | 코드 참조 갱신 |
| public/assets/scenes/scene-give-v3.png | public/assets/scenes/scene-give-v4.png | DocCard V1 | 생성 후보 | 건네주기 동작 구분, 4:3 PNG 배치 | 한 사람이 다른 사람에게 물건을 건네는 가상 장면 일러스트 | 코드 참조 갱신 |
| public/assets/scenes/scene-receive-v3.png | public/assets/scenes/scene-receive-v4.png | DocCard V0 | 생성 후보 | 받기 동작 구분, 4:3 PNG 배치 | 한 사람이 다른 사람에게서 물건을 받는 가상 장면 일러스트 | 코드 참조 갱신 |
| public/assets/scenes/scene-carry-v3.png | public/assets/scenes/scene-carry-v4.png | DocCard V2 | 생성 후보 | 나르기 동작 구분, 4:3 PNG 배치 | 한 사람이 물건을 옮기는 가상 장면 일러스트 | 코드 참조 갱신 |
| src/engine/glyphs.ts SVG | 유지 | 정확한 기호 | 자동 교체 금지 | 사실·정체성 자산 | 기호 N | 확인 완료 |

## imagegen 메모

- 모드: built-in image_gen
- hero-lab-v3 1차본은 지구본(지도 형태)이 있어 폐기하고 재생성본으로 교체
- SVG v2와 image_gen 원본 v3는 보존 (덮어쓰지 않음)
- v4는 화면 표시 크기에 맞춘 PNG 파생본이며, hero 960×540·문서 장면 720×540
- 롤백: sceneAssets.ts 경로를 *-v3.png 또는 *-v2.svg로 되돌림
