# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** unknown-script-lab (미지의 문자 해독 연구소)
**Aligned from:** DESIGN.md (Specimen Tray) + UI UX Pro Max search (2026-09-16)
**Category:** Education / Operate mode classroom inquiry app

---

## Creative North Star: The Specimen Tray

밝은 교실 형광등 아래 흰 표본 트레이. 얇은 격벽으로 나뉜 웰마다 문서·단서·가설이 담기고, 한 번에 하나의 웰만 빛난다. 장식은 없고 기구가 있다.

## Global Color Tokens

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Ground (Tray Paper) | `#f6f5f0` | `--ground` |
| Well White | `#ffffff` | `--well` |
| Specimen Ink | `#1d2530` | `--ink` |
| Soft Ink | `#3d4756` | `--ink-soft` |
| Partition | `#d9d6cb` | `--line` |
| Partition Strong | `#b9b4a4` | `--line-strong` |
| Tray Vermilion (CTA) | `#c9340f` | `--accent` |
| Accent Ink | `#a32708` | `--accent-ink` |
| Accent Wash | `#fdeee6` | `--accent-wash` |
| Pin Teal | `#0f766e` | `--pin` |
| Pin Wash | `#e3f2f0` | `--pin-wash` |
| Amber | `#92580a` | `--amber` |
| Amber Wash | `#faf0d7` | `--amber-wash` |

**Note:** UI UX Pro Max initially suggested blue/orange palette; superseded by DESIGN.md binding constraints.

## Typography

- **Headline:** system stack, 700, 22px, 1.4, -0.02em
- **Title:** system stack, 700, 17px, 1.4, -0.01em
- **Body:** system stack, 400, 16px, 1.6, max 68ch
- **Label/Mono:** ui-monospace, 12.5px, tabular-nums

## Spacing (4pt scale)

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-12` | 48px |

## Layout

- Max container: 1180px
- Desktop: 7:5 two-column (main flow : research note)
- ≤900px: single column stack (visual → condition → action → result)
- Verify: 320, 375, 768, 1280px — no horizontal scroll

## Elevation Rules

- Wells: 1px border only, no shadow
- Allowed shadows: gi-pulse glow, dialog lift
- **Single Aura Rule:** exactly one .gi-pulse per screen

## Component Rules

### Buttons
- Primary: accent fill, white text, min-height 48px, radius 10–12px
- Secondary: white fill, ink text, strong border
- Disabled: opacity 0.45

### Pin Labels
- Always text + color (never color alone)
- Tones: pin, amber, accent

### Cards / Wells
- 14px radius, 16–24px padding
- Selected: accent border

## Do / Don't

- **Do** preserve ambiguity as valid answers
- **Do** show update history button
- **Do** use gi-pulse on one next-action only
- **Don't** add dark mode
- **Don't** expose glyph meaning labels on glyphs
- **Don't** add TTS/voice
