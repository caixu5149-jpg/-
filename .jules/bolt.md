# Bolt's Journal

## 2024-05-22 - Material Pooling for Particles
**Learning:** Three.js performance is heavily dependent on the number of draw calls and unique materials. Creating a new material for every object, even if identical, prevents the engine from batching draw calls and increases memory overhead.
**Action:** Always check if materials can be shared when creating many similar objects. Pool materials by their unique properties (e.g., color, texture).
