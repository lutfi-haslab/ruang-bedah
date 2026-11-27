import AnatomyModel3D from './AnatomyModel3D'
import type { AnatomyModelConfig } from './AnatomyModel3D'

/* KidneyModel3D — the Nephron lesson's 3D explorer. Model: the right
 * kidney of the Visible Human male (Vh-m-kidney-r.stl), CC BY 4.0 (see
 * public/assets/models/SOURCES.md). The STL holds 15 components; only
 * comp 1 — the outer kidney surface, 15,768 faces — is used (see the run
 * log for the rejected components). Welded, Taubin-smoothed (18 iters,
 * drift 2.05 mm), rotated +27.1° about X to straighten the long axis,
 * centred and normalised. Orientation verified visually before labelling:
 * +Y is superior, +Z is anterior, the hilum faces +X (medial —
 * anatomical left for this right kidney), −X is the convex lateral
 * border. Label anchors snapped to the surface (nearest-vertex).
 * initialRotY is −0.5 (not the usual +0.35): negative turns the +X hilum
 * face toward the viewer so the sinus is visible in the initial ¾ view.
 * Motion is 'sway' — a slow turn, since a kidney neither beats nor
 * breathes. Honest gaps: the mesh is the outer surface only — the renal
 * artery, renal vein and ureter are not segmented, so their labels mark
 * the hilum rim where each enters or exits; the renal pelvis label marks
 * the sinus opening it occupies, and the medulla label marks the papillae
 * visible through the sinus. The nephron itself (~1 mm long) is not in
 * this mesh — the 2D lab zooms into a single nephron instead. The hilum
 * itself has no chip: its four neighbours (artery, vein, pelvis, ureter)
 * sit so close together on the rim that a fifth chip piled on top of them
 * and was unreadable — the caption names the hilum instead. */

const KIDNEY_CONFIG: AnatomyModelConfig = {
  modelUrl: '/assets/models/kidney.glb',
  labels: [
    { name: 'Renal cortex', pos: [-0.448, 0.155, 0.096] },
    { name: 'Renal medulla', pos: [0.113, -0.025, -0.04] },
    { name: 'Renal pelvis', pos: [0.285, -0.042, 0.104] },
    { name: 'Renal artery', pos: [0.338, 0.283, 0.099] },
    { name: 'Renal vein', pos: [0.345, 0.055, 0.169] },
    { name: 'Ureter', pos: [0.357, -0.384, 0.059] },
  ],
  color: 0x8a2f3c,
  roughness: 0.38,
  clearcoat: 0.5,
  envIntensity: 0.6,
  keyIntensity: 2.4,
  mode: 'sway',
  motionLabel: 'Slow turn',
  kicker: '3D EXPLORER · THREE.JS · DRAG TO ROTATE',
  caption:
    'A real right kidney, segmented from the Visible Human male: the bean-shaped organ your nephrons live inside, about 11 cm long. The cortex is the outer shell you are looking at; the medulla sits beneath it, its papillae peeking out through the hilum — the notch on the kidney’s medial side, where the renal artery enters, the renal vein leaves, and the ureter carries urine away to the bladder. The renal pelvis, the funnel that collects urine from the medulla, occupies the hollow sinus behind the hilum. A kidney neither beats nor breathes, so the explorer turns slowly instead. Two honest limits: the artery, vein and ureter are not part of this scan — their labels mark where each enters or exits at the hilum — and the nephron itself, about a millimetre long, is far too small to see here; the 2D lab zooms into a single nephron instead.',
  credit:
    '3D model: Visible Human male, right kidney (Vh-m-kidney-r.stl), Wikimedia Commons · CC BY 4.0 · cleaned & optimised for the web',
  home: [0, 0, 4.2],
  initialRotY: -0.5,
}

export default function KidneyModel3D({ bare = false }: { bare?: boolean }) {
  return <AnatomyModel3D config={KIDNEY_CONFIG} bare={bare} />
}
