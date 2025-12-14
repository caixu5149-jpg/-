## 2024-05-23 - Material Reuse in Three.js
**Learning:** Instantiating new materials (e.g., `MeshStandardMaterial`, `SpriteMaterial`) inside a loop for particles significantly increases memory usage and draw call overhead (state switching) if the materials are identical or share most properties.
**Action:** Always pre-create material instances when possible and reuse them across multiple meshes, especially for particle systems where many objects share the same visual properties.
