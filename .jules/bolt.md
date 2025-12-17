## 2024-12-17 - Material Reuse in Three.js
**Learning:** Instantiating new Materials inside a loop (even if identical params) causes unnecessary overhead and prevents WebGL state optimization.
**Action:** Always pre-create Material instances when properties (like color/texture) come from a finite set, and share them across Meshes.
