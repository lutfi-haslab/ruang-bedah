import AnatomyModel3D from './AnatomyModel3D'
import type { AnatomyModelConfig } from './AnatomyModel3D'

/* EcgModel3D — the Reading an ECG lesson's 3D explorer, as a config of
 * the shared AnatomyModel3D viewer. It reuses the Heart lesson's mesh
 * (heart.glb — "Realistic Human Heart" by neshallads, CC BY 4.0), but
 * labels the chambers by the wave each one writes on the ECG: the atria
 * make the P wave, the ventricles make the QRS, and the SA node — where
 * the superior vena cava meets the right atrium — starts the beat. The
 * wiring itself (AV node, bundle of His, Purkinje network) runs inside
 * the septum and the atrial wall, so it is not visible on this external
 * mesh; the caption says so, and the Conduction System lesson traces it. */

const ECG_CONFIG: AnatomyModelConfig = {
  modelUrl: '/assets/models/heart.glb',
  labels: [
    { name: 'SA node · starts the beat', pos: [-0.52, 0.48, 0.28] },
    { name: 'Right atrium · P wave', pos: [-0.55, 0.02, 0.2] },
    { name: 'Left atrium · P wave', pos: [0.28, 0.52, -0.34] },
    { name: 'Right ventricle · QRS', pos: [-0.05, -0.2, 0.52] },
    { name: 'Left ventricle · QRS', pos: [0.38, -0.44, 0.2] },
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
    'The same heart as the Heart lesson — now labelled by what each wave of the ECG records: the atria write the P wave, the ventricles write the QRS, and their resetting writes the T wave. The SA node sits where the superior vena cava meets the right atrium. The wiring itself — AV node, bundle of His, Purkinje network — runs inside the septum and the atrial wall, so it is not visible on this external mesh; the Conduction System lesson traces it step by step.',
  credit:
    '3D model: “Realistic Human Heart” by neshallads · CC BY 4.0 · via Wikimedia Commons · smoothed & optimised for the web (same mesh as the Heart lesson)',
  home: [2.15, 0.85, 3.35],
  initialRotY: 0.55,
}

export default function EcgModel3D({ bare = false }: { bare?: boolean }) {
  return <AnatomyModel3D config={ECG_CONFIG} bare={bare} />
}
