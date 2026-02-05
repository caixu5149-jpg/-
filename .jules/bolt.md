## 2024-05-22 - Three.js Material Pooling
**Learning:** Shared WebGL programs (low `renderer.info.programs` count) do not eliminate CPU overhead from state switching; pooling material instances is required to minimize this cost.
**Action:** When creating many objects with identical properties, always reuse `Material` instances instead of creating new ones, even if they share the same shader program.
