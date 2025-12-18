# Bolt's Journal ⚡

## 2024-05-22 - Material Instancing in Three.js
**Learning:** In Three.js, creating a new `Material` instance for every object, even if they share properties, prevents WebGL from batching draw calls efficiently and increases memory usage.
**Action:** Always pre-create shared materials for objects that have identical appearance properties (color, texture, roughness, etc.) and reuse them across meshes. Only create unique materials when per-object properties (like `emissive` animation on a specific instance) are required.
