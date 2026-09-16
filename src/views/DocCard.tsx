import { GLYPHS } from '../engine/glyphs';
import type { MissionDocument } from '../engine/missions';
import { meaningToScene } from './scene';
import { sceneImageForDoc } from './sceneAssets';
import { Glyph } from './Glyph';

interface Props {
  doc: MissionDocument;
  selected?: boolean;
  onToggle?: (id: string) => void;
  revealed?: boolean;
}

const glyphById = new Map(GLYPHS.map((g) => [g.id, g]));

/** 문서 웰: 장면 일러스트 + 구조화된 설명 + 정확한 기호 + 핀 라벨. */
export function DocCard({ doc, selected, onToggle, revealed = true }: Props) {
  const scene = meaningToScene(doc.meaning);
  const art = sceneImageForDoc(doc.imageId, doc.meaning);

  return (
    <article
      className={['doc-card', 'well', selected ? 'doc-card--selected' : ''].filter(Boolean).join(' ')}
      aria-label={`문서 ${doc.id}`}
    >
      <figure className="doc-card__figure">
        <img
          className={['scene-thumb', art.ratio === '4 / 3' ? 'scene-thumb--action' : 'scene-thumb--hero'].join(' ')}
          src={art.src}
          alt={art.alt}
          width={280}
          height={art.ratio === '4 / 3' ? 210 : 158}
          loading="lazy"
        />
        <figcaption className="doc-card__caption">행동 관계 보조 그림 · 아래 설명이 기준입니다.</figcaption>
      </figure>
      <p className="doc-card__scene">{scene}</p>
      {revealed ? (
        <div className="doc-card__glyphs" aria-label={`기호열 ${doc.tokens.join(' ')}`}>
          {doc.tokens.map((t, i) => {
            const g = glyphById.get(t);
            return g ? <Glyph key={`${t}-${i}`} glyph={g} label={`${g.accessibleName} (문서 ${doc.id})`} /> : null;
          })}
        </div>
      ) : (
        <p className="doc-card__hidden">비용을 쓰고 열면 기호가 공개됩니다.</p>
      )}
      <div className="doc-card__meta">
        <span className="pinlabel" data-tone="pin">증거 Lv.{doc.evidenceLevel}</span>
        <span className="pinlabel" data-tone={doc.unlockCost === 0 ? 'pin' : 'amber'}>
          비용 {doc.unlockCost}
        </span>
        <span className="pinlabel">{doc.id}</span>
      </div>
      {onToggle && (
        <div className="cta-row">
          <button type="button" onClick={() => onToggle(doc.id)} aria-pressed={selected}>
            {selected ? '선택 해제' : '비교에 담기'}
          </button>
        </div>
      )}
    </article>
  );
}
