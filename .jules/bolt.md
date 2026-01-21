## 2024-05-23 - Material Pooling Necessity
**Learning:** `createParticles` was generating 700 unique `MeshStandardMaterial` and `SpriteMaterial` instances for particles that only differed by transform. This caused massive GPU memory and draw call overhead.
**Action:** Implemented material pooling keyed by color (for meshes) and texture (for sprites). Reduced unique materials from ~700 to ~13. Future particle systems must reuse materials.
