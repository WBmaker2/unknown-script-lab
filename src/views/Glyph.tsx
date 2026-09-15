import type { GlyphDef } from '../engine/glyphs';

interface Props {
  glyph: GlyphDef;
  selected?: boolean;
  onSelect?: (id: string) => void;
  label?: string;
}

/** 정확한 기호를 그리는 SVG 버튼. 의미 라벨을 노출하지 않는다. */
export function Glyph({ glyph, selected, onSelect, label }: Props) {
  return (
    <button
      type="button"
      className="glyphbtn"
      aria-label={label ?? glyph.accessibleName}
      aria-pressed={selected ?? undefined}
      onClick={() => onSelect?.(glyph.id)}
      style={selected ? { borderColor: 'var(--accent)', background: 'var(--accent-wash)' } : undefined}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={glyph.svgPath} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
      </svg>
    </button>
  );
}
