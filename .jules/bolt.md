## 2024-05-22 - Material Pooling in Three.js
**Learning:** Creating a new Material instance for every object in a particle system causes significant CPU overhead and memory usage, even if they share properties.
**Action:** Pool and reuse Material instances when objects share the same visual properties (color, texture, etc.).
