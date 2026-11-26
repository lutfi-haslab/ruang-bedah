import AnatomyModel3D from './AnatomyModel3D'
import type { AnatomyModelConfig } from './AnatomyModel3D'

/* GasExchangeModel3D — the Breathing and Gas Exchange lesson's 3D
 * explorer, as a config of the shared AnatomyModel3D viewer. It reuses
 * the Lungs lesson's mesh (lungs.glb — Visible Human, female, CC BY 4.0),
 * but labels the lungs by what happens inside them: the exchange. The
 * alveoli themselves are about 0.2 mm across — far too small to see on
 * this mesh — so the caption says so, and the 2D lab zooms into a single
 * alveolus instead. Anchor positions are the Lungs lesson's verified
 * on-surface points; anatomical right sits at model −X (three lobes). */

const GAS_EXCHANGE_CONFIG: AnatomyModelConfig = {
  modelUrl: '/assets/models/lungs.glb',
  labels: [
    { name: 'Alveoli · 300 million sacs', pos: [-0.66, 0.3, 0.48] },
    { name: 'Capillary mesh · one cell from the air', pos: [0.66, 0.3, 0.48] },
    { name: 'Apex', pos: [0.55, 0.8, 0.08] },
    { name: 'Oblique fissure', pos: [0.78, -0.26, 0.47] },
    { name: 'Base — on the diaphragm', pos: [0.52, -0.7, 0.2] },
    { name: 'Hilum · blood enters & leaves', pos: [-0.16, 0.02, -0.08] },
  ],
  color: 0xb06a5e,
  roughness: 0.52,
  clearcoat: 0.25,
  envIntensity: 0.85,
  keyIntensity: 1.3,
  mode: 'breathe',
  motionLabel: 'Breathing',
  kicker: '3D EXPLORER · THREE.JS · DRAG TO ROTATE',
  caption:
    'The same lungs as the Lungs lesson — now read as the place where gas exchange happens. Every breath ends inside this tissue: about 300 million alveoli, each roughly 0.2 mm across and wrapped in a capillary net, add up to around 70 m² of exchange surface. The alveoli themselves are far too small to see on this mesh — the 2D lab zooms into a single one — but this is the organ that holds them, and the hilum is where the blood arrives low in oxygen and leaves loaded with it.',
  credit:
    '3D model: Visible Human Project (female) · CC BY 4.0 · via Wikimedia Commons · cleaned, smoothed & optimised for the web (same mesh as the Lungs lesson)',
  home: [1.8, 0.65, 3.2],
  initialRotY: 0.35,
}

export default function GasExchangeModel3D({ bare = false }: { bare?: boolean }) {
  return <AnatomyModel3D config={GAS_EXCHANGE_CONFIG} bare={bare} />
}
