## 2024-05-23 - Material Pooling for Particles
**Learning:** Three.js `MeshStandardMaterial` and `SpriteMaterial` instances are heavy. Creating unique instances for hundreds of particles that share the same properties (color, texture) drastically increases memory usage and draw call overhead (due to state switching).
**Action:** Always check if materials can be reused/pooled, especially for particle systems or repeated geometry. Implemented caching by color/texture index reduced unique materials from 700 to ~13.
