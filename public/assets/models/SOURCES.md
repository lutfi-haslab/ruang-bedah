# 3D models — sources & licenses

| File | Subject | Source | License |
| --- | --- | --- | --- |
| heart.glb | Human heart, external anatomy | "Realistic Human Heart" by neshallads — commons.wikimedia.org/wiki/File:3D_model_of_a_human_heart.stl | CC BY 4.0 |
| lungs.glb | Human lung pair (Visible Human, female) | commons.wikimedia.org/wiki/File:Vh-f-lung.stl | CC BY 4.0 |
| liver.glb | Human liver (Visible Human, male) | commons.wikimedia.org/wiki/File:Vh-m-liver.stl | CC BY 4.0 |
| airway.glb | Human trachea with larynx (Visible Human, male) | commons.wikimedia.org/wiki/File:3d-vh-m-trachea.stl | Public domain |

Liver processing (2026-11-19): single component, 60k faces — no decimation
needed; merged vertices, Taubin-smoothed (18 iterations), smooth normals,
centred + normalised → GLB (1.1 MB). Orientation verified visually before
labelling: +Z is anterior (smooth diaphragmatic surface, falciform ligament),
anatomical right = −X (big lobe), left = +X (tapering point). Label anchors
verified against renders from six sides plus a marker overlay: the fossa and
porta hepatis anchors were snapped to the surface after first floating off
it. The gallbladder is not part of the mesh — it sits in the fossa, which the
explorer labels. Motion is a breathing pulse (the liver rides the diaphragm).

Airway processing (2026-11-17): kept all 10 components (44k faces, no
decimation needed), merged vertices, smooth normals, rotated −21.2° about X
to straighten the scan's lean to anatomical upright, centred + normalised
→ GLB (1.0 MB). Orientation verified visually: front (+Z) is anterior —
the C-shaped cartilage rings wrap the front; the flat membranous wall
faces posterior. Note: no openly licensed trachea + bronchial-tree model
exists on Commons (the Visible Human bronchi files are fragmented ring
pieces, checked and rejected), so the explorer shows the trachea itself,
which ends right at the carina.

Lungs processing (2026-11-16): dropped fragments < 1,500 faces, decimated to
110k faces, re-welded, Taubin-smoothed (18 iterations), smooth normals,
exported as GLB (2.6 MB). Anatomical right = model −X (three lobes),
left = +X (cardiac notch) — verified visually before labelling.

Processing applied (2026-11-16): STL → merged vertices, one subdivision pass,
smooth vertex normals, centred and normalised, exported as GLB (2.1 MB).
Rendered with Three.js in the Heart lesson's 3D Explorer.

Like the reference images, this binary is deployed to Cloudflare Pages but
is not part of the GitHub snapshot push (text only).
