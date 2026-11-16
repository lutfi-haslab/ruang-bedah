# 3D models — sources & licenses

| File | Subject | Source | License |
| --- | --- | --- | --- |
| heart.glb | Human heart, external anatomy | "Realistic Human Heart" by neshallads — commons.wikimedia.org/wiki/File:3D_model_of_a_human_heart.stl | CC BY 4.0 |
| lungs.glb | Human lung pair (Visible Human, female) | commons.wikimedia.org/wiki/File:Vh-f-lung.stl | CC BY 4.0 |

Lungs processing (2026-11-16): dropped fragments < 1,500 faces, decimated to
110k faces, re-welded, Taubin-smoothed (18 iterations), smooth normals,
exported as GLB (2.6 MB). Anatomical right = model −X (three lobes),
left = +X (cardiac notch) — verified visually before labelling.

Processing applied (2026-11-16): STL → merged vertices, one subdivision pass,
smooth vertex normals, centred and normalised, exported as GLB (2.1 MB).
Rendered with Three.js in the Heart lesson's 3D Explorer.

Like the reference images, this binary is deployed to Cloudflare Pages but
is not part of the GitHub snapshot push (text only).
