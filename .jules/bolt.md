## 2026-02-04 - Three.js Material Pooling
**Learning:** Shared WebGL programs (low `renderer.info.programs` count) do not eliminate CPU overhead from state switching; pooling material instances is required to minimize this cost.
**Action:** Always pool material instances when creating many similar objects in Three.js, especially inside loops.
