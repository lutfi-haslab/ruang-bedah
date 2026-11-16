import AnatomyModel3D from './AnatomyModel3D'
import type { AnatomyModelConfig } from './AnatomyModel3D'

/* LungsModel3D — the Lungs lesson's 3D explorer. Model: a real lung pair
 * from the Visible Human Project (female), CC BY 4.0 via Wikimedia Commons;
 * cleaned (small fragments dropped), decimated, Taubin-smoothed, re-welded.
 * Anatomical right sits at model −X (three lobes); left at +X (cardiac notch). */

const LUNGS_CONFIG: AnatomyModelConfig = {
  modelUrl: '/assets/models/lungs.glb',
  labels: [
    { name: 'Right lung · 3 lobes', pos: [-0.66, 0.3, 0.48] },
    { name: 'Left lung · 2 lobes', pos: [0.66, 0.3, 0.48] },
    { name: 'Apex', pos: [0.55, 0.8, 0.08] },
    { name: 'Oblique fissure', pos: [0.78, -0.26, 0.47] },
    { name: 'Base — on the diaphragm', pos: [0.52, -0.7, 0.2] },
    { name: 'Hilum', pos: [-0.16, 0.02, -0.08] },
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
    'The same lungs as the breathing lab — a real pair from a human body scan: turn them over and find the fissures that split them into lobes (three on the right, two on the left), the notch where the heart sits, and the concave bases that rest on the diaphragm. Then watch them breathe.',
  credit:
    '3D model: Visible Human Project (female) · CC BY 4.0 · via Wikimedia Commons · cleaned, smoothed & optimised for the web',
  home: [1.8, 0.65, 3.2],
  initialRotY: 0.35,
}

export default function LungsModel3D({ bare = false }: { bare?: boolean }) {
  return <AnatomyModel3D config={LUNGS_CONFIG} bare={bare} />
}
