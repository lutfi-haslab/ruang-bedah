import AnatomyModel3D from './AnatomyModel3D'
import type { AnatomyModelConfig } from './AnatomyModel3D'

/* LiverModel3D — the Liver and Gallbladder lesson's 3D explorer. Model: a
 * real liver from the Visible Human Project (male), CC BY 4.0 via Wikimedia
 * Commons; Taubin-smoothed, re-welded, centred and normalised.
 * Orientation verified visually before labelling: +Z is anterior (the smooth
 * diaphragmatic surface with the falciform ligament), anatomical right is
 * −X (the big lobe), anatomical left is +X (the tapering point). The
 * gallbladder itself is not part of this mesh — it sits in the fossa on the
 * visceral surface, which the explorer labels; rotate underneath to find it.
 * Motion is 'breathe': in the body the liver rides up and down with the
 * diaphragm, a few centimetres with every breath. */

const LIVER_CONFIG: AnatomyModelConfig = {
  modelUrl: '/assets/models/liver.glb',
  labels: [
    { name: 'Right lobe · most of the liver', pos: [-0.72, 0.5, 0.41] },
    { name: 'Left lobe · tapering point', pos: [0.94, 0.45, 0.61] },
    { name: 'Falciform ligament', pos: [0.12, 0.42, 0.8] },
    { name: 'Gallbladder fossa', pos: [-0.51, -0.36, 0.04] },
    { name: 'Porta hepatis', pos: [-0.18, -0.35, -0.28] },
    { name: 'Bare area', pos: [-0.58, 0.27, -0.9] },
  ],
  color: 0xa85f46,
  roughness: 0.5,
  clearcoat: 0.3,
  envIntensity: 0.85,
  keyIntensity: 1.4,
  mode: 'breathe',
  motionLabel: 'Breathing',
  kicker: '3D EXPLORER · THREE.JS · DRAG TO ROTATE',
  caption:
    'The same liver as the lab — a real one, from a human body scan: the big right lobe and the tapering left one, split by the falciform ligament, with the gallbladder’s fossa and the porta hepatis underneath. Turn it over to find them. The liver itself rides up and down with the diaphragm, a few centimetres with every breath.',
  credit:
    '3D model: Visible Human Project (male) · CC BY 4.0 · via Wikimedia Commons · cleaned, smoothed & optimised for the web',
  home: [1.6, 0.9, 3.4],
  initialRotY: 0.35,
}

export default function LiverModel3D({ bare = false }: { bare?: boolean }) {
  return <AnatomyModel3D config={LIVER_CONFIG} bare={bare} />
}
