## 2024-05-22 - Material Reuse in Three.js
**Learning:** Instantiating new materials (e.g., `MeshStandardMaterial`, `SpriteMaterial`) inside a loop for particles creates significant overhead (memory and WebGL state changes), even if the properties are identical.
**Action:** Always pre-create and cache material instances when particles share the same visual properties (color, texture), only creating unique instances when individual material property animation is required.
