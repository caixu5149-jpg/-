## 2026-01-16 - Particle System Material Pooling
**Learning:** Creating unique materials for every particle in a loop causes excessive WebGL state changes and memory overhead (~700 materials vs 13).
**Action:** Pool and reuse materials for particles that share the same visual properties (color/texture).
