import AnatomyModel3D from './AnatomyModel3D'
import type { AnatomyModelConfig } from './AnatomyModel3D'

/* HeartModel3D — the Heart lesson's 3D explorer, as a config of the
 * shared AnatomyModel3D viewer. Model: real anatomical heart mesh,
 * CC BY 4.0 (see credit), smoothed + subdivided for the web. */

const HEART_CONFIG: AnatomyModelConfig = {
  modelUrl: '/assets/models/heart.glb',
  labels: [
    { name: 'Aorta', pos: [0.08, 0.84, 0.08] },
    { name: 'Pulmonary artery', pos: [0.3, 0.42, 0.42] },
    { name: 'Superior vena cava', pos: [-0.47, 0.74, 0.16] },
    { name: 'Right atrium', pos: [-0.55, 0.02, 0.2] },
    { name: 'Right ventricle', pos: [-0.05, -0.2, 0.52] },
    { name: 'Left atrium', pos: [0.28, 0.52, -0.34] },
    { name: 'Left ventricle', pos: [0.38, -0.44, 0.2] },
    { name: 'Apex', pos: [0.03, -0.95, 0.14] },
  ],
  color: 0x9e2b25,
  roughness: 0.34,
  clearcoat: 0.65,
  envIntensity: 0.5,
  keyIntensity: 2.4,
  mode: 'beat',
  motionLabel: 'Heartbeat',
  kicker: '3D EXPLORER · THREE.JS · DRAG TO ROTATE',
  caption:
    'The same heart as the 2D diagram — now as a real anatomical mesh you can hold: turn it over, find the arch of the aorta, and watch it beat. Labels fade as their structure turns away.',
  credit:
    '3D model: “Realistic Human Heart” by neshallads · CC BY 4.0 · via Wikimedia Commons · smoothed & optimised for the web',
  home: [2.15, 0.85, 3.35],
  initialRotY: 0.55,
}

export default function HeartModel3D({ bare = false }: { bare?: boolean }) {
  return <AnatomyModel3D config={HEART_CONFIG} bare={bare} />
}
