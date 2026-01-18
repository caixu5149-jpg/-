## 2024-05-22 - Material Pooling in Three.js
**Learning:** Creating new `Material` instances for every object (even if identical) is a massive performance anti-pattern in Three.js, leading to high draw calls and memory usage.
**Action:** Always reuse material instances when properties are identical. For `InstancedMesh` usage isn't possible (e.g. diverse geometries or individual animations), shared Materials are the next best thing.
