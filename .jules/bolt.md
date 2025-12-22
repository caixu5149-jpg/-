## 2024-05-23 - Material Instantiation Strategy
**Learning:** In Three.js, sharing material instances (especially Standard materials) across hundreds of identical meshes drastically reduces GPU state changes and memory overhead.
**Action:** Always pre-create materials when properties (color, roughness, etc.) are shared across many objects.
