## 2026-01-29 - [Three.js Material Pooling]
**Learning:** Instantiating `MeshStandardMaterial` in a loop for identical objects creates unique shader programs and breaks batching, causing massive memory overhead (~700 materials vs 13).
**Action:** Always cache and reuse materials when creating procedural particles if properties (like color) are shared.
