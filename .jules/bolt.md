## 2026-01-25 - Material Instantiation Explosion
**Learning:** Creating unique `MeshStandardMaterial` instances for hundreds of particles prevents batching and increases CPU/GPU overhead, even if they share identical properties.
**Action:** Always pool and reuse material instances when properties (like color/texture) have a limited set of variations.
