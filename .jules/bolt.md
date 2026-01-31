## 2024-10-24 - Three.js Material Instantiation
**Learning:** Creating `MeshStandardMaterial` or `SpriteMaterial` instances inside a loop defeats WebGL batching and causes high CPU overhead from state switching.
**Action:** Always pool materials. For variety, pre-generate a set of material instances (e.g., mapped to a color palette) and reuse them by reference.
