import type { Meaning } from '../engine/grammar';

export interface SceneAsset {
  src: string;
  alt: string;
  ratio: '16 / 9' | '4 / 3';
}

/** 가상 장면 개념 일러스트 (문자·수치 없음). action 유형별 PNG 매핑. */
export const SCENE_IMAGES: Record<string, SceneAsset> = {
  'scene-hero': {
    src: './assets/scenes/hero-lab-v4.png',
    alt: '밝은 교실 탐구대 위 빈 색 카드와 돋보기가 놓인 가상 장면',
    ratio: '16 / 9',
  },
  'scene-give': {
    src: './assets/scenes/scene-give-v4.png',
    alt: '한 사람이 다른 사람에게 물건을 건네는 가상 장면 일러스트',
    ratio: '4 / 3',
  },
  'scene-receive': {
    src: './assets/scenes/scene-receive-v4.png',
    alt: '한 사람이 다른 사람에게서 물건을 받는 가상 장면 일러스트',
    ratio: '4 / 3',
  },
  'scene-carry': {
    src: './assets/scenes/scene-carry-v4.png',
    alt: '한 사람이 물건을 옮기는 가상 장면 일러스트',
    ratio: '4 / 3',
  },
};

export function sceneImageForMeaning(m: Meaning): SceneAsset {
  if (m.action === 'V1') return SCENE_IMAGES['scene-give'];
  if (m.action === 'V0') return SCENE_IMAGES['scene-receive'];
  return SCENE_IMAGES['scene-carry'];
}

export function sceneImageForDoc(imageId: string, meaning: Meaning): SceneAsset {
  if (imageId === 'scene-hero') return SCENE_IMAGES['scene-hero'];
  return sceneImageForMeaning(meaning);
}
