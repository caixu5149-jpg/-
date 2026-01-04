# Bolt's Journal

## 2024-05-22 - Material Instancing Pattern
**Learning:** Creating new `Material` instances inside a particle loop prevents Three.js from automatically instancing draw calls and increases memory usage. Even if geometries are shared, unique materials break batching.
**Action:** Always pre-create materials for particle systems if the properties (like color/texture) are from a limited set. Use `mesh.material = sharedMaterial` instead of `new Material()`.
