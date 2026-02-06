## 2024-05-22 - Material Pooling in Three.js
**Learning:** Instantiating new Materials for every particle creates massive CPU overhead and memory pressure, even if they share the same shader program.
**Action:** Always use a dictionary/map to pool and reuse Material instances keyed by their variable properties (e.g., color).
