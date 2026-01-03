## 2024-05-23 - Material Pooling in Three.js
**Learning:** Instantiating new materials (e.g., `MeshStandardMaterial`) inside a loop for particles significantly increases memory usage and draw call overhead (due to state switching), even if they share properties.
**Action:** Use material pooling (flyweight pattern) for objects that share visual properties (color, texture). Pre-create materials and reuse instances. Ensure unique state (like highlighting) is handled by cloning or using unique materials only when necessary (like "copy on write").
