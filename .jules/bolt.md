# Bolt's Journal

## 2024-05-22 - Material Instancing Pattern
**Learning:** Three.js materials are heavy objects. Creating them in a loop (even if they look identical) causes unique shader program compilations and WebGL state changes, killing performance.
**Action:** Always pre-create and share materials when properties are identical. Use `InstancedMesh` for massive counts (>1000), but shared materials are a good first step for smaller sets (hundreds).

## 2024-05-22 - Photo Particle Constraint
**Learning:** The memory stated "photo particles retain unique materials". This is crucial because photos have unique textures (`map` property) and unique easing behaviors.
**Action:** When refactoring for shared materials, explicitly exclude or handle dynamic materials (like user-uploaded photos) separately to maintain functionality.
