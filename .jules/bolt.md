## 2024-05-23 - Three.js Material Pooling
**Learning:** Creating new material instances (e.g., `new MeshStandardMaterial`) inside a loop for identical objects creates significant memory and CPU overhead. Even if they share the same shader program, Three.js treats them as unique states, increasing draw call setup time.
**Action:** Always pre-create shared material instances in a pool (e.g., `Map<Color, Material>`) and reuse them when creating meshes, unless unique properties (like dynamic textures or specific uniforms) are required for each instance.
