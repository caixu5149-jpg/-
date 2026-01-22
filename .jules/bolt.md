## 2026-01-22 - Three.js Material Pooling
**Learning:** Creating unique Material instances for identical particles prevents WebGL state batching and increases CPU overhead, even if they share geometries/textures.
**Action:** Always pool Material instances for non-instanced particles that share appearance properties.
