## 2024-05-22 - [Three.js Material Pooling]
**Learning:** Instantiating Three.js materials in a loop creates unique WebGL programs or heavy state overhead, even if parameters are identical. Pooling materials by unique properties (like color/texture) reduces draw call overhead significantly.
**Action:** Always check loop-based object creation for reusable Three.js resources (Geometries, Materials).
