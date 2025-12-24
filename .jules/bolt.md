# Bolt's Journal

## 2024-05-22 - Material Instancing Pattern
**Learning:** The previous implementation created a new `MeshStandardMaterial` for every single particle in the loop (700x), even though there were only 5 color variations. This causes excessive WebGL state changes and memory overhead.
**Action:** Always look for opportunities to pre-create and share materials when variations are limited (like colors from a fixed palette). Use `InstancedMesh` if geometry is also identical, but shared materials is a good first step when geometry varies.
