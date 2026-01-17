# Bolt's Journal

## 2024-05-22 - Material Instancing Pattern
**Learning:** The codebase generates hundreds of identical materials in a loop instead of sharing instances. This significantly increases memory usage and draw call overhead (state switching).
**Action:** When seeing repetitive object creation with identical properties in a loop (like particles), always look for opportunities to pool/share the resource (Material, Geometry).
