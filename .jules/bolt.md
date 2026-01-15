## 2024-03-24 - Material Pooling for Three.js
**Learning:** Creating new `Material` instances (e.g., `MeshStandardMaterial`) inside a render loop or initialization loop for identical objects creates significant memory overhead and prevents the renderer from optimizing state changes (draw calls).
**Action:** Always identify shared visual properties (color, texture) and pre-create material instances outside the loop. Use these shared instances when creating meshes.
