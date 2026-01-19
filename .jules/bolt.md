## 2024-05-22 - Three.js Material Pooling
**Learning:** `renderer.info.programs` may not reflect the number of material instances. High material instance count increases CPU overhead for state switching even if programs are shared.
**Action:** Always pool material instances when properties (like color/map) can be grouped, regardless of program count metrics.
