# Bolt's Journal

## 2024-05-22 - Material Instancing
**Learning:** In Three.js, creating new Materials for every mesh is a common anti-pattern, even if they share properties. This causes unnecessary shader program compilations and state changes.
**Action:** Always check if materials can be shared/instanced, especially for particle systems where properties (like color) are limited to a discrete set.
