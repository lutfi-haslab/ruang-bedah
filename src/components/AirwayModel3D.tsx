import AnatomyModel3D from './AnatomyModel3D'
import type { AnatomyModelConfig } from './AnatomyModel3D'

/* AirwayModel3D — the Airway lesson's 3D explorer. Model: a real human
 * trachea with the larynx from the Visible Human Project (male), PUBLIC
 * DOMAIN via Wikimedia Commons; cleaned, rotated upright (the scan leans
 * ~21°), smooth normals. Front (+Z) is anterior: the C-rings wrap the
 * front, the flat membranous wall faces back. No openly licensed model of
 * the full trachea + bronchial tree exists on Commons — the VH bronchi
 * files are fragmented ring pieces — so the explorer shows the trachea
 * itself, ending right at the carina. */

const AIRWAY_CONFIG: AnatomyModelConfig = {
  modelUrl: '/assets/models/airway.glb',
  labels: [
    { name: 'Larynx', pos: [0, 0.77, 0.17] },
    { name: 'Trachea', pos: [0.06, 0.36, 0.21] },
    { name: 'Tracheal rings', pos: [-0.04, -0.39, 0.14] },
    { name: 'Membranous back wall', pos: [0, -0.04, -0.18] },
    { name: 'Carina — the split into the bronchi', pos: [0, -1.06, 0.06] },
  ],
  color: 0xc9a189,
  roughness: 0.5,
  clearcoat: 0.25,
  envIntensity: 0.85,
  keyIntensity: 1.3,
  mode: 'breathe',
  motionLabel: 'Breathing',
  kicker: '3D EXPLORER · THREE.JS · DRAG TO ROTATE',
  caption:
    'The same airway as the 2D lab — a real human trachea from a body scan: the larynx (voice box) on top and the windpipe below it, held open by C-shaped rings of cartilage you can see wrapping around the front. Turn it around and the back wall is flat and soft — that is where the food pipe runs behind it. The model ends right at the carina, the ridge where the trachea splits into the two main bronchi; the 2D lab follows the air from there to the alveoli.',
  credit:
    '3D model: Visible Human Project (male) · Public domain · via Wikimedia Commons · cleaned, straightened & optimised for the web',
  home: [1.6, 0.5, 3.7],
  initialRotY: 0.4,
}

export default function AirwayModel3D({ bare = false }: { bare?: boolean }) {
  return <AnatomyModel3D config={AIRWAY_CONFIG} bare={bare} />
}
