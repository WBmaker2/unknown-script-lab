---
version: 1
slug: "index"
primary_target: "index"
related_targets: []
---

# Surface brief: index (Unknown Script Lab)

Scope: P0 단일 앱 첫 서피스 — 문서 보관함 → 단서 비교 → 가설 노트 → 추가 조사 → 새 문서 시험.
Mode: Operate (방문자는 25분 안에 추론 과업을 완수한다).

Audience/job: 중·고 국어·수학·정보 학생이 교실 25분 흐름으로 직접 조작, 교사는 15~30분+5분 정리로 운영.
Action: 공통 기호 찾기 → 가설 3개 연결 → 구분력 높은 문서 선택 → 반례 반영 수정 → 미공개 문서 해석+모호함 설명.
Proof/content: 구조화된 장면 의미(actor/action/object/count), SVG 글리프 12개, 미션 3개(초기/선택/홀드아웃), 가설 이력.
Constraints: 밝은 한국어 UI, 첫화면 1질문+1시작버튼, gi-pulse 단일강조(+reduced-motion 정적테두리), 색외단서, 320·360·768·1280, 드래그 대체조작, WebGL 대체, PII 저장금지, Three.js P0 제외.

## Direction contract

THESIS: 가상언어 추론을 '표본 트레이 위 증거 실험'으로 소유한다. 범주식 LMS 카드 대시보드와 다크 네온 게임화 랩이라는 뻔한 양극단을 거부하고, 한 번에 하나의 웰만 빛나는 밝은 실험기구 질서로 5단계를 잇는다.
OWN-WORLD: 흰 매트 트레이 ground, 얇은 슬레이트 격벽, 종이 라벨+계측 핀; 단일 레드-오렌지 accent만 상태·다음행동에 사용, 나머지는 잉크·스톤 뉴트럴. 시스템 스택 본문+수치용 tabular mono, 4pt 스페이싱, 2px 포커스링, 직교 리더선+도트 노드가 기본 연결어.
STORY: 방문자는 보관함에서 문서를 집어 비교 웰에 올리고, 가설 노트에 근거를 핀으로 꽂고, 추가조사에서 비용을 보고 한 장을 열고, 시험에서 해석+모호함을 기록한다. 모호함은 빈 웰로 남는다.
FIRST VIEWPORT: 상단 미션 스트립(관찰→가설→시험→수정→전이 상태칩), 좌 문서 웰 그리드(썸네일+정확 기호열+핀라벨), 우 비교·노트 2열(데스크톱 병렬, 모바일 적층), 하단 단일 gi-pulse CTA(시작하기→추가조사/새문서시험으로 상태 전이). 주행동 외 강조 없음.
FORM: grounded 7후보 중 3순위 '과학 실험 트레이+표본 라벨' (seed 344242a8). 7후보: 카드함/코르크보드/트레이/원고지첨삭/모눈작도/칠판자석/수집앨범.
RAISE(kraftwerk-직교): 기호-뜻 연결은 전부 직각 리더선으로, 활성 경로만 단일 accent 발광.
RAISE(tensegrity-핀라벨): evidenceLevel·unlockCost를 노드 고정 계측라벨로 노출.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
SEED: 344242a8 (operate/direction, assigned index 3)

Memorable moment: 반례 문서가 올라오면 해당 가설 핀이 흔들림 없이 '보류 웰'로 이동하고 이력이 남는다.
Unresolved: 스택 상세(Vite+React+TS+Tailwind 후보, 위임됨), P1(부정·다른어순) 제외, 이미지 24장 검수는 M4에서 대체설명 우선.
