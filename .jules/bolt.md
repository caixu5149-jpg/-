## 2024-05-22 - Three.js Material Pooling
**Learning:** Shared WebGL programs (low `renderer.info.programs` count) do not eliminate CPU overhead from state switching; pooling material instances is required to minimize this cost.
**Action:** Always pool materials by parameters (color, texture) when creating many objects, even if they share the same geometry/shader.
