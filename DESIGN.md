---
name: 미지의 문자 해독 연구소
description: 밝은 실험 트레이 위에서 가상 언어의 규칙을 추론하는 교실 탐구 앱
colors:
  accent: "#c9340f"
  accent-ink: "#a32708"
  accent-wash: "#fdeee6"
  pin: "#0f766e"
  pin-wash: "#e3f2f0"
  amber: "#92580a"
  amber-wash: "#faf0d7"
  ground: "#f6f5f0"
  well: "#ffffff"
  ink: "#1d2530"
  ink-soft: "#3d4756"
  line: "#d9d6cb"
  line-strong: "#b9b4a4"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  md: "14px"
  sm: "10px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
  xxxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.well}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  button-default:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  chip:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  card:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "24px"
  input:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
---

# Design System: 미지의 문자 해독 연구소

## Overview

**Creative North Star: "The Specimen Tray"**

낮 교실 형광등 아래 흰 표본 트레이. 얇은 격벽으로 나뉜 웰마다 문서·단서·가설이 담기고, 한 번에 하나의 웰만 빛난다. 장식은 없고 기구가 있다: 종이 라벨, 계측 핀, 직교 리더선. 밝음은 분위기가 아니라 판독 조건이다.

밀도는 실험기구답게 절제되어 있다. 정보는 웰 안에 촘촘히, 웰 사이는 넉넉히. 타이포는 시스템 스택의 일꾼 서체로, 수치는 tabular mono로 흔들림 없이. 서프라이즈는 한 순간에만 허용된다: 다음 행동 하나를 감싸는 aura. 나머지는 정적이다.

**Key Characteristics:**
- 흰 매트 ground에 얇은 슬레이트 격벽, 단일 레드-오렌지 accent
- 직교 리더선 + 도트 노드가 기본 연결어
- 웰 안은 촘촘히, 웰 사이는 넉넉히 (4pt 스페이싱)
- 다음 행동 하나에만 aura, 나머지는 정적

## Colors

낮 교실의 흰 트레이 위에 잉크와 돌 뉴트럴, 액센트는 하나. Restrained 전략.

