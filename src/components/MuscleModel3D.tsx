import AnatomyModel3D from './AnatomyModel3D'
import type { AnatomyModelConfig } from './AnatomyModel3D'

/* MuscleModel3D — the Muscles lesson's 3D explorer. Model: the right
 * biceps brachii, both heads, segmented from a whole-body MRI —
 * BodyParts3D (Database Center for Life Science), short head FMA37682 /
 * element FJ1512 + long head FMA37683 / element FJ1478, CC BY 4.0
 * (see public/assets/models/SOURCES.md). Welded, fragments dropped,
 * Taubin-smoothed where it stayed stable (the long head diverged under
 * Taubin — 9.5 mm bound drift — so it ships unsmoothed), centred and
 * normalised. Orientation verified visually before labelling (see the run
 * log): origins at top (+Y), common tendon at bottom (−Y), anterior faces
 * +Z, long head lateral. Label anchors snapped to the mesh surface
 * (nearest-vertex). Motion is 'contract': the mesh is a static
 * segmentation, so the explorer slowly shortens and bulges the belly —
 * one curl every ~4 s, the same rhythm as the 2D lab's slow curl — and
 * the caption says so. Honest gap: BodyParts3D publishes no tendon
 * detail — the model shows the muscle bellies and their tendons as
 * smooth surfaces, not fibre bundles. */

const MUSCLE_CONFIG: AnatomyModelConfig = {
  modelUrl: '/assets/models/muscle.glb',
  labels: [
    { name: 'Long head', pos: [-0.128, 0.19, 0.101] },
    { name: 'Short head', pos: [0.041, -0.13, 0.051] },
    { name: 'Biceps tendon', pos: [-0.209, -0.874, -0.026] },
    { name: 'Origin — long head', pos: [0.162, 0.976, -0.007] },
    { name: 'Origin — short head', pos: [0.211, 0.865, 0.061] },
  ],
  color: 0xc2503f,
  roughness: 0.42,
  clearcoat: 0.35,
  envIntensity: 0.7,
  keyIntensity: 2.2,
  mode: 'contract',
  motionLabel: 'Contract',
  kicker: '3D EXPLORER · THREE.JS · DRAG TO ROTATE',
  caption:
    'The biceps brachii itself, segmented from a whole-body MRI: the long head (lateral, reaching over the shoulder) and the short head (medial, from the coracoid process) running side by side and joining into one tendon toward the elbow. This is a static scan, so the slow shortening and bulging stands in for the contraction — the 2D lab shows the real cycle, sarcomere by sarcomere. Turn it over: the two heads split apart at the top, where their tendons head for two different origins.',
  credit:
    '3D model: BodyParts3D, © The Database Center for Life Science · CC BY 4.0 International · short head FMA37682 (FJ1512) + long head FMA37683 (FJ1478) from the isa_BP3D_4.0_obj_99 dataset · cleaned & optimised for the web',
  home: [0, 0, 4.2],
  initialRotY: 0.35,
}

export default function MuscleModel3D({ bare = false }: { bare?: boolean }) {
  return <AnatomyModel3D config={MUSCLE_CONFIG} bare={bare} />
}
