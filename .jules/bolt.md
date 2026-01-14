## 2024-05-22 - Material Pooling for Particles
**Learning:** The application was creating 700 unique `MeshStandardMaterial` instances for particles that only differed by 5 colors. This caused unnecessary WebGL state changes and memory overhead.
**Action:** Implemented a simple material cache keyed by color (for meshes) and index (for sprites). Always check `for` loops in Three.js for redundant object instantiation.