### Primary
- **Tray Vermilion** (#c9340f): 다음 행동·활성 경로 전용. 텍스트로 쓸 때는 더 진한 accent-ink(#a32708)를 쓴다.

### Neutral
- **Tray Paper** (#f6f5f0): 전체 ground.
- **Well White** (#ffffff): 웰·버튼·입력 배경.
- **Specimen Ink** (#1d2530): 본문. 대비 14.15:1.
- **Soft Ink** (#3d4756): 보조. 대비 8.61:1.
- **Partition** (#d9d6cb): 웰 격벽·칩 테두리.
- **Partition Strong** (#b9b4a4): 버튼·입력 테두리.

### Named Rules (optional, powerful)
**The Single Aura Rule.** 한 화면에 aura(.gi-pulse)는 정확히 하나. 두 번째 강조가 필요해지면 첫 번째를 끈다.
**The Wash Rule.** 색 배경 위 보조 텍스트는 그 색에서 틴트한다(회색 금지). 핀은 #0b5f59/wash, 앰버는 #92580a/wash.

## Typography

**Display Font:** 없음 (Operate 표면, display 운용 안 함)
**Body Font:** 시스템 스택 (-apple-system … Noto Sans KR, Segoe UI)
**Label/Mono Font:** ui-monospace 계열 (핀라벨·기호열·수치, tabular-nums)

**Character:** 일꾼 서체의 조용한 확신.제목은 굵기로만 계층을 만든다.

### Hierarchy
- **Headline** (700, 22px, 1.4): 웰 제목. 한 화면 한 개 원칙.
- **Title** (700, 17px, 1.4, -0.01em): 브랜드·요약 제목.
- **Body** (400, 16px, 1.6): 본문. 최대 68ch.
- **Label** (400, 12.5px mono): 핀라벨·기호열·계측.

### Named Rules (optional)
**The Weight-Not-Size Rule.** 강조는 굵기·크기로, 그라데이션 텍스트·키커·eyebrow 금지.

## Layout

최대 1180px 컨테이너, 7:5 2열(문서 흐름 : 연구 노트). 900px 이하 1열 적층(시각자료→조건→실행→결과 순). 4pt 스페이싱 스케일. 제목 위 여백이 아래보다 크다. 320px에서 가로 넘침 0(실측).

## Elevation & Depth

납작함이 기본, 깊이는 상태에만. 웰은 1px 격벽 보더로만(그림자 없음). 그림자는 뜨는 두 요소에만 허용: 다음-행동 버튼의 aura 글로우와 다이얼로그.

### Shadow Vocabulary (if applicable)
- **Next-action glow** (`0 0 0 4px #fdeee6, 0 8px 22px -8px rgba(201,52,15,0.55)`): .gi-pulse 전용.
- **Dialog lift** (`0 18px 50px -18px rgba(29,37,48,0.4)`): 확인·내역 다이얼로그 전용.

### Named Rules (optional)
**The Border-Or-Shadow Rule.** 1px 보더 아래 넓은 그림자(고스트 카드) 금지. 웰=보더, 부유=그림자, 둘 중 하나.

## Shapes

모서리는 차분한 라운드(웰 14px, 컨트롤 10px, 칩·상태만 pill). 하드 오프셋 그림자·네오브루탈 장식 금지. 기호는 기하 SVG 스트로크(1.8, round join) 단일 언어.

## Components

### Buttons
- **Shape:** 둥근 컨트롤 (10-12px 반경)
- **Primary:** Tray Vermilion 바닥에 흰 글자, 패딩 12px 20px, 최소 높이 48px
- **Hover / Focus:** hover는 ink 테두리, focus-visible은 3px accent 아웃라인 + 2px 오프셋
- **Secondary:** 흰 바닥 ink 글자 strong 테두리. 비활성은 투명도 0.45 + not-allowed.

### Chips
- **Style:** ground 바닥 soft-ink 글자 1px 테두리 pill, mono 12.5px
- **State:** pin(틸 wash)·amber(황 wash)·accent(주황 wash) 3톤. 색만으로 구분 금지, 항상 텍스트 병기.

### Cards / Containers
- **Corner Style:** 14px
- **Background:** Well White on Tray Paper
- **Shadow Strategy:** 없음 (Elevation 참조, 부유 2종 제외)
- **Border:** 1px Partition, 선택 시 accent
- **Internal Padding:** 16-24px

### Inputs / Fields
- **Style:** 흰 바닥 strong 스트로크 10px, 최소 높이 44px, caret accent
- **Focus:** 3px accent 아웃라인
- **Error / Disabled:** 에러는 메시지+복구 경로 병기, disabled는 감광+커서

### Navigation
- 단계 탭: pill 버튼열. 현재 단계는 ink 반전, 제안 단계(다음 행동)는 accent aura. 미션 선택은 상단 텍스트 버튼 aria-pressed.

### Glyph Button
- 44px 최소 터치, SVG 스트로크 아이콘, 선택 시 accent 테두리+wash. 의미 라벨 노출 금지(aria는 순서만).

## Do's and Don'ts

### Do:
- **Do** 다음 행동 하나에만 aura를 준다 (The Single Aura Rule).
- **Do** 기호 연결은 직교 리더선·도트 노트로 그린다.
- **Do** 증거 수준·비용을 핀라벨(텍스트+색)으로 항상 병기한다.
- **Do** 모호함을 빈 웰·보류 상태로 남긴다 (억지 단일 정답 금지).
- **Do** reduced-motion에서는 aura를 정적 테두리로 대체한다.

### Don't:
- **Don't** 키커·eyebrow를제목 위에 달지 않는다.
- **Don't** 그라데이션 텍스트·장식 블러·2px 이상 좌우 보더를 쓰지 않는다.
- **Don't** 같은 계층에 카드 안에 카드를 넣지 않는다 (웰 중첩 금지).
- **Don't** 글리프에 의미 라벨·이모지를 쓰지 않는다.
- **Don't** 방향 계약을 소스·번들·메타에 복사하지 않는다.
