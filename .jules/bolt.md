## 2026-02-03 - Three.js Material Instantiation in Loops
**Learning:** Instantiating new materials (MeshStandardMaterial, SpriteMaterial) inside a loop for particle generation causes significant CPU overhead and memory usage, even if properties are identical.
**Action:** Implement material pooling: create a set of shared material instances outside the loop and reuse them for particles with matching properties (e.g., color or texture).
